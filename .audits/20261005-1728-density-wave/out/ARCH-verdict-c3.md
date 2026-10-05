# ARCH verdict c3 — DENSITY WAVE re-pin after DENSITY-FIX-01

Architecture re-verify (same Design-profile child), run 2026-10-05 late, repo /home/claudecode/Hemsidor @ HEAD 639a98f.
Commits under review: 236da17 (DENSITY-FIX-01: 02 AA timing, 18 word-gap clamp, 13 copy-contract revert,
17 plaque chip, 03 hoist) + 639a98f (orchestrator: ARCHITECTURE.md reconciliation + 18 reason line).
Prior verdicts: ARCH-verdict.md (PASS) and ARCH-verdict-c2.md (PASS, pin f2cfedf-era). This cycle judges the
POST-FIX state; prior files untouched (verdicts are never edited). Evidence: out/.tmp/archchild2/toggle03.mjs
(own toggle probe), depth/nesting scans, diff reads.

## Disposition checks (the four carried findings)

1. **P2-1 theme 03 nested mm.add — CLOSED (fix verified independently).** `236da17` removes the inner
   `mm.add` from the outer handler body and re-adds it at IIFE top level as block 7b: query string
   `(prefers-reduced-motion: no-preference) and (min-width: 64rem)` — ORDER FOR ORDER identical, selectors
   re-queried in the new scope with a null-guard, rationale comment cites the probe. My own probe
   (archchild2/toggle03.mjs, real theme-03 page, vendored GSAP, 3 full reduce↔no-preference cycles):
   base=84 triggers, every reduce=0, every back=84 — no accumulation (pre-fix control from c2: 2→3→4 stack).
   Library-wide rescan: zero nested `mm.add` in all 15 motion files now; registration depth scan clean
   (every scrollTrigger site inside a handler).
2. **P3-1 ARCHITECTURE.md §8.1 — CLOSED.** §8.1 now lists `17-mork-akademien/css/style.css` **414** and
   `18-bara-typsnitt/js/scroll-motion.js` **470** as the >400 exceptions; `wc -l` on the tree matches both
   numbers exactly. 17 carries its original header reason line; 18's header gained the `reason (>400 rader,
   DENSITY-FIX-01)` line in 639a98f (verified at file line 9). No file grew past 400 otherwise (03 motion now
   257, all others ≤400).
3. **P3-2 theme-05 ticker DEBT-TAG — CLOSED as doc exception.** §4 reality table carries a new row for 05
   naming the engine, the refresh/matchMedia-rerun motivation, the TEST-c2+DA inertness proof, and the
   do-NOT-template-copy warning with pure-ScrollTrigger as the doctrine path. Matches my c2 position verbatim
   in substance.
4. **P3-3 convergent ±A→0 convention — CLOSED with a P4 wording nit (below).** §4 carries the convention
   bullet (±A→0, never ±A→∓A) plus the wide-x-behind-min-width companion rule.

## Fix-commit regression checks (236da17 / 639a98f) — no architecture regressions found
- **Git scope:** both commits touch ONLY their theme dirs + docs/ARCHITECTURE.md; no new files, no _assets,
  no cross-theme writes; `f2cfedf..HEAD` = 8 files, +172/−77.
- **02 (AA timing):** pure scrub-window change (bar ends 'top 62%', text starts 'top 50%') — same
  mechanism, same blocks, no structural delta; comment documents the measured before/after.
- **13 (chip revert):** HTML removal + matching decor.css block (.year-chip, .yc1–.yc6) + matching JS block 11
  removal with a traceable placeholder comment — grep across the theme for orphan references (year-chip,
  yc1–6, data-from 1968): ZERO orphans. Remaining `.stat-num` counter loop still valid (element kept).
- **17:** single-rule local change (opaque gold chip + dark numeral + size bump) inside the existing plaque
  block; DOM/aria/motion untouched, as the comment claims.
- **18 (clamp):** helpers `wordGaps`/`clampWordAmps` are pure functions inside the existing IIFE (no globals);
  two-pass slack relaxation, zero-clamp on non-positive slack, rounding margin; blocks 21/22 moved onto the
  existing fonts.ready pattern (live flag + heroCtx/laterCtx revert — same shape as 16/17), measurement after
  webfont load fixes fallback-font-width mis-measure; `ST.refresh()` after the late build. File 470 lines,
  header reason line present. All registrations still inside mm no-preference handlers.
- **03:** see disposition 1; file now 257 lines.

## New findings this cycle
- **P4 · ARCHITECTURE.md convention bullet overstates.** The bullet says the ±A→0 convention is "Held
  repo-wide after DENSITY-FIX-01" — it is not: 02 (`drift(..., -24, 24)` L177–178), 07 (sprocket/cal-grid
  `6d→−6d`, `4d→−4d`), 10 (`--sx 30px→−26px`), 16 (eyebrow `18d→−18d`) keep crossing scrub drifts and 05's
  ticker engine stays 0→A (grep-verified post-fix). The owner explicitly ruled the divergence not-a-defect;
  the bullet should therefore read "default for all new motion; existing exceptions: 02/07/10/16 crossing
  scrub drifts, 05 ticker rise — convert on next touch". One-line doc fix, orchestrator-owned (same owner
  as §4/§8). No code change requested.

## Note on the pin
The judged hash this cycle equals the c2-era value because the helper hashes deliverable STATE versus the
passed base (--base 639a98f = current HEAD, tree clean, out/ non-meta files unchanged) — a content-vs-base
state map, not a commit id. dod-check recomputes against its own base at gate time.

# JUDGED: 3dedd179d883984b52d0e9789869ff8d86b19420cc4242d5da82a86b6fe9b6e3
# VERDICT: PASS
