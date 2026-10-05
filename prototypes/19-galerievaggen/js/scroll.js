/* GALLERIVÄGGEN · scroll-lager — GSAP + ScrollTrigger (lokalt vendor i head,
   defer). Allt innanför IIFE:n: inga egna globaler, inga animation-timeline-
   deklarationer. Triggers byggs ENDAST i gsap-matchMedians no-preference-gren
   — vid prefers-reduced-motion byggs noll triggers och sidan står i sitt
   CSS-utgångsläge (allt synligt, bandet går att bläddra som förut).
   Klasser: DRIFT (hang+vägg), ZOOM (inträn + passerande ram), LINE (räls),
   COLOR (skensljus + fördjupning + vinjett), PIN (vägglapp / vandringsband).
   Pekarlutningen i tilt.js rör .work — detta lager rör .hang — ingen konflikt. */
(function () {
  'use strict';

  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  if (!gsap || !ST) return;                       // vendor laddad ej — vila-läge
  gsap.registerPlugin(ST);

  var mm = gsap.matchMedia();

  /* ---------- Grundrörelser: gäller alla skärmbredder (ej reduce) ---------- */
  mm.add("(prefers-reduced-motion: no-preference)", function () {

    var heroTl = null;

    /* LINE — rälssnören under varje sektionstitel ritas från vänster (scrub). */
    gsap.utils.toArray(".wall-rail").forEach(function (rail) {
      gsap.fromTo(rail, { scaleX: 0, transformOrigin: "left center" }, {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: rail, start: "top 92%", end: "top 55%", scrub: 0.6 }
      });
    });

    /* DRIFT + COLOR i entrén: titelplattan glider uppåt medan väggens
       skensljus tändas och väggen mjukt fördjupas. */
    heroTl = gsap.timeline({
      scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: 1 }
    });
    heroTl.fromTo(".hero__inner", { y: 0 }, { y: -70, ease: "none" }, 0);
    heroTl.fromTo(".hero__light", { opacity: 0.5 }, { opacity: 1, ease: "none" }, 0);

    /* ZOOM — porträttramen fälls till ro från ett närmare upphängning (scrub). */
    gsap.fromTo(".work--portrait", { scale: 1.08, y: 26 }, {
      scale: 1, y: 0, ease: "power2.out",
      scrollTrigger: { trigger: ".work--portrait", start: "top 100%", end: "top 45%", scrub: 1 }
    });

    /* COLOR — väggtonen fördjupas djupare ner i huset: fast vinjett som
       tätnar med scroll-djupet (kant-zonerna nuddar ej brödtextens kolumn). */
    gsap.fromTo(".wall-vignette", { opacity: 0 }, {
      opacity: 1, ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1 }
    });

    /* ---------- Galleriväggen: ramen rör sig när man går förbi ---------- */
    var hangs = gsap.utils.toArray("#galleri .hang");

    hangs.forEach(function (hang, i) {
      var depth = i % 3;                 /* låtsrad-djup: olika drift-takt */
      var dy = [38, 92, 148][depth];     /* px — väggen halkar förbi i takt */
      var dx = [-10, 0, 15][depth];

      /* DRIFT — ramen halkar horisontellt/vertikalt i sin egen takt (scrub). */
      gsap.fromTo(hang, { y: -dy * 0.5, x: dx * 0.5 }, {
        y: dy * 0.5, x: dx * 0.5, ease: "none",
        scrollTrigger: { trigger: ".galleri__wall", start: "top bottom", end: "bottom top", scrub: 1 }
      });

      /* ZOOM — den passerande ramen är litet större: skalan sväller mot
         ögonhöjd och lägger sig igen när ramen stiger förbi (scrub). */
      gsap.fromTo(hang, { scale: 1 }, {
        scale: 1.045, ease: "sine.inOut", yoyo: true, repeat: 1,
        scrollTrigger: { trigger: hang, start: "top bottom", end: "top top", scrub: 1 }
      });

      /* COLOR — bildlampans sken tändas när verket lyfts in i tändhöjd. */
      var light = hang.querySelector(".work__light");
      if (light) {
        gsap.fromTo(light, { opacity: 0, scale: 0.86 }, {
          opacity: 1, scale: 1, ease: "none",
          scrollTrigger: { trigger: hang, start: "top bottom", end: "top 42%", scrub: 0.8 }
        });
      }
    });

    return function () { if (heroTl) heroTl.kill(); };
  });

  /* ---------- Desktop: PIN — vägglappen hålls medan verken passerar ------- */
  mm.add("(prefers-reduced-motion: no-preference) and (min-width: 701px)", function () {

    gsap.utils.toArray("#galleri .wall").forEach(function (wall) {
      /* DRIFT — hela väggen svajar litet sidled när man promenerar förbi. */
      gsap.fromTo(wall, { x: -26 }, {
        x: 26, ease: "none",
        scrollTrigger: { trigger: wall, start: "top bottom", end: "bottom top", scrub: 1 }
      });
    });

    ST.create({
      trigger: "#galleri",
      start: "top top",
      end: "bottom bottom",
      pin: ".galleri__head"          /* sektionstiteln sitter stilla medan
                                        väggens ramar glider förbi under */
    });
  });

  /* ------- Mobil: PIN — lodrät scroll blir vågrät vandring längs vaggen --- */
  mm.add("(prefers-reduced-motion: no-preference) and (max-width: 700px)", function () {
    var strip = document.querySelector("#galleri .wall");
    if (!strip) return;

    /* Bandet öppnas upp (clip:en sköter .galleri__wall) så innehållet kan
       glida; vid reduce kör denna gren aldrig — CSS-bandet finns kvar. */
    gsap.set(strip, { overflowX: "visible" });

    gsap.to(strip, {
      x: function () { return -(strip.scrollWidth - strip.clientWidth); },
      ease: "none",
      scrollTrigger: {
        trigger: ".galleri__wall",
        start: "top top",
        end: function () { return "+=" + (strip.scrollWidth - strip.clientWidth); },
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true
      }
    });
  });
})();
