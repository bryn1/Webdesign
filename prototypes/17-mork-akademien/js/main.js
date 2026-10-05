/* ============================================================
   17 · Mörka akademien — beteende (progressive enhancement)
   Ingen global: allt i ett IIFE. Sidan är fullt läsbar utan
   detta skript; skriptet lägger bara till js-klassen,
   bokningsmock och demomodalitet. Scroll-rörelsen ligger i
   js/scroll-motion.js (GSAP + ScrollTrigger, lokalt vendor).
   ============================================================ */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

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
