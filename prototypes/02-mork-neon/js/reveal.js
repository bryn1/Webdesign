/* Scroll reveals + Lando-style bar-sweep, IntersectionObserver, once.
   No JS / no IO / reduced motion => everything stays visible (initial hidden
   states live behind html.js and are neutralised for reduced motion). */
(function () {
  'use strict';
  document.documentElement.classList.add('reveal-live');
  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = Array.prototype.slice.call(
    document.querySelectorAll('[data-reveal], .sweep')
  );

  function show(el) { el.classList.add('is-in'); }

  if (reduced || !('IntersectionObserver' in window)) {
    els.forEach(show);
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        show(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -6% 0px' });
  els.forEach(function (el) { io.observe(el); });
}());
