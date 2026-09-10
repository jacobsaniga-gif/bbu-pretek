'use strict';

/* ==========================================================
   BBU Fuel Tracker

   Dve pravidlá, ktoré tu držia všetko pokope:
   1) Po každej zmene stavu sa hneď volá save().
   2) Uplynulý čas sa nikdy nedrží v premennej ani v časovači.
      Počíta sa až v render() z Date.now() mínus uložený timestamp.
   ========================================================== */

var LS_KEY = 'bbu-fuel-v1';
var HOUR = 3600000;

var DEFAULT_TARGETS = { carbs: 70, sodium: 600, fluid: 500 };

var CATS = [
  { key: 'gel',   label: 'Gély' },
  { key: 'drink', label: 'Nápoje' },
  { key: 'solid', label: 'Tuhé' },
  { key: 'aid',   label: 'Občerstvovačka' }
];

var state = load();
var screen = 'log';

/* ---------- Stav a ukladanie ---------- */

function blank() {
  return {
    raceStart: null,
    targets: { carbs: DEFAULT_TARGETS.carbs, sodium: DEFAULT_TARGETS.sodium, fluid: DEFAULT_TARGETS.fluid },
    log: []
  };
}

function num(v, fallback) {
  var n = typeof v === 'string' ? parseFloat(v.replace(',', '.')) : v;
  return (typeof n === 'number' && isFinite(n)) ? n : fallback;
}

function validEntry(e) {
  return e && typeof e === 'object' && isFinite(e.t) && typeof e.name === 'string';
}

function normalize(raw) {
  var b = blank();
  if (!raw || typeof raw !== 'object') return b;
  var t = raw.targets || {};
  var out = {
    raceStart: isFinite(raw.raceStart) && raw.raceStart ? Number(raw.raceStart) : null,
    targets: {
      carbs: num(t.carbs, b.targets.carbs),
      sodium: num(t.sodium, b.targets.sodium),
      fluid: num(t.fluid, b.targets.fluid)
    },
    log: []
  };
  if (Array.isArray(raw.log)) {
    out.log = raw.log.filter(validEntry).map(function (e) {
      return {
        eid: e.eid ? String(e.eid) : newId(),
        itemId: e.itemId ? String(e.itemId) : '',
        name: String(e.name),
        t: Number(e.t),
        carbs: num(e.carbs, 0),
        sodium: num(e.sodium, 0),
        fluid: num(e.fluid, 0),
        kcal: num(e.kcal, 0)
      };
    });
    out.log.sort(function (a, b2) { return a.t - b2.t; });
  }
  return out;
}

function load() {
  try {
    var raw = localStorage.getItem(LS_KEY);
    if (!raw) return blank();
    return normalize(JSON.parse(raw));
  } catch (err) {
    return blank();
  }
}

function save() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch (err) {
    toast('Dáta sa neuložili. Uvoľni miesto v telefóne.');
  }
}

function newId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
}

/* ---------- Čas ---------- */

function pad(n) { return n < 10 ? '0' + n : String(n); }

function fmtHMS(ms) {
  if (!isFinite(ms) || ms < 0) ms = 0;
  var s = Math.floor(ms / 1000);
  return Math.floor(s / 3600) + ':' + pad(Math.floor((s % 3600) / 60)) + ':' + pad(s % 60);
}

function fmtSince(ms) {
  if (!isFinite(ms) || ms < 0) ms = 0;
  var s = Math.floor(ms / 1000);
  if (s < 3600) return Math.floor(s / 60) + ':' + pad(s % 60);
  return fmtHMS(ms);
}

function clock(t) {
  var d = new Date(t);
  return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
}

/* ---------- Zápis ---------- */

function logItem(item) {
  state.log.push({
    eid: newId(),
    itemId: String(item.id),
    name: String(item.name),
    t: Date.now(),
    carbs: num(item.carbs, 0),
    sodium: num(item.sodium, 0),
    fluid: num(item.fluid, 0),
    kcal: num(item.kcal, 0)
  });
  save();
  render();
  renderHistory();
}

function undo() {
  if (!state.log.length) return;
  var e = state.log.pop();
  save();
  render();
  renderHistory();
  toast('Vrátené späť: ' + e.name);
}

function delEntry(eid) {
  var before = state.log.length;
  state.log = state.log.filter(function (e) { return e.eid !== eid; });
  if (state.log.length === before) return;
  save();
  render();
  renderHistory();
}

/* ---------- Výpočty ---------- */

function totals(list) {
  var t = { carbs: 0, sodium: 0, fluid: 0, kcal: 0 };
  for (var i = 0; i < list.length; i++) {
    t.carbs += list[i].carbs;
    t.sodium += list[i].sodium;
    t.fluid += list[i].fluid;
    t.kcal += list[i].kcal;
  }
  return t;
}

function lastHour(now) {
  return state.log.filter(function (e) { return e.t > now - HOUR; });
}

/* ---------- Vykresľovanie ---------- */

var el = {};

function row(key, valueHtml, cls) {
  return '<div class="row"><span class="k">' + key + '</span>' +
         '<span class="v' + (cls ? ' ' + cls : '') + '">' + valueHtml + '</span></div>';
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function r0(n) { return String(Math.round(n)); }

function render() {
  var now = Date.now();

  /* hlavička */
  var last = state.log.length ? state.log[state.log.length - 1] : null;
  if (last) {
    el.since.textContent = fmtSince(now - last.t);
    el.sinceSub.textContent = last.name + ' o ' + clock(last.t);
  } else {
    el.since.textContent = '–:––';
    el.sinceSub.textContent = 'zatiaľ žiadny záznam';
  }
  el.undo.disabled = !last;
  el.undo.textContent = last ? ('Späť — ' + last.name) : 'Späť';

  if (screen === 'sum') renderSummary(now);
  if (screen === 'set') renderRaceState();
}

function renderSummary(now) {
  var h = totals(lastHour(now));
  var a = totals(state.log);
  var g = state.targets;

  function hourRow(label, val, target, unit) {
    var cls = (target > 0 && val >= target) ? 'ok' : 'under';
    if (target <= 0) cls = '';
    return row(label, r0(val) + ' <small>/ ' + r0(target) + ' ' + unit + '</small>', cls);
  }

  el.hourRows.innerHTML =
    hourRow('Sacharidy', h.carbs, g.carbs, 'g') +
    hourRow('Sodík', h.sodium, g.sodium, 'mg') +
    hourRow('Tekutiny', h.fluid, g.fluid, 'ml');

  el.totalRows.innerHTML =
    row('Sacharidy', r0(a.carbs) + ' <small>g</small>') +
    row('Sodík', r0(a.sodium) + ' <small>mg</small>') +
    row('Tekutiny', r0(a.fluid) + ' <small>ml</small>') +
    row('Energia', r0(a.kcal) + ' <small>kcal</small>');

  if (state.raceStart) {
    var ms = now - state.raceStart;
    var hrs = ms / HOUR;
    if (hrs < 0.05) hrs = 0.05;
    el.raceRows.innerHTML =
      row('Od štartu', fmtHMS(ms)) +
      row('Sacharidy', r0(a.carbs / hrs) + ' <small>g/h</small>') +
      row('Sodík', r0(a.sodium / hrs) + ' <small>mg/h</small>') +
      row('Tekutiny', r0(a.fluid / hrs) + ' <small>ml/h</small>') +
      row('Energia', r0(a.kcal / hrs) + ' <small>kcal/h</small>');
  } else {
    el.raceRows.innerHTML = '<div class="note">Pretek nie je odštartovaný. Štart nastavíš v Nastaveniach.</div>';
  }
}

function renderHistory() {
  if (!state.log.length) {
    el.histList.innerHTML = '<div class="note">Zatiaľ nič. Prvý zápis urobíš na obrazovke Zápis.</div>';
    return;
  }
  var out = [];
  for (var i = state.log.length - 1; i >= 0; i--) {
    var e = state.log[i];
    var sub = state.raceStart ? ('+' + fmtHMS(e.t - state.raceStart)) : '';
    out.push(
      '<div class="hist">' +
        '<span class="t">' + clock(e.t) + '<span class="s">' + sub + '</span></span>' +
        '<span class="n">' + esc(e.name) + '</span>' +
        '<button class="del" type="button" data-del="' + esc(e.eid) + '" aria-label="Zmazať záznam">✕</button>' +
      '</div>'
    );
  }
  el.histList.innerHTML = out.join('');
}

function renderRaceState() {
  if (state.raceStart) {
    var d = new Date(state.raceStart);
    el.raceStateEl.textContent = 'Štart: ' + pad(d.getDate()) + '. ' + pad(d.getMonth() + 1) + '. ' +
      d.getFullYear() + ' o ' + clock(state.raceStart) + ' · beží ' + fmtHMS(Date.now() - state.raceStart);
    el.btnStart.textContent = 'Prestaviť štart na teraz';
  } else {
    el.raceStateEl.textContent = 'Pretek nie je odštartovaný.';
    el.btnStart.textContent = 'Štart preteku';
  }
}

function renderTargets() {
  el.tCarbs.value = state.targets.carbs;
  el.tSodium.value = state.targets.sodium;
  el.tFluid.value = state.targets.fluid;
}

/* ---------- Mriežka položiek ---------- */

function buildGrid() {
  if (typeof ITEMS === 'undefined' || !Array.isArray(ITEMS) || !ITEMS.length) {
    el.cats.innerHTML = '<div class="note">V items.js nie sú žiadne položky.</div>';
    return;
  }

  var order = CATS.slice();
  var known = {};
  order.forEach(function (c) { known[c.key] = true; });
  ITEMS.forEach(function (it) {
    if (!known[it.cat]) { known[it.cat] = true; order.push({ key: it.cat, label: String(it.cat) }); }
  });

  var html = '';
  order.forEach(function (c) {
    var list = ITEMS.filter(function (it) { return it.cat === c.key; });
    if (!list.length) return;
    html += '<div class="cat-title">' + esc(c.label) + '</div><div class="grid">';
    list.forEach(function (it) {
      var meta = [];
      if (num(it.carbs, 0)) meta.push(r0(num(it.carbs, 0)) + ' g');
      if (num(it.fluid, 0)) meta.push(r0(num(it.fluid, 0)) + ' ml');
      if (num(it.sodium, 0)) meta.push(r0(num(it.sodium, 0)) + ' mg');
      html += '<button class="item" type="button" data-id="' + esc(it.id) + '">' +
                '<span class="n">' + esc(it.name) + '</span>' +
                '<span class="m">' + (meta.join(' · ') || '—') + '</span>' +
              '</button>';
    });
    html += '</div>';
  });
  el.cats.innerHTML = html;
}

/* ---------- Toast ---------- */

var toastTimer = null;

function toast(msg) {
  el.toast.textContent = msg;
  el.toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.toast.classList.add('hidden'); }, 1800);
}

/* ---------- Prepínanie obrazoviek ---------- */

function go(name) {
  screen = name;
  ['log', 'sum', 'hist', 'set'].forEach(function (k) {
    document.getElementById('screen-' + k).classList.toggle('hidden', k !== name);
  });
  Array.prototype.forEach.call(el.nav.querySelectorAll('button'), function (b) {
    b.classList.toggle('on', b.getAttribute('data-go') === name);
  });
  if (name === 'hist') renderHistory();
  if (name === 'set') renderTargets();
  window.scrollTo(0, 0);
  render();
}

/* ---------- Štart / reset / ciele ---------- */

function startRace() {
  if (state.raceStart && !confirm('Štart je už nastavený. Prepísať ho na aktuálny čas?')) return;
  state.raceStart = Date.now();
  save();
  render();
  renderHistory();
  toast('Štart nastavený');
}

function resetRace() {
  if (!confirm('Zmazať všetky záznamy aj štart preteku? Toto sa nedá vrátiť.')) return;
  if (!confirm('Naozaj? Posledné potvrdenie.')) return;
  var keep = state.targets;
  state = blank();
  state.targets = keep;
  save();
  renderTargets();
  render();
  renderHistory();
  toast('Vymazané');
}

function bindTarget(input, key) {
  input.addEventListener('input', function () {
    var v = num(input.value, NaN);
    if (isFinite(v) && v >= 0) {
      state.targets[key] = v;
      save();
      if (screen === 'sum') render();
    }
  });
  input.addEventListener('blur', function () {
    if (!isFinite(num(input.value, NaN)) || num(input.value, -1) < 0) {
      input.value = state.targets[key];
    }
  });
}

/* ---------- Export / import ---------- */

function doExport() {
  el.exportBox.value = JSON.stringify(state, null, 2);
  el.exportBox.focus();
  el.exportBox.setSelectionRange(0, el.exportBox.value.length);
  toast('Vyber text a skopíruj ho');
}

function doCopy() {
  if (!el.exportBox.value) doExport();
  var ok = false;
  try {
    el.exportBox.focus();
    el.exportBox.setSelectionRange(0, el.exportBox.value.length);
    ok = document.execCommand('copy');
  } catch (err) { ok = false; }
  if (!ok && navigator.clipboard) {
    navigator.clipboard.writeText(el.exportBox.value).then(function () { toast('Skopírované'); },
      function () { toast('Skopíruj text ručne'); });
    return;
  }
  toast(ok ? 'Skopírované' : 'Skopíruj text ručne');
}

function doImport() {
  var txt = el.importBox.value.trim();
  if (!txt) { toast('Vlož JSON do poľa'); return; }
  var parsed;
  try {
    parsed = JSON.parse(txt);
  } catch (err) {
    toast('Neplatný JSON');
    return;
  }
  var next = normalize(parsed);
  if (!confirm('Nahradiť aktuálne dáta? Načíta sa ' + next.log.length + ' záznamov.')) return;
  state = next;
  save();
  renderTargets();
  render();
  renderHistory();
  el.importBox.value = '';
  toast('Importované: ' + state.log.length + ' záznamov');
}

/* ---------- Štart appky ---------- */

function init() {
  el.since = document.getElementById('since');
  el.sinceSub = document.getElementById('since-sub');
  el.undo = document.getElementById('undo');
  el.cats = document.getElementById('cats');
  el.hourRows = document.getElementById('hour-rows');
  el.totalRows = document.getElementById('total-rows');
  el.raceRows = document.getElementById('race-rows');
  el.histList = document.getElementById('hist-list');
  el.raceStateEl = document.getElementById('race-state');
  el.btnStart = document.getElementById('btn-start');
  el.tCarbs = document.getElementById('t-carbs');
  el.tSodium = document.getElementById('t-sodium');
  el.tFluid = document.getElementById('t-fluid');
  el.exportBox = document.getElementById('export-box');
  el.importBox = document.getElementById('import-box');
  el.nav = document.getElementById('nav');
  el.toast = document.getElementById('toast');

  buildGrid();
  renderTargets();
  renderHistory();

  /* zápis položky */
  el.cats.addEventListener('click', function (ev) {
    var btn = ev.target.closest ? ev.target.closest('.item') : null;
    if (!btn) return;
    var id = btn.getAttribute('data-id');
    var item = null;
    for (var i = 0; i < ITEMS.length; i++) { if (String(ITEMS[i].id) === id) { item = ITEMS[i]; break; } }
    if (!item) return;
    logItem(item);
    btn.classList.add('flash');
    setTimeout(function () { btn.classList.remove('flash'); }, 1000);
  });

  el.undo.addEventListener('click', undo);

  /* mazanie z histórie */
  el.histList.addEventListener('click', function (ev) {
    var btn = ev.target.closest ? ev.target.closest('.del') : null;
    if (!btn) return;
    delEntry(btn.getAttribute('data-del'));
  });

  /* navigácia */
  el.nav.addEventListener('click', function (ev) {
    var btn = ev.target.closest ? ev.target.closest('button[data-go]') : null;
    if (!btn) return;
    go(btn.getAttribute('data-go'));
  });

  document.getElementById('btn-start').addEventListener('click', startRace);
  document.getElementById('btn-reset').addEventListener('click', resetRace);
  document.getElementById('btn-export').addEventListener('click', doExport);
  document.getElementById('btn-copy').addEventListener('click', doCopy);
  document.getElementById('btn-import').addEventListener('click', doImport);

  bindTarget(el.tCarbs, 'carbs');
  bindTarget(el.tSodium, 'sodium');
  bindTarget(el.tFluid, 'fluid');

  document.getElementById('app-ver').textContent = 'BBU Fuel Tracker · dáta v localStorage tohto zariadenia';

  go('log');

  /* prekresľovanie: interval + návrat do appky */
  setInterval(render, 30000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) render();
  });
  window.addEventListener('pageshow', render);

  /* service worker */
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(function () {});
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
