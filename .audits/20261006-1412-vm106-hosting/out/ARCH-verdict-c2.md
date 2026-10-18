# ARCH-verdict-c2 — MC 10088.12 [type:design] re-verify at c2d8fe6 (FIX-ARCH-01, amended)

Read-only pass re-derived from the tree at HEAD `c2d8fe6` (never from c1 rows or fixer claims).
Base note: the trigger named `44db35b`; that commit is dead — mid-run amend produced `c2d8fe6`
(same message, same parent `8336bd4`, timestamp; the only delta is `docs/ARCHITECTURE.md`
+21/−17 — §10 rewritten to tree truth). Parent correction confirmed with
`git cat-file -t 44db35b` (object exists, no branch contains it) + `git branch --contains c2d8fe6`
→ `main`; `git diff 44db35b c2d8fe6 -- projects/` is empty (CSS hunks unchanged). Working tree
clean (disk == c2d8fe6). All commands run this session; scratch `.tmp/t6c2/`.

Doc under review: `docs/ARCHITECTURE.md`, 246 lines.

## Summary table

| Row | Check | Observed | Verdict |
|---|---|---|---|
| B1 | c1 A1's five doc rows re-derived + NEW §10 vs tree | all six sub-checks true against the tree (detail below) | PASS |
| B2 | c1 A3 fix: 6 CSS reason lines, pure +1, zero non-header changes | all six hunks `@@ -0,0 +1 @@`, numstat `1 0` each, zero removed lines anywhere in `projects/` | PASS |
| B3 | HOSTING-01 placement + mechanism monogamy + §2 coverage of new root files | placement contract-forced, thumbs still ONE mechanism — but §2's layout table has NO rows for the 4 committed root files | **FIX** |
| B4 | hygiene of new files | index.html 94, build-index.py 281 (grew from 233), gen-placeholders.py 103, thumbs naming uniform, favicon binary exempt | PASS |
| B5 | coherent pre-push story | coherent and true as measured; two INFERRED-beyond-tree claims named; no rollback note in §10 (none claimed) | PASS (notes) |

## B1 — c1 A1 re-verification + new §10 — PASS

1. **Placeholder-art statements (§3, §5) vs `_assets` reality.** `jane-portrait.ATTRIBUTION.md`
   (tracked, on disk): "Platshållarkonst genererad 2026-10-06 av `tools/gen-placeholders.py`
   (deterministisk seed 20261006). Ingen fotokälla" — matches §5's "generated placeholder art,
   not photographs". `tools/gen-placeholders.py` line 16: `SEED = 20261006`; `TARGETS` re-counted
   by importing the module: **17** (§5's "17 TARGETS total"). Dimensions re-checked with PIL this
   pass: gal-01..04 = 1536×2048 JPEG ×4, jane-portrait.jpg = 1656×2208 — exact §5 numbers.
   §3 "18 themes embed the 4 gallery images + the portrait" + "15 and 18 photo-free": `grep -rl
   jane-portrait --include=index.html` hits exactly 18 of the 20 theme dirs (01–14, 16, 17, 19,
   20) + 4 lab builds; `15-sagan-om-klippet` and `18-bara-typsnitt` have `<img` count **0**. True.
2. **§2 `tools/` + `_site/` rows exist and are true.** All three tool headers read this pass:
   build-index.py (scan→`_site/`, per-project page title-from-`<title>`+thumbnail+link, relative
   symlinks), check-links.py (crawler: a/link/script/img/srcset + inline/file-CSS url()/@import +
   JS asset strings, external counted-not-fetched, forbidden paths 404, exit 0), gen-placeholders.py
   (deterministic washes, PIL-opens each target to keep size/format). All match their §2 rows;
   `_site/{salong,portfolio}/prototypes -> ../../projects/…` relative symlinks confirmed with
   `ls -la`. (The §2 build-index.py row's silence on the new `--root` mode is folded into B3, the
   row that covers it.)
3. **§1 no pytest-as-live-gate claim — and the claim is true.** `crontab -l | grep -ci pytest` =
   **0**; `grep test_prototypes ~/.dsh/bin/*.sh` = **0**; live cmdline: `python3 -m http.server
   8090 --bind 0.0.0.0 --directory /home/claudecode/Hemsidor/_site` (pid 3218613);
   `proto-server-keepalive.sh` is curl-probe → restart only; cron carries `@reboot` + `*/5` for
   both keepalives. The pytest file exists (`.audits/202610041341-f6053f16/out/test_prototypes.py`,
   **190** lines — §7's count) but nothing invokes it. §1's "history, not a live gate" is tree-true.
4. **workflow-explode row vs `ls` + :8092 curl.** Dir has `index.html css/ js/ assets/ RESULT.md
   README.md`; `git ls-files` shows all tracked incl. `js/vendor/gsap.min.js` + `ScrollTrigger.min.js`;
   `curl http://127.0.0.1:8092/workflow-explode/` → **200**. True.
5. **§8.1's >400 claim vs `wc -l`.** `wc -l` over every tracked `projects/salong/*` text file:
   exactly **9 files >400** — 713 23-lab/css/styles.css · 680 22-lab/css/styles.css · 510
   26-lab/css/style.css · 470 18/js/scroll-motion.js · 456 08/index.html · 453 25-lab/sektioner.css ·
   447 21-lab/sektioner.css · 418 24-lab/chart.css · 414 17/css/style.css — doc's list, files and
   counts, identical. 251–399 band re-count = **52** ("52-file band" true). Header reasons spot-read
   **all 9**: the 6 lab files carry `/* reason (>400 rader, FIX-ARCH-01 2026-10-07): … */` lines,
   each file-specific (23: `:root` scaffold boxes + their 44 consumers in one flow; 22: WCAG-ratio
   annotations at tokens + REVIEW F1–F4 fixes at use-sites; 26: sjökort measuring system, 31 `:root`
   consumers, fonts already split; 25/21: section halves whose field transitions are rule-order
   dependent; 24: sole stylesheet — @font-face + 1440×900 measured boxes in one cascade). No
   generic "kept whole because single theme" phrasing anywhere. Vendored gsap exempt correctly.
6. **NEW §10 vs tree truth.** `hosting.yaml` exists at repo root, tracked @ `8336bd4` (per
   `git log -1 -- hosting.yaml`). Keys re-read: `name: webdesign` ✓, `type: static` ✓,
   `root: apps/webdesign` ✓, description "Interaktiva webbläsarprototyper för en frisörssajt samt
   portfolio-koncept…" — no PI ✓ (R2.6/R3-F2 satisfied); strict JSON parse OK via `json.load`.
   §10's mirror summary matches the yaml include list exactly (`/index.html`, `projects/**`
   html/css/js/woff2/jpeg/jpg/png/svg/webp, `thumbs/**`, `/favicon.*`); exclude list as quoted
   plus `/PORT`, which §10's summary sentence omits — paraphrase, not exhaustive claim, non-FIX.
   State: `git fetch origin` → `origin/main` = `00b8dc5` (doc's exact sha) and
   `git log --oneline origin/main..HEAD` lists **6** unpushed commits incl. `8336bd4` and `c2d8fe6`
   — "COMMITTED, AWAITING PUSH" is the true state. Validator run THIS session:
   `python3 /home/claudecode/agent-town/infra/vm106/repo-visibility-hosting/validate-hosting.py
   /home/claudecode/Hemsidor` → 7× `[PASS]` (hosting.yaml-present · is-web-app · hosting.yaml-parses
   strict JSON · name='webdesign' · type=static · root=apps/webdesign · static-entrypoint
   index.html at repo root), `VERDICT: PASS`, **VALIDATOR_EXIT=0** — exactly §10's claim.

## B2 — c1 A3 fix discipline — PASS

`git show --numstat c2d8fe6`: 7 files — `docs/ARCHITECTURE.md` 79+/23− (doc rewrite, expected) +
six CSS files at `1 0` each. `git show -U0`: every CSS hunk is `@@ -0,0 +1 @@` — the added line is
line 1, a header comment; **zero removed lines** in any `projects/` file, so motion/layout bytes
untouched (R2.5 invariants cannot move). The amend also left `projects/` byte-identical to 44db35b
(`git diff 44db35b c2d8fe6 -- projects/` = 0 lines). Reason-line specificity: see B1.5 — all six
specific, FIX-ARCH-01-tagged, dated.

## B3 — HOSTING placement + monogamy + §2 coverage — FIX (one named row)

- **Placement (root files): justified, not a violation.** `index.html`, `favicon.ico`, `thumbs/**`
  at the repo root are *contract-forced*: the validator's `static-entrypoint` check and
  hosting.yaml's `/index.html` + `/favicon.*` + `thumbs/**` include globs name those exact paths;
  `_site/` stays gitignored per owner ruling (BRIEF ruling 1). These are the product's public
  surface, not a stray sibling dir — layout-v2-clean.
- **Mechanism monogamy: holds.** `make_thumb` is defined exactly once in `tools/build-index.py`
  (line 135) and is called from BOTH the `_site` build path (line 193) and the new `build_root`
  path (line 244) — the extension REUSES the thumbnail mechanism, no duplicated screenshot/thumb
  code. `git grep -ln "screenshot.mjs\|thumbs"` over tracked py/sh/js returns only
  `tools/build-index.py`. One generator, one thumb maker; committed thumbs use the same naming as
  `_site/thumbs`.
- **§2 coverage — THE GAP (FIX):** HOSTING-01 committed four new tracked root entries —
  `/index.html`, `/favicon.ico`, `/thumbs/**`, `/hosting.yaml` — and `docs/ARCHITECTURE.md` §2
  ("Repo layout (as it actually is)") has **no row for any of them**; the "Entry points:" sentence
  below the table still lists only the gallery + per-theme `index.html`, omitting the committed
  root `index.html` that is now the public hosted entrypoint; and the §2 `tools/build-index.py`
  row describes only the gitignored `_site/` mode, silent on `--root` (which writes TRACKED files —
  a doc that says "generated, gitignored, never hand-edited" for everything that tool touches now
  underdescribes it). §10's prose accounts for the files' role, so the doc is not *false* about
  them — but §2, the layout table itself, drifted on the doc's first day post-fix. **Fix = add §2
  rows for `/index.html` (public browse surface, generated by `build-index.py --root`),
  `/thumbs/**`, `/favicon.ico`, `/hosting.yaml`; extend the build-index.py row with the `--root`
  clause; add the root index to the entry-points sentence.** Small, mechanical — FIX, not FAIL.

## B4 — hygiene of the new files — PASS

`wc -l`: root `index.html` **94**; `tools/build-index.py` **281** (grew 233→281 in HOSTING-01 —
under the 250-soft/400-hard band, no reason line required); `tools/gen-placeholders.py` **103**.
`thumbs/`: 48 tracked PNGs, uniform `<project>/<kind>-<name>.png` (`salong`/`portfolio` ×
`prototypes-NN-name` / `concepts-name`), same scheme as the `_site` thumbnails — sane.
`favicon.ico` is a 3-size ICO binary (verified with `file`) — binary/generated, hygiene-exempt.
`docs/ARCHITECTURE.md` 246 lines — one subject, under 300.

## B5 — closing statement for the run — PASS (with named INFERRED claims)

The pre-push story is coherent and measured true: hosting.yaml committed @ 8336bd4 → validator
7/7 PASS re-run this session → `origin/main..HEAD` shows exactly the 6 commits that carry it →
push makes the repo a web app to the reconciler → public surface is the committed root files the
mirror include names. Rollback: §10 does NOT claim one, and none was needed for the story — the
run's rollback note (`git revert 8336bd4` → SKIP-NOT-WEBAPP) lives in the run docs and is
paper-rehearsed only; say so at push time rather than implying a tested rollback.
Claims INFERRED beyond this checkout (sound, but not derivable from the tree): (1) §10's
"ARMED reconciler … ~15-min tick" and (2) the public URL `https://sibbamala.com/webdesign/` —
both rest on the run's SPEC/vm106 probe records (the vm106 crontab is not readable from this
host); §10 honestly sources them to the run's SPEC. Everything §10 states about THIS repo
(sha, keys, validator result, push state, file inventory) is VERIFIED this session.
Owner-override rows recorded, not re-litigated per c2-common: R3.1 history-accept and R3.2
/anny/-leave-live are owner decisions; the disclosed Jane Cooper handle/phone/email/address and
portfolio persona remain accepted demo data.

## Verdict reasoning

B1, B2, B4 pass on re-derived measurements (doc now agrees with the tree on all six checked
claims, and the six CSS hunks are provably pure header additions). B5 finds a coherent story with
honest sourcing. The one gap: §2, the repo-layout table, lacks rows for the four newly committed
root files and underdescribes `build-index.py`'s `--root` mode — a same-shape drift as c1 A1.2,
one small table + two sentences. That is FIX with the exact gap named above; nothing in the
architecture has diverged beyond a small edit.

# JUDGED: 5cabf9e464a69e1bc5e478da8eb4239f39dc61c17738c7f3628c41f7c26b47c5
# VERDICT: FIX — `docs/ARCHITECTURE.md` §2: no rows for committed root `/index.html`, `/thumbs/**`, `/favicon.ico`, `/hosting.yaml`; "Entry points:" sentence omits root index.html; §2 `tools/build-index.py` row omits the `--root` mode that writes those tracked files
