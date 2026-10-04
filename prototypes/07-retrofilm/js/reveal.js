/* reveal.js — en- gång-inkorglingsreveal via IntersectionObserver.
   Utan JS: ingen js-reveal-klass => allt innehåll synligt från start.
   Under prefers-reduced-motion: allt synligt direkt, ingen observation.
   One concern: scroll reveal only. */
(function () {
  'use strict';

  var items = Array.prototype.slice.call(
    document.querySelectorAll('[data-reveal]')
  );
  if (!items.length) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  document.documentElement.classList.add('js-reveal');

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target); // blott en gång
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

  items.forEach(function (el) { io.observe(el); });
})();
