/* APPENDIX — only if asked */
const APX = 'Appendix';

Deck.add({ id:'nullisland', appendix:true, actName:APX, title:'Null Island (0°, 0°)', min:0, steps:3,
  notes:{ script:`Null Island is the point 0 degrees, 0 degrees — open ocean in the Gulf of Guinea, more than 500 km off the coast of Ghana. [click] When a geocoder fails, many tools quietly write zeros, so bad records pile up there. [click] Before you map, filter out exact (0, 0) points and look at why they failed.`, cues:['0°, 0° in the Gulf of Guinea.','Failed geocodes pile up at (0, 0).','Filter them out.'] },
  build(root){
    txt(root, 140, 100, 1600, 'kicker', 'Appendix · GIS hygiene'); txt(root, 136, 145, 1640, 'h2', 'Null Island: 0°, 0°');
    const svg = fullSvg(root);
    const P = this.P = d3.geoEquirectangular().center([3, 6]).scale(1700).translate([710, 620]);
    const path = d3.geoPath(P);
    const c = s('clipPath', { id:'nclip' }, defs(svg)); s('rect', { x:100, y:260, width:1220, height:720 }, c);
    const g = s('g', { 'clip-path':'url(#nclip)' }, svg);
    s('rect', { x:100, y:260, width:1220, height:720, fill:C.ocean }, g);
    s('path', { d:path(d3.geoGraticule().step([5,5])()), fill:'none', stroke:C.grat }, g);
    s('path', { d:path(land50()), fill:C.land, stroke:C.landStroke }, g);
    s('path', { d:path(parallel(0)), stroke:C.gold, 'stroke-width':1.8, fill:'none' }, g); s('path', { d:path(meridian(0)), stroke:C.gold, 'stroke-width':1.8, fill:'none' }, g);
    const o = P([0, 0]); this.o = o;
    s('circle', { cx:o[0], cy:o[1], r:7, fill:C.gold2 }, svg);
    s('text', { x:o[0] + 16, y:o[1] + 34, class:'label', fill:C.gold2, style:'font-weight:600' }, svg, '0°, 0°');
    s('text', { x:P([-1.0, 7.6])[0], y:P([-1, 7.6])[1], class:'label-dim', 'text-anchor':'middle' }, svg, 'GHANA');
    this.dots = s('g', { opacity:0 }, svg); const rnd = d3.randomLcg(3);
    for (let k = 0; k < 40; k++){ s('circle', { cx:o[0] + (rnd() - .5)*14, cy:o[1] + (rnd() - .5)*14, r:4, fill:C.coral, opacity:.75 }, this.dots); }
    txt(root, 1380, 300, 470, 'lede', 'Open ocean in the Gulf of Guinea — more than 500 km off the coast of Ghana.', 0);
    txt(root, 1380, 520, 470, 'lede', 'When geocoding fails, many tools write <span class="coral">(0, 0)</span>. Bad records pile up here.', 1);
    txt(root, 1380, 740, 480, '', '<div style="font:500 26px/1.5 ui-monospace,Menlo,monospace;color:#F4CD7E;background:rgba(255,255,255,.04);padding:16px 18px;border-left:3px solid var(--gold)">WHERE NOT<br>(lat = 0 AND lon = 0)</div><div class="label-dim" style="margin-top:12px">Filter before you map.</div>', 2);
  },
  go(step, { instant }){ gsap.to(this.dots, { opacity: step >= 1 ? 1 : 0, duration:.8*(instant ? 0 : 1) }); }
});

Deck.add({ id:'dateline', appendix:true, actName:APX, title:'The date line (180°)', min:0, steps:2,
  notes:{ script:`Halfway around the world from Greenwich is 180 degrees. The International Date Line roughly follows it, bending around island nations so no country is split. [click] Cross it heading west, and the calendar jumps a day ahead; heading east, you get a day back.`, cues:['180°, opposite Greenwich.','Westbound: add a day.'] },
  build(root){
    txt(root, 1180, 120, 660, 'kicker', 'Appendix'); txt(root, 1176, 165, 680, 'h2', 'The date line');
    const svg = fullSvg(root); const g = this.g = new Globe(svg, { cx:640, cy:560, r:420, lon:180, lat:10, grat:30 });
    g.geo(meridian(180), { stroke:C.gold, 'stroke-width':3.5 }, 'over');
    g.point([180, 62], e => s('text', { x:12, y:0, class:'label', fill:C.gold2, style:'font-weight:600' }, e, '180°'));
    this.days = s('g', { opacity:0 }, svg);
    s('text', { x:470, y:470, 'text-anchor':'middle', class:'num', style:'font:600 44px var(--serif);fill:#ECF1F7' }, this.days, 'Tuesday');
    s('text', { x:810, y:470, 'text-anchor':'middle', class:'num', style:'font:600 44px var(--serif);fill:#9AABC2' }, this.days, 'Monday');
    s('text', { x:470, y:510, 'text-anchor':'middle', class:'label-dim' }, this.days, 'west of the line'); s('text', { x:810, y:510, 'text-anchor':'middle', class:'label-dim' }, this.days, 'east of the line');
    txt(root, 1180, 340, 640, 'lede', 'Halfway around from Greenwich: <em>180°</em>. The International Date Line roughly follows it, bending around island nations.', 0);
    txt(root, 1180, 580, 640, 'lede', 'Cross it heading <em>west</em> and the calendar jumps a day ahead. Heading east, you get the day back.', 1);
  },
  go(step, { instant }){ gsap.to(this.days, { opacity: step >= 1 ? 1 : 0, duration:.8*(instant ? 0 : 1) }); }
});

Deck.add({ id:'decimals', appendix:true, actName:APX, title:'How many decimal places?', min:0, steps:2,
  notes:{ script:`How many decimal places should a coordinate have? Each one is ten times finer. One decimal place is about 11 kilometres — a town. Four is about 11 metres — a house. Five is about a metre — a person. [click] Six or more is usually false precision for field data: a phone GPS is typically good to a few metres. These distances are north–south; east–west they shrink toward the poles.`, cues:['Decimal places table.','False precision warning.'] },
  build(root){
    txt(root, 140, 100, 1600, 'kicker', 'Appendix · precision'); txt(root, 136, 145, 1640, 'h2', 'How many decimal places?');
    const rows = [['26.6°', '1', '≈ 11 km', 'a town'], ['26.64°', '2', '≈ 1.1 km', 'a neighborhood'], ['26.640°', '3', '≈ 110 m', 'a city block'], ['26.6406°', '4', '≈ 11 m', 'a house'], ['26.64063°', '5', '≈ 1.1 m', 'a person'], ['26.640631°', '6', '≈ 11 cm', 'a hand']];
    const svg = fullSvg(root);
    rows.forEach((r, k) => { const y = 330 + k*95, w = [880, 560, 360, 230, 140, 90][k];
      s('text', { x:140, y, class:'num', style:'font:600 44px var(--serif);fill:#F4CD7E' }, svg, r[0]);
      s('text', { x:560, y, class:'label-dim num', style:'font-size:26px' }, svg, r[1] + ' decimal' + (r[1] === '1' ? '' : 's'));
      s('text', { x:800, y, class:'label num', style:'font-size:34px;font-weight:600' }, svg, r[2]);
      s('text', { x:1000, y, class:'label-dim', style:'font-size:30px' }, svg, r[3]);
      s('line', { x1:140, x2:1800, y1:y + 28, y2:y + 28, stroke:'rgba(154,171,194,.12)' }, svg);
    });
    txt(root, 1300, 330, 520, 'lede', 'Each decimal place is <em>10× finer</em>.', 0);
    txt(root, 1300, 520, 520, 'lede', 'Phone GPS is usually good to a few metres — <span class="coral">six decimals is false precision</span> for field data.', 1);
    txt(root, 140, 960, 1600, 'credit', 'Distances are along a meridian (1° of latitude ≈ 111 km). East–west, a degree of longitude shrinks toward the poles (≈ 111 km × cos latitude).');
  }
});

Deck.add({ id:'nmile', appendix:true, actName:APX, title:'The nautical mile', min:0, steps:3,
  notes:{ script:`Why sailors love the nautical mile. Each degree is split into 60 arcminutes. [click] Along a meridian, one arcminute of latitude is one nautical mile — so on a chart, the latitude scale is a mileage scale. [click] Today the nautical mile is defined as exactly 1,852 metres, about 6,076 feet.`, cues:['1° = 60 arcminutes.','1 arcminute of latitude = 1 nautical mile.','= 1,852 m exactly.'] },
  build(root){
    txt(root, 140, 100, 1600, 'kicker', 'Appendix · units'); txt(root, 136, 145, 1640, 'h2', 'The nautical mile');
    const svg = fullSvg(root), cx = 560, cy = 900, R = 640;
    s('path', { d:arcPath(cx, cy, R, -Math.PI/2, 0), fill:'none', stroke:C.landStroke, 'stroke-width':2 }, svg);
    s('line', { x1:cx, y1:cy, x2:cx + R, y2:cy, stroke:C.gold, 'stroke-width':2 }, svg); s('line', { x1:cx, y1:cy, x2:cx, y2:cy - R, stroke:C.faint }, svg);
    s('text', { x:cx + R + 12, y:cy + 8, class:'label-dim' }, svg, 'equator 0°'); s('text', { x:cx + 10, y:cy - R - 14, class:'label-dim' }, svg, 'pole 90°');
    const a0 = -30*RAD, a1 = -31*RAD;
    s('path', { d:`M${cx},${cy}L${cx + R*Math.cos(a0)},${cy + R*Math.sin(a0)}` + arcPath(cx, cy, R, a0, a1).replace('M','L') + 'Z', fill:'rgba(232,176,75,.25)', stroke:C.gold }, svg);
    s('text', { x:cx + (R + 20)*Math.cos(a0), y:cy + (R + 20)*Math.sin(a0) + 6, class:'label', fill:C.gold2 }, svg, '1°');
    s('line', { x1:cx + R*Math.cos(a1), y1:cy + R*Math.sin(a1), x2:1100, y2:450, stroke:'rgba(232,176,75,.35)' }, svg); s('line', { x1:cx + R*Math.cos(a0), y1:cy + R*Math.sin(a0), x2:1800, y2:510, stroke:'rgba(232,176,75,.35)' }, svg);
    this.zoom = s('g', { opacity:0 }, svg);
    const zx = 1100, zy = 450, zw = 700;
    s('rect', { x:zx, y:zy, width:zw, height:60, fill:'none', stroke:C.gold }, this.zoom);
    for (let k = 0; k <= 60; k++){ const x = zx + k*zw/60, l = k % 10 === 0 ? 30 : k % 5 === 0 ? 18 : 10; s('line', { x1:x, x2:x, y1:zy + 60, y2:zy + 60 - l, stroke:C.gold2, 'stroke-width':1.2 }, this.zoom); }
    s('text', { x:zx, y:zy - 16, class:'label', fill:C.gold2 }, this.zoom, '1 degree = 60 arcminutes');
    this.one = s('g', { opacity:0 }, svg);
    s('rect', { x:zx, y:zy, width:zw/60, height:60, fill:C.gold }, this.one);
    s('text', { x:zx, y:zy + 104, class:'label', style:'font-size:32px;font-weight:600' }, this.one, '1 arcminute of latitude = 1 nautical mile');
    this.def = txt(root, 1100, 650, 720, '', '<div class="num" style="font:600 92px/1.1 var(--serif);color:var(--gold-2)">1,852 m</div><div class="lede">exactly, by international definition — about 6,076 ft.</div>', 2);
    txt(root, 140, 990, 1600, 'credit', 'Equator to pole: 90° × 60′ = 5,400 nautical miles ≈ 10,000 km.');
  },
  go(step, { instant }){ const D = instant ? 0 : 1; gsap.to(this.zoom, { opacity:1, duration:.6*D }); gsap.to(this.one, { opacity: step >= 1 ? 1 : 0, duration:.6*D }); }
});
