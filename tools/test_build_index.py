#!/usr/bin/env python3
"""pytest gate for tools/build-index.py — MC 11003, the repo-root <site>/ shadow trap.

Doctrine under test: projects/<site>/ is the ONLY source (owner ruling 2026-10-22 09:53:32+02:00,
verbatim: "rec on all and fix the np/, projects/np trap. doctrine is /projects/np"). A root-level
<site>/ page is the generated HOSTING-01 mirror and may only appear on an explicit --host-surface.

Each test runs the tool against a throwaway fixture repo, so nothing here writes into this repo.
Which file is under test is one env var away — that is how the RED leg is shown against the
pre-change tool:

    git show HEAD~1:tools/build-index.py > .tmp/idx-fix/old-build-index.py
    BUILD_INDEX_TOOL=.tmp/idx-fix/old-build-index.py python3 -m pytest -q tools/test_build_index.py
"""
import importlib.util
import os
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

TOOL = Path(os.environ.get("BUILD_INDEX_TOOL") or Path(__file__).with_name("build-index.py"))
LEGACY = os.environ.get("BUILD_INDEX_LEGACY")  # optional pre-change copy, for the byte-parity leg
SITE = "np"                                    # the fixture project, named after the site the ruling names
ENTRY = "01-gate"


@pytest.fixture
def repo(tmp_path):
    """A minimal repo: tools/build-index.py (the file under test) + projects/np/prototypes/01-gate/
    plus its already-committed thumbnail, so the thumb step reports "kept" and never calls Chromium."""
    (tmp_path / "tools").mkdir()
    shutil.copyfile(TOOL, tmp_path / "tools" / "build-index.py")
    build = tmp_path / "projects" / SITE / "prototypes" / ENTRY
    build.mkdir(parents=True)
    (build / "index.html").write_text("<!doctype html>\n<title>Fixture gate</title>\n", encoding="utf-8")
    thumb = tmp_path / "thumbs" / SITE
    thumb.mkdir(parents=True)
    (thumb / f"prototypes-{ENTRY}.png").write_bytes(b"\x89PNG")
    return tmp_path


def run(repo, *argv):
    return subprocess.run([sys.executable, str(repo / "tools" / "build-index.py"), *argv],
                          capture_output=True, text=True, timeout=300)


def load(repo):
    """Import the fixture copy as a module (the module name is ours to pick, so the hyphen in the
    file name is no obstacle). ROOT/PROJECTS are re-pointed at the fixture before anything is called."""
    spec = importlib.util.spec_from_file_location("build_index_under_test", repo / "tools" / "build-index.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    mod.ROOT, mod.PROJECTS = str(repo), str(repo / "projects")
    return mod


def test_default_run_writes_the_site_page_and_no_root_project_shadow(repo):
    """MC 11003: no ordinary invocation leaves a root <site>/ dir — not the plain default run, and
    not the legacy --root spelling that used to write it. RED pre-change: --root created np/."""
    for argv in ([], ["--root"]):
        r = run(repo, *argv)
        assert r.returncode == 0, r.stderr
        assert (repo / "_site" / SITE / "index.html").is_file(), f"{argv} lost the _site page"
        assert not (repo / SITE / "index.html").exists(), f"{argv} created a root {SITE}/ shadow"


def test_host_surface_writes_the_mirror_and_names_the_collision(repo):
    """The explicit flag still publishes HOSTING-01 (DoD: same files, intentional publish works),
    and it says out loud that <site>/ collides with the source projects/<site>/."""
    r = run(repo, "--host-surface")
    assert r.returncode == 0, r.stderr
    page = (repo / SITE / "index.html").read_text(encoding="utf-8")
    assert f"../projects/{SITE}/prototypes/{ENTRY}/" in page
    assert "thumbs/" in page and "Alla projekt" in page
    assert "--host-surface" in r.stderr and f"projects/{SITE}" in r.stderr


def test_root_shadow_is_never_read_back_as_source(repo):
    """A stale root <site>/ page must not become what the next scan reads, and a default run does
    not harvest it either: the _site page is built from projects/np/ or the run fails."""
    shadow = repo / SITE / "index.html"
    shadow.parent.mkdir(parents=True)
    shadow.write_text("<!doctype html>\n<title>STALE SHADOW</title>\n", encoding="utf-8")
    r = run(repo)
    assert r.returncode == 0, r.stderr
    page = (repo / "_site" / SITE / "index.html").read_text(encoding="utf-8")
    assert "Fixture gate" in page and "STALE SHADOW" not in page
    assert "STALE SHADOW" in shadow.read_text(encoding="utf-8")


def test_surface_writer_refuses_without_the_explicit_opt_in(repo):
    """The guard sits in the writer, not only in main(): called without the flag it exits non-zero
    and writes nothing. RED pre-change: build_root() took no opt-in and wrote np/ straight away."""
    mod = load(repo)
    with pytest.raises(SystemExit) as gone:
        mod.build_root()
    assert "refusing" in str(gone.value)
    assert not (repo / SITE).exists()
    mod.build_root(opt_in=mod.HOST_SURFACE_FLAG)
    assert (repo / SITE / "index.html").is_file()


@pytest.mark.skipif(not LEGACY, reason="set BUILD_INDEX_LEGACY=<copy of the pre-change tool> for the parity leg")
def test_host_surface_writes_the_bytes_the_legacy_root_writer_wrote(repo, tmp_path):
    """--host-surface is a gate on the surface, not a rewrite of it: the same page bytes as the
    retired --root writer, so an intentional publish still produces the mirrored surface."""
    r = run(repo, "--host-surface")
    assert r.returncode == 0, r.stderr
    legacy = tmp_path / "legacy"
    (legacy / "tools").mkdir(parents=True)
    shutil.copytree(repo / "projects", legacy / "projects")
    shutil.copytree(repo / "thumbs", legacy / "thumbs")
    shutil.copyfile(LEGACY, legacy / "tools" / "build-index.py")
    old = run(legacy, "--root")
    assert old.returncode == 0, old.stderr
    for rel in (f"{SITE}/index.html", "index.html"):
        assert (repo / rel).read_bytes() == (legacy / rel).read_bytes(), rel
