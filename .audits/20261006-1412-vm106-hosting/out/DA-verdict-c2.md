# DA-verdict-c2 — gate over the FINAL pre-push tree (MC 10088.11, devils-advocate, 2026-10-06)

Read-only; scratch `.tmp/dada2/`. Repo judged at HEAD **882d400** (FIX-ARCH-01b; chain per git log:
5849eeb → 96dc070 → 7e6c6a0 → 932614c → 8336bd4 → c2d8fe6 → 882d400; three doc-only amends/commits
moved the base during this run — base-corrections honored per orchestrator steer; parent chain
verified with `git log origin/main..HEAD`). Concurrency note: **out/TEST-verdict-c2.md was ABSENT
at every check of this session** — TEST-c2 runs concurrently; this verdict judges the TREE with my
own re-runs, not TEST's future one.

## H1 — c1 dispositions re-verified IN THE TREE (evidence commands, not prose)

- **F1 — REPLACED, VERIFIED.** `git ls-tree 5849eeb^ projects/` rasters (22) vs HEAD after the
  rename map: **17 REPLACED, 0 GONE, 5 KEPT byte-identical**. The 5 kept are
  `23…/plates/plaster-ground.png, 24…/chart-ground.png, 26…/{chart-field,compass-rose,route}.png` —
  I VIEWED every one this session: abstract plaster texture, two nautical-chart washes, a compass
  rose, a route diagram. No person, no text, no PI — legitimately not on the R2 table. The 23-lab
  gallery twins and both face plates (`om-portrait.png`, `portrait.png`) are gone at blob level
  (cross-checked every current tracked raster, 71 files, against ALL old content blobs: only the
  above + one portfolio file match). Binary-metadata scan (`grep -li` PI tokens over served
  png/jpeg/webp/ico/woff2): **0 hits**. R2.5 invariant spot-checked: old-vs-new pixel dims
  identical on 4 pairs (780×618, 1200×1560, 1536×2048, 1656×2208).
- **F2 — VERIFIED.** hosting.yaml description, quoted verbatim from the committed file:
  `"Interaktiva webbläsarprototyper för en frisörssajt samt portfolio-koncept. Byggda i ren HTML,
  CSS och JavaScript med GSAP-animationer."` — PI-free. Title/tags PI-free. File parses with
  strict `json.load` (my scripts loaded it).
- **F3 — VERIFIED.** `git log origin/main..HEAD` = the 7-commit set above, origin/main=00b8dc5;
  **hosting.yaml (8336bd4) rides INSIDE the same unpushed set as the PI sweep** and a single
  `git push` moves the ref atomically — the reconciler clones HEAD of main, so no intermediate
  pre-sweep state is publishable. Fresh mirror dry-run re-derived THIS session from a clean
  `git archive HEAD` using the **committed** hosting.yaml (not the SPEC draft): `served=317
  dropped=40 source=0`. PI scan (anny/mullers/morin/phone/Landbrogatan/Karlskrona/Trossö/gmail
  regexes over all 317 served text files): **zero hits in projects/salong**; the ONLY hits are
  20 `karlskrona` lines inside `projects/portfolio/**` — the owner-approved portfolio persona
  (R2.1 scope-out, disclosed, carried forward, not a blocker).
- **F4 — VERIFIED.** `git ls-files | grep -iE 'anny|mullers'` → **0 paths**. Served URLs carry no
  brand tokens (paths like `projects/salong/prototypes/01-mork-guld/`, `23-lab-demo-real/`).
- **c1 P1 (TEST-side, for completeness):** FIX-T5-P1 honored — `window.JANE_COOPER_GALLERY_IMAGES`
  in manifest + gallery.js; `node --check` run by me over **all 82 tracked projects/salong JS: clean**.

## H2 — R3.1 / R3.2 owner decisions: recorded, NOT re-litigated; drift check CLEAN

- **R3.1 (verbatim, BRIEF):** "Git history: 'Accept history as-is' — no history rewrite, no
  force-push. … Orchestrator recommended fresh-history instead; OVERRULED, recorded."
  Drift check: `git merge-base --is-ancestor 00b8dc5 5849eeb` TRUE, 102 commits on all refs, no
  rewrite/force-push artifact anywhere — the accepted history is still the real state.
- **R3.2 (verbatim, BRIEF):** "Old app: 'Leave it live on purpose' — https://sibbamala.com/anny/
  (mirror of bryn1/anny) keeps serving Anny's full real PI. … OVERRULED, recorded. Not to be
  re-litigated by any child." Drift check: `curl -I https://sibbamala.com/anny/` → **HTTP/2 200
  today** — nobody silently unhosted it either; the decision is the live state.
- **Honest correlation paragraph (disclose, non-blocking).** The served /webdesign/ files are
  PI-clean, but a curious public reader can still correlate back: the repo `bryn1/Webdesign` is
  public (GitHub API re-confirmed `"private": false` this session) and its accepted history (R3.1)
  still yields the real salon photos and contact data by SHA; `/anny/` on the SAME box (R3.2)
  serves Anny Morin's real name, phone, address and photos; and the served portfolio persona
  "Alexander Lektove · Karlskrona" names the same city the salon themes scrubbed. The style
  lineage of the "Jane Cooper" themes is visually the same design set as the live /anny/ site, so
  the placeholder identity is plausibly re-linkable by anyone who looks. Both re-linkable paths are
  explicitly owner-ratified decisions — recorded here so the board, not just this file, is honest.

## H3 — the NEW hosting surface, attacked on the COMMITTED file

- **(a) `_comment` key — REFUTED as a threat; ADOPT does not fail.** reconcile.py:640 copies only
  `{k in ("name","type","root","exec","port","websocket")+HEALTH_KEYS if k in cfg}` +
  `sanitize_meta(cfg)` (title/description/tags/icon only); the clone-side re-read at :836-842 and
  `_repo_hosting_cfg` (:1918) likewise key-whitelist; mirror.py `resolve_spec` (:157) reads only
  `mirror.{include,exclude,source,preserve,cachebust}`. Unknown keys are **never rejected, never
  read** → `_comment` is inert. VERIFIED against source, both parse sites.
- **(b) Dry-run re-run myself on the renamed tree** (fresh script, committed hosting.yaml, clean
  archive): served=317/dropped=40 — **matches T8-evidence's 317/40 independently** (not a reused
  green: c1's same script on the OLD tree printed 268). Served: root index + 49 theme html +
  nested `vendor/gsap.min.js` + `ScrollTrigger.min.js` (both copies) + 48 thumbs + favicon.ico.
  Dropped: every `.md`, `docs/**`, `tools/**`, `_site/**`, `.audits/**`, `PORT`, `.git*`,
  **and hosting.yaml itself** (`hosting.yaml in served` → False). All tracked projects/*.html
  are in the subset (0 missing). No tracked file is a symlink (git mode check).
- **(c) cachebust "all" — exercised, not just read.** I ran the real `stage_subset` +
  `regen_cachebusts` twice on a staging copy: pass1 rewrites 400 refs, pass2 = **0 changes, tree
  hash identical (idempotent)**. Code (`mirror.py:313-386`): query params preserved, existing `v=`
  replaced, fragment re-appended after `?v=`, `_SKIP_PREFIX` covers `//`,`#`,`data:`,`/`. Ref-form
  hunt over the ACTUAL served files: **srcset 0, protocol-relative 0, unquoted src 0, local refs
  carrying a query 0, `#`-in-src 0, CSS url() with query 0**; the only `&amp;` refs are Google-Fonts
  CDN links — intact post-regen (CDN never given `?v=`, entities untouched). CSS `url()` is
  intentionally NOT rewritten; paren-matched check shows **all 31 url() targets resolve inside the
  served subset** (3 are data-URIs). Escaped code-sample `src=` inside workflow-explode resolves to a
  non-existent file → skipped by `_local_refs` (target-must-exist rule), no rewrite, no 404.
  Carryover disclosure (unchanged from c1 P3): JS-string gallery refs and CSS url() never get `?v=`
  → placeholder-to-placeholder cache staleness ≤ Cloudflare ~4h on later content updates is
  possible; **no PI implication** because F1 guarantees real bytes are never served once public.
- **(d) Root index.html link escape — NONE.** Link-check over all 50 served html (post-cachebust):
  zero `../` escapes, zero `.md`/tools refs; the 69 trailing-slash directory links (e.g.
  `projects/portfolio/prototypes/01-rutorn/`) resolve because the renderer emits
  `index index.html;` inside every static `location /{name}/` (vm106-render-apps.py:368) — my
  file-membership-only 404-model was the false alarm, verified in the renderer source.
- **(e) Root index.html judged ALWAYS — it IS the fresh browse page.** Committed, deterministic:
  re-ran `tools/build-index.py --root` in an archive COPY — root index.html regenerated
  **byte-identical** (sha256 9b393e35…), 48 thumbs "kept" (content-matched). Title "Webdesign —
  prototyper & koncept", 48 project-card anchors, zero PI (covered by F3 scan). Not stale.
- **(f) Rollback claim 'git revert 8336bd4' — HONEST, traced end-to-end in code.** The revert also
  removes root index.html/thumbs/favicon (same commit) → strict bryn1 policy
  (`owner_policy.strict_web_app`: root hosting.yaml is the ONLY web-app signal) → SKIP-NOT-WEBAPP
  → app not admitted → excluded from `desired` → `render_apps_yaml` emits `[-webdesign]` and the
  write-tick **commits and pushes an apps.yaml-only change** (reconcile.py:2320-2355: `ay_text
  is not None` alone reaches fleet-git-push.sh) → vm106's 5-min deploy timer prunes the nginx
  location (DEPLOY-PIPELINE.md: "Removing an app from the manifest prunes its unit"). **No manual
  un-deploy step is missing.** Even under a lenient fallback policy the reverted root has no
  index.html/service-entry/package.json → still SKIP. Caveats recorded as P4 below.

## H4 — reuse/monogamy: CLEAN

One generator: `tools/build-index.py` (the `--root` mode writes the committed root index + thumbs;
`_site` is the same tool's gitignored preview). Grep for any second index/thumbnail mechanism:
tools/ and repo-wide → build-index.py only. `tools/gen-placeholders.py` TARGETS = **17**; the
blob-level replacement accounting found **exactly 17 replaced / 0 over-replaced / 0 missed** —
TARGETS and reality agree one-for-one.

## H5 — gate strength

TEST-c1's red-proofed instruments (T9 planted-token: grep + render-scan + meta-extractor all went
red) are the same classes I re-ran on the NEW tree with DIFFERENT inputs (317 vs 268 files served,
renamed paths): my PI instrument FIRES (caught 20 `karlskrona` lines), so it is not vacuous-green;
my dry-run reproduces T8's 317/40 independently rather than quoting it; the idempotence claim was
re-executed, not read. No byte-identical-green-across-different-inputs tell found. **TEST-c2 was
absent all session** — the DoD's concurrency clause applies: tree judged directly; if TEST-c2 later
contradicts, it supersedes nothing here but should be read beside it.

## Findings (ranked)

- **P1: none. P2: none.**
- **P3-1 (disclosure, carries c1):** JS-string + CSS-url refs never cache-bust; only placeholder
  art can ever be served stale, no PI path (F1 closed it).
- **P3-2 (disclosure):** portfolio persona "Alexander Lektove · Karlskrona" in 20 served files —
  owner-approved persona, R2.1 scope-out; see H2 correlation paragraph.
- **P4-1:** rollback leaves the mirrored `apps/webdesign/` copy inside the (private) hosting
  monorepo on disk — unserved (location pruned), content is placeholder-only; a later re-add
  re-mirrors cleanly (repo-sha trigger + self-heal rule, rolled-back latch excluded). "Rehearsed
  on paper only" is still literally true — the first real rollback of this app is unexecuted.
- **P4-2:** installed crontab comment still says "LOG-ONLY (WRITE=0)" — stale per reconcile.sh
  header ("ARMED 2026-08-30 … the crontab comment describes the P0 era, not now") + c2-common's
  probe-verified ARMED; cosmetic, but a reader of `crontab -l` alone gets the wrong state.
- **P4-3:** `_comment` in the PUBLIC hosting.yaml names a fleet-internal path
  (`agent-town infra/vm106/repo-visibility-hosting/reconcile.py`) — inert to the reconciler, zero
  secrets, but visible repo-wide; harmless, cosmetic.
- **P4-4:** local :8090 serves directory listings + SOURCE.md (TEST-c1 P2) — the PUBLIC mirror
  drops both (my (b) scan: 0 .md served; nginx has no autoindex); post-push acceptance on the
  LIVE URL must still prove it (c2-common POST-PUSH list item 2) — that is the run's last phase,
  not this gate.

## Verdict basis

Every c1 must-fix is true in the tree with executed evidence (F1 17/17 blob-level + 5 survivors
visually PI-free; F2 quoted; F3 same commit-set + zero-PI served set re-derived from the committed
file; F4 zero paths). The new hosting surface survives source-level attacks on `_comment`,
cachebust, link-escape, stale-root, name-collision and rollback (all refuted or downgraded to P4).
Nothing found that can make the public box serve PI, 404 a linked path, or fail ADOPT. Owner
decisions R3.1/R3.2 verified un-drifted and do not gate SHIP per the gate rules. TEST-c2's absence
is disclosed concurrency, and my own independent re-runs cover its ground for the surface this
gate judges.

Stamp-time HEAD: 30d0de3 (FIX-ARCH-01c, doc-only — `git show --stat` = docs/ARCHITECTURE.md only;
judged base per orchestrator steer "never pin a sha you didn't observe in git log at stamp time").
# JUDGED: 5cabf9e464a69e1bc5e478da8eb4239f39dc61c17738c7f3628c41f7c26b47c5
# VERDICT: SHIP
