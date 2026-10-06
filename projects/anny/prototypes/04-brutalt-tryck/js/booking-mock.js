/* booking-mock.js — DEMO-bokning: vald tidsknapp -> native <dialog> med
   telefon/IG-väg, exakt som PoC:ns booking-mock. Ingen backend, ingen fetch.
   Utan JS syns allt viktigaste ändå i sektionstexten ("Så bokar du på riktigt").
   Inga globals. */
(function () {
  "use strict";
  var dialog = document.getElementById("boka-dialog");
  var slots = document.querySelectorAll("[data-slot]");
  if (!dialog || !slots.length) { return; }
  if (typeof dialog.showModal !== "function") { return; } /* gammal webbläsare: länktext finns kvar */

  var timeOut = dialog.querySelector("[data-dialog-time]");
  var closer = dialog.querySelector("[data-dialog-close]");
  var lastSlot = null;

  slots.forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (lastSlot) { lastSlot.setAttribute("aria-pressed", "false"); }
      lastSlot = btn;
      btn.setAttribute("aria-pressed", "true");
      if (timeOut) { timeOut.textContent = btn.textContent.trim() + " (demo)"; }
      dialog.showModal();
    });
  });

  if (closer) {
    closer.addEventListener("click", function () { dialog.close(); });
  }
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) { dialog.close(); } /* klick utanför = stäng */
  });
  dialog.addEventListener("close", function () {
    if (lastSlot) { lastSlot.focus(); }
  });
})();
