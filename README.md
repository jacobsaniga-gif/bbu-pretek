# BBU Fuel Tracker

Offline appka na sledovanie príjmu jedla a pitia počas ultramaratónu.
Čisté HTML/CSS/JS, žiadny build, žiadny backend, dáta v `localStorage` telefónu.

Postavené pre Big Bear's Ultra 118 km, štart 19. 9. 2026 o 6:00.

## Súbory

```
index.html            kostra 4 obrazoviek
style.css             tmavý vzhľad, tlačidlá min. 80 px
app.js                logika, výpočty, localStorage
items.js              zoznam položiek — TOTO SI VYPLNÍŠ SÁM
manifest.webmanifest  PWA manifest
sw.js                 service worker (offline cache)
icon-192.png          doplniť
icon-512.png          doplniť
apple-touch-icon.png  doplniť (180×180)
```

Ikony v repozitári zatiaľ nie sú. Bez nich appka funguje, len bude mať
na ploche generický náhľad. Service worker si s chýbajúcimi ikonami poradí.

## Vyplnenie položiek

Otvor `items.js` a doplň si 30–40 riadkov podľa vzoru, ktorý je v súbore.
Hodnoty `carbs` (g), `sodium` (mg), `fluid` (ml) a `kcal` sú vždy **na jednu
porciu** — jedno ťuknutie na tlačidlo zapíše presne tieto čísla.

`id` po prvom použití už nemeň, viažu sa naň staré záznamy v histórii.

## Nasadenie na GitHub Pages

1. Vytvor repozitár, napríklad `bbu-fuel`.
2. Nakopíruj doň všetky súbory z tohto priečinka (do koreňa repozitára,
   nie do podpriečinka).
3. Commit a push do vetvy `main`.
4. V repozitári: **Settings → Pages → Build and deployment → Source: Deploy
   from a branch**, vetva `main`, priečinok `/ (root)`. Ulož.
5. Po minúte až dvoch je appka na `https://TVOJE-MENO.github.io/bbu-fuel/`.

Všetky cesty v projekte sú relatívne (`./…`), takže appka funguje
v podadresári bez akejkoľvek úpravy. Nikdy nepridávaj cesty začínajúce
lomítkom — service worker by sa nezaregistroval.

### Pri každej ďalšej zmene kódu

Zvýš verziu v prvom riadku `sw.js`:

```js
const CACHE = 'bbu-v2';
```

Bez toho ti telefón bude servírovať starú verziu z cache. Po pushnutí otvor
appku, zavri ju a otvor znova — druhé otvorenie už beží na novej verzii.

## Inštalácia na iPhone

1. Otvor adresu appky v **Safari** (nie v Chrome, nie cez odkaz v inej appke).
2. Tlačidlo Zdieľať → **Pridať na plochu** → Pridať.
3. Spusti appku z plochy. Beží na celú obrazovku, bez adresného riadka.
4. Ešte doma, na Wi-Fi, nechaj appku raz načítať a poklikať — vtedy si
   service worker stiahne všetky súbory do cache.
5. Otestuj offline režim podľa zoznamu nižšie.

Appka nemá prihlasovanie ani synchronizáciu. Dáta žijú v tomto jednom
telefóne, v tejto jednej appke na ploche. Ak appku z plochy zmažeš,
zmažú sa aj dáta. Pred pretekom si sprav export a ulož si ho do poznámok.

## Používanie počas preteku

- **Zápis** — ťukni na položku, ktorú si práve zjedol alebo vypil. Tlačidlo
  na sekundu zozelenie. Hore je stále vidieť, koľko času uplynulo od
  posledného príjmu. Zlé ťuknutie zrušíš tlačidlom Späť.
- **Prehľad** — kĺzavé okno posledných 60 minút oproti cieľom, plus celkové
  súčty a priemer na hodinu od štartu. Zelená = si na cieli, oranžová = pod ním.
- **História** — všetky záznamy od najnovšieho, s možnosťou zmazať jeden.
- **Nastavenia** — štart preteku, ciele na hodinu, export a import.

Na štarte v Žiline nezabudni ťuknúť na **Štart preteku**. Bez neho
nefunguje uplynulý čas ani priemery na hodinu (súčty áno).

Predvolené ciele: 70 g/h sacharidy, 600 mg/h sodík, 500 ml/h tekutiny.

## Ako appka počíta čas

Uplynulý čas sa nikdy nedrží v bežiacom časovači. Počíta sa až v momente
vykreslenia, ako `Date.now()` mínus uložený timestamp. Keď iOS pri zhasnutom
displeji uspí JavaScript, nič sa nerozbije — po návrate do appky sa čísla
prepočítajú z reálneho času. Prekresľuje sa každých 30 sekúnd a navyše
okamžite pri návrate do appky (`visibilitychange`).

Do `localStorage` sa ukladá po každej jednej zmene stavu, nie na konci
a nie časovačom.

## Kontrolný zoznam na otestovanie

Prejdi celý zoznam **do 17. 9.**, nie ráno na štarte.

### Základ

- [ ] Appka sa otvorí z plochy na celú obrazovku, bez adresného riadka Safari.
- [ ] Obsah nezasahuje pod výrez ani pod spodný indikátor.
- [ ] Ťuknutie na položku zapíše záznam, tlačidlo na ~1 s zozelenie.
- [ ] Dvojité rýchle ťuknutie nezoomuje stránku.
- [ ] Dlhé podržanie tlačidla nevyberá text ani neotvára lupu.
- [ ] Späť zmaže posledný záznam a ukáže potvrdenie.
- [ ] Zmazanie záznamu v Histórii sedí — zmizne presne ten riadok.
- [ ] Prehľad sedí s ručným súčtom: zaloguj 3 známe položky a prepočítaj.
- [ ] Ciele sa dajú prepísať a Prehľad ihneď prepne farbu pri prekročení cieľa.
- [ ] Reset preteku vyžiada dve potvrdenia a naozaj všetko vymaže.

### Offline režim — najdôležitejšie

- [ ] Na Wi-Fi otvor appku, poklikaj všetky štyri obrazovky, zavri ju.
- [ ] Zapni **režim lietadlo** (a vypni Wi-Fi aj dáta).
- [ ] Spusti appku z plochy → musí sa načítať kompletná, so štýlmi
      aj s tlačidlami položiek. Žiadna dinosaurus-stránka, žiadne holé HTML.
- [ ] Offline zaloguj 5 položiek, prepni obrazovky, zmaž jeden záznam.
- [ ] Zavri appku (odswipovať z prepínača appiek), znova otvor, stále offline
      → všetkých 5 záznamov tam je.
- [ ] Zapni sieť, otvor appku → nič sa nestratilo.

### Prežitie dát

- [ ] Zaloguj pár položiek, **reštartuj telefón**, otvor appku → dáta sedia.
- [ ] Odswipuj appku z prepínača, počkaj 10 minút, otvor → dáta sedia.
- [ ] Sprav export, skopíruj JSON do poznámok, urob Reset preteku,
      potom import → všetko sa vráti vrátane štartu.
- [ ] Nechaj appku otvorenú 12 hodín cez noc na nabíjačke → ráno sa po
      odomknutí čísla prepočítajú, nič nezamrzlo.

### Počítanie času po dlhšom zavretí — kritické

- [ ] Zaloguj položku, zapamätaj si presný čas.
- [ ] Zamkni telefón a nechaj ho ležať **aspoň 45 minút**.
- [ ] Odomkni, otvor appku z plochy. Číslo hore musí okamžite (do jednej
      sekundy) ukazovať skutočný uplynulý čas, nie 0:00 a nie čas, na ktorom
      to zamrzlo pri zamknutí.
- [ ] Prepni na Prehľad → "Od štartu" sedí s reálnym rozdielom od štartu.
- [ ] Zaloguj položku, počkaj 61 minút, pozri Prehľad → táto položka už
      **nie je** v okne poslednej hodiny, ale je v celkových súčtoch.
- [ ] Vyskúšaj to aj cez polnoc (napr. štart o 23:30, kontrola o 00:30) —
      uplynulý čas aj kĺzavé okno musia byť správne, hodiny sa neresetujú.

### Nočná prevádzka

- [ ] Zníž jas na minimum a skús trafiť tlačidlá — sú dosť veľké?
- [ ] Skús to s rukavicami alebo mokrými rukami.
- [ ] Zapni **Nerušiť** a skontroluj, že appka funguje rovnako.
- [ ] Nechaj batériu spadnúť do **režimu nízkej spotreby** a zopakuj test
      uplynulého času po 45 minútach zamknutia.
