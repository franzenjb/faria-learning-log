---
title: "Hurricane Wind Force: Force Grows with Velocity Squared"
summary: On a comparable wall, in comparable air, wind force grows with the square of the velocity. That is not the same sentence as force equals velocity. Equal steps in miles per hour add larger and larger pieces of force, but they do not multiply the force by one fixed factor. That fixed factor is the exponential pattern, the one in compound interest, and it is not the wind's force. The power flowing in the wind is a third story, and it follows the cube.
session: 2026-11-08
order: 1
tags: [hurricanes, mathematics, disasters]
---
A hurricane wind field in a GIS is a map of speed. The number on the pixel is miles per hour. The load on a wall, a sign, or the edge of a roof is not that number, and it is not the word people reach for when the damage looks as if it ran away. They say the force grows exponentially. For the push itself, under conditions we can name, the force grows with the square of the velocity. The speed is used twice: multiplied by itself. That is quadratic growth. It is not the claim that the force and the velocity are the same number.

Force here means the push, a shove you could imagine weighing. Pressure means that push spread over an area. Dynamic pressure is the pressure that moving air brings with it because the air has mass and speed. Density is how much mass sits in a given volume of air. A drag coefficient is the plain number that carries the shape: a flat sign and a round tank do not bargain with the wind in the same way. Area is how much surface the wind meets. Hold the density, the area, and the shape still, and the speed is the only thing left to change.

NASA's Glenn Research Center puts the aerodynamic force in one sentence of that kind. The force equals a constant times the density times the speed times the speed. The dynamic pressure of the flow is one half of the density times the speed squared, and the force is directly proportional to that dynamic pressure. Doubling the speed quadruples the force. The constant is where the area and the shape sit. A National Weather Service technical note makes the density part vivid from the other direction: the same speed pushes less where the air is thinner, higher up, because there is less mass in each volume. Our comparison is the sea-level kind of comparison, comparable air, the same object.

So the working rule, once the words are in place, is small. Dynamic pressure is one half times density times speed times speed. Force is that pressure times area times the drag coefficient. Cross out the things we are holding still, and force stands in proportion to speed times speed.

## A fixed baseline of 100 miles per hour

Take 100 miles per hour as the baseline, and ask only about the ratio. A ratio is one speed divided by the other. 120 divided by 100 is 1.20. The miles per hour are in the top and the bottom, so they cancel. What is left is the plain number 1.20, which means "1.20 times as fast." Square it: 1.20 times 1.20 is 1.44. The force is 1.44 times the force at 100 miles per hour.

"Times as much" and "percent more" are not two names for one careless phrase. 1.44 times as much means you still have the whole baseline, and then 0.44 of it besides. That extra is 44 percent of the baseline, so the phrase is 44 percent more. It is not 144 percent more. 144 percent more would be 2.44 times the baseline. Say "times" when you mean the whole new amount. Say "percent more" when you mean only the extra.

The same arithmetic, still against 100 miles per hour:

| Wind | Speed divided by 100 | That number squared: times the baseline force | Percent more than the baseline | Added by this 20 mph step | This force divided by the previous force |
| --- | --- | --- | --- | --- | --- |
| 100 mph | 1.00 | 1.00 | the baseline |  |  |
| 120 mph | 1.20 | 1.44 | 44% | 0.44 | 1.44 |
| 140 mph | 1.40 | 1.96 | 96% | 0.52 | 1.361 |
| 160 mph | 1.60 | 2.56 | 156% | 0.60 | 1.306 |
| 180 mph | 1.80 | 3.24 | 224% | 0.68 | 1.266 |

Check the squares on a scrap of paper. 1.4 times 1.4 is 1.96. 1.6 times 1.6 is 2.56. 1.8 times 1.8 is 3.24. The percent-more column is the times column, minus 1, times 100. 2.56 times the baseline is one double, which would be 100 percent more, and then another 0.56, which is 56 percent more: 156 percent more. 3.24 times is a bit more than triple. Triple would be 200 percent more. The extra 0.24 makes 224 percent more.

![Hurricane Wind Force: Force Grows with Velocity Squared, same wall and same air, from 100 to 180 miles per hour](../../img/Hurricane_Wind_Force_Square_Law_Tufte.svg?v=1)
*Same wall, same air, same shape. Force grows with the square of the velocity, so the full-force ratios against 100 miles per hour are 1, 1.44, 1.96, 2.56, and 3.24: the baseline, then 44, 96, 156, and 224 percent more. Those additions get larger. They are not one fixed multiplier.*

## Why the curve bends, and why that is not exponential

Look down the "added" column. Each equal step of 20 miles per hour brings a larger piece than the step before: 0.44, then 0.52, then 0.60, then 0.68 of the baseline force. The pieces themselves grow by about 0.08 of the baseline each time. That is the square announcing itself. When you multiply a larger speed by itself, the new product jumps farther than the last one did. The graph of force against speed bends upward.

Now look at the last column, the whole force divided by the force at the previous step. The factors are about 1.44, then 1.36, then 1.31, then 1.27. They shrink. Equal steps in miles per hour do not keep multiplying the force by one number.

Exponential is that other pattern, and it needs a clean definition. Take equal steps in whatever you are counting: years, generations, or, in a picture that is not the wind, equal steps of 20 miles per hour. Each new amount is the previous amount multiplied by the same factor. The factor does not change. A bad shorthand says "multiply each step by the last." That sentence does not say which number is the amount and which is the factor. Leave it. The amount becomes the old amount times one fixed number.

Compound interest is the household example. The U.S. Securities and Exchange Commission's Investor.gov glossary defines it as interest paid on principal and on accumulated interest. One hundred dollars at 5 percent a year is 105 dollars after a year. The next year pays 5 percent of 105, not only of the original 100, and the balance is 110.25. Every year the balance is 1.05 times what it was. That 1.05 does not wear out. A population under an ideal constant growth rate is the same arithmetic: each generation a fixed multiple of the one before, and nothing else changing. Real populations are not that obedient. The pattern is the ideal.

Set that pattern beside the wind, with made-up numbers labeled as made-up. Suppose, only as a picture, that every 20 miles per hour multiplied the force by 1.5. Start at 1 for 100 miles per hour. Then 1.50, 2.25, 3.375, 5.0625. Check the divisions: each entry is exactly 1.5 times the one above it. By 180 miles per hour the imaginary rule says a bit more than 5 times the baseline. The square law says 3.24 times. The gap is the definition. The square law's step-to-step factor was already falling. The imaginary rule refuses to fall.

| Wind | Square of the speed ratio | Imaginary rule: times 1.5 at every 20 mph |
| --- | --- | --- |
| 100 mph | 1.00 | 1.00 |
| 120 mph | 1.44 | 1.50 |
| 140 mph | 1.96 | 2.25 |
| 160 mph | 2.56 | 3.375 |
| 180 mph | 3.24 | 5.0625 |

The right-hand column is not a forecast and not a wind-tunnel result. It is there so the fixed factor can be seen next to the square.

## The fist, kept honest

The old anchor is a good one if it is not asked to do too much. The same fist, the same mass, at 20 miles per hour instead of 10, has four times the kinetic energy. Kinetic energy is the energy of motion. NASA writes it as one half times the mass times the speed times the speed. Double the speed, and the speed-times-speed part becomes four times what it was. The mass did not change, so the energy is four times.

"Barely stings" is a feeling, and a feeling is not a force. We will not claim that 10 miles per hour barely stings, or that 20 miles per hour hurts four times as much. Pain is not on this page.

The push during the stop is a further sentence. The energy has to be spent over the distance in which the fist is brought to rest. If that distance is the same in the two cases, the average force is four times as well, because the same sort of stop is being asked to swallow four times the energy. If the stop is softer, or shorter, the average force changes even though the energy was fixed by the speed. Comparable stopping distance is the condition. It is not a promise about a particular impact, and this page is not a set of instructions for hitting anything.

## Force is not power, and a category is not a force

Do not hand the square law to every phrase that contains the word wind. The rate at which energy arrives in the wind, which is what engineers mean by the power in the wind, follows the cube of the speed when density and area are held still. The U.S. Department of Energy writes that power as one half times density times area times speed times speed times speed. Doubling the speed multiplies that power by eight, not by four. The Government Accountability Office says the same thing in a sentence: the power available in the wind is proportional to the cube of its speed. A NOAA Air Resources Laboratory note on turbines uses that cube as well. Force and power are neighbors. They are not the same measurement. Damage on a street is a third thing again.

The National Hurricane Center's Saffir-Simpson scale is a 1 to 5 rating based only on maximum sustained wind speed. The Center says the scale does not take into account storm surge, rainfall flooding, or tornadoes. Its longer note adds that wind damage also depends on how long the wind lasts, whether the direction changes, how old the buildings are, and what code they were built to. A square-law comparison of two speeds on one wall is a piece of that story. It is not a damage forecast, and it is not a reason to treat every increase in a category as the same multiplication. How the basins name their scales is a [separate lesson](/topics/37-typhoon-scales-vs-saffir-simpson/).

Hold the three sentences apart. The push on a comparable surface follows the square of the speed. The power flowing in the wind follows the cube. An exponential curve is a fixed factor, repeated, as in compound interest. The hurricane did not sign up for that third sentence.

## Sources
- NASA Glenn Research Center, "Momentum Effects," on aerodynamic force in proportion to density times speed squared, and on doubling the speed quadrupling the force: https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/momentum-effects/
- NASA Glenn Research Center, "Dynamic Pressure," defining dynamic pressure as one half the density times the speed squared: https://www.grc.nasa.gov/WWW/BGH/dynpress.html
- NOAA National Weather Service, Central Region Technical Attachment 93-12, "Variation in the Force of Wind With Elevation," on force depending on the density of the air: https://repository.library.noaa.gov/view/noaa/30261
- U.S. Department of Energy, "Enabling Wind Power Nationwide" (2015), on power in the wind as one half times density times area times the cube of speed: https://www.energy.gov/sites/default/files/2015/05/f22/Enabling%20Wind%20Power%20Nationwide_18MAY2015_FINAL.pdf
- U.S. Government Accountability Office, GAO-04-756, "the power available in the wind is proportional to the cube of its speed": https://www.gao.gov/products/GAO-04-756
- NOAA Air Resources Laboratory, Technical Memorandum ARL-265, the turbine power equation with wind speed cubed: https://www.arl.noaa.gov/wp_arl/wp-content/uploads/2017/08/ARL-TM-265.pdf
- NASA, "STEMonstrations: Kinetic and Potential Energy," kinetic energy as one half times mass times speed squared: https://www.nasa.gov/wp-content/uploads/2023/03/stemonstrations-kinetic-potential-energy.pdf
- U.S. Securities and Exchange Commission, Investor.gov, "Compound Interest," interest paid on principal and on accumulated interest: https://www.investor.gov/introduction-investing/investing-basics/glossary/compound-interest
- National Hurricane Center, "Saffir-Simpson Hurricane Wind Scale," a rating based only on maximum sustained wind: https://www.nhc.noaa.gov/aboutsshws.php
- National Hurricane Center, Saffir-Simpson description (updated May 2021), on duration, wind direction, age of structures, and building codes: https://www.nhc.noaa.gov/pdf/sshws.pdf

## Key facts
- With density, area, and shape held still, the force of the wind follows the square of the speed. NASA Glenn states that doubling the speed quadruples that force. The dynamic pressure is one half times density times speed squared.
- Against a 100 mph baseline, 120 mph is 1.44 times the force (44 percent more), 140 mph is 1.96 times (96 percent more), 160 mph is 2.56 times (156 percent more), and 180 mph is 3.24 times (224 percent more). The miles per hour cancel in the ratio.
- "Times as much" is the whole new amount. "Percent more" is only the extra. 1.44 times is 44 percent more, not 144 percent more.
- Equal 20 mph steps add larger pieces of force (0.44, then 0.52, then 0.60, then 0.68 of the baseline), but the factor from one step to the next shrinks. That is quadratic. Exponential means each new amount is the previous amount times one fixed factor, as in compound interest.
- The power in the wind, energy per time, follows the cube of the speed in the standard wind-power equation. It is not the force. Damage also depends on surge, rain, duration, debris, and the building. The square law is not a universal damage rule.
- The same mass at twice the speed has four times the kinetic energy. Average impact force is four times only if the stopping distance is comparable. Pain is not a measurement of that force.
