/* reveal + grund-förbättring: markerar [data-reveal] när de kommit i view.
   Utan detta skript syns allt innehåll (CSS styrs av html.js-reveal). */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var items = Array.prototype.slice.call(doc.querySelectorAll("[data-reveal]"));

  function showAll() {
    items.forEach(function (el) {
      el.classList.add("revealed");
    });
  }

  if (!items.length || reduced.matches || typeof window.IntersectionObserver !== "function") {
    showAll();
    return;
  }

  root.classList.add("js-reveal");

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );

  items.forEach(function (el) {
    io.observe(el);
  });

  reduced.addEventListener("change", function (e) {
    if (e.matches) {
      showAll();
      io.disconnect();
    }
  });
})();
