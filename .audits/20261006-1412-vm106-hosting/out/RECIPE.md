# R2 replacement table — identity + image placeholders (owner ruling, BRIEF R2)

Scope: `projects/anny/**` ONLY. portfolio untouched. Apply longest-match first (rule A below).
Every change MUST be recorded here (§log) as a row, or it is not allowed in the commit.

## A. Text substitution (ordered — longest/most specific pattern first)

| # | pattern (case variants: keep sentence case of the theme) | replacement | notes |
|---|---|---|---|
| 1 | `instagram.com/mullers.anny` | `instagram.com/dinsalong` | href + visible |
| 2 | `Anny.mullerskarlskrona@gmail.com` | `hej@dinsalong.se` | mailto + visible |
| 3 | `072-155 48 60` | `07X-XXX XX XX` | tel: href gets `07XXXXXXXXX` |
| 4 | `Landbrogatan 11` (and `Landbrogatan`) | `Din gatuadress 1` | address line |
| 5 | `@mullers.anny` | `@dinsalong` | display handle |
| 6 | `Müllers HAIR STUDIO` | `DIN SALONG` | uppercase lockups |
| 7 | `Müllers` / `Mullers` / `mullers` | `Din Salong` / `DIN SALONG` / `dinsalong` | match the theme's case |
| 8 | `Anny Morin` | `Din Salong` | brand/name usage |
| 9 | `Anny` (standalone) | `Din Salong` | reflow sentence so it still reads |
| 10 | `Karlskrona` (and `i Karlskrona`) | `Din Stad` | incl. marquee/title/meta/aria |
| 11 | `Trossö` | `Din Stad` | |
| 12 | `sibbamala.com/anny/…` | `dinsalong.se` | PoC-snapshot source notes |

## B. Image placeholders (SAME filename, SAME pixel size, SAME format, real bytes)

Generated abstract art per theme palette — no white holes, no text in the art, no recognizable
objects, no faces. Generate with PIL or ImageMagick via a script committed under `tools/`.

| file (in `projects/anny/prototypes/_assets/`) | keep size | 00-poc copy |
|---|---|---|
| gal-01.jpeg … gal-04.jpeg | 1536×2048 each | `00-poc-live-site/images/gal-0N.jpeg` — SAME size, regenerate or copy |
| anny-portrait.jpg | 1656×2208 | (no poc copy) |

`anny-portrait.ATTRIBUTION.md`: not in the served subset, but it still names the source. Replace its
body with a placeholder-art provenance note. Real photos must not remain in the served tree.

## C. Log (append one row per file you change: file | rule #s | count)
| file | rules | count |
|---|---|---|

| _ | **DISCOVERY (DA gate F1, P1)** | real photos existed in THEME-LOCAL copies beyond the brief's 9-file list: `23-lab-anny-real/assets/gallery/gal-01..04.jpeg` were md5-identical to the real _assets photos, and `23-lab plates/om-portrait.png`, `23-lab plates/mirror-reflection.png` (photo inset), `24-lab plates/portrait.png`, `26-lab plates/om-plate.png` were full identifiable face selfies. All 8 replaced with seeded neutral-wash art at their exact sizes/formats. Every raster under projects/anny/** was enumerated (22 files) and classified. |
| `_assets/gal-001.jpeg` | B | replaced (1536x2048 JPEG, seeded wash) |
| `_assets/gal-002.jpeg` | B | replaced (1536x2048 JPEG, seeded wash) |
| `_assets/gal-003.jpeg` | B | replaced (1536x2048 JPEG, seeded wash) |
| `_assets/gal-004.jpeg` | B | replaced (1536x2048 JPEG, seeded wash) |
| `_assets/anny-portrait.jpg` | B | replaced (1656x2208 JPEG) |
| `00-poc-live-site/images/gal-001.jpeg` | B | replaced (1536x2048 JPEG, same wash as _assets twin) |
| `00-poc-live-site/images/gal-002.jpeg` | B | replaced (1536x2048 JPEG, same wash as _assets twin) |
| `00-poc-live-site/images/gal-003.jpeg` | B | replaced (1536x2048 JPEG, same wash as _assets twin) |
| `00-poc-live-site/images/gal-004.jpeg` | B | replaced (1536x2048 JPEG, same wash as _assets twin) |
| `23-lab-anny-real/assets/gallery/gal-001.jpeg` | B/F1 | replaced (md5-identical real-photo copy) |
| `23-lab-anny-real/assets/gallery/gal-002.jpeg` | B/F1 | replaced (md5-identical real-photo copy) |
| `23-lab-anny-real/assets/gallery/gal-003.jpeg` | B/F1 | replaced (md5-identical real-photo copy) |
| `23-lab-anny-real/assets/gallery/gal-004.jpeg` | B/F1 | replaced (md5-identical real-photo copy) |
| `23-lab plates/om-portrait.png` + `mirror-reflection.png` + `24-lab plates/portrait.png` + `26-lab plates/om-plate.png` | B/F1 | replaced (face selfies -> opaque neutral-wash PNG, exact sizes) |
| KEPT `23-lab plates/plaster-ground.png` | B/F1 | stays: plaster-wall texture background, no subject/face (visual inspect) |
| KEPT `24-lab plates/chart-ground.png` | B/F1 | stays: vector-style nautical chart graphic |
| KEPT `26-lab plates/chart-field.png` | B/F1 | stays: generated chart map graphic |
| KEPT `26-lab plates/compass-rose.png` | B/F1 | stays: line-art compass rose |
| KEPT `26-lab plates/route.png` | B/F1 | stays: line-art route diagram |
| `_assets/anny-portrait.ATTRIBUTION.md` | B | body replaced with 3-line generated-art provenance note |
| `tools/gen-placeholders.py` | B | new: seeded generator (SEED 20261006), stdlib+PIL only |
| **note** | 3,4,7,8,9,10 | beyond-table mechanics: tel: hrefs -> `07XXXXXXXXX` (task ruling); postal `371 35` -> `000 00` (R2.3 address trace); identifier `ring-anny` -> `ring-dinsalong` (css/js only, no copy); `rule 12` read as host+path-prefix swap: `sibbamala.com/anny/<tail>` -> `dinsalong.se/<tail>` (keeps og:image a plausible URL); reflows (grammar only): Trossö/Karlskrona dedup `på Din Stad i Din Stad`->`i Din Stad` + `, mitt i Din Stad`, og:title `(Trossö)` merge, brand-dot `Müllers. på/i` -> `Din Salong på/i`, `Müllers.,` -> `Din Salong,`, split hero spans Anny/Morin -> Din/Salong (themes 01,02,04,10,18,25 + 09/13 br-splits), `så bokar hon` -> `så bokar vi`. Filename-only `anny` refs kept per R2.5 (anny-portrait.jpg, /anny/ path, 01-mullers-editorial/ dir link) — renames are an owner decision. |
| `prototypes/00-poc-live-site/index.html` |  1,2,3,4,5,7,8,9,10,11,12  |96 |
| `prototypes/00-poc-live-site/js/contact-form.js` |  5,9  |2 |
| `prototypes/00-poc-live-site/js/gallery-manifest.js` |  9  |1 |
| `prototypes/00-poc-live-site/js/gallery.js` |  9  |2 |
| `prototypes/00-poc-live-site/js/scroll-reveal.js` |  8,10  |2 |
| `prototypes/01-mullers-editorial/css/tokens.css` |  7  |1 |
| `prototypes/01-mullers-editorial/index.html` |  1,2,3,4,5,7,8,9,10,12  |64 |
| `prototypes/01-mullers-editorial/js/contact-form.js` |  2,3,9  |4 |
| `prototypes/01-mullers-editorial/js/scroll-motion.js` |  7  |1 |
| `prototypes/02-mork-neon/index.html` |  1,2,3,4,5,7,8,9,10  |52 |
| `prototypes/02-mork-neon/js/contact-form.js` |  3,5  |2 |
| `prototypes/03-varmt-papper/index.html` |  1,2,3,4,5,7,8,9,10  |59 |
| `prototypes/03-varmt-papper/js/booking.js` |  3,5  |2 |
| `prototypes/04-brutalt-tryck/index.html` |  1,2,3,4,5,7,8,10  |48 |
| `prototypes/04-brutalt-tryck/js/contact-demo.js` |  3,5  |2 |
| `prototypes/05-mjuk-glas/index.html` |  1,2,3,4,5,7,8,9,10  |51 |
| `prototypes/05-mjuk-glas/js/contact.js` |  3,5  |2 |
| `prototypes/06-cinematiskt/index.html` |  1,2,3,4,5,7,8,9,10  |48 |
| `prototypes/06-cinematiskt/js/contact-form.js` |  2,3  |2 |
| `prototypes/07-retrofilm/index.html` |  1,2,3,4,5,7,8,9,10  |44 |
| `prototypes/07-retrofilm/js/contact-form.js` |  3,5  |4 |
| `prototypes/08-organiskt-hantverk/index.html` |  1,2,3,4,5,7,8,9,10  |54 |
| `prototypes/08-organiskt-hantverk/js/booking-demo.js` |  2,3  |2 |
| `prototypes/09-schweizertag/css/layout.css` |  9  |1 |
| `prototypes/09-schweizertag/index.html` |  1,2,3,4,5,7,8,9,10  |46 |
| `prototypes/09-schweizertag/js/main.js` |  3,5  |2 |
| `prototypes/10-magasincollage/index.html` |  1,2,3,4,5,7,8,10  |55 |
| `prototypes/10-magasincollage/js/contact-form.js` |  3,5  |2 |
| `prototypes/11-blaa-fargbrunn/css/style.css` |  8,9  |2 |
| `prototypes/11-blaa-fargbrunn/index.html` |  1,2,3,4,5,7,8,10  |42 |
| `prototypes/11-blaa-fargbrunn/js/main.js` |  3,5  |2 |
| `prototypes/12-forgyllda-salongen/index.html` |  1,2,3,4,5,7,8,9,10  |48 |
| `prototypes/13-91-tal/css/style.css` |  8,9  |2 |
| `prototypes/13-91-tal/index.html` |  1,2,3,4,5,7,8,9,10  |40 |
| `prototypes/14-dagens-frisyr/css/newspaper.css` |  9  |1 |
| `prototypes/14-dagens-frisyr/index.html` |  1,2,3,4,5,7,8,10,12  |47 |
| `prototypes/14-dagens-frisyr/js/contact-form.js` |  2,3  |2 |
| `prototypes/15-sagan-om-klippet/index.html` |  1,2,3,4,5,7,8,10  |31 |
| `prototypes/15-sagan-om-klippet/js/main.js` |  3,5,9  |5 |
| `prototypes/16-gradientljus/css/base.css` |  9  |1 |
| `prototypes/16-gradientljus/index.html` |  1,2,3,4,5,7,8,10  |49 |
| `prototypes/17-mork-akademien/index.html` |  1,2,3,4,5,7,8,10  |40 |
| `prototypes/17-mork-akademien/js/main.js` |  3,5  |2 |
| `prototypes/18-bara-typsnitt/index.html` |  1,2,3,4,5,7,8,10,12  |47 |
| `prototypes/18-bara-typsnitt/js/contact-form.js` |  2,3  |2 |
| `prototypes/18-bara-typsnitt/js/scroll-motion.js` |  8,10  |2 |
| `prototypes/19-galerievaggen/css/galleri.css` |  9  |1 |
| `prototypes/19-galerievaggen/index.html` |  1,2,3,4,5,7,8,9,10  |55 |
| `prototypes/20-mynta/index.html` |  1,2,3,4,5,6,7,8,10,11  |54 |
| `prototypes/20-mynta/js/main.js` |  3,5  |2 |
| `prototypes/21-lab-anny-a/css/style.css` |  8  |1 |
| `prototypes/21-lab-anny-a/index.html` |  1,2,3,4,5,7,8,9,10  |59 |
| `prototypes/21-lab-anny-a/js/main.js` |  8  |1 |
| `prototypes/22-lab-anny-b/css/styles.css` |  7,8,10  |3 |
| `prototypes/22-lab-anny-b/index.html` |  1,2,3,4,5,7,8,9,10  |59 |
| `prototypes/22-lab-anny-b/js/main.js` |  2,3,7,8  |4 |
| `prototypes/23-lab-anny-real/css/styles.css` |  8  |1 |
| `prototypes/23-lab-anny-real/index.html` |  1,2,3,4,5,7,8,9,10  |58 |
| `prototypes/23-lab-anny-real/js/main.js` |  8  |1 |
| `prototypes/23-lab-anny-real/js/motion.js` |  8  |1 |
| `prototypes/24-lab-anny-flag/css/chart.css` |  8  |1 |
| `prototypes/24-lab-anny-flag/index.html` |  1,2,3,4,5,7,8,10  |62 |
| `prototypes/24-lab-anny-flag/js/main.js` |  3,5,8  |3 |
| `prototypes/25-lab-anny-live/css/style.css` |  8  |1 |
| `prototypes/25-lab-anny-live/index.html` |  1,2,3,4,5,7,8,9,10  |59 |
| `prototypes/25-lab-anny-live/js/main.js` |  8  |1 |
| `prototypes/26-lab-anny-low/css/style.css` |  7,8  |16 |
| `prototypes/26-lab-anny-low/index.html` |  1,2,3,4,5,7,8,9,10  |48 |
| `prototypes/26-lab-anny-low/js/motion.js` |  7,8  |2 |
| `prototypes/26-lab-anny-low/js/page.js` |  8  |1 |
| `prototypes/index.html` |  7,8,9,10  |6 |

## R4 amendment (owner ruling 2026-10-06, supersedes §A in projects/anny)
| pattern | replacement |
|---|---|
| Anny Morin | Jane Cooper |
| Anny | Jane |
| Morin | Cooper |
| 072-155 48 60 | +46 70 123 45 67 (tel: href tel:46701234567) |
| mullers.anny / @mullers.anny | jane.cooper / @jane.cooper |
| (gmail) | jane.cooper@example.com |
| Landbrogatan 11 | Drottninggatan 2 |
| Karlskrona / Trossö | Malmö |
| Müllers (any case, incl. "Müllers." dot-lockups) | Jane Cooper (match case/lockup) |
Split-hero "Din"/"Salong" pairs -> "Jane"/"Cooper". Files under .audits (this RECIPE, BRIEF, verdicts)
keep their historical "Anny" text — R4 scope is projects/anny/** + tools/gen-placeholders.py targets
comment only; the repo-root README/docs get R4 text in the same commit. §C log continues below.

## PERSONA-01 (R4) + RENAME-01 (R3.3) — §C log, MC 10088.4 (frontend, 2026-10-06)

### Commit 1 — PERSONA-01 (persona strings, all placeholders -> Jane Cooper/Malmö per R4 table)
Replacements per R4 amendment table + markup-pair handling. count = occurrences replaced (rules counted per sweep engine .tmp/p4/sweep-persona.py, dry-replayed).
| file | rules | count |
|---|---|---|
| `README.md` | 1 rules | 1 |
| `docs/ARCHITECTURE.md` | 4 rules | 4 |
| `projects/anny/prototypes/00-poc-live-site/SOURCE.md` | 2 rules | 2 |
| `projects/anny/prototypes/00-poc-live-site/index.html` | 10 rules | 80 |
| `projects/anny/prototypes/00-poc-live-site/js/contact-form.js` | 2 rules | 2 |
| `projects/anny/prototypes/00-poc-live-site/js/gallery-manifest.js` | 1 rules | 1 |
| `projects/anny/prototypes/00-poc-live-site/js/gallery.js` | 1 rules | 2 |
| `projects/anny/prototypes/00-poc-live-site/js/scroll-reveal.js` | 2 rules | 2 |
| `projects/anny/prototypes/01-mullers-editorial/css/tokens.css` | 1 rules | 1 |
| `projects/anny/prototypes/01-mullers-editorial/index.html` | 12 rules | 63 |
| `projects/anny/prototypes/01-mullers-editorial/js/contact-form.js` | 3 rules | 4 |
| `projects/anny/prototypes/01-mullers-editorial/js/scroll-motion.js` | 1 rules | 1 |
| `projects/anny/prototypes/02-mork-neon/index.html` | 10 rules | 51 |
| `projects/anny/prototypes/02-mork-neon/js/contact-form.js` | 2 rules | 2 |
| `projects/anny/prototypes/03-varmt-papper/index.html` | 9 rules | 58 |
| `projects/anny/prototypes/03-varmt-papper/js/booking.js` | 2 rules | 2 |
| `projects/anny/prototypes/04-brutalt-tryck/index.html` | 13 rules | 49 |
| `projects/anny/prototypes/04-brutalt-tryck/js/contact-demo.js` | 2 rules | 2 |
| `projects/anny/prototypes/05-mjuk-glas/index.html` | 9 rules | 50 |
| `projects/anny/prototypes/05-mjuk-glas/js/contact.js` | 2 rules | 2 |
| `projects/anny/prototypes/06-cinematiskt/index.html` | 10 rules | 47 |
| `projects/anny/prototypes/06-cinematiskt/js/contact-form.js` | 2 rules | 2 |
| `projects/anny/prototypes/07-retrofilm/index.html` | 9 rules | 43 |
| `projects/anny/prototypes/07-retrofilm/js/contact-form.js` | 2 rules | 4 |
| `projects/anny/prototypes/08-organiskt-hantverk/index.html` | 8 rules | 52 |
| `projects/anny/prototypes/08-organiskt-hantverk/js/booking-demo.js` | 2 rules | 2 |
| `projects/anny/prototypes/09-schweizertag/css/layout.css` | 1 rules | 1 |
| `projects/anny/prototypes/09-schweizertag/index.html` | 11 rules | 45 |
| `projects/anny/prototypes/09-schweizertag/js/main.js` | 2 rules | 2 |
| `projects/anny/prototypes/10-magasincollage/index.html` | 11 rules | 54 |
| `projects/anny/prototypes/10-magasincollage/js/contact-form.js` | 2 rules | 2 |
| `projects/anny/prototypes/11-blaa-fargbrunn/css/style.css` | 1 rules | 2 |
| `projects/anny/prototypes/11-blaa-fargbrunn/index.html` | 9 rules | 41 |
| `projects/anny/prototypes/11-blaa-fargbrunn/js/main.js` | 2 rules | 2 |
| `projects/anny/prototypes/12-forgyllda-salongen/index.html` | 10 rules | 47 |
| `projects/anny/prototypes/13-91-tal/css/style.css` | 1 rules | 2 |
| `projects/anny/prototypes/13-91-tal/index.html` | 9 rules | 38 |
| `projects/anny/prototypes/14-dagens-frisyr/css/newspaper.css` | 1 rules | 1 |
| `projects/anny/prototypes/14-dagens-frisyr/index.html` | 9 rules | 46 |
| `projects/anny/prototypes/14-dagens-frisyr/js/contact-form.js` | 2 rules | 2 |
| `projects/anny/prototypes/15-sagan-om-klippet/index.html` | 9 rules | 30 |
| `projects/anny/prototypes/15-sagan-om-klippet/js/main.js` | 3 rules | 4 |
| `projects/anny/prototypes/16-gradientljus/css/base.css` | 1 rules | 1 |
| `projects/anny/prototypes/16-gradientljus/index.html` | 9 rules | 48 |
| `projects/anny/prototypes/17-mork-akademien/index.html` | 10 rules | 39 |
| `projects/anny/prototypes/17-mork-akademien/js/main.js` | 2 rules | 2 |
| `projects/anny/prototypes/18-bara-typsnitt/index.html` | 9 rules | 44 |
| `projects/anny/prototypes/18-bara-typsnitt/js/contact-form.js` | 2 rules | 2 |
| `projects/anny/prototypes/18-bara-typsnitt/js/scroll-motion.js` | 1 rules | 1 |
| `projects/anny/prototypes/19-galerievaggen/css/galleri.css` | 1 rules | 1 |
| `projects/anny/prototypes/19-galerievaggen/index.html` | 9 rules | 54 |
| `projects/anny/prototypes/20-mynta/index.html` | 11 rules | 53 |
| `projects/anny/prototypes/20-mynta/js/main.js` | 2 rules | 2 |
| `projects/anny/prototypes/21-lab-anny-a/SOURCE.md` | 1 rules | 1 |
| `projects/anny/prototypes/21-lab-anny-a/css/style.css` | 1 rules | 1 |
| `projects/anny/prototypes/21-lab-anny-a/index.html` | 11 rules | 58 |
| `projects/anny/prototypes/21-lab-anny-a/js/main.js` | 1 rules | 1 |
| `projects/anny/prototypes/22-lab-anny-b/SOURCE.md` | 1 rules | 1 |
| `projects/anny/prototypes/22-lab-anny-b/css/styles.css` | 2 rules | 3 |
| `projects/anny/prototypes/22-lab-anny-b/index.html` | 12 rules | 58 |
| `projects/anny/prototypes/22-lab-anny-b/js/main.js` | 3 rules | 4 |
| `projects/anny/prototypes/23-lab-anny-real/SOURCE.md` | 1 rules | 1 |
| `projects/anny/prototypes/23-lab-anny-real/css/styles.css` | 1 rules | 1 |
| `projects/anny/prototypes/23-lab-anny-real/index.html` | 9 rules | 56 |
| `projects/anny/prototypes/23-lab-anny-real/js/main.js` | 1 rules | 1 |
| `projects/anny/prototypes/23-lab-anny-real/js/motion.js` | 1 rules | 1 |
| `projects/anny/prototypes/24-lab-anny-flag/SOURCE.md` | 1 rules | 1 |
| `projects/anny/prototypes/24-lab-anny-flag/css/chart.css` | 1 rules | 1 |
| `projects/anny/prototypes/24-lab-anny-flag/index.html` | 10 rules | 60 |
| `projects/anny/prototypes/24-lab-anny-flag/js/main.js` | 3 rules | 3 |
| `projects/anny/prototypes/25-lab-anny-live/SOURCE.md` | 1 rules | 1 |
| `projects/anny/prototypes/25-lab-anny-live/css/style.css` | 1 rules | 1 |
| `projects/anny/prototypes/25-lab-anny-live/index.html` | 13 rules | 59 |
| `projects/anny/prototypes/25-lab-anny-live/js/main.js` | 1 rules | 1 |
| `projects/anny/prototypes/26-lab-anny-low/SOURCE.md` | 1 rules | 1 |
| `projects/anny/prototypes/26-lab-anny-low/css/style.css` | 2 rules | 16 |
| `projects/anny/prototypes/26-lab-anny-low/index.html` | 9 rules | 47 |
| `projects/anny/prototypes/26-lab-anny-low/js/motion.js` | 2 rules | 2 |
| `projects/anny/prototypes/26-lab-anny-low/js/page.js` | 1 rules | 1 |
| `projects/anny/prototypes/index.html` | 2 rules | 6 |
| `projects/anny/spec.md` | 12 rules | 25 |
| **beyond-table mechanics** | — | reflows: split hero span pairs Din/Salon -> Jane/Cooper handled via explicit markup anchors in themes 01 (--w:0/--w:1 spans), 02 (sweep__text), 04 (hw + w spans), 07 + 22 (Din <em>Salong</em>), 09 (Din<br>Salong), 10 (hero-word spans), 25 (namn-fornamn/efternamn); uppercase+nbsp lockup DIN&nbsp;SALONG -> JANE&nbsp;COOPER (theme 09); nbsp phone variants 07X-XXX&nbsp;XX&nbsp;XX / 07X&#8209;XXX&nbsp;XXX&nbsp;XX / 07X-XXX XX&nbsp;XX -> +46 70 123 45 67 (nbsp-punctuated); Din gatuadress&nbsp;1 -> Drottninggatan&nbsp;2; identifier ring-dinsalong -> ring-jane (26-lab css/html, no copy); tel:07XXXXXXXXX -> tel:46701234567; og:url/canonical/JSON-LD + PoC comment domain dinsalong.se -> janecooper.se; md pass: Müllers., -> Jane Cooper, / Müllers. — -> Jane Cooper — (dot-lockups, same treatment as themes in R2), 371 35 Karlskrona -> 000 00 Malmö (spec.md, matches theme 000 00 placeholder), tel:+46721554860 -> tel:46701234567 (spec.md), Anny.mullerskarlskrona@gmail.com -> jane.cooper@example.com, standalone Anny -> Jane (grammatical: "Jag heter Jane Cooper…", "(Jane själv…)"). Kept: Swedish generic field label "Salong" + compounds (Salongsarbete, Salongstidningen, salongen) — not persona tokens; postal placeholder 000 00 (no R4 entry, not PI); "så bokar vi" wording untouched. README/ARCHITECTURE edits are persona-string-only (diff = 1 line + 3 lines). |

### Commit 2 — RENAME-01 (brand paths, owner-approved R3.3)
git mv renames below + cross-reference update (.tmp/p4/sweep-paths.py). count = path references updated per file.
| file | rules | count |
|---|---|---|
| `README.md` | 2 rules | 2 |
| `docs/ARCHITECTURE.md` | 2 rules | 13 |
| `projects/salong/prototypes/00-poc-live-site/SOURCE.md` | 3 rules | 3 |
| `projects/salong/prototypes/00-poc-live-site/index.html` | 1 rules | 1 |
| `projects/salong/prototypes/01-mork-guld/index.html` | 1 rules | 1 |
| `projects/salong/prototypes/02-mork-neon/index.html` | 1 rules | 1 |
| `projects/salong/prototypes/03-varmt-papper/index.html` | 1 rules | 1 |
| `projects/salong/prototypes/04-brutalt-tryck/index.html` | 1 rules | 1 |
| `projects/salong/prototypes/05-mjuk-glas/index.html` | 1 rules | 1 |
| `projects/salong/prototypes/06-cinematiskt/index.html` | 1 rules | 1 |
| `projects/salong/prototypes/07-retrofilm/index.html` | 1 rules | 1 |
| `projects/salong/prototypes/08-organiskt-hantverk/index.html` | 1 rules | 1 |
| `projects/salong/prototypes/09-schweizertag/index.html` | 1 rules | 1 |
| `projects/salong/prototypes/10-magasincollage/index.html` | 1 rules | 1 |
| `projects/salong/prototypes/11-blaa-fargbrunn/index.html` | 1 rules | 1 |
| `projects/salong/prototypes/12-forgyllda-salongen/index.html` | 1 rules | 1 |
| `projects/salong/prototypes/13-91-tal/index.html` | 1 rules | 1 |
| `projects/salong/prototypes/14-dagens-frisyr/index.html` | 1 rules | 1 |
| `projects/salong/prototypes/16-gradientljus/index.html` | 1 rules | 1 |
| `projects/salong/prototypes/17-mork-akademien/index.html` | 1 rules | 1 |
| `projects/salong/prototypes/19-galerievaggen/index.html` | 1 rules | 1 |
| `projects/salong/prototypes/20-mynta/index.html` | 1 rules | 1 |
| `projects/salong/prototypes/21-lab-demo-a/SOURCE.md` | 2 rules | 3 |
| `projects/salong/prototypes/21-lab-demo-a/index.html` | 1 rules | 1 |
| `projects/salong/prototypes/22-lab-demo-b/SOURCE.md` | 2 rules | 3 |
| `projects/salong/prototypes/22-lab-demo-b/index.html` | 1 rules | 1 |
| `projects/salong/prototypes/23-lab-demo-real/SOURCE.md` | 2 rules | 3 |
| `projects/salong/prototypes/24-lab-demo-flag/SOURCE.md` | 2 rules | 4 |
| `projects/salong/prototypes/25-lab-demo-live/SOURCE.md` | 2 rules | 3 |
| `projects/salong/prototypes/25-lab-demo-live/index.html` | 1 rules | 1 |
| `projects/salong/prototypes/26-lab-demo-low/SOURCE.md` | 2 rules | 3 |
| `projects/salong/prototypes/26-lab-demo-low/index.html` | 1 rules | 1 |
| `projects/salong/prototypes/_assets/jane-portrait.ATTRIBUTION.md` | 1 rules | 1 |
| `projects/salong/prototypes/index.html` | 1 rules | 1 |
| `projects/salong/spec.md` | 4 rules | 5 |
| `tools/gen-placeholders.py` | 3 rules | 7 |

### filename/path renames (git mv, this commit-set)
- projects/anny -> projects/salong (247 files moved)
- prototypes/01-mullers-editorial -> 01-mork-guld
- prototypes/21..26-lab-anny-{a,b,real,flag,live,low} -> 21..26-lab-demo-{same suffixes}
- prototypes/_assets/anny-portrait.jpg -> jane-portrait.jpg; anny-portrait.ATTRIBUTION.md -> jane-portrait.ATTRIBUTION.md (every reference updated: 18 theme img srcs, gallery/spec/SOURCE notes, tools/gen-placeholders.py TARGETS; _site symlink farm regenerated, no image manifest files existed)
- cross-refs updated: prototypes/index.html card href, 00-poc "publiceras under /anny/" -> /salong/, spec.md + SOURCE.md slugs (bryn1/anny -> bryn1/salong, design-lab/anny-* -> design-lab/demo-*, sibbamala.com/anny/ -> janecooper.se per R2.12+R4, external original path "/home/claudecode/Annie hemsida" -> descriptive text), README slug, docs/ARCHITECTURE.md paths, tools/gen-placeholders.py
- KEPT brand-token filenames inside the repo: NONE. Disclosed name-bearing tokens kept OUTSIDE this repo (untouched, out of scope): GitHub repo bryn1/anny (still exists), design-lab dirs /home/claudecode/design-lab/anny-*/, owner dir /home/claudecode/Annie hemsida, live app https://sibbamala.com/anny/ (left live on purpose per R3.2), real photos in git history (accepted per R3.1). Instagram post id p/DbGN8NoIgX3 kept in spec provenance line (a hash, not a name token; already reachable via history per R3.1).
- Regenerated gitignored _site/ via tools/build-index.py (scans projects/ dynamically — pointed at salong automatically); stale _site/thumbs/anny pruned. check-links.py: 51 pages, 0 broken, forbidden paths 404. curl :8090 root 200 + /salong/prototypes/01-mork-guld/ 200 with Jane Cooper x19, banned 0.

| `00-poc-live-site/js/gallery-manifest.js` + `gallery.js` | R4-sweep fallout (FIX-T5-P1) |3 | identifier `window.JANE COOPER_GALLERY_IMAGES` (space-in-identifier SyntaxError introduced when the persona sweep rewrote ANNY_GALLERY_IMAGES) -> `JANE_COOPER_GALLERY_IMAGES`; served 00-poc gallery was painting ZERO images over HTTP. node --check now 0 SyntaxErrors across all 86 .js (82 salong incl. vendored min.js + 4 portfolio); render-proof :8090 0 console/page errors, manifest=4, 4 gallery imgs naturalWidth>0 (.tmp/p4/fix/). **Mechanics rule: any future text sweep that rewrites .js must end with `node --check` on every touched .js before commit.** |

| `13-91-tal/index.html` | R4 markup-split miss (FIX-T5C2-P1) |1 | hero `<h1>DIN<br>SALONG</h1>` -> `JANE<br>COOPER` (markup shape + motion untouched); raw-substring sweep could not see across the <br> boundary — TEST-c2 v2 normalized scan found it. Render-proof :8090 h1="JANE COOPER", 0 console errors. |
| `18-bara-typsnitt/index.html` | R4 markup-split miss (FIX-T5C2-P1) |2 | visible data-scramble spans DIN/SALONG -> JANE/COOPER (mechanism attrs kept; sr-only already "Jane Cooper"). Post-scramble settle text "JANECOOPER", 0 console errors. |
| **MECHANICS (TEST-c2 P1)** | — | — | text sweeps must run BOTH passes: raw-substring AND tag/whitespace-normalized (entities decoded, HTML tags flattened to whitespace, ws collapsed) — markup-split tokens (DIN<br>SALONG, split spans) defeat raw passes. Instrument: .tmp/p4/fix2/hero-scan-v2.js (red-tested on planted DIN<br>SALONG; green TOTAL_HITS=0 across all 189 tracked projects/salong html/css/js/json files). Complements the node --check JS rule. |
