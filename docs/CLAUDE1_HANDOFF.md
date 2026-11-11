# Handoff: /claude1/ four-day GIS course deck (11 Nov 2026)

Read this file only. Do not replay the old conversation.

## What exists
- Live at https://faria.jbf.com/claude1/ (source `public/claude1/`). Independent Claude copy. Never touch `/deck/`, `/deck/v2/`, `/kimi1/`. Kimi's PR #54 stays unmerged.
- Briefs it must match: the two "Abbé Faria" briefs of 11 Nov 2026 (four days; ten-slide longitude chapter; bingo; thin projections after Eratosthenes; thin vector/raster at end of Day 1; cream page, serif, one crimson accent; Jeff's script fixed left, visuals fixed right; collapsible left index; right topic sidebar with a big Return button).
- 42 slides run with no JavaScript errors. Only about 10 were looked at by eye.

## Files
- `course.js`: **the base to edit.** `COURSE` array = order, day, chapter, labels, teleprompter scripts, topic links. Also builds the shell (index, script pane, topic pane, topic overlay).
- `course-slides.js` (Day 1) and `course-slides-b.js` (Days 2 to 4): new slides as `NEW_SLIDES['title'] = {h1, ctl, fig | canvas, init}`.
- `course.css`: cream theme and layout.
- `index.html`: copy of `/deck/` with colours auto-converted to cream. Holds the older canvas scenes. Unused slides are parked in a hidden div, not deleted.

## Not done
1. Eyeball every slide at 1600x900 and 1280x720. Expect leftover dark-theme colours and cramped text in older canvas scenes.
2. Three PDFs were unreachable from the cloud: thumb trick (22 pp), quadrant (12 pp), vector and raster (6 pp). They are in `~/Desktop/Franzen Lessons/` (not Archive). Those slides were written from topic pages and memory. Check them against the PDFs.
3. Unverified facts: Harrison weights and dates, Scilly "about 100 miles off", Longitude Act prize tiers, Landsat revisit, datum shift size.
4. No test file yet. Add `tests/claude1-browser.mjs` modelled on `tests/deck-browser.mjs`.
5. Scripts for Days 2 to 4 are first drafts. Day 1 needs 10 video segments of 5 to 10 minutes.
6. Phone layout untested.

## Rules from Jeff
Miles, not km. Short plain copy. Quiz slides show no hint. Spell it Clowdesley. Dimes are face-on. Build, test, commit, push, open PR, merge without asking. Check: `node build.mjs`, then serve `dist/` and load `/claude1/`.
