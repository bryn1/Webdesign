# workflow-explode — scrollkoncept för portfölj-gatewayn

Konceptmock (MC 10140): en färdig prototyp splittras i scroll — kod, arbetsflöde,
uppdragstavla, orchestrator — och viks ihop igen till navigeringen. Byggd efter
`.audits/202610051009-workflow-explode/CONCEPT.md` (AMENDED c1).

## Servering

Redan upprättad: `~/Hemsidor/concepts` serveras på **http://127.0.0.1:8092/workflow-explode/**
via parent-keepalive (cron). Starta ingen egen server. (`:8090` = `prototypes/`,
`:8091` = systern portfolio-designs — rör inte dem.)

## Innehåll

- `index.html` — scenerna som semantisk HTML; sidan är läsbar utan JS (DOM-ordning = innehåll).
- `css/` — `tokens.css` (tema 12 Förgyllda salongen, hexlästa 2026-10-05), `base.css`
  (statisk vy), `scenes.css` (scenmaskineri, ONLY under `html.js` + `no-preference`).
- `js/` — `main.js` (boot + en enda pinned timeline), `scenes.js` (scen-byggare),
  `vendor/` — GSAP + ScrollTrigger 3.12.7, kopierade från `prototypes/_assets/vendor/`.
- `assets/hero-12.png` — skärmbild av tema 12 på :8090 (ögonblickskopia; runtime rör inte :8090).

## Äkthet

All data på sidan är **påhittad**: kort-IDs, antal, körn, workrar. Ingen kunddata,
ingen riktig MC-data. Chippet `demo · fejkad data` säger det på skärmen.
Sidan under `#om`/`#projekt` är ärliga platshållare för den riktiga portföljen.

## Teknik

Inga byggesteg, inga CDN:er, inga externa anrop. `prefers-reduced-motion`: statisk
steg-för-steg-vy, ingen pin. 375px: en kolumn, halverade 3D-offset.
