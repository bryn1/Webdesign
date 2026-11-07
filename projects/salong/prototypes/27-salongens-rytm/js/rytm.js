/* rytm.js — the single <script> of this prototype. Everything here is enhancement:
   without JS every element is visible and every real channel (tel/mailto/IG links)
   still works. Reveals flip one class via IntersectionObserver (no scroll handlers,
   no rAF loops); reduced-motion never sees these states (css/motion.css gates them
   behind .js-motion + prefers-reduced-motion: no-preference). */
(function () {
  "use strict";

  document.documentElement.classList.add("js-motion");

  /* — reveal: flip .in once, then stop watching (family "reveal", ~15 targets) — */
  var revealables = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("in"); });
  }

  /* — format rail: real buttons, aria-pressed, keyboard-native — */
  var chips = document.querySelectorAll(".chip[data-filter]");
  var cards = document.querySelectorAll("[data-format]");
  var tomRum = document.getElementById("tom-rum");
  var status = document.getElementById("galleri-status");

  function filtrera(format) {
    var syns = 0;
    cards.forEach(function (card) {
      var traffar = format === "all" || card.getAttribute("data-format") === format;
      card.hidden = !traffar;
      if (traffar) syns += 1;
    });
    if (tomRum) tomRum.hidden = syns !== 0;
    if (status) status.textContent = "Visar " + syns + " bildplatser.";
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (other) {
        other.setAttribute("aria-pressed", String(other === chip));
      });
      filtrera(chip.getAttribute("data-filter"));
    });
  });

  /* — demo booking: choose a mock time, the dialog names the real path — */
  var dialog = document.getElementById("dialog-tid");
  var valdTid = document.getElementById("vald-tid");
  var stang = document.getElementById("dialog-stang");

  function oppnaDialog(text) {
    if (!dialog) return;
    if (valdTid) valdTid.textContent = text;
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", ""); /* old UAs: readable inline, never a dead end */
    }
  }

  document.querySelectorAll(".tid").forEach(function (tid) {
    tid.addEventListener("click", function () {
      oppnaDialog(tid.textContent.trim());
    });
  });

  if (stang && dialog) {
    stang.addEventListener("click", function () { dialog.close(); });
  }
})();
