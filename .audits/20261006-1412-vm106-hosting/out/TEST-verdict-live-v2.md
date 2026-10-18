# TEST-verdict-live-v2 — MC 10088.16 POST-PUSH LIVE ACCEPTANCE v2 (BROWSE-V2) — https://sibbamala.com/webdesign/

Tester profile, run 20261006-1412-vm106-hosting. Judged object: the PUBLIC mirror of bryn1/Webdesign
@ **797d196ac3b7…** (two-level layout; API committer date 2026-10-07T06:28:47Z, origin/main == 797d196
verified via API + local fetch). All probes PUBLIC over the internet; vm106 not touched (ssh
unreachable from this host per brief — public-side evidence only, same as last night).
Scratch + harness: `out/.tmp/v2/` (`poll_v2.sh`, `probes-v2.tsv`, `instrument.py`, `accept_v2.py`,
`redproof_v2.py`, `redproof_v2.json`, `bodies/`).

**Readings used:** (1) "two-level root detected" = root 200 with EXACTLY 2 `class="card"` occurrences
(v2 root = 2673B committed) AND `/webdesign/salong/` 200; the old root is unmistakably 48 cards/17439B
— no false-negative possible. (2) Phase C premise ":8090 serves README.md (IS served there)" is
**CONTRADICTED** for the current :8090 (measured: `http://192.168.5.231:8090/README.md` → 404, root 200)
— consistent with last night's P4 note; red-proof therefore ran the same instrument against a
same-shape repo-root server (python http.server @127.0.0.1:8131), proof validity unchanged.

## Phase A — WAIT: v2 NEVER APPEARED within the 90-min window → gate unmet
- Push: origin/main 797d196, committer 06:28:47Z (GitHub API). First probe 06:38:04Z, 3-min cadence,
  31 poller probes (06:38→08:06) + manual overshoot probes at 06:38 (headers) and 08:11 / 08:13:44
  (past the cap, recorded). Table: `probes-v2.tsv`. **All 33 observations: OLD** (root 200 · 17439B ·
  48 cards · /salong/ 404). **Flip timestamp: none observed.** Poller exited at its 90-min cap
  08:09:39Z → TIMEOUT_90MIN.
- **Old-vs-new distinguished explicitly, and it is NOT cache-staleness:** served `last-modified` is
  pinned at `Tue, 06 Oct 2026 23:49:14 GMT` (= last night's write tick) at 06:38 AND at 08:13:44;
  `cf-cache-status: DYNAMIC` on the HTML pages (Cloudflare not caching HTML; probes additionally
  cachebusted per-request). Conclusion: the reconciler had **not yet written the v2 mirror** at
  push+105 min; no v2-relevant write tick is evidenced. Last night: write tick ≈ +41 min, origin
  serving ≈ +58–61 min. Tonight nothing by +105 min — CONTRADICTED pace. Log verbs unobservable
  (vm106 ssh unreachable; P3 carried over).

## Phase B — L1–L6: NOT RUN (premise unmet). The live site at window close serves the OLD
single-level mirror (48 cards, pre-BROWSE-V2). Grading the old mirror against v2's DoD would be a
category error, and grading v2 requires the artifact to be observable. Rows and their harness, ready
to execute in one pass on a re-spawn after flip:
| row | DoD | status | harness ready in .tmp/v2/ |
|---|---|---|---|
| L1 | root 200, 2 cards, 2 thumbs decode | NOT RUN (flip never detected) | accept_v2.py L1 |
| L2 | /salong/ 200+27 cards+thumbs; /portfolio/ 200+20+1; card-links + nav-back `../` at public depth | NOT RUN | accept_v2.py browse() (48 card links + 48 thumbs + nav-back all fetched, urljoin at public depth) |
| L3 | 01-mork-guld + 01-rutorn 200 + titles (`Jane Cooper — Frisör i Malmö`, `01 · Rutorn — Alexander Lektove`); gsap bytes == 797d196 blob | NOT RUN | accept_v2.py theme()+gsap; local md5 `719a45…38068` 72304B re-confirmed at 797d196 (unchanged vs 061975e) |
| L4 | v2 quarantine: salong/portfolio .md paths, README/.git/.audits/hosting.yaml refused; bare dirs no-listing; theme dir w/ slash 200 | NOT RUN for v2 (paths absent from old mirror → 404 proves nothing there) | accept_v2.py Q-table; instrument red-proven (below) |
| L5 | tag/ws-normalized banned scan, 5 pages (persona separate) | NOT RUN on v2 bodies; instrument run on saved public root body: baseline clean 0 hits | instrument.py l5_scan; local pre-scan agrees (root/salon/mork-guld 0; portfolio persona rows as approved) |
| L6 | playwright root+/salong/ 0 errors, thumbs decoded | NOT RUN (/salong/ 404 whole window; old-root playwright would grade the wrong artifact) | browser route ready |

### Carried-over finding — projects/ root directory (last night's concern) — PARTIAL, GREEN on live surface
Probed NOW against the served (old) mirror — renderer/nginx refusal rules are mirror-version-agnostic,
so the signal transfers, but the v2 re-probe still belongs to the post-flip run:
`/webdesign/projects` → **301** (nginx redirect) → `/webdesign/projects/` → **403, no listing** (nginx
403 body, 200-byte error page). GREEN: no directory listing. (Mirror-sim on 797d196 confirms the served
set = 319 files, matching the brief; `projects/` dir has no index.html in the mirror → renderer refuses.)

## Phase C — RED-PROOFS: instruments proved able to fail (ran independent of the flip) — 3/3 meaningful RED
- **R1 (L5 instrument):** saved PUBLIC root body (old mirror, 17439B) → clean scan **0 hits**; planted
  `Anny Morin · anny.morin@gmail.com · 072-155… · Landbrogatan, Karlskrona` → **RED**, hits
  `{072-155, anny, gmail, karlskrona, landbrogatan, morin}`. (`redproof_v2.json`)
- **R2a (L4 instrument, README leak):** repo-root server `/README.md` → **RED**: "200 body matches
  quarantined file content" (prefix match vs 797d196 blob). A public README leak WOULD be caught.
- **R2b (L4 instrument, listing leak):** same server, index-less dir `/projects` → **RED**: "200 with
  directory LISTING". A public listing WOULD be caught.
- Honest case-note: my own third case `/salong` (bare, local) returned the dir's index.html — NOT a
  listing — instrument classified it green correctly; my test case was wrong, not the instrument.
- Instrument self-check carried: same `instrument.py` produced green scans and red catches; L1–L6
  harness imports the identical functions (no self-contained copy).

## Findings
- **P2 — vm106 reconciler write tick did not land within push+105 min** (last night ~+41 min; served
  `last-modified` still 2026-10-06T23:49:14 at 08:13:44, HTML cf=DYNAMIC ⇒ not-yet-mirrored, NOT
  Cloudflare staleness). Deploy-pipeline health, not a product defect; blocks this acceptance. Needs
  vm106-side observation (reconciler log verbs ADOPT/WRITE for 797d196) — unreachable from this seat.
- **P3 — verifier-reachability gap persists** (carried from TEST-verdict-live): no log tail, no public
  health row; mirror-write can only be judged by origin `last-modified` + content fingerprints.
- **P4 — task premise CONTRADICTED:** :8090 no longer serves README.md (measured 404); red-proof used
  the same-shape repo-root server precedent (last night's P4 note stands).
- **P4 — tester-tool note:** a `pgrep -f poll_v2.sh` waiter self-matched its own command line and hung;
  fixed with a bracket-pattern waiter (no product impact, harness lesson recorded here).
- **P0–P1: none found.** Nothing v2-served could be disproven; nothing v2-served could be confirmed.

## Verdict
The Phase A gate ("root 200 AND two-level") never opened within the stipulated 90-minute polling
window + 6-min overshoot: the public site still served the pre-BROWSE-V2 mirror at close, with origin
evidence (pinned last-modified, DYNAMIC cache status) showing the write tick had not run — the old
mirror is EXPECTED stale state, not a product failure, and is not being graded. Phase B is therefore
unobservable, not failed; the complete B/C harness is staged and green/red-proven where it could be
exercised. A PASS would certify an unobserved artifact; a FAIL would grade the wrong artifact.

# JUDGED: 2decb6e6e8cb0ce77bd9952149968909acb590c7b24192ab72575a441f3bf8ee
# VERDICT: BLOCKED
