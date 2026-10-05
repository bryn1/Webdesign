# TEST-verdict-c5 — JS scroll standardization, 20-theme library (MC 10088, enhancement wave 2026-10-05)

Independent re-verification of DONE.md section E (S-01..S-20 + S-R). All numbers below are MY
runs this session, not the builder's claims. Scratch: `out/.tmp/test-c5/` (c5-probe.mjs /
c5-probe.json / c5-probe.log / c5-nojs.mjs). Server: http://192.168.5.231:8090/ (port matches
repo PORT file used by the gate).

## Check 1 — pytest gate + red-proof — PASS
- `cd OUT && python3 -m pytest -q` → **5 passed in 0.13s** (VERIFIED).
- Red-proof: copied the gate to `OUT/.tmp/test-c5/red_proof_test.py`, mutated ONE check
  (inverted the photo-free assertion in `assert_gallery_evidence`: `assert not any(PHOTO_RE…)`
  → `assert any(PHOTO_RE…)`), ran the copy against prototypes/ →
  **FAILED test_each_prototype_structure — "15-sagan-om-klippet: brief says photo-free, but real
  photos are embedded" / 1 failed, 4 passed** — the gate can still go RED (TESTED).
  Copy then deleted; `git status` shows `test_prototypes.py` and `prototypes/` unmodified (VERIFIED).

## Check 2 — repo greps — PASS
- `grep -rn 'animation-timeline:' prototypes/` → **0 declarations** (exit 1, VERIFIED).
- `grep -rn 'animation-timeline' prototypes/` (no colon) → 9 hits, **all inspected: every one is
  a comment stating the prohibition** ("inga animation-timeline-deklarationer", "ingen CSS
  animation-timeline", "erstatter den borttagna … deklarationen") — allowed per task.
- `grep -rl 'anny-portrait' prototypes/*/index.html | wc -l` → **18**; the file list excludes
  exactly 15-sagan-om-klippet and 18-bara-typsnitt (VERIFIED).
- 15 and 18: `grep -c 'anny-portrait\|gal-0'` → **0 refs in both** (photo-free concept held, VERIFIED).

## Check 3 — live probe, all 20 themes (playwright-core, 1280×800) — PASS
Pattern per OUT/.tmp/evidence/11-verify.json; load → scrollTo 50% (instant) → 1.0 s settle.
isActive handled as field-or-function (`typeof x.isActive === "function" ? x.isActive() : Boolean(x.isActive)`).
Reduce phase = `emulateMedia({reducedMotion:'reduce'})` + reload on the same page.

| theme | triggers@50% (≥5) | activeMid (≥1) | reduce triggers (=0) | reduce hidden section img/h2/p | console errs normal/reduce | portrait naturalWidth |
|---|---|---|---|---|---|---|
| 01-mullers-editorial | 25 | 7 | 0 | 0 | 0/0 | 1656 |
| 02-mork-neon | 28 | 11 | 0 | 0 | 0/0 | 1656 |
| 03-varmt-papper | 28 | 8 | 0 | 0 | 0/0 | 1656 |
| 04-brutalt-tryck | 26 | 7 | 0 | 0 | 0/0 | 1656 |
| 05-mjuk-glas | 39 | 13 | 0 | 0 | 0/0 | 1656 |
| 06-cinematiskt | 52 | 8 | 0 | 0 | 0/0 | 1656 |
| 07-retrofilm | 25 | 8 | 0 | 4 (decorative, see below) | 0/0 | 1656 |
| 08-organiskt-hantverk | 40 | 2 | 0 | 0 | 0/0 | 1656 |
| 09-schweizertag | 35 | 18 | 0 | 0 | 0/0 | 1656 |
| 10-magasincollage | 23 | 5 | 0 | 0 | 0/0 | 1656 |
| 11-blaa-fargbrunn | 18 | 8 | 0 | 0 | 0/0 | 1656 |
| 12-forgyllda-salongen | 28 | 6 | 0 | 1 (decorative, see below) | 0/0 | 1656 |
| 13-91-tal | 30 | 4 | 0 | 0 | 0/0 | 1656 |
| 14-dagens-frisyr | 20 | 3 | 0 | 0 | 0/0 | 1656 |
| 15-sagan-om-klippet | 48 | 8 | 0 | 0 | 0/0 | photo-free (exempt) |
| 16-gradientljus | 22 | 10 | 0 | 0 | 0/0 | 1656 |
| 17-mork-akademien | 29 | 12 | 0 | 0 | 0/0 | 1656 |
| 18-bara-typsnitt | 27 | 7 | 0 | 0 | 0/0 | photo-free (exempt) |
| 19-galerievaggen | 26 | 11 | 0 | 0 | 0/0 | 1656 |
| 20-mynta | 16 | 6 | 0 | 0 | 0/0 | 1656 |

Hidden-hit investigation (classes checked before ruling, per task):
- **07-retrofilm (4)**: 2× `p.frame-gap__no` @0.8, `p.reel-mark` @0.8, `p.boka-note` @0.92 —
  declared statically in `07-retrofilm/css/sections.css` (:136, :170, :236); these are the
  pre-existing film-frame markings / muted note styling (the task explicitly names theme 07's
  0.8 film markings as NOT a fail), not reveal-state hidden elements. No `.reveal`-family class.
- **12-forgyllda-salongen (1)**: `p.hero__marquee` @0.85 — static `css/style.css:72-73`, decorative
  muted-gold marquee band, not a reveal state.
- `getAnimations()` running count 0 under reduce on both themes (no CSS animation leaking through).

JS-off corroboration (owner ruling "JS-off shows everything"): separate sweep with
`javaScriptEnabled:false` across all 20 → the ONLY opacity<0.99 hits anywhere are the same static
decorative classes (07: 5 = same classes, 2× boka-note visible at full list; 12: 1 marquee).
Zero reveal-state hiding anywhere (VERIFIED).

## Check 4 — vendor integrity — PASS
- `git ls-files prototypes/_assets/vendor/` → both `gsap.min.js` + `ScrollTrigger.min.js` tracked (VERIFIED).
- Vendor headers: GSAP 3.12.7 / ScrollTrigger 3.12.7 (matches S-row claim c4e0f4e "vendored GSAP v3.12.7").
- Script-src extraction across all 20 index.html: exactly `20× ../_assets/vendor/gsap.min.js` +
  `20× ../_assets/vendor/ScrollTrigger.min.js`, no other gsap/ScrollTrigger src (VERIFIED).
- `grep -rn 'cdn\|jsdelivr\|unpkg\|cdnjs' prototypes/ --include=*.html | grep -i 'gsap\|scrolltrigger'`
  → **0 hits** (exit 1, VERIFIED). (Google Fonts CDN links remain — recorded OPEN as E3 in DONE.md,
  out of this gate's scope.)

## Check 5 — portrait load — PASS
In all 18 portrait themes the `#om img[src*="anny-portrait"]` reported `naturalWidth === 1656`
(complete=true) from the live server (VERIFIED, table above). 15/18 exempt (photo-free, 0 refs).

## Hygiene (DoD item)
- `prototypes/08-organiskt-hantverk/index.html` = 456 lines (>400) **with the required header
  reason line** (line 2: pre-existing single-page exception, ruled 2026-10-05, CSS/JS already
  split) — exception satisfied, no finding. All other theme html/css/js files ≤399 lines.
- No new copy-paste-vs-premature-abstraction findings in this wave's files.

## Discrepancy notes (non-blocking)
- Ledger trigger counts differ slightly from my @50%-scroll measurements (e.g. S-01 claims 39
  triggers, I measured 25 registered at that moment; S-11 claims "4 active mid", I measured 8).
  Counts depend on lazy registration/measurement point; every acceptance threshold (≥5 triggers,
  ≥1 active, 0 reduce, 0 errors) is met with margin, so this is a reporting variance, not a FAIL.
- DONE.md S-R says "git status clean": currently `DONE.md` itself is modified in git (parent's own
  file) plus an unrelated untracked `.audits/202610051009-workflow-explode/` dir — prototypes/
  itself is clean. Informational only.

# JUDGED: c802d6b1c21f1b6a243280f0483f85bd7860dfce7e598fefeedda165e76efee9
# VERDICT: PASS
