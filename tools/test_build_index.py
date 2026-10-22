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
pre-change tool (its legs go red: root shadow, stale page, rc=0 on --root, traceback on timeout).
The committability leg gates the PAIR (writer, the .gitignore of the repo that writer came from), so
extract BOTH halves next to each other; a BUILD_INDEX_TOOL copy with no .gitignore beside it FAILS
that leg instead of skipping it (MC 11003 cycle-2 DA P3-A — a leg the recipe silently drops is not a
red proof):

    mkdir -p .tmp/idx-fix/tools
    git show fde3a26^:tools/build-index.py > .tmp/idx-fix/tools/build-index.py
    git show fde3a26^:.gitignore           > .tmp/idx-fix/.gitignore
    BUILD_INDEX_TOOL=.tmp/idx-fix/tools/build-index.py python3 -m pytest -q tools/test_build_index.py

The parity leg's env var names a PRE-change copy too, and the sha is the literal (cycle-3 TEST W3 —
"`8c48865^` works, `8c48865` does not" was tribal knowledge): BUILD_INDEX_LEGACY=$(git show
8c48865^:tools/build-index.py). Point it at 8c48865's own copy and that leg fails with
FileNotFoundError on legacy/np/index.html — that commit's writer is the post-change one.
"""
import importlib.util
import os
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

TOOL = Path(os.environ.get("BUILD_INDEX_TOOL") or Path(__file__).with_name("build-index.py"))
TOOL_OVERRIDDEN = bool(os.environ.get("BUILD_INDEX_TOOL"))  # set => this run is a RED proof, not a gate
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
    if not ignore.is_file():
        # What this leg gates is the PAIR (writer, the .gitignore of the repo that writer came from).
        # A bare `git archive HEAD tools` export carries no .gitignore at all, so there is nothing to
        # gate — an honest skip. A BUILD_INDEX_TOOL the CALLER chose is different: that is a red proof
        # missing half its pair, and a missing half must be loud (cycle-2 DA P3-A — the documented
        # recipe extracted the tool alone and this leg dropped out of the proof unnoticed).
        if TOOL_OVERRIDDEN:
            pytest.fail(f"{TOOL} carries no .gitignore beside it — this leg gates the writer AND the "
                        f"repo .gitignore it came from; extract both (module docstring), e.g. "
                        f"`git show fde3a26^:.gitignore > <dir holding the tool copy>/.gitignore`")
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


def test_host_surface_never_prunes_a_page_the_writer_did_not_write(repo):
    """MC 11003 cycle-2 (DA P2-A): the prune loop removed ANY root index.html whose first 4 KB carried
    the nav-back string, so a hand-written page that merely quotes "← Alla projekt" was deleted — and
    its directory with it, by the rmdir that follows. Root identity is the writer's signature (the mark
    AND its own "<project> — prototyper" <title>), not a 13-character Swedish string. RED pre-fix: the
    plant below is gone and docs/ is gone; the two prune legs above stay green either way, which is
    exactly why this leg had to exist. Its RED object is the shipped loop (d89443c) — against the
    pre-repair writer there is no prune loop at all, so the plant survives and this leg passes."""
    assert run(repo, "--host-surface").returncode == 0
    plant = repo / "docs"                       # a path build_root() never generates (not a project)
    plant.mkdir()
    (plant / "index.html").write_text(
        "<!doctype html>\n<title>Contributor style guide</title>\n"
        "<body><p>The nav-back link reads <a href=\"../\">← Alla projekt</a></p>\n", encoding="utf-8")
    r = run(repo, "--host-surface")
    assert r.returncode == 0, r.stderr
    assert (plant / "index.html").is_file(), "prune deleted a page this writer never wrote"
    assert plant.is_dir(), "prune rmdir'd a directory it never created"
    assert "pruned stale surface page docs/" not in r.stderr, r.stderr


def test_title_shape_alone_does_not_identify_a_writer_page(repo):
    """MC 11003 cycle-3 TEST T1: the OTHER half of the signature is load-bearing too. A page carrying
    the writer's TITLE shape and no nav mark anywhere is not a page this writer wrote, so it and its
    directory are kept. The committed suite stayed GREEN on the mutant that drops the SURFACE_MARK
    clause (13 passed, 1 skipped — the tester reproduced it twice) while that mutant deleted this very
    plant and rmdir'd `notes/`; this leg is what makes the marker clause asserted, not decoration."""
    assert run(repo, "--host-surface").returncode == 0
    plant = repo / "notes"                        # the title shape of a surface page, minus its mark
    plant.mkdir()
    (plant / "index.html").write_text("<!doctype html>\n<title>notes — prototyper &amp; koncept</title>\n"
                                      "<body><h1>hand-authored, no nav-back mark anywhere</h1>\n",
                                      encoding="utf-8")
    r = run(repo, "--host-surface")
    assert r.returncode == 0, r.stderr
    assert (plant / "index.html").is_file(), "prune deleted a page over its <title> shape alone"
    assert plant.is_dir(), "prune rmdir'd a directory it never created"
    assert "pruned stale surface page notes/" not in r.stderr, r.stderr


def test_host_surface_says_so_when_a_stale_page_carries_the_mark_without_the_title(repo):
    """MC 11003 cycle-3 DA P1: the preserve-foreign rule is right, the SILENCE was the defect. A stale
    <site>/index.html that carries the nav mark but not the writer's own <title> is a page a human
    edited (the DA's one-character typo fix: prototyper → Prototyper), and it opts out of the privacy
    prune FOREVER — so the run must name it and the reason on stderr instead of exiting rc 0 quiet.
    RED on the shipped loop: rc 0, page kept, stderr mentions the stale dir zero times."""
    assert run(repo, "--host-surface").returncode == 0
    stale = repo / SITE / "index.html"
    stale.write_text(stale.read_text(encoding="utf-8").replace("prototyper", "Prototyper", 1),
                     encoding="utf-8")
    (repo / "projects" / SITE / "LOCAL_ONLY").write_text("", encoding="utf-8")   # MC 10510 privacy
    r = run(repo, "--host-surface")
    assert r.returncode == 0, r.stderr
    assert stale.is_file(), "a hand-edited page must be KEPT, not deleted — the loud line is the fix"
    assert "KEPT" in r.stderr and f"{SITE}/index.html" in r.stderr, f"silent decline: {r.stderr!r}"
    assert "<title>" in r.stderr, f"the reason is missing from: {r.stderr!r}"


def test_host_surface_says_so_when_a_copy_edit_of_its_own_title_stem_orphans_old_pages(repo):
    """Cycle-3 DA P1 case 2, the decisive one: a legitimate copy-edit of the writer's OWN constant
    (SURFACE_TITLE_STEM "— prototyper" → "— sidor") orphans every page the previous version left on
    disk, and the committed suite cannot see it — it only ever round-trips same-version writes, so it
    stayed green (13 passed, 1 skipped) while the old page survived its project's deletion. The prune
    must say so out loud. RED on the shipped loop: 0 prune lines, page kept, stderr silent."""
    assert run(repo, "--host-surface").returncode == 0
    stale = repo / SITE / "index.html"                      # written by the PREVIOUS wording
    assert "prototyper" in stale.read_text(encoding="utf-8")
    writer = repo / "tools" / "build-index.py"              # this run is the copy-edited writer
    reworded = writer.read_text(encoding="utf-8").replace(
        'SURFACE_TITLE_STEM = "— prototyper"', 'SURFACE_TITLE_STEM = "— sidor"', 1)
    assert reworded != writer.read_text(encoding="utf-8"), "the stem constant moved — find the new literal"
    writer.write_text(reworded, encoding="utf-8")
    shutil.rmtree(repo / "projects" / SITE)
    r = run(repo, "--host-surface")
    assert r.returncode == 0, r.stderr
    assert stale.is_file(), "the orphan was deleted — the copy-edit widened the prune instead"
    assert "KEPT" in r.stderr and f"{SITE}/index.html" in r.stderr, f"silent decline: {r.stderr!r}"


def test_host_surface_still_sees_a_mark_that_sits_past_the_old_4096_character_window(repo):
    """Cycle-3 DA P1 case 3 + TEST W1: the read was fh.read(4096) in TEXT mode, so the window is 4 096
    CHARACTERS — a committed page puts the 14-character mark at char 1 884-1 888, ~2 200 characters of
    head/CSS growth moves it out of the window, and the writer's OWN stale page then survives every
    publish, silently, rc 0. This leg pins the property that matters: the mark lies inside whatever the
    tool reads. It does it at the behaviour, on a page whose head was grown past 4 096. RED on the
    shipped reader (the 4 096-char window), green once the mark and the title share one window."""
    assert run(repo, "--host-surface").returncode == 0
    stale = repo / SITE / "index.html"
    mark = load(repo).SURFACE_MARK             # the constant of the tool UNDER TEST, not a literal
    grown = stale.read_text(encoding="utf-8").replace("<style>", "<style>" + "/*" + "x" * 3000 + "*/", 1)
    assert grown.index(mark) > 4096, "fixture no longer exercises the window (grow the padding)"
    stale.write_text(grown, encoding="utf-8")
    shutil.rmtree(repo / "projects" / SITE)
    r = run(repo, "--host-surface")
    assert r.returncode == 0, r.stderr
    assert not stale.is_file(), f"a page this writer wrote survived because the reader stopped early: {r.stderr!r}"
    assert "pruned stale surface page" in r.stderr, r.stderr


def test_host_surface_prunes_the_old_page_of_a_renamed_project(repo):
    """Cycle-3 TEST W2: the rename case worked and nothing pinned it. `mv projects/np
    projects/gymnasiet` must remove np/index.html and np/ and leave ONE card, for gymnasiet. It works
    because the expected <title> is derived from the STALE DIR's own name — the name the page on disk
    was written with. RED mutant (the tester's mut_rename_blind, plausible "improvement"): key that
    title off the live scan instead, and the old page survives next to the new one, both public,
    silent, while the root cards already point at the new name."""
    assert run(repo, "--host-surface").returncode == 0
    assert (repo / SITE / "index.html").is_file()
    shutil.move(str(repo / "projects" / SITE), str(repo / "projects" / "gymnasiet"))
    r = run(repo, "--host-surface")
    assert r.returncode == 0, r.stderr
    assert not (repo / SITE / "index.html").exists(), "the renamed project kept its old public page"
    assert not (repo / SITE).exists(), "the old shadow dir survived its own page"
    assert (repo / "gymnasiet" / "index.html").is_file(), "the rename wrote no page under the new name"
    root = (repo / "index.html").read_text(encoding="utf-8")
    assert f'href="{SITE}/"' not in root and 'href="gymnasiet/"' in root, root
    assert "pruned stale surface page" in r.stderr, r.stderr


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
    RED pre-change: rc=0 — a retired flag indistinguishable from success to a script or a cron.
    The combo case is the same contract, measured for the cycle-2 TEST W2 note: --host-surface --root
    WRITES the mirror (the ordinary _site/ build runs too) and still exits 2, so a script must treat
    the code as "the flag you passed is gone", never as "nothing happened"."""
    r = run(repo, "--root")
    assert r.returncode == 2, f"--root exited {r.returncode} — a retired flag must not read as success"
    assert "retired" in r.stderr
    assert not (repo / SITE / "index.html").exists(), "--root wrote a root shadow"
    assert (repo / "_site" / SITE / "index.html").is_file(), "the ordinary _site/ build must still run"
    combo = run(repo, "--host-surface", "--root")
    assert combo.returncode == 2, "--host-surface --root must still report the refusal"
    assert (repo / SITE / "index.html").is_file(), "the combo wrote no mirror — the W2 note would be false"
    assert "retired" in combo.stderr


def test_unknown_or_malformed_flags_are_rejected_before_any_write(repo):
    """MC 11003 follow-up (DA P2-C): --root=yes printed NO notice at all and --host-surface=1 was
    silently an ordinary run. RED pre-change: both rc=0 and silent; now every stray token is a
    usage error (exit 2) and nothing at all is written. The bare positionals are the cycle-2 TEST T2
    row: validating only `--`-prefixed tokens (mutation M10) left `build-index.py host-surface`
    exiting 0 having published nothing, with this suite green."""
    for argv in (["--root=yes"], ["--host-surface=1"], ["--bogus"], ["host-surface"], ["np"]):
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
