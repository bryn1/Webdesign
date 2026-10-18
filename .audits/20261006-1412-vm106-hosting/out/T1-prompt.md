Read /home/claudecode/Hemsidor/.audits/20261006-1412-vm106-hosting/out/BRIEF.md first — its gate
block binds you. You are the P1 INFRA RECON child for MC 10088 (vm106 hosting of bryn1/Webdesign).
READ-ONLY phase: inspect, dry-run, report. You change NOTHING: no commits, no pushes, no writes
outside your artifact paths. You never spawn anything (no subagent, no workflow).

GOAL (observable DoD): produce /home/claudecode/Hemsidor/.audits/20261006-1412-vm106-hosting/out/SPEC.md
containing, each section with file:line evidence you actually read this session:
1. THE hosting.yaml, paste-ready (strict JSON): {"name":"webdesign","type":"static","root":"apps/webdesign"}
   plus the optional meta keys the reconciler accepts (title/description/tags — Swedish, they render
   verbatim on the public portfolio index; icon optional) and a "mirror" block tuned per your §3.
   Validate it parses with reconcile.is_web_app-equivalent logic and validate-hosting.py rules in your
   head — but do NOT write it into the repo (P2 does that).
2. NAME/port/path facts: NAME_RE pattern; confirm name "webdesign" is legal and no existing app in
   ~/hosting/apps.yaml (read the working clone, do NOT edit it) occupies name "webdesign" or path
   /webdesign/; note the exact public URL that will result (sibbamala.com/webdesign/).
3. MIRROR SPEC: from mirror.py resolve_spec/resolve_subset semantics (include/source REPLACE the
   static include defaults; exclude EXTENDS; match_globs last-match-wins with "!"), write the include/
   exclude lists that ship EXACTLY: repo-root index.html; projects/**/*.html, *.css, *.js; the
   _assets dirs (anny-portrait.jpg, gal-0*.jpeg, ATTRIBUTION md may EXCLUDE — it's prose; vendor
   gsap.min.js + ScrollTrigger.min.js MUST ship); image/thumb files under whatever dir P2 will use;
   favicon. EXCLUDE by omission: tools/, docs/, projects/portfolio/spec.md, *.md (except where an
   html page links it — none should), .audits (already gitignored). THEN VERIFY: run mirror.py's
   resolve_spec()/resolve_subset() (import it, or copy its pure functions via python3 -c) against
   the live tree /home/claudecode/Hemsidor and print the resulting served file list — include the
   count and the first 20 + any surprise entries in SPEC.md, plus your verdict: does the tree contain
   exactly the intended files, and does it contain the root index.html (P2 will add it — model its
   presence by touching a temp copy: cp -r the repo tree WITHOUT .git to .tmp, add stub index.html
   there, never in the real repo).
4. PRODUCT-GATE expectations for type=static on vm106: what reconcile.py build_health/product_health
   probe (which URLs relative to /webdesign/, what makes it RED), what staging.py forbids (forbid-list
   paths + how assets=True/False gate behaves for static), and cachebust: which mode keeps photo
   updates visible behind Cloudflare (~4h cache, no purge) — recommend the value for the mirror block.
5. RISKS for this repo shape: nested ../../_assets/ references from projects/anny/prototypes/<NN>/
   pages — confirm the relative refs resolve INSIDE the served subset once root index.html + project
   trees ship (list the ref kinds found in 07-retrofilm/index.html and 05-mjuk-glas/index.html:
   relative css/js, ../_assets/vendor, data: URIs, fonts CDN); Google Fonts CDN refs stay (accepted
   ruling 4); any absolute "/" refs you find in any projects/**/index.html (grep) — these WOULD break
   under path hosting /webdesign/ and MUST be listed as P2 must-fix (report count + files).
6. THE RECONCILER TICK mechanics you verified: crontab line, log path, what a SUCCESS looks like in
   the log for a static app (exact log verbs: RESOLVED, DIFF, MC#2369 auto-host: mirror webdesign),
   and what the first-deployment bootstrap skip does (product gate skips never-served apps —
   currently_served False -> skip — confirm the code line).
Return: pointer to SPEC.md + one-liner "paste-ready yes/no + biggest risk". No verdict file needed
(P1 is recon); your DoD is SPEC.md existing with all 6 sections + the verified resolved file list.
Evidence/scratch: /home/claudecode/Hemsidor/.tmp/p1/ (create it).

DoD: SPEC.md exists at
/home/claudecode/Hemsidor/.audits/20261006-1412-vm106-hosting/out/SPEC.md with all six sections
(1 hosting.yaml paste-ready JSON, 2 name/path collision check, 3 mirror include/exclude + a
resolve_subset dry-run file list run this session, 4 static product/staging gate expectations +
cachebust recommendation, 5 broken-absolute-path inventory for P2, 6 tick mechanics + first-deploy
bootstrap code line) and every factual claim carries a file:line you opened this session.
