<!--
  Provenance: this file inlines the portfolio content canon in full,
  2026-10-09, per owner ruling (MC card 10442): "5. inline it." — the body
  below is the canon itself, no longer a pointer. The upstream copy remains
  at /home/claudecode/portfolio-designs/CONTENT.md.
-->

# portfolio — prototypes


Detta är den enda källan till innehåll för de 20 portföljtema som byggs för Alexander Lektove.
Alla teman visar samma svenska innehåll; bara utseendet skiljer. Lätt normalisering av formuleringar
för en statisk sida är tillåten — nya fakta, siffror eller kontaktuppgifter får aldrig hittas på.
(Denna fil är över 300 linjer med flit: den är avsiktligt ett komplett enhetligt innehållsarkiv för
20 temabyggare och ska inte delas — ett tema som läser halva arkivet tappar fakta.)

**Källa:** `bryn1/hosting`, `apps/portfolio/`, arbetskopia vid commit `0baefe09` (2026-10-04,
innehållspass MC 10083), publicerad på https://sibbamala.com/. Ingen källa har ändrats av detta dokument.

| Avsnitt | Källfil |
|---|---|
| Vem jag är / pitch | `services/banner_service.py`, `services/command_handler.py` (`_cmd_pitch`) |
| Bakgrund | `services/command_handler.py` (`_cmd_bakgrund`), `frontend/index.html` (rubrik/underrubrik) |
| Projekt | `projects/*.md` (9 kuraterade filer, `order:` 1–9) |
| Autonoma flottan | `services/command_handler.py` (`_cmd_fleet`, `_cmd_delegate`, `_cmd_test`, `_cmd_top`, `_cmd_live`, `_cmd_view_presentation`) |
| Case | `services/command_handler.py` (`_cmd_case`) |
| Kontakt | `services/command_handler.py` (`_cmd_kontakt`) |

Obs: temabyggaren tar inte med terminalkommandon som `pitch`/`case`/`kontakt` som kommandon —
men vänligheten "skriv X" i texten kan översättas till länkar/ankare till respektive sektion.

## Vem jag är / pitch

Öppningscitat (bannerskärmen):

> **AI används på den data som inte är så viktig.**
> **Den viktiga datan får inte lämna rummet.**

Rubrik: **Alexander Lektove** — underrubrik från startsidens overlay: *AI-arkitekt & systemsbyggare*.
Signaturen längst ner på bannern: *Alexander Lektove · Karlskrona*.

Signaturtext:

> Jag bygger agentflottor som kör på lokal hårdvara – och som går att lita på utan att någon
> läser varje rad de producerar.

Tre verifierade nyckeltal (samma siffror på fler skärmar — de får inte ändras):

- **100 %** — av flottans inferens körs lokalt ✓ verifierat
- **2 900+** — uppdrag spårade på två tavlor ✓ verifierat
- **~208 t/s** — uppmätt genomströmning, 8 spår/maskin ✓ verifierat

Under byggnad-notice (frivillig, finns på startsidan): *⚠ Under uppbyggnad — sidan byggs om
löpande av flottan. Siffrorna är verifierade mot systemets loggar; texten kan släpa efter.*

### Problemet

Verksamheter som inte får lägga sina data i molnet får inte mindre AI än andra — de får ingen
alls. Avståndet till dem som kan växer varje månad.

### Varför en lokal chatbot inte löser det

En chatbot kräver fortfarande att en människa formulerar frågan, läser hela svaret och tar ansvar
för det. I en granskad verksamhet är overifierad AI-utdata ingen tillgång — den är en risk som
någon måste skriva under på. Flaskhalsen är inte tillgången till modellen. Den är verifieringen.

### Vad jag bygger

Lagret som gör delegerat arbete försvarbart:

- varje uppdrag är ett spårat ärende — inget sker vid sidan av
- "klart" är maskinellt kontrollerbart, inte en bedömning
- grindar avgör på exitkoder — bygge, test, säkerhet
- revisionsspåret blir en biprodukt av hur arbetet flyter

### Bevis — mot systemets egna loggar

- **100 %** av flottans inferens körs på egen hårdvara
- **2 900+** uppdrag spårade på två tavlor, med bevis vid avslut
- **~208 tok/s** samlad genomströmning, 8 parallella spår per maskin

### Villkoret

Arbete kan köras obevakat när det är ett återkommande flöde med ett kontrollerbart "klart".
Grindarna är strukturen som gör systemet tillförlitligt.

### Två förbehåll

Systemet är inte molnfritt av princip. Molnmodeller kan användas i kombination, där de är som
bäst — med ett lokalt system finns möjligheten att välja.

Systemet är inte säkert bara för att det är lokalt. Nycklar, .env-filer och åtkomst behöver
fortfarande hanteras med disciplin.

### Redan gjort

Bokningssystem för hotell, en bibliotekshemsida med utlåning, en aktiescanner med en modell på
34 tekniska indikatorer (demon visar en ögonblicksbild av 35 tickers), en webapp för konvertering
av CAD-filer och en firmware för Raspberry Pi Pico W för temperaturövervakning — allt byggt på
lokal hårdvara av mitt agentteam i mina arbetsflöden.

### Nästa steg

Att finjustera själva agentflottan på sitt eget arbete. Pipelinen finns, den är inte i drift.

## Bakgrund

**Alexander Lektove** · lärare i fysik, teknik och matematik · Karlskrona

Lärare i högstadiet i fysik, teknik och matte med stort intresse för AI. Kör flertalet virtuella
maskiner i Proxmox på två noder, tre grafikkort och 2× DGX Spark — dubbla orkestrerare, lokalt och
i molnet, med två parallella agentflottor i definierade arbetsflöden för autonomt byggande av
mjukvara, spel och tjänster.

### I drift

Två hemsidor för mina elever och flertalet prototyper och proof of concepts — se avsnittet Projekt.

### Byggt själv

- **Inferensstack** — Proxmox-noder med GPU-passthrough, små till stora modeller
- **Router och kö** — FastAPI, nivåbaserad lastbalansering, Redis-backad arbetskö
- **RAG** — ChromaDB + inbäddningar för few-shot-bedömning
- **LoRA** — egna adaptrar för fysik och matematik, tränade och driftsatta
- **Mission Control** — kanbansystem för autonomt kodande och dokumentation av mjukvara, med
  orkestrering på lokal hårdvara

### Arbetssätt

Trial and error. Sätt höga mål och misslyckas ofta. Testa allt som går att testa — ingen idé är
för dum för att prova. Dra lärdom av allt: återanvänd det som är bra, förkasta det dåliga. En
dålig hypotes är bättre än ingen hypotes. Ingenting är omöjligt.

Svenskt medborgarskap · säkerhetsklass 3 i hemvärnet

Avslutande citat (ägarens egen mening, finns sist på bakgrundsskärmen):

> Målet var aldrig flottan eller systemet. Det var en biprodukt till en hemsida jag ville bygga —
> men biprodukten blev snabbt min huvudsyssla.

## Projekt

Nio kuraterade projekt i den ordning sajten visar dem. "Demo" = publicerad demo på sibbamala.com
eller egen subdomän; "Kod" = offentligt GitHub-repo.

### 1. bevis — ärendetavla där avslut kräver bevis

Ett ärende kan inte stängas utan ett kommando, dess exitkod och dess utdata — beviset lagras på
ärendet. Det räcker inte att påstå att arbetet är gjort. Koden är öppen under Apache-2.0 och
verktyget körs från kommandoraden. Ingen modell, ingen API-nyckel, ingen GPU.

Reglerna: kravet skrivs när ärendet skapas, innan någon har skäl att formulera ett krav som är
lätt att klara. En blockerande kontroll stoppar ärendet och allt efter det — underärenden och det
som väntar. En utdelare kan lämna arbetet till vilken agent eller vilket skript som helst och
sparar vad som kom tillbaka, men får inte avgöra att arbetet lyckades — det avgör ärendets egna
kontroller. Den som stänger ett ärende får inte vara den som verifierar det. Testerna kontrolleras
i sin tur: en rutin planterar en defekt i taget i koden och kräver att det test som vaktar den
regeln blir rött.

Verktyget håller ingen modell, ingen API-nyckel och ingen GPU, och det körs på en enda maskin.
Idén är inte ny — det här är en liten, fristående variant, inte en första.

- Kod: https://github.com/bryn1/bevis

### 2. skola.sibbamala.com — lärplattform

Lärplattform för högstadiet i fysik, teknik och matematik: lektioner, uppgifter och pluggning mot
Lgr22, med en AI-lärare som baserar sina svar på lärarens material. Av de 18 obligatoriska ämnena
är matematik, fysik och teknik öppna — resten publiceras efter hand.

- Demo: https://skola.sibbamala.com

### 3. np.sibbamala.com — öva inför nationella provet

Övning inför nationella prov: gratis övningsfrågor med facit och bedömningsanvisning till varje
fråga, över flera ämnen — bland dem NO (fysik, kemi, biologi), matematik och engelska. Ingen
inloggning, inget du skriver sparas.

- Demo: https://np.sibbamala.com

### 4. Rocket Stock Scanner

Aktiescanner som poängsätter aktier mot 34 tekniska indikatorer (31 röstar, 3 är enbart riskmått),
med backtesting och rapportgenerering. Den publicerade sidan är en statisk, skrivskyddad
ögonblicksbild av en körning: 35 tickers i tre regioner (Tyskland, Sverige, USA), cirka ett år av
dagliga kursstaplar per ticker — senaste kursdatum visas på sidan. Modellen i koden arbetar mot
ett universum på ~12 800 unika tickers.

Arkitektur i lager: datalager (hämtar marknadsdata), teknisk analys (34 indikatorer — momentum,
trend, volatilitet, volym), signalmotor (slår ihop signaler till en poäng), parallell scanner,
HTML-rapporter per körning. Stack: Python med pandas + numpy, multiprocessing, schemalagd körning.

- Kod: https://github.com/bryn1/Rocket
- Demo: https://sibbamala.com/rocket/

### 5. Sea View Hotel Booking

Webbaserat bokningssystem för hotellrum: alla rum och deras status, bokning över ett
datumintervall, redigering och avbokning. Demon körs på syntetiska data.

Stack: Python backend med FastAPI, vanilla JS för gränssnittet, SQLite för bokningarna.

- Kod: https://github.com/bryn1/Hotell
- Demo: https://sibbamala.com/hotell/

### 6. CAD-filkonvertering

Webapp som konverterar CAD-filer: läser STEP, IGES och BREP och skriver nio format — STEP, BREP,
SVG, IGES, STL, OBJ, 3MF, GLTF, PLY. Målet är en symmetrisk matris — alla format in, alla ut — och
den byggs fas för fas av agentflottan: moduler, säkring av konverteringsvägen, en full
korrekthetsmatris och rättning av de defekter matrisen hittar.

- Kod: https://github.com/bryn1/Cad
- Demo: https://sibbamala.com/cad/

### 7. Bibliotek

Bibliotekshemsida med katalog och utlåning. Demon körs på syntetiska data — böcker, låntagare och
lån är genererade.

- Kod: https://github.com/bryn1/Bibliotek
- Demo: https://sibbamala.com/bibliotek/

### 8. Sensor — firmware för Raspberry Pi Pico W

Firmware för temperaturövervakning med DS18B20-givare på Raspberry Pi Pico W. Byggd i flottans
arbetsflöde: forskning, arkitektur och fasplan först, sedan bygge mot test i emulator och till
sist på riktig hårdvara. Koden ligger i ett privat repo.

- publika länkar: inga (privat repo — tema bygger ingen länk här)

### 9. FutureCraft — voxelsandlåda

Voxelsandlåda i webbläsaren, byggd på Three.js — ingen installation.

- Kod: https://github.com/bryn1/futurecraft
- Demo: https://sibbamala.com/futurecraft/

## Autonoma flottan

Två orkestrerare, två flottor som kör parallellt. Ett jobb per säte, och varje uppdrag är spårat
på en tavla.

### Orkestrerare

- **lokalorkestrerare** — tar emot, väljer flöde, köar (kör aldrig själv)
- **molnorkestrerare** — frontier-modell i molnet — planerar, delegerar, granskar

### Flotta 1 — 15 namngivna personor

(Originalskärmen rubricerar "15 namngivna personor" men räknar 14 nedan — transkriberat ordagrant,
utan att hitta på en femtonde. Erfarit fynd för ägaren, inte ett temaproblem.)

- **ORKESTRERING:** sickan (planerare — bryter ner uppdraget i steg) · bernie (arkitekt — formar
  lösningen) · neo (devils advocate — försöker fälla planen innan bygget börjar)
- **BYGGE:** teddy (mjukvarukodare) · nicke (gränssnitt och frontend) · kjell (automation och
  IoT) · henrik (spelkod — C#/OpenTK och C++/OpenGL)
- **GRINDAR:** dobbie (bygg- och testgrind — utfall ur exitkoder, aldrig ur en åsikt) · sigrid
  (säkerhetsgrind — kritiskt eller högt stoppar integrationen) · knut (granskar arbetet mot
  artefakterna, inte mot rapporten)
- **STÖD:** artemis (research med källkrav) · gunilla (infrastruktur och drift) · mirre (teknisk
  skribent — dokumenterar från artefakter, inte från rapporter) · trickyrick (brainstorm)

### Flotta 2 — 8 rollsäten

coder (mjukvara) · frontend (gränssnitt) · automation (IoT och styrning) · infra (drift) · scout
(research — enda sätet med webbåtkomst) · planner (planering) · qa (bygg- och testgrind) ·
reviewer (säkerhetsgranskning — läser, ändrar aldrig)

### Så ruttas ett uppdrag

Fas 0: artemis research → bernie arkitektur → sickan fasplan. Fas 1: neo devils advocate —
försöker fälla planen innan bygget börjar. Fas 2: teddy bygger mot testet, dobbie bygg- och
testgrind, sigrid säkerhetsgrind, mirre dokumenterar. Fas 3…N: bygg + grind i par tills fasplanen
är levererad; knut granskar resultatet mot artefakterna, inte mot rapporten. Faller en grind går
kedjan tillbaka, inte vidare.

Arbetsflödet illustreras på sajten med ett verkligt uppdrag — bygget av CAD-filkonverteraren —
som flera kedjor samtidigt: fas 0–1 (plan, arkitektur, granskning), fas 2 med 24 steg (moduler),
fas 3 med 6 steg (säkra /convert och full korrekthetsmatris), fas 4 med 5 steg (IGES→STEP-defekten),
fas 5 pågående (symmetrisk 9-in × 9-ut-matris). Uppmätt tak från flottans egen bench: B70 8
strömmar 103,6 tok/s · Spark 8 strömmar 104,5 tok/s · ~208 tok/s samlat, 229 590 tokens i luften
utan läckage mellan strömmar. (Sajten markerar uttryckligen att detta är en simulering baserad på
uppmätta siffror, inte en live-körning.)

### Hårdvaran och vad varje accelerator gör

- **RTX 3090 · 24 GB** — kontextvärd: sköter kontext för samtliga sessioner, komprimerar och
  arkiverar. Qwen3.8-27B · 96 000 kontext · MTP; varm prefix: 1 877 ms → 161 ms · 54 tok/s —
  varmt cache: sessionen läser aldrig om det den redan vet, starten blir ca 12 gånger snabbare.
- **Intel Arc B70 · 32 GB** — kodarlane. Qwen3.8-27B (AWQ) via vLLM · 262 144 kontext; 8 strömmar:
  103,6 tok/s · inläsning 807,8 tok/s.
- **2× DGX Spark GB10** — orkestrering, planering, arkitektur. DeepSeek-V4 · 1 M kontextfönster;
  8 strömmar: 104,5 tok/s · inläsning ~1 540 tok/s; arbetar som en enhet för en stor modell.
- **RTX 2060 · 6 GB** — inbäddningar, omrankning, triage.

Totalt uppmätt: ~2 350 tok/s inläsning · ~208 tok/s generering.

### AI-OS — tavlan som visar flottan just nu

Avslutningsrad på pitch- och case-skärmarna: *"Se vad som sker i systemet just nu:"* —
https://sibbamala.com/ai-os/ (read-only dashboard, "AI OS – Tavlor").

Tillhör även: föreläsningens bildspel **"Autonom AI-OS"**, publicerat som bildspel i webbläsaren på
https://sibbamala.com/presentation/.

## Case

Ett konkret fall — reglerad verksamhet i slutet nät.

**Vem:** Försvarsindustri, medicinteknik, industriell automation. Nät utan väg ut. Ingen Copilot,
ingen molntjänst, ingen genväg.

**Problemet de faktiskt har:** Dokumentation och spårbarhet äter en stor del av varje projekt:
kravspårning, konstruktionsunderlag, testprotokoll, ändringsanalys. Det är obligatoriskt, det är
omfattande, det görs av dyra ingenjörer som hellre gör något annat — och det får inte lämna nätet.

**Varför en agentflotta passar just det:**

- skribenten dokumenterar från artefakter — commits, loggar, körd konfiguration — inte från vad
  någon påstod i en rapport
- ärendetavlan *är* en spårbarhetsmatris: krav, beslut, bevis
- grindarna ger PASS/FAIL ur exitkoder, så "klart" är ett faktum och inte någons uppfattning

**Ärligt om gränserna:** Ett helt frånkopplat nät betyder inga modelluppdateringar och inga
säkerhetsfixar utan att någon bär in dem. Det är en driftkostnad och en leveranskedjefråga, inte
en detalj. Lokala modeller är svagare per enskilt svar än de största molnmodellerna. Det
kompenseras med flöde, grindar och omtag — inte med magi. Lovar någon frontier-kvalitet på egen
hårdvara ljuger de. Systemet kan driftsättas segmenterat: ingen väg ut mot internet, men fullt
fungerande på det interna nätet. Det kan också köras helt offline — då gäller förbehållet ovan om
uppdateringar som måste bäras in.

## Kontakt

Publika kanaler — inga andra får dyka upp i ett tema:

- **E-post:** alexander@sibbamala.com
- **GitHub:** https://github.com/bryn1

Inbjudan (ordagrant från kontaktskärmen):

> Jag tar gärna ett förutsättningslöst samtal om vad som skulle gå att köra lokalt hos er — vad
> som är realistiskt, vad det kräver i hårdvara, och vad som inte är värt besväret.

> Har ni ett återkommande flöde med ett kontrollerbart "klart" är det den bästa starten.

---

## Länktableå — kontrollerad 2026-10-04

Varje URL ovan hämtades den 2026-10-04: sibbamala.com med webbläsar-UA (`curl -A "Mozilla/5.0" -L`),
github.com med vanlig `curl -L`. Alla returnerade HTTP 200.

| URL | HTTP |
|---|---|
| https://sibbamala.com/ | 200 |
| https://github.com/bryn1 | 200 |
| https://github.com/bryn1/bevis | 200 |
| https://github.com/bryn1/Rocket | 200 |
| https://github.com/bryn1/Hotell | 200 |
| https://github.com/bryn1/Cad | 200 |
| https://github.com/bryn1/Bibliotek | 200 |
| https://github.com/bryn1/futurecraft | 200 |
| https://sibbamala.com/ai-os/ | 200 |
| https://sibbamala.com/presentation/ | 200 |
| https://sibbamala.com/rocket/ | 200 |
| https://sibbamala.com/hotell/ | 200 |
| https://sibbamala.com/cad/ | 200 |
| https://sibbamala.com/bibliotek/ | 200 |
| https://sibbamala.com/futurecraft/ | 200 |
| https://skola.sibbamala.com | 200 |
| https://np.sibbamala.com | 200 |

Säkerhetspass: dokumentet innehåller inga IP-adresser, interna värdnamn, portar, adresser eller
telefonnummer — endast de publikationskanaler sajten själv visar (e-post, github.com/bryn1,
sibbamala.com). Det borttagna kontots namn förekommer inte i innehållet (noll träffar utanför
statusraden; grep verifierat).

# CONTENT: svarkor-hits=0 links-ok=17/17
