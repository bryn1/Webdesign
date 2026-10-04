/* Hand-drawn underlines that stroke-draw into view + gentle reveals.
   No-JS and prefers-reduced-motion keep every stroke and element visible. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');

  var reduced = window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  function revealAll(list) {
    Array.prototype.forEach.call(list, function (el) { el.classList.add('is-revealed'); });
  }

  /* ---- soft reveal-on-view (once) ---- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (reduced || !hasIO) {
    revealAll(revealEls);
  } else {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(revealEls, function (el) { revealIO.observe(el); });
  }

  /* ---- SVG stroke-draw underlines ---- */
  var paths = document.querySelectorAll('.underline path');
  if (!paths.length) { return; }

  Array.prototype.forEach.call(paths, function (path) {
    var len = path.getTotalLength();
    path.style.setProperty('--dash', String(len));
    if (reduced || !hasIO) { return; } /* static stroke stays shown */
    path.classList.add('is-drawable');
  });

  if (reduced || !hasIO) { return; }

  var drawIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) { return; }
      var svg = entry.target;
      Array.prototype.forEach.call(svg.querySelectorAll('path.is-drawable'), function (path) {
        path.classList.add('is-drawn');
      });
      drawIO.unobserve(svg);
    });
  }, { threshold: 0.4 });

  Array.prototype.forEach.call(document.querySelectorAll('.underline'), function (svg) {
    drawIO.observe(svg);
  });
})();
