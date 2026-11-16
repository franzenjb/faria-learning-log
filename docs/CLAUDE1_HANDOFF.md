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

## 14 Nov 2026 · v3 and the 30-minute talk (Claude session handoff)

**Where things are**
- Full course: `/claude1/v3/`.
- 30-minute weekend Teams talk: `/claude1/v3/?talk=30`. The talk has 14 slides; `TALK30` in `public/claude1/v3/course.js` picks the notes lines and minutes for each.
- `/claude1/` itself is untouched.
- v3 loads claude1's coastlines, images and film through `<base href="/claude1/">`, so its own scripts are referenced as `v3/...`.

**Where the code is**
- New slides and the v3 machinery are in `public/claude1/v3/course-slides-v3.js`:
  - `V3.steps`: presenter steps on → and ←.
  - `V3_TUNE`: per-slide hide, kicker and hero line.
  - The `.v3-payoff` mirror: a reveal's answer appears at the top of the stage.
  - The presenter keys.
  - The quiz driver.
- Older scenes live in `v3/index.html`, `v3/course-slides.js` and `v3/course-slides-b.js`. These are copies; edit the v3 copies only.

**How Jeff presents**
- There is no side panel. C brings it back.
- Each slide's controls are on keys 1–9, 0, then letters. ↑/↓ moves the slide's slider. The key list is hidden; K shows it.
- **Scilly:** → three times (two four-line screens, then the verdict screen).
- **Quiz:** A–D record votes, → reveals, → shows the next question, → moves on.
- **Harrison:** → steps through one line at a time.

**Jeff's standing rules** (on top of CLAUDE.md):
- Story first.
- The lesson words (latitude, longitude, 1 hour = 15°, a clock 4 seconds off = 1 nautical mile) must be ON SCREEN.
- Images must stay clearly visible.
- The most dramatic line must be the biggest thing on screen.
- No button clutter on screen.
- Readable over a Teams screen share.
- Check every change in screenshots before telling Jeff it's done.

**Tests**
- `tests/claude1-v3-browser.mjs`. Run it with `PLAYWRIGHT_MODULE` pointing at the playwright `index.mjs` and `CHROME_PATH` set, against a served `dist/`.

**Lessons**
- Topics 102–110, added 14 Nov, fill the timeline gaps:
  - Scilly 1707
  - The Longitude Act
  - Hipparchus and Ptolemy
  - Lunar distances
  - The 1884 conference
  - The date line
  - GPS
  - Huygens
  - Leap years

**Open items**
- Jeff is reviewing the 30-minute talk slide by slide. Fix each note as it comes, check it in screenshots, then merge.
- Polaris PR #52 is stale and conflicts with main's newer Polaris rebuild. Jeff hasn't decided whether to close it.

## Controls and animated scenes (v3 talk)
- The Controls list is a quiet vertical list in the bottom-left corner, always on when a slide has controls (not inside the chapter panel: Jeff found that distracting). Closing it by hand (the 1·2 button or K) is remembered. `tests/claude1-v3-browser.mjs` fails if slides 3 or 4 lose their controls.
- Slides 5, 7, 8 and 9 are continuous canvas scenes (`V3.scene` in `course-slides-v3.js`): one camera, → per beat. Do not add a helper named `V3.globe`: that name is taken by the 1884, date line and GPS globes.

## Talk appendix (Q&A only, after GPS)

`?talk=30` ends with 11 appendix slides: Decimal Places, The Star Day, Rømer, Null Island, Which System?, Errors Grow, The Date Line, The Pole Star Wanders, Your Hand Is a Protractor, Picard and the Meter, Was 1900 a Leap Year?
Map scenes use Esri World Imagery tiles (`V3SAT` in course-slides-v3.js; no key). CARTO basemaps now need an API key, so don't go back to them.

## Longitude concept slide: three standalone variations

`public/claude1/longitude/index.html` (live at /claude1/longitude/?v=a, ?v=b, ?v=c), separate from v3. One 1600×1000 canvas page, → or a tap to step, A/B/C keys switch versions. Uses `../coast.js`.
- A · Nature's Line, Our Line: the globe from the side; equator set by the spin, latitude as the Polaris angle, identical meridians, candidates for zero, the 1884 vote, then a 24-hour ring and 15° = 1 hour.
- B · The Earth Is a Clock: looking down on the North Pole with the Sun on the right; a fixed 24-hour dial, the 15° wedge, London and New York clocks, which clock is zero, then the ship that cannot carry Greenwich time.
- C · Two Questions, 2,000 Years Apart: latitude and longitude side by side (zero line, how you measure, the numbers), then a timeline with latitude solid since 325 BC and longitude at sea dashed until 1761.
