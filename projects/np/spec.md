# np — prototypes

Innehållskanon för np-prototyperna (Gateboard-valda, se `PROVENANCE.md`).

**Rule (kept from skola's spec.md, same spirit): no fact, number or string may be
invented. Every figure below carries the source it was verified against; anything not
listed here is not canon for these prototypes.**

Sources, named by tag below:

- **[B]** run `202610200751-np-remake`, file `out/BUILD-PLAN.md` §D.0 — the numbers the
  orchestrator verified against the canonical read-only bank copy
  `Hemsidor/.tmp/np-canon/np.db` (the SQL for each is pinned in that §; queries run
  2026-10-20, published = `is_published=1`).
- **[C]** `out/chooser/content.json` (same run dir) — the real content bundle every comp
  was built from. No comp string exists outside this file + the fixed shell strings.

(All `out/…` paths are inside this repo at
`.audits/202610200751-np-remake/out/`, untracked run records; the prototypes in
`prototypes/` are the tracked archive of what they rendered.)

## Bank canon [B]

- **4 364 published questions** (the published population the site prints). [B §D.0, Q1 population]
- The **nine** ämne rows the `/` board prints, with their published question counts
  (counting SQL Q1; fr/sp/ty are excluded from this board by the app's own `index()`
  even though they hold questions — that exclusion is why the board shows nine):

  | Ämne | Frågor |
  |---|---|
  | NO — Biologi | 691 |
  | Matematik | 604 |
  | NO — Fysik | 533 |
  | NO — Kemi | 489 |
  | SO — Geografi | 315 |
  | Samhällskunskap | 233 |
  | SO — Historia | 223 |
  | Religionskunskap | 211 |
  | Engelska | 119 |

- **`year` is NULL on 4 227 of 4 364** published rows — "årskurs" is mostly absent from
  the bank, so it is **not a filter to design around**; the honest field shows `–` /
  `ej angivet`. [B §C.2 field rule, Q-set 2026-10-20]
- **Audio rows (published, by subject): fr 179 · sp 179 · ty 174 · engelska 0.**
  Hörförståelse therefore exists for fr/sp/ty and must never print a Hörförståelse row
  on engelska. [B §D.0 Q4/Q5]
- **Published `matrix` rows split by `options_json.mode`: flashcard 1 514 ·
  checkbox_grid 30 · single 10.** So `question_type='matrix'` is **NOT a shape key** —
  the shape is the mode; a `type == matrix ⇒ grid` rule would render 1 514 concept
  cards as empty grids. [B §D.0 Q17, §C.2 F12]
- **Område 6 (matematik) withholds 98 published questions that have no facit** — the
  topic page prints the honest line "98 frågor i detta område saknar facit och visas
  inte" and the number only where it is real. [B §D.0 Q2, §D.3]

## Comp content canon [C] — what the four archived comps actually print

- `subjects[]`: **12 rows** (code + name + topic count), including fr/sp/ty — the comps
  were built to show every content subject. The built app's `/` board prints **nine**
  rows because its own `index()` excludes the three language codes (see [B] above):
  the archive preserves what the owner judged, the difference is named, not hidden.
- `subject` open on the deep screens: **Engelska** (`engelska`), areas (`topics[]`):
  **Hörförståelse 39 · Läsförståelse 78 · Skrivande 2**; the open area is Hörförståelse.
- `frage.html` shows `shorts[0]`: **question id 559**, "How often does Sade's club
  collect bottles?", type `short`, `year` **None** (null, per the rule above),
  max_points 1, facit **"Every Friday."**
- `lyssna.html` shows the first of `audio[]` (ids 1663–1665, fr): "Où Théo fait-il son
  stage d'observation ?", facit letter **B**, `<audio>` + mp3
  `np_fr_listening_arbete_steg3_01.mp3` (the mp3 lives in the run dir, not in this
  archive — see PROVENANCE.md).
- `shapes`: the three option shapes rendered as labelled samples — `letter_map` (mode
  `single`, columns print ONCE in the header), `plain_list`, `no_options`.

## Copy rules

- Swedish UI copy, shell constant `Nationella prov · årskurs 9`; å/ä/ö correct.
- The ladder wording as built: ämneslista → ämne → område → frågepass (see PRODUCT.md).
- A figure not in this file or in `content.json` does not appear in any np prototype,
  doc or commit message.

## Confirmation (DoD line)

Every number printed in this file comes from the MC 11003 brief's verified list ([B]:
4 364 · 691 · 604 · 533 · 489 · 315 · 233 · 223 · 211 · 119 · 4 227 · 179 · 179 · 174 ·
0 · 1 514 · 30 · 10 · 98) or from `out/chooser/content.json` [C] (12 subject rows, 3
engelska areas, 39 · 78 · 2, question 559, audio ids 1663–1665). **No other figure
appears in this file.**
