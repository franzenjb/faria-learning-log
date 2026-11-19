// v3 appendix scenes (Jeff, 19 Nov 2026). Ports from earlier faria*/kimi1 drafts
// (read-only) plus the new "Many ways to draw the globe" beat slide. Loaded
// after course-slides-v3.js and before course.js so NEW_SLIDES is registered
// before the course list is built.

// The original two-column “Moon mountains” HTML lives in this page too.
// Retitle it now, before course.js finds slides, so the native appendix
// port below is the one the talk and the course use.
(() => { const old = document.querySelector('section[data-title="Moon mountains"]'); if (old) old.dataset.title = 'Moon mountains (course original)'; })();

const V3_APPX_CTX = {
  'Image gallery': 'Appendix · Pictures behind the stories. Click a picture to fill the screen.',
  'Decimal places': 'Appendix · What each decimal place buys you on the ground.',
  'Eratosthenes': 'Appendix · A shadow and a paced distance gave the size of the Earth.',
  'Sidereal day': 'Appendix · Why the stars rise about four minutes earlier each night.',
  'Null Island': 'Appendix · 0°, 0°: a failure that looks like a place.',
  'Which system': 'Appendix · Same place, different numbers — always ask which system.',
  'Errors grow': 'Appendix · Small errors, carried forward, grow.',
  'The date line': 'Appendix · The date line is a political line, not a meridian.',
  'Light needs time, again': 'Appendix · The same Rømer scene, for questions.',
  'Many ways to draw the globe': 'Appendix · Every flat map is a deal with the globe.',
  'Vector or raster': 'Appendix · Two ways to record the world.',
  'The nautical mile': 'Appendix · 1′ of latitude is 1 nautical mile.',
  'The decision brief': 'Appendix · The choice, the next check, and the expiry.',
  'Ptolemy': 'Appendix · 8,000 places by two numbers, and zero at the Canaries.',
  'Columbus chart': 'Appendix · Columbus sailed west from zero, at the Canaries.',
  'The pole star wanders': 'Appendix · The sky is not a fixed ceiling.',
  'France got smaller': 'Appendix · Picard and La Hire timed Io, and France shrank.',
  'Pendulum at sea': 'Appendix · Why Huygens’s clock could not go to sea.',
  'GPS zero is 102 m east': 'Appendix · Stand on the brass line: the phone does not say zero.',
  'The quadrant': 'Appendix · How sailors actually took the angle.',
  'Four satellites, one spot': 'Appendix · Three for where, one for when. A nanosecond is a foot.',
  'Moon mountains': 'Appendix · Galileo measured a mountain he could never climb.'
};

addEventListener('load', () => setTimeout(() => {
  // EDIT 24 (Jeff, 19 Nov): do not draw the small 'Appendix · …' context line; it overlapped headlines.
  document.querySelectorAll('.v3-appx-ctx').forEach(el => el.remove());
  const gal = (typeof v3Find === 'function') ? v3Find('Image gallery') : null;
  if (gal) {
    const h2 = gal.querySelector('.gal h2');
    if (h2 && !gal.querySelector('.gal-sub')) {
      const p = document.createElement('p'); p.className = 'gal-sub';
      p.textContent = 'Click a picture to fill the screen. Arrows step through; Esc or a click closes.';
      h2.after(p);
    }
  }
}, 0));

const v3Wrap = (ctx, s, x, y, px, col, align, alpha, maxW) => {
  if (alpha <= 0 || !s) return y;
  ctx.save(); ctx.globalAlpha *= alpha; ctx.font = `400 ${px}px Georgia,serif`; ctx.fillStyle = col;
  ctx.textAlign = align; ctx.textBaseline = 'middle';
  const words = String(s).split(' '); let line = '', yy = y, lh = px * 1.28;
  const flush = () => { if (!line) return; ctx.lineWidth = 7; ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(6,9,18,.85)'; ctx.strokeText(line, x, yy); ctx.fillText(line, x, yy); yy += lh; line = ''; };
  for (const w of words) { const t = line ? line + ' ' + w : w; if (line && ctx.measureText(t).width > maxW) { flush(); line = w; } else line = t; }
  flush(); ctx.restore(); return yy;
};

/* ---------- Many Ways to Draw the Globe ---------- */
NEW_SLIDES['Many ways to draw the globe'] = {
  h1: 'Many Ways to Draw the Globe', fig: '',
  init(el) {
    if (typeof COAST === 'undefined' || typeof ll !== 'function' || typeof rot !== 'function') return;
    const G = '#f0b35a', SEA = '#6fd48a', MUT = '#9a9382', WCOL = '#ece6da';
    const WORDS = [
      ['Plate Carrée', 'The simplest flat map: keep longitude and latitude as x and y.'],
      ['The Globe', 'Orthographic: the only map that does not stretch the land. Drag to turn it.'],
      ['Gores', 'Peel the globe into twelve slices, and you can lay it almost flat.'],
      ['Mercator, 1569', 'Compass courses stay straight. The high latitudes inflate.'],
      ['Gall–Peters', 'Area is true everywhere. The tropics stretch tall; the poles squash.'],
      ['Goode, 1923', 'Area is true, and the cuts fall in the oceans, not the land.'],
      ['Winkel Tripel, 1921', 'Nothing exactly true, nothing too badly wrong. The atlas compromise.'],
      ['True Size', 'Slide Greenland down to the equator: about one-fourteenth the size of Africa.']
    ];
    const DEAL = [
      ['Keeps: a simple grid — longitude is x, latitude is y.', 'Gives up: size and shape toward the poles.'],
      ['Keeps: everything — it is the Earth.', 'Gives up: flatness. It will not fit on a page.'],
      ['Keeps: nearly true shape and size in each slice, ready to glue onto a globe.', 'Gives up: a single continuous sheet — the cuts break the map.'],
      ['Keeps: compass lines straight — that is why sailors loved it.', 'Gives up: size. The poles inflate; Greenland swells to the size of Africa.'],
      ['Keeps: area true, everywhere.', 'Gives up: shape — stretched tall near the equator, squashed near the poles.'],
      ['Keeps: area true, and the cuts fall in the oceans, not the land.', 'Gives up: a map you can’t fold back up or measure straight across.'],
      ['Keeps: nothing exactly true.', 'Gives up: nothing too badly — the compromise most atlases print.'],
      ['Keeps: Greenland’s true area, in miles.', 'Gives up: the familiar wall-map lie. Africa is about fourteen times larger.']
    ];
    const SRC = [
      'Plate carrée · equirectangular',
      'Globe · orthographic',
      'Gores · 12 sinusoidal slices',
      'Mercator · 1569 · conformal',
      'Gall–Peters · Gall 1855, Peters 1973 · cylindrical equal-area',
      'Goode homolosine · 1923 · interrupted equal-area',
      'Winkel tripel · 1921 · the compromise · National Geographic, 1998',
      'True size · Greenland slides to the equator'
    ];
    const AFRICA = [[-17.5, 21], [-17, 32], [-10, 35.5], [-5.9, 36], [3, 37], [11, 37.5], [20, 33], [30, 31.8], [32.5, 31.3], [34.5, 27], [36, 22], [38, 18], [43, 11.8], [51.5, 12], [48, 5], [41, -1.5], [40.5, -10], [40, -17], [35, -24], [32.8, -28.5], [26, -34], [18, -32.5], [12, -18], [12, -8], [9, -1], [8.5, 4], [4, 5.5], [-8, 5], [-13, 8], [-17.5, 14.8]];
    const GLC = [72, -41], GL_HOME = [72, -41], GL_TARGET = [8, 18];
    const QGL = COAST.lines.filter(ln => { let n = 0, inb = 0; for (let i = 0; i < ln.length; i += 2) { n++; const lo = ln[i] / COAST.q, la = ln[i + 1] / COAST.q; if (lo > -74 && lo < -10 && la > 59 && la < 84) inb++; } return n > 20 && inb / n > .9; });
    const QGLm = QGL.map(ln => { const out = []; for (let i = 0; i < ln.length; i += 2) { const lo = ln[i] / COAST.q, la = ln[i + 1] / COAST.q; out.push([(lo - GLC[1]) * 69.1 * Math.cos(la * DEG), (la - GLC[0]) * 69.1]); } return out; });
    const placeGL = c => QGLm.map(ln => ln.map(([e, n]) => { const la = c[0] + n / 69.1; return [la, c[1] + e / (69.1 * Math.max(.2, Math.cos(la * DEG)))]; }));
    const cam = { yaw: 20, pitch: 12 * DEG, R: 390, cx: 800, cy: 500 };
    let dragging = false, lastP = null;
    const ease = t => { t = Math.max(0, Math.min(1, t)); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
    const mercY = la => Math.log(Math.tan(Math.PI / 4 + Math.max(-80, Math.min(83, la)) * DEG / 2));
    const MERC_YMAX = mercY(85) / Math.PI;
    // Goode homolosine (Kimi's formulas, from the 1923 interrupted equal-area)
    const GO_PHI = 40.733 * DEG;
    const mollTab = (() => { const t = []; for (let d = 0; d <= 90; d++) { const ph = d * DEG, s = Math.PI * Math.sin(ph); let th = ph; for (let i = 0; i < 10; i++) { const fp = 2 + 2 * Math.cos(2 * th); if (fp < 1e-6) break; th -= (2 * th + Math.sin(2 * th) - s) / fp; } t.push(th); } return t; })();
    const mollTh = ph => { const d = ph / DEG, i = Math.min(89, Math.floor(d)), f = d - i; return mollTab[i] + (mollTab[i + 1] - mollTab[i]) * f; };
    const GO_DY = GO_PHI - Math.SQRT2 * Math.sin(mollTh(GO_PHI));
    const GO_B = [-180, -30, 90, 180];
    const GO_CM = [-100, 30, 140];
    const GO_OFF = (() => { const off = [-Math.PI - (GO_B[0] - GO_CM[0]) * DEG]; for (let k = 1; k < 3; k++) off.push(off[k - 1] + (GO_CM[k] - GO_CM[k - 1]) * DEG); return off; })();
    function goodeFwd(la, lo) {
      let k = 0; while (k < 2 && lo >= GO_B[k + 1]) k++;
      const dl = (lo - GO_CM[k]) * DEG, ph = Math.abs(la) * DEG, sg = la < 0 ? -1 : 1;
      let x, y;
      if (ph <= GO_PHI) { x = dl * Math.cos(ph); y = sg * ph; }
      else { const th = mollTh(ph); x = dl * 0.9003163 * Math.cos(th); y = sg * (Math.SQRT2 * Math.sin(th) + GO_DY); }
      return [(x + GO_OFF[k]) / Math.PI, y / Math.PI];
    }
    function winkelFwd(la, lo) {
      const ph = la * DEG, lm = lo * DEG, al = Math.acos(Math.max(-1, Math.min(1, Math.cos(ph) * Math.cos(lm / 2)))), sc = al > 1e-9 ? Math.sin(al) / al : 1;
      return [(lm * 2 / Math.PI + 2 * Math.cos(ph) * Math.sin(lm / 2) / sc) / (2 + Math.PI), (ph + Math.sin(ph) / sc) / (2 + Math.PI)];
    }
    const boxFor = kind => {
      if (kind === 'equi') return { cx: 800, cy: 500, sx: 3.7, sy: 3.7 };
      if (kind === 'merc') return { cx: 800, cy: 520, sx: 3.55, sy: 620 / (mercY(83) - mercY(-70)) };
      if (kind === 'gore') return { cx: 800, cy: 500, sx: 3.15, sy: 3.5 };
      if (kind === 'peters') return { cx: 800, cy: 500, sx: 620, sy: 620 };
      if (kind === 'goode') return { cx: 800, cy: 510, sx: 700, sy: 700 };
      if (kind === 'winkel') return { cx: 800, cy: 500, sx: 680, sy: 680 };
      return { cx: 800, cy: 500, sx: 1, sy: 1 };
    };
    const projFlat = (la, lo, kind, box) => {
      const { cx, cy, sx, sy } = box;
      if (kind === 'equi') return { x: cx + lo * sx, y: cy - la * sy, z: 1 };
      if (kind === 'merc') return { x: cx + lo * sx, y: cy - mercY(la) * sy, z: 1 };
      if (kind === 'gore') {
        const n = 12, width = 30, g = Math.max(0, Math.min(n - 1, Math.floor((lo + 180) / width)));
        const mid = -180 + (g + .5) * width, dlon = lo - mid, gap = 14;
        const x = (g - (n - 1) / 2) * (sx * width + gap) + sx * dlon * Math.cos(la * DEG);
        return { x: cx + x, y: cy - la * sy, z: 1 };
      }
      if (kind === 'peters') { const p = [lo * DEG / Math.PI, Math.sin(la * DEG) * 2 / Math.PI]; return { x: cx + p[0] * sx, y: cy - p[1] * sy, z: 1 }; }
      if (kind === 'goode') { const p = goodeFwd(la, lo); return { x: cx + p[0] * sx, y: cy - p[1] * sy, z: 1 }; }
      if (kind === 'winkel') { const p = winkelFwd(la, lo); return { x: cx + p[0] * sx, y: cy - p[1] * sy, z: 1 }; }
      const q = rot(ll(la, lo), cam.yaw, cam.pitch);
      return { x: cam.cx + q[0] * cam.R, y: cam.cy - q[1] * cam.R, z: q[2] };
    };
    const kindOf = k => k === 0 ? 'equi' : k === 1 ? 'globe' : k === 2 ? 'gore' : (k === 3 || k === 7) ? 'merc' : k === 4 ? 'peters' : k === 5 ? 'goode' : 'winkel';
    const goreOf = lo => Math.max(0, Math.min(11, Math.floor((lo + 180) / 30)));
    const goodeLobe = lo => { let k = 0; while (k < 2 && lo >= GO_B[k + 1]) k++; return k; };
    const drawCoastLL = (ctx, proj, wrap, splitGores, splitGoode) => {
      ctx.beginPath();
      for (const ln of COAST.lines) {
        let pen = false, prev = null, prevG = null, prevL = null;
        for (let i = 0; i < ln.length; i += 2) {
          const lo = ln[i] / COAST.q, la = ln[i + 1] / COAST.q, q = proj(la, lo), g = goreOf(lo), L = goodeLobe(lo);
          if (q.z < -0.01) { pen = false; prev = null; prevG = null; prevL = null; continue; }
          if (prev && Math.abs(q.x - prev.x) > wrap) pen = false;
          if (splitGores && prevG !== null && g !== prevG) pen = false;
          if (splitGoode && prevL !== null && L !== prevL) pen = false;
          pen ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y);
          pen = true; prev = q; prevG = g; prevL = L;
        }
      }
      ctx.stroke();
    };
    const drawGrat = (ctx, proj, wrap, a, splitGoode) => {
      ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = 'rgba(236,230,218,.16)'; ctx.lineWidth = 1;
      const stroke = (pts, meta) => { ctx.beginPath(); let pen = false, prev = null, prevL = null; for (let i = 0; i < pts.length; i++) { const q = pts[i], L = meta ? meta[i] : null; if (q.z < -0.01) { pen = false; prev = null; prevL = null; continue; } if (prev && Math.abs(q.x - prev.x) > wrap) pen = false; if (splitGoode && prevL !== null && L !== prevL) pen = false; pen ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); pen = true; prev = q; prevL = L; } ctx.stroke(); };
      for (let lo = -180; lo <= 180; lo += 30) stroke(Array.from({ length: 81 }, (_, i) => proj(-80 + 2 * i, lo)));
      for (let la = -60; la <= 60; la += 30) {
        const pts = [], meta = [];
        for (let i = 0; i <= 90; i++) { const lo = -180 + 4 * i; pts.push(proj(la, lo)); meta.push(goodeLobe(lo)); }
        stroke(pts, splitGoode ? meta : null);
      }
      ctx.restore();
    };
    const blendProj = (la, lo, aKind, bKind, t) => {
      const A = projFlat(la, lo, aKind, boxFor(aKind)), B = projFlat(la, lo, bKind, boxFor(bKind));
      const z = (A.z < -0.01 && t < .45) || (B.z < -0.01 && t > .55) ? -1 : 1;
      return { x: A.x + (B.x - A.x) * t, y: A.y + (B.y - A.y) * t, z };
    };
    const dealCard = (ctx, S, k, a) => {
      if (a <= 0) return;
      const [keep, give] = DEAL[k];
      ctx.save(); ctx.globalAlpha *= a;
      ctx.fillStyle = 'rgba(8,12,22,.94)'; ctx.strokeStyle = 'rgba(236,230,218,.28)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(40, 748, 720, 100, 10); ctx.fill(); ctx.stroke(); ctx.restore();
      v3Wrap(ctx, keep, 58, 778, 22, WCOL, 'left', a, 680);
      v3Wrap(ctx, give, 58, 816, 22, G, 'left', a, 680);
    };

    let stepsApi = null;
    const _steps = V3.steps;
    V3.steps = function (el2, n, fn) { stepsApi = _steps.call(this, el2, n, fn); return stepsApi; };
    try {
    V3.scene(el, 8, (S, ctx, now) => {
      const k = S.step, age = S.age(now), tMorph = ease(Math.min(1, age / 1100));
      el._mwStep = k;
      const fromK = (S.prev === undefined || S.prev === k) ? k : S.prev;
      const aKind = kindOf(fromK), bKind = kindOf(k), t = fromK === k ? 1 : tMorph;
      el._mwKind = (t > .6) ? bKind : aKind;
      const proj = (la, lo) => t >= .995 ? projFlat(la, lo, bKind, boxFor(bKind)) : blendProj(la, lo, aKind, bKind, t);
      const wrap = 280;

      ctx.fillStyle = '#070b16'; ctx.fillRect(0, 0, 1600, 1000);
      S.stars(now, (bKind === 'globe' || aKind === 'globe') ? .55 : .28);

      if (bKind === 'globe' || aKind === 'globe') {
        const a = bKind === 'globe' ? t : 1 - t;
        if (a > .02) {
          const { cx, cy, R } = cam;
          const g = ctx.createRadialGradient(cx - R * .35, cy - R * .35, R * .05, cx, cy, R);
          g.addColorStop(0, '#2f5a8c'); g.addColorStop(.7, '#15294a'); g.addColorStop(1, '#0b1526');
          ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
          const rim = ctx.createRadialGradient(cx, cy, R * .94, cx, cy, R * 1.07);
          rim.addColorStop(0, 'rgba(111,179,255,0)'); rim.addColorStop(.5, 'rgba(111,179,255,.28)'); rim.addColorStop(1, 'rgba(111,179,255,0)');
          ctx.fillStyle = rim; ctx.beginPath(); ctx.arc(cx, cy, R * 1.07, 0, 7); ctx.fill(); ctx.restore();
        }
      }

      const sheet = (kind) => kind === 'equi' || kind === 'merc' || kind === 'peters';
      if (sheet(bKind) && t > .5) {
        const box = boxFor(bKind);
        let yTop, yBot, x0, x1;
        if (bKind === 'peters') {
          const p0 = projFlat(90, -180, bKind, box), p1 = projFlat(-90, 180, bKind, box);
          x0 = p0.x; yTop = p0.y; x1 = p1.x; yBot = p1.y;
        } else {
          yTop = projFlat(bKind === 'merc' ? 83 : 90, 0, bKind, box).y;
          yBot = projFlat(bKind === 'merc' ? -70 : -90, 0, bKind, box).y;
          x0 = projFlat(0, -180, bKind, box).x; x1 = projFlat(0, 180, bKind, box).x;
        }
        ctx.save(); ctx.globalAlpha = (t - .5) * 2 * .45; ctx.strokeStyle = '#3b5f8a'; ctx.lineWidth = 1.5; ctx.strokeRect(x0, yTop, x1 - x0, yBot - yTop); ctx.restore();
      }
      if (bKind === 'winkel' && t > .5) {
        const box = boxFor('winkel');
        ctx.save(); ctx.globalAlpha = (t - .5) * 2 * .55; ctx.strokeStyle = 'rgba(236,230,218,.3)'; ctx.lineWidth = 1.5; ctx.beginPath();
        let pen = false;
        const edge = [];
        for (let lo = -180; lo <= 180; lo += 4) edge.push([89.5, lo]);
        for (let la = 89.5; la >= -89.5; la -= 3) edge.push([la, 180]);
        for (let lo = 180; lo >= -180; lo -= 4) edge.push([-89.5, lo]);
        for (let la = -89.5; la <= 89.5; la += 3) edge.push([la, -180]);
        for (const [la, lo] of edge) { const q = projFlat(la, lo, 'winkel', box); pen ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); pen = true; }
        ctx.closePath(); ctx.stroke(); ctx.restore();
      }
      if (bKind === 'goode' && t > .5) {
        const box = boxFor('goode');
        ctx.save(); ctx.globalAlpha = (t - .5) * 2;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          for (let la = -85; la <= 85; la += 3) { const q = projFlat(la, GO_B[i] + (i ? 0.01 : 0), 'goode', box); la > -85 ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }
          for (let la = 85; la >= -85; la -= 3) { const q = projFlat(la, GO_B[i + 1] - (i < 2 ? 0.01 : 0), 'goode', box); ctx.lineTo(q.x, q.y); }
          ctx.closePath(); ctx.fillStyle = 'rgba(236,230,218,.05)'; ctx.fill(); ctx.strokeStyle = 'rgba(236,230,218,.14)'; ctx.lineWidth = 1; ctx.stroke();
        }
        ctx.restore();
      }

      const splitGores = (bKind === 'gore' && t > .55) || (aKind === 'gore' && t < .45);
      const splitGoode = (bKind === 'goode' && t > .55) || (aKind === 'goode' && t < .45);
      const clipRect = sheet(bKind) && t > .7;
      if (clipRect) {
        const box = boxFor(bKind);
        let yTop, yBot, x0, x1;
        if (bKind === 'peters') {
          const p0 = projFlat(90, -180, bKind, box), p1 = projFlat(-90, 180, bKind, box);
          x0 = p0.x; yTop = p0.y; x1 = p1.x; yBot = p1.y;
        } else {
          yTop = projFlat(bKind === 'merc' ? 83 : 90, 0, bKind, box).y;
          yBot = projFlat(bKind === 'merc' ? -70 : -90, 0, bKind, box).y;
          x0 = projFlat(0, -180, bKind, box).x; x1 = projFlat(0, 180, bKind, box).x;
        }
        ctx.save(); ctx.beginPath(); ctx.rect(x0, yTop, x1 - x0, yBot - yTop); ctx.clip();
      }
      drawGrat(ctx, proj, wrap, .9, splitGoode);
      ctx.strokeStyle = 'rgba(236,230,218,.82)'; ctx.lineWidth = 1.35;
      drawCoastLL(ctx, proj, wrap, splitGores, splitGoode);
      if (clipRect) ctx.restore();

      S.text(SRC[k], 800, 198, 20, MUT, 'center', S.fade(now, 200, 500), 400);

      if (k === 7) {
        const ready = (fromK === k || aKind === 'merc') ? 0 : 900;
        const phase = ease(Math.max(0, Math.min(1, (age - ready - 200) / 3200)));
        ctx.beginPath();
        AFRICA.forEach((p, i) => { const q = proj(p[1], p[0]); i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); });
        ctx.closePath(); ctx.fillStyle = 'rgba(111,212,138,.20)'; ctx.fill(); ctx.strokeStyle = SEA; ctx.lineWidth = 2; ctx.stroke();
        ctx.save(); ctx.globalAlpha = Math.max(0, 1 - phase * 1.05);
        ctx.fillStyle = 'rgba(240,179,90,.28)'; ctx.strokeStyle = G; ctx.lineWidth = 1.5;
        for (const ln of QGL) { ctx.beginPath(); for (let i = 0; i < ln.length; i += 2) { const q = proj(ln[i + 1] / COAST.q, ln[i] / COAST.q); i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); } ctx.closePath(); ctx.fill(); ctx.stroke(); }
        if (phase < .2) S.text('Greenland · 0.84 million mi²', proj(GL_HOME[0], GL_HOME[1]).x, proj(GL_HOME[0], GL_HOME[1]).y - 24, 24, G, 'center', 1 - phase / .2);
        ctx.restore();
        ctx.fillStyle = 'rgba(240,179,90,.55)'; ctx.strokeStyle = G; ctx.lineWidth = 2;
        const c = [GL_HOME[0] + (GL_TARGET[0] - GL_HOME[0]) * phase, GL_HOME[1] + (GL_TARGET[1] - GL_HOME[1]) * phase];
        for (const ln of placeGL(c)) {
          ctx.beginPath(); let pen = false, prev = null;
          for (const [la, lo] of ln) { const q = proj(la, lo); if (q.z < -0.01) { pen = false; prev = null; continue; } if (prev && Math.abs(q.x - prev.x) > wrap) pen = false; pen ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); pen = true; prev = q; }
          ctx.closePath(); ctx.fill(); ctx.stroke();
        }
        const gq = proj(c[0], c[1]);
        if (phase > .08) S.text('Greenland, true size', gq.x - 80, gq.y - 8, 24, G, 'center', Math.min(1, (phase - .08) / .2));
        const af2 = proj(-15, 22);
        S.text('Africa · 11.7 million mi²', af2.x, af2.y, 24, SEA, 'center', S.fade(now, ready + 200, 500));
      }

      dealCard(ctx, S, k, S.fade(now, 250, 500));
      S.words(now, WORDS[k][0], WORDS[k][1]);
    });
    } finally { V3.steps = _steps; }

    const stage = el.querySelector('.stage');
    const bar = document.createElement('div');
    bar.className = 'mw-bar';
    const labels = ['Plate Carrée', 'Globe', 'Gores', 'Mercator', 'Gall–Peters', 'Goode', 'Winkel', 'Greenland'];
    labels.forEach((lab, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = lab; b.dataset.mw = String(i);
      b.addEventListener('click', ev => { ev.stopPropagation(); if (stepsApi) stepsApi.go(i); });
      bar.appendChild(b);
    });
    const replay = document.createElement('button');
    replay.type = 'button'; replay.className = 'mw-replay'; replay.id = 'mw-replay';
    replay.textContent = 'Replay the Greenland trap';
    replay.addEventListener('click', ev => { ev.stopPropagation(); if (stepsApi) stepsApi.go(7); });
    bar.appendChild(replay);
    stage.appendChild(bar);
    const syncChips = () => {
      if (el.classList.contains('active')) {
        const k = (stepsApi ? stepsApi.k : el._mwStep) || 0;
        bar.querySelectorAll('[data-mw]').forEach(b => b.classList.toggle('on', +b.dataset.mw === k));
      }
      requestAnimationFrame(syncChips);
    };
    requestAnimationFrame(syncChips);

    stage.addEventListener('pointerdown', ev => {
      if (!el.classList.contains('active') || el._mwKind !== 'globe') return;
      if (ev.target.closest && ev.target.closest('.mw-bar')) return;
      dragging = true; lastP = { x: ev.clientX, y: ev.clientY };
      ev.target.setPointerCapture && ev.target.setPointerCapture(ev.pointerId);
    });
    stage.addEventListener('pointermove', ev => {
      if (!dragging) return;
      const dx = ev.clientX - lastP.x, dy = ev.clientY - lastP.y; lastP = { x: ev.clientX, y: ev.clientY };
      cam.yaw += dx * 0.008; cam.pitch = Math.max(-1.1, Math.min(1.1, cam.pitch - dy * 0.008));
    });
    stage.addEventListener('pointerup', () => { dragging = false; });
    stage.addEventListener('pointercancel', () => { dragging = false; });
  }
};

/* ---------- Vector or raster. Ported from kimi1 "Two ways to record the world" / c-vecras,
   redrawn with a real Natural Earth coast instead of a bezier cartoon. ---------- */
NEW_SLIDES['Vector or raster'] = {
  h1: 'Vector or Raster', fig: '',
  init(el) {
    if (typeof COAST === 'undefined') return;
    const G = '#f0b35a', SKY = '#6fb3ff', MUT = '#9a9382', W = '#ece6da';
    const WORDS = [
      ['Two Ways to Record the World', 'The same coastline, held two ways. Vector on the left, raster on the right.'],
      ['Vector: Points, Lines, Polygons', 'Zoom in: the line stays sharp, because the file stores coordinates, not pixels.'],
      ['Raster: One Number per Cell', 'Zoom in: the coast turns into stairs. Each cell has one value, land or water.']
    ];
    // a window on the British Isles — a recognizable coast in a compact box
    const BOX = { lo0: -11, lo1: 3, la0: 49, la1: 60.5 };
    const ptsOf = ln => { const out = []; for (let i = 0; i < ln.length; i += 2) out.push([ln[i + 1] / COAST.q, ln[i] / COAST.q]); return out; };
    const inBox = (la, lo) => la >= BOX.la0 && la <= BOX.la1 && lo >= BOX.lo0 && lo <= BOX.lo1;
    const segs = [];
    for (const ln of COAST.lines) {
      const pts = ptsOf(ln); let cur = [];
      const flush = () => { if (cur.length > 2) segs.push(cur); cur = []; };
      for (const [la, lo] of pts) { if (inBox(la, lo)) cur.push([la, lo]); else flush(); }
      flush();
    }
    const toXY = (la, lo, x0, y0, w, h) => ({ x: x0 + (lo - BOX.lo0) / (BOX.lo1 - BOX.lo0) * w, y: y0 + (BOX.la1 - la) / (BOX.la1 - BOX.la0) * h });

    V3.scene(el, 3, (S, ctx, now) => {
      const k = S.step, a = S.fade(now, 0, 500);
      ctx.fillStyle = '#070b16'; ctx.fillRect(0, 0, 1600, 1000);
      const mid = 800, left = { x0: 70, y0: 200, w: 660, h: 620 }, right = { x0: 870, y0: 200, w: 660, h: 620 };
      ctx.strokeStyle = 'rgba(236,230,218,.2)'; ctx.setLineDash([2, 8]); ctx.beginPath(); ctx.moveTo(mid, 170); ctx.lineTo(mid, 860); ctx.stroke(); ctx.setLineDash([]);
      S.text('VECTOR', 400, 175, 28, W, 'center', a, 600);
      S.text('RASTER', 1200, 175, 28, W, 'center', a, 600);

      // vector pane
      ctx.save();
      ctx.beginPath(); ctx.rect(left.x0, left.y0, left.w, left.h); ctx.clip();
      ctx.fillStyle = '#0c1220'; ctx.fillRect(left.x0, left.y0, left.w, left.h);
      const zoom = k === 1 ? 2.15 : 1, zx = k === 1 ? -8.2 : 0, zy = k === 1 ? 51.5 : 0;
      const vx = (la, lo) => {
        if (k !== 1) return toXY(la, lo, left.x0, left.y0, left.w, left.h);
        const c = toXY(zy || 51.5, zx || -8.2, left.x0, left.y0, left.w, left.h);
        const p = toXY(la, lo, left.x0, left.y0, left.w, left.h);
        return { x: c.x + (p.x - c.x) * zoom, y: c.y + (p.y - c.y) * zoom };
      };
      ctx.strokeStyle = G; ctx.lineWidth = k === 1 ? 2.4 : 1.8; ctx.beginPath();
      for (const seg of segs) { seg.forEach((p, i) => { const q = vx(p[0], p[1]); i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }); }
      ctx.stroke();
      if (k === 1) {
        ctx.fillStyle = SKY;
        for (const seg of segs) for (const p of seg) { const q = vx(p[0], p[1]); if (q.x < left.x0 || q.x > left.x0 + left.w) continue; ctx.beginPath(); ctx.arc(q.x, q.y, 2.6, 0, 7); ctx.fill(); }
      }
      ctx.restore();
      ctx.strokeStyle = 'rgba(236,230,218,.25)'; ctx.lineWidth = 1; ctx.strokeRect(left.x0, left.y0, left.w, left.h);
      S.text(k === 1 ? 'coordinates, infinitely sharp' : 'points, lines, polygons', 400, 845, 22, MUT, 'center', a);

      // raster pane
      ctx.save();
      ctx.beginPath(); ctx.rect(right.x0, right.y0, right.w, right.h); ctx.clip();
      ctx.fillStyle = '#0c1220'; ctx.fillRect(right.x0, right.y0, right.w, right.h);
      const cols = k === 2 ? 18 : 36, rows = k === 2 ? 17 : 34;
      const cw = right.w / cols, rh = right.h / rows;
      // paint a cell land if any coast segment crosses it or it sits "inside" east of a typical west-coast — simpler: land if closer to interior sample, or if the cell center is east of the nearest coast in that row? Use point-in: sample whether center is "land" by winding around Britain is hard.
      // Practical: a cell is land if it contains a coast point OR if a west-to-east ray from the left of the box crosses an odd number of coast segments (even-odd fill of the clipped lines, not polygons).
      // Even simpler and true enough for teaching: color a cell land if a coast vertex falls in it or in a slightly dilated box, then flood from a known inland seed (52.5 N, 1.5 W is inland England).
      const coast = new Array(rows * cols).fill(0);
      const colOf = lo => Math.max(0, Math.min(cols - 1, Math.floor((lo - BOX.lo0) / (BOX.lo1 - BOX.lo0) * cols)));
      const rowOf = la => Math.max(0, Math.min(rows - 1, Math.floor((BOX.la1 - la) / (BOX.la1 - BOX.la0) * rows)));
      for (const seg of segs) for (const [la, lo] of seg) coast[rowOf(la) * cols + colOf(lo)] = 1;
      // flood the ocean from the box edges; leftover cells are inland
      const water = new Array(rows * cols).fill(0);
      const q = [];
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        if ((r === 0 || c === 0 || r === rows - 1 || c === cols - 1) && !coast[r * cols + c]) { water[r * cols + c] = 1; q.push([r, c]); }
      }
      while (q.length) {
        const [r, c] = q.pop();
        for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const rr = r + dr, cc = c + dc, i = rr * cols + cc;
          if (rr < 0 || cc < 0 || rr >= rows || cc >= cols) continue;
          if (!water[i] && !coast[i]) { water[i] = 1; q.push([rr, cc]); }
        }
      }
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const on = !water[r * cols + c];
        ctx.fillStyle = on ? 'rgba(240,179,90,.78)' : 'rgba(111,179,255,.22)';
        ctx.fillRect(right.x0 + c * cw, right.y0 + r * rh, cw - 1, rh - 1);
      }
      ctx.restore();
      ctx.strokeStyle = 'rgba(236,230,218,.25)'; ctx.lineWidth = 1; ctx.strokeRect(right.x0, right.y0, right.w, right.h);
      S.text(k === 2 ? 'one number per cell — the stairs show' : 'one number per cell', 1200, 845, 22, MUT, 'center', a);

      S.words(now, WORDS[k][0], WORDS[k][1]);
    });
  }
};

/* ---------- The nautical mile. Ported from faria class beats_appx.js (nmile / nmile2),
   taught visually: 1° = 60′, 1′ of latitude = 1 nm = 1,852 m, and longitude miles shrink. ---------- */
NEW_SLIDES['The nautical mile'] = {
  h1: 'The Nautical Mile', fig: '',
  init(el) {
    const G = '#f0b35a', W = '#ece6da', MUT = '#9a9382', B = '#6fb3ff';
    const WORDS = [
      ['A Degree Is 60 Minutes', 'One degree of latitude is 60 arcminutes, anywhere on Earth.'],
      ['1′ of Latitude = 1 Nautical Mile', 'Fixed at 1,852 meters — about 6,076 feet. On a chart, the latitude scale is a mileage scale.'],
      ['Longitude Miles Shrink', 'A degree of longitude is 60 nautical miles only at the equator, and shrinks to nothing at the poles.']
    ];
    const cam = { yaw: 30 * DEG, pitch: 18 * DEG, R: 340, cx: 520, cy: 520 };
    V3.scene(el, 3, (S, ctx, now) => {
      const k = S.step, a = S.fade(now, 0, 500);
      ctx.fillStyle = '#070b16'; ctx.fillRect(0, 0, 1600, 1000);
      S.stars(now, .4);

      // left: a meridian scale
      const x = 280, y0 = 200, y1 = 820, H = y1 - y0;
      ctx.strokeStyle = W; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke();
      // 0° to 1° as the full scale on beat 0; zoom toward one minute on later beats
      const topLa = k === 0 ? 1 : (k === 1 ? 1 / 60 * 8 : 1);
      const labelEvery = k === 1 ? 1 : 10;
      const Y = la => y1 - (la / topLa) * H;
      if (k < 2) {
        ctx.strokeStyle = MUT; ctx.lineWidth = 1.5;
        const ticks = k === 0 ? 60 : 8;
        for (let i = 0; i <= ticks; i++) {
          const la = (i / ticks) * topLa, y = Y(la), long = (k === 0 && i % 10 === 0) || (k === 1 && i === 1) || i === 0 || i === ticks;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (long ? 28 : 12), y); ctx.stroke();
        }
        if (k === 0) {
          S.text('1°', x - 40, Y(1), 28, G, 'right', a);
          S.text('0°', x - 40, Y(0), 28, W, 'right', a);
          S.text('60′', x + 50, Y(1) + 4, 26, G, 'left', a);
          // bracket
          ctx.strokeStyle = G; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 90, Y(1)); ctx.lineTo(x + 110, Y(1)); ctx.lineTo(x + 110, Y(0)); ctx.lineTo(x + 90, Y(0)); ctx.stroke();
          S.text('60 nautical miles', x + 130, (Y(1) + Y(0)) / 2, 24, G, 'left', a);
        } else {
          S.text('1′', x - 40, Y(1 / 60), 28, G, 'right', a);
          S.text('0′', x - 40, Y(0), 28, W, 'right', a);
          ctx.strokeStyle = G; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 36, Y(1 / 60)); ctx.lineTo(x + 36, Y(0)); ctx.stroke();
          S.text('1 nautical mile', x + 56, (Y(1 / 60) + Y(0)) / 2 - 16, 26, G, 'left', a);
          S.text('1,852 m  ·  about 6,076 ft', x + 56, (Y(1 / 60) + Y(0)) / 2 + 18, 22, MUT, 'left', a);
        }
      }

      if (k === 2 && typeof ll === 'function' && typeof rot === 'function') {
        const proj = p => { const q = rot(p, cam.yaw, cam.pitch); return { x: cam.cx + q[0] * cam.R, y: cam.cy - q[1] * cam.R, z: q[2] }; };
        const { cx, cy, R } = cam;
        const g = ctx.createRadialGradient(cx - R * .35, cy - R * .35, R * .05, cx, cy, R);
        g.addColorStop(0, '#2f5a8c'); g.addColorStop(.7, '#15294a'); g.addColorStop(1, '#0b1526');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
        if (typeof drawCoast === 'function') drawCoast(ctx, proj, 1, { color: 'rgba(236,230,218,.8)' });
        const arc = (lo0, lo1, la, col, wd) => {
          ctx.strokeStyle = col; ctx.lineWidth = wd; ctx.beginPath(); let pen = false;
          for (let i = 0; i <= 40; i++) { const q = proj(ll(la, lo0 + (lo1 - lo0) * i / 40)); if (q.z >= 0) { pen ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); pen = true; } else pen = false; }
          ctx.stroke();
        };
        arc(-20, -19, 0, G, 5); arc(-20, -19, 60, B, 5);
        const e = proj(ll(0, -19.5)), p = proj(ll(60, -19.5));
        if (e.z > 0) S.text('1° at the equator · 60 nm', e.x + 16, e.y + 8, 22, G, 'left', a);
        if (p.z > 0) S.text('1° at 60° N · about 30 nm', p.x + 16, p.y - 6, 22, B, 'left', a);
        S.text('Latitude miles stay the same. Longitude miles shrink toward the poles.', 800, 155, 28, MUT, 'center', a);
      } else if (k < 2 && typeof ll === 'function' && typeof rot === 'function') {
        // a quiet globe on the right for context
        const C = { yaw: 10 * DEG, pitch: 20 * DEG, R: 260, cx: 1180, cy: 500 };
        const proj = p => { const q = rot(p, C.yaw, C.pitch); return { x: C.cx + q[0] * C.R, y: C.cy - q[1] * C.R, z: q[2] }; };
        const g = ctx.createRadialGradient(C.cx - C.R * .35, C.cy - C.R * .35, C.R * .05, C.cx, C.cy, C.R);
        g.addColorStop(0, '#2f5a8c'); g.addColorStop(.7, '#15294a'); g.addColorStop(1, '#0b1526');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(C.cx, C.cy, C.R, 0, 7); ctx.fill();
        if (typeof drawCoast === 'function') drawCoast(ctx, proj, 1, { color: 'rgba(236,230,218,.75)' });
        // one degree of latitude highlighted near 45N
        ctx.strokeStyle = G; ctx.lineWidth = 4; ctx.beginPath(); let pen = false;
        for (let la = 45; la <= 46; la += .1) { const q = proj(ll(la, -30)); if (q.z >= 0) { pen ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); pen = true; } else pen = false; }
        ctx.stroke();
        S.text(k === 0 ? '1° of latitude' : '1′ of latitude', 1180, 800, 22, G, 'center', a);
      }

      S.words(now, WORDS[k][0], WORDS[k][1]);
    });
  }
};

/* ---------- The decision brief. Compact 3-beat port from kimi1, self-contained
   (no shelter-form dependency): the choice, the next check, the expiry. ---------- */
NEW_SLIDES['The decision brief'] = {
  h1: 'The Decision Brief', fig: '',
  init(el) {
    const G = '#f0b35a', W = '#ece6da', MUT = '#9a9382', INK = '#ece6da';
    const WORDS = [
      ['The Choice', 'A useful brief starts with a decision, not a map.'],
      ['The Next Check', 'Say what you will look at next, and when.'],
      ['The Expiry', 'A map that cannot say when it expires is not ready for a decision.']
    ];
    const BLOCKS = [
      { k: 'The choice', big: 'Open Lincoln High gym as a shelter.', sub: 'Dry floor, a generator, 200 cots, on high ground, and a clear road in from the west.' },
      { k: 'The next check', big: 'Roads and river at 6:00 PM.', sub: 'If the river is still rising, move the overflow to the civic center. If the west road floods, use the county highway.' },
      { k: 'The expiry', big: 'Valid until 10:00 PM, or the next official forecast.', sub: 'Whichever comes first. After that, decide again with a fresh picture. Do not let last hour’s map run the next hour’s work.' }
    ];
    V3.scene(el, 3, (S, ctx, now) => {
      const k = S.step, a = S.fade(now, 0, 500);
      ctx.fillStyle = '#070b16'; ctx.fillRect(0, 0, 1600, 1000);
      // paper
      const x = 160, y = 170, w = 1280, h = 640;
      ctx.fillStyle = '#121a2c'; ctx.strokeStyle = 'rgba(240,179,90,.45)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(x, y, w, h, 16); ctx.fill(); ctx.stroke();
      S.text('Shelter decision brief', x + 48, y + 48, 26, MUT, 'left', a, 400);
      S.text('Lincoln County · example only', x + w - 48, y + 48, 22, MUT, 'right', a);

      let yy = y + 110;
      for (let i = 0; i <= k; i++) {
        const b = BLOCKS[i], fa = i === k ? a : 1;
        ctx.fillStyle = 'rgba(240,179,90,.85)'; ctx.fillRect(x + 48, yy - 8, 36, 3);
        S.text(b.k, x + 96, yy - 6, 22, G, 'left', fa, 600);
        S.text(b.big, x + 48, yy + 40, 36, INK, 'left', fa, 500);
        yy = v3Wrap(ctx, b.sub, x + 48, yy + 86, 26, MUT, 'left', fa, w - 100) + 28;
      }
      if (k === 2) {
        v3Wrap(ctx, 'Choice · check · expiry. In a real operation this still needs authoritative data, local procedures, and an independent look.', x + 48, y + h - 50, 22, W, 'left', a, w - 100);
      }
      S.words(now, WORDS[k][0], WORDS[k][1]);
    });
  }
};

/* ---------- France got smaller. Port of faria v2 beat 51 (read-only source),
   using the same schematic already in v3 Picard ch. 5: old outline slides east
   onto the 1693 survey. COAST_FR is real Natural Earth coast. ---------- */
NEW_SLIDES['France got smaller'] = {
  h1: 'France Got Smaller', fig: '',
  init(el) {
    if (typeof COAST_FR === 'undefined') return;
    const G = '#f0b35a', W = '#ece6da', MUT = '#9a9382';
    const WORDS = [
      ['France Remeasured', 'From 1679, Picard and La Hire timed Io along the coasts.'],
      ['Brittany Slides East', 'About a degree and a half at Brest. France got smaller.'],
      ['As the Story Goes', 'Louis XIV is said to have complained his astronomers took more than any enemy.']
    ];
    const carte = new Image(); carte.src = '/faria1/where-am-i/v2/img/carte2.jpg';
    V3.scene(el, 3, (S, ctx, now) => {
      const k = S.step, age = S.age(now), a = S.fade(now, 0, 500);
      ctx.fillStyle = '#070b16'; ctx.fillRect(0, 0, 1600, 1000);
      const slide = k === 0 ? 0 : (k === 1 ? S.ease(Math.min(1, Math.max(0, age - 200) / 2800)) : 1);
      const lat0 = 46.6, lon0 = 2.4, sc = 72;
      const P = (la, lo) => ({ x: (k === 0 ? 1020 : 800) + (lo - lon0) * Math.cos(lat0 * DEG) * sc, y: 520 - (la - lat0) * sc });
      const old = (la, lo) => { const west = Math.max(0, (2.35 - lo) / (2.35 + 4.5)), south = Math.max(0, (45 - la) / 3); return [la - 0.5 * south * (1 - slide), lo - 1.5 * west * (1 - slide)]; };
      const draw = (fn, col, wd, dash) => {
        ctx.strokeStyle = col; ctx.lineWidth = wd; ctx.setLineDash(dash || []); ctx.beginPath();
        for (const ln of COAST_FR.lines) {
          let pen = false;
          for (let i = 0; i < ln.length; i += 2) {
            const la = ln[i + 1] / 100, lo = ln[i] / 100, [A, B] = fn(la, lo), q = P(A, B);
            if (q.x < (k === 0 ? 560 : 80) || q.x > 1580 || q.y < 120 || q.y > 860) { pen = false; continue; }
            pen ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); pen = true;
          }
        }
        ctx.stroke(); ctx.setLineDash([]);
      };
      // gold = measured 1693 coast; gray = sliding old outline
      draw((la, lo) => [la, lo], 'rgba(240,179,90,.95)', 2.4);
      draw(old, slide < 1 ? 'rgba(236,230,218,.7)' : 'rgba(236,230,218,.3)', 1.8);
      if (slide >= 1) draw((la, lo) => { const west = Math.max(0, (2.35 - lo) / (2.35 + 4.5)), south = Math.max(0, (45 - la) / 3); return [la - 0.5 * south, lo - 1.5 * west]; }, 'rgba(236,230,218,.35)', 1.2, [4, 6]);
      const pm = P(51.2, 2.34), pm2 = P(42.3, 2.34);
      ctx.setLineDash([3, 8]); ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.beginPath(); ctx.moveTo(pm.x, pm.y); ctx.lineTo(pm2.x, pm2.y); ctx.stroke(); ctx.setLineDash([]);
      [['Paris', 48.86, 2.35], ['Brest', 48.39, -4.49], ['Marseille', 43.3, 5.37]].forEach(([n, la, lo]) => {
        const q = P(la, lo); ctx.fillStyle = G; ctx.beginPath(); ctx.arc(q.x, q.y, 5, 0, 7); ctx.fill();
        S.text(n, q.x + 10, q.y - 4, 22, W, 'left', a);
        if (n === 'Brest' && slide < .97) {
          const [A, B] = old(la, lo), qo = P(A, B);
          ctx.fillStyle = 'rgba(236,230,218,.7)'; ctx.beginPath(); ctx.arc(qo.x, qo.y, 5, 0, 7); ctx.fill();
          ctx.strokeStyle = '#ff7d6f'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(qo.x, qo.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          S.text(`Brest moves ${(1.5 * (1 - slide)).toFixed(1)}° east`, qo.x - 10, qo.y + 28, 22, '#ff7d6f', 'left', a);
        }
      });
      S.text(slide < 1 ? 'gray: the old outline  ·  gold: the 1693 survey' : 'gold: the 1693 survey  ·  dashed: where the old maps had the coast', k === 0 ? 1100 : 800, 155, 22, MUT, 'center', a);
      if (k === 0 && carte.complete && carte.naturalWidth) {
        const h = 420, s = h / carte.naturalHeight, w = carte.naturalWidth * s;
        ctx.drawImage(carte, 40, 200, w, h);
        S.text('Carte de France corrigée, 1693', 40 + w / 2, 200 + h + 24, 18, MUT, 'center', a);
      }
      if (k === 2) {
        v3Wrap(ctx, '“His Majesty’s astronomers have taken more of France than his enemies ever did.”', 800, 820, 28, G, 'center', a, 1400);
        S.text('Attributed — the sentiment is recorded; the exact words are not.', 800, 870, 20, MUT, 'center', a);
      }
      S.text('Old-map distortion is schematic (Brest ~1.5° too far west). The gold coast is real data.', 800, 980, 16, MUT, 'center', .85);
      S.words(now, WORDS[k][0], WORDS[k][1]);
    });
  }
};

/* ---------- GPS zero is 102 m east. Port of faria v2 beat 73 / v1 gpszero.
   Scale diagram after Malys et al., Journal of Geodesy, 2015. ---------- */
NEW_SLIDES['GPS zero is 102 m east'] = {
  h1: 'GPS Zero Is 102 m East', fig: '',
  init(el) {
    const G = '#f0b35a', W = '#ece6da', MUT = '#9a9382';
    const WORDS = [
      ['Stand on the Line', 'With your phone, and it will not say zero.'],
      ['GPS Zero Is 102 m East', 'A little longer than a football field.'],
      ['Two Good Answers', 'Local gravity set the old line. GPS measures from the Earth’s centre.']
    ];
    const photo = new Image(); photo.src = 'img/gallery/prime-meridian.jpg';
    const field = (ctx, x0, y0, scale, a) => {
      // 8 px ≈ 1 m at this layout when scale=6.2 was used at 1080; here 1 m = 7 px
      const M = 7, X = m => x0 + m * M, fy = y0 + 130, fh = 90, yd = .9144;
      ctx.save(); ctx.globalAlpha *= a;
      ctx.strokeStyle = W; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(X(0), y0); ctx.lineTo(X(0), y0 + 230); ctx.stroke();
      ctx.strokeStyle = G; ctx.beginPath(); ctx.moveTo(X(102), y0); ctx.lineTo(X(102), y0 + 230); ctx.stroke();
      ctx.restore();
      Stext(ctx, 'BRASS LINE · AIRY, 1851', X(0), y0 - 18, 18, W, 'center', a);
      Stext(ctx, 'GPS ZERO · WGS 84', X(102), y0 - 18, 18, G, 'center', a);
      ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = G; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(X(0), y0 + 50); ctx.lineTo(X(102), y0 + 50); ctx.stroke(); ctx.restore();
      Stext(ctx, '102 m  ·  335 ft', X(51), y0 + 36, 36, G, 'center', a);
      ctx.save(); ctx.globalAlpha *= a;
      ctx.fillStyle = 'rgba(110,150,95,.18)'; ctx.strokeStyle = 'rgba(232,228,220,.5)'; ctx.lineWidth = 1;
      ctx.fillRect(X(0), fy, 100 * yd * M, fh); ctx.strokeRect(X(0), fy, 100 * yd * M, fh);
      for (let i = 1; i < 10; i++) { ctx.beginPath(); ctx.moveTo(X(i * 10 * yd), fy); ctx.lineTo(X(i * 10 * yd), fy + fh); ctx.stroke(); }
      ctx.restore();
      Stext(ctx, 'a football field, 100 yards (91 m), to the same scale', X(0), fy + fh + 28, 20, MUT, 'left', a);
    };
    const Stext = (ctx, s, x, y, px, col, align, alpha) => {
      if (alpha <= 0) return; ctx.save(); ctx.globalAlpha *= alpha; ctx.font = `400 ${px}px Georgia,serif`;
      ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.lineWidth = 6;
      ctx.strokeStyle = 'rgba(6,9,18,.85)'; ctx.strokeText(s, x, y); ctx.fillStyle = col; ctx.fillText(s, x, y); ctx.restore();
    };
    V3.scene(el, 3, (S, ctx, now) => {
      const k = S.step, a = S.fade(now, 0, 500);
      ctx.fillStyle = '#070b16'; ctx.fillRect(0, 0, 1600, 1000);
      if (k === 0) {
        if (photo.complete && photo.naturalWidth) {
          const s = Math.min(1600 / photo.naturalWidth, 820 / photo.naturalHeight), w = photo.naturalWidth * s, h = photo.naturalHeight * s;
          ctx.drawImage(photo, 800 - w / 2, 140, w, h);
        }
        S.text('The prime meridian at Greenwich, 2011', 800, 980, 18, MUT, 'center', .8);
      } else {
        field(ctx, 360, 280, 7, a);
        S.text('Malys et al., “Why the Greenwich meridian moved,” Journal of Geodesy, 2015.', 800, 980, 18, MUT, 'center', .85);
        if (k === 2) {
          v3Wrap(ctx, 'The old line followed local gravity, which tilts slightly at Greenwich. GPS measures from the Earth’s centre. Nobody moved anything.', 800, 200, 26, W, 'center', a, 1320);
        }
      }
      S.words(now, WORDS[k][0], WORDS[k][1]);
    });
  }
};

/* ---------- Four satellites, one spot. Port of faria v2 beat 82 (rings over
   Fort Myers), with “A nanosecond is a foot” (faria v3 beat 55) as the last beat. ---------- */
NEW_SLIDES['Four satellites, one spot'] = {
  h1: 'Four Satellites, One Spot', fig: '',
  init(el) {
    const G = '#f0b35a', W = '#ece6da', MUT = '#9a9382', RED = '#ff7d6f', B = '#6fb3ff';
    const WORDS = [
      ['One Satellite, One Ring', 'The signal takes about 0.07 seconds. At the speed of light, that is about 21,000 km. You are on this ring.'],
      ['Two Rings Cross Twice', 'A second satellite gives a second ring. They meet in two places.'],
      ['A Third Picks One', 'That’s your spot. Fort Myers.'],
      ['A Cheap Clock: 300 km Off', 'One thousandth of a second wrong, and every distance is off by 300 km. The rings miss.'],
      ['Four Satellites: One Spot, and the Time', 'The fourth solves the clock. Three for where, one for when.'],
      ['A Nanosecond Is a Foot', 'Light travels about 30 cm, about one foot, in a billionth of a second.']
    ];
    const FM = [26.6406, -81.8723];
    // local map window: Gulf and Florida
    const BOX = { lo0: -90, lo1: -76, la0: 23.5, la1: 32 };
    const toXY = (la, lo) => ({ x: 120 + (lo - BOX.lo0) / (BOX.lo1 - BOX.lo0) * 1360, y: 160 + (BOX.la1 - la) / (BOX.la1 - BOX.la0) * 680 });
    const fm = toXY(FM[0], FM[1]);
    // sub-satellite points (schematic), radii so each circle passes through Fort Myers
    const SAT = [
      [29.8, -86.4],
      [29.2, -77.6],
      [23.9, -81.2],
      [26.2, -87.6]
    ].map(([la, lo]) => {
      const c = toXY(la, lo); return { c, r: Math.hypot(fm.x - c.x, fm.y - c.y), la, lo };
    });
    const km2px = (toXY(FM[0], FM[1]).x - toXY(FM[0], FM[1] - 1).x) / 60; // ~1° lon at 26N is ~60 nm? wait 1° lat ~69 mi; use 1° lat
    const pxPerKm = Math.abs(toXY(FM[0] + 1, FM[1]).y - toXY(FM[0], FM[1]).y) / 111;
    V3.scene(el, 6, (S, ctx, now) => {
      const k = S.step, age = S.age(now), a = S.fade(now, 0, 500);
      ctx.fillStyle = '#070b16'; ctx.fillRect(0, 0, 1600, 1000);
      if (k === 5) {
        S.text('GPS is still just clocks', 800, 220, 28, MUT, 'center', a);
        S.text('A nanosecond is a foot', 800, 360, 72, G, 'center', a, 500);
        v3Wrap(ctx, 'Light travels about 30 centimetres, about one foot, in a billionth of a second. A clock error of one nanosecond is a foot of error on the ground.', 800, 500, 32, W, 'center', a, 1300);
        v3Wrap(ctx, 'Harrison fought for seconds. GPS fights for billionths. Four satellites: three for where, one for when.', 800, 640, 28, MUT, 'center', a, 1300);
        S.words(now, '', WORDS[k][1]);
        return;
      }
      S.stars(now, .25);
      // coast in the window
      const coastSet = (typeof COAST_HI !== 'undefined') ? COAST_HI : COAST;
      if (typeof coastSet !== 'undefined') {
        ctx.strokeStyle = 'rgba(236,230,218,.8)'; ctx.lineWidth = 1.5; ctx.beginPath();
        for (const ln of coastSet.lines) {
          let pen = false;
          for (let i = 0; i < ln.length; i += 2) {
            const lo = ln[i] / coastSet.q, la = ln[i + 1] / coastSet.q;
            if (la < BOX.la0 - .4 || la > BOX.la1 + .4 || lo < BOX.lo0 - .4 || lo > BOX.lo1 + .4) { pen = false; continue; }
            const q = toXY(la, lo);
            if (q.x < 80 || q.x > 1540 || q.y < 140 || q.y > 860) { pen = false; continue; }
            pen ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); pen = true;
          }
        }
        ctx.stroke();
      }
      const err = k === 3 ? 300 * pxPerKm : (k === 4 ? 300 * pxPerKm * (1 - S.ease(Math.min(1, age / 1600))) : 0);
      const n = k === 0 ? 1 : k === 1 ? 2 : k >= 2 ? (k >= 4 ? 4 : 3) : 1;
      for (let i = 0; i < n; i++) {
        const grow = k === i ? Math.min(1, age / 900) : 1;
        const r = Math.max(0.5, (SAT[i].r + err) * grow);
        ctx.strokeStyle = (k === 3 ? RED : G); ctx.lineWidth = 2.4; ctx.globalAlpha = .9;
        ctx.beginPath(); ctx.arc(SAT[i].c.x, SAT[i].c.y, r, 0, 7); ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.fillStyle = k === 3 ? RED : G; ctx.beginPath(); ctx.arc(SAT[i].c.x, SAT[i].c.y, 4, 0, 7); ctx.fill();
      }
      ctx.fillStyle = G; ctx.beginPath(); ctx.arc(fm.x, fm.y, k >= 2 && k !== 3 ? 8 : 5, 0, 7); ctx.fill();
      if (k !== 3) S.text('Fort Myers', fm.x + 14, fm.y - 10, 24, G, 'left', a);
      else S.text('Rings miss by ~300 km', fm.x + 14, fm.y - 10, 24, RED, 'left', a);
      if (k === 4 && age > 1600) S.text('The rings snap together', 800, 200, 26, G, 'center', S.fade(now, 1600, 400));
      S.words(now, WORDS[k][0], WORDS[k][1]);
    });
  }
};

/* ---------- Mountains on the Moon. Port of claude1 “Moon mountains”
   (Sidereus Nuncius, 1610): the terminator triangle and the 2,100-mile
   “How wide is the Moon?” card. The original HTML scene is retitled so
   this native appendix port is the one course.js finds. ---------- */
NEW_SLIDES['Moon mountains'] = {
  h1: 'How Tall Is a Mountain on the Moon?', fig: '',
  init(el) {
    const G = '#f0b35a', W = '#ece6da', MUT = '#9a9382', SEA = '#6fd48a';
    const WORDS = [
      ['Lit Peaks Past the Terminator', 'Mountain tops, still in sunlight, while the ground below is dark.'],
      ['A Triangle, a Height', 'd past the line, R the radius, R + h the hypotenuse. Galileo: more than four miles.'],
      ['A Modern Diameter', 'The same 1/20, on a 2,159-mile Moon: h ≥ 5.4 miles.'],
      ['How Wide Is the Moon?', 'Distance first, width second. 2,100 miles, laid on the United States.']
    ];
    const moonImg = new Image(); moonImg.src = 'img/moon-first-quarter.jpg';
    const st = { dPct: 5, D: 2000 }; // Galileo’s numbers: 1/20 of a 2,000-mile Moon
    const calc = () => { const D = st.D, R = D / 2, d = D * (st.dPct / 100); return { D, R, d, h: Math.hypot(R, d) - R }; };
    const fx = (n, p) => n.toLocaleString('en-US', { maximumFractionDigits: p, minimumFractionDigits: p });
    const fi = n => Math.round(n).toLocaleString('en-US');
    const toVirt = (ev, cv) => {
      const r = cv.getBoundingClientRect(), k = Math.min(r.width / 1600, r.height / 1000);
      return { x: (ev.clientX - (r.left + (r.width - 1600 * k) / 2)) / k, y: (ev.clientY - (r.top + (r.height - 1000 * k) / 2)) / k };
    };

    const usMapSVG = () => {
      if (typeof STATES_US === 'undefined') return '';
      const WW = 640, H = 380, lat0 = 39, lon0 = -96, sc = WW / 60;
      const X = lo => WW / 2 + (lo - lon0) * Math.cos(lat0 * DEG) * sc, Y = la => H / 2 - (la - lat0) * sc;
      let paths = '';
      for (const ln of STATES_US.lines) {
        let d = '';
        for (let i = 0; i < ln.length; i += 2) {
          const x = X(ln[i] / STATES_US.q), y = Y(ln[i + 1] / STATES_US.q);
          if (x < -20 || x > WW + 20 || y < -20 || y > H + 20) { d += '|'; continue; }
          d += (d === '' || d.endsWith('|') ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1);
        }
        paths += `<path d="${d.replace(/\|/g, ' ')}" fill="none" stroke="rgba(236,230,218,.45)" stroke-width="1"/>`;
      }
      const cxm = X(-88), cym = Y(39.5), r = 1050 / 69 * sc;
      const city = (n, la, lo) => `<circle cx="${X(lo)}" cy="${Y(la)}" r="3.5" fill="#f0b35a"/><text x="${X(lo) + 6}" y="${Y(la) - 5}" fill="#f0b35a" font-size="13" font-family="Georgia,serif">${n}</text>`;
      return `<svg viewBox="0 0 ${WW} ${H}" role="img" aria-label="A 2,100-mile circle, centered on Illinois, laid over the United States">${paths}<circle cx="${cxm}" cy="${cym}" r="${r}" fill="rgba(217,208,189,.12)" stroke="#d9d0bd" stroke-width="2"/>${city('Denver', 39.7, -105)}${city('Chicago', 41.9, -87.6)}${city('Boston', 42.4, -71.1)}${city('Miami', 25.8, -80.2)}<text x="${cxm}" y="${cym - r - 10}" fill="#d9d0bd" font-size="15" text-anchor="middle" font-family="Georgia,serif">the Moon, 2,100 miles across</text><text x="12" y="${H - 10}" fill="#9a9382" font-size="12" font-family="Georgia,serif">circle of 1,050-mile radius centered on Illinois · Boston just outside</text></svg>`;
    };

    const stage = el.querySelector('.stage');
    const card = document.createElement('div');
    card.className = 'card gloss mm-width';
    card.hidden = true;
    card.innerHTML = '<button class="x" type="button" aria-label="Close">×</button><h3>How Wide Is the Moon? Distance first, width second</h3><div class="g"></div><p></p>';
    card.querySelector('.x').onclick = () => { card.hidden = true; };
    const openWidth = () => {
      card.querySelector('.g').innerHTML = usMapSVG();
      card.querySelector('p').innerHTML = 'The Moon is about 240,000 miles away and covers half a degree of sky, 1/720 of a full circle. A circle of radius 240,000 miles is 2π × 240,000 = 1,508,000 miles around; one 720th of that is about 2,100 miles. Lay that on the United States and it reaches from Denver almost to Boston. Galileo’s four-mile mountain is a speck on it, which is the point: once you have one distance, the sizes follow.';
      card.hidden = false;
    };
    const closeWidth = () => { card.hidden = true; };

    const ctl = document.createElement('div');
    ctl.className = 'mm-ctl';
    ctl.innerHTML = `<label><span>Peak’s distance past the terminator <output class="mm-d-out">1/20 of the width</output></span><input class="mm-d" type="range" min="1" max="12" step="0.1" value="5"></label>
      <label><span>Assumed Moon diameter <output class="mm-D-out">2,000 miles</output></span><input class="mm-D" type="range" min="1500" max="2500" step="1" value="2000"></label>
      <div class="btns"><button type="button" class="mm-galileo">Galileo’s numbers</button><button type="button" class="mm-modern">Modern Moon · 2,159 mi</button><button type="button" class="mm-width-btn" id="mm-width-btn">How wide is the Moon?</button></div>`;
    const dIn = ctl.querySelector('.mm-d'), DIn = ctl.querySelector('.mm-D');
    const dOut = ctl.querySelector('.mm-d-out'), DOut = ctl.querySelector('.mm-D-out');
    const syncSliders = () => {
      dIn.value = st.dPct; DIn.value = st.D;
      dOut.textContent = `${fx(+dIn.value, 1)}% of the width${Math.abs(+dIn.value - 5) < .05 ? ' · 1/20' : ''}`;
      DOut.textContent = fi(st.D) + ' miles';
    };
    let lastBeat = -1, widthOpened = false;
    dIn.addEventListener('input', () => { st.dPct = +dIn.value; syncSliders(); });
    DIn.addEventListener('input', () => { st.D = +DIn.value; syncSliders(); });
    ctl.querySelector('.mm-galileo').onclick = () => { st.dPct = 5; st.D = 2000; syncSliders(); };
    ctl.querySelector('.mm-modern').onclick = () => { st.dPct = 5; st.D = 2159; syncSliders(); };
    ctl.querySelector('.mm-width-btn').onclick = ev => { ev.stopPropagation(); if (card.hidden) openWidth(); else closeWidth(); };

    V3.scene(el, 4, (S, ctx, now) => {
      const k = S.step, a = S.fade(now, 0, 500);
      if (k !== lastBeat) {
        lastBeat = k;
        if (k === 1) { st.D = 2000; st.dPct = 5; syncSliders(); }
        if (k === 2) { st.D = 2159; st.dPct = 5; syncSliders(); }
        if (k === 3) { openWidth(); widthOpened = true; }
        else if (widthOpened) { closeWidth(); widthOpened = false; }
      }
      ctl.style.visibility = k === 3 ? 'hidden' : 'visible';
      ctx.fillStyle = '#070b16'; ctx.fillRect(0, 0, 1600, 1000);
      S.stars(now, .35);
      const { R: Rm, d: dm, h: hm, D } = calc();
      const frac = st.dPct / 100;

      // LEFT · first-quarter Moon, terminator, a lit peak in the dark
      const cx = 455, cy = 490, R = 240;
      if (moonImg.complete && moonImg.naturalWidth) {
        const sc = R / 390;
        ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R * 1.01, 0, 7); ctx.clip();
        ctx.drawImage(moonImg, cx - 332 * sc, cy - 444 * sc, 900 * sc, 900 * sc);
        ctx.restore();
      } else {
        ctx.fillStyle = '#1c1a16'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
        ctx.fillStyle = '#bdb3a0'; ctx.beginPath(); ctx.arc(cx, cy, R, -Math.PI / 2, Math.PI / 2); ctx.fill();
      }
      ctx.strokeStyle = 'rgba(236,230,218,.25)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
      ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke(); ctx.setLineDash([]);
      S.text('the terminator', cx + 80, cy + R + 20, 16, MUT, 'center', a);
      S.text('Photo: Astrobond, 2019 · CC BY-SA 4.0', cx + 80, cy + R + 40, 14, '#6b655a', 'center', a);
      const px = cx - frac * 2 * R;
      ctx.strokeStyle = G; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(cx, cy - R * .65); ctx.lineTo(px, cy - R * .65); ctx.stroke();
      S.text('d', (cx + px) / 2, cy - R * .65 - 16, 22, G, 'center', a);
      const gl = ctx.createRadialGradient(px, cy, 0, px, cy, 16);
      gl.addColorStop(0, '#fff6dc'); gl.addColorStop(.3, G); gl.addColorStop(1, 'rgba(240,179,90,0)');
      ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(px, cy, 16, 0, 7); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px, cy, 3, 0, 7); ctx.fill();
      S.text('a lit peak in the dark · drag it', px, cy + 36, 18, G, 'center', a);
      S.text('What Galileo saw', cx, cy - R - 28, 20, MUT, 'center', a);
      S.text('Sun →', cx + R + 36, cy, 20, '#ffd66b', 'left', a);

      if (k < 3) {
        // RIGHT · side view from above the pole
        const sx = 1180, sy = 560, Rv = 230;
        const ang = Math.min(1.1, .58 * Math.sqrt(frac / .05));
        const T = { x: sx, y: sy - Rv }, O = { x: sx, y: sy };
        const hv = Rv / Math.cos(ang) - Rv;
        const Pk = { x: sx - (Rv + hv) * Math.sin(ang), y: sy - (Rv + hv) * Math.cos(ang) };
        const P0 = { x: sx - Rv * Math.sin(ang), y: sy - Rv * Math.cos(ang) };
        ctx.fillStyle = '#1c1a16'; ctx.beginPath(); ctx.arc(sx, sy, Rv, 0, 7); ctx.fill();
        ctx.fillStyle = '#8f877a'; ctx.beginPath(); ctx.arc(sx, sy, Rv, -Math.PI / 2, Math.PI / 2); ctx.fill();
        for (let y = sy - Rv - 60; y < sy + Rv; y += 28) {
          ctx.strokeStyle = 'rgba(255,214,107,.15)'; ctx.beginPath();
          ctx.moveTo(1600, y); ctx.lineTo(sx + Math.sqrt(Math.max(0, Rv * Rv - (y - sy) ** 2)), y); ctx.stroke();
        }
        ctx.strokeStyle = '#ffd66b'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(1600, T.y); ctx.lineTo(Pk.x, T.y); ctx.stroke();
        S.text('grazing sunlight', 1588, T.y - 14, 16, '#ffd66b', 'right', a);
        ctx.fillStyle = '#d9d0bd'; ctx.beginPath();
        const bw = .16;
        ctx.moveTo(sx - Rv * Math.sin(ang + bw), sy - Rv * Math.cos(ang + bw));
        ctx.lineTo(Pk.x, Pk.y);
        ctx.lineTo(sx - Rv * Math.sin(ang - bw), sy - Rv * Math.cos(ang - bw));
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(240,179,90,.15)'; ctx.beginPath(); ctx.moveTo(O.x, O.y); ctx.lineTo(T.x, T.y); ctx.lineTo(Pk.x, Pk.y); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(236,230,218,.7)'; ctx.lineWidth = 1; ctx.strokeRect(T.x - 10, T.y, 10, 10);
        const seg = (A, B, col, wd) => { ctx.strokeStyle = col; ctx.lineWidth = wd; ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke(); };
        seg(O, T, '#cfc8ba', 2); S.text(`R = ${fi(Rm)} mi`, (O.x + T.x) / 2 + 14, (O.y + T.y) / 2, 20, '#cfc8ba', 'left', a);
        seg(O, Pk, G, 2.4); S.text(`R + h = ${fx(Rm + hm, 1)} mi`, (O.x + Pk.x) / 2 - 10, (O.y + Pk.y) / 2 - 8, 20, G, 'right', a);
        seg(T, Pk, SEA, 2.4); S.text(`d = ${fi(dm)} mi`, (T.x + Pk.x) / 2, T.y - 16, 20, SEA, 'center', a);
        seg(P0, Pk, SEA, 3); S.text(`h = ${fx(hm, 1)} mi`, Pk.x - 20, (P0.y + Pk.y) / 2 + 4, 22, SEA, 'right', a);
        S.text('Side view from above the pole · height exaggerated so you can see it', sx, sy + Rv + 28, 16, MUT, 'center', a);
        S.text('(R + h)² = R² + d²', sx, 200, 28, W, 'center', a);
        S.text(`h = √(${fi(Rm)}² + ${fi(dm)}²) − ${fi(Rm)} = ${fx(hm, 1)} mi`, sx, 236, 20, G, 'center', a);
        if (k >= 1) S.text(k === 1 ? 'Galileo, 1610: more than four miles' : `h ≥ ${fx(hm, 1)} miles`, sx, 278, 32, G, 'center', a);
      }

      S.words(now, WORDS[k][0], WORDS[k][1]);
    });

    stage.appendChild(ctl);
    stage.appendChild(card);
    syncSliders();

    const cv = [...stage.querySelectorAll('canvas')].pop();
    let dragging = false;
    const hitPeak = ev => {
      if (!cv || !el.classList.contains('active') || !card.hidden) return false;
      const p = toVirt(ev, cv), cx = 455, cy = 490, R = 240;
      return Math.abs(p.y - cy) <= R * 1.25 && p.x <= cx + R * .25 && p.x >= cx - R * 1.4;
    };
    const movePeak = ev => {
      const p = toVirt(ev, cv), cx = 455, R = 240;
      st.dPct = Math.max(1, Math.min(12, (cx - p.x) / (2 * R) * 100));
      syncSliders();
    };
    if (cv) {
      cv.addEventListener('pointerdown', ev => { if (!hitPeak(ev)) return; dragging = true; movePeak(ev); ev.target.setPointerCapture && ev.target.setPointerCapture(ev.pointerId); ev.preventDefault(); });
      cv.addEventListener('pointermove', ev => { if (dragging) movePeak(ev); });
      cv.addEventListener('pointerup', () => { dragging = false; });
      cv.addEventListener('pointercancel', () => { dragging = false; });
    }
  }
};
