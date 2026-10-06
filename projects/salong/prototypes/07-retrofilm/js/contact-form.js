/* contact-form.js — DEMO-kontaktformulär: validerar lokalt och skickar ALDRIG
   något (ingen backend). Statusraden säger uttryckligen att inget skickas;
   verklig kontakt är alltid tel/Instagram. One concern: the demo form only. */
(function () {
  'use strict';

  var form = document.querySelector('[data-contact-form]');
  if (!form) return;

  var status = document.getElementById('cf-status');

  function setFieldError(input, message) {
    var err = document.getElementById(input.getAttribute('aria-describedby'));
    if (!err) return;
    if (message) {
      err.textContent = message;
      err.hidden = false;
      input.setAttribute('aria-invalid', 'true');
    } else {
      err.textContent = '';
      err.hidden = true;
      input.removeAttribute('aria-invalid');
    }
  }

  function validate(input) {
    if (!input.value.trim()) {
      setFieldError(input, 'Fyll i ' + input.previousElementSibling.textContent.toLowerCase() + '.');
      return false;
    }
    if (input.type === 'email' && !input.checkValidity()) {
      setFieldError(input, 'Ser inte ut som en e-postadress.');
      return false;
    }
    setFieldError(input, '');
    return true;
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault(); // ingen backend — skicka aldrig, alltid
    var fields = Array.prototype.slice.call(form.querySelectorAll('input, textarea'));
    var ok = fields.map(validate).every(Boolean);
    if (status) {
      status.hidden = false;
      status.textContent = ok
        ? 'Demo — inget meddelande skickades: ingen backend är kopplad. ' +
          'Ring +46 70 123 45 67 eller skriv till @jane.cooper på Instagram.'
        : 'Demo — fyll i fälten ovan. Skicka inte formuläret på riktigt: ' +
          'ingen backend är kopplad. Ring +46 70 123 45 67 eller DM:a @jane.cooper.';
    }
  });

  form.querySelectorAll('input, textarea').forEach(function (input) {
    input.addEventListener('blur', function () {
      if (input.value.trim()) validate(input);
    });
  });
})();
