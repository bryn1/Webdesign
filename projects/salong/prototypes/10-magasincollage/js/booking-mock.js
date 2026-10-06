/* booking-mock.js — DEMO-kalender för tema 10 (MC 10088). IIFE, defer, inga
   globals. Bygger exakt ett grid i [data-calendar-root]; vald tid öppnar en
   nativ <dialog> som alltid hänvisar till telefon/Instagram — ingen bokning
   genomförs, och det står synligt i sektionen (PoC-honesty). */
(() => {
  "use strict";

  const root = document.querySelector("[data-calendar-root]");
  const dialog = document.querySelector("[data-booking-dialog]");
  const slotLine = document.querySelector("[data-dialog-slot]");
  if (!root || !dialog || !slotLine) return;

  const TIMES = ["09:00", "11:00", "13:00", "15:00"];
  const DAY_MS = 86400000;

  // Nästa sex öppna dagar (söndagar undantas — öppettider väntar på bekräftelse).
  const days = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  while (days.length < 6) {
    cursor.setTime(cursor.getTime() + DAY_MS);
    if (cursor.getDay() !== 0) days.push(new Date(cursor.getTime()));
  }

  // Deterministiskt demoschema: vissa tider är upptagna så att rutnätet
  // ser levande ut utan att låtsas vara riktigt.
  const isTaken = (dayIndex, timeIndex) => (dayIndex * 4 + timeIndex * 3 + dayIndex * timeIndex) % 5 === 0;

  const fmtDay = new Intl.DateTimeFormat("sv-SE", { weekday: "short", day: "numeric", month: "short" });

  const grid = document.createElement("div");
  grid.className = "cal-grid";
  grid.setAttribute("role", "grid");
  grid.setAttribute("aria-label", "Demokalender — valda tider bokas via telefon eller Instagram");

  const corner = document.createElement("span");
  corner.className = "cal-time";
  corner.setAttribute("role", "rowheader");
  corner.textContent = "Tid";
  grid.appendChild(corner);

  days.forEach((day) => {
    const head = document.createElement("span");
    head.className = "cal-dayhead";
    head.setAttribute("role", "columnheader");
    head.textContent = fmtDay.format(day);
    grid.appendChild(head);
  });

  TIMES.forEach((time, timeIndex) => {
    const timeCell = document.createElement("span");
    timeCell.className = "cal-time";
    timeCell.setAttribute("role", "rowheader");
    timeCell.textContent = time;
    grid.appendChild(timeCell);

    days.forEach((day, dayIndex) => {
      const taken = isTaken(dayIndex, timeIndex);
      if (taken) {
        const off = document.createElement("span");
        off.className = "cal-slot cal-slot--taken";
        off.textContent = "full";
        off.setAttribute("role", "gridcell");
        off.setAttribute("aria-disabled", "true");
        grid.appendChild(off);
        return;
      }
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cal-slot";
      btn.setAttribute("role", "gridcell");
      const dayLabel = fmtDay.format(day);
      btn.setAttribute("aria-label", dayLabel + " " + time + " — demo-ledig, välj tiden");
      btn.textContent = "ledig";
      btn.addEventListener("click", () => {
        slotLine.textContent = "Demoval: " + dayLabel + " kl " + time + ".";
        if (typeof dialog.showModal === "function") dialog.showModal();
        else dialog.setAttribute("open", "");
      });
      grid.appendChild(btn);
    });
  });

  // Invariant: bara en .cal-grid i roten (samma regel som PoC:n).
  root.querySelectorAll(".cal-grid").forEach((old) => old.remove());
  root.appendChild(grid);

  const close = dialog.querySelector("[data-dialog-close]");
  if (close) close.addEventListener("click", () => dialog.close());
  // Klick utanför dialogen stänger (vanlig dialog-vanor).
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
})();
