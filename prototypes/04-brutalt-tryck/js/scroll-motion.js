/* scroll-motion.js — 04 Brutalt tryck: ALL scroll-rörelse i ETT enda
   GSAP/ScrollTrigger-lager (lokalt vendor i head, defer). Ersätter reveal.js
   (IO-reveals) och scroll-fx.js (stapel-/sticker-drift) — en mekanik per
   bekymmer. Allt innanför IIFE:n: inga egna globaler. Triggers byggs ENDAST
   i gsap.matchMedias no-preference-gren: vid prefers-reduced-motion byggs
   noll triggers och sidan står i CSS-utgångsläget (allt synligt); utan JS
   händer ingenting alls — default-visible. Drag-fysiken bor kvar i
   hero-drag.js (ej scroll), galleri-/boknings-/kontaktknapparna i sina filer.
   Rörelseklasser (brutalt tryck): LINE = tunga reglar ritas från vänster;
   COLOR = gallerifältet färgstegras svart → signalrött i hårda steg;
   ZOOM = porträttbilden faller till ro inuti ramen (ram + röd hållskugga
   orörda); DRIFT = om-kolumner, jättesiffror, sticker, marquee och hero-
   titel fölfter scrollsträngen; PIN = Om-rubriken hålls medan innehållet
   under passerar. */
(function () {
  "use strict";
  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  if (!gsap || !ST) { return; }            /* vendor ej laddad — vila-läge */
  gsap.registerPlugin(ST);

  var mm = gsap.matchMedia();

  /* ================= Grundrörelser — alla skärmbredder (ej reduce) ======== */
  mm.add("(prefers-reduced-motion: no-preference)", function () {

    /* REVEAL — data-reveal-avsnitt glider in när de når 88 %-linjen.
       (Hero-rubriken undantas: den får sin scrub-parallax nedan.) */
    gsap.utils.toArray("[data-reveal]:not(.hero-title)").forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });

    /* LINE — de tunga reglarna ritas från vänster medan de korsar skärmen. */
    gsap.utils.toArray(".draw-rule").forEach(function (rule) {
      gsap.fromTo(rule, { scaleX: 0, transformOrigin: "left center" }, {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: rule, start: "top 95%", end: "top 55%", scrub: 0.5 }
      });
    });

    /* COLOR — gallerifältet färgstegras svart → signalrött i hårda steg
       (stepped ease = tryckta färgblock, inte smet). Vita texten på rött
       är samma AA-par som temat redan använder (bg-on-red 4.6:1). */
    gsap.fromTo("#galleri", { backgroundColor: "#0a0a0a" }, {
      backgroundColor: "#e11d48", ease: "steps(4)",
      scrollTrigger: { trigger: "#galleri", start: "top bottom", end: "top top", scrub: 1 }
    });

    /* ZOOM — porträttbilden landar i skärpan: 1.12 → 1 medan ramen kliver
       in. Skalaten sitter på bilden inuti ramen: vit kant + röd hållskugga
       på .portrait-slot påverkas aldrig. */
    gsap.fromTo("#om .portrait-slot img", { scale: 1.12 }, {
      scale: 1, ease: "none",
      scrollTrigger: { trigger: "#om .portrait-slot", start: "top bottom", end: "top 35%", scrub: 1 }
    });

    /* DRIFT — om-kolumnerna driver MOT varandra: texten sjunker, ramen
       stiger (scrub = de följer scrollbarnden hela vägen). */
    var omDrift = gsap.timeline({
      scrollTrigger: { trigger: "#om .about-grid", start: "top bottom", end: "bottom top", scrub: 1 }
    });
    omDrift.fromTo("#om .about-copy p", { y: -30 }, { y: 30, ease: "none" }, 0);
    omDrift.fromTo("#om .portrait-slot", { y: 26 }, { y: -26, ease: "none" }, 0);

    /* DRIFT — jättesiffrorna driver horisontelt medan korten staplas
       (ärvd ur gamla scroll-fx.js, nu scrub:ad hårdare). */
    document.querySelectorAll(".svc").forEach(function (card, i) {
      var num = card.querySelector(".svc-num");
      if (!num) { return; }
      gsap.fromTo(num, { x: i % 2 === 0 ? -24 : 24 }, {
        x: i % 2 === 0 ? 24 : -24, ease: "none",
        scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 1 }
      });
    });

    /* DRIFT — hero: rubriken lyfter, saxstickern gungar åt sidan.
       Stickerns x är ren transform; drag-fysiken i hero-drag.js använder
       translate-/rotate-egenskaperna — de kombineras utan konflikt. */
    gsap.fromTo(".hero-title", { y: 0 }, {
      y: -70, ease: "none",
      scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: 1 }
    });
    var sticker = document.querySelector("[data-hero-sticker]");
    if (sticker) {
      gsap.fromTo(sticker, { x: -14 }, {
        x: 34, ease: "none",
        scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: 1 }
      });
    }

    /* DRIFT — marquee-remsan fölfter scrollhastigheten utöver sin egen
       klockgång (förälderns transform, barnens CSS-animation rör ej). */
    gsap.fromTo(".marquee-inner", { x: 40 }, {
      x: -40, ease: "none",
      scrollTrigger: { trigger: ".marquee", start: "top bottom", end: "top top", scrub: 1 }
    });
  });

  /* ================ Desktop: PIN — Om-rubriken hålls hårt ================ */
  mm.add("(prefers-reduced-motion: no-preference) and (min-width: 701px)", function () {
    var pinT = ST.create({
      trigger: "#om",
      start: "top 64px",          /* hålls strax under den fasta headern */
      end: "bottom bottom",
      pin: "#om .section-head"     /* rubriken sitter stilla medan kopior +
                                      porträttet (drift + zoom) passerar under */
    });
    return function () { pinT.kill(); };
  });
})();
