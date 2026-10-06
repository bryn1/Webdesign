/* preloader.js — one concern: the intro moment (research §2 item 10).
 * Hard rules: never blocks content, hard cap 1.2 s even on errors, skippable
 * (any keypress/tap), auto-skipped under prefers-reduced-motion. The overlay
 * ships hidden in the HTML: without JS it is never shown at all. */
(function () {
  'use strict';
  try {
    var el = document.getElementById('preloader');
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var CAP_MS = 1200;      // never longer than this, whatever happens
    var MIN_MS = 600;       // short enough to feel like a moment, not a wall

    var done = false;
    function finish() {
      if (done) return;
      done = true;
      el.classList.add('is-out');
      window.setTimeout(function () { el.hidden = true; }, 500);
    }

    // Skippbar: tangent eller tryck stänger direkt.
    window.addEventListener('keydown', finish, { once: true, passive: true });
    window.addEventListener('pointerdown', finish, { once: true, passive: true });

    // Hård tidslockar — oavsett load-fel försvinner lagret inom 1,2 s.
    window.setTimeout(finish, CAP_MS);

    el.hidden = false;
    el.style.setProperty('--pre-dur', MIN_MS + 'ms');

    // Städa så fort både min-tid och load är passerade (dock senast vid CAP).
    var minPassed = false;
    window.setTimeout(function () {
      minPassed = true;
      if (document.readyState === 'complete') finish();
    }, MIN_MS);
    window.addEventListener('load', function () {
      if (minPassed) finish();
    }, { once: true });
  } catch (e) {
    /* Felet får aldrig hålla kvar lagret: lockaren ovan är redan satt. */
  }
}());
