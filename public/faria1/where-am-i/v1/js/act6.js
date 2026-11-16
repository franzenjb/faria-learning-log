/* ACT 6 — TODAY */
const ACT6 = 'Today';

/* ---- a real-geometry GPS constellation (circular orbits, 55° inclination, six planes) ---- */
const GPS = {
  RE:6371, RS:26560, INC:55*RAD, PER:11.967, SID:23.934, C:299792.458,
  get A(){ return this.RS/this.RE; },
  sats: (() => { const out = [], n = [6,5,6,5,5,5]; n.forEach((m, p) => { for (let j = 0; j < m; j++) out.push({ p, u0: j/m*2*Math.PI + p*0.42 }); }); return out; })(),
  eci(p, u){ const x = Math.cos(u), y = Math.sin(u)*Math.cos(this.INC), z = Math.sin(u)*Math.sin(this.INC), O = p*60*RAD;
    return [x*Math.cos(O) - y*Math.sin(O), x*Math.sin(O) + y*Math.cos(O), z]; },
  ecef(p, u, T){ const v = this.eci(p, u), th = 2*Math.PI*T/this.SID, A = this.A;
    return [ (v[0]*Math.cos(th) + v[1]*Math.sin(th))*A, (-v[0]*Math.sin(th) + v[1]*Math.cos(th))*A, v[2]*A ]; },
  pos(sat, T){ return this.ecef(sat.p, sat.u0 + 2*Math.PI*T/this.PER, T); },
  unit(ll){ const l = ll[0]*RAD, f = ll[1]*RAD; return [Math.cos(f)*Math.cos(l), Math.cos(f)*Math.sin(l), Math.sin(f)]; },
  ll(v){ const r = Math.hypot(v[0], v[1], v[2]); return [Math.atan2(v[1], v[0])/RAD, Math.asin(v[2]/r)/RAD, r]; },
  dist(a, b){ return Math.hypot(a[0]-b[0], a[1]-b[1], a[2]-b[2]); },
  elev(S, P){ const d = [S[0]-P[0], S[1]-P[1], S[2]-P[2]], L = Math.hypot(...d); return Math.asin((d[0]*P[0] + d[1]*P[1] + d[2]*P[2])/L)/RAD; },
  // angular radius (deg) of the ring of ground points at distance D (Earth radii) from a satellite at radius A
  ringDeg(D){ const A = this.A, c = (A*A + 1 - D*D)/(2*A); return Math.acos(Math.max(-1, Math.min(1, c)))/RAD; },
  // project an ECEF vector onto a Globe, compressing altitude by f (1 = true scale)
  screen(g, v, f){ const q = this.ll(v), rot = d3.geoRotation([-g.st.lon, -g.st.lat])([q[0], q[1]]), l = rot[0]*RAD, ph = rot[1]*RAD;
    const x = Math.cos(ph)*Math.sin(l), y = Math.sin(ph), z = Math.cos(ph)*Math.cos(l), rd = 1 + (q[2] - 1)*f;
    return { x:g.st.cx + g.st.r*rd*x, y:g.st.cy - g.st.r*rd*y, z, behind: z < 0 && rd*rd*(x*x + y*y) < 1 }; }
};
function satGlyph(parent, col){ const e = s('g', {}, parent), b = s('g', {}, e);
  s('line', { x1:-24, x2:24, y1:0, y2:0, stroke:'#8FA6BF', 'stroke-width':1.4 }, b);
  for (const sx of [-1, 1]){ s('rect', { x: sx < 0 ? -40 : 12, y:-6, width:28, height:12, rx:1.5, fill:'#2C5C8F', stroke:'#7FA7D3', 'stroke-width':1 }, b);
    for (let k = 1; k < 4; k++) s('line', { x1:(sx < 0 ? -40 : 12) + k*7, x2:(sx < 0 ? -40 : 12) + k*7, y1:-6, y2:6, stroke:'rgba(160,195,235,.55)', 'stroke-width':.8 }, b); }
  s('rect', { x:-8, y:-9, width:16, height:18, rx:2.5, fill:'#D9B25C', stroke:'#FFE3A3', 'stroke-width':1 }, b);
  e._core = s('circle', { r:3, fill: col || '#FFF6D8' }, b); e._b = b; return e; }

/* 16. A sky full of clocks — the constellation, to scale */
Deck.add({ id:'gps', actName:ACT6, title:'A sky full of clocks', min:1.25, steps:3,
  notes:{ script:`So how does your phone know where it is? In February 1978 the first GPS test satellite went up — Navstar 1. Look at how high it is: this is drawn to scale. Earth, and an orbit 20,200 kilometres up. [click] By 1995 GPS was declared fully operational. Today there are 32 active satellites in six orbital planes, each one circling the Earth twice a day. [click] And here is the beautiful part. Each satellite carries atomic clocks, and all it does is broadcast, nonstop: who it is, where it is, and exactly what time it is. A sky full of Harrison's clocks.`,
    cues:['1978: Navstar 1, one orbit, drawn to scale.','1995 → today: 32 satellites, six planes, twice a day around Earth.','Every satellite broadcasts its time: pulses ripple out.'] },
  build(root){
    const svg = fullSvg(root); this.svg = svg;
    const rnd = d3.randomLcg(21); for (let k = 0; k < 220; k++) s('circle', { cx:rnd()*1920, cy:rnd()*1080, r:rnd()*1.2 + .3, fill:'#C9D6EA', opacity:rnd()*.45 + .1 }, svg);
    this.back = s('g', {}, svg);
    const g = this.g = new Globe(svg, { cx:700, cy:540, r:112, lon:-80, lat:22, grat:30 });
    this.front = s('g', {}, svg); this.pulseG = s('g', {}, svg); this.satG = s('g', {}, svg);
    this.orbB = d3.range(6).map(() => s('path', { fill:'none', stroke:'rgba(127,167,201,.20)', 'stroke-width':1.3 }, this.back));
    this.orbF = d3.range(6).map(() => s('path', { fill:'none', stroke:'rgba(160,195,235,.55)', 'stroke-width':1.6 }, this.front));
    this.satEls = GPS.sats.map((st, k) => { const e = satGlyph(this.satG); e.style.opacity = 0; return e; });
    this.navLab = s('text', { class:'label', fill:C.gold2, style:'font-weight:600', opacity:0 }, svg, 'Navstar 1 · 1978');
    // to-scale bracket: Earth's surface to orbit height
    const A = GPS.A, r = 112, y = 540 + 150;
    this.scaleG = s('g', { opacity:0 }, svg);
    s('path', { d:`M${700 - r*A},${y - 8}V${y}H${700 - r}V${y - 8}`, fill:'none', stroke:C.gold, 'stroke-width':2 }, this.scaleG);
    s('text', { x:700 - (r*A + r)/2, y:y + 36, 'text-anchor':'middle', class:'label', fill:C.gold2, style:'font-weight:600;paint-order:stroke;stroke:#081222;stroke-width:8px' }, this.scaleG, '20,200 km up');
    s('text', { x:700 - (r*A + r)/2, y:y + 66, 'text-anchor':'middle', class:'label-dim', style:'paint-order:stroke;stroke:#081222;stroke-width:8px' }, this.scaleG, 'Earth and orbits to scale');
    txt(root, 1240, 120, 620, 'kicker', ACT6);
    txt(root, 1236, 165, 640, 'h2', 'A sky full of clocks');
    const cap = (k, html, out) => txt(root, 1240, 330, 600, 'lede', html, k, { out });
    cap(0, '<span class="label-dim" style="font-size:26px">February 1978</span><br>Navstar 1, the first GPS test satellite, goes up — <em>20,200 km</em> above the ground.', 1);
    cap(1, '<span class="label-dim" style="font-size:26px">1995 → today</span><br>Fully operational in 1995. Today, <em>32 active satellites</em> in six orbital planes, each circling Earth <em>twice a day</em>.', 2);
    cap(2, 'Each satellite carries <em>atomic clocks</em> and broadcasts nonstop: who it is, where it is, and <em>exactly what time it is</em>.<br><br><span style="color:var(--gold-2)">A sky full of Harrison’s clocks.</span>', 3);
    txt(root, 1240, 1000, 640, 'credit', 'Orbits computed: circular, 26,560 km radius, 55° inclination, six planes 60° apart, 11 h 58 min period, Earth rotating beneath. Satellite slots illustrative. Sources: GPS.gov (space segment; final GPS III launch, April 2026).');
    this.T = 0; this.speed = .35;
  },
  draw(){
    const g = this.g, T = this.T, all = this.step >= 1;
    for (let p = 0; p < 6; p++){
      let fb = '', ff = '', pf = null;
      if (all || p === 0) for (let k = 0; k <= 96; k++){ const q = GPS.screen(g, GPS.ecef(p, k/96*2*Math.PI, T), 1), front = !q.behind && q.z >= 0, cmd = (pf === front ? 'L' : 'M') + q.x.toFixed(1) + ',' + q.y.toFixed(1);
        if (front){ ff += cmd; if (pf === false) fb += 'L' + q.x.toFixed(1) + ',' + q.y.toFixed(1); } else { fb += cmd; if (pf === true) ff += 'L' + q.x.toFixed(1) + ',' + q.y.toFixed(1); } pf = front; }
      this.orbB[p].setAttribute('d', fb); this.orbF[p].setAttribute('d', ff);
    }
    GPS.sats.forEach((st, k) => { const q = GPS.screen(g, GPS.pos(st, T), 1), e = this.satEls[k]; st.q = q;
      const sc = .62 + .16*q.z; e.setAttribute('transform', `translate(${q.x.toFixed(1)},${q.y.toFixed(1)})`); e._b.setAttribute('transform', `scale(${sc.toFixed(3)})`);
      e.style.visibility = q.behind ? 'hidden' : 'visible'; (q.z < 0 ? this.back : this.satG).appendChild(e); });
    const q0 = GPS.sats[0].q; const lft = q0.x > 760; this.navLab.setAttribute('x', q0.x + (lft ? -34 : 34)); this.navLab.setAttribute('text-anchor', lft ? 'end' : 'start'); this.navLab.setAttribute('y', q0.y - 18);
  },
  go(step, { instant }){
    const D = instant ? 0 : 1; this.step = step;
    this.satEls.forEach((e, k) => gsap.to(e, { opacity: (k === 0 || step >= 1) ? 1 : 0, duration:.5*D, delay:(step === 1 && k ? (k % 6)*.12 + Math.floor(k/6)*.05 : 0)*D }));
    gsap.to(this.navLab, { opacity: step === 0 ? 1 : 0, duration:.5*D });
    gsap.to(this.scaleG, { opacity: step <= 1 ? 1 : 0, duration:.6*D });
    [...this.orbB, ...this.orbF].forEach(o => { o.style.opacity = 0; gsap.to(o, { opacity:1, duration:.9*D }); });
    this.pulse = step === 2; if (!this.pulse) this.pulseG.innerHTML = '';
    this.draw();
  },
  loop(t, dt){ this.T += dt*this.speed; this.draw();
    if (this.pulse && Math.random() < dt*14){ const vis = GPS.sats.filter(s0 => s0.q && !s0.q.behind && s0.q.z > -0.2); const st = vis[Math.floor(Math.random()*vis.length)];
      if (st){ const c = s('circle', { cx:st.q.x, cy:st.q.y, r:6, fill:'none', stroke:C.gold2, 'stroke-width':1.6 }, this.pulseG); gsap.to(c, { attr:{ r:115 }, opacity:0, duration:2.4, ease:'power1.out', onComplete:() => c.remove() }); } } }
});

/* 17. Four satellites, one spot — true trilateration geometry over the United States */
Deck.add({ id:'fix', actName:ACT6, title:'Four satellites, one spot', min:2, steps:6,
  notes:{ script:`How does a phone turn those time signals into a place? Take one satellite. Its signal arrives a tiny fraction of a second after it was sent — about seven hundredths of a second. Multiply by the speed of light and you have a distance: about 21,000 kilometres. Every point on Earth at that distance from the satellite makes a ring. You are somewhere on this ring. [click] A second satellite gives a second ring. Two rings cross in two places. [click] A third ring picks one of them. That's your spot. [click] But there's a catch. Your phone's clock is cheap. If it's off by just one thousandth of a second, every distance is off by 300 kilometres — and the rings no longer meet. [click] So the receiver listens to a fourth satellite. With four, it can solve for the place and its own clock error at the same time. The rings snap together. Four satellites: one spot, and the exact time. [click] And it works anywhere: Seattle, Denver, Chicago, Houston, New York — different satellites overhead every time, the same answer in under a second.`,
    cues:['One satellite: delay → distance → a ring on the ground.','Two rings cross at two points.','Three rings: one spot.','The catch: a phone clock 1/1000 s off → rings miss by 300 km.','Fourth satellite: solves the clock — rings snap to one spot.','Anywhere: Seattle, Denver, Chicago, Houston, New York…'] },
  build(root){
    const svg = fullSvg(root); this.svg = svg;
    const rnd = d3.randomLcg(31); for (let k = 0; k < 200; k++) s('circle', { cx:rnd()*1920, cy:rnd()*1080, r:rnd()*1.2 + .3, fill:'#C9D6EA', opacity:rnd()*.4 + .1 }, svg);
    const g = this.g = new Globe(svg, { cx:700, cy:650, r:440, lon:-92, lat:35, grat:10, land:land50() });
    g.geo(window.USSTATES, { stroke:'rgba(160,190,225,.28)', 'stroke-width':.8 }, 'under');
    this.f = .17; this.T0 = 2.1; this.T = this.T0;
    this.cols = [C.gold2, '#7FC8F8', '#F28B7B', '#8EE3B5'];
    this.home = [-81.8723, 26.6406]; this.rx = { ll:this.home.slice() };
    this.bias = { km:0 };
    this.ringEls = this.cols.map(c => g.geo(() => ({ type:'LineString', coordinates:[] }), { stroke:c, 'stroke-width':3, opacity:0, 'stroke-linecap':'round' }, 'over'));
    const gf = glowFilter(svg, 'fixglow', 3, C.gold); this.ringEls.forEach(e => e.setAttribute('filter', gf));
    this.lineG = s('g', {}, svg); this.satG = s('g', {}, svg);
    this.others = GPS.sats.map(() => { const e = satGlyph(this.satG); e.style.opacity = .3; return e; });
    this.lines = this.cols.map(c => s('line', { stroke:c, 'stroke-width':2, 'stroke-dasharray':'2 10', 'stroke-linecap':'round', opacity:0 }, this.lineG));
    this.rangeLab = this.cols.map(c => s('text', { class:'label num', fill:c, style:'font-size:24px;font-weight:600;paint-order:stroke;stroke:#081222;stroke-width:7px', opacity:0 }, svg, ''));
    this.cross = s('g', { opacity:0 }, svg); this.crossA = s('circle', { r:13, fill:'none', stroke:'#fff', 'stroke-width':2.5 }, this.cross); this.crossB = s('circle', { r:13, fill:'none', stroke:'#fff', 'stroke-width':2.5 }, this.cross);
    this.crossLab = s('text', { class:'label', fill:'#fff', style:'font-weight:600' }, this.cross, '?');
    this.rxEl = g.point(() => this.rx.ll, e => { s('circle', { r:22, fill:'rgba(237,27,46,.18)' }, e); s('circle', { r:8, fill:'#ED1B2E', stroke:'#fff', 'stroke-width':2.5 }, e); });
    this.rxEl.style.opacity = 0;
    this.cityLab = s('text', { class:'label', style:'font-size:30px;font-weight:600;paint-order:stroke;stroke:#081222;stroke-width:8px', fill:'#fff', opacity:0 }, svg, '');
    this.cityLL = s('text', { class:'label-dim num', style:'font-size:24px;paint-order:stroke;stroke:#081222;stroke-width:7px', opacity:0 }, svg, '');
    txt(root, 1330, 120, 540, 'kicker', ACT6 + ' · how GPS finds you');
    txt(root, 1326, 165, 560, 'h2', 'Four satellites,<br>one spot');
    const cap = (k, html, out) => txt(root, 1330, 360, 530, 'lede', html, k, { out });
    cap(0, 'One satellite. Its signal arrives about <em>0.07 s</em> after it was sent. Delay × speed of light = <em>distance</em>.<br><br>Every place at that distance makes a ring. <em>You are somewhere on it.</em>', 1);
    cap(1, 'A second satellite, a second ring. <em>Two rings cross in two places.</em>', 2);
    cap(2, 'A third ring picks one. <em>That’s your spot.</em>', 3);
    cap(3, 'The catch: your phone’s clock is cheap. Off by just <em>1/1,000 s</em>, every distance is <span class="coral">300 km</span> too long — <span class="coral">the rings miss</span>.', 4);
    cap(4, 'A <em>fourth satellite</em> lets the receiver solve for its own clock error.<br><br>The rings snap together: <em>one spot, and the exact time.</em>', 5);
    cap(5, 'Anywhere, anytime: different satellites overhead, the same trick — <em>in under a second</em>.', 6);
    this.readout = txt(root, 1330, 820, 540, '', '<div class="label-dim" style="font-size:24px">Fix</div><div class="num" id="fxr" style="font:600 46px/1.25 var(--serif);color:var(--gold-2)"></div>', 4);
    txt(root, 1330, 980, 540, 'credit', 'Ring sizes computed from true orbit geometry (spherical Earth, satellites 20,200 km up); satellites drawn closer to Earth than real so they fit on screen. Positions illustrative. 1 ms × speed of light ≈ 300 km.');
    this.cities = [['Seattle', [-122.33, 47.61]], ['Denver', [-104.99, 39.74]], ['Chicago', [-87.63, 41.88]], ['Houston', [-95.37, 29.76]], ['New York', [-74.01, 40.71]], ['Fort Myers', [-81.87, 26.64]]];
    this.city = 'Fort Myers';
  },
  pickFour(ll){ const P = GPS.unit(ll), T = this.T, g = this.g;
    const c = GPS.sats.map((st, k) => { const S = GPS.pos(st, T), q = GPS.screen(g, S, this.f), e = GPS.elev(S, P), d = [S[0]-P[0], S[1]-P[1], S[2]-P[2]];
      const east = [-Math.sin(ll[0]*RAD), Math.cos(ll[0]*RAD), 0], north = [-Math.sin(ll[1]*RAD)*Math.cos(ll[0]*RAD), -Math.sin(ll[1]*RAD)*Math.sin(ll[0]*RAD), Math.cos(ll[1]*RAD)];
      const az = Math.atan2(d[0]*east[0] + d[1]*east[1], d[0]*north[0] + d[1]*north[1] + d[2]*north[2]);
      return { k, e, az, ok: e > 18 && !q.behind && q.z > 0.05 && q.x < 1260 && q.y > 30 && q.x > 40 }; }).filter(o => o.ok);
    c.sort((a, b) => b.e - a.e); const pick = c.length ? [c[0]] : [];
    while (pick.length < 4 && pick.length < c.length){ let best = null, bs = -1; for (const o of c){ if (pick.includes(o)) continue; const sep = Math.min(...pick.map(p => { const d = Math.abs(o.az - p.az) % (2*Math.PI); return Math.min(d, 2*Math.PI - d); })) + o.e*RAD*.3; if (sep > bs){ bs = sep; best = o; } } pick.push(best); }
    return pick.map(o => o.k); },
  update(){
    const g = this.g, T = this.T, P = GPS.unit(this.rx.ll), b = this.bias.km/GPS.RE;
    this.ring = [];
    GPS.sats.forEach((st, k) => { const S = GPS.pos(st, T), q = GPS.screen(g, S, this.f), e = this.others[k];
      st.S = S; st.q = q; e.setAttribute('transform', `translate(${q.x.toFixed(1)},${q.y.toFixed(1)})`); e._b.setAttribute('transform', `scale(${(.7 + .2*q.z).toFixed(3)})`); e.style.visibility = q.behind ? 'hidden' : 'visible'; });
    const rp = g.proj(this.rx.ll);
    (this.pick || []).forEach((k, j) => { const st = GPS.sats[k], D = GPS.dist(st.S, P), sub = GPS.ll(st.S), deg = GPS.ringDeg(D + b);
      this.ring[j] = { sub, deg, D };
      this.lines[j].setAttribute('x1', st.q.x); this.lines[j].setAttribute('y1', st.q.y); this.lines[j].setAttribute('x2', rp[0]); this.lines[j].setAttribute('y2', rp[1]);
      const km = Math.round((D*GPS.RE + this.bias.km)/10)*10, sec = (D*GPS.RE + this.bias.km)/GPS.C;
      const L = this.rangeLab[j]; L.textContent = (j === 0 && this.step === 0 ? sec.toFixed(3) + ' s  →  ' : '') + km.toLocaleString('en-US') + ' km';
      const right = st.q.x < rp[0]; L.setAttribute('x', st.q.x + (right ? -30 : 30)); L.setAttribute('y', st.q.y - 22); L.setAttribute('text-anchor', right ? 'end' : 'start');
      if (st.q.x - 30 < 400 && right){ L.setAttribute('text-anchor', 'start'); L.setAttribute('x', st.q.x + 30); } });
    this.ringEls.forEach((el, j) => { const r = this.ring[j]; el._datum = r ? d3.geoCircle().center([r.sub[0], r.sub[1]]).radius(r.deg).precision(1)() : null; });
    // the second crossing of rings A and B: mirror of the receiver through the plane of the two ring centres
    if (this.ring[1]){ const a = GPS.unit(this.ring[0].sub), c2 = GPS.unit(this.ring[1].sub), n = [a[1]*c2[2] - a[2]*c2[1], a[2]*c2[0] - a[0]*c2[2], a[0]*c2[1] - a[1]*c2[0]], nl = Math.hypot(...n), u = n.map(v => v/nl), dp = P[0]*u[0] + P[1]*u[1] + P[2]*u[2];
      const M = [P[0] - 2*dp*u[0], P[1] - 2*dp*u[1], P[2] - 2*dp*u[2]], ml = GPS.ll(M), mp = g.proj([ml[0], ml[1]]), vis = d3.geoDistance([ml[0], ml[1]], [g.st.lon, g.st.lat]) < Math.PI/2;
      this.crossA.setAttribute('cx', rp[0]); this.crossA.setAttribute('cy', rp[1]); this.crossB.setAttribute('cx', mp[0]); this.crossB.setAttribute('cy', mp[1]); this.crossB.style.visibility = vis ? 'visible' : 'hidden';
      this.crossLab.setAttribute('x', mp[0] + 20); this.crossLab.setAttribute('y', mp[1] - 14); this.crossLab.style.visibility = vis ? 'visible' : 'hidden'; }
    g.render();
    this.cityLab.setAttribute('x', rp[0] + 28); this.cityLab.setAttribute('y', rp[1] + 44); this.cityLL.setAttribute('x', rp[0] + 28); this.cityLL.setAttribute('y', rp[1] + 74);
  },
  showRings(n, D){ this.ringEls.forEach((e, j) => gsap.to(e, { opacity: j < n ? .95 : 0, duration:.6*D, delay:(j === n - 1 ? .5 : 0)*D }));
    this.lines.forEach((e, j) => gsap.to(e, { opacity: j < n ? .9 : 0, duration:.5*D }));
    this.rangeLab.forEach((e, j) => gsap.to(e, { opacity: j < n ? 1 : 0, duration:.5*D }));
    (this.pick || []).forEach((k, j) => { const e = this.others[k]; gsap.to(e, { opacity: j < n ? 1 : .3, duration:.5*D }); e._core.setAttribute('fill', j < n ? this.cols[j] : '#FFF6D8'); }); },
  setFix(ll, name){ this.cityLab.textContent = name; this.cityLL.textContent = fmtLat(ll[1], 2) + ', ' + fmtLon(ll[0], 2); const r = this.readout.querySelector('#fxr'); if (r) r.innerHTML = fmtLat(ll[1], 4) + '<br>' + fmtLon(ll[0], 4); },
  go(step, { instant }){
    const D = instant ? 0 : 1; this.step = step; this.cycle = false; gsap.killTweensOf([this.bias, this.rx.ll]);
    this.ringEls.forEach(e => e._datum = null);
    // wire geo items to live datums
    this.ringEls.forEach(e => { const it = this.g.items.find(i => i.el === e); if (it) it.datum = () => e._datum || { type:'LineString', coordinates:[] }; });
    if (step < 5){ this.rx.ll = this.home.slice(); this.T = this.T0; this.pick = this.pickFour(this.home); this.setFix(this.home, 'Fort Myers'); }
    this.update();
    this.others.forEach((e, k) => { if (!(this.pick || []).includes(k)) gsap.to(e, { opacity:.28, duration:.4*D }); });
    gsap.to(this.rxEl, { opacity:1, duration:.5*D });
    const n = step === 0 ? 1 : step === 1 ? 2 : step <= 2 ? 3 : step === 3 ? 3 : 4;
    this.showRings(n, D);
    gsap.to(this.cross, { opacity: step === 1 ? 1 : 0, duration:.5*D, delay:(step === 1 ? .9 : 0)*D });
    gsap.to([this.cityLab, this.cityLL], { opacity: step >= 4 ? 1 : 0, duration:.5*D, delay:(step === 4 ? 2.6 : 0)*D });
    if (step === 3){ if (instant) this.bias.km = 300; else { this.bias.km = 0; gsap.to(this.bias, { km:300, duration:2.2, delay:.4, ease:'power2.inOut' }); } }
    else if (step === 4){ if (instant) this.bias.km = 0; else { this.bias.km = 300; gsap.to(this.bias, { km:0, duration:2.2, delay:1.2, ease:'power3.inOut' }); } }
    else this.bias.km = 0;
    if (step === 5){ this.cycle = true; this.ci = -1; this.ct = instant ? 3.5 : 0; this.nextCity(true); }
  },
  nextCity(first){
    this.ci = (this.ci + 1) % this.cities.length; const [name, ll] = this.cities[this.ci], from = this.rx.ll.slice(), ip = d3.geoInterpolate(from, ll);
    this.ringEls.forEach(e => gsap.to(e, { opacity:0, duration:.3 })); this.lines.forEach(e => gsap.to(e, { opacity:0, duration:.3 })); this.rangeLab.forEach(e => gsap.to(e, { opacity:0, duration:.3 }));
    gsap.to([this.cityLab, this.cityLL], { opacity:0, duration:.25 });
    const o = { u:0 }; gsap.to(o, { u:1, duration: first ? .01 : 1.1, delay:.3, ease:'power2.inOut', onUpdate:() => { this.rx.ll = ip(o.u); }, onComplete:() => {
      this.rx.ll = ll.slice(); this.pick = this.pickFour(ll); this.setFix(ll, name); this.bias.km = 260;
      gsap.to(this.bias, { km:0, duration:1.1, ease:'power3.out' }); this.showRings(4, 1); gsap.to([this.cityLab, this.cityLL], { opacity:1, duration:.4, delay:.6 }); } });
  },
  loop(t, dt){ this.T += dt*.004; if (this.cycle){ this.ct += dt; if (this.ct > 3.6){ this.ct = 0; this.nextCity(); } }
    if (this.pick){ for (let j = 0; j < 4; j++){ const L = this.lines[j]; L.setAttribute('stroke-dashoffset', (-t*40).toFixed(1)); } }
    this.update(); }
});

Deck.add({ id:'pin', actName:ACT6, title:'Two numbers, tonight', min:1.25, steps:5,
  notes:{ script:`Now bring it home. Here's a pin in Field Maps: [click] a family in Fort Myers whose house took water tonight. They need cots. That pin — the thing that sends a volunteer, a truck, a shelter bed — is just two numbers. [click] Latitude and longitude. [click] The stars gave us latitude. Harrison's clock gave us longitude. And a sky full of clocks answers Shovell's question — where am I? — in under a second. [click] Thank you. I'd love to take your questions.`,
    cues:['Camera dives from the whole Earth to SW Florida.','Field Maps-style pin and request card.','Just two numbers.','The callback: stars, clock, a sky full of clocks.','Thank you — questions.'] },
  build(root){
    const svg = fullSvg(root); this.svg = svg;
    const g = this.g = new Globe(svg, { cx:760, cy:560, r:380, lon:-60, lat:20, grat:15, land:land50() });
    this.ll = [-81.8723, 26.6406];
    this.pin = g.point(this.ll, e => { const p = s('g', { transform:'translate(0,0)' }, e);
      s('path', { d:'M0,0 C-6,-14 -20,-22 -20,-38 A20,20 0 1 1 20,-38 C20,-22 6,-14 0,0 Z', fill:'#ED1B2E', stroke:'#fff', 'stroke-width':2.5 }, p);
      s('path', { d:'M-3,-46h6v6h6v6h-6v6h-6v-6h-6v-6h6z', fill:'#fff' }, p); });
    this.pin.style.opacity = 0;
    this.cities = [[[-82.46,27.95],'Tampa'],[[-81.38,28.54],'Orlando'],[[-80.19,25.76],'Miami'],[[-84.6,26.2],'Gulf of Mexico'],[[-79.4,27.4],'Atlantic Ocean']].map(([ll,n],k)=>{ const e = g.point(ll, el => { if (k < 3) s('circle', { r:4, fill:C.dim }, el); s('text', { x: k < 3 ? 10 : 0, y:7, 'text-anchor': k < 3 ? 'start' : 'middle', class:'label-dim', style: k < 3 ? '' : 'font-style:italic;letter-spacing:.06em' }, el, n); }); e.style.opacity = 0; return e; });
    this.card = h('div', { class:'b', 'data-in':1, 'data-out':2, style:{ position:'absolute', left:'1080px', top:'250px', width:'640px', background:'#F7F8FA', color:'#1B2430', borderRadius:'10px', boxShadow:'0 30px 80px rgba(0,0,0,.5)', overflow:'hidden', fontFamily:'var(--sans)' } }, root,
      `<div style="background:#ED1B2E;color:#fff;padding:16px 24px;font:600 26px var(--sans);display:flex;justify-content:space-between"><span>Shelter request</span><span style="font-weight:500;opacity:.85">tonight</span></div>
       <div style="padding:22px 24px 26px">
         <div style="font:600 34px var(--serif);margin-bottom:10px">Family of four · Fort Myers, FL</div>
         <div style="font:400 26px/1.45 var(--sans);color:#3A4656">Home flooded. Needs: <b>4 cots</b>, blankets.<br>Point collected in Field Maps.</div>
         <div class="num" style="margin-top:16px;font:600 28px var(--sans);color:#0B5CAD">26.6406° N, 81.8723° W</div>
         <div style="margin-top:12px;font:400 20px var(--sans);color:#6A7584">Illustrative example — not a real request.</div>
       </div>`);
    txt(root, 1080, 120, 700, 'kicker', ACT6, 0, { out:3 });
    txt(root, 1080, 165, 760, 'h2', 'Tonight, somewhere', 0, { out:3 });
    txt(root, 1080, 300, 780, 'statement', 'Just two numbers.', 2, { out:3 });
    txt(root, 1080, 430, 780, '', '<div class="num" style="font:600 76px/1.25 var(--serif);color:var(--gold-2)">26.6406° N<br>81.8723° W</div>', 2, { out:3 });
    const close = h('div', { class:'b', 'data-in':3, 'data-out':4, style:{ position:'absolute', left:'1000px', top:'250px', width:'860px' } }, root,
      `<p class="lede" style="font-size:46px;margin:0 0 34px">The <em>stars</em> gave us latitude.</p>
       <p class="lede" style="font-size:46px;margin:0 0 34px">Harrison’s <em>clock</em> gave us longitude.</p>
       <p class="lede" style="font-size:46px;margin:0">A <em>sky full of clocks</em> answers Shovell’s question in under a second.</p>`);
    txt(root, 1000, 340, 860, 'h1', 'Thank you.', 4, { style:{ fontSize:'110px' } });
    txt(root, 1004, 490, 860, 'lede', 'Questions?', 4, { style:{ fontSize:'54px' } });
    txt(root, 1004, 640, 860, 'label-dim', 'Where Am I? · Jeff Franzen · American Red Cross', 4);
  },
  go(step, { instant }){
    const D = instant ? 0 : 1, g = this.g;
    if (step === 0){ g.st.r = 380; g.st.lon = -60; g.st.lat = 20; g.render(); g.to({ lon:-81.87, lat:26.64, r:9000, cx:620, cy:560 }, 4.2, 'power3.inOut', instant); }
    else if (step <= 2) g.to({ lon:-81.87, lat:26.64, r:9000, cx:620, cy:560 }, 1, 'power2.inOut', instant);
    else g.to({ lon:-81.87 + 30, lat:20, r:420, cx:500, cy:560 }, 3, 'power2.inOut', instant);
    gsap.to(this.pin, { opacity: step >= 1 ? 1 : 0, duration:.4*D });
    this.cities.forEach(c => gsap.to(c, { opacity: step <= 2 ? 1 : 0, duration:.6*D, delay: step === 0 ? 3.4*D : 0 }));
    if (step === 1 && !instant) gsap.fromTo(this.pin.firstChild, { attr:{ transform:'translate(0,-160)' } }, { attr:{ transform:'translate(0,0)' }, duration:.9, ease:'bounce.out' });
  },
  loop(t, dt){ if (Deck.s >= 3 && !gsap.isTweening(this.g.st)){ this.g.st.lon -= dt*4; this.g.render(); } }
});
