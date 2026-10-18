# T11 closure evidence (BROWSE-V2)
Commits: dd328b8 (6-path build) + 71b4fd1 (header reason) + 64dbe23 (doc state truth) + 797d196 (glob narrowing) — pushed: origin/main == 797d196 (git fetch re-GET).
797d196 infra (10088): hosting mirror — narrow new-page globs to /salong/*.html + /portfolio/*.html (DA-c3 P3-1: extension-agnostic globs would serve any future foreign file dropped in those dirs)
Gates: TEST-c4 PASS @dd328b8 (TEST-verdict-c4.md), DA-c3 SHIP @71b4fd1 (DA-verdict-c3.md), ARCH c5 FIX->my 64dbe23->c6 PASS @64dbe23 (ARCH-verdict-c6.md). Parent probes: validator exit 0, dry-run served=319 with planted-file drops, root/salong//portfolio/ render on served copy.
Live v2 acceptance: child 6aabee06 dispatched (bounded 90 min); TEST-verdict-live-v2.md pending — PUSHED state verified, PUBLIC-v2 state UNVERIFIED until that verdict lands.
VERIFY_EXIT=0
