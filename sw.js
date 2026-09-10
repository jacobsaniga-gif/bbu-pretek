/* ==========================================================
   Service worker

   PRI KAŽDOM DEPLOYI ZVÝŠ ČÍSLO V CACHE (bbu-v1 -> bbu-v2 -> ...).
   Bez toho ti telefón bude ťahať starú verziu z cache.
   ========================================================== */

const CACHE = 'bbu-v1';

const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './items.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil((async function () {
    const cache = await caches.open(CACHE);
    // allSettled: keď ešte nemáš doplnené ikony, inštalácia sa aj tak dokončí
    await Promise.allSettled(ASSETS.map(function (url) { return cache.add(url); }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    const keys = await caches.keys();
    await Promise.all(keys.map(function (key) {
      return key === CACHE ? null : caches.delete(key);
    }));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', function (event) {
  const req = event.request;
  if (req.method !== 'GET') return;

  // cache-first: offline je základný režim, nie výnimka
  event.respondWith((async function () {
    const cached = await caches.match(req, { ignoreSearch: true });
    if (cached) return cached;

    try {
      return await fetch(req);
    } catch (err) {
      if (req.mode === 'navigate') {
        const fallback = await caches.match('./index.html');
        if (fallback) return fallback;
      }
      return new Response('Offline', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }
  })());
});
