# ARCH-verdict — MC 10088 ARCH phase (scroll wave + 20-theme library) — rev 2

Reviewer: design profile, 2026-10-05. Rev 1 (VERDICT: FIX) is superseded wholesale here.
Inputs: DONE.md (A–E), TEST-verdict-c5.md (PASS), DA-verdict-c4.md (SHIP). Deliverable audited:
`docs/ARCHITECTURE.md` (164 lines ≤ 300 cap, committed 3d47642 + 8e71a2e) against the tree,
re-derived ONLY from artifacts (`ls`, `wc -l`, greps, cron read, ps, `ls -d`) this session.

## Check 1 — docs/ARCHITECTURE.md vs the actual tree — PASS

Re-derived this session from the artifact, never from a report:
- **Modules/dirs**: 20 theme dirs + `_assets/` + gallery `index.html`; gallery = exactly 20 cards
  / 20 theme hrefs (bijection). Each theme = `index.html` + `css/` (2–4 files) + `js/` (2–6
  files). Doc §2/§3 match.
- **Deps**: vendored `gsap.min.js` + `ScrollTrigger.min.js`, both banner `3.12.7`; all 20 themes
  load both via relative `../_assets/vendor/` tags (20/20); only other external refs = Google
  Fonts CDN (doc'd exception E3) + one instagram.com content link. `animation-timeline` real
  declarations: 0 (prose comments only). Doc §4/§9 match.
- **Entrypoints/ports/stores**: gallery + theme `index.html`; `PORT`=8090; live server =
  `python3 -m http.server 8090 --bind 0.0.0.0 --directory .../prototypes` (ps); keepalive cron
  `@reboot` + `*/5` → `~/.dsh/bin/proto-server-keepalive.sh` (crontab + script read); zero
  data stores/APIs. Doc §6/§9 match.
- **Single-motion-file reality (S-F3 item)**: exactly ONE ScrollTrigger-registrar per theme,
  20/20 (grep per file, 5–12 sites each). Warts tabled honestly in doc §4: themes 12+19 use
  legacy name `js/scroll.js` (still sole registrar); theme 11 keeps its pre-wave IO reveal
  engine in `main.js` beside GSAP (GSAP file: 0 reveal targets; P2 queued — DONE S-F3, DA-c4
  P2-1); themes 02 (P3) / 15 (P4) keep accepted IO helpers. The doc matches reality, warts
  included — which is what PASS requires.
- **Portrait/asset provenance**: 18/20 themes ref `anny-portrait.jpg`; 15+18 photo-free with 0
  photo refs (re-grepped); `ATTRIBUTION.md` present. Doc §5 matches.

## Check 2 — file hygiene — PASS (numbers re-derived, not quoted)

`wc -l` over `prototypes/**/*.html|css|js`, vendor excluded: 145 files — 6 612 html / 11 118
css / 4 690 js lines.
- **>400 hard ceiling: exactly 1 file** — `08-organiskt-hantverk/index.html` at **456 lines WITH
  an in-file header reason** (first lines read and confirmed; ruling 2026-10-05, sha f5b2de9).
  Next-largest 399 (`17-mork-akademien/css/style.css`). 35 files sit in the 251–399 soft band;
  zero hard breaches beyond the ruled 08.
- **Tests ≤600**: `test_prototypes.py` = 190 lines. Vendored minified `_assets/vendor/*.js`
  exempt and labelled in doc §8.2. Doc itself 164 ≤ 300 cap.

## Check 3 — layout-v2 placement — PASS (re-run this turn after the fix)

- `ls -d /home/claudecode/Hemsidor/out` → **No such file or directory** — the stray empty `out/`
  flagged in rev 1 was removed by the parent (file-count 0 confirmed before rmdir; the removal
  itself was outside my write scope). Repo root now: `BRIEF.md PORT prototypes/ docs/ concepts/`
  (+ `.audits/`, dot-dirs). Doc §8.6 re-worded to RESOLVED in the same revision (8e71a2e).
- Every new file at its layout-v2 path: `docs/ARCHITECTURE.md` ✓ (created + committed 3d47642);
  run records in `.audits/202610041341-f6053f16/out/` ✓.
- `.audits/202610051009-workflow-explode/` — **classified legitimate, unrelated**: separate
  timestamped run dir per convention (MC 10140.1, design-only CONCEPT: CONCEPT.md,
  DA-verdict-c2.md, ARCH-placement-note.md); its empty build target `concepts/workflow-explode/`
  + `:8092` server via `concept-server-keepalive.sh` belong to that run, not this product. Not a
  stray sibling. Untracked = in-flight, parent commits.
- `.tmp/ .playwright-mcp/ .pytest_cache/` git-ignored scratch (.gitignore read). OK.
- Informational, parent-owned: `DONE.md` `M` in git (the ledger is the orchestrator's record
  duty). No other placement gap found.

## Theme-11 honesty judgement (explicit, per brief)

Doc §4 names the remnant engine, file, zero-overlap reason, P2 queue, and cites S-F3 — and adds
the same-class 02/15 helpers DA-c4 graded P3/P4. Architecture-vs-reality on this point: matches.

## Revision log

rev 1 FIX → gap: repo-root empty stray `out/`. Parent applied the named one-command fix; this
turn's re-run of the same instrument proves it gone; doc re-worded; all three checks now hold.

# JUDGED: c802d6b1c21f1b6a243280f0483f85bd7860dfce7e598fefeedda165e76efee9
# VERDICT: PASS
