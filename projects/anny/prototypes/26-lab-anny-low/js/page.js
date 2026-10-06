/* Jane Cooper — demo-kalender + dialog + formulärguard.
   Progressive enhancement: utan JS syns kontaktvägen ändå, kalendern byggs här. */
(function () {
  "use strict";

  var cal = document.getElementById("cal");
  var dialog = document.getElementById("tid-dialog");
  var tidLine = document.getElementById("tid-line");
  var closeBtn = document.getElementById("tid-close");

  var days = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör"];
  var slots = ["10:00", "12:30", "15:00", "17:15"];
  // deterministic demo pattern: each day leaves some slots off (mock, no backend)
  var off = { 1: [1], 2: [0, 3], 3: [], 4: [2], 5: [0], 6: [1, 2] };

  if (cal) {
    var frag = document.createDocumentFragment();
    days.forEach(function (d, di) {
      var col = document.createElement("div");
      col.className = "cal-col";
      var head = document.createElement("div");
      head.className = "cal-day";
      head.textContent = d;
      col.appendChild(head);
      slots.forEach(function (t, ti) {
        var isOff = (off[di] || []).indexOf(ti) !== -1;
        if (isOff) {
          var span = document.createElement("span");
          span.className = "cal-off";
          span.setAttribute("aria-hidden", "true");
          span.textContent = t + " —";
          col.appendChild(span);
        } else {
          var b = document.createElement("button");
          b.type = "button";
          b.textContent = t;
          b.setAttribute("aria-label", d + " " + t + " (demo) — välj tid");
          b.addEventListener("click", function () {
            if (tidLine) tidLine.textContent = "Du valde " + d + " " + t + " i demokalandern.";
            if (dialog && typeof dialog.showModal === "function") dialog.showModal();
          });
          col.appendChild(b);
        }
      });
      frag.appendChild(col);
    });
    cal.appendChild(frag);
  }

  if (closeBtn && dialog) {
    closeBtn.addEventListener("click", function () { dialog.close(); });
  }
  if (dialog) {
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) dialog.close(); // click på backdrop stänger
    });
  }

  var form = document.getElementById("mailform");
  var note = document.getElementById("form-note");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault(); // demo: ingen backend
      if (note) note.hidden = false;
    });
  }
})();
