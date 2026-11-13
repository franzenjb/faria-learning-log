---
title: "Celestial Navigation and Earth's Geometry"
summary: Polaris stood about 12° from the true pole around 100 BC and about 3.5° in 1492; one degree of latitude is 60 nautical miles everywhere, but a degree of longitude shrinks as the cosine of latitude.
session: 2026-11-13
order: 2
tags: [astronomy, geography, history-of-science, navigation]
---
The North Star has not always been a good pole star. How far Polaris sits from the true north celestial pole has changed over the centuries, and that gap mattered to anyone who used the star to find latitude. The same geometry that slowly moves the pole also explains why a degree of latitude is a fixed distance, while a degree of longitude shrinks as you go north, and why "100 nautical miles west" is not a fixed number of degrees.

## 1. Polaris and the wandering pole

Earth's spin axis slowly wobbles, like a top running down. One full wobble, called **precession**, takes about 26,000 years (more precisely about 25,770). The point in the sky the axis aims at, the **north celestial pole**, therefore creeps among the stars.

Around **100 BC**, Polaris was about **12°** from that true pole, a little more than the width of your fist at arm's length. It was not a pole star yet. The Greek astronomer Hipparchus, and the earlier explorer Pytheas, both described the pole as an empty patch of sky, with no bright star sitting on it. Kochab, in the Little Dipper, was then the nearer bright star, but still many degrees off.

By **1492**, when Columbus sailed, the gap had closed to about **3.5°**, roughly seven Moon widths. Today, in 2026, Polaris is about **0.63°** from the pole, a little under two-thirds of a degree. It will come closest around **2100**, at about **0.45°**, just under half a degree. Then it will drift away again. In about 12,000 years, **Vega** will be the north star, though it will stay about 5° or 6° from the pole, a much coarser guide than Polaris is now.

![Polaris's angular distance from the true north celestial pole, from 100 BC to AD 2100. Four points are labeled: about 12° in 100 BC, 3.5° in 1492, 0.63° in 2026, and 0.45° around 2100.](../../img/Polaris_Distance_from_True_North_Celestial_Pole_100BC_to_2100.png)
*Drawn for this lesson. The curve is Earth's precession carrying the pole toward Polaris. After 2100 the gap opens again.*

The same idea, with more on the star itself, is on the [Polaris](../48-polaris/) page.

## 2. The pointer stars

On any clear northern night you can find Polaris without knowing the sky well. The two stars at the front of the Big Dipper's bowl, **Merak** and then **Dubhe**, point to it. Draw a line from Merak through Dubhe and keep going about five times that span: you land at Polaris, at the end of the Little Dipper's handle.

## 3. The Regiment of the North Star

If you take Polaris's height above the horizon as your latitude, you are a little off, because the star is not exactly on the pole. In 1492 that error was about 3.5°, which is more than 200 nautical miles of latitude. Portuguese and Spanish navigators used a correction called the **Regiment of the North Star**.

They watched the two **Guard stars** of the Little Dipper, **Kochab** and **Pherkad**, the ones at the outer edge of its bowl. The line from Polaris toward the Guards was treated like the hand of a clock. A table listed **eight positions** of that hand, and for each one it told you how many degrees to add or subtract from Polaris's height. The listed corrections themselves ran from about half a degree to 3.5°.

The table was coarse: eight marks, like a clock with only eight hours. Even used carefully it could leave a few tenths of a degree of error. The bigger trouble was the ship. Holding a quadrant or an astrolabe steady on a rolling deck easily added another half degree or more. A careful navigator, taking several sightings and averaging them, usually came out within about **half a degree to a degree** of true latitude, roughly **30 to 60 nautical miles**. That is a practical range, not a single official figure.

How a later instrument, the sextant, takes the same height is on [The sextant](../87-sextant-and-latitude-at-sea/).

## 4. Columbus

Celestial navigation was not Columbus's strength. In late October and November 1492, off Cuba, his quadrant repeatedly gave **42° north**. He was actually near **21° north**, around modern Nuevitas, about 21° too far north. He knew the number could not be right: 42° north is the latitude of Chicago or Rome, not a hot Caribbean coast. He blamed the quadrant and stopped taking readings until it could be "fixed."

One careful modern suggestion is that, in the dark, he may have read the instrument's tangent scale instead of its degree scale. The arctangent of 0.42 is about 22.8°, close to his true latitude. A later reading of 34°, at a true position near 19° or 20° north, likewise sits near the arctangent of 0.34, about 18.8°. It is a plausible explanation, not a proof.

What Columbus did well was **dead reckoning**: keeping a running estimate of course and distance from speed, time, and heading. On that same voyage he noticed Polaris moving in a small circle each night, and he saw his compass needle drift away from the star, one of the first recorded notes of **magnetic variation** at sea.

## 5. A degree of latitude, and the nautical mile

Latitude is different from longitude in one important way. **One degree of latitude** is the same distance almost everywhere on Earth: **60 nautical miles**, which is about **69 statute miles**, the ordinary land miles we use in the United States.

Why 60? A full circle is 360 degrees, and each degree is split into **60 arcminutes**. One **nautical mile** was defined to be **one arcminute of latitude**. So:

> 1 degree of latitude = 60 arcminutes = 60 nautical miles

The international nautical mile is now a fixed length, exactly **1,852 meters**, which comes out to about 1.151 statute miles. Sixty of them are about 69 statute miles.

Earth is not a perfect sphere. It is slightly flattened at the poles, so a degree of latitude is a little shorter near the equator (about 68.7 statute miles) and a little longer near the poles (about 69.4). For ordinary navigation, 60 nautical miles, or about 69 statute miles, is the figure to remember. The splitting of a degree into 60 minutes is also on [Degrees, arcminutes, and arcseconds](../95-degrees-arcminutes-arcseconds/).

## 6. Degrees of longitude shrink

A degree of longitude is 60 nautical miles only at the equator. As you go north or south, the circles of constant latitude get smaller, so the same 1° of longitude covers less ground. The rule is the same cosine you already met for [eastward ground speed](../97-eastward-ground-speed-and-the-cosine-of-latitude/):

> 1° of longitude ≈ 60 nautical miles × cosine of the latitude

![One degree of longitude shrinks toward the poles: a polar view of Earth, and the curve 60 times the cosine of latitude. Labeled values: 60 nautical miles at the equator, 52 at 30°, 42 at 45°, 30 at 60°, and 0 at the pole.](../../img/Longitude_Degree_Width_Shrinks_with_Latitude.png)
*Drawn for this lesson. On the left, meridians meet at the pole, so the east-west span of a degree shrinks. On the right, the same rule as a curve.*

| Latitude | cos φ | Nautical miles in 1° of longitude |
|---|---|---|
| 0° (equator) | 1 | 60 |
| 30° | 0.866 | about 52 |
| 45° | 0.707 | about 42 |
| 60° | 0.50 | 30 |
| 90° (pole) | 0 | 0 |

That is why **"100 nautical miles west"** does not name a fixed change in longitude. You have to know the starting latitude.

- At the **equator**, 100 nautical miles is 100 ÷ 60 ≈ **1.67°** of longitude.
- At **60° north**, one degree of longitude is only 30 nautical miles, so the same 100 nautical miles is 100 ÷ 30 ≈ **3.33°** of longitude: twice as many degrees for the same ground distance.

Sailors use nautical miles for route distance, and **knots** for speed. One knot is one nautical mile per hour.

## 7. Two kinds of mile

The **statute mile**, 5,280 feet, is a land measure. It comes from the Roman *mille passus*, "a thousand paces," which was 5,000 Roman feet. In 1593 an English statute, the Act against New Buildings, fixed the mile at eight furlongs, and each furlong at 40 rods of 16½ feet, which is 5,280 feet.

The nautical mile comes from Earth's geometry: one arcminute of latitude. It is the mile that belongs to the globe. The word *nautical* itself is the sailor word, from the same root as [astronaut](../02-astronaut-and-nautical/).

## 8. Harrison's clock, and longitude

Latitude from the stars was a solved problem by the late 1400s, at least to a few tens of miles. Longitude was not. Earth turns 360° in 24 hours, so every hour of time is **15° of longitude**. If you know the time at Greenwich, and you know local noon where you are, the difference in hours, times 15, is your longitude.

That is only useful if the clock you carry keeps time at sea. John Harrison's fourth marine timekeeper, **H4**, had its first sea trial in 1761–62, on a voyage to Jamaica. On arrival, in January 1762, it was only about five seconds slow, a tiny error in longitude. The Board of Longitude was not satisfied that the watch's daily rate had been properly agreed, and a second trial, to Barbados, followed in 1764. The arithmetic of turning hours into degrees is on the [time-to-longitude](../70-time-to-longitude/) lesson; the story of H4, the later reward, and the copy Cook carried is on [Harrison's chronometer](../84-harrison-and-the-marine-chronometer/).

## 9. The Southern Cross, a southern pointer

The south celestial pole has no bright star on it. The nearest naked-eye star, **Sigma Octantis**, also called Polaris Australis, sits about 1° from the pole, but it is faint, about magnitude 5.4. In a dark sky you might just see it. As a navigator's mark it is almost useless.

So southern sailors use geometry instead, the way northern sailors use Merak and Dubhe. The long axis of the **Southern Cross**, from **Gacrux** at the top through **Acrux** at the foot, points toward the pole. That foot, Acrux, is about **27°** from the true south celestial pole today. Extend the axis about **4½ times** the length of the Cross past Acrux, and you land close to the pole, within a few degrees. A second line checks the first: take the two **Pointers**, **Alpha** and **Beta Centauri**, draw the line between them, and raise a perpendicular from the midpoint. Where that perpendicular meets the extended axis of the Cross is the same patch of sky. The two **Magellanic Clouds**, looking like faint scraps of the Milky Way, sit in that same far-southern sky and help you confirm you are looking in the right place.

The 4½-length rule is tuned to today's sky. Precession has been carrying the south celestial pole toward the Cross, so Acrux was farther from the pole in the past: about **38°** around 100 BC, and about **30°** in 1492.

The Cross is **circumpolar**—it never sets—only from about **33° south** and farther south. Farther north it rises and sets. In antiquity it could be seen from the Mediterranean. Ptolemy, working in Alexandria in the second century, counted its bright stars as part of **Centaurus**, not as a constellation of their own. Precession later carried the Cross below Europe's horizon. European sailors met it again in the southern ocean. Amerigo Vespucci wrote of the four southern stars after his voyage of 1501–02. Andrea Corsali, in a letter published in **1516**, described them clearly as a cross and printed the first picture of them. Antonio Pigafetta, who sailed with Magellan, wrote of a "marvelous cross" around 1520 and noted that it was used to take heights.

## 10. Winds did half the steering

The stars told you where you were, or at least how far north or south. The winds decided whether you could get there.

In the tropics, the **trade winds** blow steadily. In the North Atlantic they are the **northeast trades**: they come from the northeast and carry a ship west. Farther north, in the mid-latitudes, the **westerlies** blow from the west and carry a ship back east.

Columbus used both. He sailed south to the **Canary Islands**, then west on the northeast trades to the Caribbean. He did not try to come home by the same path, which would have meant fighting those trades. He worked north until he found the westerlies, and rode them home by the Azores.

Portuguese sailors had already learned that lesson along the African coast. The easy run south, with the trades and the current, was a hard slog home if you tried to beat back the same way. Their answer was the **volta do mar**, the "turn of the sea": stand out into the open Atlantic, swing north, and catch the westerlies for Europe. It felt wrong, because you first sailed away from home. It was the right use of the wind.

A ship can sail upwind, but not straight into it. It **tacks**: it zigzags, close to the wind, first on one side and then on the other. Tacking against a steady trade is slow, hard on the rig, and miserable for the crew. That is why captains went the long way with the wind, rather than the short way against it. The stars and the clock could tell you your place. The wind still did half the steering.

The printable lesson sheet: [Celestial Navigation and Earth's Geometry (PDF)](/downloads/Faria_Celestial_Navigation_and_Earth_Geometry_2026-11-13.pdf).

## Key facts
- Around 100 BC Polaris was about 12° from the true north celestial pole; about 3.5° in 1492; about 0.63° in 2026; closest around 2100 at about 0.45°.
- Precession of Earth's axis takes about 26,000 years. In about 12,000 years Vega will be the north star, though about 5° or 6° off the pole.
- The Big Dipper's pointer stars, Merak and Dubhe, lead to Polaris.
- The Regiment of the North Star used the Little Dipper's Guard stars, Kochab and Pherkad, like a clock hand with eight positions, to correct Polaris's height.
- After that correction, a careful navigator usually got within about 0.5° to 1° of latitude, roughly 30 to 60 nautical miles, with deck motion the larger source of error.
- Columbus recorded 42°N off Cuba, true about 21°N. He relied on dead reckoning, which he did well.
- 1° of latitude = 60 arcminutes = 60 nautical miles ≈ 69 statute miles, almost the same everywhere. 1 nautical mile is now exactly 1,852 meters.
- 1° of longitude ≈ 60 nmi × cos(latitude): 60 at the equator, 52 at 30°, 42 at 45°, 30 at 60°, 0 at the pole.
- "100 nautical miles west" is about 1.67° of longitude at the equator, but about 3.33° at 60°N.
- The statute mile (5,280 feet) is an English land measure from 1593, with a Roman root. The nautical mile comes from Earth's geometry. Speed at sea is in knots: one nautical mile per hour.
- H4's first sea trial was the 1761–62 voyage to Jamaica. 1 hour of time = 15° of longitude.
- The south celestial pole has no bright star. Sigma Octantis is about 1° from the pole, but only about magnitude 5.4. Acrux, at the foot of the Southern Cross, is about 27° from the pole today, about 30° in 1492, and about 38° around 100 BC.
- To find south: extend the long axis of the Cross, Gacrux through Acrux, about 4½ lengths, and check with the perpendicular bisector of the Pointers, Alpha and Beta Centauri. The Cross is circumpolar only from about 33°S and farther south.
- Ptolemy counted the Cross as part of Centaurus; it was visible from the Mediterranean in antiquity. Vespucci, Corsali (1516), and Pigafetta, who sailed with Magellan, brought it back into European writing.
- Winds did half the steering. Columbus went west on the northeast trades from the Canaries and came home on the mid-latitude westerlies. The Portuguese volta do mar used the same idea. Tacking—zigzagging upwind—is a poor way to fight a steady trade.
