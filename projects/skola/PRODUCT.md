# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: plain static HTML/CSS (+ vendored GSAP), matching the existing lab convention in this repo (salong prototypes); chosen by the dispatch brief, offered as the default in the session's single question round which went unanswered (no human answer mechanism).

## Users

[Inferred from spec.md — the only content canon.] Pupils, teachers and admins of a Swedish school learning platform. Each role works in its own nav: elev (`/elev/...`), lärare (`/larare/...`), admin (`/admin/...`). Language: Swedish.

## Positioning

A learning platform where the pupil flow is a closed loop: the teacher plans a lesson, the pupil opens the lesson / plugga, gets AI answers with sources, and the result lands in bedömning and framsteg. Teacher side has a granska step for AI-generated questions/content.

## Operating Context

- Teacher plans a lesson → pupil opens lesson/plugga → AI answer with sources → assessment (bedömning) and progress (framsteg).
- Lärare-granska = reviewing AI-generated questions/content.
- Admin surfaces: users, subjects (ämnen), audit log, granska, settings.
- API runs on port 8401 (fact from docs/ARCHITECTURE.md in the skola repo, cited by spec.md).

## Capabilities and Constraints

- Route/view names are fixed verbatim from the source tree: `/login`, `/registrera`, `/admin-login`, `/change-password`, `/elev`, `/larare`, `/admin` and their cluster members (see spec.md table).
- `/om` and `/om/integritet` are static text — no prototype.
- One prototype per cluster; cluster members render as in-page sections/states in the same index, not extra pages.
- Swedish copy, å/ä/ö correct: "Granska", "Plugga", "förmåga", "Bedömning", "Framsteg", "Schema", "Meddelanden", "Inställningar", "Klasser", "omdomen", "repetera", "tidigare", "Begrepp".
- Max one generated (local) decorative image per prototype; persons never generated; portrait fields stay empty marked frames.

## Brand Commitments

None beyond the pinned token baseline (zinc ramp, indigo accent, Major Third type scale, 4px spacing, light+dark) from the workflow-frontend design baseline.

## Evidence on Hand

- `projects/skola/spec.md` — content canon.
- `.tmp/skola-tree.txt` — the real frontend/app/ route tree of bryn1/skola.
- `projects/salong/prototypes/_assets/vendor/` — vendored GSAP copies (reused into `projects/skola/prototypes/_assets/vendor/`).
- Absences: no real screenshots, no invented testimonials, prices or benchmarks.

## Product Principles

1. The task comes first: every surface is Operate-mode — the visitor completes a job.
2. Facts only from the tree/spec; no invented numbers or claims.
3. One form family, one component language across the login cluster.
4. Density over decoration: the world lends type, palette, density and one signature move only.

## Accessibility & Inclusion

WCAG AA contrast (4.5:1 text, 3:1 large), keyboard focus visible, works without JS (no hidden-by-JS text), reduced-motion respected. Pinned by the quality gate.

## Surface modes

All four prototypes are **Operate** (per spec.md: "Operate-läge").
