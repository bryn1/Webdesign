/* booking-mock.js — one concern: the "Boka" DEMO grid + honest dialog flow.
 * It NEVER books anything (PoC I2): every path ends in the native <dialog>
 * that routes to telefon/Instagram. Grid is demo data; the section carries
 * the synliga "Demo"-märket. No globals, deferred. */
(function () {
  'use strict';
  try {
    var host = document.querySelector('[data-booking-root]');
    var dialog = document.getElementById('booking-dialog');
    if (!host || !dialog || typeof dialog.showModal !== 'function') return;

    var DAYS = [
      { label: 'Mån 6/10', slots: ['09:00', '11:30', '14:00', '16:30'] },
      { label: 'Tis 7/10', slots: ['10:00', '13:00', '15:30'] },
      { label: 'Ons 8/10', slots: ['09:30', '12:00', '17:00'] },
      { label: 'Tor 9/10', slots: ['11:00', '14:30', '16:00', '18:00'] },
      { label: 'Fre 10/10', slots: ['09:00', '10:30', '13:30'] }
    ];

    var picked = null;
    var slotLabel = dialog.querySelector('[data-dialog-slot]');
    var views = {
      confirm: dialog.querySelector('[data-dialog-view="confirm"]'),
      done: dialog.querySelector('[data-dialog-view="done"]')
    };

    function showView(name) {
      Object.keys(views).forEach(function (key) {
        views[key].hidden = key !== name;
      });
    }

    function clearPicked() {
      if (picked) {
        picked.setAttribute('aria-pressed', 'false');
        picked = null;
      }
    }

    DAYS.forEach(function (day) {
      var row = document.createElement('div');
      row.className = 'booking__day';

      var label = document.createElement('p');
      label.className = 'booking__day-label';
      label.textContent = day.label;

      var slots = document.createElement('div');
      slots.className = 'booking__slots';
      slots.setAttribute('role', 'group');
      slots.setAttribute('aria-label', 'Demo-tider ' + day.label);

      day.slots.forEach(function (time) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'slot';
        btn.textContent = time;
        btn.setAttribute('aria-pressed', 'false');
        btn.setAttribute('aria-label', 'Demo-tid ' + time + ' ' + day.label);
        btn.addEventListener('click', function () {
          clearPicked();
          picked = btn;
          btn.setAttribute('aria-pressed', 'true');
          slotLabel.textContent = day.label + ' ' + time;
          showView('confirm');
          dialog.showModal();
        });
        slots.appendChild(btn);
      });

      row.appendChild(label);
      row.appendChild(slots);
      host.appendChild(row);
    });

    var confirmBtn = dialog.querySelector('[data-dialog-confirm]');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', function () { showView('done'); });
    }
    dialog.querySelectorAll('[data-dialog-close]').forEach(function (btn) {
      btn.addEventListener('click', function () { dialog.close(); });
    });

    // Återställ efter ALLT stäng (knapp, Esc, native): ingen "valt" spökar.
    dialog.addEventListener('close', function () {
      clearPicked();
      showView('confirm');
    });
  } catch (e) { /* utan JS: noscript-texten i sektionen gäller */ }
}());
