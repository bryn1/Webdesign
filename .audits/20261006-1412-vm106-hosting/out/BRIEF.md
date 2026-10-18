# vm106 HOSTING — bryn1/Webdesign (MC 10088, owner 2026-10-06)

Owner request (verbatim): "currently everything is hosted locally on http://192.168.5.231:8090/,
take a look there. i want this site to be hosted on vm106 via the reconciler. repo bryn1/webdesign
is public."

Plan: /home/claudecode/.dsh/plans/host-webdesign-on-vm106-via-reconciler.md

## Gate block (binding)
- One child per phase, sequential, fanned with the matching profile SOUL pasted verbatim
  (`/home/claudecode/agent-town/agents/_shared/profiles/<name>/SOUL.md`, read fresh, never cached).
- Children NEVER spawn: no `subagent`, no `workflow`. maxDepth 1.
- Lane pre-flight before every wave: `bash ~/agent-town/infra/vm105/dsh/lane-load.sh <N>` -> GO or HOLD.
- Child returns a POINTER + one-line outcome; I read the artifact and run the check myself.
- Producer back-edge on FAIL, capped at 3 cycles. Verdict files carry `# VERDICT: <PASS|FAIL|SHIP|FIX>`
  and, as the child's LAST step, `# JUDGED: <sha>` from
  `python3 /home/claudecode/.local/bin/dod_judged_hash.py .audits/20261006-1412-vm106-hosting/out --base <sha>`.
- Commits: `git -c user.name="<profile> (10088)" -c user.email=<profile>@agent-town.local commit -o -- <own paths>`;
  never `git config`; never sweep the shared tree.
- File hygiene ~250 / hard 400 (reason line required) / gate-fail 600.
- BLOCKED = the exact failing thing, not "hard".

## Phases
P1 infra recon (read-only) -> SPEC.md + paste-ready hosting.yaml + resolved mirror subset, dry-run verified.
P2 frontend producer      -> committed root index.html + project index pages + thumbs + hosting.yaml;
                              validate-hosting.py exit 0; check-links clean; pushed.
P3 infra deploy-watch     -> reconciler adopts + mirrors; no REFUSE/ROLLBACK; apps.yaml row.
P4 test verdict           -> live public URL acceptance, console-clean, quarantined paths 404, reduce/375.
P5 orchestrator close     -> MC trail, ARCHITECTURE.md §6, owner report.

## Accepted rulings (mine, this run — do not re-litigate, disclose to owner)
1. Do NOT commit `_site/` and do NOT fight `.gitignore`: owner ruling 2026-10-07 (in .gitignore, MC
   10062.30.1) — "Only committ final site and its images"; run records, tool state, generated `_site`
   stay on disk untracked. The public surface must therefore be REAL committed files at the repo root
   and inside `projects/`, not the symlink farm.
2. Do NOT touch `~/hosting/apps.yaml` — the reconciler owns it and re-adds entries every ~15 min.
   The fix lands in the REPO (`hosting.yaml` + committed browse files), per the vm106-reconciler skill.
3. Do NOT edit the reconciler's gate logic (`mirror.py` DEFAULTS) or `reconcile.py` admission without a
   separate explicit owner go. Per-repo `hosting.yaml` is the sanctioned lever.
4. Google Fonts stay CDN-linked (owner open item DONE E3, non-blocking) — public pages may render with
   fallback stacks offline; disclose, do not vendor in this run.
5. Repo is public and the owner asked for public hosting; the 20 client-demo prototypes + Anny's real
   photos become publicly reachable at the vm106 path. Flagged, not blocked (his explicit ask).

## Facts to verify against the tree, not to assume
- Reconciler log this session: `bryn1/Webdesign ... SKIP-NOT-WEBAPP` at the 13:48 tick
  (public, no servable entrypoint); earlier 13:33 tick said "repo is private (not a candidate)" —
  visibility changed between ticks; owner now confirms public.
- `TYPES = ("static","service")`; bryn1 is in `RECONCILE_REQUIRE_HOSTING_YAML_FOR` (root hosting.yaml IS
  the web-app gate for this owner); `hosting.yaml` must be STRICT JSON.
- Static contract: `index.html` at repo root is judged ALWAYS (validate-hosting.py + the shadow rule).
- `_site/` is gitignored and is 51 files whose project dirs are symlinks into `projects/`; the repo root
  has no index.html today.
- `projects/anny/prototypes/_assets/vendor/gsap.min.js` + ScrollTrigger are the motion libs (tracked).

## RULING R2 — DE-PERSONALIZATION (owner, verbatim, 2026-10-06)
"for Annys prototypes/designs i want placeholder for all images, phone number, instagram, adresses
and any personal information"
Clarified by two owner answers to explicit options, both chosen verbatim:
- placeholder style = "Din Salong / Din Stad (Recommended)" — Swedish template-style identity copy:
  "Din Salong", "Din Stad", hej@dinsalong.se, 07X-XXX XX XX, @dinsalong, "Gatan 1".
  (Chosen over "neutral lorem-style" and over "keep first name, anonymize rest" — so the given name
  "Anny" is NOT retained either.)
- image placeholders = "Tasteful neutral art (Recommended)" — generated abstract images in each
  theme's own palette, SAME filenames + SAME aspect ratios, "pages still look designed, no white holes".
  (Chosen over "Bild kommer" frames and over removing image slots.)

Consequences that bind every later phase:
R2.1 Scope is the ANNY project only (projects/anny/**). projects/portfolio/** is untouched.
R2.2 Real assets must leave the product. `_assets/` is shared by 27 pages, so one replacement set of
     same-name/same-size generated files fixes every theme at once. Replacing in place leaves the real
     photos in git history — so the generated files must be COMMITTED and the originals' continued
     presence in history disclosed to the owner, not hidden. Nothing personal may sit in the SERVED
     subset (that is the public surface).
R2.3 No name/phone/IG/address/email/city may survive in ANY served file: HTML, CSS, JS, and generated
     browse pages. `.md` files are dropped from the served subset (SPEC §3), so ATTRIBUTION.md/SOURCE.md
     are not public — but the reconciler still mirrors them, and the copy-protection gate below does not
     apply to them.
R2.4 COPY CONTRACT (supersedes the density-wave zero-insertion rule for this owner ruling ONLY):
     new visible copy is permitted EXCLUSIVELY where it replaces personal data, drawn from the R2
     replacement table or from what a theme already said. No NEW marketing sentences, claims, prices,
     testimonials or services. Prose that referenced the city/district/brand rewrites minimally to the
     generic equivalent ("i Din Stad", "Din Salong"). Every copy change must appear in a row of
     RECIPE.md so a reviewer can prove nothing else moved.
R2.5 Motion, layout and all existing density-wave gates stay in force: reduce = 0 triggers and 0
     [style] mutations, JS-off visible, 375px hOverflow 0, console 0, AA at worst state. Replacement
     images must carry the same byte-kind (jpeg/png) and pixel dimensions so no layout metric moves.
R2.6 hosting.yaml title/description are Swedish and must themselves contain no personal data — SPEC §1's
     "Anny Mullers" wording in description MUST be rewritten by P2 (personal data in the public index row
     would defeat the ruling).

## RULINGS R3 — owner answers to the DA-raised exposure decisions (verbatim option labels, 2026-10-06)
R3.1 Git history: "Accept history as-is" — no history rewrite, no force-push. Real photos/phone/address
     remain reachable in bryn1/Webdesign history forever. Orchestrator recommended fresh-history instead;
     OVERRULED, recorded.
R3.2 Old app: "Leave it live on purpose" — https://sibbamala.com/anny/ (mirror of bryn1/anny) keeps
     serving Anny's full real PI. Orchestrator recommended private; OVERRULED, recorded. Not to be
     re-litigated by any child.
R3.3 URLs: "Rename brand dirs now (Recommended)" — approved renames (new phase after R2 commit):
     01-mullers-editorial → 01-mork-guld; 21..26-lab-anny-* → 21..26-lab-demo-*;
     projects/anny → projects/salong. All cross-references (relative hrefs/srcs, tools/build-index.py,
     tools/check-links.py, _site regeneration, RECIPE references) updated in the same commit-set.
     File names inside (anny-portrait.jpg etc.) stay per R2.5 unless they contain brand tokens in a
     URL-visible position — the rename phase child lists any it keeps and why.

## RULING R4 — persona rename (owner chat, 2026-10-06)
Verbatim: "change the person name in Annys prototype/design to 'Jane Cooper'."
R4.1 Global persona replacement inside projects/anny/** ONLY (portfolio keeps its own persona, R2.1):
  "Anny Morin" -> "Jane Cooper"; "Anny" -> "Jane"; "Morin" -> "Cooper".
  Phone 072-155 48 60 -> +46 70 123 45 67 (dialable Swedish placeholder format) ; tel: href tel:46701234567.
  Instagram mullers.anny/@mullers.anny -> @jane.cooper / instagram.com/jane.cooper.
  Email -> jane.cooper@example.com.  Address Landbrogatan 11 -> Drottninggatan 2.
  Karlskrona / Trossö -> Malmö.  Salon brand Müllers -> Jane Cooper (match theme case/lockups;
  split-hero spans render "Jane"/"Cooper").
R4.2 This SUPERSEDES R2's Din Salong/Din Stad strings in projects/anny/** (R3.3 rename targets stay).
     R2's placeholder ART (generated images) is unchanged. R2.4 copy contract and R2.5 motion/layout
     invariants carry over unchanged: no new marketing copy; same filenames/sizes; existing gates
     (reduce 0 triggers/0 style mutations, JS-off visible, 375 hOverflow 0, console 0, AA) all hold.
