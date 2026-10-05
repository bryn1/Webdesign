/* 05 · Mjuk glas — scroll-koreografi (MC 10088, ägarens JS-regel 2026-10-05).
   GSAP + ScrollTrigger lokalt vendor (../_assets/vendor/) — ingen CDN, inge-
   na egna globaler, allt i IIFE. All rörelse registreras ENDAST i
   (prefers-reduced-motion: no-preference): med reduce körs ingenting och
   allt står redan i CSS i sitt synliga slutläge. Utan JS/bibliotek händer
   nada — innehållet är fullt läsbart från start.
   Tidigare js/enhance.js (IO-reveal), js/parallax.js (rAF-scroll) och
   CSS-view-tidslinjen/galleri-IO:n är nedlagda: samma rörelser drivs nu
   av ScrollTrigger — en motor per sak. */
(function () {
  'use strict';
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; }                      // biblioteken saknas → statisk sida
  g.registerPlugin(ST);

  var mm = g.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {

    /* 0 · Reveal (ärver js/enhance.js): one-shot per element när den glider
           in. GSAP sätter startsänkan; utan JS finns den aldrig. */
    g.utils.toArray('[data-reveal]').forEach(function (el) {
      g.from(el, {
        opacity: 0, y: 16, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    /* 1 · GLASHÅRLINJER ritas fram från vänster (LINJE, scrubbar): en mjuk
           hairline per sektion — "linjen växer fram under läsningen". */
    g.utils.toArray('.rule-glass').forEach(function (rule) {
      g.fromTo(rule, { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: rule, start: 'top 92%', end: 'top 52%', scrub: true }
      });
    });

    /* 2 · FROSTTÖNG (FÄRG, scrubbad): ett fast tvättlager bakom allt innehåll
           svalnar mot mist i toppen och värms mot rosaton längst ner — glas-
           fältet skiftar ton under färden. Alfan håller sig låg så att all
           text klarar WCAG AA även vid mörkaste stoppet (evidence/05-aa.py). */
    var tone = document.querySelector('.frost-tone');
    if (tone) {
      g.fromTo(tone,
        { backgroundColor: 'rgba(167, 188, 195, 0)',
          boxShadow: 'inset 0 0 160px rgba(125, 90, 84, 0)' },
        { backgroundColor: 'rgba(201, 167, 160, 0.10)',
          boxShadow: 'inset 0 0 220px rgba(125, 90, 84, 0.05)',
          ease: 'none',
          scrollTrigger: { trigger: document.body, start: 'top top',
                           end: 'bottom bottom', scrub: true } });
    }

    /* 3 · ZOOM-SÄTTNING (ZOOM, scrubbar): bilder landar 1.06–1.08→1.0 inuti
           sina glasramar — ramen och dess blur/frost rör ej (zoom på bilden,
           ej glaskortet), tjänsterkorten sjunker in med lätt skala = djup. */
    var portraitImg = document.querySelector('.portrait-frame img');
    if (portraitImg) {
      g.fromTo(portraitImg, { scale: 1.06 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: '.portrait-frame', start: 'top bottom',
                         end: 'top 45%', scrub: true }
      });
    }
    g.utils.toArray('.gallery-card__media img').forEach(function (img) {
      g.fromTo(img, { scale: 1.08 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: img.closest('.gallery-card'),
                         start: 'top bottom', end: 'top 60%', scrub: true }
      });
    });
    g.utils.toArray('.service-card').forEach(function (card) {
      g.fromTo(card, { scale: 1.03, y: 16 }, {
        scale: 1, y: 0, ease: 'none',
        scrollTrigger: { trigger: card.closest('li') || card,
                         start: 'top bottom', end: 'top 55%', scrub: true }
      });
    });

    /* 4 · GLASDRIFT (DRIFT, scrubbar) — tematikens signatur: bakgrundskladdar-
           na driver mot var sitt håll (data-speed, ärver js/parallax.js) och
           textkolumnen driver mot porträttglaskortet — djup i glaset. X-axeln
           på innehållslagen vald fri av reveal:ns y-sänk — ingen egenskap
           konkurrerar). */
    g.utils.toArray('[data-speed]').forEach(function (blob) {
      var speed = parseFloat(blob.getAttribute('data-speed')) || 0;
      g.fromTo(blob, { y: 0 }, {
        y: function () {
          return (document.body.scrollHeight - window.innerHeight) * speed;
        },
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top',
                         end: 'bottom bottom', scrub: true,
                         invalidateOnRefresh: true }
      });
    });
    g.fromTo('.om-text', { x: 8 }, {
      x: -8, ease: 'none',
      scrollTrigger: { trigger: '#om', start: 'top bottom',
                       end: 'bottom top', scrub: true }
    });
    g.fromTo('.portrait-frame', { x: -14 }, {
      x: 14, ease: 'none',
      scrollTrigger: { trigger: '#om', start: 'top bottom',
                       end: 'bottom top', scrub: true }
    });

    /* 5 · GALLERIKORTEN "närmar sig" (ZOOM/djup, scrubbar): korten sväller
           mot 1.0 i rullarens mitt och drar tillbaka sig vid kanten — samma
           rörelse som det nedlagda CSS-view-fallet/IO-fallbacket gav, nu scroll-
           driven i webbläsaren. Trigger: kortet i den HORISENTELLA rullaren. */
    var scroller = document.querySelector('[data-gallery-scroller]');
    if (scroller) {
      g.utils.toArray('.gallery-card').forEach(function (card) {
        var tl = g.timeline({
          scrollTrigger: {
            trigger: card, scroller: scroller, horizontal: true,
            start: 'left right', end: 'right left', scrub: 0.6
          }
        });
        tl.fromTo(card, { scale: 0.9 }, { scale: 1, ease: 'power1.inOut', duration: 1 }, 0)
          .to(card, { scale: 0.9, ease: 'power1.inOut', duration: 1 }, 1);
      });
    }
  });

  /* PINNAT FROSTÖGONBLICK (PIN): gallerirubriken fryser fast under sidhu-
     vudet och kläs i frost medan galleriet rullar förbi — sektionens lugna
     landning. Endast på bred skärm och utan reduced motion; utan JS/pin är
     rubriken ett vanligt block. */
  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 760px)', function () {
    var head = document.querySelector('.galleri-head');
    if (!head) { return; }
    var pin = ST.create({
      trigger: head,
      start: 'top 84px',
      end: '+=600',
      pin: head,
      toggleClass: { targets: head, className: 'is-frozen' }
    });
    g.fromTo(head,
      { backgroundColor: 'rgba(247, 248, 244, 0)' },
      { backgroundColor: 'rgba(247, 248, 244, 0.72)', ease: 'none',
        scrollTrigger: { trigger: '#galleri', start: 'top 84px',
                         end: '+=120', scrub: true } });
    return function () { pin.kill(); };
  });

  ST.refresh();
}());
