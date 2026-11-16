/* beats_act6.js — VI · Today: GPS, the four-satellite fix, the pin, the pale blue dot. */
(function(){
const W = World, B = b => W.beat(b), H = W.BH, G = H.G, RAD = H.RAD, A6 = H.A6;
const { gOrb, gLook, llw } = H;
const gpsP = { spin: 0, sunAz: -55, sunEl: 12, night: 1, clouds: .6, dim: 0, atmo: 1, det: 0, detSel: 1, moonlit: 0, mwS: .45, starsS: 1, expoS: 1, even: 0, slices: 0, unroll: 0, blur: 0,
  merAll: 0, eq: 0, mer0: 0, mer1: 0, mer2: 0, mer3: 0, bloomS: 0, gpsT: 0, hopT: 0, clkErr: 0, grow: 1, fixSnap: 0, h4bg: 1, shellA: 1, rayA: 1, moonV: 0 };
B({ id: 'navstar', act: A6, title: 'Navstar 1, 1978', sec: 'gps', seg: 0, min: .45, dur: 8, camEase: 'io',
  cam: gOrb(18, -70, 23, 0, { fov: 32, shift: [.2, 0] }), p: Object.assign({}, gpsP, { gpsT: [1.6, 30, 0, 'lin'] }), show: ['navOrbit', 'sat1'], odelay: 4,
  plate: { src: 'img/navstar1.jpg', side: 'l', cap: 'A Navstar Block I GPS satellite, late 1970s. US Air Force, public domain.', h: '40vh', d: 4.6 },
  labels: [{ a: 'navstar', t: 'Navstar 1 · Feb 1978', cls: 'gold', side: 'r', d: 5.4 }, { a: () => new THREE.Vector3(0, 1.25, 0), t: 'Earth', cls: 'dim nodot', side: 't', d: 6 }],
  h: 'Drawn to scale', hs: 1, l: 'Earth, and an orbit 20,200 km up.', tpos: 'tl', tcls: 'col', tdelay: 5.6,
  cue: 'Pull out to orbit: Navstar 1 (1978), one orbit, drawn to scale.' });
B({ id: 'constellation', act: A6, title: '32 satellites, six planes', sec: 'gps', seg: 1, min: 0.35, dur: 7, cam: gOrb(24, -60, 20, 0, { fov: 32, shift: [.2, 0] }),
  p: { gpsT: [5, 40, 0, 'lin'] }, show: ['orbits', 'sats', 'trails'], drift: { az: .5 }, driftFor: 200,
  h: '32 satellites, six planes', hs: 1, l: 'Fully operational since 1995. Each one circles the Earth twice a day.', tpos: 'tl', tcls: 'col', tdelay: 2.4,
  cue: '1995 → today: 32 satellites, six planes, twice a day around Earth.' });
B({ id: 'clocks', act: A6, title: 'A sky full of clocks', sec: 'gps', seg: 2, min: .4, dur: 6, cam: gOrb(20, -70, 19.5, 0, { fov: 32, shift: [.2, 0] }),
  p: { gpsT: [7, 40, 0, 'lin'] }, show: ['orbits', 'sats', 'trails', 'pulses'], drift: { az: .5 }, driftFor: 200,
  h: 'A sky full of Harrison’s clocks', hs: 1, l: 'Each carries atomic clocks and broadcasts, nonstop: who it is, where it is, and exactly what time it is.', tpos: 'tl', tcls: 'col', tdelay: 1.6,
  cue: 'Every satellite broadcasts its time: pulses ripple out.' });

/* ---------------- the fix ---------------- */
const FM = [26.6406, -81.8723];
const fixCam = (o = {}) => Object.assign({ orb: true, c: llw(26.6, -81.9, 0, 1.0), d: 3.5, az: -86, el: 6, fov: 38, shift: [.25, 0] }, o);
const fmLab = { a: 'fix', t: 'Fort Myers', cls: 'gold pill', side: 'r', d: 2, id: 'fm' };
B({ id: 'ring1', act: A6, title: 'One satellite: a ring', sec: 'fix', seg: 0, min: .45, dur: 7, cam: fixCam(), p: { gpsT: 7, grow: [1, 4.5, 1.6], shellA: [0, 2.2, 5.6], rayA: [0, 2, 6] }, show: ['fs0', 'fixDot'], odelay: .8,
  h: 'One satellite, one ring', hs: 1, l: 'The signal takes about seven hundredths of a second to arrive. At the speed of light, that’s about 21,000 km. You are somewhere on this ring.', tpos: 'tl', tcls: 'col', tdelay: 3,
  cue: 'One satellite: delay → distance → a light-sphere, and a ring on the ground.' });
B({ id: 'ring2', act: A6, title: 'Two rings cross twice', sec: 'fix', seg: 1, min: .3, dur: 5, cam: fixCam({ az: -84, d: 3.45 }), p: { grow: 1, shellA: 0, rayA: 0 }, show: ['fs0', 'fs1', 'fixDot'],
  h: 'Two rings cross in two places', hs: 1, l: '', tpos: 'tl', tcls: 'col', tdelay: 1.6, cue: 'Two rings cross at two points.' });
B({ id: 'ring3', act: A6, title: 'Three rings: one spot', sec: 'fix', seg: 2, min: .3, dur: 5, cam: fixCam({ az: -82, d: 3.4 }), p: { shellA: 0, rayA: 0 }, show: ['fs0', 'fs1', 'fs2', 'fixDot'], labels: [fmLab],
  h: 'A third picks one', hs: 1, l: 'That’s your spot.', tpos: 'tl', tcls: 'col', tdelay: 1.6, cue: 'Three rings: one spot.' });
B({ id: 'clockerr', act: A6, title: 'A cheap clock: 300 km off', sec: 'fix', seg: 3, min: .35, dur: 5, cam: fixCam({ az: -82, d: 3.4 }), p: { clkErr: [1, 2.5, .6], shellA: 0, rayA: 0 }, show: ['fs0', 'fs1', 'fs2', 'fixDot'],
  labels: [{ a: 'fix', t: 'Rings miss by ~300 km', cls: 'coral pill', side: 'r', d: 2.6 }],
  h: '1/1,000 s off = 300 km', hs: 1, l: 'Your phone’s clock is cheap. One thousandth of a second wrong, and every distance is off by 300 km.', tpos: 'tl', tcls: 'col', tdelay: 1.2,
  cue: 'The catch: a phone clock 1/1000 s off → rings miss by 300 km.' });
B({ id: 'fourth', act: A6, title: 'The fourth satellite', sec: 'fix', seg: 4, min: .35, dur: 6, cam: fixCam({ az: -80, d: 3.4 }), p: { clkErr: 1, fixSnap: [1, 2.6, 2.2], shellA: 0, rayA: 0 }, show: ['fs0', 'fs1', 'fs2', 'fs3', 'fixDot'], labels: [fmLab],
  h: 'Four satellites: one spot, and the time', hs: 1, l: 'A fourth signal lets the receiver solve for its place and its own clock error at once.', tpos: 'tl', tcls: 'col', tdelay: 1.6,
  cue: 'The fourth satellite solves the clock: the rings snap to one spot.' });
B({ id: 'hops', act: A6, title: 'Anywhere', sec: 'fix', seg: 5, min: 0.35, dur: 7, cam: { orb: true, c: llw(36, -96, 0, 1.0), d: 4.2, az: -96, el: 10, fov: 38, shift: [.24, 0] },
  p: { clkErr: 0, fixSnap: 1, hopT: [5, 15, 1.2, 'lin'], sunAz: -75, shellA: 0, rayA: 0 }, show: ['fs0', 'fs1', 'fs2', 'fs3', 'fixDot'],
  labels: [{ a: 'fix', t: '', tf: () => G.cityName(), cls: 'gold pill', side: 'r', d: 1 }],
  h: 'Anywhere', hs: 2, l: 'Seattle, Denver, Chicago, Houston, New York: different satellites every time, the same answer in under a second.', tpos: 'tl', tcls: 'col', tdelay: 1.4,
  cue: 'Anywhere: Seattle, Denver, Chicago, Houston, New York…' });

/* ---------------- the pin ---------------- */
const card = `<div style="width:calc(var(--u)*26);background:rgba(250,250,248,.96);color:#1d232b;border-radius:10px;box-shadow:0 2vh 6vh rgba(0,0,0,.55);font:400 calc(var(--u)*1.05)/1.45 Inter;overflow:hidden">
  <div style="background:#1d4f91;color:#fff;padding:calc(var(--u)*.9) calc(var(--u)*1.3);font-weight:600;letter-spacing:.02em">Field Maps · Assistance request</div>
  <div style="padding:calc(var(--u)*1.2) calc(var(--u)*1.3)"><div style="font-weight:600;font-size:1.15em">Household of 4 · water in home</div>
  <div style="color:#5b6573;margin-top:.2em">Fort Myers, Florida · tonight</div>
  <div style="margin-top:.8em">Needs: <b>cots × 4</b>, shelter bed</div>
  <div style="margin-top:1em;padding-top:.8em;border-top:1px solid #e3e6ea;font-family:'Geist Mono';font-size:.98em;color:#1d4f91">26.6406° N, 81.8723° W</div></div></div>
  <div style="margin-top:1em;font:400 calc(var(--u)*.78)/1.3 Inter;color:rgba(230,230,230,.5);letter-spacing:.06em">Illustrative record, not real data.</div>`;
const pinP = { shellA: 1, det: [1, 3], detSel: 1, clouds: [.12, 3], sunAz: -78, sunEl: 40, night: 0, clkErr: 0, fixSnap: 1, hopT: 0 };
B({ id: 'pin', act: A6, title: 'A pin in Fort Myers', sec: 'pin', seg: 0, min: .35, dur: 7, camEase: 'io', cam: gLook(26.6, -81.87, .09, 18, 0, { fov: 34, shift: [-.16, 0] }),
  p: Object.assign({ hopT: [0, .1] }, pinP), show: ['fixDot'],
  labels: [{ a: G.at(26.6406, -81.8723, 1.002), t: 'Fort Myers', cls: 'gold', side: 'r', d: 5 }],
  h: 'Now bring it home', hs: 1, l: '', tpos: 'tl', tcls: 'scrim', tdelay: 5, cue: 'Dive from the whole Earth to southwest Florida.' });
B({ id: 'request', act: A6, title: 'A family needs cots', sec: 'pin', seg: 1, min: 0.25, dur: 5, cam: gLook(26.62, -81.87, .055, 14, 0, { fov: 34, shift: [-.18, 0] }), p: pinP, show: ['fixDot'],
  fig: card, figpos: 'fp-r', figd: 1,
  h: 'A family, tonight', hs: 1, l: 'Their house took water. They need cots. The pin that sends a volunteer, a truck, a bed —', tpos: 'tl', tcls: 'scrim', tdelay: 1.4,
  cue: 'Field Maps-style pin and request card (illustrative).' });
B({ id: 'twonumbers', act: A6, title: 'Just two numbers', sec: 'pin', seg: 2, min: .25, dur: 5, cam: gLook(26.62, -81.87, .07, 14, 0, { fov: 34, shift: [0, 0] }), p: Object.assign({}, pinP, { blur: [.75, 2.4] }), show: ['fixDot'],
  kick: '— is just two numbers', h: '26.64° N, <span style="white-space:nowrap">81.87° W</span>', hs: 2, l: '', tpos: 'c', tcls: 'scrim', tdelay: 1, cue: 'Just two numbers: latitude and longitude.' });
B({ id: 'callback', act: A6, title: 'Stars, a clock, a sky of clocks', sec: 'pin', seg: 3, min: .3, dur: 5, cam: gLook(26.62, -81.87, .1, 14, 0, { fov: 34 }), p: Object.assign({}, pinP, { blur: [.85, 1] }),
  h: 'The stars gave us latitude.<br>A clock gave us longitude.', hs: 1, l: 'And a sky full of clocks answers Shovell’s question in under a second.', tpos: 'c', tcls: 'scrim', tdelay: 1,
  cue: 'The callback: stars, clock, a sky full of clocks.' });
B({ id: 'paleblue', act: A6, title: 'Where am I?', sec: 'pin', seg: 3, min: 0.3, dur: 14, camEase: 'io', cam: gOrb(20, -70, 2400, 0, { fov: 30, shift: [.13, .06] }),
  say: 'From far enough away, every pin is the same pale blue dot. Two numbers find any place on it — and the answer to the oldest question at sea. Where am I?',
  p: { blur: [0, 2], det: [0, 3], clouds: [.6, 4], night: 1, sunAz: -10, sunEl: 5, mwS: [.22, 10], starsS: [1.1, 10], 'o.pbd': [1, 4, 9] },
  h: 'Where am I?', hs: 2, l: 'Two numbers.', tpos: 'bl', tdelay: 10.5,
  cue: 'Pale-blue-dot pull-back: Earth shrinks to a single pale-blue point inside a soft beam of scattered sunlight.' });
B({ id: 'thanks', act: A6, title: 'Thank you', sec: 'pin', seg: 4, min: .3, dur: 5, cam: gOrb(20, -70, 2600, 0, { fov: 30, shift: [.13, .06] }), p: { 'o.pbd': 1 },
  h: 'Thank you', hs: 2, l: 'Questions?', tpos: 'bl', tdelay: 1, cue: 'Thank you — questions.' });
})();
