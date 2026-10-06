/* 03 · Papper & sax — scroll-koreografi (MC 10088, ägarens JS-regel 2026-10-05;
   tethetspass DENSITY-04a: "det finns inte tillräckligt som rör på sig" →
   tät, tydlig scrollrörelse genom hela sajten, varma amplituder 18–50 px).
   GSAP + ScrollTrigger lokalt vendor (../_assets/vendor/) — ingen CDN, inge-
   na egna globaler, allt i IIFE. All rörelse registreras ENDAST i
   (prefers-reduced-motion: no-preference): med reduce körs ingenting och
   allt står redan i CSS i sitt synliga slutläge. Utan JS/bibliotek händer
   nada — innehållet är fullt läsbart från start.
   Regler (byggbesked vågen): (1) alla drift är KONVERGENTA ±A→0, aldrig
   ±A→∓A — i viloläge ligger allt i sin plats; (2) breda x-drift finns bara
   bakom min-width-block, basen är y-only → 375 px utan överflöd; (3) trig-
   gars på DOM som byggs av defer-script (boka-rutnätet) registreras på
   DOMContentLoaded — .cal-wrap finns dock i HTML och är säker direkt.
   Tidigare js/reveal.js (IO one-shot) och js/parallax.js (rAF-scroll) är
   nedlagda: samma rörelser drivs nu av ScrollTrigger — en motor per sak. */
(function () {
  'use strict';
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; }                      // biblioteken saknas → statisk sida
  g.registerPlugin(ST);

  var mm = g.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {

    /* Drivfönster: startar 260 px för tidigt och slutar 260 px för sent så
       att angränsande sektioners drift alltid överlappar — någonting rör
       sig i varje steg, aldrig ett tomt glapp. */
    function win(el) {
      return { trigger: el, start: 'top bottom+=260', end: 'bottom top-=260', scrub: true };
    }
    function page() {                              // hela sidans färd
      return { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true };
    }
    /* Konvergent drift: startar vid ±A och vilar på 0. AKTA: gsap.fromTo
       tar BARA tre variabler — scrollTrigger måste sitta i to-objektet. */
    function drift(el, A, extra, trig) {
      if (!el) return;
      var to = { y: 0, ease: 'none', scrollTrigger: trig || win(el) };
      if (extra) { for (var k in extra) to[k] = extra[k]; }
      g.fromTo(el, { y: A }, to);
    }

    /* 0 · Reveal (ärver js/reveal.js): one-shot per element, spelar när
           elementet glider in — "visa en gång, sedan lugnt". Endsast
           OPCITET: y-lyftet tas nu av den scrubbede driften på samma
           element, två motorer får inte tävla om samma egenskap. */
    g.utils.toArray('[data-reveal]').forEach(function (el) {
      g.from(el, {
        opacity: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    /* 1 · Hairlinjer ritas fram från vänster (LINJE, scrubbar).
           Hero-nålen + hero-stygnen följer första vyn; en hår per sektion
           ritas när rubriken glider uppåt. */
    var heroRule = document.querySelector('.rule--terra');
    if (heroRule) {
      g.fromTo(heroRule, { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }
    var heroStitch = document.querySelector('.rule--stitch');
    if (heroStitch) {
      g.fromTo(heroStitch, { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top 35%', end: 'bottom 55%', scrub: true }
      });
    }
    g.utils.toArray('[data-draw-rule]:not([data-draw-ride])').forEach(function (rule) {
      g.fromTo(rule, { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: rule.closest('.section-head') || rule,
                         start: 'top 92%', end: 'top 45%', scrub: true }
      });
    });

    /* 2 · Ambient lager (FÄRG/OPCITET/DRIFT, scrubbar över hela sidan):
           papperstongen åldras, den varma tvätten tänds, pappergrynet
           driver bakåt mot läsningen och stygntraden ritas utmed kanten.
           De fasta lagren garanterar rörelse i varje scrollsteg. */
    var wash = document.querySelector('.paper-tone');
    if (wash) {
      /* Alpisarna är satta så att även MÖRKASTA stoppet (tvätt + hörnskugga
         över papper) håller WCAG AA mot alla papperstexterna — se
         evidence/03-aa.py. Sage-ink (5.5:1 rent) binder: 4.6:1 i botten. */
      g.fromTo(wash,
        { backgroundColor: 'rgba(180, 95, 46, 0)',
          boxShadow: 'inset 0 0 140px rgba(94, 62, 34, 0)' },
        { backgroundColor: 'rgba(146, 88, 45, 0.08)',
          boxShadow: 'inset 0 0 210px rgba(70, 48, 28, 0.04)',
          ease: 'none',
          scrollTrigger: page() });
    }
    var wash2 = document.querySelector('.warm-wash');
    if (wash2) {
      g.fromTo(wash2, { opacity: 0 }, { opacity: 0.45, ease: 'none', scrollTrigger: page() });
    }
    var grain = document.querySelector('.paper-grain');
    if (grain) {
      g.fromTo(grain, { y: 0 }, { y: -380, ease: 'none', scrollTrigger: page() });
    }
    var thread = document.querySelector('.stitch-thread');
    if (thread) {
      g.fromTo(thread, { scaleY: 0.12 }, { scaleY: 1, ease: 'none', scrollTrigger: page() });
    }

    /* 3 · Rubriksrad-byggnad (CLIP, scrubbad): varje rubrik reser sig bakom
           sin mask medan sektionen glider in — rad för rad i bredd, klippt
           i .line-mask. I viloläge: 0, texten helt synlig. */
    g.utils.toArray('.line-rise').forEach(function (line, i) {
      var mask = line.closest('.line-mask');
      g.fromTo(line, { y: 26 - (i % 3) * 6 }, {
        y: 0, ease: 'none',
        scrollTrigger: { trigger: mask, start: 'top bottom-=60', end: 'top 45%', scrub: true }
      });
    });

    /* 4 · Hero (DRIFT, scrubbar): kopian och brödtexten sjunker med olika
           tyngd, CTA-raden lättar emot, nålen konvergerar nu ±18→0. */
    drift(document.querySelector('.hero-grid'), 16, null,
      { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true });
    drift(document.querySelector('.hero .eyebrow'), 22, null,
      { trigger: '.hero', start: 'top 60%', end: 'bottom 30%', scrub: true });
    drift(document.querySelector('.hero-sub'), -18, null,
      { trigger: '.hero', start: 'top 50%', end: 'bottom 20%', scrub: true });
    drift(document.querySelector('.cta-row'), 20, null,
      { trigger: '.hero', start: 'top 40%', end: 'bottom 12%', scrub: true });
    drift(document.querySelector('.hero-mark'), -18, null,
      { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true });

    /* 5 · Zoom-sättning (ZOOM, scrubbar): gallerifoton glider in 1.07→1.0
           och porträttbilden Ken Burns 1.06→1.0 med en mjuk x-vaggning —
           beskuret inuti ramen, matte och dubbelhairline rör ej. */
    g.utils.toArray('.paper-frame .frame-media > img').forEach(function (img) {
      g.fromTo(img, { scale: 1.07 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: img.closest('.paper-frame'),
                         start: 'top bottom', end: 'top 40%', scrub: true }
      });
    });
    var portraitImg = document.querySelector('.portrait-img');
    if (portraitImg) {
      g.fromTo(portraitImg, { scale: 1.06, x: -8 }, {
        scale: 1, x: 0, ease: 'none',
        scrollTrigger: { trigger: '.portrait', start: 'top bottom',
                         end: 'top 40%', scrub: true }
      });
    }

    /* 6 · Lagerdrift (DRIFT, scrubbar): matte-underlag och ram konvergerar
           åt var sitt håll mot viloläge — samma anding som js/parallax.js
           gav, nu scrollbunden och ±A→0 (i viloläge exakt i plats). */
    g.utils.toArray('[data-parallax-depth]').forEach(function (layer) {
      var depth = parseFloat(layer.getAttribute('data-parallax-depth')) || 0;
      drift(layer, -36 * depth, null,
        { trigger: layer.closest('[data-parallax]') || layer.parentElement,
          start: 'top bottom', end: 'bottom top', scrub: true });
    });

    /* 7 · Om mig: brödtexten sjunker tungt, porträttkolumnen lättar emot —
           kolumnerna motdrift. Citat-x-svayet på breda vyer ligger nu i 7b
           på TOPPNIVÅ (DENSITY-FIX-01 — se varför där). */
    var prose = document.querySelector('#om .prose');
    drift(prose, 26);
    g.utils.toArray('#om .section-head .eyebrow').forEach(function (e) { drift(e, 18); });
    drift(document.querySelector('#om .portrait-cap'), -14);

    /* 8 · Tjänster: varje rad driver med sin egen tyngd och lutar upp till
           1,5° — listanbladrar som lös pappersvatt. Huvudets ögonblick
           under det klistrade läget tas av #ride (nedanför). */
    var SERVICE_D = [24, -20, 30, -26, 20];
    g.utils.toArray('#tjanster .service').forEach(function (row, i) {
      var A = SERVICE_D[i % SERVICE_D.length];
      g.fromTo(row, { y: A, rotate: (A > 0 ? 1 : -1) * 1.5 }, {
        y: 0, rotate: 0, ease: 'none', scrollTrigger: win(row)
      });
    });
    drift(document.querySelector('#tjanster .section-head .eyebrow'), 16);

    /* 9 · Galleri: korten driver individuellt ±(20–32) px och micro-
           roterar ±1,5° mot viloläge — överburen bildzoom ger djupet. */
    var GAL_D = [28, -22, 32, -26, 22, -30];
    var GAL_R = [1.5, -1.2, 1.2, -1.5, 0.9, -0.9];
    g.utils.toArray('#galleri .paper-frame').forEach(function (fig, i) {
      g.fromTo(fig, { y: GAL_D[i % GAL_D.length], rotate: GAL_R[i % GAL_R.length] }, {
        y: 0, rotate: 0, ease: 'none', scrollTrigger: win(fig)
      });
    });
    drift(document.querySelector('#galleri .section-head .eyebrow'), 18);

    /* 10 · Boka (mörkt band): rutnätet sjunker som ett bräd, huvud och
            teckenförklaring lättar emot — hela kalenderns celler följer
            med brädets rörelse. Triggern sitter på .cal-wrap som redan
            finns i HTML (rutnätet byggs av booking.js). */
    drift(document.querySelector('#boka .section-head .eyebrow'), 18);
    drift(document.querySelector('#boka .cal-legend'), -16);
    drift(document.querySelector('.cal-wrap'), 22);
    drift(document.querySelector('#boka .demo-badge'), -20);
    drift(document.querySelector('#boka .cal-note'), 18);

    /* 11 · Kontakt: formulärkolumnen och faktarutan motdrift — breven
            glider isär på bordet. */
    drift(document.querySelector('#kontakt .section-head .eyebrow'), 16);
    drift(document.querySelector('.contact-form'), -20);
    drift(document.querySelector('.contact-info'), 24);

    /* 12 · Slitkanter: fyra deckelband, tre tydligt olika långsamma
            hastigheter — papprets kant svävar i egen takt. */
    g.utils.toArray('.deckle').forEach(function (band) {
      var d = parseFloat(band.getAttribute('data-deckle')) || 0.5;
      drift(band, 36 * d * (d > 0.6 ? 1 : -1));
    });

    /* 13 · Footer: kolumnerna motdrift — sidfoten viks lugnt ihop. */
    var FOOT_D = [20, -26, 14];
    g.utils.toArray('.foot-grid > *').forEach(function (col, i) {
      var trig = { trigger: '.site-foot', start: 'top bottom', end: 'bottom bottom', scrub: true };
      drift(col, FOOT_D[i % FOOT_D.length], null, trig);
    });

    /* 14 · Nål-ögonblick under det klistrade Tjänster-huvudet (PIN): headen
            rider sektionen i CSS (sticky — fungerar även utan JS/rörelse som
            vanligt läge); här dras hairlinjen under huvudet kontinuerligt
            under hela färden, så infästningen syns som vilja, inte haveri. */
    var rideRule = document.querySelector('#tjanster .section-head [data-draw-ride]');
    if (rideRule) {
      g.fromTo(rideRule, { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: '#tjanster', start: 'top top',
                         end: 'bottom bottom', scrub: true }
      });
    }
  });

  /* 7b · BRODX-SVAY (DRIFT, brett läge): inledningsstycket svajar som ett
          citat — x-drift ENAST bakom min-width, så 375 px är y-only.
          DENSITY-FIX-01: detta mm.add låg FÖRUT NESTLAT inuti det yttre
          no-preference-handlern ovan — varje gång reduce-villkoret toggla
          kördes handlaren om och STASHADE en ny mm-registrering per gång
          (probe: handler 1→3→6, triggers 2→3→4). Nu: ett registratoranrop
          på toppnivå, syster till det yttre — villkoret är ORD FÖR ORD
          detsamma, så reduce-gaten är orörd (0 triggers vid reduce). */
  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 64rem)', function () {
    var prose = document.querySelector('#om .prose');
    var pull = document.querySelector('#om .prose p');
    if (!prose || !pull) { return; }
    g.fromTo(pull, { x: 24 }, {
      x: 0, ease: 'none',
      scrollTrigger: { trigger: prose, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  ST.refresh();
}());
