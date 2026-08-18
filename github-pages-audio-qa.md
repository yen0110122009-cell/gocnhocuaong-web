# GitHub Pages audio release QA

- Live URL checked: https://yen0110122009-cell.github.io/gocnhocuaong2/?v=ec5b7d8-audio
- Live HTML still referenced `src="/assets/index-DXv-5hCv.js"` and `href="/assets/index-DRlIDIjs.css"`; both root asset paths are incompatible with the project Pages subpath and the browser rendered a blank page.
- Local build with `GITHUB_ACTIONS=1` referenced `src="/gocnhocuaong2/assets/index-DguhjTwQ.js"` and `href="/gocnhocuaong2/assets/index-DRlIDIjs.css"`.
- Root cause for this release: Pages CDN/legacy branch was still serving an older index after artifact commit `ec5b7d8`; `client/index.html` now includes a release marker to force a changed HTML artifact before the next push.
