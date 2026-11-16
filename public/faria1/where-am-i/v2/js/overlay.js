/* overlay.js — spatial typography (headline + one line), world-anchored labels, floating archival plates, small figures */
const Overlay = (() => {
  const $ = id => document.getElementById(id);
  let cur = { h: null, l: null, el: null }, labs = [], plateEl = null, plateKey = null, figEl = null, figKey = null, kick = null;
  const TP = { l: 'tp-l', c: 'tp-c', r: 'tp-r', bl: 'tp-bl', tl: 'tp-tl', br: 'tp-br', b: 'tp-b', tr: 'tp-tr', cl: 'tp-cl' };
  function el(tag, cls, html, parent){ const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; }
  function fadeOut(e, ms = 900){ if (!e) return; e.classList.remove('in'); e.classList.add('out'); setTimeout(() => e.remove(), ms); }
  function show(b, instant){
    const root = $('type'); const sk = window.__capSkip || 0; const D = x => Math.max(20, (x - sk) * 1000);
    const key = (b.h || '') + '|' + (b.l || '') + '|' + (b.tpos || 'l');
    if (key !== cur.key){
      fadeOut(cur.el, 1000);
      cur = { key, el: null };
      if (b.h || b.l){
        const box = el('div', 'tbox ' + (TP[b.tpos || 'l'] || 'tp-l') + (b.tcls ? ' ' + b.tcls : ''), null, root);
        if (b.kick) el('div', 'kick', b.kick, box);
        if (b.h) el('div', 'h' + (b.hs ? ' hs' + b.hs : ''), b.h, box);
        if (b.l) el('div', 'l', b.l, box);
        if (b.cred) el('div', 'cred', b.cred, box);
        cur.el = box;
        const d = instant ? 0 : (b.tdelay != null ? b.tdelay : 1.1);
        if (instant) box.classList.add('noanim');
        setTimeout(() => box.classList.add('in'), instant ? 20 : D(d));
      }
    }
    // labels
    const want = (b.labels || []).map(L => Object.assign({ key: (L.t || '') + '@' + (typeof L.a === 'string' ? L.a : L.id || '') }, L));
    const keep = [];
    labs.forEach(L => { if (want.find(w => w.key === L.key)) keep.push(L); else { fadeOut(L.e, 900); } });
    labs = keep;
    want.forEach(w => { if (labs.find(L => L.key === w.key)) return;
      const e = el('div', 'lab ' + (w.cls || '') + ' side-' + (w.side || 'r'), `<i></i><span>${w.t}</span>`, $('labels'));
      const L = Object.assign(w, { e }); labs.push(L);
      setTimeout(() => e.classList.add('in'), instant ? 20 : D(w.d != null ? w.d : (b.ldelay != null ? b.ldelay : 1.6))); });
    // archival plate
    const pk = b.plate ? b.plate.src : null;
    if (pk !== plateKey){ fadeOut(plateEl, 1200); plateEl = null; plateKey = pk;
      if (b.plate){ const p = b.plate; const f = el('figure', 'plate side-' + (p.side || 'r') + (p.cls ? ' ' + p.cls : ''), `<img src="${p.src}" alt=""><figcaption>${p.cap || ''}</figcaption>`, $('figs'));
        if (p.h) f.style.setProperty('--ph', p.h); plateEl = f; setTimeout(() => f.classList.add('in'), instant ? 20 : D(p.d != null ? p.d : 1.2)); } }
    // figure (small data graphic / diagram)
    const fk = b.fig ? b.id + ':' + b.fig.length : null;
    const same = b.fig && figEl && figEl._html === b.fig;
    if (!same){ fadeOut(figEl, 900); figEl = null; figKey = fk;
      if (b.fig){ const f = el('div', 'fig ' + (b.figpos || 'fp-r'), b.fig, $('figs')); f._html = b.fig; figEl = f; setTimeout(() => f.classList.add('in'), instant ? 20 : D(b.figd != null ? b.figd : 1.4)); } }
  }
  const v = new THREE.Vector3();
  function frame(env){
    if (!env || !env.cam) return;
    const cam = env.cam, w = innerWidth, h = innerHeight;
    for (const L of labs){
      const fn = typeof L.a === 'function' ? L.a : (env.anchor && env.anchor[L.a]);
      const r = fn ? fn(L) : null; if (!r){ L.e.style.visibility = 'hidden'; continue; }
      const p = r.isVector3 ? r : r.p; const vis = r.isVector3 ? 1 : (r.vis == null ? 1 : r.vis);
      v.copy(p).project(cam);
      if (v.z > 1 || v.z < -1 || vis <= 0.01){ L.e.style.visibility = 'hidden'; continue; }
      L.e.style.visibility = 'visible';
      if (L.tf){ const tx = L.tf(); if (tx !== L._tx){ L._tx = tx; L.e.querySelector('span').innerHTML = tx; } }
      const x = (v.x * .5 + .5) * w, y = (-v.y * .5 + .5) * h;
      L.e.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`; L.e.style.setProperty('--lv', vis.toFixed(3));
    }
  }
  return { show, frame };
})();
