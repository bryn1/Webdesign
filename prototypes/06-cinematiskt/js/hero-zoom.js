/* hero-zoom.js — one concern: the rAF scrub of the mirror-window hero, used
 * ONLY where CSS scroll-driven timelines are missing (research §2 item 3).
 * Sets --zoom/--out on <html>; CSS (hero.css) reads them. Reduced-motion →
 * no listeners at all, the static hero stands. No globals, deferred. */
(function () {
  'use strict';
  try {
    if (window.CSS && CSS.supports &&
        CSS.supports('animation-timeline', 'scroll(root)')) {
      return; // CSS-timetimeline sköter zoomen — ingen JS behövs.
    }
    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      return; // reduced motion: statisk hero.
    }

    var root = document.documentElement;
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var pending = false;
    function update() {
      pending = false;
      var range = window.innerHeight || 1; // zoomen sträcker sig över 1 viewport
      var p = Math.min(1, Math.max(0, (window.scrollY || 0) / range));
      root.style.setProperty('--zoom', (1 + 0.9 * p).toFixed(4));
      root.style.setProperty('--out', p.toFixed(4));
    }
    function onScroll() {
      if (!pending) {
        pending = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  } catch (e) { /* sidan fungerar utan zoomen */ }
}());
