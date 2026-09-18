/* =========================================================================
   BBU FUEL — ZOZNAM JEDLA A PITIA
   Big Bear's Ultra 100+ , 19.–20. 9. 2026

   Každá položka = JEDNA PORCIA tak, ako ju reálne zješ alebo vypiješ.
   Hodnoty sú z etikiet, prepočítané na porciu.
   Sodík = soľ (g) ÷ 2,5 × 1000.

   NA 100 ml sú: voda, iontový nápoj, cola.
   Tie ťukáš toľkokrát, koľko dcl si dal (0,5 l = 5×).

   ODHADY sú označené komentárom. Uprav ich, ak máš presnejšie údaje.
   ========================================================================= */

window.ITEMS = [

  /* ================= GÉLY A TUBY ================= */
  { id: 'gu-cola',       name: 'GU Cola Me Happy',          cat: 'gel', carbs: 22, sodium: 60,  fluid: 0,   kcal: 100, caffeine: 40 },
  { id: 'gu-melon',      name: 'GU Salted Watermelon',      cat: 'gel', carbs: 23, sodium: 125, fluid: 0,   kcal: 100, caffeine: 20 },
  { id: 'gu-lemon',      name: 'GU Lemon Sublime',          cat: 'gel', carbs: 23, sodium: 55,  fluid: 0,   kcal: 100, caffeine: 0 },
  { id: 'gu-roc-cherry', name: 'Roctane Cherry Lime',       cat: 'gel', carbs: 21, sodium: 125, fluid: 0,   kcal: 100, caffeine: 35 },
  { id: 'gu-roc-kiwi',   name: 'Roctane Strawberry Kiwi',   cat: 'gel', carbs: 21, sodium: 125, fluid: 0,   kcal: 100, caffeine: 0 },
  { id: 'gu-liquid',     name: 'GU Liquid Energy (60 g)',   cat: 'gel', carbs: 23, sodium: 75,  fluid: 35,  kcal: 95,  caffeine: 0 },
  { id: 'high5-aqua',    name: 'High5 Aqua Orange (66 g)',  cat: 'gel', carbs: 23, sodium: 28,  fluid: 40,  kcal: 95,  caffeine: 0 },
  { id: 'chimp-mango',   name: 'Chews Tropical Mango (35 g)', cat: 'gel', carbs: 26, sodium: 14, fluid: 0,  kcal: 117, caffeine: 0 },
  { id: 'chimp-jahoda',  name: 'Chews Strawberry (35 g)',   cat: 'gel', carbs: 26, sodium: 14,  fluid: 0,   kcal: 123, caffeine: 0 },
  { id: 'svacinka',      name: 'Svačinka XXL (200 g)',      cat: 'gel', carbs: 37, sodium: 40,  fluid: 150, kcal: 152, caffeine: 0 },

  /* ================= VLASTNÉ NÁPOJE ================= */
  { id: 'voda',          name: 'Voda (1 dcl)',              cat: 'drink', carbs: 0,  sodium: 0,   fluid: 100, kcal: 0,   caffeine: 0 },
  // ODHAD — bežný iontový nápoj. Uprav podľa svojho, hodnoty sú na 100 ml.
  { id: 'iont',          name: 'Iontový nápoj (1 dcl)',     cat: 'drink', carbs: 6,  sodium: 50,  fluid: 100, kcal: 24,  caffeine: 0 },
  { id: 'sol-tableta',   name: 'Soľná tableta (1 ks)',      cat: 'drink', carbs: 0,  sodium: 150, fluid: 0,   kcal: 0,   caffeine: 0 },
  { id: 'redbull',       name: 'Red Bull Watermelon 250 ml',cat: 'drink', carbs: 28, sodium: 0,   fluid: 250, kcal: 112, caffeine: 80 },
  { id: 'dzus',          name: 'Džús 200 ml',               cat: 'drink', carbs: 20, sodium: 0,   fluid: 200, kcal: 80,  caffeine: 0 },

  /* ================= TUHÉ JEDLO Z VESTY ================= */
  { id: 'dm-vafla',      name: 'dm medová vafľa (1 ks)',    cat: 'solid', carbs: 18, sodium: 118, fluid: 0, kcal: 123, caffeine: 0 },
  { id: 'apple-pencils', name: 'Apple Pencils (hrsť 30 g)', cat: 'solid', carbs: 25, sodium: 31,  fluid: 0, kcal: 112, caffeine: 0 },
  { id: 'jojo-kysle',    name: 'Jojo kyslé želé (5 ks)',    cat: 'solid', carbs: 12, sodium: 4,   fluid: 0, kcal: 49,  caffeine: 0 },
  { id: 'emco-ovoce',    name: 'Emco Super ovoce jahoda',   cat: 'solid', carbs: 25, sodium: 22,  fluid: 0, kcal: 111, caffeine: 0 },
  { id: 'racio-kakao',   name: 'Racio ryžový chlebíček',    cat: 'solid', carbs: 20, sodium: 12,  fluid: 0, kcal: 140, caffeine: 0 },
  { id: 'dm-gulicky',    name: 'dm guličky orechové (60 g)',cat: 'solid', carbs: 31, sodium: 58,  fluid: 0, kcal: 267, caffeine: 0 },
  { id: 'oat-fruit',     name: 'Oat & Fruit tyčinka (70 g)',cat: 'solid', carbs: 43, sodium: 56,  fluid: 0, kcal: 340, caffeine: 0 },
  { id: 'chimp-espresso',name: 'Chimpanzee Choco Espresso', cat: 'solid', carbs: 32, sodium: 33,  fluid: 0, kcal: 216, caffeine: 20 },
  // POZOR: 10,5 g vlákniny v tyčinke. Maximálne polovicu a len v prvej polovici preteku.
  { id: 'chimp-salty',   name: 'Chimpanzee Salty BBQ',      cat: 'solid', carbs: 24, sodium: 220, fluid: 0, kcal: 212, caffeine: 0 },
  // ODHAD — praclíky som nemal odfotené
  { id: 'pracliky',      name: 'Slané praclíky (hrsť 30 g)',cat: 'solid', carbs: 22, sodium: 350, fluid: 0, kcal: 120, caffeine: 0 },

  /* ================= OBČERSTVOVAČKA ================= */
  { id: 'bbu-cola',      name: 'Coca-Cola (1 dcl)',         cat: 'aid', carbs: 11, sodium: 5,   fluid: 100, kcal: 42,  caffeine: 10 },
  { id: 'bbu-birell',    name: 'Birell Pomelo Grep 0,5 l',  cat: 'aid', carbs: 35, sodium: 15,  fluid: 500, kcal: 160, caffeine: 0 },

  { id: 'bbu-polievka',  name: 'Kuracia polievka (2 dl)',   cat: 'aid', carbs: 8,  sodium: 600, fluid: 200, kcal: 50,  caffeine: 0 },
  { id: 'bbu-uhorka',    name: 'Kyslá uhorka (1 ks)',       cat: 'aid', carbs: 1,  sodium: 400, fluid: 50,  kcal: 8,   caffeine: 0 },
  { id: 'bbu-chipsy',    name: 'Chipsy (pár ks, 10 g)',     cat: 'aid', carbs: 5,  sodium: 50,  fluid: 0,   kcal: 54,  caffeine: 0 },

  { id: 'bbu-banan',     name: 'Banán – polovica',          cat: 'aid', carbs: 14, sodium: 1,   fluid: 0,   kcal: 53,  caffeine: 0 },
  { id: 'bbu-pomaranc',  name: 'Pomaranč – štvrtina',       cat: 'aid', carbs: 6,  sodium: 0,   fluid: 40,  kcal: 24,  caffeine: 0 },

  { id: 'bbu-nutella',   name: 'Chlieb s Nutellou',         cat: 'aid', carbs: 28, sodium: 210, fluid: 0,   kcal: 180, caffeine: 0 },
  { id: 'bbu-lunter',    name: 'Chlieb s Lunter nátierkou', cat: 'aid', carbs: 21, sodium: 300, fluid: 0,   kcal: 136, caffeine: 0 },

  /* --- veci, čo budú len niekde; hodnoty sú hrubý odhad --- */
  { id: 'bbu-palacinka', name: 'Palacinka (1 ks)',          cat: 'aid', carbs: 28, sodium: 120, fluid: 0,   kcal: 180, caffeine: 0 },
  { id: 'bbu-sushi',     name: 'Ryžová guľka (1 ks)',       cat: 'aid', carbs: 11, sodium: 80,  fluid: 0,   kcal: 50,  caffeine: 0 },
  { id: 'bbu-toast',     name: 'Toast so syrom a šunkou',   cat: 'aid', carbs: 22, sodium: 500, fluid: 0,   kcal: 220, caffeine: 0 }

];
