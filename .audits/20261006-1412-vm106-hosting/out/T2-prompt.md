Read /home/claudecode/Hemsidor/.audits/20261006-1412-vm106-hosting/out/BRIEF.md (gate block + RULING
R2 bind you) and .../out/RECIPE.md (the substitution table — your law). MC card 10088.3 T2
[type:frontend]. Do NOT push, do NOT commit hosting.yaml (T3 does the push). You never spawn
anything. Work in /home/claudecode/Hemsidor.

TASK: execute RULING R2 (de-personalize projects/anny/**) exactly per RECIPE.md:
1. Image placeholders: write tools/gen-placeholders.py (stdlib+PIL is installed, v12.2; keep <=~150
   lines, one concern) generating the 6 replacement files per RECIPE §B — abstract gradient/shapes in
   a neutral warm palette (think: soft vertical color washes with subtle grain; NO text, NO objects,
   NO faces), EXACT same filenames, pixel sizes and formats; overwrite the 5 files in
   projects/anny/prototypes/_assets/ AND the 4 gal-*.jpeg in projects/anny/prototypes/00-poc-live-site/images/.
   Verify each output: identical pixel dims to the original (record originals: gal 1536x2048, portrait
   1656x2208; read the poc copies' actual sizes with PIL and match THOSE).
2. Text sweep: apply RECIPE §A rules in order across projects/anny/** (html, css, js, json — the
   files that exist), preserving case/typography; reflow the few sentences that break grammatically
   (Swedish, minimal words — R2.4 copy contract: ONLY what a replaced reference forces). Update
   anny-portrait.ATTRIBUTION.md body per §B. Do NOT touch projects/portfolio/**, do NOT touch
   README/BRIEF at repo root, do NOT touch .md files except ATTRIBUTION.md.
3. SELF-CHECK (your RED-proof): after the sweep, run
   grep -rniE 'anny|mullers|072-155|landbrogatan|karlskrona|tross|sibbamala|gmail\.com' projects/anny/
   --include='*.html' --include='*.css' --include='*.js' --include='*.json' | grep -vi 'dinsalong'
   -> MUST be empty; also grep 'anny' case-insensitively file by file and justify any hit you keep
   ONLY if it is a gitignored-path or a filename reference (paths like _assets/anny-portrait.jpg STAY
   per R2.5 — filenames are unchanged BY DESIGN; report them as a separate "filename-only hits" list,
   never as text). Additionally verify 00-poc-live-site/js/gallery-manifest.js + any gallery refs still
   point at existing files.
4. RENDER-PROOF: with playwright-core (pattern: createRequire from
   /home/claudecode/opt/deepseek-harness/packages/experimental/browser-use-playwright-mcp/package.json)
   load http://192.168.5.231:8090/anny/prototypes/<NN>/index.html for FIVE themes (01, 07, 13, 18, 20):
   console errors == 0, page contains NO personal string, images decode (naturalWidth>0), one
   screenshot each to /home/claudecode/Hemsidor/.tmp/p2/shots/.
5. Append every changed file as a row to .../out/RECIPE.md §C.
6. COMMIT (do NOT push): git -c user.name="frontend (10088)" -c user.email=frontend@agent-town.local
   commit -o -m "frontend (10088): DE-PERSONALIZE-01 — RULING R2: identity+contact copy to
   Din Salong/Din Stad placeholders per RECIPE.md; real photos replaced by generated placeholder art
   (same names/sizes); tools/gen-placeholders.py" -- projects/anny tools/gen-placeholders.py
   (add RECIPE.md row-append is under .audits which is gitignored — leave it out of the commit).
   Nothing else may be staged (git status must show your paths only after -o).

DoD: commit exists (git log -1 --stat shows ONLY your paths); self-check grep empty (filename-only
hits listed separately in your RESULT); 5 render-proofs with 0 console errors + images decoded;
RECIPE §C fully logged. Return pointer (commit sha) + one-line outcome incl. total files changed.
