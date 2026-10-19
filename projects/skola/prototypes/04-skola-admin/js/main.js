/* 04-skola-admin — rail scroll-spy, anvandarfilter, skeleton. Utan JS: allt innehall ar statiskt synligt. */
(function () {
  "use strict";

  // Skelett = forsta lastningen; verkliga tabellen finns redan i DOM:en.
  var skel = document.getElementById("skelett");
  if (skel) skel.hidden = true;

  // Rail: markera avsnittet som ar i sikte (signature move: route-kartan foljer med).
  var lankar = Array.prototype.slice.call(document.querySelectorAll(".rail a"));
  var mal = lankar
    .map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); })
    .filter(Boolean);
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (poster) {
      poster.forEach(function (p) {
        if (!p.isIntersecting) return;
        lankar.forEach(function (a) {
          a.classList.toggle("aktiv", a.getAttribute("href") === "#" + p.target.id);
        });
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    mal.forEach(function (m) { io.observe(m); });
  }

  // Anvandare: filter pa namn/roll; tomm tillstand nar inget matchar.
  var input = document.getElementById("filter");
  var rader = Array.prototype.slice.call(document.querySelectorAll("#anvandare tbody tr"));
  var tom = document.getElementById("anvandare-tom");
  function filtrera() {
    var q = (input.value || "").trim().toLowerCase();
    var nagon = 0;
    rader.forEach(function (r) {
      var_traffar(r, q);
    });
    function var_traffar(r, q) {
      var traff = !q || r.textContent.toLowerCase().indexOf(q) !== -1;
      r.hidden = !traff;
      if (traff) nagon++;
    }
    if (tom) tom.hidden = nagon !== 0;
  }
  if (input) input.addEventListener("input", filtrera);
})();
