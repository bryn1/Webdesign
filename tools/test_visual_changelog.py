"""Test contract for tools/visual-changelog.mjs (MC 12358, child of MC 12355 item 5a).

Run from the repo root:  python3 -m unittest tools/test_visual_changelog.py

Runs the REAL tool (node) three times against a COPY of the committed fixture
(tools/fixtures/visual-changelog/ + its sibling ../_assets/) placed under <repo>/.tmp/,
which is scratch and untracked, and cleans up its own dirs on exit:
  run 1 -> every width reports "first"
  run 2 -> every width reports "unchanged"   (the diff is a real instrument, green side)
  planted edit to index.html -> run 3 reports "changed" for every width  (red side)
Also asserts each run dir holds a PNG per width plus console-errors.json.
"""
import os
import re
import shutil
import subprocess
import time
import unittest
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
TOOL = REPO / "tools" / "visual-changelog.mjs"
FIXTURE = REPO / "tools" / "fixtures" / "visual-changelog"
ASSETS = REPO / "tools" / "fixtures" / "_assets"
WIDTHS = ["1440", "375"]
STATUS_RE = re.compile(r"^  (\d+): (first|new|unchanged|changed|missing)", re.M)


class VisualChangelogTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        uid = f"t{os.getpid()}-{int(time.time())}"
        cls.proto_name = f"proto-{uid}"
        cls.scratch = REPO / ".tmp" / uid
        cls.proto = cls.scratch / cls.proto_name
        shutil.copytree(FIXTURE, cls.proto)
        shutil.copytree(ASSETS, cls.scratch / "_assets")
        cls.log_root = REPO / ".audits" / "changelog" / cls.proto_name

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(cls.scratch, ignore_errors=True)  # only this test's own dirs
        shutil.rmtree(cls.log_root, ignore_errors=True)

    def run_tool(self):
        proc = subprocess.run(
            ["node", str(TOOL), str(self.proto), "--widths", ",".join(WIDTHS)],
            capture_output=True, text=True, cwd=REPO, timeout=300)
        self.assertEqual(proc.returncode, 0, f"tool failed:\n{proc.stdout}\n{proc.stderr}")
        return proc.stdout

    def statuses(self, out):
        pairs = STATUS_RE.findall(out)
        self.assertEqual([w for w, _ in pairs], WIDTHS, f"one status line per width, in order:\n{out}")
        return dict(pairs)

    def test_second_run_unchanged_and_planted_edit_changed(self):
        self.assertEqual(self.statuses(self.run_tool()), {w: "first" for w in WIDTHS})
        self.assertEqual(self.statuses(self.run_tool()), {w: "unchanged" for w in WIDTHS})

        html = self.proto / "index.html"
        text = html.read_text(encoding="utf-8")
        self.assertIn("no animation", text)
        html.write_text(text.replace("no animation", "a PLANTED edit"), encoding="utf-8")
        self.assertEqual(self.statuses(self.run_tool()), {w: "changed" for w in WIDTHS})

        runs = sorted(p for p in self.log_root.iterdir() if p.is_dir())
        self.assertEqual(len(runs), 3, f"three run dirs under {self.log_root}")
        for run in runs:
            for w in WIDTHS:
                shot = run / f"shot-{w}.png"
                self.assertTrue(shot.is_file() and shot.stat().st_size > 0, f"{shot} missing")
            self.assertTrue((run / "console-errors.json").is_file(), f"{run} has no console-errors.json")


if __name__ == "__main__":
    unittest.main()
