# TEST verdict — DENSITY WAVE (15 motion builds), post-wave state
Independent verifier (Test profile child), run 2026-10-05 19:33–20:20, repo /home/claudecode/Hemsidor,
served at http://192.168.5.231:8090/<theme>/ (served dir confirmed = repo dir: server cwd /home/claudecode/Hemsidor;
served scroll-motion.js md5 == worktree file). All 20 themes judged on all bars a–h. No fixes applied; measurements only.

## Method (my own probes; playwright-core chromium per the given createRequire mechanism)
- **a** density: 1280×800, settle 1.6 s after load, one in-page walk: first 500 `body *` elements (script/style/link/meta excluded;
  real n = 206–469, i.e. every page has <500 sampleable elements), signature [computed transform, opacity, color, backgroundColor,
  rect.top+scrollY(absTop)], 24 steps to max scroll, 260 ms settle/step; ever-change = elements changed ≥1 step;
  median = median movers over the 24 step-transitions; min/step recorded. Cross-check with absTop dropped for position:fixed
  elements (strict col in results.jsonl): median differs ≤1.4 — no fixed-layer inflation.
- **b** reduce: context reducedMotion:'reduce', matchMedia verified true; ScrollTrigger.getAll().length; MutationObserver
  (attributeFilter ['style'], subtree) counting [style]-attribute mutations over a 12-step down + 7-step up walk.
- **c** JS-off: context javaScriptEnabled:false; ancestor-chain effective-opacity walk; ancestors display:none/visibility:hidden,
  closed `<dialog>` subtrees and aria-hidden excluded; every candidate re-sampled temporally (6–8×/300 ms), hidden = max eff- opacity
  still <0.15. (First-pass instrument without these fixes flagged 15/17/20 — see Notes; those were probe artifacts.)
- **d** 375×812, 12-step walk, documentElement.scrollWidth−clientWidth at every step.
- **e** console 'error' + pageerror across all three JS runs per theme (1280 walk, reduce walk, 375 walk); HTTP ≥4xx recorded separately.
- **f** copy: `git archive <build-commit>^` theme dir extracted read-only to .tmp/testchild/pre/ and diffed vs worktree:
  html text (script/style stripped, tags stripped, entities decoded), whitespace-flattened LCS char diff (span-split-safe),
  plus CSS `content:"…"` string extraction, plus added script-src lines.
- **g** scroll registration: per-theme grep of ScrollTrigger.create/scrollTrigger: across js/*.js; motion file line count.
- **h** script-src grep of every index.html (CDN/absolute srcs), build-commit added-src lines, vendor files on disk,
  runtime external requests captured on every request.

## Results table (bars = PASS/FAIL)
| theme | a ever/med/min | b trig/styleMut | c hidden | d h375max | e console | f copy | g file (lines) | h |
|---|---|---|---|---|---|---|---|---|
| 01 (untouched) | 62.8% / 64 / 45 | 0 / 0 | 0 | 0 | 0 | PASS (no wave commits) | scroll-motion.js 131 | PASS |
| 02-mork-neon | 85.9% / 90 / 60 | 0 / 0 | 0 | 0 | 0 | PASS | scroll-motion.js 261 | PASS |
| 03-varmt-papper | 90.7% / 93.5 / 65 | 0 / 0 | 0 | 0 | 0 | PASS | scroll-motion.js 246 | PASS |
| 04-brutalt-tryck | 86.7% / 59 / 38 | 0 / 0 | 0 | 0 | 0 | PASS | scroll-motion.js 326 | PASS |
| 05-mjuk-glas | 89.2% / 158.5 / 148 | 0 / 0 | 0 | 0 | 0 | PASS | scroll-motion.js 283 | PASS |
| 06 (untouched) | 85.6% / 70 / 50 | 0 / 0 | 0 | 0 | 0 | PASS (no wave commits) | scroll-motion.js 122 | PASS |
| 07-retrofilm | 92.3% / 130.5 / 66 | 0 / 0 | 0 | 0 | 0 | **FAIL** | scroll-motion.js 333 | PASS |
| 08 (untouched) | 66.4% / 47.5 / 39 | 0 / 0 | 0 | 0 | 0 | PASS (no wave commits) | scroll-motion.js 108 | PASS |
| 09-schweizertag | 85.3% / 66.5 / 36 | 0 / 0 | 0 | 0 | 0 | PASS | scroll-motion.js 270 | PASS |
| 10-magasincollage | 72.8% / 74.5 / 53 | 0 / 0 | 0 | 0 | 0 | PASS | scroll-motion.js 230 | PASS |
| 11 (untouched) | 81.1% / 50 / 25 | 0 / 0 | 0 | 0 | 0 | PASS (no wave commits) | scroll-motion.js 78 | PASS |
| 12-forgyllda | 92.7% / 97.5 / 70 | 0 / 0 | 0 | 0 | 0 | **FAIL** (CSS content) | scroll.js 240 | PASS |
| 13-91-tal | 69.7% / 58 / 47 | 0 / 0 | 0 | 0 | 0 | **FAIL** | scroll-motion.js 385 | PASS |
| 14-dagens-frisyr | 96.8% / 105.5 / 62 | 0 / 0 | 0 | 0 | 0 | PASS | scroll-motion.js 275 | PASS |
| 15 (untouched) | 80.7% / 159.5 / 146 | 0 / 0 | 0 | 0 | 0 | PASS (no wave commits) | scroll-motion.js 143 | PASS |
| 16-gradientljus | 83.8% / 71 / 53 | 0 / 0 | 0 | 0 | 0 | PASS | scroll-motion.js 234 | PASS |
| 17-mork-akademien | 86.6% / 56 / 41 | 0 / 0 | 0 | 0 | 0 | **FAIL** | scroll-motion.js 360 | PASS |
| 18-bara-typsnitt | 100% / 61 / 34 | 0 / 0 | 0 | 0 | 0 | PASS | scroll-motion.js 384 | PASS |
| 19-galerievaggen | 83.6% / 74.5 / 16* | 0 / 0 | 0 | 0 | 0 | PASS | scroll.js 286 | PASS |
| 20-mynta | 97.8% / 140.5 / 110 | 0 / 0 | 0 | 0 | 0 | **FAIL** | scroll-motion.js 339 | PASS |

Bar a floors: ever ≥55 and median ≥45 met by all 20. Burst-floor min ≥30 met by every burst-claim theme (04:38, 09:36, 12:70, 14:62, 17:41, 18:34).
*19 min/step = 16 measured (median/ever pass; 19 is not a burst/step-pattern theme — no min claim in its build commit; orchestrator's own sweep measured min 17 and did not apply the floor — recorded for the record).

## bar f FAIL details (the only red on the board) — additive only, zero deletions everywhere
LCS char-diff on whitespace-flattened visible text: **zero deleted/reordered characters in all 15 wave themes** (owner copy
survives intact everywhere); 10 wave themes are byte-identical flat (pure word-span restructuring). The bar reads
"word-spans OK, text bytes not" — these themes add visible text bytes beyond spans (no owner artifact covers additions):
- **07-retrofilm**: added `<span class="frame-no mono" aria-hidden="true">RUTA 01</span>` … `RUTA 06` (6 new visible frame-number labels; aria-hidden).
- **12-forgyllda-salongen**: html text byte-equal; css/scroll.css adds `.emberfield span::before{content:"✦"}`, `.footfield span::before{content:"✧"}` — 2 new visible generated glyphs.
- **13-91-tal**: new semantic Swedish copy, NOT aria-hidden: stat spans `1991 Född` / `91 Talet` + year chips `1991 1992 1997 2003 2012 2026`.
- **17-mork-akademien**: added `<span class="fleuron" aria-hidden="true">❧|❦|✦</span>` (5 decorative glyphs).
- **20-mynta**: added `.sprite-rail` block-glyph rows (aria-hidden, 36 glyphs) and `<p class="marquee__hud px" aria-hidden="true">POÄNG <span id="hud-poang">000000</span> · LEVEL 01</p>` — new visible on-screen text incl. brand string "POÄNG".
All five are insert-only and four are aria-hidden decoration; the owner/orchestrator may waive with an accepted ruling —
as measured, the bar goes red. 13 and 20 carry non-decoration new copy.

## Notes / accepted rulings honored
- c first-pass flags explained (kept in results.jsonl for audit): 15 → 7 hits all inside closed `<dialog id="demo-dialog">`
  (`:not([open]){display:none}` in its own CSS); 17 → 12 hits inside closed `<dialog id="bokningsdialog">`; 20 → 1 hit
  `.blink` (CSS `@keyframes blink{50%{opacity:0}}` steps(1)) — temporal samples [0,1,1,0,0,1,0,0] → visible half-cycle blink
  works with JS off (CSS-only). Corrected instrument: hidden = 0 all 20.
- b judged on [style]-attribute stability + getAll()===0 per accepted ruling (absTop signature lies for fixed layers);
  styleGlobal=true everywhere (vendored ScrollTrigger loaded, 0 triggers under reduce). Theme 05 ticker-drift acceptance noted —
  reduce-inert proven here: 0 style mutations during reduce walk.
- e: 0 console/pageerror events in all 59 JS runs (3 per theme); HTTP ≥4xx: 0 themes.
- h: every theme's script-srcs are relative: ../_assets/vendor/gsap.min.js + ScrollTrigger.min.js (present: 72,304 B / 43,974 B)
  + theme js; grep CDN/absolute src across all 20 index.html: empty. Build commits added script srcs only: 02 `js/scroll-motion.js`
  (its own motion file); 04 added inline `classList.add("js")` snippet (no src). Runtime: only external requests are
  fonts.googleapis.com/css2 + fonts.gstatic.com woff2 (Google Fonts styles/fonts, not JS libs) — pre-existing pattern
  (pre-wave versions already load them); no new external JS.
- Cross-check vs orchestrator .tmp/final-sweep.txt (CLAIM, not substitute): my a/e measurements confirm it within
  ±2 pt ever / ±6 med (lane samples, not greedy; 05 I measured above its claim); 19 min 17 vs my 16 consistent. The sweep
  did not test b, c, d, f, g, h — this file covers them.
- Doc-height drift during walk (informational, not a bar): 17: 5584→5583 px; 20: 5214→5196 px; all others stable.
- g: exactly one file per theme performs scroll registration (ScrollTrigger.create/scrollTrigger:); no other theme js
  registers (only matchMedia/refresh references); all motion files ≤400 lines (max 385, theme 13).

## Raw artifacts (all under .tmp/testchild/ relative to this file's dir)
- sweep.mjs / sweep.log / results.jsonl — bars a,b(raw),d,e + external requests + 4xx, 20 themes
- jscheck2.mjs / jscheck2-20.mjs / jscheck2.jsonl — bar c corrected instrument (last 20-mynta line is the valid one;
  the line above it is the killed run's cancel artifact)
- copydiff.mjs / copydiff.json / copydiff-lcs.json — bar f html-text + CSS-content + LCS evidence; pre/ — git-archive'd pre-commit theme dirs
- mech-test.mjs — mechanism proof (reduce matchMedia + getAll, JS-off evaluate)
- Verdict of orchestrator's own sweep read and compared, never substituted.

# VERDICT: FAIL
