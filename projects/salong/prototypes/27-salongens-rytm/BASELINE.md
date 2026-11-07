# BASELINE.md — 27-salongens-rytm ("Salongens rytm")

Declaration written BEFORE the first build byte (workflow-webdesign §5 Baseline load rule;
ambient-scroll-baseline.md B1/B2/B3/B6/B7/B8 + Canva-teardown PLAYBOOK P2–P12, MC 10088.19).
Never regenerated. The ceiling audit compares the build against THIS file, rule by rule.

Method-transfer statement: no Canva asset, font, hex, gradient string, CSS block or copy
sentence appears here or in the build (MC 10365 R2). Palette, faces and motifs are this
prototype's own, picked from the subject's world (a Malmö salon).

## Concept

"Salongens rytm" — a salon runs on rhythm: the steady 24 px of a working hour against the
64 px pauses between clients, the same two-beat pulse the page itself is built on. One
signature scene pair bookends an otherwise light, paper-and-type page. The scroll cue is a
content card cut by the fold, never an arrow.

## Token block (B1)

All colour literals live ONLY in the `:root` block of `css/tokens.css`; below it components
read `var(--…)` (plus `transparent`/`currentColor`, which are literals of reference, not of
palette). Every number the design repeats is a named token there once, including the single
root-size multiplier (`--root`) the whole type scale retunes from (playbook P-pointer B1/B3).

## Palette families (B2) — 3 hue families + 1 accent + 1 paper

| family | tokens | role |
|---|---|---|
| spruce (deep green) | `--spruce-deep` `--spruce` `--spruce-mist` | hero scene ground, links, frame motif on light, active chips |
| copper (baked) | `--copper-deep` `--copper` | closer scene ground, CTA fill, eyebrows, hover states |
| sand | `--paper-2` `--rule` | light section fills, hairline rules |
| accent | `--brass` | focus theme, micro-labels on dark scenes |
| paper / ink | `--paper` `--paper-2` / `--ink` `--ink-soft` | the single paper ground + ink |

Depth source, ONE, named (B2): **photography + solid tint + one motif**. No `box-shadow`,
no gradient scrim anywhere. Hover states swap to darker tokens of the same family.

**Signature scene pair (P7):** spruce × copper. Hero = spruce-deep ground, copper/brass
accents; closer = copper ground (kontakt scene), spruce-mist/paper accents — the pair,
direction swapped. The two saturated full-bleed scenes bookend the page and are never
adjacent (5 beats between them).

**Ornament, exactly one (B4):** the `.ram` mirror-frame motif — 1 px border + 1 px offset
`outline` (double hairline like a salon mirror bevel). Repeated on the portrait figure, the
5 service cards, the gallery cards, the 3 proof cards and the booking dialog. Nothing else
is ornamented.

## Type roles (B3) — one face per role, explicit size + tracking

Faces are **local stacks only** — no webfont request (offline-robust per spec.md "font
fallback i font-stack", and zero external payload for P2 "zero payload to paint"):
- display: `--font-display` = Iowan Old Style / Palatino / Georgia / DejaVu Serif / serif —
  the salon's mirror-lettering voice; size `calc(3.15×var(--root))` (h1) and
  `calc(1.9×var(--root))` (h2), tracking `--tr-display` (-0.012em), weights 400/700.
- body: `--font-body` = Optima / Segoe UI / system-ui / DejaVu Sans / sans-serif;
  `var(--root)`/1.7, tracking normal.
- micro-label: `--font-body`, `calc(0.85×var(--root))` (≥13.9 px at every band), UPPERCASE,
  tracking `--tr-micro` (0.14em) — the price-tag / schedule-board label.

No text element sets tracking ad hoc; all sizes are `calc(N × var(--root))` (the single
root multiplier token). Display step-down per breakpoint = the band re-step below.

## Hard four-band breakpoints (P3) — no overlap, ≤0.9 px steps

One declared set, every media rule names its band as a pair; a one-off breakpoint would be a
named exception — there are none:

| band | query | `--root` | step from prev |
|---|---|---|---|
| B1 | `(max-width:599.9px)` | 16.4 px | — |
| B2 | `(min-width:600px) and (max-width:899.9px)` | 17.0 px | +0.6 |
| B3 | `(min-width:900px) and (max-width:1199.9px)` | 17.5 px | +0.5 |
| B4 | `(min-width:1200px) and (max-width:9999.9px)` | 18.0 px | +0.5 |

Steps 0.6/0.5/0.5 px ≤ 0.9; bands are discrete and non-overlapping (`.9` upper bounds). The
type ladder resteps at band edges only, never per component.

## Spacing rhythm (B6)

- `--space-intra: 24px` — inside a beat (between elements).
- `--space-inter: 64px` — between beats (section padding-block on `.content` sections).
- `--pad-scene: calc(2 × var(--space-inter))` = 128 px — scene padding. This is the declared
  derivation, not a fifth value: scene:content air = 128:64 = 2× ≥ B6's floor.
- Scene min-heights are tokens (`--min-hero: 88vh`, `--min-closer: 60vh`).
- A fifth spacing value does not exist in the CSS (container width, borders and the focus
  offset are layout/geometry tokens, not rhythm).

## Beat ladder (P8) — 7 beats, ≈5.5 viewports at 1440 (floor met, not ceiling)

identity → capability beats → breadth → status/trust → ONE closing ask:

1. **Hero** `#top` (scene 1, spruce) — identity question. ONE CTA. Proof device: ZERO.
2. **Om mig** `#om` — craft story (first person, PoC copy verbatim), mirror-framed portrait.
3. **Tjänster** `#tjanster` — capability beat 1: the five services, price `–` (PoC rule I1).
4. **Galleri** `#galleri` — the BREADTH beat: format-first rail (see P12 below).
5. **Så går ditt besök till** `#besok` — capability beat 2 / trust: the honest "first visit"
   description (what genuinely exists; not a testimonial).
6. **Boka** `#boka` — the decision point: the demo mock grid + the proof row (see below).
7. **Kontakt** `#kontakt` (scene 2, copper, hue-swapped bookend) + slim footer — the ONE
   closing ask ("Säkra en tid" → `#boka`).

Why this is the floor met, not the ceiling: P8's ceiling wants 3–5 capability demos spread
over 8–10 viewports. A one-person salon cannot honestly carry more: beyond these 7 beats the
page would have to pad itself with invented proof (testimonials, counts, prices — all banned
by spec.md/PoC rules I1 + MC 10088.19). 7 beats / ~5.5 viewports at 1440 is the brief's
4–6-viewport target honoured with zero filler; the ladder shape (identity→demos→breadth→
status→one ask) is complete, which is what the floor asks. Saturared scenes: exactly 2,
bookending, ≤2 beats apart requirement met trivially (they bookend).

## Proof placement (P6)

Hero carries product-as-proof only (the real asset set shown, zero third-party devices).
The proof row lives in `#boka`, beside the decision: three cards of what genuinely exists —
(1) the before/after gallery above, (2) the Instagram handle @jane.cooper (the PoC's own
"mitt dagliga arbete" claim), (3) the first-visit description (`#besok`). No testimonial, no
review, no star rating, no client count, no price anywhere on the page.

## Ask discipline + tab policy (P10, B10)

CTAs — all `href="#boka"`, verb-first, ≤4 words, verbs escalate, no verbatim repeat, no
urgency/discount language: hero **"Boka tid"** → tjänster **"Välj en tid"** → closer
**"Säkra en tid"**. Nav labels are section names per spec.md (not asks). One channel:
`#boka` everywhere; the only absolute external target is the single Instagram host (0
campaign params — GB6 one-channel shape).
Tab split (visible in the markup, source comment at each split): **same-tab = conversion**
(`#boka` links, `tel:`, `mailto:`, footer nav); **new-tab = cross-sell** — ONLY the
Instagram anchors (`target="_blank" rel="noopener"` + `<!-- tab-policy: … -->` comment).
First viewport at 1440 AND 375 contains the working primary action (the CTA, and the real
booking channel is named: tel + IG path shown next to the mock grid).

## Gallery as format rail (P12)

Chip rail of the five service types (`Alla` + Klippning / Färg & balayage / Vård &
håranalys / Bröllop & bal / Barbering & skägg) filtering the four before/after slots.
Chips are real `<button>`s with `aria-pressed`, inside a labelled `role="group"`, keyboard
natively. Card = preview + name + ONE meta badge. "Barbering & skägg" has no documented slot
yet → the honest empty state renders ("Inga bilder ännu…" with a pointer to the phone/IG
path) rather than a faked card. **JS off: every image is visible and readable** (no class is
applied without JS; the filter is pure enhancement).

## Served-markup media contract (B9 + playbook B9-pointer)

Every `<img>` carries `width`+`height` (intrinsic). The `_assets` set ships exactly ONE size
per file (measured: gal-01…04 = 1536×2048, jane-portrait = 1656×2208) — `srcset`/`sizes` are
therefore NOT shipped and NOT invented (the brief conditions them on a multi-size set;
`_assets/` is read-only, authoring-time crops would mean new bytes in the shared set).
Below-fold imgs are `loading="lazy"`; hero is eager; text-over-photo zones carry
`--pad-scene` so no photo→text reflow is visible. No webfont request = no font swap = no
font CLS. Hand-written markup, one `<script>` max, no framework/bundler/build step; script is
`defer`, at the end, and the page fully paints and operates without it (P2).

## Motion budget (B7) — 4 families, each with role, count, timings, degradations

| family | role | count | timings (≤2 delays) | reduced-motion | JS off |
|---|---|---|---|---|---|
| reveal | story beats enter on scroll | ~16 | 600 ms, delays 0 / 120 ms | end state only — content never hidden (gate root-class + `no-preference` media gate) | visible (class never added) |
| hero-andning | scene breathes (Ken Burns over the real photo) | 1 | 24 s, 0 delays, infinite alternate | not applied (pure CSS, `no-preference`-gated) | still animates (CSS only, B8: present without JS) |
| sticky-skalm | site chrome persists (nav) | 1 | none (position: sticky, no JS) | unchanged (no timed motion) | works (CSS) |
| dialog-lyft | decision surface arrives | 1 | 160 ms dialog + 160 ms backdrop | instant open (gated) | n/a — without JS the booking path is ALSO plain visible text (tel + IG), the dialog is never the only door (B8) |

Ambient motion is wrapped in `@media (prefers-reduced-motion: no-preference)`; the
un-animated state IS the readable state; no `window.onscroll`, no GSAP/ScrollTrigger, no
rAF work at all (IntersectionObserver class flips only).

## Voice budget (P12) — grep list, not a vibe

Second person dominant (du/ditt) in every connective line; first person ("jag") for the
craft story; no corporate "vi" — except the PoC verbatim "Vi arbetar med bland annat
ammoniakfri färg…". Exclamations: 0. Urgency/discount words (rea, rabatt, fynda, sista
chansen, begränsat, –%, "boka nu"): 0. Emoji: 0. Joke: ≤1. CTA labels verb-first ≤4 words.
Copy is proofread against spec.md (B16): Swedish `lang="sv"`, PoC text verbatim where it
fits, prices `–`, opening hours "(bekräftas snart)".

## Honesty ledger (what is NOT here, on purpose)

- No contact form — an input field with no backend would be a fake surface; the real
  channels (tel/mailto/IG) are shipped instead. (spec.md: the form "får finnas" — optional.)
- Booking grid is labelled **demo** and the chosen-time dialog routes to the real phone/IG
  path (PoC booking-mock shape).
- The `_assets` files are the fleet's deterministic placeholder artwork; captions/alt name
  the GALLERI SLOT and its format ("Före & efter 01 · Klippning") and never invent photo
  content the pixels do not show. The portrait alt string is the spec-mandated verbatim.
- P11 (plan-card mechanics) **waived**: this page sells one service at one undisclosed price
  (`–`, PoC rule I1) — there is no tier set to ladder; the time-slot grid carries its role.
- P9 (feature-page skeleton) applies to feature pages; this is the one-page home — P8 governs.

# END BASELINE

---

## Measured corrections (appended at build, 2026-11-07 — the declaration above stands as written)

Not a regeneration; a ledger of what the measurement instrument said, so the audit reads
declaration AND fact:

- Page length came in at **5 396 px = 5.995 viewports** at 1440×900 (probe; first full
  build measured 5 558 px = 6.17, over the brief's 4–6 target). The overage was cut WITHOUT content loss:
  chip rail made a true horizontal rail (nowrap + native overflow-x — closer to the P12
  pattern than the wrapping fallback), gallery image crop 3:4 → 4:5, the tjänster price
  note moved into the beat lead (it is a lead fact, not a tail), hero's duplicated address
  line dropped (the address lives in `#om` and `#kontakt`), portrait column stepped
  320→260 px, and the wide-band `#kontakt` rows set dt·dd on one baseline. Beat count and
  every token above are unchanged; `--min-hero` stayed 88vh as declared.
- Motion budget reveal count: exactly **17** `[data-reveal]` targets (declared ~16).
- `srcset`/`sizes` remain NOT shipped for the reason declared: the `_assets` set measured
  single-size per file (gal-01…04 1536×2048, jane-portrait 1656×2208).
  **→ SUPERSEDED 2026-11-07 round 2** (gate 1.1.0 gates the srcset half; genuine derivatives
  now ship — see §Round 2 below).
- Gate: FAIL round 1 (contrast/cascade — scene CTA text picked up the scene link colour;
  skip-link hover fell through), PASS round 2, PASS again after the trims (final
  certification). Screenshots looked at: desktop-1440-top, mobile-375-top,
  reduced-1440-full of the certifying run.

## Round 2 (2026-11-07, MC 10088.19 fix round) — gate 1.1.0 + audit P2-1. The declaration above stands as written; this is ledger, not regeneration.

**What gate 1.1.0 found (run 20261107T151418Z, exit 1).** Two rows FAIL, everything else green:
`gb7-breakpoint-vocab` (every media px outside an undeclared vocabulary) and `gb5-img-dimensions`
srcset half (6 `<img>` with no `srcset`/`<picture>`).

**Breakpoint vocabulary (gb7).** The four declared bands (table above) are now NAMED as px
tokens in `:root` — `--bp-b2: 600px`, `--bp-b3: 900px`, `--bp-b4: 1200px`, `--bp-far: 10000px`;
every media px equals a token or token − 0.1 (599.9 / 899.9 / 1199.9 / 9999.9 — the `.9` caps).
Band VALUES, steps and overlap are unchanged from the declaration; the gate's `clean-bands`
confirms. (A media query cannot read `var()` — the token block IS the vocabulary; gb7 reads it.)

**Derived assets (gb5 srcset half) — PROVENANCE, read this before mistaking bytes for
photography.** The fleet `_assets` files are single-size deterministic PLACEHOLDER artwork
(gal-01…04 1536×2048, jane-portrait 1656×2208 — re-measured with PIL this round). `derived/`
beside `css/` holds genuine machine-downscales made for this build with **Pillow 12.2**
(LANCZOS, JPEG q85, no re-encode at native size): each file at **384×512, 768×1024 and
1152×1536** px (`-w384/-w768/-w1152` suffixes) — **per tier re-measured (ls, round 3):
w384 5.9–7.6 KB, w768 38–44 KB, w1152 129–143 KB** vs the ~420–490 KB native (the original
"6–45 KB" claim described only the two small tiers — corrected, see §Round 3). Every
`<img>` now ships `srcset` + `sizes` matching the slot widths the layout actually renders
(gallery card ≈245 px @≥1200, portrait column 260 px @≥900, hero 100 vw); the native file
stays in the set as the largest `w`-candidate. These derivatives are MACHINE-DERIVED FROM
PLACEHOLDER ARTWORK — pixels the placeholder never had are not claimed anywhere in the copy.

**Hero (audit P2-1 — the declaration mismatch).** `--scene-photo` 0.35→0.60,
`--scene-tint-hero` 0.62→0.45: **effective photo presence 13 %→33 %** — the photo reads as a
warm place-wash under the ink tint instead of textureless murk (probe screenshots
`.tmp/probe-1440x900.png` / `probe-375x812.png`). The gate contrast row is BLIND to the photo
(walks ancestor background-COLORs, `gate.mjs` stated limit), so legibility was re-measured
against the REAL composited pixels: hero text nodes were hidden, the scene screenshotted, and
each node's own colour checked pixel-by-pixel behind its rect (instrument
`.tmp/hero-probe.mjs`): **worst 6.33/6.92/6.22 at 1440, 5.49/6.13/5.91 at 375**
(eyebrow/h1/lede; thresholds 4.5/3.0/4.5) — all AA with margin. The CTA rides an opaque paper
fill (`rgb(246,241,232)`), never the wash. One consequence: the hero eyebrow moves brass→
`--spruce-mist` — over the 33 % wash brass measured 2.79–2.89:1 real-pixel (an unreadable
micro-label the gate could not see); brass keeps its declared micro-label role everywhere no
photo sits under the type (closer scene, footer unchanged). `--min-hero` 88vh→70vh (the
sanctioned second lever): the fold now cuts the `#om` portrait card by **145 px at 1440×900**
and **116 px at 375×812** — the concept's declared scroll cue ships (before: fold cut 47 px of
padding, card top y=929 below the fold). Dead hero field below the CTA 257 px→176 px @1440
(the remainder is the `--pad-scene` 128 px scene air, now photo-legible, not dead).

**Page length after the hero change (no other trim needed):** 5 234 px = **5.816 viewports**
@1440×900 (was 5.995) — inside the 4–6 target. The shortening is the `--min-hero` step-down
itself; no beat, copy or token family was cut.

**Gate re-run (20261107T153128Z, gate 1.1.0): exit 0, `# QUALITY: PASS`** — all rows green
incl. `gb5-img-dimensions` (clean-imgsize), `gb7-breakpoint-vocab` (clean-bands) and the
contrast row RE-RUN after the photo-presence change (0/134 at both widths). Links: 27 refs,
0 broken (the 15 `derived/` files resolve). The deliverable audit that certifies this folder
must be RE-RUN against these bytes (workflow-webdesign §5: an audit from before a fix does
not count) — that is the orchestrator's step, not this build's.

## Round 3 (2026-11-07, MC 10088.19 fix round 3) — deliverable-audit c2 P1-1 (focus-ring contrast) + P3-1 (byte-size claim) + P4-1 (stale comment numbers). The declaration above stands as written; this is ledger, not regeneration.

**What the audit found (P1-1, access-class).** The keyboard focus ring — 2px `--copper-deep`
at 3px offset (the `:focus-visible` rule) — was invisible on the dark scenes: with a 3px
offset the ring sits on background on BOTH sides, and copper-deep (linear-lum ~0.066–0.074,
instruments below) lands ~1:1 on the hero photo wash round 2 had brightened. Both readings,
side by side: **auditor [B]** (ring-band vs behind-the-ring pixels, dpr2): hero CTA **1.01:1**,
closer CTA **2.01:1**, footer links **1.34:1**, rings on paper 7.55:1 pass.
**Orchestrator** (background-column sampling of the shipped frame): hero background lum
**0.0792** vs copper-deep **0.0658** = **1.12:1**. WCAG 1.4.11 non-text contrast **3:1**,
binding via `projects/salong/spec.md` (AA). The build violated its own token contract:
`tokens.css` declares `--brass` as "accent: micro-labels and focus on dark scenes" — no focus
rule ever used it.

**What changed (one scoped rule + two colour fixes, zero new tokens/mechanisms/selector
types).** base.css: `.scen :focus-visible, .site-footer :focus-visible { outline-color:
var(--brass); }` — the ring colour follows the ground it is drawn on; every light surface
keeps copper-deep. Also caught by the same sweep: `.hoppa:focus` shipped a BRASS ring on the
skip pill, which paints over the sticky **paper** header (measured ground 0.8833) — brass on
paper measured **2.04:1**, the same defect class on the opposite ground; it now takes
copper-deep (7.54:1 on paper). The hero eyebrow was NOT touched (round 2's brass→spruce-mist
move is correct: small text needs 4.5:1, brass only reaches ~3.5:1 on the wash).

**Measured after** (own instrument `.tmp/focus-round3.mjs` — dpr2 band sampling of the REAL
rendered ring pixels vs the offset-gap + beyond-ring pixels; ring core = band pixels at token
lum; ground = the band's 5th/95th pct; Ken-Burns pinned deterministically t=0 and t=24000
peak; both viewports. Before the change it reproduced the auditor's readings exactly:
1.01–1.05 / 2.01 / 1.34 / 7.54):

| element (focusable in dark scene) | before → after 1440×900 | before → after 375×812 | need |
|---|---|---|---|
| hero CTA `Boka tid` (photo wash, static→peak) | 1.04/1.05 → **3.82/3.86** | 1.02 → **3.76/3.77** | 3.0 |
| closer `Säkra en tid` | 2.01 → **7.41** | 2.01 → **7.41** | 3.0 |
| closer tel / e-post / Instagram links | 2.01 → **7.41** (each) | 2.01 → **7.41** (each) | 3.0 |
| footer nav × 6 links | 1.34 → **4.96** (each) | 1.34 → **4.96** (each) | 3.0 |
| skip pills (paper header ground — copper now) | 2.04 → **7.54** | 2.04 → **7.54** | 3.0 |
| light surfaces unchanged: nav/dialog rings on paper | 7.54 → 7.54 | 7.54 → 7.54 | 3.0 |

Hero worst-band ratios hold at the Ken-Burns PEAK (3.86) and over the brightest structure the
CTA's ring actually sits on (band p95 lum 0.0714 → brass 3.76 even there); closer ground
0.0116, footer ground 0.042 (flat, no photo). Matches the auditor's composite predictions
(3.74/7.37/4.96) and the orchestrator's token arithmetic (3.53). No element landed under 3:1,
so no further contrast lever was pulled — colour alone was the fix; nothing thicker, nothing
new. Method note (honest): the sampling bands clear the ring stroke by 1.5 CSS px (Chromium
device-snaps fractional outline edges); headline = ring-core vs band percentile, extremes
carry glyph/ring AA tails and are reported in the JSON.

**Skip-pair destinations measured, recorded, NOT changed.** Keyboard-activated skip 1 moves
focus to `main#innehall` (tabindex −1) and `:focus-visible` matches, but the painted ring
falls UNDER the sticky header (top edge) and off-canvas (sides) — the instrument found zero
ring pixels in the viewport at either width (its band read pure paper). Skip 2's target
`#sidfot` (the footer itself) receives no focus in this Chromium at all (activeElement stays
BODY — no tabindex). Both are real findings but fixing them needs a focus/geometry decision
beyond this P1; filed here so the next audit can rule, not silently skipped.

**Gate gap to file fleet-side — this folder cannot close it.** The gate's focus row
`gb2-focus-outline` is an outline-REMOVAL scan (flags `outline: 0/none` with no themed
replacement, gate-backlog.mjs); it passed the whole 1.01:1 ring every round. Ring-vs-background
contrast on a composited photo is not decidable by CSS-source scanning — same blind class as
the contrast row's photo-blindness ledgered in round 2. Focus-indicator non-text contrast
belongs in the fleet-side gate (pixel probe), not in this prototype.

**Honest-number corrections (P3-1 + P4-1), both re-measured, not restated:** derived-tier
sizes above corrected in place (w384 5.9–7.6 KB, w768 38–44 KB, w1152 129–143 KB, ls); the
two CSS comments quoting hero-text contrast used values no instrument reproduced — corrected
from `.tmp/hero-round3.mjs` (audit-[A] method, static AND peak, dpr1): worst over
eyebrow/h1/lede = **6.23:1 @1440 / 5.49:1 @375** (tokens.css note); spruce-mist worst =
**5.49:1** (layout.css note). Page length re-measured with the same instrument: 5 234 px =
**5.816 viewports** @1440×900 — §Round 2's number reproduces; the "5.74/5.06" the comments
quoted were stale contrast claims, not lengths, and now match the instrument.

**Gate re-run (20261107T180654Z, gate 1.1.0): exit 0, `# QUALITY: PASS`** — all rows green
(detect 0, contrast 0/134 both widths, console 0, overflow ×3, scroll-overlap 0, reduced,
nojs, links 27/0, gb1–gb9 incl. `gb2-focus-outline` clean-focus and `gb3-raw-colours`
clean-tokens). QUALITY.md carries the fresh run on disk (gitignored repo-wide per
`.gitignore:**/QUALITY.md` — same shape as the round-2 commit, which carried the gate result
in this ledger, not in the file).

## Round 4 (2026-11-07, MC 10088.26) — the delivered page failed the WIDENED gate: skip-pill ring, bottom edge. The declaration above stands as written; this is ledger, not regeneration.

**What the new gate found (P1, access-class, on DELIVERED bytes).** Gate 1.2.1 / skill 1.7.1
(MC 10088.19 was verified under gate 1.1.0, whose `gb2-focus-outline` was an outline-REMOVAL
scan only — exactly the fleet-side gap §Round 3 asked for; it landed and it found this). Re-run
on the committed bytes `578ca789`: exit 1, one row red — `bad-focus-contrast a.hoppa "Hoppa till
innehållet"` **and** `a.hoppa "Hoppa till sidfoten"`: ring `rgb(124,58,23)` declared via
`--copper-deep` vs sampled ground at the **bottom** edge, **1.21:1 @1440 / 1.29:1 @375**, ground
`rgb(88,90,81)` / `rgb(91,94,87)` (step viewport-space capture, scrollY 0). Both pills, both
viewports. So §Round 3's row "skip pills (paper header ground — copper now) 2.04 → 7.54" is
SUPERSEDED by this round: 7.54 was true on three sides, not four.

**Why (§Round 3's own blind spot, quoted).** Round 3 called the destination geometry a finding it
would not touch ("the painted ring falls UNDER the sticky header… filed here so the next audit can
rule"). The ring was never on paper all the way round: the pill's box is `y 12–66.6 @1440`,
`12–63.9 @375` (measured rect), while the sticky paper header ends at **61.09 / 56.91** — the box
overhangs by 6 px, and `outline` is drawn OUTSIDE the box, so the bottom band (`--ring-offset` 3 +
ring 2) lands 6–8 px below the box, on the hero photo.

**Both readings, side by side, instruments named.** (a) **The gate** (`gate-backlog.mjs
focusBgSample`, per-side median of the 3 px band outside the ring's outer edge, own render, dpr1
@1440 / dpr2 @375): **1.21:1 / 1.29:1**. (b) **The orchestrator** (its own bottom-band read over
the photo strip the ring actually crosses): ground `rgb(19,35,28)`, lum 0.0142 → **1.80:1**. They
differ because they sample different pixel rows of a photographic ground — the gate the thin band
past the ring (photo wash ~0.10 lum), the orchestrator the darker strip under it (0.014). Same
verdict: 1.80 and 1.21 are both under the WCAG 1.4.11 3:1 bar. A third instrument, this round's
`.tmp/skipfocus.mjs` (REAL `Tab` presses so `:focus-visible` paints; three bands per edge in
DEVICE px — the offset gap *under* the ring, the ring band itself, the 3 px past its outer edge),
reproduced (a) exactly: bottom 1.21:1 / 1.29:1, other three sides 7.54:1 on `rgb(246,241,232)`.
Arithmetic note, honest: the same ground pair (b) recomputed under the WCAG formula gives 1.93:1
against `--copper-deep` (lum 0.0737); the reading quoted is the orchestrator's own, kept as given.

**What changed — ONE declaration, no new token, no new mechanism, zero geometry change.**
`base.css .hoppa:focus` gains `box-shadow: 0 0 0 var(--pad-cta-v) var(--paper)`: the pill is a UI
surface, so it paints its own opaque ground — one declared `--pad-cta-v` (12 px) deep, past the
ring's outer edge (3+2) and past the 3 px of adjacent ground an instrument reads. Ring colour and
`--ring-offset` untouched: it is a light ground, so copper-deep stays (the brief's mirror-image
warning — brass-on-paper is the defect round 3 already fixed). The plate is invisible on the three
header sides (paper on paper) and reads as a paper mat where the pill overhangs the fold. The gate
still measures the OUTLINE as the indicator (`focusInspect` checks outline before box-shadow, so
the plate is ground, never a second ring).

**Direction measured and rejected (not guessed).** Containment inside the paper band, at the
declared values: `padding-block: calc(var(--pad-cta-v) / 2)` (6 px) measured **1.21:1 @1440** — the
ring's outer band still crosses 61.09, because the pill's line-box alone is `--fs-body × --lh-body`
= 30.6 px @1440 / 27.9 px @375, so at `top: var(--pad-cta-v)` the box cannot clear the boundary with
the token vocabulary; a 375-safe containment needs ~4–5 px vertical padding (a non-token number) and
would still sit ~1 px off the hero boundary, or `top` < 8 px, which clips the ring's own TOP edge
out of the viewport. Measured numbers: `.tmp/skip-contain6/skipfocus.json`.

**After-numbers, per edge** — `.tmp/skipfocus.mjs`, REAL Tab, `:focus-visible` = true on both pills,
scrollY 0, ring painted `rgb(124,58,23)` at every edge (band n ≥ 106 @1440 / ≥ 408 @375):

| edge | ground under the ring @1440 | adjacent ground @1440 | ground + adjacent @375 | ratio (both widths) |
|---|---|---|---|---|
| top | rgb(246,241,232) | rgb(246,241,232) 7.54:1 | rgb(246,241,232) 7.54:1 | **7.54** |
| bottom | rgb(246,241,232) | rgb(246,241,232) 7.54:1 | rgb(246,241,232) 7.54:1 | **7.54** (was 1.21 / 1.29) |
| left | rgb(246,241,232) | rgb(246,241,232) 7.54:1 | rgb(246,241,232) 7.54:1 | **7.54** |
| right | rgb(246,241,232) | rgb(246,241,232) 7.54:1 | rgb(246,241,232) 7.54:1 | **7.54** |

Both pills (`Hoppa till innehållet`, `Hoppa till sidfoten`), 1440×900 (dpr1) and 375×812 (dpr2,
isMobile). Nothing moved to another edge: the four sides now share ONE ground, `--paper`, so the
worst edge and the best edge are the same measurement — the gate's own per-side worst-side rule
reads 7.54:1 everywhere (≥ 3:1, WCAG 1.4.11). Raw: `.tmp/skip-post/skipfocus.json` + PNGs.

**Skip pair still works as a skip pair (re-run same instrument).** Tab once from page load →
`:focus-visible` = true on pill 1; Enter → `activeElement = main#innehall` @both widths (unchanged
from §Round 3). Pill 2 → `Hoppa till sidfoten`, Enter → the page scrolls to the footer
(scrollY 4334 @1440 / 8845 @375) and `activeElement` stays `BODY` — the footer carries no
`tabindex`, unchanged pre/after this fix, still the §Round 3 finding this card did not own. Zero
page errors at both widths.

**Gate, both sides of the fix.** Before (`578ca789`): exit 1, `# QUALITY: FAIL`, one red row —
`gb2-focus-outline` with the four `bad-focus-contrast` findings quoted above. After (this round's
bytes, gate 1.2.1, run `20261107T214003Z`, re-run on the committed tree `GATE_EXIT=0`): exit 0,
`# QUALITY: PASS`, `gb2-focus-outline PASS | clean-focus [B13 outline-removal + WCAG 1.4.11
indicator contrast >=3:1 on composited bg, P1] (indicator contrast: 1440: 40 tab-steps, 39
measured, 0 UA-auto, 1 skipped, CAP walked; 375: 40 tab-steps, 34 measured, 0 UA-auto, 6 skipped,
CAP walked)` — no `bad-focus-contrast` finding at either viewport. Every other row is unchanged
from the pre-fix run (detect 0, contrast 0/134 both widths, console 0, overflow 375/1280/1440,
scroll-overlap 0, reduced, nojs 0/122, links 27/0, gb1/gb3/gb5/gb6/gb7/gb8/gb9 clean), so the
folder's other contracts did not move: prices still `–` (§I1, 9 en-dash rows, `Pris anges med –`),
hours still "(bekräftas snart)" ×2, fabricated-social-proof grep 0 hits, one `h1` +
header/nav/main/footer landmarks + the skip pair (gb1/gb8), tab policy (gb9), img `width`/`height`
+ `srcset` (gb5), chip rail complete with JS off (nojs 0/122). QUALITY.md is gitignored repo-wide,
so this ledger carries the result, as in rounds 2 and 3.
