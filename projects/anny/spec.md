# BRIEF — gemensamt innehåll för alla 10 prototyper (Jane Cooper PoC)

Alla prototyper är design-teman kring **samma innehåll** — ägarens nuvarande PoC-sajt
(Jane Cooper, frisör, repo bryn1/anny). Ett tema = hela sidan bygd från grunden under
`prototypes/<NN>-<namn>/`. Innehållet nedan är VERIFIERAD källa: `/home/claudecode/Annie hemsida/index.html`
(livesajt: https://sibbamala.com/anny/). Återanvänd texterna ordagrant där det passar —
det gör temana direkt tillämpbara på PoC:n.

## Språk & röst
Svenska, `lang="sv"`, varmt first-person ("Jag klipper, färgar och vårdar hår i Malmö").

## Sektioner (bevara alla — nav-samma id:n gör temana utbytbara)
1. Hero — `id="top"` — Namn "Jane Cooper", eyebrow "Frisör i Malmö",
   sub: "Klippning, färg och vård med lugn och omsorg." CTA → boka/kontakt.
2. Om mig — `id="om"` — rubrik "Hår som känns som ditt". Brödtext (ordagrant från PoC):
   "Jag heter Jane Cooper och är frisör i Malmö. Mitt arbete bygger på att lyssna
   först: vilken hårtyp du har, hur du lever med ditt hår och vad du vill känna när du
   går ut dörren." + "Just nu arbetar jag på Jane Cooper, salongen på Drottninggatan 2 i
   centrala Malmö. Vi arbetar med bland annat ammoniakfri färg, balayage och
   vårdande behandlingar." + "Vill du se mitt dagliga arbete? Följ mig på Instagram
   @jane.cooper." Porträtt: bilden finns — `../_assets/anny-portrait.jpg` (Jane själv,
   spegelselfie i salongen, från hennes publika Instagram-inlägg
   instagram.com/jane.cooper/p/DbGN8NoIgX3/, ägarens uppdrag 2026-10-05; provenans i
   `_assets/anny-portrait.ATTRIBUTION.md`). Alla teman visar den i Om-sektionen, inramad
   enligt temat, alt "Jane Cooper, frisör på Jane Cooper i Malmö".
   Undantag 15 + 18: foto-fria teman (research-2 §6) behåller plats-hållaren
   "Porträtt — bild kommer" — "helt utan foto" är deras poäng.
3. Tjänster — `id="tjanster"` — rubrik "Det här kan jag". Fem tjänster (titel + PoC-text):
   Klippning · Färg & balayage · Vård & håranalys · Bröllop & bal · Barbering & skägg.
   Pris: `–` (placeholder — sätter ej pris, PoC-regel I1).
4. Galleri — `id="galleri"` — rubrik "Före & efter". Bilder: `../_assets/gal-01.jpeg` …
   `gal-04.jpeg` (finns, delade för alla teman).
5. Boka — `id="boka"` — rubrik "Välj en tid — sedan bokar du via telefon eller Instagram".
   Kalender/grid är en MOCK som är märkt "demo" (ingen backend). Vald tid → dialog med
   telefon/IG-väg, exakt som PoC:ns booking-mock.
6. Kontakt — `id="kontakt"` — rubrik "Hitta mig eller skriv till mig".
   Jane Cooper — Malmö, Drottninggatan 2, 000 00 Malmö.
   Telefon +46 70 123 45 67 → `tel:46701234567`. E-post jane.cooper@example.com →
   `mailto:`. Instagram: https://www.instagram.com/jane.cooper/ (@jane.cooper).
   Öppettider: "(bekräftas snart)" — ej hitte-på. Kontaktformulär: demomodalitet —
   formuläret får finnas men måste synligt säga att ingen backend är kopplad (PoC-honesty).

## Byggregler (bindande för alla teman)
- Statiska filer, ingen build-step: `index.html` + `css/` + `js/` i owna tempets mapp.
  Referera delade bilder som `../_assets/gal-0N.jpeg`.
- Tillåtna externa resurser: Google Fonts (CSS-länk) och cdnjs/jsDelivr för scroll-bib-
  liotek (GSAP+ScrollTrigger, Lenis m.m.) — men sidan MÅSTE vara fullt läsbar utan JS
  (progressive enhancement) och utan nät (font fallback i font-stack).
- A11y-golv: semantisk HTML, skip-link, synlig fokus, kontrast WCAG AA, alt-text på
  bilder, `prefers-reduced-motion`-kvittning för alla scroll-effekter.
- Mobil: helt utan horisontell overflow vid 375 px bredd.
- Console: noll JS-fel vid normal scroll genom hela sidan.
- Försök inte koppla riktig bokning/e-post. Allt som är demo är märkt demo.
- Håll varje tempels CSS/JS i dess egna mapp — inga delade mallar mellan teman
  (tema ska kännas som en riktig sajt, ej en variant av en grund).

## Vad som är "applicable till PoC:n"
Samma sektioner, samma svenska copy, samma kontaktdata, samma ärlighetsregler —
endast design, typografi, palett och scroll-koreografi skiljer temana åt.
