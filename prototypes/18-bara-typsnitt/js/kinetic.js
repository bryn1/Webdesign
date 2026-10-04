/* kinetic.js — IO-fallback för headline-morfen i css/kinetic.css.
   Webbläsare med animation-timeline: view() sköter morfen helt i CSS och
   den här filen gör ingenting. Utan det stödet lägger vi .morph-in vid
   inträde i vyn så transitionen i kinetic.css spelar.
   Under prefers-reduced-motion: gör vi ingenting — morfen är redan
   avstängd i CSS och texten står i läsbar skala. Ingen global: IIFE. */
(function () {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.CSS && CSS.supports && CSS.supports("animation-timeline", "view()")) return;

  var els = document.querySelectorAll(".morph");
  if (!els.length) return;

  function reveal(node) { node.classList.add("morph-in"); }

  if (!("IntersectionObserver" in window)) {
    for (var i = 0; i < els.length; i += 1) reveal(els[i]);
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    for (var j = 0; j < entries.length; j += 1) {
      if (entries[j].isIntersecting) {
        reveal(entries[j].target);
        io.unobserve(entries[j].target);
      }
    }
  }, { threshold: 0.25 });

  for (var k = 0; k < els.length; k += 1) io.observe(els[k]);
})();
