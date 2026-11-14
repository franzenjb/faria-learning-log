---
title: "GPS: Clocks in the Sky"
summary: GPS is Harrison's idea turned around, with atomic clocks in orbit; the first satellite flew in 1978, civil use was promised after Korean Air 007 in 1983, the system was declared fully operational in 1995, and every fix is a timing problem solved with four satellites.
session: 2026-11-14
order: 10
tags: [navigation, physics, geodesy, maps, history-of-science]
---
John Harrison put a good clock on a ship, so a navigator could compare local time with Greenwich time and find longitude. GPS turns that around. The clocks are in the sky, and your receiver listens to them. Every position GPS gives you starts as a measurement of time. The old story is on [Harrison's chronometer](../84-harrison-and-the-marine-chronometer/), and the arithmetic of turning time into degrees is on [time to longitude](../70-time-to-longitude/).

## From test satellite to utility

- **1978.** The first Block I test satellite launched from Vandenberg Air Force Base, California, on 22 February 1978. Eleven Block I satellites flew between 1978 and 1985.
- **1983.** On 1 September 1983, Korean Air Lines Flight 007 strayed into Soviet airspace and was shot down. All 269 people aboard were killed.
- **1995.** The full constellation of 24 working satellites was in place by April 1995. The Air Force formally announced full operational capability on 17 July 1995. Sources cite both dates.
- **2000.** Selective Availability, a deliberate blurring of the civil signal, was turned off. GPS.gov says it ended "a few minutes past midnight EDT after the end of May 1, 2000." That is early on 2 May in UTC, so both May 1 and May 2 appear in print.

## The 1983 promise

On 16 September 1983, two weeks after the shootdown, Deputy Press Secretary Larry Speakes read a White House statement. It said "the President has determined that the United States is prepared to make available to civilian aircraft the facilities of its Global Positioning System when it becomes operational in 1988."

Note the words. It promised GPS to civil aviation, once the system was working. It did not say "free GPS for everyone, now." Historians also point out that civil use had been planned from the start. The 1983 statement made that promise public and firm. GPS was not fully operational until 1995, not 1988.

## How a fix works

Each satellite carries atomic clocks and broadcasts two things: where it is, and exactly what time it is. Your receiver notes when each signal arrives. The delay, times the speed of light, gives the distance to that satellite.

Light travels about **one foot per nanosecond**. A nanosecond is a billionth of a second. So a clock error of just one millionth of a second, a microsecond, is about 1,000 feet of error in distance.

That is the catch. Your phone does not carry an atomic clock. Its clock is off by an unknown amount. So the receiver has four unknowns, not three: east-west, north-south, up-down, and its own **clock bias**. Four unknowns need four measurements. That is why a receiver needs at least **four satellites** for a three-dimensional fix. Each distance puts you on a sphere around one satellite. The receiver finds the one point, and the one clock correction, where the spheres agree. The method is called trilateration, since it uses distances, not angles.

With more satellites in view, the receiver can average out errors and check itself.

## Einstein in orbit

GPS satellites orbit about 12,550 miles up, and move fast. Relativity changes how fast their clocks tick, as seen from the ground.

- Their speed makes them run slow, by about **7 microseconds a day** (special relativity).
- Weaker gravity up high makes them run fast, by about **45 microseconds a day** (general relativity).
- The net: about **38 microseconds a day** fast.

At one foot per nanosecond, 38 microseconds is about 38,000 feet, or roughly seven miles. Left alone, that error would grow every day. Engineers set the satellite clocks to tick slightly slow before launch, so they keep correct time once in orbit.

## WGS 84: the frame behind the numbers

GPS gives positions in the **World Geodetic System 1984**, or WGS 84. It is an Earth-centered frame with its own shape for Earth, set in meters. Its zero of longitude runs about 102 meters (335 feet) east of the old Greenwich line. That story is on [the 1884 Meridian Conference](../106-the-1884-meridian-conference/).

## GIS today: Field Maps, accuracy, datums

GPS.gov says a smartphone is typically accurate to about **16 feet (4.9 meters)** under open sky. Near buildings, bridges and trees it gets worse. The government's own promise is about the signal in space, not your device. It promises a range error of no more than about 6.6 feet (2.0 meters), 95 percent of the time.

ArcGIS Field Maps can record more than the point. It can save the position source, the horizontal accuracy and the fix type, if your layer has those fields. Esri's own example: for a damage assessment, a point within 10 feet may be enough. For an underground pipeline, you need a few centimeters, which takes a high-accuracy receiver and corrections.

Then there is the datum. Most U.S. survey data is in NAD 83, not WGS 84. The National Geodetic Survey says NAD 83 is off Earth's center by about 2.2 meters, about 7 feet. NGS plans to replace NAD 83 with new frames, such as NATRF2022, tied to the international frame. NGS says that when the change comes, U.S. coordinates will shift by as much as about four meters, or 13 feet. A careful field crew asks three questions: How accurate was the fix? Which datum is it in? Was a transformation applied?

## Sources
- GPS.gov, "GPS Accuracy": https://www.gps.gov/gps-accuracy
- GPS.gov, "Selective Availability": https://www.gps.gov/selective-availability
- Ronald Reagan Presidential Library, Statement by Deputy Press Secretary Speakes, 16 September 1983: https://www.reaganlibrary.gov/archives/speech/statement-deputy-press-secretary-speakes-soviet-attack-korean-civilian-airliner-1
- Richard Pogge, Ohio State University, "GPS and Relativity": https://www.astronomy.ohio-state.edu/pogge.1/Ast162/Unit5/gps.html
- NOAA National Geodetic Survey, "New Datums": https://geodesy.noaa.gov/datums/newdatums/index.shtml
- Esri, ArcGIS Field Maps, "Prepare for high-accuracy data collection": https://doc.arcgis.com/en/field-maps/latest/prepare-maps/high-accuracy-data-collection.htm

## Key facts
- First Block I GPS satellite: 22 February 1978.
- Korean Air Lines Flight 007 was shot down 1 September 1983. The White House statement of 16 September 1983 offered GPS to civilian aircraft once operational.
- Full operational capability: constellation complete April 1995, formally announced 17 July 1995.
- Selective Availability ended just after midnight EDT at the end of 1 May 2000, which is 2 May in UTC.
- A 3-D fix needs four satellites: three for position, one for the receiver's clock bias.
- Light travels about one foot per nanosecond; a 1-microsecond clock error is about 1,000 feet.
- Relativity: satellite clocks run about 38 microseconds a day fast (45 gained from gravity, 7 lost from speed).
- Smartphones: about 16 feet under open sky. NGS says NAD 83 is misaligned to Earth's center by about 2.2 meters (7 feet).
