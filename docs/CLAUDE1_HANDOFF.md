# Handoff: /claude1/ four-day GIS course deck (updated 11 Nov 2026, second session)

Read this file only. Do not replay the old conversation.

## What exists
- Live at https://faria.jbf.com/claude1/ (source `public/claude1/`). Independent Claude copy. Never touch `/deck/`, `/deck/v2/`, `/kimi1/`. Kimi's PR #54 stays unmerged.
- Briefs it must match: the two "Abbé Faria" briefs of 11 Nov 2026 (four days; ten-slide longitude chapter; bingo; thin projections after Eratosthenes; thin vector/raster at end of Day 1; cream page, serif, one crimson accent; Jeff's script fixed left, visuals fixed right; collapsible left index; right topic sidebar with a big Return button).
- 42 slides. Every slide has now been looked at by eye at 1600x900 and 1280x720 (second session).

## Files
- `course.js`: **the base to edit.** `COURSE` array = order, day, chapter, labels, teleprompter scripts, topic links. Also builds the shell (index, script pane, topic pane, topic overlay).
- `course-slides.js` (Day 1) and `course-slides-b.js` (Days 2 to 4): new slides as `NEW_SLIDES['title'] = {h1, ctl, fig | canvas, init}`.
- `course.css`: cream theme and layout.
- `index.html`: copy of `/deck/` with colours auto-converted to cream. Holds the older canvas scenes. Unused slides are parked in a hidden div, not deleted. Its `text()` and `tag()` canvas helpers now keep every label inside the canvas (shift, or shrink if wider than the canvas).
- `tests/claude1-browser.mjs`: walks all 42 slides at both sizes (script pane follows, panes fit the window, no sideways scroll, no page errors), then index, topic page + Return, arrow key, and 390px phone.

## Done in the second session
- Fixed: a long script (Picard) stretched the whole layout past the window and hid the nav arrows. Shell row is now capped; the script pane scrolls. The test fails if this comes back (proved by reverting the fix).
- Fixed clipping: Picard-and-the-metre labels, Gaia "seen in January/July", Kepler lifeline labels, 24-hour clock "Greenwich", shelter table column C, wind and shelter captions, Eratosthenes top captions. Button rows now wrap (Kepler, mental-map quiz).
- Phone (under 860px): slides now stack text over picture; the page scrolls. Usable, not polished (the 24-hour clock is cramped).
- Miles, not km: removed every visible km figure (Eratosthenes, Picard rods, Venus readout, Earth-clock table). Quadrant now reads in feet and fractions of an inch; Landsat cell "about 100 feet"; nautical mile "about 6,076 feet"; datum slip "100 feet or more".
- Checked against the three PDFs in `~/Desktop/Franzen Lessons/`:
  - Thumb trick (22 pp): the PDF's thumb trick is the upright thumb, arm about ten thumbs long (6-ft person one thumb tall = 60 ft), then the warehouse with two tripods. Slide 2 script rewritten to lead with that, then the eye-switch jump as the two-viewpoint version. Venus, Horrocks, Halley scripts already matched.
  - Quadrant (12 pp): Tycho's quadrant is the wall quadrant (brass arc), about 6½ ft radius, one arcminute about 0.6 mm. Chip renamed "Tycho's wall quadrant"; "twenty years before the telescope" became "a generation before".
  - Vector and raster (6 pp): matched; Day 3 script now uses the PDF's two questions (where is the boundary / what is in each square).
- Facts checked: Longitude Act tiers (£10,000/1°, £15,000/⅔°, £20,000/½°) correct; Harrison H1 about 75 lb and H4 losing about 5 s in 81 days correct; Landsat 8-day combined revisit correct; Rømer 22 minutes correct. Scilly "about a hundred miles off" was unsourced and is gone ("Their reckoning is wrong").

## Still open
1. H3 date: slide shows 1757 with "nineteen years of work". Royal Museums Greenwich gives H3 as 1740 to 1759. Moving it to 1759 makes it collide with H4 on the timeline; needs a layout tweak, not just a number.
2. Scripts for Days 2 to 4 are first drafts. Day 1 needs 10 video segments of 5 to 10 minutes.
3. Cover: the kicker line sits over globe lines and is hard to read.
4. Jeff review of the whole deck.

## Rules from Jeff
Miles, not km. Short plain copy. Quiz slides show no hint. Spell it Clowdesley. Dimes are face-on. Build, test, commit, push, open PR, merge without asking. Check: `node build.mjs`, serve `dist/` (for example `cd dist && python3 -m http.server 8791`), then `PLAYWRIGHT_MODULE=/Users/jefffranzen/dev/youth-engagement-passport/node_modules/playwright/index.mjs node tests/claude1-browser.mjs`.
