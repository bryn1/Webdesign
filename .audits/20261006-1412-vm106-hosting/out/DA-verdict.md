# DA-verdict — MC 10088 gate over vm106 hosting SPEC + R2 (devils-advocate, 2026-10-06)

Read-only review; scratch under `.tmp/dada/` only. Repo HEAD verified `00b8dc5`, clean tree.
All commands were executed THIS session from `/home/claudecode/Hemsidor`.

## Refuted attacks (the plan survives these — evidence)

1. **hosting.yaml §1 is mechanically sound.** Extracted the fenced block, `json.loads` OK (keys:
   name/type/root/title/description/tags/mirror). reconcile.py:838 assigns `type,exec,port,websocket`
   + HEALTH_KEYS; `sanitize_meta` (reconcile.py:1505-1521) accepts title/description/tags; `mirror`
   block read at mirror.py:167-168; `root` forced to `apps/<name>`, `name` from `hosting_name()` —
   all as SPEC claims. Real bar run: `validate-hosting.py .tmp/dada/tree` (SPEC block + stub) →
   **VERDICT: PASS, exit 0**.
2. **Glob semantics confirmed from source, not SPEC cites.** `_glob_re` (mirror.py:107-143): no-`/`
   = basename-anywhere; leading/embedded `/` anchored; `**` crosses dirs; `foo/**` also matches `foo`.
   `match_globs` last-match-wins with `!`. include/source REPLACE, exclude/preserve EXTEND
   (mirror.py:174-185). The include list is expressible as written.
3. **Dry run REPRODUCED exactly** (`python3 .tmp/p1/dryrun_mirror.py`, tree verified == HEAD tracked
   305 + stub): `served=268 source=0 dropped=38`, root doc served, 0 `.md`, 0 tools/docs,
   html=50, default-include serves only 50 (SPEC's "defaults render the site unstyled" is TRUE —
   DEFAULT_STATIC_INCLUDE js/**,css/** are root-anchored, mirror.py:58-60).
4. **Forbid gate cannot be 200'd (static).** nginx template: `location /{name}/ { alias {workdir}/; }`
   — no try_files catch-all (vm106-render-apps.py:366-367); dropped files are never staged, and
   `forbid_path_verdict` (staging.py) is catch-all-aware + fail-closed (same-ext control, byte compare).
   The THIRD-gate-layer (staging-scratch stale files) fix IS shipped: gate does
   `rm -rf "$APPROOT"; mkdir -p "$APPROOT"` before every extract (vm106-staging-gate.sh:224);
   live mirror also prunes deletes (mirror.py:438,462-465). First-time app: no stale-scratch class.
5. **cachebust "all" breaks nothing on these 49 pages.** Zero `srcset` anywhere; zero ES-module
   imports; every `?`-carrying ref is the Google-Fonts CDN (skipped by `_SKIP_PREFIX`); CSS `url()`
   targets (local .woff2 fonts, lab plate PNGs, data-URIs) all resolve inside the served subset.
   No `href="#…"` risk (href rewritten only in `<link>`).
6. **No secrets in the served subset.** 50 files match a secrets regex — all hits are `token` inside
   design-`tokens.css`/`base.css` design-token files (false positives, verified by file names/paths).

## Findings (ranked)

### P1-A · Git HISTORY leaks the real PI/photos TODAY — R2 does not fix this [owner decision]
`bryn1/Webdesign` is public NOW (`api.github.com/repos/bryn1/Webdesign` → `"private": false`).
- Real photos entered history 2026-10-04: `git log --all --diff-filter=A --name-only -- '*.jpeg' '*.jpg'`
  → `0b26f13 prototypes/_assets/gal-01..04.jpeg`; `1ef4e9e prototypes/_assets/anny-portrait.jpg`.
- **Publicly downloadable by SHA right now:** `curl -sI https://raw.githubusercontent.com/bryn1/Webdesign/1ef4e9e/prototypes/_assets/anny-portrait.jpg`
  → `HTTP/2 200 … content-type: image/jpeg`. (HEAD-probed only; not downloaded.)
- Phone/email/address in history: `git grep -l '072-155 48 60' 0b26f13` → `0b26f13:BRIEF.md`;
  gmail in html since `abbd8bf`/`317c5d0` (2026-10-04).
- Content severity (verified by viewing): `gal-01.jpeg` = real client in the real salon;
  `_assets/gal-01.jpeg` md5 `7b56a1d3…`. `23-lab-anny-real/assets/plates/om-portrait.png` and
  `24-lab-anny-flag/assets/plates/portrait.png` are **full identifiable face selfies**, with what
  appear to be ID cards visible in the phone case — third-party personal data.
R2 replaces files in a NEW commit; every older commit still yields the originals. "Placeholders
everywhere" is therefore **not honest as a containment claim** — it cleans the working tree only.
Options: (a) history rewrite + force-push — destructive, shared repo (parallel crew MC 10062.30.1),
GitHub may retain orphan objects / re-attach via refs; (b) fresh-history repo/branch (cleanest
containment, loses history); (c) leave + disclose to owner AND Anny (third parties, GDPR angle);
(d) interim: flip repo PRIVATE immediately (reconciler skips private — seen in the 13:33 tick),
decide, then re-public. **Recommendation: (d) now, then (b) fresh history with R2 applied from the
first commit; owner notifies Anny.** The doctrine (owner-safety, third-party data, destructive
action ⇒ owner go) puts this squarely on the owner — but it must be HIS call, recorded, before the
push is celebrated as "de-personalized".

### P1-B · The OLD /anny/ app serves real PI publicly on the SAME box — plan neither refreshes nor retires it [owner decision]
`apps.yaml` has `anny` (static, `apps/anny`) — mirror of **a different repo, `bryn1/anny`**
(reconcile.log 2026-10-18:18:52Z: `anny [static] repo@955fd440 … repo=https://github.com/bryn1/anny`;
that repo is also public: `"private": false`). `~/hosting/apps/anny/` (read-only inspection):
`<title>Anny Morin — Frisör i Karlskrona (Trossö)</title>`, 43 PI lines, real `images/gal-0*.jpeg`.
**Live, verified:** `https://sibbamala.com/anny/` → `200 19395B`, same title, 13 lines with
phone/address/gmail; `/anny/images/gal-01.jpeg` → `HTTP/2 200 image/jpeg`.
So the public box ALREADY serves Anny's full PI today; the plan adds a second public surface
(/webdesign/) and its "Done means" closes with /anny/ still live. This is a replace-do-not-add-beside
violation at the product level and undercuts R2's stated purpose. Owner decision required: refresh
`bryn1/anny` with the same R2 placeholders, or unhost/retire `/anny/` — before or with the webdesign
adoption. (The SPEC's name check (§2) proved `/webdesign/` is free — true — but never asked what
`/anny/` is serving.)

### FIX-grade (must be true before the push that activates hosting.yaml)
**F1 · RECIPE §B image table is INCOMPLETE — real photos/face plates live OUTSIDE `_assets/` and are served.**
`projects/anny/prototypes/{23-lab-anny-real,24-lab-anny-flag,26-lab-anny-low}/assets/` carry their
own copies: `23-lab-anny-real/assets/gallery/gal-0*.jpeg` are **md5-identical** to the real
`_assets/gal-0*.jpeg` (all four pairs `7b56a1d3…/21383cd2…/53a88dc8…/fe297fdc…`), and the face
plates (viewed: `om-portrait.png`, `portrait.png`) are real selfies — 11 image files under
`projects/anny/**` outside §B's table, all in the SERVED subset (`projects/**/*.png|jpeg`).
If R2 lands per-table, the public /webdesign/ tree STILL serves real face photos → this alone
refuses SHIP. R2.2's "27 pages share `_assets/`" premise is false for themes 23/24/26 (they are
self-contained per their SOURCE.md: "no `../_assets/` use"). The §C log may add rows, but the
TABLE must scope `projects/anny/**` images, not `_assets/`.
**F2 · hosting.yaml `description` still names "Anny Mullers" (R2.6).** The paste-ready block, pasted
verbatim, puts a personal name on the public portfolio index (META_KEYS verbatim render). No gate
catches it — my `validate-hosting.py` run PASSed WITH the PI in the description. Must be rewritten
(e.g. "…för salong-prototyper samt portfolio-koncept") in the commit itself.
**F3 · Ordering.** Reconciler is ARMED (probe re-confirmed ARMED-mode reading in SPEC; ticks
`3-59/15`): adoption tick + mirror tick ⇒ up to ~30 min from `git push` to public content,
unattended. Therefore, BEFORE any push containing `hosting.yaml`: the R2 commit(s) must be on
`origin/main` (same commit preferred) AND a re-run of the dry-run + PI-rescan over the recomputed
served subset must show ZERO hits (my hunt today: phone 42 files, email 60, address 27, IG 27,
city 57, "anny" 66). If hosting.yaml can ride the R2 commit, do it.
**F4 · Path-level PI (disclose/decide).** Served URLs will read
`/webdesign/projects/anny/prototypes/01-mullers-editorial/`, `21-lab-anny-a`, `25-lab-anny-live` —
"Anny"/"Mullers" survive in PUBLIC URL PATHS after any content sweep. R2.3's wording covers file
content; the ruling's spirit ("Anny" not retained even as first name) is violated by the paths.
Either rename the theme dirs in the R2 sweep (P2 re-links everything anyway via committed browse
pages) or owner explicitly accepts path exposure.

### P3 (non-blocking, disclose)
- **Post-R2 cache staleness on the exact PI images:** JS-string gallery refs (`js/gallery-manifest.js`
  → `window.ANNY_GALLERY_IMAGES = ['images/gal-01.jpeg',…]`) and CSS `url()` plate refs are NEVER
  rewritten with `?v=` (mirror.py rewrites only `src=`/`<link href=`/module imports; CSS url()
  excluded by design). After R2 swaps bytes under the same names, visitors' caches (Cloudflare
  ~4h, no purge token) can keep the REAL photos on those refs while HTML-`src` refs get fresh
  `?v=`. Mitigation: F1/F3 mean real bytes are never served once public; P4 acceptance must
  hard-bypass cache. Do NOT let the pre-R2 subset go public even once.
- **Portfolio (R2.1-scope-out) carries "Alexander Lektove · Karlskrona" in 20+ served files** — the
  same city R2 scrubs from anny's pages. If Lektove is the owner's own persona this is his chosen
  public content; if it is any real third party, the same R2 logic applies. Owner confirm (one line).

### P4 (nits / record-keeping)
- SPEC §4's forbid example is partly wrong: derived list = first 12 leaky dropped files
  (README.md, docs/ARCHITECTURE.md, 10 project .md incl. ATTRIBUTION.md, portfolio/spec.md);
  `tools/build-index.py` is NOT probed (sorted past the cap). Harmless — the include-allowlist keeps
  tools/ out of the tree anyway; belt-and-braces claim only.
- BRIEF R2.3's "the reconciler still mirrors them [.md]" is CONTRADICTED: `resolve_subset` sends only
  `source/**` to `source/<app>/`; dropped `.md` are simply not written anywhere (dropped=38, source=0).
  (Direction of the error is the safe side.)
- Public repo history contains the owner's real email as a commit author
  (`larbild-mayor <as.brynet@gmail.com>`, 1 commit) — same family as P1-A; fresh-history fixes it too.
- Old /anny/ + new /webdesign/ will be two public surfaces for one product — name confusion risk;
  covered by P1-B decision.

## Verdict basis
Mechanics of the SPEC (JSON, keys, globs, dry-run, gates, cachebust) are sound and reproduced.
But as documented, R2 leaves byte-identical real photos + face selfies in the SERVED subset (F1),
the paste-ready hosting.yaml carries a name (F2), and the plan's ordering is unwritten (F3) —
each can make the public box serve personal data. These are producer-side fixes (back-edge to P2),
plus two recorded owner decisions (P1-A history, P1-B old /anny/) that do not block SHIP per the
gate rules but must reach the owner before push.

Must-fix before SHIP: F1 (image table → scope all `projects/anny/**` images, incl. md5-identical
lab copies + plates), F2 (description rewrite in the commit), F3 (R2-before-or-with hosting.yaml +
PI-rescan of the recomputed subset = 0 hits), F4 (owner ruling on path-level names).

# JUDGED: 20edcdd7f98262dde993bd76ab70f590c7f23d43e85bd4aa7576303237cdc1b9
# VERDICT: FIX
