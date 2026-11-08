# Product

<!-- impeccable:product-schema 1 -->

Content canon for every string shown on the page: `projects/salong/spec.md`. This brief is internal (English by design; page copy stays Swedish). Lines marked "owner-ratified" carry the owner's ruling date.

## Platform

web — static pages, no build step: `index.html` + `css/` + `js/` per theme folder (spec.md: "Statiska filer, ingen build-step"). Fully readable without JS and offline.

## Users

A first-time visitor considering booking (derived from the owner-ratified purpose below and spec.md): their job on the page is to get a time booked within one scroll; secondarily to see prices and opening hours.

## Product Purpose

Owner-ratified 2026-11-08: a first-time visitor should be able to BOOK A TIME within one scroll (phone or an online booking button), and secondarily see prices and opening hours.

## Positioning

Owner-ratified 2026-11-08: what separates this salon from other salons in Malmö is calm, rhythm-based hair care — the name "Salongens rytm" (the salon's rhythm) IS the positioning: honest pricing, no pushy booking tactics. The phrase is the owner's ratified words (not a spec.md string); the theme built on it is `prototypes/27-salongens-rytm/`.

## Operating Context

The site is the PoC for Jane Cooper, a frisör in Malmö (repo bryn1/salong); the prototypes reuse the owner's current PoC-site text (spec.md preamble), Swedish copy, `lang="sv"`. Today (PoC stage): prices render `–` ("sätter ej pris", PoC rule I1), opening hours render "(bekräftas snart)", the booking calendar is a mock labelled "demo". `_assets` art is fleet PLACEHOLDER gradients (`tools/gen-placeholders.py`; provenance `prototypes/_assets/jane-portrait.ATTRIBUTION.md`). Production-stage items N1 (service→booking-time deep links) and N2 (prices in copy) are out of scope for the PoC — "exempt at PoC stage per brief" (`.audits/20261107-deliverable-audit-c3/audit-c3.md` in that theme's folder), and N2 collides with PoC rule I1.

## Capabilities and Constraints

- Booking reality at PoC stage: "Välj en tid — sedan bokar du via telefon eller Instagram"; the mock calendar leads to phone/Instagram, never a fake confirmation. No live booking exists. (spec.md)
- Prices: the `–` placeholder only (PoC rule I1). Opening hours: "(bekräftas snart)" — "ej hitte-på". (spec.md)
- "Försök inte koppla riktig bokning/e-post. Allt som är demo är märkt demo" — a contact form may exist only while visibly saying no backend is connected. (spec.md)
- Every theme keeps the same sections, Swedish copy, contact data and honesty rules; only design differs. (spec.md)
- Hard floor (spec.md Byggregler): readable without JS and offline, no horizontal overflow at 375 px, zero console errors.

## Brand Commitments

Owner-ratified 2026-11-08, never breakable — even in marketing copy: never invent reviews, prices, or a booking system that does not exist. Placeholders stay visibly placeholders until the real thing exists. Voice: Swedish, warm first person ("Jag klipper, färgar och vårdar hår i Malmö"). (spec.md)

## Evidence on Hand

Owner-ratified 2026-11-08: Instagram is the only real proof the salon can show (spec.md names instagram.com/jane.cooper). Everything else — reviews, before/after photos, a live booking link, prices, opening hours — stays marked "to be confirmed" until the owner supplies it. The fleet's placeholder gradients (`prototypes/_assets/`) are labelled placeholders, never salon proof (the original portrait was removed per owner ruling R2, MC 10088). Quality-gate record of the ratified-name theme: `prototypes/27-salongens-rytm/QUALITY.md` (PASS 2026-11-07; AA contrast failures 0/134 at 1440 px and 375 px).

## Product Principles

1. Bookable in one scroll: the booking path is the interface (owner-ratified 2026-11-08).
2. Honesty is the brand: no invented proof, placeholders stay visible (owner-ratified 2026-11-08).
3. Calm rhythm, not pressure: honest pricing, no pushy booking tactics (owner-ratified 2026-11-08).
4. One content, many designs: only design changes between themes; spec.md copy and honesty rules carry verbatim.
5. Facts come from spec.md or the owner; anything not supplied stays "to be confirmed".

## Accessibility & Inclusion

Owner-ratified 2026-11-08: WCAG AA, as already written in `projects/salong/spec.md` ("A11y-golv") — the delivered prototype meets it today, so this is a floor to hold, not a new promise.
