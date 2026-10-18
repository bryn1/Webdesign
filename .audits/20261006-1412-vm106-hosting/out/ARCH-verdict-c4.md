# ARCH-verdict-c4 — MC 10088 [type:design] supersedence note: c3's sole gap closed at 30d0de3

Pure supersedence pass, orchestrator-instructed micro-step: only the c3 named gap re-checked;
nothing else re-derived — **c2 and c3 verdicts stand in full by reference**. Read-only; scratch
under `.tmp/t6c2/`; c1/c2/c3 files untouched.

## Chain (re-read this pass)

`git log`: `30d0de3` (FIX-ARCH-01c, "§2 root index row: the public mirror root, not the :8090
landing (c3 cmp finding)") → parent `882d400` (`git rev-parse 30d0de3^`) → `c2d8fe6` → `8336bd4`.
`git show --numstat 30d0de3`: ONLY `docs/ARCHITECTURE.md` +3/−2 — doc-only, product untouched.
Working tree clean (disk == 30d0de3).

## The corrected sentence vs :8090 reality

§2 entry-points sentence now reads: "Entry points: repo-root `index.html` (the public mirror root
page once pushed — :8090's landing card page is the generated `_site/index.html`, see the `_site/`
row above), …" — matches the tree: live `curl http://127.0.0.1:8090/` title = "Webdesign —
prototypes" (the 43-line `_site/index.html`, the `build()` page), while the committed root
`index.html` title = "Webdesign — prototyper & koncept" (94 lines, `build_root()`'s page, mirror
root once pushed — hosting.yaml `/index.html` include + validator static-entrypoint, c2-attested).
The false ":8090's landing card page" attribution c3 named is gone; the pointing to the `_site/`
row (which correctly carries what :8090 serves) is true.

## Verdict

c3's sole named gap — **CLOSED**. No new gap found in the touched sentence. All §2 root-surface
rows remain as c3 verified them (30d0de3 touched only these three lines). Per instruction, no
other row re-derived: c2's B1/B2/B4/B5 PASS rows and B3's closed gap stand; the run's
ARCH-architecture-vs-reality check is satisfied at HEAD 30d0de3. File hygiene of the doc:
unchanged band (`wc -l` 253 lines, one subject, under the 300 doc rule).

# JUDGED: 5cabf9e464a69e1bc5e478da8eb4239f39dc61c17738c7f3628c41f7c26b47c5
# VERDICT: PASS
