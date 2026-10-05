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
           brödtext träder in, rubrikernas bar-sweep spelas av GSAP. */
    g.utils.toArray('[data-reveal]').forEach(function (el) {
      g.from(el, {
        autoAlpha: 0, y: 16, duration: 0.6, ease: 'power1.out',
        scrollTrigger: { trigger: el, start: 'top 94%', once: true }
      });
    });
    g.utils.toArray('.sweep').forEach(function (el) {
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

    /* 5 · ZOOM: porträtt och gallerifoton slår an i överstorlek och lägger
           sig medan ramen vandrar upp genom vyn — bildrummen håller ramen. */
    ['.portrait', '#galleri .gallery-card:nth-child(1)', '#galleri .gallery-card:nth-child(2)',
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

    /* 6 · DRIFT: glödlagren driver MOT scrollriktningen — relativ förskjutning
           genom sektionen som känns bakom innehållet. */
    g.utils.toArray('.haze').forEach(function (haze, i) {
      g.fromTo(haze, { yPercent: i % 2 ? 16 : -18 }, {
        yPercent: i % 2 ? -16 : 18, ease: 'none',
        scrollTrigger: { trigger: haze.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
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
