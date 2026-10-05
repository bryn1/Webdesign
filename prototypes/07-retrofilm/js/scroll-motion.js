/* scroll-motion.js — 07 Silverkorn: ALL scroll-rörelse i ETT enda GSAP/
   ScrollTrigger-lager (lokalt vendor i head, defer). Ersätter reveal.js
   (IO-inkorgling) — en mekanik per bekymmer. Allt innanför IIFE:n: inga egna
   globaler. Triggers byggs ENDAST i gsap.matchMedias no-preference-gren: vid
   prefers-reduced-motion byggs noll triggers och sidan står i CSS-utgångsläget
   (allt synligt); utan JS händer ingenting — default-visible. Förhandlaren
   (preloader.js), blandningsmarkören (cursor.js), rull-knapparna (gallery.js),
   kalendern (booking.js) och formuläret (contact-form.js) är ej-scroll och
   bor kvar där de är. Ken-Burns-hovern på filmramarna är pekare, ej scroll.
   Rörelseklasser (Silverkorn): LINE = filmremsans perforering ritas framåt
   medan den korsar skärmen; COLOR = papperstonen åldras krem → gammal film
   över galleriet (ink-par behålls, AA); ZOOM = porträttbilden faller till
   ro inuti sin ram (kant + beskärning orörda); DRIFT = Scen 01-driften:
   text och bild haltar åt varsitt håll, filmrutar gungar mot varandra,
   asset-numren glider, ledarringen roterar; PIN = Scen 01-rubriken hålls
   (fryst bildruta) medan texten under passerar — blott desktop. */
(function () {
  "use strict";
  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  if (!gsap || !ST) { return; }            /* vendor ej laddad — vila-läge */
  gsap.registerPlugin(ST);

  var mm = gsap.matchMedia();

  /* ================= Grundrörelser — alla skärmbredder (ej reduce) ======== */
  mm.add("(prefers-reduced-motion: no-preference)", function () {

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

    /* DRIFT — filmledarens räknerring roterar medan heroavsnittet rullar förbi
       (scrub = rullningen följer scrollbarnden; ren dekor, orörd utan JS). */
    gsap.fromTo(".hero-leader svg", { rotate: 0 }, {
      rotate: 90, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 }
    });

    /* LINE — filmremsorna (sprocket-bandens perforering) ritas framåt från
       vänster kant medan bandet korsar skärmen. */
    gsap.utils.toArray(".sprocket").forEach(function (band) {
      gsap.fromTo(band, { scaleX: 0, transformOrigin: "left center" }, {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: band, start: "top 95%", end: "top 55%", scrub: 0.6 }
      });
    });

    /* COLOR — papperstonen åldras: gallerifältet krem → gammal film
       under inrullningen. Båda ändarna bär koltexten överlägset AA. */
    gsap.fromTo("#galleri", { backgroundColor: "#f3ecdc" }, {
      backgroundColor: "#eae1cc", ease: "none",
      scrollTrigger: { trigger: "#galleri", start: "top bottom", end: "top top", scrub: 1 }
    });

    /* ZOOM — porträttbilden faller till ro: 1.1 → 1 medan ramen kliver in.
       Skalaten sitter på bilden INUTI .portrait-slot — kant, beskärning och
       bildbehandlingen vid röret rör aldrig vid. */
    gsap.fromTo("#om .portrait-slot img", { scale: 1.1 }, {
      scale: 1, ease: "none",
      scrollTrigger: { trigger: "#om .portrait-slot", start: "top bottom", end: "top 40%", scrub: 1 }
    });

    /* DRIFT — Scen 01 haltar isär: textkolumnen sjunker, filmbilden stiger
       (scrub: de följer scrollbarnden hela vägen genom fältet). Drift sitter
       på själva kolumnbehållaren — paragrafernas reveal (opacity/y) är egna
       element och två skrivarur på samma egenskap undviks, som i tema 04. */
    var omDrift = gsap.timeline({
      scrollTrigger: { trigger: "#om .om-grid", start: "top bottom", end: "bottom top", scrub: 1 }
    });
    omDrift.fromTo("#om .om-grid > div:last-child", { y: -24 }, { y: 24, ease: "none" }, 0);
    omDrift.fromTo("#om .portrait-slot", { y: 22 }, { y: -22, ease: "none" }, 0);

    /* DRIFT — filmrutorna i galleriet gungar mot varandra: udda ramar
       sjunker, jämna stiger. Bildens egen Ken-Burns-hover (CSS) är ett
       annat element och rör inte vid. */
    gsap.utils.toArray(".film-frame").forEach(function (frame, i) {
      gsap.fromTo(frame, { y: i % 2 === 0 ? -12 : 12 }, {
        y: i % 2 === 0 ? 12 : -12, ease: "none",
        scrollTrigger: { trigger: "#galleri", start: "top bottom", end: "bottom top", scrub: 1 }
      });
    });

    /* DRIFT — asset-numren på tjänstekorten glider horisontelt vart sitt
       åt håll medan korten passerar (urklippskänsla på rullens etiketter). */
    gsap.utils.toArray(".asset-no").forEach(function (num, i) {
      gsap.fromTo(num, { x: i % 2 === 0 ? -16 : 16 }, {
        x: i % 2 === 0 ? 16 : -16, ease: "none",
        scrollTrigger: { trigger: "#tjanster", start: "top bottom", end: "bottom top", scrub: 1 }
      });
    });
  });

  /* ============ Desktop: PIN — Scen 01-rubriken hålls fryst ============== */
  mm.add("(prefers-reduced-motion: no-preference) and (min-width: 701px)", function () {
    var pinT = ST.create({
      trigger: "#om",
      start: "top 64px",            /* hålls strax under den fasta headern */
      end: "bottom bottom",
      pin: "#om-rubrik"             /* rubriken sitter stilla (fryst bildruta)
                                       medan textkolumnen driver förbi */
    });
    return function () { pinT.kill(); };
  });
})();
