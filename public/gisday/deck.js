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
let NIGHT = false;
function caption(s, y, it = false) {
  if (!s) return;
  const size = 38, lines = wrap(s, size, 1560, it);
  const top = y - (lines.length - 1) * 50;
  const col = NIGHT ? '#f4efe4' : INK;
  lines.forEach((ln, i) => T(ln, 960, top + i * 50, size, col, 'center', 1, it));
}
function photo(src) {
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
  return img;
}
const PHOTO = {
  jupiter: photo('img/jupiter.jpg'),
  io: photo('img/io.jpg'),
  scilly: photo('img/scilly.jpg')
};
function diskPhoto(img, cx, cy, r, bleed = 1.14) {
  if (!img.complete || !img.naturalWidth) return false;
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const s = Math.max((r * 2) / iw, (r * 2) / ih) * bleed;
  x.save();
  x.beginPath();
  x.arc(cx, cy, r, 0, TAU);
  x.clip();
  x.drawImage(img, cx - iw * s / 2, cy - ih * s / 2, iw * s, ih * s);
  x.restore();
  return true;
}
function coverPhoto(img) {
  if (!img.complete || !img.naturalWidth) return false;
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const s = Math.max(W / iw, H / ih);
  const dw = iw * s, dh = ih * s;
  x.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);
  return true;
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
  if (o.stipple) {
    x.fillStyle = INK;
    for (let i = 0; i < 640; i++) {
      const ang = (i * 2.399963) % TAU;
      const rad = R * Math.sqrt((i * 0.754877) % 1);
      const z = Math.sqrt(Math.max(0, 1 - (rad / R) * (rad / R)));
      if (z > 0.52) continue;
      const a = (0.52 - z) / 0.52;
      x.globalAlpha = a * 0.85;
      x.fillRect(cx + rad * Math.cos(ang), cy + rad * Math.sin(ang), 2, 2);
    }
    x.globalAlpha = 1;
  }
  x.strokeStyle = INK;
  x.lineWidth = o.fine ? 1.15 : 1.6;
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
function parallel(pr, lat, lonA, lonB, p, col, w = 2.5) {
  const pts = [], n = 56;
  for (let i = 0; i <= n; i++) {
    const lo = lerp(lonA, lonB, i / n);
    const q = pr(lo, lat);
    if (q.z > 0.02) pts.push([q.x, q.y]);
    else if (pts.length) { poly(pts, p, col, w); pts.length = 0; }
  }
  if (pts.length) poly(pts, p, col, w);
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
  endMin: 0.25,
  notes: [
    'Title card. It draws once, about a second and a half, then holds. Say your name with the byline.',
    'GIS Day 2026. Jeff Franzen, Disaster GIS, American Red Cross. Do not say six stories.',
    'About 15 seconds, then the Havana vote. By 0:15.'
  ],
  caps: [''],
  capY: 980,
  draw() {
    const u = reduce ? 1 : ez(cl((performance.now() - animFrom) / 1500));
    T('Where Am I?', 160, 470, 108, INK, 'left', 1, false, 500);
    T('GIS Day 2026', 164, 550, 48, INK, 'left', Math.min(1, u * 1.4));
    T('Jeff Franzen  ·  Disaster GIS  ·  American Red Cross', 164, 620, 32, MUTE, 'left', Math.min(1, u * 1.2));
    const cx = 1360, cy = 540, R = 210;
    C(cx, cy, R, '#ffffff', INK, 2.5);
    L(cx - R, cy, cx + R, cy, HAIR, 1.5, null, Math.min(1, u * 1.5));
    const yTop = cy - R, yBot = cy + R;
    L(cx, yTop, cx, lerp(yTop, yBot, u), RED, 2.5);
    if (u > 0.7) star(cx, yTop - 6, 14 + 7 * Math.sin(cl((u - 0.7) / 0.3) * Math.PI), RED, 1);
  }
});

add({
  title: 'Where Am I?',
  endMin: 1.75,
  pause: '30 seconds',
  ask: 'Fly due south from Havana. Which South American country do you cross first?',
  notes: [
    'This first frame is only the question. Pause 30 seconds and take the vote. Most rooms say Peru. Do not mention a map.',
    'One click reveals the globe. D is correct. Havana is 82.4° west. Punta Pariñas is 81.3° west. The meridian runs down the open Pacific. All of South America lies east.',
    'By 1:45. The name was on the title card. Rome is next.'
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

function lettered(opts, correct, x0, y0, gap, reveal) {
  opts.forEach((name, i) => {
    const y = y0 + i * gap;
    const on = reveal && i === correct;
    T('ABCD'[i], x0, y, 40, on ? RED : INK, 'left', 1, false, 500);
    T(name, x0 + 64, y, 40, on ? RED : INK);
  });
}
function askLines(s, y, size = 42) {
  wrap(s, size, 1500).forEach((ln, i) => T(ln, 960, y + i * (size + 14), size, INK, 'center', 1, false, 500));
}

add({
  title: "Rome's Parallel",
  endMin: 2.75,
  pause: '25 seconds',
  ask: "Which of these American cities is closest to Rome's latitude?",
  notes: [
    'Question only. Pause about 25 seconds. The vote is usually New York or Atlanta. Do not show a map yet.',
    'Then click. C, Boston. Rome is 41.9° north. Boston is 42.4°. New York is 40.7°, Atlanta 33.7°, Miami 25.8°. Same parallel, very different climate. The Gulf Stream warms Italy.',
    'Keep it to about a minute. By 2:45. Reno is next.'
  ],
  caps: ['', 'Boston. Same parallel, very different climate: the Gulf Stream warms Italy.'],
  capY: 990,
  draw() {
    askLines("Which of these American cities is closest to Rome's latitude?", 220, 40);
    const reveal = STEP >= 1;
    lettered(['Atlanta', 'New York', 'Boston', 'Miami'], 2, reveal ? 120 : 700, reveal ? 400 : 430, 66, reveal);
    if (!reveal) return;
    const g = vis(1);
    x.save(); x.globalAlpha = g;
    const pr = globe(1100, 540, 280, -28, 38);
    x.restore();
    parallel(pr, 42, -90, 40, g, RED, 3);
    [[-71.06, 42.36, 'Boston  42.4° N', true], [12.5, 41.9, 'Rome  41.9° N', true], [-74.01, 40.71, 'New York  40.7°', false], [-84.39, 33.75, 'Atlanta  33.7°', false], [-80.19, 25.76, 'Miami  25.8°', false]].forEach(([lo, la, name, hot], i) => {
      const p = pr(lo, la);
      if (p.z > 0) C(p.x, p.y, 6, hot ? RED : INK);
      T(name, 1480, 400 + i * 42, 28, hot ? RED : INK, 'left', g);
    });
  }
});

add({
  title: 'Reno or Los Angeles',
  endMin: 3.75,
  pause: '25 seconds',
  ask: 'Reno or Los Angeles: which is farther west?',
  notes: [
    'Pause about 25 seconds. Many people say Los Angeles because it is on the coast.',
    'Then click. B. Reno is 119.8° west. Los Angeles is 118.2° west. Reno is farther west by 1.6°. The California coast bends east as it runs south.',
    'By 3:45. Then the grid: how you would name the place for a stranger.'
  ],
  caps: ['', 'Reno, by 1.6°. The California coast bends east as it runs south.'],
  capY: 980,
  draw() {
    askLines('Reno or Los Angeles: which is farther west?', 230, 42);
    const reveal = STEP >= 1;
    lettered(['Los Angeles', 'Reno', 'Same longitude', 'Depends on the map'], 1, reveal ? 140 : 640, reveal ? 400 : 420, 68, reveal);
    if (!reveal) return;
    const g = vis(1);
    x.save(); x.globalAlpha = g;
    const pr = globe(1180, 620, 340, -119, 36);
    x.restore();
    meridian(pr, -118.24, 50, 20, g, INK, 2.5);
    meridian(pr, -119.82, 52, 28, g, RED, 3.5);
    const reno = pr(-119.82, 39.53), la = pr(-118.24, 34.05);
    if (reno.z > 0) C(reno.x, reno.y, 6, RED);
    if (la.z > 0) C(la.x, la.y, 5, INK);
    T('Reno  119.8° W', 1560, 520, 32, RED, 'left', g);
    T('Los Angeles  118.2° W', 1560, 568, 28, INK, 'left', g);
  }
});

add({
  title: 'Call a Square',
  endMin: 5.25,
  state: { lat: false, lon: false, bingo: false },
  fade: { lat: 0, lon: 0, bingo: 0, t: 0 },
  notes: [
    'The warm-ups were places the room already knows. This is how you would tell a stranger. The globe is bare. Buttons at the top can show latitude, longitude, or the bingo card on their own. The clicks still tell the story in order.',
    'Latitude first. The lines run with the equator and never meet.',
    'Longitude next. These lines meet at the poles.',
    'One sentence: parallels stay apart, meridians come together. The row is the one the sky can give you. The column is the one it cannot. That contrast comes back later. Do not teach the method here.',
    'Bingo. Letters across, numbers down, one red square: G-4. About a minute and a half on this slide. By 5:15. A thousand paces is next.'
  ],
  caps: [
    'How would you tell a stranger exactly where to meet you?',
    'Latitude lines run with the equator. They never meet.',
    'Longitude lines meet at the poles.',
    'Parallels stay apart. Meridians come together.',
    'One square, one address. G-4.'
  ],
  capY: 1000,
  draw() {
    const now = performance.now();
    const dt = Math.min(0.05, this.fade.t ? (now - this.fade.t) / 1000 : 0.016);
    this.fade.t = now;
    const k = reduce ? 1 : 1 - Math.exp(-dt * 11);
    for (const key of ['lat', 'lon', 'bingo']) {
      const target = this.state[key] ? 1 : 0;
      this.fade[key] += (target - this.fade[key]) * k;
      if (Math.abs(this.fade[key] - target) < 0.012) this.fade[key] = target;
    }
    const latA = this.fade.lat, lonA = this.fade.lon, bingoA = this.fade.bingo;
    const call = STEP >= 3 ? 1 : 0;
    const cx = 700, cy = 545, R = 300;
    const pr = globe(cx, cy, R, -25, 18, { stipple: true, fine: true });
    const pole = pr(0, 90);
    if (lonA > 0.04 && pole.z > 0) {
      C(pole.x, pole.y, 5, INK);
      T('North Pole', pole.x, cy - R - 12, 28, INK, 'center', lonA);
    }
    for (const lat of [-60, -30, 0, 30, 60]) {
      const hot = call && lat === 30;
      parallel(pr, lat, -180, 180, latA, hot ? RED : (lat === 0 ? INK : HAIR), hot ? 3 : lat === 0 ? 1.8 : 1.2);
    }
    for (let lon = -180; lon < 180; lon += 30) {
      const hot = call && lon === -30;
      meridian(pr, lon, -80, 80, lonA, hot ? RED : HAIR, hot ? 3 : 1.2);
    }
    if (call && latA > 0.4) T('never meet', cx - R - 18, cy - 70, 32, RED, 'right', latA);
    if (call && lonA > 0.4) T('meet', cx - R - 18, cy - R + 78, 32, RED, 'right', lonA);
    if (bingoA > 0.01) {
      const letters = ['B', 'I', 'N', 'G', 'O'];
      const x0 = 1240, y0 = 250, cell = 86;
      letters.forEach((ch, i) => T(ch, x0 + i * cell + cell / 2, y0, 32, INK, 'center', bingoA, false, 500));
      for (let r = 1; r <= 5; r++) {
        const py = y0 + 18 + (r - 1) * cell;
        T(String(r), x0 - 24, py + 56, 28, MUTE, 'right', bingoA);
        for (let c = 0; c < 5; c++) {
          const px = x0 + c * cell;
          const red = letters[c] === 'G' && r === 4;
          x.save();
          x.globalAlpha = cl(bingoA);
          if (red) {
            x.fillStyle = 'rgba(176,31,36,.16)';
            x.fillRect(px + 4, py + 4, cell - 8, cell - 8);
          }
          x.strokeStyle = red ? RED : HAIR;
          x.lineWidth = red ? 3 : 1.5;
          x.strokeRect(px, py, cell, cell);
          x.restore();
          if (red) T('G-4', px + cell / 2, py + 54, 32, RED, 'center', bingoA, false, 500);
        }
      }
    }
  }
});

add({
  title: 'A Thousand Paces',
  endMin: 6.25,
  notes: [
    'A Roman mile is a thousand paces, and a pace is two steps, left foot back to left foot.',
    'Greek bematists, pronounced BEE-muh-tists, were paid to walk in even steps. Eratosthenes used their count.',
    'One minute here. The circle of the day is next. By 6:15.'
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

const SUN_ANG = 7.2 * D;
const TH_S = 0;
const TH_A = -SUN_ANG;

function earthAt(cam, th) {
  return { x: cam.cx + cam.R * Math.sin(th), y: cam.cy - cam.R * Math.cos(th) };
}
function outwardOf(th) {
  return { x: Math.sin(th), y: -Math.cos(th) };
}
function northOf(th) {
  return { x: -Math.cos(th), y: -Math.sin(th) };
}
function rayOnTangent(tip, dir, base, tangent) {
  const dx = base.x - tip.x, dy = base.y - tip.y;
  const det = dir.x * -tangent.y - (-tangent.x) * dir.y;
  const t = (dx * -tangent.y - (-tangent.x) * dy) / det;
  const u = (dir.x * dy - dir.y * dx) / det;
  return { x: base.x + tangent.x * u, y: base.y + tangent.y * u, t, u };
}
function mixCam(a, b, u) {
  const o = {};
  for (const k of Object.keys(a)) o[k] = lerp(a[k], b[k], u);
  return o;
}
function drawGroundArc(cam, alpha) {
  if (alpha <= 0.01) return;
  const samples = [];
  for (let a = -0.62; a <= 0.48; a += 0.012) samples.push([earthAt(cam, a).x, earthAt(cam, a).y]);
  x.save();
  x.globalAlpha = cl(alpha);
  x.beginPath();
  x.moveTo(samples[0][0], 1180);
  samples.forEach(p => x.lineTo(p[0], p[1]));
  x.lineTo(samples[samples.length - 1][0], 1180);
  x.closePath();
  x.fillStyle = LAND;
  x.fill();
  poly(samples, 1, INK, 3);
  x.restore();
}
function drawSyeneWell(px, py, theta, scale, alpha) {
  if (alpha <= 0.02 || scale < 0.45) return;
  x.save();
  x.translate(px, py);
  x.rotate(theta);
  x.scale(scale, scale);
  x.globalAlpha = cl(alpha);
  if (scale > 1.6) {
    L(-170, 0, -88, 0, INK, 3);
    L(88, 0, 170, 0, INK, 3);
  }
  x.fillStyle = PAPER;
  x.fillRect(-44, 4, 88, 154);
  L(-44, 0, -44, 168, INK, 5);
  L(44, 0, 44, 168, INK, 5);
  for (const yy of [46, 92, 136]) L(-44, yy, 44, yy, HAIR, 1.5);
  x.fillStyle = LAND;
  x.strokeStyle = INK;
  x.lineWidth = 3;
  x.beginPath();
  x.rect(-88, -28, 176, 34);
  x.fill();
  x.stroke();
  for (const bx of [-56, -24, 8, 40]) L(bx, -28, bx, 6, INK, 1.5);
  L(-88, -8, 88, -8, INK, 1.5);
  x.beginPath();
  const wob = i => Math.sin(i * 1.35 + SEC * 2.1) * 3.2;
  x.moveTo(-40, 164);
  for (let i = 0; i <= 16; i++) x.lineTo(-40 + i * (80 / 16), 150 + wob(i));
  x.lineTo(40, 172);
  x.lineTo(-40, 172);
  x.closePath();
  x.fillStyle = LAND;
  x.fill();
  x.beginPath();
  for (let i = 0; i <= 16; i++) {
    const wx = -40 + i * (80 / 16), wy = 150 + wob(i);
    i ? x.lineTo(wx, wy) : x.moveTo(wx, wy);
  }
  x.strokeStyle = INK;
  x.lineWidth = 2.5;
  x.stroke();
  x.strokeStyle = PAPER;
  x.lineWidth = 3.5;
  x.beginPath();
  x.moveTo(-16, 146);
  x.lineTo(-2, 141);
  x.moveTo(8, 154);
  x.lineTo(18, 150);
  x.stroke();
  L(0, -96, 0, 148, RED, 4);
  const m = 22;
  L(0, 148 - m, m, 148 - m, RED, 2.5);
  L(m, 148 - m, m, 148, RED, 2.5);
  x.restore();
}

const CAM_HERO = { cx: 960, cy: 12820, R: 12300, well: 2.35, stick: 520, show: 0, far: 0 };
const CAM_PAIR = { cx: 1180, cy: 3664, R: 3024, well: 1.42, stick: 520, show: 1, far: 0 };
const CAM_ZOOM = { cx: 760, cy: 548, R: 348, well: 0.2, stick: 36, show: 1, far: 1 };

add({
  title: 'One Circle, One Day',
  endMin: 7.75,
  pause: '30 seconds',
  ask: 'Thirty degrees is how many hours?',
  state: { west: 0, held: false },
  dragOnly: true,
  notes: [
    'The circle is 360 degrees and the day is 24 hours. One full turn. Fifteen degrees is one hour. Spin the disk if you want.',
    'Pause 30 seconds. Ask how many hours thirty degrees is. The answer is two. People say the two phrases interchangeably.',
    'One minute of latitude is one nautical mile. At the equator, four seconds of time is one nautical mile. By 7:45. The next slide says why the Sun’s day is the longer one.'
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
  endMin: 8.5,
  notes: [
    'Forty-five seconds, three clicks. Sidereal, sy-DEER-ee-ul, means by the stars. One turn against the stars is 23 hours 56 minutes. The precise length is 23 hours 56 minutes 4 seconds. Say 23 hours 56 minutes.',
    'The Earth also travels about one degree of its orbit in a day, 360 divided by 365, not a quarter turn. The drawing exaggerates that step. It is marked not to scale.',
    'One degree of spin is four minutes, because a day has 1,440 minutes and the circle has 360 degrees. The solar day is 24 hours. By 8:30.'
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
    T('seen from above the North Pole', 960, 148, 28, MUTE, 'center', 1);
    if (arcP > 0.2) {
      const mid = angA + sweep * 0.72 * arcP;
      const dir = sweep >= 0 ? 1 : -1;
      const tx = -Math.sin(mid) * dir, ty = Math.cos(mid) * dir;
      const px = sun[0] + orbitR * Math.cos(mid), py = sun[1] + orbitR * Math.sin(mid);
      const head = Math.atan2(ty, tx);
      L(px, py, px - Math.cos(head - 0.5) * 18, py - Math.sin(head - 0.5) * 18, INK, 2.5, null, arcP);
      L(px, py, px - Math.cos(head + 0.5) * 18, py - Math.sin(head + 0.5) * 18, INK, 2.5, null, arcP);
    }
    const place = STEP === 0 ? A : [lerp(A[0], B[0], STEP === 1 ? U : 1), lerp(A[1], B[1], STEP === 1 ? U : 1)];
    const spin = starAng + TAU * (1 - (STEP === 0 ? U : 1));
    const swing = STEP >= 2 ? extra * U : 0;
    const drawEarth = (c, ang, col, w, a, reach, spinArrow) => {
      if (a <= 0) return;
      x.save();
      x.globalAlpha = a;
      C(c[0], c[1], 64, '#ffffff', INK, 2.5);
      C(c[0], c[1], 5, INK);
      L(c[0], c[1], c[0] + Math.cos(ang) * 64, c[1] + Math.sin(ang) * 64, col, w);
      C(c[0] + Math.cos(ang) * 64, c[1] + Math.sin(ang) * 64, 7, col);
      L(c[0] + Math.cos(ang) * 74, c[1] + Math.sin(ang) * 74, c[0] + Math.cos(ang) * reach, c[1] + Math.sin(ang) * reach, col, 1.5, [7, 7]);
      if (spinArrow) {
        const a0 = -0.2, a1 = -1.7;
        arc(c[0], c[1], 86, a0, a1, INK, 2.5, true, 1);
        const tipx = c[0] + 86 * Math.cos(a1), tipy = c[1] + 86 * Math.sin(a1);
        const hd = Math.atan2(-Math.cos(a1), Math.sin(a1));
        L(tipx, tipy, tipx - Math.cos(hd - 0.5) * 16, tipy - Math.sin(hd - 0.5) * 16, INK, 2.5);
        L(tipx, tipy, tipx - Math.cos(hd + 0.5) * 16, tipy - Math.sin(hd + 0.5) * 16, INK, 2.5);
      }
      x.restore();
      T('N', c[0] + 14, c[1] - 6, 28, INK, 'left', a);
    };
    const reachStar = slen - 30;
    if (STEP >= 1) drawEarth(A, starAng, INK, 2, 0.45, reachStar, false);
    drawEarth(place, STEP >= 2 ? starAng : spin, INK, 3, 1, STEP === 0 ? reachStar : 250, true);
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
  title: 'Twelve Knuckles',
  endMin: 9.75,
  notes: [
    'Thumb counts three segments on each of four fingers: twelve. Five fingers on the other hand count the twelves: sixty.',
    'Show the counting if you like, and keep it short. The point is the number, not a history of Babylon.',
    'Sixty divides evenly by 2, 3, 4, 5, 6, 10, 12, 15, 20, and 30. By 9:45.'
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
  title: 'A Stick and a Shadow',
  endMin: 11.5,
  notes: [
    'About 240 BC. Say air-uh-TOSS-thuh-neez once. Syene is Aswan. This frame is the well: noon on the summer solstice, the Sun straight overhead. The red ray goes down the center and meets the water at a right angle.',
    'Alexandria is to the north. The same noon, a stick there casts a shadow. The shadow falls north, away from the Sun and away from Syene. The ray is the one through the tip of the stick. The angle is 7.2°.',
    'Pull back. The Syene ray and the Alexandria stick both run to the center of the Earth. The wedge there is the same 7.2°. By 11:30. The next slide does the arithmetic.'
  ],
  caps: [
    'At Syene, noon on the summer solstice, the Sun shines straight down a well.',
    'At Alexandria the shadow points north, away from Syene. The angle is 7.2°.',
    'Both lines meet at the center. The wedge is 7.2°.'
  ],
  capY: 1000,
  draw() {
    const cam = STEP === 0 ? CAM_HERO : STEP === 1 ? mixCam(CAM_HERO, CAM_PAIR, U) : mixCam(CAM_PAIR, CAM_ZOOM, U);
    const sun = { x: -Math.sin(TH_S), y: Math.cos(TH_S) };
    const syene = earthAt(cam, TH_S);
    const alex = earthAt(cam, TH_A);
    const out = outwardOf(TH_A);
    const tip = { x: alex.x + out.x * cam.stick, y: alex.y + out.y * cam.stick };
    const north = northOf(TH_A);
    const hit = rayOnTangent(tip, sun, alex, north);
    const up = { x: -sun.x, y: -sun.y };
    const angle = Math.acos(cl(out.x * up.x + out.y * up.y, -1, 1)) / D;
    this.geom = {
      ax: alex.x, ay: alex.y, sx: syene.x, sy: syene.y,
      shx: hit.x, shy: hit.y, tx: tip.x, ty: tip.y,
      angle, north: hit.u > 0 && hit.x < alex.x, well: cam.well > 0.45, far: cam.far
    };
    drawGroundArc(cam, 1 - cam.far);
    if (cam.far > 0.02) {
      x.save();
      x.globalAlpha = cl(cam.far);
      C(cam.cx, cam.cy, cam.R, '#ffffff', INK, 3);
      x.beginPath();
      x.moveTo(cam.cx, cam.cy);
      x.arc(cam.cx, cam.cy, cam.R, TH_A - Math.PI / 2, TH_S - Math.PI / 2, false);
      x.closePath();
      x.fillStyle = 'rgba(176,31,36,.16)';
      x.fill();
      L(syene.x, syene.y, cam.cx, cam.cy, RED, 4, null, 1);
      L(alex.x, alex.y, cam.cx, cam.cy, INK, 3.5, null, 1);
      arc(cam.cx, cam.cy, 118, TH_A - Math.PI / 2, TH_S - Math.PI / 2, RED, 4, false, 1);
      C(cam.cx, cam.cy, 7, INK);
      L(alex.x, Math.max(130, alex.y - 80), alex.x, alex.y + 48, HAIR, 2, [7, 8], 1);
      x.restore();
      T('7.2°', cam.cx + cam.R + 48, cam.cy + 8, 84, RED, 'left', cam.far, false, 500);
      T('center', cam.cx + 22, cam.cy + 36, 28, MUTE, 'left', cam.far);
      T('Alexandria', alex.x - 28, alex.y - 20, 32, INK, 'right', cam.far);
      T('Syene', syene.x + 36, syene.y - 8, 32, INK, 'left', cam.far);
    }
    const skyA = cam.show * (1 - cam.far);
    if (skyA > 0.02) {
      x.save();
      x.globalAlpha = cl(skyA);
      L(tip.x, 130, tip.x, tip.y, HAIR, 1.5, [8, 9], 1);
      const mid = (syene.x + tip.x) / 2;
      L(mid, 150, mid, 340, HAIR, 1.5, [8, 9], 1);
      L(syene.x, 348, syene.x, syene.y - cam.well * 28, HAIR, 1.5, [8, 9], 1);
      x.restore();
    }
    drawSyeneWell(syene.x, syene.y, TH_S, cam.well, 1 - cam.far * 0.85);
    T('Syene', syene.x + cam.well * 118, syene.y - cam.well * 42, 32, INK, 'left', 1 - cam.far);
    const labelA = 1 - cam.far;
    const lx = lerp(960, 1540, cam.show), ly = lerp(188, 250, cam.show);
    T('Noon, Summer Solstice:', lx, ly, 36, INK, 'center', labelA, false, 500);
    T('Sun Directly Overhead', lx, ly + 46, 36, INK, 'center', labelA, false, 500);
    if (cam.show > 0.02 && cam.far < 0.92) {
      const a = cam.show * (1 - cam.far);
      L(alex.x, alex.y, tip.x, tip.y, INK, 8, null, a);
      L(tip.x - sun.x * 240, tip.y - sun.y * 240, tip.x, tip.y, HAIR, 2, [8, 8], a);
      L(tip.x, tip.y, hit.x, hit.y, RED, 3.5, null, a);
      L(alex.x, alex.y, hit.x, hit.y, RED, 12, null, a);
      const bx = hit.x - north.x * 22, by = hit.y - north.y * 22;
      const px = -north.y, py = north.x;
      L(hit.x, hit.y, bx + px * 12, by + py * 12, RED, 3.5, null, a);
      L(hit.x, hit.y, bx - px * 12, by - py * 12, RED, 3.5, null, a);
      const aUp = Math.atan2(up.y, up.x), aOut = Math.atan2(out.y, out.x);
      let sweep = aOut - aUp;
      while (sweep > Math.PI) sweep -= TAU;
      while (sweep < -Math.PI) sweep += TAU;
      arc(tip.x, tip.y, 72, aUp, aUp + sweep, RED, 3.5, sweep < 0, a);
      T('7.2°', tip.x + 78, tip.y + 92, 48, RED, 'left', a, false, 500);
      T('north', hit.x - 30, hit.y - 26, 28, RED, 'right', a);
      T('Alexandria', alex.x + 24, alex.y + 54, 32, INK, 'left', a);
    }
  }
});

add({
  title: 'The Whole Earth',
  endMin: 13,
  notes: [
    '7.2 goes into 360 fifty times. 360 divided by 7.2 is 50. The walk from Alexandria to Syene is one slice of the Earth.',
    'Count the slices if you like. The red one is that walk. The other forty-nine are the rest of the way around.',
    'The bematists put the walk at about 5,000 stadia. Fifty times 5,000 is 250,000 stadia. He later wrote 252,000. Say 250,000.',
    'A stadion was not one fixed length, so the miles are uncertain, roughly 24,000 to 29,000, near 25,000. Today the equator is 24,901 miles, 40,075 kilometers. He was close. By 13:00.'
  ],
  caps: [
    '360 degrees divided by 7.2 degrees is 50.',
    'Fifty slices. The red slice is Alexandria to Syene.',
    '5,000 stadia times 50 is 250,000 stadia.',
    'About 25,000 miles. His stadion’s length is uncertain. Today it is 24,901 miles.'
  ],
  capY: 990,
  draw() {
    const cx = 520, cy = 545, R = 248;
    const start = -Math.PI / 2 - SUN_ANG;
    const grow = STEP > 1 ? 1 : STEP === 1 ? U : 0;
    C(cx, cy, R, '#ffffff', INK, 2.5);
    x.beginPath();
    x.moveTo(cx, cy);
    x.arc(cx, cy, R - 1, start, start + SUN_ANG, false);
    x.closePath();
    x.fillStyle = 'rgba(176,31,36,.18)';
    x.fill();
    for (let i = 0; i <= 50; i++) {
      const hot = i === 0 || i === 1;
      const show = hot ? 1 : cl(grow * 49 - (i - 2));
      if (show <= 0) continue;
      const a = start + i * SUN_ANG;
      L(cx, cy, cx + R * Math.cos(a), cy + R * Math.sin(a), hot ? RED : HAIR, hot ? 3.5 : 1.15, null, show);
    }
    const edge = a => ({ x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) });
    const left = edge(start), right = edge(start + SUN_ANG);
    L(left.x, left.y, 300, 236, HAIR, 1.5);
    L(right.x, right.y, 760, 236, HAIR, 1.5);
    T('Alexandria', 288, 230, 32, INK, 'right', 1);
    T('Syene', 772, 230, 32, INK, 'left', 1);
    const col = 1040;
    T('360°  ÷  7.2°', col, 300, 48, INK, 'left', 1, false, 500);
    T('=  50', col, 420, 120, RED, 'left', 1, false, 500);
    const stadia = vis(2);
    T('5,000 stadia  ×  50', col, 560, 36, INK, 'left', stadia);
    T('=  250,000 stadia', col, 628, 48, RED, 'left', stadia, false, 500);
    const miles = vis(3);
    T('≈  25,000 miles', col, 740, 52, RED, 'left', miles, false, 500);
    T('Today:  24,901 miles', col, 800, 32, INK, 'left', miles);
    T('40,075 km', col, 846, 32, MUTE, 'left', miles);
    T('His stadion’s length is uncertain.', col, 898, 28, MUTE, 'left', miles, true);
  }
});
add({
  title: 'The Easy Number',
  endMin: 14,
  state: { sep: 3, held: false },
  dragOnly: true,
  notes: [
    'Both ships read the star at the same height, so they share a latitude. Drag them apart. The star does not change.',
    'At 50° north, one degree of longitude is about 39 nautical miles. Nothing in the sky says who is east.',
    'Keep this to one minute. By 14:00. The row and the column from the bingo card: the sky gives you the row.'
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
  endMin: 15.5,
  pause: '30 seconds',
  ask: 'Hold one fist at arm’s length.',
  state: { lat: 10, held: false },
  dragOnly: true,
  notes: [
    'Pause 30 seconds. One fist at arm’s length is about 10 degrees. Four fists is about 40. Let the room do it.',
    'Then drag the figure north. The height of the pole star and the latitude are the same number.',
    'Polaris is close to the pole today. The next slide is how far off it used to be. By 15:30.'
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
  endMin: 17,
  notes: [
    'The axis wobbles once in about 26,000 years. Around 100 BC, Polaris was about 12° from the true pole. Hipparchus described an empty patch of sky.',
    'In 1492 the gap was about 3.5°, more than 200 nautical miles if you trust the raw height. Today it is about 0.63°. It comes closest around 2100, near 0.45°, then drifts. Vega is the rough north star in about 12,000 years, still several degrees off.',
    'By 17:00.'
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
  endMin: 18.5,
  notes: [
    'On land the plumb hangs still and you can wait. At sea the deck, the plumb, and the horizon all move.',
    'A long instrument needs a foundation and time. A ship has neither. Latitude was still possible. Longitude was not.',
    'By 18:30.'
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

function analogClock(cx, cy, R, hours, minutes) {
  C(cx, cy, R, '#ffffff', INK, 3);
  for (let h = 0; h < 12; h++) {
    const a = -Math.PI / 2 + h * TAU / 12;
    const inner = h % 3 === 0 ? R - 26 : R - 14;
    L(cx + inner * Math.cos(a), cy + inner * Math.sin(a), cx + (R - 2) * Math.cos(a), cy + (R - 2) * Math.sin(a), h % 3 === 0 ? INK : HAIR, h % 3 === 0 ? 3 : 1.6);
  }
  for (const h of [12, 3, 6, 9]) {
    const a = -Math.PI / 2 + (h % 12) * TAU / 12;
    T(String(h), cx + (R - 52) * Math.cos(a), cy + (R - 52) * Math.sin(a) + 12, 32, INK, 'center');
  }
  const hh = -Math.PI / 2 + ((hours % 12) / 12) * TAU + (minutes / 60) * (TAU / 12);
  const mh = -Math.PI / 2 + (minutes / 60) * TAU;
  L(cx, cy, cx + R * 0.52 * Math.cos(hh), cy + R * 0.52 * Math.sin(hh), INK, 8);
  L(cx, cy, cx + R * 0.76 * Math.cos(mh), cy + R * 0.76 * Math.sin(mh), INK, 4);
  C(cx, cy, 8, INK);
}
const GREENWICH = { x: 1360, y: 490, r: 210 };

add({
  title: 'Two Clocks',
  endMin: 20,
  state: { hours: 0, held: false },
  dragOnly: true,
  notes: [
    'The left clock is the ship. Local noon is the Sun overhead, both hands on 12.',
    'The right clock is Greenwich, the home port. Let the hands sweep to 4:00 in the afternoon. Drag that clock if you want another hour. Each hour is 15 degrees.',
    'Four hours times 15 degrees is 60 degrees west. Ahead of Greenwich would be east. By 20:00.'
  ],
  caps: [
    'Ship at sea: local noon. The Sun is overhead.',
    'Greenwich, the home port, reads 4:00 in the afternoon.',
    'Two clocks, two noons. The difference is your longitude.'
  ],
  capY: 1000,
  grab(p) {
    if (Math.hypot(p.x - GREENWICH.x, p.y - GREENWICH.y) < GREENWICH.r + 36) {
      this.state.held = true;
      this.move(p);
      return true;
    }
  },
  move(p) {
    const a = Math.atan2(p.y - GREENWICH.y, p.x - GREENWICH.x);
    let hours = (a - (-Math.PI / 2)) / (TAU / 12);
    hours = (hours % 12 + 12) % 12;
    this.state.hours = hours;
  },
  draw() {
    const target = STEP >= 1 ? 4 : 0;
    const from = STEP >= 2 ? 4 : 0;
    const hours = this.state.held ? this.state.hours : lerp(from, target, STEP === 0 ? 1 : U);
    if (!this.state.held) this.state.hours = hours;
    const sunY = 168;
    C(560, sunY, 36, '#fffdf6', INK, 2.5);
    for (let i = 0; i < 8; i++) {
      const a = i * TAU / 8;
      L(560 + 46 * Math.cos(a), sunY + 46 * Math.sin(a), 560 + 68 * Math.cos(a), sunY + 68 * Math.sin(a), INK, 2);
    }
    T('Sun overhead', 560, sunY + 96, 28, MUTE, 'center');
    analogClock(560, 520, 200, 12, 0);
    T('Ship at sea: local noon', 560, 780, 32, INK, 'center');
    analogClock(GREENWICH.x, GREENWICH.y, GREENWICH.r, hours, 0);
    T('Greenwich (home port) clock', GREENWICH.x, 760, 32, INK, 'center');
    if (STEP >= 1 || this.state.held) {
      T(`${trimNum(hours)} hours`, 960, 500, 48, RED, 'center', 1, false, 500);
    }
    if (STEP >= 2 || this.state.held) {
      const west = hours * 15;
      T(`${trimNum(hours)} h × 15° = ${trimNum(west)}° west`, 960, 860, 40, RED, 'center', 1, false, 500);
    }
  }
});

add({
  title: 'The Moon as a Clock',
  endMin: 21.25,
  notes: [
    'Against the stars, the Moon moves about its own width, half a degree, in an hour. Measure the angle to a known star and an almanac turns it into home time.',
    'That is a lunar distance. Parallax, refraction, and a heaving deck all sit on the same sight. It can be done, and it is easy to get wrong.',
    'By 21:15.'
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
  endMin: 22.25,
  notes: [
    'Recap only. On land the ground holds the instrument and you can wait for the sky. On water you get a rolling deck and no second try.',
    'Do not add a method here. The next slide is the one that works on land and fails at sea.',
    'By 22:15.'
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
  endMin: 24.25,
  pause: '45 seconds',
  ask: 'What will you see tomorrow night?',
  notes: [
    'January 1610. Galileo sees four moons and calls them the Medicean Stars. The names Io, Europa, Ganymede, and Callisto come later, from Marius.',
    'Pause 45 seconds. Ask what they will see tomorrow night. Then click. The moons have moved. Io goes around in about 42.5 hours, and an eclipse of Io is the same instant for everyone looking.',
    'Cassini’s tables used that clock to remap France from dry land. A long telescope on a rolling deck cannot hold the moons. By 24:15.',
    'Pictures: Jupiter, NASA / JPL / University of Arizona, Cassini, public domain. Io, NASA / JPL / University of Arizona, Galileo, public domain.'
  ],
  caps: [
    'In January 1610, Galileo sees four moons beside Jupiter.',
    'What will you see tomorrow night?',
    'The moons have moved. Io laps Jupiter in about 42.5 hours.',
    'When Io goes dark, everyone looking sees one instant.',
    'On land you can time it. On a rolling deck, the telescope cannot.'
  ],
  capY: 980,
  dark: true,
  credit: 'Jupiter: NASA / JPL / University of Arizona, Cassini. Io: NASA / JPL / University of Arizona, Galileo. Public domain.',
  moons: [
    { name: 'Io', r: 280, P: 1.769 },
    { name: 'Europa', r: 390, P: 3.551 },
    { name: 'Ganymede', r: 500, P: 7.155 },
    { name: 'Callisto', r: 620, P: 16.69 }
  ],
  draw() {
    const cream = '#f4efe4';
    for (let i = 0; i < 90; i++) {
      const px = (i * 137 + 40) % 1880 + 20;
      const py = (i * 89 + (i % 5) * 70) % 860 + 40;
      C(px, py, i % 6 === 0 ? 1.7 : 1.05, cream);
    }
    const days = [0.22, 0.22, 1.22, 0.55, 0.55];
    const prev = [0.22, 0.22, 0.22, 1.22, 0.55][STEP];
    const day = lerp(prev, days[STEP], U);
    const blur = STEP >= 4 ? Math.sin(SEC * 1.6) * 16 : 0;
    const cx = 960 + blur * 0.15, cy = 470;
    const R = 210;
    if (!diskPhoto(PHOTO.jupiter, cx, cy, R, 1.18)) C(cx, cy, R, '#c4a574', '#f4efe4', 2);
    const eclipse = STEP >= 3 ? (STEP === 3 ? U : 1) : 0;
    x.save();
    x.globalAlpha = 0.35 + 0.45 * eclipse;
    const g = x.createLinearGradient(cx + R * 0.2, cy, cx + R * 2.6, cy);
    g.addColorStop(0, 'rgba(3,6,16,0)');
    g.addColorStop(0.25, 'rgba(3,6,16,0.72)');
    g.addColorStop(1, 'rgba(3,6,16,0.2)');
    x.fillStyle = g;
    x.beginPath();
    x.moveTo(cx + R * 0.15, cy - 36);
    x.lineTo(cx + R * 2.7, cy - 150);
    x.lineTo(cx + R * 2.7, cy + 150);
    x.lineTo(cx + R * 0.15, cy + 36);
    x.closePath();
    x.fill();
    x.restore();
    T('Jupiter', cx, cy + R + 48, 32, cream, 'center', vis(0));
    const placed = [];
    const slot = { Europa: -1.15, Ganymede: -1.85, Callisto: 1.85, Io: 1.15 };
    this.moons.forEach(m => {
      const a = day / m.P * TAU;
      const my = cy + blur * 0.05;
      let mx = cx + slot[m.name] * (R + 90) + Math.sin(a) * 70 + (m.name === 'Io' ? blur : blur * 0.15);
      if (m.name === 'Io') {
        const into = cx + R + 36;
        mx = lerp(mx, into, eclipse);
        const dim = 1 - 0.72 * eclipse;
        x.save();
        x.globalAlpha = dim;
        if (!diskPhoto(PHOTO.io, mx, my, 32, 1.08)) C(mx, my, 16, '#e6c15a', cream, 2);
        x.restore();
        if (eclipse > 0.04) {
          x.save();
          x.globalAlpha = eclipse * 0.62;
          C(mx, my, 32, '#05070e');
          x.restore();
        }
        placed.push({ name: 'Io', x: mx, io: true, show: true });
      } else {
        C(mx, my, 7, cream);
        placed.push({ name: m.name, x: mx, io: false, show: true });
      }
    });
    if (eclipse > 0.45) T('Io, gone dark', cx, cy - R - 28, 44, RED, 'center', eclipse, false, 500);
    placed.filter(m => m.show).sort((a, b) => a.x - b.x).forEach((m, i, arr) => {
      const crowded = (i > 0 && m.x - arr[i - 1].x < 120) || (i < arr.length - 1 && arr[i + 1].x - m.x < 120);
      if (m.io || !crowded) T(m.name, m.x, m.io ? cy - 58 : cy + 28, 28, m.io ? '#f0d48a' : '#c9c3b6', 'center', vis(0));
    });
  }
});

add({
  title: 'The Isles of Scilly',
  endMin: 26,
  notes: [
    '22 October 1707. Admiral Sir Clowdesley Shovell, home from Gibraltar, in fog. Spell Clowdesley. The officers agreed they were in the mouth of the Channel.',
    'They were about 100 miles off that reckoning. Association, Eagle, Romney, and Firebrand struck. About two thousand men were lost. Some counts are nearer fourteen hundred.',
    'In 1714 the Longitude Act offers £20,000 to come within half a degree, £15,000 within two thirds, and £10,000 within one degree. Half a degree is two minutes of time. By 26:00. Harrison is next.',
    'Picture: public-domain engraving of Sir Cloudesley Shovell’s fleet lost on the rocks of Scilly, 22 October 1707.'
  ],
  caps: [
    '22 October 1707. Sir Clowdesley Shovell is bringing the fleet home, in fog.',
    'The officers agree they are safe in the mouth of the Channel.',
    'They are about 100 miles off. Four ships strike the rocks.',
    'In 1714, Parliament offers £20,000 to come within half a degree.'
  ],
  capY: 990,
  dark: true,
  credit: 'Public domain engraving of the 1707 wreck on the rocks of Scilly.',
  draw() {
    const cream = '#f4efe4';
    if (!coverPhoto(PHOTO.scilly)) {
      x.fillStyle = '#102033';
      x.fillRect(0, 0, W, H);
    }
    x.fillStyle = 'rgba(8, 18, 40, 0.42)';
    x.fillRect(0, 0, W, H);
    const glow = (px, py, r, a) => {
      const g = x.createRadialGradient(px, py, 2, px, py, r);
      g.addColorStop(0, `rgba(255, 196, 92, ${0.9 * a})`);
      g.addColorStop(0.35, `rgba(255, 150, 50, ${0.35 * a})`);
      g.addColorStop(1, 'rgba(255, 120, 30, 0)');
      x.fillStyle = g;
      x.beginPath();
      x.arc(px, py, r, 0, TAU);
      x.fill();
    };
    const lamps = vis(0);
    glow(430, 620, 70, lamps);
    glow(780, 700, 80, lamps);
    glow(1180, 430, 64, lamps);
    glow(1500, 520, 48, lamps);
    T('22 October 1707', 200, 180, 36, cream, 'left', vis(0), false, 500);
    T('where they reckoned', 1560, 340, 32, '#f4efe4', 'right', vis(1), true);
    const boom = vis(2);
    const mark = (px, py) => {
      L(px - 22, py - 22, px + 22, py + 22, RED, 7, null, boom);
      L(px + 22, py - 22, px - 22, py + 22, RED, 7, null, boom);
    };
    mark(150, 800);
    mark(1760, 820);
    T('the rocks', 190, 760, 32, RED, 'left', boom, false, 500);
    T('about 100 miles off', 960, 188, 40, RED, 'center', boom, false, 500);
    T('Association  ·  Eagle  ·  Romney  ·  Firebrand', 960, 236, 28, cream, 'center', boom);
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
let nightFrom = 0;
function go(i, st) {
  const prev = SLIDES[idx];
  idx = cl(i, 0, SLIDES.length - 1);
  const s = SLIDES[idx];
  if (s.dark && !(prev && prev.dark)) nightFrom = performance.now();
  step = cl(st == null ? 0 : st, 0, s.caps.length - 1);
  STEP = step;
  animFrom = performance.now();
  if (s.state) s.state.held = false;
  if (s.title === 'Call a Square') {
    s.state.lat = step >= 1;
    s.state.lon = step >= 2;
    s.state.bingo = step >= 4;
  }
  const url = `#${idx + 1}${step ? '.' + (step + 1) : ''}`;
  history.replaceState(null, '', url);
  renderNotes();
  if (menuOpen) syncMenu();
  syncLayers();
}
function syncLayers() {
  const s = SLIDES[idx];
  const layers = document.getElementById('layers');
  const on = s && s.title === 'Call a Square';
  layers.hidden = !on;
  if (!on) return;
  document.getElementById('tog-lat').classList.toggle('on', !!s.state.lat);
  document.getElementById('tog-lon').classList.toggle('on', !!s.state.lon);
  document.getElementById('tog-bingo').classList.toggle('on', !!s.state.bingo);
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
function bindLayer(id, key) {
  const el = document.getElementById(id);
  const stop = e => { e.stopPropagation(); e.preventDefault(); };
  el.addEventListener('pointerdown', stop);
  el.addEventListener('click', e => {
    stop(e);
    const s = SLIDES[idx];
    if (!s.state || s.title !== 'Call a Square') return;
    s.state[key] = !s.state[key];
  });
}
bindLayer('tog-lat', 'lat');
bindLayer('tog-lon', 'lon');
bindLayer('tog-bingo', 'bingo');
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
  const night = s.dark ? ez(cl((now - nightFrom) / 420)) : 0;
  NIGHT = !!s.dark;
  document.body.classList.toggle('night', NIGHT);
  x.fillStyle = PAPER;
  x.fillRect(0, 0, W, H);
  if (night > 0) {
    x.globalAlpha = night;
    x.fillStyle = '#070b14';
    x.fillRect(0, 0, W, H);
    x.globalAlpha = 1;
  }
  x.save();
  if (s.dark) x.globalAlpha = night;
  s.draw();
  x.restore();
  syncLayers();
  x.globalAlpha = 1;
  x.setLineDash([]);
  if (s.dark && night > 0.2) {
    x.fillStyle = 'rgba(6,10,18,0.5)';
    x.fillRect(0, 0, W, 118);
    x.fillRect(0, 900, W, 180);
  }
  if (s.credit) T(s.credit, 960, 868, 22, NIGHT ? '#d2cbbf' : MUTE, 'center');
  const titleCol = NIGHT ? '#f4efe4' : INK;
  const muteCol = NIGHT ? '#d2cbbf' : MUTE;
  T(s.title, 88, 86, 48, titleCol, 'left', 1, false, 500);
  const counter = `${idx + 1} / ${SLIDES.length}  ·  ${s.title}`;
  T(counter, 1832, 86, 28, muteCol, 'right');
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
