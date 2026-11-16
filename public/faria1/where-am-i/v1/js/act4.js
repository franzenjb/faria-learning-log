/* ACT 4 — TWO WAYS TO CARRY HOME TIME */
const ACT4 = 'Carrying home time';

/* 9. Jupiter's moons — a clock in the sky */
Deck.add({ id:'jupiter', actName:ACT4, title:'A clock in the sky: Jupiter’s moons', min:1.75, steps:5,
  notes:{ script:`Two ways to carry home time. The first: read it off the sky. In 1610 Galileo turned his new telescope on Jupiter and found four moons. This is his own notebook page. [click] They circle Jupiter like hands on a clock. The innermost, Io, laps every 42 and a half hours. [click] Every lap, Io slips into Jupiter's shadow and blinks out — and everyone on Earth who is watching sees it at the same instant. It's a clock everybody can read. [click] So astronomers printed tables: "Io disappears at such-and-such a time in Paris." If you see it at 9:33 your local time and the table says 10:00 Paris time, you are 27 minutes — about 7 degrees — west of Paris. [click] On land, it worked beautifully. On a rolling ship, holding a long telescope steady on a tiny moon was nearly impossible.`,
    cues:['Galileo’s 1610 notebook; Jupiter and four moons.','The moons orbit; Io laps every 42.5 hours.','Io slips into Jupiter’s shadow: the same instant for everyone.','Two observers: local times differ by 27 min ≈ 7°.','Great on land; nearly impossible at sea.'] },
  build(root){
    photo(root, 'img/galileo_ms.jpg', 90, 120, 500, 715, undefined, 'Galileo’s notes on Jupiter’s moons, January 1610 (University of Michigan Library). Public domain, via Wikimedia Commons.', { bg:'#e9e1cf', fit:'contain' });
    txt(root, 680, 112, 1100, 'kicker', 'Carrying home time · 1 · The sky');
    txt(root, 676, 155, 1150, 'h2', 'A clock in the sky');
    const svg = fullSvg(root); const cx = this.cx = 1180, cy = this.cy = 430, R = this.R = 76; this.svg = svg;
    const df = defs(svg);
    const sh = s('linearGradient', { id:'jshadow', x1:0, x2:1, y1:0, y2:0 }, df);
    s('stop', { offset:'0%', 'stop-color':'#000', 'stop-opacity':.55 }, sh); s('stop', { offset:'100%', 'stop-color':'#000', 'stop-opacity':0 }, sh);
    this.shadow = s('rect', { x:cx, y:cy - R, width:720, height:2*R, fill:'url(#jshadow)' }, svg);
    s('text', { x:cx + 690, y:cy - R - 12, class:'label-dim', 'text-anchor':'end' }, svg, 'Jupiter’s shadow →');
    s('text', { x:cx - 540, y:cy - R - 12, class:'label-dim', 'text-anchor':'start' }, svg, '← sunlight');
    this.orbits = [ ['Io',178,1.769], ['Europa',266,3.551], ['Ganymede',392,7.155], ['Callisto',530,16.689] ];
    this.orbits.forEach(([n, a]) => s('ellipse', { cx, cy, rx:a, ry:a*.1, fill:'none', stroke:'rgba(154,171,194,.16)' }, svg));
    this.back = s('g', {}, svg);
    const jc = s('clipPath', { id:'jclip' }, df); s('circle', { cx, cy, r:R }, jc);
    const jg = s('g', { 'clip-path':'url(#jclip)' }, svg);
    s('circle', { cx, cy, r:R, fill:'#C9A77E' }, jg);
    [[-.55,.16,'#A27F5D'],[-.2,.14,'#E2CCAA'],[.12,.18,'#9C7652'],[.45,.12,'#D9C2A0']].forEach(([y, hh, c]) => s('rect', { x:cx - R, y:cy + y*R, width:2*R, height:hh*R, fill:c }, jg));
    const jsd = s('radialGradient', { id:'jsd', cx:'35%', cy:'40%', r:'70%' }, df); s('stop', { offset:'50%', 'stop-color':'#000', 'stop-opacity':0 }, jsd); s('stop', { offset:'100%', 'stop-color':'#000', 'stop-opacity':.6 }, jsd);
    s('circle', { cx, cy, r:R, fill:'url(#jsd)' }, jg);
    s('text', { x:cx, y:cy + R + 34, class:'label-dim', 'text-anchor':'middle' }, svg, 'Jupiter');
    this.front = s('g', {}, svg);
    this.moons = this.orbits.map(([n, a, p], k) => { const g = s('g', {}, this.front); s('circle', { r: k === 0 ? 10 : 8, fill: k === 0 ? C.gold2 : '#D7DEE8' }, g);
      const t = s('text', { y:-16, 'text-anchor':'middle', class:'label', fill: k === 0 ? C.gold2 : C.dim, style:'font-size:22px' + (k === 0 ? ';font-weight:600' : '') }, g, n); return { g, a, p, th: [2.2, 4.0, 1.0, 3.5][k], t }; });
    this.flash = s('text', { x:cx + 178, y:cy + 80, 'text-anchor':'middle', class:'label', fill:C.gold2, style:'font-size:30px;font-weight:700', opacity:0 }, svg, 'Eclipse!');
    this.drawMoons();
    const cap = (k, html, out) => txt(root, 680, 620, 1120, 'lede', html, k, { out });
    cap(0, '1610: Galileo turns a telescope on Jupiter and finds <em>four moons</em>.', 1);
    cap(1, 'They circle Jupiter like hands on a clock. Io, the innermost, laps every <em>42½ hours</em>.', 2);
    cap(2, 'Io slips into Jupiter’s shadow and blinks out. <em>Everyone watching on Earth sees it at the same instant.</em>', 3);
    cap(3, 'Tables gave the time of each eclipse in Paris. Compare it with your own local time:', 5);
    txt(root, 680, 760, 1120, '', `<div style="display:flex;gap:48px;align-items:flex-end">
      <div><div class="label-dim">Predicted, Paris time</div><div class="num" style="font:600 60px/1.2 var(--serif);color:var(--gold-2);white-space:nowrap">10:00 p.m.</div></div>
      <div><div class="label-dim">Seen at Brest, local time</div><div class="num" style="font:600 60px/1.2 var(--serif);color:#B2CBE2;white-space:nowrap">9:33 p.m.</div></div>
      <div class="lede" style="padding-bottom:10px;white-space:nowrap">27 min ≈ <em>7° west</em> of Paris</div></div>`, 3, { out:4 });
    txt(root, 680, 760, 1120, 'h2', 'Brilliant on land.<br><span class="coral" style="font-style:italic">Nearly impossible from a rolling deck.</span>', 4, { style:{ fontSize:'52px' } });
    txt(root, 680, 984, 1150, 'credit', 'Schematic, not to scale. Periods: Io 1.77 d (42.5 h), Europa 3.55 d, Ganymede 7.15 d, Callisto 16.7 d (NASA). Brest–Paris example: 6.8° of longitude ≈ 27 minutes of time (4 min per degree).');
  },
  drawMoons(){
    const { cx, cy, R } = this;
    for (const m of this.moons){
      const x = cx + m.a*Math.cos(m.th), y = cy + m.a*.1*Math.sin(m.th), far = Math.sin(m.th) < 0;
      const inShadow = Math.cos(m.th) > 0 && Math.abs(m.a*Math.sin(m.th)) < R*1.0;
      const hidden = far && Math.abs(x - cx) < R;
      m.g.setAttribute('transform', `translate(${x},${y})`);
      m.g.firstChild.style.opacity = hidden ? 0 : inShadow ? .06 : 1;
      m.t.style.opacity = hidden ? 0 : 1;
      (far ? this.back : this.front).appendChild(m.g);
    }
  },
  go(step, { instant }){
    const D = instant ? 0 : 1; this.run = step === 1 || step === 4;
    gsap.killTweensOf(this.moons);
    if (step === 2 || step === 3){ const io = this.moons[0];
      [2.4, 3.9, 5.6].forEach((th, j) => { const m = this.moons[j + 1]; if (instant) m.th = th; else gsap.to(m, { th: th + Math.round((m.th - th)/(2*Math.PI))*2*Math.PI, duration:1.6, ease:'power2.inOut', onUpdate:() => this.drawMoons() }); });
      if (instant || step === 3){ io.th = 0; this.drawMoons(); }
      else { io.th = -1.1; gsap.to(io, { th:0, duration:3.2, ease:'power2.out', onUpdate:() => this.drawMoons() }); }
      gsap.to(this.flash, { opacity:1, duration:.4*D, delay: step === 2 ? 2.2*D : 0 });
    } else gsap.to(this.flash, { opacity:0, duration:.3*D });
    this.drawMoons();
  },
  loop(t, dt){ if (!this.run) return; for (const m of this.moons) m.th += dt * (2*Math.PI / 6) * (1.769 / m.p); this.drawMoons(); }
});

/* 10. France shrinks */
Deck.add({ id:'france', actName:ACT4, title:'The king’s shrinking kingdom', min:1.25, steps:3,
  notes:{ script:`The sky clock worked on land — so France used it to remeasure itself. From 1679, the astronomers Jean Picard and Philippe de La Hire travelled the coasts timing Jupiter's moons. On the left is the map they produced: the old outline, and their corrected coastline inside it. [click] Watch the west coast. Brittany slides east — by about a degree and a half in places. France got smaller. [click] The story goes that Louis XIV complained his astronomers had taken more of France than his enemies ever had. It's a famous story; I can't promise he said it. But it tells you how much the maps were off.`,
    cues:['Old outline of France vs. the 1693 corrected map.','The west coast slides east: France shrinks.','The king’s complaint — told as a story.'] },
  build(root){
    txt(root, 90, 70, 1700, 'kicker', 'Carrying home time · the sky, on land');
    txt(root, 86, 112, 1700, 'h2', 'The king’s shrinking kingdom');
    photo(root, 'img/carte2.jpg', 90, 230, 720, 568, undefined, 'Carte de France corrigée par ordre du Roy sur les observations de MM. de l’Académie des sciences (1693): the old outline, with the corrected coast drawn in. Bibliothèque nationale de France. Public domain, via Wikimedia Commons.', { bg:'#efe8d6' });
    const svg = fullSvg(root);
    const F = window.FRANCE50, NB = window.EURNB;
    this.k = { v:1.12 };
    const proj = d3.geoConicConformal().parallels([44, 49]).rotate([-2.5, 0]).fitExtent([[1060, 230], [1800, 800]], F);
    this.path = d3.geoPath(proj); this.proj = proj;
    s('path', { d:this.path(NB), fill:'#13243B', stroke:'#2A4163', 'stroke-width':1 }, svg);
    const morph = (k) => ({ type:'MultiPolygon', coordinates: F.coordinates.map(poly => poly.map(ring => ring.map(([x, y]) => [8 - (8 - x)*k, y]))) });
    this.morph = morph;
    this.ghost = s('path', { d:this.path(morph(1.12)), fill:'none', stroke:C.coral, 'stroke-width':2.5, 'stroke-dasharray':'7 6', opacity:0 }, svg);
    this.live = s('path', { d:this.path(morph(1.12)), fill:'rgba(232,176,75,.22)', stroke:C.gold, 'stroke-width':2.5 }, svg);
    this.oldLab = s('text', { class:'label', fill:C.coral, 'text-anchor':'middle', opacity:0, style:'font-weight:600' }, svg, 'old maps');
    const a = proj([8 - (8 + 4.49)*1.12, 48.39]), b = proj([-4.49, 48.39]);
    this.oldLab.setAttribute('x', a[0] - 10); this.oldLab.setAttribute('y', a[1] - 40);
    this.newLab = s('text', { x:b[0] + 150, y:b[1] + 16, class:'label', fill:C.gold2, opacity:0, style:'font-weight:600' }, svg, 'corrected');
    this.arrow = s('g', { opacity:0 }, svg);
    s('line', { x1:a[0] + 6, y1:a[1] + 70, x2:b[0] - 6, y2:b[1] + 70, stroke:C.text, 'stroke-width':2 }, this.arrow);
    s('path', { d:`M${b[0] - 6},${b[1] + 70}l-12,-7v14z`, fill:C.text }, this.arrow);
    s('text', { x:(a[0] + b[0])/2, y:a[1] + 108, class:'label', 'text-anchor':'middle' }, this.arrow, 'about 1½° east');
    txt(root, 980, 860, 840, 'lede', 'From 1679, Picard and La Hire timed Jupiter’s moons along France’s coasts.', 0, { out:1 });
    txt(root, 980, 860, 840, 'lede', 'The west coast moved <em>east</em> — by about 1½° in places. France got smaller.', 1, { out:2 });
    txt(root, 980, 838, 860, 'lede', '<em>As the story goes,</em> Louis XIV complained that his astronomers had taken more of France than his enemies ever had.', 2);
    txt(root, 980, 990, 860, 'credit', 'A famous story, not a verified quotation. Animated outline is schematic: modern coastline, stretched westward to mimic the pre-1679 error.', 2);
  },
  go(step, { instant }){
    const D = instant ? 0 : 1;
    gsap.killTweensOf(this.k);
    const target = step >= 1 ? 1 : 1.12;
    gsap.to(this.k, { v:target, duration:(step === 1 ? 3.2 : .8)*D, ease:'power2.inOut', delay: step === 1 ? .4*D : 0, onUpdate:() => this.live.setAttribute('d', this.path(this.morph(this.k.v))) });
    if (instant) this.live.setAttribute('d', this.path(this.morph(target)));
    gsap.to(this.ghost, { opacity: step >= 1 ? 1 : 0, duration:.6*D });
    gsap.to(this.oldLab, { opacity: step >= 1 ? 1 : 0, duration:.6*D });
    gsap.to([this.arrow, this.newLab], { opacity: step >= 1 ? 1 : 0, duration:.6*D, delay: step === 1 ? 3*D : 0 });
  }
});

/* 11. At sea: the Moon, the Act, and a carpenter */
Deck.add({ id:'moonact', actName:ACT4, title:'At sea: the Moon — or a clock?', min:1.25, steps:4,
  notes:{ script:`At sea, astronomers tried using our own Moon as the clock hand. The Moon drifts across the stars by about its own width every hour. [click] Measure the angle between the Moon and a bright star, look it up in tables, and you can work out London time. In principle. In practice it meant hours of arithmetic, from a deck that will not hold still. [click] In 1714 Parliament passed the Longitude Act: up to twenty thousand pounds — a fortune — for a method that worked at sea, to within half a degree. [click] And a self-taught carpenter from Yorkshire, John Harrison, decided the answer wasn't in the sky at all. It was a clock.`,
    cues:['The Moon drifts across the stars.','Lunar distance: an angle, then hours of arithmetic on a rolling deck.','1714 Longitude Act: up to £20,000.','John Harrison, carpenter and clockmaker.'] },
  build(root){
    const svg = fullSvg(root); this.sky = s('g', {}, svg);
    const rnd = d3.randomLcg(11); for (let k = 0; k < 160; k++) s('circle', { cx:rnd()*1100, cy:rnd()*900 + 60, r:rnd()*1.3 + .3, fill:'#C9D6EA', opacity:rnd()*.5 + .12 }, this.sky);
    this.SX = 960; this.SY = 250;
    this.star = s('g', { transform:`translate(${this.SX},${this.SY})` }, this.sky); s('circle', { r:22, fill:'rgba(244,205,126,.12)' }, this.star); s('path', { d:starPath(12, 5), fill:C.gold2 }, this.star);
    s('text', { x:-26, y:-22, class:'label-dim', 'text-anchor':'end' }, this.star, 'a bright star');
    // the Moon's path: ghosts spaced exactly one diameter apart, one per hour
    this.MR = 62; const M0 = [640, 540], ang = -22*RAD, ux = Math.cos(ang), uy = Math.sin(ang); this.M0 = M0;
    s('line', { x1:M0[0] - ux*620, y1:M0[1] - uy*620, x2:M0[0] + ux*120, y2:M0[1] + uy*120, stroke:'rgba(233,228,216,.22)', 'stroke-width':2, 'stroke-dasharray':'2 9' }, this.sky);
    for (let j = 1; j <= 4; j++){ const gx = M0[0] - ux*2*this.MR*j, gy = M0[1] - uy*2*this.MR*j;
      s('circle', { cx:gx, cy:gy, r:this.MR, fill:'rgba(233,228,216,' + (0.07 - j*.012) + ')', stroke:'rgba(233,228,216,' + (0.5 - j*.09) + ')', 'stroke-width':1.5, 'stroke-dasharray':'4 6' }, this.sky);
      s('text', { x:gx, y:gy + this.MR + 36, 'text-anchor':'middle', class:'label-dim', style:'font-size:24px' }, this.sky, j === 1 ? '1 hour ago' : j + ' h'); }
    this.moon = s('g', { transform:`translate(${M0[0]},${M0[1]})` }, this.sky);
    s('circle', { r:this.MR + 26, fill:'rgba(233,228,216,.06)' }, this.moon);
    s('circle', { r:this.MR, fill:'#ECE7DB' }, this.moon); s('circle', { cx:-20, cy:-14, r:13, fill:'#D5CEBE' }, this.moon); s('circle', { cx:18, cy:20, r:17, fill:'#D8D1C1' }, this.moon); s('circle', { cx:22, cy:-24, r:7, fill:'#DAD3C4' }, this.moon);
    s('text', { x:M0[0] + this.MR + 22, y:M0[1] + 56, class:'label', fill:'#ECE7DB', style:'font-weight:600' }, this.sky, 'now');
    // one-width bracket
    { const a = [M0[0] - ux*2*this.MR, M0[1] - uy*2*this.MR], nx = uy, ny = -ux, off = this.MR + 22;
      const p1 = [a[0] + nx*off, a[1] + ny*off], p2 = [M0[0] + nx*off, M0[1] + ny*off];
      s('path', { d:`M${p1[0] - nx*8},${p1[1] - ny*8}L${p1[0]},${p1[1]}L${p2[0]},${p2[1]}L${p2[0] - nx*8},${p2[1] - ny*8}`, fill:'none', stroke:C.gold, 'stroke-width':2 }, this.sky);
      const mid = [(p1[0] + p2[0])/2 + nx*26, (p1[1] + p2[1])/2 + ny*26];
      s('text', { x:mid[0], y:mid[1], 'text-anchor':'middle', class:'label', fill:C.gold2, transform:`rotate(${-22} ${mid[0]} ${mid[1]})` }, this.sky, 'one Moon-width per hour'); }
    // the sea, and a ship that will not hold still
    this.sea = s('g', {}, svg);
    s('path', { d:'M0,930 C200,918 400,940 600,926 S1000,936 1200,928 S1600,934 1920,926 L1920,1080 L0,1080 Z', fill:'#040910' }, this.sea);
    this.ship = s('path', { d:SHIP, fill:'#1A2638', stroke:'#5E708A', 'stroke-width':.5, transform:'translate(250,924) scale(4.4)' }, this.sea);
    this.dist = s('path', { fill:'none', stroke:C.gold, 'stroke-width':2.5, opacity:0 }, this.sky);
    this.distLab = s('text', { class:'label', fill:C.gold2, opacity:0, style:'font-weight:600' }, this.sky, 'lunar distance');
    this.placeMoon();
    this.calc = s('g', { opacity:0 }, svg);
    const lines = ['42° 17′ 30″', '− 0° 31′ 12″', '+ 0° 14′ 05″', 'log sin 9.81442', 'log cos 9.62078', '= 41° 59′ 47″', '…'];
    lines.forEach((l, k) => s('text', { x:120, y:180 + k*44, class:'label-dim num', style:'font-size:26px;font-family:var(--serif);font-style:italic' }, this.calc, l));
    s('text', { x:120, y:140, class:'label-dim', style:'font-size:22px;letter-spacing:.08em;text-transform:uppercase' }, this.calc, 'Illustrative working');
    txt(root, 1180, 120, 660, 'kicker', 'Carrying home time · at sea');
    txt(root, 1176, 165, 680, 'h2', 'At sea: the Moon — or a clock?');
    txt(root, 1180, 330, 640, 'lede', 'The Moon drifts across the stars by about <em>its own width every hour</em> — a clock hand in the sky.', 0, { out:2 });
    txt(root, 1180, 520, 640, 'lede', 'Measure its angle to a star, then work out London time. <span class="coral" style="font-style:italic">Hours of arithmetic, on a rolling deck.</span>', 1, { out:2 });
    this.prize = txt(root, 1180, 330, 660, '', `<div class="label-dim" style="font-size:26px">1714 · Parliament’s Longitude Act</div><div class="num" style="font:600 128px/1.05 var(--serif);color:var(--gold-2)">£<span id="pz">20,000</span></div><div class="lede">for a way to find longitude at sea to within <em>half a degree</em>.</div>`, 2, { out:3 });
    photo(root, 'img/harrison.jpg', 170, 120, 640, 797, 3, 'John Harrison, portrait by Thomas King, c. 1767. Science Museum, London. Public domain, via Wikimedia Commons.');
    txt(root, 1180, 330, 660, 'h2', 'John Harrison<br><span style="font-size:36px;color:var(--dim);font-weight:400">1693 – 1776</span>', 3);
    txt(root, 1180, 520, 640, 'lede', 'A Yorkshire carpenter, <em>self-taught</em> in clockmaking. His answer to the sky: a clock that could survive the sea.', 3);
    this.cover = h('div', { class:'bs', 'data-in':3, style:{ position:'absolute', left:0, top:0, width:'1130px', height:'1080px', background:'#081222' } }, root);
    root.insertBefore(this.cover, root.querySelector('.photo'));
    this.pz = this.prize.querySelector('#pz');
  },
  placeMoon(){ const [mx, my] = this.M0, sx = this.SX, sy = this.SY, L = Math.hypot(sx - mx, sy - my), ux = (sx - mx)/L, uy = (sy - my)/L;
    this.dist.setAttribute('d', `M${mx + ux*(this.MR + 8)},${my + uy*(this.MR + 8)}L${sx - ux*26},${sy - uy*26}`);
    this.distLab.setAttribute('x', (mx + sx)/2 + 30); this.distLab.setAttribute('y', (my + sy)/2 + 40); },
  go(step, { instant }){
    const D = instant ? 0 : 1;
    gsap.to([this.dist, this.distLab], { opacity: step === 1 ? 1 : 0, duration:.6*D });
    gsap.to(this.calc, { opacity: step === 1 ? 1 : 0, duration:.8*D });
    gsap.to(this.sky, { opacity: step >= 2 ? .25 : 1, duration:.8*D });
    this.rock = step === 1;
    if (!this.rock){ this.sky.setAttribute('transform', ''); this.ship.setAttribute('transform', 'translate(250,924) scale(4.4)'); }
    gsap.to(this.sea, { opacity: step >= 2 ? .25 : 1, duration:.8*D });
    if (step === 2){ const o = { v:0 }; gsap.fromTo(o, { v:0 }, { v:20000, duration:1.8*D, ease:'power2.out', onUpdate:() => this.pz.textContent = Math.round(o.v/250)*250 > 0 ? (Math.round(o.v/250)*250).toLocaleString('en-US') : '0' }); if (instant) this.pz.textContent = '20,000'; }
  },
  loop(t, dt){ if (this.rock){ this.ship.setAttribute('transform', `translate(250,${924 + Math.sin(t*1.3 + 1)*4}) rotate(${Math.sin(t*1.3)*7}) scale(4.4)`); const a = Math.sin(t*1.3)*3.2, y = Math.sin(t*1.3 + 1)*10; this.sky.setAttribute('transform', `rotate(${a} 560 540) translate(0 ${y})`); } }
});

/* 12. H4 — the vote */
Deck.add({ id:'h4', actName:ACT4, title:'H4 — and the vote', min:1.75, steps:5,
  notes:{ script:`This is H4, Harrison's sea watch — about five inches across. It ticks five times a second. In November 1761 his son William sailed with it from Portsmouth to Jamaica: 81 days at sea. [click] So — vote. In the chat, or a show of hands: how much time do you think it lost in 81 days? (Use the tiny + buttons to tally chat votes if you like.) [click] About five seconds. Five seconds in 81 days. [click] The Earth turns fifteen arc-seconds every second, so five seconds of time is about one and a quarter arc-minutes of longitude — roughly a mile on the water. The prize needed half a degree, thirty arc-minutes. H4 beat it by more than twenty times. [click] And the punchline you'd expect: the Board of Longitude never handed over the £20,000. Harrison was paid in pieces — £10,000 in 1765 and, after King George III took his side, £8,750 from Parliament in 1773, when he was 80. About £18,750 toward the prize. No one ever collected the full award.`,
    cues:['H4 sails to Jamaica, 81 days.','THE VOTE: how much did it lose? (no answer shown)','Reveal: about 5 seconds.','5 s → 1¼′ of longitude ≈ a mile, vs. the 30′ allowed.','The money: £18,750 in pieces; full prize never paid.'] },
  build(root){
    photo(root, 'img/h4.jpg', 90, 120, 600, 757, undefined, 'H4, completed 1759. National Maritime Museum, Greenwich. Photo: Colonel Warden, CC BY-SA 3.0, via Wikimedia Commons.');
    this.tick = h('div', { style:{ position:'absolute', left:'110px', top:'140px', font:'600 20px var(--sans)', color:'var(--gold-2)', letterSpacing:'.08em', background:'rgba(6,12,23,.72)', padding:'8px 12px', borderRadius:'4px' } }, root, '<span id="tk" style="display:inline-block;width:12px;height:12px;border-radius:50%;background:var(--gold);margin-right:10px;vertical-align:0"></span>ticks 5 times a second');
    this.tk = this.tick.querySelector('#tk');
    txt(root, 800, 120, 1040, 'kicker', 'Carrying home time · 2 · The clock');
    txt(root, 796, 165, 1060, 'h2', 'Harrison’s sea watch, H4');
    // voyage strip
    const svg = fullSvg(root); this.voy = s('g', {}, svg);
    s('line', { x1:820, x2:1780, y1:360, y2:360, stroke:'rgba(154,171,194,.35)', 'stroke-width':2, 'stroke-dasharray':'3 8' }, this.voy);
    s('text', { x:820, y:330, class:'label' }, this.voy, 'Portsmouth'); s('text', { x:1780, y:330, class:'label', 'text-anchor':'end' }, this.voy, 'Jamaica');
    s('text', { x:1300, y:404, class:'label-dim', 'text-anchor':'middle' }, this.voy, 'Nov 1761 → Jan 1762 · 81 days at sea');
    this.ship = s('path', { d:SHIP, fill:C.text, transform:'translate(820,350) scale(1.3)' }, this.voy);
    txt(root, 800, 450, 1000, 'lede', 'Harrison’s son William carries H4 across the Atlantic.', 0, { out:1 });
    txt(root, 800, 450, 1040, 'h2', 'How much time did H4 lose in 81 days?', 1, { out:3, style:{ fontSize:'52px' } });
    const opts = ['About 10 minutes', 'About 1 hour', 'About 5 seconds', 'About 1 minute'];
    this.cards = opts.map((o, k) => {
      const x = 800 + (k % 2)*520, y = 560 + Math.floor(k/2)*170;
      const c = h('div', { class:'b', 'data-in':1, 'data-out':3, style:{ position:'absolute', left:x+'px', top:y+'px', width:'490px', height:'140px', border:'1.5px solid rgba(154,171,194,.35)', borderRadius:'8px', background:'rgba(255,255,255,.025)', transition:'all .8s' } }, root,
        `<div style="position:absolute;left:24px;top:22px;font:600 22px var(--sans);color:var(--dim);letter-spacing:.12em">${'ABCD'[k]}</div><div style="position:absolute;left:24px;top:56px;font:600 46px var(--serif);color:var(--text)">${o}</div>`);
      const t = h('div', { class:'ctl', style:{ right:'12px', top:'12px' } }, c); const cnt = h('span', { class:'tally-n', style:{ font:'600 15px var(--sans)', color:'var(--dim)', marginRight:'6px' } }, t, '');
      const btn = h('button', { class:'tally', title:'tally a vote' }, t, '+'); let n = 0;
      btn.addEventListener('click', e => { e.stopPropagation(); n++; cnt.textContent = n; btn.blur(); });
      return c;
    });
    this.answer = this.cards[2];
    this.bars = txt(root, 800, 330, 1040, '', `
      <div class="lede" style="margin-bottom:26px">5 seconds of time = <em>1¼ arc-minutes of longitude</em> — about a mile on the water.</div>
      <svg width="1040" height="190" viewBox="0 0 1040 190" style="overflow:visible">
        <rect x="0" y="42" width="1000" height="34" fill="rgba(219,107,95,.35)"/><text x="0" y="26" class="label-dim" style="font-size:24px">Needed for the prize: within ½° = 30 arc-minutes</text>
        <rect x="0" y="122" width="42" height="34" fill="${C.gold}"/><text x="56" y="148" class="label" style="font-size:26px;fill:#F4CD7E;font-weight:600">H4 in Jamaica: 1¼ arc-minutes</text>
      </svg>`, 3);
    this.money = txt(root, 800, 720, 1040, '', `
      <svg width="1040" height="110" viewBox="0 0 1040 110">
        <rect x="0.75" y="8" width="1000" height="40" fill="none" stroke="rgba(236,241,247,.5)" stroke-width="1.5" stroke-dasharray="5 5"/>
        <rect x="0" y="8" width="500" height="40" fill="rgba(232,176,75,.75)"/><rect x="503" y="8" width="434" height="40" fill="rgba(232,176,75,.45)"/>
        <text x="14" y="37" style="font:700 24px var(--sans);fill:#0A1527">£10,000 · 1765</text><text x="517" y="37" style="font:700 24px var(--sans);fill:#0A1527">£8,750 · 1773</text>
        <text x="1000" y="86" text-anchor="end" style="font:500 24px var(--sans);fill:#9AABC2">£20,000 prize, never awarded in full</text>
      </svg>
      <div class="lede" style="margin-top:6px">Paid in pieces — <em>£18,750</em> — at last in 1773, when Harrison was <em>80</em>.</div>`, 4);
  },
  go(step, { instant }){
    const D = instant ? 0 : 1;
    gsap.to(this.voy, { opacity: step === 0 ? 1 : 0, duration:.6*D });
    if (step === 0){ gsap.fromTo(this.ship, { attr:{ transform:'translate(820,350) scale(1.3)' } }, { attr:{ transform:'translate(1760,350) scale(1.3)' }, duration:4.5*D, ease:'power1.inOut' }); }
    this.cards.forEach(c => { const ans = c === this.answer, rev = step >= 2;
      c.style.borderColor = rev && ans ? 'var(--gold)' : 'rgba(154,171,194,.35)'; c.style.background = rev && ans ? 'rgba(232,176,75,.14)' : 'rgba(255,255,255,.025)';
      c.style.opacity = c.classList.contains('on') ? (rev && !ans ? .22 : 1) : 0; });
  },
  loop(t){ const ph = (t*5) % 1; this.tk.style.opacity = ph < .35 ? 1 : .25; }
});
