/* Contact form DEMO — client-side validation only; the form is visibly marked
   as having no backend. Submit never leaves the page (PoC honesty rule). */
(function () {
  'use strict';
  var form = document.querySelector('[data-contact-form]');
  if (!form) { return; }
  var status = document.getElementById('cf-status');

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var ok = true;
    [['cf-namn', 'Fyll i ditt namn.'],
     ['cf-epost', 'Fyll i en giltig e-postadress.'],
     ['cf-meddelande', 'Skriv ett meddelande.']].forEach(function (pair) {
      var input = document.getElementById(pair[0]);
      var err = document.getElementById(pair[0] + '-fel');
      var value = input.value.trim();
      var valid = value.length > 0 &&
        (input.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
      if (err) {
        err.textContent = valid ? '' : pair[1];
        err.hidden = valid;
      }
      input.setAttribute('aria-invalid', valid ? 'false' : 'true');
      if (!valid) { ok = false; }
    });
    if (status) {
      status.hidden = false;
      status.textContent = ok
        ? 'Tack! Men detta är en demo — ingen backend är kopplad, så meddelandet skickades inte. Ring 07X-XXX XX XX eller skriv på Instagram @dinsalong.'
        : 'Något saknas i formuläret — se markeringarna ovan.';
    }
  });
}());
