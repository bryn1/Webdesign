# TEST-verdict-live — MC 10088.13 POST-PUSH LIVE ACCEPTANCE (https://sibbamala.com/webdesign/)

Tester profile, run 20261006-1412-vm106-hosting. Judged object: the PUBLIC mirror of bryn1/Webdesign
@ **061975e** (pushed origin/main; GitHub committer date 2026-10-06T23:07:15Z, re-queried live via API).
All probes PUBLIC over the internet; nothing on vm106 touched. Scratch + harness: `out/.tmp/`
(`acceptance.py`, `redproof.py`, `poll.sh`, `probes.tsv`, `accept.json`, `redproof.json`).

**Readings used:** (1) L2 "+ portfolio index" — no standalone portfolio index file exists in the tree;
the committed root page IS the portfolio+salong index (both h2 sections + 48 cards), so L2 = every
served HTML page derivable from `git ls-tree 061975e`: root (L1) + 49 pages (27 salong themes, salong
prototypes index, 20 portfolio prototypes, 1 portfolio concept). (2) L6 sidecar not public -> log-tail
route unreachable from vm350 (see Findings) -> row labeled UNVERIFIED with indirect evidence.
**vm106 log: UNREACHABLE** — `ssh claudecode@192.168.5.104` → "No route to host" (2 attempts, then
stopped per ssh-loop-prevention). No log verbs observed; nothing below is log-derived.

## Adopt timeline (Phase A)
- 23:07:15Z commit 061975e lands on origin/main (API committer date; push ≤23:10Z assumed for math).
- 23:22:48Z first probe (404 `{"detail":"Not Found"}` — expected bootstrap skip; each probe logged).
- 15 consecutive 404s 23:22:48 → 00:05:04 (3-min cadence, probes.tsv).
- ~23:48Z write tick ran (evidenced by `last-modified: Tue, 06 Oct 2026 23:49:14 GMT` on served pages).
- ~00:05:5Z first 200 + root-browse title (manual cachebusted probe); 00:08:04 poll-probe 200 → ADOPTED.
- **First-probe → 200: 43m07s (manual) / 45m16s (poll). Commit → 200: ≈ 58–61 min** (plan said ~35; see P4).

| probe (UTC) | code | note |
|---|---|---|
| 23:22:48 … 00:05:04 (15 probes) | 404 | app JSON 404, 22B — pre-adopt, expected |
| ~00:05:5x | **200** | `?v=` cachebust + plain `/webdesign/index.html`, title `Webdesign — prototyper & koncept`, 17439B |
| 00:08:04 | **200** | same — poll loop recorded ADOPTED, then exited |

Staleness check (Cloudflare 4h note): title is the 061975e-committed root (NOT the local `_site`
title "Webdesign — prototypes"); gsap.min.js md5 == local 061975e blob; 13-91-tal (FIX-T5C2-P1 page)
serves JANE/COOPER hero pair and zero banned tokens. Served set is 061975e, not a stale copy.

## L1 — root
200 · title `Webdesign — prototyper &amp; koncept` · 2 project sections (`portfolio — 20 prototyper, 1 koncept`,
`salong — 27 prototyper`) · 48 `.card` items · 8/8 thumbs fetched decode (PNG magic, >1 KB), 0 bad.

## L2 — all 50 served HTML pages, banned-token scan
**49/49 sub-pages + root: HTTP 200, all real HTML.** Normalized (entity-decoded, tag-stripped,
whitespace-collapsed, lowercased) scan of every fetched body for
`anny|mullers|morin|072-155|landbrogatan|karlskrona|tross|dinsalong|din salong|din stad|gatuadress|gmail`:
**0 hits outside portfolio. 0 raw-body (attribute/URL) hits. 0 raw-only hits.**
Persona (owner-approved, reported separately): 21 `karlskrona`/`alexander lektove` text hits, all on
20 pages under `projects/portfolio/` — as approved. Instrument caught 20/20 portfolio pages in a
local pre-validation (proving reach), see red-proofs.
Note: my `is_html` first-600-byte guard false-flagged `02-papperret/` (banner comment before `<html`);
manual fetch confirmed 40283B genuine `text/html`, `last-modified 23:49:14`, persona content present. Instrument note P4.

## L3 — nested assets
| asset | code | bytes | check |
|---|---|---|---|
| `…/_assets/vendor/gsap.min.js` | 200 | 72304 | md5 `719a45…8068` == local 061975e blob ✓ |
| `…/_assets/gal-01.jpeg` (placeholder photo) | 200 | 419200 | JPEG magic `ffd8ffe0` ✓ |
| `…/_assets/jane-portrait.jpg` | 200 | 487921 | JPEG magic `ffd8ffe0` ✓ |
Live page also requests both with `?v=5468a19b` / `?v=221c8c76` cachebusts → 200 (network panel).

## L4 — QUARANTINE (the finding local tests could not cover) — 12/12 GREEN
| path under /webdesign | code | verdict |
|---|---|---|
| /README.md | 404 | GREEN refused |
| /docs/ARCHITECTURE.md | 404 | GREEN refused |
| /tools/build-index.py | 404 | GREEN refused |
| /hosting.yaml | 404 | GREEN refused |
| /.git/config | 404 | GREEN refused |
| /.audits/ and /.audits | 404 | GREEN refused |
| /docs/ and /tools/ | 404 | GREEN refused |
| /projects/salong/prototypes/_assets (bare, no slash) | 403 | GREEN refused — no listing |
| /projects/salong/prototypes/_assets/ | 403 | GREEN refused — no listing |
| /projects/salong/prototypes/_assets/jane-portrait.ATTRIBUTION.md | 404 | GREEN refused |
No directory listing and no .md body served anywhere on the public surface. The mirror drops what
the local root-server serves (proven red-capable, below).

## L5 — console/JS (Playwright, 01-mork-guld)
0 console errors (0 errors + 0 warnings, full page load) · `window.gsap` = object (vendored, not CDN) ·
`ScrollTrigger` loaded · **39 triggers registered → motion file (scroll-motion.js) executed** (only that
IIFE registers triggers; `prefers-reduced-motion: reduce` = false, motion path live) · gsap +
scroll-motion network requests 200.

## L6 — hosted-index.json / reconciler health row — **UNVERIFIED (gap)**
`https://sibbamala.com/hosted-index.json` → 404 (not public); portfolio root page carries no index
fetch (static data-cmd terminal page); monorepo `bryn1/hosting` is private (API 404 unauthenticated);
vm106 ssh unreachable → log tail impossible from this seat. Indirect evidence the reconciler ran
end-to-end: the adopted product itself (mirror subset served with quarantine + cachebust wiring,
write-timestamp 23:49:14 matches the cron's :48 tick). Sidecar row itself: not observable here —
P3 finding below, never claimed.

## Red-proofs (Phase C — instruments proved able to fail) — 3/3 OK
- **R1 (L2 instrument):** saved PUBLIC 200 body → clean scan 0 hits; planted `Anny Morin … gmail` →
  RED, tokens `{anny, gmail, morin, mullers}` detected. (`redproof.json`)
- **R2 (L4 instrument):** repo-root server (`127.0.0.1:8123`, same shape as the local server that
  historically served listings) `/projects/salong/prototypes/_assets/` → instrument reports
  **RED: "200 with directory LISTING"** — a public listing would be caught.
- **R3 (L4 instrument):** same server `/README.md` → **RED: "200 body matches quarantined file
  content"** (git-blob prefix match vs 061975e). Public README leak would be caught.
- Instrument self-catch: pre-public validation exposed a vacuous-green URL-construction bug in
  `pages()` (double `/index.html`, all-fetches-fail-then-scan-empty); fixed + guarded with `is_html`
  and non-zero-size checks before any public run.

## Findings
- **P0–P2: none.** No PI token served outside portfolio; no quarantined content public; no console errors; assets byte-exact.
- **P3 — L6 sidecar health not verifiable from this seat** (hosted-index.json not public, vm106 ssh
  "No route to host" from vm350, bryn1/hosting private). Reconciler success is proven only indirectly.
  Verifier-reachability gap for future POST runs: publish a health row or open the log tail.
- **P4 — adopt took ≈58 min from push vs ~35 min planned** (write tick 23:48, origin serving ~00:05;
  gap after write tick worth a look next deploy; product unaffected).
- **P4 — instrument notes:** `is_html` guard false-flag on comment-banner page (02-papperret); stale
  local-brief claim ":8090 serves README+listings" is no longer true of the current `_site`-farm
  :8090 (red-proof therefore used a repo-root server of the same shape — proof validity unchanged).
- **Observation (not a product finding):** an unrelated pre-signed object-proxy URL appeared inside
  my first Playwright navigate tool-call despite the intended target being the sibbamala theme page;
  target resolved correctly and all checks re-ran clean. Flagging for the parent; signature not echoed here.

## Verdict
Every DoD row that is observable from this seat passed on first evidence, with instruments
red-proven non-vacuous. The single unobservable row (L6 sidecar) is an observability gap on the
verifier side, not a defect in the shipped product, and is labeled UNVERIFIED above.

# JUDGED: 6c689f6283a54c29b47e7b4afcc49b6edc8f3867ff295fa70e231309f8f59a2a
# VERDICT: PASS
