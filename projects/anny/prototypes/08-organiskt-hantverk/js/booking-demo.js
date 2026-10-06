/* Sanningsläget för demot: tidsval + dialog + kontaktformulärs-status.
   Ingen bokning och inget meddelande genomförs — allt är märkt demo. */
(function () {
  'use strict';

  /* ---- bokningsmock: välj tid, se dialogvägen till riktig bokning ---- */
  var dialog = document.getElementById('book-dialog');
  var slots = document.querySelectorAll('.slot');
  var pickedTargets = [
    document.getElementById('dlg-picked'),
    document.getElementById('dlg-picked-2')
  ];
  var viewConfirm = document.getElementById('dlg-confirm');
  var viewDone = document.getElementById('dlg-done');

  function setPicked(text) {
    pickedTargets.forEach(function (el) { if (el) { el.textContent = text; } });
  }

  function openDialog(pickedText) {
    setPicked(pickedText);
    if (viewDone) { viewDone.hidden = true; }
    if (viewConfirm) { viewConfirm.hidden = false; }
    if (dialog) {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
    }
  }

  Array.prototype.forEach.call(slots, function (slot) {
    slot.setAttribute('aria-pressed', 'false');
    slot.addEventListener('click', function () {
      Array.prototype.forEach.call(slots, function (other) {
        other.setAttribute('aria-pressed', other === slot ? 'true' : 'false');
      });
      openDialog(slot.getAttribute('data-day') + ' ' + slot.getAttribute('data-time'));
    });
  });

  var confirmBtn = document.getElementById('dlg-confirm-btn');
  if (confirmBtn && viewConfirm && viewDone) {
    confirmBtn.addEventListener('click', function () {
      viewConfirm.hidden = true;
      viewDone.hidden = false;
      var firstLink = viewDone.querySelector('a');
      if (firstLink) { firstLink.focus(); }
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-dialog-close]'), function (btn) {
    btn.addEventListener('click', function () {
      if (dialog && typeof dialog.close === 'function') { dialog.close(); }
    });
  });

  /* ---- kontaktformulär: demostatus, ingen backend ---- */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  if (form && status) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var nameField = form.querySelector('#field-name');
      var name = nameField && nameField.value.trim() ? nameField.value.trim() : '';
      /* textContent — aldrig HTML-framställning av användarinput */
      status.textContent = 'Tack' + (name ? ' ' + name : '') +
        '! Det här är en demo — inget meddelande skickades. ' +
        'Ring 07X-XXX XX XX eller mejla hej@dinsalong.se.';
      form.reset();
    });
  }
})();
