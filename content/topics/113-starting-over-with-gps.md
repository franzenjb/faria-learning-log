---
title: "Starting Over: Would a GPS World Still Use Latitude and Longitude?"
summary: If we arrived at Earth with satellites but no history, the spin axis would hand us the poles, the equator and latitude for free, but zero longitude would still be a choice, just as it is on Mars and the Moon.
session: 2026-11-14
order: 13
tags: [geodesy, longitude, navigation, maps, astronomy]
---
A thought experiment from class: suppose we arrived at Earth already holding modern satellites, with no Hipparchus, no Harrison and no Greenwich. Would we still end up with latitude, longitude and a zero line? Mostly yes, and the reasons split cleanly in two.

## Latitude Comes With the Planet

Earth spins. A spinning ball has two points that do not move, the poles, and one circle halfway between them, the equator. Any observer, human or not, would find them. Latitude is just the angle north or south of that circle. Its zero is set by nature, so a fresh start would land on the same equator.

## Longitude Needs a Choice

Around the spin axis every direction looks the same. Nothing on a smooth spinning ball says "start counting here." So any longitude system needs a person, or a committee, to pick a zero. A GPS-first world would still have to vote.

## GPS Does Not Think in Latitude and Longitude Anyway

Inside the receiver, GPS works in plain **X, Y, Z** coordinates measured from Earth's center of mass. This is the Earth-Centered, Earth-Fixed frame. Z points along the spin axis. X points out through the zero meridian at the equator. Latitude, longitude and height are a translation of X, Y, Z for people. Even so, someone had to choose which way X points. The zero meridian is just that choice wearing a different name.

## How Other Worlds Picked Their Zero

- **Mars.** Its zero of longitude is set by a tiny crater, about a third of a mile wide, named **Airy-0**. It is named after George Airy, whose telescope set Earth's zero. Someone picked a landmark and agreed on it, just as at Greenwich.
- **The Moon.** The Moon always keeps one face toward Earth. So its zero meridian runs through the average point facing Earth. That is a rare case where nature suggests the zero.

On Earth, a fresh start would probably pick a zero for convenience, perhaps a line through an ocean, or the line the first satellite operators used. Whatever it was, the world would then build its maps on it, exactly as it did on Greenwich.

## What Might Change in a Fresh Start

- **Units.** The 360-degree circle comes from Babylonian base-60 counting. A fresh start might use decimal degrees only, or the grad, which splits a circle into 400. Revolutionary France tried grads, and the meter was first defined from a meridian; see [the meter from a meridian](../83-the-metre-from-a-meridian/).
- **Grids for people.** Systems such as UTM, the U.S. National Grid, MGRS and hexagon grids like Uber's H3 already turn the globe into squares or cells that are easier to say and share in the field.
- **What stays.** Even with new labels, every system still needs the spin axis, a center of mass and one agreed starting line.

## Key facts
- Latitude's zero, the equator, is set by Earth's spin and would be found again in any fresh start.
- Longitude's zero is arbitrary on a spinning ball; it must be chosen.
- GPS computes in Earth-centered X, Y, Z coordinates; latitude and longitude are a conversion for people, and the X axis still marks a chosen zero meridian.
- Mars's prime meridian is set by the small crater Airy-0, named after George Airy.
- The Moon's zero meridian runs through the mean point facing Earth, a choice suggested by tidal locking.
- The 360° circle is a Babylonian inheritance; France tried a 400-grad circle.
