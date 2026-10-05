/* 18 · Bara typsnitt — scroll-koreografi (MC 10088, ägarens JS-regel 2026-10-05).
   GSAP + ScrollTrigger lokalt vendor (../_assets/vendor/) — ingen CDN, inga
   animation-timeline-deklarationer någonstans. All rörelse registreras ENDAST
   i (prefers-reduced-motion: no-preference): med reduce körs ingenting och allt
   innehåll står redan i CSS i sitt synliga slutläge (regler fullt dragna,
   scramble textad, sidan icke-inverterad). Utan JS/bibliotek händer nada.
   Temat är foto-fritt: typografin ÄR rörelsen — FÄRG (inverteringssteg),
   ZOOM (jättesymlabor som skalar med scrollen), LINJE (hårlinjer som ritas),
   DRIFT (siffror och Före/Efter-kolumner driver med olika hastighet),
   PIN-OR-DRAW (scramble-decode vid inträde). Ingen global: IIFE. */
(function () {
  "use strict";
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; }                        // biblioteken saknas → statisk sida
  g.registerPlugin(ST);

  var mm = g.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", function () {

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

    /* 2 · ZOOM (scrub): sektionstitlarna växer in i läsbar skala — samma
           morfologi som temat hade i CSS, nu i GSAP. */
    g.utils.toArray(".section__title").forEach(function (title) {
      g.set(title, { transformOrigin: "0% 50%" });
      g.fromTo(title,
        { scale: 0.9, opacity: 0.15 },
        { scale: 1, opacity: 1, ease: "none",
          scrollTrigger: { trigger: title, start: "top 92%", end: "top 55%", scrub: true } });
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

    /* 4 · LINJE (scrub): hårlinjerna mellan sektionerna ritas från vänster.
           Utan JS/reducerad rörelse: CSS-läget är redan fullt ritat (1). */
    g.utils.toArray(".type-rule").forEach(function (rule) {
      g.set(rule, { scaleX: 0 });
      g.to(rule, {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: rule, start: "top 88%", end: "top 38%", scrub: true }
      });
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
        g.fromTo(fore, { xPercent: 10 }, { xPercent: -10, ease: "none", scrollTrigger: trig });
      }
      if (after) {
        g.fromTo(after, { xPercent: 5 }, { xPercent: -5, ease: "none", scrollTrigger: trig });
      }
    });

    /* 7 · FÄRG: kontrasten INVERTERAS som ett steg medan typspecimen-sektionen
           håller på — hela sidan blir negativ under galleriplåten och återgår
           utanför. Båda ändarna är AA-uppmätta (se evidence/18-contrast). */
    function setInvert() { document.body.classList.add("inverted"); }
    function clearInvert() { document.body.classList.remove("inverted"); }
    ST.create({
      trigger: "#galleri", start: "top 78%", end: "bottom 22%",
      onEnter: setInvert, onEnterBack: setInvert,
      onLeave: clearInvert, onLeaveBack: clearInvert
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
  });

  ST.refresh();
})();
