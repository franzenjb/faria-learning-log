/* beats_v3.js — LONGITUDE (v3, the hybrid). Built after the v2 beat files load: it snapshots their resolved states,
   keeps only the big cinematic moments, and interleaves calm, traditional slides (js/slides.js). Every beat has a spoken
   script (say), speaker notes (notes, shown with P), and an on-screen cue.
   kind: 'cinema' (WebGL) or 'slide'. Times (min) total 30:00, then 15 minutes of Q&A. */
(function(){
const W = World, H = W.BH, G = H.G, RAD = H.RAD;
const { gOrb } = H;
W.resolve();                                   // resolve the v2 list once, so each kept beat carries its full v2 state
const OLD = {}; W.beats.forEach(b => { OLD[b.id] = b; });
const L = [];
/* keep a v2 cinematic beat. Parameters it inherited in v2 are set instantly here (the slide before it hides the jump);
   its own tweens (the noon sweep, the spin, the sinking lanterns) play exactly as before. */
function cine(id, o = {}){
  const s = OLD[id]; if (!s) throw new Error('v3: no v2 beat ' + id);
  const own = s.p || {}, p = {};
  for (const k in s.R){ const v = s.R[k]; if (k in own || k.startsWith('o.')) p[k] = v; else p[k] = [Array.isArray(v) ? v[0] : v, .01]; }
  if (o.dropO) for (const k in p) if (k.startsWith('o.')) delete p[k];
  Object.assign(p, o.p || {});
  const b = Object.assign({}, s, o, { p, kind: 'cinema' }); delete b.R; delete b.i; delete b.dropO;
  if (o.id && o.id !== id) b.base = id;
  L.push(b); return b; }
function slide(o){ const b = Object.assign({ env: 'slide', dur: 2.5, kind: 'slide' }, o); b.cue = b.cue || ('Slide: ' + (o.slide.h || '').replace(/<[^>]+>/g, ' ')); L.push(b); return b; }

const A0 = 'Opening', A1 = 'The wreck', A2 = 'Latitude is easy', A3 = 'Longitude is time', A4 = 'The prize', A5 = 'Clocks in the sky',
  A6 = 'Harrison’s clocks', A7 = 'Railroads & time zones', A8 = 'Greenwich wins', A9 = 'Today';

/* ---------- shared speaker-note blocks ---------- */
const CONV = `TIME → LONGITUDE (Earth turns 360° in 24 hours)
1 hour of time = 15° of longitude
4 minutes = 1°
1 minute = 15′ (arcminutes)
4 seconds = 1′
1 second = 15″ (arcseconds)
1′ of longitude ≈ 1 nautical mile at the equator; at Greenwich’s latitude (51.5° N) about 62% of that. So 1 minute of clock error ≈ 15 nautical miles at the equator; 1 second ≈ a quarter mile.
H4: 5 seconds of time = 75″ ≈ 1.25′ of longitude ≈ roughly a nautical mile at the equator (a bit less on the way to Jamaica).`;
const NOON = `SPEED OF NOON: noon (the Sun’s highest point) sweeps west 1° every 4 minutes, 1′ every 4 seconds. At New York’s latitude (40.7° N) that is about 13 miles a minute, roughly 790 mph. At the equator ≈ 1,040 mph; at Greenwich ≈ 650 mph. Every meridian has its own noon: between New York and Memphis there are endless noons.
City noons after New York: Philadelphia +5 min, Pittsburgh +24, Nashville +51, Memphis +64 (≈ 15°), Denver ≈ +2 h (≈ 30°), Los Angeles ≈ +3 h (≈ 45°).`;
const RAIL = `RAILROADS: Until 1883 every town kept its own local noon: hundreds of local times; US railroads ran on dozens of them. On 18 November 1883, the ‘Day of Two Noons’, the railroads switched to four standard zones on the 75°, 90°, 105° and 120° W meridians (William F. Allen’s plan). Towns in the eastern half of each zone set clocks back and heard noon twice. Many towns resisted ‘railroad time’; Congress made it law only in 1918 (Standard Time Act).`;
const ZONES = `ZONES TODAY: centred on multiples of 15° from Greenwich: Eastern 75° W (UTC−5), Central 90° W (−6), Mountain 105° W (−7), Pacific 120° W (−8). In theory ±7.5° wide; in practice bent to state and county lines (Detroit on Eastern, El Paso on Mountain; Arizona skips DST).
DOWD & FLEMING: Dowd argued for the US only, and his first plan (~1870) used the Washington meridian, not Greenwich. Sandford Fleming, a Canadian railway engineer, pushed 24 world zones from 1879.`;
const WORLD = `AFTER 1884: the conference adopted Greenwich and a universal day, but NOT Fleming’s zones. Countries joined one by one: Japan 1888, much of Europe in the 1890s, France 1911, the Netherlands 1940. Oddities today: India +5½, Nepal +5¾, and all of China on one zone though it spans about five.`;
const JEFF = `JEFF’S TWO TALKING POINTS
1. Denver was ~28° west on many American maps: measured from Washington, D.C. (Naval Observatory, 77°03′ W of Greenwich), not from Greenwich (105° W).
2. The railroads moved first: their 1883 zones were already Greenwich-based, a year before the 1884 International Meridian Conference in Washington. That head start helped Greenwich win. France abstained and kept Paris until 1911.`;

/* ---------- small Tufte figures (inline SVG; one accent: gold) ---------- */
const INK = 'rgba(232,228,220,.62)', DIM = 'rgba(232,228,220,.42)', GOLD = '#F5D398';
const svg = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 15}" ${o.a ? `text-anchor="${o.a}"` : ''} ${o.c ? `fill="${o.c}"` : ''} ${o.cls ? `class="${o.cls}"` : ''} ${o.ls ? `letter-spacing="${o.ls}"` : ''}>${s}</text>`;

const figNoonSun = svg(600, 330, (() => { let s = ''; const ox = 300, oy = 250;
  s += `<line x1="30" y1="${oy}" x2="570" y2="${oy}" stroke="${INK}" stroke-width="1.2"/>`;
  s += `<path d="M60 ${oy} Q300 ${oy - 250} 540 ${oy}" fill="none" stroke="${DIM}" stroke-width="1.2" stroke-dasharray="4 5"/>`;
  const sx = 300, sy = oy - 125; s += `<circle cx="${sx}" cy="${sy}" r="9" fill="${GOLD}"/>`;
  s += `<line x1="${ox - 150}" y1="${oy}" x2="${sx}" y2="${sy}" stroke="${GOLD}" stroke-width="1.6"/>`;
  const ang = Math.atan2(125, 150); s += `<path d="M${ox - 150 + 70} ${oy} A70 70 0 0 0 ${ox - 150 + 70 * Math.cos(ang)} ${oy - 70 * Math.sin(ang)}" fill="none" stroke="${GOLD}" stroke-width="1.4"/>`;
  s += `<circle cx="${ox - 150}" cy="${oy}" r="4" fill="#E8E4DC"/>`;
  s += T(ox - 150, oy + 30, 'YOU', { a: 'middle', fs: 14, ls: 2 }) + T(ox - 150 + 82, oy - 22, 'noon height', { fs: 16, c: GOLD });
  s += T(sx + 18, sy - 12, 'Sun at noon', { fs: 16 }) + T(70, oy + 30, 'horizon', { fs: 14, c: DIM }) + T(470, oy - 58, 'the Sun’s path today', { fs: 14, c: DIM, a: 'middle' });
  s += T(300, 316, 'latitude = 90° − noon height + the Sun’s declination (from a table)', { a: 'middle', fs: 15, c: INK });
  return s; })());

const tConv = `<table class="tt"><tr><th>Time</th><th>Longitude</th></tr>
  <tr><td class="n">24 hours</td><td>360°</td></tr><tr class="hl"><td class="n">1 hour</td><td>15°</td></tr><tr><td class="n">4 minutes</td><td>1°</td></tr>
  <tr><td class="n">1 minute</td><td>15′ <span class="d">(arcminutes)</span></td></tr><tr><td class="n">4 seconds</td><td>1′</td></tr><tr><td class="n">1 second</td><td>15″ <span class="d">(arcseconds)</span></td></tr></table>`;

const figSpeed = svg(620, 300, (() => { let s = ''; const X = v => 20 + v / 1100 * 520;
  const rows = [['Noon at the equator', 1040, INK], ['Noon at New York · 40.7° N', 790, GOLD], ['Noon at Greenwich · 51.5° N', 650, INK], ['An airliner, cruising', 550, DIM]];
  rows.forEach(([n, v, c], i) => { const y = 40 + i * 68; s += T(20, y, n, { fs: 16, c: c === GOLD ? GOLD : 'rgba(232,228,220,.8)' });
    s += `<rect x="20" y="${y + 10}" width="${X(v) - 20}" height="${c === GOLD ? 12 : 8}" fill="${c}"/>`; s += T(X(v) + 10, y + 21, v.toLocaleString('en-US') + ' mph', { fs: 16, c, cls: 'mono' }); });
  return s; })());

const figTowns = (() => { const X = lon => 730 - (lon - 72) / 50 * 660; let s = '', y = 120;
  s += `<line x1="${X(122)}" y1="${y}" x2="${X(72)}" y2="${y}" stroke="${DIM}" stroke-width="1"/>`;
  [75, 90, 105, 120].forEach(l => { s += `<line x1="${X(l)}" y1="${y + 4}" x2="${X(l)}" y2="${y + 10}" stroke="${DIM}"/>` + T(X(l), 262, l + '° W', { a: 'middle', fs: 13, c: DIM, cls: 'mono' }); });
  const C = [['New York', 74.01, '12:00', 1, 1], ['Philadelphia', 75.17, '11:55', -1], ['Pittsburgh', 80.0, '11:36', 1], ['Nashville', 86.78, '11:09', -1], ['Memphis', 90.05, '10:56', 1], ['Denver', 104.99, '≈ 10:00', -1], ['Los Angeles', 118.24, '≈ 9:00', 1]];
  C.forEach(([n, lon, t, up, g]) => { const x = X(lon), c = g ? GOLD : '#E8E4DC'; s += `<circle cx="${x}" cy="${y}" r="${g ? 6 : 4.5}" fill="${c}"/>`;
    s += `<line x1="${x}" y1="${y + (up > 0 ? -9 : 9)}" x2="${x}" y2="${y + (up > 0 ? -26 : 26)}" stroke="${DIM}"/>`;
    if (up > 0){ s += T(x, y - 58, n, { a: 'middle', fs: 15, c: g ? GOLD : 'rgba(232,228,220,.85)' }) + T(x, y - 36, t, { a: 'middle', fs: 16, c, cls: 'mono' }); }
    else { s += T(x, y + 48, n, { a: 'middle', fs: 15, c: 'rgba(232,228,220,.85)' }) + T(x, y + 70, t, { a: 'middle', fs: 16, c, cls: 'mono' }); } });
  s += T(X(122), 22, 'SUN TIME IN EACH CITY WHEN IT IS NOON IN NEW YORK', { fs: 12.5, ls: 1.8, c: DIM });
  return svg(760, 280, s); })();

const clockFace = (cx, cy, r, hh, mm, name, gold) => { let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(232,228,220,.55)" stroke-width="1.4"/>`;
  for (let i = 0; i < 12; i++){ const a = i * 30 * RAD, r0 = i % 3 ? r * .9 : r * .82; s += `<line x1="${cx + Math.sin(a) * r0}" y1="${cy - Math.cos(a) * r0}" x2="${cx + Math.sin(a) * r}" y2="${cy - Math.cos(a) * r}" stroke="rgba(232,228,220,.6)" stroke-width="${i % 3 ? 1 : 1.8}"/>`; }
  const ha = ((hh % 12) + mm / 60) * 30 * RAD, ma = mm * 6 * RAD, c = gold ? GOLD : '#E8E4DC';
  s += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.sin(ha) * r * .55}" y2="${cy - Math.cos(ha) * r * .55}" stroke="${c}" stroke-width="3.4" stroke-linecap="round"/>`;
  s += `<line x1="${cx}" y1="${cy}" x2="${cx + Math.sin(ma) * r * .82}" y2="${cy - Math.cos(ma) * r * .82}" stroke="${c}" stroke-width="1.9" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="3.2" fill="${c}"/>`;
  s += T(cx, cy + r + 34, name, { a: 'middle', fs: 15, ls: 2, c: gold ? GOLD : 'rgba(232,228,220,.85)' }); return s; };
const figClocks = svg(560, 330, clockFace(130, 120, 92, 12, 0, 'YOUR NOON · 12:00', true) + clockFace(430, 120, 92, 17, 0, 'HOME CLOCK · 5:00 P.M.')
  + T(280, 312, '5 hours × 15° = 75° west of home', { a: 'middle', fs: 27, cls: 'ser', c: GOLD }));

const tAct = `<table class="tt"><tr><th>Accuracy at sea</th><th></th><th>Prize</th></tr>
  <tr><td>1°</td><td class="d">60 nautical miles</td><td class="n">£10,000</td></tr>
  <tr><td>⅔°</td><td class="d">40 nautical miles</td><td class="n">£15,000</td></tr>
  <tr class="hl"><td>½°</td><td class="d">30 nautical miles</td><td class="n">£20,000</td></tr></table>`;

const figIo = svg(720, 210, (() => { const x = t => 40 + (t - 9.25) / .85 * 640; let s = `<line x1="${x(9.25)}" y1="100" x2="${x(10.1)}" y2="100" stroke="${DIM}"/>`;
  [9.25, 9.5, 9.75, 10].forEach(t => { s += `<line x1="${x(t)}" y1="96" x2="${x(t)}" y2="104" stroke="${DIM}"/>` + T(x(t), 128, `${Math.floor(t)}:${String(Math.round((t % 1) * 60)).padStart(2, '0')}`, { a: 'middle', fs: 14, c: DIM, cls: 'mono' }); });
  const a = 9 + 33 / 60, b = 10;
  s += `<line x1="${x(a)}" y1="70" x2="${x(a)}" y2="100" stroke="#E8E4DC" stroke-width="2"/><circle cx="${x(a)}" cy="100" r="5" fill="#E8E4DC"/>` + T(x(a), 58, 'YOU SEE IO VANISH · 9:33 YOUR TIME', { a: 'middle', fs: 14, ls: 1.4 });
  s += `<line x1="${x(b)}" y1="70" x2="${x(b)}" y2="100" stroke="${GOLD}" stroke-width="2"/><circle cx="${x(b)}" cy="100" r="5" fill="${GOLD}"/>` + T(x(b) + 30, 58, 'THE TABLE · 10:00 PARIS', { a: 'end', fs: 14, ls: 1.4, c: GOLD });
  s += `<path d="M${x(a)} 152 H${x(b)} M${x(a)} 146 v12 M${x(b)} 146 v12" stroke="${GOLD}" stroke-width="1.2"/>` + T((x(a) + x(b)) / 2, 192, '27 minutes ≈ 7° west of Paris', { a: 'middle', fs: 27, cls: 'ser', c: GOLD });
  return s; })());

const figErr = svg(800, 250, (() => { const X = m => 30 + m / 60 * 740; let s = `<line x1="${X(0)}" y1="130" x2="${X(60)}" y2="130" stroke="${DIM}"/>`;
  [0, 10, 20, 30, 40, 50, 60].forEach(m => { s += `<line x1="${X(m)}" y1="126" x2="${X(m)}" y2="134" stroke="${DIM}"/>` + T(X(m), 156, m + '′', { a: 'middle', fs: 14, c: DIM, cls: 'mono' }); });
  [[30, '£20,000'], [40, '£15,000'], [60, '£10,000']].forEach(([m, p]) => { s += `<line x1="${X(m)}" y1="92" x2="${X(m)}" y2="130" stroke="rgba(232,228,220,.7)" stroke-width="1.4"/>` + T(X(m), 82, p, { a: m === 60 ? 'end' : 'middle', fs: 15, c: 'rgba(232,228,220,.85)', cls: 'mono' }); });
  s += `<rect x="${X(0)}" y="112" width="${Math.max(3, X(1.25) - X(0))}" height="18" fill="${GOLD}"/>`;
  s += `<path d="M${X(1.25) + 4} 112 L${X(6)} 62" stroke="${GOLD}" stroke-width="1"/>` + T(X(6) + 6, 56, 'H4 · 1.25′ ≈ one nautical mile', { fs: 17, c: GOLD });
  s += T(X(0), 196, 'ERROR IN LONGITUDE, ARCMINUTES · THE ACT’S THREE PRIZE LIMITS', { fs: 12.5, ls: 1.6, c: DIM });
  s += T(X(30), 236, 'About 24 times better than the top prize required', { a: 'middle', fs: 26, cls: 'ser', c: GOLD });
  return s; })());

const figTimeline = svg(800, 250, (() => { const X = y => 50 + (y - 1840) * 8.6; let s = `<line x1="${X(1840)}" y1="125" x2="${X(1922)}" y2="125" stroke="${DIM}"/>`;
  [1840, 1860, 1880, 1900, 1920].forEach(y => { s += T(X(y), 236, y, { a: 'middle', fs: 13, c: DIM, cls: 'mono' }); });
  const E = [[1847, 'Britain', 'railway time', 1], [1868, 'New Zealand', 'one national time', -1], [1870, 'Dowd proposes', 'hour-wide zones', 1], [1883, 'US railroads', 'four zones', -1, 1], [1884, 'Greenwich', 'chosen as zero', 1], [1918, 'US law', 'Standard Time Act', -1]];
  E.forEach(([y, a, b, up, g]) => { const x = X(y), c = g ? GOLD : '#E8E4DC'; s += `<circle cx="${x}" cy="125" r="${g ? 6 : 4.5}" fill="${c}"/><line x1="${x}" y1="${125 - up * 9}" x2="${x}" y2="${125 - up * 30}" stroke="${DIM}"/>`;
    const y0 = up > 0 ? 50 : 172; s += T(x, y0, y, { a: 'middle', fs: 15, c, cls: 'mono' }) + T(x, y0 + 19, a, { a: 'middle', fs: 14.5, c: g ? GOLD : 'rgba(232,228,220,.88)' }) + T(x, y0 + 37, b, { a: 'middle', fs: 13.5, c: DIM }); });
  return s; })());

const tZero = `<table class="tt"><tr><th>Zero at</th><th>Used by</th><th>From Greenwich</th></tr>
  <tr class="hl"><td>Greenwich</td><td class="d">Britain, most sea charts</td><td class="n">0°</td></tr>
  <tr><td>Paris</td><td class="d">France</td><td class="n">2°20′ E</td></tr>
  <tr><td>Washington</td><td class="d">many US maps</td><td class="n">77°03′ W</td></tr>
  <tr><td>Ferro (El Hierro)</td><td class="d">older European maps</td><td class="n">17°40′ W</td></tr>
  <tr><td>Cádiz</td><td class="d">Spain</td><td class="n">6°12′ W</td></tr>
  <tr><td>Pulkovo</td><td class="d">Russia</td><td class="n">30°19′ E</td></tr></table>`;

const figDenver = svg(760, 270, (() => { const X = lon => 720 - lon * 6.3; let s = `<line x1="${X(112)}" y1="140" x2="${X(-4)}" y2="140" stroke="${DIM}"/>`;
  const P = [['Greenwich', 0, '0°'], ['Washington', 77.05, '77° W'], ['Denver', 104.99, '105° W']];
  P.forEach(([n, l, t], i) => { const x = X(l); s += `<circle cx="${x}" cy="140" r="${i === 2 ? 6 : 4.5}" fill="${i === 2 ? GOLD : '#E8E4DC'}"/>` + T(x, 172, n, { a: 'middle', fs: 15.5, c: i === 2 ? GOLD : 'rgba(232,228,220,.88)' }) + T(x, 192, t, { a: 'middle', fs: 13, c: DIM, cls: 'mono' }); });
  s += `<path d="M${X(0)} 110 V96 H${X(104.99)} V110" fill="none" stroke="rgba(232,228,220,.75)" stroke-width="1.2"/>` + T((X(0) + X(104.99)) / 2, 84, '105° west of Greenwich', { a: 'middle', fs: 17 });
  s += `<path d="M${X(77.05)} 212 V226 H${X(104.99)} V212" fill="none" stroke="${GOLD}" stroke-width="1.4"/>` + T((X(77.05) + X(104.99)) / 2, 254, '28° west of Washington', { a: 'middle', fs: 17, c: GOLD });
  return s; })());

/* ======================= OPENING & I · THE WRECK ======================= */
cine('title', { act: A0, title: 'Longitude', min: .5,
  kick: 'Where am I?', h: 'Longitude', hs: 2, l: 'How a clock told sailors where they were.', cred: 'Jeff Franzen &ensp;·&ensp; Disaster GIS &ensp;·&ensp; American Red Cross',
  say: 'Tonight is about one number. Not latitude, the easy one. Longitude: how far east or west you are. For most of history, at sea, nobody could find it. Let me show you what that cost.',
  notes: 'Talk: 30 minutes, then 15 minutes of questions.\nKeys: → or Space next · ← back · P presenter view (this) · F full screen · B black screen · G overview.\nThe spine of the talk: longitude is a time problem, and a clock solved it.' });
cine('storm', { act: A1, min: .6,
  l: 'Admiral Shovell brings the fleet home from the failed siege of Toulon.',
  say: 'October 1707. Admiral Sir Cloudesley Shovell is bringing the British fleet home from the Mediterranean, after the failed siege of Toulon. Days of storm and cloud. No Sun, no stars: no way to check where they are.',
  notes: 'Toulon, summer 1707: Prince Eugene of Savoy attacked by land, Shovell supported from the sea. The siege failed in August, but the French scuttled much of their own fleet in the harbour to protect it.\nShovell left about 15 ships at Gibraltar and sailed for England in late September with about 21.\nNobody ashore knew where the fleet was day to day: news travelled only by dispatch boats and post riders.' });
cine('believed', { act: A1, min: .5,
  show: [], dropO: true, h: '', l: '',                 // no tracks, no dots, no headline
  cam: OLD.actual.cam,                                  // same framing as the next beat, so only the words change
  labels: [
    { a: G.at(49.45, -4.2), t: 'They Believed They Were Here', cls: 'ser nodot', side: 'b', d: 2.4 },
    { a: G.at(50.35, -4.9), t: 'Cornwall', cls: 'dim nodot', side: 'r' },
    { a: G.at(48.45, -4.1), t: 'Brittany', cls: 'dim nodot', side: 'r' } ],
  say: 'On the twenty-second, the navigators compare their reckonings. They believed they were here: safely west of Brittany, heading into the Channel.',
  notes: 'Dead reckoning: speed × time × heading, from the last known position. After days of storm, small errors pile up.' });
cine('actual', { act: A1, min: .5,
  show: [], dropO: true, h: '', l: '',
  labels: [
    { a: G.at(49.45, -4.2), t: 'They Believed They Were Here', cls: 'ser nodot', side: 'b', d: 0 },
    { a: G.at(49.872, -6.43), t: 'But They Were Here', cls: 'ser gold nodot', side: 't', d: 1.2 },
    { a: G.at(50.35, -4.9), t: 'Cornwall', cls: 'dim nodot', side: 'r' },
    { a: G.at(48.45, -4.1), t: 'Brittany', cls: 'dim nodot', side: 'r' } ],
  say: 'But they were here: farther north and west, heading straight for the Isles of Scilly, off the tip of Cornwall.',
  notes: 'Historians also blame charts that put Scilly in the wrong place, and poor latitude after days without a sight. But the problem no one at sea could solve was longitude.' });
cine('rocks', { act: A1, min: .45,
  say: 'About eight at night, in the dark and the rain, the flagship Association hits the Western Rocks. Three more ships follow her.',
  notes: 'Lost: Association (flagship), Eagle, Romney and Firebrand. The Phoenix also struck but survived.' });
cine('toll', { act: A1, min: .55, show: ['debris'], p: { 'o.debris': [1, 2.4, .4] },   // wreckage fades up as the camera settles
  h: 'Four ships.<br>About 1,400 to 2,000 men.', l: 'Shovell among them: one of the worst disasters in Royal Navy history.',
  say: 'Four ships. Somewhere between fourteen hundred and two thousand men. Shovell himself among them. All because they did not know where they were.',
  notes: 'Estimates of the dead range from about 1,400 to 2,000. Shovell’s body washed ashore at Porthellick Cove on St Mary’s.' });
slide({ id: 'shovell', act: A1, title: 'Sir Cloudesley Shovell', min: .5,
  slide: { lay: 'half-r', img: 'img/shovell_dahl.jpg', pos: 'center 25%', kick: 'The admiral', h: 'Sir Cloudesley Shovell',
    lines: ['One of Britain’s most celebrated admirals.', 'He sailed with the best navigators in the fleet.', 'They still could not tell how far west they were.'],
    cap: 'Michael Dahl, 1702. Royal Museums Greenwich. Public domain.' },
  say: 'This was no amateur. Shovell was one of the most famous admirals in Britain, with the best navigators the navy had. And still, nobody aboard could tell how far west they were.',
  notes: 'Shovell (1650–1707) rose from cabin boy to Admiral of the Fleet. Successful at Toulon in the sense that the French fleet was knocked out for years.' });
slide({ id: 'whatwrong', act: A1, title: 'What went wrong?', min: .5,
  slide: { lay: 'full', img: 'img/wreck_rmg.jpg', pos: 'center 40%', kick: 'What went wrong?', h: 'Not latitude.<br><em>Longitude.</em>',
    lines: ['Bad charts. Bad weather.', 'And one problem no one at sea could solve: how far east or west they were.'],
    cap: 'Shovell’s fleet lost on the rocks of Scilly, c. 1710. Royal Museums Greenwich. Public domain.' },
  say: 'Bad charts, bad weather. But underneath it all, one problem nobody at sea could solve: how far east or west they were. That is longitude, and it is the subject of tonight.',
  notes: 'Latitude = north–south. Longitude = east–west. In 1707 sailors could find the first, at least when they could see the sky.' });

/* ======================= II · LATITUDE IS EASY (two slides) ======================= */
slide({ id: 'lookup', act: A2, title: 'Latitude: look up', min: .6,
  slide: { lay: 'full', img: 'img/sky/sky_polaris.jpg', kick: 'Latitude is easy', h: 'Look up',
    lines: ['The height of the Pole Star above the horizon <em>is</em> your latitude.', 'At the equator it sits on the horizon. At the North Pole, straight overhead.'] },
  say: 'Latitude first, because nature hands it to us. Find the Pole Star. Its height above the horizon is your latitude. On the equator it sits on the horizon; at the North Pole it is straight overhead. In Washington it is about thirty-nine degrees up, and Washington is at thirty-nine degrees north.',
  notes: 'A fist at arm’s length ≈ 10°. Polaris is within about ¾° of the celestial pole.\nThis is the only latitude beat. Keep it brisk: the talk is longitude.' });
slide({ id: 'noonsun', act: A2, title: 'Or the noon Sun', min: .5,
  slide: { lay: 'split', kick: 'By day', h: 'Or the noon Sun', lines: ['At noon, measure how high the Sun stands.', 'A printed table for the date does the rest.'], fig: figNoonSun, figw: 48 },
  say: 'By day, sailors used the Sun. At noon, when it is highest, measure its height. A table for the date tells you where the Sun is in the sky that day, and a little subtraction gives your latitude. Easy.',
  notes: 'latitude = 90° − noon altitude + the Sun’s declination (north positive), for a northern observer with the Sun to the south. Declination tables were printed from the 1400s on.\nNote: noon also matters for longitude. Noon is the moment we will use again in a minute.' });

/* ======================= III · LONGITUDE IS TIME ======================= */
slide({ id: 'nopole', act: A3, title: 'No Pole Star for east and west', min: .55,
  slide: { lay: 'text', kick: 'Longitude is hard', h: 'There is no Pole Star<br>for east and west', lines: ['The sky turns over every meridian alike.', 'East–west position hides in one place: <em>time.</em>'] },
  say: 'Longitude is different. There is no Pole Star for east and west. The whole sky wheels over every meridian the same way. Your east–west position is hidden in one place only: in time.',
  notes: 'Meridians all run pole to pole, and none is special. That is why longitude has no natural zero (we come back to that with Greenwich).' });
cine('fifteen', { act: A3, min: .8,
  say: 'Here is the key idea. The Earth turns once a day: three hundred sixty degrees in twenty-four hours. Watch the Sun stand still while the Earth turns underneath it. One hour passes, and noon slides fifteen degrees west. One hour equals fifteen degrees. Every hour, every time.',
  notes: CONV });
slide({ id: 'convert', act: A3, title: 'The conversion', min: .55,
  slide: { lay: 'split', kick: 'Time is longitude', h: 'The conversion', lines: ['All from one fact: Earth turns 360° in 24 hours.', 'One arcminute of longitude is about one nautical mile at the equator.'], fig: tConv, figw: 36 },
  say: 'So we can convert time straight into longitude. One hour, fifteen degrees. Four minutes, one degree. Four seconds, one minute of arc, which at the equator is about one nautical mile. Remember that one: four seconds, about a mile.',
  notes: CONV });
cine('nyNoon', { act: A3, min: .4,
  say: 'Let’s bring it home, to a map we all know. Here is noon arriving at New York, seventy-four degrees west of Greenwich. The Sun is as high as it will get today.',
  notes: 'New York City Hall: 40.71° N, 74.01° W. The faint dashed lines are the 75°, 90°, 105° and 120° W meridians: remember them for the railroads.' });
cine('walkWest', { act: A3, min: 1.0,
  say: 'Now watch the Earth keep turning. Noon walks west, steadily. Five minutes after New York, it’s noon in Philadelphia. Twenty-four minutes, Pittsburgh. Fifty-one, Nashville. Just over an hour: Memphis, fifteen degrees. Two hours: Denver, thirty degrees. Three hours: Los Angeles, forty-five. That line is moving at about seven hundred ninety miles an hour.',
  notes: NOON + '\n\n' + RAIL + '\n\n' + JEFF });
slide({ id: 'speed', act: A3, title: 'The speed of noon', min: .6,
  slide: { lay: 'split', kick: 'The speed of noon', h: '790 mph', hs: 2, lines: ['Noon crosses one degree every four minutes.', 'At New York’s latitude that is about 13 miles a minute: faster than an airliner.'], fig: figSpeed, figw: 46 },
  say: 'Think about that. Noon is racing across the country at about thirteen miles a minute, seven hundred ninety miles an hour at New York. Faster than the plane you flew in on. At the equator it’s over a thousand.',
  notes: 'Equator: 24,901 mi ÷ 24 h ≈ 1,040 mph. × cos(40.7°) ≈ 790 mph at New York (≈ 13 mi/min). × cos(51.5°) ≈ 650 mph at Greenwich. Airliner cruise ≈ 550 mph.\n' + NOON });
slide({ id: 'ownnoon', act: A3, title: 'Every town had its own noon', min: .6,
  slide: { lay: 'fig', kick: 'Local time', h: 'Every town had its own noon', lines: ['At New York’s noon, Philadelphia’s Sun said 11:55.'], fig: figTowns, figw: 72 },
  say: 'So every town had its own noon, and its own time. When it was noon in New York, Philadelphia’s Sun said five to twelve. Memphis, about four minutes to eleven. Los Angeles, about nine in the morning. Between any two towns there are endless noons. Hold on to that; the railroads will hate it.',
  notes: 'Exact sun-time offsets from New York (74.01° W): PHL 75.17° → −5 min (11:55); PIT 80.0° → −24 (11:36); BNA 86.78° → −51 (11:09); MEM 90.05° → −64 (10:56); DEN 104.99° → −2 h 04 (≈ 9:56); LA 118.24° → −2 h 57 (≈ 9:03).\nEvery town until 1883 set its clocks by its own noon.' });

/* ======================= IV · THE CATCH ======================= */
cine('alone', { act: A3, min: .7,
  say: 'But here is the catch. Take away the cities, the phones, the radio. You are on one small ship in the middle of the Pacific. You can see your own noon: the Sun tells you that. What you cannot see is what time it is back home. And without home’s time, you cannot know how far west you have come.',
  notes: 'This is the eureka: you only know how far you are from home if you know home’s time. On land you could ask; at sea, with no communication, the only way is to carry it.\nThe ship is at 149° W, 75° west of New York: when its Sun is highest, New York’s clock reads 5 p.m.' });
slide({ id: 'twoclocks', act: A3, title: 'Compare two clocks', min: .6,
  slide: { lay: 'split', kick: 'The method', h: 'Compare two clocks', lines: ['Your noon, from the Sun.', 'Home’s time, from a clock you carried.', 'Every hour of difference is 15°.'], fig: figClocks, figw: 42 },
  say: 'So the method is simple. Your noon comes from the Sun. Home’s time comes from a clock you carried with you. If your Sun says noon and the home clock says five, you are five hours, seventy-five degrees, west of home.',
  notes: '5 h × 15° = 75°. One minute of clock error = 15′ of longitude ≈ 15 nautical miles at the equator.\n' + CONV });
cine('carryTime', { act: A3, min: .45,
  say: 'Simple to say. But a clock at sea? It rolls, it pitches, it gets hot and cold and damp, for months. In 1700 the best clocks were pendulum clocks. Put one on a ship and the pendulum goes crazy.',
  notes: 'A pendulum clock good to seconds a day on land could be off by many minutes a day at sea. Newton doubted a sea clock would ever be good enough.' });

/* ======================= V · THE PRIZE ======================= */
slide({ id: 'act1714', act: A4, title: 'The Longitude Act, 1714', min: .75,
  slide: { lay: 'split', kick: 'Parliament · 1714', h: 'The Longitude Act', lines: ['Up to £20,000, about £3–4 million today, for a method that worked at sea.', 'Proved on a voyage to the West Indies.'], fig: tAct, figw: 42 },
  say: 'Seven years after Scilly, Parliament offered a fortune: up to twenty thousand pounds, millions today, for a practical way to find longitude at sea. The closer you got, the more you won: half a degree, thirty nautical miles, for the top prize.',
  notes: 'Longitude Act 1714: £10,000 within 1° (60 nautical miles), £15,000 within ⅔° (40 nmi), £20,000 within ½° (30 nmi), tested on a voyage to the West Indies. £20,000 in 1714 ≈ £3–4 million today. Administered by the Commissioners (later Board) of Longitude.\nHalf a degree of longitude = 2 minutes of time.' });
slide({ id: 'twoideas', act: A4, title: 'Two ideas', min: .4,
  slide: { lay: 'text', kick: 'Two ideas', h: 'Read a clock in the sky,<br>or carry one', lines: ['Astronomers looked up: Jupiter’s moons, and our own Moon.', 'A carpenter named John Harrison built a clock.'] },
  say: 'There were two ways to get home’s time. Read a clock in the sky, which is what the astronomers wanted. Or carry a clock with you, which is what a Yorkshire carpenter wanted. Let’s start in the sky.',
  notes: 'Both methods answer the same question: what time is it at home (Paris, Greenwich) right now?' });

/* ======================= VI · CLOCKS IN THE SKY (Io) ======================= */
slide({ id: 'galileo', act: A5, title: 'Galileo’s moons', min: .55,
  slide: { lay: 'half-l', img: 'img/v3/galileo.jpg', pos: 'center 20%', kick: '1610', h: 'Galileo’s moons',
    lines: ['Four moons circle Jupiter.', 'The innermost, Io, slips into Jupiter’s shadow every 42½ hours.', 'Everyone who sees it, sees it at the same instant.'],
    cap: 'Galileo Galilei, by Justus Sustermans, 1636. Public domain.' },
  say: 'In 1610 Galileo pointed a telescope at Jupiter and found four moons. And he saw something wonderful: they eclipse. Io, the innermost, slips into Jupiter’s shadow every forty-two and a half hours. And everyone who sees it blink out sees it at the same instant. A clock in the sky that the whole Earth can read.',
  notes: 'Io’s period: 1.769 days ≈ 42.5 hours. Galileo proposed using the moons for longitude to Spain and later the Dutch, without success at sea.' });
cine('iolap', { act: A5, min: .45,
  say: 'Here’s Jupiter, with its four moons going round like hands on a clock face. Io laps every forty-two and a half hours.',
  notes: 'The moons: Io, Europa, Ganymede, Callisto (the Galilean moons). Jupiter is ~5 times farther from the Sun than Earth.' });
cine('eclipse', { act: A5, min: .55,
  say: 'Watch Io slide into Jupiter’s shadow. It blinks out. For anyone watching, in Paris, in London, on a mountain in Peru, it happens at the same moment.',
  notes: 'The eclipse is a universal signal, like a time pip on the radio, centuries early. Note: strictly it is seen at the same instant everywhere on Earth, give or take light travel across Earth (0.04 s).' });
slide({ id: 'iotables', act: A5, title: 'Compare with the tables', min: .55,
  slide: { lay: 'fig', kick: 'A clock everyone can read', h: 'Compare with the tables', lines: ['Astronomers printed the eclipse times in Paris time. Note when you see it, and subtract.'], fig: figIo },
  say: 'So astronomers printed tables: the moment of each eclipse, in Paris time. You watch, and see Io vanish at nine thirty-three by your own local clock. The table says ten o’clock in Paris. Twenty-seven minutes of difference: about seven degrees west of Paris.',
  notes: '27 min ÷ 4 min per degree = 6.75° ≈ 7° west of Paris (Paris is 2°20′ E of Greenwich, so ≈ 4.4° W of Greenwich: Brittany).\nCassini published improved tables of Jupiter’s moons in 1668.' });
slide({ id: 'france', act: A5, title: 'France got smaller', min: .55,
  slide: { lay: 'half-l', img: 'img/carte2.jpg', fit: 'contain', kick: 'Cassini & Picard · 1679–1693', h: 'France got smaller',
    lines: ['Timing Io from the coasts, they found the old maps were too wide.', 'The west coast moved east, by about 1½° in places.'],
    cap: 'Carte de France corrigée, 1693: the old outline and the measured coast. Public domain.' },
  say: 'On land it worked beautifully. Jean Picard and the Cassini team timed Io from points all around France. Their new map moved the whole west coast east, by a degree and a half in places. France got smaller.',
  notes: 'Picard and La Hire’s survey from 1679, under the Paris Observatory of Giovanni Domenico Cassini. The corrected map was presented in 1693.' });
slide({ id: 'louis', act: A5, title: 'The king’s joke', min: .45,
  slide: { lay: 'half-r', img: 'img/v3/cassini.jpg', pos: 'center 20%', kick: 'As the story goes', h: '“I have lost more land to my astronomers than to my enemies”', hs: 1,
    lines: ['Louis XIV, on seeing the new map.', 'It may be legend. The shrinking was real.'],
    cap: 'Giovanni Domenico Cassini (1625–1712). Biblioteca Aprosiana. Public domain.' },
  say: 'And the story goes that Louis the Fourteenth looked at the new map and said he had lost more land to his astronomers than to all his enemies. It may be legend, but it’s a good one, and the shrinking was real.',
  notes: 'Attributed to Louis XIV; there is no contemporary source. Tell it as a story.' });
slide({ id: 'romer', act: A5, title: 'Rømer: light has a speed', min: .65,
  slide: { lay: 'half-l', img: 'img/v3/romer.jpg', pos: 'center 25%', kick: 'Paris · 1676', h: 'Io ran late',
    lines: ['Ole Rømer saw Io’s eclipses come late when Earth was far from Jupiter.', 'Up to about 22 minutes, across the width of Earth’s orbit.', 'Light is not instant. It has a speed.'],
    cap: 'Ole Rømer, by Jacob Coning, c. 1700. Public domain.' },
  say: 'And a bonus. A young Danish astronomer in Paris, Ole Rømer, noticed the eclipses ran late when the Earth was on the far side of its orbit from Jupiter. Up to about twenty-two minutes late. His explanation: the light takes time to cross. Hunting for longitude, he found the first evidence that light has a speed.',
  notes: 'Rømer published in 1676 (Journal des sçavans), predicting an eclipse of Io in November 1676 would be about 10 minutes late, and it was. His ~22 minutes for the diameter of Earth’s orbit is too long; the true value is about 16.7 minutes. Huygens turned it into a speed of about 220,000 km/s (true: ~300,000 km/s).' });
cine('notatsea', { act: A5, min: .45, l: 'On a rolling deck, nobody could hold a long telescope on a tiny moon.',
  say: 'But here’s the problem. You need a long telescope, held steady on a tiny moon, on a deck that never stops moving. At sea, it was nearly impossible. Jupiter remapped the land. It couldn’t save a ship.',
  notes: 'Galileo even designed a helmet telescope (the celatone) for use at sea. It did not work.' });

/* ======================= VII · THE MOON vs HARRISON ======================= */
slide({ id: 'maskelyne', act: A6, title: 'The Moon method', min: .55,
  slide: { lay: 'half-r', img: 'img/v3/maskelyne.jpg', fit: 'contain', kick: 'The Moon method', h: 'Nevil Maskelyne',
    lines: ['Measure the angle between the Moon and a star.', 'Look up when, in Greenwich time, the Moon would be there.', 'It worked, after hours of arithmetic.'],
    cap: 'Nevil Maskelyne, Astronomer Royal. Stipple engraving, 1804. Wellcome Collection, CC BY 4.0.' },
  say: 'The astronomers’ best answer was our own Moon. It moves across the stars about its own width every hour, like a clock hand. Measure the angle between the Moon and a bright star, look up in a table when, in Greenwich time, the Moon would be there, and you have home’s time. The champion of this method was Nevil Maskelyne. It worked, but it took hours of arithmetic.',
  notes: 'Lunar distances: the Moon moves ~0.5° (its own diameter) per hour against the stars. Maskelyne tested the method on a 1761 voyage to St Helena and became Astronomer Royal in 1765, a member of the Board of Longitude that judged Harrison.\nEarly on, reducing one lunar took about four hours of calculation; later tables cut it to about 30 minutes.' });
slide({ id: 'almanac', act: A6, title: 'The Nautical Almanac', min: .4,
  slide: { lay: 'half-l', img: 'img/v3/almanac1767.jpg', fit: 'contain', kick: 'The Nautical Almanac · 1767', h: 'Pages of predicted angles',
    lines: ['Moon-to-star distances, every three hours, in Greenwich time.', 'Ships carried it for well over a century.'],
    cap: 'Stars for lunar distances, from Bradley’s observations. Nautical Almanac for 1767. Public domain.' },
  say: 'Maskelyne published the Nautical Almanac in 1767: pages and pages of predicted distances, every three hours, in Greenwich time. That book is one reason the world now counts from Greenwich.',
  notes: 'The Nautical Almanac (from 1767) gave lunar distances at 3-hour intervals of Greenwich time. Navigators worldwide used it, which made Greenwich the de facto zero on sea charts long before 1884.' });
slide({ id: 'harrison', act: A6, title: 'John Harrison', min: .5,
  slide: { lay: 'half-r', img: 'img/harrison.jpg', pos: 'center 25%', kick: 'The clock method', h: 'John Harrison',
    lines: ['A self-taught carpenter from Yorkshire.', 'He thought the answer was not in the sky, but in a clock.'],
    cap: 'John Harrison (1693–1776), by Thomas King, 1767. Public domain.' },
  say: 'Meanwhile, a self-taught carpenter and clockmaker from Yorkshire, John Harrison, thought the astronomers were looking in the wrong place. Forget the sky. Build a clock that keeps home time at sea.',
  notes: 'Harrison (1693–1776), from Foulby and Barrow upon Humber. His early clocks were made almost entirely of wood, and needed no oil.' });
slide({ id: 'h1h3', act: A6, title: 'H1, H2, H3', min: .55,
  slide: { lay: 'trio', kick: 'Thirty years', h: 'H1, H2, H3', lines: ['Big sea clocks, each better than the last. H3 alone took about 19 years.'],
    trio: [['img/h1.jpg', 'H1 · 1730–35'], ['img/h2.jpg', 'H2 · 1737–39'], ['img/h3.jpg', 'H3 · 1740–59']],
    cap: 'Royal Observatory Greenwich. Photos: Tatters (CC BY-SA 2.0); Tony Hisgett (CC BY 2.0).' },
  say: 'He spent thirty years on it. H1, H2, H3: big, beautiful sea clocks, each better than the last. H3 alone took him about nineteen years.',
  notes: 'H1 (1730–35) was tested on a voyage to Lisbon in 1736 and did well. H2 (1737–39) was never sent to sea. H3 (1740–59) introduced the bimetallic strip and the caged roller bearing, still used today.' });
slide({ id: 'jefferys', act: A6, title: 'The breakthrough was small', min: .55,
  slide: { lay: 'text', kick: '1753', h: 'The breakthrough was small', lines: ['A pocket watch made to Harrison’s design by John Jefferys kept surprisingly good time.', 'A small, fast-beating balance could ride out the sea.', 'So Harrison went small.'] },
  say: 'And then the surprise. In 1753 a London watchmaker, John Jefferys, made a pocket watch to Harrison’s design. It kept time far better than anyone expected. A small balance, beating fast, could ride out the motion of a ship. So Harrison stopped building big clocks, and went small.',
  notes: 'The Jefferys watch (1753) is in the Clockmakers’ Museum collection. It had an early form of temperature compensation and a fast balance: the idea behind H4.' });
cine('h4', { act: A6, min: .6,
  kick: 'John Harrison · 1759', l: 'About five inches across. In 1761 it sailed for Jamaica: 81 days at sea.',
  say: 'This is H4, finished in 1759. About five inches across. It looks like a big pocket watch, and it ticks five times a second. In 1761 it sailed from Portsmouth for Jamaica: eighty-one days at sea.',
  notes: 'H4: about 13 cm (5.2 in) across, 1.45 kg. Balance beats 5 times a second (18,000 beats an hour). Voyage on HMS Deptford, November 1761 to January 1762, with Harrison’s son William.' });
cine('vote', { act: A6, min: .55,
  say: 'So here’s my question for you. After eighty-one days at sea, rolling and pitching, how much time do you think H4 had lost? An hour? Ten minutes? A minute? Hands up.',
  notes: 'THE VOTE. Take a few guesses from the room. Do not give the answer on this beat.\nPrompts: an hour? ten minutes? a minute? less?' });
cine('reveal', { act: A6, min: .45,
  say: 'About five seconds. Five seconds in eighty-one days at sea.',
  notes: `About 5.1 seconds lost in 81 days (after allowing for its known rate).\nH4's 5-second error on the Jamaica voyage was 75″, about 1.25′ of longitude. That's roughly a nautical mile at the equator and a bit less on the way to Jamaica.` });
slide({ id: 'h4error', act: A6, title: 'Five seconds ≈ a mile', min: .65,
  slide: { lay: 'fig', kick: 'Jamaica · 1761–62', h: 'Five seconds ≈ a mile', lines: ['About 5.1 seconds in 81 days: 1.25′ of longitude, about one nautical mile.'], fig: figErr, figw: 74 },
  say: 'Here is why that matters. Four seconds of time is one minute of longitude, about a mile. So five seconds put the ship about a mile and a quarter from where the clock said. The top prize asked for thirty miles. Harrison beat it more than twenty times over.',
  notes: 'Jamaica: 1761–62, H4 lost about 5.1 s in 81 days → 5.1 × 15″ ≈ 77″ ≈ 1.25–1.3′ of longitude ≈ about a nautical mile (less at Jamaica’s 18° N: cos 18° ≈ .95). Prize limits: 60′ / 40′ / 30′.\n' + CONV });
slide({ id: 'goalposts', act: A6, title: 'They moved the goalposts', min: .6,
  slide: { lay: 'half-r', img: 'img/v3/k1.jpg', pos: 'center 40%', kick: 'The Board of Longitude', h: 'They moved the goalposts',
    lines: ['A second trial, to Barbados in 1764.', 'Then: take it apart, explain it, have it copied.', 'Larcum Kendall’s copy, K1, sailed with Captain Cook.'],
    cap: 'K1, Larcum Kendall’s copy of H4, 1769. National Maritime Museum. Public domain.' },
  say: 'You’d think he’d get the money. He didn’t. The Board, with astronomers like Maskelyne on it, kept moving the goalposts. Another trial, to Barbados. Then take it apart in front of us. Explain it. Have someone else copy it. That copy, K1, went round the world with Captain Cook, who called it his trusty friend.',
  notes: 'Barbados trial 1764: H4 again within the prize limit (error ~39 s over 47 days, ≈ 10 miles). 1765: the Board paid £10,000 after Harrison disclosed the design; the rest depended on copies working. K1 (Larcum Kendall, 1769) sailed on Cook’s second (1772–75) and third voyages.' });
slide({ id: 'king', act: A6, title: 'The king takes his side', min: .55,
  slide: { lay: 'text', kick: 'George III', h: '“By God, Harrison,<br>I will see you righted!”', lines: ['The king tested a Harrison watch, H5, himself, and took his side.', 'In 1773 Parliament paid Harrison £8,750.', 'About £23,000 in all, over his life. But never the prize as such.'] },
  say: 'Finally Harrison went to the king. George the Third tested his next watch, H5, himself, and is said to have told him: by God, Harrison, I will see you righted. In 1773 Parliament paid him eight thousand seven hundred fifty pounds. He got about twenty-three thousand in all over his life. But never the prize itself. He died three years later.',
  notes: 'The quotation comes from the Harrison family’s account (William Harrison). H5 was tested at the King’s private observatory at Kew in 1772: about 4½ s in 10 weeks. 1773: £8,750 from Parliament. Harrison’s total from the Board and Parliament ≈ £23,000. He died 24 March 1776, aged 82.' });

/* ======================= VIII · WHY CLOCKS WON ======================= */
slide({ id: 'whyclocks', act: A6, title: 'Why clocks won', min: .65,
  slide: { lay: 'half-l', img: 'img/v3/arnold.jpg', pos: 'center 45%', kick: 'Why clocks won', h: 'Minutes, not hours',
    lines: ['A chronometer: read it at noon, compare, done in minutes.', 'The Moon: hours of arithmetic.', 'John Arnold and Thomas Earnshaw made chronometers simpler and cheaper.'],
    cap: 'Marine chronometer by John Arnold & Son, c. 1795. Clockmakers’ Museum, London. Photo: Daderot, CC0.' },
  say: 'In the end, the clock won, for a simple reason. With a chronometer, you take the Sun at noon, read the clock, and you’re done in minutes. The Moon meant hours of arithmetic. And makers like John Arnold and Thomas Earnshaw figured out how to build good chronometers simpler and cheaper. By the 1800s, ships carried two or three of them.',
  notes: 'H4 took years to make and was nearly unaffordable. Arnold (1736–1799) and Earnshaw (1749–1829) developed the spring detent escapement and compensation balance that became the standard marine chronometer. Lunar distances stayed in use as a backup into the 1900s. Ships carried 2–3 chronometers to cross-check.' });

/* ======================= IX · RAILROADS & TIME ZONES ======================= */
slide({ id: 'timeline', act: A7, title: 'Then the railroads came', min: .7,
  slide: { lay: 'fig', kick: 'One time for everyone', h: 'Then the railroads came', lines: ['A ship needed home’s time. A train needed everyone to agree on it.'], fig: figTimeline },
  say: 'Now jump a century, to land. Remember every town with its own noon? Trains made that a daily headache. Britain moved first: by 1847 most British railways ran on Greenwich time. New Zealand set one national time in 1868. And in America, a schoolmaster had an idea.',
  notes: 'Britain: Great Western Railway adopted London time in 1840; most railways on “railway time” (Greenwich) by 1847; most public clocks by 1855; law in 1880.\nNew Zealand, 1868: one standard time for the colony, 11½ h ahead of Greenwich, often called the first national standard time.\nSandford Fleming (Canada) pushed for worldwide hour zones from 1879.\n' + ZONES + '\n' + RAIL });
slide({ id: 'dowd', act: A7, title: 'Charles F. Dowd', min: .65,
  slide: { lay: 'half-r', img: 'img/v3/dowd.jpg', pos: 'center 30%', kick: 'Saratoga Springs, New York', h: 'Charles F. Dowd',
    lines: ['He ran a girls’ school. Around 1870 he proposed national time zones, an hour wide.', 'The railroads took the idea. Others got the credit.', 'In 1904 he was killed by a train at a crossing.'],
    cap: 'Charles Ferdinand Dowd (1825–1904). Library of Congress. Public domain.' },
  say: 'Charles Dowd ran a girls’ school in Saratoga Springs, New York. Around 1870 he started lobbying the railroads for hour-wide time zones. The railroads eventually took the idea, and others got the credit. And in 1904, Dowd was killed by a train at a crossing in Saratoga. A train running on the time zones he helped invent.',
  notes: 'Charles F. Dowd (1825–1904), principal of Temple Grove Seminary for girls, Saratoga Springs. Proposed zones from about 1869–70 and published pamphlets and maps; his later plans were Greenwich-based. US railroads were running on roughly 50–100 different local times. William F. Allen’s 1883 plan got the credit.\nDowd was struck by a train at a Saratoga Springs crossing on 12 November 1904.\n' + ZONES });
slide({ id: 'twonoons', act: A7, title: 'The Day of Two Noons', min: .65,
  slide: { lay: 'half-l', img: 'img/v3/chicago1883.jpg', pos: 'center 45%', kick: '18 November 1883', h: 'The Day of Two Noons',
    lines: ['At noon, the railroads reset their clocks to four standard times.', 'In the east of each zone, clocks went back: noon came twice.', 'The plan was William F. Allen’s.'],
    cap: 'Plaque in Chicago where the railroads adopted standard time, 11 October 1883. Photo: Ken Lund, CC BY-SA 2.0.' },
  say: 'On Sunday, the eighteenth of November 1883, the railroads did it on their own authority. At noon they reset their clocks to four standard times. In the eastern part of each zone, the clocks went back a few minutes, so those towns heard noon twice. They called it the Day of Two Noons. The plan was by a railroad engineer, William F. Allen.',
  notes: 'The General Time Convention adopted Allen’s plan in Chicago on 11 October 1883 (the plaque). Change-over: noon, Sunday 18 November 1883. Many cities followed the railroads; no federal law yet.\n' + RAIL + '\n' + ZONES });
const tzCam = gOrb(30, -97, 3.6, 45, { fov: 34, shift: [-.2, -.12] });
const zl = (lon, name, d) => ({ a: G.at((lon === -90 || lon === -120) ? 51.5 : 47.5, lon, 1.012), t: name, cls: 'nodot', side: 't', d, id: 'tzn' + lon });
const ml = (lon, d) => ({ a: G.at(23.2, lon, 1.012), t: Math.abs(lon) + '° W', cls: 'mono gold nodot', side: 'b', d, id: 'tzm' + lon });
cine('walkWest', { id: 'timezones', act: A7, title: 'Four zones, 15° apart', min: .8, dur: 5, dropO: true, cam: tzCam, camDur: 4.2,
  p: { sunAz: [-51, .01], merLon0: [-96, .01], mer0: [0, .01], slices: [0, .01], clouds: [.12, .01], dim: [.3, .01], sunEl: [24, .01],
    'o.tz1': [1, .3, 1.4, 'out'], 'o.tz2': [1, .3, 2.0, 'out'], 'o.tz3': [1, .3, 2.6, 'out'], 'o.tz4': [1, .3, 3.2, 'out'], 'o.tzMer': [1, .5, .9], 'o.usMer': [0, .5] },
  show: ['tz1', 'tz2', 'tz3', 'tz4', 'tzMer'],
  labels: [ml(-75, 1.0), ml(-90, 1.0), ml(-105, 1.0), ml(-120, 1.0), zl(-75, 'Eastern', 1.6), zl(-90, 'Central', 2.2), zl(-105, 'Mountain', 2.8), zl(-120, 'Pacific', 3.4)],
  h: 'Four zones, 15° apart', hs: 1, l: 'Each one hour wide, centred on 75°, 90°, 105° and 120° west of Greenwich.', tpos: 'tr', tcls: 'col scrim', tdelay: .6, capT: 5.5, odelay: 0,
  cue: 'The US globe holds still; four one-hour bands snap in, one by one, on the gold 75°, 90°, 105° and 120° W meridians.',
  say: 'Here’s what they chose. Four zones, each one hour wide, fifteen degrees. Eastern, centred on seventy-five west. Central on ninety, right by Memphis. Mountain on one-oh-five, Denver. Pacific on one-twenty. It’s the same ladder we walked at noon: New York, Memphis, Denver, Los Angeles.',
  notes: 'Bands are idealised (±7.5° around each meridian). Real 1883 boundaries followed railroad division points and were ragged.\nAlong each gold meridian, clock time matches Sun time; toward the edges of a zone, the clock is off the Sun by up to about 30 minutes or more.\n' + ZONES + '\n\n' + RAIL + '\n\n' + JEFF });
slide({ id: 'tzmap', act: A7, title: 'The zones today', min: .6,
  slide: { lay: 'map', kick: 'Today', h: 'Four zones, one hour apart', lines: ['Each clock sits on its zone’s meridian, where clock noon is Sun noon.', 'The edges bend to state and county lines.'], fig: window.TZMAP_SVG || '' },
  cue: 'A plain US map: four muted zone bands following the real (bent) borders, gold meridians at 75°, 90°, 105° and 120° W, a clock on each meridian near Philadelphia, Memphis, Denver and Fresno.',
  say: 'Here’s the map today. Four zones, still one hour apart. Each little clock sits right on its zone’s meridian: seventy-five west near Philadelphia, ninety near Memphis, one-oh-five at Denver, one-twenty near Fresno. On that line, clock noon is Sun noon. Everywhere else, your clock is off the Sun, by up to half an hour or more. And look how the edges bend: they follow state and county lines, not meridians.',
  notes: 'WHY THE CLOCKS SIT ON THE MERIDIANS: only along each zone’s central meridian (75°, 90°, 105°, 120° W) does clock noon equal Sun noon. Away from it, the Sun is early (east) or late (west) by 4 minutes per degree: up to ~30 minutes at the ideal ±7.5° edges, more where zones bend.\nIn theory each zone is ±7.5° wide; in practice the boundaries bend to state and county lines (Detroit on Eastern, El Paso on Mountain; most of Arizona skips daylight saving).\nOn the USGS National Atlas map the clocks are simply placed mid-zone for display; here they sit exactly on the meridians.\n' + ZONES });
slide({ id: 'resist', act: A7, title: 'Not everyone agreed', min: .5,
  slide: { lay: 'text', kick: 'Railroad time', h: 'Not everyone agreed', lines: ['Towns, newspapers and preachers fought “railroad time”: God’s time was the Sun’s.', 'Detroit switched back and forth into the 1900s.', 'Congress made time zones law only in 1918.'] },
  say: 'And yes, people fought it. Newspapers and preachers called it railroad time and said God’s time was the Sun’s. Some cities refused for years; Detroit flip-flopped into the 1900s. Time zones didn’t become federal law until 1918, thirty-five years after the railroads did it.',
  notes: 'Standard Time Act, 19 March 1918 (also brought daylight saving time). Detroit kept local time, then Central, then Eastern, with fights into the 1900s.' });

/* ======================= X · GREENWICH WINS ======================= */
slide({ id: 'zeros', act: A8, title: 'Every country had its own zero', min: .65,
  slide: { lay: 'split', kick: 'Before 1884', h: 'Every country had its own zero', lines: ['Longitude has no natural zero.', 'So the same city had a different longitude on every country’s map.'], fig: tZero, figw: 46 },
  say: 'There was one more problem. Latitude has a natural zero, the equator. Longitude doesn’t. So every country picked its own: Paris for the French, Greenwich for the British, Washington on many American maps, and older European maps used Ferro in the Canary Islands. The same city had a different longitude on every map.',
  notes: 'Paris Observatory 2°20′14″ E of Greenwich. US Naval Observatory (old) 77°03′ W. Ferro (El Hierro), conventionally exactly 20° W of Paris = 17°40′ W of Greenwich. Spain: Cádiz / San Fernando (≈ 6°12′ W). Russia: Pulkovo (30°19′ E). About 72% of the world’s shipping already used Greenwich-based charts.\n' + JEFF });
slide({ id: 'denver', act: A8, title: 'Denver: 105° or 28°?', min: .55,
  slide: { lay: 'fig', kick: 'Same city, two numbers', h: 'Denver: 105°, or 28°?', lines: ['From Greenwich, Denver is 105° west. On many American maps, it was about 28° west, of Washington.'], fig: figDenver },
  say: 'Here’s my favourite example. From Greenwich, Denver is a hundred and five degrees west. But on many American maps of the 1800s, Denver was about twenty-eight degrees west: west of Washington. Same city, two numbers. You had to know whose zero you were using.',
  notes: JEFF + '\nDenver 104.99° W − Washington 77.05° W ≈ 27.9° W of Washington.' });
slide({ id: 'conference', act: A8, title: 'Washington, October 1884', min: .5,
  slide: { lay: 'full', img: 'img/delegates1884.jpg', pos: 'center 35%', scrim: 'bottom', kick: 'Washington · October 1884', h: 'One zero for the world',
    lines: ['Twenty-five nations meet to choose a prime meridian.'], cap: 'Delegates of the International Meridian Conference, Washington, October 1884. Public domain.' },
  say: 'So in October 1884, twenty-five nations sent delegates to Washington to pick one zero for the whole world.',
  notes: 'International Meridian Conference, Washington, D.C., 1–22 October 1884, called by President Chester Arthur. 41 delegates from 25 nations.\n' + WORLD });
cine('gwins', { act: A8, min: .6,
  l: 'Ships already used its charts. US railroads already ran on it.',
  say: 'Greenwich won, twenty-two votes to one, with two abstentions. Most of the world’s ships already used Greenwich charts. And the American railroads had set their time zones on Greenwich a year earlier. That head start helped Greenwich win.',
  notes: 'Vote on Greenwich as prime meridian: 22 for, 1 against (San Domingo, today’s Dominican Republic), 2 abstentions (France, Brazil).\n' + WORLD + '\n\n' + JEFF });
slide({ id: 'paris', act: A8, title: 'Paris held out', min: .45,
  slide: { lay: 'half-r', img: 'img/obs_paris.jpg', pos: 'center 50%', kick: 'France abstained', h: 'Paris held out',
    lines: ['France kept Paris as its zero until 1911.', 'Even then, the law called Greenwich time “Paris mean time, slowed by 9 minutes 21 seconds.”'],
    cap: 'The Paris Observatory, about 1680. Public domain.' },
  say: 'France abstained, and kept Paris time until 1911. And even then, the French law didn’t say Greenwich. It said Paris mean time, slowed down by nine minutes twenty-one seconds. Which is Greenwich.',
  notes: 'French law of 9 March 1911: legal time = “temps moyen de Paris, retardé de neuf minutes vingt et une secondes”. France’s own survey maps kept a Paris meridian (in grads) much longer.\n' + WORLD });

/* ======================= XI · TODAY ======================= */
cine('clocks', { act: A9, min: .6,
  say: 'And today? Look up. Thirty-one or so GPS satellites, and every one carries atomic clocks and broadcasts, nonstop: who it is, where it is, and exactly what time it is. A sky full of Harrison’s clocks.',
  notes: 'GPS: about 31 operational satellites (the constellation design is 24+), six orbital planes, ~20,200 km up, each orbiting twice a day. Each carries rubidium and/or caesium atomic clocks.' });
cine('fourth', { act: A9, min: .6,
  say: 'Your phone hears four of them. Each signal says when it left; the delay tells you how far away that satellite is. Three distances give your place. The fourth fixes your phone’s own cheap clock. Still the same trick: position from time.',
  notes: 'Four unknowns: x, y, z and the receiver’s clock error. Four satellites → four equations. That is why GPS needs at least four.' });
slide({ id: 'nanosecond', act: A9, title: 'A nanosecond is a foot', min: .55,
  slide: { lay: 'text', kick: 'GPS is still just clocks', h: 'A nanosecond is a foot', lines: ['Light travels about 30 cm, one foot, in a billionth of a second.', 'So every satellite carries atomic clocks.', 'Four satellites: three for <em>where</em>, one for <em>when</em>.'] },
  say: 'And here’s the Harrison problem, three hundred years later. Light travels about one foot in a billionth of a second. So a clock error of one nanosecond is a foot of error on the ground. Harrison fought for seconds. GPS fights for billionths. It is still just clocks.',
  notes: 'Speed of light ≈ 299,792 km/s ≈ 0.98 ft per nanosecond. A 1 µs error ≈ 300 m; 1 ms ≈ 300 km. GPS satellite clocks are also corrected for relativity (≈ 38 µs a day).' });
cine('notatsea', { id: 'backtoscilly', act: A9, title: 'Back to Scilly', min: .5,
  kick: 'Isles of Scilly · 1707', h: 'They had the Pole Star.', hs: 1, l: 'What they needed was the time at home.', tdelay: 2.2,
  cue: 'Back on the night sea with the fleet’s lanterns: the Scilly callback.',
  say: 'So let’s go back to that night off Scilly. Shovell’s navigators had the Pole Star when they could see it. What they did not have was the time at home. Fifty years later, a carpenter put it in a box. Today it’s in your pocket.',
  notes: 'Callback to the opening. 1707 → H4 1761 (54 years) → GPS 1978 / 1995.' });
cine('paleblue', { act: A9, min: .5,
  h: 'Where am I?', l: 'Ask the time.',
  say: 'Where am I? It’s the oldest question at sea. And the answer, for latitude, was always in the stars. For longitude, the answer was always: what time is it at home?',
  notes: 'Final line. Pause, then advance to questions.' });
cine('thanks', { act: A9, min: .3,
  say: 'Thank you. I’d love your questions.',
  notes: 'Q&A: 15 minutes. Good back-pocket beats: the speed of noon (beat 16), the zone map (beat 47), Denver 28° (beat 50), Rømer and the speed of light (beat 29), the Day of Two Noons (beat 45).' });

/* ---------- install the v3 list ---------- */
/* timing: the per-beat minutes above are relative weights; scale them so the talk is exactly 30:00 (rounded to whole seconds) */
const TOTAL = 30, raw = L.reduce((a, b) => a + b.min, 0);
L.forEach(b => { b.min = Math.round(b.min * TOTAL / raw * 60) / 60; });
const fix = Math.round((TOTAL - L.reduce((a, b) => a + b.min, 0)) * 60) / 60; L.find(b => b.id === 'walkWest').min += fix;
W.beats.length = 0; L.forEach(b => W.beats.push(b));
window.V3 = { kinds: L.map(b => b.kind) };
})();
