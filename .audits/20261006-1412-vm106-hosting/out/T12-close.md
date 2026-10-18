# T12 closure evidence (TEST-c4 @ dd328b8)
Child verdict untouched: # JUDGED: ce4ccbe7b5c1b35938a287f9d2aaba158bad8f654757bf39ae392a1426133d80 # VERDICT: PASS 
Parent independent probes on the LIVE public site (dd328b8 NOT pushed yet — root still single-level there, as expected):
live root: HTTP 200
live root cards (48 = pre-v2 single-level, expected): 48
live /salong/ (must be 404 until push): HTTP 404
P3-1 header-reason fix dispatched as separate additive commit (builder resumed; dd328b8 base kept alive for live gate pins).
VERIFY_EXIT=0
