---
title: "The sidereal day and latitude sailing"
summary: Why a star-day is 23h 56m, why the sky shifts 4 minutes a night, how Polaris's 0.7° wobble weaves a north-south wave like Jeff's oscilloscope, and how sailors 'ran down the latitude' — with Columbus as the cautionary case.
session: 2026-11-06
order: 3
tags: [astronomy, navigation, geography, history-of-science, words, etymology]
---
Jeff asked what **sidereal** means and why a day measured by the stars is only **23 hours 56 minutes**. Then he pictured what happens if you trust Polaris raw while sailing west: the track would "wiggle… like cycles on an oscilloscope." This page is both answers, plus the older sailor's trick of **latitude sailing**. It grows straight out of [Polaris](/topics/48-polaris/) and [Bowditch](/topics/49-bowditch/), and sits beside [Galileo](/topics/46-galileo/) (longitude as time) and [Map Surprises](/topics/47-map-surprises/).

## 1. The word: sidereal

**Sidereal** — pronounce **sy-DEER-ee-ul**.

From Latin **sidus**, genitive **sideris**, "star" (also "constellation, heavenly body"). Related English words: *sidereal*, *consider* (literally "with the stars," from an old sense of consulting the heavens), *desire* (from *de-sidus*, "down from a star," via a folk etymology of longing), and the astronomical *sidereal time*, *sidereal year*.

A **sidereal day** is a day measured against the **stars**, not against the Sun.

## 2. 23 h 56 m 4.09 s versus 24 h — and why

![Why a sidereal day is shorter than a solar day](../../img/Sidereal_vs_Solar_Day_Geometry_Tufte.png?v=1)
*Earth must turn ~1° extra each day to bring the Sun back overhead, because it has also moved ~1° along its orbit. Diagram drawn for this site (angle exaggerated).*

Two different "days":

| Kind of day | Length | What returns overhead |
|---|---|---|
| **Sidereal day** | **23 h 56 m 4.091 s** of mean solar time | A distant star (really: the vernal equinox) |
| **Mean solar day** | **24 h** exactly (by definition of civil time) | The mean Sun |

**Why the difference?** While Earth spins, it also moves along its orbit around the Sun — about **360° / 365.25 ≈ 0.986° per day**, "about a degree." After Earth has turned a full **360°** relative to the stars, the Sun has shifted by that ~1° in the sky. Earth must turn about **one more degree** to bring the Sun back to the same meridian. One degree of rotation takes **4 minutes** (because 360° × 4 min = 1440 min = 24 h). So the solar day is about **four minutes longer** than the sidereal day.

**Numbers Jeff asked about:**
- "Why only 56 minutes?" — because 24 h minus ~4 minutes is **23 h 56 m**. The precise figure is **23 h 56 m 4.091 s**.
- "366 sidereal days per year?" — yes, almost: in one **mean solar year** (~365.2422 mean solar days) Earth turns once extra relative to the stars, so there are about **366.2422 sidereal days** in a year. Roughly: **365 Sun-days, 366 star-days**.

## 3. Stars rise ~4 minutes earlier each night

Because the sidereal day is shorter, the starry sky runs **about 4 minutes ahead** of civil clocks each night. Consequences Jeff already uses without naming them:

- **~2 hours per month.** 4 min × 30 ≈ 2 hours. The same constellation rises two hours earlier after a month.
- **Seasonal constellations.** Over a year those daily 4-minute slips add up to a full 24 hours: winter evenings show Orion; summer evenings show Scorpius. Same sky, different clock time.
- **Right ascension in hours.** Astronomers measure sky-longitude in hours precisely because the sky turns 15° per hour — the same arithmetic as terrestrial longitude ([Galileo](/topics/46-galileo/), [Polaris](/topics/48-polaris/) §8).

## 4. Polaris's tiny circle — once per sidereal day

Polaris is about **0.7°** from the true north celestial pole (epoch ~2010: ~0.69°; ~0.66° in more recent figures; closest approach ~0.45° around **2100**). It therefore traces a small circle around the pole **once each sidereal day** (23 h 56 m), not once each solar day.

![Polaris circle and Big Dipper clock](../../img/Polaris_Circle_Big_Dipper_Clock_Tufte.png?v=1)
*Polaris's ~0.7° circle, with the Big Dipper pointers as a clock hand. Diagram drawn for this site.*

Only at **upper and lower transit** (when Polaris is due above or below the pole on the meridian) is its azimuth true north. The rest of the time its altitude is a little high or a little low compared with the observer's true latitude. Maximum error ≈ **0.7°**.

**How far is 0.7° on Earth?** One degree of latitude is **60 nautical miles** (that is the definition that makes the nautical mile useful). So **0.7 × 60 = 42 nmi** — about **48 statute miles**, or roughly the distance from Washington, D.C. to Baltimore. Trust raw Polaris and you can be almost a Baltimore-run off your parallel.

## 5. Jeff's insight: the oscilloscope wave

Jeff, thinking about sailing west while keeping Polaris at a fixed altitude:

> "You would wiggle your line… like cycles on an oscilloscope. You just kind of go a little left and right."

Almost perfect. The wiggle is **north–south**, not left–right (east–west), because altitude error is a **latitude** error. As Polaris rides its daily circle — high, then low — a helmsman who steers to "correct" the raw altitude weaves **above and below** the parallel. One full wave takes one **sidereal day**. Amplitude up to **±0.7° ≈ ±42 nmi**.

![Uncorrected Polaris track weaves like an oscilloscope](../../img/Polaris_Wavy_Track_Uncorrected_vs_Corrected_Tufte.png?v=1)
*Uncorrected (red): a north–south sine wave across the parallel. Corrected with tables (green): nearly flat. Diagram drawn for this site from Jeff's insight.*

**The fix** is exactly what [Bowditch](/topics/49-bowditch/) teaches: read the **Big Dipper** like a clock, look up the Polaris correction, apply it. The wave flattens into a straight parallel. Modern *Nautical Almanac* tables (*a0*, *a1*, *a2*) do the same job.

And the oscilloscope image is not a stretch: the curves an oscilloscope draws in XY mode are **Lissajous figures**, also called **Bowditch curves**, first studied by Nathaniel Bowditch in **1815**. Jeff reached for the navigator's own mathematics without knowing it.

## 6. Latitude sailing: "running down the latitude"

Before sailors could find **longitude** at sea, they could still find **latitude** — from the Sun at noon, or from Polaris at night. So a standard tactic was:

1. Sail north or south until you reach the **latitude of your destination**.
2. Turn east or west and **hold that latitude** (keep Polaris, or the noon Sun, at the right height) until land appears.

This is called **latitude sailing**, **parallel sailing**, or **"running down the latitude."** You follow a **rhumb line** along a parallel: constant compass heading, constant latitude. It is *not* the shortest path on a globe (that is a **great circle**), but it is the path you can find again tomorrow with only a quadrant and a compass.

**Why it mattered.** Longitude at sea was the unsolved problem until **John Harrison's** marine chronometers in the 1760s (and, for the poor, workable lunar-distance methods that Bowditch helped teach). See [Galileo](/topics/46-galileo/) for the earlier dream of timing Io's eclipses. Latitude was the only line you could trust. So you aimed for the right parallel and ran along it.

## 7. Columbus 1492: mostly that idea, with a caveat

![Columbus 1492 route via the Canaries along ~28°N](../../img/Columbus_1492_Latitude_Sailing_Canaries_Tufte.png?v=1)
*Columbus dropped south to the Canaries (~28°N), then sailed mostly west near that parallel; on 7 October he turned southwest and made landfall in the Bahamas (~24°N). Map drawn for this site.*

**Christopher Columbus**, first voyage, **1492**:

- Left **Palos**, Spain, **3 August**.
- Dropped south to the **Canary Islands** at about **28°N** — a deliberate move into the easterly trade winds and onto a useful parallel.
- From the Canaries he sailed **mostly west**, by **compass** and **dead reckoning**, near that latitude. He was not yet a Polaris-table navigator in the Bowditch sense; the star method became routine later. But the *logic* is latitude sailing: get on the parallel, hold west.
- On **7 October**, seeing flocks of birds, he turned **southwest**.
- Landfall **12 October** in the **Bahamas**, around **24°N** — south of the 28°N parallel he had been roughly holding. (Which island is still argued: traditionally San Salvador / Watling.)

So: Columbus is the textbook illustration of "drop to the latitude, then run west," with the honest footnote that he steered more by compass and log than by nightly Polaris altitudes, and that his final days left the parallel on purpose.

## 8. Rhumb line versus great circle

A quick GIS distinction for the talk:

| Path | What it is | On a Mercator chart |
|---|---|---|
| **Rhumb line** (loxodrome) | Constant compass bearing | A **straight** line |
| **Great circle** | Shortest path on the sphere | A **curve** (unless it is the equator or a meridian) |

Latitude sailing along a parallel is a special rhumb line (bearing due east or due west). Airlines and great-circle sailing prefer the shorter curved path; sixteenth- and seventeenth-century ocean sailors preferred the rhumb they could hold with a compass. That is why Mercator charts were invented: so a rhumb looks straight.

## Review questions

1. Pronounce **sidereal** and give its Latin root.
2. Why must Earth turn ~1° *extra* each solar day?
3. If Polaris is 0.7° off the pole, what is the maximum latitude error in **nautical miles**, and why?
4. Jeff said the uncorrected track would wiggle "left and right." What is the one-word correction to that picture?
5. What is **"running down the latitude,"** and why did sailors use it before chronometers?

## Key facts
- **Sidereal** (sy-DEER-ee-ul) ← Latin *sidus, sideris* "star."
- Sidereal day = **23 h 56 m 4.091 s**; mean solar day = 24 h; difference ≈ 4 min because of ~1°/day orbital motion.
- ≈ **366.24 sidereal days** per mean solar year (one extra turn relative to the stars).
- Stars rise ~4 min earlier each night → ~2 h/month → seasonal constellations.
- Polaris ~0.7° from the pole; circles it once per sidereal day; raw altitude error up to **±42 nmi**.
- Jeff's insight: uncorrected track = north–south **oscilloscope wave**; Bowditch / Almanac tables flatten it. Those curves are themselves Bowditch/Lissajous figures.
- **Latitude sailing / parallel sailing / "running down the latitude"**: reach the destination's latitude, then hold east/west on that parallel (a rhumb). Used because longitude at sea was unsolved before chronometers (and practical lunars).
- Columbus 1492: Canaries ~28°N, then mostly west; turned SW 7 Oct; Bahamas landfall ~24°N.
- Rhumb (constant bearing, straight on Mercator) ≠ great circle (shortest, curved on Mercator).

## Answers
1. **sy-DEER-ee-ul**; Latin *sidus / sideris*, "star."
2. Because Earth also advanced ~1° along its orbit; after a 360° spin relative to the stars, the Sun has moved, so Earth needs ~1° more rotation (~4 min) to bring the Sun back overhead.
3. **42 nmi**, because 1° of latitude = 60 nmi, and 0.7 × 60 = 42.
4. **North–south** (a latitude error), not east–west.
5. Sail to the destination's latitude, then hold east or west along that parallel until land appears. Latitude could be measured from the sky; longitude at sea could not (until chronometers / lunars).
