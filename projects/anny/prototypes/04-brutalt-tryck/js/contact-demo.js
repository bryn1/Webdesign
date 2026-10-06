/* contact-demo.js — kontaktformuläret är DEMO: ingen backend. preventDefault +
   ärlig status i role="status"-ytan. Utan JS: formuläret står kvar med sin
   synliga demomarkering intill sig. Inga globals. */
(function () {
  "use strict";
  var form = document.querySelector("[data-demo-form]");
  if (!form) { return; }
  var status = form.querySelector("[data-form-status]");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!status) { return; }
    if (!form.checkValidity()) {
      status.textContent = "Fyll i namn, e-post och meddelande innan demo-skickandet.";
      form.reportValidity();
      return;
    }
    status.textContent = "Demo — inget skickades (ingen backend). Ring 07X-XXX XX XX "
      + "eller DM:a @dinsalong så hörs vi på riktigt.";
    form.reset();
  });
})();
