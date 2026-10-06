/* contact-form.js — kontaktformuläret är demo utan backend. Vid inskick
   stoppas postandet och ett ärligt kvitto visas; ingen påstår att något
   skickats. Utan JS gör formens action="#kontakt" att sidan bara laddas om
   ofarligt — synlighet på att inget skickas ges av demo-badge + form-hint. */
(function () {
  "use strict";

  var form = document.getElementById("kontakt-form");
  var status = document.getElementById("form-status");
  if (!form || !status) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    status.hidden = false;
    status.textContent =
      "Tack — men det här är en demo: inget meddelande skickades och ingen "
      + "backend är kopplad. Ring 072-155 48 60 eller mejla "
      + "Anny.mullerskarlskrona@gmail.com.";
    form.reset();
  });
})();
