/* Gallery snap-scroller buttons: scroll the strip by roughly one card.
   Without JS the strip still scrolls by touch/keyboard (it is focusable). */
(function () {
  'use strict';
  var strip = document.querySelector('[data-gallery-scroller]');
  if (!strip) { return; }
  var prev = document.querySelector('[data-gallery-prev]');
  var next = document.querySelector('[data-gallery-next]');

  function step() {
    var card = strip.querySelector('.gallery-card');
    return card ? card.getBoundingClientRect().width + 16 : strip.clientWidth * 0.8;
  }
  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function scrollBy(dir) {
    strip.scrollBy({ left: dir * step(), behavior: reduced ? 'auto' : 'smooth' });
  }
  if (prev) { prev.addEventListener('click', function () { scrollBy(-1); }); }
  if (next) { next.addEventListener('click', function () { scrollBy(1); }); }
}());
