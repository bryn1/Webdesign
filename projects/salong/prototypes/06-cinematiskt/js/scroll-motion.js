/* 06 · Möt dig i spegeln — scroll-koreografi (MC 10088).
   ALL scrollrörelse samlad här, driven av lokal vendor GSAP + ScrollTrigger
   (../_assets/vendor/, defer, ingen CDN, inga egna globals — allt i IIFE).
   Ersätter: js/reveal.js (IO-reveal + header-kant), js/hero-zoom.js (rAF-scrub)
   och CSS scroll-driven timeline-deklarationen i css/hero.css (@supports-blocken).
   Villkor:
   - Utan JS eller utan vendor-filerna: bas-CSS:n visar redan SLUTLÄGE — allt
     syns, ingen rörelse. Progressiv förbättring, inte ett beroende.
   - prefers-reduced-motion: reduce: matchMedia-kontexten registrerar ALDRIG
     triggers — rörelsen hoppas över, inte fejkas. */
(function () {
  'use strict';
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; } /* vendor saknas → synligt slutläge, tyst */
  g.registerPlugin(ST);

  var mm = g.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', function () {

    /* 0 · Header-hårrand: tillstånd vid 24 px (ersätter roll-lyssnaren). */
    var header = document.querySelector('.site-header');
    if (header) {
      ST.create({
        start: 24, end: 'max',
        onToggle: function (self) { header.classList.toggle('is-scrolled', self.isActive); }
      });
    }

    /* 1 · Hero zoom-settle (ZOOM): spegelfönstret zoomas in över 140svh,
           interiören tonar fram bakom glaset, textlagret driver upp och slocknar.
           Samma kurva som den gamla rAF-scrubben — nu scrub:0.8, mjukt insläppt. */
    g.timeline({
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 }
    })
      .to('.hero__scaler', { scale: 1.9, ease: 'none' }, 0)
      .to('.hero__interior', { opacity: 1, ease: 'none' }, 0)
      .to('.hero__copy', { opacity: 0, y: -90, ease: 'none' }, 0)
      .to('.hero__scrollcue', { opacity: 0, y: 26, ease: 'none' }, 0);
    /* mot-drift (DRIFT): halon glider långsammare än zoomen — djup i spegeln */
    g.fromTo('.hero__halo', { yPercent: -6 }, {
      yPercent: 10, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });

    /* 2 · Hårregler ritas (LINE): sektionsskiljarna växer ut från mitten —
           film-rutans streck, scrubade och följsamma. */
    g.utils.toArray('.rule').forEach(function (rule) {
      g.fromTo(rule, { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: rule, start: 'top 97%', end: 'top 42%', scrub: 0.6 }
      });
    });

    /* 3 · Bild-zoom-settle (ZOOM): galleri- och porträttbilder landar från
           35 mm mot 50 mm — avskalad zoom scrubad medan kortet rullar in.
           Porträttets ram (overflow:hidden, object-position top) bryts ej. */
    g.utils.toArray('.gallery__card img').forEach(function (img) {
      g.fromTo(img, { scale: 1.14 }, {
        scale: 1.0, ease: 'none',
        scrollTrigger: { trigger: img.closest('.gallery__card'), start: 'top bottom', end: 'top 38%', scrub: true }
      });
    });
    var portrait = document.querySelector('.om__portrait img');
    if (portrait) {
      g.fromTo(portrait, { scale: 1.07 }, {
        scale: 1.0, ease: 'none',
        scrollTrigger: { trigger: '.om__portrait', start: 'top bottom', end: 'top 42%', scrub: true }
      });
    }

    /* 4 · Mot-driftsparallax (DRIFT): tjänstnumren glider motsols mot texten,
           kontakt-kolumnerna fälls isär till sina platser. */
    g.utils.toArray('.service').forEach(function (row) {
      g.fromTo(row.querySelector('.service__num'), { yPercent: 22 }, {
        yPercent: -14, ease: 'none',
        scrollTrigger: { trigger: row, start: 'top bottom', end: 'top 55%', scrub: true }
      });
    });
    g.fromTo('.kontakt__form-wrap', { xPercent: -3 }, {
      xPercent: 0, ease: 'none',
      scrollTrigger: { trigger: '.kontakt__grid', start: 'top bottom', end: 'top 48%', scrub: 0.7 }
    });
    g.fromTo('.kontakt__info', { xPercent: 3 }, {
      xPercent: 0, ease: 'none',
      scrollTrigger: { trigger: '.kontakt__grid', start: 'top bottom', end: 'top 48%', scrub: 0.7 }
    });

    /* 5 · Omgivande exponering (FÄRG): sidan lyses upp ur mörkret — body-ton
           lyfts mörk stålgrå → djup graf under hela scrollsträckan, filmkor-
           net tätnar mot slutet. Alla textpar behåller AA i hela intervallet. */
    g.fromTo(document.body, { backgroundColor: '#111213' }, {
      backgroundColor: '#17191c', ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: true }
    });
    g.fromTo('.grain', { opacity: 0.035 }, {
      opacity: 0.07, ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: true }
    });

    /* 6 · Pinnat filmdrag (PIN): citatet vilar i biografrasen medan hårfil-
           merna ritas och bokstaven drar ihop sig — ett enda långsamt andetag. */
    var citat = document.querySelector('.citat');
    if (citat) {
      var tl = g.timeline({
        scrollTrigger: { trigger: '.citat', start: 'top top', end: '+=110%', pin: true, scrub: true }
      });
      tl.fromTo(citat.querySelectorAll('.citat__hair'), { scaleX: 0 },
        { scaleX: 1, ease: 'none', duration: 0.45, stagger: 0.12 }, 0)
        .fromTo(citat.querySelector('.citat__quote'), { opacity: 0.15, letterSpacing: '0.09em' },
          { opacity: 1, letterSpacing: '0.01em', ease: 'power1.inOut', duration: 0.55 }, 0.12);
    }

    /* 7 · En-gångs-avslöjanden (ersätter IntersectionObserver i js/reveal.js):
           varje [data-reveal] spelar in en gång — långsamt, självsäkert. */
    g.utils.toArray('[data-reveal]').forEach(function (el) {
      g.fromTo(el, { autoAlpha: 0, y: 20 }, {
        autoAlpha: 1, y: 0, duration: 0.95, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none' }
      });
    });
  });
}());
