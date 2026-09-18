/* Po KAŽDEJ zmene ktoréhokoľvek súboru zvýš toto číslo (bbu-v2, bbu-v3, ...).
   Inak ti telefón bude ďalej servírovať starú verziu. */
var CACHE = 'bbu-v2';

var ASSETS = [
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

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

// Najprv cache, sieť len ako záloha. Appka nič nesťahuje, takže offline
// sa správa presne rovnako ako online.
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      return hit || fetch(e.request);
    })
  );
});
