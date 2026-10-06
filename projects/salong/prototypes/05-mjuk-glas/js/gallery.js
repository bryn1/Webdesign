/* Galleri: prev/nästa-knappar. Tillnärmningsskalan flyttade till
   js/scroll-motion.js (GSAP, en motor för all scrollrörelse) och
   rörelsekvittering sker där via matchMedia — här återstår bara interaktionen,
   som inte är en scroll-effekt. */
(function () {
  "use strict";

  var scroller = document.querySelector("[data-gallery-scroller]");
  if (!scroller) {
    return;
  }

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var cards = Array.prototype.slice.call(scroller.querySelectorAll(".gallery-card"));

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
}());
