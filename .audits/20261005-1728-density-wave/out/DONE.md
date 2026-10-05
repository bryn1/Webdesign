# DENSITY WAVE — DONE ledger (orchestrator, 2026-10-05)

Owner ruling (verbatim): "I feel like there is not enough things that move" → raise scroll-motion
density library-wide. 15 themes touched; 01/06/08/11/15 untouched (already dense). All work
parent-verified by orchestrator probes in addition to builder self-measures.

## A. Build roster (author frontend (10088), scoped -o commits, no pushes by leaves)
ID | theme | commit | ever% / med / min movers (bars ≥55/≥45, burst also min≥30) | parent verify
D-01 | 16-gradientljus   | f8136c9 | 84 / 71 / 54 | OK (mesh-layer typo fixed in passing)
D-02 | 20-mynta          | e500890 | 98 / 139 / 95 | OK
D-03 | 19-galerievaggen  | c91b7de | 84 / 79 / 17* | OK (*pre-existing pin-gaps; median passes)
D-04 | 10-magasincollage | 353ebcc | 73 / 77 / 54 | OK
D-05 | 13-91-tal         | 1739365 | 70 / 58 / 46 | OK + 375 marquee overflow fixed in passing
D-06 | 17-mork-akademien | c797e3f | 87 / 51 / 41 | OK + marginalia overlap fixed in passing
D-07 | 14-dagens-frisyr  | ef4fa4a | 97 / 106 / 62 | OK + pre-existing .ink-wash reduce pre-hide fixed
D-08 | 07-retrofilm      | a89745f | 92 / 126 / 68 | OK
D-09 | 02-mork-neon      | 5295a32 | 86 / 89 / 60 | OK at build; AA regression later found → F-1
D-10 | 05-mjuk-glas      | 05e68e8 | 89 / 141 / 126 | OK; ticker-engine DEBT-TAG (§4 doc)
D-11 | 04-brutalt-tryck  | 7d37717 | 87 / 66 / 44 | OK
D-12 | 18-bara-typsnitt  | d0d5f03 | 100 / 65 / 34 | OK at build; tracking defect later → F-2
D-13 | 03-varmt-papper   | d735001 | 91 / 92 / 58 | OK + pre-existing divergent tweens fixed
D-14 | 09-schweizertag   | f2cfedf | 85 / 66 / 34 | OK; h1 textContent concat proven pre-existing
D-15 | 12-forgyllda-salongen | 3a22c94 | 93 / 95 / 70 | OK; amb-film seam fixed in build

## B. Fix cycle (post-gate, author frontend (10088) 236da17 + orchestrator docs)
ID | finding | source | closure | parent verify
F-1 | 02 parkable white-on-neon 1.18:1 (P1) | DA-c1 | scrub retimed: bar exits 'top 62%', text lights 'top 50→38%' | orchestrator clip-aware 49-step probe: 0 visible-glyph violations; screenshots show bare bar
F-2 | 18 word gaps collide at extremes (P2) | DA-c1 | per-word amplitude clamp (amp_i+amp_{i+1} ≤ gap_i − 0.15em) + fonts.ready root fix | on-screen min gap 0.455em; booking CTA renders clean
F-3 | 13 new semantic copy (bar f) | TEST-c1 | stat "1991 Född" + 6 year-chips removed | LCS vs pre-wave: zero deletions repo-wide; only decorative-band residue (aria-hidden, in scope)
F-4 | 17 plaque numerals 2.36:1 (pre-existing P3) | DA-c1 A/B | opaque chip behind numerals | rest state genuinely fixed 4.28–4.33. CONTRADICTION on record (DA-c2): MID-SCRUB depths .52–.60 the wave's own cap animation (autoAlpha 0.7→1, js/scroll-motion.js L252–258) washes text+chip over the dark vignette → 2.29:1 parkable. Non-blocking, stays P3; one-line fix next pass (cap starts autoAlpha 1, animate x only). P4: gold pair caps analytically at 4.37 — raise numerals to large-text size/weight or accept decorative reading.
F-5 | 03 nested mm.add trigger-stacking (P2) | ARCH-c1 | hoisted to top level | orchestrator toggle probe: 84→0→84 ×3, no stacking
F-6 | 18 motion file 470l > 400 ceiling | ARCH-c3 re-check | reason header line added (clamp must live beside amplitudes) | parses OK, ceiling rule satisfied
F-7 | ARCHITECTURE.md stale §8.1 / missing rows | ARCH-c1/c3 | reconciled + theme-05 DEBT-TAG row + convergent-drift convention (softened per ARCH-c3 P4) | commits 639a98f, c9c3cf2

## C. Verdict cycles (wave run dir; pins = dod_judged_hash over this out/ dir)
cycle | file | base | result
1 | TEST-verdict.md | — | FAIL (bar f copy contract, 5 themes insert-only)
1 | DA-verdict.md | — | FIX (P1 02-AA; P2 18-gaps + metric-inflation caveat; P3 17 plaques, 03 ghosting)
1 | ARCH-verdict.md + c2 | f2cfedf | PASS (P2 03-nesting, P3 doc debt)
2 | TEST-verdict-c2.md | 639a98f | PASS — bar-f ruling applied (decorative aria-hidden/CSS additions in scope; only 13's semantic copy violated, now removed); all guards re-run green on touched themes; pin dfb4435… recomputed identical by parent
2 | DA-verdict-c2.md | 639a98f | SHIP — P1-02 + P2-18 confirmed fixed by DA's own instruments (02: 101-depth pixel sweep, 97 AA measures, worst 7.53:1; 18: min inter-word gap +0.196em ≥ 0.15 floor, zero collisions); no new damage 5/5 (console/reduce/JS-off/375 all 0, served==HEAD md5); metric-inflation caveat framing survives → kept in §D; 17 mid-scrub contradiction logged at F-4 (non-blocking). Pin dfb4435… recomputed identical by parent.
3 | ARCH-verdict-c3.md | 639a98f | PASS — all dispositions verified closed; P4 doc-wording softened by orchestrator c9c3cf2

## D. Library state
Final sweep (orchestrator, 24-step 1280×800 250ms settle): 20/20 PASS, console 0 everywhere —
.tmp/final-sweep.txt. Honest caveat (DA P2-2, stored to fleet kb): the whole-tree signature counts
off-screen/sub-pixel movers, overstating VISIBLE motion ~2–4×; honest in-viewport medians ~26–57.
Before→after comparisons share the instrument and remain valid; owner-perception goal (visibly
busy everywhere) confirmed by DA eyeball passes at 3 depths × 15 themes and the dead-moment scan.
Reduced-motion: 0 triggers AND 0 [style] mutations across scrolls on all themes (incl. 05 engine).
Served dir = repo dir; everything above live on :8090.

## E. Accepted rulings (do not re-litigate; disclosures to owner)
1. Decorative additions in scope (aria-hidden spans / CSS pseudo content): 07 RUTA frame nos, 12 ✦/✧,
   17 fleurons, 20 arcade HUD "POÄNG 000000 · LEVEL 01" + sprite rail, 13 "91 TALET" band.
   Owner copy itself: zero deleted/altered bytes anywhere in the wave.
2. Decorative glow/wash/grain/film layers may sit opacity-0 under reduce (content never).
3. Mid-scroll half-cuts of line-clip reveals are normal scrub rest-states under instant-jump sampling.
4. h1 "AnnyMorin" textContent at 09 = pre-existing <br>; pre-existing P4s (11 IO-reveal, marquee
   markers, 03 mid-scrub ghosting) stay queued outside this wave.
5. Theme-05 gsap.ticker drift engine: confined, reduce-inert proven twice; §4 DEBT-TAG, do-not-template.
6. Convergent ±A→0 is the DEFAULT for new motion; 02/07/10/16 symmetric + 05 rise = convert-on-next-touch.
