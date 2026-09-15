/* =========================================================================
   ZOZNAM JEDLA A PITIA
   =========================================================================

   Každá položka = JEDNA PORCIA, tak ako ju reálne zješ alebo vypiješ.

     id        stabilný text bez medzier. NIKDY ho nemeň po štarte preteku,
               inak staré záznamy stratia väzbu na položku.
     name      čo uvidíš na tlačidle. Do zátvorky daj veľkosť porcie.
     cat       'gel' | 'drink' | 'solid' | 'aid'
     carbs     sacharidy v gramoch
     sodium    sodík v miligramoch
     fluid     tekutiny v mililitroch
     kcal      kilokalórie
     caffeine  kofeín v miligramoch (pole môžeš vynechať, berie sa 0)

   PREPOČET SOLI NA SODÍK (na etiketách býva soľ, nie sodík):
     sodík (mg) = soľ (g) ÷ 2,5 × 1000
     Príklad: 0,88 g soli na 100 g  →  352 mg sodíka na 100 g
              pri porcii 60 g       →  211 mg sodíka

   POZOR: údaje na obaloch sú skoro vždy na 100 g, nie na balenie.
   Vždy prepočítaj na skutočnú veľkosť porcie.

   Hodnoty pri občerstvovačkách sú odhady bežných porcií — organizátor ich
   nezverejňuje. Na sledovanie trendu to stačí.
   ========================================================================= */

window.ITEMS = [

  /* ---------- Gély a tuby ---------- */
  { id: 'gel',          name: 'Gél (1 ks)',              cat: 'gel',   carbs: 25, sodium: 50,  fluid: 0,   kcal: 100, caffeine: 0 },
  { id: 'gel-kofein',   name: 'Gél s kofeínom (1 ks)',   cat: 'gel',   carbs: 25, sodium: 50,  fluid: 0,   kcal: 100, caffeine: 75 },
  { id: 'endurosnack',  name: 'Endurosnack tuba (75 g)', cat: 'gel',   carbs: 28, sodium: 44,  fluid: 45,  kcal: 118, caffeine: 0 },
  { id: 'kapsicka',     name: 'Detská kapsička (100 g)', cat: 'gel',   carbs: 15, sodium: 5,   fluid: 60,  kcal: 65,  caffeine: 0 },

  /* ---------- Vlastné nápoje ---------- */
  { id: 'voda-500',     name: 'Voda 0,5 l',              cat: 'drink', carbs: 0,  sodium: 0,   fluid: 500, kcal: 0,   caffeine: 0 },
  { id: 'ion-500',      name: 'Iontový nápoj 0,5 l',     cat: 'drink', carbs: 30, sodium: 250, fluid: 500, kcal: 120, caffeine: 0 },

  /* ---------- Tuhé jedlo z vesty ---------- */
  { id: 'dm-vafla',     name: 'dm medová vafľa (1 ks)',  cat: 'solid', carbs: 18, sodium: 118, fluid: 0,   kcal: 123, caffeine: 0 },
  { id: 'dm-gulicky',   name: 'dm guličky slané (60 g)', cat: 'solid', carbs: 30, sodium: 211, fluid: 0,   kcal: 257, caffeine: 0 },
  { id: 'ryzova-gulka', name: 'Ryžová guľka vlastná',    cat: 'solid', carbs: 28, sodium: 300, fluid: 0,   kcal: 140, caffeine: 0 },
  { id: 'datle',        name: 'Datle (2 ks)',            cat: 'solid', carbs: 30, sodium: 1,   fluid: 0,   kcal: 120, caffeine: 0 },
  { id: 'krekry',       name: 'Slané krekry (hrsť)',     cat: 'solid', carbs: 20, sodium: 250, fluid: 0,   kcal: 130, caffeine: 0 },
  { id: 'susene-maso',  name: 'Sušené mäso (25 g)',      cat: 'solid', carbs: 2,  sodium: 600, fluid: 0,   kcal: 80,  caffeine: 0 },
  { id: 'bujon-kocka',  name: 'Bujónová kocka (v pohári)', cat: 'solid', carbs: 1, sodium: 900, fluid: 200, kcal: 10, caffeine: 0 },

  /* ---------- Občerstvovačka: nápoje ---------- */
  { id: 'bbu-voda',     name: 'Voda – doplnenie 0,5 l',  cat: 'aid',   carbs: 0,  sodium: 0,   fluid: 500, kcal: 0,   caffeine: 0 },
  { id: 'bbu-cola',     name: 'Cola (pohár 2 dl)',       cat: 'aid',   carbs: 21, sodium: 8,   fluid: 200, kcal: 84,  caffeine: 20 },
  { id: 'bbu-ion',      name: 'Športový nápoj 0,5 l',    cat: 'aid',   carbs: 30, sodium: 250, fluid: 500, kcal: 120, caffeine: 0 },
  { id: 'bbu-caj',      name: 'Sladký čaj (2 dl)',       cat: 'aid',   carbs: 10, sodium: 0,   fluid: 200, kcal: 40,  caffeine: 0 },
  { id: 'bbu-kava',     name: 'Káva (1 dl)',             cat: 'aid',   carbs: 0,  sodium: 0,   fluid: 100, kcal: 2,   caffeine: 70 },
  { id: 'bbu-pivo',     name: 'Nealko pivo (2 dl)',      cat: 'aid',   carbs: 9,  sodium: 5,   fluid: 200, kcal: 45,  caffeine: 0 },

  /* ---------- Občerstvovačka: teplé ---------- */
  { id: 'bbu-polievka', name: 'Kuracia polievka (2 dl)', cat: 'aid',   carbs: 12, sodium: 700, fluid: 200, kcal: 70,  caffeine: 0 },
  { id: 'bbu-bujon',    name: 'Zeleninový bujón (2 dl)', cat: 'aid',   carbs: 2,  sodium: 800, fluid: 200, kcal: 15,  caffeine: 0 },
  { id: 'bbu-cestoviny',name: 'Cestoviny (porcia)',      cat: 'aid',   carbs: 45, sodium: 300, fluid: 0,   kcal: 250, caffeine: 0 },
  { id: 'bbu-zemiaky',  name: 'Pečené zemiaky (100 g)',  cat: 'aid',   carbs: 20, sodium: 250, fluid: 0,   kcal: 95,  caffeine: 0 },

  /* ---------- Občerstvovačka: ovocie ---------- */
  { id: 'bbu-banan',    name: 'Banán (1 ks)',            cat: 'aid',   carbs: 27, sodium: 1,   fluid: 0,   kcal: 105, caffeine: 0 },
  { id: 'bbu-pomaranc', name: 'Pomaranč (pár dielikov)', cat: 'aid',   carbs: 9,  sodium: 0,   fluid: 80,  kcal: 43,  caffeine: 0 },
  { id: 'bbu-melon',    name: 'Melón (100 g)',           cat: 'aid',   carbs: 8,  sodium: 1,   fluid: 90,  kcal: 30,  caffeine: 0 },

  /* ---------- Občerstvovačka: slané ---------- */
  { id: 'bbu-sol',      name: 'Soľ – štipka (1 g)',      cat: 'aid',   carbs: 0,  sodium: 400, fluid: 0,   kcal: 0,   caffeine: 0 },
  { id: 'bbu-uhorka',   name: 'Kyslá uhorka (1 ks)',     cat: 'aid',   carbs: 2,  sodium: 400, fluid: 40,  kcal: 10,  caffeine: 0 },
  { id: 'bbu-chipsy',   name: 'Chipsy (hrsť)',           cat: 'aid',   carbs: 13, sodium: 130, fluid: 0,   kcal: 135, caffeine: 0 },
  { id: 'bbu-salama',   name: 'Saláma (2 plátky)',       cat: 'aid',   carbs: 0,  sodium: 350, fluid: 0,   kcal: 70,  caffeine: 0 },
  { id: 'bbu-toast',    name: 'Toast so syrom',          cat: 'aid',   carbs: 20, sodium: 350, fluid: 0,   kcal: 200, caffeine: 0 },
  { id: 'bbu-sushi',    name: 'Ryžová guľka (1 ks)',     cat: 'aid',   carbs: 15, sodium: 100, fluid: 0,   kcal: 70,  caffeine: 0 },

  /* ---------- Občerstvovačka: pečivo ---------- */
  { id: 'bbu-dzem',     name: 'Chlieb s džemom',         cat: 'aid',   carbs: 30, sodium: 200, fluid: 0,   kcal: 150, caffeine: 0 },
  { id: 'bbu-mast',     name: 'Chlieb s masťou + soľ',   cat: 'aid',   carbs: 15, sodium: 300, fluid: 0,   kcal: 180, caffeine: 0 },
  { id: 'bbu-nutella',  name: 'Chlieb s Nutellou',       cat: 'aid',   carbs: 28, sodium: 150, fluid: 0,   kcal: 190, caffeine: 0 },
  { id: 'bbu-vianocka', name: 'Vianočka (krajec)',       cat: 'aid',   carbs: 25, sodium: 80,  fluid: 0,   kcal: 160, caffeine: 0 },
  { id: 'bbu-palacinka',name: 'Palacinka (1 ks)',        cat: 'aid',   carbs: 25, sodium: 100, fluid: 0,   kcal: 160, caffeine: 0 }

];
