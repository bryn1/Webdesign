# fix-c6 — producer fix round for the two knut-judged FAIL cards (MC 10140.7/raw 10329, MC 10140.6/raw 10303)

Run of 2026-10-13 by the `frontend` profile (MC 10140.9 fix-round task). Served subject:
http://127.0.0.1:8092/workflow-explode/ (the checkout IS the served copy — :8092 serves
`projects/portfolio/concepts`).

## What was judged FAIL (verbatim, knut)

- 10329 r1 row 1: counters must intersect no `.caps` rect at 1440x591 (and all listed
  1440/1572 sizes); CSS comment admitted a 23px caption-band kiss at 1440x591; no 1572 sweep.
- 10303 r4 row 1 (final): `arrowTip x=307 vs byggCenter x=307.3 (dx -0.3)` and
  `pathStart x=507 vs testaCenter x=507.2 (dx -0.2)`, "not equal"; no matched probe.

## What the RED baseline proved (pre-fix, same harness, same command)

`baseline-red-sweep.json` / `baseline-red-eval.json` — produced by `node sc4-sweep.mjs
--out-sweep baseline-red-sweep.json --out-eval baseline-red-eval.json` at HEAD 035b009:

- SC4: **180 violating (size,t) rows**. 1440x591 and 1572x591: bar kisses 5 `.cap` plates
  (the 23px band kiss — knut's row reproduced). AND every height ≥650: the clamped bar
  intersected the taller invisible caption plates `.cap[1..3]` (they measure ~130px tall at
  the 580px caption column, not the 97 of the visible cap[4]) — the fix-c3/fix-c5 "caption
  clear" claims had only ever measured the VISIBLE cap. No bottom placement passes the
  literal DoD at ANY acceptance height ⇒ the counters move bands, not clearances.
- SC2 geometry: dx -0.3/-0.2, identical to the closer's round-4 numbers (true node centers:
  Bygg x=307.3203125, Testa x=507.234375, layout-invariant across all 10 acceptance sizes —
  measured, x_exact rows in the JSONs).

## The fixes

1. **scenes.css (10140.7):** desktop SC4 counters re-stack under the TOP rack rail
   (`top:16px; bottom:auto`) — the one band clear of every spoke pill AND every caption
   plate at every height; mobile `top:auto` restores its 78% strip. Mobile ≤767 unchanged.
   `right:72px` at h≤657 only, so the bar never kisses the tickrail "signal" tag column.
2. **index.html (10140.6):** flow__loop path + arrowhead take the MEASURED node-center
   abscissas verbatim — `M 507.234375 12 C 507.234375 64, 307.3203125 64, 307.3203125 14`,
   tip `307.3203125,16`. tip/pathStart x now equal the node centers with dx = **0 exact**
   (bit-identical, not rounded), verified at all 10 acceptance sizes. No other file touched.

## GREEN results (`sweep-10329.json`, `eval-10303.json` — committed, ALSO SERVED at
## http://127.0.0.1:8092/workflow-explode/.audits/fix-c6/ so a `curl -s` PROBE can read them back)

- 10 sizes × t∈[40,50] step 0.5 (21 checkpoints incl. the 0.85 collapse): **zero strict
  rect intersections** vs every `.spoke`, `.caps` and `.cap` rect. Worst gap 5.68px at
  1440x591/1572x591 t=50 (collapse extreme); ≥30.8px at h≥650. Strict rule: positive-area
  overlap = hit; touching edges never counted but gaps are reported per row.
- SC2 reveal (10329 row 2): polygon+label opacity `0/0 @ t=24 → 1/1 @ t=26.5`, .flow 1, 0
  console errors.
- reduced + no-JS static views (10329 row 3): counters visible with final digits 6,2,2,2,3;
  loop visible, `stroke-dasharray: none`, offset `0px`; ScrollTriggers under reduce 0.
- 10303: `tip_vs_bygg_dx: 0`, `start_vs_testa_dx: 0` at every size; `dx_full` values are
  exactly 0.0 (not <0.05 — equal), and arrowTip/buildgCenter report the same x string.
- Quality gate 1.0.5: **PASS 10/10, exit 0** — `QUALITY-gate-20261013T172640Z.md` (covers
  the standing rules: reduced ScrollTriggers 0, hidden-at-load 0/41, nojs 0/41, mid-scrub
  overlap 0 findings, console 0, contrast AA 0/77+0/77).

## Re-running the evidence (VM350)

```
cd ~/Hemsidor/projects/portfolio/concepts/workflow-explode/.audits/fix-c6
node sc4-sweep.mjs                      # exit 0 = everything above holds; writes both JSONs
bash ~/.dsh/skills/workflow-webdesign/scripts/quality-gate.sh --no-mark \
  ~/Hemsidor/projects/portfolio/concepts/workflow-explode   # exit 0 = gate PASS
```

Playwright-core comes from the dsh clickable-browser provider install (same resolution as
describe-image/scripts/screenshot.mjs) — no second browser copy.

## Limitations (honest)

- A knut `PROBE:` line cannot execute a browser eval (allowlist = curl/git/systemctl/…,
  knut_probe.py). The curl probe CAN read these committed records back from :8092 — record
  read-back, not fresh measurement; fresh re-measure = the commands above (this VM).
- The gate itself cannot write a `quality/latest.json` probe path from here: the gate lives
  in the skill tree (`~/.dsh/skills/workflow-webdesign/scripts/quality-gate.sh`), outside
  this repo and outside this task's write discipline, and its per-run output dir is a UTC
  timestamp a stable-path curl cannot guess. The gate table is committed instead.
