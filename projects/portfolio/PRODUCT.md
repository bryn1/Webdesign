# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: a recruiter or prospective client visiting the portfolio gateway (sibbamala.com/webdesign → the hero page at projects/portfolio/concepts/workflow-explode/). Situation: first visit, a few seconds of attention. Job: decide within one scroll that "this person builds with a system, not by accident", then continue to `#om` / `#projekt`. (Confirmed by owner, structured Q&A 2026-10-07.)

Secondary: the owner himself, iterating his own prototypes through live mode.

## Product Purpose

A static scroll story that presents the owner's way of working — one finished prototype that visibly unpacks into code, workflow, task board and orchestrator, then racks back into the portfolio navigation. Success = the six-scene story reads, every caption is honest, and the page works with JS off, under reduced motion, at 375px, with zero console errors.

## Positioning

Assembly shown BACKWARDS: instead of selling a finished screen, the page explodes a finished screen into its parts and re-racks them — a claim ("I build with a system, verifiably") a template portfolio cannot copy. All on-screen evidence is explicitly invented and labelled as such.

## Operating Context

Repo bryn1/Webdesign on VM350 (192.168.5.231): `projects/<p>/spec.md|prototypes/|concepts/`, served locally (:8090 prototypes, :8092 portfolio concepts), mirrored to sibbamala.com by the reconciler after push. Design iteration happens with impeccable live mode via the owner proxy at http://192.168.5.231:8450/. Work is tracked on Mission Control; the fleet quality-gate script gates every folder.

## Capabilities and Constraints

Binding rules, owner-guarded (Q&A 2026-10-07, all three confirmed):
1. Every number, card and name shown on the page is invented and MUST carry the visible `demo · fejkad data` chip. No real customer, Mission-Control or personal data — never.
2. Mechanism monogamy: exactly one pinned stage + one scrubbed GSAP master timeline per page; scenes are labels on it, never parallel mechanisms.
3. `#om` / `#projekt` stay honest placeholders until the real portfolio goes toward production.

Standing constraints: static files only, no build step; GSAP + ScrollTrigger 3.12.7 vendored under `js/vendor/`; hero page fonts vendored locally (21d6206 — zero external requests on that page; the 20 prototypes' Google-Fonts CDN exception is a separate open E3); ≥15px mobile text floor; WCAG AA; Swedish copy; `prefers-reduced-motion` → static stepped view with 0 ScrollTriggers.

## Brand Commitments

Swedish voice, first person ("jag"). Name/branding TBD when the real portfolio replaces the placeholders — do not invent one. Visual world of the hero surface ("Signalväg", studio-rack) is recorded in DESIGN.md; it is this surface's world, not a repo-wide brand.

## Evidence on Hand

Real: one genuine prototype screenshot (assets/hero-12.png, theme 12 served on :8090), the 20 prototypes under projects/portfolio/prototypes/, per-folder quality-gate reports. Absences future work must NOT fabricate: real clients, real testimonials, real project counts, real pricing.

## Product Principles

1. Honesty is the feature: labelled fake data beats silent decoration.
2. One mechanism, executed deep — a single scrubbed story, never effect soup.
3. The floor is checked, not promised: gate PASS before any "done" word.
4. The artifact leads; the person reads through the work, not a bio.

## Accessibility & Inclusion

WCAG 2.1 AA contrast verified at 1440 and 375 by the folder quality-gate; full content readable without JS; reduced-motion path ships zero scroll-triggered animation.
