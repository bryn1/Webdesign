/* 01 · Müllers-editorial — scroll-koreografi (MC 10088, ägarens JS-regel
   2026-10-05: "design 1-20 ska ha JS"). GSAP + ScrollTrigger lokalt vendor
   (../_assets/vendor/) — ingen CDN, inga egna globals (IIFE).
   All rörelse registreras ENDAST i (prefers-reduced-motion: no-preference):
   med reduce satt körs ingen trigger och inga tweens — allt står i CSS i sitt
   synliga slutläge. Utan JS/bibliotek händer nada — innehållet fullt läsbart.
   En mekanism per oroende: IO-reveals är borttagna — ScrollTrigger äger
   avslöjanden; scrubbed rörelse svarar på scroll; CSS gör inget själv. */
(function () {
  'use strict';
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; }                          // biblioteken saknas → statisk sida
  g.registerPlugin(ST);

  var mm = g.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', function () {

    /* 1 · Hero word-build: orden lyfts ur sin linje-mask vid sidladdning
           (samma tajm som tidigare: 60 ms + 140 ms per ordindex). */
    var heroTitle = document.querySelector('[data-hero]');
    if (heroTitle) {
      var words = g.utils.toArray('.word__i', heroTitle);
      g.set(words, { yPercent: 130, opacity: 0 });
      var wtl = g.timeline({
        scrollTrigger: { trigger: heroTitle, start: 'top 92%' }
      });
      words.forEach(function (w) {
        var idx = parseFloat(getComputedStyle(w).getPropertyValue('--w')) || 0;
        wtl.to(w, {
          yPercent: 0, opacity: 1, duration: 1.05, ease: 'power3.out'
        }, 0.06 + idx * 0.14);
      });
    }

    /* 2 · Fade-up-reveals (ersätter IntersectionObserver-maskineriet):
           en one-shot ScrollTrigger per element, mjuk stagring i listor. */
    g.utils.toArray('[data-reveal]').forEach(function (el) {
      var group = el.closest('.services, .plates');
      var idx = group ? Array.prototype.indexOf.call(group.children, el) : 0;
      g.set(el, { opacity: 0, y: 24 });
      g.to(el, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        delay: group ? Math.min(idx * 0.06, 0.24) : 0,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    /* 3 · Line-mask reveal för sektionsrubriker: koppar-wipe från vänster
           (samma klippväg som den tidigare CSS-övergången, nu trigger-driven). */
    g.utils.toArray('[data-mask]').forEach(function (h) {
      g.set(h, { clipPath: 'inset(-0.15em 100% -0.15em 0)' });
      g.to(h, {
        clipPath: 'inset(-0.15em -0.15em -0.15em -0.15em)',
        duration: 1.15, ease: 'power3.out',
        scrollTrigger: { trigger: h, start: 'top 88%', once: true }
      });
    });

    /* 4 · LINJE — framdrags-hårstrå under sidhuvudet, scrubbad över hela
           sidan (erstatter den borttagna CSS animation-timeline-deklarationen:
           syns nu i alla webbläsare, följer scroll direkt). */
    var bar = document.querySelector('.progress');
    if (bar) {
      g.set(bar, { display: 'block', scaleX: 0 });
      g.to(bar, {
        scaleX: 1, ease: 'none',
        scrollTrigger: {
          trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 0.5
        }
      });
    }

    /* 5 · LINJE/DRAW — kopparregler under varje sektionskicker ritas fram
           från vänster medan sektionen glider upp (scrubbade per sektion). */
    g.utils.toArray('.rule').forEach(function (rule) {
      g.set(rule, { scaleX: 0 });
      g.to(rule, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { trigger: rule, start: 'top 92%', end: 'top 45%', scrub: 0.6 }
      });
    });

    /* 6 · FÄRG — papperet varms långsamt upp mot kopparton över hela sidan
           (scrubbad bakgrundsfärg; bläck och koppar klarar AA i båda ändar). */
    g.fromTo(document.body, { backgroundColor: '#faf6f1' }, {
      backgroundColor: '#f0e2cf', ease: 'none',
      scrollTrigger: {
        trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1
      }
    });

    /* 7 · ZOOM — galleri- och porträttbilder kliver in ur 1.08 och sjunker
           till 1:1 medan skylten glider upp i vyn (Ken Burns över scroll,
           inte klocka; slutläget är bilden i sin naturliga skala). */
    g.utils.toArray('.plate__media img').forEach(function (img) {
      g.fromTo(img, { scale: 1.08 }, {
        scale: 1, ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.plate'), start: 'top bottom', end: 'top 40%', scrub: 0.6
        }
      });
    });

    /* 8 · DRIFT — Om mig: text- och bildkolumnen driver mot varandra över
           ett viewport (tidningskolumners parallax, måttlig amplitud). */
    var about = document.querySelector('.about-grid');
    if (about) {
      var atl = g.timeline({
        scrollTrigger: { trigger: about, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
      });
      atl.fromTo('.about-grid__text', { yPercent: 5 }, { yPercent: -5, ease: 'none' }, 0);
      atl.fromTo('.about-grid .plate', { yPercent: -7 }, { yPercent: 7, ease: 'none' }, 0);
    }

    /* 9 · PIN — hero hålls stilla medan sidan följer efter; hela hero-blocket
           sjunker under pinningen (scrubbat, redaktoriell omslagsro). */
    var heroInner = document.querySelector('.hero__inner');
    if (heroInner) {
      g.fromTo(heroInner, { scale: 1 }, {
        scale: 0.94, ease: 'none',
        scrollTrigger: {
          trigger: '.hero', start: 'top top', end: '+=60%',
          scrub: 0.8, pin: true, pinSpacing: true
        }
      });
    }
  });

  ST.refresh();
})();
