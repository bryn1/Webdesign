"""DoD gate for the Hemsidor scroll-design prototype library.

Runs from the .audits out dir; paths are absolute on purpose so pytest works
from any cwd. Structural checks on every prototype + live-HTTP checks against
the port recorded in the repo's PORT file.

GALLERY RULE: BRIEF.md delivers only four real photos (gal-01..04), so a
spec-compliant theme references them as its gallery. Themes 15 and 18 are
photo-free BY BRIEF (research-2.md directions "F1 showcase" #1/#2: illustration-
and type-led), so they carry no photos and must state that inside #galleri.
Note "bild kommer" alone proves nothing: the BRIEF-mandated "Porträtt — bild
kommer" placeholder is in every theme's Om section, so a theme that lost all
its photos would still pass. That is why photo-themes are matched on parsed
<img> srcs, not on copy.
"""
import html.parser
import pathlib
import re
import urllib.request

REPO = pathlib.Path("/home/claudecode/Hemsidor")
OUT = REPO / ".audits" / "202610041341-f6053f16" / "out"
PROTOS = REPO / "prototypes"
ASSETS = PROTOS / "_assets"
REQUIRED_IDS = ["top", "om", "tjanster", "galleri", "boka", "kontakt"]
N_PROTOS = 20
# photo-free by brief; every other theme must ship the four real photos
PHOTO_FREE = {"15-sagan-om-klippet", "18-bara-typsnitt"}
PHOTO_RE = re.compile(r"gal-0[1-4]\.jpeg$")
# honest declaration, checked INSIDE the #galleri section only
PHOTO_FREE_STATEMENT = re.compile(
    r"utan foto|typspecimen|illustration", re.IGNORECASE
)


def proto_dirs():
    return sorted(
        d for d in PROTOS.iterdir()
        if d.is_dir() and not d.name.startswith("_") and (d / "index.html").exists()
    )


class ImgSrc(html.parser.HTMLParser):
    """Collect <img> src values, so copy and comments can never satisfy the check."""

    def __init__(self):
        super().__init__()
        self.srcs = []

    def handle_starttag(self, tag, attrs):
        if tag == "img":
            src = dict(attrs).get("src")
            if src:
                self.srcs.append(src)


def img_srcs(html):
    p = ImgSrc()
    p.feed(html)
    return p.srcs


def galleri_slice(html):
    """Markup from id="galleri" up to the next section, for scope-limited copy checks."""
    start = re.search(r'id="galleri"', html)
    if not start:
        return ""
    nxt = re.compile(r"<section[^>]*id=|</body", re.IGNORECASE).search(html, start.end())
    return html[start.start(): nxt.start() if nxt else len(html)]


def assert_gallery_evidence(d, html):
    if d.name in PHOTO_FREE:
        assert not any(PHOTO_RE.search(s) for s in img_srcs(html)), (
            f"{d.name}: brief says photo-free, but real photos are embedded"
        )
        scope = galleri_slice(html)
        assert scope, f"{d.name}: empty #galleri"
        assert PHOTO_FREE_STATEMENT.search(scope), (
            f"{d.name}: photo-free theme must say so inside #galleri "
            f"(illustrationer/typspecimen/utan foto)"
        )
    else:
        got = {s.split("/")[-1] for s in img_srcs(html) if PHOTO_RE.search(s)}
        assert len(got) >= 4, (
            f"{d.name}: gallery photos missing — found {sorted(got) or 'none'}; "
            f"BRIEF.md requires gal-01..04"
        )


def test_brief_and_assets():
    assert (REPO / "BRIEF.md").exists()
    for n in range(1, 5):
        assert (ASSETS / f"gal-0{n}.jpeg").stat().st_size > 10000


def test_prototypes_exist():
    dirs = proto_dirs()
    assert len(dirs) >= N_PROTOS, f"only {len(dirs)} of {N_PROTOS} prototype dirs"


def test_each_prototype_structure():
    for d in proto_dirs():
        html = (d / "index.html").read_text(encoding="utf-8")
        low = html.lower()
        assert 'lang="sv"' in low, d.name
        for sec in REQUIRED_IDS:
            assert re.search(rf'id="{sec}"', html), f"{d.name}: missing #{sec}"
        assert "tel:+46721554860" in html, d.name
        assert "mailto:" in html.lower(), d.name
        assert "instagram.com/mullers.anny" in html, d.name
        assert_gallery_evidence(d, html)
        # demo honesty: booking is labelled demo/mock somewhere
        assert re.search(r"demo|mock", low), f"{d.name}: booking mock not labelled"


def _serve_root():
    port = (REPO / "PORT").read_text().strip()
    return f"http://192.168.5.231:{port}"


def test_index_page_lists_all_prototypes():
    root = _serve_root()
    with urllib.request.urlopen(root + "/", timeout=10) as r:
        body = r.read().decode("utf-8")
    assert r.status == 200
    for d in proto_dirs():
        assert d.name in body, f"index page missing link to {d.name}"


def test_all_prototypes_served():
    root = _serve_root()
    for d in proto_dirs():
        url = f"{root}/{d.name}/"
        with urllib.request.urlopen(url, timeout=10) as r:
            assert r.status == 200, url
            body = r.read().decode("utf-8")
        assert "<html" in body.lower(), url
        img = f"{root}/_assets/gal-01.jpeg"
        with urllib.request.urlopen(img, timeout=10) as r:
            assert r.status == 200, img
