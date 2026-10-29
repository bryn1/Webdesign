# ARCHITECTURE — Hemsidor scroll-design prototype library

Exceeds the 250-line doc convention because §4's deviation table and §8's pre-ruled exception
register are DoD-gate inputs and must not be split from the facts they qualify.

**Document version:** this file carries no `version:` field and keeps no dated copy of itself — it lives
inside a git-tracked repo, so **git history IS its version store**: the current version is what
`git log --oneline -1 -- docs/ARCHITECTURE.md` names, and any past one is `git show <sha>:docs/ARCHITECTURE.md`.
(MC 11003 fix2, 2026-10-23, naming the reading used: the 2026-10-22 versioned-truth ruling's
archive-the-superseded-copy step is satisfied here by history rather than by a `SUPERSEDED — DO NOT USE`
duplicate, because a dated clone of a tracked doc would land as an untracked file at the repo root, which
§8 forbids. No dated copy was created for this pass either.)

Repo: `/home/claudecode/Hemsidor` (GitHub `bryn1/Webdesign`, main). Project intent: **PoC-demo** —
20 competing scroll-design themes for one real hairdresser site (salon persona placeholder "Jane
Cooper" — owner ruling R4; the portfolio project's named subject IS the repo owner, Alexander
Lektove Karlskrona, intentional per owner ruling MC 10088 2026-10-07), pitched
to the owner; LAN demo only, no production claims. This file is derived from the actual tree
(`wc -l`, `ls`, greps, live probe, cron read) on 2026-10-05 by the design profile (MC 10088,
ARCH phase). It supersedes the 2026-10-04 "arch N/A" ruling (DONE.md E1) — the JS enhancement
wave (owner rulings 2026-10-05) made the shared motion mechanism large enough to document.


> **Layout v3 (MC 10062.30.1, 2026-10-07).** This repo (bryn1/Webdesign, clone `~/Hemsidor`) is now the
> home of EVERY frontend prototype, one folder per project: `projects/<project>/{spec.md, prototypes/<NN-name>/,
> concepts/<name>/}`. `projects/salong/` holds the 20 themes this document describes (paths below are updated) plus
> the live-PoC snapshot (00) and 6 impeccable lab builds (21-26); `projects/portfolio/` holds the 20 portfolio
> themes copied from `~/portfolio-designs` (b43cae3) plus the workflow-explode concept. `:8090` now serves the
> GENERATED browse site `_site/` (`tools/build-index.py`; root = one card per project) so `.git`/`.audits` are not
> reachable; `:8092` serves `projects/portfolio/concepts`. `.audits/` is no longer tracked (kept on disk; the dsh
> DoD tooling reads verdict files from disk, verified). NOTE: the pytest gate under `.audits/202610041341-*/out/`
> was written for the old `prototypes/` path; it was repaired 2026-10-08 under owner ruling 1a and
> re-pointed at `projects/salong/prototypes/` — it is a LIVE gate. See README.md.

## 1. Shape in one line

Multi-project static tree — `projects/<project>/{prototypes,concepts}/` of self-contained builds
(salong: 20 gallery themes + the live-PoC snapshot 00 + 6 lab builds 21–26 + shared `_assets/`;
portfolio: 20 single-file themes + the workflow-explode concept; np: 4 prototypes for bryn1/np (§2 row);
wedding: the REAL homepage, LOCAL_ONLY; skola: 4 Operate-mode prototypes for the bryn1/skola learning
platform) — where what is served read-only by
`python3 -m http.server` on :8090 is the GENERATED browse site `_site/` (`tools/build-index.py`), not
the repo root (so `.git`/`.audits` are unreachable — both probe 404, measured this pass); content canon
for salong in `projects/salong/spec.md`; the DoD record is the verdict files under
`.audits/<run>/out/` (on disk, untracked) — the pytest file under `.audits/202610041341-*/out/` was
repaired 2026-10-08 (owner ruling 1a) and is a live gate re-pointed at `projects/salong/prototypes/`
(per the v3 note above).

## 2. Repo layout (as it actually is)

**New-website rule (owner ruling 2026-10-08, MC 10286).** A new website is its own subworkspace:
create `projects/<website>/` FIRST (lowercase-kebab, one website = one folder, created before any
file is written), with `spec.md` + `prototypes/<NN-name>/`; prototypes live only under their site's
folder. No loose site dirs at the repo root; no second website inside another site's folder.
Scratch goes to `projects/<site>/.tmp/`, and a project run's records to
`projects/<site>/.audits/<YYYYMMDDHHMM>-<slug>/out/` (its shots under `out/shots/`); a run whose
object is the **repo** keeps the root `.tmp/` and root `.audits/` — the same layout at two depths,
not a second convention. Scratch still never goes to `out/` at the repo root (see §8.6 for why that
recurs), and an ignored file is not a tidy file: `.gitignore` hides a root artifact from `git
status`, not from the workspace (§8 item 9).
Exception: the generated public browse pages — root `index.html`, `<project>/index.html`,
`thumbs/**` — written by `tools/build-index.py --host-surface` and mirrored (§2 table, §10) are the
public surface, not loose site dirs. They are a MIRROR of `projects/<site>/` and never a source: the
owner ruling of 2026-10-22 09:53:32+02:00 (MC 11003, verbatim: "rec on all and fix the np/, projects/np
trap. doctrine is /projects/np") names `projects/<site>/` canon, so that writer is opt-in-only, prints
the name collision before it writes, prunes a generated page the moment its project vanishes or arms
`LOCAL_ONLY`, and every page it writes must be committable by a plain `git add`. Enforcement is the
writer's refusal — `.gitignore` is deliberately NOT a second mechanism (the follow-up removed the
`/*/index.html` rule MC 11003 had added: measured path by path it also swallowed `docs/`, `tools/`,
`out/` and every future site, caught nothing at depth 2, and its only net effect was to make a stray
INVISIBLE to `git status` — the visibility that found the trap in the first place).

| Path | Role |
|---|---|
| `projects/salong/spec.md` | Content canon — every theme's Swedish copy/section contract (single source). |
| `PORT` | Demo port, committed: `8090`. Gate + keepalive read it. |
| `projects/salong/prototypes/` | The product. 20 theme dirs + `_assets/` + gallery `index.html`. |
| `projects/np/` | np frontend prototype set — 4 prototype dirs under `prototypes/`, 32 tracked files, own committed thumbs. `projects/np/` IS the doctrine (owner ruling 2026-10-22, MC 11003, verbatim: "doctrine is /projects/np"): the repo-root `np/` dir was exactly the shadow trap this section rules on — deleted from the root by MC 11003, its strays quarantined under `.tmp/root-surface-20261022/`, and it may only ever be regenerated as the GENERATED mirror by `--host-surface`. NO `LOCAL_ONLY` marker (np is ordinary tracked content). |
| `projects/wedding/` | REAL wedding homepage (MC 10511/10524), LOCAL-ONLY per the owner privacy ruling (§8.8). As actually in this checkout (re-measured 2026-10-22 — the canon files an earlier row of this table asserted do not exist here): 0 tracked files (`git ls-files projects/wedding` → empty), 6 local prototype dirs `01-kunglig … 06-bukett-klassisk` whose only file is a gitignored `QUALITY.md` — no `index.html` anywhere, no `spec.md`, no `PRODUCT.md`, no `_assets/`. The privacy guard's data half is armed ON DISK by `projects/wedding/LOCAL_ONLY` (untracked on purpose — why, and what protection is really in force: §8.8), so `scan()` skips wedding in ALL modes: root cards, per-project pages, thumbs, `_site` (measured this pass; before that file existed the doc asserted the guard while `scan()` returned wedding). Push is BANNED while wedding is in history; `.git/hooks/pre-push.local` aborts any push whose commits touch `projects/wedding/`. The :8093 keeper (§6) is currently dark — a reboot/manual restart serves it. |
| `projects/skola/` | skola (bryn1/skola) frontend prototype set — minors' learning-platform surfaces, Operate-mode: `spec.md` (route canon from the repo tree), `PRODUCT.md` + `DESIGN.md` (impeccable), 4 gated surfaces under `prototypes/` (01-skola-start, 02-skola-elev, 03-skola-larare, 04-skola-admin) now carrying 35 feature pages (01: `login.html`; 02: 12; 03: 14; 04: 8) with entry links in each surface index + shared shell `_assets/skola-shell.css` + `_assets/` (local images + vendored GSAP copies). Static, no backend; served read-only via the `_site/skola` symlink on :8090. MC 10953–10958, run 202610190711; T5 feature pages + entry links MC 11630, run 202610281840. |
| `tools/build-index.py` | The browse-site generator (stdlib only, deterministic): scans `projects/<project>/{prototypes,concepts}/<name>/index.html` and writes `_site/` — a root page with one card per project, one page per project (title from `<title>`, thumbnail, link), and relative symlinks `prototypes`/`concepts` pointing back into `projects/` so relative assets resolve. `projects/<site>/` is the ONLY source; the per-project page always goes to `_site/<project>/index.html`. With the explicit `--host-surface` opt-in it ALSO writes the TRACKED public surface for the vm106 mirror (root `index.html` + the `<project>/index.html` pages — one shared per-project page writer serves both `_site` and the surface — + `thumbs/**`, thumbnails made as needed; the mirror pages are never gitignored and every page `build_root()` writes must be committable by a plain `git add` — asserted by the gate, MC 11003 follow-up). That surface is a GENERATED MIRROR, never a source: a root `<site>/` folder duplicates the name of `projects/<site>/` one Tab away and silently disagrees with it as soon as the source changes, so `build_root()` refuses without the flag and prints the collision naming each `projects/<project>/` before it writes a byte; and, mirroring `build()`'s prune over `_site/`, it removes a stale generated `<project>/index.html` on the NEXT `--host-surface` run (measured 2026-10-22: a marker armed then a PLAIN run leaves `np/index.html` in place and prints no prune line — a plain run never calls `build_root()`; the next `--host-surface` prints `pruned stale surface page np/index.html` and the dir goes. The row used to claim the prune fires "in the same run whose project was deleted or armed `LOCAL_ONLY`", which README already stated correctly — MC 11003 cycle-2 DA P2-B; arming a marker therefore calls for re-running `--host-surface` immediately) — a public page never outlives its card or the privacy ruling by more than one publish (MC 11003 follow-up, DA P1-B). What may be removed is bounded by the writer's OWN signature — BOTH halves `project_page(public=True)` emits: the nav-back mark `← Alla projekt` AND the page's `<title>`, read back through the tool's own `head_of()`/`title_from()` against `surface_title(<dir>)`, so writer and predicate derive the identity from one definition (cycle-2 DA P2-A: the mark alone made identity a 13-character string and a `docs/index.html` plant was removed with its directory). Each half is pinned by a leg of its own — `test_host_surface_never_prunes_a_page_the_writer_did_not_write` (mark alone must not delete) and `test_title_shape_alone_does_not_identify_a_writer_page` (`<title>` shape alone must not delete; MC 11003 cycle-3 TEST T1 found this half asserted in only one direction — dropping the marker clause left the whole suite green while the mutant deleted the page and its directory). What the shared constants do NOT do is survive a copy-edit: changing `SURFACE_TITLE_STEM`/`SURFACE_MARK` orphans every page the previous wording left on disk, and that case is now LOUD rather than silent — a stale page carrying ONE half of the signature prints `KEPT, review <site>/index.html …` on stderr (rc still 0, the page still kept: deleting on half a signature is the cycle-2 defect) instead of exiting quietly forever (cycle-3 DA P1, three measured paths: a one-character typo fix in a title, a reword of the writer's own stem, a mark sitting past the reader's window — the last one closed by reading the mark and the title through the ONE 65 536-character window `title_of()` already used; the old `fh.read(4096)` was 4 096 CHARACTERS and a committed page put the mark at char 1 884-1 888, so ~2 200 B of head growth made the writer's own stale page unprunable). THAT LOUDNESS IS A BOUND, NOT A PER-PAGE GUARANTEE (cycle-5 TEST F5 + cycle-6 DA F1, both measured): the line prints for a page that shows at least one half of the signature READABLE INSIDE the window, and a half can hide TWO ways — by POSITION (past 65 536 characters) or by DECODE: an ordinary editor's cp1252/UTF-16 re-save of the page hides BOTH halves at char ~142, because the reader decodes UTF-8 and replaces what it cannot read (the parent probe reproduced it end to end: the old (F,F) branch kept the private project's page, said nothing, rc 0). For this writer's pages the POSITION gap is closed by shape, not luck — `page()` emits the `<title>` before the CSS and the nav mark sits in the BODY after it, so a growing generated page can push only the MARK past the window, never both halves — and both bounds are enforced by red legs (floor `test_host_surface_still_sees_a_mark_that_sits_past_the_old_4096_character_window`, ceiling `test_a_page_hiding_both_halves_past_the_window_is_kept_in_silence`), not a promise about every page on disk. The DECODE gap is closed WHERE THE GUARD MUST NOT FAIL OPEN (fix4): a neither-half page whose project dir is still on disk with `LOCAL_ONLY` armed is KEPT UNREAD, ANNOUNCED (`KEPT, review <site>/index.html …`) and the run ENDS exit 3 (`EXIT_UNIDENTIFIED_KEEP`) — rc 0 there was cron reading a private project's surviving page as success — while a neither-half page whose project is gone (or a non-project dir) stays the SILENT foreign keep at rc 0, because unreadable bytes are no evidence to delete a page this writer may not have written (cycle-2 DA P2-A stands; pinned by `test_a_re_encoded_page_under_an_armed_marker_is_kept_named_and_ends_the_run_nonzero` + the ceiling leg). Both directions of the loud branch are now asserted: `test_host_surface_says_so_when_a_stale_page_carries_the_title_without_the_mark` (the writer's own `<title>`, mark stripped — the direction cycle-5 found unguarded, where a `marked and not own_title` narrowing kept the suite green over a silent keep) beside the mark-without-title leg, and `own_title` is EQUALS, never a substring test (`test_host_surface_keeps_a_page_whose_title_starts_with_the_writers_own`: a hand-extended title stays public AND is named — loosening the equality to containment deletes it in silence, which is the README promise to a page-editor broken). Legs: the `test_host_surface_says_so…`, `…keeps_a_page_whose_title…` and `…still_sees_a_mark…` rows; rename case `test_host_surface_prunes_the_old_page_of_a_renamed_project`). A surface publish survives a dead browser: `make_thumb()` reports the thumb failure per file (missing node, slow Chromium), the card degrades to its placeholder, exit 1 still names it — the publish never aborts (MC 11003 follow-up, DA P2-D). `--root` is RETIRED (MC 11003, owner ruling 2026-10-22): it writes NO root `<site>/` surface — the ordinary `_site/` build of that same run still runs, as it does for any flagless invocation — prints where the writer moved, and exits 2 — a retired flag that exits 0 is indistinguishable from success to a script or a cron (the row simply said "writes nothing", which over-scoped the claim: MC 11003 cycle-2 ARCH FIX-3/DA W1). Any other token — unknown, malformed (`--root=yes`, `--host-surface=1`) or a BARE POSITIONAL (`build-index.py host-surface` with the dashes dropped) — is refused exit 2 before anything is written, naming the accepted flags (MC 11003 follow-up, DA P2-C; cycle-2 TEST T2, which found a `--`-only validation mutant exiting 0 having published nothing while the suite stayed green). NOTE for scripts: `--host-surface --root` still WRITES the mirror and then exits 2 — the code reports the retired flag, never "nothing happened" (cycle-2 TEST W2; pinned by `test_retired_root_flag_exits_nonzero`). Exit codes, whole tool (fix4; fix5 narrows 2's wording and writes down the precedence fix4 left implicit): 0 ok; 1 a thumb step failed (pages were written); 2 REFUSED — a bad flag or an unclassifiable `LOCAL_ONLY` marker is refused before anything is written, while the RETIRED `--root` reports 2 AFTER the run's writes (the NOTE above owns that case, in one sentence: `--host-surface --root` writes the mirror and then exits 2 — the legend's earlier blanket "before anything is written" contradicted that NOTE inside the same cell, measured by the retired-flag leg it names); 3 the pages were written but the privacy prune kept an UNREAD page under an armed marker and named it — a human must review (never treat 3 as success). Precedence between simultaneous conditions, as measured at fix5 on fixture trees: a bad flag or unclassifiable marker refuses first, before any build runs; a retired `--root` then OUTRANKS the privacy keep (`--host-surface --root` with an unreadable private keep pending exits 2, not 3, the `KEPT` line printed either way); the privacy keep outranks a thumb failure (keep + failed thumb exits 3, not 1, the thumb `FAILED` line printed either way). That retired-masks-3 order is the contract prose-only — swapping the two `return`s in `main()` leaves the whole suite green (DA-c7 m_retired_last), which the MC 11509 D3 cap leaves unpinned by any leg. Run after adding a build (with `--host-surface` when the public surface must follow). Skips any project carrying a `projects/<p>/LOCAL_ONLY` marker of ANY kind — file, directory or link — in ALL modes — root cards, the per-project page writer, thumbs and `_site` — (MC 11003 cycle-6 fix4: the predicate asked `isfile`, so a DIRECTORY named `LOCAL_ONLY` — the same look in a file manager — read as PUBLIC and published the private project silently at rc 0; TEST-verdict-c6 CONTRADICTED row. A marker the tool cannot positively classify — present, neither file nor dir, a dangling symlink — REFUSES the whole run: exit 2, the path named, nothing written, never processed as public; the alternative reading "treat any unreadable marker as private" is NOT taken — no owner artifact exists, this is the orchestrator's cycle-6 reading, and §8.8's marker stays a plain file), printing the skip notice PER scan(), not per run: one line on a plain run, TWO on a `--host-surface` run, which scans once for `_site/` and again for the mirror (measured fix4; the row promised "a one-line skip notice" — cycle-6 DA F4 — and the exact 1-vs-2 counts are pinned by the gate leg) (MC 10510 privacy guard; for wedding the marker is armed on disk — see §2 wedding row + §8.8 — and the guard's coverage is the gate legs `test_local_only_project_is_skipped_in_every_mode` + `test_a_local_only_marker_of_ANY_kind_arms_the_guard` + `test_an_unclassifiable_local_only_marker_refuses_the_run_and_names_the_path`). Tested by `tools/test_build_index.py` (MC 11003 red/green + the follow-up's committability/prune/exit-code/no-browser legs + the fix4 privacy/encoding legs) and `tools/test_build_index_uncovered.py` (the cycle-6 coverage package — paths the docs promised and no leg had run), §7. |
| `tools/check-links.py` | HTTP crawler for the served site: follows every same-host page and requests every local reference (a/link/script/img/srcset, inline+file CSS `url()`/`@import`, JS asset strings); external refs are counted, not fetched; asserts forbidden paths (`/.git/`, `/.audits/`, …) answer 404. Exit 0 = zero broken. |
| `tools/gen-placeholders.py` | The deterministic placeholder-art generator (SEED 20261006): redraws its 17 tracked image targets as abstract paper/ink/clay color washes — no faces, no text, no recognizable objects — opening each existing file first so every replacement keeps that file's exact pixel size and format (owner ruling R2, §5). |
| `_site/` | Generated browse site — gitignored, regenerated, never hand-edited. This is what :8090 actually serves (the keepalive starts `http.server --directory …/_site`); its per-project `prototypes`/`concepts` entries are symlinks into `projects/`. |
| `index.html` (repo root) | The public root browse page — project cards ONLY (count + cover thumb, BROWSE-V2 owner ruling MC 10088.12), linking RELATIVE to `<project>/` (never `.md`/`tools/`/`docs/`); generated by `tools/build-index.py --host-surface`, mirror-served, and the static entrypoint the hosting bar validator judges ALWAYS (§10). NOTE (owner-visible, MC 11003 follow-up): the card set is `scan()`, so the tracked page links `np/`, `wedding/` and `skola/` too — and `hosting.yaml`'s include publishes NONE of those three (measured with the fleet's own `mirror.match_globs`); repo-vs-served is an open owner call, named at §10, deliberately not resolved here. |
| `salong/index.html` | The public salong browse page — 27 prototype cards with thumbs, nav-back `../`, links into `../projects/salong/…`; generated by `tools/build-index.py --host-surface`, mirror-served via the `/salong/**` include. |
| `portfolio/index.html` | The public portfolio browse page — 20 prototype + 1 concept (`workflow-explode`) cards with thumbs, same link/nav-back shape; generated by `tools/build-index.py --host-surface`, mirror-served via the `/portfolio/**` include. |
| `thumbs/**` | The 56 committed card thumbnails (re-counted 2026-10-22: `git ls-files thumbs \| wc -l` = 56; the row previously said 52) — `thumbs/<project>/<kind>-<name>.png`, naming as `_site/thumbs`, generated by `--host-surface`, mirror-served; the card images on the root index. |
| `skola/index.html` | The public skola browse page — 4 prototype cards with thumbs, same link/nav-back shape; generated by `tools/build-index.py --host-surface`; NOT yet on the vm106 mirror (its include names `/salong/**` + `/portfolio/**` only — recorded open item, PLAN §2.3). |
| `favicon.ico` | Root favicon, linked from the root index and mirror-served via the `/favicon.*` include. |
| `hosting.yaml` | The vm106 static hosting config (strict JSON; core keys `name: webdesign`, `type: static`, `root: apps/webdesign`) — under bryn1's strict owner policy the repo's ONLY web-app gate (§10). |
| `.audits/202610041341-f6053f16/out/` | This run's ledger (`DONE.md`), gate (`test_prototypes.py`), verdict files, research. |
| `.audits/202610051009-workflow-explode/` | A SEPARATE, unrelated run (MC 10140, a new-concept design phase). In-flight, untracked. Not part of the product. |
| `projects/portfolio/concepts/workflow-explode/` | That run's build target (served on :8092 by its own keepalive). Full build since 2026-10-05: `index.html` + `css/` + `js/` (vendored ScrollTrigger) + `assets/` + RESULT.md, all tracked; `:8092/workflow-explode/` answers 200 (probed this pass). Not the product. |
| `docs/ARCHITECTURE.md` | This file (layout-v2 path). |
| `DESIGN.md`, `PRODUCT.md` (repo root) | impeccable project state (mode 0600), tracked — the impeccable lab tooling's own canon, impeccable-scoped, not product surface. |
| `.tmp/`, `.playwright-mcp/`, `.pytest_cache/` | Git-ignored scratch (probe payloads, browser logs). |

No build system, no package.json, no node_modules, no backend, no database, no API surface
(DONE.md N2). Entry points: repo-root `index.html` (the public mirror root, project cards only —
with `salong/`/`portfolio/` as its per-project pages, BROWSE-V2; :8090's landing card page is the
generated `_site/index.html`, see the `_site/` row above),
`projects/salong/prototypes/index.html` (gallery) and
`projects/salong/prototypes/<NN>-<name>/index.html`
per theme.

**Known limits of `tools/build-index.py` (fix5 closing pass — five rows the three c7 gates agreed
stand; each re-measured at the object this pass, not copied):**

1. A READABLE half-edited page of a marked-private project survives every publish at exit 0 with one
   `KEPT, review …` stderr line (measured: two consecutive `--host-surface` runs, rc 0 each, page
   intact and still listing the private build). The rc 0 is ASSERTED by two cycle-5 legs
   (`test_host_surface_says_so_when_a_stale_page_carries_the_mark_without_the_title`,
   `test_host_surface_keeps_a_page_whose_title_starts_with_the_writers_own` — both assert rc 0 with
   the marker armed): a contract choice awaiting the OWNER's ruling (DA-c7 F1), not a bug a producer
   cycle may close under refuse-loudly.
2. NOTHING consumes exit 2 or 3 today — no crontab entry, systemd unit, CI config or hosting hook
   runs the tool, and the only tracked references to it outside its own gate/docs are run records and
   one comment in `.gitignore` (all measured fix5); the loudness is real to a human/agent at a
   terminal and inert in automation, while this section's rc-3 justification still names a cron as
   if it existed.
3. The second privacy call site — `build_root()`'s `(F,F)`-branch `marker_of(...)` — is pinned only
   as far as the encoding leg's BOTH-marker-shapes plant pins it (fix5). A narrowing that survives
   both planted shapes goes unnoticed: standing exposure under the MC 11509 D3 cap (no new leg owed);
   the one-line port for whoever touches that file — plant the leg's marker `for kind in ("file",
   "dir")`, as `test_a_re_encoded_page_under_an_armed_marker_…` now does.
4. The fleet's mutation gate CANNOT score this suite: `mutation_gate.sh . tools` stops at
   `mutation: manual only` (GATE_EXIT=2, reproduced fix5) — mutmut cannot trampoline a suite that
   drives the tool as a subprocess of a hyphenated, unimportable file. All mutation evidence here is
   hand-built mutants; any quoted mutation score for this tool would be fabricated.
5. Debt, with its seams: the tool sits at 568 of the hard 600 (its header reason covers the shared
   card-template writers only); ONE exit/prune contract is mirrored in three places (this row's
   prose, the tool docstring, README) — fix4's legend that contradicted its own cell was exactly that
   drift; and `tools/test_build_index_uncovered.py` is organised by which cycle found each leg (its
   docstring's own words), not by contract. First seam ARCH-c7 names: the CLI/refusal block (~50
   lines) behind a thin `main()`; second: `make_thumb()`'s browser/degrade block.

## 3. Theme anatomy — `projects/salong/prototypes/<NN>-<name>/`

Every theme dir has exactly three parts (bijection: 20 dirs ↔ 20 gallery cards, gate-enforced):

```
NN-name/
  index.html      one full page; 6 mandatory section ids: top om tjanster galleri boka kontakt
  css/            2–5 files (typical split: tokens + layout/base + components/sections [+ scroll/motion];
                  measured max 5 = 04-brutalt-tryck: base/components/layout/motion/tokens)
  js/             2–6 files, ONE of which is the motion file (§4); the rest are per-theme
                  non-scroll interactions (booking demo, contact demo, gallery nav, cursor,
                  preloader, tilt) — none of these register scroll triggers
```

Rules that hold across all 20 (measured this pass):
- Swedish, `lang="sv"`, identical BRIEF copy; demo-honest `#boka`/`#kontakt` paint a visible demo label.
- `<img>` srcs point at `../_assets/` — 18 themes embed the 4 gallery images + the portrait (all
  generated placeholder art, §5 — no real photographs exist in the product);
  themes **15** and **18 are photo-free by brief** and must state it *inside* `#galleri`
  (gate checks parsed img-srcs and the in-section statement, not prose).
- The six section ids are identical across themes on purpose — themes are drop-in swappable.
- External requests: Google Fonts CDN only — **E3 SETTLED 2026-10-10, owner ruling "rec"**: the
  prototypes keep the CDN exception (no vendoring pass); fonts degrade to fallbacks offline, which
  the no-JS/offline behavior already tolerates. The hero build at
  `projects/portfolio/concepts/workflow-explode/` is NOT covered by the exception — it self-hosts
  (Saira local, commit 21d6206) because it is the served showcase page. Zero other non-font https
  refs (grep re-run this pass: only an instagram.com content link).

## 4. The motion standard (owner ruling 2026-10-05, DONE.md §E)

ONE mechanism, ONE file per theme: **vendored GSAP v3.12.7 + ScrollTrigger** from
`projects/salong/prototypes/_assets/vendor/` (banner-verified 3.12.7, committed @ c4e0f4e). No runtime CDN for
motion; `animation-timeline`/`view-timeline` declarations repo-wide: **0** (only prose comments
naming the prohibition — re-grepped this pass).

Contract every motion file honours:
- Registered **only** inside `gsap.matchMedia()` under `(prefers-reduced-motion: no-preference)`
  ⇒ reduce mode = ZERO triggers registered, page sits in its CSS end-state, fully visible.
- JS-off / vendor-files-missing ⇒ same end-state (motion file returns early; CSS shows final layout).
- ≥5 scroll-linked effects, ≥3 scrubbed, classes line/color/zoom/drift/pin-or-draw; opening
  band 0→15% reacts; 375px no overflow; AA contrast on any new colour pair.
- All code in an IIFE, no new globals.

Reality vs the standard (the warts, stated honestly — this is what the doc must match):

| Theme(s) | File | Deviation | Status |
|---|---|---|---|
| 01–11, 13–18, 20 (18) | `js/scroll-motion.js` | none — name + single-trigger-registrar standard held | OK |
| 12, 19 | `js/scroll.js` | **legacy filename only** — still the single file registering ScrollTrigger (re-grep this pass: sole registrar in each) | cosmetic |
| 11 | `js/main.js` | **keeps a pre-wave IntersectionObserver reveal engine** beside GSAP (GSAP file registers 0 reveal targets ⇒ no overlap per concern, but two engines in one theme) | P2 queued for next touch — DONE S-F3, DA-c4 P2-1 |
| 02 | `js/theme-sync.js` | IO-driven section color-invert beside GSAP | P3 accepted (DA-c4) |
| 05 | `js/scroll-motion.js` | **module-level `gsap.ticker` drift engine** for background layers, besides ScrollTrigger for the rest — built after a mid-build `ScrollTrigger.refresh()`/matchMedia re-run froze stateful mm-scoped registrations; the engine is confined to the mm gate and PROVEN reduce-inert (0 style mutations across scrolls, TEST-c2 + DA). Second drive-mechanism exception — **DEBT-TAG (ARCH c2): do NOT template-copy to new themes**; pure-ScrollTrigger is the doctrine path |
| 15 | `js/main.js` | scroll-gated chapter-swap IO; disabled under reduce | P4 accepted (DA-c4) |

Convention added by the density wave (ARCH c2 P3-3): convergent drifts should tween **±A→0**, not
±A→∓A — alternating full-amplitude tweens can leave grids/rows visibly misaligned at rest
(invisible mid-scrub, obvious when the reader stops). **This is the default for NEW motion.**
Existing symmetric drifts remain in 02 (`#om .split` −24→24), 07 (`.grain` ±46), 10 (`--sx`
30→−26 via CSS var) and 16 (eyebrow parallax ±18); theme 05's ticker engine drives 0→A by
progress instead. All five are ruled **convert-on-next-touch**, not wave blockers (ARCH-c3 P4) —
none produce a parkable misalignment at rest today. Wide x-drifts sit behind a `min-width`
matchMedia block so 375px keeps 0 overflow.

Every one of the 20 themes has exactly **one** file that registers ScrollTrigger triggers (grep
this pass: 20 files, 5–12 registration sites each; 02/15's IO uses are non-GSAP helpers, 11's is
the accepted remnant).

## 5. Shared assets — `projects/salong/prototypes/_assets/`

```
_assets/
  vendor/gsap.min.js            GSAP 3.12.7, vendored (no CDN at runtime)
  vendor/ScrollTrigger.min.js   ScrollTrigger 3.12.7
  gal-01.jpeg … gal-04.jpeg     generated placeholder art (1536×2048 each), provenance below
  jane-portrait.jpg             generated placeholder art (1656×2208), provenance: ATTRIBUTION.md below
```

Image provenance (`jane-portrait.ATTRIBUTION.md`, tracked @ 7e6c6a0): the image files above are
**generated placeholder art, not photographs** — owner ruling R2 (MC 10088, 2026-10-06: "placeholder
for all images … and any personal information") removed the client's original portrait and the real
photos from the product; only the file *names* remain. Every image is deterministic output of
`tools/gen-placeholders.py` (SEED 20261006): abstract paper/ink/clay color washes — no faces, no
text, no recognizable objects — each target regenerated at the old file's exact pixel size and
format (re-checked with PIL this pass: gallery 1536×2048, portrait 1656×2208), so no layout metric
moved. The same generator owns the 00 snapshot's `images/gal-0*.jpeg` and the lab-build plates
(17 `TARGETS` total). All 18 portrait-bearing themes reference the SAME file — swap once, applies
everywhere. Themes 15/18 stay photo-free by concept (ruled). Gallery slots without an image show
honest "Bild kommer" frames (DONE L1 — PoC reality, not a bug).

## 6. Serve topology

```
[repo projects/salong/prototypes/] --(serve, read-only)--> python3 -m http.server 8090 --bind 0.0.0.0
                                              --directory /home/claudecode/Hemsidor/_site
LAN: http://192.168.5.231:8090/   (PORT file = 8090, committed)
keepalive: cron  @reboot + */5  ~/.dsh/bin/proto-server-keepalive.sh
             curl-probe → restart via setsid nohup; log ~/.dsh/proto-server.log

:8093 wedding prototypes (01–05 drafts + built 06; MC 10511/10524): python3 -m http.server 8093 --bind 0.0.0.0 --directory /home/claudecode/Hemsidor/projects/wedding/prototypes — LAN http://192.168.5.231:8093/, keeper loop since 2026-10-14 (added fleet-host-side after the OOM + planned-reboot deaths): while-loop restarts the server within 2 s, log ~/.dsh/wedding-8093.log. Still run-scoped: NOT a cron @reboot entry — a host reboot still needs a manual restart. PORT file unchanged (8090).
```

No server code lives in the repo — the only runtime is the stdlib static server.
(The :8092 concepts server + `concept-server-keepalive.sh` belong to the separate
workflow-explode run, MC 10140 — not this product.)

## 7. Gate harness + verdict convention

```
tools/test_build_index.py + tools/test_build_index_uncovered.py
                       pytest DoD gates for the browse-site generator — TRACKED (since MC 11003; the
                       repo's only tracked tests; the MC 11003 follow-up made its docstring/legs carry the
                       committability, prune, exit-code and no-browser assertions). fix4 SPLIT the gate by
                       concern at the 600-line test ceiling: the first module is the mirror LIFETIME + prune
                       predicate + privacy/encoding half (the legs §8's mechanism row names — they stayed
                       put), the second carries the cycle-6 coverage legs for paths the docs promised and no
                       leg had run (flags, scan classes, the `_site` prune, the window ceiling). LEG COUNT —
                       DERIVED, NEVER COPIED (MC 11003 cycle-3 DA P2: this row used to bless a number with a date
                       stamp on it, "14 legs RE-COUNTED 2026-10-22", true for exactly one commit and
                       pinned by nothing, which is the same count-rot with a fresher cover):
                       `cat tools/test_build_index.py tools/test_build_index_uncovered.py | grep -c '^def test_'`,
                       and `pytest --collect-only -q tools/` must answer the same number.
                       One byte-parity leg skips unless BUILD_INDEX_LEGACY names a pre-change copy —
                       and the sha IS the literal (cycle-3 TEST W3, the fact used to be tribal). The env
                       var is a PATH, so the copy is written out first; these three lines run AS PASTED,
                       from the repo root (cycle-5 TEST F3: the old one-liner `BUILD_INDEX_LEGACY=$(git
                       show 8c48865^:tools/build-index.py)` handed the leg file CONTENT where it wants a
                       path and died with `OSError: [Errno 36] File name too long`):
                       mkdir -p .tmp/legacy/tools
                       git show 8c48865^:tools/build-index.py > .tmp/legacy/tools/build-index.py
                       BUILD_INDEX_LEGACY=$PWD/.tmp/legacy/tools/build-index.py python3 -m pytest -q tools/
                       That copy keeps the parity leg GREEN; 8c48865's OWN copy turns THAT leg FAILED with FileNotFoundError on legacy/np/index.html —
                       that commit is the post-change writer. No totals quoted here: a total rots the moment a leg is
                       added, which is the rot this row retired. Red/green re-shown against the pre-change writer via
                       BUILD_INDEX_TOOL (§2 row, MC 11003).
.audits/202610041341-f6053f16/out/
  test_prototypes.py     pytest DoD gate — LIVE (repaired 2026-10-08, owner ruling 1a, re-pointed at
                         projects/salong/prototypes/), 6 tests (249 lines, runs from any cwd, absolute paths):
                         test_brief_and_assets · test_prototypes_exist · test_each_prototype_structure
                         · test_index_page_lists_all_prototypes · test_all_prototypes_served
                         · test_persona_ruling_markers_and_motion
                          (parses <img> srcs via HTMLParser — copy can never fake the photo check;
                          live-HTTP checks target the PORT file)
  DONE.md                ledger — sections A (research) B/C (20 themes + gates)
                         E (JS wave S-01..S-20 + S-R + S-F1..F3) C2 (absence/surfaces) D (open/N/A)
  TEST-verdict-c<N>.md   independent tester verdicts — last line pair:
  DA-verdict-c<N>.md     adversarial (devils-advocate) verdicts   `# JUDGED: <sha>` then `# VERDICT: …`
                         (sha from infra/vm105/dsh/dod_judged_hash.py over this out dir)
  research.md / research-2.md  cited direction research (batches 1–2)
```

Final state of the wave: TEST-verdict-c5 **PASS**, DA-verdict-c4 **SHIP**, both at
JUDGED c802d6b1 — the gate has demonstrated RED runs each cycle (red-proofs recorded in the
verdicts).

## 8. Known exceptions register (file-hygiene and design, all pre-ruled)

1. **Files >400 lines state their reason in the header** (hygiene rule 2026-10-05: >400 requires a
   reason line, not a split). The full >400 list is DERIVED, never copied — and the claim this row
   carried was FALSE by omission (MC 11003 cycle-6 DA F5 + ARCH verdict: the sentence read
   "re-measured with `wc -l` over every tracked text file" while the enumeration below named only the
   salong/portfolio files — exactly the count-rot the doctrine sentence above retires). The instrument,
   as run (binary families are DATA whose byte-"lines" are meaningless and are not prose to split; the
   two privacy trees are never opened, exclusions per their rows):
   `git ls-files | grep -vE '^projects/(skola|wedding)/' | grep -vEi '\.(png|jpe?g|gif|ico|webp|woff2?|pdf|mp4|webm|zip|pyc)$' | xargs wc -l | awk '$1 > 400 && $2 != "total"'`
   — measured fix4; instrument re-run at fix5: 34 files; the list below MINUS five named omissions
   it never carried: `tools/build-index.py` (a few hundred past 400 — re-read its count off the
   instrument, its reason is the header's own line 4), THIS file (reason: its line 3),
   `tools/test_build_index.py` (the instrument's 34th line: the gate's own first module — DA-c7 F5
   caught that this row EXPLAINED it two sentences lower yet never COUNTED it: "four" for a register
   holding five), and the two tracked workflow-explode run-record JSONs
   `projects/portfolio/concepts/workflow-explode/.audits/fix-c6/baseline-red-sweep.json` (9 642) +
   `…/sweep-10329.json` (3 469) — tracked run DATA (§8.7's kind), not source prose: the hygiene walk
   does not class JSON run records as files needing a reason line. Test files are the 600-band
   (coding-discipline's own ceiling; fix4 split the gate at it, §7) and carry no >400 reason either.
   The salong/portfolio enumeration, kept current by the instrument above:
   - **salong — 9 files, every one now reasoned.** Pre-ruled three: `08-organiskt-hantverk/index.html`
     **456** (single-page theme kept whole; fragmenting markup would separate each hand-drawn SVG from
     its copy — ruled 2026-10-05, sha f5b2de9), `17-mork-akademien/css/style.css` (line count DERIVED,
     never copied: re-run `wc -l projects/salong/prototypes/17-mork-akademien/css/style.css` — MC 11003
     cycle-3 DA P2 retired the pinned figure this row used to carry, which read 431 for ten days after
     `aac2bcb` 2026-10-12 grew the file past it; a count this register needs is measured, never
     repeated) (one coherent
     theme dress), `18-bara-typsnitt/js/scroll-motion.js` **470** (word-gap safety clamp must stay
     beside the amplitudes it guards). Six lab-build files gained their header reason in FIX-ARCH-01
     (2026-10-07), each specific to its file, line counts counted after that line landed:
     `23-lab-demo-real/css/styles.css` **713** (one measured
     comp-geometry map — `:root` scaffold boxes and their consumers in the same flow as the
     sections→motion→responsive phase layers), `22-lab-demo-b/css/styles.css` **680** (whole theme
     garment — WCAG-ratio-annotated palette plus REVIEW fixes written at their use-sites inside the
     section blocks), `26-lab-demo-low/css/style.css` **510** (one sjökort measuring system — region
     boxes + closed palette; fonts already split to `fonts.css`), `25-lab-demo-live/css/sektioner.css`
     **453** and `21-lab-demo-a/css/sektioner.css` **447** (the section half of a two-file split —
     six brief sections kept in page order, field transitions depend on rule order), and
     `24-lab-demo-flag/css/chart.css` **418** (the theme's only stylesheet — `@font-face` + measured
     boxes + bands resolve in one cascade). 713/680 also sit above the 600 gate ceiling — flagged to
     the orchestrator; the gate targets files a run *grew*, and these commits grew nothing. The
     251–399 salong hand-authored band carries no ceiling breaches; its size is DERIVED like
     17-mork's count above — the pinned "52 files (re-counted this pass)" was honestly measured on
     2026-10-06 and rotted like the figure that precedent retired: the instrument re-run at fix5
     (same chain, `projects/salong` minus `_assets/`, prose files, 251–399) counts 54, so the number
     and its freshness marker are retired here, leaving the claim the band actually carries.
   - **portfolio — 20 single-file themes, line range DERIVED, never copied: re-run
     `wc -l projects/portfolio/prototypes/*/index.html | sort -n` (the pinned 1111→555 was true where
     it was written and measured 1120→554 — 14-discotermin↔10-telegraf — at fix5; retired per the
     cycle-3 DA P2 rule), reasoned by build shape.** Every portfolio
     theme is a copied single-file build (`index.html` + `SOURCE.md` per dir, from `~/portfolio-designs`
     @ b43cae3); the self-contained monolith IS the MC 10096 build brief — the header states it as an
     intentional exception (e.g. `01-rutorn`). Not all 20 carry that header line; annotating the rest
     is an open portfolio-owner item, deliberately untouched by FIX-ARCH-01 (the ARCH verdict named
     only the six salong lab files).
2. Vendored `_assets/vendor/*.js` are generated/minified — exempt from line hygiene (correctly:
   `wc -l` there is meaningless, ~11 lines of megabytes).
3. Themes 15 + 18 photo-free — by brief, gate-enforced (see §3).
4. Theme 11 IO reveal remnant — P2, queued for next touch (§4 table); cite DONE S-F3.
5. Google Fonts stay CDN — **DECIDED 2026-10-10, owner "rec"**: settled as the standing exception
   (§3), not pending anymore; fonts degrade to fallback stacks offline; non-blocking for LAN demo.
   **Scoped 2026-10-12: does not extend to `projects/wedding/` — see item 8 (offline fonts rule).**
6. Repo-root `out/` stray dir — **REAPPEARED 2026-10-07**: `out/.tmp/t6c5/live2.html` present
   (re-verified 2026-10-08, `ls -la out` + `find out`). The 2026-10-05 rmdir was real; a later child
   ran from the repo root with the relative path `out/.tmp/…` again, and git stayed silent because
   `.gitignore` line 1 matches `out/.tmp/` at any depth. Prevention (owner doctrine 2026-10-08,
   MC 10286): scratch goes to `.tmp/`, never `out/` at the repo root (§2 New-website rule).
   Removal is left to the owning run/owner — not this document's action; `rm -r` is needed (content
   present, `rmdir` no longer suffices).
7. `projects/portfolio/concepts/` + `.audits/202610051009-workflow-explode/` — a different, newer run (MC 10140)
   living legitimately in the same repo; not product surface of MC 10088.
8. **wedding is local-only (owner privacy ruling, 2026-10-12, MC 10510/10511):** wedding content
   is real; the public mirror carries placeholders only; `tools/build-index.py` skips the project
   in ALL modes via the `projects/wedding/LOCAL_ONLY` marker (MC 11003 follow-up corrected this row
   2026-10-22: it used to claim the guard was "mechanical since 0b4e9e2, red/green proven" — but
   0b4e9e2 is NOT an ancestor of this checkout (`git merge-base --is-ancestor 0b4e9e2 HEAD` → rc 1)
   and NO LOCAL_ONLY marker existed anywhere in this lineage until this follow-up armed one on
   disk; the guard CODE was sound, its DATA half absent, and `grep -c LOCAL_ONLY
   tools/test_build_index.py` was 0 — zero coverage). **Protection actually in force:** (a) the
   on-disk marker — `scan()` measured to skip wedding in ALL modes this pass; (b) a tracked gate
   leg — `test_local_only_project_is_skipped_in_every_mode` arms the marker in a fixture and asserts
   the skip, so the code half can no longer rot unnoticed; (c) `.git/hooks/pre-push.local` aborts
   any push whose commits touch `projects/wedding/` (re-proven this pass in a scratch repo); (d) 0
   tracked wedding files. **Why the marker is deliberately UNTRACKED:** making it tracked would
   deadlock the repo's own push path — the (c) hook denies ANY commit touching
   `projects/wedding/`, even a zero-byte marker (measured: push rc=1, control commit rc=0), so a
   tracked marker could never reach origin and would block every later push containing it. The path
   is therefore NAMED-EXACTLY in `.gitignore` (`/projects/wedding/LOCAL_ONLY`, commented on the spot)
   — not a wildcard hiding generated output (the §2 rule above forbids that), but a documented
   machine-local guard state: it stops `git status` nagging and stops a stray `git add` from ever
   recreating the deadlock. The guard is armed by THE FILE ON DISK, not by tracking; caveat stated
   honestly: `git clean -fdX` removes it — re-arm with `touch projects/wedding/LOCAL_ONLY`. **A FRESH
   CLONE IS UN-ARMED** (cycle-2 ARCH item 7): nothing of the marker arrives from origin, so a new
   machine scans — publishes, and serves on :8090 — wedding until a human runs that `touch`; arm it
   BEFORE the first `build-index.py` run on any machine holding the material. The marker also stays
   WHERE IT IS: `projects/<site>/LOCAL_ONLY` is the one contract `scan()` reads, adjacent to the
   directory it guards; moving it under `.tmp/` (cleanable scratch — the same fail-open as
   `git clean -fdX`, only wider) or into a repo-external registry (a second place to keep truth) is
   ruled out. The durable close is the hook exemption named below, not a new location. Whether
   the hook exempts exactly `projects/wedding/LOCAL_ONLY` (then track it) or the marker stays
   machine-local is an OWNER call the MC 11003 follow-up routed; this row describes the protection
   in force, not the protection imagined. `git push` from this checkout stays BANNED while wedding
   is in history, until an owner ruling lifts or scrubs it. The offline-assets rule (self-hosted
   woff2, no Google Fonts CDN) applied to wedding builds — exception-5 never extended to them; the
   row's old pointer to a `projects/wedding/spec.md` was corrected with the §2 row: no spec.md
   exists in this checkout (2472eff likewise names no reachable commit here).
9. **Root-level ignored files — this register IS the allowlist the tidiness check reads (armed
    2026-10-22, MC 11003; the check rewritten to read it in the MC 11003 fix2 pass).** Plain
    `git status --porcelain -uall` sees none of them, because `.gitignore:39` is `/*.png`; the
    instrument that sees them is the ignored-aware command below. **Passing condition, expressible
    today: a root-level ignored file is allowed ONLY if it is named in this register; anything the
    command prints that is not named here is the red case** — a stray a docs run may not move (not its
    own byte) but must name. The command takes git's own exit code instead of piping it away, so a git
    too old for `--ignored=matching` says BLOCKED and never "clean":

    ```bash
    WS=$(git -C "$HOME/Hemsidor" rev-parse --show-toplevel) || exit 1
    TMP=$(mktemp); git -C "$WS" status --porcelain --ignored=matching -uall >"$TMP" \
      || { echo "BLOCKED: git cannot answer the ignored-aware question"; exit 2; }
    LC_ALL=C comm -13 \
      <(awk '/^[[:space:]]*ROOT-STRAY-REGISTER-BEGIN[[:space:]]*$/{f=1;next}
             /^[[:space:]]*ROOT-STRAY-REGISTER-END[[:space:]]*$/{f=0} f' \
          "$WS/docs/ARCHITECTURE.md" | sed 's/^[[:space:]]*//; s/[[:space:]]*$//' | grep -v '^$' | LC_ALL=C sort) \
      <(sed -n 's|^!! \([^/]*\)$|\1|p' "$TMP" | LC_ALL=C sort)
    ```

    `LC_ALL=C` on sort and on `comm` together, because the two must agree on collation or `comm` calls its own
    input unsorted and prints nothing useful (measured under a UTF-8 locale: unsorted-input warnings and every
    name reported). Empty output = GREEN; any line printed = RED, that root file is not this register's. **Test the output, not the exit
    code:** the last command is `comm`, which exits 0 while printing differences (measured — a fixture carrying an
    unregistered stray printed its name and exited 0), so a caller needing a failing exit code wraps it: run the
    `comm` as `OUT=$( … )` then `[ -z "$OUT" ] || { echo "ROOT STRAY: $OUT"; exit 1; }` (the wrapped form is kept in
    this run's `.audits/202610221843-cad8462a/out/.tmp/skill2/wrapped-gate.sh`, green on this tree, red on the
    planted sixteenth). The only exit code that means something as written is the 2 from the BLOCKED branch. The count is
    whatever `grep -c '^!! [^/]*$' "$TMP"` prints — no number is quoted here on purpose: a dated count in
    permanent prose goes stale behind the next reader (the MC 11003 fix2 finding — keep a figure only
    beside the command that prints it). The two marker patterns are anchored to their own whole line on
    purpose: the command block above *mentions* both markers, and an unanchored scan would start at that
    mention and read the command text as register entries (measured in the fix2 fixture, which is why the
    anchors are there).

    ```text
    ROOT-STRAY-REGISTER-BEGIN
    pick-facit-frage-375.png
    picker-index-1440.png
    qa-01-1440.png
    qa-01-375.png
    qa-04-375.png
    qpage.png
    review-home-1440.png
    review-listening-1440.png
    review-listening-375.png
    review-matrix-375.png
    review-question-1440.png
    shot-facit-375.png
    shot-gate-375.png
    shot-tavla-375.png
    shot-vecka-375.png
    ROOT-STRAY-REGISTER-END
    ```

    Classed by attribution (`.audits/202610221843-cad8462a/out/PLACEMENT.md` §3): some are byte-identical
    copies of card images already tracked under `projects/np/prototypes/` (VERIFIED by `cmp` + a
    `sha256sum` join); some belong to runs named in their own records or their cluster (one pair INFERRED
    by prefix + minute, never proven); the `review-*` set and `qpage.png` carry no reference anywhere and
    are unattributable repo history. **None of them may be moved by a docs run** — none is that run's own
    byte, so the append-only rule holds and they all stay where they are; removal is the owning run's or
    the owner's call, the same disposition as item 6, and no `rm` was run here. A name leaves this register
    when its owner removes the file; an entry naming a file that no longer exists is harmless to the check
    (the register can only excuse, never hide) and a later hygiene pass prunes it. The register exists so
    the next reader deletes with proof instead of guessing, and so "the tree is clean" stops being a lie:
    an ignored file is not a tidy file. A run's own screenshots belong in
    `projects/<site>/.audits/<YYYYMMDDHHMM>-<slug>/out/shots/` (§2), not at this root. Root-level ignored
    **dirs** (`.tmp/`, `_site/`, `.impeccable/`, `.dsh/`, `.playwright-mcp/`, `.pytest_cache/`) are
    sanctioned by rule and are not this check's object; `out/` at the repo root is neither sanctioned nor
    ignored, so it shows as `??` (§8.6).
    **Which mechanism owns which placement case** (said once, so no later pass restates it twice in two
    strengths): a *generated* root page is owned by `build_root()`'s `--host-surface` refusal plus the
    prune legs pinned in `tools/test_build_index.py` (the renamed-project leg, the deleted-project leg, the
    `LOCAL_ONLY` leg); a *write about to happen* is owned by the prose placement guard in the
    `workflow-webdesign` skill §1; a *root-level ignored file already sitting here* is owned by this
    register and the command above.

## 9. Data & dependency picture

- **Data stores: none.** Content is hard-coded Swedish copy duplicated per projects/salong/spec.md by design
  (20 independent themes; duplication IS the product — not a DRY violation to "fix").
- **Deps: two vendored files** (GSAP + ScrollTrigger 3.12.7, standard license) + Google Fonts
  CDN links (exception E3). No build, no transpile, no bundler, no test runner beyond pytest.
- **Consumers of the motion mechanism: only the 20 `index.html`** via
  `<script defer src="../_assets/vendor/…">` + their one motion file. Adding a theme = copy the
  anatomy of §3 + one motion file honouring §4 + gallery card; the gallery bijection and
  image-honesty invariants (§3) must keep holding (enforced by the live pytest gate — see §1).

## 10. Public hosting (vm106) — LIVE (two-level, BROWSE-V2)

MC 10088's hosting run (`.audits/20261006-1412-vm106-hosting/`) published this repo to the vm106
reconciler as the static app **`webdesign`**: strict-JSON **`hosting.yaml` committed at the repo
root @ 8336bd4** (`name: webdesign`, `type: static`, `root: apps/webdesign`, PI-free description —
under bryn1's strict owner policy only a root hosting.yaml makes the repo a web app at all). The
reconciler's own bar validator was re-run against this checkout when this section was last
de-staled: `validate-hosting.py` exit 0, all 7 checks PASS (hosting.yaml-present · is-web-app ·
strict-JSON parse · name · type · root · static-entrypoint).

**State as measured: TWO-LEVEL PUBLIC.** The two-level layout (dd328b8: root = project cards only +
`salong/` + `portfolio/` pages, per the owner's ruling "Webdesign/`<project>`, not everything on one
page", MC 10088.12) was pushed with 797d196 + 172fd50 and published by the reconciler tick
2026-10-07T09:18Z (gate[ok] product-path 200 2706B vs the repo-owned 1200B floor; public flip
observed 09:20Z: root 2706B two-card page, /webdesign/salong/ 200). Acceptance of the prior
single-level era: TEST-verdict-live.md (PASS); this state's own acceptance is fanned and lands as
TEST-verdict-live-v3.md — until that verdict exists, treat the two-level public state as
parent-probed (root/salong/ bytes + codes), not yet fully accepted. One gate-rule
change was required and is fleet canon now: the reconciler's entry-page size floor (half of the
live page) can never pass an intentional >50% shrink, so staging.py gained `min_bytes_mode: "own"`
(own ruling recorded in agent-town master edf19b1b; this repo declares the floor at 1200B). The
mirror's `include` is `/index.html` + `/salong/*.html` + `/portfolio/*.html`
+ `projects/**` html/css/js/fonts
/images + `thumbs/**` + `/favicon.*`; its `exclude` drops `**/*.md`, `docs/**`, `tools/**`,
`_site/**` and the dot-dirs — no markdown, docs, tooling or generated browse site ever reach the
public mirror, which is exactly why the public browse surface is the REAL committed two-level
surface: root `index.html` (project cards only, per the owner's BROWSE-V2 ruling MC 10088.12 —
"Webdesign/`<project>`, not everything on one page") + the `salong/` + `portfolio/` pages +
`thumbs/` + `favicon.ico` (`_site/` stays gitignored per owner ruling
MC 10062.30.1). :8090 (LAN, §6) and the public mirror now serve the same product at two stages —
:8090 remains the LAN demo, the public URL is the public demo surface.
**Open owner call named by the MC 11003 follow-up (DA P1-C, §2 root-`index.html` row):** the tracked
root page's cards link `np/`, `wedding/` and `skola/`, and the fleet's own matcher
(`mirror.match_globs` over `hosting.yaml`) answers `served=False` for all three — the committed
surface and the served set describe different products at those paths. Widen the include or narrow
the card set: that is a repo-vs-served OWNER decision, deliberately not committed in either
direction by this doc pass.
