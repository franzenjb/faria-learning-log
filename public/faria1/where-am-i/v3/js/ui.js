/* ui.js — keys, tiny controls, notes drawer, presenter window, overview path, help, reduced motion, optional sound */
const UI = (() => {
  const $ = id => document.getElementById(id);
  const W = World;
  const mainBeats = () => W.beats.filter(b => !b.appendix);
  function fmtMin(m){ const s = Math.round(m * 60); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  function cum(k){ let t = 0; for (let i = 0; i <= k && i < W.beats.length; i++) if (!W.beats[i].appendix) t += W.beats[i].min || 0; return t; }
  function total(){ return mainBeats().reduce((a, b) => a + (b.min || 0), 0); }
  const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  function scriptFor(b){ const n = window.NOTES && NOTES[b.sec]; if (!n) return { seg: b.say || '', full: '' };
    const parts = n.script.split(/\s*\[click\]\s*/); const seg = b.say || parts[Math.min(b.seg || 0, parts.length - 1)] || '';
    const full = parts.map((p, i) => i === (b.seg || 0) && !b.say ? `<mark>${p}</mark>` : p).join(' <span class="clk">▸</span> ');
    return { seg, full: b.say ? `<mark>${b.say}</mark>` : full }; }
  function state(){ const b = W.beats[W.k] || {}, nx = W.beats[W.k + 1];
    const sc = scriptFor(b);
    return { type: 'state', k: W.k, n: mainBeats().length, id: b.id, title: b.title, act: b.act, min: b.min, cum: cum(W.k), total: total(), seg: sc.seg, full: sc.full,
      cue: b.cue || '', notes: b.notes || '', next: nx ? (nx.cue || nx.title) : '(end)', nextTitle: nx ? nx.title : '', appendix: !!b.appendix, started: W.started }; }
  function init(){
    addEventListener('keydown', key, true);
    document.addEventListener('click', e => { if (e.target.closest('#ui, #notes, #overview, #help, button, a, input')) return; if (e.button === 0) W.next(); });
    addEventListener('message', e => { const m = e.data || {}; if (m.type === 'key') key({ key: m.key, preventDefault(){}, stopPropagation(){} }); if (m.type === 'hello') broadcast(); });
    const ui = $('ui');
    ui.innerHTML = `<span id="cnt"></span><button id="b-rm" title="Reduced motion (M)" aria-label="Reduced motion">${svgRM}</button><button id="b-snd" title="Sound (S) — off by default" aria-label="Sound">${svgSnd(false)}</button><button id="b-help" title="Help (H)" aria-label="Help">?</button>`;
    $('b-rm').onclick = e => { e.stopPropagation(); setRM(!W.reduced); };
    $('b-snd').onclick = e => { e.stopPropagation(); Sound.toggle(); };
    $('b-help').onclick = e => { e.stopPropagation(); toggle('help'); };
    $('help').innerHTML = `<h4>Longitude · keys</h4><table>
      <tr><td>→ · Space · click</td><td>next beat</td></tr><tr><td>←</td><td>back one beat</td></tr>
      <tr><td>N</td><td>speaker notes (this window)</td></tr><tr><td>P</td><td>presenter window: script, timer, next cue</td></tr>
      <tr><td>G</td><td>overview: the beats as a path</td></tr><tr><td>F</td><td>full screen</td></tr><tr><td>B</td><td>blank (black)</td></tr>
      <tr><td>M</td><td>reduced motion: crossfades instead of flights</td></tr>
      <tr><td>S</td><td>sound on/off (off by default)</td></tr><tr><td>Home · End</td><td>first · last beat</td></tr><tr><td>H · Esc</td><td>this help · close</td></tr></table>`;
    buildOverview(); setRM(W.reduced, true);
  }
  const svgRM = `<svg viewBox="0 0 16 16" width="12" height="12"><path d="M2 8h12M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>`;
  const svgSnd = on => `<svg viewBox="0 0 16 16" width="12" height="12"><path d="M3 6h2.5L9 3v10L5.5 10H3z" fill="currentColor"/>${on ? '<path d="M11 5.5c1 1.4 1 3.6 0 5M12.6 4c1.8 2.3 1.8 5.7 0 8" fill="none" stroke="currentColor" stroke-width="1.2"/>' : '<path d="M11 6l4 4M15 6l-4 4" stroke="currentColor" stroke-width="1.2"/>'}</svg>`;
  function setRM(on, quiet){ W.reduced = on; document.body.classList.toggle('rm', on); try { if (!quiet) localStorage.setItem('whereami2_rm', on ? '1' : '0'); } catch (e){}
    const b = $('b-rm'); if (b){ b.classList.toggle('on', on); b.title = on ? 'Reduced motion is ON (M)' : 'Reduced motion (M)'; } }
  function key(e){
    const k = e.key;
    if (['ArrowRight', ' ', 'PageDown', 'Enter', 'ArrowDown'].includes(k)){ e.preventDefault(); e.stopPropagation(); W.next(); }
    else if (['ArrowLeft', 'PageUp', 'Backspace', 'ArrowUp'].includes(k)){ e.preventDefault(); e.stopPropagation(); W.prev(); }
    else if (k === 'n' || k === 'N') toggle('notes');
    else if (k === 'g' || k === 'G') toggle('overview');
    else if (k === 'Escape'){ ['overview', 'help', 'notes'].forEach(id => $(id).classList.add('hidden')); }
    else if (k === 'p' || k === 'P') openPresenter();
    else if (k === 'h' || k === 'H' || k === '?') toggle('help');
    else if (k === 'f' || k === 'F'){ if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {}); else document.exitFullscreen(); }
    else if (k === 'b' || k === 'B' || k === '.') document.body.classList.toggle('blank');
    else if (k === 'a' || k === 'A'){ const a = W.beats.findIndex(b => b.appendix); if (a >= 0) W.go(a, 'cut'); }
    else if (k === 'm' || k === 'M') setRM(!W.reduced);
    else if (k === 's' || k === 'S') Sound.toggle();
    else if (k === 'Home') W.go(0, 'cut');
    else if (k === 'End') W.go(mainBeats().length - 1, 'cut');
  }
  function toggle(id){ const e = $(id); e.classList.toggle('hidden'); if (id === 'overview') markOverview(); if (id === 'notes') renderNotes(); }
  function update(){
    const st = state(), n = st.n;
    $('cnt').textContent = st.appendix ? 'appendix' : `${st.k + 1} / ${n}`;
    $('prog').style.width = st.appendix ? '100%' : ((st.k + 1) / n * 100) + '%';
    if (W.k >= 0 && !W.CAPTURE) history.replaceState(null, '', `#/${W.k + 1}`);
    renderNotes(); markOverview(); broadcast(); Sound.beat(W.beats[W.k]);
  }
  function renderNotes(){ const n = $('notes'); if (n.classList.contains('hidden')) return; const st = state();
    n.innerHTML = `<div class="nh"><b>${st.k + 1}. ${st.title}</b> <span>${st.act || ''} · ${st.min ? fmtMin(st.min) : '—'} · finish by ${fmtMin(st.cum)} of ${fmtMin(st.total)}</span><em>visible to the audience if this window is shared — press P for a private presenter window</em></div>
      <div class="ns">${st.seg}</div>${st.notes ? `<div class="nnotes">${esc(st.notes)}</div>` : ''}<div class="nc">On screen: ${st.cue}</div><div class="nn">Next click → ${st.next}</div>`; }
  function broadcast(){ if (UI.pw && !UI.pw.closed) UI.pw.postMessage(state(), '*'); }
  function openPresenter(){ UI.pw = window.open(location.href.split('#')[0].replace(/\?.*$/, '') + '#presenter', 'longitude3_presenter', 'width=1180,height=820'); setTimeout(broadcast, 700); setTimeout(broadcast, 1600); }
  /* overview: the talk as a path through the world */
  function buildOverview(){
    const o = $('overview'), bs = W.beats, main = mainBeats(), acts = [];
    main.forEach((b, i) => { if (!acts.length || acts[acts.length - 1].name !== b.act) acts.push({ name: b.act, from: i, to: i }); else acts[acts.length - 1].to = i; });
    const Wd = 1600, Hd = 640, pts = main.map((b, i) => { const t = i / (main.length - 1); return [80 + t * (Wd - 160), Hd * .5 + Math.sin(t * Math.PI * 3.2) * 170 + Math.sin(t * 17) * 12]; });
    let d = 'M' + pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' L');
    let svg = `<svg viewBox="0 0 ${Wd} ${Hd}" preserveAspectRatio="xMidYMid meet"><path d="${d}" fill="none" stroke="rgba(220,228,240,.22)" stroke-width="1.5"/>`;
    acts.forEach((a, j) => { const p = pts[a.from]; svg += `<text x="${p[0]}" y="${p[1] - 34}" class="oa">${a.name}</text>`; });
    main.forEach((b, i) => { const p = pts[i]; svg += `<g class="od" data-k="${i}"><circle cx="${p[0]}" cy="${p[1]}" r="7"/><text x="${p[0]}" y="${p[1] + 26}">${i + 1}</text><title>${i + 1}. ${b.title} (${fmtMin(b.min || 0)})</title></g>`; });
    svg += '</svg>';
    const apx = bs.map((b, i) => b.appendix ? `<button data-k="${i}">${b.title}</button>` : '').join('');
    o.innerHTML = `<div class="oh">Longitude · the path <span>click a point to jump · G or Esc to close · ${main.length} beats · ${fmtMin(total())}</span></div>${svg}<div class="oapx">Appendix ${apx}</div><div class="otitle" id="otitle"></div>`;
    o.querySelectorAll('[data-k]').forEach(g => { g.addEventListener('click', e => { e.stopPropagation(); o.classList.add('hidden'); W.go(+g.dataset.k, 'cut'); });
      g.addEventListener('mouseenter', () => { const b = W.beats[+g.dataset.k]; $('otitle').textContent = (+g.dataset.k + 1) + '. ' + b.title; }); });
  }
  function markOverview(){ document.querySelectorAll('#overview .od').forEach(g => g.classList.toggle('cur', +g.dataset.k === W.k)); }
  return { init, update, state, setRM, scriptFor, cum, total, fmtMin, pw: null };
})();

/* presenter window (opened with P): script, timer, next cue — no WebGL */
const Presenter = {
  start(){
    document.body.className = 'presenter'; document.title = 'Presenter — Longitude (v3)';
    document.body.innerHTML = '<div class="pv"><p>Waiting for the talk window… press any key here.</p></div>';
    this.box = document.querySelector('.pv');
    addEventListener('message', e => { if (e.data && e.data.type === 'state'){ this.st = e.data; this.render(); } });
    addEventListener('keydown', e => { if (window.opener){ e.preventDefault(); window.opener.postMessage({ type: 'key', key: e.key }, '*'); } });
    if (window.opener) window.opener.postMessage({ type: 'hello' }, '*');
    setInterval(() => this.render(), 1000);
  },
  esc(s){ return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); },
  render(){ const st = this.st; if (!st) return; const f = UI.fmtMin;
    const el = st.started ? (Date.now() - st.started) / 60000 : 0, diff = el - st.cum;
    const notes = st.notes ? `<div class="notes"><div class="lbl">Speaker notes</div>${this.esc(st.notes)}</div>` : '';
    this.box.innerHTML = `<div class="top"><div><span class="clock">${f(el)}</span> <span class="tgt">elapsed · aim to finish this beat by ${f(st.cum)} of ${f(st.total)}</span>
      <span class="pace ${diff > .5 ? 'late' : ''}">${st.started ? (diff > .5 ? f(diff) + ' behind' : 'on time') : 'timer starts on first click'}</span></div>
      <div class="tgt">${st.appendix ? 'APPENDIX' : 'Beat ' + (st.k + 1) + ' of ' + st.n} · ${f(st.min || 0)}</div></div>
      <div class="act">${st.act || ''}</div><h1>${st.title}</h1>
      <div class="say">${st.seg}</div>
      ${notes}
      <div class="next">Next click → ${st.next}</div>
      <div class="full"><div class="lbl">Whole section, for context</div>${st.full}</div>
      <div class="keys">Keys typed here drive the talk: → / Space next · ← back · G path · B black</div>`; }
};

/* optional sound: off by default. Procedural wind, rain and swell for the storm; a quiet tone bed in space. */
const Sound = (() => {
  let ctx = null, on = false, master, beds = {};
  function noise(c){ const b = c.createBuffer(1, c.sampleRate * 4, c.sampleRate), d = b.getChannelData(0); let l = 0;
    for (let i = 0; i < d.length; i++){ const w = Math.random() * 2 - 1; l = (l + .02 * w) / 1.02; d[i] = l * 3.5; } const s = c.createBufferSource(); s.buffer = b; s.loop = true; return s; }
  function white(c){ const b = c.createBuffer(1, c.sampleRate * 2, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; const s = c.createBufferSource(); s.buffer = b; s.loop = true; return s; }
  function build(){
    ctx = new (window.AudioContext || window.webkitAudioContext)(); master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    const sea = ctx.createGain(); sea.gain.value = 0; sea.connect(master);
    const n1 = noise(ctx), lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 380; const g1 = ctx.createGain(); g1.gain.value = .55; n1.connect(lp).connect(g1).connect(sea);
    const lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = .09; lg.gain.value = .35; lfo.connect(lg).connect(g1.gain); lfo.start();
    const n2 = white(ctx), hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2600; const g2 = ctx.createGain(); g2.gain.value = .05; n2.connect(hp).connect(g2).connect(sea);
    n1.start(); n2.start();
    const space = ctx.createGain(); space.gain.value = 0; space.connect(master);
    [55, 82.4, 110.2, 164.8].forEach((f, i) => { const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.detune.value = (i - 1.5) * 4; const g = ctx.createGain(); g.gain.value = .05 / (i + 1); o.connect(g).connect(space); o.start(); });
    beds = { sea, space, rain: g2 };
  }
  function toggle(){ if (!ctx) build(); on = !on; if (ctx.state === 'suspended') ctx.resume();
    master.gain.setTargetAtTime(on ? .5 : 0, ctx.currentTime, .6); const b = document.getElementById('b-snd'); if (b){ b.innerHTML = on ? '<svg viewBox="0 0 16 16" width="12" height="12"><path d="M3 6h2.5L9 3v10L5.5 10H3z" fill="currentColor"/><path d="M11 5.5c1 1.4 1 3.6 0 5M12.6 4c1.8 2.3 1.8 5.7 0 8" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>' : '<svg viewBox="0 0 16 16" width="12" height="12"><path d="M3 6h2.5L9 3v10L5.5 10H3z" fill="currentColor"/><path d="M11 6l4 4M15 6l-4 4" stroke="currentColor" stroke-width="1.2"/></svg>'; b.classList.toggle('on', on); }
    beat(World.beats[World.k]); }
  function beat(b){ if (!ctx || !b) return; const t = ctx.currentTime, P = World.P;
    const seaOn = b.env === 'sea' ? 1 : 0, storm = b.R && b.R.storm != null ? World.specVal(b.R.storm) : 1;
    beds.sea.gain.setTargetAtTime(seaOn * (.25 + .75 * storm), t, 1.5); beds.space.gain.setTargetAtTime(b.env === 'sea' ? 0 : .55, t, 2.5);
    beds.rain.gain.setTargetAtTime(.05 * (b.R && b.R.rain != null ? World.specVal(b.R.rain) : 1) * seaOn, t, 1.5);
    (b.strikes || []).forEach(s => { if (!on || World.reduced) return; const at = t + s.t + 1.4 + Math.random() * .8; const n = noise(ctx), lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 160;
      const g = ctx.createGain(); g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(1.3 * (s.p || 1), at + .25); g.gain.exponentialRampToValueAtTime(.001, at + 5.5); n.connect(lp).connect(g).connect(master); n.start(at); n.stop(at + 6); }); }
  return { toggle, beat };
})();
