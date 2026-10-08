# ARCHITECTURE — Hemsidor scroll-design prototype library

Exceeds the 250-line doc convention because §4's deviation table and §8's pre-ruled exception
register are DoD-gate inputs and must not be split from the facts they qualify.

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
> was written for the old `prototypes/` path and is history, not a live gate. See README.md.

## 1. Shape in one line

Multi-project static tree — `projects/<project>/{prototypes,concepts}/` of self-contained builds
(salong: 20 gallery themes + the live-PoC snapshot 00 + 6 lab builds 21–26 + shared `_assets/`;
portfolio: 20 single-file themes + the workflow-explode concept) — where what is served read-only by
`python3 -m http.server` on :8090 is the GENERATED browse site `_site/` (`tools/build-index.py`), not
the repo root (so `.git`/`.audits` are unreachable — both probe 404, measured this pass); content canon
for salong in `projects/salong/spec.md`; the DoD record is the verdict files under
`.audits/<run>/out/` (on disk, untracked) — the pytest file under `.audits/202610041341-*/out/` is
history, not a live gate (per the v3 note above).

## 2. Repo layout (as it actually is)

**New-website rule (owner ruling 2026-10-08, MC 10286).** A new website is its own subworkspace:
create `projects/<website>/` FIRST (lowercase-kebab, one website = one folder, created before any
file is written), with `spec.md` + `prototypes/<NN-name>/`; prototypes live only under their site's
folder. No loose site dirs at the repo root; no second website inside another site's folder.
Scratch goes to `.tmp/` — never `out/` at the repo root (see §8.6 for why that recurs).
Exception: the generated public browse pages — root `index.html`, `<project>/index.html`,
`thumbs/**` — written by `tools/build-index.py --root` and mirrored (§2 table, §10) are the
public surface, not loose site dirs.

| Path | Role |
|---|---|
| `projects/salong/spec.md` | Content canon — every theme's Swedish copy/section contract (single source). |
| `PORT` | Demo port, committed: `8090`. Gate + keepalive read it. |
| `projects/salong/prototypes/` | The product. 20 theme dirs + `_assets/` + gallery `index.html`. |
| `tools/build-index.py` | The browse-site generator (stdlib only, deterministic): scans `projects/<project>/{prototypes,concepts}/<name>/index.html` and writes `_site/` — a root page with one card per project, one page per project (title from `<title>`, thumbnail, link), and relative symlinks `prototypes`/`concepts` pointing back into `projects/` so relative assets resolve. With `--root` it ALSO writes the TRACKED public surface for the vm106 mirror (root `index.html` + the two committed `<project>/index.html` pages — one shared per-project page writer serves both `_site` and the root mode — + `thumbs/**`, thumbnails made as needed; tracked, not gitignored). Run after adding a build (with `--root` when the public surface must follow). |
| `tools/check-links.py` | HTTP crawler for the served site: follows every same-host page and requests every local reference (a/link/script/img/srcset, inline+file CSS `url()`/`@import`, JS asset strings); external refs are counted, not fetched; asserts forbidden paths (`/.git/`, `/.audits/`, …) answer 404. Exit 0 = zero broken. |
| `tools/gen-placeholders.py` | The deterministic placeholder-art generator (SEED 20261006): redraws its 17 tracked image targets as abstract paper/ink/clay color washes — no faces, no text, no recognizable objects — opening each existing file first so every replacement keeps that file's exact pixel size and format (owner ruling R2, §5). |
| `_site/` | Generated browse site — gitignored, regenerated, never hand-edited. This is what :8090 actually serves (the keepalive starts `http.server --directory …/_site`); its per-project `prototypes`/`concepts` entries are symlinks into `projects/`. |
| `index.html` (repo root) | The public root browse page — project cards ONLY (count + cover thumb, BROWSE-V2 owner ruling MC 10088.12), linking RELATIVE to `<project>/` (never `.md`/`tools/`/`docs/`); generated by `tools/build-index.py --root`, mirror-served, and the static entrypoint the hosting bar validator judges ALWAYS (§10). |
| `salong/index.html` | The public salong browse page — 27 prototype cards with thumbs, nav-back `../`, links into `../projects/salong/…`; generated by `tools/build-index.py --root`, mirror-served via the `/salong/**` include. |
| `portfolio/index.html` | The public portfolio browse page — 20 prototype + 1 concept (`workflow-explode`) cards with thumbs, same link/nav-back shape; generated by `tools/build-index.py --root`, mirror-served via the `/portfolio/**` include. |
| `thumbs/**` | The 48 committed card thumbnails (`thumbs/<project>/<kind>-<name>.png`, naming as `_site/thumbs`), generated by `--root`, mirror-served; the card images on the root index. |
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

## 3. Theme anatomy — `projects/salong/prototypes/<NN>-<name>/`

Every theme dir has exactly three parts (bijection: 20 dirs ↔ 20 gallery cards, gate-enforced):

```
NN-name/
  index.html      one full page; 6 mandatory section ids: top om tjanster galleri boka kontakt
  css/            2–4 files (typical split: tokens + layout/base + components/sections [+ scroll/motion])
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
- External requests: Google Fonts CDN only (accepted exception, DONE E3 — BLOCKED pending an
  owner vendoring ruling). Zero other non-font https refs (grep re-run this pass: only an
  instagram.com content link).

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
```

No server code lives in the repo — the only runtime is the stdlib static server.
(The :8092 concepts server + `concept-server-keepalive.sh` belong to the separate
workflow-explode run, MC 10140 — not this product.)

## 7. Gate harness + verdict convention

```
.audits/202610041341-f6053f16/out/
  test_prototypes.py     pytest DoD gate, 5 tests (190 lines, runs from any cwd, absolute paths):
                         test_brief_and_assets · test_prototypes_exist · test_each_prototype_structure
                         · test_index_page_lists_all_prototypes · test_all_prototypes_served
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
   reason line, not a split). The full >400 list was re-measured with `wc -l` over every tracked
   text file this pass:
   - **salong — 9 files, every one now reasoned.** Pre-ruled three: `08-organiskt-hantverk/index.html`
     **456** (single-page theme kept whole; fragmenting markup would separate each hand-drawn SVG from
     its copy — ruled 2026-10-05, sha f5b2de9), `17-mork-akademien/css/style.css` **414** (one coherent
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
     the orchestrator; the gate targets files a run *grew*, and these commits grew nothing. The 52-file
     251–399 salong hand-authored band (re-counted this pass) carries no ceiling breaches.
   - **portfolio — 20 single-file themes (1111→555 lines), reasoned by build shape.** Every portfolio
     theme is a copied single-file build (`index.html` + `SOURCE.md` per dir, from `~/portfolio-designs`
     @ b43cae3); the self-contained monolith IS the MC 10096 build brief — the header states it as an
     intentional exception (e.g. `01-rutorn`). Not all 20 carry that header line; annotating the rest
     is an open portfolio-owner item, deliberately untouched by FIX-ARCH-01 (the ARCH verdict named
     only the six salong lab files).
2. Vendored `_assets/vendor/*.js` are generated/minified — exempt from line hygiene (correctly:
   `wc -l` there is meaningless, ~11 lines of megabytes).
3. Themes 15 + 18 photo-free — by brief, gate-enforced (see §3).
4. Theme 11 IO reveal remnant — P2, queued for next touch (§4 table); cite DONE S-F3.
5. Google Fonts stay CDN — owner decision pending (DONE E3, BLOCKED); fonts degrade to fallback
   stacks offline; non-blocking for LAN demo.
6. Repo-root `out/` stray dir — **REAPPEARED 2026-10-07**: `out/.tmp/t6c5/live2.html` present
   (re-verified 2026-10-08, `ls -la out` + `find out`). The 2026-10-05 rmdir was real; a later child
   ran from the repo root with the relative path `out/.tmp/…` again, and git stayed silent because
   `.gitignore` line 1 matches `out/.tmp/` at any depth. Prevention (owner doctrine 2026-10-08,
   MC 10286): scratch goes to `.tmp/`, never `out/` at the repo root (§2 New-website rule).
   Removal is left to the owning run/owner — not this document's action; `rm -r` is needed (content
   present, `rmdir` no longer suffices).
7. `projects/portfolio/concepts/` + `.audits/202610051009-workflow-explode/` — a different, newer run (MC 10140)
   living legitimately in the same repo; not product surface of MC 10088.

## 9. Data & dependency picture

- **Data stores: none.** Content is hard-coded Swedish copy duplicated per projects/salong/spec.md by design
  (20 independent themes; duplication IS the product — not a DRY violation to "fix").
- **Deps: two vendored files** (GSAP + ScrollTrigger 3.12.7, standard license) + Google Fonts
  CDN links (exception E3). No build, no transpile, no bundler, no test runner beyond pytest.
- **Consumers of the motion mechanism: only the 20 `index.html`** via
  `<script defer src="../_assets/vendor/…">` + their one motion file. Adding a theme = copy the
  anatomy of §3 + one motion file honouring §4 + gallery card; the gallery bijection and
  image-honesty invariants (§3) must keep holding (historically pytest-enforced — see §1).

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
