/* Anny Morin — demo-bokning + demo-formulär. Ingen backend: allt är märkt demo. */
(function () {
  "use strict";

  /* ---- demo-bokningsgrid: deterministiskt mönster, inga påhittade öppettider ---- */
  var grid = document.getElementById("booking-grid");
  if (grid) {
    var placeholder = grid.querySelector(".booking-noscript");
    if (placeholder) { grid.removeChild(placeholder); }

    var days = ["Mån", "Tis", "Ons", "Tor", "Fre"];
    var times = ["09:00", "12:00", "15:00"];
    var dialog = document.getElementById("booking-dialog");
    var slotLine = document.getElementById("booking-dialog-slot");
    var thanks = document.getElementById("booking-dialog-thanks");
    var actions = dialog ? dialog.querySelector(".dialog-actions") : null;

    function openDialog(label) {
      if (!dialog) { return; }
      slotLine.textContent = label + " (demo)";
      thanks.hidden = true;
      if (actions) { actions.hidden = false; }
      if (typeof dialog.showModal === "function") { dialog.showModal(); }
      else { dialog.setAttribute("open", ""); }
    }

    for (var w = 0; w < 3; w++) {
      var week = document.createElement("div");
      week.className = "booking-week";
      var h = document.createElement("h4");
      h.textContent = "Demovecka " + (w + 1);
      week.appendChild(h);
      for (var d = 0; d < days.length; d++) {
        var free = ((d * 3 + w * 7 + 2) % 4) < 2; /* deterministic demo pattern */
        var time = times[(d + w) % times.length];
        var b = document.createElement("button");
        b.type = "button";
        b.className = free ? "slot slot--ledig" : "slot slot--upptagen";
        var label = days[d] + " " + time;
        b.textContent = label;
        if (free) {
          b.setAttribute("aria-label", "Demo-ledig tid " + label + " — välj för bokningsvägar");
          b.addEventListener("click", (function (l) {
            return function () { openDialog(l); };
          })(label));
        } else {
          b.disabled = true;
          b.setAttribute("aria-label", "Demo-upptagen tid " + label);
        }
        week.appendChild(b);
      }
      grid.appendChild(week);
    }

    if (dialog) {
      dialog.querySelectorAll("[data-dialog-close]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (typeof dialog.close === "function" && dialog.open) { dialog.close(); }
          else { dialog.removeAttribute("open"); }
        });
      });
      var demoBtn = document.getElementById("booking-dialog-demo");
      if (demoBtn) {
        demoBtn.addEventListener("click", function () {
          if (actions) { actions.hidden = true; }
          thanks.hidden = false;
        });
      }
    }
  }

  /* ---- kontaktformulär: demo, skickas inte ---- */
  var form = document.getElementById("kontakt-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var msg = document.getElementById("kontakt-form-msg");
      if (msg) { msg.hidden = false; }
    });
  }
})();
