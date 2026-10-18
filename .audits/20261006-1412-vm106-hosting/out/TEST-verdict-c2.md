# TEST-c2 — final pre-push acceptance (MC 10088.10)

Subject chain (confirmed via git log this session): 932614c → 8336bd4 → c2d8fe6 (amended FIX-ARCH-01)
→ 882d400 (FIX-ARCH-01b) → 30d0de3 (FIX-ARCH-01c). Judged tree = HEAD read at stamp time. NONE pushed
(`git log origin/main..HEAD` = 6+; origin/main = 00b8dc5). Instruments + raw results: `out/.tmp/t5c2/`
(scripts r1_sweep_v2.js, r2_gallery.js, r6_probe.js, dryrun_mirror_c2.py, img_recheck.js, red-proof in
res_red_*.json; sweeps result_r1v2_{salong,portfolio}.json). Independent re-run; prior scripts read,
not trusted.

Reading used for R1 banned scan: tag/whitespace-normalized (DIN<br>SALONG and span-pair heroes ARE
the string "din salong" to any reader; R4-RECIPE line 147 itself names the br/span variants in-scope).
Hyper-literal raw-substring reading would pass them — rejected as false-green by design.

## R1 FULL-RENDER — FAIL (2 pages, one finding class)
51 pages over :8090: root, salong index + 27 salong themes, portfolio index + 20 prototypes + 1 concept.
All: HTTP 200 ✓, console 0 ✓, pageerror 0 ✓, zero responses ≥400 ✓. All imgs naturalWidth>0 after
scroll + 15s completion polling; `06-cinematiskt` needs the gallery's HORIZONTAL scroll to trigger its
4 lazy imgs — all 4 decode (nw=1536) then, no failed requests (vertical-only trigger = instrument limit,
adjudicated PASS with proof in r1v2 log + probe). Root page: 2 project cards + both thumbs decoded.
**Banned tokens found on exactly 2 pages (exhaustive sweep, see R7): "din salong" rendered in the hero of
`13-91-tal` (`<h1>DIN<br>SALONG</h1>` line 49) and `18-bara-typsnitt` (lines 55–56, spans DIN / SALONG,
sr-only already "Jane Cooper").** = P1-1 below.
Owner-approved persona, reported separately (per brief, NOT findings): portfolio "Alexander Lektove ·
Karlskrona" served on all 20 portfolio prototype pages (+ portfolio concept/index carry the persona too);
karlskrona is on the task token list but is the owner-ratified persona here. A `gmail` hit on 15-klistermarken
is a scanner artifact of CSS class `.bigmail` (real link alexander@sibbamala.com); zero `gmail.com` in any
tracked file (grep exit 123/no matches).

## R2 c1-P1 REGRESSION — PASS
`00-poc-live-site` live: `window.JANE_COOPER_GALLERY_IMAGES` is a real Array, len 4; 6 gallery cards;
4/4 gallery imgs decoded (nw=1536); console 0, pageerr 0 (r2_out.txt). c1's space-in-identifier P1 is dead.

## R3 HOSTING SURFACE — PASS
- hosting.yaml parses with strict `json.load`; keys _comment/name/type/root/title/description/tags/mirror.
- Reconciler's own bar: `validate-hosting.py /home/claudecode/Hemsidor` → 7× [PASS] (hosting.yaml-present,
  is-web-app, parses, name, type, root, static-entrypoint), `VERDICT: PASS`, **VALIDATE_EXIT=0** (pasted
  in-session above in r3 console capture).
- Fresh mirror dry-simulation (dryrun_mirror_c2.py, resolve-only, over `git archive HEAD` tree copy):
  served=317, dropped=40. (a) `projects/salong/prototypes/01-mork-guld/index.html` SERVED ✓;
  (b) nested `…/_assets/vendor/gsap.min.js` SERVED ✓; (c) .md/tools/docs/_site/.audits/.git/PORT/hosting.yaml
  served = NONE ✓; root doc ✓, favicon.ico ✓, thumbs=48 ✓, nothing outside projects/|thumbs/|favicon|index ✓
  (dryrun_c2.txt).

## R4 COMMIT-SCOPE — PASS
932614c = exactly the 2 gallery js files. 8336bd4 = exactly 52: root index.html, hosting.yaml, favicon.ico,
48 thumbs, tools/build-index.py. c2d8fe6 (44db35b amended) = exactly ARCHITECTURE.md + the 6 lab CSS files;
`git show -U0 … | grep -c '^-[^-]'` = **0 for all six** (pure additions). 882d400/30d0de3 = docs-only.

## R5 DOCS-TRUTH — PASS
- grep 'real photos|real portrait|Empty placeholder' → **0 hits**.
- §8.1: measured `wc -l` over tracked salong text files >400 = exactly the 9 listed, every cited line count
  matches reality (456/414/470/713/680/510/453/447/418). Header reasons present in all 9; spot-read all 6 new
  FIX-ARCH-01 lines + 3 pre-ruled — each file-specific (consumer counts, WCAG annotations, two-file-split
  halves, sjökort geometry), none generic. "52-file 251–399 band" measured = 52 ✓. Portfolio disclosure
  ("not all 20 carry the header line") is honest, matches tree.
- §10 (rewritten pre-amend text, re-read as briefed): "COMMITTED, AWAITING PUSH" is TRUE (6 unpushed,
  origin/main=00b8dc5); keys/titles/description match hosting.yaml byte-content; description PI-free;
  include/exclude description matches yaml; 7-PASS validator claim reproduced by me. §2 root-surface rows
  (01b/01c): root index.html tracked ✓, `git ls-files thumbs/` = 48 ✓, favicon linked from root index +
  served ✓, hosting.yaml row ✓, `--root` mode exists (tools/build-index.py:19 usage) ✓, "public mirror root
  vs :8090 _site landing" distinction true ✓.

## R6 375px / reduce / JS-off — PASS
01-mork-guld, 07-retrofilm, 13-91-tal, 26-lab-demo-low: scrollWidth=375 on all (≤375). reduce: innerText
2717/3272/2072/1561 chars (>300), console 0, pageerr 0. JS-off: headline words in innerText on all four
("Jane"+"Cooper", "Jane Cooper", "DIN"/"SALONG" — visible, wrong content = P1-1, "Jane Cooper" split spans).

## R7 NEGATIVE ATTACKS (self-designed) — PASS, zero real findings
Walked the fresh 317-file served list against the exclude classes myself: 0 violations. Resolved EVERY
href/src in every served HTML and every url() in every served CSS against the served set: 4 static hits,
all adjudicated false (3× `url(%23n)` = inside `data:`-URI SVG; 1× `assets/salong.jpg` inside escaped
`&lt;img&gt;` display code in the portfolio concept — never fetched, :8090 404 confirms it's inert). Zero
absolute-`/` refs (would escape /webdesign/), zero ../ escapes above served root, zero refs into excluded
files, zero directory links lacking a served index. srcset: used nowhere in the served set → cachebust
"all" can't break any. mirror.py confirms CSS url() is deliberately NOT rewritten → raw url() refs must
resolve as-is; they do. Favicon: referenced, in served set, no ≥400 anywhere on any page.

## R8 RED-PROOF — PASS (instrument demonstrably fails)
Served `01-mork-guld` copy under scratch (:8097): pristine run → `banned:[] RED=0` GREEN;
planted `<title>Anny Morin —…` → `banned:["anny","morin"]`, `PLANTED-RED-CHECK: RED as required`.
Both outputs in t5c2 (res_red_green.json / res_red_planted.json + console above).

## Findings (ranked)
- **P1-1 — retired brand "DIN SALONG" rendered on 2 served pages** (13-91-tal/index.html:49 h1 `DIN<br>SALONG`;
  18-bara-typsnitt/index.html:55–56 hero spans DIN/SALONG — visible pixels under reduce too). Violates binding
  R4.2 + this run's acceptance token set; R2 RECIPE explicitly listed both themes' split heroes in scope
  ("…18,25 + 09/13 br-splits") and R4's mechanics row claims the pair conversion yet silently missed 13 and 18.
  Every prior substring-only sweep (c1's and my v1) missed the class — markup-split token. Fix: 13 → `JANE<br>COOPER`;
  18 → DIN→JANE, SALONG→COOPER in the two data-scramble spans (sr-only already correct); one line each, plus RECIPE rows.
- **P3-1 (process)** — banned-token gates in this run must use the tag/whitespace-normalized scan (r1_sweep_v2.js
  proves the method); a raw-substring gate is a false-green for split markup. Recommend adopting for the post-push
  acceptance phase.
- **P4-1** tools/build-index.py = 281 lines (>250 soft). Single concern, documented; not blocking.
- Owner-decision rows (recorded, NOT re-litigated, NOT blockers): portfolio persona Alexander Lektove · Karlskrona
  (20 pages, owner-approved); R3.1 history-accept (real photos remain in bryn1/Webdesign history); R3.2
  sibbamala.com/anny/ left live on purpose; @jane.cooper / +46 70 123 45 67 / jane.cooper@example.com /
  Drottninggatan 2 Malmö = invented demo data, unverified-as-unowned, disclosed.
- File hygiene: all files the chain touched ≤400 or reasoned (9/9 §8.1 verified); dead_code.py 0 findings
  (3 tools declared live, each with §2 reason row).

## Disposition
FAIL. Everything the hosting surface does (R2–R7) is green — but R1 acceptance is not met: two served pages
still render the retired placeholder brand, which is precisely what the pre-push gate exists to catch. Route
P1-1 (2 lines + RECIPE rows) back through the producer; re-run R1-v2 (normalized scan) on the fix; then this
gate can pass. Post-push acceptance duty (live /webdesign/, .md 404, hosted-index row) remains the run's last
phase, unchanged.

# JUDGED: 7fa9081597ce467fc7c64e5dcd9cd003943ce2e5cc8329edd9c8296e33835fb2
# VERDICT: FAIL
