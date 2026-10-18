# ARCH-verdict — MC 10088.6 [type:design] ARCH-vs-REALITY over the reorganized tree @ 7e6c6a0

Read-only pass, re-derived from the tree at HEAD `7e6c6a0` (never from reports). All facts
observed this session; scratch in `.tmp/t6/`. Doc under review: `docs/ARCHITECTURE.md` (190 lines).

## Summary table

| Row | Check | Observed | Verdict |
|---|---|---|---|
| A1 | ARCHITECTURE.md vs tree | 5 named stale/gap rows (below); ports, dirs, renames, `_site` mechanism, hosting.yaml-absence all otherwise true | **FIX** |
| A2 | Mechanism monogamy (one browse generator; placeholders tool) | exactly one committed generator `tools/build-index.py`; `gen-placeholders.py` fully replaces the placeholder-image mechanism (17/17 committed images match its `TARGETS`), self-describing header (purpose + `SEED = 20261006` + size-preserving targets) | PASS |
| A3 | Hygiene of the last three commits' files | 6 lab-demo CSS files >400 lines with **no header reason** (renames touched them, 0 lines changed — pre-existing debt); pre-ruled >400 files all carry reason lines; vendored gsap exempt correctly | **FIX** |
| A4 | Placement + gitignore conformance | run dir layout-v2-clean; no stray sibling from this run; `_site/` `.audits/` `.dsh/` `.impeccable/` `.tmp/` all gitignored per owner ruling; the 3 commits touched only `docs/ projects/ README.md tools/` — zero ignore-pattern violations | PASS |
| A5 | Forward-compat for hosting phase | globs path-rooted still cover the renamed paths; §1 description + §3 dry-run numbers predate R2/R3.3/R4 — 3 items must be re-derived before push | NOTE (below) |

## A1 — ARCHITECTURE-vs-TREE (every gap named with exact section + tree evidence)

PASS items (re-derived this pass): `projects/salong` + `projects/portfolio` present; prototypes =
20 theme dirs renamed per R3.3 (`01-mork-guld`, `21-lab-demo-a` … `26-lab-demo-low`) + `00-poc-live-site`
+ `_assets/` + gallery `index.html` (20↔20 cards in the gallery, hrefs grepped); `PORT`=8090 matches
live `http.server` (pid listening on :8090, serving `_site/` — curl root = generated per-project card
page; `/salong/prototypes/01-mork-guld/` → 200, `/anny/` → 404); keepalives exist
(`~/.dsh/bin/proto-server-keepalive.sh`, `concept-server-keepalive.sh`) and are in crontab
(@reboot + */5); :8092 live (200); `_assets/` contents match §5 file list; vendored GSAP + ScrollTrigger
present; no stale `anny`/`muller` name anywhere in the doc (`git grep` + doc grep: zero hits);
**hosting.yaml is NOT in the tree and the doc does not mention it — correct** (`git ls-files`,
`ls hosting.yaml`, grep all clean); no other hosting-plan claim in the doc.

FIX rows (stale statements in `docs/ARCHITECTURE.md`):

1. **§5 + §3 — "real photos" claim is CONTRADICTED by the tree.** §5: "the owner's 4 real photos
   (only real photos in existence)" and "jane-portrait.jpg real portrait … fetched … from her public
   Instagram post (jane.cooper)"; §3: "18 themes embed the 4 real photos + the portrait". The files
   on disk (`_assets/gal-01..04.jpeg`, `jane-portrait.jpg`, mtime 2026-10-06, committed @ 5849eeb) are
   **generated placeholder art** — the doc's own cited file `jane-portrait.ATTRIBUTION.md` now reads
   "Platshållarkonst genererad 2026-10-06 av tools/gen-placeholders.py … Ingen fotokälla". Dimensions
   preserved (1656×2208, 1536×2048 verified with PIL). §5 provenance paragraph must be rewritten.
2. **§2 table has no `tools/` row and no `_site/` row.** `tools/build-index.py` is named only in the
   v3 header note; `tools/check-links.py` and `tools/gen-placeholders.py` (all three tracked, all
   committed) are named **nowhere** in the doc. Add the rows (README's Layout block already lists them
   — the doc lags its own pointer file).
3. **§1 "Shape in one line" is stale vs the v3 note above it.** It still says the gallery index is
   what is "served … on :8090" and "the DoD gate is a pytest file" — v3 (and the tree: :8090 root =
   generated `_site/` browse site; pytest gate is history) contradict both readings. One-line rewrite.
4. **§2 workflow-explode row**: "Empty placeholder at this writing" — the dir now has a full build
   (`index.html`, `css/`, `js/`, `assets/`, live on :8092). Stale since that run built it.
5. **§8.1 ceiling claim overstates coverage**: "The ~35-file 251–399 hand-authored band carries no
   hard-ceiling breaches. Every >400 file states its reason in the header" — CONTRADICTED by the six
   lab-demo files in A3 (no reason lines). §8.1 must gain those rows (or the owner rules lab builds
   exempt, recorded as a ruling, not silence).

## A2 — MECHANISM-MONOGAMY — PASS

- `git grep -l "thumbs|build-index|_site"` over tracked files hits only `tools/build-index.py` plus
  README/doc prose — **one** browse generator, no duplicated thumbnail/index logic committed.
- `tools/gen-placeholders.py`: header docstring states the mechanism, determinism, and size/format
  preservation; `SEED = 20261006`; `TARGETS` = 17 files. The 5849eeb image set (old `anny` paths) is
  exactly those 17 — the tool fully replaces the placeholder-image mechanism (R2.2 one-replacement-set);
  no other image-generation artifact committed. Doc reference absent → covered by row A1.2's fix.

## A3 — HYGIENE (files touched by 5849eeb + 96dc070 + 7e6c6a0; 347 paths, 344 under projects/)

Counts re-derived with `wc -l`; binary images excluded (generated/data — exempt). Top text offenders:

| Lines | File | Header reason? |
|---|---|---|
| 712 | `projects/salong/prototypes/23-lab-demo-real/css/styles.css` | **no** (>600 too) |
| 679 | `projects/salong/prototypes/22-lab-demo-b/css/styles.css` | **no** (>600 too) |
| 509 | `projects/salong/prototypes/26-lab-demo-low/css/style.css` | **no** |
| 470 | `projects/salong/prototypes/18-bara-typsnitt/js/scroll-motion.js` | yes (line 9, DENSITY-FIX-01) |
| 456 | `projects/salong/prototypes/08-organiskt-hantverk/index.html` | yes (>400 comment, ruled 2026-10-05) |
| 452 | `projects/salong/prototypes/25-lab-demo-live/css/sektioner.css` | **no** |
| 446 | `projects/salong/prototypes/21-lab-demo-a/css/sektioner.css` | **no** |
| 417 | `projects/salong/prototypes/24-lab-demo-flag/css/chart.css` | **no** |
| 414 | `projects/salong/prototypes/17-mork-akademien/css/style.css` | yes ("reason:" line) |

- FIX (6 rows): the six `*-lab-demo-*/css/*` files >400 without a header reason. Honest attribution:
  the rename commit touched them with **0 lines changed** (`git show --numstat`) — debt from the
  lab-build run, this run only renamed them. Cheapest fix = one header reason line each (or an owner
  ruling exempting lab builds, recorded). 712/679 also sit above the 600 gate ceiling — flagged for
  the orchestrator, though the gate rule targets files a run *grew*, which these commits did not.
- Vendored exception respected: `_assets/vendor/gsap.min.js` + `ScrollTrigger.min.js` (~11 minified
  lines) correctly exempt. All §8.1 pre-ruled files still carry their reason lines (headers opened).

## A4 — PLACEMENT + gitignore — PASS

- `.audits/20261006-1412-vm106-hosting/` matches layout-v2 `<YYYYMMDD-HHMM>-<slug>/` with `out/`
  deliverables — the repo's established run shape; scratch children used `.tmp/` (`p1/` etc.), mine
  at `.tmp/t6/`. No `<seat>-<project>` sibling dir was created by this run (repo root clean; the
  neighbouring `~/anny-run-audits-backup-20261003` predates it — pre-existing, noted, not this run).
- `git check-ignore` confirms `_site/` `.audits/` `.dsh/` `.impeccable/` `.tmp/` `.playwright-mcp/`
  `.pytest_cache/` all ignored; `.gitignore` carries the owner ruling verbatim ("Only committ final
  site and its images", MC 10062.30.1) — **intentional per ruling**, and the public surface is real
  committed files at root/`projects/` (consistent with BRIEF ruling 1). `git ls-files .audits` = 0.
- Files committed by this run's three children: `docs/` (1), `projects/` (344), `README.md`, `tools/`
  — nothing matching any ignore pattern; no `_site/`, `.audits/`, `.dsh/` entries slipped in.

## A5 — FORWARD-COMPATIBILITY (pending hosting phase — document only)

- The SPEC §1 mirror `include` globs are path-rooted (`projects/**/*.{html,css,js,woff2,jpeg,jpg,png,
  svg,webp}`), so they mechanically still cover `projects/salong/**` after the rename — verified by
  glob semantics (leading `/`/embedded `/` anchor at app root; `**` crosses dirs, mirror.py quoted in
  SPEC §3). No glob edits needed.
- Re-derive before the push (the SPEC was authored at HEAD `00b8dc5`, before R2/R3.3/R4):
  1. **§1 `description`** still reads "…för Anny Mullers frisering…" — personal data in the public
     index row, forbidden by R2.6; P2 must rewrite it (title/tags checked: no PI).
  2. **§3 dry-run numbers** (`served=268`, `dropped=38`, 305/306 tracked, 50 html, the SERVED sample
     paths `projects/anny/…` and `01-mullers-editorial`, drop-list `anny-portrait.ATTRIBUTION.md`) —
     re-run `dryrun_mirror.py` against the current tree (306 tracked now, `jane-portrait.ATTRIBUTION.md`)
     and restate §3's numbers from that run.
  3. **§1 `/index.html` + `thumbs/**`** presume P2 files that are still absent (dry-run used a stub;
     README keeps thumbnails untracked today) — the real committed root index + thumbs must exist and
     the dry-run repeated before push.

## Verdict reasoning

A2, A4 pass cleanly. A1 has five named stale statements (one CONTRADICTED provenance block) and A3
has six un-reasoned >400 files — all small, mechanical edits (doc rows + 6 header lines), which is FIX,
not FAIL: the architecture and the tree agree on shape, ports, mechanism and renames; the doc just
carries R2/R4 drift.

# JUDGED: ad683aa3d0cb3174ad0ff074495f345cdb37bb3288daa57acc29fb54e01f89c8
# VERDICT: FIX
