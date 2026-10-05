# ARCHITECTURE — Hemsidor scroll-design prototype library

Repo: `/home/claudecode/Hemsidor` (GitHub `bryn1/Webdesign`, main). Project intent: **PoC-demo** —
20 competing scroll-design themes for one real hairdresser site (Anny Morin, Karlskrona), pitched
to the owner; LAN demo only, no production claims. This file is derived from the actual tree
(`wc -l`, `ls`, greps, live probe, cron read) on 2026-10-05 by the design profile (MC 10088,
ARCH phase). It supersedes the 2026-10-04 "arch N/A" ruling (DONE.md E1) — the JS enhancement
wave (owner rulings 2026-10-05) made the shared motion mechanism large enough to document.

## 1. Shape in one line

Static tree of 20 self-contained theme dirs + one shared `_assets/` + a gallery index, served
read-only by `python3 -m http.server` on :8090; content canon in `BRIEF.md`; the DoD gate is a
pytest file plus verdict files under `.audits/<run>/out/`.

## 2. Repo layout (as it actually is)

| Path | Role |
|---|---|
| `BRIEF.md` | Content canon — every theme's Swedish copy/section contract (single source). |
| `PORT` | Demo port, committed: `8090`. Gate + keepalive read it. |
| `prototypes/` | The product. 20 theme dirs + `_assets/` + gallery `index.html`. |
| `.audits/202610041341-f6053f16/out/` | This run's ledger (`DONE.md`), gate (`test_prototypes.py`), verdict files, research. |
| `.audits/202610051009-workflow-explode/` | A SEPARATE, unrelated run (MC 10140, a new-concept design phase). In-flight, untracked. Not part of the product. |
| `concepts/workflow-explode/` | That run's build target (served on :8092 by its own keepalive). Empty placeholder at this writing; not the product. |
| `docs/ARCHITECTURE.md` | This file (layout-v2 path). |
| `.tmp/`, `.playwright-mcp/`, `.pytest_cache/` | Git-ignored scratch (probe payloads, browser logs). |

No build system, no package.json, no node_modules, no backend, no database, no API surface
(DONE.md N2). Entry points: `prototypes/index.html` (gallery) and `prototypes/<NN>-<name>/index.html`
per theme.

## 3. Theme anatomy — `prototypes/<NN>-<name>/`

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
- `<img>` srcs point at `../_assets/` — 18 themes embed the 4 real photos + the portrait;
  themes **15** and **18 are photo-free by brief** and must state it *inside* `#galleri`
  (gate checks parsed img-srcs and the in-section statement, not prose).
- The six section ids are identical across themes on purpose — themes are drop-in swappable.
- External requests: Google Fonts CDN only (accepted exception, DONE E3 — BLOCKED pending an
  owner vendoring ruling). Zero other non-font https refs (grep re-run this pass: only an
  instagram.com content link).

## 4. The motion standard (owner ruling 2026-10-05, DONE.md §E)

ONE mechanism, ONE file per theme: **vendored GSAP v3.12.7 + ScrollTrigger** from
`prototypes/_assets/vendor/` (banner-verified 3.12.7, committed @ c4e0f4e). No runtime CDN for
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

Convention added by the density wave (ARCH c2 P3-3): convergent drifts tween **±A→0**, never
±A→∓A — alternating full-amplitude tweens leave grids/rows visibly misaligned at rest (invisible
mid-scrub, obvious when the reader stops). Held repo-wide after DENSITY-FIX-01; new motion must
follow it. Wide x-drifts sit behind a `min-width` matchMedia block so 375px keeps 0 overflow.

Every one of the 20 themes has exactly **one** file that registers ScrollTrigger triggers (grep
this pass: 20 files, 5–12 registration sites each; 02/15's IO uses are non-GSAP helpers, 11's is
the accepted remnant).

## 5. Shared assets — `prototypes/_assets/`

```
_assets/
  vendor/gsap.min.js            GSAP 3.12.7, vendored (no CDN at runtime)
  vendor/ScrollTrigger.min.js   ScrollTrigger 3.12.7
  gal-01.jpeg … gal-04.jpeg     the owner's 4 real photos (only real photos in existence)
  anny-portrait.jpg             real portrait (1656×2208), provenance: ATTRIBUTION.md below
```

Portrait provenance (`anny-portrait.ATTRIBUTION.md`, committed @ 1ef4e9e): owner-delivered —
fetched 2026-10-05 on his explicit ask from her public Instagram post (`mullers.anny`); Anny
owns the image; before a real site: request original file + formal OK. All 18 portrait-bearing
themes reference the SAME file — swap once, applies everywhere. Themes 15/18 stay photo-free by
concept (ruled). Other gallery slots without a real photo show honest "Bild kommer" frames
(DONE L1 — PoC reality, not a bug).

## 6. Serve topology

```
[repo prototypes/] --(serve, read-only)--> python3 -m http.server 8090 --bind 0.0.0.0
                                              --directory /home/claudecode/Hemsidor/prototypes
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

1. **`08-organiskt-hantverk/index.html` = 456 lines** — the only repo file >400. Header reason
   inside the file (ruled 2026-10-05, sha f5b2de9): single-page theme kept whole; CSS/JS already
   split; fragmenting markup would separate each hand-drawn SVG from its copy. Files >400 lines
   with header reason lines (density-wave growth, ruled 2026-10-05 ARCH P3-1 re-pin):
   `17-mork-akademien/css/style.css` **414** (one coherent theme dress) and
   `18-bara-typsnitt/js/scroll-motion.js` **470** (word-gap safety clamp must stay beside the
   amplitudes it guards). The ~35-file 251–399 hand-authored band carries no hard-ceiling
   breaches. Every >400 file states its reason in the header. Ceiling rule holds.
2. Vendored `_assets/vendor/*.js` are generated/minified — exempt from line hygiene (correctly:
   `wc -l` there is meaningless, ~11 lines of megabytes).
3. Themes 15 + 18 photo-free — by brief, gate-enforced (see §3).
4. Theme 11 IO reveal remnant — P2, queued for next touch (§4 table); cite DONE S-F3.
5. Google Fonts stay CDN — owner decision pending (DONE E3, BLOCKED); fonts degrade to fallback
   stacks offline; non-blocking for LAN demo.
6. ~~Repo-root `out/` stray dir~~ — **RESOLVED 2026-10-05**: an empty scratch leftover (only an
   empty `.tmp/`, git-invisible) left when a test child ran from the repo root with the relative
   path `out/.tmp/…`; removed via `rmdir` after file-count 0 was confirmed. The only out dir is
   `.audits/<run>/out/`. Verified absent this session (`ls -d .../out` → No such file).
7. `concepts/` + `.audits/202610051009-workflow-explode/` — a different, newer run (MC 10140)
   living legitimately in the same repo; not product surface of MC 10088.

## 9. Data & dependency picture

- **Data stores: none.** Content is hard-coded Swedish copy duplicated per BRIEF.md by design
  (20 independent themes; duplication IS the product — not a DRY violation to "fix").
- **Deps: two vendored files** (GSAP + ScrollTrigger 3.12.7, standard license) + Google Fonts
  CDN links (exception E3). No build, no transpile, no bundler, no test runner beyond pytest.
- **Consumers of the motion mechanism: only the 20 `index.html`** via
  `<script defer src="../_assets/vendor/…">` + their one motion file. Adding a theme = copy the
  anatomy of §3 + one motion file honouring §4 + gallery card; the pytest gate goes RED until the
  bijection and photo-honesty hold.
