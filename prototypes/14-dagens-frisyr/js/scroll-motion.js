/* 14 · Dagens frisyr — scroll-koreografi (MC 10088, ägarens JS-regel 2026-10-05).
   GSAP + ScrollTrigger lokalt vendor (../_assets/vendor/) — ingen CDN, inga egna
   globals. All rörelse registreras ENDAST i (prefers-reduced-motion: no-preference):
   reduce ⇒ zero triggers, allt står i CSS i sitt slutläge; inget JS ⇒ statisk
   tidning. Temat hade inga IO-reveals förut — GSAP är sidans enda rörelsemekan. */
(function () {
  'use strict';
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; }                 /* biblioteken saknas → statisk sida */
  g.registerPlugin(ST);

  var mm = g.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {
    var bar = document.querySelector('.paperbar');
    var barH = bar ? Math.round(bar.getBoundingClientRect().height) : 56;

    /* 1 · LINJE: nya hårlinjer dras ut över sidan (scaleX, scrubbar). */
    g.utils.toArray('.draw-rule').forEach(function (rule) {
      g.set(rule, { scaleX: 0 });
      g.to(rule, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: rule, start: 'top 92%', end: 'top 58%', scrub: true }
      });
    });

    /* 2 · FÄRG: pappret djupnar genom upplagan — pressfärgad layer bakom allt.
       Max 6 %: kontraster omräknade till muted 4,8:1 och press 4,6:1 (AA). */
    g.fromTo('.ink-wash', { opacity: 0 }, {
      opacity: 0.06, ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
    });

    /* 3 · ZOOM: pressfoto sätts 1.12→1.0 när ramen kliver in (Ken Burns
           över scroll, inte klocka — halftonen beskär i ramen). */
    g.utils.toArray('.halftone img').forEach(function (img) {
      g.fromTo(img, { scale: 1.12 }, {
        scale: 1, ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.press-photo'),
          start: 'top bottom', end: 'top 55%', scrub: 1
        }
      });
    });

    /* 4a · DRIFT: tryckraster-prickarna driver under sidan med scrollen. */
    g.fromTo('.dot-field', { backgroundPosition: '0px 0px' }, {
      backgroundPosition: '0px -320px', ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1 }
    });

    /* 4b · DRIFT: ledarfotot motåker textkolumnen på leadsidan. */
    var leadPhoto = document.querySelector('.press-photo--lead');
    if (leadPhoto) {
      g.fromTo(leadPhoto, { yPercent: 7 }, {
        yPercent: -7, ease: 'none',
        scrollTrigger: { trigger: '.masthead', start: 'top top', end: 'bottom top', scrub: 1 }
      });
    }

    /* 5 · PIN: "Reportage"-etiketten håller medan reportaget rinner förbi. */
    ST.create({
      trigger: '#om',
      start: 'top ' + (barH + 8) + 'px',
      end: 'bottom ' + (barH + 60) + 'px',
      pin: '#om .section-flag',
      pinSpacing: false
    });

    /* 6 · TYPOGRAFI: sektionsrubrikernas letter-spacing dras åt vid inträde. */
    g.utils.toArray('.section-headline').forEach(function (h) {
      g.fromTo(h, { letterSpacing: '0.055em' }, {
        letterSpacing: '0em', ease: 'none',
        scrollTrigger: { trigger: h, start: 'top 96%', end: 'top 58%', scrub: true }
      });
    });
  });

  ST.refresh();
})();
