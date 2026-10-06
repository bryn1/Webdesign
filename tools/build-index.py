#!/usr/bin/env python3
"""Build the browse site for the Webdesign repo (MC 10062.30.1). Deterministic, stdlib only, no model call.

Scans projects/<project>/prototypes/<name>/index.html and projects/<project>/concepts/<name>/index.html and
writes a generated, gitignored _site/:
  _site/index.html                    root index: one card per project with its prototype count
  _site/<project>/index.html          one page per project: title (from <title>), thumbnail, link
  _site/<project>/prototypes -> ../../projects/<project>/prototypes   (relative symlink, so relative assets work)
  _site/<project>/concepts   -> ../../projects/<project>/concepts
  _site/thumbs/<project>/<kind>-<name>.png   thumbnails (only with --thumbs)
_site/ is what the :8090 server serves, so neither .git nor .audits is reachable over HTTP.

With --root it ALSO writes the committed public surface (MC 10088 HOSTING-01) that the vm106
reconciler serves for the static app "webdesign" — these files are tracked, not gitignored:
  index.html (repo root)            browse index: one card per project entry, links RELATIVE
                                   into projects/... only (never .md, tools/, docs/)
  thumbs/<project>/<kind>-<name>.png   committed thumbnails (same naming as _site/thumbs)

Usage: python3 tools/build-index.py [--thumbs] [--force-thumbs] [--root]
  --thumbs        make missing/stale thumbnails with screenshot.mjs (headless Chromium)
  --force-thumbs  remake every thumbnail
  --root          also write repo-root index.html + committed thumbs/ (thumbs made as needed)
"""
import html
import os
import re
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECTS = os.path.join(ROOT, "projects")
SITE = os.path.join(ROOT, "_site")
SHOT = os.path.expanduser("~/.dsh/skills/describe-image/scripts/screenshot.mjs")
KINDS = ("prototypes", "concepts")

CSS = """
:root{--bg:#f6f5f2;--fg:#1f1f1d;--muted:#66655f;--card:#fff;--line:#dedcd5;--accent:#2b5bd7}
@media (prefers-color-scheme:dark){:root{--bg:#161615;--fg:#ecebe6;--muted:#a3a29b;--card:#202020;--line:#353530;--accent:#8fb0ff}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
main{max-width:1100px;margin:0 auto;padding:24px 16px 48px}
h1{font-size:1.7rem;margin:0 0 4px}
h2{font-size:1.15rem;margin:32px 0 12px}
p{margin:0 0 12px}
.muted{color:var(--muted)}
a{color:var(--accent)}
nav{margin-bottom:16px;font-size:.95rem}
ul.grid{list-style:none;padding:0;margin:0;display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(240px,1fr))}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;overflow:hidden;height:100%}
.card a{display:block;color:inherit;text-decoration:none;height:100%}
.card a:hover .name,.card a:focus .name{text-decoration:underline}
.card img,.card .noimg{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;object-position:top;background:var(--line)}
.card .noimg{display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:.85rem}
.card .txt{display:block;padding:10px 12px 12px}
.name{font-weight:600;display:block;word-break:break-word}
.meta{color:var(--muted);font-size:.85rem;display:block;margin-top:2px}
.count{display:block;font-size:2rem;font-weight:700;line-height:1;margin-bottom:4px}
ul.projects{list-style:none;padding:0;margin:0;display:grid;gap:16px;grid-template-columns:repeat(auto-fill,minmax(260px,1fr))}
ul.projects .card .txt{padding:16px}
"""


def title_of(index_html):
    with open(index_html, encoding="utf-8", errors="replace") as fh:
        head = fh.read(65536)
    m = re.search(r"<title[^>]*>(.*?)</title>", head, re.I | re.S)
    return " ".join(html.unescape(m.group(1)).split()) if m else ""


def label_of(entry_dir):
    """First 'Label:' line of SOURCE.md, if any (e.g. 'impeccable lab build')."""
    p = os.path.join(entry_dir, "SOURCE.md")
    if os.path.isfile(p):
        with open(p, encoding="utf-8", errors="replace") as fh:
            for line in fh:
                m = re.match(r"\s*[-*]?\s*\**Label\**:\s*(.+)", line, re.I)
                if m:
                    return m.group(1).strip().strip("*").strip()
    return ""


def spec_summary(project_dir):
    """First prose paragraph of spec.md (joined lines, markdown marks stripped, max ~240 chars)."""
    p = os.path.join(project_dir, "spec.md")
    if not os.path.isfile(p):
        return ""
    para = []
    with open(p, encoding="utf-8", errors="replace") as fh:
        for line in fh:
            s = line.strip()
            if not s:
                if para:
                    break
                continue
            if s.startswith(("#", "|", "-", ">", "`", "*")) and not para:
                continue
            para.append(s)
    text = re.sub(r"[*`_]", "", " ".join(para))
    return text if len(text) <= 240 else text[:237].rsplit(" ", 1)[0] + " …"


def scan():
    projects = []
    for proj in sorted(os.listdir(PROJECTS)) if os.path.isdir(PROJECTS) else []:
        pdir = os.path.join(PROJECTS, proj)
        if proj.startswith((".", "_")) or not os.path.isdir(pdir):
            continue
        entries = []
        for kind in KINDS:
            kdir = os.path.join(pdir, kind)
            if not os.path.isdir(kdir):
                continue
            for name in sorted(os.listdir(kdir)):
                edir = os.path.join(kdir, name)
                idx = os.path.join(edir, "index.html")
                if name.startswith((".", "_")) or not os.path.isfile(idx):
                    continue
                entries.append({"kind": kind, "name": name, "dir": edir, "index": idx,
                                "title": title_of(idx) or name, "label": label_of(edir)})
        projects.append({"name": proj, "dir": pdir, "entries": entries, "summary": spec_summary(pdir)})
    return projects


def page(title, body, head_extra=""):
    return ("<!doctype html>\n<html lang=\"sv\">\n<head>\n<meta charset=\"utf-8\">\n"
            "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n"
            f"<title>{html.escape(title)}</title>\n{head_extra}<style>{CSS}</style>\n</head>\n<body>\n<main>\n{body}</main>\n</body>\n</html>\n")


def thumb_rel(entry):
    return f"{entry['kind']}-{entry['name']}.png"


def make_thumb(entry, dest, force):
    if not force and os.path.isfile(dest) and os.path.getmtime(dest) >= os.path.getmtime(entry["index"]):
        return "kept"
    tmp = dest + ".d"
    shutil.rmtree(tmp, ignore_errors=True)
    r = subprocess.run(["node", SHOT, entry["index"], "--out", tmp, "--widths", "1280", "--height", "800",
                        "--wait-ms", "1500", "--timeout", "40"], capture_output=True, text=True, timeout=120)
    png = os.path.join(tmp, "shot-1280.png")
    if os.path.isfile(png):
        os.replace(png, dest)
        status = f"made (screenshot rc={r.returncode})"
    else:
        status = f"FAILED rc={r.returncode}: {r.stderr.strip()[:200]}"
    shutil.rmtree(tmp, ignore_errors=True)
    return status


def link(path, target):
    if os.path.islink(path) or os.path.exists(path):
        if os.path.islink(path) and os.readlink(path) == target:
            return
        if os.path.isdir(path) and not os.path.islink(path):
            shutil.rmtree(path)
        else:
            os.remove(path)
    os.symlink(target, path)


def build(thumbs=False, force=False):
    projects = scan()
    os.makedirs(SITE, exist_ok=True)
    # drop project dirs that no longer exist (keep thumbs/)
    live = {p["name"] for p in projects} | {"thumbs", "index.html"}
    for n in os.listdir(SITE):
        if n not in live:
            p = os.path.join(SITE, n)
            shutil.rmtree(p) if os.path.isdir(p) and not os.path.islink(p) else os.remove(p)
    report = []
    cards = []
    for p in projects:
        pd = os.path.join(SITE, p["name"])
        os.makedirs(pd, exist_ok=True)
        for kind in KINDS:
            if os.path.isdir(os.path.join(p["dir"], kind)):
                link(os.path.join(pd, kind), f"../../projects/{p['name']}/{kind}")
            elif os.path.lexists(os.path.join(pd, kind)):
                os.remove(os.path.join(pd, kind))
        tdir = os.path.join(SITE, "thumbs", p["name"])
        os.makedirs(tdir, exist_ok=True)
        sections = []
        for kind in KINDS:
            items = [e for e in p["entries"] if e["kind"] == kind]
            if not items:
                continue
            lis = []
            for e in items:
                tfile = os.path.join(tdir, thumb_rel(e))
                if thumbs:
                    report.append(f"{p['name']}/{kind}/{e['name']}: {make_thumb(e, tfile, force)}")
                img = (f"<img src=\"../thumbs/{html.escape(p['name'])}/{html.escape(thumb_rel(e))}\" alt=\"\" loading=\"lazy\">"
                       if os.path.isfile(tfile) else "<span class=\"noimg\">no thumbnail yet</span>")
                meta = html.escape(e["name"]) + (f" · {html.escape(e['label'])}" if e["label"] else "")
                lis.append(f"<li class=\"card\"><a href=\"{kind}/{html.escape(e['name'])}/\">{img}"
                           f"<span class=\"txt\"><span class=\"name\">{html.escape(e['title'])}</span>"
                           f"<span class=\"meta\">{meta}</span></span></a></li>")
            sections.append(f"<h2>{kind.capitalize()} ({len(items)})</h2>\n<ul class=\"grid\">\n" + "\n".join(lis) + "\n</ul>\n")
        n_proto = sum(1 for e in p["entries"] if e["kind"] == "prototypes")
        n_conc = len(p["entries"]) - n_proto
        intro = f"<p class=\"muted\">{html.escape(p['summary'])}</p>\n" if p["summary"] else ""
        body = (f"<nav><a href=\"../\">← All projects</a></nav>\n<h1>{html.escape(p['name'])}</h1>\n{intro}"
                f"<p>{n_proto} prototype{'s' if n_proto != 1 else ''}"
                + (f", {n_conc} concept{'s' if n_conc != 1 else ''}" if n_conc else "") + ". Spec: <code>projects/"
                + html.escape(p["name"]) + "/spec.md</code> in the repo.</p>\n" + "".join(sections))
        with open(os.path.join(pd, "index.html"), "w", encoding="utf-8") as fh:
            fh.write(page(f"{p['name']} — prototypes", body))
        extra = f" + {n_conc} concept{'s' if n_conc != 1 else ''}" if n_conc else ""
        cover = next((os.path.join(tdir, thumb_rel(e)) for e in p["entries"]
                      if e["kind"] == "prototypes" and os.path.isfile(os.path.join(tdir, thumb_rel(e)))), None)
        cover_html = (f"<img src=\"thumbs/{html.escape(p['name'])}/{html.escape(os.path.basename(cover))}\" alt=\"\" loading=\"lazy\">"
                      if cover else "")
        cards.append(f"<li class=\"card\"><a href=\"{html.escape(p['name'])}/\">{cover_html}<span class=\"txt\">"
                     f"<span class=\"count\">{n_proto}</span><span class=\"name\">{html.escape(p['name'])}</span>"
                     f"<span class=\"meta\">prototype{'s' if n_proto != 1 else ''}{extra}</span></span></a></li>")
    total = sum(len(p["entries"]) for p in projects)
    body = ("<h1>Webdesign — prototypes</h1>\n<p class=\"muted\">Every frontend prototype, by project. "
            f"{len(projects)} projects, {total} pages. Source: repo bryn1/Webdesign (<code>projects/</code>).</p>\n"
            "<ul class=\"projects\">\n" + "\n".join(cards) + "\n</ul>\n")
    with open(os.path.join(SITE, "index.html"), "w", encoding="utf-8") as fh:
        fh.write(page("Webdesign — prototypes", body))
    return projects, report


def build_root(thumbs=False, force=False):
    """Write the COMMITTED public browse surface: repo-root index.html + committed thumbs/.

    Every href/src is relative and points ONLY into paths the vm106 mirror serves
    (projects/**, thumbs/**, favicon.ico) — never .md, tools/, docs/, _site/."""
    projects = scan()
    report = []
    troot = os.path.join(ROOT, "thumbs")
    sections = []
    total = sum(len(p["entries"]) for p in projects)
    for p in projects:
        tdir = os.path.join(troot, p["name"])
        os.makedirs(tdir, exist_ok=True)
        lis = []
        for e in p["entries"]:
            tfile = os.path.join(tdir, thumb_rel(e))
            if thumbs:
                report.append(f"{p['name']}/{e['kind']}/{e['name']}: {make_thumb(e, tfile, force)}")
            img = (f"<img src=\"thumbs/{html.escape(p['name'])}/{html.escape(thumb_rel(e))}\" alt=\"\" loading=\"lazy\">"
                   if os.path.isfile(tfile) else "<span class=\"noimg\">ingen förhandsvisning</span>")
            meta = html.escape(e["name"]) + (f" · {html.escape(e['label'])}" if e["label"] else "")
            lis.append(f"<li class=\"card\"><a href=\"projects/{html.escape(p['name'])}/{e['kind']}/{html.escape(e['name'])}/\">{img}"
                       f"<span class=\"txt\"><span class=\"name\">{html.escape(e['title'])}</span>"
                       f"<span class=\"meta\">{meta}</span></span></a></li>")
        n_proto = sum(1 for e in p["entries"] if e["kind"] == "prototypes")
        n_conc = len(p["entries"]) - n_proto
        counts = f"{n_proto} prototyper" + (f", {n_conc} koncept" if n_conc else "")
        sections.append(f"<h2>{html.escape(p['name'])} — {counts}</h2>\n<ul class=\"grid\">\n"
                        + "\n".join(lis) + "\n</ul>\n")
    body = ("<h1>Webdesign — prototyper &amp; koncept</h1>\n<p class=\"muted\">Interaktiva "
            "webbläsarprototyper för en frisörssajt samt portfolio-koncept, byggda i ren HTML, "
            f"CSS och JavaScript. {len(projects)} projekt, {total} sidor.</p>\n"
            + "".join(sections))
    with open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8") as fh:
        fh.write(page("Webdesign — prototyper & koncept", body,
                      head_extra="<link rel=\"icon\" href=\"favicon.ico\">\n"))
    return report


def main(argv):
    force = "--force-thumbs" in argv
    projects, report = build(thumbs=force or "--thumbs" in argv, force=force)
    if "--root" in argv:
        report += build_root(thumbs=True, force=force)
    for p in projects:
        print(f"{p['name']}: {sum(1 for e in p['entries'] if e['kind'] == 'prototypes')} prototypes, "
              f"{sum(1 for e in p['entries'] if e['kind'] == 'concepts')} concepts")
    for line in report:
        print("thumb", line)
    failed = [r for r in report if "FAILED" in r]
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
