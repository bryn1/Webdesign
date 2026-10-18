# T3 render sweep — 27 theme pages over HTTP (viewport 1280x900)

Base: http://192.168.5.231:8090/salong/prototypes/<dir>/ | instrument: playwright-core chromium (headless)
Banned list (case-insensitive, checked in title + body innerText + all meta content + all img alt):
`anny, mullers, morin, 072-155, 07X-XXX, landbrogatan, karlskrona, tross, dinsalong, din salong, din stad, gmail`

All `naturalWidth==0` at rest were `loading="lazy"` scroll-reveal images (design behavior);
every one was re-verified decoded after natural scrolling (lazy_recheck.js / slow_scroll.js / t6_v2.js, full tables in .tmp/t5/).

| page | HTTP | console err | pageerr | banned | imgs | undecoded at rest | decoded after scroll |
|---|---|---|---|---|---|---|---|
| 00-poc-live-site | 200 | 0 | 2 | 0 | 0 | 0 | n/a |
| 01-mork-guld | 200 | 0 | 0 | 0 | 5 | 0 | ALL DECODED |
| 02-mork-neon | 200 | 0 | 0 | 0 | 5 | 0 | ALL DECODED |
| 03-varmt-papper | 200 | 0 | 0 | 0 | 5 | 0 | ALL DECODED |
| 04-brutalt-tryck | 200 | 0 | 0 | 0 | 5 | gal-01.jpeg, gal-02.jpeg, gal-03.jpeg, gal-04.jpeg -> 0 after scroll | ALL DECODED |
| 05-mjuk-glas | 200 | 0 | 0 | 0 | 5 | 0 | ALL DECODED |
| 06-cinematiskt | 200 | 0 | 0 | 0 | 5 | gal-01.jpeg, gal-02.jpeg, gal-03.jpeg, gal-04.jpeg -> 0 after scroll | ALL DECODED |
| 07-retrofilm | 200 | 0 | 0 | 0 | 5 | 0 | ALL DECODED |
| 08-organiskt-hantverk | 200 | 0 | 0 | 0 | 5 | 0 | ALL DECODED |
| 09-schweizertag | 200 | 0 | 0 | 0 | 5 | 0 | ALL DECODED |
| 10-magasincollage | 200 | 0 | 0 | 0 | 7 | 0 | ALL DECODED |
| 11-blaa-fargbrunn | 200 | 0 | 0 | 0 | 5 | gal-04.jpeg -> 0 after scroll | ALL DECODED |
| 12-forgyllda-salongen | 200 | 0 | 0 | 0 | 5 | 0 | ALL DECODED |
| 13-91-tal | 200 | 0 | 0 | 0 | 5 | 0 | ALL DECODED |
| 14-dagens-frisyr | 200 | 0 | 0 | 0 | 6 | 0 | ALL DECODED |
| 15-sagan-om-klippet | 200 | 0 | 0 | 0 | 0 | 0 | ALL DECODED |
| 16-gradientljus | 200 | 0 | 0 | 0 | 5 | 0 | ALL DECODED |
| 17-mork-akademien | 200 | 0 | 0 | 0 | 5 | 0 | ALL DECODED |
| 18-bara-typsnitt | 200 | 0 | 0 | 0 | 0 | 0 | ALL DECODED |
| 19-galerievaggen | 200 | 0 | 0 | 0 | 5 | 0 | ALL DECODED |
| 20-mynta | 200 | 0 | 0 | 0 | 5 | 0 | ALL DECODED |
| 21-lab-demo-a | 200 | 0 | 0 | 0 | 5 | gal-03.jpeg, gal-04.jpeg -> 0 after scroll | ALL DECODED |
| 22-lab-demo-b | 200 | 0 | 0 | 0 | 6 | 0 | ALL DECODED |
| 23-lab-demo-real | 200 | 0 | 0 | 0 | 6 | 0 | ALL DECODED |
| 24-lab-demo-flag | 200 | 0 | 0 | 0 | 7 | 0 | ALL DECODED |
| 25-lab-demo-live | 200 | 0 | 0 | 0 | 5 | gal-03.jpeg, gal-04.jpeg -> 0 after scroll | ALL DECODED |
| 26-lab-demo-low | 200 | 0 | 0 | 0 | 9 | 0 | ALL DECODED |

27 product pages: HTTP 200 all; console errors 0 all; banned strings 0 all; images all decode (see note).
**pageerr != 0 on 1 page: 00-poc-live-site (2x SyntaxError: Unexpected identifier 'COOPER_GALLERY_IMAGES')** —
the R2/R4 sweeps rewrote a JS global into `window.JANE COOPER_GALLERY_IMAGES` (invalid identifier);
`gallery-manifest.js` and `gallery.js` both throw -> the gallery renders 0 imgs on that page.
(`_assets` and `index.html` rows dropped: my dir list had 2 artifacts; the 404 console hit is the artifact, not the product.)
