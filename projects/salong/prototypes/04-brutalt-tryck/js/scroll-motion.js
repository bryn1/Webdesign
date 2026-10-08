/* scroll-motion.js — 04 Brutalt tryck: ALL scroll-rörelse i ETT enda
   GSAP/ScrollTrigger-lager (lokalt vendor i head, defer). En mekanik per
   bekymmer. Allt innanför IIFE:n: inga egna globaler. Triggers byggs ENDAST
   i gsap.matchMedias no-preference-gren: vid prefers-reduced-motion byggs
   noll triggers och sidan står i CSS-utgångsläget (allt synligt; dekorativa
   aria-hidden-lager får vila); utan JS händer ingenting alls — default-visible.
   DENSITY-03c: glesheten höjd — rubriker KLIVER in ord för ord i hårda steg
   (steps-ease, inga mjukheter), röda klossar glider in som plattor, rutnät
   kontrar ett hack i taget, galleribilderna panerar i hårt beskurna ramar,
   marquee-separerare tickar, reglar ritas i full vikt, fotblock staplas in.
   Mekaniska amplituder 24–60px; många element simultaneously i steg.
   Rörelseklasser: PRESS = mätarskivan slår ifyllt sidan; RUTNÄT = fasta
   tick-linjer kontrar; LINE = reglar ritas; STEP-CLIP = ordkliver;
   COLOR = gallerifältet färgstegras; ZOOM + PAN = bild i hårt fönster;
   DRIFT = kolumner/siffror/remsor följer scrollsträngen; PIN = Om-rubriken
   hålls. Drag-fysiken bor kvar i hero-drag.js (ej scroll). */
(function () {
  "use strict";
  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  if (!gsap || !ST) { return; }            /* vendor ej laddad — vila-läge */
  gsap.registerPlugin(ST);

  var mm = gsap.matchMedia();

  /* Hjälpredor: scrub-timeline + hårt stegdrift-tween (mekanik, ej smet).
     Delade av båda matchMedia-grenarna — definierade utanför dem. */
  function scrubTL(trigger, start, end, scrubv) {
    return gsap.timeline({
      scrollTrigger: { trigger: trigger, start: start, end: end, scrub: scrubv || 1 }
    });
  }
  function step(tl, el, prop, from, to, pos, n) {
    var f = {}, t = { ease: "steps(" + (n || 4) + ")", duration: 0.9 };
    f[prop] = from; t[prop] = to;
    tl.fromTo(el, f, t, pos);
  }

  /* ================= Grundrörelser — alla skärmbredder (ej reduce) ======== */
  mm.add("(prefers-reduced-motion: no-preference)", function () {

    /* REVEAL — data-reveal-avsnitt glider in när de når 88 %-linjen.
       (Hero-rubriken undantas: den får sin scrub-parallax nedan.) */
    gsap.utils.toArray("[data-reveal]:not(.hero-title)").forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });

    /* PRESS — mätarskivan: röd regel som slår ifyllt sidan längs. Fast
       element → rörelse vid VARJE scrollsteg. */
    gsap.fromTo(".press-slab", { scaleX: 0 }, {
      scaleX: 1, ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.6 }
    });

    /* RUTNÄT — fasta tick-linjer kontrar scroll ett hack i taget, omväxlande
       håll. Även dessa: rörelse vid varje steg. */
    gsap.utils.toArray(".grid-rails i").forEach(function (rail, i) {
      gsap.fromTo(rail, { y: i % 2 === 0 ? 44 : -44 }, {
        y: i % 2 === 0 ? -44 : 44, ease: "steps(7)",
        scrollTrigger: { start: 0, end: "max", scrub: 1 }
      });
    });

    /* STEP-CLIP — rubriksord kliver in underifrån i hårda steg, ett efter
       ett. Startläget (translateY 115 %) ligger i motion.css under html.js +
       no-preference; GSAP skriver samma värde inline → inge ryck. */
    function clipWords(headSel, words) {
      var tl = scrubTL(headSel, "top 92%", "top 42%");
      words.forEach(function (w, i) {
        step(tl, w, "y", "115%", "0%", i * 0.09, 5);
      });
    }
    gsap.utils.toArray(".section-title").forEach(function (h) {
      clipWords(h, gsap.utils.toArray(h.querySelectorAll(".w")));
    });
    var fbig = document.querySelector(".footer-big");
    if (fbig) { clipWords(fbig, gsap.utils.toArray(fbig.querySelectorAll(".w"))); }

    /* LINE — de tunga reglarna ritas från vänster medan de korsar skärmen. */
    gsap.utils.toArray(".draw-rule").forEach(function (rule) {
      gsap.fromTo(rule, { scaleX: 0, transformOrigin: "left center" }, {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: rule, start: "top 95%", end: "top 55%", scrub: 0.5 }
      });
    });

    /* LINE lodrätt — sektorernas kantreglar ritas i full vikt uppåt. */
    gsap.utils.toArray(".rule-v").forEach(function (rv) {
      gsap.fromTo(rv, { scaleY: 0 }, {
        scaleY: 1, ease: "steps(8)",
        scrollTrigger: { trigger: rv, start: "top 95%", end: "top 45%", scrub: 0.8 }
      });
    });

    /* KLOSS — röda hårda plattor glider in vertikalt i hack (x-släppet
       ligger i desktop-grenen nedan). */
    gsap.utils.toArray(".slab").forEach(function (slab, i) {
      gsap.fromTo(slab, { y: i % 2 === 0 ? 60 : -60 }, {
        y: 0, ease: "steps(8)",
        scrollTrigger: { trigger: slab.parentNode, start: "top bottom", end: "top 35%", scrub: 1 }
      });
    });

    /* COLOR — gallerifältet färgstegras svart → signalrött i hårda steg
       (stepped ease = tryckta färgblock, inte smet). Vita texten på rött
       är samma AA-par som temat redan använder (bg-on-red 4.6:1). */
    gsap.fromTo("#galleri", { backgroundColor: "#0a0a0a" }, {
      backgroundColor: "#e11d48", ease: "steps(4)",
      scrollTrigger: { trigger: "#galleri", start: "top bottom", end: "top top", scrub: 1 }
    });

    /* ZOOM — porträttbilden landar i skärpan: 1.12 → 1 medan ramen kliver
       in. Skalaten sitter på bilden inuti ramen: vit kant + röd hållskugga
       på .portrait-slot påverkas aldrig. */
    gsap.fromTo("#om .portrait-slot img", { scale: 1.12 }, {
      scale: 1, ease: "none",
      scrollTrigger: { trigger: "#om .portrait-slot", start: "top bottom", end: "top 35%", scrub: 1 }
    });

    /* DRIFT — om-kolumnerna driver MOT varandra: texten sjunker, ramen
       stiger (scrub = de följer scrollbarnden hela vägen). */
    var omDrift = scrubTL("#om .about-grid", "top bottom", "bottom top");
    step(omDrift, "#om .about-copy p", "y", -30, 30, 0, 6);
    step(omDrift, "#om .portrait-slot", "y", 26, -26, 0, 6);

    /* DRIFT — eyebrow-etiketter hackar mot noll från utsatt läge på smal
       bredd; det breda x-släppet ligger i desktop-grenen (mobil-clamp:
       ingen bred x). Alla drift-tweens på layoutelement KONVERGERAR till 0
       — i villa-läge sitter allt i rutnätet, inga glidna lägen kvar. */
    gsap.utils.toArray(".section-head .eyebrow").forEach(function (eb, i) {
      gsap.fromTo(eb, { y: i % 2 === 0 ? -14 : 14 }, {
        y: 0, ease: "steps(5)",
        scrollTrigger: { trigger: eb.closest(".section-head"), start: "top 95%", end: "top 40%", scrub: 1 }
      });
    });

    /* DRIFT — jättesiffrorna kliver vertikalt medan korten staplas; titel,
       text och pris följer i motrikt steg — hela kortet lever. (De breda
       x-drifterna på samma element registreras i desktop-grenen.) */
    document.querySelectorAll(".svc").forEach(function (card, i) {
      var dir = i % 2 === 0 ? 1 : -1;
      var num = card.querySelector(".svc-num");
      if (num) {
        var tn = scrubTL(card, "top bottom", "bottom top");
        step(tn, num, "y", 18 * dir, 0, 0, 4);
      }
      var tb = scrubTL(card, "top bottom", "bottom top");
      step(tb, card.querySelector(".svc-title"), "y", 20 * dir, 0, 0, 4);
      step(tb, card.querySelector(".svc-text"), "y", -12 * dir, 0, 0.1, 4);
      step(tb, card.querySelector(".svc-price"), "y", 14 * dir, 0, 0.2, 4);
    });

    /* DRIFT — hero: rubriken lyfter, ordkliverna glider hårt åt varsitt
       håll, saxstickern gungar. Stickerns x är ren transform; drag-fysiken
       i hero-drag.js använder translate-/rotate-egenskaperna — de
       kombineras utan konflikt. */
    gsap.fromTo(".hero-title", { y: 0 }, {
      y: -70, ease: "none",
      scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: 1 }
    });
    gsap.utils.toArray(".hero-title .hw").forEach(function (w, i) {
      gsap.fromTo(w, { x: i % 2 === 0 ? -24 : 24 }, {
        x: i % 2 === 0 ? 24 : -24, ease: "steps(4)",
        scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: 1 }
      });
    });
    var sticker = document.querySelector("[data-hero-sticker]");
    if (sticker) {
      gsap.fromTo(sticker, { x: -14 }, {
        x: 34, ease: "none",
        scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: 1 }
      });
    }

    /* DRIFT — marquee-remsan fölfter scrollhastigheten utöver sin egen
       klockgång (förälderns transform, barnens CSS-animation rör ej). */
    gsap.fromTo(".marquee-inner", { x: 40 }, {
      x: -40, ease: "none",
      scrollTrigger: { trigger: ".marquee", start: "top bottom", end: "top top", scrub: 1 }
    });
    /* TICK — multiplikatecknen kliver runt i hack medan remsan passerar. */
    gsap.utils.toArray(".marquee-sep").forEach(function (sep, i) {
      gsap.fromTo(sep, { rotation: i % 2 === 0 ? -30 : 30 }, {
        rotation: i % 2 === 0 ? 30 : -30, ease: "steps(3)",
        scrollTrigger: { trigger: ".marquee", start: "top bottom", end: "bottom top", scrub: 1 }
      });
    });

    /* MARCH — hårdklossremsan mellan tjänster och galleri marcherar ett
       block-ackord i taget. */
    gsap.fromTo(".block-strip-inner", { x: 0 }, {
      x: "-30%", ease: "steps(10)",
      scrollTrigger: { trigger: ".block-strip", start: "top bottom", end: "bottom top", scrub: 1 }
    });

    /* FÖNSTER — galleribilderna panerar i hårt beskurna ramar (CSS skalar
       bilden 1.22; GSAP panerar y — transform och scale-egenskapen samsas). */
    gsap.utils.toArray(".gal-card").forEach(function (card, i) {
      gsap.fromTo(card, { y: 56 }, {
        y: 0, ease: "steps(6)",
        scrollTrigger: { trigger: card, start: "top 98%", end: "top 68%", scrub: 1 }
      });
      var img = card.querySelector(".gal-media img");
      if (img) {
        gsap.fromTo(img, { y: "-7%" }, {
          y: "7%", ease: "steps(5)",
          scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: 1 }
        });
      }
      step(scrubTL(card, "top bottom", "bottom top"), card.querySelector(".gal-tag"),
        "x", i % 2 === 0 ? -16 : 16, 0, 0, 4);
      step(scrubTL(card, "top bottom", "bottom top"), card.querySelector(".gal-title"),
        "y", i % 2 === 0 ? 12 : -12, 0, 0.1, 4);
    });

    /* BOKA — tidsloterna kliver in i omväxlande hack (y på smal bredd, x i
       desktop-grenen); demomärket gungar i steg; led och fottext driver. */
    var slots = gsap.utils.toArray(".slot");
    if (slots.length) {
      var slotTL = scrubTL(".slots", "top bottom", "bottom 20%");
      slots.forEach(function (slot, i) {
        step(slotTL, slot, "y", i % 2 === 0 ? 18 : -18, 0, i * 0.06, 4);
      });
    }
    gsap.utils.toArray(".wrap .demo-badge").forEach(function (badge, i) {
      gsap.fromTo(badge, { rotation: i % 2 === 0 ? -8 : 8 }, {
        rotation: i % 2 === 0 ? 8 : -8, ease: "steps(4)",
        scrollTrigger: { trigger: badge, start: "top 95%", end: "top 55%", scrub: 1 }
      });
    });
    /* (x, inte y på desktop: .boka-lead har redan en y-reveal. På smal
       bredd: ingen drift — kanten är för trång för bred x.) */

    /* KONTAKT — etiketterna hackar i höjd, formuläret skakar mekaniskt i
       små steg. (Li-kolumnens breda x kliver i desktop-grenen.) */
    var kontaktTL = scrubTL(".kontakt-grid", "top bottom", "bottom top");
    gsap.utils.toArray(".k-label").forEach(function (kl, i) {
      step(kontaktTL, kl, "y", i % 2 === 0 ? 12 : -12, 0, 0.3 + i * 0.04, 4);
    });
    var formTL = scrubTL(".demo-form", "top bottom", "bottom 30%");
    gsap.utils.toArray(".demo-form label, .demo-form input, .demo-form textarea").forEach(function (fld, i) {
      step(formTL, fld, i % 2 === 0 ? "y" : "x", i % 2 === 0 ? 14 : -12, 0, i * 0.05, 4);
    });
    gsap.fromTo(".form-status", { x: 18 }, {
      x: 0, ease: "steps(4)",
      scrollTrigger: { trigger: ".demo-form", start: "top bottom", end: "bottom 30%", scrub: 1 }
    });

    /* FOOTER — länkarna staplas in i hack, noten hackar i höjd (breda
       x-driveri desktop-grenen), allt i hård mekanik. */
    gsap.utils.toArray(".footer-nav a").forEach(function (a, i) {
      gsap.fromTo(a, { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.45, ease: "steps(5)",
        scrollTrigger: { trigger: a, start: "top 96%", once: true }
      });
    });
    gsap.fromTo(".footer-note", { y: 24 }, {
      y: 0, ease: "steps(6)",
      scrollTrigger: { trigger: ".site-footer", start: "top bottom", end: "bottom bottom", scrub: 1 }
    });
  });

  /* ============ Desktop: PIN + alla breda x-rörelser (ej mobil) ==========
     Mobilen har bara y-hopp (kantmarginalen 18–19px ryms inte bred x utan
     att documentElement får hOverflow) — de breda x-släppen och -drifterna
     bor här bakom min-width 701px där marginalrymd finns. */
  mm.add("(prefers-reduced-motion: no-preference) and (min-width: 701px)", function () {
    var pinT = ST.create({
      trigger: "#om",
      start: "top 64px",          /* hålls strax under den fasta headern */
      end: "bottom bottom",
      pin: "#om .section-head"     /* rubriken sitter stilla medan kopior +
                                      porträttet (drift + zoom) passerar under */
    });
    gsap.utils.toArray(".slab").forEach(function (slab, i) {
      var dir = i % 2 === 0 ? 1 : -1;
      gsap.fromTo(slab, { x: 70 * dir }, {
        x: 0, ease: "steps(8)",
        scrollTrigger: { trigger: slab.parentNode, start: "top bottom", end: "top 30%", scrub: 1 }
      });
    });

    /* BRED-X — desktongrenens horisontella mekanik (samma element som
       basgrenens y-hopp; transform-komponenterna x och y slås ihop av GSAP
       utan konflikt). */
    gsap.utils.toArray(".section-head .eyebrow").forEach(function (eb, i) {
      gsap.fromTo(eb, { x: i % 2 === 0 ? -28 : 28 }, {
        x: 0, ease: "steps(5)",
        scrollTrigger: { trigger: eb.closest(".section-head"), start: "top 95%", end: "top 40%", scrub: 1 }
      });
    });
    document.querySelectorAll(".svc").forEach(function (card, i) {
      var dir = i % 2 === 0 ? 1 : -1;
      var tl = scrubTL(card, "top bottom", "bottom top");
      var num = card.querySelector(".svc-num");
      if (num) { step(tl, num, "x", -24 * dir, 0, 0, 5); }
      step(tl, card.querySelector(".svc-title"), "x", 26 * dir, 0, 0.05, 4);
      step(tl, card.querySelector(".svc-text"), "x", -16 * dir, 0, 0.1, 4);
    });
    var slotsD = gsap.utils.toArray(".slot");
    if (slotsD.length) {
      var slotTLD = scrubTL(".slots", "top bottom", "bottom 20%");
      slotsD.forEach(function (slot, i) {
        /* ±20px: två intilliggande chips möts som mest vid 40px — column-gap
           48px (components.css) ryms alltid. */
        step(slotTLD, slot, "x", i % 2 === 0 ? 20 : -20, 0, i * 0.06, 4);
      });
    }
    gsap.utils.toArray(".boka-lead, .boka-real").forEach(function (p, i) {
      gsap.fromTo(p, { x: 24 * (i % 2 === 0 ? 1 : -1) }, {
        x: 0, ease: "steps(6)",
        scrollTrigger: { trigger: "#boka .wrap", start: "top bottom", end: "bottom top", scrub: 1 }
      });
    });
    var kontaktTLD = scrubTL(".kontakt-grid", "top bottom", "bottom top");
    gsap.utils.toArray(".kontakt-list li").forEach(function (li, i) {
      step(kontaktTLD, li, "x", i % 2 === 0 ? 22 : -22, 0, i * 0.06, 5);
    });
    gsap.fromTo(".footer-note", { x: 30 }, {
      x: 0, ease: "steps(6)",
      scrollTrigger: { trigger: ".site-footer", start: "top bottom", end: "bottom bottom", scrub: 1 }
    });
    return function () { pinT.kill(); };
  });
})();
