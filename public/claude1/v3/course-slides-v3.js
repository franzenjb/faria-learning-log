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


// Presenter steps: while `el` is the active slide, Next/Back (arrow keys, space, PageUp/Down, the nav arrows)
// move through `n` steps before leaving the slide. onStep(k) draws step k (0 = nothing yet).
V3.steps = (el, n, onStep) => {
  const api = { k: 0 };
  api.go = k => { api.k = Math.max(0, Math.min(n, k)); onStep(api.k); };
  const fwd = () => api.k < n ? (api.go(api.k + 1), true) : false, back = () => api.k > 0 ? (api.go(api.k - 1), true) : false;
  addEventListener('keydown', e => { if (!el.classList.contains('active') || e.target.matches('input,textarea,select')) return;
    const f = e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ', b = e.key === 'ArrowLeft' || e.key === 'PageUp';
    if ((f && fwd()) || (b && back())) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
  const nx = document.getElementById('next'), pv = document.getElementById('prev');
  if (nx) nx.addEventListener('click', e => { if (el.classList.contains('active') && fwd()) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
  if (pv) pv.addEventListener('click', e => { if (el.classList.contains('active') && back()) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
  let was = false; const watch = () => { const on = el.classList.contains('active'); if (on && !was) api.go(0); was = on; requestAnimationFrame(watch); }; watch();
  api.fwd = fwd; api.back = back; return api;
};
// A reveal's answer belongs on the stage, not in the side panel: mirror any `.readout .big` onto the stage, large.
addEventListener('load', () => {
  document.querySelectorAll('.slide').forEach(sl => {
    const r = sl.querySelector('.readout'), st = sl.querySelector('.stage'); if (!r || !st) return;
    if (getComputedStyle(st).position === 'static') st.style.position = 'relative';
    const pay = document.createElement('div'); pay.className = 'v3-payoff'; st.appendChild(pay);
    const sync = () => { const b = r.querySelector('.big'); let t = b ? b.textContent.trim() : ''; if (t.length > 48) t = ''; if (t !== pay.textContent) { pay.classList.remove('on'); pay.textContent = t; if (t) requestAnimationFrame(() => pay.classList.add('on')); } };
    new MutationObserver(sync).observe(r, { childList: true, subtree: true, characterData: true }); sync();
  });
});


// ---------- Final-gate tuning: per slide, what to hide, the kicker, and the lesson line on the stage ----------
const TALK = /[?&]talk=30\b/.test(location.search);
const V3_TUNE = {
  'Cover': { talk: { coverSub: 'A 30-Minute Talk' } },
  'Mental maps': { h1: 'Mental Maps', talk: { hide: ['#m1q [data-q="1"]', '#m1q [data-q="3"]'] } },
  'Latitude &amp; Longitude': { kicker: '325 BC · Pytheas of Marseille', // just the grid and the bingo card here: Polaris and the Southern Cross wait for Walk North; the Date Line and Null Island come later
    keep: ['[data-k="lat"]', '[data-k="lon"]', '[data-k="grid"]', '#bingo-open', '#g-spin'], noTap: true, hide: ['a[href="/polaris/"]'],
    clickOnLoad: ['#globe-toggles [data-k="lat"].on', '#globe-toggles [data-k="lon"].on', '#globe-toggles [data-k="grid"].on', '#globe-toggles [data-k="polaris"].on', '#globe-toggles [data-k="cities"].on'], hero: '<b>Latitude</b>: 0° at the Equator, 90° at the Pole.', on: { '#fly-nm': '1 Arcminute of <b>Latitude</b> = 1 Nautical Mile', '#fly-north': '<b>Latitude</b>: 0° at the Equator, 90° at the Pole.' } },
  'Walk north': { hide: ['#wn-places', '#wn-south'], clickOnLoad: ['#wn-l-ang', '#wn-l-par'], setRange: { '#wn-lat': 0 }, // opens on the equator with 1 and 2 on; ↑ walks north
    hideText: ['Why They Match', 'North Pole'], hero: '<b>Latitude</b> Is an Angle From the Equator.', on: { '#wn-l-you': 'One Star, One Angle. <b>Latitude</b> Needs No Clock.', '#wn-south': 'In the South, <b>the Southern Cross</b> Points to the Pole.' } },
  'Eratosthenes': { kicker: '240 BC · Eratosthenes of Alexandria' },
  'Hours are slices': {},
  'Two ships, one latitude': { h1: 'Two Ships, One Latitude' },
  'The Longitude Act, 1714': { kicker: 'Seven Years After Scilly', hide: ['#la-r'] },
  'Galileo’s clock': { talk: { hide: ['[data-detour]', '#gs-steps [data-s="5"]'] } },
  'The lunar distance': { kicker: '1767 · Nevil Maskelyne’s Almanac' },
  'A clock that could travel': { h1: 'A Clock That Could Travel' },
  'Washington, 1884': { kicker: 'Washington · October 1884', hide: ['#pm84-r'], hero: 'October 1884: 25 Nations Pick <b>Zero Longitude</b>.' },
  'Where am I, now': { kicker: 'GPS', hero: 'Today: <b>GPS</b>, a Sky Full of Clocks.' }
};
const v3Hero = (el, html) => { let h = el.querySelector('.v3-hero'); const st = el.querySelector('.stage'); if (!st) return; if (!h) { h = document.createElement('div'); h.className = 'v3-hero'; if (getComputedStyle(st).position === 'static') st.style.position = 'relative'; st.appendChild(h); } h.innerHTML = html || ''; };
addEventListener('load', () => setTimeout(() => {
  for (const [t, cfg0] of Object.entries(V3_TUNE)) {
    const el = [...document.querySelectorAll('section')].find(s => s.dataset.title === t || s.getAttribute('data-title') === t.replace(/&amp;/g, '&')); if (!el) continue;
    const cfg = { ...cfg0, ...(TALK && cfg0.talk ? cfg0.talk : {}) }; if (TALK && cfg0.talk && cfg0.hide && cfg.hide !== cfg0.hide) cfg.hide = [...cfg0.hide, ...cfg.hide];
    const text = el.querySelector('.text');
    if (cfg.kicker) { const k = el.querySelector('.kicker'); if (k) k.textContent = cfg.kicker; }
    if (cfg.h1) { const h = text && text.querySelector('h1'); if (h) { h.style.display = 'none'; const n = document.createElement('h1'); n.textContent = cfg.h1; h.after(n); } }
    (cfg.hide || []).forEach(sel => el.querySelectorAll(sel).forEach(x => { x.style.display = 'none'; }));
    if (cfg.keep && text) text.querySelectorAll('button').forEach(b => { if (!cfg.keep.some(sel => b.matches(sel))) b.style.display = 'none'; });
    if (cfg.hideText && text) text.querySelectorAll('button').forEach(b => { if (cfg.hideText.some(w => b.textContent.toLowerCase().includes(w.toLowerCase()))) b.style.display = 'none'; });
    if (cfg.noTap) el.dataset.notap = '1';
    if (cfg.coverSub) { const sub = el.querySelector('.sub'); if (sub) sub.textContent = cfg.coverSub; }
    (cfg.clickOnLoad || []).forEach(sel => { const b = el.querySelector(sel); if (b) b.click(); });
    for (const [sel, v] of Object.entries(cfg.setRange || {})) el.querySelectorAll(sel).forEach(r => { r.value = v; r.dispatchEvent(new Event('input')); });
    if (cfg.hero) v3Hero(el, cfg.hero);
    for (const [sel, html] of Object.entries(cfg.on || {})) el.querySelectorAll(sel).forEach(b => b.addEventListener('click', () => v3Hero(el, html)));
  }
  if (TALK) document.querySelectorAll('.kicker').forEach(k => { k.textContent = k.textContent.replace(/^Day \d+ · /, ''); });
}, 0));

/* ---------- Power decides the measure ---------- */
NEW_SLIDES['Power decides the measure'] = {
  h1: 'Who decides how long a mile is?',
  ctl: `<div class="btns">${V3.btn('pm-rome', 'Rome', true)}${V3.btn('pm-eliz', 'London, 1593')}${V3.btn('pm-sea', 'At Sea')}</div>`,
  fig: `<g id="pm"></g>`,
  init(el) {
    const M = [
      ['pm-rome', 'Rome', '1,000 paces · mille passus', 4860, '#8fb0d8', 'a general’s stride'],
      ['pm-eliz', 'Elizabeth I · 1593', '8 furlongs · 5,280 feet', 5280, '#c9a35e', 'a queen’s statute'],
      ['pm-sea', 'At Sea', '1 arcminute of latitude · 6,076 feet', 6076, '#f0b35a', 'the Earth itself']
    ];
    let shown = 0; const X0 = 90, PX = 720 / 6076;
    const draw = () => {
      let s = '';
      M.forEach((m, i) => { const y = 120 + i * 160, on = i < shown, w = m[3] * PX;
        if (!on) return;
        s += `<g><text x="${X0}" y="${y}" class="lg" style="fill:${m[4]}">${m[1]}</text>
          <rect x="${X0}" y="${y + 20}" width="${on ? w : 0}" height="44" rx="6" fill="${m[4]}" fill-opacity="${i === 2 && shown === 3 ? .9 : .55}" style="transition:width .9s ease"/>
          <text x="${X0 + w + 14}" y="${y + 52}" class="md">${on ? m[3].toLocaleString('en-US') + ' ft' : ''}</text>
          </g>`; });
      if (shown === 3) s += `<text x="500" y="590" text-anchor="middle" class="rd" style="font-size:52px">Only one came from the Earth.</text>`;
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
  <line x1="40" y1="540" x2="960" y2="540" stroke="#6fb3ff" stroke-width="2.5"/><text x="58" y="574" class="md" style="fill:#6fb3ff">North Horizon</text>
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
      s += `<text x="${CX}" y="${CY + 30}" text-anchor="middle" class="rd" style="font-size:84px">${y < 0 ? -y + ' BC' : 'AD ' + y}</text>`;
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
  ctl: `<div class="btns">${V3.btn('pm84-g', 'Greenwich')}${V3.btn('pm84-p', 'Paris')}${V3.btn('pm84-w', 'Washington')}${V3.btn('pm84-f', 'Ferro, Canaries')}</div><div class="btns">${V3.btn('pm84-vote', 'Count the votes', true)}${V3.btn('pm84-fr', 'And Today?')}</div><div class="readout" id="pm84-r"><strong>25 nations. Vote first.</strong></div>`,
  init(el) {
    const C = [['pm84-g', 'Greenwich', 51.48, 0], ['pm84-p', 'Paris', 48.84, 2.34], ['pm84-w', 'Washington', 38.92, -77.07], ['pm84-f', 'Ferro', 27.75, -17.9]];
    let pick = null, stage = 0, t0 = 0;
    const G = V3.globe(el, 'v3-1884', camFor(35, -30, 1), (g, t) => {
      const pulse = .5 + .5 * Math.sin(t / 300);
      C.forEach(([id, n, la, lo]) => {
        const win = stage >= 1 && n === 'Greenwich', fr = stage === 2 && n === 'Paris', dim = stage >= 1 && !win && !fr;
        g.meridian(lo, win ? '#f0b35a' : fr ? `rgba(143,176,216,${.5 + .5 * pulse})` : dim ? 'rgba(236,230,218,.12)' : (pick === id ? '#f0b35a' : 'rgba(143,176,216,.7)'), win || fr ? 3.5 : 2);
        const q = g.dot(la, lo, win ? '#f0b35a' : '#ece6da', win ? 7 : 5); if (q && !dim) g.label(win ? 'Greenwich · 0°' : n, q.x + 12, q.y + (n === 'Paris' ? 30 : 6), win ? '#f0b35a' : '#ece6da', win ? 22 : 18);
      });
    });
    const sync = () => C.forEach(([id]) => CS.$(el, '#' + id).classList.toggle('on', pick === id));
    C.forEach(([id]) => { CS.$(el, '#' + id).onclick = () => { pick = id; stage = 0; sync(); CS.$(el, '#pm84-r').innerHTML = '<strong>Your vote is in.</strong>'; }; });
    CS.$(el, '#pm84-vote').onclick = () => { stage = 1; fly(G.st, camFor(45, -10, 1.5), 1600); CS.$(el, '#pm84-r').innerHTML = '<strong class="big">Greenwich, 22 to 1</strong>'; v3Hero(el, 'San Domingo Against. France and Brazil Abstain.'); };
    CS.$(el, '#pm84-fr').onclick = () => { stage = 1; fly(G.st, camFor(51.48, 0, 6), 1600); CS.$(el, '#pm84-r').innerHTML = '<strong class="big">Power Decides Zero</strong>'; v3Hero(el, 'GPS Zero (WGS 84) Runs <b>335 Feet East</b> of the Greenwich Line.'); };
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
      sats.forEach(s => { const gg = g.geom(), inside = Math.hypot(s.q.x - gg.cx, s.q.y - gg.cy) < gg.R; if (inside && !used.includes(s)) return; const on = used.includes(s); ctx.fillStyle = '#f0b35a'; ctx.globalAlpha = on ? 1 : .7; ctx.beginPath(); ctx.arc(s.q.x, s.q.y, on ? 7 : 5, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; });
      if (mq.z > 0) { ctx.fillStyle = '#6fb3ff'; ctx.beginPath(); ctx.arc(mq.x, mq.y, 6 + (ask && k >= 1 ? 3 * Math.sin(t / 200) : 0), 0, TAU); ctx.fill(); if (ask && k >= 1) g.label('You are here', mq.x + 14, mq.y + 6, '#6fb3ff', 18); }
      if (ask && k >= 1 && !G.done) { G.done = true; CS.$(el, '#gps-r').innerHTML = '<strong class="big">38.9° N, 77.0° W</strong>'; v3Hero(el, '<b>Latitude</b> and <b>Longitude</b> on WGS 84, From Four Clocks in the Sky.<br><b>Where Am I? Answered.</b>'); }
    });
    CS.$(el, '#gps-ask').onclick = () => { ask = 1; t0 = performance.now(); G.done = false; CS.$(el, '#gps-r').innerHTML = ''; v3Hero(el, 'Each Satellite Carries an <b>Atomic Clock</b>.'); };
    CS.$(el, '#gps-re').onclick = () => { ask = 0; CS.$(el, '#gps-r').innerHTML = ''; v3Hero(el, V3_TUNE['Where am I, now'].hero); };
  }
};

/* ---------- Appendix: one degree more ---------- */
NEW_SLIDES['One degree more'] = {
  h1: 'Why a Day Is 24 Hours',
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
    // Four presses. Each replaces the screen; the story gets shorter and bigger as it lands.
    // Built for screen-share: Georgia, no letter-spacing, near-solid dark band behind the type.
    const L = 'font-size:clamp(28px,3.2vw,52px);line-height:1.55';
    const SCREENS = [
      `<div style="${L}">22 October 1707.<br>Fog and gales. No sun for days.<br>Admiral Shovell’s fleet sails for home.<br>Twenty-one ships.</div>`,
      `<div style="${L}"><span style="color:#f0b35a">Latitude</span>, north or south: they can read it from the sky.<br><span style="color:#f0b35a">Longitude</span>, east or west: only a guess.<br>The officers compare their guesses.<br>All agree: safe in the Channel.</div>`,
      `<style>.sc-in{opacity:0;animation:scIn 1s ease forwards}@keyframes scIn{to{opacity:1}}</style>
       <div class="sc-in" style="font-size:clamp(56px,6.8vw,112px);line-height:1.05">They were wrong.</div>
       <div class="sc-in" style="animation-delay:1.1s;margin-top:.15em;font-size:clamp(64px,8vw,132px);line-height:1.05;color:#f0b35a">2,000 died.</div>
       <div class="sc-in" style="animation-delay:2.2s;margin-top:.45em;font-size:clamp(30px,3.4vw,56px);line-height:1.3">They knew their <span style="color:#f0b35a">latitude</span>, not their <span style="color:#f0b35a">longitude</span>.</div>`
    ];
    const LOOK = [[1, 1], [1.015, .95], [1.03, .9], [1.05, .82]];
    const stage = el.querySelector('.stage');
    stage.innerHTML = `<div class="sc-wrap" style="position:absolute;inset:0;overflow:hidden;background:#05070d;cursor:pointer">
      <img src="v3/img/scilly.jpg" alt="Engraving of Admiral Shovell's fleet wrecked on the rocks of Scilly, 1707" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(1) brightness(1) contrast(1.1);transform-origin:60% 60%">
      <div style="position:absolute;inset:0;background:#1a2f5c;mix-blend-mode:multiply;opacity:.35"></div>
      <div class="sc-band" style="position:absolute;left:0;right:0;top:50%;height:56%;transform:translateY(-50%);background:radial-gradient(ellipse 50% 46% at 50% 50%,rgba(5,8,18,.78) 0%,rgba(5,8,18,.55) 55%,rgba(5,8,18,0) 100%);opacity:0;transition:opacity .6s ease"></div>
      <div class="sc-card" style="position:absolute;left:5%;right:5%;top:50%;transform:translateY(-50%);text-align:center;font-family:Georgia,serif;color:#ffffff;text-shadow:0 2px 14px rgba(0,0,0,.9);opacity:0;transition:opacity .5s ease"></div>
      <div style="position:absolute;left:18px;top:12px;font:13px Georgia,serif;color:rgba(236,230,218,.5)">Shovell’s fleet on the rocks of Scilly, 1707 · engraving, public domain</div></div>`;
    const img = stage.querySelector('img'), card = stage.querySelector('.sc-card'), band = stage.querySelector('.sc-band');
    let swap = null;
    const S = V3.steps(el, SCREENS.length, k => { clearTimeout(swap); const [z, b] = LOOK[k];
      img.style.transition = k ? 'transform 8s ease-out, filter 1.2s ease' : 'none'; img.style.transform = `scale(${z})`; img.style.filter = `grayscale(1) brightness(${b}) contrast(1.1)`;
      band.style.opacity = k ? 1 : 0; card.style.opacity = 0;
      if (k) swap = setTimeout(() => { card.innerHTML = SCREENS[k - 1]; card.style.opacity = 1; }, card.innerHTML ? 380 : 0); else card.innerHTML = ''; });
    stage.querySelector('.sc-wrap').onclick = () => S.fwd();
  }
};


/* ---------- Harrison: one line per press, a vote before the payoff ---------- */
NEW_SLIDES['A clock that could travel'] = {
  h1: 'The Carpenter and the Clock',
  fig: `<g id="hv"></g>`,
  init(el) {
    const ph = (k, x, y, w, h) => `<image href="img/harrison-h${k}.jpg" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`;
    const big = (t, y, cls = '', size = 46) => `<text x="500" y="${y}" text-anchor="middle" class="${cls}" style="font-size:${size}px">${t}</text>`;
    const ST = [
      () => `<image href="img/harrison-portrait.jpg" x="360" y="30" width="280" height="350" preserveAspectRatio="xMidYMid meet"/>` + big('John Harrison, village carpenter', 450, '', 46) + big('Born 1693, Yorkshire. Never schooled in science.', 510, 'mu', 28) + `<text x="500" y="634" text-anchor="middle" class="xs mu">Mezzotint after Thomas King, 1767 · public domain</text>`,
      () => ph(1, 30, 60, 300, 330) + ph(2, 350, 60, 300, 330) + ph(3, 670, 60, 300, 330) + big('H1, 1735: it works', 440, '', 26).replace('x="500"', 'x="180"') + big('H2, 1741: sturdier', 440, '', 26) + big('H3, 1759: nineteen years', 440, '', 26).replace('x="500"', 'x="820"') + big('Thirty years. Three clocks. Still too big.', 530, 'mu', 30),
      () => ph(4, 240, 20, 520, 420) + big('H4: 81 days at sea to Jamaica.', 490, '', 40) + big('How many seconds does it lose?', 548, 'rd', 44),
      () => ph(4, 330, 10, 340, 280) + big('5 seconds', 420, 'rd', 120) + big('About 1¼ miles of longitude.', 510, '', 36),
      () => big('The carpenter beat Newton.', 330, 'rd', 72)
    ];
    V3.steps(el, ST.length - 1, k => { CS.$(el, '#hv').innerHTML = ST[k]() + (k >= 1 && k <= 3 ? `<text x="500" y="634" text-anchor="middle" class="xs mu">Harrison’s clocks, Royal Observatory · photos: Tatters, Wikimedia</text>` : ''); });
  }
};

// ---------- Presenter keys: the panel is hidden, its controls live on 1–9, 0, then letters; ↑/↓ moves the first slider ----------
addEventListener('load', () => setTimeout(() => {
  const KEYS = '1234567890qweryuoadghjz'.split('');
  const legend = document.createElement('div'); legend.id = 'v3-keys'; (document.getElementById('visual') || document.body).appendChild(legend);
  const active = () => document.querySelector('#deck .slide.active');
  const controls = el => { const t = el && el.querySelector('.text'); if (!t) return []; const off = b => { for (let n = b; n; n = n.parentElement) { if (n.style && n.style.display === 'none') return true; if (n === t) break; if (getComputedStyle(n).display === 'none') return true; } return false; };
    return [...t.querySelectorAll('button')].filter(b => b.style.display !== 'none' && !b.closest('[hidden]') && !b.hidden && b.textContent.trim() && !off(b)); };
  const slider = el => { const t = el && el.querySelector('.text'); return t && t.style.display !== 'none' ? [...t.querySelectorAll('input[type=range]')].find(x => !x.closest('[hidden]') && x.style.display !== 'none') : null; };
  const label = b => { const L = b.querySelector('.label'), ltr = b.querySelector('.letter'); const t = L ? (ltr ? ltr.textContent + ' ' : '') + L.textContent : b.textContent; return t.replace(/\s+/g, ' ').trim().replace(/^\d+ · /, '').slice(0, 26); };
  const draw = () => { const el = active(); const cs = controls(el).slice(0, KEYS.length), sl = slider(el);
    if (window.v3AutoKeys) setTimeout(() => window.v3AutoKeys(cs.length + (sl ? 1 : 0)), 0); legend.innerHTML = cs.map((b, i) => `<span data-i="${i}"><b>${KEYS[i].toUpperCase()}</b>${label(b)}</span>`).join('') + (sl ? `<span><b>↑↓</b>${(sl.closest('label') && sl.closest('label').querySelector('.row') ? sl.closest('label').querySelector('.row').childNodes[0].textContent.trim() : 'Slider')}</span>` : ''); };
  addEventListener('keydown', e => { if (e.target.matches('input[type=text],textarea') || e.metaKey || e.ctrlKey || e.altKey) return; const k = e.key.toLowerCase(), el = active(); if (!el) return;
    if (k === 'c') { document.body.classList.toggle('v3-panel'); dispatchEvent(new Event('resize')); return; }
    if (k === 'k') { if (window.v3SetKeys) document.getElementById('v3-ctl').click(); else document.body.classList.toggle('v3-keys-on'); return; }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { const sl = slider(el); if (sl) { e.preventDefault(); const st = Math.max(+sl.step || 1, (+sl.max - +sl.min) / 40); sl.value = +sl.value + (e.key === 'ArrowUp' ? st : -st); sl.dispatchEvent(new Event('input', { bubbles: true })); sl.dispatchEvent(new Event('change', { bubbles: true })); } return; }
    const i = KEYS.indexOf(k); if (i < 0) return; const b = controls(el)[i]; if (b) { e.preventDefault(); e.stopImmediatePropagation(); b.click(); setTimeout(draw, 60); } }, true);
  // touch screens have no keyboard: show the legend and let a tap press the control
  // the Controls button lives in the left rail; the list opens in the left panel, which pushes the slide over instead of covering it
  document.body.classList.add('v3-touch');
  const shell = document.getElementById('shell'), lside = document.getElementById('lside'), lsTog = document.getElementById('ls-tog');
  const tg = document.createElement('button'); tg.id = 'v3-ctl'; tg.title = 'Controls (K)'; tg.setAttribute('aria-label', 'Controls'); tg.textContent = '1·2';
  let opened = false; const setKeys = on => { document.body.classList.toggle('v3-keys-on', on); tg.classList.toggle('on', on);
    };
  let manualOff = false; try { manualOff = localStorage.getItem('v3-keys-off') === '1'; } catch (e) {}
  tg.onclick = () => { const on = !document.body.classList.contains('v3-keys-on'); manualOff = !on; try { localStorage.setItem('v3-keys-off', on ? '0' : '1'); } catch (e) {} setKeys(on); }; window.v3SetKeys = setKeys;
  window.v3AutoKeys = n => { const on = document.body.classList.contains('v3-keys-on'); if (n && !on && !manualOff) setKeys(true); else if (!n && on) setKeys(false); };
  (lside || document.getElementById('visual') || document.body).appendChild(tg);
  legend.addEventListener('click', e => { const t = e.target.closest('[data-i]'); if (!t) return; const b = controls(active())[+t.dataset.i]; if (b) { b.click(); setTimeout(draw, 60); } });
  new MutationObserver(draw).observe(document.getElementById('deck'), { subtree: true, attributes: true, attributeFilter: ['class'] }); draw();
}, 50));

// ---------- Opening quiz, driven by the keys Jeff already uses ----------
// → reveals the answer on the globe, then → shows the next question, then → leaves the slide.
// A, B, C, D (or a click on a card) record a vote. ← goes back the same way.
addEventListener('load', () => setTimeout(() => {
  const el = [...document.querySelectorAll('section')].find(s => s.dataset.title === 'Mental maps'); if (!el) return;
  const plan = TALK ? [0, 2] : [0, 1, 2, 3];
  // steps: question, answer, and for Boston vs Rome a third beat: the Gulf Stream and westerlies.
  const S = []; plan.forEach(q => { S.push(['q', q], ['r', q]); if (q === 2) S.push(['g', q]); });
  let ph = 0;
  const showQ = q => { const b = el.querySelector(`#m1q [data-q="${q}"]`); if (b) b.click(); };
  const reveal = () => { const b = el.querySelector('#qz-reveal'); if (b) b.click(); };
  const gulf = () => { const b = el.querySelector('#qz-gulf'); if (b) b.click(); };
  const go = i => { const [k, q] = S[i]; if (k === 'q') showQ(q); else if (k === 'r') { if (S[ph][0] === 'g') gulf(); else { showQ(q); reveal(); } } else gulf(); ph = i; };
  const vote = k => { const b = el.querySelector(`#qz-opts .opt[data-k="${k}"]`); if (b) b.click(); };
  let was = false; const watch = () => { const on = el.classList.contains('active'); if (on && !was) { ph = 0; showQ(S[0][1]); } was = on; requestAnimationFrame(watch); }; watch();
  addEventListener('keydown', e => {
    if (!el.classList.contains('active') || e.metaKey || e.ctrlKey || e.altKey || e.target.matches('input,textarea')) return;
    const k = e.key.toLowerCase(), stop = () => { e.preventDefault(); e.stopImmediatePropagation(); };
    if ('abcd'.includes(k) && k.length === 1) { stop(); if (S[ph][0] === 'q') vote('abcd'.indexOf(k)); return; }
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ' || e.key === 'Enter') {
      if (ph + 1 < S.length) { stop(); go(ph + 1); }
      return; // last beat shown: let the deck move on
    }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { if (ph === 0) return; stop(); go(ph - 1); }
  }, true);
  // iPad: the on-screen arrows and swipes step through the quiz the same way
  const nx = document.getElementById('next'), pv = document.getElementById('prev');
  if (nx) nx.addEventListener('click', e => { if (el.classList.contains('active') && ph + 1 < S.length) { e.preventDefault(); e.stopImmediatePropagation(); go(ph + 1); } }, true);
  if (pv) pv.addEventListener('click', e => { if (el.classList.contains('active') && ph > 0) { e.preventDefault(); e.stopImmediatePropagation(); go(ph - 1); } }, true);
  // clicking a card votes for it (cards are drawn on the canvas)
  const cv = el.querySelector('canvas'); if (cv) cv.addEventListener('click', e => {
    if (S[ph][0] !== 'q') return; const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, w = r.width, h = r.height;
    const cw = Math.min(w * .38, 560), ch = Math.max(70, h * .11), gx = Math.min(w * .03, 36), gy = Math.max(18, h * .03), x0 = w * .5 - cw - gx / 2;
    const col = x < w * .5 ? 0 : 1, row = y < h * .62 ? 0 : 1;
    if (x > x0 && x < x0 + 2 * cw + gx && y > h * .4) vote(row * 2 + col);
  });
}, 0));


/* ---------- Eratosthenes, one idea per press: the well, the stick, the angle, why it matches, 50×, his answer ---------- */
addEventListener('load', () => setTimeout(() => {
  const el = [...document.querySelectorAll('section')].find(x => x.dataset.title === 'Eratosthenes'); if (!el) return;
  const text = el.querySelector('.text'); if (text) text.style.display = 'none'; el.classList.add('wide');
  const stage = el.querySelector('.stage'); stage.innerHTML = '<svg class="fig er-fig" viewBox="0 0 1000 640" preserveAspectRatio="xMidYMid meet"><g id="er"></g></svg>';
  const G = '#f0b35a', W = '#ece6da', B = '#6fb3ff', M = '#9a9382';
  const T = (t, x, y, size, col = W, anchor = 'middle', extra = '') => `<text x="${x}" y="${y}" text-anchor="${anchor}" style="font-size:${size}px;fill:${col}" ${extra}>${t}</text>`;
  const sun = (x, y) => `<circle cx="${x}" cy="${y}" r="34" fill="${G}" opacity=".95"/><circle cx="${x}" cy="${y}" r="54" fill="${G}" opacity=".18"/>`;
  const ground = y => `<line x1="40" y1="${y}" x2="960" y2="${y}" stroke="#4a5470" stroke-width="3"/>`;
  const well = (cx, top, lit) => `<rect x="${cx - 60}" y="${top}" width="120" height="190" fill="#0b1222" stroke="#8a7a5c" stroke-width="6"/>` +
    `<rect x="${cx - 54}" y="${top + 160}" width="108" height="24" fill="${lit ? G : '#1f3554'}" opacity="${lit ? .95 : 1}"/>` +
    (lit ? `<ellipse cx="${cx}" cy="${top + 165}" rx="70" ry="22" fill="${G}" opacity=".25"/>` : '');
  const rays = (x0, x1, y0, y1, n, dx = 0) => Array.from({ length: n }, (_, i) => { const x = x0 + (x1 - x0) * i / (n - 1); return `<line x1="${x}" y1="${y0}" x2="${x + dx}" y2="${y1}" stroke="${G}" stroke-width="3" opacity=".75"/>`; }).join('');
  // the Sun is to the south (toward Syene, on the right), so the ray comes down from the upper right and the shadow points north, to the left
  const stick = (x, base, h, ang) => { const r = ang * Math.PI / 180, sh = h * Math.tan(r), f = 1.8;
    return `<line x1="${x}" y1="${base}" x2="${x - sh}" y2="${base}" stroke="#8a93b0" stroke-width="12" stroke-linecap="round"/>` +
      `<line x1="${x}" y1="${base}" x2="${x}" y2="${base - h}" stroke="${W}" stroke-width="7" stroke-linecap="round"/>` +
      `<line x1="${x - sh + sh * f}" y1="${base - h * f}" x2="${x - sh}" y2="${base}" stroke="${G}" stroke-width="3" opacity=".9"/>` +
      `<text x="${x - sh - 14}" y="${base - 12}" text-anchor="end" style="font-size:24px;fill:#b8bfd4">shadow</text>`; };
  const S = [
    // 5 · his answer, then the class guesses today's, then → shows it
    ...[false, true].map(show => () => { const bar = (y, w, col) => `<rect x="160" y="${y}" width="${w}" height="56" rx="8" fill="${col}"/>`, k = 500 / 25000;
      return T('How close did he get?', 500, 70, 40) +
        T('Eratosthenes, 240 BC', 160, 190, 30, W, 'start') + bar(210, 25000 * k, G) + T('about 25,000 miles', 160 + 25000 * k + 16, 250, 30, G, 'start') +
        T('Today, from satellites', 160, 360, 30, W, 'start') +
        (show ? `<g class="er-in">${bar(380, 24901 * k, B)}${T('24,901 miles', 160 + 24901 * k + 16, 420, 30, B, 'start')}</g>` +
          T('With a stick, a shadow and a paced distance.', 500, 540, 34)
        : T('?', 160, 424, 48, B, 'start') +
          T('Your guess?', 500, 540, 40, G)); })
  ];
  const g = el.querySelector('#er');
  // ---- one continuous camera over a true-scale Earth: well → both cities → the stick's angle → the centre → the whole globe → 50 slices
  const cv = document.createElement('canvas'); cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'; stage.appendChild(cv);
  const svgEl = stage.querySelector('svg'), ctx = cv.getContext('2d');
  const R = 6371, A7 = 7.2 * Math.PI / 180, SY = [0, -R], AX = [-R * Math.sin(A7), -R * Math.cos(A7)];
  // world: km, y down; Syene at the top of the Earth, Alexandria 7.2° round to the left (north). Sunlight comes straight down.
  const KEY = [
    // rot rolls the camera so the ground under the city in view is level (Alexandria's ground is tilted 7.2° from Syene's)
    { w: SY, f: [.5, .64], vh: 0.05, sym: 1.5, rot: 0 },                 // the well
    { w: [-400, -R + 40], f: [.5, .6], vh: 640, sym: 1.05, rot: A7 / 2 }, // both cities on gently curved ground
    { w: AX, f: [.5, .76], vh: 0.05, sym: 1.6, rot: A7 },                // the stick, close, its ground level
    { w: [-400, -R * .5], f: [.5, .5], vh: R * 1.45, sym: .45, rot: 0 }, // the slice down to the centre
    { w: [0, 0], f: [.5, .53], vh: R * 2.45, sym: .35, rot: 0 },         // the whole Earth
    { w: [0, 0], f: [.5, .53], vh: R * 2.45, sym: .35, rot: 0 }          // 50 slices
  ];
  const WORDS = [
    ['Syene, about 240 BC: noon on the longest day of the year', 'The Sun shines straight down the well.'],
    ['Same noon, 500 miles north: Alexandria', 'The same parallel sunlight. Here a stick casts a shadow.'],
    ['Measure the shadow', 'The sunlight comes in 7.2° from straight up.'],
    ['Eureka: the angle at the center is also 7.2°', 'Parallel sunlight, so the two angles match. 500 miles of ground is 7.2° of the circle.'],
    ['360° ÷ 7.2° = 50', '7.2° is one fiftieth of the whole circle.'],
    ['50 × 500 miles = 25,000 miles', 'The size of the Earth, from one shadow.']
  ];
  const NC = KEY.length; let from = KEY[0], to = KEY[0], t0 = 0, step = 0, stepT = 0, cam = { ...KEY[0] };
  const lerp = (a, b, t) => a + (b - a) * t, ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  // pan in step with the zoom (measured in real distance), so the camera pulls back before it travels and never dives into the ground
  const camAt = t => { const e = ease(t), vh = Math.exp(lerp(Math.log(from.vh), Math.log(to.vh), e)), big = Math.max(from.vh, to.vh) / Math.min(from.vh, to.vh) > 3, ep = big ? (vh - from.vh) / (to.vh - from.vh) : e; return { w: [lerp(from.w[0], to.w[0], ep), lerp(from.w[1], to.w[1], ep)], f: [lerp(from.f[0], to.f[0], ep), lerp(from.f[1], to.f[1], ep)], vh, sym: lerp(from.sym, to.sym, e), rot: lerp(from.rot, to.rot, e) }; };
  let shown = false;
  const goCam = k => { const now = performance.now(); from = shown ? { ...cam } : KEY[k]; to = KEY[k]; t0 = now; step = k; stepT = now; shown = true; };
  const font = (px, wt = 400) => `${wt} ${px}px Georgia,serif`;
  const label = (str, x, y, px, col, align = 'center', alpha = 1) => { if (alpha <= 0) return; ctx.globalAlpha = alpha; ctx.font = font(px); const room = cv.clientWidth * .94, tw = ctx.measureText(str).width; if (align === 'center' && tw > room) ctx.font = font(px * room / tw); ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(6,9,18,.85)'; ctx.strokeText(str, x, y); ctx.fillStyle = col; ctx.fillText(str, x, y); ctx.globalAlpha = 1; };
  const vis = (k, now) => { // how visible a step's own layer is: fades in after the camera mostly arrives
    if (step !== k) return 0; return Math.max(0, Math.min(1, (now - stepT - 1300) / 600)); };
  const frame = now => {
    requestAnimationFrame(frame); if (!el.classList.contains('active') || cv.style.display === 'none') return;
    const dpr = devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight; if (!w) return;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    const tt = Math.min(1, (now - t0) / 2400); cam = camAt(tt);
    const sc = h / cam.vh, ax = w * cam.f[0], ay = h * cam.f[1];
    const cr = Math.cos(cam.rot), sr = Math.sin(cam.rot), rv = v => [v[0] * cr - v[1] * sr, v[0] * sr + v[1] * cr];
    const S = p => { const d = rv([(p[0] - cam.w[0]) * sc, (p[1] - cam.w[1]) * sc]); return [ax + d[0], ay + d[1]]; }, sym = cam.sym * Math.min(1, h / 700);
    const P = (th, r = R) => [-r * Math.sin(th), -r * Math.cos(th)]; // th: angle from Syene toward Alexandria
    // the Earth: a fan from the centre over the part that can be on screen
    const span = Math.min(Math.PI, (w / sc) / R * 1.5 + 1e-7), thc = Math.atan2(-cam.w[0], -cam.w[1]);
    const n = 160, arc = []; for (let i = 0; i <= n; i++) arc.push(S(P(thc - span + 2 * span * i / n)));
    const C = S([0, 0]), far = Math.abs(C[0]) > 2e4 || Math.abs(C[1]) > 2e4;
    ctx.beginPath(); if (far) { ctx.moveTo(arc[0][0], arc[0][1]); arc.forEach(q => ctx.lineTo(q[0], q[1])); ctx.lineTo(arc[n][0], h + 4000); ctx.lineTo(arc[0][0], h + 4000); } else { ctx.moveTo(C[0], C[1]); arc.forEach(q => ctx.lineTo(q[0], q[1])); } ctx.closePath();
    if (far) { const ys = Math.min(...arc.map(q => q[1])), lg = ctx.createLinearGradient(0, ys, 0, ys + 220); lg.addColorStop(0, '#2f4466'); lg.addColorStop(.3, '#1d3354'); lg.addColorStop(1, '#122039'); ctx.fillStyle = lg; }
    else { const gr = ctx.createRadialGradient(C[0], C[1], 0, C[0], C[1], R * sc); gr.addColorStop(0, '#0d1830'); gr.addColorStop(.96, '#1d3354'); gr.addColorStop(1, '#2f4466'); ctx.fillStyle = gr; }
    ctx.fill();
    ctx.strokeStyle = '#a08a5c'; ctx.lineWidth = 3; ctx.beginPath(); arc.forEach((q, i) => i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])); ctx.stroke();
    // symbols, drawn at screen size: the well at Syene and the stick at Alexandria, both standing along their own "straight up"
    const sy = S(SY), axp = S(AX), wellW = 46 * sym, wellD = 80 * sym, stickH = 150 * sym;
    const up = rv([-Math.sin(A7), -Math.cos(A7)]), tan = rv([-Math.cos(A7), Math.sin(A7)]), rd = rv([0, 1]);
    const tip = [axp[0] + up[0] * stickH, axp[1] + up[1] * stickH], mu = stickH * Math.tan(A7), shEnd = [axp[0] + tan[0] * mu, axp[1] + tan[1] * mu];
    // sunlight: parallel rays across the whole sky, flowing down (all parallel to the ray down the well)
    const flow = (now / 22) % 28, diag = Math.hypot(w, h) / sc, step0 = 44 / sc, cx0 = cam.w[0];
    ctx.save(); ctx.setLineDash([16, 12]); ctx.lineDashOffset = -flow; ctx.strokeStyle = 'rgba(240,179,90,.28)'; ctx.lineWidth = 2;
    for (let x = Math.floor((cx0 - diag) / step0) * step0; x <= cx0 + diag; x += step0) { const top = S([x, cam.w[1] - diag * 1.5]); const end = Math.abs(x) < R ? S([x, -Math.sqrt(R * R - x * x)]) : S([x, cam.w[1] + diag * 1.5]); ctx.beginPath(); ctx.moveTo(top[0], top[1]); ctx.lineTo(end[0], end[1]); ctx.stroke(); }
    ctx.restore();
    const symA = Math.max(0, Math.min(1, (cam.sym - .5) / .3)); ctx.globalAlpha = Math.max(.25, symA);
    // the two rays that matter: straight down the well, and the one past the top of the stick
    ctx.strokeStyle = '#f0b35a'; ctx.lineWidth = 3.5; const FAR = Math.hypot(w, h) * 2;
    ctx.beginPath(); ctx.moveTo(sy[0] - rd[0] * FAR, sy[1] - rd[1] * FAR); ctx.lineTo(sy[0] + rd[0] * wellD * .9, sy[1] + rd[1] * wellD * .9); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(shEnd[0] - rd[0] * FAR, shEnd[1] - rd[1] * FAR); ctx.lineTo(shEnd[0], shEnd[1]); ctx.stroke();
    ctx.globalAlpha = symA;
    // well
    ctx.save(); ctx.translate(sy[0], sy[1]); ctx.rotate(cam.rot); ctx.fillStyle = '#070b16'; ctx.fillRect(-wellW / 2, 0, wellW, wellD); ctx.strokeStyle = '#a08a5c'; ctx.lineWidth = Math.max(2, 5 * sym); ctx.strokeRect(-wellW / 2, 0, wellW, wellD);
    ctx.fillStyle = '#f0b35a'; ctx.fillRect(-wellW / 2 + 3, wellD * .82, wellW - 6, wellD * .14); ctx.restore();
    // stick and its shadow (the shadow points north, away from the Sun)
    ctx.lineCap = 'round'; ctx.strokeStyle = '#8a93b0'; ctx.lineWidth = Math.max(3, 10 * sym); ctx.beginPath(); ctx.moveTo(axp[0], axp[1]); ctx.lineTo(shEnd[0], shEnd[1]); ctx.stroke();
    ctx.strokeStyle = '#ece6da'; ctx.lineWidth = Math.max(2.5, 7 * sym); ctx.beginPath(); ctx.moveTo(axp[0], axp[1]); ctx.lineTo(tip[0], tip[1]); ctx.stroke(); ctx.lineCap = 'butt';
    ctx.globalAlpha = 1 - symA; if (1 - symA > 0) [sy, axp].forEach(q => { ctx.fillStyle = '#f0b35a'; ctx.beginPath(); ctx.arc(q[0], q[1], 7, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#0a0e18'; ctx.lineWidth = 2; ctx.stroke(); }); ctx.globalAlpha = 1;
    // the Sun, only in the first view
    const sunA = step === 0 ? Math.min(1, (now - stepT) / 400) : Math.max(0, 1 - (now - stepT) / 500);
    if (sunA > 0) { ctx.globalAlpha = sunA; const sx = sy[0], syy = Math.max(70, sy[1] - 330 * Math.min(1, h / 800)); const sg = ctx.createRadialGradient(sx, syy, 0, sx, syy, 80); sg.addColorStop(0, 'rgba(255,214,107,1)'); sg.addColorStop(.45, 'rgba(240,179,90,.9)'); sg.addColorStop(1, 'rgba(240,179,90,0)'); ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sx, syy, 80, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
    // labels for the two cities
    const near = sc > 0.3 && sc < 50; // only when the cities sit at sensible screen distances
    const cityA = step === 1 || step === 3 ? Math.min(1, (now - stepT - 1400) / 500) : 0;
    if (step === 0) label('Syene', sy[0] + wellW, sy[1] + wellD + 34, 24, '#9a9382', 'left', Math.min(1, (now - stepT) / 500));
    label('Syene', sy[0] + 14, sy[1] - 26, 22, '#cfc8ba', 'left', cityA); label('Alexandria', axp[0] - 14, axp[1] - 26, 22, '#cfc8ba', 'right', cityA);
    // 500 miles along the ground
    const milesA = Math.max(vis(1, now), vis(3, now));
    if (milesA > 0) { ctx.globalAlpha = milesA; const off = step === 1 ? 40 : 22; ctx.strokeStyle = '#f0b35a'; ctx.lineWidth = 3; ctx.setLineDash([8, 7]); ctx.beginPath(); for (let i = 0; i <= 40; i++) { const q = S(P(A7 * i / 40, R + off / sc)); i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); } ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
      const m = step === 3 ? S(P(A7 / 2, R - 46 / sc)) : S(P(A7 / 2, R + (off + 30) / sc)); label('500 miles', m[0], m[1], 26, '#f0b35a', step === 3 ? 'left' : 'center', milesA); }
    // the angle at the top of the stick: between straight up (dashed) and the sunlight
    const angA = vis(2, now);
    if (angA > 0) { ctx.globalAlpha = angA; const L = stickH * .9; ctx.strokeStyle = 'rgba(236,230,218,.75)'; ctx.lineWidth = 2; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(tip[0], tip[1]); ctx.lineTo(tip[0] + up[0] * L, tip[1] + up[1] * L); ctx.stroke(); ctx.setLineDash([]);
      const r = stickH * .62, a0 = Math.atan2(up[1], up[0]), a1 = Math.atan2(-rd[1], -rd[0]); ctx.strokeStyle = '#f0b35a'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(tip[0], tip[1], r, Math.min(a0, a1), Math.max(a0, a1)); ctx.stroke(); ctx.globalAlpha = 1;
      label('7.2°', tip[0] + 44, tip[1] - r * .75, 58, '#f0b35a', 'left', angA); label('straight up', tip[0] - 14, tip[1] + up[1] * L, 20, '#9a9382', 'right', angA); label('sunlight', tip[0] - rd[0] * stickH * 1.3 + 22, tip[1] - rd[1] * stickH * 1.3, 22, '#f0b35a', 'left', angA); label('stick', axp[0] + 16, axp[1] - stickH * .4, 22, '#ece6da', 'left', angA); label('shadow', shEnd[0] - 10, shEnd[1] + 30, 20, '#b8bfd4', 'right', angA); }
    // the centre of the Earth: both "straight up" lines meet there at the same 7.2°
    const cenA = step >= 3 ? (step === 3 ? vis(3, now) : 1) : 0;
    if (cenA > 0 && !far) { ctx.globalAlpha = cenA; ctx.strokeStyle = '#ece6da'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(C[0], C[1]); ctx.lineTo(sy[0], sy[1]); ctx.moveTo(C[0], C[1]); ctx.lineTo(axp[0], axp[1]); ctx.stroke();
      if (step <= 4) { ctx.fillStyle = 'rgba(240,179,90,.35)'; ctx.beginPath(); ctx.moveTo(C[0], C[1]); ctx.arc(C[0], C[1], R * sc, -Math.PI / 2 - A7, -Math.PI / 2); ctx.closePath(); ctx.fill(); }
      const rr = Math.min(R * sc * .3, 160); ctx.strokeStyle = '#f0b35a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(C[0], C[1], rr, -Math.PI / 2 - A7, -Math.PI / 2); ctx.stroke(); ctx.globalAlpha = 1;
      if (step === 3) { label('7.2°', C[0] - 24, C[1] - rr - 34, 46, '#f0b35a', 'right', cenA); label('center of the Earth', C[0] + 16, C[1] - 18, 22, '#9a9382', 'left', cenA); } }
    // the whole circle in fiftieths
    if (step === 5 && !far) { const k5 = Math.max(0, Math.min(50, Math.floor((now - stepT - 1200) / 70) + 1)), RR = R * sc;
      for (let i = 0; i < k5; i++) { const a0 = -Math.PI / 2 - A7 * (i + 1), a1 = -Math.PI / 2 - A7 * i; ctx.fillStyle = i % 2 ? 'rgba(240,179,90,.20)' : 'rgba(240,179,90,.42)'; ctx.beginPath(); ctx.moveTo(C[0], C[1]); ctx.arc(C[0], C[1], RR, a0, a1); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(236,230,218,.55)'; ctx.lineWidth = 1; ctx.stroke(); }
      if (k5 >= 50) label('25,000 miles', C[0], C[1], 60, '#f0b35a', 'center', Math.min(1, (now - stepT - 4800) / 500)); else label(String(k5), C[0], C[1], 64, '#f0b35a', 'center'); }
    if (step === 4 && !far) { const RR = R * sc; ctx.strokeStyle = 'rgba(236,230,218,.25)'; ctx.lineWidth = 1; for (let i = 1; i < 50; i++) { const a = -Math.PI / 2 - A7 * i; ctx.globalAlpha = vis(4, now); ctx.beginPath(); ctx.moveTo(C[0], C[1]); ctx.lineTo(C[0] + RR * Math.cos(a), C[1] + RR * Math.sin(a)); ctx.stroke(); } ctx.globalAlpha = 1; }
    // words
    const [top, cap] = WORDS[step], wa = Math.min(1, (now - stepT) / 600);
    label(top, w / 2, h * .075, Math.max(28, Math.min(48, w * .034)), step >= 4 ? '#f0b35a' : '#ece6da', 'center', wa);
    label(cap, w / 2, h * .92, Math.max(20, Math.min(32, w * .024)), '#f0b35a', 'center', wa);
  };
  requestAnimationFrame(frame);
  V3.steps(el, NC + S.length - 1, k => { if (k < NC) { cv.style.display = 'block'; svgEl.style.display = 'none'; goCam(k); } else { cv.style.display = 'none'; svgEl.style.display = 'block'; shown = false; g.innerHTML = `<g class="er-in">${S[k - NC]()}</g>`; } });
  const st = document.createElement('style'); st.textContent = '.er-fig{padding:1rem 1.5rem!important}.er-in{animation:erIn .5s ease}@keyframes erIn{from{opacity:0}to{opacity:1}}'; document.head.appendChild(st);
}, 0));


/* ---------- The Earth is a 24-hour clock: the globe, tip it to the pole, 24 hours, 15° slices, longitude, then the problem ---------- */
addEventListener('load', () => setTimeout(() => {
  const el = [...document.querySelectorAll('section')].find(x => x.dataset.title === 'Hours are slices'); if (!el || typeof drawCoast !== 'function') return;
  const text = el.querySelector('.text'); if (text) text.style.display = 'none'; el.classList.add('wide');
  const stage = el.querySelector('.stage'); stage.innerHTML = '<canvas class="hc-c" style="position:absolute;inset:0;width:100%;height:100%;display:block"></canvas>';
  const c = stage.querySelector('canvas'), ctx = c.getContext('2d'), D = Math.PI / 180;
  const G = '#f0b35a', W = '#ece6da', M = '#9a9382';
  const STEP = [
    { top: 'The Earth', cap: 'It turns, all day, every day.' },
    { top: 'Tip it over', cap: 'Look straight down on the North Pole.' },
    { top: 'One turn every 24 hours', cap: '' },
    { top: '360° ÷ 24 hours = 15° an hour', cap: 'Cut the Earth into 24 slices, one for each hour.' },
    { top: 'Those slices are longitude', cap: 'How far east or west you are: 15° for every hour.' },
    { top: 'So how do you measure it?', cap: 'Latitude had Polaris. Longitude has no star, and the sky never stops turning.' }
  ];
  let k = 0, pitch = 0.3, pT = 0.3, yaw = 0, t0 = performance.now(), last = performance.now();
  const go = i => { k = i; pT = k === 0 ? 0.3 : Math.PI / 2; t0 = performance.now(); };
  V3.steps(el, STEP.length - 1, go);
  const font = (px, w = 400) => `${w} ${px}px Georgia,serif`;
  const label = (s, x, y, px, col, align = 'center') => { ctx.font = font(px); const room = c.width / (devicePixelRatio || 1) * .92, tw = ctx.measureText(s).width; if (align === 'center' && tw > room) { px = px * room / tw; ctx.font = font(px); } ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(8,12,22,.85)'; ctx.strokeText(s, x, y); ctx.fillStyle = col; ctx.fillText(s, x, y); };
  const frame = now => {
    requestAnimationFrame(frame); if (!el.classList.contains('active')) { last = now; return; }
    const r = stage.getBoundingClientRect(), dpr = devicePixelRatio || 1; if (!r.width) return;
    if (c.width !== Math.round(r.width * dpr)) { c.width = Math.round(r.width * dpr); c.height = Math.round(r.height * dpr); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); const w = r.width, h = r.height; ctx.clearRect(0, 0, w, h);
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    pitch += (pT - pitch) * Math.min(1, dt * 2.2); yaw += dt * (k >= 2 ? .35 : .12);
    const cx = w / 2, cy = h * .53, R = Math.min(w, h) * .3;
    const proj = v => { const cyw = Math.cos(yaw), syw = Math.sin(yaw), x1 = v[0] * cyw + v[2] * syw, z1 = v[2] * cyw - v[0] * syw, y1 = v[1];
      const cp = Math.cos(pitch), sp = Math.sin(pitch), y2 = y1 * cp - z1 * sp, z2 = y1 * sp + z1 * cp; return { x: cx + R * x1, y: cy - R * y2, z: z2 }; };
    const path = (pts, col, wd, dash) => { ctx.strokeStyle = col; ctx.lineWidth = wd; ctx.setLineDash(dash || []); ctx.beginPath(); let pen = false; for (const p of pts) { const q = proj(p); if (q.z >= 0) { pen ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); pen = true; } else pen = false; } ctx.stroke(); ctx.setLineDash([]); };
    // the globe
    const g = ctx.createRadialGradient(cx - R * .35, cy - R * .35, R * .05, cx, cy, R); g.addColorStop(0, '#2f5a8c'); g.addColorStop(.7, '#15294a'); g.addColorStop(1, '#0b1526');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    path(Array.from({ length: 73 }, (_, i) => ll(0, i * 5)), 'rgba(240,179,90,.5)', 1.5);
    drawCoast(ctx, proj, 1, { color: 'rgba(236,230,218,.8)' });
    // night: from above the pole, the half away from the Sun (the Sun is to the right)
    if (k >= 2) { ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, Math.PI / 2, Math.PI * 1.5); ctx.closePath(); ctx.fillStyle = 'rgba(3,6,14,.55)'; ctx.fill(); ctx.restore();
      ctx.fillStyle = G; ctx.beginPath(); ctx.arc(w - 70, cy, 26, 0, Math.PI * 2); ctx.fill(); for (let i = -2; i <= 2; i++) { ctx.strokeStyle = 'rgba(240,179,90,.5)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(w - 110, cy + i * R * .35); ctx.lineTo(cx + R + 30, cy + i * R * .35); ctx.stroke(); }
      label('Sun', w - 70, cy + 50, 22, G); label('day', cx + R * .55, cy - R - 26, 22, W); label('night', cx - R * .55, cy - R - 26, 22, M); }
    // the 24-hour dial around the globe
    if (k >= 2) { for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, r1 = R + 8, r2 = R + (i % 6 ? 18 : 30); ctx.strokeStyle = i % 6 ? 'rgba(236,230,218,.45)' : W; ctx.lineWidth = i % 6 ? 1.5 : 3; ctx.beginPath(); ctx.moveTo(cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)); ctx.lineTo(cx + r2 * Math.cos(a), cy + r2 * Math.sin(a)); ctx.stroke(); }
      }
    // 24 slices, one lit; they ride on the Earth
    if (k >= 3) { const lit = i => k < 5 && (i === 18 || i === 19); for (let i = 0; i < 24; i++) path(Array.from({ length: 19 }, (_, j) => ll(-90 + j * 10, i * 15)), lit(i) ? G : 'rgba(236,230,218,.35)', lit(i) ? 3 : 1.2);
      if (k < 5) { const qa = proj(ll(20, -82.5)); if (qa.z > 0) label('15°', qa.x, qa.y, 28, G); } }
    if (k === 4) { const q = proj(ll(5, -150)); if (q.z > 0) label('longitude', q.x, q.y, 24, W); }
    if (k === 5) { ctx.fillStyle = 'rgba(5,8,18,.45)'; ctx.fillRect(0, 0, w, h); label('?', cx, cy, R * .9, G); }
    // words
    const s = STEP[k], fade = Math.min(1, (now - t0) / 500); ctx.globalAlpha = fade;
    label(s.top, cx, h * .08, Math.max(30, Math.min(54, w * .04)), W);
    if (s.cap) label(s.cap, cx, h * .905, Math.max(22, Math.min(34, w * .026)), G);
    ctx.globalAlpha = 1;
  };
  requestAnimationFrame(frame);
}, 0));




/* ---------- Scene engine: one canvas, a 1600×1000 virtual stage, steps on → / ← (and the on-screen arrows) ---------- */
V3.scene = (el, n, draw) => {
  const text = el.querySelector('.text'); if (text) text.style.display = 'none'; el.classList.add('wide', 'v3-scene');
  const stage = el.querySelector('.stage'); if (getComputedStyle(stage).position === 'static') stage.style.position = 'relative';
  [...stage.children].forEach(c => { c.style.display = 'none'; });
  const cv = document.createElement('canvas'); cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;z-index:5'; stage.appendChild(cv);
  const ctx = cv.getContext('2d');
  const S = { step: 0, prev: 0, t0: performance.now(), ctx };
  const clamp = v => Math.max(0, Math.min(1, v));
  S.clamp = clamp; S.lerp = (a, b, t) => a + (b - a) * t; S.ease = t => { t = clamp(t); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  S.age = now => now - S.t0; S.fade = (now, delay = 0, dur = 500) => clamp((now - S.t0 - delay) / dur);
  S.text = (str, x, y, px, col = '#ece6da', align = 'center', alpha = 1, wt = 400, maxW = 1520, plain = false) => { if (alpha <= 0 || !str) return; ctx.save(); ctx.globalAlpha *= alpha; ctx.font = `${wt} ${px}px Georgia,serif`; const tw = ctx.measureText(str).width; if (tw > maxW) ctx.font = `${wt} ${px * maxW / tw}px Georgia,serif`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; if (!plain) { ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(6,9,18,.85)'; ctx.strokeText(str, x, y); } ctx.fillStyle = col; ctx.fillText(str, x, y); ctx.restore(); };
  S.words = (now, top, cap, topCol = '#ece6da') => { const a = S.fade(now, 0, 600); S.text(top, 800, 70, 46, topCol, 'center', a); S.text(cap, 800, 905, 30, '#f0b35a', 'center', a); };
  S.card = (x, y, w, h, title, big, sub, col, alpha = 1) => { if (alpha <= 0) return; ctx.save(); ctx.globalAlpha *= alpha; ctx.fillStyle = 'rgba(14,20,36,.94)'; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x, y, w, h, 14); ctx.fill(); ctx.stroke(); ctx.restore(); S.text(title, x + 22, y + 34, 26, col, 'left', alpha); S.text(big, x + 22, y + h / 2 + 12, 52, '#ece6da', 'left', alpha); if (sub) S.text(sub, x + 22, y + h - 26, 20, '#9a9382', 'left', alpha); };
  const STARS = Array.from({ length: 220 }, (_, i) => [((i * 7919) % 1600), ((i * 104729) % 1000), .4 + ((i * 31) % 10) / 12, (i * 17) % 7]);
  S.stars = (now, alpha = 1) => { ctx.save(); STARS.forEach(([x, y, r, p]) => { ctx.globalAlpha = alpha * (.35 + .45 * Math.abs(Math.sin(now * .0006 + p))); ctx.fillStyle = '#dfe7ff'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }); ctx.restore(); };
  V3.steps(el, n - 1, k => { S.prev = S.step; S.step = k; S.t0 = performance.now(); });
  const frame = now => {
    requestAnimationFrame(frame); if (!el.classList.contains('active')) return;
    const dpr = devicePixelRatio || 1, cw = cv.clientWidth, ch = cv.clientHeight; if (!cw) return;
    if (cv.width !== Math.round(cw * dpr) || cv.height !== Math.round(ch * dpr)) { cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr); }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, cw, ch);
    const k = Math.min(cw / 1600, ch / 1000); ctx.setTransform(dpr * k, 0, 0, dpr * k, dpr * (cw - 1600 * k) / 2, dpr * (ch - 1000 * k) / 2);
    draw(S, ctx, now);
  };
  requestAnimationFrame(frame); return S;
};
const v3Find = t => [...document.querySelectorAll('section')].find(x => x.dataset.title === t);
// a rotatable globe on the virtual stage: yaw/pitch in degrees/radians, ll() and drawCoast() come from the deck
V3.orbitProj = (cam) => { const D = Math.PI / 180, cy = Math.cos(cam.yaw * D), sy = Math.sin(cam.yaw * D), cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
  return v => { const x1 = v[0] * cy + v[2] * sy, z1 = v[2] * cy - v[0] * sy, y1 = v[1]; const y2 = y1 * cp - z1 * sp, z2 = y1 * sp + z1 * cp; return { x: cam.cx + cam.R * x1, y: cam.cy - cam.R * y2, z: z2 }; }; };

/* ---------- 7 · Longitude has no landmarks: two ships, one star, then the Earth turns under the Sun ---------- */
addEventListener('load', () => setTimeout(() => {
  const el = v3Find('Two ships, one latitude'); if (!el || typeof drawCoast !== 'function' || typeof ll !== 'function') return;
  const D = Math.PI / 180, G = '#f0b35a', W = '#ece6da', M = '#9a9382', B = '#6fb3ff', RED = '#ff7d6f', L1 = 0, LAT = 51.5;
  const CAM = [{ yaw: -78, pitch: .55, R: 720, cy: 910 }, { yaw: -75, pitch: .55, R: 720, cy: 910 }, { yaw: -40, pitch: Math.PI / 2, R: 320, cy: 490 }, { yaw: -40, pitch: Math.PI / 2, R: 320, cy: 490 }, { yaw: 30, pitch: Math.PI / 2, R: 320, cy: 490 }];
  let cam = { ...CAM[0] }, from = { ...CAM[0] }, last = 0;
  const WORDS = [
    ['London, and a ship leaving port, both at 51.5° N', 'Both measure Polaris: 51.5° above the horizon. Same latitude.'],
    ['The ship sails west', 'Polaris still reads 51.5°. The star cannot tell the ship from London.'],
    ['Look down on the North Pole and let the Earth turn', 'London and the ship each set their clocks by their own noon: the Sun at its highest.'],
    ['London reaches noon first', '30° of longitude = 2 hours. East and west are written in time, not in the sky.'],
    ['So what time is it in London?', 'The ship knows its own noon. To know its longitude, it must carry London time.']];
  const t12 = h => { h = ((h % 24) + 24) % 24; const hh = Math.floor(h), mm = Math.round((h - hh) * 60) % 60, H = hh % 12 || 12; return `${H}:${String(mm).padStart(2, '0')} ${hh < 12 ? 'AM' : 'PM'}`; };
  const ship = (ctx, x, y, col) => { ctx.save(); ctx.translate(x, y); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(14, 0); ctx.lineTo(9, 7); ctx.lineTo(-9, 7); ctx.closePath(); ctx.fill(); ctx.fillRect(-1, -20, 2, 20); ctx.beginPath(); ctx.moveTo(1, -19); ctx.lineTo(12, -4); ctx.lineTo(1, -4); ctx.fill(); ctx.restore(); };
  V3.scene(el, 5, (S, ctx, now) => {
    if (S.t0 !== last) { from = { ...cam }; last = S.t0; }
    const age = S.age(now), e = S.ease(age / 2000), T = CAM[S.step];
    cam = { yaw: S.lerp(from.yaw, T.yaw, e), pitch: S.lerp(from.pitch, T.pitch, e), R: S.lerp(from.R, T.R, e), cy: S.lerp(from.cy, T.cy, e) };
    if (S.step === 3 && age > 2000) cam.yaw = -40 + 70 * S.clamp((age - 2000) / 9000);
    const P = V3.orbitProj({ ...cam, cx: 800 }), polar = S.clamp((cam.pitch - .45) / (Math.PI / 2 - .45));
    S.stars(now, .8);
    // the Sun on the right, once we look down on the pole
    const sunA = S.step >= 2 ? polar : 0;
    if (sunA > 0) { ctx.save(); ctx.globalAlpha = sunA; const sx = 800 + cam.R + 300; const sg = ctx.createRadialGradient(sx, cam.cy, 0, sx, cam.cy, 90); sg.addColorStop(0, '#ffe39a'); sg.addColorStop(.4, G); sg.addColorStop(1, 'rgba(240,179,90,0)'); ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sx, cam.cy, 90, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(240,179,90,.35)'; ctx.lineWidth = 2; ctx.setLineDash([14, 12]); ctx.lineDashOffset = now / 30; for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(sx - 80, cam.cy + i * cam.R * .3); ctx.lineTo(800 + cam.R + 20, cam.cy + i * cam.R * .3); ctx.stroke(); } ctx.restore(); S.text('Sun', sx, cam.cy + 120, 26, G, 'center', sunA); }
    // Polaris over the pole while we look from the side
    const polA = 1 - polar;
    if (polA > 0) { const np = P([0, 1, 0]), st = P([0, 1.27, 0]); ctx.save(); ctx.globalAlpha = polA; ctx.strokeStyle = 'rgba(111,179,255,.5)'; ctx.setLineDash([5, 7]); ctx.beginPath(); ctx.moveTo(np.x, np.y); ctx.lineTo(st.x, st.y); ctx.stroke(); ctx.setLineDash([]); const g = ctx.createRadialGradient(st.x, st.y, 0, st.x, st.y, 26); g.addColorStop(0, '#fff'); g.addColorStop(.3, 'rgba(111,179,255,.9)'); g.addColorStop(1, 'rgba(111,179,255,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(st.x, st.y, 26, 0, 7); ctx.fill(); ctx.restore(); S.text('Polaris', st.x + 30, st.y, 26, '#dfe7ff', 'left', polA); }
    // the globe
    const gr = ctx.createRadialGradient(800 - cam.R * .35, cam.cy - cam.R * .35, cam.R * .05, 800, cam.cy, cam.R); gr.addColorStop(0, '#2f5a8c'); gr.addColorStop(.7, '#15294a'); gr.addColorStop(1, '#0b1526');
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(800, cam.cy, cam.R, 0, 7); ctx.fill();
    const path = (pts, col, wd, dash) => { ctx.strokeStyle = col; ctx.lineWidth = wd; ctx.setLineDash(dash || []); ctx.beginPath(); let pen = false; for (const p of pts) { const q = P(p); if (q.z >= 0) { pen ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); pen = true; } else pen = false; } ctx.stroke(); ctx.setLineDash([]); };
    for (let lo = 0; lo < 360; lo += 15) path(Array.from({ length: 37 }, (_, i) => ll(-90 + i * 5, lo)), 'rgba(236,230,218,.09)', 1);
    path(Array.from({ length: 73 }, (_, i) => ll(0, i * 5)), 'rgba(236,230,218,.25)', 1.2);
    drawCoast(ctx, P, 1, { color: 'rgba(236,230,218,.75)' });
    path(Array.from({ length: 145 }, (_, i) => ll(LAT, i * 2.5)), G, 3);
    // night half, from above the pole
    if (sunA > 0) { ctx.save(); ctx.globalAlpha = sunA; ctx.beginPath(); ctx.arc(800, cam.cy, cam.R, Math.PI / 2, Math.PI * 1.5); ctx.closePath(); ctx.fillStyle = 'rgba(3,6,14,.5)'; ctx.fill();
      ctx.strokeStyle = 'rgba(240,179,90,.6)'; ctx.setLineDash([8, 8]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(800, cam.cy); ctx.lineTo(800 + cam.R, cam.cy); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
      S.text('noon', 800 + cam.R - 10, cam.cy - 22, 24, G, 'right', sunA); S.text('midnight', 800 - cam.R + 10, cam.cy - 22, 24, M, 'left', sunA); }
    ctx.strokeStyle = '#3b5f8a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(800, cam.cy, cam.R, 0, 7); ctx.stroke();
    // the ships
    const L2 = S.step === 0 ? -3 : S.step === 1 ? S.lerp(-3, -30, S.ease((age - 300) / 2500)) : -30;
    const ships = [[L1, 'London', G], [L2, 'Ship', B]];
    if (S.step === 1 || S.step === 0) { const q1 = P(ll(LAT, L1)), q2 = P(ll(LAT, L2)); if (S.step === 1 && q1.z > 0 && q2.z > 0) { path(Array.from({ length: 30 }, (_, i) => ll(LAT, L1 + (L2 - L1) * i / 29)), RED, 5); const mi = Math.round(Math.abs(L2 - L1) * 43.06 / 10) * 10; S.text(`${mi.toLocaleString('en-US')} miles apart`, (q1.x + q2.x) / 2 + 40, Math.max(q1.y, q2.y) + 80, 30, RED); } }
    ships.forEach(([lo, name, col], i) => { const q = P(ll(LAT, lo)); if (q.z < 0) return; if (i) ship(ctx, q.x, q.y, col); else { ctx.fillStyle = col; ctx.fillRect(q.x - 9, q.y - 14, 18, 14); ctx.beginPath(); ctx.moveTo(q.x - 12, q.y - 14); ctx.lineTo(q.x, q.y - 26); ctx.lineTo(q.x + 12, q.y - 14); ctx.fill(); }
      if (S.step <= 1) S.text(`${name}: Polaris 51.5° up`, q.x + (i ? -24 : 24), i ? q.y + 34 : q.y - 44, 24, col, i ? 'right' : 'left', S.fade(now, 600));
      else { const th = ((lo + cam.yaw + 540) % 360) - 180, hrs = 12 + th / 15, noon = Math.abs(th) < 2.2;
        if (noon && S.step === 3) { ctx.save(); ctx.strokeStyle = G; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(q.x, q.y, 34 + 6 * Math.sin(now / 90), 0, 7); ctx.stroke(); ctx.restore(); }
        const lx = q.x + (i ? -26 : 26), ly = q.y + (i ? 34 : -30), shown = i === 0 && S.step === 4 ? '?' : noon && S.step >= 3 ? 'NOON' : t12(hrs); S.text(`${name} · ${shown}`, lx, ly, 26, noon && S.step >= 3 ? G : col, i ? 'right' : 'left', polar); } });
    // 30° = 2 hours, measured at the pole
    if (S.step >= 3) { const a1 = -(L1 + cam.yaw) * D, a2 = -(L2 + cam.yaw) * D, r = cam.R * .42, A = S.fade(now, 1000); ctx.save(); ctx.globalAlpha = A; ctx.strokeStyle = G; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(800, cam.cy, r, Math.min(a1, a2), Math.max(a1, a2)); ctx.stroke(); ctx.restore(); const am = (a1 + a2) / 2; S.text('30° = 2 hours', 800 + r * .55 * Math.cos(am), cam.cy + r * .55 * Math.sin(am), 28, G, 'center', A); }
    // London: on the globe, its time unknown to the ships
    if (S.step === 4) {
      S.card(40, 300, 330, 150, 'The ship’s clock', '12:00', 'set by its own noon', B, S.fade(now, 1800)); S.card(40, 490, 330, 150, 'London', '?', 'left behind', G, S.fade(now, 2400)); }
    S.words(now, ...WORDS[S.step]);
  });
}, 0));

/* ---------- 10 · Way 2: the Moon is a clock hand. Time-lapse, measure, look it up, then the rolling deck ---------- */
addEventListener('load', () => setTimeout(() => {
  const el = v3Find('The lunar distance'); if (!el) return;
  const G = '#f0b35a', W = '#ece6da', M = '#9a9382', RED = '#ff7d6f';
  const REG = [1180, 330], PXD = 13.5, dist = h => 44.1 - .6 * (h - 6); // 0.6° an hour against the stars
  const moonAt = h => [430 + (h - 6) * 64, 470 - (h - 6) * 16]; // not to scale: the Moon moves about its own width each hour
  const dm = d => { const deg = Math.floor(d), min = Math.round((d - deg) * 60); return `${deg}° ${String(min).padStart(2, '0')}′`; };
  const t12 = h => { const hh = Math.floor(((h % 24) + 24) % 24), mm = Math.round((h - Math.floor(h)) * 60) % 60; return `${hh % 12 || 12}:${String(mm).padStart(2, '0')} ${hh < 12 ? 'AM' : 'PM'}`; };
  const FIELD = Array.from({ length: 18 }, (_, i) => [300 + ((i * 397) % 1000), 260 + ((i * 211) % 260), 1 + (i % 3) * .6]);
  const WORDS = [
    ['Way 2: The Moon Is a Clock Hand', 'An idea from 1514. It finally worked at sea in the 1760s.'],
    ['Measure the Moon–Star Distance', 'With a sextant: from the Moon’s edge to the bright star Regulus.'],
    ['Look It Up in the Almanac', '42° 18′ means 9:00 PM in London. Your own clock says 7:00 PM: 2 hours = 30° West.'],
    ['Now Do It on a Rolling Deck', 'One arcminute wrong = about 30 miles. Then an hour of arithmetic by candlelight.']];
  let H = 6;
  V3.scene(el, 4, (S, ctx, now) => {
    const age = S.age(now), roll = S.step === 3 ? S.clamp(age / 900) : 0;
    // the Moon's hour: a time-lapse on the first step, parked at 9 PM after that
    if (S.step === 0) H = 6 + ((age / 1000) * .9) % 6; else H = S.lerp(H, 9, Math.min(1, .06));
    const sky = ctx.createLinearGradient(0, 0, 0, 1000); sky.addColorStop(0, '#060912'); sky.addColorStop(.75, '#0f1a33'); sky.addColorStop(1, '#14223d'); ctx.fillStyle = sky; ctx.fillRect(0, 0, 1600, 1000);
    ctx.save(); const ang = roll * (.07 * Math.sin(now / 650) + .03 * Math.sin(now / 270)), bob = roll * 14 * Math.sin(now / 520); ctx.translate(800, 820 + bob); ctx.rotate(ang); ctx.translate(-800, -820);
    S.stars(now, .7); FIELD.forEach(([x, y, r]) => { ctx.fillStyle = '#dfe7ff'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); });
    // Regulus
    const rg = ctx.createRadialGradient(...REG, 0, ...REG, 22); rg.addColorStop(0, '#fff'); rg.addColorStop(.35, 'rgba(200,220,255,.9)'); rg.addColorStop(1, 'rgba(111,179,255,0)'); ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(...REG, 22, 0, 7); ctx.fill(); S.text('Regulus', REG[0] + 26, REG[1] - 6, 26, '#dfe7ff', 'left');
    // the Moon's track and the Moon
    const [mx, my] = moonAt(H);
    if (S.step === 0) { ctx.strokeStyle = 'rgba(236,230,218,.18)'; ctx.setLineDash([4, 8]); ctx.beginPath(); ctx.moveTo(...moonAt(6)); ctx.lineTo(...moonAt(12)); ctx.stroke(); ctx.setLineDash([]); [6, 9, 12].forEach(h => { const p = moonAt(h); S.text(t12(h + 12), p[0], p[1] + 58, 20, M); }); }
    const mg = ctx.createRadialGradient(mx - 10, my - 10, 4, mx, my, 34); mg.addColorStop(0, '#fbf6ea'); mg.addColorStop(1, '#cfc6b2'); ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(mx, my, 34, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(120,110,95,.35)'; [[-9, -6, 7], [10, 6, 9], [-4, 14, 5], [12, -12, 4]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(mx + dx, my + dy, r, 0, 7); ctx.fill(); });
    // the measurement: Moon to Regulus
    if (S.step >= 1) { const a = S.fade(now, S.step === 1 ? 400 : 0, 700), jit = roll * (Math.sin(now / 83) * .045 + Math.sin(now / 37) * .03), d = dist(H) + jit;
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = G; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(mx + 34, my - 2); ctx.lineTo(REG[0] - 14 + roll * 30 * Math.sin(now / 120), REG[1] + 2 + roll * 18 * Math.sin(now / 77)); ctx.stroke(); ctx.restore();
      S.text(dm(d), (mx + REG[0]) / 2, (my + REG[1]) / 2 - 44, 64, roll ? RED : G, 'center', a); }
    ctx.restore();
    // the sea and the ship, which roll together on the last step
    ctx.save(); ctx.translate(800, 820 + bob); ctx.rotate(-ang * .4); ctx.translate(-800, -820);
    ctx.fillStyle = '#0b1424'; ctx.fillRect(-200, 820, 2000, 400); ctx.strokeStyle = 'rgba(59,95,138,.8)'; ctx.lineWidth = 3; for (let i = 0; i < 22; i++) { const x = -100 + i * 85 + (now / 40) % 85; ctx.beginPath(); ctx.moveTo(x, 836); ctx.quadraticCurveTo(x + 21, 822, x + 42, 836); ctx.stroke(); }
    ctx.fillStyle = '#2a1d12'; ctx.beginPath(); ctx.moveTo(250, 815); ctx.lineTo(560, 815); ctx.lineTo(525, 855); ctx.lineTo(280, 855); ctx.closePath(); ctx.fill(); ctx.fillRect(400, 640, 6, 176); ctx.fillStyle = 'rgba(207,200,186,.55)'; ctx.beginPath(); ctx.moveTo(408, 650); ctx.lineTo(500, 740); ctx.lineTo(408, 790); ctx.closePath(); ctx.fill();
    ctx.restore();
    // a clock for the time-lapse: the Moon's place among the stars is London time
    if (S.step === 0) S.card(60, 160, 340, 150, 'London time', t12(H + 12), 'read from the Moon’s place', G, S.fade(now, 300));
    // the almanac page
    if (S.step === 2) { const a = S.fade(now, 200, 600); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#efe4c8'; ctx.beginPath(); ctx.roundRect(60, 150, 470, 470, 10); ctx.fill(); ctx.restore();
      const ink = '#3a2f22'; S.text('The Nautical Almanac, 1767', 295, 195, 28, ink, 'center', a, 600, 440, true); S.text('Moon from Regulus, at London', 295, 234, 21, '#6b5a40', 'center', a, 400, 440, true);
      [[6, 44.1], [9, 42.3], [12, 40.5]].forEach(([h, d], i) => { const y = 300 + i * 90, on = h === 9; if (on) { ctx.save(); ctx.globalAlpha = a * S.fade(now, 1200, 400); ctx.fillStyle = 'rgba(240,179,90,.55)'; ctx.fillRect(80, y - 34, 430, 68); ctx.restore(); } S.text(t12(h + 12), 110, y, 32, ink, 'left', a, 400, 300, true); S.text(dm(d), 480, y, 32, ink, 'right', a, 400, 300, true); });
      S.card(1020, 560, 260, 140, 'London', '9:00 PM', 'from the table', G, S.fade(now, 1700)); S.card(1300, 560, 260, 140, 'Your clock', '7:00 PM', 'set by your noon', '#6fb3ff', S.fade(now, 2300)); S.text('2 hours = 30° West', 1290, 750, 40, G, 'center', S.fade(now, 2900)); }
    if (S.step === 3) { S.text('±1′ in the sighting  =  ±30 miles', 1170, 620, 34, RED, 'center', S.fade(now, 1200)); S.text('+ refraction, parallax, the almanac every 3 hours…', 1170, 670, 24, M, 'center', S.fade(now, 2000)); }
    S.words(now, ...WORDS[S.step]);
  });
}, 0));

/* ---------- 8 · Way 1: Galileo, through the eyepiece. Moon, Jupiter's moons, the eclipse clock, land vs sea, Scilly ---------- */
addEventListener('load', () => setTimeout(() => {
  const el = v3Find('Galileo’s clock'); if (!el) return;
  const G = '#f0b35a', W = '#ece6da', M = '#9a9382', B = '#6fb3ff', RED = '#ff7d6f';
  const moonImg = new Image(); moonImg.src = 'img/moon-first-quarter.jpg';
  const scilly = new Image(); scilly.src = 'v3/img/scilly.jpg';
  const sn = new Image(); sn.src = 'img/sidereus-nuncius-jupiter.jpg';
  // the four moons: distance (in Jupiter radii, squeezed to fit) and period in days
  const MOONS = [['Io', 2.4, 1.769, .3], ['Europa', 3.8, 3.551, 2.1], ['Ganymede', 6.0, 7.155, 4.0], ['Callisto', 10.3, 16.69, 5.6]];
  const NIGHTS = ['Jan 7', 'Jan 8', 'Jan 10', 'Jan 11', 'Jan 12', 'Jan 13'], NT = [0, 1, 3, 4, 5, 6];
  const EYE = [{ x: 640, y: 560, r: 0 }, { x: 800, y: 470, r: 340 }, { x: 900, y: 470, r: 340 }, { x: 800, y: 470, r: 340 }, { x: 800, y: 470, r: 340 }, { x: 800, y: 470, r: 340 }, { x: 1150, y: 380, r: 230 }, { x: 1150, y: 380, r: 0 }, { x: 1150, y: 380, r: 230 }, { x: 800, y: 470, r: 0 }];
  const WORDS = [
    ['1609 · Galileo turns a telescope on the night sky', 'About 20 times magnification. Nobody has looked up like this before.'],
    ['The Moon is not smooth', 'Mountains, craters, long shadows. The heavens were supposed to be perfect.'],
    ['January 1610 · Jupiter Has Company', ''],
    ['Not everything circles the Earth', 'Moons circling another world: evidence for Copernicus, and trouble with the Church.'],
    ['Io slips into Jupiter’s shadow', 'Every 42½ hours it vanishes, on schedule, for everyone on Earth at the same instant.'],
    ['A clock in the sky that everyone can read', 'London writes down 9:00 PM. You write down 7:00 PM. 2 hours = 30° West.'],
    ['On land, it works', 'A long telescope on a steady stand, a pendulum clock beside it. By 1668 map makers redraw whole countries.'],
    ['France Shrinks, and the King Complains', ''],
    ['At sea, it fails', 'You cannot hold a moon of Jupiter in the eyepiece on a rolling deck, and a pendulum cannot keep time on the waves.'],
    ['', '']];
  let eye = { ...EYE[0] }, from = { ...EYE[0] }, last = 0, tilt = .03, tj = 0;
  const system = (ctx, S, now, cx, cy, sc, opts = {}) => { // Jupiter and its moons; sc = pixels per Jupiter radius
    const t = opts.t, ti = opts.tilt, rJ = sc;
    if (ti > .1) MOONS.forEach(([, d]) => { ctx.strokeStyle = `rgba(236,230,218,${.25 * Math.min(1, ti * 2)})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(cx, cy, d * sc, d * sc * ti, 0, 0, 7); ctx.stroke(); });
    if (opts.shadow) { ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(cx, cy - rJ * Math.max(ti, .15), sc * 14, 2 * rJ * Math.max(ti, .15)); }
    const pos = MOONS.map(([n, d, P, ph], i) => { const a = (opts.io != null && i === 0) ? opts.io : 2 * Math.PI * t / P + ph; return { n, x: cx + d * sc * Math.cos(a), y: cy + d * sc * Math.sin(a) * ti, behind: Math.sin(a) < 0, inSh: Math.cos(a) > 0 && Math.abs(d * Math.sin(a)) < 1, i }; });
    const dot = p => { if (p.i >= 4) return; const dark = opts.shadow && p.inSh; ctx.fillStyle = dark ? '#262a33' : '#ffe9b0'; ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(4.5, sc * .24), 0, 7); ctx.fill(); if (opts.names) S.text(p.n, p.x, p.y - 20, 18, dark ? M : W); };
    pos.filter(p => p.behind).forEach(p => { if (Math.abs(p.x - cx) > rJ) dot(p); });
    const jg = ctx.createRadialGradient(cx - rJ * .3, cy - rJ * .3, 0, cx, cy, rJ); jg.addColorStop(0, '#f1d7a8'); jg.addColorStop(1, '#b8925a'); ctx.fillStyle = jg; ctx.beginPath(); ctx.arc(cx, cy, rJ, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(138,106,61,.7)'; ctx.lineWidth = Math.max(1, rJ * .12); [-.35, .1, .45].forEach(f => { ctx.beginPath(); ctx.moveTo(cx - rJ * Math.sqrt(1 - f * f), cy + rJ * f); ctx.lineTo(cx + rJ * Math.sqrt(1 - f * f), cy + rJ * f); ctx.stroke(); });
    pos.filter(p => !p.behind).forEach(dot); return pos; };
  V3.scene(el, 10, (S, ctx, now) => {
    if (S.t0 !== last) { from = { ...eye }; last = S.t0; }
    const age = S.age(now), k = S.step, e = S.ease(age / 1500), T = EYE[k];
    eye = { x: S.lerp(from.x, T.x, e), y: S.lerp(from.y, T.y, e), r: S.lerp(from.r, T.r, e) };
    tilt = S.lerp(tilt, k >= 3 && k <= 5 ? .5 : .03, .05);
    const sky = ctx.createLinearGradient(0, 0, 0, 1000); sky.addColorStop(0, '#05070f'); sky.addColorStop(1, '#101a30'); ctx.fillStyle = sky; ctx.fillRect(0, 0, 1600, 1000); S.stars(now, .8);
    // the ground: Padua's rooftops, a steady stand on land, or the rolling sea
    const sea = k === 8, roll = sea ? S.clamp(age / 800) : 0, ang = roll * .12 * Math.sin(now / 600);
    if (k <= 1 || k === 6 || k === 8) { ctx.save();
      if (sea) { ctx.fillStyle = '#0b1424'; ctx.fillRect(0, 800, 1600, 200); ctx.strokeStyle = 'rgba(59,95,138,.8)'; ctx.lineWidth = 3; for (let i = 0; i < 22; i++) { const x = -100 + i * 85 + (now / 30) % 85; ctx.beginPath(); ctx.moveTo(x, 816); ctx.quadraticCurveTo(x + 21, 800, x + 42, 816); ctx.stroke(); } }
      else { ctx.fillStyle = '#0a0d16'; ctx.beginPath(); ctx.moveTo(0, 1000); [[0, 820], [120, 820], [120, 760], [200, 720], [280, 760], [280, 800], [420, 800], [420, 700], [450, 640], [480, 700], [480, 790], [700, 790], [700, 820], [1600, 820], [1600, 1000]].forEach(p => ctx.lineTo(...p)); ctx.fill(); }
      // telescope (and on land, its stand and a pendulum clock)
      ctx.save(); ctx.translate(560, 800); ctx.rotate(-ang); ctx.strokeStyle = '#8a6a3d'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-50, -0); ctx.moveTo(0, -120); ctx.lineTo(-45, 0); ctx.moveTo(0, -120); ctx.lineTo(45, 0); ctx.moveTo(0, -120); ctx.lineTo(0, 0); ctx.stroke();
      ctx.strokeStyle = '#b8925a'; ctx.lineCap = 'round'; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(-110, -80); ctx.lineTo(150, -200); ctx.stroke(); ctx.lineCap = 'butt'; ctx.restore();
      if (k === 6 || k === 8) { const sw = sea ? .5 * Math.sin(now / 260) + .3 * Math.sin(now / 97) : .35 * Math.sin(now / 500); ctx.save(); ctx.translate(800, 620); ctx.rotate(-ang); ctx.fillStyle = '#3a2f22'; ctx.fillRect(-45, 0, 90, 190); ctx.fillStyle = '#efe4c8'; ctx.beginPath(); ctx.arc(0, 40, 26, 0, 7); ctx.fill(); ctx.strokeStyle = '#cfc8ba'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 70); ctx.lineTo(90 * Math.sin(sw), 70 + 90 * Math.cos(sw)); ctx.stroke(); ctx.fillStyle = G; ctx.beginPath(); ctx.arc(90 * Math.sin(sw), 70 + 90 * Math.cos(sw), 12, 0, 7); ctx.fill(); ctx.restore(); S.text(sea ? 'the pendulum swings with the ship' : 'pendulum clock', 800, 840, 22, M, 'center', S.fade(now, 600)); }
      ctx.restore(); }
    // the eyepiece view
    if (eye.r > 4) { ctx.save(); ctx.beginPath(); ctx.arc(eye.x, eye.y, eye.r, 0, 7); ctx.fillStyle = '#03050a'; ctx.fill(); ctx.clip();
      const sh = sea ? [eye.r * .9 * Math.sin(now / 410), eye.r * .7 * Math.sin(now / 290 + 1)] : [0, 0], cx = eye.x + sh[0], cy = eye.y + sh[1];
      if (k <= 1) { if (moonImg.complete && moonImg.naturalWidth) { const s = eye.r * 2.3 / Math.max(moonImg.naturalWidth, moonImg.naturalHeight); ctx.globalAlpha = S.fade(now, 300, 900); ctx.drawImage(moonImg, eye.x - moonImg.naturalWidth * s / 2, eye.y - moonImg.naturalHeight * s / 2, moonImg.naturalWidth * s, moonImg.naturalHeight * s); ctx.globalAlpha = 1; } }
      else if (k === 2) { tj = age / 1400; const n = Math.min(NT.length - 1, Math.floor(tj)); system(ctx, S, now, cx, cy, 24 * eye.r / 340, { t: NT[n] + (tj - n) * (n < NT.length - 1 ? NT[n + 1] - NT[n] : 1), tilt }); }
      else if (k === 3) system(ctx, S, now, cx, cy, 30 * eye.r / 340, { t: 6 + age / 2500, tilt, names: true });
      else if (k === 4 || k === 5) { const zs = 30 * S.lerp(1, 1.6, S.ease(age / 1500)) * (k === 5 ? 1 : 1); const sc = k === 5 ? 48 : zs;
        const sg = ctx.createRadialGradient(eye.x - eye.r - 60, eye.y, 0, eye.x - eye.r - 60, eye.y, 260); sg.addColorStop(0, 'rgba(255,214,107,.7)'); sg.addColorStop(1, 'rgba(255,214,107,0)'); ctx.fillStyle = sg; ctx.fillRect(eye.x - eye.r, eye.y - eye.r, eye.r * 2, eye.r * 2);
        const io = k === 5 ? 0 : -1.15 + .17 * Math.max(0, age - 1500) / 1000;
        const pos = system(ctx, S, now, eye.x - 60, eye.y, sc, { t: 6, tilt, shadow: true, io, names: false });
        const p = pos[0]; S.text(p.inSh ? 'Io vanishes!' : 'Io', p.x, p.y - 30, p.inSh ? 30 : 22, p.inSh ? G : W); S.text('Sunlight →', eye.x - eye.r + 90, eye.y - eye.r * .62, 22, G, 'left'); S.text('Jupiter’s shadow', eye.x + eye.r - 30, eye.y + 70, 20, M, 'right'); }
      else if (k === 6 || k === 8) system(ctx, S, now, cx, cy, 11 * eye.r / 230, { t: age / 3000 + 6, tilt });
      ctx.restore(); ctx.strokeStyle = '#6b5a40'; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(eye.x, eye.y, eye.r, 0, 7); ctx.stroke(); }
    // Galileo's notebook, one night per line
    // Galileo's own record of those nights: a page of Sidereus Nuncius, Venice, March 1610 (public domain)
    if (k === 2 && sn.complete && sn.naturalWidth) { const a = S.fade(now, 200, 800), h = 660, w = h * sn.naturalWidth / sn.naturalHeight; ctx.save(); ctx.globalAlpha = a; ctx.drawImage(sn, 70, 150, w, h); ctx.strokeStyle = 'rgba(240,179,90,.5)'; ctx.lineWidth = 2; ctx.strokeRect(70, 150, w, h); ctx.restore(); S.text('Galileo’s own record · Sidereus Nuncius, 1610', 70 + w / 2, 840, 20, M, 'center', a); }
    if (k === 5) { S.card(40, 300, 340, 150, 'London writes down', '9:00 PM', 'Io vanished', G, S.fade(now, 400)); S.card(1220, 300, 340, 150, 'You write down', '7:00 PM', 'Io vanished', B, S.fade(now, 1000)); S.text('2 hours = 30° West', 800, 845, 44, G, 'center', S.fade(now, 1700)); }
    // Scilly: the bill for longitude at sea
    if (k === 9) { const a = S.fade(now, 0, 800); ctx.save(); ctx.globalAlpha = a * .5; if (scilly.complete && scilly.naturalWidth) { const s = Math.max(1600 / scilly.naturalWidth, 1000 / scilly.naturalHeight); ctx.filter = 'grayscale(1)'; ctx.drawImage(scilly, 800 - scilly.naturalWidth * s / 2, 500 - scilly.naturalHeight * s / 2, scilly.naturalWidth * s, scilly.naturalHeight * s); ctx.filter = 'none'; } ctx.restore();
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(5,8,18,.72)'; ctx.fillRect(0, 300, 1600, 400); ctx.restore();
      S.text('So in 1707, at sea, longitude was still a guess', 800, 400, 50, W, 'center', a); S.text('Scilly: four ships, about 2,000 men', 800, 500, 64, G, 'center', S.fade(now, 700, 700)); S.text('Seven years later, Parliament acts.', 800, 610, 44, W, 'center', S.fade(now, 1500, 700)); }
    // France shrinks: the old outline (longitudes guessed) slides east onto the 1693 survey (longitudes timed by Io)
    if (k === 7 && typeof COAST_FR !== 'undefined') { const T = S.clamp(((age % 4000) - 500) / 2600), kk = S.ease(T), // loops every 4 s: hold the old map, slide east, hold the survey
      sc = 66, P = (la, lo) => [800 + (lo - 2.4) * Math.cos(46.6 * Math.PI / 180) * sc, 440 - (la - 46.6) * sc];
      const old = (la, lo, f) => { const west = Math.max(0, (2.35 - lo) / 6.85), south = Math.max(0, (45 - la) / 3); return [la - .5 * south * f, lo - 1.5 * west * f]; };
      const draw = (fn, col, wd, dash) => { ctx.strokeStyle = col; ctx.lineWidth = wd; ctx.setLineDash(dash || []); ctx.beginPath(); for (const ln of COAST_FR.lines) { let pen = false; for (let i = 0; i < ln.length; i += 2) { const q = P(...fn(ln[i + 1] / 100, ln[i] / 100)); pen ? ctx.lineTo(...q) : ctx.moveTo(...q); pen = true; } } ctx.stroke(); ctx.setLineDash([]); };
      ctx.save(); ctx.globalAlpha = S.fade(now, 0, 500); draw((la, lo) => [la, lo], G, 3); draw((la, lo) => old(la, lo, 1), 'rgba(236,230,218,.5)', 2, [6, 7]); draw((la, lo) => old(la, lo, 1 - kk), '#6fb3ff', 4); ctx.restore();
      // arrows down the west coast, old place to new
      [[48.39, -4.49], [46.16, -1.15], [43.49, -1.47]].forEach(([la, lo]) => { const a = P(...old(la, lo, 1)), b2 = P(...old(la, lo, 1 - kk)); if (b2[0] - a[0] < 4) return; ctx.strokeStyle = RED; ctx.fillStyle = RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(b2[0] + 4, b2[1]); ctx.lineTo(b2[0] - 12, b2[1] - 9); ctx.lineTo(b2[0] - 12, b2[1] + 9); ctx.closePath(); ctx.fill(); });
      [['Paris', 48.86, 2.35], ['Brest', 48.39, -4.49], ['Marseille', 43.3, 5.37]].forEach(([n, la, lo]) => { const q = P(la, lo); ctx.fillStyle = G; ctx.beginPath(); ctx.arc(...q, 6, 0, 7); ctx.fill(); S.text(n, q[0] + 12, q[1] - 12, 22, W, 'left'); });
      { S.text(`Brest moves ${(1.5 * kk).toFixed(1)}° east`, P(48.39, -6.3)[0], P(48.39, -6.3)[1] + 50, 24, RED, 'center', S.fade(now, 800)); }
      S.text('“His Majesty’s astronomers have taken more of France than his enemies ever did.”', 800, 790, 32, G, 'center', S.fade(now, 4200, 800));
      S.text('attributed to Louis XIV, 1693 · the sentiment is recorded, the exact words are not', 800, 832, 18, M, 'center', S.fade(now, 4600, 800)); }
    S.words(now, ...WORDS[k]);
  });
}, 0));


/* ---------- 10 · The Longitude Act, 1714: the prize, then its three tiers. Plain and quiet. ---------- */
addEventListener('load', () => setTimeout(() => {
  const el = v3Find('The Longitude Act, 1714'); if (!el) return;
  const G = '#f0b35a', W = '#ece6da', M = '#9a9382';
  const TIERS = [['£10,000', 'Within 1°', 'about 60 miles'], ['£15,000', 'Within ⅔°', 'about 40 miles'], ['£20,000', 'Within ½°', 'about 30 miles']];
  V3.scene(el, 2, (S, ctx, now) => {
    const k = S.step, up = S.ease(S.age(now) / 900);
    const ty = k === 0 ? 400 : S.lerp(400, 190, up); // the headline rises to make room for the prizes
    S.text('1714', 800, ty - 120, 40, M, 'center', 1);
    S.text('The Longitude Act', 800, ty - 40, 76, W, 'center', 1);
    S.text('£20,000 to find longitude at sea', 800, ty + 50, 40, G, 'center', 1);
    if (k === 1) TIERS.forEach(([amt, tol, mi], i) => { const a = S.fade(now, 500 + i * 450, 600), x = 300 + i * 500;
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = i === 2 ? G : 'rgba(236,230,218,.25)'; ctx.lineWidth = i === 2 ? 2.5 : 1.5; ctx.beginPath(); ctx.moveTo(x - 190, 400); ctx.lineTo(x + 190, 400); ctx.stroke(); ctx.restore();
      S.text(amt, x, 490, 68, i === 2 ? G : W, 'center', a); S.text(tol, x, 580, 44, W, 'center', a); S.text(mi, x, 640, 30, M, 'center', a); });
    if (k === 1) S.text('Sail to the West Indies, about six weeks, and say where you are.', 800, 800, 30, M, 'center', S.fade(now, 2200, 700));
  });
}, 0));


/* ---------- Appendix: what each decimal place buys. ↑ adds a place, ↓ takes one away (tap the top or bottom half on an iPad) ---------- */
NEW_SLIDES['Decimal places'] = { h1: 'What Each Decimal Place Buys', fig: '', init() {} };
NEW_SLIDES['Sidereal day'] = { h1: 'The Star Day and the Sun Day', fig: '', init() {} };
addEventListener('load', () => setTimeout(() => {
  const el = v3Find('Decimal places'); if (!el) return;
  const LAT = 40.758655, LON = -73.978645, D = Math.PI / 180; // Rockefeller Center tree, approximately
  const R = [['69 miles', 111320], ['7 miles', 11132], ['0.7 mile', 1113], ['365 feet', 111.3], ['36 feet', 11.13], ['3.6 feet', 1.113], ['4 inches', .1113]];
  let d = 0, z = 0, tiles = {}, pressT = 0;
  const mpp = zz => 156543.03 * Math.cos(LAT * D) / Math.pow(2, zz);
  const want = dd => Math.min(22.5, Math.log2(156543.03 * Math.cos(LAT * D) / (R[dd][1] / 300)));
  const tile = (zz, x, y) => { const k = zz + '/' + x + '/' + y; if (!tiles[k]) { const im = new Image(); im.crossOrigin = 'anonymous'; im.src = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zz}/${y}/${x}`; tiles[k] = im; } return tiles[k]; };
  const pre = dd => { const zz = Math.max(1, Math.min(20, Math.floor(want(dd)))), n = 2 ** zz, cx = Math.floor((LON + 180) / 360 * n), cy = Math.floor((1 - Math.log(Math.tan(LAT * D) + 1 / Math.cos(LAT * D)) / Math.PI) / 2 * n); for (let i = -3; i <= 3; i++) for (let j = -2; j <= 2; j++) tile(zz, cx + i, cy + j); };
  const set = dd => { d = Math.max(0, Math.min(6, dd)); pressT = performance.now(); pre(d); pre(Math.min(6, d + 1)); };
  z = want(0);
  addEventListener('keydown', e => { if (!el.classList.contains('active') || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return; e.preventDefault(); e.stopImmediatePropagation(); set(d + (e.key === 'ArrowUp' ? 1 : -1)); }, true);
  V3.scene(el, 1, (S, ctx, now) => {
    z += (want(d) - z) * .06;
    const zi = Math.max(1, Math.min(20, Math.floor(z))), sc = Math.pow(2, z - zi), n = Math.pow(2, zi);
    const wx = (LON + 180) / 360 * 256 * n, wy = (1 - Math.log(Math.tan(LAT * D) + 1 / Math.cos(LAT * D)) / Math.PI) / 2 * 256 * n;
    ctx.fillStyle = '#0b1020'; ctx.fillRect(0, 0, 1600, 1000);
    const ts = 256 * sc, x0 = Math.floor((wx - 800 / sc) / 256), x1 = Math.floor((wx + 800 / sc) / 256), y0 = Math.floor((wy - 500 / sc) / 256), y1 = Math.floor((wy + 500 / sc) / 256);
    for (let tx = x0; tx <= x1; tx++) for (let ty = y0; ty <= y1; ty++) { if (ty < 0 || ty >= n) continue; const im = tile(zi, ((tx % n) + n) % n, ty); const X = 800 + (tx * 256 - wx) * sc, Y = 500 + (ty * 256 - wy) * sc, xx = ((tx % n) + n) % n;
      if (im.complete && im.naturalWidth) ctx.drawImage(im, X, Y, ts + .5, ts + .5);
      else for (let up = 1; up <= 6 && zi - up >= 1; up++) { const f = 1 << up, p = tile(zi - up, xx >> up, ty >> up); if (p.complete && p.naturalWidth) { const w = 256 / f; ctx.drawImage(p, (xx % f) * w, (ty % f) * w, w, w, X, Y, ts + .5, ts + .5); break; } } }
    // the circle you could be anywhere inside
    const rp = R[d][1] / mpp(z), pulse = Math.max(0, 1 - (now - pressT) / 700);
    ctx.save(); ctx.fillStyle = 'rgba(240,179,90,.14)'; ctx.strokeStyle = '#f0b35a'; ctx.lineWidth = 4 + 4 * pulse; ctx.beginPath(); ctx.arc(800, 500, Math.max(10, rp), 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff7d6f'; ctx.beginPath(); ctx.arc(800, 500, Math.min(6, Math.max(3, rp * .4)), 0, 7); ctx.fill(); ctx.restore();
    // the number, with the decimals you have so far
    const fmt = v => v.toFixed(d);
    ctx.save(); ctx.fillStyle = 'rgba(8,12,22,.82)'; ctx.beginPath(); ctx.roundRect(400, 30, 800, 150, 16); ctx.fill(); ctx.restore();
    S.text(`${fmt(LAT)}, ${fmt(LON)}`, 800, 88, 60, '#ece6da', 'center', 1, 600);
    S.text(`${d} decimal place${d === 1 ? '' : 's'}  ·  within about ${R[d][0]}`, 800, 148, 32, '#f0b35a');
    ctx.save(); ctx.fillStyle = 'rgba(8,12,22,.82)'; ctx.beginPath(); ctx.roundRect(470, 860, 660, 70, 14); ctx.fill(); ctx.restore();
    S.text('↑ one more decimal  ·  ↓ one fewer', 800, 895, 28, '#cfc8ba');
    S.text('Rockefeller Center tree · imagery © Esri, Maxar, Earthstar Geographics', 1570, 215, 17, '#cfc8ba', 'right');
  });
  const cv = el.querySelector('canvas'); if (cv) cv.addEventListener('click', e => { const r = cv.getBoundingClientRect(); set(d + (e.clientY - r.top < r.height / 2 ? 1 : -1)); });
}, 0));

/* ---------- Appendix: the star day (23 h 56 m) and the Sun day (24 h) ---------- */
addEventListener('load', () => setTimeout(() => {
  const el = v3Find('Sidereal day'); if (!el) return;
  const G = '#f0b35a', W = '#ece6da', M = '#9a9382', B = '#6fb3ff', DL = 14 * Math.PI / 180; // orbit step drawn 14× too big
  const WORDS = [['Noon: the Sun straight overhead', 'A far star lines up with it.'], ['One full turn, 360°: 23 h 56 min', 'The star is back overhead. The Sun is not.'], ['About 1° more: 4 minutes', 'Noon to noon: 24 hours.']];
  let rho = 0, phi = 0;
  V3.scene(el, 3, (S, ctx, now) => {
    const k = S.step, t = S.ease((S.age(now) - 300) / 2600);
    const tr = [0, -2 * Math.PI, -2 * Math.PI - DL][k], tp = [0, -DL, -DL][k];
    rho = S.lerp(rho, tr, k ? Math.max(.02, t * .12) : .2); phi = S.lerp(phi, tp, k ? Math.max(.02, t * .12) : .2);
    S.stars(now, .6);
    const sx = 700, sy = 520, OR = 340, ex = sx + OR * Math.cos(phi), ey = sy + OR * Math.sin(phi);
    ctx.strokeStyle = 'rgba(236,230,218,.18)'; ctx.setLineDash([6, 8]); ctx.beginPath(); ctx.arc(sx, sy, OR, 0, 7); ctx.stroke(); ctx.setLineDash([]);
    const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 70); sg.addColorStop(0, '#ffe39a'); sg.addColorStop(.5, G); sg.addColorStop(1, 'rgba(240,179,90,0)'); ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sx, sy, 70, 0, 7); ctx.fill(); S.text('Sun', sx, sy + 92, 26, G);
    // the far star: always the same direction (left), drawn as parallel starlight
    ctx.strokeStyle = 'rgba(111,179,255,.5)'; ctx.setLineDash([3, 7]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ex - 80, ey); ctx.lineTo(80, ey); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = B; ctx.beginPath(); ctx.arc(60, ey, 8, 0, 7); ctx.fill(); S.text('far star', 60, ey - 28, 22, B);
    // the Earth and its noon marker
    const R0 = 64, a = Math.PI + rho; ctx.fillStyle = '#1d3354'; ctx.beginPath(); ctx.arc(ex, ey, R0, 0, 7); ctx.fill(); ctx.strokeStyle = '#3b5f8a'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = 'rgba(3,6,14,.55)'; ctx.beginPath(); ctx.arc(ex, ey, R0, phi - Math.PI / 2, phi + Math.PI / 2); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#ff7d6f'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex + (R0 + 26) * Math.cos(a), ey + (R0 + 26) * Math.sin(a)); ctx.stroke();
    ctx.fillStyle = '#ff7d6f'; ctx.beginPath(); ctx.arc(ex + (R0 + 26) * Math.cos(a), ey + (R0 + 26) * Math.sin(a), 8, 0, 7); ctx.fill();
    if (k >= 1) { ctx.strokeStyle = G; ctx.lineWidth = 2; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(sx, sy); ctx.stroke(); ctx.setLineDash([]); }
    if (k === 2) { const r = 150; ctx.strokeStyle = G; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(ex, ey, r, Math.PI + phi, Math.PI, false); ctx.stroke(); S.text('≈ 1°', ex - r - 20, ey - 30, 40, G, 'right', S.fade(now, 2600)); }
    S.text('The orbit step is drawn 14× larger so you can see it.', 1540, 925, 17, M, 'right');
    S.words(now, ...WORDS[k]);
  });
}, 0));

/* ---------- Appendix: shared satellite tiles (Esri World Imagery, no key needed) ---------- */
const V3SAT = (() => {
  const tiles = {}, D = Math.PI / 180;
  const tile = (zz, x, y) => { const k = zz + '/' + x + '/' + y; if (!tiles[k]) { const im = new Image(); im.crossOrigin = 'anonymous'; im.src = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zz}/${y}/${x}`; tiles[k] = im; } return tiles[k]; };
  const world = (lat, lon, n) => [(lon + 180) / 360 * 256 * n, (1 - Math.log(Math.tan(lat * D) + 1 / Math.cos(lat * D)) / Math.PI) / 2 * 256 * n];
  // draw the map so (lat, lon) sits at screen (800, 500); returns a projector for other points
  const draw = (ctx, lat, lon, z) => {
    const zi = Math.max(1, Math.min(19, Math.floor(z))), sc = Math.pow(2, z - zi), n = Math.pow(2, zi), [wx, wy] = world(lat, lon, n);
    ctx.fillStyle = '#0b1020'; ctx.fillRect(0, 0, 1600, 1000);
    const ts = 256 * sc, x0 = Math.floor((wx - 800 / sc) / 256), x1 = Math.floor((wx + 800 / sc) / 256), y0 = Math.floor((wy - 500 / sc) / 256), y1 = Math.floor((wy + 500 / sc) / 256);
    for (let tx = x0; tx <= x1; tx++) for (let ty = y0; ty <= y1; ty++) {
      if (ty < 0 || ty >= n) continue; const xx = ((tx % n) + n) % n, im = tile(zi, xx, ty), X = 800 + (tx * 256 - wx) * sc, Y = 500 + (ty * 256 - wy) * sc;
      if (im.complete && im.naturalWidth) ctx.drawImage(im, X, Y, ts + .5, ts + .5);
      else for (let up = 1; up <= 6 && zi - up >= 1; up++) { const f = 1 << up, p = tile(zi - up, xx >> up, ty >> up); if (p.complete && p.naturalWidth) { const w = 256 / f; ctx.drawImage(p, (xx % f) * w, (ty % f) * w, w, w, X, Y, ts + .5, ts + .5); break; } }
    }
    const zz = Math.pow(2, z); return (la, lo) => { const [a, b] = world(la, lo, zz), [c, d] = world(lat, lon, zz); return [800 + a - c, 500 + b - d]; };
  };
  // dark bands top and bottom so the headline and caption read over imagery
  const bands = ctx => { let g = ctx.createLinearGradient(0, 0, 0, 170); g.addColorStop(0, 'rgba(6,9,18,.85)'); g.addColorStop(1, 'rgba(6,9,18,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1600, 170); g = ctx.createLinearGradient(0, 820, 0, 1000); g.addColorStop(0, 'rgba(6,9,18,0)'); g.addColorStop(1, 'rgba(6,9,18,.9)'); ctx.fillStyle = g; ctx.fillRect(0, 820, 1600, 180); };
  return { draw, bands, credit: 'Imagery © Esri, Maxar, Earthstar Geographics' };
})();

NEW_SLIDES['Null Island'] = { h1: 'Null Island', fig: '', init() {} };
NEW_SLIDES['Which system'] = { h1: 'Which System?', fig: '', init() {} };
NEW_SLIDES['Errors grow'] = { h1: 'Errors Grow', fig: '', init() {} };

/* ---------- Appendix: Null Island. 0, 0 is where bad data goes ---------- */
addEventListener('load', () => setTimeout(() => {
  const el = v3Find('Null Island'); if (!el) return;
  const G = '#f0b35a', RED = '#ff7d6f';
  const WORDS = [['0°, 0°: Null Island', 'Open ocean in the Gulf of Guinea. One weather buoy.'], ['Where Bad Data Goes', 'A failed geocode, a blank cell, a GPS left off: all read as 0, 0.'], ['Not a Place. A Failure.', 'Filter 0, 0 before you map anything.']];
  let rnd = 7; const r = () => (rnd = (rnd * 16807) % 2147483647) / 2147483647;
  const DOTS = Array.from({ length: 140 }, () => [r() * 1600, r() * 1000, r() * 2400, (r() - .5) * 14, (r() - .5) * 14]);
  V3.scene(el, 3, (S, ctx, now) => {
    const k = S.step, P = V3SAT.draw(ctx, 0, 0, 5.4);
    ctx.save(); ctx.strokeStyle = 'rgba(240,179,90,.75)'; ctx.lineWidth = 2; ctx.setLineDash([10, 8]);
    ctx.beginPath(); ctx.moveTo(0, 500); ctx.lineTo(1600, 500); ctx.moveTo(800, 150); ctx.lineTo(800, 1000); ctx.stroke(); ctx.restore();
    S.text('Equator', 1560, 482, 22, G, 'right'); S.text('Prime meridian', 812, 200, 22, G, 'left');
    const ag = S.age(now);
    if (k >= 1) DOTS.forEach(([x, y, d, jx, jy]) => { const t = k === 1 ? S.ease((ag - d) / 900) : 1; if (t <= 0) return; ctx.fillStyle = RED; ctx.globalAlpha = .85; ctx.beginPath(); ctx.arc(S.lerp(x, 800 + jx, t), S.lerp(y, 500 + jy, t), 6, 0, 7); ctx.fill(); ctx.globalAlpha = 1; });
    if (k === 0) { ctx.fillStyle = '#ece6da'; ctx.beginPath(); ctx.arc(800, 500, 9, 0, 7); ctx.fill(); S.text('the buoy', 820, 540, 24, '#ece6da', 'left', S.fade(now, 600)); }
    if (k === 2) { const pu = .5 + .5 * Math.sin(now * .004); ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(800, 500, 46 + 10 * pu, 0, 7); ctx.stroke(); }
    V3SAT.bands(ctx); S.text(V3SAT.credit, 1540, 960, 17, '#9a9382', 'right');
    S.words(now, ...WORDS[k]);
  });
}, 0));

/* ---------- Appendix: which system? One shelter, three sets of numbers ---------- */
addEventListener('load', () => setTimeout(() => {
  const el = v3Find('Which system'); if (!el) return;
  const G = '#f0b35a', RED = '#ff7d6f', B = '#6fb3ff', LAT = 27.9506, LON = -82.4572;
  const WORDS = [['One Shelter in Tampa', '27.9506° N, 82.4572° W'], ['Three Ways to Write It', 'Same place. Different numbers.'], ['Right Numbers, Wrong System', 'UTM read as zone 16, not 17: about 365 miles west, in the Gulf.']];
  let z = 10, cla = LAT, clo = LON;
  V3.scene(el, 3, (S, ctx, now) => {
    const k = S.step, tz = k === 2 ? 5.9 : 10, tlo = k === 2 ? LON - 3 : LON;
    z += (tz - z) * .05; clo += (tlo - clo) * .05;
    const P = V3SAT.draw(ctx, cla, clo, z), [x, y] = P(LAT, LON);
    if (k === 2) {
      const [wx, wy] = P(LAT, LON - 6), t = S.ease((S.age(now) - 900) / 1400);
      ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(S.lerp(x, wx, t), y); ctx.stroke(); ctx.restore();
      if (t > 0) { ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(S.lerp(x, wx, t), wy, 16, 0, 7); ctx.stroke(); }
      S.text('365 miles', (x + wx) / 2, y - 30, 34, RED, 'center', S.fade(now, 2300));
      S.text('where the map put it', wx, wy + 56, 24, RED, 'center', S.fade(now, 2300));
    }
    ctx.fillStyle = G; ctx.beginPath(); ctx.arc(x, y, 12, 0, 7); ctx.fill(); ctx.strokeStyle = '#0b1020'; ctx.lineWidth = 3; ctx.stroke();
    if (k === 0) S.text('the shelter', x, y + 52, 28, G, 'center', S.fade(now, 400));
    if (k === 1) {
      const C = [['Latitude, Longitude', '27.9506° N', '82.4572° W', 'degrees', G], ['UTM Zone 17', '356,650 m E', '3,092,585 m N', 'meters', B], ['State Plane, Florida West', '508,565 ft E', '1,315,020 ft N', 'feet', '#9be3a7']];
      C.forEach(([t, a, b, u, col], i) => { const al = S.fade(now, 200 + i * 450), X = 110 + i * 480; ctx.save(); ctx.globalAlpha = al; ctx.fillStyle = 'rgba(10,14,26,.9)'; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(X, 560, 420, 250, 16); ctx.fill(); ctx.stroke(); ctx.restore();
        S.text(t, X + 210, 610, 28, col, 'center', al); S.text(a, X + 210, 675, 40, '#ece6da', 'center', al, 600); S.text(b, X + 210, 730, 40, '#ece6da', 'center', al, 600); S.text(u, X + 210, 785, 24, '#9a9382', 'center', al); });
    }
    V3SAT.bands(ctx); S.text(V3SAT.credit, 1540, 960, 17, '#9a9382', 'right');
    S.words(now, ...WORDS[k]);
  });
}, 0));

/* ---------- Appendix: errors grow. 160 careful ships, dead reckoning ---------- */
addEventListener('load', () => setTimeout(() => {
  const el = v3Find('Errors grow'); if (!el) return;
  const G = '#f0b35a', RED = '#ff7d6f', DAYS = [1, 5, 12], RUN = 115, HE = 2 * Math.PI / 180, SE = .08, X0 = 170, Y0 = 520, PX = 1240 / (12 * RUN);
  let seed = 42; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647, g = () => { let u = 0; for (let i = 0; i < 6; i++) u += rnd(); return (u - 3) / .7071; };
  // every ship: a fixed compass bias and speed bias, plus a fresh error each day
  const SHIPS = Array.from({ length: 160 }, () => { const hb = g() * HE * .5, sb = g() * SE * .5, pts = [[0, 0]]; let x = 0, y = 0; for (let d = 0; d < 12; d++) { const a = hb + g() * HE, v = RUN * (1 + sb + g() * SE); x += v * Math.cos(a); y += v * Math.sin(a); pts.push([x, y]); } return pts; });
  const doubt = d => { const fl = Math.floor(d), fr = d - fl, E = SHIPS.map(p => { const a = p[fl], b = p[Math.min(12, fl + 1)]; return [S0(a[0], b[0], fr), S0(a[1], b[1], fr)]; }), mx = E.reduce((s, e) => s + e[0], 0) / E.length, my = E.reduce((s, e) => s + e[1], 0) / E.length, rs = E.map(e => Math.hypot(e[0] - mx, e[1] - my)).sort((a, b) => a - b); return { E, mx, my, r: rs[Math.floor(rs.length * .95)] }; };
  const S0 = (a, b, t) => a + (b - a) * t;
  const CAP = ['Each day: compass good to 2°, speed good to 8%.', '160 ships, every one steered and logged with care.', 'Nobody made a mistake. That was the fleet off Scilly.'];
  let day = 1;
  V3.scene(el, 3, (S, ctx, now) => {
    const k = S.step; day += (DAYS[k] - day) * .03; if (Math.abs(DAYS[k] - day) < .01) day = DAYS[k];
    S.stars(now, .5);
    ctx.strokeStyle = 'rgba(236,230,218,.25)'; ctx.setLineDash([6, 8]); ctx.beginPath(); ctx.moveTo(X0, Y0); ctx.lineTo(1500, Y0); ctx.stroke(); ctx.setLineDash([]);
    const fl = Math.floor(day), fr = day - fl;
    ctx.strokeStyle = 'rgba(236,230,218,.14)'; ctx.lineWidth = 1.2;
    SHIPS.forEach(p => { ctx.beginPath(); ctx.moveTo(X0, Y0); for (let d = 1; d <= fl; d++) ctx.lineTo(X0 + p[d][0] * PX, Y0 + p[d][1] * PX); if (fl < 12) ctx.lineTo(X0 + S0(p[fl][0], p[fl + 1][0], fr) * PX, Y0 + S0(p[fl][1], p[fl + 1][1], fr) * PX); ctx.stroke(); });
    const { E, mx, my, r } = doubt(day);
    ctx.fillStyle = RED; E.forEach(e => { ctx.beginPath(); ctx.arc(X0 + e[0] * PX, Y0 + e[1] * PX, 3.5, 0, 7); ctx.fill(); });
    ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(X0 + mx * PX, Y0 + my * PX, Math.max(8, r * PX), 0, 7); ctx.stroke();
    ctx.fillStyle = '#ece6da'; ctx.beginPath(); ctx.arc(X0, Y0, 9, 0, 7); ctx.fill(); S.text('last sure position', X0 - 20, Y0 + 50, 24, '#ece6da', 'left');
    S.text(`Day ${Math.round(day)}: ${Math.round(r)} Miles of Doubt Either Way`, 800, 70, 46, '#ece6da');
    S.text(CAP[k], 800, 905, 30, G, 'center', S.fade(now, 0, 600));
  });
}, 0));
