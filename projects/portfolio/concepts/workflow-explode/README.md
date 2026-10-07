# workflow-explode — scrollkoncept för portfölj-gatewayn

Konceptmock (MC 10140): en färdig prototyp kopplas ur i scroll — kod, arbetsflöde,
uppdragstavla, orchestrator — och rackas ihop igen till navigeringen. Byggd efter
`.audits/202610051009-workflow-explode/CONCEPT.md` (AMENDED c1). Visuell värld:
studio-rack / patchpanel (omdesign MC 10140.4, se RESULT.md).

## Servering

Redan upprättad: `~/Hemsidor/concepts` serveras på **http://127.0.0.1:8092/workflow-explode/**
via parent-keepalive (cron). Starta ingen egen server. (`:8090` = `prototypes/`,
`:8091` = systern portfolio-designs — rör inte dem.)

## Innehåll

- `index.html` — scenerna som semantisk HTML; sidan är läsbar utan JS (DOM-ordning = innehåll).
- `css/` — `tokens.css` (rack-paletten: grafit, aluminium, elfenben, amber/gröna signallampor),
  `base.css` (statisk vy), `scenes.css` (scenmaskineri, ONLY under `html.js` + `no-preference`).
- `js/` — `main.js` (boot + en enda pinned timeline), `scenes.js` (scen-byggare),
  `vendor/` — GSAP + ScrollTrigger 3.12.7, kopierade från `prototypes/_assets/vendor/`.
- `assets/hero-12.png` — skärmbild av tema 12 på :8090, omfotograferad 2026-10-07 (den gamla bilden föregick personbytet Anny Morin → Jane Cooper och matchade inte prototypen; ny bild VERIFIERAD mot :8090/salong/prototypes/12-forgyllda-salongen/, 1280×900).
- Typsnitt: Saira + Saira Condensed via Google Fonts-länk, lokal fallback i stapeln.

## Äkthet

All data på sidan är **påhittad**: kort-IDs, antal, körn, workrar. Ingen kunddata,
ingen riktig MC-data. Chippet `demo · fejkad data` säger det på skärmen.
Sidan under `#om`/`#projekt` är ärliga platshållare för den riktiga portföljen.

## Teknik

Inga byggesteg, inga CDN:er för JS, inga andra externa anrop än fonts-länken.
`prefers-reduced-motion`: statisk steg-för-steg-vy, ingen pin, 0 ScrollTriggers.
375px: en kolumn, halverade 3D-offset, scrollbar board. Kvalitetsgrind:
`quality-gate.sh <mappen>` → **PASS** (2026-10-07, exit 0; rapport i `.audits/`, körs om av
den som committar).
