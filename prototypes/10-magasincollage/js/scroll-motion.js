/* 10 · Magasincollage — scroll-koreografi (MC 10088, ägarens JS-regel 2026-10-05).
   GSAP + ScrollTrigger lokalt vendor (../_assets/vendor/) — ingen CDN, inga egna
   globals. All rörelse registreras ENDAST i (prefers-reduced-motion: no-preference):
   med reduce satt skapas noll triggers och allt står redan i CSS i sitt synliga
   slutläge. Utan JS/bibliotek händer nada — kollaget är ett vanligt rutnät.
   Denna fil ERSÄTTER scrollmekanikerna i js/collage.js (rAF-parallaxen och
   IntersectionObserver-konturbytet, borttagna); drag-interaktionen (icke-scroll)
   bor kvar där. Ritningen styrs via CSS-var (--py/--dx/--dy) så att kortens
   rotation (--rot) aldrig räknas om. */
(function () {
  'use strict';
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; }                        // biblioteken saknas → statisk sida
  g.registerPlugin(ST);

  var root = document.documentElement;
  var mm = g.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {
    /* Tänder collage-läget i CSS (samma spärr som tidigare collage.js). */
    root.setAttribute('data-motion', 'on');

    /* 1 · RIVLINJE (draw, scrubbad): den taggade rivkanten ritas från vänster
           till höger medan sin sektion glider in — papper rivs, inget klipps.
           Hjältets linje ritas under de första skroll-tagen (sektionen står
           redan i toppen vid load), alla övriga vid sektionens inträde. */
    g.utils.toArray('.tear-rule path').forEach(function (path) {
      var svg = path.closest('svg');
      var len = path.getTotalLength();
      var hero = svg.closest('#top');
      g.set(path, { strokeDasharray: String(len), strokeDashoffset: len });
      g.to(path, {
        strokeDashoffset: 0, ease: 'none',
        scrollTrigger: hero
          ? { trigger: '#top', start: 'top top', end: 'bottom 60%', scrub: true }
          : { trigger: svg.closest('section') || svg.parentElement,
              start: 'top 88%', end: 'top 32%', scrub: true }
      });
    });

    /* 2 · PAPPERSTON (color, scrubbad): sidans botten dras från färskt cream
           mot mörknat tidningspapper genom hela Bläddringen. */
    g.fromTo(document.body, { backgroundColor: '#fbf7f2' }, {
      backgroundColor: '#f3ece2', ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
    });

    /* 3 · ZOOM (scrubbad): urklippen sätter sig — porträtt och kollagefoton
           går från 1.14→1 inuti sina tejpade ramar, kant och rotation orörda. */
    var portraitImg = document.querySelector('.portrait-frame img');
    if (portraitImg) {
      g.fromTo(portraitImg, { scale: 1.14 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: '.portrait-card', start: 'top bottom', end: 'top 30%', scrub: true }
      });
    }
    g.utils.toArray('.postcard img').forEach(function (img) {
      g.fromTo(img, { scale: 1.08 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: img.closest('.postcard'), start: 'top bottom', end: 'top 55%', scrub: true }
      });
    });

    /* 4 · KONTURBYTE (ersätter collage.js:s IntersectionObserver): display-
           rubrikerna klipps till kontur medan de står mitt i synfältet och
           återgår till solid — samma band som tidigare (-28 %/-28 %). */
    g.utils.toArray('[data-outline]').forEach(function (el) {
      ST.create({
        trigger: el, start: 'top 72%', end: 'bottom 28%',
        toggleClass: { className: 'is-outline', targets: el },
        toggleActions: 'add remove remove add'
      });
    });
  });

  /* 5 · MOTDRIFT (scrubbad, bara bred skärm): lösa urklipp — hero-omslagen
         och kollagekorten — driver mot scrollen på var sin hastighet
         (data-speed). Rotationsbevarat: GSAP skriver bara --py, CSS:n behåller
         --rot i transform-uttrycket. */
  /* 6 · PIN (bred skärm): omslagets omslagsrubrik hålls stilla medan sidan
         rinner under den och de lösa klippna driver förbi — tidningens enda
         fastnade stund. pinSpacing (default) lägger in platsen efteråt, så
         omslaget aldrig glider ner över nästa sektion vid släppet. */
  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 900px)', function () {
    ST.create({
      trigger: '#top', start: 'top 80px', end: 'bottom 42%',
      pin: '.hero-shell'
    });
    g.utils.toArray('[data-speed]').forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-speed')) || 0;
      if (!speed) return;
      var hero = el.classList.contains('hero-float');
      var swing = (hero ? 220 : 260) * speed;
      g.fromTo(el, { '--py': (-swing) + 'px' }, {
        '--py': swing + 'px', ease: 'none',
        scrollTrigger: hero
          ? { trigger: '#top', start: 'top top', end: 'bottom top', scrub: true }
          : { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  });

  ST.refresh();
})();
