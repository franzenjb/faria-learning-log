// GIS Day 2026 presenter deck. Paper, ink, one red. Click or arrow to reveal.
// Facts follow the course at /claude1/ and the topics under content/topics/.
const c = document.getElementById('c'), x = c.getContext('2d');
const W = 1920, H = 1080;
const INK = '#161514', RED = '#b01f24', MUTE = '#6b6763', HAIR = '#cdc8bc', LAND = '#e9e5dc', PAPER = '#fffdf6';
const SERIF = '"Source Serif 4","Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif';
const D = Math.PI / 180, TAU = Math.PI * 2;
const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ez = u => u * u * (3 - 2 * u);
const lerp = (a, b, u) => a + (b - a) * u;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const STEP_MS = reduce ? 1 : 680;

function fit() {
  const s = Math.min(innerWidth / W, innerHeight / H);
  c.style.width = W * s + 'px';
  c.style.height = H * s + 'px';
}
fit();
addEventListener('resize', fit);

function T(s, px, py, size = 32, col = INK, al = 'left', a = 1, it = false, wt = 400) {
  if (a <= 0 || !s) return;
  x.globalAlpha = cl(a);
  x.font = `${it ? 'italic ' : ''}${wt} ${size}px ${SERIF}`;
  x.fillStyle = col;
  x.textAlign = al;
  x.textBaseline = 'alphabetic';
  x.fillText(s, px, py);
  x.globalAlpha = 1;
}
function L(x1, y1, x2, y2, col = INK, w = 2, dash, p = 1) {
  if (p <= 0) return;
  x.beginPath();
  x.moveTo(x1, y1);
  x.lineTo(lerp(x1, x2, cl(p)), lerp(y1, y2, cl(p)));
  x.strokeStyle = col;
  x.lineWidth = w;
  x.setLineDash(dash || []);
  x.lineCap = 'butt';
  x.stroke();
  x.setLineDash([]);
}
function poly(pts, p, col = INK, w = 2, dash) {
  if (p <= 0 || pts.length < 2) return;
  const n = pts.length - 1, f = cl(p) * n, i = Math.min(n - 1, Math.floor(f)), t = f - i;
  x.beginPath();
  x.moveTo(pts[0][0], pts[0][1]);
  for (let k = 1; k <= i; k++) x.lineTo(pts[k][0], pts[k][1]);
  x.lineTo(lerp(pts[i][0], pts[i + 1][0], t), lerp(pts[i][1], pts[i + 1][1], t));
  x.strokeStyle = col;
  x.lineWidth = w;
  x.setLineDash(dash || []);
  x.lineJoin = 'round';
  x.lineCap = 'round';
  x.stroke();
  x.setLineDash([]);
  x.lineJoin = 'miter';
  x.lineCap = 'butt';
}
function C(px, py, r, fill, stroke, w = 2) {
  if (r <= 0) return;
  x.beginPath();
  x.arc(px, py, r, 0, TAU);
  if (fill) { x.fillStyle = fill; x.fill(); }
  if (stroke) { x.strokeStyle = stroke; x.lineWidth = w; x.stroke(); }
}
function arc(px, py, r, a0, a1, col = RED, w = 3, ccw = false, p = 1) {
  if (p <= 0 || r <= 0) return;
  x.beginPath();
  x.arc(px, py, r, a0, lerp(a0, a1, cl(p)), ccw);
  x.strokeStyle = col;
  x.lineWidth = w;
  x.stroke();
}
function star(px, py, r = 14, col = RED, a = 1) {
  if (a <= 0) return;
  x.save();
  x.globalAlpha = cl(a);
  x.beginPath();
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * .42 : r;
    i ? x.lineTo(px + q * Math.cos(ang), py + q * Math.sin(ang)) : x.moveTo(px + q * Math.cos(ang), py + q * Math.sin(ang));
  }
  x.closePath();
  x.fillStyle = col;
  x.fill();
  x.restore();
}
function ship(px, py, s = 1, col = INK, rot = 0, a = 1) {
  if (a <= 0) return;
  x.save();
  x.globalAlpha = cl(a);
  x.translate(px, py);
  x.rotate(rot);
  x.scale(s, s);
  x.fillStyle = col;
  x.beginPath();
  x.moveTo(-30, 0); x.lineTo(30, 0); x.lineTo(21, 15); x.lineTo(-21, 15);
  x.closePath();
  x.fill();
  L(0, 0, 0, -40, col, 2.5);
  x.beginPath();
  x.moveTo(3, -37); x.lineTo(25, -9); x.lineTo(3, -9);
  x.closePath();
  x.fillStyle = PAPER;
  x.fill();
  x.strokeStyle = col;
  x.lineWidth = 1.6;
  x.stroke();
  x.restore();
}
function person(px, py, s = 1, rot = 0, col = INK, a = 1) {
  if (a <= 0) return;
  x.save();
  x.globalAlpha = cl(a);
  x.translate(px, py);
  x.rotate(rot);
  x.scale(s, s);
  C(0, -58, 9, col);
  x.strokeStyle = col;
  x.lineWidth = 7;
  x.lineCap = 'round';
  x.beginPath();
  x.moveTo(0, -46); x.lineTo(0, -20);
  x.moveTo(0, -20); x.lineTo(-9, 0);
  x.moveTo(0, -20); x.lineTo(9, 0);
  x.moveTo(-12, -34); x.lineTo(12, -34);
  x.stroke();
  x.restore();
}
function pin(px, py, a = 1) {
  if (a <= 0) return;
  x.save();
  x.globalAlpha = cl(a);
  L(px, py, px, py - 42, RED, 3, null, 1);
  C(px, py - 56, 16, RED);
  C(px, py - 56, 6, PAPER);
  x.restore();
}
function fist(px, py, s = 1, a = 1) {
  if (a <= 0) return;
  x.save();
  x.globalAlpha = cl(a);
  x.translate(px, py);
  x.scale(s, s);
  x.beginPath();
  x.roundRect(-16, -20, 32, 36, 9);
  x.strokeStyle = INK;
  x.lineWidth = 2.5;
  x.stroke();
  L(-11, -4, 11, -4, INK, 1.5);
  L(-11, 7, 11, 7, INK, 1.5);
  x.restore();
}
function wrap(s, size, maxW, it = false, wt = 400) {
  x.font = `${it ? 'italic ' : ''}${wt} ${size}px ${SERIF}`;
  const lines = [];
  let cur = '';
  for (const w of String(s).split(' ')) {
    const t = cur ? cur + ' ' + w : w;
    if (x.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; }
    else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
}
function caption(s, y, it = false) {
  if (!s) return;
  const size = 38, lines = wrap(s, size, 1560, it);
  const top = y - (lines.length - 1) * 50;
  lines.forEach((ln, i) => T(ln, 960, top + i * 50, size, INK, 'center', 1, it));
}

function globe(cx, cy, R, lon0, lat0, o = {}) {
  const cl0 = Math.cos(lat0 * D), sl0 = Math.sin(lat0 * D);
  const pr = (lon, lat) => {
    const l = (lon - lon0) * D, cp = Math.cos(lat * D), sp = Math.sin(lat * D);
    return {
      x: cx + R * cp * Math.sin(l),
      y: cy - R * (cl0 * sp - sl0 * cp * Math.cos(l)),
      z: sl0 * sp + cl0 * cp * Math.cos(l)
    };
  };
  C(cx, cy, R, '#ffffff', INK, 2.5);
  x.save();
  x.beginPath();
  x.arc(cx, cy, R - 1, 0, TAU);
  x.clip();
  if (o.grid) {
    for (let la = -60; la <= 60; la += 30) {
      const pts = [];
      for (let lo = -180; lo <= 180; lo += 4) {
        const p = pr(lo, la);
        if (p.z > 0) pts.push([p.x, p.y]);
        else if (pts.length) { poly(pts, 1, la === 0 ? RED : HAIR, la === 0 ? 2 : 1); pts.length = 0; }
      }
      if (pts.length) poly(pts, 1, la === 0 ? RED : HAIR, la === 0 ? 2 : 1);
    }
  }
  x.strokeStyle = INK;
  x.lineWidth = 1.6;
  x.beginPath();
  for (const ln of COAST.lines) {
    let pen = 0;
    for (let i = 0; i < ln.length; i += 2) {
      const p = pr(ln[i] / COAST.q, ln[i + 1] / COAST.q);
      if (p.z > 0) { pen ? x.lineTo(p.x, p.y) : x.moveTo(p.x, p.y); pen = 1; }
      else pen = 0;
    }
  }
  x.stroke();
  x.restore();
  return pr;
}
function meridian(pr, lon, latA, latB, p, col, w = 2.5) {
  const pts = [];
  const n = 48;
  for (let i = 0; i <= n; i++) {
    const la = lerp(latA, latB, i / n);
    const q = pr(lon, la);
    if (q.z > 0.02) pts.push([q.x, q.y]);
    else if (pts.length) { poly(pts, p, col, w); pts.length = 0; }
  }
  if (pts.length) poly(pts, p, col, w);
}

let STEP = 0, U = 1, SEC = 0;
function vis(s) { return STEP > s ? 1 : STEP === s ? U : 0; }

function clockDisk(cx, cy, R, west, showShip) {
  C(cx, cy, R, '#ffffff', INK, 2.5);
  for (let h = 0; h < 24; h++) {
    const a = -Math.PI / 2 + h * 15 * D;
    const inner = h % 6 === 0 ? R - 22 : R - 12;
    L(cx + inner * Math.cos(a), cy + inner * Math.sin(a), cx + R * Math.cos(a), cy + R * Math.sin(a), h % 6 === 0 ? INK : HAIR, h % 6 === 0 ? 2 : 1.2);
  }
  const aG = -Math.PI / 2, aS = -Math.PI / 2 + west * D;
  x.beginPath();
  x.moveTo(cx, cy);
  x.arc(cx, cy, R, aG, aS, false);
  x.closePath();
  x.fillStyle = 'rgba(176,31,36,.12)';
  x.fill();
  L(cx, cy, cx + R * Math.cos(aG), cy + R * Math.sin(aG), INK, 3);
  L(cx, cy, cx + R * Math.cos(aS), cy + R * Math.sin(aS), RED, 4);
  C(cx, cy, 7, INK);
  T('North', cx, cy + 46, 28, MUTE, 'center');
  for (const h of [0, 6, 12, 18]) {
    const a = -Math.PI / 2 + h * 15 * D;
    const lx = cx + (R + 42) * Math.cos(a), ly = cy + (R + 42) * Math.sin(a) + 10;
    if (h === 0) T('Greenwich', lx + 28, ly, 32, INK, 'left');
    else T(String(h), lx, ly, 28, MUTE, 'center');
  }
  if (showShip) ship(cx + (R - 58) * Math.cos(aS), cy + (R - 58) * Math.sin(aS), 1.15, INK, aS + Math.PI / 2);
  return aS;
}
function westFromPoint(px, py, cx, cy) {
  const a = Math.atan2(py - cy, px - cx);
  let west = (a - (-Math.PI / 2)) / D;
  west = (west % 360 + 360) % 360;
  return cl(west, 0, 180);
}

const SLIDES = [];
function add(s) { SLIDES.push(s); }

add({
  title: 'Where Am I?',
  endMin: 1.5,
  pause: '30 seconds',
  ask: 'Fly due south from Havana. Which South American country do you cross first?',
  notes: [
    'This first frame is only the question. Pause 30 seconds and take the vote. Most rooms say Peru. Do not mention a map.',
    'One click reveals the globe. D is correct. Havana is 82.4° west. Punta Pariñas is 81.3° west. The meridian runs down the open Pacific. All of South America lies east.',
    'By 1:30. Say GIS Day, and your name: Jeff Franzen, Disaster GIS, American Red Cross.'
  ],
  caps: [
    '',
    'None. Havana is 82.4° W. The continent ends at 81.3° W — all of South America lies east.'
  ],
  capY: 980,
  draw() {
    T('GIS Day 2026  ·  Jeff Franzen  ·  Disaster GIS  ·  American Red Cross', 960, 170, 28, MUTE, 'center');
    wrap('Fly due south from Havana. Which South American country do you cross first?', 42, 1500).forEach((ln, i) => T(ln, 960, 280 + i * 56, 42, INK, 'center', 1, false, 500));
    const opts = ['Colombia', 'Ecuador', 'Peru', 'None of them'];
    const reveal = STEP >= 1;
    opts.forEach((name, i) => {
      const y = (reveal ? 460 : 480) + i * 72;
      const x0 = reveal ? 160 : 720;
      const col = reveal && i === 3 ? RED : INK;
      T('ABCD'[i], x0, y, 42, col, 'left', 1, false, 500);
      T(name, x0 + 70, y, 42, col);
    });
    if (!reveal) return;
    const g = vis(1);
    x.save();
    x.globalAlpha = g;
    const pr = globe(1240, 560, 250, -70, 6);
    x.restore();
    meridian(pr, -82.38, 36, -46, g, RED, 3.5);
    const hv = pr(-82.38, 23.13), pp = pr(-81.33, -4.68);
    if (hv.z > 0) C(hv.x, hv.y, 6, RED);
    if (pp.z > 0) C(pp.x, pp.y, 5, INK);
    T('Havana  82.4° W', 1560, 480, 28, INK, 'left', g);
    T('Punta Pariñas  81.3° W', 1560, 522, 28, INK, 'left', g);
    T('open Pacific', 1560, 564, 28, MUTE, 'left', g);
  }
});

add({
  title: 'A Thousand Paces',
  endMin: 2.5,
  notes: [
    'A Roman mile is a thousand paces, and a pace is two steps, left foot back to left foot.',
    'Greek bematists, pronounced BEE-muh-tists, were paid to walk in even steps. Eratosthenes used their count.',
    'One minute here. The stick is next. This pair ends by 3:30.'
  ],
  caps: [
    'A pace is two steps, left foot back to left foot.',
    'A Roman mile is a thousand of those paces.',
    'Greek bematists were paid to walk in even steps and count them.'
  ],
  capY: 900,
  draw() {
    const y = 640;
    L(300, y, 1620, y, INK, 2.5, null, vis(0));
    const n = STEP >= 1 ? 16 : 2;
    for (let i = 0; i < n; i++) {
      const px = 420 + i * 70;
      L(px, y - 16, px, y + 16, INK, 2, null, vis(STEP >= 1 ? 1 : 0));
    }
    person(390, y, 1.35, 0, INK, vis(0));
    L(420, y + 70, 490, y + 70, INK, 2, null, vis(0));
    T('1 pace', 455, y + 110, 32, MUTE, 'center', vis(0));
    const b = vis(1);
    L(420, y - 130, 420 + 15 * 70, y - 130, RED, 3, null, b);
    T('1,000 paces', 960, y - 156, 64, RED, 'center', b, false, 500);
    const bem = vis(2);
    person(1180, y, 1.35, 0, INK, bem);
    T('bematist', 1180, y + 110, 32, INK, 'center', bem);
  }
});

add({
  title: 'A Stick and a Shadow',
  endMin: 3.5,
  notes: [
    'About 240 BC. Syene is Aswan. On the solstice the noon Sun lights the bottom of a well. At Alexandria the same noon, a stick reads 7.2°.',
    '7.2° is one fiftieth of a circle, so the Earth is fifty times the walked distance, about 5,000 stadia. The picture spreads the angle so the shadow can be seen. His result lands somewhere from about 24,000 to 29,000 miles. The real circumference is about 24,901.',
    'By 3:30.'
  ],
  caps: [
    'At Syene, on the solstice, the noon Sun lights the bottom of a well.',
    'At Alexandria, that same noon, a stick’s shadow is 7.2 degrees.',
    '7.2 degrees is one fiftieth of a circle. The Earth is fifty times that walk.'
  ],
  capY: 960,
  draw() {
    const cx = 1080, cy = 2200, R = 1620, tilt = 0.015, sep = 14 * D;
    const pt = ang => [cx + R * Math.sin(ang), cy - R * Math.cos(ang)];
    const outward = ang => [Math.sin(ang), -Math.cos(ang)];
    const samples = [];
    for (let ang = -0.46; ang <= 0.30; ang += 0.012) samples.push(pt(ang));
    const left = samples[0], right = samples[samples.length - 1];
    x.beginPath();
    x.moveTo(left[0], left[1] + 90);
    samples.forEach(p => x.lineTo(p[0], p[1]));
    x.lineTo(right[0], right[1] + 90);
    x.closePath();
    x.fillStyle = LAND;
    x.fill();
    poly(samples, 1, INK, 3);
    const show = vis(0);
    for (let i = -3; i <= 2; i++) {
      const ang = tilt + i * 0.07;
      const [bx, by] = pt(ang);
      L(bx - Math.sin(tilt) * 340, by - Math.cos(tilt) * 340, bx, by, HAIR, 1.5, [8, 10], show);
    }
    const [sx, sy] = pt(tilt);
    x.save();
    x.globalAlpha = show;
    x.fillStyle = PAPER;
    x.strokeStyle = INK;
    x.lineWidth = 3;
    x.fillRect(sx - 15, sy - 2, 30, 52);
    x.strokeRect(sx - 15, sy - 2, 30, 52);
    x.restore();
    T('Syene', sx + 34, sy + 36, 32, INK, 'left', show);
    const [ax, ay] = pt(tilt - sep);
    const [ux, uy] = outward(tilt - sep);
    const stick = vis(1);
    const tipx = ax + ux * 190, tipy = ay + uy * 190;
    L(ax, ay, tipx, tipy, INK, 7, null, stick);
    const shx = ax + 86, shy = ay + 6;
    L(tipx, tipy, shx, shy, RED, 3, null, stick);
    L(ax, ay, shx, shy, RED, 8, null, stick);
    T('Alexandria', ax - 16, ay + 58, 32, INK, 'right', stick);
    T('7.2°', tipx + 24, tipy + 8, 56, RED, 'left', stick, false, 500);
    T('1/50 of the circle', 280, 360, 44, INK, 'left', vis(2), false, 500);
  }
});

add({
  title: 'Twelve Knuckles',
  endMin: 5.5,
  notes: [
    'Thumb counts three segments on each of four fingers: twelve. Five fingers on the other hand count the twelves: sixty.',
    'Show the counting if you like, and keep it short. The point is the number, not a history of Babylon.',
    'Sixty divides evenly by 2, 3, 4, 5, 6, 10, 12, 15, 20, and 30. By 5:30.'
  ],
  caps: [
    'The thumb counts the segments on the other four fingers.',
    'Three segments on a finger, four fingers: twelve.',
    'Five fingers on the other hand count the twelves. That is sixty.',
    'Sixty divides by 2, 3, 4, 5, 6, 10, 12, 15, 20, and 30.'
  ],
  capY: 980,
  draw() {
    drawHand(700, 470, vis(1) * 12);
    const five = vis(2);
    T('× 5', 1180, 500, 64, INK, 'left', five, false, 500);
    const total = STEP >= 2 ? '60' : '12';
    const showN = Math.max(vis(1), vis(2));
    T(total, 1180, 600, 120, RED, 'left', showN, false, 500);
    const div = vis(3);
    const nums = ['2', '3', '4', '5', '6', '10', '12', '15', '20', '30'];
    nums.forEach((n, i) => T(n, 360 + i * 130, 900, 36, INK, 'center', div));
  }
});

function drawHand(ox, oy, lit) {
  x.save();
  x.translate(ox, oy);
  x.strokeStyle = INK;
  x.lineWidth = 3;
  x.beginPath();
  x.roundRect(-150, 30, 300, 250, 70);
  x.stroke();
  const fingers = [
    { x: 86, h: 250 },
    { x: 18, h: 290 },
    { x: -50, h: 270 },
    { x: -118, h: 230 }
  ];
  let n = 0;
  for (const f of fingers) {
    const top = -f.h + 10, h = f.h - 20, w = 58;
    x.beginPath();
    x.roundRect(f.x - w / 2, top, w, h + 30, 24);
    x.stroke();
    for (let s = 0; s < 3; s++) {
      const y0 = top + s * (h / 3);
      const on = n < lit ? 1 : 0;
      if (on) {
        x.fillStyle = LAND;
        x.fillRect(f.x - w / 2 + 4, y0 + 4, w - 8, h / 3 - 8);
      }
      L(f.x - w / 2, y0 + h / 3, f.x + w / 2, y0 + h / 3, INK, 2, null, on || (n === 0 ? vis(0) : 0));
      n++;
    }
  }
  x.beginPath();
  x.roundRect(150, 40, 46, 130, 22);
  x.stroke();
  T('thumb', 200, 250, 28, MUTE, 'left', vis(0));
  x.restore();
}

add({
  title: 'One Circle, One Day',
  endMin: 7.5,
  pause: '30 seconds',
  ask: 'Thirty degrees is how many hours?',
  state: { west: 0, held: false },
  dragOnly: true,
  notes: [
    'The circle is 360 degrees and the day is 24 hours. One full turn. Fifteen degrees is one hour. Spin the disk if you want.',
    'Pause 30 seconds. Ask how many hours thirty degrees is. The answer is two. People say the two phrases interchangeably.',
    'One minute of latitude is one nautical mile. At the equator, four seconds of time is one nautical mile. By 7:30. The next slide says why the Sun’s day is the longer one.'
  ],
  caps: [
    'The circle is 360 degrees, and the day is 24 hours.',
    'One hour is 15 degrees.',
    'Thirty degrees is how many hours?',
    'Two hours. The two phrases name the same turn.',
    'One minute of latitude is one nautical mile.',
    'At the equator, four seconds of time is one nautical mile.'
  ],
  capY: 980,
  sync() {
    if (this.state.held) return;
    const targets = [0, 15, 30, 30, 30, 30];
    this.state.west = targets[STEP] ?? 0;
  },
  grab(p) {
    const dx = p.x - 760, dy = p.y - 500;
    if (Math.hypot(dx, dy) < 340) { this.state.held = true; this.move(p); return true; }
  },
  move(p) { this.state.west = westFromPoint(p.x, p.y, 760, 500); },
  draw() {
    this.sync();
    const west = this.state.held ? this.state.west : lerp([0, 0, 15, 30, 30, 30][Math.max(0, STEP - 1)] || 0, [0, 15, 30, 30, 30, 30][STEP] || 0, STEP === 0 ? vis(0) : U);
    if (!this.state.held && STEP <= 2) {
      /* west already eased via the lerp above when not held; sync overwrites before draw. Recompute. */
    }
    const from = [0, 0, 15, 30, 30, 30][STEP];
    const to = [0, 15, 30, 30, 30, 30][STEP];
    const w = this.state.held ? this.state.west : lerp(from, to, STEP === 0 ? 1 : U);
    clockDisk(760, 500, 250, w, true);
    const showDeg = STEP >= 1 && STEP <= 3;
    if (showDeg) T(`${trimNum(w)}°`, 1180, 460, 100, RED, 'left', 1, false, 500);
    if (STEP === 1) T('1 hour  =  15°', 1180, 540, 40, INK, 'left', 1);
    if (STEP === 3) T('2 hours', 1180, 540, 48, INK, 'left', 1, false, 500);
    if (STEP === 4) {
      T('1′ of latitude', 1140, 460, 40, INK, 'left', 1);
      T('=  1 nautical mile', 1140, 530, 44, RED, 'left', 1, false, 500);
    }
    if (STEP >= 5) {
      T('4 seconds of time', 1140, 460, 40, INK, 'left', 1);
      T('=  1 nautical mile', 1140, 530, 44, RED, 'left', 1, false, 500);
      T('at the equator', 1140, 590, 32, MUTE, 'left', 1, true);
    }
  }
});

function trimNum(n) {
  const r = Math.round(n * 10) / 10;
  return Math.abs(r - Math.round(r)) < 0.05 ? String(Math.round(r)) : r.toFixed(1);
}

add({
  title: 'One Degree More',
  endMin: 8.25,
  notes: [
    'Forty-five seconds, three clicks. Sidereal, sy-DEER-ee-ul, means by the stars. One turn against the stars is 23 hours 56 minutes. The precise length is 23 hours 56 minutes 4 seconds. Say 23 hours 56 minutes.',
    'The Earth also travels about one degree of its orbit in a day, 360 divided by 365, not a quarter turn. The drawing exaggerates that step. It is marked not to scale.',
    'One degree of spin is four minutes, because a day has 1,440 minutes and the circle has 360 degrees. The solar day is 24 hours. By 8:15.'
  ],
  caps: [
    'One full turn against the stars is 23 hours 56 minutes.',
    'The Earth also moves about one degree along its orbit, so that turn misses the Sun.',
    'One extra degree takes four minutes. The solar day is 24 hours.'
  ],
  capY: 980,
  draw() {
    const A = [940, 600], starAt = [260, 300];
    const sdir = [starAt[0] - A[0], starAt[1] - A[1]];
    const slen = Math.hypot(sdir[0], sdir[1]);
    const su = [sdir[0] / slen, sdir[1] / slen];
    const sun = [A[0] + su[0] * 430, A[1] + su[1] * 430];
    const tan = [-su[1], su[0]];
    const travel = 200;
    const B = [A[0] + tan[0] * travel, A[1] + tan[1] * travel];
    const starAng = Math.atan2(su[1], su[0]);
    const sunAng = Math.atan2(sun[1] - B[1], sun[0] - B[0]);
    let extra = sunAng - starAng;
    while (extra > Math.PI) extra -= TAU;
    while (extra < -Math.PI) extra += TAU;
    const dust = [[1500, 170], [1320, 210], [1680, 250], [1180, 150], [1560, 340], [180, 180], [420, 160], [700, 140], [980, 160], [1760, 160]];
    dust.forEach(p => C(p[0], p[1], 2.2, INK));
    star(starAt[0], starAt[1], 16, INK, 1);
    T('a star', starAt[0] + 26, starAt[1] + 8, 32, INK, 'left', vis(0));
    C(sun[0], sun[1], 28, PAPER, INK, 2.5);
    for (let i = 0; i < 8; i++) {
      const a = i * TAU / 8, inner = 36, outer = 52;
      L(sun[0] + Math.cos(a) * inner, sun[1] + Math.sin(a) * inner, sun[0] + Math.cos(a) * outer, sun[1] + Math.sin(a) * outer, INK, 2);
    }
    T('Sun', sun[0], sun[1] + 78, 32, INK, 'center', vis(0));
    const orbitR = Math.hypot(A[0] - sun[0], A[1] - sun[1]);
    const angA = Math.atan2(A[1] - sun[1], A[0] - sun[0]);
    const angB = Math.atan2(B[1] - sun[1], B[0] - sun[0]);
    let sweep = angB - angA;
    while (sweep > Math.PI) sweep -= TAU;
    while (sweep < -Math.PI) sweep += TAU;
    const arcP = Math.max(vis(1), STEP > 1 ? 1 : 0);
    if (arcP > 0) {
      const pts = [];
      for (let i = 0; i <= 28; i++) {
        const a = angA + sweep * (i / 28) * arcP;
        pts.push([sun[0] + orbitR * Math.cos(a), sun[1] + orbitR * Math.sin(a)]);
      }
      poly(pts, 1, HAIR, 1.5);
    }
    T('not to scale', 1120, 390, 28, MUTE, 'left', arcP, true);
    const place = STEP === 0 ? A : [lerp(A[0], B[0], STEP === 1 ? U : 1), lerp(A[1], B[1], STEP === 1 ? U : 1)];
    const spin = starAng - TAU * (1 - (STEP === 0 ? U : 1));
    const swing = STEP >= 2 ? extra * U : 0;
    const axis = -1.15;
    const drawEarth = (c, ang, col, w, a, reach) => {
      if (a <= 0) return;
      x.save();
      x.globalAlpha = a;
      C(c[0], c[1], 64, '#ffffff', INK, 2.5);
      L(c[0] - Math.cos(axis) * 64, c[1] - Math.sin(axis) * 64, c[0] + Math.cos(axis) * 64, c[1] + Math.sin(axis) * 64, HAIR, 1.5, [5, 6]);
      L(c[0], c[1], c[0] + Math.cos(ang) * 64, c[1] + Math.sin(ang) * 64, col, w);
      C(c[0] + Math.cos(ang) * 64, c[1] + Math.sin(ang) * 64, 7, col);
      L(c[0] + Math.cos(ang) * 74, c[1] + Math.sin(ang) * 74, c[0] + Math.cos(ang) * reach, c[1] + Math.sin(ang) * reach, col, 1.5, [7, 7]);
      x.restore();
    };
    const reachStar = slen - 30;
    if (STEP >= 1) drawEarth(A, starAng, INK, 2, 0.45, reachStar);
    drawEarth(place, STEP >= 2 ? starAng : spin, INK, 3, 1, STEP === 0 ? reachStar : 250);
    if (STEP === 0 && U > 0.72) T('23 h 56 m', A[0] + 90, A[1] - 36, 48, INK, 'left', cl((U - 0.72) / 0.28), false, 500);
    if (STEP >= 1) T('23 h 56 m', A[0] - 30, A[1] + 120, 40, INK, 'center', STEP === 1 ? 1 : 0.85, false, 500);
    if (STEP >= 2) {
      const ang = starAng + swing;
      const toSun = Math.hypot(sun[0] - B[0], sun[1] - B[1]) - 40;
      L(B[0], B[1], B[0] + Math.cos(ang) * 64, B[1] + Math.sin(ang) * 64, RED, 4, null, U);
      L(B[0] + Math.cos(ang) * 74, B[1] + Math.sin(ang) * 74, B[0] + Math.cos(ang) * toSun, B[1] + Math.sin(ang) * toSun, RED, 2, [7, 7], U);
      C(B[0] + Math.cos(ang) * 64, B[1] + Math.sin(ang) * 64, 7, RED);
      arc(B[0], B[1], 96, starAng, starAng + extra, RED, 4, extra < 0, U);
      T('+1°  =  4 minutes', 1240, 460, 42, RED, 'left', U, false, 500);
      T('24 h solar day', 1240, 520, 44, INK, 'left', cl((U - 0.4) / 0.45), false, 500);
    }
    C(sun[0], sun[1], 28, PAPER, INK, 2.5);
    for (let i = 0; i < 8; i++) {
      const a = i * TAU / 8;
      L(sun[0] + Math.cos(a) * 36, sun[1] + Math.sin(a) * 36, sun[0] + Math.cos(a) * 52, sun[1] + Math.sin(a) * 52, INK, 2);
    }
    T('Sun', sun[0], sun[1] + 78, 32, INK, 'center');
  }
});

add({
  title: 'Call a Square',
  endMin: 10,
  state: { row: null, col: null, picked: false },
  zones: [],
  notes: [
    'A place is a row and a column. Call the latitude, then the longitude. Click a heading to choose a different square.',
    'The row is the one the sky will give you. The column is the one it will not. Save that contrast for the next minute.',
    'A minute and 45 seconds on this slide. By 10:00.'
  ],
  caps: [
    'To name a place, call a row and call a column.',
    'Call the row. A latitude is a whole line of places.',
    'Call the column. One square, and a pin.'
  ],
  capY: 980,
  lats: [60, 45, 30, 15, 0],
  lons: [60, 45, 30, 15, 0],
  grab(p) {
    for (const z of this.zones) {
      if (p.x >= z.x && p.x <= z.x + z.w && p.y >= z.y && p.y <= z.y + z.h) {
        this.state.picked = true;
        if (z.kind === 'row') this.state.row = z.i;
        if (z.kind === 'col') this.state.col = z.i;
        if (z.kind === 'cell') { this.state.row = z.r; this.state.col = z.c; }
        return true;
      }
    }
  },
  draw() {
    if (!this.state.picked) {
      if (STEP >= 1) this.state.row = 2;
      if (STEP >= 2) this.state.col = 3;
      if (STEP < 1) this.state.row = null;
      if (STEP < 2) this.state.col = null;
    }
    const lats = this.lats, lons = this.lons;
    const x0 = 620, y0 = 250, cw = 148, ch = 112;
    this.zones = [];
    lons.forEach((lon, i) => {
      const px = x0 + i * cw;
      this.zones.push({ kind: 'col', i, x: px, y: y0 - 70, w: cw, h: 60 });
      T(`${lon}° W`, px + cw / 2, y0 - 24, 32, this.state.col === i ? RED : MUTE, 'center', vis(0));
    });
    lats.forEach((lat, j) => {
      this.zones.push({ kind: 'row', i: j, x: x0 - 160, y: y0 + j * ch, w: 150, h: ch });
      T(`${lat}° N`, x0 - 24, y0 + j * ch + ch / 2 + 10, 32, this.state.row === j ? RED : MUTE, 'right', vis(0));
      for (let i = 0; i < lons.length; i++) {
        const px = x0 + i * cw, py = y0 + j * ch;
        this.zones.push({ kind: 'cell', r: j, c: i, x: px, y: py, w: cw, h: ch });
        const onRow = this.state.row === j && vis(1) > 0;
        const on = onRow && this.state.col === i && (STEP >= 2);
        x.strokeStyle = on ? RED : HAIR;
        x.lineWidth = on ? 3 : 1.5;
        x.strokeRect(px, py, cw, ch);
        if (onRow && this.state.col !== i) {
          x.fillStyle = LAND;
          x.globalAlpha = vis(1);
          x.fillRect(px + 2, py + 2, cw - 4, ch - 4);
          x.globalAlpha = 1;
        }
        if (on) pin(px + cw / 2, py + ch / 2 + 20, vis(2) || (this.state.picked ? 1 : 0));
      }
    });
  }
});

add({
  title: 'The Easy Number',
  endMin: 11,
  state: { sep: 3, held: false },
  dragOnly: true,
  notes: [
    'Both ships read the star at the same height, so they share a latitude. Drag them apart. The star does not change.',
    'At 50° north, one degree of longitude is about 39 nautical miles. Nothing in the sky says who is east.',
    'Keep this to one minute. By 11:00.'
  ],
  caps: [
    'The same star, at the same height. The same latitude.',
    'Move them apart. The star still cannot say who is east.'
  ],
  capY: 990,
  grab(p) {
    const x2 = 520 + this.state.sep * 36;
    if (Math.hypot(p.x - x2, p.y - 680) < 90 || Math.hypot(p.x - 520, p.y - 680) < 70) {
      this.state.held = true;
      this.move(p);
      return true;
    }
  },
  move(p) { this.state.sep = cl((p.x - 520) / 36, 1, 28); },
  draw() {
    const target = STEP >= 1 ? 16 : 3;
    if (!this.state.held) this.state.sep = lerp(STEP >= 1 ? 3 : 3, target, STEP === 0 ? 1 : U);
    const sep = this.state.sep;
    x.fillStyle = '#f4f0e6';
    x.fillRect(220, 560, 1480, 250);
    L(220, 680, 1700, 680, INK, 2);
    T('50° north', 250, 640, 32, MUTE, 'left', vis(0));
    const x1 = 520, x2 = 520 + sep * 36;
    [x1, x2].forEach((sx, i) => {
      ship(sx, 680, 1.5, INK, 0, vis(0));
      skyBowl(sx, 470, vis(0));
    });
    const nm = sep * 60 * Math.cos(50 * D);
    const show = vis(1);
    L(x1, 840, x2, 840, RED, 3, null, show);
    T(`${Math.round(nm)} nautical miles`, (x1 + x2) / 2, 888, 36, RED, 'center', show, false, 500);
  }
});

function skyBowl(sx, sy, a) {
  if (a <= 0) return;
  x.save();
  x.globalAlpha = a;
  arc(sx, sy, 120, Math.PI, TAU, HAIR, 2, false, 1);
  L(sx - 130, sy, sx + 130, sy, INK, 2.5);
  const alt = 50 * D;
  L(sx, sy, sx + 120 * Math.cos(alt), sy - 120 * Math.sin(alt), INK, 2);
  star(sx + 120 * Math.cos(alt), sy - 120 * Math.sin(alt), 12, INK, 1);
  T('50°', sx + 36, sy - 28, 32, INK, 'left');
  x.restore();
}

add({
  title: 'Fists and the Pole Star',
  endMin: 13.5,
  pause: '30 seconds',
  ask: 'Hold one fist at arm’s length.',
  state: { lat: 10, held: false },
  dragOnly: true,
  notes: [
    'Pause 30 seconds. One fist at arm’s length is about 10 degrees. Four fists is about 40. Let the room do it.',
    'Then drag the figure north. The height of the pole star and the latitude are the same number.',
    'Polaris is close to the pole today. The next slide is how far off it used to be. By 13:30.'
  ],
  caps: [
    'One fist at arm’s length is about 10 degrees.',
    'Four fists is about 40 degrees up.',
    'Walk north. The star’s height is your latitude.'
  ],
  capY: 980,
  grab(p) {
    if (STEP < 2 && !this.state.held) return;
    const a = this.state.lat * D, cx = 720, cy = 640, R = 210;
    const px = cx + R * Math.cos(a), py = cy - R * Math.sin(a);
    if (Math.hypot(p.x - px, p.y - py) < 120 || (Math.hypot(p.x - cx, p.y - cy) < R + 80 && p.y < cy + 40)) {
      this.state.held = true;
      this.move(p);
      return true;
    }
  },
  move(p) {
    const cx = 720, cy = 640;
    let a = Math.atan2(cy - p.y, p.x - cx);
    this.state.lat = cl(a / D, 0, 72);
  },
  draw() {
    const target = STEP >= 1 ? 40 : 10;
    if (!this.state.held) this.state.lat = lerp(STEP === 0 ? 0 : (STEP === 1 ? 10 : this.state.lat), target, U);
    if (STEP >= 2 && !this.state.held && U >= 1) {
      /* leave the 40° the previous step arrived at */
    }
    const lat = this.state.held ? this.state.lat : (STEP >= 2 ? this.state.lat : lerp(STEP === 1 ? 10 : 0, target, U));
    if (!this.state.held) this.state.lat = lat;
    drawWalker(lat, STEP === 0 ? 1 : 4, vis(0));
  }
});

function drawWalker(lat, fists, a) {
  const cx = 720, cy = 640, R = 210, ang = lat * D;
  x.save();
  x.globalAlpha = a;
  C(cx, cy, R, LAND, INK, 3);
  L(cx - R - 30, cy, cx + R + 50, cy, HAIR, 2);
  T('equator', cx + R + 64, cy + 10, 32, MUTE);
  const px = cx + R * Math.cos(ang), py = cy - R * Math.sin(ang);
  const tx = -Math.sin(ang), ty = -Math.cos(ang);
  L(px - tx * 200, py - ty * 200, px + tx * 200, py + ty * 200, INK, 3);
  person(px, py, 1.2, Math.PI / 2 - ang);
  L(px, py, px, 230, HAIR, 1.5, [7, 8]);
  star(px + 8, 208, 16, INK, 1);
  T('Pole Star', px + 36, 216, 32, INK);
  arc(px, py, 90, -Math.PI / 2, -Math.PI / 2 - ang, RED, 4, true, 1);
  x.restore();
  const n = Math.min(fists, Math.max(1, Math.round(lat / 10)));
  for (let i = 0; i < n; i++) fist(1180, 300 + i * 62, 1.35, a);
  T(`${Math.round(lat)}°`, 1280, 500, 120, RED, 'left', a, false, 500);
  T('up', 1296, 556, 36, INK, 'left', a);
}

add({
  title: 'Not Always the Pole Star',
  endMin: 15,
  notes: [
    'The axis wobbles once in about 26,000 years. Around 100 BC, Polaris was about 12° from the true pole. Hipparchus described an empty patch of sky.',
    'In 1492 the gap was about 3.5°, more than 200 nautical miles if you trust the raw height. Today it is about 0.63°. It comes closest around 2100, near 0.45°, then drifts. Vega is the rough north star in about 12,000 years, still several degrees off.',
    'By 15:00.'
  ],
  caps: [
    'The pole wanders. One wobble takes about 26,000 years.',
    'Around 100 BC, Polaris was about 12 degrees from the pole.',
    'In 1492 the gap was about 3.5 degrees.',
    'Today it is about 0.63 degrees. It will not stay the pole star.'
  ],
  capY: 980,
  draw() {
    const cx = 780, cy = 520, R = 230;
    C(cx, cy, 7, INK);
    T('true pole', cx - 24, cy + 8, 32, MUTE, 'right', vis(0));
    arc(cx, cy, R, 0, TAU, HAIR, 1.5, false, vis(0));
    const gaps = [0, 12, 3.5, 0.63];
    const ang = -0.7;
    const at = g => [cx + R * (g / 12) * Math.cos(ang), cy + R * (g / 12) * Math.sin(ang)];
    if (STEP >= 2) {
      const p = at(12);
      star(p[0], p[1], 12, INK, 1);
      T('100 BC · 12°', p[0] + 22, p[1] - 8, 32, INK, 'left', 1);
    }
    if (STEP >= 3) {
      const p = at(3.5);
      star(p[0], p[1], 12, INK, 1);
      T('1492 · 3.5°', p[0] + 22, p[1] + 36, 32, INK, 'left', 1);
    }
    if (STEP >= 1) {
      const g = lerp(gaps[STEP - 1], gaps[STEP], U);
      const p = at(g);
      L(cx, cy, p[0], p[1], RED, 2.5, null, U);
      star(p[0], p[1], 18, RED, 1);
      const shown = g < 1 ? g.toFixed(2).replace(/0$/, '') : trimNum(g);
      T(`${shown}°`, 1180, 500, 110, RED, 'left', 1, false, 500);
      T(STEP === 1 ? 'around 100 BC' : STEP === 2 ? 'in 1492' : 'today', 1196, 560, 32, MUTE, 'left', 1);
    }
  }
});

add({
  title: 'A Rolling Deck',
  endMin: 16.5,
  notes: [
    'On land the plumb hangs still and you can wait. At sea the deck, the plumb, and the horizon all move.',
    'A long instrument needs a foundation and time. A ship has neither. Latitude was still possible. Longitude was not.',
    'By 16:30.'
  ],
  caps: [
    'On land, a plumb line hangs still.',
    'At sea the deck rolls, and the plumb swings with it.',
    'There is no steady place to set a long instrument.'
  ],
  capY: 960,
  draw() {
    const y = 640;
    const roll = STEP >= 1 ? Math.sin(SEC * 1.05) * 0.32 : 0;
    L(240, y, 1680, y, INK, 2.5, null, vis(0));
    T('true horizon', 260, y - 22, 32, MUTE, 'left', vis(0));
    const ox = 900;
    x.save();
    x.translate(ox, y);
    x.rotate(roll);
    x.fillStyle = INK;
    x.beginPath();
    x.moveTo(-150, 0); x.lineTo(150, 0); x.lineTo(108, 34); x.lineTo(-108, 34);
    x.closePath();
    x.fill();
    L(0, 0, 0, -200, INK, 3);
    x.restore();
    const hx = ox + Math.sin(roll) * 200;
    const hy = y - Math.cos(roll) * 200;
    L(hx, hy, hx, hy + 210, HAIR, 1.5, [7, 7], vis(0));
    const swing = STEP >= 1 ? roll : 0;
    const px = hx + Math.sin(swing) * 170;
    const py = hy + Math.cos(swing) * 170;
    L(hx, hy, px, py, STEP >= 1 ? RED : INK, 3, null, vis(0));
    C(px, py, 11, STEP >= 1 ? RED : INK);
    if (STEP >= 1) {
      arc(hx, hy, 70, Math.PI / 2, Math.PI / 2 + swing, RED, 3, swing < 0, 1);
      T(`${Math.abs(swing / D).toFixed(0)}°`, 1280, 460, 88, RED, 'left', 1, false, 500);
      T('of swing', 1296, 512, 32, MUTE, 'left', 1);
    }
  }
});

add({
  title: 'Two Clocks',
  endMin: 18.5,
  state: { west: 30, held: false },
  dragOnly: true,
  notes: [
    'Local noon is the Sun at its highest, not noon on a civil clock. The other clock is the time at home, carried or computed.',
    'Spin the ship. The gap, in hours, times 15 is the longitude. Two hours behind Greenwich is 30 degrees west. Ahead of Greenwich is east.',
    'By 18:30.'
  ],
  caps: [
    'Local noon is the Sun at its highest. That clock is in the sky.',
    'The missing clock is the time at home, at that same moment.',
    'The gap is your longitude. Two hours is 30 degrees.'
  ],
  capY: 980,
  sync() {
    if (this.state.held) return;
    this.state.west = STEP >= 2 ? 30 : STEP === 1 ? 30 : 0;
  },
  grab(p) {
    if (Math.hypot(p.x - 820, p.y - 500) < 360) { this.state.held = true; this.move(p); return true; }
  },
  move(p) { this.state.west = westFromPoint(p.x, p.y, 820, 500); },
  draw() {
    const to = [0, 30, 30][STEP];
    const from = [0, 0, 30][STEP];
    const w = this.state.held ? this.state.west : lerp(from, to, U);
    if (!this.state.held) this.state.west = w;
    clockDisk(820, 500, 250, w, true);
    const hours = w / 15;
    T('your noon', 1240, 400, 32, INK, 'left', vis(0));
    T('home time', 1240, 460, 32, MUTE, 'left', vis(1));
    if (STEP >= 1) T(`${trimNum(hours)} h`, 1240, 560, 72, INK, 'left', 1, false, 500);
    if (STEP >= 2) T(`${trimNum(w)}°`, 1240, 660, 84, RED, 'left', vis(2), false, 500);
  }
});

add({
  title: 'The Moon as a Clock',
  endMin: 20,
  notes: [
    'Against the stars, the Moon moves about its own width, half a degree, in an hour. Measure the angle to a known star and an almanac turns it into home time.',
    'That is a lunar distance. Parallax, refraction, and a heaving deck all sit on the same sight. It can be done, and it is easy to get wrong.',
    'By 20:00.'
  ],
  caps: [
    'The Moon moves about its own width against the stars in an hour.',
    'Measure that angle. An almanac tells you the time at home.',
    'The corrections are many. A rolling ship makes them worse.'
  ],
  capY: 980,
  draw() {
    const drift = vis(0);
    const moon = [700, 360], starP = [1240, 320], shipP = [960, 720];
    const wob = STEP >= 2 ? Math.sin(SEC * 1.3) * 16 * vis(2) : 0;
    const origin = [shipP[0] + wob, shipP[1]];
    C(moon[0], moon[1], 64, LAND, INK, 3);
    T('Moon', moon[0], moon[1] + 100, 32, MUTE, 'center', drift);
    star(starP[0], starP[1], 16, INK, drift);
    T('a star', starP[0] + 26, starP[1] + 8, 32, INK, 'left', drift);
    L(origin[0], origin[1], moon[0], moon[1], INK, 2, null, drift);
    L(origin[0], origin[1], starP[0], starP[1], INK, 2, null, drift);
    const a1 = Math.atan2(moon[1] - origin[1], moon[0] - origin[0]);
    const a2 = Math.atan2(starP[1] - origin[1], starP[0] - origin[0]);
    arc(origin[0], origin[1], 130, a1, a2, RED, 4, false, vis(1));
    T('the angle', origin[0], origin[1] - 160, 36, RED, 'center', vis(1));
    ship(shipP[0], shipP[1] + 10, 2, INK, wob * 0.01, Math.max(drift, vis(2)));
  }
});

add({
  title: 'Easier on Land',
  endMin: 21,
  notes: [
    'Recap only. On land the ground holds the instrument and you can wait for the sky. On water you get a rolling deck and no second try.',
    'Do not add a method here. The next slide is the one that works on land and fails at sea.',
    'By 21:00.'
  ],
  caps: [
    'On land you can set the instrument down, and wait.',
    'On water the same sight has to be taken from a moving deck.'
  ],
  capY: 960,
  draw() {
    L(240, 700, 1680, 700, INK, 2.5, null, vis(0));
    person(520, 700, 1.6, 0, INK, vis(0));
    L(520, 620, 520, 430, INK, 3, null, vis(0));
    star(520, 400, 16, INK, vis(0));
    T('land', 520, 780, 32, MUTE, 'center', vis(0));
    const sea = vis(1);
    const roll = Math.sin(SEC * 1.3) * 0.18 * sea;
    x.save();
    x.translate(1280, 700);
    x.rotate(roll);
    ship(0, 0, 2.4, INK, 0, sea);
    L(0, -50, Math.sin(roll) * 90, -50 - Math.cos(roll) * 180, RED, 3, null, sea);
    x.restore();
    star(1280, 400, 16, INK, sea);
    T('water', 1280, 780, 32, MUTE, 'center', sea);
  }
});

add({
  title: 'A Clock in the Sky',
  endMin: 24,
  pause: '45 seconds',
  ask: 'What will you see tomorrow night?',
  notes: [
    'January 1610. Galileo sees four moons and calls them the Medicean Stars. The names Io, Europa, Ganymede, and Callisto come later, from Marius.',
    'Pause 45 seconds. Ask what they will see tomorrow night. Then click. The moons have moved. Io goes around in about 42.5 hours, and an eclipse of Io is the same instant for everyone looking.',
    'Cassini’s tables used that clock to remap France from dry land. A long telescope on a rolling deck cannot hold the moons. By 24:00.'
  ],
  caps: [
    'In January 1610, Galileo sees four moons beside Jupiter.',
    'What will you see tomorrow night?',
    'The moons have moved. Io laps Jupiter in about 42.5 hours.',
    'When Io goes dark, everyone looking sees one instant.',
    'On land you can time it. On a rolling deck, the telescope cannot.'
  ],
  capY: 980,
  moons: [
    { name: 'Io', r: 150, P: 1.769 },
    { name: 'Europa', r: 230, P: 3.551 },
    { name: 'Ganymede', r: 350, P: 7.155 },
    { name: 'Callisto', r: 490, P: 16.69 }
  ],
  draw() {
    const days = [0.22, 0.22, 1.22, 0.8845, 0.8845];
    const prev = [0.22, 0.22, 0.22, 1.22, 0.8845][STEP];
    const day = lerp(prev, days[STEP], U);
    const cx = 960, cy = 470;
    const blur = STEP >= 4 ? Math.sin(SEC * 1.6) * 18 : 0;
    L(cx - 560, cy + blur, cx + 560, cy + blur, HAIR, 1.5, null, vis(0));
    C(cx, cy + blur * 0.2, 62, '#f3eee4', INK, 3);
    for (let b = -1; b <= 1; b++) {
      x.save();
      x.beginPath();
      x.arc(cx, cy, 58, 0, TAU);
      x.clip();
      L(cx - 70, cy + b * 18, cx + 70, cy + b * 18, '#cdbfa0', 5);
      x.restore();
    }
    T('Jupiter', cx, cy + 110, 32, INK, 'center', vis(0));
    const eclipse = STEP >= 3;
    const placed = [];
    this.moons.forEach(m => {
      const a = day / m.P * TAU;
      const mx = cx + m.r * Math.sin(a) + (m.name === 'Io' ? blur : blur * 0.25);
      const behind = Math.cos(a) < 0 && Math.abs(Math.sin(a)) < 62 / m.r;
      const gone = eclipse && m.name === 'Io';
      if (!behind && !gone) {
        C(mx, cy + blur * 0.1, m.name === 'Io' && STEP >= 2 ? 12 : 9, m.name === 'Io' && STEP >= 2 ? RED : INK);
        placed.push({ name: m.name, x: mx, io: m.name === 'Io' });
      }
      if (gone) T('Io, gone dark', cx, cy - 110, 44, RED, 'center', vis(3), false, 500);
    });
    placed.sort((a, b) => a.x - b.x);
    placed.forEach((m, i) => {
      const crowded = (i > 0 && m.x - placed[i - 1].x < 110) || (i < placed.length - 1 && placed[i + 1].x - m.x < 110);
      const below = crowded && i % 2 === 1;
      if (m.io || !crowded) T(m.name, m.x, below ? cy + 100 : cy - 40, 28, m.io && STEP >= 2 ? RED : MUTE, 'center', vis(0));
    });
  }
});

add({
  title: 'The Isles of Scilly',
  endMin: 26,
  notes: [
    '22 October 1707. Admiral Sir Clowdesley Shovell, home from Gibraltar, in fog. Spell Clowdesley. The officers agreed they were in the mouth of the Channel.',
    'They were about 100 miles off that reckoning. Association, Eagle, Romney, and Firebrand struck. About two thousand men were lost. Some counts are nearer fourteen hundred.',
    'In 1714 the Longitude Act offers £20,000 to come within half a degree, £15,000 within two thirds, and £10,000 within one degree. Half a degree is two minutes of time. By 26:00. Harrison is next.'
  ],
  caps: [
    '22 October 1707. Sir Clowdesley Shovell is bringing the fleet home, in fog.',
    'The officers agree they are safe in the mouth of the Channel.',
    'They are about 100 miles off. Four ships strike the rocks.',
    'In 1714, Parliament offers £20,000 to come within half a degree.'
  ],
  capY: 980,
  draw() {
    const M = (px, py) => [900 + (px - 682) * 1.7, 500 + (py - 322) * 1.35];
    const land = (pts) => {
      x.beginPath();
      pts.forEach((q, i) => { const p = M(q[0], q[1]); i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]); });
      x.closePath();
      x.fillStyle = LAND;
      x.fill();
      x.strokeStyle = '#a9a498';
      x.lineWidth = 1.5;
      x.stroke();
    };
    x.save();
    x.globalAlpha = vis(0);
    land([[960, 96], [852, 118], [770, 150], [700, 176], [640, 212], [598, 238], [560, 250], [548, 262], [572, 270], [604, 262], [640, 268], [662, 282], [700, 262], [760, 250], [820, 232], [880, 236], [960, 226]]);
    land([[960, 470], [900, 462], [850, 470], [800, 458], [770, 470], [742, 468], [728, 480], [760, 492], [744, 506], [780, 512], [800, 530], [860, 540], [960, 548]]);
    [[424, 262, 8], [438, 252, 6], [412, 250, 5], [430, 274, 5], [404, 268, 4]].forEach(q => {
      const p = M(q[0], q[1]);
      C(p[0], p[1], q[2] * 1.5, LAND, '#a9a498', 1);
    });
    x.restore();
    const lab = (name, px, py, al = 'left') => { const p = M(px, py); T(name, p[0], p[1], 32, INK, al, vis(0)); };
    lab('Cornwall', 790, 180);
    lab('Brittany', 860, 500);
    const rock = M(420, 260);
    T('Isles of Scilly', rock[0], rock[1] - 70, 32, INK, 'center', vis(0));
    const reckoned = [M(260, 500), M(480, 430), M(760, 340), M(920, 300)];
    const actual = [M(260, 470), M(340, 390), M(390, 320), M(420, 262)];
    poly(reckoned, vis(1), INK, 3, [12, 10]);
    const where = M(700, 360);
    T('where they reckoned', where[0], where[1], 32, MUTE, 'left', vis(1), true);
    poly(actual, vis(2), RED, 5);
    const boom = vis(2);
    if (boom > 0.85) {
      L(rock[0] - 16, rock[1] - 16, rock[0] + 16, rock[1] + 16, RED, 6);
      L(rock[0] + 16, rock[1] - 16, rock[0] - 16, rock[1] + 16, RED, 6);
    }
    T('about 100 miles off', rock[0] - 20, rock[1] + 86, 36, RED, 'center', boom, false, 500);
    T('Association  ·  Eagle  ·  Romney  ·  Firebrand', 960, 900, 32, INK, 'center', boom);
  }
});

add({
  title: 'A Watch That Could Travel',
  endMin: 27.5,
  notes: [
    'A pendulum will not keep time on a rolling ship. H4 is dated 1759. On the 1761 trial to Jamaica it lost five seconds in 81 days, about a mile and a quarter at the equator, inside the two minutes the top prize allowed.',
    'Do not say the Board handed him £20,000 at the dock. In 1765 the Board agreed H4 had met the strictest test. Parliament’s further reward came in 1773, after a long argument, and it was not the whole prize in one purse.',
    'By 27:30.'
  ],
  caps: [
    'A pendulum keeps time on land. On a ship, it lies.',
    'Harrison’s H4, dated 1759, is a watch.',
    'On the way to Jamaica it lost five seconds in 81 days.'
  ],
  capY: 960,
  draw() {
    const pend = 1 - vis(1);
    if (pend > 0) {
      x.save();
      x.globalAlpha = pend;
      const swing = Math.sin(SEC * 1.4) * 0.22;
      x.translate(960, 300);
      L(0, 0, Math.sin(swing) * 280, Math.cos(swing) * 280, INK, 3);
      C(Math.sin(swing) * 280, Math.cos(swing) * 280, 28, LAND, INK, 3);
      x.restore();
    }
    const watch = vis(1);
    if (watch > 0) {
      x.save();
      x.globalAlpha = watch;
      C(960, 500, 180, '#ffffff', INK, 3);
      C(960, 500, 8, INK);
      const a = SEC * 0.8;
      L(960, 500, 960 + 110 * Math.sin(a), 500 - 110 * Math.cos(a), INK, 3);
      L(960, 500, 960 + 70 * Math.sin(a / 12), 500 - 70 * Math.cos(a / 12), INK, 5);
      T('H4', 960, 760, 40, INK, 'center');
      T('1759', 960, 808, 32, MUTE, 'center');
      x.restore();
    }
    T('5 seconds', 1320, 500, 72, RED, 'left', vis(2), false, 500);
    T('in 81 days', 1320, 552, 32, MUTE, 'left', vis(2));
  }
});

add({
  title: 'Where Am I?',
  endMin: 28,
  notes: [
    'Half a minute. A row, a column, a pin. Where am I? No new content.',
    'Then two minutes of questions. Stop by 30:00.',
    'If a question opens a cut chapter, leave it. Venus, Cook, Mason and Dixon, and the disaster cases are not this talk.'
  ],
  caps: ['Where am I?'],
  capY: 900,
  draw() {
    const x0 = 520, y0 = 280, gw = 880, gh = 520;
    x.strokeStyle = HAIR;
    x.lineWidth = 1.5;
    for (let i = 0; i <= 4; i++) {
      const p = vis(0);
      L(x0, y0 + i * gh / 4, x0 + gw * p, y0 + i * gh / 4, HAIR, 1.5);
      L(x0 + i * gw / 4, y0, x0 + i * gw / 4, y0 + gh * p, HAIR, 1.5);
    }
    pin(x0 + gw * 0.62, y0 + gh * 0.58, vis(0));
  }
});

const notesEl = document.getElementById('notes');
const hintBy = document.getElementById('hint-by');
const menuEl = document.getElementById('menu');
const menuList = document.getElementById('menu-list');
const menuBack = document.getElementById('menu-back');
let idx = 0, step = 0, animFrom = 0, notesOn = false, dragSlide = null, menuOpen = false;

function byLabel(min) {
  const m = Math.floor(min), s = Math.round((min - m) * 60);
  return `By ${m}:${String(s).padStart(2, '0')}`;
}
function renderNotes() {
  const s = SLIDES[idx];
  const prev = idx ? SLIDES[idx - 1].endMin : 0;
  const dur = s.endMin - prev;
  const dm = Math.floor(dur), ds = Math.round((dur - dm) * 60);
  hintBy.textContent = byLabel(s.endMin);
  notesEl.innerHTML = `<p class="by">${byLabel(s.endMin)}</p><p class="dur">${dm ? dm + ' min ' : ''}${ds ? ds + ' sec' : ''} on this slide · ${s.caps.length} click${s.caps.length > 1 ? 's' : ''}${s.pause ? ' · pause ' + s.pause : ''}</p><h2>${s.title}</h2>${s.ask ? `<p class="ask">${s.ask}</p>` : ''}<ul>${s.notes.map(n => `<li>${n}</li>`).join('')}</ul>`;
}
function go(i, st) {
  idx = cl(i, 0, SLIDES.length - 1);
  const s = SLIDES[idx];
  step = cl(st == null ? 0 : st, 0, s.caps.length - 1);
  STEP = step;
  animFrom = performance.now();
  if (s.state) s.state.held = false;
  const url = `#${idx + 1}${step ? '.' + (step + 1) : ''}`;
  history.replaceState(null, '', url);
  renderNotes();
  if (menuOpen) syncMenu();
}
function next() {
  const s = SLIDES[idx];
  if (step < s.caps.length - 1) go(idx, step + 1);
  else if (idx < SLIDES.length - 1) go(idx + 1, 0);
}
function prev() {
  if (step > 0) go(idx, step - 1);
  else if (idx > 0) go(idx - 1, SLIDES[idx - 1].caps.length - 1);
}
function toggleNotes() {
  notesOn = !notesOn;
  notesEl.hidden = !notesOn;
}

function pointer(e) {
  const r = c.getBoundingClientRect();
  return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H };
}
let down = null, armed = null;
function stopNav(e) { e.stopPropagation(); }
['nav-prev', 'nav-next', 'nav-menu', 'menu-close'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('pointerdown', stopNav);
  el.addEventListener('click', stopNav);
});
document.getElementById('nav-prev').addEventListener('click', e => { e.preventDefault(); prev(); });
document.getElementById('nav-next').addEventListener('click', e => { e.preventDefault(); next(); });
function syncMenu() {
  menuList.querySelectorAll('button.item:not(.home)').forEach((b, i) => b.classList.toggle('on', i === idx));
}
function setMenu(open) {
  menuOpen = open;
  menuEl.hidden = !open;
  menuBack.hidden = !open;
  if (open) syncMenu();
}
function buildMenu() {
  const home = document.createElement('button');
  home.type = 'button';
  home.className = 'item home';
  home.textContent = 'Slide 1  ·  Home';
  home.addEventListener('pointerdown', stopNav);
  home.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); go(0, 0); setMenu(false); });
  menuList.appendChild(home);
  SLIDES.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'item';
    b.textContent = `${i + 1}  ${s.title}`;
    b.addEventListener('pointerdown', stopNav);
    b.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); go(i, 0); setMenu(false); });
    menuList.appendChild(b);
  });
}
buildMenu();
document.getElementById('nav-menu').addEventListener('click', e => { e.preventDefault(); setMenu(!menuOpen); });
document.getElementById('menu-close').addEventListener('click', e => { e.preventDefault(); setMenu(false); });
menuBack.addEventListener('click', () => setMenu(false));
c.addEventListener('pointerdown', e => {
  try { c.setPointerCapture(e.pointerId); } catch (err) {}
  if (menuOpen) { down = null; return; }
  const p = pointer(e);
  const s = SLIDES[idx];
  if (s.grab && !s.dragOnly && s.grab(p)) { dragSlide = s; down = null; return; }
  down = p;
  armed = s.dragOnly ? s : null;
});
c.addEventListener('pointermove', e => {
  if (menuOpen) return;
  const p = pointer(e);
  if (!dragSlide && armed && down && Math.hypot(p.x - down.x, p.y - down.y) > 8) {
    if (armed.grab(down)) dragSlide = armed;
    armed = null;
  }
  if (dragSlide && dragSlide.move) dragSlide.move(p);
});
c.addEventListener('pointerup', e => {
  const p = pointer(e);
  if (menuOpen) { dragSlide = null; down = null; armed = null; return; }
  if (dragSlide) { dragSlide = null; down = null; armed = null; return; }
  if (down) {
    const dx = p.x - down.x, dy = p.y - down.y;
    const adx = Math.abs(dx), ady = Math.abs(dy);
    if (adx > 60 && adx > 1.5 * ady) { if (dx < 0) next(); else prev(); }
    else if (Math.hypot(dx, dy) < 10) { if (p.x < W / 3) prev(); else next(); }
  }
  down = null;
  armed = null;
});

addEventListener('keydown', e => {
  if (e.repeat) return;
  const k = e.key;
  if (k === ' ' || k === 'ArrowRight' || k === 'PageDown') { next(); e.preventDefault(); }
  else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'Backspace') { prev(); e.preventDefault(); }
  else if (k === 'Home') go(0, 0);
  else if (k === 'End') go(SLIDES.length - 1, 0);
  else if (k === 'Escape') { if (menuOpen) setMenu(false); }
  else if (k.toLowerCase() === 'm') setMenu(!menuOpen);
  else if (k.toLowerCase() === 'n') toggleNotes();
  else if (k.toLowerCase() === 'f') {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  }
});

function frame(now) {
  const s = SLIDES[idx];
  STEP = step;
  U = reduce ? 1 : ez(cl((now - animFrom) / STEP_MS));
  SEC = now / 1000;
  x.setTransform(1, 0, 0, 1, 0, 0);
  x.globalAlpha = 1;
  x.setLineDash([]);
  x.lineCap = 'butt';
  x.lineJoin = 'miter';
  x.fillStyle = PAPER;
  x.fillRect(0, 0, W, H);
  x.save();
  s.draw();
  x.restore();
  x.globalAlpha = 1;
  x.setLineDash([]);
  T(s.title, 88, 86, 48, INK, 'left', 1, false, 500);
  const counter = `${idx + 1} / ${SLIDES.length}  ·  ${s.title}`;
  T(counter, 1832, 86, 28, MUTE, 'right');
  const cap = s.caps[step];
  caption(cap, s.capY || 940, Boolean(s.ask) && cap === s.ask);
  requestAnimationFrame(frame);
}

const hash = location.hash.replace('#', '');
const hm = hash.match(/^(\d+)(?:\.(\d+))?$/);
if (hm) go(+hm[1] - 1, hm[2] ? +hm[2] - 1 : 0);
else go(0, 0);
requestAnimationFrame(frame);

window.__deck = {
  slides: SLIDES,
  go,
  next,
  prev,
  toggleNotes,
  get idx() { return idx; },
  get step() { return step; },
  get notesOn() { return notesOn; }
};
