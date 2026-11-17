/* beats.js — the talk, beat by beat. Each beat: environment, camera, parameters, words (headline + one line), notes. */
(function(){
const W = World, B = b => W.beat(b), RAD = Math.PI / 180;
const S = W.envs.sea, at = S.at;
const look = (p, t, o = {}) => Object.assign({ p, t }, o);
const north = (alt, d = 1000) => [0, Math.sin(alt * RAD) * d, -Math.cos(alt * RAD) * d];
const add = (a, b) => a.map((v, i) => v + b[i]);
const G = W.envs.space;
/* globe camera helpers (spin = Earth rotation used in that beat) */
const llw = (lat, lon, spin, r = 1) => { const az = (lon + spin) * RAD, la = lat * RAD; return [r * Math.cos(la) * Math.sin(az), r * Math.sin(la), r * Math.cos(la) * Math.cos(az)]; };
const gOrb = (lat, lon, d, spin, o = {}) => Object.assign({ orb: true, c: [0, 0, 0], d, az: lon + spin, el: lat, fov: 34 }, o);
function gLook(lat, lon, alt, tilt, spin, o = {}){ // oblique view from the south, looking north at (lat, lon)
  const t = llw(lat, lon, spin, 1), n = new THREE.Vector3(...t).normalize(), north = new THREE.Vector3(0, 1, 0).sub(n.clone().multiplyScalar(n.y)).normalize();
  const dir = n.clone().multiplyScalar(Math.cos(tilt * RAD)).sub(north.clone().multiplyScalar(Math.sin(tilt * RAD)));
  const p = new THREE.Vector3(...t).add(dir.multiplyScalar(alt));
  const tt = new THREE.Vector3(...t).add(north.clone().multiplyScalar(o.ahead || 0));
  return Object.assign({ p: p.toArray(), t: tt.toArray(), up: n.toArray(), fov: o.fov || 34 }, o); }
const SPIN0 = 96.4;
const A1 = 'The stakes', A2 = 'Latitude is easy', A3 = 'Longitude is time', A4 = 'Carrying home time', A5 = 'Zero is a choice', A6 = 'Today', AX = 'Appendix';

/* ===================== I · THE STAKES ===================== */
B({ id: 'title', act: 'Opening', title: 'Where Am I?', sec: 'title', seg: 0, min: .5, env: 'sea', ships: 'title',
  cam: look(at(40, 10, 7.2), at(430, -180, 17), { fov: 48 }), drift: { p: [.55 * Math.sin(S.HEAD), 0, -.55 * Math.cos(S.HEAD)] }, driftFor: 600,
  p: { storm: 1, rain: 1, cov: .94, cbase: 430, ctop: 1550, fogD: .00105, stars: 0, mw: 0, glow: 1, moonAz: 44, moonEl: 12, lant0: 1, lant1: 1, lant2: 1, lant3: 1, sink: 0 },
  strikes: [{ t: 3.4, p: 1, a: 1500, b: -520 }, { t: 8.6, p: .95, bolt: true, a: 2600, b: -260 }], strikeEvery: 26,
  kick: 'Latitude &amp; longitude', h: 'Where Am I?', hs: 2, l: 'How we learned to name any place on Earth with two numbers.', cred: 'Jeff Franzen &ensp;·&ensp; Disaster GIS &ensp;·&ensp; American Red Cross', tdelay: 2.2,
  cue: 'Night, a storm at sea. Ships in the rain; distant lightning. Title settles.' });

B({ id: 'storm', act: A1, title: '22 October 1707', sec: 'scilly', seg: 0, min: 0.55, dur: 6.5,
  cam: look(at(205, 72, 10.5), at(330, -62, 13), { fov: 46, via: at(110, 40, 11) }), drift: { p: [.25, 0, .1] },
  strikes: [{ t: 5.2, p: .7, a: 2400, b: -900 }], strikeEvery: 30,
  h: '22 October 1707', l: 'Admiral Shovell brings the fleet home through days of storm and cloud.', tpos: 'bl', tdelay: 2.6,
  labels: [{ a: 'ship0', t: 'Association · flagship', side: 'r', d: 4.5 }],
  cue: 'The camera glides in beside the flagship Association.' });

/* B3–B4: a moonlit chart of the approaches — no city lights in 1707 */
const chartP = { spin: SPIN0, sunAz: -5.6 + SPIN0, sunEl: 62, night: 0, clouds: .28, moonlit: 1, det: 1, detSel: 0, dim: 0, atmo: 1, mwS: .35, starsS: 1, expoS: 1 };
B({ id: 'believed', act: A1, title: 'Where they believed they were', sec: 'scilly', seg: 1, min: .5, env: 'space', dur: 6,
  fromCam: gLook(49.4, -5.8, .03, 20, SPIN0, { fov: 40 }), cam: gLook(48.6, -5.6, .085, 33, SPIN0, { fov: 34, ahead: .004 }), xf: 2.8, push: 0,
  p: chartP, show: ['ghost'], drift: { p: [0, 0, 0] },
  h: 'Where they believed they were', l: 'West of Brittany, in safe water, heading into the Channel.', tpos: 'tl', tdelay: 2.4,
  labels: [{ a: G.at(49.45, -4.2), t: 'They believed: here', cls: 'big', side: 'r', d: 3 }, { a: G.at(50.35, -4.9), t: 'Cornwall', cls: 'dim nodot', side: 'r' }, { a: G.at(48.25, -3.4), t: 'Brittany', cls: 'dim nodot', side: 'r' }, { a: G.at(52.6, -8.3), t: 'Ireland', cls: 'dim nodot', side: 'r' }],
  cue: 'Rise out of the storm to a moonlit chart; the ghost fleet (dashed) shows the believed position.' });
B({ id: 'actual', act: A1, title: 'Where they really were', sec: 'scilly', seg: 2, min: .5, dur: 5,
  cam: gLook(49.2, -5.9, .08, 30, SPIN0, { fov: 34, ahead: .004 }),
  p: Object.assign({}, chartP, { 'o.ghost': [.45, 2] }), show: ['ghost', 'real', 'gap'],
  h: 'Where they really were', l: 'Farther north — heading straight for the Isles of Scilly.', tpos: 'tl',
  labels: [{ a: G.at(49.45, -4.2), t: 'Believed', cls: 'dim', side: 'r' }, { a: G.at(49.872, -6.43), t: 'Really: Isles of Scilly', cls: 'gold big', side: 'b', d: 2.4 }, { a: G.at(50.35, -4.9), t: 'Cornwall', cls: 'dim nodot', side: 'r' }, { a: G.at(48.25, -3.4), t: 'Brittany', cls: 'dim nodot', side: 'r' }],
  cue: 'The real fleet (gold) lies farther north, on the Scilly rocks; the gap between them.' });

/* B5–B6: back down into the storm, at the Western Rocks */
B({ id: 'rocks', act: A1, title: 'The Western Rocks', sec: 'scilly', seg: 3, min: .4, env: 'sea', ships: 'rocks', dur: 6.5,
  outCam: gLook(49.88, -6.42, .004, 10, SPIN0, { fov: 40 }), xf: 3.2, xfDelay: .6,
  fromCam: look(at(2420, 330, 60), at(2740, -20, 12), { fov: 50 }), cam: look(at(2520, 300, 7), at(2760, -10, 9), { fov: 46 }),
  p: { storm: 1, rain: 1, cov: .95, fogD: .0012, glow: .9, lant0: 1, lant1: 1, lant2: 1, lant3: 1, sink: 0, stars: 0, mw: 0 },
  strikes: [{ t: 4.2, p: 1.1, bolt: true, a: 3400, b: -420 }], strikeEvery: 28,
  h: 'About eight at night', l: 'In the dark, the flagship and three more ships strike the Western Rocks.', tpos: 'bl', tdelay: 3,
  labels: [{ a: 'rocks', t: 'Western Rocks', side: 'r', d: 4.8 }],
  cue: 'Dive back into the storm: the Western Rocks loom; lightning shows them.' });
B({ id: 'toll', act: A1, title: 'As many as 2,000', sec: 'scilly', seg: 4, min: .5, dur: 7,
  cam: look(at(2330, 460, 24), at(2760, 40, 6), { fov: 44 }),
  p: { lant0: [0, 1.8, 1.4], lant1: [0, 1.8, 2.8], lant2: [0, 1.8, 4.2], lant3: [0, 1.8, 5.6], sink: [1, 9, .8], fogD: .0014, storm: .9, rain: .8 },
  h: 'Four ships.<br>As many as 2,000 men.', l: 'Estimates of the dead run from over 1,300 to about 2,000 — one of the worst disasters in Royal Navy history.', tpos: 'bl', tdelay: 6.2,
  cue: 'One by one the lanterns go dark. The toll.' });

/* B7–B10: why it happened */
B({ id: 'engraving', act: A1, title: 'What went wrong?', sec: 'why', seg: 0, min: 0.5, dur: 5,
  cam: look(at(2150, 380, 9), at(2500, -260, 40), { fov: 46 }), p: { blur: [.85, 3], storm: .7, rain: .45, fogD: .0012 },
  plate: { src: 'img/wreck.jpg', side: 'r', cap: 'The wreck of Shovell’s fleet on the Scilly rocks. Engraving after William Rayner, c. 1739 — about thirty years later. Public domain.', h: '50vh' },
  h: 'What went wrong?', l: 'Bad charts. Poor compasses. Bad weather. And underneath it all, one simple problem.', tpos: 'bl', tdelay: 1.6,
  cue: 'The engraving, made about thirty years later, floats over the dark sea.' });
B({ id: 'hadlat', act: A1, title: 'Latitude: they had a way', sec: 'why', seg: 1, min: .45, dur: 6,
  cam: look(at(2150, 380, 9), add(at(2150, 380, 9), north(38)), { fov: 52 }),
  p: { blur: [0, 2.5], storm: .5, rain: [0, 3], cov: [.62, 6], stars: [1, 6], mw: [.55, 6], fogD: .0009, glow: .8, 'o.con': 0 },
  h: 'Latitude', l: 'How far north? Whenever they could see the sky, they had a way to find it.', tpos: 'bl', tdelay: 2.6,
  cue: 'The clouds part: stars. Latitude came from the sky.' });
B({ id: 'nolon', act: A1, title: 'Longitude: they did not', sec: 'why', seg: 2, min: .45, dur: 6,
  cam: look(at(2150, 380, 8), add(at(2150, 380, 8), [Math.sin(150 * RAD) * 1000, 6, -Math.cos(150 * RAD) * 1000]), { fov: 50 }),
  p: { cov: .72, stars: .6 },
  h: 'Longitude', l: 'How far east or west? At sea, nobody on Earth had a reliable way to know.', tpos: 'bl', tdelay: 2.2,
  cue: 'The camera turns to an empty horizon: no way to know east–west.' });
B({ id: 'onemissing', act: A1, title: 'Two numbers, one missing', sec: 'why', seg: 3, min: .5, dur: 5,
  cam: look(at(2150, 380, 8.5), add(at(2150, 380, 8.5), [Math.sin(120 * RAD) * 1000, 30, -Math.cos(120 * RAD) * 1000]), { fov: 48 }),
  h: '49° 52′ N, <em>?</em>', hs: 2, l: 'A position takes two numbers. In 1707, at sea, one of them was a guess.', tpos: 'bl', tdelay: 1.8,
  cue: 'Two numbers, and one is a question mark.' });

/* ===================== II · LATITUDE IS EASY ===================== */
B({ id: 'rise', act: A2, title: 'Rise above the weather', sec: 'polaris', seg: 0, min: .3, dur: 8.5, camEase: 'io',
  say: 'Latitude first, because nature hands it to us. Let’s rise above the weather, the way a navigator’s eye does.',
  cam: look(at(2150, 380, 2900), add(at(2150, 380, 2900), north(13)), { fov: 62, via: at(2150, 380, 1100) }),
  p: { cbase: 700, ctop: 1750, cov: [.8, 3], storm: [.25, 6], stars: 1, mw: .9, fogD: [.0005, 6], glow: 1, moonAz: 200, moonEl: 24, hole: 0, rain: 0 },
  h: 'Latitude first', l: 'Nature hands it to us. Look up.', tpos: 'bl', tdelay: 6.6,
  cue: 'The camera rises through the storm clouds into a clear, real night sky.' });
B({ id: 'polaris', act: A2, title: 'Polaris, the North Star', sec: 'polaris', seg: 0, min: 0.3, dur: 5,
  say: 'Up here is the one star sailors trusted most: Polaris, the North Star. All night, the whole sky wheels around it.',
  cam: look(at(2150, 380, 2900), add(at(2150, 380, 2900), north(37)), { fov: 74 }),
  p: { 'o.con': 1 }, labels: [{ a: 'polaris', t: 'Polaris', cls: 'gold big', side: 'r', d: 2.4 }],
  h: 'Polaris', l: 'The North Star: the sky turns around it.', tpos: 'bl', tdelay: 2.2,
  cue: 'Polaris, with the Big Dipper and Cassiopeia faintly drawn.' });

/* B13: the switch — we are the observer. Same stars, now seen from a curved Earth. */
const seaCamP = at(2150, 380, 2900), seaD = new THREE.Vector3(...north(30)).normalize();
const M = new THREE.Matrix3().copy(Sky.SPACE).multiply(Sky.local(49.9, 90).clone().transpose());
const dSp = seaD.clone().applyMatrix3(M), uSp = new THREE.Vector3(0, 1, 0).applyMatrix3(M);
const O0 = new THREE.Vector3(Math.cos(49.9 * RAD), Math.sin(49.9 * RAD), 0).multiplyScalar(1.0006);
const diagCam = { orb: true, c: [0, .1, 0], d: 5.1, az: 0, el: 0, fov: 36, shift: [.18, 0] };
const diagP = { spin: SPIN0, sunAz: -38, sunEl: 16, night: .7, clouds: .42, dim: .42, atmo: 1, moonlit: 0, det: 0, mwS: .45, starsS: 1, obsLat: 49.9, eq: 0, expoS: 1 };
B({ id: 'axis', act: A2, title: 'The poles', sec: 'polaris', seg: 0, min: .3, env: 'space', dur: 7.5, xf: 1.4,
  say: 'Now pull back. The Earth spins on an axis; the two ends are the poles.',
  fromCam: { p: O0.toArray(), t: O0.clone().add(dSp.clone().multiplyScalar(5)).toArray(), up: uSp.toArray(), fov: 64 },
  cam: Object.assign({}, diagCam, { via: [2.6, 2.2, 2.4] }), p: diagP, show: ['axis'],
  labels: [{ a: 'np', t: 'North Pole', side: 'r' }, { a: 'sp', t: 'South Pole', side: 'r' }],
  h: 'The poles', l: 'Earth spins on an axis. Its two ends are the poles.', tpos: 'tl', tcls: 'col', tdelay: 5.2,
  cue: 'From the observer’s eye we pull back: the curved Earth, its axis and poles.' });
B({ id: 'equator', act: A2, title: 'The equator: nature’s zero', sec: 'polaris', seg: 1, min: .25, dur: 4, cam: diagCam,
  p: { eq: 1 }, show: ['axis'], labels: [{ a: G.at(0, -60, 1.01), t: 'Equator · 0°', cls: 'gold', side: 'r' }],
  h: 'The equator', l: 'Exactly halfway between the poles. Nobody voted on it: it is nature’s zero.', tpos: 'tl', tcls: 'col', cue: 'The equator lights up: latitude 0°.' });
B({ id: 'observer', act: A2, title: 'A person and their horizon', sec: 'polaris', seg: 2, min: .25, dur: 4.5, cam: diagCam,
  p: { eq: .5, obsLat: [39, 3.5] }, show: ['axis', 'person', 'horizon'],
  labels: [{ a: 'obs', t: 'You · 39° N', side: 'r', d: 2.4 }, { a: 'horizon', t: 'Your horizon', cls: 'dim nodot', side: 'l', d: 3 }],
  h: 'Your horizon', l: 'Flat, just touching the Earth where you stand.', tpos: 'tl', tcls: 'col', cue: 'A person at 39° N and their flat horizon.' });
B({ id: 'rays', act: A2, title: 'Light in parallel lines', sec: 'polaris', seg: 3, min: .25, dur: 4, cam: diagCam,
  show: ['axis', 'person', 'horizon', 'rays'], labels: [{ a: 'rays', t: 'Light from Polaris', side: 'r', cls: 'dim' }, { a: 'obs', t: 'You · 39° N', side: 'r' }],
  h: 'Polaris', l: 'Almost exactly above the North Pole, and so far away its light arrives in parallel lines.', tpos: 'tl', tcls: 'col', cue: 'Polaris’s light arrives in parallel lines.' });
B({ id: 'angle', act: A2, title: 'Measure its height', sec: 'polaris', seg: 4, min: .25, dur: 4, cam: Object.assign({}, diagCam, { d: 4.65, c: [.15, .2, 0] }),
  show: ['axis', 'person', 'horizon', 'rays', 'angObs', 'angObs2'], labels: [{ a: 'obsAng', t: '39°', tf: () => Math.round(W.P.obsLat * 10) / 10 + '°', cls: 'gold big nodot', side: 'r' }],
  h: 'Measure its height', l: 'The angle of Polaris above your horizon…', tpos: 'tl', tcls: 'col', cue: 'The gold angle: Polaris above the horizon.' });
B({ id: 'equal', act: A2, title: '…is your latitude', sec: 'polaris', seg: 5, min: 0.25, dur: 4, cam: Object.assign({}, diagCam, { d: 4.75, c: [.1, .18, 0] }),
  p: { eq: .8 }, show: ['axis', 'person', 'horizon', 'rays', 'angObs', 'angObs2', 'angC'],
  labels: [{ a: 'obsAng', t: '39°', tf: () => Math.round(W.P.obsLat * 10) / 10 + '°', cls: 'gold big nodot', side: 'r' }, { a: 'cAng', t: '39°', tf: () => Math.round(W.P.obsLat * 10) / 10 + '°', cls: 'gold big nodot', side: 'r' }],
  h: '…is your latitude', l: 'Those two gold angles are always equal.', tpos: 'tl', tcls: 'col', cue: 'The same angle at Earth’s centre: latitude. Equal.' });
const walk = (id, lat, title, h, l, seg, cue) => B({ id, act: A2, title, sec: 'polaris', seg, min: id === 'london' ? .25 : .2, dur: 4.5, cam: Object.assign({}, diagCam, { d: 4.85, c: [.1, .16, 0] }),
  p: { obsLat: [lat, 4] }, show: ['axis', 'person', 'horizon', 'rays', 'angObs', 'angObs2', 'angC'],
  labels: [{ a: 'obsAng', t: '', tf: () => Math.round(W.P.obsLat * 10) / 10 + '°', cls: 'gold big nodot', side: 'r' }, { a: 'cAng', t: '', tf: () => Math.round(W.P.obsLat * 10) / 10 + '°', cls: 'gold big nodot', side: 'r' }],
  h, l, tpos: 'tl', tcls: 'col', cue });
walk('atEquator', 0, 'At the equator', 'At the equator', 'Polaris sits right on the horizon: 0°.', 6, 'Walk to the equator: Polaris on the horizon.');
walk('atPole', 88.5, 'At the North Pole', 'At the North Pole', 'Polaris is straight overhead: 90°.', 7, 'Walk to the North Pole: Polaris overhead.');
walk('london', 51.5, 'In London: 51.5°', 'In London', 'Polaris stands 51.5° up. That is latitude: look up, measure one angle.', 8, 'Back to London, 51.5°.');

/* B22–B24: a fist is a ruler for the sky — tonight, a clear northern horizon at 39° N */
const fistCam = look(at(2150, 380, 3), add(at(2150, 380, 3), north(14)), { fov: 68 });
const fistP = { storm: .06, rain: 0, cov: .04, cbase: 900, ctop: 1600, stars: 1, mw: .75, fogD: .00022, lat: 38.9, lst: 90, glow: .5, hole: 0, moonAz: 150, moonEl: 9, foam: .2, 'o.con': .6 };
const tick = (alt, t, d) => ({ a: () => S.anchor.sky(alt), t, cls: 'tick mono', side: 'r', d, id: 'tick' + alt });
B({ id: 'fist', act: A2, title: 'A fist is a ruler for the sky', sec: 'fist', seg: 0, min: .33, env: 'sea', dur: 5, xf: 2.6, fromCam: look(at(2150, 380, 3), add(at(2150, 380, 3), north(40)), { fov: 50 }),
  cam: fistCam, p: fistP, labels: [tick(0, 'horizon', 2), tick(10, '1 fist ≈ 10°', 3)],
  h: 'A ruler for the sky', l: 'Hold your fist out at arm’s length: it covers about ten degrees.', tpos: 'bl', tdelay: 2.2, cue: 'A clear night, a northern sea horizon; one fist ≈ 10°.' });
B({ id: 'fists', act: A2, title: 'Stack your fists', sec: 'fist', seg: 1, min: .33, dur: 4, cam: fistCam, p: { 'o.con': .6 },
  labels: [tick(0, 'horizon', 0), tick(10, '1', .2), tick(20, '2', 1), tick(30, '3', 1.8), tick(39.2, '4', 2.6)],
  h: 'Stack them', l: 'From the horizon, up to Polaris.', tpos: 'bl', cue: 'Fists stack from the horizon toward Polaris.' });
B({ id: 'fourfists', act: A2, title: 'About four fists: 39° N', sec: 'fist', seg: 2, min: 0.3, dur: 4, cam: fistCam, p: { 'o.con': .6 },
  labels: [tick(0, 'horizon', 0), tick(10, '1', 0), tick(20, '2', 0), tick(30, '3', 0), tick(39.2, '4 fists ≈ 39°', .3), { a: () => S.anchor.sky(39.2), t: 'Polaris', cls: 'gold big', side: 't', id: 'pol' }],
  h: 'About four fists', l: 'From Washington, about 39 degrees — and Washington is at 39° north.', tpos: 'bl', cue: 'About four fists ≈ 39°: you are near 39° N.' });

/* B25–B29: the grid, and the Bingo card */
const gridCam = gOrb(22, -40, 4.4, 0, { fov: 34, shift: [.2, 0] });
const gridP = { spin: 0, sunAz: -62, sunEl: 12, night: .5, clouds: .8, dim: .12, eq: 0, obsLat: 49.9, unroll: 0, even: 0, parAll: 0, merAll: 0, rowA: 0, colA: 0, mwS: .45 };
B({ id: 'parallels', act: A2, title: 'Parallels', sec: 'grid', seg: 0, min: .3, env: 'space', dur: 5, xf: 2.4, cam: gridCam, p: Object.assign({}, gridP, { parAll: [1, 2.5, 1.5] }),
  labels: [{ a: G.at(45, -12, 1.01), t: 'Parallels: latitude', side: 'r', d: 2.6 }],
  h: 'Parallels', l: 'Lines of latitude run east–west, like rungs on a ladder.', tpos: 'tl', tcls: 'col', cue: 'Parallels: lines of latitude.' });
B({ id: 'meridians', act: A2, title: 'Meridians', sec: 'grid', seg: 1, min: .3, dur: 4, cam: gOrb(22, -40, 4.35, 0, { fov: 34, shift: [.2, 0] }), p: { merAll: [1, 2.5, 1] },
  labels: [{ a: G.at(10, -60, 1.01), t: 'Meridians: longitude', side: 'r', d: 2.2 }],
  h: 'Meridians', l: 'Lines of longitude run from pole to pole.', tpos: 'tl', tcls: 'col', cue: 'Meridians: lines of longitude.' });
B({ id: 'unroll', act: A2, title: 'Unroll the globe', sec: 'grid', seg: 2, min: .3, dur: 6.5, cam: gOrb(0, -40, 4.95, 0, { fov: 36, c: [0, .22, 0], shift: [0, -.075] }), p: { unroll: [1, 6.2, .3], clouds: [0, 1.5], atmo: [0, 2], even: [1, 3], bloomS: [-.38, 3], expoS: [.92, 3] },
  h: 'A grid', l: 'Unroll the globe, and the lines become a grid.', tpos: 'tl', tdelay: 4.5, cue: 'The globe unrolls into a flat grid.' });
B({ id: 'bingo', act: A2, title: 'The Bingo card', sec: 'grid', seg: 3, min: .3, dur: 4, cam: gOrb(4, -40, 4.9, 0, { fov: 36, c: [0, .22, 0], shift: [0, -.075] }), p: { rowA: [1, 2], colA: [1, 2, 1.2] },
  labels: [{ a: G.at(38.9, -77.04, 1.01), t: 'Washington · 38.9° N, 77.0° W', cls: 'gold', side: 'r', d: 2.6 }, { a: G.at(38.9, 40, 1.01), t: 'Row: latitude', cls: 'dim nodot', side: 't', d: 1.2 }, { a: G.at(-30, -77.04, 1.01), t: 'Column: longitude', cls: 'dim nodot', side: 'r', d: 2 }],
  h: 'A Bingo card', l: 'Latitude calls the row. Longitude calls the column.', tpos: 'tl', cue: 'Bingo: latitude calls the row, longitude the column.' });
B({ id: 'hardpart', act: A2, title: 'The column was the hard part', sec: 'grid', seg: 4, min: .3, dur: 4, cam: gOrb(4, -40, 4.9, 0, { fov: 36, c: [0, .22, 0], shift: [0, -.075] }), p: { rowA: [.25, 2], colA: 1 },
  labels: [{ a: G.at(-30, -77.04, 1.01), t: 'Column: longitude', cls: 'gold', side: 'r' }],
  h: 'The column was the hard part', tcls: 'wide', l: 'Calling the row was easy: look at Polaris. The column is what killed Shovell’s sailors.', tpos: 'tl', cue: 'The column stays lit: the hard part.' });
/* helpers shared with the later acts (beats_act3.js …) */
W.BH = { look, north, add, llw, gOrb, gLook, SPIN0, A3, A4, A5, A6, AX, at, S, G, RAD };
})();
