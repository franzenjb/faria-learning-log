/* ACT 2 — LATITUDE IS EASY */
const ACT2 = 'Latitude is easy';

/* 4. Nature's zero + Polaris, drawn on a globe */
Deck.add({ id:'polaris', actName:ACT2, title:'Nature’s zero and the North Star', min:2.75, steps:9,
  notes:{ script:`Latitude first, because nature hands it to us. The Earth spins on an axis; the two ends are the poles. [click] Exactly halfway between them is the equator. Nobody had to vote on that — it is nature's zero. [click] Now put a person on the globe. Their horizon is flat; it just touches the Earth where they stand. [click] Polaris, the North Star, sits almost exactly above the North Pole, so far away that its light arrives in parallel lines. [click] Measure how high Polaris is above your horizon… [click] …and you have measured your latitude. Those two gold angles are always equal. [click] At the equator, Polaris sits right on the horizon. [click] At the North Pole, it is straight overhead. [click] And in London, it is 51 and a half degrees up. That's latitude: look up, measure one angle. (Optional: drag the person or the tiny slider to show any latitude.)`,
    cues:['Globe spins on its axis; the poles.','Equator: halfway between the poles — latitude 0°.','A person at 39° N; their flat horizon.','Polaris above the pole; its light arrives in parallel lines.','The angle of Polaris above the horizon.','The same angle at Earth’s centre: latitude. Equal.','Walk to the equator: Polaris on the horizon.','Walk to the North Pole: Polaris overhead.','Back to London, 51.5° — slider live.'] },
  build(root){
    const svg = fullSvg(root); this.svg = svg; const cx = this.cx = 690, cy = this.cy = 610, r = this.r = 330;
    this.g = new Globe(svg, { cx, cy, r, lon:-120, lat:0, grat:30 });
    this.eq = this.g.geo(parallel(0), { stroke:C.gold, 'stroke-width':2.5, opacity:0 }, 'over');
    const L = s('g', {}, svg); this.L = L;
    // axis
    this.axis = s('line', { x1:cx, y1:cy + r + 70, x2:cx, y2:120, stroke:C.steel, 'stroke-width':2, 'stroke-dasharray':'8 8', opacity:0 }, L);
    this.np = s('text', { x:cx - 18, y:cy - r - 18, 'text-anchor':'end', class:'label', opacity:0 }, L, 'North Pole');
    this.sp = s('text', { x:cx - 18, y:cy + r + 40, 'text-anchor':'end', class:'label-dim', opacity:0 }, L, 'South Pole');
    this.eqLab = s('text', { x:cx - r - 20, y:cy + 9, 'text-anchor':'end', class:'label', fill:C.gold2, opacity:0 }, L, 'Equator  0°');
    // Polaris
    this.star = s('g', { transform:`translate(${cx},88)`, opacity:0 }, L);
    s('circle', { r:26, fill:'rgba(244,205,126,.12)' }, this.star); s('path', { d:starPath(15, 6), fill:C.gold2 }, this.star);
    s('text', { x:30, y:10, class:'label', fill:C.gold2, style:'font-weight:600' }, this.star, 'Polaris');
    // equal-angle construction
    this.eqRay = s('line', { stroke:C.gold, 'stroke-width':2, opacity:0 }, L);
    this.radRay = s('line', { stroke:C.gold, 'stroke-width':2, 'stroke-dasharray':'5 6', opacity:0 }, L);
    this.cArc = s('path', { fill:'rgba(232,176,75,.16)', stroke:C.gold, 'stroke-width':2.5, opacity:0 }, L);
    this.cLab = s('text', { class:'label num', fill:C.gold2, style:'font-weight:700;font-size:30px', 'text-anchor':'middle', opacity:0 }, L);
    this.horizon = s('line', { stroke:C.text, 'stroke-width':2.5, opacity:0 }, L);
    this.horLab = s('text', { class:'label-dim', opacity:0 }, L, 'your horizon');
    this.ray = s('line', { stroke:C.gold2, 'stroke-width':2.5, opacity:0 }, L);
    this.ray2 = s('line', { stroke:C.gold2, 'stroke-width':1.2, opacity:0, 'stroke-dasharray':'3 7' }, L);
    this.pArc = s('path', { fill:'rgba(232,176,75,.16)', stroke:C.gold, 'stroke-width':2.5, opacity:0 }, L);
    this.pLab = s('text', { class:'label num', fill:C.gold2, style:'font-weight:700;font-size:30px', 'text-anchor':'middle', opacity:0 }, L);
    this.person = s('g', { opacity:0, style:'cursor:grab' }, L); this.person.classList.add('ctl'); this.person.style.opacity = 0;
    const pf = s('g', {}, this.person);
    s('circle', { r:34, fill:'transparent' }, pf);
    s('line', { x1:0, y1:0, x2:0, y2:-40, stroke:C.text, 'stroke-width':4, 'stroke-linecap':'round' }, pf);
    s('circle', { cx:0, cy:-52, r:9, fill:C.text }, pf);
    s('line', { x1:-12, y1:-28, x2:12, y2:-28, stroke:C.text, 'stroke-width':4, 'stroke-linecap':'round' }, pf);
    this.pf = pf;
    this.phi = 39; this.vis = { per:0 };
    // drag the person
    const drag = (ev) => { const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY; const q = pt.matrixTransform(svg.getScreenCTM().inverse());
      const a = Math.atan2(this.cy - q.y, q.x - this.cx) / RAD; this.setPhi(Math.max(0, Math.min(90, a))); };
    this.person.addEventListener('pointerdown', ev => { ev.stopPropagation(); this.person.setPointerCapture(ev.pointerId); this.dragging = true; });
    this.person.addEventListener('pointermove', ev => { if (this.dragging) drag(ev); });
    this.person.addEventListener('pointerup', ev => { this.dragging = false; });
    this.person.addEventListener('click', ev => ev.stopPropagation());
    // text panel
    txt(root, 1220, 120, 640, 'kicker', 'Latitude is easy');
    txt(root, 1216, 165, 660, 'h2', 'Nature’s zero', 0, { out:2 });
    txt(root, 1216, 165, 660, 'h2', 'The height of Polaris', 2);
    const cap = (k, html, out) => txt(root, 1220, 290, 620, 'lede', html, k, { out });
    cap(0, 'The Earth spins on an axis. Its two ends are the <em>poles</em>.', 1);
    cap(1, 'Exactly halfway between them runs the <em>equator</em>: latitude 0°. Nature chose this zero.', 2);
    cap(2, 'Now stand somewhere. Your horizon is flat — it just touches the Earth where you stand.', 3);
    cap(3, '<em>Polaris</em>, the North Star, sits almost exactly above the North Pole — so far away its light arrives in parallel lines.', 4);
    cap(4, 'How high is Polaris above your horizon?', 5);
    cap(5, 'Exactly your latitude. <em>The two angles are always equal.</em>', 6);
    cap(6, 'At the equator, Polaris sits on the horizon.', 7);
    cap(7, 'At the North Pole, it is straight overhead.', 8);
    cap(8, 'In London, Polaris stands 51.5° high. London is at 51.5° N.', 9);
    const ro = txt(root, 1220, 600, 640, '', `
      <div style="display:flex;gap:56px">
        <div><div class="label-dim" style="font-size:24px">Polaris above horizon</div><div class="num" id="ro-p" style="font:600 96px/1.1 var(--serif);color:var(--gold-2)">39°</div></div>
        <div><div class="label-dim" style="font-size:24px">Your latitude</div><div class="num" id="ro-l" style="font:600 96px/1.1 var(--serif);color:var(--gold-2)">39° N</div></div>
      </div>`, 5);
    this.roP = ro.querySelector('#ro-p'); this.roL = ro.querySelector('#ro-l');
    const c = h('div', { class:'ctl b', 'data-in':8, style:{ left:'1222px', top:'930px' } }, root);
    this.slider = h('input', { type:'range', min:0, max:90, step:.5, value:51.5, class:'mini' }, c);
    h('span', { class:'ctl-label' }, c, 'latitude');
    this.slider.addEventListener('input', () => this.setPhi(+this.slider.value));
    this.slider.addEventListener('change', () => this.slider.blur());
    this.slider.addEventListener('pointerup', () => this.slider.blur());
    this.draw();
  },
  setPhi(v){ gsap.killTweensOf(this); this.phi = v; if (this.slider) this.slider.value = v; this.draw(); },
  draw(){
    const { cx, cy, r } = this, f = this.phi * RAD;
    const px = cx + r*Math.cos(f), py = cy - r*Math.sin(f), ux = Math.cos(f), uy = -Math.sin(f), tx = -Math.sin(f), ty = -Math.cos(f);
    this.pf.setAttribute('transform', `translate(${px},${py}) rotate(${90 - this.phi})`);
    const HL = 250; this.horizon.setAttribute('x1', px - tx*HL); this.horizon.setAttribute('y1', py - ty*HL); this.horizon.setAttribute('x2', px + tx*HL); this.horizon.setAttribute('y2', py + ty*HL);
    this.horLab.setAttribute('x', px - tx*HL + 10); this.horLab.setAttribute('y', py - ty*HL + 30);
    this.ray.setAttribute('x1', px); this.ray.setAttribute('y1', py); this.ray.setAttribute('x2', px); this.ray.setAttribute('y2', 120);
    this.ray2.setAttribute('x1', px); this.ray2.setAttribute('y1', 120); this.ray2.setAttribute('x2', px); this.ray2.setAttribute('y2', 70);
    // angle at person between northward horizon (t) and up
    const aT = Math.atan2(ty, tx), aUp = -Math.PI/2, R1 = 96;
    this.pArc.setAttribute('d', this.phi > .3 ? `M${px},${py}L${px + R1*Math.cos(aT)},${py + R1*Math.sin(aT)}` + arcPath(px, py, R1, aT, aUp).replace('M', 'L') + 'Z' : '');
    const am = (aT + aUp)/2, lr = R1 + 34; this.pLab.setAttribute('x', px + lr*Math.cos(am) - (this.phi < 12 ? 30 : 0)); this.pLab.setAttribute('y', py + lr*Math.sin(am) + 10);
    this.pLab.textContent = Math.round(this.phi*10)/10 + '°';
    // angle at centre between equator and radius
    const R2 = 110; this.eqRay.setAttribute('x1', cx); this.eqRay.setAttribute('y1', cy); this.eqRay.setAttribute('x2', cx + r); this.eqRay.setAttribute('y2', cy);
    this.radRay.setAttribute('x1', cx); this.radRay.setAttribute('y1', cy); this.radRay.setAttribute('x2', px); this.radRay.setAttribute('y2', py);
    this.cArc.setAttribute('d', this.phi > .3 ? `M${cx},${cy}L${cx + R2},${cy}` + arcPath(cx, cy, R2, 0, -f).replace('M', 'L') + 'Z' : '');
    const cm = -f/2, cr = R2 + 40; this.cLab.setAttribute('x', cx + cr*Math.cos(cm)); this.cLab.setAttribute('y', cy + cr*Math.sin(cm) + 10 + (this.phi < 12 ? 26 : 0));
    this.cLab.textContent = Math.round(this.phi*10)/10 + '°';
    if (this.roP){ const v = Math.round(this.phi*10)/10; this.roP.textContent = v + '°'; this.roL.textContent = v + (v > 0 ? '° N' : '°'); }
  },
  go(step, { instant }){
    const D = instant ? 0 : 1, show = (e, on, d = .8, delay = 0) => gsap.to(e, { opacity:on ? 1 : 0, duration:d*D, delay:delay*D });
    this.spin = step < 2;
    show(this.axis, true); show(this.np, step !== 7); show(this.sp, step >= 0);
    show(this.eq, step >= 1); show(this.eqLab, step >= 1);
    const P = step >= 2; show(this.person, P); show(this.horizon, P); show(this.horLab, P && step < 5);
    show(this.star, step >= 3); show(this.ray, step >= 3); show(this.ray2, step >= 3);
    show(this.pArc, step >= 4); show(this.pLab, step >= 4);
    show(this.cArc, step >= 5); show(this.cLab, step >= 5); show(this.eqRay, step >= 5); show(this.radRay, step >= 5);
    if (step >= 2) this.g.to({ lon:-167 }, instant ? 0 : 1.6, 'power2.inOut', instant);
    const target = step <= 5 ? 39 : step === 6 ? 0 : step === 7 ? 90 : 51.5;
    gsap.killTweensOf(this);
    if (instant){ this.phi = target; this.draw(); } else gsap.to(this, { phi:target, duration: step >= 6 ? 2.4 : .8, ease:'power2.inOut', onUpdate:() => this.draw() });
    if (this.slider) this.slider.value = target;
  },
  enter(){ this.spin = true; },
  loop(t, dt){ if (this.spin){ this.g.st.lon += dt*18; this.g.render(); } }
});

/* 5. The fist trick */
Deck.add({ id:'fist', actName:ACT2, title:'A fist is a ruler for the sky', min:1, steps:3,
  notes:{ script:`You can do this tonight in a parking lot. Hold your fist out at arm's length: it covers about ten degrees of sky. [click] Now stack fists from the horizon up to Polaris. [click] From Washington, it's about four fists — call it 39 degrees — and Washington is at 39 degrees north. Rough — but sailors did the same thing with proper instruments, measuring the angle far more precisely.`,
    cues:['One fist at arm’s length ≈ 10° of sky.','Stack fists from the horizon toward Polaris.','About four fists ≈ 39°: you are near 39° N.'] },
  build(root){
    const svg = fullSvg(root); this.svg = svg;
    const E = this.E = [300, 840], R = this.R = 860, hy = 905;
    // stars
    const rnd = d3.randomLcg(7); for (let k = 0; k < 170; k++){ const x = rnd()*1920, y = rnd()*880; s('circle', { cx:x, cy:y, r:rnd()*1.3 + .3, fill:'#C9D6EA', opacity:rnd()*.5 + .15 }, svg); }
    // ground
    s('path', { d:`M0,${hy} C300,${hy-8} 600,${hy+6} 960,${hy-4} S1600,${hy+8} 1920,${hy-2} L1920,1080 L0,1080 Z`, fill:'#04080F' }, svg);
    s('line', { x1:0, x2:1920, y1:hy, y2:hy, stroke:'rgba(154,171,194,.25)' }, svg);
    s('line', { x1:E[0] + 40, x2:E[0] + R + 40, y1:E[1], y2:E[1], stroke:'rgba(154,171,194,.45)', 'stroke-dasharray':'6 8' }, svg);
    s('text', { x:E[0] + R, y:E[1] + 38, class:'label-dim', 'text-anchor':'end' }, svg, 'horizon · 0°');
    // altitude scale (minimal)
    for (let a = 0; a <= 60; a += 10){ const q = [E[0] + (R+20)*Math.cos(a*RAD), E[1] - (R+20)*Math.sin(a*RAD)], q2 = [E[0] + (R+34)*Math.cos(a*RAD), E[1] - (R+34)*Math.sin(a*RAD)];
      s('line', { x1:q[0], y1:q[1], x2:q2[0], y2:q2[1], stroke:C.faint, 'stroke-width':2 }, svg);
      if (a) s('text', { x:E[0] + (R+68)*Math.cos(a*RAD), y:E[1] - (R+68)*Math.sin(a*RAD) + 8, class:'label-dim num', 'text-anchor':'middle', style:'font-size:22px' }, svg, a + '°'); }
    s('path', { d:arcPath(E[0], E[1], R + 20, 0, -60*RAD), fill:'none', stroke:C.faint, 'stroke-width':1.5 }, svg);
    // Polaris at 39°
    this.alt = 38.9; const pq = [E[0] + R*Math.cos(this.alt*RAD), E[1] - R*Math.sin(this.alt*RAD)];
    const st = s('g', { transform:`translate(${pq[0]},${pq[1]})` }, svg); s('circle', { r:24, fill:'rgba(244,205,126,.12)' }, st); s('path', { d:starPath(14, 6), fill:C.gold2 }, st);
    s('text', { x:-30, y:-26, class:'label', fill:C.gold2, 'text-anchor':'end', style:'font-weight:600' }, st, 'Polaris');
    // observer silhouette
    const ob = s('g', { transform:`translate(${E[0]},${E[1]})`, fill:'#0A1220', stroke:'#5E708A', 'stroke-width':2 }, svg);
    s('circle', { cx:-6, cy:-8, r:22 }, ob); s('path', { d:'M-30,20 Q-6,10 18,20 L22,66 L-34,66 Z' }, ob);
    this.arm = s('line', { x1:E[0] + 6, y1:E[1] + 30, stroke:'#5E708A', 'stroke-width':10, 'stroke-linecap':'round' }, svg);
    // wedges + fists
    this.wedges = s('g', {}, svg); this.fists = s('g', {}, svg);
    this.wedgeEls = []; this.fistEls = [];
    const FR = 500;
    for (let k = 0; k < 4; k++){
      const a0 = k*10, a1 = Math.min((k+1)*10, this.alt + (k === 3 ? 0 : 0));
      const w = s('path', { d:`M${E[0]},${E[1]}L${E[0] + R*Math.cos(a0*RAD)},${E[1] - R*Math.sin(a0*RAD)}` + arcPath(E[0], E[1], R, -a0*RAD, -a1*RAD).replace('M','L') + 'Z',
        fill: k % 2 ? 'rgba(232,176,75,.10)' : 'rgba(232,176,75,.17)', stroke:'rgba(232,176,75,.55)', 'stroke-width':1.2, opacity:0 }, this.wedges);
      this.wedgeEls.push(w);
      const am = (a0 + 5)*RAD, fx = E[0] + FR*Math.cos(am), fy = E[1] - FR*Math.sin(am), fh = 2*FR*Math.tan(5*RAD);
      const fg = s('g', { transform:`translate(${fx},${fy}) rotate(${-(a0+5)})`, opacity:0 }, this.fists);
      // stylised fist seen from the side: four finger bands, thumb across, wrist toward the observer
      const fw = 64, seg = (fh - 4)/4, gid = uid('skin');
      const lg = s('linearGradient', { id:gid, x1:0, y1:0, x2:1, y2:0 }, defs(svg)); s('stop', { offset:0, 'stop-color':'#B89270' }, lg); s('stop', { offset:1, 'stop-color':'#EED8BA' }, lg);
      s('path', { d:`M${-fw/2 - 30},${-fh*.17} L${-fw/2 + 4},${-fh*.27} L${-fw/2 + 4},${fh*.27} L${-fw/2 - 30},${fh*.17} Z`, fill:'#A98564', stroke:'#6E5238', 'stroke-width':1.4 }, fg);
      s('rect', { x:-fw/2, y:-fh/2 + 2, width:fw, height:fh - 4, rx:Math.min(22, seg*.9), fill:`url(#${gid})`, stroke:'#6E5238', 'stroke-width':1.6 }, fg);
      for (let j = 1; j < 4; j++) s('path', { d:`M${fw/2 - 30},${-fh/2 + 2 + j*seg} Q${fw/2 - 8},${-fh/2 + 2 + j*seg + 2} ${fw/2},${-fh/2 + 2 + j*seg - 2}`, fill:'none', stroke:'#7E6045', 'stroke-width':1.6, 'stroke-linecap':'round' }, fg);
      for (let j = 0; j < 4; j++) s('circle', { cx:fw/2 - 7, cy:-fh/2 + 2 + (j + .5)*seg, r:2.2, fill:'#9C7A5A' }, fg);
      s('path', { d:`M${-fw/2 + 6},${-fh/2 + 8} C${-fw/2 + 20},${-fh/2 + seg*.9} ${fw/2 - 26},${-fh/2 + seg*1.1} ${fw/2 - 20},${-fh/2 + seg*1.6}`, fill:'none', stroke:'#6E5238', 'stroke-width':11, 'stroke-linecap':'round' }, fg);
      s('path', { d:`M${-fw/2 + 6},${-fh/2 + 8} C${-fw/2 + 20},${-fh/2 + seg*.9} ${fw/2 - 26},${-fh/2 + seg*1.1} ${fw/2 - 20},${-fh/2 + seg*1.6}`, fill:'none', stroke:'#E2C7A3', 'stroke-width':8, 'stroke-linecap':'round' }, fg);
      this.fistEls.push(fg);
      const lq = [E[0] + (R - 60)*Math.cos(am), E[1] - (R - 60)*Math.sin(am)];
      this.wedgeEls.push(s('text', { x:lq[0], y:lq[1] + 9, 'text-anchor':'middle', class:'label num', fill:C.gold2, opacity:0, style:'font-weight:600' }, this.wedges, (k + 1) + ''));
    }
    txt(root, 1290, 120, 580, 'kicker', 'Latitude is easy');
    txt(root, 1286, 165, 600, 'h2', 'A fist is a ruler for the sky');
    txt(root, 1290, 370, 560, 'lede', 'Hold your fist out at arm’s length. It covers about <em>10°</em> of sky.', 0);
    txt(root, 1290, 540, 560, 'lede', 'Stack fists from the horizon up to Polaris.', 1);
    txt(root, 1290, 680, 560, 'lede', 'About <em>four fists</em> ≈ 39°. You are near latitude <em>39° N</em> — Washington, D.C.', 2);
  },
  go(step, { instant }){
    const D = instant ? 0 : 1; const E = this.E;
    const n = step === 0 ? 1 : 4;
    this.fistEls.forEach((f, k) => gsap.to(f, { opacity:k < n ? 1 : 0, duration:.5*D, delay:(step === 1 ? k*.55 : 0)*D }));
    this.wedgeEls.forEach((w, j) => { const k = Math.floor(j/2); gsap.to(w, { opacity:k < n ? 1 : 0, duration:.5*D, delay:(step === 1 ? k*.55 : 0)*D }); });
    const top = (n - 1)*10 + 5, FR = 500, am = top*RAD;
    gsap.to(this.arm, { attr:{ x2:E[0] + (FR - 72)*Math.cos(am), y2:E[1] - (FR - 72)*Math.sin(am) }, duration:(step === 1 ? 2 : .6)*D, ease:'power2.inOut' });
  }
});

/* 6. Parallels, meridians and the Bingo card */
Deck.add({ id:'grid', actName:ACT2, title:'The Bingo card', min:1.5, steps:5,
  notes:{ script:`Two families of lines. Parallels — lines of latitude — run east–west, like rungs on a ladder. [click] Meridians — lines of longitude — run from pole to pole. [click] Unroll the globe and the lines become a grid. [click] Think of a Bingo card. Latitude calls the row; longitude calls the column. Row 38.9 north, column 77 west: Washington. [click] Calling the row was easy — just look at Polaris. Calling the column was the hard part. That is what killed Shovell's sailors.`,
    cues:['Parallels: lines of latitude, east–west.','Meridians: lines of longitude, pole to pole.','The globe unrolls into a flat grid.','Bingo: latitude calls the row, longitude the column.','Calling the column is the hard part.'] },
  build(root){
    const svg = fullSvg(root); this.svg = svg;
    let t = 0; const ortho = d3.geoOrthographicRaw, eq = d3.geoEquirectangularRaw;
    const mut = d3.geoProjectionMutator(tt => (x, y) => { const a = ortho(x, y), b = eq(x, y); return [a[0]*(1-tt) + b[0]*tt, a[1]*(1-tt) + b[1]*tt]; });
    const proj = mut(0); this.mut = mut;
    const g = this.g = new Globe(svg, { cx:640, cy:560, r:390, lon:-40, lat:22, grat:15 });
    g.gratEl.style.display = 'none';
    g.st.t = 0; g.proj = proj; g.path = d3.geoPath(proj);
    g.apply = function(){ const tt = this.st.t; mut(tt); proj.clipAngle(tt > .995 ? null : 90 + 89.9*tt).translate([this.st.cx, this.st.cy]).scale(this.st.r).rotate([-this.st.lon, -this.st.lat, 0]).precision(.5); };
    g.shadeEl.style.transition = 'opacity .6s';
    this.pars = d3.range(-75, 76, 15).map(l => g.geo(parallel(l), { stroke: l === 0 ? C.gold : 'rgba(232,176,75,.55)', 'stroke-width': l === 0 ? 2.2 : 1.4, opacity:0 }, 'over'));
    this.mers = d3.range(-180, 180, 15).map(l => g.geo(meridian(l), { stroke: 'rgba(127,167,201,.7)', 'stroke-width':1.4, opacity:0 }, 'over'));
    this.latLabs = [60, 30, 0, -30, -60].map(l => g.point(() => [g.st.lon + 12, l], e => s('text', { class:'label-dim num', y:-6, style:'font-size:22px;fill:#F4CD7E', opacity:0 }, e, l === 0 ? '0°' : Math.abs(l) + '°' + (l > 0 ? 'N' : 'S'))));
    this.lonLabs = [-90, -60, -30, 0, 30].map(l => g.point([l, -3], e => s('text', { class:'label-dim num', y:26, 'text-anchor':'middle', style:'font-size:22px;fill:#A9C3DB', opacity:0 }, e, l === 0 ? '0°' : Math.abs(l) + '°' + (l > 0 ? 'E' : 'W'))));
    // bingo overlay (in flat-map coordinates, computed at t=1)
    this.flat = { cx:960, cy:640, r:1500/(2*Math.PI) };
    const P = d3.geoEquirectangular().scale(this.flat.r).translate([this.flat.cx, this.flat.cy]);
    const y30 = P([0,30])[1], y45 = P([0,45])[1], x90 = P([-90,0])[0], x75 = P([-75,0])[0], x0 = P([-180,0])[0], x1 = P([180,0])[0], yT = P([0,90])[1], yB = P([0,-90])[1];
    const B = this.bingo = s('g', { opacity:0 }, svg);
    s('rect', { x:x0, y:y45, width:x1 - x0, height:y30 - y45, fill:'rgba(232,176,75,.16)', stroke:'rgba(232,176,75,.7)', 'stroke-width':1.5 }, B);
    s('rect', { x:x90, y:yT, width:x75 - x90, height:yB - yT, fill:'rgba(127,167,201,.16)', stroke:'rgba(127,167,201,.8)', 'stroke-width':1.5 }, B);
    s('rect', { x:x90, y:y45, width:x75 - x90, height:y30 - y45, fill:'none', stroke:C.gold2, 'stroke-width':3.5 }, B);
    const dc = P([-77.04, 38.9]);
    s('circle', { cx:dc[0], cy:dc[1], r:7, fill:C.coral, stroke:'#fff', 'stroke-width':2 }, B);
    s('text', { x:x0 - 14, y:(y30 + y45)/2 + 9, 'text-anchor':'end', class:'label', fill:C.gold2, style:'font-weight:600' }, B, 'row');
    s('text', { x:(x90 + x75)/2, y:yB + 36, 'text-anchor':'middle', class:'label', fill:'#A9C3DB', style:'font-weight:600' }, B, 'column');
    const tag = s('g', { transform:`translate(${dc[0] + 34},${dc[1] - 70})` }, B);
    s('rect', { x:0, y:0, width:330, height:84, rx:6, fill:'rgba(6,12,23,.9)', stroke:'rgba(236,241,247,.35)' }, tag);
    s('text', { x:16, y:34, class:'label', style:'font-weight:600' }, tag, 'Washington, D.C.');
    s('text', { x:16, y:68, class:'label num', fill:C.gold2 }, tag, '38.9° N, 77.0° W');
    s('line', { x1:dc[0] + 6, y1:dc[1] - 6, x2:dc[0] + 34, y2:dc[1] - 30, stroke:'rgba(236,241,247,.5)' }, B);
    // text
    txt(root, 1160, 140, 680, 'kicker', 'Latitude is easy', 0, { out:2 });
    txt(root, 1160, 200, 680, 'h2', 'Parallels', 0, { out:2 });
    txt(root, 1160, 285, 660, 'lede', 'Lines of <em>latitude</em> run east–west, like rungs on a ladder.', 0, { out:2 });
    txt(root, 1160, 470, 680, 'h2', 'Meridians', 1, { out:2 });
    txt(root, 1160, 555, 660, 'lede', 'Lines of <span class="steel" style="font-style:italic">longitude</span> run from pole to pole.', 1, { out:2 });
    txt(root, 210, 70, 1500, 'h2', 'Unroll the globe, and the lines become a grid.', 2, { out:3 });
    txt(root, 210, 70, 1500, 'h2', '<em>Latitude</em> calls the row. <span class="steel" style="font-style:italic">Longitude</span> calls the column.', 3, { out:4 });
    txt(root, 210, 70, 1500, 'h2', 'Calling the row is easy. <span class="coral" style="font-style:italic">Calling the column is the hard part.</span>', 4);
  },
  go(step, { instant }){
    const D = instant ? 0 : 1, g = this.g;
    this.pars.forEach((p, k) => gsap.to(p, { opacity:1, duration:.6*D, delay:(step === 0 && !instant ? .3 + k*.08 : 0) }));
    this.mers.forEach((p, k) => gsap.to(p, { opacity:step >= 1 ? 1 : 0, duration:.6*D, delay:(step === 1 && !instant ? k*.04 : 0) }));
    this.latLabs.forEach(e => gsap.to(e.firstChild, { opacity:1, duration:.6*D }));
    this.lonLabs.forEach(e => gsap.to(e.firstChild, { opacity:step >= 1 ? 1 : 0, duration:.6*D }));
    const flat = step >= 2;
    this.spin = !flat;
    gsap.to(g.shadeEl, { opacity: flat ? 0 : 1, duration:.8*D }); if (g.halo) gsap.to(g.halo, { opacity: flat ? 0 : 1, duration:.8*D });
    if (flat) g.to({ t:1, lon:0, lat:0, r:this.flat.r, cx:this.flat.cx, cy:this.flat.cy }, 2.8, 'power2.inOut', instant);
    else g.to({ t:0, lat:22, r:390, cx:640, cy:560 }, 1.6, 'power2.inOut', instant);
    gsap.to(this.bingo, { opacity:step >= 3 ? 1 : 0, duration:.8*D });
    gsap.to(this.latLabs.concat(this.lonLabs).map(e => e), { opacity: flat ? 0 : 1, duration:.5*D });
  },
  loop(t, dt){ if (this.spin){ this.g.st.lon += dt*8; this.g.render(); } }
});
