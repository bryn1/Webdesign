/* 12 · Den förgyllda salongen — scroll-koreografi (MC 10088)
   Drivs av lokalt vendor GSAP + ScrollTrigger (ingen CDN, inga nya deps).
   Villkor:
   - Utan JS eller utan vendor-filerna: baskoderna i css/ visar redan SLUTLÄGE
     (allt syns, ingen rörelse) — progressiv förbättring, inte ett beroende.
   - prefers-reduced-motion: reduce: matchMedia-kontexten registrerar ALDRIG
     triggers — rörelsen hoppas över, inte fejkan.
   - Ingen egen global: allt i IIFE; färdga referenser lever i sluten kontext. */
(function () {
  'use strict';
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; } /* vendor saknas → synligt slutläge, tyst */
  g.registerPlugin(ST);

  var mm = g.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', function () {

    /* 1 · Guld-deco-linjer: växer ut från mitten när sektionen kliver in */
    g.utils.toArray('.deco-rule').forEach(function (rule) {
      g.fromTo(rule.querySelectorAll('.deco-rule__line'),
        { scaleX: 0 },
        { scaleX: 1, ease: 'none',
          scrollTrigger: { trigger: rule, start: 'top 92%', end: 'top 34%', scrub: 0.6 } });
    });

    /* 2 · Sektionernas deco-ramar: hairline sträcks ritas (från CSS timeline) */
    g.utils.toArray('.sec-frame').forEach(function (frame) {
      g.fromTo(frame.querySelector('.sec-frame__rect'),
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, ease: 'none',
          scrollTrigger: { trigger: frame, start: 'top 88%', end: 'top 26%', scrub: 0.5 } });
    });

    /* 3 · Galleri-iris: clip-path styrs av scroll (klock-väntet, omgjort) */
    g.utils.toArray('.plate').forEach(function (plate) {
      var img = plate.querySelector('.iris');
      if (!img) { return; }
      var proxy = { c: 75 };
      g.fromTo(proxy, { c: 0 }, {
        c: 75, ease: 'none',
        onUpdate: function () {
          img.style.clipPath = 'circle(' + proxy.c.toFixed(2) + '% at 50% 50%)';
        },
        scrollTrigger: { trigger: plate, start: 'top 94%', end: 'top 40%', scrub: 0.5 }
      });
    });

    /* 4 · Guldramar (porträtt + fyra tavlor): scale-in med studsande förbi-
         sväng och landning, spelar en gång vid intrdet */
    g.utils.toArray('.goldframe').forEach(function (frame) {
      g.fromTo(frame,
        { scale: 0.88, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 1.1, ease: 'back.out(1.8)',
          scrollTrigger: { trigger: frame, start: 'top 88%',
                           toggleActions: 'play none none none' } });
    });

    /* 5 · Ambient smaragd → djupt guld: glöd bakom innehållet (tidig fas)
         och guldfilm över sec-ytor (sen fas) — båda scrubade mot progress */
    var amb = g.timeline({
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
    });
    amb.fromTo('.amb-glow', { opacity: 0 }, { opacity: 1, duration: 0.40, ease: 'none' }, 0.02)
       .fromTo('.amb-film', { opacity: 0 }, { opacity: 0.2, duration: 0.25, ease: 'none' }, 0.38);

    /* 5b · Sektionernas egen yta glider smaragd → djupt guld under scrollen
         (samma beräknade AA-golv som filmen: guld/text ≥ 4.8:1 över allt) */
    g.utils.toArray('.sec:not(.sec--ink)').forEach(function (sec) {
      g.fromTo(sec, { backgroundColor: '#0d211b' },
        { backgroundColor: '#2b1c07', ease: 'none',
          scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top top', scrub: true } });
    });

    /* 6 · Pinn-ögonblick: mässings-solfjädern rider galleriet (sticky i CSS,
         rotation + andning scrubad över sektionen) */
    g.fromTo('.pin-sun', { rotate: 0, scale: 1 },
      { rotate: 132, scale: 1.12, ease: 'none',
        scrollTrigger: { trigger: '#galleri', start: 'top bottom', end: 'bottom top', scrub: true } });

    /* 7 · Hero: text driver uppåt/bortåt när hjältet lämnar; solfjädern får
         egen mot-parallax över hela sidan (rörlig detalj i band 0→40) */
    g.timeline({
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    })
      .to('.hero__body', { y: -96, opacity: 0.12, ease: 'none' }, 0)
      .to('.hero__marquee', { y: 42, opacity: 0, ease: 'none' }, 0)
      .to('.hero__sun', { opacity: 0.16, ease: 'none' }, 0);
    g.fromTo('.hero__sun', { yPercent: 6 },
      { yPercent: -46, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 1 } });

    /* 8 · Boka: veckokolonnerna lyfter in stegrat mot scrollen */
    g.fromTo('.week__day', { yPercent: 22, autoAlpha: 0.12 },
      { yPercent: 0, autoAlpha: 1, ease: 'none', stagger: 0.07,
        scrollTrigger: { trigger: '.week', start: 'top 96%', end: 'top 44%', scrub: 0.7 } });

    /* 9 · Kontakt: formulär- och besökskorten glider isär till sina platser */
    g.fromTo('.cf', { xPercent: -4, autoAlpha: 0.2 },
      { xPercent: 0, autoAlpha: 1, ease: 'none',
        scrollTrigger: { trigger: '.kontakt-grid', start: 'top 86%', end: 'top 52%', scrub: 0.6 } });
    g.fromTo('.visit', { xPercent: 4, autoAlpha: 0.2 },
      { xPercent: 0, autoAlpha: 1, ease: 'none',
        scrollTrigger: { trigger: '.kontakt-grid', start: 'top 86%', end: 'top 52%', scrub: 0.6 } });
  });
}());
