/* N9 · 3D-lutning på galeriramar — REIN förbättring.
   Bindgs endast vid fin pekare och tillåten rörelse; annars (mobil,
   tangentbord, prefers-reduced-motion, frånvarande JS) står ramarna
   orörda i vila. Ingen global: allt innanför IIFE:n. */
(function () {
  'use strict';

  var finePointer = window.matchMedia('(pointer: fine)');
  var calmMotion = window.matchMedia('(prefers-reduced-motion: no-preference)');
  if (!finePointer.matches || !calmMotion.matches) return;

  var MAX_DEG = 6;

  function bind(frame) {
    frame.addEventListener('pointerenter', function () {
      if (finePointer.matches && calmMotion.matches) {
        frame.classList.add('is-tilting');
      }
    });

    frame.addEventListener('pointermove', function (event) {
      if (!finePointer.matches || !calmMotion.matches) return;
      var box = frame.getBoundingClientRect();
      var x = (event.clientX - box.left) / box.width;   // 0..1
      var y = (event.clientY - box.top) / box.height;   // 0..1
      var rotY = (x - 0.5) * 2 * MAX_DEG;               // högerkant -> +Y
      var rotX = (0.5 - y) * 2 * MAX_DEG;               // överkant   -> +X
      frame.style.transform =
        'perspective(750px) rotateX(' + rotX.toFixed(2) + 'deg)' +
        ' rotateY(' + rotY.toFixed(2) + 'deg)';
    });

    frame.addEventListener('pointerleave', function () {
      frame.classList.remove('is-tilting');
      frame.style.transform = '';                        // tillbaka till vila
    });
  }

  document.querySelectorAll('[data-tilt]').forEach(bind);
})();
