# BBU Fuel

Sledovanie príjmu jedla a pitia počas ultra. Ťukneš na položku, appka spočíta,
koľko máš v sebe a či zaostávaš za plánom. Funguje offline, dáta zostávajú
v telefóne, nikam sa nič neposiela.

## Nasadenie na GitHub Pages

1. Nahraj všetky súbory do **koreňa** repozitára (nie do podpriečinka).
   Repozitár musí byť **verejný** — Pages na súkromných repách vyžadujú platený plán.
2. Settings → Pages → Source: **Deploy from a branch** → `main` → `/ (root)` → Save.
3. Po asi minúte dostaneš adresu `https://tvojemeno.github.io/nazov-repa/`.

Netestuj to cez lokálny server a LAN IP z telefónu — service worker potrebuje
HTTPS alebo localhost, a `http://192.168.x.x` nie je ani jedno. Testuj rovno
na tej Pages adrese.

## Inštalácia na iPhone

1. Otvor adresu v **Safari** (v Chrome sa to nedá).
2. Ťukni na ikonu **Zdieľať** (štvorček so šípkou nahor).
3. Scrolluj dole a vyber **Pridať na plochu**.
4. Potvrď **Pridať**.

**Appka na ploche má vlastné úložisko, oddelené od Safari.** Čokoľvek vyplníš
v prehliadači, v appke neuvidíš. Takže najprv inštalácia, až potom nastavenia.

## Vlastný zoznam jedla

Uprav `items.js`. Každá položka = jedna porcia tak, ako ju reálne zješ.

```js
{ id: 'moj-gel', name: 'Môj gél (1 ks)', cat: 'gel',
  carbs: 25, sodium: 50, fluid: 0, kcal: 100, caffeine: 0 }
```

Kategórie: `gel`, `drink`, `solid`, `aid`.

**Sodík z etikety:** na obaloch býva soľ, nie sodík.
`sodík (mg) = soľ (g) ÷ 2,5 × 1000`

**Pozor:** údaje sú takmer vždy na 100 g, nie na balenie. Prepočítaj na porciu.

`id` po štarte preteku už nikdy nemeň — staré záznamy by stratili väzbu.

## Po každej zmene súborov

V `sw.js` zvýš verziu cache:

```js
var CACHE = 'bbu-v2';   // bolo bbu-v1
```

Bez toho ti telefón bude ďalej servírovať starú verziu.

## Čo appka ukazuje

**Jedlo** — mriežka položiek. Jedno ťuknutie = jedna porcia. Hore veľkým
písmom čas od posledného príjmu a rýchlosti za poslednú hodinu.

**Prehľad** — zaostávanie oproti plánu od štartu (mínus = máš dojesť),
posledná hodina proti cieľu, kofeín, celkové súčty.

**História** — všetky záznamy, jednotlivo zmazateľné.

**Nastavenia** — čas štartu (dá sa dopísať spätne), ciele na hodinu,
záloha do textu, vymazanie.

## Test pred pretekom

- [ ] Režim lietadlo, appku zabiť, otvoriť z plochy → musí nabehnúť
- [ ] Naťukať pár záznamov, reštartovať telefón → dáta musia zostať
- [ ] Zavrieť na 20 minút, otvoriť → „od posledného príjmu" musí ukázať 20 min
- [ ] Nastaviť čas štartu spätne → zaostávanie musí dávať zmysel
- [ ] Odťukať to na dlhom tréningu spotenými rukami

## Poznámka k pretekom

Režim lietadlo je len na test offline režimu. Na BBU musí byť telefón
**zapnutý a dostupný** — letecký mód aj vybitá batéria znamenajú riziko
diskvalifikácie. Zober powerbanku, nabíjačky na staniciach nie sú.
