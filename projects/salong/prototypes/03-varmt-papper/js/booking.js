/* Demo-bokning + kontaktformular: kalendermock, native dialog och
   klientvalidering. Ingen backend — allting är märkt demo. Inga globaler. */
(function () {
  "use strict";

  /* ---------- demokalender ---------- */
  var WEEK = ["måndag", "tisdag", "onsdag", "torsdag", "fredag"];
  var HEAD = ["Mån", "Tis", "Ons", "Tor", "Fre"];
  var TIMES = ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30"];
  /* Deterministiskt "uppetaget"-monster — samma schema vid varje besök. */
  var TAKEN = { "0-1": 1, "0-4": 1, "1-0": 1, "1-3": 1, "2-2": 1,
                "2-5": 1, "3-1": 1, "3-4": 1, "4-0": 1, "4-2": 1 };

  var root = document.querySelector("[data-calendar-root]");
  var dialog = document.getElementById("booking-dialog");

  if (root && dialog && typeof dialog.showModal === "function") {
    var grid = document.createElement("div");
    grid.className = "cal-grid";
    grid.setAttribute("role", "group");
    grid.setAttribute("aria-label", "Demokalender vecka — välj en demo-ledig tid");

    var head = document.createElement("div");
    head.className = "cal-row cal-head";
    HEAD.forEach(function (h) {
      var s = document.createElement("span");
      s.textContent = h;
      head.appendChild(s);
    });
    grid.appendChild(head);

    TIMES.forEach(function (time, t) {
      var row = document.createElement("div");
      row.className = "cal-row";
      WEEK.forEach(function (day, d) {
        var cell = document.createElement("div");
        cell.className = "cal-cell";
        var taken = TAKEN[d + "-" + t];
        var el;
        if (taken) {
          el = document.createElement("span");
          el.className = "slot slot--taken";
          el.setAttribute("aria-disabled", "true");
          el.textContent = time;
        } else {
          el = document.createElement("button");
          el.type = "button";
          el.className = "slot";
          el.textContent = time;
          el.setAttribute("aria-label",
            "Demo-ledig tid " + day + " " + time + " — val öppnar bokningsinfo");
          el.dataset.day = day;
          el.dataset.time = time;
        }
        cell.appendChild(el);
        row.appendChild(cell);
      });
      grid.appendChild(row);
    });
    root.appendChild(grid);

    /* ---------- dialogkoppling ---------- */
    var slotLine = dialog.querySelector("[data-dialog-slot]");
    var viewConfirm = dialog.querySelector('[data-dialog-view="confirm"]');
    var viewDone = dialog.querySelector('[data-dialog-view="done"]');

    root.addEventListener("click", function (ev) {
      var slot = ev.target.closest("button.slot");
      if (!slot) return;
      slotLine.textContent = slot.dataset.day.charAt(0).toUpperCase() +
        slot.dataset.day.slice(1) + " kl " + slot.dataset.time;
      viewDone.hidden = true;
      viewConfirm.hidden = false;
      dialog.showModal();
    });

    dialog.addEventListener("click", function (ev) {
      if (ev.target.closest("[data-dialog-confirm]")) {
        viewConfirm.hidden = true;
        viewDone.hidden = false;
      } else if (ev.target.closest("[data-dialog-close]")) {
        dialog.close();
      }
    });

    dialog.addEventListener("close", function () {
      viewDone.hidden = true;
      viewConfirm.hidden = false;
    });
  }

  /* ---------- kontaktformular: klientvalidering, ingen backend ---------- */
  var form = document.querySelector("[data-contact-form]");
  if (!form) return;

  var status = document.getElementById("cf-status");
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(input, message) {
    var err = document.getElementById(input.getAttribute("aria-describedby"));
    if (!err) return;
    err.textContent = message;
    err.hidden = !message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var namn = form.elements.namn;
    var epost = form.elements.epost;
    var medd = form.elements.meddelande;
    var ok = true;

    if (!namn.value.trim()) { setFieldError(namn, "Skriv ditt namn."); ok = false; }
    else { setFieldError(namn, ""); }

    if (!EMAIL.test(epost.value.trim())) {
      setFieldError(epost, "Skriv en giltig e-postadress, t.ex. namn@exempel.se.");
      ok = false;
    } else { setFieldError(epost, ""); }

    if (!medd.value.trim()) { setFieldError(medd, "Skriv ett meddelande."); ok = false; }
    else { setFieldError(medd, ""); }

    if (!ok) return;

    var namnKort = namn.value.trim().split(" ")[0];
    form.reset();
    status.hidden = false;
    status.textContent = "Tack, " + namnKort + "! Det här är en demo — " +
      "meddelandet skickades inte, ingen backend är kopplad. Ring +46 70 123 45 67 " +
      "eller skriv på Instagram @jane.cooper.";
  });
}());
