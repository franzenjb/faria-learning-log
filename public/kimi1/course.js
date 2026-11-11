/* Four-day Red Cross GIS course for /kimi1/.
   Native slides only. Existing interactive models stay in the deck.
   Three current handouts were not in this workspace and are not on the site,
   so they are not copied page for page: the 22-page thumb/Halley PDF,
   the 12-page quadrant PDF, and the 6-page vector/raster PDF.
   The Picard 1669 plate is not embedded. */
(function(){
const svg=inner=>`<svg viewBox="0 0 640 400" role="img">${inner}</svg>`;
const T={
 cream:'#f4efe3', ink:'#ece6da', gold:'#f0b35a', green:'#6fd48a', blue:'#6fb3ff', red:'#ff7d6f', mute:'#9a9382'
};
window.KIMI_NOTES={};
window.KIMI_TOPICS={};

const META={
'Cover':{day:'Opening',chapter:'Opening',routes:'essential sample',kicker:'Red Cross GIS · four days',
 topics:[['47-map-surprises','Map surprises']],
 notes:['Where am I? Four days, not one sitting.','Day 1 measures. Day 2 keeps time. Day 3 turns the Earth into a map. Day 4 asks what the map is allowed to decide.','The script is on this side. The picture stays on the other. They do not swap.']},
'Title':{day:'Opening',chapter:'Opening',kicker:'Opening · the working models',
 notes:['This slide is the shelf of working models. The course index is the slide before it.','Every model still runs. New course slides sit beside them.','Dotted words still open an explanation. Arrows, F, and P still work.']},
'One ladder':{day:'Day 1',chapter:'The thumb',routes:'essential sample'},
'Why thirty degrees':{day:'Day 1',chapter:'The thumb',routes:'sample'},
'Baselines':{day:'Day 1',chapter:'The thumb',routes:'essential sample',kicker:'Day 1 · The thumb · your eyes are the first baseline',
 topics:[['69-thumb-to-moon-calculating-the-moons-diameter','Thumb to Moon'],['93-angle-ladder-pinky-to-gaia','The angle ladder'],['88-picard-baseline-rods','Picard’s rods']],
 notes:['Blink. The finger jumps and the far wall does not. Your eyes are a baseline about two and a half inches long.','Everything after this is the same triangle with a longer baseline.','One degree of shift is about 57 baselines. Small angles want a long base.','The 22-page thumb, Horrocks, and Halley handout is not on this site. This model is the thumb. Kepler and the transit slides carry the rest of that story.']},
'Two eclipse reports':{day:'Day 1',chapter:'The thumb'},
'Assumptions beside the number':{day:'Day 1',chapter:'The thumb'},
'Far sunlight':{day:'Day 1',chapter:'The Earth',routes:'sample'},
'Eratosthenes':{day:'Day 1',chapter:'The Earth',routes:'essential sample',kicker:'Day 1 · The Earth · a well and a stick',
 topics:[['18-eratosthenes-measures-the-earth','Eratosthenes'],['19-shadow-stick-and-plumb-lines','The shadow stick'],['20-why-sun-rays-are-parallel','Why the rays count as parallel']],
 notes:['Same day, same moment. Syene: no shadow. Alexandria: 7.2 degrees, one fiftieth of a circle.','The rays are parallel because the Sun is about 150 million kilometres away. Euclid makes the shadow angle equal the angle at the centre.','Fifty times the paced distance is the whole way around. The stadion is the weak link, not the method.']},
'Maps must bend':{day:'Day 1',chapter:'Projections, a first look',routes:'essential sample gis',
 topics:[['47-map-surprises','Map surprises']],
 notes:['Thin on purpose. Three right angles and you are home. On flat paper that walk does not close.','Every flat map must stretch or bend something. Do not open the Greenland answer here. That question waits for Day 3.','Say the idea. The full choice of projection is a Day 3 return.']},
'Latitude = star height':{day:'Day 1',chapter:'Longitude',routes:'essential sample',kicker:'Day 1 · Longitude · 1 · Latitude is the easy one',h1:'Latitude is the easy one',
 topics:[['48-polaris','Polaris'],['45-looking-up-polaris-planets-ptolemy-copernicus','Looking up'],['87-sextant-and-latitude-at-sea','The sextant']],
 notes:['Latitude is the easy one. The equator and the poles are already there, north and south.','Drag the person. Polaris climbs by the same angle as the latitude. The proof is on the globe, not in a formula first.','Polaris is a guide, not the pole. The exact match is the north celestial pole. Polaris sits about 0.6 to 0.7 degrees off it.','One degree of latitude is 60 arcminutes, and each arcminute is one nautical mile. The modern mile is fixed at 1,852 metres. A dime, face-on, is about one arcminute at 200 feet.']},
'Longitude has no landmarks':{day:'Day 1',chapter:'Longitude',routes:'sample'},
'The Isles of Scilly':{day:'Day 1',chapter:'Longitude',routes:'essential sample'},
'The Longitude Act':{day:'Day 1',chapter:'Longitude'},
'Longitude is time':{day:'Day 1',chapter:'Longitude',routes:'essential'},
'Lunar distances':{day:'Day 1',chapter:'Longitude'},
'A clock in the sky':{day:'Day 1',chapter:'Longitude'},
'Hours are slices':{day:'Day 1',chapter:'Longitude',routes:'essential',kicker:'Day 1 · Longitude · 8 · Earth is a 24-hour clock',
 topics:[['70-time-to-longitude','Time to longitude'],['95-degrees-arcminutes-arcseconds','Degrees, arcminutes, arcseconds']],
 notes:['Look down on the North Pole. Greenwich is the thick line, zero degrees.','The Earth is cut into 24 slices. A full turn is 360 degrees and a day is 24 hours, so each hour is 15 degrees.','Teach this picture before the arithmetic. One hour of time difference is 15 degrees of longitude.','The grid is on the screen now. The bingo joke is the next slide.']},
'Longitude bingo':{day:'Day 1',chapter:'Longitude'},
'A pendulum cannot go to sea':{day:'Day 1',chapter:'Longitude'},
"Harrison's job":{day:'Day 1',chapter:'Longitude'},
'An arcminute and a dime':{day:'Day 1',chapter:'Longitude',
 topics:[['95-degrees-arcminutes-arcseconds','Degrees, arcminutes, arcseconds'],['93-angle-ladder-pinky-to-gaia','The angle ladder']]},
'Polaris is not the pole':{day:'Day 1',chapter:'Longitude',topics:[['48-polaris','Polaris']]},
'An uncorrected star':{day:'Day 1',chapter:'Longitude',topics:[['48-polaris','Polaris'],['50-sidereal-day','The sidereal day']]},
'Correct the star':{day:'Day 1',chapter:'Longitude',topics:[['49-bowditch','Bowditch']]},
'Phone and night sky':{day:'Day 1',chapter:'Longitude',topics:[['48-polaris','Polaris'],['87-sextant-and-latitude-at-sea','The sextant']]},
'Local down':{day:'Day 1',chapter:'Longitude',topics:[['19-shadow-stick-and-plumb-lines','The shadow stick']]},
'A quadrant reads a height':{day:'Day 1',chapter:'Longitude',topics:[['87-sextant-and-latitude-at-sea','The sextant'],['74-tycho-brahe-uraniborg-and-stjerneborg','Tycho’s quadrant']]},
'Latitude & Longitude':{day:'Day 1',chapter:'Longitude',routes:'essential',kicker:'Day 1 · The grid you can stand on',
 topics:[['48-polaris','Polaris'],['87-sextant-and-latitude-at-sea','The sextant'],['70-time-to-longitude','Time to longitude']],
 notes:['The lines start off. Turn them on when you want the grid.','Stand somewhere. The angle at your feet is the angle at the centre.','Chronometer mode is the same 15 degrees per hour, now with a ship.','One minute of latitude is one nautical mile, fixed at 1,852 metres.']},
'Kepler to Halley':{day:'Day 1',chapter:'Halley',routes:'essential',kicker:'Day 1 · Halley · a map with no scale bar',
 topics:[['66-kepler-mars-triangulation-and-scale','Kepler’s Mars triangles'],['55-venus-transits-1761-1769','The Venus transits']],
 notes:['Kepler’s third law gives every distance as a multiple of Earth’s. A perfect map, and no miles on it.','Horrocks, 1639, between services. Halley writes the plan in 1716 for people not yet born.','The star-day mode is on this slide: one turn against the stars is about 23 hours 56 minutes. The Sun-day is 24 hours because the Earth has also moved along its orbit.','The 22-page thumb and transit handout is the long form. This model is the working version.']},
'Transit of Venus':{day:'Day 1',chapter:'Halley',routes:'essential',kicker:'Day 1 · Halley · two observers, one ruler',
 topics:[['55-venus-transits-1761-1769','The Venus transits'],['52-venus-transit-to-cepheid-distances','From a transit to the Cepheids']],
 notes:['Two stations, two chords, two durations. The difference, with the baseline, sizes the astronomical unit.','The black drop spreads the contact by tens of seconds. Say that limit out loud.','1761 and 1769 are the pair. The next thin slide is vector and raster, planted now and finished on Day 3.']},
'Three stations':{day:'Day 1',chapter:'Halley',topics:[['55-venus-transits-1761-1769','The Venus transits'],['53-captain-james-cook','Cook'],['56-charles-mason','Charles Mason']]},
'Vector or raster':{day:'Day 1',chapter:'Halley',routes:'essential gis'},
"Jupiter's moons":{day:'Day 2',chapter:'Galileo',routes:'essential',kicker:'Day 2 · Galileo · January 1610',
 topics:[['64-galileo-jupiters-moons','Galileo’s moons'],['96-jupiters-moons-as-a-measuring-stick','A measuring stick'],['46-galileo','Galileo']],
 notes:['Edge-on is what Galileo saw. From above is what was happening.','He published them in March 1610 as the Medicean Stars. Io, Europa, Ganymede, and Callisto are Marius’s 1614 names, which he credited to Kepler.','Clock mode is Rømer: Io’s eclipses run late when Earth is far. The Florence question is text until you reveal it.','Callisto’s stick, about 10 arcminutes near and 7 far, is the next native slide. The model stays this one.']},
'Medicean Stars':{day:'Day 2',chapter:'Galileo',topics:[['64-galileo-jupiters-moons','Galileo’s moons']]},
"Callisto's stick":{day:'Day 2',chapter:'Galileo',topics:[['96-jupiters-moons-as-a-measuring-stick','A measuring stick']]},
'Light needs time':{day:'Day 2',chapter:'Rømer',topics:[['65-romer-io-speed-of-light','Rømer and Io']]},
'Sky clocks and carried clocks':{day:'Day 2',chapter:'Rømer',topics:[['84-harrison-and-the-marine-chronometer','Harrison'],['64-galileo-jupiters-moons','Galileo’s moons'],['53-captain-james-cook','Cook']]},
'Moon mountains':{day:'Day 2',chapter:'Galileo',kicker:'Day 2 · Galileo · a lit peak past the terminator',
 topics:[['86-galileo-moon-mountains','Moon mountains']],
 notes:['A bright point in the dark is a peak still in sunlight. Drag it.','The triangle is the Moon’s radius, the distance past the terminator, and the radius plus the height.','Galileo’s numbers are the button. The modern diameter is the other button.']},
'Shadow and peak':{day:'Day 2',chapter:'Galileo',topics:[['86-galileo-moon-mountains','Moon mountains'],['77-ladder-sine-cosine-and-tangent','Sine, cosine, tangent']]},
'How large is 2,100 miles?':{day:'Day 2',chapter:'Galileo',topics:[['69-thumb-to-moon-calculating-the-moons-diameter','Thumb to Moon']]},
'Two thousand miles across':{day:'Day 2',chapter:'Galileo',topics:[['69-thumb-to-moon-calculating-the-moons-diameter','Thumb to Moon']]},
'Picard measures France':{day:'Day 2',chapter:'Picard',routes:'essential',kicker:'Day 2 · Picard · one measured length',
 topics:[['73-picard-triangulation-1669','Picard’s triangulation'],['88-picard-baseline-rods','The rods'],['83-the-metre-from-a-meridian','The metre'],['82-geodetic-networks','Geodetic networks']],
 notes:['Before the triangles, one road. Villejuif windmill to the Juvisy pavilion.','Two wooden bars, each 4 toises, about 25.6 feet. Leapfrog them along a tight cord. Ten iron pins: each pin is two bars, 8 toises.','He measured twice. The runs differed by 2 Paris feet. He took the middle: 5,663 toises, about 6.9 miles.','A second base, 3,902 toises, checked the work. The plate is the interactive network, not a PDF in the frame. The sources do not describe a temperature correction or a slope correction for this road.']},
'Cook':{day:'Day 2',chapter:'Cook and Mason',kicker:'Day 2 · Cook · a collier and a clock',
 topics:[['53-captain-james-cook','Captain Cook'],['59-ships-of-exploration','Ships of exploration']],
 notes:['Endeavour was a coal ship: strong, slow, and able to beach.','3 June 1769 at Tahiti. Three observers, three times, the black drop.','The east-coast chart is not a claim that the land was empty. That sentence has its own slide.','K1, Kendall’s copy of H4, sailed on the second voyage. Cook did not carry Harrison’s own watch.']},
'Surveying is not consent':{day:'Day 2',chapter:'Cook and Mason',topics:[['53-captain-james-cook','Captain Cook']]},
'Mason & Dixon':{day:'Day 2',chapter:'Cook and Mason',kicker:'Day 2 · Mason and Dixon · a line with rules',
 topics:[['58-mason-dixon-survey','The Mason–Dixon survey'],['56-charles-mason','Charles Mason'],['57-jeremiah-dixon','Jeremiah Dixon'],['90-mason-dixon-longitude','Their longitude'],['89-mason-dixon-and-picard','Mason, Dixon, and Picard']],
 notes:['A sea fight cost them Sumatra. The Cape was the southern station for 1761.','The boundary is not one kind of line. A circle, a tangent, and a parallel are different rules. The next slides separate them.','22.51 chains was a measured miss, corrected by offsets, not a story of throwing the survey away.','9 October 1767: the escort had reached the limit of its commission. Measuring is not permission.']},
'A circle, a tangent, a parallel':{day:'Day 2',chapter:'Cook and Mason',topics:[['58-mason-dixon-survey','The Mason–Dixon survey']]},
'Correct the trial line':{day:'Day 2',chapter:'Cook and Mason',topics:[['58-mason-dixon-survey','The Mason–Dixon survey']]},
"The escort's limit":{day:'Day 2',chapter:'Cook and Mason',topics:[['58-mason-dixon-survey','The Mason–Dixon survey']]},
'Mental maps':{day:'Day 3',chapter:'Projections',routes:'essential gis',kicker:'Day 3 · Projections · answer before the picture',
 topics:[['47-map-surprises','Map surprises']],
 notes:['Vote first. The globe stays a question mark until you reveal.','Havana: none of them. The mainland of South America lies east of 82.4 west.','Reno is farther west than Los Angeles. The coast is not a meridian.','Rome’s latitude is Boston’s, not Boston’s climate. Oceans store heat. Winds, currents, and land move it.','Greenland: about fourteen. The wall map is the trap. The globe is the answer. Do not show either before the reveal.']},
'Choose a projection':{day:'Day 3',chapter:'Projections',routes:'essential gis',topics:[['47-map-surprises','Map surprises']]},
'Straight is not shortest':{day:'Day 3',chapter:'Projections',routes:'gis',topics:[['47-map-surprises','Map surprises'],['50-sidereal-day','The sidereal day']]},
'Vector and raster, again':{day:'Day 3',chapter:'Vector and raster',routes:'essential gis'},
'Coordinates need a system':{day:'Day 3',chapter:'Frames and sources',routes:'gis'},
'Do not just relabel':{day:'Day 3',chapter:'Frames and sources',routes:'gis'},
'Civil clocks are not longitude':{day:'Day 3',chapter:'Frames and sources',topics:[['70-time-to-longitude','Time to longitude']]},
'The same fifteen degrees':{day:'Day 3',chapter:'Frames and sources',routes:'gis',topics:[['70-time-to-longitude','Time to longitude'],['95-degrees-arcminutes-arcseconds','Degrees, arcminutes, arcseconds']]},
'Where the data come from':{day:'Day 3',chapter:'Frames and sources',routes:'gis',topics:[['94-gaia-esa-map-of-the-galaxy','Gaia'],['07-telegraph-storm-warnings','The telegraph']]},
'Gaia maps the Galaxy':{day:'Day 3',chapter:'Frames and sources',kicker:'Day 3 · A satellite survey · the same parallax',
 topics:[['94-gaia-esa-map-of-the-galaxy','Gaia'],['93-angle-ladder-pinky-to-gaia','The angle ladder']],
 notes:['Same geometry as the thumb. Two sightings, six months apart, a baseline of 2 astronomical units.','The angle is 1 over the distance in parsecs. Ask for 1, then 10, then 100.','Nearly two billion objects measured. Not every star. Dust hides some.','This is a data source: a satellite survey with a clock, a baseline, and a published limit.']},
'Error travels':{day:'Day 4',chapter:'Error',routes:'gis'},
'More decimals':{day:'Day 4',chapter:'Error',routes:'gis'},
'A tenth of a degree':{day:'Day 4',chapter:'Error',routes:'gis',topics:[['95-degrees-arcminutes-arcseconds','Degrees, arcminutes, arcseconds']]},
'Buffer and overlay':{day:'Day 4',chapter:'Spatial operations',routes:'essential gis'},
'Rate and total':{day:'Day 4',chapter:'Wind and warnings',topics:[['75-six-ways-numbers-grow','Six ways numbers grow'],['78-mathematics-one-idea-at-a-time','One idea at a time']]},
'Double each side':{day:'Day 4',chapter:'Wind and warnings',topics:[['75-six-ways-numbers-grow','Six ways numbers grow']]},
'Twice the wind':{day:'Day 4',chapter:'Wind and warnings',routes:'gis',topics:[['71-hurricane-wind-force-square-not-exponential','Wind force']]},
'Twenty percent faster':{day:'Day 4',chapter:'Wind and warnings',topics:[['71-hurricane-wind-force-square-not-exponential','Wind force']]},
'Not always exponential':{day:'Day 4',chapter:'Wind and warnings',topics:[['71-hurricane-wind-force-square-not-exponential','Wind force'],['75-six-ways-numbers-grow','Six ways numbers grow']]},
'Force is not power':{day:'Day 4',chapter:'Wind and warnings',topics:[['71-hurricane-wind-force-square-not-exponential','Wind force'],['76-flight-calculus-terms','Flight calculus']]},
'Equal gaps, equal factors':{day:'Day 4',chapter:'Wind and warnings',topics:[['75-six-ways-numbers-grow','Six ways numbers grow']]},
'Before comparing winds':{day:'Day 4',chapter:'Wind and warnings',routes:'gis',topics:[['37-typhoon-scales-vs-saffir-simpson','Typhoon scales and Saffir–Simpson'],['27-hurricane-typhoon-cyclone','Hurricane, typhoon, cyclone']]},
'The wire outruns the storm':{day:'Day 4',chapter:'Wind and warnings',routes:'gis',topics:[['07-telegraph-storm-warnings','The telegraph']]},
'Viñes and a warning':{day:'Day 4',chapter:'Wind and warnings',topics:[['08-benito-vines','Benito Viñes']]},
'A warning is not safety':{day:'Day 4',chapter:'Wind and warnings',topics:[['09-galveston-1900','Galveston 1900']]},
'What would change the decision?':{day:'Day 4',chapter:'The decision',routes:'gis',topics:[['09-galveston-1900','Galveston 1900'],['71-hurricane-wind-force-square-not-exponential','Wind force']]},
'The shelter decision':{day:'Day 4',chapter:'The decision',routes:'essential gis',kicker:'Day 4 · The decision · a crisp edge can hide a fuzzy answer',
 topics:[['71-hurricane-wind-force-square-not-exponential','Wind force'],['09-galveston-1900','Galveston 1900'],['27-hurricane-typhoon-cyclone','Hurricane, typhoon, cyclone']],
 notes:['This is the working overlay. Wind, then surge, rain, and roads. Then the edge becomes a band.','The coast is real. The storm, the shelters, and the closures are fictional. Say that.','A buffer is the band. An overlay is the stack. The dot outside the line is not yet an answer.','No option is clean. Name the next check and the time the choice expires.']},
'The decision brief':{day:'Day 4',chapter:'The decision',routes:'essential gis',kicker:'Day 4 · The decision · choice, check, expiry',
 topics:[['71-hurricane-wind-force-square-not-exponential','Wind force']],
 notes:['Import the room’s picks. The letter of the shelter is not the product.','The product is the next check and the expiry.','Invite someone to challenge the rationale. This is a teaching brief, not an evacuation order.']},
'Better questions':{day:'Day 4',chapter:'The decision',topics:[['47-map-surprises','Map surprises']]},
'Which idea next?':{day:'Day 4',chapter:'The decision'}
};

function card(title, html){return `<div class="sheet-card"><h3>${title}</h3>${html}</div>`;}

const NEW=[
{title:'Course index',day:'Opening',chapter:'Opening',routes:'essential sample',
 lede:'Four days. The index is this slide. Each day returns to an idea the story only planted.',
 body:`<ul class="facts menu">
<li data-go="One ladder"><strong>Day 1.</strong> Measure and triangulate. The thumb trick through Halley, including a first look at projections and at vector and raster.</li>
<li data-go="Jupiter's moons"><strong>Day 2.</strong> Time and precision. Galileo, Rømer, and Picard, then Cook and Mason.</li>
<li data-go="Mental maps"><strong>Day 3.</strong> From Earth to maps. Projections, vector and raster, coordinates, and sources.</li>
<li data-go="Error travels"><strong>Day 4.</strong> Error, then buffers and overlays. Wind, warnings, and the shelter decision follow as applications.</li>
<li data-go="Baselines"><strong>Sample.</strong> Thirty minutes, from the thumb trick through the Scilly wreck.</li>
</ul><p>Chapters open from the left. Topic pages open from the right. The return button is always in the same corner.</p>`,
 svg:svg(`<text x="40" y="70" fill="${T.gold}" font-size="14" font-family="Georgia,serif">FOUR DAYS</text>
<text x="40" y="120" fill="${T.ink}" font-size="28" font-family="Georgia,serif">1  Measure</text>
<text x="40" y="170" fill="${T.ink}" font-size="28" font-family="Georgia,serif">2  Time</text>
<text x="40" y="220" fill="${T.ink}" font-size="28" font-family="Georgia,serif">3  Maps</text>
<text x="40" y="270" fill="${T.ink}" font-size="28" font-family="Georgia,serif">4  Decide</text>
<text x="40" y="340" fill="${T.mute}" font-size="16" font-family="Georgia,serif">Jeff’s script stays on the left. The picture stays on the right.</text>`),
 notes:['Open with the four days. Do not race.','Day 1 plants projections and vector versus raster. Day 3 finishes them. Day 4 finishes error, buffers, and overlays.','The thirty-minute sample stops at Scilly.','Left rail: chapters and the slide index. Right rail: the Faria page for this slide. The return button never moves.']},

{title:'One ladder',day:'Day 1',chapter:'The thumb',routes:'essential sample',
 lede:'One right triangle. Three questions. This is a paper example, not advice about setting a ladder.',
 svg:svg(`<polygon points="120,300 120,140 400,300" fill="none" stroke="${T.ink}" stroke-width="3"/>
<text x="128" y="230" fill="${T.gold}" font-size="18" font-family="Georgia,serif">height 10 ft</text>
<text x="200" y="292" fill="${T.green}" font-size="18" font-family="Georgia,serif">base ≈ 17.32 ft</text>
<text x="230" y="200" fill="${T.blue}" font-size="18" font-family="Georgia,serif">ladder 20 ft</text>
<text x="150" y="286" fill="${T.gold}" font-size="16" font-family="Georgia,serif">30°</text>
<text x="40" y="48" fill="${T.ink}" font-size="16" font-family="Georgia,serif">Sine = height ÷ ladder</text>
<text x="40" y="74" fill="${T.ink}" font-size="16" font-family="Georgia,serif">Cosine = base ÷ ladder</text>
<text x="40" y="100" fill="${T.ink}" font-size="16" font-family="Georgia,serif">Tangent = height ÷ base</text>`),
 notes:['A 20-foot ladder, 30 degrees at the ground, height 10 feet, base about 17.32.','Sine, cosine, and tangent are comparisons of sides. The feet cancel. The ratios have no length.','Keep the angle and enlarge the triangle. The lengths change. The ratios do not.','Paper only. Not a setup instruction.']},

{title:'Why thirty degrees',day:'Day 1',chapter:'The thumb',routes:'sample',
 lede:'The one-half is the shape, not a key on a calculator.',
 svg:svg(`<polygon points="80,300 320,300 200,92" fill="none" stroke="${T.ink}" stroke-width="3"/>
<line x1="200" y1="92" x2="200" y2="300" stroke="${T.gold}" stroke-width="2"/>
<text x="150" y="330" fill="${T.mute}" font-size="16" font-family="Georgia,serif">20 ft</text>
<text x="210" y="210" fill="${T.gold}" font-size="16" font-family="Georgia,serif">10 ft</text>
<text x="360" y="180" fill="${T.ink}" font-size="18" font-family="Georgia,serif">Turn the half 90°.</text>
<text x="360" y="210" fill="${T.ink}" font-size="18" font-family="Georgia,serif">10 ÷ 20 = 1/2.</text>
<text x="40" y="48" fill="${T.mute}" font-size="15" font-family="Georgia,serif">Equal sides, 60°. Split makes 30° and a 10-foot side.</text>`),
 notes:['Start with three sides of 20 feet. Each angle is 60 degrees.','Split it. The shaded half has 10 opposite the 30-degree angle, and 20 on the long side.','Turn that half. It is the ladder. Sine of 30 degrees is one half because 10 divided by 20 is one half.']},

{title:'Two eclipse reports',day:'Day 1',chapter:'The thumb',
 lede:'Hipparchus’s book is lost. Pappus keeps the report. Two places, two appearances, not a photograph.',
 svg:svg(`<circle cx="170" cy="180" r="70" fill="${T.ink}"/>
<text x="170" y="280" fill="${T.gold}" font-size="16" text-anchor="middle" font-family="Georgia,serif">Hellespont · total</text>
<circle cx="450" cy="180" r="70" fill="none" stroke="${T.ink}" stroke-width="8"/>
<circle cx="478" cy="180" r="70" fill="#0a0e18"/>
<text x="450" y="280" fill="${T.gold}" font-size="16" text-anchor="middle" font-family="Georgia,serif">Alexandria · about 4/5 of the diameter</text>
<text x="40" y="48" fill="${T.mute}" font-size="15" font-family="Georgia,serif">A report is not yet a distance in miles.</text>`),
 notes:['Total near the Hellespont. About four fifths of the Sun’s diameter covered at Alexandria. That is a diameter fraction, not an area.','Different looks mean different directions to a nearer Moon against a farther Sun.','Miles need a baseline and assumptions. The next slide puts the assumptions beside the number.']},

{title:'Assumptions beside the number',day:'Day 1',chapter:'The thumb',
 lede:'One Earth radius means centre to surface. The ranges are least and greatest, not error bars.',
 svg:card('Moon distance, in Earth radii',`<p>Book 1, Sun treated as very far: 71 to 83. Mean 77, from Pappus.</p><p>Book 2, Sun at 490 radii: 62, mean 67⅓, greatest 72⅔.</p><p>Modern mean is about 60.3. NASA’s 384,400 km divided by a 6,371 km radius.</p><p>Near a modern number is not proof that every old assumption was right. Ask which assumption would move the answer.</p>`),
 notes:['Read the assumption before the number.','Book 1 treats the Sun as very far. Book 2 gives the Sun a distance.','The modern mean is a comparison, not a grade on Hipparchus.']},

{title:'Far sunlight',day:'Day 1',chapter:'The Earth',routes:'sample',
 lede:'A nearby lamp spreads. A far Sun, across a short baseline, does not, for this purpose.',
 svg:svg(`<circle cx="70" cy="70" r="16" fill="${T.gold}"/>
<line x1="70" y1="86" x2="40" y2="340" stroke="${T.gold}"/><line x1="70" y1="86" x2="180" y2="340" stroke="${T.gold}"/>
<text x="40" y="370" fill="${T.mute}" font-size="14" font-family="Georgia,serif">Nearby lamp</text>
<line x1="360" y1="40" x2="360" y2="340" stroke="${T.blue}"/><line x1="460" y1="40" x2="460" y2="340" stroke="${T.blue}"/>
<text x="340" y="370" fill="${T.mute}" font-size="14" font-family="Georgia,serif">Distant Sun · local model</text>
<text x="300" y="200" fill="${T.ink}" font-size="14" font-family="Georgia,serif">Across 1,000 km</text>
<text x="300" y="222" fill="${T.ink}" font-size="14" font-family="Georgia,serif">Sun ≈ 150 million km</text>`),
 notes:['Do not say the rays are exactly parallel in nature. Say the difference across a city is too small for this measurement.','One thousand kilometres against 150 million is about one part in 150,000.','Eratosthenes needs that local model. The next slide is his well.']},

{title:'Maps must bend',day:'Day 1',chapter:'Projections, a first look',routes:'essential sample gis',
 lede:'Three straight walks, two left turns, and you are back at the pole. On flat paper that cannot happen.',
 svg:svg(`<circle cx="210" cy="200" r="120" fill="none" stroke="${T.blue}" stroke-width="2"/>
<line x1="210" y1="80" x2="210" y2="200" stroke="${T.gold}" stroke-width="3"/>
<path d="M210 200 A120 120 0 0 1 330 200" fill="none" stroke="${T.gold}" stroke-width="3"/>
<line x1="330" y1="200" x2="210" y2="80" stroke="${T.gold}" stroke-width="3"/>
<text x="200" y="70" fill="${T.ink}" font-size="14" text-anchor="middle" font-family="Georgia,serif">North Pole</text>
<text x="400" y="80" fill="${T.ink}" font-size="16" font-family="Georgia,serif">1 South to the equator</text>
<text x="400" y="110" fill="${T.ink}" font-size="16" font-family="Georgia,serif">2 Left 90°, a quarter turn</text>
<text x="400" y="140" fill="${T.ink}" font-size="16" font-family="Georgia,serif">3 Left 90°, back to the pole</text>
<text x="400" y="200" fill="${T.gold}" font-size="16" font-family="Georgia,serif">Three square corners.</text>
<text x="400" y="230" fill="${T.ink}" font-size="16" font-family="Georgia,serif">A flat map must</text>
<text x="400" y="256" fill="${T.ink}" font-size="16" font-family="Georgia,serif">stretch or bend something.</text>`),
 notes:['Walk it with your hand. Pole, equator, quarter of the way, back to the pole.','Three right angles, closed. Flat paper cannot do that.','This is the thin projection slide. No Greenland. No answer to the area question. Day 3 chooses which property to keep.']},

{title:'Longitude has no landmarks',day:'Day 1',chapter:'Longitude',routes:'sample',
 lede:'Two ships can share a latitude and still be hundreds of miles apart, east or west.',
 svg:svg(`<ellipse cx="320" cy="200" rx="220" ry="80" fill="none" stroke="${T.blue}" stroke-width="2"/>
<circle cx="200" cy="200" r="8" fill="${T.gold}"/><circle cx="460" cy="200" r="8" fill="${T.gold}"/>
<text x="200" y="170" fill="${T.gold}" font-size="16" text-anchor="middle" font-family="Georgia,serif">Ship A</text>
<text x="460" y="170" fill="${T.gold}" font-size="16" text-anchor="middle" font-family="Georgia,serif">Ship B</text>
<text x="320" y="250" fill="${T.ink}" font-size="18" text-anchor="middle" font-family="Georgia,serif">Same latitude. No landmark between them.</text>
<text x="320" y="50" fill="${T.mute}" font-size="15" text-anchor="middle" font-family="Georgia,serif">North and south have the equator and the poles. East and west do not.</text>`),
 notes:['Latitude had the equator and the poles. Longitude has no such marks.','Same latitude, and they can still be a ocean apart.','Do not put a degree number on this slide. The idea is the missing landmark.']},

{title:'The Isles of Scilly',day:'Day 1',chapter:'Longitude',routes:'essential sample',h1:'The Isles of Scilly, 1707',
 lede:'The cost of not knowing. Night, rocks, and no longitude.',
 svg:svg(`<rect width="640" height="400" fill="#070b14"/>
<circle cx="120" cy="60" r="2" fill="${T.ink}"/><circle cx="200" cy="40" r="1.5" fill="${T.ink}"/><circle cx="400" cy="70" r="1.5" fill="${T.ink}"/>
<path d="M80 250 L140 210 L180 260 L240 190 L300 270 L360 200 L430 280 L520 220 L580 270" fill="none" stroke="#3a4258" stroke-width="8"/>
<rect x="150" y="230" width="36" height="8" fill="${T.mute}"/><rect x="230" y="214" width="36" height="8" fill="${T.mute}"/>
<rect x="320" y="236" width="36" height="8" fill="${T.mute}"/><rect x="410" y="220" width="36" height="8" fill="${T.mute}"/>
<text x="320" y="340" fill="${T.ink}" font-size="16" text-anchor="middle" font-family="Georgia,serif">Four ships. Admiral Clowdesley Shovell.</text>
<text x="320" y="366" fill="${T.mute}" font-size="14" text-anchor="middle" font-family="Georgia,serif">About 2,000 sailors. Some counts say 1,400 to 2,000.</text>`),
 notes:['Spell the admiral Clowdesley.','22 October 1707. Four Royal Navy ships wrecked at night on the Isles of Scilly.','About 2,000 dead. Some historical counts put it between 1,400 and 2,000. Say the range.','This is the cost. The Act is the next slide. Do not jump to Harrison’s watch yet.']},

{title:'The Longitude Act',day:'Day 1',chapter:'Longitude',h1:'The Longitude Act, 1714',
 lede:'That wreck led Parliament to offer a fortune for a way to find longitude at sea.',
 svg:card('1714',`<p>The Longitude Act offered rewards, up to £20,000, for a method useful at sea.</p><p>The problem was still open. A star method existed. A sky clock existed. A pendulum clock did not survive a rolling ship.</p><p>Harrison’s watch is later. This slide is only the Act.</p>`),
 notes:['Connect it to Scilly in one sentence. Then stop.','Up to £20,000. Do not narrate the whole prize fight tonight.','The next idea is that longitude is time, because the Earth is spinning.']},

{title:'Longitude is time',day:'Day 1',chapter:'Longitude',routes:'essential',
 lede:'You cannot measure a star for longitude the way you measure Polaris for latitude. The Earth is spinning.',
 svg:svg(`<circle cx="220" cy="200" r="90" fill="#15294a" stroke="${T.blue}"/>
<line x1="220" y1="110" x2="220" y2="290" stroke="${T.gold}" stroke-width="3"/>
<path d="M300 120 A70 70 0 0 1 340 200" fill="none" stroke="${T.gold}" stroke-width="2"/>
<text x="350" y="160" fill="${T.gold}" font-size="16" font-family="Georgia,serif">spinning</text>
<text x="40" y="48" fill="${T.ink}" font-size="18" font-family="Georgia,serif">Latitude: a star’s height.</text>
<text x="40" y="78" fill="${T.ink}" font-size="18" font-family="Georgia,serif">Longitude: a time difference.</text>
<text x="380" y="240" fill="${T.mute}" font-size="15" font-family="Georgia,serif">The star you want</text>
<text x="380" y="264" fill="${T.mute}" font-size="15" font-family="Georgia,serif">has moved by morning.</text>`),
 notes:['Polaris works for latitude because the pole stays put in your sky.','Longitude is east and west on a body that is turning. A single star sight does not say how far around you are.','You need two times for the same instant: local time, and a reference time.']},

{title:'Lunar distances',day:'Day 1',chapter:'Longitude',
 lede:'There was a star method. On a rolling ship the arithmetic took more than an hour, and it was often wrong.',
 svg:svg(`<circle cx="160" cy="180" r="36" fill="${T.cream}"/>
<circle cx="148" cy="176" r="36" fill="#0a0e18"/>
<circle cx="420" cy="120" r="5" fill="${T.ink}"/>
<text x="436" y="124" fill="${T.ink}" font-size="14" font-family="Georgia,serif">a star</text>
<line x1="170" y1="170" x2="420" y2="120" stroke="${T.gold}" stroke-width="2"/>
<text x="240" y="130" fill="${T.gold}" font-size="16" font-family="Georgia,serif">the angle is the clock</text>
<text x="40" y="300" fill="${T.mute}" font-size="16" font-family="Georgia,serif">Measure. Correct. Look up the almanac. Often more than an hour.</text>
<text x="40" y="330" fill="${T.mute}" font-size="16" font-family="Georgia,serif">A rolling deck makes the sight worse.</text>`),
 notes:['The Moon moves against the stars by about its own width in an hour. That angle is a clock anyone can see.','Maskelyne’s Nautical Almanac, from 1767, tabulated it. The work was long, and often wrong at sea.','It did not die when the watch arrived. Cook used lunar distances beside the clock. Say that it was hard, not that it was foolish.']},

{title:'A clock in the sky',day:'Day 1',chapter:'Longitude',
 lede:'Galileo offered Jupiter’s moons. They worked on land. They failed on a pitching ship.',
 svg:svg(`<circle cx="300" cy="200" r="46" fill="#c4a574"/>
<circle cx="180" cy="200" r="7" fill="${T.ink}"/><circle cx="230" cy="190" r="8" fill="${T.ink}"/>
<circle cx="390" cy="206" r="9" fill="${T.ink}"/><circle cx="470" cy="196" r="8" fill="${T.ink}"/>
<text x="300" y="90" fill="${T.gold}" font-size="18" text-anchor="middle" font-family="Georgia,serif">Io eclipses on a timetable</text>
<text x="300" y="330" fill="${T.ink}" font-size="16" text-anchor="middle" font-family="Georgia,serif">Steady ground: a clock. A pitching deck: the planet leaves the eyepiece.</text>`),
 notes:['Io disappears into Jupiter’s shadow on a schedule the whole world can share.','Compare that predicted time with your local time. The difference is a longitude difference.','It fixed maps on land. At sea nobody could hold Jupiter in the glass. The full model is Day 2. This slide is only the offer and the failure.']},

{title:'Longitude bingo',day:'Day 1',chapter:'Longitude',
 lede:'Robert can call a square because the squares are already labeled. The ocean has no printed squares until you can measure time.',
 svg:svg(`<rect x="70" y="50" width="280" height="280" fill="#111727" stroke="${T.gold}"/>
${[0,1,2,3,4].map(r=>[0,1,2,3,4].map(c=>`<rect x="${70+c*56}" y="${50+r*56}" width="56" height="56" fill="none" stroke="${T.mute}"/>`).join('')).join('')}
<text x="98" y="84" fill="${T.gold}" font-size="14" font-family="Georgia,serif">40N</text>
<text x="150" y="84" fill="${T.ink}" font-size="14" font-family="Georgia,serif">70W</text>
<text x="380" y="120" fill="${T.ink}" font-size="18" font-family="Georgia,serif">“B 4.”</text>
<text x="380" y="160" fill="${T.mute}" font-size="15" font-family="Georgia,serif">The card works</text>
<text x="380" y="184" fill="${T.mute}" font-size="15" font-family="Georgia,serif">because the squares</text>
<text x="380" y="208" fill="${T.mute}" font-size="15" font-family="Georgia,serif">have names.</text>
<text x="380" y="260" fill="${T.gold}" font-size="15" font-family="Georgia,serif">The ocean does not,</text>
<text x="380" y="284" fill="${T.gold}" font-size="15" font-family="Georgia,serif">until you can time it.</text>`),
 notes:['You just showed the Earth as a 24-hour clock. The grid is the joke’s setup.','Robert calls a square. Everyone can find it, because the card is printed.','Two ships on the same latitude cannot call a square in the ocean until longitude is a measurement, which means until time is a measurement.']},

{title:'A pendulum cannot go to sea',day:'Day 1',chapter:'Longitude',
 lede:'Ordinary clocks used a swinging pendulum. A rolling ship throws that swing off.',
 svg:svg(`<line x1="200" y1="60" x2="200" y2="80" stroke="${T.ink}" stroke-width="3"/>
<line x1="200" y1="80" x2="250" y2="220" stroke="${T.gold}" stroke-width="3"/>
<circle cx="250" cy="232" r="14" fill="${T.gold}"/>
<text x="300" y="140" fill="${T.ink}" font-size="18" font-family="Georgia,serif">The swing is the clock.</text>
<text x="300" y="175" fill="${T.mute}" font-size="16" font-family="Georgia,serif">Roll the ship and the</text>
<text x="300" y="200" fill="${T.mute}" font-size="16" font-family="Georgia,serif">swing is no longer the time.</text>
<path d="M80 300 Q200 250 520 310" fill="none" stroke="${T.blue}" stroke-width="3"/>
<text x="80" y="350" fill="${T.mute}" font-size="15" font-family="Georgia,serif">A heaving deck is not a pendulum’s room.</text>`),
 notes:['One idea. The clocks they had kept time with a pendulum.','A pendulum wants a still house. A ship does not offer one.','So the problem changed. It was no longer “what is longitude?” It was “what clock can travel?”']},

{title:"Harrison's job",day:'Day 1',chapter:'Longitude',h1:'Harrison’s job',
 lede:'The problem was now a clock that could travel. That is John Harrison’s job. The later slides pick him up at sea.',
 svg:svg(`<circle cx="240" cy="190" r="70" fill="${T.cream}" stroke="${T.gold}" stroke-width="4"/>
<line x1="240" y1="190" x2="240" y2="140" stroke="#2a2418" stroke-width="3"/>
<line x1="240" y1="190" x2="275" y2="205" stroke="#2a2418" stroke-width="2"/>
<text x="340" y="160" fill="${T.ink}" font-size="18" font-family="Georgia,serif">A watch, not a pendulum.</text>
<text x="340" y="195" fill="${T.mute}" font-size="15" font-family="Georgia,serif">H4 comes later.</text>
<text x="340" y="220" fill="${T.mute}" font-size="15" font-family="Georgia,serif">Today, only the job.</text>
<text x="40" y="340" fill="${T.gold}" font-size="16" font-family="Georgia,serif">Keep home time. Read local noon. The gap is the longitude.</text>`),
 notes:['Do not tell the whole Harrison biography here. Name the job.','A clock that keeps a reference time through heat, cold, and a rolling ship.','Local noon against that clock is longitude, at 15 degrees an hour. Cook and K1 are Day 2.']},

{title:'An arcminute and a dime',day:'Day 1',chapter:'Longitude',
 lede:'First the angle. Then the mile. The dime is face-on, not on edge.',
 svg:svg(`<circle cx="140" cy="170" r="54" fill="${T.cream}" stroke="${T.gold}" stroke-width="3"/>
<text x="140" y="166" fill="#2a2418" font-size="14" text-anchor="middle" font-family="Georgia,serif">face</text>
<text x="140" y="186" fill="#2a2418" font-size="14" text-anchor="middle" font-family="Georgia,serif">on</text>
<text x="230" y="120" fill="${T.ink}" font-size="18" font-family="Georgia,serif">1° of latitude = 60 arcminutes</text>
<text x="230" y="155" fill="${T.ink}" font-size="18" font-family="Georgia,serif">1 arcminute ≈ 1 nautical mile</text>
<text x="230" y="200" fill="${T.gold}" font-size="16" font-family="Georgia,serif">Then, and only then:</text>
<text x="230" y="230" fill="${T.gold}" font-size="16" font-family="Georgia,serif">1 nautical mile = 1,852 m</text>
<text x="40" y="300" fill="${T.mute}" font-size="16" font-family="Georgia,serif">One arcminute: that dime, face-on, at about 200 feet.</text>
<text x="40" y="330" fill="${T.mute}" font-size="16" font-family="Georgia,serif">One arcsecond: the same dime, face-on, at about 2.3 miles.</text>`),
 notes:['Order matters. Sixty arcminutes in a degree. Each arcminute of latitude is one nautical mile.','Then give 1,852 metres, the value fixed in 1929. Do not start with the metre.','The dime is face-on. One arcminute at about 200 feet. One arcsecond at about 2.3 miles. Never the thin edge.']},

{title:'Polaris is not the pole',day:'Day 1',chapter:'Longitude',
 lede:'Star trails circle one pivot. Polaris circles that pivot, about 0.6 degrees away, a bit more than a full Moon.',
 svg:svg(`<circle cx="230" cy="190" r="4" fill="${T.gold}"/>
<circle cx="230" cy="190" r="70" fill="none" stroke="${T.mute}" stroke-dasharray="4 4"/>
<circle cx="230" cy="120" r="5" fill="${T.ink}"/>
<text x="250" y="116" fill="${T.ink}" font-size="16" font-family="Georgia,serif">Polaris</text>
<text x="200" y="214" fill="${T.gold}" font-size="14" font-family="Georgia,serif">true pole</text>
<circle cx="470" cy="170" r="28" fill="${T.cream}"/>
<text x="470" y="230" fill="${T.mute}" font-size="14" text-anchor="middle" font-family="Georgia,serif">full Moon, same scale</text>
<text x="40" y="340" fill="${T.ink}" font-size="16" font-family="Georgia,serif">Close enough to steer by. Correct it when you need the mile.</text>`),
 notes:['The pivot is the pole, not the star.','About 0.6 degrees in this lesson’s rounded figure. A full Moon is about half a degree wide.','Everyday direction: good enough. Precise latitude: use the correction.']},

{title:'An uncorrected star',day:'Day 1',chapter:'Longitude',
 lede:'A fictional thought experiment. Hold the raw star height fixed, and the latitude you infer draws a wave.',
 svg:svg(`<line x1="60" y1="200" x2="580" y2="200" stroke="${T.ink}"/>
<path d="M60 200 Q140 120 220 200 T380 200 T540 200" fill="none" stroke="${T.red}" stroke-width="3"/>
<text x="60" y="80" fill="${T.red}" font-size="16" font-family="Georgia,serif">uncorrected · about ±36 nautical miles</text>
<text x="60" y="250" fill="${T.ink}" font-size="16" font-family="Georgia,serif">corrected · a flat line</text>
<text x="60" y="330" fill="${T.mute}" font-size="15" font-family="Georgia,serif">Not a recorded voyage. 0.6° is about 36 nautical miles of latitude.</text>`),
 notes:['Label it fictional. No ship, no storm, no advice.','If you treat Polaris as the pole and hold its raw height, the latitude you need wanders by about the offset.','The corrected line is flat. That is the whole picture.']},

{title:'Correct the star',day:'Day 1',chapter:'Longitude',
 lede:'Bowditch’s page, in the form the navigator still uses. Measure, then correct. This arithmetic is invented.',
 svg:card('An example, not an almanac line',`<p>1. Measure the star’s height. Here, 40.4°.</p><p>2. Use the time and the table. The pole correction in this example is −0.4°.</p><p>3. Read the latitude. 40.0° N.</p><p>0.4° is four tenths of a degree, not four arcminutes. With Polaris about 0.6° from the pole, the correction stays inside about ±0.6°.</p>`),
 notes:['Three steps, in order. Height, table, latitude.','The numbers are a paper example. No ship, no date.','Time tells you where Polaris sits on its small circle. Time alone is not the latitude.']},

{title:'Phone and night sky',day:'Day 1',chapter:'Longitude',
 lede:'Read the phone. Then measure the sky. Hope they agree about, not exactly.',
 svg:card('Illustrative 40° N · compare, do not grade them',`<p>The phone in this example reads 40.0° N. That is a position, not a star sight.</p><p>Polaris, the same night, is about 40° above a level horizon. “About” is the lesson.</p><p>A compass heading is not an altitude. A sloping skyline is not a level horizon. Do not look at the Sun to try this.</p>`),
 notes:['Two instruments, two questions. The phone does not measure the star.','Approximate agreement is the success. An exact match would be luck, or a copied number.','Safe night sky only. Never the Sun through this exercise.']},

{title:'Local down',day:'Day 1',chapter:'Longitude',
 lede:'Upright follows gravity, not the top of the page. Two places, two local downs.',
 svg:svg(`<circle cx="300" cy="210" r="110" fill="#15294a" stroke="${T.blue}"/>
<line x1="250" y1="120" x2="280" y2="210" stroke="${T.red}" stroke-width="3"/>
<line x1="370" y1="150" x2="330" y2="230" stroke="${T.red}" stroke-width="3"/>
<text x="180" y="100" fill="${T.ink}" font-size="14" font-family="Georgia,serif">Place A · down</text>
<text x="390" y="130" fill="${T.ink}" font-size="14" font-family="Georgia,serif">Place B · down</text>
<text x="40" y="360" fill="${T.mute}" font-size="14" font-family="Georgia,serif">Ideal model: local down points inward. Real gravity can depart from that.</text>`),
 notes:['Turn the page. The string still hangs the same way. Down is not “toward the bottom of the slide.”','In the ideal sphere, local down points at the centre. Say the limit: real gravity does not always do that.','Deflection of the vertical is the name for the departure. You do not need the algebra tonight.']},

{title:'A quadrant reads a height',day:'Day 1',chapter:'Longitude',
 lede:'A quarter circle and a plumb line. Aim at the star. Where the line hangs is the altitude. The 12-page handout is not on this site, so this is the deck’s quadrant, not that pamphlet page by page.',
 svg:svg(`<path d="M120 300 L120 80 A220 220 0 0 1 340 300 Z" fill="#15294a" stroke="${T.ink}" stroke-width="2"/>
<line x1="120" y1="80" x2="220" y2="300" stroke="${T.gold}" stroke-width="2"/>
<circle cx="220" cy="300" r="6" fill="${T.gold}"/>
<text x="230" y="290" fill="${T.gold}" font-size="14" font-family="Georgia,serif">plumb</text>
<text x="360" y="120" fill="${T.ink}" font-size="16" font-family="Georgia,serif">Altitude of the pole</text>
<text x="360" y="148" fill="${T.ink}" font-size="16" font-family="Georgia,serif">= latitude</text>
<text x="360" y="200" fill="${T.mute}" font-size="14" font-family="Georgia,serif">On land, it works.</text>
<text x="360" y="224" fill="${T.mute}" font-size="14" font-family="Georgia,serif">On a heaving deck, it does not.</text>`),
 notes:['A quadrant is a quarter of a circle. The plumb line is the vertical.','Sight the star along the edge. The scale reads the height.','That height of the pole is the latitude. The instrument fails when the ship rolls, because the plumb line swings.','The November 11 quadrant pamphlet was not in this workspace. Do not pretend this slide is all 12 pages.']},

{title:'Three stations',day:'Day 1',chapter:'Halley',
 lede:'One transit, three limits. The rows are not the same year.',
 svg:card('Not three identical outcomes',`<p><b>Cape, 1761.</b> 6 June: the end of the transit, not a full clear passage.</p><p><b>Tahiti, 1769.</b> 3 June: Cook’s journal says the sky was clear. The observers still disagreed on the contact.</p><p><b>Baja, 1769.</b> Transit on 3 June. Chappe tried a lunar eclipse on 18 June while ill. He died on 1 August.</p><p>A network can succeed when no single station was perfect.</p>`),
 notes:['Read the rows separately. Cape is 1761. Tahiti and Baja are 1769.','Clear weather did not remove the timing error.','Do not tell a cloudless Cape transit. The slide says end only.']},

{title:'Vector or raster',day:'Day 1',chapter:'Halley',routes:'essential gis',h1:'Vector or raster',
 lede:'Two ways to record the same shore. Planted here. Finished on Day 3.',
 svg:svg(`<circle cx="90" cy="150" r="7" fill="${T.gold}"/>
<text x="110" y="154" fill="${T.ink}" font-size="16" font-family="Georgia,serif">point · a shelter</text>
<line x1="70" y1="210" x2="230" y2="250" stroke="${T.green}" stroke-width="3"/>
<text x="110" y="240" fill="${T.ink}" font-size="16" font-family="Georgia,serif">line · a road</text>
<polygon points="70,300 160,280 200,340 80,350" fill="none" stroke="${T.blue}" stroke-width="2"/>
<text x="210" y="320" fill="${T.ink}" font-size="16" font-family="Georgia,serif">polygon · a flood zone</text>
${[0,1,2,3,4].map(r=>[0,1,2,3,4].map(c=>`<rect x="${400+c*36}" y="${80+r*36}" width="36" height="36" fill="${(r+c)%3===0?'#1d3a34':'#15294a'}" stroke="#283048"/>`).join('')).join('')}
<text x="400" y="290" fill="${T.mute}" font-size="15" font-family="Georgia,serif">raster · a value in each cell</text>
<text x="40" y="380" fill="${T.gold}" font-size="15" font-family="Georgia,serif">Same shore. Two records. Neither record is the shore.</text>`),
 notes:['Thin. One minute.','Vector: points, lines, and polygons, with coordinates. Good for “is the shelter inside the zone?”','Raster: a grid of cells, each with a value. A picture, a rainfall grid. Good for “how much, here?”','The six-page handout is the full lesson and is not on this site. Day 3 returns to the choice. Do not pretend this slide is all six pages.']},

{title:'Medicean Stars',day:'Day 2',chapter:'Galileo',
 lede:'New centres of motion are real. They are not, by themselves, a proof that the Earth moves.',
 svg:card('Names, in outward order, not to scale',`<p>7 January 1610: Galileo sees points beside Jupiter. March 1610: Sidereus Nuncius calls them the Medicean Stars.</p><p>Io, Europa, Ganymede, Callisto are Simon Marius’s names, in Mundus Iovialis, 1614. Marius said Kepler suggested them.</p><p>Marius’s 29 December 1609 is Julian. On the Gregorian calendar it is 8 January 1610, the day after Galileo’s night. Do not call that fraud from the numbers alone.</p><p>Jupiter keeps its moons while it travels. That weakens one objection to Copernicus. Tycho’s system can hold those moons too.</p>`),
 notes:['One idea. A moon of Jupiter does not finish the case for a moving Earth.','Say the names and who gave them.','Say the calendars. Julian 29 December 1609 is Gregorian 8 January 1610.']},

{title:"Callisto's stick",day:'Day 2',chapter:'Galileo',h1:'Callisto’s stick',
 lede:'The same length looks smaller when you are farther away. Angles give a ratio. They do not give miles.',
 svg:card('Teaching numbers, rounded',`<p>Io is the clock: about 42.5 hours. Callisto is the ruler: about 1.88 million km from Jupiter.</p><p>Near side, about 4.2 AU from Jupiter: the stick is about 10 arcminutes. Far side, about 6.2 AU: about 7 arcminutes.</p><p>10 ÷ 7 is about 1.5, and 6.2 ÷ 4.2 is about 1.5. The angles recover Kepler’s scale in AU.</p><p>A dime, face-on, at about 200 feet is one arcminute. Ten arcminutes is that dime at about 20 feet. Seven is the same dime at about 29 feet.</p><p>Miles came later: Mars in 1672, then the transits of 1761 and 1769. At the far side, Jupiter is in the Sun’s glare, so the real “far” views fall a little short.</p>`),
 notes:['Clock and ruler. Do not mix them.','Near 10 arcminutes, far 7. The ratio matches the AU ratio.','Stop before miles. The stick cannot supply miles until someone has measured one length.','The dime stays face-on.']},

{title:'Light needs time',day:'Day 2',chapter:'Rømer',
 lede:'Same near and far. Measured in minutes instead of arcminutes. Io does not switch off a lamp. The sunlight it reflects is cut off.',
 svg:card('Across Earth’s orbit',`<p>Ole Rømer, 1676, in Paris, with Cassini’s eclipse tables. Eclipses come late when Earth is traveling away from Jupiter, early when Earth is traveling toward it.</p><p>Traditional figure: about 22 minutes for light to cross the diameter of Earth’s orbit. Modern light-time for that diameter: 16 minutes 40 seconds.</p><p>Rømer did not print a speed. Huygens, in 1690, turned a scale into a speed near 230,000 km/s. The defined speed is 299,792.458 km/s.</p><p>You cannot take one opposition and one conjunction and be done. Near conjunction, Jupiter is in the glare. The clock mode on the moons slide is the moving picture.</p>`),
 notes:['Reflected sunlight, cut off. Not a lamp on Io.','22 minutes is the traditional round number. 16 minutes 40 seconds is the modern light-time. Say both.','Huygens gave the speed. Rømer did not.','Then open clock mode on the moons slide if the room wants the moving Earth.']},

{title:'Sky clocks and carried clocks',day:'Day 2',chapter:'Rømer',
 lede:'One method did not switch the other off. The spacing below is not a timeline to scale.',
 svg:card('Selected milestones',`<p><b>1610.</b> Galileo publishes the moons. Not yet an easy sea method.</p><p><b>1761.</b> Harrison’s H4 on the Jamaica trial, with his son William. A trial, not the prize, and not Kendall’s K1.</p><p><b>1764.</b> Barbados: sky methods and H4, side by side.</p><p><b>1772–75.</b> Cook tests Kendall’s K1, a copy. He did not carry H4 itself.</p><p>A lunar distance is an angle in the sky, not a distance to the Moon.</p>`),
 notes:['Read down the list. Do not draw an arrow that says one method killed the last.','1610 is the observation, not a finished longitude service.','K1 is the copy. Say so every time.']},

{title:'Shadow and peak',day:'Day 2',chapter:'Galileo',
 lede:'Two different triangles. The shadow sum is invented. The peak is Galileo’s kind of argument.',
 svg:svg(`<line x1="40" y1="250" x2="250" y2="250" stroke="${T.ink}"/>
<line x1="80" y1="250" x2="80" y2="160" stroke="${T.gold}" stroke-width="3"/>
<line x1="80" y1="160" x2="220" y2="250" stroke="${T.gold}"/>
<text x="40" y="80" fill="${T.ink}" font-size="15" font-family="Georgia,serif">Invented: 30°, shadow 1,000 ft</text>
<text x="40" y="104" fill="${T.gold}" font-size="15" font-family="Georgia,serif">height ≈ 577 ft</text>
<circle cx="470" cy="210" r="80" fill="#1c1a16" stroke="${T.mute}"/>
<line x1="390" y1="140" x2="560" y2="140" stroke="${T.gold}"/>
<line x1="470" y1="130" x2="470" y2="150" stroke="${T.red}" stroke-width="3"/>
<text x="360" y="70" fill="${T.ink}" font-size="15" font-family="Georgia,serif">Peak, exaggerated</text>
<text x="360" y="94" fill="${T.mute}" font-size="14" font-family="Georgia,serif">not a real lunar profile</text>`),
 notes:['Left: a made-up shadow. Tangent of 30 degrees times 1,000 feet is about 577. Not Galileo’s data.','Right: a grazing ray and a peak in the dark. That is his kind of triangle. The working model is the moon-mountains slide.','Do not call the shadow sum his measurement.']},

{title:'How large is 2,100 miles?',day:'Day 2',chapter:'Galileo',ask:true,
 lede:'Picture a circle 2,100 miles across, laid on the United States. Which cities would it reach? Decide before the next slide.',
 notes:['No map on this slide. Let them commit.','2,100 miles is the rounded width from the thumb-to-Moon estimate, not a claim that the Moon is exactly that wide.','The next slide is the reveal. Boston sits outside.']},

{title:'Two thousand miles across',day:'Day 2',chapter:'Galileo',
 lede:'A size comparison, not a footprint and not a forecast. The circle does not pass through all four cities.',
 svg:svg(`<circle cx="300" cy="200" r="120" fill="none" stroke="${T.gold}" stroke-width="2"/>
<circle cx="250" cy="230" r="5" fill="${T.green}"/><text x="200" y="250" fill="${T.green}" font-size="14" font-family="Georgia,serif">Miami · inside</text>
<circle cx="280" cy="170" r="5" fill="${T.green}"/><text x="290" y="166" fill="${T.green}" font-size="14" font-family="Georgia,serif">Chicago · inside</text>
<circle cx="210" cy="180" r="5" fill="${T.green}"/><text x="120" y="170" fill="${T.green}" font-size="14" font-family="Georgia,serif">Denver · inside</text>
<circle cx="430" cy="90" r="5" fill="${T.red}"/><text x="445" y="94" fill="${T.red}" font-size="14" font-family="Georgia,serif">Boston · outside</text>
<text x="40" y="360" fill="${T.mute}" font-size="14" font-family="Georgia,serif">Schematic. Radius 1,050 miles. Not the fitted Census map.</text>`),
 notes:['Reveal only. Boston is the one that sits outside this rounded circle.','Say it is a teaching sketch. The master’s plate was an azimuthal map fitted to Census points. This drawing does not repeat that fit.','Denver, Chicago, and Miami fall inside the story. Do not invent a mile-by-mile residual.']},

{title:'Surveying is not consent',day:'Day 2',chapter:'Cook and Mason',
 lede:'A precise chart of a coast is not evidence that the land was empty, or that anyone had agreed to the claim.',
 svg:card('1770 · the east coast',`<p>Cook charted the east coast and, at Possession Island on 22 August 1770, claimed it for the Crown.</p><p>A claim is a British sentence. It is not Aboriginal consent, and it is not proof that the country was unknown to the people living there.</p><p>The interactive coast is a modern outline, not Cook’s chart and not a map of countries.</p><p>Measuring where a shore lies and deciding who has authority are different questions.</p>`),
 notes:['Say it plainly. Surveying is not consent.','Do not invent a single people or a single meeting to stand for the whole coast.','The model can show the line. This slide says what the line is not.']},

{title:'A circle, a tangent, a parallel',day:'Day 2',chapter:'Cook and Mason',
 lede:'Three different rules. Not one map of the finished boundary.',
 svg:svg(`<circle cx="110" cy="180" r="70" fill="none" stroke="${T.ink}"/>
<line x1="110" y1="180" x2="180" y2="180" stroke="${T.gold}" stroke-width="3"/>
<text x="70" y="280" fill="${T.mute}" font-size="14" font-family="Georgia,serif">Circle · 12-mile radius</text>
<line x1="280" y1="80" x2="280" y2="260" stroke="${T.ink}"/>
<line x1="220" y1="200" x2="360" y2="200" stroke="${T.gold}" stroke-width="3"/>
<text x="230" y="300" fill="${T.mute}" font-size="14" font-family="Georgia,serif">Tangent · a right angle</text>
<ellipse cx="520" cy="180" rx="70" ry="28" fill="none" stroke="${T.gold}" stroke-width="3"/>
<text x="470" y="250" fill="${T.mute}" font-size="14" font-family="Georgia,serif">One latitude</text>`),
 notes:['Circle: every point a fixed distance from a centre. The historical radius was twelve miles, not a twelve-mile diameter.','Tangent: touches, and at the touch the radius is square to the line.','Parallel: one latitude, all the way around. The drawing is a ring on a sphere, seen at a slant. It is not the Mason–Dixon latitude.']},

{title:'Correct the trial line',day:'Day 2',chapter:'Cook and Mason',
 lede:'A measured miss can be turned into offsets. It is not a story that the whole survey was thrown away.',
 svg:card('1764 · the tangent survey',`<p>The trial line missed an earlier tangent-point mark by 22.51 chains, about 1,486 feet.</p><p>Mason remeasured that gap himself and agreed within one link. A Gunter’s chain is 66 feet. One link is 0.66 foot.</p><p>Within one link is agreement on that gap. It is not a claim that the finished boundary was correct to an inch.</p><p>The offsets were calculated and applied. The sources used here do not describe a wholesale restart.</p>`),
 notes:['22.51 chains. About 1,486 feet. Say the unit before the drama.','He checked the gap. Then they computed offsets.','Do not tell it as a ruined survey.']},

{title:"The escort's limit",day:'Day 2',chapter:'Cook and Mason',h1:'The escort’s limit',
 lede:'Measuring a line and having permission to continue are different questions.',
 svg:card('1767',`<p>July: a Six Nations escort joins the survey.</p><p>9 October: a war path. Mason’s journal, as later transcribed, reports the limit of the escort leader’s commission.</p><p>The October letter’s words, about the leader: “would not proceed one Step further.” That is Mason’s report, not a speech to put in the leader’s mouth.</p><p>The commission’s limit is not a verdict on every nation’s title, and it is not a claim that every chain stopped forever that afternoon.</p>`),
 notes:['Keep the quotation exact, and say whose sentence it is.','Do not upgrade it to “hostile nations ordered them to halt.”','Authority and measurement are different. Stop there.']},

{title:'Choose a projection',day:'Day 3',chapter:'Projections',routes:'essential gis',
 lede:'A projection is a rule for drawing a curved Earth on a flat sheet. Pick the property the question needs.',
 svg:svg(`<ellipse cx="160" cy="180" rx="100" ry="70" fill="none" stroke="${T.gold}" stroke-width="3"/>
<text x="160" y="290" fill="${T.gold}" font-size="16" text-anchor="middle" font-family="Georgia,serif">Mercator</text>
<text x="160" y="314" fill="${T.mute}" font-size="13" text-anchor="middle" font-family="Georgia,serif">local angles kept · area grows</text>
<ellipse cx="460" cy="200" rx="70" ry="90" fill="none" stroke="${T.green}" stroke-width="3"/>
<text x="460" y="320" fill="${T.green}" font-size="16" text-anchor="middle" font-family="Georgia,serif">Equal-area</text>
<text x="460" y="344" fill="${T.mute}" font-size="13" text-anchor="middle" font-family="Georgia,serif">area kept · shape changes</text>
<text x="40" y="40" fill="${T.ink}" font-size="15" font-family="Georgia,serif">Same idea, two rules. Neither keeps every property.</text>`),
 notes:['Mercator keeps local angles and enlarges area toward the poles. That is why Greenland looked huge on the question you already ran.','Equal-area keeps area and changes local shape.','For a distance, ask where the scale is true. The Greenland reveal was the coastline version of this choice.']},

{title:'Straight is not shortest',day:'Day 3',chapter:'Projections',routes:'gis',
 lede:'A straight line on this map is a constant bearing. The shorter path on the sphere bends on the page.',
 svg:svg(`<rect x="80" y="60" width="480" height="240" fill="none" stroke="${T.mute}"/>
<line x1="140" y1="180" x2="500" y2="180" stroke="${T.ink}" stroke-width="2"/>
<path d="M140 180 Q320 80 500 180" fill="none" stroke="${T.gold}" stroke-width="3"/>
<text x="140" y="210" fill="${T.ink}" font-size="14" font-family="Georgia,serif">A</text>
<text x="500" y="210" fill="${T.ink}" font-size="14" font-family="Georgia,serif">B</text>
<text x="200" y="150" fill="${T.gold}" font-size="14" font-family="Georgia,serif">shorter on the sphere</text>
<text x="220" y="200" fill="${T.mute}" font-size="14" font-family="Georgia,serif">straight here · a rhumb line</text>
<text x="80" y="340" fill="${T.mute}" font-size="14" font-family="Georgia,serif">Fictional endpoints. Say the surface before you say the distance.</text>`),
 notes:['Name both choices. Great circle: shorter on the sphere. Rhumb line: constant compass bearing.','On this example the endpoints share a latitude, so the rhumb line is the parallel. It is not the shorter path.','Fictional places. Not a route to fly.']},

{title:'Vector and raster, again',day:'Day 3',chapter:'Vector and raster',routes:'essential gis',
 lede:'The Day 1 glimpse, now as a choice you have to make before you combine layers.',
 svg:card('Two records, one question',`<p><b>Vector.</b> A shelter is a point. A road is a line. A flood zone is a polygon. You can ask “inside or outside?” and get a yes, a no, or a “the boundary is the question.”</p><p><b>Raster.</b> A cell holds a value: rain, a satellite brightness, a wind speed. You can ask “how much in this cell?” You cannot store a legal boundary as a blur of cells and pretend the blur is the deed.</p><p>To lay one on the other you need a shared coordinate system. Matching the file’s label is not the same as converting the coordinates. That is the next slide but one.</p><p>The six-page handout is the full lesson. It is not on this site. This is the course return, not a copy of every page.</p>`),
 notes:['Return to the plant from the end of Day 1.','Vector for the boundary question. Raster for the surface question.','Do not mix them until the coordinate system is named.','Say plainly that the handout is not pasted into this player.']},

{title:'Coordinates need a system',day:'Day 3',chapter:'Frames and sources',routes:'gis',
 lede:'(40, 30) is not a place until you say what the numbers mean.',
 svg:svg(`<line x1="80" y1="320" x2="420" y2="320" stroke="${T.ink}"/>
<line x1="80" y1="320" x2="80" y2="60" stroke="${T.ink}"/>
<circle cx="280" cy="170" r="6" fill="${T.red}"/>
<text x="292" y="166" fill="${T.red}" font-size="16" font-family="Georgia,serif">(40, 30)</text>
<text x="200" y="350" fill="${T.mute}" font-size="14" font-family="Georgia,serif">east, metres</text>
<text x="20" y="180" fill="${T.mute}" font-size="14" font-family="Georgia,serif" transform="rotate(-90 20 180)">north, metres</text>
<text x="440" y="120" fill="${T.ink}" font-size="15" font-family="Georgia,serif">Axes and units</text>
<text x="440" y="148" fill="${T.ink}" font-size="15" font-family="Georgia,serif">A datum</text>
<text x="440" y="176" fill="${T.ink}" font-size="15" font-family="Georgia,serif">A projection, if any</text>
<text x="80" y="40" fill="${T.gold}" font-size="14" font-family="Georgia,serif">Fictional grid. It locates nothing on Earth.</text>`),
 notes:['Forty metres east and thirty north, in this example only. Do not treat that order as every software’s order.','Without a datum and, if it is a flat map, a projection, the pair is a drawing, not a place.','This grid is invented. Say so.']},

{title:'Do not just relabel',day:'Day 3',chapter:'Frames and sources',routes:'gis',
 lede:'Changing the name of the coordinate system does not move the points. Converting the coordinates does.',
 svg:card('Two fictional layers',`<p>Layer A and layer B draw the same invented building, stored in two shifted local grids. On screen they miss.</p><p>If the file was simply mislabeled, and you know the true system, correcting the label is legitimate.</p><p>If you want the geometry in another system, you have to convert it. Typing the target name onto the old numbers leaves the points where they were.</p><p>After a real conversion, check the alignment. Agreement on screen is still not proof the source was accurate.</p>`),
 notes:['One sentence they can repeat: do not just change the label.','There is a real exception. A wrong label, when you know the right one, should be repaired. That is not a conversion.','The drawing is fictional. No datum shift from a real city.']},

{title:'Civil clocks are not longitude',day:'Day 3',chapter:'Frames and sources',
 lede:'A time-zone offset is a government rule. Multiply it by 15 and you do not get a city’s longitude.',
 svg:card('Checked against IANA 2026f, 8 Nov 2026',`<p><b>Ecuador.</b> Mainland clocks, UTC−5. Galápagos, UTC−6. One country, two civil times.</p><p><b>China.</b> Beijing time, UTC+8, is the civil standard shown on the clock map. Xinjiang time, UTC+6, is also used. Do not say every person in China keeps one clock.</p><p>The maps of those places, if you show them, are different scales. An offset is hours from UTC. It is not a meridian.</p>`),
 notes:['UTC is the shared reference. UTC+8 means eight hours ahead of it.','Do not multiply the legal offset by 15 and call the result the longitude of a city.','Ecuador’s two clocks, and China’s two uses, are the examples. Dates of the check stay in the sentence.']},

{title:'The same fifteen degrees',day:'Day 3',chapter:'Frames and sources',routes:'gis',
 lede:'The same angle, along two different parallels, is not the same distance.',
 svg:svg(`<circle cx="200" cy="200" r="120" fill="none" stroke="${T.mute}"/>
<path d="M200 200 L200 80 A120 120 0 0 1 260 110 Z" fill="${T.gold}" opacity=".35" stroke="${T.gold}"/>
<circle cx="480" cy="210" r="60" fill="none" stroke="${T.mute}"/>
<path d="M480 210 L480 150 A60 60 0 0 1 510 165 Z" fill="${T.blue}" opacity=".45" stroke="${T.blue}"/>
<text x="40" y="40" fill="${T.ink}" font-size="16" font-family="Georgia,serif">15° at the equator · about 1,668 km</text>
<text x="360" y="40" fill="${T.ink}" font-size="16" font-family="Georgia,serif">15° at 60° N · about 834 km</text>
<text x="40" y="360" fill="${T.mute}" font-size="14" font-family="Georgia,serif">Sphere, radius 6,371 km. Along the parallel, not the shortest path.</text>`),
 notes:['From above the pole, the 60-degree parallel has half the radius, because cosine of 60 is one half.','Same 15-degree slice, half the distance.','These are model kilometres on a sphere, not a survey. Longitude degrees shrink as you go north. Latitude degrees do not, in the same way.']},

{title:'Where the data come from',day:'Day 3',chapter:'Frames and sources',routes:'gis',
 lede:'A layer has a source, a date, and a job. Satellites, surveys, and a census do not answer the same question.',
 svg:card('Ask before you trust the color',`<p><b>Survey.</b> Picard’s rods, Mason’s chain. A length someone measured, with a unit and a repeat.</p><p><b>Satellite.</b> Gaia’s parallaxes. A census of stars with a published limit, not a picture of every star.</p><p><b>Census and archives.</b> A city’s location in a table is a representative point, not every address. A wind archive has an agency, an averaging time, and a unit.</p><p>No source is “the map.” The map is what you drew from the source.</p>`),
 notes:['Three drawers: survey, satellite, census or archive.','Each has a date and a unit. A missing date is a missing fact.','Gaia, the next slide, is the satellite you can drive.']},

{title:'Error travels',day:'Day 4',chapter:'Error',routes:'gis',
 lede:'A small mistake in a baseline, or in an angle, does not stay small. It rides into every later length.',
 svg:card('What to say before the decimals',`<p>Picard measured one line and computed the rest. An error in that line scales the network.</p><p>An error in an angle grows with distance. A tenth of a degree is a different number of kilometres in different places. The next slides make that concrete.</p><p>Extra digits do not shrink an error that was never measured. Agreement among repeats is not the same as agreement with the truth.</p>`),
 notes:['Error propagation, in one breath. The baseline error scales. The angle error grows with range.','Then you can show decimals, and the Key West tenth of a degree.','Do not promise a formula tonight unless someone asks. The idea is that the mistake travels.']},

{title:'More decimals',day:'Day 4',chapter:'Error',routes:'gis',
 lede:'Readings can agree with each other and still miss the reference. More digits are not new evidence.',
 svg:svg(`<circle cx="300" cy="190" r="5" fill="${T.ink}"/>
<text x="312" y="186" fill="${T.ink}" font-size="14" font-family="Georgia,serif">reference</text>
${[[40,20],[55,-10],[30,30],[48,8],[36,-16]].map(([dx,dy])=>`<circle cx="${230+dx}" cy="${140+dy}" r="4" fill="${T.red}"/>`).join('')}
<text x="80" y="300" fill="${T.gold}" font-size="18" font-family="Georgia,serif">25 m = 25.000000 m</text>
<text x="80" y="330" fill="${T.mute}" font-size="15" font-family="Georgia,serif">Same value. Not a new measurement.</text>`),
 notes:['The red points agree. They still miss the reference. That is precision without accuracy.','Writing more zeros does not move the point.','Fictional positions. No receiver, no confidence percentage.']},

{title:'A tenth of a degree',day:'Day 4',chapter:'Error',routes:'gis',
 lede:'Near Key West, a tenth of a degree of latitude is about 11 kilometres. A scale picture, not a forecast.',
 svg:card('Not a cone and not a storm',`<p>The reference in this drawing is near 24.55° N, 81.8° W. It is not a shelter and not a storm centre.</p><p>On the WGS 84 ellipsoid, the step to 24.65° N at the same longitude is about 11.1 km.</p><p>The circle uses that distance as a radius so the room can see it. It is not a claim that every direction is a tenth of a degree of longitude.</p><p>Longitude degrees at this latitude are a different length. Do not swap them.</p>`),
 notes:['Latitude, near this place, about 11 km for a tenth of a degree.','Say “about,” and say it is latitude.','The circle is a ruler, not a forecast cone.']},

{title:'Buffer and overlay',day:'Day 4',chapter:'Spatial operations',routes:'essential gis',
 lede:'A buffer is a band around a line. An overlay asks what falls on top of what. The shelter model is both, in motion.',
 svg:svg(`<line x1="80" y1="180" x2="300" y2="180" stroke="${T.ink}" stroke-width="2"/>
<rect x="80" y="150" width="220" height="60" fill="${T.red}" opacity=".25"/>
<text x="80" y="130" fill="${T.red}" font-size="16" font-family="Georgia,serif">buffer · the edge, plus a band</text>
<polygon points="400,120 520,140 500,240 380,220" fill="${T.blue}" opacity=".35" stroke="${T.blue}"/>
<polygon points="450,100 580,160 540,270 420,200" fill="${T.gold}" opacity=".3" stroke="${T.gold}"/>
<text x="380" y="320" fill="${T.gold}" font-size="16" font-family="Georgia,serif">overlay · where they both are</text>
<text x="40" y="360" fill="${T.mute}" font-size="14" font-family="Georgia,serif">The band is not a probability. The overlap is not a verdict.</text>`),
 notes:['Buffer: the crisp line becomes a strip. That is what the shelter sliders do to the hazard edge.','Overlay: wind, surge, rain, and roads, looked at together. A wind category is not the whole stack.','Neither drawing is a safety ruling. The exercise comes after the warnings.']},

{title:'Rate and total',day:'Day 4',chapter:'Wind and warnings',
 lede:'Speed says how fast. Distance says how much. One hour at 20 miles an hour, then one hour at 40.',
 svg:card('A fictional journey',`<p>First hour: 20 miles. Second hour: 40 miles. Total: 60 miles.</p><p>The area under a speed graph is the distance, because miles per hour times hours is miles.</p><p>Do not compare the height of a speed chart with the height of a distance chart. They are different quantities.</p>`),
 notes:['Rate, then total. 20 plus 40 is 60.','Say the units cancel.','This is not a storm yet. It is the habit of asking which quantity the axis is.']},

{title:'Double each side',day:'Day 4',chapter:'Wind and warnings',
 lede:'Double the edge. Length doubles. Area becomes four times. Volume becomes eight times.',
 svg:card('1 metre to 2 metres',`<p>Length: 1 m → 2 m. Two times.</p><p>Area: 1 m² → 4 m². Two rows of two.</p><p>Volume: 1 m³ → 8 m³. Two layers of four. You cannot see all eight from one corner. Do not count the painted faces as the volume.</p><p>These are different quantities. They do not share a podium.</p>`),
 notes:['Two, four, eight. Say it with the squares, not with a slogan.','m on this slide is metres, not minutes.','The wind slides are the same habit: speed used twice is not speed used once.']},

{title:'Twice the wind',day:'Day 4',chapter:'Wind and warnings',routes:'gis',
 lede:'Twice the speed, four times the illustrative drag, when density, area, and the drag coefficient stay fixed.',
 svg:card('100 miles per hour to 200',`<p>Drag depends on speed times speed. Two times two is four.</p><p>The straight line on a chart of “times baseline” is the speed ratio. The curve is the force ratio.</p><p>This is not a damage prediction. A broken building is not the same shape, and the coefficient need not stay fixed.</p>`),
 notes:['Hold the other three things still, or do not say “four times.”','Speed is the straight line. Force is the square.','No hurricane death toll from this curve.']},

{title:'Twenty percent faster',day:'Day 4',chapter:'Wind and warnings',
 lede:'120 is not 20 percent more force. 120 is 20 percent more speed. The force ratio is 1.2 times 1.2.',
 svg:card('Baseline fixed at 100 mph',`<table><tr><th>Wind</th><th>Times the force</th><th>More than baseline</th></tr>
<tr><td>100</td><td>1.00</td><td>the baseline</td></tr>
<tr><td>120</td><td>1.44</td><td>44% more</td></tr>
<tr><td>140</td><td>1.96</td><td>96% more</td></tr>
<tr><td>160</td><td>2.56</td><td>156% more</td></tr>
<tr><td>180</td><td>3.24</td><td>224% more</td></tr></table>
<p>1.44 times means the original amount plus 44 percent. It does not mean 144 percent more.</p>`),
 notes:['Work 120 from the top. 120 divided by 100 is 1.2. 1.2 squared is 1.44. Subtract 1. That is 44 percent more, not 144.','Every row holds density, area, and the coefficient fixed.','These are model ratios, not measured wreckage.']},

{title:'Not always exponential',day:'Day 4',chapter:'Wind and warnings',
 lede:'A curve that bends upward is not therefore exponential. Ask what the rule does at equal steps.',
 svg:card('Equal input steps',`<p><b>Square.</b> 1, 4, 9, 16. The gaps are 3, then 5, then 7. The multiplier is not constant.</p><p><b>Double.</b> 2, 4, 8, 16. Each step multiplies by 2.</p><p>At the third step the double is still below the square. At the fourth they meet. One crossing does not name the rule.</p><p>Wind force was the square, speed times speed. Do not call that exponential.</p>`),
 notes:['Square adds growing gaps. Exponential multiplies by the same factor.','Both can bend upward. The bend is not the name.','Point back at the wind slide. That one was the square.']},

{title:'Force is not power',day:'Day 4',chapter:'Wind and warnings',
 lede:'Double the speed. Illustrative drag force becomes four times its own baseline. The power in the flow becomes eight times its own baseline.',
 svg:card('Different quantities',`<p>Force is a push, in newtons. With density, area, and coefficient fixed, speed enters twice: 2 × 2 = 4.</p><p>Power in the wind is energy per second, in watts. Speed enters three times: 2 × 2 × 2 = 8. More air crosses the area each second, and each bit of air carries more energy.</p><p>Eight times the flow is not eight times the electricity from a turbine, and it is not eight times the damage.</p>`),
 notes:['Four for force, eight for flow power. Each compared with its own baseline.','Do not put newtons and watts on one axis and call the taller bar the winner.','No turbine advice. No damage number.']},

{title:'Equal gaps, equal factors',day:'Day 4',chapter:'Wind and warnings',
 lede:'On a log scale, equal gaps mean equal factors. The numbers did not change. The ruler did.',
 svg:svg(`<text x="40" y="70" fill="${T.gold}" font-size="16" font-family="Georgia,serif">Log scale · ×10 each gap</text>
<line x1="40" y1="100" x2="560" y2="100" stroke="${T.gold}"/>
<text x="40" y="130" fill="${T.ink}" font-size="16" font-family="Georgia,serif">1</text>
<text x="200" y="130" fill="${T.ink}" font-size="16" font-family="Georgia,serif">10</text>
<text x="360" y="130" fill="${T.ink}" font-size="16" font-family="Georgia,serif">100</text>
<text x="520" y="130" fill="${T.ink}" font-size="16" font-family="Georgia,serif">1000</text>
<text x="40" y="200" fill="${T.blue}" font-size="16" font-family="Georgia,serif">Linear scale · equal gaps add</text>
<line x1="40" y1="230" x2="560" y2="230" stroke="${T.blue}"/>
<text x="40" y="260" fill="${T.ink}" font-size="16" font-family="Georgia,serif">0</text>
<text x="170" y="260" fill="${T.ink}" font-size="16" font-family="Georgia,serif">250</text>
<text x="300" y="260" fill="${T.ink}" font-size="16" font-family="Georgia,serif">500</text>
<text x="430" y="260" fill="${T.ink}" font-size="16" font-family="Georgia,serif">750</text>
<text x="520" y="260" fill="${T.ink}" font-size="16" font-family="Georgia,serif">1000</text>
<text x="40" y="330" fill="${T.mute}" font-size="15" font-family="Georgia,serif">1, 10, and 100 sit near zero on the linear ruler. That crowding is honest.</text>`),
 notes:['Top ruler: each step multiplies by ten, so the marks are evenly spaced.','Bottom ruler: each step adds the same amount. 1 and 10 are crowded near the start. Do not “fix” that by spreading them.','A log ruler has no zero. Say that before someone asks where the origin went.']},

{title:'Before comparing winds',day:'Day 4',chapter:'Wind and warnings',routes:'gis',
 lede:'The same number of knots is not the same wind. Ask who averaged it, and for how long.',
 svg:card('Agency conventions in NOAA’s IBTrACS archive',`<table><tr><th>Agency</th><th>Wind</th><th>Averaging</th><th>Unit</th></tr>
<tr><td>NHC · U.S.</td><td>sustained</td><td>1 minute</td><td>kt</td></tr>
<tr><td>JTWC · U.S.</td><td>sustained</td><td>1 minute</td><td>kt</td></tr>
<tr><td>JMA · Japan</td><td>sustained</td><td>10 minutes</td><td>kt</td></tr>
<tr><td>BoM · Australia</td><td>sustained</td><td>10 minutes</td><td>kt</td></tr></table>
<p>A gust is a short peak, not this sustained wind. There is no universal multiplier from one agency’s number to another’s. A knot is one nautical mile per hour.</p>`),
 notes:['Read the row before you compare two storms.','One-minute and ten-minute sustained winds are different questions.','Do not invent a conversion factor. Say there isn’t a universal one.']},

{title:'The wire outruns the storm',day:'Day 4',chapter:'Wind and warnings',routes:'gis',
 lede:'A message can arrive before the weather does. The wire does not, by itself, make the warning true or heeded.',
 svg:card('A network, not a storm track',`<p>Observers, a wire, a comparison, a warning. The storm is drawn only to show that it moves on its own clock.</p><p>1870: coordinated U.S. Signal Service observations. 1891: the work moves to the civilian Weather Bureau.</p><p>This is not the world’s first weather telegram, and the arrows are not historical wire routes.</p>`),
 notes:['Fast news is not a correct forecast.','Give the two dates, and no more institution than you can say cleanly.','The diagram is a mechanism. Not a map of a particular hurricane.']},

{title:'Viñes and a warning',day:'Day 4',chapter:'Wind and warnings',h1:'Viñes and a warning',
 lede:'Separate clues can support one inference. The drawing is not his log.',
 svg:card('Belén Observatory, Havana · 11 September 1875',`<p>Father Benito Viñes issued a hurricane warning for Cuba that day. Pressure trend, wind direction, and cloud motion are different clues, not three copies of one fact.</p><p>The curves on a teaching slide of this idea are not his traces, and the arrows are not his message routes.</p><p>Keep this 1875 warning separate from Galveston in 1900.</p>`),
 notes:['Date, place, warning. Then stop inventing his worksheet.','Three clues, one inference.','Do not give him the Galveston forecast. That is the next story, and it is a different one.']},

{title:'A warning is not safety',day:'Day 4',chapter:'Wind and warnings',
 lede:'Galveston, 8 September 1900. Messages arrived. Warnings circulated. A house people treated as shelter still failed.',
 svg:card('Cline’s account, not the whole disaster',`<p>Isaac Cline’s report says messages came from Washington on 4–8 September and that warnings were spread by telephone and by voice.</p><p>People sheltered in his house. The house collapsed. Warnings and some movement were not the same thing as a safe place.</p><p>He is a participant, writing after a terrible loss. His sentences are his. They are not an independent audit of the whole storm.</p><p>No death toll on this slide. The point is the gap between a warning and safety.</p>`),
 notes:['Three steps: reports, warnings, shelter. The third one failed in his own house.','Do not flatten this into “there was no warning.”','Do not quote a casualty number you have not put on the slide.']},

{title:'What would change the decision?',day:'Day 4',chapter:'The decision',routes:'gis',ask:true,
 lede:'A mapped shelter sits just outside a mapped hazard edge. What extra evidence would change the call? Discuss before the map.',
 notes:['No map yet. Three prompts to plant: where exactly, valid when, and what changed.','The next slide is the working exercise. The coast is real. Everything else about the storm is fictional.','Do not give a verdict on this slide.']},

{title:'Better questions',day:'Day 4',chapter:'The decision',
 lede:'From a shadow, a baseline, and a clock, to a question a map still has to answer.',
 svg:svg(`<text x="60" y="90" fill="${T.gold}" font-size="22" font-family="Georgia,serif">Shadow</text>
<text x="60" y="140" fill="${T.gold}" font-size="22" font-family="Georgia,serif">Baseline</text>
<text x="60" y="190" fill="${T.gold}" font-size="22" font-family="Georgia,serif">Clock</text>
<text x="60" y="260" fill="${T.ink}" font-size="28" font-family="Georgia,serif">A better question</text>
<text x="60" y="320" fill="${T.mute}" font-size="16" font-family="Georgia,serif">Source, frame, unit, uncertainty, and the next check.</text>`),
 notes:['Recap in four words. Shadow, baseline, clock, question.','The question is what the map is allowed to decide, and when it expires.','The last slide asks which idea to revisit. There is no right answer.']},

{title:'Which idea next?',day:'Day 4',chapter:'The decision',ask:true,
 lede:'Which idea should we revisit? Shadow, baseline, clock, or a better question. Pick one for next time. There is no scoring.',
 body:'<ul class="facts"><li>A · Shadow</li><li>B · Baseline</li><li>C · Clock</li><li>D · A better question</li></ul>',
 notes:['Ask. Do not answer.','No picture. The four words are the whole menu.','If they pick one, that is the opening of the next session, not a grade.']}
];

const ORDER=[
'Cover','Course index','Title',
'One ladder','Why thirty degrees','Baselines','Two eclipse reports','Assumptions beside the number','Far sunlight','Eratosthenes','Maps must bend',
'Latitude = star height','Longitude has no landmarks','The Isles of Scilly','The Longitude Act','Longitude is time','Lunar distances','A clock in the sky','Hours are slices','Longitude bingo','A pendulum cannot go to sea',"Harrison's job",'An arcminute and a dime','Polaris is not the pole','An uncorrected star','Correct the star','Phone and night sky','Local down','A quadrant reads a height','Latitude & Longitude',
'Kepler to Halley','Transit of Venus','Three stations','Vector or raster',
"Jupiter's moons",'Medicean Stars',"Callisto's stick",'Light needs time','Sky clocks and carried clocks','Moon mountains','Shadow and peak','How large is 2,100 miles?','Two thousand miles across','Picard measures France','Cook','Surveying is not consent','Mason & Dixon','A circle, a tangent, a parallel','Correct the trial line',"The escort's limit",
'Mental maps','Choose a projection','Straight is not shortest','Vector and raster, again','Coordinates need a system','Do not just relabel','Civil clocks are not longitude','The same fifteen degrees','Where the data come from','Gaia maps the Galaxy',
'Error travels','More decimals','A tenth of a degree','Buffer and overlay','Rate and total','Double each side','Twice the wind','Twenty percent faster','Not always exponential','Force is not power','Equal gaps, equal factors','Before comparing winds','The wire outruns the storm','Viñes and a warning','A warning is not safety','What would change the decision?','The shelter decision','The decision brief','Better questions','Which idea next?'
];

function apply(el, meta){
  if(!meta) return;
  if(meta.day) el.dataset.day=meta.day;
  if(meta.chapter) el.dataset.chapter=meta.chapter;
  if(meta.routes) el.dataset.routes=meta.routes;
  if(meta.kicker){const k=el.querySelector('.kicker'); if(k) k.textContent=meta.kicker;}
  if(meta.h1){const h=el.querySelector('h1'); if(h && !h.id) h.textContent=meta.h1;}
  const title=el.dataset.title;
  if(meta.topics) window.KIMI_TOPICS[title]=meta.topics;
  if(meta.notes) window.KIMI_NOTES[title]=meta.notes;
}
function build(item){
  const el=document.createElement('section');
  el.className='slide native';
  el.dataset.title=item.title;
  el.dataset.fx='fade';
  const stage=item.ask
    ? '<div class="stage sheet ask"><div class="ask-only"><strong>No picture on this slide.</strong><span>Answer from memory. Any graphic waits until the answer.</span></div></div>'
    : `<div class="stage sheet">${item.svg||''}</div>`;
  el.innerHTML=`<div class="text"><p class="kicker"></p><h1></h1><p class="lede"></p>${item.body||''}</div>${stage}`;
  el.querySelector('h1').textContent=item.h1||item.title;
  el.querySelector('.lede').textContent=item.lede||'';
  el.querySelector('.kicker').textContent=[item.day,item.chapter].filter(Boolean).join(' · ');
  return el;
}
window.KIMI_INSTALL=function(deck){
  const by=new Map();
  [...deck.querySelectorAll(':scope > .slide')].forEach(s=>by.set(s.dataset.title,s));
  const made=new Map(NEW.map(item=>[item.title,item]));
  ORDER.forEach(title=>{
    let el=by.get(title);
    const item=made.get(title);
    if(!el && item){el=build(item); by.set(title,el);}
    if(!el) return;
    deck.appendChild(el);
    apply(el, META[title]||item);
    if(item) apply(el, item);
  });
  const sub=deck.querySelector('.cover-text .sub');
  if(sub) sub.textContent='A four-day course in measurement, mapping, and decisions';
  const titleSlide=by.get('Title');
  if(titleSlide){
    const lede=titleSlide.querySelector('.lede');
    if(lede) lede.textContent='The four-day index is the previous slide. These are the working models. Drag, slide, press play.';
  }
};
})();
