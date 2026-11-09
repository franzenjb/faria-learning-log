# Converting the master presentation to the interactive deck

Source: *Where Am I? Six connected stories of measurement and mapping*, 78 slides, GIS Month 2026.
Target: `/deck/`, one dependency-free page where every slide is a working model with tappable terms and right-side cards.

## What already exists

| Master slides | Interactive deck today |
|---|---|
| 11, 18, 19, 22, 23 (latitude, celestial pole, Polaris) | Slide 1 globe: tap to stand, horizon and axis arrow, Polaris and Southern Cross cards |
| 41, 48, 49, 50 (longitude is a time, local noon, K1, minutes vs arcminutes) | Slide 1 chronometer: two dials, hold-at-noon, degrees-to-time card |
| 13, 14, 15 (Eratosthenes) | Slide 2 with zoom, Euclid card, flat-Earth toggle |
| 42, 43 (Jupiter's moons, lunar terrain) | Slides 3 and 4 in 3D |
| 36, 37, 38 (Tycho, Kepler, Earth's orbit as a baseline) | Slide 5 orrery, partially |
| 39, 40 (Venus as a worldwide ruler, three sites) | Slide 6 |
| 53, 54, 55 (Mason and Dixon) | Slide 7 |

Roughly 25 of 78 slides are covered. The remaining 53 fall into six sessions below.

## The six sessions as six chapters

The master deck is already structured as a course: *Mental maps · Earth & sky · Triangles · Clocks · Frames · Decisions*. The interactive deck should keep that spine. Each chapter opens with a chapter card (a menu like the title slide) and has three to six model slides.

### Chapter 1 · Mental maps (slides 3–10)

The strongest opening in the master deck: three quiz questions the audience gets wrong. Build it as a **live quiz slide** with the 3D globe behind it.

- **Havana due south.** Four answer buttons. On reveal the globe flies to Havana and drops a meridian line that misses South America, then draws the surface path. Same model shows the Reno/Los Angeles and Rome/Boston questions in turn (fly to each pair; draw the meridian or parallel).
- **Greenland vs Africa.** A projection morph: the globe unwraps into Mercator (continents stretch), then into an equal-area cylinder; a draggable Greenland cutout you can slide over Africa and count. Needs a map projection renderer, which is a new piece: one function from lat/lon to x/y per projection plus the animated morph. Reuse the coastline data.
- Audience response: buttons record a count in the page (local state) so the presenter can show "most of you said Peru".

### Chapter 2 · Earth and sky (slides 11–23)

Mostly built. Additions:

- **Local vertical (12).** On the globe, tap two places and see two plumb lines pointing to the centre. One tap away from the current observer model.
- **Great circle triangle (16).** Draw a triangle with three 90° angles on the globe (pole, two equator points), then flatten it to show 180°. A toggle on slide 1.
- **Nautical mile (17).** Scroll in on the globe until one arcminute of latitude fills the stage; label it 1,852 m / 6,076 ft. Uses the existing 160× zoom.
- **Star day vs Sun day (20).** A small orrery: Earth orbiting and rotating, with a marker; step one rotation and see the Sun not yet overhead; the 3 min 56 s shows as an extra sliver. Fits the Kepler slide's machinery.
- **Polaris offset and the "wave" (19, 21).** On the latitude card: a 0.7° circle around the true pole with Polaris on it turning through the night; the uncorrected latitude trace draws a sine wave of ±42 nautical miles.
- **Bowditch correction (22).** A three-step card: measure, table, corrected latitude. Glossary entry linked from the Polaris card.
- **Phone vs sky (23).** A live card: read the device's geolocation (with permission) and compare to the Polaris altitude from the globe tap. Only works on https, which Vercel gives us.

### Chapter 3 · Triangles (slides 24–38)

New chapter. One reusable model: a **triangle lab** where you drag vertices and the sides and angles update, and the slide text fills in the story.

- **Ladder (24, 25).** Drag the ladder's angle; sine, cosine, tangent read out as height ÷ ladder etc. The 30° case folds a 20 ft side in half.
- **Shadow height and Galileo (26).** The same lab in two modes: a stick's shadow (level ground + Sun angle) and the Moon mountain (already slide 4; cross-link).
- **Parallax with your finger (27, 28, 29).** A top-down eye diagram: drag the finger nearer or farther and watch the two sightlines cross; drag the baseline. Then the steeple: 1° at a 6 ft baseline gives 57 baselines. This is the warm-up for slide 6 and should sit right before Kepler.
- **Hipparchus and the eclipse (30, 31).** Two observers, one eclipse: Hellespont total, Alexandria four-fifths. Slider for the Sun's assumed distance moves the Moon's distance between 62 and 83 Earth radii, showing an answer needs its assumptions. Build on the Venus-transit parallax engine.
- **Moon's width from its distance (32, 33).** Given 240,000 miles and 0.5°, the circumference ÷ 720. Then the 2,100-mile disc dropped on a US map (Denver to Boston) using the coastline data and state lines.
- **Picard's baseline and the network (34, 35).** A triangulation game: measure one red baseline by chain, then tap stations to add triangles; every new side is computed, none measured. Zoom the globe to Villejuif–Juvisy.
- **Tycho and Kepler (36, 37, 38).** Already the orrery. Add the Mars baseline: two Earth positions 687 days apart with sightlines to the same Mars point, and a "to scale vs exaggerated" toggle (slide 38).

### Chapter 4 · Clocks (slides 39–52)

Mostly built. Additions:

- **Three observation sites timeline (40).** On slide 6, a calendar strip: Cape 1761 end only, Tahiti 3 June 1769, Baja 3 June, eclipse 18 June while ill, Chappe dies 1 August. Chapter 3 of the Mason–Dixon slide already has the Cape.
- **Jupiter's moons as a clock (42, 44, 45, 46).** On slide 3: predict an eclipse of Io, show the light-travel delay with Earth near and far (Rømer), then the Florence quiz: 9:14 pm vs 7:14 pm, which is 30° west of Florence, 18.75° W. A second mode on the Jupiter slide with a sightline from a moving Earth.
- **Civil time zones are not longitude (51).** On the chronometer view, overlay real zone boundaries: Galápagos UTC−6 vs mainland Ecuador UTC−5, and China's single zone. Needs a small time-zone outline dataset (clipped Natural Earth time zones, same pipeline as coastlines).
- **Cook's east coast (52).** On the Mason–Dixon globe engine: Cook's 1770 track along eastern Australia with the caption on Aboriginal peoples and "surveying is not consent". Reuse the chapter engine with a new chapter list; this could become its own Cook slide with Tahiti, the transit, K1 and the coast.

### Chapter 5 · Frames (slides 56–65)

New chapter and the most GIS-specific. One model: a **map frame lab**.

- **CRS (56, 57).** A grid with a point at (40, 30). Toggle the datum, units and origin and watch where the point lands. Then two layers drawn in different CRSs: wrongly overlaid vs converted. Fictional grids, as the master deck does.
- **Unequal longitude gaps (58).** The pole-down view already exists in the chronometer tilt: add a 15° wedge drawn at the equator and at 60° N with lengths 1,668 km / 1,036 mi and half of that.
- **Projection chooser (59).** Mercator vs equal-area, same sphere, live morph; hover a place for its area distortion. Shares the renderer with Chapter 1.
- **Straight is not shortest (60).** Drag A and B on the Mercator map; see the rhumb line stay straight and the great circle bend; flip to the globe where the great circle is straight and the rhumb line spirals.
- **0.1° near Key West (61).** Zoom to Key West; a circle of 11.1 km radius; tap to drop it anywhere and the radius stays the same in metres but changes on the Mercator view.
- **Precision vs accuracy (62).** A target with repeated readings you can scatter; a slider for digits shown; the readout refuses to call more decimals more evidence.
- **Fuzzy edges (63, 76).** A hazard polygon with an edge band and a site with a position band; drag either and the verdict reads "overlaps" or "clear", never a probability.
- **Rate vs total, doubling, log scales (64, 65, 74).** Three small interactive charts. Keep them brief; the dataviz skill's palette rules apply.

### Chapter 6 · Decisions (slides 66–77)

New chapter, Red Cross territory. The models should be deliberately plain and labelled fictional where the master deck does.

- **Telegraph network (66, 67, 68).** Observers A, B, C along a coast with a storm moving; wire messages race ahead of it; Viñes's three clues (pressure, wind, cloud) combine into a warning; Galveston: warning issued, shelter still collapses. An animated map on the globe engine with the Gulf coast coastline.
- **Wind definitions (69).** A table that becomes a live comparison: pick an agency and averaging period and see why the numbers differ, with the "no universal multiplier" warning.
- **Wind force (70, 71, 72, 73).** A slider from 100 to 200 mph: force rises as the square, power as the cube, with quadratic vs exponential shown side by side so the audience sees the difference in shape.
- **Hazard layers (75).** Wind, surge, rain, access as toggleable fictional layers over a fictional coast; the point is that they answer different questions.
- **Shelter decision (76, 77).** The fuzzy-edge model with three questions pinned beside it: where exactly, valid when, what changed. The closing card: question, evidence, frame and units, uncertainty, next check.

## Engineering notes

- **Projection renderer** is the one new core piece (Chapters 1 and 5). Add `project(lat, lon, kind, t)` with Mercator, cylindrical equal-area and orthographic, plus a morph parameter, and draw the existing coastline data through it.
- **Chapter engine** from the Mason–Dixon slide (camera flights, hotspots, cards, photo slots) generalises to Cook, the telegraph network and any story slide. Factor it into a function that takes a chapter list.
- **Quiz widget**: four buttons, a reveal, and a tally. Reused in Chapters 1, 4 and 6.
- **Datasets to add** via the same Natural Earth pipeline as `coast.js`: time-zone boundaries (clipped), US states nationwide (for the 2,100-mile disc and Galveston), Australia coast at 10 m for Cook.
- **Glossary** grows with each chapter; every term the master deck defines in a caption becomes a card.
- **Units**: miles first with km in brackets, as agreed. Nautical miles where the subject is navigation.
- **Speaker notes**: the master PDF's captions ("Fictional teaching example", "Schematic, not to scale") are honest and should carry over as the small caption under each stage.

## Order of work

1. Chapter 1 quiz slide with the globe reveals (fast, reuses everything, strong opener).
2. Projection renderer, then the Greenland/Africa morph and the Chapter 5 projection slides together.
3. Triangle lab (Chapter 3), finishing with the Mars baseline on the Kepler slide.
4. Jupiter-as-a-clock mode and the Florence quiz on slide 3.
5. Cook slide on the chapter engine.
6. Chapter 5 frame lab remainder (CRS, precision, fuzzy edges).
7. Chapter 6 decision models.
8. Presenter mode: speaker notes on a second screen and a chapter menu.

Each step is one pull request with the browser smoke test extended to cover it.
