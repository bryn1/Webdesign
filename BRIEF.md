# BRIEF — gemensamt innehåll för alla 10 prototyper (Anny Morin PoC)

Alla prototyper är design-teman kring **samma innehåll** — ägarens nuvarande PoC-sajt
(Anny Morin, frisör, repo bryn1/anny). Ett tema = hela sidan bygd från grunden under
`prototypes/<NN>-<namn>/`. Innehållet nedan är VERIFIERAD källa: `/home/claudecode/Annie hemsida/index.html`
(livesajt: https://sibbamala.com/anny/). Återanvänd texterna ordagrant där det passar —
det gör temana direkt tillämpbara på PoC:n.

## Språk & röst
Svenska, `lang="sv"`, varmt first-person ("Jag klipper, färgar och vårdar hår i Karlskrona").

## Sektioner (bevara alla — nav-samma id:n gör temana utbytbara)
1. Hero — `id="top"` — Namn "Anny Morin", eyebrow "Frisör i Karlskrona",
   sub: "Klippning, färg och vård med lugn och omsorg." CTA → boka/kontakt.
2. Om mig — `id="om"` — rubrik "Hår som känns som ditt". Brödtext (ordagrant från PoC):
   "Jag heter Anny Morin och är frisör i Karlskrona. Mitt arbete bygger på att lyssna
   först: vilken hårtyp du har, hur du lever med ditt hår och vad du vill känna när du
   går ut dörren." + "Just nu arbetar jag på Müllers., salongen på Landbrogatan 11 i
   centrala Karlskrona. Vi arbetar med bland annat ammoniakfri färg, balayage och
   vårdande behandlingar." + "Vill du se mitt dagliga arbete? Följ mig på Instagram
   @mullers.anny." Porträtt: plats-hållare med text "Porträtt — bild kommer".
3. Tjänster — `id="tjanster"` — rubrik "Det här kan jag". Fem tjänster (titel + PoC-text):
   Klippning · Färg & balayage · Vård & håranalys · Bröllop & bal · Barbering & skägg.
   Pris: `–` (placeholder — sätter ej pris, PoC-regel I1).
4. Galleri — `id="galleri"` — rubrik "Före & efter". Bilder: `../_assets/gal-01.jpeg` …
   `gal-04.jpeg` (finns, delade för alla teman).
5. Boka — `id="boka"` — rubrik "Välj en tid — sedan bokar du via telefon eller Instagram".
   Kalender/grid är en MOCK som är märkt "demo" (ingen backend). Vald tid → dialog med
   telefon/IG-väg, exakt som PoC:ns booking-mock.
6. Kontakt — `id="kontakt"` — rubrik "Hitta mig eller skriv till mig".
   Müllers. — Karlskrona, Landbrogatan 11, 371 35 Karlskrona.
   Telefon 072-155 48 60 → `tel:+46721554860`. E-post Anny.mullerskarlskrona@gmail.com →
   `mailto:`. Instagram: https://www.instagram.com/mullers.anny/ (@mullers.anny).
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
