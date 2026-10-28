#!/usr/bin/env python3
"""The paths the docs promised and the committed gate never RAN (MC 11003 cycle-6 fix4).

Split by concern (coding-discipline; the DoD names the split): tools/test_build_index.py holds the
mirror LIFETIME + prune predicate + privacy/encoding gates — the legs docs/ARCHITECTURE.md §8's
mechanism row points at stays there. THIS module holds the staged repair package's coverage legs
(TEST-verdict-c6 mutants m_help…m_wingrow): flags no leg invoked, the scan class no fixture ever
built, the `_site` prune beside the root one, and the ceiling sentence of the ONE head window. Each
leg is green on the committed tool and RED on its own one-line mutant (exact red sets in
.audits/202610220807-fbe3cf20/out/.tmp/fix7/logs/). NOT ported: the staged package's globen (F,F)
plant — docs/ARCHITECTURE.md's finding and mutant m_fforeign describe the SAME rule as the main
module's test_host_surface_never_prunes_a_page_the_writer_did_not_write, whose plant was reworked to
carry NEITHER half; one leg covers both findings, so a second plant would assert nothing new.

Same machinery and RED-proof recipe as tools/test_build_index.py's module docstring (one recipe, one
home): point BUILD_INDEX_TOOL at a copy, run `python3 -m pytest -q tools/` to gate both modules.
"""
import os
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

TOOL = Path(os.environ.get("BUILD_INDEX_TOOL") or Path(__file__).with_name("build-index.py"))
SITE, ENTRY = "np", "01-gate"
NO_BROWSER = {k: v for k, v in os.environ.items() if k != "PATH"} | {"PATH": "/nonexistent"}


def _repo(tmp_path, concepts=False, thumb=True):
    """One fixture shape, one code path (the main module's _fixture is its file's; this package was
    staged as a self-contained kit and ports as one)."""
    (tmp_path / "tools").mkdir()
    shutil.copyfile(TOOL, tmp_path / "tools" / "build-index.py")
    build = tmp_path / "projects" / SITE / "prototypes" / ENTRY
    build.mkdir(parents=True)
    (build / "index.html").write_text("<!doctype html>\n<title>Fixture gate</title>\n", encoding="utf-8")
    if concepts:
        c = tmp_path / "projects" / SITE / "concepts" / "cold"
        c.mkdir(parents=True)
        (c / "index.html").write_text("<!doctype html>\n<title>Cold concept</title>\n", encoding="utf-8")
    if thumb:
        tdir = tmp_path / "thumbs" / SITE
        tdir.mkdir(parents=True)
        (tdir / f"prototypes-{ENTRY}.png").write_bytes(b"\x89PNG")
    return tmp_path


@pytest.fixture
def repo(tmp_path):
    return _repo(tmp_path)


@pytest.fixture
def repo_concepts(tmp_path):
    return _repo(tmp_path, concepts=True)


def run(repo, *argv, env=None):
    return subprocess.run([sys.executable, str(repo / "tools" / "build-index.py"), *argv],
                          capture_output=True, text=True, timeout=300, env=env)


def test_help_flag_prints_the_docstring_and_exits_zero(repo):
    """Cycle-6 TEST F7 (m_help): the Usage line documents --help and NO leg ran it — deleting the
    --help branch kept the suite green while the documented flag died in the shell."""
    r = run(repo, "--help")
    assert r.returncode == 0, f"--help exited {r.returncode}: {r.stderr}"
    assert "Usage: python3 tools/build-index.py" in r.stdout, r.stdout[:300]


def test_thumbs_flag_actually_makes_the_thumb(tmp_path):
    """Cycle-6 TEST F5 (m_thumbs): --thumbs on the Usage line reached no assertion; `thumbs=force`
    (never attempt) stayed green. NO_BROWSER forces the ATTEMPT: the honest failure names it."""
    repo = _repo(tmp_path, thumb=False)
    r = run(repo, "--thumbs", env=NO_BROWSER)
    assert r.returncode == 1, f"--thumbs reached no thumb step at all (rc {r.returncode}, stdout {r.stdout!r})"
    assert "browser unavailable" in r.stdout, r.stdout


def test_force_thumbs_remakes_a_fresh_thumb(tmp_path):
    """Cycle-6 TEST F6 (m_force): --force-thumbs is documented to remake EVERY thumbnail;
    force=False stayed green — a fresh thumb was left alone and the flag was a lie."""
    repo = _repo(tmp_path, thumb=False)
    assert run(repo).returncode == 0                      # _site built; no thumb attempted (no flag)
    fresh = repo / "_site" / "thumbs" / SITE
    fresh.mkdir(parents=True, exist_ok=True)
    (fresh / f"prototypes-{ENTRY}.png").write_bytes(b"\x89PNG")
    r = run(repo, "--force-thumbs", env=NO_BROWSER)
    assert r.returncode == 1, f"a fresh thumb was left alone under --force-thumbs (rc {r.returncode})"
    assert "browser unavailable" in r.stdout, r.stdout


def test_concepts_are_scanned_and_published(repo_concepts):
    """Cycle-6 TEST F3 (m_concepts): no fixture ever created concepts/, so scan() could drop the
    whole class — and the second half of KINDS — from cards, mirror and _site, rc 0, silent."""
    assert run(repo_concepts, "--host-surface").returncode == 0
    page = (repo_concepts / SITE / "index.html").read_text(encoding="utf-8")
    assert f"../projects/{SITE}/concepts/cold/" in page, "a concept build vanished from the public surface"
    assert "Koncept (1)" in page, page[:400]


def test_stale_site_kind_symlink_dies_with_its_kind_dir(repo_concepts):
    """Cycle-6 TEST F4 (m_linkprune): no leg deleted a kind dir after a build — the mutant kept
    serving deleted concepts content through the stale `_site` symlink forever, rc 0."""
    assert run(repo_concepts).returncode == 0
    assert (repo_concepts / "_site" / SITE / "concepts").is_symlink()
    shutil.rmtree(repo_concepts / "projects" / SITE / "concepts")
    assert run(repo_concepts).returncode == 0
    assert not (repo_concepts / "_site" / SITE / "concepts").exists() and \
        not (repo_concepts / "_site" / SITE / "concepts").is_symlink(), \
        "deleted kind still reachable through its _site symlink on the :8090 server"


def test_default_run_prunes_the_site_page_of_a_deleted_project(repo):
    """Cycle-6 TEST F2 (m_siteprune): build()'s OWN _site prune — promised beside the root one —
    had zero legs; the root prune all. Deleting the mutant's loop left a deleted project serving
    its page from _site forever, rc 0."""
    assert run(repo).returncode == 0
    assert (repo / "_site" / SITE / "index.html").is_file()
    shutil.rmtree(repo / "projects" / SITE)
    assert run(repo).returncode == 0
    assert not (repo / "_site" / SITE).exists(), "a deleted project still serves its page from _site"


def test_the_writers_own_title_is_recognised_whatever_the_tag_case(repo):
    """Cycle-6 TEST F9-class (m_recase): re.I in title_from is load-bearing for own_title — dropping
    it made the writer's OWN re-cased page foreign, silently PRUNE-surviving; the suite never typed
    a title tag in another case."""
    assert run(repo, "--host-surface").returncode == 0
    stale = repo / SITE / "index.html"
    page = stale.read_text(encoding="utf-8")
    upper = page.replace("<title>", "<TiTlE>", 1).replace("</title>", "</TiTlE>", 1)
    assert upper != page, "fixture no longer re-cases the tag — find the title literal"
    stale.write_text(upper, encoding="utf-8")
    shutil.rmtree(repo / "projects" / SITE)
    r = run(repo, "--host-surface")
    assert r.returncode == 0, r.stderr
    assert not stale.is_file(), "the writer's own stale page escaped the prune over <title> casing"
    assert "pruned stale surface page" in r.stderr, r.stderr


def test_a_page_hiding_both_halves_past_the_window_is_kept_in_silence(repo):
    """Cycle-6 TEST F9 (m_wingrow), the CEILING twin of the main module's floor leg
    (test_host_surface_still_sees_a_mark…): a page whose BOTH halves sit past 65 536 characters is a
    silent foreign keep, rc 0, under a project that is GONE (under an armed LOCAL_ONLY marker the
    neither-half keep is loud + exit 3 — the encoding legs). HEAD_CHARS=100000 PRUNES this page and
    reddens this leg; together the two legs pin the constant the docs bound their promise to."""
    assert run(repo, "--host-surface").returncode == 0
    stale = repo / SITE / "index.html"
    padded = "<!doctype html>\n<!-- " + "p" * 70000 + " -->\n" + stale.read_text(encoding="utf-8")
    stale.write_text(padded, encoding="utf-8")
    shutil.rmtree(repo / "projects" / SITE)               # card gone; the loop must still SEE the page
    r = run(repo, "--host-surface")
    assert r.returncode == 0, r.stderr
    assert stale.is_file(), "a page outside the window was PRUNED — the documented ceiling is a lie"
    assert "KEPT" not in r.stderr and "pruned stale surface page" not in r.stderr, r.stderr
