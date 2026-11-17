/* beats_act3.js — III · Longitude is time: two ships, the Earth as a clock. */
(function(){
const W = World, B = b => W.beat(b), H = W.BH, G = H.G, S = H.S, RAD = H.RAD;
const { gOrb, look, at, north, add, A3 } = H;
const fig = s => s; // figures are inline SVG strings

/* -------- two ships on one parallel -------- */
const twoP = { spin: 0, sunAz: 0, sunEl: -2, night: 1, clouds: .55, dim: 0, eq: 0, unroll: 0, even: 0, parAll: 0, merAll: 0, rowA: 0, colA: 0, merLon0: 0, merLon3: -30, mer0: 0, mer3: 0,
  slices: 0, sliceOff: 0, atmo: 1, mwS: .45, starsS: 1, expoS: 1, bloomS: 0, det: 0, moonlit: 0, sunVis: 0 };
const twoCam = gOrb(34, -26, 4.05, 0, { fov: 34, shift: [.24, -.01] });
B({ id: 'twoships', act: A3, title: 'Same latitude, two ships', sec: 'twoships', seg: 0, min: 0.35, env: 'space', dur: 6, xf: 2.4,
  fromCam: gOrb(30, -30, 3.9, 0, { fov: 34 }), cam: twoCam, p: Object.assign({}, twoP), show: ['ships2', 'par515'],
  labels: [{ a: G.at(51.5, 0), t: 'London · 51.5° N', side: 'r', cls: 'gold', d: 2.4 }, { a: G.at(51.5, -30), t: 'Ship · 51.5° N', side: 'l', cls: 'gold', d: 3 }],
  h: 'Polaris gives the same answer', l: 'Two ships, about 1,300 miles apart, both at 51.5° north.', tpos: 'tl', tcls: 'col', tdelay: 2.6,
  cue: 'Two positions on 51.5° N: Polaris reads the same for both.' });
B({ id: 'noonLondon', act: A3, title: 'Noon in London', sec: 'twoships', seg: 1, min: .35, dur: 5, cam: twoCam,
  p: { mer0: [1, 2.4, .6] }, show: ['ships2', 'par515'],
  labels: [{ a: G.at(51.5, 0), t: 'London · noon', side: 'r', cls: 'gold', d: 1.4 }, { a: G.at(51.5, -30), t: 'Ship · 10 a.m.', side: 'l', d: 2 }, { a: G.at(-4, 0), t: 'Sun overhead', cls: 'dim', side: 'r', d: 2.6 }],
  h: 'The Sun can tell them apart', hs: 1, l: 'Sun highest over London: local noon there. Out west, the Sun is still climbing.', tpos: 'tl', tcls: 'col', tdelay: 1.8,
  cue: 'Sun highest over London; the western ship is still in the morning.' });
B({ id: 'noonWest', act: A3, title: 'Two hours later', sec: 'twoships', seg: 2, min: .35, dur: 7, camEase: 'io',
  cam: gOrb(34, -26, 4.05, 30, { fov: 34, shift: [.24, -.01] }), p: { spin: [30, 7], mer0: [.35, 3], mer3: [1, 2.5, 4.4] }, show: ['ships2', 'par515'],
  labels: [{ a: G.at(51.5, 0), t: 'London · 2 p.m.', side: 'r', d: 5 }, { a: G.at(51.5, -30), t: 'Ship · noon', side: 'l', cls: 'gold', d: 5.4 }],
  h: 'Two hours later', l: 'Earth turns, and noon reaches the western ship.', tpos: 'tl', tcls: 'col', tdelay: 4.8,
  cue: 'Earth turns two hours: the terminator and noon sweep west to the ship.' });
B({ id: 'hiddenTime', act: A3, title: 'Longitude is hidden in time', sec: 'twoships', seg: 3, min: 0.35, dur: 5,
  cam: gOrb(38, -26, 4.25, 30, { fov: 34, shift: [.25, -.01] }), p: { mer0: .6, mer3: 1 }, show: ['ships2', 'par515'],
  h: 'Longitude is hidden <em>in time</em>', l: 'Same latitude. Different local noon.', tpos: 'tl', tcls: 'col', tdelay: 1.6,
  cue: 'Same latitude, different local noon: longitude is time.' });

/* -------- the Earth as a clock (looking down on the North Pole) -------- */
const lonLab = lon => lon === 0 ? '0° Greenwich' : Math.abs(lon) === 180 ? '180°' : Math.abs(lon) + '°' + (lon < 0 ? ' W' : ' E');
const ring = (spinFor, d = 0, only) => { const L = []; for (let lon = -150; lon <= 180; lon += 30){ if (only && !only.includes(lon)) continue;
  L.push({ a: G.at(24, lon, 1.01), t: lonLab(lon), cls: 'mono dim nodot', side: 't', d: d + (lon + 180) / 360 * .8, id: 'lon' + lon }); } return L; };
const polar = (spin, o = {}) => gOrb(87.5, -90, 5.3, spin, Object.assign({ fov: 34, shift: [.25, -.05] }, o));
const clockP = { spin: 30, sunAz: 30, sunEl: 0, mer0: 0, mer3: 0, 'o.ships2': 0, clouds: .45, mwS: .05, even: 0 };
B({ id: 'europe', act: A3, title: 'Look down on the North Pole', sec: 'clockearth', seg: 0, min: .3, dur: 5,
  cam: gOrb(42, 8, 4.0, 30, { fov: 34, shift: [.24, 0] }), p: Object.assign({}, clockP, { spin: [30, .1], sunAz: [30, .1] }),
  h: 'Earth is a clock', l: 'Let’s look down on the North Pole.', tpos: 'tl', tcls: 'col', tdelay: 2.2, cue: 'Globe facing Europe.' });
B({ id: 'pole', act: A3, title: '360° in 24 hours', sec: 'clockearth', seg: 1, min: 0.35, dur: 6.5, camEase: 'io',
  cam: polar(30, { via: undefined }), p: { spin: [30, .1] },
  labels: [{ a: G.at(90, 0, 1.01), t: 'North Pole', cls: 'dim', side: 'r', d: 4.6 }],
  h: 'One turn a day', l: '360 degrees in 24 hours.', tpos: 'tl', tcls: 'col', tdelay: 4.4, cue: 'The globe tilts to a view from above the North Pole.' });
B({ id: 'slices', act: A3, title: 'Twenty-four slices', sec: 'clockearth', seg: 2, min: 0.3, dur: 4.5, cam: polar(30),
  p: { slices: [.62, 3.2, .4], sliceOff: 0, even: [.22, 3] }, labels: ring(30, 1.2),
  h: 'Twenty-four slices', l: 'Divide the turn like a clock: each slice is one hour wide.', tpos: 'tl', tcls: 'col', tdelay: 1.6, cue: '24 one-hour slices.' });
/* -------- 2026-11-16 EUREKA sequence (Jeff: "This is eureka"): one hour = 15°, noon walks west across the US, the lone ship, carry home's time -------- */
const CONV = `It all comes from one fact: Earth turns 360° in 24 hours.
1 hour of time = 15° of longitude
4 minutes of time = 1°
1 minute of time = 15 arcminutes (15′)
4 seconds of time = 1 arcminute (1′)
1 second of time = 15 arcseconds (15″)
At the equator, 1′ of longitude is 1 nautical mile. So 1 minute of clock error is about 15 nautical miles, and 1 second is about a quarter mile. Farther from the equator, the meridians squeeze together and the distances shrink. At Greenwich's latitude they're only about 62% as big.
H4's 5-second error on the Jamaica voyage was 75″, about 1.25′ of longitude. That's roughly a nautical mile at the equator and a bit less on the way to Jamaica.`;
B({ id: 'fifteen', act: A3, title: 'One hour = 15°', sec: 'clockearth', seg: 3, min: .35, dur: 6, cam: polar(30, { d: 5.05 }),
  p: { slices: .45, spin: [45, 5.4, .5, 'io'], mer0: [1, 1.2], merLon0: [-15, 5.4, .5, 'io'] }, show: ['wedge15'], labels: ring(30, 0),
  say: 'Each slice is fifteen degrees. Watch the Sun stand still while the Earth turns underneath it. One hour passes, and noon slides fifteen degrees west, from Greenwich across that one gold slice. Three hundred sixty degrees divided by twenty-four hours: fifteen degrees, every hour.',
  h: '1 hour = 15°', hs: 2, l: '360 ÷ 24 = 15. Every hour of turning is fifteen degrees of longitude.', tpos: 'tl', tcls: 'col', tdelay: 1.2,
  cue: 'The globe turns one hour under a fixed Sun; the gold noon line sweeps the 15° slice.', notes: CONV });
const usCam = (o = {}) => gOrb(20, -86, 2.6, 45, Object.assign({ fov: 34, shift: [.2, -.25] }, o));
const merLabs = (d = 0) => [-75, -90, -105, -120].map((lon, i) => ({ a: G.at(50, lon, 1.012), t: Math.abs(lon) + '° W', cls: 'mono dim nodot', side: 't', d: d + i * .15, id: 'usm' + lon }));
const cityLab = { ny: { a: G.at(40.71, -74.01, 1.012), t: 'New York · 74° W · noon', side: 't', cls: 'gold' },
  phl: { a: G.at(39.95, -75.17, 1.012), t: 'Philadelphia · +5 min', side: 'r' },
  pit: { a: G.at(40.44, -80.0, 1.012), t: 'Pittsburgh · +24 min', side: 'l' },
  bna: { a: G.at(36.16, -86.78, 1.012), t: 'Nashville · +51 min', side: 't' },
  mem: { a: G.at(35.15, -90.05, 1.012), t: 'Memphis · 90° W · +64 min', side: 'b' },
  den: { a: G.at(39.74, -104.99, 1.012), t: 'Denver · 105° W · +2 h', side: 't' },
  la: { a: G.at(34.05, -118.24, 1.012), t: 'Los Angeles · 118° W · +3 h', side: 'l' } };
B({ id: 'nyNoon', act: A3, title: 'Noon in New York', sec: 'clockearth', seg: 3, min: .25, dur: 5.5, cam: usCam(), camEase: 'io',
  p: { slices: [0, 1.2], sunAz: [-29, 3.4, .2], merLon0: [-74, 3.4, .2], mer0: [.85, 1.5] }, show: ['usMer', 'cNY'], odelay: 2.6,
  labels: [Object.assign({ d: 3.4 }, cityLab.ny)].concat(merLabs(2.8)),
  say: 'Now come to a map we all know. Noon travels west across the Atlantic and reaches New York, seventy-four degrees west. The Sun is as high as it will get today.',
  h: 'Noon in New York', hs: 1, l: 'The Sun at its highest, 74° west of Greenwich.', tpos: 'tl', tcls: 'col scrim', tdelay: 2.4,
  cue: 'Fly to North America; the gold noon line arrives at New York. Faint meridians at 75°, 90°, 105°, 120° W.' });
B({ id: 'walkWest', act: A3, title: 'Noon walks west', sec: 'clockearth', seg: 3, min: .45, dur: 11, cam: usCam({ az: -87 + 45 }),
  p: { sunAz: [-73.5, 9.5, 1, 'lin'], merLon0: [-118.5, 9.5, 1, 'lin'], 'o.cPHL': [1, .5, 1.2], 'o.cPIT': [1, .5, 2.25], 'o.cBNA': [1, .5, 3.7], 'o.cMEM': [1, .5, 4.4], 'o.cDEN': [1, .5, 7.55], 'o.cLA': [1, .5, 10.4] },
  show: ['usMer', 'cNY', 'cPHL', 'cPIT', 'cBNA', 'cMEM', 'cDEN', 'cLA'],
  labels: [Object.assign({ d: 0 }, cityLab.ny), Object.assign({ d: 1.3 }, cityLab.phl), Object.assign({ d: 2.35 }, cityLab.pit), Object.assign({ d: 3.8 }, cityLab.bna), Object.assign({ d: 4.5 }, cityLab.mem),
    Object.assign({ d: 7.65 }, cityLab.den), Object.assign({ d: 10.5 }, cityLab.la)].concat(merLabs(0)),
  say: 'Earth keeps turning, and noon walks west, steadily. A few minutes after New York, it is noon in Philadelphia. Then Pittsburgh, Nashville, and just over an hour later, Memphis: fifteen degrees west. Two hours: Denver, thirty degrees. Three hours: Los Angeles, forty-five degrees. One hour, fifteen degrees, every time.',
  h: 'Noon walks west', hs: 1, l: 'One hour, fifteen degrees.', tpos: 'tl', tcls: 'col scrim', tdelay: .8, capT: 11.4,
  cue: 'The gold noon line slides west at Earth’s steady rate; each city lights as its noon arrives: Philadelphia +5 min, Pittsburgh +24, Nashville +51, Memphis +64, Denver +2 h, Los Angeles +3 h.',
  notes: `Every meridian has its own noon. Between New York and Memphis there are endless noons. Noon sweeps west at 1° every 4 minutes, 1′ every 4 seconds. At New York's latitude that is about 13 miles a minute, roughly 790 mph.
Until 1883 every town kept its own local noon, so there were hundreds of local times. On November 18, 1883, the 'Day of Two Noons', the railroads put the US on four standard time zones. Many towns resisted 'railroad time'. Congress didn't make time zones law until the Standard Time Act of 1918.
Before 1884 every country picked its own zero. On many American maps Denver was about 28° west — of Washington, D.C. (Naval Observatory, 77°03′ W of Greenwich), not Greenwich.
The railroads set their four time zones in 1883 on Greenwich-based meridians (75°, 90°, 105°, 120° W), one year before the 1884 International Meridian Conference in Washington. That head start helped Greenwich win the vote. France abstained and kept Paris until 1911.` });
B({ id: 'alone', act: A3, title: 'Alone at sea', sec: 'clockearth', seg: 3, min: .35, dur: 8, cam: gOrb(30, -146, 4.3, 45, { fov: 34, shift: [.22, -.02] }), camDur: 6.2, camEase: 'io',
  p: { sunAz: [-104, 5.4, .3, 'out'], merLon0: [-149, 5.4, .3, 'out'], mer0: [.22, 3, 2.8], 'o.loneShip': [1, 1.4, 4.2] }, show: ['loneShip'],
  labels: [{ a: G.at(32, -149, 1.012), t: 'You', cls: 'gold nodot', side: 'r', d: 5.2 }],
  say: 'But here is the catch. Take away the cities, the phones, the radio. Put yourself on one small ship in the middle of the Pacific. You can see your own noon: the Sun tells you that. What you cannot see is what time it is back home. And without home’s time, you cannot know how far west you have come.',
  h: 'Your noon, you can see.<br><em>Home’s time, you cannot.</em>', hs: 1, tpos: 'tl', tcls: 'col scrim', tdelay: 4.6, capT: 9,
  cue: 'Cities and labels fade; the camera drifts out over the empty Pacific to one small ship at its own noon.',
  notes: 'You only know how far you are from the others if you know their longitude, or their time. On land you could ask; at sea, with no communication, the only way to know home’s time is to carry it.\nThis ship sits at 149° W, 75° west of New York: when its Sun is highest, New York’s clock reads 5 p.m. Five hours × 15° = 75°.' });
const wCam3 = (az, el, d, o = {}) => Object.assign({ orb: true, c: [0, .12, 0], d, az, el, fov: 30 }, o);
B({ id: 'carryHome', act: A3, title: 'Carry home’s time', sec: 'clockearth', seg: 3, min: .25, env: 'studio', dur: 6, xf: 2.6,
  fromCam: wCam3(-4, 3, 7.6, { shift: [.2, 0] }), cam: wCam3(-4, 3, 6.2, { shift: [.2, 0], c: [0, .16, 0] }), drift: { az: .5 }, driftFor: 60,
  p: { h4open: [0, .01], h4spin: [0, .01], h4bg: [.55, .01], h4hr: [17, .01], h4glow: [1, 3, 1.2], blur: 0 },
  say: 'So the answer is simple to say and fiendishly hard to do: carry home’s time with you. A clock set to home, that keeps home’s time all the way across the ocean. Compare it with your own noon, and every hour of difference is fifteen degrees of longitude.',
  h: 'Carry home’s time <em>with you</em>.', hs: 1, tpos: 'bl', tdelay: 2.4, capT: 6,
  cue: 'A watch glows in the dark, its hands holding home time (5 o’clock). Bridges to Harrison and H4.',
  notes: 'Answer to the twist: a clock that carries home time. The hands show 5:00, New York time, while the ship sees noon: 5 h × 15° = 75° west. (Don’t name the watch or its accuracy here; that comes with H4 and the vote.)' });
B({ id: 'greenwichNoon', act: A3, title: 'Greenwich: zero', sec: 'clockearth', seg: 4, min: .25, env: 'space', xf: 2.4, dur: 4.5, fromCam: polar(30, { d: 5.6 }), cam: polar(30),
  p: { spin: [30, .01], sunAz: [30, .01], sunEl: [0, .01], merLon0: [0, .01], slices: [.45, 1.5], mer0: [1, 2], sunVis: 0, h4glow: [0, .01], h4hr: [-1, .01], h4bg: [1, .01] }, labels: ring(30, 0).concat([{ a: G.at(51.48, 0, 1.01), t: 'London · noon', cls: 'gold', side: 'r', d: 1.6 }]),
  h: 'Greenwich is zero', l: 'London’s home meridian. With the Sun on it, London sees noon.', tpos: 'tl', tcls: 'col', tdelay: 1.2, cue: 'Greenwich at zero; noon in London.' });
B({ id: 'turn2h', act: A3, title: 'Two hours later: 30°', sec: 'clockearth', seg: 5, min: 0.35, dur: 7, cam: polar(60),
  p: { spin: [60, 7], mer3: [1, 2, 4.6], merLon3: -30, mer0: .8 }, show: ['ships2', 'wedge30'], odelay: 4.4,
  labels: ring(60, 0).concat([{ a: G.at(51.48, 0, 1.01), t: 'London · 2 p.m.', side: 'r', d: 5 }, { a: G.at(51.5, -30, 1.01), t: 'Ship · noon', cls: 'gold', side: 'l', d: 5.6 }]),
  h: 'Two slices: 30°', l: 'Earth turns two hours. Now the western ship sees noon.', tpos: 'tl', tcls: 'col', tdelay: 5, cue: 'Earth turns two hours: the western ship reaches noon.' });
const clocks = (() => { // two plain clock faces: local noon on the ship, 2 p.m. by the London clock
  const face = (cx, hh, mm, name, gold) => { let s = `<circle cx="${cx}" cy="80" r="66" fill="none" stroke="rgba(232,228,220,.55)" stroke-width="1.4"/>`;
    for (let i = 0; i < 12; i++){ const a = i * 30 * RAD, r0 = i % 3 ? 60 : 55; s += `<line x1="${cx + Math.sin(a) * r0}" y1="${80 - Math.cos(a) * r0}" x2="${cx + Math.sin(a) * 66}" y2="${80 - Math.cos(a) * 66}" stroke="rgba(232,228,220,.6)" stroke-width="${i % 3 ? 1 : 1.6}"/>`; }
    const ha = ((hh % 12) + mm / 60) * 30 * RAD, ma = mm * 6 * RAD, c = gold ? '#F5D398' : '#E8E4DC';
    s += `<line x1="${cx}" y1="80" x2="${cx + Math.sin(ha) * 36}" y2="${80 - Math.cos(ha) * 36}" stroke="${c}" stroke-width="3.2" stroke-linecap="round"/>`;
    s += `<line x1="${cx}" y1="80" x2="${cx + Math.sin(ma) * 54}" y2="${80 - Math.cos(ma) * 54}" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/><circle cx="${cx}" cy="80" r="3" fill="${c}"/>`;
    s += `<text x="${cx}" y="178" text-anchor="middle" font-size="15" letter-spacing="2.5" style="text-transform:uppercase">${name}</text>`; return s; };
  return `<svg width="690" height="375" viewBox="0 0 460 250">${face(90, 12, 0, 'Sun overhead · 12:00', true)}${face(370, 14, 0, 'London clock · 14:00')}
    <text x="230" y="236" text-anchor="middle" class="ser" font-size="26" fill="#F5D398">2 h × 15° = 30° west</text></svg>`; })();
B({ id: 'onShip', act: A3, title: 'Local noon vs. London time', sec: 'clockearth', seg: 6, min: 0.35, dur: 5.5,
  cam: polar(60, { d: 5.0, shift: [-.27, -.05] }), p: { slices: .3, mer0: .6, mer3: 1 }, show: ['ships2', 'wedge30'],
  labels: [{ a: G.at(51.5, -30, 1.01), t: 'You · local noon', cls: 'gold', side: 'l', d: 2.8 }, { a: G.at(51.48, 0, 1.01), t: 'London · 2 p.m.', side: 'r', d: 3.2 }],
  fig: clocks, figpos: 'fp-r', figd: 2.6,
  h: 'Your noon, London’s clock', hs: 1, l: 'Sun highest here. The London clock says 2 p.m.: you are 30° west of home.', tpos: 'tr', tdelay: 1.6,
  cue: 'On the ship: local noon; the London clock reads 14:00, so 30° west.' });
B({ id: 'carryTime', act: A3, title: 'A clock at sea?', sec: 'clockearth', seg: 7, min: 0.35,
  say: 'So the problem becomes beautifully simple: to know your longitude, you must carry home time. But how do you keep a clock true on a ship that rolls, pitches, gets hot, gets cold, and spends months out of sight of land?', env: 'sea', ships: 'title', dur: 6.5, xf: 2.8,
  fromCam: look(at(10, 60, 34), at(430, -180, 30), { fov: 46 }), cam: look(at(60, 22, 8), at(430, -180, 18), { fov: 48 }),
  p: { storm: .7, rain: 0, cov: .78, cbase: 520, ctop: 1600, stars: .5, mw: .2, fogD: .0008, glow: 1, moonAz: 44, moonEl: 14, hole: .7, lant0: 1, lant1: 1, lant2: 1, lant3: 1, sink: 0, foam: .6, 'o.con': 0 },
  h: 'But a clock <em>at sea</em>?', hs: 2, l: 'It rolls, pitches, heats, freezes, and spends months out of sight of land.', tpos: 'bl', tdelay: 2.4,
  cue: 'The hard part: keeping home time on a ship at sea.' });
})();
