/* 12 · Den förgyllda salongen — funktions-js (MC 10088)
   Ingen global: allt i IIFE. Scroll-koreografin bor i js/scroll.js (GSAP).
   Här: demobokning + demo-kontaktformulär — ingen backend. */
(function () {
  'use strict';

  var doc = document;

  /* ---------- Boka: demomock — ingen bokning genomförs ---------- */
  var dialog = doc.getElementById('book-dialog');
  var picked = doc.getElementById('dlg-vald');
  if (dialog && picked) {
    doc.querySelectorAll('.slot:not(.slot--off)').forEach(function (slot) {
      slot.addEventListener('click', function () {
        picked.textContent = slot.dataset.dag + ' ' + slot.textContent.trim() +
          '  (demo)';
        if (typeof dialog.showModal === 'function') {
          dialog.showModal();
        } else {
          dialog.setAttribute('open', ''); /* HTML-dialog utan showModal */
        }
      });
    });
    dialog.addEventListener('cancel', function () { /* stäng med Esc är OK */ });
  }

  /* ---------- Kontaktformulär: demo, ingen backend ---------- */
  var form = doc.getElementById('cf');
  var msg = doc.getElementById('cf-msg');
  if (form && msg) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      msg.hidden = false;
      form.reset();
    });
  }
}());
