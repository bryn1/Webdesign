// sc4-sweep.mjs — machine-readable acceptance sweep for MC 10140.7 (raw 10329) + the
// SC2 return-cable render eval for MC 10140.6 (raw 10303). Deterministic: no model call.
//
// Playwright-core resolution follows the sanctioned describe-image/scripts/screenshot.mjs
// (the dsh clickable-browser provider's ONE install — no second browser copy).
//
// What it proves, per card acceptance (verbatim DoDs):
//  10329: "at 1440/1572 widths x heights 591/650/720/900/1200 the counters rect intersects
//         NO spoke rect and NO .caps rect (headless bounding-box eval on :8092)" — measured at
//         every 0.5s of the SC4 window (t=40..50 of the pinned master timeline, seeked via
//         ScrollTrigger's own scrub animation) INCLUDING the 48-50s collapse; plus the row-2
//         SC2 opacity check (polygon opacity 0 @ t=24, 1 @ t=26.5 at 1440x900) and the
//         reduced/no-JS static-content check (SC2 loop + SC4 counters present).
//  10303: "the arrow-tip x equals the Bygg node center x AND the path-start x equals the
//         Testa node center x (viewBox coords)" — the closer round-4 eval expression verbatim,
//         run at every acceptance size (x is layout-invariant across heights/widths; measured).
//
// Usage: node sc4-sweep.mjs [--url URL] [--out-sweep sweep-10329.json] [--out-eval eval-10303.json]
// Exit: 0 = every named check holds; 1 = at least one violation (rows in the JSONs); 2 = harness failure.
import { createRequire } from "node:module";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const PROVIDER_PKG = "packages/experimental/browser-use-playwright-mcp";
function dshClone() {
  if (process.env.DSH_CLONE) return process.env.DSH_CLONE;
  const dirs = (process.env.PATH || "").split(":").concat([path.join(os.homedir(), ".local/bin"), "/usr/local/bin"]);
  for (const d of dirs) {
    try {
      const m = fs.readFileSync(path.join(d, "dsh"), "utf8").match(/(\/\S+)\/apps\/cli\/lib\/bin\.js/);
      if (m) return m[1];
    } catch {}
  }
  return null;
}
function playwrightCoreDir() {
  if (process.env.PLAYWRIGHT_CORE_DIR) return process.env.PLAYWRIGHT_CORE_DIR;
  const clone = dshClone();
  if (!clone) throw new Error("no dsh launcher found (set DSH_CLONE or PLAYWRIGHT_CORE_DIR)");
  const mcp = fs.realpathSync(path.join(clone, PROVIDER_PKG, "node_modules/@playwright/mcp"));
  return path.dirname(createRequire(path.join(mcp, "package.json")).resolve("playwright-core/package.json"));
}
const requirePw = createRequire(path.join(playwrightCoreDir(), "package.json"));
const { chromium } = requirePw(playwrightCoreDir());

const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : d; };
const URL = opt("url", "http://127.0.0.1:8092/workflow-explode/");
const OUT_SWEEP = opt("out-sweep", path.join(import.meta.dirname, "sweep-10329.json"));
const OUT_EVAL = opt("out-eval", path.join(import.meta.dirname, "eval-10303.json"));

// Acceptance sizes verbatim from the card: "at 1440/1572 widths x heights 591/650/720/900/1200".
const SIZES = [];
for (const w of [1440, 1572]) for (const h of [591, 650, 720, 900, 1200]) SIZES.push([w, h]);
const SC4_TIMES = [];
for (let t = 40; t <= 50.0001; t += 0.5) SC4_TIMES.push(+t.toFixed(1));

// strict rect intersection: touching edges (zero-area) do NOT count; the gap is then reported
function rectsHit(a, b) { return a.r > b.l && b.r > a.l && a.b > b.t && b.b > a.t; }
function gapPx(a, b) {
  const dx = Math.max(a.l - b.r, b.l - a.r), dy = Math.max(a.t - b.b, b.t - a.b);
  if (dx <= 0 && dy <= 0) return { hit: true, gap: 0 };
  if (dx <= 0) return { hit: false, gap: +dy.toFixed(2) };
  if (dy <= 0) return { hit: false, gap: +dx.toFixed(2) };
  return { hit: false, gap: +Math.hypot(dx, dy).toFixed(2) };
}

// In-page master timeline = ScrollTrigger's own scrub animation (duration 60). pause()+seek()
// renders the exact scene state; scrub:1 smoothing never runs (the page never scrolls).
const INIT = `(() => {
  const sts = ScrollTrigger.getAll().filter(s => s.animation && Math.abs(s.animation.duration() - 60) < 0.01);
  if (!sts.length) return "no master timeline found";
  window.__tl = sts[0].animation; window.__tl.pause();
  return "ok";
})()`;
const rectOf = `(el => { const b = el.getBoundingClientRect();
  return { l: +b.left.toFixed(3), t: +b.top.toFixed(3), r: +b.right.toFixed(3), b: +b.bottom.toFixed(3) }; })`;

const sweep = { url: URL, instrument: "sc4-sweep.mjs (playwright-core headless chromium, tl.pause().seek(t))",
  rule: "counters rect must intersect (strict, positive-area) NO .spoke rect and NO .caps/.cap rect at every t in 40..50 step 0.5",
  sizes: [], violations: [] };
const geometry = { url: URL, expr: "arrowTip vs Bygg center, pathStart vs Testa center, viewBox coords (closer round-4 expression)",
  sizes: [], equal: true };

const browser = await chromium.launch();
try {
  for (const [w, h] of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(URL, { waitUntil: "load" });
    await page.evaluate("document.fonts.ready");
    await page.waitForTimeout(350);
    const init = await page.evaluate(INIT);
    if (init !== "ok") { console.error(`${w}x${h}: ${init}`); process.exitCode = 2; await ctx.close(); break; }

    // ---- 10303 geometry row (viewBox coords, layout-invariant x — measured per size) ----
    const geo = await page.evaluate(`(() => {
      const svg = document.querySelector('svg.flow__loop');
      const path = svg.querySelector('path'); const poly = svg.querySelector('polygon');
      const inv = svg.getScreenCTM().inverse();
      const vb = (el) => { const r = el.getBoundingClientRect();
        const p = new DOMPoint(r.left + r.width / 2, r.top + r.height / 2).matrixTransform(inv);
        return { x: +p.x.toFixed(1), y: +p.y.toFixed(1), x_exact: p.x }; };
      const nodes = [...document.querySelectorAll('.wf-node')];
      const bygg = vb(nodes.find(n => n.textContent.trim() === 'Bygg'));
      const testa = vb(nodes.find(n => n.textContent.trim() === 'Testa'));
      const p0 = path.getPointAtLength(0);
      const tip = poly.points.getItem(0);
      const r1 = (v) => Math.round(v * 10) / 10;
      return JSON.stringify({ width: ${w}, height: ${h}, viewBox: svg.getAttribute('viewBox'),
        path_d: path.getAttribute('d'), polygon_points: poly.getAttribute('points'),
        pathStart: { x: +p0.x.toFixed(1), y: +p0.y.toFixed(1), x_exact: p0.x },
        arrowTip: { x: +tip.x.toFixed(1), y: +tip.y.toFixed(1), x_exact: tip.x },
        byggCenter: bygg, testaCenter: testa,
        tip_vs_bygg_dx: r1(tip.x - bygg.x_exact), start_vs_testa_dx: r1(p0.x - testa.x_exact),
        tip_vs_bygg_dx_full: tip.x - bygg.x_exact, start_vs_testa_dx_full: p0.x - testa.x_exact });
    })()`);
    const g = JSON.parse(geo);
    geometry.sizes.push(g);
    if (g.tip_vs_bygg_dx !== 0 || g.start_vs_testa_dx !== 0) {
      geometry.equal = false;
      geometry.sizes[geometry.sizes.length - 1].VIOLATION = "tip/pathStart x != node center x at this size";
    }

    // ---- 10329 SC4 counters sweep ----
    const rows = [];
    for (const t of SC4_TIMES) {
      const m = await page.evaluate(`(() => {
        window.__tl.seek(${t});
        const R = ${rectOf};
        const counters = document.querySelector('.counters');
        const cs = getComputedStyle(counters);
        const caps = document.querySelector('.caps');
        return JSON.stringify({
          t: ${t},
          counters: R(counters),
          countersStyle: { top: cs.top, bottom: cs.bottom },
          hubgScale: getComputedStyle(document.querySelector('.hubg')).transform,
          spokes: [...document.querySelectorAll('.spoke')].map(R),
          caps: R(caps),
          capKids: [...document.querySelectorAll('.cap')].map(R),
        });
      })()`);
      const s = JSON.parse(m);
      const pairs = [];
      s.spokes.forEach((sp, i) => { const gp = gapPx(s.counters, sp); pairs.push({ target: `spoke${i}`, ...gp }); });
      const gpCaps = gapPx(s.counters, s.caps); pairs.push({ target: ".caps", ...gpCaps });
      s.capKids.forEach((ck, i) => { const gp = gapPx(s.counters, ck); pairs.push({ target: `.cap[${i}]`, ...gp }); });
      const hits = pairs.filter((p) => p.hit);
      const minGap = Math.min(...pairs.map((p) => (p.hit ? 0 : p.gap)));
      const row = { t, counters: s.counters, countersStyle: s.countersStyle, minGapPx: minGap,
        pairs: pairs.filter((p) => p.hit || p.gap < 30) };
      if (hits.length) {
        row.VIOLATION = `${hits.length} strict intersection(s): ${hits.map((p) => p.target).join(", ")}`;
        sweep.violations.push(`${w}x${h} t=${t}: ${row.VIOLATION}`);
      }
      rows.push(row);
    }
    // ---- 10329 SC2 opacity row (card: at 1440x900 polygon 0 @ t24, 1 @ t26.5) ----
    let sc2 = null;
    if (w === 1440 && h === 900) {
      sc2 = await page.evaluate(`(() => {
        const op = (sel) => getComputedStyle(document.querySelector(sel)).opacity;
        window.__tl.seek(24);
        const at24 = { polygon: op('.flow__loop polygon'), text: op('.flow__loop text'), flow: op('.flow') };
        window.__tl.seek(26.5);
        const at265 = { polygon: op('.flow__loop polygon'), text: op('.flow__loop text'), flow: op('.flow') };
        return JSON.stringify({ at_t24: at24, at_t26p5: at265,
          pass: at24.polygon === "0" && at24.text === "0" && at265.polygon === "1" && at265.text === "1" });
      })()`);
      sc2 = JSON.parse(sc2);
      if (!sc2.pass) sweep.violations.push(`1440x900 SC2 reveal: ${JSON.stringify(sc2)}`);
    }
    sweep.sizes.push({ size: `${w}x${h}`, consoleErrors: errors, sc4: rows, sc2_reveal_1440x900: sc2 });
    await ctx.close();
  }

  // ---- 10329 row 3: reduced-motion + no-JS static views still show the SC2 loop + SC4 counters ----
  const statics = {};
  for (const [kind, opts] of [["reduced", { viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" }],
                              ["nojs", { viewport: { width: 1440, height: 900 }, javaScriptEnabled: false }]]) {
    const ctx = await browser.newContext(opts);
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: "load" });
    await page.waitForTimeout(kind === "nojs" ? 300 : 600);
    statics[kind] = await page.evaluate(`(() => {
      const vis = (el) => { const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && cs.opacity > 0.05 && cs.visibility !== "hidden" && cs.display !== "none"; };
      const loopPath = document.querySelector('.flow__loop path');
      const pcs = getComputedStyle(loopPath);
      return JSON.stringify({
        countersVisible: vis(document.querySelector('.counters')),
        countersDigits: [...document.querySelectorAll('.counters b')].map(b => b.textContent),
        flowLoopVisible: vis(document.querySelector('.flow__loop')),
        loopPathDasharray: pcs.strokeDasharray, loopPathDashoffset: pcs.strokeDashoffset,
        scrollTriggers: (window.ScrollTrigger && window.ScrollTrigger.getAll) ? window.ScrollTrigger.getAll().length : null,
        jsClass: document.documentElement.className,
      });
    })()`);
    statics[kind] = JSON.parse(statics[kind]);
    const k = statics[kind];
    const okDigits = k.countersDigits.join(",") === "6,2,2,2,3";
    if (!k.countersVisible || !k.flowLoopVisible || k.loopPathDasharray !== "none" || !okDigits || (kind === "reduced" && k.scrollTriggers !== 0))
      sweep.violations.push(`${kind} static view incomplete: ${JSON.stringify(k)}`);
    k.pass = !sweep.violations.some((v) => v.startsWith(kind));
  }
  sweep.static_views = statics;
  sweep.sc4_zero_intersections = sweep.violations.length === 0;
} finally {
  await browser.close();
}
sweep.exit = sweep.sc4_zero_intersections ? 0 : 1;
sweep.eval_equal = geometry.equal;
fs.writeFileSync(OUT_SWEEP, JSON.stringify(sweep, null, 1) + "\n");
fs.writeFileSync(OUT_EVAL, JSON.stringify(geometry, null, 1) + "\n");
console.log(`SC4 sweep: ${sweep.sizes.length} sizes, violations=${sweep.violations.length}` +
  ` | SC2 geometry equal=${geometry.equal}`);
for (const v of sweep.violations.slice(0, 12)) console.log("  VIOLATION " + v);
process.exitCode = sweep.violations.length === 0 && geometry.equal ? 0 : 1;
