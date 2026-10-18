# T8 / MC 10088.8 HOSTING-01 — result report (infra)

BUILD committed: **8336bd4** on main (bryn1/Webdesign @ /home/claudecode/Hemsidor), 52 files,
paths: hosting.yaml, index.html, favicon.ico, thumbs/** (48 png), tools/build-index.py. Not pushed.
Rollback: `git revert 8336bd4` (pure additive surface + tool extension; hosting.yaml removal returns
the repo to SKIP-NOT-WEBAPP — the reconciler simply stops hosting it; nothing external was edited).

## Contract re-derived from reconciler source this session (SPEC line refs not trusted)
- TYPES = ("static","service") — reconcile.py:301.
- Static root index.html judged ALWAYS (shadow rule block ~1189-1201; build_health asserts existence
  + git-blob parity ~1326-1342; prefix_safety forbids bare "/..." asset refs — root page is all-relative).
- hosting.yaml strict-JSON root file IS the web-app gate for bryn1 — owner_policy.py:86
  (RECONCILE_REQUIRE_HOSTING_YAML_FOR); reconcile.py:639 parses it with json.loads (strict).
- mirror.py: repo `include`/`source` REPLACE defaults (:174,176), `exclude`/`preserve` EXTEND
  (:182-185); static = include-allowlist AND not-exclude (:206-226); `!` last-wins (:145-152);
  no-"/" glob = basename any depth, "/..." root-anchored, `**` crosses dirs (:107-143).

## Validator (reconciler's own validate-hosting.py) — exit 0 at 8336bd4
Output: .tmp/t8/validate_output.txt (VERDICT: PASS, all 7 checks PASS).

## Top-level entry table (every tracked root entry: served-by-design or excluded)
| root entry | fate | by |
|---|---|---|
| projects/ (299 files) | SERVED (267 of them) | include projects/**/*.html|css|js|woff2|jpeg|jpg|png|svg|webp |
| projects/**\/*.md (32) | dropped | exclude `**/*.md` |
| index.html (root, NEW) | SERVED | include `/index.html` |
| thumbs/ (48 png, NEW) | SERVED | include `thumbs/**` |
| favicon.ico (NEW, PIL-generated) | SERVED | include `/favicon.*` |
| README.md | dropped | `**/*.md` |
| docs/ | dropped | `docs/**` + `**/*.md` |
| tools/ (3 .py) | dropped | `tools/**` |
| PORT | dropped | `/PORT` exclude (+ not in include) |
| .gitignore | dropped | `.git*` exclude (+ not in include) |
| hosting.yaml | dropped | not in include (static defaults don't carry it) — proven in dry run |
| _site/, .audits/, .tmp/, .dsh/, .impeccable/, .git* | dropped (untracked anyway; excludes are belt-and-braces for walk-repo safety) | exclude |

## Mirror dry-run (dryrun_mirror.py parses the REAL committed hosting.yaml; tree copy 357 files)
Output: `.tmp/t8/dryrun_output.txt` (full SERVED+DROPPED enumeration) + `banned_sweep.txt` + `served_list.txt`.
**served=317 source=0 dropped=40.** UNINTENDED (outside projects/, index.html, thumbs/, favicon): NONE.
- (a) `projects/salong/prototypes/01-mork-guld/index.html` SERVED — PASS
- (b) `projects/salong/prototypes/_assets/vendor/gsap.min.js` SERVED (root-anchored glob crosses the nested `_assets/vendor`) — PASS
- (c) grep of served set: no `.md`, `tools/`, `docs/`, `_site/`, `.audits/`, `.git*`, `PORT`, `hosting.yaml` → **NONE** (script line "(c) ... served (must be NONE): NONE")

## Banned-token sweep (served set only, grep -niE 'anny|mullers|morin|072-155|landbrogatan|karlskrona|tross|dinsalong|gmail')
anny 0 · mullers 0 · morin 0 · 072-155 0 · landbrogatan 0 · tross 0 · dinsalong 0 · **gmail 3 false-substring** · **karlskrona 73 = known owner-approved portfolio persona residue** ("Alexander Lektove · Karlskrona", R2.1 leaves portfolio persona). The 3 "gmail" hits are the CSS class `.bigmail` in projects/portfolio/prototypes/15-klistermarken (mailto is alexander@sibbamala.com) — zero real Gmail addresses. All 76 sweep lines are inside projects/portfolio/**. Binary scan of served images/fonts: NONE.

## Toolchain
- tools/build-index.py EXTENDED (no second generator): `--root` writes repo-root index.html (Swedish,
  all-relative hrefs to projects/.../ + thumbs/ + favicon.ico only; href grep to .md|tools/|docs/ = 0)
  + committed thumbs/ (screenshot.mjs, 48/48 rc=0). File now 281 lines (<400). _site behavior intact.
- _site regenerated; tools/check-links.py http://127.0.0.1:8090/ → 51 pages, 0 broken, all forbidden 404, exit 0.

## Notes for orchestrator
- FOREIGN uncommitted changes in the shared checkout (not mine, left alone): docs/ARCHITECTURE.md rewrite
  + 6 lab-demo css "reason (>400 rader, FIX-ARCH-01 2026-10-07)" header comments — a parallel FIX-ARCH-01 pass in flight.
- description in hosting.yaml is PI-free per R2.6/F2 (no persona name; generic "en frisörssajt").
