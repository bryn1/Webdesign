/* Boknings-DEMO: klick på en demo-tid öppnar dialogen med telefon-
   och Instagram-vägen. Ingen backend — ingen tid reserveras. */
(function () {
  'use strict';

  var dialog = document.getElementById('tidsval');
  var tidText = document.getElementById('tidsval-tid');
  var rut = document.getElementById('tidsgaller');
  if (!dialog || !tidText || !rut || typeof dialog.showModal !== 'function') return;

  rut.addEventListener('click', function (event) {
    var slot = event.target.closest('button.slot[data-tid]');
    if (!slot || slot.disabled) return;
    tidText.textContent = slot.dataset.tid;
    dialog.showModal();
  });
})();
