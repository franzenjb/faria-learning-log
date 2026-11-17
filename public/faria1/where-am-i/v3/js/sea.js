/* sea.js — 22 October 1707. A storm-swept Atlantic at night: Gerstner ocean, volumetric storm clouds (ray-marched),
   rain, sparing lightning, period ships of the line with stern lanterns, and the Western Rocks of Scilly.
   Local frame: x east, y up, -z north. Units: metres. */
(function(){
const W = World, RAD = Math.PI / 180, P = W.P;
const HEAD = 62 * RAD, F = [Math.sin(HEAD), 0, -Math.cos(HEAD)], Rt = [Math.cos(HEAD), 0, Math.sin(HEAD)];
const at = (a, b, y = 0) => [F[0] * a + Rt[0] * b, y, F[2] * a + Rt[2] * b];   // a metres ahead along the fleet's course, b metres to starboard
const defs = { storm: 1, rain: 1, cov: .93, cbase: 420, ctop: 1500, cdens: 1, fogD: .00105, stars: 0, mw: 0, lat: 49.9, lst: 90,
  glow: 1, hole: .85, moonAz: 40, moonEl: 13, seaExpo: 1, lant0: 1, lant1: 1, lant2: 1, lant3: 1, sink: 0, foam: 1, ambient: 1, haze: 1, seaBlur: 0, cwind: 1 };
for (const k in defs) W.param(k, defs[k]);
W.param('o.con', 0);

const sea = W.env('sea', { clear: 0x000000 });
const scene = sea.scene = new THREE.Scene();
const cam = sea.cam = new THREE.PerspectiveCamera(50, 16 / 9, .5, 60000);
scene.fog = new THREE.FogExp2(0x151d27, .001);

/* ---------------- waves (shared by GPU and CPU) ---------------- */
const WAVES = [ // [direction (deg, relative to fleet course), wavelength m, amplitude m, phase]
  [-8, 118, 3.0, 0], [14, 84, 2.1, 1.7], [-27, 61, 1.45, 4.1], [33, 43, .95, 2.2], [-46, 31, .62, 5.5], [5, 23, .42, 3.3], [58, 16, .28, .7], [-18, 11, .18, 2.9], [40, 7.4, .11, 4.8] ];
const NW = WAVES.length;
const WV = WAVES.map(([d, L, A, ph]) => { const a = HEAD + d * RAD, k = 2 * Math.PI / L; return { dx: Math.sin(a), dz: -Math.cos(a), k, A, w: Math.sqrt(9.81 * k), ph }; });
const uW = WV.map(w => new THREE.Vector4(w.dx, w.dz, w.k, w.A)), uWp = WV.map(w => new THREE.Vector3(w.w, w.ph, Math.min(1, .62 / (w.k * w.A * NW))));
function heightAt(x, z, t){ let y = 0; const s = P.storm; for (const w of WV){ y += w.A * s * Math.sin(w.k * (w.dx * x + w.dz * z) - w.w * t + w.ph); } return y; }
sea.heightAt = heightAt;

const WAVE_GLSL = `
  uniform vec4 uW[${NW}]; uniform vec3 uWp[${NW}]; uniform float uT, uAmp;`;
const SKY_GLSL = `
  uniform vec3 uHor, uZen, uMoonDir, uGlowCol, uFlashCol, uFlashDir; uniform float uGlow, uFlash;
  vec3 skyCol(vec3 d){
    float y = clamp(d.y, 0., 1.);
    vec3 c = mix(uHor, uZen, pow(y, .42));
    float m = max(dot(normalize(vec3(d.x, max(d.y, .02), d.z)), uMoonDir), 0.);
    c += uGlowCol * uGlow * (pow(m, 5.) * .55 + pow(m, 40.) * .9);
    c += uFlashCol * uFlash * (.25 + .75 * pow(max(dot(d, uFlashDir), 0.), 3.));
    return c; }`;

/* ---------------- ocean ---------------- */
const oceanTex = Noise.ocean2D(256);
function radialGrid(rings, segs){
  const pos = [], idx = [];
  pos.push(0, 0, 0);
  for (let i = 1; i <= rings; i++){ const r = 1.2 + i * .85 + .009 * Math.pow(i, 2.75);
    for (let j = 0; j < segs; j++){ const a = j / segs * Math.PI * 2; pos.push(Math.cos(a) * r, 0, Math.sin(a) * r); } }
  for (let j = 0; j < segs; j++) idx.push(0, 1 + (j + 1) % segs, 1 + j);
  for (let i = 1; i < rings; i++) for (let j = 0; j < segs; j++){
    const a = 1 + (i - 1) * segs + j, b = 1 + (i - 1) * segs + (j + 1) % segs, c = 1 + i * segs + j, d = 1 + i * segs + (j + 1) % segs;
    idx.push(a, b, c, b, d, c); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
  g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6); return g;
}
const OU = { uW: { value: uW }, uWp: { value: uWp }, uT: { value: 0 }, uAmp: { value: 1 }, uCam: { value: new THREE.Vector3() }, tN: { value: oceanTex },
  uHor: { value: new THREE.Color() }, uZen: { value: new THREE.Color() }, uMoonDir: { value: new THREE.Vector3(0, .2, -1).normalize() }, uGlowCol: { value: new THREE.Color() },
  uGlow: { value: 1 }, uFlash: { value: 0 }, uFlashCol: { value: new THREE.Color(.75, .8, 1) }, uFlashDir: { value: new THREE.Vector3(0, .3, -1).normalize() },
  uDeep: { value: new THREE.Color(.0012, .0026, .0036) }, uSSS: { value: new THREE.Color(.0035, .0085, .0085) }, uFogD: { value: .001 }, uFoam: { value: 1 },
  uRocks: { value: Array.from({ length: 8 }, () => new THREE.Vector4(0, 0, 0, 0)) }, uMoonSpec: { value: 1 }, uMoonCol: { value: new THREE.Color(.5, .55, .62) } };
const ocean = new THREE.Mesh(radialGrid(230, 384), new THREE.ShaderMaterial({ uniforms: OU,
  vertexShader: `${WAVE_GLSL} uniform vec3 uCam; varying vec3 vPos; varying vec2 vXZ;
    void main(){
      vec2 xz = position.xz + floor(uCam.xz / 4.) * 4.;
      float dist = length(position.xz);
      vec3 p = vec3(xz.x, 0., xz.y);
      for (int i = 0; i < ${NW}; i++){
        vec4 w = uW[i]; vec3 q = uWp[i];
        float L = 6.2831853 / w.z, fade = 1. - smoothstep(L * 14., L * 40., dist);
        float th = w.z * dot(w.xy, xz) - q.x * uT + q.y, A = w.w * uAmp * fade;
        p.x += q.z * A * w.x * cos(th); p.z += q.z * A * w.y * cos(th); p.y += A * sin(th); }
      vPos = p; vXZ = xz; gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.); }`,
  fragmentShader: `${WAVE_GLSL} ${SKY_GLSL}
    uniform sampler2D tN; uniform vec3 uDeep, uSSS, uMoonCol; uniform float uFogD, uFoam, uMoonSpec; uniform vec4 uRocks[8];
    varying vec3 vPos; varying vec2 vXZ;
    void main(){
      vec3 toC = cameraPosition - vPos; float dist = length(toC); vec3 V = toC / dist;
      vec3 n = vec3(0., 1., 0.); float crest = 0.;
      for (int i = 0; i < ${NW}; i++){
        vec4 w = uW[i]; vec3 q = uWp[i];
        float L = 6.2831853 / w.z, fade = 1. - smoothstep(L * 10., L * 34., dist);
        float th = w.z * dot(w.xy, vXZ) - q.x * uT + q.y, WA = w.z * w.w * uAmp * fade, c = cos(th), s = sin(th);
        n.x -= w.x * WA * c; n.z -= w.y * WA * c; n.y -= q.z * WA * s; crest += q.z * WA * s; }
      n = normalize(n);
      float df = exp(-dist / 420.);
      vec2 u1 = vXZ / 41. + uT * vec2(.011, -.007), u2 = vXZ / 12.5 + uT * vec2(-.021, .016), u3 = vXZ / 4.1 + uT * vec2(.03, .021);
      vec3 d1 = texture2D(tN, u1).xyz * 2. - 1., d2 = texture2D(tN, u2).xyz * 2. - 1., d3 = texture2D(tN, u3).xyz * 2. - 1.;
      float sd = .35 + .65 * uAmp;
      n = normalize(n + vec3(d1.x * .55 + d2.x * .4 + d3.x * .3 * df, 0., d1.y * .55 + d2.y * .4 + d3.y * .3 * df) * (.35 + .65 * df) * sd);
      float ndv = clamp(dot(n, V), 0., 1.);
      float Fr = .02 + .98 * pow(1. - ndv, 5.);
      vec3 R = reflect(-V, n); R.y = abs(R.y) + .01;
      vec3 refl = skyCol(R);
      vec3 body = uDeep * (.6 + .4 * uGlow) + uHor * .22 * (.5 + .5 * n.y);
      float h = vPos.y / (3. * max(uAmp, .2));
      vec3 sss = uSSS * smoothstep(-.2, 1., h) * (.4 + .6 * pow(max(dot(-V, uMoonDir), 0.), 2.)) * (.3 + .7 * uGlow);
      vec3 col = mix(body + sss, refl, Fr);
      vec3 H = normalize(uMoonDir + V);
      col += uMoonCol * uMoonSpec * uGlow * (pow(max(dot(n, H), 0.), 260.) * .55 + pow(max(dot(n, H), 0.), 40.) * .018) * (1. - smoothstep(300., 2500., dist) * .5);
      // foam: wave crests, wind streaks, surf around rocks
      float fn = texture2D(tN, vXZ / 6.3 + d1.xy * .05).z, fs = texture2D(tN, vec2(dot(vXZ, uW[0].xy) / 9., dot(vXZ, vec2(-uW[0].y, uW[0].x)) / 70.)).z;
      float foam = smoothstep(.42, 1.05, crest + fn * .35 - .1) * uFoam * uAmp;
      foam += smoothstep(.6, .95, fs) * .18 * uAmp * uFoam * smoothstep(.0, .5, crest + .3);
      for (int i = 0; i < 8; i++){ vec4 r = uRocks[i]; if (r.w <= 0.) continue;
        float d = length(vXZ - r.xy) - r.z; float ring = exp(-max(d, 0.) / (6. + 7. * r.w)) * (.65 + .35 * sin(uT * 1.3 + d * .35 + float(i)));
        foam += ring * smoothstep(.15, .7, fn + .3) * r.w * 1.3; }
      foam = clamp(foam, 0., 1.) * (1. - smoothstep(1200., 5000., dist) * .7);
      vec3 foamCol = (uHor * 2.6 + uGlowCol * uGlow * .6 + uZen * 1.2) * (.75 + .35 * ndv) + uFlashCol * uFlash * .5;
      col = mix(col, foamCol, foam * .9);
      col += uFlashCol * uFlash * Fr * .4;
      vec3 fc = skyCol(normalize(vec3(-V.x, .03, -V.z)));
      float fog = 1. - exp(-dist * uFogD);
      gl_FragColor = vec4(mix(col, fc, fog), 1.); }` }));
ocean.frustumCulled = false; scene.add(ocean);

/* ---------------- sky dome (behind the clouds) ---------------- */
const dome = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 24), new THREE.ShaderMaterial({ uniforms: OU, side: THREE.BackSide, depthWrite: false, depthTest: false,
  vertexShader: `varying vec3 vD; void main(){ vD = position; vec4 c = projectionMatrix * vec4(mat3(viewMatrix) * position, 0.); c.z = c.w * .99999; gl_Position = c; }`,
  fragmentShader: `${SKY_GLSL} uniform float uFogD; varying vec3 vD; void main(){ vec3 d = normalize(vD); vec3 c = skyCol(vec3(d.x, max(d.y, .0), d.z)); gl_FragColor = vec4(c, 1.); }` }));
dome.renderOrder = -10; dome.frustumCulled = false; scene.add(dome);
const sky = Sky.make({ horizon: true, twinkle: .35 }); scene.add(sky.group);

/* ---------------- lights ---------------- */
const hemi = new THREE.HemisphereLight(0x6f86a8, 0x0a0e12, .35); scene.add(hemi);
const moonL = new THREE.DirectionalLight(0x9fb2cc, .5); scene.add(moonL); scene.add(moonL.target);
const flashL = new THREE.DirectionalLight(0xc8d2ff, 0); scene.add(flashL); scene.add(flashL.target);

/* ---------------- rain ---------------- */
const RN = 12000, rp = new Float32Array(RN * 6), re = new Float32Array(RN * 2), rr = Noise.rng(9);
for (let i = 0; i < RN; i++){ const x = rr(), y = rr(), z = rr(); rp.set([x, y, z, x, y, z], i * 6); re[i * 2] = 0; re[i * 2 + 1] = 1; }
const rg = new THREE.BufferGeometry(); rg.setAttribute('position', new THREE.BufferAttribute(rp, 3)); rg.setAttribute('aEnd', new THREE.BufferAttribute(re, 1));
rg.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6);
const RU = { uT: { value: 0 }, uCam: { value: new THREE.Vector3() }, uRain: { value: 1 }, uWind: { value: new THREE.Vector2(F[0] * 6, F[2] * 6) }, uFlash: { value: 0 }, uLum: { value: new THREE.Color(.05, .06, .075) } };
const rain = new THREE.LineSegments(rg, new THREE.ShaderMaterial({ uniforms: RU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  vertexShader: `attribute float aEnd; uniform float uT, uRain; uniform vec3 uCam; uniform vec2 uWind; varying float vA;
    void main(){ vec3 box = vec3(70., 46., 70.); vec3 vel = vec3(uWind.x, -10.5, uWind.y);
      vec3 p = position * box + vel * uT * (.85 + position.y * .3);
      p = mod(p - uCam + box * .5, box) + uCam - box * .5;
      if (aEnd > .5) p -= vel * .038;
      float d = distance(p, uCam); vA = uRain * smoothstep(.5, 3., d) * (1. - smoothstep(8., 22., d)) * (.35 + .65 * fract(position.x * 91.7));
      gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.); }`,
  fragmentShader: `uniform vec3 uLum; uniform float uFlash; varying float vA; void main(){ gl_FragColor = vec4((uLum + vec3(.5, .55, .7) * uFlash) * vA * 1.3, 1.); }` }));
rain.frustumCulled = false; scene.add(rain);

/* ---------------- ships of the line (procedural, c. 1700) ---------------- */
const wood = new THREE.MeshStandardMaterial({ color: 0x241b15, roughness: .82, metalness: 0 });
const canvasM = new THREE.MeshStandardMaterial({ color: 0x77705f, roughness: 1, metalness: 0, side: THREE.DoubleSide });
const winM = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.2, .6, .2), fog: true });
const rigM = new THREE.LineBasicMaterial({ color: 0x1a1612, transparent: true, opacity: .9 });
function hullGeo(L, B, D){
  const NS = 44, sec = [], pos = [], idx = [];
  const half = s => s < .1 ? .62 + .38 * Math.sin(s / .1 * Math.PI / 2) * .95 : s < .62 ? .99 + .01 * Math.sin(s * 3) : Math.pow(Math.max(0, 1 - Math.pow((s - .62) / .38, 2.1)), .85) * .99 + .015;
  const deck = s => 6.2 + 4.2 * Math.pow(Math.max(0, .3 - s) / .3, 1.4) + 2.4 * Math.pow(Math.max(0, s - .82) / .18, 2);
  const keel = s => D * (s < .08 ? .55 + .45 * s / .08 : s > .9 ? Math.max(.2, 1 - (s - .9) / .1 * .8) : 1);
  for (let i = 0; i <= NS; i++){
    const s = i / NS, b = B / 2 * half(s), h = deck(s), d = keel(s), x = (s - .5) * L;
    const prof = [[0, -d], [.42 * b, -.93 * d], [.78 * b, -.62 * d], [.97 * b, -.2 * d], [b, .15 * h], [.97 * b, .55 * h], [.88 * b, h]];
    const ring = []; for (let k = prof.length - 1; k >= 0; k--) ring.push([x, prof[k][1], -prof[k][0]]); for (let k = 1; k < prof.length; k++) ring.push([x, prof[k][1], prof[k][0]]);
    sec.push(ring); }
  const M = sec[0].length; sec.forEach(r => r.forEach(p => pos.push(...p)));
  for (let i = 0; i < NS; i++) for (let k = 0; k < M - 1; k++){ const a = i * M + k, b2 = a + 1, c = a + M, d2 = c + 1; idx.push(a, c, b2, b2, c, d2); }
  for (let i = 0; i < NS; i++){ const a = i * M, b2 = i * M + M - 1, c = a + M, d2 = b2 + M; idx.push(a, b2, c, b2, d2, c); } // deck
  const base = 0; for (let k = 1; k < M - 1; k++) idx.push(base, base + k, base + k + 1); // transom
  const e = NS * M; for (let k = 1; k < M - 1; k++) idx.push(e, e + k + 1, e + k);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  g.userData = { deck, half }; return g;
}
function cyl(r1, r2, h, a, b){ const g = new THREE.CylinderGeometry(r2, r1, h, 7, 1); g.translate(0, h / 2, 0);
  const v = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]); const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), v.clone().normalize());
  g.applyQuaternion(q); g.translate(a[0], a[1], a[2]); return g; }
function sail(w1, w2, h, bulge, x, y, z){ const g = new THREE.PlaneGeometry(1, 1, 6, 4), p = g.attributes.position;
  for (let i = 0; i < p.count; i++){ const u = p.getX(i) + .5, v = p.getY(i) + .5, w = w1 + (w2 - w1) * (1 - v);
    p.setXYZ(i, Math.sin(u * Math.PI) * bulge * (1 - .4 * v) + x, y - (1 - v) * h, (u - .5) * w + z); }
  g.computeVertexNormals(); return g; }
function makeShip(o = {}){
  const L = 52, B = 14.5, D = 6.3, grp = new THREE.Group();
  const hg = hullGeo(L, B, D), deck = hg.userData.deck;
  const parts = [hg], sails = [], rig = [];
  const masts = [[.80, 46, 28], [.52, 54, 33], [.24, 38, 22]]; // station, height, main yard span
  masts.forEach(([s, h, span], mi) => {
    const x = (s - .5) * L, y0 = deck(s);
    parts.push(cyl(.75, .45, h * .62, [x, y0 - 1, 0], [x, y0 + h * .6, 0]));
    parts.push(cyl(.45, .22, h * .42, [x, y0 + h * .55, 0], [x, y0 + h, 0]));
    const yards = [[.34, span], [.62, span * .74], [.86, span * .48]];
    yards.forEach(([f, sp], yi) => { const yy = y0 + h * f; parts.push(cyl(.28, .2, sp, [x, yy, -sp / 2], [x, yy, sp / 2]));
      // close-reefed storm canvas: only the lower topsail and fore course are set
      if ((yi === 1 && mi < 2) || (yi === 0 && mi === 0)) sails.push(sail(sp * .92, sp * .82, h * (yi === 0 ? .16 : .11), 1.6, x + .6, yy - .2, 0));
      else parts.push(cyl(.7, .6, sp * .82, [x + .2, yy - .5, -sp * .41], [x + .2, yy - .5, sp * .41])); // furled sail bundle
    });
    // shrouds and stays
    for (const side of [-1, 1]) for (let k = 0; k < 4; k++){ rig.push(x - 3 + k * 1.6, y0 + .5, side * B * .5, x, y0 + h * .55, side * .6); }
    rig.push(x, y0 + h, 0, mi === 0 ? L * .5 + 14 : x + L * .28, mi === 0 ? 13 : y0 + h * .5, 0);
  });
  parts.push(cyl(.6, .25, 24, [L * .5 - 2, deck(1) - .5, 0], [L * .5 + 17, deck(1) + 10, 0])); // bowsprit
  const strip = g => { if (g.attributes.uv) g.deleteAttribute('uv'); return g.index ? g.toNonIndexed() : g; };
  const hull = new THREE.Mesh(THREE.BufferGeometryUtils.mergeGeometries(parts.map(strip)), wood);
  const sl = new THREE.Mesh(THREE.BufferGeometryUtils.mergeGeometries(sails.map(strip)), canvasM);
  const rg2 = new THREE.BufferGeometry(); rg2.setAttribute('position', new THREE.Float32BufferAttribute(rig, 3)); const rl = new THREE.LineSegments(rg2, rigM);
  grp.add(hull, sl, rl);
  // stern gallery windows and lanterns
  const wins = []; const sx = -L / 2 - .05, sy = deck(0);
  for (let row = 0; row < 2; row++) for (let c = -2; c <= 2; c++){ const g = new THREE.PlaneGeometry(.7, .6); g.rotateY(-Math.PI / 2); g.translate(sx, sy - 2.6 - row * 2.1, c * 1.7); wins.push(g); }
  const wm = new THREE.Mesh(THREE.BufferGeometryUtils.mergeGeometries(wins), winM.clone()); grp.add(wm);
  const lant = [];
  const lpos = o.flag ? [[-L / 2 - .8, sy + 2.2, 0], [-L / 2 - .4, sy + 1.6, -3.2], [-L / 2 - .4, sy + 1.6, 3.2]] : [[-L / 2 - .8, sy + 2.2, 0]];
  lpos.forEach(p => { const s = new THREE.Sprite(lanternMat.clone()); s.position.set(...p); s.scale.set(3.2, 3.2, 1); grp.add(s); lant.push(s); });
  const pl = new THREE.PointLight(0xffa850, 0, 60, 1.6); pl.position.set(-L / 2 - 2, sy + 2, 0); grp.add(pl);
  grp.userData = { L, B, lant, wm, pl, level: 1 };
  return grp;
}
const lanternMat = new THREE.SpriteMaterial({ map: (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,240,210,1)'); g.addColorStop(.08, 'rgba(255,190,110,.9)'); g.addColorStop(.3, 'rgba(255,140,60,.22)'); g.addColorStop(1, 'rgba(255,120,40,0)');
  x.fillStyle = g; x.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })(),
  color: new THREE.Color(5, 3.2, 1.6), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false });
const ships = [makeShip({ flag: true }), makeShip(), makeShip(), makeShip()];
ships.forEach((s, i) => { s.userData.idx = i; scene.add(s); });
const place = { title: [[330, -62, 0], [930, 190, 4], [1550, -330, -6], [760, 470, 3]],
  rocks: [[2470, 130, -28], [2950, 520, -10], [3100, -240, -4], [3500, 260, 2]] };
function placeShips(name){ const pl = place[name]; if (!pl) return; ships.forEach((s, i) => { const [a, b, rot] = pl[i]; const p = at(a, b); s.userData.x = p[0]; s.userData.z = p[2]; s.userData.yaw = -HEAD + Math.PI / 2 + rot * RAD; }); }
placeShips('title');

/* ---------------- the Western Rocks ---------------- */
const rockM = new THREE.MeshStandardMaterial({ color: 0x1b1c1e, roughness: .5, metalness: .05 });
function hash3(x, y, z){ const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); }
function vnoise(x, y, z){ const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z), fx = x - ix, fy = y - iy, fz = z - iz, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy), w = fz * fz * (3 - 2 * fz);
  let r = 0; for (let k = 0; k < 2; k++) for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) r += hash3(ix + i, iy + j, iz + k) * (i ? u : 1 - u) * (j ? v : 1 - v) * (k ? w : 1 - w); return r; }
function rockGeo(seed, sx, sy, sz){ const g = new THREE.IcosahedronGeometry(1, 5), p = g.attributes.position;
  for (let i = 0; i < p.count; i++){ let x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    let n = 0, a = 1, f = 1.3; for (let o = 0; o < 5; o++){ n += (vnoise(x * f + seed, y * f * 1.6, z * f - seed) - .5) * a; a *= .52; f *= 2.1; }
    const strata = Math.sin(y * 9 + x * 2) * .04, r = 1 + n * .55 + strata;
    p.setXYZ(i, x * r * sx, (y > 0 ? Math.pow(y, .8) : y) * r * sy, z * r * sz); }
  g.computeVertexNormals(); return g; }
const rocks = [], rockDefs = [[2740, -40, 34, 17, 20, 1], [2700, 60, 14, 9, 11, 2], [2790, 95, 19, 7, 13, 3], [2660, -95, 11, 6, 9, 4], [2825, -110, 22, 11, 14, 5], [2600, 20, 6, 3.5, 6, 6], [2880, 30, 9, 5, 9, 7]];
rockDefs.forEach(([a, b, sx, sy, sz, seed], i) => { const m = new THREE.Mesh(rockGeo(seed * 3.1, sx, sy, sz), rockM); const p = at(a, b); m.position.set(p[0], -sy * .25, p[2]); m.rotation.y = seed; scene.add(m); rocks.push(m);
  OU.uRocks.value[i].set(p[0], p[2], Math.max(sx, sz) * .8, 1); });

/* ---------------- wreckage: planks, a broken spar, barrels (toll beat only, o.debris) ---------------- */
const debrisM = new THREE.MeshStandardMaterial({ color: 0x5c4532, emissive: 0x0e0a07, roughness: .78, metalness: 0, transparent: true, opacity: 0 });   // fades in with o.debris
const debris = [];
{ const C0 = [2330, 460], DV = [.715, -.699], NV = [.699, .715];   // toll camera position, view direction and its right, in (a, b)
  // [kind, metres ahead of the camera, metres to the right]: kept right of centre so the headline (bottom left) stays clear
  [['plank', 85, 22], ['plank', 95, 40], ['spar', 120, 30], ['barrel', 100, 55], ['plank', 140, 18], ['plank', 150, 62],
   ['barrel', 165, 38], ['plank', 180, 80], ['plank', 110, 70], ['plank', 130, 48], ['barrel', 78, 31]].forEach(([k, s, l], i) => {
    const g = k === 'spar' ? new THREE.CylinderGeometry(.45, .65, 17, 9).rotateZ(Math.PI / 2)   // a broken topmast
            : k === 'barrel' ? new THREE.CylinderGeometry(.85, .85, 2.1, 14).rotateZ(Math.PI / 2)
            : new THREE.BoxGeometry(6.5 + (i % 3) * 1.5, .45, 1.1);
    const m = new THREE.Mesh(g, debrisM), p = at(C0[0] + DV[0] * s + NV[0] * l, C0[1] + DV[1] * s + NV[1] * l);
    m.userData = { x: p[0], z: p[2], yaw: i * 1.7, ph: i * 2.3 }; m.visible = false; scene.add(m); debris.push(m); }); }
W.param('o.debris', 0);

/* ---------------- lightning ---------------- */
const boltMat = new THREE.LineMaterial({ color: new THREE.Color(3.2, 3.6, 5.4), linewidth: 1.6, transparent: true, opacity: 0, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, fog: false });
const post = sea.post = new THREE.Scene(); const boltGrp = new THREE.Group(); post.add(boltGrp);
function makeBolt(top, bottom, R){
  const pts = [top]; const segs = 26;
  for (let i = 1; i <= segs; i++){ const t = i / segs, prev = pts[pts.length - 1];
    pts.push([lerp(top[0], bottom[0], t) + (R() - .5) * 70 * (1 - t * .5), lerp(top[1], bottom[1], t), lerp(top[2], bottom[2], t)]); }
  const lines = [pts];
  for (let b = 0; b < 3; b++){ const k = 2 + Math.floor(R() * 10), s = pts[k], br = [s]; let c = s.slice();
    for (let j = 0; j < 6; j++){ c = [c[0] + (R() - .5) * 90, Math.max(40, c[1] - 22 - R() * 30), c[2]]; br.push(c); } lines.push(br); }
  return lines.map((L, i) => { const g = new THREE.LineGeometry(); g.setPositions(L.flat()); const m = new THREE.Line2(g, i ? boltMat.clone() : boltMat); m.userData.main = !i; return m; });
}
function lerp(a, b, t){ return a + (b - a) * t; }
const strikes = []; // {t0, power, pos:[x,y,z], bolt}
let every = null; // occasional distant flashes while a beat is held (never strobing)
function flashAt(t){ let f = 0, b = 0;
  for (const s of strikes){ const u = t - s.t0; if (u < 0 || u > 4) continue;
    const pulses = [[0, 1], [.11, .55], [.27, .85], [.5, .3]];
    for (const [d, a] of pulses){ const v = u - d; if (v >= 0){ const e = Math.exp(-v / .07) * a; f += e * s.power; if (s.bolt) b = Math.max(b, e * s.power); } }
    f += Math.exp(-u / .9) * .08 * s.power * (u > 0 ? 1 : 0); }
  return [f, b]; }
let boltObjs = [];
function scheduleStrikes(list, now){
  strikes.length = 0;
  (list || []).forEach((s, i) => {
    const pos = at(s.a || 2600, s.b || -600, 0);
    strikes.push({ t0: now + s.t, power: s.p || 1, bolt: !!s.bolt, pos });
    if (s.bolt){ boltObjs.forEach(o => boltGrp.remove(o)); const R = Noise.rng(77 + i * 13);
      boltObjs = makeBolt([pos[0], 470, pos[2]], [pos[0] + 40, 3, pos[2] + 25], R); boltObjs.forEach(o => boltGrp.add(o)); }
  });
}

/* ---------------- volumetric clouds (ray-marched, half resolution) ---------------- */
const noise3 = Noise.clouds3D(64);
const CU = { tN: { value: noise3 }, tDepth: { value: null }, uInvP: { value: new THREE.Matrix4() }, uCamW: { value: new THREE.Matrix4() }, uCamPos: { value: new THREE.Vector3() },
  uNear: { value: .5 }, uFar: { value: 60000 }, uBase: { value: 420 }, uTop: { value: 1500 }, uCov: { value: .9 }, uDens: { value: 1 }, uWind: { value: new THREE.Vector3() },
  uMoonDir: OU.uMoonDir, uMoonCol: { value: new THREE.Color(.55, .62, .75) }, uAmbTop: { value: new THREE.Color() }, uAmbBot: { value: new THREE.Color() },
  uFlash: { value: 0 }, uFlashPos: { value: new THREE.Vector3() }, uHazeCol: { value: new THREE.Color() }, uHaze: { value: .00008 }, uSteps: { value: 44 }, uRes: { value: new THREE.Vector2() },
  uGlow: OU.uGlow, uGlowCol: OU.uGlowCol, uT: { value: 0 }, uHole: { value: new THREE.Vector4(0, 0, 1, 0) } };
const cloudMat = new THREE.ShaderMaterial({ uniforms: CU, depthTest: false, depthWrite: false,
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }`,
  fragmentShader: `precision highp float; precision highp sampler3D;
    varying vec2 vUv; uniform sampler3D tN; uniform sampler2D tDepth; uniform mat4 uInvP, uCamW; uniform vec3 uCamPos, uWind, uMoonDir, uMoonCol, uAmbTop, uAmbBot, uFlashPos, uHazeCol, uGlowCol;
    uniform float uNear, uFar, uBase, uTop, uCov, uDens, uFlash, uHaze, uSteps, uGlow, uT; uniform vec2 uRes; uniform vec4 uHole;
    float dens(vec3 p, bool hi){
      float h = (p.y - uBase) / (uTop - uBase); if (h < 0. || h > 1.) return 0.;
      vec3 q = p * .00019 + uWind;
      vec4 n = texture(tN, q);
      float big = texture(tN, p * .000045 + uWind * .3).b;
      float shape = n.r * .7 + big * .45;
      float hg = smoothstep(0., .1, h) * (1. - smoothstep(.45 + .35 * big, 1., h));
      float c = shape * hg;
      float cov = clamp(uCov, 0., 1.);
      float d = clamp((c - (1. - cov) * .95) / max(.25, 1. - (1. - cov) * .95), 0., 1.);
      if (uHole.w > 0.){ float hd = length(p.xz - uHole.xy) / uHole.z; d *= mix(1., smoothstep(.35, 1.15, hd + (n.g - .5) * .5), uHole.w); }
      if (d <= 0.) return 0.;
      if (hi){ float e = texture(tN, p * .0011 + uWind * 2.3).g; d = clamp(d - e * .3 * (1. - d) - .02, 0., 1.); }
      return d * uDens;
    }
    float hgp(float c, float g){ float g2 = g * g; return (1. - g2) / pow(1. + g2 - 2. * g * c, 1.5) / 12.566; }
    void main(){
      vec2 ndc = vUv * 2. - 1.;
      vec4 vp = uInvP * vec4(ndc, 1., 1.); vp /= vp.w;
      vec3 rdv = normalize(vp.xyz); vec3 rd = normalize((uCamW * vec4(rdv, 0.)).xyz);
      vec3 ro = uCamPos;
      float d = texture2D(tDepth, vUv).r; float sceneT = 1e9;
      if (d < 1.){ float z = d * 2. - 1.; float vz = 2. * uNear * uFar / (uFar + uNear - z * (uFar - uNear)); sceneT = vz / max(-rdv.z, 1e-4); }
      float t0, t1;
      if (abs(rd.y) < 1e-5){ if (ro.y < uBase || ro.y > uTop){ gl_FragColor = vec4(0.); return; } t0 = 0.; t1 = 40000.; }
      else { float tb = (uBase - ro.y) / rd.y, tt = (uTop - ro.y) / rd.y; t0 = max(0., min(tb, tt)); t1 = max(tb, tt); }
      if (t1 <= 0.){ gl_FragColor = vec4(0.); return; }
      t1 = min(t1, min(sceneT, 42000.)); if (t1 <= t0){ gl_FragColor = vec4(0.); return; }
      t1 = min(t1, t0 + 24000.); float steps = uSteps; float dt = (t1 - t0) / steps; dt = clamp(dt, 14., 420.); 
      float jit = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(.06711056, .00583715))));
      float t = t0 + dt * jit, T = 1.; vec3 col = vec3(0.);
      float cth = dot(rd, uMoonDir), ph = mix(hgp(cth, .55), hgp(cth, -.2), .35) * 12.566;
      const float SIG = .028;
      for (int i = 0; i < 112; i++){
        if (float(i) >= steps || t > t1 || T < .015) break;
        vec3 p = ro + rd * t; float de = dens(p, t < 9000.);
        if (de > .002){
          float od = 0.; for (int j = 0; j < 4; j++){ float s = 40. + 110. * float(j) * float(j + 1) * .5; od += dens(p + uMoonDir * s, false) * (s * .45 + 30.); }
          float h = (p.y - uBase) / (uTop - uBase);
          float beer = exp(-od * SIG * .55), powder = 1. - exp(-de * 22.);
          vec3 L = uMoonCol * beer * mix(.55, 1., powder) * ph * (.35 + .65 * uGlow);
          vec3 amb = mix(uAmbBot, uAmbTop, pow(h, .7)) * (1. - de * .4);
          vec3 fd = p - uFlashPos; float fl = uFlash * (exp(-length(fd) / 900.) * 2.6 + .03);
          vec3 S = (L + amb + vec3(.62, .68, 1.) * fl) ;
          float sg = de * SIG, Tr = exp(-sg * dt);
          col += T * S * (1. - Tr); T *= Tr;
        }
        t += dt * (de > .002 ? 1. : 1.35);
      }
      float hz = 1. - exp(-t0 * uHaze);
      float mg = max(dot(normalize(vec3(rd.x, .03, rd.z)), uMoonDir), 0.);
      vec3 hc = uHazeCol + uGlowCol * uGlow * (pow(mg, 5.) * .55 + pow(mg, 40.) * .9);   // same horizon glow as the sea's far fog, so sky and sea meet softly
      col = mix(col, hc * (1. - T), hz);
      gl_FragColor = vec4(col, 1. - T);
    }` });
sea.cloudsOn = () => true;
sea.cloudPass = (r, depthTex, rt) => {
  CU.tDepth.value = depthTex; CU.uInvP.value.copy(cam.projectionMatrixInverse); CU.uCamW.value.copy(cam.matrixWorld); CU.uCamPos.value.copy(cam.position);
  CU.uNear.value = cam.near; CU.uFar.value = cam.far; CU.uSteps.value = W.Q.clouds; CU.uRes.value.set(rt.width, rt.height);
  W.pass(cloudMat, rt);
};

/* ---------------- per-frame ---------------- */
const tmpC = new THREE.Color();
const fogBase = new THREE.Color(), zen = new THREE.Color(), glowC = new THREE.Color(.34, .4, .5);
let bob = 0, bobR = 0;
sea.update = (T, dt, P) => {
  const storm = P.storm, calm = 1 - storm;
  OU.uT.value = T; OU.uAmp.value = .18 + .82 * storm; OU.uCam.value.copy(cam.position); ocean.position.set(0, 0, 0);
  const md = OU.uMoonDir.value; const ma = P.moonAz * RAD, me = P.moonEl * RAD; md.set(Math.sin(ma) * Math.cos(me), Math.sin(me), -Math.cos(ma) * Math.cos(me));
  const amb = P.ambient;
  // palette: storm is slate-blue; the clearing sky is deeper and bluer
  fogBase.setRGB(.016, .022, .031).lerp(tmpC.setRGB(.012, .02, .036), calm).multiplyScalar(amb);
  zen.setRGB(.008, .011, .016).lerp(tmpC.setRGB(.002, .004, .011), calm).multiplyScalar(amb);
  const thinAir = 1 - .88 * W.smoother((cam.position.y - 1500) / 1400); fogBase.multiplyScalar(thinAir); zen.multiplyScalar(thinAir);
  OU.uHor.value.copy(fogBase); OU.uZen.value.copy(zen); OU.uGlowCol.value.copy(glowC).multiplyScalar(.30 * amb * thinAir); OU.uGlow.value = P.glow;
  OU.uFogD.value = P.fogD; OU.uFoam.value = P.foam; OU.uMoonSpec.value = .6 + .9 * calm;
  scene.fog.color.copy(fogBase); scene.fog.density = P.fogD * 1.15;
  if (every && T > every.next && !W.reduced){ const R = Noise.rng(Math.floor(T)); strikes.push({ t0: T, power: .45 + R() * .4, bolt: false, pos: at(1800 + R() * 1500, (R() - .5) * 2400) }); every.next = T + every.dt * (.75 + R() * .5); if (strikes.length > 6) strikes.shift(); }
  const [fl, bo] = flashAt(T); const flash = W.reduced ? 0 : fl;
  OU.uFlash.value = flash * .05; RU.uFlash.value = flash * .08;
  const act = strikes.filter(x => x.t0 <= T).pop() || strikes[0];
  if (act){ const s = act.pos; CU.uFlashPos.value.set(s[0], 650, s[2]); OU.uFlashDir.value.set(s[0] - cam.position.x, 600, s[2] - cam.position.z).normalize(); flashL.position.set(s[0], 900, s[2]); flashL.target.position.copy(cam.position); }
  flashL.intensity = flash * 2.2;
  boltObjs.forEach(o => { o.material.opacity = Math.min(1, bo * 1.4) * (o.userData.main ? 1 : .55); o.material.resolution.set(W.W, W.H); o.visible = bo > .01; });
  // clouds
  CU.uBase.value = P.cbase; CU.uTop.value = P.ctop; CU.uCov.value = P.cov; CU.uDens.value = P.cdens; CU.uFlash.value = flash;
  { const tH = (P.cbase - cam.position.y) / Math.max(.05, md.y); CU.uHole.value.set(cam.position.x + md.x * tH, cam.position.z + md.z * tH, 1400 + tH * .25, P.hole); }
  CU.uWind.value.set(T * .0011 * P.cwind * F[0], 0, T * .0011 * P.cwind * F[2]);
  CU.uAmbTop.value.setRGB(.034, .042, .058).multiplyScalar(amb); CU.uAmbBot.value.setRGB(.006, .008, .012).multiplyScalar(amb);
  CU.uMoonCol.value.setRGB(.36, .41, .52).multiplyScalar(amb); CU.uHazeCol.value.copy(fogBase); CU.uHaze.value = .0001 + P.fogD * .17 * P.haze; CU.uT.value = T;
  hemi.intensity = .5 * amb + flash * .15; moonL.intensity = .35 * amb * P.glow; moonL.position.copy(md).multiplyScalar(1000).add(cam.position); moonL.target.position.copy(cam.position);
  // rain
  RU.uT.value = T; RU.uCam.value.copy(cam.position); RU.uRain.value = P.rain; RU.uLum.value.copy(fogBase).multiplyScalar(2.6).add(tmpC.setRGB(.012, .014, .018)); rain.visible = P.rain > .01;
  // sky
  sky.set(Sky.local(P.lat, P.lst)); sky.frame(T, W.H); sky.LU.uOp.value = P['o.con'] || 0; sky.U.uI.value = 3.4 * P.stars; sky.U.uMW.value = 1.9 * P.mw; { const pv = Sky.named('Polaris'); sky.U.uHi.value.set(pv[0], pv[1], pv[2], P['o.con'] || 0); } sky.group.visible = P.stars > .005 || P.mw > .005;
  dome.visible = true;
  // ships ride the swell
  ships.forEach((s, i) => { const u = s.userData; if (u.x == null) return;
    const L = u.L, B = u.B, cy = Math.cos(u.yaw), sy = Math.sin(u.yaw);
    const fx = cy * L * .4, fz = -sy * L * .4, px = sy * B * .5, pz = cy * B * .5;
    const hb = heightAt(u.x + fx, u.z + fz, T), hs = heightAt(u.x - fx, u.z - fz, T), hp = heightAt(u.x + px, u.z + pz, T), hq = heightAt(u.x - px, u.z - pz, T);
    const sink = i === 0 ? P.sink : 0;
    s.position.set(u.x, (hb + hs + hp + hq) / 4 * .85 - .4 - sink * 2.4, u.z);
    s.rotation.set(0, 0, 0); s.rotation.order = 'YZX'; s.rotation.y = u.yaw;
    s.rotation.z = Math.atan2(hb - hs, L * .8) * .8; s.rotation.x = -Math.atan2(hp - hq, B) * .8 + .07 * storm + sink * .16;
    const lv = P['lant' + i]; u.lant.forEach(l => { l.material.opacity = lv * (.92 + .08 * Math.sin(T * 9 + i * 3)); l.visible = lv > .01; });
    u.wm.material.color.setRGB(1.1 * lv, .52 * lv, .17 * lv); u.pl.intensity = 30 * lv;
  });
  // wreckage rides the swell and drifts a little
  const dv = P['o.debris'] || 0; debrisM.opacity = dv;
  debris.forEach(d => { d.visible = dv > .01; if (!d.visible) return;
    const u = d.userData, x = u.x + Math.sin(T * .07 + u.ph) * 3, z = u.z + Math.cos(T * .05 + u.ph) * 3, e = 1.2;
    const h0 = heightAt(x, z, T), hx = heightAt(x + e, z, T), hz = heightAt(x, z + e, T);
    d.position.set(x, h0 - .1, z);
    d.rotation.set(Math.atan2(hz - h0, e), u.yaw + T * .03, -Math.atan2(hx - h0, e), 'YXZ'); });
};
sea.breathe = (c, T) => { // gentle boat-borne motion near the water; still air higher up
  const y = c.position.y; if (y > 60) return;
  const k = 1 - Math.min(1, Math.max(0, (y - 12) / 48));
  const h = heightAt(c.position.x, c.position.z, T - .6) * .32 * P.storm * k;
  bob += (h - bob) * .06; c.position.y += bob;
  c.rotateZ(Math.sin(T * .37) * .006 * P.storm * k); c.rotateX(Math.sin(T * .29 + 1) * .004 * P.storm * k);
};
sea.onBeat = (b, prev, o) => {
  if (!o.active) return;
  if (b.ships && (o.instant || !prev || prev.env !== 'sea')) placeShips(b.ships);
  scheduleStrikes(o.fly || o.instant ? b.strikes : null, W.T);
  every = b.strikeEvery ? { dt: b.strikeEvery, next: W.T + (b.strikes && b.strikes.length ? b.strikes[b.strikes.length - 1].t : 0) + b.strikeEvery } : null;
  if (W.reduced) strikes.length = 0;
};
sea._dbg = () => ({ T: W.T, strikes: strikes.map(s => [s.t0, s.bolt]), bolt: boltObjs.map(o => [o.visible, o.material.opacity]), flash: flashAt(W.T) });
sea.bloom = () => [.85, .55, .55];
sea.grade = () => ({ expo: 1.55 * P.seaExpo, sat: .78, con: 1.0, lift: [0, 0, 0], gain: [.97, 1, 1.06] });
sea.vig = () => .42;
sea.aper = () => 0;
sea.at = at; sea.HEAD = HEAD; sea.ships = ships; sea.placeShips = placeShips; sea.rocks = rocks;
sea.anchor = { ship0: () => ships[0].position.clone().add(new THREE.Vector3(0, 24, 0)), rocks: () => rocks[0].position.clone().add(new THREE.Vector3(0, 22, 0)),
  polaris: () => { const v = Sky.local(P.lat, P.lst).clone(); const d = new THREE.Vector3(...Sky.named('Polaris')).applyMatrix3(v); return cam.position.clone().add(d.multiplyScalar(5000)); },
  sky: (alt) => { const d = new THREE.Vector3(0, Math.sin(alt * RAD), -Math.cos(alt * RAD)); return cam.position.clone().add(d.multiplyScalar(5000)); } };
})();
