/* main.js — Anny Morin
   Del 1: scrollkoreografi (kräver klassen "motion" på <html> + lokala GSAP).
   Del 2: boknings- och formulärdemo (kör alltid där dialog stöds; innehåll
   är fullt synligt även utan denna fil). */
(function () {
  "use strict";

  var rot = document.documentElement;
  var harMotion = rot.classList.contains("motion");
  var g = window.gsap;
  var ST = window.ScrollTrigger;
  var kanScrolla = harMotion && !!g && !!ST;

  /* ============ 1 · SCROLLKOREOGRAFI ============ */
  if (kanScrolla) {
    g.registerPlugin(ST);

    /* Aktiv avsnittsmarkering i den övre listan */
    var lankar = {};
    Array.prototype.forEach.call(document.querySelectorAll(".meny a"), function (a) {
      var id = (a.getAttribute("href") || "").replace("#", "");
      if (id && document.getElementById(id)) lankar[id] = a;
    });
    function sattAktiv(id) {
      Object.keys(lankar).forEach(function (k) {
        if (k === id) lankar[k].setAttribute("aria-current", "true");
        else lankar[k].removeAttribute("aria-current");
      });
    }
    ["om", "tjanster", "galleri", "boka", "kontakt"].forEach(function (id) {
      var sek = document.getElementById(id);
      if (!sek) return;
      ST.create({
        trigger: sek,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: function (self) { if (self.isActive) sattAktiv(id); }
      });
    });
    var topp = document.getElementById("top");
    if (topp) {
      ST.create({
        trigger: topp,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: function (self) { if (self.isActive) sattAktiv(""); }
      });
    }

    /* Hårstrået: ritas ur sig själv när sidan landar — sida 1:s signaturrörelse */
    var strand = document.getElementById("strand-path");
    if (strand) {
      g.from(strand, {
        strokeDasharray: 1,
        strokeDashoffset: 1,
        duration: 1.6,
        delay: 0.12,
        ease: "power2.out"
      });
    }

    /* Tråden i vänstermarginalen: läspositionen genom hela sidan */
    var trad = document.querySelector(".langtrad line");
    if (trad) {
      g.set(trad, { scaleY: 0, transformOrigin: "50% 0%" });
      g.to(trad, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.4 }
      });
    }

    /* Innehåll lyfter fram ur redan synligt läge */
    g.utils.toArray(".reveal").forEach(function (el) {
      g.from(el, {
        y: 26,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" }
      });
    });

    /* Galleriet: wipe-rörelsen är före→efter */
    g.utils.toArray(".reveal-wip").forEach(function (fig) {
      var bild = fig.querySelector("img");
      if (!bild) return;
      g.from(bild, {
        clipPath: "inset(0 100% 0 0)",
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger: { trigger: fig, start: "top 82%" }
      });
    });

    /* Porträttet andrar sig lite i sin ram (stor skärm) */
    if (window.matchMedia("(min-width: 901px)").matches) {
      var portrat = document.querySelector(".portrat-bild");
      if (portrat) {
        g.fromTo(portrat,
          { scale: 1.09, yPercent: -2.4 },
          {
            scale: 1.09,
            yPercent: -8.5,
            ease: "none",
            scrollTrigger: { trigger: ".portrat", start: "top bottom", end: "bottom top", scrub: 0.5 }
          });
      }
    }

    /* Layout kan flytta på sig när typsnitt landar — räkna om startpunkterna */
    window.addEventListener("load", function () { ST.refresh(); });
  }

  /* ============ 2 · BOKNINGSDEMO ============ */
  var dagar = ["söndag", "måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag"];
  var manader = ["januari", "februari", "mars", "april", "maj", "juni",
    "juli", "augusti", "september", "oktober", "november", "december"];

  /* Veckodagarna får kommande 7 dagars datum — fortfarande demo, aldrig öppettider */
  var dagLi = Array.prototype.slice.call(document.querySelectorAll(".vecka .dag"));
  (function fyllDatum() {
    var nu = new Date();
    dagLi.forEach(function (li, i) {
      var namn = li.querySelector(".dag-namn");
      if (!namn) return;
      var d = new Date(nu.getFullYear(), nu.getMonth(), nu.getDate() + 1 + i);
      namn.textContent = dagar[d.getDay()] + " " + d.getDate() + " " + manader[d.getMonth()];
    });
  })();

  var dialog = document.getElementById("vald-tid");
  var dialogTid = document.getElementById("dialog-tid");
  var valdKnapp = null;

  function valTid(knapp) {
    if (valdKnapp && valdKnapp !== knapp) valdKnapp.setAttribute("aria-pressed", "false");
    valdKnapp = knapp;
    knapp.setAttribute("aria-pressed", "true");

    var dagRad = knapp.closest(".dag");
    var dag = dagRad ? dagRad.querySelector(".dag-namn").textContent : "";
    var text = (dag + " " + knapp.textContent).trim();

    if (dialog && dialogTid) {
      dialogTid.textContent = text + " — demotid, ingen bokning genomförd";
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    }
  }

  Array.prototype.forEach.call(document.querySelectorAll(".vecka .tid"), function (knapp) {
    knapp.setAttribute("aria-pressed", "false");
    knapp.addEventListener("click", function () { valTid(knapp); });
  });

  if (dialog) {
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog && typeof dialog.close === "function") dialog.close();
    });
  }

  /* ============ 3 · KONTAKTFORMULÄR-DEMO ============ */
  var formular = document.getElementById("formular");
  var svar = document.getElementById("form-svar");
  if (formular && svar) {
    formular.addEventListener("submit", function (e) {
      e.preventDefault();
      svar.hidden = false;
      if (typeof svar.scrollIntoView === "function") {
        svar.scrollIntoView({ block: "nearest" });
      }
    });
  }
})();
