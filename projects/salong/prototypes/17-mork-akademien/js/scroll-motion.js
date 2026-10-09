/* 17 · Mörka akademien — scroll-koreografi (MC 10088, JS-regeln 2026-10-05).
   DENSITY-02b (2026-10-05): tät scrubbad rörelse — mål ≥55 % ever-change och
   median ≥45 movers/steg; varje sektion har ≥2 levande lager i bandet.
   GSAP + ScrollTrigger lokalt vendor (../_assets/vendor/) — ingen CDN, inga
   animation-timeline-deklarationer, ingen IO-fallback: EN enda motor.
   All rörelse registreras ENDAST i (prefers-reduced-motion: no-preference):
   med reduce satt körs ingenting och allt står i sitt synliga grundläge;
   utan JS/bibliotek händer nada — innehållet är fullt läsbart. */
(function () {
  'use strict';
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; }                     // biblioteken saknas → statisk sida
  g.registerPlugin(ST);

  var mm = g.matchMedia();

  /* delat scrubband: elementets/sektionens transit genom vyn */
  function band(trigger, start, end) {
    return { trigger: trigger, start: start || 'top bottom', end: end || 'bottom top', scrub: true };
  }

  mm.add('(prefers-reduced-motion: no-preference)', function () {
    var doc = document;
    var active = true;                            // matchMedia revert → stoppa async bygge

    function sect(el) { return el.closest('.hero, .section'); }

    /* 0 · Öppningen svarar direkt: hero lyfter/tonas ur under första
           viewporten, och hjältets pennstreck ritas från scrollnoll. */
    g.fromTo('.hero-inner', { yPercent: 0, autoAlpha: 1 }, {
      yPercent: -12, autoAlpha: 0.25, ease: 'none',
      scrollTrigger: band('.hero', 'top top', 'bottom top')
    });
    g.fromTo('.hero-mark', { y: 0, rotation: 0, autoAlpha: 1 }, {
      y: 90, rotation: 80, autoAlpha: 0, ease: 'none',
      scrollTrigger: band('.hero', 'top top', 'bottom top')
    });
    g.fromTo('.hero-rule', { scaleX: 0 }, {
      scaleX: 1, ease: 'none',
      scrollTrigger: band('.hero', 'top top', 'top -35%')
    });

    /* 0b · HUVUDET: masthead glider lätt efter hjältet medan öppningen
            lyfter — även takbalken har liv under de första stegen. */
    var mast = doc.querySelector('.masthead-inner');
    if (mast) {
      g.fromTo(mast, { y: 6 }, { y: -8, ease: 'none',
        scrollTrigger: band('.hero', 'top top', 'bottom top') });
    }

    /* 1 · FÄRG: växtljuset värms och DRIVER — glöden vandrar långsamt
           sidledes/djupåt och trappar upp genom hela sidan. */
    var glow = doc.querySelector('.candle-glow');
    if (glow) {
      var glowTl = g.timeline({ scrollTrigger: band(doc.body, 'top top', 'bottom bottom') });
      glowTl.fromTo(glow, { opacity: 0 }, { opacity: 0.38, ease: 'power1.out', duration: 0.5 }, 0);
      glowTl.to(glow, { opacity: 0.5, ease: 'none', duration: 0.5 }, 0.5);
      g.fromTo(glow, { xPercent: -1.6, yPercent: 1 }, {
        xPercent: 2.2, yPercent: -1.2, ease: 'none',
        scrollTrigger: band(doc.body, 'top top', 'bottom bottom')
      });
    }

    /* 1b · PAPPERET driver mot scrollen — fibervarven glider långsammare
            än innehållet (counter-scroll, ±5 % över hela sidan). */
    var paper = doc.querySelector('.paper');
    if (paper) {
      g.fromTo(paper, { yPercent: 5 }, {
        yPercent: -5, ease: 'none',
        scrollTrigger: band(doc.body, 'top top', 'bottom bottom')
      });
    }

    /* 2 · GLÖDBAND: ljuspolen tänds, når sin höjdpunkt och slocknar
           scrubbat medan sektionen passerar — intensiteten följer scroll. */
    g.utils.toArray('.glow-band').forEach(function (pool, i) {
      var dir = i % 2 ? -1 : 1;
      var tl = g.timeline({ scrollTrigger: band(pool.parentElement) });
      tl.fromTo(pool, { opacity: 0.12 }, { opacity: 0.5, ease: 'none', duration: 0.5 }, 0);
      tl.to(pool, { opacity: 0.12, ease: 'none', duration: 0.5 }, 0.5);
      tl.fromTo(pool, { y: -30 * dir }, { y: 30 * dir, ease: 'none' }, 0);
    });

    /* 3 · ORNAMENT: fleuronerna driver i olika långsamma takter och
           vänder långsamt — marginalerna lever hela sektionsbandet. */
    g.utils.toArray('.fleuron').forEach(function (orn, i) {
      var rate = 18 + i * 11;
      var dir = i % 2 ? -1 : 1;
      g.fromTo(orn, { y: rate * dir, rotation: -4 }, {
        y: -rate * dir, rotation: 4, ease: 'none',
        scrollTrigger: band(sect(orn))
      });
    });

    /* 4 · LINJE: pennstrecken ritas framåt och dubbelreglerna slås upp
           ut från mitten — hairline-svep vid varje sektionsgräns. */
    g.utils.toArray('.section .pen-rule').forEach(function (rule) {
      g.fromTo(rule, { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: band(rule, 'top 95%', 'top 62%')
      });
    });
    g.utils.toArray('.rule-double').forEach(function (rule) {
      g.fromTo(rule, { scaleX: 0 }, {
        scaleX: 1, ease: 'none',
        scrollTrigger: band(rule, 'top bottom', 'top 74%')
      });
    });

    /* 5 · ÖGONVRAL: everytan glider ut från sin regel och svävar sedan
           med sektionsbandet — även rubrikzonen har skrapande rörelse. */
    g.utils.toArray('.eyebrow').forEach(function (eb, i) {
      var dir = i % 2 ? 1 : -1;
      g.fromTo(eb, { x: -18 }, {
        x: 0, ease: 'power1.out',
        scrollTrigger: band(eb, 'top 96%', 'top 58%')
      });
      g.fromTo(eb, { y: 12 * dir }, {
        y: -12 * dir, ease: 'none',
        scrollTrigger: band(sect(eb))
      });
    });

    /* 6 · REVIVAL: brödtext, ramar och formulär tonas fram scrubbat —
           start 'top 92%' så sidan svarar på första scrollnotchen. */
    g.utils.toArray('.reveal').forEach(function (el) {
      g.fromTo(el, { autoAlpha: 0, y: 26 }, {
        autoAlpha: 1, y: 0, ease: 'power1.out',
        scrollTrigger: band(el, 'top 92%', 'top 50%')
      });
    });

    /* 7 · RAD FÖR RAD: brödtexten delas i rendererade rader (efter fonterna)
           — varje rad lyfter 8–12 px och tänds i stagger, lugnt och scrubbat.
           Utan JS/reduce: ingen split — texten står orörd i sin helhet. */
    function ensureSplit(el) {
      var inners = g.utils.toArray('.split-inner', el);
      if (inners.length) { return inners; }       // redo efter revert: återanvänd
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
    function revealLines() {
      if (!active) { return; }
      g.utils.toArray('.prose p, .entry p, .booking-note').forEach(function (para) {
        if (para.querySelector('.dropcap') || para.closest('dialog')) { return; }
        var found = ensureSplit(para);
        if (!found.length) { return; }
        /* FIX-17-R1 (2026-10-08, DA-funn P2): bandet slutade tidigare på
           'top 24%' — styckets sista rad låg kvar i sin clip som en rad
           „stumpar" medan läsaren höll stycket i läsposition. Släpps nu
           redan vid 'top 60%', väl innan stycket når läscentrum. */
        var tl = g.timeline({ scrollTrigger: band(para, 'top 94%', 'top 60%') });
        found.forEach(function (inner, li) {
          tl.fromTo(inner, { autoAlpha: 0.25, yPercent: 30 }, {
            autoAlpha: 1, yPercent: 0, ease: 'power1.out'
          }, li * Math.max(0.06, 0.5 / found.length));
        });
      });
      /* rubriker och hjältets rader klips fram rad för rad ur sina svep —
         solena, ingen studs */
      g.utils.toArray('main h2, .hero-sub').forEach(function (heading) {
        var found = ensureSplit(heading);
        if (!found.length) { return; }
        var tl = g.timeline({ scrollTrigger: band(heading, 'top 92%', 'top 46%') });
        found.forEach(function (inner, li) {
          tl.fromTo(inner, { yPercent: 110 }, { yPercent: 0, ease: 'none' }, li * 0.18);
        });
      });
      /* citatblocken lyfter sina rader i stagger — även fotnoterna lever
         FIX-17-R1: samma läsbarhetsregel som brödtexten — släpps väl före
         läscentrum (tidigare 'top 40%', halva blocket var mittläsbart
         under svepet) */
      g.utils.toArray('.marginalia').forEach(function (note) {
        var found = ensureSplit(note);
        if (!found.length) { return; }
        var tl = g.timeline({ scrollTrigger: band(note, 'top 94%', 'top 62%') });
        found.forEach(function (inner, li) {
          tl.fromTo(inner, { autoAlpha: 0.3, yPercent: 24 }, {
            autoAlpha: 1, yPercent: 0, ease: 'power1.out'
          }, li * Math.max(0.08, 0.44 / found.length));
        });
      });
      ST.refresh();
    }
    if (doc.fonts && doc.fonts.ready && doc.fonts.ready.then) {
      doc.fonts.ready.then(revealLines);
    } else {
      revealLines();
    }

    /* 8 · INITIALER: fallande bokstäver skalar och lutar scrubbat medan
           stycket vandrar genom vyn — solenne, aldrig studsande. */
    g.utils.toArray('.dropcap').forEach(function (cap) {
      var para = cap.closest('p');
      if (!para) { return; }
      var tl = g.timeline({ scrollTrigger: band(para, 'top 92%', 'top 20%') });
      tl.fromTo(para, { y: 8 }, { y: -8, ease: 'none' }, 0);
      tl.fromTo(cap, { scale: 1.07, rotation: -1.8 }, {
        scale: 0.95, rotation: 1.8, ease: 'none', transformOrigin: '30% 60%'
      }, 0);
    });

    /* 9 · PORTRÄTT: Ken Burns scrubbad i ovalen (skala 1.16→1.05 + liten
           y-vandring så ansiktet följer med) och ramen parallaxar långsamt. */
    var portrait = doc.querySelector('.gilt.portrait');
    if (portrait) {
      var media = portrait.querySelector('img');
      if (media) {
        g.fromTo(media, { scale: 1.16, yPercent: 2.5 }, {
          scale: 1.05, yPercent: -2.5, ease: 'none',
          scrollTrigger: band(portrait)
        });
      }
    }
    var pFrame = doc.querySelector('.portrait-frame');
    if (pFrame) {
      g.fromTo(pFrame, { yPercent: 1.6 }, {
        yPercent: -1.6, ease: 'none',
        scrollTrigger: band(pFrame)
      });
    }

    /* 10 · GALLERI: ramarna svävar alternerande och lutar en aning, foto-
            ytan Ken Burns 1.10→1.0→1.05, plåttexten glider sidledes. */
    g.utils.toArray('.frame-cell').forEach(function (cell, i) {
      var dir = i % 2 ? 1 : -1;
      g.fromTo(cell, { yPercent: -2.4 * dir, rotation: -0.8 * dir }, {
        yPercent: 2.4 * dir, rotation: 0.8 * dir, ease: 'none',
        scrollTrigger: band(cell)
      });
      var img = cell.querySelector('.kb-frame img');
      if (img) {
        var itl = g.timeline({ scrollTrigger: band(cell) });
        itl.fromTo(img, { scale: 1.1 }, { scale: 1, ease: 'none', duration: 0.65 }, 0);
        itl.to(img, { scale: 1.05, ease: 'none', duration: 0.35 }, 0.65);
      }
      var cap = cell.querySelector('.vignette-cap, .plate');
      if (cap) {
        g.fromTo(cap, { x: 8 * dir, autoAlpha: 0.7 }, {
          x: -8 * dir, autoAlpha: 1, ease: 'none',
          scrollTrigger: band(cell)
        });
      }
    });

    /* 11 · CITATBLOCK: marginalia svävar vertikalt genom bandet; på brett
            fält lägger de dessutom horisontell vind ±24 px (marginalen är
            frilagd där — smal vy klipper aldrig åt sidan). */
    g.utils.toArray('.marginalia').forEach(function (note, i) {
      var dir = i % 2 ? -1 : 1;
      var host = note.closest('.annotated') || note.parentElement;
      g.fromTo(note, { y: 26 * dir }, {
        y: -26 * dir, ease: 'none',
        scrollTrigger: band(host)
      });
    });

    /* 12 · KATALOG: posterna glider alternerande i egen långsamma takt —
            listan är aldrig stilla medan den förbifarter. */
    g.utils.toArray('.entry').forEach(function (entry, i) {
      var dir = i % 2 ? 1 : -1;
      g.fromTo(entry, { yPercent: -2.2 * dir }, {
        yPercent: 2.2 * dir, ease: 'none',
        scrollTrigger: band(entry)
      });
    });

    /* 13 · BOKNINGSVECKAN: dagarna vecklas mot varandra och tiderna glider
            ett streck var — hela galler har levande skraprörelse. */
    g.utils.toArray('.booking-day').forEach(function (day, i) {
      var dir = i % 2 ? 1 : -1;
      g.fromTo(day, { y: 24 * dir }, {
        y: -24 * dir, ease: 'none',
        scrollTrigger: band(day)
      });
      g.utils.toArray('.tid', day).forEach(function (tid, j) {
        var sdir = j % 2 ? -1 : 1;
        g.fromTo(tid, { x: 5 * sdir }, {
          x: -5 * sdir, ease: 'none',
          scrollTrigger: band(day)
        });
      });
    });

    /* 14 · KONTAKT: kolumnerna driver mot varandra, adressraderna vecklas,
            brevet svävar — avslutet är aldrig tyst. */
    var addr = doc.querySelector('.address');
    if (addr) {
      g.fromTo(addr, { y: 12 }, { y: -12, ease: 'none', scrollTrigger: band(addr) });
    }
    g.utils.toArray('.kontakt-grid .contact-list li').forEach(function (li, i) {
      var dir = i % 2 ? 1 : -1;
      g.fromTo(li, { y: 8 * dir }, { y: -8 * dir, ease: 'none', scrollTrigger: band(li.parentElement) });
    });
    var letter = doc.querySelector('.letter');
    if (letter) {
      g.fromTo(letter, { yPercent: 1.8 }, { yPercent: -1.8, ease: 'none', scrollTrigger: band(letter) });
    }

    /* 15 · SLOTFOT: colophonens rader träder in i stagger och märket vänder
            långsamt — sista bandet har också två levande lager. */
    var colophon = doc.querySelector('.colophon');
    if (colophon) {
      var ctl = g.timeline({ scrollTrigger: band(colophon, 'top bottom', 'top 45%') });
      g.utils.toArray('.colophon > p').forEach(function (line, i) {
        ctl.fromTo(line, { autoAlpha: 0.35, y: 18 }, {
          autoAlpha: 1, y: 0, ease: 'power1.out'
        }, i * 0.16);
      });
      g.fromTo('.colophon-mark', { rotation: -8 }, {
        rotation: 8, ease: 'none',
        scrollTrigger: band(colophon, 'top bottom', 'bottom bottom')
      });
    }

    return function () { active = false; };       // revert-städning för async split
  });

  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 76rem)', function () {
    /* 11b · CITATBLOCKS VIND: ±24 px horisontal drift — endast där
             marginalen står i frilagd marginal (brett fält). */
    g.utils.toArray('.marginalia').forEach(function (note, i) {
      var dir = i % 2 ? -1 : 1;
      g.fromTo(note, { x: -24 * dir }, {
        x: 24 * dir, ease: 'none',
        scrollTrigger: band(note.closest('.annotated') || note.parentElement)
      });
    });
  });

  mm.add('(prefers-reduced-motion: no-preference) and (min-width: 721px)', function () {
    /* 16 · PIN: kapitälrubriken i Tjänster hålls stilla medan hela
           postlistan rinner förbi under den — ett fast ögonblick. */
    var chapter = document.querySelector('.chapter-pin');
    if (chapter) {
      ST.create({
        trigger: chapter, start: 'top 18%',
        endTrigger: '.entries', end: 'bottom 78%',
        pin: chapter, pinSpacing: false
      });
    }
  });

  ST.refresh();
})();
