/* 08 · Organiskt hantverk — scroll-koreografi (MC 10088, ägarens JS-regel 2026-10-05).
   GSAP + ScrollTrigger lokalt vendor (../_assets/vendor/) — ingen CDN, inga egna
   globals. All rörelse registreras ENDAST i (prefers-reduced-motion: no-preference):
   med reduce satt skapas noll triggers och alla element står redan i CSS i sitt
   synliga slutläge. Utan JS/bibliotek händer nada — innehållet är fullt läsbart.
   Denna fil ERSÄTTER js/stroke-draw.js (IntersectionObserver-engången, borttagen)
   och samlar sidans enda scrollmekanismer. */
(function () {
  'use strict';
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; }                        // biblioteken saknas → statisk sida
  g.registerPlugin(ST);

  var mm = g.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {

    /* 1 · LINJE (draw, scrubbad): de handritade strecken ritas med pennen —
           strokeDashoffset fölver scrollläget. Herostrichen ritas under de första
           skroll-tagen, alla övriga när sin rubrik/kort glider in. */
    g.utils.toArray('.underline path').forEach(function (path) {
      var svg = path.closest('svg');
      var hero = svg.closest('.hero');
      var len = path.getTotalLength();
      g.fromTo(path,
        { strokeDasharray: String(len), strokeDashoffset: len },
        {
          strokeDashoffset: 0, ease: 'none',
          scrollTrigger: {
            trigger: hero ? '.hero' : svg.closest('.headline') || svg.parentElement,
            start: hero ? 'top top' : 'top 92%',
            end: hero ? 'bottom 62%' : 'top 52%',
            scrub: true
          }
        });
    });

    /* 2 · FÄRG (scrubbad): jordfärgad ambient — papperstonen dras över hela
           sidan från ljust papper mot varmt linnetyg. */
    g.fromTo(document.body, { backgroundColor: '#f4efe6' }, {
      backgroundColor: '#efe8db', ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
    });

    /* 3 · ZOOM (scrubbad): porträtt och gallerifoton sätter sig (scale 1.14→1)
           under inträdet — zoomen verkar INUTI blobb-ramarna, så kant och form
           hålls orörda. */
    var portrait = document.querySelector('.portrait-frame__inner img');
    if (portrait) {
      g.fromTo(portrait, { scale: 1.14 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: '.portrait-frame', start: 'top bottom', end: 'top 30%', scrub: true }
      });
    }
    g.utils.toArray('.gallery-card__media img').forEach(function (img) {
      g.fromTo(img, { scale: 1.1 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: img.closest('.gallery-card'), start: 'top bottom', end: 'top 55%', scrub: true }
      });
    });

    /* 4 · DRIFT (scrubbard): botaniska lager driver MOT scrollen i två hastig-
           heter — hero-jordlagren (blobs) haltrar var sitt håll och våglinjerna
           glider sidledes under sitt eget CSS-ambientflöde (olika element, ingen
           konflikt). */
    var blobs = g.utils.toArray('.hero-blob');
    if (blobs[0]) {
      g.fromTo(blobs[0], { yPercent: 7 }, {
        yPercent: -9, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }
    if (blobs[1]) {
      g.fromTo(blobs[1], { yPercent: -6 }, {
        yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }
    g.utils.toArray('.wave-divider > svg').forEach(function (svg, i) {
      g.fromTo(svg, { xPercent: i % 2 ? -2 : 2 }, {
        xPercent: i % 2 ? 2 : -2, ease: 'none',
        scrollTrigger: { trigger: svg.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* 5 · MJUK ANDNING (ersätter stroke-draw.js IO): innehållsblock lyfter in
           ur underkanten — scrubbat, aldrig klockstyrt, aldrig dolt i slutläge. */
    g.utils.toArray('[data-reveal]').forEach(function (el) {
      g.fromTo(el, { opacity: 0, yPercent: 4 }, {
        opacity: 1, yPercent: 0, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 70%', scrub: true }
      });
    });
  });

  /* 6 · PIN: hantverkets porträtt hållet medan om-texten rinner förbi — endast
         på breda skärmar, utan extra sidomarginal (pinSpacing: false); ramen
         behåller sin blobb-form genom hela pinnet. */
  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 48rem)', function () {
    ST.create({
      trigger: '#om .om-grid', start: 'top 24%',
      endTrigger: '#om', end: 'bottom 68%',
      pin: '#om .portrait-frame', pinSpacing: false
    });
  });

  ST.refresh();
})();
