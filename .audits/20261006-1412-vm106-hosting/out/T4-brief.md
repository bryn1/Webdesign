[frontend] MC 10088.4 — T4 PERSONA-01 + RENAME-01 (executed by dsh subagent child, no runner).
Owner ruling R4 verbatim: "change the person name in Annys prototype/design to 'Jane Cooper'."
Scope: persona sweep across projects/anny/** + README.md + docs/ARCHITECTURE.md, then R3.3 brand-path
renames (projects/anny->projects/salong, 01-mullers-editorial->01-mork-guld, 21..26-lab-anny-* ->
2X-lab-demo-*, anny-portrait.* -> jane-portrait.*) with every cross-reference updated and the browse
site regenerated. No push (push is a gated later phase).

Deliverable: two commits on main in /home/claudecode/Hemsidor, author frontend (10088).

DoD: `git grep -niE 'anny|mullers|morin|072-155|landbrogatan|karlskrona|tross|dinsalong|din salong|din stad|gmail'` over tracked files returns zero hits outside projects/portfolio/; `git ls-files | grep -c projects/anny` = 0; render-proof of themes 01-mork-guld and 23-lab-demo-real over http://192.168.5.231:8090/salong/prototypes/<theme>/ shows 0 console errors, 0 banned strings, 0 broken images; red-proof recorded (a planted 'Anny Morin' file makes the grep go non-zero).
