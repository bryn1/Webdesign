# TEST-verdict-c3 — narrow re-verify of the DoD gate fix (f5b2de9)

Cycle-3, MC 10088. Scope per brief: gate only, no theme re-sweep (cycle-2 cleared the product).
Base under test: HEAD `f5b2de9` ("gate: gallery check parses img tags; >=20 dirs; 08 header reason"),
server live on port 8090 (PORT file), tree = /home/claudecode/Hemsidor.
All claims below VERIFIED by my own runs this session; producer red-proof claims were NOT trusted.

## Probe 1 — suite green on the real tree
`cd .audits/202610041341-f6053f16/out && python3 -m pytest -q`
→ `5 passed in 0.15s` (re-run verbose: all 5 named PASSED, none skipped; re-run once more after
tree settled: `5 passed in 0.17s`). Includes the two live-HTTP tests against the real server.

## Probe 2 — RED PROOF A (the cycle-2 P1): photo-stripped theme must go RED
Copied `prototypes/03-varmt-papper` → `/tmp/99-c3probe-A`; removed all four `<img …>` elements via
`re.sub(r"<img\b[^>]*>", …)`; **all copy preserved** — visible text after tag-strip byte-identical to
the real theme 03 (`copy identical: True`), and the BRIEF-mandated `"bild kommer"` placeholder
survives (count 1), zero `gal-0` left in the file.
`test_prototypes.assert_gallery_evidence(Path("/tmp/99-c3probe-A"), html)` →
**AssertionError** — `99-c3probe-A: gallery photos missing — found none; BRIEF.md requires gal-01..04`.
False-green control for the old bug: the cycle-2 condition `'gal-01.jpeg' in html or 'bild kommer' in html`
evaluates **True** on this same stripped file — confirming the P1 was real and that the parser-based
replacement (commit's HTMLParser collecting `<img>` srcs only) is what makes A go RED. **P1 FIXED.**

## Probe 3 — RED PROOF B (comment trick): parser-only evidence
Same base file, each `<img …>` replaced by `<!-- gallery photo gal-0N.jpeg -->` (all four
filenames present as text, 0 img tags).
`assert_gallery_evidence` → **AssertionError** — `99-c3probe-B: gallery photos missing — found none`.
Copy inside comments no longer satisfies the gate. **P1 fix holds against the comment trick.**

## Probe 4 — RED PROOF C (liar photo-free theme): declaration must be inside #galleri
Copy of theme 15 placed at `/tmp/99-c3probe-C/15-sagan-om-klippet` (directory name MUST keep the
real theme name — `assert_gallery_evidence` branches on `d.name in PHOTO_FREE`; a renamed probe
hits the photo branch and proves nothing, my first attempt did exactly that and was rebuilt).
First confirmed the pristine copy PASSES the photo-free branch (isolates the neuter as the only
variable). The task said to replace 'illustration'-family words with 'xxx' in the #galleri slice;
the slice also carries "utan foto" (2 of the 6 statement-regex matches), so I neutered **all six**
matches inside the slice only — replacing only 'illustration' would leave an honest statement that
the gate would (correctly) still pass. Result:
→ **AssertionError** — `15-sagan-om-klippet: photo-free theme must say so inside #galleri
(illustrationer/typspecimen/utan foto)` — the correct branch's assertion fires. **Photo-free
exception cannot be abused by a photoless liar.**

## Probe 5 — GREEN CONTROL: gate not over-strict
Loop `assert_gallery_evidence` over all real dirs (`tp.proto_dirs()`): **GREEN CONTROL: 20/20 pass**,
no exceptions — including both PHOTO_FREE themes and all 18 photo themes. Exactly 20 dirs; threshold
`N_PROTOS = 20` matches.

## Probe 6 — f5b2de9 hygiene
- `wc -l test_prototypes.py` = **139** ≤ 600 ✓
- `prototypes/08-organiskt-hantverk/index.html` starts with the >400-line reason comment (single-page
  template kept whole; SVG-with-copy rationale, cites coding-discipline header rule) ✓
- `git show f5b2de9 --name-only` = exactly the two expected files ✓
- `grep -n "TODO\|FIXME"` on both changed files → no output, exit 1 ✓

## Findings
- **P1 (cycle-2) FIXED and independently red-proved** (probes 2–3; plus false-green control on the old condition).
- **P2 (threshold) FIXED**: N_PROTOS=20, `>=` assert, 20 real dirs pass (probe 5).
- **P3 (theme-08 header) FIXED** (probe 6).
- **P4** Header says "451 lines"; `wc -l` now 454 — the reason comment itself adds its 3 lines. Accurate, harmless.
- **P4** Foreign leftovers not mine to touch: `/tmp/99-testprobeA` (cycle-2 scratch) still present; and a
  `prototypes/99-testprobe-075600` entry was visible at session start and vanished mid-run (parallel cleanup).
  Final tree verified clean (`ls | grep -c "99-"` = 0) and the suite was re-run green after it settled. Producer
  should sweep /tmp/99-testprobeA in the close-out pass.
- My probes `/tmp/99-c3probe-A|B|C` all removed (`ls -d /tmp/99-c3probe-*` → no matches). Scratch confined to `out/.tmp/`.

## Verdict conditions
Suite green on real tree ✓ · A RED ✓ · B RED ✓ · C RED ✓ · green control 20/20 ✓ · hygiene clean ✓ → PASS
# JUDGED: 1a4f774e79ce4065af14092114d93936b5d80925c92e94c8f54f31c038bbcae7
# VERDICT: PASS
