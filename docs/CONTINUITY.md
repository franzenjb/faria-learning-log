---
project: faria-learning-log
url: https://faria.jbf.com
repo: https://github.com/franzenjb/faria-learning-log
vercel_project: faria-learning-log
verified: 2026-11-08
---
# Faria Owner's Manual

## Purpose And Daily Use
Faria is Jeff's illustrated learning log, originally built by Abbé Faria. Codex added the Galileo Moon mountain interactive on November 8, 2026. Open https://faria.jbf.com/galileo/ and move the three sliders or drag the peak. The example button restores a four-modern-mile mountain just reaching sunlight. Miles and feet describe size; degrees describe Sun elevation. This is a teaching model, not a lunar terrain survey. The original Italian-mile claim is explicitly distinguished.

## How It Works
Markdown topics and session records → `node build.mjs` → `dist/` → existing Vercel project `faria-learning-log` → https://faria.jbf.com.
Canonical checkout: `/Users/jefffranzen/dev/faria-learning-log`. Production branch: `main`. Existing source repository is PUBLIC (verified by GitHub CLI); do not change access as part of routine maintenance.

The builder copies public assets, then generates pages with existing navigation, text size, theme and feedback. `/galileo/` is built from `public/galileo/lesson.html`; JavaScript and CSS remain alongside it. Content topic 86 makes the tool searchable and links it from the November 8 session. Topic 46 also links to it. No runtime dependencies or backend were added.

## Data And Calculation Authority
- NASA Moon facts: https://science.nasa.gov/moon/facts/; rounded size 2,160 modern miles across, held in `public/galileo/model.js`. Fixed educational constant; no live refresh.
- Galileo, The Starry Messenger: https://en.wikisource.org/wiki/The_Sidereal_Messenger_of_Galileo_Galilei/The_Sidereal_Messenger. Historical statement: more than four Italian miles. Do not relabel these as modern miles.
- Model: spherical Moon, radial peak, parallel sunlight, terrain occlusion. Mountain position is ground distance from a fixed center; Sun elevation is measured there. The daylight edge moves as elevation changes. Minimum height on the dark side is R*(sec(local elevation)-1). Inputs use modern miles/degrees, never lunar units. Display geometry exaggerates vertical scale, including the sunlight slope. It does not model finite solar disk, rough terrain, Earth perspective or terrain cast shadows.
- No Red Cross data, credentials, analytical personal data or external calculation service.

## Access And Succession
Jeff Franzen owns JBF hosting and source accounts. Backup maintainer is unassigned. A maintainer needs repository write access plus the existing JBF Vercel team role to publish. Request access from Jeff; never broaden scopes or sharing to unblock work. Existing JBF accounts cover billing; this addition requires no new service or subscription. Cloudflare maintains the existing faria DNS record; no DNS change is required. Feedback reuses the existing site widget; submission was not exercised because that would create a response.

## Routine Updates And Checks
From the canonical checkout, maintainer runs `node build.mjs` and `node --test tests/galileo.test.mjs`. A successful build reports topic/session/tag totals. Start a local static server for `dist/`, then run `node tests/browser.mjs http://localhost:8768`. Browser tests require Playwright and installed Chrome; set `PLAYWRIGHT_MODULE` to an existing Playwright ES module if it is not locally installed. During this release the module at `/Users/jefffranzen/dev/youth-engagement-passport/node_modules/playwright/index.mjs` was used. The app itself needs no package install.

Browser checks cover threshold behavior, three sliders, mouse dragging, keyboard increments, reset, themes, 320/390px widths, enlarged text, topic/home links and JavaScript errors. Screenshots go to the system temporary folder for inspection. Failed checks block release; inspect the failure and change canonical source, never dist.

## Change And Release
Read Session Board, sync log, git status and HANDOFF.md; claim git ownership before edits. Preserve concurrent work. Review the intended diff and run checks. Commit only task files and push main. Git-connected deploy is expected but must be verified; if needed use `vercel --prod --yes --scope jbf-2539-e1ec6bfb` from the linked checkout. Verify live `/galileo/` in Chrome and compare served JS hashes with the local build. `vercel.json` requires revalidation for assets to avoid stale scripts. This release is authorized by Jeff's request to put the interactive within Faria. Update this manual, the Excel register, project registry and Session Board after release.

## Recovery
Previous known source is `c2b918d` (before this addition). A maintainer can revert the specific Galileo release commit in a new commit and redeploy, or restore the preceding Vercel production deployment using the existing account. Do not reset shared history. Confirm the original lessons and navigation still load after rollback. Rollback steps are documented but have not been rehearsed against production.

## Troubleshooting
- Blank scene: inspect browser errors and `/galileo/galileo.js` plus `/galileo/model.js` response codes. Rebuild from canonical source; modules must be served over HTTP.
- Old interface after a push: check Vercel deployment status and actual asset hashes, then directly deploy if the Git connection did not publish. Do not claim live success from Git alone.
- Wrong threshold: inspect model constants and geometry tests; do not force displayed text to match an expected answer.
- Missing lesson: ensure topic frontmatter has an existing session and the `/galileo/` builder call remains present.

## Maintenance And Evidence
Last source verification: November 8, 2026. Geometry tests passed, including independent ray/sphere visibility across control ranges. Local Chrome behavior and desktop/mobile light/dark screenshots checked. Whole-site style audit reports existing multi-font/color conventions; no unrelated restyle attempted. Live release evidence is recorded in `docs/RELEASE.md` after deployment. Recheck sources and browser behavior when modifying the lesson. No unattended refresh job exists or is needed. See `Galileo Change Register 2026-11-08.xlsx` (authoritative manual tracker; no automated synchronization). User acceptance remains Jeff's decision.

```json
{
  "project": "faria-learning-log",
  "live_url": "https://faria.jbf.com",
  "verified": "2026-11-08",
  "vercel_project": "faria-learning-log"
}
```
