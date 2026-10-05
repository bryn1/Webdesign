# RESULT — T2 frontend build: workflow-explode scroll mock (MC 10140.3)

Deliverable: `concepts/workflow-explode/` built to CONCEPT.md (AMENDED c1) §1–§6 —
one pinned stage, one scrubbed master timeline (labels sc0@0…sc5@50), Swedish copy
verbatim, all shown data invented (on-screen chip `demo · fejkad data`).

Served: http://127.0.0.1:8092/workflow-explode/ → **200** (parent keepalive; no server
started by this run; :8090/:8091 untouched). All assets 200 via curl (html, hero PNG,
vendor, css, js).

## Files (all ≤ §6 budget; hard ceiling 400 nowhere near)
index.html 157 · css/tokens.css 53 · css/base.css 138 · css/scenes.css 95 ·
js/main.js 53 · js/scenes.js 148 · README.md 31 · js/vendor/gsap.min.js +
ScrollTrigger.min.js (3.12.7, COPIED from prototypes/_assets/vendor/, verbatim) ·
assets/hero-12.png (COPIED from .tmp/hero-candidates/12-forgyllda-salongen/shot-1280.png,
1280×900; :8090 not needed at build). Palette = theme 12 real hexes read read-only from
prototypes/12-forgyllda-salongen/css/style.css: emerald #0d211b, ink #0a1512 (stage),
gold #c9a55a, paper #f4ead8.

## Verification (VERIFIED this session, evidence JSON + PNGs in
`.audits/202610051009-workflow-explode/.tmp/T2-shots/`)
1. screenshot.mjs **top pass** (top.json, widths 1280,375, `document.title` eval):
   `"verdict":"clean", "console_errors":[], "page_errors":[], "failed_requests":[]`,
   per width: `"overflow_x":false, "scroll_width":==innerWidth, "visible_text_chars":2115`,
   title eval = "workflow-explode · konceptmock — Förgyllda salongen". exit 0.
2. screenshot.mjs **deep-scroll pass** (deep.json): evals `window.scrollTo` to
   1350/2550/3750/4950/6300 (SC1…SC5 windows) with rAF-settling waits, same flags:
   `"verdict":"clean", console 0, page 0, failed 0, overflow_x false @1280+@375`, exit 0.
   End-state eval: `pinSpacer:true`, counters tweened to 6/2/2/2/3 (§3.3/3.4 invariant),
   hero opacity 1 mid-SC5 (reassembled) → 0 after pin release (docked shot took over).
   screenshot.mjs screenshots BEFORE evals, so mid-pinned frames were captured separately
   with the clickable browser: one-and-only-one caption visible per scene stop
   (y1400→cap1, y2600→cap2, y3800→cap3, y5000→cap4, y6350→cap5), board 2/2/2
   state-correct, hub+3 spokes+wires+counter strip, SC5 dock + nav cards, pin release into
   #om/#projekt. PNGs: mid-*.png, fix-*.png.
3. **prefers-reduced-motion** emulated (Playwright reducedMotion:'reduce', 1280px):
   NO `.pin-spacer` (pinned timeline never created), stage = static stack 3044px,
   all 6 captions + all 6 task cards have height>0, hero 671px, 0 pageErrors → content,
   not blank (reduced-motion-1280.png).
4. **JS disabled** (Playwright javaScriptEnabled:false): 2059 text chars, hero img
   laid out (671px), doc 3717px full-page readable (nojs-1280.png). Mechanism: every
   stage rule is `html.js`-scoped inside `@media (prefers-reduced-motion:no-preference)`.

## Readings & deviations (stated, not silent)
- File plan = CONCEPT §6 (authoritative per brief): `js/scenes.js` builders — the parent
  dispatch's shorthand "print.css / scroll-motion.js" is NOT in §6 and was not invented.
  The SCENE COPY keeps `scroll-motion.js` as displayed fake-panel text (§3.1 verbatim).
- RESULT.md placed at `concepts/workflow-explode/RESULT.md` (binding override wins over
  the brief's `.audits/.../T2-RESULT.md` path; a pointer copy is also left there).
- SC5's "fragments tween to center" omitted: SC1–SC4 layers are opacity:0 by then, a
  tween there paints nothing (same end state; noted in scenes.js).
- Hero intro starts at opacity .35 not 0 (literal 0→1 loads the page top blank at scrub 0).
- Hero plane sits at `translateZ(-160px)`: inside the preserve-3d stack siblings sort by
  depth, so a flat scene layer would otherwise be BEHIND the z:140 slices (seen red in
  mid-sc1.png, fixed and re-shot). .chrome/.shot grouped in one .hero wrapper so the URL
  pill cannot drift from the sliced image; z semantics unchanged.

## Commit
`git add concepts/` + `git -c user.name="frontend (10140.3)" ... commit` only;
`git show --stat` touches ONLY `concepts/workflow-explode/**` (10 files). prototypes/,
.audits/, docs/, .tmp/ untouched by git. No `git config`, no `git add -A`, no spawn tools used.
No harness-misfire handback demands encountered this session.

# RESULT: 4259ea6d72aeac7c7c398a8c5eade04191e2acab — workflow-explode mock built per CONCEPT §6, served :8092 200, screenshot passes clean (0 console/0 page errors, no 375 overflow, top+deep), reduced-motion + JS-off readable, committed scoped to concepts/
