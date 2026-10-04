/* main.js — Gradientljus (tema 16). IIFE: inga globals. Laddas med defer.
   Sidan är fullt läsbar utan denna fil — allt här är progressiv förstärkning:
   1) bokningsmock: vald tid → dialog med telefon/Instagram-väg (demo),
   2) kontaktformular: demomodalitet (ingen backend),
   3) glödfallback med IntersectionObserver om animation-timeline: view() saknas. */
(function () {
  "use strict";

  /* ---------- 1. Bokningsmock (demo — ingen bokning genomförs) ---------- */

  var dialog = document.getElementById("tidsval");
  var tidText = document.getElementById("tidsval-tid");
  var slots = Array.prototype.slice.call(
    document.querySelectorAll("#tidsgaller .slot:not([disabled])")
  );
  var canDialog = !!(dialog && typeof dialog.showModal === "function");

  if (canDialog && slots.length) {
    slots.forEach(function (slot) {
      slot.setAttribute("aria-haspopup", "dialog");
      slot.addEventListener("click", function () {
        slots.forEach(function (s) { s.setAttribute("aria-pressed", "false"); });
        slot.setAttribute("aria-pressed", "true");
        if (tidText) {
          tidText.textContent = slot.getAttribute("data-tid") || "en tid";
        }
        dialog.showModal();
      });
    });

    dialog.addEventListener("close", function () {
      slots.forEach(function (s) { s.removeAttribute("aria-pressed"); });
    });

    /* stäng vid klick utanför rutan (på backdrop) */
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) { dialog.close(); }
    });
  }

  /* ---------- 2. Kontaktformular — demomodalitet ---------- */

  var form = document.getElementById("kontaktformularet");
  var svar = document.getElementById("form-svar");

  if (form && svar) {
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // ingen backend — skicka aldrig
      var namn = form.elements.namedItem("namn");
      var meddelande = form.elements.namedItem("meddelande");
      if (namn && !namn.value.trim()) { namn.focus(); return; }
      if (meddelande && !meddelande.value.trim()) { meddelande.focus(); return; }
      svar.hidden = false;
      svar.scrollIntoView({ block: "nearest" });
    });
  }

  /* ---------- 3. Glödintensitet: IO-fallback utan view()-timeline ---------- */

  var supportsViewTimeline =
    window.CSS && CSS.supports && CSS.supports("animation-timeline", "view()");
  var prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!supportsViewTimeline && !prefersReduced && "IntersectionObserver" in window) {
    var glows = document.querySelectorAll(".section__glow");
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("glow--on");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.05 }
    );
    Array.prototype.forEach.call(glows, function (glow) { io.observe(glow); });
  }
})();
