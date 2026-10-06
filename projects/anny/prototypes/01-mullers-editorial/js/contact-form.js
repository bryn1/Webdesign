/* contact-form.js — en sak: kontaktformulärets DEMO-flöde. Ingen backend finns
   (synligt markerat i formuläret), så skicket stoppas alltid och användaren
   visas sanningen vart man verkligen når Jane Cooper. Inga globals. */
(function () {
  'use strict';

  var form = document.querySelector('[data-contact-form]');
  if (!form) return;

  var status = document.getElementById('cf-status');

  var fields = [
    {
      input: document.getElementById('cf-namn'),
      error: document.getElementById('cf-namn-fel'),
      test: function (v) { return v.trim().length > 0; },
      message: 'Skriv ditt namn.'
    },
    {
      input: document.getElementById('cf-epost'),
      error: document.getElementById('cf-epost-fel'),
      test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
      message: 'Skriv en giltig e-postadress.'
    },
    {
      input: document.getElementById('cf-msg'),
      error: document.getElementById('cf-msg-fel'),
      test: function (v) { return v.trim().length > 0; },
      message: 'Skriv ett meddelande.'
    }
  ];

  function validateField(f) {
    var ok = f.input && f.test(f.input.value);
    if (f.input) f.input.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (f.error) {
      f.error.textContent = ok ? '' : f.message;
      f.error.hidden = ok;
    }
    return ok;
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault(); /* ingen backend — skicka aldrig */
    var allOk = true;
    var first = null;
    fields.forEach(function (f) {
      if (!validateField(f) && allOk) { allOk = false; first = f.input; }
    });
    if (!allOk) {
      if (status) status.hidden = true;
      if (first) first.focus();
      return;
    }
    if (status) {
      status.hidden = false;
      status.textContent = 'Tack! Men detta är en demo — inget meddelande skickades. ' +
        'Ingen backend är kopplad. Ring +46 70 123 45 67 eller mejla ' +
        'jane.cooper@example.com för att nå Jane Cooper på riktigt.';
    }
    form.reset();
    fields.forEach(function (f) {
      if (f.input) f.input.removeAttribute('aria-invalid');
    });
  });

  fields.forEach(function (f) {
    if (f.input) {
      f.input.addEventListener('input', function () {
        if (f.error && !f.error.hidden) validateField(f);
      });
    }
  });
})();
