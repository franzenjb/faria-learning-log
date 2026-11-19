# longitude.jbf.com — the public "Where Am I?" talk

longitude.jbf.com serves **only** the talk deck. It is its own Vercel project,
**longitude-talk**, built from this same repo, so the private site
(faria.jbf.com, project faria-learning-log) is never reachable through it.

## How it works

| | faria.jbf.com | longitude.jbf.com |
|---|---|---|
| Vercel project | faria-learning-log | longitude-talk |
| Root Directory | repo root | `longitude/` |
| Config | `vercel.json` | `longitude/vercel.json` |
| Build | `node build.mjs` → `dist/` | `node build.mjs` in `longitude/` → `longitude/dist/` |

`longitude/build.mjs` copies only what the deck needs:

- `public/claude1/v3/index.html` → `/index.html` (with `<base href="/">`)
- `public/claude1/v3/*` (scripts, `course.css`, `img/`, `audio/` narration) → `/v3/`
- `public/claude1/img/`, `coast.js`, `coast2.js` → `/img/`, `/coast*.js`
- the cold-open storm film `public/faria1/where-am-i/v3/` (no preview video) → `/film/`
- the "France got smaller" plate → `/assets/carte2.jpg`

It then rewrites the build copy (never the source files): removes the
"Version 2" link, the topic-page panel and the "Want to Know More?" lesson PDFs,
the presenter links back to `/deck/`, and private names in text and comments.
Finally it scans the output and **fails the build** if any path into the private
site is left (`/faria1/`, `/kimi1/`, `/claude1/`, `/sessions/`, `/topics/`,
`/downloads/`, `/deck/`, `faria.jbf.com`, `../../`). A failed build leaves the last
good deploy live, so nothing private can leak by accident.

Everything not copied is a 404 on longitude.jbf.com (for example `/claude1/`,
`/kimi1/`, `/sessions/…`).

## Editing the talk

Edit the deck as usual in `public/claude1/v3/` and push to `main`. Both Vercel
projects build on every push: faria.jbf.com/claude1/v3/ and longitude.jbf.com/
update together (about 1–2 minutes).

If a new slide loads an asset from **outside** `public/claude1/v3/` or
`public/claude1/img/`, add a copy step and a path rewrite for it in
`longitude/build.mjs`, or the build will fail on the leak scan (or the asset
will 404). Check with:

```
cd longitude && node build.mjs     # prints warnings for rewrites that no longer match
```

Links: https://longitude.jbf.com/ · talk version https://longitude.jbf.com/?talk=30 · deep link https://longitude.jbf.com/?talk=30#19
