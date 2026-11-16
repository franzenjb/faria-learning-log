---
title: "Three Ways to Say Where: Latitude and Longitude, UTM, and State Plane"
summary: One spot in Fort Myers written three ways, as angles on the Earth (latitude and longitude), as meters inside one of 60 UTM zones, and as US survey feet inside a State Plane zone, with an interactive map that converts any spot you click.
session: 2026-11-16
order: 1
tags: [geography, maps, geodesy, mathematics]
---
A volunteer in a shelter, a pilot, and a county surveyor can all point at the same corner of Fort Myers and write down three different-looking addresses. All three are right. They are three ways of saying *where*, each built for a different job.

[Open The Interactive: One Spot, Three Addresses](/three-ways/). Click anywhere, or type a latitude and longitude, and watch the same spot appear in all three systems.

## The Spot We Will Follow

Downtown Fort Myers, Florida, at **26.6400° N, 81.8722° W**. Every number below was computed with PROJ, the open-source library inside nearly every GIS program, and the interactive uses the same formulas.

| System | How it writes the spot |
|---|---|
| Latitude and longitude, decimal degrees | 26.6400° N, 81.8722° W (stored as 26.6400, −81.8722) |
| Latitude and longitude, degrees, minutes, seconds | 26° 38′ 24.0″ N, 81° 52′ 19.9″ W |
| UTM zone 17N, WGS 84 (EPSG:32617) | 413,189 m E, 2,946,859 m N |
| MGRS / USNG grid reference | 17R MK 13188 46859 |
| State Plane, Florida West, meters (EPSG:26959) | 212,724.18 m E, 255,524.51 m N |
| State Plane, Florida West, US survey feet (EPSG:2237) | 697,912.57 ft E, 838,333.33 ft N |

Same spot, six lines. Now, slowly, why each one exists.

## 1. Latitude and Longitude: Two Angles

Start with the Earth itself. It is not quite a ball; it is a little fat at the equator, about 27 miles wider than it is tall. Geodesists model it as a smooth squashed sphere called an **ellipsoid**. GPS uses one called **WGS 84**.

**Latitude** is an angle north or south. Stand anywhere, imagine the line pointing straight up out of the ground, and measure how far that line tilts away from the plane of the equator. At the equator it is 0°. At the North Pole it is 90° N. Because the Earth is squashed, that straight-up line does not quite aim at the Earth's center, which is a nice surprise for a first-principles thinker.

**Longitude** is an angle east or west, measured around the axis from the meridian through Greenwich. Fort Myers is about 82° of turning west of Greenwich.

![Latitude is the tilt of the straight-up line from the equator's plane; longitude is the turn east or west from Greenwich](../../img/Latitude_and_Longitude_Are_Angles.svg)
*Drawn for this lesson. Left: a side view of the Earth with the flattening greatly exaggerated. Right: looking down on the North Pole.*

Two ways to write the same angles:

- **Decimal degrees**: 26.6400, −81.8722. South and west are negative. This is what a computer, a spreadsheet, or a Field Maps pin stores.
- **Degrees, minutes, seconds**: 26° 38′ 24.0″ N. A degree has 60 minutes and a minute has 60 seconds, the old Babylonian sixties. (See [Degrees, arcminutes, and arcseconds](../95-degrees-arcminutes-arcseconds/).)

Latitude and longitude are the universal language. Every GPS fix starts there, and nearly every system that shares data, from a 911 call to a web map, passes the spot along as latitude and longitude. Its one weakness: degrees are not distances. A degree of longitude is about 69 miles at the equator and about 62 miles at Fort Myers, and it shrinks to nothing at the pole. You cannot measure a shelter's distance to a flooded street by subtracting degrees. (Why it shrinks: [the cosine of latitude](../97-eastward-ground-speed-and-the-cosine-of-latitude/).)

## 2. UTM: Flat Squares, in Meters

The **Universal Transverse Mercator** system fixes that weakness by cutting the world into strips and flattening each one.

- **60 zones**, each **6° of longitude** wide, numbered eastward from 180°. Zone 1 starts at the date line; Fort Myers is in **zone 17**, from 84° W to 78° W.
- Each zone gets its own **transverse Mercator** projection: picture a cylinder of paper laid on its side, touching the Earth along the zone's center line (81° W for zone 17). A thin strip barely stretches when you flatten it.
- Positions are **eastings** and **northings** in **meters**.
- The center line is given a made-up easting of **500,000 m**, the *false easting*, so no spot in the zone ever has a negative easting. Fort Myers' 413,189 m E means it is 86.8 km west of 81° W.
- **North or south**: in the northern hemisphere the northing is meters from the equator. In the southern hemisphere the equator is called 10,000,000 m, so northings stay positive there too. That is why a UTM address must say 17N or 17S.
- The **0.9996** scale factor: the cylinder is pushed slightly into the Earth, so the center line is shrunk by 4 parts in 10,000. Two lines about 180 km either side come out exactly true, and the zone edges are stretched only about 7 parts in 10,000. The error is spread out instead of piled at the edges.

![World map with 60 UTM zones; zone 17N, holding Fort Myers, is lit](../../img/UTM_Sixty_Zones_World_Fort_Myers_Zone_17N.svg)
*UTM runs from 80° S to 84° N. Two zones bend around southwest Norway and Svalbard. The poles use a different grid. Land: Natural Earth.*

![Scale factor across zone 17 at Fort Myers' latitude: 0.9996 at the center line, 1.0000 about 180 km out, 1.0007 at the edge](../../img/UTM_Zone_17_Scale_Factor_Across_the_Zone_at_Fort_Myers.svg)
*Computed with PROJ. At Fort Myers a UTM mile is short by about 1.6 feet. Fine for a damage map; too much for a property line.*

Why responders like it: meters. Subtract two eastings and you have a distance on the ground, close enough for any field job. A 1 km grid square is 1 km.

**MGRS and USNG, the grid-reference cousins.** The military and the U.S. National Grid write a UTM position as a short code: zone and latitude band (17R), a two-letter 100-km square (MK), then easting and northing digits (13188 46859). Five digits each is a 1-meter square; three digits each is a 100-meter square that a person can read aloud over a radio. FEMA and many emergency managers use USNG for search-and-rescue grids because it works on paper maps when phones and networks fail.

## 3. State Plane: A Tighter Fit, for the United States

Surveyors and county GIS offices wanted even less stretching than UTM allows, so the United States built its own system in the 1930s: the **State Plane Coordinate System**. The current version is **SPCS 83**, built on the NAD 83 datum. NGS counts **125 zones** in it; most states have one to six, Alaska has ten, and a few zones cover islands and territories. The map here shows the 121 zones in Esri's public boundary set, which leaves out Puerto Rico and the Virgin Islands, Guam, American Samoa, and Louisiana's offshore zone.

Each zone is small, so each can be fit tightly:

- **Lambert conformal conic** for zones that are **wide east to west** (Tennessee, North Carolina, the northern tier). Picture a paper cone set on the Earth along two parallels.
- **Transverse Mercator** for zones that are **long north to south** (Florida East and West, Illinois, Indiana, Vermont), the same idea as UTM but narrower.
- One **oblique Mercator** zone, tilted to follow the Alaska panhandle.

![US State Plane zones; transverse Mercator zones shaded, Lambert zones white, Florida West lit](../../img/State_Plane_Zones_NAD83_Lower_48_Florida_West_Lit.svg)
*Lower 48 shown. Boundaries: Esri, USA State Plane Zones NAD83, simplified. Alaska, Hawaii and the territories are in the interactive and the PDF tables.*

At Fort Myers the Florida West zone's scale is 0.99994, so a State Plane mile is short by only about 0.3 feet, five times better than UTM there. That is why a deed, a road plan, or a county parcel layer in Lee County is likely to be in State Plane.

**Feet or meters.** SPCS 83 is defined in meters, but most states publish their working coordinates in feet. The **US survey foot** is 1200/3937 m, about 2 parts in a million longer than the international foot. Over a State Plane coordinate of 800,000 feet that difference is more than a foot and a half, which is why NGS retired the survey foot at the end of 2022 and why a file must always say which foot it uses. Washington, DC has no zone of its own; local mapping uses the Maryland zone.

**SPCS2022.** NGS is replacing NAD 83 with new reference frames and has designed a new State Plane system to go with them: **SPCS2022**, with about 950 zones, many of them smaller and fit to single regions or counties, defined in meters and international feet. As of November 2026 its beta public-feedback period is complete, and the official release is expected in 2027. Until then SPCS 83 remains the working standard.

## Which One, and When

| | Latitude and longitude | UTM | State Plane |
|---|---|---|---|
| What it is | Two angles on the ellipsoid | Meters in one of 60 strips | Meters or feet in one of 125 US zones |
| Coverage | Whole Earth | 80° S to 84° N | United States only |
| Units | Degrees | Meters | Meters or US survey feet |
| Distortion | None stored; distances need math | Up to about 1 part in 1,000 | Usually under 1 part in 10,000 |
| Typical user | GPS, every data exchange, web maps | Field teams, militaries, international response | Surveyors, engineers, county GIS |
| Disaster-response note | The pin in Field Maps | MGRS / USNG search grids | Parcel and road data from local government |

How much each gets used, as Jeff's working estimates, not a measured statistic:

![Jeff's working estimates: latitude and longitude about 100 percent as storage and interchange, UTM about 35 to 40 percent working share worldwide, State Plane about 5 percent, US only](../../img/Coordinate_System_Use_Shares_Jeffs_Working_Estimates.svg)
*Rough estimates for discussion, not survey results. They overlap: almost every dataset is stored or exchanged as latitude and longitude, even when the work is done in UTM or State Plane.*

The habit to keep: store and share in latitude and longitude, measure in UTM or State Plane, and always write down which system, which zone, which datum and which foot.

This lesson as a printable sheet: [lesson PDF](/downloads/Three_Ways_to_Locate_a_Point_Lat_Long_UTM_State_Plane_Faria_2026-11-16.pdf).

## Sources
- National Geodetic Survey, State Plane Coordinate System of 2022 Policy (2023), which describes SPCS 83 as 125 zones: https://www.ngs.noaa.gov/INFO/Policy/files/SPCS2022-Policy.pdf
- National Geodetic Survey, Track Our Progress, New Datums (SPCS2022 beta public feedback complete): https://www.ngs.noaa.gov/datums/newdatums/TrackOurProgress.shtml
- Esri, "Prepare your data for the NSRS modernization of 2022" (SPCS2022 zone count and expected 2027 release): https://www.esri.com/arcgis-blog/products/arcgis-pro/data-management/prepare-your-data-for-the-nsrs-2022
- Esri, USA State Plane Zones NAD83 feature layer (zone boundaries): https://www.arcgis.com/home/item.html?id=23178a639bdc4d658816b3ea8ee6c3ae
- EPSG Geodetic Parameter Dataset via PROJ: EPSG:4326 (WGS 84), EPSG:32617 (UTM 17N), EPSG:26959 and EPSG:2237 (NAD 83 Florida West, meters and US feet).
- U.S. National Grid, Federal Geographic Data Committee standard FGDC-STD-011-2001.
- Faria, [Degrees, arcminutes, and arcseconds](../95-degrees-arcminutes-arcseconds/)

## Key facts
- Latitude and longitude are two angles on the ellipsoid (WGS 84 for GPS): latitude north or south of the equator's plane, longitude east or west of Greenwich.
- Decimal degrees (26.6400, −81.8722) and degrees, minutes, seconds (26° 38′ 24.0″ N) are the same angles written two ways.
- UTM cuts the world into 60 zones, each 6° wide, and gives eastings and northings in meters.
- UTM's center line has a false easting of 500,000 m and a scale of 0.9996; southern-hemisphere northings start at 10,000,000 m.
- MGRS and USNG write a UTM position as a short grid reference, like 17R MK 13188 46859, used for search grids.
- State Plane is US only: 125 zones in SPCS 83, Lambert conformal conic for wide zones and transverse Mercator for tall ones.
- Fort Myers is UTM 17N 413,189 E 2,946,859 N and Florida West State Plane 697,912.57 ft E 838,333.33 ft N (EPSG:2237).
- SPCS2022 (about 950 zones) finished beta public feedback; official release is expected in 2027.
