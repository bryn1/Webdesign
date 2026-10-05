# DENSITY WAVE — owner ruling 2026-10-05

Owner (verbatim): "I feel like there is not enough things that move" → raise scroll-motion
density library-wide. Bars per theme (owner-perception calibrated, kb-stored): ≥55% of sampled
elements ever-change across a 24-step slow scroll AND median movers/step ≥45 (burst-pattern
themes: also min/step ≥30). Motion = vendored GSAP scrubbed, all inside matchMedia no-preference
gate; reduce → 0 triggers; JS-off → content visible; 375px hOverflow 0; console 0; AA at max
effect intensity; identity/copy untouched; one motion file per theme; ≤400 lines (header reason).

## Scope: 15 themes (01, 06, 08, 11, 15 excluded — already dense)
Waves: W1 16,20,10,19 · W2 13,17,14,07 · W3 02,05,04,18 · W4 03,09,12.
Commits: 16 f8136c9 · 20 e500890 · 19 c91b7de · 10 353ebcc · 13 1739365 · 17 c797e3f (+ per-leaf below).

## Note on run-dir split
Leaf briefs in this wave referenced the OLD run dir (.audits/202610041341-f6053f16/out) for
evidence; that dir carries the pre-wave verdict set (JUDGED c802d6b1) and its dod-loop misfired
18× against leaf sessions (window-wide scan). THIS dir is the wave's own record: end-of-wave
DONE.md, TEST-verdict.md, DA-verdict.md land HERE, over the post-wave state.

## Wave build status (all 15 committed + parent-verified by orchestrator probes, 2026-10-05)
W1 16 f8136c9 · 20 e500890 · 19 c91b7de · 10 353ebcc
W2 13 1739365 · 17 c797e3f · 14 ef4fa4a · 07 a89745f
W3 02 5295a32 · 05 05e68e8 · 04 7d37717 · 18 d0d5f03
W4 03 d735001 · 09 f2cfedf · 12 3a22c94
First four (16/20/19/10) already sit on origin/main (pushed by the 10140.3 crew earlier);
remaining 11 commits local-only, push after fresh TEST + DA verdicts land in THIS dir.

## Verdict-phase guidance (for TEST + DA children)
- Judge the POST-WAVE state served at http://192.168.5.231:8090/<theme>/ (= repo HEAD).
- Bars above; per-theme leaf evidence in this dir's .tmp/evidence/ (03,09,12) and in the OLD
  dir .tmp/evidence/ (W1-W3 leaves were briefed against it; files gitignored either way).
- Orchestrator final 20-theme sweep: .tmp/final-sweep.txt (PASS line per theme).
- Known accepted rulings (do not re-litigate): decorative aria-hidden glow/wash/grain/film
  layers may sit opacity-0 under reduce; absTop-in signature fakes constant movers from
  fixed layers (use [style]-attribute stability to judge reduce); mid-scroll half-cuts of
  line-clip reveals are normal scrub rest-states under instant-jump sampling; h1 "AnnyMorin"
  textContent at 09 is pre-existing (<br>); pre-existing P4s (11 IO-reveal remnant, marquee
  markers) not in wave scope; theme 05 uses gsap.ticker drift engine instead of per-section
  ScrollTriggers for background layers — reduce-inert PROVEN, DA may weigh doctrine.
- Verdict files: first line content, last line exactly "# VERDICT: <word>".
