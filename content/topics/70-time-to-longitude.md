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

![Same instant: the Sun at its highest, and a Greenwich chronometer at 2:30](../../img/Chronometer_Local_Noon_Greenwich_230_Tufte.svg?v=1)
*Local noon is the Sun's highest point. The hour hand sits between the 2 and the 3. The minute hand points at the 6.*

If it reads 2:30, Greenwich is 2 hours 30 minutes ahead, so you are west. Each hour is 15 degrees. Two hours are 30 degrees. The half hour adds 7.5 degrees. So 2.5 times 15 is 37.5 degrees west, 37 1/2 degrees, not 30. That angle is your longitude. A reading of 10:00 would put you 30 degrees east. The 2 hours 35 minutes case higher on this page is different again: 38 degrees 45 arcminutes west.

The 15 degrees per hour does not depend on latitude. The miles do. Parallels shrink toward the poles, so the same angle covers less ground. The clock method is not limited to the tropics, and it still works at every latitude where you can see the Sun.

Near the poles the hard part is the Sun, not the clock. The highest point is flatter, and in polar winter the Sun may not rise for weeks. At the pole every meridian meets, so longitude has no meaning.

The example skips the equation of time, the seasonal gap between the sundial and the clock, up to about 16 minutes. An almanac supplies that correction.

The plain-language sheet is [Longitude with a clock (PDF)](/downloads/Chronometer_Longitude_in_Plain_Language_Faria_2026-11-07.pdf).

## Sources
- The factor of 15 is 360 degrees divided by the 24-hour mean solar day. The Greenwich numbers on this page are that arithmetic.
- Jean-Baptiste Chappe d'Auteroche, *Voyage en Californie*, Cassini's reductions, Paris, 1772, pp. 88-92, where the published longitude is measured west of Paris rather than Greenwich: https://archive.org/download/voyageencaliforn00chap/voyageencaliforn00chap_djvu.txt
- Royal Museums Greenwich, "What is longitude?": https://www.rmg.co.uk/stories/time/what-longitude
- U.S. Naval Observatory, "The Equation of Time": https://aa.usno.navy.mil/faq/eqtime

## Key facts
- Twenty-four hours of solar time equal 360 degrees. One hour of time is 15 degrees. One minute of time is 15 arcminutes. One second of time is 15 arcseconds.
- Time is hours, minutes, and seconds. Angle is degrees, arcminutes, and arcseconds. One degree is 60 arcminutes, and one arcminute is 60 arcseconds.
- Longitude in degrees is 15 times (hours + minutes/60 + seconds/3600). Name the meridian. Behind it is west. Ahead of it is east.
- Two hours 35 minutes behind Greenwich is 38 degrees 45 arcminutes west, which is 38.75 degrees west, and -38.75 degrees if east is positive.
- A civil time zone or daylight saving is an administrative clock, not this angle. Decimal degrees and degrees-minutes-seconds are two displays. GPS and mapping software can show either.
- The worked example uses Greenwich. Chappe's published longitude used Paris.
- A chronometer kept on Greenwich time, read when the Sun is highest, gives longitude. A reading of 2:30 is 2.5 hours, which is 37.5 degrees west, not 30. The hours do not depend on latitude. Miles along a parallel do. Near the poles the hard part is seeing solar noon. The equation of time, up to about 16 minutes, needs an almanac.
