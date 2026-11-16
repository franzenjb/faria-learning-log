/* globe.js — the 'space' environment: a photoreal Earth (NASA Blue Marble NG day, Black Marble 2016 night, clouds), an atmosphere,
   the terminator, and procedural cartography drawn in the Earth shader (graticule, equator, meridians, the 24 hour-slices,
   bingo row/column) so lines stay crisp at any zoom and can unroll with the globe into a flat map.
   Object space: north = +Y, longitude 0 → +Z, 90° E → +X. Earth radius = 1. */
(function(){
const W = World, P = W.P, RAD = Math.PI / 180;
const sp = W.env('space', { clear: 0x000000 });
const scene = sp.scene = new THREE.Scene();
const cam = sp.cam = new THREE.PerspectiveCamera(36, 16 / 9, .002, 50000);
const defs = { spin: 96.4, sunAz: -40, sunEl: 18, night: 1, clouds: .9, dim: 0, even: 0, atmo: 1, grat: 0, eq: 0, slices: 0, sliceOff: -7.5, unroll: 0,
  mer0: 0, mer1: 0, mer2: 0, mer3: 0, merLon0: 0, merLon1: -18, merLon2: 2.337, merLon3: -77, par0: 0, parLat0: 39, par1: 0, parLat1: 51.5,
  rowA: 0, rowLat: 38.9, colA: 0, colLon: -77.04, moonlit: 0, det: 0, detSel: 0, mwS: .45, starsS: 1, expoS: 1, cloudOff: 0, earth: 1, merAll: 0, merAllGold: 0, parAll: 0 };
for (const k in defs) W.param(k, defs[k]);
const loader = new THREE.TextureLoader();
function tex(key, o = {}){ const t = loader.load(TEX[key]); t.colorSpace = o.lin ? THREE.NoColorSpace : THREE.SRGBColorSpace; t.anisotropy = 8;
  if (o.clamp){ t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; } else t.wrapS = THREE.RepeatWrapping; t.minFilter = THREE.LinearMipmapLinearFilter; return t; }
const T = { day: tex('day'), night: tex('night', { lin: true }), mask: tex('mask', { lin: true }), cl: tex('clouds', { lin: true }),
  fl: tex('flday', { clamp: true }), fln: tex('flnight', { clamp: true, lin: true }), ch: tex('chday', { clamp: true }) };
const DET = [[T.ch, T.night, [-12, -1, 46, 54]], [T.fl, T.fln, [-88, -76, 22, 32]]];

/* sphere with its seam on the far side of the unroll centre (−40°: the Atlantic in the middle) */
const CLON = -40;
function sphere(r, nx = 360, ny = 180){
  const pos = [], ll = [], idx = [];
  for (let j = 0; j <= ny; j++){ const lat = (j / ny - .5) * Math.PI;
    for (let i = 0; i <= nx; i++){ const lon = (CLON - 180 + i / nx * 360) * RAD; pos.push(r * Math.cos(lat) * Math.sin(lon), r * Math.sin(lat), r * Math.cos(lat) * Math.cos(lon)); ll.push(lon, lat); } }
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++){ const a = j * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1; idx.push(a, b, c, b, d, c); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('aLL', new THREE.Float32BufferAttribute(ll, 2)); g.setIndex(idx);
  g.computeBoundingSphere(); g.boundingSphere.radius = 8; return g;
}
const sun = new THREE.Vector3(1, 0, 0);
const EU = { tDay: { value: T.day }, tNight: { value: T.night }, tMask: { value: T.mask }, tCl: { value: T.cl }, tDet: { value: T.ch }, tDetN: { value: T.night },
  uDetB: { value: new THREE.Vector4(-12, -1, 46, 54) }, uDetMix: { value: 0 }, uSun: { value: sun }, uNightI: { value: 1 }, uCloudsI: { value: .9 }, uDim: { value: 0 }, uEven: { value: 0 },
  uAtmo: { value: 1 }, uGrat: { value: 0 }, uEq: { value: 0 }, uSlices: { value: 0 }, uSliceOff: { value: -7.5 }, uMerLon: { value: new THREE.Vector4() }, uMerA: { value: new THREE.Vector4() },
  uParLat: { value: new THREE.Vector2() }, uParA: { value: new THREE.Vector2() }, uRow: { value: new THREE.Vector3() }, uCol: { value: new THREE.Vector3() },
  uCloudOff: { value: 0 }, uMoonlit: { value: 0 }, uUnroll: { value: 0 }, uCLon: { value: CLON * RAD }, uPlaneAz: { value: 0 }, uPlaneS: { value: .62 }, uPlaneC: { value: new THREE.Vector3() },
  uMerAll: { value: 0 }, uMerAllGold: { value: 0 }, uParAll: { value: 0 }, uR: { value: 1 } };
const VERT = `attribute vec2 aLL; uniform float uUnroll, uCLon, uPlaneAz, uPlaneS, uR; uniform vec3 uPlaneC; varying vec2 vLL; varying vec3 vN, vW;
  void main(){
    vLL = aLL;
    vec3 ws = (modelMatrix * vec4(position, 1.)).xyz;
    vec3 ns = normalize(mat3(modelMatrix) * position);
    float rl = aLL.x - uCLon;
    float u = clamp(uUnroll * 1.7 - abs(rl) / 3.14159 * .7, 0., 1.); u = u * u * (3. - 2. * u);
    vec3 right = vec3(cos(uPlaneAz), 0., -sin(uPlaneAz)), fwd = vec3(sin(uPlaneAz), 0., cos(uPlaneAz));
    vec3 pp = uPlaneC + (right * rl + vec3(0., 1., 0.) * aLL.y) * uPlaneS * uR + fwd * (uR - 1.) * .02;
    vW = mix(ws, pp, u); vN = normalize(mix(ns, fwd, u));
    gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.); }`;
const earthMat = new THREE.ShaderMaterial({ uniforms: EU, vertexShader: VERT, extensions: {},
  fragmentShader: `uniform sampler2D tDay, tNight, tMask, tCl, tDet, tDetN; uniform vec4 uDetB, uMerLon, uMerA; uniform vec3 uSun, uRow, uCol; uniform vec2 uParLat, uParA;
    uniform float uDetMix, uNightI, uCloudsI, uDim, uEven, uAtmo, uGrat, uEq, uSlices, uSliceOff, uCloudOff, uMoonlit, uUnroll, uMerAll, uMerAllGold, uParAll;
    varying vec2 vLL; varying vec3 vN, vW;
    vec4 texE(sampler2D t, vec2 uv){ vec2 uv2 = vec2(fract(uv.x + .5), uv.y); vec2 dx = dFdx(uv), dy = dFdy(uv), dx2 = dFdx(uv2), dy2 = dFdy(uv2);
      if (abs(dx2.x) < abs(dx.x)) dx.x = dx2.x; if (abs(dy2.x) < abs(dy.x)) dy.x = dy2.x; return textureGrad(t, uv, dx, dy); }
    float wrapd(float a){ return mod(a + 180., 360.) - 180.; }
    float lineAt(float d, float w, float px){ return 1. - smoothstep(px * .5 * w, (px * .5 + 1.) * w, abs(d)); }
    void main(){
      float lon = degrees(vLL.x), lat = degrees(vLL.y);
      vec2 uv = vec2(fract((lon + 180.) / 360.), (lat + 90.) / 180.);
      vec3 day = texE(tDay, uv).rgb; float nl = texE(tNight, uv).r; float water = 1. - texE(tMask, uv).r;
      if (uDetMix > 0.){ vec2 dd = vec2((lon - uDetB.x) / (uDetB.y - uDetB.x), (lat - uDetB.z) / (uDetB.w - uDetB.z));
        float w = smoothstep(0., .07, min(dd.x, 1. - dd.x)) * smoothstep(0., .07, min(dd.y, 1. - dd.y));
        if (w > 0.){ day = mix(day, texture2D(tDet, dd).rgb, w * uDetMix); } }
      vec3 N = normalize(vN), V = normalize(cameraPosition - vW);
      float ndl = dot(N, uSun);
      float even = max(uEven, smoothstep(.0, .6, uUnroll));
      float dayF = mix(smoothstep(-.10, .16, ndl), 1., even);
      vec2 cuv = vec2(fract(uv.x + uCloudOff), uv.y);
      float cs = texE(tCl, cuv + vec2(-.0015, .001)).r * uCloudsI * (1. - even);
      float lamb = mix(.16 + .84 * clamp(ndl * 1.1 + .06, 0., 1.), .95, even) * mix(1., .62, even * smoothstep(58., 84., abs(lat)));
      vec3 col = pow(day, vec3(1.06)) * 1.08 * lamb * dayF * (1. - cs * .45);
      float lights = pow(nl, 1.4) * uNightI * (1. - smoothstep(-.16, .05, ndl)) * (1. - even);
      col += lights * vec3(1., .68, .34) * 1.5;
      vec3 hv = normalize(uSun + V); float nh = max(dot(N, hv), 0.);
      col += (pow(nh, 160.) * .16 + pow(nh, 18.) * .035) * water * dayF * (1. - even) * vec3(1., .93, .82) * (1. - cs);
      col += exp(-pow(ndl / .07, 2.)) * .12 * (1. - even) * vec3(1., .45, .18) * day * 2.;
      float rim = pow(1. - clamp(dot(N, V), 0., 1.), 2.6) * (1. - even);
      vec3 atm = vec3(.36, .6, 1.); float lit = clamp(ndl * .9 + .3, 0., 1.);
      col = mix(col, atm * lit * .8, clamp(rim * .7 * uAtmo, 0., 1.)); col += atm * rim * .2 * lit * uAtmo;
      // clouds on top (same pixel; the cloud shell handles parallax at the limb)
      float lum = dot(col, vec3(.299, .587, .114));
      if (uMoonlit > 0.){ col = mix(col, vec3(lum) * vec3(.55, .7, 1.05), uMoonlit * .8) * (1. - .35 * uMoonlit); }
      col = mix(col, vec3(lum) * .7, uDim * .55) * (1. - uDim * .55);
      // ---- cartography (screen-constant line widths) ----
      float wl = fwidth(lat), wo = fwidth(lon); wo = min(wo, 4.);
      vec3 gold = vec3(1., .72, .34) * 1.25, ink = vec3(.82, .88, .96);
      float g15 = max(lineAt(mod(lat + 7.5, 15.) - 7.5, wl, 1.), lineAt(mod(lon + 7.5, 15.) - 7.5, wo, 1.)) * step(abs(lat), 89.);
      col = mix(col, ink, g15 * uGrat * .45);
      col = mix(col, ink, lineAt(mod(lat + 7.5, 15.) - 7.5, wl, 1.5) * uParAll * mix(.8, .42, even) * step(abs(lat), 80.));
      float ma = lineAt(mod(lon + 7.5, 15.) - 7.5, wo, 1.6) * uMerAll * step(abs(lat), 80.); col = mix(col, mix(ink, gold, uMerAllGold), ma * mix(.75, .4, even));
      col = mix(col, gold, lineAt(lat, wl, 2.2) * uEq);
      for (int i = 0; i < 4; i++){ float a = uMerA[i]; if (a <= 0.) continue; float d = wrapd(lon - uMerLon[i]);
        col = mix(col, i == 0 ? gold : vec3(1.), lineAt(d, wo, 2.4) * a * step(abs(lat), 89.5)); }
      for (int i = 0; i < 2; i++){ float a = uParA[i]; if (a <= 0.) continue; col = mix(col, gold, lineAt(lat - uParLat[i], wl, 2.2) * a); }
      if (uSlices > 0.){ float s = (lon - uSliceOff) / 15.; float k = mod(floor(s), 2.);
        col *= 1. - uSlices * .22 * k; col = mix(col, ink, lineAt((fract(s + .5) - .5) * 15., wo, 1.4) * uSlices * .7 * step(abs(lat), 88.)); }
      if (uRow.z > 0.){ float d = abs(lat - uRow.x); float band = 1. - smoothstep(uRow.y - wl, uRow.y + wl, d); col = mix(col, gold * .55, band * .32 * uRow.z); col = mix(col, gold, lineAt(d - uRow.y, wl, 1.5) * uRow.z); }
      if (uCol.z > 0.){ float d = abs(wrapd(lon - uCol.x)); float band = 1. - smoothstep(uCol.y - wo, uCol.y + wo, d); col = mix(col, gold * .55, band * .32 * uCol.z); col = mix(col, gold, lineAt(d - uCol.y, wo, 1.5) * uCol.z); }
      gl_FragColor = vec4(col, 1.); }` });
const earthGeo = sphere(1);
const earth = new THREE.Mesh(earthGeo, earthMat); scene.add(earth);
const CLU = Object.assign({}, EU, { uR: { value: 1.008 } });
const cloudMesh = new THREE.Mesh(sphere(1.008, 240, 120), new THREE.ShaderMaterial({ uniforms: CLU, vertexShader: VERT, transparent: true, depthWrite: false,
  fragmentShader: `uniform sampler2D tCl; uniform vec3 uSun; uniform float uCloudsI, uCloudOff, uUnroll, uMoonlit, uDim; varying vec2 vLL; varying vec3 vN, vW;
    void main(){ float lon = degrees(vLL.x), lat = degrees(vLL.y); vec2 uv = vec2(fract((lon + 180.) / 360. + uCloudOff), (lat + 90.) / 180.);
      vec2 uv2 = vec2(fract(uv.x + .5), uv.y); vec2 dx = dFdx(uv), dy = dFdy(uv), dx2 = dFdx(uv2), dy2 = dFdy(uv2); if (abs(dx2.x) < abs(dx.x)) dx.x = dx2.x; if (abs(dy2.x) < abs(dy.x)) dy.x = dy2.x;
      float c = textureGrad(tCl, uv, dx, dy).r; c = smoothstep(.08, .9, c);
      vec3 N = normalize(vN), V = normalize(cameraPosition - vW); float ndl = dot(N, uSun);
      float l = smoothstep(-.12, .25, ndl) * (.25 + .75 * clamp(ndl + .15, 0., 1.));
      vec3 col = vec3(1.) * l + vec3(1., .5, .25) * exp(-pow(ndl / .09, 2.)) * .25;
      col = mix(col, vec3(dot(col, vec3(.33))) * vec3(.6, .72, 1.), uMoonlit * .8) * (1. - .4 * uMoonlit) * (1. - uDim * .6);
      float a = c * uCloudsI * (1. - smoothstep(0., .25, uUnroll)) * mix(.65, 1., pow(1. - abs(dot(N, V)), .5));
      gl_FragColor = vec4(col * a, a); }`, blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor }));
scene.add(cloudMesh);
const atmo = new THREE.Mesh(new THREE.SphereGeometry(1.04, 128, 64), new THREE.ShaderMaterial({ uniforms: { uSun: { value: sun }, uAtmo: { value: 1 } }, side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  vertexShader: `varying vec3 vW; void main(){ vW = (modelMatrix * vec4(position, 1.)).xyz; gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.); }`,
  fragmentShader: `uniform vec3 uSun; uniform float uAtmo; varying vec3 vW;
    void main(){ vec3 ro = cameraPosition, rd = normalize(vW - ro); float b = dot(-ro, rd); vec3 cp = ro + rd * b; float h = length(cp);
      if (b < 0.) cp = vW; 
      float x = max(h - 1., 0.) / .04; float dens = exp(-x * 4.2) * (1. - smoothstep(.85, 1., x));
      vec3 cn = normalize(cp); float sl = dot(cn, uSun);
      float lit = smoothstep(-.3, .35, sl);
      vec3 c = mix(vec3(1., .42, .16) * .9, vec3(.3, .56, 1.), smoothstep(-.08, .35, sl)) * lit;
      gl_FragColor = vec4(c * dens * uAtmo * 1.5, 1.); }` }));
scene.add(atmo);
const sky = Sky.make({}); scene.add(sky.group); sky.set(Sky.SPACE);
const sunL = new THREE.DirectionalLight(0xfff4e6, 3); scene.add(sunL); scene.add(sunL.target);
const ambL = new THREE.AmbientLight(0x404a5a, .25); scene.add(ambL);
// the Sun itself (a soft, very bright disc; bloom does the rest)
const sunSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d');
  const g = x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.06, 'rgba(255,250,235,1)'); g.addColorStop(.12, 'rgba(255,230,190,.35)'); g.addColorStop(.4, 'rgba(255,200,150,.05)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g; x.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c); })(), color: new THREE.Color(9, 8.5, 7.5), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
sunSpr.scale.set(600, 600, 1); scene.add(sunSpr); W.param('sunVis', 0);

/* ---------- helpers: geo positions, overlay registry, lines ---------- */
const v3 = (x, y, z) => new THREE.Vector3(x, y, z);
function llv(lat, lon, r = 1){ const az = (lon + P.spin) * RAD, la = lat * RAD; return v3(r * Math.cos(la) * Math.sin(az), r * Math.sin(la), r * Math.cos(la) * Math.cos(az)); }
function llObj(lat, lon, r = 1){ const az = lon * RAD, la = lat * RAD; return [r * Math.cos(la) * Math.sin(az), r * Math.sin(la), r * Math.cos(la) * Math.cos(az)]; }
function planePos(lat, lon){ const rl = ((lon - CLON + 540) % 360 - 180) * RAD, az = EU.uPlaneAz.value, s = EU.uPlaneS.value, c = EU.uPlaneC.value;
  return v3(c.x + Math.cos(az) * rl * s, c.y + lat * RAD * s, c.z - Math.sin(az) * rl * s); }
function surf(lat, lon, r = 1.004){ // world position of a surface point, following spin and unroll
  const a = llv(lat, lon, r), u = P.unroll; if (u <= 0) return a;
  const rl = Math.abs(((lon - CLON + 540) % 360 - 180) * RAD); let k = Math.min(1, Math.max(0, u * 1.7 - rl / Math.PI * .7)); k = k * k * (3 - 2 * k);
  return a.lerp(planePos(lat, lon), k); }
function visible(p){ // is a world point on the visible side of the globe?
  if (P.unroll > .5) return 1; const n = p.clone().normalize(), d = cam.position.clone().sub(p).normalize(); const v = n.dot(d); return Math.max(0, Math.min(1, (v + .05) / .15)) * (P.earth > .5 ? 1 : 0); }
const spinGrp = new THREE.Group(); scene.add(spinGrp);  // things fixed to the Earth's surface
const fixedGrp = new THREE.Group(); scene.add(fixedGrp); // diagram things fixed in space
const overlays = [];   // { key, obj, mats, base }
const lineMats = [];
function reg(key, obj, mats, base = 1){ W.param('o.' + key, 0); overlays.push({ key, obj, mats: [].concat(mats), base }); obj.visible = false; return obj; }
function lmat(o = {}){ const m = new THREE.LineMaterial({ color: new THREE.Color(o.color || 0xF2C27A), linewidth: o.w || 2, transparent: true, opacity: 0, depthTest: o.depth !== false, depthWrite: false,
  dashed: !!o.dash, dashSize: o.dash ? o.dash[0] : 1, gapSize: o.dash ? o.dash[1] : 1, worldUnits: false });
  if (o.add) m.blending = THREE.AdditiveBlending; lineMats.push(m); return m; }
function line(pts, o = {}){ const g = new THREE.LineGeometry(); g.setPositions(pts.flat()); const l = new THREE.Line2(g, lmat(o)); if (o.dash) l.computeLineDistances(); l.renderOrder = o.order || 5; return l; }
function geoLine(lls, o = {}){ // lls: [[lon,lat],...] → great-circle-ish densified line on the surface (object space, put in spinGrp)
  const pts = []; for (let i = 0; i < lls.length - 1; i++){ const a = lls[i], b = lls[i + 1]; const n = Math.max(2, Math.ceil(Math.hypot(a[0] - b[0], a[1] - b[1]) / .25));
    for (let k = 0; k < n; k++){ const t = k / n; pts.push(llObj(a[1] + (b[1] - a[1]) * t, a[0] + (b[0] - a[0]) * t, o.r || 1.0015)); } }
  const e = lls[lls.length - 1]; pts.push(llObj(e[1], e[0], o.r || 1.0015)); return line(pts, o); }
function setLine(l, pts){ l.geometry.setPositions(pts.flat()); if (l.material.dashed) l.computeLineDistances(); }
const dotTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.25, 'rgba(255,255,255,.85)'); g.addColorStop(.5, 'rgba(255,255,255,.18)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c); })();
function dots(lls, o = {}){ // glowing points on the surface (screen-sized)
  const pos = []; lls.forEach(p => pos.push(...llObj(p[1], p[0], o.r || 1.003)));
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  const m = new THREE.PointsMaterial({ map: dotTex, size: (o.size || 9), sizeAttenuation: false, color: new THREE.Color(...(o.color || [3, 2.1, 1.1])), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
  const pts = new THREE.Points(g, m); pts.renderOrder = 6; return pts; }

/* ---------- per-frame ---------- */
sp.update = (Tm, dt, P) => {
  earth.rotation.y = P.spin * RAD; cloudMesh.rotation.y = P.spin * RAD; spinGrp.rotation.y = P.spin * RAD;
  sun.set(Math.cos(P.sunEl * RAD) * Math.sin(P.sunAz * RAD), Math.sin(P.sunEl * RAD), Math.cos(P.sunEl * RAD) * Math.cos(P.sunAz * RAD));
  sunL.position.copy(sun).multiplyScalar(100); sunL.target.position.set(0, 0, 0);
  sunSpr.position.copy(cam.position).addScaledVector(sun, 20000); sunSpr.material.opacity = P.sunVis; sunSpr.visible = P.sunVis > .01;
  EU.uNightI.value = P.night; EU.uCloudsI.value = P.clouds; EU.uDim.value = P.dim; EU.uEven.value = P.even; EU.uAtmo.value = P.atmo; atmo.material.uniforms.uAtmo.value = P.atmo * (1 - P.unroll);
  EU.uGrat.value = P.grat; EU.uEq.value = P.eq; EU.uSlices.value = P.slices; EU.uSliceOff.value = P.sliceOff;
  EU.uMerLon.value.set(P.merLon0, P.merLon1, P.merLon2, P.merLon3); EU.uMerA.value.set(P.mer0, P.mer1, P.mer2, P.mer3);
  EU.uParLat.value.set(P.parLat0, P.parLat1); EU.uParA.value.set(P.par0, P.par1);
  EU.uRow.value.set(P.rowLat, .5, P.rowA); EU.uCol.value.set(P.colLon, .5, P.colA); EU.uMoonlit.value = P.moonlit; EU.uMerAll.value = P.merAll; EU.uParAll.value = P.parAll; EU.uMerAllGold.value = P.merAllGold;
  EU.uCloudOff.value = P.cloudOff + Tm * .00012; EU.uUnroll.value = P.unroll;
  const d = DET[P.detSel | 0]; EU.tDet.value = d[0]; EU.tDetN.value = d[1]; EU.uDetB.value.set(...d[2]); EU.uDetMix.value = P.det;
  // the unrolled map faces the camera's azimuth at the moment of unrolling
  EU.uPlaneAz.value = (CLON + P.spin) * RAD; EU.uPlaneC.value.set(0, 0, 0);
  earth.visible = cloudMesh.visible = atmo.visible = P.earth > .01;
  sky.frame(Tm, W.H); sky.U.uI.value = 1.7 * P.starsS; sky.U.uMW.value = P.mwS; sky.LU.uOp.value = 0;
  for (const o of overlays){ const a = (P['o.' + o.key] || 0) * o.base; o.obj.visible = a > .003; o.mats.forEach(m => { m.opacity = a * (m.userData.k == null ? 1 : m.userData.k); }); }
  for (const m of lineMats) m.resolution.set(W.W, W.H);
  for (const f of sp.hooks) f(Tm, dt, P);
};
sp.hooks = [];
sp.breathe = (c, Tm) => { };
sp.bloom = () => [.55 + (P.bloomS || 0), .6, .78];
W.param('bloomS', 0);
sp.grade = () => ({ expo: 1.05 * P.expoS, sat: 1.02, con: 1.04 });
sp.vig = () => .3;
sp.aper = () => 0;
Object.assign(sp, { llv, llObj, surf, visible, reg, line, geoLine, setLine, dots, lmat, spinGrp, fixedGrp, earth, sun, EU, CLON, v3, dotTex });
sp.anchor = {};
/* anchor helper for labels: a surface point that hides behind the globe */
sp.at = (lat, lon, r = 1.006) => () => { const p = surf(lat, lon, r); return { p, vis: visible(p) }; };
})();
