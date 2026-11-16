/* ACT 5 — ZERO IS A CHOICE */
const ACT5 = 'Zero is a choice';

Deck.add({ id:'zero', actName:ACT5, title:'Where would you put zero?', min:1.75, steps:5,
  notes:{ script:`Now a strange thing. Latitude has a natural zero — the equator. Longitude doesn't. Every meridian runs pole to pole; not one is special. [click] So, a question for the room: if you were in charge, where would you put zero? Your hometown? Your chapter headquarters? Shout it out, or drop it in the chat. [click] People have answered differently. Around AD 150, Ptolemy counted from the Fortunate Isles — the Canary Islands — the western edge of his known world. [click] France counted from Paris. [click] And in 1675 King Charles II founded the Royal Observatory at Greenwich, in the words of its founding warrant, "for the finding out of the so much desired longitude of places." Every country had a candidate. Someone had to choose.`,
    cues:['Equator is natural; meridians are all equal.','Ask the room: where would you put zero?','Ptolemy: the Canary Islands.','Paris.','Greenwich, 1675.'] },
  build(root){
    const svg = fullSvg(root); const g = this.g = new Globe(svg, { cx:640, cy:560, r:420, lon:-20, lat:22, grat:90 });
    g.geo(parallel(0), { stroke:C.gold, 'stroke-width':2.5 }, 'over');
    this.mers = d3.range(-180, 180, 15).map(l => g.geo(meridian(l), { stroke:'rgba(127,167,201,.55)', 'stroke-width':1.4 }, 'over'));
    this.hl = g.geo(() => meridian(this.hlLon || 0), { stroke:C.gold2, 'stroke-width':4, opacity:0 }, 'over');
    const place = (ll, name) => { const e = g.point(ll, el => { s('circle', { r:9, fill:C.gold2, stroke:C.ink, 'stroke-width':2 }, el); s('text', { x:18, y:-12, class:'label', fill:C.gold2, style:'font-weight:600;font-size:28px' }, el, name); }); e.style.opacity = 0; return e; };
    this.pC = place([-15.5, 28.3], 'Canary Islands'); this.pP = place([2.34, 48.84], 'Paris'); this.pP.querySelector('text').setAttribute('y', 34); this.pG = place([0, 51.48], 'Greenwich');
    s('text', { x:640 - 420 - 16, y:569, class:'label', fill:C.gold2, 'text-anchor':'end' }, svg, '0°');
    txt(root, 1180, 120, 660, 'kicker', ACT5);
    txt(root, 1176, 165, 680, 'h2', 'Every meridian is as good as any other.', 0, { out:1, style:{ fontSize:'56px' } });
    txt(root, 1180, 350, 640, 'lede', 'Latitude has a natural zero: the equator. <em>Longitude doesn’t.</em>', 0, { out:1 });
    txt(root, 1176, 300, 680, 'statement', 'Where would <em style="color:var(--gold-2)">you</em> put zero?', 1, { out:2, style:{ fontSize:'84px' } });
    txt(root, 1180, 300, 640, 'lede', '<span class="label-dim" style="font-size:26px">c. AD 150 · Ptolemy</span><br>The Fortunate Isles — the <em>Canary Islands</em> — the western edge of his known world.', 2, { dim:3 });
    txt(root, 1180, 540, 640, 'lede', '<span class="label-dim" style="font-size:26px">France</span><br>Counted from <em>Paris</em>.', 3, { dim:4 });
    txt(root, 1180, 700, 660, 'lede', '<span class="label-dim" style="font-size:26px">1675 · Royal Observatory, Greenwich</span><br>Founded “for the finding out of the so much desired <em>longitude of places</em>.”', 4);
  },
  go(step, { instant }){
    const D = instant ? 0 : 1, g = this.g; this.cycle = step === 1; this.spin = step === 0;
    gsap.to(this.hl, { opacity: step >= 1 ? 1 : 0, duration:.5*D });
    gsap.to(this.pC, { opacity: step >= 2 ? 1 : 0, duration:.6*D }); gsap.to(this.pP, { opacity: step >= 3 ? 1 : 0, duration:.6*D }); gsap.to(this.pG, { opacity: step >= 4 ? 1 : 0, duration:.6*D });
    const tgt = { 2:[-15.5, 28.3], 3:[2.34, 48.84], 4:[0, 51.48] }[step];
    if (tgt){ g.to({ lon:tgt[0] + 25, lat:24 }, 1.8, 'power2.inOut', instant); gsap.to(this, { hlLon:tgt[0], duration:1.2*D, onUpdate:() => g.render() }); }
    if (step === 1) g.to({ lat:22 }, 1, 'power2.inOut', instant);
  },
  loop(t, dt){ if (this.spin){ this.g.st.lon += dt*10; this.g.render(); } if (this.cycle){ this.hlLon = (Math.floor(t*1.6) * 15) % 360 - 180; this.g.render(); } }
});

Deck.add({ id:'vote1884', actName:ACT5, title:'1884: the world votes', min:2, steps:4,
  notes:{ script:`In October 1884, delegates gathered in Washington, D.C., at the International Meridian Conference, to pick one zero for the whole world. Here are the nations that voted — twenty-five of them, from Hawaii to Japan. [click] Greenwich won: 22 votes in favor. By then most of the world's shipping already used charts based on Greenwich. [click] One vote against — San Domingo, today's Dominican Republic. Two abstentions: France and Brazil. [click] France did not give up easily. Its national survey kept measuring longitude from the Paris meridian — often in grads, 400 to a full circle instead of 360 degrees — right up to December 31, 1999. On January 1, 2000, the Greenwich-based RGF93 became France's sole official system. Zero really was a choice.`,
    cues:['October 1884, Washington: the 25 voting nations on a map.','The dots fly into a tally: 22 for Greenwich.','1 against (San Domingo); France and Brazil abstain.','France counts from Paris, in grads, until 31 Dec 1999.'] },
  build(root){
    txt(root, 140, 110, 1600, 'kicker', ACT5 + ' · October 1884 · Washington, D.C.');
    txt(root, 136, 155, 1640, 'h2', 'One zero for the whole world');
    txt(root, 140, 250, 1500, 'lede', 'The International Meridian Conference: <em>25 nations</em> vote on one prime meridian.', 0, { out:3 });
    const svg = fullSvg(root); this.dots = [];
    // the voting nations (capital or seat of government, 1884)
    const N = [['Austria-Hungary',16.37,48.21],['Chile',-70.67,-33.45],['Colombia',-74.07,4.71],['Costa Rica',-84.09,9.93],['Germany',13.4,52.52],['Great Britain',-0.13,51.5],['Guatemala',-90.51,14.63],['Hawaii',-157.86,21.31],['Italy',12.5,41.9],['Japan',139.7,35.7],['Liberia',-10.8,6.3],['Mexico',-99.13,19.43],['Netherlands',4.9,52.37],['Paraguay',-57.6,-25.3],['Russia',30.3,59.94],['Salvador',-89.2,13.7],['Spain',-3.7,40.4],['Sweden–Norway',18.07,59.33],['Switzerland',7.45,46.95],['Ottoman Empire',28.98,41.01],['United States',-77.04,38.9],['Venezuela',-66.9,10.5],['San Domingo',-69.9,18.47],['France',2.35,48.86],['Brazil',-43.2,-22.9]];
    const MP = this.MP = d3.geoEquirectangular().scale(1640/(2*Math.PI)).translate([960, 620]).center([0, 10]);
    this.map = s('g', {}, svg);
    s('path', { d:d3.geoPath(MP)(d3.geoGraticule().step([30, 30]).extent([[-180, -50], [180, 72]])()), fill:'none', stroke:C.grat }, this.map);
    const cp = s('clipPath', { id:'vclip' }, defs(svg)); s('rect', { x:140, y:330, width:1640, height:570 }, cp);
    s('path', { d:d3.geoPath(MP)(LAND110), fill:C.land, stroke:C.landStroke, 'stroke-width':.8, 'clip-path':'url(#vclip)' }, this.map);
    const washington = MP([-77.04, 38.9]);
    this.dcLab = s('g', {}, svg); s('circle', { cx:washington[0], cy:washington[1], r:22, fill:'none', stroke:C.gold2, 'stroke-width':2 }, this.dcLab);
    s('text', { x:washington[0] - 30, y:washington[1] - 26, class:'label', fill:C.gold2, 'text-anchor':'end', style:'font-weight:600' }, this.dcLab, 'Washington, D.C.');
    const R = 24, gap = 58, x0 = 170, y0 = 500; const X = k => k < 22 ? x0 + k*gap : k === 22 ? 1500 : 1640 + (k - 23)*60;
    this.pos = N.map(([n, lo, la], k) => ({ map:MP([lo, la]), row:[X(k), y0] }));
    for (let k = 0; k < 25; k++){ const col = k < 22 ? C.gold : k === 22 ? C.coral : C.faint;
      const c = s('circle', { cx:this.pos[k].map[0], cy:this.pos[k].map[1], r:9, fill:'#E7ECF3', stroke:'#E7ECF3', 'stroke-width':3 }, svg); c._col = col; c._hollow = k >= 23; this.dots.push(c); }
    this.lab = s('g', {}, svg);
    this.l1 = s('text', { x:x0 - R, y:y0 + 100, class:'label', fill:C.gold2, style:'font-size:40px;font-weight:600', opacity:0 }, this.lab, '22 for Greenwich');
    this.l2 = s('text', { x:1500, y:y0 - 56, class:'label', fill:C.coral, 'text-anchor':'middle', style:'font-size:26px;font-weight:600', opacity:0 }, this.lab, '1 against');
    this.l2b = s('text', { x:1500, y:y0 + 92, class:'label', fill:C.coral, 'text-anchor':'middle', style:'font-size:24px', opacity:0 }, this.lab, 'San Domingo');
    this.l3 = s('text', { x:1670, y:y0 - 56, class:'label-dim', 'text-anchor':'middle', style:'font-size:26px;font-weight:600', opacity:0 }, this.lab, '2 abstain');
    this.l3b = s('text', { x:1670, y:y0 + 92, class:'label-dim', 'text-anchor':'middle', style:'font-size:24px', opacity:0 }, this.lab, 'France · Brazil');
    this.count = s('text', { x:x0 - R, y:y0 - 56, class:'num', style:'font:600 30px var(--sans);fill:#9AABC2', opacity:0 }, svg, '');
    // France epilogue: timeline + 400-grad dial
    const fr = this.fr = s('g', { opacity:0 }, svg);
    const tx0 = 170, tx1 = 1290, ty = 760, yr = y => tx0 + (y - 1884)/(2000 - 1884)*(tx1 - tx0);
    s('line', { x1:tx0, x2:tx1, y1:ty, y2:ty, stroke:'rgba(127,167,201,.6)', 'stroke-width':10, 'stroke-linecap':'butt' }, fr);
    s('line', { x1:tx1, x2:tx1 + 200, y1:ty, y2:ty, stroke:C.gold, 'stroke-width':10 }, fr);
    s('text', { x:tx0, y:ty - 26, class:'label-dim num' }, fr, '1884'); s('text', { x:tx1, y:ty - 26, class:'label num', 'text-anchor':'end' }, fr, '31 Dec 1999');
    s('text', { x:tx1 + 6, y:ty + 44, class:'label num', fill:C.gold2 }, fr, '1 Jan 2000');
    s('text', { x:tx0, y:ty + 44, class:'label', fill:'#B2CBE2' }, fr, 'France’s national survey: longitude from the Paris meridian, often in grads');
    s('text', { x:tx1 + 6, y:ty + 80, class:'label-dim' }, fr, 'RGF93 · Greenwich');
    const dc = [1650, 760], dr = 92; s('circle', { cx:dc[0], cy:dc[1], r:dr, fill:'none', stroke:'rgba(154,171,194,.35)' }, fr);
    for (let k = 0; k < 400; k += 4){ const a = k/400*2*Math.PI - Math.PI/2, l = k % 100 === 0 ? 16 : k % 20 === 0 ? 10 : 5; s('line', { x1:dc[0] + dr*Math.cos(a), y1:dc[1] + dr*Math.sin(a), x2:dc[0] + (dr - l)*Math.cos(a), y2:dc[1] + (dr - l)*Math.sin(a), stroke:C.gold2, 'stroke-width':1 }, fr); }
    s('text', { x:dc[0], y:dc[1] + 10, 'text-anchor':'middle', class:'num', style:'font:600 30px var(--serif);fill:#F4CD7E' }, fr, '400');
    s('text', { x:dc[0], y:dc[1] + dr + 38, 'text-anchor':'middle', class:'label-dim' }, fr, 'grads in a circle');
    txt(root, 140, 250, 1500, 'lede', 'France kept counting from Paris for another 115 years.', 3);
    txt(root, 140, 984, 1600, 'credit', 'Vote: International Meridian Conference, Washington, 1884 (22 for, 1 against, 2 abstaining). France: IGN, geodesie.ign.fr — the NTF system was centred on the Paris meridian until 31 Dec 1999; RGF93 (Greenwich) is the sole official system from 1 Jan 2000.');
  },
  go(step, { instant }){
    const D = instant ? 0 : 1;
    gsap.to(this.map, { opacity: step === 0 ? 1 : step < 3 ? .12 : 0, duration:1*D });
    gsap.to(this.dcLab, { opacity: step === 0 ? 1 : 0, duration:.5*D });
    this.dots.forEach((d, k) => { const inRow = k < 22 ? step >= 1 : step >= 2, P = inRow ? this.pos[k].row : this.pos[k].map;
      gsap.killTweensOf(d);
      gsap.to(d, { attr:{ cx:P[0], cy:P[1], r:inRow ? 24 : 9, fill: inRow ? (d._hollow ? 'rgba(0,0,0,0)' : d._col) : '#E7ECF3', stroke: inRow ? d._col : '#E7ECF3' },
        opacity: step >= 3 && !inRow ? 0 : (step >= 1 && !inRow ? .9 : 1), duration:1.1*D, ease:'power3.inOut', delay:((step === 1 && k < 22) ? k*.07 : (step === 2 && k >= 22) ? (k - 22)*.35 : 0)*D }); });
    gsap.to(this.l1, { opacity: step >= 1 ? 1 : 0, duration:.6*D, delay: step === 1 ? 2*D : 0 });
    gsap.to([this.l2, this.l2b, this.l3, this.l3b], { opacity: step >= 2 ? 1 : 0, duration:.6*D, delay: step === 2 ? .6*D : 0 });
    gsap.to(this.count, { opacity: step === 1 ? 1 : 0, duration:.3*D });
    if (step === 1){ const o = { v:0 }; gsap.to(o, { v:22, duration:2*D, ease:'none', onUpdate:() => this.count.textContent = Math.round(o.v) + ' / 25' }); }
    gsap.to(this.fr, { opacity: step >= 3 ? 1 : 0, duration:.8*D });
  }
});

Deck.add({ id:'gpszero', actName:ACT5, title:'Plot twist: GPS zero is 102 m east', min:0.75, steps:3,
  notes:{ script:`One plot twist, for the GIS people. If you stand on the famous brass line at Greenwich with your phone, it won't say zero. [click] GPS zero — the WGS 84 meridian — runs about 102 metres, 335 feet, east of the brass line. [click] That's a little longer than a football field. Nobody moved anything: the old line was set by a telescope aimed using local gravity, which tilts very slightly at Greenwich; GPS measures from the centre of the Earth. Two good answers, 102 metres apart.`,
    cues:['The brass line at Greenwich.','GPS (WGS 84) zero: 102 m east.','To scale: a 100-yard football field.'] },
  build(root){
    txt(root, 140, 100, 1600, 'kicker', ACT5 + ' · plot twist');
    txt(root, 136, 145, 1640, 'h2', 'Your phone disagrees with the brass line.');
    const svg = fullSvg(root), k = 8, x0 = 480, x1 = x0 + 102*k, top = 300, bot = 900; this.svg = svg;
    s('rect', { x:0, y:top - 20, width:1920, height:bot - top + 40, fill:'rgba(255,255,255,.012)' }, svg);
    s('line', { x1:x0, x2:x0, y1:top - 20, y2:bot + 20, stroke:'#C9A45A', 'stroke-width':6 }, svg);
    s('text', { x:x0 - 18, y:top + 20, 'text-anchor':'end', class:'label', fill:'#E2C483', style:'font-weight:600' }, svg, 'The brass line');
    s('text', { x:x0 - 18, y:top + 54, 'text-anchor':'end', class:'label-dim' }, svg, 'Airy’s meridian, 1851');
    s('text', { x:x0 - 18, y:top + 86, 'text-anchor':'end', class:'label-dim' }, svg, '0° from 1884');
    this.gps = s('g', { opacity:0 }, svg);
    s('line', { x1:x1, x2:x1, y1:top - 20, y2:bot + 20, stroke:C.steel, 'stroke-width':4, 'stroke-dasharray':'14 8' }, this.gps);
    s('text', { x:x1 + 18, y:top + 20, class:'label', fill:'#B2CBE2', style:'font-weight:600' }, this.gps, 'GPS zero (WGS 84)');
    s('text', { x:x1 + 18, y:top + 54, class:'label-dim' }, this.gps, 'what your phone calls 0°');
    s('line', { x1:x0 + 8, x2:x1 - 8, y1:420, y2:420, stroke:C.text, 'stroke-width':2 }, this.gps);
    s('path', { d:`M${x0 + 8},420l14,-8v16z M${x1 - 8},420l-14,-8v16z`, fill:C.text }, this.gps);
    s('text', { x:(x0 + x1)/2, y:404, 'text-anchor':'middle', class:'num', style:'font:600 44px var(--serif);fill:#ECF1F7' }, this.gps, '≈ 102 m  ·  335 ft');
    // scale bar
    const sb = s('g', {}, svg); s('line', { x1:x0, x2:x0 + 100*k, y1:bot - 20, y2:bot - 20, stroke:C.dim, 'stroke-width':2 }, sb);
    for (let m = 0; m <= 100; m += 25) s('line', { x1:x0 + m*k, x2:x0 + m*k, y1:bot - 28, y2:bot - 12, stroke:C.dim, 'stroke-width':2 }, sb);
    s('text', { x:x0 + 100*k - 10, y:bot + 16, 'text-anchor':'end', class:'label-dim num' }, sb, '100 m'); s('text', { x:x0 + 50*k, y:bot + 16, 'text-anchor':'middle', class:'label-dim num' }, sb, '50 m'); s('text', { x:x0 + 16, y:bot + 16, 'text-anchor':'start', class:'label-dim num' }, sb, '0');
    // football field (100 yd × 53⅓ yd) at the same scale
    const fw = 91.44*k, fh = 48.77*k, fy = 470;
    this.field = s('g', { opacity:0 }, svg);
    s('rect', { x:x0, y:fy, width:fw, height:fh, fill:'rgba(115,183,166,.10)', stroke:'rgba(115,183,166,.7)', 'stroke-width':2 }, this.field);
    for (let yd = 10; yd < 100; yd += 10) s('line', { x1:x0 + yd*.9144*k, x2:x0 + yd*.9144*k, y1:fy, y2:fy + fh, stroke:'rgba(115,183,166,.35)', 'stroke-width':1.2 }, this.field);
    s('text', { x:x0 + fw/2, y:fy + fh/2 + 10, 'text-anchor':'middle', class:'label', fill:'#9FD3C5' }, this.field, 'a 100-yard football field, same scale');
    txt(root, 140, 960, 1650, 'lede', 'The old line was set by a telescope aligned with <em>local gravity</em>; GPS measures from <em>Earth’s centre</em>.', 2, { style:{ fontSize:'32px' } });
    txt(root, 140, 1020, 1650, 'credit', 'Drawn to scale (8 px = 1 m at 1080p). Offset ≈ 102 m (5.3″ of longitude): Malys et al., “Why the Greenwich meridian moved,” Journal of Geodesy, 2015.');
  },
  go(step, { instant }){ const D = instant ? 0 : 1; gsap.to(this.gps, { opacity: step >= 1 ? 1 : 0, duration:.9*D }); gsap.to(this.field, { opacity: step >= 2 ? 1 : 0, duration:.9*D }); }
});
