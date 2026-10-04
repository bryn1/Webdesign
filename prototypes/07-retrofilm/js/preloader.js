/* preloader.js — filmledare: räknar 0→100 på ≤1.2 s, skippbar (klick/Esc).
   Helt skippat under prefers-reduced-motion. Skapas av JS => utan JS finns aldrig
   någon blockerande overlay. One concern: the entry moment only. */
(function () {
  'use strict';

  var DURATION_MS = 950;   // väl under 1.2 s-taket
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;
  if (document.querySelector('.preloader')) return;

  var layer = document.createElement('div');
  layer.className = 'preloader';
  layer.setAttribute('aria-hidden', 'true'); // sidan bakom är fullt läsbar; ingen SR-brus
  layer.innerHTML =
    '<svg class="preleader" viewBox="0 0 100 100" aria-hidden="true">' +
    '<circle cx="50" cy="50" r="46" fill="none" stroke="#f3ecdc" stroke-width="2"/>' +
    '<circle cx="50" cy="50" r="30" fill="none" stroke="#f3ecdc" stroke-width="1"/>' +
    '<circle cx="50" cy="50" r="3" fill="#8f2d24"/>' +
    '<line x1="50" y1="4" x2="50" y2="14" stroke="#f3ecdc" stroke-width="2"/>' +
    '<line id="sk-sweep" x1="50" y1="50" x2="50" y2="8" stroke="#8f2d24" stroke-width="2"/>' +
    '</svg>' +
    '<p class="preloader-count"><span data-count>0</span>%</p>' +
    '<p class="mono">Silverkorn · 16 mm</p>' +
    '<button type="button" class="preloader-skip">Hoppa över (Esc)</button>';
  document.body.appendChild(layer);

  var countEl = layer.querySelector('[data-count]');
  var sweep = layer.querySelector('#sk-sweep');
  var finished = false;
  var start = null;

  function finish() {
    if (finished) return;
    finished = true;
    countEl.textContent = '100';
    layer.classList.add('is-done');
    window.setTimeout(function () { layer.remove(); }, 200);
  }

  function frame(ts) {
    if (finished) return;
    if (start === null) start = ts;
    var t = Math.min((ts - start) / DURATION_MS, 1);
    countEl.textContent = String(Math.round(t * 100));
    if (sweep) sweep.setAttribute('transform', 'rotate(' + Math.round(t * 720) + ' 50 50)');
    if (t < 1) {
      window.requestAnimationFrame(frame);
    } else {
      finish();
    }
  }
  window.requestAnimationFrame(frame);

  layer.addEventListener('click', finish);
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && !finished) finish();
  });
  // Säkerhetsstopp: lagret stannar aldrig kvar, ens om rAF strular.
  window.setTimeout(finish, 1300);
})();
