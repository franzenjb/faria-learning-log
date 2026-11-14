// Globe engine copied from public/claude1/index.html.
// Same orthographic camera, same coast drawing, same fly.
(function () {
const TAU = Math.PI * 2, DEG = Math.PI / 180;
const INK = '#ece6da', GOLD = '#f0b35a', RED = '#ff7d6f', SKY = '#6fb3ff', OK = '#6fd48a', MUTED = '#9a9382', LINE = '#3b5f8a';
const fmt = (n, d = 1) => n.toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: d });

function fsz(ctx, size) {
  const hh = ctx.canvas.clientHeight || 600, ww = ctx.canvas.clientWidth || 900;
  const k = Math.max(1.1, Math.min(2.1, hh / 520, ww / 700));
  return Math.max(17, Math.round(size * k));
}
function text(ctx, s, x, y, o = {}) {
  let size = fsz(ctx, o.size || 13);
  const font = o.font === 'mono' ? 'Menlo,Consolas,monospace' : o.font === 'serif' ? 'Georgia,serif' : '-apple-system,Segoe UI,Roboto,sans-serif';
  ctx.font = `${o.weight || 500} ${size}px ${font}`;
  ctx.fillStyle = o.color || '#cfc8ba';
  ctx.textAlign = o.align || 'left';
  ctx.textBaseline = o.base || 'alphabetic';
  const W = ctx.canvas.clientWidth;
  if (W) {
    const tw = ctx.measureText(s).width;
    const l = o.align === 'right' ? x - tw : o.align === 'center' ? x - tw / 2 : x;
    if (tw < W - 12) x += Math.max(0, 6 - l) - Math.max(0, l + tw - (W - 6));
    else { ctx.font = ctx.font.replace(/\d+(\.\d+)?px/, Math.floor(size * (W - 16) / tw) + 'px'); x = o.align === 'right' ? W - 8 : o.align === 'center' ? W / 2 : 8; }
  }
  ctx.fillText(s, x, y);
}
function tag(ctx, s, x, y, color, size = 13) {
  size = fsz(ctx, size);
  ctx.font = `500 ${size}px Georgia,serif`;
  const tw = ctx.measureText(s).width;
  x = Math.max(8, Math.min(x, (ctx.canvas.clientWidth || 1e9) - tw - 10));
  ctx.fillStyle = 'rgba(10,14,24,.82)';
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(x - 6, y - size - 2, tw + 12, size + 10, 5) : ctx.rect(x - 6, y - size - 2, tw + 12, size + 10);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(s, x, y);
}
function arrow(ctx, x1, y1, x2, y2, color, w = 1.5) {
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = w;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  const a = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath(); ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 9 * Math.cos(a - .4), y2 - 9 * Math.sin(a - .4));
  ctx.lineTo(x2 - 9 * Math.cos(a + .4), y2 - 9 * Math.sin(a + .4));
  ctx.closePath(); ctx.fill();
}
const stars = Array.from({ length: 220 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.3 + .3, a: Math.random() }));
function drawStars(ctx, w, h, t) {
  for (const s of stars) {
    ctx.globalAlpha = .35 + .65 * Math.abs(Math.sin(t * .0007 + s.a * 9));
    ctx.fillStyle = '#dfe7ff';
    ctx.beginPath(); ctx.arc(s.x * w, s.y * h, s.r, 0, TAU); ctx.fill();
  }
  ctx.globalAlpha = 1;
}
function rot(p, yaw, pitch) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const x = p[0] * cy + p[2] * sy, z = -p[0] * sy + p[2] * cy;
  return [x, p[1] * cp - z * sp, p[1] * sp + z * cp];
}
function unrot(q, yaw, pitch) {
  const cp = Math.cos(pitch), sp = Math.sin(pitch), cy = Math.cos(yaw), sy = Math.sin(yaw);
  const y = q[1] * cp + q[2] * sp, z = -q[1] * sp + q[2] * cp;
  return [q[0] * cy - z * sy, y, q[0] * sy + z * cy];
}
const v3 = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k],
  dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  len: a => Math.hypot(a[0], a[1], a[2]),
  norm(a) { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }
};
const ll = (lat, lon) => [Math.cos(lat * DEG) * Math.cos(lon * DEG), Math.sin(lat * DEG), -Math.cos(lat * DEG) * Math.sin(lon * DEG)];
function fly(st, to, ms = 1200) { st.anim = { from: { yaw: st.yaw, pitch: st.pitch, zoom: st.zoom }, to, t0: performance.now(), ms }; }
function stepAnim(st, t) {
  if (!st.anim) return;
  const a = st.anim, k = Math.min(1, (t - a.t0) / a.ms), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  for (const key of ['yaw', 'pitch', 'zoom']) st[key] = a.from[key] + (a.to[key] - a.from[key]) * e;
  if (k >= 1) st.anim = null;
}
const camFor = (lat, lon, zoom) => ({ yaw: -Math.PI / 2 - lon * DEG, pitch: lat * DEG, zoom });
const slerp = (a, b, t) => {
  const w = Math.acos(Math.max(-1, Math.min(1, v3.dot(a, b))));
  if (w < 1e-6) return a;
  const s = Math.sin(w);
  return v3.norm(v3.add(v3.mul(a, Math.sin((1 - t) * w) / s), v3.mul(b, Math.sin(t * w) / s)));
};
function drawCoast(ctx, projFn, zoom, o = {}) {
  const color = o.color || 'rgba(236,230,218,.75)', width = o.width || 1.15;
  const draw = (set, col, wd) => {
    ctx.strokeStyle = col; ctx.lineWidth = wd; ctx.beginPath();
    for (const ln of set.lines) {
      let pen = false;
      for (let i = 0; i < ln.length; i += 2) {
        const q = projFn(ll(ln[i + 1] / set.q, ln[i] / set.q));
        if (q.z >= -0.01) { pen ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); pen = true; }
        else pen = false;
      }
    }
    ctx.stroke();
  };
  if (typeof COAST === 'undefined') return;
  draw(COAST, color, width);
  if (o.hi && zoom > 8 && typeof COAST_HI !== 'undefined') draw(COAST_HI, color, width);
}
function arcLine(ctx, proj, pts, color, width, dash) {
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash || []); ctx.beginPath();
  let pen = false;
  for (const p of pts) {
    const q = proj(p);
    if (q.z >= 0) { pen ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); pen = true; }
    else pen = false;
  }
  ctx.stroke(); ctx.setLineDash([]);
}
function pin(ctx, proj, name, lat, lon, color) {
  const q = proj(ll(lat, lon));
  if (q.z < 0) return null;
  ctx.fillStyle = color; ctx.beginPath(); ctx.arc(q.x, q.y, 6, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#0a0e18'; ctx.lineWidth = 2; ctx.stroke();
  if (name) tag(ctx, name, q.x + 10, q.y + 4, color, 13);
  return q;
}
function freshCam(lat, lon, zoom) {
  const c = camFor(lat, lon, zoom);
  return { yaw: c.yaw, pitch: c.pitch, zoom: c.zoom, anim: null, maxZoom: 40 };
}
// The sphere, graticule, coast and rim, centered above the button row.
function paintGlobe(ctx, w, h, st, t, opt = {}) {
  const foot = opt.foot == null ? 108 : opt.foot;
  const cx = opt.cx == null ? w * .5 : opt.cx;
  const cy = opt.cy == null ? (h - foot) * .52 : opt.cy;
  const R = (opt.R || Math.min(w, (h - foot)) * .42) * st.zoom;
  const proj = p => { const q = rot(p, st.yaw, st.pitch); return { x: cx + q[0] * R, y: cy - q[1] * R, z: q[2] }; };
  if (!opt.noStars) drawStars(ctx, w, h, t);
  const g = ctx.createRadialGradient(cx - R * .35, cy - R * .35, R * .05, cx, cy, R);
  g.addColorStop(0, '#2f5a8c'); g.addColorStop(.7, '#15294a'); g.addColorStop(1, '#0b1526');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
  if (st.zoom < 24) {
    for (let la = -60; la <= 60; la += 30) arcLine(ctx, proj, Array.from({ length: 73 }, (_, k) => ll(la, k * 5)), la ? 'rgba(236,230,218,.12)' : 'rgba(240,179,90,.7)', la ? 1 : 1.6);
    for (let lo = 0; lo < 360; lo += 30) arcLine(ctx, proj, Array.from({ length: 37 }, (_, k) => [-90 + k * 5, lo]), 'rgba(236,230,218,.1)', 1);
  }
  drawCoast(ctx, proj, st.zoom, { color: 'rgba(236,230,218,.85)', width: st.zoom > 6 ? 1.4 : 1.15, hi: true });
  ctx.strokeStyle = LINE; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
  const rim = ctx.createRadialGradient(cx, cy, R * .9, cx, cy, R * 1.05);
  rim.addColorStop(0, 'rgba(111,179,255,0)'); rim.addColorStop(.7, 'rgba(111,179,255,.22)'); rim.addColorStop(1, 'rgba(111,179,255,0)');
  ctx.fillStyle = rim; ctx.beginPath(); ctx.arc(cx, cy, R * 1.05, 0, TAU); ctx.fill();
  return { proj, cx, cy, R };
}
function bindOrbit(canvas, getSt) {
  const pts = new Map(); let moved = false, start = null, pinch0 = 0, zoom0 = 1, vx = 0, vy = 0, lastT = 0;
  const size = () => canvas.getBoundingClientRect();
  const pos = e => { const r = size(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const rate = () => { const st = getSt(), r = size(); return Math.min(.008, 1.15 / (Math.min(r.width, r.height) * .42 * Math.max(.5, st.zoom))); };
  canvas.addEventListener('pointerdown', e => {
    const st = getSt(); if (!st || st.lock) return;
    canvas.setPointerCapture(e.pointerId); pts.set(e.pointerId, pos(e)); moved = false; start = pos(e); vx = vy = 0; lastT = performance.now();
    if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch0 = Math.hypot(a.x - b.x, a.y - b.y); zoom0 = st.zoom; }
  });
  canvas.addEventListener('pointermove', e => {
    if (!pts.has(e.pointerId)) return;
    const st = getSt(); if (!st) return;
    const p = pos(e), prev = pts.get(e.pointerId); pts.set(e.pointerId, p);
    if (pts.size === 1) {
      const dx = p.x - prev.x, dy = p.y - prev.y;
      if (Math.abs(p.x - start.x) + Math.abs(p.y - start.y) > 6) moved = true;
      if (moved) { const r = rate(); st.yaw += dx * r; st.pitch = Math.max(-1.55, Math.min(1.55, st.pitch + dy * r)); st.anim = null; canvas.classList.add('dragging'); }
    } else if (pts.size === 2 && pinch0) {
      const [a, b] = [...pts.values()];
      st.zoom = Math.max(.6, Math.min(st.maxZoom || 12, zoom0 * Math.hypot(a.x - b.x, a.y - b.y) / pinch0));
      st.anim = null; moved = true;
    }
  });
  const end = e => { pts.delete(e.pointerId); if (!pts.size) canvas.classList.remove('dragging'); };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);
  return () => moved;
}
window.ENG = { TAU, DEG, INK, GOLD, RED, SKY, OK, MUTED, LINE, fmt, fsz, text, tag, arrow, drawStars, rot, ll, v3, fly, stepAnim, camFor, slerp, drawCoast, arcLine, pin, freshCam, paintGlobe, bindOrbit };
})();
