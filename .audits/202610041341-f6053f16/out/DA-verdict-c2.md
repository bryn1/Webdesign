# DA-verdict-c2 — adversarial gate over the FINAL 20-theme deliverable

Verdict file for MC 10088. Judged: `prototypes/` (20 themes + index + `_assets`), binding spec `BRIEF.md`,
gate `out/test_prototypes.py`, live server `http://192.168.5.231:8090/`. All probes run by me this
session; scratch under `out/.tmp/da-c2/`. Read-only over the deliverable — no product file touched.

**Baseline (my own runs):** `python3 -m pytest out/test_prototypes.py -v` → **5 passed**; live root HTTP 200.

---

## FINDINGS (priority + evidence)

### F1 · P1 — Theme 18 renders stray garbage text `A'>` at top-left of EVERY page view (1280 AND 375)
Root cause: `prototypes/18-bara-typsnitt/index.html:14` — the data-URI favicon is single-quoted
(`href='…'`) but the SVG inside contains `font-family="Impact,'Arial Narrow',sans-serif"` — the inner `'`
closes the attribute early and the parser leaks the rest (`A`, `</text></svg>`, `'`) as a **visible text
node at the start of `<body>`**.

Evidence (my `out/.tmp/da-c2/stray_probe.mjs`, headless Chromium, all 20 themes):
```text
01..17: stray_nodes=0 visible=none
18-bara-typsnitt: stray_nodes=1 visible="A'>"
19,20: stray_nodes=0 visible=none
```
Visible in my own screenshots `out/.tmp/da-c2/18-bara-typsnitt-shots/shot-1280.png` and
`shot-375.png` (white junk glyph at the very corner). The orchestrator's sweep for theme 18 reports
`"verdict": "clean"` — the mechanical tooling cannot see painted garbage, and no one eyeballed the
shot. The correct pattern exists in the repo itself: `prototypes/index.html:7` uses double-quoted href
with single quotes inside and leaks nothing (probe: `[]`).
**Fix:** requote the favicon attribute (1 line). Until fixed, every customer who opens theme 18 sees a
broken corner on the hero.

### F2 · P2 — The weakened gallery check (654fec2) is now COMPLETELY vacuous — mutation-proven
`"bild kommer"` is the BRIEF-mandated **portrait** placeholder (`Porträtt — bild kommer` in Om mig,
every theme) — grep count ≥1 in all 20 themes; 15/18 have exactly 1, the portrait caption itself
(`15/…index.html:211`, `18/…index.html:92`). So `"gal-0" in html or "bild kommer" in low` is
**unfalsifiable for any spec-conforming theme**. The commit's justification ("BRIEF requires Bild
kommer for shots Anny has not delivered" — for the gallery) **misreads BRIEF.md**: BRIEF's GALLERI
section mandates `gal-01…04` and says the photos "finns, delade för alla teman".
Mutation proof (my copy in `out/.tmp/da-c2/mut/`): stripped ALL 4 `<img …gal-0…>` from theme 03 →
`gal-0 refs before/after: 4 0` → **pytest still 5 passed**.

### F3 · P2 — The demo-label check is defeated by a hidden span + one comment
Mutation proof (same scratch copy): replaced every visible `demo` in theme 07 with
`<span hidden>x</span>` and left one `<!-- demo -->` in `<head>` → **pytest still 5 passed**.
The regex `re.search(r"demo|mock", low)` accepts comments, hidden nodes, `<title>` — anywhere in the
file, not in the booking/form context where the BRIEF's honesty rule applies.
(NB: the *delivered* themes pass a much stronger version of this check — see Claim-3 verdict.)

### F4 · P2 — The index page (the customer-facing cover of the library) misdescribes two themes
- Card 18: **"Svart på vitt, bara bokstäver"** — theme 18 is **white on black**: built CSS
  `--bg: #050505` (my extraction) + my hero screenshots confirm white-on-black.
- Card 19: **"hela fältet färgas om vid varje sektion"** — CONTRADICTED by the built theme:
  no JS touches backgrounds (`19-galerievaggen/js/`: boka/kontaktform/tilt only), CSS gives a static
  mustard wall + `section--band` (mustard-deep, 2 sections) + one `section--dark` (kontakt).
  My full-page capture (`out/.tmp/da-c2/19-full/shot-1280.png`) shows exactly one dark section,
  not per-section repaint.
A customer choosing a theme from the gallery is shown one false feature and one inverted description.

### F5 · P2 — The suite stays green when a THEME IS DELETED
`test_ten_prototypes_exist` asserts `>= 10` and the other structural tests iterate `proto_dirs()` only.
Mutation proof: deleted the whole `20-mynta` dir in the scratch copy → **5 passed**. The "20-theme
deliverable" is enforced only at 10.

### F6 · P3 — Orchestrator sweep evidence is incomplete for 01–05, and the sweep tool never scrolls
`out/.tmp/sweep/`: shot dirs exist for all 20 (2 PNGs each), but `*-stdout.json` exists only for
**06–20** (15 files; 19/20 named `19-stdout.json`/`20-stdout.json`). For 01–05 the console/overflow
claim has no machine record. Additionally `screenshot.mjs` collects console/page errors during **load
+ 800 ms wait only — it never scrolls** — while BRIEF's rule is "noll JS-fel vid normal scroll genom
hela sidan". My own re-prove covers this (Claim-4 below) but the recorded evidence overstates the
instrument's reach.

### F7 · P3 — Swedish copy errors in customer-facing text
- `18-bara-typsnitt/index.html` (visible honest line): "så **gallriet** visas som typspecimen" → `galleriet`.
- `prototypes/index.html:48` (theme-01 card): "**lugora** avslöjanden" → `lugna`.
- `prototypes/index.html` (theme-20 card): "**pixlaade** badges, **scannlinjer**" → `pixlade`, `scanlinjer`.

### F8 · P4 — Notes, not defects
- Theme 15's honest note says illustrations "tecknade för hand av en konstnär" — fiction about authorship
  inside demo copy (harmless in a PoC; one-word softening would make it bulletproof).
- Theme 18 nav lists `05 KONTAKT` before `04 BOKA` — deliberate CTA placement, numbering follows section order.
- Theme 20's English arcade strings (`1 PLAYER`, `HIGH SCORE SCREEN`, `SELECT YOUR SERVICE`) — deliberate
  retro register, content copy stays Swedish (BRIEF's language rule is met on content).
- My full-page 19 capture shows black gallery rectangles because scroll-driven duotone reveal doesn't fire
  under full-page stitching — capture artifact; viewport capture renders correctly (photos in duotone).

---

## CLAIM-BY-CLAIM ADJUDICATION

**1. Weakened gallery gate — REFUTED (as a check).** F2: mutation-proven vacuous; commit rationale
misreads BRIEF. **15/18 photo-free status is honestly declared and intentional** — visible Swedish
copy in both (`15`: "Den här varianten visar hur sajten fungerar helt utan foto — allt du ser är
illustrationer…"; `18`: "Det här temat är byggt på typografi, så gallriet [sic, F7] visas som
typspecimen i stället för foto."), plus the index page's own note ("vissa galleriplatser är märkta
'Bild kommer'") and research-2 §6's explicit F1-proof framing. Not an accident; but a theme could
today drop ALL gallery evidence and stay green.

**2. Collision claims — CONFIRMED AS BUILT** for every spot-checked pair, from built CSS/JS:
| pair | bg (built) | fonts (built) | primary technique |
|---|---|---|---|
| 13 vs 05 | `#bfe6dd` mint vs `#eef0ea` sage | Rubik Mono One+Epilogue vs DM Sans+Newsreader | scroll-rotated confetti (`13/css/decor.css`+`js/main.js`) vs sticky card stack (`05/css/layout.css`) — distinct |
| 14 vs 01/07 | `#e8e5de` cool vs `#faf6f1`/`#f3ecdc` warm | Libre Bodoni vs Fraunces / DM Serif Display | halftone `mix-blend-mode` only in `14/css/newspaper.css`; 07's blend modes are grain multiply + difference cursor, a different technique |
| 16 vs 04/09 | `#f7f6fc` vs `#ffffff`×2 | Sora vs Archivo Black / Archivo | animated radial mesh only in `16/css/mesh.css`; 04/09 have zero radial-gradient — distinct |
| 18 vs 02/06 | `#050505` vs `#0c0a09`/`#111213` | Anton vs Space Grotesk / Cormorant | scramble decode only in `18/js/scramble.js`; side-by-side hero shots visually unmistakable |
| 20 vs 02/06 | `#0b0d17` navy | Press Start 2P unique | full-screen CRT scanlines only in `20/css/style.css`; 02's `repeating-linear-gradient(135deg…)` is a card texture, not scanlines — distinct |
Display-font sweep: all 20 themes use distinct families; none of 11–20 reuses a 01–10 display font (matches research-2 §7's [VERIFIED-local] claim, independently re-grepped).

**3. Demo-honesty — HOLDS, 20/20.** My `demo_check.py` extracts the **rendered text** (tags stripped,
scripts/comments removed) of `#boka` and `#kontakt` per theme: `boka-demo=True`, `form-labelled=True`,
`risky=[]` for all 20. No `<form>` anywhere carries a server action (3 themes use benign
`action="#kontakt"`; every second `<form>` is the `method="dialog"` close idiom). Zero `fetch/XHR/submit()`
in any theme JS. Post-selection dialogs all honestly redirect ("Ingen bokning har genomförts…",
"Demot sparar ingenting. Så här når du mig…", theme 20 banner "DEMO — INGEN BOKNING GENOMFÖRS").
No copy implies a real booking or message was received.

**4. Sweep claim — RE-PROVEN on 5 themes I chose (01, 04, 15, 18, 20), including the 2 whose orchestrator
JSON evidence is missing (01, 04).** My runs: same-protocol `screenshot.mjs` → all `verdict=clean`,
exit 0; **plus my own scroll sweep** (`out/.tmp/da-c2/scroll_sweep.mjs`, scrolls the whole document in
600 px steps + back to top, both widths, errors collected DURING scroll — which the orchestrator's
tool never does): 5/5 `clean`, `ce:0 pe:0 fr:0`, `overflow_x=False` at 375 (scroll_width 375 ==
inner_width), full documents scrolled (e.g. 01: scrollY 6044/6952 at 1280, 7895/8912 at 375).
No byte-identical copies of their evidence used. Caveat: I cannot re-prove the other 15; their
recorded evidence for 01–05 remains missing (F6) and load-only (F6).
Extra from my probes: BRIEF's "readable without JS" holds — JS-disabled probe on all 20 shows at most
2/48–97 main text elements hidden, every one a legitimately JS-only element (drag hint, `only-js` nav,
post-submit notes); `prefers-reduced-motion` present in all 20; every gal-`img` carries non-trivial `alt`.

**5. The suite itself — REFUTED: it stays green on a broken deliverable.** Three independent false-green
avenues proven by planted-bad runs (F2, F3, F5), plus load-only serving check (`assert "<html" in body`).
Severity call: this is the DoD gate for a customer-facing library, and its blind spot is exactly the
class of defect that actually shipped (F1: visible garbage the gate + screenshots both waved through).
The deliverable's CURRENT state is otherwise structurally sound (my independent checks), so this is
**P2 gate-hardening, FIX-worthy before the library is re-gated** — not a data-loss-level P0.

**6. Swedish correctness — 4 themes read closely (02, 11, 14, 20): clean** customer copy, no English
leakage in content (20's English is arcade-register display pastiche, deliberate and flagged in the
design doc); JS string-literal scan across all 20: no English visible-copy strings. Errors found are
in theme 18 + index cards (F7, P3).

---

## WHAT I DID NOT FIND
- No P0: nothing deceptive about bookings/forms (Claim 3 holds everywhere), no broken serving,
  no console/page/failed-request errors anywhere I probed (my own runs, 5 themes incl. 01–05 gaps),
  no 375 overflow in my set, no network egress beyond Google Fonts + jsDelivr GSAP (allowed list).
- Collision claims survived a deliberate hunt. Photo-free themes survived an honesty hunt.

## VERDICT REASONING
One **P1** stands: a customer-visible rendering defect (F1) on every view of theme 18 — shipped in a
library whose product is visual polish. Under the gate rule "SHIP only if no P0/P1 remains" this
forces **FIX**, even though everything else I probed held. The fix list is small and surgical:
1. requote `18/index.html:14` favicon attribute (F1);
2. index copy: fix card-18 description, tone down card-19 (F4);
3. gate: bind gallery evidence to `#galleri` content, bind demo-label to visible booking/form copy,
   count 20 not 10, add a stray-visible-text-node check that would have caught F1 (F2/F3/F5);
4. typos: `galleriet`, `lugna`, `pixlade`, `scanlinjer` (F7);
5. re-run sweep with JSON evidence captured for all 20, at least one scroll-scrolling run per theme (F6).

# JUDGED: 1a4f774e79ce4065af14092114d93936b5d80925c92e94c8f54f31c038bbcae7
# VERDICT: FIX
