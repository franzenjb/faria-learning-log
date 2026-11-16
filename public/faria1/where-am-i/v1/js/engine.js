/* Deck engine: build-step navigation, scaling, notes, presenter view, overview */
const Deck = {
  slides: [], i: 0, s: 0, started: null, el: {},
  add(def){ def.steps = def.steps || 1; this.slides.push(def); return def; },
  get main(){ return this.slides.filter(d => !d.appendix); },
  start(){
    if (location.hash.indexOf('presenter') >= 0) return Presenter.start();
    this.stage = document.getElementById('stage');
    this.fit(); addEventListener('resize', () => this.fit());
    this.slides.forEach((d, k) => { d.index = k; d.root = h('section', { class:'slide', 'data-id':d.id }, this.stage); });
    addEventListener('keydown', e => this.key(e), true);
    this.stage.addEventListener('click', e => {
      if (e.target.closest('.ctl, button, input, a')) return;
      if (e.button === 0) this.next();
    });
    addEventListener('message', e => { const m = e.data || {}; if (m.type === 'key') this.key({ key:m.key, preventDefault(){}, stopPropagation(){} }); if (m.type === 'hello') this.broadcast(); });
    gsap.ticker.add((t, dt) => { const d = this.cur; if (d && d.loop && d._built) d.loop(t, dt / 1000); });
    this.buildOverview(); this.buildHelp();
    const m = location.hash.match(/#\/(\d+)(?:\/(\d+))?/);
    this.goto(m ? (+m[1] - 1) : 0, m && m[2] ? +m[2] : 0, true);
  },
  fit(){ const k = Math.min(innerWidth / W, innerHeight / H); this.scale = k;
    this.stage.style.transform = `translate(${(innerWidth - W*k)/2}px, ${(innerHeight - H*k)/2}px) scale(${k})`; },
  get cur(){ return this.slides[this.i]; },
  ensure(d){ if (!d._built){ d.build(d.root, d); d._built = true; } },
  applyBuilds(d, step){
    d.root.querySelectorAll('[data-in]').forEach(e => {
      const a = +e.getAttribute('data-in'), o = e.hasAttribute('data-out') ? +e.getAttribute('data-out') : 1e9;
      const dimAt = e.hasAttribute('data-dim') ? +e.getAttribute('data-dim') : 1e9;
      e.classList.toggle('on', step >= a && step < o);
      e.classList.toggle('off', step >= dimAt && step >= a && step < o);
    });
  },
  setStep(d, step, dir, instant){
    if (instant){ d.root.classList.add('noanim'); }
    this.applyBuilds(d, step);
    if (d.go) d.go(step, { dir, instant: !!instant });
    if (instant){ void d.root.offsetWidth; requestAnimationFrame(() => requestAnimationFrame(() => d.root.classList.remove('noanim'))); }
  },
  goto(i, s = 0, instant){
    i = Math.max(0, Math.min(this.slides.length - 1, i));
    const prev = this.cur, d = this.slides[i];
    if (s < 0) s = d.steps - 1; s = Math.max(0, Math.min(d.steps - 1, s));
    this.ensure(d);
    if (prev && prev !== d){ prev.root.classList.remove('active'); if (prev.leave) prev.leave(); }
    this.i = i; this.s = s;
    d.root.classList.add('active');
    if (prev !== d && d.enter) d.enter({ step:s });
    // entering at a later step (backwards / jump) applies that state instantly
    this.setStep(d, s, 0, instant || s > 0 || prev === undefined);
    this.update();
  },
  next(){ const d = this.cur;
    if (!this.started) this.started = Date.now();
    if (this.s < d.steps - 1){ this.s++; this.setStep(d, this.s, 1, false); this.update(); }
    else if (this.i < this.slides.length - 1){ this.goto(this.i + 1, 0); }
  },
  prev(){ const d = this.cur;
    if (this.s > 0){ this.s--; this.setStep(d, this.s, -1, false); this.update(); }
    else if (this.i > 0){ this.goto(this.i - 1, -1, true); }
  },
  key(e){
    const k = e.key;
    if (!document.getElementById('overview').classList.contains('hidden') && (k === 'Escape' || k === 'g' || k === 'G')){ this.toggle('overview'); e.preventDefault(); return; }
    if (['ArrowRight',' ','PageDown','Enter','ArrowDown'].includes(k)){ e.preventDefault(); e.stopPropagation(); this.next(); }
    else if (['ArrowLeft','PageUp','Backspace','ArrowUp'].includes(k)){ e.preventDefault(); e.stopPropagation(); this.prev(); }
    else if (k === 'n' || k === 'N') this.toggle('notes');
    else if (k === 'g' || k === 'G' || k === 'Escape') this.toggle('overview');
    else if (k === 'p' || k === 'P') this.openPresenter();
    else if (k === 'h' || k === 'H' || k === '?') this.toggle('help');
    else if (k === 'f' || k === 'F'){ if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{}); else document.exitFullscreen(); }
    else if (k === 'Home') this.goto(0, 0);
    else if (k === 'End') this.goto(this.main.length - 1, -1, true);
    else if (k === 'a' || k === 'A'){ const a = this.slides.findIndex(d => d.appendix); if (a >= 0) this.goto(a, 0); }
    else if (k === 'b' || k === 'B'){ document.getElementById('stage').style.opacity = document.getElementById('stage').style.opacity === '0' ? '1' : '0'; }
  },
  toggle(id){ const e = document.getElementById(id); e.classList.toggle('hidden'); if (id === 'overview') this.markOverview(); if (id === 'notes') this.renderNotes(); },
  update(){
    const d = this.cur, main = this.main.length;
    const pf = document.getElementById('progress-fill'), pr = document.getElementById('progress');
    if (d.appendix){ const ap = this.slides.filter(x => x.appendix), k = ap.indexOf(d);
      pf.style.width = ((k + (this.s + 1) / d.steps) / ap.length * 100) + '%'; pr.classList.add('appendix');
      document.getElementById('counter').textContent = `APPENDIX ${k + 1} / ${ap.length}`;
    } else { pf.style.width = ((this.i + (this.s + 1) / d.steps) / main * 100) + '%'; pr.classList.remove('appendix');
      document.getElementById('counter').textContent = `${this.i + 1} / ${main}`; }
    history.replaceState(null, '', `#/${this.i + 1}/${this.s}`);
    this.renderNotes(); this.markOverview(); this.broadcast();
  },
  state(){ const d = this.cur; let before = 0; for (const x of this.slides){ if (x === d) break; if (!x.appendix) before += x.min || 0; }
    const nx = this.slides[this.i + 1];
    return { type:'state', i:this.i, s:this.s, steps:d.steps, title:d.title, act:d.actName || '', min:d.min, before, total:this.main.reduce((a,x)=>a+(x.min||0),0),
      script:d.notes ? d.notes.script : '', cues:(d.notes && d.notes.cues) || [], next: nx ? nx.title : '(end)', appendix: !!d.appendix, n:this.main.length, started:this.started }; },
  broadcast(){ if (this.pw && !this.pw.closed) this.pw.postMessage(this.state(), '*'); },
  openPresenter(){ this.pw = window.open(location.href.split('#')[0] + '#presenter', 'whereami_presenter', 'width=1100,height=800'); setTimeout(() => this.broadcast(), 600); setTimeout(() => this.broadcast(), 1500); },
  renderNotes(){
    const n = document.getElementById('notes'); if (n.classList.contains('hidden')) return; const st = this.state();
    const cue = st.cues[st.s + 1] ? `<div class="cue">Next click → ${st.cues[st.s + 1]}</div>` : `<div class="cue">Next click → next slide: ${st.next}</div>`;
    n.innerHTML = `<div class="warn">Speaker notes · visible to the audience if you share this window — press P for a separate presenter window</div>
      <h3>${st.i + 1}. ${st.title} <span style="font:500 15px var(--sans);color:#94A6BE">· target ${st.min || 0} min · cumulative ${(st.before + (st.min||0)).toFixed(2).replace(/\.?0+$/,'')} of ${st.total} · build ${st.s + 1}/${st.steps}</span></h3>
      ${cue}<div style="margin-top:8px">${st.script}</div>`;
  },
  buildOverview(){
    const o = document.getElementById('overview');
    o.innerHTML = '<h2>Where Am I? · slide index <span style="font:400 15px var(--sans);color:#8EA0B8">click a card · G or Esc to close</span></h2><div class="grid"></div>';
    const g = o.querySelector('.grid');
    this.slides.forEach((d, k) => {
      const c = h('div', { class:'card' + (d.appendix ? ' appx' : '') }, g,
        `<div class="n">${d.appendix ? 'APPENDIX' : (k + 1) + ' · ' + (d.actName || '')}</div><div class="t">${d.title}</div><div class="m">${d.appendix ? 'if asked' : (d.min + ' min')} · ${d.steps} build${d.steps > 1 ? 's' : ''}</div>`);
      c.onclick = () => { this.toggle('overview'); this.goto(k, 0); };
    });
  },
  markOverview(){ document.querySelectorAll('#overview .card').forEach((c, k) => c.classList.toggle('cur', k === this.i)); },
  buildHelp(){ document.getElementById('help').innerHTML =
    '<b>→ / Space / click</b>next build, then next slide<br><b>←</b>back one build<br><b>N</b>notes drawer (in this window)<br><b>P</b>presenter window (notes, timer)<br><b>G / Esc</b>slide index<br><b>A</b>jump to appendix<br><b>B</b>black screen<br><b>F</b>full screen<br><b>Home / End</b>first / last slide<br><b>H</b>this help'; }
};

const Presenter = {
  start(){
    document.body.classList.add('presenter'); document.title = 'Presenter — Where Am I?';
    ['viewport','progress','counter','notes','overview','help'].forEach(id => { const e = document.getElementById(id); if (e) e.remove(); });
    this.box = h('div', { class:'pv' }, document.body, '<p>Waiting for the deck… press any key in this window.</p>');
    addEventListener('message', e => { if (e.data && e.data.type === 'state'){ this.st = e.data; this.render(); } });
    addEventListener('keydown', e => { if (window.opener){ e.preventDefault(); window.opener.postMessage({ type:'key', key:e.key }, '*'); } });
    if (window.opener) window.opener.postMessage({ type:'hello' }, '*');
    setInterval(() => this.render(), 1000);
  },
  render(){
    const st = this.st; if (!st) return;
    const el = st.started ? Math.floor((Date.now() - st.started) / 1000) : 0;
    const mm = String(Math.floor(el / 60)).padStart(2,'0') + ':' + String(el % 60).padStart(2,'0');
    const tgt = st.before + (st.min || 0);
    const cue = st.cues[st.s + 1] || ('next slide: ' + st.next);
    this.box.innerHTML = `<div class="top"><div><span class="clock">${mm}</span> <span class="tgt">elapsed · finish this slide by ${tgt.toFixed(2).replace(/\.?0+$/,'')} min of ${st.total}</span></div>
      <div class="tgt">${st.appendix ? 'APPENDIX' : 'Slide ' + (st.i + 1) + ' of ' + st.n} · build ${st.s + 1} of ${st.steps} · ${st.min || 0} min</div></div>
      <h1>${st.title}</h1><div class="step">${st.act}</div>
      <div class="next">Next click → ${cue}</div>
      <div class="script">${st.script}</div>
      <div class="nexts">Then: ${st.next}</div>
      <div class="keys">Keys typed here drive the deck: → / Space next · ← back · G index · B black</div>`;
  }
};
