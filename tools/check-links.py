#!/usr/bin/env python3
"""Crawl the browse site over HTTP and check every local reference (MC 10062.30.1). Stdlib only.

From BASE it follows every same-host link to an HTML page, and on each page requests every local
reference: <a href>, <link href>, <script src>, <img src/srcset>, <source src/srcset>, <video poster>,
inline style url(...), CSS url(...)/@import (resolved against the CSS file, recursively), and
JS string literals that name an asset file (resolved against the page that loads the script).
External (other host, data:, mailto:, tel:, javascript:) references are counted, not fetched.
It also asserts that the forbidden paths (/.git/, /.audits/, ...) answer 404.

Usage: python3 tools/check-links.py http://127.0.0.1:8090/ [--json OUT]
Exit 0 = 0 broken and all forbidden paths 404; 1 otherwise.
"""
import html.parser
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

FORBIDDEN = ["/.git/", "/.git/HEAD", "/.git/config", "/.audits/", "/projects/", "/.gitignore", "/tools/"]
ASSET_RE = re.compile(r"""["'`]([^"'`\s<>()]+?\.(?:png|jpe?g|webp|avif|gif|svg|woff2?|ttf|otf|css|mp4|webm|json))["'`]""", re.I)
CSS_URL_RE_RAW = re.compile(r"""url\(\s*(?:"([^"]*)"|'([^']*)'|([^)'"]*))\s*\)""", re.I)


class _CssUrls:
    """url(...) refs; a quoted data: URI is consumed whole, so a url() nested inside it is not a ref."""
    @staticmethod
    def findall(text):
        return [next(g for g in m if g is not None and g != "") if any(m) else "" for m in CSS_URL_RE_RAW.findall(text)]


CSS_URL_RE = _CssUrls
CSS_IMPORT_RE = re.compile(r"""@import\s+(?:url\()?\s*['"]([^'"]+)['"]""", re.I)


class Refs(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links, self.assets, self.scripts, self.styles = [], [], [], []
        self.in_style = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "a" and a.get("href"):
            self.links.append(a["href"])
        if tag == "link" and a.get("href"):
            rel = (a.get("rel") or "").lower()
            if "preconnect" in rel or "dns-prefetch" in rel:
                return
            (self.styles if "stylesheet" in rel else self.assets).append(a["href"])
        if tag == "script" and a.get("src"):
            self.scripts.append(a["src"])
        for k in ("src", "poster", "data-src"):
            if tag in ("img", "source", "video", "audio", "iframe", "embed", "track", "input") and a.get(k):
                self.assets.append(a[k])
        for k in ("srcset", "data-srcset"):
            if a.get(k):
                self.assets += [p.strip().split()[0] for p in a[k].split(",") if p.strip()]
        if a.get("style"):
            self.assets += CSS_URL_RE.findall(a["style"])
        if tag == "style":
            self.in_style = True

    def handle_endtag(self, tag):
        if tag == "style":
            self.in_style = False

    def handle_data(self, data):
        if self.in_style:
            self.assets += CSS_URL_RE.findall(data)


def fetch(url, cache):
    if url in cache:
        return cache[url]
    try:
        with urllib.request.urlopen(url, timeout=20) as r:
            res = (r.status, r.headers.get("Content-Type", ""), r.read())
    except urllib.error.HTTPError as e:
        res = (e.code, "", b"")
    except Exception as e:  # noqa: BLE001
        res = (0, str(e), b"")
    cache[url] = res
    return res


def local(base_host, url):
    p = urllib.parse.urlsplit(url)
    return p.scheme in ("http", "https") and p.netloc == base_host


def skip(ref):
    r = ref.strip()
    return (not r or r.startswith(("#", "data:", "mailto:", "tel:", "javascript:", "blob:", "about:"))
            or "${" in r or "{{" in r)


def main(argv):
    base = argv[0]
    out = argv[argv.index("--json") + 1] if "--json" in argv else None
    host = urllib.parse.urlsplit(base).netloc
    cache, broken, checked, external = {}, [], set(), set()
    pages, queue, seen_css, seen_js = [], [base], set(), set()

    def check(ref, against, kind, origin):
        if skip(ref):
            return None
        url = urllib.parse.urldefrag(urllib.parse.urljoin(against, ref.strip()))[0]
        if not local(host, url):
            external.add(url)
            return None
        status, ctype, body = fetch(url, cache)
        checked.add(url)
        if status != 200:
            broken.append({"url": url, "status": status, "kind": kind, "ref": ref, "from": origin})
            return None
        return url, ctype, body

    def css(url, body, origin):
        if url in seen_css:
            return
        seen_css.add(url)
        text = body.decode("utf-8", "replace")
        for ref in CSS_IMPORT_RE.findall(text):
            r = check(ref, url, "css-import", url)
            if r:
                css(r[0], r[2], url)
        for ref in CSS_URL_RE.findall(text):
            check(ref, url, "css-url", url)

    while queue:
        page = queue.pop(0)
        if page in pages:
            continue
        r = check(page, page, "page", "crawl")
        if not r:
            continue
        url, ctype, body = r
        if "html" not in ctype:
            continue
        pages.append(url)
        p = Refs()
        p.feed(body.decode("utf-8", "replace"))
        for ref in p.assets:
            check(ref, url, "asset", url)
        for ref in p.styles:
            rr = check(ref, url, "stylesheet", url)
            if rr:
                css(rr[0], rr[2], url)
        for ref in p.scripts:
            rr = check(ref, url, "script", url)
            if rr and (rr[0], url) not in seen_js:
                seen_js.add((rr[0], url))
                for lit in ASSET_RE.findall(rr[2].decode("utf-8", "replace")):
                    # only relative paths with a directory part (e.g. images/x.jpg, ../_assets/y.png)
                    if lit.startswith(("./", "../")) or re.match(r"^[\w-]+(/[\w.-]+)+$", lit):
                        check(lit, url, "js-literal", rr[0])
        for ref in p.links:
            if skip(ref):
                continue
            nxt = urllib.parse.urldefrag(urllib.parse.urljoin(url, ref.strip()))[0]
            if not local(host, nxt):
                external.add(nxt)
                continue
            if nxt not in pages and nxt not in queue:
                queue.append(nxt)

    forbidden = []
    for path in FORBIDDEN:
        status = fetch(urllib.parse.urljoin(base, path), {})[0]
        forbidden.append({"path": path, "status": status, "ok": status == 404})
    result = {"base": base, "pages": len(pages), "local_refs_checked": len(checked), "broken": broken,
              "external_skipped": len(external), "forbidden": forbidden, "page_list": pages}
    if out:
        with open(out, "w") as fh:
            json.dump(result, fh, indent=1)
    print(f"base {base}: {len(pages)} pages crawled, {len(checked)} distinct local URLs checked, "
          f"{len(broken)} broken, {len(external)} external skipped")
    for b in broken[:50]:
        print(f"  BROKEN {b['status']} {b['kind']} {b['url']}  (ref {b['ref']!r} from {b['from']})")
    for f in forbidden:
        print(f"  forbidden {f['path']} -> {f['status']} {'OK' if f['ok'] else 'EXPOSED'}")
    return 0 if not broken and all(f["ok"] for f in forbidden) else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
