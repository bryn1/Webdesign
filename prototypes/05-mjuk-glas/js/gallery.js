/* Galleri: prev/nästa-knappar + skala vid tillnärmning som fallback när
   CSS animation-timeline: view() saknas. Reduced motion = ingen skala. */
(function () {
  "use strict";

  var scroller = document.querySelector("[data-gallery-scroller]");
  if (!scroller) {
    return;
  }

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var cards = Array.prototype.slice.call(scroller.querySelectorAll(".gallery-card"));

  /* --- knappar: bläddra ett kort åt gången --- */
  var prev = document.querySelector("[data-gallery-prev]");
  var next = document.querySelector("[data-gallery-next]");

  function step() {
    var first = cards[0];
    return first ? first.getBoundingClientRect().width + 24 : scroller.clientWidth * 0.8;
  }

  function scrollByCards(dir) {
    var behavior = reduced.matches ? "auto" : "smooth";
    scroller.scrollBy({ left: dir * step(), behavior: behavior });
  }

  if (prev) {
    prev.addEventListener("click", function () {
      scrollByCards(-1);
    });
  }

  if (next) {
    next.addEventListener("click", function () {
      scrollByCards(1);
    });
  }

  /* --- skala: bara där CSS-view-timeline saknas och rörelse är tillåten --- */
  var hasViewTimeline =
    typeof CSS !== "undefined" &&
    typeof CSS.supports === "function" &&
    CSS.supports("animation-timeline", "view()");

  if (hasViewTimeline || reduced.matches || typeof window.IntersectionObserver !== "function") {
    return;
  }

  scroller.setAttribute("data-js-scale", "");

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle("is-near", entry.isIntersecting);
      });
    },
    { root: scroller, rootMargin: "0px -22% 0px", threshold: 0.85 }
  );

  cards.forEach(function (card) {
    io.observe(card);
  });

  reduced.addEventListener("change", function (e) {
    if (e.matches) {
      scroller.removeAttribute("data-js-scale");
      cards.forEach(function (card) {
        card.classList.remove("is-near");
      });
      io.disconnect();
    }
  });
})();
