---
title: "Time to longitude: converting hours, minutes, and seconds to degrees"
summary: Earth turns once in twenty-four hours of solar time, which is 360 degrees. Two hours and thirty-five minutes behind Greenwich is 38 degrees 45 arcminutes west, or 38.75 degrees, and -38.75 degrees in the common signed convention.
session: 2026-11-07
order: 18
tags: [astronomy, mathematics, geography]
---
Earth turns once relative to the mean Sun in twenty-four hours of solar time. That full turn is three hundred sixty degrees of longitude. Divide evenly and each hour of solar-time difference corresponds to fifteen degrees of longitude: two hours, thirty degrees. We work with solar time here, not with the slightly shorter sidereal day of a pure spin against the stars.

Keep the two unit systems apart. Time uses hours, minutes, and seconds. Angle uses degrees, arcminutes, and arcseconds. One degree equals sixty arcminutes. One arcminute equals sixty arcseconds. One hour of time equals sixty minutes. One minute equals sixty seconds. The bridge between them is simple. One hour of time equals fifteen degrees of angle. One minute of time equals fifteen arcminutes. One second of time equals fifteen arcseconds of angle.

Longitude difference in degrees is 15 times (hours + minutes/60 + seconds/3600).

Suppose local solar time is two hours thirty-five minutes behind the time at Greenwich, compared at the same instant.

Two hours of time are 2 times 15 degrees, which is 30 degrees. Thirty-five minutes of time are 35 times 15 arcminutes, which is 525 arcminutes. Divide by 60: 8 degrees, with 45 arcminutes left over, so 8 degrees 45 arcminutes. Add them. 30 degrees plus 8 degrees 45 arcminutes is 38 degrees 45 arcminutes 00 arcseconds west of Greenwich. As a decimal that is 38.75 degrees west. In the common signed convention, east positive and west negative, it is -38.75 degrees.

If local solar time is behind Greenwich at the same instant, you are west. If local solar time is ahead, you are east. Picture Greenwich at noon while a western place still shows 9:25. That is 2 hours 35 minutes behind, hence 38 degrees 45 arcminutes west. Always name the reference meridian. Today Greenwich is usual. Chappe's published result, for example, used Paris, which is a different zero and is told in the [Venus lesson](/topics/55-venus-transits-1761-1769/).

This is a solar-time conversion, not a way to read exact longitude from today's time-zone label. Civil and political zones, and daylight-saving shifts, are administrative clocks, not precise meridians.

Coordinates may be written both ways. Computers commonly work with decimal degrees. People often read degrees, minutes, and seconds. GPS and mapping apps can display either. Neither form belongs only to the machine or only to the reader.

![Paired scales: solar-time difference and longitude west of Greenwich](../../img/Time_to_Longitude_Paired_Scales_Tufte.svg?v=1)
*Time difference and longitude march together. 0 hours is 0 degrees, 1 hour is 15 degrees, 2 hours is 30 degrees, and 2 hours 35 minutes is 38 degrees 45 arcminutes west, placed in true proportion. The reference meridian is Greenwich.*

If local solar time is one hour behind Greenwich, the longitude that suggests is fifteen degrees west of Greenwich.

The illustrated lesson is [download the PDF](/downloads/Time_to_Longitude_Converting_Hours_Minutes_Seconds_to_Degrees_Faria_2026-11-07.pdf).

## Longitude with a clock, in plain language

Before you sail, set an accurate chronometer to Greenwich time and do not reset it at sea. It carries Greenwich with you. It does not count the hours you have been under way.

At sea, watch the Sun. Local noon is when the Sun stands highest, not when a civil clock says 12. Read the chronometer then.

![Same instant: the Sun at its highest, and a Greenwich chronometer at 14:30 (2:30 p.m.)](../../img/Chronometer_Local_Noon_Greenwich_230_Tufte.svg?v=1)
*Local noon is the Sun's highest point. The hour hand sits between the 2 and the 3. The minute hand points at the 6.*

If it reads 14:30 (2:30 p.m.), Greenwich is 2 hours 30 minutes ahead, so you are west. Each hour is 15 degrees. Two hours are 30 degrees. The half hour adds 7.5 degrees. So 2.5 times 15 is 37.5 degrees west, 37 1/2 degrees, not 30. That angle is your longitude. A reading of 10:00 would put you 30 degrees east. The 2 hours 35 minutes case higher on this page is different again: 38 degrees 45 arcminutes west.

The 15 degrees per hour does not depend on latitude. The miles do. Parallels shrink toward the poles, so the same angle covers less ground. The clock method is not limited to the tropics, and it still works at every latitude where you can see the Sun.

Near the poles the hard part is the Sun, not the clock. The highest point is flatter, and in polar winter the Sun may not rise for weeks. At the pole every meridian meets, so longitude has no meaning.

The example skips the equation of time, the seasonal gap between the sundial and the clock, up to about 16 minutes. An almanac supplies that correction.

### What if we had started with tens?

We could divide a day into 10 hours, each hour into 100 minutes, and each minute into 100 seconds. A circle could have 400 divisions, called gradians, rather than 360 ordinary degrees. Revolutionary France actually tried decimal time. Tens fit our ten fingers and the way we write numbers.

Sixty has a useful advantage: it divides evenly by 2, 3, 4, 5, 6, 10, and 12. Ten does not. Decimal notation and modern calculation make that bookkeeping advantage less important, though one-third still cannot be written as a finite decimal.

A 400-day year would look tidy beside a 400-part circle, but nature does not oblige. The seasonal year is about 365.24 ordinary days. Changing the units on a clock, or the number of parts in a circle, changes neither the length of the day nor the length of the year. It would not remove leap-day corrections, and it would not make them fewer.

The plain-language sheet is [Longitude with a clock (PDF)](/downloads/Chronometer_Longitude_in_Plain_Language_Faria_2026-11-07.pdf).

## From a carried clock to a broadcast clock, and then to GPS

The sheet above tells you how to turn a time difference into an angle, once you already have Greenwich time in your hand. It does not say where that carried clock came from, and it does not say what replaced the need to trust one watch for a whole voyage. Those are the next sentences. None of them were on this page before.

### The watch was made in 1759 and tried at sea in 1761

John Harrison's fourth marine timekeeper, H4, is dated 1759 by the Royal Museums Greenwich. Work on it had started earlier, in 1755, after a smaller watch made to his ideas had behaved well. "Finished in 1761" is the wrong year for the building of it. 1761 is the year of the first sea trial. The Commissioners allowed his son William to take H4 toward Jamaica. The trial looked promising, including a landfall called early at Madeira. The Board of Longitude did not treat that voyage as the end of the test. A further trial, to Barbados, followed in 1764. In February 1765 the Board agreed that H4 had kept time within the strictest limit of the 1714 Longitude Act, and it asked Parliament to pay 10,000 pounds once Harrison explained the watch, and the rest, less sums already paid, only after other makers could build the same kind of thing. Harrison thought the full reward was already due, and that the rules had been moved. That argument became the Longitude Act of 10 May 1765. It was not a handshake and a single purse.

Later testing at Greenwich went badly, in Maskelyne's report, and Harrison disputed the report. In 1773 he went to Parliament rather than back to the Board. The Act of that year, in its own title, pays him a further reward for the invention and for disclosing how it was made. It is not worded as the Board handing over the lump prize of 20,000 pounds. Accounts of that Act put the further sum at 8,750 pounds. Royal Museums Greenwich says he was rewarded, but not by the Board, and not with everything he believed he was owed. Earlier payments, later payments, and this one are a long argument. They are not one sentence that says "he won."

The watches also stayed expensive. Wider use waited on later makers who could build them more simply, into the early 1800s. A prize on paper is not a chronometer in every chart room.

### A clock finds the ship. A transit finds the Sun's distance

Keep the two jobs apart. The chronometer answers a question about the ship: how far east or west of a named meridian am I, at the moment the Sun is highest? The Venus transits of 1761 and 1769 answered a different question: how far away is the Sun, in Earth-radii or in miles? The [Venus-to-Cepheid lesson](/topics/52-venus-transit-to-cepheid-distances/) is that second job. This page is the first.

A picture that sets London at one end of the Earth and Cape Town at the other is the wrong picture. On a modern map those two cities are about 87 degrees apart along a great circle. Points that are truly opposite are 180 degrees apart. The straight line through the Earth between London and Cape Town is a chord. A chord is a cut across the ball, shorter than a diameter. A diameter would join opposite points. And even the chord is not the baseline a transit uses. The useful baseline is the projected one: the separation of the stations as seen from the Sun, square to the line of sight, taken along the direction that actually shifts the contact. The [same lesson](/topics/52-venus-transit-to-cepheid-distances/) already says the map coordinate you print is not that baseline.

A second mix-up lives in a small angle. A solar parallax near 8.5 arcseconds is the angle filled by the Earth's radius if you could look back from the Sun. The modern value of that angle is about 8.8 arcseconds, and the eighteenth-century arguments about it are on the Venus lesson, including Encke's 8.5776. That angle is not the width of Venus on the Sun, and it is not the angle between London and the Cape, which is tens of degrees, not seconds of arc. The chronometer never measured it. The transit campaign was trying to.

### A radio tick can check the clock. It did not retire it

A time signal on the radio is still a reference clock. The difference is that the reference no longer has to survive the whole voyage inside one box. A ship can compare its chronometer with a tick that left a known station at a known moment, and then set or rate the watch. That is a check. It is not the same act as throwing the watch overboard.

WWV, the station of the National Bureau of Standards, now NIST, is easy to misdate. NIST's own history says the call was in use by 1920, and that a regular service of standard frequencies, for calibrating other radios, was underway in 1923. Time pulses on WWV came later. A NIST history of time-signal stations puts the first seconds pulses in 1937, and says the United States Navy was still the nation's official radio time broadcaster then. Voice announcements of the time came in 1950. Earlier stations, including time signals from the Eiffel Tower referenced to the clocks in Paris, were already being used so that ships could correct marine chronometers. Correct, not replace. Chronometers stayed in the chart room for decades after the first ticks. A broadcast lets you audit a carried clock. It does not, by itself, end the need for one.

### GPS times the journey of the signal

GPS is still a time measurement, and it is not the noon-sun formula. NASA describes the satellites as sending their position and their time. The receiver works out how long each signal took to arrive. Distance, here, is that travel time multiplied by the speed of the signal. Several satellites are required, because the receiver is solving for where it is and for how wrong its own clock is, all at once. Four are the usual minimum for a position and a clock correction. Nothing in that sum asks when the Sun stood highest, and nothing in it is "one hour of solar time is 15 degrees" applied to a wristwatch. The longitude that comes out is still an angle on the Earth. The clock that produced it is a set of precise signals in flight, not a chronometer read at local noon.

### The grid is older than a measurement you could trust at sea

Claudius Ptolemy, in the second century, wrote a Geography that placed thousands of towns by latitude and longitude in degrees. NASA's note on that book says the coordinates let later mapmakers reconstruct his world, and that his own drawn maps do not survive. Latitude from the sky was already a practical art. Longitude in his lists was a coordinate he could write down from reports, travelers, and earlier compilers. Writing a number is not the same as recovering it from the deck of a ship. The sky method and the carried clock, centuries later, were attempts to earn a figure his grid had already given a place to hold. The astronomical Ptolemy, circles on circles, is the [Looking Up](/topics/45-looking-up-polaris-planets-ptolemy-copernicus/) lesson. The longitude clock, in its first sea trials, is the one on this page.

## Sources
- The factor of 15 is 360 degrees divided by the 24-hour mean solar day. The Greenwich numbers on this page are that arithmetic.
- Jean-Baptiste Chappe d'Auteroche, *Voyage en Californie*, Cassini's reductions, Paris, 1772, pp. 88-92, where the published longitude is measured west of Paris rather than Greenwich: https://archive.org/download/voyageencaliforn00chap/voyageencaliforn00chap_djvu.txt
- Royal Museums Greenwich, "What is longitude?": https://www.rmg.co.uk/stories/time/what-longitude
- U.S. Naval Observatory, "The Equation of Time": https://aa.usno.navy.mil/faq/eqtime
- IMCCE, "The decimal clock," on the French Revolutionary experiment: https://abbadia.imcce.fr/en/deci-en.html
- U.S. Naval Observatory, "Leap Years," on the seasonal year and the leap-day correction: https://aa.usno.navy.mil/faq/leap_years
- Royal Museums Greenwich, H4, object record, date made 1759: https://www.rmg.co.uk/collections/objects/rmgc-object-79142
- Royal Museums Greenwich, "Longitude found: the story of Harrison's timekeepers," on the 1761 Jamaica trial, the 1764 Barbados trial, the 1765 Act, and a reward that did not come from the Board: https://www.rmg.co.uk/stories/time/harrisons-clocks-longitude-problem
- Act of Parliament, 1773, 13 Geo. 3, c. 77, whose title calls the payment a further reward for the timekeeper and for the disclosure of its principles: https://www.legislation.gov.uk/apgb/Geo3/13/77/enacted
- NIST, "History of Radio Station WWV," on standard-frequency broadcasts from 1923: https://www.nist.gov/pml/time-and-frequency-division/time-distribution/radio-station-wwv/history-radio-station-wwv
- NIST, "Time Signal Stations," on seconds pulses from WWV in 1937 and on earlier signals used to correct marine chronometers: https://tf.nist.gov/general/pdf/2131.pdf
- NASA, "GPS," satellites sending position and time, and a receiver timing the signals' arrival: https://www.nasa.gov/directorates/somd/space-communications-navigation-program/gps/
- NASA, on Ptolemy's Geography and its latitude and longitude for thousands of places: https://science.nasa.gov/mission/landsat/outreach/geographia/

## Key facts
- Twenty-four hours of solar time equal 360 degrees. One hour of time is 15 degrees. One minute of time is 15 arcminutes. One second of time is 15 arcseconds.
- Time is hours, minutes, and seconds. Angle is degrees, arcminutes, and arcseconds. One degree is 60 arcminutes, and one arcminute is 60 arcseconds.
- Longitude in degrees is 15 times (hours + minutes/60 + seconds/3600). Name the meridian. Behind it is west. Ahead of it is east.
- Two hours 35 minutes behind Greenwich is 38 degrees 45 arcminutes west, which is 38.75 degrees west, and -38.75 degrees if east is positive.
- A civil time zone or daylight saving is an administrative clock, not this angle. Decimal degrees and degrees-minutes-seconds are two displays. GPS and mapping software can show either.
- The worked example uses Greenwich. Chappe's published longitude used Paris.
- A chronometer kept on Greenwich time, read when the Sun is highest, gives longitude. A reading of 14:30 (2:30 p.m.) is 2.5 hours, which is 37.5 degrees west, not 30. The hours do not depend on latitude. Miles along a parallel do. Near the poles the hard part is seeing solar noon. The equation of time, up to about 16 minutes, needs an almanac.
- A decimal day of 10 hours, and a circle of 400 gradians, were tried in Revolutionary France. Sixty divides evenly by 2, 3, 4, 5, 6, 10, and 12. The seasonal year is about 365.24 ordinary days. New clock units would not shorten the year or reduce the need for leap days.
- Harrison's H4 is dated 1759. Its first sea trial was in 1761. The 1773 Act paid a further reward, not a one-line award of the whole Board prize. Radio time signals let a ship check a chronometer. They did not retire it at once. GPS times the travel of signals from several satellites. It is not the local-noon formula.
- London and Cape Town are not opposite ends of the Earth. The transit baseline is a projected separation, not a diameter. A solar parallax near 8.5 arcseconds is the Earth's radius seen from the Sun, not an angle of Venus and not the angle between those cities.
