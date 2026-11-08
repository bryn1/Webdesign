# Product

<!-- impeccable:product-schema 1 -->

Content canon for every string shown on the page: `projects/salong/spec.md` — cited here by quoted string, never by line number, because that file is being corrected by live cards. Re-read 2026-11-08 after MC 10088.30: its portrait passage now reads "Porträtt: `../_assets/jane-portrait.jpg` är en PLATSHÅLLARE" and forbids any alt or caption claiming the image is a photo of Jane Cooper; the wording it replaced (a real photo, a spegelselfie, an Instagram permalink) is superseded by owner ruling R2 (MC 10088). This brief is internal (English by design; page copy stays Swedish). Lines marked "owner-ratified" carry the owner's ruling date.

## Platform

web — static pages, no build step: `index.html` + `css/` + `js/` per theme folder (spec.md: "Statiska filer, ingen build-step"). Fully readable without JS and offline.

## Users

A first-time visitor considering booking (derived from the owner-ratified purpose below and spec.md): their job on the page is to get a time booked within one scroll; secondarily to see prices and opening hours.

## Product Purpose

Owner-ratified 2026-11-08: a first-time visitor should be able to BOOK A TIME within one scroll (phone or an online booking button), and secondarily see prices and opening hours.

## Positioning

Owner-ratified 2026-11-08: what separates this salon from other salons in Malmö is calm, rhythm-based hair care — the name "Salongens rytm" (the salon's rhythm) IS the positioning: honest pricing, no pushy booking tactics. The phrase is the owner's ratified words (not a spec.md string); the theme built on it is `projects/salong/prototypes/27-salongens-rytm/`.

## Operating Context

The site is the PoC for Jane Cooper, a frisör in Malmö; the prototypes reuse the owner's current PoC-site text (spec.md preamble), Swedish copy, `lang="sv"`. Repo pointer, stated honestly: spec.md names the content's origin as the owner's repo `bryn1/salong`, and `projects/salong/prototypes/00-poc-live-site/SOURCE.md` repeats it; that repo does not resolve from this host with the fleet's credential (`gh api repos/bryn1/salong` → 404, while `bryn1/Webdesign` → 200 — the credential is a fine-grained PAT, so an out-of-scope private repo would also read 404), and this working tree lives in `bryn1/Webdesign`. Treat `bryn1/salong` as a historical pointer, not a fetchable location. Today (PoC stage): prices render `–` ("sätter ej pris"), opening hours render "(bekräftas snart)", the booking calendar is a mock labelled "demo". The contact block — the path the ratified purpose routes bookings through — is placeholder text too: `000 00 Malmö`, `jane.cooper@example.com`, `+46 70 123 45 67` are PoC text awaiting the owner (instrument: whole-file substring grep at ref `8b0daf9` over the 28 `projects/salong/prototypes/*/index.html` listed by `git ls-tree -r --name-only 8b0daf9`: `example.com` 28/28, `000 00 Malmö` 26/28, `+46 70 123 45 67` 24/28, `tel:46701234567` 28/28). `projects/salong/prototypes/_assets/` art is fleet PLACEHOLDER gradients (`tools/gen-placeholders.py`; provenance `projects/salong/prototypes/_assets/jane-portrait.ATTRIBUTION.md`). Production-stage items N1 (service→booking-time deep links) and N2 (prices in copy) are out of scope for the PoC — the grant is the PRECONDITIONS clause on those two rules (SMB-DELTA, from the SMB salon teardown card MC 10088.23, integrated into the fleet PLAYBOOK-v2 by MC 10088.24); both live in gitignored `.audits/` run records, so they are cited here by card, not by path, and N2 collides with the price ban quoted above.

## Capabilities and Constraints

- Booking reality at PoC stage: "Välj en tid — sedan bokar du via telefon eller Instagram"; the mock calendar leads to phone/Instagram, never a fake confirmation. No live booking exists. (spec.md)
- Prices: the `–` placeholder only — spec.md's own words, "Pris: `–` (placeholder — sätter ej pris…)"; the "PoC-regel I1" identifier it carries is never defined in any tracked file, so it is not repeated here as a rule label (git grep -n I1 finds uses only). Opening hours: "(bekräftas snart)" — "ej hitte-på". (spec.md)
- "Försök inte koppla riktig bokning/e-post. Allt som är demo är märkt demo" — a contact form may exist only while visibly saying no backend is connected. (spec.md)
- Every theme keeps the same sections, Swedish copy, contact data and honesty rules; only design differs. (spec.md)
- Hard floor (spec.md Byggregler): readable without JS and offline, no horizontal overflow at 375 px, zero console errors.

## Brand Commitments

Owner-ratified 2026-11-08, never breakable — even in marketing copy: never invent reviews, prices, or a booking system that does not exist. Placeholders stay visibly placeholders until the real thing exists. Voice: Swedish, warm first person ("Jag klipper, färgar och vårdar hår i Malmö"). (spec.md)

## Evidence on Hand

Owner-ratified 2026-11-08: Instagram is the only real proof the salon can show (spec.md names instagram.com/jane.cooper). Everything else — reviews, before/after photos, a live booking link, prices, opening hours — stays marked "to be confirmed" until the owner supplies it. RULE (not a status report): the fleet's placeholder gradients (`projects/salong/prototypes/_assets/`) are placeholders and must never carry salon proof value — no alt text, caption or footer may present them as a photograph of a person or as the salon's own work (the original portrait was removed per owner ruling R2, MC 10088).

STATUS SHAPE OF THIS SECTION (rule, MC 10088.28 cycle 3 — read it before quoting any number below). The RULE above is the only permanent claim in this section. Every other line here is a dated pointer, pinned to one commit ref and to the card that owns the work, because an unpinned census of this tree reads as false within the hour: MC 10088.31 (`7a76e00`, 19 theme files) and MC 10088.32 (`8b0daf9`, 17) each moved the tree while reviewers were judging the census this replaces. If the ref named below is no longer `HEAD`, its numbers are history — re-measure with the named instrument or read the card; never keep this prose fresh by hand.

LEDGER, MEASURED 2026-11-08 AT REF `8b0daf9`. Instrument: `git ls-tree -r --name-only 8b0daf9` feeding a DOM parse (`python3` + `html.parser`, so an `<img>` spread over several lines is seen — the one-line `<img[^>]*>` grep reports 0 hits on `06-cinematiskt` and is simply blind); visible text = comments, `script`, `style` and `noscript` removed. Population 28 `projects/salong/prototypes/*/index.html`, classed once here: 21 delivered themes (`01`–`20`, `27`), 1 live-site snapshot (`00-poc-live-site`), 6 impeccable lab fixtures (`21`–`26`, each self-declared "impeccable lab build" in its own `SOURCE.md`).

- **(a) Person-claim in a portrait `alt`: 0 of the 21 delivered themes, 0 of the snapshot, 7 images across all 6 fixtures** (the string "Jane Cooper, frisör på Jane Cooper i Malmö"). The delivered themes were stripped by MC 10088.31 (card 12270, commit `7a76e00`), whose own brief names `21`, `22`, `23`, `25`, `26` and `00-poc-live-site` as intentional exclusions ("leave them alone"); `24-lab-demo-flag` — which that card's own 25-file grep did count — was left unchanged too. The fixture alts are a lab-fixture question, not product copy, and card 12270 ruled them out of its scope.
- **(b) Person/work claims in gallery `alt` over `_assets/gal-01..04`: closed at this ref.** In the delivered themes, 80 gallery `<img>`: 72 written `alt=""`, 4 written as a bare `alt` token across a line break (all four in `06-cinematiskt`, already empty to an assistive technology — row (c) names the instrument and the card premise it contradicts), 4 non-empty, and those four are `27-salongens-rytm`'s honest "Före och efter — bildplats …" slot form. Claim-carrying gallery alts in the delivered themes went 65 → 0 between `8b0daf9^` and `8b0daf9` (MC 10088.32, card 12273, `verified`). The 25 non-empty gallery alts left tree-wide are all six fixtures'; the art now has tracked provenance sidecars at `projects/salong/prototypes/_assets/gal-0[1-4].ATTRIBUTION.md`.
- **(c) OPEN — what a sighted visitor is still shown, and it has an owner.** The same generated gradient still stands under a visible "Före"/"Efter" label: 52 gallery items in 13 delivered themes (`01`–`08`, `10`, `11`, `16`, `19`, `27`, four each; +5 such items in fixtures `22` and `23`). Item instrument: the nearest `figure`/`li`/`article` ancestor of a `gal-` image whose own rendered text carries the whole word `före|efter` — so a "Före & efter" section heading is never counted, and these two numbers reproduce card 12285's own "52 items / 13 themes" exactly. Owner: **MC 10088.33 (card 12285)**, filed 2026-11-08T17:00Z, status `queued`, waiting on the owner ratifying one gallery label. That card also carries a second leg — add `alt=""` to 4 gallery images in `06-cinematiskt` it reports as having no `alt` attribute — and this ledger CONTRADICTS that premise: `html.parser` returns `None` for a valueless attribute, while the page served at this ref to headless Chromium answers `hasAttribute('alt') = true` with `alt = ""` for all four, so that leg would rewrite a form, not close an accessibility hole. What is false in `06-cinematiskt` is this row's visible label. `19-galerievaggen`'s plaques now read "Före · sax och kam" (its person token went at `8b0daf9`); one plaque there still names the person beside a placeholder image ("Bild kommer · uppsättning · Jane Cooper."), and card 12285's brief does not name that plaque.
- **(d) Disclosure wording.** "platshållare" is visible in 1/28 files (only `27-salongens-rytm`); the tree's own honest label "Porträtt — bild kommer" appears in 22/28 files (in an `alt` or in visible text) — the 6 carrying neither are the fixtures again.

Quality-gate record of the ratified-name theme, tracked: `projects/salong/prototypes/27-salongens-rytm/BASELINE.md` — gate 1.2.1, run `20261107T214003Z`, re-run on the committed tree `GATE_EXIT=0`, contrast row 0/134 at both widths. Its `QUALITY.md` is gitignored repo-wide (`.gitignore:33 **/QUALITY.md`, `git ls-files | grep -c QUALITY.md` → 0), so this brief cites the ledger, not the run record.

## Product Principles

1. Bookable in one scroll: the booking path is the interface (owner-ratified 2026-11-08).
2. Honesty is the brand: no invented proof, placeholders stay visible (owner-ratified 2026-11-08).
3. Calm rhythm, not pressure: honest pricing, no pushy booking tactics (owner-ratified 2026-11-08).
4. One content, many designs: only design changes between themes; spec.md copy and honesty rules carry verbatim.
5. Facts come from spec.md or the owner; anything not supplied stays "to be confirmed".

## Accessibility & Inclusion

Owner-ratified 2026-11-08: WCAG AA, as already written in `projects/salong/spec.md` ("A11y-golv") — the delivered prototype meets it today, so this is a floor to hold, not a new promise. INFERRED, and marked as such: "the delivered prototype" is one theme, `projects/salong/prototypes/27-salongens-rytm/`, and the only AA-class measurement on disk for it is the fleet gate's contrast row (0/134 at 1440 px and 375 px) and its WCAG 1.4.11 focus-indicator row (≥3:1), both ledgered in that theme's tracked `BASELINE.md`; the gate prints its own limit — "This is a floor, not a design verdict" — and no full WCAG AA audit exists for any of the 28 themes, so compliance beyond those two rows is UNVERIFIED, not met. Both rows quoted above are one dated gate run — gate 1.2.1, run `20261107T214003Z`, `GATE_EXIT=0` on the committed tree — and the 28-theme population is the `git ls-tree` count at ref `8b0daf9`.
