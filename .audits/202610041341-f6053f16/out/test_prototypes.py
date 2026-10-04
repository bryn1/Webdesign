"""DoD gate for the Hemsidor scroll-design prototype library.

Runs from the .audits out dir; paths are absolute on purpose so pytest works
from any cwd. Structural checks on every prototype + live-HTTP checks against
the port recorded in the repo's PORT file.
"""
import pathlib
import re
import urllib.request

REPO = pathlib.Path("/home/claudecode/Hemsidor")
OUT = REPO / ".audits" / "202610041341-f6053f16" / "out"
PROTOS = REPO / "prototypes"
ASSETS = PROTOS / "_assets"
REQUIRED_IDS = ["top", "om", "tjanster", "galleri", "boka", "kontakt"]


def proto_dirs():
    return sorted(
        d for d in PROTOS.iterdir()
        if d.is_dir() and not d.name.startswith("_") and (d / "index.html").exists()
    )


def test_brief_and_assets():
    assert (REPO / "BRIEF.md").exists()
    for n in range(1, 5):
        assert (ASSETS / f"gal-0{n}.jpeg").stat().st_size > 10000


def test_ten_prototypes_exist():
    dirs = proto_dirs()
    assert len(dirs) >= 10, f"only {len(dirs)} prototype dirs with index.html"


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
        assert "gal-0" in html, f"{d.name}: gallery images not referenced"
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
