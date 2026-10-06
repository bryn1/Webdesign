/* Din Salong — progressive enhancement only. The page works without this file. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- scroll choreography (GSAP + ScrollTrigger, local copies) --- */
  function initMotion() {
    if (reduceMotion) return;
    if (typeof window.gsap === "undefined" || typeof window.ScrollTrigger === "undefined") return;
    var doc = document.documentElement;
    doc.classList.add("js-motion");
    window.gsap.registerPlugin(window.ScrollTrigger);

    // Reveals start from an already-visible default (immediateRender:false):
    // never-scrolled content (crawlers, full-page captures) stays visible.
    var sections = ["#om", "#tjanster", "#galleri", "#boka", "#kontakt", ".chart-close"];
    sections.forEach(function (sel) {
      var el = document.querySelector(sel);
      if (!el) return;
      window.gsap.from(el, {
        opacity: 0, y: 26, duration: 0.7, ease: "power3.out",
        immediateRender: false,
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
    });

    // The signature moment: the sea-sheet drifts under the fixed chart furniture
    // while you scroll past the hero — land slips upstream, water lags behind.
    var ground = document.querySelector(".chart-ground");
    var hero = document.querySelector(".chart-hero");
    if (ground && hero) {
      window.gsap.fromTo(ground, { y: "0%" }, {
        y: "4%", ease: "none", immediateRender: false,
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 }
      });
    }
  }

  /* --- booking demo: pick a slot, get the real contact routes --- */
  function initBooking() {
    var grid = document.getElementById("bokningsgrid");
    var dialog = document.getElementById("valdTid");
    var slotText = document.getElementById("valdTidText");
    if (!grid || !dialog || !slotText) return;

    grid.addEventListener("click", function (ev) {
      var btn = ev.target.closest ? ev.target.closest("button.slot") : null;
      if (!btn || btn.disabled) return;
      var slots = grid.querySelectorAll("button.slot");
      for (var i = 0; i < slots.length; i++) slots[i].setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-pressed", "true");
      slotText.textContent = btn.getAttribute("data-slot") || btn.textContent;
      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      }
    });
    dialog.addEventListener("close", function () {
      var btns = grid.querySelectorAll('button.slot[aria-pressed="true"]');
      for (var i = 0; i < btns.length; i++) btns[i].setAttribute("aria-pressed", "false");
    });
  }

  /* --- contact form: demo only, connects to no backend --- */
  function initForm() {
    var form = document.getElementById("kontaktForm");
    var status = document.getElementById("formStatus");
    if (!form || !status) return;
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      status.hidden = false;
      status.textContent =
        "Demo: ingen backend är kopplad, så meddelandet skickades inte. " +
        "Ring 07X-XXX XX XX eller skriv till @dinsalong på Instagram.";
    });
  }

  function boot() {
    initMotion();
    initBooking();
    initForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
