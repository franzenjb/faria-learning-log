// New native slides for the four-day GIS course (Day 1). Each entry: {h1, ctl, fig, init(el)}.
// fig is the inner markup of an <svg viewBox="0 0 1000 640">, or a <canvas> when canvas:true.
const NEW_SLIDES = {};
const CS = {
  $: (el, s) => el.querySelector(s),
  int: n => Math.round(n).toLocaleString('en-US'),
  fx: (n, d = 1) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }),
  slider: (id, label, min, max, step, val) => `<label><span class="row">${label} <output id="${id}-o"></output></span><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${val}"></label>`,
  // run fn(t, dt) every frame while the slide is the active one
  tick(el, fn) { let last = 0; const loop = t => { if (el.classList.contains('active')) { fn(t, last ? Math.min(60, t - last) : 16); last = t; } else last = 0; requestAnimationFrame(loop); }; requestAnimationFrame(loop); },
  rng(seed) { let s = seed; return () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; }; },
  canvas(el) { const c = el.querySelector('canvas.fig'), ctx = c.getContext('2d'); const o = { c, ctx, w: 0, h: 0, fit() { const r = c.getBoundingClientRect(), d = devicePixelRatio || 1; if (!r.width) return false; if (o.w !== r.width || o.h !== r.height) { o.w = r.width; o.h = r.height; c.width = r.width * d; c.height = r.height * d; } ctx.setTransform(d, 0, 0, d, 0, 0); ctx.clearRect(0, 0, o.w, o.h); return true; } }; return o; },
  INK: '#ece6da', RED: '#f0b35a', MUTE: '#9a9382', HAIR: '#2e3854', LAND: '#1f2a46', PAPER: '#0a0e18'
};
const D2R = Math.PI / 180;

/* ---------- Thumb to the Moon ---------- */
NEW_SLIDES['Thumb to the Moon'] = {
  h1: 'The same triangle reaches the Moon',
  ctl: `<div class="controls">${CS.slider('tm-d', 'Slide the target out', 0, 100, 0.5, 0)}</div>
  <div class="chips" id="tm-p"><button data-v="0">Your thumb</button><button data-v="38">A barn, one mile off</button><button data-v="100">The Moon</button></div>
  <div class="readout" id="tm-r"></div>`,
  fig: `<line class="hair" x1="70" y1="320" x2="960" y2="320" stroke-dasharray="4 6"/>
  <path id="tm-rays" class="red" d=""/><circle cx="70" cy="320" r="9" class="fk"/><text x="70" y="352" text-anchor="middle" class="sm mu">your eye</text>
  <g id="tm-near"><line class="k" x1="250" y1="296" x2="250" y2="344" stroke-width="5"/><text x="250" y="380" text-anchor="middle" class="sm">thumbnail gap</text><text x="250" y="402" text-anchor="middle" class="sm mu">1 wide, 110 away</text></g>
  <g id="tm-far"><circle id="tm-disc" cx="600" cy="320" r="40" fill="#1c2540" stroke="#ece6da" stroke-width="1.6"/><line id="tm-bar" class="red" x1="600" y1="280" x2="600" y2="360" stroke-width="3"/><text id="tm-l1" x="600" y="200" text-anchor="middle" class="md"></text><text id="tm-l2" x="600" y="226" text-anchor="middle" class="sm mu">1 wide, 110 away</text></g>
  <text x="500" y="560" text-anchor="middle" class="md">Same shape. Only the size changes.</text>
  <text x="500" y="590" text-anchor="middle" class="sm mu">Drawn about 30 times wider than life so you can see the angle.</text>`,
  init(el) {
    const s = CS.$(el, '#tm-d'), out = CS.$(el, '#tm-d-o');
    const inch = 43, moon = 238900 * 63360; // arm's length to the Moon, in inches
    const draw = () => {
      const u = +s.value / 100, d = inch * Math.pow(moon / inch, u), wdt = d / 110;
      const x = 250 + u * 650, half = (x - 70) * 110 / 830;
      CS.$(el, '#tm-rays').setAttribute('d', `M70 320 L960 ${320 - 890 * 110 / 830} M70 320 L960 ${320 + 890 * 110 / 830}`);
      CS.$(el, '#tm-disc').setAttribute('cx', x); CS.$(el, '#tm-disc').setAttribute('r', half);
      const b = CS.$(el, '#tm-bar'); b.setAttribute('x1', x); b.setAttribute('x2', x); b.setAttribute('y1', 320 - half); b.setAttribute('y2', 320 + half);
      CS.$(el, '#tm-far').style.opacity = u < 0.02 ? 0 : 1;
      const ft = d / 12, mi = d / 63360;
      const dist = mi >= 1 ? `${CS.int(mi)} mile${mi >= 1.5 ? 's' : ''}` : ft >= 30 ? `${CS.int(ft)} feet` : `${CS.int(d)} inches`;
      const wft = wdt / 12, wmi = wdt / 63360;
      const wide = wmi >= 1 ? `${CS.int(wmi)} miles` : wft >= 3 ? `${CS.int(wft)} feet` : `${CS.fx(wdt, 1)} inch`;
      const l1 = CS.$(el, '#tm-l1'), l2 = CS.$(el, '#tm-l2'); l1.setAttribute('x', x); l2.setAttribute('x', x); l1.setAttribute('y', 320 - half - 34); l2.setAttribute('y', 320 - half - 10);
      l1.textContent = `${wide} across`; out.textContent = dist;
      CS.$(el, '#tm-r').innerHTML = u > 0.985 ? `<strong>The Moon is about 2,170 miles across</strong><span>238,900 miles away, divided by 110. NASA's measured figure is 2,159 miles. A thumb got within 1 percent.</span>` : `<strong>${dist} away, so ${wide} across</strong><span>Whatever just fills the gap is 110 times farther away than it is wide.</span>`;
    };
    s.oninput = draw; el.querySelectorAll('#tm-p button').forEach(b => b.onclick = () => { s.value = b.dataset.v; draw(); }); draw();
  }
};

/* ---------- The quadrant ---------- */
NEW_SLIDES['The quadrant'] = {
  h1: 'A quarter circle and a string',
  ctl: `<div class="controls">${CS.slider('qd-a', 'Tilt up to the star', 0, 90, 0.5, 34)}${CS.slider('qd-r', 'Radius of the instrument', 0.2, 2, 0.02, 0.3)}</div>
  <div class="chips" id="qd-p"><button data-r="0.3">Hand quadrant</button><button data-r="1.94">Tycho's wall quadrant</button></div>
  <div class="readout" id="qd-r2"></div>`,
  fig: `<line class="hair" x1="60" y1="210" x2="940" y2="210" stroke-dasharray="5 6"/><text x="930" y="200" text-anchor="end" class="sm mu">level</text>
  <line id="qd-sight" class="red" stroke-dasharray="2 5" x1="0" y1="0" x2="0" y2="0"/>
  <g id="qd-star"><path class="fr" d="M0 -13 L3.5 -4 L13 -4 L5.5 2 L8 12 L0 6 L-8 12 L-5.5 2 L-13 -4 L-3.5 -4 Z"/></g>
  <path id="qd-body" fill="#18213a" stroke="#ece6da" stroke-width="2" d=""/><g id="qd-ticks"></g>
  <path id="qd-ang" class="red" fill="none" d=""/><text id="qd-angt" class="md rd"></text>
  <line id="qd-plumb" class="k" x1="0" y1="0" x2="0" y2="0" stroke-width="1.4"/><circle id="qd-bob" r="9" class="fk"/>
  <text id="qd-read" class="md" text-anchor="middle"></text>
  <g transform="translate(640,470)"><text x="0" y="-16" class="sm mu">One arcminute on the scale, life size</text><line class="hair" x1="0" y1="0" x2="300" y2="0"/><line id="qd-mm" class="red" x1="0" y1="0" x2="10" y2="0" stroke-width="6"/><text id="qd-mmt" x="0" y="30" class="md"></text></g>`,
  init(el) {
    const A = CS.$(el, '#qd-a'), Rr = CS.$(el, '#qd-r'), ax = 400, ay = 210, R = 300;
    const draw = () => {
      const a = +A.value * D2R, u = [-Math.cos(a), Math.sin(a)], v = [Math.sin(a), Math.cos(a)];
      const e1 = [ax + u[0] * R, ay + u[1] * R], e2 = [ax + v[0] * R, ay + v[1] * R];
      CS.$(el, '#qd-body').setAttribute('d', `M${ax} ${ay} L${e1[0]} ${e1[1]} A${R} ${R} 0 0 0 ${e2[0]} ${e2[1]} Z`);
      let tk = '';
      for (let d = 0; d <= 90; d += 5) { const b = d * D2R, dir = [v[0] * Math.cos(b) + u[0] * Math.sin(b), v[1] * Math.cos(b) + u[1] * Math.sin(b)], L = d % 10 ? 10 : 20; tk += `<line class="k" stroke-width="1" x1="${ax + dir[0] * R}" y1="${ay + dir[1] * R}" x2="${ax + dir[0] * (R - L)}" y2="${ay + dir[1] * (R - L)}"/>`; if (d % 30 === 0) tk += `<text class="xs mu" text-anchor="middle" x="${ax + dir[0] * (R - 36)}" y="${ay + dir[1] * (R - 36) + 5}">${d}</text>`; }
      CS.$(el, '#qd-ticks').innerHTML = tk;
      const sx = ax - u[0] * 430, sy = ay - u[1] * 430, cl = Math.max(0.05, Math.min(1, (ay - 30) / Math.max(1, ay - sy)));
      const stx = ax + (sx - ax) * (sy < 40 ? cl : 1), sty = ay + (sy - ay) * (sy < 40 ? cl : 1);
      const sl = CS.$(el, '#qd-sight'); sl.setAttribute('x1', e1[0]); sl.setAttribute('y1', e1[1]); sl.setAttribute('x2', stx); sl.setAttribute('y2', sty);
      CS.$(el, '#qd-star').setAttribute('transform', `translate(${stx},${sty})`);
      const pl = CS.$(el, '#qd-plumb'); pl.setAttribute('x1', ax); pl.setAttribute('y1', ay); pl.setAttribute('x2', ax); pl.setAttribute('y2', ay + R + 34);
      const bob = CS.$(el, '#qd-bob'); bob.setAttribute('cx', ax); bob.setAttribute('cy', ay + R + 40);
      const r0 = 92; CS.$(el, '#qd-ang').setAttribute('d', `M${ax + r0} ${ay} A${r0} ${r0} 0 0 0 ${ax + r0 * Math.cos(a)} ${ay - r0 * Math.sin(a)}`);
      const t = CS.$(el, '#qd-angt'); t.setAttribute('x', ax + 112 * Math.cos(a / 2)); t.setAttribute('y', ay - 112 * Math.sin(a / 2) + 6); t.textContent = `${CS.fx(+A.value, 1)}°`;
      const rd = CS.$(el, '#qd-read'); rd.setAttribute('x', ax); rd.setAttribute('y', ay + R + 82); rd.textContent = `the string reads ${CS.fx(+A.value, 1)}°`;
      CS.$(el, '#qd-a-o').textContent = `${CS.fx(+A.value, 1)}°`;
      const r = +Rr.value, mm = r * 1000 * D2R / 60; const ft = r * 3.2808, inch = `about 1/${Math.round(25.4 / mm)} inch`; CS.$(el, '#qd-r-o').textContent = `${CS.fx(ft, 1)} ft`;
      CS.$(el, '#qd-mm').setAttribute('x2', Math.max(1.2, mm * 3.78 * 4)); CS.$(el, '#qd-mmt').textContent = `${inch}  (shown 4 times life size)`;
      CS.$(el, '#qd-r2').innerHTML = `<strong>Bigger arc, finer reading</strong><span>At ${CS.fx(ft, 1)} feet, one arcminute is ${inch} of scale. ${r > 1.5 ? 'Tycho could split that by eye. No telescope.' : 'Too small to read. That is why Tycho built big.'}</span>`;
    };
    A.oninput = Rr.oninput = draw; el.querySelectorAll('#qd-p button').forEach(b => b.onclick = () => { Rr.value = b.dataset.r; draw(); }); draw();
  }
};

/* ---------- Projections, a first look (thin) ---------- */
NEW_SLIDES['A sphere will not lie flat'] = {
  h1: 'A sphere will not lie flat', canvas: true,
  ctl: `<div class="controls">${CS.slider('pj-t', 'Close the gaps', 0, 100, 1, 0)}</div>
  <div class="readout" id="pj-r"></div><p class="onscreen">We come back to this on Day 3.</p>`,
  init(el) {
    const o = CS.canvas(el), S = CS.$(el, '#pj-t'); let anim = null;
    const draw = () => {
      if (!o.fit()) return; const { ctx, w, h } = o, t = +S.value / 100, k = Math.min((w - 60) / 360, (h - 150) / 180), cx = w / 2, cy = h / 2 + 10, G = 6, gw = 360 / G;
      const pr = (lon, lat) => { const g = Math.min(G - 1, Math.floor((lon + 180) / gw)), l0 = -180 + (g + .5) * gw, c = Math.cos(lat * D2R); return [cx + (l0 + (lon - l0) * (c + t * (1 - c))) * k, cy - lat * k, g]; };
      // gore outlines
      ctx.fillStyle = '#111727'; ctx.strokeStyle = CS.HAIR; ctx.lineWidth = 1;
      for (let g = 0; g < G; g++) { ctx.beginPath(); for (let la = -90; la <= 90; la += 3) { const p = pr(-180 + g * gw + 0.001, la); la === -90 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]); } for (let la = 90; la >= -90; la -= 3) { const p = pr(-180 + (g + 1) * gw - 0.001, la); ctx.lineTo(p[0], p[1]); } ctx.closePath(); ctx.fill(); ctx.stroke(); }
      for (let la = -60; la <= 60; la += 30) { for (let g = 0; g < G; g++) { ctx.beginPath(); const a = pr(-180 + g * gw + .001, la), b = pr(-180 + (g + 1) * gw - .001, la); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.strokeStyle = la === 0 ? CS.RED : CS.HAIR; ctx.stroke(); } }
      ctx.strokeStyle = CS.INK; ctx.lineWidth = 1.1; ctx.beginPath();
      for (const ln of COAST.lines) { let pg = -1; for (let i = 0; i < ln.length; i += 2) { const p = pr(ln[i] / COAST.q, ln[i + 1] / COAST.q); if (p[2] === pg || (t > .995 && pg >= 0 && Math.abs(p[2] - pg) < 2)) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); pg = p[2]; } }
      ctx.stroke();
      ctx.fillStyle = CS.INK; ctx.font = '500 ' + Math.max(15, h * .03) + 'px Georgia,serif'; ctx.textAlign = 'center';
      ctx.fillText(t < .5 ? 'Peel it: true widths, a torn map' : 'Stretch it: a whole map, the top smeared wide', cx, cy + 90 * k + 46);
      const str = 1 / Math.cos(60 * D2R); CS.$(el, '#pj-t-o').textContent = `${Math.round(t * 100)}%`;
      CS.$(el, '#pj-r').innerHTML = `<strong>${t < .5 ? 'Tear it or stretch it' : 'Nothing is torn. Something is stretched.'}</strong><span>${t > .5 ? `At 60° north the map is now drawn ${CS.fx(1 + t * (str - 1), 1)} times too wide.` : 'Every flat map breaks something: shape, area, distance or direction.'}</span>`;
    };
    S.oninput = draw; addEventListener('resize', draw); new MutationObserver(draw).observe(el, { attributes: true, attributeFilter: ['class'] }); draw();
  }
};

/* ---------- Chapter slide 2: two ships, one latitude ---------- */
NEW_SLIDES['Two ships, one latitude'] = {
  h1: 'Longitude has no landmarks', canvas: true,
  ctl: `<div class="controls">${CS.slider('ts-d', 'Move the second ship east', 0, 40, 0.5, 15)}</div><div class="btns"><button class="primary" id="ts-spin">Pause the Earth</button></div><div class="readout" id="ts-r"></div>`,
  init(el) {
    const o = CS.canvas(el), S = CS.$(el, '#ts-d'); let spin = true, lon0 = -40, last = 0, LAT = 50, A = -35;
    CS.$(el, '#ts-spin').onclick = e => { spin = !spin; e.target.textContent = spin ? 'Pause the Earth' : 'Spin the Earth'; };
    const draw = now => {
      if (!el.classList.contains('active')) { last = 0; requestAnimationFrame(draw); return; }
      const dt = last ? now - last : 16; last = now; if (spin) lon0 += dt * 0.006;
      if (!o.fit()) { requestAnimationFrame(draw); return; }
      const { ctx, w, h } = o, R = Math.min(w * .3, h * .34), cx = w * .5, cy = h * .6, tilt = 28 * D2R, ct = Math.cos(tilt), st = Math.sin(tilt);
      const P = (lat, lon) => { const l = (lon - lon0) * D2R, cp = Math.cos(lat * D2R), sp = Math.sin(lat * D2R); return { x: cx + R * cp * Math.sin(l), y: cy - R * (ct * sp - st * cp * Math.cos(l)), z: st * sp + ct * cp * Math.cos(l) }; };
      const path = (pts, col, wd, dash) => { ctx.strokeStyle = col; ctx.lineWidth = wd; ctx.setLineDash(dash || []); ctx.beginPath(); let pen = false; for (const [la, lo] of pts) { const q = P(la, lo); if (q.z > 0) { pen ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); pen = true; } else pen = false; } ctx.stroke(); ctx.setLineDash([]); };
      const g = ctx.createRadialGradient(cx - R * .3, cy - R * .4, R * .05, cx, cy, R); g.addColorStop(0, '#2f5a8c'); g.addColorStop(.7, '#15294a'); g.addColorStop(1, '#0b1526'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
      for (let la = -60; la <= 80; la += 20) path(Array.from({ length: 91 }, (_, k) => [la, k * 4]), 'rgba(236,230,218,.12)', 1);
      for (let lo = 0; lo < 360; lo += 15) path(Array.from({ length: 37 }, (_, k) => [-90 + k * 5, lo]), 'rgba(236,230,218,.12)', 1);
      ctx.strokeStyle = 'rgba(236,230,218,.75)'; ctx.lineWidth = 1.2; ctx.beginPath(); for (const ln of COAST.lines) { let pen = false; for (let i = 0; i < ln.length; i += 2) { const q = P(ln[i + 1] / COAST.q, ln[i] / COAST.q); if (q.z > 0) { pen ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); pen = true; } else pen = false; } } ctx.stroke();
      ctx.strokeStyle = '#3b5f8a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
      // the latitude line both ships sail on
      path(Array.from({ length: 181 }, (_, k) => [LAT, k * 2]), '#f0b35a', 3);
      // axis and Polaris, fixed above the pole while the Earth turns under it
      const np = P(90, 0); ctx.strokeStyle = 'rgba(111,179,255,.6)'; ctx.setLineDash([6, 6]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(np.x, np.y); ctx.lineTo(np.x, np.y - R * .55); ctx.stroke(); ctx.setLineDash([]);
      const px = np.x, py = np.y - R * .62, gl = ctx.createRadialGradient(px, py, 0, px, py, 22); gl.addColorStop(0, 'rgba(200,225,255,.95)'); gl.addColorStop(1, 'rgba(111,179,255,0)'); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(px, py, 22, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px, py, 4, 0, 7); ctx.fill();
      const lab = (t, x, y, sz, col, al = 'left', wt = 600) => { ctx.font = `${wt} ${sz}px -apple-system,Segoe UI,Roboto,sans-serif`; ctx.textAlign = al; ctx.fillStyle = col; ctx.fillText(t, x, y); };
      const fs = Math.max(15, h * .024);
      lab('Polaris stays put. The Earth turns under it.', px + 18, py + 6, fs, '#6fb3ff');
      // the two ships, the meridian through each, and the gap between them
      const d = +S.value, B = A + d, mi = d * 69.17 * Math.cos(LAT * D2R);
      path(Array.from({ length: 41 }, (_, k) => [LAT, A + d * k / 40]), '#ff7d6f', 6);
      [[A, 'Ship 1'], [B, 'Ship 2']].forEach(([lo, n], i) => { path(Array.from({ length: 37 }, (_, k) => [-90 + k * 5, lo]), 'rgba(255,125,111,.55)', 1.5, [5, 5]); const q = P(LAT, lo); if (q.z <= 0) return; ctx.fillStyle = '#ece6da'; ctx.beginPath(); ctx.moveTo(q.x - 14, q.y); ctx.lineTo(q.x + 14, q.y); ctx.lineTo(q.x + 9, q.y + 8); ctx.lineTo(q.x - 9, q.y + 8); ctx.closePath(); ctx.fill(); ctx.fillRect(q.x - 1, q.y - 22, 2, 22); ctx.beginPath(); ctx.moveTo(q.x + 1, q.y - 21); ctx.lineTo(q.x + 13, q.y - 5); ctx.lineTo(q.x + 1, q.y - 5); ctx.fill();
        ctx.strokeStyle = 'rgba(111,179,255,.55)'; ctx.lineWidth = 1.2; ctx.setLineDash([3, 5]); ctx.beginPath(); ctx.moveTo(q.x, q.y - 22); ctx.lineTo(px, py); ctx.stroke(); ctx.setLineDash([]);
        lab(`${n}: Pole Star 50° up`, q.x + (i ? 18 : -18), q.y + 28, fs * .9, '#ece6da', i ? 'left' : 'right', 500); });
      const m = P(LAT, A + d / 2); if (m.z > 0 && d > .4) lab(`${Math.round(mi)} miles apart`, m.x, m.y - 30, fs * 1.15, '#ff7d6f', 'center', 700);
      lab('Both read the same star at the same height. Nothing in the sky says how far east or west.', w / 2, h - 30, fs * .95, '#cfc8ba', 'center', 500);
      CS.$(el, '#ts-d-o').textContent = `${CS.fx(d, 1)}° of longitude`;
      CS.$(el, '#ts-r').innerHTML = `<strong>Same star. Same height. ${CS.int(mi)} miles apart.</strong>`;
      requestAnimationFrame(draw);
    };
    S.oninput = () => {}; requestAnimationFrame(draw);
  }
};

/* ---------- Chapter slide 3: Scilly, 1707 ---------- */
NEW_SLIDES['Scilly, 1707'] = {
  h1: 'The cost of not knowing',
  ctl: `<div class="btns"><button class="primary" id="sc-go">Sail the fleet home</button><button id="sc-re">Reset</button></div>
  <ul class="facts on"><li>Night of 22 October 1707</li><li>Admiral Sir Clowdesley Shovell</li><li>Four Royal Navy ships wrecked</li><li>About 2,000 sailors died. Counts run from 1,400 to 2,000.</li></ul><div class="readout" id="sc-r"></div>`,
  fig: `<rect x="40" y="40" width="920" height="560" fill="#141b2e"/>
  <path class="land" d="M960 96 L852 118 L770 150 L700 176 L640 212 L598 238 L560 250 L548 262 L572 270 L604 262 L640 268 L662 282 L700 262 L760 250 L820 232 L880 236 L960 226 Z"/>
  <text x="800" y="186" class="md">Cornwall</text><text x="552" y="290" class="xs mu" text-anchor="middle">Land's End</text>
  <path class="land" d="M960 470 L900 462 L850 470 L800 458 L770 470 L742 468 L728 480 L760 492 L744 506 L780 512 L800 530 L860 540 L960 548 Z"/>
  <text x="870" y="506" class="md">Brittany</text><text x="712" y="476" class="xs mu" text-anchor="end">Ushant</text><circle cx="722" cy="472" r="4" class="land"/>
  <g class="land"><circle cx="424" cy="262" r="7"/><circle cx="438" cy="252" r="5"/><circle cx="412" cy="250" r="4"/><circle cx="430" cy="274" r="4"/><circle cx="404" cy="268" r="3"/></g>
  <text x="420" y="226" class="md" text-anchor="middle">Isles of Scilly</text>
  <text x="640" y="380" class="lg mu" text-anchor="middle" font-style="italic">English Channel</text>
  <path id="sc-think" d="M90 560 C260 500 430 420 640 372 S880 318 955 300" fill="none" stroke="#ece6da" stroke-width="1.6" stroke-dasharray="7 6"/>
  <text x="250" y="548" class="sm" transform="rotate(-21 250 548)">where they reckoned they were</text>
  <path id="sc-real" d="M90 470 C200 400 300 320 412 266" fill="none" stroke="#f0b35a" stroke-width="2.4" stroke-dasharray="0 2000"/>
  <g id="sc-x" opacity="0"><path d="M398 252 l28 28 M426 252 l-28 28" stroke="#f0b35a" stroke-width="4"/><text x="380" y="318" class="md rd" text-anchor="middle">Association, Eagle,</text><text x="380" y="342" class="md rd" text-anchor="middle">Romney, Firebrand</text></g>
  <g id="sc-ship"><path d="M-14 0 L14 0 L9 8 L-9 8 Z" fill="#ece6da"/><line x1="0" y1="0" x2="0" y2="-18" stroke="#ece6da" stroke-width="1.6"/></g>`,
  init(el) {
    const real = CS.$(el, '#sc-real'), ship = CS.$(el, '#sc-ship'), L = real.getTotalLength(); let t0 = 0, run = false, u = 0;
    const set = () => { const p = real.getPointAtLength(L * u); ship.setAttribute('transform', `translate(${p.x},${p.y})`); real.setAttribute('stroke-dasharray', `${L * u} 2000`); CS.$(el, '#sc-x').setAttribute('opacity', u >= 1 ? 1 : 0); ship.style.opacity = u >= 1 ? 0 : 1; CS.$(el, '#sc-r').innerHTML = u >= 1 ? `<strong>They were about 100 miles from where they believed</strong><span>Latitude was roughly known. Longitude was a guess carried forward for weeks.</span>` : `<strong>Home from Gibraltar, in fog and gales</strong><span>The officers agree: the fleet is safely in the mouth of the Channel.</span>`; };
    CS.$(el, '#sc-go').onclick = () => { u = 0; run = true; t0 = performance.now(); };
    CS.$(el, '#sc-re').onclick = () => { run = false; u = 0; set(); };
    CS.tick(el, t => { if (!run) return; u = Math.min(1, (t - t0) / 5200); set(); if (u >= 1) run = false; }); set();
  }
};

/* ---------- Chapter slide 4: the Longitude Act ---------- */
NEW_SLIDES['The Longitude Act, 1714'] = {
  h1: 'Parliament puts a price on the answer',
  ctl: `<div class="controls">${CS.slider('la-e', 'Your clock gains each day', 0, 12, 0.1, 6)}</div><div class="readout" id="la-r"></div>`,
  fig: `<text x="500" y="70" text-anchor="middle" class="md mu">A six-week voyage to the West Indies. How far off is your landfall?</text>
  <g id="la-bands"></g><line class="k" x1="80" y1="330" x2="920" y2="330"/><circle cx="500" cy="330" r="10" class="land"/><text x="500" y="368" text-anchor="middle" class="sm">the island</text>
  <g id="la-ship"><path d="M-20 0 L20 0 L13 11 L-13 11 Z" fill="#ece6da"/><line x1="0" y1="0" x2="0" y2="-28" stroke="#ece6da" stroke-width="2"/><path d="M2 -26 L18 -6 L2 -6 Z" fill="#0a0e18" stroke="#ece6da" stroke-width="1.3"/></g>
  <text id="la-miss" class="lg rd" text-anchor="middle" y="250"></text>`,
  init(el) {
    const B = [[1, '£10,000', 'within 1°'], [2 / 3, '£15,000', 'within ⅔°'], [0.5, '£20,000', 'within ½°']], px = 380; // px per degree
    CS.$(el, '#la-bands').innerHTML = B.map((b, i) => `<rect x="${500 - b[0] * px}" y="${395 + i * 62}" width="${2 * b[0] * px}" height="46" fill="${i === 2 ? '#f0b35a' : i === 1 ? '#7a5a30' : '#3a2f22'}"/><text x="500" y="${425 + i * 62}" text-anchor="middle" class="md" fill="${i === 2 ? '#0a0e18' : '#ece6da'}">${b[1]} · ${b[2]}</text>`).join('') + `<line class="hair" x1="500" y1="100" x2="500" y2="580" stroke-dasharray="3 5"/>`;
    const S = CS.$(el, '#la-e'); const draw = () => {
      const s = +S.value, tot = s * 42, deg = tot / 240, mi = deg * 69.17, x = Math.min(900, 500 + deg * px);
      CS.$(el, '#la-ship').setAttribute('transform', `translate(${x},318)`); const m = CS.$(el, '#la-miss'); m.setAttribute('x', Math.min(820, Math.max(200, x))); m.textContent = `${CS.int(mi)} miles off`;
      CS.$(el, '#la-e-o').textContent = `${CS.fx(s, 1)} seconds`;
      const prize = deg <= .5 ? '£20,000' : deg <= 2 / 3 ? '£15,000' : deg <= 1 ? '£10,000' : null;
      CS.$(el, '#la-r').innerHTML = `<strong>${prize ? prize + ' prize' : 'No prize'}</strong><span>${CS.fx(s, 1)} s a day for 42 days is ${CS.int(tot)} seconds. Four seconds of time is one arcminute, so the ship is ${CS.fx(deg, 2)}° out.</span>`;
    }; S.oninput = draw; draw();
  }
};

/* ---------- Chapter slide 5: longitude is time ---------- */
NEW_SLIDES['Longitude is time'] = {
  h1: 'The Earth is spinning under the stars',
  ctl: `<div class="btns"><button class="primary" id="lt-play">Pause</button><button id="lt-step">Next one overhead</button></div><ul class="facts on" id="lt-list"></ul><div class="readout" id="lt-r"></div>`,
  fig: `<line class="red" x1="500" y1="20" x2="500" y2="150" stroke-dasharray="3 5"/><g transform="translate(500,26)"><path class="fr" d="M0 -13 L3.5 -4 L13 -4 L5.5 2 L8 12 L0 6 L-8 12 L-5.5 2 L-13 -4 L-3.5 -4 Z"/></g><text x="522" y="32" class="sm rd">one star, far away</text>
  <circle cx="500" cy="360" r="200" fill="#141b2e" stroke="#ece6da" stroke-width="2"/><g id="lt-spin"></g><circle cx="500" cy="360" r="5" class="fk"/><text x="500" y="392" text-anchor="middle" class="xs mu">North Pole, seen from above</text>
  <path d="M700 240 A230 230 0 0 0 640 180" fill="none" stroke="#9a9382" marker-end="url(#arr)"/><text x="716" y="208" class="xs mu">it turns this way</text>
  <defs><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#9a9382"/></marker></defs>`,
  init(el) {
    const P = [['Greenwich', 0], ['A ship, 45° west', 45], ['New Orleans, 90° west', 90]]; let ang = -20, play = true, target = null;
    // ang = how far Greenwich has turned past the star line, in degrees (counter-clockwise from above)
    const draw = () => {
      let s = ''; for (let i = 0; i < 24; i++) { const a = (ang + i * 15) * D2R; s += `<line class="hair" x1="500" y1="360" x2="${500 - 200 * Math.sin(a)}" y2="${360 - 200 * Math.cos(a)}"/>`; }
      P.forEach((p, i) => { const a = (ang - p[1]) * D2R, x = 500 - 200 * Math.sin(a), y = 360 - 200 * Math.cos(a), on = Math.abs((((ang - p[1]) % 360) + 540) % 360 - 180) < 4; s += `<line stroke="${i ? '#ece6da' : '#f0b35a'}" stroke-width="2" x1="500" y1="360" x2="${x}" y2="${y}"/><circle cx="${x}" cy="${y}" r="${on ? 11 : 7}" fill="${on ? '#f0b35a' : '#ece6da'}"/><text class="sm" x="${500 - 232 * Math.sin(a)}" y="${360 - 232 * Math.cos(a) + 5}" text-anchor="${Math.sin(a) > .2 ? 'end' : Math.sin(a) < -.2 ? 'start' : 'middle'}">${p[0].split(',')[0]}</text>`; });
      CS.$(el, '#lt-spin').innerHTML = s;
      const hrs = (((ang % 360) + 360) % 360) / 15;
      CS.$(el, '#lt-list').innerHTML = P.map(p => { const d = (((p[1] - ang) % 360) + 360) % 360; return `<li>${p[0]}: ${d < 2 || d > 358 ? '<strong>star overhead now</strong>' : `overhead in ${CS.fx(d / 15, 1)} hours`}</li>`; }).join('');
      CS.$(el, '#lt-r').innerHTML = `<strong>Everyone gets the same star overhead</strong><span>The only difference is when. ${CS.fx(hrs, 1)} hours since it crossed Greenwich. Without the time, the star says nothing about east or west.</span>`;
    };
    CS.$(el, '#lt-play').onclick = e => { play = !play; target = null; e.target.textContent = play ? 'Pause' : 'Spin'; };
    CS.$(el, '#lt-step').onclick = () => { const cur = ((ang % 360) + 360) % 360; const nx = P.map(p => p[1]).concat(360).find(v => v > cur + 1); target = ang - cur + nx; play = false; CS.$(el, '#lt-play').textContent = 'Spin'; };
    CS.tick(el, (t, dt) => { if (target != null) { ang += Math.min(dt * .05, target - ang); if (target - ang < .01) { ang = target; target = null; } } else if (play) ang += dt * .012; draw(); }); draw();
  }
};

/* ---------- Chapter slide 6: lunar distances ---------- */
NEW_SLIDES['The lunar distance'] = {
  h1: 'There was a star method. It was brutal.',
  ctl: `<div class="btns"><button class="primary" id="ld-go">Work the sight</button><button id="ld-roll">Roll the deck</button></div><ol class="facts on" id="ld-steps"></ol><div class="readout" id="ld-r"></div>`,
  fig: `<g id="ld-sky"><circle id="ld-moon" cx="330" cy="200" r="34" fill="#1c2540" stroke="#ece6da" stroke-width="1.6"/><path d="M330 166 A34 34 0 0 1 330 234 A22 34 0 0 0 330 166" fill="#2e3854"/>
  <g transform="translate(690,150)"><path class="fr" d="M0 -13 L3.5 -4 L13 -4 L5.5 2 L8 12 L0 6 L-8 12 L-5.5 2 L-13 -4 L-3.5 -4 Z"/></g><text x="712" y="140" class="sm">Regulus</text>
  <line id="ld-line" class="red" x1="364" y1="195" x2="676" y2="152" stroke-width="2"/><text id="ld-ang" x="520" y="150" text-anchor="middle" class="lg rd"></text></g>
  <g id="ld-deck"><line class="k" x1="40" y1="470" x2="960" y2="470" stroke-width="2"/><rect x="40" y="470" width="920" height="130" fill="#141b2e"/><text x="500" y="540" text-anchor="middle" class="md mu">the horizon, from a moving deck</text></g>
  <text x="500" y="330" text-anchor="middle" class="md">The Moon slides past the stars about half a degree an hour.</text><text x="500" y="358" text-anchor="middle" class="sm mu">That makes it a clock hand. A slow, hard one to read.</text>`,
  init(el) {
    const steps = ['Measure the Moon-to-star angle, three times', 'Measure both heights above the horizon', 'Correct for the bending of light in air', 'Correct for where you stand on the Earth', 'Find the angle in the almanac tables', 'Work between the three-hour entries', 'Turn the time gap into degrees']; let n = 0, roll = false, tm = 0, last = 0;
    const draw = () => { CS.$(el, '#ld-steps').innerHTML = steps.map((s, i) => `<li class="${i < n ? '' : 'off'}">${i < n ? '✓ ' : ''}${s}</li>`).join(''); CS.$(el, '#ld-r').innerHTML = n >= steps.length ? `<strong>More than an hour later</strong><span>One slip in the arithmetic and the answer is wrong. And the ship has kept moving the whole time.</span>` : `<strong>${n ? `Step ${n} of ${steps.length}` : 'One sight, by hand'}</strong><span>Each arcminute of error in the angle is about half a degree of longitude.</span>`; };
    CS.$(el, '#ld-go').onclick = () => { n = 0; last = performance.now(); tm = 1; draw(); };
    CS.$(el, '#ld-roll').onclick = e => { roll = !roll; e.target.textContent = roll ? 'Steady the deck' : 'Roll the deck'; };
    CS.tick(el, t => { const r = roll ? Math.sin(t / 700) * 5 + Math.sin(t / 310) * 2 : 0; CS.$(el, '#ld-deck').setAttribute('transform', `rotate(${r} 500 470)`); CS.$(el, '#ld-sky').setAttribute('transform', roll ? `translate(${Math.sin(t / 420) * 9},${Math.cos(t / 530) * 7})` : ''); CS.$(el, '#ld-ang').textContent = roll ? `${CS.fx(42.3 + Math.sin(t / 380) * .4, 1)}° ?` : '42.3°'; if (tm && t - last > 900) { last = t; n++; draw(); if (n >= steps.length) tm = 0; } }); draw();
  }
};

/* ---------- Longitude bingo ---------- */
NEW_SLIDES['Longitude bingo'] = {
  h1: 'Longitude bingo, with Robert calling',
  ctl: `<div class="btns"><button class="primary" id="bg-call">Robert calls a square</button><button id="bg-sea">Take the card to sea</button></div><div class="readout" id="bg-r"></div>`,
  fig: `<g id="bg-card"></g>`,
  init(el) {
    const cols = ['B', 'I', 'N', 'G', 'O'], lons = ['60° W', '45° W', '30° W', '15° W', '0°'], rows = ['60° N', '45° N', '30° N', '15° N', '0°'], x0 = 290, y0 = 130, c = 92; let sea = false, hit = null, guess = [];
    const rnd = CS.rng(11);
    const draw = () => {
      let s = `<rect x="${x0 - 110}" y="${y0 - 96}" width="${c * 5 + 150}" height="${c * 5 + 136}" rx="10" fill="#111727" stroke="#ece6da" stroke-width="2"/>`;
      cols.forEach((L, i) => { s += `<text x="${x0 + i * c + c / 2}" y="${y0 - 40}" text-anchor="middle" class="xl ${sea ? 'mu' : 'rd'}">${sea ? '?' : L}</text><text x="${x0 + i * c + c / 2}" y="${y0 - 14}" text-anchor="middle" class="xs mu">${sea ? '' : lons[i]}</text>`; });
      rows.forEach((r, j) => { s += `<text x="${x0 - 16}" y="${y0 + j * c + c / 2 + 6}" text-anchor="end" class="md">${r}</text>`; for (let i = 0; i < 5; i++) { const on = hit && hit[0] === i && hit[1] === j, g = guess.some(q => q[0] === i && q[1] === j); s += `<rect x="${x0 + i * c}" y="${y0 + j * c}" width="${c}" height="${c}" fill="${on ? '#f0b35a' : g ? '#3a2f22' : (sea ? '#141b2e' : '#0a0e18')}" stroke="${sea ? '#283048' : '#ece6da'}" stroke-width="${sea ? 1 : 1.4}"/>${on ? `<circle cx="${x0 + i * c + c / 2}" cy="${y0 + j * c + c / 2}" r="22" fill="#0a0e18"/>` : ''}${g ? `<text x="${x0 + i * c + c / 2}" y="${y0 + j * c + c / 2 + 9}" text-anchor="middle" class="lg rd">?</text>` : ''}`; } });
      s += `<text x="${x0 + c * 2.5}" y="${y0 + c * 5 + 30}" text-anchor="middle" class="sm mu">${sea ? 'At sea the rows still have labels. The columns do not.' : 'On paper every square has a name.'}</text>`;
      CS.$(el, '#bg-card').innerHTML = s;
    };
    CS.$(el, '#bg-call').onclick = () => { const i = Math.floor(rnd() * 5), j = Math.floor(rnd() * 5); if (sea) { hit = null; guess = [0, 1, 2, 3, 4].map(k => [k, j]); CS.$(el, '#bg-r').innerHTML = `<strong>Robert: "Somewhere on ${rows[j]}."</strong><span>The star gives him the row. Any of five squares could be yours. Nobody can shout bingo.</span>`; } else { hit = [i, j]; guess = []; CS.$(el, '#bg-r').innerHTML = `<strong>Robert: "${cols[i]}, ${rows[j].replace('°', ' degrees')}!"</strong><span>One square. Everyone in the room finds it at once.</span>`; } draw(); };
    CS.$(el, '#bg-sea').onclick = e => { sea = !sea; hit = null; guess = []; e.target.textContent = sea ? 'Bring it back to the hall' : 'Take the card to sea'; CS.$(el, '#bg-r').innerHTML = sea ? `<strong>The ocean has no printed squares</strong><span>Until you can measure time, the column letters are blank.</span>` : `<strong>A bingo card works because the squares are labeled</strong><span>And because somebody can call them.</span>`; draw(); };
    CS.$(el, '#bg-r').innerHTML = `<strong>A bingo card works because the squares are labeled</strong><span>And because somebody can call them.</span>`; draw();
  }
};

/* ---------- Chapter slide 9: pendulum at sea ---------- */
NEW_SLIDES['Pendulum at sea'] = {
  h1: 'The best clocks could not go to sea',
  ctl: `<div class="controls">${CS.slider('pd-s', 'Sea state', 0, 10, 1, 5)}</div><div class="btns"><button id="pd-re">Set both clocks</button></div><div class="readout" id="pd-r"></div>`,
  fig: `<text x="250" y="60" text-anchor="middle" class="lg">On land</text><text x="730" y="60" text-anchor="middle" class="lg">At sea</text>
  <g id="pd-land" transform="translate(250,110)"></g><line class="k" x1="90" y1="520" x2="410" y2="520" stroke-width="2"/>
  <g id="pd-shipg"><g id="pd-sea" transform="translate(730,110)"></g><path d="M560 520 L900 520 L870 572 L590 572 Z" fill="#ece6da"/></g>
  <path id="pd-wave" fill="none" stroke="#9a9382" d=""/><text id="pd-tl" x="250" y="600" text-anchor="middle" class="md"></text><text id="pd-ts" x="730" y="620" text-anchor="middle" class="md rd"></text>`,
  init(el) {
    const clock = id => `<rect x="-70" y="0" width="140" height="400" rx="6" fill="#0a0e18" stroke="#ece6da" stroke-width="2"/><circle cx="0" cy="76" r="52" fill="#111727" stroke="#ece6da" stroke-width="1.6"/><line id="${id}-h" x1="0" y1="76" x2="0" y2="36" stroke="#ece6da" stroke-width="3"/><g id="${id}-p"><line x1="0" y1="140" x2="0" y2="340" stroke="#ece6da" stroke-width="2"/><circle cx="0" cy="340" r="20" fill="#f0b35a"/></g>`;
    CS.$(el, '#pd-land').innerHTML = clock('pl'); CS.$(el, '#pd-sea').innerHTML = clock('ps');
    const S = CS.$(el, '#pd-s'); let tl = 0, ts = 0, ph = 0; CS.$(el, '#pd-re').onclick = () => { tl = ts = 0; };
    const hm = m => { const a = Math.abs(m); return `${Math.floor(a / 60)} h ${String(Math.floor(a % 60)).padStart(2, '0')} min`; };
    CS.tick(el, (t, dt) => {
      const sea = +S.value, roll = sea * 1.6 * Math.sin(t / 900) + sea * .5 * Math.sin(t / 370);
      // one real second = 4 clock minutes; the sea clock's rate is disturbed by the roll
      const k = dt / 1000 * 4; tl += k; ts += k * (1 + sea * 0.012 * Math.sin(t / 2100) + sea * 0.004);
      ph += dt / 1000 * Math.PI * 2 * (1 + sea * .05 * Math.sin(t / 500));
      CS.$(el, '#pl-p').setAttribute('transform', `rotate(${14 * Math.sin(t / 1000 * Math.PI * 2)} 0 140)`);
      CS.$(el, '#ps-p').setAttribute('transform', `rotate(${(14 + sea) * Math.sin(ph) - roll * 1.4} 0 140)`);
      CS.$(el, '#pl-h').setAttribute('transform', `rotate(${tl * 6} 0 76)`); CS.$(el, '#ps-h').setAttribute('transform', `rotate(${ts * 6} 0 76)`);
      CS.$(el, '#pd-shipg').setAttribute('transform', `rotate(${roll} 730 520)`);
      let w = 'M470 548'; for (let x = 470; x <= 980; x += 15) w += ` L${x} ${548 + sea * 1.8 * Math.sin(x / 40 + t / 500)}`; CS.$(el, '#pd-wave').setAttribute('d', w);
      const err = ts - tl; CS.$(el, '#pd-tl').textContent = hm(tl); CS.$(el, '#pd-ts').textContent = `${hm(ts)}`;
      CS.$(el, '#pd-s-o').textContent = sea ? `${sea} of 10` : 'flat calm';
      CS.$(el, '#pd-r').innerHTML = `<strong>The sea clock is ${CS.fx(Math.abs(err), 1)} minutes ${err >= 0 ? 'fast' : 'slow'}</strong><span>${sea ? `That is ${CS.int(Math.abs(err) * 17.3)} miles of longitude at the equator. A pendulum needs a still room.` : 'In a flat calm it keeps up. The sea is not often flat.'}</span>`;
    });
  }
};

/* ---------- Chapter slide 10: a clock that could travel ---------- */
NEW_SLIDES['A clock that could travel'] = {
  h1: 'The problem is now a clock that can travel',
  ctl: `<div class="chips" id="hr-p"><button data-k="0">H1</button><button data-k="1">H2</button><button data-k="2">H3</button><button data-k="3">H4</button></div><div class="readout" id="hr-r"></div><p class="onscreen">John Harrison, a carpenter from Yorkshire, takes the job. The later Harrison slides pick it up.</p>`,
  fig: `<line class="k" x1="90" y1="430" x2="910" y2="430"/><g id="hr-g"></g>`,
  init(el) {
    const H = [['H1', 1735, 110, 'About 75 pounds. Two linked balances swing against each other, so the ship\'s roll cancels out.'], ['H2', 1739, 100, 'Heavier and stiffer. Harrison found a flaw and never sent it to sea.'], ['H3', 1757, 88, 'Nineteen years of work. It gave the world the bimetal strip and the caged roller bearing.'], ['H4', 1759, 30, 'A watch, 5 inches across. On the 1761 voyage to Jamaica it lost about 5 seconds in 81 days.']]; let k = 3;
    const X = y => 130 + (y - 1730) * 24;
    const draw = () => { CS.$(el, '#hr-g').innerHTML = H.map((h, i) => `<g class="pick" data-k="${i}"><circle cx="${X(h[1])}" cy="${430 - h[2] - 26}" r="${h[2]}" fill="${i === k ? '#111727' : '#141b2e'}" stroke="${i === k ? '#f0b35a' : '#ece6da'}" stroke-width="${i === k ? 3 : 1.6}"/><line x1="${X(h[1])}" y1="${430 - h[2] - 26}" x2="${X(h[1])}" y2="${430 - h[2] * 1.7 - 26}" stroke="#ece6da" stroke-width="2"/><line x1="${X(h[1])}" y1="${430 - h[2] - 26}" x2="${X(h[1]) + h[2] * .45}" y2="${430 - h[2] - 26}" stroke="#ece6da" stroke-width="2"/><line class="k" x1="${X(h[1])}" y1="422" x2="${X(h[1])}" y2="438"/><text x="${X(h[1])}" y="466" text-anchor="middle" class="md ${i === k ? 'rd' : ''}">${h[0]}</text><text x="${X(h[1])}" y="490" text-anchor="middle" class="sm mu">${h[1]}</text></g>`).join('') + `<text x="500" y="560" text-anchor="middle" class="md">Four machines in 24 years. The last one fits in two hands.</text>`; el.querySelectorAll('#hr-g .pick').forEach(g => g.onclick = () => { k = +g.dataset.k; draw(); }); el.querySelectorAll('#hr-p button').forEach((b, i) => b.classList.toggle('on', i === k)); CS.$(el, '#hr-r').innerHTML = `<strong>${H[k][0]}, ${H[k][1]}</strong><span>${H[k][3]}</span>`; };
    el.querySelectorAll('#hr-p button').forEach(b => b.onclick = () => { k = +b.dataset.k; draw(); }); draw();
  }
};

/* ---------- Vector and raster (thin on Day 1, full on Day 3) ---------- */
function vectorRaster(full) {
  const id = full ? 'vf' : 'vr';
  return {
    h1: full ? 'Vector and raster: choosing the record' : 'Two ways to record the world', canvas: true,
    ctl: `<div class="controls">${CS.slider(id + '-c', 'Raster cell size', 6, 60, 1, 28)}</div>${full ? `<div class="chips" id="${id}-m"><button data-m="shape" class="on">A thing with an edge</button><button data-m="field">A surface with no edge</button></div>` : ''}<div class="readout" id="${id}-r"></div>${full ? '' : '<p class="onscreen">We come back to this on Day 3.</p>'}`,
    init(el) {
      const o = CS.canvas(el), S = CS.$(el, `#${id}-c`); let mode = 'shape';
      const N = 26, poly = []; for (let i = 0; i < N; i++) { const a = i / N * Math.PI * 2, r = .30 + .07 * Math.sin(a * 3 + .6) + .05 * Math.cos(a * 5) + .03 * Math.sin(a * 7 + 1); poly.push([.5 + r * Math.cos(a) * 1.15, .5 + r * Math.sin(a)]); }
      const road = [[.2, .62], [.34, .55], [.47, .57], [.6, .46], [.74, .44]], pts = [[.36, .4], [.55, .62], [.66, .34]];
      const inside = (x, y) => { let c = false; for (let i = 0, j = N - 1; i < N; j = i++) { const a = poly[i], b = poly[j]; if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
      const hgt = (x, y) => Math.max(0, 1 - Math.hypot((x - .48) * 1.7, (y - .47) * 2.2) * 1.9) + .25 * Math.max(0, 1 - Math.hypot(x - .66, y - .58) * 6);
      const draw = () => {
        if (!o.fit()) return; const { ctx, w, h } = o, pw = (w - 60) / 2, ph = Math.min(h - 120, pw * .85), y0 = (h - ph) / 2 + 6, cell = +S.value * pw / 520;
        const panel = (x0, title) => { ctx.fillStyle = '#111727'; ctx.strokeStyle = CS.HAIR; ctx.lineWidth = 1; ctx.fillRect(x0, y0, pw, ph); ctx.strokeRect(x0, y0, pw, ph); ctx.fillStyle = CS.INK; ctx.font = `500 ${Math.max(22, h * .035)}px Georgia,serif`; ctx.textAlign = 'center'; ctx.fillText(title, x0 + pw / 2, y0 - 14); };
        const X = (x0, u) => x0 + u * pw, Y = v => y0 + v * ph;
        // vector
        const xa = 20; panel(xa, 'Vector: points, lines, areas');
        if (mode === 'shape') { ctx.beginPath(); poly.forEach((p, i) => i ? ctx.lineTo(X(xa, p[0]), Y(p[1])) : ctx.moveTo(X(xa, p[0]), Y(p[1]))); ctx.closePath(); ctx.fillStyle = CS.LAND; ctx.fill(); ctx.strokeStyle = CS.INK; ctx.lineWidth = 1.6; ctx.stroke(); ctx.fillStyle = CS.INK; poly.forEach(p => { ctx.beginPath(); ctx.arc(X(xa, p[0]), Y(p[1]), 2.6, 0, 7); ctx.fill(); }); ctx.beginPath(); road.forEach((p, i) => i ? ctx.lineTo(X(xa, p[0]), Y(p[1])) : ctx.moveTo(X(xa, p[0]), Y(p[1]))); ctx.strokeStyle = CS.INK; ctx.setLineDash([6, 4]); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = CS.RED; pts.forEach(p => { ctx.beginPath(); ctx.arc(X(xa, p[0]), Y(p[1]), 6, 0, 7); ctx.fill(); }); }
        else { ctx.strokeStyle = CS.INK; ctx.lineWidth = 1.1; for (let lv = .15; lv < 1; lv += .17) { ctx.beginPath(); for (let a = 0; a <= 360; a += 4) { let r = 0; const ca = Math.cos(a * D2R), sa = Math.sin(a * D2R); for (let q = 0; q < .6; q += .004) { if (hgt(.48 + q * ca, .47 + q * sa) < lv) { r = q; break; } } const px = X(xa, .48 + r * ca), py = Y(.47 + r * sa); a ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); } }
        // raster
        const xb = 40 + pw; panel(xb, 'Raster: a grid of cells'); let n = 0, tot = 0;
        ctx.save(); ctx.beginPath(); ctx.rect(xb, y0, pw, ph); ctx.clip();
        for (let cy = y0; cy < y0 + ph; cy += cell) for (let cx = xb; cx < xb + pw; cx += cell) { const u = (cx + cell / 2 - xb) / pw, v = (cy + cell / 2 - y0) / ph; tot++; if (mode === 'shape') { const inn = inside(u, v); if (inn) n++; ctx.fillStyle = inn ? CS.LAND : '#111727'; } else { const z = hgt(u, v), g = Math.round(255 - z * 190); ctx.fillStyle = `rgb(${g},${Math.round(g * .98)},${Math.round(g * .95)})`; } ctx.fillRect(cx, cy, cell + .5, cell + .5); ctx.strokeStyle = 'rgba(236,230,218,.14)'; ctx.lineWidth = 1; ctx.strokeRect(cx + .5, cy + .5, cell, cell); }
        if (mode === 'shape') { ctx.fillStyle = CS.RED; pts.forEach(p => { const cx = xb + Math.floor(p[0] * pw / cell) * cell, cy = y0 + Math.floor(p[1] * ph / cell) * cell; ctx.fillRect(cx, cy, cell, cell); }); }
        ctx.restore();
        CS.$(el, `#${id}-c-o`).textContent = `${S.value} units`;
        CS.$(el, `#${id}-r`).innerHTML = mode === 'shape' ? `<strong>${N} corners, or ${CS.int(tot)} cells</strong><span>Vector stores where the edge is. Raster asks each cell one question: land or not? Shrink the cells and the edge gets truer, and the file gets bigger.</span>` : `<strong>Height, rainfall, wind: no edges to trace</strong><span>A value in every cell fits a surface. Vector has to fake it with contour lines.</span>`;
      };
      S.oninput = draw; addEventListener('resize', draw); new MutationObserver(draw).observe(el, { attributes: true, attributeFilter: ['class'] });
      el.querySelectorAll(`#${id}-m button`).forEach(b => b.onclick = () => { mode = b.dataset.m; el.querySelectorAll(`#${id}-m button`).forEach(x => x.classList.toggle('on', x === b)); draw(); }); draw();
    }
  };
}
NEW_SLIDES['Vector and raster, a first look'] = vectorRaster(false);
NEW_SLIDES['Vector and raster'] = vectorRaster(true);
