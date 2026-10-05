/* 11 · Blå färgbrunn — scroll-koreografi (MC 10088, ägarens JS-regel 2026-10-05).
   GSAP + ScrollTrigger lokalt vendor (../_assets/vendor/) — ingen CDN.
   All rörelse registreras ENDAST i (prefers-reduced-motion: no-preference):
   med reduce satt körs ingenting, och alla element står redan i CSS i sitt
   synliga slutläge. Utan JS/bibliotek händer nada — innehållet är fullt läsbart. */
(function () {
  'use strict';
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; }                      // biblioteken saknas → statisk sida
  g.registerPlugin(ST);

  var mm = g.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {

    /* 1 · Bläckhår dras fram från vänster (LINJE, scrubbar per sektion). */
    g.utils.toArray('.ink-rule').forEach(function (rule) {
      g.set(rule, { scaleX: 0 });
      g.to(rule, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: rule, start: 'top 88%', end: 'top 38%', scrub: true }
      });
    });

    /* 2 · Indigo DJUPNAR: fast ai-lager tonas in genom sidan (FÄRG) — snabbast
           i början (man sjunker ner i färgbadet), mörknar saktare mot botten. */
    var deepTl = g.timeline({
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
    });
    deepTl.to('.ai-deep', { opacity: 0.72, ease: 'power1.out', duration: 0.7 }, 0);
    deepTl.to('.ai-deep', { opacity: 0.85, ease: 'none', duration: 0.3 }, 0.7);

    /* 3 · Gallerifoton: zoom-sättning 1.10→1.0 vid inträde, svag 1.06-utfart
          (ZOOM som Ken Burns över scroll, inte klocka). */
    g.utils.toArray('.shot').forEach(function (shot) {
      var media = shot.querySelector('img, .dip');
      if (!media) { return; }
      var tl = g.timeline({
        scrollTrigger: { trigger: shot, start: 'top bottom', end: 'bottom top', scrub: true }
      });
      tl.fromTo(media, { scale: 1.1 }, { scale: 1, ease: 'none', duration: 0.7 }, 0);
      tl.to(media, { scale: 1.06, ease: 'none', duration: 0.3 }, 0.7);
    });

    /* 4 · Seigaiha-banden driver horisontellt MOT riktingen (PARALLAX, två lager). */
    g.utils.toArray('.wave-band').forEach(function (band) {
      g.fromTo(band, { xPercent: 4 }, {
        xPercent: -4, ease: 'none',
        scrollTrigger: {
          trigger: band.closest('section') || band.parentElement,
          start: 'top bottom', end: 'bottom top', scrub: true
        }
      });
    });

    /* 5 · 藍-nålen: sticky rail (CSS) + förseglings-ögonblick vid inträde (PIN). */
    var seal = document.querySelector('.pin-seal');
    if (seal) {
      g.fromTo(seal, { scale: 0.55, opacity: 0.15 }, {
        scale: 1, opacity: 1, ease: 'power2.out',
        scrollTrigger: { trigger: '.galleri-wrap', start: 'top bottom', end: 'top 55%', scrub: true }
      });
    }

    /* 6 · Motdriftskolumnen i Tjänster: tydlig relativ förskjutning mot den
           klistrade rubriken (±14 % av egen höjd ≈ 15 % av ett viewport per
           viewport scroll — mätt till >8 %-kravet, se evidence/11-verify). */
  });

  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 721px)', function () {
    g.fromTo('.split__drift', { yPercent: -14 }, {
      yPercent: 14, ease: 'none',
      scrollTrigger: { trigger: '.split', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  ST.refresh();
})();
