---
title: "From a Venus transit to the Cepheids"
summary: Kepler's clock gives the shape of the solar system, the Venus transits of 1761 and 1769 turn that shape into a length, Earth's orbit becomes the baseline for stellar parallax, and a calibrated Cepheid period-luminosity relation carries distances across the Milky Way and beyond.
session: 2026-11-06
order: 5
tags: [astronomy, history-of-science, mathematics]
---
Jeff, the [Polaris](/topics/48-polaris/) page called a Cepheid a yardstick, and the [Harvard Computers](/topics/51-harvard-computers/) page showed where Henrietta Leavitt's straight line came from. This page is the road under that yardstick. Four rungs, in order:

1. **Kepler's third law** gives planetary distances *relative to Earth's orbit*. It does not give miles.
2. **Transits of Venus in 1761 and 1769**, timed from widely separated places, turn that relative map into a length. The thing measured is a *difference* of parallaxes, read from durations or from contact times, not one angle taken at one station and not a latitude by itself.
3. Once the astronomical unit is a known length, **Earth's orbit is a baseline**. A nearby star's annual shift against the background is its parallax. January and July are a teaching pair, not a rule for every star. The first success, Bessel in 1838, used a heliometer, not a photograph.
4. **Leavitt's period-luminosity relation** tells which Cepheid is intrinsically brighter than which other one. It does not, by itself, say how many watts a ten-day Cepheid emits. Later calibrations, anchored on parallax and on other rungs, pin that zero point. Then Cepheids measure distances across the Milky Way and out into other galaxies.

A printed copy of this whole lesson, with the same four diagrams, is [Venus transit to Cepheid distances (PDF)](/downloads/Venus_Transit_to_Cepheid_Distances_Faria_Lesson_2026-11-06.pdf).

![Orbits of Mercury, Venus, Earth, and Mars to scale, the 0.277 AU gap marked, and an ellipse showing that the semimajor axis is not one day's distance](../../img/Kepler_Third_Law_Orbit_Ratios_Tufte.svg?v=1)
*Kepler's third law drawn for this lesson. The orbits are circles of the right semimajor axes. The ellipse at right has its eccentricity exaggerated so the focus is obvious. Jupiter and Saturn are in the table and off the drawing.*

## 1. The clock, and what it measures

In 1619 Johannes Kepler published *Harmonices Mundi* (*The Harmony of the World*). In Book 5 he stated what we still call his third law. In his words, the ratio of the periodic times of any two planets is the **sesquialterate** proportion of their mean distances: the 3/2 power. If Earth is the unit,

> **a cubed, over T squared, is the same number for every planet.**

T is the sidereal period in Earth years. a is the **semimajor axis** in astronomical units. Set Earth's year and Earth's semimajor axis both to 1, and the shared number is 1. Then

> **a = T to the power 2/3.**

"Mean distance," in Kepler's language, is this a. It is half the long axis of the ellipse. It equals the average of the closest distance and the farthest distance. It is **not** the distance on a Tuesday.

Look at the ellipse on the diagram. The Sun sits at a focus, not at the center. The long axis is 2a. The segment marked a runs from the center to either end. The line from the Sun to "distance on a given day" has a different length. For Venus the difference is small, because the orbit is nearly round (eccentricity about 0.0068). For a comet it is the whole story. The law never said "the distance right now."

**A deeper step, if you want it.** Newton showed why the number is shared. For a small planet around a heavy sun,

> a^3 / T^2 = G (M + m) / (4 pi squared),

where M is the Sun's mass and m is the planet's. A planet is a speck beside the Sun (Venus is a few parts per million of the solar mass), so M + m is almost the same M for every planet, and Kepler's constant is almost exact. The leftovers in a modern table, once the periods are rounded, sit at about a part in a thousand or smaller. They are not a crack in the law.

**Worked arithmetic for Venus.** NASA's Venus fact sheet gives a sidereal period of **224.701 days**. Earth's sidereal year is **365.256 days**.

- 224.701 / 365.256 = **0.61519** year.
- Square it: 0.61519 squared = **0.3785**.
- The semimajor axis is the cube root of 0.3785. Try 0.72: 0.72 cubed = 0.373. Try 0.723: 0.723 squared = 0.5227, times 0.723 = **0.3779**. Close enough: **a = 0.723 AU**.

The fact sheet's own semimajor axis is **0.723332 AU**. The clock and the modern orbit agree. The same rule, with rounded sidereal periods, fills the table on the diagram: Mercury 0.387, Mars 1.524, Jupiter 5.20, Saturn 9.54.

**The law was not the only road to a ratio.** Venus never strays much past about **46 degrees** from the Sun. In a circular picture, the sine of that greatest elongation *is* the size of Venus's orbit in AU. sin 46 degrees = **0.719**, and the modern a is 0.723. Copernicus already had that triangle. What the third law adds is a single rule that ties every planet's *period* to the same scale, including Mars, Jupiter, and Saturn, for which there is no "greatest elongation" of the Venus kind. The transit calculators of the 1760s used that relative model. They were not inventing the shape. They were trying to put a mile on it.

## 2. The simplified gap, and why it is simplified

Put the orbits in a flat circle and line the planets up on the near side of the Sun, as the dots on the diagram do. Earth's orbit is 1 AU. Venus's is 0.723 AU. The gap is

> **1 - 0.723 = 0.277 AU.**

That is the Earth-Venus separation at inferior conjunction **in this model**: circular, coplanar, and using the semimajor axes as if they were the distances that day.

Three real complications, none of which wreck the lesson:

- The orbits are ellipses. Venus's Sun-distance runs from about 0.718 to 0.728 AU, Earth's from about 0.983 to 1.017. The radial gap at a real conjunction is near 0.277 AU and is not identical to it.
- Venus's orbit is tilted about **3.4 degrees** to Earth's. The true separation is a little larger than the difference of the two solar distances, except near the nodes, which is exactly where a transit can happen.
- "Conjunction" means the same ecliptic longitude, not "the smallest possible 3-D gap on an average Tuesday."

So 0.277 AU is the right number to *think* with. A reduction of a real transit uses the orbital elements for that week. Nobody in 1769 subtracted 0.723 from 1.000 on a slate and called the result the measured distance.

## 3. A ratio is not a mile

An astronomical unit, in the eighteenth century, meant "Earth's semimajor axis, whatever that is in feet." Kepler hands you Venus at 0.723 of that unit. He does not hand you the unit.

The transit measures an *angle*: the **solar parallax**. The horizontal solar parallax is the angle subtended by Earth's equatorial radius as seen from a distance of 1 AU. Once you have that angle, and once you know Earth's radius in miles from a survey,

> **AU = Earth's radius / the parallax, in radians.**

The survey is the old problem on the [Eratosthenes](/topics/18-eratosthenes-measures-the-earth/) page, done much more carefully by 1769. Earth's size was already known far better than the Sun's distance. The blur in the transit era was the angle, not the radius. Halley, in 1716, still had to remind his readers how bad the old guesses were: Ptolemy at 1,200 Earth radii, Kepler at almost 3,500, and his own working hypothesis of 12.5 arcseconds, which is about 16,500 Earth radii. The modern figure is about **23,500** Earth radii. The expeditions were trying to settle a number that learned men still had wrong by a large factor.

## 4. Three different parallaxes

This is the step that gets flattened in a hurry, so it is worth going slowly.

**Solar parallax**, written here as pi-sun, is Earth's radius seen from the Sun. The modern value is about **8.794 arcseconds**. It is no longer an independent mystery: the astronomical unit is a defined length (below), Earth's equatorial radius is about **6,378.137 km**, and the angle follows.

> 6,378.137 / 149,597,870.7 = 0.000042635, in radians.
> Times 206,265 arcseconds in a radian = **8.794 arcseconds**.

**Venus's parallax** is the same baseline seen from Venus. In the circular model Venus is 0.277 AU away at inferior conjunction, so

> pi-Venus is about pi-sun / 0.277, which is about **3.61 times** the solar parallax.

**The differential parallax** is what two observers actually see as a disagreement in where Venus sits *on the Sun*. Both bodies shift when you move your eye. The nearer one shifts more. The relative shift is the difference:

> pi-Venus minus pi-sun is about **(3.61 - 1) times pi-sun = 2.61 times the solar parallax**.

Check the arithmetic the long way. 1 / 0.277 = 3.610. Subtract 1. That is 2.610. If you insert the modern solar parallax only to see the size of the effect, 2.61 times 8.79 arcseconds is about **23 arcseconds**.

Read that 23 carefully. It is an **illustrative ceiling**, not a number from a logbook. It is the track separation you would get if the projected baseline were a full Earth radius and lay square across the line of sight. A real pair of stations is a shorter chord of the Earth, tilted to the Sun, so the separation on the disk is smaller than 23 arcseconds. The diagram labels the ceiling as a ceiling.

Halley himself, in 1716, did the same kind of arithmetic with a *trial* parallax, and he said so. He supposed the solar parallax was 12.5 arcseconds "till its precise quantity be made to appear more certain by the trial I propose." On that supposition he put Venus's parallax at 43 arcseconds, "almost 4 times" the Sun's (43 / 12.5 = 3.44, so he was using an Earth-Venus distance near 0.29 AU, close to our 0.277 and not identical). Subtract, and "there will remain half a minute at least" for the parallax of Venus *from* the Sun. Half a minute is 30 arcseconds. That is his hypothesis. It is not a measurement, and it is not the modern 8.8 arcseconds.

![Two stations see Venus shifted differently against the Sun; the tracks are two chords whose durations Halley compared; a black drop blurs internal contact](../../img/Venus_Transit_Two_Observers_Parallax_Tufte.svg?v=1)
*Schematic, drawn for this lesson. Earth, Venus, and the angles are much too large. The 23 arcseconds in the note is the illustrative ceiling above, not a 1769 observation. North is up on the solar disk: a northern station sees the nearer planet shifted south.*

## 5. Halley's clock, and Delisle's clock

Edmond Halley watched a transit of Mercury from St Helena in 1677. Mercury is too far, at a transit, for its parallax to stand well clear of the Sun's. Venus at inferior conjunction is the useful one: nearer, larger differential, rare. He published the method in the *Philosophical Transactions* in **1716** (*Methodus singularis*, volume 29, number 348, page 454). He would be dead before 1761. The paper is a set of instructions to the next generation.

**What he asked them to time.** Not a tiny angle on a divided circle. He had already said that single seconds of arc, even ten seconds, defeat the instruments of the day. He asked for the **duration**: the local time from internal ingress (contact 2, when Venus has just come fully onto the disk) to internal egress (contact 3, when it is about to leave). A clock that runs truly between those two moments is enough for the duration. An error in the absolute longitude mostly cancels, because you subtract two readings on the same clock.

Why a duration is a parallax: the stations see Venus travel different **chords** of the Sun. A chord nearer the center is longer, so the transit lasts longer. The difference of durations, the known speed of Venus across the disk, and the known direction of the path turn back into an angle: the separation of the chords. That separation is the **differential** parallax for the **projected baseline** between the stations. Divide by the geometric factor (about 2.61 in the simple model; the real factor uses that month's distances) and you have the solar parallax. Then the AU, in Earth radii, is the reciprocal of that angle in radians.

Halley's own trial numbers show the proportion, and only the proportion. He reckoned that if the solar parallax were 12.5 arcseconds, the duration at Hudson Bay would exceed the duration in the East Indies by about **17 minutes**. A larger observed difference would mean a larger parallax, in nearly the same ratio. He thought two seconds of time would pin the parallax to a small fraction of an arcsecond, and the distance to one part in five hundred. Hold that hope lightly. He also assumed a path that Venus did not take. In 1761 she passed much nearer the Sun's center than his 4 minutes of latitude, his favored stations were wrong for the whole duration, and a later note on the translation records an error in the angle of the path. The 17 minutes is a worked example under stated assumptions. It is not the 1769 result, and it is not a number to paste onto Cook's journal.

**Delisle's method** is the other half of the campaign. Joseph-Nicolas Delisle, who had visited Halley, proposed timing **one** internal contact at two stations in absolute time. You no longer need both ingress and egress, so a station that sees only the entrance, or only the exit, still counts. The price is the longitude. Both clocks have to be reduced to one meridian, and the east-west part of the baseline matters as much as the north-south part. Halley's duration is forgiving of a bad absolute clock and hungry for a complete transit. Delisle's instant is forgiving of a cloud in the middle of the afternoon and hungry for a known longitude. Eighteenth-century longitude was the harder measurement. Neither method is "stand on a latitude and measure one angle."

The projected baseline is the component that actually separates the chords or shifts the contact time: the station-to-station line as seen from the Sun, square to the line of sight, and then taken along the direction that matters for the path. Two towns at the same latitude, far apart in longitude, are useless for a pure north-south chord shift and very useful for a timing method. Two towns on the same meridian, far apart in latitude, are Halley's classic pair. The map coordinate you print is not the baseline. The geometry of that day is.

## 6. Who went, and what "Siberia" means

Transits of Venus come in pairs eight years apart, then not again for more than a century. Jeremiah Horrocks and William Crabtree saw the transit of **1639** from England. There was no distant second station, so Halley's comparison could not be made. The coordinated campaigns are **1761** and **1769**.

**1761, 6 June.** The French Academy sent Jean-Baptiste Chappe d'Auteroche overland to **Tobolsk**, in western Siberia. He got there, timed a lunar eclipse to fix the longitude, and, in clear weather and with armed protection (local feeling blamed the strange instruments for a flood), watched the whole transit. He published the observations; the journey became *Voyage en Sibérie* (1768). Charles Mason and Jeremiah Dixon, sent toward Bencoolen in Sumatra and diverted by war and weather, observed from the **Cape of Good Hope**. Dozens of other stations in Europe took part. The published solar parallaxes from this transit scattered by several tenths of an arcsecond.

Mikhail Lomonosov, watching from St Petersburg, reported a luminous ring at the limb and argued that Venus has an atmosphere. The atmosphere is real. How much of what he saw was the atmosphere, and how much was the optics of a bright edge, is still argued. Keep that ring separate from the black drop below. One is a bright aureole. The other is a dark neck that spoils a clock reading.

**1769, 3 June at Tahiti and 4 June at stations far to the east**, the same transit on two local dates. The Royal Society sent James Cook in the *Endeavour*, with the astronomer Charles Green, formerly Maskelyne's assistant at Greenwich. They anchored in Matavai Bay on **13 April 1769**, built Fort Venus on the point still called Point Venus, and had a clear day. Cook, Green, and Daniel Solander observed. Cook's journal records the gift and the trouble in one breath: not a cloud, and yet

> "we very distinctly saw an Atmosphere or dusky shade round the body of the Planet which very much disturbed the times of the Contacts particularly the two internal ones."

He adds that he, Green, and Solander "differ'd from one another in observeing the times of the Contacts much more than could be expected." The times and the drawings of that ligament were published in the *Philosophical Transactions* for **1771** (volume 61, pages 397-421), Green named with Cook. Green did not live to finish the voyage home.

**The black drop.** Near internal contact, Venus seems to stay tied to the Sun's limb by a dark neck, so the moment of "internal contact" is a judgment spread over many seconds. It is tempting to blame Venus's air, and Cook's "dusky shade" points that way. Mercury, which has almost no atmosphere, shows a black drop too. The neck is mostly the telescope's blur acting on the Sun's darkened limb. The atmosphere produces a different, real, bright rim. The practical result in 1769 was the same either way: Halley's hoped-for single second of time was not what the observers could agree on.

**Russia in 1769** is a network, not one Siberian dot. Stepan Rumovsky, director of the Academy observatory, organized it under Catherine II, with observers from Russia, Germany, Sweden, and Geneva. The stations, from the IMCCE chronological table and the Siberian local-history accounts, were:

| Station | Who | Where it actually is |
|---|---|---|
| Yakutsk | Ivan Isleniev; the Siberian encyclopedia also names F. Chernyi, while the IMCCE table says an unnamed companion | On the Lena, deep in Siberia. The Siberian station. |
| Orsk | Christoph Euler | Southern Urals, the edge of Europe and Asia, not deep Siberia |
| Orenburg | Wolfgang Ludwig Krafft | Same edge |
| Guriev | Petr Inokhodtsev and Georg Moritz Lowitz | Caspian shore, now Atyrau, Kazakhstan |
| Kola | Rumovsky | Kola Peninsula, European Arctic |
| Ponoi | Jacques Andre Mallet | Kola Peninsula |
| Umba | Jean-Louis Pictet | Kola Peninsula |
| St Petersburg | Anders Lexell and colleagues | The capital |

Isleniev's party was in the Yakutsk region from June 1768 to August 1769. The published work includes Venus leaving the Sun, Jupiter's satellites for the longitude, and coordinates that later improved the Academy's maps. Do not fold every Russian station into the word Siberia, and do not move Chappe's **1761** Tobolsk into 1769.

Other 1769 stations that matter for the geometry, and that are not Siberia: Maximilian Hell and Janos Sajnovics at **Vardo** in northern Norway; William Wales and Joseph Dymond at Prince of Wales Fort on **Hudson Bay**, the northern station Halley had named in 1716; and Chappe again, this time at **San Jose del Cabo** in Baja California. He observed the transit on 3 June and died in the epidemic there on 1 August 1769. The observations were carried back.

No single station, and no single transit, printed the modern astronomical unit. The 1761 reductions disagreed among themselves. The 1769 campaign was better and still left a spread. Johann Franz Encke's careful combination of both transits, published in **1824**, gave **8.5776 arcseconds**, with an uncertainty he put near 0.037. That is about 0.22 arcsecond below the modern 8.794, which makes the Sun about **2.5 percent too far** (8.794 / 8.5776 is about 1.025). A revision in 1835, after a dispute over Hell's times, moved it only to about 8.571. The transits of **1874 and 1882** brought photography and another generation of reductions. Simon Newcomb's later synthesis sat near **8.79 to 8.80 arcseconds**, close to what we use, and still not a definition frozen on transit day. Radar echoes from Venus, in the twentieth century, measured a distance in kilometres by the travel time of a signal. The transit had become history. The geometry it taught had not.

## 7. The number we actually use

On 31 August 2012 the International Astronomical Union, in Resolution B2, redefined the astronomical unit as a conventional length:

> **exactly 149,597,870,700 metres.**

The symbol they asked for is **au**. The old definition, tied to the Gaussian gravitational constant and to the Earth's orbit, was retired. The Earth's real Sun-distance still changes through the year, from about 0.983 au at perihelion to about 1.017 au at aphelion. "One au" is no longer a synonym for "however far the Sun is today."

In international miles, 1,609.344 metres to the mile:

> 149,597,870,700 / 1,609.344 = **92,955,807 miles**,

which is **92.96 million miles** if you round to the hundredth of a million. That is the figure to remember. It is a definition, inherited from the best radar-era estimates, not a stopwatch reading from Tahiti.

## 8. The orbit as a baseline

You now have a stick. It is one au long, and you know that length in metres. Look at a nearby star in two seasons, from opposite sides of the stick, and the star shifts against the distant background. That shift is the **annual parallax**.

Hold a finger at arm's length and blink each eye. The finger jumps. The nearer it is, the larger the jump. The distant wall barely moves. Earth's orbit is the gap between the two eyes. The star is the finger.

![Earth on opposite sides of its orbit, January and July illustrative, the full background shift marked 2p and the one-au angle marked p](../../img/Stellar_Parallax_January_July_Tufte.svg?v=1)
*Drawn much too close, or the angle would be invisible. January and July are the right pair for a star in this direction. Another star wants other months. Bessel's 1838 measurement was a heliometer angle, not a pair of photographs.*

**p and 2p.** The parallax angle p is the angle at the star subtended by **1 AU**, not by the full width of the orbit. The star's apparent jump from one side of the orbit to the other is **2p**. Textbooks that say "the parallax is the shift from January to July" are describing 2p and naming p. The definition that makes the distance formula clean is the half-shift:

> **distance in parsecs = 1 / p**, with p in arcseconds.

One parsec is the distance at which 1 AU subtends one arcsecond. A tenth of an arcsecond means ten parsecs. A parsec is about 3.26 light-years, or about 206,265 AU.

**January and July are a drawing, not a calendar rule.** They are opposite, and they are the right pair when the star lies square to the January-July line, as on the diagram. A star somewhere else on the ecliptic wants the two dates when Earth is on opposite sides of the Sun *as seen from that star*. Those dates slide around the year with the star's ecliptic longitude. A star near the ecliptic pole traces a small circle, and any opposite pair will do. What you must not do is observe in January and February and call the tiny piece of the orbit a baseline of 2 AU.

**The first success was not a photograph.** Friedrich Wilhelm Bessel, at Konigsberg, used a Fraunhofer **heliometer**: a telescope whose objective lens is cut in half, so the two halves can be slid until a nearby star and a comparison star coincide. He chose **61 Cygni** for its large proper motion, a hint that it is near, and because the pair can be measured cleanly. In 1838, in *Astronomische Nachrichten*, he published

> **p = 0.3136 arcsecond, give or take 0.0202.**

He turned that into 657,700 sun-distances and a light-time of **10.3 years**. The modern parallax is about **0.286 arcsecond**, near **11.4 light-years**. He was close, and he was first to publish a result that the errors could not swallow.

Two others were on the same problem. Thomas Henderson had measured Alpha Centauri from the Cape in 1832-33 and published in 1839, after Bessel. Wilhelm Struve measured Vega; a preliminary notice is 1837 and the fuller result 1840, and it was less accurate. "Bessel, 1838" is the right first *success*. It is not a claim that nobody else was looking.

Photography cannot be the method, because it was not ready. Daguerre's process was announced in 1839. The first successful photograph of a star, Vega, was made at Harvard by John Adams Whipple and William Cranch Bond on 17 July 1850. A pair of plates, January against July, is a clear way to *explain* the geometry, and it is how later parallax programs worked. It is not what Bessel did. The [Polaris](/topics/48-polaris/) page uses the January/July picture for the finger-blink. That picture is fair teaching. The instrument in 1838 was the split lens.

Polaris itself is a warning about easy parallaxes. It is the nearest classical Cepheid, and the distance fight on that page (Hipparcos near 432 light-years, a spectroscopic "short" distance near 323, Gaia near 446) exists because a companion and a pulsation sit on top of a tiny angle. The nearest famous star is not the easiest calibrator.

## 9. Brightness is not distance

A star can look faint because it is dim, or because it is far, or because dust is in the way. **Apparent** brightness is what the plate records. **Intrinsic** brightness, the luminosity, is what the star emits.

Light spreads over a sphere. Double the distance and the same light covers four times the area, so the flux falls to a quarter. That is the **inverse-square law**. In magnitudes, with distance d in parsecs and no dust,

> **m - M = 5 log10(d) - 5.**

m is the apparent magnitude. M is the absolute magnitude, the apparent magnitude the star would have at 10 parsecs. If dust dims the star by A magnitudes, add A to the right-hand side. Ignore the dust and you will set the star too far.

**A purely illustrative sum, not a real star.** Suppose a calibrated relation says some Cepheid has absolute magnitude -4.0, and you measure its apparent magnitude as 16.0, and you ignore dust. The difference m - M is 20. Then

> d = 10 to the power of (20 + 5) / 5 = 10 to the 5th = **100,000 parsecs**.

The arithmetic is the whole point. The -4.0 was *supplied*. Nothing in the period, by itself, wrote that -4.0 down.

## 10. What Leavitt measured, and what she did not

The [Harvard Computers](/topics/51-harvard-computers/) page has her life, the plates, and the plot of all 25 stars. The facts that matter for the ladder are these.

The Small Magellanic Cloud is a cloud of stars at essentially **one** distance. (The depth of the cloud is real and small beside the distance.) Stars in that cloud can be faint because they are faint, not because one of them is vastly farther. Difference in apparent brightness is difference in luminosity.

In 1908, in *Annals of the Harvard College Observatory*, volume 60, Leavitt wrote that it was worthy of notice that **the brighter variables have the longer periods**, and that the sample was still small. In **Harvard College Observatory Circular 173**, 3 March 1912, "prepared by Miss Leavitt" and issued over Pickering's name, she had 25 periods. On a plot of magnitude against the logarithm of the period, "a straight line can readily be drawn." She gave the slope in her own words: the logarithm of the period increases by about **0.48** for each increase of one magnitude in brightness. The average swing from maximum to minimum was about 1.2 magnitudes. And, because they share a distance, "their periods are apparently associated with their actual emission of light."

That is the **slope**. A longer period means a more luminous star, by a definite step on that line.

It is not the **zero point**. The circular is careful. The magnitudes are on a provisional photographic scale. When she says "absolute scale of magnitudes," she means tying those faint comparison stars to a standard sequence, the North Polar Sequence. She does not mean the modern M, which already requires a distance. The closing hope is explicit:

> "It is to be hoped, also, that the parallaxes of some variables of this type may be measured."

In 1912 those parallaxes were out of reach. A classical Cepheid's parallax is a few thousandths of an arcsecond. The period told her which star was brighter than which other star in the Cloud. It did not tell her how far the Cloud was, in parsecs, until someone pinned the line to a luminosity.

![Four rungs of the distance ladder, and a sketch of a period-luminosity line whose slope is known while its zero point can still slide](../../img/Cepheid_Distance_Ladder_Calibration_Tufte.svg?v=1)
*The ladder drawn for this lesson. Distance increases upward. The graph is a sketch of a sliding zero point, not a replot of Leavitt's 25 stars; those are on the Harvard Computers page. The arrow can slide either way. Measurement decides which way.*

## 11. Pinning the line

**Ejnar Hertzsprung, in 1913**, made the first rough zero point from the motions of galactic Cepheids: a statistical parallax, not a clean trigonometric one. **Harlow Shapley, around 1918**, revised that calibration and used it to size the Milky Way and to put the Sun off center. The revision was bold and partly wrong. He mixed classical Cepheids, the bright young pulsators of Leavitt's Cloud, with fainter stars of similar light curves in globular clusters (Type II Cepheids, and the RR Lyrae stars then called cluster variables). Interstellar dust was not yet in the sum. The zero point in use came out too faint by about **1.5 magnitudes**.

**Edwin Hubble**, on plates of 1923, found a Cepheid in the Andromeda "nebula." The result read to the astronomers in 1925 placed Andromeda far outside the Milky Way, on Shapley's scale. The island-universe question was answered. The miles were still short.

**Walter Baade, in 1952**, separated the two families. A classical, Population I Cepheid is about 1.5 magnitudes brighter than the Population II star of the same period that had been sitting on the same line. A magnitude difference of 1.5 is a distance factor of 10 to the power 1.5/5, which is 10 to the 0.3, which is **about 2**. The galaxies jumped outward. That was not a new slope from the Cloud. It was a new pin.

Dust, if you want the extra care: grains dim a star and redden it. Leave them out and the inverse-square distance is too large. A color excess estimates the dimming. Metallicity is a smaller, real shift: Cloud Cepheids are poorer in heavy elements than Cepheids near the Sun, and the luminosity at a given period depends slightly on that composition. Overtone pulsators, which complete a cycle in a shorter period than the fundamental tone, must not be dropped onto the fundamental line. Polaris is a nearby check and an awkward one. The pin is a crowd of Cepheids with geometric distances, not one star.

The modern pin is geometric. Parallaxes of Milky Way Cepheids, and of Cepheids that belong to open clusters whose distances are also parallaxes, put luminosities on the line directly. Gaia's data releases are the current basis of that work; one 2023 cluster study (Cruz Reyes and Anderson, *Astronomy & Astrophysics*) is an example of a zero point at the one-percent level, and of the remaining argument over a tiny parallax offset. Hubble Space Telescope parallaxes of Galactic Cepheids did the same job a generation earlier, with fewer stars. The top of the ladder, where Cepheids calibrate Type Ia supernovae and those supernovae measure the expansion, is still debated. The debate is about a few percent and about the next rung. It is not a return to "we have no idea how far."

Cepheids are bright: thousands of times the Sun, and the slow ones brighter still. They are visible across the Milky Way, in the Magellanic Clouds where Leavitt found them, in Andromeda, and, with a telescope in orbit, in galaxies tens of millions of light-years away that also hosted a supernova. The rung is not "inside our galaxy and then a wall." The wall is the next method.

## 12. The four rungs, said once

| Rung | What you use | What you get | What you still do not have |
|---|---|---|---|
| Kepler, 1619 | Periods, and a^3 / T^2 | a in AU. Venus 0.723. Gap about 0.277 in the circular model | Miles |
| Transits, 1761 and 1769 | Durations or contact times, a known baseline, Earth's radius | The AU as a length, to a few percent; refined for two centuries after | A single transit's exact modern metre |
| Parallax | The AU as a baseline | parsecs = 1 / p. Nearby stars, including nearby Cepheids | A luminosity for a Cepheid you cannot resolve |
| Cepheids, calibrated | Leavitt's slope, plus a zero point from parallax and later rungs | Distances across the Milky Way and into other galaxies | The supernova rung beyond them |

Today the second rung is a definition plus radar history. The shape of the argument is unchanged. A ratio, then a length, then an angle against the stars, then a clock inside a star whose brightness that angle has taught you.

## Try the arithmetic again

1. Venus takes 0.615 year. Square it. You should be near 0.378. What cube root, to three decimals, brings you back?
2. In the circular model, what is 1 minus that cube root?
3. 1 / 0.277 is about 3.61. What is the differential factor, and what illustrative angle is 2.61 times 8.79 arcseconds?
4. A star has p = 0.25 arcsecond. How many parsecs? About how many light-years, at 3.26 light-years to the parsec?
5. Two Cepheids have the same apparent brightness. One has twice the period of the other. What else do you need before you can say which is farther?

## Review questions

1. What does a shared a^3 / T^2 give you, and what does it refuse to give you?
2. Why is the semimajor axis not the distance today?
3. Where does the 0.277 AU come from, and what three facts make it a model rather than a transit-day measurement?
4. Name the solar parallax, Venus's parallax, and the differential parallax. Which one moves the black spot differently for two observers?
5. What did Halley tell observers to time, and why is that not one angle at one place?
6. Why does Delisle's method need longitude, while a duration mostly cancels a bad absolute clock?
7. Who observed at Tahiti on 3 June 1769, and which 1769 station is the one deep in Siberia? Where was Chappe in 1761, and where was he in 1769?
8. What did Encke publish in 1824, and why is "the transit gave us 92.96 million miles" false?
9. In the parallax drawing, what is p, what is 2p, and why are January and July only examples?
10. What instrument did Bessel use in 1838, and why is a photograph the wrong picture of that measurement?
11. What did the Small Magellanic Cloud do for Leavitt that a scatter of Milky Way Cepheids could not, and what did she still ask for?
12. Why did Baade's 1.5 magnitudes roughly double the distances to galaxies?

## Glossary

- **Semimajor axis (a).** Half the long axis of an elliptical orbit. The average of the nearest and farthest distances from the focus. Kepler's "mean distance."
- **Astronomical unit (au).** Since 2012, exactly 149,597,870,700 metres. Historically, the Earth's semimajor axis.
- **Inferior conjunction.** An inner planet between the Earth and the Sun, on the near side. A transit is an inferior conjunction that also crosses the Sun's disk.
- **Solar parallax.** The angle subtended by Earth's equatorial radius at a distance of 1 au. About 8.794 arcseconds.
- **Differential parallax.** Venus's parallax minus the Sun's, the shift of Venus relative to the solar disk. About 2.61 times the solar parallax in the circular model.
- **Projected baseline.** The station-to-station separation as it appears from the Sun, in the direction that changes the chord or the contact time. Not the latitude printed on a map.
- **Internal contacts.** Contact 2, Venus fully onto the disk, and contact 3, about to leave. Halley's duration runs from 2 to 3.
- **Black drop.** The dark neck that makes internal contact uncertain. Mostly optical. Not the same thing as Venus's bright atmospheric rim.
- **Parallax angle p.** The angle at a star subtended by 1 au. The full side-to-side shift is 2p. Distance in parsecs is 1/p if p is in arcseconds.
- **Parsec.** The distance at which 1 au subtends 1 arcsecond. About 3.26 light-years.
- **Heliometer.** A telescope with a split objective, used to measure small angles. Bessel's instrument.
- **Apparent magnitude m.** How bright a star looks.
- **Absolute magnitude M.** How bright it would look from 10 parsecs. A measure of luminosity.
- **Period-luminosity relation.** Longer period, higher luminosity, for a given family of Cepheids. Leavitt found the slope. The zero point is the pin that turns the slope into a distance.
- **Zero point.** Where the line sits vertically: the actual luminosity at a chosen period. Sliding it changes every distance and leaves the slope alone.
- **Standard candle.** An object whose luminosity you know, so apparent brightness gives distance by the inverse-square law.

## Sources

These are the works the numbers and the names come from. Expedition lists disagree about assistants; where they disagree, the lesson says so.

- Kepler, *Harmonices Mundi* (Linz, 1619), Book 5. The sesquialterate proportion of the periodic times to the mean distances.
- NASA Goddard Venus Fact Sheet, for the semimajor axis 0.723332 AU, the sidereal period 224.701 days, and the orbital eccentricity and inclination used as the "real orbit" corrections.
- Halley, "Methodus singularis," *Philosophical Transactions* 29 (1716), no. 348, p. 454. English translation in the 1809 abridgement, reprinted by Fred Espenak at NASA Goddard. The 12.5 arcsecond trial, the 43 arcsecond Venus parallax, the half-minute differential, and the 17-minute example are all his hypothesis.
- Suzanne Debarbat on Delisle's one-contact method, in the *Journal of Astronomical Data* 19 (2013), and the account of Halley's durations against Delisle's longitudes in the transit-campaign literature (the 1760 *mappemonde* and the later syntheses).
- Cook and Green, "Observations made, by appointment of the Royal Society, at King George's Island in the South Sea," *Philosophical Transactions* 61 (1771), 397-421. Cook's journal for 3 June 1769, in J. C. Beaglehole (ed.), *The Journals of Captain James Cook*, vol. 1 (1968), for the "dusky shade" and the disagreement on contacts.
- IMCCE, chronological table of the Venus transit expeditions (the 2004 transit-history project), for the station list: Tobolsk, the Cape, Tahiti, Yakutsk, Orsk, Orenburg, Guriev, Kola, Ponoi, Umba, St Petersburg, Vardo, Hudson Bay, San Jose del Cabo.
- Library of Siberian Local History, entries on the Yakutsk astronomical expedition of 1768-69 and on Isleniev: Rumovsky's direction, Yakutsk as the Siberian station, and F. Chernyi named beside him.
- Chappe d'Auteroche, observations at Tobolsk, 6 June 1761, in the *Histoire de l'Academie royale des sciences* for 1761, and *Voyage en Siberie* (1768). His 1769 Baja California expedition and death on 1 August 1769 are in the standard biographies and in the French expedition accounts.
- Encke's 1824 solar parallax 8.5776 arcseconds, and the 1835 revision near 8.571, as summarized by Andreas Verdun, *Archives des Sciences* 57 (2004), and by the historical survey arXiv:1402.1945. Newcomb's later value near 8.79-8.80 arcseconds is from his re-reductions for the American Ephemeris papers.
- IAU Resolution B2 (2012), Beijing: the astronomical unit is exactly 149,597,870,700 metres.
- Bessel, "Bestimmung der Entfernung des 61sten Sterns des Schwans," *Astronomische Nachrichten* 16 (1838); English in *Monthly Notices of the Royal Astronomical Society* 4 (1838), 152-161. The 0.3136 and 0.0202 arcseconds, and the 10.3 years, are his. The heliometer is described in the AAS "This Month in Astronomical History," November 2021.
- Leavitt, *Annals of the Harvard College Observatory* 60 (1908), and Harvard College Observatory Circular 173 (3 March 1912). Quotations from the circular as transcribed by the AIP Center for History of Physics. The 25-star figure is on the [Harvard Computers](/topics/51-harvard-computers/) page.
- Walter Baade's 1952 separation of the two Cepheid populations, as told by Allan Sandage, "The First 50 Years at Palomar," and the standard factor: 1.5 magnitudes, about twice the distance. Hubble's Andromeda Cepheid is the 1923-25 result.
- Cruz Reyes and Anderson, "A 0.9% calibration of the Galactic Cepheid luminosity scale based on Gaia DR3," *Astronomy & Astrophysics* (2023), as one modern geometric pin, not as the last word.

## Key facts
- Kepler, 1619: a^3 / T^2 is shared. a is the semimajor axis, the average of nearest and farthest, not the distance today.
- Venus: period 224.701 days = 0.615 year, so a = 0.723 AU. Circular coplanar gap at inferior conjunction: 1 - 0.723 = 0.277 AU. Real conjunctions are near that, not identical to it.
- Greatest elongation near 46 degrees already gave sin 46 = 0.72 by geometry. The third law extends one scale to every planet.
- The transit measures a differential parallax, about 2.61 times the solar parallax in the simple model, using a projected baseline. Halley compared durations of internal contacts. Delisle compared one contact in absolute time and needed longitude. Not one angle, and not latitude alone.
- Halley's 12.5 arcseconds, 43 arcseconds, and 17 minutes are his 1716 trial, not results. An illustrative ceiling of about 23 arcseconds assumes one Earth radius, side-on, and the modern 8.79 arcsecond solar parallax. It is not a logbook entry.
- 1761: Chappe at Tobolsk, Siberia, 6 June. Mason and Dixon at the Cape. 1769: Cook, Green, and Solander at Point Venus, Tahiti, 3 June; Isleniev at Yakutsk, the deep-Siberian station, in Rumovsky's wider Russian network. Hell was at Vardo, not Siberia. Chappe's 1769 station was Baja California.
- The black drop spoiled contact times. It is mostly telescope blur and the Sun's dim limb. Venus's atmosphere is a separate bright rim. Mercury shows a black drop too.
- Encke 1824: 8.5776 arcseconds, about 2.5 percent too small, so the Sun too far. No one transit delivered the modern au.
- Since IAU 2012 Resolution B2, 1 au = 149,597,870,700 m exactly, about 92.96 million miles. Earth's actual distance still varies from about 0.983 to 1.017 au.
- Stellar parallax: full opposite-orbit shift is 2p; the defined p is the angle of 1 AU; parsecs = 1/p in arcseconds. January and July are illustrative. Bessel, 1838, 61 Cygni, heliometer, 0.3136 arcsecond. Photography of stars begins later (Vega, 1850).
- Leavitt 1908 and Circular 173 (1912) fixed the slope from SMC stars at one distance. She asked for parallaxes. She did not set the zero point. Hertzsprung and Shapley tried; Baade in 1952 separated two Cepheid families and roughly doubled the extragalactic distances. Gaia-era parallaxes pin the luminosity now. Cepheids reach across the Milky Way and into other galaxies.

## Answers

**Arithmetic.** (1) 0.723 AU. (2) 0.277 AU. (3) The factor is 2.61. 2.61 times 8.79 is about 23 arcseconds, an illustrative ceiling, not a measurement. (4) 4 parsecs, about 13 light-years. (5) The calibrated period-luminosity relation, so you know which period is the more luminous. Equal apparent brightness plus a known luminosity ratio gives the distance ratio. The period ratio alone does not.

**Review.** (1) Relative distances in AU. Not miles, and not the distance on a given day. (2) It is half the long axis, the average of closest and farthest. A point on the ellipse lies at some other distance from the focus. (3) From 1 minus 0.723 in a circular, flat model. Real orbits are ellipses, tilted by about 3.4 degrees, and a conjunction is a shared longitude, so the gap that week is computed from the elements. (4) Solar parallax: Earth's radius at 1 au, about 8.794 arcseconds. Venus's parallax: the same baseline at Venus's distance, about 3.61 times larger in the model. Differential: the difference, about 2.61 times the solar parallax. The differential is what shifts Venus on the disk. (5) The duration from internal contact 2 to internal contact 3. The difference of durations is a difference of chords, which is a differential parallax across a known projected baseline. (6) One contact has to be timed on a shared absolute clock, so the longitudes must be known. A duration subtracts two times on one local clock, so an overall clock error mostly cancels. The places still have to be known. (7) Tahiti: Cook, Green, and Solander, 3 June 1769. Deep Siberia in 1769: Isleniev at Yakutsk. Chappe was at Tobolsk in 1761 and at San Jose del Cabo in 1769. (8) 8.5776 arcseconds. It is about 2.5 percent smaller than the modern solar parallax, and the modern mile-length is a 2012 definition, 149,597,870,700 metres, after radar. The expeditions got the scale to a few percent and did not finish it. (9) p is the angle subtended by 1 AU. The full shift from one side of the orbit to the other is 2p. January and July fit the star on the diagram. Another ecliptic longitude wants another pair, still about six months apart. (10) A Fraunhofer heliometer at Konigsberg. The first stellar photograph, Vega, is 1850. Plates are a later way to explain the same angle. (11) A common distance turns apparent-brightness differences into luminosity differences, so period can be matched to luminosity without already knowing the miles. She still asked that parallaxes of brighter variables of the type be measured. That request is the missing zero point. (12) 1.5 magnitudes is a factor of 10 to the power 0.3, about 2, in distance. The galaxies were about twice as far as the old pin had said.
