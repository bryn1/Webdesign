/* contact-form.js — kontaktformulärets demoväg (MC 10088). IIFE, defer,
   inga globals. Ingen backend finns: formuläret validerar client-side och
   svarar ärligt att inget skickas — hänvisar till telefon/Instagram. */
(() => {
  "use strict";

  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-contact-status]");
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    status.textContent = "Tack! Det här är en demo — ingen backend är kopplad, så meddelandet "
      + "skickades inte. Ring +46 70 123 45 67 eller skriv till @jane.cooper på Instagram.";
    form.reset();
  });
})();
