# ARCH-verdict-c6 — MC 10088 [type:design] NARROW re-verify: §10 state-block rewrite @ 64dbe23

Supersedence note, §10-only: **c5's single FIX row — CLOSED**; c5's remaining rows and all
earlier verdicts stand by reference, nothing else re-derived. Read-only; scratch `.tmp/t6c5/`.

## Chain (re-read this pass)

HEAD `64dbe23` ("hygiene (10088): §10 state block to tree truth …", docs/ARCHITECTURE.md only,
+14/−8) → `71b4fd1` ("BROWSE-V2 addendum — build-index.py header reason (TEST-c4 P3-1)",
tools/build-index.py +5) → `dd328b8` → `061975e` = origin/main; `git log origin/main..HEAD` =
{dd328b8, 71b4fd1, 64dbe23} (three unpushed).

## Checks (§10 heading, state paragraph, closing sentence vs tree truth)

| # | Check | Observed (this session, commands) | Verdict |
|---|---|---|---|
| R1 | Heading + state line: "LIVE (single-level); two-level BROWSE-V2 awaiting push" / "PUBLIC (single-level), TWO-LEVEL PENDING PUSH" | live probes: `https://sibbamala.com/webdesign/` = HTTP 200, 17439 B body = the single-level page (48 `href="projects/…"` cards, "2 projekt, 48 sidor" — structure of pushed 061975e; mirror `?v=` cache-busters as in c5); `/webdesign/salong/` = **HTTP 404** (dd328b8 unpushed, confirmed: origin/main = 061975e) | PASS |
| R2 | "origin/main = 061975e (reflog: pushed 23:07)" | `git rev-parse origin/main` = 061975e; reflog `origin/main@{0} 2026-10-06 23:07:15 update by push` — matches c5's finding exactly | PASS |
| R3 | "Live acceptance passed 2026-10-07 (run out dir: TEST-verdict-live.md … adopt ~60 min … all 50 public pages 200, quarantine refused, zero PI, console clean)" | `out/TEST-verdict-live.md` exists, own `# VERDICT: PASS` (L119); its adopt timeline (push 23:07 → write tick ~23:48 → all-200 ~00:05+) is consistent with "~60 min"; it honestly labels its vm106-log row UNVERIFIED — §10 makes no log-derived claim, no laundering | PASS |
| R4 | Mirror include shorthand still 1:1 | `git diff dd328b8 64dbe23 -- hosting.yaml` empty; parsed includes = **14**; §10 shorthand (`/index.html` + `/salong/**` + `/portfolio/**` + projects/** html/css/js/fonts/images + `thumbs/**` + `/favicon.*`) matches entry-for-entry (c5 arithmetic unchanged) | PASS |
| R5 | No NEW contradicted claim | remaining sentences re-read: "PRE-BROWSE-V2 single-level … all 48 prototype cards on one page, commit 061975e" (48 cards counted on the live body — true); "after the next push + reconciler tick … must be re-stated as two-level-LIVE" (correctly future-tense, the c6-successor's job); ":8090 and the public mirror now serve the same product in two stages" — hedged wording (same prototypes, different browse generations), not contradicted; "the public URL is the public demo surface" (R1 probe) | PASS |
| R6 | Doc size | `wc -l docs/ARCHITECTURE.md` = 265 < 300 | PASS |

## Also closed as a side effect

`71b4fd1` added the build-index.py **header reason** (~320 lines > 250 soft, one-file monogamy
rationale, citing ARCH-c5 C3) — c5's C3 **P3 note CLOSED**; hygiene rule satisfied for the
>soft file (and it was never over the 400 hard ceiling anyway).

## Carried forward (non-blocking, owner-carry)

P4 (TEST-c4 P4-1, confirmed still open): §8 exc-6 (L218) "Repo-root `out/` stray dir — RESOLVED
2026-10-05" is stale again — repo `out/.tmp/` is in live use as harness scratch (TEST-verdict-live's
own harness lives there; this pass too). Either re-word exc-6 to "out/ is sanctioned scratch,
gitignored" or gitignore `out/` explicitly in the next hygiene touch. No fix required now.

## Statement

Pre-push doc+tree state for the §10 surface is coherent: heading, state block, acceptance
citation and mirror shorthand all re-derived TRUE against git and the live host this session.
The c5 FIX is discharged. Nothing in the rewrite introduced a contradicted claim.

# JUDGED: 393de17678deb20d4858b6c6eca28bde02bf5b75f9b599ca5aab7bb7f172b803
# VERDICT: PASS
