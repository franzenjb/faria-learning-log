/* core.js — one continuous WebGL world: renderer, post pipeline (bloom, depth of field, grade, crossfades),
   camera rig, parameter tweening and the beat engine. Each clicker press is a beat: a camera move plus a scene change. */
(function(){
'use strict';
const RAD = Math.PI / 180;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x)), lerp = (a, b, t) => a + (b - a) * t;
const smoother = t => { t = clamp(t, 0, 1); return t * t * t * (t * (t * 6 - 15) + 10); };
const sineIO = t => -(Math.cos(Math.PI * clamp(t, 0, 1)) - 1) / 2;
const EASE = { io: t => lerp(sineIO(t), smoother(t), .5), lin: t => clamp(t, 0, 1), out: t => 1 - Math.pow(1 - clamp(t, 0, 1), 3), in: t => Math.pow(clamp(t, 0, 1), 2.2), step: t => t > 0 ? 1 : 0 };
const V = a => new THREE.Vector3(a[0], a[1], a[2]);
const Q = new URLSearchParams(location.search);
const CAPTURE = Q.has('capture');
/* 2026-11-16: quicker fades and pans (~42% faster, 55–60% of original length). Revert: set to 1.
   Original files: review/timings_backup_2026-11-16_original/ */
const TRANS_SCALE = 0.58;

const FSV = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`;
function fsMat(frag, uniforms, extra = {}){
  return new THREE.ShaderMaterial(Object.assign({ vertexShader: FSV, fragmentShader: frag, uniforms, depthTest: false, depthWrite: false }, extra)); }

const World = {
  RAD, clamp, lerp, smoother, EASE, V, CAPTURE, TRANS_SCALE,
  envs: {}, defs: {}, beats: [], k: -1, T: 0, bt: 0, P: {}, tw: {}, reduced: false, started: null,
  Q: { scale: +(Q.get('scale') || 1), clouds: +(Q.get('csteps') || (CAPTURE ? 96 : 64)), msaa: Q.get('msaa') ? +Q.get('msaa') : 4 },
  ok: false,
  /* ---------- params ---------- */
  param(name, def){ this.defs[name] = def; if (!(name in this.P)) this.P[name] = def; },
  /* ---------- environments ---------- */
  env(name, e){ e.name = name; this.envs[name] = e; return e; },
  init(){
    const cv = document.getElementById('gl');
    try {
      this.r = new THREE.WebGLRenderer({ canvas: cv, antialias: false, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: CAPTURE });
      if (!this.r.capabilities.isWebGL2) this.Q.msaa = 0;
      this.ok = true;
    } catch (e){ console.warn('WebGL unavailable', e); document.body.classList.add('nogl'); return false; }
    const r = this.r; r.autoClear = true; r.setClearColor(0x000000, 1); r.toneMapping = THREE.NoToneMapping;
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2)); this.qScene = new THREE.Scene(); this.qScene.add(this.quad); this.qCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.size(); addEventListener('resize', () => { this.size(); if (this.cur) this.draw(); });
    return true;
  },
  pass(mat, target){ this.quad.material = mat; this.r.setRenderTarget(target || null); this.r.render(this.qScene, this.qCam); },
  mkRT(w, h, o = {}){ const rt = new THREE.WebGLRenderTarget(w, h, Object.assign({ type: THREE.HalfFloatType, depthBuffer: false, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter }, o)); return rt; },
  size(){
    if (!this.ok) return;
    const dpr = window.devicePixelRatio || 1, cw = innerWidth, ch = innerHeight;
    let pr = Math.min(dpr, Math.sqrt((1920 * 1200) / (cw * ch))) * this.Q.scale;
    if (CAPTURE) pr = +(Q.get('pr') || 1);
    this.r.setPixelRatio(pr); this.r.setSize(cw, ch, false);
    const w = Math.round(cw * pr), h = Math.round(ch * pr); this.W = w; this.H = h; this.aspect = cw / ch;
    [this.rtMS, this.rtH, this.rtC, this.rtB1, this.rtB2, this.rtA, this.rtO, this.rtSnap].forEach(t => t && t.dispose());
    this.rtMS = this.mkRT(w, h, { samples: this.Q.msaa, depthBuffer: true });
    this.rtMS.depthTexture = new THREE.DepthTexture(w, h); this.rtMS.depthTexture.type = THREE.FloatType;
    this.rtH = this.mkRT(w, h);
    this.rtC = this.mkRT(Math.ceil(w / 2), Math.ceil(h / 2));
    this.rtB1 = this.mkRT(Math.ceil(w / 3), Math.ceil(h / 3)); this.rtB2 = this.mkRT(Math.ceil(w / 3), Math.ceil(h / 3));
    const ldr = { type: THREE.UnsignedByteType };
    this.rtA = this.mkRT(w, h, ldr); this.rtO = this.mkRT(w, h, ldr); this.rtSnap = this.mkRT(w, h, ldr);
    if (!this.bloom){ this.bloom = new THREE.UnrealBloomPass(new THREE.Vector2(w, h), .6, .55, .82); }
    this.bloom.setSize(w, h);
    this.mats || this.makeMats();
    this.mats.blurH.uniforms.uTex.value = this.rtB1.texture;
    for (const e of Object.values(this.envs)) e.resize && e.resize(w, h);
    for (const c of this.cams()) { c.aspect = this.aspect; c.updateProjectionMatrix(); }
    this.snapValid = false;
    if (CAPTURE) this.drawNow = true;
  },
  cams(){ return Object.values(this.envs).map(e => e.cam).filter(Boolean); },
  makeMats(){
    const U = () => ({});
    this.mats = {
      comp: fsMat(`varying vec2 vUv; uniform sampler2D tCol, tCloud; uniform float uCloud; uniform vec2 uCPx;
        void main(){ vec4 c = texture2D(tCol, vUv);
          if (uCloud > .5){ // soft tent upsample of the half-res clouds: hides the ray-march dither without a TAA history
            vec4 k = texture2D(tCloud, vUv) * .36;
            k += (texture2D(tCloud, vUv + uCPx * vec2(1.1, .55)) + texture2D(tCloud, vUv + uCPx * vec2(-1.1, -.55)) + texture2D(tCloud, vUv + uCPx * vec2(-.55, 1.1)) + texture2D(tCloud, vUv + uCPx * vec2(.55, -1.1))) * .16;
            c.rgb = c.rgb * (1. - k.a) + k.rgb; }
          gl_FragColor = vec4(c.rgb, 1.); }`,
        { tCol: { value: null }, tCloud: { value: null }, uCloud: { value: 0 }, uCPx: { value: new THREE.Vector2() } }),
      down: fsMat(`varying vec2 vUv; uniform sampler2D uTex; uniform vec2 uPx;
        void main(){ vec3 c = vec3(0.); for (int i = -1; i <= 1; i++) for (int j = -1; j <= 1; j++) c += texture2D(uTex, vUv + vec2(float(i), float(j)) * uPx).rgb; gl_FragColor = vec4(c / 9., 1.); }`,
        { uTex: { value: null }, uPx: { value: new THREE.Vector2() } }),
      blurH: fsMat(`varying vec2 vUv; uniform sampler2D uTex; uniform vec2 uDir;
        void main(){ vec3 c = texture2D(uTex, vUv).rgb * .227; 
          c += (texture2D(uTex, vUv + uDir * 1.385).rgb + texture2D(uTex, vUv - uDir * 1.385).rgb) * .316;
          c += (texture2D(uTex, vUv + uDir * 3.231).rgb + texture2D(uTex, vUv - uDir * 3.231).rgb) * .070;
          gl_FragColor = vec4(c, 1.); }`, { uTex: { value: null }, uDir: { value: new THREE.Vector2() } }),
      grade: fsMat(`varying vec2 vUv; uniform sampler2D tCol, tBlur, tDepth; uniform float uExpo, uBlur, uAper, uFocus, uNear, uFar, uSat, uContrast, uUseDepth;
        uniform vec3 uLift, uGain;
        vec3 aces(vec3 x){ return clamp((x * (2.51 * x + .03)) / (x * (2.43 * x + .59) + .14), 0., 1.); }
        float lin(float d){ float z = d * 2. - 1.; return 2. * uNear * uFar / (uFar + uNear - z * (uFar - uNear)); }
        void main(){
          vec3 c = texture2D(tCol, vUv).rgb;
          float coc = uBlur;
          if (uUseDepth > .5 && uAper > 0.){ float d = texture2D(tDepth, vUv).r; float z = d >= 1. ? 1e9 : lin(d);
            coc = max(coc, clamp(abs(z - uFocus) / max(z, 1e-4) * uAper, 0., 1.)); }
          if (coc > 0.002){ vec3 b = texture2D(tBlur, vUv).rgb; c = mix(c, b, smoothstep(0., 1., coc)); }
          c *= uExpo; c = c * uGain + uLift;
          c = aces(c);
          float l = dot(c, vec3(.2126, .7152, .0722)); c = mix(vec3(l), c, uSat);
          c = clamp((c - .5) * uContrast + .5, 0., 1.);
          gl_FragColor = vec4(pow(c, vec3(1. / 2.2)), 1.); }`,
        { tCol: { value: null }, tBlur: { value: null }, tDepth: { value: null }, uExpo: { value: 1 }, uBlur: { value: 0 }, uAper: { value: 0 }, uFocus: { value: 10 }, uNear: { value: .1 }, uFar: { value: 1000 },
          uSat: { value: 1 }, uContrast: { value: 1 }, uUseDepth: { value: 0 }, uLift: { value: new THREE.Vector3() }, uGain: { value: new THREE.Vector3(1, 1, 1) } }),
      present: fsMat(`varying vec2 vUv; uniform sampler2D tA, tB; uniform float uMix, uFade, uVig, uGrain, uT, uAsp;
        float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
        void main(){
          vec3 a = texture2D(tA, vUv).rgb, b = texture2D(tB, vUv).rgb;
          vec3 c = mix(b, a, uMix);
          vec2 q = (vUv - .5) * vec2(uAsp, 1.) / max(uAsp, 1.) * 1.0;
          float v = 1. - uVig * smoothstep(.25, .95, length((vUv - .5) * vec2(1., .9)) * 1.25);
          c *= v;
          c += (h(vUv * 1000. + fract(uT * 7.13)) - .5) * uGrain;
          gl_FragColor = vec4(c * uFade, 1.); }`,
        { tA: { value: null }, tB: { value: null }, uMix: { value: 1 }, uFade: { value: 1 }, uVig: { value: .35 }, uGrain: { value: .018 }, uT: { value: 0 }, uAsp: { value: 1.77 } }),
    };
  },
  /* full post chain for one environment, into an LDR target */
  renderEnv(e, out){
    const r = this.r, P = this.P, m = this.mats;
    r.setRenderTarget(this.rtMS); r.setClearColor(e.clear || 0x000000, 1); r.clear(true, true, true);
    r.render(e.scene, e.cam);
    let useCloud = 0;
    if (e.cloudPass && e.cloudsOn()){ e.cloudPass(r, this.rtMS.depthTexture, this.rtC); useCloud = 1; }
    m.comp.uniforms.tCol.value = this.rtMS.texture; m.comp.uniforms.tCloud.value = this.rtC.texture; m.comp.uniforms.uCloud.value = useCloud; m.comp.uniforms.uCPx.value.set(1 / this.rtC.width, 1 / this.rtC.height);
    this.pass(m.comp, this.rtH);
    if (e.post){ r.setRenderTarget(this.rtH); r.autoClear = false; r.render(e.post, e.cam); r.autoClear = true; }
    const bs = e.bloom ? e.bloom() : [.6, .5, .85];
    if (bs[0] > 0.001){ const b = this.bloom; b.strength = bs[0]; b.radius = bs[1]; b.threshold = bs[2]; b.render(r, null, this.rtH, 0, false); }
    const blur = P.blur || 0, aper = e.aper ? e.aper() : 0;
    const needBlur = blur > .002 || aper > 0;
    if (needBlur){
      m.down.uniforms.uTex.value = this.rtH.texture; m.down.uniforms.uPx.value.set(1 / this.W, 1 / this.H); this.pass(m.down, this.rtB1);
      for (let i = 0; i < 2; i++){
        m.blurH.uniforms.uTex.value = this.rtB1.texture; m.blurH.uniforms.uDir.value.set((1 + i) / this.rtB1.width, 0); this.pass(m.blurH, this.rtB2);
        m.blurH.uniforms.uTex.value = this.rtB2.texture; m.blurH.uniforms.uDir.value.set(0, (1 + i) / this.rtB1.height); this.pass(m.blurH, this.rtB1); }
    }
    const g = m.grade.uniforms, gr = e.grade ? e.grade() : {};
    g.tCol.value = this.rtH.texture; g.tBlur.value = this.rtB1.texture; g.tDepth.value = this.rtMS.depthTexture;
    g.uExpo.value = (gr.expo || 1) * (P.expo == null ? 1 : P.expo); g.uBlur.value = blur; g.uAper.value = aper; g.uFocus.value = e.focus ? e.focus() : 10;
    g.uNear.value = e.cam.near; g.uFar.value = e.cam.far; g.uUseDepth.value = aper > 0 ? 1 : 0;
    g.uSat.value = gr.sat == null ? 1 : gr.sat; g.uContrast.value = gr.con == null ? 1 : gr.con;
    g.uLift.value.set(...(gr.lift || [0, 0, 0])); g.uGain.value.set(...(gr.gain || [1, 1, 1]));
    this.pass(m.grade, out);
  },
  /* ---------- camera rig ---------- */
  camState(spec){ // normalised camera state from a beat's camera spec
    if (!spec) return null;
    const s = { mode: spec.orb ? 'orb' : 'look', fov: spec.fov || 40, roll: spec.roll || 0, shift: spec.shift || [0, 0], via: spec.via || null };
    if (s.mode === 'orb'){ s.c = spec.c || [0, 0, 0]; s.d = spec.d; s.az = spec.az || 0; s.el = spec.el || 0; s.tilt = spec.tilt || 0; }
    else { s.p = spec.p; s.t = spec.t; s.up = spec.up || [0, 1, 0]; s.via = spec.via || null; }
    return s;
  },
  orbPos(s){ const ce = Math.cos(s.el * RAD); return [s.c[0] + s.d * ce * Math.sin(s.az * RAD), s.c[1] + s.d * Math.sin(s.el * RAD), s.c[2] + s.d * ce * Math.cos(s.az * RAD)]; },
  toLook(s){ if (s.mode === 'look') return s; return { mode: 'look', p: this.orbPos(s), t: s.c, up: [0, 1, 0], fov: s.fov, roll: s.roll, shift: s.shift }; },
  camLerp(a, b, t){
    if (!a) return b; if (t >= 1) return b;
    const o = { fov: lerp(a.fov, b.fov, t), roll: lerp(a.roll, b.roll, t), shift: [lerp(a.shift[0], b.shift[0], t), lerp(a.shift[1], b.shift[1], t)] };
    if (a.mode === 'orb' && b.mode === 'orb'){
      let daz = b.az - a.az; while (daz > 180) daz -= 360; while (daz < -180) daz += 360;
      return Object.assign(o, { mode: 'orb', c: [0, 1, 2].map(i => lerp(a.c[i], b.c[i], t)), d: Math.exp(lerp(Math.log(a.d), Math.log(b.d), t)), az: a.az + daz * t, el: lerp(a.el, b.el, t), tilt: lerp(a.tilt || 0, b.tilt || 0, t) }); }
    const A = this.toLook(a), B = this.toLook(b);
    let p;
    const via = b.via || null;
    if (via){ const u = 1 - t; p = [0, 1, 2].map(i => u * u * A.p[i] + 2 * u * t * via[i] + t * t * B.p[i]); }
    else if (b.logPath){ // long flights: move fast through the middle, slow at the ends
      p = [0, 1, 2].map(i => lerp(A.p[i], B.p[i], t)); }
    else p = [0, 1, 2].map(i => lerp(A.p[i], B.p[i], t));
    return Object.assign(o, { mode: 'look', p, t: [0, 1, 2].map(i => lerp(A.t[i], B.t[i], t)), up: [0, 1, 2].map(i => lerp(A.up[i], B.up[i], t)) });
  },
  applyCam(cam, s, breathe){
    if (!s) return;
    const L = this.toLook(s);
    cam.position.set(...L.p); cam.up.set(...L.up).normalize(); cam.lookAt(...L.t);
    if (s.mode === 'orb' && s.tilt) cam.rotateX(s.tilt * RAD);
    if (L.roll) cam.rotateZ(L.roll * RAD);
    if (breathe) breathe(cam);
    cam.fov = L.fov; cam.aspect = this.aspect; cam.updateProjectionMatrix();
    const sh = s.shift; if (sh && (sh[0] || sh[1])){ const e = cam.projectionMatrix.elements; e[8] -= 2 * sh[0]; e[9] -= 2 * sh[1]; cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert(); }
    cam.updateMatrixWorld();
  },
  /* ---------- beats ---------- */
  beat(b){ this.beats.push(b); return b; },
  resolve(){ // accumulate persistent params, cameras and environments down the beat list
    let pp = {}, env = null, cam = null;
    this.beats.forEach((b, i) => {
      b.i = i; env = b.env || env; b.env = env;
      if (b.cam) cam = b.cam; else b.cam = cam;
      const p = Object.assign({}, pp);
      for (const k in (b.p || {})) p[k] = b.p[k];
      for (const k in p) if (k.startsWith('o.')) { if (!(b.p && k in b.p)) delete p[k]; }
      (b.show || []).forEach(k => { p['o.' + k] = (b.p && b.p['o.' + k]) != null ? b.p['o.' + k] : 1; });
      b.R = p; const keep = {}; for (const k in p) if (!k.startsWith('o.')) keep[k] = p[k]; pp = keep;
      b.dur = b.dur || 4.5;
    });
  },
  specVal(v){ return Array.isArray(v) ? v[0] : v; },
  go(k, how){ // how: 'fly' (forward), 'cut' (back / jump: quick crossfade to the final state)
    k = clamp(k, 0, this.beats.length - 1);
    const prev = this.beats[this.k], b = this.beats[k];
    if (!b) return;
    if (this.k >= 0 && !this.started) this.started = Date.now();
    const instant = how === 'cut' || how === 'init' || this.reduced;
    const now = this.T;
    // snapshot crossfade for cuts and reduced motion
    if (instant && how !== 'init' && this.ok){ this.presentTo(this.rtSnap); this.xf = { kind: 'snap', t0: now, dur: (this.reduced ? 1.4 : .75) * TRANS_SCALE, delay: 0 }; }
    // params
    const all = new Set([...Object.keys(this.defs)]);
    for (const key of all){
      const spec = key in b.R ? b.R[key] : this.defs[key];
      const to = this.specVal(spec);
      const dur = Array.isArray(spec) && spec[1] != null ? spec[1] : (key.startsWith('o.') ? 1.6 * TRANS_SCALE : b.dur);
      const delay = Array.isArray(spec) && spec[2] != null ? spec[2] : (key.startsWith('o.') ? (b.odelay != null ? b.odelay : Math.min(1.4, b.dur * .35)) : 0);
      const ease = Array.isArray(spec) && spec[3] ? spec[3] : 'io';
      const from = this.P[key] == null ? to : this.P[key];
      if (instant) { this.tw[key] = null; this.P[key] = to; }
      else if (from !== to) this.tw[key] = { from, to, t0: now + delay, dur, ease: EASE[ease] || EASE.io };
      else this.tw[key] = null;
    }
    // environment & camera
    const envChanged = !prev || prev.env !== b.env;
    const e = this.envs[b.env];
    const target = this.camState(b.cam);
    if (instant){ e.camCur = target; e.camTw = null; }
    else {
      let from = envChanged ? (b.fromCam ? this.camState(b.fromCam) : this.pushed(target, b.push == null ? .06 : b.push)) : (e.camCur || target);
      if (envChanged) e.camCur = from;
      e.camTw = { from, to: target, t0: now + (b.camDelay || 0), dur: b.camDur || (b.dur * TRANS_SCALE), ease: EASE[b.camEase || 'io'] };
    }
    if (envChanged && prev && !instant && b.outCam){ const pe = this.envs[prev.env]; pe.camTw = { from: pe.camCur, to: this.camState(b.outCam), t0: now, dur: ((b.xf || 2.2) + .3) * TRANS_SCALE + (b.xfDelay || 0), ease: EASE.in }; }
    if (envChanged && prev && !instant && this.ok){
      this.out = this.envs[prev.env]; this.xf = { kind: 'env', t0: now + (b.xfDelay || 0), dur: (b.xf || 2.2) * TRANS_SCALE, delay: 0 };
    } else if (envChanged) this.out = null;
    this.cur = e; this.k = k; this.bt = 0; this.dir = how === 'fly' ? 1 : 0;
    for (const en of Object.values(this.envs)) en.onBeat && en.onBeat(b, prev, { instant, active: en === e, fly: how === 'fly' && !this.reduced });
    Overlay.show(b, instant);
    UI.update();
  },
  pushed(s, f){ if (!s) return s; const o = Object.assign({}, s); if (o.mode === 'orb') o.d = s.d * (1 + f);
    else { const p = V(s.p), t = V(s.t); o.p = p.clone().sub(t).multiplyScalar(1 + f).add(t).toArray(); } return o; },
  next(){ if (this.k < this.beats.length - 1) this.go(this.k + 1, 'fly'); },
  prev(){ if (this.k > 0) this.go(this.k - 1, 'cut'); },
  /* ---------- frame ---------- */
  step(dt){
    this.T += dt; this.bt += dt; const now = this.T;
    for (const key in this.tw){ const w = this.tw[key]; if (!w) continue; const u = (now - w.t0) / w.dur;
      if (u <= 0) this.P[key] = w.from; else if (u >= 1){ this.P[key] = w.to; this.tw[key] = null; } else this.P[key] = lerp(w.from, w.to, w.ease(u)); }
    for (const e of Object.values(this.envs)){
      if (e.camTw){ const w = e.camTw, u = (now - w.t0) / w.dur; e.camCur = u >= 1 ? w.to : this.camLerp(w.from, w.to, w.ease(Math.max(0, u))); if (u >= 1) e.camTw = null; }
    }
    // slow drift once a move has landed: the world keeps breathing while the speaker talks
    const b = this.beats[this.k], e0 = this.cur;
    if (b && b.drift && e0 && !e0.camTw && e0.camCur && !this.reduced){ const c = Object.assign({}, e0.camCur), d = b.drift, f = dt * Math.max(0, 1 - this.bt / (b.driftFor || 90));
      if (c.mode === 'orb'){ c.az += (d.az || 0) * f; c.el += (d.el || 0) * f; c.d *= 1 + (d.d || 0) * f; }
      else if (d.p){ c.p = c.p.map((v, i) => v + d.p[i] * f); c.t = c.t.map((v, i) => v + (d.t ? d.t[i] : d.p[i]) * f); }
      e0.camCur = c; }
    const live = [this.cur]; if (this.xf && this.xf.kind === 'env' && this.out && this.out !== this.cur) live.push(this.out);
    for (const e of live){ if (!e) continue; this.applyCam(e.cam, e.camCur, this.reduced ? null : (c => e.breathe && e.breathe(c, now))); e.update && e.update(now, dt, this.P); }
    Overlay.frame(this.cur);
    if (this.ok) this.draw();
  },
  draw(){
    const m = this.mats.present.uniforms, now = this.T;
    let mix = 1, B = this.rtA;
    if (this.xf){ const u = clamp((now - this.xf.t0) / this.xf.dur, 0, 1); mix = EASE.io(u);
      if (this.xf.kind === 'env' && this.out){ this.renderEnv(this.out, this.rtO); B = this.rtO; } else if (this.xf.kind === 'snap') B = this.rtSnap;
      if (u >= 1){ this.xf = null; this.out = null; mix = 1; } }
    this.renderEnv(this.cur, this.rtA);
    m.tA.value = this.rtA.texture; m.tB.value = B.texture; m.uMix.value = mix; m.uT.value = now; m.uAsp.value = this.aspect;
    m.uFade.value = this.P.fade == null ? 1 : this.P.fade; m.uVig.value = this.cur.vig ? this.cur.vig() : .35;
    this.pass(this.mats.present, null);
  },
  presentTo(rt){ // render the current composed frame into rt (for snapshot crossfades)
    const m = this.mats.present.uniforms; m.tA.value = this.rtA.texture; m.tB.value = this.rtA.texture; m.uMix.value = 1; this.pass(this.mats.present, rt); },
  loop(){
    let last = performance.now(), acc = [], tier = 0;
    const tick = () => {
      const t = performance.now(), dt = Math.min(.1, (t - last) / 1000); last = t;
      this.step(dt);
      acc.push(dt); if (acc.length >= 120){ const avg = acc.reduce((a, b) => a + b, 0) / acc.length; acc = [];
        if (avg > 1 / 40 && tier < 3 && !Q.get('scale')){ tier++; this.Q.scale = [1, .85, .72, .6][tier]; this.Q.clouds = [64, 48, 34, 24][tier]; this.size(); if (this.ok && this.cur) this.draw(); console.info('quality tier', tier); } }   // redraw at once: a resized canvas is blank, and presenting it flashes a black frame
      requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  },
  start(){
    this.resolve();
    const m = location.hash.match(/#\/(\d+)/);
    try { this.reduced = localStorage.getItem('whereami2_rm') === '1' || matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e){}
    UI.init();
    const k0 = m ? (+m[1] - 1) : 0;
    this.go(k0, 'init');
    if (!CAPTURE){ if (this.ok && k0 === 0){ this.P.fade = 0; this.tw.fade = { from: 0, to: 1, t0: .3, dur: 4 * TRANS_SCALE, ease: EASE.io }; } this.loop(); }
    window.__ready = true;
  }
};
window.World = World;
World.param('blur', 0); World.param('fade', 1); World.param('expo', 1);
THREE.DefaultLoadingManager.onLoad = () => { window.__tex = true; };

/* ---------- capture hooks (headless review) ---------- */
window.__cap = {
  // jump to the final state of beat k-1, then start beat k and advance t seconds without drawing intermediate frames
  seek(k, t, sub = 10){ const W = World; W.reduced = false; W.xf = null; W.out = null;
    if (k > 0) W.go(k - 1, 'init'); W.step(0.001); window.__capSkip = t; W.go(k, k === 0 ? 'init' : 'fly'); window.__capSkip = 0; W.xf = null;
    const n = Math.max(1, Math.ceil(t * sub)); const ok = W.ok; W.ok = false;
    for (let i = 0; i < n; i++) W.step(t / n);
    W.ok = ok; W.step(0.0001); return W.k; },
  frame(dt){ World.step(dt); },
  info(){ return World.beats.map(b => ({ id: b.id, title: b.title, act: b.act, min: b.min, dur: b.dur, env: b.env })); }
};
})();
