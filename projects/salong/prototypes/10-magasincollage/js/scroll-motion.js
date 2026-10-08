/* 10 · Magasincollage — scroll-koreografi (MC 10088, ägarens JS-regel 2026-10-05;
   DENSITY-01c 2026-10-05: djup flerskiktsparallax — "mer som rör på sig").
   GSAP + ScrollTrigger lokalt vendor (../_assets/vendor/) — ingen CDN, inga egna
   globals. All rörelse registreras ENDAST i (prefers-reduced-motion: no-preference):
   med reduce satt skapas noll triggers och allt står redan i CSS i sitt synliga
   slutläge. Utan JS/bibliotek händer nada — kollaget är ett vanligt rutnät och
   dekorerna (.torn-strip/.scrap/.hair-rule) syns inte alls.
   Denna fil ERSÄTTER scrollmekanikerna i js/collage.js; drag-interaktionen
   (icke-scroll) bor kvar där. Ritningen styrs via CSS-var (--py/--sx/--sy/--r2/
   --k) så att kortens rotation (--rot) och klistermärkens lutning aldrig räknas om. */
(function () {
  'use strict';
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; }                        // biblioteken saknas → statisk sida
  g.registerPlugin(ST);

  var root = document.documentElement;

  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function secOf(el) { return el.closest('section') || el.parentElement; }

  /* scrubbd linjär tween: from→to under triggerns band */
  function scrub(el, fromVars, toVars, trigger, start, end) {
    if (!el) { return; }
    toVars.ease = 'none';
    toVars.scrollTrigger = { trigger: trigger || el, start: start || 'top bottom',
                             end: end || 'bottom top', scrub: true };
    g.fromTo(el, fromVars, toVars);
  }

  /* ord-/bokstavssplit: endast i no-preference-grenen, återställs vid revert */
  function splitInto(el, byWord) {
    var text = el.textContent;
    var frag = document.createDocumentFragment();
    text.trim().split(byWord ? /\s+/ : '').forEach(function (piece, i) {
      if (byWord && i) { frag.appendChild(document.createTextNode(' ')); }
      var span = document.createElement('span');
      span.className = byWord ? 'split-word' : 'split-letter';
      span.textContent = piece;
      frag.appendChild(span);
    });
    el.textContent = '';
    el.appendChild(frag);
    return function () { el.textContent = text; };
  }

  function boot() {
  var mm = g.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {
    /* Tänder collage-läget i CSS (samma spärr som tidigare collage.js). */
    root.setAttribute('data-motion', 'on');
    var restore = [];

    /* 1 · RIVLINJE (draw, scrubbad): den taggade rivkanten ritas från vänster
           till höger medan sin sektion glider in — papper rivs, inget klipps. */
    $$('.tear-rule path').forEach(function (path) {
      var svg = path.closest('svg');
      var len = path.getTotalLength();
      var hero = svg.closest('#top');
      g.set(path, { strokeDasharray: String(len), strokeDashoffset: len });
      g.to(path, {
        strokeDashoffset: 0, ease: 'none',
        scrollTrigger: hero
          ? { trigger: '#top', start: 'top top', end: 'bottom 60%', scrub: true }
          : { trigger: svg.closest('section') || svg.parentElement,
              start: 'top 88%', end: 'top 32%', scrub: true }
      });
    });

    /* 2 · PAPPERSTON (color, scrubbad): sidans botten dras från färskt cream
           mot mörknat tidningspapper genom hela Bläddringen. */
    g.fromTo(document.body, { backgroundColor: '#fbf7f2' }, {
      backgroundColor: '#f3ece2', ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
    });

    /* 3 · ZOOM (scrubbad): porträtt och kollagefoton sätter sig i sina tejpade
           ramar; ramen själv andas 1→1.05 medan kortet glider in. */
    scrub('.portrait-frame', { scale: 1 }, { scale: 1.05 }, '.portrait-card', 'top bottom', 'top 30%');
    var portraitImg = document.querySelector('.portrait-frame img');
    if (portraitImg) {
      g.fromTo(portraitImg, { scale: 1.14 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: '.portrait-card', start: 'top bottom', end: 'top 30%', scrub: true }
      });
    }
    $$('.postcard img').forEach(function (img) {
      g.fromTo(img, { scale: 1.08 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: img.closest('.postcard'), start: 'top bottom', end: 'top 55%', scrub: true }
      });
    });

    /* 4 · KONTURBYTE: display-rubrikerna klipps till kontur mitt i synfältet. */
    $$('[data-outline]').forEach(function (el) {
      ST.create({
        trigger: el, start: 'top 72%', end: 'bottom 28%',
        toggleClass: { className: 'is-outline', targets: el },
        toggleActions: 'add remove remove add'
      });
    });

    /* 5 · RANSOM-NOTE-ORD (scrubbad): varje h2-splittras i ord som glider in på
           var sitt djup — tidningens sattning som lossnat i pappershögarna.
           (Hero-titeln bokstavsplittras i bredskärm-blocket, se 10.) */
    $$('h2[data-outline]').forEach(function (h2, hi) {
      if (h2.children.length) { return; }
      restore.push(splitInto(h2, true));
      scrub(h2, { x: hi % 2 ? 16 : -16 }, { x: 0 }, secOf(h2), 'top bottom', 'top 35%');
      $$('.split-word', h2).forEach(function (w, i) {
        var amp = 6 + (i % 3) * 8;                         // 6–22 px — ~8 px lugnare per rad
        scrub(w, { y: i % 2 ? -amp : amp, x: i % 2 ? 6 : -6 }, { y: 0, x: 0 }, h2, 'top bottom', 'top 28%');
      });
    });

    /* 6 · TEJPADE SKRÄPS: rotationen på kollagekorten gungar ±2,2–4,2 grader
           medan de passerar — brevet som lossnar i tejpen. (--r2 läggs till i
           CSS:transform-uttrycket; --rot förblir orört.) */
    $$('.postcard').forEach(function (card, i) {
      var amp = 2.2 + (i % 3);
      scrub(card, { '--r2': (i % 2 ? amp : -amp) + 'deg' },
                  { '--r2': (i % 2 ? -amp : amp) + 'deg' }, card, 'top bottom', 'bottom top');
    });

    /* 7 · PAPPERSDJUP: ögonblicksrader, brödtextstycken och adressrader driver
           på varsitt tempo — varje synfält har flera levande lager. */
    $$('.eyebrow').forEach(function (el, i) {
      scrub(el, { y: i % 2 ? 26 : -22 }, { y: 0 }, secOf(el), 'top bottom', 'bottom 25%');
    });
    $$('.om-text > p:not(.eyebrow), .address p, .note, .gallery-hint').forEach(function (el, i) {
      scrub(el, { y: 18 + (i % 3) * 14 }, { y: -8 }, secOf(el), 'top bottom', 'bottom 25%');
    });
    scrub('.portrait-card', { '--py': '-28px' }, { '--py': '22px' }, secOf(document.querySelector('.portrait-card')));

    /* 8 · TJÄNSTEKORTEN: var sitt kort driver och gungar — fem lösa lappar. */
    $$('.service-card').forEach(function (card, i) {
      var amp = 26 + (i % 4) * 9;                          // 26–53 px
      scrub(card,
        { '--sy': (i % 2 ? amp : -amp) + 'px', '--srot': (i % 2 ? 1.6 : -1.8) + 'deg' },
        { '--sy': (i % 2 ? -amp * 0.6 : amp * 0.6) + 'px', '--srot': (i % 2 ? -0.8 : 1.1) + 'deg' },
        card, 'top bottom', 'bottom 25%');
    });

    /* 9 · HORISONTALLIR (pull-quote-mönstret): klistermärken och ledtrådar
           glider sidledes medan man passerar deras sektion. */
    scrub('.hero-sticker', { '--sx': '30px' }, { '--sx': '-26px' }, '#top', 'top top', 'bottom 42%');
    scrub('.scroll-hint', { y: 26 }, { y: -18 }, '#top', 'top top', 'bottom 42%');
    scrub('.gallery-hint', { x: 34 }, { x: -24 }, '#galleri', 'top bottom', 'bottom top');
    $$('.demo-badge').forEach(function (el, i) {
      scrub(el, { '--sx': (i % 2 ? 28 : -30) + 'px' },
                  { '--sx': (i % 2 ? -20 : 22) + 'px' }, secOf(el), 'top bottom', 'bottom 30%');
    });
    scrub('.cal-legend', { y: 18 }, { y: -14 }, '.booking-layout');
    /* Kalendarplankan som helhet driver som en tejpad tavla — cellerna följer med. */
    scrub('.cal-grid', { y: 24 }, { y: -18 }, '.booking-layout');

    /* 10 · RIVNA REMSOR (motdrag): bakom-text-remsorna åker motsatt väg mot
            scrollen — kollagets djupaste lager. */
    $$('.torn-strip').forEach(function (el, i) {
      var amp = 44 + i * 5;                               // 44–59 px
      scrub(el, { '--py': -amp + 'px' }, { '--py': amp + 'px' }, secOf(el), 'top bottom', 'bottom top');
    });

    /* 11 · HÅRLINJER: hairline-reglerna ritas ut när sektionen kliver in. */
    $$('.hair-rule').forEach(function (el) {
      scrub(el, { '--k': 0 }, { '--k': 1 }, el, 'top 88%', 'top 30%');
    });

    /* 12 · PAPPERSFLAGOR: marginalflagorna driver varsitt — billigaste djupet. */
    $$('.scrap').forEach(function (el, i) {
      var amp = 30 + (i % 5) * 7;                         // 30–58 px
      scrub(el, { '--py': (i % 2 ? -amp : amp) + 'px' },
                  { '--py': (i % 2 ? amp : -amp) + 'px' }, secOf(el), 'top bottom', 'bottom top');
    });

    /* 13 · SIDFOTEN: de sista lagerplattorna glider isär på varsitt djup. */
    scrub('.footer-brand', { y: 26 }, { y: -16 }, '.site-footer');
    scrub('.footer-nav', { y: -30 }, { y: 18 }, '.site-footer', 'top bottom', 'bottom top');
    $$('.footer-note').forEach(function (el, i) {
      scrub(el, { y: i % 2 ? -22 : 20 }, { y: i % 2 ? 10 : -12 }, '.site-footer');
    });

    return function () { restore.forEach(function (fn) { fn(); }); };
  });

  /* 14 · MOTDRIFT + PIN + BOKSTAVSSPLITT (bred skärm): lösa urklipp — hero-
         omslagen och kollagekorten — driver mot scrollen på var sin hastighet
         (data-speed); hero-titeln bokstavsplittras och varje bokstav glider in
         scrubbad medan omslaget hålls stilla. Rotationsbevarat: GSAP skriver
         bara --py/--fs, CSS:n behåller --rot i transform-uttrycket. */
  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 900px)', function () {
    var restore = [];
    ST.create({
      trigger: '#top', start: 'top 80px', end: 'bottom 42%',
      pin: '.hero-shell'
    });
    $$('.hero-word').forEach(function (word) {
      restore.push(splitInto(word, false));
      $$('.split-letter', word).forEach(function (ch, i) {
        var amp = 18 + (i % 3) * 8;                       // 18–34 px
        scrub(ch, { y: i % 2 ? -amp : amp }, { y: 0 }, '#top', 'top top', 'bottom 42%');
      });
    });
    $$('.hero-float').forEach(function (el) {
      scrub(el, { '--fs': 1 }, { '--fs': 1.05 }, '#top', 'top top', 'bottom 42%');
    });
    $$('[data-speed]').forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-speed')) || 0;
      if (!speed) { return; }
      var hero = el.classList.contains('hero-float');
      var swing = (hero ? 220 : 260) * speed;
      g.fromTo(el, { '--py': (-swing) + 'px' }, {
        '--py': swing + 'px', ease: 'none',
        scrollTrigger: hero
          ? { trigger: '#top', start: 'top top', end: 'bottom top', scrub: true }
          : { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
    return function () { restore.forEach(function (fn) { fn(); }); };
  });

  ST.refresh();
  }

  /* Bokningsgridet byggs av js/booking-mock.js (defer efter denna fil). Under
     defer-körningen är readyState "interactive" — DOMContentLoaded har inte
     brunnit än — så starten väntar på DCL även då: efter alla defer-script är
     .cal-grid byggd och tweenen får sin riktiga target. */
  if (document.readyState === 'complete') { boot(); }
  else { document.addEventListener('DOMContentLoaded', boot); }
})();
