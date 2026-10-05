# DA-verdict-c4 — adversarial gate over the JS scroll-standardization wave (MC 10088, 2026-10-05)

Gate scope: HEAD `7421b2d` + the wave's 20 S-commits + support commits; ledger = DONE.md section E
(working-tree version, itself uncommitted — see P3-3). All numbers below are MY runs this session,
independent of builder/orchestrator probes. Scratch: `out/.tmp/da-c4/` (da-probe.mjs 4 modes,
contrast.mjs, pin10.mjs, walk19.mjs, sweeps reduce/jsoff/mobile/main, all 20 themes × 4 modes).
Server: http://192.168.5.231:8090/ (PORT file 8090; served copy md5 == repo copy on spot-check).

## 1. Ledger-vs-reality spot checks (6 hardest rows, all reproduced)

| Row | Claim | My measured (this session) | Reproduced |
|---|---|---|---|
| S-01 | 39 trig / 14 scrub, band reacts, IO removed | 39 trig / 14 scrub; band 82 changed 0→15%, first notch 72; no IO in js/ | EXACT |
| S-02 | 42 trig / 8 scrub, band 66→85, 2 timeline files deleted | 42 trig / 20 scrub*; band 85 (= claimed end value); reveal.js deleted, theme-sync.js slimmed (-27) | trig+band EXACT, scrub over-delivered, "2 files" loose (1 deleted + 1 slimmed) |
| S-05 | 49 trig, anims 6→0, AA fix | 49 trig; `document.getAnimations()` = 0; AA 0 offenders at 5 scroll depths (own WCAG probe) | EXACT |
| S-09 | anims 27(dead)→1, 35 trig / 22 scrub, first portrait | live anims = 1; 39 trig* / 22 scrub; portrait ref present | EXACT except trig +4 over claim |
| S-10 | 23 / 16 scrub, tear-rule draw, first portrait, pin-residue fixed | 23 / 16 EXACT; pin cycle: docHeight 6125→6125, triggers 23→23, 0 pin-spacers, hero pin active at top as designed | EXACT |
| S-15 | 48 trig, photo-free (0 photo refs) | 48 trig EXACT; 0 `anny-portrait`/`gal-0`/`<img>`/jpg refs in index.html | EXACT |
| S-18 | 32/7 active, invert AA both ends, photo-free | 32 trig EXACT; AA: 0 offenders for meaningful text at 5 depths both invert ends (screenshot-confirmed both ends); photo-free 0 refs | EXACT (decorative-marker caveat → P4-2) |

\* scrub-count discrepancies are direction-safe (measured ≥ claimed); see P3-2.

## 2. Fleet-wide contract verification (my own probes, all 20 themes)

| Contract clause | Result | Method |
|---|---|---|
| All 20 themes on vendored GSAP+ScrollTrigger, no runtime CDN | PASS 20/20 | live probe: `gsap.version=3.12.7`, `ScrollTrigger` present; vendor headers 3.12.7; non-font `https://` refs = 0 (fonts = recorded E3 exception) |
| ≥5 scroll-linked effects | PASS 20/20 | triggers 16–52 (min: theme 20 = 16) |
| ≥3 scrubbed | PASS 20/20 | scrubbed triggers 14–48 (min: 01 = 14) |
| five classes line/color/zoom/drift/pin-or-draw | PASS 20/20 | per-theme grep of scroll files; weakest drifts verified by code read (17 hero y-scrub L23, 20 hero yPercent differential layers L63–75) |
| opening band 0→15% reacts to first wheel-notch | PASS 20/20 | first-notch changed-element count 24–166 (min theme 17 = 24) |
| reduce-motion ⇒ ZERO triggers | PASS 20/20 | reducedMotion ctx: `ScrollTrigger.getAll().length = 0` everywhere |
| reduce ⇒ default-visible | PASS | text-painted walk at 5 depths × 20 themes: only hits were CLOSED `<dialog>` content in 15/17 (probe artifact — verified in markup L327–364) |
| JS-off ⇒ nothing hidden | PASS 20/20 | jsEnabled:false sweep: text-painted check; 05/19 hits = JS widget chrome (carousel buttons, drag hint) while gallery CONTENT paints (screenshot-verified: framed photos + captions); `.js`/`no-js` gates added by script only |
| console 0 | PASS | 0 errors across main/reduce/jsoff/mobile × 20 themes |
| 375px no page overflow | PASS 20/20 | `documentElement.scrollWidth − clientWidth = 0` at 9 steps × 20 themes (theme 13 body-level caveat → P4-1) |
| AA on new pairs | PASS | own contrast probe (both ends + midpoints) on the two claimed AA rows (05 fixed pair, 18 invert); 0 offenders for meaningful text |
| ≤400 lines | PASS | largest scroll file 247 (05 scroll.css); 08 index.html 456 with ruled reason line at line 2 |
| pytest 5/5 | PASS | `python3 -m pytest test_prototypes.py -q` → 5 passed |
| scoped commits | PASS 20/20 | all S-commits: 0 files outside own theme dir |
| legacy CSS scroll-timeline dead-end | PASS | actual `animation-timeline`/`view-timeline` declarations repo-wide = 0 (7 grep hits are prose comments stating absence) |
| portrait in 18 themes, 15/18 photo-free | PASS | 18 index.html refs = exactly the attribution list (01–14,16–17,19–20); 15/18: 0 refs |
| attribution/provenance | PASS | ATTRIBUTION.md: source URL, date, fetcher, rights note; single git commit 1ef4e9e, clean body, author `hermes-standby (10088)`; served copy md5 == repo copy |
| owner rulings on record | PASS | both quotes verbatim in DONE.md section E header (ledger, not a manufactured decision) |

## 3. Findings (severity-ranked)

**P2-1 — Theme 11 keeps a second, non-GSAP scroll-motion engine (reveal).**
25 `.reveal` elements animate via IntersectionObserver + CSS transition (`js/main.js` L10–22 adds
`.in`; `css/style.css` L240–244 `.js .reveal{opacity:0;…;transition:.8s}`). Theme 11's GSAP file
(78 lines) registers 0 reveal targets — the pre-wave engine still owns the reveal. The wave's own
standard folded this exact concern into GSAP in 01/02/06/08 (their files say "ersätter
IntersectionObserver-maskineriet"). Fleet doctrine: a mechanism beside the one that answers the
same question is the silent defect class. Guards hold (`.js`-gate JS-off ✓, reduce media override
✓ — no contract clause fails), hence P2 not P1.
REPRO: `grep -c reveal prototypes/11-blaa-fargbrunn/js/scroll-motion.js` → 0; `grep -n "\.reveal"
prototypes/11-blaa-fargbrunn/css/style.css` → L240; main.js revealIO block.

**P3-1 — Theme 02 keeps a scroll-driven color-invert IO engine beside GSAP.**
`theme-sync.js` (IO + viewport re-scan) toggles `.theme-invert`; `layout.css` L18–22 fades it
`.45s`. A one-shot state swap rather than a scrub, and reduce-safe (transition disabled), but it is
scroll-linked motion registered outside the GSAP track — same dual-mechanism shape as P2-1, weaker.

**P3-2 — Ledger scrub columns under-report measured scrubbed triggers; one trig count off.**
Measured vs claimed: S-02 8→20, S-06 10→21, S-07 7→18, S-16 12→22, S-20 6→16; S-09 trig 35→39.
All direction-safe (meets/exceeds ≥3 and S-R's ≥14 in both readings; S-R "triggers≥16, scrubbed≥14"
reproduces) but the numbers as written are not reproducible on the runtime metric.
TEST-c5 independently logged the same reporting variance.

**P3-3 — The ledger I gate is uncommitted; S-R "git status clean" is false at gate time.**
DONE.md section E exists only in the working tree (+40 lines vs HEAD); untracked
TEST-verdict-c5.md and `.audits/202610051009-workflow-explode/` also present. `prototypes/` itself
is clean. Trail rule says the ledger line lands in the commit that closes the card — commit it in
the close-out. (Concurrent-cycle churn, not a wave defect; hygiene on the parent's own file.)

**P4-1 — Theme 13 at 375px: body scrollWidth exceeds clientWidth 8–20px.**
Offender: `.marquee` tilted band (`rotate(-1deg) scale(1.02)` → bbox 391px > 375). `html {
overflow-x: clip }` (style.css L20) means zero user-visible page overflow — docElement delta is 0
at every step, no horizontal scroll possible. Fails only a raw body-metric reading of the clause.

**P4-2 — Theme 18: aria-hidden decorative markers fall below strict 1.4.3.**
"01–05" nav numerals, large ghost section numbers, "·" separators: 1.79–2.81 at the invert ends.
All `aria-hidden="true"`, duplicating adjacent real labels (pure-decoration reading is defensible;
all meaningful text is AA at both ends — verified). Not a new-pair regression.

**P4-3 — Theme 15 chapter-swap IO is scroll-gated and fully disabled under reduce.**
Under reduce the stage image/caption never follows chapters (stays on chapter 1). Content-state,
not motion; documented in-file; defensible PoC-demo choice. Noted for completeness.

No P0/P1 found. Portrait, vendoring, scoping, reduce/jsoff/mobile/console gates all held under
adversarial probing with my own instrument; I also planted the red case myself and it behaved:
my first contrast pass went RED twice on a probe-side effBg bug — root-caused, fixed, re-green —
and my reduce-pass RED flags in 15/17 resolved to closed `<dialog>` markup, i.e. probe artifacts,
not violations. Both instrument corrections are on record in `out/.tmp/da-c4/`.

## 4. Verdict rationale
Contract: every clause verified PASS by independent probe on all 20 themes. Spot-checks reproduce
(the 39/14, 42/85-band, 49/0-anims, 1/anim, 23/16+pin-stable, 48/photo-free, 32/AA-both-ends rows).
The one P2 is an engine-duplication hygiene break with all guards intact — fix-when-next-touching
material, not a ship-blocker for a LAN demo per the task's own severity rule (FIX requires
P0/P1 with reproduction; none exists).

# JUDGED: c802d6b1c21f1b6a243280f0483f85bd7860dfce7e598fefeedda165e76efee9
# VERDICT: SHIP
