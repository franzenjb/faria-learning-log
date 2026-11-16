/* Shared helpers: palette, SVG builders, orthographic globe */
const W = 1920, H = 1080, RAD = Math.PI / 180;
const C = {
  ink:'#060C17', ocean:'#0D1E36', ocean2:'#13294A', land:'#1D3352', land2:'#24406A', landStroke:'#3E5C82',
  grat:'rgba(150,180,215,.15)', gold:'#E8B04B', gold2:'#F4CD7E', text:'#ECF1F7', dim:'#9AABC2', faint:'#5E708A',
  steel:'#7FA7C9', coral:'#DB6B5F', sea:'#73B7A6', night:'rgba(2,6,14,.62)'
};
const LAND110 = topojson.feature(window.LAND110, window.LAND110.objects.land);
let _land50 = null;
function land50(){ return _land50 || (_land50 = topojson.feature(window.LAND50, window.LAND50.objects.land)); }

function h(tag, attrs = {}, parent, html){
  const e = document.createElement(tag);
  for (const k in attrs){ if (k === 'style' && typeof attrs[k] === 'object') Object.assign(e.style, attrs[k]); else e.setAttribute(k, attrs[k]); }
  if (html !== undefined) e.innerHTML = html;
  if (parent) parent.appendChild(e);
  return e;
}
function s(tag, attrs = {}, parent, text){
  const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (text !== undefined) e.textContent = text;
  if (parent) parent.appendChild(e);
  return e;
}
/* positioned HTML text block */
function txt(parent, x, y, w, cls, html, step, extra = {}){
  const a = Object.assign({ class: cls + (step !== undefined ? ' b' : ''), style: Object.assign({ position:'absolute', left:x+'px', top:y+'px', width: w ? w+'px' : 'auto' }, extra.style || {}) }, extra.attrs || {});
  if (step !== undefined) a['data-in'] = step;
  if (extra.out !== undefined) a['data-out'] = extra.out;
  return h('div', a, parent, html);
}
function fullSvg(parent){ return s('svg', { class:'full', viewBox:'0 0 1920 1080', width:1920, height:1080 }, parent); }
function photo(parent, src, x, y, w, hgt, step, credit, opts = {}){
  const d = h('div', { class:'photo' + (step !== undefined ? ' b' : ''), style:{ left:x+'px', top:y+'px', width:w+'px', height:hgt+'px' } }, parent);
  if (step !== undefined) d.setAttribute('data-in', step);
  if (opts.out !== undefined) d.setAttribute('data-out', opts.out);
  const img = h('img', { src, alt: opts.alt || '' , class: opts.kb ? 'kb' : '' }, d);
  if (opts.fit) img.style.objectFit = opts.fit;
  if (opts.pos) img.style.objectPosition = opts.pos;
  if (opts.bg) d.style.background = opts.bg;
  if (credit){
    const c = h('div', { class:'credit' + (step !== undefined ? ' b' : ''), style:{ left:x+'px', top:(y+hgt+10)+'px', width:w+'px' } }, parent, credit);
    if (step !== undefined) c.setAttribute('data-in', step);
    if (opts.out !== undefined) c.setAttribute('data-out', opts.out);
  }
  return d;
}
function defs(svg){ return svg.querySelector('defs') || s('defs', {}, svg); }
let _uid = 0; const uid = p => (p || 'u') + (++_uid);

function glowFilter(svg, id, std = 6, color = C.gold){
  const f = s('filter', { id, x:'-50%', y:'-50%', width:'200%', height:'200%' }, defs(svg));
  s('feGaussianBlur', { stdDeviation: std, result:'b' }, f);
  const m = s('feMerge', {}, f); s('feMergeNode', { in:'b' }, m); s('feMergeNode', { in:'SourceGraphic' }, m);
  return `url(#${id})`;
}
/* A small ship glyph pointing right (east), ~26px long */
const SHIP = 'M-13,3 L13,3 L9,8 L-10,8 Z M-1,2 L-1,-15 L10,0 Z M-3,2 L-3,-11 L-12,0 Z';
/* 5-point star */
function starPath(r, r2 = r * .45){ let d = ''; for (let i = 0; i < 10; i++){ const a = -Math.PI/2 + i*Math.PI/5, rr = i % 2 ? r2 : r; d += (i ? 'L' : 'M') + (rr*Math.cos(a)).toFixed(2) + ',' + (rr*Math.sin(a)).toFixed(2); } return d + 'Z'; }
function arcPath(cx, cy, r, a0, a1){ // angles in radians, screen coords (y down), sweep from a0 to a1
  const x0 = cx + r*Math.cos(a0), y0 = cy + r*Math.sin(a0), x1 = cx + r*Math.cos(a1), y1 = cy + r*Math.sin(a1);
  const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0, sweep = a1 > a0 ? 1 : 0;
  return `M${x0},${y0} A${r},${r} 0 ${large} ${sweep} ${x1},${y1}`;
}
function fmtLat(v, d = 1){ return Math.abs(v).toFixed(d) + '° ' + (v >= 0 ? 'N' : 'S'); }
function fmtLon(v, d = 1){ v = ((v + 540) % 360) - 180; return Math.abs(v).toFixed(d) + '° ' + (v >= 0 ? 'E' : 'W'); }

/* Orthographic globe with ocean, graticule, land, overlays, limb shading and markers */
class Globe {
  constructor(svg, o){
    this.o = Object.assign({ cx:960, cy:540, r:400, lon:0, lat:0, roll:0, land:LAND110, grat:15, shade:true, glow:true, landFill:C.land, landStroke:C.landStroke, oceanTop:C.ocean2, oceanEdge:C.ocean }, o);
    this.svg = svg; const id = this.id = uid('g');
    const df = defs(svg);
    const og = s('radialGradient', { id:id+'oc', cx:'38%', cy:'32%', r:'75%' }, df);
    s('stop', { offset:'0%', 'stop-color':this.o.oceanTop }, og); s('stop', { offset:'100%', 'stop-color':this.o.oceanEdge }, og);
    const sg = s('radialGradient', { id:id+'sh', cx:'40%', cy:'34%', r:'70%' }, df);
    s('stop', { offset:'0%', 'stop-color':'#fff', 'stop-opacity':.07 }, sg);
    s('stop', { offset:'62%', 'stop-color':'#000', 'stop-opacity':0 }, sg);
    s('stop', { offset:'100%', 'stop-color':'#000', 'stop-opacity':.5 }, sg);
    this.st = { lon:this.o.lon, lat:this.o.lat, roll:this.o.roll, r:this.o.r, cx:this.o.cx, cy:this.o.cy };
    this.proj = d3.geoOrthographic().clipAngle(90).precision(0.4);
    this.path = d3.geoPath(this.proj);
    this.root = s('g', { id }, svg);
    if (this.o.glow){
      const gf = s('filter', { id:id+'gl', x:'-30%', y:'-30%', width:'160%', height:'160%' }, df);
      s('feGaussianBlur', { stdDeviation: 18 }, gf);
      this.halo = s('circle', { fill:'none', stroke:'rgba(110,150,200,.28)', 'stroke-width':18, filter:`url(#${id}gl)` }, this.root);
    }
    this.sphere = s('path', { fill:`url(#${id}oc)` }, this.root);
    this.gratEl = s('path', { fill:'none', stroke:C.grat, 'stroke-width':1 }, this.root);
    this.gratData = d3.geoGraticule().step([this.o.grat, this.o.grat]).extentMinor([[-180,-80.0001],[180,80.0001]])();
    this.landEl = s('path', { fill:this.o.landFill, stroke:this.o.landStroke, 'stroke-width':.7, 'stroke-linejoin':'round' }, this.root);
    this.under = s('g', {}, this.root);   // overlays under shading
    this.shadeEl = s('path', { fill:`url(#${id}sh)`, 'pointer-events':'none' }, this.root);
    if (!this.o.shade) this.shadeEl.style.display = 'none';
    this.over = s('g', {}, this.root);    // overlays above shading
    this.pts = s('g', {}, this.root);     // point markers
    this.items = []; this.points = []; this.hooks = [];
    this.render();
  }
  center(){ return [-this.st.lon, -this.st.lat].map((v,i)=> i ? -this.st.lat : this.st.lon); }
  apply(){ this.proj.translate([this.st.cx, this.st.cy]).scale(this.st.r).rotate([-this.st.lon, -this.st.lat, this.st.roll]); }
  render(){
    this.apply(); const p = this.path, S = { type:'Sphere' };
    this.sphere.setAttribute('d', p(S)); this.shadeEl.setAttribute('d', p(S));
    if (this.halo){ this.halo.setAttribute('cx', this.st.cx); this.halo.setAttribute('cy', this.st.cy); this.halo.setAttribute('r', this.st.r + 4); }
    this.gratEl.setAttribute('d', p(this.gratData) || '');
    this.landEl.setAttribute('d', p(this.o.land) || '');
    for (const it of this.items){ const d = typeof it.datum === 'function' ? it.datum() : it.datum; it.el.setAttribute('d', p(d) || ''); }
    const c = [this.st.lon, this.st.lat];
    for (const pt of this.points){
      const ll = typeof pt.ll === 'function' ? pt.ll() : pt.ll;
      const vis = d3.geoDistance(ll, c) < Math.PI/2 - 0.02;
      const xy = this.proj(ll);
      pt.el.setAttribute('transform', `translate(${xy[0].toFixed(1)},${xy[1].toFixed(1)})`);
      pt.el.style.visibility = vis ? 'visible' : 'hidden';
    }
    for (const f of this.hooks) f(this);
  }
  geo(datum, attrs = {}, layer = 'under'){ const el = s('path', Object.assign({ fill:'none' }, attrs), this[layer]); this.items.push({ datum, el }); el.setAttribute('d', this.path(typeof datum === 'function' ? datum() : datum) || ''); return el; }
  point(ll, build){ const el = s('g', {}, this.pts); if (build) build(el); this.points.push({ ll, el }); this.render(); return el; }
  to(vars, dur = 1.6, ease = 'power2.inOut', instant){
    gsap.killTweensOf(this.st);
    if (instant || dur === 0){ Object.assign(this.st, vars); this.render(); return null; }
    return gsap.to(this.st, Object.assign({ duration:dur, ease, onUpdate:() => this.render() }, vars));
  }
  setLand(f){ this.o.land = f; this.render(); }
}
/* parallel / meridian line features */
const parallel = lat => ({ type:'LineString', coordinates: d3.range(-180, 181, 2).map(l => [l, lat]) });
const meridian = lon => ({ type:'LineString', coordinates: d3.range(-90, 91, 2).map(l => [lon, l]) });
const meridianN = lon => ({ type:'LineString', coordinates: d3.range(0, 91, 2).map(l => [lon, l]) });
