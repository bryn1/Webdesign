# DA-verdict-c3 — final adversarial gate over the repaired 20-theme deliverable

Cycle 3, MC 10088. Scope per brief: verify each DA-c2 finding CLOSED and hunt what the fix commits
(1e63366, f5b2de9, a226a13, a010eaa) BROKE. Deliverable `prototypes/` (20 themes + index + `_assets`),
spec `BRIEF.md`, gate `out/test_prototypes.py`, live `http://192.168.5.231:8090/`. Read-only over the
deliverable; all probes mine this session; scratch in `out/.tmp/da-c3/`, mutation copies in /tmp (removed after).

**Baseline (my runs this session):** `python3 -m pytest test_prototypes.py -v` → **5 passed**; live root + theme-18 HTTP 200;
`git status` clean at `ca5c834`.

---

## C2 FINDING-BY-FINDING: CLOSED?

| c2 | what it was | status | my evidence (this session) |
|---|---|---|---|
| F1 P1 | stray visible `A'>` on theme 18 | **CLOSED** | Render probe (own `stray_probe.mjs`, 2 layers: body-direct text nodes w/ markup chars + ANY visible text node containing literal `<`/`>`), all 20 themes, 1280px: settled wait (3 s) → **`TOTAL_THEMES_WITH_LEAKS=0/20`**. Theme-18 favicon now percent-encoded data-URI inside double quotes — fetched in-page: status 200, parses as SVG (len 228), 0 failed requests. Corner crops `shots/18-1280-corner.png` + `18-375-corner.png`: clean (no c2-style junk glyph). |
| F2 P2 | gallery check vacuous ("bild kommer" unfalsifiable) | **CLOSED** | Gate now parses `<img src>` (`ImgSrc`) within a `#galleri` section slice. My attack (b): 4 real gallery imgs relocated into `#kontakt`, `#galleri` emptied → **RED** (`gallery photos missing from #galleri — found none`). Copy preserved, so c2's false-green cannot recur. |
| F3 P2 | demo label defeated by comment/hidden/anywhere-in-file | **CLOSED for the realistic vectors** | (a) all demo tokens stripped from `#boka` visible text (kontakt intact) → **RED** (`#boka lacks a visible demo/mock label`). (d1/T1) demo kept ONLY in `<!-- comment -->` → **RED** (TextOnly never sees comments). Control T7 (token fully removed) → RED, so the strip is proven complete. Residual hidden-node class survives — judged below (G4). |
| F4 P2 | index cards 18/19 misdescribed themes | **CLOSED on the checked claims** | Card 18: "Vitt på svart" — theme CSS `--bg:#050505` / `--ink:#ffffff`, hero screenshot white-on-black ✓. Card 19 new desc, claim-by-claim vs code: "senapsgul fond" = body `background: … var(--mustard)` #c9a227 ✓; "duotone-tryck" = `css/galleri.css` N8 pure-CSS duotone (grayscale+contrast filter, gold multiply) ✓; "mässingsplåtar" = `--brass` tokens, `/* skyltplåt */`, mässingkant styling ✓; "lutning när … muspekaren" = `js/tilt.js` N9 pointerenter/pointermove ✓. The old false claim ("hela fältet färgas om") is gone. Adjacent misses in the same edit: NEW-P3/P4 below. |
| F5 P2 | suite green when a theme is deleted | **CLOSED** | `N_PROTOS = 20`. My attack (e): /tmp copy minus `20-mynta`, `test_prototypes_exist` → **RED** (`only 19 of 20 prototype dirs`). |
| F6 P3 | sweep evidence missing 01–05; tool never scrolls | **CLOSED on both requirements** | `out/.tmp/orch-scroll-sweep.log` (22:46, post-fix): all 20 themes incl. 01–05, per-theme `scrollHeight` + `scroll_console_errors`, `SCROLL_SWEEP_CLEAN 20/20`; script scrolls the full doc in 800 px steps collecting console/page errors DURING scroll. My c2 independent scroll sweep (5 themes) still stands. Residual note: screenshot sets remain load-time captures (P4, G5). |
| F7 P3 | Swedish typos (lugora, pixlaade, scannlinjer, gallriet) | **CLOSED** | `grep -rn -i -E "lugora|pixlaade|scannlinjer|gallriet" prototypes/` → exit 1, **0 hits** tree-wide. Four edited sentences read: "lugna avslöjanden" ✓, "så galleriet visas som typspecimen i stället för foto" ✓, "pixlade badges, scanlinjer" ✓, card-18 "Vitt på svart, bara bokstäver" ✓ — no new spelling errors. One semantic wording nit in the NEW card-19 sentence (G2). |
| F8 P4 | notes, not defects | unchanged | Still notes; nothing reclassified. |

## ATTACKING THE NEW GATE (f5b2de9 + a010eaa) — can a broken deliverable stay green?

Red proofs (all on /tmp copies, never the real tree; copies removed): **(a) RED** — demo label
stripped from `#boka` visible text (photos + kontakt intact); **(b) RED** — photos relocated to
`#kontakt`, `#galleri` emptied; **(e) RED** — theme dir deleted vs N_PROTOS=20; **T1/T7 RED** —
comment-only demo token / fully-removed token. The section-slice + parser design genuinely closes
c2's F2/F3-realistic/F5 avenues; `TEST-verdict-c3.md`'s A/B/C red proofs reproduce.

Surviving tricks (sole hidden token keeps `assert_demo_honesty` GREEN): `T2` `<span class="sr-only">demo</span>`,
`T3` `<span hidden>demo</span>`, `T4` `<title>demo</title>` inside `#boka`, `T6` `<template>demo</template>`;
gallery side: `d2` the 4 real imgs kept but `style="display:none"`, `d3` srcs rewritten to a nonexistent
path keeping the `gal-0N.jpeg` filenames. All six require a deliberate, adversarial edit, not a copy
slip — a copy slip (token edited away, moved out of section, commented out) goes RED (T7/T1/a/b).
I additionally PAINT-verified the delivered product: `painted_demo.mjs` — every `#boka`+`#kontakt`
carries a genuinely painted demo label with real text in 20/20 themes (theme 20's note reads invisible
at load only because it is below-fold until scrolled — confirmed painted when scrolled into view:
display:block, opacity 1, 435×62 px in viewport). The producer's acceptance reasoning is half-right:
`orch-scroll-sweep.mjs` verifies console errors during scroll, NOT painted labels — the paint truth is my
probe today plus the screenshot sets, not an automated assertion. Judged **accepted P4** (G4): the gate's
own docstring declares the threat model ("silent copy edits … not a deliberately forged file"), every
accidental-edit regression mode goes RED, and the delivered state is paint-verified. A 3-line hardening
(`re.sub(r"<[^>]*hidden[^>]*>.*?</[^>]+>", " ", …)` + `<title>/<template>` in the SKIP set + fetch each
theme's own img srcs) would close it further — recommended follow-up, not cycle-worthy.

## NEW FINDINGS (from the fixes and from the hunt)

### G1 · P3 — Index card 19's swatch chips still show the RETIRED direction's colors
The fix rewrote card 19's text but left its three color chips `#0e0f13 / #ff6b35 / #00c2a8`
(dark/orange/teal — the old "hela fältet färgas om" story). None of these hexes appears anywhere in
`19-galerievaggen/` (grep: exit 1); the theme's real palette is mustard/ink/brass/cream
(`#c9a227/#171208/#8a6d1f/#f5efe2`). The card now says "senapsgul fond" while its own chips show no
mustard. My all-20 sweep: 15/20 chips exactly present in the theme; 16/17/18/20 chips are close
families (e.g. card 18 `#000000` vs real `#050505` — indistinguishable); **only card 19's chips are
materially wrong and now contradict their own corrected description.** Customer-facing, one-line fix:
replace the three `background:` values with the theme tokens.
### G2 · P4 — New card-19 sentence has inverted agency
"lutning när du **närmar dig muspekaren**" literally says the user approaches the mouse pointer;
the effect is the pointer approaching the frame (`pointerenter`). Grammatically well-formed, meaning
guessable, but the natural Swedish is "när du för muspekaren nära" / "när muspekaren närmar sig".
Editor-typo class c2 warned about — small instance introduced by the fix itself.
### G3 · P4 — Card 18 tail "roterar … räknar" survives on a loose reading
Theme 18's full transform inventory: `scale(0.84→1)` morph + `translateX` marquee rails + scramble
decode whose GLYPHS cycle letters AND DIGITS on scroll-entry (`js/scramble.js`, IntersectionObserver
threshold 0.6). No `rotate` anywhere in the theme's css/js. "skalar" is exact; "roterar/räknar" are
defensible only as the glyph-cycling scramble ("siffrorna roterar"). c2 accepted this tail unchallenged;
not a reversal (F4's complaint), flagged as a wording risk only.
### G4 · P4 — Gate residual: hidden/inert-DOM tokens satisfy the demo check (ACCEPTED, with receipt)
T2/T3/T4/T6 + d2/d3 proven GREEN above; T1/T7/a/b/e proven RED. Accepted per the reasoning block
above; recommend the 3-line TextOnly hardening in the close-out, and note that a paint-level guard
(`painted_demo`-style) is the only thing that could ever catch the d2/d3 class — worth copying into
the sweep if the library is ever rebuilt.
### G5 · P4 — Notes from the hunt
- Theme 20's scramble GLYPHS include literal `<` and `>`; mid-animation a visible text node carries
  `Anny ▒B▒>B` (my 500 ms layer-2 hit — settled by ~1.5 s to the exact original, reduced-motion
  untouched, original always in markup). NOT a leak — but any future automated stray-check must wait
  for settle or it will false-positive here.
- c2's F6 screenshot sets remain load-time captures (the scroll sweep is console-only); F1-class
  paint regressions are guarded by DA probes, not a standing tool. If the library is re-gated after
  any further edit, re-run `stray_probe.mjs` (settled) + `painted_demo.mjs` — both are in `out/.tmp/da-c3/`.
- Producer hygiene: TEST-c3's foreign `/tmp/99-testprobeA` leftover is gone; repo clean at `ca5c834`.

## WHAT I DID NOT FIND
No P0/P1 from the fixes: theme-18 file edits (favicon requote + one word) render clean at 1280/375 with
working favicon and zero stray nodes; index rewrites render 20 cards (all with href + desc), zero stray
text nodes, zero console errors; both edited sentences grammatical; typo greps zero; photo-free rules
and structural checks green on the real tree; demo labels paint in 20/20.

## CLAIM LABELS
VERIFIED (my runs this session): pytest 5/5 · stray probe 0/20 settled (+ 1 transient 20-mynta
scramble frame at 500 ms) · painted demo labels 20/20 · attacks (a)(b)(e) T1 T7 RED ·
T2 T3 T4 T6 d2 d3 GREEN · favicon fetch 200/SVG · card-19 claims vs code · mustard body bg ·
swatch sweep 15/20 exact + card-19 materially wrong · scroll-sweep log 20/20.
INFERRED: none material. UNVERIFIED: per-theme re-sight of every c2-era screenshot set (not required);
render state of themes 01–17 beyond stray/paint probes (c2 cleared them; the fix commits touch only
theme 18 + index + gate — verified by `git show --name-only`).

## VERDICT REASONING
All seven c2 findings are verifiably closed against the acceptance bar each carried: F1 render-clean
0/20 + fixed favicon proven loading; F2/F3-realistic/F5 mutation-RED by my own fresh attacks (a/b/e/T1/T7);
F4 direction + code-backed claims; F6 all-20 scroll console evidence on disk; F7 zero greps + grammar.
The highest NEW severity is **P3** (card-19 color chips — cosmetic copy on the gallery cover, one-line
fix for the close-out commit). No P0/P1 exists and none was introduced by the fixes. Under the gate rule
("SHIP requires all c2 findings verifiably closed AND no new P0/P1 from the fixes") that is **SHIP**,
with the close-out commit advised to also fix the three card-19 `background:` values (G1) and optionally
"närmar dig muspekaren" (G2) — neither reopens the gate.

# JUDGED: c802d6b1c21f1b6a243280f0483f85bd7860dfce7e598fefeedda165e76efee9
# VERDICT: SHIP
