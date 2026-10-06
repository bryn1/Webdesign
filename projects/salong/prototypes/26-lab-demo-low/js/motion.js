/* Jane Cooper — rörelse: farleden ritas, hamnar öppnas sig längs kortet.
   Signature: farledens röda strecklinje ritas från bojen när sidan ankommer;
   sektionerna svepas fram som lodlinjer. Allt tystnar vid prefers-reduced-motion
   (då är sidan statisk, fullt synlig — ingen rörelse, ingen dold content). */
(function () {
  "use strict";
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  var mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", function () {
    var ctx = gsap.context(function () {

      /* 1. Farleden: den röda rutten ritas fram från startbojen (900 ms, en gång). */
      gsap.fromTo(".route", {
        clipPath: "inset(0 100% 0 0)"
      }, {
        clipPath: "inset(0 0% 0 0)",
        duration: 0.9,
        ease: "power1.inOut",
        delay: 0.15
      });

      /* 2. Hero-texterna ankommer som uppmätta kolon — korta, lugna svep. */
      gsap.from([".eyebrow", ".name", ".subline", ".ring-jane"], {
        y: 14,
        opacity: 0,
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.08,
        clearProps: "all"
      });

      /* 3. Sektionsrubriker: lodlinjen ritas från waypointen. */
      gsap.utils.toArray(".sec-h").forEach(function (h) {
        gsap.from(h, {
          clipPath: "inset(0 100% 0 0)",
          duration: 0.7,
          ease: "power1.inOut",
          scrollTrigger: { trigger: h, start: "top 86%" }
        });
      });

      /* 4. Innehåll öppnas sig i stagger — tjänster, galleri, kalender, kontakt. */
      gsap.from(".svc li", {
        y: 18, opacity: 0, duration: 0.5, stagger: 0.06, ease: "power2.out",
        scrollTrigger: { trigger: ".svc", start: "top 82%" }
      });
      gsap.from(".gal figure", {
        clipPath: "inset(100% 0 0 0)", duration: 0.7, stagger: 0.09, ease: "power1.inOut",
        scrollTrigger: { trigger: ".gal", start: "top 82%" }
      });
      gsap.from(".cal-col", {
        y: 16, opacity: 0, duration: 0.45, stagger: 0.05, ease: "power2.out",
        scrollTrigger: { trigger: ".cal", start: "top 84%" }
      });
      gsap.from(".om-photo, .om-copy p", {
        y: 16, opacity: 0, duration: 0.55, stagger: 0.08, ease: "power2.out",
        scrollTrigger: { trigger: ".om-grid", start: "top 82%" }
      });
      gsap.from(".ko-card, .ko-form", {
        y: 16, opacity: 0, duration: 0.55, stagger: 0.1, ease: "power2.out",
        scrollTrigger: { trigger: ".ko-grid", start: "top 84%" }
      });

      /* 5. Farleden driver mjukt med bläddringen — ett andetag, inte en show. */
      gsap.to(".route", {
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: ".stage", start: "top top", end: "bottom top", scrub: true }
      });
    });
    return function () { ctx.revert(); };
  });
})();
