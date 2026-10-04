# DA-verdict — research.md (scroll-design library, MC 10088)

Devil's-advocate gate over `.audits/202610041341-f6053f16/out/research.md`, judged as the input
document for the 10 static prototype builds (per BRIEF.md). DoD reading used: refute the doc's
claims and its fitness as a builder input; verdict on claims the doc actually makes.
Method this session: transcript quote-matching against `.tmp/clip_flow.txt` / `clip2_flow.txt`
(joined caption streams), 10 fresh firecrawl/`web_fetch` probes, 1 Google-Fonts batch probe,
1 yt-dlp metadata probe, direct reads of `/home/claudecode/Annie hemsida/` (index.html, css, js,
DESIGN.md, images/README.md). My probes are in `.tmp/da_*.{json,css,txt}`.

## Check 1 — §1 clip quotes: PASS, no invented quotes

All 20 §1 quote lines appear verbatim in the transcript streams at the claimed timestamps
(±3 s). My join-and-scan evidence (start timestamps of matched phrases):

| claimed | found at | claimed | found at |
|---|---|---|---|
| A [0:11] | 00:00:11.519 | B [0:52] | 00:50.800–00:54.399 |
| A [0:30] | 00:00:30.480 | B [1:44] | 01:44.159 (exact) |
| A [2:34] | 00:02:34.720 | B [3:42] | 03:42.879 |
| A [2:54] | 00:02:54.720 | B [4:08] | 04:06.400–04:10.560 ("lime green bars…" at 04:08.239) |
| A [3:41] | 00:03:40.080–03:44.159 | B [6:11] | 06:08.880–06:15.039 |
| A [4:04] | 00:04:04.480 | B [8:23] | 08:23.440 (exact) |
| A [4:30] | 00:04:30.639 (exact) | B [9:38] | 09:35.920–09:38.000 |
| A [4:56] | 00:04:56.080 | B [11:12] | 11:12.720 |
| A [6:26]/[6:41] | 06:26.479 / 06:41.120 | §2 "grungy washed out image" | 00:04:52.880 |

Two honest normalizations, neither fabricated wording: [4:30] actual "my **my** cursor is
actually the loading bar" (stutter dropped); [0:52] "as you scroll down, ~~of course,~~ it zooms
in…" (elision marked with "…"). The doc's ASR note is truthful: at [6:11] the transcript renders
"cues" (verified; "cubes" appears elsewhere in the same section). Upload-date claims
(20210119 / 20260211, tagged "VERIFIED via yt-dlp metadata") had **no metadata artifact in
`.tmp/`** (F3, P3) — I re-probed with yt-dlp: `slDybGJI1Ao 20210119 5 Inspirational Website
Designs` and `-GDZGtN37H4 20260211 5 Must-Visit Scroll-Based Website Designs`. Claim reproduces.

## Check 2 — §1/§3 fetch claims: PASS (all reproduced with my own fetches)

Firecrawl re-fetches (noa `:3002`), quoted as returned:
- **protohomes.com** → "HACKED … By Peyman Siyahi & M@raz Ali … Your site has been hacked!" —
  defaced claim exactly reproduced.
- **the-alienist-s2.us.dev.monkapps.com** → "monkapps2 … 404 File not Found" — gone claim ✓.
- **17y.com** → "403 Forbidden … openresty" — bot-wall tag PLAUSIBLE-UNCHECKED is the right call ✓.
- **jeskojets.com** → "Jesko Jets | Private jet charter worldwide | We are movement | … Scroll
  down" — all 4 claimed strings present.
- **landonorris.com** → "2025 Mclaren Formula 1 Driver", "tap to lock", "Back to scroll" present.
- **breakthroughenergy.org** → "Scroll for more" present; heading renders "Empowering
  innovatorsto build the futureof energy" (firecrawl drops spaces at line breaks — existence AND
  support both confirmed).
- **2020.milkshake.studio** → "A (CHAOTIC) Year in Review", "Loading 100%", "Scroll to Explore" ✓.
- **timeframe-app.webflow.io** → "TimeFrame Inc. - 2021" ✓; the calendar claim "JULY 30,
  SEPTEMBER 14" renders as split lines "JULY\n\n30 … SEPTEMBER\n\n14" in markdown — supported ✓.
- **procreate.art/pocket** → product page "Procreate Pocket / Sketch. Paint. Create. Anywhere." ✓.

Existence ≠ support was checked per string; nothing failed for a real reason (the two apparent
misses were markdown line-split artifacts, both present in the fetched text).

## Check 3 — §2 technique claims: PASS

- Chrome scroll-driven docs re-fetched (`hl=en`): "From Chrome version 115 there is a new set of
  APIs", "Scroll Timelines and View Timelines", badges "Chrome: 115", "Edge: 115", "Safari: 26"
  all present. The Chrome-115 support claim is right.
- scroll-driven-animations.style: both quoted phrases present in my fetch ("linked to the scroll
  position", "scrubs forward or backward").
- "Static-friendly" holds under the PoC constraints (no backend, no bundler): every §2 technique
  is IntersectionObserver / `@supports`-gated CSS / small JS, or a CDN lib (GSAP/Lenis) which
  BRIEF.md explicitly permits from cdnjs/jsDelivr with the page still readable without JS and
  without network. No direction in §5 requires WebGL or a build step.

## Check 4 — §4 PoC inventory vs reality: PASS with one gap (F1)

Confirmed row by row in `/home/claudecode/Annie hemsida/`: six section ids in claimed order
(index.html:70–253); Swedish h2s "Hår som känns som ditt" / "Det här kan jag" / "Före & efter" /
"Välj en tid — sedan bokar du via telefon eller Instagram" / "Hitta mig eller skriv till mig" ✓;
nav = Om mig/Tjänster/Galleri/Kontakt + `rel="me"` IG + `.nav-cta` "Boka tid" (:55–62), footer
mirrors all five anchors (:354–358) ✓; gallery `role="group" tabindex="0"` + prev/next
(:158–163), 6 `data-img-slot="images/gal-01…06.jpeg"`, "Bild kommer" labels ×6 ✓;
`demo-badge` "Demo — ingen bokning genomförs" exact (:232) ✓; native `<dialog>` ✓; I3 = one
`.cal-grid` whose template lives only in components.css ✓ (booking-mock.js header comment,
components.css:176); contact form namn/e-post/meddelande + `role="status" aria-live="polite"`
✓; Landbrogatan 11, `tel:+46721554860`, `mailto:`, öppettider "(bekräftas snart)" ✓; CSS order
tokens→layout→components (:36–38), C1/C3 per DESIGN.md, `defer` on all 5 scripts ✓; system
fonts only, offline rule (DESIGN.md:51–53) ✓; `prefers-color-scheme` dark + `#9a3f1f` "6.76:1"
(tokens.css:27) ✓; scroll-reveal.js = hero word-build + IO + `data-reveal-ready` + reduced-motion
bypass ✓.

**F1 (P2, the real gap): the inventory never states the asset reality.** `images/` holds only
`gal-01…04.jpeg` (owner-delivered 2026-10-03, two before/after pairs; `gal-05/06` are
placeholder slots per images/README.md) and **no portrait/hero photo exists** ("Porträtt — bild
kommer" placeholder card). BRIEF.md pins the prototypes to `../_assets/gal-0N.jpeg` ×4 as well.
Directions 01 ("photos carry color"), 05 (glass postcards), 06 (full-bleed mirror-window
scroll-zoom), 07 (blend cursor "inverts the photo under it", Ken Burns) and 10 (collage) lean on
photography — every one of them must compose from 4 small owner JPEGs + gradient placeholders.
Not build-poisoning (BRIEF.md is binding and explicit), but research.md as a builder input
should have said "4 real photos, no hero/portrait — imagery-driven themes compose around that."

## Check 5 — §5 the 10 directions: PASS

Exactly 10, numbered, each = distinct palette + distinct font pair + 2–3 §2 techniques + a named
reference; all keep the six anchors, Swedish copy, demo-honest booking, reduced-motion/no-JS
fallbacks and static deploy. All executable as plain files (draggable "physics" = pointer-event
drag, allowed CDN fallback; no WebGL anywhere). **Fonts: 18/18 named families verified to exist**
in one Google Fonts css2 batch probe (HTTP 200, every name returned a @font-face block):
Fraunces, Inter, Space Grotesk, Archivo, Lora, Work Sans, Archivo Black, Space Mono, DM Sans,
Newsreader, Cormorant Garamond, Manrope, DM Serif Display, IBM Plex Mono, Bitter, Karla, Outfit,
Playfair Display.

**F4 (watch, not defect): near-neighbor pair 03 vs 08** — backgrounds `#f6f1e7` vs `#f4efe6` and
terracotta accents `#b45f2e` vs `#c26d3d` are near-identical, both warm-paper serif-display. They
stay separable through motion vocabulary (03 hairline-rules+parallax vs 08 stroke-drawn SVG
underlines + wavy dividers), but the orchestrator should hold them apart at execution. Cream
cluster overall = 01/03/08/10; 10 escapes via violet/yellow pop-collage, 01 via copper editorial.
Dark pair 02 vs 06 is safe (grotesk+acid vs serif+champagne). Net: a customer sees ten different
designs, not five — with 03/08 the one squeeze point. **F5 (P3):** direction 02 carries an open
fork "`#c8f542` OR keep `#fb923c`" — close it before its build starts.

## Check 6 — missed hazards

- F1 above is the "images limited to 4 gallery files" hazard — missing from the doc, covered only
  by BRIEF.md. **Relay into every build prompt.**
- **F2 (P3):** §4's "open question for owner: Google Fonts breaks the offline rule" is already
  answered by the binding BRIEF.md (Google Fonts + cdnjs/jsDelivr allowed, font-stack fallback,
  readable without net). No ruling needed; builders follow BRIEF.
- Dead-reference hazard handled correctly by the doc: protohomes flagged DEFACED "do NOT link or
  imitate"; the one direction taking after a dead site (07 ← Alienist) is honestly tagged
  "transcript-evidenced [PLAUSIBLE page]"; 17y is referenced but not taken after by any theme.
- LAN/offline demo risk: no §5 direction is effect-dependent on a CDN (all CSS/IO first), and
  BRIEF's without-net rule is the floor — consistent.
- P4 note: §5 doesn't restate the 375-px no-overflow rule, which marquee/ticker/postcard-collage
  directions (04/09/10) are most likely to trip; BRIEF binds anyway, builders must honor it.

## Dissent surfaced

The strongest thing against FIX was F1 — the gate brief itself named "images limited to 4 gallery
files" as the kind of hazard to hunt, and the doc missed it. I did not downgrade to FIX because
F1 is an omission in a doc whose every stated claim I reproduced, and because the asset ceiling
is already pinned in BRIEF.md, the other binding builder input — the builder cannot silently
build on 6 photos. If prototypes are ever briefed from research.md alone, F1 alone justifies FIX.

Verdict basis: every checkable claim in research.md survived an independent probe this session —
20/20 quotes, 10/10 fetch states, 18/18 fonts, ~15/15 inventory facts, 2/2 clip-metadata dates,
2/2 docs quotes — with zero fabrications and honestly-taged PLAUSIBLE/INFERRED rows.

# JUDGED: 3eaf676430329c5354773977f8e3258935f31444a3c99a7271907a841f89d51a
# VERDICT: SHIP
