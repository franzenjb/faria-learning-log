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
    keep: ['[data-k="lat"]', '[data-k="lon"]', '[data-k="grid"]', '#bingo-open', '#bingo-rows button', '#bingo-cols button', '#bingo-pin', '#bingo-clear', '#bingo-close'], hide: ['a[href="/polaris/"]'],
    clickOnLoad: ['#globe-toggles [data-k="lat"].on', '#globe-toggles [data-k="lon"].on', '#globe-toggles [data-k="grid"].on', '#globe-toggles [data-k="polaris"].on', '#globe-toggles [data-k="cities"].on'], hero: '<b>Latitude</b>: 0° at the Equator, 90° at the Pole.', on: { '#fly-nm': '1 Arcminute of <b>Latitude</b> = 1 Nautical Mile', '#fly-north': '<b>Latitude</b>: 0° at the Equator, 90° at the Pole.' } },
  'Walk north': { hideText: ['Why They Match', 'North Pole'], hero: 'One Star, One Angle. <b>Latitude</b> Needs No Clock.', on: { '#wn-south': 'In the South, <b>the Southern Cross</b> Points to the Pole.' } },
  'Eratosthenes': { kicker: '240 BC · Eratosthenes of Alexandria', hide: ['.readout'], hero: 'One Shadow, One Angle: The Size of the Earth.' },
  'Hours are slices': { hide: ['.table-wrap', '#hs-read'], hero: '<b>1 Hour = 15°</b> of Longitude', on: { '#hs-slice': '1 Hour = 15° = 60 Minutes', '#hs-degree': '<b>4 Seconds = 1 Nautical Mile</b>', '#hs-out': '<b>1 Hour = 15°</b> of Longitude' } },
  'Two ships, one latitude': { h1: 'Two Ships, One Latitude', hero: 'Same Star. Different Time. <b>Longitude Needs a Clock.</b>' },
  'The Longitude Act, 1714': { kicker: 'Seven Years After Scilly', hide: ['#la-r'] },
  'Galileo’s clock': { talk: { hide: ['[data-detour]', '#gs-steps [data-s="5"]'] }, hero: 'Jupiter’s Moons: A Clock Everyone Can See. <b>Not From a Ship.</b>' },
  'The lunar distance': { kicker: '1767 · Nevil Maskelyne’s Almanac', hide: ['#ld-steps', '#ld-deck'], hero: 'The Moon Is a Clock Hand. <b>One Arcminute Wrong = 30 Miles.</b>' },
  'A clock that could travel': { h1: 'A Clock That Could Travel' },
  'Washington, 1884': { kicker: 'Washington · October 1884', hide: ['#pm84-r'], hero: 'October 1884: 25 Nations Pick <b>Zero Longitude</b>.' },
  'Where am I, now': { kicker: 'GPS', hero: 'September 1983: A Navigation Error Kills 269. <b>The Answer Is GPS.</b>' }
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
    if (cfg.coverSub) { const sub = el.querySelector('.sub'); if (sub) sub.textContent = cfg.coverSub; }
    (cfg.clickOnLoad || []).forEach(sel => { const b = el.querySelector(sel); if (b) b.click(); });
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
      () => big('1714: £20,000 for a Clock at Sea', 320, '', 56),
      () => big('1714 · Isaac Newton:', 230, 'mu', 34) + big('“Such a watch hath not', 330, '', 58) + big('yet been made.”', 405, '', 58),
      () => big('A carpenter says he can build it.', 300, '', 50) + big('John Harrison, born 1693', 370, 'mu', 30),
      () => ph(1, 250, 40, 500, 470) + big('H1, 1735: 75 pounds of brass. It works.', 585, '', 38),
      () => ph(2, 110, 40, 360, 470) + ph(3, 530, 40, 360, 470) + big('Two more clocks. Twenty-two years.', 585, '', 38),
      () => ph(4, 240, 20, 520, 420) + big('H4: 81 days at sea to Jamaica.', 490, '', 40) + big('How many seconds does it lose?', 548, 'rd', 44),
      () => ph(4, 330, 10, 340, 280) + big('5 seconds', 420, 'rd', 120) + big('About 1¼ miles of longitude.', 510, '', 36),
      () => [1, 2, 3, 4].map((k, i) => ph(k, 70 + i * 220, 60, 200, 260)).join('') + big('1773: at 80, Harrison is paid.', 420, '', 48),
      () => big('The carpenter beat Newton.', 330, 'rd', 72)
    ];
    V3.steps(el, ST.length - 1, k => { CS.$(el, '#hv').innerHTML = ST[k]() + (k >= 3 && k <= 7 ? `<text x="500" y="634" text-anchor="middle" class="xs mu">Harrison’s clocks, Royal Observatory · photos: Tatters, Wikimedia</text>` : ''); });
  }
};

// ---------- Presenter keys: the panel is hidden, its controls live on 1–9, 0, then letters; ↑/↓ moves the first slider ----------
addEventListener('load', () => setTimeout(() => {
  const KEYS = '1234567890qweryuoadghjz'.split('');
  const legend = document.createElement('div'); legend.id = 'v3-keys'; (document.getElementById('visual') || document.body).appendChild(legend);
  const active = () => document.querySelector('#deck .slide.active');
  const controls = el => { const t = el && el.querySelector('.text'); if (!t) return []; return [...t.querySelectorAll('button')].filter(b => b.style.display !== 'none' && !b.closest('[hidden]') && !b.hidden && b.textContent.trim()); };
  const slider = el => { const t = el && el.querySelector('.text'); return t ? [...t.querySelectorAll('input[type=range]')].find(x => !x.closest('[hidden]') && x.style.display !== 'none') : null; };
  const label = b => { const L = b.querySelector('.label'), ltr = b.querySelector('.letter'); const t = L ? (ltr ? ltr.textContent + ' ' : '') + L.textContent : b.textContent; return t.replace(/\s+/g, ' ').trim().replace(/^\d+ · /, '').slice(0, 26); };
  const draw = () => { const el = active(); const cs = controls(el).slice(0, KEYS.length), sl = slider(el);
    legend.innerHTML = cs.map((b, i) => `<span data-i="${i}"><b>${KEYS[i].toUpperCase()}</b>${label(b)}</span>`).join('') + (sl ? `<span><b>↑↓</b>${(sl.closest('label') && sl.closest('label').querySelector('.row') ? sl.closest('label').querySelector('.row').childNodes[0].textContent.trim() : 'Slider')}</span>` : ''); };
  addEventListener('keydown', e => { if (e.target.matches('input[type=text],textarea') || e.metaKey || e.ctrlKey || e.altKey) return; const k = e.key.toLowerCase(), el = active(); if (!el) return;
    if (k === 'c') { document.body.classList.toggle('v3-panel'); dispatchEvent(new Event('resize')); return; }
    if (k === 'k') { document.body.classList.toggle('v3-keys-on'); return; }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { const sl = slider(el); if (sl) { e.preventDefault(); const st = Math.max(+sl.step || 1, (+sl.max - +sl.min) / 40); sl.value = +sl.value + (e.key === 'ArrowUp' ? st : -st); sl.dispatchEvent(new Event('input', { bubbles: true })); sl.dispatchEvent(new Event('change', { bubbles: true })); } return; }
    const i = KEYS.indexOf(k); if (i < 0) return; const b = controls(el)[i]; if (b) { e.preventDefault(); e.stopImmediatePropagation(); b.click(); setTimeout(draw, 60); } }, true);
  // touch screens have no keyboard: show the legend and let a tap press the control
  if (matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 1) { document.body.classList.add('v3-touch'); const tg = document.createElement('button'); tg.id = 'v3-ctl'; tg.textContent = 'Controls'; tg.onclick = () => { document.body.classList.toggle('v3-keys-on'); tg.classList.toggle('on', document.body.classList.contains('v3-keys-on')); }; (document.getElementById('visual') || document.body).appendChild(tg); }
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
