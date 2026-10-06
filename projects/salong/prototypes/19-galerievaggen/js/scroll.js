/* GALLERIVÄGGEN · scroll-lager — GSAP + ScrollTrigger (lokalt vendor i head,
   defer). Allt innanför IIFE:n: inga egna globaler, inga animation-timeline-
   deklarationer. Triggers byggs ENDAST i gsap-matchMedians no-preference-gren
   — vid prefers-reduced-motion byggs noll triggers och sidan står i sitt
   CSS-utgångsläge (allt synligt, bandet går att bläddra som förut).
   Klasser: DRIFT (hang+vägg), ZOOM (inträn + passerande ram), KENB (dukpan),
   LINE (räls + golvlist + hänge), TRÅD (ord + skylt + vandringsljus),
   COLOR (skensljus + fördjupning + vinjett), PIN (vägglapp / vandringsband).
   DENSITY-01d: varje ram har sin egen drifthastighet, duken Ken-Burns-scrambar
   i radriktning, skyltar glider in i radbandet, strålkastaren följer scroll,
   golvlisterna ritas — allt tätt men museum-lugt. Pekarlutningen i tilt.js rör
   .work — detta lager rör .hang — ingen konflikt. */
(function () {
  'use strict';

  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  if (!gsap || !ST) return;                       // vendor laddad ej — vila-läge
  gsap.registerPlugin(ST);

  var mm = gsap.matchMedia();

  /* ---------- Grundrörelser: gäller alla skärmbredder (ej reduce) ---------- */
  mm.add("(prefers-reduced-motion: no-preference)", function () {

    var heroTl = null;
    var extra = [];                     /* insatta rekvisit-noder + timelines */

    /* Hjälpredor: klipp rubrikord i egna spans (texten ord för ord orörd),
       lägg tunn hängtråd över en ram, sätt dekorativ nod i body. Allt skapas
       först här — utan JS och vid reduce finns inga noder och inget dolt. */
    function splitWords(el) {
      var words = [];
      var text = el.textContent;
      el.textContent = '';
      text.split(/(\s+)/).forEach(function (tok) {
        if (!tok) return;
        if (/^\s+$/.test(tok)) { el.appendChild(document.createTextNode(tok)); return; }
        var s = document.createElement('span');
        s.className = 'ord';
        s.textContent = tok;
        words.push(s);
        el.appendChild(s);
      });
      return words;
    }
    function dekor(tag, cls, host, first) {
      var d = document.createElement(tag);
      d.className = cls;
      d.setAttribute('aria-hidden', 'true');
      if (first && host.firstChild) host.insertBefore(d, host.firstChild);
      else host.appendChild(d);
      extra.push(d);
      return d;
    }

    /* ---------- VÄGGLJUS: en strålkastare följer scroll ned längs vaggen ---- */
    var spot = dekor('div', 'wall-spot', document.body, true);
    extra.push(gsap.fromTo(spot, { yPercent: -16, scale: 1.12 }, {
      yPercent: 16, scale: 0.94, ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.4 }
    }));

    /* ---------- LINE — rälssnören under varje sektionstitel ritas från vänster
       (scrub) och golvlisterna under varje rum sträcks ut när man går förbi. -- */
    gsap.utils.toArray(".wall-rail").forEach(function (rail) {
      gsap.fromTo(rail, { scaleX: 0, transformOrigin: "left center" }, {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: rail, start: "top 92%", end: "top 55%", scrub: 0.6 }
      });
    });
    gsap.utils.toArray("#main .section").forEach(function (room) {
      var list = dekor('div', 'floor-line', room);
      extra.push(gsap.fromTo(list, { scaleX: 0, transformOrigin: "left bottom" }, {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: room, start: "top 72%", end: "top 12%", scrub: 1 }
      }));
    });

    /* ---------- TRÅD — rubrikordens rad-för-rad-lyft + väggetiketternas glid
       (scrub): rubriken byggs medan sinningen korsar ögonhöjden. ------------ */
    gsap.utils.toArray("#main h1.display, #main h2.display").forEach(function (head) {
      var words = splitWords(head);
      extra.push(gsap.fromTo(words, { yPercent: 115, opacity: 0 }, {
        yPercent: 0, opacity: 1, ease: "none", stagger: 0.55,
        scrollTrigger: { trigger: head, start: "top 94%", end: "top 48%", scrub: 0.8 }
      }));
    });
    gsap.utils.toArray("#main .wall-label").forEach(function (lab) {
      gsap.fromTo(lab, { y: 26, opacity: 0 }, {
        y: 0, opacity: 1, ease: "none",
        scrollTrigger: { trigger: lab, start: "top 96%", end: "top 66%", scrub: 0.7 }
      });
    });

    /* DRIFT + COLOR i entrén: titelplattan glider uppåt medan väggens
       skensljus tändas och väggen mjukt fördjupas. */
    heroTl = gsap.timeline({
      scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: 1 }
    });
    heroTl.fromTo(".hero__inner", { y: 0 }, { y: -70, ease: "none" }, 0);
    heroTl.fromTo(".hero__light", { opacity: 0.5 }, { opacity: 1, ease: "none" }, 0);

    /* ---------- Om mig: plattan halkar litet i sin egen takt, porträttet
       fälls till ro från ett närmare upphängning och duken Ken-Burns-scrambar. */
    gsap.fromTo(".walltext", { y: -16 }, {
      y: 16, ease: "none",
      scrollTrigger: { trigger: "#om", start: "top bottom", end: "bottom top", scrub: 1 }
    });
    gsap.fromTo(".work--portrait", { scale: 1.08, y: 26 }, {
      scale: 1, y: 0, ease: "power2.out",
      scrollTrigger: { trigger: ".work--portrait", start: "top 100%", end: "top 45%", scrub: 1 }
    });
    gsap.utils.toArray(".work--portrait .canvas img").forEach(function (img) {
      extra.push(gsap.fromTo(img, { scale: 1.18, xPercent: 5, yPercent: -4 }, {
        scale: 1.08, xPercent: -4, yPercent: 3, ease: "none",
        scrollTrigger: { trigger: ".work--portrait", start: "top bottom", end: "top 20%", scrub: 1 }
      }));
    });
    var pWire = dekor('span', 'hang-wire', document.querySelector(".work--portrait"), true);
    extra.push(gsap.fromTo(pWire, { scaleY: 0, transformOrigin: "top center" }, {
      scaleY: 1, ease: "none",
      scrollTrigger: { trigger: ".work--portrait", start: "top bottom", end: "top 62%", scrub: 0.8 }
    }));

    /* ---------- Tjänster: etikettkorten lyfts in på radbandet och halkar
       sedan vidare — varje kort i sin egen takt (väggdjup). ------------------ */
    var cards = gsap.utils.toArray(".label-card");
    extra.push(gsap.fromTo(cards, { y: 34, opacity: 0 }, {
      y: 0, opacity: 1, ease: "none", stagger: 0.3,
      scrollTrigger: { trigger: ".labels", start: "top 92%", end: "top 36%", scrub: 1 }
    }));
    var cardDy = [34, -26, 44, -36, 24];
    cards.forEach(function (card, i) {
      extra.push(gsap.fromTo(card, { y: cardDy[i % cardDy.length] * 0.5 }, {
        y: cardDy[i % cardDy.length] * -0.5, ease: "none",
        scrollTrigger: { trigger: "#tjanster", start: "top bottom", end: "bottom top", scrub: 1 }
      }));
    });

    /* COLOR — väggtonen fördjupas djupare ner i huset: fast vinjett som
       tätnar med scroll-djupet (kant-zonerna nuddar ej brödtextens kolumn). */
    gsap.fromTo(".wall-vignette", { opacity: 0 }, {
      opacity: 1, ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1 }
    });

    /* ---------- Galleriväggen: varje ram har sin egen takthet ----------------
       DRIFT  — lodrät/ vågrät halkning, fem olika hastigheter (väggliv),
       ZOOM   — den passerande ramen sväller mot ögonhöjd och lägger sig,
       KENB   — duken panoreras långsamt, alternerande riktning per rad,
       TRÅD   — hängtråden ritas när ramen lyfts in,
       COLOR  — bildlampans sken tändas i tändhöjd,
       skylten — glider upp under verket när radbandet korsar viewporten. ---- */
    var hangs = gsap.utils.toArray("#galleri .hang");
    var dy = [54, 28, 60, 22, 46];                /* px total svängning — olikt tempo */
    var dx = [10, -8, 6, -12, 9];

    hangs.forEach(function (hang, i) {
      var rowIn = { trigger: ".galleri__wall", start: "top bottom", end: "bottom top", scrub: 1 };

      extra.push(gsap.fromTo(hang, { y: -dy[i % dy.length] * 0.5, x: dx[i % dx.length] * 0.5 }, {
        y: dy[i % dy.length] * 0.5, x: dx[i % dx.length] * 0.5, ease: "none",
        scrollTrigger: rowIn
      }));

      extra.push(gsap.fromTo(hang, { scale: 1 }, {
        scale: 1.045, ease: "sine.inOut", yoyo: true, repeat: 1,
        scrollTrigger: { trigger: hang, start: "top bottom", end: "top top", scrub: 1 }
      }));

      var img = hang.querySelector(".canvas img");
      if (img) {
        var panX = i % 2 ? 5 : -5, panY = i % 2 ? -4 : 4;
        extra.push(gsap.fromTo(img,
          { scale: 1.2, xPercent: panX, yPercent: panY }, {
            scale: 1.09, xPercent: -panX * 0.6, yPercent: -panY * 0.6, ease: "none",
            scrollTrigger: { trigger: hang, start: "top bottom", end: "bottom top", scrub: 1 }
          }));
      }

      var fig = hang.querySelector(".work");
      if (fig) {
        var wire = dekor('span', 'hang-wire', fig, true);
        extra.push(gsap.fromTo(wire, { scaleY: 0, transformOrigin: "top center" }, {
          scaleY: 1, ease: "none",
          scrollTrigger: { trigger: hang, start: "top bottom", end: "top 60%", scrub: 0.8 }
        }));
      }

      var plaque = hang.querySelector(".plaque");
      if (plaque) {
        extra.push(gsap.fromTo(plaque, { y: 22, opacity: 0 }, {
          y: 0, opacity: 1, ease: "none",
          scrollTrigger: { trigger: hang, start: "top 88%", end: "top 34%", scrub: 0.9 }
        }));
      }

      var light = hang.querySelector(".work__light");
      if (light) {
        extra.push(gsap.fromTo(light, { opacity: 0, scale: 0.86 }, {
          opacity: 1, scale: 1, ease: "none",
          scrollTrigger: { trigger: hang, start: "top bottom", end: "top 42%", scrub: 0.8 }
        }));
      }
    });

    /* ---------- Biljettluckan: dagskorten lyfts in och svajar i egen takt --- */
    var days = gsap.utils.toArray("#tidsgaller .day");
    extra.push(gsap.fromTo(days, { y: 30, opacity: 0 }, {
      y: 0, opacity: 1, ease: "none", stagger: 0.35,
      scrollTrigger: { trigger: "#tidsgaller", start: "top 92%", end: "top 38%", scrub: 1 }
    }));
    var dayDy = [22, -18, 26, -22, 18];
    days.forEach(function (day, i) {
      extra.push(gsap.fromTo(day, { y: dayDy[i % dayDy.length] * 0.5 }, {
        y: dayDy[i % dayDy.length] * -0.5, ease: "none",
        scrollTrigger: { trigger: "#boka", start: "top bottom", end: "bottom top", scrub: 1 }
      }));
    });

    /* ---------- Mörka rummet + golvet: kontaktplattan, formuläret och
       sidfoten lyfts in i sina egna takter. ---------------------------------- */
    extra.push(gsap.fromTo(".contact-card", { y: 38, opacity: 0 }, {
      y: 0, opacity: 1, ease: "none",
      scrollTrigger: { trigger: ".kontakt-grid", start: "top 90%", end: "top 30%", scrub: 1 }
    }));
    extra.push(gsap.fromTo(".contact-form", { y: 52, opacity: 0 }, {
      y: 0, opacity: 1, ease: "none",
      scrollTrigger: { trigger: ".kontakt-grid", start: "top 84%", end: "top 22%", scrub: 1 }
    }));
    extra.push(gsap.fromTo(".site-footer__inner > *", { y: 26, opacity: 0 }, {
      y: 0, opacity: 1, ease: "none", stagger: 0.4,
      scrollTrigger: { trigger: ".site-footer", start: "top 92%", end: "top 44%", scrub: 1 }
    }));

    return function () {
      if (heroTl) heroTl.kill();
      extra.forEach(function (x) { if (x.kill) x.kill(); });
      extra.forEach(function (x) { if (x.remove) x.remove(); });
    };
  });

  /* ---------- Desktop: PIN — vägglappen hålls medan verken passerar ------- */
  mm.add("(prefers-reduced-motion: no-preference) and (min-width: 701px)", function () {

    gsap.utils.toArray("#galleri .wall").forEach(function (wall) {
      /* DRIFT — hela väggen svajar litet sidled när man promenerar förbi. */
      gsap.fromTo(wall, { x: -26 }, {
        x: 26, ease: "none",
        scrollTrigger: { trigger: wall, start: "top bottom", end: "bottom top", scrub: 1 }
      });
    });

    ST.create({
      trigger: "#galleri",
      start: "top top",
      end: "bottom bottom",
      pin: ".galleri__head"          /* sektionstiteln sitter stilla medan
                                        väggens ramar glider förbi under */
    });
  });

  /* ------- Mobil: PIN — lodrät scroll blir vågrät vandring längs vaggen --- */
  mm.add("(prefers-reduced-motion: no-preference) and (max-width: 700px)", function () {
    var strip = document.querySelector("#galleri .wall");
    if (!strip) return;

    /* Bandet öppnas upp (clip:en sköter .galleri__wall) så innehållet kan
       glida; vid reduce kör denna gren aldrig — CSS-bandet finns kvar. */
    gsap.set(strip, { overflowX: "visible" });

    gsap.to(strip, {
      x: function () { return -(strip.scrollWidth - strip.clientWidth); },
      ease: "none",
      scrollTrigger: {
        trigger: ".galleri__wall",
        start: "top top",
        end: function () { return "+=" + (strip.scrollWidth - strip.clientWidth); },
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true
      }
    });
  });
})();
