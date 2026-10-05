/* scroll-motion.js — TEMA 09 "Rutinerat" (Schweizertåg): ALL scroll-rörelse
   i ETT enda GSAP/ScrollTrigger-lager (lokalt vendor i head, defer, IIFE —
   inga egna globaler). Ersätter CSS scroll-timeline-lagen i motion.css
   (döda på ägarens webbläsare) — CSS scroll-timeline är nu noll i temat.
   Triggers byggs ENDAST i gsap.matchMedias no-preference-gren: vid
   prefers-reduced-motion byggs noll triggers och sidan står i CSS-
   utgångsläget, allt synligt; utan JS händer ingenting — default-visible
   (innehåll är aldrig JS-beroende). Marquee-bandet är tidsstyrd CSS och
   bor i motion.css; dialog, kalender och formulär bor i main.js.
   Rörelseklasser — Schweizertåg: rörelsen är konstruerad, ej dekorativ:
   LINE  = progress-hårlinjen växer längs dokumentet och sektions-
           hårlinjerna ritas framåt från vänster kant under inrullningen;
   COLOR = gallerifältets papperston dras vit → ljus kyla över inrullningen
           (bläck och kobolt AA mot båda ändarna);
   ZOOM  = porträttet och arbetsproven faller till ro i sina rutor
           (1.08/1.12 → 1, skalan sitter på bilden INUTI cellen — kant
           och beskärning rörts inte vid);
   DRIFT = S—-räknarna i tjänsterastern och G—-räknarna under gallret
           glider med olika hastighet åt håll medan rutnätet står stilla;
   PIN   = "Före & efter"-rubriken hålls i rutnätet medan bildrutorna
           passerar — blott desktop. */
(function () {
  "use strict";
  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  if (!gsap || !ST) { return; }            /* vendor ej laddad — vila-läge */
  gsap.registerPlugin(ST);

  var mm = gsap.matchMedia();

  /* ================= Grundrörelser — alla skärmbredder (ej reduce) ======= */
  mm.add("(prefers-reduced-motion: no-preference)", function () {

    /* LINE — progress-hårlinjen 0 → 1 tvärs över hela dokumentet, scrubbad:
       den följer scrollbarnden. GSAP gör den synlig; utan JS/reduce ligger
       den dold — rent dekor, aldrig innehåll. */
    gsap.set(".progress", { display: "block", transformOrigin: "0 50%", scaleX: 0 });
    gsap.to(".progress", {
      scaleX: 1, ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.5 }
    });

    /* REVEAL — .rv lyfter 20 px när det når 88 %-linjen, blott en gång.
       Innehållet är synligt från början i CSS; detta är enbart rörelsen.
       Gallerrubriken undantas: den hålls fast av PIN (samma transform-ur). */
    gsap.utils.toArray(".rv").forEach(function (el) {
      if (el.closest(".hero") || el.id === "gal-h") { return; }
      gsap.fromTo(el, { y: 20 }, {
        y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });

    /* ENTRÉ — hero-anslaget lyfter in direkt (ingen scroll krävs). */
    gsap.fromTo(".hero .rv", { y: 16 }, {
      y: 0, duration: 0.55, stagger: 0.12, ease: "power2.out"
    });

    /* LINE — sektionshårlinjerna ritas framåt från vänster kant medan
       sektionsheadern korsar skärmen (scrub: linjen följer rullningen). */
    gsap.utils.toArray(".sec-head .rule").forEach(function (rule) {
      gsap.fromTo(rule, { scaleX: 0, transformOrigin: "left center" }, {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: rule, start: "top 95%", end: "top 55%", scrub: 0.6 }
      });
    });

    /* COLOR — gallerifältet dras vit → ljus kyla under inrullningen.
       Bläck 15:1 och kobolt >6:1 mot båda ändarna — AA hela vägen. */
    gsap.fromTo("#galleri", { backgroundColor: "#ffffff" }, {
      backgroundColor: "#f2f3f8", ease: "none",
      scrollTrigger: { trigger: "#galleri", start: "top bottom", end: "top top", scrub: 1 }
    });

    /* ZOOM — porträttbilden faller till ro: 1.08 → 1 medan cellen kliver
       in. Skalan sitter på bilden INUTI .portrait-media — kant, beskärning
       (object-position 25% 12%, ansiktet i bild) och bildrutorna rör ej. */
    gsap.fromTo("#om .portrait-media img", { scale: 1.08 }, {
      scale: 1, ease: "none",
      scrollTrigger: { trigger: "#om .portrait-media", start: "top bottom", end: "top 40%", scrub: 1 }
    });

    /* ZOOM — arbetsproven i gallret faller till ro i sina celler, 1.12 → 1,
       klippta av .gal-media — rutnätet står stilla, blott bilden skalar. */
    gsap.utils.toArray(".gal-media img").forEach(function (img) {
      gsap.fromTo(img, { scale: 1.12 }, {
        scale: 1, ease: "none",
        scrollTrigger: { trigger: img.closest(".gal-item"), start: "top bottom", end: "top 45%", scrub: 1 }
      });
    });

    /* DRIFT — S—-räknarna i tjänsterastern glider horisontellt mot varandra
       med olika hastighet per nummer (10, 15, 20 … px) medan sektionen
       passerar; korten själva står stilla i rutnätet. */
    gsap.utils.toArray(".svc-no").forEach(function (num, i) {
      var d = 10 + 5 * i;
      gsap.fromTo(num, { x: i % 2 === 0 ? -d : d }, {
        x: i % 2 === 0 ? d : -d, ease: "none",
        scrollTrigger: { trigger: "#tjanster", start: "top bottom", end: "bottom top", scrub: 1 }
      });
    });

    /* DRIFT — G—-räknarna under gallret driver vertikalt åt olika håll i
       olika takt per ruta medan galleriet rullar förbi. */
    gsap.utils.toArray(".gal-item figcaption .num").forEach(function (num, i) {
      var d = 6 + 4 * (i % 4);
      gsap.fromTo(num, { y: i % 2 === 0 ? -d : d }, {
        y: i % 2 === 0 ? d : -d, ease: "none",
        scrollTrigger: { trigger: "#galleri", start: "top bottom", end: "bottom top", scrub: 1 }
      });
    });
  });

  /* ============ Desktop: PIN — rubriken hålls medan gallret passerar ====== */
  mm.add("(prefers-reduced-motion: no-preference) and (min-width: 701px)", function () {
    var pinT = ST.create({
      trigger: "#galleri",
      start: "top 64px",              /* hålls strax under den fasta headern */
      end: "bottom bottom",
      pin: "#gal-h"                   /* "Före & efter" står stilla i rutnätet
                                         medan bildrutorna passerar */
    });
    return function () { pinT.kill(); };
  });
})();
