/* beats_act3.js — III · Longitude is time: two ships, the Earth as a clock. */
(function(){
const W = World, B = b => W.beat(b), H = W.BH, G = H.G, S = H.S, RAD = H.RAD;
const { gOrb, look, at, north, add, A3 } = H;
const fig = s => s; // figures are inline SVG strings

/* -------- two ships on one parallel -------- */
const twoP = { spin: 0, sunAz: 0, sunEl: -2, night: 1, clouds: .55, dim: 0, eq: 0, unroll: 0, even: 0, parAll: 0, merAll: 0, rowA: 0, colA: 0, merLon0: 0, merLon3: -30, mer0: 0, mer3: 0,
  slices: 0, sliceOff: 0, atmo: 1, mwS: .45, starsS: 1, expoS: 1, bloomS: 0, det: 0, moonlit: 0, sunVis: 0 };
const twoCam = gOrb(34, -26, 4.05, 0, { fov: 34, shift: [.24, -.01] });
B({ id: 'twoships', act: A3, title: 'Same latitude, two ships', sec: 'twoships', seg: 0, min: .4, env: 'space', dur: 6, xf: 2.4,
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
B({ id: 'hiddenTime', act: A3, title: 'Longitude is hidden in time', sec: 'twoships', seg: 3, min: .4, dur: 5,
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
B({ id: 'pole', act: A3, title: '360° in 24 hours', sec: 'clockearth', seg: 1, min: .4, dur: 6.5, camEase: 'io',
  cam: polar(30, { via: undefined }), p: { spin: [30, .1] },
  labels: [{ a: G.at(90, 0, 1.01), t: 'North Pole', cls: 'dim', side: 'r', d: 4.6 }],
  h: 'One turn a day', l: '360 degrees in 24 hours.', tpos: 'tl', tcls: 'col', tdelay: 4.4, cue: 'The globe tilts to a view from above the North Pole.' });
B({ id: 'slices', act: A3, title: 'Twenty-four slices', sec: 'clockearth', seg: 2, min: .4, dur: 4.5, cam: polar(30),
  p: { slices: [.62, 3.2, .4], sliceOff: 0, even: [.22, 3] }, labels: ring(30, 1.2),
  h: 'Twenty-four slices', l: 'Divide the turn like a clock: each slice is one hour wide.', tpos: 'tl', tcls: 'col', tdelay: 1.6, cue: '24 one-hour slices.' });
B({ id: 'fifteen', act: A3, title: 'One hour = 15°', sec: 'clockearth', seg: 3, min: .4, dur: 4.5, cam: polar(30, { d: 5.05 }),
  p: { slices: .45 }, show: ['wedge15'], labels: ring(30, 0),
  h: '1 hour = 15°', hs: 2, l: '360 ÷ 24 = 15. Every hour of turning is fifteen degrees of longitude.', tpos: 'tl', tcls: 'col', tdelay: 1.2, cue: 'One slice: one hour = 15°.' });
B({ id: 'greenwichNoon', act: A3, title: 'Greenwich: zero', sec: 'clockearth', seg: 4, min: .35, dur: 4.5, cam: polar(30),
  p: { slices: .45, mer0: [1, 2], sunVis: 0 }, labels: ring(30, 0).concat([{ a: G.at(51.48, 0, 1.01), t: 'London · noon', cls: 'gold', side: 'r', d: 1.6 }]),
  h: 'Greenwich is zero', l: 'London’s home meridian. With the Sun on it, London sees noon.', tpos: 'tl', tcls: 'col', tdelay: 1.2, cue: 'Greenwich at zero; noon in London.' });
B({ id: 'turn2h', act: A3, title: 'Two hours later: 30°', sec: 'clockearth', seg: 5, min: 0.4, dur: 7, cam: polar(60),
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
B({ id: 'onShip', act: A3, title: 'Local noon vs. London time', sec: 'clockearth', seg: 6, min: 0.4, dur: 5.5,
  cam: polar(60, { d: 5.0, shift: [-.27, -.05] }), p: { slices: .3, mer0: .6, mer3: 1 }, show: ['ships2', 'wedge30'],
  labels: [{ a: G.at(51.5, -30, 1.01), t: 'You · local noon', cls: 'gold', side: 'l', d: 2.8 }, { a: G.at(51.48, 0, 1.01), t: 'London · 2 p.m.', side: 'r', d: 3.2 }],
  fig: clocks, figpos: 'fp-r', figd: 2.6,
  h: 'Your noon, London’s clock', hs: 1, l: 'Sun highest here. The London clock says 2 p.m.: you are 30° west of home.', tpos: 'tr', tdelay: 1.6,
  cue: 'On the ship: local noon; the London clock reads 14:00, so 30° west.' });
B({ id: 'carryTime', act: A3, title: 'Carry home time', sec: 'clockearth', seg: 7, min: 0.5, env: 'sea', ships: 'title', dur: 6.5, xf: 2.8,
  fromCam: look(at(10, 60, 34), at(430, -180, 30), { fov: 46 }), cam: look(at(60, 22, 8), at(430, -180, 18), { fov: 48 }),
  p: { storm: .7, rain: 0, cov: .78, cbase: 520, ctop: 1600, stars: .5, mw: .2, fogD: .0008, glow: 1, moonAz: 44, moonEl: 14, hole: .7, lant0: 1, lant1: 1, lant2: 1, lant3: 1, sink: 0, foam: .6, 'o.con': 0 },
  h: 'Carry <em>home time</em>', hs: 2, l: 'On a ship that rolls, pitches, heats, freezes, and spends months out of sight of land.', tpos: 'bl', tdelay: 2.4,
  cue: 'Punchline: to know your longitude, carry home time.' });
})();
