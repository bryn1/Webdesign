# TEST-c4 — BROWSE-V2 narrow gate @ dd328b8 (MC 10088.12t)

Subject: commit `dd328b8` (parent 061975e = pushed/live). Public browse v2: committed root
index.html = project cards only, new committed salong/index.html + portfolio/index.html,
build-index root mode extended, hosting mirror +2 include + doc rows.
Owner ruling (verbatim in task): "I want the layout of the local website… Webdesign/<project>,
not everything on one page". All instruments freshly re-derived this session under
`out/.tmp/t5c4/`; prior-run scripts were RE-READ for logic only (r1_sweep_v2.js banned set,
t8/dryrun_mirror.py mirror logic). Nothing in this gate trusts a prior child's scratch.
HEAD confirmed `dd328b823935d3d8faa7d20d792e7b207aa420d4`; parent `061975e` (git log).

## B1 — owner-ask scenario, end-to-end on a READ-ONLY committed-tree copy — PASS
`git archive dd328b8` → `.tmp/t5c4/b1_tree`, `chmod -R a-w`, served `python3 -m http.server 8241
--bind 127.0.0.1 --directory b1_tree` (killed after; port verified closed). Instrument:
`b1_scenario.js` (playwright-core, fresh). Evidence `b1_result.json`:
- root: `projectCards=2, gridCards=0 (0 prototype cards on root)`, 2/2 thumbs naturalWidth>0,
  h1 "Webdesign — prototyper & koncept".
- CLICK root card → `/salong/`: url=/salong/, 27 theme cards, 27/27 thumbs decode;
  nav-back click → url=/ with root h1 — journey is the owner's ask, not a direct goto.
- `/portfolio/`: 2 grids `[20, 1]` cards, h2 "Prototyper (20)" + "Koncept (1)", 21/21 thumbs decode.
- theme links from both project pages: 48/48 resolve 200 (`failed: []`).
- console errors 0, pageerrors 0, requestfailed 0 across all three contexts (JS-on 1280, 375px, JS-off).
- 375px: scrollWidth 375/375/375 on `/`, `/salong/`, `/portfolio/` (≤375 all).
- JS-off (javaScriptEnabled:false): card names read from DISK files (2/27/21) all present in
  innerText, `missing: []` on all three pages.
- B1-GATE: GREEN (exit 0).

## B2 — LOCAL UNTOUCHED — PASS (with one environment note)
- Snapshot `cp -a _site → site_before`; ran `python3 tools/build-index.py` in the repo (writes
  only the gitignored `_site`; the c2-common line "re-run … it is deterministic" is the reading
  used). Symlink-safe md5+target compare (`b2_cmp.py`, because `diff -r` dereferences the
  symlink farm — false "No such file" errors): **54/54 paths byte-identical, 0 diffs**.
- Root mode in an ISOLATED worktree copy (`rootmode/`, no .git): `build-index.py --root`
  regenerated repo-root `index.html`, `salong/`, `portfolio/` **byte-identical to the committed
  bytes**; 47/48 thumbs byte-identical; `_site` in the copy 54/54 identical.
  The 1 thumb diff (`concepts-workflow-explode.png`) traces to CONCURRENT in-flight edits of
  workflow-explode by the MC 10140 session (tracked files dirty with mtime 05:48/05:56, semantic
  design diffs: fonts/rackrails/copy — my tools never write into projects/); the copy's fresh
  index.html mtime made the generator legitimately remake that thumb. Not a dd328b8 defect.
- `git status`: no tracked change from this session outside that parallel session's
  workflow-explode paths.
- Live LAN still renders (reads `_site`): :8090/ 200 title "Webdesign — prototypes" 2 cards;
  :8090/salong/ 200 27 cards; :8090/portfolio/ 200 21 cards (the generated `_site` variants —
  English nav per design, distinct from the committed public pages; correct by design, §2 rows say so).

## B3 — MIRROR + QUARANTINE (fresh run) — PASS
`b3_mirror.py` (logic re-read from `out/.tmp/t8/dryrun_mirror.py`), tree = `git archive dd328b8`
+ real `_site` copy + planted markers (`.audits/.tmp/.dsh/.impeccable/.pytest_cache` files,
`README_extra.md`) so the drop-classes are real candidates; mirror block parsed from the CURRENT
hosting.yaml via mirror.py `resolve_spec`/`resolve_subset` (spec source: repo hosting.yaml):
- **served=319** (dropped 96, source 0); diff vs t8's 317-path baseline = **exactly**
  `+portfolio/index.html +salong/index.html` (delta +2, live 317).
- salong/index.html SERVED PASS; portfolio/index.html SERVED PASS; root index.html PASS;
  theme html PASS; nested vendor gsap.min.js PASS.
- quarantine (.md/tools/docs/_site/.audits/.git/PORT/hosting.yaml incl. my markers): **NONE served**.
- UNINTENDED (outside index/salong/portfolio/pages/projects//thumbs//favicon): **NONE**.
- /salong/** and /portfolio/** walk: `git ls-files` shows exactly `salong/index.html` +
  `portfolio/index.html` — the only paths those includes CAN pull in; served-but-not-tracked NONE.
  thumbs 48, favicon.ico served. B3-GATE GREEN (exit 0).

## B4 — PI SWEEP over all 319 served paths' disk content — PASS (2 adjudications)
`b4_scan.py`: RAW (latin-1 lower) + tag/whitespace-NORMALIZED scan, banned set per c2
(r1_sweep_v2.js: anny, mullers, morin, 072-155, 07x, landbrogatan, karlskrona, tross, dinsalong,
"din salong", "din stad" + word-boundary gmail). STRONGER than the c2 browser instrument: also
scans script/style contents and binary blobs.
- Owner-approved portfolio persona "Alexander Lektove · Karlskrona": bare `karlskrona` on the 20
  `projects/portfolio/**` pages = PERSONA_APPROVED, reported separately, NOT hits (owner ruling
  recorded in DONE.md/BRIEF; c2/c3 parity).
- Full-scan found 4 RAW (`07x`) + 2 NORMALIZED hits — **all inside binary payloads** (2 JPEGs,
  2 PNGs; valid ffd8ff/89504e47 magic, hit surrounded by high-entropy bytes — offsets 91k–292k).
  Adjudicated FALSE-POSITIVE: 3-byte ASCII coincidence in image data, not copy (see `b6i` proof
  below that the same instrument catches planted TEXT). Text-gate re-run (binary exclusion rule
  declared upfront: .png/.jpeg/.jpg/.gif/.webp/.ico/.woff2): **220/220 text files, RAW 0,
  NORMALIZED 0 — B4-GATE GREEN**. Full outputs kept: `b4_full_raw.txt`.

## B5 — DOCS TRUTH vs tree — PASS (1 finding, 1 stale row)
docs/ARCHITECTURE.md 259 lines (<300). Every claim checked against the tree, not prose:
- §2 `salong/index.html` row: 27 cards + nav `../` + `../projects/salong/…` links + /salong/**
  mirror-served — TRUE (measured B1/B3). §2 `portfolio/index.html` row: 20 + 1 concept
  (`workflow-explode`) — TRUE. Root row: "project cards ONLY … BROWSE-V2" — TRUE (root 2 project
  cards, 0 grid cards). thumbs row: 48 — TRUE (`git ls-files thumbs | wc -l` = 48).
- Entrypoints sentence: root = mirror root project-cards-only, salong/portfolio its pages,
  :8090 landing = generated `_site/index.html` — TRUE (matches both served surfaces).
- §10: include sentence matches hosting.yaml exactly; root "project cards only" + owner quote
  "Webdesign/`<project>`, not everything on one page" matches the ruling verbatim — TRUE.
- build-index row: mentions `--root` mode, shared per-project page writer, tracked public surface
  + thumbs — TRUE (code: `project_page()`/`root_card()` shared by `build()` and `build_root()`).
- dead_code.py over tools/: 0 findings. New files 70/67 lines — hygiene OK.

## B6 — RED-PROOF (both mandatory, same instruments) — PROVEN
(i) planted PI → B4 RED. `cp -a b1_tree b1_tree_red`, planted `<p>Anny Morin — Frisör i Karlskrona,
072-155</p>` into salong/index.html; same instrument:
```
RAWHIT salong/index.html ['072-155', 'anny', 'karlskrona', 'morin']
NORMHIT salong/index.html ['072-155', 'anny', 'karlskrona', 'morin']
B4-GATE: RED        (EXIT=1; full output b6i_red_output.txt — proves the binary-FP adjudication
                     stands: TEXT PI is caught RAW *and* NORMALIZED)
```
(ii) include removed → B3 RED. `/portfolio/**` deleted from a COPY (hosting_no_portfolio.yaml):
```
served=318 source=0 dropped=97
portfolio/index.html SERVED: FAIL
B3-GATE: RED        (EXIT=1; full output b6ii_red_output.txt — the include actually gates the page)
```

## Findings (ranked)
- **P3-1 (hygiene/process)** `tools/build-index.py` 317 lines — over the 250 soft ceiling and 36
  lines larger than the DONE.md carry-forward flagged (281); no header `reason:` line (only >400
  requires one, so a finding not a FAIL). Cheap fix next touch: reason line or split the CSS/page
  template constant out.
- **P4-1 (docs stale)** §8 exception 6 claims repo-root `out/` RESOLVED/absent ("Verified absent")
  — it exists AGAIN: `out/.tmp/` 29M scratch created 2026-10-07 05:42 (after dd328b8, by a
  later run of this chain writing relative `out/…` from repo root). Gitignored; mirror-safe (no
  include matches it) — but the doc row is CONTRADICTED by the tree; re-stale it or remove the
  stray in the next hygiene pass.
- **P4-2 (instrument note, carry-forward like c2's P3-1)** the disk-content banned scan must carry
  the binary-payload exclusion rule (declared here, applied above): scanning token sets over image
  byte-streams yields coincidental hits (observed: `07x` in 2 JPEGs + 2 PNGs). Text-gate +
  adjudicated-binary is the shape that scales; RECIPE should record it.
- Environment (NOT a finding against dd328b8): the MC 10140 workflow-explode session edited tracked
  files live during this gate (dirty tree, semantic diffs, mtimes during my run). This verdict
  judges only the COMMITTED dd328b8 bytes (git archive); local `_site`/root-mode byte-comparisons
  account for it (§B2). Parent should expect a second commit landing for workflow-explode.

## Verdict basis
B1–B6 all green on independent instruments; the two red-proofs show the gate can fail; docs true
against the tree; nothing P0/P1/P2 open. The owner's two-level ask is proven end-to-end on the
committed public surface, both at :8241 (mirror-shape copy) and live :8090.

# JUDGED: ce4ccbe7b5c1b35938a287f9d2aaba158bad8f654757bf39ae392a1426133d80
# VERDICT: PASS
