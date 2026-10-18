# P2-diagnosis — MC 10088.16: vm106 reconciler has not re-mirrored bryn1/Webdesign after push 797d196

Infra profile, run 20261006-1412-vm106-hosting. Date of run: 2026-10-07 08:25–08:30 UTC. Read-only;
NOTHING was changed. Verdict: the reconciler is NOT stalled — it saw the push on the very next tick
(06:33:44Z, push+5min) and has been **deterministically REFUSED by the staging gate** on every tick
since, because v2's legitimately smaller root trips a size-regression floor derived from the
still-live v1 page. No repo-side or log-side lever exists to clear it → owner decision.

## Channel (how state was read — no ssh to vm106 needed)

Per skill vm106-reconciler, the reconciler **runs on VM350 (this host)**, not on vm106; vm106 is the
deploy target reached by the reconciler's own `web@192.168.5.106` channel. All state below is local:
crontab line 28 `3-59/15 * * * * /home/claudecode/agent-town/infra/vm106/repo-visibility-hosting/reconcile.sh`
→ `/home/claudecode/logs/repo-visibility-hosting/{cron,reconcile}.log` (both alive, mtime 08:19:01Z).
The vm106 channel is provably healthy (every tick ends with `hosted-index.json WRITTEN (vm106) ->
web@192.168.5.106:/var/www/portfolio/hosted-index.json … atomic rename` at 08:19:00).
Mode probe re-run this session: `check_reconciler_mode.sh` exit 0 →
`RECONCILE_WRITE=1  DISCOVERY_SOURCE=api  VISIBILITY_SOURCE=api  READ_TOKEN=set  MODE: ARMED`.

## Commands + output (all this session, UTC)

1. Cron fires — tick cadence + result (`cron.log`):
   `2026-10-07 08:19:00+0000 === reconcile tick done (rc=1) ===` (rc=1 = refusal alert fired, the
   tick itself completed normally; ticks at 06:33, 06:48, 07:03, 07:18, 07:33, 07:49, 08:03, 08:18
   all present).

2. Push WAS seen immediately — first tick after the 06:28:47Z push (`cron.log:740306-740472`):
   ```
   06:33:45 RESOLVED webdesign type='static' … root='apps/webdesign' src={'type':'hosting.yaml',…}
   06:33:47 webdesign: HOST hosted_desired=True -- clean+public (… history: 4 commit(s) since 061975e1;
            static index.html 2673B, git-blob parity ok; … product path /webdesign/ HTTP 200)
   06:33:50 webdesign [static] repo@797d196a spec<-repo hosting.yaml trigger=MIRROR
            (repo HEAD 797d196a != mirrored_sha 061975e1)
   ```
   The reconciler clone carries 797d196 — its fetch/pull is NOT stuck. Plan produced
   (`WRITE apps/webdesign/index.html`, `portfolio/`, `salong/`, 319 files extracted).

3. The refusal — on EVERY tick, 8× since 06:33:55 (`grep -c "2026-10-07T.*REFUSE webdesign: staging
   gate RED"` → 8). From the 08:18 tick (`cron.log:745731-745754`):
   ```
   gate[ok ] candidate-received: 319 file(s) extracted to /var/www/portfolio-staging/apps/webdesign
   gate[ok ] live-shape-parity / staging-render / bare-prefix-redirect / no-source-leak / assets-resolve
   gate[RED] product-path: GET /webdesign/ -> 200, 2706B (floor 8719B)
   REFUSE webdesign: staging gate RED -- product path /webdesign/ returned 200 with 2706B
   WOULD-ALERT [MIRROR-REFUSE] webdesign … mirrored_sha NOT advanced, last-good kept
   ALERT [HOST-REFUSED:webdesign] still refused (MIRROR-REFUSE at STAGING GATE / MIRROR (between git
        and publish)), same fault since 2026-10-07T06:33:55.832964+00:00 -- card already open
   ```

4. Root cause, code-verified in `/home/claudecode/agent-town/infra/vm106/repo-visibility-hosting/staging.py`:
   - line 61-66: `MIN_BYTES_FRAC = 0.5`, comment: *"a mirrored page smaller than this fraction of
     what is served today is a gutting, not an edit"*.
   - lines 171-175: `min_bytes = max(MIN_BYTES_FLOOR, int(os.path.getsize(cur) * MIN_BYTES_FRAC))`
     where `cur` = **the currently-live last-good entry page on vm106**. Live root = 17439B (measured
     probe #5) → `int(17439*0.5)` = **8719** = exactly the logged floor. Candidate v2 root served =
     2706B (2673B on disk + injected `?v=` cache-bust). 2706 < 8719 → RED, every tick, deterministically.
   - `min_bytes = max(min_bytes, int(gate_block.get("min_bytes") or 0))` — a repo `gate` block can only
     RAISE the floor, never lower it. **There is no sanctioned per-repo hosting.yaml override that
     passes this gate.** (Docstring line 139-140: "A `gate` block only ever ADDS … may raise min_bytes.")

5. mirror-state + public probe (08:26Z):
   `~/.cache/repo-visibility-clones/mirror-state.json` → webdesign `status=mirrored,
   repo_sha=061975e1…, last_promote_ts=2026-10-06T23:49:15Z` (pinned at last night's v1 — never
   advanced, exactly matching the origin `last-modified 2026-10-06T23:49:14GMT` from TEST-verdict-live-v2).
   `curl https://sibbamala.com/webdesign/` → **200, 17439B, 48 × class="card"** (OLD);
   `/webdesign/salong/` → **404**. No flip while I worked.

## Classification (per skill vm106-reconciler)

NOT: cron stall (fires every tick, rc reported), lockfile, stale clone (clone at 797d196a, "history:
4 commit(s) since 061975e1"), push-blocked on the monorepo, apps.yaml oscillation, legitimate long
queue (webdesign is evaluated 40/41 and acted on first within its tick), rollback latch (status is
`mirrored`, not `rolled_back`; trigger is `MIRROR (repo HEAD != mirrored_sha)`, not DRIFT/NOOP),
staging stale-scratch class (forbid-path rows all ok; the RED row is product-path SIZE), or the
REFUSE-PRODUCT hosted_desired=False deadlock (hosted_desired=True here).

IS: **staging-gate product-path size floor vs a legitimate content reduction** — a fourth gate-class
sibling of the skill's bootstrap deadlocks: the regression floor is sized from what is served TODAY,
so any intentional >50% reduction of the entry page can NEVER bootstrap, no matter how many ticks or
commits pass. v2's design deliberately moved the card grid into `/salong/` (27 cards) and
`/portfolio/`, leaving a 2-card 2673B root; the gate reads that as "gutted, not an edit".

## Action taken: none (read-only)

Skill-sanctioned fixes for the named classes (per-repo `mirror` block, mirror.py DEFAULT change,
staging scratch wipe, reconcile.py product-gate bootstrap fix) all target other gates; none lowers
the staging size floor, and staging.py is ARMED-gate admission logic — editing it requires explicit
owner go per skill ("Since this changes an ARMED host gate's admission logic, always confirm explicit
owner go first"). My brief additionally forbids touching reconcile.py, apps.yaml, vm106 nginx, the
Hemsidor repo files. Repeating the push changes nothing (same SHA → gate recomputes same floor from
same last-good). Alert card already open on the svarkor board as `[HOST-REFUSED:webdesign]`.

## What would resolve it (for the owner/top-orchestrator, recommendation in bold)

- **(a) RECOMMENDED — owner go + orchestrator code change in `staging.py`**: let a repo `gate`
  block explicitly OWN the floor (a `gate.min_bytes_override` / allow-lower semantic, or size floor
  from the repo HEAD's `gate.min_bytes` when declared), land per fleet-shared-skill/commit discipline,
  verify with the staging selftest, then next tick publishes v2 unattended. General fix for the class.
- (b) One-shot: owner-directed manual publish of the already-staged tree on vm106 (operator action on
  vm106, outside this seat; the reconciler would then latch the new last-good on the following tick).
  Product-repo stays untouched.
- NOT a fix: padding the root with filler to game the byte floor (fights the gate with product
  content); re-pushing (deterministic same refusal); clearing "the latch" (there is no latch).

## Postscript probe rule

If public root later shows ~2673–2706B / 2 cards and `/salong/` 200, the flip happened; none was
observed as of 08:26:5xZ (this run's close).

# JUDGED: afb6b92e6f15ffb0eca000a9ac88f4122aaf1ba089761298ddd5e8fa33a3e9e5
# VERDICT: NEEDS-OWNER — staging size floor (half of last-good 17439B = 8719B) refuses v2's legitimate 2673B root every tick; needs owner go to let a repo gate block lower the floor (or one-shot operator publish on vm106); re-pushing never helps.
