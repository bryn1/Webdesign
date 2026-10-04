/* scroll-fx.js — valfri GSAP-lyx ovanpå CSS-läget (stack + marquee klarar
   sig själva). Helt guardat: saknas window.gsap/ScrollTrigger (offline, CDN
   nere, eller JS av) görs ingenting alls — sidan är oförändrad. Inga globals. */
(function () {
  "use strict";
  if (!(window.gsap && window.ScrollTrigger)) { return; }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { return; }
  if (window.matchMedia("(pointer: coarse)").matches) { return; }

  gsap.registerPlugin(ScrollTrigger);

  /* jättesifdrorna driver lite horisontellt medan kortet fastnar — stapel-djup */
  document.querySelectorAll(".svc").forEach(function (card, i) {
    var num = card.querySelector(".svc-num");
    if (!num) { return; }
    gsap.fromTo(num,
      { x: i % 2 === 0 ? -24 : 24 },
      {
        x: i % 2 === 0 ? 24 : -24,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
  });

  /* hero-stickern gungar svagt åt sidan vid scroll — fysiken förblir dragsladden */
  var sticker = document.querySelector("[data-hero-sticker]");
  if (sticker) {
    gsap.to(sticker, {
      x: 30,
      ease: "none",
      scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true }
    });
  }
})();
