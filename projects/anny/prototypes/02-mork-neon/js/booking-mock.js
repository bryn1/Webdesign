/* Booking MOCK — builds a demo calendar; picking a slot opens a dialog that
   routes to the real booking paths (telefon / Instagram). Nothing is booked.
   No-JS: the grid never renders; a <noscript> note + the Kontakt section carry. */
(function () {
  'use strict';
  var root = document.querySelector('[data-calendar-root]');
  var dialog = document.getElementById('booking-dialog');
  if (!root) { return; }

  var DAYS = ['sön', 'mån', 'tis', 'ons', 'tors', 'fre', 'lör'];
  var MONTHS = ['jan', 'feb', 'mars', 'apr', 'maj', 'juni', 'juli',
    'aug', 'sept', 'okt', 'nov', 'dec'];
  var TIMES = ['09:00', '11:30', '14:00', '17:00'];
  var WEEK = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'];

  var day = new Date();
  var shown = 0;
  var offset = 0;
  while (shown < 5) {
    var d = new Date(day.getFullYear(), day.getMonth(), day.getDate() + offset);
    offset++;
    var wd = d.getDay();
    if (wd === 0 || wd === 6) { continue; }
    var label = WEEK[wd] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()];
    renderDay(root, DAYS[wd] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()], label, shown);
    shown++;
  }

  function renderDay(parent, shortLabel, fullLabel, dayIndex) {
    var wrap = document.createElement('div');
    wrap.className = 'cal-day';
    var h = document.createElement('p');
    h.className = 'cal-day__label';
    h.textContent = shortLabel;
    wrap.appendChild(h);
    var grid = document.createElement('div');
    grid.className = 'cal-slots';
    TIMES.forEach(function (time, i) {
      var taken = (dayIndex * 2 + i * 3) % 4 === 0;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = taken ? 'slot slot--taken' : 'slot';
      b.textContent = time;
      b.setAttribute('aria-label', time + ' ' + fullLabel + (taken ? ' (demo-upptagen)' : ' (demo-ledig)'));
      if (taken) {
        b.setAttribute('aria-disabled', 'true');
      } else {
        b.addEventListener('click', function () { open(time, fullLabel); });
      }
      grid.appendChild(b);
    });
    wrap.appendChild(grid);
    parent.appendChild(wrap);
  }

  function open(time, dayLabel) {
    if (!dialog) { return; }
    var target = dialog.querySelector('[data-dialog-slot]');
    if (target) { target.textContent = time + ' · ' + dayLabel; }
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }

  if (dialog) {
    var closeBtn = dialog.querySelector('[data-dialog-close]');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        if (typeof dialog.close === 'function') { dialog.close(); }
        else { dialog.removeAttribute('open'); }
      });
    }
  }
}());
