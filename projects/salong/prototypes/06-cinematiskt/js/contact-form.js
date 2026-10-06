/* contact-form.js — one concern: client-side validation of the DEMO contact
 * form and the honest status line (PoC honesty: no backend is connected, the
 * form visibly says so). No data is sent anywhere. No globals, deferred. */
(function () {
  'use strict';
  try {
    var form = document.querySelector('[data-contact-form]');
    if (!form) return;
    var status = document.getElementById('cf-status');
    if (!status) return;

    var fields = [
      {
        input: form.querySelector('#cf-namn'),
        error: form.querySelector('#cf-namn-fel'),
        test: function (v) { return v.trim().length > 0; },
        message: 'Fyll i ditt namn.'
      },
      {
        input: form.querySelector('#cf-epost'),
        error: form.querySelector('#cf-epost-fel'),
        test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
        message: 'Fyll i en giltig e-postadress.'
      },
      {
        input: form.querySelector('#cf-meddelande'),
        error: form.querySelector('#cf-meddelande-fel'),
        test: function (v) { return v.trim().length > 0; },
        message: 'Skriv ett meddelande.'
      }
    ];

    function setFieldState(field, ok) {
      field.error.hidden = ok;
      if (!ok) field.error.textContent = field.message;
      field.input.setAttribute('aria-invalid', ok ? 'false' : 'true');
    }

    form.addEventListener('submit', function (ev) {
      ev.preventDefault(); // demo: ingen data skickas, sidan laddas inte om
      var firstBad = null;
      fields.forEach(function (field) {
        var ok = field.input && field.test(field.input.value);
        if (field.input) setFieldState(field, ok);
        if (!ok && !firstBad) firstBad = field.input;
      });
      status.hidden = false;
      if (firstBad) {
        status.textContent = 'Kontrollera de markerade fälten.';
        firstBad.focus();
        return;
      }
      status.textContent = 'Tack — men detta är en demo: inget meddelande skickades. ' +
        'Ring +46 70 123 45 67 eller mejla jane.cooper@example.com.';
      form.reset();
    });

    fields.forEach(function (field) {
      if (field.input) {
        field.input.addEventListener('input', function () {
          if (field.input.getAttribute('aria-invalid') === 'true') {
            setFieldState(field, field.test(field.input.value));
          }
        });
      }
    });
  } catch (e) { /* utan JS syns demo-notisen och sidan laddas om harmlöst */ }
}());
