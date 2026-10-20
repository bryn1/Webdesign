# Provenance — the np design workspace

The short chain that makes this folder's choice auditable. Run
`202610200751-np-remake` (MC 10968 parent; this workspace filed under MC 11003),
2026-10-20.

## 1. The owner's rulings (quoted verbatim)

The remake ask, recorded in the run's `out/HANDOFF.md`:

> "kill server. though i want a really professional frontend design, not just an
> improvement. full remake with full impeccible skill"

> "i want to have different designs presented in a webserver i can reach via vpn …
> no update on the live website until a design is choosen"

The choice, his own word at the picker:

> **"go, gateboard"**

## 2. The click artifact

`out/chooser/choice.json` (in this repo's untracked run dir):

```json
{ "key": "gate", "title": "Gateboard", "at": "2026-10-20T10:39:53+00:00", "by": "192.168.3.5" }
```

sha256 `2ed65766317faa26d795b09903161d054ab7cb00fd792f4887ef77b62dd14891` —
re-computed when this workspace was placed and matching. `out/chooser/choice.log`
carries the later confirmation clicks (`{"key": "gate", …, "confirmed": true}` at
11:03:52Z). The three alternatives he was shown are kept beside the winner:
`02-np-facit`, `03-np-tavla`, `04-np-vecka`, each with its 375 px shot.

## 3. The run

`.audits/202610200751-np-remake/` in this repo — chooser contract, the four full comps,
the picker server, `BUILD-PLAN.md`, the DA/TEST verdicts and the C8 measure evidence.
This workspace is that run's design output landed in the repo's per-project shape
(`projects/skola/` convention: `spec.md`, `PRODUCT.md`, `DESIGN.md`, `prototypes/NN-name/`).

## 4. Where the design is being implemented

App repo **`bryn1/Np-platform`**, branch **`mc11003-np-gateboard`** (base `6cce919`;
tip `daef548` when this file was written, re-checked live). Side branch only — nothing
on it is pushed by this workspace, and the token sheet described in `DESIGN.md` is that
branch's `backend/static/innovita.css`.

## 5. The live site is untouched

`https://np.sibbamala.com/static/innovita.css` = **16 895 bytes** at this workspace's
open and again at its close (measured, see evidence file
`.audits/202610200751-np-remake/out/evidence/C10-np-workspace.md`). **Until the owner
says otherwise.** No design work — none of these files, no branch build — implies a
deploy; the deploy word is his and has not been given.

## 6. Archive honesty notes

- All 28 copied files (`cp -a`) are byte-identical to the comps the owner judged, proven
  file-by-file with `cmp -s` (28 OK / 0 mismatch; transcript in the evidence file).
- The four `lyssna.html` reference `../assets/audio/np_fr_listening_arbete_steg3_01.mp3`;
  the 856 kB mp3 stays in the run dir and is not committed here — the archived audio tag
  does not play standalone. Deliberate: this repo tracks the design, the binary stays
  with the run.
- `/home/claudecode/np-wt` was read-only evidence for this workspace; nothing was
  written into it.
