/* beats_act4.js — IV · Carrying home time: sky clocks (Jupiter, France, the Moon), then Harrison. */
(function(){
const W = World, B = b => W.beat(b), H = W.BH, G = H.G, S = H.S, RAD = H.RAD, A4 = H.A4;
const { gOrb, gLook, look, at } = H;
const V = (a) => new THREE.Vector3(...a);

/* ---------------- Jupiter's moons: a clock everyone can read ---------------- */
const JC = G.JC.toArray();
const jDir = [Math.sin(35 * RAD) * Math.cos(8 * RAD), Math.sin(8 * RAD), Math.cos(35 * RAD) * Math.cos(8 * RAD)];
const jCam = (d, o = {}) => Object.assign({ p: JC.map((v, i) => v + jDir[i] * d), t: JC, fov: 30, shift: [.17, -.01] }, o);
const jupP = { sunAz: -40, sunEl: 5, mwS: .3, starsS: 1, expoS: 1.1, bloomS: 0, jt: 0, 'o.ships2': 0, slices: 0, mer0: 0, mer3: 0, even: 0 };
const ioLab = { a: 'io', t: 'Io', cls: 'gold nodot', side: 't', d: 2.2 };
B({ id: 'galileo', act: A4, title: 'Galileo’s four moons', sec: 'jupiter', seg: 0, min: 0.35, env: 'space', dur: 7, xf: 2.8,
  fromCam: jCam(470, { shift: [.17, .065] }), cam: jCam(360, { shift: [.17, .065] }), p: Object.assign({}, jupP), drift: { p: [0, 0, 0] },
  plate: { src: 'img/galileo_ms.jpg', side: 'l', cap: 'Galileo’s own notes, 1610: Jupiter and four moons, night after night. Public domain.', h: '66vh', d: 2.4 },
  labels: [{ a: 'jupiter', t: 'Jupiter', cls: 'dim nodot', side: 't', d: 3.4 }],
  h: 'A clock in the sky', l: 'In 1610 Galileo found four moons circling Jupiter.', tpos: 'br', tdelay: 3.4, cue: 'Galileo’s 1610 notebook beside Jupiter and its four moons.' });
B({ id: 'iolap', act: A4, title: 'Io laps every 42½ hours', sec: 'jupiter', seg: 1, min: 0.24, dur: 7, cam: jCam(270),
  p: { jt: [52.35, 7, 0, 'io'] }, labels: [ioLab],
  h: 'Hands on a clock', l: 'The innermost moon, Io, laps Jupiter every 42½ hours.', tpos: 'tl', tcls: 'col', tdelay: 2,
  cue: 'The moons orbit like clock hands; Io laps every 42.5 hours.' });
B({ id: 'eclipse', act: A4, title: 'Io blinks out', sec: 'jupiter', seg: 2, min: 0.3, dur: 6.5, cam: jCam(285, { shift: [.25, -.04] }),
  p: { jt: [62.97, 7.5, .6, 'lin'] }, labels: [ioLab, { a: () => G.JC.clone().add(new THREE.Vector3(.64, -.087, -.763).multiplyScalar(120)), t: 'Jupiter’s shadow', cls: 'dim nodot', side: 'b', d: 3 }],
  h: 'The same instant for everyone', l: 'Io slips into Jupiter’s shadow and blinks out. Anyone watching, anywhere, sees it at once.', tpos: 'tl', tcls: 'col', tdelay: 2.4,
  cue: 'Io slips into Jupiter’s shadow: the same instant for every observer.' });
const ioFig = (() => { // Tufte: one time axis, two marks, the difference labelled directly
  const x = t => 40 + (t - 9.5) / .5 * 520; let s = `<svg width="960" height="285" viewBox="0 0 640 190">`;
  s += `<line x1="${x(9.5)}" y1="96" x2="${x(10)}" y2="96" stroke="rgba(232,228,220,.45)" stroke-width="1"/>`;
  [9.5, 9 + 40 / 60, 9 + 50 / 60, 10].forEach(t => { s += `<line x1="${x(t)}" y1="92" x2="${x(t)}" y2="100" stroke="rgba(232,228,220,.45)"/><text x="${x(t)}" y="122" text-anchor="middle" font-size="13" fill="rgba(232,228,220,.55)">${Math.floor(t)}:${String(Math.round((t % 1) * 60)).padStart(2, '0')}</text>`; });
  const a = 9 + 33 / 60, b = 10;
  s += `<line x1="${x(a)}" y1="70" x2="${x(a)}" y2="96" stroke="#E8E4DC" stroke-width="2"/><circle cx="${x(a)}" cy="96" r="4.5" fill="#E8E4DC"/>`;
  s += `<text x="${x(a)}" y="58" text-anchor="middle" font-size="14" letter-spacing="1.5">YOU SEE IT · 9:33 LOCAL</text>`;
  s += `<line x1="${x(b)}" y1="70" x2="${x(b)}" y2="96" stroke="#F5D398" stroke-width="2"/><circle cx="${x(b)}" cy="96" r="4.5" fill="#F5D398"/>`;
  s += `<text x="${x(b)}" y="58" text-anchor="end" font-size="14" letter-spacing="1.5" fill="#F5D398">TABLE · 10:00 PARIS</text>`;
  s += `<path d="M${x(a)} 150 L${x(b)} 150" stroke="#F5D398" stroke-width="1.2"/><path d="M${x(a)} 144 v12 M${x(b)} 144 v12" stroke="#F5D398" stroke-width="1.2"/>`;
  s += `<text x="${(x(a) + x(b)) / 2}" y="180" text-anchor="middle" class="ser" font-size="27" fill="#F5D398">27 minutes ≈ 7° west of Paris</text></svg>`; return s; })();
B({ id: 'iotables', act: A4, title: 'Tables of Io', sec: 'jupiter', seg: 3, min: 0.3, dur: 5, cam: jCam(370, { shift: [-.24, -.1] }),
  p: { jt: 62.97 }, fig: ioFig, figpos: 'fp-r', figd: 1.6,
  h: 'A clock everybody can read', l: 'Astronomers printed tables of Io’s eclipses in Paris time. Compare with your own clock.', tpos: 'tl', tdelay: 1.2,
  cue: 'Tables: you see it at 9:33 local, the table says 10:00 Paris → 27 min ≈ 7° west.' });
B({ id: 'notatsea', act: A4, title: 'Not on a rolling ship', sec: 'jupiter', seg: 4, min: 0.25, env: 'sea', ships: 'title', dur: 6.5, xf: 2.6,
  fromCam: look(at(60, 22, 30), at(430, -180, 220), { fov: 46 }), cam: look(at(60, 22, 7.5), at(430, -180, 140), { fov: 52 }),
  p: { storm: .75, rain: 0, cov: .72, cbase: 520, ctop: 1600, stars: .8, mw: .3, fogD: .0008, glow: 1, moonAz: 44, moonEl: 14, hole: .75, lant0: 1, lant1: 1, lant2: 1, lant3: 1, sink: 0, foam: .7, 'o.con': 0 },
  h: 'On land, beautiful', l: 'On a rolling deck, holding a long telescope on a tiny moon was nearly impossible.', tpos: 'bl', tdelay: 2.4,
  cue: 'Great on land; nearly impossible from a rolling deck.' });

/* ---------------- France remeasured ---------------- */
const frP = { spin: 0, sunAz: -38, sunEl: 22, night: 0, clouds: .12, dim: 0, atmo: 1, det: 0, moonlit: 0, fr: 0, mwS: .3, expoS: 1, even: 0, slices: 0 };
const frCam = (o = {}) => gLook(46.4, 1.0, .3, 18, 0, Object.assign({ fov: 34, shift: [.2, 0] }, o));
B({ id: 'france', act: A4, title: 'France remeasured', sec: 'france', seg: 0, min: 0.4, env: 'space', dur: 7, xf: 2.6,
  fromCam: gLook(46.4, 1.0, 1.2, 10, 0, { fov: 34, shift: [.2, 0] }), cam: frCam(), p: Object.assign({}, frP), show: ['frTrue', 'frOld'],
  plate: { src: 'img/carte2.jpg', side: 'l', cap: 'Carte de France corrigée, 1693: the old outline, and the coast measured by Picard and La Hire. Public domain.', h: '36vh', d: 3.2, cls: 'low' },
  labels: [{ a: G.at(47.9, -6.6), t: 'Old map', cls: 'gold', side: 't', d: 3 }, { a: G.at(46.6, -1.6), t: 'Measured', side: 'r', d: 3.6 }],
  h: 'France remeasured', l: 'From 1679, Picard and La Hire timed Jupiter’s moons all along the coasts.', tpos: 'tl', tcls: 'scrim col', tdelay: 3,
  cue: 'The old outline (gold) and the corrected 1693 coastline; the 1693 map at right.' });
B({ id: 'shrink', act: A4, title: 'France got smaller', sec: 'france', seg: 1, min: 0.3, dur: 6, cam: frCam({ alt: .28 }),
  p: { fr: [1, 5.5, .6] }, show: ['frTrue', 'frOld'],
  labels: [{ a: G.at(48.2, -3.6), t: 'Brittany moves east ~1½°', cls: 'gold', side: 't', d: 4.6 }],
  h: 'France got smaller', l: 'The west coast slides east, by about a degree and a half in places.', tpos: 'tl', tcls: 'scrim col', tdelay: 4,
  cue: 'The old west coast slides east onto the measured one.' });
B({ id: 'louis', act: A4, title: 'As the story goes', sec: 'france', seg: 2, min: 0.3, dur: 5, cam: frCam({ fov: 30 }),
  p: { fr: 1 }, show: ['frTrue'], 
  h: '“More of France than my enemies”', hs: 1, l: 'As the story goes, Louis XIV complained his astronomers had taken more land than any enemy. It may be legend; the error was real.', tpos: 'tl', tcls: 'scrim col', tdelay: 1.4,
  cue: 'Louis XIV’s complaint — told as a story, not a quotation.' });

/* ---------------- the Moon as a clock hand ---------------- */
const MC = G.MOONC.toArray(), mDir = V(MC).normalize().toArray();
const mCam = (k, o = {}) => Object.assign({ p: MC.map((v, i) => v - mDir[i] * k + (i === 1 ? -8 : 0)), t: MC.map((v, i) => v + [-4, 14, 6][i]), fov: 22, shift: [.16, 0] }, o);
B({ id: 'moon', act: A4, title: 'The Moon drifts across the stars', sec: 'moonact', seg: 0, min: 0.3, env: 'space', dur: 8, xf: 2.6,
  fromCam: mCam(420), cam: mCam(270), p: { sunAz: 10, sunEl: 8, moonDrift: [.7, 9, 0, 'lin'], mwS: .5, starsS: 1.2, expoS: 1 }, show: ['lstar'],
  labels: [{ a: 'lstar', t: 'Regulus', cls: 'dim', side: 'r', d: 3 }],
  h: 'A clock hand in the sky', l: 'Every hour the Moon slides across the stars by about its own width.', tpos: 'bl', tdelay: 3,
  cue: 'The Moon drifts against the stars.' });
B({ id: 'lunar', act: A4, title: 'Lunar distances', sec: 'moonact', seg: 1, min: 0.3, dur: 5, cam: mCam(255),
  p: { moonDrift: .7 }, show: ['lstar', 'larc'], labels: [{ a: 'lstar', t: 'Regulus', cls: 'dim', side: 'l' }, { a: 'larc', t: 'Measure this angle', cls: 'gold', side: 't', d: 1.8 }],
  h: 'Measure one angle…', l: '…then hours of arithmetic with tables, on a deck that will not hold still.', tpos: 'bl', tdelay: 1.4,
  cue: 'Lunar distance: an angle, then hours of arithmetic.' });
B({ id: 'act1714', act: A4, title: 'The Longitude Act, 1714', sec: 'moonact', seg: 2, min: .3, dur: 5, cam: mCam(300, { shift: [.34, 0] }),
  p: { moonDrift: .7, blur: [.7, 2.5] }, show: ['lstar'],
  kick: 'The Longitude Act · 1714', h: '£20,000', hs: 3, l: 'Parliament’s prize for a method that worked at sea, to within half a degree.', tpos: 'c', tdelay: 1.2,
  cue: '1714 Longitude Act: up to £20,000.' });
B({ id: 'harrison', act: A4, title: 'John Harrison', sec: 'moonact', seg: 3, min: .25, dur: 5, cam: mCam(320, { shift: [-.1, 0] }),
  p: { moonDrift: .7, blur: [.85, 2] },
  plate: { src: 'img/harrison.jpg', side: 'r', cap: 'John Harrison (1693–1776), by Thomas King, 1767. Public domain.', h: '64vh', d: 1.2 },
  h: 'Not in the sky at all', l: 'A self-taught carpenter from Yorkshire, John Harrison, thought the answer was a clock.', tpos: 'bl', tdelay: 1.6,
  cue: 'John Harrison, carpenter and clockmaker.' });

/* ---------------- Harrison's clocks, then H4 in the studio ---------------- */
const trio = `<div style="display:flex;gap:calc(var(--u)*2.2);align-items:flex-end">${[['h1', 'H1 · 1730–35'], ['h2', 'H2 · 1737–39'], ['h3', 'H3 · 1740–59']].map(([f, c]) =>
  `<figure style="margin:0"><img src="img/${f}.jpg" style="height:40vh;display:block;box-shadow:0 2vh 6vh rgba(0,0,0,.7)"><figcaption style="margin-top:.9em;font:500 calc(var(--u)*.9)/1 Inter;letter-spacing:.2em;color:rgba(230,226,218,.7)">${c}</figcaption></figure>`).join('')}</div>
  <div style="margin-top:1.4em;font:400 calc(var(--u)*.78)/1.4 Inter;letter-spacing:.05em;color:rgba(225,222,214,.45)">Royal Observatory Greenwich. Photos: Tatters (CC BY-SA 2.0); Tony Hisgett (CC BY 2.0).</div>`;
B({ id: 'h1h3', act: A4, title: 'Three big sea clocks', sec: 'moonact', seg: 3, min: 0.15, dur: 4.5, cam: mCam(340, { shift: [-.1, 0] }),
  say: 'He spent thirty years on it. Three big sea clocks — H1, H2, H3 — each better than the last. And then he went small.',
  p: { moonDrift: .7, blur: [1, 1.5], moonV: [0, 1.6] }, fig: trio, figpos: 'fp-tr', figd: 1,
  h: 'Thirty years, three sea clocks', hs: 1, l: 'Each better than the last. Then he went small.', tpos: 'bl', tdelay: 1.6,
  cue: 'Harrison’s H1, H2 and H3 (photos).' });
const wCam = (az, el, d, o = {}) => Object.assign({ orb: true, c: [0, .12, 0], d, az, el, fov: 30 }, o);
const h4P = { h4open: 0, h4spin: 0, h4bg: 1, blur: 0 };
B({ id: 'h4', act: A4, title: 'H4', sec: 'h4', seg: 0, min: 0.35, env: 'studio', dur: 8, xf: 3,
  fromCam: wCam(-38, 12, 8.5, { shift: [.2, 0] }), cam: wCam(-16, 6, 6.0, { shift: [.2, 0], c: [0, .2, 0] }), p: Object.assign({}, h4P), drift: { az: .9, el: 0 }, driftFor: 120,
  kick: 'John Harrison · 1759', h: 'H4', hs: 3, l: 'About five inches across. It ticks five times a second. In 1761 it sailed from Portsmouth to Jamaica: 81 days at sea.', tpos: 'bl', tdelay: 3.2,
  cue: 'H4 in 3D, turning slowly: the dial, the blued hands. 81 days to Jamaica.' });
B({ id: 'vote', act: A4, title: 'Vote: how much did it lose?', sec: 'h4', seg: 1, min: .35, dur: 7, camEase: 'io',
  cam: wCam(200, 14, 5.4, { c: [0, .1, 0], shift: [-.27, 0] }), drift: { az: .6 }, driftFor: 120,
  labels: [{ a: 'balance', t: 'Balance · 5 beats a second', cls: 'pill', side: 'r', d: 5.5 }],
  h: 'How much time did it lose in 81 days?', hs: 1, l: 'Show of hands, or in the chat.', tpos: 'tr', tdelay: 4.6,
  cue: 'THE VOTE. Camera turns to the movement: gears turning, the balance beating. No answer shown.' });
B({ id: 'reveal', act: A4, title: 'About five seconds', sec: 'h4', seg: 2, min: .25, dur: 6.5, cam: wCam(14, 4, 7.6, { shift: [-.04, 0], c: [0, 1.12, 0] }), drift: { az: -.5 },
  plate: { src: 'img/h4.jpg', side: 'r', cap: 'H4, Royal Observatory Greenwich. Photo: Colonel Warden, CC BY-SA 3.0.', h: '60vh', d: 3.5 },
  h: 'About five seconds', hs: 1.75, l: 'Five seconds, in 81 days at sea.', tpos: 'tl', tdelay: 2.4,
  cue: 'Reveal: about five seconds in 81 days. Photo of the real H4.',
  notes: `H4's 5-second error on the Jamaica voyage was 75″, about 1.25′ of longitude. That's roughly a nautical mile at the equator and a bit less on the way to Jamaica.` });
const errFig = (() => { const X = m => 30 + m / 30 * 780; let s = `<svg width="900" height="230" viewBox="0 0 860 220">`;
  s += `<line x1="${X(0)}" y1="120" x2="${X(30)}" y2="120" stroke="rgba(232,228,220,.4)" stroke-width="1"/>`;
  [0, 10, 20, 30].forEach(m => { s += `<line x1="${X(m)}" y1="116" x2="${X(m)}" y2="124" stroke="rgba(232,228,220,.45)"/><text x="${X(m)}" y="146" text-anchor="middle" font-size="14" fill="rgba(232,228,220,.55)">${m}′</text>`; });
  s += `<rect x="${X(0)}" y="104" width="${X(1.25) - X(0)}" height="16" fill="#F5D398"/>`;
  s += `<text x="${X(0)}" y="88" font-size="15" letter-spacing="1.6" fill="#F5D398">H4 · 5 s OF TIME = 1¼′ OF LONGITUDE ≈ A MILE</text>`;
  s += `<line x1="${X(30)}" y1="96" x2="${X(30)}" y2="124" stroke="#E8E4DC" stroke-width="2"/><text x="${X(30)}" y="88" text-anchor="end" font-size="15" letter-spacing="1.6">PRIZE LIMIT · 30′ (½°)</text>`;
  s += `<text x="${X(15)}" y="200" text-anchor="middle" class="ser" font-size="30" fill="#F5D398">More than twenty times better than required</text>`;
  s += `<text x="${X(0)}" y="170" font-size="12.5" fill="rgba(232,228,220,.5)">arc-minutes of longitude · Earth turns 15″ of arc every second</text></svg>`; return s; })();
B({ id: 'h4error', act: A4, title: 'Five seconds ≈ a mile', sec: 'h4', seg: 3, min: .35, dur: 5, cam: wCam(-30, 10, 7, { shift: [.25, 0], c: [0, -.3, 0] }), p: { h4bg: .6 },
  fig: errFig, figpos: 'fp-b', figd: 1.4,
  h: 'Five seconds ≈ a mile', hs: 1, l: 'The prize asked for half a degree.', tpos: 'tl', tdelay: 1,
  cue: '5 s → 1¼′ of longitude ≈ a mile, against the 30′ allowed.',
  notes: `It all comes from one fact: Earth turns 360° in 24 hours.
1 hour of time = 15° of longitude
4 minutes of time = 1°
1 minute of time = 15 arcminutes (15′)
4 seconds of time = 1 arcminute (1′)
1 second of time = 15 arcseconds (15″)
At the equator, 1′ of longitude is 1 nautical mile. So 1 minute of clock error is about 15 nautical miles, and 1 second is about a quarter mile. Farther from the equator, the meridians squeeze together and the distances shrink. At Greenwich's latitude they're only about 62% as big.
H4's 5-second error on the Jamaica voyage was 75″, about 1.25′ of longitude. That's roughly a nautical mile at the equator and a bit less on the way to Jamaica.` });
const prizeFig = (() => { const X = v => 30 + v / 20000 * 780; let s = `<svg width="900" height="200" viewBox="0 0 860 190">`;
  s += `<rect x="${X(0)}" y="80" width="${X(10000) - X(0)}" height="26" fill="#F5D398"/><rect x="${X(10000) + 2}" y="80" width="${X(18750) - X(10000) - 2}" height="26" fill="#C9A86A"/>`;
  s += `<rect x="${X(18750) + 2}" y="80.5" width="${X(20000) - X(18750) - 3}" height="25" fill="none" stroke="rgba(232,228,220,.55)" stroke-dasharray="3 3"/>`;
  s += `<text x="${X(0)}" y="66" font-size="14" letter-spacing="1.4" fill="#F5D398">£10,000 · 1765</text><text x="${X(10000) + 8}" y="66" font-size="14" letter-spacing="1.4" fill="#C9A86A">£8,750 · 1773, from Parliament</text>`;
  s += `<text x="${X(20000)}" y="134" text-anchor="end" font-size="14" letter-spacing="1.4" fill="rgba(232,228,220,.6)">£1,250 never paid</text>`;
  s += `<text x="${X(0)}" y="134" font-size="13" fill="rgba(232,228,220,.5)">of the £20,000 prize</text>`;
  s += `<text x="${X(0)}" y="176" class="ser" font-size="30" fill="#F5D398">£18,750 in pieces · paid in full to no one</text></svg>`; return s; })();
B({ id: 'prize', act: A4, title: 'The prize, in pieces', sec: 'h4', seg: 4, min: .35, dur: 6, cam: wCam(160, 18, 7, { shift: [.25, 0], c: [0, -.3, 0] }), p: { h4bg: .45 },
  fig: prizeFig, figpos: 'fp-b', figd: 1.4,
  h: 'Paid in pieces', hs: 1, l: 'Harrison was 80 when Parliament paid the last of it, after King George III took his side.', tpos: 'tl', tdelay: 1,
  cue: 'The money: £10,000 (1765) + £8,750 (1773) = £18,750; the full prize was never paid.' });
})();
