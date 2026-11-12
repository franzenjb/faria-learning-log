// New native slides for Days 2 to 4 of the GIS course. Same shape as course-slides.js.

/* ---------- Jupiter as ruler and as clock (Day 2) ---------- */
function jupiterScene(mode) {
  const id = mode === 'clock' ? 'jc' : 'jr';
  return {
    h1: mode === 'clock' ? 'Rømer: light needs time' : 'Jupiter\'s moons as a measuring stick',
    ctl: `<div class="controls">${CS.slider(id + '-a', 'Move the Earth round its orbit', 0, 180, 1, 0)}</div><div class="chips" id="${id}-p"><button data-v="0">Earth nearest</button><button data-v="180">Earth farthest</button></div><div class="readout" id="${id}-r"></div>`,
    fig: `<circle cx="250" cy="330" r="62" fill="none" stroke="#2e3854"/><circle cx="250" cy="330" r="16" class="fr"/><text x="250" y="366" text-anchor="middle" class="xs mu">Sun</text>
    <circle cx="572" cy="330" r="20" fill="#1c2540" stroke="#ece6da" stroke-width="1.6"/><text x="572" y="296" text-anchor="middle" class="sm">Jupiter</text>
    <circle cx="572" cy="330" r="34" fill="none" stroke="#2e3854" stroke-dasharray="2 4"/><circle id="${id}-io" cx="606" cy="330" r="4" class="fk"/>
    <line id="${id}-ray" class="red" x1="0" y1="0" x2="0" y2="0" stroke-width="1.6"/><circle id="${id}-e" r="9" class="fk"/><text id="${id}-el" class="sm"></text><text id="${id}-dl" class="md rd" text-anchor="middle"></text>
    <g transform="translate(800,140)"><rect x="-180" y="-110" width="370" height="${mode === 'clock' ? 250 : 220}" rx="8" fill="#111727" stroke="#2e3854"/><g id="${id}-in"></g></g>
    <text x="500" y="590" text-anchor="middle" class="sm mu">Orbits to scale with each other. Sun, planets and moons drawn far too big.</text>`,
    init(el) {
      const S = CS.$(el, `#${id}-a`), AU = 62; const draw = () => {
        const th = +S.value * D2R, ex = 250 + AU * Math.cos(th), ey = 330 - AU * Math.sin(th), d = Math.hypot(5.2 - Math.cos(th), Math.sin(th));
        const e = CS.$(el, `#${id}-e`); e.setAttribute('cx', ex); e.setAttribute('cy', ey); const r = CS.$(el, `#${id}-ray`); r.setAttribute('x1', ex); r.setAttribute('y1', ey); r.setAttribute('x2', 552); r.setAttribute('y2', 330);
        const l = CS.$(el, `#${id}-el`); l.setAttribute('x', ex - 14); l.setAttribute('y', ey - 14); l.setAttribute('text-anchor', 'end'); l.textContent = 'Earth';
        const dl = CS.$(el, `#${id}-dl`); dl.setAttribute('x', (ex + 552) / 2); dl.setAttribute('y', (ey + 330) / 2 - 16); dl.textContent = `${CS.fx(d, 2)} AU`;
        CS.$(el, `#${id}-a-o`).textContent = `${S.value}°`;
        if (mode === 'clock') {
          const late = (d - 4.2) * 499.005, m = Math.floor(late / 60), s = Math.round(late % 60);
          CS.$(el, `#${id}-in`).innerHTML = `<text y="-76" text-anchor="middle" class="sm mu">Io goes into the shadow</text><text y="-28" text-anchor="middle" class="xl rd">${m} min ${String(s).padStart(2, '0')} s</text><text y="4" text-anchor="middle" class="md">late</text><rect x="-120" y="34" width="240" height="10" fill="#141b2e"/><rect x="-120" y="34" width="${240 * late / 1000}" height="10" fill="#f0b35a"/><text y="76" text-anchor="middle" class="xs mu">Rømer, 1676: 22 min across the orbit</text><text y="98" text-anchor="middle" class="xs mu">Today: 16 min 40 s</text>`;
          CS.$(el, `#${id}-r`).innerHTML = `<strong>${late < 5 ? 'On time' : `${m} min ${s} s behind the table`}</strong><span>Io keeps perfect time at about 42.5 hours a lap. The news of each eclipse has ${CS.fx(d - 4.2, 2)} AU farther to travel.</span>`;
        } else {
          const am = 1.883e6 / (d * 149.6e6) / D2R * 60, px = am * 11;
          CS.$(el, `#${id}-in`).innerHTML = `<text y="-76" text-anchor="middle" class="sm mu">Through the telescope</text><line x1="${-px}" y1="0" x2="${px}" y2="0" stroke="#2e3854"/><circle r="${px * .037 + 3}" fill="#1c2540" stroke="#ece6da"/><circle cx="${px}" r="4" class="fk"/><circle cx="${-px}" r="4" fill="none" stroke="#ece6da"/><path d="M0 26 H${px}" stroke="#f0b35a" stroke-width="2"/><text x="${px / 2}" y="50" text-anchor="middle" class="md rd">${CS.fx(am, 1)}′</text><text y="88" text-anchor="middle" class="xs mu">Jupiter to Callisto: 1.17 million miles</text>`;
          CS.$(el, `#${id}-r`).innerHTML = `<strong>Callisto swings ${CS.fx(am, 1)} arcminutes out</strong><span>Same ruler, ${CS.fx(d, 1)} AU away. Angle is length divided by distance. Ten arcminutes near, seven far: the Earth's own orbit, read off Jupiter.</span>`;
        }
      };
      S.oninput = draw; el.querySelectorAll(`#${id}-p button`).forEach(b => b.onclick = () => { S.value = b.dataset.v; draw(); });
      CS.tick(el, t => { const a = t / 1400; const io = CS.$(el, `#${id}-io`); io.setAttribute('cx', 572 + 34 * Math.cos(a)); io.setAttribute('cy', 330 + 34 * Math.sin(a) * .35); io.style.opacity = (Math.cos(a) > .55 && Math.sin(a) < 0) ? .15 : 1; }); draw();
    }
  };
}
NEW_SLIDES['Jupiter as a measuring stick'] = jupiterScene('ruler');
NEW_SLIDES['Light needs time'] = jupiterScene('clock');

/* ---------- The meter from a meridian (Day 2) ---------- */
NEW_SLIDES['Picard and the meter'] = {
  h1: 'From Picard\'s degree to the meter',
  ctl: `<div class="controls">${CS.slider('mt-l', 'Walk the meridian north', 0, 90, 0.5, 48.85)}</div><div class="chips" id="mt-p"><button data-v="0">Equator</button><button data-v="41.38">Barcelona</button><button data-v="48.85">Paris</button><button data-v="51.03">Dunkirk</button><button data-v="90">Pole</button></div><div class="readout" id="mt-r"></div>`,
  fig: `<path d="M180 560 L180 100 A460 460 0 0 1 640 560 Z" fill="#141b2e" stroke="#ece6da" stroke-width="2"/><g id="mt-t"></g>
  <path id="mt-arc" fill="none" stroke="#f0b35a" stroke-width="7" d=""/><path id="mt-fr" fill="none" stroke="#ece6da" stroke-width="13" d="" opacity=".85"/>
  <circle id="mt-dot" r="10" class="fr" stroke="#0a0e18" stroke-width="2"/><line id="mt-rad" class="hair" x1="180" y1="560" x2="0" y2="0"/>
  <text x="170" y="92" text-anchor="end" class="sm">North Pole</text><text x="648" y="586" class="sm">Equator</text><text x="196" y="548" class="xs mu">center of the Earth</text>
  <g transform="translate(690,40)"><text class="md">How Picard Got 1°</text>
  <text y="40" class="sm"><tspan fill="#ff7d6f">1. Ground:</tspan> triangles</text><text y="64" class="sm mu">78,850 toises · 95 miles</text>
  <text y="104" class="sm"><tspan fill="#6fb3ff">2. Sky:</tspan> one star, each end</text><text y="128" class="sm mu">heights differ 1.382°</text>
  <text y="168" class="sm"><tspan fill="#f0b35a">3. Divide:</tspan> 78,850 ÷ 1.382</text><text y="206" class="lg rd">= 57,060 toises</text><text y="232" class="sm mu">per degree · 69.1 miles</text>
  <text y="292" class="md">Then the Meter, 1791</text><text y="322" class="sm mu">Pole to equator: 90°.</text><text y="346" class="sm mu">Call it 10,000,000 m.</text></g>`,
  init(el) {
    const S = CS.$(el, '#mt-l'), P = d => [180 + 460 * Math.cos(d * D2R), 560 - 460 * Math.sin(d * D2R)]; let tk = '';
    for (let d = 0; d <= 90; d += 10) { const a = P(d), b = [180 + 478 * Math.cos(d * D2R), 560 - 478 * Math.sin(d * D2R)]; tk += `<line class="k" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/><text class="xs mu" x="${180 + 500 * Math.cos(d * D2R)}" y="${560 - 500 * Math.sin(d * D2R) + 4}" text-anchor="middle">${d}°</text>`; } CS.$(el, '#mt-t').innerHTML = tk;
    const a1 = P(41.38), a2 = P(51.03); CS.$(el, '#mt-fr').setAttribute('d', `M${a1[0]} ${a1[1]} A460 460 0 0 0 ${a2[0]} ${a2[1]}`);
    const draw = () => { const d = +S.value, p = P(d), e = P(0); CS.$(el, '#mt-arc').setAttribute('d', d < .05 ? '' : `M${e[0]} ${e[1]} A460 460 0 0 0 ${p[0]} ${p[1]}`); const dot = CS.$(el, '#mt-dot'); dot.setAttribute('cx', p[0]); dot.setAttribute('cy', p[1]); const r = CS.$(el, '#mt-rad'); r.setAttribute('x2', p[0]); r.setAttribute('y2', p[1]); const km = d / 90 * 10000; CS.$(el, '#mt-l-o').textContent = `${CS.fx(d, 2)}° N`; CS.$(el, '#mt-r').innerHTML = `<strong>${CS.int(km * 1000)} meters from the equator</strong><span>${CS.int(km * .621371)} miles. Every degree of latitude is the same 69 miles, so one measured piece of the arc gives the whole.</span>`; };
    S.oninput = draw; el.querySelectorAll('#mt-p button').forEach(b => b.onclick = () => { S.value = b.dataset.v; draw(); }); draw();
  }
};

/* ---------- Data sources (Day 3) ---------- */
NEW_SLIDES['Where the data comes from'] = {
  h1: 'Satellites, surveys and the census',
  ctl: `<div class="chips" id="ds-p"><button data-k="sat" class="on">Satellite</button><button data-k="sur">Survey</button><button data-k="cen">Census</button></div><ul class="facts on" id="ds-f"></ul><div class="readout" id="ds-r"></div>`,
  fig: `<rect x="120" y="40" width="760" height="520" fill="#111727" stroke="#2e3854"/><g id="ds-g"></g><text id="ds-cap" x="500" y="600" text-anchor="middle" class="md"></text>`,
  init(el) {
    const rnd = CS.rng(7), W = 760, H = 520, X = 120, Y = 40; const river = x => 300 + 70 * Math.sin(x / 130) + (x - 380) * .12;
    const D = {
      sat: { cap: 'One town, as a satellite records it: a number in every cell', f: ['Records: reflected light, cell by cell', 'Landsat cell: about 100 feet on a side', 'A fresh image about every 8 days', 'Strength: sees everything. Weakness: names nothing.'], r: ['Raster', 'The satellite does not know what a road is. It knows how bright each square was.'] },
      sur: { cap: 'The same town, as a surveyor records it: measured points and lines', f: ['Records: exact positions of chosen things', 'Good to an inch or better with GPS', 'Done once, updated when someone pays', 'Strength: precise. Weakness: only what was asked for.'], r: ['Vector', 'This is Picard\'s method with better instruments: a baseline, angles, and points you can trust.'] },
      cen: { cap: 'The same town, as the census records it: a count for every area', f: ['Records: people and households, by area', 'Smallest unit: the census block', 'A full count every 10 years', 'Strength: who is there. Weakness: not where inside the block.'], r: ['Vector areas with a table', 'The map is a set of polygons. The value lives in the table attached to them.'] }
    };
    const houses = []; for (let i = 0; i < 90; i++) { const x = rnd() * W, y = rnd() * H; if (Math.abs(y - river(x)) > 34) houses.push([x, y]); }
    const show = k => {
      let s = '';
      if (k === 'sat') { const c = 38; for (let y = 0; y < H; y += c) for (let x = 0; x < W; x += c) { const dr = Math.abs(y + c / 2 - river(x + c / 2)), n = houses.filter(h => h[0] >= x && h[0] < x + c && h[1] >= y && h[1] < y + c).length, g = dr < 26 ? 150 : Math.max(196, 244 - n * 22) - Math.round(rnd() * 10); s += `<rect x="${X + x}" y="${Y + y}" width="${Math.min(c, W - x)}" height="${Math.min(c, H - y)}" fill="rgb(${275 - g},${285 - g},${310 - g})" stroke="#111727" stroke-width=".6"/>`; } }
      if (k === 'sur') { let d = ''; for (let x = 0; x <= W; x += 20) d += `${x ? 'L' : 'M'}${X + x} ${Y + river(x)}`; s += `<path d="${d}" fill="none" stroke="#ece6da" stroke-width="2"/><path d="M${X + 60} ${Y + 470} L${X + 330} ${Y + 120} L${X + 690} ${Y + 420} Z" fill="none" stroke="#f0b35a" stroke-width="1.4"/>` + [[60, 470], [330, 120], [690, 420]].map(p => `<path d="M${X + p[0]} ${Y + p[1] - 10} l9 16 h-18 z" fill="#f0b35a"/>`).join('') + houses.map(h => `<rect x="${X + h[0] - 4}" y="${Y + h[1] - 4}" width="8" height="8" fill="#ece6da"/>`).join('') + `<text x="${X + 344}" y="${Y + 112}" class="xs rd">control point</text>`; }
      if (k === 'cen') { const cx = [0, 250, 520, W], cy = [0, 260, H]; for (let j = 0; j < 2; j++) for (let i = 0; i < 3; i++) { const n = houses.filter(h => h[0] >= cx[i] && h[0] < cx[i + 1] && h[1] >= cy[j] && h[1] < cy[j + 1]).length * 3, a = Math.min(.8, n / 80); s += `<rect x="${X + cx[i]}" y="${Y + cy[j]}" width="${cx[i + 1] - cx[i]}" height="${cy[j + 1] - cy[j]}" fill="rgba(240,179,90,${a * .55})" stroke="#ece6da" stroke-width="1.4"/><text x="${X + (cx[i] + cx[i + 1]) / 2}" y="${Y + (cy[j] + cy[j + 1]) / 2 + 12}" text-anchor="middle" class="xl">${n}</text><text x="${X + (cx[i] + cx[i + 1]) / 2}" y="${Y + (cy[j] + cy[j + 1]) / 2 + 38}" text-anchor="middle" class="xs mu">people</text>`; } }
      CS.$(el, '#ds-g').innerHTML = s; CS.$(el, '#ds-cap').textContent = D[k].cap; CS.$(el, '#ds-f').innerHTML = D[k].f.map(x => `<li>${x}</li>`).join(''); CS.$(el, '#ds-r').innerHTML = `<strong>${D[k].r[0]}</strong><span>${D[k].r[1]}</span>`;
      el.querySelectorAll('#ds-p button').forEach(b => b.classList.toggle('on', b.dataset.k === k));
    };
    el.querySelectorAll('#ds-p button').forEach(b => b.onclick = () => show(b.dataset.k)); show('sat');
  }
};

/* ---------- Coordinate reference systems (Day 3) ---------- */
NEW_SLIDES['Coordinate reference systems'] = {
  h1: 'Two numbers mean nothing without the system', canvas: true,
  ctl: `<div class="chips" id="cr-p"><button data-k="geo" class="on">Latitude, longitude</button><button data-k="utm">UTM</button><button data-k="spc">State Plane</button></div><div class="btns"><button id="cr-mix">Read it in the wrong system</button></div><div class="readout" id="cr-r"></div>`,
  init(el) {
    const o = CS.canvas(el); let k = 'geo', mix = false; const LAT = 27.9506, LON = -82.4572, box = [-83.25, 27.3, -81.9, 28.35];
    // transverse Mercator on GRS80, good to a meter or so at this scale
    const tm = (lat, lon, lon0, k0, fe, fn, lat0 = 0) => { const a = 6378137, f = 1 / 298.257222101, e2 = f * (2 - f), ep2 = e2 / (1 - e2), ph = lat * D2R, M = p => a * ((1 - e2 / 4 - 3 * e2 * e2 / 64 - 5 * e2 ** 3 / 256) * p - (3 * e2 / 8 + 3 * e2 * e2 / 32 + 45 * e2 ** 3 / 1024) * Math.sin(2 * p) + (15 * e2 * e2 / 256 + 45 * e2 ** 3 / 1024) * Math.sin(4 * p) - (35 * e2 ** 3 / 3072) * Math.sin(6 * p)); const N = a / Math.sqrt(1 - e2 * Math.sin(ph) ** 2), T = Math.tan(ph) ** 2, C = ep2 * Math.cos(ph) ** 2, A = (lon - lon0) * D2R * Math.cos(ph); return [fe + k0 * N * (A + (1 - T + C) * A ** 3 / 6 + (5 - 18 * T + T * T + 72 * C - 58 * ep2) * A ** 5 / 120), fn + k0 * (M(ph) - M(lat0 * D2R) + N * Math.tan(ph) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * A ** 4 / 24 + (61 - 58 * T + T * T + 600 * C - 330 * ep2) * A ** 6 / 720))]; };
    const utm = (la, lo) => tm(la, lo, -81, .9996, 500000, 0), spc = (la, lo) => tm(la, lo, -82, 1 - 1 / 17000, 200000, 0, 24 + 1 / 3).map(v => v / 0.3048006096);
    const draw = () => {
      if (!o.fit()) return; const { ctx, w, h } = o, sc = Math.min((w - 40) / ((box[2] - box[0]) * Math.cos(27.8 * D2R)), (h - 90) / (box[3] - box[1])), cx = w / 2, cy = h / 2 + 8, P = (lo, la) => [cx + (lo - (box[0] + box[2]) / 2) * Math.cos(27.8 * D2R) * sc, cy - (la - (box[1] + box[3]) / 2) * sc];
      const a = P(box[0], box[3]), b = P(box[2], box[1]); ctx.save(); ctx.beginPath(); ctx.rect(a[0], a[1], b[0] - a[0], b[1] - a[1]); ctx.fillStyle = '#111727'; ctx.fill(); ctx.clip();
      // grid in the chosen system, traced by sampling
      ctx.strokeStyle = CS.HAIR; ctx.lineWidth = 1; ctx.font = '18px Georgia,serif'; ctx.fillStyle = CS.MUTE;
      const f = k === 'utm' ? utm : k === 'spc' ? spc : (la, lo) => [lo, la], step = k === 'utm' ? 20000 : k === 'spc' ? 100000 : .25;
      for (const ax of [0, 1]) { const lo0 = f(box[1], box[0])[ax], hi0 = f(box[3], box[2])[ax]; for (let v = Math.ceil(Math.min(lo0, hi0) / step - 1) * step; v <= Math.max(lo0, hi0) + step; v += step) { ctx.beginPath(); let pen = false, lp = null; for (let u = 0; u <= 1; u += .02) { // walk the other axis, solve by scanning
            let best = null, bd = 1e12; for (let q = 0; q <= 1; q += .01) { const lo = ax ? box[0] + u * (box[2] - box[0]) : box[0] + q * (box[2] - box[0]), la = ax ? box[1] + q * (box[3] - box[1]) : box[1] + u * (box[3] - box[1]), d = Math.abs(f(la, lo)[ax] - v); if (d < bd) { bd = d; best = [lo, la]; } } if (bd < step * .03) { const p = P(best[0], best[1]); pen ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); pen = true; lp = p; } } ctx.stroke(); if (lp) ctx.fillText(k === 'geo' ? `${Math.abs(v).toFixed(2)}°` : CS.int(v), ax ? a[0] + 6 : lp[0] + 4, ax ? lp[1] - 4 : a[1] + 14); } }
      ctx.strokeStyle = CS.INK; ctx.lineWidth = 1.3; ctx.beginPath(); for (const ln of COAST_GULF.lines) { let pen = false; for (let i = 0; i < ln.length; i += 2) { const lo = ln[i] / COAST_GULF.q, la = ln[i + 1] / COAST_GULF.q; if (lo < box[0] - .3 || lo > box[2] + .3 || la < box[1] - .3 || la > box[3] + .3) { pen = false; continue; } const p = P(lo, la); pen ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); pen = true; } } ctx.stroke();
      const p = P(LON, LAT); ctx.fillStyle = CS.RED; ctx.beginPath(); ctx.arc(p[0], p[1], 8, 0, 7); ctx.fill(); ctx.fillStyle = CS.INK; ctx.font = '500 16px Georgia,serif'; ctx.fillText('The shelter, Tampa', p[0] + 14, p[1] + 5);
      if (mix) { const q = P(LON + .31, LAT - .22); ctx.strokeStyle = CS.RED; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); ctx.setLineDash([]); ctx.beginPath(); ctx.arc(q[0], q[1], 8, 0, 7); ctx.stroke(); ctx.fillStyle = CS.RED; ctx.fillText('where the map put it', q[0] + 14, q[1] + 5); }
      ctx.restore(); ctx.strokeStyle = CS.INK; ctx.lineWidth = 1; ctx.strokeRect(a[0], a[1], b[0] - a[0], b[1] - a[1]);
      const u = utm(LAT, LON), s = spc(LAT, LON); const R = { geo: [`${LAT.toFixed(4)}° N, ${Math.abs(LON).toFixed(4)}° W`, 'Degrees on the globe. Angles, not distances: a degree of longitude here is 61 miles, not 69.'], utm: [`${CS.int(u[0])} m E, ${CS.int(u[1])} m N`, 'UTM zone 17 North. Meters on a flat sheet, six degrees wide. Good for measuring.'], spc: [`${CS.int(s[0])} ft E, ${CS.int(s[1])} ft N`, 'Florida West State Plane. Feet, tuned to one strip of one state. What the county surveyor uses.'] };
      CS.$(el, '#cr-r').innerHTML = mix ? `<strong>Right numbers, wrong system</strong><span>Same shelter, same digits, read on another grid or datum. A datum slip alone can move a point 100 feet or more. A wrong zone moves it miles. Always ask: which system?</span>` : `<strong>${R[k][0]}</strong><span>${R[k][1]}</span>`;
    };
    el.querySelectorAll('#cr-p button').forEach(b => b.onclick = () => { k = b.dataset.k; mix = false; el.querySelectorAll('#cr-p button').forEach(x => x.classList.toggle('on', x === b)); draw(); });
    CS.$(el, '#cr-mix').onclick = () => { mix = !mix; draw(); }; addEventListener('resize', draw); new MutationObserver(draw).observe(el, { attributes: true, attributeFilter: ['class'] }); draw();
  }
};

/* ---------- Error propagation (Day 4) ---------- */
NEW_SLIDES['Error propagation'] = {
  h1: 'Small errors, carried forward, grow', canvas: true,
  ctl: `<div class="controls">${CS.slider('ep-h', 'Compass error', 0, 6, 0.1, 2)}${CS.slider('ep-s', 'Speed error', 0, 20, 0.5, 8)}${CS.slider('ep-d', 'Days without a fix', 1, 30, 1, 12)}</div><div class="readout" id="ep-r"></div>`,
  init(el) {
    const o = CS.canvas(el), H = CS.$(el, '#ep-h'), S = CS.$(el, '#ep-s'), Dd = CS.$(el, '#ep-d');
    const draw = () => {
      if (!o.fit()) return; const { ctx, w, h } = o, sh = +H.value * D2R, ss = +S.value / 100, days = +Dd.value, rnd = CS.rng(42), g = () => { let u = 0; for (let i = 0; i < 6; i++) u += rnd(); return (u - 3) / .7071; };
      const run = 100 * 1.15078, x0 = 50, y0 = h / 2, px = (w - 140) / (30 * run); // 100 nautical miles a day, in statute miles
      ctx.strokeStyle = CS.HAIR; ctx.setLineDash([4, 6]); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(w - 30, y0); ctx.stroke(); ctx.setLineDash([]);
      const ends = []; ctx.strokeStyle = 'rgba(236,230,218,.16)'; ctx.lineWidth = 1;
      for (let n = 0; n < 160; n++) { let x = 0, y = 0; const bias = g() * sh * .5, sb = g() * ss * .5; ctx.beginPath(); ctx.moveTo(x0, y0); for (let d = 0; d < days; d++) { const a = bias + g() * sh, v = run * (1 + sb + g() * ss); x += v * Math.cos(a); y += v * Math.sin(a); ctx.lineTo(x0 + x * px, y0 + y * px); } ctx.stroke(); ends.push([x, y]); }
      const mx = ends.reduce((s, e) => s + e[0], 0) / ends.length, my = ends.reduce((s, e) => s + e[1], 0) / ends.length, rs = ends.map(e => Math.hypot(e[0] - mx, e[1] - my)).sort((a, b) => a - b), r95 = rs[Math.floor(rs.length * .95)];
      ctx.fillStyle = CS.RED; ends.forEach(e => { ctx.beginPath(); ctx.arc(x0 + e[0] * px, y0 + e[1] * px, 2.4, 0, 7); ctx.fill(); });
      ctx.strokeStyle = CS.RED; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(x0 + mx * px, y0 + my * px, Math.max(3, r95 * px), 0, 7); ctx.stroke();
      ctx.fillStyle = CS.INK; ctx.beginPath(); ctx.arc(x0, y0, 6, 0, 7); ctx.fill(); ctx.font = `500 ${Math.max(21, h * .04)}px Georgia,serif`; ctx.textAlign = 'left'; ctx.fillText('last sure position', x0 - 6, y0 + 30);
      ctx.fillStyle = CS.RED; ctx.textAlign = 'center'; ctx.fillText(`somewhere in here: ${CS.int(r95)} miles either way`, Math.min(w - 220, Math.max(240, x0 + mx * px)), Math.max(30, y0 + my * px - r95 * px - 16));
      ctx.fillStyle = CS.MUTE; ctx.font = '19px Georgia,serif'; ctx.fillText('160 voyages, each steered and logged as carefully as the last', w / 2, h - 16);
      CS.$(el, '#ep-h-o').textContent = `±${CS.fx(+H.value, 1)}°`; CS.$(el, '#ep-s-o').textContent = `±${CS.fx(+S.value, 1)}%`; CS.$(el, '#ep-d-o').textContent = `${days} days`;
      CS.$(el, '#ep-r').innerHTML = `<strong>After ${days} days: ${CS.int(r95)} miles of doubt</strong><span>Nobody made a mistake. Each day's small error rode on top of the last. This is the fleet off Scilly, and it is every chain of measurements you will ever inherit.</span>`;
    };
    H.oninput = S.oninput = Dd.oninput = draw; addEventListener('resize', draw); new MutationObserver(draw).observe(el, { attributes: true, attributeFilter: ['class'] }); draw();
  }
};

/* ---------- Buffers and overlays share one town (Day 4) ---------- */
const TOWN = (() => { const rnd = CS.rng(23), houses = []; for (let i = 0; i < 150; i++) houses.push([70 + rnd() * 860, 60 + rnd() * 500]); return { houses, river: [[40, 470], [200, 420], [330, 440], [470, 360], [610, 330], [760, 250], [960, 215]], shelter: [520, 210], zone: [[300, 110], [420, 90], [470, 170], [430, 250], [330, 262], [270, 190]], mile: 100 }; })();
const segD = (p, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy))); return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy); };
const inPoly = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const a = poly[i], b = poly[j]; if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };

NEW_SLIDES['Buffers'] = {
  h1: 'Buffers: everything within a distance',
  ctl: `<div class="chips" id="bf-p"><button data-k="pt" class="on">Round a point</button><button data-k="ln">Along a line</button><button data-k="pg">Round an area</button></div><div class="controls">${CS.slider('bf-d', 'Distance', 0.1, 2, 0.05, 0.75)}</div><div class="readout" id="bf-r"></div>`,
  fig: `<rect x="40" y="40" width="920" height="540" fill="#111727" stroke="#2e3854"/><g id="bf-buf"></g><path id="bf-riv" fill="none" stroke="#ece6da" stroke-width="2.5" d=""/><path id="bf-zone" fill="#1f2a46" stroke="#ece6da" stroke-width="1.5" d=""/><g id="bf-h"></g>
  <g transform="translate(${TOWN.shelter[0]},${TOWN.shelter[1]})"><rect x="-11" y="-11" width="22" height="22" fill="#0a0e18" stroke="#f0b35a" stroke-width="2"/><path d="M-6 0 H6 M0 -6 V6" stroke="#f0b35a" stroke-width="3.4"/></g>
  <text x="${TOWN.shelter[0] + 18}" y="${TOWN.shelter[1] - 14}" class="sm">shelter</text><text x="372" y="182" text-anchor="middle" class="sm mu">chemical plant</text><text x="170" y="408" class="sm mu">river</text>
  <line class="k" x1="70" y1="556" x2="170" y2="556" stroke-width="2"/><text x="120" y="548" text-anchor="middle" class="xs">1 mile</text>`,
  init(el) {
    const S = CS.$(el, '#bf-d'); let k = 'pt'; const T = TOWN, path = (pts, z) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join('') + (z ? 'Z' : '');
    CS.$(el, '#bf-riv').setAttribute('d', path(T.river)); CS.$(el, '#bf-zone').setAttribute('d', path(T.zone, 1));
    const names = { pt: ['of the shelter', 'Who can walk to the shelter?'], ln: ['of the river', 'Who floods first?'], pg: ['of the plant', 'Who do we warn?'] };
    const draw = () => {
      const d = +S.value * T.mile, sty = `fill="rgba(240,179,90,.16)" stroke="rgba(240,179,90,.16)" stroke-linejoin="round" stroke-linecap="round"`;
      CS.$(el, '#bf-buf').innerHTML = k === 'pt' ? `<circle cx="${T.shelter[0]}" cy="${T.shelter[1]}" r="${d}" fill="rgba(240,179,90,.16)" stroke="#f0b35a" stroke-dasharray="5 5"/>` : k === 'ln' ? `<path d="${path(T.river)}" fill="none" stroke="rgba(240,179,90,.16)" stroke-width="${2 * d}" stroke-linejoin="round" stroke-linecap="round"/>` : `<path d="${path(T.zone, 1)}" ${sty} stroke-width="${2 * d}"/>`;
      let n = 0; CS.$(el, '#bf-h').innerHTML = T.houses.map(h => { let dist; if (k === 'pt') dist = Math.hypot(h[0] - T.shelter[0], h[1] - T.shelter[1]); else if (k === 'ln') dist = Math.min(...T.river.slice(1).map((b, i) => segD(h, T.river[i], b))); else dist = inPoly(h, T.zone) ? 0 : Math.min(...T.zone.map((b, i) => segD(h, T.zone[(i + T.zone.length - 1) % T.zone.length], b))); const on = dist <= d; if (on) n++; return `<rect x="${h[0] - 4}" y="${h[1] - 4}" width="8" height="8" fill="${on ? '#f0b35a' : '#5d6680'}"/>`; }).join('');
      CS.$(el, '#bf-d-o').textContent = `${CS.fx(+S.value, 2)} miles`;
      CS.$(el, '#bf-r').innerHTML = `<strong>${n} of ${T.houses.length} homes within ${CS.fx(+S.value, 2)} miles ${names[k][0]}</strong><span>${names[k][1]} A buffer turns "near" into a shape you can count inside.</span>`;
    };
    S.oninput = draw; el.querySelectorAll('#bf-p button').forEach(b => b.onclick = () => { k = b.dataset.k; el.querySelectorAll('#bf-p button').forEach(x => x.classList.toggle('on', x === b)); draw(); }); draw();
  }
};

NEW_SLIDES['Overlays'] = {
  h1: 'Overlays: two maps, one answer',
  ctl: `<div class="chips" id="ov-p"><button data-k="both" class="on">Both layers</button><button data-k="and">Inside the flood</button><button data-k="not">Outside the flood</button></div><div class="controls">${CS.slider('ov-w', 'How high the river rises', 0.2, 2, 0.05, 0.8)}</div><div class="readout" id="ov-r"></div>`,
  fig: `<defs><clipPath id="ov-clip"><path id="ov-cp" d=""/></clipPath><mask id="ov-mask"><rect x="0" y="0" width="1000" height="640" fill="#111727"/><path id="ov-mp" d="" stroke="#000" fill="none" stroke-linejoin="round" stroke-linecap="round"/></mask></defs>
  <rect x="40" y="40" width="920" height="540" fill="#111727" stroke="#2e3854"/><g id="ov-blocks"></g><path id="ov-flood" fill="none" stroke="rgba(236,230,218,.22)" stroke-linejoin="round" stroke-linecap="round" d=""/><path id="ov-riv" fill="none" stroke="#ece6da" stroke-width="2" d=""/><g id="ov-lab"></g>`,
  init(el) {
    const S = CS.$(el, '#ov-w'), T = TOWN; let k = 'both'; const cx = [40, 270, 500, 730, 960], cy = [40, 220, 400, 580], pop = [[420, 610, 380, 240], [530, 880, 760, 310], [350, 640, 920, 450]], d = T.river.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join('');
    ['#ov-flood', '#ov-riv', '#ov-mp'].forEach(q => CS.$(el, q).setAttribute('d', d));
    const draw = () => {
      const w = +S.value * T.mile; CS.$(el, '#ov-flood').setAttribute('stroke-width', 2 * w); CS.$(el, '#ov-mp').setAttribute('stroke-width', 2 * w);
      let s = '', lab = '', hit = 0, all = 0;
      for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) { let inn = 0, n = 0; for (let y = cy[j] + 9; y < cy[j + 1]; y += 18) for (let x = cx[i] + 9; x < cx[i + 1]; x += 18) { n++; if (Math.min(...T.river.slice(1).map((b, q) => segD([x, y], T.river[q], b))) <= w) inn++; } const share = inn / n, p = pop[j][i]; hit += p * share; all += p;
        const a = (p / 920) * .5, r = `x="${cx[i]}" y="${cy[j]}" width="${cx[i + 1] - cx[i]}" height="${cy[j + 1] - cy[j]}"`;
        s += `<rect ${r} fill="#0a0e18" stroke="#ece6da" stroke-width="1.2"/>` + (k === 'both' ? `<rect ${r} fill="rgba(240,179,90,${a})" stroke="#ece6da" stroke-width="1.2"/>` : '');
        const v = k === 'and' ? p * share : k === 'not' ? p * (1 - share) : p; lab += `<text x="${(cx[i] + cx[i + 1]) / 2}" y="${cy[j] + 34}" text-anchor="middle" class="md">${CS.int(v)}</text>`; }
      // the overlay result: block color clipped to, or masked by, the flood shape
      const tint = (j, i) => `<rect x="${cx[i]}" y="${cy[j]}" width="${cx[i + 1] - cx[i]}" height="${cy[j + 1] - cy[j]}" fill="rgba(240,179,90,${(pop[j][i] / 920) * .75})"/>`; let res = ''; for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) res += tint(j, i);
      CS.$(el, '#ov-cp').setAttribute('d', ''); CS.$(el, '#ov-blocks').innerHTML = s + (k === 'not' ? `<g mask="url(#ov-mask)">${res}</g>` : '') + (k === 'and' ? `<mask id="ov-keep2"><rect width="1000" height="640" fill="#000"/><path d="${d}" stroke="#111727" stroke-width="${2 * w}" fill="none" stroke-linejoin="round" stroke-linecap="round"/></mask><g mask="url(#ov-keep2)">${res}</g>` : '');
      CS.$(el, '#ov-flood').style.display = k === 'both' ? '' : 'none'; CS.$(el, '#ov-lab').innerHTML = lab + `<text x="52" y="572" class="xs mu">Census blocks, with people counted in each</text>`;
      CS.$(el, '#ov-w-o').textContent = `${CS.fx(+S.value, 2)} miles each side`;
      CS.$(el, '#ov-r').innerHTML = k === 'both' ? `<strong>Layer 1: who lives where. Layer 2: where the water goes.</strong><span>Neither map answers the question alone.</span>` : k === 'and' ? `<strong>About ${CS.int(hit / 10) * 10} people in the water</strong><span>Blocks cut by the flood line. Each block's count is split by the share of its area that is wet. That split is an assumption: it treats people as spread evenly.</span>` : `<strong>About ${CS.int((all - hit) / 10) * 10} people stay dry</strong><span>The same two layers, the opposite question. Of ${CS.int(all)} people in all.</span>`;
    };
    S.oninput = draw; el.querySelectorAll('#ov-p button').forEach(b => b.onclick = () => { k = b.dataset.k; el.querySelectorAll('#ov-p button').forEach(x => x.classList.toggle('on', x === b)); draw(); }); draw();
  }
};

/* ---------- Gaia: a dime on the Moon, the real sky map, then fly out to the galaxy ---------- */
NEW_SLIDES['Gaia galaxy'] = {
  h1: 'Gaia Measured 1.8 Billion Stars', canvas: true,
  ctl: `<div class="chips" id="gx-steps"><button data-s="0" class="on">1 · A Dime on the Moon</button><button data-s="1">2 · The Map It Made</button><button data-s="2">3 · Fly Out to the Galaxy</button></div>
  <div class="btns" id="gx-btns"></div><div class="readout" id="gx-r"></div>`,
  init(el) {
    const o = CS.canvas(el); let step = 0, t0 = performance.now(), find = -1, zoomGo = false, zT = 0;
    const moon = new Image(); moon.src = 'img/moon-first-quarter.jpg'; const sky = new Image(); sky.src = '/img/Gaia_EDR3_All_Sky_Colour_Map_ESA_Gaia_DPAC.jpg';
    const rnd = (i, s) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
    // galaxy: log-spiral arms in light-years, Sun 26,000 ly from the center
    const STARS = []; for (let i = 0; i < 5200; i++) { const arm = i % 4, r = 5000 + Math.pow(rnd(i, 1), .9) * 45000, th = arm * Math.PI / 2 + 2.6 * Math.log(r / 5000) + (rnd(i, 2) - .5) * (.35 + 3000 / r), sp = 1200 + r * .06; STARS.push([r * Math.cos(th) + (rnd(i, 3) - .5) * sp, r * Math.sin(th) + (rnd(i, 4) - .5) * sp, rnd(i, 5)]); }
    for (let i = 0; i < 1800; i++) { const r = 4000 + rnd(i, 11) * 46000, th = rnd(i, 12) * 6.283; STARS.push([r * Math.cos(th), r * Math.sin(th), .3]); }
    for (let i = 0; i < 1400; i++) { const r = Math.pow(rnd(i, 6), 1.6) * 9000, th = rnd(i, 7) * 6.283; STARS.push([r * Math.cos(th) * 1.5, r * Math.sin(th) * .6, .95]); }
    const HALO = []; for (let i = 0; i < 260; i++) { const r = 20000 + rnd(i, 8) * 55000, th = rnd(i, 9) * 6.283; HALO.push([r * Math.cos(th), r * Math.sin(th) * .9]); }
    const SUN = [-26000 * Math.cos(.35), 26000 * Math.sin(.35)];
    const FINDS = [
      ['A Swallowed Galaxy', 'About 10 billion years ago a smaller galaxy crashed into ours. Gaia found its stars still streaming through our halo, all moving the same odd way. Astronomers named it Gaia-Enceladus.', '#f0b35a'],
      ['A Snail-Shell Wobble', 'Plot the speed of nearby stars against their height above the disk and they curl into a snail shell. Something shook our part of the galaxy: probably a small galaxy passing through, and it is still ringing.', '#6fb3ff'],
      ['A Sleeping Black Hole', 'Gaia BH3, 1,926 light-years away, 33 times the Sun’s mass. Nobody can see it. Gaia saw a star wobbling around nothing.', '#ff7d6f']];
    const btns = CS.$(el, '#gx-btns'), r = CS.$(el, '#gx-r');
    const setStep = s => { step = s; t0 = performance.now(); find = -1; zoomGo = false; zT = 0;
      el.querySelectorAll('#gx-steps button').forEach(b => b.classList.toggle('on', +b.dataset.s === s));
      btns.innerHTML = s === 0 ? '<button class="primary" id="gx-zoom">Zoom Down to the Dime</button><button id="gx-reset">Start Over</button>' : s === 2 ? FINDS.map((f, i) => `<button data-f="${i}">${f[0]}</button>`).join('') : '';
      r.innerHTML = s === 0 ? '<strong>How small an angle can Gaia measure?</strong>' : s === 1 ? '<strong>1.8 billion stars</strong><span class="big">position, distance, motion</span>' : '<strong>Pick a discovery.</strong>';
      if (s === 0) { CS.$(el, '#gx-zoom').onclick = () => { zoomGo = true; zT = performance.now(); }; CS.$(el, '#gx-reset').onclick = () => setStep(0); }
      if (s === 2) btns.querySelectorAll('button').forEach(b => b.onclick = () => { find = +b.dataset.f; btns.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); r.innerHTML = `<strong>${FINDS[find][0]}</strong><p class="why">${FINDS[find][1]}</p>`; });
    };
    el.querySelectorAll('#gx-steps button').forEach(b => b.onclick = () => setStep(+b.dataset.s)); setStep(0);
    const T = (ctx, s, x, y, o2) => { ctx.font = `${o2.w || 500} ${o2.z}px ${o2.f || 'Georgia, serif'}`; ctx.textAlign = o2.a || 'center'; ctx.fillStyle = o2.c || '#ece6da'; ctx.fillText(s, x, y); };
    CS.tick(el, t => {
      if (!o.fit()) return; const { ctx, w, h } = o, k = Math.min(1, (t - t0) / 2600), e = k * k * (3 - 2 * k);
      ctx.fillStyle = '#05070d'; ctx.fillRect(0, 0, w, h);
      if (step === 0) {
        // zoom from the whole Moon (2,159 mi) to a dime (0.7 in): about 200 million times
        const q = zoomGo ? Math.min(1, (t - zT) / 6000) : 0, qe = q * q * (3 - 2 * q), Z = Math.pow(1.94e8, qe), cx = w * .5, cy = h * .5, R0 = Math.min(w, h) * .36, R = R0 * Z;
        const fov = 2159 * 2 * (h * .5) / (R0 * 2) / Z; // miles across the screen height
        if (Z < 60 && moon.complete && moon.naturalWidth) { const sc = R / 390, ox = cx + 140 * sc; ctx.save(); ctx.globalAlpha = Math.max(0, 1 - Math.log10(Z) / 1.8); ctx.beginPath(); ctx.arc(ox, cy, R, 0, 6.283); ctx.clip(); ctx.drawImage(moon, ox - 332 * sc, cy - 444 * sc, 900 * sc, 900 * sc); ctx.restore(); }
        if (Z > 8) { // the ground: gray dust with craters at whatever scale is on screen
          ctx.globalAlpha = Math.min(1, (Math.log10(Z) - .9) / .8); ctx.fillStyle = '#8a867e'; ctx.fillRect(0, 0, w, h);
          const lv = Math.log10(Z); for (let L = Math.floor(lv) - 1; L <= Math.floor(lv) + 1; L++) { const sz = Math.pow(10, lv - L) * 60; if (sz < 8 || sz > w * 3) continue; for (let i = 0; i < 26; i++) { const x = rnd(i, L + 20) * w, y = rnd(i, L + 40) * h, rr = sz * (.3 + rnd(i, L + 60)); ctx.fillStyle = 'rgba(60,57,52,.18)'; ctx.beginPath(); ctx.arc(x, y, rr, 0, 6.283); ctx.fill(); ctx.strokeStyle = 'rgba(200,196,188,.25)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x - rr * .1, y - rr * .1, rr, 3.6, 5.6); ctx.stroke(); } }
          ctx.globalAlpha = 1; }
        if (qe > .97) { const dr = Math.min(w, h) * .12 * Math.min(1, (qe - .97) / .03); const g = ctx.createRadialGradient(cx - dr * .3, cy - dr * .3, dr * .1, cx, cy, dr); g.addColorStop(0, '#f4f4f4'); g.addColorStop(1, '#8e9196'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, dr, 0, 6.283); ctx.fill(); ctx.strokeStyle = '#5c5f63'; ctx.lineWidth = 3; ctx.stroke(); T(ctx, '10¢', cx, cy + 10, { z: Math.max(14, dr * .35), c: '#6b6e73', w: 600 }); T(ctx, 'a dime, 0.7 inch', cx, cy + dr + 40, { z: 24, c: '#ffffff', w: 600 }); }
        const fovS = fov >= 1 ? `${Math.round(fov).toLocaleString()} miles` : fov * 5280 >= 1 ? `${Math.round(fov * 5280).toLocaleString()} feet` : `${(fov * 63360).toFixed(1)} inches`;
        ctx.fillStyle = 'rgba(5,7,13,.78)'; ctx.fillRect(0, h - 78, w, 78);
        T(ctx, qe > .97 ? 'Gaia can see an angle this small: a dime on the Moon, from Earth.' : zoomGo ? `Screen shows ${fovS} of the Moon` : 'The Moon, 239,000 miles away', w / 2, h - 34, { z: 26, c: qe > .97 ? '#f0b35a' : '#ece6da' });
        if (qe > .97) r.innerHTML = '<strong>A dime on the Moon</strong><span class="big">10 millionths of an arcsecond</span><p class="why">That angle, measured again and again, gave Gaia the distance to 1.8 billion stars.</p>';
      } else if (step === 1) {
        if (sky.complete && sky.naturalWidth) { const s = Math.min(w / sky.naturalWidth, (h - 120) / sky.naturalHeight), iw = sky.naturalWidth * s, ih = sky.naturalHeight * s; ctx.globalAlpha = e; ctx.drawImage(sky, (w - iw) / 2, 30, iw, ih); ctx.globalAlpha = 1;
          T(ctx, 'The whole sky, from Gaia’s 1.8 billion stars', w / 2, 30 + ih + 44, { z: 26, c: '#f0b35a' }); T(ctx, 'Not a photograph: every dot of light is a star Gaia measured. ESA/Gaia/DPAC', w / 2, 30 + ih + 76, { z: 15, c: '#9a9382' }); }
      } else {
        // fly out: start close to the Sun, end with the whole galaxy
        const S = Math.min(w, h) / 120000, z = 40 * Math.pow(1 / 40, e), sc = S * z, fx = SUN[0] * (1 - e), fy = SUN[1] * (1 - e), X = x => w / 2 + (x - fx) * sc, Y = y => h / 2 + (y - fy) * sc;
        if (find === 0) for (const p of HALO) { ctx.fillStyle = 'rgba(240,179,90,.55)'; ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), 2.4, 0, 6.283); ctx.fill(); }
        const cg = ctx.createRadialGradient(X(0), Y(0), 0, X(0), Y(0), 14000 * sc); cg.addColorStop(0, 'rgba(255,226,170,.55)'); cg.addColorStop(1, 'rgba(255,226,170,0)'); ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(X(0), Y(0), 14000 * sc, 0, 6.283); ctx.fill();
        for (const p of STARS) { const x = X(p[0]), y = Y(p[1]); if (x < -5 || x > w + 5 || y < -5 || y > h + 5) continue; ctx.fillStyle = p[2] > .85 ? 'rgba(255,230,190,.8)' : 'rgba(170,195,255,.55)'; ctx.fillRect(x, y, 1.6, 1.6); }
        const sx = X(SUN[0]), sy = Y(SUN[1]); ctx.fillStyle = '#ffd66b'; ctx.beginPath(); ctx.arc(sx, sy, 6, 0, 6.283); ctx.fill(); T(ctx, 'the Sun · us', sx + 12, sy + 6, { z: 18, a: 'left', c: '#ffd66b' });
        if (e > .9) { T(ctx, 'the Milky Way · 100,000 light-years across', w / 2, h - 30, { z: 20, c: '#9a9382' }); T(ctx, 'center', X(0), Y(0) + 6, { z: 15, c: '#cfc8ba' }); }
        if (find === 1) { ctx.strokeStyle = '#6fb3ff'; ctx.lineWidth = 3; ctx.beginPath(); for (let a = 0; a < 18; a += .1) { const rr = 4 + a * 3.2; const px = sx + rr * Math.cos(a), py = sy + rr * Math.sin(a); a ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); T(ctx, 'the snail shell: our neighborhood, still wobbling', sx + 70, sy - 64, { z: 18, a: 'left', c: '#6fb3ff' }); }
        if (find === 2) { const bx = sx + 22, by = sy - 26; ctx.strokeStyle = 'rgba(255,125,111,.6)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(bx, by); ctx.stroke(); ctx.fillStyle = '#000'; ctx.strokeStyle = '#ff7d6f'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(bx, by, 9, 0, 6.283); ctx.fill(); ctx.stroke(); T(ctx, 'Gaia BH3 · 1,926 light-years from us', bx - 30, by - 26, { z: 18, a: 'right', c: '#ff7d6f' }); }
        if (find === 0) T(ctx, 'the swallowed galaxy’s stars, all through the halo', w / 2, 40, { z: 20, c: '#f0b35a' });
      }
    });
  }
};
