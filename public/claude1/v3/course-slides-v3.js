// v3 storyline additions (14 Nov 2026 handoff). Each slide: predict, then reveal, one idea per tap.
// SVG slides use the 1000×640 stage. Globe slides borrow the deck's own globe helpers
// (setup, rot, ll, drawCoast, orbit, fly, stepAnim, camFor, scenes), which exist by the time init runs.

// the International Date Line, approximate vertices [lat, lon] (same as the globe slide's copy)
const V3IDL = [[90, 180], [75, 180], [65.5, 180], [65.5, -169], [60, 180], [53, 170], [48, 180], [3.5, 180], [3.5, -150], [-10, -150], [-10, 180], [-15, 180], [-15, -172.5], [-51, -172.5], [-51, 180], [-90, 180]];
const V3 = {
  btn: (id, label, primary) => `<button id="${id}"${primary ? ' class="primary"' : ''}>${label}</button>`,
  ease: k => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2,
  // a glowing blue globe on a native slide's canvas, with an overlay hook
  globe(el, id, cam, overlay) {
    const c = el.querySelector('canvas.fig'); c.id = id;
    const o = setup(id), st = { ...cam, anim: null, maxZoom: 12, enabled: () => true };
    const geom = () => ({ cx: o.w * .5, cy: o.h * .5, R: Math.min(o.w, o.h) * .42 * st.zoom });
    const proj = p => { const { cx, cy, R } = geom(); const q = rot(p, st.yaw, st.pitch); return { x: cx + q[0] * R, y: cy - q[1] * R, z: q[2] }; };
    const api = { o, st, proj, geom,
      // a line along [lat, lon] points, front side only
      path(pts, color, width = 2, dash) { const { ctx } = o; ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash || []); ctx.beginPath(); let pen = false;
        for (let i = 0; i < pts.length - 1; i++) { const [a, b] = [pts[i], pts[i + 1]]; for (let k = 0; k <= 12; k++) { const la = a[0] + (b[0] - a[0]) * k / 12, lo = a[1] + (b[1] - a[1]) * k / 12, q = proj(ll(la, lo)); if (q.z >= 0) { pen ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); pen = true; } else pen = false; } }
        ctx.stroke(); ctx.setLineDash([]); },
      meridian(lon, color, width) { api.path([[85, lon], [-85, lon]], color, width); },
      dot(lat, lon, color, r = 6) { const q = proj(ll(lat, lon)); if (q.z < 0) return null; o.ctx.fillStyle = color; o.ctx.beginPath(); o.ctx.arc(q.x, q.y, r, 0, TAU); o.ctx.fill(); return q; },
      label(s, x, y, color = '#ece6da', size = 18, align = 'left') { const { ctx } = o; ctx.font = `${size}px Georgia, serif`; ctx.textAlign = align; ctx.fillStyle = 'rgba(10,14,24,.75)'; const w = ctx.measureText(s).width, x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x; ctx.fillRect(x0 - 5, y - size, w + 10, size + 8); ctx.fillStyle = color; ctx.fillText(s, x, y); ctx.textAlign = 'left'; }
    };
    scenes.push({ o, draw(t) {
      stepAnim(st, t); const { ctx, w, h } = o; ctx.clearRect(0, 0, w, h); drawStars(o, t); const { cx, cy, R } = geom();
      const g = ctx.createRadialGradient(cx - R * .35, cy - R * .35, R * .05, cx, cy, R); g.addColorStop(0, '#2f5a8c'); g.addColorStop(.7, '#15294a'); g.addColorStop(1, '#0b1526'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
      ctx.lineWidth = 1; for (let la = -60; la <= 60; la += 30) { ctx.strokeStyle = la ? 'rgba(236,230,218,.1)' : 'rgba(236,230,218,.25)'; ctx.beginPath(); let pen = false; for (let lo = 0; lo <= 360; lo += 4) { const q = proj(ll(la, lo)); if (q.z >= 0) { pen ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); pen = true; } else pen = false; } ctx.stroke(); }
      for (let lo = -180; lo < 180; lo += 30) api.path([[80, lo], [-80, lo]], 'rgba(236,230,218,.08)', 1);
      drawCoast(ctx, proj, st.zoom, { color: 'rgba(236,230,218,.8)' });
      const rim = ctx.createRadialGradient(cx, cy, R * .94, cx, cy, R * 1.07); rim.addColorStop(0, 'rgba(111,179,255,0)'); rim.addColorStop(.5, 'rgba(111,179,255,.28)'); rim.addColorStop(1, 'rgba(111,179,255,0)'); ctx.fillStyle = rim; ctx.beginPath(); ctx.arc(cx, cy, R * 1.07, 0, TAU); ctx.fill();
      overlay(api, t);
    } });
    orbit(o, st, null); return api;
  }
};

/* ---------- Power decides the measure ---------- */
NEW_SLIDES['Power decides the measure'] = {
  h1: 'Who decides how long a mile is?',
  ctl: `<div class="btns">${V3.btn('pm-rome', 'Rome', true)}${V3.btn('pm-eliz', 'London, 1593')}${V3.btn('pm-sea', 'At sea')}</div>`,
  fig: `<g id="pm"></g>`,
  init(el) {
    const M = [
      ['pm-rome', 'Rome', '1,000 paces · mille passus', 4860, '#8fb0d8', 'a general’s stride'],
      ['pm-eliz', 'Elizabeth I · 1593', '8 furlongs · 5,280 feet', 5280, '#c9a35e', 'a queen’s statute'],
      ['pm-sea', 'At sea', '1 arcminute of latitude · 6,076 feet', 6076, '#f0b35a', 'the Earth itself']
    ];
    let shown = 0; const X0 = 90, PX = 720 / 6076;
    const draw = () => {
      let s = '';
      M.forEach((m, i) => { const y = 120 + i * 160, on = i < shown, w = m[3] * PX;
        s += `<g opacity="${on ? 1 : .12}"><text x="${X0}" y="${y}" class="lg" style="fill:${m[4]}">${m[1]}</text>
          <rect x="${X0}" y="${y + 20}" width="${on ? w : 0}" height="44" rx="6" fill="${m[4]}" fill-opacity="${i === 2 && shown === 3 ? .9 : .55}" style="transition:width .9s ease"/>
          <text x="${X0 + w + 14}" y="${y + 52}" class="md">${on ? m[3].toLocaleString('en-US') + ' ft' : ''}</text>
          <text x="${X0}" y="${y + 100}" class="md mu">${on ? m[2] : ''}</text></g>`; });
      if (shown === 3) s += `<text x="${X0 + 6076 * PX}" y="592" text-anchor="end" class="lg rd" font-style="italic">Only one came from the Earth.</text>`;
      CS.$(el, '#pm').innerHTML = s;
      M.forEach((m, i) => CS.$(el, '#' + m[0]).classList.toggle('on', i < shown));
    };
    M.forEach((m, i) => { CS.$(el, '#' + m[0]).onclick = () => { shown = shown === i + 1 ? i : i + 1; draw(); }; });
    draw();
  }
};

/* ---------- Your fist is ten degrees ---------- */
NEW_SLIDES['Fist and knuckle'] = {
  h1: 'Hold out your fist',
  ctl: `<div class="btns">${V3.btn('fk-mia', 'Miami · 26° N')}${V3.btn('fk-dc', 'Washington · 39° N', true)}${V3.btn('fk-tor', 'Toronto · 44° N')}</div><div class="btns">${V3.btn('fk-go', 'Stack the fists', true)}</div><div class="readout" id="fk-r"></div>`,
  fig: `<rect x="40" y="20" width="920" height="560" rx="10" fill="#101830"/><rect x="40" y="540" width="920" height="60" fill="#151f2e"/>
  <line x1="40" y1="540" x2="960" y2="540" stroke="#6fb3ff" stroke-width="2.5"/><text x="58" y="574" class="sm" style="fill:#6fb3ff">north horizon</text>
  <g id="fk-sky"></g>`,
  init(el) {
    const Y0 = 540, PX = 11, X = 520; let lat = 39, stack = 0, t0 = 0, run = false;
    const fist = (y, k) => `<g transform="translate(${X - 70},${y}) scale(1.4,1)" opacity="${k}"><rect x="0" y="${-10 * PX}" width="120" height="${10 * PX}" rx="18" fill="#c9a35e" fill-opacity=".28" stroke="#f0b35a" stroke-width="2"/>${[0, 1, 2, 3].map(i => `<path d="M${10 + i * 26} ${-10 * PX + 4} q13 -12 26 0" fill="none" stroke="#f0b35a" stroke-width="2"/>`).join('')}<rect x="120" y="${-10 * PX + 10}" width="22" height="${10 * PX - 22}" rx="9" fill="none" stroke="#f0b35a" stroke-width="2"/></g>`;
    const knuckle = (y, k) => `<g transform="translate(${X - 70},${y}) scale(1.4,1)" opacity="${k}"><path d="M8 0 q14 ${-2 * PX * 1.4} 28 0" fill="#c9a35e" fill-opacity=".3" stroke="#f0b35a" stroke-width="2"/></g>`;
    const draw = () => {
      const py = Y0 - lat * PX, full = Math.floor(lat / 10), kn = Math.round((lat - full * 10) / 2); let s = '';
      s += `<line x1="${X - 120}" y1="${py}" x2="${X + 300}" y2="${py}" stroke="#2e3854" stroke-dasharray="4 6"/>`;
      s += `<g transform="translate(${X + 170},${py})"><path class="fr" d="M0 -13 L3.5 -4 L13 -4 L5.5 2 L8 12 L0 6 L-8 12 L-5.5 2 L-13 -4 L-3.5 -4 Z"/></g><text x="${X + 194}" y="${py + 8}" class="lg rd">Polaris</text>`;
      for (let i = 0; i < full; i++) s += fist(Y0 - i * 10 * PX, Math.max(0, Math.min(1, stack - i)));
      for (let j = 0; j < kn; j++) s += knuckle(Y0 - (full * 10 + j * 2) * PX, Math.max(0, Math.min(1, stack - full - j)));
      CS.$(el, '#fk-sky').innerHTML = s;
      const done = stack >= full + kn - .01;
      CS.$(el, '#fk-r').innerHTML = done ? `<strong class="big">${full} fist${full === 1 ? '' : 's'}${kn ? ` + ${kn} knuckle${kn === 1 ? '' : 's'}` : ''} ≈ ${lat}°</strong>` : `<strong>How many fists up is Polaris?</strong>`;
    };
    const pick = (id, l) => { CS.$(el, '#' + id).onclick = () => { lat = l; stack = 0; run = false; ['fk-mia', 'fk-dc', 'fk-tor'].forEach(b => CS.$(el, '#' + b).classList.toggle('primary', b === id)); draw(); }; };
    pick('fk-mia', 26); pick('fk-dc', 39); pick('fk-tor', 44);
    CS.$(el, '#fk-go').onclick = () => { stack = 0; run = true; t0 = performance.now(); };
    CS.tick(el, t => { if (!run) return; stack = (t - t0) / 450; const full = Math.floor(lat / 10), kn = Math.round((lat - full * 10) / 2); if (stack >= full + kn) { stack = full + kn; run = false; } draw(); });
    draw();
  }
};

/* ---------- The pole star wanders ---------- */
NEW_SLIDES['The pole star wanders'] = {
  h1: 'The pole star was not always Polaris',
  ctl: `<div class="btns">${V3.btn('ps-pyr', 'The pyramids · 2600 BC')}${V3.btn('ps-now', 'Today', true)}${V3.btn('ps-vega', 'AD 14,000')}</div><div class="controls">${CS.slider('ps-y', 'Year', -4000, 16000, 1, 2026)}</div>`,
  fig: `<circle cx="500" cy="320" r="270" fill="#0e1528" stroke="#2e3854"/><g id="ps-sky"></g>`,
  init(el) {
    // pole moves round a 23.4° circle in about 25,772 years. Each star sits where the pole passes nearest it.
    const CX = 500, CY = 320, R = 210, P = 25772, ang = y => (y - 2100) / P * TAU - Math.PI / 2;
    const STARS = [['Thuban', -2830, 0, 'pole star for the pyramid builders'], ['Polaris', 2100, -.03, 'pole star today'], ['Errai', 4000, .03, ''], ['Alderamin', 7500, .07, ''], ['Deneb', 10000, .3, ''], ['Vega', 13700, .2, 'pole star in AD 14,000'], ['Kochab', -1100, .38, '']];
    const pos = (y, off = 0) => { const a = ang(y), r = R * (1 + off); return [CX + r * Math.cos(a), CY + r * Math.sin(a)]; };
    const S = CS.$(el, '#ps-y'); let target = null;
    const draw = () => {
      const y = +S.value; let s = `<circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="#3b5f8a" stroke-dasharray="3 7"/>`;
      STARS.forEach(([n, yr, off]) => { const [x, yy] = pos(yr, off), near = Math.hypot(...pos(y).map((v, i) => v - [x, yy][i])) < 28; s += `<circle cx="${x}" cy="${yy}" r="${near ? 9 : 5}" fill="${near ? '#f0b35a' : '#ece6da'}"/><text x="${x + 14}" y="${yy - 10}" class="${near ? 'lg rd' : 'sm'}">${n}</text>`; });
      const [px, py] = pos(y); s += `<line x1="${CX}" y1="${CY}" x2="${px}" y2="${py}" stroke="#6fb3ff" stroke-width="1.5" stroke-dasharray="4 5"/><circle cx="${px}" cy="${py}" r="20" fill="none" stroke="#6fb3ff" stroke-width="2.5"/><path d="M${px - 30} ${py}h18M${px + 12} ${py}h18M${px} ${py - 30}v18M${px} ${py + 12}v18" stroke="#6fb3ff" stroke-width="2"/>`;
      s += `<text x="${CX}" y="${CY + 8}" text-anchor="middle" class="xs mu">the sky’s pole circles here</text>`;
      s += `<text x="${CX}" y="616" text-anchor="middle" class="xl">${y < 0 ? -y + ' BC' : 'AD ' + y}</text>`;
      CS.$(el, '#ps-sky').innerHTML = s; CS.$(el, '#ps-y-o').textContent = y < 0 ? `${-y} BC` : `AD ${y}`;
    };
    const goTo = y => { target = y; };
    CS.$(el, '#ps-pyr').onclick = () => goTo(-2600); CS.$(el, '#ps-now').onclick = () => goTo(2026); CS.$(el, '#ps-vega').onclick = () => goTo(14000);
    S.oninput = () => { target = null; draw(); };
    CS.tick(el, (t, dt) => { if (target == null) return; const v = +S.value, d = target - v, step = Math.sign(d) * Math.min(Math.abs(d), Math.max(20, Math.abs(d) * .06)); S.value = v + step; if (Math.abs(d) < 1) { S.value = target; target = null; } draw(); });
    draw();
  }
};

/* ---------- Was 1900 a leap year? ---------- */
NEW_SLIDES['Was 1900 a leap year?'] = {
  h1: 'Was 1900 a leap year?',
  ctl: `<div class="btns">${V3.btn('ly-yes', 'Yes')}${V3.btn('ly-no', 'No')}</div><div class="btns">${V3.btn('ly-back', 'Back')}${V3.btn('ly-next', 'Next', true)}</div>`,
  fig: `<g id="ly"></g>`,
  init(el) {
    let step = 0, vote = null;
    const ring = (n, extra, label, sub) => { let s = `<circle cx="500" cy="300" r="230" fill="#101830" stroke="#2e3854"/>`;
      for (let i = 0; i < n + extra; i++) { const a = i / (n + extra) * TAU - Math.PI / 2, x = Math.cos(a), y = Math.sin(a), red = i >= n; s += `<line x1="${500 + x * (red ? 200 : 212)}" y1="${300 + y * (red ? 200 : 212)}" x2="${500 + x * 228}" y2="${300 + y * 228}" stroke="${red ? '#f0b35a' : '#4a5470'}" stroke-width="${red ? 5 : 1.4}"/>`; }
      return s + `<text x="500" y="300" text-anchor="middle" class="xl">${label}</text><text x="500" y="344" text-anchor="middle" class="md mu">${sub}</text>`; };
    const STEPS = [
      () => `<text x="500" y="360" text-anchor="middle" style="font-size:190px" class="rd">1900</text>`,
      () => { const rows = [['Divisible by 4', 'leap year', '1900 ✓'], ['Divisible by 100', 'not a leap year', '1900 ✓'], ['Divisible by 400', 'leap year after all', '1900 ✗']];
        return rows.map((r, i) => { const y = 90 + i * 150, hit = i === 1; return `<rect x="110" y="${y}" width="780" height="120" rx="14" fill="${hit ? '#1b2a48' : '#121c33'}" stroke="${hit ? '#f0b35a' : '#2e3854'}" stroke-width="${hit ? 3 : 1.5}"/><text x="150" y="${y + 52}" class="lg">${r[0]}</text><text x="150" y="${y + 92}" class="md mu">${r[1]}</text><text x="850" y="${y + 72}" text-anchor="end" class="lg ${hit ? 'rd' : ''}">${r[2]}</text>`; }).join('') + `<text x="500" y="610" text-anchor="middle" class="lg rd">No. 2000 was. 2100 won’t be.</text>`; },
      () => ring(360, 0, '360 days', 'an old year → 360° in a circle'),
      () => ring(360, 5, '+ 5 days', 'Egypt: 365, five days of festival'),
      () => ring(365, 1, '+ ¼ day', 'Julius Caesar, 46 BC: a leap day every 4 years'),
      () => `<text x="500" y="150" text-anchor="middle" class="xl">October 1582</text><text x="500" y="196" text-anchor="middle" class="md mu">Pope Gregory XIII</text>` + [4, 15].map((d, i) => `<rect x="${250 + i * 280}" y="240" width="220" height="240" rx="14" fill="#121c33" stroke="#4a5470"/><text x="${360 + i * 280}" y="300" text-anchor="middle" class="md mu">${i ? 'Friday' : 'Thursday'}</text><text x="${360 + i * 280}" y="420" text-anchor="middle" style="font-size:110px">${d}</text>`).join('') + `<path d="M480 360 h60" stroke="#f0b35a" stroke-width="4"/><text x="500" y="560" text-anchor="middle" class="lg rd">10 days gone. Plus the 400-year rule.</text>`,
      () => { let s = `<text x="500" y="70" text-anchor="middle" class="xl">September 1752 · Britain</text>`; const days = [1, 2, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], start = 2;
        ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach((d, i) => s += `<text x="${215 + i * 95}" y="130" text-anchor="middle" class="md mu">${d}</text>`);
        days.forEach((d, i) => { const c = (start + i) % 7, r = Math.floor((start + i) / 7), x = 215 + c * 95, y = 190 + r * 80; s += `<text x="${x}" y="${y}" text-anchor="middle" class="lg ${d === 14 ? 'rd' : ''}">${d}</text>`; });
        return s + `<path d="M${215 + 3 * 95 + 30} 175 l40 0" stroke="#f0b35a" stroke-width="3"/><text x="500" y="560" text-anchor="middle" class="lg rd">Britain waited 170 years and lost 11 days.</text>`; }
    ];
    const draw = () => {
      CS.$(el, '#ly').innerHTML = STEPS[step]();
      CS.$(el, '#ly-yes').classList.toggle('on', vote === 'yes'); CS.$(el, '#ly-no').classList.toggle('on', vote === 'no');
      CS.$(el, '#ly-back').disabled = step === 0; CS.$(el, '#ly-next').disabled = step === STEPS.length - 1;
    };
    CS.$(el, '#ly-yes').onclick = () => { vote = 'yes'; draw(); }; CS.$(el, '#ly-no').onclick = () => { vote = 'no'; draw(); };
    CS.$(el, '#ly-next').onclick = () => { step = Math.min(STEPS.length - 1, step + 1); draw(); };
    CS.$(el, '#ly-back').onclick = () => { step = Math.max(0, step - 1); draw(); };
    draw();
  }
};

/* ---------- Washington, 1884 ---------- */
NEW_SLIDES['Washington, 1884'] = {
  h1: 'Where should zero be?', canvas: true,
  ctl: `<div class="btns">${V3.btn('pm84-g', 'Greenwich')}${V3.btn('pm84-p', 'Paris')}${V3.btn('pm84-w', 'Washington')}${V3.btn('pm84-f', 'Ferro, Canaries')}</div><div class="btns">${V3.btn('pm84-vote', 'Count the votes', true)}${V3.btn('pm84-fr', 'And France?')}</div><div class="readout" id="pm84-r"><strong>25 nations. Vote first.</strong></div>`,
  init(el) {
    const C = [['pm84-g', 'Greenwich', 51.48, 0], ['pm84-p', 'Paris', 48.84, 2.34], ['pm84-w', 'Washington', 38.92, -77.07], ['pm84-f', 'Ferro', 27.75, -17.9]];
    let pick = null, stage = 0, t0 = 0;
    const G = V3.globe(el, 'v3-1884', camFor(35, -30, 1), (g, t) => {
      const pulse = .5 + .5 * Math.sin(t / 300);
      C.forEach(([id, n, la, lo]) => {
        const win = stage >= 1 && n === 'Greenwich', fr = stage === 2 && n === 'Paris', dim = stage >= 1 && !win && !fr;
        g.meridian(lo, win ? '#f0b35a' : fr ? `rgba(143,176,216,${.5 + .5 * pulse})` : dim ? 'rgba(236,230,218,.12)' : (pick === id ? '#f0b35a' : 'rgba(143,176,216,.7)'), win || fr ? 3.5 : 2);
        const q = g.dot(la, lo, win ? '#f0b35a' : '#ece6da', win ? 7 : 5); if (q && !dim) g.label(win ? 'Greenwich · 0°' : n, q.x + 12, q.y + 6, win ? '#f0b35a' : '#ece6da', win ? 22 : 18);
      });
    });
    const sync = () => C.forEach(([id]) => CS.$(el, '#' + id).classList.toggle('on', pick === id));
    C.forEach(([id]) => { CS.$(el, '#' + id).onclick = () => { pick = id; stage = 0; sync(); CS.$(el, '#pm84-r').innerHTML = '<strong>Your vote is in.</strong>'; }; });
    CS.$(el, '#pm84-vote').onclick = () => { stage = 1; fly(G.st, camFor(45, -10, 1.5), 1600); CS.$(el, '#pm84-r').innerHTML = '<strong class="big">Greenwich, 22 to 1</strong><span>San Domingo against. France and Brazil abstain.</span>'; };
    CS.$(el, '#pm84-fr').onclick = () => { stage = 2; fly(G.st, camFor(49, 1, 4), 1600); CS.$(el, '#pm84-r').innerHTML = '<strong class="big">Paris time until 1911</strong>'; };
  }
};

/* ---------- The date line ---------- */
NEW_SLIDES['The date line'] = {
  h1: 'Noon, on two different days', canvas: true,
  ctl: `<div class="btns">${V3.btn('dl-now', 'Samoa and American Samoa', true)}${V3.btn('dl-2011', 'Samoa, December 2011')}${V3.btn('dl-kir', 'Kiribati, 1995')}</div><div class="readout" id="dl-r"></div>`,
  init(el) {
    const APIA = [-13.83, -171.77], PAGO = [-14.28, -170.7];
    let mode = 'now', t0 = 0;
    const OLD = [[90, 180], [75, 180], [65.5, 180], [65.5, -169], [60, 180], [53, 170], [48, 180], [-10, 180], [-15, 180], [-15, -172.5], [-51, -172.5], [-51, 180], [-90, 180]];
    const day = (k, d) => `<strong class="big">${k}</strong>`;
    const G = V3.globe(el, 'v3-idl', camFor(-8, -175, 2.2), (g, t) => {
      const k = Math.min(1, (t - t0) / 1600);
      if (mode === 'kir') { g.path(OLD, 'rgba(255,125,111,.3)', 2, [5, 6]); }
      g.path(V3IDL, '#ff7d6f', 3);
      const a = g.dot(...APIA, '#f0b35a', 7), p = g.dot(...PAGO, '#6fb3ff', 7);
      if (mode === 'kir') { [[1.4, 173], [-3.7, -171.2], [1.9, -157.4]].forEach(c => g.dot(...c, '#ece6da', 5)); const q = g.proj(ll(1.9, -157.4)); if (q.z > 0) g.label('Kiribati: one country, one date', q.x + 12, q.y - 10, '#ece6da', 18); return; }
      const apDate = mode === '2011' ? (k < .5 ? 'Thursday 29 December' : 'Saturday 31 December') : 'Saturday';
      if (a) g.label(`Apia · noon · ${apDate}`, a.x - 14, a.y - 16, '#f0b35a', 18, 'right');
      if (p) g.label(`Pago Pago · noon · ${mode === '2011' ? 'Friday 30 December' : 'Friday'}`, p.x + 14, p.y + 28, '#6fb3ff', 18);
    });
    const set = m => { mode = m; t0 = performance.now(); ['dl-now', 'dl-2011', 'dl-kir'].forEach(b => CS.$(el, '#' + b).classList.toggle('on', b === 'dl-' + m));
      if (m === 'kir') fly(G.st, camFor(0, -170, 1.4), 1400); else fly(G.st, camFor(-12, -172, 2.2), 1400);
      CS.$(el, '#dl-r').innerHTML = m === 'now' ? '<strong>About 100 miles apart. Same clock. A day apart.</strong>' : m === '2011' ? '<strong class="big">Samoa skipped Friday 30 December 2011</strong>' : '<strong class="big">The line moved east in 1995</strong>'; };
    CS.$(el, '#dl-now').onclick = () => set('now'); CS.$(el, '#dl-2011').onclick = () => set('2011'); CS.$(el, '#dl-kir').onclick = () => set('kir');
    set('now');
  }
};

/* ---------- Close: GPS ---------- */
NEW_SLIDES['Where am I, now'] = {
  h1: 'Where am I? One second.', canvas: true,
  ctl: `<div class="btns">${V3.btn('gps-ask', 'Ask the satellites', true)}${V3.btn('gps-re', 'Reset')}</div><div class="readout" id="gps-r"></div>`,
  init(el) {
    // 24 satellites in six planes inclined 55°, about 4.2 Earth radii out (drawn closer so they fit)
    const SAT = []; for (let p = 0; p < 6; p++) for (let k = 0; k < 4; k++) SAT.push({ node: p * 60 * DEG, ph: (k * 90 + p * 15) * DEG });
    const ME = [38.9, -77.0], RS = 1.55, inc = 55 * DEG; let ask = 0, t0 = 0;
    const satPos = (s, t) => { const u = s.ph + t * .00012, x = Math.cos(u), z = Math.sin(u), y = z * Math.sin(inc), zz = z * Math.cos(inc); return [RS * (x * Math.cos(s.node) - zz * Math.sin(s.node)), RS * y, RS * (x * Math.sin(s.node) + zz * Math.cos(s.node))]; };
    const G = V3.globe(el, 'v3-gps', camFor(30, -77, .7), (g, t) => {
      const { ctx } = g.o, me = ll(...ME), mq = g.proj(me);
      const sats = SAT.map(s => { const p = satPos(s, t), q = g.proj(p); return { p, q, see: v3.dot(v3.norm(v3.sub(p, me)), me) > .05 }; });
      const used = ask ? sats.filter(s => s.see && s.q.z > -.2).sort((a, b) => b.q.z - a.q.z).slice(0, 4) : [];
      const k = ask ? Math.min(1, (t - t0) / 1800) : 0;
      used.forEach((s, i) => { ctx.strokeStyle = `rgba(240,179,90,${.25 + .6 * k})`; ctx.lineWidth = 1.6; ctx.setLineDash([6, 6]); ctx.lineDashOffset = -t / 40; ctx.beginPath(); ctx.moveTo(s.q.x, s.q.y); ctx.lineTo(s.q.x + (mq.x - s.q.x) * k, s.q.y + (mq.y - s.q.y) * k); ctx.stroke(); ctx.setLineDash([]); });
      sats.forEach(s => { if (s.q.z < 0 && Math.hypot(s.q.x - g.geom().cx, s.q.y - g.geom().cy) < g.geom().R) return; const on = used.includes(s); ctx.fillStyle = on ? '#f0b35a' : '#ece6da'; ctx.globalAlpha = on ? 1 : .55; ctx.fillRect(s.q.x - 4, s.q.y - 4, 8, 8); ctx.globalAlpha = 1; });
      if (mq.z > 0) { ctx.fillStyle = '#6fb3ff'; ctx.beginPath(); ctx.arc(mq.x, mq.y, 6 + (ask && k >= 1 ? 3 * Math.sin(t / 200) : 0), 0, TAU); ctx.fill(); if (ask && k >= 1) g.label('You are here', mq.x + 14, mq.y + 6, '#6fb3ff', 18); }
      if (ask && k >= 1 && !G.done) { G.done = true; CS.$(el, '#gps-r').innerHTML = '<strong class="big">38.9° N, 77.0° W</strong><span>Four clocks agree. About one second.</span>'; }
    });
    CS.$(el, '#gps-ask').onclick = () => { ask = 1; t0 = performance.now(); G.done = false; CS.$(el, '#gps-r').innerHTML = '<strong>Each one is an atomic clock.</strong>'; };
    CS.$(el, '#gps-re').onclick = () => { ask = 0; CS.$(el, '#gps-r').innerHTML = ''; };
  }
};

/* ---------- Appendix: one degree more ---------- */
NEW_SLIDES['One degree more'] = {
  h1: 'Why is a day 24 hours, not 23 h 56 m?',
  ctl: `<div class="btns">${V3.btn('od-star', 'One turn against the stars', true)}${V3.btn('od-sun', 'One more degree')}</div><div class="readout" id="od-r"></div>`,
  fig: `<g id="od"></g>`,
  init(el) {
    const SX = 430, SY = 320, OR = 230; let phase = 0, t0 = 0, run = false;
    const E = a => [SX + OR * Math.cos(a), SY + OR * Math.sin(a) * .55], a0 = -.05, a1 = .5;
    const draw = k => {
      k = Math.min(1, k); const a = phase === 0 ? a0 : phase === 1 ? a0 + (a1 - a0) * k : a1, [ex, ey] = E(a);
      // the arm starts pointing at the Sun (and at a far star straight beyond it, to the left)
      const sunDir = Math.atan2(SY - ey, SX - ex), extra = (Math.PI - Math.abs(sunDir)) * (sunDir > 0 ? -1 : 1);
      const dir = phase === 0 ? Math.PI : phase === 1 ? Math.PI : Math.PI + extra * k;
      let s = `<ellipse cx="${SX}" cy="${SY}" rx="${OR}" ry="${OR * .55}" fill="none" stroke="#2e3854" stroke-dasharray="4 6"/>`;
      s += `<circle cx="${SX}" cy="${SY}" r="44" fill="#f0b35a"/>`;
      s += `<line x1="${ex}" y1="${ey}" x2="40" y2="${ey}" stroke="#ece6da" stroke-dasharray="3 6" opacity=".45"/><text x="44" y="${ey - 12}" class="sm mu">to a far star</text>`;
      if (phase) s += `<line x1="${ex}" y1="${ey}" x2="${SX}" y2="${SY}" stroke="#f0b35a" stroke-dasharray="3 6" opacity=".6"/>`;
      const r = 30, mx = ex + r * 1.6 * Math.cos(dir), my = ey + r * 1.6 * Math.sin(dir);
      s += `<circle cx="${ex}" cy="${ey}" r="${r}" fill="#2f5a8c" stroke="#6fb3ff"/><line x1="${ex}" y1="${ey}" x2="${mx}" y2="${my}" stroke="#ece6da" stroke-width="3"/><circle cx="${mx}" cy="${my}" r="5" fill="#ece6da"/>`;
      s += `<text x="${SX}" y="610" text-anchor="middle" class="xs mu">not to scale</text>`;
      CS.$(el, '#od').innerHTML = s;
    };
    const go = p => { phase = p; t0 = performance.now(); run = true; CS.$(el, '#od-r').innerHTML = p === 1 ? '<strong class="big">23 h 56 m</strong><span>The star is back. The Sun is not.</span>' : '<strong class="big">+1° = 4 minutes</strong><span>Now the Sun is back: 24 h.</span>'; };
    CS.$(el, '#od-star').onclick = () => go(1); CS.$(el, '#od-sun').onclick = () => go(2);
    CS.tick(el, t => { if (!run) return; const k = (t - t0) / 2600; draw(k); if (k >= 1) run = false; }); draw(0);
  }
};

/* ---------- Cold open: Scilly, 1707 (replaces the map version) ---------- */
// The period engraving fills the screen. Short lines fade in and out over it, one at a time.
NEW_SLIDES['Scilly, 1707'] = {
  h1: 'Scilly, 22 October 1707',
  fig: '',
  init(el) {
    el.classList.add('wide'); el.querySelector('.text').style.display = 'none';
    // Three presenter steps, no timer: Next (→, space, click) shows screen 1, then screen 2, then the verdict under screen 2.
    const GROUPS = [
      ['22 October 1707.', 'Fog and gales. No sun for days.', 'Admiral Shovell’s fleet sails for home.', 'Twenty-one ships.'],
      ['They know their latitude.', 'Their longitude is a guess.', 'The officers compare their reckonings.', 'All agree: safe in the Channel.']
    ];
    const stage = el.querySelector('.stage');
    stage.innerHTML = `<style>
      .sc-l{display:block;opacity:0;filter:blur(6px);transform:translateY(8px);transition:opacity .7s ease,filter .7s ease,transform .7s ease}
      .sc-l.on{opacity:1;filter:none;transform:none}
    </style>
    <div class="sc-wrap" style="position:absolute;inset:0;overflow:hidden;background:#05070d;cursor:pointer">
      <img src="v3/img/scilly.jpg" alt="Engraving of Admiral Shovell's fleet wrecked on the rocks of Scilly, 1707" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:sepia(.3) brightness(.7) contrast(1.08);transform:scale(1);transform-origin:60% 60%">
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse 60% 55% at 50% 50%,rgba(5,7,13,.72) 0%,rgba(5,7,13,.45) 60%,rgba(5,7,13,.85) 100%)"></div>
      <div style="position:absolute;left:6%;right:6%;top:50%;transform:translateY(-50%);text-align:center;font-family:Georgia,serif;text-shadow:0 2px 18px rgba(0,0,0,.95)">
        <div class="sc-g" style="font-size:clamp(24px,2.7vw,42px);line-height:1.7;letter-spacing:.02em;color:#f3ede2"></div>
        <div class="sc-l sc-v" style="margin-top:.45em;font-size:clamp(48px,6vw,96px);color:#f0b35a;text-shadow:0 2px 28px rgba(0,0,0,.95)">They were wrong.</div>
        <div class="sc-l sc-s" style="margin-top:.5em;font-size:clamp(19px,1.7vw,27px);letter-spacing:.04em;color:#d8d0c2">Four ships on the rocks of Scilly. Up to 2,000 men drowned.</div></div>
      <div style="position:absolute;left:18px;top:12px;font:13px Georgia,serif;color:rgba(236,230,218,.5)">Shovell’s fleet on the rocks of Scilly, 1707 · engraving, public domain</div></div>`;
    const img = stage.querySelector('img'), box = stage.querySelector('.sc-g'), v = stage.querySelector('.sc-v'), sub = stage.querySelector('.sc-s');
    let step = 0, wasActive = false;
    const showGroup = n => { box.innerHTML = GROUPS[n].map((t, k) => `<span class="sc-l" style="transition-delay:${k * 120}ms">${t}</span>`).join(''); requestAnimationFrame(() => requestAnimationFrame(() => box.querySelectorAll('.sc-l').forEach(x => x.classList.add('on')))); };
    const render = () => {
      v.classList.toggle('on', step >= 3); sub.classList.toggle('on', step >= 3); sub.style.transitionDelay = step >= 3 ? '.5s' : '0s';
      if (step === 0) box.innerHTML = ''; else if (step === 1 || step === 2) showGroup(step - 1);
      img.style.transition = 'transform 8s ease-out'; img.style.transform = `scale(${[1, 1.02, 1.04, 1.07][step]})`;
    };
    const advance = () => { if (step < 3) { step++; if (step === 3) { v.classList.add('on'); sub.style.transitionDelay = '.5s'; sub.classList.add('on'); img.style.transition = 'transform 8s ease-out'; img.style.transform = 'scale(1.07)'; } else render(); return true; } return false; };
    const back = () => { if (step > 0) { step--; render(); return true; } return false; };
    stage.querySelector('.sc-wrap').onclick = advance;
    // While this slide is up, Next and Back step through it before leaving it.
    addEventListener('keydown', e => { if (!el.classList.contains('active') || e.target.matches('input,textarea')) return;
      const fwd = e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ', bk = e.key === 'ArrowLeft' || e.key === 'PageUp';
      if ((fwd && advance()) || (bk && back())) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
    const nx = document.getElementById('next'), pv = document.getElementById('prev');
    if (nx) nx.addEventListener('click', e => { if (el.classList.contains('active') && advance()) { e.stopImmediatePropagation(); e.preventDefault(); } }, true);
    if (pv) pv.addEventListener('click', e => { if (el.classList.contains('active') && back()) { e.stopImmediatePropagation(); e.preventDefault(); } }, true);
    const watch = () => { const on = el.classList.contains('active'); if (on && !wasActive) { step = 0; img.style.transition = 'none'; render(); } wasActive = on; requestAnimationFrame(watch); };
    watch();
  }
};
