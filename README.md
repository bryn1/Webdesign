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
tools/build-index.py         generates _site/ (the browse site) — stdlib Python, no model call
tools/check-links.py         crawls the served site; every local reference must answer 200
docs/ARCHITECTURE.md         how the repo and the server fit together
```

Projects today: **salong** (Jane Cooper, frisör — 20 themes, the live PoC snapshot, 6 impeccable lab
builds) and **portfolio** (20 portfolio design themes + the workflow-explode concept).

## Add a website (new project) — do this FIRST

When you create a new website: first create `projects/<website>/` (lowercase-kebab, one website =
one folder) BEFORE writing any file. Inside it: `spec.md` (content canon) + `prototypes/<NN-name>/`
(one prototype = one folder with its own `index.html` — a prototype never lives outside its site's
folder). Do NOT: leave loose site dirs at the repo root, put a second website inside another site's
folder, or scratch outside `.tmp/` (never `out/` at the repo root). Then run
`python3 tools/build-index.py --thumbs` so the browse site picks the new project up.
Exception: the generated public browse pages — root `index.html`, `<project>/index.html`,
`thumbs/**` — written by `tools/build-index.py --root` and mirrored (docs/ARCHITECTURE.md §2
table, §10) are the public surface, not loose site dirs.

## Add a prototype

1. Put the finished site in `projects/<project>/prototypes/<NN-name>/` (its own `index.html`;
   relative asset paths only). If it was copied from somewhere, add a `SOURCE.md`
   (a `- Label: ...` line shows on its card).
2. `python3 tools/build-index.py --thumbs` (makes the pages and any missing thumbnails).
3. `python3 tools/check-links.py http://127.0.0.1:8090/` must end with 0 broken.

Only the final site and its images are committed. Run records (`.audits/`), impeccable state
(`.impeccable/`), screenshots, thumbnails, `node_modules/` and `_site/` stay on disk, untracked.
