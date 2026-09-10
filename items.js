/* ============================================================
   ZOZNAM POLOŽIEK
   ============================================================

   Sem si doplň všetkých 30–40 položiek. Formát jednej položky:

     { id: 'gel-maurten', name: 'Gél Maurten', cat: 'gel',
       carbs: 25, sodium: 20, fluid: 0, kcal: 100 },

   Pravidlá:
   - id      stabilný reťazec, unikátny, bez medzier (napr. 'tyc-snickers')
             Po odbehnutí ho už nemeň, viaže sa naň história.
   - name    to, čo uvidíš na tlačidle. Krátko, nech sa zmestí na dva riadky.
   - cat     'gel' | 'drink' | 'solid' | 'aid'
             gel   = gély
             drink = nápoje (izo, voda, kola)
             solid = tuhá strava, ktorú nesieš so sebou
             aid   = jedlo z občerstvovačky
   - carbs   sacharidy v gramoch NA JEDNU PORCIU
   - sodium  sodík v mg na porciu
   - fluid   tekutiny v ml na porciu
   - kcal    kcal na porciu

   Jedno ťuknutie na tlačidlo = jedna porcia. Ak niečo pravidelne
   piješ po polovici, urob si radšej položku na tú polovicu
   (napr. 'Izo 250 ml'), než aby si počítal v hlave.

   Poradie v poli = poradie tlačidiel v rámci kategórie.
   Za poslednou položkou čiarka byť nemusí, ale nevadí.

   Po úprave tohto súboru zvýš verziu cache v sw.js (const CACHE).
   ============================================================ */

const ITEMS = [

  /* --- Gély --- */
  { id: 'gel-maurten', name: 'Gél Maurten', cat: 'gel',
    carbs: 25, sodium: 20, fluid: 0, kcal: 100 },

  { id: 'gel-sis', name: 'Gél SiS Go', cat: 'gel',
    carbs: 22, sodium: 10, fluid: 0, kcal: 87 },

  /* --- Nápoje --- */
  { id: 'izo-500', name: 'Izotonik 500 ml', cat: 'drink',
    carbs: 30, sodium: 400, fluid: 500, kcal: 120 },

  { id: 'voda-500', name: 'Voda 500 ml', cat: 'drink',
    carbs: 0, sodium: 0, fluid: 500, kcal: 0 },

  { id: 'kola-200', name: 'Kola 200 ml', cat: 'drink',
    carbs: 21, sodium: 10, fluid: 200, kcal: 85 },

  /* --- Tuhé --- */
  { id: 'tyc-musli', name: 'Müsli tyčinka', cat: 'solid',
    carbs: 20, sodium: 50, fluid: 0, kcal: 180 },

  { id: 'banan-pol', name: 'Banán 1/2', cat: 'solid',
    carbs: 12, sodium: 1, fluid: 0, kcal: 50 },

  /* --- Občerstvovačka --- */
  { id: 'aid-polievka', name: 'Polievka', cat: 'aid',
    carbs: 5, sodium: 500, fluid: 200, kcal: 45 },

  { id: 'aid-zemiak', name: 'Zemiak so soľou', cat: 'aid',
    carbs: 15, sodium: 150, fluid: 0, kcal: 70 }

];
