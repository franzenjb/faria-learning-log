---
title: "Plumb Line or Center of Mass? Why GPS Zero Is 335 Feet East of Greenwich"
summary: A plumb line hangs along local gravity, which nearby mass pulls a few arcseconds off; Airy's 1851 meridian was set by gravity, while GPS longitude is set by Earth's center of mass and spin axis, and at Greenwich the gap is about 5.3 arcseconds, or 335 feet.
session: 2026-11-14
order: 12
tags: [geodesy, physics, longitude, history-of-science, maps]
---
Stand on the brass line at Greenwich with a phone and it reads about 0.0015° west, not 0°. Walk about 335 feet (102 meters) east and it reads zero. Nobody moved the line, and continental drift did not do it. The two lines answer the same question, "which way is down?", in two different ways.

## Mass and Gravity: Two Different Things

**Mass** is how much stuff there is. **Gravity** is the pull that stuff makes. Every rock, hill and ocean basin pulls on everything else, and the pull is stronger the closer you are.

Earth's **center of mass** is its balance point: the one point that all of its mass averages to. Satellites orbit that point, because the whole Earth pulls them, and from 12,550 miles up the whole Earth looks like one point.

A **plumb line**, a weight on a string, hangs along the *total* pull of gravity at the spot where you stand. Almost all of that pull comes from the whole Earth. A little comes from what is nearby: a mountain, a block of dense rock, a valley with less rock in it. Mass is not spread evenly inside Earth, so the plumb line is nudged a tiny bit sideways. It does not point exactly where a perfect smooth Earth says "down" should be.

Geodesists call that tilt the **deflection of the vertical**. It is usually a few arcseconds. An arcsecond is 1/3,600 of a degree; see [degrees, arcminutes and arcseconds](../95-degrees-arcminutes-arcseconds/).

## Maskelyne Weighed the Earth With This Effect

The tilt is real and measurable, and the man behind the *Nautical Almanac* measured it. In 1774 Nevil Maskelyne set up observatories on the north and south sides of Schiehallion, a lone 3,547-foot mountain in Scotland. On each side, the mountain pulled his plumb line toward itself. Comparing the stars overhead from the two sides, he found the plumb lines differed by **11.6 arcseconds** more than distance alone explained. Charles Hutton then surveyed the mountain's volume. From how hard the mountain pulled compared with the whole Earth, they estimated Earth's average density, the first good estimate. Hutton's figure was about 4.5 times the density of water. The modern value is about 5.5.

## How Greenwich Got Its Line

Airy's Transit Circle of 1851 was set up to swing in a north-south plane. "Straight up" for that plane came from local gravity: the telescope was checked against a reflecting basin of mercury, whose surface lies flat across the local plumb line. So the 1884 prime meridian is an **astronomical** line. It is set by gravity at one spot in Greenwich Park, and by the stars.

GPS and the World Geodetic System (WGS 84) use **geodetic** coordinates instead. That frame is centered on Earth's center of mass, and its zero meridian is a plane that contains Earth's spin axis. Gravity at Greenwich plays no part in it.

## Why the Two Lines Are 335 Feet Apart

At Greenwich, local gravity is tilted about **5.3 arcseconds** in the east-west direction. As the world switched from telescopes to satellites in the 1980s, the keepers of the system made one rule: do not change the time. Universal Time had been measured for a century by meridian telescopes like Airy's, so the new zero meridian had to stay parallel to the old one.

So the new plane kept the old plane's direction but had to pass through Earth's spin axis. Shifting a 5.3-arcsecond tilt over to the axis moves the line across the ground. At Greenwich's latitude, one arcsecond of longitude is about 63 feet. Times 5.3, that is about **335 feet**.

A 2015 paper in the *Journal of Geodesy*, by Stephen Malys and colleagues, checked this with modern gravity models. The east-west tilt at Greenwich has the right direction and the right size to explain the whole offset. They also checked other old observatories and found the shift is local to Greenwich, not a shift in the world's longitude system. The old and new meridian planes are, in effect, parallel.

## Why It Matters for GIS

- A coordinate is only meaningful inside a named frame. "0°" by Airy's telescope and "0°" in WGS 84 are different lines.
- "Down" depends on what you measure it against. A surveyor's level follows gravity. A satellite's frame follows Earth's center of mass. Elevation datums, geoid models and the gap between "height above sea level" and "height above the ellipsoid" all come from this same difference.
- Earth's uneven mass is why gravity maps such as GRACE and the geoid exist at all.

## Sources
- Malys, Seago, Pavlis, Seidelmann and Kaplan, "Why the Greenwich meridian moved," *Journal of Geodesy* 89 (2015), 1263–1272: https://link.springer.com/article/10.1007/s00190-015-0844-y
- NASA ADS abstract for the 2015 paper: https://ui.adsabs.harvard.edu/abs/2015JGeod..89.1263M
- Smallwood, "The attraction of the pyramids," *History of Geo- and Space Sciences* 9 (2018), on Maskelyne's 11.6″ result: https://hgss.copernicus.org/articles/9/1/2018/
- The Greenwich Meridian, "WGS84 and the Greenwich Meridian": https://www.thegreenwichmeridian.org/tgm/articles.php?article=7

## Key facts
- Mass is how much stuff there is; gravity is the pull it makes. A plumb line follows the total local pull, which nearby mass tilts slightly.
- The tilt is called the deflection of the vertical, usually a few arcseconds.
- In 1774 Maskelyne measured 11.6″ of plumb-line deflection across Schiehallion and used it to estimate Earth's density.
- Airy's 1851 meridian is astronomical, set by local gravity (a mercury basin) and the stars.
- The WGS 84 / ITRF zero meridian is geodetic, set by Earth's center of mass and spin axis.
- At Greenwich the east-west deflection is about 5.3″; one arcsecond of longitude there is about 63 feet, so the GPS zero is about 335 feet (102 meters) east.
- The 2015 Journal of Geodesy paper showed the deflection explains the whole offset and that the shift is local, not global.
