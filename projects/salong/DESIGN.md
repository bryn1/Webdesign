---
name: "Salongen (Jane Cooper PoC) — project design canon, multi-theme"
description: "The shared floor every theme under prototypes/ holds; all per-theme design values live in each theme's own css/ — this file governs the floor, never a single design system."
colors: "per-theme — each theme's own :root token block owns its palette; no shared palette exists (see Colors)"
typography: "per-theme — each theme's own token block owns its pairing; the shared floor is offline-legible stacks (see Typography)"
rounded: "per-theme — declared in the theme's own css/; no shared radius rule (see Shapes)"
spacing: "per-theme — declared in the theme's own css/ (see Layout)"
components: "per-theme styling; the shared floor is the honesty + a11y furniture (see Components)"
---

## Overview

`projects/salong` is one content wearing many full designs, not one design system. `spec.md` is the content canon: "Samma sektioner, samma svenska copy, samma kontaktdata, samma ärlighetsregler" — "endast design, typografi, palett och scroll-koreografi skiljer temana åt" (spec.md:58-59). Under `prototypes/` stand 28 numbered theme folders: 00-poc-live-site (the live-PoC snapshot, its own `images/`), 01–20 the gallery themes, 21–26 impeccable lab fixtures ("an impeccable-skill test build", each named in its `SOURCE.md`), and 27-salongens-rytm, the owner-ratified-name theme. Every theme is a whole site — "tema ska kännas som en riktig sajt, ej en variant av en grund" (spec.md:55) — so one token table written here would be the fiction this file exists to refuse. What governs is: (a) the floor every theme shares, each claim measured in the tree with its instrument named, and (b) the declaration that per-theme tokens own the design — in each theme's own `css/` (Colors, Typography, Shapes). The repo-root DESIGN.md is a SUPERSEDED pointer to `projects/portfolio/` ("Signalväg", a studio-rack world): a different surface's brand, not this salon's; nothing here inherits it.

## Colors

There is no shared palette and none is written here. Each theme owns its colour in a single `:root` token block in its own `css/` — 28/28 themes (instrument: `grep -rl ':root' <theme>/css/`, run 2026-11-08); 11 of 28 name the file `css/tokens.css` (00–08, 10, 27), the rest keep the block in their own `css/base.css`, `css/style.css`, `css/styles.css`, `css/mesh.css` or `css/chart.css`. The newest theme states the ownership rule for its own build: "nothing outside :root names a colour" (`27-salongens-rytm/css/tokens.css:2`). Placeholder state is canon: the shared `_assets/` art is generated gradient placeholders (`_assets/jane-portrait.ATTRIBUTION.md` — owner ruling R2 removed the original portrait, only its filename remains, and all themes point at the same generated file); `_assets` content is NOT salon photography and is not design material for any theme.

## Typography

Type pairings are per-theme, declared in each theme's own token block; no shared face exists. (Measured examples of the ownership pattern, not a shared system: `01-mork-guld/css/tokens.css:24-25`, `27-salongens-rytm/css/tokens.css:38-39`.) An external webfont is allowed only as a CSS link — "Google Fonts (CSS-länk)" (spec.md:46) — 23/28 themes reference fonts.googleapis (instrument: `grep -rl 'fonts.googleapis' [0-9]*/index.html [0-9]*/css/`), while 27 ships local/system faces. The binding shared floor is offline legibility: stacks must fall back — "font fallback i font-stack" (spec.md:48), the page "fullt läsbar utan JS" (spec.md:47). Measured conformance is NOT uniform: 16/28 themes end every font stack on a generic family (instrument: regex `(font-family|--font[a-z-]*):[^;]*,[^;]*(serif|sans-serif|system-ui|ui-monospace|monospace)\s*[;]` over each theme's `css/`, run 2026-11-08). The fallback is a per-theme obligation the spec sets, not yet a fact everywhere — say so per theme, never canon the gap.

## Layout

The shared structural floor, measured across all 28 theme folders: the six section ids `top`, `om`, `tjanster`, `galleri`, `boka`, `kontakt` appear in 28/28 `index.html` (instrument: `grep -rl 'id="om"' …` per id) — "nav-samma id:n gör temana utbytbara" (spec.md:12). The delivery shape is "Statiska filer, ingen build-step" (spec.md:44): `index.html` + `css/` + `js/` inside each theme's own folder, shared images referenced as `../_assets/` (measured in 26/28 — 00 ships its own `images/`, 23 is a lab fixture). Mobile floor: "helt utan horisontell overflow vid 375 px bredd" (spec.md:51); console floor: "noll JS-fel vid normal scroll genom hela sidan" (spec.md:52). The actual layout — grids, widths, bands (e.g. the four-band breakpoint vocabulary in `27-salongens-rytm/css/tokens.css`, the clamp scales in `01-mork-guld/css/tokens.css`) — is owned per theme by its own `css/layout.css` / `css/base.css` / `css/style.css`. Every theme folder carries its own `QUALITY.md` gate record (28/28).

## Elevation & Depth

Per-theme, and declared so — no shared elevation or depth system exists, and none is invented here. Depth treatment is declared inside each theme's own token/CSS files (measured examples: the scene-tint tokens `--scene-tint`, `--scene-tint-hero` in `27-salongens-rytm/css/tokens.css:19-24`; the clamp-scaled measures in `01-mork-guld/css/tokens.css:37-38`). What IS shared is the motion-honesty floor, not a look: `prefers-reduced-motion`-kvittning för alla scroll-effekter (spec.md:50), measured 28/28 (instrument: `grep -rl 'prefers-reduced-motion' [0-9]*/css/`).

## Shapes

Per-theme. No shared radius or shape rule exists. (`--radius` reads `2px` in both themes measured — `01-mork-guld/css/tokens.css:41`, `27-salongens-rytm/css/tokens.css:71` — a coincidence between two themes, not a canonised value; the other 26 were not checked and are free to differ.)

## Components

Visual component styling is per-theme (measured files: `27-salongens-rytm/css/components.css`, `01-mork-guld/css/components.css`). What every theme must carry is the honesty + a11y furniture, all measured today:

- Price stays the dash — "sätter ej pris" (spec.md:30); a `–` (or its `&ndash;` entity, as in `05-mjuk-glas/index.html`) renders in 28/28 `index.html` (instrument: `grep -rl -e '–' -e '&ndash;' [0-9]*/index.html`).
- Opening hours render "(bekräftas snart)" — "ej hitte-på" (spec.md:40) — 28/28.
- Booking is a labelled mock — "Välj en tid — sedan bokar du via telefon eller Instagram" (spec.md:33); "Allt som är demo är märkt demo" (spec.md:53); a `demo` string appears in 28/28 themes.
- Skip affordance: the 21 site themes 00–20 all carry class `skip-link` (instrument: `grep -rl 'skip-link' <theme>/index.html <theme>/css/`); 27 ships the Swedish pair instead, class `.hoppa`, both targets delivered (`27-salongens-rytm/index.html:17-18`, `css/base.css:84`). The lab fixtures 21–26 are skill-test builds (their `SOURCE.md`) and are not held to this row.
- Visible focus — "synlig fokus" (spec.md:49): `:focus-visible` styling in 28/28 (instrument: `grep -rl ':focus-visible' [0-9]*/css/`). WCAG AA ("kontrast WCAG AA", spec.md:49; owner-ratified 2026-11-08 per `PRODUCT.md`) sets two bars for two different objects and both bind: TEXT contrast 4.5:1, or 3:1 for large text; NON-TEXT focus-indicator contrast ≥ 3:1. Recorded measurement: `27-salongens-rytm/QUALITY.md` — "AA failures 1440: 0/134, 375: 0/134" and the focus row "WCAG 1.4.11 indicator contrast >=3:1 on composited bg".

## Do's and Don'ts

- Do treat `spec.md` as the only content canon and keep its Swedish strings exactly as written there.
- Do put every per-theme design value in that theme's own `css/` token block — "inga delade mallar mellan teman" (spec.md:55).
- Do hold the placeholders visibly: the dash price, "(bekräftas snart)" and the "demo" labels stay until the real thing exists (`PRODUCT.md`, Brand Commitments, owner-ratified 2026-11-08).
- Do hold BOTH contrast bars: text 4.5:1 (3:1 large text) and non-text focus indicators ≥ 3:1 — different bars, different objects.
- Don't add a hex value, token name or font name to this file without a pointer into the tree that shows it exists: the file governs the floor; each theme's own `css/` owns the design.
- Don't present `_assets/` placeholder gradients as salon photography or brand material.
- Don't invent prices, reviews, opening hours or a booking system that does not exist (`PRODUCT.md`, Brand Commitments).
- Don't inherit the repo-root DESIGN.md — it is a SUPERSEDED pointer to portfolio's "Signalväg", a different surface's brand.
