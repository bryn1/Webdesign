/* booking.js — en sak: DEMO-bokningskalendern + ärlig dialogflöde.
   Bygger en fixt demo-matris (inga riktiga öppettider — de är "(bekräftas
   snart)"). Aldrig en riktig bokning (PoC-regel I2). Infödd <dialog>; om
   showModal saknas fallback: positionera via [open]-attribut och hantera
   stängning själv. Inga globals. */
(function () {
  'use strict';

  var host = document.querySelector('[data-calendar-root]');
  var dialog = document.getElementById('booking-dialog');
  if (!host || !dialog) return;

  var DAYS = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre'];
  var TIMES = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
  /* Fixt demo-mönster (rad = tid, kolonn = dag). true = demo-ledig.
     Ingen slump — schemat är statisk placeholder, inte öppettider. */
  var FREE = [
    [true,  false, true,  true,  false],
    [false, true,  true,  false, true ],
    [true,  true,  false, true,  true ],
    [false, true,  true,  true,  false],
    [true,  false, true,  false, true ],
    [true,  true,  false, true,  true ]
  ];

  var slotLabel = dialog.querySelector('[data-dialog-slot]');
  var viewConfirm = dialog.querySelector('[data-dialog-view="confirm"]');
  var viewDone = dialog.querySelector('[data-dialog-view="done"]');
  var canModal = typeof dialog.showModal === 'function';

  function buildGrid() {
    var grid = document.createElement('div');
    grid.className = 'cal';
    grid.setAttribute('role', 'group');
    grid.setAttribute('aria-label', 'Demo-kalender med lediga tider');

    var corner = document.createElement('div');
    corner.className = 'cal__corner';
    corner.textContent = 'Tid';
    grid.appendChild(corner);
    DAYS.forEach(function (d) {
      var cell = document.createElement('div');
      cell.className = 'cal__day';
      cell.textContent = d;
      grid.appendChild(cell);
    });

    TIMES.forEach(function (time, r) {
      var t = document.createElement('div');
      t.className = 'cal__time';
      t.textContent = time;
      grid.appendChild(t);

      DAYS.forEach(function (day, c) {
        var free = FREE[r][c];
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cal__slot';
        btn.textContent = free ? 'Ledig' : 'Upptagen';
        btn.setAttribute('aria-label', day + ' ' + time +
          (free ? ' — demo-ledig, välj tiden' : ' — demo-upptagen'));
        if (free) {
          btn.dataset.slot = day + ' ' + time;
          btn.addEventListener('click', onPick);
        } else {
          btn.setAttribute('aria-disabled', 'true');
        }
        grid.appendChild(btn);
      });
    });

    host.appendChild(grid);
  }

  function openDialog() {
    viewConfirm.hidden = false;
    viewDone.hidden = true;
    if (canModal) {
      dialog.showModal();
    } else {
      /* Fallback utan showModal (mycket gamla webbläsare): dialogen visas
         inlinjert längst ut i flödet — läsbar, inget bryts. */
      dialog.setAttribute('open', '');
      var close = dialog.querySelector('.dlg__close');
      if (close) close.focus();
    }
  }

  function closeDialog() {
    if (canModal && dialog.open) {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  }

  function onPick(ev) {
    var slot = ev.currentTarget.dataset.slot;
    if (slotLabel) slotLabel.textContent = slot + ' (demo)';
    openDialog();
  }

  dialog.addEventListener('click', function (ev) {
    if (ev.target === dialog) closeDialog(); /* klick på backdrop */
    var t = ev.target.closest ? ev.target.closest('[data-dialog-close]') : null;
    if (t) closeDialog();
    var c = ev.target.closest ? ev.target.closest('[data-dialog-confirm]') : null;
    if (c) {
      viewConfirm.hidden = true;
      viewDone.hidden = false;
    }
  });

  buildGrid();
})();
