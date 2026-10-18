# MC 10088.2 T1 [type:infra] — P1 recon SPEC: host bryn1/Webdesign on vm106 via the reconciler

Read-only recon, 2026-10-06. Repo HEAD `00b8dc5` (305 tracked files). Every claim carries a `file:line`
I opened this session. Reconciler-mode probe (run, not inferred):

```
RECONCILE_WRITE=1  DISCOVERY_SOURCE=api  VISIBILITY_SOURCE=api  READ_TOKEN=set
MODE: ARMED — reconciler really writes apps.yaml, mirrors content and pushes (~15 min). Do NOT trust LOG-ONLY labels.
```
(probe: /home/claudecode/.dsh/skills/vm106-reconciler/scripts/check_reconciler_mode.sh, exit 0 —
note the crontab comment still says "LOG-ONLY", the probe overrides it.)

## 1. hosting.yaml — paste-ready (P2 writes it at the REPO ROOT; strict JSON, no YAML lib — validate-hosting.py:3-8)

```json
{
  "name": "webdesign",
  "type": "static",
  "root": "apps/webdesign",
  "title": "Webdesign — prototyper & koncept",
  "description": "Interaktiva webbläsarprototyper för Anny Mullers frisering samt portfolio-koncept. Byggda i ren HTML, CSS och JavaScript med GSAP-animationer.",
  "tags": ["webbdesign", "prototyper", "frontend", "animation", "portfolio"],
  "mirror": {
    "include": [
      "/index.html",
      "projects/**/*.html", "projects/**/*.css", "projects/**/*.js",
      "projects/**/*.woff2", "projects/**/*.jpeg", "projects/**/*.jpg",
      "projects/**/*.png", "projects/**/*.svg", "projects/**/*.webp",
      "thumbs/**",
      "/favicon.*"
    ],
    "exclude": ["**/*.md", "docs/**", "tools/**", "_site/**", ".tmp/**", ".audits/**"],
    "cachebust": "all"
  }
}
```

Keys the reconciler actually READS from hosting.yaml: `type, exec, port, websocket` + `health_path,
health_expect` (reconcile.py:838; HEALTH_KEYS reconcile.py:244) plus optional display meta
`title/description/icon` and `tags` (max 12) via `sanitize_meta` (reconcile.py:1505-1521, called at
842), plus the `mirror` block (mirror.py:167-168). `url_path` is NOT an accepted input — it is derived
as `/{name}/` (reconcile.py:1412, 1645; enforced at 1716). `name`/`root` are present for the bar
validator (validate-hosting.py:24 requires root + `index.html` for static) but the reconciler OVERRIDES
both: root is forced to `apps/<hosting-name>` (reconcile.py:819-821, 3247) and name comes from
`hosting_name()` (reconcile.py:531-536). Title/description/tags render verbatim on the public portfolio
index (META_KEYS reconcile.py:361; INDEX_CONTRACT 388) — hence Swedish. `icon` omitted: P2's call
(emoji OR repo-relative path both legal, sanitize_meta docstring 1507-1508). bryn1 is a STRICT owner —
only a root hosting.yaml makes the repo a web app (owner_policy.py:82-86, 93-106; live env
`RECONCILE_REQUIRE_HOSTING_YAML_FOR=bryn1`), which is exactly today's `SKIP-NOT-WEBAPP` line
(reconcile.log 2026-10-06T14:18:55, x6 incl. webdesign).

## 2. Name/path legality

- `NAME_RE = re.compile(r"^[a-z][a-z0-9-]{0,31}$")` — reconcile.py:300. `webdesign`: 9 chars,
  lowercase, legal. `hosting_name("Webdesign")` → `webdesign` (reconcile.py:531-536).
- Scanned /home/claudecode/hosting/apps.yaml (strict JSON, 15 apps): **no** app named `webdesign`,
  **no** root/path occupying `/webdesign/` — parsed with json this session, zero hits.
- Existing `type: static` precedent set (name → root): presentation→apps/presentation, rocket→apps/rocket,
  futurecraft→apps/futurecraft, ai-os→apps/ai-os, clonecraft→apps/clonecraft, anny→apps/anny. All use
  the forced `apps/<name>` root — webdesign copies this shape (core 3-key record, like `presentation`).
- Resulting public URL: `https://sibbamala.com/webdesign/` (PUBLIC_BASE reconcile.py:217,
  url_path `/{name}/` reconcile.py:1645, HOST verdict `HOST @/{name}` reconcile.py:3425).

## 3. Mirror spec + dry run (executed)

Code facts (mirror.py, opened this session):
- For `static`, served = **include allowlist**: `resolve_subset` serves a file only if it matches
  `include` AND no `exclude`; a `source` glob wins first (mirror.py:206-226, rule at 222-224).
- The repo `mirror` block's `include`/`source` **REPLACE** the defaults
  (`block.get("include") or DEFAULT_...` mirror.py:174,176) while `exclude`/`preserve` **EXTEND** them
  (mirror.py:182-185). Defaults `DEFAULT_STATIC_INCLUDE` mirror.py:58-65.
- `match_globs` is last-match-wins with `!` re-inclusion (mirror.py:145-152); `_glob_re` semantics:
  no-`/` pattern = basename at ANY depth; leading `/` or any embedded `/` anchors at app root; `**`
  crosses directories (mirror.py:107-143, rules 111-116).

Authored spec (the block in §1) serves: root `index.html` (stub modelled), `projects/**/*.html|css|js`,
photos/fonts under `projects/**` (incl. `_assets/*.jpeg|jpg` + vendored `gsap.min.js`/
`ScrollTrigger.min.js`), root `favicon.*`, and P2's committed `thumbs/**`. Thumbs: the current
generator writes `_site/thumbs/<project>/<kind>-<name>.png` (build-index.py:10, 124-125, 175-185) —
`_site/` is gitignored, so **P2 must commit real PNGs under repo-root `thumbs/`** and link them; the
include covers that. Excluded by the `exclude`+allowlist combo: tools/, docs/, PORT, .gitignore, and
every `.md` (incl. `projects/portfolio/spec.md`, `SOURCE.md`, `anny-portrait.ATTRIBUTION.md`).

**Dry run** (this session): tracked tree (305 files) copied WITHOUT .git to
`/home/claudecode/Hemsidor/.tmp/p1/tree/` + stub `index.html` → 306 files; script
`.tmp/p1/dryrun_mirror.py` imports mirror.py and calls `resolve_spec`/`resolve_subset`
(read-only; output saved `.tmp/p1/dryrun_output.txt`):

Literal output (.tmp/p1/dryrun_output.txt, first-20 list abbreviated at the marked line):
```
== PROPOSED repo mirror block (spec source: repo hosting.yaml)
   served=268 source=0 dropped=38
     SERVED index.html
     SERVED projects/anny/prototypes/00-poc-live-site/css/components.css
     SERVED projects/anny/prototypes/00-poc-live-site/css/layout.css
     SERVED projects/anny/prototypes/00-poc-live-site/css/tokens.css
     SERVED projects/anny/prototypes/00-poc-live-site/images/gal-01.jpeg
     SERVED projects/anny/prototypes/00-poc-live-site/images/gal-02.jpeg
     SERVED projects/anny/prototypes/00-poc-live-site/images/gal-03.jpeg
     SERVED projects/anny/prototypes/00-poc-live-site/images/gal-04.jpeg
     SERVED projects/anny/prototypes/00-poc-live-site/index.html
     SERVED projects/anny/prototypes/00-poc-live-site/js/booking-mock.js
     SERVED projects/anny/prototypes/00-poc-live-site/js/contact-form.js
     SERVED projects/anny/prototypes/00-poc-live-site/js/gallery-manifest.js
     SERVED projects/anny/prototypes/00-poc-live-site/js/gallery.js
     SERVED projects/anny/prototypes/00-poc-live-site/js/scroll-reveal.js
     SERVED projects/anny/prototypes/01-mullers-editorial/css/components.css
     SERVED projects/anny/prototypes/01-mullers-editorial/css/layout.css
     SERVED projects/anny/prototypes/01-mullers-editorial/css/motion.css
     SERVED projects/anny/prototypes/01-mullers-editorial/css/tokens.css
     SERVED projects/anny/prototypes/01-mullers-editorial/index.html
     SERVED projects/anny/prototypes/01-mullers-editorial/js/booking.js
     ... +248 more
UNINTENDED (outside projects/, root stub, thumbs/, favicon): NONE
root doc served: True
md served (must be NONE): NONE
tools/docs served (must be NONE): NONE
html served (expect 49 project + 1 stub = 50): 50
== DEFAULT static include (no repo block) (spec source: defaults)
   served=50 source=0 dropped=256
   (only *.html — basename-anywhere; NO nested css/js/photos/fonts)
default-only (would be lost if we replace include): 0 []
ours-only (what the repo block ADDS vs defaults): 218
```
Dropped set = exactly: `.gitignore, PORT, README.md, docs/ARCHITECTURE.md, tools/build-index.py,
tools/check-links.py` + all 32 `projects/**/*.md` (SOURCE.md ×33 incl. ATTRIBUTION.md, both spec.md,
workflow-explode README/RESULT).

**Verdict: the subset EQUALS intent** — 268 = 50 html + 82 css + 86 js + 27 woff2 + 12 jpeg + 10 png
+ 1 jpg, root document present, zero unintended entries. **Finding:** the DEFAULT include CANNOT serve
this repo — `js/**`,`css/**`,`assets/**`,`fonts/**` are root-anchored (mirror.py:58-60,111-116), so
nested `projects/*/css|js|assets|fonts` files stay dropped (dry run: default serves 50 files, the site
would render unstyled/black). The repo `mirror` block (an allowlist REPLACE) is the expressible fix —
no gate-logic edit needed. Caveat for P2: `**/*.md` drops `anny-portrait.ATTRIBUTION.md`; if the photo
attribution must be public, embed it in HTML (or add one `!` re-include to the block — last-match-wins
makes that legal, mirror.py:145-152).

## 4. Static product/staging expectations

- `build_health` static branch (reconcile.py:1318, 1326-1346): repo-root `index.html` must EXIST
  (fail at 1329), be >0 bytes, match its git blob size (`git cat-file -s HEAD:index.html`, 1334-1342),
  then `prefix_safety` (1343-1345): any bare `"/…"` asset ref in judged HTML → fail "prefix-unsafe …
  missing glue" (1314-1316). Unknown type fails closed (1385). A REFUSE-BUILD line is emitted at 3379.
- Shadow rule for static: **"a type=static app's repo-root index.html is judged ALWAYS … No dist/
  anywhere can buy a static app an exemption"** (reconcile.py:1196-1198, block 1189-1201).
- `product_health` (reconcile.py:1389): probes `GET /<name><health_path>` (default `/`) on the LIVE
  site; "broken" only on a definitive non-2xx/missing `health_expect` (1455-1461). First-deploy
  bootstrap skip — never-served app is NOT probed: `return "skip", f"not currently served -> no live
  endpoint to probe ({url_path})"` **reconcile.py:1428**, gated by `product_served = currently_served
  and _ever_mirrored(name)` (reconcile.py:3395; `_ever_mirrored` 1375-1384). No product/health keys
  needed in our hosting.yaml.
- Staging gate (`derive_probe_spec`, staging.py:126-187): `forbid_paths` derived from the app's OWN
  dropped+source set, only leaky suffixes (.py .md .env .sh .yaml … , staging.py:58-60, cap 12 at
  60/165) — ours will include e.g. `tools/build-index.py`, `projects/portfolio/spec.md`: those must
  404 live (probed at staging.py:429-433 + verdict 337). `min_bytes` = max(256, ½×current served
  index.html) (staging.py:65-66, 171-175). `assets` gate is ON for static (staging.py:184): every
  LOCAL ref in the served document must resolve WITH its `?v=` through the `/webdesign/` prefix
  (docstring 136-140) — CDN/data-URI refs are not local refs, allowed. `live_probe` post-deploy
  (staging.py:372): 200 + size floor + require/forbid strings + forbid_paths + byte parity.
- `cachebust`: keep **"all"** (= DEFAULT_CACHEBUST, mirror.py:97; modes 96). Cloudflare caches static
  ~4h with NO purge token, so the regenerated `?v=<sha256[:8]>` is the only cache lever (mirror.py
  law 3, 25-28; `regen_cachebusts` 313). The photos' filenames are stable and unhashed
  (`gal-01.jpeg`…, `_assets` listing via git ls-files) — replacing a photo's BYTES under the same name
  is only cache-visible through the `?v=`, which is exactly what "all" guarantees.

## 5. P2 must-fix inventory

- Absolute `"/…"` refs: grepped ALL 49 `projects/**/index.html` with the reconciler's own
  `BARE_ASSET_RES` patterns (reconcile.py:322-328) + a broader `href|src="/…"` sweep:
  **COUNT = 0** (0 hits in 0 files). The only `"/`-lookalikes are 512 `href="#…"` fragment links —
  harmless under path hosting. No absolute `url("/` in projects CSS, no `fetch("/` in JS. No must-fix.
- Reference kinds in `07-retrofilm/index.html` + `05-mjuk-glas/index.html` (both opened):
  relative `css/*.css` + `js/*.js` (e.g. css/tokens.css, js/scroll-motion.js) → under
  `projects/**` → SERVED; `../_assets/gal-*.jpeg`, `anny-portrait.jpg`,
  `../_assets/vendor/{gsap,ScrollTrigger}.min.js` → resolve to `projects/anny/prototypes/_assets/…`
  → SERVED; `data:image/svg+xml` URIs (1 each) → no fetch, fine; Google Fonts CDN
  (fonts.googleapis.com / fonts.gstatic.com) → external, stays CDN-linked per BRIEF ruling 4
  (offline = fallback stacks, disclose); external `instagram/tel/mailto` links → no mirror impact.
  All local kinds resolve inside the §3 served subset once P2 commits the files they name.

## 6. Tick mechanics

- Crontab (crontab -l, user claudecode, line 28): `3-59/15 * * * *
  /home/claudecode/agent-town/infra/vm106/repo-visibility-hosting/reconcile.sh >>
  /home/claudecode/logs/repo-visibility-hosting/cron.log 2>&1` — every ~15 min; the detailed log is
  `/home/claudecode/logs/repo-visibility-hosting/reconcile.log` (both present, ~94 MB each,
  last write 2026-10-06 14:03).
- Verbs a successful static adoption+deploy produces (in order, all cited):
  `RESOLVED webdesign type=static … src={… 'hosting.yaml'}` (RESOLVED line; cf. log 13:48 shape) →
  decision `  webdesign: HOST hosted_desired=True -- clean+public (...)` (reconcile.py:3440, verdict
  3425) → tick 1 `    ADOPT: recorded repo_sha=… monorepo_sha=… -- mirrored NOTHING (the plan above
  is a rehearsal only)` (reconcile.py:2255-2256) → tick 2 `    subset: served=268 source=0 dropped=38`
  (mirror.py:614-616), `    cache-bust: … ?v=…` (mirror.py:617-618), `    plan: write=N …` +
  `      WRITE  apps/webdesign/<rel>` (mirror.py:619-622), `  apps.yaml WRITTEN` (reconcile.py:2322),
  `  push CONFIRMED (fleet-git-push.sh verified origin advanced)` (reconcile.py:2369), mirror-state
  `mirrored` (reconcile.py:2400).
- Rollback route (NOT run): `p2-rollback.sh` — one switch: sets `RECONCILE_WRITE=0` in the env file,
  disables the reconciler cron/timer, hands apps.yaml back to manual; idempotent (header lines 1-9 of
  /home/claudecode/agent-town/infra/vm106/repo-visibility-hosting/p2-rollback.sh).
- Probe verdict: quoted verbatim at the top of this file.
