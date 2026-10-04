/* booking.js — DEMO-bokningsmock: bygger kalendergriden i ETT rutnät, öppen tid →
   dialog med telefon/Instagram-väg. Ingen backend; allt märkt demo. One concern:
   the booking mock only. */
(function () {
  'use strict';

  var root = document.querySelector('[data-calendar-root]');
  var dialog = document.getElementById('bokningsdialog');
  if (!root || !dialog) return;

  var DAYS = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre'];
  var WEEKS = ['v. 41', 'v. 42'];
  var TIMES = ['09:00', '11:30', '14:00'];

  // Bestämnigt "upptaget"-mönster (demo-schema, ingen slump).
  function isTaken(col, row) {
    return (col + row * 2) % 3 === 0;
  }

  var grid = document.createElement('ul');
  grid.className = 'cal-grid';
  grid.setAttribute('aria-label', 'Demo-lediga tider (demo, ingen bokning genomförs)');

  WEEKS.forEach(function (week, w) {
    DAYS.forEach(function (day, d) {
      var col = w * DAYS.length + d;
      TIMES.forEach(function (time, t) {
        var li = document.createElement('li');
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cal-slot';
        var taken = isTaken(col, t);
        btn.innerHTML =
          week + ' ' + day + '<small>' + time + ' · ' +
          (taken ? 'demo-upptagen' : 'demo-ledig') + '</small>';
        btn.setAttribute('aria-pressed', 'false');
        if (taken) {
          btn.disabled = true;
          btn.setAttribute('aria-label',
            week + ' ' + day + ' ' + time + ' — demo-upptagen tid');
        } else {
          btn.setAttribute('aria-label',
            week + ' ' + day + ' ' + time + ' — demo-ledig, välj tid (demo)');
        }
        li.appendChild(btn);
        grid.appendChild(li);
      });
    });
  });
  root.appendChild(grid);

  var textEl = dialog.querySelector('[data-dialog-text]');
  var pressed = null;

  grid.addEventListener('click', function (ev) {
    var btn = ev.target.closest('.cal-slot');
    if (!btn || btn.disabled) return;

    if (pressed && pressed !== btn) pressed.setAttribute('aria-pressed', 'false');
    pressed = btn;
    btn.setAttribute('aria-pressed', 'true');

    var label = btn.getAttribute('aria-label')
      .replace(' — demo-ledig, välj tid (demo)', '');
    textEl.textContent = 'Vald tid: ' + label +
      '. Ingen bokning genomförs — bekräfta tiden via telefon eller Instagram.';

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', ''); // degradation för sällsynta säng utan <dialog>
    }
  });

  dialog.addEventListener('close', function () {
    if (pressed) {
      pressed.setAttribute('aria-pressed', 'false');
      pressed = null;
    }
  });

  // Stäng-knappar inuti dialogen.
  dialog.querySelectorAll('[data-dialog-close]').forEach(function (el) {
    el.addEventListener('click', function () {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    });
  });
})();
