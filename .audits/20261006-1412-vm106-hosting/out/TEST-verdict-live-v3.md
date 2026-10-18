# TEST-verdict-live-v3 — MC 10088.16 POST-PUSH LIVE ACCEPTANCE v2 (BROWSE-V2) — https://sibbamala.com/webdesign/

Tester profile, run 20261006-1412-vm106-hosting. Judged object: the PUBLIC mirror of bryn1/Webdesign
@ **172fd50** (= 797d196 BROWSE-V2 + hosting.yaml gate-floor line; `git diff 797d196..172fd50` = one
line in hosting.yaml, site tree identical; origin/main verified by fetch this session). Continuation
of TEST-verdict-live-v2.md (which stays as the honest BLOCKED record — untouched). Harness: same
staged `out/.tmp/v2/` (accept_v2.py, instrument.py, redproof_v2.py, accept_v2.json, redproof_v2.json,
bodies/); base refs re-pointed 797d196→172fd50 before run.

## Adopt timeline (old→new flip)
- 06:28:47Z push 797d196 (GitHub API, v2 record). 33 probes to 08:16:45Z all OLD (v2 record).
- Root cause of the slow window (parent-side evidence, quoted not re-verified here): reconcile.log
  showed BROWSE-V2 publish refused 11x by the old half-of-v1-root entry-page floor; owner ruled
  "Fix the gate rule" → commit 172fd50 (min_bytes_mode own, floor 1200).
- 09:18Z reconcile tick (parent-quoted): repo@172fd501, gate[ok] product-path 200 2706B, wrote
  index.html + salong/ + portfolio/, 319 files. **Flip 09:20:31Z** (parent watcher: root[200 2706]
  salong[200]). My own bounds: last OLD observation 08:16:45Z; first NEW 09:25:55Z (200/2706B/2 cards/
  lm 09:19:04 GMT/cf DYNAMIC). Commit→200 ≈ 2h52m total (172fd50 gate-line commit→200 ≈ 0–25 min).
- Served 2706B vs committed 2673B = +3×11B `?v=` cachebust rewrites (2 img + favicon) — arithmetic
  exact, not drift. Unchanged pages keep old per-file last-modified (23:49:14) — rsync-like delta,
  a freshness signal, not staleness (root/salong/portfolio all carry 09:19:04).

## L1 — root — PASS
200 · title `Webdesign — prototyper &amp; koncept` · **exactly 2 project-card links** (portfolio, salong)
· thumbs fetched 2/2: PNG magic, 63290B + 47568B.

## L2 — browse pages — PASS
| page | code | cards | title | thumbs | card-links at public depth |
|---|---|---|---|---|---|
| /webdesign/salong/ | 200 | **27** | `salong — prototyper & koncept` | 27/200 (PNG, >1KB) | 27/27 real HTML |
| /webdesign/portfolio/ | 200 | **21 (20+1)** | `portfolio — prototyper & koncept` | 21/200 | 20/21 clean + 1 instrument note (below) |
- **nav-back `../` public-depth correctness:** from BOTH pages the nav href `../` resolves to
  `https://sibbamala.com/webdesign/` → 200, 2 cards, 2706B. Proven at public depth (local copy cannot).
- Instrument note (P4): portfolio `20-vaxtrum/` flagged by my start-anchored `re.match` HTML guard —
  manual fetch: 39097B genuine `text/html`, correct title (`20 · Växtrum — Alexander Lektove`), body ==
  172fd50 blob **modulo CF email-protection rewrite** on the persona mailto line (line 610; CF edge
  transform, 0 `?v=` on the page) — the comment banner before `<!DOCTYPE>` broke my guard, same class
  as last night's 02-papperret note. Not product.

## L3 — click-through + vendored gsap — PASS
01-mork-guld/ → 200, title `Jane Cooper — Frisör i Malmö` ✓ · 01-rutorn/ → 200, title
`01 · Rutorn — Alexander Lektove` ✓ · page ref `../_assets/vendor/gsap.min.js?v=5468a19b` → 200,
72304B, md5 `719a45343c48856423b8586bd9f38068` == 172fd50 blob **byte-identical** (modulo ?v=).

## L4 — QUARANTINE (v2-relevant, narrowed globs) — 18/18 GREEN
- Planted-shape paths on the NEW dirs: /salong/NOTES.md, /salong/README.md, /portfolio/README.md,
  /salong/index.md → **404** each (the `*.html` include holds).
- Standing set: /README.md (blob-prefix ref, no match), /docs/ARCHITECTURE.md, /tools/build-index.py,
  /hosting.yaml, /.git/config, /.audits/, /.audits → all refused (404).
- **Bare dirs no-listing:** /projects AND /projects/ → **403, no listing** (carry-over item, now
  re-probed on the REAL v2 mirror; explicit chain: /projects → 301 → /projects/ → 403; note the 301
  Location carries `http://` scheme — cosmetic behind CF, P4). /salong, /portfolio (bare) → 200 index
  page via renderer dir-index — NOT a listing (their index.html is mirrored content; required behavior).
- Theme dir trailing slash: /projects/salong/prototypes/01-mork-guld/ → 200 (dir-index via renderer) ✓.

## L5 — PI scan (normalized: entity-decoded, tag-stripped, ws-collapsed, + raw-body pass) — PASS
root 0 · /salong/ 0 · /portfolio/ 0 · 01-mork-guld 0 · 01-rutorn 0 banned hits (banned set per
c2-common, incl. gmail). Persona rows (owner-approved, reported separately): `alexander lektove` on
portfolio browse + rutorn, `karlskrona` on rutorn — all inside the portfolio zone, as approved.

## L6 — console (Playwright, run live this time) — PASS
- Root: 0 errors + 0 warnings full load · DOM 2 cards · 2/2 thumbs decoded (complete && naturalWidth>0,
  cachebusted URLs confirmed in DOM).
- /salong/: page-scoped 0 errors + 0 warnings · 27/27 imgs decoded, 0 failed · nav href `../` in DOM.
- Session-scoped console carried 4×403 errors from a harness-layer navigation anomaly (two
  `browser_navigate` calls rewrote my /salong/ URL to a pre-signed object-proxy URL — 2nd consecutive
  session; worked around with client-side `location.assign`, then verified `location.href` before
  judging; 403s were that proxy host + its favicon, zero from sibbamala). P3 to the harness layer.

## Red-proofs (Phase C) — re-run against the FRESH v2 root body (2706B saved 09:28) — 3/3 meaningful RED
- R1: clean scan 0 hits → planted `Anny Morin … gmail … Landbrogatan` → RED `{072-155, anny, gmail,
  karlskrona, landbrogatan, morin}`.
- R2a: same-shape repo-root server /README.md → RED "200 body matches quarantined file content" (vs
  172fd50 blob). R2b: index-less dir → RED "200 with directory LISTING". (R2 salong-case green =
  my bad test case, documented v2: index.html served legitimately.)
- Same `instrument.py` produced every green row above — no self-contained copy (SOUL discipline).

## Findings
- **P0–P2: none.** No PI outside approved zone; no quarantined path served; no listings; assets
  byte-exact; console clean; card counts exact (2/27/21).
- **P3 (recurrence, harness layer):** browser_navigate URL-rewrite anomaly hit 2 consecutive sessions
  (pre-signed proxy URL injected instead of target). Leaf workaround = client-side assign + href
  verification; the proxy signature is NOT echoed here beyond host identification.
- **P3 (carried, unchanged):** log/sidecar rows still unobservable from this seat — write-tick evidence
  here is PARENT-QUOTED (reconcile.log), labeled as such; product rows are all self-observed.
- **P4 notes:** my `re.match` HTML-head guard start-anchoring (20-vaxtrum flag; genuine page proven);
  CF email-protection transforms persona mailto in served HTML (byte-compare HTML vs repo blob only
  modulo CF transforms; .js blobs unaffected, md5-exact proven); 301 Location http-scheme; delta
  last-modified semantics on unchanged mirror files.
- **P2 (closed by owner mid-run):** slow adopt 06:28→09:20 was the entry-page floor rejecting the
  small v2 root 11x — fixed in-repo at 172fd50 per owner ruling; this run IS the fix's live proof.

## Verdict
Every DoD row observable from this seat passed on first evidence against the live v2 mirror at
172fd50, with the quarantine narrowed-glob shapes specifically exercised and the instruments
re-proven red-capable on today's bytes. The v2 record's BLOCKED stands as the honest pre-flip state.

# JUDGED: 4a38f63b040014db514a0b72dab6c4d126db87d9cba479d62d53c74fea8a00fd
# VERDICT: PASS
