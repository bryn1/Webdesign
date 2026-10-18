COMMON c2 CONTEXT (for TEST-c2, DA-c2, ARCH-c2 over the final pre-push tree)
Run dir: .audits/20261006-1412-vm106-hosting/out/  (BRIEF.md gate block + rulings R2/R3/R4 bind all)
Commit chain on main (all local, NONE pushed): 5849eeb DE-PERSONALIZE-01 -> 96dc070 PERSONA-01 ->
7e6c6a0 RENAME-01 -> 932614c FIX-T5-P1 (identifier repair, node --check 86 files clean) ->
8336bd4 HOSTING-01 (hosting.yaml + committed root index.html + 48 thumbs + favicon + generator) ->
44db35b(+amend) FIX-ARCH-01 (doc de-stale + 6 css reason lines). Confirm actual HEAD + parent chain
with git log before judging; your --base must be gate-time HEAD (the trigger gives it; recompute hash
as your LAST step).
c1 verdict dispositions: TEST c1 FAIL (P1 fixed in 932614c, proven live) / ARCH c1 FIX (all A1+A3 rows
applied in FIX-ARCH-01; verify against tree) / DA c1 FIX (F1+F3 -> DE-PERSONALIZE-01 + FIX-T5-P1; F2
-> hosting.yaml description now PI-free: "…för en frisörssajt…" verified strict-JSON parses; F4 ->
R3.3 rename done). History-accept (R3.1) and /anny/-leave-live (R3.2) are OWNER DECISIONS recorded
verbatim in BRIEF — c2 must record them as owner-override rows, NOT re-litigate, NOT block on them.
Open item c2 should carry forward (not block): portfolio persona "Alexander Lektove · Karlskrona" is
owner-approved persona; @jane.cooper handle + +46 70 123 45 67 + jane.cooper@example.com +
Drottninggatan 2 Malmö are INVENTED demo data, unverified-as-unowned, disclosed.
Local served site: http://192.168.5.231:8090/ (:8090 serves gitignored _site symlink farm into
projects/ — re-run python3 tools/build-index.py if _site looks stale, it is deterministic).
VM106 public facts you need: reconciler ARMED (crontab 3-59/15, probe-verified; "LOG-ONLY" comment
stale); public URL after push = https://sibbamala.com/webdesign/; adopt ~15 min tick + write tick
= ~30 min; Cloudflare caches static ~4h no purge; rollback = git revert 8336bd4 removes hosting.yaml
-> repo back to SKIP-NOT-WEBAPP (rehearsed on paper only, never executed).
POST-PUSH acceptance duty (record as the run's LAST phase, whoever runs it after the push): prove on
the LIVE URL that (1) the root + a theme + nested vendored gsap.min.js all answer 200 under
/webdesign/, (2) a .md path and a directory listing are NOT served (local :8090 serves both — the
mirror is supposed to drop them: local proof does NOT cover this), (3) zero PI tokens on the served
set, (4) hosted-index.json healthy row for webdesign. Reconciler log verbs to expect: ADOPT ->
subset served=… -> WRITE apps/webdesign/… -> apps.yaml WRITTEN -> push CONFIRMED.
