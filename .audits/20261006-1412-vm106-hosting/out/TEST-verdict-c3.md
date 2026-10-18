# TEST-c3 — NARROW re-verify of FIX-T5C2-P1 (MC 10088.10, cycle 3)

Subject: commit 061975e (parent 30d0de3) — `git show --name-only` = exactly
`13-91-tal/index.html` + `18-bara-typsnitt/index.html`; diff = 3 hunk pairs only,
`DIN→JANE` / `SALONG→COOPER`, markup + data-scramble/sr-only structure preserved; working tree
clean at check. This verdict closes c2's P1-1 (`.audits/20261006-1412-vm106-hosting/out/TEST-verdict-c2.md`).
Scope = the locked NARROW re-run; instruments hot from c2 (`out/.tmp/t5c2/`, r1_sweep_v2.js unchanged).

## 1. Full served-set normalized sweep (r1_sweep_v2, :8090 over the live tree) — PASS
51 URLs (root + salong index + 27 salong themes; portfolio index + 20 prototypes + 1 concept):
`TOTAL=29 RED=1` (salong set) + `TOTAL=22 RED=0` (portfolio set). All 51: HTTP 200, console 0,
pageerr 0, zero responses ≥400. Fixed themes clean at runtime: `13-91-tal` and `18-bara-typsnitt`
rows now `banned:[] broken:[]` (c2 had `banned:["din salong"]` on both). Root page 200, cards +
thumbs decoded.
The one RED row is `06-cinematiskt` — the c2-adjudicated instrument limitation, re-proven live THIS
cycle (c3_06_proof.txt): its 4 lazy gallery imgs are in a HORIZONTAL scroller; after scrolling it
through, all 4 decode (nw=1536), zero failed requests. Vertical-scroll-only triggers cannot see
them — by lazy-loading design, not a defect. Portfolio persona (Alexander Lektove · Karlskrona,
20 pages) stays owner-approved, reported separately per brief.

## 2. Static normalized sweep on the fresh `git archive 061975e` tree — PASS
Tag/whitespace/entity-normalized regex `din(…tags/ws…){0,8}(salong|stad)` over every html/css/js/json
of the archive: **NONE** (c2: 2 files hit). The din-family is extinct in the committed tree.

## 3. Render-proofs on the two fixed themes (c3_render2.txt) — PASS
`13-91-tal`: 375 → scrollWidth 375, hero innerText "JANE COOPER", console/pageerr 0; reduce → 2073
visible chars, hero "JANE COOPER", 0 console; JS-off → h1 "JANECOOPER" in innerText, DIN/SALONG absent.
`18-bara-typsnitt`: 375 → 375, hero "JANE COOPER", 0/0; reduce → 3054 chars, hero "JANE COOPER", 0/0;
JS-off → h1 "Jane Cooper JANE COOPER" (sr-only + spans), DIN/SALONG absent.

## 4. Red-proof re-capture on the SAME v2 instrument (c3 era) — PASS
Pristine `git archive 061975e` copy served on :8097: 13-91-tal run → `banned:[] RED=0` GREEN; planted
`<title>Anny Morin —…` → `banned:["anny","morin"]`, `PLANTED-RED-CHECK: RED as required`. The gate
demonstrably fails on PI insertion, this cycle, on the fixed page.

## 5. RECIPE §C rows (gitignored — judged on disk) — PASS
Line 292 (13-91-tal fix row), 293 (18-bara-typsnitt fix row), 294 (MECHANICS row: raw-substring AND
normalized passes mandated, names the red-tested scan) — all present in
`.audits/20261006-1412-vm106-hosting/out/RECIPE.md`. Copy contract satisfied: no prose beyond the
token swap; row claims match what I independently measured (h1 "JANE COOPER", 0 console).

## 6. Doc/hygiene churn check — PASS
Both fixed files < 400 lines (250 / 306); no §8.1 line-count churn (swap was in-line); no ARCHITECTURE
claim touched by the fix commit (docs not in its name-only list).

## Carry-forwards (from c2, unchanged — non-blocking)
- P3-1 process: normalized banned-scan pass must stay in every future gate (adopted here; RECIPE 294 records it).
- P4-1 tools/build-index.py 281 > 250 soft line.
- Owner-decision rows (recorded, never re-litigated): portfolio persona Karlskrona; R3.1 history-accept;
  R3.2 sibbamala.com/anny/ left live; invented demo data (@jane.cooper, +46 70 123 45 67,
  jane.cooper@example.com, Drottninggatan 2 Malmö) disclosed.
- The run's POST-PUSH acceptance phase (live /webdesign/ 200s, .md/directory-listing NOT served,
  zero PI on public set, hosted-index.json row) remains owed after any push — not this file's scope.

## Disposition
c2's sole P1 is fixed, green at runtime, static, red-proved, and recipe-documented. No P0/P1/P2 open
against 061975e. The pre-push gate for this chain can pass.

# JUDGED: 83afcec8735871037680b3b0a2d1e071406c241a321b438b88cc2a8bdd2cda16
# VERDICT: PASS
