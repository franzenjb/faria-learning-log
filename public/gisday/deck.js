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
const REVEAL_MS = reduce ? 1 : 1500;
const CINE_MS = reduce ? 1 : 7200;
let DPR = 1;

function fit() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  const bw = Math.round(W * DPR), bh = Math.round(H * DPR);
  if (c.width !== bw || c.height !== bh) { c.width = bw; c.height = bh; }
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
function caption(s, y, it = false, box) {
  if (!s) return;
  const size = box && box.size ? box.size : (it ? 56 : 42);
  const maxW = box ? box.w : 1700;
  const lines = wrap(s, size, maxW, it);
  const x0 = box ? box.x : 960;
  const align = box ? (box.align || 'left') : 'center';
  const lineH = size + 16;
  const top = (box ? box.y : y) - (lines.length - 1) * lineH;
  const col = NIGHT ? '#f4efe4' : INK;
  lines.forEach((ln, i) => T(ln, x0, top + i * lineH, size, col, align, 1, it, it ? 400 : 500));
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
function coverPhoto(img, zoom = 1, ox = 0, oy = 0) {
  if (!img.complete || !img.naturalWidth) return false;
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const s = Math.max(W / iw, H / ih) * zoom;
  const dw = iw * s, dh = ih * s;
  x.drawImage(img, (W - dw) / 2 + ox, (H - dh) / 2 + oy, dw, dh);
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
function revealEase() {
  return reduce ? 1 : ez(cl((performance.now() - animFrom) / REVEAL_MS));
}
function shotU(ms = CINE_MS) {
  return reduce ? 1 : cl((performance.now() - animFrom) / ms);
}
function span(u, a, b) {
  return reduce ? 1 : ez(cl((u - a) / Math.max(0.001, b - a)));
}
function fmtLat(lat) {
  const a = Math.abs(lat);
  if (a < 0.45) return '0°';
  return Math.round(a) + '° ' + (lat > 0 ? 'N' : 'S');
}
const carry = { cx: 960, cy: 460, R: 300, lon0: -50, lat0: 16 };
function park(cam) { Object.assign(carry, cam); }
let HITS = [];
function hit(px, py, r, fn) { HITS.push({ x: px, y: py, r, fn }); }
function grain(ox, oy, a) {
  if (a <= 0) return;
  x.save();
  x.globalAlpha = a;
  x.fillStyle = INK;
  for (let i = 0; i < 70; i++) x.fillRect((i * 197 + ox) % W, (i * 131 + oy) % H, 1.5, 1.5);
  x.restore();
}
function spinOf(s) { return (s && s.state && s.state.spin) || 0; }

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
  key: 'cover',
  title: 'Where Am I?',
  endMin: 0.25,
  notes: [
    'Title card. It draws once, about a second and a half, then holds. Say your name with the byline.',
    'GIS Day 2026. Jeff Franzen, Disaster GIS, American Red Cross.',
    'About 15 seconds. Then the wreck, not the quiz. By 0:15.'
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
    const px = cx, py = yTop - 6;
    const turn = reduce ? 0.6 : (SEC % 36) / 36;
    if (u > 0.55) {
      const a = cl((u - 0.55) / 0.45);
      for (let i = 0; i < 16; i++) {
        const rad = 22 + (i % 5) * 18;
        const a0 = -Math.PI / 2 + i * 0.55 + turn * TAU;
        const sweep = (0.5 + (i % 4) * 0.28) * a;
        x.beginPath();
        x.arc(px, py, rad, a0, a0 + sweep, false);
        x.strokeStyle = i % 3 === 0 ? RED : INK;
        x.globalAlpha = 0.35 * a;
        x.lineWidth = i % 3 === 0 ? 2 : 1.2;
        x.stroke();
        x.globalAlpha = 1;
        const tip = a0 + sweep;
        C(px + rad * Math.cos(tip), py + rad * Math.sin(tip), i % 3 === 0 ? 2.4 : 1.6, i % 3 === 0 ? RED : INK);
      }
      star(px, py, 14 + 5 * Math.sin(cl((u - 0.7) / 0.3) * Math.PI), RED, 1);
    }
  }
});

add({
  key: 'havana',
  title: 'Where Am I?',
  endMin: 3.5,
  pause: '30 seconds',
  ask: 'Fly due south from Havana. Which South American country do you cross first?',
  notes: [
    'This first frame is only the question. Pause 30 seconds and take the vote. Most rooms say Peru. Do not mention a map.',
    'One click reveals the globe. D is correct. Havana is 82.4° west. Punta Pariñas is 81.3° west. The meridian runs down the open Pacific. All of South America lies east.',
    'By 3:00. Take the vote out loud. The globe stays quiet until you reveal. Rome is next: same instinct, a parallel this time.'
  ],
  caps: ['', 'None. Open Pacific.'],
  capY: 820,
  capAt: 0.84,
  cine: 7200,
  spin: true,
  state: { spin: 0, fly: null },
  capBox: { x: 960, y: 800, w: 1200, align: 'center', size: 48 },
  draw() {
    const q = 'Fly due south from Havana. Which South American country do you cross first?';
    const opts = ['Colombia', 'Ecuador', 'Peru', 'None of them'];
    const reveal = STEP >= 1;
    if (!reveal) {
      wrap(q, 76, 1680).forEach((ln, i) => T(ln, 960, 250 + i * 92, 76, INK, 'center', 1, false, 500));
      opts.forEach((name, i) => {
        const y = 520 + i * 110;
        T('ABCD'[i], 700, y, 68, INK, 'left', 1, false, 500);
        T(name, 790, y, 68, INK);
      });
      return;
    }
    const u = shotU(7200);
    const fadeQ = 1 - span(u, 0, 0.14);
    if (fadeQ > 0.02) {
      wrap(q, 76, 1680).forEach((ln, i) => T(ln, 960, 250 + i * 92, 76, INK, 'center', fadeQ, false, 500));
      opts.forEach((name, i) => {
        const y = 520 + i * 110;
        T('ABCD'[i], 700, y, 68, INK, 'left', fadeQ, false, 500);
        T(name, 790, y, 68, INK, 'left', fadeQ);
      });
    }
    const fly = span(u, 0.08, 0.36);
    const drop = span(u, 0.32, 0.86);
    const latTip = lerp(23.13, -38, drop);
    const scripted = lerp(-48, -82.4, fly);
    if (this.state.fly != null) this.state.spin = lerp(this.state.spin || 0, this.state.fly - scripted, 0.1);
    const cam = {
      cx: 960, cy: lerp(520, 450, fly),
      R: lerp(240, 500, Math.max(span(u, 0, 0.22), fly)),
      lon0: scripted + spinOf(this),
      lat0: lerp(16, lerp(20, latTip * 0.45, drop), fly)
    };
    park(cam);
    grain(fly * 40, drop * 24, 0.18);
    const pr = globe(cam.cx, cam.cy, cam.R, cam.lon0, cam.lat0);
    const hv = pr(-82.38, 23.13);
    if (fly > 0.35 && hv.z > 0) {
      const pulse = 8 + 5 * Math.sin(SEC * 5);
      C(hv.x, hv.y, pulse, RED);
      hit(hv.x, hv.y, 46, () => { this.state.fly = -82.38; });
    }
    if (drop > 0.01) {
      meridian(pr, -82.38, 23.13, latTip, 1, RED, 4);
      const tip = pr(-82.38, latTip);
      if (tip.z > 0) {
        const g = x.createRadialGradient(tip.x, tip.y, 1, tip.x, tip.y, 42);
        g.addColorStop(0, 'rgba(176,31,36,.85)');
        g.addColorStop(1, 'rgba(176,31,36,0)');
        x.fillStyle = g;
        x.beginPath();
        x.arc(tip.x, tip.y, 42, 0, TAU);
        x.fill();
        C(tip.x, tip.y, 6, RED);
      }
      const read = 1 - span(u, 0.8, 0.9);
      if (read > 0.02) T(fmtLat(latTip) + '   ·   82.4° W', 960, 150, 48, RED, 'center', read, false, 500);
    }
    if (latTip < -1) {
      const a = cl(((-1 - latTip) / 8));
      const west = pr(-82.38, -4.68), east = pr(-81.33, -4.68);
      if (west.z > 0 && east.z > 0) {
        L(west.x, west.y - 16, west.x, west.y + 16, RED, 3, null, a);
        L(east.x, east.y - 16, east.x, east.y + 16, INK, 3, null, a);
        L(west.x, west.y, east.x, east.y, INK, 2, null, a);
        C(east.x, east.y, 5, INK);
      }
    }
  }
});

function quizLines(text, x0, y, size, width, align) {
  wrap(text, size, width).forEach((ln, i) => T(ln, x0, y + i * (size + 14), size, INK, align, 1, false, 500));
}
function quizOpts(opts, correct, x0, y0, gap, size, reveal) {
  opts.forEach((name, i) => {
    const y = y0 + i * gap;
    const on = reveal && i === correct;
    T('ABCD'[i], x0, y, size, on ? RED : INK, 'left', 1, false, 500);
    T(name, x0 + size * 1.2, y, size, on ? RED : INK);
  });
}
function coastIn(pr) {
  x.save();
  x.strokeStyle = INK;
  x.lineWidth = 3.5;
  x.lineJoin = 'round';
  x.lineCap = 'round';
  x.beginPath();
  for (const ln of COAST.lines) {
    let pen = false;
    for (let i = 0; i < ln.length; i += 2) {
      const q = pr(ln[i] / COAST.q, ln[i + 1] / COAST.q);
      if (q.z > 0) { pen ? x.lineTo(q.x, q.y) : x.moveTo(q.x, q.y); pen = true; }
      else pen = false;
    }
  }
  x.stroke();
  x.restore();
}

add({
  title: "Rome's Parallel",
  endMin: 3.25,
  pause: '25 seconds',
  ask: "Which of these American cities is closest to Rome's latitude?",
  notes: [
    'Question only. Pause about 25 seconds. The vote is usually New York or Atlanta. Do not show a map yet.',
    'Then click. C, Boston. Rome is 41.9° north. Boston is 42.4°. New York is 40.7°, Atlanta 33.7°, Miami 25.8°. Same parallel, very different climate. The Gulf Stream warms Italy.',
    'About a minute, with the zoom. By 4:00. Reno is next, and the coast will fool them.'
  ],
  caps: ['', 'Boston. Same parallel.'],
  capY: 820,
  capAt: 0.72,
  cine: 6400,
  spin: true,
  state: { spin: 0, fly: null },
  capBox: { x: 960, y: 800, w: 1400, align: 'center', size: 48 },
  draw() {
    const q = "Which of these American cities is closest to Rome's latitude?";
    const opts = ['Atlanta', 'New York', 'Boston', 'Miami'];
    const reveal = STEP >= 1;
    if (!reveal) {
      quizLines(q, 960, 240, 72, 1600, 'center');
      quizOpts(opts, 2, 740, 480, 110, 68, false);
      return;
    }
    const u = shotU(6400);
    const fly = span(u, 0, 0.42);
    const race = span(u, 0.38, 0.82);
    const scripted = lerp(carry.lon0, -30, fly);
    if (this.state.fly != null) this.state.spin = lerp(this.state.spin || 0, this.state.fly - scripted, 0.1);
    const cam = {
      cx: lerp(carry.cx, 980, fly),
      cy: lerp(carry.cy, 460, fly),
      R: lerp(carry.R, 490, fly),
      lon0: scripted + spinOf(this),
      lat0: lerp(carry.lat0, 40, fly)
    };
    park({ cx: cam.cx, cy: cam.cy, R: cam.R, lon0: cam.lon0 - spinOf(this), lat0: cam.lat0 });
    const pr = globe(cam.cx, cam.cy, cam.R, cam.lon0, cam.lat0);
    const endLon = lerp(-71.06, 12.5, race);
    parallel(pr, 42, -71.06, endLon, 1, RED, 5);
    const ribbon = [];
    for (let i = 0; i <= 28; i++) {
      const t = i / 28;
      const lon = lerp(-74, -12, t);
      const lat = 28 + Math.sin(t * Math.PI) * 5 + Math.sin(SEC * 1.3 + t * 6) * 0.5;
      const p = pr(lon, lat);
      if (p.z > 0.02) ribbon.push([p.x, p.y]);
      else if (ribbon.length) { poly(ribbon, race, RED, 2.5); ribbon.length = 0; }
    }
    if (ribbon.length) poly(ribbon, race, RED, 2.5);
    const cities = [
      [-71.06, 42.36, 0.05],
      [-74.01, 40.71, 0.2],
      [-84.39, 33.75, 0.28],
      [-80.19, 25.76, 0.36],
      [12.5, 41.9, 0.78]
    ];
    cities.forEach(([lo, la, at]) => {
      const a = cl((race - at) / 0.12);
      if (a <= 0) return;
      const p = pr(lo, la);
      if (p.z <= 0.02) return;
      const hot = lo > 0 || lo < -70.5 && lo > -72;
      C(p.x, p.y, hot ? 9 : 5, hot ? RED : INK);
      hit(p.x, p.y, 36, () => { this.state.fly = lo; });
      if (lo > 0 && a > 0.6) {
        const glow = 0.35 + 0.25 * Math.sin(SEC * 4);
        C(p.x, p.y, 22, null);
        x.save();
        x.globalAlpha = glow;
        C(p.x, p.y, 18, RED);
        x.restore();
      }
    });
  }
});

add({
  title: 'Reno or Los Angeles',
  endMin: 4.5,
  pause: '25 seconds',
  ask: 'Reno or Los Angeles: which is farther west?',
  notes: [
    'Pause about 25 seconds. Many people say Los Angeles because it is on the coast.',
    'Then click. B. Reno is 119.8° west. Los Angeles is 118.2° west. Reno is farther west by 1.6°. The California coast bends east as it runs south.',
    'By 5:00. The close view is California and Nevada, and the coast bends east as it runs south. Then how you would tell a stranger: the grid.'
  ],
  caps: ['', 'Reno, by 1.6°.'],
  capY: 820,
  capAt: 0.78,
  cine: 7000,
  spin: true,
  state: { spin: 0, fly: null },
  capBox: { x: 960, y: 800, w: 1200, align: 'center', size: 48 },
  draw() {
    const q = 'Reno or Los Angeles: which is farther west?';
    const opts = ['Los Angeles', 'Reno', 'Same longitude', 'Depends on the map'];
    const reveal = STEP >= 1;
    if (!reveal) {
      quizLines(q, 960, 230, 76, 1600, 'center');
      quizOpts(opts, 1, 620, 460, 108, 64, false);
      return;
    }
    const u = shotU(7000);
    const dive = span(u, 0, 0.42);
    const fall = span(u, 0.36, 0.72);
    const tilt = span(u, 0.4, 0.78);
    const gap = span(u, 0.72, 0.95);
    const scripted = lerp(carry.lon0 || -100, -119, dive);
    if (this.state.fly != null) this.state.spin = lerp(this.state.spin || 0, this.state.fly - scripted, 0.1);
    const cam = {
      cx: lerp(1040, 1180, dive), cy: lerp(480, 500, dive),
      R: lerp(Math.max(carry.R || 320, 280), 560, dive),
      lon0: scripted + spinOf(this),
      lat0: lerp(carry.lat0 || 30, 37, dive)
    };
    x.save();
    x.globalAlpha = 1 - span(u, 0.28, 0.48);
    globe(cam.cx, cam.cy, cam.R, cam.lon0, cam.lat0);
    x.restore();
    const mapA = span(u, 0.3, 0.5);
    if (mapA > 0) {
      const x0 = 560, y0 = 120, w = 980, h = 700;
      const lonW = -124, lonE = -114, latN = 42, latS = 32;
      const pr = (lon, lat) => ({
        x: x0 + (lon - lonW) / (lonE - lonW) * w,
        y: y0 + (latN - lat) / (latN - latS) * h,
        z: 1
      });
      x.save();
      x.globalAlpha = mapA;
      x.translate(x0 + w / 2, y0 + h / 2);
      x.rotate(lerp(-0.22, 0, tilt));
      x.translate(-(x0 + w / 2), -(y0 + h / 2));
      x.beginPath();
      x.rect(x0, y0, w, h);
      x.clip();
      coastIn(pr);
      const lineP = fall;
      const renoTop = pr(-119.82, 42), renoY = pr(-119.82, lerp(42, 32, lineP));
      L(renoTop.x, renoTop.y, renoY.x, renoY.y, RED, 4);
      const laTop = pr(-118.24, 42), laY = pr(-118.24, lerp(42, 32, Math.max(0, lineP - 0.08)));
      L(laTop.x, laTop.y, laY.x, laY.y, INK, 3.5);
      const rp = pr(-119.82, 39.53), lp = pr(-118.24, 34.05);
      if (lineP > 0.45) C(rp.x, rp.y, 9, RED);
      if (lineP > 0.55) C(lp.x, lp.y, 8, INK);
      if (gap > 0) {
        const a = pr(-119.82, 37.2), b = pr(-118.24, 37.2);
        L(a.x, a.y - 18, a.x, a.y + 18, RED, 3, null, gap);
        L(b.x, b.y - 18, b.x, b.y + 18, INK, 3, null, gap);
        L(a.x, a.y, b.x, b.y, RED, 3, null, gap);
      }
      x.restore();
    }
  }
});

add({
  title: 'Call a Square',
  endMin: 6.25,
  capBox: { x: 36, y: 760, w: 560, align: 'left', size: 40 },
  spin: true,
  state: { lat: false, lon: false, bingo: false, spin: 0, called: '' },
  fade: { lat: 0, lon: 0, bingo: 0, t: 0 },
  notes: [
    'The warm-ups were places the room already knows. This is how you would tell a stranger. The globe is bare. The small buttons on the right show latitude, longitude, or the bingo letters on the globe itself. The clicks still tell the story in order.',
    'Latitude first. The lines run with the equator and never meet.',
    'Longitude next. These lines meet at the poles.',
    'One sentence: parallels stay apart, meridians come together. The row is the one the sky can give you. The column is the one it cannot. That contrast comes back later. Do not teach the method here.',
    'Bingo. The letters and numbers sit on the globe’s own lines. G-4 is the red cell. By 6:15. Bridge: someone in power decided how long a step on that grid is. The mile is next.'
  ],
  caps: [
    'Where do you meet?',
    'They never meet.',
    'They meet at the poles.',
    'The sky gives the row.',
    'G-4.'
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
    const showLat = Math.max(latA, bingoA);
    const showLon = Math.max(lonA, bingoA);
    const call = STEP >= 3 ? 1 : 0;
    const lons = [-60, -48, -36, -24, -12, 0];
    const lats = [54, 42, 30, 18, 6, -6];
    const cx = lerp(1100, 1040, bingoA), cy = 490;
    const R = lerp(400, 455, bingoA);
    const pr = globe(cx, cy, R, lerp(-32, -18, bingoA) + spinOf(this), lerp(24, 16, bingoA), { stipple: true, fine: true });
    if (bingoA > 0.03) {
      const n = 12, pts = [];
      const push = (lo, la) => { const p = pr(lo, la); if (p.z > 0.02) pts.push(p); };
      for (let i = 0; i <= n; i++) push(lerp(-24, -12, i / n), 18);
      for (let i = 1; i <= n; i++) push(-12, lerp(18, 6, i / n));
      for (let i = 1; i <= n; i++) push(lerp(-12, -24, i / n), 6);
      for (let i = 1; i < n; i++) push(-24, lerp(6, 18, i / n));
      if (pts.length > 3) {
        x.save();
        x.beginPath();
        pts.forEach((p, i) => i ? x.lineTo(p.x, p.y) : x.moveTo(p.x, p.y));
        x.closePath();
        x.globalAlpha = 0.34 * bingoA;
        x.fillStyle = RED;
        x.fill();
        x.globalAlpha = bingoA;
        x.strokeStyle = RED;
        x.lineWidth = 3;
        x.stroke();
        x.restore();
        const mid = pr(-18, 12);
        if (mid.z > 0 && !this.state.called) T('G-4', mid.x, mid.y + 10, 32, RED, 'center', bingoA, false, 500);
      }
    }
    if (bingoA > 0.45) {
      for (let col = 0; col < 5; col++) {
        for (let row = 0; row < 5; row++) {
          const name = 'BINGO'[col] + '-' + (row + 1);
          const mid = pr((lons[col] + lons[col + 1]) / 2, (lats[row] + lats[row + 1]) / 2);
          if (mid.z > 0.08) hit(mid.x, mid.y, 34, () => { this.state.called = name; });
          if (this.state.called === name && mid.z > 0) {
            C(mid.x, mid.y, 16, RED);
          }
        }
      }
    }
    if (this.state.called) T(this.state.called, 180, 180, 64, RED, 'left', 1, false, 500);
    if (showLat > 0.02) lats.forEach(lat => parallel(pr, lat, -66, 6, showLat, call && lat === 30 ? RED : HAIR, call && lat === 30 ? 3 : 1.7));
    if (showLon > 0.02) lons.forEach(lon => meridian(pr, lon, 58, -10, showLon, call && lon === -24 ? RED : HAIR, call && lon === -24 ? 3 : 1.7));
    if (bingoA > 0.25) {
      ['B', 'I', 'N', 'G', 'O'].forEach((ch, i) => {
        const p = pr((lons[i] + lons[i + 1]) / 2, 60);
        if (p.z > 0.05) T(ch, p.x, p.y, 32, ch === 'G' ? RED : INK, 'center', bingoA, false, 500);
      });
      for (let r = 0; r < 5; r++) {
        const p = pr(-68, (lats[r] + lats[r + 1]) / 2);
        if (p.z > 0.05) T(String(r + 1), p.x, p.y + 8, 28, r === 3 ? RED : MUTE, 'center', bingoA);
      }
    }
    const pole = pr(-18, 70);
    if (pole.z > 0) C(pole.x, pole.y, call ? 6 : 0, RED);
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
  endMin: 8.5,
  pause: '30 seconds',
  ask: 'When will the Sun be overhead here again?',
  capBox: { x: 960, y: 800, w: 1500, align: 'center', size: 40 },
  notes: [
    'Question first. A person at Greenwich, noon, the Sun overhead. Pause about 30 seconds. When will the Sun be overhead here again?',
    '24 hours, after one full turn. Let the hand go all the way around. Seen from above the North Pole.',
    'That turn is a circle. 360 degrees. Watch the rim draw.',
    'Slice the day into 24. Ask how many degrees are in one slice. Do not say 15 until the next click.',
    '360 divided by 24 is 15. The Earth turns 15 degrees every hour.',
    'A ship two slices west. Two hours is 30 degrees. The Sun is overhead there two hours after Greenwich.',
    'If you know the time difference, you know the longitude. By 15:45. A likely reason the circle has 360 parts is next, about a minute. Then the lieutenant and the two clocks. The star day stays in the appendix.'
  ],
  caps: [
    'Greenwich, noon. When will the Sun be overhead here again?',
    '24 hours, after one full turn.',
    'A full turn is a circle. 360 degrees.',
    'How many degrees in one slice?',
    '360 ÷ 24 = 15°. The Earth turns 15° every hour.',
    'Two slices west. 2 hours = 30°.',
    'If you know the time difference, you know your longitude.'
  ],
  capY: 800,
  draw() {
    const cx = 980, cy = 470, R = 248;
    const u = revealEase();
    const gwich = -Math.PI / 2;
    const slice = TAU / 24;
    const east = -1;
    const drawSunAt = (sx, sy, a) => {
      x.save();
      x.globalAlpha = cl(a);
      C(sx, sy, 22, '#fffdf6', INK, 2.5);
      for (let i = 0; i < 8; i++) {
        const t = i * TAU / 8;
        L(sx + 30 * Math.cos(t), sy + 30 * Math.sin(t), sx + 46 * Math.cos(t), sy + 46 * Math.sin(t), INK, 2);
      }
      x.restore();
    };
    const drawSun = (ang, a) => drawSunAt(cx + (R + 96) * Math.cos(ang), cy + (R + 96) * Math.sin(ang), a);
    const disk = STEP >= 2 ? (STEP === 2 ? u : 1) : (STEP === 1 ? 0.35 : 0);
    if (disk > 0) {
      x.save();
      x.globalAlpha = Math.max(disk, STEP >= 2 ? 1 : 0.35);
      C(cx, cy, R, '#ffffff', INK, 2.5);
      x.restore();
      if (STEP >= 2) {
        x.beginPath();
        x.arc(cx, cy, R - 1, gwich, gwich + (STEP === 2 ? u : 1) * TAU, false);
        x.strokeStyle = INK;
        x.lineWidth = 3;
        x.stroke();
      }
      C(cx, cy, 6, INK);
      T('N', cx + 14, cy + 6, 28, MUTE, 'left');
    }
    if (STEP === 1) {
      const sweep = gwich + east * u * TAU;
      L(cx, cy, cx + R * Math.cos(sweep), cy + R * Math.sin(sweep), RED, 4);
      arc(cx, cy, R * 0.72, gwich, sweep, RED, 3, east < 0, 1);
      T('24 hours', 1360, 460, 64, RED, 'left', cl((u - 0.4) / 0.3), false, 500);
    }
    if (STEP >= 2 && STEP < 5) {
      const n = STEP === 3 ? Math.round(u * 24) : (STEP > 3 ? 24 : 0);
      for (let i = 0; i < n; i++) {
        const a0 = gwich + east * i * slice;
        const a1 = gwich + east * (i + 1) * slice;
        x.beginPath();
        x.moveTo(cx, cy);
        x.arc(cx, cy, R - 2, a0, a1, east < 0);
        x.closePath();
        x.fillStyle = i === 0 ? 'rgba(176,31,36,.22)' : 'rgba(22,21,20,.03)';
        x.fill();
        x.strokeStyle = i === 0 ? RED : HAIR;
        x.lineWidth = i === 0 ? 3 : 1.2;
        x.stroke();
      }
    }
    if (STEP >= 4 && STEP < 5) {
      T('360° ÷ 24', 1360, 400, 40, INK, 'left', 1, false, 500);
      T('= 15°', 1360, 470, 72, RED, 'left', 1, false, 500);
      T('each hour', 1360, 530, 32, MUTE, 'left');
    }
    if (STEP === 2) T('360°', 1360, 460, 88, RED, 'left', u, false, 500);
    if (STEP >= 5) {
      for (let i = 0; i < 2; i++) {
        const a0 = gwich + i * slice;
        const a1 = gwich + (i + 1) * slice;
        x.beginPath();
        x.moveTo(cx, cy);
        x.arc(cx, cy, R - 2, a0, a1, false);
        x.closePath();
        x.fillStyle = 'rgba(176,31,36,.24)';
        x.fill();
        x.strokeStyle = RED;
        x.lineWidth = 3;
        x.stroke();
      }
      const shipA = gwich + 2 * slice;
      const sp = [cx + (R + 64) * Math.cos(shipA), cy + (R + 64) * Math.sin(shipA)];
      ship(sp[0], sp[1], 1.35, INK, shipA + Math.PI / 2, 1);
      T('2 hours = 30°', 1360, 460, 48, RED, 'left', 1, false, 500);
      drawSun(STEP === 5 ? lerp(gwich, shipA, u) : shipA, 1);
    } else if (STEP === 0) {
      person(900, 460, 2.6, 0, INK, 1);
      drawSunAt(900, 270, 1);
      T('Greenwich', 1040, 420, 48, INK, 'left');
      T('noon', 1040, 480, 42, MUTE, 'left');
    } else drawSun(gwich, 1);
    if (STEP !== 0) {
      const foot = [cx + (R + 6) * Math.cos(gwich), cy + (R + 6) * Math.sin(gwich)];
      person(foot[0], foot[1], 1.35, 0, INK, 1);
      T('Greenwich', foot[0] + 28, foot[1] + 8, 32, INK, 'left');
    }
  }
});

function trimNum(n) {
  const r = Math.round(n * 10) / 10;
  return Math.abs(r - Math.round(r)) < 0.05 ? String(Math.round(r)) : r.toFixed(1);
}

add({
  title: 'Twelve Knuckles',
  endMin: 9.75,
  notes: [
    'Thumb counts three segments on each of four fingers: twelve. Five fingers on the other hand count the twelves: sixty.',
    'Show the counting if you like, and keep it short. The point is the number, not a history of Babylon.',
    'Sixty divides evenly by 2, 3, 4, 5, 6, 10, 12, 15, 20, and 30. By 12:45. Hipparchus is next: the pole star was not always this one.'
  ],
  caps: [
    'Babylon, about 1800 BC. A scribe counts the segments of one hand.',
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
    nums.forEach((n, i) => T(n, 360 + i * 130, 760, 36, INK, 'center', div));
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
    'You just told the eureka. This is the model. Say air-uh-TOSS-thuh-neez once if you have not. Syene is Aswan. This frame is the well: noon on the summer solstice, the Sun straight overhead. The red ray goes down the center and meets the water at a right angle.',
    'Alexandria is to the north. The same noon, a stick there casts a shadow. The shadow falls north, away from the Sun and away from Syene. The ray is the one through the tip of the stick. The angle is 7.2°.',
    'Pull back. The Syene ray and the Alexandria stick both run to the center of the Earth. The wedge there is the same 7.2°. By 9:30. The next slide does the arithmetic.'
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
    'A stadion was not one fixed length, so the miles are uncertain, roughly 24,000 to 29,000, near 25,000. Today the equator is 24,901 miles, 40,075 kilometers. He was close. By 10:30. Two captains on one parallel are next: the star gives the row, and nothing else.'
  ],
  caps: [
    'Eratosthenes multiplies. 360° divided by 7.2° is 50.',
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
    T('≈  25,000 miles', col, 680, 52, RED, 'left', miles, false, 500);
    T('Today:  24,901 miles,  40,075 km', col, 748, 32, INK, 'left', miles);
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
    'Keep it short. By 11:15. The row from the bingo card is the one the sky can give you. A fist is the rough tool. Next.'
  ],
  caps: [
    'Two captains, 50° north. The same star, at the same height.',
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
    x.fillRect(220, 560, 1480, 180);
    L(220, 680, 1700, 680, INK, 2);
    T('50° north', 250, 640, 32, MUTE, 'left', vis(0));
    const x1 = 520, x2 = 520 + sep * 36;
    [x1, x2].forEach((sx, i) => {
      ship(sx, 680, 1.5, INK, 0, vis(0));
      skyBowl(sx, 470, vis(0));
    });
    const nm = sep * 60 * Math.cos(50 * D);
    const show = vis(1);
    L(x1, 730, x2, 730, RED, 3, null, show);
    T(`${Math.round(nm)} nautical miles`, (x1 + x2) / 2, 778, 36, RED, 'center', show, false, 500);
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
    'Polaris is close to the pole today. By 12:00. Babylon is next: a scribe, and the number sixty. Hipparchus and the empty pole come after that.'
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
    'By 13:30. A fist and a pole star work on solid ground. A lieutenant on a rolling deck is next.'
  ],
  caps: [
    'Rhodes, about 130 BC. Hipparchus finds an empty patch at the pole.',
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
    'By 14:15. Latitude was still possible. Longitude was not, because east and west are a clock. Greenwich at noon is next.'
  ],
  caps: [
    'A lieutenant, mid-ocean. On land the plumb hangs still.',
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
    'Four hours times 15 degrees is 60 degrees west. Ahead of Greenwich would be east. By 17:45. So where do you get Greenwich time at sea? Padua, 7 January 1610.'
  ],
  caps: [
    'A lieutenant takes local noon. Greenwich is a clock he cannot see.',
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
    'By 20:45. The Moon is the astronomers’ clock, and it is hard. London, 1714, puts a price on an easier way. Do not say the Act was passed because of Scilly. Say the wreck is why the question has blood on it.'
  ],
  caps: [
    'Maskelyne, 1767. The Moon moves about its own width in an hour.',
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
  title: 'A Clock in the Sky',
  endMin: 24.25,
  pause: '45 seconds',
  ask: 'What will you see tomorrow night?',
  notes: [
    'Padua, 7 January 1610. Galileo, a professor with a new telescope, sees three small stars in a line beside Jupiter. He calls them stars. Pause about 45 seconds. What will you see tomorrow night?',
    'The next nights they have moved. A fourth appears by 13 January. They are moons. The names Io, Europa, Ganymede, and Callisto come later, from Simon Marius. Io goes round in about 42.5 hours.',
    'Eureka: when Io slips into Jupiter’s shadow, everyone on Earth who is looking sees it at the same instant. That is a clock. He offers it to Spain, then, years later, to the Dutch. Neither puts it on a ship.',
    'On land it works. Cassini’s tables later remap France from dry ground. On a rolling deck nobody can hold a telescope on a dot that small. By 19:15. The aside is Paris, 1676: the clock runs late, and the lateness is the speed of light.',
    'Pictures: Jupiter, NASA / JPL / University of Arizona, Cassini, public domain. Io, NASA / JPL / University of Arizona, Galileo, public domain.'
  ],
  caps: [
    'Padua, 7 January 1610. Three small stars beside Jupiter.',
    'What will you see tomorrow night?',
    'They have moved. They are moons. A fourth appears.',
    'When Io goes dark, the whole Earth shares one instant.',
    'He offers that clock to Spain, then to the Dutch.',
    'On land it works. On a rolling deck, no one can hold the telescope.'
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
    const days = [0.22, 0.22, 1.22, 0.55, 0.55, 0.55];
    const prev = [0.22, 0.22, 0.22, 1.22, 0.55, 0.55][STEP];
    const day = lerp(prev, days[STEP], U);
    const blur = STEP >= 5 ? Math.sin(SEC * 1.6) * 16 : 0;
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
      if (m.name === 'Callisto' && STEP < 2) return;
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
      if (STEP >= 2 && (m.io || !crowded)) T(m.name, m.x, m.io ? cy - 58 : cy + 28, 28, m.io ? '#f0d48a' : '#c9c3b6', 'center', vis(0));
    });
  }
});

add({
  title: 'The Isles of Scilly',
  endMin: 26,
  notes: [
    'Cold open. 22 October 1707, the date Britain was using. Admiral Sir Cloudesley Shovell, home from the Mediterranean, fog and gales. You will also see the name spelled Clowdisley. Say Cloudesley.',
    'The officers compare reckonings and agree they are safely in the mouth of the Channel. One captain thinks Scilly. He is outvoted. Let that sit.',
    'That night Association, Eagle, Romney, and Firebrand strike the Western Rocks. The toll is not one number. Counts run from about 1,400 to about 2,000 men, Shovell among them. Say the range. Charts and compasses were poor too. Longitude was the part nobody could measure.',
    'Do not say this night caused the Longitude Act. Historians do not agree that it did. Say: nobody on that deck could find longitude. Then the title, as a question. Where am I? By 1:45. Havana is next, and the globe stays quiet until they vote.',
    'Picture: public-domain engraving of Sir Cloudesley Shovell’s fleet lost on the rocks of Scilly, 22 October 1707.'
  ],
  caps: [
    '22 October 1707.',
    'They were sure.',
    'The rocks.',
    'Where am I?'
  ],
  capY: 990,
  dark: true,
  credit: 'Public domain engraving of the 1707 wreck on the rocks of Scilly.',
  draw() {
    const life = reduce ? 1 : cl((performance.now() - (this.born || animFrom)) / 9000);
    const zoom = 1 + 0.18 * ez(Math.min(1, life));
    x.save();
    x.beginPath();
    x.rect(0, 0, W, H);
    x.clip();
    if (!coverPhoto(PHOTO.scilly, zoom, Math.sin(life * 2) * 16, life * 20)) {
      x.fillStyle = '#102033';
      x.fillRect(0, 0, W, H);
    }
    x.restore();
    x.fillStyle = 'rgba(8, 18, 40, 0.38)';
    x.fillRect(0, 0, W, H);
    x.save();
    for (let i = 0; i < 5; i++) {
      const y = ((i * 220 + SEC * 28) % (H + 240)) - 120;
      x.globalAlpha = 0.09 + 0.04 * Math.sin(SEC + i);
      x.fillStyle = '#d5dde6';
      x.fillRect(-40, y, W + 80, 90);
    }
    x.restore();
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
    [[430, 620, 70], [780, 700, 80], [1180, 430, 64], [1500, 520, 48]].forEach((l, i) => {
      const flick = 0.45 + 0.55 * Math.abs(Math.sin(SEC * (2.2 + i * 0.7) + i));
      glow(l[0], l[1], l[2], flick);
    });
    const drift = span(life, 0.22, 0.7);
    const sx = lerp(1580, 470, drift), sy = lerp(480, 740, drift);
    ship(sx, sy, 1.25, '#f4efe4', -0.25, 0.92);
    const hitR = span(life, 0.62, 0.82);
    if (hitR > 0) glow(520, 860, 220, hitR);
  }
});

add({
  title: 'A Watch That Could Travel',
  endMin: 27.5,
  notes: [
    'John Harrison. Born 1693 in Foulby, Yorkshire. The family moves to Barrow upon Humber, in Lincolnshire, and he learns his father’s trade: carpenter. His first clock, 1713, is almost all wood. Do not say H1 was wood. The sea clocks are brass. Ask: can a carpenter beat Newton?',
    'H1, 1735, a sea trial to Lisbon in 1736. H2 never sails: he finds the balances feel the ship’s yaw, and Britain is at war. H3 takes him until 1759. H4, the same year, is a large pocket watch. From the first sea clock to the day Parliament pays him is about forty years.',
    '1761 to 1762, his son William takes H4 to Jamaica on Deptford, 81 days. The watch lost minutes, close to the rate Harrison had predicted. After that allowance, the residue was about 5 seconds, near one nautical mile. That is his figure. The Board says it might be luck, and demands another trial. Barbados, 1764: within about 39 seconds, under 10 miles. Maskelyne, on the same voyage for the Moon, is around 30 miles, with much more arithmetic.',
    'Do not say he won £20,000 at the dock. Grants from the Board, about £4,315. In 1765, £10,000, if he explains the watch and hands it over. Maskelyne is Astronomer Royal by then, and on the Board, and he reports against it. In 1772 King George III tests the next watch at the palace. In 1773 Parliament pays £8,750. Harrison is 80. The pieces add to £23,065. He never officially wins the prize. By 23:30. Washington, 1884, is next: the world picks his zero.',
  ],
  caps: [
    'Barrow, Lincolnshire. A carpenter. His first clocks are almost all wood.',
    'H1, H2, H3, H4. About forty years.',
    'Jamaica, 1761. After the rate he predicted: about 5 seconds in 81 days.',
    'Promised, £20,000. Paid in pieces, £23,065. He never officially wins the prize.'
  ],
  capY: 800,
  capBox: { x: 960, y: 800, w: 1680, align: 'center', size: 34 },
  draw() {
    const y0 = 250, x0 = 220, x1 = 1700;
    T('1713', 220, 150, 32, MUTE, 'left', vis(0));
    T('wood', 340, 150, 36, INK, 'left', vis(0));
    const marks = [
      [1735, 'H1'],
      [1741, 'H2'],
      [1759, 'H4'],
      [1762, 'Jamaica'],
      [1773, 'paid']
    ];
    const t0 = 1713, t1 = 1773;
    const px = t => x0 + (t - t0) / (t1 - t0) * (x1 - x0);
    const grow = STEP >= 1 ? (STEP === 1 ? U : 1) : 0;
    if (grow > 0) {
      L(x0, y0, lerp(x0, x1, grow), y0, INK, 4);
      marks.forEach(([yr, name]) => {
        const x = px(yr);
        if ((x - x0) / (x1 - x0) > grow) return;
        L(x, y0 - 16, x, y0 + 16, yr === 1759 || yr === 1762 ? RED : INK, 3);
        T(String(yr), x, y0 + 48, 28, MUTE, 'center');
        T(name, x, name === 'Jamaica' ? y0 + 100 : y0 - 44, 32, yr === 1762 ? RED : INK, 'center');
      });
    }
    if (STEP === 2) {
      T('about 5 seconds', 240, 430, 72, RED, 'left', 1, false, 500);
      T('in 81 days, after the rate he predicted', 240, 500, 32, MUTE, 'left');
      T('his figure  ·  about 1 nautical mile', 240, 548, 32, INK, 'left');
    }
    if (STEP >= 3) {
      const rows = [
        ['Promised prize', 20000, INK],
        ['Grants', 4315, MUTE],
        ['1765, with strings', 10000, INK],
        ['1773, Parliament', 8750, RED]
      ];
      rows.forEach((r, i) => {
        const y = 430 + i * 70;
        const w = r[1] / 20000 * 520;
        x.fillStyle = i === 0 ? 'rgba(22,21,20,.08)' : (i === 3 ? 'rgba(176,31,36,.85)' : 'rgba(22,21,20,.75)');
        x.fillRect(1180, y - 22, w * (STEP === 3 ? U : 1), 28);
        T(r[0], 1080, y, 28, INK, 'right');
      });
      T('£23,065 in pieces. Not the prize.', 1180, 720, 32, RED, 'left', 1, false, 500);
    }
  }
});

add({
  key: 'close',
  title: 'Where Am I?',
  endMin: 28,
  notes: [
    'You, tonight, a phone in a pocket. The same question Shovell could not answer. A row, a column, a pin.',
    'The satellites overhead carry atomic clocks. Your phone times the signals. The position is still a difference of clocks, the thing Galileo wanted and Harrison built. By 28:00.',
    'Then two minutes of questions. Stop by 30:00. The appendix, the star day, only if someone asks why the Sun’s day is the longer one. Venus, Cook, and Mason and Dixon are not this talk.'
  ],
  caps: [
    'Where am I?',
    'A phone answers it the same way.',
    'The satellites carry atomic clocks. Position is still a time.'
  ],
  capY: 800,
  capBox: { x: 960, y: 800, w: 1500, align: 'center', size: 40 },
  draw() {
    const x0 = 280, y0 = 220, gw = 720, gh = 480;
    x.strokeStyle = HAIR;
    x.lineWidth = 1.5;
    for (let i = 0; i <= 4; i++) {
      const p = vis(0);
      L(x0, y0 + i * gh / 4, x0 + gw * p, y0 + i * gh / 4, HAIR, 1.5);
      L(x0 + i * gw / 4, y0, x0 + i * gw / 4, y0 + gh * p, HAIR, 1.5);
    }
    const pinAt = [x0 + gw * 0.62, y0 + gh * 0.55];
    pin(pinAt[0], pinAt[1], vis(0));
    const sats = [[1180, 180], [1500, 280], [1360, 120]];
    const show = vis(2);
    sats.forEach((s, i) => {
      const a = cl((show * 3) - i);
      C(s[0], s[1], 16, PAPER, INK, 2.5);
      T('clock', s[0] + 28, s[1] + 8, 28, MUTE, 'left', a);
      L(s[0], s[1] + 18, pinAt[0], pinAt[1], RED, 2, [6, 6], a);
    });
    T('clocks in the sky', 1280, 460, 48, RED, 'left', show, false, 500);
  }
});


add({
  title: 'The Mile',
  ask: 'Who decides how long a mile is?',
  notes: [
    'Question first. Who decides how long a mile is? Let them answer. Power does.',
    'Rome. A legionary’s mille passus is 1,000 paces, and a pace is two steps. The roads the legions built are measured in it. It is about 5,000 Roman feet, shorter than the mile on a modern road sign.',
    'England, 1593, under Elizabeth I. Parliament is limiting new building near London, and in that statute it fixes the mile: 8 furlongs, each of 40 poles, each pole 16½ feet. That is 5,280 feet. They will not shorten the surveyor’s rod, because land is already written down in rods. The farmers’ ruler stays. The mile stretches to fit it.',
    'The nautical mile is different. It is one minute of latitude, a piece of the Earth, which is why sailors and pilots use it. A minute is a little longer near the poles than at the equator, because the Earth is not a perfect sphere. In 1929 an international conference sets the nautical mile at exactly 1,852 meters, a round number near that minute. Not every navy switches that year. By 7:15. The librarian who measured the planet is next.'
  ],
  caps: ['', '1,000 paces.', '5,280 feet.', 'One minute of Earth.'],
  capY: 800,
  capBox: { x: 960, y: 800, w: 1400, align: 'center', size: 48 },
  draw() {
    if (STEP === 0) {
      T('Who decides how long a mile is?', 960, 460, 64, INK, 'center', 1, false, 500);
      return;
    }
    const u = reduce ? 1 : ez(cl((performance.now() - animFrom) / 1600));
    const n = 36;
    const dots = [];
    for (let i = 0; i < n; i++) {
      const march = (i + (reduce ? 0 : SEC * 3)) % n;
      const road = { x: 240 + march / n * 1440, y: 520 };
      const col = i % 12, row = Math.floor(i / 12);
      const field = { x: 360 + col * 100, y: 280 + row * 90 };
      const p = STEP === 1 ? road : { x: lerp(road.x, field.x, u), y: lerp(road.y, field.y, u) };
      dots.push(p);
    }
    if (STEP < 3) {
      if (STEP >= 2) {
        x.strokeStyle = HAIR;
        x.lineWidth = 2;
        for (let k = 0; k < 4; k++) L(300, 250 + k * 90, 1560, 250 + k * 90, HAIR, 2, null, u);
      }
      dots.forEach(p => C(p.x, p.y, 7, INK));
      return;
    }
    const cx = 960, cy = 860, R = 520;
    const a0 = -Math.PI * 0.82, a1 = -Math.PI * 0.18;
    arc(cx, cy, R, a0, a1, INK, 3, false, 1);
    for (let m = 0; m <= 60; m++) {
      const a = lerp(a0, a1, m / 60);
      const show = cl(u * 61 - m);
      const inner = m === 30 ? R - 90 : R - 26;
      L(cx + inner * Math.cos(a), cy + inner * Math.sin(a), cx + R * Math.cos(a), cy + R * Math.sin(a), m === 30 ? RED : INK, m === 30 ? 6 : 2, null, show);
    }
  }
});

add({
  title: 'A Well at Syene',
  notes: [
    'Act two opens on a person, not a diagram. Alexandria, about 240 BC. Eratosthenes runs the library. Say air-uh-TOSS-thuh-neez once. The account we have is later, from Cleomedes. Tell it as the story that came down, not as a lab notebook.',
    'He reads a report. Syene, which is Aswan, at noon on the summer solstice: the sun shines to the bottom of a deep well. No shadow.',
    'The same noon, in Alexandria, a stick still casts a shadow. Ask why, and wait one beat.',
    'Eureka: the Earth curves. If the sun’s rays are parallel, that shadow is an angle at the center of the Earth. The next slide is the well, the stick, 7.2°, and the wedge. By 8:15.'
  ],
  caps: [
    '',
    'A report from Syene: at noon on the solstice, the sun lights the bottom of a well.',
    'The same noon in Alexandria, his stick still casts a shadow.',
    'The Earth curves. One angle will measure it.'
  ],
  capY: 800,
  capBox: { x: 960, y: 800, w: 1600, align: 'center', size: 34 },
  draw() {
    if (STEP === 0) {
      person(860, 620, 2.4, 0, INK, 1);
      T('Alexandria, about 240 BC', 1040, 420, 48, INK, 'left', 1, false, 500);
      T('Eratosthenes keeps the library.', 1040, 490, 36, MUTE, 'left');
      return;
    }
    const ground = STEP >= 3 ? 1 : 0;
    if (ground) {
      x.beginPath();
      x.arc(960, 980, 760, Math.PI * 1.15, Math.PI * 1.85, false);
      x.strokeStyle = RED;
      x.lineWidth = 4;
      x.stroke();
      T('It curves.', 960, 200, 56, RED, 'center', 1, false, 500);
    }
    const wx = 520, wy = 560;
    x.strokeStyle = INK;
    x.lineWidth = 3;
    x.strokeRect(wx - 36, wy - 20, 72, 90);
    L(wx, 160, wx, wy - 24, RED, 3, null, 1);
    C(wx, 130, 18, PAPER, INK, 2);
    T('Syene', wx, wy + 120, 36, INK, 'center');
    T('noon, midsummer', wx, wy + 164, 28, MUTE, 'center');
    if (STEP >= 2) {
      const ax = 1360, ay = 560;
      L(ax, ay, ax, ay - 200, INK, 8);
      L(ax + 70, ay, ax, ay - 200, RED, 4);
      person(ax - 80, ay + 8, 1.4, 0, INK, 1);
      T('Alexandria', ax, ay + 120, 36, INK, 'center');
      T('a shadow', ax + 90, ay - 40, 32, RED, 'left');
    }
  }
});

add({
  title: 'Was 1900 a Leap Year?',
  ask: 'Was 1900 a leap year?',
  notes: [
    'Right after the 360° circle. Question first, and do not answer it yet. Was 1900 a leap year? Most of the room will say yes.',
    'No. In the calendar we use, a century year is a leap year only if it divides by 400. 1900 does not. 2000 does. Keep this moving. About a minute for the whole aside.',
    'Why 360 degrees at all? A likely reason, not a document we can point to: Babylonian and Egyptian schematic years of 360 days, about a degree a day. The Egyptians then add 5 days, outside the twelve months. 365. Say “likely.”',
    '46 BC. Julius Caesar, advised by Sosigenes, adds a leap day every 4 years. The new calendar starts in 45 BC. The average year is 365.25 days, still about 11 minutes too long. By 1582 the spring equinox has slipped about 10 days from where the Church fixed Easter in 325. Pope Gregory XIII: in Rome, Thursday 4 October 1582 is followed by Friday 15 October. Century years leap only if they divide by 400. England does not switch. In 1700 England has a leap day and Rome does not, so by 1752 the gap is 11 days. Wednesday 2 September 1752 is followed by Thursday 14 September. Britain and the American colonies. Do not invent riots. By 16:45. The lieutenant’s two clocks are next.'
  ],
  caps: [
    '',
    'No. A century year leaps only if it divides by 400. 2000 does.',
    'A likely reason for 360°: a 360-day year. The Egyptians add 5 days.',
    'Caesar adds a leap day. Gregory deletes 10 days. Britain, in 1752, deletes 11.'
  ],
  capY: 800,
  capBox: { x: 960, y: 800, w: 1680, align: 'center', size: 32 },
  draw() {
    if (STEP === 0) {
      T('Was 1900 a leap year?', 960, 460, 72, INK, 'center', 1, false, 500);
      return;
    }
    const cx = 700, cy = 430, R = 210;
    const gap = STEP === 1 ? 0.15 : STEP === 2 ? 0.85 : lerp(0.85, 0.16, U);
    const a0 = -Math.PI / 2 + gap / 2;
    x.beginPath();
    x.arc(cx, cy, R, a0, a0 + TAU - gap, false);
    x.strokeStyle = INK;
    x.lineWidth = 10;
    x.stroke();
    const g0 = -Math.PI / 2 - gap / 2, g1 = -Math.PI / 2 + gap / 2;
    L(cx + R * Math.cos(g0), cy + R * Math.sin(g0), cx + R * Math.cos(g1), cy + R * Math.sin(g1), RED, 6);
    if (STEP === 1) {
      T('No.', 1180, 400, 120, RED, 'left', 1, false, 500);
      T('1900 does not divide by 400.', 1180, 490, 32, INK, 'left');
      T('2000 does.', 1180, 540, 36, INK, 'left');
    } else if (STEP === 2) {
      T('360 days', 1100, 380, 48, INK, 'left', 1, false, 500);
      T('likely, a degree a day', 1100, 440, 32, MUTE, 'left');
      T('+ 5 Egyptian days', 1100, 520, 36, RED, 'left');
    } else {
      T('11 minutes a year', 1100, 360, 40, RED, 'left', 1, false, 500);
      T('not to scale', 1100, 410, 28, MUTE, 'left');
      T('1582 · 10 days', 1100, 490, 36, INK, 'left', cl((U - 0.25) / 0.3));
      T('1752 · 11 days', 1100, 550, 36, INK, 'left', cl((U - 0.55) / 0.3));
    }
  }
});

add({
  title: 'Light Takes Time',
  notes: [
    'A short aside, and a delight. Paris, 1676. Ole Rømer is timing Io’s eclipses so Cassini’s land clock stays honest. Say Rømer as RU-mer. He is not hunting a new law. He is checking a table.',
    'The eclipses come late when Earth is on the far side of its orbit from Jupiter, and early when Earth is near. The lag is the news.',
    'He says light takes time to cross the gap. His figure is about 22 minutes to cross the diameter of Earth’s orbit. The modern crossing is about 16 minutes 40 seconds. Say about 22, and that we now say nearer 17. Huygens turns the time into a speed. Cassini does not accept the idea. Then back to the sea: the Moon is the astronomers’ other clock. By 20:00.'
  ],
  caps: [
    'Paris, 1676. Rømer is timing Io, so the land clock stays honest.',
    'The eclipses run late when Earth is far from Jupiter.',
    'Light takes time. He was measuring a clock, and found that.'
  ],
  capY: 800,
  capBox: { x: 960, y: 800, w: 1600, align: 'center', size: 34 },
  draw() {
    const jx = 1560, jy = 420;
    C(jx, jy, 70, '#c4a574', INK, 3);
    T('Jupiter', jx, jy + 110, 32, INK, 'center');
    C(520, 430, 22, PAPER, INK, 2.5);
    T('Sun', 520, 490, 28, MUTE, 'center');
    const near = STEP < 2;
    const ex = near ? 760 : 300;
    const ey = 430;
    C(ex, ey, 18, PAPER, INK, 3);
    T(near ? 'Earth, near' : 'Earth, far', ex, ey + 56, 32, INK, 'center', 1);
    L(ex, ey, jx - 70, jy, RED, 3, [8, 6], vis(1));
    if (STEP >= 2) T('about 22 minutes across the orbit', 200, 250, 36, RED, 'left', 1, false, 500);
    T('the land clock', 200, 180, 32, MUTE, 'left', vis(0));
  }
});

add({
  title: 'The Longitude Act',
  ask: 'Can a watch do it?',
  notes: [
    'London, 1714. Queen Anne signs the Act. Up to £20,000 if you can find longitude at sea to within half a degree. £15,000 within two thirds. £10,000 within a degree. Half a degree is two minutes of time. A few million, in today’s money, and only roughly: it depends how you count.',
    'Do not say Parliament did this because of Scilly. The wreck is why the question has blood on it. The Act itself comes from a lobby of mathematicians, Whiston among them.',
    'Isaac Newton writes the committee a report. A watch that keeps time exactly, through the motion of a ship and the heat and the cold, “hath not yet been made.” He points to the sky: the Moon, and Jupiter’s moons, which he also says cannot yet be observed from a moving deck. The astronomers are the establishment. Ask: can a watch do it? Newton’s answer is: not this one. By 21:45. The carpenter is next.'
  ],
  caps: [
    'London, 1714. Up to £20,000 for a method that works at sea.',
    'Half a degree gets the fortune. One degree gets half of it.',
    '',
    'He points to the sky. The astronomers agree.'
  ],
  capY: 800,
  capBox: { x: 960, y: 800, w: 1680, align: 'center', size: 34 },
  draw() {
    if (STEP < 2) {
      T('£20,000', 960, 250, 96, RED, 'center', 1, false, 500);
      T('a few million, today, roughly', 960, 320, 28, MUTE, 'center');
    }
    const rows = [['½°', '£20,000'], ['⅔°', '£15,000'], ['1°', '£10,000']];
    if (STEP >= 1) rows.forEach((r, i) => {
      T(r[0], 760, 420 + i * 64, 40, INK, 'right', 1, false, 500);
      T(r[1], 820, 420 + i * 64, 40, i === 0 ? RED : INK, 'left');
    });
    if (STEP >= 2) {
      T('Can a watch do it?', 960, 250, 48, INK, 'center');
      T('“Such a watch hath not yet been made.”', 960, 640, 36, RED, 'center', 1, true);
    }
  }
});

add({
  title: 'The Prime Meridian',
  ask: 'Where should zero longitude be?',
  notes: [
    'Washington, October 1884. The president has invited the world. Forty-one delegates, twenty-five nations, from the first of October. The vote that matters is 13 October. Question first: where should zero be?',
    'Greenwich wins, 22 to 1. The meridian through the center of the transit instrument at the Observatory. It is a proposal to governments, not a treaty that binds them that afternoon. San Domingo, now the Dominican Republic, votes no. France and Brazil abstain.',
    'Why Greenwich? Not because the Earth prefers it. Britain’s navy and the shipping charts already use it. Power, again, decides where zero is.',
    'France does not set its legal time by that meridian until 1911, and the law that year still will not say “Greenwich.” It says Paris mean time, pulled back by 9 minutes and 21 seconds. The name itself waits until 1978. By 25:00. The other side of the world is next: same noon, two dates.'
  ],
  caps: [
    '',
    'Greenwich wins, 22 to 1.',
    'San Domingo votes no. France and Brazil abstain.',
    'France will not say “Greenwich” on a clock until 1911.'
  ],
  capY: 800,
  capBox: { x: 80, y: 800, w: 560, align: 'left', size: 32 },
  draw() {
    const u = STEP === 0 ? 0 : revealEase();
    const lon0 = lerp(-30, 0, STEP >= 1 ? u : 0);
    const R = lerp(300, 460, STEP >= 1 ? u : 0);
    const pr = globe(1280, 430, R, lon0, 48);
    if (STEP >= 1) meridian(pr, 0, 70, 20, u, RED, 4);
    const g = pr(0, 51.48);
    if (STEP >= 1 && g.z > 0 && u > 0.4) {
      C(g.x, g.y, 8, RED);
      T('Greenwich', g.x - 18, g.y - 36, 32, RED, 'right', cl((u - 0.4) / 0.3));
    }
    if (STEP === 0) T('Where should zero be?', 200, 360, 56, INK, 'left', 1, false, 500);
    if (STEP >= 1) {
      T('22', 160, 280, 120, RED, 'left', 1, false, 500);
      T('to 1', 360, 300, 64, INK, 'left');
    }
    if (STEP >= 2) T('San Domingo: no', 120, 460, 32, INK, 'left');
    if (STEP >= 3) T('France abstains, and waits.', 120, 530, 32, MUTE, 'left');
  }
});

add({
  title: 'The Date Line',
  ask: 'The sun is overhead on both sides. What day is it?',
  notes: [
    'Question first. Two ships, one just each side of 180°. The sun is at true high noon on both, the same instant. Do not talk about midnight. What day is it on each ship?',
    'Both clocks read noon. The time zones twelve hours ahead of Greenwich and twelve behind read the same hour. The calendar does not. The west side of the line, toward Asia, is a day ahead. The east side, toward the Americas, is a day behind. The clock and the calendar are different things.',
    'The line is not a law of nature, and this drawing is a sketch, not a chart. It already jogs for the Bering Strait and the Aleutians.',
    'Kiribati, 1995. President Teburoro Tito. The date line had cut the country in two, so the two halves shared only four business days a week. The eastern islands, the Phoenix and Line Islands, skip a day: Friday 30 December 1994 is followed by Sunday 1 January 1995. The practical line jogs east, out to about 150° west, so the whole nation keeps one date.',
    'Samoa, and Tokelau with it. Thursday 29 December 2011 is followed by Saturday 31 December. They skip Friday the 30th, to share a business week with New Zealand and Australia. American Samoa stays on the other side. Politics bends the line. By 26:45. Then the phone in your pocket: the same clocks, overhead.'
  ],
  caps: [
    '',
    'Same instant. Both clocks read noon.',
    'The calendars differ by one day.',
    'Kiribati, 1995. The line jogs, so one nation keeps one date.',
    'Samoa skips 30 December 2011, to trade with New Zealand.'
  ],
  capY: 800,
  capBox: { x: 80, y: 780, w: 620, align: 'left', size: 32 },
  draw() {
    const zoom = STEP >= 3 ? (STEP === 3 ? U : 1) : 0;
    const R = lerp(340, 520, zoom);
    const lat0 = lerp(8, STEP >= 4 ? -8 : 2, zoom);
    const pr = globe(1180, 420, R, 180, lat0);
    const idl = [
      [72, 180], [66, 191], [58, 186], [52, 170], [42, 180],
      [18, 180], [8, 204], [0, 210], [-8, 206], [-12, 180],
      [-13.5, 187.5], [-16, 187.5], [-22, 180], [-55, 180]
    ];
    const showN = STEP === 0 ? 0 : idl.length * (STEP === 1 ? U : 1);
    let prev = null;
    idl.forEach((p, i) => {
      const q = pr(p[1] > 180 ? p[1] - 360 : p[1], p[0]);
      const hot = (STEP >= 3 && i >= 5 && i <= 9) || (STEP >= 4 && i >= 10 && i <= 12);
      if (prev && q.z > 0 && prev.z > 0 && i < showN) L(prev.x, prev.y, q.x, q.y, hot ? RED : INK, hot ? 5 : 3);
      prev = q;
    });
    if (STEP >= 1) {
      const a = pr(165, 6), b = pr(-165, 6);
      if (a.z > 0) { ship(a.x, a.y, 1.1, INK, -0.4, 1); T('noon', a.x, a.y - 36, 28, INK, 'center'); }
      if (b.z > 0) { ship(b.x, b.y, 1.1, INK, 0.4, 1); T('noon', b.x, b.y - 36, 28, INK, 'center'); }
    }
    if (STEP >= 2) {
      T('Thursday noon', 80, 440, 36, RED, 'left');
      T('Wednesday noon', 80, 496, 36, INK, 'left');
    }
    if (STEP === 0) T('High noon on both sides. What day is it?', 80, 220, 40, INK, 'left', 1, false, 500);
    if (STEP >= 3) T('Kiribati', 80, 280, 36, RED, 'left');
    if (STEP >= 4) T('Samoa, 2011', 80, 340, 36, RED, 'left');
  }
});

add({
  title: 'Appendix',
  appendix: true,
  divider: true,
  endMin: 28.25,
  notes: [
    'Not part of the 28 minutes. Stop the talk at the close, take questions, and open this only if the room asks why the Sun\'s day is the longer one.',
    'One Degree More is the next slide.'
  ],
  caps: ['After the questions, if you want the star day.'],
  capY: 800,
  capBox: { x: 960, y: 780, w: 1400, align: 'center', size: 40 },
  draw() {
    T('Appendix', 960, 460, 120, INK, 'center', 1, false, 500);
    T('Not in the 28 minutes', 960, 560, 40, MUTE, 'center');
  }
});

add({
  title: 'One Degree More',
  appendix: true,
  endMin: 28.5,
  notes: [
    'Forty-five seconds, three clicks. Sidereal, sy-DEER-ee-ul, means by the stars. One turn against the stars is 23 hours 56 minutes. The precise length is 23 hours 56 minutes 4 seconds. Say 23 hours 56 minutes.',
    'The Earth also travels about one degree of its orbit in a day, 360 divided by 365, not a quarter turn. The drawing exaggerates that step. It is marked not to scale.',
    'One degree of spin is four minutes, because a day has 1,440 minutes and the circle has 360 degrees. The solar day is 24 hours. This is the appendix, after the questions. It is not inside the 28 minutes.'
  ],
  caps: [
    'Greenwich, the next night. The stars return in 23 hours 56 minutes.',
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



const PLAN = [
  ['cover', '', 0.25],
  ['The Isles of Scilly', 'The Crash', 1.75],
  ['havana', 'An Address', 3],
  ["Rome's Parallel", 'An Address', 4],
  ['Reno or Los Angeles', 'An Address', 5],
  ['Call a Square', 'An Address', 6.25],
  ['The Mile', 'An Address', 7.25],
  ['A Well at Syene', 'The Easy Half', 8.25],
  ['A Stick and a Shadow', 'The Easy Half', 9.5],
  ['The Whole Earth', 'The Easy Half', 10.5],
  ['The Easy Number', 'The Easy Half', 11.25],
  ['Fists and the Pole Star', 'The Easy Half', 12],
  ['Twelve Knuckles', 'The Easy Half', 12.75],
  ['Not Always the Pole Star', 'The Easy Half', 13.5],
  ['A Rolling Deck', 'The Easy Half', 14.25],
  ['One Circle, One Day', 'The Hard Half', 15.75],
  ['Was 1900 a Leap Year?', 'The Hard Half', 16.75],
  ['Two Clocks', 'The Hard Half', 17.75],
  ['A Clock in the Sky', 'The Hard Half', 19.25],
  ['Light Takes Time', 'The Hard Half', 20],
  ['The Moon as a Clock', 'The Hard Half', 20.75],
  ['The Longitude Act', 'The Prize', 21.75],
  ['A Watch That Could Travel', 'The Prize', 23.5],
  ['The Prime Meridian', 'The World Agrees', 25],
  ['The Date Line', 'The World Agrees', 26.75],
  ['close', 'Today', 28],
  ['Appendix', '', 28.25],
  ['One Degree More', '', 28.5]
];
(function arrange() {
  const buckets = new Map();
  for (const s of SLIDES) {
    const k = s.key || s.title;
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k).push(s);
  }
  const next = PLAN.map(([k, act, end]) => {
    const list = buckets.get(k);
    if (!list || !list.length) throw new Error('Missing slide: ' + k);
    const s = list.shift();
    if (act) s.act = act;
    s.endMin = end;
    return s;
  });
  const left = [...buckets.values()].flat();
  if (left.length) throw new Error('Unused slides: ' + left.map(s => s.title).join(', '));
  SLIDES.length = 0;
  next.forEach(s => SLIDES.push(s));
})();

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
  const clock = s.appendix ? 'Appendix' : byLabel(s.endMin);
  hintBy.textContent = clock;
  const durLine = s.appendix
    ? 'Not in the 28 minutes'
    : `${dm ? dm + ' min ' : ''}${ds ? ds + ' sec' : ''} on this slide · ${s.caps.length} click${s.caps.length > 1 ? 's' : ''}${s.pause ? ' · pause ' + s.pause : ''}`;
  notesEl.innerHTML = `<p class="by">${clock}</p><p class="dur">${durLine}</p><h2>${s.title}</h2>${s.ask ? `<p class="ask">${s.ask}</p>` : ''}<ul>${s.notes.map(n => `<li>${n}</li>`).join('')}</ul>`;
}
let nightFrom = 0;
function go(i, st) {
  const prev = SLIDES[idx];
  const was = step;
  idx = cl(i, 0, SLIDES.length - 1);
  const s = SLIDES[idx];
  if (s.dark && !(prev && prev.dark)) nightFrom = performance.now();
  step = cl(st == null ? 0 : st, 0, s.caps.length - 1);
  STEP = step;
  animFrom = performance.now();
  if (prev !== s || step < was) s.born = performance.now();
  if (!s.born) s.born = performance.now();
  if (s.state) {
    s.state.held = false;
    if ('spin' in s.state) s.state.spin = 0;
    if ('fly' in s.state) s.state.fly = null;
    if ('called' in s.state) s.state.called = '';
  }
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
let down = null, armed = null, spinning = false;
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
  let numbered = 0, headed = false, act = '';
  SLIDES.forEach((s, i) => {
    if (s.act && s.act !== act) {
      act = s.act;
      const h = document.createElement('p');
      h.className = 'act';
      h.textContent = s.act;
      menuList.appendChild(h);
    }
    if (s.appendix && !headed) {
      const h = document.createElement('p');
      h.className = 'appendix';
      h.textContent = 'Appendix';
      menuList.appendChild(h);
      headed = true;
    }
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'item';
    b.textContent = s.appendix ? s.title : `${++numbered}  ${s.title}`;
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
  const s = SLIDES[idx];
  if (s && s.spin && s.state && down && !dragSlide && Math.abs(p.x - down.x) > 6) {
    s.state.spin = (s.state.spin || 0) - (p.x - down.x) * 0.14;
    down = p;
    spinning = true;
  }
  if (dragSlide && dragSlide.move) dragSlide.move(p);
});
c.addEventListener('pointerup', e => {
  const p = pointer(e);
  if (menuOpen) { dragSlide = null; down = null; armed = null; return; }
  if (dragSlide || spinning) { dragSlide = null; down = null; armed = null; spinning = false; return; }
  if (down) {
    const dx = p.x - down.x, dy = p.y - down.y;
    const adx = Math.abs(dx), ady = Math.abs(dy);
    if (adx > 60 && adx > 1.5 * ady) { if (dx < 0) next(); else prev(); }
    else if (Math.hypot(dx, dy) < 10) {
      const landed = HITS.find(h => Math.hypot(p.x - h.x, p.y - h.y) < h.r);
      if (landed) landed.fn();
      else if (p.x < W / 3) prev();
      else next();
    }
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
  HITS = [];
  x.setTransform(DPR, 0, 0, DPR, 0, 0);
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
  if (s.credit) T(s.credit, 80, 48, 22, NIGHT ? '#d2cbbf' : MUTE, 'left');
  const hint = document.getElementById('hint');
  if (hint) hint.hidden = idx !== 0;
  if (idx === 0) {
    const titleCol = NIGHT ? '#f4efe4' : INK;
    const muteCol = NIGHT ? '#d2cbbf' : MUTE;
    T(s.title, 88, 86, 48, titleCol, 'left', 1, false, 500);
    const counter = `${idx + 1} / ${SLIDES.length}  ·  ${s.title}`;
    T(counter, 1832, 86, 28, muteCol, 'right');
  }
  const cap = s.caps[step];
  const capY = idx === 0 ? (s.capY || 940) : Math.min(s.capY || 820, 820);
  const hold = s.capAt && shotU(s.cine || CINE_MS) < s.capAt;
  if (!hold) caption(cap, capY, Boolean(s.ask) && cap === s.ask, s.capBox);
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
