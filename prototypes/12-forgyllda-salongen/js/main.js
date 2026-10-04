/* 12 · Den förgyllda salongen — progressiv förbättring (MC 10088)
   Ingen global: allt i IIFE. Utan JS är hela sidan fullt läsbar;IO-klassen sätts
   bara om view()-timeline saknas och IntersectionObserver finns. */
(function () {
  'use strict';

  var doc = document;

  /* ---------- reveal: IO-fallback endast utan view()-stöd ---------- */
  var viewSupported = window.CSS && CSS.supports &&
    CSS.supports('animation-timeline', 'view()');
  if (!viewSupported && 'IntersectionObserver' in window) {
    doc.documentElement.classList.add('js-io');
    var targets = doc.querySelectorAll('.sec-head, .plate');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

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
