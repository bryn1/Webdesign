# Webdesign — every frontend prototype, by project

Browse them on the home network: **http://192.168.5.231:8090/**
(one card per project, then one page per project with a thumbnail and a link per prototype).

## Layout

```
projects/<project>/
  spec.md                    what the prototypes are built from (content canon / brief)
  prototypes/<NN-name>/      one prototype = one folder with its own index.html
  prototypes/_assets/        shared images + vendored scripts (anny only; themes use ../_assets/)
  concepts/<name>/           concept mocks (optional)
  <entry>/SOURCE.md          for copied prototypes: origin path, repo, commit, date
tools/build-index.py         generates _site/ (the browse site) — stdlib Python, no model call
tools/check-links.py         crawls the served site; every local reference must answer 200
docs/ARCHITECTURE.md         how the repo and the server fit together
```

Projects today: **anny** (Anny Morin, frisör — 20 themes, the live PoC snapshot, 6 impeccable lab
builds) and **portfolio** (20 portfolio design themes + the workflow-explode concept).

## Add a prototype

1. Put the finished site in `projects/<project>/prototypes/<NN-name>/` (its own `index.html`;
   relative asset paths only). If it was copied from somewhere, add a `SOURCE.md`
   (a `- Label: ...` line shows on its card).
2. `python3 tools/build-index.py --thumbs` (makes the pages and any missing thumbnails).
3. `python3 tools/check-links.py http://127.0.0.1:8090/` must end with 0 broken.

Only the final site and its images are committed. Run records (`.audits/`), impeccable state
(`.impeccable/`), screenshots, thumbnails, `node_modules/` and `_site/` stay on disk, untracked.
