# DENSITY WAVE — adversarial verdict (devils-advocate, 2026-10-05)

Claim under test: the 15 density builds raise visible motion without breaking anything.
Post-wave state = repo HEAD = served :8090 (md5-verified SAME on 5 themes). Evidence:
`.tmp/dachild/` (harness-out.jsonl, ov18-out.jsonl, subpix.mjs out, fine-out.jsonl,
precise/plaque outputs, 45 id-shots + reduce shots + aa-shots).

**Rebuttal status: the claim is DIRECTIONALLY TRUE but NOT fully TRUE.** Motion is real
(no dead moments anywhere), identity survives, reduce/JS-off/375/console/git are clean —
BUT the wave introduced one parkable AA regression (theme 02) and the headline density
numbers systematically overstate on-screen motion (≈2–4×). One P1 ⇒ FIX.

## Findings

### P1-1 · theme 02 (mörk neon) — scrubbed neon sweep parks WHITE heading text on the
neon bar: measured **1.18:1** (needs 3.0 even for large text). `h2.sweep` "Det här kan jag",
AA-fail window = heading-top between viewport 58%→50% (bar exits at `top 50%`, text is fully
opaque already at `top 58%` — js/scroll-motion.js 4b block, both `scrub: true`).
Pre-wave the same cross lasted ~0.1 s inside a 0.6 s one-shot (git 5295a32^ shows onEnter
timeline); the wave made it a scrub → parkable, repeatable. The commit message claims
"AA worst 4.66:1" — CONTRADICTED by direct pixel math at depth 0.28.
Evidence: aa-02-2.png (screenshot of the park state), contrast 1.18 computed vs measured bar
pixels. This is exactly the brief's "AA at max effect intensity" bar, violated by a wave change.
FIX: end the bar's scrub before the text's opacity scrub completes (text end ≥ bar end), or
invert text color over the bar.

### P2-1 · theme 18 (bara typsnitt) — per-letter tracking collapse collides words:
measured min word-gap **−7 px** with the heading in full view (depths .71–.83, parkable);
screenshot id-18-c-low.png renders the booking CTA as "VÄLJ ENTID —SEDAN BOKARDU
VIATELEFON ELLERINSTAGRAM" — legibility and the pure-typography identity degraded in a
parkable mid-scrub state. Not covered by the clip-reveal ruling (glyphs collide, not half-cut).
FIX: reduce counter-slide amplitude so gap never < ~0.15em (or clamp per-pair).
Not a blocker alone; strongly recommended before ship.

### P2-2 · density metric overstates on-screen motion (systemic, worst 05/17/19/18/09/13)
Rebuilt an honest probe (viewport-visible, opacity>0.08, real style change or non-fixed
absTop, area≥16px) on the same 24-step protocol. Claimed median movers/step vs honest:
05: 146→**35** (4.2×), 17: 51→**26**, 19: 96→**30**, 18: 65.5→**38**, 13: 75→**37**,
10: 78→**36**, 03: 93→**43**, 02: 91→43, 04: 91→44, 07: 162→53, 14: 135→54, 12: 122→57,
16: 70→42, 09: 88→47, 20: 139→86. Drivers: off-screen drift targets written every step
(05's ticker sets ALL ~40 drift items per scroll step, most below the fold), sub-pixel steps
(09: **37.6 %**, 18: **35.7 %**, 05: 29.4 % of visible movers moved <0.5 px at that step),
and 18's invert sweep flipping 469 of 500 sampled elements' colors in ONE step (single
visible event counted per element — the "full-page flick" pattern). The owner bar was
calibrated ON this probe and is met as written everywhere (official medians reproduced
±1 on 14/15 themes; 13: claim 75 = their 450 ms settle vs my 58 @80 ms — protocol-sensitive,
P4 note), so nobody gamed a rule — but nobody should read "146 movers/step" as visible
motion in 05. 19 on a 120-step fine probe: median 45, min 16, **19.2 % of steps <30 movers**
— consistent with its "min 17" weak-spot flag; fine-grained scrolling of the gallery wall is
thinner than headline numbers suggest.

### P3-1 · theme 03 (varmt papper) — mid-scrub text-on-text ghosting
Drifted card copy overlaps neighbouring text (id-03-b-mid.png: faint copy smeared behind
"Det här kan jag"). Top text's own AA passes (worst measured 5.51), identity intact — this is
visual dirt during scrub, not a legibility break. Tighten overlap ranges or drop the drift
amplitude of the under-layer.

### P3-2 · theme 17 (mörk akademien) — gallery plaque numerals I–IV AA-fail **2.36:1**
(14.4 px/400 gold rgb(169,141,95) over light hair pixels, parkable depths .54–.70).
A/B against c797e3f^ (pre-wave, same pixels): PRE worst 2.52 = PRE-EXISTING, not wave damage
— but the wave commit still claims "gold AA 4.57", and this is in the served product. Give the
chip a solid backing (opaque bg) — one-line fix.

### P4 notes
- 02: `html.theme-invert` class toggles 4× during reduce scroll (pre-existing
  IntersectionObserver chrome swap; zero style mutations, zero running animations — the
  wave's own JS is inert; noted for reduce-honesty completeness).
- 20: `SPAN.blink` caught opacity<0.15 in the JS-off snapshot — mid-blink phase of a CSS
  blink animation, visible between blinks. Decorative, fine.
- 05 @42 % / 19 @42 %: near-empty viewports are scrub rest states under instant-jump sampling
  (accepted ruling); continuous-scroll probe shows motion through those ranges.
- 20: heading passes under translucent fixed header (CRT design, pre-existing).
- 07 "RUTA 01–06", 13 counter years, 20 "POÄNG 000000 · LEVEL 01": new decorative copy strings
  — additive only (see git findings: zero changes to existing copy).

## Cleared (attacked, did not break)
- **Reduce honesty, all 15**: `ScrollTrigger.getAll()=0`; **zero** inline-style mutations over
  full reduce-mode scroll + 1.5 s idle (MutationObserver on documentElement); **zero** running
  CSS animations; no idle drift. **05's gsap.ticker engine proven inert, not trusted** — drift
  items are only filled inside the no-preference handler; observe count = 0.
- **Reduce reverse-brokenness**: 0 content elements <0.15 opacity (aria-hidden decor excluded)
  on all 15; rd-*-top/mid screenshots show complete content (02/05/16/18 eyeballed).
- **JS-off**: 0 hidden content elements on all 15 (excl. the 20 blink phase).
- **375 px**: hOverflow ≤ 0 on all 15 (incl. 13, whose fix 20→0 verified).
- **Console**: 0 errors all 15 (normal pass).
- **Dead moments** (1s wheel-speed continuous scroll, honest per-step visible movers):
  **zero-run = 0 steps** on 19/18/09 AND stress-tested 13/05 (227/250/166/204/218 steps;
  every step had ≥1 visible change). The owner's "things that move" is genuinely satisfied
  on 19, 18, 09 despite the metric inflation.
- **Identity**: 3 depths × 15 themes eyeballed — newspaper (14), art-deco (12), Swiss grid
  (09), pure-type (18), gallery-gold (19), arcade (20), film (07), glass (05), 91s memphis
  (13), collage (10), brutalist (04), gradient (16), academia (17), neon (02), warm-paper (03)
  all retain their concept. No parallax soup.
- **Git/scope**: all 15 authored `frontend (10088)`; every file inside its own theme dir; no
  verdict/DONE/_assets/other-theme files; `origin/main..HEAD` = exactly the 11 post-origin
  commits, no push happened; Swedish text extraction pre/post per theme: **zero removed or
  altered characters**, additions only (decorative); CSS `content:` adds = ✦/✧ ornaments only.
- **Mechanism hygiene**: vendored GSAP only, no CDN in any wave index; one motion file per
  theme, 230–385 lines ≤400, every file opens with the MC-10088 header+reason.

## Must-fix before ship
1. **02** — sweep-bar vs text timing (P1-1, AA 1.18:1 parkable).
Recommended in the same pass: 18 word-gap clamp (P2-1), 17 plaque opaque chip (P3-2).

# VERDICT: FIX
