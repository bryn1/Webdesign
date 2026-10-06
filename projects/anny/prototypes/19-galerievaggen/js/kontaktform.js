/* Kontaktformuläret är en DEMO: inget skickas. Bekräftelsen som
   visas säger just det och hänvisar till telefon/e-post. */
(function () {
  'use strict';

  var form = document.getElementById('kontaktformularet');
  var svar = document.getElementById('form-svar');
  if (!form || !svar) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    svar.hidden = false;
    svar.scrollIntoView({ block: 'nearest' });
  });
})();
