/* reveal.js — one concern: mark the html element for motion/reveal state.
 * .js-motion enables the CSS hidden→is-in reveal (base.css); Intersection-
 * Observer flips .is-in once per element. Reduced motion: only .js is set,
 * so everything stays visible. Header border also handled here (cheap). */
(function () {
  'use strict';
  try {
    var root = document.documentElement;
    root.classList.add('js');
    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      return;
    }
    root.classList.add('js-motion');

    var targets = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      // Ingen IO (t.ex. mycket gammal webbläsare): visa allt direkt.
      root.classList.remove('js-motion');
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    targets.forEach(function (el) { io.observe(el); });

    // Header-kant när sidan scrollats (billig, körs i alla rörelselägen).
    var header = document.querySelector('.site-header');
    if (header) {
      var tick = false;
      window.addEventListener('scroll', function () {
        if (tick) return;
        tick = true;
        window.requestAnimationFrame(function () {
          tick = false;
          header.classList.toggle('is-scrolled', (window.scrollY || 0) > 24);
        });
      }, { passive: true });
    }
  } catch (e) {
    var r = document.documentElement;
    r.classList.remove('js-motion'); // hellre allt synligt än gömt
  }
}());
