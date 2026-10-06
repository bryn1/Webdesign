/* Anny Morin — "epoch descent": nederst stigande djupmarkör, ett skikt leder i taget.
   GSAP + ScrollTrigger lokalt. prefers-reduced-motion: ingen rörelse, allt syns. */
(function () {
  "use strict";
  if (typeof window.gsap === "undefined" || typeof window.ScrollTrigger === "undefined") { return; }
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* still-capture mode: /index.html?still=1 renders the page fully settled
     (every reveal inert, nothing mid-animation) for evidence captures */
  var still = /[?&]still=1/.test(window.location.search);
  if (reduce || still) { return; }
  gsap.registerPlugin(ScrollTrigger);

  /* hjälpare: ett skikt (section) — rubriken leder, innehållet följer efter */
  function lead(sectionId) {
    var section = document.getElementById(sectionId);
    if (!section) { return; }
    var head = section.querySelector(".section-heading, .tjanster-heading");
    var leadEl = section.querySelector(".kicker");
    var body = section.querySelector(".service-list, .gallery-grid, .booking-panel, .kontakt-cols");
    var tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: "top 72%", once: true }
    });
    if (leadEl) { tl.fromTo(leadEl, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }); }
    if (head) { tl.fromTo(head, { y: 26, opacity: 0, clipPath: "inset(0 0 22% 0)" },
      { y: 0, opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "power3.out" }, "-=0.2"); }
    if (body) { tl.fromTo(body, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, "-=0.35"); }
    return tl;
  }
  /* OBS: #om och #tjansters rubriker är spec-regioner i det accepterade första
     vyfönstret — de animeras ALDRIG (deras läge/synlighet är lag). */
  lead("galleri");
  lead("boka");
  lead("kontakt");

  /* tjänsteraden: lätt stigande radfördröjning (servicelisten har redan led-reveal) */
  var services = document.querySelectorAll(".service");
  if (services.length) {
    ScrollTrigger.batch(services, {
      start: "top 88%",
      once: true,
      onEnter: function (batch) {
        gsap.fromTo(batch, { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, ease: "power2.out", stagger: 0.08, overwrite: true });
      }
    });
  }

  /* galleriet: korten lyser fram i par */
  var cards = document.querySelectorAll(".gallery-card");
  if (cards.length) {
    gsap.fromTo(cards, { y: 24, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.7, ease: "power2.out", stagger: 0.12,
      scrollTrigger: { trigger: "#galleri .gallery-grid", start: "top 80%", once: true }
    });
  }

  /* hjälparens pärla: glider längs den högra glaslisten medan hjältet skrollas */
  var heroBead = document.getElementById("depth-bead");
  if (heroBead) {
    gsap.to(heroBead, {
      yPercent: 140, opacity: 0.55, ease: "none",
      scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: 0.6 }
    });
  }

  /* spegelns parallax: djupet under glaset rör sig långsammare än ytan */
  var mirror = document.querySelector(".mirror-reflection");
  if (mirror) {
    gsap.to(mirror, {
      yPercent: 4, ease: "none",
      scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: 0.8 }
    });
  }

  /* djupmarkören: fast mässingstråd till höger, pärlan sjunker genom skikten */
  var rail = document.querySelector(".depth-rail");
  var bead = document.getElementById("depth-rail-bead");
  if (rail && bead) {
    var sections = ["om", "tjanster", "galleri", "boka", "kontakt"];
    gsap.set(rail, { autoAlpha: 0 });
    ScrollTrigger.create({
      trigger: "#om", start: "top bottom", end: "top 60vh",
      onEnter: function () { gsap.to(rail, { autoAlpha: 1, duration: 0.5 }); },
      onLeaveBack: function () { gsap.to(rail, { autoAlpha: 0, duration: 0.3 }); }
    });
    /* pärlan vandrar mellan skiktens höjdpositioner — ett skikt i taget */
    var stops = [];
    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        stops.push(ScrollTrigger.create({
          trigger: el, start: "top 55%", once: true,
          onEnter: function () { positionBead(id); }
        }));
      }
    });
    function positionBead(id) {
      var idx = sections.indexOf(id);
      gsap.to(bead, { top: (idx / (sections.length - 1)) * 100 + "%", duration: 0.9, ease: "power2.inOut" });
      bead.setAttribute("data-at", id);
    }
    /* räkna om lägesmärken när sidan växer (dialog, fönsterstorlek) */
    window.addEventListener("resize", function () { ScrollTrigger.refresh(); });
  }
})();
