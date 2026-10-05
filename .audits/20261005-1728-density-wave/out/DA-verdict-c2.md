# DENSITY WAVE — DA re-verify, cycle 2 (narrow, post-fix)

Scope: MY findings only, re-tested on the served state (served js+css md5 == HEAD 639a98f,
5/5 touched themes SAME). Fix commits: 236da17 (frontend (10088), all files inside own theme
dirs) + 639a98f (orchestrator docs + 18 header line). Instruments: mine (pixel-median AA at
jump+park sampling, DOM word-gap scan, harness), evidence in /home/claudecode/Hemsidor/.tmp/dachild2/.

## Per-finding re-test

| finding | fix claim | my re-test | verdict |
|---|---|---|---|
| **P1 02 sweep AA** (white on neon 1.18:1, parkable) | badSteps 4→0, pairs eliminated | 101 depths × sweep blocks, **97 AA measurements, worst 7.53:1 PASS**; the aa-02-2 position (0.28) clean; mechanism verified in code: bar exits at 'top 62%' BEFORE text lights at 'top 50%'→38% — no temporal overlap; density unchanged (offMed 91, honest 42) | **FIXED — confirmed** |
| **P2 18 word-gap collapse** (−7px, "BOKARDU VIATELEFON") | min −8.5→9.0px via per-word amplitude clamp | proper inter-word scan (letters grouped by whitespace, vertical-overlap filter), 6 parkable depths .72–.82 where CTA is visible: **min gap +9.4px = 0.196em ≥ 0.15em floor, 0 negative**; d80 screenshot: CTA cleanly spaced words; hero is 2 stacked single words (no inter-word risk; intra-word drift intact). My measured worst 0.196em is below the builder's claimed 0.455em but above the clamped floor — claim directionally right, number optimistic | **FIXED — confirmed** |
| **P3 17 plaque chip** (2.36:1, pre-existing) | 2.45→4.33 worst-parkable | rest state: opaque gold chip, worst 4.28–4.33 (my pixel method ≈ claim ✓). **But worst PARKABLE is NOT 4.33**: at .56 the cap reads 2.29:1 (III) / 2.32:1 (II) — the wave's own block-10 animates the whole cap element `autoAlpha 0.7→1` scrubbed (scroll-motion.js L252–258); element-level alpha washes text AND chip toward the 0.62-ink-vignette dark corner equally, collapsing local contrast mid-scrub; parkable at .52–.60. Builder's probe evidently sampled only cap-α≈1 depths (.64+) | **PARTIALLY FIXED — claim contradicted at mid-scrub; stays P3** (decorative numbering, my original priority held; one-liner: start the cap from autoAlpha 1 and animate x only, or give the corner less vignette under the chip) |
| **P2-2 metric inflation framing** | (docs carry caveat) | re-run harness on 5 touched themes: offMed vs honest-visible unchanged (02 91/42, 03 92/43, 13 56/37, 17 51/26, 18 70/38) — nothing in the fixes moved the metric; DONE.md must keep the honest-viewport caveat | **FRAMING SURVIVES** |
| **P3 03 ghosting** | not in must-fix list; fix touched 03 (hoisted nested mm.add to top level, comment says condition identical) | registration structure sane (no-preference AND-gate preserved — harness: 0 triggers/0 style mutations under reduce, 63 triggers normal); ghosting unchanged = cosmetic P3 stands as-is | **no new damage** |

## New-damage quick pass, 5 touched themes (02/03/13/17/18) @ HEAD
- console errors: **0/5** · 375px hOverflow: **0/5** · reduce: triggers 0, style-mutation total 0
  (02's 4 html-class flips = pre-existing theme-sync IO, idle Δ0, 0 running animations), JS-off
  hidden content: **0/5** · served==HEAD: 5/5 md5.

## Residuals (none blocking)
1. **P3** 17 cap autoAlpha-0.7 mid-scrub reads 2.29–2.32:1 (parkable .52–.60) — fix comment's
   "worst-parkable 4.33" CONTRADICTED; decorative framing defensible but fails even the 3:1
   bar in that band. One-line motion fix, next pass.
2. **P4** 17 static worst 4.28 < AA 4.5 for 16.8px text (gold-vs-#2b1d20 pair is analytically
   4.37 max) — bump the numeral ≥1.17rem/700 (large-text 3:1) or accept decorative reading.
3. **P4** 18 claim 0.455em vs measured floor 0.196em — keep the clamp formula, but quote the
   measured value.
4. **P2-2** stays a docs-caveat, not a code defect (per original finding).

## Must-fix list
EMPTY — the P1 (02) and P2 (18) are fixed and confirmed by my own instruments; everything
remaining is P3/P4.

# JUDGED: dfb4435549dce3065cf777c3e414ad35a85c46e3915cc212be3111a53cf1fe51
# VERDICT: SHIP
