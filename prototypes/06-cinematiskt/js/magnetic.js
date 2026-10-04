/* magnetic.js — one concern: the 9-lite magnetic nudge (research §2 item 9).
 * Desktop pointer only (pointer:fine, no hover-capable touch), nudges the CTA
 * a few px toward the cursor. Skipped entirely under reduced motion. */
(function () {
  'use strict';
  try {
    if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    var MAX_PX = 9;
    var RADIUS_PX = 110; // aktiveringsradie runt knappens mitt

    document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
      var raf = null;
      var tx = 0;
      var ty = 0;

      function apply() {
        raf = null;
        btn.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
      }
      function move(ev) {
        var r = btn.getBoundingClientRect();
        var dx = ev.clientX - (r.left + r.width / 2);
        var dy = ev.clientY - (r.top + r.height / 2);
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > RADIUS_PX + Math.max(r.width, r.height) / 2) {
          reset();
          return;
        }
        tx = (dx / (dist || 1)) * Math.min(MAX_PX, dist / 6);
        ty = (dy / (dist || 1)) * Math.min(MAX_PX, dist / 6);
        if (raf === null) raf = window.requestAnimationFrame(apply);
      }
      function reset() {
        tx = 0;
        ty = 0;
        if (raf === null) raf = window.requestAnimationFrame(apply);
      }

      btn.addEventListener('pointermove', move);
      btn.addEventListener('pointerleave', reset);
      btn.addEventListener('blur', reset);
    });
  } catch (e) { /* knappen fungerar utan effekten */ }
}());
