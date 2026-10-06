/* cursor.js — blandningsmarkör: en cirkel med mix-blend-mode: difference som
   inverterar bilden under. Endast pekare:fina + icke-reducerad rörelse; annars
   noll åtgärd (OS-markören består). cursor:none sätts bara på filmramarna via
   js-klassen, aldrig globalt. One concern: the pointer effect only. */
(function () {
  'use strict';

  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!finePointer || reduced) return;

  document.documentElement.classList.add('js-fine-pointer');

  var dot = document.createElement('div');
  dot.className = 'blend-cursor';
  dot.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dot);

  var visible = false;
  var pending = null;

  function place(ev) {
    if (pending) return;
    pending = window.requestAnimationFrame(function () {
      pending = null;
      dot.style.transform =
        'translate3d(' + ev.clientX + 'px,' + ev.clientY + 'px,0)';
    });
  }

  function show() {
    if (visible) return;
    visible = true;
    dot.classList.add('is-on');
  }

  function hide() {
    if (!visible) return;
    visible = false;
    dot.classList.remove('is-on');
  }

  // Cirkeln gäller bara foto- och ledarytor (.film-frame__media, .hero-leader).
  document.addEventListener('pointermove', function (ev) {
    var t = ev.target;
    if (!(t instanceof Element)) return;
    var zone = t.closest('.film-frame__media, .hero-leader');
    if (zone) {
      place(ev);
      show();
    } else {
      hide();
    }
  });

  document.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);
})();
