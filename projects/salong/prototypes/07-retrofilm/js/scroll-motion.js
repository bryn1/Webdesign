/* scroll-motion.js — 07 Silverkorn: ALL scroll-rörelse i ETT enda GSAP/
   ScrollTrigger-lager (lokalt vendor i head, defer). Inga egna globaler.
   Allt innanför gsap.matchMedias no-preference-gren — vid prefers-reduced-
   motion byggs noll triggers och sidan står i CSS-utgångsläget (allt
   synligt); utan JS händer ingenting — default-visible. Förhandlaren,
   blandningsmarkören, rull-knapparna, kalendern och formuläret är ej-scroll
   och bor där de är. Dekorspann i HTML (sprocket__strip, gate, frame-no) är
   aria-hidden + pointer-events:none och synliga i utgångsläget.
   Rörelseklasser: LINE grindar/perforering ritas · COLOR papperstonen
   åldras · ZOOM Ken-Burns på rutor och porträtt · DRIFT rullens lager
   haltar mot varandra · STAGG
   rutor, tider och sidfotsramar kliver in förskjutna · KLIPP rubriker
   radas upp rad för rad under mask. DENSITET (ägardom: "inte tillräckligt
   med saker som rör sig"): utspridd scrub på många småelement —
   rutmotstånd i rullen, perforationsband som motrullar, slangnummer som
   gungar, kalluttexter som glider, tidsrutor som skälver, sidfot som
   stagger, papper som motrullar, korn som driver diagonalt. */
(function () {
  "use strict";
  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  if (!gsap || !ST) { return; }            /* vendor ej laddad — vila-läge */
  gsap.registerPlugin(ST);

  var mm = gsap.matchMedia();

  /* ================= Grundrörelser — alla skärmbredder (ej reduce) ======== */
  mm.add("(prefers-reduced-motion: no-preference)", function () {
    var ctx = gsap.context(function () {

    /* Hjälp: ett scrub-vindu längs ett avsnitts passage. */
    function win(trigger, start, end, scrub) {
      return { trigger: trigger, start: start || "top bottom",
               end: end || "bottom top", scrub: scrub == null ? 1 : scrub };
    }
    var pageWin = win(document.body, "top top", "bottom bottom", 1);

    /* REVEAL (ersätter reveal.js) — data-reveal glider in när det når
       88 %-linjen, blott en gång. Hero-elementen undantas: de får sin
       entränedan och ledarringens rotation. */
    gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      if (el.closest(".hero")) { return; }
      gsap.fromTo(el, { opacity: 0, y: 22 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });

    /* ENTRÉ — hero-anslaget tonar in direkt (ingen scroll behövs);
       förhandlaren i preloader.js har redan svarat för entréögonblicket. */
    gsap.fromTo(".hero [data-reveal]", { opacity: 0, y: 18 }, {
      opacity: 1, y: 0, duration: 0.55, stagger: 0.09,
      delay: 0.15, ease: "power2.out"
    });

    /* DRIFT — kornet driver diagonalt i sin egen långsamma takt genom hela
       dokumentet (1.16-skalat + infattat så ingen kant blottas). */
    gsap.set(".grain", { scale: 1.16 });
    gsap.fromTo(".grain", { x: 46, y: 32, immediateRender: false }, {
      x: -46, y: -32, ease: "none", scrollTrigger: pageWin
    });

    /* DRIFT — papperet motrullar: bakre lagret glider uppåt medan sidan
       rullar ner (backdrop-djup). Lagret skapas här, inuti grenen. */
    var paper = document.createElement("div");
    paper.className = "paper-layer";
    paper.setAttribute("aria-hidden", "true");
    document.body.insertBefore(paper, document.body.firstChild);
    gsap.fromTo(paper, { y: 64 }, { y: -64, ease: "none", scrollTrigger: pageWin });

    /* DRIFT — filmledarens räknerring roterar medan heroavsnittet rullar förbi
       (scrub = rullningen följer scrollbarnden; ren dekor, orörd utan JS). */
    gsap.fromTo(".hero-leader svg", { rotate: 0 }, {
      rotate: 90, ease: "none", scrollTrigger: win(".hero", "top top", "bottom top")
    });

    /* DRIFT — hero-kolumnen haltar isär MEDAN hjältet lämnar skärmen:
       utgångsläget är 0 (i vila står allt på sin plats — viktigt överst
       på sidan och på 375 px), sedan glider ögonbrynet, underrubriken,
       knapparna och ledaren åt varsitt håll. */
    var heroWin = win(".hero", "top top", "bottom top");
    gsap.fromTo(".hero-eyebrow", { x: 0 }, { x: -22, ease: "none", scrollTrigger: heroWin }); /* vänster: blockets högerkant får inte gå över viewportskanten (375-vakt) */
    gsap.fromTo(".hero-sub", { y: 0 }, { y: -16, ease: "none", scrollTrigger: heroWin });
    gsap.utils.toArray(".hero-cta .btn").forEach(function (b, i) {
      gsap.fromTo(b, { x: 0 }, { x: i % 2 ? 16 : -16, ease: "none", scrollTrigger: heroWin });
    });
    gsap.fromTo(".hero-leader", { x: 0 }, { x: -14, ease: "none", scrollTrigger: heroWin });

    /* LINE — filmremsorna (sprocket-bandens perforering) ritas framåt från
       vänster kant medan bandet korsar skärmen. */
    gsap.utils.toArray(".sprocket").forEach(function (band) {
      gsap.fromTo(band, { scaleX: 0, transformOrigin: "left center" }, {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: band, start: "top 95%", end: "top 55%", scrub: 0.6 }
      });
    });

    /* DRIFT — perforeringsdottern motrullar vertikalt genom bandet: hålen
       glider åt andra hållet än sidan (remsa som går i projektorn). */
    gsap.utils.toArray(".sprocket__strip").forEach(function (strip, i) {
      gsap.fromTo(strip, { y: i % 2 ? 24 : -24 }, {
        y: i % 2 ? -24 : 24, ease: "none",
        scrollTrigger: win(strip.parentElement, "top bottom", "bottom top", 0.7)
      });
    });

    /* DRIFT — scennumren (reel-mark) gungar: varje avsnittsmark svajar
       litet åt sitt håll medan avsnittet korsar skärmen. */
    gsap.utils.toArray(".reel-mark").forEach(function (mark, i) {
      var d = i % 2 ? -1 : 1;
      gsap.fromTo(mark, { x: 14 * d, y: 6, rotate: 3 * d }, {
        x: -14 * d, y: -6, rotate: -3 * d, ease: "none",
        scrollTrigger: win(mark.closest("section") || mark)
      });
    });

    /* COLOR — papperstonen åldras: gallerifältet krem → gammal film
       under inrullningen. Båda ändarna bär koltexten överlägset AA. */
    gsap.fromTo("#galleri", { backgroundColor: "#f3ecdc" }, {
      backgroundColor: "#eae1cc", ease: "none",
      scrollTrigger: win("#galleri", "top bottom", "top top")
    });

    /* ZOOM — porträttbilden faller till ro med sidodrift: 1.1 → 1 och en
     †litet horisontell vandring medan ramen kliver in. Skalaten sitter på
       bilden INUTI .portrait-slot — kant, beskärning orörda. */
    gsap.fromTo("#om .portrait-slot img", { scale: 1.1, x: -8 }, {
      scale: 1, x: 8, ease: "none",
      scrollTrigger: win("#om .portrait-slot", "top bottom", "top 40%")
    });

    /* DRIFT — Scen 01 haltar isär: textkolumnen sjunker, filmbilden stiger. */
    var omDrift = gsap.timeline({ scrollTrigger: win("#om .om-grid") });
    omDrift.fromTo("#om .om-grid > div:last-child", { y: -24 }, { y: 24, ease: "none" }, 0);
    omDrift.fromTo("#om .portrait-slot", { y: 22 }, { y: -22, ease: "none" }, 0);

    /* DRIFT — tjänstekortens inre glider: rubrik, brödtext och prisrad
       rör sig varsitt håll (urklippskänsla på rullens etiketter). */
    gsap.utils.toArray(".service-card").forEach(function (card, i) {
      var d = i % 2 ? -1 : 1;
      var w = win("#tjanster");
      gsap.fromTo(card.querySelector("h3"), { x: 10 * d }, { x: -10 * d, ease: "none", scrollTrigger: w });
      gsap.fromTo(card.querySelector(".price-line"), { x: -14 * d }, { x: 14 * d, ease: "none", scrollTrigger: w });
      var p = card.querySelector("p:not(.price-line)");
      if (p) { gsap.fromTo(p, { y: 10 * d }, { y: -10 * d, ease: "none", scrollTrigger: w }); }
    });

    /* DRIFT — asset-numren på tjänstekorten glider horisontelt vart sitt
       åt håll medan korten passerar. */
    gsap.utils.toArray(".asset-no").forEach(function (num, i) {
      gsap.fromTo(num, { x: i % 2 === 0 ? -16 : 16 }, {
        x: i % 2 === 0 ? 16 : -16, ease: "none", scrollTrigger: win("#tjanster")
      });
    });

    /* ===== Galleriet — rullen som går ===== */
    var galWin = win("#galleri");

    /* DRIFT+STAGG — filmrutorna advancing horisontellt (rullen driver) och
       gungar vertikalt mot varandra: varje ruta sin egen amplitud. */
    gsap.utils.toArray(".film-frame").forEach(function (frame, i) {
      var d = i % 2 === 0 ? -1 : 1;
      gsap.fromTo(frame, { x: (-30 - i * 5) * d, y: 14 * d }, {
        x: (30 + i * 5) * d, y: -14 * d, ease: "none", scrollTrigger: galWin
      });
    });

    /* ZOOM — Ken-Burns per ruta: bilden skalas 1 → 1.05 med sidodrift när
       rutan kliver in (bildbehandlingen i __media:ns beskärning orörd). */
    gsap.utils.toArray(".film-frame__media img").forEach(function (img, i) {
      var d = i % 2 ? 1 : -1;
      gsap.fromTo(img, { scale: 1, x: 0 }, {
        scale: 1.05, x: 6 * d, ease: "none",
        scrollTrigger: win(img.closest(".film-frame"), "top bottom", "top 20%")
      });
    });

    /* LINE — filmgrinden ritas: horisontal- och vertikalregel dras när
       rutan når grindlinjen (scaleX/scaleY på dekorativa spans). */
    gsap.utils.toArray(".film-frame").forEach(function (frame) {
      var gw = { trigger: frame, start: "top 92%", end: "top 46%", scrub: 0.5 };
      var gx = frame.querySelector(".gate--x");
      var gy = frame.querySelector(".gate--y");
      gsap.fromTo(gx, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: gw });
      gsap.fromTo(gy, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: gw });
    });

    /* STAGG — kalluttexten (figcaption) glider in bakifrån sidan när
       rutan kliver in — som en underrubrik på en filmplakat. */
    gsap.utils.toArray(".film-frame figcaption").forEach(function (cap, i) {
      var d = i % 2 ? 1 : -1;
      gsap.fromTo(cap, { x: 40 * d }, {
        x: 0, ease: "power2.out",
        scrollTrigger: { trigger: cap.closest(".film-frame"), start: "top 96%", end: "top 40%", scrub: 0.6 }
      });
    });

    /* DRIFT — slangnumren gungar i kanten och tomruternas rutnummer
       glider: varje nummer för sig (dekor, befintlig opacitet orörd). */
    gsap.utils.toArray(".frame-no").forEach(function (no, i) {
      gsap.fromTo(no, { rotate: -5 * (i % 2 ? -1 : 1), y: 4 }, {
        rotate: 5 * (i % 2 ? -1 : 1), y: -4, ease: "none", scrollTrigger: galWin
      });
    });
    gsap.utils.toArray(".frame-gap__no").forEach(function (no, i) {
      gsap.fromTo(no, { x: i % 2 ? 10 : -10 }, { x: i % 2 ? -10 : 10, ease: "none", scrollTrigger: galWin });
    });

    /* DRIFT — rullknapparna svajar litet medan galleriet korsar skärmen. */
    gsap.utils.toArray(".gallery-tools .btn").forEach(function (btn, i) {
      gsap.fromTo(btn, { x: i % 2 ? 10 : -10 }, { x: i % 2 ? -10 : 10, ease: "none", scrollTrigger: galWin });
    });

    /* ===== Boka — tidstablån som skälver ===== */
    var bokaWin = win("#boka");
    gsap.fromTo("#boka .demo-badge", { y: 12, rotate: 1.5 }, {
      y: -12, rotate: -1.5, ease: "none", scrollTrigger: bokaWin
    });
    gsap.utils.toArray(".cal-legend span").forEach(function (sp, i) {
      var d = i % 2 ? -1 : 1;
      gsap.fromTo(sp, { y: 6 * d, x: 14 * d }, { y: -6 * d, x: -14 * d, ease: "none", scrollTrigger: bokaWin });
    });
    gsap.fromTo(".boka-note", { y: 10 }, { y: -10, ease: "none", scrollTrigger: bokaWin });

    /* STAGG — tidsrutorna skälver omväxlande (filmdorado i tabån) och
       rutnätet glider litet sidledes. Rutnätet byggs av booking.js som
       laddas efter oss — registration sker därför först vid
       DOMContentLoaded (alla defer-script är körda, rutnätet finns),
       fortfarande inuti grenens ctx. */
    document.addEventListener("DOMContentLoaded", function () {
      ctx.add(function () {
        gsap.fromTo(".cal-grid", { x: 8 }, { x: -8, ease: "none", scrollTrigger: bokaWin });
        gsap.utils.toArray(".cal-grid > li").forEach(function (li, i) {
          var d = i % 3 === 0 ? 1 : i % 3 === 1 ? -1 : 0.6;
          gsap.fromTo(li, { y: 4 * d }, { y: -4 * d, ease: "none", scrollTrigger: bokaWin });
        });
      });
    });

    /* ===== Kontakt + sidfot ===== */
    var kontaktWin = win("#kontakt");
    gsap.utils.toArray(".contact-form .field label").forEach(function (lab, i) {
      gsap.fromTo(lab, { x: i % 2 ? -10 : 10 }, { x: i % 2 ? 10 : -10, ease: "none", scrollTrigger: kontaktWin });
    });
    gsap.fromTo("#kontakt .demo-badge", { y: 10, rotate: 2 }, {
      y: -10, rotate: -2, ease: "none", scrollTrigger: kontaktWin
    });

    /* STAGG — sidfotens ramar kliver in förskjutna medan bandet rullas upp,
       rad efter rad (länklistan), och fottexterna driver varsitt håll. */
    var footWin = win(".site-footer", "top bottom", "bottom bottom");
    gsap.utils.toArray(".site-footer .footer-list > li").forEach(function (li, i) {
      gsap.fromTo(li, { y: 20 + i * 4 }, { y: 0, ease: "none", scrollTrigger: footWin });
    });
    gsap.fromTo(".site-footer .wrap > p.mono:first-child", { x: -16 }, { x: 16, ease: "none", scrollTrigger: footWin });
    gsap.fromTo(".footer-note", { y: 12 }, { y: -12, ease: "none", scrollTrigger: footWin });

    /* KLIPP — rubrikerna radas upp rad för rad under en mask: delningen
       sker EFTER typsnittens laddning (annars mäts fel radbrott), och
       spannen finns bara i no-preference-läget — utan JS och vid reduce
       står rubrikerna i normalt textflöde, synliga från start. Hero-h1:en
       är undantagen: den är synlig redan vid laddning (entrén svarar för
       den) och får inte stå under mask vid ankomsten. */
    function afterFonts(cb) {
      if (document.fonts && document.fonts.ready) { document.fonts.ready.then(cb); }
      else { cb(); }
    }
    afterFonts(function () {
      ctx.add(function () {
        ["#om-rubrik", "#tjanster-rubrik", "#galleri-rubrik",
         "#boka-rubrik", "#kontakt-rubrik"].forEach(function (sel) {          var h = document.querySelector(sel);
          if (!h) { return; }
          var words = (h.textContent || "").trim().split(/\s+/).filter(Boolean);
          if (!words.length) { return; }
          h.textContent = "";
          var spans = words.map(function (w, i) {
            var s = document.createElement("span");
            s.className = "word";
            s.textContent = w;
            h.appendChild(s);
            if (i < words.length - 1) { h.appendChild(document.createTextNode(" ")); }
            return s;
          });
          var lines = [];
          var lastTop = -99;
          spans.forEach(function (s) {
            var top = Math.round(s.offsetTop);
            if (top - lastTop > 6) { lines.push([]); lastTop = top; }
            lines[lines.length - 1].push(s);
          });
          h.textContent = "";
          lines.forEach(function (line) {
            var clip = document.createElement("span");
            clip.className = "line-clip";
            var rise = document.createElement("span");
            rise.className = "line-rise";
            line.forEach(function (s, wi) {
              rise.appendChild(s);
              if (wi < line.length - 1) { rise.appendChild(document.createTextNode(" ")); }
            });
            clip.appendChild(rise);
            h.appendChild(clip);
            var w = { trigger: h, start: "top 94%", end: "top 46%", scrub: 0.6 };
            gsap.fromTo(rise, { yPercent: 108 }, { yPercent: 0, ease: "none", scrollTrigger: w });
            line.forEach(function (s, wi) {
              gsap.fromTo(s, { y: 7 + wi * 2 }, { y: 0, ease: "none", scrollTrigger: w });
            });
          });
        });
        ST.refresh();                      /* måttet på windows kan ha flyttat på sig efter raddelningen */
      });
    });

    });                                    /* gsap.context slut */
    return function () {
      ctx.revert();
      if (paper && paper.parentNode) { paper.parentNode.removeChild(paper); }
    };
  });
})();
