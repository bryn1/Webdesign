# Källa

Eget arbete (nytt verk) för /larare-klustret, kopi ur `projects/skola/spec.md`.
- Label: QUALITY FAIL

Gate 1.0.5, 2026-10-19T08:22Z: alla kontrast-/layout-check PASS; kvarstående
FAIL = console + links, orsakade av den ena, av bildmotorn saknade PNG:n
`../_assets/skola-larare.png` (gpu-window: "sudo: a password is required").
Om målbilden landar: kör om quality-gate.sh, då blir QUALITY PASS.
