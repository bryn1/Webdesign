/* 05 · Mjuk glas — scroll-koreografi (MC 10088, ägarens JS-regel 2026-10-05;
    DENSITY-03b 2026-10-05: ägaren "not enough things that move" → tät, mjuk
    scroll-densitet. Alla registrationer i ett och samma fil, alla i
    no-preference-blocket.)
    GSAP + ScrollTrigger lokalt vendor (../_assets/vendor/) — ingen CDN, inga
    egna globaler, allt i IIFE. All rörelse registreras ENDAST i
    (prefers-reduced-motion: no-preference): med reduce körs ingenting och
    allt står redan i CSS i sitt synliga slutläge. Utan JS/bibliotek händer
    nada — innehållet är fullt läsbart från start.
    Tidigare js/enhance.js (IO-reveal), js/parallax.js (rAF-scroll) och
    CSS-view-tidslinjen/galleri-IO:n är nedlagda: samma rörelser drivs nu
    av ScrollTrigger — en motor per sak. */
(function () {
  'use strict';
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; }                      // biblioteken saknas → statisk sida
  g.registerPlugin(ST);

  var mm = g.matchMedia();

  /* DRIFT-MOTORN (DENSITY-03b): x/y per element mot live scrollY/maxScroll.
     Motorn bor MODUL-nivå (en ticker-funktion + en scroll-lyssnare, aldrig
     duplicerade) — matchMedia-hanterna återkörs av GSAP vid varje
     ScrollTrigger.refresh(), så tillståndet får inte bo i hanteraren.
     Hanteraren Fyller motorn (items[]) och städar tillbaka den. Motorn läser
     scrollY LIVE varje tick — ingen absolut start/end-karta, ingen
     refresh-/reflow-känslighet: lagret rör sig vid VARJE scrollsteg och flera
     element driver samtidigt i olika takt och håll = djup i glaset. Endast
     transform: ingen alfado, ingen kontrastpåverkan. Startläge 0 = flöde. */
  var driftItems = [];
  var lastP = -1;
  function driftSpan() {
    return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  }
  function driftTick() {
    if (!driftItems.length) { return; }
    var span = driftSpan();
    var p = Math.min(1, Math.max(0, window.scrollY / span));
    if (p === lastP) { return; }
    lastP = p;
    driftItems.forEach(function (it) {
      g.set(it.el, { y: it.speed ? it.speed * span * p : it.y * p,
                     x: it.x * p, lazy: false });
    });
  }
  function driftReset() {
    driftItems.forEach(function (it) { g.set(it.el, { y: 0, x: 0, lazy: false }); });
    driftItems = [];
    lastP = -1;
  }
  gsap.ticker.add(driftTick);
  /* Scroll-lyssnaren gör avbildningen deterministisk per steg (ticker:ns
     rAF kan sväva i headless/makinerade lägen): samma värde, direkt. */
  window.addEventListener('scroll', driftTick, { passive: true });

  mm.add('(prefers-reduced-motion: no-preference)', function () {

    var each = function (sel) { return g.utils.toArray(sel); };
    driftItems = [];

    function drift(el, yAmp, xAmp, speed) {
      driftItems.push({ el: el, y: yAmp || 0, x: xAmp || 0, speed: speed || 0 });
    }
    /* amps cyklas med alternerande tecken per index → udda/jämna element
       driver mot var sitt håll (counter-drift) med olika fart. */
    function driftLoop(sel, amps, axis) {
      each(sel).forEach(function (el, i) {
        var a = amps[i % amps.length] * (i % 2 ? -1 : 1);
        drift(el, axis === 'y' ? a : null, axis === 'x' ? a : null);
      });
    }

    /* 0 · Reveal (ärver js/enhance.js): one-shot per element när den glider
           in. GSAP sätter startsänkan; utan JS finns den aldrig. */
    g.utils.toArray('[data-reveal]').forEach(function (el) {
      g.from(el, {
        opacity: 0, y: 16, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    /* 1 · GLASHÅRLINJER ritas fram från vänster (LINJE, scrubbar): en mjuk
           hairline per sektion — "linjen växer fram under läsningen". */
    g.utils.toArray('.rule-glass').forEach(function (rule) {
      g.fromTo(rule, { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: rule, start: 'top 92%', end: 'top 42%', scrub: true }
      });
    });

    /* 2 · FROSTTÖNG (FÄRG, scrubbad): ett fast tvättlager bakom allt innehåll
           svalnar mot mist i toppen och värms mot rosaton längst ner — glas-
           fältet skiftar ton under färden. Alfan håller sig låg så att all
           text klarar WCAG AA även vid mörkaste stoppet (evidence/05-aa.py). */
    var tone = document.querySelector('.frost-tone');
    if (tone) {
      g.fromTo(tone,
        { backgroundColor: 'rgba(167, 188, 195, 0)',
          boxShadow: 'inset 0 0 160px rgba(125, 90, 84, 0)' },
        { backgroundColor: 'rgba(201, 167, 160, 0.10)',
          boxShadow: 'inset 0 0 220px rgba(125, 90, 84, 0.05)',
          ease: 'none',
          scrollTrigger: { trigger: document.body, start: 'top top',
                           end: 'bottom bottom', scrub: true } });
    }
    /* Bakgrunnstvättens gradient Stopp-position skrubbas över sidan (sista
       sektionen = mätbaren) + två mjuka tvättlager driver mot var sitt håll
       (oskärpan gör farten mjuk). */
    var field = document.querySelector('.bg-field');
    if (field) {
      g.fromTo(field, { backgroundPosition: '0% 0%' }, {
        backgroundPosition: '100% 100%', ease: 'none',
        scrollTrigger: { trigger: '#kontakt', start: 'top bottom',
                         end: 'bottom bottom', scrub: true }
      });
    }
    each('.wash').forEach(function (w, i) {
      drift(w, i % 2 ? -24 : 20, i % 2 ? -40 : 44);
    });

    /* 3 · RUBRIKORDEN (KLIPP-REVEAL, scrubbar): vart ord i varje rubrik
           lyfter fram under en klippkant, ord för ord, medan rubriken
           vandrar genom vyn. Spannen byggs HÄR, i no-preference-blocket —
         utan JS/reduced motion finns de aldrig och texten står orörd:
         copyn är oförändrad, bara insvept. */
    function splitWords(el) {
      if (el.children.length) { return []; }
      var parts = el.textContent.trim().split(/\s+/);
      if (!parts.length || !parts[0]) { return []; }
      el.textContent = '';
      var spans = [];
      parts.forEach(function (w, i) {
        var s = document.createElement('span');
        s.className = 'mw';
        s.textContent = w;
        el.appendChild(s);
        spans.push(s);
        if (i < parts.length - 1) { el.appendChild(document.createTextNode(' ')); }
      });
      return spans;
    }
    each('main h1, main h2, main h3').forEach(function (h) {
      var words = splitWords(h);
      if (!words.length) { return; }
      var tl = g.timeline({
        scrollTrigger: { trigger: h, start: 'top 94%', end: 'top 46%', scrub: 0.6 }
      });
      words.forEach(function (w, i) {
        tl.fromTo(w,
          { y: 14, clipPath: 'inset(-25% -12% 100% -12%)' },
          { y: 0, clipPath: 'inset(-25% -12% -25% -12%)',
            ease: 'power2.out', duration: 1 },
          i * 0.2);
      });
    });

    /* 4 · PORTRÄTT-KEN-BURNS + RAMDRIFT: bilden zoomar/panar långsamt inuti
           sin rundade glasram medan ramen själv driver snett — dubbel rörelse
           i samma lugn. Tjänstekorten sjunker in med lätt skala = djup. */
    var portraitImg = document.querySelector('.portrait-frame img');
    if (portraitImg) {
      g.fromTo(portraitImg, { scale: 1.14, x: 8 }, {
        scale: 1, x: -8, ease: 'none',
        scrollTrigger: { trigger: '.portrait-frame', start: 'top bottom',
                         end: 'bottom top', scrub: true }
      });
    }
    g.utils.toArray('.gallery-card__media img').forEach(function (img) {
      g.fromTo(img, { scale: 1.08 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: img.closest('.gallery-card'),
                         start: 'top bottom', end: 'top 60%', scrub: true }
      });
    });
    g.utils.toArray('.service-card').forEach(function (card) {
      g.fromTo(card, { scale: 1.03, y: 16 }, {
        scale: 1, y: 0, ease: 'none',
        scrollTrigger: { trigger: card.closest('li') || card,
                         start: 'top bottom', end: 'top 55%', scrub: true }
      });
    });

    /* 5 · GLASDRIFT (DRIFT, scrubbar) — tematikens signatur: bakgrundskladdar-
           na driver mot var sitt håll (data-speed, ärver js/parallax.js) —
           nu som ticker-drift: y = speed × (scrollY × speedbas) live.
           Porträttglaskortet och textkolumnen driver varsitt — x-axeln på
           innehållslagen vald fri av reveal:ns y-sänk — ingen egenskap
           konkurrerar. */
    g.utils.toArray('[data-speed]').forEach(function (blob) {
      var speed = parseFloat(blob.getAttribute('data-speed')) || 0;
      drift(blob, null, null, speed);
    });
    drift('.om-text', null, -18);
    drift('.portrait-frame', 16, 26);

    /* 6 · TÄT GLASDRIFT (DENSITY-03b): många små lager samtidigt — glaskort
           i tre+.distincta takt, nummrutorna kontradriftar mot sina kort,
           pris-/etikettchips svävar, gallerikropparnas märken driver isär,
           sidfotens kolumner möts, knappar gungar mjukt. Amp 7–30 px. */
    driftLoop('.service-card', [22, 18, 26, 15, 20], 'x');       /* ≥3 takter */
    driftLoop('.service-num', [26, 18, 30, 15, 22], 'y');
    driftLoop('.price-line', [10, 8, 12, 7, 9], 'x');
    driftLoop('.service-card > div > p:not(.price-line)', [11, 9, 10], 'y');
    driftLoop('.om-text p', [12, 9, 7], 'y');
    drift('.hero-sub', null, 14);
    driftLoop('.gallery-card', [15, 12, 16, 11, 14, 13], 'y');
    driftLoop('.gallery-card__tag', [9, 8, 10], 'y');
    driftLoop('.gallery-card__title', [11, 9, 12], 'x');
    driftLoop('.eyebrow', [13, 10, 14, 11, 12, 9], 'x');
    /* AUDIT-FIX r1 (2026-10-07): y-ampen justerad så att summan av två
       grannar (max 12 px) alltid understiger grid-gapet (16 px) — listan
       kan inte längre målas genom sig själv vid full drift.
       x-driften på etiketterna är ofarlig: egen rad, kvar inom kortets
       padding (24 px). */
    driftLoop('.contact-list li', [6, 5, 7, 4, 6, 3], 'y');
    driftLoop('.contact-label', [9, 7, 10, 8], 'x');
    driftLoop('.contact-form label', [9, 8, 7], 'y');
    drift('.form-honesty', null, -9);
    drift('.demo-badge', 22, null);
    drift('.needs-js-note', null, -12);
    driftLoop('.booking-day', [15, 17, 11], 'y');
    driftLoop('.booking-day__head', [9, 7, 8], 'x');
    driftLoop('.slot', [10, 12, 9, 11], 'y');
    driftLoop('.site-footer nav a', [7, 5, 8, 6, 6, 4], 'x');
    drift('.site-footer__inner > div', 22, null);
    drift('.site-footer nav', -24, null);
    driftLoop('.site-nav a:not(.btn)', [6, 5, 7], 'x');
    drift('.site-header .brand', 8, null);
    driftLoop('.btn', [8, 9, 7, 8, 9, 7, 8], 'y');

    /* 7 · GALLERIKORTEN "närmar sig" (ZOOM/djup, scrubbar): korten sväller
           mot 1.0 i rullarens mitt och drar tillbaka sig vid kanten — samma
           rörelse som det nedlagda CSS-view-fallet/IO-fallbacket gav, nu scroll-
           driven i webbläsaren. Trigger: kortet i den HORISENTELLA rullaren. */
    var scroller = document.querySelector('[data-gallery-scroller]');
    if (scroller) {
      g.utils.toArray('.gallery-card').forEach(function (card) {
        var tl = g.timeline({
          scrollTrigger: {
            trigger: card, scroller: scroller, horizontal: true,
            start: 'left right', end: 'right left', scrub: 0.6
          }
        });
        tl.fromTo(card, { scale: 0.9 }, { scale: 1, ease: 'power1.inOut', duration: 1 }, 0)
          .to(card, { scale: 0.9, ease: 'power1.inOut', duration: 1 }, 1);
      });
    }

    /* Rensning vid mediebeovakelse-byte/refresh: motorn töms och alla
       drift-transformer återställs till flödesläget — hanteraren fyller på
       igen (motorn bor på modulnivå, inga dubbla lyssnare). */
    return function () { driftReset(); };
  });

  /* PINNAT FROSTÖGONBLICK (PIN): gallerirubriken fryser fast under sidhu-
     vudet och kläs i frost medan galleriet rullar förbi — sektionens lugna
     landning. Endast på bred skärm och utan reduced motion; utan JS/pin är
     rubriken ett vanligt block.
     AUDIT-FIX r1 (2026-10-07): pinSpacing false — tidigare lade spacet
     ~600 px tom gradient mellan rubrik och kort (nästan två tomma
     skärmar). Nu ligger korten direkt under rubriken och glider under
     det frysta frostbandet, i stället för att vänta inför. */
  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 760px)', function () {
    var head = document.querySelector('.galleri-head');
    if (!head) { return; }
    var pin = ST.create({
      trigger: head,
      start: 'top 84px',
      end: '+=600',
      pin: head,
      pinSpacing: false,
      toggleClass: { targets: head, className: 'is-frozen' }
    });
    g.fromTo(head,
      { backgroundColor: 'rgba(247, 248, 244, 0)' },
      { backgroundColor: 'rgba(247, 248, 244, 0.72)', ease: 'none',
        scrollTrigger: { trigger: '#galleri', start: 'top 84px',
                         end: '+=120', scrub: true } });
    return function () { pin.kill(); };
  });

  /* Reflow-säkerhet: webbfonter (Google) kan bytas in EFTER first paint och
     flytta dokumenthöjden ~580 px — sektionstrigglarnas absoluta start/end
     blir då för gamla. En omräkning vid load + när fonterna är redo håller
     dem sanna. Driftmotorn är redan refresh-säker: GSAP återkör matchMedia-
     hanterarna vid varje refresh, och motorn (modulnivå) överlever det. */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { ST.refresh(); });
  }
  window.addEventListener('load', function () { ST.refresh(); });

  ST.refresh();
}());
