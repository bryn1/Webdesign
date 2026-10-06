/* booking.js — bokningsdemo: klick på tid öppnar dialog med telefon/IG-väg.
   Ingen backend — ingen tid reserveras. Upptagna demo-tider (aria-disabled)
   är inaktiva. Utan JS syns statisk not + kontakttider i sektionen. */
(function () {
  "use strict";

  var dialog = document.getElementById("booking-dialog");
  if (!dialog || typeof dialog.showModal !== "function") return;

  var slotLine = dialog.querySelector("[data-dialog-slot]");
  var closeBtn = dialog.querySelector("[data-dialog-close]");

  var slots = document.querySelectorAll(".slot");
  for (var i = 0; i < slots.length; i += 1) {
    slots[i].addEventListener("click", onSlotClick);
  }

  function onSlotClick(event) {
    var btn = event.currentTarget;
    if (btn.getAttribute("aria-disabled") === "true") return;
    if (slotLine) {
      slotLine.textContent = btn.dataset.day + " " + btn.dataset.time;
    }
    dialog.showModal();
    if (closeBtn) closeBtn.focus();
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", function () { dialog.close(); });
  }

  /* klick utanför rutan stänger — vanligt tidningsdialog-beteende */
  dialog.addEventListener("click", function (event) {
    var box = dialog.getBoundingClientRect();
    var outside =
      event.clientX < box.left || event.clientX > box.right ||
      event.clientY < box.top || event.clientY > box.bottom;
    if (outside) dialog.close();
  });
})();
