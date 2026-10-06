/* main.js — TEMA 09 "Rutinerat" (Schweizertåg). Minimal, guarded, no globals.
   All scroll animation is pure CSS; JS here only wires the booking MOCK dialog
   and the demo contact-form notice. Page is fully readable without this file. */
(function () {
  "use strict";

  /* 1. Footer year — honest stamp, no hardcoded date. */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* 2. Booking mock: choose a demo slot -> dialog with phone/Instagram path.
        The dialog is a real <dialog>; without JS the slots never open, so the
        noscript note in the markup carries the booking path. */
  var dialog = document.getElementById("book-dialog");
  var slotOut = document.getElementById("bd-slot");
  var slots = document.querySelectorAll(".slot");

  function closeDialog() {
    if (dialog && typeof dialog.close === "function" && dialog.open) {
      dialog.close();
    }
  }

  function openDialog(day, time) {
    if (!dialog || !slotOut) return;
    slotOut.textContent = day + " " + time + " (demo)";
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  Array.prototype.forEach.call(slots, function (btn) {
    btn.addEventListener("click", function () {
      if (btn.getAttribute("aria-disabled") === "true") return;
      var day = btn.getAttribute("data-day") || "";
      var time = btn.getAttribute("data-time") || "";
      openDialog(day, time);
    });
  });

  /* Clicking the backdrop (outside the form) closes the mock dialog. */
  if (dialog) {
    dialog.addEventListener("click", function (evt) {
      if (evt.target === dialog) closeDialog();
    });
  }

  /* 3. Demo contact form: no backend is connected, so submitting must say so
        plainly instead of pretending. Prevents navigation; shows honest status. */
  var form = document.getElementById("cform");
  var status = document.getElementById("cform-status");
  if (form && status) {
    form.addEventListener("submit", function (evt) {
      evt.preventDefault();
      var name = form.elements["name"];
      var mail = form.elements["email"];
      var msg = form.elements["message"];
      if (!name.value.trim() || !mail.value.trim() || !msg.value.trim()) {
        status.textContent = "Fyll i alla fält, tack.";
        return;
      }
      status.textContent =
        "Tack! Men detta är en demo — ingen backend är kopplad, meddelandet skickades inte. " +
        "Ring +46 70 123 45 67 eller skriv på Instagram @jane.cooper.";
      form.reset();
    });
  }
})();
