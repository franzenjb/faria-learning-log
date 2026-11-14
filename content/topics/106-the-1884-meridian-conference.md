---
title: "The 1884 International Meridian Conference"
summary: In October 1884, delegates from 25 nations met in Washington and voted 22 to 1, with 2 abstaining, to recommend the meridian through the Greenwich transit instrument as zero longitude; today's GPS zero sits about 102 meters east of that line.
session: 2026-11-14
order: 8
tags: [history-of-science, navigation, longitude, geodesy, history]
---
Before 1884 the world had many zeros of longitude. British charts counted from Greenwich, French charts from Paris, and others from Cadiz, Naples, Ferro, Pulkovo or Rio de Janeiro. A ship's longitude meant nothing until you knew whose zero it used. In October 1884 the United States invited the world to Washington to pick one.

## The meeting

The International Meridian Conference met in the Diplomatic Hall of the State Department. It opened on 1 October 1884 and closed on 22 October. Twenty-five nations sent delegates. Its formal title was a conference "for the purpose of fixing a prime meridian and a universal day."

The key resolution proposed "the meridian passing through the centre of the transit instrument at the Observatory of Greenwich as the initial meridian for longitude." That instrument is the Airy Transit Circle, the telescope George Airy built in 1851. Its cross-hairs mark the line.

## The vote

The roll was called on 13 October. The printed record lists 21 yes, 1 no and 2 abstaining. San Domingo, today the Dominican Republic, voted no. Brazil and France abstained. The delegate of Salvador had been ill that day. At the next session he asked to be recorded as a yes, and no one objected. So the Final Act, signed on 22 October, gives the familiar result: **22 to 1, with 2 abstaining**. Both counts are in the official record; they are not a mistake.

The conference only made recommendations. Each government still had to act.

## Why Greenwich

The plainest reason was use. Sandford Fleming, a delegate of Great Britain representing Canada, read a table into the record. It showed about **65 percent of the world's ships, carrying 72 percent of its tonnage**, already used Greenwich for longitude. Paris came second, with about 10 percent of ships and 8 percent of tonnage. Royal Museums Greenwich gives the same reason: 72 percent of the world's commerce already depended on charts that used Greenwich. The United States had also already built its railroad time zones on Greenwich.

France argued for a neutral meridian, one that no single nation owned. A related idea came up too: put the zero 180° from Greenwich, out in the Pacific. Neither won.

The conference also counted longitude 180° east and west from Greenwich, east as plus and west as minus. That passed more narrowly, 14 to 5, with 6 abstaining. It also proposed a "universal day" starting at midnight at Greenwich. It did **not** set up time zones. That was left to each country.

## Sandford Fleming and standard time

Fleming was a Scottish-born Canadian railway engineer. From 1876 on he argued for one 24-hour world clock, with local time tied to it by whole hours.

The story usually told is that it began with a missed train. In July 1876, at Bundoran in Ireland, Fleming went to catch a train for Londonderry. The timetable said 5:35 p.m. The train left at 5:35 a.m. He waited about 12 hours. Some versions say the timetable was misprinted; others say he misread it. The story comes to us mostly through later retellings, so treat the details as told, not as proven.

## France keeps Paris time

France did not switch quickly. A law of 9 March 1911 set French legal time as Paris Mean Time "retarded by nine minutes twenty-one seconds." That is exactly Greenwich time, without naming Greenwich. It took effect at midnight on 10–11 March 1911.

Newspapers said French clocks stopped for 9 minutes 21 seconds. That was true of some special clocks, but not of every clock in France. The law said only what the new time was, not how to change the clocks.

## GIS today: the zero moved 102 meters

Stand on the brass line at Greenwich with a phone, and it will not read 0°. It reads about 0.0015° west. The zero used by GPS, WGS 84 and the International Terrestrial Reference Frame runs about **102 meters (about 335 feet) east** of the Airy Transit Circle. That is about 5.3 arcseconds of longitude.

Nobody moved the line by mistake. Airy's telescope was leveled with a plumb line, which hangs along local gravity. At Greenwich, local gravity does not point exactly at Earth's center or spin axis. Geodesists call that difference the **deflection of the vertical**. A 2015 paper in the *Journal of Geodesy* showed that this deflection explains the whole 102-meter offset. The old line was astronomical, set by gravity and stars. The modern line is geodetic, set through Earth's center of mass. The modern zero settled where it is in the mid-1980s, as satellite systems took over.

For a GIS user, the lesson is simple. A longitude is a number in a named reference frame. "0°" at Greenwich and "0°" in WGS 84 differ by the length of a football field.

## Sources
- Official proceedings, *International Conference Held at Washington for the Purpose of Fixing a Prime Meridian and a Universal Day, October 1884* (Project Gutenberg): https://www.gutenberg.org/ebooks/17759
- Royal Museums Greenwich, "What is Greenwich Mean Time?": https://www.rmg.co.uk/stories/topics/greenwich-mean-time-gmt
- Malys, Seago, Pavlis, Seidelmann and Kaplan, "Why the Greenwich meridian moved," *Journal of Geodesy* 89 (2015): https://link.springer.com/article/10.1007/s00190-015-0844-y
- Exporail / Virtual Museum of Canada, "Time lag" (Fleming's missed train): https://sandfordfleming.ca/en/f4010.html
- IANA time zone database, notes on the French law of 9 March 1911: https://data.iana.org/time-zones/tzdb/europe

## Key facts
- The conference met in Washington from 1 to 22 October 1884, with 25 nations.
- Greenwich vote: 21–1–2 on the 13 October roll call; 22–1–2 in the Final Act after Salvador's absent delegate was added. San Domingo voted no; Brazil and France abstained.
- Fleming's table: Greenwich was used by about 65% of ships, carrying 72% of world tonnage.
- The conference recommended a universal day but did not create time zones.
- France's 1911 law: Paris Mean Time retarded by 9 minutes 21 seconds, in effect from 11 March 1911.
- The WGS 84 / ITRF zero meridian is about 102 meters (335 feet) east of the Airy Transit Circle, explained by the deflection of the vertical.
