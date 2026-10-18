# T17 closure evidence
Diagnosis artifact (child 2d35fd79): # VERDICT: NEEDS-OWNER — staging size floor (half of last-good 17439B = 8719B) refuses v2's legitimate 2673B root every tick; needs owner go to let a repo gate block lower the floor (or one-shot operator publish on vm106); re-pushing never helps. — gate[RED] product-path floor 8719B (half of v1 root 17439B) vs v2 root 2706B, 11 deterministic refusals, NOT a stall.
OWNER RULING (ask_user option verbatim): 'Fix the gate rule (Recommended)'.
Fix: agent-town master edf19b1b (staging.py min_bytes_mode=own; two-sided selftest 4/4 PASS incl RED case 8719 unchanged; fleet p2-staging-selftest 26/26 + p3a 53/53 unchanged); webdesign hosting.yaml gate block {min_bytes_mode: own, min_bytes: 1200} = repo 172fd50 PUSHED (origin/main re-GET), validator PASS.
Executed-file proof: shared-checkout staging.py updated per fleet-shared-skill-library step 9 (pure LAG file, 0 local diff); own-mode floor 1200 + default 8719 re-proven against the executed file.
Origin states: agent-town master edf19b1b; Webdesign main 172fd501.
Flip confirmation: watcher job (public probe + reconcile.log verbs), acceptance re-run on flip.
VERIFY_EXIT=0
