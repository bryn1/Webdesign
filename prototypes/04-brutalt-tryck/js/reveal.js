/* reveal.js — scroll-reveal via IntersectionObserver. Progressive enhancement:
   content is visible utan JS; döljs först nu attributet sätts. Respekterar
   prefers-reduced-motion (hoppa över entirely). Inga globals. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) { return; }

  var items = document.querySelectorAll("[data-reveal]");
  if (!items.length) { return; }
  document.documentElement.setAttribute("data-reveal-ready", "");

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  items.forEach(function (el) { io.observe(el); });
})();
