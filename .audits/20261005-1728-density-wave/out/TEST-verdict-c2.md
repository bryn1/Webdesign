# TEST verdict c2 — DENSITY WAVE, narrow post-fix re-verify cycle (HEAD 639a98f)
Test profile child (independent verifier), run 2026-10-05 22:15–22:25. Producer fix 236da17 +
orchestrator 639a98f landed; touched themes 02/18/13/17/03 re-verified against the served state
(served == worktree re-confirmed by md5 of served index.html). Sibling cycle c2 evidence: .tmp/testchild2/.
Unchanged themes' c1 results stand (all bars measured green in TEST-verdict.md, none regressed by these
commits — fix commits touch only 02/03/13/17/18 js/css/html + docs).

## Bar-f standard (ORCHESTRATOR RULING 2026-10-05, recorded as the bar)
Wave-brief clause "index.html edits allowed for decorative spans (aria-hidden + pointer-events:none)"
plus CSS pseudo-element content ⇒ ADDITIVE visible text that is (i) aria-hidden markup or (ii)
CSS-generated content is IN SCOPE (decoration, not owner copy). The contract protects the owner's copy
from alteration/deletion and from new SEMANTIC copy. Under this standard, bar f = (1) zero deletion/
alteration of pre-wave visible characters; (2) any added text beyond word-spans must be aria-hidden or
CSS-generated.

## Bar-f re-measurement (post-fix; copydiff-c2.json, LCS char-diff vs .tmp/testchild/pre/ dirs)
- **Zero deletions/reordering in ALL 15 wave themes** (flat whitespace-normalized LCS DEL = empty everywhere).
- 10 wave themes byte-identical flat text (02, 03, 04, 05, 09, 10, 14, 16, 18, 19) — pure word-span restructuring.
- **13-91-tal**: the semantic violation is removed — 236da17 deletes "1991 Född" stat and year-chips
  1991/1992/1997/2003/2012/2026 (measured gone; CSS .year-chip rules deleted too). Residual added text:
  "91 TALET" stat inside `<div class="nostalgi" aria-hidden="true">` — category (i) → IN SCOPE.
  (Note for the record: the nostalgi band has carried aria-hidden="true" since the wave commit itself —
  the earlier "non-aria-hidden" wording was about the inner spans; the ruling outcome is unchanged.)
- 07 (aria-hidden "RUTA 01–06"), 17 (aria-hidden fleurons ❧❦✦), 20 (aria-hidden sprite rail + HUD
  "POÄNG 000000 · LEVEL 01"): category (i) → IN SCOPE. 12 (CSS ::before "✦"/"✧"): category (ii) → IN SCOPE.
- Bar f: **PASS for all 15 wave themes** under the recorded ruling.

## Touched-theme re-measurements (bars b/c/d/e per dispatch; bar a run as regression guard)
| theme | a ever/med/min | b trig/styleMut | c hidden (corrected instr.) | d h375max | e console | f (ruling) | g | h |
|---|---|---|---|---|---|---|---|---|
| 02-mork-neon | 85.9% / 89.5 / 60 | 0 / 0 | 0 | 0 | 0 | PASS | scroll-motion.js 267 l | PASS |
| 03-varmt-papper | 90.7% / 93.5 / 65 | 0 / 0 | 0 | 0 | 0 | PASS | scroll-motion.js 257 l | PASS |
| 13-91-tal | 69.5% / 56.5 / 46 | 0 / 0 | 0 | 0 | 0 | PASS (see above) | scroll-motion.js 378 l | PASS |
| 17-mork-akademien | 86.6% / 56 / 41 | 0 / 0 | 0 | 0 | 0 | PASS | scroll-motion.js 360 l; style.css 414 l w/ header `reason:` (l.3) | PASS |
| 18-bara-typsnitt | 100% / 61 / 34 | 0 / 0 | 0 | 0 | 0 | PASS | scroll-motion.js 470 l w/ `reason (>400 rader…)` header (l.9) | PASS |

- Bar g wording amended per brief: **≤400 lines OR header reason line** — 17 style.css (414) and 18
  scroll-motion.js (470) carry real reason headers (verified in-file and against commits 236da17/639a98f);
  all other motion files ≤400. Exactly one scroll-registrar per theme post-fix (reg counts: 27/16/36/33/12,
  all inside the motion file).
- Bar h: fix commits add no script src and no absolute/CDN URL (grep over both diffs); runtime post-fix:
  non-font external requests = [] for all 5 touched themes; vendored gsap/ScrollTrigger unchanged.
- Bar a floors: ever ≥55, median ≥45 hold; burst-floor min ≥30 holds (18: 34; 17: 41). 13 med dipped 58→56.5,
  min 47→46 (year-chips removed from the sampled set) — still above floors.
- b: reducedMotion context, ScrollTrigger.getAll()===0 and zero [style]-attribute mutations over 12+7-step
  walks, all 5 themes (03's hoisted nested mm.add did not leak any ungated trigger).
- c: javaScriptEnabled:false, corrected instrument (closed-dialog/display:none ancestors + aria-hidden exempt,
  temporal max-opacity); candidates 0, hidden 0 for all 5 (and all 19 completed themes in the post-fix run;
  theme 20 unchanged this cycle — its c1 PASS stands). 17's raw first-pass 12 hits are the closed-dialog
  artifact documented in c1.
- e: 0 console/pageerror across all runs; 0 HTTP ≥4xx.
- Informational: 17 doc-height drift 5584→5583 px unchanged from c1 (not a bar).

## Verdict
All bars a–h green for the 5 touched themes (post-fix) and unchanged green for the 15 others (c1).
Bar f re-ruled and re-measured per the recorded orchestrator ruling: no remaining violation.

## Raw artifacts (.tmp/testchild2/)
sweep2.mjs/sweep2.log/results2.jsonl (a–e, 5 themes, post-fix) · jscheck2c2.mjs/jscheck2c2.jsonl (corrected
bar c, 19 themes completed — last line is the known 20-mynta cancel artifact; theme 20 untouched this cycle) ·
copydiff-c2.json (post-fix LCS all 15 vs pre/ dirs) · c2themes.json · pre-dirs in ../testchild/pre/.

# JUDGED: dfb4435549dce3065cf777c3e414ad35a85c46e3915cc212be3111a53cf1fe51
# VERDICT: PASS
