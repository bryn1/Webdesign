# TEST-verdict-c2 — independent re-verification, 20-theme prototype library

Cycle 2, fresh test child (MC 10088). Target `prototypes/` (20 themes + gallery index + `_assets/`),
suite `out/test_prototypes.py` (654fec2-relaxed), live server `http://192.168.5.231:8090/`.
Nothing trusted from cycle 1; all probes re-executed this session. READ-ONLY held: only
`out/.tmp/` scratch + two `99-testprobe-*` dirs created and deleted.

## Probe table

| # | claim | method | result |
|---|---|---|---|
| 1 | Suite passes as-is | `cd out && python3 -m pytest -q` | `5 passed in 0.07s` (green, reproduced) |
| 2a | Suite catches a theme with NO gallery evidence at all | planted `99-testprobe-392529` (copy of 01, all `gal-0` occurrences incl. a comment mention removed, all "bild kommer" removed) | **RED** — `test_each_prototype_structure` fails at line 48: `99-testprobe-392529: no gallery evidence` (plus expected index-listing failure). Probe deleted, suite re-green. |
| 2b | The assertion needs actual photos | observed while building 2a: one surviving HTML **comment** `<!-- … gal-01…gal-04 … -->` satisfied the assertion with every `<img>` asset ref already removed | **GREEN with zero images** — substring check, comment counts → false-green vector (folded into P1) |
| 2c | Relaxed branch is a narrow 15/18 exception | planted `99-testprobe-c62323` (copy of 03, all 4 gallery `<img>` tags + asset paths stripped; everything else untouched — incl. the BRIEF-mandated "Porträtt — bild kommer" portrait copy present in **all** 20 themes) | **GREEN in `test_each_prototype_structure`** — suite FAILS TO CATCH a photo-lost theme. The `"bild kommer"` OR-branch is trivially true for any spec-compliant page → photo branch dead. Probe deleted, suite re-green. |
| 2d | 15/18 pass via honest gallery copy | section extraction: galleri `#galleri` inner content of 15/18 | **Contradicted**: 15/18 galleries contain NO "bild kommer" — they are honestly framed photo-free themes ("helt utan foto — allt du ser är illustrationer" / "gallriet visas som typspecimen i stället för foto"). They pass the OR-branch via the **portrait placeholder** in Om, like every other theme. Product honest; edit's stated rationale wrong. |
| 3 | Photo matrix: relaxation matches reality | per-theme grep `gal-0` mentions / real `<img …_assets/gal>` tags / "bild kommer" count | 18/20 themes have ≥4 real gallery `<img>`; only 15/18 have 0 — exception scope correct even though mechanism differs (see 2d) |
| 4 | Themes 03-varmt-papper, 08-organiskt-hantverk, 13-91-tal, 17-mork-akademien (my picks): every local href/src 200; six ids; tel:+46721554860; mailto:; instagram.com/mullers.anny; demo label; lang="sv"; no 404 assets | HTMLParser href/src + `url()` sweep of theme CSS, `curl -w %{http_code}` loop via `urljoin` | **ALL-200 + all static checks pass** (e.g. 03: 10 refs → 10×200 incl. 4× `/_assets/gal-0N.jpeg`; CSS 200s). One apparent 404 (`%23n` in 08 layout.css) traced to a percent-encoded `url(#n)` INSIDE a `data:`-URI SVG — false positive, no broken asset. |
| 5 | Full page readable without JS | headless chromium (playwright 1.60), themes 02-mork-neon + 16-gradientljus, `java_script_enabled=False` | **PASS** — all six sections rendered, `offsetHeight` 499–1235 px, opacity 1, none hidden; body innerText 2269 / 2573 chars. Screenshots `out/.tmp/shots/*-nojs.png`. |
| 6 | No horizontal overflow at 375 px | headless chromium viewport 375×812, themes 09-schweizertag + 20-mynta | **PASS** — `documentElement.scrollWidth == clientWidth == 375` both. 09's marquee-track extends past viewport but inside `overflow:hidden` container — no page overflow. Screenshots `out/.tmp/shots/*-375.png`. |
| 7 | File hygiene | `wc -l */index.html */css/*.css */js/*.js` (all 20 themes) | **One finding**: `08-organiskt-hantverk/index.html` = 451 lines (>400), no header comment giving a reason. All other files ≤394 lines. |
| 8 | No TODO/FIXME in prototypes/ | `grep -rn 'TODO\|FIXME' prototypes/` | **Empty** (exit 1) ✓ |
| 9 | Gallery index integrity | parse served `"/"`, curl-loop every card href, cross-check disk dirs | **PASS** — 20 cards, 20 theme dirs on disk, every href → 200, card-targets↔dirs exact bijection (no link to non-existent dir, no dir unlinked). |
| 10 | Post-probe tree state | `ls prototypes/` after probe deletions | exactly 20 theme dirs + `_assets` + `index.html`; no 99-testprobe residue; suite green 5/5. |

## Findings

**P1 — the relaxed gallery assertion cannot fail for the regression it exists to police**
(`out/test_prototypes.py:48`, edit 654fec2). Evidence: probe 2c — a theme copy with ALL FOUR
gallery photos removed passes `test_each_prototype_structure`, because the BRIEF-mandated
"Porträtt — bild kommer" portrait placeholder (present in all 20 themes, Om section) satisfies
the `or "bild kommer" in low` branch. The photo-evidence branch is therefore dead for every
spec-compliant page: the gate is green under the exact mutation it was written to catch.
Compounding: (a) the branch accepts ANY substring occurrence — comment-only `gal-0` mentions
pass with zero images (probe 2b, predating 654fec2 but never tightened); (b) the stated
rationale ("accept 'bild kommer' for themes 15/18") is contradicted — 15/18's galleri sections
contain no "bild kommer"; their real framing ("helt utan foto", "typspecimen") is honest and
better than the assumed placeholder. A gate that cannot go red is not a gate (CYCLES.md
records a leaf previously gaming this very suite with placeholder dirs — this is the class of
bug the gate is for). **Fix (surgical, test-only):** replace line 48 with a per-theme rule —
for themes outside {15,18}: ≥4 `<img>` tags whose src matches `../_assets/gal-0[1-4]\.jpeg`
(counted from parsed HTML, not substring); for 15/18: the `#galleri` section itself must carry
an explicit photo-free statement (e.g. "bild kommer"/"utan foto"/"specimen" inside the
section, section-scoped not page-scoped). Re-run both planted probes as red-proof.
Note: the PRODUCT is clean — every independent check (rows 3–9) passes; the defect is in the
verifier, and the themes themselves could regress silently behind it.

**P2 — suite scope stale at 20 themes.** `test_ten_prototypes_exist` still asserts `>= 10`
after the owner's "10 more designs" extension (CYCLES.md cycle 2). Removing ten whole themes
keeps the suite green. Should assert exactly the 20 committed theme dirs (or ≥20).

**P3 — hygiene:** `prototypes/08-organiskt-hantverk/index.html` is 451 lines, >400 without a
header comment stating the reason (fleet hygiene gate 250/400/600). Splits naturally at the
inline SVG defs (`<symbol>` block feeds the hand-drawn icons).

**P4 — none.** (Portrait placeholder copy present ≥1× in all 20 themes as BRIEF requires;
demo labels, reduced-motion and contact data spot-checked across the sampled set.)

## Re-verification after suite fix (same child, same cycle)

The first pass of this card ended `# VERDICT: FAIL` (hash b0f3b490…) against the
pre-fix suite. The deliverable-state hash then moved to 1d1cc114… — diffing the saved
manifests showed `test_prototypes.py` was the only changed path: commit `f5b2de9`
("gate: gallery check parses img tags; >=20 dirs; 08 header reason") landed the exact
P1/P2 fixes. Re-verified the NEW gate with the same red-proof discipline; probes
`99-testprobe-075600` created and deleted, tree clean, suite green after.

| # | claim (new gate) | method | result |
|---|---|---|---|
| R1 | New suite green on real tree | `pytest -q` | `5 passed` |
| R2 | Photo-loss regression (the false-green that was P1) now caught | replanted: copy of 03, all 4 gallery `<img>` removed | **RED** — `99-testprobe-075600: gallery photos missing — found none; BRIEF.md requires gal-01..04` |
| R3 | Comment substring can no longer satisfy | probe re-edited: all 4 filenames restored INSIDE an HTML comment, no `<img>`s | **RED** — parsed-img matching only; comment vector dead |
| R4 | Photo-free themes' honesty statement enforced in-section | in-process monkeypatch of `PHOTO_FREE`, theme-15 copy with `utan foto`/`typspecimen`/`illustration` silenced in the `#galleri` slice | **RED** — `photo-free theme must say so inside #galleri` |
| R5 | Real 15 passes the photo-free branch unmodified | in-process call on unmodified theme 15 copy | GREEN (no false-red) |
| R6 | Photo-free theme carrying real photos (with statement kept) | in-process: theme-03 markup + smuggled honest line | **GREEN — finding NEW-P2** (below) |

## Post-fix findings

**NEW-P2 — dead assert in the photo-free branch** (`test_prototypes.py`,
`assert_gallery_evidence`): `assert "gal-0" not in img_srcs(html)` tests exact
membership of the string `"gal-0"` in a list of full srcs (`../_assets/gal-01.jpeg`) —
it can never fire. A theme in `PHOTO_FREE` that later gains the real photos while
keeping "helt utan foto" copy passes the gate with a now-dishonest page. Likelihood
low, blast radius narrow (15/18 currently photo-free; R6 reproduces). One-line fix:
`assert not any(PHOTO_RE.search(s) for s in img_srcs(html))`.

**Resolved by f5b2de9 (VERIFIED this pass):** P1 (photo-loss red-proven R2, comment
vector dead R3, honesty statement enforced R4), P2 (`N_PROTOS = 20`), P3 (header
reason comment now at head of `08-organiskt-hantverk/index.html`, lines 2–4 —
file 454 lines with stated reason, satisfies the hygiene rule).

## Verdict

First-pass P1 fixed and red-proven by replant; product content independently sound
(rows 3–9 and R1–R5, all VERIFIED this session, tree unchanged since). No P0/P1
remains; open items are one narrow gate assertion (NEW-P2) and nothing product-side.
Open orchestrator-side items this leaf cannot satisfy (never spawns): fresh DA gate
and arch verdict over the final tree, DONE.md rows, commit of this verdict file.

# JUDGED: 1d1cc11450ace54ca18a5478f2a7d379df21ce342eb60f2c5af75ba321a64de7
# VERDICT: PASS
