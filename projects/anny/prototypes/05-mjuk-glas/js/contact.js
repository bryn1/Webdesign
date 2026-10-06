/* Kontaktformulär: klientvalidering + ärligt svarte — ingen backend finns,
   meddelandet skickas aldrig. Utan JS syns ärlighetsnotisen och formuläret
   gör inget löfte om leverans. */
(function () {
  "use strict";

  var form = document.querySelector("[data-contact-form]");
  var status = document.getElementById("form-status");
  if (!form || !status) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var name = form.elements.namn.value.trim();
    var email = form.elements.epost.value.trim();
    var message = form.elements.meddelande.value.trim();

    if (!name || !email || !message) {
      status.textContent = "Fyll i namn, e-post och meddelande.";
      return;
    }

    if (email.indexOf("@") < 1) {
      status.textContent = "E-postadressen ser inte komplett ut.";
      return;
    }

    status.textContent =
      "Tack, " + name + "! Det här är en demo — ingen backend är kopplad, " +
      "så meddelandet skickades inte. Ring +46 70 123 45 67 eller skriv till " +
      "@jane.cooper på Instagram.";
    form.reset();
  });
})();
