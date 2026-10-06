/* 18 · Bara typsnitt — scroll-koreografi (MC 10088, ägarens JS-regel 2026-10-05;
   DENSITY-03d 2026-10-05: tathetspass — bokstäver andas, ord driver mot varandra,
   metadata motscrollar, inverteringen sveper genom sidan).
   GSAP + ScrollTrigger lokalt vendor (../_assets/vendor/) — ingen CDN, inga
   animation-timeline-deklarationer någonstans. All rörelse registreras ENDAST
   i (prefers-reduced-motion: no-preference): med reduce körs ingenting och allt
   innehåll står redan i CSS i sitt synliga slutläge (regler fullt dragna,
   scramble textad, sidan icke-inverterad). Utan JS/bibliotek händer nada.
   reason (>400 rader, DENSITY-FIX-01): ordgap-klemen (wordGaps/clampWordAmps) måste bo i samma
   fil som amplituderna den skyddar — den mäter grann-span i DOM-flödet och delar beräkningen
   med drift-tweenen; att splita isär skyddet från amplituden skulle kräva delat flyttandes
   (hygienregeln 2026-10-05: >400 kräver motivering i headern, inte split som sämre alternativ).
   Temat är foto-fritt: typografin ÄR rörelsen — FÄRG (inverteringssteget sveper
   ner genom sidan, sektion för sektion), ZOOM (jättesymlabor som skalar),
   LINJE (hårlinjer som ritas och tjocknar), DRIFT (bokstäver ±6–14 px med
   förskjutna starttider, nummer och metadata motscrollar), MOTRACK (jätteord
   glider horisontellt mot varandra, brett läge), PIN-OR-DRAW (scramble-decode
   vid inträde). Ingen global: IIFE. Upplösning av ord/bokstäver sker i JS —
   originaltexten behålls opåverkad i DOM:en under sr-only-kopian. */
(function () {
  "use strict";
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; }                        // biblioteken saknas → statisk sida
  g.registerPlugin(ST);

  var mm = g.matchMedia();

  /* sönderdelning till synliga teckenspan; meningen/riktiga texten läggs i en
     sbr-only-kopia, den synliga kopian blir aria-hidden (samma mönster som
     scramble redan använder). Redan upplösta element svarar [] (dubbla skydd). */
  function splitChars(el) {
    if (!el || el.children.length || el.querySelector("br")) return [];
    var text = el.textContent;
    if (!text || !text.trim()) return [];
    var withSr = el.getAttribute("aria-hidden") !== "true";
    var frag = document.createDocumentFragment();
    if (withSr) {
      var sr = document.createElement("span");
      sr.className = "sr-only";
      sr.textContent = text;
      frag.appendChild(sr);
    }
    var wrap = document.createElement("span");
    wrap.setAttribute("aria-hidden", "true");
    var spans = [];
    Array.from(text).forEach(function (ch) {
      if (/\s/.test(ch)) { wrap.appendChild(document.createTextNode(" ")); return; }
      var s = document.createElement("span");
      s.className = "dch";
      s.textContent = ch;
      spans.push(s);
      wrap.appendChild(s);
    });
    frag.appendChild(wrap);
    el.textContent = "";
    el.appendChild(frag);
    return spans;
  }

  /* ordvis uppdelning: mellanslag finns kvar som textnoder → skärmläsare och
     radbrytning beter sig som förut. Inget aria-hidat: texten är orörd. */
  function splitWords(el) {
    if (!el || el.children.length) return [];
    var text = el.textContent;
    if (!text || !text.trim()) return [];
    var frag = document.createDocumentFragment();
    var spans = [];
    text.split(/(\s+)/).forEach(function (part) {
      if (!part) return;
      if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
      var s = document.createElement("span");
      s.className = "dw";
      s.textContent = part;
      spans.push(s);
      frag.appendChild(s);
    });
    el.textContent = "";
    el.appendChild(frag);
    return spans;
  }

  /* gruppera redan upplösta .dch-span i ord (contiguousa span mellan
     mellanslagstextnoder) — för horisontal motrack på titlarna. */
  function wordsFromChars(el) {
    var wrap = el.querySelector("span[aria-hidden]");
    if (!wrap) return [];
    var words = [], cur = [];
    Array.prototype.forEach.call(wrap.childNodes, function (n) {
      if (n.nodeType === 1 && n.classList.contains("dch")) { cur.push(n); return; }
      if (cur.length) { words.push(cur); cur = []; }
    });
    if (cur.length) words.push(cur);
    return words;
  }

  /* ---- DENSITY-FIX-01 (P2): ORDSAMMANDS-GOLV -----------------------------
     Motracken i block 21/22 kan trycka ihop grannord till hopskrivet
     ("BOKARDU VIATELEFON"). Nu clampas varje ords x-amplitud så att gapet
     till grannen ALDRIG kan krympa under 0.15 em vid något scrub-läge.
     Mäts i layout-px (offsetLeft/Width är transformfritt; förälders
     skalaneringar tar ut varandra mot 0.15·fs när min-skalan 0.9
     bakas in av anroparen). Intra-ord-driften (lodningen, block 2)
     rör inte villkoret och behåller sin amplitude.
     Villkor per gräns: amp_i + amp_{i+1} ≤ gap_i − minGap (som mest
     kör orden varandra till mötes i vars sin ytterposition). */
  var GAP_MARGIN_PX = 1.5;               // offsetLeft/Width är heltalsavrundade
  function wordGaps(groups) {
    var gaps = [];
    for (var i = 0; i < groups.length - 1; i++) {
      var a = groups[i][groups[i].length - 1], b = groups[i + 1][0];
      if (a.offsetTop + a.offsetHeight < b.offsetTop ||
          b.offsetTop + b.offsetHeight < a.offsetTop) { gaps.push(Infinity); continue; }
      gaps.push(b.offsetLeft - (a.offsetLeft + a.offsetWidth));
    }
    return gaps;
  }
  function clampWordAmps(groups, base, minGapPx, extraFn) {
    var amps = groups.map(function () { return base; });
    if (groups.length < 2) { return amps; }
    var gaps = wordGaps(groups);
    [gaps.map(function (_, i) { return i; }),
     gaps.map(function (_, i) { return gaps.length - 1 - i; })].forEach(function (order) {
      order.forEach(function (i) {
        var slack = gaps[i] - minGapPx - GAP_MARGIN_PX - (extraFn ? extraFn(i) : 0);
        var sum = amps[i] + amps[i + 1];
        if (sum <= 0 || sum <= slack) { return; }
        if (slack <= 0) { amps[i] = 0; amps[i + 1] = 0; return; }
        var k = slack / sum;
        amps[i] *= k; amps[i + 1] *= k;
      });
    });
    return amps;
  }

  /* en scrub-timeline per grupp: varje element får egen amplitud (6–14 px),
     alternerande riktning och förskjuten starttid → alltid är en majoritet av
     elementen mid-motion medan sektionen passerar, men aldrig i låstakten. */
  function drift(items, o) {
    if (!items || !items.length) return;
    var tl = g.timeline({
      scrollTrigger: {
        trigger: o.trigger || items[0],
        start: o.start || "top 97%", end: o.end || "bottom 3%",
        scrub: o.scrub === undefined ? 0.6 : o.scrub
      }
    });
    var spread = (o.spread === undefined ? 0.6 : o.spread), dur = o.dur || 0.4;
    items.forEach(function (el, i) {
      var at = spread ? (i / items.length) * spread : 0;
      var dir = o.dir || ((i % 2) ? -1 : 1);
      if (o.y) {
        var y1 = o.y1 || 6, y2 = o.y2 || 14;
        var amp = y1 + ((i * 7) % (y2 - y1 + 1));
        tl.fromTo(el, { y: dir * amp }, { y: -dir * amp, duration: dur, ease: "none" }, at);
      }
      if (o.x) {
        tl.fromTo(el, { x: dir * o.x }, { x: -dir * o.x, duration: dur, ease: "none" }, at);
      }
      if (o.scale) {
        tl.fromTo(el, { scale: 1 }, { scale: o.scale, duration: dur / 2, ease: "none", yoyo: true, repeat: 1 }, at);
      }
    });
    return tl;
  }

  /* ===== grundpass: alla bredder, scrub ===== */
  mm.add("(prefers-reduced-motion: no-preference)", function () {
    return g.context(function () {

      /* 1 · ZOOM (scrub): hjältens namn krymper kontinuerligt när sektionen
             rullar uppåt — första hjul notchet svarar direkt. */
      var hero = document.querySelector(".hero__name");
      if (hero) {
        g.set(hero, { transformOrigin: "0% 60%" });
        g.fromTo(hero,
          { scale: 1, yPercent: 0 },
          { scale: 0.8, yPercent: -8, ease: "none",
            scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: 0.6 } });
      }

      /* 2 · ZOOM (scrub): sektionstitlarna växer in i läsbar skala — och
             därefter ANDAS deras bokstäver med förskjutna starttider. */
      g.utils.toArray(".section__title").forEach(function (title) {
        g.set(title, { transformOrigin: "0% 50%" });
        g.fromTo(title,
          { scale: 0.9, opacity: 0.15 },
          { scale: 1, opacity: 1, ease: "none",
            scrollTrigger: { trigger: title, start: "top 92%", end: "top 55%", scrub: true } });
        drift(splitChars(title), { trigger: title, start: "top 96%", end: "bottom top", y1: 6, y2: 14, dur: 0.45 });
      });

      /* 3 · ZOOM (scrub): porträtt-glyfen A — jättesymlabet som växer hela
             Om-sektionen förbi, roterar ut sitt lut. */
      var glyph = document.querySelector(".portrait__glyph");
      if (glyph) {
        g.fromTo(glyph,
          { scale: 0.72, rotation: -2 },
          { scale: 1.18, rotation: 0, ease: "none",
            scrollTrigger: { trigger: ".portrait", start: "top bottom", end: "bottom top", scrub: 0.5 } });
      }

      /* 4 · LINJE (scrub): hårlinjerna ritas från vänster OCH tjocknar
             kontinuerligt medan sektionen passerar. Utan JS/reducerad rörelse:
             CSS-läget är redan fullt ritat (1). */
      g.utils.toArray(".type-rule, .footer__rule").forEach(function (rule) {
        g.fromTo(rule,
          { scaleX: 0, scaleY: 1 },
          { scaleX: 1, scaleY: 1.8, ease: "none",
            scrollTrigger: { trigger: rule, start: "top 95%", end: "top 28%", scrub: true } });
      });

      /* 5 · DRIFT (scrub): tjänstesiffrorna driver mot texten — vertikal
             parallax i ren typografi, ±18 % av sifforns höjd. */
      g.utils.toArray(".svc__num").forEach(function (num) {
        g.fromTo(num,
          { yPercent: -18 },
          { yPercent: 18, ease: "none",
            scrollTrigger: { trigger: num.closest(".svc__row") || num, start: "top bottom", end: "bottom top", scrub: true } });
      });

      /* 6 · DRIFT (scrub): Före/Efter-kolumnerna i typspecimenet driver MOT
             varandra i olika hastighet — relativ förskjutning ~25 % brett. */
      g.utils.toArray(".specimen__row").forEach(function (row) {
        var fore = row.querySelector(".specimen__fore");
        var after = row.querySelector(".specimen__after");
        var trig = { trigger: row, start: "top bottom", end: "bottom top", scrub: true };
        if (fore) {
          g.fromTo(fore, { xPercent: 12 }, { xPercent: -12, ease: "none", scrollTrigger: trig });
        }
        if (after) {
          g.fromTo(after, { xPercent: 5 }, { xPercent: -5, ease: "none", scrollTrigger: trig });
        }
      });

      /* 7 · FÄRG: kontrasten INVERTERAS som ett svep ner genom sidan — varje
             sektionsgräns är ett skarpt steg (inga grå korsningar), och båda
             ändarna är desamma AA-uppmätta paletterna som förut
             (se evidence/18-contrast). Stegen är flyttade till
             Tjänster/Galleri/Boka/Sidfot så inverteringen svänger om flera
             gånger per scrollsträcka. */
      function flip(on) {
        return function () {
          if (on) { document.body.classList.add("inverted"); }
          else { document.body.classList.remove("inverted"); }
        };
      }
      var prev = false;
      [["#tjanster", true, "top 62%"], ["#galleri", false, "top 62%"], ["#boka", true, "top 62%"], [".footer", false, "top bottom"]]
        .forEach(function (b) {
          var el = document.querySelector(b[0]);
          if (!el) return;
          var on = b[1];
          ST.create({
            trigger: el, start: b[2],
            onEnter: flip(on), onLeaveBack: flip(prev)
          });
          prev = on;
        });

      /* 8 · PIN-OR-DRAW: scramble-decode — temats signaturspråk — träffas nu av
             ScrollTrigger i stället för IntersectionObserver. Handrullade ~20
             rader, ingen ScrambleTextPlugin, ingen ny dep. Markupen bär alltid
             sluttexten; den synliga kopian är aria-hidden. */
      var GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ0123456789/·—#";
      function decodeOnce(el) {
        var final = el.textContent, n = final.length, frame = 0, perFrame = 0.34;
        function tick() {
          frame += 1;
          var out = "", pending = false;
          for (var i = 0; i < n; i += 1) {
            var c = final.charAt(i);
            if (c === " " || c === "\u00a0") { out += c; continue; }
            if (frame * perFrame > i + 3) { out += c; }
            else { out += GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length)); pending = true; }
          }
          el.textContent = out;
          if (pending) { window.requestAnimationFrame(tick); }
          else { el.textContent = final; }            // exakt sluttext, aldrig restbrus
        }
        window.requestAnimationFrame(tick);
      }
      g.utils.toArray("[data-scramble]").forEach(function (el) {
        ST.create({
          trigger: el, start: "top 92%", once: true,
          onEnter: function () { decodeOnce(el); }
        });
      });

      /* Marquee-rails: tidsdriven banderoll flyttas hit från CSS (temat har nu
         noll CSS-animationer). Reverse-rälet löper åt andra hållet, och hoover
         pausar — som tidigare .rail:hover gjorde. */
      g.utils.toArray(".rail__track").forEach(function (track) {
        var reverse = track.parentElement.classList.contains("rail--reverse");
        var tween = reverse
          ? g.fromTo(track, { xPercent: -50 }, { xPercent: 0, duration: 42, ease: "none", repeat: -1 })
          : g.fromTo(track, { xPercent: 0 }, { xPercent: -50, duration: 34, ease: "none", repeat: -1 });
        var rail = track.closest(".rail");
        if (rail) {
          rail.addEventListener("pointerenter", function () { tween.pause(); });
          rail.addEventListener("pointerleave", function () { tween.resume(); });
        }
      });

      /* ---- DENSITY-03d: täthetsregistren nedan. Alla är scrub — rörelsen
         följer hjulet, aldrig autoplay på innehåll. ---- */

      /* 9 · DRIFT: tjänstenamnen bokstav för bokstav, rad för rad. */
      g.utils.toArray(".svc__name").forEach(function (name) {
        drift(splitChars(name), {
          trigger: name.closest(".svc__row") || name,
          start: "top bottom", end: "bottom top", y1: 5, y2: 12, dur: 0.45
        });
      });

      /* 10 · DRIFT: typspecimenets displaytecken andas. */
      g.utils.toArray(".specimen-block__display").forEach(function (disp) {
        drift(splitChars(disp), { trigger: disp, start: "top bottom", end: "bottom top", y1: 4, y2: 10, dur: 0.5 });
      });

      /* 11 · DRIFT + MAKS: kontakt-rubriken ord för ord med mikroskala. */
      g.utils.toArray(".kontakt__big").forEach(function (big) {
        drift(splitWords(big), { trigger: big, start: "top 94%", end: "bottom top", y1: 6, y2: 12, scale: 1.04, dur: 0.5 });
      });

      /* 12 · DRIFT: brödtextens rader och addressens rader driver i olika
             hastighet — paragrafer och adressrader mot varandra. */
      drift(g.utils.toArray(".om__text p"), { trigger: ".om__text", y1: 4, y2: 8, dur: 0.5 });
      drift(g.utils.toArray(".kontakt__addr p").slice(1), { trigger: ".kontakt__addr", y1: 6, y2: 12, dur: 0.45 });
      drift(g.utils.toArray(".kontakt__form label"), { trigger: ".kontakt__form", y1: 3, y2: 6, dur: 0.4 });

      /* 13 · DRIFT: eyebrow-raden per sektion — decodad text svävar vidare. */
      g.utils.toArray(".eyebrow").forEach(function (eb) {
        drift([eb], { trigger: eb, start: "top 97%", end: "top 35%", y1: 5, y2: 9, dur: 0.6 });
      });

      /* 14 · MOTRACK: typnavens länkar lever sitt egna liv hela vägen —
             sticky-listan driver med minimal amplitud vid varje scrollsteg. */
      drift(g.utils.toArray(".typebar__brand, .typebar__nav a"), {
        trigger: document.body, start: "top top", end: "bottom bottom",
        y1: 2, y2: 4, dur: 0.22, spread: 0.9
      });

      /* 15 · DRIFT: hero-underrubrik och CTA-ord andas första sektionen förbi. */
      g.utils.toArray(".hero__sub").forEach(function (sub) {
        drift(splitWords(sub), { trigger: "#top", start: "top top", end: "bottom top", y1: 5, y2: 11, dur: 0.5 });
      });
      g.utils.toArray(".hero__cta .type-btn").forEach(function (btn) {
        drift(splitWords(btn), { trigger: "#top", start: "top top", end: "bottom top", y1: 4, y2: 8, dur: 0.5 });
      });

      /* 16 · MOTRACK: sidfotens metarader och länk driver olika fort. */
      drift(g.utils.toArray(".footer__line span"), { trigger: ".footer", start: "top bottom", end: "bottom top", y1: 8, y2: 14, dur: 0.5 });
      drift(g.utils.toArray(".footer a"), { trigger: ".footer", start: "top bottom", end: "bottom top", y1: 4, y2: 8, dur: 0.5 });

      /* 17 · MOTRACK: metadata-raderna i typspecimenet och rubrikerna i
             bokningsdemot motscrollar varandra. */
      drift(g.utils.toArray(".specimen-block__meta"), { trigger: ".specimen-block", start: "top bottom", end: "bottom top", y1: 7, y2: 11, dur: 0.5 });
      drift(g.utils.toArray(".booking-day legend"), { trigger: ".booking-grid", start: "top bottom", end: "bottom 30%", y1: 4, y2: 8, dur: 0.45 });

      /* 18 · DRIFT: de ärliga anmärkningsraderna och demo-märkena svävar. */
      g.utils.toArray(".galleri__honest, .boka-note, .demo-badge").forEach(function (el, i) {
        drift([el], { trigger: el, start: "top bottom", end: "top 30%", y1: 5, y2: 9, dur: 0.6, scrub: 0.8 });
      });
      drift(g.utils.toArray(".specimen__cap"), { trigger: ".specimen", start: "top bottom", end: "bottom top", y1: 5, y2: 9, dur: 0.45 });

      /* 19 · TYNGD-AXEL: Public Sans är variabel — brödtextsspecimenet
             går 300→700 medan galleriplåten passerar (VDTH-axel saknas i
             fonts — därför inga breddändringar; Anton är inte variabel). */
      var bodySpec = document.querySelector(".specimen-block__body");
      if (bodySpec) {
        g.fromTo(bodySpec,
          { fontVariationSettings: '"wght" 300' },
          { fontVariationSettings: '"wght" 700', ease: "none",
            scrollTrigger: { trigger: ".specimen-block", start: "top bottom", end: "bottom top", scrub: 0.5 } });
      }
    });
  });

  /* ===== brett läge ≥ 48rem: horisontell motrack — riskfri på dokumentets
     bredd eftersom jättetyget aldrig nuddar högerkanten här ===== */
  mm.add("(prefers-reduced-motion: no-preference) and (min-width: 48rem)", function () {
    /* DENSITY-FIX-01: block 21/22 mäter ordsammandets gap med offsetLeft/
       offsetWidth — måste ske EFTER webfont-laddning, annars mäts
       fallback-fontens bredd och clampen blir för snäll (Malmö-fallet:
       ordet fick x-amplitud 10 mot ett för stort uppmätt gap). Block 20 är
       mätoki och registreras direkt; 21/22 registreras på fonts.ready och
       dödas av samma städning om villkoret vänder. */
    var live = true;
    var laterCtx = null;
    var heroCtx = g.context(function () {

      /* 20 · MOTRACK: DIN och SALONG glider horisontellt MOT varandra. */
      var lines = g.utils.toArray(".hero__line");
      lines.forEach(function (line, i) {
        var dir = i % 2 ? -1 : 1;
        g.fromTo(line,
          { x: dir * 42 },
          { x: -dir * 42, ease: "none",
            scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: 0.6 } });
      });
    });
    var fontsReady = (document.fonts && document.fonts.ready) || Promise.resolve();
    fontsReady.then(function () {
      if (!live) { return; }
      laterCtx = g.context(function () {

        /* 21 · MOTRACK: titlarnas ord glider mot varandra — varje annorlunda
               ord halv-annorlunda amplitud. DENSITY-FIX-01: amplituden
               clampas per ordpar så att ordsammandet alltid är ≥ 0.15 em;
               titlarnas egen skala går ner på 0.9 → minGap/0.9 i layout-px. */
        g.utils.toArray(".section__title").forEach(function (title) {
          var words = wordsFromChars(title);
          // varje ord = en grupp tecken som glider tillsammans (spread 0) —
          // alternerande riktning gör att grannorden kör mot varandra.
          var fsPx = parseFloat(window.getComputedStyle(title).fontSize) || 16;
          var amps = clampWordAmps(words, 10, (0.15 * fsPx) / 0.9);
          words.forEach(function (chars, wi) {
            if (!amps[wi]) { return; }
            drift(chars, {
              trigger: title, start: "top 96%", end: "bottom top",
              x: amps[wi], dur: 0.5, spread: 0,
              dir: wi % 2 ? -1 : 1
            });
          });
        });

        /* 22 · MOTRACK: kontakt-rubrikens ord och sidfotens rader får sin
               horisontella komponent här. DENSITY-FIX-01: samma golv —
               kontaktordens pulserande skala (1.04) betalas i extra-slack,
               sidfotens flex-bredd ger gott om spelrum från början. */
        g.utils.toArray(".kontakt__big").forEach(function (big) {
          var groups = Array.prototype.map.call(big.querySelectorAll(".dw"), function (w) { return [w]; });
          if (!groups.length) { return; }
          var fsPx = parseFloat(window.getComputedStyle(big).fontSize) || 16;
          var amps = clampWordAmps(groups, 10, (0.15 * fsPx) / 0.9, function (i) {
            return 0.02 * (groups[i][0].offsetWidth + groups[i + 1][0].offsetWidth);
          });
          groups.forEach(function (grp, wi) {
            if (!amps[wi]) { return; }
            g.fromTo(grp[0],
              { x: (wi % 2 ? -1 : 1) * amps[wi] },
              { x: (wi % 2 ? 1 : -1) * amps[wi], ease: "none",
                scrollTrigger: { trigger: big, start: "top 90%", end: "bottom top", scrub: 0.6 } });
          });
        });
        g.utils.toArray(".footer__line").forEach(function (line) {
          var groups = Array.prototype.map.call(line.querySelectorAll("span"), function (s) { return [s]; });
          if (!groups.length) { return; }
          var fsPx = parseFloat(window.getComputedStyle(line).fontSize) || 16;
          var amps = clampWordAmps(groups, 12, (0.15 * fsPx) / 0.9);
          groups.forEach(function (grp, wi) {
            if (!amps[wi]) { return; }
            g.fromTo(grp[0],
              { x: (wi % 2 ? -1 : 1) * amps[wi] },
              { x: (wi % 2 ? 1 : -1) * amps[wi], ease: "none",
                scrollTrigger: { trigger: ".footer", start: "top bottom", end: "bottom top", scrub: 0.6 } });
          });
        });
      });
      ST.refresh();
    });
    return function () {
      live = false;
      heroCtx.revert();
      if (laterCtx) { laterCtx.revert(); }
    };
  });

  ST.refresh();
})();
