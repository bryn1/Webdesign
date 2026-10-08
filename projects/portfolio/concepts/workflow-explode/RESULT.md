# RESULT — T1 redesign: workflow-explode scroll mock (MC 10211 / 10140.4)

Remake (not refine) of the visual world at `projects/portfolio/concepts/workflow-explode/`,
built with the project-scoped impeccable skill (context run once; `reference/new-work.md` +
`reference/craft-floor.md` loaded). CONCEPT.md stayed the content/concept/mechanism canon —
Swedish copy verbatim, scene table SC0–SC5, invented data + `demo · fejkad data` chip,
one pinned stage + one scrubbed master timeline with scenes as labels. `git` untouched here —
parent verifies and commits.

## Chosen direction — "Signalväg": studio-rack elevation + patch-list

Roll: `impeccable concept-seed --scope direction --mode experience` → seed key **49047d01**,
assigned index **6** of the grounded list (rack elevation + patchbay patch-list). Unattended
run: the direction round was resolved by the roll + the dispatch brief ("pick the design
direction yourself"); no decision page, no user choice — stated substitution, not silent.
PRODUCT.md: none exists in this repo and none was invented — CONCEPT.md + README + this brief
were used as product truth per the brief's explicit ruling; the context launcher's
NO_PRODUCT_MD note is recorded here as required.

**World:** the finished prototype is a unit rack-mounted in a graphite studio wall (rails
top/bottom with screws, vertical `SIGNAL` tick-rail right). Scrolling patches its signal out:
slices split → aluminium module faceplates carry the code → the chain is a patch line of
jacks + amber cables with a coiled return cable (`varv 1 · 2 · 3`, DA-grinden vermilion) →
three bays with fixed-cell state lamps (hollow kö / amber kör / green verifierad) → the
orchestrator is the central patchbay plate, cables fan to worker modules while a glass meter
bridge counts up → cables are unplugged, the image recondenses and racks in as the nav's
docked rack card beside two engraved nav plates.
**Palette:** graphite wall #1b2024, panel #262d33, recess #101519, aluminium #aab3b8, ivory
silkscreen #e9e4d9, amber signal #e8a13a/#eeae54, green #6fbf8a, vermilion #d4552e (mark only).
Full-palette strategy; every role contrast-checked ≥4.5:1 small / ≥3:1 large.
**Type:** Saira Condensed (display, silkscreen labels — rank by weight/case/reversal) +
Saira (body) via Google Fonts link (repo exception E3, docs/ARCHITECTURE.md:83) with local
fallbacks ("Arial Narrow"/system) in every stack; system mono for code + measured digits.
**Motion:** same CONCEPT §1 beat map; one authored moment = the amber level travelling the
tick-rail across the whole 60s + cables that draw; MA beat: the 28–30s collapse leaves the
wall genuinely bare. Event-driven lamps (PROJEKTIONSHÄNDNING raise), never decorative glow
on inactive scenes.

**Challenger verdicts (fused, weighed on audience identification × product clarity):**
16mm film — declined, raise kept: PROJEKTIONSHÄNDNING. Ikebana/ma — declined, raise kept:
MA (bare 28–30s). Darkroom — competitive: kept line STATIONORDNING (chain reads as stations
in fixed order). Nixie gauze — competitive: kept line STRUKET SIFFER (meter digits glow over
an unlit ghost "8", CSS `.counters b::before`). Ice press — declined, raise kept:
MATERIALÅGÅNG (steel/aluminium/glass/lamp only — no second medium anywhere).
Timetable rack — competitive: kept lines TIKRÄL (tick-rail instrument, desktop) + FYLLT/HAL
(state as filled/hollow fixed-cell lamps). None beat the assigned direction on both axes.

## What was built (all files ≤400 lines, none needs a reason line)

index.html 167 · css/tokens.css 63 · css/base.css 208 · css/scenes.css 188 · js/main.js 53
(untouched — mechanism ruling) · js/scenes.js 177 · README.md 34 · vendor copies untouched ·
`assets/hero-12.png` untouched (REAL screenshot of the real theme-12 prototype — no image
generation anywhere in this run; no people generated). No browser-delivered artifact contains
the direction contract (it lives here + in the gitignored `.impeccable/surfaces/` brief).

## Mechanical gate (VERIFIED this session)

`bash ~/.dsh/skills/workflow-webdesign/scripts/quality-gate.sh <folder>` → **exit 0, PASS**,
re-run after the last CSS/JS fixes (2026-10-07T06:22:30Z): detect hard-set 0 · contrast
0/77 @1440 + 0/77 @375 · console 0 in all four contexts · overflow375 375/375 load AND after
scroll · reduced: 0 hidden text, **0 ScrollTriggers under reduce** (1 normally) · nojs: 0
hidden text · links 0 broken. Re-confirmed 2026-10-07T06:29Z with `--no-mark` (copy of the
report: `.audits/10140-shots/gate-nomark.txt`, raw output `.audits/quality/`); no
`QUALITY.md` left in the folder itself — per this dispatch the parent commits, and the gate
mark would otherwise sit untracked in the tree (DoD loop hygiene, re-run the gate to
regenerate it at commit time). Non-gating
REVIEW row: dark-glow warnings x8 — these are the rack's signal lamps/meter glow, the
world's functional lighting, kept on purpose; stripes advisory = wall channel lines.

## Screenshots (`.audits/10140-shots/`, gitignored)

final-1440.png · final-375.png (full-page, screenshot.mjs: verdict clean, 0 console + 0 page
errors, 0 failed requests, overflow_x false both widths, ~2.1k visible text chars). Scene
frames from the clickable browser: d-sc0/sc1/sc2/sc3/sc4/sc5/sc5-late.png (desktop, one live
caption per stop, counters tween to 6/2/2/2/3 = §3.4 invariant, dock+nav at pin release),
d2-sc2.png (after ghost-panel fix), m-hero/m-sc1/m-sc3/m-sc4/m-sc5.png (375: stacked
faceplates, scrollable board, top counter strip, cascading spokes). Gate's own reduced/nojs
full-page shots under `.audits/quality/`.

## Deviations & readings (stated, not silent)

- **Visual world replaced; mechanism kept.** One pinned stage + one scrubbed master timeline
  (labels sc0…sc5, 7200/4800px) — no deviation from mechanism monogamy; the rack world rides
  the existing beat map. The browser-chrome frame survives restyled as the rack monitor's
  bezel/rail: dots are three amber LEDs, the URL pill `127.0.0.1:8090/12-forgyllda-salongen/`
  stays (CONCEPT §1 SC0 content).
- **New elements beyond CONCEPT §2** (dressing, same z-layers): rack rails, unit screw foot
  (fades with chrome at 18s), tick-rail instrument, vermilion gate mark. No new ScrollTriggers.
- **Fonts:** CONCEPT §5.5's "system stack only" is superseded by this dispatch's explicit
  ruling (Google Fonts allowed, local fallback); verified the repo canon records the same
  exception (E3).
- **SC5 "fragments tween to center" still omitted** (SC1–SC4 layers are opacity:0 by then —
  same reading as the previous build, F7 note). Hero intro starts at opacity .35, not 0
  (scrub-0 blank-hero guard, same as before). Calib c1 fixes carried: html.js opacity-0
  defaults for fromTo targets, counters 40s zero-set, mobile scrollable board, spoke cascade,
  mobile counters raised .85→.95rem (15.2px ≥ F2 floor; the old strip text risked the gate's
  small-text hard set).
- **Impeccable finish handoffs substituted in-thread** (spawn forbidden by this dispatch):
  batched screenshot inspection rounds (two, ceiling held), `impeccable detect` once
  (hard-set clean; findings above), documentation = this RESULT.md section instead of
  DESIGN.md (folder-only write boundary + no-owner-answers rule; the world is recorded here
  and in the gitignored surface brief with the seed key).
- **No server started**: evidence shots taken against the existing :8092 parent keepalive
  (read-only use); :8090/:8091 untouched. Nothing outside this folder was written except
  gitignored run state (`.audits/`, `.impeccable/`, `.tmp/`).
- **Caption eyebrows beyond CONCEPT §1 (recorded per MC 10211 fix-c1, P3-b):** the
  `cap__eyebrow` labels on SC1–SC5 (`scen 1 · koden` · `scen 2 · flödet` · `scen 3 · tavlan`
  · `scen 4 · orchestratorn` · `scen 5 · tillbaka`) are new copy dressing beyond §1's copy
  column (§1 specces the eyebrow only for SC0, `mina prototyper`); tone-identical rack-label
  dressing, stated here rather than silent.

# RESULT: rebuilt as "Signalväg" studio-rack world; quality-gate exit 0 (PASS, 7/7); one pinned stage intact; screenshots + this file in-folder — parent verifies + commits

## PARENT ADDENDUM (orchestrator, 2026-10-07, MC 10211)

- Parent verified the gate independently: re-run exit 0 PASS (06:36 + again 06:43 after
  the fix below). Screenshots inspected with parent's own eyes (slices of final-1440/375,
  d-sc1, d-sc4, d-sc5, m-sc4).
- **P2 defect found + fixed by the parent:** `assets/hero-12.png` was byte-identical to
  the 2026-10-05 `.tmp/hero-candidates` capture — from BEFORE the prototype's persona
  rename (it shows "Anny Morin · Frisör i Karlskrona"; the served theme 12 is
  "Jane Cooper · Frisör i Malmö"). The page's SC0 claim is a real screenshot of the real
  prototype, so the stale image was a content defect. Re-shot 2026-10-07 from
  http://127.0.0.1:8090/salong/prototypes/12-forgyllda-salongen/ (1280×900, screenshot.mjs
  verdict clean, matches --hero-ar 1280/900); md5 now ab2a69ae... The "untouched" line
  above describes the child's run and stands as its own record; the swap is this addendum.

## FIX-c2 (frontend profile, 2026-10-07, MC 10211 — DA-verdict F-A/F-B/F-C)

Mobile-only fixes; desktop proven untouched. Evidence + instrument outputs:
`.audits/fix-c2/` (gitignored, README.md indexes every file).

- **F-A · P2 — mobile SC2 broken scene + 10px label. FIXED** (`js/scenes.js`
  `layoutFlow()`, run at SC2 build, on real resize and after webfonts — wrap depends on
  loaded font metrics). Connectors are taken out of the flex flow (absolute) — in-flow
  hiding made the wrap oscillate (hiding a link re-wraps the line it lives on; the first
  pass measured the layout its own decision mutated). Each connector is RE-SEATED in the
  measured gap jack→jack when its two jacks share a line, dropped when the chain wraps
  between them (their flex slots are gone at ≤767 either way — no gap is left behind).
  The return cable is RE-ANCHORED to measured jack rects: out of `Testa`'s underside,
  under the wrapped rows, up into `Bygg`'s underside with the arrowhead at the jack
  (§1 "Testet skickar byggaren baklänges"), and the svg viewBox is rewritten to measured
  px so CTM = 1 → `varv 1 · 2 · 3` (string kept) paints at a true **15px** (was 15 ×
  CTM 0.6696 ≈ 10). No new ScrollTrigger/tween: the existing 24s dash-draw + pulses run
  on the new path (`pathLength=1` stays); the path is idempotent-stable across repeated
  passes. Desktop restore path writes the canonical markup attributes back verbatim.
  Measured at the stop: CTM 1.0, 3 connectors seated (the wrap-point one dropped, none
  dangling), overflow_x false, one ScrollTrigger / 60s / sc0–sc5.
- **F-B · P3 — mobile SC4 cables short of their pills. FIXED** (`scenes.js` scene4):
  wire width is no longer the fixed CSS 100px (mobile) — per cable it is now
  `round(hypot(dx,dy))` to the spoke's own cascade centre + 10px tucked UNDER the pill
  (spokes paint over wires). Measured at the settled stop (375×812 scroll 3800, t=47.5):
  all three cable ends land INSIDE their pill rects (dist-to-edge 0/0/0; was ~7px and
  ~65px short), counters 6/2/2/2/3 intact. Caption clearance measured against the
  VISIBLE caption top (the `.caps` container's own rect tops at its bottom anchor — all
  children are absolute): worker-3 pill bottom 588 vs cap-4 eyebrow top 597 → clears by
  9px at 375×812, the project's evidence height (as in DA's own da-m4). On 667-height
  viewports the pill meets the caption text band — PRE-EXISTING shipped geometry (spoke
  cascade targets untouched here; caption z:60 keeps its copy readable), recorded as a
  lead, not silently re-cascaded. Desktop branch explicitly sets 200px = the
  CSS value (hypot of the ±R components is exactly 200) so a mobile→desktop resize can
  never leak a mobile length — SC4 1440 stays byte-identical (proof below).
- **F-C · P3 — mobile SC1 last panel under the caption. FIXED** (`css/scenes.css` ≤767
  block): the three `.code-panel`s swap by opacity, so they now share ONE grid cell
  (`display: grid; place-items: center` + `grid-area: 1/1`) instead of keeping three
  flex slots — the visible panel lands in the same fixed frame regardless of which one
  it is. Measured fresh at the phases (375×812): scroll-motion.js panel y 274–538,
  base.css panel y 262–550, cap-1 eyebrow (visible caption top) y 623 — panel clears the
  caption by 85px, inside the viewport, no cut line; `transform: none` + the §2 z-order (caps z:60) untouched; the
  ≤480 static stack in base.css (all three visible at once, no-JS/reduced) untouched.
- **Desktop 1440 pixel-unchanged (VERIFIED):** fresh-load shots at SC1 1800 / SC2 3180 /
  SC4 5640 are **byte-identical** (md5) to the pre-fix references — PIL diff 0.0000 %,
  bbox None, full frame (no caption-strip exclusion needed): SC1 `49f09a1d…` (=
  `.tmp-da/da-sc1-1440` = fix-c1 `c1-after-sc1-1440`), SC2 `bfbeb2b2…` (= `ev-1440-sc2`
  = `.tmp-da/da-sc2`), SC4 `63627305…` (= `.tmp-da/da-sc4` = fix-c1 `c1-sc4-1440`).
- **Mechanism + gate (VERIFIED):** 1 ScrollTrigger, 1 pin-spacer, 60s timeline, labels
  sc0–sc5 at settled stops desktop AND mobile; `quality-gate.sh` exit 0 PASS 7/7
  (final run 2026-10-07T12:15Z). 375 full-pin sweep: 0 console errors, scrollWidth 375 at
  every step. The run regenerated the folder-root `QUALITY.md`; since
  the child never commits, it is moved to `.audits/fix-c2/QUALITY-gate-20261007T1215Z.md`
  (fix-c1 precedent) so no untracked file is left in the tree — root stays clean per
  line 64's claim; F-E's underlying gate-artifact question stays the parent's decision.
  Sizes after: scenes.js 256 ≤ §6 300, scenes.css 205 ≤ §6 300; base.css,
  tokens.css, main.js, index.html untouched. Leads NOT fixed (out of F-A/F-B/F-C scope,
  recorded): static-view arc label ≈13.8px at 375 under reduced/no-JS (base.css
  min(560px,100%)); worker-3 pill meets the caption text band on 667-height viewports
  (at 812 it clears the visible caption by 9px — see the F-B bullet; pill targets are
  shipped-state, unchanged here; caption z:60 keeps its copy readable).
- **Recorded parent state (not redone here):** the 2026-10-07 09:59 comment-only edits to
  `css/scenes.css`/`css/tokens.css`/`js/scenes.js` and the MC-10211-comment scrub
  (zero MC ids in delivered css/js per §3.4) were done by the parent before this cycle —
  this bullet records them, per the DA's F-D "name it in the record" ask; no re-verify of
  those edits was in this dispatch's scope.

## PARENT CLOSE-OUT (orchestrator, 2026-10-07, MC 10211)

- Loop record (`.audits/20261007-0645-hero-remake/`): TEST-verdict FAIL (SC1@1440 P2) →
  fix-c1 → TEST-c2 PASS → DA FIX (F-A mobile-SC2 P2, F-B/F-C P3) → fix-c2 → TEST-c3 PASS →
  DA-verdict-c2 SHIP → ARCH SHIP. quality-gate exit 0 on every tree, final PASS at
  commit time on the delivered tree.
- Delivered files contain zero real MC ids (parent comment scrubs after TEST-c3 +
  after the fix-c2 re-introduction; grep VERIFIED clean in index/css/js).
- QUALITY.md stays UNtracked per README "run records stay on disk, untracked" (DA F-E
  ruling: untracked, mirror-excluded, regenerated per gate run).
- Open recorded P3s (accepted for a concept mock, owner may re-open any): base.css 208
  vs §6 budget 180; SC1 desktop faceplate tops uneven (craft judgement); SC4 patchbay
  plate has no jack sockets; reduced-motion plates could interleave per visual.
- E3 font exception: Google Fonts link + local fallback used (dispatch override of CONCEPT
  §5.5); docs/ARCHITECTURE.md:83 still says "BLOCKED pending an owner vendoring ruling" —
  owner decision OPEN (vendor the two Saira files or ratify the CDN for this folder).

## PARENT E3-ADDENDUM (2026-10-07, same day) — font-vendoring
Owner opened the live URL and asked why it differed from local; byte-diff showed ALL 9 delivered files identical live-vs-repo (md5, this session), so the visible difference could only be client-side font fallback (blocked fonts.googleapis.com → fallback stack). Surfaced with recommendation "vendor" (I labelled it E3 — SCOPE NOTE: docs/ARCHITECTURE.md:85 shows the repo-wide E3 is about the 20 PROTOTYPES' CDN exception, which stays OPEN; this ruling covers only this page's Saira faces); owner answered **"kör"** (= go on the recommendation). Vendored: Saira variable 400–600 + Saira Condensed 600/700 (latin subset, from Google Fonts css2; the 500 face was declared but unused by any rule → dropped, coding-discipline). New files: css/fonts.css + assets/fonts/*.woff2 (96 kB total); index.html link-taggen bytt. Render proof: document.fonts shows the 3 faces loaded, 0 failed requests, gate PASS 7/7 after change. README de-staled (lines 22/32, retired "fonts-länken" claims). Zero external requests remain on the page.

## LIVE-SESSION 2026-10-07 (impeccable live, proxy :8450)
-m
One steer (event cafba95f, verbatim 'the arrow should end att "bygg" and start att "Testa"'): SC2 bakedge redrawn Testa(507)->Bygg(307) in the 560-viewBox using measured flex-node centers; arrowhead tip verified on Bygg, label recentered 407. Gate PASS 7/7, commit a83efa5, MC 10140.6 closed with VERIFY_EXIT=0. Fonts vendored same day (21d6206, see E3 addendum). Init done with owner: PRODUCT.md+DESIGN.md at repo root (a8912f2), buildPath=comp.
