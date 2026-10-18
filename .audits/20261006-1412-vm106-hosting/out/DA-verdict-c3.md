# DA-verdict-c3 — pre-push adversarial gate on BROWSE-V2 (MC 10088.12d, devils-advocate, 2026-10-07)

Repo judged at HEAD **dd328b8** (parent 061975e = current origin/main; `git log origin/main..HEAD`
= exactly dd328b8 — unpushed, confirmed). READ-ONLY; scratch `.tmp/dada3/` (sim.py + clones).
Pushing activates the two-level public layout within ~15-60 min — this gate judges that activation.
c2 facts honored without re-litigating (`_comment` whitelist-ignored, cachebust ref forms,
rollback trace); c2's P3 normalized-sweep lesson re-checked against c4 below.
Concurrency: **out/TEST-verdict-c4.md absent at every check until 06:14** — it then landed
(VERDICT: PASS, "nothing P0/P1/P2 open"; its B4 red-proof shows planted tokens caught RAW *and*
NORMALIZED, and its (ii) red-proof shows the include actually gates the page — my A5 conclusions
stand, strengthened). **ARCH-verdict-c5.md landed mid-run (06:03) with VERDICT: FIX** — read and
independently re-verified below (Finding P2-1). **Stamp correction:** builder addendum **71b4fd1**
landed 06:22 (5 added lines, docstring header-reason ONLY — diff shown clean this session; TEST-c4
P3-1 remedy); all byte-identity rows re-run at 71b4fd1 in a fresh archive: all 3 committed pages
still **IDENTICAL**. Hash stamped `--base 71b4fd1` (actual git-log HEAD at stamp, per orchestrator
message). Working-tree dirt (`projects/portfolio/concepts/workflow-explode/**` 5 files +
untracked QUALITY.md) is the parallel crew's MC 10140.4, uncommitted, never pushed, out of this
gate's scope (orchestrator confirmed; push ships commits only).

## A1 — QUARANTINE OF THE NEW GLOBS: today tight; forward-permissive (P3)

- Today the globs carry almost nothing: `git ls-tree -r dd328b8 --name-only | grep -E '^(salong|portfolio)/'`
  = **only** `salong/index.html`, `portfolio/index.html`. Clean-archive (`git archive dd328b8`) re-run
  of `mirror.resolve_subset` with the COMMITTED hosting.yaml: **served=319, source=0, dropped=40**
  (= c2-era 317 + exactly the 2 new pages; `lost=[]`). Served extensions:
  `.css .html .ico .jpeg .jpg .js .png .woff2` — **no file type served today that I did not expect**.
- Ordering, read fresh from `mirror.py:206-224`: `resolve_subset` checks **source → exclude → include**
  — exclude is applied BEFORE include (stronger than the brief's "after include" phrasing), so
  `served = include ∧ ¬exclude`. Proven with planted probes (scratch clone only, removed after):
  `salong/NOTES.md` → **dropped**, `portfolio/README.md` → **dropped** (`**/*.md` exclude wins
  regardless of `/salong/**`). `!`-last-wins is per-list; cross-list order is the fixed precedence above.
- But `/salong/**` + `/portfolio/**` are **extension-agnostic** where `projects/**` is an
  8-glob extension allowlist, and the excludes `tools/**`, `docs/**`, `_site/**`, `node_modules/**`,
  `tests/**` are ROOT-anchored (contain `/`) — they do NOT protect nested copies. Probes:
  `salong/secret/data.json`, `salong/.hidden`, `salong/tools/evil.py` → **SERVED**. No such files
  exist (zero today); single-writer tool-generated dirs → P3, named in Findings.

## A2 — OWNER-RULING FIT: delivered at URL level (VERIFIED)

- Root page hrefs post-cachebust: exactly `favicon.ico?v=…`, `salong/`, `portfolio/` — project
  cards ONLY; from `/webdesign/` those resolve to **`/webdesign/salong/`** and `/webdesign/portfolio/`
  — the literal ruling shape, NOT `/webdesign/projects/salong/`. Theme pages stay at
  `/webdesign/projects/...` (reachable in exactly 2 clicks from root: card → project page → theme).
- Nav-back: `../` from `/webdesign/salong/` (directory URL, `index index.html;` proven in the
  renderer by c2 H3(d)) → base `/webdesign/salong/` minus one segment = **`/webdesign/`**, served
  by root `index.html` — I resolved every href/src of all 3 pages against the 319-file served set
  with the index-model: **0 broken**; `../` lands on `/webdesign/`, not `/`. TEST-c4's browser
  instrument (`b1_result.json`) independently: `navBack.url="/"` with root h1 read back,
  themeLinks 48/48, 375px ok, console 0.
- Pre-push state is coherent: live `https://sibbamala.com/webdesign/` = **200** (48-card c2 page),
  `/webdesign/salong/` = **404** (two-level not yet public) — push only ADDS surfaces; every
  already-public deep URL (`/webdesign/projects/...`) keeps serving (that include is untouched).
- Docs rows match the pages (`grep -c 'class="card"'` → salong 27, portfolio 21 = §2 rows).

## A3 — MONOGAMY: one template, divergence inside shared functions (VERIFIED)

- Grep for second card/page writers (`class="card"`, `def project_page|root_card|build(_root)?`,
  Swedish copy tokens) across tracked code: **only `tools/build-index.py`** (all other hits are
  scratch clones). English `_site` vs Swedish public divergence lives **inside** the shared
  `project_page()`/`root_card()` as a `public=` flag (`build-index.py:167-236`) — parameterized,
  NOT a forked code path. One `page()` shell, one CSS string, all modes.
- Byte-identity from a clean clone (`git archive` → `.tmp/dada3/cloneA`, generator run there,
  real `_site` untouched): committed `index.html`, `salong/index.html`, `portfolio/index.html`
  regenerate **IDENTICAL** (all 3) → the committed public surface is fresh + deterministic.
- `_site(dd328b8-clone) vs _site(061975e-clone)`: **diff EMPTY — byte-identical** → the refactor
  changed zero bytes of the local preview surface (strongest possible regression evidence).
- Caveat: the checkout's OWN `_site` differs from a fresh build in 7 (thumbs-excluded) files →
  the :8090 preview is stale vs dd328b8's generator; gitignored, not mirrored, rebuild documented
  (P4).

## A4 — HOSTING FILE INTEGRITY (VERIFIED)

- Validator fresh, this session, at dd328b8: 7×PASS, `VALIDATOR_EXIT=0`. Post-revert tree
  (061975e archive) also `VALIDATOR_EXIT=0` → bar survives rollback.
- Strict `json.load` re-parse: OK. PI-free description unchanged and quoted verbatim from the
  committed file ("Interaktiva webbläsarprototyper för en frisörssajt samt portfolio-koncept…" —
  c2 F2 text, byte-unchanged).
- `git diff 061975e dd328b8 -- hosting.yaml`: **exactly ONE line changed** — the include line
  gains `"/salong/**", "/portfolio/**"` (brief said "2 include lines"; actually 1 modified line —
  noted for the record). Nothing else in the file moved.
- Rollback executed as simulation, not prose: `mirror.plan_mirror(stage=061975e-subset,
  dest=dd328b8-subset)` → **deletes = ['portfolio/index.html','salong/index.html'], writes = 1
  (root index back to c2 content), refuse = None** → a revert restores the c2-era mirror exactly,
  prunes the dirs (`apply_plan` rmdir pass), no orphan pages, and stays under the LAW-4b
  curation-loss guard (2/319 deletes). The app remains admitted (hosting.yaml untouched by the
  revert) — this is NOT the 8336bd4 full-unhost rollback, it is a mirror-content revert.

## A5 — THE GATES

- ARCH-c5 **FIX landed mid-run**: its sole named item — §10 "State as measured" still says
  "origin/main = 00b8dc5 … nothing is public" while I re-probed: `origin/main = 061975e` (pushed
  2026-10-06 23:07), live `/webdesign/` = **200**, 17439 B, 48 cards. dd328b8 edited adjacent
  sentences and left the block stale — I re-verified every element of the claim myself.
  It contradicts the doc, not the product: **not a blocker under this gate's stated definition**
  (404/leak/serve-PI/rollback), carried as P2-1 with c5's own remedy (fold the 4-line fix into
  the push commit or the P4 acceptance pass).
- TEST-c4 verdict absent; its instruments show the **c2 normalized-sweep lesson WAS applied**:
  `b4_scan.py` = "RAW + tag/whitespace-NORMALIZED banned scan", substring+word classes, persona
  carve-out, binary latin-1 pass. I re-ran the same class myself on the 3 new pages: **both passes
  CLEAN**, anti-vacuity (normalized text 3315 chars scanned), **red-proof fires**: planted
  `Anny<br>Morin` is invisible to the raw pass and caught by the normalized pass. Split-token
  risk in the 3 new pages: none found — they carry no hero-pair markup, all banned-name substrings
  0 (titles come from theme `<title>`s already scanned in the 317-file c2-era set).
- The `+46 70 …` substring class hits in 41 projects/salong files are the owner-approved R4
  placeholder phone (disclosed demo data per c2-common), pre-existing, NOT part of this commit —
  not a finding, recorded so a raw scan of my notes isn't misread as one.

## Findings (ranked)

- **P0/P1: none.**
- **P2-1 (dissent support, doc-vs-reality):** §10 "State as measured" block contradicts VERIFIED
  live state (site already public since the 061975e push) and dd328b8 touched the same paragraph
  without fixing it. c5's 4-line fix should ride the push; pushing without it publishes dd328b8
  over a false "nothing is public" line. Not a blocker per this gate's blocker definition.
- **P3-1 (quarantine width, this commit's change):** `/salong/**` + `/portfolio/**` are
  extension-agnostic + root-anchored excludes don't nest → any future non-.md file dropped under
  those dirs (probe-proven: `.json`, dotfiles, nested `.py`) becomes public. Suggested narrowing
  (functionally sufficient — everything else already rides `thumbs/**` / `projects/**`):
  `"/salong/*.html", "/portfolio/*.html"`. Or accept, knowing the dirs are single-writer.
- **P3-2 (drift coupling, mechanism note):** `build_root()` writes a committed `<project>/index.html`
  for EVERY project scan() finds, but hosting.yaml include is hand-maintained per project — a third
  project added under `projects/` gets a root card linking to `/<new-project>/` that would 404
  publicly until someone edits hosting.yaml. Same family as c5 C2's root↔projects coupling, but
  the failure mode is future-public-404, so name it in the next hygiene pass (or generate the
  include entries).
- **P4:** checkout `_site` stale vs dd328b8 generator (7 files; preview-only, rebuild documented);
  build-index.py at 317 lines (c5's split advice stands); unchanged c2 carries (JS/CSS url()
  cachebust gap — no PI path; portfolio persona; stale crontab comment).

## Verdict basis

Nothing in the pushable surface can 404 a linked path (0 broken in a 319-file model + independent
browser walk), leak (globs carry 2 html files today; .md quarantined with exclude-before-include
proven by planted probes), serve PI (two-pass scans clean with working red-proof; no new copy
beyond generated Swedish labels), or break rollback (revert simulation: exact 2-file prune,
refuse=None, bar still green). Owner ruling delivered at the literal URL shape. Byte-identity
reproduced from clean archives, including `_site` zero-delta across the refactor. Remaining
findings are P2-doc (c5's, remedy already named) and forward-looking P3s.

# JUDGED: 4fa2f6989f8b4c5fdb372a5ac445d7fc3f42930ae384df3ec023d6af42e121b4
# VERDICT: SHIP
