# Faria

A learning log: one page per lesson topic, a short index per day, tags, search and a review page of key facts.

- Content: `content/topics/*.md` (one file per topic) and `content/sessions/YYYY-MM-DD.md` (one file per day)
- Build: `node build.mjs` (no dependencies) writes the static site to `dist/`
- Hosting: Vercel project `faria-learning-log`, deploys on every push to `main`

See `ADDING_A_SESSION.md` for adding a day.

## Interactive deck

`/deck/` is a presenter deck of four live models (latitude from Polaris and longitude from a chronometer, Eratosthenes, Galileo's moons of Jupiter, the height of a Moon mountain). Source: `public/deck/index.html`, no dependencies. Arrow keys move between slides, F toggles full screen, `#n` in the URL opens slide n. Smoke test: `node build.mjs && PLAYWRIGHT_MODULE=<path to playwright> node tests/deck-browser.mjs`.
