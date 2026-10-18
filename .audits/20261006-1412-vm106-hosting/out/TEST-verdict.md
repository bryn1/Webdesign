# TEST-LOCAL-01 — independent pre-push acceptance (MC 10088.5)

Subject: /home/claudecode/Hemsidor @ HEAD 7e6c6a0 (5849eeb DE-PERSONALIZE-01, 96dc070 PERSONA-01,
7e6c6a0 RENAME-01). Served surface judged over HTTP at http://192.168.5.231:8090/ (root = `_site`,
project dirs are symlinks into `projects/` → served bytes == working tree). Everything below was
re-run by this tester; producer evidence files were not trusted. Scratch: `.tmp/t5/`.

Interpretation declared: the task's T4/T5 theme list names `13-varm-minimal`, which does not exist
in the tree; I used **13-91-tal** (the existing 13-\* theme) plus the three named themes.
Instrument note: playwright-core is resolved from the harness node_modules tree
(`.pnpm/playwright-core@1.63.0-alpha…/playwright-core`); the brief's `createRequire(<pkg>/package.json)`
form raises MODULE_NOT_FOUND because pnpm does not hoist a symlink into that package's node_modules —
same library, same browser (chromium-1243), honestly substituted.

## Probe results

| probe | command/instrument | observed | result |
|---|---|---|---|
| T1 banned-sweep (tracked, excl. portfolio, excl. \*.woff2) | `git grep -niE 'anny\|mullers\|morin\|072-155\|07X-XXX\|landbrogatan\|karlskrona\|tross\|dinsalong\|din salong\|din stad\|gmail'` | **0 hits** outside projects/portfolio/; instrument sanity-checked (fires on Jane/Cooper/Malmö control) | PASS |
| T1b same sweep WITHOUT portfolio exclusion | same grep | **76 hit-lines, all inside projects/portfolio/** (70+3 Karlskrona owner-persona, 3 = CSS class `bigmail` false-positive). Allowed residue per task; portfolio untouched per R2.1 | PASS (separate count recorded: 76) |
| T2 paths | `git ls-files` counts | `projects/anny`=0, `01-mork-guld`=8, `lab-anny`=0; `jane-portrait.jpg` + `.ATTRIBUTION.md` tracked; ANY tracked path matching anny/mullers/morin: NONE | PASS |
| T3 render sweep, 27 theme pages over HTTP | playwright-core chromium; status + console + pageerror + banned(title/body/meta-content/img-alt) + img naturalWidth | 27× HTTP 200; console err 0 ×27; banned 0 ×27; all imgs decode (rest-state nw=0 = `loading=lazy` reveal design, re-verified decoded after scroll on every flagged theme). **1 pageerr≠0: 00-poc-live-site 2× SyntaxError** | **FAIL** (00-poc) |
| T4 375×812 overflow (01-mork-guld, 07-retrofilm, 13-91-tal, 26-lab-demo-low) | playwright scrollWidth | scrollWidth = 375, 375, 375, 375 → ≤375 all | PASS |
| T5 reducedMotion:'reduce', same 4 | playwright | real content (textLen 2717/3272/2072/1561 > 300), console 0, pageerr 0, all imgs decoded (hero at rest; rest after scroll, t6_v2.js) | PASS |
| T6 JS-off (01-mork-guld, 09-schweizertag) | playwright javaScriptEnabled:false | headlines visible in innerText: "Jane Cooper" (01), "JANE / COOPER" + "FRISÖR · MALMÖ" (09; uppercase via CSS, first pass false-negative was a comparison artifact) | PASS |
| T7 regenerator | `cp -a _site .tmp/t5/_site_backup` (backup only — build-index.py has no outdir arg, hardwires `_site`); `python3 tools/build-index.py` | exit 0; regenerated HTML byte-identical to prior; browse index links **27/27** salong theme dirs, 0 broken hrefs; `tools/check-links.py http://127.0.0.1:8090/`: **51 pages, 289 local URLs, 0 broken, 62 external skipped, all 7 forbidden paths 404**; `git status --porcelain` = 0 lines (writes stay in gitignored `_site`) — honestly noted: it WRITES _site files each run, git never sees them | PASS |
| T8a banned tokens in js (incl. vendored gsap/ScrollTrigger, theme js) | `git grep -niE …` over `*.js`, untracked-served check (`git status projects/salong` = no untracked files) | 0 hits outside portfolio | PASS |
| T8b banned tokens inside CSS `url(…)`/`content:"…"` | `git grep -niE '(url\(\|content:)[^;]*(token)' -- '*.css'` | 0 hits | PASS |
| T8c JSON-LD / og:\* / twitter:\* / meta content over HTTP, 6 themes × 3 page types (poc 00, editorial 01/09/14, lab 23/26) | urllib + regex extraction | 0 banned in all meta content + 1 JSON-LD block parsed (00-poc: 12 meta, 1 LD); instrument red-proofed below | PASS |
| T8d .md / tools/ / .audits reachability + browse-index links | curl `/README.md`, `/tools/build-index.py`, `/.audits/…/BRIEF.md` → **404 ×3**; `/salong/spec.md` → 404; root+salong browse indexes grep hrefs `\.md\|tools/\|.audits` → none | task-named paths 404 and browse index links no .md/tools — BUT: `/salong/prototypes/<theme>/SOURCE.md` → **200** and dir listings are ON (`/_assets/` lists `jane-portrait.ATTRIBUTION.md`) on the local preview server | PASS with P2 finding |
| T9 red-proof | plant `Anny Morin — Karlskrona` into og:title + JSON-LD of a copy of 01-mork-guld page | green baseline 0 → red: T1 grep hits line 24; T3 scanBanned → `['anny','morin','karlskrona']`; T8c extractor → `['anny','karlskrona','morin']` | PASS (instruments can go red) |
| Hygiene / dead code | `git diff --numstat` 00b8dc5..HEAD + blob-pair content diff; dead_code.py on tools/ | commit-set is a sweep: no pre-existing >400-line theme asset was grown (blob-vs-blob diff of 712-line 23-lab styles.css = content-identical, pure rename); new tools/gen-placeholders.py = 103 lines; dead_code tools/: 0 findings | PASS (P4 note: two density-wave CSS files pre-existing at 712/679 lines, >600, no header reason — not grown by this set) |

## Findings (ranked)

- **P1 — 00-poc-live-site gallery dead at served HEAD (→ T3 FAIL).**
  `projects/salong/prototypes/00-poc-live-site/js/gallery-manifest.js:9` declares
  `window.JANE COOPER_GALLERY_IMAGES = [...]` — invalid JS identifier (space). Both
  `gallery-manifest.js` and `gallery.js:36` throw `SyntaxError: Unexpected identifier
  'COOPER_GALLERY_IMAGES'` (2 pageerrors over HTTP), and gallery.js's `|| []` fallback means the
  gallery silently renders **0 images** on this served page (all other themes render 5+).
  Provenance: introduced by 5849eeb (R2 sweep turned `window.ANNY_GALLERY_IMAGES` into
  `window.DIN SALONG_GALLERY_IMAGES` — already broken) and preserved by 96dc070 (→ JANE COOPER).
  Fix: rename to a valid identifier (e.g. `window.JANE_COOPER_GALLERY_IMAGES`) in manifest +
  gallery.js usage + comment, regenerate nothing else (no URL change, R2.5-safe).
- **P3 — root-cause class: the persona/placeholder sweeps rewrote JS/CSS IDENTIFIERS, not just copy.**
  R2's own log admits identifier rewrites ("ring-anny -> ring-dinsalong"); a multi-word replacement
  inside an identifier necessarily breaks syntax. A `node --check` over every touched .js (and a
  grep for `JANE ` / `DIN ` inside identifier contexts) should gate the next sweep — this bug
  survived two earlier test cycles precisely because copy-only greps can't see syntax breakage.
- **P2 — local preview server exposure:** `:8090` serves **directory listings** and
  `SOURCE.md`/`jane-portrait.ATTRIBUTION.md` under `/salong/prototypes/…` answer 200. Not linked by
  the browse index (verified), and the public mirror is slated to drop .md (BRIEF R2.3 / SPEC §3) —
  P4 live-public acceptance MUST verify the dropped .md and absent listings on vm106. Served .md
  content itself carries no banned tokens (T1 = 0 outside portfolio).
- **P4 —** task's T4/T5 theme name `13-varm-minimal` doesn't exist (used `13-91-tal`);
  portfolio residue = 76 grep lines ("Alexander Lektove · Karlskrona" persona + `bigmail` class),
  allowed, recorded separately; pre-existing theme CSS >600 lines (23-lab 712, 22-lab 679) predates
  this commit-set (not grown, pure renames); lazy-reveal `naturalWidth==0` at rest is design, all
  verified decoded on natural scroll.

## Red-proof evidence (T9)

GREEN (pristine copy of served 01-mork-guld/index.html):
```
$ grep -cniE 'anny|mullers|morin|072-155|07X-XXX|landbrogatan|karlskrona|tross|dinsalong|din salong|din stad|gmail' red-page.html
0
0 hits (green)
```
RED (same file after planting `<meta property="og:title" content="Anny Morin — Karlskrona">` +
`<script type="application/ld+json">{"name":"Anny Morin"}</script>`):
```
$ grep -niE '…same regex…' red-page.html | head -1
24:<meta property="og:title" content="Anny Morin — Karlskrona"><script type="application/ld+json">{"name":"Anny Morin"}</script></head>

T3 scanBanned (verbatim list, title+body+meta+alt equivalent): ['anny', 'morin', 'karlskrona']
T8c meta/JSON-LD extractor (same one used on 6 live themes):    ['anny', 'karlskrona', 'morin']
```
Also live-red today, unprompted: T3 caught the 00-poc SyntaxError on the real served page —
`pageErrMsgs: ["SyntaxError: Unexpected identifier 'COOPER_GALLERY_IMAGES'", …]`.

## Verdict

T3 fails on a real, served functional defect (P1) → the gate does not pass.

# JUDGED: 943e8b200afa6dea41f7805cd47a7dc7d5df4d7a4143dd08070da37479d0fa4c
# VERDICT: FAIL
