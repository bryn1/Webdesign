# skola — prototypes

Innehållskanon för skola-prototyperna. Källa: `bryn1/skola`, `frontend/app/` (Next.js
app-router, träd-cachen `.tmp/skola-tree.txt`). All kopi nedan är de faktiska rout- och
vyname­n från trädet; nya fakta, siffror eller kontaktuppgifter får aldrig hittas på.
Appen är ett lärande-platform för skola (elever/lärare/admin) — Operate-läge.

## Ytor (en prototyp per kluster; klustermedlemmarna finns nu som egna .html-sidor per yta, länkade från ytans index — 01 har login-sidan `login.html` som egen fil, de övriga klustren 12/14/8 sidor; delat skal `_assets/skola-shell.css`. Byggt T5, MC 11630)

| Prototyp | Representerande vy | Övriga i klustret (in-page-states) |
|---|---|---|
| 01-skola-start | `/login` | `/registrera`, `/admin-login`, `/change-password` — samma formulärfamilj |
| 02-skola-elev | `/elev` (dashboard) | `/elev/lektion`, `/elev/plugga/…` (diagnostic, formulär, slutprov, retention, helhet, session), `/elev/ai`, `/elev/bedomning`, `/elev/framsteg`, `/elev/schema`, `/elev/meddelanden`, `/elev/repetera`, `/elev/tasks`, `/elev/tidigare`, `/elev/installningar` |
| 03-skola-larare | `/larare` (dashboard) | `/larare/klasser`, `/larare/klass/[id]` (+ `/dashboard`, `/heatmap`), `/larare/planera`, `/larare/lektion`, `/larare/omdomen`, `/larare/granska`, `/larare/review-queue`, `/larare/uppgift/ny`, `/larare/schema` (+ `/redigera`), `/larare/elev/[id]`, `/larare/presentation/[id]`, `/larare/ai`, `/larare/meddelanden`, `/larare/arkiv`, `/larare/installningar` |
| 04-skola-admin | `/admin` (översikt) | `/admin/users` (+ `/[id]`), `/admin/subjects` (+ `/[slug]`, `/[slug]/begrepp`), `/admin/audit`, `/admin/granska`, `/admin/chat`, `/admin/training`, `/admin/uploads`, `/admin/settings` |

`/om` och `/om/integritet` är statisk text — ingen prototyp.

## Kopi (fakta ur trädet)

- Tre rollnav: elev (`/elev/...`), lärare (`/larare/...`), admin (`/admin/...`); egen layout per
  roll; inkörningsport 8401 för API:et (docs/ARCHITECTURE.md i skola-repo, punkt 2 under
  "What's broken": skola-api lyssnar på **8401**).
- Elev-flödet: lärare planerar lektion → eleven öppnar lektion/plugga → AI-svar med källor →
  bedömning och framsteg. Lärare-granska = granska AI-genererade frågor/innehåll.
- Admin: användare, ämnen, audit-logg, granska, inställningar.
- Språk: svenska. Å/ä/ö ska vara korrekta: "Granska", "Plugga" (variant formga: "förmåga"),
  "Bedömning", "Framsteg", "Schema", "Meddelanden", "Inställningar", "Klasser", "Omfång"? —
  använd exakt: "omdomen", "repetera", "tidigare", "nutrition"—nej: hellre: "Begrepp".
  (Namnen ovan i tabellen är ordagrant från trädet.)

## Bildregler (comp-led, lokala bilder)

- Max 1 genererad bild per prototyp (vm100 3090, `generate_image`), dekorativ, text i bild:
  minimal. Personer genereras aldrig — portrait-fält lämnas tomma, markerade ramarna.
- Övriga tillgångar: återanvänd `projects/salong/prototypes/_assets/vendor/` GSAP-kopior.
