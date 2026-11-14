---
title: "The International Date Line"
summary: The date line is a convention, not a treaty; Magellan's surviving crew found they had lost a day in 1522, Kiribati moved the line east in 1995, Samoa skipped 30 December 2011, and in GIS the same seam at 180° breaks maps and polygons.
session: 2026-11-14
order: 9
tags: [geography, maps, history, navigation, longitude]
---
Somewhere on Earth, the date has to change. If you keep going west with the Sun, each day is a little longer than 24 hours, and when you get home you are one day behind everyone who stayed put. The International Date Line is where we agree to fix that. It mostly follows the 180° meridian, but it bends wherever people have asked it to.

## Who set it? Nobody, by treaty

The 1884 Meridian Conference in Washington did not create the date line. It made Greenwich the zero of longitude. It voted that longitude would run 180° east and 180° west from there. It proposed a "universal day" starting at Greenwich midnight. But no resolution named a date line or said where it should run.

The idea was already in use. One argument read into the 1884 record noted that the 180° meridian was close to where navigators already changed the date, by a custom left over from the voyages of discovery.

The U.S. Naval Observatory puts it plainly: the date line "has been recognized as a matter of convenience and has no force in international law." Each country decides which side of it to be on, and mapmakers redraw the line to match.

## The lost day, 1522

The first people to lose a day were the survivors of the Magellan expedition. They left Spain in September 1519. Magellan was killed in the Philippines in 1521. Juan Sebastián Elcano brought the one remaining ship, the *Victoria*, home around Africa.

Antonio Pigafetta kept a daily journal. In one common English translation he wrote: "On Wednesday, the ninth of July, we arrived at one of these islands named Santiago." That is in the Cape Verde Islands. The crew sent a boat ashore and asked what day it was. "They were answered that to the Portuguese it was Thursday, at which they were much amazed, for to us it was Wednesday." Pigafetta had written down every day without a break. Later they understood why. Sailing west, with the Sun, they had used up one whole day.

The court historian Peter Martyr heard the story from the survivors. He doubted it at first, but came to agree that the day was truly lost.

## Why the line jogs

The 180° meridian crosses very little land, which is why it works. Where it does cross land or split a country, the line bends.

- In the far north it swings east around the tip of Siberia, so all of Russia shares one date.
- It swings west around the Aleutian Islands, so all of Alaska stays with the United States. Alaska was on the Asian date under Russia and switched after the 1867 purchase.
- The Philippines kept the American date, by way of Spain's Pacific trade, until 1845.

## Kiribati, 1995

Kiribati is a string of island groups that sits across the 180° line. Before 1995 its eastern islands were a full day behind the western part, where the capital is. Officials on the two sides had only four days a week when both were at work. Kiribati announced that from 1 January 1995 the date line would run along its eastern border.

Accounts disagree about which day the eastern islands skipped. A careful history from Utrecht University, and the IANA time zone database, both have Friday, 30 December 1994 followed by Sunday, 1 January 1995. So 31 December was skipped. Some popular sources say 1 January was skipped. The change pushed the line out to about 150° west, farther east than Hawaii. Kiribati's Line Islands now keep UTC+14, the earliest clock time on Earth.

## Samoa, 2011

In 1892 the King of Samoa moved his kingdom to the American date. One historian called it "a masterpiece of diplomatic flattery": Samoa celebrated the Fourth of July twice that year. In 2011 it moved back, to line up with Australia and New Zealand, its main trading partners. Thursday, 29 December 2011 was followed by Saturday, 31 December. There was no 30 December in Samoa. Tokelau made the same change.

## GIS today: the antimeridian problem

The 180° meridian is a seam in map data too. GIS people call it the **antimeridian**. Longitude jumps from +180 to −180 there. Software that draws a straight line between two points does not know that.

Draw a line from 170° east to 170° west. The true route is 20 degrees long, across the Pacific. Many tools instead draw it 340 degrees long, the other way around the world. A polygon around Fiji, the Chukotka coast or the Aleutians can do the same. It turns inside out or smears across the whole map.

The GeoJSON standard, RFC 7946 (2016), section 3.1.9, addresses this. Any geometry that crosses the antimeridian "SHOULD be represented by cutting it in two such that neither part's representation crosses the antimeridian." A crossing line becomes a MultiLineString. A crossing box becomes a MultiPolygon, one piece ending at 180 and the other starting at −180.

Practical habits for Pacific work:

- Check any layer with features near 180° east or west before you trust its extent or area.
- Split crossing features at 180°, as RFC 7946 asks, before sharing GeoJSON.
- For a Pacific-centered map, use a projection centered near 180° so the seam falls over Africa instead.

## Sources
- U.S. Naval Observatory, "The International Date Line": https://aa.usno.navy.mil/faq/international_date
- R. H. van Gent, Utrecht University, "The Discovery of the Calendrical Date Line" (Pigafetta and Peter Martyr): https://webspace.science.uu.nl/~gent0113/idl/idl_discovery.htm
- R. H. van Gent, Utrecht University, "The Kiribati and Samoa Adjustments": https://webspace.science.uu.nl/~gent0113/idl/idl_recent.htm
- IETF RFC 7946, *The GeoJSON Format*, section 3.1.9, "Antimeridian Cutting": https://www.rfc-editor.org/rfc/rfc7946#section-3.1.9
- Official proceedings of the 1884 conference (Project Gutenberg): https://www.gutenberg.org/ebooks/17759

## Key facts
- The date line is a convention with no force in international law. The 1884 conference set 180° longitude but did not name a date line.
- Pigafetta: the *Victoria* reached Santiago, Cape Verde, on what the crew counted as Wednesday 9 July 1522; ashore it was Thursday.
- The line jogs around Siberia, the Aleutians and Pacific island nations.
- Kiribati moved the line east from 1 January 1995. Most careful records say its eastern islands skipped 31 December 1994; some sources say 1 January 1995.
- Samoa skipped Friday, 30 December 2011, going from Thursday the 29th to Saturday the 31st.
- RFC 7946 says GeoJSON geometries crossing the antimeridian SHOULD be cut in two at 180°.
