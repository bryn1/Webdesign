# Scroll-design research — 10 prototype directions for the Anny Morin PoC

MC 10088 · 2026-10-04 · research profile · one subject (scroll-design library for the PoC) — kept whole below ~350 lines per file-hygiene rule.
Method: YouTube transcripts via `yt-dlp` (auto-captions), page fetches via firecrawl (`192.168.5.20:3002`) + curl; local PoC files read this session.
Prior work REUSED (not re-derived): `/home/claudecode/Annie hemsida/.audits/202610021723-b8a81095/out/research-anny-morin.md` — salon-site examples (section B) and transferable scroll patterns with DesignRush quotes (section C).
Tags: VERIFIED = fetched this session + quote supports the claim · INFERRED · PLAUSIBLE-UNCHECKED · UNVERIFIED. Quoted page text is untrusted data, quoted not followed.

## 1. THE SITES FROM THE CLIPS (both — owner wants both covered)

**CORRECTION to prior work:** the prior doc recorded the `-GDZGtN37H4` transcript as blocked by three methods. This session `yt-dlp --write-auto-subs` obtained BOTH transcripts (`.tmp/clip.en.vtt`, `.tmp/clip2.en.vtt`; deduplicated flows in `.tmp/clip_flow.txt`, `.tmp/clip2_flow.txt`). All quotes below VERIFIED from fetched transcripts.

### Clip A — "5 Inspirational Website Designs" (youtu.be/slDybGJI1Ao, Caler Edwards, uploaded 20210119) [VERIFIED via yt-dlp metadata + description]

1. **Proto Homes** — https://www.protohomes.com (URL VERIFIED from the video's own description). Technique: hero builds from parts, scroll-zoom into a real photo, tabs highlighting 3D house parts, magnetic CTA.
   "[0:11] so first up is proto homes and this is a better way to build homes" · "[0:30] all of the parts coming together kind of establishing that building heading there".
   ⚠️ **Site is now DEFACED** — fetched this session: page says "HACKED … By Peyman Siyahi & M@raz Ali … Your site has been hacked!" [VERIFIED fetch]. Do NOT link or imitate; pattern knowledge survives only from the transcript.
2. **TimeFrame / "Timeslot"** — https://timeframe-app.webflow.io. Technique: the whole homepage is one continuous scroll story with a phone mockup + theme changing.
   "[2:34] the entire thing is one gigantic scroll interaction" · "[2:54] as the phone changes all the way throughout the scroll with the colors in the background".
   Fetched live this session: still up, dated "TimeFrame Inc. - 2021", scattered calendar blocks (JULY 30, SEPTEMBER 14…) as background. [VERIFIED fetch]
3. **Procreate Pocket (coming-soon page)** — https://procreate.art/pocket. Technique: scroll-driven LIGHT→DARK theme swap with a gradient sweeping through image and text — instead of hard section blocks.
   "[3:41] it's gonna change to dark theme and that gradient runs through the image and the text" · "[4:04] you can seamlessly fade through each one of those".
   Fetched this session: URL now serves the normal product page ("Procreate Pocket — Sketch. Paint. Create. Anywhere.") — the scroll page was replaced. [VERIFIED fetch; 2021 page state known only from transcript = PLAUSIBLE for that design]
4. **The Alienist — Angels of Darkness** — https://the-alienist-s2.us.dev.monkapps.com. Technique: preloader where the cursor is the loading bar, blend-mode custom cursor, scroll transition effects, grungy red-tint photography.
   "[4:30] my cursor is actually the loading bar" · "[4:56] check out this custom cursor they have with this nice blend mode over everything".
   Fetched this session: monkapps now answers "404 File not Found" — the experience is gone (was a TV-show promo dev site). [VERIFIED fetch of its death; content PLAUSIBLE-UNCHECKED]
5. **Milkshake Studios — 2020 Year in Review** — https://2020.milkshake.studio. Technique: draggable physics numbers, stacked giant numerals, filled→outline text swap with images floating through case-study titles.
   "[6:26] you can click and drag these numbers around … they got some physics on there" · "[6:41] it swaps to an outline for the text to slide over it".
   Fetched live this session: "A (CHAOTIC) Year in Review", "Loading 100%", "Scroll to Explore". [VERIFIED fetch]

### Clip B — "5 Must-Visit Scroll-Based Website Designs" (youtube.com/watch?v=-GDZGtN37H4, Caler Edwards, uploaded 20260211) [VERIFIED via yt-dlp metadata]

1. **Jesko Jets** — https://jeskojets.com (transcript says "Jesco Jets"; domain verified by firecrawl search + fetch). Technique: scroll-to nav, scroll-driven zoom through a jet window, exterior→interior crossfade, magnetic-wiggle CTA.
   "[0:52] as you scroll down … it zooms in like you're looking out the window" · "[1:44] magnetic wiggle effect".
   Fetched: "Jesko Jets — Private jet charter worldwide", "We are movement", "Scroll down". [VERIFIED fetch]
2. **Lando Norris** — https://landonorris.com. Technique: monochromatic dark-green scroll theme section, liquid scroll effect, lime bars that slide in to reveal text, repeated micro-interactions; presenter notes a ~$50k custom build (likely GSAP/Three.js).
   "[3:42] we scroll to this monochromatic theme where we've got a dark green in the background" · "[4:08] little lime green bars that slide in and reveal the text".
   Fetched: "2025 Mclaren Formula 1 Driver", "tap to lock", "Back to scroll". [VERIFIED fetch; cost claim is the presenter's = INFERRED]
3. **17y** (agency) — transcript "that one's 17y.com". Technique: preloader intro, scroll through colored 3D cubes that each represent a project, satisfying audio clicks, dark-mode toggle.
   "[6:11] you scroll and you see different colored cubes, but each one of these are their projects" (ASR renders "cues"; read as cubes).
   Fetch attempt: HTTP 403 Forbidden (openresty) — live but bot-walled. [PLAUSIBLE-UNCHECKED: server exists, content not seen]
4. **Breakthrough Energy** — https://www.breakthroughenergy.org. Technique: floating images rotating in a circle, lime-green-on-black with blend-mode headings, short light/dark theme swaps to break the flow.
   "[8:23] swap from a light theme or a dark theme to vice versa just for a few sections".
   Fetched: "Empowering innovators to build the future of energy", "Scroll for more". [VERIFIED fetch]
5. **Midlife Engineering** — https://www.midlife.engineering. Technique: the product page IS the product — a working web audio device (beats/knobs/birdsong/breathe) that moves as you scroll.
   "[9:38] this is the actual product right here" · "[11:12] a product page that's actually the product".
   Fetched: interactive UI strings "AUTOPLAY · BEATS · RECORD SESSION · TRACKS". [VERIFIED fetch]

## 2. TECHNIQUES — STATE OF THE ART 2025–2026 (12)

"Static-friendly" = works as plain HTML/CSS/JS files, degrades gracefully, no build step. Every example was fetched this session.

1. **CSS scroll-driven animations (`animation-timeline: scroll()/view()`)** — example https://scroll-driven-animations.style/: "animations that are linked to the scroll position … the linked animation scrubs forward or backward in direct response" [VERIFIED]. Docs https://developer.chrome.com/docs/css-ui/scroll-driven-animations: "From Chrome version 115 there is a new set of APIs … Scroll Timelines and View Timelines" with support badges "Chrome: 115, Edge: 115, Safari: 26" [VERIFIED fetch]. Fallback: wrap in `@supports (animation-timeline: view())` — content stays static elsewhere. Best fit for plain files (no JS).
2. **Scroll-reveal (fade/slide-in once) via IntersectionObserver** — the PoC already ships it (`js/scroll-reveal.js`, read [VERIFIED-local]); universal support incl. Safari/Firefox; fully static-friendly.
3. **Scroll-scrubbed zoom / media crossfade** — example https://jeskojets.com/ fetched [VERIFIED page]; zoom itself evidenced by transcript quote [VERIFIED]. Needs rAF scrub or CSS `view()` timeline; fallback = plain image. Static-friendly (JS optional).
4. **Scrollytelling with pinned panels (sticky + step progression)** — example https://pudding.cool/: "A digital publication that … explains ideas with visual essays" [VERIFIED fetch]. `position:sticky` + IO works everywhere; static-friendly.
5. **Horizontal scroll / snap gallery** — FC Nantes "atypical horizontal scroll" via DesignRush quote in PRIOR WORK §C [PLAUSIBLE-UNCHECKED this session]; already implemented in the PoC gallery (`.gallery-scroller` snap + prev/next buttons, read [VERIFIED-local]). Most compatible technique there is.
6. **Layered parallax** — example Awwwards page for Columbus Travel shows a curated element "Parallax Hero Animation" [VERIFIED fetch]. CSS-only (transform on scroll via `view()` or small JS); static-friendly.
7. **Line-by-line / masked typography reveal** — Lando Norris bar-wipe reveal [VERIFIED transcript] + page live [VERIFIED fetch]. CSS `clip-path` + IO or `view()`; static-friendly, reduced-motion = show text.
8. **Sticky card stacks / stacked numerals** — Milkshake 2020: "they just kind of stack these back and forth" [VERIFIED transcript], page fetched live [VERIFIED fetch]. CSS sticky per card; static-friendly.
9. **Custom / magnetic cursor, blend-mode** — Milkshake 2020 fetched [VERIFIED]; Alienist blend cursor [transcript VERIFIED; page now dead]. JS + `mix-blend-mode`; must degrade to the OS cursor on touch — never hide the only pointer. Static-friendly.
10. **Preloader / intro moment** — Milkshake 2020 fetched page literally contains "Loading 100%" + "Scroll to Explore" [VERIFIED fetch]; 17y preloader [PLAUSIBLE-UNCHECKED, 403]. Cheap JS; keep ≤1.5 s, skippable, `prefers-reduced-motion` → skip.
11. **Marquee / kinetic type** — linear.app fetched: the heading "The product development system for teams and agents" repeats in the DOM as a scrolling marquee track [VERIFIED fetch; marquee reading INFERRED]. Pure CSS keyframes; static-friendly; pause on hover + honor reduced-motion.
12. **Smooth-scroll + pro animation libs** — Lenis https://lenis.dev/: "The smooth scroll library … now the default smooth scroll across the industry — even powering libraries like Locomotive Scroll" [VERIFIED fetch]; GSAP https://gsap.com/: "A wildly robust JavaScript animation library … silky-smooth performance" (ScrollTrigger is its scroll plugin) [VERIFIED fetch]. JS via CDN — works as static files served over http(s); without them pages stay fully usable.
    Bonus — **theme-switch-on-scroll** (both clips' standout): Breakthrough + Procreate examples §1 [VERIFIED transcript]; a `data-theme` section + CSS tokens swap; trivially static-friendly and PoC-ready (its tokens are already all custom properties).
    **Grain/noise aesthetic**: no fetched text can prove grain — INFERRED from transcript "grungy washed out image" (Alienist). Implement as inline SVG feTurbulence, opacity ≤0.05, cheap + static.
    **Lottie-style animation**: clip A description covers "Lottie animations" [VERIFIED fetch of description]; needs a JS player (network or vendored file) — heavier; a CSS/SVG-line alternative fits the PoC better.

## 3. SITES WORTH REVERSE-ENGINEERING (all fetched this session unless tagged)

| # | Site | URL | What it does (fetched quote) | Scroll/visual techniques |
|---|---|---|---|---|
| 1 | Jesko Jets | https://jeskojets.com | "Private jet charter worldwide" / "We are movement" | scroll-zoom window, exterior→interior fade, magnetic CTA [VERIFIED] |
| 2 | Lando Norris | https://landonorris.com | "2025 Mclaren Formula 1 Driver", "Back to scroll" | monochrome theme sections, bar-wipe text reveal, helmet grid [VERIFIED] |
| 3 | Midlife Engineering | https://www.midlife.engineering | "Sound therapy for a harmonious mind"; page shows "AUTOPLAY … BEATS … TRACKS" | page-as-product widget, scroll-moved product [VERIFIED] |
| 4 | Breakthrough Energy | https://www.breakthroughenergy.org | "Empowering innovators to build the future of energy", "Scroll for more" | floating-image circle, blend-mode headings, light/dark swaps [VERIFIED] |
| 5 | TimeFrame (Webflow demo) | https://timeframe-app.webflow.io | "TimeFrame Inc. - 2021" — one-page scroll story with calendar-block background | giant single scroll interaction, theme changes [VERIFIED] |
| 6 | Milkshake 2020 Review | https://2020.milkshake.studio | "A (CHAOTIC) Year in Review", "Loading 100%", "Scroll to Explore" | preloader, draggable physics numbers, outline-text swap [VERIFIED] |
| 7 | The Clip Joint (salon) | https://www.theclipjointsalon.com | full-bleed photo sections worded "Modern / Timeless / Eclectic / Custom Color" | one-word section flow [VERIFIED; matches prior-work §B] |
| 8 | Gentlemen Barber Clubs | https://gentlemen-barberclubs.de | German dark retreat positioning, "Jetzt hier einen Termin buchen ↓ / Anrufen" | dark single-page, scroll-to-booking anchor [VERIFIED; matches prior-work §B] |
| 9 | Columbus Travel (Awwwards) | https://www.awwwards.com/sites/columbus-travel | "told as a flight. A scroll-driven ascent above the clouds moves through its services" | parallax hero animation [VERIFIED page; site columbus-travel.com not fetched] |
| 10 | NY Phil — New York's New Maestro (Awwwards) | https://www.awwwards.com/sites/new-yorks-new-maestro | curated element "Entry Scroll Trigger" + "Type animation" [VERIFIED page] | scroll-trigger intro, type animation [VERIFIED page; site not fetched] |
| 11 | Procreate Pocket | https://procreate.art/pocket | now a clean product page "Sketch. Paint. Create. Anywhere." | (former scroll theme-swap: transcript §1) [VERIFIED current page] |
| 12 | Lusion | https://www.lusion.co | "We create 3D visual storytelling and interactive web experiences", "scroll to explore" | WebGL storytelling, preloader aesthetic [VERIFIED fetch] |
| 13 | 17y | https://17y.com | cube-project scroll gallery per clip B | 403 openresty bot-wall [PLAUSIBLE-UNCHECKED] |
| 14 | The Alienist promo | https://the-alienist-s2.us.dev.monkapps.com | "404 File not Found — monkapps" — content deleted | [VERIFIED-gone; techniques from transcript] |
| 15 | Proto Homes | https://www.protohomes.com | defaced ("Your site has been hacked!") — lesson: reference sites rot [VERIFIED] | — |
| — | Curated galleries (fetched) | https://www.awwwards.com/websites/scrolling/ · https://godly.website/ | Awwwards: "Best selection of Scrolling Website examples"; godly entries incl. "the life of a cursor", "reveal to copy interaction" | discovery sources [VERIFIED] |
| — | Technique sources (fetched) | scroll-driven-animations.style · developer.chrome.com scroll-driven docs · lenis.dev · gsap.com · motion.dev ("Hardware-accelerated scroll-linked motion via ScrollTimeline") · pudding.cool · linear.app · apple.com/uk/airpods-pro | libraries/docs for §2 [VERIFIED] |

## 4. PoC INVENTORY — what a redesign must preserve [VERIFIED: files read this session]

- **Sections & anchors** (index.html): Hero `#top` → `#om` "Om mig" → `#tjanster` "Tjänster" → `#galleri` "Galleri" → `#boka` "Boka tid" → `#kontakt` "Kontakt"; section eyebrows + Swedish headings ("Hår som känns som ditt", "Det här kan jag", "Före & efter"…).
- **Nav**: brand "Anny Morin"; items Om mig/Tjänster/Galleri/Kontakt + Instagram link (`rel="me"`) + `.nav-cta` "Boka tid"; footer mirrors all five anchors.
- **Galleri**: horizontal snap-scroller `role="group" tabindex="0"` with prev/next buttons; 6 `<figure>` cards `data-img-slot="images/gal-01…06.jpeg"`, tags Före/Efter + titles (Långt blont, Kortare blont, Bal, Skäggtrim); gradient placeholders labelled "Bild kommer" (no 404s).
- **Boka tid**: demo calendar built by `js/booking-mock.js` into one grid template (invariant I3); native `<dialog>` confirm→done views; `demo-badge` "Demo — ingen bokning genomförs"; real booking always via tel 072-155 48 60 / IG @mullers.anny.
- **Kontakt**: form namn/e-post/meddelande with client validation + `role="status" aria-live="polite"`; address Landbrogatan 11; `tel:`/`mailto:` links; öppettider pending.
- **Architecture**: static files, NO build step; CSS order `tokens.css → layout.css → components.css` (C2), custom properties ONLY in tokens.css (C1); dark mode via `prefers-color-scheme` with WCAG-checked pairs (copper accent `#9a3f1f` 6.76:1); system fonts only (offline rule); `js/scroll-reveal.js` = hero word-build + IO reveals, gated by `data-reveal-ready` so no-JS sees everything, full `prefers-reduced-motion` bypass; `data-*` hooks, `defer`, no globals (C3); a11y: skip-link, aria-labelledby, native dialog.
- **Must-preserve for "applicable"**: all six anchors + Swedish labels · booking/contact TRUTH model (demo labels, pending-owner comments I1/I2) · static-file constraint (no bundler) · reduced-motion + no-JS fallbacks · token-per-file discipline (a theme = a tokens.css swap) · **open question for owner**: §5 uses Google Fonts, which breaks the current "no CDN / offline" rule — one ruling, or vendor the font files locally.

## 5. THE 10 DESIGN DIRECTIONS (build brief — content unchanged, all sections/anchors kept)

Each = tokens.css palette + fonts + 2–3 §2 techniques + a §1/§3 reference. All static-friendly. Fonts are Google Fonts with system fallbacks (see §4 open question).

**01 Redaktoriell serie — "Müllers-editorial"** (evolves today's look)
Concept: the current calm editorial line, sharpened: big serif, slow reveals, photos carry color. Palette: `#faf6f1` bg, `#1c1917` ink, `#9a3f1f` copper, `#78716c` muted. Fonts: Fraunces (display) + Inter (body). Techniques: hero word-build upgrade (2), line-mask reveal (7), sticky section eyebrow (4-lite). Takes after: Procreate Pocket page + prior-work DesignRush monochrome-minimal pattern.

**02 Mörk neon — "Salongen after dark"**
Concept: near-black salon at night, one acid accent — Lando's monochrome discipline, copper instead of lime. Palette: `#0c0a09` bg, `#f5f5f4` text, `#c8f542` acid-lime OR keep `#fb923c`, `#292524` surfaces. Fonts: Space Grotesk (display) + Archivo (body). Techniques: scroll-driven theme-switch between sections (bonus §2), bar-sweep text reveal (7), CSS scroll-timeline progress hairline under the header (1). Takes after: landonorris.com + Breakthrough dark sections.

**03 Varmt papper — "Papper & sax"**
Concept: warm paper minimal, hairline rules, almost no motion except a gentle parallax portrait — Japanese-salon calm. Palette: `#f6f1e7`, `#211d1a`, `#8a8f76` sage, `#b45f2e`. Fonts: Lora (display) + Work Sans (body). Techniques: layered parallax (6), fade-in-on-view once (2), light/dark swap for Boka section only (bonus). Takes after: Breakthrough light sections + Midlife cleanliness.

**04 Brutalt tryck — "Klipp det korta"**
Concept: poster-brutalist: giant numerals for the services list (01 Klippning…05 Barbering), black/red, physics-draggable scissors sticker in the hero. Palette: `#ffffff`, `#0a0a0a`, `#e11d48` signal red, `#e7e5e4`. Fonts: Archivo Black (display) + Space Mono (meta). Techniques: stacked giant numerals (8), draggable physics hero element (Milkshake pattern), marquee strip of service words (11). Takes after: 2020.milkshake.studio.

**05 Mjuk glas — "Svala toner"**
Concept: soft pastel glass — frosted cards float over a dusty gradient; gallery as glass postcards. Palette: `#eef0ea` bg, `#3f4a44` ink, `#c9a7a0` dusty rose, `#a7bcc3` mist, cards `rgba(255,255,255,.55)`+blur. Fonts: DM Sans (body) + Newsreader italic (display). Techniques: sticky card stack for Tjänster (8), snap gallery with scale-on-approach (5), gentle parallax blobs (6). Takes after: TimeFrame's soft blocks + godly glass entries.

**06 Cinematiskt — "Möt dig i spegeln"**
Concept: full-bleed cinematic scroll: hero is a mirror-window that scroll-zooms into (Jesko's jet window → the salon chair), exterior→interior crossfade into Om mig. Palette: `#111213`, `#eae6df`, `#c8a15e` champagne, `#5c6672`. Fonts: Cormorant Garamond (display) + Manrope (body). Techniques: scroll-scrubbed zoom/crossfade (3), magnetic CTA (9-lite), preloader 1.2 s (10). Takes after: jeskojets.com.

**07 Retrofilm — "Silverkorn"**
Concept: 70s film promo: grain overlay, oxblood tint, blend-mode cursor circle that inverts the photo under it, typewriter meta lines. Palette: `#f3ecdc`, `#2a1512`, `#8f2d24` oxblood, `#3f5c55` faded teal. Fonts: DM Serif Display (display) + IBM Plex Mono (body/meta). Techniques: grain + custom blend cursor (9), preloader count-up (10), Ken-Burns gallery hover. Takes after: The Alienist clip section (transcript-evidenced [PLAUSIBLE page]).

**08 Organiskt hantverk — "Uppväxt i Blekinge"**
Concept: warm handcrafted: hand-drawn SVG underlines that stroke-draw as you scroll to each heading, wavy section dividers, booking calendar framed as the interactive "product demo" (Midlife page-as-product). Palette: `#f4efe6`, `#33402e` olive, `#c26d3d` terracotta, `#e4dfcf` sand. Fonts: Bitter (display) + Karla (body). Techniques: SVG stroke-draw via `view()`/IO (7), page-as-demo booking (Midlife pattern §3), reveal-on-view (2). Takes after: midlife.engineering.

**09 Schweizertåg — "Rutinerat"**
Concept: Swiss grid, numbered sections (01–06), hairline rules, cobalt accent, reading progress — restrained but engineered-feeling. Palette: `#ffffff`, `#111111`, `#1e40ff` cobalt, `#d4d4d4`. Fonts: Archivo (display) + IBM Plex Mono (numbers/meta). Techniques: CSS scroll-driven animations — progress bar + grid reveals, no JS where possible (1), horizontal snap ticker of services (5), marquee keywords (11). Takes after: Columbus Travel precision + Awwwards scrolling-gallery standards.

**10 Magasincollage — "Före & efter, omaka"**
Concept: magazine collage: gallery becomes scattered, slightly rotated postcards on scroll; case-study titles swap to outline as images float over them (Milkshake's signature), draggable on desktop. Palette: `#fbf7f2`, `#141414`, `#7c3aed` violet pop, `#facc15` accent yellow, `#e5e1da`. Fonts: Playfair Display (display) + Outfit (body). Techniques: outline-swap titles + floating images (8), draggable physics cards (Milkshake pattern), parallax collage layers (6). Takes after: 2020.milkshake.studio + godly collage entries.

All ten keep: six Swedish sections + anchors, demo-honest booking, tokens.css-swap-ability, reduced-motion and no-JS fallbacks, static deployment.

---
Scratch: transcript/quote files in `.tmp/` (clip_flow.txt, clip2_flow.txt, md_*.txt, raw_*.json). Prior-work path cited at top.
