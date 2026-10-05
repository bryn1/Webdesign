/* 02 · Mörk neon — scroll-koreografi (MC 10088, JS-regeln 2026-10-05).
   GSAP + ScrollTrigger lokalt vendor (../_assets/vendor/) — ingen CDN,
   inga animation-timeline-deklarationer, ingen IO: EN enda scrollmotor.
   All rörelse registreras ENDAST i (prefers-reduced-motion: no-preference):
   med reduce är allt i sitt synliga grundläge och noll triggers skapas;
   utan JS/bibliotek händer nada — innehållet är fullt läsbart.
   Klassen .is-in sattes tidigare av reveal.js:ens IO — mekanismen är
   borttagen, reveal-tillstånden ägs här. */
(function () {
  'use strict';
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; }                       /* biblioteken saknas → statisk sida */
  g.registerPlugin(ST);
  var mm = g.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {

    /* 0 · Progress-hårstråd under headern: skalas med sidans scroll (scrub). */
    g.fromTo('.scroll-progress', { scaleX: 0 }, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: true }
    });

    /* 1 · Öppningen svarar direkt: neonrubriken slocknar och hero-kopian
           lyfter ur vyn under den första viewporten (färg + ton). */
    g.fromTo('.hero .container', { yPercent: 0, autoAlpha: 1 }, {
      yPercent: -9, autoAlpha: 0.2, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    g.fromTo('.hero h1', {
      textShadow: '0 0 18px rgba(200,245,66,.55), 0 0 52px rgba(200,245,66,.28)'
    }, {
      textShadow: '0 0 2px rgba(200,245,66,0), 0 0 4px rgba(200,245,66,0)', ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 30%', scrub: true }
    });

    /* 2 · LINJE/JÄMN: neonstrecken ritas framåt — hjälregeln från scrollnoll
           så sidan reagerar på första scrollnotchen, sektionerna när de glider in. */
    g.fromTo('.hero-rule', { scaleX: 0 }, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'top -38%', scrub: true }
    });
    g.utils.toArray('.neon-rule').forEach(function (rule) {
      g.fromTo(rule, { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: rule, start: 'top 96%', end: 'top 66%', scrub: true }
      });
      /* glöden dras upp över samma sträcka som draget — skylten tänds */
      g.fromTo(rule,
        { boxShadow: '0 0 2px rgba(200,245,66,.08)' },
        { boxShadow: '0 0 16px rgba(200,245,66,.75)', ease: 'none',
          scrollTrigger: { trigger: rule, start: 'top 96%', end: 'top 56%', scrub: true } });
    });

    /* 3 · FÄRG: den mörka grunden värms en aning medan sektionen vandrar
           genom vyn — lysrörs-svarta mot en djup varmton, aldrig ljus. */
    g.utils.toArray('#tjanster, #galleri, #kontakt').forEach(function (sec) {
      g.fromTo(sec, { backgroundColor: '#0c0a09' }, {
        backgroundColor: '#16130b', ease: 'none',
        scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* 4 · REVIVAL (ersätter reveal.js:ens IntersectionObserver):
           brödtext träder in, hero-rubrikernas bar-sweep spelas av GSAP. */
    g.utils.toArray('[data-reveal]').forEach(function (el) {
      g.from(el, {
        autoAlpha: 0, y: 16, duration: 0.6, ease: 'power1.out',
        scrollTrigger: { trigger: el, start: 'top 94%', once: true }
      });
    });
    g.utils.toArray('.hero .sweep').forEach(function (el) {
      var bar = el.querySelector('.sweep__bar');
      var txt = el.querySelector('.sweep__text');
      var tl = g.timeline({ paused: true });
      /* fromTo med immediateRender döljer direkt; ScrollTrigger spelar tim
         linjen en gång via onEnter — timlinjen ärs sin egen playhead. */
      if (txt) { tl.fromTo(txt, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, 0.18); }
      if (bar) {
        tl.fromTo(bar, { xPercent: -101 },
          { xPercent: 0, duration: 0.28, ease: 'power2.in' }, 0)
          .to(bar, { xPercent: 101, duration: 0.32, ease: 'power2.out' });
      }
      ST.create({
        trigger: el, start: 'top 94%', once: true,
        onEnter: function () { tl.play(); }
      });
    });

    /* 4b · RUBRIKER per rad, scrubbat: neonbaren dras framåt och TEXTEN
           tänds FÖRST NÄR BAREN ÄR UTE — bakåt spelas raden av.
           DENSITY-FIX-01 (AA): förr hann textens opacity bli 1 vid 'top 58%'
           medan baren fortfarande svepte fram till 'top 50%' → vitt rubrik-
           text på neonbaren mättes till ~1.2:1 i ett vilande mittläge.
           Nu: baren är helt utanför rubrikboxen (klippt av .sweep) vid
           'top 62%' och texten börjar tändas först vid 'top 50%', full
           opacity vid 'top 38%' — vid varje opacity > 0 är baren borta. */
    g.utils.toArray('.section:not(.hero) .sweep').forEach(function (head) {
      var bar = head.querySelector('.sweep__bar');
      var txt = head.querySelector('.sweep__text');
      if (bar) {
        g.fromTo(bar, { xPercent: -101 }, {
          xPercent: 101, ease: 'none',
          scrollTrigger: { trigger: head, start: 'top 96%', end: 'top 62%', scrub: true }
        });
      }
      if (txt) {
        g.fromTo(txt, { autoAlpha: 0 }, {
          autoAlpha: 1, ease: 'none',
          scrollTrigger: { trigger: head, start: 'top 50%', end: 'top 38%', scrub: true }
        });
      }
    });
    /* ögonbrynen glider ut från sina neonregler */
    g.utils.toArray('.section:not(.hero) .eyebrow').forEach(function (eyebrow) {
      g.fromTo(eyebrow, { x: -26, autoAlpha: 0 }, {
        x: 0, autoAlpha: 1, ease: 'none',
        scrollTrigger: { trigger: eyebrow, start: 'top 94%', end: 'top 62%', scrub: true }
      });
    });

    /* 5 · ZOOM: porträttet Ken Burns 1→1,05 med långsam sidodrift genom
           hela passagen; gallerifotonen lägger sig från överstorlek. */
    var pimg = document.querySelector('.portrait img');
    if (pimg) {
      g.fromTo(pimg, { scale: 1, x: 14 }, {
        scale: 1.05, x: -14, ease: 'none',
        scrollTrigger: { trigger: '.portrait', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }
    ['#galleri .gallery-card:nth-child(1)', '#galleri .gallery-card:nth-child(2)',
     '#galleri .gallery-card:nth-child(3)', '#galleri .gallery-card:nth-child(4)'
    ].forEach(function (sel, i) {
      var frame = document.querySelector(sel);
      var media = frame && frame.querySelector('img');
      if (!media) { return; }
      g.fromTo(media, { scale: 1.1 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'top ' + (58 - i * 5) + '%', scrub: true }
      });
    });

    /* 6 · DRIFT: glödlagren driver MOT scrollriktningen i olika långsam
           takt — och deras glöd stiger och sjunker genom bandet. */
    g.utils.toArray('.haze').forEach(function (haze, i) {
      var amp = 14 + i * 7;
      g.fromTo(haze, { yPercent: i % 2 ? amp : -amp }, {
        yPercent: i % 2 ? -amp : amp, ease: 'none',
        scrollTrigger: { trigger: haze.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
      g.to(haze, {
        keyframes: { opacity: [0.45, 1, 0.45] }, ease: 'none',
        scrollTrigger: { trigger: haze.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
    /* hårfinta neonnät + scanlines gattar emot scrollen */
    g.utils.toArray('.neon-grid').forEach(function (grid, i) {
      g.fromTo(grid, { yPercent: i % 2 ? -12 : 12 }, {
        yPercent: i % 2 ? 12 : -12, ease: 'none',
        scrollTrigger: { trigger: grid.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
    g.fromTo('.scanlines', { y: 0 }, {
      y: -60, ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: true }
    });

    /* 6b · DRIFT i tre+ hastigheter: mörka kort, listor och rutor glider
           med olika långsam takt genom sektionen — många element samtidigt.
           (Tjänster-korten tappade data-reveal: entrén spelas nu här, scrub.) */
    function drift(el, from, to, trig) {
      g.fromTo(el, { y: from }, {
        y: to, ease: 'none',
        scrollTrigger: { trigger: trig || el, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }
    drift('#om .split > div', -24, 24, '#om');
    drift('.portrait', 30, -30, '#om');
    g.utils.toArray('#tjanster .service-card').forEach(function (card, i) {
      drift(card, 34 - i * 12, -34 + i * 12, '#tjanster');
      g.fromTo(card, { autoAlpha: 0 }, {
        autoAlpha: 1, ease: 'none',
        scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 60%', scrub: true }
      });
    });
    g.utils.toArray('#galleri .gallery-card').forEach(function (card, i) {
      drift(card, 26 - i * 10, -26 + i * 10, '#galleri');
    });
    g.utils.toArray('#kontakt .contact-list li').forEach(function (li, i) {
      drift(li, 26 - i * 11, -26 + i * 11, '#kontakt');
    });
    drift('#kontakt .contact-form', -18, 18, '#kontakt');
    /* Boka: tidrutnätet driver och korten studsar in i stagger — scrubbat */
    g.utils.toArray('.cal-day').forEach(function (dayEl, d) {
      drift(dayEl.querySelector('.cal-slots'), 18 - d * 9, -18 + d * 9, dayEl);
      g.timeline({
        scrollTrigger: { trigger: dayEl, start: 'top 92%', end: 'top 48%', scrub: true }
      }).fromTo(dayEl.querySelectorAll('.slot'), { y: 16, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, ease: 'none', stagger: 0.08 });
    });
    /* footer: kolumnerna stiger in i stagger medan foten glider fram */
    g.timeline({
      scrollTrigger: { trigger: '.site-footer', start: 'top bottom', end: 'top 55%', scrub: true }
    }).fromTo('.footer-inner > div', { y: 48, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, ease: 'none', stagger: 0.16 });

    /* 6c · CTA-påstar och märken bobbar långsamt med scrollen — scrubbat,
           ingen timer;stillastående sida utan JS/gsap ser dem i vila. */
    g.to('.nav-cta', {
      keyframes: { y: [0, -5, 0, 5, 0] }, ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: true }
    });
    g.utils.toArray('.hero-actions .btn').forEach(function (btn, i) {
      g.to(btn, {
        keyframes: { y: [0, i ? 8 : -8, 0, i ? -8 : 8, 0] }, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    });
    g.utils.toArray('.gallery-btn').forEach(function (btn, i) {
      g.to(btn, {
        keyframes: { y: [0, i ? 7 : -7, 0, i ? -7 : 7, 0] }, ease: 'none',
        scrollTrigger: { trigger: '#galleri', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
    g.utils.toArray('.demo-badge').forEach(function (badge) {
      g.to(badge, {
        keyframes: { y: [0, 6, 0, -6, 0] }, ease: 'none',
        scrollTrigger: {
          trigger: badge.closest('.section'), start: 'top bottom', end: 'bottom top', scrub: true
        }
      });
    });
    g.to('.scroll-hint', {
      keyframes: { x: [0, 14, 0] }, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 40%', scrub: true }
    });
  });

  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 560px)', function () {
    /* 7 · PIN: neonskylten i Galleri hålls stilla medan bildbandet rinner
           förbi under den — och glöden dras upp under samma sträcka. */
    var frame = document.querySelector('.neon-frame');
    if (!frame) { return; }
    var sign = frame.querySelector('.neon-sign');
    ST.create({
      trigger: frame, start: 'top 22%',
      endTrigger: '.gallery-scroller', end: 'bottom 76%',
      pin: frame, pinSpacing: false
    });
    if (sign) {
      g.fromTo(sign, {
        textShadow: '0 0 6px rgba(200,245,66,.35), 0 0 16px rgba(200,245,66,.12)',
        boxShadow: '0 0 6px rgba(200,245,66,.18), inset 0 0 4px rgba(200,245,66,.06)'
      }, {
        textShadow: '0 0 14px rgba(200,245,66,.9), 0 0 44px rgba(200,245,66,.5)',
        boxShadow: '0 0 26px rgba(200,245,66,.55), inset 0 0 14px rgba(200,245,66,.25)',
        ease: 'none',
        scrollTrigger: {
          trigger: frame, start: 'top 22%',
          endTrigger: '.gallery-scroller', end: 'bottom 76%', scrub: true
        }
      });
    }
  });

  ST.refresh();
})();
