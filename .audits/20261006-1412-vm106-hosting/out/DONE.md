# DONE — vm106 hosting + de-personalization of bryn1/Webdesign (run 20261006-1412-vm106-hosting)
Parent-authored ledger (MC 3925: parent writes DONE.md LAST). Rows: ID | claim | status | evidence.

| ID | claim | status | evidence |
|---|---|---|---|
| T1 | Reconciler admission route re-derived (static type, root hosting.yaml = sole web-app gate for bryn1, mirror subset mechanics) | PASS | out/SPEC.md; parent re-runs at 5849eeb; DA c1 reproduced strict-JSON + validator |
| T2 | DE-PERSONALIZE-01: all PI copy -> placeholders; 17 raster photos (incl. 23-lab twins + 4 face-plate PNGs found by DA) -> generated art, same filenames/dims | PASS | commit 5849eeb; parent grep/md5/size proofs; T2-evidence.md; card 10181 |
| T4 | PERSONA-01 (R4 "Jane Cooper", owner verbatim) + RENAME-01 (R3.3 brand paths) | PASS | commits 96dc070 + 7e6c6a0; parent scope+grep+render proofs; card 10190 |
| T5 | Independent pre-push acceptance (3 cycles) | PASS | TEST-verdict.md FAIL(c1) -> 932614c; c2 FAIL (markup-split DIN/SALONG heroes) -> 061975e; TEST-verdict-c3.md PASS @ 061975e; red-proofs each cycle; card 10191 |
| T6 | Architecture-vs-reality (4 cycles) | PASS | ARCH-verdict c1 FIX -> FIX-ARCH-01; c2 FIX (doc rows) -> 01b; c3 FIX (fixer-introduced false claim, caught by cmp) -> 01c; c4 PASS @ 30d0de3 chain |
| T7 | Identifier repair after sweep broke JS (space-in-identifier) | PASS | 932614c; node --check 86 files 0 errors + red-sample; card 10193 |
| T8 | HOSTING-01: hosting.yaml + committed public root index/thumbs/favicon | PASS | 8336bd4; reconciler validator exit 0 (parent re-run); mirror dry-sim served=317, quarantine NONE; DA + TEST independently reproduced; card 10194 |
| T7b | FIX-ARCH-01/01b/01c doc+header fixes | PASS | c2d8fe6, 882d400, 30d0de3; parent git-show scope checks; card 10195 |
| T9 | Adversarial pre-push gate | PASS | DA-verdict-c2.md SHIP @ 30d0de3 (F1 blob-level 17/17; _comment whitelist-ignored at both parse sites; cachebust live-exercised; rollback traced end-to-end); card 10197 |
| PUSH | 9-commit chain pushed to origin/main (public go-live trigger) | PASS | `git push` PUSH_EXIT=0; `git fetch` re-GET confirms origin/main == 061975e; rebase-check before push: origin was 00b8dc5, no parallel-crew drift; pre-push secret scanner passed |
| POST | Live acceptance at https://sibbamala.com/webdesign/ | PASS | TEST-verdict-live.md PASS @ 061975e (child 99a7c404): root 200 (48 cards, 8/8 thumbs decode), 49/49 pages 200, normalized PI-scan 0 outside owner-approved portfolio persona, gsap md5 == repo blob, quarantine 12/12 (README/.git/.audits 404, bare dir 403 — no listing), console 0 + ScrollTrigger fired; parent independent probes agree (root 200/title, theme 200, README 404); adopt commit->200 ≈ 58-61 min (P4, longer than plan); card 10202 |

## Owner decisions (recorded verbatim in BRIEF; NOT re-litigated by any gate)
- R3.1 "Accept history as-is" — real photos/PI remain in public git history forever. (Orchestrator recommendation was fresh-history; overruled.)
- R3.2 "Leave it live on purpose" — sibbamala.com/anny/ keeps serving Anny's real PI (repo bryn1/anny). (Recommendation was private; overruled.)
- R4 persona = "Jane Cooper" with INVENTED demo contact data (phone/email/IG/address unverified-as-unowned); portfolio persona "Alexander Lektove · Karlskrona" owner-approved.
## Carry-forwards (non-blocking)
- P3: normalized(tag-stripped) banned-scan must accompany every copy-replacement sweep (RECIPE mechanics line 294; fleet kb stored).
- P3: JS-string/CSS url() refs are not cachebust targets (no PI path; freshness only) — Cloudflare ~4h.
- P4: tools/build-index.py 281 lines (soft ceiling); stale "LOG-ONLY" crontab comment; first-ever rollback unexecuted (paper-traced only); fonts stay Google-Fonts CDN (E3 pending).
- Post-push: prove public mirror drops .md + dir listings (local :8090 serves both — local green does not cover this).

## BROWSE-V2 increment (MC 10088.12-16, owner ruling 2026-10-07: "Webdesign/<project>, not everything on one page")
| ID | claim | status | evidence |
|---|---|---|---|
| T11 | two-level public browse (root=project cards, /salong/ + /portfolio/ pages), one generator, mirror+docs same-run | PASS | dd328b8 + 71b4fd1; TEST-c4 PASS, DA-c3 SHIP; card 10208 |
| T11d | §10 doc state block to tree truth (my post-push defect, caught by ARCH-c5) | PASS | 64dbe23; ARCH-c6 PASS; card 10214 chain |
| T11g | mirror globs narrowed /salong/*.html + /portfolio/*.html (DA-c3 P3-1) | PASS | 797d196; planted json/md/dotfile all dropped, served=319; validator PASS |
| T15 | PUSH browse-v2 (4 commits) + gate fix + doc restate | PASS | pushed 061975e..3d45e34 (adds 172fd50 gate block, 3d45e34 §10 TWO-LEVEL PUBLIC); fetch re-GETs; pre-push scanner passed |
| T16 | PUBLIC-v2 live acceptance | PASS (v3; v2 honestly BLOCKED) | TEST-verdict-live-v3.md (JUDGED 4a38f63b, base 172fd50): flip 09:20:31Z, 2/27+21 cards, thumbs+links 200, L4 18/18, PI-zero, console 0/0, red-proofs 3/3; v2 verdict stands as the BLOCKED record of the gate deadlock |
Carry: P3-2 future 3rd project needs include line; P4 §8-exc6 out/-absent row stale (harness scratch); P4 checkout _site staleness; QUALITY.md/PRODUCT.md = MC 10140.4's to commit (dod-loop shared-checkout false positives x3, + loop mirror-dir miswiring x3, on file for tooling owner).

| T17 | reconciler gate deadlock diagnosed + fixed (owner ruling 'Fix the gate rule') | PASS | P2-diagnosis.md (NEEDS-OWNER) -> agent-town edf19b1b min_bytes_mode own (selftests 4/4 + 79/79) -> 172fd50 owns floor 1200B -> publish 09:18:53Z gate[ok] 200/2706B>=1200 -> flip 09:20:31Z; card 10231 closed |
