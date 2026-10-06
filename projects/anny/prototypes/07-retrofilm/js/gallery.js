/* gallery.js — prev/nästa-knappar för den horisontella filmrullen (rullaren själv
   finns utan JS; knapparna är blot en genväg). One concern: scroller buttons. */
(function () {
  'use strict';

  var scroller = document.querySelector('[data-gallery-scroller]');
  var prev = document.querySelector('[data-gallery-prev]');
  var next = document.querySelector('[data-gallery-next]');
  if (!scroller || !prev || !next) return;

  function stepSize() {
    var first = scroller.querySelector('figure');
    if (!first) return scroller.clientWidth * 0.9;
    var style = window.getComputedStyle(scroller);
    var gap = parseFloat(style.columnGap || style.gap || '0') || 0;
    return first.getBoundingClientRect().width + gap;
  }

  function scrollByStep(dir) {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scroller.scrollBy({ left: dir * stepSize(), behavior: reduced ? 'auto' : 'smooth' });
    scroller.focus({ preventScroll: true }); // tangentbordsanvändaren följer med
  }

  prev.addEventListener('click', function () { scrollByStep(-1); });
  next.addEventListener('click', function () { scrollByStep(1); });
})();
