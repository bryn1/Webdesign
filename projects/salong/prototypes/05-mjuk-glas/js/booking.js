/* Bokningsmock: tid väljs (aria-pressed) och bekräftas i en dialog som
   alltid hänvisar till telefon/Instagram — ingen backend finns. */
(function () {
  "use strict";

  var grid = document.querySelector("[data-booking-grid]");
  var dialog = document.getElementById("booking-dialog");
  var summary = document.getElementById("booking-summary");
  if (!grid || !dialog || typeof dialog.showModal !== "function") {
    return;
  }

  var slots = Array.prototype.slice.call(grid.querySelectorAll(".slot"));
  var closeBtn = dialog.querySelector("[data-close-dialog]");

  function clearPressed() {
    slots.forEach(function (slot) {
      slot.setAttribute("aria-pressed", "false");
    });
  }

  function openFor(slot) {
    var day = slot.getAttribute("data-day") || "";
    var time = slot.getAttribute("data-time") || "";
    clearPressed();
    slot.setAttribute("aria-pressed", "true");
    if (summary) {
      summary.textContent = "Du valde " + day + " kl. " + time + ".";
    }
    dialog.showModal();
  }

  slots.forEach(function (slot) {
    slot.setAttribute("aria-pressed", "false");
    slot.addEventListener("click", function () {
      openFor(slot);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      dialog.close();
    });
  }

  dialog.addEventListener("click", function (event) {
    /* klick utanför panelen (på backdrop-området) stänger, som en mjuk overlay */
    if (event.target === dialog) {
      dialog.close();
    }
  });
})();
