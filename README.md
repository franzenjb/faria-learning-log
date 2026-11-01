# Faria

A learning log: one page per lesson topic, a short index per day, tags, search and a review page of key facts.

- Content: `content/topics/*.md` (one file per topic) and `content/sessions/YYYY-MM-DD.md` (one file per day)
- Build: `node build.mjs` (no dependencies) writes the static site to `dist/`
- Hosting: Vercel project `faria-learning-log`, deploys on every push to `main`

See `ADDING_A_SESSION.md` for adding a day.
