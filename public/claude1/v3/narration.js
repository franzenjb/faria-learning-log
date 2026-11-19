// Spoken narration + matching captions for every beat.
// Playback uses pre-generated MP3s listed in audio/manifest.js (ElevenLabs George).
// A beat with no MP3 stays silent and shows captions only. There is no computer-voice fallback.
(function () {
  const TALK = /[?&]talk=30\b/.test(location.search) || /[?&]talk=/.test(location.search);
  if (TALK) document.body.classList.add('v3-talk');

  const norm = t => (t || '').replace(/&amp;/g, '&').replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();

  // Scripts keyed by normalized slide title. Each string is one beat, 2–4 spoken sentences.
  // Written for the ear: no URLs or symbols, numbers in words or natural speech.
  const SCRIPTS = {
    'Cover': [
      'Welcome. This is a course in measurement, mapping, and disaster decisions for the American Red Cross. Every pin you drop on a map is two numbers: latitude and longitude. These stories are how we learned to get both of them right.'
    ],
    'Scilly, 1707': [
      'October 22nd, 1707. Admiral Sir Cloudesley Shovell is bringing the British fleet home from the Mediterranean. Days of storm and cloud have hidden the Sun and the stars, so the ships cannot check where they are.',
      'The navigators compare their reckonings. They agree they are safe, heading into the English Channel. They believed they were here.',
      'They were wrong. They were farther north, heading straight for the Isles of Scilly, off the tip of Cornwall.',
      'That night, in the dark and the rain, the flagship Association hits the Western Rocks. Eagle, Romney, and Firebrand follow her. Four ships go down. About fourteen hundred to two thousand men are lost, Shovell among them. They knew their latitude. They did not know their longitude.',
      'Every pin we drop at a disaster is those same two numbers. This is the story of how we learned to get both of them right.'
    ],
    'Mental maps': [
      'Before the history, a quick test of the map in your head. Vote, then we will reveal the real places on the globe. Hold on to that feeling if you are surprised. The rest of the course is how we learned to know where things really are.'
    ],
    'Latitude & Longitude': [
      'Latitude is the easy one. Zero at the Equator, ninety at the Poles. The parallels run east and west, like the rungs of a ladder around the Earth.',
      'Longitude lines run pole to pole. They are called meridians. Zero is at Greenwich. That zero was a choice, not a fact of nature. The paradox: meridians run north to south, but they tell you how far east or west you are. Parallels run east to west, but they tell you how far north or south.',
      'Put both together and you have a grid. Two numbers name any place on Earth: how far north or south, and how far east or west.',
      'Now lay a bingo card on the globe. Latitude calls the row. Longitude calls the column. Two calls, one square, and everyone finds the same place. Same place, two ways to write it: sailors used degrees, minutes, and seconds; computers and GPS use decimals, and the minus sign stands in for south and west.'
    ],
    'Walk north': [
      'Here you are, on the Earth. The star over the north pole is Polaris. Your latitude is the angle of that star above the horizon.',
      'Walk north, and Polaris climbs. At the Equator it sits on the horizon, at zero degrees. At the North Pole it stands straight overhead, at ninety.',
      'Look at the sky in front of you. The altitude of Polaris is your latitude. Polaris is not exactly on the pole: about 12 degrees away two thousand years ago, and about seven-tenths of a degree today, so navigators applied a small correction.',
      'On a clear night you can find it. Dubhe and Merak, the two stars at the end of the Big Dipper\'s bowl, point the way. Extend that line about five times their gap, and you reach Polaris.',
      'South of the Equator there is no pole star. Sailors used the Southern Cross instead. Its long arm points toward the south celestial pole, an empty place in the sky. The height of that point above the horizon is your latitude south.'
    ],
    'Fist and knuckle': [
      'You already have a protractor: your hand. Held out at arm\'s length, a fist is about ten degrees of sky, and a knuckle is about two. To find Washington, about thirty-nine degrees north, you would stack about four fists under Polaris. It is rough, but it is how a sailor could check a number in the dark.'
    ],
    'The pole star wanders': [
      'The pole star was not always Polaris. The Earth\'s axis slowly wobbles, a motion called precession, once around in about twenty-six thousand years. Two thousand years ago, the pole star sat about twelve degrees from the true pole. In our century the offset is only about seven-tenths of a degree. Navigators applied a correction. The sky is not a fixed ceiling.'
    ],
    'The quadrant': [
      'To measure that angle, sailors and astronomers used a quadrant, a quarter-circle marked in degrees, and later a sextant, a sixth of a circle. From Ptolemy to Tycho Brahe to Hadley, the tool changes, but the idea is the same: measure the height of a star or the Sun, and you have your latitude.'
    ],
    'Power decides the measure': [
      'Even a mile is a human choice. Different countries once used different miles, and the nautical mile was later tied to the Earth itself: one minute of latitude, one sixtieth of a degree, is one nautical mile, about six thousand seventy-six feet. Who decides the measure? The people who need to agree.'
    ],
    'Eratosthenes': [
      'Eratosthenes ran the great Library of Alexandria, around 240 BC.',
      'Syene, on the longest day of the year. At noon the Sun shines straight down a well. There is no shadow.',
      'The same noon in Alexandria, a shadow of about 7 degrees: one-fiftieth of a circle.',
      'Fifty times the distance between the two cities gives the size of the Earth.',
      'His estimate: about 250,000 stadia, roughly 24,000 to 29,000 miles, depending on the length of a stadion.',
      'Today, from satellites, the meridians measure 24,901 miles. With a stick, a shadow, and a paced distance, he was already almost there.'
    ],
    'Hours are slices': [
      'Here is the Earth, turning. The ground under your feet is riding a sphere that spins once a day.',
      'Look straight down on the North Pole. The whole world is a clock face, turning underneath you.',
      'Idea one: every circle has 360 degrees.',
      'Idea two: every day has 24 hours. The blue ring is a clock. Noon faces the Sun. Midnight faces away.',
      'Now put them together. Watch Greenwich go once around. One turn of the Earth is one day, so 360 degrees takes 24 hours. Read them off together: 90 degrees is 6 hours; 180 degrees is 12 hours.',
      'Divide 360 by 24, and you get 15. One hour of time is 15 degrees of longitude. That single fact is the bridge from a clock to a place on the map.'
    ],
    'Two ships, one latitude': [
      'Before 1883, every town kept its own time. Watch the noon line cross the country: every flash is a town setting its clocks to its own noon. Hundreds of towns, hundreds of different times.',
      'Four American cities, west to east: Fresno, Denver, Memphis, Philadelphia. Fresno sits near 120 degrees west.',
      'Noon in Philadelphia: the Sun is at its highest, and Philadelphia sets its clock to 12.',
      'Same moment, now in degrees. Philadelphia is 75 west, Memphis 90, Denver 105, Fresno 120. Each hour earlier is 15 degrees farther west.',
      'But stand in Denver. You know your own noon. What time is it in Philadelphia right now? Without that, you cannot say how far west you are.',
      'In 1883 the railroads drew United States time zones on exactly these lines: 120, 105, 90, and 75 west. Pacific, Mountain, Central, Eastern. A sailor has the same problem as Denver: he knows his own noon, and he needs home time.'
    ],
    'The Longitude Act, 1714': [
      'Seven years after the wreck at Scilly, Parliament acts. The Longitude Act of 1714 offers twenty thousand pounds — about five million dollars today — to anyone who can find longitude at sea.',
      'The closer you got, the bigger the prize, up to twenty thousand pounds. The test is a voyage to the West Indies, about six weeks, and you must say where you are.',
      'Two rivals chase the prize. The astronomers bet on the Moon. A country carpenter, John Harrison, bets on a clock.',
      'The judges are Newton, Halley, and the Astronomers Royal. The challenger is a self-taught carpenter with no university, no Royal Society, and no credentials.'
    ],
    "Galileo's clock": [
      '1609. Galileo hears of a Dutch spyglass, builds his own, about twenty times, and turns it on the night sky.',
      'January 1610, Jupiter. Little stars beside it change places night by night. Watch his notebook fill in. They are moons going round Jupiter, the first ever found beyond our own.',
      'So not everything circles the Earth. Moons around another world are evidence for Copernicus, and they get Galileo into trouble with the Church.',
      'And they keep time. Io slips into Jupiter\'s shadow every 42 and a half hours, and everyone on Earth who is looking sees it vanish at the same instant. A clock in the sky. Paris, where Cassini made the tables, writes down 9 PM. Chicago, far to the west, writes down 3 PM.',
      'Six hours: 90 degrees west. Same instant, two clocks, and the difference is longitude.',
      'On land it works: a long telescope on a stand, a pendulum clock beside it. By 1668, Cassini\'s tables let map makers redraw whole countries.',
      'Watch France. From 1679, Picard and La Hire fix longitudes along the coast by timing Io. The west coast moves east by about one and a half degrees. The real France is smaller. Louis the Fourteenth is said to have complained that his astronomers took more of France than his enemies ever did.'
    ],
    'Light needs time': [
      'An aside, because it surprised everyone. Paris, 1676. Ole Rømer times Io against Cassini\'s table. With the Earth on Jupiter\'s side of the Sun, the eclipse arrives on time.',
      'Months later the Earth is on the far side, and the eclipse runs late. Io is on time. The light is late: it has to cross the whole orbit. Rømer\'s own figure was about 22 minutes to cross Earth\'s orbit. The modern value is about 16.7 minutes, or about 8 minutes 19 seconds from the Sun to us.',
      'It took two people. Christiaan Huygens turned Rømer\'s delay into the first number for the speed of light, about 212,000 kilometers per second, in his 1690 Treatise on Light. That is about two-thirds of the true value.'
    ],
    'The lunar distance': [
      'This was the Board\'s favorite. It trusted a human mind: a trained navigator, a sextant, and the Nautical Almanac of Nevil Maskelyne, Astronomer Royal, plus about four hours of arithmetic. Harrison bet the other way, on a machine that simply carries the time.',
      'Now do it on a rolling deck. The Moon moves about 30 minutes of arc in an hour, and one hour is 15 degrees of longitude, or 900 nautical miles at the Equator. So one minute of arc wrong in the sighting is about 30 nautical miles of longitude. Then you still have an hour of arithmetic by candlelight. That 30 miles is not the same as one minute of latitude, which is one nautical mile.'
    ],
    'Pendulum at sea': [
      '1656, The Hague. Christiaan Huygens invents the pendulum clock, the best timekeeper on Earth, good to seconds a day. In the 1660s his clocks go to sea on English ships. The ship rolls, and the roll throws the swing off, fast, then slow. The error piles up. A few minutes of error is hundreds of miles. The best clock on land is useless on water. A pendulum needs a still room, and a ship is never still.'
    ],
    'A clock that could travel': [
      'John Harrison, born 1693 in Yorkshire, a village carpenter, never schooled in science. His first clocks are made of wood. He says he can build a clock that will keep time at sea.',
      'H1, in 1735, is about 72 pounds of brass. On a trial to Lisbon it works. Harrison is not satisfied. H2 and H3 take him many more years; H3 alone takes about 19 years. They give us the bimetal strip and the caged ball bearing, both still in use. Still too big.',
      'H4, in 1759, looks like a giant pocket watch, five inches across. Here is the dial, and here is the movement inside it. In 1761 to 1762 it sails to Jamaica, eighty-one days at sea.',
      'It looks like a big pocket watch, but inside it is a precision machine, built to beat the sea: temperature compensation for heat and cold, a fast, heavy balance that ignores the ship\'s rolling, and a spring that keeps it running while you wind it. Five seconds lost in eighty-one days at sea.'
    ],
    'Washington, 1884': [
      'Before 1884, every great power had its own zero. A French chart and a British chart could give the same island different longitudes. Trade, telegraphs and railroads needed one shared answer.',
      'October 1884, Washington. Forty-one delegates from twenty-five nations meet to choose a single zero of longitude. Here they are on the steps.',
      'They choose Greenwich, 22 to 1. San Domingo votes against. France and Brazil abstain. About seven in ten of the world\'s ships already used Greenwich charts.',
      'The agreement did two jobs. It gave maps and charts one shared zero of longitude. And it named Greenwich as the reference for a universal day, the starting line that time zones would later be built on. The conference did not invent time zones: American railroads had already drawn theirs in 1883, and countries adopted Greenwich-based zones over the following decades. France kept Paris time until 1911.'
    ],
    'The date line': [
      'The date line, in theory, is a straight meridian: 180 degrees, halfway around from Greenwich. Cross it, and the date changes.',
      'In 1867 Alaska was sold to the United States and moved to America\'s date, so the line bends around the Aleutians. All of Alaska shares one day, and Friday happened twice.',
      'In 1995 Kiribati jogged the line far to the east, so the whole country could share one day. December 31, 1994 was skipped in the islands that moved.',
      'In December 2011, Samoa and Tokelau jumped the line to line up with Australia and New Zealand. Samoa skipped December 30. American Samoa, about 80 miles away, stayed put: same hour on the clock, a full day apart.'
    ],
    'Was 1900 a leap year?': [
      'The calendar itself has a longitude problem. A Gregorian leap year is every four years, except most century years. 1900 was not a leap year; 2000 was, because it is divisible by 400. Get the calendar wrong, and a clock that is perfect will still read the wrong day. Dates, like meridians, are rules people agreed to follow.'
    ],
    'Where am I, now': [
      'Today: GPS, a sky full of clocks. The first test satellite went up in 1978. The full system was declared ready in 1995. About 31 satellites, 12,550 miles up, each going around twice a day.',
      'Each satellite carries an atomic clock and broadcasts: this is the time, this is where I am. Your phone times how long each signal took to arrive. Travel time times the speed of light is a distance. Light travels about one foot in a billionth of a second.',
      'Anywhere, any time, four satellites pin you down. The next time Field Maps drops a pin on a family that needs a cot tonight, remember: the stars gave us latitude, Harrison\'s clock gave us longitude, and a sky full of clocks answered Admiral Shovell\'s question in under a second.'
    ],
    'Decimal places': [
      'Each decimal place zooms you in ten times. Try it.'
    ],
    'Sidereal day': [
      'Noon: the Sun is straight overhead, and a far star lines up with it.',
      'One full turn later, 360 degrees, the star is back overhead. That takes 23 hours and 56 minutes. That is a sidereal day, a day by the stars. The Sun is not back yet.',
      'The Earth has also moved along its orbit, so it must turn about one more degree, about four minutes, before the Sun is overhead again. Noon to noon is 24 hours. The star day and the Sun day are not the same length, and that extra four minutes is why we have a calendar of seasons as well as a clock.'
    ],
    'Null Island': [
      'Zero degrees latitude, zero degrees longitude: open ocean in the Gulf of Guinea, off Africa, and one weather buoy. There is no island here.',
      'But it is the busiest spot in our databases. Every failed geocode, every blank cell, every GPS left off, lands right here at 0, 0. A dot at Null Island is not a place. It is a failure that looks like a location. Filter it out before you trust the map.'
    ],
    'Which system': [
      'One shelter in Tampa, written 27.9506 degrees north, 82.4572 degrees west.',
      'The same place can be written in different systems: degrees minutes seconds, decimal degrees, or a grid like UTM. Same ground, different numbers.',
      'Use the right numbers in the wrong system and you miss. Read a UTM coordinate in zone 17 as if it were zone 16, and the point jumps about 365 miles west, into the Gulf. Always name the system with the numbers.'
    ],
    'Errors grow': [
      'A small error at the start of a voyage grows with distance. A compass off by a few degrees, or a clock off by a few minutes, puts you miles from where you think you are.',
      'Harrison needed four seconds to equal about one nautical mile of longitude at the Equator, because 15 degrees in 24 hours is 15 times 3,600 seconds, or 54,000 seconds for 900 nautical miles, which is four seconds per mile.',
      'Today a billionth of a second is about one foot of light-travel. The lesson is the same: if time is your measuring stick, a tiny time error is a place error, and it grows as you go.'
    ],
    'Image gallery': [
      'This gallery is a set of pictures behind the stories: the clocks, the observatory, the maps, and the people. Tap an image to open it. Arrows step through them; Escape or a click closes.',
      'One to linger on is the red time ball at the Royal Observatory, Greenwich, in use since 1833. Every day it is raised halfway at 12:55, to the top at 12:58, and it drops at exactly 1 PM, so captains on the Thames could set their chronometers to Greenwich time before sailing, and at sea compare that home time with local noon to find longitude. Why 1 PM? At noon the astronomers were busy timing the Sun.'
    ],
    'Light needs time, again': [
      'Back to Paris, 1676. Ole Rømer is timing the eclipses of Io. On the near side of Earth\'s orbit, the eclipse arrives on time.',
      'On the far side, the news is late. Io is on time; the light is late. Rømer\'s own figure was about 22 minutes to cross the orbit. The modern value is about 16.7 minutes, or about 8 minutes 19 seconds from the Sun to us.',
      'It took two people. Huygens, in 1690, turned that delay into about 212,000 kilometers per second, around two-thirds of the true speed of light.'
    ],
    'Many ways to draw the globe': [
      'Every flat map is a deal with the globe. First, the simplest flat map: plate carrée, or equirectangular. Longitude is x, latitude is y. Easy to draw. It keeps a simple grid, and it stretches the land toward the poles.',
      'Now the globe itself, an orthographic view. This is the only drawing that does not stretch the land. It keeps everything, because it is the Earth. It gives up flatness: it will not fit on a page. Drag it to turn it.',
      'Peel the globe into twelve slices, called gores, the way a mapmaker would cut paper to glue onto a sphere. Laid side by side they are almost flat. Each slice keeps nearly true shape and size. You give up a single continuous sheet.',
      'Mercator, in 1569, made a conformal map sailors loved: local angles stay true, and compass courses stay straight. The cost is size. The high latitudes inflate, and Greenland swells toward the size of Africa.',
      'Gall–Peters is a cylindrical equal-area map. James Gall published it in 1855. Arno Peters popularized a similar one in 1973, and the name Gall–Peters stuck. It keeps area true everywhere. It gives up shape: the tropics look stretched tall, and the high latitudes look squashed.',
      'Goode\'s homolosine, in 1923, is an interrupted equal-area map. It keeps area true, and the cuts fall in the oceans, not the land, so the continents keep their shape better. What you give up is a map you can fold back up, or measure straight across.',
      'Winkel tripel, in 1921, is a compromise: nothing is exactly true, and nothing is too badly wrong. National Geographic adopted it for world maps in 1998, and many atlases followed.',
      'Now the trap. Keep Greenland\'s true size, in miles, and slide it down to the equator next to Africa. Africa is about 11.7 million square miles. Greenland is about 0.84 million. Africa is about 14 times larger. The wall map hid that.'
    ],
    'Vector or raster': [
      'Two ways to record the world. The same coastline, held two ways. Vector on the left, raster on the right.',
      'Vector stores coordinates: points, lines, and polygons. Zoom in, and the line stays sharp, because the file is a list of places, not a picture.',
      'Raster stores one number per cell, land or water. Zoom in, and the coast turns into stairs. The file you open in GIS is one or the other. Always ask which.'
    ],
    'The nautical mile': [
      'A degree of latitude is 60 arcminutes, anywhere on Earth.',
      'One arcminute of latitude is one nautical mile, fixed at 1,852 meters, about 6,076 feet. On a chart, the latitude scale is a mileage scale.',
      'A degree of longitude is 60 nautical miles only at the equator. At 60 degrees north it is about 30, and it shrinks to nothing at the poles. Latitude miles stay the same. Longitude miles shrink. That is not the same as a lunar-distance error, where one arcminute wrong in a Moon sight is about 30 nautical miles of longitude.'
    ],
    'The decision brief': [
      'A useful brief starts with a decision, not a map. In this example, open Lincoln High gym as a shelter: it is dry, it has a generator, 200 cots, and it sits on high ground.',
      'Then say the next check, and when. Look at the roads and the river at 6 PM. If the river is still rising, move the overflow to the civic center.',
      'Then the expiry. This recommendation is valid until 10 PM, or the next official forecast, whichever comes first. After that, decide again. A map that cannot say when it expires is not ready for a decision.'
    ],
    "Jupiter's moons": [
      'Day two begins in January 1610. Galileo turns a telescope on Jupiter and sees three small stars in a line. The next night they have moved. Soon there are four. They are not stars. They are moons, going around Jupiter, each keeping strict time. That makes Jupiter a clock that anyone on Earth can read, if the deck will hold still.'
    ],
    'Thumb to the Moon': [
      'Hold out your thumb, and you can measure the Moon. The idea is a simple angle: the Moon\'s apparent size in the sky, times its distance, gives its diameter. A small angle, a large distance, a surprising size. This is the same ladder of sine and tangent we still use on a map.'
    ],
    'Moon mountains': [
      'The same winter as the Jupiter moons, 1610, Galileo turns his telescope on the Moon, and that March he publishes what he sees in Sidereus Nuncius, the Starry Messenger. Along the terminator — the line between day and night — he sees bright points out in the dark. They are mountain tops, catching the sunrise before the ground below them.',
      'He measures how far a lit peak sits past that line: about one twentieth of the Moon\'s width. That distance is one leg of a right triangle. The Moon\'s radius is the other. The long side, the hypotenuse, is the radius plus the mountain\'s height. A little Pythagoras, and the height comes out.',
      'Galileo assumed a Moon about 2,000 miles across, and concluded the mountains stood more than four miles high: a mountain he could never climb, measured from a garden in Padua. With today\'s diameter, 2,159 miles, the same one-twentieth gives at least 5.4 miles. Real lunar peaks rise about three to four miles above their surroundings. His method gives an upper-end figure. The Moon was not a perfect crystal sphere.',
      'How wide is the Moon? Distance first, width second. It is about 240,000 miles away, and it covers half a degree of sky: one 720th of a full circle. A circle of radius 240,000 miles is about 1,508,000 miles around. One 720th of that is about 2,100 miles. Laid on the United States, a circle that wide, centered on Illinois, reaches from Denver almost to Boston. Galileo\'s four-mile mountain is a speck on it.'
    ],
    'Baselines': [
      'To measure the Earth carefully, you start with a baseline you can actually pace or rod out, then build triangles from it. The thumb trick is the same idea at arm\'s length: one known length, two angles, and the far side is fixed. From a courtyard to a kingdom, triangulation is how a short stick becomes a long map.'
    ],
    'Picard measures France': [
      'In 1669, Jean Picard measures a baseline with wooden rods, laid end to end along the road from Villejuif to Juvisy, about seven miles. Then he stops measuring distances. From each end he sights a church tower and measures the angle. One side and two angles fix the triangle, and the far side becomes the next baseline. Thirteen triangles later, he gets one degree of latitude: 57,060 toises, about 69 miles.'
    ],
    'Picard and the meter': [
      'Picard\'s degree was a seed of the metric system. A century later, the meter was meant to be one ten-millionth of the distance from the Equator to the Pole, along a meridian. To fix that length, surveyors had to measure a meridian the way Picard had, with baselines and triangles. A unit of length, born from the size of the Earth.'
    ],
    'Kepler to Halley': [
      'Kepler gives us the shape of a planet\'s path, but not its true size. Horrocks, and later Halley, see that a transit of Venus — when Venus crosses the Sun\'s face — can be timed from far-apart places on Earth. The difference in timing is a parallax, and that parallax can turn Kepler\'s scale into miles. Halley, in 1716, writes the invitation. The whole world is asked to watch.'
    ],
    'Transit of Venus': [
      'The transits of 1761 and 1769 are a global campaign. Observers sail to the edges of the map to time Venus on the Sun. The numbers are messy, the weather is cruel, and still a solar-system scale comes into view. Captain Cook\'s first voyage is, among other things, a trip to time that crossing at Tahiti.'
    ],
    'Cook': [
      'Harrison\'s clock also goes to sea with Cook. A copy, K1, built by Larcum Kendall, sails on the second voyage. Cook praises it as his faithful guide. The carpenter\'s idea, in a navigator\'s hands, turns a prize problem into a daily practice: carry home time, compare it with local noon, and read your longitude.'
    ],
    'Mason & Dixon': [
      'Charles Mason and Jeremiah Dixon are sent to America to survey a line of latitude, the boundary between Pennsylvania and Maryland. They bring the best instruments of their age, and they run a line that later becomes famous as the Mason-Dixon line. It is a reminder that latitude is an angle you can actually cut into the ground, if you are careful enough.'
    ],
    'Gaia galaxy': [
      'The same two questions — what is the angle, and how far away is it — now reach across the Galaxy. The European Space Agency\'s Gaia mission measures tiny angles to more than a billion stars, again and again, and turns those angles into a three-dimensional map. The ladder that began with a stick and a well now reaches the Milky Way.'
    ],
    'Flat maps lie': [
      'Every flat map is a compromise. You cannot peel an orange and lay the skin down without stretching or tearing it. That is why Greenland looks huge on a Mercator map, and why a globe still tells the truth about size and direction. In a later appendix we will watch that idea up close: a flat map, a globe, gores, Mercator, and Greenland sliding down to the Equator.'
    ],
    'One degree more': [
      'One extra degree of turning is about four minutes of time, the difference between the star day and the Sun day. It is a small number that adds up over a year, and it is why the seasons keep pace with the calendar. A degree is not only a mark on a protractor. It is a slice of a turning world.'
    ],
    'Columbus chart': [
      'Ptolemy, about AD 150, put zero longitude in the Fortunate Isles, the Canaries, at the western edge of the known world. In 1474, Toscanelli draws a chart on which Japan sits in the middle of the Atlantic. In 1492 Columbus sails west from the Canaries, from that zero. Zero was a choice. People put it at the edge of what they knew.'
    ],
    'France got smaller': [
      'The sky clock worked on land, so France used it to remeasure itself. From 1679, Jean Picard and Philippe de La Hire travelled the coasts, timing Io against observations in Paris.',
      'Watch the west coast. The old outline is gray. The 1693 survey is gold. Brittany slides east, by about a degree and a half at Brest. France got smaller — about 60,000 square miles smaller than the old maps, roughly a fifth.',
      'As the story goes, Louis the Fourteenth complained that his astronomers had taken more of France than his enemies ever had. It is a famous story. I cannot promise he said those exact words. But the error was real.'
    ],
    'GPS zero is 102 m east': [
      'One plot twist, for the GIS people. Stand on the famous brass line at Greenwich with your phone, and it will not say zero.',
      'GPS zero, the WGS 84 meridian, runs about 102 meters, 335 feet, east of the brass line. That is a little longer than a football field, drawn here to the same scale. The figure is from Malys and colleagues, in the Journal of Geodesy, 2015.',
      'Nobody moved anything. The old line was set by a telescope aimed using local gravity, which tilts very slightly at Greenwich. GPS measures from the center of the Earth. Two good answers, 102 meters apart.'
    ],
    'Four satellites, one spot': [
      'How does a phone turn time signals into a place? One satellite: the signal arrives about seven hundredths of a second late. Times the speed of light, that is about 21,000 kilometers. You are somewhere on this ring.',
      'A second satellite gives a second ring. Two rings cross in two places.',
      'A third ring picks one of them. That is your spot. Here, Fort Myers.',
      'But your phone clock is cheap. Off by one thousandth of a second, and every distance is off by 300 kilometers. The rings no longer meet.',
      'A fourth satellite lets the receiver solve for the place and its own clock error at the same time. The rings snap together. Four satellites: one spot, and the exact time. Three for where, one for when.',
      'And here is the Harrison problem, three hundred years later. Light travels about 30 centimeters, about one foot, in a billionth of a second — a nanosecond. A clock error of one nanosecond is a foot of error on the ground. Harrison fought for seconds. GPS fights for billionths. It is still just clocks.'
    ],
    'The end': [
      'Thank you for coming along. I welcome your questions. My email is on the screen. And if you\'d like to keep exploring, the appendix continues the journey.'
    ],
    'Ptolemy': [
      'About AD 150, Ptolemy\'s Geography lists about 8,000 places by two numbers. This is the Ulm printing of 1482, with the grid already drawn. Latitude is close. Longitude is estimated.',
      'The grid is an idea as much as a measurement. Once you name a place with two numbers, anyone else can find it, even if the numbers are still a little wrong.',
      'He put zero longitude in the Fortunate Isles, the Canaries, the western edge of the known world. A map rebuilt from a table of two numbers: geocoding, 1,800 years early. Remember the Canaries. They will return when Columbus sails west, and when the world has to pick a zero again.'
    ],
    'At sea, it fails': [
      'At sea, the Jupiter-moon method fails. You cannot hold a moon of Jupiter in the eyepiece on a rolling deck, and a pendulum clock cannot keep time on the waves.',
      'So in 1707, longitude at sea is still a guess. Remember Scilly. Seven years later, Parliament offers a prize for solving it.'
    ]
  };

  // speech-only pronunciation, captions keep the original script
  const SAY = [
    [/\brows\b/g, 'roes'],
    [/\brow\b/g, 'roe'],
    [/Rømer/g, 'Rohmer'],
    [/Huygens/g, 'Highgenz'],
    [/Maskelyne/g, 'Maskelin'],
    [/Eratosthenes/g, 'Eratostheneez'],
    [/Scilly/g, 'Silly'],
    [/Io([\'s]|\b)/g, 'Eye-oh$1'],
    [/Ptolemy/g, 'TOLL-uh-mee'],
    [/Pytheas/g, 'PITH-ee-us'],
    [/Kiribati/g, 'Keer-ih-bass'],
    [/Gaia/g, 'GUY-uh'],
    [/Picard/g, 'Pih-CAR'],
    [/Hipparchus/g, 'Hip-PAR-kus'],
    [/Cloudesley/g, 'CLOUDS-lee'],
    [/Shovell/g, 'SHOV-ul'],
    [/Toscanelli/g, 'Tos-kah-NELL-ee']
  ];
  const spoken = s => SAY.reduce((t, [a, b]) => t.replace(a, b), s);

  const slug = t => norm(t).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const audio = document.createElement('audio');
  audio.id = 'v3-audio';
  audio.preload = 'auto';
  document.documentElement.appendChild(audio);

  const cc = document.createElement('div');
  cc.id = 'v3-cc';
  cc.setAttribute('aria-live', 'polite');
  const speakBtn = document.createElement('button');
  speakBtn.id = 'v3-cc-btn';
  speakBtn.type = 'button';
  speakBtn.title = 'Captions on or off';
  speakBtn.setAttribute('aria-label', 'Closed captions');
  speakBtn.id = 'v3-cc-btn';
  speakBtn.title = 'Captions on or off';
  speakBtn.setAttribute('aria-label', 'Closed captions');
  speakBtn.textContent = 'CC';
  const cap = document.createElement('div');
  cap.className = 'v3-cc-text';
  cc.appendChild(speakBtn);
  cc.appendChild(cap);

  const railBtn = document.createElement('button');
  railBtn.id = 'audio-tog';
  railBtn.type = 'button';
  const railIcon = document.createElement('span');
  railIcon.className = 'rail-icon';
  const railLabel = document.createElement('span');
  railLabel.className = 'rail-label';
  railBtn.append(railIcon, railLabel);

  const pauseBtn = document.createElement('button');
  pauseBtn.id = 'audio-pause';
  pauseBtn.type = 'button';
  const pauseIcon = document.createElement('span');
  pauseIcon.className = 'rail-icon';
  const pauseLabel = document.createElement('span');
  pauseLabel.className = 'rail-label';
  pauseBtn.append(pauseIcon, pauseLabel);

  const audioHint = document.createElement('button');
  audioHint.id = 'audio-hint';
  audioHint.type = 'button';
  audioHint.hidden = true;
  audioHint.textContent = 'Turn on audio';

  const state = {
    title: '', beat: 0, text: '', muted: false, paused: false,
    unlocked: false, mode: 'idle', speaking: false, blocked: false, ccOff: false
  };
  try { state.muted = localStorage.getItem('v3-narrate-mute') === '1'; } catch (e) {}
  try { state.ccOff = localStorage.getItem('v3-cc-off') === '1'; } catch (e) {}
  if (TALK) state.muted = true; // presenting URL stays silent

  // Incremented on every play/stop so a stale play() promise cannot start a second clip.
  let playGen = 0;
  // True only while the current clip is actually playing, so a reset cannot look like "ended".
  let expectEnd = false;

  const stopAudio = () => {
    expectEnd = false;
    playGen += 1; // invalidate in-flight play() callbacks
    try {
      audio.pause();
      audio.removeAttribute('src');
      audio.removeAttribute('data-gen');
      audio.load();
    } catch (e) {}
    state.speaking = false;
  };

  const showAudioHint = on => {
    state.blocked = !!on;
    audioHint.hidden = !on || TALK || state.muted;
  };

  const setBtn = () => {
    speakBtn.textContent = 'CC';
    speakBtn.dataset.state = state.ccOff ? 'off' : 'on';
    speakBtn.title = state.ccOff ? 'Captions off. Click to show.' : 'Captions on. Click to hide.';
    speakBtn.setAttribute('aria-pressed', state.ccOff ? 'false' : 'true');
    cc.classList.toggle('cc-off', state.ccOff);
    document.body.classList.toggle('v3-cc-off', state.ccOff || TALK);
    document.body.classList.toggle('v3-cc-on', !state.ccOff && !TALK);

    const off = state.muted || TALK;
    railIcon.textContent = off ? '🔇' : '🔊';
    railLabel.textContent = off ? 'Audio off' : 'Audio on';
    railBtn.dataset.state = off ? 'off' : (state.paused ? 'paused' : 'on');
    railBtn.title = off
      ? 'Audio off. Click to turn on (M).'
      : 'Audio on. Click to turn off (M). Long-press, or use Pause (B), to pause.';
    railBtn.setAttribute('aria-label', off ? 'Audio off' : 'Audio on');
    railBtn.setAttribute('aria-pressed', off ? 'false' : 'true');

    pauseBtn.hidden = off;
    pauseBtn.dataset.state = state.paused ? 'paused' : 'playing';
    pauseIcon.textContent = state.paused ? '▶' : '⏸';
    pauseLabel.textContent = state.paused ? 'Play' : 'Pause';
    pauseBtn.title = state.paused ? 'Play narration (B)' : 'Pause narration (B)';
    pauseBtn.setAttribute('aria-label', pauseBtn.title);

    if (off) audioHint.hidden = true;
    else if (state.blocked) audioHint.hidden = false;
  };
  setBtn();

  const mp3For = (title, beat) => {
    const s = slug(title);
    return [`v3/audio/${s}_b${beat}.mp3`, `v3/audio/s_${s}_${beat}.mp3`];
  };

  // Pre-generated MP3s (ElevenLabs George, multilingual v2) are listed in
  // window.V3_NARRATION_MP3 by v3/audio/manifest.js. Missing clips stay silent.
  const findMp3 = (title, beat) => {
    const urls = mp3For(title, beat);
    const listed = (window.V3_NARRATION_MP3 || []).map(x => typeof x === 'string' ? x : (x && (x.file || x.src))).filter(Boolean);
    const hit = urls.find(u => listed.includes(u));
    return hit || null;
  };

  const showCaption = text => {
    cap.textContent = text || '';
    cc.classList.toggle('talk-off', TALK);
    cc.classList.toggle('cc-off', state.ccOff);
    cc.classList.toggle('no-text', !text);
    document.body.classList.toggle('v3-cc-off', state.ccOff || TALK);
    document.body.classList.toggle('v3-cc-on', !state.ccOff && !TALK);
  };

  const unlock = () => { state.unlocked = true; };

  const play = (title, beat, reason) => {
    const t = norm(title);
    const lines = SCRIPTS[t] || SCRIPTS[t.replace("'", '’')] || SCRIPTS[t.replace('’', "'")] || [];
    const text = lines[Math.min(beat, Math.max(0, lines.length - 1))] || lines[0] || '';
    state.title = t; state.beat = beat; state.text = text; state.paused = false;
    showCaption(TALK ? '' : text);
    window.v3Narration = state;
    document.body.dataset.v3Title = t;
    document.body.dataset.v3Beat = String(beat);

    // Always stop the previous clip first, even if the new beat will be silent.
    expectEnd = false;
    try { audio.pause(); } catch (e) {}

    if (!text || TALK || state.muted || !state.unlocked) {
      stopAudio();
      state.mode = (!text || TALK || state.muted || !state.unlocked) ? (state.muted ? 'muted' : 'idle') : 'idle';
      document.body.dataset.v3Mode = state.mode;
      document.body.dataset.v3Src = '';
      setBtn();
      return;
    }

    const url = findMp3(t, beat);
    const gen = ++playGen;
    if (!url) {
      try { audio.removeAttribute('src'); audio.removeAttribute('data-gen'); audio.load(); } catch (e) {}
      state.speaking = false;
      state.mode = 'caption';
      document.body.dataset.v3Mode = 'caption';
      document.body.dataset.v3Src = '';
      setBtn();
      return;
    }

    state.mode = 'mp3';
    document.body.dataset.v3Mode = 'mp3';
    document.body.dataset.v3Src = url;
    audio.dataset.gen = String(gen);
    audio.src = url;
    const start = audio.play();
    if (start && start.then) {
      start.then(() => {
        if (gen !== playGen) return;
        state.speaking = true;
        expectEnd = true;
      }).catch(err => {
        // Autoplay blocked, or this start was aborted by a newer play(). Stay silent.
        if (gen !== playGen) return;
        state.speaking = false;
        expectEnd = false;
        const name = (err && err.name) || '';
        const msg = (err && err.message) || '';
        if (name === 'NotAllowedError' || /not allowed|autoplay/i.test(msg)) showAudioHint(true);
        setBtn();
      });
    }
    setBtn();
  };

  audio.addEventListener('playing', () => {
    if (String(audio.dataset.gen || '') !== String(playGen)) return;
    state.speaking = true;
    expectEnd = true;
    showAudioHint(false);
    setBtn();
  });
  audio.addEventListener('ended', () => {
    if (!expectEnd) return;
    if (String(audio.dataset.gen || '') !== String(playGen)) return;
    expectEnd = false;
    state.speaking = false;
    if (state.muted || state.paused || TALK || !state.unlocked) return;
    const el = document.querySelector('#deck .slide.active') || document.querySelector('.slide.active');
    const api = el && el._v3StepApi;
    if (api && typeof api.fwd === 'function') api.fwd();
  });

  const toggleMute = () => {
    if (TALK) return;
    unlock();
    state.muted = !state.muted;
    try { localStorage.setItem('v3-narrate-mute', state.muted ? '1' : '0'); } catch (e) {}
    if (state.muted) { stopAudio(); state.paused = false; }
    else play(state.title || currentTitle(), state.beat || 0, 'unmute');
    setBtn();
  };

  const togglePause = () => {
    if (TALK || state.muted) return;
    unlock();
    if (state.mode === 'mp3' && audio.src) {
      if (audio.paused) { audio.play().catch(() => {}); state.paused = false; expectEnd = true; }
      else { expectEnd = false; audio.pause(); state.paused = true; }
    }
    setBtn();
  };

  const currentTitle = () => {
    const el = document.querySelector('#deck .slide.active') || document.querySelector('.slide.active');
    return el ? el.dataset.title : '';
  };

  const toggleCaptions = () => {
    state.ccOff = !state.ccOff;
    try { localStorage.setItem('v3-cc-off', state.ccOff ? '1' : '0'); } catch (e) {}
    showCaption(state.text);
    setBtn();
  };

  speakBtn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); toggleCaptions(); });
  railBtn.addEventListener('click', e => {
    if (railBtn._skipClick) { railBtn._skipClick = false; e.preventDefault(); return; }
    e.preventDefault(); e.stopPropagation();
    unlock();
    showAudioHint(false);
    toggleMute();
  });
  let pressTimer = 0;
  railBtn.addEventListener('pointerdown', e => {
    if (e.button && e.button !== 0) return;
    clearTimeout(pressTimer);
    pressTimer = setTimeout(() => {
      pressTimer = 0;
      if (state.muted || TALK) return;
      railBtn._skipClick = true;
      togglePause();
    }, 550);
  });
  const clearPress = () => { if (pressTimer) { clearTimeout(pressTimer); pressTimer = 0; } };
  railBtn.addEventListener('pointerup', clearPress);
  railBtn.addEventListener('pointerleave', clearPress);
  railBtn.addEventListener('pointercancel', clearPress);
  pauseBtn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); unlock(); togglePause(); });
  audioHint.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    unlock();
    showAudioHint(false);
    if (state.muted) toggleMute();
    else play(state.title || currentTitle(), state.beat || 0, 'hint');
  });

  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target && e.target.matches && e.target.matches('input,textarea')) return;
    const help = document.getElementById('v3-help');
    if (help && !help.hidden) return; // the modal handles its own keys
    const k = e.key.toLowerCase();
    if (k === 'm') { e.preventDefault(); e.stopImmediatePropagation(); toggleMute(); }
    else if (k === 'b') { e.preventDefault(); e.stopImmediatePropagation(); togglePause(); }
  }, true);

  // Hook V3.steps before slide inits run on load, so every beat fires a play().
  const hookSteps = () => {
    if (typeof V3 === 'undefined' || typeof V3.steps !== 'function' || V3.steps._narrHooked) return false;
    const orig = V3.steps;
    V3.steps = function (el, n, onStep) {
      const api = orig.call(this, el, n, function (k, entering) {
        onStep(k, entering);
        const title = (el && el.dataset && el.dataset.title) || currentTitle();
        play(title, k, entering ? 'enter' : 'step');
      });
      if (el) el._v3StepApi = api;
      return api;
    };
    V3.steps._narrHooked = true;
    return true;
  };
  hookSteps();

  // Fallback: if a slide has no step engine, narrate beat 0 when it becomes active.
  const last = { title: '', t: 0 };
  const onSlide = () => {
    const title = currentTitle();
    if (!title) return;
    const n = norm(title);
    if (n === last.title && (performance.now() - last.t) < 400) return;
    // if a steps hook just fired, skip the duplicate enter
    if (norm(state.title) === n && (performance.now() - last.t) < 400) { last.title = n; return; }
    last.title = n; last.t = performance.now();
    // wait a tick so V3.steps enter (k=0) can win
    setTimeout(() => {
      if (norm(state.title) === n && (performance.now() - last.t) < 50) return;
      if (norm(currentTitle()) !== n) return;
      if (norm(state.title) === n && state.beat !== 0 && document.querySelector('.slide.active')) {
        // a steps hook already set a beat for this slide
        return;
      }
      if (norm(state.title) !== n) play(n, 0, 'slide');
    }, 60);
  };

  const patchHelp = () => {
    document.querySelectorAll('#v3-help .v3-help-card p').forEach(p => {
      const t = p.textContent || '';
      if (/Contents/.test(t) && /Speaker notes/.test(t) && !/Audio/.test(t)) {
        p.innerHTML = 'On the left edge, <b>☰ Contents</b> opens the table of contents (or press <b>I</b>). <b>✎ Speaker notes</b> opens the speaking notes (or press <b>N</b>). <b>🔊 Audio</b> turns the narrator on or off (or press <b>M</b>). When audio is on, use <b>Pause</b>, or press <b>B</b>, to pause or resume.';
      }
      if (/narrator will read/.test(t) && !/Audio button/.test(t)) {
        p.innerHTML = 'After you press Start, a narrator will read each step. Use the <b>Audio</b> button on the left, or press <b>M</b>, to turn it off or on, and <b>Pause</b> or <b>B</b> to pause or resume. Press <b>?</b> anytime to see this again.';
      }
    });
  };

  const mountRail = () => {
    const lside = document.getElementById('lside');
    if (!lside || railBtn.isConnected) return;
    const notes = document.getElementById('notes-tog');
    if (notes && notes.parentNode === lside) notes.after(railBtn);
    else lside.appendChild(railBtn);
    railBtn.after(pauseBtn);
    const visual = document.getElementById('visual') || document.body;
    visual.appendChild(audioHint);
  };

  addEventListener('load', () => {
    hookSteps();
    mountRail();
    patchHelp();
    const visual = document.getElementById('visual') || document.body;
    visual.appendChild(cc);
    const deck = document.getElementById('deck');
    if (deck) new MutationObserver(onSlide).observe(deck, { attributes: true, attributeFilter: ['class'], subtree: true });
    const ok = document.getElementById('v3-help-ok');
    if (ok) ok.addEventListener('click', () => {
      unlock();
      const t = currentTitle();
      play(t, state.title === norm(t) ? state.beat : 0, 'start');
    }, true);
    const help = document.getElementById('v3-help');
    if (help && help.hidden && !TALK) {
      // returning visitor: unlock on first gesture, then play
      const once = ev => {
        if (ev && ev.target && ev.target.closest && ev.target.closest('#v3-help, #v3-help-ok, #v3-help-btn')) return;
        unlock();
        play(currentTitle(), state.beat || 0, 'gesture');
      };
      addEventListener('pointerdown', once, { once: true, capture: true });
      addEventListener('keydown', once, { once: true, capture: true });
    }
    onSlide();
  });

  window.v3Narration = state;
  window.v3NarrationPlay = play;
  window.v3NarrationScripts = SCRIPTS;
})();
