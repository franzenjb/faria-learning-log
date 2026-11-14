// The two-day GIS course: order, teleprompter scripts and topic links live here.
// To reorder or rewrite, edit COURSE. Graphics live in index.html (older scenes)
// and course-slides*.js (new scenes). This file runs before the deck's own script.
const DAYS = [
  null,
  { name: 'Where am I?', sub: 'A shipwreck, a quiz, latitude, the clock, the race for longitude at sea, and where zero ended up.' },
  { name: 'Measuring the heavens', sub: 'Galileo, Picard, Halley, the transits of Venus, Mason and Dixon, and Gaia.' }
];
// "Want to Know More?" lesson PDFs in /downloads/, keyed by slide t
const PDF_DIR = '/downloads/';
const PDFS = {
  binder: ['Franzen_Complete_Lessons_Binder.pdf', 'The Complete Lessons Binder', '37 MB'],
  deg: ['Degrees_Arcminutes_and_Arcseconds_Faria_2026-11-10.pdf', 'Degrees, Arcminutes and Arcseconds'],
  polaris: ['Polaris_North_Star_Explained_with_Shakespeare_Sonnet_116_Faria_Lesson_2026-11-06.pdf', 'Polaris, the North Star'],
  sidereal: ['Sidereal_Day_and_Latitude_Sailing_Faria_Lesson_2026-11-06.pdf', 'Sidereal Day and Latitude Sailing'],
  sextant: ['Sextant_Navigation_Old_Sailors_Faria_2026-11-09.pdf', 'Sextant Navigation'],
  bowditch: ['Nathaniel_Bowditch_Self_Taught_Navigator_Faria_Lesson_2026-11-06.pdf', 'Nathaniel Bowditch, Self-Taught Navigator'],
  timeLon: ['Time_to_Longitude_Converting_Hours_Minutes_Seconds_to_Degrees_Faria_2026-11-07.pdf', 'Time to Longitude'],
  chrono: ['Chronometer_Longitude_in_Plain_Language_Faria_2026-11-07.pdf', 'The Chronometer in Plain Language'],
  galileo: ['Galileo_Jupiters_Moons_Medicean_Stars_Marius_and_Kepler_Faria_Lesson_2026-11-07.pdf', 'Galileo and Jupiter’s Moons'],
  jupStick: ['Jupiters_Moons_as_a_Measuring_Stick_Earths_Orbit_and_the_AU_Faria_2026-11-11.pdf', 'Jupiter’s Moons as a Measuring Stick'],
  romer: ['Romer_Io_Eclipses_Finite_Light_and_Huygens_Speed_Faria_Lesson_2026-11-07.pdf', 'Rømer, Io and the Speed of Light'],
  trigGal: ['Trigonometry_Sine_Cosine_Tangent_Ladder_and_Galileos_Moon_Faria_2026-11-08.pdf', 'The Trig Ladder and Galileo’s Moon'],
  sct: ['Sine_Cosine_Tangent_Ladder_Faria_2026-11-09.pdf', 'Sine, Cosine and Tangent Ladder'],
  thumb: ['Thumb_to_Moon_Calculating_the_Moons_Diameter_Faria_Lesson_2026-11-07.pdf', 'Thumb to Moon: The Moon’s Diameter'],
  moonUS: ['Moon_Diameter_Four_Cities_US_Map_Faria_2026-11-07.pdf', 'The Moon’s Diameter on a US Map'],
  gaiaLad: ['Gaia_Angle_Ladder_and_Mission_Slides_Faria_2026-11-10.pdf', 'The Angle Ladder, Pinky to Gaia', '4 MB'],
  gaia: ['Gaia_ESA_Mission_and_Map_of_the_Galaxy_Faria_2026-11-10.pdf', 'Gaia: ESA’s Map of the Galaxy'],
  hipp: ['Hipparchus_Lunar_Parallax_Eclipse_Reports_and_Uncertainty_Faria_Lesson_2026-11-07.pdf', 'Hipparchus and Lunar Parallax'],
  harvard: ['Harvard_Computers_Women_Who_Measured_the_Stars_Faria_Lesson_2026-11-06.pdf', 'The Harvard Computers'],
  kepM: ['Kepler_Mars_Triangle_Method_Illustrated_Faria_Lesson_2026-11-07.pdf', 'Kepler’s Mars Triangle'],
  kepS: ['Kepler_Mars_Triangulation_True_Scale_and_Exaggeration_Faria_Lesson_2026-11-07.pdf', 'Kepler’s Mars Triangle to Scale'],
  v1761: ['Venus_Transits_1761_1769_Parallax_and_Expedition_Risks_Faria_Lesson_2026-11-07.pdf', 'The Venus Transits of 1761 and 1769'],
  vTri: ['Venus_Transit_Parallax_Triangle_Faria_2026-11-07.pdf', 'The Venus Parallax Triangle'],
  vCeph: ['Venus_Transit_to_Cepheid_Distances_Faria_Lesson_2026-11-06.pdf', 'From Venus to the Cepheids'],
  picRod: ['Picard_Baseline_Rod_Method_Faria_2026-11-09.pdf', 'Picard’s Baseline Rods'],
  picMap: ['Picard_1669_triangulation_map.pdf', 'Picard’s 1669 Triangulation Map', '12 MB'],
  mdPic: ['Mason_Dixon_Picard_Connection_Sentence_Faria_2026-11-09.pdf', 'Mason, Dixon and Picard'],
  mdGeo: ['Mason_Dixon_Survey_Geometry_Corrections_and_Indigenous_Limits_Faria_Lesson_2026-11-07.pdf', 'The Mason–Dixon Survey'],
  mason: ['Charles_Mason_Astronomer_Transit_Observer_and_Surveyor_Faria_Lesson_2026-11-07.pdf', 'Charles Mason, Astronomer'],
  dixon: ['Jeremiah_Dixon_Surveyor_Observer_and_Partner_Faria_Lesson_2026-11-07.pdf', 'Jeremiah Dixon, Surveyor'],
  cook: ['Captain_James_Cook_Precision_Encounter_and_Empire_Faria_Lesson_2026-11-07.pdf', 'Captain James Cook'],
  banks: ['Joseph_Banks_Botanist_Collections_and_Empire_Faria_Lesson_2026-11-07.pdf', 'Joseph Banks, Botanist'],
  ships: ['Ships_of_Exploration_Endeavour_Bounty_Seahorse_and_Blighs_Launch_Faria_Lesson_2026-11-07.pdf', 'Ships of Exploration'],
  windC: ['Wind_Force_Velocity_Squared_Curve_Faria_2026-11-08.pdf', 'Wind Force: Speed Squared'],
  windL: ['Wind_Speed_Linear_and_Force_Quadratic_Faria_2026-11-08.pdf', 'Wind Speed vs. Wind Force'],
  growth: ['Growth_Rates_Compared.pdf', 'Growth Rates Compared'],
};
const SLIDE_PDFS = {
  'Cover': ['binder'], 'Course index': ['binder'],
  'Baselines': ['sct', 'thumb'], 'Thumb to the Moon': ['thumb', 'moonUS', 'gaiaLad'], 'The quadrant': ['sextant', 'deg'],
  'Latitude &amp; Longitude': ['deg', 'polaris'], 'Walk north': ['polaris', 'sidereal', 'sextant'], 'Two ships, one latitude': ['timeLon', 'sidereal'],
  'Scilly, 1707': ['chrono'], 'The Longitude Act, 1714': ['chrono'], 'Hours are slices': ['timeLon', 'deg'],
  'Three ways': ['chrono', 'timeLon', 'galileo'], 'The lunar distance': ['bowditch', 'sextant'], 'Galileo’s clock': ['galileo', 'jupStick'],
  'Pendulum at sea': ['chrono'], 'A clock that could travel': ['chrono', 'cook'],
  'Kepler to Halley': ['kepM', 'kepS'], 'Transit of Venus': ['v1761', 'vTri', 'vCeph'],
  'Jupiter\'s moons': ['galileo'], 'Moon mountains': ['trigGal', 'moonUS'],
  'Picard measures France': ['picRod', 'picMap'], 'Picard and the meter': ['picRod', 'mdPic'], 'Cook': ['cook', 'banks', 'ships'],
  'Mason &amp; Dixon': ['mdGeo', 'mason', 'dixon', 'mdPic'], 'Gaia galaxy': ['gaia', 'gaiaLad', 'hipp', 'harvard'],
};
const TOPICS = {
  '69-thumb-to-moon-calculating-the-moons-diameter': 'Thumb to Moon', '77-ladder-sine-cosine-and-tangent': 'The ladder: sine, cosine, tangent', '93-angle-ladder-pinky-to-gaia': 'The angle ladder', '95-degrees-arcminutes-arcseconds': 'Degrees, arcminutes, arcseconds',
  '74-tycho-brahe-uraniborg-and-stjerneborg': 'Tycho Brahe', '87-sextant-and-latitude-at-sea': 'The sextant', '18-eratosthenes-measures-the-earth': 'Eratosthenes', '19-shadow-stick-and-plumb-lines': 'Shadow stick and plumb lines', '20-why-sun-rays-are-parallel': 'Why the Sun\'s rays are parallel',
  '47-map-surprises': 'Map surprises', '48-polaris': 'Polaris', '49-bowditch': 'Bowditch', '70-time-to-longitude': 'Time to longitude', '50-sidereal-day': 'The sidereal day', '84-harrison-and-the-marine-chronometer': 'Harrison and the chronometer',
  '64-galileo-jupiters-moons': 'Galileo and Jupiter\'s moons', '46-galileo': 'Galileo', '86-galileo-moon-mountains': 'Galileo\'s Moon mountains', '96-jupiters-moons-as-a-measuring-stick': 'Jupiter\'s moons as a measuring stick', '65-romer-io-speed-of-light': 'Rømer and Io', '79-cassini-paris-and-jupiter': 'Cassini, Paris and Jupiter',
  '66-kepler-mars-triangulation-and-scale': 'Kepler, Mars and scale', '55-venus-transits-1761-1769': 'The Venus transits', '52-venus-transit-to-cepheid-distances': 'From Venus to the Cepheids', '53-captain-james-cook': 'Captain Cook', '54-joseph-banks-botanist': 'Joseph Banks',
  '73-picard-triangulation-1669': 'Picard\'s triangulation', '88-picard-baseline-rods': 'Picard\'s baseline rods', '81-willebrord-snell': 'Snell', '82-geodetic-networks': 'Geodetic networks', '83-the-meter-from-a-meridian': 'The meter from a meridian',
  '56-charles-mason': 'Charles Mason', '57-jeremiah-dixon': 'Jeremiah Dixon', '58-mason-dixon-survey': 'The Mason-Dixon survey', '89-mason-dixon-and-picard': 'Mason, Dixon and Picard', '90-mason-dixon-longitude': 'Mason-Dixon longitude',
  '94-gaia-esa-map-of-the-galaxy': 'Gaia', '63-hipparchus-lunar-parallax': 'Hipparchus and parallax', '07-telegraph-storm-warnings': 'Telegraph storm warnings', '08-benito-vines': 'Benito Viñes', '09-galveston-1900': 'Galveston, 1900', '10-havana-key-west-cable': 'The Havana cable',
  '71-hurricane-wind-force-square-not-exponential': 'Wind force: the square', '37-typhoon-scales-vs-saffir-simpson': 'Storm scales', '75-six-ways-numbers-grow': 'Six ways numbers grow', '27-hurricane-typhoon-cyclone': 'Hurricane, typhoon, cyclone', '45-looking-up-polaris-planets-ptolemy-copernicus': 'Looking up'
};
// t = the slide's data-title. label = name in the index. h1 = on-screen headline (optional override).
// n = position in the ten-slide longitude chapter. script = what Jeff says. topics = Faria pages.
const COURSE = [
  { day: 0, t: 'Cover', label: 'Cover', script: ['Welcome. This is a two-day course in GIS for the American Red Cross.', 'Each story is somebody trying to answer one question: where am I?', 'Every map you use at a disaster stands on these stories.'] },

  /* ---------------- Day 1 ---------------- */
  { day: 1, ch: 'Cold open', t: 'Scilly, 1707', label: 'Cold open: Scilly, 1707', h1: 'Scilly, 22 October 1707', topics: ['84-harrison-and-the-marine-chronometer', '70-time-to-longitude'],
    script: ['Say nothing yet. Let the picture sit for a breath.', '22 October 1707. Admiral Sir Cloudesley Shovell is bringing the fleet home from the Mediterranean: twenty-one ships. Fog and gales, no sun, no stars for days.', 'Two numbers say where a ship is. Latitude, north or south, comes from the sky. Longitude, east or west, nobody at sea could measure. The officers compare their guesses and agree they are safe in the Channel. Ask the room: where do you think they were? On Teams, take the guesses in the chat.', 'They were wrong.', 'That night Association, Eagle, Romney and Firebrand strike the Western Rocks of Scilly. Counts run from about 1,400 to 2,000 men, Shovell among them.', 'Twist: they knew their latitude, roughly. They could not find their longitude at all. Charts and currents played a part too, but Parliament heard one word: longitude. That is today: latitude and longitude, and why one took two thousand years longer than the other.'] },
  { day: 1, ch: 'Opening quiz', t: 'Mental maps', label: 'Opening Quiz: Your Mental Map', topics: ['47-map-surprises'],
    script: ['Before any history, a test. Four questions. Vote before I show you anything, and do not look it up.', 'Most of us get these wrong, and we get them wrong the same way. We all learned the world from the same flat map.', 'After each reveal, watch the globe. The globe is right. The picture in your head came from a map someone drew.', 'After the Gulf Stream, ask: does one degree of longitude always cover the same distance? At the equator it is about 69 miles. Let the room guess at 60 degrees north before you reveal it: about 35, half. The meridians all meet at the pole. Same degrees, different miles, like two Bingo squares.', 'Hold on to that feeling. The whole course is about how we learned to know where things really are.'] },
  { day: 1, ch: 'Latitude', t: 'Latitude &amp; Longitude', label: 'Latitude is the easy one', h1: 'Latitude is the easy one', topics: ['95-degrees-arcminutes-arcseconds', '48-polaris', '47-map-surprises'],
    script: ['About 325 BC. Pytheas, a Greek from Marseille, measures the noon shadow of a stick at home to work out how far north he is. Then he sails north, past Land\'s End: the same rocks that will sink Shovell.', 'To say where you are on a ball you need two numbers. Start with the easy one.', 'The Earth spins, so it has two poles and an equator halfway between. Nature drew those. Nobody had to agree on them.', 'Latitude counts from the equator, zero, to the pole, ninety. North or south.', 'One degree of latitude is 60 arcminutes. Each arcminute on the ground is one nautical mile, about 6,076 feet.', 'GIS today: latitude is the Y of every point in your feature layer. Always with N or S, or a minus sign for south.'] },
  { day: 1, ch: 'Latitude', t: 'Walk north', label: 'The star\'s height is your latitude', topics: ['48-polaris', '87-sextant-and-latitude-at-sea', '49-bowditch'],
    script: ['Here is why latitude is easy to measure.', 'Drag the person north. At the equator the Pole Star sits on the horizon. Walk north and it climbs. At the pole it is straight overhead.', 'Predict before I move it: Toronto? About 44 degrees. Washington, about 39. Miami, about 26.', 'Twist: you do not need a map, a clock or a king. One star and one angle, any clear night. That is why latitude was known for two thousand years and longitude was not.'] },
  { day: 1, ch: 'Latitude', t: 'Fist and knuckle', label: 'Your hand is a protractor', topics: ['48-polaris', '93-angle-ladder-pinky-to-gaia'],
    script: ['Hold your arm straight out and make a fist. Your fist covers about ten degrees of sky. A knuckle is about two.', 'Pick a city. Vote: how many fists up from the north horizon is Polaris?', 'Stack the fists. Washington: about four fists. Toronto: four fists and two knuckles.', 'Twist: you just measured your latitude with your hand, the way sailors did for centuries.'] },
  { day: 1, ch: 'Latitude', t: 'The pole star wanders', label: 'The pole star was not always Polaris', topics: ['48-polaris', '50-sidereal-day'],
    script: ['One catch. Polaris has not always been the pole star.', 'The Earth wobbles like a spinning top. The point in the sky above the North Pole draws a slow circle, once every 25,800 years.', 'Press The Pyramids. 2600 BC: the pole is near Thuban, in Draco. Some think the pyramid builders aimed a shaft at it; that is debated.', 'Press Today. Polaris, closest around the year 2100.', 'Twist: press AD 14,000. Vega, one of the brightest stars in the sky, becomes the pole star. Even the fixed point is not fixed.'] },
  { day: 1, ch: 'Latitude', t: 'The quadrant', label: 'The quadrant', topics: ['74-tycho-brahe-uraniborg-and-stjerneborg', '87-sextant-and-latitude-at-sea', '95-degrees-arcminutes-arcseconds'],
    script: ['The 1580s, the island of Hven, between Denmark and Sweden. Tycho Brahe builds a quadrant taller than a man and fixes it to a wall.', 'A quarter of a circle, a scale along the curve, and a weighted string. Sight along the top edge at a star. Gravity holds the string straight down. Where the string crosses the scale is the star\'s height.', 'On a hand quadrant a foot across, one arcminute is about a three-hundredth of an inch. Nobody can read that.', 'Tycho\'s arc has a radius of more than six feet. One arcminute becomes about a fiftieth of an inch. He reads it by eye, a generation before the telescope.', 'Press Hand Quadrant for a real one, brass, tenth century. Press Tycho\'s Wall Quadrant for the 1598 engraving.', 'Twist: bigger instrument, finer angle. Hold that thought until Gaia.'] },
  { day: 1, ch: 'The Size of the Earth', t: 'Power decides the measure', label: 'Aside: who decides how long a mile is?', topics: ['95-degrees-arcminutes-arcseconds', '47-map-surprises'],
    script: ['Before we measure the whole Earth: who decides how long a mile is? Guess before I tap.', 'Rome: mille passus, a thousand paces of a marching legion. About 4,860 feet.', 'London, 1593: Elizabeth I\'s statute fixes the mile at eight furlongs, 5,280 feet, so it fits the furlongs farmers already used.', 'At sea: one arcminute of latitude, about 6,076 feet. The nautical mile.', 'Twist: two came from whoever was in charge. Only one came from the Earth itself. GIS today: always check a layer\'s units. Feet, meters, and the old US survey foot are not the same.'] },
  { day: 1, ch: 'The size of the Earth', t: 'Eratosthenes', label: 'Eratosthenes', topics: ['18-eratosthenes-measures-the-earth', '19-shadow-stick-and-plumb-lines', '20-why-sun-rays-are-parallel'],
    script: ['Now measure the whole Earth.', 'About 240 BC. Eratosthenes runs the library at Alexandria. He hears that at Syene, on one day of the year, the noon Sun shines straight down a well.', 'On that same day in Alexandria, a stick casts a shadow. A little over seven degrees.', 'Seven degrees is about one fiftieth of a circle. So the distance between the two towns is one fiftieth of the way round the world.', 'One angle and one paced distance. He was within a few percent.', 'Twist: seventeen centuries later, Columbus takes a degree from the Arab astronomer al-Farghani, but reads it in short Roman miles instead of Arabic ones. His Earth comes out about a quarter too small, so Asia looks just over the horizon. The length of a mile changed history.'] },
  { day: 1, ch: 'The Clock', t: 'Hours are slices', label: 'The Earth is a 24-hour clock', topics: ['70-time-to-longitude', '95-degrees-arcminutes-arcseconds'],
    script: ['Before longitude, one idea about time. Look down on the North Pole.', 'A full turn is 360 degrees. A day is 24 hours. Cut the Earth into 24 slices, one for each hour.', '360 divided by 24 is 15. Every hour, the Earth turns 15 degrees under the Sun.', 'So if your noon comes two hours after Greenwich noon, you are two slices west: 30 degrees.', 'Zoom into one slice. One degree is four minutes of time. One arcminute is four seconds.', 'Twist: a clock four seconds wrong puts you a nautical mile out. That is how good a clock at sea has to be.'] },
  { day: 1, ch: 'The Clock', t: 'Two ships, one latitude', label: 'Longitude has no landmarks', topics: ['70-time-to-longitude', '49-bowditch'],
    script: ['Latitude is easy because the sky gives you a fixed mark. Polaris sits right above the North Pole. It does not move while the Earth turns underneath it.', 'So how high Polaris stands tells you how far north you are. Fifty degrees up, you are at fifty degrees north. Any night, any hour, the answer is the same.', 'Now look at the two ships. Both are on the gold line, fifty degrees north. Both captains look up and see Polaris fifty degrees high. The same reading, the same answer.', 'Slide the second ship east. Hundreds of miles. Polaris still reads fifty degrees for both of them. The star cannot tell them apart.', 'Watch the Earth turn. Everything else in the sky, the Sun, the Moon, the other stars, swings past both ships. It rises, crosses, and sets for each of them at a different time.', 'That is the key. East and west are not written in the sky. They are written in time. The difference in longitude between two ships is the difference in the time the Sun crosses over each of them.', 'So latitude needs a star and an angle. Longitude needs a clock. That is the whole longitude problem in one picture.', 'GIS today: one degree of longitude is 69 miles at the equator and about 35 at 60 degrees north. That is why you never buffer in degrees: project first.'] },
  { day: 1, n: 1, ch: 'Longitude', t: 'The Longitude Act, 1714', label: 'The Longitude Act, 1714', topics: ['84-harrison-and-the-marine-chronometer'],
    script: ['Seven years after Scilly, Parliament acts. The Longitude Act of 1714: twenty thousand pounds, millions in today\'s money.', 'It does not care how you do it. A clock, the Moon, Jupiter, anything. It only cares how close you get.', 'The test: sail from Britain to the West Indies, about six weeks, then say where you are.', 'Three prizes. Within half a degree, about thirty miles: twenty thousand pounds. Within two thirds: fifteen thousand. Within one degree, about sixty miles: ten thousand.', 'Slide the error and watch which prize you win. Past one degree, nothing.', 'To win the top prize with a clock, it can drift only two minutes in six weeks. Three seconds a day, on a rolling ship.', 'Twist: three ideas raced for the money. Way one came from Galileo.'] },
  { day: 1, n: 2, ch: 'Longitude', t: 'Galileo\u2019s clock', h1: 'Way 1: Jupiter\u2019s Moon Io', label: 'Way 1: Jupiter\u2019s Moon Io', topics: ['64-galileo-jupiters-moons', '79-cassini-paris-and-jupiter', '70-time-to-longitude'],
    script: ['Step 1. Two places on the Earth, seen from above the North Pole. Twenty-four slices, one for each hour. You sailed west from Paris. Your clock says 7 PM. What time is it in Paris right now? You cannot see that clock. That is the whole mystery.', 'Step 2. 1610. Galileo points his new telescope out the window at Jupiter. And he smiles.', 'Step 3. Jupiter has moons. The closest, Io, goes round every 42 hours, 1 day 18 hours, and each time it slips into Jupiter\u2019s shadow and goes dark. Right on time, every time.', 'Step 4. Each place sets its own clock by its own noon: when the Sun is highest, it is 12 o\u2019clock. Paris gets there first; you get there two hours later. Both clocks are right. But on the ship you still cannot see Paris.', 'Step 5. Eureka. When Io vanishes, everyone on Earth who is looking sees it at the same instant. Paris writes down 9 PM. You write down 7 PM. Same moment, two clocks: you are two hours behind, 30 degrees west.', 'Step 6. So Galileo makes a table: tonight Io vanishes at 9 PM Paris time. If your clock says 8, you are 15 degrees west. If it says 7, 30 degrees. If it says 3, 90 degrees. Your clock tells you where you are.', 'Then press Now Try It from a Ship. On a rolling deck nobody can hold a telescope on a dot that small. Fine on land, useless at sea. So the astronomers looked at the Moon.'] },
  { day: 1, n: 2, cont: true, ch: 'Longitude', t: 'Light needs time', label: 'Aside: Rømer, light needs time', topics: ['96-jupiters-moons-as-a-measuring-stick', '64-galileo-jupiters-moons'],
    script: ['An aside on Jupiter\'s clock. Paris, 1676. Ole Rømer is timing the eclipses of Io against the printed table.', 'When the Earth is moving away from Jupiter, the eclipses come late. When it is coming back, they come early.', 'Move the Earth round. On the far side the news is more than sixteen minutes behind.', 'Twist: Io is on time. The light is late. Rømer had found that light takes time to travel.'] },
  { day: 1, n: 3, ch: 'Longitude', t: 'The lunar distance', h1: 'Way 2: Read Home Time off the Moon', label: 'Way 2: The Moon', topics: ['49-bowditch', '87-sextant-and-latitude-at-sea'],
    script: ['Way two: read home time off the Moon.', 'Its champion: Nevil Maskelyne. On a 1761 voyage to St Helena he tests the method. In 1765 he becomes Astronomer Royal.', 'The Moon slides past the stars about half a degree every hour. Measure the angle from the Moon to a star, look it up in a table, and you have Greenwich time.', 'Now roll the deck. You are holding a sextant on a moving ship, trying to touch the Moon to a star.', 'Then the arithmetic: refraction, parallax, the almanac every three hours. An hour or more by candlelight. One arcminute wrong in the sighting is about thirty miles.', 'Twist: the man who backed the Moon becomes a judge of the prize, and so a judge of Harrison\'s clock.'] },
  { day: 1, n: 4, ch: 'Longitude', t: 'Pendulum at sea', h1: 'Way 3: Huygens Takes His Clock to Sea', label: 'Way 3: Huygens Takes His Clock to Sea', topics: ['84-harrison-and-the-marine-chronometer'],
    script: ['1656, The Hague. Christiaan Huygens invents the pendulum clock, the best timekeeper on Earth. Good to seconds a day.', 'Way three: carry home time in a clock. In the 1660s Huygens\'s clocks go to sea on English ships.', 'Raise the sea state. The ship rolls, and the roll throws the swing off. Fast, then slow. The error piles up.', 'A few minutes of error is hundreds of miles.', 'Twist: the best clock on land is useless on water. A pendulum needs a still room, and a ship is never still.'] },
  { day: 1, n: 5, ch: 'Longitude', t: 'A clock that could travel', h1: 'The Carpenter and the Clock', label: 'The Carpenter and the Clock', topics: ['84-harrison-and-the-marine-chronometer', '53-captain-james-cook'],
    script: ['1714. Parliament asks the greatest scientist alive, Isaac Newton, whether a clock could do it. Newton: a ship rolls, heats and cools. Such a watch hath not yet been made.', 'John Harrison, born 1693 in Yorkshire, a village carpenter in Lincolnshire, never schooled in science. His first clocks are made of wood. He says he can build it.', 'H1, 1735. About 75 pounds of brass. Two balances swing against each other so the rolling cancels out. Sea trial to Lisbon, 1736: it works. Harrison is not satisfied.', 'H2 and H3: two more clocks, twenty-two years. They give us the bimetal strip and the caged ball bearing, both still in use. Still too big.', 'H4, 1759: a big pocket watch, five inches across. 1761, to Jamaica, 81 days at sea. Vote: how many seconds does it lose? Hands up for a minute. Ten seconds. Five.', 'Five seconds. About a mile and a quarter of longitude. The story goes that Harrison\'s son William, aboard, called land for the next morning, against the ship\'s reckoning, and they sighted it.', 'The Board keeps moving the finish line. King George III takes his side. In 1773, at 80, Harrison is finally paid.', 'Twist: the carpenter beat Newton.'] },
  { day: 1, ch: 'Zero', t: 'Washington, 1884', label: 'Washington, 1884: where is zero?', topics: ['70-time-to-longitude', '84-harrison-and-the-marine-chronometer'],
    script: ['1876, Ireland. The engineer Sandford Fleming misses a train because the printed timetable said p.m. instead of a.m. He spends eight years campaigning for standard time.', 'October 1884, Washington. Twenty-five nations meet at the International Meridian Conference, Fleming among the delegates. Vote: Greenwich, Paris, Washington, or Ferro in the Canaries, the old zero of many maps.', 'Count the votes. Greenwich, 22 to 1. San Domingo votes against. France and Brazil abstain.', 'Why Greenwich? About seven in ten of the world\'s ships already used Greenwich charts. The vote was won before the meeting began.', 'Press And France? France keeps Paris time until 1911, and even then calls it Paris time, retarded by nine minutes and twenty-one seconds.', 'Twist: power decides zero. GIS today: the zero in your GPS and in WGS 84 runs about 102 meters, 335 feet, east of the old line at Greenwich.'] },
  { day: 1, ch: 'Zero', t: 'The date line', label: 'The date line', topics: ['70-time-to-longitude', '47-map-surprises'],
    script: ['July 1522, the Cape Verde islands. Magellan\'s last surviving ship comes home round the world. The log says Wednesday. The people on shore say Thursday. They lost a day going west.', 'If zero is at Greenwich, the other side of the world is 180 degrees. Someone has to start the new day.', 'Samoa and American Samoa. About a hundred miles apart. It is noon in both. Apia says Saturday. Pago Pago says Friday.', 'Press December 2011. Samoa trades mostly with Australia and New Zealand, so it jumps the line. Thursday the 29th is followed by Saturday the 31st. Friday the 30th never happens in Samoa.', 'Press Kiribati. It straddled the line, so half the country was a day apart from the other half. In 1995 it moved the line east around itself.', 'Twist: the date line is a political line, not a meridian. GIS today: data that crosses 180 degrees, like the Aleutians or Fiji, breaks maps unless you handle the antimeridian.'] },
  { day: 1, ch: 'Zero', t: 'Was 1900 a leap year?', label: 'Aside: was 1900 a leap year?', topics: ['70-time-to-longitude'],
    script: ['An aside, about one minute. Vote: was 1900 a leap year? Hands up for yes. Now no.', 'No. Divisible by four makes a leap year. Divisible by a hundred cancels it. Divisible by four hundred restores it. So 2000 was a leap year and 2100 will not be.', 'Why 360 degrees in a circle? Most likely an old 360-day year. One degree, one day.', 'Egypt noticed the seasons drifting and added five days of festival: 365.', 'Julius Caesar, 46 BC, adds a leap day every four years. A quarter day too much over centuries.', 'Pope Gregory, 1582: Thursday the 4th of October is followed by Friday the 15th. Ten days gone, and the 400-year rule.', 'Twist: Britain waits until 1752. Wednesday the 2nd of September is followed by Thursday the 14th. Eleven days gone. Keeping time is a political act.'] },
  { day: 1, ch: 'Zero', t: 'Where am I, now', label: 'Where am I? One second', h1: 'One Billionth of a Second = One Foot', topics: ['84-harrison-and-the-marine-chronometer', '70-time-to-longitude'],
    script: ['September 1983. Korean Air flight 007 drifts off course into Soviet airspace and is shot down. 269 people die.', 'Two weeks later the White House announces that the military\'s new satellite navigation, GPS, will be open to civilian aircraft once it is working. Within a few years it is open to everyone.', 'Same story as Scilly: a navigation error, then a government answer.', 'Press Ask the Satellites. Each satellite carries an atomic clock and broadcasts: this is the time, this is where I am. Your phone hears four. The gaps between their clocks are distances. Four distances pin you down.', 'Light travels about one foot in a billionth of a second. Harrison needed four seconds per nautical mile. Your phone needs a billionth of a second per foot.', 'Twist: every phone in this room is a Harrison clock talking to clocks in the sky. GIS today: every point you collect in Field Maps is two numbers, latitude and longitude on WGS 84, from exactly this. Where am I? Answered.'] },
  
  /* ---------------- Day 2 ---------------- */
  { day: 2, ch: 'Galileo', t: 'Jupiter\'s moons', label: 'Galileo\'s moons', topics: ['64-galileo-jupiters-moons', '46-galileo'],
    script: ['Day two: measuring the heavens. We start in January 1610.', 'Galileo turns a telescope on Jupiter and sees three small stars in a line. The next night they have moved. Soon there are four.', 'Step through the nights and keep his notebook. They are not stars. They are moons, going round Jupiter.', 'Before you see the answer, make a guess: which moon goes round fastest?', 'Each moon keeps strict time. That makes Jupiter a clock that anyone on Earth can read. Yesterday we saw why that matters.'] },
  { day: 2, ch: 'Galileo', t: 'Thumb to the Moon', label: 'Thumb to the Moon', topics: ['69-thumb-to-moon-calculating-the-moons-diameter', '93-angle-ladder-pinky-to-gaia'],
    script: ['Press Your Thumb. Hold your arm out, thumb up. Your thumb is about 1 inch wide and about 25 inches from your eye. That is 1 to 25.', 'The rule: anything your thumb just covers is 25 times farther away than it is wide. Distance divided by 25 is the width.', 'Press A Barn, One Mile Off. Your thumb just covers it. One mile is 5,280 feet. Divided by 25: the barn is about 211 feet wide.', 'Press The Moon. Hold your thumb up to the full Moon. The Moon only covers about a quarter of your thumb. A quarter inch at 25 inches is 1 to 100.', 'So the Moon is 100 times farther away than it is wide. It is 238,900 miles away. Divided by 100: about 2,400 miles across. The real figure is 2,159. Your thumb gets within about ten percent.', 'Same triangle every time, just bigger. Surveyors call these similar triangles.'] },
  { day: 2, ch: 'Galileo', t: 'Moon mountains', label: 'Mountains on the Moon', topics: ['86-galileo-moon-mountains', '69-thumb-to-moon-calculating-the-moons-diameter'],
    script: ['The same winter Galileo looks at the Moon.', 'Along the line between light and dark he sees bright points out in the dark side. Mountain tops, catching the sunrise before the ground below them.', 'He measures how far a peak sits from the line. That is one side of a right triangle. The Moon\'s radius is another.', 'Out comes the height of a mountain on another world, about four miles. From a garden in Padua.', 'It is the thumb trick again. An angle, a known length, and a triangle.'] },
  { day: 2, ch: 'Picard', t: 'Baselines', label: 'The thumb trick', h1: 'The thumb trick', topics: ['69-thumb-to-moon-calculating-the-moons-diameter', '77-ladder-sine-cosine-and-tangent'],
    script: ['Stretch your arm out. Make a fist, thumb up. Close one eye and look at the face of your thumb, base to tip.', 'Your arm is about ten thumbs long. So anything that looks one thumb tall is about ten times farther away than it is tall. A six-foot person who is one thumb tall is about sixty feet off.', 'That only works because you knew one real length, the person. The angle alone gives you a ratio, never an answer in feet.', 'Now switch eyes. Your thumb jumps. It did not move. You moved, by the distance between your eyes.', 'That is the other way to use the triangle. Look from two places a known distance apart, measure the angles, and you get the distance without knowing how big anything is. It is how you would measure a warehouse with two tripods.', 'Drag the finger closer and the jump gets bigger. Push it away and the jump shrinks. Distance is hiding in that angle.', 'The gap between your eyes has a name. It is a baseline. Every survey in this course starts with one.', 'Picard, 1669: he chained one line, under seven miles, then used angles to carry it about seventy miles north to Amiens. Why bother? Because the stars said the two ends were one degree of latitude apart. Miles per degree, times 360, is the size of the Earth: about 24,900 miles around. Newton later used Picard\u2019s number to check his law of gravity.'] },
  { day: 2, ch: 'Picard', t: 'Picard measures France', label: 'Picard measures France', topics: ['73-picard-triangulation-1669', '88-picard-baseline-rods', '82-geodetic-networks'],
    script: ['Now bring that precision down to the ground.', 'Eratosthenes paced his baseline. In 1669 Jean Picard measures his with wooden rods, laid end to end along the road from Villejuif to Juvisy. About seven miles.', 'Then he stops measuring distances. From each end he sights a church tower and measures the angle. One side and two angles fix the triangle.', 'The far side of that triangle becomes the baseline of the next one. Castle to church to church, all the way north.', 'Thirteen triangles, one measured length. He gets one degree of latitude: 57,060 toises. About 69 miles.', 'When the same method was run across France, the country turned out smaller than the old maps showed. The king said his astronomers had cost him more land than his enemies.'] },
  { day: 2, ch: 'Picard', t: 'Picard and the meter', label: 'Picard and the meter', topics: ['83-the-meter-from-a-meridian', '73-picard-triangulation-1669'],
    script: ['Picard\'s degree led somewhere he never saw.', 'If you know the length of one degree, you know the whole arc from the equator to the pole. Ninety of them.', 'In 1791 France defined a new unit from that arc. One ten-millionth of the distance from pole to equator. The meter.', 'Two surveyors, Delambre and Méchain, re-measured the line from Dunkirk to Barcelona to pin it down. It took nearly seven years.', 'So the meter in your pocket is a piece of the Earth, and it was measured with triangles.'] },
  { day: 2, ch: 'Halley and the transits', t: 'Kepler to Halley', label: 'Kepler, Horrocks and Halley', topics: ['66-kepler-mars-triangulation-and-scale', '55-venus-transits-1761-1769'],
    script: ['Back to triangles, and the biggest one yet.', 'Kepler worked out the shape of the solar system. His tables gave every planet\'s distance from the Sun, but only as a ratio. A map with no scale bar.', 'A young Englishman, Jeremiah Horrocks, corrected Kepler\'s tables and predicted that Venus would cross the face of the Sun in 1639. He was right, and he was one of two people on Earth who watched it.', 'Edmond Halley saw what that was good for. Venus against the Sun is the thumb trick. Two observers far apart on Earth see Venus cross at slightly different places.', 'Measure that shift and you get one real distance. One real distance puts a scale bar on the whole solar system.', 'Halley knew he would be dead before the next transits, in 1761 and 1769. He wrote the instructions anyway.'] },
  { day: 2, ch: 'Halley and the transits', t: 'Transit of Venus', label: 'The transits of Venus', topics: ['55-venus-transits-1761-1769', '53-captain-james-cook', '52-venus-transit-to-cepheid-distances'],
    script: ['1761 and 1769. The first worldwide science project.', 'Observers go to Siberia, to Hudson Bay, to the Cape, to Baja California. Captain Cook sails to Tahiti.', 'Each one times Venus crossing the Sun. The farther apart the observers, the longer the baseline, and the bigger the shift.', 'Put the timings together and the Sun comes out at about 93 million miles.', 'It is your thumb at arm\'s length. The two eyes are two islands, half a world apart.'] },
  { day: 2, ch: 'Halley and the transits', t: 'Cook', label: 'Harrison\'s clock sails with Cook', topics: ['53-captain-james-cook', '84-harrison-and-the-marine-chronometer', '54-joseph-banks-botanist'],
    script: ['Yesterday we left John Harrison with a watch that worked.', 'Its copy, called K1, sails with Captain Cook on his second voyage. Three years, into the Antarctic and across the Pacific.', 'Run the experiment. Set how many seconds a day the clock drifts and how many days you have been at sea. Watch the error in miles.', 'K1 held to a few seconds a day. Cook called it his trusty friend the watch, and his charts were good enough to be used for a century.', 'That is the longitude problem, solved. A clock that could travel.'] },
  { day: 2, ch: 'The line', t: 'Mason &amp; Dixon', label: 'Two men and a line', topics: ['58-mason-dixon-survey', '56-charles-mason', '57-jeremiah-dixon', '89-mason-dixon-and-picard'],
    script: ['One more job for the same tools. Two men. I will not tell you their names yet.', 'An astronomer from Greenwich and a surveyor from County Durham. The Royal Society sends them to time the 1761 transit of Venus.', 'Two days out, a French warship attacks. They limp home, are ordered back to sea, and end up timing the transit from the Cape.', 'Two years later they are hired to settle a border in America. Now the names: Charles Mason and Jeremiah Dixon.', 'They ran a line of latitude west from near Philadelphia for 233 miles, checking against the stars every few miles. Their line was good to a few hundred feet. It is still the border.'] },

  { day: 2, ch: 'Today', t: 'Gaia galaxy', label: 'Gaia: Mapping the Galaxy', topics: ['94-gaia-esa-map-of-the-galaxy', '93-angle-ladder-pinky-to-gaia', '63-hipparchus-lunar-parallax'],
    script: ['Gaia is a European space telescope, launched in 2013. Step one: how fine is it? Press Zoom Down to the Dime.', 'We start with the whole Moon, 239,000 miles away, and zoom down two hundred million times, until the screen is the width of a dime. Gaia can measure an angle that small: a dime on the Moon, seen from Earth.', 'Step two: the map it made. Every dot of light in this picture is a star Gaia measured: 1.8 billion of them, each with a position, a distance and a motion.', 'Step three: fly out. Here is the Sun, and here is the whole Milky Way, 100,000 light-years across. Gaia found three things nobody expected.', 'A swallowed galaxy: the leftover stars of a smaller galaxy that crashed into ours ten billion years ago. A snail-shell wobble: our neighborhood is still ringing from a galaxy that passed through. And a sleeping black hole, 1,926 light-years away, found only because a star wobbles around nothing.', 'Same triangle we started with on Day 1: a baseline and an angle. Gaia just has the biggest baseline and the finest angle.'] },
  { day: 2, ch: 'Side trip', t: 'Flat maps lie', label: 'Map projections', topics: ['47-map-surprises'],
    script: ['Remember the opening quiz? Here is why your mental map was wrong. Now the full story.', 'Unwrap the globe into Mercator. Every compass course is a straight line, which is why sailors loved it. The price is size. Greenland looks as big as Africa.', 'Drag Greenland down onto Africa. Africa is fourteen times larger.', 'Switch to an equal-area map. Sizes are honest now, and the shapes are squashed.', 'Then draw a route. On Mercator the straight line is not the shortest way. The shortest way bends toward the pole.', 'There is no right projection. There is the right one for the job. Know which one you are looking at.'] },,
  { day: 2, ch: 'Appendix', t: 'One degree more', label: 'Appendix: one degree more', topics: ['50-sidereal-day'],
    script: ['Only if the room asks. One turn of the Earth against the stars takes 23 hours 56 minutes.', 'Press One Turn. The far star is back overhead. But the Earth has moved along its orbit, so the Sun is not.', 'Press One More Degree. The Earth turns about one more degree to face the Sun again. One degree is four minutes. That is the 24-hour day.'] }
];

// Titles are always Title Case (Jeff's standing rule). Applied to every headline, day, chapter and index label.
const SMALL = new Set('a an the and but or nor for so yet of on in to at by as up via per vs from with into onto over'.split(' '));
function titleCase(str) {
  const words = String(str).split(/(\s+)/); let first = true;
  return words.map((w, i) => {
    if (/^\s+$/.test(w) || !w) return w;
    const prev = words.slice(0, i).join('').trim(), lastWord = !words.slice(i + 1).some(x => /\S/.test(x));
    const afterBreak = first || /[:.?!·–—]$/.test(prev); first = false;
    return w.split('-').map(part => {
      const core = part.replace(/^[^A-Za-zÀ-ÿ]+/, ''); if (!core) return part;
      if (/[A-Z].*[A-Z]|\d/.test(core) || /^[a-z]+[A-Z]/.test(core)) return part; // H4, UTM, 1/50
      const low = core.toLowerCase(), pre = part.slice(0, part.length - core.length);
      if (!afterBreak && !lastWord && SMALL.has(low.replace(/[^a-z]/g, ''))) return pre + low;
      return pre + core.charAt(0).toUpperCase() + core.slice(1);
    }).join('-');
  }).join('');
}

/* ---------- The 30-minute talk: /claude1/v3/?talk=30 ----------
   Chosen by a review panel (presentation design, story, GIS teaching) for a 30-minute Teams talk.
   Each row: [slide t, minutes, script lines to keep (1-based, in order; strings are added lines)]. */
const TALK30 = [
  ['Cover', .5, ['Every pin you drop on a Red Cross map is two numbers. Tonight is the story of how many people had to die, and one stubborn carpenter had to prove a genius wrong, before anyone could say where they were.']],
  ['Scilly, 1707', 2.5, [1, 2, 3, 4, 5, 6]],
  ['Mental maps', 2, ['Two quick questions tonight: Havana, then Rome. Vote in the chat. Keys: A to D record votes; → reveals on the globe; → brings Rome; → reveals; → draws the Gulf Stream and the westerlies; → moves on.', 'The Gulf Stream: warm water from the tropics, and the westerlies carry that warmth to Europe. Boston gets air off a frozen continent. Same latitude, different climate.', 3, 'Hold on to that feeling. The rest of the talk is how we learned to know where things really are.']],
  ['Latitude &amp; Longitude', 2, [1, 2, 3, 4, 'Longitude lines run pole to pole. Now lay the Bingo card on the globe: latitude calls the row, longitude calls the column. Two calls, one square, and everyone finds it.', 6]],
  ['Walk north', 2, [1, 2, 3, 'Hold your arm out and make a fist. A fist is about ten degrees of sky; Polaris here is about four fists up.', 'By day, sailors did the same with the noon Sun and a printed table.', 'Now go south. Cross the equator and Polaris sinks below the horizon. No star marks the south pole. Find the Southern Cross and run a line through its long arm, about four and a half lengths: that spot is the south celestial pole, and its height is your latitude.', 4]],
  ['Eratosthenes', 2, [2, 3, 4, 5, 6, 'A century later Hipparchus laid a grid of numbered lines over the world. Around AD 150 Ptolemy\'s Geography listed thousands of places by two numbers, with zero longitude out in the Canary Islands. Remember the Canaries.']],
  ['Hours are slices', 2, [1, 2, 3, 4, 5, 6]],
  ['Two ships, one latitude', 2, [3, 4, 5, 6, 7, 8]],
  ['The Longitude Act, 1714', 2, [1, 2, 4, 5, 6, 7]],
  ['Galileo’s clock', 2, [1, 2, 3, 4, 5, 7]],
  ['The lunar distance', 2, ['The idea was old. Johannes Werner proposed it in 1514. For 250 years nobody could predict the Moon well enough to use it.', 1, 3, 4, 5, 'In 1767 Maskelyne printed the first Nautical Almanac: the Moon worked out every three hours, years ahead.', 6]],
  ['A clock that could travel', 3, [1, 2, 3, 'H2 and H3: tap straight through this press.', 5, 6, 7, 8]],
  ['Washington, 1884', 2, [2, 3, 4, 6]],
  ['Where am I, now', 2.5, [1, 2, 'The first test satellite went up in 1978. The full system was declared ready in 1995.', 3, 4, 5, 6, 'So the next time Field Maps drops a pin on a family that needs a cot tonight, remember: the stars gave us latitude, Harrison\'s clock gave us longitude, and a sky full of clocks answered Admiral Shovell\'s question in under a second.']]
];
if (/[?&]talk=30\b/.test(location.search)) {
  const keep = [];
  for (const [t, min, pick] of TALK30) {
    const c = COURSE.find(x => x.t === t); if (!c) { console.warn('talk30: no slide', t); continue; }
    const lines = pick.map(p => typeof p === 'number' ? c.script[p - 1] : p).filter(Boolean);
    lines[0] = `⏱ ${min} min · ` + lines[0];
    keep.push({ ...c, script: lines });
  }
  COURSE.length = 0; COURSE.push(...keep);
  document.title = 'Where Am I? · 30 Minutes';
}

(function () {
  const deck = document.getElementById('deck');
  const find = t => [...deck.querySelectorAll('.slide')].find(s => s.dataset.title === t || s.getAttribute('data-title') === t.replace(/&amp;/g, '&'));
  document.querySelectorAll('.slide').forEach(s => s.dataset.fx = 'fade');

  /* ---- course index slide ---- */
  const firstOf = d => COURSE.find(c => c.day === d);
  const idx = document.createElement('section'); idx.className = 'slide native wide'; idx.dataset.title = 'Course index'; idx.dataset.fx = 'fade';
  idx.innerHTML = `<div class="stage"><div class="cindex"><p class="kicker">American Red Cross · Disaster GIS</p><h1>Two Days, One Question: Where Am I?</h1><div class="ci-days">${[1, 2].map(d => `<button class="ci-day" data-first="${(firstOf(d) || {}).t || ''}"><span class="ci-n"><small>Day</small> ${d}</span><span class="ci-dot"></span><strong>${titleCase(DAYS[d].name)}</strong></button>`).join('')}</div></div></div>`;
  deck.appendChild(idx);

  /* ---- build the new native slides ---- */
  for (const [t, def] of Object.entries(NEW_SLIDES)) {
    const s = document.createElement('section'); s.className = 'slide native'; s.dataset.title = t; s.dataset.fx = 'fade';
    s.innerHTML = `<div class="text"><p class="kicker"></p><h1>${def.h1}</h1>${def.ctl || ''}</div><div class="stage">${def.canvas ? '<canvas class="fig"></canvas>' : `<svg class="fig" viewBox="0 0 1000 640" preserveAspectRatio="xMidYMid meet">${def.fig}</svg>`}</div>`;
    deck.appendChild(s); def._el = s;
  }

  /* ---- put every slide in course order; drop what the course does not use ---- */
  const used = [];
  COURSE.forEach((c, i) => {
    const s = find(c.t); if (!s) { console.warn('course: no slide called', c.t); return; }
    c.el = s; used.push(s); deck.appendChild(s);
    const chapterList = COURSE.filter(x => x.ch === c.ch && x.n);
    const k = s.querySelector('.kicker'); if (k && c.day) k.textContent = `Day ${c.day} · ${c.ch}` + (c.n ? (c.cont ? ` · ${c.n}, continued` : ` · ${c.n} of ${Math.max(...COURSE.filter(x => x.ch === c.ch && x.n).map(x => x.n))}`) : '');
    if (c.h1 && s.querySelector('h1')) s.querySelector('h1').textContent = c.h1;
  });
  const attic = document.createElement('div'); attic.hidden = true; document.body.appendChild(attic); deck.querySelectorAll('.slide').forEach(s => { if (!used.includes(s)) { s.classList.remove('slide'); attic.appendChild(s); } });
  DAYS.forEach(d => { if (d) d.name = titleCase(d.name); });
  COURSE.forEach(c => { c.label = titleCase(c.label); if (c.ch) c.ch = titleCase(c.ch); });
  idx.querySelectorAll('.ci-day strong, .ci-day li').forEach(h => { h.textContent = titleCase(h.textContent); });
  deck.querySelectorAll('.slide h1, .slide .kicker').forEach(h => { h.textContent = titleCase(h.textContent); });
  const live = COURSE.filter(c => c.el);

  /* ---- cover ---- */
  const cov = find('Cover'); if (cov) { const q = s => cov.querySelector(s); if (q('.kicker')) q('.kicker').textContent = 'American Red Cross · a two-day GIS course'; if (q('.sub')) q('.sub').textContent = 'Measurement, mapping and disaster decisions'; if (q('.vlink')) q('.vlink').remove(); }

  /* ---- shell: index | Jeff's script | visuals | topics ---- */
  const nav = document.querySelector('nav.nav'), shell = document.createElement('div'); shell.id = 'shell';
  shell.innerHTML = `<aside id="lside"><button id="ls-tog" title="Slide index (I)" aria-label="Slide index">☰</button><button id="notes-tog" title="Speaker notes (N)" aria-label="Speaker notes">✎</button><div id="ls-panel"><h2>Where Am I?</h2><ol id="ls-list"></ol></div></aside>
  <section id="jeff"><header><span class="who">Jeff · script</span><span id="jf-pos"></span><span class="sz"><button id="jf-minus" title="Smaller type">A−</button><button id="jf-plus" title="Larger type">A+</button></span></header><h2 id="jf-title"></h2><div id="jf-script"></div><footer><span>Next: <b id="jf-next"></b></span><span class="clk"><span id="jf-clock">00:00</span><button id="jf-reset" title="Restart the segment clock">reset</button></span></footer></section>
  <main id="visual"></main>
  <aside id="rside"><button id="rs-tog" title="Topic pages (T)" aria-label="Topic pages">❯</button><div id="rs-panel"><h2>Faria topics</h2><div id="rs-list"></div></div></aside>`;
  deck.parentNode.insertBefore(shell, deck); const visual = shell.querySelector('#visual'); visual.appendChild(deck); if (nav) visual.appendChild(nav);
  const tv = document.createElement('div'); tv.id = 'topicview'; tv.hidden = true; tv.innerHTML = `<iframe title="Faria topic page"></iframe><button id="tv-back">← Back to the slide</button>`; document.body.appendChild(tv);

  // index list: days, chapters, slides
  let h = '', lastDay = -1, lastCh = null;
  live.forEach((c, i) => { if (c.day !== lastDay) { h += c.day ? `<li class="day" data-i="${i}">Day ${c.day} · ${DAYS[c.day].name}</li>` : ''; lastDay = c.day; lastCh = null; } if (c.ch && c.ch !== lastCh) { h += `<li class="ch" data-i="${i}">${c.ch}</li>`; lastCh = c.ch; } h += `<li class="sl" data-i="${i}"><span>${i}</span>${c.label}</li>`; });
  const list = shell.querySelector('#ls-list'); list.innerHTML = h;
  const jump = i => { if (typeof go === 'function') go(i); };
  list.onclick = e => { const li = e.target.closest('li'); if (li) jump(+li.dataset.i); };
  idx.querySelectorAll('.ci-day').forEach(b => b.onclick = () => jump(live.findIndex(c => c.t === b.dataset.first)));
  const relayout = () => { dispatchEvent(new Event('resize')); };
  const store = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
  const setL = on => { shell.classList.toggle('ls-open', on); store('c1-ls', on ? '1' : '0'); setTimeout(relayout, 260); };
  const setR = on => { shell.classList.toggle('rs-shut', !on); shell.querySelector('#rs-tog').textContent = on ? '❯' : '❮'; store('c1-rs', on ? '1' : '0'); setTimeout(relayout, 260); };
  const setN = on => { shell.classList.toggle('notes-on', on); store('c1-notes', on ? '1' : '0'); setTimeout(relayout, 60); };
  shell.querySelector('#notes-tog').onclick = () => setN(!shell.classList.contains('notes-on')); if (store('c1-notes') === '1') shell.classList.add('notes-on');
  shell.querySelector('#ls-tog').onclick = () => setL(!shell.classList.contains('ls-open'));
  shell.querySelector('#rs-tog').onclick = () => setR(shell.classList.contains('rs-shut'));
  if (store('c1-ls') === '1') shell.classList.add('ls-open'); if (store('c1-rs') !== '1') { shell.classList.add('rs-shut'); shell.querySelector('#rs-tog').textContent = '❮'; }

  // teleprompter type size and segment clock
  let fs = +(store('c1-fs') || 1); const jeff = shell.querySelector('#jeff'); const setFs = v => { fs = Math.max(.7, Math.min(1.8, v)); jeff.style.setProperty('--jfs', fs); store('c1-fs', fs); }; setFs(fs);
  shell.querySelector('#jf-minus').onclick = () => setFs(fs - .1); shell.querySelector('#jf-plus').onclick = () => setFs(fs + .1);
  let t0 = Date.now(); shell.querySelector('#jf-reset').onclick = () => { t0 = Date.now(); };
  setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000); shell.querySelector('#jf-clock').textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; }, 500);

  // topic view, with the return button always in the same corner
  const openTopic = slug => { tv.querySelector('iframe').src = `/topics/${slug}/`; tv.hidden = false; tv.querySelector('#tv-back').focus(); };
  const closeTopic = () => { tv.hidden = true; tv.querySelector('iframe').src = 'about:blank'; };
  tv.querySelector('#tv-back').onclick = closeTopic;
  addEventListener('keydown', e => { if (!tv.hidden) { e.stopImmediatePropagation(); if (e.key === 'Escape' || e.key === 'Backspace') closeTopic(); return; } if (e.target.matches && e.target.matches('input,textarea')) return; const k = e.key.toLowerCase(); if (k === 'i') setL(!shell.classList.contains('ls-open')); if (k === 'n') setN(!shell.classList.contains('notes-on')); if (k === 't') setR(shell.classList.contains('rs-shut')); }, true);

  // keep the three panes in step with the slide on screen
  const fallbackScript = c => { const ps = [...c.el.querySelectorAll('.text p:not(.kicker):not(.onscreen)')].map(p => p.textContent.trim()).filter(Boolean); let notes = []; try { notes = NOTES[c.el.dataset.title] || []; } catch (e) { } return ps.concat(notes); };
  let shown = -1;
  const sync = () => {
    const i = live.findIndex(c => c.el.classList.contains('active')); if (i < 0 || i === shown) return; shown = i; const c = live[i];
    shell.querySelector('#jf-pos').textContent = (c.day ? `Day ${c.day} · ` : '') + `${i} of ${live.length - 1}`;
    shell.querySelector('#jf-title').textContent = c.label;
    const sc = shell.querySelector('#jf-script'); sc.innerHTML = (c.script || fallbackScript(c)).map(p => `<p>${p}</p>`).join(''); sc.scrollTop = 0;
    shell.querySelector('#jf-next').textContent = live[i + 1] ? live[i + 1].label : 'End of the course';
    list.querySelectorAll('li').forEach(li => li.classList.toggle('on', li.classList.contains('sl') && +li.dataset.i === i)); const on = list.querySelector('li.on'); if (on) { const pn = shell.querySelector('#ls-panel'); if (on.offsetTop < pn.scrollTop || on.offsetTop > pn.scrollTop + pn.clientHeight - 30) pn.scrollTop = on.offsetTop - pn.clientHeight / 3; } // scroll only the index panel; scrollIntoView can also move ancestor panes
    const tp = c.topics || []; shell.querySelector('#rs-list').innerHTML = tp.length ? tp.map(s => `<button data-slug="${s}">${TOPICS[s] || s}</button>`).join('') : `<p class="none">No topic page for this slide yet.</p>`;
    shell.querySelectorAll('#rs-list button').forEach(b => b.onclick = () => openTopic(b.dataset.slug));
  };
  // headlines that scenes rewrite on the fly (chapters, quiz questions) are kept in Title Case too
  setInterval(() => { document.querySelectorAll('.slide.active h1, .slide.active .kicker').forEach(h => { const t = titleCase(h.textContent); if (t !== h.textContent) h.textContent = t; });
    // button labels name things, so they are Title Case too (quiz answers excepted); only plain-text buttons are touched
    document.querySelectorAll('.slide.active button:not(.opt):not(.x), #detour-back').forEach(b => { if (b.children.length) return; const t = titleCase(b.textContent); if (t !== b.textContent) b.textContent = t; }); }, 400);
  // detours: leave the story for a side trip (e.g. Galileo) and come straight back
  // "Want to Know More?" button: opens the lesson PDFs for this slide
  const more = document.createElement('button'); more.id = 'more-btn'; more.hidden = true; more.innerHTML = '\u{1F4C4} Want to Know More?'; visual.appendChild(more);
  const phone = matchMedia('(max-width:860px)'); const placeMore = () => { if (phone.matches && nav) { nav.insertBefore(more, nav.lastElementChild); more.classList.add('in-nav'); } else { visual.appendChild(more); more.classList.remove('in-nav'); } }; placeMore(); phone.addEventListener('change', placeMore);
  const mp = document.createElement('div'); mp.id = 'more-panel'; mp.hidden = true; visual.appendChild(mp);
  const pdfsFor = c => (SLIDE_PDFS[c.t] || []).map(k => PDFS[k]).filter(Boolean);
  more.onclick = () => { const c = live.find(c => c.el.classList.contains('active')); const ps = c ? pdfsFor(c) : []; mp.innerHTML = `<header><h3>Want to Know More?</h3><button class="x" aria-label="Close">×</button></header><p>The full lesson behind this slide, as a PDF.</p>` + ps.map(([f, n, sz]) => `<div class="pdf"><span>${n}${sz ? ` <small>${sz}</small>` : ''}</span><a href="${PDF_DIR}${f}" target="_blank" rel="noopener">Open</a><a href="${PDF_DIR}${f}" download>Download</a></div>`).join(''); mp.hidden = false; mp.querySelector('.x').onclick = () => { mp.hidden = true; }; };
  const syncMore = () => { document.body.classList.remove('gal-open'); document.querySelectorAll('.qd-gal').forEach(g => { g.hidden = true; }); const c = live.find(c => c.el.classList.contains('active')); more.hidden = !(c && pdfsFor(c).length); mp.hidden = true; };
  new MutationObserver(syncMore).observe(deck, { attributes: true, attributeFilter: ['class'], subtree: true });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !mp.hidden) mp.hidden = true; });
  const back = document.createElement('button'); back.id = 'detour-back'; back.hidden = true; visual.appendChild(back); let detourFrom = null, detourTo = null;
  document.addEventListener('click', e => { const b = e.target.closest('.detour'); if (!b) return; const from = live.findIndex(c => c.el.classList.contains('active')), to = live.findIndex(c => c.t === b.dataset.detour); if (to < 0) return; detourFrom = from; detourTo = to; back.textContent = '\u2190 Back to ' + (b.dataset.label || live[from].label); back.hidden = false; jump(to); });
  back.onclick = () => { if (detourFrom !== null) jump(detourFrom); detourFrom = null; detourTo = null; back.hidden = true; };
  // leaving the side trip any other way (arrows, index) drops the Back button; the next slide after the detour target still counts as the side trip
  new MutationObserver(() => { if (detourTo === null) return; const i = live.findIndex(c => c.el.classList.contains('active')); if (i !== detourTo && i !== detourTo + 1) { detourFrom = null; detourTo = null; back.hidden = true; } }).observe(deck, { attributes: true, attributeFilter: ['class'], subtree: true });
  new MutationObserver(sync).observe(deck, { attributes: true, attributeFilter: ['class'], subtree: true });
  addEventListener('load', () => { for (const def of Object.values(NEW_SLIDES)) { try { def.init(def._el); } catch (e) { console.error('course slide failed', def.h1, e); } } sync(); relayout(); });
  // occasional fun: the warp (stars rush outward, slide racks into focus) plays only
  // from the cover into the course index, and when moving forward into a new day
  window.FX_PICK = (prev, target) => { if (target <= prev) return null; const i = live.findIndex(c => c.el === document.querySelectorAll('.slide')[target]); if (i < 1) return null; return live[i].day !== live[i - 1].day || live[i - 1].t === 'Cover' ? 'warp' : null; };
  window.COURSE_LIVE = live;
})();
