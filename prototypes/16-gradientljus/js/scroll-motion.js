/* 16 · Gradientljus — scroll-koreografi (MC 10088, ägarens JS-regel 2026-10-05).
   GSAP + ScrollTrigger lokalt vendor (../_assets/vendor/) — ingen CDN, inga egna
   globals. All rörelse registreras ENDAST i (prefers-reduced-motion: no-preference):
   med reduce körs ingenting och allt står redan i CSS i sitt synliga slutläge.
   Utan JS/bibliotek händer nada — innehållet är fullt läsbart (default-visible). */
(function () {
  'use strict';
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; }                      // biblioteken saknas → statisk sida
  g.registerPlugin(ST);

  var mm = g.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {

    /* 1 · FÄRG: gradienttexten sveper 0→100 % genom hela sidan — ljusfältets
           position följer scrollflödet (scrubbad, kontinuerlig). */
    g.utils.toArray('.grad-text').forEach(function (el) {
      g.fromTo(el, { backgroundPosition: '0% 50%' }, {
        backgroundPosition: '100% 50%', ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
      });
    });

    /* 2 · DRIFT: mesh-lagen driver MOT varandra när hero:n försvinner uppåt —
           motriktad parallax scrubbad över hero-sektionen (tre lager, olika takter). */
    var layerDrift = [
      ['.mesh-layer--violet', { yPercent: 22, xPercent: -6 }],
      ['.mesh-layer--rose',   { yPercent: -14, xPercent: 8 }],
      ['.mesh-layer--blue',   { yPercent: 30, xPercent: -12 }]
    ];
    layerDrift.forEach(function (pair) {
      var el = document.querySelector(pair[0]);
      if (!el) { return; }
      g.fromTo(el, { yPercent: -pair[1].yPercent / 2, xPercent: -pair[1].xPercent / 2 }, {
        yPercent: pair[1].yPercent / 2, xPercent: pair[1].xPercent / 2, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
      /* mjus puls på samma lager — skala är en egen transform-kanal, så den
         kan samexistera med scroll-translationen ovan */
      g.to(el, {
        scale: el.classList.contains('mesh-layer--rose') ? 0.92 : 1.12,
        duration: 14 + pair[0].length, ease: 'sine.inOut', yoyo: true, repeat: -1
      });
    });

    /* 3 · FÄRG/ljusintensitet: sektionsglödet tänds .55→1 medan sektionen
           entrar (ersätter den borttagna CSS view()-timelinen — en mekanism). */
    g.utils.toArray('.section__glow').forEach(function (glow) {
      g.fromTo(glow, { opacity: 0.55 }, {
        opacity: 1, ease: 'none',
        scrollTrigger: { trigger: glow.parentElement, start: 'top bottom', end: 'top 40%', scrub: true }
      });
    });

    /* 4 · LINJE: ljushåren ritas fram scaleX 0→1 vid varje sektionsgräns (scrub). */
    g.utils.toArray('.light-rule').forEach(function (rule) {
      g.fromTo(rule, { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: rule.parentElement, start: 'top bottom', end: 'top 55%', scrub: true }
      });
    });

    /* 5 · ZOOM: gallerifoton landar 1.08→1.0 vid inträde och glider ut i 1.05
           (Ken Burns över scrollflöde, inte klocka — scrubbad). */
    g.utils.toArray('.gallery__tile img').forEach(function (img) {
      var tl = g.timeline({
        scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true }
      });
      tl.fromTo(img, { scale: 1.08 }, { scale: 1, ease: 'none', duration: 0.65 }, 0);
      tl.to(img, { scale: 1.05, ease: 'none', duration: 0.35 }, 0.65);
    });
  });

  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 721px)', function () {
    /* 6 · PINNAD ÖGONBLICK: ljusstrålen hålls stilla medan galleriet förbifarter
           (scrollTrigger pin), och svajar samtidigt 8 % x 8 grader scrubbat. */
    var beam = document.querySelector('.beam');
    if (!beam) { return; }
    var tl = g.timeline({
      scrollTrigger: {
        trigger: '#galleri', start: 'top top', end: '+=110%',
        scrub: true, pin: beam, pinSpacing: false
      }
    });
    tl.fromTo(beam, { x: -90, rotate: -6, opacity: 0.35 },
      { x: 90, rotate: 6, opacity: 0.7, ease: 'none' }, 0);
  });

  ST.refresh();
})();
