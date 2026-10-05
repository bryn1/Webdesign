/* 17 · Mörka akademien — scroll-koreografi (MC 10088, JS-regeln 2026-10-05).
   GSAP + ScrollTrigger lokalt vendor (../_assets/vendor/) — ingen CDN, inga
   animation-timeline-deklarationer, ingen IO-fallback: EN enda motor.
   All rörelse registreras ENDAST i (prefers-reduced-motion: no-preference):
   med reduce satt körs ingenting och allt står i sitt synliga grundläge;
   utan JS/bibliotek händer nada — innehållet är fullt läsbart. */
(function () {
  'use strict';
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; }                     // biblioteken saknas → statisk sida
  g.registerPlugin(ST);

  var mm = g.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {

    /* 0 · Öppningen svarar direkt: hero lyfter/tonas ur under första
           viewporten, och hjältets pennstreck ritas från scrollnoll. */
    g.fromTo('.hero-inner', { yPercent: 0, autoAlpha: 1 }, {
      yPercent: -12, autoAlpha: 0.25, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    g.fromTo('.hero-mark', { y: 0, rotation: 0, autoAlpha: 1 }, {
      y: 90, rotation: 80, autoAlpha: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    g.fromTo('.hero-rule', { scaleX: 0 }, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'top -35%', scrub: true }
    });

    /* 1 · FÄRG: växtljuset värms och djupnar genom hela sidan —
           snabbast i öppningen (man sänker ner sig i ljuset). */
    var glow = document.querySelector('.candle-glow');
    if (glow) {
      var glowTl = g.timeline({
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
      });
      glowTl.to(glow, { opacity: 0.55, ease: 'power1.out', duration: 0.4 }, 0);
      glowTl.to(glow, { opacity: 0.92, ease: 'none', duration: 0.6 }, 0.4);
    }

    /* 2 · LINJE: pennstrecken ritas framåt när sektionen glider in. */
    g.utils.toArray('.section .pen-rule').forEach(function (rule) {
      g.fromTo(rule, { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: rule, start: 'top 95%', end: 'top 62%', scrub: true }
      });
    });

    /* 3 · REVIVAL: brödtext, ramar och formulär träder in tidigt —
           start 'top 95%' så sidan svarar på första scrollnotch. */
    g.utils.toArray('.reveal').forEach(function (el) {
      g.fromTo(el, { autoAlpha: 0, y: 26 }, {
        autoAlpha: 1, y: 0, ease: 'power1.out',
        scrollTrigger: { trigger: el, start: 'top 95%', once: true }
      });
    });

    /* 4 · ZOOM: porträtt och gallerifoton slår an i 1.09 och lägger sig
           i 1.0 medan ramen vandrar upp genom vyn (scrubbad Ken Burns). */
    g.utils.toArray('.gilt.portrait, .kb-frame').forEach(function (frame) {
      var media = frame.querySelector('img');
      if (!media) { return; }
      g.fromTo(media, { scale: 1.09 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'top 30%', scrub: true }
      });
    });

    /* 5 · DRIFT: marginalierna driver mot riktningen (parasollager
           mot textkolumnen) — tydlig relativ förskjutning per viewport. */
    g.utils.toArray('.marginalia').forEach(function (note) {
      g.fromTo(note, { yPercent: 26 }, {
        yPercent: -26, ease: 'none',
        scrollTrigger: {
          trigger: note.closest('.annotated') || note.parentElement,
          start: 'top bottom', end: 'bottom top', scrub: true
        }
      });
    });
  });

  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 721px)', function () {
    /* 6 · PIN: kapitälrubriken i Tjänster hålls stilla medan hela
           postlistan rinner förbi under den — ett fast ögonblick. */
    var chapter = document.querySelector('.chapter-pin');
    if (chapter) {
      ST.create({
        trigger: chapter, start: 'top 18%',
        endTrigger: '.entries', end: 'bottom 78%',
        pin: chapter, pinSpacing: false
      });
    }
  });

  ST.refresh();
})();
