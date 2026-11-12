// The four-day GIS course: order, teleprompter scripts and topic links live here.
// To reorder or rewrite, edit COURSE. Graphics live in index.html (older scenes)
// and course-slides*.js (new scenes). This file runs before the deck's own script.
const DAYS = [
  null,
  { name: 'Measure and triangulate', sub: 'An opening quiz, then the thumb trick through Halley and the transits of Venus.' },
  { name: 'Time and precision', sub: 'Galileo, Rømer and Picard.' },
  { name: 'From Earth to maps', sub: 'Projections, vector and raster, data sources, coordinate systems.' },
  { name: 'Error and the modern toolkit', sub: 'Error propagation, buffers and overlays, then storms and shelters.' }
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
  'Scilly, 1707': ['chrono'], 'The Longitude Act, 1714': ['chrono'], 'Hours are slices': ['timeLon', 'deg'], 'Longitude bingo': ['timeLon'],
  'Three ways': ['chrono', 'timeLon', 'galileo'], 'The lunar distance': ['bowditch', 'sextant'], 'Galileo’s clock': ['galileo', 'jupStick'],
  'Pendulum at sea': ['chrono'], 'A clock that could travel': ['chrono', 'cook'],
  'Kepler to Halley': ['kepM', 'kepS'], 'Transit of Venus': ['v1761', 'vTri', 'vCeph'],
  'Jupiter\'s moons': ['galileo'], 'Moon mountains': ['trigGal', 'moonUS'], 'Jupiter as a measuring stick': ['jupStick'], 'Light needs time': ['romer', 'jupStick'],
  'Picard measures France': ['picRod', 'picMap'], 'Picard and the meter': ['picRod', 'mdPic'], 'Cook': ['cook', 'banks', 'ships'],
  'Mason &amp; Dixon': ['mdGeo', 'mason', 'dixon', 'mdPic'], 'Gaia': ['gaia', 'gaiaLad', 'hipp', 'harvard'], 'Twice the wind': ['windC', 'windL', 'growth'],
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
  { day: 0, t: 'Cover', label: 'Cover', script: ['Welcome. This is a four-day course in GIS for the American Red Cross.', 'Each story is somebody trying to answer one question: where am I?', 'By day four you will use the same ideas to decide where to open a shelter.'] },
  { day: 0, t: 'Course index', label: 'Course index', script: ['Four days.', 'Day one: measure and triangulate. We go from your own thumb to the size of the solar system.', 'Day two: time and precision. Galileo, Rømer and Picard.', 'Day three: from the Earth to a map. Projections, vector and raster, data sources, coordinate systems.', 'Day four: error, then buffers and overlays, then real storms and a real decision.', 'Click any day to jump to it.'] },

  /* ---------------- Day 1 ---------------- */
  { day: 1, ch: 'Opening Quiz', t: 'Mental maps', label: 'Opening Quiz: Your Mental Map', topics: ['47-map-surprises'],
    script: ['Before any history, a test. Four questions. Vote before I show you anything, and do not look it up.', 'Most of us get these wrong, and we get them wrong the same way. We all learned the world from the same flat map.', 'After each reveal, watch the globe. The globe is right. The picture in your head came from a map someone drew.', 'After the Gulf Stream, ask: does one degree of longitude always cover the same distance? At the equator it is about 69 miles. Let the room guess at 60 degrees north before you reveal it: about 35, half. The meridians all meet at the pole. Same degrees, different miles, like two Bingo squares.', 'Hold on to that feeling. The whole course is about how we learned to know where things really are.'] },
  { day: 1, ch: 'The thumb trick', t: 'Baselines', label: 'The thumb trick', h1: 'The thumb trick', topics: ['69-thumb-to-moon-calculating-the-moons-diameter', '77-ladder-sine-cosine-and-tangent'],
    script: ['Stretch your arm out. Make a fist, thumb up. Close one eye and look at the face of your thumb, base to tip.', 'Your arm is about ten thumbs long. So anything that looks one thumb tall is about ten times farther away than it is tall. A six-foot person who is one thumb tall is about sixty feet off.', 'That only works because you knew one real length, the person. The angle alone gives you a ratio, never an answer in feet.', 'Now switch eyes. Your thumb jumps. It did not move. You moved, by the distance between your eyes.', 'That is the other way to use the triangle. Look from two places a known distance apart, measure the angles, and you get the distance without knowing how big anything is. It is how you would measure a warehouse with two tripods.', 'Drag the finger closer and the jump gets bigger. Push it away and the jump shrinks. Distance is hiding in that angle.', 'The gap between your eyes has a name. It is a baseline. Every survey in this course starts with one.', 'Picard, 1669: he chained one line, under seven miles, then used angles to carry it about seventy miles north to Amiens. Why bother? Because the stars said the two ends were one degree of latitude apart. Miles per degree, times 360, is the size of the Earth: about 24,900 miles around. Newton later used Picard\u2019s number to check his law of gravity.'] },
  { day: 1, ch: 'The thumb trick', t: 'Thumb to the Moon', label: 'Thumb to the Moon', topics: ['69-thumb-to-moon-calculating-the-moons-diameter', '93-angle-ladder-pinky-to-gaia'],
    script: ['Press Your Thumb. Hold your arm out, thumb up. Your thumb is about 1 inch wide and about 25 inches from your eye. That is 1 to 25.', 'The rule: anything your thumb just covers is 25 times farther away than it is wide. Distance divided by 25 is the width.', 'Press A Barn, One Mile Off. Your thumb just covers it. One mile is 5,280 feet. Divided by 25: the barn is about 211 feet wide.', 'Press The Moon. Hold your thumb up to the full Moon. The Moon only covers about a quarter of your thumb. A quarter inch at 25 inches is 1 to 100.', 'So the Moon is 100 times farther away than it is wide. It is 238,900 miles away. Divided by 100: about 2,400 miles across. The real figure is 2,159. Your thumb gets within about ten percent.', 'Same triangle every time, just bigger. Surveyors call these similar triangles.'] },
  { day: 1, ch: 'The thumb trick', t: 'The quadrant', label: 'The quadrant', topics: ['74-tycho-brahe-uraniborg-and-stjerneborg', '87-sextant-and-latitude-at-sea', '95-degrees-arcminutes-arcseconds'],
    script: ['A thumb is a rough protractor. This is a real one.', 'A quarter of a circle, a scale along the curve, and a weighted string. Sight along the top edge at a star. Gravity holds the string straight down. Where the string crosses the scale, that is the star\'s height.', 'Tilt it up and watch the two numbers. They always match.', 'Now make it bigger. On a hand quadrant a foot across, one arcminute is about a three-hundredth of an inch. Nobody can read that.', 'Tycho Brahe built one with a radius of more than six feet. One arcminute became about a fiftieth of an inch. He could read it by eye, a generation before the telescope.', 'Bigger instrument, finer angle. Hold that thought until we get to Gaia.', 'Press Hand Quadrant to show a real one: brass, tenth century, two sight vanes on the edge. Press Tycho\u2019s Wall Quadrant for the 1598 engraving: the arc is fixed to a wall, the observer sights through a slit, one assistant reads the clock and another writes.', 'This is all before the sextant. The quadrant needs a steady base and a plumb line, so it is useless on a rolling deck. The octant came in 1731 and the sextant in 1757: they use mirrors to put the star and the horizon in one view, so a sailor can measure at sea.'] },
  { day: 1, ch: 'The size of the Earth', t: 'Eratosthenes', label: 'Eratosthenes', topics: ['18-eratosthenes-measures-the-earth', '19-shadow-stick-and-plumb-lines', '20-why-sun-rays-are-parallel'],
    script: ['Now use the triangle on the Earth itself.', 'About 240 BC. Eratosthenes runs the library at Alexandria. He hears that at Syene, on one day of the year, the noon Sun shines straight down a well.', 'On that same day in Alexandria, a stick casts a shadow. A little over seven degrees.', 'Seven degrees is about one fiftieth of a circle. So the distance between the two towns is one fiftieth of the way round the world.', 'One angle and one paced distance. He was within a few percent.', 'Notice what he needed: a baseline on the ground and an angle in the sky. That is all anyone in this course ever needs.'] },

  { day: 1, ch: 'Latitude and longitude', n: 1, t: 'Latitude &amp; Longitude', label: 'Latitude is the easy one', h1: 'Latitude is the easy one', topics: ['95-degrees-arcminutes-arcseconds', '48-polaris', '47-map-surprises'],
    script: ['To say where you are on a ball you need two numbers. Start with the easy one.', 'The Earth spins, so it has two poles and an equator halfway between. Nature drew those. Nobody had to agree on them.', 'Latitude counts from the equator, zero, to the pole, ninety. North or south.', 'One degree of latitude is 60 arcminutes. Each arcminute on the ground is one nautical mile. That is where the nautical mile comes from. It is about 6,076 feet, a little longer than a land mile.', 'How small is an arcminute? A dime, seen face-on, at about 200 feet. An arcsecond is the same dime, face-on, at about 2.3 miles.'] },
  { day: 1, ch: 'Latitude and longitude', n: 1, cont: true, t: 'Walk north', label: 'The star\'s height is your latitude', topics: ['48-polaris', '87-sextant-and-latitude-at-sea', '49-bowditch'],
    script: ['Here is why latitude is easy to measure.', 'This is the Earth cut in half, with you standing on it. Drag the person north.', 'At the equator the Pole Star sits on the horizon. Walk north and it climbs. At the pole it is straight overhead.', 'The height of the star above your horizon is your latitude. In Toronto, about 44 degrees north. In Washington, about 39. In Miami, about 26.', 'A sailor with a quadrant can do this any clear night. That is why latitude was known for two thousand years.'] },
  { day: 1, ch: 'Latitude and longitude', n: 2, t: 'Two ships, one latitude', label: 'Longitude has no landmarks', topics: ['70-time-to-longitude', '49-bowditch'],
    script: ['Latitude is easy because the sky gives you a fixed mark. Polaris sits right above the North Pole. It does not move while the Earth turns underneath it.', 'So how high Polaris stands tells you how far north you are. Fifty degrees up, you are at fifty degrees north. Any night, any hour, the answer is the same.', 'Now look at the two ships. Both are on the gold line, fifty degrees north. Both captains look up and see Polaris fifty degrees high. The same reading, the same answer.', 'Slide the second ship east. Hundreds of miles. Polaris still reads fifty degrees for both of them. The star cannot tell them apart.', 'Watch the Earth turn. Everything else in the sky, the Sun, the Moon, the other stars, swings past both ships. It rises, crosses, and sets for each of them at a different time.', 'That is the key. East and west are not written in the sky. They are written in time. The difference in longitude between two ships is the difference in the time the Sun crosses over each of them.', 'So latitude needs a star and an angle. Longitude needs a clock. That is the whole longitude problem in one picture.'] },
  { day: 1, ch: 'Latitude and longitude', n: 3, t: 'Scilly, 1707', label: 'The cost of not knowing: Scilly, 1707', topics: ['84-harrison-and-the-marine-chronometer', '70-time-to-longitude'],
    script: ['This is what not knowing costs.', 'October 1707. A Royal Navy fleet is coming home from Gibraltar under Admiral Sir Clowdesley Shovell. Days of fog and gales. No sight of the Sun.', 'The officers compare their reckoning and agree. They are safely in the mouth of the English Channel.', 'They are not. Their reckoning is wrong, and the rocks of the Isles of Scilly are dead ahead, at night.', 'Four ships go down. About two thousand sailors die. Some counts put it nearer fourteen hundred.', 'It was not bad seamanship. They knew their latitude roughly. Their longitude was a guess, carried forward for weeks.'] },
  { day: 1, ch: 'Latitude and longitude', n: 4, t: 'The Longitude Act, 1714', label: 'The Longitude Act, 1714', topics: ['84-harrison-and-the-marine-chronometer'],
    script: ['Seven years after Scilly, Parliament acts. The Longitude Act of 1714.', 'It does not care how you do it. A clock, the Moon, Jupiter, anything. It only cares how close you get.', 'The test is a voyage from Britain to the West Indies. When the ship arrives, how far off is your longitude?', 'Within one degree, about sixty miles: ten thousand pounds. Within two thirds of a degree, about forty miles: fifteen thousand. Within half a degree, about thirty miles: twenty thousand pounds. A fortune.', 'Slide the error and watch the ship move out through the rings.', 'Remember the clock on the Earth: one degree of longitude is four minutes of time. So the top prize meant knowing Greenwich time to within two minutes, after six weeks on a rolling ship.', 'In 1714 nobody on Earth could do that. Not with a clock: the best pendulum clocks lost minutes a day on a rolling ship. And not with the Moon: one lunar reading took three careful sightings from a moving deck, then an hour or more of hand arithmetic and table lookups, and a single slip anywhere put you a degree or more off. We will see that on the next two slides.'] },
  { day: 1, ch: 'Latitude and longitude', n: 5, t: 'Hours are slices', label: 'The Earth Is a 24-Hour Clock', h1: 'The Earth Is a 24-Hour Clock', topics: ['70-time-to-longitude', '95-degrees-arcminutes-arcseconds'],
    script: ['Here is the rule that turns time into place.', 'Look down on the North Pole again. Cut the Earth like a clock face into 24 slices. One slice for each hour.', 'A full turn is 360 degrees. A day is 24 hours. Divide, and each hour is 15 degrees.', 'Greenwich is zero. If your local noon comes two hours after Greenwich noon, you are two slices west. Thirty degrees.', 'Zoom into one slice. One degree is four minutes of time. One arcminute is four seconds.', 'So a clock that is four seconds wrong puts you one nautical mile out at the equator. That is how good the clock has to be.', 'So here is the whole problem in one line. Anyone, anywhere, can find their own noon: the moment the Sun stands highest. That part was always easy.', 'The hard part is this: at the moment of your noon, what time is it back home, at a fixed place like Greenwich or Paris? The difference between the two times is your longitude.', 'So the race was to carry home time out to sea. There were three ways. One: read it off the Moon. Two: read it off Jupiter\u2019s moon Io. Three: carry it in a clock.'] },
  { day: 1, ch: 'Latitude and longitude', n: 5, cont: true, t: 'Longitude bingo', label: 'Longitude bingo', topics: ['70-time-to-longitude'],
    script: ['Now that there is a grid on the screen, let us play bingo. Robert, you are calling.', 'Robert calls a square. N, forty-five north. Everybody finds it at once.', 'Why does that work? Because the squares are already labeled, and because somebody can call them.', 'Now take the card to sea. The rows still have labels. Any sailor can read his latitude off the Pole Star.', 'But the column letters are gone. Robert can only say: you are somewhere on this row.', 'The ocean has no printed squares until you can measure time. That is the whole problem, on one bingo card.'] },
  { day: 1, ch: 'Latitude and longitude', n: 5, cont: true, t: 'Three ways', label: 'Noon Is Easy. Home Time Is the Problem.', topics: ['70-time-to-longitude', '84-harrison-and-the-marine-chronometer'],
    script: ['Let me put the whole longitude problem on one screen. Press Next point as we go.', 'Every place on Earth has its own noon, the moment the Sun stands highest there.', 'Your own noon is easy. Watch the Sun with a simple instrument and you have it, anywhere, any day.', 'But at that moment, what time is it back home, at Greenwich or Paris? Nobody on the ship can see that.', 'The gap between the two clocks is your longitude. Two hours apart is thirty degrees.', 'So everything comes down to one question: how do you carry home time out to sea? Three ways were tried.', 'Way one, the Moon. Possible, but an hour of arithmetic for every sighting, and easy to get wrong.', 'Way two, Jupiter\u2019s moon Io. Perfect on land. Hopeless on a rolling deck.', 'Way three, the chronometer. A clock good enough to carry home time across an ocean. That is the one that won.', 'Tap any card to go straight to that way.'] },
  { day: 1, ch: 'Latitude and longitude', n: 6, t: 'The lunar distance', h1: 'Way 1: Read Home Time off the Moon', label: 'Way 1: The Moon', topics: ['49-bowditch', '87-sextant-and-latitude-at-sea'],
    script: ['Way one: read home time off the Moon.', 'The Moon slides past the stars about half a degree every hour. Measure the angle from the Moon to a star, look it up in a table, and you have Greenwich time.', 'In a quiet observatory it works.', 'Now roll the deck. You are holding a sextant on a moving ship, trying to touch the Moon to a star.', 'Then the arithmetic. Press the button and count the steps. Clear the angle for the bending of light in air. Clear it again because you are standing on the surface, not at the center of the Earth. Look up the almanac table, which only gives the Moon every three hours, and work out the time between the entries. Then turn time into degrees.', 'On a real ship this took an hour or more, by hand, by candlelight, on a moving deck. The Moon only moves about half a degree an hour against the stars, so an error of one arcminute in the sighting becomes about half a degree of longitude, thirty miles. One slip anywhere and the answer is wrong, and you will not know it.', 'It was a method for experts on a good night. The navy needed one for every officer on every night.'] },
  { day: 1, ch: 'Latitude and longitude', n: 7, t: 'Galileo\u2019s clock', h1: 'Way 2: Jupiter\u2019s Moon Io', label: 'Way 2: Jupiter\u2019s Moon Io', topics: ['64-galileo-jupiters-moons', '79-cassini-paris-and-jupiter', '70-time-to-longitude'],
    script: ['Way two: Jupiter. A quick introduction first. In 1610 Galileo pointed one of the first telescopes at Jupiter and found it has moons. Four of them. The closest one is called Io.', 'Io goes round Jupiter every 42 and a half hours, like clockwork. Every time round, it slips into Jupiter\u2019s shadow and vanishes.', 'Here is the clever part. When Io vanishes, it vanishes for everyone on Earth at the same instant. So astronomers in Paris printed a table: the time of every vanishing, by Paris clocks.', 'Press Watch Io vanish. At that instant the Paris table says 9 o\u2019clock. You look at your own clock, set by your own noon, and it says 7 o\u2019clock.', 'Two hours behind Paris. Remember the 24-hour clock: every hour is 15 degrees. Two hours is 30 degrees. You are 30 degrees west of Paris.', 'Slide how far west you are and watch the two clocks pull apart.', 'On land this worked beautifully. It is how France was mapped. Now press Now try it from a ship. You cannot hold a long telescope steady on a dot that small on a rolling deck. The sky had a clock. Sailors could not read it.'] },
  { day: 1, ch: 'Latitude and longitude', n: 8, t: 'Pendulum at sea', h1: 'Way 3: Carry Home Time in a Clock', label: 'Way 3: Carry Home Time in a Clock', topics: ['84-harrison-and-the-marine-chronometer'],
    script: ['Way three: just carry home time in a clock. Set it to Greenwich before you leave.', 'The best clocks of the day kept time with a swinging pendulum. On land they were good to a few seconds a day.', 'Now put one on a ship. Raise the sea state.', 'The ship rolls, and the roll throws the swing off. The clock runs fast, then slow. The error piles up.', 'A few minutes of error is hundreds of miles. A pendulum needs a still room, and a ship is never still.'] },
  { day: 1, ch: 'Latitude and longitude', n: 9, t: 'A clock that could travel', h1: 'Way 3: A Clock That Can Travel', label: 'Way 3: A Clock That Can Travel', topics: ['84-harrison-and-the-marine-chronometer', '53-captain-james-cook'],
    script: ['So the longitude problem has become something very plain. Build a clock that can travel.', 'No pendulum. Not bothered by the roll, the heat, the cold or the damp. Good to three seconds a day for six weeks.', 'The man who takes the job is not an astronomer. John Harrison is a carpenter from Yorkshire.', 'He builds four machines over 24 years. The first weighs 75 pounds. The last is a watch you can hold in two hands.', 'On its first sea trial, to Jamaica in 1761, that watch lost about five seconds in 81 days.', 'We pick Harrison up again on day two, when his clock goes round the world with Captain Cook.'] },

  { day: 1, ch: 'Halley and the transits', t: 'Kepler to Halley', label: 'Kepler, Horrocks and Halley', topics: ['66-kepler-mars-triangulation-and-scale', '55-venus-transits-1761-1769'],
    script: ['Back to triangles, and the biggest one yet.', 'Kepler worked out the shape of the solar system. His tables gave every planet\'s distance from the Sun, but only as a ratio. A map with no scale bar.', 'A young Englishman, Jeremiah Horrocks, corrected Kepler\'s tables and predicted that Venus would cross the face of the Sun in 1639. He was right, and he was one of two people on Earth who watched it.', 'Edmond Halley saw what that was good for. Venus against the Sun is the thumb trick. Two observers far apart on Earth see Venus cross at slightly different places.', 'Measure that shift and you get one real distance. One real distance puts a scale bar on the whole solar system.', 'Halley knew he would be dead before the next transits, in 1761 and 1769. He wrote the instructions anyway.'] },
  { day: 1, ch: 'Halley and the transits', t: 'Transit of Venus', label: 'The transits of Venus', topics: ['55-venus-transits-1761-1769', '53-captain-james-cook', '52-venus-transit-to-cepheid-distances'],
    script: ['1761 and 1769. The first worldwide science project.', 'Observers go to Siberia, to Hudson Bay, to the Cape, to Baja California. Captain Cook sails to Tahiti.', 'Each one times Venus crossing the Sun. The farther apart the observers, the longer the baseline, and the bigger the shift.', 'Put the timings together and the Sun comes out at about 93 million miles.', 'It is your thumb at arm\'s length. The two eyes are two islands, half a world apart.'] },
  { day: 1, ch: 'Halley and the transits', t: 'Vector and raster, a first look', label: 'A first look at vector and raster', topics: [],
    script: ['One last idea before we stop for the day.', 'Everything we measured today was a point. A well. A star. A ship. An island. Join points and you get lines. Close a line and you get an area.', 'That is one way to record the world. It is called vector.', 'There is a second way. Lay a grid over the ground and write one value in every cell. That is called raster. A photograph is a raster.', 'Slide the cell size. Big cells, rough picture, small file. Small cells, true picture, big file.', 'Every GIS dataset you ever open is one of these two. We come back to both on day three.'] },

  /* ---------------- Day 2 ---------------- */
  { day: 2, ch: 'Galileo', t: 'Jupiter\'s moons', label: 'Galileo\'s moons', topics: ['64-galileo-jupiters-moons', '46-galileo'],
    script: ['Day two is about time and precision. We start in January 1610.', 'Galileo turns a telescope on Jupiter and sees three small stars in a line. The next night they have moved. Soon there are four.', 'Step through the nights and keep his notebook. They are not stars. They are moons, going round Jupiter.', 'Before you see the answer, make a guess: which moon goes round fastest?', 'Each moon keeps strict time. That makes Jupiter a clock that anyone on Earth can read. Yesterday we saw why that matters.'] },
  { day: 2, ch: 'Galileo', t: 'Moon mountains', label: 'Mountains on the Moon', topics: ['86-galileo-moon-mountains', '69-thumb-to-moon-calculating-the-moons-diameter'],
    script: ['The same winter Galileo looks at the Moon.', 'Along the line between light and dark he sees bright points out in the dark side. Mountain tops, catching the sunrise before the ground below them.', 'He measures how far a peak sits from the line. That is one side of a right triangle. The Moon\'s radius is another.', 'Out comes the height of a mountain on another world, about four miles. From a garden in Padua.', 'It is the thumb trick again. An angle, a known length, and a triangle.'] },
  { day: 2, ch: 'Rømer', t: 'Jupiter as a measuring stick', label: 'Jupiter\'s moons as a measuring stick', topics: ['96-jupiters-moons-as-a-measuring-stick', '79-cassini-paris-and-jupiter'],
    script: ['Now use Jupiter\'s moons as a ruler.', 'Callisto swings out a fixed distance from Jupiter, about 1.17 million miles. That is a ruler of known length, hanging in the sky.', 'When the Earth is on the near side of its orbit, that ruler looks about ten arcminutes long. On the far side, about seven.', 'Angle is length divided by distance. The ruler did not shrink. We moved away.', 'Ten to seven. That ratio is the size of the Earth\'s own orbit, read off Jupiter. It gives ratios, not miles. The miles came from Mars in 1672 and from Venus.'] },
  { day: 2, ch: 'Rømer', t: 'Light needs time', label: 'Rømer: light needs time', topics: ['65-romer-io-speed-of-light', '96-jupiters-moons-as-a-measuring-stick'],
    script: ['Paris, 1676. Ole Rømer is timing the eclipses of Io against the printed table.', 'Io goes round in about 42 and a half hours. It should be the best clock in the sky.', 'But when the Earth is moving away from Jupiter, the eclipses come late. When the Earth is coming back, they come early.', 'Move the Earth round. On the far side the news is more than sixteen minutes behind.', 'Rømer\'s answer: Io is on time. The light is late. It has farther to travel.', 'Rømer put the delay at 22 minutes across the orbit. The modern figure is 16 minutes 40 seconds. He never quoted a speed. Huygens did that. But the idea was his: light needs time.'] },
  { day: 2, ch: 'Picard', t: 'Picard measures France', label: 'Picard measures France', topics: ['73-picard-triangulation-1669', '88-picard-baseline-rods', '82-geodetic-networks'],
    script: ['Now bring that precision down to the ground.', 'Eratosthenes paced his baseline. In 1669 Jean Picard measures his with wooden rods, laid end to end along the road from Villejuif to Juvisy. About seven miles.', 'Then he stops measuring distances. From each end he sights a church tower and measures the angle. One side and two angles fix the triangle.', 'The far side of that triangle becomes the baseline of the next one. Castle to church to church, all the way north.', 'Thirteen triangles, one measured length. He gets one degree of latitude: 57,060 toises. About 69 miles.', 'When the same method was run across France, the country turned out smaller than the old maps showed. The king said his astronomers had cost him more land than his enemies.'] },
  { day: 2, ch: 'Picard', t: 'Picard and the meter', label: 'Picard and the meter', topics: ['83-the-meter-from-a-meridian', '73-picard-triangulation-1669'],
    script: ['Picard\'s degree led somewhere he never saw.', 'If you know the length of one degree, you know the whole arc from the equator to the pole. Ninety of them.', 'In 1791 France defined a new unit from that arc. One ten-millionth of the distance from pole to equator. The meter.', 'Two surveyors, Delambre and Méchain, re-measured the line from Dunkirk to Barcelona to pin it down. It took nearly seven years.', 'So the meter in your pocket is a piece of the Earth, and it was measured with triangles.'] },
  { day: 2, ch: 'The clock goes to sea', t: 'Cook', label: 'Harrison\'s clock sails with Cook', topics: ['53-captain-james-cook', '84-harrison-and-the-marine-chronometer', '54-joseph-banks-botanist'],
    script: ['Yesterday we left John Harrison with a watch that worked.', 'Its copy, called K1, sails with Captain Cook on his second voyage. Three years, into the Antarctic and across the Pacific.', 'Run the experiment. Set how many seconds a day the clock drifts and how many days you have been at sea. Watch the error in miles.', 'K1 held to a few seconds a day. Cook called it his trusty friend the watch, and his charts were good enough to be used for a century.', 'That is the longitude problem, solved. A clock that could travel.'] },
  { day: 2, ch: 'The clock goes to sea', t: 'Mason &amp; Dixon', label: 'Mason and Dixon', topics: ['58-mason-dixon-survey', '56-charles-mason', '57-jeremiah-dixon', '89-mason-dixon-and-picard'],
    script: ['One more job for the same tools.', 'Charles Mason and Jeremiah Dixon timed the 1761 transit of Venus from the Cape. Two years later they were in America with the best instruments in the world, hired to settle a border.', 'They ran a line of latitude west from near Philadelphia for 233 miles, checking against the stars every few miles.', 'Try the exercise. A small error in the angle, carried for a few miles, puts the line in the wrong county.', 'Their line was good to a few hundred feet. It is still the border.'] },

  /* ---------------- Day 3 ---------------- */
  { day: 3, ch: 'Projections', t: 'Flat maps lie', label: 'Map projections', topics: ['47-map-surprises'],
    script: ['Day three. Remember the opening quiz on day one? Here is why your mental map was wrong. On day one we also peeled an orange. Now the full story.', 'Unwrap the globe into Mercator. Every compass course is a straight line, which is why sailors loved it. The price is size. Greenland looks as big as Africa.', 'Drag Greenland down onto Africa. Africa is fourteen times larger.', 'Switch to an equal-area map. Sizes are honest now, and the shapes are squashed.', 'Then draw a route. On Mercator the straight line is not the shortest way. The shortest way bends toward the pole.', 'There is no right projection. There is the right one for the job. Know which one you are looking at.'] },
  { day: 3, ch: 'Recording the world', t: 'Vector and raster', label: 'Vector and raster', topics: [],
    script: ['On day one we met the two ways to record the world. Now choose between them.', 'Things with edges suit vector. A shelter is a point. A road is a line. A county is an area. You store the corners, and you can zoom forever.', 'Switch to a surface with no edge. Elevation. Rainfall. Wind speed. There is nothing to trace, so you store a value in every cell. That is raster.', 'Vector asks: where is the boundary? Raster asks: what is in each square?', 'In a disaster you will use both. The flood depth is a raster. The houses are vector. The work is putting one on top of the other.'] },
  { day: 3, ch: 'Recording the world', t: 'Where the data comes from', label: 'Data sources', topics: ['82-geodetic-networks'],
    script: ['Where does the data come from? Three places, mostly.', 'Satellites. A sensor records how bright each square of ground was. It sees everything and names nothing. That is raster.', 'Surveys. Somebody measures chosen things exactly. This is Picard\'s method with better instruments. That is vector.', 'The census. Somebody counts people and writes the total against an area. That is vector with a table attached.', 'Each one answers a different question. Before you trust a layer, ask which of the three made it, and when.'] },
  { day: 3, ch: 'Recording the world', t: 'Gaia', label: 'Gaia: a survey of the sky', topics: ['94-gaia-esa-map-of-the-galaxy', '93-angle-ladder-pinky-to-gaia', '63-hipparchus-lunar-parallax'],
    script: ['Here is a survey at the far end of the scale.', 'Gaia was a European satellite. Its baseline was the Earth\'s orbit, 186 million miles. Its target was nearly two billion stars.', 'It is the thumb trick. Look in January, look again in July, measure the jump.', 'Compare the instruments. Bessel in 1838 could reach about 16 light-years. Gaia reaches about sixteen thousand.', 'Same triangle as your thumb. A better angle is the only thing that changed.'] },
  { day: 3, ch: 'Coordinate systems', t: 'Coordinate reference systems', label: 'Coordinate reference systems', topics: ['82-geodetic-networks', '95-degrees-arcminutes-arcseconds'],
    script: ['The last piece of day three. A pair of numbers is not a place until you say which system they belong to.', 'Here is one shelter in Tampa. In latitude and longitude it is 27.95 north, 82.46 west. Degrees. Angles on the globe.', 'Switch to UTM. The same shelter is now two numbers in meters, on a flat sheet. Good for measuring distance.', 'Switch to State Plane. Feet, on a grid tuned to one strip of Florida. This is what the county uses.', 'Three sets of numbers, one building. Now read the numbers in the wrong system. The shelter moves.', 'When layers do not line up, this is almost always why. Ask which coordinate system before you ask anything else.'] },

  /* ---------------- Day 4 ---------------- */
  { day: 4, ch: 'Error', t: 'Error propagation', label: 'Error propagation', topics: ['84-harrison-and-the-marine-chronometer'],
    script: ['Day four. Before the tools, the warning that comes with them.', 'Go back to the fleet off Scilly. Each day the navigator writes down a heading and a speed. Each one is a little bit wrong.', 'Here are 160 ships that all steer the same course with the same care. Add days. Watch the cloud grow.', 'Nobody made a mistake. Each small error rode on top of the one before.', 'Every dataset you open has a chain like this behind it. A survey built on a survey. A model built on a count. The honest question is not whether there is error. It is how big the cloud is by now.'] },
  { day: 4, ch: 'Spatial operations', t: 'Buffers', label: 'Buffers', topics: [],
    script: ['Now the modern toolkit. Two operations do most of the work in disaster GIS. The first is the buffer.', 'A buffer answers one question: what is within this distance?', 'Round a point. Who can walk to the shelter in three quarters of a mile?', 'Along a line. Who is within half a mile of the river?', 'Round an area. Who do we warn about the plant?', 'Slide the distance and count. A buffer turns the word "near" into a shape you can count inside.'] },
  { day: 4, ch: 'Spatial operations', t: 'Overlays', label: 'Overlays', topics: [],
    script: ['The second operation is the overlay. Two maps in, one answer out.', 'Layer one is the census. Blocks, with a count of people in each. Layer two is the flood.', 'Neither map tells you how many people are in the water. Lay one on the other and cut.', 'Raise the river and watch the number climb.', 'Look at what the tool did with a block that is half wet. It took half the people. That assumes people are spread evenly across the block. They are not.', 'So the answer says "about." Remember day four\'s first slide. The overlay carries the error of both layers.'] },
  { day: 4, ch: 'Applications', t: 'The storm wire', label: 'The storm wire', topics: ['07-telegraph-storm-warnings', '08-benito-vines', '09-galveston-1900', '10-havana-key-west-cable'],
    script: ['Now put it all to work. Three stories from the Gulf.', 'A storm moves at ten or fifteen miles an hour. A telegraph message moves at the speed of the wire. For the first time, a warning can outrun the weather.', 'In Havana, Father Benito Viñes learns to read a hurricane from pressure, wind and cloud, and wires his forecasts ahead.', 'Galveston, 1900. The data existed. The warning did not get through in a form people acted on. Between six and twelve thousand people died.', 'A measurement only helps if it reaches the person who has to decide.'] },
  { day: 4, ch: 'Applications', t: 'Twice the wind', label: 'Twice the wind', topics: ['71-hurricane-wind-force-square-not-exponential', '37-typhoon-scales-vs-saffir-simpson', '75-six-ways-numbers-grow'],
    script: ['A question first. If the wind doubles, how much harder does it push on a wall?', 'Vote, then slide the wind speed.', 'The force goes up as the square. Twice the wind, four times the push.', 'That is why one category on the scale is not one step of damage. And it is why the number on the map matters so much.'] },
  { day: 4, ch: 'Applications', t: 'The shelter decision', label: 'The shelter decision', topics: ['27-hurricane-typhoon-cyclone', '37-typhoon-scales-vs-saffir-simpson'],
    script: ['The last slide of the course is a decision.', 'A storm is coming to Houston. You have three buildings that could be shelters.', 'Work through it in order. Where is the hazard? That is a raster, with a fuzzy edge. Where are the people? That is the census, by block. How far is each shelter? That is a buffer. Who is inside the danger? That is an overlay.', 'And at every step, how sure are we? That is day four\'s first slide.', 'Everything in these four days was one question: where am I, and how sure am I? You now have the tools to answer it for somebody else.'] }
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
(function () {
  const deck = document.getElementById('deck');
  const find = t => [...deck.querySelectorAll('.slide')].find(s => s.dataset.title === t || s.getAttribute('data-title') === t.replace(/&amp;/g, '&'));
  document.querySelectorAll('.slide').forEach(s => s.dataset.fx = 'fade');

  /* ---- course index slide ---- */
  const firstOf = d => COURSE.find(c => c.day === d);
  const idx = document.createElement('section'); idx.className = 'slide native wide'; idx.dataset.title = 'Course index'; idx.dataset.fx = 'fade';
  idx.innerHTML = `<div class="stage"><div class="cindex"><p class="kicker">American Red Cross · Disaster GIS</p><h1>Four Days, One Question: Where Am I?</h1><div class="ci-days">${[1, 2, 3, 4].map(d => `<button class="ci-day" data-first="${firstOf(d).t}"><span class="ci-n"><small>Day</small> ${d}</span><span class="ci-dot"></span><strong>${titleCase(DAYS[d].name)}</strong></button>`).join('')}</div></div></div>`;
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
  const cov = find('Cover'); if (cov) { const q = s => cov.querySelector(s); if (q('.kicker')) q('.kicker').textContent = 'American Red Cross · a four-day GIS course'; if (q('.sub')) q('.sub').textContent = 'Measurement, mapping and disaster decisions'; if (q('.vlink')) q('.vlink').remove(); }

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
  setInterval(() => { document.querySelectorAll('.slide.active h1, .slide.active .kicker').forEach(h => { const t = titleCase(h.textContent); if (t !== h.textContent) h.textContent = t; }); }, 400);
  // detours: leave the story for a side trip (e.g. Galileo) and come straight back
  // "Want to Know More?" button: opens the lesson PDFs for this slide
  const more = document.createElement('button'); more.id = 'more-btn'; more.hidden = true; more.innerHTML = '\u{1F4C4} Want to Know More?'; visual.appendChild(more);
  const phone = matchMedia('(max-width:860px)'); const placeMore = () => { if (phone.matches && nav) { nav.insertBefore(more, nav.lastElementChild); more.classList.add('in-nav'); } else { visual.appendChild(more); more.classList.remove('in-nav'); } }; placeMore(); phone.addEventListener('change', placeMore);
  const mp = document.createElement('div'); mp.id = 'more-panel'; mp.hidden = true; visual.appendChild(mp);
  const pdfsFor = c => (SLIDE_PDFS[c.t] || []).map(k => PDFS[k]).filter(Boolean);
  more.onclick = () => { const c = live.find(c => c.el.classList.contains('active')); const ps = c ? pdfsFor(c) : []; mp.innerHTML = `<header><h3>Want to Know More?</h3><button class="x" aria-label="Close">×</button></header><p>The full lesson behind this slide, as a PDF.</p>` + ps.map(([f, n, sz]) => `<div class="pdf"><span>${n}${sz ? ` <small>${sz}</small>` : ''}</span><a href="${PDF_DIR}${f}" target="_blank" rel="noopener">Open</a><a href="${PDF_DIR}${f}" download>Download</a></div>`).join(''); mp.hidden = false; mp.querySelector('.x').onclick = () => { mp.hidden = true; }; };
  const syncMore = () => { const c = live.find(c => c.el.classList.contains('active')); more.hidden = !(c && pdfsFor(c).length); mp.hidden = true; };
  new MutationObserver(syncMore).observe(deck, { attributes: true, attributeFilter: ['class'], subtree: true });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !mp.hidden) mp.hidden = true; });
  const back = document.createElement('button'); back.id = 'detour-back'; back.hidden = true; visual.appendChild(back); let detourFrom = null;
  document.addEventListener('click', e => { const b = e.target.closest('.detour'); if (!b) return; const from = live.findIndex(c => c.el.classList.contains('active')), to = live.findIndex(c => c.t === b.dataset.detour); if (to < 0) return; detourFrom = from; back.textContent = '\u2190 Back to ' + (b.dataset.label || live[from].label); back.hidden = false; jump(to); });
  back.onclick = () => { if (detourFrom !== null) jump(detourFrom); detourFrom = null; back.hidden = true; };
  new MutationObserver(sync).observe(deck, { attributes: true, attributeFilter: ['class'], subtree: true });
  addEventListener('load', () => { for (const def of Object.values(NEW_SLIDES)) { try { def.init(def._el); } catch (e) { console.error('course slide failed', def.h1, e); } } sync(); relayout(); });
  // occasional fun: the warp (stars rush outward, slide racks into focus) plays only
  // from the cover into the course index, and when moving forward into a new day
  window.FX_PICK = (prev, target) => { if (target <= prev) return null; const i = live.findIndex(c => c.el === document.querySelectorAll('.slide')[target]); if (i < 1) return null; return live[i].day !== live[i - 1].day || live[i - 1].t === 'Cover' ? 'warp' : null; };
  window.COURSE_LIVE = live;
})();
