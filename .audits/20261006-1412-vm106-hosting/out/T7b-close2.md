c2d8fe6 FIX-ARCH-01 (amended; §10 race fix) + 882d400 01b (§2 root-surface rows) + 30d0de3 01c (mirror-root vs :8090 landing) — all docs-only, verified by parent (git show --name-only exact; css pure +1). ARCH re-gate chain: c2 FIX (named §2 gap) -> 01b -> c3 FIX (fixer-introduced false claim, caught by cmp) -> 01c -> c4 PASS at 30d0de3. Producer part complete.
VERIFY_EXIT=0
