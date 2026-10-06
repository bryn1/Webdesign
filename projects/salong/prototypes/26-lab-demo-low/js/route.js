/* The fairway route: the page's scroll spine, drawn in code on canvas.
   Decorative only — the page reads without JS. The motion phase animates this draw. */
(function () {
  "use strict";
  var canvas = document.getElementById("fairway-canvas");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");

  // route in region-local space (viewBox 830x284)
  var P = [
    [112, 9],
    [60, 4, 18, 26, 12, 74],     // C c1x c1y c2x c2y x y
    [6, 128, 58, 168, 128, 172],
    [208, 176, 280, 156, 338, 168],
    [420, 186, 470, 242, 552, 248],
    [620, 252, 664, 220, 706, 196],
    [748, 172, 796, 168, 830, 172]
  ];

  function tracePath(scale, progress) {
    ctx.beginPath();
    ctx.moveTo(P[0][0] * scale.x, P[0][1] * scale.y);
    for (var i = 1; i < P.length; i++) {
      var s = P[i];
      ctx.bezierCurveTo(s[0] * scale.x, s[1] * scale.y, s[2] * scale.x, s[3] * scale.y, s[4] * scale.x, s[5] * scale.y);
    }
    return progress;
  }

  function draw(progress) {
    progress = progress === undefined ? 1 : progress;
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    var scale = { x: w / 830, y: h / 284 };
    ctx.strokeStyle = "#c23a2b";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.setLineDash([10, 9]);
    if (progress < 1) {
      var len = 1000;
      try { len = Math.max(500, w * 1.8); } catch (e) {}
      ctx.setLineDash([10, 9]);
      ctx.lineDashOffset = 0;
      // progressive reveal: clip to a rect that grows along the route
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, w * progress, h);
      ctx.clip();
      tracePath(scale);
      ctx.stroke();
      ctx.restore();
    } else {
      tracePath(scale);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    // waypoint circle at the buoy end
    ctx.beginPath();
    ctx.arc(112 * scale.x, 9 * scale.y, 7 * ((scale.x + scale.y) / 2), 0, Math.PI * 2);
    ctx.fillStyle = "#f2eddf";
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#c23a2b";
    ctx.stroke();
    // crossing mark mid-route
    var cx = 552 * scale.x, cy = 248 * scale.y, r = 7 * ((scale.x + scale.y) / 2);
    ctx.beginPath();
    ctx.moveTo(cx - r, cy - r); ctx.lineTo(cx + r, cy + r);
    ctx.moveTo(cx + r, cy - r); ctx.lineTo(cx - r, cy + r);
    ctx.stroke();
  }

  draw(1);
  window.addEventListener("resize", function () { draw(1); });
  window.__fairwayDraw = draw; // motion phase hook
})();
