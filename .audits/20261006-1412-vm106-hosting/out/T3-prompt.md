MC 10088.7 [type:infra] T3 — MAKE THE TREE HOSTABLE (hosting.yaml + public browse surface). No push.

Read first: out/BRIEF.md (gate + R2/R3/R4), out/SPEC.md sections 1-4, out/RECIPE.md, and the DA
verdict c2 IF present. Work in /home/claudecode/Hemsidor (base after TEST/ARCH: record shas in your
report; rebase-check origin/main == 00b8dc5-ancestor; parallel crew may have pushed — git fetch
first, if origin moved rebase your work and re-run your proofs).

1. hosting.yaml at repo root — STRICT JSON (json.loads must parse). Use SPEC §1 paste-ready BUT:
   - description per R2.6/F2: NO personal data, NO persona names needed; proposed verbatim:
     "Interaktiva webbläsarprototyper för en frisörsalong samt portfolio-koncept. Byggda i ren HTML,
      CSS och JavaScript med GSAP-animationer."
   - title stays "Webdesign — prototyper & koncept"; name "webdesign", type "static", root
     "apps/webdesign", cachebust "all".
   - mirror.include: SPEC list, but verify every entry still matches the RENAMED tree (projects/**
     still covers projects/salong; "thumbs/**" must exist as real committed files after step 2).
   - mirror.exclude extends: keep **/*.md, docs/**, tools/**, _site/**, .audits/**; ADD .tmp/**.
   - Validate with the reconciler's validator: python3
     /home/claudecode/agent-town/infra/vm106/repo-visibility-hosting/validate-hosting.py hosting.yaml
     (find exact validator path from SPEC §4 if this path differs; exit 0 required, paste output).
2. Public browse surface — committed REAL files at repo root (mirror drops .md, so the public root
   needs an html index): root index.html linking projects/salong/prototypes/ +
   projects/portfolio/prototypes/ (relative links ONLY, Swedish, Jane Cooper portfolio-neutral
   wording, no banned tokens; banned-sweep it yourself). Reuse tools/build-index.py logic — if it
   can emit the root page + thumbs to tracked paths, extend it (its output to gitignored _site
   unchanged); thumbs to repo-root thumbs/** (committed). Add a favicon.ico (reuse _assets or
   generate 32x32 with PIL into favicon.ico).
3. Re-run the dry-run mirror simulation .tmp/p1/dryrun_mirror.py (update its include/exclude to your
   final hosting.yaml; copy into .tmp/p3/) — paste served/dropped counts + confirm: zero .md/tools/
   docs/_site/.audits in served; root index served; all theme assets served; hosted-index.json
   healthy if that gate applies (reconciler derives it; your root index must link everything so
   healthy stays true — read SPEC §6 note).
4. Run tools/check-links.py — 0 broken.
5. Commit: git -c user.name="infra (10088)" -c user.email=infra@agent-town.local commit -o -m
   "infra (10088): HOSTING-01 — hosting.yaml (static, strict JSON, R2.6-clean description) + public root index + thumbs + favicon; dry-run served=NNN with quarantined paths dropped" -- hosting.yaml index.html thumbs favicon.ico tools/
   (adjust pathset to what you actually created; ONLY your paths).
DoD: hosting.yaml parses strict + validator exit 0 (output pasted in report); root index.html +
thumbs + favicon.ico committed; dry-run re-run saved to .tmp/p3/dryrun_output.txt (paste served
count + zero-leak confirmations); check-links 0 broken; banned-string sweep over YOUR new files = 0.
Do NOT push. Never spawn. Return pointer (sha) + one line + dry-run served count.
