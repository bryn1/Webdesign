# Scroll-design research 2 — TEN NEW directions (11–20) for the Anny Morin PoC

MC 10088 · 2026-10-04 · research profile · Batch 2 of the customer-facing theme library.
Purpose: 10 NEW distinct themes (11–20) for the same six Swedish sections (BRIEF.md), visibly different
from 01–10 in research.md §5. Method: fonts probed via `curl https://fonts.googleapis.com/css2?family=…`
(all return `@font-face` CSS, zero error pages — probe list in evidence file `.tmp/font_probes.txt`);
references fetched THIS session via firecrawl (`192.168.5.20:3002/v1/scrape`) or the dsh browser
(playwright) for visual claims; existing-theme palettes/fonts re-read from research.md §5 +
`prototypes/*/css/tokens.css` + `index.html` [VERIFIED-local].
Tags: VERIFIED = fetched this session + quote supports claim · INFERRED · PLAUSIBLE-UNCHECKED · CONTRADICTED.
Collision rule (task): a theme sharing ≥2 of {bg color family, display font, primary technique} with 01–10
is rejected. All ten below share at most ONE dimension with any existing theme — matrix at the end.
One subject (the next ten directions); kept whole under ~350 lines.

## 6. THE NEXT TEN (11–20)

New-technique ids **N1–N5** are introduced here; §2 ids (1–12 + bonus) are reused by number from research.md §2.

### 11 · Aindyp — "Blå färgbrunn" *(japanese indigo)*
Concept: aizome discipline — deep indigo field, washi-white type, one vermilion seal accent; calm vertical sections.
Palette: bg `#1c2a45` indigo · surface `#16213a` · text `#f2ede3` washi · accent `#d94f30` vermilion · muted `#6b7a99`.
Fonts: Zen Old Mincho (display) + Zen Kaku Gothic New (body) [probe ✓ VERIFIED].
Techniques: **N1 horizontal counter-scroll split columns** (Tjänster: sticky left heading, right column drifts the
opposite way via scroll-timeline + reversed direction, §1); **N2 section-snap vertical scroll-snap** (MDN fetched:
"the scroll container will re-snap to the previously snapped content" [VERIFIED]); seigaiha SVG band parallax (6).
Reference: https://www.aizome.co.jp/ — premium indigo maker. "Today we are recognised as the world's premium maker of
specialist indigo dyed cloth used in the making of the traditional uniform for practitioners of kendo." [VERIFIED fetch].
Distinct: navy bg family is unused by 01–10 (their darks are neutral/cool near-black) — shares ≤1 dim (parallax) with 03.

### 12 · Salongskatt — "Den förgyllda salongen" *(luxe art-deco)*
Concept: grand-hotel luxe: deep emerald walls, thin gold deco frames drawn as you arrive, champagne photo light.
Palette: bg `#0d211b` emerald · ink `#0a1512` · gold `#c9a55a` · text `#f4ead8` · blush `#7d4a45`.
Fonts: Cinzel Decorative (display) + Marcellus (body) [both probe ✓ VERIFIED].
Techniques: **N3 clip-path iris reveal** for gallery photos (circular `clip-path` opened by `view()` timeline, §1);
gold deco-frame SVG stroke-draw on section heads (7-kin, secondary — 08 owns stroke-draw as PRIMARY, here it is not);
gold hairline bar-sweep under nav (7).
Reference: https://www.grandhotel.se — "Grand Hôtel Stockholm har varit hem för storslagna evenemang och helt vanliga
livsnjutare sedan 1874. Läget är det bästa tänkbara, vid vattnet mitt emot Stockholms slott…" [VERIFIED fetch; the
deco *styling* is ours — the reference supplies the grand-luxe feeling, INFERRED mapping].
Distinct: emerald bg family unused; Cinzel unique; primary (clip-path iris) unique → 0 dim shared with any theme.

### 13 · Klippklistra — "91-tal" *(90s Memphis play)*
Concept: paper-cutout joy: mint field, scattered geometric confetti that rotates as you scroll, chunky black outlines,
services as sticker shapes. Photo-friendly, loud, fun.
Palette: bg `#bfe6dd` mint · ink `#17171b` · red `#ff5a5f` · yellow `#ffd23f` · blue `#2b3a8c`.
Fonts: Rubik Mono One (display) + Epilogue (body) [probe ✓ VERIFIED; Bungee probed ✓ as alt].
Techniques: **N4 scroll-rotated confetti field** (geometric SVG shapes rotate/translate on `view()` progress, §1);
marquee strip of service words (11, secondary); draggable sticker cards (Milkshake pattern §5-04 kin, secondary).
Reference: https://memphis-milano.com (serves the Memphis Milano site) — big letterspaced "M E M P H I S M I L A N O",
tagline "MORE COLORFUL MORE JOYFUL", named pattern assets Mucca / Micidial / Bacterio / Terrific loaded as SVG tiles
[VERIFIED fetch].
Distinct: mint field vs 05's sage pastel counts as the closest read = 1 dim; fonts + primary unique. Zero collisions.

### 14 · Nyhetspapper — "Dagens frisyr" *(broadsheet newsprint)*
Concept: the salon as a newspaper: masthead headline, multi-column grid with hairline rules, halftone-treated photos,
dateline updates itself in JS. Editorial but loud in a different register than 01.
Palette: bg `#e8e5de` cool newsprint · ink `#141414` · rules `#4b4b4b` · accent red `#b3261e` (press red).
Fonts: Libre Bodoni (display — Didone masthead) + Source Serif 4 (body) [both probe ✓ VERIFIED].
Techniques: **N5 halftone/newsprint image treatment** (grayscale+contrast filter, dot screen via repeating-gradient
+ `mix-blend-mode` — MDN fetched: property "sets how an element's content should blend with its backdrop — the content
rendered behind the element" [VERIFIED]); multi-column grid + column rules (pure CSS); sticky masthead + running dateline.
Reference: https://www.theguardian.com/international — "Latest news, sport and opinion from the Guardian"; front page
leads with "Brazil goes to polls in decisive election for future of Latin America" in section-blocked columns
[VERIFIED fetch; broadsheet-grid reading of the fetched structure = INFERRED].
Distinct: cool newsprint gray vs 01/07's warm creams = closest read 1 dim; Bodoni + halftone unique. Zero collisions.

### 15 · Bilderboken — "Sagan om klippet" *(illustration-led — PHOTO-INDEPENDENT)*
Concept: a picture-book of the visit: flat vector illustrations (chair, scissors, hair shapes) carry every section;
works with ZERO of the 4 photos — F1-proof option #1.
Palette: bg `#fdeaf2` soft rose · ink `#1d2340` · violet `#7c5cff` · pink `#ff8fab` · green `#06d6a0`.
Fonts: Bricolage Grotesque (display) + Nunito Sans (body) [probe ✓ VERIFIED; Patrick Hand probed ✓ as caption accent].
Techniques: pinned visual + scrolling text (4 — pudding.cool re-fetched THIS session: "A digital publication that …
explains ideas with visual essays" [VERIFIED]); SVG line-draw of illustration outlines (7-kin, secondary);
bounce-in reveals (2 variant).
Reference: https://www.awwwards.com/websites/illustration/ — "Best selection of Illustration Website examples for your
inspiration…" [VERIFIED fetch; a curated showcase page, not a single site — same reference type research.md §3 used
for Columbus/Awwwards entries].
Distinct: rose field + Bricolage + pinned-story primary vs 05 (sage, Newsreader, sticky card stack) ≤1 dim. Zero collisions.

### 16 · Norrsken — "Gradientljus" *(animated gradient mesh)*
Concept: a cold-white page with a living aurora band bleeding in from the corner; headings filled with a moving
gradient; light, modern, premium-tech feel — Stripe's signature translated to a salon.
Palette: bg `#f7f6fc` cool white · ink `#17131f` · mesh violet `#7c3aed` / pink `#ec4899` / amber `#f59e0b` / blue `#6366f1`.
Fonts: Sora (display) + Plus Jakarta Sans (body) [probe ✓ VERIFIED].
Techniques: **N6 animated gradient mesh** (keyframed drifting `radial-gradient` layers — static-friendly CSS;
capability is plain CSS, the *reference* proves the look in production: see screenshot); gradient text fill
(`background-clip:text`, visible in the Stripe hero); scroll-driven glow intensity (1).
Reference: https://stripe.com/en-se fetched + screenshot THIS session (`out/.tmp/ref_stripe-hero.jpg`): "Financial
infrastructure to grow your revenue. Accept payments … from your first transaction to your billionth." — headline's
violet gradient fill and a full-bleed rainbow mesh sweeping from the top-right corner are VISIBLE in the screenshot
[VERIFIED visual, screenshot saved]. Side finding [CONTRADICTED]: vercel.com, the usual "aurora" go-to, now serves a
LIGHT monochrome page (screenshot `.tmp/ref_vercel-hero.jpg`) — do not pitch Vercel as the gradient reference.
Distinct: cool white bg = 1 dim shared with 04/09; Sora + mesh primary unique. Zero collisions.

### 17 · Gamla biblioteket — "Mörk akademien" *(dark academia)*
Concept: candle-lit study: aubergine-brown leather field, old-style serif, photos breathe under an inked vignette,
quiet scholarly footnotes in the margins.
Palette: bg `#2b1d20` aubergine · text `#e9dfc9` parchment · brown `#5a4038` · gold-pen `#a98d5f`.
Fonts: EB Garamond (display) + Spectral (body) [probe ✓ VERIFIED].
Techniques: scroll-scrubbed Ken Burns "breathing" gallery photos (3-kin — slow zoom only, no crossfade drama) +
inked vignette overlay; reveal-on-view (2); marginalia that fades per `view()` (7-lite).
Reference: https://www.atlasobscura.com — "The Definitive Guide To The World's Hidden Wonders … From ancient relics
to roadside oddities, we connect you to the best travel destinations out there." [VERIFIED fetch; supports the
quietly-curios, dark editorial mood — exact palette is ours, INFERRED mapping].
Distinct: aubergine bg unused; EB Garamond unique; shares ≤1 dim (scrub family) with 06. Zero collisions.

### 18 · Rörlig bokstav — "Bara typsnitt" *(kinetic type, monochrome — PHOTO-INDEPENDENT)*
Concept: the whole site is typography: huge Anton headlines that morph scale/weight on scroll, scramble-decode
reveals, one hairline rule as decoration. Photos optional entirely — F1-proof option #2.
Palette: bg `#050505` · text `#ffffff` · grey scale `#9a9a9a` / `#3a3a3a` · no accent color at all.
Fonts: Anton (display) + Public Sans (body) [probe ✓ VERIFIED].
Techniques: **N7 scramble/typewriter text decode** on every section eyebrow (JS char-scramble; typewriter kin already
shipped in theme 07, here it is the PRIMARY language); type-only kinetic sequence — headline font-weight/scale morph
via `view()` timeline (1); marquee rails of service words (11).
Reference: https://www.awwwards.com/websites/typography/ — "Best selection of Typography Website examples for your
inspiration… Typography is the art and technique of arranging type…" [VERIFIED fetch; curated showcase, tagged as such].
Distinct: pure-black field = 1 dim with 02/06 (their bg is near-black too) — Anton + scramble primary + no-accent
make it read as nothing like them. Zero collisions.

### 19 · Duotongvaggen — "Galerieväggen" *(duotone gallery wall)*
Concept: art-gallery on a mustard wall: every photo duotoned to ink-on-gold, works hung with brass plates (service
names), 3D tilt when you move the mouse over a frame.
Palette: bg `#c9a227` muted mustard · ink `#171208` · text `#fffaf0` · frame-white `#f5efe2` · brass `#8a6d1f`.
Fonts: Syne (display) + IBM Plex Sans (body) [probe ✓ VERIFIED].
Techniques: **N8 duotone image treatment** (grayscale + gradient-map overlay via `mix-blend-mode` — MDN backdrop-
blend definition cited under 14 [VERIFIED]); **N9 3D CSS card tilt** on gallery frames (pointermove → rotateX/Y,
pure JS); horizontal snap gallery (5, secondary — already PoC-native).
Reference: https://www.moma.org — "Welcome — Explore art and ideas at MoMA." exhibition wall incl. "Full Disclosure:
The Edge of Information Design" [VERIFIED fetch; supports the white-cube-hung-as-wall mood, inverted to a colored wall].
Distinct: mustard bg unused by anyone; Syne unique; duotone primary unique. Zero collisions.

### 20 · Pixelhall — "Mynta" *(retro-tech / arcade)*
Concept: the salon as an arcade cabinet: CRT navy-black, neon green/magenta, scanline overlay, services as selectable
menu items, booking as "INSERT COIN" — playful but still readable (press-start only for display).
Palette: bg `#0b0d17` CRT navy · neon green `#3dfc67` · magenta `#ff2ec4` · cyan `#31e1ff` · text `#e6f6ee`.
Fonts: Press Start 2P (display/meta ONLY) + Chakra Petch (body) [probe ✓ VERIFIED; VT323 probed ✓ as alt].
Techniques: **N10 CRT scanlines + glow** (`repeating-linear-gradient` overlay + text-shadow glow, static CSS);
pixel-stepped scroll progress bar (1-kin); scramble text on the hero word (N7, secondary — shared language with 18,
which is allowed between new themes).
Reference: https://www.atari.com — "Atari | Official Games, Consoles, Merch & News", promo strip "$100K Ultimate
Arcade Sweepstakes" [VERIFIED fetch — the retro brand's own revived store front].
Distinct: dark field = 1 dim with 02/06; Press Start 2P + CRT primary unlike anything in 01–10. Zero collisions.

### New-technique evidence (N-ids, fetched this session)

| N | Technique | Evidence fetched this session | Tag |
|---|---|---|---|
| N1 | counter-scroll split columns | mechanism = CSS scroll-timeline (§2-1, research.md VERIFIED); usage pattern INFERRED | INFERRED (buildable §1) |
| N2 | section-snap vertical hijack | MDN scroll-snap-type: "the scroll container will re-snap to the previously snapped content" | VERIFIED |
| N3 | clip-path iris reveal | CSS `clip-path` is core; scroll-bound via §1 `view()` (VERIFIED §2) | INFERRED (buildable §1) |
| N4 | scroll-rotated confetti | transform-on-scroll = §1/§6 VERIFIED mechanisms, composition new | INFERRED (buildable) |
| N5 | halftone/newsprint | MDN mix-blend-mode: "sets how an element's content should blend with its backdrop — the content rendered behind the element" | VERIFIED |
| N6 | animated gradient mesh | stripe.com hero screenshot (`.tmp/ref_stripe-hero.jpg`) shows the look in production | VERIFIED (visual) |
| N7 | scramble/decode type | no doc fetched; mechanism is plain setInterval char-swap; typewriter kin shipped in 07 | INFERRED |
| N8 | duotone gradient-map | MDN mix-blend-mode (as N5) | VERIFIED (mechanism) |
| N9 | 3D card tilt | pointermove + `perspective/rotate` — standard CSS 3D, no doc fetched | INFERRED |
| N10 | CRT scanlines | `repeating-linear-gradient` — core CSS | INFERRED |

## 7. NON-OVERLAP MATRIX vs 01–10

Existing bg families (re-read this session from tokens.css [VERIFIED-local]): warm cream/paper (01 `#faf6f1`,
03 `#f6f1e7`, 07 `#f3ecdc`, 08 `#f4efe6`, 10 `#fbf7f2`) · neutral near-black (02 `#0c0a09`, 06 `#111213`) ·
white (04 `#ffffff`, 09 `#ffffff`) · sage pastel (05 `#eef0ea`).
Existing display fonts: Fraunces, Space Grotesk, Lora, Archivo Black, Newsreader, Cormorant Garamond,
DM Serif Display, Bitter, Archivo, Playfair Display — NONE reused in 11–20 [VERIFIED-local grep of index.html].

| New | bg family | display font | primary technique | closest existing (shared dims) | verdict |
|---|---|---|---|---|---|
| 11 Aindyp | navy | Zen Old Mincho | counter-scroll | none (0 dims) | no collision |
| 12 Salongskatt | emerald | Cinzel Decorative | clip-path iris | 08 stroke-draw, 1 dim (secondary only) | no collision |
| 13 Klippklistra | mint pastel | Rubik Mono One | rotating confetti | 05 pastel bg, 1 dim | no collision |
| 14 Nyhetspapper | cool newsprint gray | Libre Bodoni | halftone treatment | 07 warm paper bg, 1 dim | no collision |
| 15 Bilderboken | rose pastel | Bricolage Grotesque | pinned visual+text | 05 pastel bg / sticky kin, ≤1 dim | no collision |
| 16 Norrsken | cool white | Sora | animated mesh | 04/09 white bg, 1 dim | no collision |
| 17 Gamla bibl. | aubergine | EB Garamond | Ken Burns breathing | 06 scrub family, 1 dim | no collision |
| 18 Rörlig bokstav | pure black | Anton | scramble decode | 02/06 near-black bg, 1 dim | no collision |
| 19 Duotongvägg | mustard | Syne | duotone treatment | none (0 dims) | no collision |
| 20 Pixelhall | CRT navy | Press Start 2P | CRT scanlines | 02/06 dark bg, 1 dim | no collision |

**Unresolved collisions: 0.** Every new theme is visibly distinct: 4 unused dark sub-families (emerald/aubergine/
mustard reads light-field… navy/aubergine/mustard are hue-fresh), 4 fresh light fields (mint/rose/cool-white/newsprint),
10 display fonts never used in 01–10.

Cross-check vs the quality bar: feelings spread across luxe deco (12), japanese indigo (11), 90s play (13),
broadsheet (14), picture-book (15), aurora tech (16), dark academia (17), monochrome kinetic (18), gallery pop (19),
arcade (20). **Photo-independent showcases: 15 (illustration) and 18 (type-only) build fully with zero photos**;
14 and 17 degrade gracefully to one photo. All ten: six Swedish sections/anchors, demo-honest booking,
tokens.css-swap, reduced-motion + no-JS fallbacks, static files per BRIEF.md — same contract as 01–10.

Evidence scratch: `out/.tmp/ref_*.json` (firecrawl payloads), `ref_stripe-hero.jpg`, `ref_vercel-hero.jpg`
(browser screenshots), font probes `font_probes.txt`. Prior work REUSED, not re-derived: research.md §1–§5;
Annie-morin prior doc cited there. Quoted page text is untrusted crawled data, quoted not followed.
