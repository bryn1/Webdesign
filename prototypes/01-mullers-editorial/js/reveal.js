/* reveal.js — en sak:IntersectionObserver-baserade avslöjanden (fade-up,
   hero word-build, line-mask). Inget bibliotek, inga globals. Utan IO eller med
   prefers-reduced-motion: allt markeras direkt som synligt (CSS:döljer ändå
   inget i dessa lägen — detta är ett extra försvar). */
(function () {
  'use strict';

  var reduce = typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var supported = typeof window.IntersectionObserver === 'function';

  var targets = document.querySelectorAll('[data-reveal], [data-mask], [data-hero]');

  function showAll() {
    for (var i = 0; i < targets.length; i++) {
      targets[i].classList.add('is-in');
    }
  }

  if (reduce || !supported) {
    showAll();
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

  for (var i = 0; i < targets.length; i++) {
    io.observe(targets[i]);
  }

  /* Säkerhetsnät: element redan utanför scrollbaren (t.ex. dialog) synliga. */
  window.addEventListener('pagehide', showAll, { once: true });
})();
