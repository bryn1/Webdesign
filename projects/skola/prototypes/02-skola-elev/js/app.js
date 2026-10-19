// 02-skola-elev — only interactive state: the schema error panel's retry.
// With JS off the page is fully readable; the skeleton shows the loading pattern.
(function () {
  "use strict";
  var btn = document.getElementById("retry");
  if (!btn) return;
  btn.addEventListener("click", function () {
    var box = btn.parentElement;
    if (!box) return;
    var rows = [14, 12, 10];
    var skels = rows.map(function (h) {
      var d = document.createElement("div");
      d.className = "skeleton";
      d.style.setProperty("--h", h + "px");
      return d;
    });
    box.replaceChildren.apply(box, skels);
    window.setTimeout(function () {
      box.classList.remove("statebox--err");
      var p = document.createElement("p");
      p.textContent = "Schemat är hämtat — måndag till onsdag visas ovan.";
      box.replaceChildren(p);
    }, 400);
  });
})();
