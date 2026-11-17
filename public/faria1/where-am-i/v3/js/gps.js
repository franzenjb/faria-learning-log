/* gps.js — Act VI additions to the space environment: orbit trails; the four-satellite fix (light-spheres whose
   ground circles meet on one spot; a receiver clock error pushes them apart); city hops; the pale blue dot. */
(function(){
const W = World, P = W.P, S = W.envs.space, v3 = S.v3, RAD = Math.PI / 180, RG = S.RG, RE = 6371;
const GOLD = 0xF2C27A;
/* ---- orbit trails: a fading arc behind each satellite ---- */
const trailN = 28, trails = S.SATS.map(s => { const l = S.line(new Array(trailN).fill([0, 0, 0]), { color: 0xF5DDB0, w: 1.6, add: true }); l.frustumCulled = false; l.material.userData.k = .55; S.reg('trails', l, [l.material]); S.scene.add(l); return l; });
S.hooks.push((T, dt, P) => { if ((P['o.trails'] || 0) < .01) return; S.SATS.forEach((s, i) => { const pts = []; for (let k = 0; k < trailN; k++) pts.push(S.satPos(s, P.gpsT - k * .045).toArray()); S.setLine(trails[i], pts); }); });

/* ---- the fix ---- */
const CITIES = [['Fort Myers', 26.6406, -81.8723], ['Seattle', 47.6062, -122.3321], ['Denver', 39.7392, -104.9903], ['Chicago', 41.8781, -87.6298], ['Houston', 29.7604, -95.3698], ['New York', 40.7128, -74.006]];
S.CITIES = CITIES;
W.param('hopT', 0); W.param('shellA', 1); W.param('rayA', 0); W.param('clkErr', 0); W.param('grow', 1); W.param('fixSnap', 0);
const SKY = [[35, 52], [148, 38], [255, 44], [322, 68]];       // azimuth, elevation of the four satellites seen from the receiver
function cityAt(h){ const i = Math.max(0, Math.min(CITIES.length - 1, Math.floor(h))), j = Math.min(CITIES.length - 1, i + 1), f = h - i; const e = f * f * (3 - 2 * f);
  return { lat: CITIES[i][1] + (CITIES[j][1] - CITIES[i][1]) * e, lon: CITIES[i][2] + (CITIES[j][2] - CITIES[i][2]) * e, name: CITIES[f > .5 ? j : i][0], idx: h }; }
function frame(lat, lon){ const t = v3(...S.llObj(lat, lon, 1)); const up = t.clone().normalize(); const north = v3(0, 1, 0).sub(up.clone().multiplyScalar(up.y)).normalize(); const east = north.clone().cross(up).normalize(); return { t, up, north, east }; }
function satFrom(fr, az, el){ const u = fr.north.clone().multiplyScalar(Math.cos(el * RAD) * Math.cos(az * RAD)).add(fr.east.clone().multiplyScalar(Math.cos(el * RAD) * Math.sin(az * RAD))).add(fr.up.clone().multiplyScalar(Math.sin(el * RAD)));
  const b = fr.t.dot(u), c = fr.t.lengthSq() - RG * RG, s = -b + Math.sqrt(b * b - c); return fr.t.clone().add(u.multiplyScalar(s)); }
const satGeo = (() => { const parts = [new THREE.BoxGeometry(.05, .05, .07)]; const p1 = new THREE.BoxGeometry(.22, .003, .06); p1.translate(.14, 0, 0); const p2 = p1.clone(); p2.translate(-.28, 0, 0); parts.push(p1, p2);
  return THREE.BufferGeometryUtils.mergeGeometries(parts.map(g => g.toNonIndexed())); })();
const shellVS = `varying vec3 vN, vV; void main(){ vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position, 1.); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`;
const shellFS = `uniform float uA; uniform vec3 uC; varying vec3 vN, vV; void main(){ float f = pow(1. - abs(dot(normalize(vN), normalize(vV))), 2.4); gl_FragColor = vec4(uC * f * .9 * uA, 1.); }`;
const fx = [0, 1, 2, 3].map(i => { const key = 'fs' + i;
  const sat = new THREE.Mesh(satGeo, new THREE.MeshStandardMaterial({ color: 0xd4d7dc, metalness: .6, roughness: .3, emissive: new THREE.Color(.08, .08, .09), transparent: true, opacity: 0 }));
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: S.dotTex, color: new THREE.Color(3.2, 2.6, 1.8), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 })); glow.scale.set(.22, .22, 1);
  const shell = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 48), new THREE.ShaderMaterial({ uniforms: { uA: { value: 0 }, uC: { value: new THREE.Color(.95, .74, .42) } }, vertexShader: shellVS, fragmentShader: shellFS,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
  shell.material.userData.k = .5;
  const ring = S.line(new Array(181).fill([0, 0, 0]), { color: GOLD, w: 2.6, depth: true, order: 9 });
  const ray = S.line([[0, 0, 0], [0, 0, 0]], { color: 0xF5DDB0, w: 1, dash: [.05, .04], order: 8 }); ray.material.userData.k = .55;
  [sat, glow, shell, ring, ray].forEach(o => { o.frustumCulled = false; S.spinGrp.add(o); });
  S.reg(key, sat, [sat.material, glow.material, shell.material, ring.material, ray.material]); [glow, shell, ring, ray].forEach(o => o.visible = false);
  return { sat, glow, shell, ring, ray, key }; });
const dot = S.dots([[0, 0]], { color: [3.6, 2.6, 1.4], size: 16, r: 1.004 }); dot.frustumCulled = false; S.reg('fixDot', dot, [dot.material]); S.spinGrp.add(dot);
let cur = null;
S.hooks.push((T, dt, P) => {
  const any = fx.some(f => (P['o.' + f.key] || 0) > .01) || (P['o.fixDot'] || 0) > .01; if (!any){ fx.forEach(f => [f.glow, f.shell, f.ring, f.ray].forEach(o => o.visible = false)); return; }
  const c = cityAt(P.hopT); cur = c; const fr = frame(c.lat, c.lon), rot = Math.floor(P.hopT + .5) * 41;
  dot.geometry.attributes.position.setXYZ(0, ...fr.t.clone().multiplyScalar(1.004).toArray()); dot.geometry.attributes.position.needsUpdate = true;
  const bias = P.clkErr * 300 / RE;
  fx.forEach((f, i) => { const a = P['o.' + f.key] || 0; const vis = a > .01; [f.glow, f.ring].forEach(o => o.visible = vis); f.shell.visible = vis && P.shellA > .01; f.ray.visible = vis && P.rayA > .01; if (!vis) return;
    const sp = satFrom(fr, SKY[i][0] + rot, SKY[i][1]); f.sat.position.copy(sp); f.glow.position.copy(sp); f.sat.lookAt(0, 0, 0);
    const r = sp.distanceTo(fr.t) + bias * (1 - P.fixSnap), d = sp.length();
    f.shell.material.uniforms.uA.value = a * .16 * P.shellA;
    f.shell.position.copy(sp); f.shell.scale.setScalar(Math.max(.001, r * P.grow));
    const ct = (1 + d * d - r * r) / (2 * d), th = Math.acos(Math.max(-1, Math.min(1, ct)));
    const n = sp.clone().normalize(), e1 = v3(0, 1, 0).cross(n).normalize(), e2 = n.clone().cross(e1); const pts = [];
    const gr = P.grow >= .999 ? 1 : 0;
    for (let k = 0; k <= 180; k++){ const a2 = k / 180 * Math.PI * 2; const p = n.clone().multiplyScalar(Math.cos(th)).add(e1.clone().multiplyScalar(Math.sin(th) * Math.cos(a2))).add(e2.clone().multiplyScalar(Math.sin(th) * Math.sin(a2))); pts.push(p.multiplyScalar(1.004).toArray()); }
    S.setLine(f.ring, pts); f.ring.material.opacity = a * gr;
    S.setLine(f.ray, [sp.toArray(), fr.t.toArray()]); f.ray.material.opacity = a * P.rayA * .55; });
});
S.anchor.fix = () => { const c = cur || cityAt(P.hopT); const p = S.surf(c.lat, c.lon, 1.006); return { p, vis: S.visible(p) }; };
S.anchor.fsat = i => () => fx[i].sat.getWorldPosition(new THREE.Vector3()).add(v3(0, .18, 0));
S.cityName = () => (cur || cityAt(P.hopT)).name;

/* ---- pale blue dot: one broad, very soft beam of scattered sunlight (screen space) and a single pale-blue point inside it ---- */
const beamMat = new THREE.ShaderMaterial({ uniforms: { uA: { value: 0 }, uDot: { value: new THREE.Vector2() }, uAsp: { value: 1.78 } }, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
  vertexShader: `varying vec2 vP; void main(){ vP = position.xy; gl_Position = vec4(position.xy, 0., 1.); }`,
  fragmentShader: `uniform float uA; uniform vec2 uDot; uniform float uAsp; varying vec2 vP;
    float h(float x){ return fract(sin(x * 127.1) * 43758.5453); }
    float n1(float x){ float i = floor(x), f = fract(x); return mix(h(i), h(i + 1.), f * f * (3. - 2. * f)); }
    void main(){ vec2 q = (vP - uDot) * vec2(uAsp, 1.);
      vec2 dir = normalize(vec2(.42, 1.)); vec2 nrm = vec2(-dir.y, dir.x);
      float across = dot(q, nrm) + .025, along = dot(q, dir);
      float beam = exp(-across * across / (2. * .21 * .21));
      float core = exp(-across * across / (2. * .06 * .06)) * .22;
      float streak = .86 + .14 * n1(across * 22. + 1.7);
      float fall = smoothstep(-2.4, .9, along);              // brighter toward the (off-frame) Sun, up and to the right
      vec3 c = vec3(.062, .047, .040) * (beam * streak + core) * fall;
      gl_FragColor = vec4(c * uA, 1.); }` });
const beam = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), beamMat); beam.frustumCulled = false; beam.renderOrder = 2;
const pbd = new THREE.Group(); S.scene.add(pbd); pbd.add(beam);
const blue = new THREE.Sprite(new THREE.SpriteMaterial({ map: S.dotTex, color: new THREE.Color(.75, .95, 2.1), blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, transparent: true, opacity: 0 }));
blue.renderOrder = 3; pbd.add(blue); S.reg('pbd', pbd, [blue.material]);
const pv = new THREE.Vector3();
S.hooks.push((T, dt, P) => { const a = P['o.pbd'] || 0; beamMat.uniforms.uA.value = a; if (a < .01) return; const cam = S.cam, d = cam.position.length();
  blue.position.set(0, 0, 0); blue.scale.setScalar(d * .0062); blue.frustumCulled = false;
  pv.set(0, 0, 0).project(cam); beamMat.uniforms.uDot.value.set(pv.x, pv.y); beamMat.uniforms.uAsp.value = W.W / W.H;
});
})();
