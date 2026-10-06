/* dateline.js — sätter dagens datum på alla [data-dateline]-platser.
   Utan JS står statisk text ("daglig upplaga") — inget innehåll försvinner. */
(function () {
  "use strict";

  function datelineString(d) {
    try {
      var fmt = new Intl.DateTimeFormat("sv-SE", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
      });
      return fmt.format(d);            /* ex. "onsdag 4 oktober 2026" */
    } catch (err) {
      return null;                     /* behåll statisk fallback-text */
    }
  }

  var text = datelineString(new Date());
  if (!text) return;

  var nodes = document.querySelectorAll("[data-dateline]");
  for (var i = 0; i < nodes.length; i += 1) {
    nodes[i].textContent = text.charAt(0).toUpperCase() + text.slice(1)
      + " — första upplagan";
  }
})();
