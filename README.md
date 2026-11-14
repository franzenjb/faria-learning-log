# Faria

A learning log: one page per lesson topic, a short index per day, tags, search and a review page of key facts.

- Content: `content/topics/*.md` (one file per topic) and `content/sessions/YYYY-MM-DD.md` (one file per day)
- Build: `node build.mjs` (no dependencies) writes the static site to `dist/`
- Hosting: Vercel project `faria-learning-log`, deploys on every push to `main`

See `ADDING_A_SESSION.md` for adding a day.

## 14 November 2026

[GIS Day 2026](https://faria.jbf.com/gisday/) is a 30-minute presenter deck at `/gisday/`, titled *Where Am I?* Eighteen slides, paper and ink and one red, from paces and the stick to the star day, longitude, and Harrison. Click, space, or the arrow keys advance a step. N toggles presenter notes with the clock. F is full screen. It does not replace the course at `/claude1/`.

## Interactive deck

`/deck/` is version 1 of the presenter deck and stays at that address. `/deck/v2/` is the same lecture in a clearer frame: a short headline, the model full width, a progress bar, an overview (O), and shorter motion that respects reduced-motion. The deck is a presenter deck of five live models (a spinnable globe for latitude and the pole stars plus a chronometer for longitude, Eratosthenes, Galileo's moons of Jupiter, a 3D Moon for the mountain-height geometry, the transit of Venus with Halley's parallax method and the orbital reason transits are rare, and a six-chapter Mason and Dixon journey from Greenwich to the Cape to the line). Coastlines are Natural Earth data in `public/deck/coast.js`; photographs for the Mason and Dixon chapters go in `public/deck/img/` (see the README there). Source: `public/deck/index.html`, no dependencies. Arrow keys move between slides, F toggles full screen, P opens a presenter window with speaker notes and a slide menu that stays in sync, `#n` in the URL opens slide n. The full plan for converting the master presentation is in `docs/DECK_PLAN.md`. Smoke test: `node build.mjs && PLAYWRIGHT_MODULE=<path to playwright> node tests/deck-browser.mjs`.
