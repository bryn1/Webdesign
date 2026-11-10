#!/usr/bin/env node
// visual-changelog.mjs — same-viewpoint screenshot diff for ONE prototype folder (MC 12355 item 5a).
// Browser capture is NEVER re-implemented here: this file serves, organises and diffs, and delegates
// every capture to the pinned fleet script ~/.dsh/skills/describe-image/scripts/screenshot.mjs (which
// itself loads the dsh provider's playwright-core). Serving follows workflow-webdesign quality-gate.sh:
// the prototype's PARENT goes on a free 127.0.0.1 port via `python3 -I -m http.server` so ../_assets
// resolves exactly as on :8090; the server is killed by PID on exit, never pkill. No network beyond
// 127.0.0.1.
//
// Usage: node tools/visual-changelog.mjs <prototype-dir> [--widths 1440,375]
//   <prototype-dir>  a folder with index.html (e.g. projects/<site>/prototypes/<NN-name>).
//   Output goes to <repo>/.audits/changelog/<prototype-name>/<UTC>/ (repo root = the folder above
//   tools/, on this host /home/claudecode/Hemsidor): shot-<width>.png per width (screenshot.mjs's
//   own naming), console-errors.json, report.json (the full capture report), http.log.
//   stdout: a per-width line `  <width>: first|new|unchanged|changed ...` diffed against the latest
//   previous run dir (UTC names sort lexicographically), plus the error tally.
// Exit: 0 captured — console errors do NOT redden a changelog, it is a recorder; quality-gate.sh judges |
//       2 navigation failed (no shots) | 3 capture script / playwright / chromium missing | 64 usage.
// Known ceiling: byte equality is exact, so an animated page reports changed every run; the upgrade
// path is a settle/animation-free mode in screenshot.mjs, not a second capture script.
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const CAPTURE = process.env.SCREENSHOT_MJS
  || path.join(os.homedir(), ".dsh/skills/describe-image/scripts/screenshot.mjs");
const usageExit = () => { console.error("usage: visual-changelog.mjs <prototype-dir> [--widths 1440,375]"); process.exit(64); };

function parseArgs(argv) {
  const a = { widths: [1440, 375] };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (k === "--widths") { if (++i >= argv.length) usageExit(); a.widths = argv[i].split(",").map(Number).filter((n) => Number.isInteger(n) && n > 0); }
    else if (k === "-h" || k === "--help") { console.log(fs.readFileSync(new URL(import.meta.url), "utf8").split("\nimport ")[0]); process.exit(0); }
    else if (k.startsWith("-")) { console.error(`unknown option ${k}`); usageExit(); }
    else rest.push(k);
  }
  if (rest.length !== 1 || !a.widths.length) usageExit();
  return { ...a, dir: path.resolve(rest[0]) };
}

function freePort() { // same shape as quality-gate.sh's python socket bind(("127.0.0.1",0)) probe
  return new Promise((res, rej) => {
    const s = net.createServer();
    s.on("error", rej).listen(0, "127.0.0.1", () => { const p = s.address().port; s.close(() => res(p)); });
  });
}

function waitReady(url) { // quality-gate.sh polls with curl; same patience, node http
  return new Promise((res, rej) => {
    let tries = 0;
    const tick = () => http.get(url, (r) => { r.resume(); res(); }).on("error", () => {
      if (++tries > 50) rej(new Error(`server did not answer ${url} within 10 s`)); else setTimeout(tick, 200);
    });
    tick();
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { dir } = args;
  if (!fs.statSync(dir, { throwIfNoEntry: false })?.isDirectory()) { console.error(`no such dir: ${dir}`); process.exit(64); }
  if (!fs.existsSync(path.join(dir, "index.html"))) { console.error(`${dir} has no index.html`); process.exit(64); }
  if (!fs.existsSync(CAPTURE)) { console.error(`BLOCKED: capture script missing: ${CAPTURE} (pinned fleet script; do not install a second one)`); process.exit(3); }

  const name = path.basename(dir);
  const baseDir = path.join(REPO_ROOT, ".audits/changelog", name);
  const prevRun = fs.existsSync(baseDir) && fs.readdirSync(baseDir, { withFileTypes: true })
    .filter((e) => e.isDirectory()).map((e) => e.name).sort().pop() || null;
  let stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  while (fs.existsSync(path.join(baseDir, stamp))) stamp += "-r"; // same-second collision guard
  const runDir = path.join(baseDir, stamp);
  fs.mkdirSync(runDir, { recursive: true });

  const root = path.dirname(dir);
  const port = await freePort();
  const url = `http://127.0.0.1:${port}/${name}/`;
  const logFd = fs.openSync(path.join(runDir, "http.log"), "w"); // one fd for both streams, as quality-gate's `> http.log 2>&1`
  const srv = spawn("python3", ["-I", "-m", "http.server", String(port), "--bind", "127.0.0.1", "--directory", root],
    { stdio: ["ignore", logFd, logFd] });
  process.on("exit", () => { try { srv.kill(); } catch {} });
  try {
    await waitReady(url);
  } catch (e) {
    console.error(`BLOCKED: ${e.message}`);
    process.exit(2);
  }

  const cap = spawnSync("node", [CAPTURE, url, "--out", runDir, "--widths", args.widths.join(",")],
    { encoding: "utf8", timeout: 180_000, maxBuffer: 16 * 1024 * 1024 });
  if (cap.stderr) process.stderr.write(cap.stderr);
  if (cap.status === 3 || cap.error) { console.error("BLOCKED: playwright/chromium unavailable (see stderr above)"); process.exit(3); }
  let report;
  try { report = JSON.parse(cap.stdout); }
  catch { console.error("BLOCKED: capture script returned no JSON"); process.exit(3); }
  const prevDir = prevRun ? path.join(baseDir, prevRun) : null;

  fs.writeFileSync(path.join(runDir, "report.json"), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(runDir, "console-errors.json"),
    JSON.stringify({ console_errors: report.console_errors, page_errors: report.page_errors, failed_requests: report.failed_requests }, null, 2));

  console.log(`visual-changelog: ${dir} (served as ${url})`);
  console.log(`run: ${runDir}`);
  console.log(`previous run: ${prevRun || "none (first run for " + name + ")"}`);
  for (const width of args.widths) {
    const cur = path.join(runDir, `shot-${width}.png`);
    if (!fs.existsSync(cur)) { console.log(`  ${width}: missing (capture failed)`); continue; }
    const size = fs.statSync(cur).size;
    if (!prevDir) { console.log(`  ${width}: first (${size} bytes)`); continue; }
    const prev = path.join(prevDir, `shot-${width}.png`);
    if (!fs.existsSync(prev)) { console.log(`  ${width}: new (${size} bytes, no ${width}px shot in ${prevRun})`); continue; }
    const same = Buffer.compare(fs.readFileSync(prev), fs.readFileSync(cur)) === 0;
    console.log(same ? `  ${width}: unchanged (${size} bytes)`
                     : `  ${width}: changed (${fs.statSync(prev).size} -> ${size} bytes)`);
  }
  const errs = report.console_errors.length + report.page_errors.length + report.failed_requests.length;
  console.log(`capture errors: console ${report.console_errors.length}, page ${report.page_errors.length}, ` +
    `failed requests ${report.failed_requests.length} -> ${path.join(runDir, "console-errors.json")}`);
  process.exit(cap.status === 2 ? 2 : 0); // 1 = errors-or-overflow is recorded, not a changelog failure
}

main().catch((e) => { console.error(`visual-changelog: ${e.message}`); process.exit(3); });
