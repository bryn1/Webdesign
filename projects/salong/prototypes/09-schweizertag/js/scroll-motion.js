/* scroll-motion.js — TEMA 09 "Rutinerat" (Schweizertåg): ALL scroll-rörelse
   i ETT enda GSAP/ScrollTrigger-lager (lokalt vendor i head, defer, IIFE —
   inga egna globaler). DENSITY-04b: rörelsen är tät men alltid konstruerad —
   parallell, axelren (x ELLER y, aldrig rotation), konvergerande (±A → 0) och
   i rutnätets egna steg. Triggers byggs ENDAST i gsap.matchMedias
   no-preference-gren: vid prefers-reduced-motion byggs noll triggers och
   sidan står i CSS-utgångsläget, allt synligt; utan JS händer ingenting —
   default-visible. Marquee-bandet är tidsstyrd CSS och bor i motion.css;
   dialog, kalender och formulär bor i main.js.
   Rörelseklasser — Schweizertåg:
   LINE   = progress-hårlinjen växer längs dokumentet; sektionshårlinjerna
            ritas framåt från vänster kant under inrullningen.
   RISE   = moduler lyfter i staggerade rader (slot-rader, kontaktlistor,
            tjänstekortens text, footer) — y, rutnätstrogna steg.
   WORD   = rubriker glider ord för ord när de korsar skärmen (scrub).
   COLUMN = foto- och textkolumner driver i 2–3 synkade takt per kolumn —
            hela kolumnen delar takt (Schweizisk precision), konvergerar till 0.
   ZOOM   = porträtt och arbetsprov faller till ro + Ken Burns-veksel i y.
   ACCENT = kobolt-kvadrater glider längs hårlinjens baslinje (breda axeln,
            min-width 701) och ensamma accentklossar driver i vittfälten (y).
   DRIFT  = S—- och G—-räknarna glider mot varandra och KONVERGERAR till 0.
   PIN    = "Före & efter"-rubriken hålls i rutnätet — blott desktop. */
(function () {
  "use strict";
  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  if (!gsap || !ST) { return; }            /* vendor ej laddad — vila-läge */
  gsap.registerPlugin(ST);

  var mm = gsap.matchMedia();

  /* ================= Grundrörelser — alla skärmbredder (ej reduce) ======= */
  mm.add("(prefers-reduced-motion: no-preference)", function () {

    /* WORD-hjälp: dela elementets textnoder i ord i <span class="mw"> —
       texten förblir orörd (mellanslag finns kvar), br lämnas som de är.
       Spans byggs nu, direkt i DOMContentLoaded-fasen — aldrig i rAF. */
    function words(el) {
      if (!el || el.dataset.mw) { return el ? el.querySelectorAll(".mw") : []; }
      el.dataset.mw = "1";
      var kids = Array.prototype.slice.call(el.childNodes);
      var frag = document.createDocumentFragment();
      kids.forEach(function (node) {
        if (node.nodeType !== 3) { frag.appendChild(node); return; }
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) { return; }
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var s = document.createElement("span");
          s.className = "mw"; s.textContent = part;
          frag.appendChild(s);
        });
        el.removeChild(node);            /* originalen bort — annars dubbel text */
      });
      el.appendChild(frag);
      return el.querySelectorAll(".mw");
    }

    /* Dekorativ kloss — sätts in i flödet, aria-hidden, tar ingen mus. */
    function accent(cls) {
      var s = document.createElement("span");
      s.className = "sq" + (cls ? " " + cls : "");
      s.setAttribute("aria-hidden", "true");
      return s;
    }

    /* scrubbad timeline-genväg: ease none = linjärt Schweizertåg-steg. */
    function tl(trigger, start, end) {
      return gsap.timeline({ scrollTrigger: { trigger: trigger, start: start, end: end, scrub: 0.6 } });
    }

    /* LINE — progress-hårlinjen 0 → 1 tvärs över hela dokumentet, scrubbad. */
    gsap.set(".progress", { display: "block", transformOrigin: "0 50%", scaleX: 0 });
    gsap.to(".progress", {
      scaleX: 1, ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.5 }
    });

    /* REVEAL — .rv lyfter 20 px när det når 88 %-linjen, blott en gång.
       Undantas: hero + gal-h (åtkomst/PIN) samt de celler vars y ägs av en
       scrubbad rad/takt nedan (.gal-item, .lead) — ett transform-ur per cell. */
    gsap.utils.toArray(".rv").forEach(function (el) {
      if (el.closest(".hero") || el.id === "gal-h" ||
          el.classList.contains("gal-item") || el.classList.contains("lead")) { return; }
      gsap.fromTo(el, { y: 20 }, {
        y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });

    /* ENTRÉ — hero-anslaget lyfter in direkt; rubrikens ord ett extra lyft. */
    gsap.fromTo(".hero .rv", { y: 16 }, {
      y: 0, duration: 0.55, stagger: 0.12, ease: "power2.out"
    });
    gsap.fromTo(words(document.querySelector(".hero h1")), { y: 30 }, {
      y: 0, duration: 0.7, stagger: 0.14, ease: "power3.out", delay: 0.25
    });

    /* COLUMN — entréns text- och bildsida driver i var sin takt (y, mot 0);
       .rv-entreen äger containrarna, så takterna läggs på dess barn. */
    tl(".hero", "top top", "bottom top")
      .fromTo(".hero .sub", { y: 18 }, { y: 0, ease: "none" })
      .fromTo(".hero .cta-row", { y: 16 }, { y: 0, ease: "none" }, 0)
      .fromTo(".hero .frame-text", { y: 44 }, { y: 0, ease: "none" }, 0)
      .fromTo(".hero .frame-tag", { y: 20 }, { y: 0, ease: "none" }, 0);
    gsap.fromTo(".marquee", { y: 14 }, {
      y: 0, ease: "none",
      scrollTrigger: { trigger: ".marquee", start: "top bottom", end: "top 40%", scrub: 0.6 }
    });

    /* Sektionshuvuden: hårlinjen ritas, numret + etiketten lyfter,
       koboltklossen får sin axel i bred-blocket nedan. */
    gsap.utils.toArray(".sec-head").forEach(function (head) {
      var t = tl(head, "top 95%", "top 55%");
      t.fromTo(head.querySelector(".rule"), { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, ease: "none" }, 0);
      t.fromTo([head.querySelector(".sec-no"), head.querySelector(".sec-label")],
        { y: 16 }, { y: 0, ease: "none", stagger: 0.15 }, 0);
      if (!head.closest(".hero")) { head.appendChild(accent()); }
    });

    /* WORD — sektionsrubrikerna glider ord för ord uppåt när rubrikraden
       korsar skärmen; orden är vanliga spans, texten densamma. */
    ["#om-h", "#tj-h", "#gal-h", "#boka-h", "#kontakt-h"].forEach(function (sel) {
      var h = document.querySelector(sel);
      if (!h) { return; }
      tl(h, "top 95%", "top 50%")
        .fromTo(words(h), { y: 28 }, { y: 0, ease: "none", stagger: 0.06 }, 0);
    });

    /* COLOR — gallerifältet dras vit → ljus kyla under inrullningen. */
    gsap.fromTo("#galleri", { backgroundColor: "#ffffff" }, {
      backgroundColor: "#f2f3f8", ease: "none",
      scrollTrigger: { trigger: "#galleri", start: "top bottom", end: "top top", scrub: 1 }
    });

    /* RISE — om-mig-texten lyfter stycke för stycke; bildtexten följer efter. */
    tl(".om-grid", "top 85%", "top 40%")
      .fromTo("#om .om-copy p", { y: 22 }, { y: 0, ease: "none", stagger: 0.12 }, 0)
      .fromTo(".portrait figcaption", { y: 16 }, { y: 0, ease: "none" }, 0.4);

    /* ZOOM + COLUMN — porträttet: skalan faller till ro (1.08→1) medan
       bilden simultant vecklar 16 px i y — Ken Burns axelrent, klippt av
       .portrait-media. Kant och beskärning rörts inte. */
    gsap.fromTo("#om .portrait-media img", { scale: 1.08, y: -16 }, {
      scale: 1, y: 0, ease: "none",
      scrollTrigger: { trigger: "#om .portrait-media", start: "top bottom", end: "top 30%", scrub: 1 }
    });

    /* ZOOM + Ken Burns — arbetsproven: 1.12 → 1 + 14 px y-veckling, allt
       klippt av .gal-media — rutnätet står stilla, blott bilden lever. */
    gsap.utils.toArray(".gal-media img").forEach(function (img) {
      gsap.fromTo(img, { scale: 1.12, y: -14 }, {
        scale: 1, y: 0, ease: "none",
        scrollTrigger: { trigger: img.closest(".gal-item"), start: "top bottom", end: "top 45%", scrub: 1 }
      });
    });

    /* COLUMN — gallericellerna driver i tre synkade takter: hela kolumnen
       (index % 3) delar takt — 30/15/6 px, konvergerande till 0 medan
       galleriet rullar förbi. */
    var galT = tl("#galleri", "top bottom", "bottom top");
    var rates = [30, 15, 6];
    galT.fromTo(".gal-item",
      { y: function (i) { return rates[i % 3]; } },
      { y: 0, ease: "none" }, 0);
    galT.fromTo(".gal-item .frame-tag, .gal-item .frame-text",
      { y: 20 }, { y: 0, ease: "none", stagger: 0.1 }, 0.3);

    /* DRIFT (konvergerande) — S—-räknarna glider mot mitten och stannar i 0. */
    gsap.utils.toArray(".svc-no").forEach(function (num, i) {
      var d = 10 + 5 * i;
      gsap.fromTo(num, { x: i % 2 === 0 ? -d : d }, {
        x: 0, ease: "none",
        scrollTrigger: { trigger: "#tjanster", start: "top bottom", end: "bottom 35%", scrub: 1 }
      });
    });

    /* RISE — tjänstekortens rubrik, brödtext och pris lyfter i förskjutna
        kolumnsteg medan rasten korsar skärmen; kortens ramar står stilla. */
    tl("#tjanster .ticker", "top bottom", "top 30%")
      .fromTo(".svc h3", { y: 22 }, { y: 0, ease: "none", stagger: 0.06 }, 0)
      .fromTo(".svc p:not(.price)", { y: 22 }, { y: 0, ease: "none", stagger: 0.05 }, 0.25)
      .fromTo(".svc .price", { y: 16 }, { y: 0, ease: "none", stagger: 0.05 }, 0.5);

    /* DRIFT (konvergerande) — G—-räknarna driver 6–18 px i y och möter 0. */
    gsap.utils.toArray(".gal-item figcaption .num").forEach(function (num, i) {
      var d = 6 + 4 * (i % 4);
      gsap.fromTo(num, { y: i % 2 === 0 ? -d : d }, {
        y: 0, ease: "none",
        scrollTrigger: { trigger: "#galleri", start: "top bottom", end: "bottom top", scrub: 1 }
      });
    });

    /* ACCENT — ensamma klossar driver i vittfälten (om/boka), y, 40 → 0. */
    ["#om", "#boka"].forEach(function (sel) {
      var sec = document.querySelector(sel);
      if (!sec) { return; }
      var sq = accent("drift-sq");
      sec.appendChild(sq);
      gsap.fromTo(sq, { y: 40 }, {
        y: 0, ease: "none",
        scrollTrigger: { trigger: sec, start: "top bottom", end: "bottom top", scrub: 1 }
      });
    });

    /* RISE — bokningsschemat lyfter rad för rad: dag + tre tider i gemensamt
       rutnätssteg, raderna förskjutna som schweiziska persienner. */
    (function () {
      var grid = document.querySelector(".slots");
      if (!grid) { return; }
      var t = tl(".book", "top bottom", "top 35%");
      var kids = Array.prototype.slice.call(grid.children);
      for (var r = 0; r * 4 < kids.length; r++) {
        t.fromTo(kids.slice(r * 4, r * 4 + 4), { y: 18 }, { y: 0, ease: "none" }, r * 0.12);
      }
    })();
    tl("#boka .book-legend", "top 90%", "top 55%")
      .fromTo("#boka .book-legend > span", { y: 16 }, { y: 0, ease: "none", stagger: 0.2 }, 0);
    tl(".lead", "top 90%", "top 55%")
      .fromTo("#boka .lead", { y: 18 }, { y: 0, ease: "none" }, 0);

    /* RISE — kontaktlistan rad för rad; formuläret fält för fält. Triggerna
       når "bottom bottom" — rörelsen lever in i sista stegcykeln. */
    tl(".kontakt-grid", "top 85%", "bottom bottom")
      .fromTo(".kontakt-list > div", { y: 22 }, { y: 0, ease: "none", stagger: 0.18 }, 0);
    tl(".cform", "top 90%", "bottom bottom")
      .fromTo(".cform label", { y: 18 }, { y: 0, ease: "none", stagger: 0.2 }, 0);

    /* RISE — footer-modulerna stagger: de två cellerna lyfter var för sig. */
    tl(".site-foot", "top bottom", "bottom bottom")
      .fromTo(".foot-grid > *", { y: 20 }, { y: 0, ease: "none", stagger: 0.25 }, 0);
  });

  /* ============ Breda axeln — x-rörelse blott ≥ 701 px (375: y-only) ====== */
  mm.add("(prefers-reduced-motion: no-preference) and (min-width: 701px)", function () {
    /* ACCENT — koboltklossen glider längs hårlinjens baslinje in mot vila. */
    gsap.utils.toArray(".sec-head .sq").forEach(function (sq) {
      gsap.fromTo(sq, { x: -36 }, {
        x: 0, ease: "none",
        scrollTrigger: { trigger: sq.closest(".sec-head"), start: "top 95%", end: "top 55%", scrub: 0.6 }
      });
    });
    /* COLUMN — entécransens hörnkors glider x mot hörnen medan hjältet rullar. */
    gsap.fromTo(".frame-corner.tl", { x: -24 }, {
      x: 0, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom 60%", scrub: 0.6 }
    });
    gsap.fromTo(".frame-corner.br", { x: 24 }, {
      x: 0, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom 60%", scrub: 0.6 }
    });
    /* RISE× — tjänsterastens hintpil knuffas x mot sitt viloläge. */
    gsap.fromTo(".ticker-hint", { x: -16 }, {
      x: 0, ease: "none",
      scrollTrigger: { trigger: "#tjanster", start: "top bottom", end: "top 40%", scrub: 0.6 }
    });
  });

  /* ============ Desktop: PIN — rubriken hålls medan gallret passerar ====== */
  mm.add("(prefers-reduced-motion: no-preference) and (min-width: 701px)", function () {
    var pinT = ST.create({
      trigger: "#galleri",
      start: "top 64px",              /* hålls strax under den fasta headern */
      end: "bottom bottom",
      pin: "#gal-h"                   /* "Före & efter" står stilla i rutnätet
                                         medan bildrutorna passerar */
    });
    return function () { pinT.kill(); };
  });
})();
