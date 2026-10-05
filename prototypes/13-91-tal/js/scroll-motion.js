/* 13 · 91-tal — scroll-koreografi (MC 10088, ägarens JS-regel 2026-10-05).
   GSAP + ScrollTrigger lokalt vendor (../_assets/vendor/) — ingen CDN.
   All rörelse registreras ENDAST i (prefers-reduced-motion: no-preference):
   med reduce satt körs ingenting och allt står redan i CSS i sitt synliga
   slutläge. Utan JS/bibliotek händer nada — innehållet är fullt läsbart.
   DENSITY-02a (2026-10-05): täta scrubbed-lager — räknare, rutmallar,
   klippreveal, marquee-drift, per-element-parallax. Allt scrubbade läger. */
(function () {
  'use strict';
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; }                          // biblioteken saknas → statisk sida
  g.registerPlugin(ST);

  var mm = g.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {

    /* 1 · LINJE — tjocka bläckregler ritas fram från vänster, scrubbade
           per sektion: sidan fölverkadar direkt på scrollbar-rörelsen. */
    g.utils.toArray('.draw-rule').forEach(function (rule) {
      g.set(rule, { scaleX: 0 });
      g.to(rule, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: rule, start: 'top 92%', end: 'top 42%', scrub: true }
      });
    });

    /* 2 · FÄRG — papperet glider mint → varm gul över hela sidan (scrubbat).
           Bläkk #17171b klarar AA på båda ändarna: 13.3:1 → ca 15:1. */
    g.to(document.body, {
      backgroundColor: '#ffe3ad', ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
    });

    /* 3 · DRIFT — konfetiroterar och driver MOT scrollriktningen, jämn/udda
           former åt var sitt håll: dekorationslagret glider mot innehållet. */
    g.utils.toArray('.confetti').forEach(function (el, i) {
      var cs = getComputedStyle(el);
      var r0 = parseFloat(cs.getPropertyValue('--r0')) || -25;
      var r1 = parseFloat(cs.getPropertyValue('--r1')) || 155;
      var dir = (i % 2 === 0) ? 1 : -1;
      g.fromTo(el,
        { rotation: r0, yPercent: 42 * dir },
        {
          rotation: r1, yPercent: -58 * dir, ease: 'none',
          scrollTrigger: {
            trigger: el.closest('section') || el.parentElement,
            start: 'top bottom', end: 'bottom top', scrub: true
          }
        });
    });

    /* 3b · KONFETTI-SVG — själva figuren andas (skala) och glider ett par
           px tvärs mot pappret: ännu ett rörlager i varje sektionskant. */
    g.utils.toArray('.confetti').forEach(function (el, i) {
      var svg = el.querySelector('svg');
      if (!svg) { return; }
      var dir = (i % 2 === 0) ? 1 : -1;
      var trig = {
        trigger: el.closest('section') || el.parentElement,
        start: 'top bottom', end: 'bottom top', scrub: true
      };
      g.fromTo(svg, { scale: 0.8 }, { scale: 1.18, ease: 'none', scrollTrigger: trig });
      var shape = svg.firstElementChild;
      if (shape) {
        g.fromTo(shape, { x: -5 * dir, y: 4 * dir }, { x: 5 * dir, y: -4 * dir, ease: 'none', scrollTrigger: {
          trigger: el.closest('section') || el.parentElement,
          start: 'top bottom', end: 'bottom top', scrub: true
        } });
      }
    });

    /* 4 · DRIFT (två lager) — Om-sektionen: text och porträtt drifter
           motvarigt mot varandra, tydlig parallax över ett viewport. */
    var omGrid = document.querySelector('.om-grid');
    if (omGrid) {
      var omTl = g.timeline({
        scrollTrigger: { trigger: omGrid, start: 'top bottom', end: 'bottom top', scrub: true }
      });
      omTl.fromTo('.om-text', { yPercent: 6 }, { yPercent: -6, ease: 'none' }, 0);
      omTl.fromTo('.portrait', { yPercent: -8 }, { yPercent: 10, ease: 'none' }, 0);
      omTl.fromTo('.om-text p', { yPercent: 10 }, { yPercent: -10, ease: 'none', stagger: 0.5 }, 0);
    }

    /* 4b · KEN BURNS — porträttet står i 1.15 och sjunker till 1:1 medan
           sektionen korsar vyn; bildtexten glider sidledes (scrubbat). */
    g.utils.toArray('.portrait img').forEach(function (img) {
      g.fromTo(img, { scale: 1.16 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: '.portrait', start: 'top bottom', end: 'center center', scrub: true }
      });
    });
    g.utils.toArray('.portrait figcaption').forEach(function (cap) {
      g.fromTo(cap, { x: -12 }, {
        x: 12, ease: 'none',
        scrollTrigger: { trigger: '.portrait', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* 5 · PIN — hero hålls stilla medan sidan scrollar vidare under den;
           namnblocket krymper långsamt under pinningen (scrubbat). */
    var heroName = document.querySelector('.hero-name');
    if (heroName) {
      g.fromTo(heroName, { scale: 1 }, {
        scale: 0.88, ease: 'none',
        scrollTrigger: {
          trigger: '.hero', start: 'top top', end: '+=70%',
          scrub: true, pin: true, pinSpacing: true
        }
      });
    }

    /* 6 · ZOOM — polaroiderna kliver in i 1.14 och zoom-sätter sig till 1:1
           medan de glider upp i vyn — scrubbat, inte klocka. */
    g.utils.toArray('.polaroid').forEach(function (frame) {
      var tilt = parseFloat(getComputedStyle(frame).getPropertyValue('--tilt')) || 0;
      g.set(frame, { rotation: tilt });               /* CSS-lutningen bevaras */
      g.fromTo(frame, { scale: 1.14 }, {
        scale: 1, ease: 'power1.in',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'top 42%', scrub: true }
      });
    });

    /* 6b · POLAROID-DETALJ — tejp vrids, foto panoreras (object-position +
           en klack), "Bild kommer"-lappar svävar: galleriet lever i varje
           band av rullen. */
    g.utils.toArray('.polaroid').forEach(function (frame, i) {
      var dir = (i % 2 === 0) ? 1 : -1;
      var st = { trigger: frame, start: 'top bottom', end: 'top 35%', scrub: true };
      var tape = frame.querySelector('.tape');
      if (tape) { g.fromTo(tape, { rotation: -8 * dir }, { rotation: 2 * dir, ease: 'none', scrollTrigger: st }); }
      var img = frame.querySelector('img');
      if (img) {
        g.fromTo(img, { objectPosition: '25% 8%', yPercent: 2 * dir }, {
          objectPosition: '25% 30%', yPercent: -2 * dir, ease: 'none', scrollTrigger: {
            trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true
          }
        });
      }
    });
    g.utils.toArray('.soon-label').forEach(function (lab, i) {
      g.fromTo(lab, { yPercent: (i % 2 ? 14 : -14) }, {
        yPercent: (i % 2 ? -14 : 14), rotation: (i % 2 ? 2 : -4), ease: 'none',
        scrollTrigger: { trigger: lab.closest('.polaroid') || lab, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* 7 · Sektionschipsen åker på plats med vrid — scrubbat klistermärkes-
           tempo som matchar temat. */
    g.utils.toArray('.head-chip').forEach(function (chip) {
      g.fromTo(chip, { rotation: -7, xPercent: -14, opacity: 0.35 }, {
        rotation: 0, xPercent: 0, opacity: 1, ease: 'power2.out',
        scrollTrigger: {
          trigger: chip.closest('.section') || chip.parentElement,
          start: 'top bottom', end: 'top 60%', scrub: true
        }
      });
    });

    /* 8 · ORDREVEN — rubriker och footer-rad kläs fram ord för ord: ett
           JS-byggt maskspan per ord (finns inte utanför detta gate, alltså
           osynligt utan JS och under reduce — inget förhydd i statiskt CSS). */
    function wrapWords(el) {
      var holder = document.createElement('span');
      holder.className = 'words-holder';
      while (el.firstChild) { holder.appendChild(el.firstChild); }
      el.appendChild(holder);
      var words = [];
      Array.from(holder.childNodes).forEach(function (node) {
        if (node.nodeType !== 3) { return; }           /* bara rena textnoder */
        var frag = document.createDocumentFragment();
        node.nodeValue.split(/\s+/).forEach(function (w, i) {
          if (!w) { return; }
          if (i > 0) { frag.appendChild(document.createTextNode(' ')); }
          var mask = document.createElement('span');
          mask.className = 'w-mask';
          var inner = document.createElement('span');
          inner.className = 'w-in';
          inner.textContent = w;
          mask.appendChild(inner);
          frag.appendChild(mask);
          words.push(inner);
        });
        holder.replaceChild(frag, node);
      });
      return words;
    }
    g.utils.toArray('.sec-head').forEach(function (head) {
      var words = wrapWords(head);
      if (!words.length) { return; }
      g.set(words, { yPercent: 115 });
      g.to(words, {
        yPercent: 0, ease: 'none', stagger: 0.06,
        scrollTrigger: { trigger: head, start: 'top 94%', end: 'top 40%', scrub: true }
      });
    });
    var footP = document.querySelector('.footer p');
    if (footP) {
      var footWords = wrapWords(footP);
      if (footWords.length) {
        g.set(footWords, { yPercent: 115 });
        g.to(footWords, {
          yPercent: 0, ease: 'none', stagger: 0.05,
          scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'top 55%', scrub: true }
        });
      }
    }

    /* 9 · RÄKNARE — 91-talsbandet: siffrorna klättrar medan bandet korsar
           vyn, scrubbade baklänges vid up-scroll, och landar exakt på det
           verkliga värdet (1991 / 91) när bandet står i centrum. */
    g.utils.toArray('.stat-num').forEach(function (el) {
      var from = parseFloat(el.getAttribute('data-from')) || 0;
      var to = parseFloat(el.getAttribute('data-to'));
      if (isNaN(to)) { return; }
      var state = { v: from };
      el.textContent = String(from);
      g.to(state, {
        v: to, ease: 'none',
        onUpdate: function () { el.textContent = String(Math.round(state.v)); },
        scrollTrigger: { trigger: '.nostalgi', start: 'top bottom', end: 'center center', scrub: true }
      });
      g.fromTo(el, { yPercent: -6 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: '.nostalgi', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* 10 · BARRER — 91-talsbandets staplar växer ur vänsterkant, scrubbade
            (finalstate = fulllängd i CSS, nollställs bara inuti gaten). */
    g.utils.toArray('.stat-bar').forEach(function (bar, i) {
      g.set(bar, { scaleX: 0 });
      g.to(bar, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: '.nostalgi', start: (i + 1) * 6 + '% bottom', end: 'center center', scrub: true }
      });
    });

    /* 11 · ÅRSCHIPS — varje årstal får egen parallax-drift + vrid: de glider
            mot var sitt håll medan bandet rullar förbi. */
    g.utils.toArray('.year-chip').forEach(function (chip, i) {
      var dir = (i % 2 === 0) ? 1 : -1;
      g.fromTo(chip, { y: -22 * dir, rotation: 5 * dir }, {
        y: 22 * dir, rotation: -5 * dir, ease: 'none',
        scrollTrigger: { trigger: '.nostalgi', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* 12 · RUTMALL — rutpappersfältet i varje sektion motscrollar långsamt
            innehållet (scrubbat y, höjd ±16 % — ligger klippt i sektionen). */
    g.utils.toArray('.grid-field').forEach(function (field, i) {
      var dir = (i % 2 === 0) ? -1 : 1;
      g.fromTo(field, { yPercent: 16 * dir }, {
        yPercent: -16 * dir, ease: 'none',
        scrollTrigger: {
          trigger: field.parentElement, start: 'top bottom', end: 'bottom top', scrub: true
        }
      });
    });

    /* 13 · MARQUEE-REPA — bandet drifter HORISONTTELLT med scrollen.
            Endast åt vänster (xPercent 0 → -2): högerkanten går aldrig
            längre ut än idag, så P4-överflippet vid 375 blir inte sämre
            (skalet klipper dessutom bort det befintliga). */
    var shell = document.querySelector('.marquee-shell');
    if (shell) {
      g.fromTo(shell, { xPercent: 0 }, {
        xPercent: -2, ease: 'none',
        scrollTrigger: { trigger: shell, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }

    /* 14 · NAV — länkarna tonar bläck → kobolt över hela sidan (scrubbat,
            AA i båda ändar: 12:1 → 7:1 mot gult) och lyren gungar. */
    g.to('.navlist a', {
      color: '#2b3a8c', ease: 'none', stagger: 0.12,
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true }
    });
    g.utils.toArray('.navlist li').forEach(function (li, i) {
      g.fromTo(li, { yPercent: 8 * (i % 2 ? -1 : 1) }, {
        yPercent: -8 * (i % 2 ? -1 : 1), ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: '+=80%', scrub: true }
      });
    });

    /* 15 · KLISTERMÄRKE-DETALJ — rubrikerna gungar och prisraden vrider sig
            (själva kortet lämnas orört: draget i main.js äger dess transform). */
    g.utils.toArray('.sticker h3').forEach(function (h, i) {
      g.fromTo(h, { yPercent: (i % 2 ? 7 : -7) }, {
        yPercent: (i % 2 ? -7 : 7), ease: 'none',
        scrollTrigger: { trigger: h.closest('.section'), start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
    g.utils.toArray('.sticker .price').forEach(function (p, i) {
      g.fromTo(p, { rotation: (i % 2 ? 2.5 : -2.5) }, {
        rotation: (i % 2 ? -2.5 : 2.5), ease: 'none',
        scrollTrigger: { trigger: p.closest('.sticker'), start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* 16 · BOKA — tiderna lyfts in i trappsteg och dagrubrikerna sjunker på
            plats, allt scrubbat över rutnätets väg genom vyn. */
    var slotGrid = document.querySelector('.slot-grid');
    if (slotGrid) {
      var slotTl = g.timeline({
        scrollTrigger: { trigger: slotGrid, start: 'top 95%', end: 'top 35%', scrub: true }
      });
      slotTl.fromTo('.slot-day', { yPercent: 40 }, { yPercent: 0, ease: 'none', stagger: 0.15 }, 0);
      slotTl.fromTo('.slot', { yPercent: 22 }, { yPercent: 0, ease: 'none', stagger: 0.03 }, 0);
    }
    g.utils.toArray('.demo-badge').forEach(function (b, i) {
      g.fromTo(b, { rotation: (i % 2 ? -3.5 : 2) }, {
        rotation: (i % 2 ? 1.5 : -3), ease: 'none',
        scrollTrigger: { trigger: b.closest('.section'), start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
    g.utils.toArray('.section-note').forEach(function (n, i) {
      g.fromTo(n, { yPercent: (i % 2 ? 12 : -12) }, {
        yPercent: (i % 2 ? -12 : 12), ease: 'none',
        scrollTrigger: { trigger: n.closest('.section'), start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* 17 · KONTAKT — kort och formulander driver mot var sitt håll; raderna
            i kortet och etiketterna i formet har egen mikrodrift. */
    var cCard = document.querySelector('.contact-card');
    if (cCard) {
      g.fromTo(cCard, { yPercent: -7 }, {
        yPercent: 7, ease: 'none',
        scrollTrigger: { trigger: '.kontakt-grid', start: 'top bottom', end: 'bottom top', scrub: true }
      });
      g.utils.toArray('.contact-card h3, .contact-card p').forEach(function (el, i) {
        g.fromTo(el, { x: (i % 2 ? -8 : 8) }, {
          x: (i % 2 ? 8 : -8), ease: 'none',
          scrollTrigger: { trigger: cCard, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });
    }
    var cForm = document.querySelector('.contact-form');
    if (cForm) {
      g.fromTo(cForm, { yPercent: 7 }, {
        yPercent: -7, ease: 'none',
        scrollTrigger: { trigger: '.kontakt-grid', start: 'top bottom', end: 'bottom top', scrub: true }
      });
      g.utils.toArray('.contact-form label, #cf-send').forEach(function (el, i) {
        g.fromTo(el, { y: (i % 2 ? -5 : 5) }, {
          y: (i % 2 ? 5 : -5), ease: 'none',
          scrollTrigger: { trigger: cForm, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });
    }

    /* 18 · HERO-DETALJ — ögonbrynet glider, underrubriken och knapparna
            gungar åt var sitt håll; varumärket i baren skiftar läge. */
    var eyebrow = document.querySelector('.eyebrow');
    if (eyebrow) {
      g.fromTo(eyebrow, { xPercent: -3, rotation: -1.5 }, {
        xPercent: 3, rotation: -1.5, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }
    var heroSub = document.querySelector('.hero-sub');
    if (heroSub) {
      g.fromTo(heroSub, { yPercent: 16 }, {
        yPercent: -16, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }
    g.utils.toArray('.hero-cta .btn').forEach(function (b, i) {
      g.fromTo(b, { yPercent: (i % 2 ? 6 : -6) }, {
        yPercent: (i % 2 ? -6 : 6), rotation: (i % 2 ? 1.5 : -1.5), ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    });
    var brand = document.querySelector('.brand');
    if (brand) {
      g.fromTo(brand, { xPercent: -2 }, {
        xPercent: 2, ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: '+=120%', scrub: true }
      });
    }
  });

  ST.refresh();
})();
