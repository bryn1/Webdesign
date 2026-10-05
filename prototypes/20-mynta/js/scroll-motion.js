/* ============================================================
   MYNTA — tema 20 «Pixelhall» (MC 10088) — SCROLL-KOREOGRAFI
   GSAP 3.12.7 + ScrollTrigger lokalt vendor (../_assets/vendor/,
   ingen CDN). All scroll-rörelse registreras ENDAST i
   (prefers-reduced-motion: no-preference): med reduce skapas noll
   triggers och allt innehåll står redan i CSS i sitt synliga
   slutläge. Utan JS eller utan biblioteken är sidan stilla men
   fullt läsbar — ingen effekt bär information.
   Ingen egen global scope: allt i denna IIFE, trådat med defer.
   ============================================================ */
(function () {
  'use strict';
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; }                        /* saknas libs → statisk sida */
  g.registerPlugin(ST);

  var mm = g.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {

    /* 1 · MINNESSKRÄCK-FÄRG (FÄRG, scrubbad): sidotonen sjunker genom
           sidan — CRT-navy mot djupare arkadviol, som att kabinettet
           släcks ner medan spelet fortsätter. */
    g.fromTo(document.body, { backgroundColor: '#0b0d17' }, {
      backgroundColor: '#150d24', ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
    });

    /* 2 · LADDNINGSREGEL (LINJE, scrubbad per stage): pixelregeln under
           varje stagerubrik ritas fram i diskreta steg — stepped(16)
           bevarar pixelkänslan, ingen utjämnad linje. */
    g.utils.toArray('.stage-rule').forEach(function (rule) {
      g.fromTo(rule, { scaleX: 0 }, {
        scaleX: 1, ease: 'stepped(16)',
        scrollTrigger: { trigger: rule, start: 'top 92%', end: 'top 42%', scrub: true }
      });
    });
  });

  /* 3 · ATTRAKT-LÄGE (PIN, desktop): stage-head hos Galleri naglar fast
         som arkadskärmens rubrik medan high score-listan scrollar förbi,
         och rubriken skala-sätts under pinen (scrubbad). */
  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 721px)', function () {
    var head = document.querySelector('.stage-head--pin');
    var gal = document.getElementById('galleri');
    if (head && gal) {
      g.fromTo(head.querySelector('h2'), { scale: 0.97 }, {
        scale: 1, ease: 'none',
        scrollTrigger: {
          trigger: gal, start: 'top 100px', end: 'bottom 220px',
          pin: head, scrub: true
        }
      });
    }
  });

  mm.add('(prefers-reduced-motion: no-preference)', function () {

    /* 4 · HERO-PARALLAX (DRIFT, scrubbad, fyra distincta hastigheter):
           statusraden halkar efter, underrubriken seglar, namnet lyfter
           och INSERT COIN-drivern rusar — öppningsbandet 0→15 % svarar
           direkt på första scrollnoten (matt i evidence/20-band). */
    g.fromTo('.hero__status', { yPercent: 0 }, {
      yPercent: 60, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    g.fromTo('.hero__sub', { yPercent: 0 }, {
      yPercent: 26, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    g.fromTo('.hero__name', { yPercent: 0 }, {
      yPercent: -20, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    g.fromTo('.hero__press', { yPercent: 0 }, {
      yPercent: 100, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    /* 5 · BILDSPÄLLS-ZOOM (ZOOM, scrubbad): gallerifotonna faller in 1.12→1.0
           när skärmen kliver in i vyn — high score-tablan «skarps». */
    g.utils.toArray('.gallery .screen__inner img').forEach(function (img) {
      g.fromTo(img, { scale: 1.12 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: img.closest('.screen'), start: 'top 135%', end: 'top 45%', scrub: true }
      });
    });

    /* 6 · MYNTMÄTAREN (scrubbad, pixelsteg): progress-baren följer scrollen
           direkt via ScrollTrigger i 40 diskreta steg — ingen egen klocka
           eller scroll-lyssnare längre. */
    var bar = document.getElementById('progress-bar');
    if (bar) {
      g.fromTo(bar, { width: '0%' }, {
        width: '100%', ease: 'stepped(40)',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
      });
    }
  });

  ST.refresh();
})();
