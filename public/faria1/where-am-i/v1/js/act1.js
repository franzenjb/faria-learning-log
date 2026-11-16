/* ACT 1 — THE STAKES */
const ACT1 = 'The stakes';

/* 1. Title */
Deck.add({ id:'title', actName:'Opening', title:'Where Am I?', min:0.5, steps:1,
  notes:{ script:`Good morning. Every day in disaster work we drop pins: a shelter, a damaged home, a family that needs a cot. Every one of those pins is just two numbers. Today is the story of how humanity learned to write those two numbers down — and what it cost before we could.`,
    cues:['Title. Globe turns; the readout shows the two numbers under the crosshair.'] },
  build(root){
    const svg = fullSvg(root);
    { const rnd = d3.randomLcg(42); for (let k = 0; k < 220; k++) s('circle', { cx:rnd()*1920, cy:rnd()*1080, r:rnd()*1.2 + .25, fill:'#CFDBEE', opacity:rnd()*.45 + .08 }, svg); }
    this.g = new Globe(svg, { cx:1400, cy:560, r:420, lon:-40, lat:22, grat:15 });
    this.g.gratEl.style.opacity = 0;
    this.eq = this.g.geo(parallel(0), { stroke:C.gold, 'stroke-width':1.6, opacity:.55 });
    this.pm = this.g.geo(meridian(0), { stroke:C.gold, 'stroke-width':1.6, opacity:.55 });
    const ch = s('g', { transform:'translate(1400,560)' }, svg);
    s('circle', { r:9, fill:'none', stroke:C.gold, 'stroke-width':2 }, ch);
    s('line', { x1:-26, x2:-13, stroke:C.gold, 'stroke-width':2 }, ch); s('line', { x1:13, x2:26, stroke:C.gold, 'stroke-width':2 }, ch);
    s('line', { y1:-26, y2:-13, stroke:C.gold, 'stroke-width':2 }, ch); s('line', { y1:13, y2:26, stroke:C.gold, 'stroke-width':2 }, ch);
    this.read = s('text', { x:34, y:-14, class:'label num', fill:C.gold2, style:'font-size:28px;font-weight:600' }, ch, '');
    txt(root, 140, 300, 700, 'kicker', 'Latitude &amp; longitude', undefined, { style:{ position:'absolute' } });
    txt(root, 132, 345, 900, 'h1', 'Where Am I?', undefined, { style:{ fontSize:'148px', lineHeight:'1', whiteSpace:'nowrap' } });
    txt(root, 140, 540, 640, 'lede', 'How we learned to name any place on Earth with <em>two numbers</em>.');
    txt(root, 140, 800, 700, 'label-dim', 'Jeff Franzen &nbsp;·&nbsp; Disaster GIS &nbsp;·&nbsp; American Red Cross', undefined, { style:{ fontSize:'24px' } });
  },
  enter(){ gsap.fromTo(this.g.gratEl, { opacity:0 }, { opacity:1, duration:2.4, ease:'power1.out' }); },
  loop(t, dt){ this.g.st.lon += dt * 6; this.g.render(); const c = this.g.proj.invert([1400,560]); this.read.textContent = fmtLat(c[1]) + '   ' + fmtLon(c[0]); }
});

/* 2. Cold open — 22 October 1707 */
Deck.add({ id:'scilly', actName:ACT1, title:'22 October 1707', min:2.5, steps:5,
  notes:{ script:`October 1707. Admiral Sir Cloudesley Shovell is bringing the British fleet home from the Mediterranean, through days of storms and cloud. On the evening of the 22nd, his navigators believe they are in safe water, west of Brittany, heading into the English Channel. [click] That is where they think they are. [click] This is where they really are — farther north, heading straight for the Isles of Scilly. [click] Around eight at night, in the dark, the flagship Association and three more ships hit the Western Rocks. [click] Four ships. Estimates of the dead run from over 1,300 to about 2,000 men — as many as 2,000. One of the worst disasters in Royal Navy history.`,
    cues:['Dark sea; the fleet sails in from the south-west.','Gold ghost fleet: where they believed they were.','Coral fleet: where they really were, and the gap.','Camera dives into Scilly; the fleet drifts onto the Western Rocks.','The toll: four ships; estimates of the dead run from over 1,300 to about 2,000.'] },
  build(root){
    const cv = h('canvas', { width:1920, height:1080, style:{ position:'absolute', left:0, top:0 } }, root); this.cv = cv; this.ctx = cv.getContext('2d');
    this.waves = d3.range(220).map(() => ({ x:Math.random()*1920, y:Math.random()*1080, l:20 + Math.random()*50, p:Math.random()*6.28, sp:4 + Math.random()*8 }));
    const svg = fullSvg(root); this.svg = svg;
    this.st = { lon:-5.6, lat:49.25, k:8600 };
    this.proj = d3.geoOrthographic().clipAngle(90).precision(0.1); this.path = d3.geoPath(this.proj);
    const extra = [ // small Scilly islands & rocks not resolved in 1:10m data (real centre points, approximate size)
      [-6.343,49.893,.009,.006],[-6.355,49.953,.008,.009],[-6.285,49.965,.016,.006],[-6.373,49.897,.004,.003],[-6.318,49.938,.006,.004] ];
    const blobs = extra.map(([x,y,rx,ry]) => ({ type:'Polygon', coordinates:[d3.range(0,361,30).map(a => [x + rx*Math.cos(a*RAD), y - ry*Math.sin(a*RAD)])] }));
    this.landEl = s('path', { fill:'#152842', stroke:'#35527A', 'stroke-width':1 }, svg);
    this.blobEls = blobs.map(b => s('path', { fill:'#152842', stroke:'#35527A', 'stroke-width':1 }, svg));
    this.blobs = blobs;
    this.rocks = [[-6.397,49.866],[-6.446,49.872],[-6.46,49.89],[-6.42,49.879],[-6.41,49.858],[-6.432,49.885],[-6.384,49.873],[-6.452,49.862],[-6.405,49.876],[-6.39,49.86]];
    this.rockEls = this.rocks.map(() => { const g = s('g', { opacity:0 }, svg); s('path', { d:'M-6,0H6M0,-6V6', stroke:'#C9D3E0', 'stroke-width':1.6 }, g); return g; });
    // labels (geo-anchored)
    this.labels = [];
    const L = (ll, t, cls, dx = 0, dy = 0, anchor = 'middle') => { const e = s('text', { class:cls, 'text-anchor':anchor }, svg, t); this.labels.push({ ll, e, dx, dy }); return e; };
    L([-4.7,50.45],'CORNWALL','label-dim',0,0).setAttribute('style','letter-spacing:.25em;font-size:22px');
    L([-3.2,48.25],'BRITTANY','label-dim').setAttribute('style','letter-spacing:.25em;font-size:22px');
    L([-8.4,52.35],'IRELAND','label-dim').setAttribute('style','letter-spacing:.25em;font-size:22px');
    this.scLab = L([-6.27,49.99],'Isles of Scilly','label',16,-10,'start');
    this.wrLab = L([-6.425,49.852],'Western Rocks','label',0,44,'middle'); this.wrLab.style.opacity = 0;
    // fleets
    const fleet = (col, dash) => { const g = s('g', {}, svg); const ships = d3.range(12).map(k => { const sh = s('path', { d:SHIP, fill: dash ? 'none' : col, stroke: col, 'stroke-width': dash ? 1.6 : .6, 'stroke-dasharray': dash ? '3 2' : '' }, g); return { el:sh, ox:(k%4)*34 - 50 + (Math.floor(k/4)%2)*16, oy:Math.floor(k/4)*26 - 26 }; }); return { g, ships, pos:[0,0], hd:0 }; };
    this.ghostTrack = s('path', { fill:'none', stroke:C.gold, 'stroke-width':2, 'stroke-dasharray':'2 9', 'stroke-linecap':'round', opacity:0 }, svg);
    this.errLine = s('path', { fill:'none', stroke:C.text, 'stroke-width':1.5, 'stroke-dasharray':'6 6', opacity:0 }, svg);
    this.ghost = fleet(C.gold, true); this.real = fleet('#E7ECF3', false);
    this.ghostLab = s('text', { class:'label', fill:C.gold2, 'text-anchor':'middle', opacity:0, style:'font-size:28px;font-weight:600' }, svg, 'Where they believed they were');
    this.realLab = s('text', { class:'label', fill:C.coral, 'text-anchor':'end', opacity:0, style:'font-size:28px;font-weight:600' }, svg, 'Where they really were');
    this.rings = [0,1,2,4].map(() => s('circle', { r:0, fill:'none', stroke:C.coral, 'stroke-width':2.5, opacity:0 }, svg));
    // vignette
    const df = defs(svg); const vg = s('radialGradient', { id:'vig1', cx:'50%', cy:'50%', r:'75%' }, df);
    s('stop', { offset:'55%', 'stop-color':'#02060D', 'stop-opacity':0 }, vg); s('stop', { offset:'100%', 'stop-color':'#02060D', 'stop-opacity':.85 }, vg);
    s('rect', { width:1920, height:1080, fill:'url(#vig1)', 'pointer-events':'none' }, svg);
    this.black = s('rect', { width:1920, height:1080, fill:'#03070E', opacity:0, 'pointer-events':'none' }, svg);
    // text
    txt(root, 110, 690, 760, 'kicker', 'The stakes', 0, { style:{ position:'absolute' }, out:4 });
    txt(root, 104, 730, 900, 'h1', '22 October 1707', 0, { style:{ fontSize:'84px' }, out:4 });
    txt(root, 110, 840, 760, 'lede', 'Admiral Sir Cloudesley Shovell is bringing the British fleet home through days of storm and cloud.', 0, { out:1 });
    txt(root, 110, 840, 760, 'lede', 'His navigators believe the fleet is in <em>safe water</em>, west of Brittany, heading into the Channel.', 1, { out:2 });
    txt(root, 110, 840, 760, 'lede', 'In fact it is farther north — heading for the <span class="coral">Isles of Scilly</span>.', 2, { out:3 });
    txt(root, 110, 840, 760, 'lede', 'About 8 p.m., in darkness, the flagship <em>Association</em> and three more ships strike the Western Rocks.', 3, { out:4 });
    txt(root, 0, 380, 1920, 'statement', 'Four ships lost.<br>As many as 2,000 men.', 4, { style:{ textAlign:'center' } });
    txt(root, 0, 600, 1920, 'label-dim', 'Association &nbsp;·&nbsp; Eagle &nbsp;·&nbsp; Romney &nbsp;·&nbsp; Firebrand', 4, { style:{ textAlign:'center', fontSize:'26px', letterSpacing:'.12em' } });
    txt(root, 0, 650, 1920, 'label-dim', 'Estimates of the dead range from over 1,300 to about 2,000.', 4, { style:{ textAlign:'center', fontSize:'24px', color:'#6F819A' } });
    // fleet motion state
    this.m = { gx:0, rx:0, rr:0 };
    this.render();
  },
  // tracks: lon/lat waypoints
  trackGhost: [[-9.2,48.55],[-6.9,48.95],[-4.2,49.45]],
  trackReal: [[-9.0,49.25],[-6.75,49.80],[-6.43,49.872]],
  along(tr, t){ const i = t < .5 ? 0 : 1, u = t < .5 ? t*2 : (t-.5)*2; return d3.geoInterpolate(tr[i], tr[i+1])(u); },
  placeFleet(f, ll, ll2, scale = 1, wreck = 0){
    const p = this.proj(ll), q = this.proj(ll2); const a = Math.atan2(q[1]-p[1], q[0]-p[0]);
    f.g.setAttribute('transform', `translate(${p[0]},${p[1]}) rotate(${a/RAD})`);
    f.ships.forEach((sh, k) => { const sk = scale; let dx = sh.ox*sk, dy = sh.oy*sk, rot = 0, op = 1;
      if (wreck > 0){ const hit = k < 4; if (hit){ const rk = this.proj(this.rocks[[0,1,2,4][k]]), vx = rk[0] - p[0], vy = rk[1] - p[1], ca = Math.cos(-a), sa = Math.sin(-a); const lx = vx*ca - vy*sa, ly = vx*sa + vy*ca; dx = dx + (lx - dx)*wreck; dy = dy + (ly - dy)*wreck; rot = 28*wreck*(k%2?1:-1); } else { dx = sh.ox*sk - 220*wreck*sk*.5; dy = sh.oy*sk + 160*wreck*sk*(k%2?1:-1)*.4; op = 1 - .7*wreck; } }
      sh.el.setAttribute('transform', `translate(${dx},${dy}) rotate(${rot}) scale(${Math.min(1.25, .9 + scale*.1)})`); sh.el.style.opacity = op;
      sh.el.setAttribute('fill', wreck > .6 && k < 4 ? C.coral : (f === this.real ? '#E7ECF3' : 'none'));
    });
  },
  render(){
    const st = this.st; this.proj.translate([960,540]).scale(st.k).rotate([-st.lon, -st.lat]);
    this.landEl.setAttribute('d', this.path(window.REGION10));
    this.blobEls.forEach((e, k) => e.setAttribute('d', this.path(this.blobs[k])));
    this.rocks.forEach((r, k) => { const p = this.proj(r); this.rockEls[k].setAttribute('transform', `translate(${p[0]},${p[1]})`); });
    [0,1,2,4].forEach((ri, k) => { const p = this.proj(this.rocks[ri]); this.rings[k].setAttribute('cx', p[0]); this.rings[k].setAttribute('cy', p[1]); });
    for (const l of this.labels){ const p = this.proj(l.ll), x = p[0] + l.dx, y = p[1] + l.dy; l.e.setAttribute('x', x); l.e.setAttribute('y', y); l.e.setAttribute('visibility', (x < -200 || x > 2120 || y < -100 || y > 1180) ? 'hidden' : 'visible'); }
    const sc = st.k / 8600;
    const g = this.along(this.trackGhost, this.m.gx), g2 = this.along(this.trackGhost, Math.min(1, this.m.gx + .02));
    this.placeFleet(this.ghost, g, g2, 1);
    const r = this.along(this.trackReal, this.m.rx), r2 = this.along(this.trackReal, Math.min(1, this.m.rx + .02) ), rEnd = this.trackReal[2];
    this.placeFleet(this.real, r, this.m.rx > .98 ? [rEnd[0]+.05, rEnd[1]+.01] : r2, Math.min(1.5, Math.max(1, sc*.25)), this.m.rr);
    const gp = this.proj(g), rp = this.proj(r);
    this.ghostLab.setAttribute('x', gp[0]); this.ghostLab.setAttribute('y', gp[1] + 92);
    this.realLab.setAttribute('x', rp[0] - 110); this.realLab.setAttribute('y', rp[1] + 8);
    this.ghostTrack.setAttribute('d', this.path({ type:'LineString', coordinates:[g, this.trackGhost[2]] }) || '');
    this.errLine.setAttribute('d', `M${gp[0]},${gp[1]}L${rp[0]},${rp[1]}`);
  },
  go(step, { instant }){
    const D = instant ? 0 : 1, T = (o, v, d = 1.2) => gsap.to(o, Object.assign({ duration:d*D, ease:'power2.inOut', onUpdate:() => this.render() }, v));
    gsap.killTweensOf([this.st, this.m]);
    const show = (e, on, d = .8) => gsap.to(e, { opacity:on ? 1 : 0, duration:d*D });
    show(this.ghost.g, step >= 1 && step < 4); show(this.ghostLab, step >= 1 && step < 3); show(this.ghostTrack, step >= 1 && step < 3);
    show(this.real.g, step === 0 || (step >= 2 && step < 4)); show(this.realLab, step === 2); show(this.errLine, step === 2);
    show(this.black, step === 4 ? .82 : 0, 1.4);
    gsap.to(this.black, { opacity: step === 4 ? .82 : 0, duration: 1.4*D });
    this.rockEls.forEach(e => show(e, step >= 3, .6)); show(this.wrLab, step === 3);
    if (step === 0){ this.m.gx = .5; this.m.rr = 0; T(this.st, { lon:-5.6, lat:49.25, k:8600 }, 1.4); this.m.rx = 0; T(this.m, { rx:.35 }, 6); }
    if (step === 1){ this.m.rr = 0; T(this.st, { lon:-5.6, lat:49.25, k:8600 }, 1.4); this.m.gx = .2; T(this.m, { gx:.5 }, 2.5); this.m.rx = .5; }
    if (step === 2){ this.m.rr = 0; this.m.gx = .5; T(this.st, { lon:-5.6, lat:49.25, k:8600 }, 1.4); this.m.rx = .3; T(this.m, { rx:.42 }, 2); }
    if (step === 3){ this.m.gx = .5; this.m.rr = 0; this.m.rx = .55; T(this.st, { lon:-6.53, lat:49.875, k:150000 }, 2.8);
      gsap.to(this.m, { rx:1, duration:4.2*D, delay:1.2*D, ease:'power1.inOut', onUpdate:() => this.render() });
      gsap.to(this.m, { rr:1, duration:1.4*D, delay:5.0*D, ease:'power2.out', onUpdate:() => this.render() }); }
    if (step === 4){ this.st.lon = -6.53; this.st.lat = 49.875; this.st.k = 150000; this.m.rx = 1; this.m.rr = 1; T(this.st, { k:120000 }, 6); }
    gsap.killTweensOf(this.rings);
    this.rings.forEach((r, k) => { r.setAttribute('r', 0); r.setAttribute('opacity', 0);
      if (step === 3) gsap.fromTo(r, { attr:{ r:6 }, opacity:.95 }, { attr:{ r:70 }, opacity:0, duration:2.2, ease:'power1.out', repeat:-1, delay:(instant ? 0 : 5.6) + k*.35 }); });
    if (instant) this.render();
  },
  loop(t, dt){
    const c = this.ctx; c.clearRect(0,0,1920,1080); c.strokeStyle = 'rgba(120,160,210,.09)'; c.lineWidth = 1.2;
    for (const w of this.waves){ w.x += w.sp*dt; if (w.x > 1960) w.x = -60; const yy = w.y + Math.sin(t*.6 + w.p)*3;
      c.beginPath(); for (let k = 0; k <= 10; k++){ const xx = w.x + k*w.l/10, y2 = yy + Math.sin(k/10*Math.PI*2 + t + w.p)*2; k ? c.lineTo(xx,y2) : c.moveTo(xx,y2); } c.stroke(); }
  }
});

/* 3. Why — the engraving */
Deck.add({ id:'why', actName:ACT1, title:'Two numbers, one missing', min:2, steps:4,
  notes:{ script:`This engraving was made about thirty years later. Historians still argue about everything that went wrong that night — bad charts, poor compasses, bad weather. But underneath it all is one simple problem. [click] Sailors had a way to find their latitude — how far north they were — whenever they could see the sky. [click] But nobody on Earth had a reliable way to find longitude at sea — how far east or west. [click] A position takes two numbers. In 1707, at sea, one of them was a guess. So let's take them one at a time, starting with the easy one.`,
    cues:['Engraving of the wreck.','Latitude: they had a way.','Longitude: they did not.','Two numbers — one was missing.'] },
  build(root){
    const p = photo(root, 'img/wreck.jpg', 90, 110, 1060, 722, undefined,
      '“Sir Cloudesley Shovell, in the Association, with the Eagle, Rumñy and the Firebrand, lost on the rocks of Scilly, October 22, 1707.” Engraving after William Rayner, c. 1739. Public domain, via Wikimedia Commons.', { kb:true });
    this.img = p.querySelector('img');
    txt(root, 1240, 130, 600, 'kicker', 'The stakes');
    txt(root, 1236, 175, 620, 'h2', 'Why didn’t they know where they were?');
    const icon = (ns) => ns
      ? `<svg width="46" height="46" viewBox="-23 -23 46 46" style="vertical-align:-10px;margin-right:16px"><path d="M0,-19V19M-7,-11L0,-19L7,-11M-7,11L0,19L7,11" fill="none" stroke="${C.gold}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`
      : `<svg width="46" height="46" viewBox="-23 -23 46 46" style="vertical-align:-10px;margin-right:16px"><path d="M-19,0H19M-11,-7L-19,0L-11,7M11,-7L19,0L11,7" fill="none" stroke="${C.coral}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    txt(root, 1240, 400, 620, 'lede', `${icon(true)}They had a way to find <em>latitude</em> — how far north.`, 1);
    txt(root, 1240, 560, 620, 'lede', `${icon(false)}They had no way to find <span class="coral" style="font-style:italic">longitude</span> at sea — how far east or west.`, 2);
    txt(root, 1240, 770, 620, 'h2', 'Two numbers.<br><em>One was missing.</em>', 3, { style:{ fontSize:'56px' } });
  },
  enter(){ this.img.style.transform = 'scale(1)'; requestAnimationFrame(() => requestAnimationFrame(() => { this.img.style.transform = 'scale(1.08)'; })); }
});
