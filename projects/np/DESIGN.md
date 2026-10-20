---
name: np — Gateboard
description: National-test drill for åk 9 on a phone — departure-board black, paper-cream reading ground, one amber for larm only.
colors:
  paper: "#F4F2EC"        # --paper  page ground
  ink: "#141414"          # --ink    text on paper — 16.46:1 measured
  grey: "#6A6A62"         # --grey   muted text on paper — 4.87:1 measured
  line: "#C9C7BF"         # --line   hairline on paper, non-text
  silver: "#C6C6BE"       # --silver muted text on the board — 10.72:1 measured
  amber: "#FFB300"        # --amber  LARM only — 1.6:1 on paper, forbidden as text there
  on-amber: "#141414"     # --on-amber the only legal text on amber — 10.26:1 measured
  edge: "#2E2E2C"         # --edge   board row hairline, non-text
  board: "#141414"        # --board  the pinned dark tavla, both schemes
  board-ink: "#F4F2EC"    # --board-ink chalk press on the board — 16.46:1
typography:
  sans:
    fontFamily: "ui-sans-serif, system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace"
sizing:
  tap: "44px"             # --tap the world's own minimum tap target
  type-floor: "12px"
---

# Design System: np — Gateboard

Chosen design, not a candidate: the owner picked **Gateboard** at the picker
(`prototypes/01-np-gateboard/`, chain in [PROVENANCE.md](PROVENANCE.md)). This sheet
describes the token world as it was **built** in the product sheet
`backend/static/innovita.css` on `bryn1/Np-platform` branch `mc11003-np-gateboard` —
13 custom properties under one `:root`. The values below are that sheet's, quoted.

## Overview

**Creative North Star: "Avgångstavlan" — the departure board.**

Lists read as departures (code · name · count, then NR · FRÅGA · TYP · STATUS on the
black board); the question is a stamped travel document — the *boardpass* — with the
question number punched and facit printed on its section. The black board is pinned in
both colour schemes; the reading ground is warm paper. One amber exists, and it means
only *larm*.

**Key characteristics:**
- Two grounds, one pair of inks: paper/ink and board/board-ink are the same two hexes
  swapped — 16.46:1 on both.
- Dark mode is **derived, not a second palette**: under `prefers-color-scheme: dark`
  `--paper`/`--ink`/`--grey`/`--line` swap roles; `--silver`/`--edge`/`--amber`/
  `--on-amber` and the pinned board keep their light values (built-sheet comment).
- Type is the system stack only — no webfonts; `--mono` carries the tabular figures of
  the number column.

## The 13 tokens (exactly as the built sheet defines them)

| Token | Value | Role |
|---|---|---|
| `--paper` | `#F4F2EC` | page ground |
| `--ink` | `#141414` | text on paper — **16.46:1 measured** |
| `--grey` | `#6A6A62` | muted text on paper — 4.87:1 measured |
| `--line` | `#C9C7BF` | hairline on paper, non-text |
| `--silver` | `#C6C6BE` | muted text on the board — 10.72:1 measured |
| `--amber` | `#FFB300` | **LARM only** — 1.6:1 on paper, forbidden as text there |
| `--on-amber` | `#141414` | the only legal text on amber — 10.26:1 measured |
| `--edge` | `#2E2E2C` | board row hairline, non-text |
| `--board` | `#141414` | the tavla: a pinned dark board in **both** schemes |
| `--board-ink` | `#F4F2EC` | chalk press on the board — 16.46:1 |
| `--sans` | system stack | all text |
| `--mono` | system mono | tabular figures, number column |
| `--tap` | `44px` | the world's own minimum tap target |

Ratios are computed relative luminance from the sheet's own hexes (recorded in the
comp's `meta.json` and re-measured by the run's C8 evidence,
`.audits/202610200751-np-remake/out/C8-measure-and-facit-guard.md`).

## Measured rules (these were measured, not decorated)

1. **`--ink` on `--paper` = #141414 on #F4F2EC = 16.46:1.** The same pair inverted is
   the board (`--board-ink` on `--board`), so both grounds clear 7:1 by the same fact.
2. **Amber is larm only — never decoration.** On paper it is 1.6:1 and **forbidden as
   text**; the only legal text on a lit amber field is `--on-amber` (#141414, 10.26:1).
   A row lit amber is a status the visitor caused, in this page view only.
3. **Type floor 12 px.** The built sheet's smallest `font-size` is 12px (measured from
   the sheet itself); nothing prints smaller, at any width.
4. **Tap minimum 44 px (`--tap`).** Interactive targets are measured ≥ 44 px at 375 px;
   the crumb fix went 35.7 → 44.0 px under this rule (C8 evidence).
5. **Answers are in the HTML with zero JavaScript.** Every question, option and facit
   string ships in the markup; a `<details>` facit must open with scripting off — JS
   only adds interaction on top of the same reading.
6. **A `details.facit` inside a `.board` must never inherit chalk ink.** The board
   prints chalk-on-black, and the facit block initially inherited it — which produced
   an **invisible answer**: computed rgb(244,242,236) on rgb(244,242,236) = **1.00:1**
   across all four drill screens at 375 px. No text check caught it; only a screenshot
   did. The guard forces the block its own pair (`background: var(--paper);
   color: var(--ink);` → 16.46:1). Any new surface that reuses `.board` must re-check
   this computed pair, not assume the class chain.

## Layout & shapes

Phone first: designed and proven at 375 px portrait, then 1440 px; no horizontal
overflow at 375. The board is a ruled two-column list (`--edge` row hairlines); the
boardpass is a bordered pass-card with perforated sections, its number set in `--mono`.
Borders are 2 px `--ink` on paper and `--edge` hairlines on the board; no shadows, no
gradients, no nesting.

## Signature move (recorded, from the comp's meta.json)

*"Rowen byter inte plats — ett statusbyte stiliserar om raden på sin plats, håller
amberfärgen 0,2 s och låter den brinna tills besökaren går vidare; vid reducerad
rörelse är övergången omedelbar."* A changed row restyles in place and stays lit;
reduced-motion makes it instant.

## Don'ts

- Don't use amber on paper as text, or anywhere that is not a larm the user caused.
- Don't add a second accent or a hue-per-subject token (`--hue` was explicitly retired;
  the build gate greps for it).
- Don't print anything under 12 px, under 44 px of tap, or under the measured pairs.
- Don't let any block inside `.board` inherit the chalk pair for readable content.
