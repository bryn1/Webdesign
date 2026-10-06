/* ============================================================
   MYNTA — tema 20 «Pixelhall» (MC 10088 · DENSITY-01b) — SCROLL-KOREOGRAFI
   GSAP 3.12.7 + ScrollTrigger lokalt vendor (../_assets/vendor/,
   ingen CDN). All scroll-rörelse registreras ENDAST i
   (prefers-reduced-motion: no-preference): med reduce skapas noll
   triggers och allt innehåll står redan i CSS i sitt synliga
   slutläge. Utan JS eller utan biblioteken är sidan stilla men
   fullt läsbar — ingen effekt bär information.
   DENSITY-01b: tät scrubbad rörelse — pixelgrid-parallax, HUD-räknare,
   scanline-drift, sprite-rails, stage-drift, mynt-wipe och panel-
   glidning vänster/höger. Allt scrubbas till scrolläget, ingen egen
   klocka; CRT-glimtet i style.css är CSS-gatrat och lämnas orört.
   Ingen egen global scope: allt i denna IIFE, trådat med defer.
   ============================================================ */
(function () {
  'use strict';
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; }                        /* saknas libs → statisk sida */
  g.registerPlugin(ST);

  var mm = g.matchMedia();
  var page = function (extra) {                     /* hela sidan som scrubbas */
    var o = { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true };
    for (var k in extra) { o[k] = extra[k]; }
    return o;
  };

  mm.add('(prefers-reduced-motion: no-preference)', function () {

    /* 1 · MINNESSKRÄCK-FÄRG (FÄRG, scrubbad): sidotonen sjunker genom
           sidan — CRT-navy mot djupare arkadviol, som att kabinettet
           släcks ner medan spelet fortsätter. */
    g.fromTo(document.body, { backgroundColor: '#0b0d17' }, {
      backgroundColor: '#150d24', ease: 'none', scrollTrigger: page()
    });

    /* 2 · SCANLINE-DRIFT (scrubbad): scanlines ligger i .crt__lines och
           glider 44 px över sidan — tubet surar i sakta mak. */
    g.fromTo('.crt__lines', { y: 0 }, {
      y: 44, ease: 'none', scrollTrigger: page()
    });

    /* 3 · PIXELGRID-PARALLAX (tre lager, tre farter): bakgrundsmönstret
           kör sin egen hastighet mot content — pricknätet neråt,
           stipplarna mot och rutnätet halva vägen åt höger. */
    g.fromTo('.pixgrid__dots', { yPercent: 0 }, {
      yPercent: 30, ease: 'none', scrollTrigger: page()
    });
    g.fromTo('.pixgrid__lines', { yPercent: -22 }, {
      yPercent: 16, ease: 'none', scrollTrigger: page()
    });
    g.fromTo('.pixgrid', { xPercent: 0 }, {
      xPercent: 1.6, ease: 'none', scrollTrigger: page()
    });

    /* 4 · ARKAD-HUD (NUMMERSCRUB): poäng 000000→999999 och level
           01→20 följer scrolläget — siffrorna är dekor (aria-hidden),
           rörelsen är spelet. Siffrorna nuddar var sitt steg i taget. */
    var poang = document.getElementById('hud-poang');
    var level = document.getElementById('hud-level');
    var hud = { s: 0 };
    if (poang) {
      g.to(hud, {
        s: 999999, ease: 'none',
        onUpdate: function () { poang.textContent = ('00000' + Math.round(hud.s)).slice(-6); },
        scrollTrigger: page()
      });
      g.fromTo(poang, { y: 0 }, { y: 5, ease: 'stepped(20)', scrollTrigger: page() });
    }
    if (level) {
      var lv = { v: 1 };
      g.to(lv, {
        v: 20, ease: 'none',
        onUpdate: function () { level.textContent = ('0' + Math.round(lv.v)).slice(-2); },
        scrollTrigger: page()
      });
      g.fromTo(level, { y: 0 }, { y: -5, ease: 'stepped(20)', scrollTrigger: page() });
    }

    /* 5 · SPRITE-RAILS (MARSCH I MOTRÖRELSE, scrubbad): två rader
           dekorativa glyfer marcherar åt sitt håll genom hela sidan —
           varje glyph får sin egen takt via funktionsvärden. */
    g.utils.toArray('.sprite-rail__row').forEach(function (row, r) {
      var dir = r % 2 ? -1 : 1;
      g.fromTo(row.querySelectorAll('span'), { xPercent: function (i) { return -dir * (40 + (i % 5) * 11); } }, {
        xPercent: function (i) { return dir * (40 + (i % 5) * 11); },
        ease: 'none', scrollTrigger: page()
      });
    });

    /* 6 · NAV-ATTRACT (BOB, scrubbad): menyknapparna nickar varannan
           neråt varannan uppåt medan sidan rullar — skylten lever. */
    g.fromTo('.nav li', { y: function (i) { return i % 2 ? 0 : 7; } }, {
      y: function (i) { return i % 2 ? -7 : 0; },
      ease: 'stepped(10)', scrollTrigger: page()
    });

    /* 7 · HEADERN SURAR (VERTIKAL DARR, scrubbad): marquee-n gungar
           3 px i pixelsteg — kabinettet vibrar när myntet trillar ner. */
    g.fromTo('.marquee', { y: 0 }, {
      y: 3, ease: 'stepped(8)', scrollTrigger: page()
    });

    /* 8 · LADDNINGSREGEL (LINJE, scrubbad per stage): pixelregeln under
           varje stagerubrik ritas fram i diskreta steg — stepped(16)
           bevarar pixelkänslan, ingen utjämnad linje. */
    g.utils.toArray('.stage-rule').forEach(function (rule) {
      g.fromTo(rule, { scaleX: 0 }, {
        scaleX: 1, ease: 'stepped(16)',
        scrollTrigger: { trigger: rule, start: 'top 92%', end: 'top 42%', scrub: true }
      });
    });

    /* 9 · MYNTWIP + KLIPP-AVSLÖJNING (scrubbade, pixelstegade): en
           neon-list åker över stagerubriken medan titeln friläggs i
           12 hårda steg — insert-coin-känsla, rad-för-rad för ögat. */
    g.utils.toArray('.stage-head').forEach(function (head) {
      var h2 = head.querySelector('h2');
      if (h2) {
        g.fromTo(h2, { clipPath: 'inset(-12px 100% -12px 0)' }, {
          clipPath: 'inset(-12px 0% -12px 0)', ease: 'stepped(12)',
          scrollTrigger: { trigger: head, start: 'top 90%', end: 'top 34%', scrub: true }
        });
      }
      var bar = head.querySelector('.head-wipe__bar');
      if (bar) {
        g.fromTo(bar, { xPercent: -115 }, {
          xPercent: 640, ease: 'stepped(16)',
          scrollTrigger: { trigger: head, start: 'top 96%', end: 'top 18%', scrub: true }
        });
      }
    });

    /* 10 · STAGE-DRIFT (PARALLAX, alternerande riktning): varje sektion
            åker ~3 % mot scrollen så text och bildskärmar seglar i egen
            takt. Galleriet är undantaget — dess pinnade rubrik skall
            inte ärva förflyttning från en transformerad ancestor. */
    g.utils.toArray('.section').forEach(function (s, i) {
      if (s.querySelector('.stage-head--pin')) { return; }
      g.fromTo(s, { yPercent: 0 }, {
        yPercent: i % 2 ? -3.4 : 3.2, ease: 'none',
        scrollTrigger: { trigger: s, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* 11 · HERO-PARALLAX (DRIFT, scrubbad, sex distincta hastigheter):
            statusraden halkar efter, underrubriken seglar, namnet
            lyfter, åtgärdsraden svävar och INSERT COIN-drivern rusar. */
    g.fromTo('.hero__status', { yPercent: 0 }, {
      yPercent: 60, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    g.fromTo('.hero__sub', { yPercent: 0 }, {
      yPercent: 26, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    g.fromTo('.hero__name', { yPercent: 0 }, {
      yPercent: -20, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    g.fromTo('.hero__actions', { yPercent: 0 }, {
      yPercent: 30, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    g.fromTo('.hero__press', { yPercent: 0 }, {
      yPercent: 100, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    g.fromTo('.eyebrow', { yPercent: 0 }, {
      yPercent: 46, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    /* 12 · OM-BLOGARNA (VÅG, scrubbad): portraiten svävar in från vänster,
            texten från höger (x i breddblocket nedan) och varannan rad
            lyser upp sig ur ett mjukt y-offset. */
    g.fromTo('.om-text p', { yPercent: function (i) { return i % 2 ? 8 : 14; } }, {
      yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: '.om-grid', start: 'top 92%', end: 'top 38%', scrub: true }
    });
    g.fromTo('.om-portrait__cap', { x: 12 }, {
      x: 0, ease: 'none',
      scrollTrigger: { trigger: '.om-grid', start: 'top 92%', end: 'top 38%', scrub: true }
    });

    /* 13 · MENYLISTAN (ALTERNERANDE GLIDNING, scrubbad): varje post
            halkar in på sneddn — udda från höger, jäma från vänster —
            numret, priset och VÄLJ-länken kör motlut. */
    g.utils.toArray('.menu-item').forEach(function (mi, i) {
      var dir = i % 2 ? 1 : -1;
      g.fromTo(mi, { yPercent: dir * 6 }, {
        yPercent: 0, ease: 'none',
        scrollTrigger: { trigger: mi, start: 'top 96%', end: 'top 40%', scrub: true }
      });
      g.fromTo(mi.querySelector('.menu-item__no'), { x: -dir * 24 }, {
        x: 0, ease: 'none',
        scrollTrigger: { trigger: mi, start: 'top 96%', end: 'top 40%', scrub: true }
      });
      g.fromTo(mi.querySelector('.price'), { yPercent: 12 }, {
        yPercent: 0, ease: 'none',
        scrollTrigger: { trigger: mi, start: 'top 96%', end: 'top 40%', scrub: true }
      });
      g.fromTo(mi.querySelector('.menu-item__pick'), { x: dir * 14 }, {
        x: 0, ease: 'none',
        scrollTrigger: { trigger: mi, start: 'top 96%', end: 'top 40%', scrub: true }
      });
    });

    /* 14 · BILDSPÄLLS-ZOOM + ALTERNERANDE LYFT (scrubbade): skärmarna
            faller in 1.12→1.0 och varannan tavla lyfts ur / sänks ner
            mot sin place — high score-tablan «skarps» och lever. */
    g.utils.toArray('.gallery > li').forEach(function (li, i) {
      var dir = i % 2 ? 1 : -1;
      var img = li.querySelector('img');
      if (img) {
        g.fromTo(img, { scale: 1.12 }, {
          scale: 1, ease: 'none',
          scrollTrigger: { trigger: li, start: 'top 135%', end: 'top 45%', scrub: true }
        });
      }
      g.fromTo(li, { yPercent: dir * 8 }, {
        yPercent: 0, ease: 'none',
        scrollTrigger: { trigger: li, start: 'top 100%', end: 'top 45%', scrub: true }
      });
      var cap = li.querySelector('.caption');
      if (cap) {
        g.fromTo(cap, { x: dir * 8 }, {
          x: 0, ease: 'none',
          scrollTrigger: { trigger: li, start: 'top 100%', end: 'top 45%', scrub: true }
        });
      }
    });

    /* 15 · BOKA-SCENEN (TIDSGALLER VÅGAR, scrubbad): rutnätet lyfter i
            kolumner om åtta pixlar om vartannat, raderna nickar, och
            banner + blyerts + not roar runt sina kanter. */
    g.fromTo('.slot', { y: function (i) { return ((i % 6) - 2.5) * 5; } }, {
      y: 0, ease: 'none',
      scrollTrigger: { trigger: '.slot-grid', start: 'top 94%', end: 'top 46%', scrub: true }
    });
    g.fromTo('.slot-grid__head', { y: function (i) { return i % 2 ? 6 : -6; } }, {
      y: 0, ease: 'stepped(6)',
      scrollTrigger: { trigger: '.slot-grid', start: 'top 94%', end: 'top 46%', scrub: true }
    });
    g.fromTo('.demo-banner', { x: -14, yPercent: 4 }, {
      x: 0, yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: '#boka .demo-banner', start: 'top 94%', end: 'top 40%', scrub: true }
    });
    g.fromTo('.boka-lead', { yPercent: 10 }, {
      yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: '.boka-lead', start: 'top 94%', end: 'top 46%', scrub: true }
    });
    g.fromTo('.boka-note', { y: 12 }, {
      y: 0, ease: 'none',
      scrollTrigger: { trigger: '.boka-note', start: 'top 94%', end: 'top 52%', scrub: true }
    });

    /* 16 · KONTAKT-BLOGARNA (GLIDNING + FORMVÅG, scrubbade): infon och
            formuläret möts från var sitt håll (x i breddblocket),
            adressraderna och fälten nickar i alternerande takt. */
    g.fromTo('.kontakt-info address', { yPercent: 9 }, {
      yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: '.kontakt-grid', start: 'top 92%', end: 'top 40%', scrub: true }
    });
    g.fromTo('.kontakt-form label', { yPercent: function (i) { return i % 2 ? 12 : 20; } }, {
      yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: '.kontakt-form', start: 'top 96%', end: 'top 48%', scrub: true }
    });

    /* 17 · SLUTSKÄRM (LYFT, scrubbad): footern glider upp ur mörkret
            och raderna svävar mot varandra när bandet rullar ut. */
    g.fromTo('.footer', { yPercent: 8 }, {
      yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true }
    });
    g.fromTo('.footer p', { xPercent: function (i) { return i % 2 ? -1.6 : 1.6; } }, {
      xPercent: 0, ease: 'none',
      scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true }
    });

    /* 18 · MYNTMÄTAREN (scrubbad, pixelsteg): progress-baren följer
            scrollen direkt via ScrollTrigger i 40 diskreta steg. */
    var bar = document.getElementById('progress-bar');
    if (bar) {
      g.fromTo(bar, { width: '0%' }, {
        width: '100%', ease: 'stepped(40)',
        scrollTrigger: page()
      });
    }
  });

  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 721px)', function () {

    /* 19 · ATTRAKT-LÄGE (PIN, desktop): stage-head hos Galleri naglar
           fast som arkadskärmens rubrik medan high score-listan
           scrollar förbi, och rubriken skala-sätts under pinen. */
    var head = document.querySelector('.stage-head--pin');
    var gal = document.getElementById('galleri');
    if (head && gal) {
      g.fromTo(head.querySelector('h2'), { scale: 0.97 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: gal, start: 'top 100px', end: 'bottom 220px', pin: head, scrub: true }
      });
    }

    /* 20 · PANELER FRÅN VAR SITT HÅLL (bred skärm): portrait, text,
           menyposter och kontaktblogar glider in alternerande
           vänster/höger — 26–32 px, alltid innanför sidans marginal. */
    [['.om-portrait', -30], ['.om-text', 30],
     ['.kontakt-info', -26], ['.kontakt-form', 26]].forEach(function (row) {
      g.fromTo(row[0], { x: row[1] }, {
        x: 0, ease: 'none',
        scrollTrigger: { trigger: row[0], start: 'top 95%', end: 'top 42%', scrub: true }
      });
    });
    g.utils.toArray('.menu-item').forEach(function (mi, i) {
      g.fromTo(mi, { x: i % 2 ? 30 : -30 }, {
        x: 0, ease: 'none',
        scrollTrigger: { trigger: mi, start: 'top 96%', end: 'top 40%', scrub: true }
      });
    });
  });

  mm.add('(prefers-reduced-motion: no-preference) and (max-width: 720px)', function () {

    /* 21 · SAMMA PANELER PÅ SMAL SKARM: kortare drag (12 px) så att
           ingen horisontell overflow uppstar vid 375 px — rörelsen
           får synas på y-led genom stegen ovan. */
    [['.om-portrait', -12], ['.om-text', 12],
     ['.kontakt-info', -12], ['.kontakt-form', 12]].forEach(function (row, i) {
      g.fromTo(row[0], { x: row[1] }, {
        x: 0, ease: 'none',
        scrollTrigger: { trigger: row[0], start: 'top 95%', end: 'top 48%', scrub: true }
      });
    });
  });

  ST.refresh();
})();
