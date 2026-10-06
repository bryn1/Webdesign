/* 15 · Sagan om klippet — scroll-koreografi (MC 10088, ägarens JS-regel 2026-10-05).
   GSAP + ScrollTrigger från ../_assets/vendor/ (lokalt vendor, ingen CDN).
   All rörelse registreras ENDAST i (prefers-reduced-motion: no-preference):
   med reduce satt körs noll triggers och allt står redan i CSS i sitt synliga
   slutläge — våglinjerna fullt ritade, aldrig osynliga. Utan JS eller utan
   biblioteken händer ingenting: sidan förblir en statisk bilderbok. */
(function () {
  'use strict';
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; }                       /* biblioteken saknas → statisk bok */
  g.registerPlugin(ST);

  var mm = g.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {

    /* 1 · LINJE — varje kapitels våglinje ritas framåt när kapitlet glider
           in i vyn, scrubbat: berättelsen går verkligen framåt för varje
           tag. pathLength="1" gör streckmåttet enhetligt. Samma mönster
           klär hjärtbladets marklinje, som ritar upp sig vid uppslaget. */
    g.utils.toArray('.squiggle path').forEach(function (path) {
      g.set(path, { strokeDasharray: 1 });
      g.from(path, {
        strokeDashoffset: 1, ease: 'none',
        scrollTrigger: { trigger: path.closest('svg'), start: 'top 92%', end: 'top 40%', scrub: true }
      });
    });
    var lineart = document.querySelector('.hero-art .lineart');
    if (lineart) {
      g.set(lineart, { strokeDasharray: 1, strokeDashoffset: 1 });
      g.to(lineart, { strokeDashoffset: 0, duration: 1.4, delay: 0.25, ease: 'power1.inOut' });
    }

    /* 2 · DRIFT — hjälteuppslaget: textkolumnen och illustrationen driver
           åt varsitt håll över scrollen, som två lösa sida på bordet. */
    var heroCopy = document.querySelector('.hero-copy');
    var heroArt = document.querySelector('.hero-art');
    if (heroCopy && heroArt) {
      var heroTl = g.timeline({
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
      heroTl.fromTo(heroCopy, { yPercent: 9 }, { yPercent: -9, ease: 'none' }, 0);
      heroTl.fromTo(heroArt, { yPercent: -13 }, { yPercent: 13, ease: 'none' }, 0);
    }

    /* 3 · DRIFT (detaljer) — hjärtbladets småillustrationer flyter mot
           var sitt håll: gnistor, sax och lockar svävar i sidan. */
    g.utils.toArray('.hero-art use').forEach(function (u, i) {
      var dir = (i % 2 === 0) ? 1 : -1;
      g.fromTo(u, { yPercent: 10 * dir }, {
        yPercent: -10 * dir, ease: 'none',
        scrollTrigger: { trigger: heroArt || '.hero', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* 4 · FÄRG — papprets värme glider rosa → varm sand genom hela boken,
           scrubbat kapitel för kapitel. Bläkk #1d2340 håller AA hela resan
           (13,3:1 på startrosa, ~12,5:1 på varmaste botten). Sidhuvudet
           följer med så pappret inte spricker i två nyanser. */
    var bgTl = g.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: 'main', start: 'top bottom', end: 'bottom bottom', scrub: true }
    });
    bgTl.to('body', { backgroundColor: '#ffe7d2' }, 0.45)
        .to('.site-head', { backgroundColor: '#ffe7d2' }, 0.45)
        .to('body', { backgroundColor: '#ffe0c0' }, 0.55)
        .to('.site-head', { backgroundColor: '#ffe0c0' }, 0.55);

    /* 5 · PIN + ZOOM — sidvändningen: den nålade bildens ram hålls stilla
           medan texten rullar förbi, och bilden i ramen sjunker på plats
           (rotera + skala, scrubbat) som när ett uppslag faller till ro.
           Endast på breda skärmar, där ramen står vid sidan av texten. */
    var stage = document.querySelector('.story-stage');
    var stageArt = document.querySelector('.stage-art');
    var storyGrid = document.querySelector('.story-grid');
    if (stage && stageArt && storyGrid) {
      g.fromTo(stageArt, { rotate: -2.4, scale: 1.06 }, {
        rotate: 0, scale: 1, ease: 'none',
        scrollTrigger: {
          trigger: storyGrid, start: 'top 110px', end: 'bottom bottom',
          scrub: true, pin: stage, pinSpacing: false
        }
      });
    }

    /* 6 · DRIFT + ZOOM — tjänstekorten: ikonillustrationen svävar mot
           scrollriktningen (jämn/udda åt var sitt håll) medan kortet
           självt glider in och zoom-sätter sig. Kortens reveal är samma
           tween (transformen ägs av ett anfall, inte två). */
    g.utils.toArray('.svc').forEach(function (card, i) {
      var ic = card.querySelector('svg');
      if (ic) {
        var dir = (i % 2 === 0) ? 1 : -1;
        g.fromTo(ic, { yPercent: 16 * dir }, {
          yPercent: -16 * dir, ease: 'none',
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      }
      g.fromTo(card, { opacity: 0, yPercent: 14, scale: 1.05 }, {
        opacity: 1, yPercent: 0, scale: 1, ease: 'power2.out', clearProps: 'transform,opacity',
        scrollTrigger: { trigger: card, start: 'top bottom', end: 'top 45%', scrub: true }
      });
    });

    /* 7 · reveal + (560px+) ZOOM — illustrationsplattorna glider in; på
           bredd som har marginal runt plattorna kliver de dessutom in i
           1.12 och zoom-sätter sig till 1:1 — scrubbat, inte klocka. I
           fickformat skalas inte: 1,12 × helkolumn skulle sticka utanför
           sidan (hOverflow). När zoomen är klar lämnas transformen till
           CSS — hover lever vidare. */
    g.utils.toArray('.plate').forEach(function (plate) {
      g.fromTo(plate, { opacity: 0, yPercent: 12 }, {
        opacity: 1, yPercent: 0, ease: 'power2.out',
        scrollTrigger: { trigger: plate, start: 'top 92%', end: 'top 40%', scrub: true }
      });
    });

    /* 8 · ROLL-KÖ — reveals: innehållet glider in i sina slutlägen medan
           dess egen sektion rullar in (scrubbat). Ett enda mechanism för
           reveal — ersätter de tidigare en-gångs-observationerna. Kort och
           plattor har sin reveal i punkt 6–7 (samma transform, ett anfall). */
    g.utils.toArray('[data-reveal]').forEach(function (el) {
      g.fromTo(el, { opacity: 0, yPercent: 12 }, {
        opacity: 1, yPercent: 0, ease: 'power2.out', clearProps: 'transform,opacity',
        scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 55%', scrub: true }
      });
    });
  });

  /* 7b · ZOOM (560px+) — plattornas zoom-sättning lever i eget
         matchMedia-gren: i fickformat skalas inte helkolumnen utanför
         sidan. Grenen är också villkorslöstreduce-säker. */
  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 560px)', function () {
    g.utils.toArray('.plate').forEach(function (plate) {
      g.fromTo(plate, { scale: 1.12 }, {
        scale: 1, ease: 'power2.out',
        scrollTrigger: { trigger: plate, start: 'top bottom', end: 'top 40%', scrub: true }
      });
    });
  });

  ST.refresh();
})();
