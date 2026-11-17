/* slides.js — v3: calm, traditional slides between the cinematic moments.
   A slide beat has env 'slide' (an empty, near-black WebGL scene) and b.slide = { lay, img, fit, pos, cap, kick, h, lines[], fig, figw, trio[] }.
   Layouts: 'half-l' / 'half-r' (image fills one half), 'full' (full-bleed image + soft scrim), 'text', 'split' (text left, figure right), 'fig' (headline, figure below), 'trio'. */
(function(){
const W = World, TF = W.TRANS_SCALE || .58;
/* the slide environment: nothing to render, just the dark paper colour, so crossfades to and from the 3D world stay clean */
const sl = W.env('slide', { clear: 0x0b0d10 });
sl.scene = new THREE.Scene(); sl.cam = new THREE.PerspectiveCamera(40, 16 / 9, .1, 10);
sl.bloom = () => [0, 0, 1]; sl.grade = () => ({ expo: 1, sat: 1, con: 1 }); sl.vig = () => 0; sl.aper = () => 0;
let cur = null, curKey = null;
const el = (tag, cls, html, parent) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; };
function build(s){
  const d = el('div', 'sl lay-' + (s.lay || 'text') + (s.cls ? ' ' + s.cls : ''));
  if (s.img && s.lay !== 'trio'){ const f = el('figure', 'sl-img' + (s.fit === 'contain' ? ' contain' : ''), null, d);
    const im = el('img', null, null, f); im.src = s.img; im.alt = ''; if (s.pos) im.style.objectPosition = s.pos;
    if (s.cap) el('figcaption', null, s.cap, f); }
  if (s.lay === 'full') el('div', 'sl-scrim' + (s.scrim ? ' ' + s.scrim : ''), null, d);
  const t = el('div', 'sl-txt', null, d);
  if (s.kick) el('div', 'sk', s.kick, t);
  if (s.h) el('h2', s.hs ? 'hs' + s.hs : '', s.h, t);
  (s.lines || []).forEach(x => el('p', null, x, t));
  if (s.fig){ const g = el('div', 'sl-fig', s.fig, s.lay === 'split' || s.lay === 'fig' || s.lay === 'map' ? d : t); if (s.figw) g.style.width = `calc(var(--u)*${s.figw})`; }
  if (s.lay === 'trio'){ const r = el('div', 'sl-trio', null, d);
    s.trio.forEach(([src, c]) => { const f = el('figure', null, `<img src="${src}" alt=""><figcaption>${c}</figcaption>`, r); });
    if (s.cap) el('div', 'sl-cred', s.cap, d); }
  if (s.lay !== 'trio' && s.lay !== 'half-l' && s.lay !== 'half-r' && s.lay !== 'full' && s.cap && !s.img) el('div', 'sl-cred', s.cap, d);
  return d; }
function show(b, instant){
  const root = document.getElementById('slides'); if (!root) return;
  const key = b.slide ? b.id : null;
  if (key === curKey) return;
  if (cur){ const o = cur; o.classList.remove('in'); o.classList.add('out'); setTimeout(() => o.remove(), 900 * TF + 60); }
  cur = null; curKey = key;
  if (!b.slide) return;
  const d = build(b.slide); root.appendChild(d); cur = d;
  if (instant) d.classList.add('noanim');
  const sk = window.__capSkip || 0;
  setTimeout(() => d.classList.add('in'), instant ? 20 : Math.max(20, ((b.slide.d != null ? b.slide.d : .15) - sk) * 1000));
}
const o0 = Overlay.show; Overlay.show = (b, instant) => { o0(b, instant); show(b, instant); };
window.Slides = { show };
})();
