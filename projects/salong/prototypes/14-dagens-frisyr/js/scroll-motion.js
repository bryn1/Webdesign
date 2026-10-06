/* 14 · Dagens frisyr — scroll-koreografi (MC 10088, ägarens JS-regel 2026-10-05;
   DENSITY-02c 2026-10-05: tät, jävn pressrörelse genom hela upplagan —
   "det händer mer hela vägen"). GSAP + ScrollTrigger lokalt vendor
   (../_assets/vendor/) — ingen CDN, inga egna globals. All rörelse registreras
   ENDAST i (prefers-reduced-motion: no-preference): reduce ⇒ zero triggers och
   allt står i CSS i sitt synliga slutläge; inget JS ⇒ statisk tidning.
   Dekoren (.press-rail/.tone-band/.col-rule) styles i css/motion.css och är
   synlig utan JS — för-lägen (scaleY 0, drift, bokstavssplitt) existrar bara
   i denna gren. Mekaniken ligger i EN fil; ord-/bokstavssplitt återställs vid
   revert så att DOM:en blir orörd utanför grenen. */
(function () {
  'use strict';
  var g = window.gsap, ST = window.ScrollTrigger;
  if (!g || !ST) { return; }                        /* biblioteken saknas → statisk sida */
  g.registerPlugin(ST);

  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* scrubbad linjär tween: from→to under triggerns band (egen trigger valfri) */
  function scrub(el, from, to, trig, start, end) {
    if (!el) { return; }
    to.ease = 'none';
    to.scrollTrigger = { trigger: trig || el, start: start || 'top bottom',
                         end: end || 'bottom top', scrub: 1 };
    g.fromTo(el, from, to);
  }

  /* ord-/bokstavssplit av ren-text-element; returfunktion återställer texten */
  function splitInto(el, byWord) {
    var text = el.textContent;
    var frag = document.createDocumentFragment();
    text.trim().split(byWord ? /\s+/ : '').forEach(function (piece, i) {
      if (byWord && i) { frag.appendChild(document.createTextNode(' ')); }
      if (!byWord && piece === ' ') { frag.appendChild(document.createTextNode(' ')); return; }
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
      var restore = [];
      var body = document.body;
      var mast = document.querySelector('.masthead');
      var bar = document.querySelector('.paperbar');
      var barH = bar ? Math.round(bar.getBoundingClientRect().height) : 56;

      /* 1 · PIN: "Reportage"-etiketten håller medan reportaget rinner förbi. */
      ST.create({
        trigger: '#om', start: 'top ' + (barH + 8) + 'px',
        end: 'bottom ' + (barH + 60) + 'px', pin: '#om .section-flag', pinSpacing: false
      });

      /* 2 · PRESSDJUP (full längd): pappret mörknar och tvätten lägger sig —
             två globala movers som andas genom hela upplagan. Max 6 % tvätt:
             kontraster omräknade till muted 4,8:1 och press 4,6:1 (AA). */
      scrub('.ink-wash', { backgroundColor: 'rgba(20,20,20,0)' },
                        { backgroundColor: 'rgba(20,20,20,0.06)' }, body, 'top top', 'bottom bottom');
      scrub(body, { backgroundColor: '#e8e5de' }, { backgroundColor: '#e4e0d7' },
          body, 'top top', 'bottom bottom');

      /* 3 · UNDERLAG: tryckraster-prickarna och tryckräler motdriver textyn. */
      scrub('.dot-field', { backgroundPosition: '0px 0px' }, { backgroundPosition: '0px -360px' },
          body, 'top top', 'bottom bottom');
      $$('.press-rail').forEach(function (rail, i) {
        scrub(rail, { backgroundPosition: '0px 0px' },
              { backgroundPosition: '0px ' + (i ? 380 : -380) + 'px' }, body, 'top top', 'bottom bottom');
      });

      /* 4 · LINJER: hårlinjer dras ut vågrätt när sektionen kliver in. */
      $$('.draw-rule').forEach(function (rule) {
        g.set(rule, { scaleX: 0 });
        g.to(rule, { scaleX: 1, ease: 'none',
          scrollTrigger: { trigger: rule, start: 'top 94%', end: 'top 52%', scrub: true } });
      });

      /* 5 · KOLUMNREGLER (scaleY): de vertikala hårlinjerna ritas när artikeln
             kommer — leadsidansregeln är redan halritad vid läges och sträcks
             färdig medan masthead glider ut. */
      $$('.col-rule').forEach(function (rule) {
        var lead = rule.classList.contains('col-rule--lead');
        if (lead) {
          scrub(rule, { scaleY: 0.55 }, { scaleY: 1 }, mast, 'top top', 'bottom top');
        } else {
          g.set(rule, { scaleY: 0 });
          g.to(rule, { scaleY: 1, ease: 'none', scrollTrigger: {
            trigger: rule.closest('section') || rule.parentElement, start: 'top 86%', end: 'top 34%', scrub: true } });
        }
      });

      /* 6 · MASTHEAD (driver ut): namnplåten boksstavsupplöst — bokstäverna
             töjs och sprids medan huvudet lyfts av sidan; edition, datrad och
             byline tonar och glider; reglerna drar ihop sig. */
      var nameplate = document.querySelector('.masthead__nameplate');
      if (nameplate) {
        restore.push(splitInto(nameplate, false));
        $$('.split-letter', nameplate).forEach(function (ch, i) {
          scrub(ch, { y: 0, scaleY: 1 },
              { y: (i % 2 ? -1 : 1) * (8 + (i % 4) * 5), scaleY: 1.14 }, mast, 'top top', 'bottom top');
        });
      }
      $$('.masthead__edition, .masthead__dateline, .byline').forEach(function (el, i) {
        scrub(el, { y: 0, opacity: 1 }, { y: i % 2 ? 20 : -16, opacity: 0.32 },
            mast, 'top top', 'bottom top');
      });
      $$('.masthead__rule').forEach(function (rule) {
        scrub(rule, { scaleX: 1 }, { scaleX: 0.2 }, mast, 'top top', 'bottom top');
      });

      /* 7 · LEDARTIKEL: rubrik och deck sätter sina ord på var sitt djup,
             kicker och CTA glider — kolumnen mot åker bildramen. */
      var h1 = document.querySelector('.lead__headline');
      if (h1) {
        restore.push(splitInto(h1, true));
        $$('.split-word', h1).forEach(function (w, i) {
          scrub(w, { y: 0 }, { y: i % 2 ? -15 : 17 }, mast, 'top top', 'bottom top');
        });
      }
      var deck = document.querySelector('.lead__deck');
      if (deck) {
        restore.push(splitInto(deck, true));
        $$('.split-word', deck).forEach(function (w, i) {
          scrub(w, { y: 0, opacity: 1 }, { y: i % 2 ? -9 : 11, opacity: 0.35 },
              mast, 'top top', 'bottom top');
        });
      }
      scrub('.lead__cta', { y: 0 }, { y: 28 }, mast, 'top top', 'bottom top');
      scrub('.lead__body', { y: 0, opacity: 1 }, { y: -24, opacity: 0.3 }, mast, 'top top', 'bottom top');
      scrub('.lead__main', { x: 0 }, { x: -16 }, mast, 'top top', 'bottom top');

      /* 8 · ZOOM (Ken Burns): pressfoto sätter sig i ramen vid inträde. */
      g.utils.toArray('.halftone img').forEach(function (img) {
        g.fromTo(img, { scale: 1.12 }, {
          scale: 1, ease: 'none',
          scrollTrigger: { trigger: img.closest('.press-photo'), start: 'top bottom', end: 'top 55%', scrub: 1 }
        });
      });

      /* 9 · DRIFT: ledarfotot motåker textkolumnen på leadsidan. */
      var leadPhoto = document.querySelector('.press-photo--lead');
      if (leadPhoto) {
        scrub(leadPhoto, { yPercent: 7 }, { yPercent: -7 }, mast, 'top top', 'bottom top');
      }

      /* 10 · TONBAND: halftonremsorna motåker scrollen — banderollerna lever. */
      $$('.tone-band').forEach(function (band) {
        scrub(band, { y: 46 }, { y: -58 }, band, 'top bottom', 'bottom top');
        scrub(band, { backgroundPosition: '0px 0px' }, { backgroundPosition: '0px -150px' },
            band, 'top bottom', 'bottom top');
      });

      /* 11 · RUBRIKER: sektionsrubrikernas letter-spacing dras åt och orden
             sjunker in på var sitt raddjup. */
      $$('.section-headline').forEach(function (h) {
        scrub(h, { letterSpacing: '0.055em' }, { letterSpacing: '0em' }, h, 'top 96%', 'top 58%');
        if (h.children.length) { return; }
        restore.push(splitInto(h, true));
        $$('.split-word', h).forEach(function (w, i) {
          scrub(w, { y: (i % 2 ? -1 : 1) * (12 + (i % 3) * 6) }, { y: 0 }, h, 'top bottom', 'top 30%');
        });
      });
      $$('.section-flag').forEach(function (flag) {
        if (flag.closest('#om')) { return; }        /* #os flaget är uppnålat (1) */
        scrub(flag, { y: 18, opacity: 0.35 }, { y: 0, opacity: 1 }, flag, 'top 96%', 'top 55%');
      });

      /* 12 · REPORTAGE: brödtextens ord driver mot varandra i kolumnerna,
             styckena på varsitt djup, pull-citatet glider och vrider ±1,5°. */
      var omCols = document.querySelector('.om-cols');
      if (omCols) {
        var bodyP = omCols.querySelectorAll('p:not(.lede):not(.om-pull)');
        Array.prototype.forEach.call(bodyP, function (p) {
          if (!p.children.length) { restore.push(splitInto(p, true)); }
          $$('.split-word', p).forEach(function (w, i) {
            scrub(w, { y: (i % 2 ? -1 : 1) * (4 + (i % 3)) }, { y: 0 }, '.om-grid', 'top bottom', 'bottom 30%');
          });
        });
        scrub(omCols.querySelector('.lede'), { y: 0 }, { y: -16 }, '.om-grid', 'top bottom', 'bottom 30%');
      }
      /* pull-citatets glid (x) + rotation bor i bredskärmsblocket (8 x);
         i smalt läge roterar det bara lugnt ±1,2° utan att sticka över kanten */
      scrub('.press-photo--portrait', { y: 28 }, { y: -22 }, '.om-grid', 'top bottom', 'bottom top');
      scrub('.press-photo--portrait .cutline', { y: 12 }, { y: -8 }, '.press-photo--portrait', 'top bottom', 'top 45%');

      /* 13 · ANNONSKOLONNERNA: de tre kolumnerna driver mot varandra på olika
             hastigheter — titlarna glider in, prisraden tonar fram. */
      var adAmp = [20, -27, 30, -16, 24];
      $$('.ad').forEach(function (ad, i) {
        scrub(ad, { y: adAmp[i % 5] }, { y: -adAmp[i % 5] * 0.55 }, '#tjanster', 'top bottom', 'bottom top');
        scrub(ad.querySelector('.ad__title'), { x: i % 2 ? -9 : 9 }, { x: 0 }, ad, 'top bottom', 'top 42%');
        scrub(ad.querySelector('.ad__price'), { opacity: 0.25 }, { opacity: 1 }, ad, 'top bottom', 'top 42%');
      });

      /* 14 · BILDBILAGAN: ramarna driver och gungar ±1,2°, underrubrikerna
             följer på varsitt djup, "Bild kommer"-stämplarna gungar vidare. */
      var figAmp = [16, -20, 24, -13, 19, -23];
      $$('.gallery-grid .press-photo').forEach(function (fig, i) {
        scrub(fig, { y: figAmp[i % 6] }, { y: -figAmp[i % 6] * 0.6, rotation: (i % 2 ? 1 : -1) * 1.2 },
            '#galleri', 'top bottom', 'bottom top');
        scrub(fig.querySelector('.cutline'), { y: i % 2 ? 11 : -13 }, { y: 0 }, fig, 'top bottom', 'top 45%');
      });
      $$('.press-frame__text').forEach(function (t, i) {
        scrub(t, { rotation: -1.8 }, { rotation: -4.2 }, '.gallery-grid', 'top bottom', 'bottom top');
      });

      /* 15 · TIDSGALLRET: dagsheeten driver varsitt och tidslapparna glider
             in på udda jamna djup — gallret lever under genomscrollningen. */
      var dayAmp = [16, -21, 12, -15];
      $$('.booking-day').forEach(function (day, i) {
        scrub(day, { y: dayAmp[i % 4] }, { y: -dayAmp[i % 4] }, '.booking-grid', 'top bottom', 'bottom top');
        $$('.slot', day).forEach(function (slot, j) {
          scrub(slot, { y: (j % 2 ? -1 : 1) * (5 + i * 2 + j * 2) }, { y: 0 },
              '.booking-grid', 'top bottom', 'bottom 25%');
        });
        scrub(day.querySelector('legend'), { x: i % 2 ? 10 : -10 }, { x: 0 },
            '.booking-grid', 'top bottom', 'top 40%');
      });
      $$('.boka-note').forEach(function (el, i) {
        scrub(el, { y: i % 2 ? -14 : 16 }, { y: 0 }, '#boka', 'top bottom', 'bottom bottom');
      });

      /* 16 · KONTAKTBYRÅN: kort och formulär motdriver varandra, fälten
             staggerar in, statusraden tonar fram. */
      scrub('.kontakt-card', { y: 26 }, { y: -18 }, '#kontakt', 'top bottom', 'bottom top');
      scrub('.kontakt-card address', { y: 10 }, { y: -9 }, '.kontakt-card', 'top bottom', 'top 40%');
      scrub('.kontakt-form', { y: -20 }, { y: 16 }, '#kontakt', 'top bottom', 'bottom top');
      $$('.kontakt-form label').forEach(function (lab, i) {
        scrub(lab, { y: 8 + i * 6 }, { y: 0 }, '.kontakt-form', 'top bottom', 'top 45%');
      });
      scrub('.kontakt-form button', { y: 12 }, { y: -10 }, '.kontakt-form', 'top bottom', 'bottom 35%');
      scrub('.form-hint', { opacity: 0.4 }, { opacity: 1 }, '.kontakt-form', 'top bottom', 'bottom 40%');

      /* 17 · KOLOFONEN: sidfotens kolumner staggerar — sista sidan viker sig. */
      scrub('.colophon__mark', { y: 24, opacity: 0.3 }, { y: 0, opacity: 1 }, '.colophon', 'top bottom', 'bottom bottom');
      scrub('.colophon > p', { y: 16 }, { y: -9 }, '.colophon', 'top bottom', 'bottom bottom');
      $$('.colophon nav li').forEach(function (li, i) {
        scrub(li, { y: 10 + i * 7, opacity: 0.35 }, { y: 0, opacity: 1 }, '.colophon', 'top bottom', 'bottom bottom');
      });
      scrub('.colophon__rule', { scaleX: 0.2 }, { scaleX: 1 }, '.colophon', 'top bottom', 'top 62%');

      return function () { restore.forEach(function (fn) { fn(); }); };
    });

    /* 18 · SIDESLÄND DRIFT (bara bredskärm): horisontalglidningarna som får
           plats utanför 680 px — i för trångt läge hoppar de över kanten och
           får därför inte registreras. Allt finns ändå i no-preference-grenen. */
    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 681px)', function () {
      var mast = document.querySelector('.masthead');
      scrub('.kicker', { x: 0 }, { x: 40 }, mast, 'top top', 'bottom top');
      scrub('.om-pull', { x: 38, rotation: 1.5 }, { x: -30, rotation: -1.5 }, '.om-grid', 'top bottom', 'bottom top');
      $$('.demo-badge').forEach(function (el, i) {
        var host = el.closest('section') || document.body;
        scrub(el, { x: i % 2 ? 30 : -32 }, { x: i % 2 ? -18 : 20 }, host, 'top bottom', 'bottom top');
      });
      scrub('.boka-legend', { x: 18 }, { x: -14 }, '#boka', 'top bottom', 'bottom top');
    });

    /* 19 · SMAL BREDD: pull-citatet roterar lugnt utan sidledes glid. */
    mm.add('(prefers-reduced-motion: no-preference) and (max-width: 680px)', function () {
      scrub('.om-pull', { rotation: 1.2 }, { rotation: -1.2 }, '.om-grid', 'top bottom', 'bottom top');
    });

    ST.refresh();
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', boot); }
  else { boot(); }
})();
