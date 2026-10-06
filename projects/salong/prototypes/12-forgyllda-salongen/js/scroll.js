/* 12 · Den förgyllda salongen — scroll-koreografi (MC 10088 · DENSITY-04c)
   Drivs av lokalt vendor GSAP + ScrollTrigger (ingen CDN, inga nya deps).
   Villkor:
   - Utan JS eller utan vendor-filerna: baskoderna i css/ visar redan SLUTLÄGE
     (allt syns, ingen rörelse) — progressiv förbättring, inte ett beroende.
   - prefers-reduced-motion: reduce: matchMedia-kontexterna registrerar ALDRIG
     triggers — rörelsen hoppas över, inte fejkan.
   - Ingen egen global: allt i IIFE; alla drifts är konvergenta ±A→0 ( aldrig
     ±A→∓A); horisontal x enbart i min-width-kontext (375 px => y only). */
(function () {
  'use strict';
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; } /* vendor saknas → synligt slutläge, tyst */
  g.registerPlugin(ST);

  var mm = g.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', function () {

    /* 1 · Guld-deco-linjer: växer ut från mitten när sektionen kliver in;
         hållaren driver mjukt och solfläcken ✦ vrider sig till ro. */
    g.utils.toArray('.deco-rule').forEach(function (rule) {
      g.fromTo(rule.querySelectorAll('.deco-rule__line'),
        { scaleX: 0 },
        { scaleX: 1, ease: 'none',
          scrollTrigger: { trigger: rule, start: 'top 92%', end: 'top 34%', scrub: 0.6 } });
      g.fromTo(rule, { y: 16 }, { y: 0, ease: 'none',
        scrollTrigger: { trigger: rule, start: 'top bottom', end: 'top 40%', scrub: 0.6 } });
      g.fromTo(rule.querySelector('.deco-rule__fan'), { rotate: -40 }, { rotate: 0, ease: 'none',
        scrollTrigger: { trigger: rule, start: 'top 90%', end: 'top 36%', scrub: 0.6 } });
    });

    /* 2 · Sektionernas deco-ramar: hairline sträcks ritas (från CSS timeline)
         — och ramen driver långsamt mot sitt läge (mot-parallax mot rubriken) */
    g.utils.toArray('.sec-frame').forEach(function (frame) {
      g.fromTo(frame.querySelector('.sec-frame__rect'),
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, ease: 'none',
          scrollTrigger: { trigger: frame, start: 'top 88%', end: 'top 26%', scrub: 0.5 } });
      g.fromTo(frame, { y: 22 }, { y: 0, ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'top 30%', scrub: 0.6 } });
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
         och guldfilm över sec-ytor (sen fas) — båda scrubade mot progress.
         Glöden skalar och filmen vrider sig långsamt över hela sidan:
         bakgrunden andas alltid, aldrig stilla. */
    var amb = g.timeline({
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
    });
    amb.fromTo('.amb-glow', { opacity: 0 }, { opacity: 1, duration: 0.40, ease: 'none' }, 0.02)
       .fromTo('.amb-film', { opacity: 0 }, { opacity: 0.2, duration: 0.25, ease: 'none' }, 0.38);
    g.to('.amb-glow', { scale: 1.06, ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 1 } });
    g.to('.amb-film', { rotate: 5, ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 1 } });

    /* 5b · Sektionernas egen yta glider smaragd → djupt guld under scrollen
          (samma beräknade AA-golv som filmen: guld/text ≥ 4.8:1 över allt) */
    g.utils.toArray('.sec:not(.sec--ink)').forEach(function (sec) {
      g.fromTo(sec, { backgroundColor: '#0d211b' },
        { backgroundColor: '#2b1c07', ease: 'none',
          scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top top', scrub: true } });
    });

    /* 6 · Pinn-ögonblick: mässings-solfjädern rider galleriet (sticky i CSS,
          rotation + andning scrubad över sektionen); etiketten mot-driftar */
    g.fromTo('.pin-sun', { rotate: 0, scale: 1 },
      { rotate: 132, scale: 1.12, ease: 'none',
        scrollTrigger: { trigger: '#galleri', start: 'top bottom', end: 'bottom top', scrub: true } });
    g.fromTo('.pin-plate__label', { y: -12 }, { y: 0, ease: 'none',
      scrollTrigger: { trigger: '#galleri', start: 'top bottom', end: 'bottom top', scrub: 0.8 } });

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

    /* 8 · Boka: veckokolonnerna lyfter in stegrat mot scrollen; tidsrutorna
         följer i fin stegring och tänds; raderna under andas upp på plats */
    g.fromTo('.week__day', { yPercent: 22, autoAlpha: 0.12 },
      { yPercent: 0, autoAlpha: 1, ease: 'none', stagger: 0.07,
        scrollTrigger: { trigger: '.week', start: 'top 96%', end: 'top 44%', scrub: 0.7 } });
    g.fromTo('.slot', { y: 16, autoAlpha: 0.3 },
      { y: 0, autoAlpha: 1, ease: 'none', stagger: 0.03,
        scrollTrigger: { trigger: '.week', start: 'top 92%', end: 'top 36%', scrub: 0.7 } });
    g.fromTo('.demo-badge, .boka-legend, .boka-plain', { y: 12, autoAlpha: 0.35 },
      { y: 0, autoAlpha: 1, ease: 'none', stagger: 0.06,
        scrollTrigger: { trigger: '#boka', start: 'top 84%', end: 'top 38%', scrub: 0.6 } });

    /* 9 · Kontakt: formulär- och besökskorten glider isär till sina platser
         (vertikal mot-drift: korten möts från varsitt håll) */
    g.fromTo('.cf', { xPercent: -4, y: -24, autoAlpha: 0.2 },
      { xPercent: 0, y: 0, autoAlpha: 1, ease: 'none',
        scrollTrigger: { trigger: '.kontakt-grid', start: 'top 86%', end: 'top 52%', scrub: 0.6 } });
    g.fromTo('.visit', { xPercent: 4, y: 24, autoAlpha: 0.2 },
      { xPercent: 0, y: 0, autoAlpha: 1, ease: 'none',
        scrollTrigger: { trigger: '.kontakt-grid', start: 'top 86%', end: 'top 52%', scrub: 0.6 } });
    g.fromTo('.visit__hairline', { scaleX: 0.1 },
      { scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: '.visit', start: 'top 84%', end: 'top 44%', scrub: 0.6 } });

    /* 10 · Rubrik-kit: ramen driver, ögonbrynet landar, huvudrubriken klipps
         fram ord-för-ord (behållaren bevarar layouten; JS-byggt = synligt
         även utan skript). Alla drifts konvergerar mot slutläget. */
    function wrapWords(h) {
      if (h.querySelector('.h2w')) { return h.querySelectorAll('.h2w > i'); }
      var words = (h.textContent || '').trim().split(/\s+/);
      h.textContent = '';
      words.forEach(function (w, k) {
        var o = document.createElement('span'); o.className = 'h2w';
        var i = document.createElement('i'); i.textContent = w;
        o.appendChild(i); h.appendChild(o);
        if (k < words.length - 1) { h.appendChild(document.createTextNode(' ')); }
      });
      return h.querySelectorAll('.h2w > i');
    }
    g.utils.toArray('.sec-head').forEach(function (head, i) {
      var win = { trigger: head, start: 'top bottom', end: 'top 30%', scrub: 0.6 };
      g.fromTo(head.querySelector('.eyebrow'), { y: 16, autoAlpha: 0.15 },
        { y: 0, autoAlpha: 1, ease: 'none', scrollTrigger: win });
      var h2 = head.querySelector('h2');
      g.fromTo(h2, { y: 26 + i * 3 }, { y: 0, ease: 'none', scrollTrigger: win });
      g.fromTo(wrapWords(h2), { yPercent: 118 },
        { yPercent: 0, ease: 'none', stagger: 0.08, scrollTrigger: win });
    });

    /* 11 · Guld-damm: sektionernas och footens gnistor glider uppåt och
         tänds — olika amplituder per gnista ger egen takt per sektion. */
    g.utils.toArray('.emberfield').forEach(function (f) {
      var host = f.parentElement;
      g.utils.toArray(f.children).forEach(function (sp, k) {
        g.fromTo(sp, { y: 18 + ((k * 37) % 34), autoAlpha: 0.04 },
          { y: 0, autoAlpha: 0.6, ease: 'none',
            scrollTrigger: { trigger: host, start: 'top bottom', end: 'top 26%', scrub: 0.7 } });
      });
    });

    /* 12 · Mörka paneler i parallax — tre+ långsamma takter: tjänste-
         korten, tavlorna (mot-drift mot bildtexten), porträttramen och
         om-kolumnen glider åt varsitt håll, alla ±A→0. */
    g.fromTo('.svc', { y: 34 }, { y: 0, ease: 'none', stagger: 0.12,
      scrollTrigger: { trigger: '.svc-grid', start: 'top bottom+=30%', end: 'top 32%', scrub: 0.8 } });
    g.fromTo('.svc__price', { y: 12, autoAlpha: 0.3 },
      { y: 0, autoAlpha: 1, ease: 'none', stagger: 0.08,
        scrollTrigger: { trigger: '.svc-grid', start: 'top 82%', end: 'top 34%', scrub: 0.7 } });
    g.fromTo('.om-text', { y: 26 }, { y: 0, ease: 'none',
      scrollTrigger: { trigger: '.om-grid', start: 'top bottom', end: 'top 34%', scrub: 0.7 } });

    /* 13 · Porträttet Ken Burns inuti den förgyllda ramen — ramen själv
         driver — och tavlor + bildtexter mot-driftar i egen takt. */
    g.fromTo('.goldframe--portrait', { y: 30 }, { y: 0, ease: 'none',
      scrollTrigger: { trigger: '.om-grid', start: 'top bottom', end: 'top 30%', scrub: 0.8 } });
    g.fromTo('.goldframe--portrait img', { scale: 1.16 }, { scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.om-grid', start: 'top bottom', end: 'top 26%', scrub: 0.8 } });
    var PLATEY = [18, 36, 24, 42];
    g.utils.toArray('.plate').forEach(function (plate, i) {
      g.fromTo(plate, { y: PLATEY[i % PLATEY.length] },
        { y: 0, ease: 'none',
          scrollTrigger: { trigger: '.gallery', start: 'top bottom+=20%', end: 'top 40%', scrub: 0.9 } });
      var im = plate.querySelector('img');
      if (im) {
        g.fromTo(im, { scale: 1.07 }, { scale: 1, ease: 'none',
          scrollTrigger: { trigger: plate, start: 'top bottom', end: 'top 45%', scrub: 0.8 } });
      }
      var cap = plate.querySelector('figcaption');
      if (cap) {
        g.fromTo(cap, { y: -12, autoAlpha: 0.2 }, { y: 0, autoAlpha: 1, ease: 'none',
          scrollTrigger: { trigger: plate, start: 'top 88%', end: 'top 40%', scrub: 0.6 } });
      }
    });

    /* 14 · Foot: texten landar stegrat och dekor-sniren ✦ vrider sig till
         ro var för sig — avskedet rör på sig lika noggrant som entrén. */
    g.fromTo('.foot p', { y: 18, autoAlpha: 0.25 },
      { y: 0, autoAlpha: 1, ease: 'none', stagger: 0.08,
        scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: 0.7 } });
    g.fromTo('.foot__orn .orn', { rotate: -16, y: 10, autoAlpha: 0.15 },
      { rotate: 0, y: 0, autoAlpha: 1, ease: 'none', stagger: 0.15,
        scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: 0.7 } });

    /* 15 · Hörn-prydnader (JS-byggda, dekorativa): fyra små guldsmycken
         vrider sig långsamt över hela sidan — sidan står aldrig stilla. */
    if (!document.querySelector('.deco-tick')) {
      ['0', '1', '2', '3'].forEach(function (n) {
        var t = document.createElement('span');
        t.className = 'deco-tick deco-tick--' + n;
        t.setAttribute('aria-hidden', 'true'); t.textContent = '❖';
        document.body.appendChild(t);
      });
    }
    g.to('.deco-tick', { rotate: 20, ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 1 } });

    /* 16 · Guld-simmer: gradientens glans går över samtliga guldkants-
         och guldunderrubriker — ett enda scrub, många element, gratis.
         Gradientens mörkaste stopp = befintligt guld → AA oförändrat. */
    g.utils.toArray('h1, .eyebrow, .svc__price, .goldframe figcaption, .foot__orn')
      .forEach(function (e) { e.classList.add('gild'); });
    g.fromTo('.gild', { backgroundPositionX: '0%' },
      { backgroundPositionX: '170%', ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 1 } });
  });

  /* Bred vy (>640 px, ej reduce): prismen glider dessutom horisontellt på
     plats — bas allt som störst vid 375 px hålls x-fritt. */
  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 641px)', function () {
    g.fromTo('.svc__price', { x: -18 }, { x: 0, ease: 'none', stagger: 0.08,
      scrollTrigger: { trigger: '.svc-grid', start: 'top 82%', end: 'top 34%', scrub: 0.7 } });
  });
}());
