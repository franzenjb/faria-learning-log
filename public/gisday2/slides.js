// GIS Day 2026, told on the Claude globe. Order and notes follow public/gisday.
const { TAU, DEG, INK, GOLD, RED, SKY, OK, MUTED, fmt, text, tag, drawStars, ll, fly, stepAnim, camFor, arcLine, pin, freshCam, paintGlobe, v3, slerp } = ENG;
const ease = k => { k = Math.max(0, Math.min(1, k)); return k * k * (3 - 2 * k); };
const clamp = (a, b, t) => Math.max(a, Math.min(b, t));

const SLIDES = [];
function add(s) { SLIDES.push(s); }

add({
  menu: 'Where Am I?', end: '0:15', cover: true, beats: 1,
  notes: [
    'Title card. It draws once, about a second and a half, then holds. Say your name with the byline.',
    'GIS Day 2026. Jeff Franzen, Disaster GIS, American Red Cross.',
    'About 15 seconds. Then the wreck, not the quiz. By 0:15.'
  ],
  enter(st) { Object.assign(st, freshCam(18, -40, 1)); st.yaw = 0.9; st.pitch = 0.22; st.zoom = 1; },
  draw(ctx, w, h, step, el, st, now) {
    st.yaw += 0.004;
    const cx = w * .5, cy = h * .92, R = Math.min(w, h) * .72;
    const proj = p => { const q = ENG.rot(p, st.yaw, st.pitch); return { x: cx + q[0] * R, y: cy - q[1] * R, z: q[2] }; };
    drawStars(ctx, w, h, now);
    const g = ctx.createRadialGradient(cx - R * .3, cy - R * .5, R * .1, cx, cy, R);
    g.addColorStop(0, '#2f5a8c'); g.addColorStop(.7, '#15294a'); g.addColorStop(1, '#0b1526');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
    for (let la = -60; la <= 60; la += 20) arcLine(ctx, proj, Array.from({ length: 91 }, (_, k) => ll(la, k * 4)), la ? 'rgba(236,230,218,.1)' : 'rgba(240,179,90,.65)', la ? 1 : 1.6);
    ENG.drawCoast(ctx, proj, 1, { color: 'rgba(236,230,218,.75)' });
    const rim = ctx.createRadialGradient(cx, cy, R * .92, cx, cy, R * 1.06);
    rim.addColorStop(0, 'rgba(111,179,255,0)'); rim.addColorStop(.65, 'rgba(111,179,255,.28)'); rim.addColorStop(1, 'rgba(111,179,255,0)');
    ctx.fillStyle = rim; ctx.beginPath(); ctx.arc(cx, cy, R * 1.06, 0, TAU); ctx.fill();
  }
});

add({
  menu: 'The Isles of Scilly', end: '1:45', beats: 4,
  notes: [
    'Cold open. 22 October 1707, the date Britain was using. Admiral Sir Cloudesley Shovell, home from the Mediterranean, fog and gales. You will also see the name spelled Clowdisley. Say Cloudesley.',
    'The officers compare reckonings and agree they are safely in the mouth of the Channel. One captain thinks Scilly. He is outvoted. Let that sit.',
    'That night Association, Eagle, Romney, and Firebrand strike the Western Rocks. The toll is not one number. Counts run from about 1,400 to about 2,000 men, Shovell among them. Say the range. Charts and compasses were poor, and the longitude was a guess.',
    'Do not say this night caused the Longitude Act. Historians do not agree that it did. Say: nobody on that deck could find longitude. Then the title, as a question. Where am I? By 1:45. Havana is next, and the globe stays quiet until you reveal.',
    'Picture: public-domain engraving of Sir Cloudesley Shovell’s fleet lost on the rocks of Scilly, 22 October 1707.'
  ],
  line: s => ['22 October 1707.', 'They were sure.', 'The rocks.', 'Where am I?'][s],
  enter(st) { Object.assign(st, freshCam(49.6, -6.2, 4.2)); st.lock = true; st.img = new Image(); st.img.src = 'img/scilly.jpg'; },
  draw(ctx, w, h, step, el, st, now) {
    drawStars(ctx, w, h, now);
    if (step < 2 && st.img && st.img.complete) {
      const k = ease(el / 1800);
      const sc = 1.05 + k * 0.12;
      const iw = w * .72 * sc, ih = iw * (st.img.height / st.img.width);
      ctx.save(); ctx.globalAlpha = 0.92; ctx.drawImage(st.img, (w - iw) / 2, (h - 120 - ih) / 2, iw, ih); ctx.restore();
      return;
    }
    st.lock = false;
    stepAnim(st, now);
    if (step >= 2 && !st.flew) { st.flew = 1; fly(st, camFor(50, -5.5, 2.1), 1400); }
    const v = paintGlobe(ctx, w, h, st, now);
    const u = ease(Math.min(1, el / 2800));
    const path = [[50.1, -5.2], [49.95, -5.7], [49.9, -6.15], [49.86, -6.32]];
    const pts = [];
    for (let i = 0; i < path.length - 1; i++) for (let m = 0; m < 12; m++) {
      const t = m / 12; pts.push(ll(path[i][0] + (path[i + 1][0] - path[i][0]) * t, path[i][1] + (path[i + 1][1] - path[i][1]) * t));
    }
    const n = Math.max(2, Math.floor(pts.length * u));
    arcLine(ctx, v.proj, pts.slice(0, n), GOLD, 3);
    const q = v.proj(pts[n - 1]);
    if (q.z > 0) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(q.x, q.y, 5, 0, TAU); ctx.fill(); }
    if (u > .92) {
      const r = v.proj(ll(49.87, -6.4));
      if (r.z > 0) { ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(r.x, r.y, 10 + 8 * Math.sin(now / 200), 0, TAU); ctx.stroke(); tag(ctx, 'Western Rocks', r.x + 12, r.y, RED, 14); }
    }
  }
});

add({
  menu: 'Where Am I?', end: '3:00', beats: 2,
  quiz: { q: 'Fly due south from Havana. Which South American country do you cross first?', opts: ['Colombia', 'Ecuador', 'Peru', 'None of them'] },
  notes: [
    'This first frame is only the question. Pause 30 seconds and take the vote. Most rooms say Peru. Do not mention a map.',
    'One click reveals the globe. D is correct. Havana is 82.4° west. Punta Pariñas is 81.3° west. The meridian runs down the open Pacific. All of South America lies east.',
    'By 3:00. Take the vote out loud. The globe stays quiet until you reveal. Rome is next: same instinct, a parallel this time.'
  ],
  line: s => s ? 'None. Open Pacific.' : '',
  enter(st) { Object.assign(st, freshCam(20, -70, 1.15)); },
  draw(ctx, w, h, step, el, st, now) {
    if (!step) { drawStars(ctx, w, h, now); text(ctx, '?', w / 2, h * .42, { size: 120, align: 'center', color: 'rgba(240,179,90,.28)', font: 'serif' }); return; }
    stepAnim(st, now);
    if (!st.flew) { st.flew = 1; fly(st, camFor(8, -82.4, 2.15), 1600); }
    const v = paintGlobe(ctx, w, h, st, now);
    const k = ease(clamp(0, 1, (el - 300) / 1800));
    const lat1 = 23.13 + (-42 - 23.13) * k;
    arcLine(ctx, v.proj, Array.from({ length: 70 }, (_, i) => ll(23.13 + (lat1 - 23.13) * i / 69, -82.38)), RED, 3);
    pin(ctx, v.proj, 'Havana · 82.4° W', 23.13, -82.38, GOLD);
    if (k > .55) pin(ctx, v.proj, 'Punta Pariñas · 81.3° W', -4.68, -81.33, OK);
    const tip = v.proj(ll(lat1, -82.38));
    if (tip.z > 0) { const gl = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 22); gl.addColorStop(0, 'rgba(255,125,111,.9)'); gl.addColorStop(1, 'rgba(255,125,111,0)'); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(tip.x, tip.y, 22, 0, TAU); ctx.fill(); }
  }
});

add({
  menu: "Rome's Parallel", end: '4:00', beats: 2,
  quiz: { q: "Which of these American cities is closest to Rome's latitude?", opts: ['Atlanta', 'New York', 'Boston', 'Miami'] },
  notes: [
    'Question only. Pause about 25 seconds. The vote is usually New York or Atlanta. Do not show a map yet.',
    'Then click. C, Boston. Rome is 41.9° north. Boston is 42.4°. New York is 40.7°, Atlanta 33.7°, Miami 25.8°. Same parallel, very different climate. The Gulf Stream warms Italy.',
    'About a minute, with the zoom. By 4:00. Reno is next, and the coast will fool them.'
  ],
  line: s => s ? 'Boston. Same parallel.' : '',
  enter(st) { Object.assign(st, freshCam(40, -40, 1.2)); },
  draw(ctx, w, h, step, el, st, now) {
    if (!step) { drawStars(ctx, w, h, now); text(ctx, '?', w / 2, h * .42, { size: 120, align: 'center', color: 'rgba(240,179,90,.28)', font: 'serif' }); return; }
    stepAnim(st, now);
    if (!st.flew) { st.flew = 1; fly(st, camFor(42, -30, 1.55), 1500); }
    const v = paintGlobe(ctx, w, h, st, now);
    const k = ease(clamp(0, 1, (el - 200) / 1600));
    const lon = -71.06 + (12.5 + 71.06) * k;
    arcLine(ctx, v.proj, Array.from({ length: 90 }, (_, i) => ll(42, -71.06 + (lon + 71.06) * i / 89)), OK, 3.5);
    pin(ctx, v.proj, 'Boston · 42.4° N', 42.36, -71.06, OK);
    if (k > .85) pin(ctx, v.proj, 'Rome · 41.9° N', 41.9, 12.5, GOLD);
    const GS = [[25, -90], [28, -80], [32, -75], [36, -68], [40, -55], [44, -40], [47, -25], [49, -10], [50, 2]];
    const pts = [];
    for (let i = 0; i < GS.length - 1; i++) for (let m = 0; m < 8; m++) { const u = m / 8; pts.push(ll(GS[i][0] + (GS[i + 1][0] - GS[i][0]) * u, GS[i][1] + (GS[i + 1][1] - GS[i][1]) * u)); }
    const gn = Math.max(2, Math.floor(pts.length * ease(clamp(0, 1, (el - 800) / 3000))));
    ctx.lineDashOffset = -now / 40;
    arcLine(ctx, v.proj, pts.slice(0, gn), 'rgba(255,160,90,.85)', 3, [10, 8]);
    ctx.lineDashOffset = 0;
    if (gn > 20) { const q = v.proj(ll(38, -55)); if (q.z > 0) tag(ctx, 'Gulf Stream', q.x, q.y + 22, '#ffb060', 13); }
  }
});

add({
  menu: 'Reno or Los Angeles', end: '5:00', beats: 2,
  quiz: { q: 'Reno or Los Angeles: which is farther west?', opts: ['Los Angeles', 'Reno', 'The same', 'The coast'] },
  notes: [
    'Pause about 25 seconds. Many people say Los Angeles because it is on the coast.',
    'Then click. B. Reno is 119.8° west. Los Angeles is 118.2° west. Reno is farther west by 1.6°. The California coast bends east as it runs south.',
    'By 5:00. The close view is California and Nevada, and the coast bends east as it runs south. Then how you would tell a stranger: the grid.'
  ],
  line: s => s ? 'Reno, by 1.6°.' : '',
  enter(st) { Object.assign(st, freshCam(36, -110, 1.4)); },
  draw(ctx, w, h, step, el, st, now) {
    if (!step) { drawStars(ctx, w, h, now); text(ctx, '?', w / 2, h * .42, { size: 120, align: 'center', color: 'rgba(240,179,90,.28)', font: 'serif' }); return; }
    stepAnim(st, now);
    if (!st.flew) { st.flew = 1; fly(st, camFor(37, -119, 3.4), 1500); }
    const v = paintGlobe(ctx, w, h, st, now);
    const k = ease(clamp(0, 1, (el - 200) / 1800));
    arcLine(ctx, v.proj, Array.from({ length: 40 }, (_, i) => ll(28 + 18 * i / 39 * k, -119.82)), SKY, 2.5);
    arcLine(ctx, v.proj, Array.from({ length: 40 }, (_, i) => ll(28 + 16 * i / 39 * k, -118.24)), GOLD, 2.5);
    pin(ctx, v.proj, 'Reno · 119.8° W', 39.53, -119.82, SKY);
    pin(ctx, v.proj, 'Los Angeles · 118.2° W', 34.05, -118.24, GOLD);
  }
});

add({
  menu: 'Call a Square', end: '6:15', beats: 4,
  notes: [
    'The warm-ups were places the room already knows. This is how you would tell a stranger. Latitude first: the lines run with the equator and never meet.',
    'Longitude next. These lines meet at the poles.',
    'One sentence: parallels stay apart, meridians come together. The row is the one the sky can give you. The column is the one it cannot.',
    'Bingo. The letters and numbers sit on the globe’s own lines. G-4 is the called cell. By 6:15. Someone in power decided how long a step on that grid is. The mile is next.'
  ],
  line(step, el, st) { return step < 3 ? ['A row that never meets.', 'A column that meets at the pole.', 'Row from the sky. Column from a clock.'][step] : (st.call || 'G-4.'); },
  enter(st) { Object.assign(st, freshCam(24, -90, 1.7)); st.call = ''; },
  pointer(st, kind, x, y) {
    const proj = st._proj;
    if (kind !== 'up' || !proj) return;
    const rows = [0, 15, 30, 45, 60], cols = [-120, -105, -90, -75, -60];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const q = proj(ll((rows[r] + rows[r + 1]) / 2, (cols[c] + cols[c + 1]) / 2));
      if (q.z > 0 && Math.hypot(q.x - x, q.y - y) < 36) { st.r = r; st.c = c; st.call = 'BINGO'[c] + '-' + (r + 1) + '.'; return true; }
    }
  },
  draw(ctx, w, h, step, el, st, now) {
    stepAnim(st, now);
    if (step === 3 && !st.flew) { st.flew = 1; fly(st, camFor(28, -90, 2.3), 900); }
    const v = paintGlobe(ctx, w, h, st, now, { noStars: false });
    st._proj = v.proj;
    if (step >= 1) for (const la of [0, 15, 30, 45, 60]) arcLine(ctx, v.proj, Array.from({ length: 73 }, (_, k) => ll(la, -140 + k * 2)), la ? 'rgba(240,179,90,.85)' : GOLD, la ? 1.4 : 2);
    if (step >= 2) for (const lo of [-120, -105, -90, -75, -60]) arcLine(ctx, v.proj, Array.from({ length: 25 }, (_, k) => ll(k * 3, lo)), 'rgba(111,179,255,.85)', 1.4);
    if (step >= 3) {
      const rows = [0, 15, 30, 45, 60], cols = [-120, -105, -90, -75, -60];
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
        const on = st.r === r && st.c === c;
        const hot = r === 3 && c === 2;
        ctx.fillStyle = on ? 'rgba(255,125,111,.45)' : hot ? 'rgba(240,179,90,.28)' : 'rgba(255,250,235,.06)';
        ctx.beginPath();
        const corners = [[rows[r], cols[c]], [rows[r], cols[c + 1]], [rows[r + 1], cols[c + 1]], [rows[r + 1], cols[c]]];
        corners.forEach((p, i) => { const q = v.proj(ll(p[0], p[1])); i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); });
        ctx.closePath(); ctx.fill();
      }
      const g = v.proj(ll(52.5, -82.5));
      if (g.z > 0.2) tag(ctx, 'G-4', g.x - 10, g.y - 28, GOLD, 15);
    }
  }
});

add({
  menu: 'The Mile', end: '7:15', beats: 4,
  notes: [
    'Question first. Who decides how long a mile is? Let them answer. Power does.',
    'Rome. A legionary’s mille passus is 1,000 paces, and a pace is two steps. About 5,000 Roman feet, shorter than the mile on a modern road sign.',
    'England, 1593, under Elizabeth I. Parliament fixes the mile: 8 furlongs, 5,280 feet. They will not shorten the surveyor’s rod, because land is already written down in rods.',
    'The nautical mile is one minute of latitude, a piece of the Earth. In 1929 it is set at exactly 1,852 meters. By 7:15. The librarian who measured the planet is next.'
  ],
  line: s => ['Who decides how long a mile is?', '1,000 paces.', '5,280 feet.', 'One minute of Earth.'][s],
  enter(st) { st.lock = true; },
  draw(ctx, w, h, step, el, st, now) {
    drawStars(ctx, w, h, now);
    if (!step) return;
    if (step < 3) {
      const n = 24;
      for (let i = 0; i < n; i++) {
        const march = (i + now / 400) % n;
        const x = step === 1 ? 80 + march / n * (w - 160) : 120 + (i % 8) * ((w - 240) / 8);
        const y = step === 1 ? h * .48 : h * .32 + Math.floor(i / 8) * (h * .12);
        ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.fill();
      }
      return;
    }
    const cx = w * .5, cy = h * .95, R = Math.min(w, h) * .62;
    ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, R, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    const u = ease(el / 1600);
    for (let m = 0; m <= 60; m++) {
      if (m / 60 > u) break;
      const a = Math.PI * 1.15 + (Math.PI * .7) * m / 60;
      const inner = m === 30 ? R - 70 : R - 22;
      ctx.strokeStyle = m === 30 ? RED : INK; ctx.lineWidth = m === 30 ? 5 : 2;
      ctx.beginPath(); ctx.moveTo(cx + inner * Math.cos(a), cy + inner * Math.sin(a)); ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a)); ctx.stroke();
    }
  }
});

add({
  menu: 'A Well at Syene', end: '8:15', beats: 4,
  notes: [
    'Act two opens on a person, not a diagram. Alexandria, about 240 BC. Eratosthenes runs the library. Say air-uh-TOSS-thuh-neez once. The account we have is later, from Cleomedes.',
    'He reads a report. Syene, which is Aswan, at noon on the summer solstice: the sun shines to the bottom of a deep well. No shadow.',
    'The same noon, in Alexandria, a stick still casts a shadow. Ask why, and wait one beat.',
    'Eureka: the Earth curves. If the sun’s rays are parallel, that shadow is an angle at the center of the Earth. By 8:15.'
  ],
  line: s => ['Alexandria, about 240 BC.', 'The well is bright.', 'His stick still shadows.', 'The Earth curves.'][s],
  enter(st) { st.lock = true; },
  draw(ctx, w, h, step, el, st, now) {
    drawStars(ctx, w, h, now);
    if (!step) { text(ctx, 'Eratosthenes', w / 2, h * .46, { size: 42, align: 'center', color: INK, font: 'serif', weight: 500 }); return; }
    const ground = step >= 3;
    if (ground) { ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(w / 2, h * .92, Math.min(w, h) * .55, Math.PI * 1.12, Math.PI * 1.88); ctx.stroke(); }
    const wx = w * .32, wy = h * .55;
    ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(wx - 28, wy - 10, 56, 90);
    ctx.strokeStyle = RED; ctx.beginPath(); ctx.moveTo(wx, h * .12); ctx.lineTo(wx, wy - 14); ctx.stroke();
    ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(wx, h * .1, 16, 0, TAU); ctx.fill();
    for (let i = 0; i < 7; i++) { ctx.globalAlpha = .4 + .6 * Math.abs(Math.sin(now / 280 + i)); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(wx - 16 + (i % 4) * 11, wy + 50, 3, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
    if (step >= 2) {
      const ax = w * .68, ay = h * .58;
      ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax, ay - 160); ctx.stroke();
      ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ax + 70, ay); ctx.lineTo(ax, ay - 160); ctx.stroke();
    }
  }
});

add({
  menu: 'A Stick and a Shadow', end: '9:30', beats: 3,
  notes: [
    'You just told the eureka. This is the model. Syene is Aswan. This frame is the well: noon on the summer solstice, the Sun straight overhead.',
    'Alexandria is to the north. The same noon, a stick there casts a shadow. The angle is 7.2°.',
    'Pull back. The Syene ray and the Alexandria stick both run to the center of the Earth. The wedge there is the same 7.2°. By 9:30.'
  ],
  line: s => ['Straight down the well.', '7.2°, north.', 'The same wedge.'][s],
  enter(st) { st.lock = true; },
  draw(ctx, w, h, step, el, st) {
    drawStars(ctx, w, h, performance.now());
    const cx = w * .42, cy = h * .5, R = Math.min(w, h) * .24, a = 7.2 * DEG;
    ctx.fillStyle = '#1b3558'; ctx.strokeStyle = '#3b5f8a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill(); ctx.stroke();
    const sx = cx, sy = cy - R;
    const ax = cx + R * Math.sin(a), ay = cy - R * Math.cos(a);
    ctx.strokeStyle = 'rgba(240,179,90,.7)'; ctx.setLineDash([5, 6]); ctx.beginPath(); ctx.moveTo(cx - R * 1.15, cy); ctx.lineTo(cx + R * 1.25, cy); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'equator', cx + R + 12, cy + 6, { size: 15, color: GOLD, font: 'serif' });
    ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sx, sy - R * .7); ctx.lineTo(sx, sy); ctx.stroke();
    text(ctx, 'Syene', sx - 70, sy - 16, { size: 16, color: INK, font: 'serif' });
    if (step >= 1) {
      ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ax, ay - R * .75); ctx.lineTo(ax, ay); ctx.stroke();
      ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ax + (ax - cx) * .28, ay + (ay - cy) * .28); ctx.stroke();
      text(ctx, 'Alexandria', ax + 18, ay - 8, { size: 16, color: RED, font: 'serif' });
    }
    if (step >= 2) {
      ctx.strokeStyle = GOLD; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(sx, sy); ctx.stroke();
      text(ctx, '7.2°', cx + 36, cy - 48, { size: 22, color: GOLD, font: 'serif', weight: 600 });
    }
  }
});

add({
  menu: 'The Whole Earth', end: '10:30', beats: 3,
  notes: [
    '7.2 goes into 360 fifty times. The walk from Alexandria to Syene is one slice of the Earth.',
    'The bematists put the walk at about 5,000 stadia. Fifty times 5,000 is 250,000 stadia. He later wrote 252,000. Say 250,000.',
    'A stadion was not one fixed length, so the miles are uncertain, roughly 24,000 to 29,000, near 25,000. Today the equator is 24,901 miles. He was close. By 10:30.'
  ],
  line: s => ['50 slices.', '5,000 stadia.', 'About 25,000 miles.'][s],
  enter(st) { Object.assign(st, freshCam(20, 30, 1.35)); },
  draw(ctx, w, h, step, el, st, now) {
    stepAnim(st, now);
    const v = paintGlobe(ctx, w, h, st, now);
    const n = Math.floor(ease(clamp(0, 1, el / 1600)) * 50);
    for (let i = 0; i < n; i++) {
      const lon = i * (360 / 50);
      arcLine(ctx, v.proj, Array.from({ length: 20 }, (_, k) => ll(-10 + k * 2.2, lon)), i === 0 ? RED : 'rgba(236,230,218,.35)', i === 0 ? 3 : 1);
    }
  }
});

add({
  menu: 'The Easy Number', end: '11:15', beats: 2,
  notes: [
    'Both ships read the star at the same height, so they share a latitude. Drag them apart. The star does not change.',
    'At 50° north, one degree of longitude is about 44 miles. Nothing in the sky says who is east.',
    'Keep it short. By 11:15. The row from the bingo card is the one the sky can give you. A fist is the rough tool. Next.'
  ],
  line: s => s ? 'The star cannot say east.' : 'Same star. Same latitude.',
  enter(st) { Object.assign(st, freshCam(50, -20, 1.6)); st.gap = 12; st.lock = false; },
  pointer(st, kind, x, y) { if (kind === 'move' && st.down) st.gap = clamp(2, 50, st.gap + (x - st.down) * 0.08); if (kind === 'down') st.down = x; if (kind === 'up') st.down = 0; },
  draw(ctx, w, h, step, el, st, now) {
    stepAnim(st, now);
    const v = paintGlobe(ctx, w, h, st, now);
    arcLine(ctx, v.proj, Array.from({ length: 120 }, (_, k) => ll(50, -60 + k)), GOLD, 2.5);
    const A = -30, B = A + st.gap;
    [A, B].forEach((lo, i) => {
      arcLine(ctx, v.proj, Array.from({ length: 24 }, (_, k) => ll(20 + k * 3, lo)), 'rgba(255,125,111,.7)', 1.5, [5, 5]);
      const q = v.proj(ll(50, lo));
      if (q.z > 0) { ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(q.x, q.y, 6, 0, TAU); ctx.fill(); tag(ctx, i ? 'Ship 2' : 'Ship 1', q.x + 8, q.y - 8, INK, 13); }
    });
    const np = v.proj(ll(90, 0));
    if (np.z > 0) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(np.x, np.y - 28, 5, 0, TAU); ctx.fill(); tag(ctx, 'Polaris', np.x + 10, np.y - 24, SKY, 13); }
    if (step) { const mi = Math.round(st.gap * 69.17 * Math.cos(50 * DEG)); text(ctx, mi + ' miles apart', w / 2, 64, { size: 22, align: 'center', color: RED, font: 'serif' }); }
  }
});

add({
  menu: 'Fists and the Pole Star', end: '12:00', beats: 2,
  notes: [
    'Pause 30 seconds. One fist at arm’s length is about 10 degrees. Four fists is about 40. Let the room do it.',
    'Then drag the figure north. The height of the pole star and the latitude are the same number.',
    'Polaris is close to the pole today. By 12:00. Babylon is next: a scribe, and the number sixty.'
  ],
  line: s => s ? "The star's height is the latitude." : 'One fist, about 10°.',
  enter(st) { st.lock = true; st.lat = 10; },
  pointer(st, kind, x, y) { if (kind === 'move' && st.down != null) st.lat = clamp(0, 90, st.lat - (y - st.down) * 0.15); if (kind === 'down') st.down = y; if (kind === 'up') st.down = null; },
  draw(ctx, w, h, step, el, st) {
    drawStars(ctx, w, h, performance.now());
    const lat = step ? st.lat : 40;
    const cx = w * .38, cy = h * .58, R = Math.min(w, h) * .26;
    ctx.fillStyle = '#1b3558'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
    ctx.strokeStyle = GOLD; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(cx - R * 1.2, cy); ctx.lineTo(cx + R * 1.2, cy); ctx.stroke(); ctx.setLineDash([]);
    const a = lat * DEG, px = cx + R * Math.cos(a), py = cy - R * Math.sin(a);
    ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(px, py, 8, 0, TAU); ctx.fill();
    const hx = w * .72, hy = h * .62;
    ctx.strokeStyle = OK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(hx - 80, hy); ctx.lineTo(hx + 80, hy); ctx.stroke();
    ctx.strokeStyle = SKY; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + Math.cos(Math.PI / 2 - a) * 90, hy - Math.sin(Math.PI / 2 - a) * 90); ctx.stroke();
    text(ctx, Math.round(lat) + '°', hx + 20, hy - 70, { size: 36, color: GOLD, font: 'serif' });
    text(ctx, 'Drag up', w * .72, h * .78, { size: 16, color: MUTED, align: 'center', font: 'serif' });
  }
});

add({
  menu: 'Twelve Knuckles', end: '12:45', beats: 2,
  notes: [
    'Thumb counts three segments on each of four fingers: twelve. Five fingers on the other hand count the twelves: sixty.',
    'Show the counting if you like, and keep it short. The point is the number, not a history of Babylon.',
    'Sixty divides evenly by 2, 3, 4, 5, 6, 10, 12, 15, 20, and 30. By 12:45.'
  ],
  line: s => s ? 'Sixty.' : 'Twelve.',
  enter(st) { st.lock = true; },
  draw(ctx, w, h, step, el) {
    drawStars(ctx, w, h, performance.now());
    const n = step ? 60 : 12;
    const show = Math.floor(ease(el / 900) * n);
    for (let i = 0; i < show; i++) {
      const col = i % 12, row = Math.floor(i / 12);
      const x = w * .22 + col * (w * .05), y = h * .34 + row * (h * .08);
      ctx.fillStyle = i === show - 1 ? GOLD : INK; ctx.beginPath(); ctx.arc(x, y, 8, 0, TAU); ctx.fill();
    }
  }
});

add({
  menu: 'Not Always the Pole Star', end: '13:30', beats: 1,
  notes: [
    'The axis wobbles once in about 26,000 years. Around 100 BC, Polaris was about 12° from the true pole. Hipparchus described an empty patch of sky.',
    'In 1492 the gap was about 3.5°. Today it is about 0.63°. Vega is the rough north star in about 12,000 years.',
    'By 13:30. A lieutenant on a rolling deck is next.'
  ],
  line: (s, el, st) => { const y = Math.round(-130 + (st.year || 0)); const gap = (12 * Math.abs(Math.sin(((st.year || 0) / 26000) * TAU))).toFixed(1); return y + ' · ' + gap + '° off the pole.'; },
  enter(st) { st.lock = true; st.year = 2100; },
  pointer(st, kind, x, y) { if (kind === 'move' && st.down) st.year = clamp(-12000, 14000, st.year + (x - st.down) * 18); if (kind === 'down') st.down = x; if (kind === 'up') st.down = 0; },
  draw(ctx, w, h, step, el, st) {
    drawStars(ctx, w, h, performance.now());
    const cx = w / 2, cy = h * .48, R = Math.min(w, h) * .28;
    ctx.strokeStyle = 'rgba(236,230,218,.4)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
    ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(cx, cy, 5, 0, TAU); ctx.fill();
    text(ctx, 'true pole', cx + 12, cy - 8, { size: 14, color: GOLD, font: 'serif' });
    const ang = (st.year / 26000) * TAU;
    const px = cx + Math.cos(ang) * R, py = cy + Math.sin(ang) * R;
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px, py, 6, 0, TAU); ctx.fill();
    tag(ctx, 'the north star of that year', px + 10, py, SKY, 14);
    text(ctx, 'Drag across 26,000 years', w / 2, h * .82, { size: 16, align: 'center', color: MUTED, font: 'serif' });
  }
});

add({
  menu: 'A Rolling Deck', end: '14:15', beats: 1,
  notes: [
    'On land the plumb hangs still and you can wait. At sea the deck, the plumb, and the horizon all move.',
    'A long instrument needs a foundation and time. A ship has neither. Latitude was still possible. Longitude was not.',
    'By 14:15. East and west are a clock. Greenwich at noon is next.'
  ],
  line: () => 'Hold the star.',
  enter(st) { st.lock = true; },
  draw(ctx, w, h, step, el, st, now) {
    drawStars(ctx, w, h, now);
    const roll = 0.18 * Math.sin(now / 700);
    ctx.save(); ctx.translate(w / 2, h * .62); ctx.rotate(roll);
    ctx.strokeStyle = OK; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-w * .4, 0); ctx.lineTo(w * .4, 0); ctx.stroke();
    ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(now / 280) * 40, 120); ctx.stroke();
    ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(Math.sin(now / 280) * 40, 120, 10, 0, TAU); ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(w / 2, h * .22, 4, 0, TAU); ctx.fill();
    text(ctx, 'the star will not stay on the wire', w / 2, h * .16, { size: 16, align: 'center', color: MUTED, font: 'serif' });
  }
});

add({
  menu: 'One Circle, One Day', end: '15:45', beats: 5,
  quiz: { q: 'Greenwich, noon. When is the Sun overhead here again?', opts: ['12 hours', '24 hours', '365 days', 'One degree'] },
  notes: [
    'Question first. A person at Greenwich, noon, the Sun overhead. Pause about 30 seconds. When will the Sun be overhead here again?',
    '24 hours, after one full turn. Seen from above the North Pole.',
    'That turn is a circle. 360 degrees.',
    'Slice the day into 24. 360 divided by 24 is 15. The Earth turns 15 degrees every hour.',
    'A ship two slices west. Two hours is 30 degrees. If you know the time difference, you know the longitude. By 15:45.'
  ],
  line: s => ['', 'One full turn.', '360 degrees.', '15 degrees an hour.', '2 hours = 30°.'][s],
  enter(st) { st.lock = true; },
  draw(ctx, w, h, step, el, st, now) {
    if (!step) { drawStars(ctx, w, h, now); text(ctx, '?', w / 2, h * .42, { size: 120, align: 'center', color: 'rgba(240,179,90,.28)', font: 'serif' }); return; }
    drawStars(ctx, w, h, now);
    const cx = w / 2, cy = (h - 100) / 2, R = Math.min(w, h) * .32;
    ctx.fillStyle = '#1b3558'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
    ctx.fillStyle = '#0a1424'; ctx.beginPath(); ctx.arc(cx, cy, R, Math.PI / 2, Math.PI * 1.5); ctx.fill();
    const spin = step === 1 ? ease(el / 2000) : 1;
    const slices = step >= 3 ? 24 : 0;
    for (let i = 0; i < slices; i++) {
      const a = -Math.PI / 2 + i * TAU / 24;
      ctx.strokeStyle = i < 2 && step >= 4 ? RED : 'rgba(236,230,218,.35)'; ctx.lineWidth = i < 2 && step >= 4 ? 3 : 1;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.stroke();
    }
    const sun = -Math.PI / 2 + spin * TAU;
    ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(cx + Math.cos(0) * (R + 46), cy, 16, 0, TAU); ctx.fill();
    ctx.strokeStyle = GOLD; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, R + 8, -Math.PI / 2, -Math.PI / 2 + spin * TAU); ctx.stroke();
    text(ctx, 'North Pole', cx, cy + 6, { size: 14, align: 'center', color: MUTED, font: 'serif' });
  }
});

add({
  menu: 'Was 1900 a Leap Year?', end: '16:45', beats: 3,
  quiz: { q: 'Was 1900 a leap year?', opts: ['Yes', 'No', 'Only in Rome', 'Only in London'] },
  notes: [
    'Right after the 360° circle. Was 1900 a leap year? Most of the room will say yes.',
    'No. A century year leaps only if it divides by 400. 1900 does not. 2000 does.',
    '46 BC, Caesar. 1582, Gregory deletes 10 days. Britain, in 1752, deletes 11. By 16:45.'
  ],
  line: s => ['', 'No.', '10 days, then 11.'][s],
  enter(st) { st.lock = true; },
  draw(ctx, w, h, step, el, st, now) {
    if (!step) { drawStars(ctx, w, h, now); return; }
    drawStars(ctx, w, h, now);
    const cx = w * .42, cy = h * .48, R = Math.min(w, h) * .22;
    const gap = step === 1 ? 0.35 : 0.12;
    ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(cx, cy, R, -Math.PI / 2 + gap / 2, -Math.PI / 2 + TAU - gap / 2); ctx.stroke();
    ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.beginPath();
    ctx.moveTo(cx + R * Math.cos(-Math.PI / 2 - gap / 2), cy + R * Math.sin(-Math.PI / 2 - gap / 2));
    ctx.lineTo(cx + R * Math.cos(-Math.PI / 2 + gap / 2), cy + R * Math.sin(-Math.PI / 2 + gap / 2)); ctx.stroke();
    if (step >= 2) { text(ctx, '1582 · 10 days', w * .68, h * .42, { size: 22, color: INK, font: 'serif' }); text(ctx, '1752 · 11 days', w * .68, h * .52, { size: 22, color: RED, font: 'serif' }); }
  }
});

add({
  menu: 'Two Clocks', end: '17:45', beats: 2,
  notes: [
    'The left clock is the ship. Local noon is the Sun overhead.',
    'The right clock is Greenwich. Four hours times 15 degrees is 60 degrees west. By 17:45. Padua, 7 January 1610, is next.'
  ],
  line: () => '4 hours × 15° = 60° west.',
  enter(st) { st.lock = true; st.hrs = 4; },
  pointer(st, kind, x) { if (kind === 'move' && st.down) st.hrs = clamp(0, 12, st.hrs + (x - st.down) * 0.02); if (kind === 'down') st.down = x; if (kind === 'up') st.down = 0; },
  draw(ctx, w, h, step, el, st) {
    drawStars(ctx, w, h, performance.now());
    [[w * .3, 0, 'Ship · noon'], [w * .7, st.hrs, 'Greenwich']].forEach(([x, hrs, name]) => {
      ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, h * .46, 70, 0, TAU); ctx.stroke();
      const a = -Math.PI / 2 + hrs / 12 * TAU;
      ctx.strokeStyle = hrs ? RED : GOLD; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, h * .46); ctx.lineTo(x + Math.cos(a) * 46, h * .46 + Math.sin(a) * 46); ctx.stroke();
      text(ctx, name, x, h * .46 + 100, { size: 16, align: 'center', color: INK, font: 'serif' });
    });
    text(ctx, 'Drag the home clock', w / 2, h * .78, { size: 16, align: 'center', color: MUTED, font: 'serif' });
  }
});

add({
  menu: 'A Clock in the Sky', end: '19:15', beats: 3,
  notes: [
    'Padua, 7 January 1610. Galileo sees three small stars beside Jupiter. Pause. What will you see tomorrow night?',
    'They have moved. They are moons. Io goes round in about 42.5 hours. When Io slips into shadow, everyone looking sees it at the same instant.',
    'On land it works. On a rolling deck nobody can hold a telescope on a dot that small. By 19:15.',
    'Pictures: Jupiter and Io, NASA / JPL / University of Arizona, public domain.'
  ],
  line: s => ['What will you see tomorrow night?', 'One instant. Two clocks.', 'Useless on a rolling deck.'][s],
  enter(st) { st.lock = true; st.jup = new Image(); st.jup.src = 'img/jupiter.jpg'; st.io = new Image(); st.io.src = 'img/io.jpg'; },
  draw(ctx, w, h, step, el, st, now) {
    drawStars(ctx, w, h, now);
    const jx = w * .55, jy = h * .42, jr = Math.min(w, h) * .16;
    if (st.jup && st.jup.complete) { ctx.save(); ctx.beginPath(); ctx.arc(jx, jy, jr, 0, TAU); ctx.clip(); ctx.drawImage(st.jup, jx - jr, jy - jr, jr * 2, jr * 2); ctx.restore(); }
    else { ctx.fillStyle = '#c9a36b'; ctx.beginPath(); ctx.arc(jx, jy, jr, 0, TAU); ctx.fill(); }
    const th = now / 1400, ox = jx + Math.cos(th) * (jr + 70), oy = jy + Math.sin(th) * 28;
    const dark = Math.cos(th) > .9;
    ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.setLineDash([4, 6]); ctx.beginPath(); ctx.ellipse(jx, jy, jr + 70, 28, 0, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
    if (!dark && st.io && st.io.complete) { ctx.save(); ctx.beginPath(); ctx.arc(ox, oy, 14, 0, TAU); ctx.clip(); ctx.drawImage(st.io, ox - 14, oy - 14, 28, 28); ctx.restore(); }
    else { ctx.fillStyle = dark ? '#333' : '#ffe9b0'; ctx.beginPath(); ctx.arc(ox, oy, 9, 0, TAU); ctx.fill(); }
    if (step >= 1 && dark) tag(ctx, 'Io vanishes', ox + 16, oy, GOLD, 14);
  }
});

add({
  menu: 'Light Takes Time', end: '20:00', beats: 2,
  notes: [
    'Paris, 1676. Ole Rømer is timing Io’s eclipses. Say Rømer as RU-mer. He is checking a table, not hunting a new law.',
    'The eclipses come late when Earth is on the far side. He says light takes about 22 minutes to cross Earth’s orbit. We now say nearer 17. By 20:00.'
  ],
  line: s => s ? 'Late, when Earth is far.' : 'Paris, 1676.',
  enter(st) { st.lock = true; },
  draw(ctx, w, h, step, el, st, now) {
    drawStars(ctx, w, h, now);
    const sx = w * .28, jx = w * .78, y = h * .46;
    ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(sx, y, 22, 0, TAU); ctx.fill();
    ctx.fillStyle = '#c9a36b'; ctx.beginPath(); ctx.arc(jx, y, 34, 0, TAU); ctx.fill();
    const far = step >= 1;
    const ex = far ? sx + 70 : jx - 120;
    ctx.fillStyle = SKY; ctx.beginPath(); ctx.arc(ex, y, 12, 0, TAU); ctx.fill();
    const t = (now / 1800) % 1;
    ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(jx - 40 + (ex - (jx - 40)) * t, y, 5, 0, TAU); ctx.fill();
    text(ctx, far ? 'Earth, far' : 'Earth, near', ex, y + 40, { size: 16, align: 'center', color: INK, font: 'serif' });
  }
});

add({
  menu: 'The Moon as a Clock', end: '20:45', beats: 1,
  notes: [
    'Against the stars, the Moon moves about its own width, half a degree, in an hour. An almanac turns that angle into home time.',
    'Parallax, refraction, and a heaving deck all sit on the same sight. It can be done, and it is easy to get wrong.',
    'By 20:45. London, 1714, puts a price on an easier way. Do not say the Act was passed because of Scilly.'
  ],
  line: () => 'Half a degree an hour.',
  enter(st) { st.lock = true; },
  draw(ctx, w, h, step, el, st, now) {
    drawStars(ctx, w, h, now);
    const roll = 0.06 * Math.sin(now / 500);
    ctx.save(); ctx.translate(w / 2, h * .5); ctx.rotate(roll);
    ctx.fillStyle = '#efe6c8'; ctx.beginPath(); ctx.arc(-80, 0, 36, 0, TAU); ctx.fill();
    const x = 40 + Math.sin(now / 2000) * 30;
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, -10, 3, 0, TAU); ctx.fill();
    ctx.strokeStyle = GOLD; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-44, 0); ctx.lineTo(x, -10); ctx.stroke();
    ctx.restore();
  }
});

add({
  menu: 'The Longitude Act', end: '21:45', beats: 3,
  notes: [
    'London, 1714. Queen Anne signs the Act. Up to £20,000 if you can find longitude to within half a degree. £15,000 within two thirds. £10,000 within a degree.',
    'Do not say Parliament did this because of Scilly. The wreck is why the question has blood on it.',
    'Newton writes that such a watch hath not yet been made. He points to the sky. By 21:45. The carpenter is next.'
  ],
  line: s => ['£20,000.', 'Half a degree.', 'Such a watch hath not yet been made.'][s],
  enter(st) { st.lock = true; },
  draw(ctx, w, h, step, el) {
    drawStars(ctx, w, h, performance.now());
    const pounds = Math.round(20000 * ease(el / 900));
    text(ctx, '£' + (step ? '20,000' : pounds.toLocaleString('en-US')), w / 2, h * .32, { size: 64, align: 'center', color: RED, font: 'serif' });
    if (step >= 1) [['½°', '£20,000'], ['⅔°', '£15,000'], ['1°', '£10,000']].forEach((r, i) => {
      text(ctx, r[0], w * .4, h * .48 + i * 48, { size: 26, align: 'right', color: INK, font: 'serif' });
      text(ctx, r[1], w * .44, h * .48 + i * 48, { size: 26, color: i ? INK : GOLD, font: 'serif' });
    });
  }
});

add({
  menu: 'A Watch That Could Travel', end: '27:30', beats: 2,
  notes: [
    'John Harrison. Born 1693 in Foulby, Yorkshire. A carpenter’s son. His first clock, 1713, is almost all wood. Do not say H1 was wood.',
    'H1, 1735. H4, 1759, a large pocket watch. To Jamaica, 81 days, the residue about 5 seconds. He is paid, in pieces, and never handed the prize as a prize. By 27:30.',
    'Pictures: H1 and H4, public domain.'
  ],
  line: s => s ? 'Not the prize.' : 'About 5 seconds.',
  enter(st) { st.lock = true; st.h1 = new Image(); st.h1.src = 'img/harrison-h1.jpg'; st.h4 = new Image(); st.h4.src = 'img/harrison-h4.jpg'; },
  draw(ctx, w, h, step, el, st) {
    drawStars(ctx, w, h, performance.now());
    const img = step ? st.h4 : st.h1;
    if (img && img.complete) {
      const ih = (h - 160) * .7, iw = ih * (img.width / img.height);
      ctx.drawImage(img, (w - iw) / 2, h * .12, iw, ih);
    }
  }
});

add({
  menu: 'The Prime Meridian', end: '25:00', beats: 2,
  quiz: { q: 'Where should zero longitude be?', opts: ['Paris', 'Washington', 'Greenwich', 'The Cape'] },
  notes: [
    'Washington, October 1884. Twenty-five nations. The vote that matters is 13 October.',
    'Greenwich wins, 22 to 1. San Domingo votes no. France and Brazil abstain. Britain’s charts already used it. Power decides where zero is.',
    'France will not say Greenwich on a clock until 1911. By 25:00.'
  ],
  line: s => s ? '22 to 1.' : '',
  enter(st) { Object.assign(st, freshCam(30, -10, 1.5)); },
  draw(ctx, w, h, step, el, st, now) {
    if (!step) { drawStars(ctx, w, h, now); return; }
    stepAnim(st, now);
    if (!st.flew) { st.flew = 1; fly(st, camFor(51.5, 0, 2.2), 1200); }
    const v = paintGlobe(ctx, w, h, st, now);
    const k = ease(el / 1200);
    arcLine(ctx, v.proj, Array.from({ length: 40 }, (_, i) => ll(-70 + 140 * i / 39 * k, 0)), RED, 3);
    pin(ctx, v.proj, 'Greenwich', 51.48, 0, GOLD);
    text(ctx, '22', w * .15, h * .3, { size: 48, color: GOLD, font: 'serif' });
    text(ctx, '1', w * .15, h * .42, { size: 36, color: RED, font: 'serif' });
  }
});

add({
  menu: 'The Date Line', end: '26:45', beats: 2,
  notes: [
    'Two ships, one each side of 180°. The sun is at noon on both, the same instant. What day is it on each?',
    'Both clocks read noon. The calendars differ by a day. The line is not a law of nature. Kiribati, 1995, and Samoa, 2011, bend it. By 26:45.'
  ],
  line: s => s ? 'Thursday noon. Wednesday noon.' : 'Same noon. Two dates.',
  enter(st) { Object.assign(st, freshCam(10, 180, 1.45)); },
  draw(ctx, w, h, step, el, st, now) {
    stepAnim(st, now);
    const v = paintGlobe(ctx, w, h, st, now);
    const idl = [[70, 180], [65, -169], [52, 170], [5, 180], [2, -150], [-10, 180], [-15, -172], [-50, 180]];
    const k = ease(el / 1400);
    const pts = idl.slice(0, Math.max(2, Math.floor(idl.length * k))).map(p => ll(p[0], p[1]));
    arcLine(ctx, v.proj, pts, RED, 3);
    if (step) { tag(ctx, 'Thursday', w * .18, h * .3, RED, 16); tag(ctx, 'Wednesday', w * .18, h * .38, INK, 16); }
  }
});

add({
  menu: 'Where Am I?', end: '28:00', beats: 2,
  notes: [
    'You, tonight, a phone in a pocket. The same question Shovell could not answer.',
    'The satellites overhead carry atomic clocks. Your phone times the signals. The position is still a difference of clocks. By 28:00.',
    'Then two minutes of questions. Stop by 30:00. The appendix, the star day, only if someone asks.'
  ],
  line: s => s ? 'Clocks in the sky.' : 'Where am I?',
  enter(st) { Object.assign(st, freshCam(20, -70, 1.8)); },
  draw(ctx, w, h, step, el, st, now) {
    stepAnim(st, now);
    const v = paintGlobe(ctx, w, h, st, now);
    pin(ctx, v.proj, '', 23, -82, RED);
    if (step) {
      for (let i = 0; i < 4; i++) {
        const a = now / 900 + i * 1.4;
        const p = v.proj(ll(30 + 20 * Math.sin(a), -40 + i * 30));
        if (p.z > 0) { ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, TAU); ctx.fill(); }
      }
    }
  }
});

add({
  menu: 'Appendix', end: '28:15', beats: 1, appendix: true,
  notes: [
    'Not part of the 28 minutes. Stop the talk at the close, take questions, and open this only if the room asks why the Sun’s day is the longer one.',
    'One Degree More is the next slide.'
  ],
  line: () => 'Not in the 28 minutes.',
  enter(st) { st.lock = true; },
  draw(ctx, w, h) {
    drawStars(ctx, w, h, performance.now());
    text(ctx, 'Appendix', w / 2, h * .46, { size: 54, align: 'center', color: INK, font: 'serif', weight: 500 });
  }
});

add({
  menu: 'One Degree More', end: '28:30', beats: 2, appendix: true,
  notes: [
    'Sidereal, sy-DEER-ee-ul, means by the stars. One turn against the stars is 23 hours 56 minutes.',
    'The Earth also travels about one degree of its orbit in a day. The drawing exaggerates that step. It is marked not to scale.',
    'One degree of spin is four minutes. The solar day is 24 hours. This is the appendix, after the questions.'
  ],
  line: s => s ? '+1° = 4 minutes.' : '23 h 56 m.',
  enter(st) { st.lock = true; },
  draw(ctx, w, h, step, el) {
    drawStars(ctx, w, h, performance.now());
    const cx = w * .4, cy = h * .5, R = 46;
    ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(cx, cy, 18, 0, TAU); ctx.fill();
    const a = ease(el / 1000) * 0.5;
    const ex = cx + Math.cos(a) * 180, ey = cy + Math.sin(a) * 70;
    ctx.fillStyle = SKY; ctx.beginPath(); ctx.arc(ex, ey, 10, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(236,230,218,.35)'; ctx.beginPath(); ctx.arc(cx, cy, 180, 0, TAU); ctx.stroke();
    if (step) text(ctx, 'not to scale', w * .7, h * .4, { size: 16, color: MUTED, font: 'serif' });
  }
});

window.GIS = SLIDES;
