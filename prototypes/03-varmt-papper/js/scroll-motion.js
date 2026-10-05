/* 03 · Papper & sax — scroll-koreografi (MC 10088, ägarens JS-regel 2026-10-05).
   GSAP + ScrollTrigger lokalt vendor (../_assets/vendor/) — ingen CDN, inge-
   na egna globaler, allt i IIFE. All rörelse registreras ENDAST i
   (prefers-reduced-motion: no-preference): med reduce körs ingenting och
   allt står redan i CSS i sitt synliga slutläge. Utan JS/bibliotek händer
   nada — innehållet är fullt läsbart från start.
   Tidigare js/reveal.js (IO one-shot) och js/parallax.js (rAF-scroll) är
   nedlagda: samma rörelser drivs nu av ScrollTrigger — en motor per sak. */
(function () {
  'use strict';
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; }                      // biblioteken saknas → statisk sida
  g.registerPlugin(ST);

  var mm = g.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {

    /* 0 · Reveal (ärver js/reveal.js): one-shot per element, spelar när
           elementet glider in — "visa en gång, sedan lugnt". Startsänkan
           sätts av GSAP; utan JS finns den aldrig. */
    g.utils.toArray('[data-reveal]').forEach(function (el) {
      g.from(el, {
        opacity: 0, y: 14, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    /* 1 · Hairlinjer ritas fram från vänster (LINJE, scrubbar).
           Hero-nålen följer hela första vyn; en hår per sektion ritas när
           rubriken glider uppåt. */
    var heroRule = document.querySelector('.rule--terra');
    if (heroRule) {
      g.fromTo(heroRule, { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }
    g.utils.toArray('[data-draw-rule]:not([data-draw-ride])').forEach(function (rule) {
      g.fromTo(rule, { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: rule.closest('.section-head') || rule,
                         start: 'top 92%', end: 'top 45%', scrub: true }
      });
    });

    /* 2 · Papperstong + ambient skugga (FÄRG, scrubbad): ett fast tvätt-
           lager värms upp och skuggas mot sidans undre halva — pappret
           åldras mjukt under läsningen. */
    var wash = document.querySelector('.paper-tone');
    if (wash) {
      /* Alpisarna är satta så att även MÖRKASTA stoppet (tvätt + hörnskugga
         över papper) håller WCAG AA mot alla papperstexterna — se
         evidence/03-aa.py. Sage-ink (5.5:1 rent) binder: 4.6:1 i botten. */
      g.fromTo(wash,
        { backgroundColor: 'rgba(180, 95, 46, 0)',
          boxShadow: 'inset 0 0 140px rgba(94, 62, 34, 0)' },
        { backgroundColor: 'rgba(146, 88, 45, 0.08)',
          boxShadow: 'inset 0 0 210px rgba(70, 48, 28, 0.04)',
          ease: 'none',
          scrollTrigger: { trigger: document.body, start: 'top top',
                           end: 'bottom bottom', scrub: true } });
    }

    /* 3 · Zoom-sättning (ZOOM, scrubbar): gallerifoton glider in 1.07→1.0
           och porträttbilden 1.06→1.0 — beskuret inuti ramen, matte och
           dubbelhairline i porträttramen rör ej (zoom på bilden, ej ramen). */
    g.utils.toArray('.paper-frame .frame-media > img').forEach(function (img) {
      g.fromTo(img, { scale: 1.07 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: img.closest('.paper-frame'),
                         start: 'top bottom', end: 'top 40%', scrub: true }
      });
    });
    var portraitImg = document.querySelector('.portrait-img');
    if (portraitImg) {
      g.fromTo(portraitImg, { scale: 1.06 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: '.portrait', start: 'top bottom',
                         end: 'top 40%', scrub: true }
      });
    }

    /* 4 · Motdrift (DRIFT, scrubbar): matte-underlaget och ramen driver
           åt var sitt håll — samma andning som js/parallax.js gav, nu
           scrollbunden. Hero-nålen driver mjukt mot riktningen. */
    g.utils.toArray('[data-parallax-depth]').forEach(function (layer) {
      var depth = parseFloat(layer.getAttribute('data-parallax-depth')) || 0;
      g.fromTo(layer, { y: -36 * depth }, {
        y: 36 * depth, ease: 'none',
        scrollTrigger: { trigger: layer.closest('[data-parallax]') || layer.parentElement,
                         start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
    g.fromTo('.hero-mark', { y: 18 }, {
      y: -18, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    /* 5 · Nål-ögonblick under det klistrade Tjänster-huvudet (PIN): headen
           rider sektionen i CSS (sticky — fungerar även utan JS/rörelse som
           vanligt läge); här dras hairlinjen under huvudet kontinuerligt
           under hela färden, så infästningen syns som vilja, inte haveri. */
    var rideRule = document.querySelector('#tjanster .section-head [data-draw-ride]');
    if (rideRule) {
      g.fromTo(rideRule, { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: '#tjanster', start: 'top top',
                         end: 'bottom bottom', scrub: true }
      });
    }
  });

  ST.refresh();
}());
