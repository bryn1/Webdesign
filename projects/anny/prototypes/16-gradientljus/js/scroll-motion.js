/* 16 · Gradientljus — scroll-koreografi (MC 10088, ägarens JS-regel 2026-10-05).
   DENSITY-01a (2026-10-05): tät scrubbad rörelse — alla sektioner har ≥2 levande
   element i viewport-bandet; mål ≥55 % ever-change + median ≥45 movers/steg.
   GSAP + ScrollTrigger lokalt vendor (../_assets/vendor/) — ingen CDN, inga egna
   globals. All rörelse registreras ENDAST i (prefers-reduced-motion: no-preference):
   med reduce körs ingenting och allt står redan i CSS i sitt synliga slutläge.
   Utan JS/bibliotek händer nada — innehållet är fullt läsbart (default-visible).
   En enda fil äger ScrollTrigger-registreringen (den här). */
(function () {
  'use strict';
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; }                      // biblioteken saknas → statisk sida
  g.registerPlugin(ST);

  var mm = g.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {
    var doc = document;
    var active = true;                             // matchMedia revert → stoppa async bygge

    /* delad scrubband-fabrik: hela sektions-/elementtransiten genom vyn */
    function band(trigger, start, end) {
      return { trigger: trigger, start: start || 'top bottom', end: end || 'bottom top', scrub: true };
    }

    /* 0 · HUE-DRIFT: hela sidans bakgrundston vrider 0→26 grader över sidan —
       body, toner och alla ytor (kort, dagar, dialog, formulär, header, footer)
       får en mjukt vandrande kulör. Objekt + setProperty → enhetslöst, ingen plugin. */
    var hd = { v: 0 };
    g.to(hd, {
      v: 26, ease: 'none',
      onUpdate: function () { doc.documentElement.style.setProperty('--hd', String(hd.v)); },
      scrollTrigger: band(doc.body, 'top top', 'bottom bottom')
    });

    /* 1 · FÄRG: gradienttexten sveper 0→100 % genom hela sidan — ljusfältets
           position följer scrollflödet (scrubbad, kontinuerlig). */
    g.utils.toArray('.grad-text').forEach(function (el) {
      g.fromTo(el, { backgroundPosition: '0% 50%' }, {
        backgroundPosition: '100% 50%', ease: 'none',
        scrollTrigger: band(doc.body, 'top top', 'bottom bottom')
      });
    });

    /* 2 · HERO-MESH: fyra ljuslager driver MOT varandra med olika takter när
           hero:n försvinner uppåt (parallax) + långsam puls på samma lager. */
    var layerDrift = [
      ['.mesh-layer--violet', { y: 30, x: -8 }],
      ['.mesh-layer--rose',   { y: -18, x: 10 }],
      ['.mesh-layer--amber',  { y: 12, x: 16 }],
      ['.mesh-layer--blue',   { y: 42, x: -14 }]
    ];
    layerDrift.forEach(function (pair) {
      var el = doc.querySelector(pair[0]);
      if (!el) { return; }
      g.fromTo(el, { yPercent: -pair[1].y / 2, xPercent: -pair[1].x / 2 }, {
        yPercent: pair[1].y / 2, xPercent: pair[1].x / 2, ease: 'none',
        scrollTrigger: band('.hero', 'top top', 'bottom top')
      });
      /* mjuk puls — skala är en egen transform-kanal så den samexisterar med drift */
      g.to(el, {
        scale: el.classList.contains('mesh-layer--rose') ? 0.92 : 1.12,
        duration: 14 + pair[0].length, ease: 'sine.inOut', yoyo: true, repeat: -1
      });
    });

    /* 3 · HERO-Parallax: hero-innehållet hänger efter och glider långsammare
           än scrollen (amplitude < herons bottenpadding → klipps aldrig). */
    g.fromTo('.hero__inner', { y: 0 }, {
      y: 58, ease: 'none', scrollTrigger: band('.hero', 'top top', 'bottom top')
    });

    /* 4 · SEKTIONSGLÖD: tänds .55→1 OCH driver i motriktad parallax genom hela
           sektionen — varje sektion får levande ljus under hela transiten. */
    g.utils.toArray('.section__glow').forEach(function (glow, i) {
      var dir = i % 2 ? -1 : 1;
      var tl = g.timeline({ scrollTrigger: band(glow.parentElement) });
      tl.fromTo(glow, { opacity: 0.55 }, { opacity: 1, ease: 'none' }, 0);
      tl.fromTo(glow, { y: -44 * dir }, { y: 44 * dir, ease: 'none' }, 0);
    });

    /* 5 · AURA-BLOBBAR: dekortiga ljuskroppar driver i motrikt tempo genom
           sektionerna (counter-speed mot glöden i samma band). */
    g.utils.toArray('.aura').forEach(function (aura, i) {
      var dir = i % 2 ? 1 : -1;
      g.fromTo(aura, { y: 56 * dir, x: 24 * dir }, {
        y: -56 * dir, x: -24 * dir, ease: 'none',
        scrollTrigger: band(aura.parentElement)
      });
    });

    /* 6 · LINJE: ljushåren ritas fram scaleX 0→1 vid varje sektionsgräns (scrub). */
    g.utils.toArray('.light-rule').forEach(function (rule) {
      g.fromTo(rule, { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: band(rule.parentElement, 'top bottom', 'top 55%')
      });
    });

    /* 7 · RUBRIKER rad för rad: texten delas i rendererade rader (ord-prober
           mäts efter att fonterna kommit) — varje rad klips fram yPercent
           125→0 scrubbat över rubrikens inträde. Utan JS/reduce: ingen split,
           rubrikerna står orörda (samma svenska text inuti spanarna). */
    function ensureSplit(el) {
      var inners = g.utils.toArray('.split-inner', el);
      if (inners.length) { return inners; }        // redo efter revert: återanvänd
      var words = (el.textContent || '').trim().split(/\s+/).filter(Boolean);
      if (!words.length) { return []; }
      el.textContent = '';
      var lines = [];
      var lineTop = null;
      words.forEach(function (w) {
        var probe = doc.createElement('span');
        probe.textContent = w;
        el.appendChild(probe);
        var t = Math.round(probe.getBoundingClientRect().top);
        if (lineTop === null || Math.abs(t - lineTop) > 5) { lines.push([]); lineTop = t; }
        lines[lines.length - 1].push(w);
        el.removeChild(probe);
      });
      el.classList.add('is-split');
      return lines.map(function (line) {
        var wrap = doc.createElement('span');
        wrap.className = 'split-wrap';
        var inner = doc.createElement('span');
        inner.className = 'split-inner';
        inner.textContent = line.join(' ');
        wrap.appendChild(inner);
        el.appendChild(wrap);
        return inner;
      });
    }
    function revealHeadings() {
      if (!active) { return; }
      g.utils.toArray('h1.display, h2.display').forEach(function (heading) {
        if (heading.closest('dialog')) { return; } // dialog syns erst — ingen clip
        var found = ensureSplit(heading);
        if (!found.length) { return; }
        var tl = g.timeline({ scrollTrigger: band(heading, 'top bottom', 'top 40%') });
        found.forEach(function (inner) {
          tl.fromTo(inner, { yPercent: 125 }, { yPercent: 0, ease: 'none' });
        });
      });
      ST.refresh();
    }
    if (doc.fonts && doc.fonts.ready && doc.fonts.ready.then) {
      doc.fonts.ready.then(revealHeadings);
    } else {
      revealHeadings();
    }

    /* 8 · ÖGONPARALLAX: varje eyebrow glider lätt mot sitt rubrikband så även
           brödtextzonen har skrapande rörelse i viewport. */
    g.utils.toArray('.eyebrow').forEach(function (eb, i) {
      var dir = i % 2 ? 1 : -1;
      g.fromTo(eb, { y: 18 * dir }, {
        y: -18 * dir, ease: 'none',
        scrollTrigger: band(eb.closest('section') || eb.parentElement)
      });
    });

    /* 9 · PORTRÄTT: Ken Burns scrubbad — skala 1.06→1.0 medan figuren förbifarter
           plus liten y-drift (skalan håller bildytan täckande hela vägen). */
    var portrait = doc.querySelector('.portrait img');
    if (portrait) {
      g.fromTo(portrait, { scale: 1.06, yPercent: 1.5 }, {
        scale: 1, yPercent: -1.5, ease: 'none',
        scrollTrigger: band('.portrait')
      });
    }
    var omCol = doc.querySelector('#om .om-grid > div');
    if (omCol) {
      g.fromTo(omCol, { y: 36 }, { y: -30, ease: 'none', scrollTrigger: band('#om') });
    }

    /* 10 · STAGRAD PARALLAX: tjänstekort, galleriplattor och bokningsdagar
            flyter i alternerande riktning — grannar glider mot/varifrån
            varandra scrubbat över hela transitbandet (20–40 px tak). */
    g.utils.toArray('.card').forEach(function (card, i) {
      var dir = i % 2 ? 1 : -1;
      g.fromTo(card, { y: 30 * dir }, { y: -30 * dir, ease: 'none', scrollTrigger: band(card) });
    });
    g.utils.toArray('.gallery__tile').forEach(function (tile, i) {
      var dir = i % 2 ? -1 : 1;
      g.fromTo(tile, { y: 40 * dir }, { y: -40 * dir, ease: 'none', scrollTrigger: band(tile) });
    });
    g.utils.toArray('.day').forEach(function (day, i) {
      var dir = i % 2 ? 1 : -1;
      g.fromTo(day, { y: 26 * dir }, { y: -26 * dir, ease: 'none', scrollTrigger: band(day) });
    });

    /* 11 · ZOOM: gallerifoton landar 1.08→1.0 vid inträde och glider ut i 1.05
            (Ken Burns över scrollflöde, inte klocka — scrubbad). */
    g.utils.toArray('.gallery__tile img').forEach(function (img) {
      var tl = g.timeline({ scrollTrigger: band(img) });
      tl.fromTo(img, { scale: 1.08 }, { scale: 1, ease: 'none', duration: 0.65 }, 0);
      tl.to(img, { scale: 1.05, ease: 'none', duration: 0.35 }, 0.65);
    });

    /* 12 · KONTAKT + SIDFOT: kontakt-kolumnerna driver mot varandra och
            sidfotens innehåll glider lätt — sista bandet är aldrig stilla. */
    var cCard = doc.querySelector('.contact-card');
    if (cCard) {
      g.fromTo(cCard, { y: 24 }, { y: -24, ease: 'none', scrollTrigger: band(cCard) });
    }
    var cForm = doc.querySelector('.contact-form');
    if (cForm) {
      g.fromTo(cForm, { y: -24 }, { y: 24, ease: 'none', scrollTrigger: band(cForm) });
    }
    var footIn = doc.querySelector('.site-footer__inner');
    if (footIn) {
      g.fromTo(footIn, { y: 16 }, { y: -16, ease: 'none', scrollTrigger: band('.site-footer') });
    }

    return function () { active = false; };        // revert-städning för async split
  });

  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 721px)', function () {
    /* 13 · PINNAD ÖGONBLICK: ljusstrålen hålls stilla medan galleriet förbifarter
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
