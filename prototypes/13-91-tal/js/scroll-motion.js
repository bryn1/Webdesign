/* 13 · 91-tal — scroll-koreografi (MC 10088, ägarens JS-regel 2026-10-05).
   GSAP + ScrollTrigger lokalt vendor (../_assets/vendor/) — ingen CDN.
   All rörelse registreras ENDAST i (prefers-reduced-motion: no-preference):
   med reduce satt körs ingenting och allt står redan i CSS i sitt synliga
   slutläge. Utan JS/bibliotek händer nada — innehållet är fullt läsbart. */
(function () {
  'use strict';
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; }                          // biblioteken saknas → statisk sida
  g.registerPlugin(ST);

  var mm = g.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {

    /* 1 · LINJE — tjocka bläckregler ritas fram från vänster, scrubbade
           per sektion: sidan fölverkadar direkt på scrollbar-rörelsen. */
    g.utils.toArray('.draw-rule').forEach(function (rule) {
      g.set(rule, { scaleX: 0 });
      g.to(rule, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: rule, start: 'top 92%', end: 'top 42%', scrub: true }
      });
    });

    /* 2 · FÄRG — papperet glider mint → varm gul över hela sidan (scrubbat).
           Bläkk #17171b klarar AA på båda ändarna: 13.3:1 → ca 15:1. */
    g.to(document.body, {
      backgroundColor: '#ffe3ad', ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
    });

    /* 3 · DRIFT — konfetiroterar och driver MOT scrollriktningen, jämn/udda
           former åt var sitt håll: dekorationslagret glider mot innehållet. */
    g.utils.toArray('.confetti').forEach(function (el, i) {
      var cs = getComputedStyle(el);
      var r0 = parseFloat(cs.getPropertyValue('--r0')) || -25;
      var r1 = parseFloat(cs.getPropertyValue('--r1')) || 155;
      var dir = (i % 2 === 0) ? 1 : -1;
      g.fromTo(el,
        { rotation: r0, yPercent: 42 * dir },
        {
          rotation: r1, yPercent: -58 * dir, ease: 'none',
          scrollTrigger: {
            trigger: el.closest('section') || el.parentElement,
            start: 'top bottom', end: 'bottom top', scrub: true
          }
        });
    });

    /* 4 · DRIFT (två lager) — Om-sektionen: text och porträtt drifter
           motvarigt mot varandra, tydlig parallax över ett viewport. */
    var omGrid = document.querySelector('.om-grid');
    if (omGrid) {
      var omTl = g.timeline({
        scrollTrigger: { trigger: omGrid, start: 'top bottom', end: 'bottom top', scrub: true }
      });
      omTl.fromTo('.om-text', { yPercent: 6 }, { yPercent: -6, ease: 'none' }, 0);
      omTl.fromTo('.portrait', { yPercent: -8 }, { yPercent: 10, ease: 'none' }, 0);
    }

    /* 5 · PIN — hero hålls stilla medan sidan scrollar vidare under den;
           namnblocket krymper långsamt under pinningen (scrubbat). */
    var heroName = document.querySelector('.hero-name');
    if (heroName) {
      g.fromTo(heroName, { scale: 1 }, {
        scale: 0.88, ease: 'none',
        scrollTrigger: {
          trigger: '.hero', start: 'top top', end: '+=70%',
          scrub: true, pin: true, pinSpacing: true
        }
      });
    }

    /* 6 · ZOOM — polaroiderna kliver in i 1.14 och zoom-sätter sig till 1:1
           medan de glider upp i vyn — scrubbat, inte klocka. */
    g.utils.toArray('.polaroid').forEach(function (frame) {
      var tilt = parseFloat(getComputedStyle(frame).getPropertyValue('--tilt')) || 0;
      g.set(frame, { rotation: tilt });               /* CSS-lutningen bevaras */
      g.fromTo(frame, { scale: 1.14 }, {
        scale: 1, ease: 'power1.in',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'top 42%', scrub: true }
      });
    });

    /* 7 · Sektionschipsen åker på plats med vrid — scrubbat klistermärkes-
           tempo som matchar temat. */
    g.utils.toArray('.head-chip').forEach(function (chip) {
      g.fromTo(chip, { rotation: -7, xPercent: -14, opacity: 0.35 }, {
        rotation: 0, xPercent: 0, opacity: 1, ease: 'power2.out',
        scrollTrigger: {
          trigger: chip.closest('.section') || chip.parentElement,
          start: 'top bottom', end: 'top 60%', scrub: true
        }
      });
    });
  });

  ST.refresh();
})();
