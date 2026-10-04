/* Fade-in-on-view, én gång (IntersectionObserver). Lägger klassen
   .reveal-ready på <html> — utan JS sätts den aldrig och allt innehåll
   är synligt direkt. prefers-reduced-motion: hoppar över helt. */
(function () {
  "use strict";

  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) return;

  var items = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (!items.length) return;

  document.documentElement.classList.add("reveal-ready");

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target); /* visa en gång — sedan lugnt */
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  items.forEach(function (el) { io.observe(el); });
}());
