#!/usr/bin/env python3
"""pytest gate for tools/build-index.py — MC 11003 + its follow-up, the repo-root <site>/ shadow trap.

Doctrine under test: projects/<site>/ is the ONLY source (owner ruling 2026-10-22 09:53:32+02:00,
verbatim: "rec on all and fix the np/, projects/np trap. doctrine is /projects/np"). A root-level
<site>/ page is the generated HOSTING-01 mirror and may only appear on an explicit --host-surface.
The follow-up legs (the three verdict gates on 8c48865) hold the mirror's LIFETIME: it must be
committable without tribal `git add -f`, pruned when its project vanishes or arms LOCAL_ONLY,
unmistakable to scripts (exit codes), and survivable without a browser.

Each test runs the tool against a throwaway fixture repo, so nothing here writes into this repo.
Which file is under test is one env var away — that is how the RED leg is shown against the
pre-change tool (its legs go red: root shadow, stale page, rc=0 on --root, traceback on timeout):

    git show 8c48865^:tools/build-index.py > .tmp/idx-fix/old-build-index.py
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


def _fixture(tmp_path, thumb):
    """A minimal repo: tools/build-index.py (the file under test) + projects/np/prototypes/01-gate.
    thumb=True also pre-creates the thumbnail, so make_thumb answers "kept" and never calls the
    browser; the browser legs use thumb=False on purpose — the shipped fixture pre-seeding a thumb
    was exactly what hid the Chromium coupling (DA: "Fixed in the shipped tests by pre-creating a
    thumb — i.e. the coupling is hidden by the fixture")."""
    (tmp_path / "tools").mkdir()
    shutil.copyfile(TOOL, tmp_path / "tools" / "build-index.py")
    build = tmp_path / "projects" / SITE / "prototypes" / ENTRY
    build.mkdir(parents=True)
    (build / "index.html").write_text("<!doctype html>\n<title>Fixture gate</title>\n", encoding="utf-8")
    if thumb:
        tdir = tmp_path / "thumbs" / SITE
        tdir.mkdir(parents=True)
        (tdir / f"prototypes-{ENTRY}.png").write_bytes(b"\x89PNG")
    return tmp_path


@pytest.fixture
def repo(tmp_path):
    return _fixture(tmp_path, thumb=True)


@pytest.fixture
def repo_no_thumb(tmp_path):
    return _fixture(tmp_path, thumb=False)


def run(repo, *argv, env=None):
    return subprocess.run([sys.executable, str(repo / "tools" / "build-index.py"), *argv],
                          capture_output=True, text=True, timeout=300, env=env)


def load(repo):
    """Import the fixture copy as a module (the module name is ours to pick, so the hyphen in the
    file name is no obstacle). ROOT/PROJECTS are re-pointed at the fixture before anything is called."""
    spec = importlib.util.spec_from_file_location("build_index_under_test", repo / "tools" / "build-index.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    mod.ROOT, mod.PROJECTS = str(repo), str(repo / "projects")
    return mod


def test_default_run_writes_the_site_page_and_no_root_project_shadow(repo):
    """MC 11003: no ordinary invocation leaves a root <site>/ dir. RED pre-change: the legacy
    --root spelling wrote np/ straight away (that retired flag's exit code moved to its own leg)."""
    r = run(repo)
    assert r.returncode == 0, r.stderr
    assert (repo / "_site" / SITE / "index.html").is_file(), "default run lost the _site page"
    assert not (repo / SITE / "index.html").exists(), f"default run created a root {SITE}/ shadow"


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


def test_every_surface_page_is_committable_after_git_add(repo):
    """MC 11003 follow-up (DA P1-A): --host-surface exits 0 and prints the write, while the old
    /*/index.html ignore rule made `git add -A` silently DROP np/index.html on a project's FIRST
    publish. Committability is an assertion now — the escape-hatch knowledge stops being tribal."""
    ignore = TOOL.resolve().parent.parent / ".gitignore"
    if not ignore.is_file():  # a bare `git archive HEAD tools` export carries no .gitignore —
        pytest.skip("no .gitignore alongside the tool — this leg gates the repo's real .gitignore")  # nothing to gate
    shutil.copyfile(ignore, repo / ".gitignore")
    r = run(repo, "--host-surface")
    assert r.returncode == 0, r.stderr
    subprocess.run(["git", "init", "-q", "."], cwd=repo, check=True)
    subprocess.run(["git", "add", "-A"], cwd=repo, check=True)
    staged = subprocess.run(["git", "diff", "--cached", "--name-only"], cwd=repo,
                            capture_output=True, text=True).stdout.split()
    for rel in ("index.html", f"{SITE}/index.html", f"thumbs/{SITE}/prototypes-{ENTRY}.png"):
        assert rel in staged, f"--host-surface wrote {rel} but git add -A dropped it; staged: {staged}"


def test_host_surface_prunes_the_page_of_a_deleted_project(repo):
    """MC 11003 follow-up (DA P1-B): build() prunes stale _site dirs; build_root() now has the same
    loop. RED pre-change: rc=0 and np/index.html STAYS after projects/np is deleted — a root page
    no longer linked from index.html, still public."""
    assert run(repo, "--host-surface").returncode == 0
    assert (repo / SITE / "index.html").is_file()
    shutil.rmtree(repo / "projects" / SITE)
    r = run(repo, "--host-surface")
    assert r.returncode == 0, r.stderr
    assert not (repo / SITE / "index.html").exists(), "stale root page survived the project's deletion"
    assert not (repo / SITE).exists(), "the shadow dir must be gone once its generated page is"
    assert f'href="{SITE}/"' not in (repo / "index.html").read_text(encoding="utf-8")
    assert "pruned stale surface page" in r.stderr


def test_host_surface_prunes_a_stale_page_when_a_marker_arms(repo):
    """The privacy case (DA P1-B, MC 10510): arming projects/np/LOCAL_ONLY must remove the
    previously written root page in the SAME run that removes the card — today the card disappears
    while the page stays, which is precisely what the guard exists to prevent. RED pre-change: the
    page survives the marker."""
    assert run(repo, "--host-surface").returncode == 0
    assert (repo / SITE / "index.html").is_file()
    (repo / "projects" / SITE / "LOCAL_ONLY").write_text("", encoding="utf-8")
    r = run(repo, "--host-surface")
    assert r.returncode == 0, r.stderr
    assert "skipped local-only" in r.stderr
    assert not (repo / SITE / "index.html").exists(), "a LOCAL_ONLY project kept its public page"
    assert f'href="{SITE}/"' not in (repo / "index.html").read_text(encoding="utf-8")


def test_local_only_project_is_skipped_in_every_mode(repo):
    """MC 10510 privacy guard, end-to-end (grep -c LOCAL_ONLY used to be 0 in this file — zero
    coverage while the docs asserted the guard live): with the marker armed NOTHING is written for
    the project — no _site page, no root card, no root page — in a default run or --host-surface,
    and the skip is named on stderr. Arming the fixture marker is the same code path the real
    projects/wedding/LOCAL_ONLY file arms."""
    (repo / "projects" / SITE / "LOCAL_ONLY").write_text("", encoding="utf-8")
    for argv in ([], ["--host-surface"]):
        r = run(repo, *argv)
        assert r.returncode == 0, f"{argv}: {r.stderr}"
        assert "skipped local-only" in r.stderr, argv
        assert not (repo / "_site" / SITE).exists(), f"{argv}: LOCAL_ONLY project reached _site"
        assert not (repo / SITE).exists(), f"{argv}: LOCAL_ONLY project reached the root surface"
        assert not (repo / "_site" / "index.html").is_file() or \
            f'href="{SITE}/"' not in (repo / "_site" / "index.html").read_text(encoding="utf-8")


def test_retired_root_flag_exits_nonzero(repo):
    """MC 11003 follow-up (DA P2-C): --root still writes no root <site>/ page, but it EXITS 2.
    RED pre-change: rc=0 — a retired flag indistinguishable from success to a script or a cron."""
    r = run(repo, "--root")
    assert r.returncode == 2, f"--root exited {r.returncode} — a retired flag must not read as success"
    assert "retired" in r.stderr
    assert not (repo / SITE / "index.html").exists(), "--root wrote a root shadow"


def test_unknown_or_malformed_flags_are_rejected_before_any_write(repo):
    """MC 11003 follow-up (DA P2-C): --root=yes printed NO notice at all and --host-surface=1 was
    silently an ordinary run. RED pre-change: both rc=0 and silent; now every stray token is a
    usage error (exit 2) and nothing at all is written."""
    for argv in (["--root=yes"], ["--host-surface=1"], ["--bogus"]):
        r = run(repo, *argv)
        assert r.returncode == 2, f"{argv} exited {r.returncode}"
        assert "refusing to run" in r.stderr, f"{argv}: {r.stderr}"
        assert not (repo / SITE).exists(), f"{argv} wrote a root shadow"
        assert not (repo / "_site").exists(), f"{argv} wrote _site — a rejected run writes nothing"


def test_host_surface_publishes_the_pages_when_the_browser_is_unavailable(repo_no_thumb):
    """MC 11003 follow-up (DA P2-D): the shipped fixture pre-creating a thumb hid that --host-surface
    hardwired thumbs=True into a hard Chromium dependency. Browser GENUINELY unavailable here
    (no node on PATH, no pre-seeded thumb). RED pre-change: FileNotFoundError traceback, root
    index.html never written, np/index.html left half-open. GREEN: pages written, the thumb failure
    named per file, exit 1 still reports it honestly."""
    env = {k: v for k, v in os.environ.items() if k != "PATH"} | {"PATH": "/nonexistent"}
    r = run(repo_no_thumb, "--host-surface", env=env)
    assert "Traceback" not in r.stderr, r.stderr
    assert (repo_no_thumb / "index.html").is_file(), "the root page was never written"
    page = (repo_no_thumb / SITE / "index.html").read_text(encoding="utf-8")
    assert f"../projects/{SITE}/prototypes/{ENTRY}/" in page and "ingen förhandsvisning" in page
    assert "browser unavailable" in r.stdout, r.stdout
    assert r.returncode == 1, "a failed thumb is still reported, not papered over"


def test_host_surface_survives_a_browser_timeout(repo_no_thumb, monkeypatch):
    """The DA's live crash on 8c48865 was subprocess.TimeoutExpired (slow Chromium) — same per-file
    contract as an absent browser, proven deterministically instead of by a two-minute fake node.
    RED pre-change: TimeoutExpired aborted build_root() mid-write."""
    mod = load(repo_no_thumb)

    class DeadClock:
        TimeoutExpired = subprocess.TimeoutExpired

        @staticmethod
        def run(*args, **kwargs):
            raise subprocess.TimeoutExpired(["node", "screenshot.mjs"], 120)

    monkeypatch.setattr(mod, "subprocess", DeadClock)
    report = mod.build_root(thumbs=True, opt_in=mod.HOST_SURFACE_FLAG)
    assert any("FAILED" in line and "browser timed out" in line for line in report), report
    assert (repo_no_thumb / SITE / "index.html").is_file(), "a slow browser aborted the publish"
    assert (repo_no_thumb / "index.html").is_file()


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
