#!/usr/bin/env python3
"""Build the browse site for the Webdesign repo (MC 10062.30.1). Deterministic, stdlib only, no model call.

reason (file hygiene, 400 ceiling, MC 11003 follow-up): deliberately ONE file — build() (_site) and
build_root() (the opt-in public surface) share project_page()/root_card()/make_thumb(); splitting would
fork the card templates, the defect this avoids (monogamy per ARCH-c5 C3; reason moved up per hygiene rule).

Scans projects/<project>/prototypes/<name>/index.html and projects/<project>/concepts/<name>/index.html and
writes a generated, gitignored _site/:
  _site/index.html                    root index: one card per project with its prototype count
  _site/<project>/index.html          one page per project: title (from <title>), thumbnail, link
  _site/<project>/prototypes -> ../../projects/<project>/prototypes   (relative symlink, so relative assets work)
  _site/<project>/concepts   -> ../../projects/<project>/concepts
  _site/thumbs/<project>/<kind>-<name>.png   thumbnails (only with --thumbs)
_site/ is what the :8090 server serves, so neither .git nor .audits is reachable over HTTP.

A project is LOCAL-ONLY (real, private content — MC 10510 privacy guard) iff projects/<project>/LOCAL_ONLY
exists; scan() skips such projects in ALL modes (root cards, per-project page writer, thumbs, _site) and
names each skipped project on stderr, so the guard never runs silently.

With --host-surface it ALSO writes the committed public surface (MC 10088 HOSTING-01; two-level layout
per the owner's BROWSE-V2 ruling, MC 10088.12 — root = one card per project, then /<project>/ lists
the builds) that the vm106 reconciler serves for the static app "webdesign" — these files are tracked,
never gitignored, and must be committable by a plain `git add` (MC 11003 follow-up, DA P1-A):
  index.html (repo root)               one card per project (count + cover thumb), links to <project>/
  <project>/index.html (repo root)     one page per project: prototypes (+ concepts) with thumbs,
                                       nav-back ../, links into ../projects/<project>/...
  thumbs/<project>/<kind>-<name>.png   committed thumbnails (same naming as _site/thumbs)
Like build() prunes _site/, build_root() prunes a stale generated <project>/index.html the moment its
project is gone from the scan (deleted or marked LOCAL_ONLY) — a public page never outlives its card.
If no browser is available, a surface publish still writes the PAGES: make_thumb reports the thumb
failure per file instead of aborting the publish (MC 11003 follow-up, DA P2-D).

CANON IS projects/<site>/ (owner ruling MC 11003, 2026-10-22 09:53:32+02:00, verbatim: "rec on all and
fix the np/, projects/np trap. doctrine is /projects/np"). A root-level <site>/ page is a GENERATED
MIRROR of projects/<site>/, NEVER a source: it duplicates the source folder's name one Tab away and
silently disagrees with it the moment anything under projects/<site>/ changes. So the surface is
opt-in only: --host-surface, passed explicitly, names the projects/<project>/ collision on stderr
BEFORE it writes, and build_root() itself refuses without the flag. --root writes no root <site>/
surface any more (the ordinary _site/ build of the same run still runs).
No invocation of this tool creates a root <site>/ dir unless the caller names the surface flag;
gitignore is deliberately NOT a second mechanism for this (DA P2-A: its only net effect would be
making a stray invisible to git status — the writer's refusal is the enforcement).

Usage: python3 tools/build-index.py [--thumbs] [--force-thumbs] [--host-surface] [--help]
  --thumbs         make missing/stale thumbnails with screenshot.mjs (headless Chromium)
  --force-thumbs   remake every thumbnail
  --host-surface   ALSO write the generated HOSTING-01 mirror — repo-root index.html + the
                   <project>/index.html pages + committed thumbs/ (thumbs made as needed; missing
                   thumbs degrade to a placeholder, a dead browser never aborts the publish).
                   Explicit opt-in only; warns about the projects/<project>/ name collision first.
  --root           RETIRED (MC 11003): writes no root <site>/ surface (the ordinary _site/ build of
                   this run still runs), prints where the writer moved, and EXITS 2 —
                   a retired flag that exits 0 is indistinguishable from success to a script or cron.
                   --host-surface --root together STILL publish the surface and then exit 2: the
                   mirror is written before the retirement is reported, so a script must read the
                   non-zero code as "the flag you passed is gone", never as "nothing was written".
Any other token — an unknown or malformed flag (--root=yes, --host-surface=1) or a bare positional
(host-surface, np) — is REJECTED with exit 2 before anything is written; exit 1 = a thumb step failed
(pages were still written).
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
HOST_SURFACE_FLAG = "--host-surface"
RETIRED_ROOT_FLAG = "--root"
FLAGS = ("--thumbs", "--force-thumbs", HOST_SURFACE_FLAG, RETIRED_ROOT_FLAG)
EXIT_FLAG_ERROR = 2
# Identity of a page THIS writer wrote, for the prune loop: BOTH halves that project_page(public=True)
# emits — the nav-back mark and the page's own <title> stem. The mark alone was the MC 11003 cycle-2
# DA P2-A defect: identity was a 13-character Swedish string, so a hand-written root page quoting
# "← Alla projekt" was deleted, its directory rmdir'd with it. project_page() emits THESE constants, so
# writer and prune predicate cannot drift apart (the same verdict's P4 note).
SURFACE_MARK = "← Alla projekt"
SURFACE_TITLE_STEM = "— prototyper"

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
        if os.path.isfile(os.path.join(pdir, "LOCAL_ONLY")):
            print(f"build-index: skipped local-only project {proj} (projects/{proj}/LOCAL_ONLY)", file=sys.stderr)
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
    # A dead browser is a per-file outcome, never a publish abort (MC 11003 follow-up, DA P2-D):
    # the page is still written, the card degrades to its placeholder, main() still exits 1.
    try:
        r = subprocess.run(["node", SHOT, entry["index"], "--out", tmp, "--widths", "1280", "--height", "800",
                            "--wait-ms", "1500", "--timeout", "40"], capture_output=True, text=True, timeout=120)
        rc, err = r.returncode, r.stderr.strip()[:200]
    except subprocess.TimeoutExpired:
        rc, err = -1, "browser timed out (>120 s)"
    except OSError as exc:
        rc, err = -1, f"browser unavailable ({exc})"
    png = os.path.join(tmp, "shot-1280.png")
    if os.path.isfile(png):
        os.replace(png, dest)
        status = f"made (screenshot rc={rc})"
    else:
        status = f"FAILED rc={rc}: {err}"
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


def project_page(p, tdir, *, thumbs=False, force=False, public=False, report=None):
    """ONE project's browse page (the full HTML string) — shared by build() (_site) and
    build_root() (the committed <project>/ pages, public=True).

    _site variant (public=False): entries link {kind}/<name>/ (symlinks back into projects/),
    English copy, spec-summary intro and the repo spec.md note.
    public variant (public=True): entries link ../projects/<project>/<kind>/<name>/ (the mirror
    serves the real project dirs, no symlinks), Swedish copy, no repo-internal spec references."""
    sections = []
    for kind in KINDS:
        items = [e for e in p["entries"] if e["kind"] == kind]
        if not items:
            continue
        lis = []
        for e in items:
            tfile = os.path.join(tdir, thumb_rel(e))
            if thumbs:
                status = make_thumb(e, tfile, force)
                if report is not None:
                    report.append(f"{p['name']}/{kind}/{e['name']}: {status}")
            if os.path.isfile(tfile):
                img = (f"<img src=\"../thumbs/{html.escape(p['name'])}/{html.escape(thumb_rel(e))}\" alt=\"\" loading=\"lazy\">")
            else:
                img = ("<span class=\"noimg\">ingen förhandsvisning</span>" if public
                       else "<span class=\"noimg\">no thumbnail yet</span>")
            meta = html.escape(e["name"]) + (f" · {html.escape(e['label'])}" if e["label"] else "")
            href = (f"../projects/{html.escape(p['name'])}/{kind}/{html.escape(e['name'])}/" if public
                    else f"{kind}/{html.escape(e['name'])}/")
            lis.append(f"<li class=\"card\"><a href=\"{href}\">{img}"
                       f"<span class=\"txt\"><span class=\"name\">{html.escape(e['title'])}</span>"
                       f"<span class=\"meta\">{meta}</span></span></a></li>")
        heading = ("Prototyper" if kind == "prototypes" else "Koncept") if public else kind.capitalize()
        sections.append(f"<h2>{heading} ({len(items)})</h2>\n<ul class=\"grid\">\n" + "\n".join(lis) + "\n</ul>\n")
    n_proto = sum(1 for e in p["entries"] if e["kind"] == "prototypes")
    n_conc = len(p["entries"]) - n_proto
    if public:
        intro = ""
        counts = f"{n_proto} prototyper" + (f", {n_conc} koncept" if n_conc else "") + "."
        nav = f"<a href=\"../\">{SURFACE_MARK}</a>"
        title = f"{p['name']} {SURFACE_TITLE_STEM} & koncept"
    else:
        intro = f"<p class=\"muted\">{html.escape(p['summary'])}</p>\n" if p["summary"] else ""
        counts = (f"{n_proto} prototype{'s' if n_proto != 1 else ''}"
                  + (f", {n_conc} concept{'s' if n_conc != 1 else ''}" if n_conc else "")
                  + f". Spec: <code>projects/{html.escape(p['name'])}/spec.md</code> in the repo.")
        nav = "<a href=\"../\">← All projects</a>"
        title = f"{p['name']} — prototypes"
    body = (f"<nav>{nav}</nav>\n<h1>{html.escape(p['name'])}</h1>\n{intro}"
            f"<p>{counts}</p>\n" + "".join(sections))
    return page(title, body)


def root_card(p, tdir, *, public=False):
    """The <li> card for one project on a ROOT browse page — shared by both root writers.
    tdir is the project's thumb dir relative-visible as thumbs/<project>/ from the root page."""
    n_proto = sum(1 for e in p["entries"] if e["kind"] == "prototypes")
    n_conc = len(p["entries"]) - n_proto
    cover = next((thumb_rel(e) for e in p["entries"]
                  if e["kind"] == "prototypes" and os.path.isfile(os.path.join(tdir, thumb_rel(e)))), None)
    cover_html = (f"<img src=\"thumbs/{html.escape(p['name'])}/{html.escape(cover)}\" alt=\"\" loading=\"lazy\">"
                  if cover else "")
    if public:
        meta = "prototyp" if n_proto == 1 else "prototyper"
        if n_conc:
            meta += f" + {n_conc} koncept"
    else:
        meta = f"prototype{'s' if n_proto != 1 else ''}" + (f" + {n_conc} concept{'s' if n_conc != 1 else ''}" if n_conc else "")
    return (f"<li class=\"card\"><a href=\"{html.escape(p['name'])}/\">{cover_html}<span class=\"txt\">"
            f"<span class=\"count\">{n_proto}</span><span class=\"name\">{html.escape(p['name'])}</span>"
            f"<span class=\"meta\">{meta}</span></span></a></li>")


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
        with open(os.path.join(pd, "index.html"), "w", encoding="utf-8") as fh:
            fh.write(project_page(p, tdir, thumbs=thumbs, force=force, report=report))
        cards.append(root_card(p, tdir))
    total = sum(len(p["entries"]) for p in projects)
    body = ("<h1>Webdesign — prototypes</h1>\n<p class=\"muted\">Every frontend prototype, by project. "
            f"{len(projects)} projects, {total} pages. Source: repo bryn1/Webdesign (<code>projects/</code>).</p>\n"
            "<ul class=\"projects\">\n" + "\n".join(cards) + "\n</ul>\n")
    with open(os.path.join(SITE, "index.html"), "w", encoding="utf-8") as fh:
        fh.write(page("Webdesign — prototypes", body))
    return projects, report


def build_root(thumbs=False, force=False, opt_in=None):
    """Write the COMMITTED public browse surface (BROWSE-V2 two-level layout, MC 10088.12):
    repo-root index.html = one card per project; <project>/index.html per project = the build
    listing (shared writer with _site); committed thumbs/.

    opt_in must be HOST_SURFACE_FLAG. This writer REFUSES without that explicit opt-in (MC 11003):
    a root <site>/ page is a generated mirror of projects/<site>/, never a source, so it is never
    written as a side effect of an ordinary run.

    Pruning mirrors build() over _site/: a generated <project>/index.html never outlives its card —
    if the project was deleted or a LOCAL_ONLY marker armed, its stale public page is removed, so a
    privacy project can never keep a page on the surface after its card disappears (MC 11003
    follow-up, DA P1-B; MC 10510). A page is removed only when it carries THIS writer's signature —
    SURFACE_MARK and its own "<project> — prototyper" <title> — never merely for quoting the nav-back
    link, which is what deleted a hand-written docs/index.html (cycle-2 DA P2-A).

    NOTE (MC 11003 follow-up, DA P1-C — owner decision pending, deliberately NOT resolved here):
    every href/src is relative, but the card set is scan(), while hosting.yaml's mirror include names
    /index.html + /salong/*.html + /portfolio/*.html only — a page generated for a project outside
    that include (np/, skola/; the tracked root page even links wedding/) links a path the mirror
    does not publish. Widen the include or narrow the cards: repo-vs-served is the owner's call."""
    if opt_in != HOST_SURFACE_FLAG:
        sys.exit(f"build-index: refusing to write the repo-root public surface without {HOST_SURFACE_FLAG} "
                 f"(MC 11003: projects/<site>/ is canon, a root <site>/ page is a generated mirror)")
    projects = scan()
    live = {p["name"] for p in projects}
    for n in sorted(os.listdir(ROOT)):
        d = os.path.join(ROOT, n)
        if n in live or n.startswith((".", "_")) or n in ("projects", "thumbs"):
            continue
        stale = os.path.join(d, "index.html")
        if not os.path.isdir(d) or os.path.islink(d) or not os.path.isfile(stale):
            continue
        with open(stale, encoding="utf-8", errors="replace") as fh:
            head = fh.read(4096)
        # Both halves of the writer's signature, not just the nav string (cycle-2 DA P2-A: identity was
        # a 13-character string, so a hand-written page quoting it was deleted together with its dir).
        if SURFACE_MARK not in head or f"<title>{html.escape(n)} {SURFACE_TITLE_STEM}" not in head:
            continue
        os.remove(stale)
        if not os.listdir(d):
            os.rmdir(d)
        print(f"build-index: pruned stale surface page {n}/index.html — no live project {n}/ "
              f"(deleted or LOCAL_ONLY; its card is gone, so its page goes too)", file=sys.stderr)
    collide = ", ".join(f"{p['name']}/ ↔ projects/{p['name']}/" for p in projects) or "(no projects scanned)"
    print(f"build-index: {HOST_SURFACE_FLAG} — writing the GENERATED HOSTING-01 mirror into the repo root "
          f"(index.html, <project>/index.html, thumbs/). Name collision with the source: {collide}. "
          f"projects/<site>/ is canon (MC 11003); this mirror is never a source and is never read back "
          f"by scan().", file=sys.stderr)
    report = []
    troot = os.path.join(ROOT, "thumbs")
    cards = []
    for p in projects:
        tdir = os.path.join(troot, p["name"])
        os.makedirs(tdir, exist_ok=True)
        pd = os.path.join(ROOT, p["name"])
        os.makedirs(pd, exist_ok=True)
        with open(os.path.join(pd, "index.html"), "w", encoding="utf-8") as fh:
            fh.write(project_page(p, tdir, thumbs=thumbs, force=force, public=True, report=report))
        cards.append(root_card(p, tdir, public=True))
    total = sum(len(p["entries"]) for p in projects)
    body = ("<h1>Webdesign — prototyper &amp; koncept</h1>\n<p class=\"muted\">Interaktiva "
            "webbläsarprototyper för en frisörssajt samt portfolio-koncept, byggda i ren HTML, "
            f"CSS och JavaScript. {len(projects)} projekt, {total} sidor.</p>\n"
            "<ul class=\"projects\">\n" + "\n".join(cards) + "\n</ul>\n")
    with open(os.path.join(ROOT, "index.html"), "w", encoding="utf-8") as fh:
        fh.write(page("Webdesign — prototyper & koncept", body,
                      head_extra="<link rel=\"icon\" href=\"favicon.ico\">\n"))
    return report


def main(argv):
    if "--help" in argv or "-h" in argv:
        print(__doc__.strip())
        return 0
    bad = sorted({a for a in argv if a not in FLAGS})
    if bad:
        for a in bad:
            print(f"build-index: refusing to run: {a} is not a flag of this tool (accepted: --thumbs "
                  f"--force-thumbs {HOST_SURFACE_FLAG} {RETIRED_ROOT_FLAG} (retired) --help). Nothing was written.",
                  file=sys.stderr)
        return EXIT_FLAG_ERROR
    retired = RETIRED_ROOT_FLAG in argv
    if retired:
        print(f"build-index: {RETIRED_ROOT_FLAG} is retired (MC 11003) and writes no root <site>/ surface "
              f"(the ordinary _site/ build of this run still runs) — the generated "
              f"public surface requires the explicit {HOST_SURFACE_FLAG} opt-in "
              f"(projects/<site>/ is canon, the root <site>/ page is a mirror). This run exits "
              f"{EXIT_FLAG_ERROR}: a retired flag must never read as success to a script or cron.", file=sys.stderr)
    force = "--force-thumbs" in argv
    projects, report = build(thumbs=force or "--thumbs" in argv, force=force)
    if HOST_SURFACE_FLAG in argv:
        report += build_root(thumbs=True, force=force, opt_in=HOST_SURFACE_FLAG)
    for p in projects:
        print(f"{p['name']}: {sum(1 for e in p['entries'] if e['kind'] == 'prototypes')} prototypes, "
              f"{sum(1 for e in p['entries'] if e['kind'] == 'concepts')} concepts")
    for line in report:
        print("thumb", line)
    if retired:
        return EXIT_FLAG_ERROR
    failed = [r for r in report if "FAILED" in r]
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
