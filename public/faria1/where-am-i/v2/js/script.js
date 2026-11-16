/* script.js — the speaker script, carried over from v1 (each [click] marks a beat). Beats point at a section and segment. */
window.NOTES = {
 "title": {
  "script": "Good morning. Every day in disaster work we drop pins: a shelter, a damaged home, a family that needs a cot. Every one of those pins is just two numbers. Today is the story of how humanity learned to write those two numbers down — and what it cost before we could.",
  "cues": [
   "Title. Globe turns; the readout shows the two numbers under the crosshair."
  ]
 },
 "scilly": {
  "script": "October 1707. Admiral Sir Cloudesley Shovell is bringing the British fleet home from the Mediterranean, through days of storms and cloud. On the evening of the 22nd, his navigators believe they are in safe water, west of Brittany, heading into the English Channel. [click] That is where they think they are. [click] This is where they really are — farther north, heading straight for the Isles of Scilly. [click] Around eight at night, in the dark, the flagship Association and three more ships hit the Western Rocks. [click] Four ships. Estimates of the dead run from over 1,300 to about 2,000 men — as many as 2,000. One of the worst disasters in Royal Navy history.",
  "cues": [
   "Dark sea; the fleet sails in from the south-west.",
   "Gold ghost fleet: where they believed they were.",
   "Coral fleet: where they really were, and the gap.",
   "Camera dives into Scilly; the fleet drifts onto the Western Rocks.",
   "The toll: four ships; estimates of the dead run from over 1,300 to about 2,000."
  ]
 },
 "why": {
  "script": "This engraving was made about thirty years later. Historians still argue about everything that went wrong that night — bad charts, poor compasses, bad weather. But underneath it all is one simple problem. [click] Sailors had a way to find their latitude — how far north they were — whenever they could see the sky. [click] But nobody on Earth had a reliable way to find longitude at sea — how far east or west. [click] A position takes two numbers. In 1707, at sea, one of them was a guess. So let's take them one at a time, starting with the easy one.",
  "cues": [
   "Engraving of the wreck.",
   "Latitude: they had a way.",
   "Longitude: they did not.",
   "Two numbers — one was missing."
  ]
 },
 "polaris": {
  "script": "Latitude first, because nature hands it to us. The Earth spins on an axis; the two ends are the poles. [click] Exactly halfway between them is the equator. Nobody had to vote on that — it is nature's zero. [click] Now put a person on the globe. Their horizon is flat; it just touches the Earth where they stand. [click] Polaris, the North Star, sits almost exactly above the North Pole, so far away that its light arrives in parallel lines. [click] Measure how high Polaris is above your horizon… [click] …and you have measured your latitude. Those two gold angles are always equal. [click] At the equator, Polaris sits right on the horizon. [click] At the North Pole, it is straight overhead. [click] And in London, it is 51 and a half degrees up. That's latitude: look up, measure one angle. (Optional: drag the person or the tiny slider to show any latitude.)",
  "cues": [
   "Globe spins on its axis; the poles.",
   "Equator: halfway between the poles — latitude 0°.",
   "A person at 39° N; their flat horizon.",
   "Polaris above the pole; its light arrives in parallel lines.",
   "The angle of Polaris above the horizon.",
   "The same angle at Earth’s centre: latitude. Equal.",
   "Walk to the equator: Polaris on the horizon.",
   "Walk to the North Pole: Polaris overhead.",
   "Back to London, 51.5° — slider live."
  ]
 },
 "fist": {
  "script": "You can do this tonight in a parking lot. Hold your fist out at arm's length: it covers about ten degrees of sky. [click] Now stack fists from the horizon up to Polaris. [click] From Washington, it's about four fists — call it 39 degrees — and Washington is at 39 degrees north. Rough — but sailors did the same thing with proper instruments, measuring the angle far more precisely.",
  "cues": [
   "One fist at arm’s length ≈ 10° of sky.",
   "Stack fists from the horizon toward Polaris.",
   "About four fists ≈ 39°: you are near 39° N."
  ]
 },
 "grid": {
  "script": "Two families of lines. Parallels — lines of latitude — run east–west, like rungs on a ladder. [click] Meridians — lines of longitude — run from pole to pole. [click] Unroll the globe and the lines become a grid. [click] Think of a Bingo card. Latitude calls the row; longitude calls the column. Row 38.9 north, column 77 west: Washington. [click] Calling the row was easy — just look at Polaris. Calling the column was the hard part. That is what killed Shovell's sailors.",
  "cues": [
   "Parallels: lines of latitude, east–west.",
   "Meridians: lines of longitude, pole to pole.",
   "The globe unrolls into a flat grid.",
   "Bingo: latitude calls the row, longitude the column.",
   "Calling the column is the hard part."
  ]
 },
 "twoships": {
  "script": "Two ships at the same latitude. One is at London, 51 and a half north. The other is about thirteen hundred miles to the west, still at 51 and a half north. Ask Polaris where they are, and it gives exactly the same answer. Latitude can't tell them apart. [click] But the Sun can. When the Sun is highest over London, it's local noon there. Out west, the Sun is still climbing. [click] Two hours later, it's noon at the western ship. [click] Same latitude, different local noon. Longitude isn't hidden in the stars' height. It is hidden in time.",
  "cues": [
   "Two positions on 51.5° N: Polaris reads the same.",
   "Sun highest at London: local noon; western ship is still in the morning.",
   "Two hours later: local noon reaches the western ship.",
   "Same latitude. Different local noon."
  ]
 },
 "clockearth": {
  "script": "Let's look down on the North Pole. [click] The Earth makes one turn in a day: 360 degrees in 24 hours. [click] Divide that turn like a clock. Twenty-four slices, each one hour wide. [click] Each slice is fifteen degrees. [click] Here is Greenwich, London's home meridian, at zero. London sees noon first. [click] Two hours later, as Earth turns, the western ship sees noon. Two slices: thirty degrees. [click] Stand on that ship when your Sun is highest. Your local time is noon. If a clock from London says two in the afternoon, you are two hours — thirty degrees — west of home. [click] So the problem becomes beautifully simple: to know your longitude, you must carry home time. How do you do that on a ship that rolls, pitches, gets hot, gets cold, and spends months out of sight of land?",
  "cues": [
   "Globe facing Europe.",
   "Globe flips to a view from above the North Pole.",
   "24 one-hour slices peel out.",
   "One hour = 15°.",
   "Greenwich zero and London’s noon.",
   "Earth turns two hours: the western ship reaches noon.",
   "On the ship: local noon, London clock 14:00 → 30° west.",
   "Punchline: carry home time."
  ]
 },
 "jupiter": {
  "script": "Two ways to carry home time. The first: read it off the sky. In 1610 Galileo turned his new telescope on Jupiter and found four moons. This is his own notebook page. [click] They circle Jupiter like hands on a clock. The innermost, Io, laps every 42 and a half hours. [click] Every lap, Io slips into Jupiter's shadow and blinks out — and everyone on Earth who is watching sees it at the same instant. It's a clock everybody can read. [click] So astronomers printed tables: \"Io disappears at such-and-such a time in Paris.\" If you see it at 9:33 your local time and the table says 10:00 Paris time, you are 27 minutes — about 7 degrees — west of Paris. [click] On land, it worked beautifully. On a rolling ship, holding a long telescope steady on a tiny moon was nearly impossible.",
  "cues": [
   "Galileo’s 1610 notebook; Jupiter and four moons.",
   "The moons orbit; Io laps every 42.5 hours.",
   "Io slips into Jupiter’s shadow: the same instant for everyone.",
   "Two observers: local times differ by 27 min ≈ 7°.",
   "Great on land; nearly impossible at sea."
  ]
 },
 "france": {
  "script": "The sky clock worked on land — so France used it to remeasure itself. From 1679, the astronomers Jean Picard and Philippe de La Hire travelled the coasts timing Jupiter's moons. On the left is the map they produced: the old outline, and their corrected coastline inside it. [click] Watch the west coast. Brittany slides east — by about a degree and a half in places. France got smaller. [click] The story goes that Louis XIV complained his astronomers had taken more of France than his enemies ever had. It's a famous story; I can't promise he said it. But it tells you how much the maps were off.",
  "cues": [
   "Old outline of France vs. the 1693 corrected map.",
   "The west coast slides east: France shrinks.",
   "The king’s complaint — told as a story."
  ]
 },
 "moonact": {
  "script": "At sea, astronomers tried using our own Moon as the clock hand. The Moon drifts across the stars by about its own width every hour. [click] Measure the angle between the Moon and a bright star, look it up in tables, and you can work out London time. In principle. In practice it meant hours of arithmetic, from a deck that will not hold still. [click] In 1714 Parliament passed the Longitude Act: up to twenty thousand pounds — a fortune — for a method that worked at sea, to within half a degree. [click] And a self-taught carpenter from Yorkshire, John Harrison, decided the answer wasn't in the sky at all. It was a clock.",
  "cues": [
   "The Moon drifts across the stars.",
   "Lunar distance: an angle, then hours of arithmetic on a rolling deck.",
   "1714 Longitude Act: up to £20,000.",
   "John Harrison, carpenter and clockmaker."
  ]
 },
 "h4": {
  "script": "This is H4, Harrison's sea watch — about five inches across. It ticks five times a second. In November 1761 his son William sailed with it from Portsmouth to Jamaica: 81 days at sea. [click] So — vote. In the chat, or a show of hands: how much time do you think it lost in 81 days? (Use the tiny + buttons to tally chat votes if you like.) [click] About five seconds. Five seconds in 81 days. [click] The Earth turns fifteen arc-seconds every second, so five seconds of time is about one and a quarter arc-minutes of longitude — roughly a mile on the water. The prize needed half a degree, thirty arc-minutes. H4 beat it by more than twenty times. [click] And the punchline you'd expect: the Board of Longitude never handed over the £20,000. Harrison was paid in pieces — £10,000 in 1765 and, after King George III took his side, £8,750 from Parliament in 1773, when he was 80. About £18,750 toward the prize. No one ever collected the full award.",
  "cues": [
   "H4 sails to Jamaica, 81 days.",
   "THE VOTE: how much did it lose? (no answer shown)",
   "Reveal: about 5 seconds.",
   "5 s → 1¼′ of longitude ≈ a mile, vs. the 30′ allowed.",
   "The money: £18,750 in pieces; full prize never paid."
  ]
 },
 "zero": {
  "script": "Now a strange thing. Latitude has a natural zero — the equator. Longitude doesn't. Every meridian runs pole to pole; not one is special. [click] So, a question for the room: if you were in charge, where would you put zero? Your hometown? Your chapter headquarters? Shout it out, or drop it in the chat. [click] People have answered differently. Around AD 150, Ptolemy counted from the Fortunate Isles — the Canary Islands — the western edge of his known world. [click] France counted from Paris. [click] And in 1675 King Charles II founded the Royal Observatory at Greenwich, in the words of its founding warrant, \"for the finding out of the so much desired longitude of places.\" Every country had a candidate. Someone had to choose.",
  "cues": [
   "Equator is natural; meridians are all equal.",
   "Ask the room: where would you put zero?",
   "Ptolemy: the Canary Islands.",
   "Paris.",
   "Greenwich, 1675."
  ]
 },
 "vote1884": {
  "script": "In October 1884, delegates gathered in Washington, D.C., at the International Meridian Conference, to pick one zero for the whole world. Here are the nations that voted — twenty-five of them, from Hawaii to Japan. [click] Greenwich won: 22 votes in favor. By then most of the world's shipping already used charts based on Greenwich. [click] One vote against — San Domingo, today's Dominican Republic. Two abstentions: France and Brazil. [click] France did not give up easily. Its national survey kept measuring longitude from the Paris meridian — often in grads, 400 to a full circle instead of 360 degrees — right up to December 31, 1999. On January 1, 2000, the Greenwich-based RGF93 became France's sole official system. Zero really was a choice.",
  "cues": [
   "October 1884, Washington: the 25 voting nations on a map.",
   "The dots fly into a tally: 22 for Greenwich.",
   "1 against (San Domingo); France and Brazil abstain.",
   "France counts from Paris, in grads, until 31 Dec 1999."
  ]
 },
 "gpszero": {
  "script": "One plot twist, for the GIS people. If you stand on the famous brass line at Greenwich with your phone, it won't say zero. [click] GPS zero — the WGS 84 meridian — runs about 102 metres, 335 feet, east of the brass line. [click] That's a little longer than a football field. Nobody moved anything: the old line was set by a telescope aimed using local gravity, which tilts very slightly at Greenwich; GPS measures from the centre of the Earth. Two good answers, 102 metres apart.",
  "cues": [
   "The brass line at Greenwich.",
   "GPS (WGS 84) zero: 102 m east.",
   "To scale: a 100-yard football field."
  ]
 },
 "gps": {
  "script": "So how does your phone know where it is? In February 1978 the first GPS test satellite went up — Navstar 1. Look at how high it is: this is drawn to scale. Earth, and an orbit 20,200 kilometres up. [click] By 1995 GPS was declared fully operational. Today there are 32 active satellites in six orbital planes, each one circling the Earth twice a day. [click] And here is the beautiful part. Each satellite carries atomic clocks, and all it does is broadcast, nonstop: who it is, where it is, and exactly what time it is. A sky full of Harrison's clocks.",
  "cues": [
   "1978: Navstar 1, one orbit, drawn to scale.",
   "1995 → today: 32 satellites, six planes, twice a day around Earth.",
   "Every satellite broadcasts its time: pulses ripple out."
  ]
 },
 "fix": {
  "script": "How does a phone turn those time signals into a place? Take one satellite. Its signal arrives a tiny fraction of a second after it was sent — about seven hundredths of a second. Multiply by the speed of light and you have a distance: about 21,000 kilometres. Every point on Earth at that distance from the satellite makes a ring. You are somewhere on this ring. [click] A second satellite gives a second ring. Two rings cross in two places. [click] A third ring picks one of them. That's your spot. [click] But there's a catch. Your phone's clock is cheap. If it's off by just one thousandth of a second, every distance is off by 300 kilometres — and the rings no longer meet. [click] So the receiver listens to a fourth satellite. With four, it can solve for the place and its own clock error at the same time. The rings snap together. Four satellites: one spot, and the exact time. [click] And it works anywhere: Seattle, Denver, Chicago, Houston, New York — different satellites overhead every time, the same answer in under a second.",
  "cues": [
   "One satellite: delay → distance → a ring on the ground.",
   "Two rings cross at two points.",
   "Three rings: one spot.",
   "The catch: a phone clock 1/1000 s off → rings miss by 300 km.",
   "Fourth satellite: solves the clock — rings snap to one spot.",
   "Anywhere: Seattle, Denver, Chicago, Houston, New York…"
  ]
 },
 "pin": {
  "script": "Now bring it home. Here's a pin in Field Maps: [click] a family in Fort Myers whose house took water tonight. They need cots. That pin — the thing that sends a volunteer, a truck, a shelter bed — is just two numbers. [click] Latitude and longitude. [click] The stars gave us latitude. Harrison's clock gave us longitude. And a sky full of clocks answers Shovell's question — where am I? — in under a second. [click] Thank you. I'd love to take your questions.",
  "cues": [
   "Camera dives from the whole Earth to SW Florida.",
   "Field Maps-style pin and request card.",
   "Just two numbers.",
   "The callback: stars, clock, a sky full of clocks.",
   "Thank you — questions."
  ]
 },
 "nullisland": {
  "script": "Null Island is the point 0 degrees, 0 degrees — open ocean in the Gulf of Guinea, more than 500 km off the coast of Ghana. [click] When a geocoder fails, many tools quietly write zeros, so bad records pile up there. [click] Before you map, filter out exact (0, 0) points and look at why they failed.",
  "cues": [
   "0°, 0° in the Gulf of Guinea.",
   "Failed geocodes pile up at (0, 0).",
   "Filter them out."
  ]
 },
 "dateline": {
  "script": "Halfway around the world from Greenwich is 180 degrees. The International Date Line roughly follows it, bending around island nations so no country is split. [click] Cross it heading west, and the calendar jumps a day ahead; heading east, you get a day back.",
  "cues": [
   "180°, opposite Greenwich.",
   "Westbound: add a day."
  ]
 },
 "decimals": {
  "script": "How many decimal places should a coordinate have? Each one is ten times finer. One decimal place is about 11 kilometres — a town. Four is about 11 metres — a house. Five is about a metre — a person. [click] Six or more is usually false precision for field data: a phone GPS is typically good to a few metres. These distances are north–south; east–west they shrink toward the poles.",
  "cues": [
   "Decimal places table.",
   "False precision warning."
  ]
 },
 "nmile": {
  "script": "Why sailors love the nautical mile. Each degree is split into 60 arcminutes. [click] Along a meridian, one arcminute of latitude is one nautical mile — so on a chart, the latitude scale is a mileage scale. [click] Today the nautical mile is defined as exactly 1,852 metres, about 6,076 feet.",
  "cues": [
   "1° = 60 arcminutes.",
   "1 arcminute of latitude = 1 nautical mile.",
   "= 1,852 m exactly."
  ]
 }
};
