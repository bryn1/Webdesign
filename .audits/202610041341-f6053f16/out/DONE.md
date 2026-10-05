# DONE — scroll-design prototype library (MC 10088)
Ledger of acceptance claims. STATUS vocabulary: PASS | FAIL | BLOCKED | N/A | UNVERIFIED.
Every PASS row was checked by the orchestrator's own tools this session unless the evidence
text names the measuring child. Final gate: DA-verdict-c3.md `# VERDICT: SHIP`
(JUDGED c802d6b1) + TEST-verdict-c4.md `# VERDICT: PASS` (same hash).

## A — Research
| ID | claim | STATUS | evidence |
|---|---|---|---|
| A1 | batch-1 research: both YouTube clips + top scroll-design sites, cited per claim | PASS | out/research.md (committed, per-claim VERIFIED/INFERRED tags, firecrawl payloads in out/.tmp/) |
| A2 | batch-2 research: 10 non-colliding fresh directions (11–20), fetched refs, §7 collision matrix | PASS | out/research-2.md @ 694df69; includes honest CONTRADICTED row: vercel.com now serves a LIGHT page — dropped as reference |
| A3 | research adversarial gate (batch 1) | PASS | DA-verdict.md (cycle-1) |

## B — Product: 20 themes, identical BRIEF content, Swedish, demo-honest
| ID | theme | STATUS | evidence (all: curl 200 + BRIEF strings + sweep console=0/overflow=0 at 1280+375) |
|---|---|---|---|
| C-01 | 01-mullers-editorial | PASS | 317c5d0 |
| C-02 | 02-mork-neon | PASS | 05ed388 |
| C-03 | 03-varmt-papper | PASS | e7296d3 |
| C-04 | 04-brutalt-tryck | PASS | 82efccd |
| C-05 | 05-mjuk-glas | PASS | de6f1b4 |
| C-06 | 06-cinematiskt | PASS | abbd8bf |
| C-07 | 07-retrofilm | PASS | 716471b |
| C-08 | 08-organiskt-hantverk | PASS | d8903a3 (+454-line header reason f5b2de9) |
| C-09 | 09-schweizertag | PASS | 40a53ef |
| C-10 | 10-magasincollage | PASS | a1c37fb |
| C-11 | 11-blaa-fargbrunn | PASS | 601415d |
| C-12 | 12-forgyllda-salongen | PASS | 58b5f4a |
| C-13 | 13-91-tal | PASS | c804259 |
| C-14 | 14-dagens-frisyr | PASS | ec8d937 |
| C-15 | 15-sagan-om-klippet (photo-free by brief) | PASS | 5a6de26; honest in-section statement gate-enforced |
| C-16 | 16-gradientljus | PASS | e457eb8 |
| C-17 | 17-mork-akademien | PASS | ebaed02 |
| C-18 | 18-bara-typsnitt (photo-free by brief) | PASS | 986c412; favicon stray-node fix a010eaa, re-probed 0/20 leaks |
| C-19 | 19-galerievaggen | PASS | 4b15273 |
| C-20 | 20-mynta | PASS | 589984b |

## C — Integration & gates
| ID | claim | STATUS | evidence |
|---|---|---|---|
| D1 | gallery index: 20 cards ↔ 20 dirs bijection, every href 200, card copy matches built themes (incl. card 18/19 rewrite + swatch fix) | PASS | 900c0d7, 5fb345f, a010eaa, f4b3b98; DA-c3 F4/G1/G2 closed by code-inspection |
| D2 | pytest gate 5/5 green AND provably red: img-src parse, section-bound gallery, visible-text demo labels in #boka+#kontakt, ≥20 dirs, photo-free honesty in-section | PASS | TEST-verdict-c2 PASS (flipped on fix) + TEST-verdict-c3 PASS + TEST-verdict-c4 PASS; independent red-proofs 5/5 by fresh tester |
| D3 | adversarial gate final: all c2 findings closed, no new P0/P1 from fixes | PASS | DA-verdict-c2.md FIX (7 findings) → DA-verdict-c3.md SHIP (own probes, gate attacks RED) |
| D4 | browser sweeps: load-only 1280+375 20/20 console=0 overflow=0 (stdout.json per theme); SCROLLING pass 20/20 0 errors; stray visible-text nodes 0/20 | PASS | out/.tmp/sweep/*-stdout.json, orch-scroll-sweep.log (SCROLL_SWEEP_CLEAN 20/20), stray_probe re-run post-fix |
| D5 | demo-honesty PAINTED (not just present): demo label visibly painted in #boka + #kontakt in all 20 themes | PASS | DA-c3 paint-verification probe, incl. theme 20 below-fold reveal |
| D6 | live service on 192.168.5.231:8090 (PORT file committed) | PASS | curl 200 re-checked every verification turn; pytest live-HTTP tests |
| D7 | WCAG AA contrast per theme | UNVERIFIED | builder-measured ledgers per theme + orchestrator/DA/tester spot re-computations (incl. two real fixes S-01/S-05); not re-measured wholesale — new pairs from the wave ARE independently re-computed (TEST-c5, DA-c4) |

## E — Scroll standardization on JS (owner rulings 2026-10-05, supersedes C-row shas)
Owner saw no motion in 11–20 (CSS scroll-timeline dead on his browser — my earlier viewport-delta metric
had conflated content-scroll with effects; both errors owned on record). Rulings: "If Javascript makes
everything smoother i want JS", then "i want design 1-20 to have JS, not just 11-20". Standard: vendored
GSAP + ScrollTrigger (`_assets/vendor/`, no runtime CDN), ≥5 scroll-linked effects, ≥3 scrubbed, five
classes (line/color/zoom/drift/pin-or-draw), opening band 0→15% reacts, reduce-motion ⇒ ZERO triggers +
full default-visible, JS-off ⇒ nothing hidden, 375px no overflow, AA on new pairs, ≤400 lines (08 index
pre-existing exception), pytest 5/5, scoped commits. Portrait from owner-delivered IG post wired into 18
themes; 15+18 photo-free by concept (ruled, owner informed).

| ID | theme | STATUS | enhancement sha | builder evidence |
|---|---|---|---|---|
| S-01 | 01-mullers-editorial | PASS | 24cc8e5 | 39 triggers/14 scrub, opening band 10→34, IO+timeline deleted |
| S-02 | 02-mork-neon | PASS | 948946c | 42 triggers/8 scrub, band 66→85, 2 timeline files deleted |
| S-03 | 03-varmt-papper | PASS | fd983a9 | 38 triggers, IO+rAF dual engines folded into one file |
| S-04 | 04-brutalt-tryck | PASS | 579b8b6 | 36/16 scrub, transforms 8→39, galleri red-step scrub |
| S-05 | 05-mjuk-glas | PASS | 5536cf9 | 49 triggers, anims 6→0 (timelines dead), pre-existing AA fail fixed |
| S-06 | 06-cinematiskt | PASS | 5cc95b8 | 52 triggers/10 scrub, citat pin, IO+rAF+timeline all deleted |
| S-07 | 07-retrofilm | PASS | 20203d6 | 35 triggers/7 scrub, paper-age scrub, pin freeze-frame |
| S-08 | 08-organiskt-hantverk | PASS | 6796dbc | 40 triggers, pen-draw 324→0 dashoffset scrub |
| S-09 | 09-schweizertag | PASS | 542a0a9 | anims 27(dead)→1, 35/22 scrub, FIRST portrait for this theme |
| S-10 | 10-magasincollage | PASS | 7421b2d | 23/16 scrub, tear-rule draw, FIRST portrait, pin-residue fixed mid-build |
| S-11 | 11-blaa-fargbrunn | PASS | 0746989 | 18 triggers/4 active mid/0 reduce |
| S-12 | 12-forgyllda-salongen | PASS | 465edf4 | 28 triggers/9 active/0 reduce, gold-deco |
| S-13 | 13-91-tal | PASS | 4138676 | 30 triggers, mint→amber body-bg scrub |
| S-14 | 14-dagens-frisyr | PASS | e4a9e38 | 20/19 scrubbed, pinned Reportage flag, halftone portrait |
| S-15 | 15-sagan-om-klippet | PASS | e5234bb | 48 triggers, photo-free concept held (0 photo refs verified) |
| S-16 | 16-gradientljus | PASS | 0a820e3 | 22/12 scrub, gradient sweep |
| S-17 | 17-mork-akademien | PASS | e8b49da | 37 triggers, opening band reacts (candle-glow kept) |
| S-18 | 18-bara-typsnitt | PASS | ebd224a | 32/7 active, invert AA both ends, photo-free held |
| S-19 | 19-galerievaggen | PASS | c2276f7 | 26 triggers, hung frames+spotlights, mobile horizontal walk |
| S-20 | 20-mynta | PASS | 8b466d9 | 16/6 active, arcade identity kept, scroll-listener bar removed |

Support: 1ef4e9e portrait + provenance, c4e0f4e vendored GSAP v3.12.7, 9b95b04 portrait themes 01–08.
| S-R | repo-wide final sweep (orchestrator's own probe, this session): 20/20 themes triggers≥16, scrubbed≥14, activeMid≥2, reduce triggers = 0 everywhere, console errors 0 everywhere; animation-timeline declarations repo-wide = 0; portrait refs = 18 index.html (15/18 photo-free verified 0 refs); pytest 5/5. Scope of "clean" claim = prototypes/ only; the audit out/ dir carries its own in-flight records (TEST-verdict-c5 note 2026-10-05) | PASS | final-probe table, TEST-verdict-c5.md (JUDGED c802d6b1) |

| S-F1 | FINAL GATE (enhancement wave): independent test verdict — pytest 5/5 + red-proof, greps, 20-theme live probe (triggers/active/reduce/console/portrait), vendor integrity, JS-off sweep | PASS | TEST-verdict-c5.md `# VERDICT: PASS` (JUDGED c802d6b1, fresh tester child 5aef9a34) |
| S-F2 | FINAL GATE (enhancement wave): adversarial verdict — hardest S-rows reproduced (S-01/02/05/09/10/15/18), 20 themes × 4 modes, dual-engine hunt, overflow edge cases | PASS | DA-verdict-c4.md `# VERDICT: SHIP` (JUDGED c802d6b1, adversary child e8df8678); no P0/P1 |
| S-F3 | riding findings (DA-c4, accepted with SHIP): P2 theme 11 keeps its IO one-shot reveal engine beside GSAP (no overlap — GSAP registers 0 reveal targets; per-concern rule held, single-file standard not); P3 ledger scrub-count under-reports are direction-safe; P4 theme-13 8–20px body-level at 375 masked by html overflow-x:clip (zero visible); P4 theme-18 aria-hidden decorative markers below strict 1.4.3 (meaningful text AA both ends) | N/A | accepted-with-SHIP, no action in this wave; theme-11 P2 queued for next touch; DA-c4 §findings |

## C2 — Absence proof (rule i) and surfaces (rule j), enhancement wave
| ID | claim | STATUS | evidence |
|---|---|---|---|
| N1 | runtime CDN scroll-motion / CSS scroll-timeline is impossible | PASS | grep -rn 'animation-timeline\|view-timeline' prototypes --include=*.css --include=*.html → 0 actual declarations (7 prose-comment hits only, DA-c4 §2); non-font https:// refs across prototypes = 0 (fonts = E3 exception); DA-verdict-c4.md, JUDGED c802d6b1 |
| N2 | backend / database / api surface | N/A | pure static prototypes/ tree; no server code in the wave; the only runtime is python http.server (D6) |
| N3 | frontend surface | PASS | the wave itself: 20 index.html + per-theme js/scroll-motion.js, DA-c4 + TEST-c5 evidence rows S-F1/S-F2 |
| N4 | tests surface | PASS | pytest 5/5 + tester red-proof this cycle (TEST-c5); earlier red-proofs c2–c4 |
| N5 | docs surface | PASS | BRIEF.md §Om (portrait ruling) + DONE.md sections E/C2; E3 fonts exception noted |
| N6 | deploy surface | PASS | served copy at 192.168.5.231:8090 == repo copy (DA-c4 header md5 check); pushed to bryn1/Webdesign main @ f4ba604 |

## D — Open / N/A / limitations
| ID | item | STATUS | note |
|---|---|---|---|
| E1 | arch phase | N/A | never a declared phase for this task; ruled on record (2026-10-04); ARCH-verdict.md filed this cycle to close the loop's phase-declaration mismatch |
| E2 | push to github.com/bryn1/Webdesign | PASS | pushed 2026-10-05, main @ f4ba604 (secret scanner clean, remote head == local); MC 10088 trail append 24 |
| E3 | Google Fonts remain CDN links; vendoring needed before real adoption | BLOCKED | owner decision required — no artifact yet; non-blocking for LAN demo; fonts degrade to fallback stacks offline |
| L1 | 4 real photos only; other gallery slots = honest "Bild kommer" frames | N/A | by design per BRIEF delivery reality; portrait from owner widens reality (18 themes) |
| L2 | hidden-node demo-label tricks survive the STATIC gate (deliberate-forgery class) | N/A | accepted P4 (DA-c3): browser paint sweeps cover; accidental-edit class goes RED |
| L3 | G3/G5 P4 notes (card-18 loose tail wording; theme-20 scramble glyphs transiently include < > for ~1.5 s) | N/A | recorded P4, no action; stray-check tooling waits for settle |
