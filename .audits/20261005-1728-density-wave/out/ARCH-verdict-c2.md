# ARCH verdict c2 — DENSITY WAVE (15 motion builds), post-wave state

Architecture reviewer (Design profile child), run 2026-10-05, repo /home/claudecode/Hemsidor @ HEAD f2cfedf.
Judged the ARCHITECTURE of commits f8136c9 e500890 c91b7de 353ebcc 1739365 c797e3f ef4fa4a a89745f 5295a32
05e68e8 7d37717 d0d5f03 d735001 f2cfedf 3a22c94. No DENSITY-FIX-01 commit exists (git log verified — DA's 02
AA fix has not landed). Read TEST-verdict + DA-verdict first; did not re-run their probes. Own probes:
`git show --stat` ×15, brace-depth registration scan, GSAP duplicate-query probe and nested-add toggle
probe (vendored GSAP 3.12.7 in headless Chromium) under out/.tmp/archchild/.

## Per-theme one-liners

| theme | commit | verdict |
|---|---|---|
| 02-mork-neon | 5295a32 | OK — one file (scroll-motion.js 261), 2 mm blocks base+min-560, JS-built calendar covered by defer document-order (booking-mock L26 < motion L29, verified) |
| 03-varmt-papper | d735001 | P2 — one file (246), but inner `mm.add` nested INSIDE the no-preference handler body (L171): duplicates stack on every reduce re-toggle (probe-proven) |
| 04-brutalt-tryck | 7d37717 | OK — one file (326), base + min-701 block, shared helpers deliberately hoisted outside both mm branches with header note |
| 05-mjuk-glas | 05e68e8 | P3 — one file (283), ticker drift engine = second drive mechanism beside ScrollTrigger; confined + reduce-inert proven, but doctrine deviation → DEBT-TAG (finding P3-2) |
| 07-retrofilm | a89745f | OK — one file (333), base + min-701; late-built booking grid registered via DOMContentLoaded inside ctx.add inside the branch — textbook defer pattern |
| 09-schweizertag | f2cfedf | OK — one file (270), base + two adds of the SAME 701 query — probe-proven GSAP stacks both (additive, not replacement); convergent ±A→0 drift claimed and held |
| 10-magasincollage | 353ebcc | OK — one file (230), boot on DOMContentLoaded (JS-ready grid); P4: wave re-pinned an existing `.hero-sticker` rotate(-2deg) mobile rule also in layout.css (identical value, cascade-forced) |
| 12-forgyllda | 3a22c94 | OK — scroll.js (legacy name, §4-accepted, 240); best header in wave: codifies ±A→0 + x-only-in-min-width rules explicitly |
| 13-91-tal | 1739365 | OK — one file (385, wave max, under ceiling); single block, no responsive add — 375 handled in CSS; main.js registers nothing |
| 14-dagens-frisyr | ef4fa4a | OK — one file (275), whole setup in `boot()` at DOMContentLoaded, base + min-681 + max-680 pair — gapless, no-preference AND-gated |
| 16-gradientljus | f8136c9 | OK — one file (234); fonts.ready-gated LINE split measuring wrap with final font + `active=false` revert guard + idempotent split reuse — no FOUC/wrap-shift risk; template-grade |
| 17-mork-akademien | c797e3f | OK w/ P3 doc note — one file (360), same fonts.ready+active pattern; commit grew css/style.css 399→404 lines (has header `reason:` line, rule met; ARCHITECTURE.md §8.1 "none above 400" now stale — finding P3-1) |
| 18-bara-typsnitt | d0d5f03 | OK architecturally — one file (384); per-letter scrub + base + min-48rem; tracking-collapse collision is DA's visual finding, not structure |
| 19-galerievaggen | c91b7de | OK — scroll.js (legacy name), 286; base + min-701 + max-700 pair, gapless; tilt.js registers no triggers |
| 20-mynta | e500890 | OK — one file (339), base + 721/720 pair; motion.css new single-purpose file (115) |

## Findings

### P2-1 · theme 03 — nested `mm.add` accumulates duplicate triggers on media toggles
`03-varmt-papper/js/scroll-motion.js:171`: `mm.add('(prefers-reduced-motion: no-preference) and (min-width: 64rem)', …)`
sits INSIDE the outer no-preference handler body (brace-depth 2 = inside the handler function). GSAP reverts AND
re-runs that handler whenever no-preference flips; each re-run calls `mm.add` again with the same query, and GSAP
stacks a fresh context per call. Probe on the vendored GSAP 3.12.7 (headless Chromium, `emulateMedia` reduce→
no-preference→reduce→no-preference): inner handler ran 1 → 3 → 6 times, ScrollTrigger.getAll() grew 2 → 3 → 4,
one element ended with 3 tweens. Consequences: (a) trigger/tween accumulation per OS reduce-setting toggle;
(b) the nested inner block is reverted by its own query term, so reduce stays inert (probe: 0 triggers under
reduce) — no visible breakage in normal use, hence P2 not P1. Also the only theme nesting an add (07's nested
case is a DOMContentLoaded listener wrapped in `ctx.add`, which does NOT stack — different, sound).
FIX (one-liner): move the inner `mm.add` to top level like every other theme does.

### P3-1 · docs/ARCHITECTURE.md §8.1 stale — 17/style.css now 404 lines
The wave (c797e3f) grew `prototypes/17-mork-akademien/css/style.css` 399→404 lines. The file itself carries a
header `reason:` line ("en sammanhållen temadräkt per sidmall"), so the >400-needs-a-reason rule IS honoured.
But ARCHITECTURE.md — the doc the Architect keeps true — still asserts "Next-largest file repo-wide: 399 … none
above hard 400". CONTRADICTED vs tree; update the exception register at close-out (ADD 17/style.css 404 to the
§8 register, or shave ≤4 lines).

### P3-2 · theme 05 — gsap.ticker drift engine beside ScrollTrigger: position = DEBT-TAG
Assessed as briefed. Facts: the engine (`driftItems` + `driftTick` + passive scroll listener at module level,
L21–54) is confined — the ONLY fill site is inside the no-preference handler, the handler returns
`driftReset()` cleanup, and `driftTick` early-returns on an empty array, so under reduce the pump is a no-op.
Reduce-inert is proven twice independently (TEST: 0 style mutations; DA: 0 observes, getAll()=0). It REPLACES
named retired mechanisms (js/enhance.js IO-reveal, js/parallax.js rAF-scroll, CSS view-timeline — header names
them; the `[data-speed]` blobs route exclusively to it, no ScrollTrigger parallax runs beside it on the same
layers). Its motivation is partly real: ScrollTrigger does re-run mm handlers across refresh (the
matchMediaInit/Revert integration is present in the vendored file), and absolute start/end maps went stale
through the ~580px Google-Fonts height swap. BUT pure ScrollTrigger was the doctrine-correct path and is
demonstrably available: a body-trigger scrub (`start 'top top', end 'bottom bottom'`) expresses the same drift,
and the file ITSELF proves the fix works — it already calls `ST.refresh()` on fonts.ready + load (L277–280)
for exactly this staleness. Costs of the deviation: every scroll step re-writes transforms on ALL ~40 drift
items regardless of viewport (the main driver of DA P2-2's 4.2× metric inflation on 05), and the engine's
0→A mapping parks end-state displaced, diverging from the convergent convention siblings adopted. Its
guard-based inertness is also subtler to audit than structural gating — bad template to hand theme 21.
POSITION: **DEBT-TAG, not REFACTOR-NOW** — zero live misbehaviour, PoC-LAN project; register it as the same
kind of §4 exception row 02/11/15 already carry (second drive mechanism, single file, inert-proven), with a
refactor-on-next-touch note and an explicit "do not template-copy the ticker pattern" marker.

### P3-3 · drift-endpoint convention is per-theme divergent, and undocumented
±A→0 (convergent drift, end-state = flow position) is codified only in the headers of 03/09/12; 02 (−24→+24),
07/10/16 (A→−A crossing), and 05 (0→A global growth) break it. Mostly harmless while scrubbing (bands end
off-screen), but the LAST band of a page can never complete at document bottom, so bottom-most content parks
displaced — worst in 05 (footer drift ends at max offset at p=1). Not a defect today; it is a convention the
library should state. FIX: one §4 bullet naming ±A→0 the default and the exceptions.

### P4 notes
- css/ split is sane per theme: every wave css file has one purpose (motion.css / density.css / decor.css /
  mesh.css / rorelse.css / scroll.css / scroll-motion.css), no same-concern split across two files, and the
  full-selector × property × value cross-file duplicate scan hit exactly one rule: 10's `.hero-sticker
  rotate(-2deg)` mobile re-pin (wave-added collage.css:189 vs pre-existing layout.css:123, identical value —
  cascade-forced by the wave's later base rule; fold one into the other on next touch).
- File-name divergence of the motion-css helper across themes (6 names) mirrors the accepted scroll.js/
  scroll-motion.js naming split — cosmetic, per-theme cohesion preserved.
- 05's revert leaves heading word-spans split after a reduce re-toggle (splitWords guards on
  `children.length` so no double-split; text visible, reveal skipped on re-entry) — benign; 16/17's
  `ensureSplit` "reuse-after-revert" pattern is the better template, worth a header pointer next time.
- 02 relies on defer document-order (grid built by booking-mock.js before scroll-motion.js) rather than a
  DOMContentLoaded boot; works (TEST measures slot motion) but an insertion between the tags would silently
  drop the grid's triggers. 07/10/14 own the safer pattern.

## Cleared (attacked, did not break)
- **One registration file per theme**: sole ScrollTrigger.create/scrollTrigger: registrar per theme across all
  15 js dirs; every other theme js is non-registering (registration grep re-run this pass).
- **All registrations inside no-preference mm blocks**: brace-depth scan — zero ScrollTrigger registrations at
  IIFE top level in any of the 15 files; depth-1 module code is engine-state/helpers only.
- **Block logic sound**: every min-/max-width responsive add is AND-gated with no-preference; pairs 14 (681/680),
  19 (701/700), 20 (721/720) are gapless and non-overlapping; 09's same-query double add proven additive-not-
  replacement on the vendored GSAP (both blocks run, no clobber).
- **Vendored lib untouched, self-contained by design**: `prototypes/_assets/vendor/` touched by exactly one
  commit ever (c4e0f4e, the pre-wave vendoring); no wave commit adds shared JS; no CDN src anywhere.
- **Line hygiene**: 15/15 motion files ≤400 (max 385 = theme 13); every motion file opens with an MC-carded
  header naming mechanism, reduce policy, JS-off policy and structure — a theme-21 builder finds the template
  in the first 10 lines; ARCHITECTURE.md §3/§4/§9 name the copy-anatomy explicitly.
- **Commit scope**: `git show --stat` ×15 — every commit touches ONLY its own theme dir; no cross-theme,
  no _assets, no gallery-index, no verdict files in wave commits.
- **Evidence leak**: `git ls-files` has zero evidence/screenshot/probe/jsonl files (the only tracked .png is
  concepts/workflow-explode's, a different run, documented in §8.7); `.gitignore` `.tmp/` matches at any depth —
  `git check-ignore` confirms `.audits/<wave>/out/.tmp/…` is ignored; the wave run dir (BRIEF/TEST/DA) is
  untracked pending close-out, same convention the prior run's out/ was committed under.
- **Defer structure**: JS-built grids registered at DOMContentLoaded (07 ctx.add-wrapped, 10/14 boot-guarded via
  readyState) — no parse-time registration racing late DOM anywhere.
- **fonts.ready**: 16/17 gate line-splits on fonts.ready with `active=false` revert cleanup, measure wrap with
  final fonts, and reuse prior splits (no FOUC, no wrap-shift, no double-build); 05 keeps triggers honest with
  refresh-on-fonts-ready+load; parse-time splits (05) preserve whitespace text nodes → no pre-paint wrap change.
- **gsap.fromTo misuse**: programmatic arg-boundary scan of every `.fromTo(` call in all 15 files — zero calls
  passing scrollTrigger in the 4th (timeline-position) slot; zero `.to()` 3rd-arg-object misuse. No dead triggers.

## Must-fix before next wave touches 03
1. 03 — hoist the nested `mm.add` to top level (P2-1). Recommend same pass: ARCHITECTURE.md §8/§4 refresh
   (P3-1 + 05 exception row + ±A→0 bullet). Note: DA's P1 (02 AA sweep) is the ship blocker; it is not an
   ARCH concern and is unaffected by this file's items.

*(c2 = same judgement as ARCH-verdict.md, re-pinned as its own cycle file per the gate: the judging child runs the hash command as its last step; verdict files are never edited. Findings, table and cleared-list unchanged; parent disposition (P2-1 fix child extended, P3-1/P3-2/P3-3 owned by the orchestrator as doc debt) recorded in DONE.md.)*

# JUDGED: 3dedd179d883984b52d0e9789869ff8d86b19420cc4242d5da82a86b6fe9b6e3
# VERDICT: PASS
