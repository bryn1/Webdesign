# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Prototypes in this workspace: plain static HTML + one `styles.css` per folder, no
build step, no framework, no CDN, no remote URL (the picker contract's rule — every
comp renders offline on a phone). The product they describe is the existing app
`bryn1/Np-platform`: FastAPI + Jinja2 templates, two plain CSS files, SQLite; the
Gateboard skin is being implemented on branch `mc11003-np-gateboard` (see
[PROVENANCE.md](PROVENANCE.md)).

## Users

Primary, from the interview answers that bind this rebuild (recorded in the app's
`PRODUCT.md`, `## Users`): **Swedish årskurs 9 students, revising alone, most often on
a phone in portrait, anonymous — no account, no login, no saved progress.** Their job
on the page: answer as many published past national-test questions as possible and
immediately see whether it was right.

The owner also ruled the information architecture **may** be rebuilt — verbatim, per
the app's `PRODUCT.md` ("Capabilities and Constraints"): *"Nej: sidmodellen får byggas
om"*. The incumbent routes are truth-of-content, not a fixed contract.

## Positioning

The real published question bank, not a summary of it — a drill surface for the Swedish
nationella prov åk 9: pick a subject, open an area, run the numbered questions, check
yourself against facit. Anonymous by design; nothing typed is stored. Swedish UI copy.

## Operating Context

The screen set **as built** (Gateboard), one ladder plus its parallel tracks:

**ämneslista → ämne → område → frågepass → (parallel) begrepp- och glosor-övningar → hörförståelse**

- **ämneslista** (`prototypes/01-np-gateboard/index.html`) — the subject board: rows of
  code · name · question count.
- **ämne** (`amne.html`) — one subject's areas, numbered, with counts.
- **område / frågepass** (`frage.html`) — the primary surface: one question as a
  boardpass, facit on its perforated section, the numbered strip of the area as spine.
- **begrepp / glosor** — term-drill tracks reusing the same ruled numbered lists.
- **hörförståelse** (`lyssna.html`) — the listening track: standard `<audio>` + mp3.
  **It exists for franska, spanska and tyska only — not engelska** (engelska's real
  audio count is 0; a Hörförståelse row on `/engelska` would lead to a dead page).

Phone in portrait (375 px) is the main scene; desktop appears in classroom settings.

## Capabilities and Constraints

- Every fact (question, options, facit) is in the HTML; JS only adds interaction — the
  same content reads correctly with JavaScript off.
- Three option shapes exist in the data and every list must render all three (letter →
  text map, plain list, NULL); a mapping must print letter **and** text.
- Anonymous: no account step, no progress to wait for — tap → answer → next.
- Standing boundary (owner, verbatim in run 202610200751-np-remake): *"no update on the
  live website until a design is choosen"* — and after the choice: **no design work
  implies a deploy.** The owner has not given a deploy word; the live site at
  `np.sibbamala.com` stays untouched until he does.

## Brand Commitments

Swedish-language interface copy, kept as written (å/ä/ö correct). Product name in the
shell: `Nationella prov · årskurs 9`. The Gateboard token world in
[DESIGN.md](DESIGN.md) is pinned; no palette decision is open.

## Evidence on Hand

- `projects/np/spec.md` — content canon (every number carries its source).
- `projects/np/prototypes/01-np-gateboard/` — the chosen comp (owner's click chain in
  `PROVENANCE.md`); `02-np-facit/`, `03-np-tavla/`, `04-np-vecka/` — the alternatives
  he was shown, kept so the choice is auditable.
- `meta.json` in each prototype folder — the design's own one-line contract and its
  measured contrast pairs.
- Run dir `.audits/202610200751-np-remake/out/` — chooser server, `choice.json`,
  BUILD-PLAN, verdicts, evidence.
- Absences this product must never fake: no testimonials, no benchmarks, no per-student
  progress (there is none), no login states (there is no login).

## Product Principles

1. The question is the interface: one question, its answer state, the way forward.
2. Phone-first and portrait-honest: every decision is taken at 375 px and proven there.
3. Anonymous speed: no account step, no waiting state, nothing stored.
4. Works without JavaScript — reading is the baseline, interaction is the bonus.
5. Facts only from the bank (spec.md); no invented numbers.

## Accessibility & Inclusion

WCAG 2.1 AA and beyond where the world allows: ink/paper 16.46:1 in both grounds,
muted text measured (4.87:1 / 10.72:1), amber reserved for larm with a non-colour cue,
visible focus, ≥ 44 px tap targets, 12 px type floor, reduced-motion honoured (the
signature amber hold collapses to instant).

## Surface modes

All screens are **Operate** — the visitor arrives to drill, not to browse.
