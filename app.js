/* =========================================================================
   BBU Fuel — sledovanie príjmu počas ultra

   ZÁSADA: nič sa nepočíta bežiacim časovačom. Každé číslo vzniká až pri
   vykreslení ako rozdiel Date.now() mínus uložený timestamp. Vďaka tomu je
   jedno, či bola appka zavretá dve minúty alebo šesť hodín — iOS uspí
   JavaScript, ale hodiny bežia ďalej.
   ========================================================================= */

(function () {
'use strict';

var STORAGE_KEY = 'bbu-fuel';
var HOUR = 3600000;

var CATS = [
  { key: 'gel',   title: 'Gély a tuby' },
  { key: 'drink', title: 'Vlastné nápoje' },
  { key: 'solid', title: 'Tuhé jedlo z vesty' },
  { key: 'aid',   title: 'Občerstvovačka' }
];

var DEFAULTS = {
  carbsPerHour: 70,
  sodiumPerHour: 600,
  fluidPerHour: 500,
  caffeineMax: 400
};

/* ---------------------------------------------------------------- stav */

var state;

function defaultState() {
  return { v: 1, raceStartedAt: null, targets: copy(DEFAULTS), log: [] };
}

function copy(o) {
  var out = {}, k;
  for (k in o) if (Object.prototype.hasOwnProperty.call(o, k)) out[k] = o[k];
  return out;
}

function load() {
  var raw = null;
  try { raw = localStorage.getItem(STORAGE_KEY); } catch (e) { raw = null; }

  if (!raw) { state = defaultState(); return; }

  try { state = JSON.parse(raw); }
  catch (e) { state = defaultState(); return; }

  // doplnenie chýbajúcich polí, aby staršie uložené dáta nespadli
  if (!state || typeof state !== 'object') { state = defaultState(); return; }
  if (!Array.isArray(state.log)) state.log = [];
  if (!state.targets) state.targets = {};
  for (var k in DEFAULTS) {
    if (state.targets[k] === undefined || state.targets[k] === null) {
      state.targets[k] = DEFAULTS[k];
    }
  }
  if (state.raceStartedAt === undefined) state.raceStartedAt = null;
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (e) { toast('Ukladanie zlyhalo'); }
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ------------------------------------------------------------- výpočty */

function itemById(id) {
  var list = window.ITEMS || [];
  for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
  return null;
}

function sumField(entries, field) {
  var total = 0;
  for (var i = 0; i < entries.length; i++) {
    var it = itemById(entries[i].itemId);
    if (it && it[field]) total += it[field] * entries[i].qty;
  }
  return total;
}

function total(field) {
  return sumField(state.log, field);
}

function lastHour(field) {
  var from = Date.now() - HOUR;
  var recent = [];
  for (var i = 0; i < state.log.length; i++) {
    if (state.log[i].ts > from) recent.push(state.log[i]);
  }
  return sumField(recent, field);
}

// hodín od štartu; null ak pretek ešte nebeží
function hoursElapsed() {
  if (!state.raceStartedAt) return null;
  var h = (Date.now() - state.raceStartedAt) / HOUR;
  return h > 0 ? h : 0;
}

// záporné = zaostávaš za plánom
function deficit(field, perHour) {
  var h = hoursElapsed();
  if (h === null || h <= 0) return null;
  return total(field) - perHour * h;
}

// v prvej hodine preteku je cieľ za okno menší, inak by to hlásilo falošný poplach
function hourTarget(perHour) {
  var h = hoursElapsed();
  if (h === null) return perHour;
  return h < 1 ? Math.round(perHour * h) : perHour;
}

function minsSince(test) {
  var last = null;
  for (var i = 0; i < state.log.length; i++) {
    if (test(state.log[i])) {
      if (last === null || state.log[i].ts > last) last = state.log[i].ts;
    }
  }
  if (last === null) return null;
  return Math.floor((Date.now() - last) / 60000);
}

function hasCaffeine(entry) {
  var it = itemById(entry.itemId);
  return !!(it && it.caffeine > 0);
}

/* ------------------------------------------------------------ formáty */

function fmtDuration(mins) {
  if (mins === null) return '–';
  if (mins < 60) return mins + ' min';
  return Math.floor(mins / 60) + ':' + pad(mins % 60);
}

function fmtClock(ts) {
  var d = new Date(ts);
  return pad(d.getHours()) + ':' + pad(d.getMinutes());
}

function pad(n) { return n < 10 ? '0' + n : '' + n; }

function fmtSigned(n, unit) {
  if (n === null) return '–';
  var r = Math.round(n);
  return (r > 0 ? '+' : '') + r + ' ' + unit;
}

function el(id) { return document.getElementById(id); }

function setText(id, value) {
  var node = el(id);
  if (node) node.textContent = value;
}

/* ----------------------------------------------------------- vykreslenie */

function render() {
  var t = state.targets;

  /* --- hero --- */
  var since = minsSince(function () { return true; });
  setText('sinceLast', since === null ? '–' : fmtDuration(since));
  setText('sinceLast2', since === null ? '–' : fmtDuration(since));

  var hc = lastHour('carbs'), hs = lastHour('sodium'), hf = lastHour('fluid');
  setText('stripCarbs', Math.round(hc) + ' g');
  setText('stripSodium', Math.round(hs) + ' mg');
  setText('stripFluid', Math.round(hf) + ' ml');

  paint('stripCarbs',  hc >= hourTarget(t.carbsPerHour)  * 0.8);
  paint('stripSodium', hs >= hourTarget(t.sodiumPerHour) * 0.8);
  paint('stripFluid',  hf >= hourTarget(t.fluidPerHour)  * 0.8);

  /* --- hodiny preteku --- */
  var h = hoursElapsed();
  setText('raceClock', h === null ? '–' : fmtDuration(Math.floor(h * 60)));

  /* --- zaostávanie --- */
  var dc = deficit('carbs', t.carbsPerHour);
  var ds = deficit('sodium', t.sodiumPerHour);
  var df = deficit('fluid', t.fluidPerHour);

  setText('defCarbs', fmtSigned(dc, 'g'));
  setText('defSodium', fmtSigned(ds, 'mg'));
  setText('defFluid', fmtSigned(df, 'ml'));
  paint('defCarbs', dc === null || dc >= 0);
  paint('defSodium', ds === null || ds >= 0);
  paint('defFluid', df === null || df >= 0);

  setText('subCarbs', h === null ? 'pretek nebeží' : 'plán ' + Math.round(t.carbsPerHour * h) + ' g');
  setText('subSodium', h === null ? 'pretek nebeží' : 'plán ' + Math.round(t.sodiumPerHour * h) + ' mg');
  setText('subFluid', h === null ? 'pretek nebeží' : 'plán ' + Math.round(t.fluidPerHour * h) + ' ml');

  /* --- posledná hodina --- */
  setText('hCarbs',  Math.round(hc) + ' / ' + hourTarget(t.carbsPerHour) + ' g');
  setText('hSodium', Math.round(hs) + ' / ' + hourTarget(t.sodiumPerHour) + ' mg');
  setText('hFluid',  Math.round(hf) + ' / ' + hourTarget(t.fluidPerHour) + ' ml');

  /* --- kofeín --- */
  var caff = total('caffeine');
  setText('caffTotal', Math.round(caff) + ' / ' + t.caffeineMax + ' mg');
  setText('caffSince', fmtDuration(minsSince(hasCaffeine)));
  paint('caffTotal', caff <= t.caffeineMax);

  /* --- celkovo --- */
  setText('tCarbs',  Math.round(total('carbs')) + ' g');
  setText('tSodium', Math.round(total('sodium')) + ' mg');
  setText('tFluid',  Math.round(total('fluid')) + ' ml');
  setText('tKcal',   Math.round(total('kcal')) + ' kcal');
  setText('avgCarbs', h === null || h < 0.25 ? '–' : (total('carbs') / h).toFixed(1) + ' g/h');

  renderHistory();
}

function paint(id, ok) {
  var node = el(id);
  if (node) node.style.color = ok ? 'var(--text)' : 'var(--low)';
}

function renderHistory() {
  var wrap = el('histList');
  if (!wrap) return;

  var count = el('histCount');
  if (count) {
    count.textContent = state.log.length
      ? state.log.length + ' záznamov, najnovší hore'
      : 'Zatiaľ nič. Ťukni na položku v záložke Jedlo.';
  }

  wrap.innerHTML = '';
  for (var i = state.log.length - 1; i >= 0; i--) {
    var entry = state.log[i];
    var item = itemById(entry.itemId);

    var row = document.createElement('div');
    row.className = 'hist';

    var info = document.createElement('div');
    var name = document.createElement('strong');
    name.textContent = item ? item.name : 'neznáma položka';
    var meta = document.createElement('small');
    meta.textContent = fmtClock(entry.ts)
      + (item ? '  ·  ' + Math.round(item.carbs * entry.qty) + ' g sach.' : '')
      + (entry.qty > 1 ? '  ·  ' + entry.qty + '×' : '');
    info.appendChild(name);
    info.appendChild(meta);

    var del = document.createElement('button');
    del.className = 'del';
    del.textContent = '×';
    del.setAttribute('aria-label', 'Zmazať záznam');
    del.dataset.id = entry.id;
    del.addEventListener('click', onDelete);

    row.appendChild(info);
    row.appendChild(del);
    wrap.appendChild(row);
  }
}

/* -------------------------------------------------------------- akcie */

function logItem(itemId) {
  state.log.push({ id: uid(), itemId: itemId, qty: 1, ts: Date.now() });
  save();
  render();
}

function undo() {
  if (!state.log.length) { toast('Nie je čo vrátiť'); return; }
  var last = state.log.pop();
  var item = itemById(last.itemId);
  save();
  render();
  toast('Vrátené: ' + (item ? item.name : 'záznam'));
}

function onDelete(e) {
  var id = e.currentTarget.dataset.id;
  for (var i = 0; i < state.log.length; i++) {
    if (state.log[i].id === id) { state.log.splice(i, 1); break; }
  }
  save();
  render();
  toast('Zmazané');
}

var toastTimer = null;
function toast(msg) {
  var node = el('toast');
  if (!node) return;
  node.textContent = msg;
  node.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { node.classList.remove('show'); }, 1400);
}

/* ------------------------------------------------------ mriežka položiek */

function buildGrid() {
  var wrap = el('itemGrid');
  if (!wrap) return;
  var list = window.ITEMS || [];

  for (var c = 0; c < CATS.length; c++) {
    var cat = CATS[c];
    var inCat = [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].cat === cat.key) inCat.push(list[i]);
    }
    if (!inCat.length) continue;

    var title = document.createElement('p');
    title.className = 'cat-title';
    title.textContent = cat.title;
    wrap.appendChild(title);

    var grid = document.createElement('div');
    grid.className = 'grid';

    for (var j = 0; j < inCat.length; j++) {
      grid.appendChild(makeButton(inCat[j]));
    }
    wrap.appendChild(grid);
  }
}

function makeButton(item) {
  var btn = document.createElement('button');
  btn.className = 'item';
  btn.dataset.id = item.id;

  var name = document.createElement('span');
  name.textContent = item.name;

  var meta = document.createElement('small');
  var bits = [];
  if (item.carbs)    bits.push(item.carbs + ' g');
  if (item.sodium)   bits.push(item.sodium + ' mg');
  if (item.fluid)    bits.push(item.fluid + ' ml');
  if (item.caffeine) bits.push(item.caffeine + ' mg kof.');
  meta.textContent = bits.join(' · ');

  btn.appendChild(name);
  btn.appendChild(meta);

  btn.addEventListener('click', function () {
    logItem(item.id);
    btn.classList.add('hit');
    setTimeout(function () { btn.classList.remove('hit'); }, 900);
    toast('Zapísané: ' + item.name);
  });

  return btn;
}

/* ------------------------------------------------------------ záložky */

function showScreen(key) {
  var screens = document.querySelectorAll('.screen');
  for (var i = 0; i < screens.length; i++) screens[i].classList.add('hidden');

  var target = el('screen-' + key);
  if (target) target.classList.remove('hidden');

  var tabs = document.querySelectorAll('#tabs button');
  for (var j = 0; j < tabs.length; j++) {
    tabs[j].classList.toggle('active', tabs[j].dataset.screen === key);
  }
  window.scrollTo(0, 0);
  render();
}

/* ---------------------------------------------------------- nastavenia */

function toInputValue(ts) {
  var d = new Date(ts);
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
       + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

function fillSettings() {
  var start = el('startInput');
  if (start) start.value = toInputValue(state.raceStartedAt || Date.now());

  if (el('tCarbsIn'))  el('tCarbsIn').value  = state.targets.carbsPerHour;
  if (el('tSodiumIn')) el('tSodiumIn').value = state.targets.sodiumPerHour;
  if (el('tFluidIn'))  el('tFluidIn').value  = state.targets.fluidPerHour;
  if (el('tCaffIn'))   el('tCaffIn').value   = state.targets.caffeineMax;
}

function bindSettings() {
  el('startSave').addEventListener('click', function () {
    var ts = new Date(el('startInput').value).getTime();
    if (isNaN(ts)) { toast('Neplatný čas'); return; }
    state.raceStartedAt = ts;
    save();
    render();
    toast('Čas štartu uložený');
  });

  el('targetsSave').addEventListener('click', function () {
    state.targets.carbsPerHour  = num(el('tCarbsIn').value,  DEFAULTS.carbsPerHour);
    state.targets.sodiumPerHour = num(el('tSodiumIn').value, DEFAULTS.sodiumPerHour);
    state.targets.fluidPerHour  = num(el('tFluidIn').value,  DEFAULTS.fluidPerHour);
    state.targets.caffeineMax   = num(el('tCaffIn').value,   DEFAULTS.caffeineMax);
    save();
    fillSettings();
    render();
    toast('Ciele uložené');
  });

  el('exportBtn').addEventListener('click', function () {
    el('dataBox').value = JSON.stringify(state);
    toast('Záloha pripravená, skopíruj si ju');
  });

  el('importBtn').addEventListener('click', function () {
    var raw = el('dataBox').value.trim();
    if (!raw) { toast('Najprv vlož zálohu'); return; }
    var parsed;
    try { parsed = JSON.parse(raw); }
    catch (e) { toast('Záloha sa nedá prečítať'); return; }
    if (!parsed || !Array.isArray(parsed.log)) { toast('Záloha nemá správny tvar'); return; }

    state = parsed;
    if (!state.targets) state.targets = copy(DEFAULTS);
    for (var k in DEFAULTS) {
      if (state.targets[k] === undefined) state.targets[k] = DEFAULTS[k];
    }
    save();
    fillSettings();
    render();
    toast('Záloha načítaná');
  });

  el('resetBtn').addEventListener('click', function () {
    if (!confirm('Naozaj zmazať všetky záznamy a čas štartu?')) return;
    state.log = [];
    state.raceStartedAt = null;
    save();
    fillSettings();
    render();
    toast('Vymazané');
  });
}

function num(value, fallback) {
  var n = parseInt(value, 10);
  return isNaN(n) || n < 0 ? fallback : n;
}

/* --------------------------------------------------------------- štart */

function init() {
  load();
  buildGrid();
  fillSettings();
  bindSettings();

  el('undoBtn').addEventListener('click', undo);

  var tabs = document.querySelectorAll('#tabs button');
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener('click', function (e) {
      showScreen(e.currentTarget.dataset.screen);
    });
  }

  render();

  // obnovovanie, kým sa na displej pozeráš
  setInterval(render, 30000);

  // v pozadí sa interval zastaví — toto ho dorovná pri návrate
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) render();
  });
  window.addEventListener('pageshow', render);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(function () {});
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
