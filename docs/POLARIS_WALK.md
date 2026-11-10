# Walking north and watching the pole

- Route: `/polaris/` on the existing `faria-learning-log` Vercel project.
- Entry points: latitude controls in `/deck/` and `/deck/v2/`, plus the existing Polaris topic.
- Source: `public/polaris/`. Static HTML, CSS and ES modules, with no dependencies or external assets.
- Model: spherical Earth, fixed north-pole direction, level astronomical horizon. Central latitude comes from the radial position. Pole altitude comes independently from the pole direction's projection onto local up. The page explicitly distinguishes pole altitude, zenith distance and straight-up altitude.
- Polaris is idealized at the pole. Real observations need corrections for stellar offset, horizon, instrument, atmospheric effects and Earth's non-spherical shape.
- Controls: 0–90° slider, equator/39°/New York/North Pole presets, a timed northward walk with pause, and optional perpendicular markers. Manual input pauses animation. Hidden tabs pause animation.
- Mobile: the two angle readings stay pinned while the two views stack vertically.

## Checks

`node build.mjs`

`node --test tests/polaris.test.mjs`

`PLAYWRIGHT_MODULE=<installed playwright module> node tests/polaris-browser.mjs [base URL]`

The browser test accepts `CHROME_PATH` (default `/usr/bin/chromium`). It checks endpoint and intermediate angles, keyboard increments, animation/pause, geometry toggle, 320/390/768px layouts, deck links and runtime errors. Local desktop and mobile screenshots were inspected before release.

Publication follows the existing Git integration on `main`. Verify `/polaris/` and its served module bytes after deployment. To undo this feature, revert its scoped commit; no data migration or service configuration is involved.
