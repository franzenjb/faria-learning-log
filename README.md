# Faria

A learning log: one page per lesson topic, a short index per day, tags, search and a review page of key facts.

- Content: `content/topics/*.md` (one file per topic) and `content/sessions/YYYY-MM-DD.md` (one file per day)
- Build: `node build.mjs` (no dependencies) writes the static site to `dist/`
- Hosting: Vercel project `faria-learning-log`, deploys on every push to `main`

See `ADDING_A_SESSION.md` for adding a day.

## Interactive deck

`/deck/` is a presenter deck of five live models (a spinnable globe for latitude and the pole stars plus a chronometer for longitude, Eratosthenes, Galileo's moons of Jupiter, a 3D Moon for the mountain-height geometry, the transit of Venus with Halley's parallax method and the orbital reason transits are rare, and a six-chapter Mason and Dixon journey from Greenwich to the Cape to the line). Coastlines are Natural Earth data in `public/deck/coast.js`; photographs for the Mason and Dixon chapters go in `public/deck/img/` (see the README there). Source: `public/deck/index.html`, no dependencies. Arrow keys move between slides, F toggles full screen, `#n` in the URL opens slide n. Smoke test: `node build.mjs && PLAYWRIGHT_MODULE=<path to playwright> node tests/deck-browser.mjs`.
