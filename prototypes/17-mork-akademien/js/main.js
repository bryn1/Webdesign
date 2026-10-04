/* ============================================================
   17 · Mörka akademien — beteende (progressive enhancement)
   Ingen global: allt i ett IIFE. Sidan är fullt läsbar utan
   detta skript; skriptet lägger bara till js-klassen,
   scroll-avtäckning där view() saknas, bokningsmock och
   demomodalitet.
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasViewTimeline =
    typeof CSS !== "undefined" &&
    CSS.supports("animation-timeline", "view()");

  /* IO-fallback för reveal + marginalia: endast när ingen
     scroll driven animation finns och rörelse är tillåten. */
  if (!reduced && !hasViewTimeline && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    document.querySelectorAll(".reveal, .marginalia").forEach(function (el) {
      io.observe(el);
    });
  }

  /* Bokningsmock: vald tid → dialog med telefon/IG-väg. */
  var dialog = document.getElementById("bokningsdialog");
  var tidSpr = dialog ? dialog.querySelector("[data-dialog-tid]") : null;

  if (dialog) {
    document.querySelectorAll("[data-booking] .tid").forEach(function (knapp) {
      knapp.addEventListener("click", function () {
        if (tidSpr) {
          tidSpr.textContent =
            knapp.dataset.dag + " kl. " + knapp.dataset.tid;
        }
        if (typeof dialog.showModal === "function") {
          dialog.showModal();
        }
      });
    });
  }

  /* Kontaktformulär: demomodalitet — ingen backend. */
  var form = document.querySelector(".letter");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var notis = form.querySelector(".form-note");
      if (notis) {
        notis.textContent =
          "Demo — ingen backend är kopplad, meddelandet skickades inte. " +
          "Ring 072-155 48 60 eller skriv till @mullers.anny.";
      }
    });
  }
})();
