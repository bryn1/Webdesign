# Webdesign — every frontend prototype, by project

Browse them on the home network: **http://192.168.5.231:8090/**
(one card per project, then one page per project with a thumbnail and a link per prototype).

## Layout

```
projects/<project>/
  spec.md                    what the prototypes are built from (content canon / brief)
  prototypes/<NN-name>/      one prototype = one folder with its own index.html
  prototypes/_assets/        shared images + vendored scripts (salong only; themes use ../_assets/)
  concepts/<name>/           concept mocks (optional)
  <entry>/SOURCE.md          for copied prototypes: origin path, repo, commit, date
  .tmp/                      this project's scratch (layout v2's `.tmp/`, one level down)
  .audits/<YYYYMMDDHHMM>-<slug>/out/   this project's run records — its verdicts and evidence;
                             out/shots/ = the screenshots and records that run took
tools/build-index.py         generates _site/ (the browse site) — stdlib Python, no model call
tools/check-links.py         crawls the served site; every local reference must answer 200
docs/ARCHITECTURE.md         how the repo and the server fit together
```

Both `.audits/` names are the SAME layout at two depths, chosen by what a run touches: a run whose
object is the **repo** (docs, tools, the browse surface) logs at the root `.audits/`; a run whose
object is **one project** logs inside `projects/<site>/.audits/`. Layout v2 applied one level down —
not a second convention. Neither is a loose file at the root: the unanchored `.tmp/` and `.audits/`
rules hide them at any depth (`git check-ignore -v projects/np/.tmp/x`), which is exactly why
"ignored" must not be read as "tidy" — see the Do-NOT rule below.

Projects today: **salong** (Jane Cooper, frisör — 20 themes, the live PoC snapshot, 6 impeccable lab
builds), **portfolio** (20 portfolio design themes + the workflow-explode concept), **np** (4 np
prototypes — `projects/np/` is doctrine: owner ruling MC 11003, "doctrine is /projects/np"), **skola**
(4 Operate-mode prototypes for bryn1/skola) and **wedding** (real content, LOCAL-ONLY — its
`projects/wedding/LOCAL_ONLY` marker is armed on disk; §8.8 of docs/ARCHITECTURE.md states the
protection in force). One row per project in docs/ARCHITECTURE.md §2.

## Add a website (new project) — do this FIRST

When you create a new website: first create `projects/<website>/` (lowercase-kebab, one website =
one folder) BEFORE writing any file. Inside it: `spec.md` (content canon) + `prototypes/<NN-name>/`
(one prototype = one folder with its own `index.html` — a prototype never lives outside its site's
folder). Do NOT: leave loose files or site dirs at the repo root, put a second website inside another
site's folder, or scratch outside `.tmp/` (never `out/` at the repo root). An ignored file is not a
tidy file — `.gitignore` hides a stray from `git status`, not from the workspace — so a run checks the
ignored paths too (`git status --porcelain --ignored=matching -uall | grep '^!! [^/]*$'`) and keeps
every artifact it made under its own project's dir, never at the root. Then run
`python3 tools/build-index.py --thumbs` so the browse site picks the new project up.
Exception: the generated public browse pages — root `index.html`, `<project>/index.html`,
`thumbs/**` — written ONLY on the explicit `tools/build-index.py --host-surface` opt-in and mirrored
(docs/ARCHITECTURE.md §2 table, §10) are the public surface, not loose site dirs. They are a generated
MIRROR of `projects/<site>/`, never a source — `projects/<site>/` is canon (owner ruling MC 11003,
2026-10-22: "doctrine is /projects/np"), and `--root` is retired (it writes no root `<site>/` surface —
the ordinary `_site/` build of that same run still runs — and EXITS 2, so a script or cron cannot read a
retired flag as success; any other token is refused the same way, including a bare positional like
`build-index.py host-surface`. `--host-surface --root` together still write the mirror and THEN exit 2:
the code means "that flag is gone", never "nothing was written"). Every page `--host-surface` writes
must be committable by a plain `git add` — no ignore rule
hides it (MC 11003 follow-up), and a `<site>/` page whose project is deleted or carries a
`LOCAL_ONLY` marker is pruned by the next `--host-surface` run. **Edit the `<title>` of one of those
generated pages by hand and you have opted that page out of the prune**: the writer only deletes a page
carrying both halves of its own signature (the `← Alla projekt` nav mark and its own `<title>`), so an
edited page stays public and every later publish says so on stderr (`KEPT, review <site>/index.html …`)
instead of removing it — re-publish it with `--host-surface`, or delete it yourself
(MC 11003 cycle-3 DA P1; docs/ARCHITECTURE.md §2).

## Add a prototype

1. Put the finished site in `projects/<project>/prototypes/<NN-name>/` (its own `index.html`;
   relative asset paths only). If it was copied from somewhere, add a `SOURCE.md`
   (a `- Label: ...` line shows on its card).
2. `python3 tools/build-index.py --thumbs` (makes the pages and any missing thumbnails).
3. `python3 tools/check-links.py http://127.0.0.1:8090/` must end with 0 broken.

Only the final site and its images are committed. Run records (`.audits/`), impeccable state
(`.impeccable/`), screenshots, loose thumbnails, `node_modules/` and `_site/` stay on disk, untracked
— the committed card thumbnails under `thumbs/` are the named exception: tracked product (docs/
ARCHITECTURE.md §2).
