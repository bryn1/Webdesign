/* contact-form.js — kontaktformuläret är demo utan backend. Vid inskick
   stoppas postandet och ett ärligt kvitto visas; inget påstår att något
   skickats. Utan JS gör formens action="#kontakt" att sidan bara laddas om
   ofarligt — att inget skickas framgår ändå av demo-badge och form-hint. */
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
      + "backend är kopplad. Ring +46 70 123 45 67 eller mejla "
      + "jane.cooper@example.com.";
    form.reset();
  });
})();
