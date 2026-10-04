/* gallery-nav.js — prev/next-pilar för galleriets horisontella snap-scroller.
   Utan JS funkar rullningen ändå (tabindex + overflow). Inga globals. */
(function () {
  "use strict";
  var scroller = document.querySelector("[data-gallery-scroller]");
  if (!scroller) { return; }
  var prev = document.querySelector("[data-gallery-prev]");
  var next = document.querySelector("[data-gallery-next]");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var behavior = reduce ? "auto" : "smooth";

  function step() {
    var card = scroller.querySelector(".gal-card");
    return card ? card.getBoundingClientRect().width + 16 : 280;
  }
  if (prev) { prev.addEventListener("click", function () { scroller.scrollBy({ left: -step(), behavior: behavior }); }); }
  if (next) { next.addEventListener("click", function () { scroller.scrollBy({ left: step(), behavior: behavior }); }); }
})();
