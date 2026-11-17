/* space.js — things that live in the space environment: the latitude diagram (observer, horizon, Polaris rays, angles),
   the 1707 chart tracks, France's outline, the 1884 lines, the Moon, Jupiter and its moons, and the GPS constellation. */
(function(){
const W = World, P = W.P, RAD = Math.PI / 180, S = W.envs.space, v3 = S.v3;
const GOLD = 0xF2C27A, INK = 0xD8E0EA;

/* ================= latitude diagram (side view, observer on the right limb, in the z = 0 plane) ================= */
W.param('obsLat', 49.9);
// rebuild registration with materials
function regL(key, l, grp = S.fixedGrp){ S.reg(key, l, [l.material]); grp.add(l); return l; }
const ax2 = regL('axis', S.line([[0, -1.5, 0], [0, 1.55, 0]], { color: INK, w: 1.4 }));
const personMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 2.0, 1.7), transparent: true, opacity: 0, depthWrite: false });
const person = new THREE.Group();
{ const body = new THREE.Mesh(new THREE.CapsuleGeometry(.0085, .03, 4, 8), personMat); body.position.y = .026; const head = new THREE.Mesh(new THREE.SphereGeometry(.009, 12, 8), personMat); head.position.y = .056; person.add(body, head); }
S.reg('person', person, [personMat]); S.fixedGrp.add(person);
const horizon = regL('horizon', S.line([[0, 0, 0], [0, 0, 0]], { color: INK, w: 1.6, depth: false, order: 8 }));
const rays = [];
for (let i = 0; i < 6; i++){ const r = regL('rays', S.line([[0, 0, 0], [0, 0, 0]], { color: 0xF5DDB0, w: 1.2, depth: false, order: 7 })); rays.push(r); }
const arcObs = regL('angObs', S.line([[0, 0, 0], [0, 0, 0]], { color: GOLD, w: 2.6, depth: false, order: 9 }));
const zen = regL('angObs2', S.line([[0, 0, 0], [0, 0, 0]], { color: GOLD, w: 1.4, depth: false, order: 9, dash: [.02, .016] }));
const arcC = regL('angC', S.line([[0, 0, 0], [0, 0, 0]], { color: GOLD, w: 2.6, depth: false, order: 9 }));
const radC = regL('angC', S.line([[0, 0, 0], [0, 0, 0]], { color: GOLD, w: 1.6, depth: false, order: 9 }));
const eqC = regL('angC', S.line([[-1.32, 0, 0], [1.32, 0, 0]], { color: GOLD, w: 1.2, depth: false, order: 9, dash: [.03, .025] }));
// fix: several overlays share a key — make every one of them follow its key
function arc(c, r, a0, a1, n = 48){ const p = []; for (let i = 0; i <= n; i++){ const a = a0 + (a1 - a0) * i / n; p.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), 0]); } return p; }
let lastLat = null;
S.hooks.push((T, dt, P) => {
  const f = P.obsLat * RAD, O = [Math.cos(f), Math.sin(f), 0];
  person.position.set(O[0] * 1.001, O[1] * 1.001, 0); person.rotation.set(0, 0, f - Math.PI / 2);
  if (lastLat === P.obsLat) return; lastLat = P.obsLat;
  const hN = [-Math.sin(f), Math.cos(f), 0], E = .62;
  S.setLine(horizon, [[O[0] - hN[0] * E * .55, O[1] - hN[1] * E * .55, 0], [O[0] + hN[0] * E, O[1] + hN[1] * E, 0]]);
  const xs = [.25, .45, .62, .78, .92];
  rays.forEach((r, i) => { const x = i < 5 ? xs[i] : O[0]; const y0 = i < 5 ? Math.sqrt(Math.max(0, 1 - x * x)) : O[1] + .065; S.setLine(r, [[x, 2.4, 0], [x, y0, 0]]); });
  // observer: angle from the northern horizon up to Polaris (straight up the page)
  const hAng = Math.atan2(hN[1], hN[0]);
  S.setLine(arcObs, arc([O[0], O[1]], .2, hAng, Math.PI / 2)); S.setLine(zen, [[O[0], O[1], 0], [O[0], O[1] + .42, 0]]);
  S.setLine(arcC, arc([0, 0], .34, 0, f)); S.setLine(radC, [[0, 0, 0], [O[0], O[1], 0]]);
});
S.diagram = { obs: () => { const f = P.obsLat * RAD; return v3(Math.cos(f), Math.sin(f), 0); } };
S.anchor.obsAng = () => { const f = P.obsLat * RAD; const hA = Math.atan2(Math.cos(f), -Math.sin(f)); const m = (hA + Math.PI / 2) / 2; return v3(Math.cos(f) + .3 * Math.cos(m), Math.sin(f) + .3 * Math.sin(m), 0); };
S.anchor.cAng = () => { const f = P.obsLat * RAD; return v3(.5 * Math.cos(f / 2), .5 * Math.sin(f / 2), 0); };
S.anchor.obs = () => { const f = P.obsLat * RAD; return v3(Math.cos(f) * 1.08, Math.sin(f) * 1.08, 0); };
S.anchor.horizon = () => { const f = P.obsLat * RAD; return v3(Math.cos(f) - Math.sin(f) * .6, Math.sin(f) + Math.cos(f) * .6, 0); };
S.anchor.rays = () => v3(.95, 1.45, 0);
S.anchor.np = () => v3(0, 1.12, 0); S.anchor.sp = () => v3(0, -1.12, 0);
S.anchor.eqL = () => { const p = S.surf(0, -50 - P.spin + 90 + 30, 1.0); return { p: v3(-.98, -.02, .25), vis: 1 }; };

/* ================= 22 October 1707: where they thought they were, and where they were ================= */
const ghost = [[-9.2, 48.55], [-6.9, 48.95], [-4.2, 49.45]], real = [[-9.0, 49.25], [-6.75, 49.8], [-6.43, 49.872]];
const tG = S.geoLine(ghost, { color: 0xE8E4DC, w: 1.6, dash: [.0018, .0012] }); S.reg('ghost', tG, [tG.material]); S.spinGrp.add(tG);
const dG = S.dots([[-4.2, 49.45], [-4.32, 49.4], [-4.12, 49.38], [-4.26, 49.52]], { color: [1.6, 1.55, 1.5], size: 7 }); S.reg('ghost', dG, [dG.material]); S.spinGrp.add(dG);
const tR = S.geoLine(real, { color: GOLD, w: 2 }); S.reg('real', tR, [tR.material]); S.spinGrp.add(tR);
const dR = S.dots([[-6.43, 49.872], [-6.5, 49.84], [-6.38, 49.85], [-6.47, 49.9]], { color: [3.2, 2.0, .9], size: 8 }); S.reg('real', dR, [dR.material]); S.spinGrp.add(dR);
const gap = S.geoLine([[-4.2, 49.45], [-6.43, 49.872]], { color: 0xE8E4DC, w: 1, dash: [.0008, .0008] }); S.reg('gap', gap, [gap.material]); S.spinGrp.add(gap);

/* ================= France: the old outline slides onto the corrected one (schematic) ================= */
W.param('fr', 0);
let frLines = [];
try {
  const fc = window.FRANCE50 ? window.FRANCE50 : null;
  const topo = fc || null;
  const feats = [];
  if (topo && topo.type === 'Topology'){ /* not used */ }
  else if (topo && topo.features) topo.features.forEach(f => feats.push(f));
  else if (topo && topo.coordinates) feats.push({ geometry: topo });
  const rings = [];
  feats.forEach(f => { const g = f.geometry || f; const polys = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
    polys.forEach(pl => { const r = pl[0]; if (r.length > 30) rings.push(r); }); });
  S.frRings = rings;
} catch (e){ console.warn('france outline', e); S.frRings = []; }
const frTrue = [], frOld = [];
S.frRings.forEach(r => { const l = S.geoLine(r, { color: 0xF4F1EA, w: 2.4, r: 1.0012 }); S.reg('frTrue', l, [l.material]); S.spinGrp.add(l); frTrue.push(l);
  const o = S.geoLine(r, { color: GOLD, w: 3.2, r: 1.0016 }); o.userData.ring = r; S.reg('frOld', o, [o.material]); S.spinGrp.add(o); frOld.push(o); });
let lastFr = null;
S.hooks.push((T, dt, P) => { if (P.fr === lastFr) return; lastFr = P.fr; const k = 1 - P.fr;
  frOld.forEach(o => { const r = o.userData.ring.map(([lon, lat]) => [lon - 1.45 * k * Math.max(0, Math.min(1, (2.35 - lon) / 6.9)) * (lat < 48.9 && lat > 46 ? 1 : .75), lat]);
    const pts = []; r.forEach(p => pts.push(S.llObj(p[1], p[0], 1.0016))); S.setLine(o, pts); }); });

/* ================= 1884: the voting nations, and their lines to Greenwich ================= */
const VOTES = { yes: [['Austria-Hungary', 48.2, 16.4], ['Chile', -33.45, -70.67], ['Colombia', 4.6, -74.08], ['Costa Rica', 9.93, -84.08], ['Germany', 52.52, 13.4], ['Great Britain', 51.48, 0],
  ['Guatemala', 14.63, -90.5], ['Hawaii', 21.3, -157.86], ['Italy', 41.9, 12.5], ['Japan', 35.68, 139.7], ['Liberia', 6.3, -10.8], ['Mexico', 19.43, -99.13], ['Netherlands', 52.37, 4.9],
  ['Paraguay', -25.3, -57.6], ['Russia', 59.93, 30.3], ['Salvador', 13.7, -89.2], ['Spain', 40.4, -3.7], ['Sweden', 59.33, 18.07], ['Switzerland', 46.95, 7.45], ['Turkey', 41.0, 28.98],
  ['United States', 38.9, -77.04], ['Venezuela', 10.5, -66.9]], no: [['San Domingo', 18.47, -69.9]], abst: [['France', 48.86, 2.35], ['Brazil', -22.9, -43.2]] };
S.VOTES = VOTES;
const allV = [...VOTES.yes, ...VOTES.no, ...VOTES.abst];
const dV = S.dots(allV.map(v => [v[2], v[1]]), { color: [2.2, 2.2, 2.3], size: 8 }); S.reg('nations', dV, [dV.material]); S.spinGrp.add(dV);
const dY = S.dots(VOTES.yes.map(v => [v[2], v[1]]), { color: [3.2, 2.1, .9], size: 9 }); S.reg('yes', dY, [dY.material]); S.spinGrp.add(dY);
function gc(a, b, n = 80){ // great-circle arc between [lat,lon] pairs, slightly lifted
  const A = new THREE.Vector3(...S.llObj(a[0], a[1])), Bv = new THREE.Vector3(...S.llObj(b[0], b[1])), om = A.angleTo(Bv), pts = [];
  for (let i = 0; i <= n; i++){ const t = i / n; const s = Math.sin(om) || 1; const p = A.clone().multiplyScalar(Math.sin((1 - t) * om) / s).add(Bv.clone().multiplyScalar(Math.sin(t * om) / s));
    p.normalize().multiplyScalar(1.002 + Math.sin(t * Math.PI) * om * .06); pts.push(p.toArray()); } return pts; }
VOTES.yes.forEach(v => { if (v[0] === 'Great Britain') return; const l = S.line(gc([v[1], v[2]], [51.4779, 0]), { color: GOLD, w: 1.3 }); S.reg('yesLines', l, [l.material]); S.spinGrp.add(l); });

/* ================= the Moon (for lunar distances) ================= */
const moonTex = new THREE.TextureLoader().load(TEX.moon); moonTex.colorSpace = THREE.SRGBColorSpace; moonTex.anisotropy = 8;
const MOONC = v3(-3000, 400, -2000);
const moon = new THREE.Mesh(new THREE.SphereGeometry(1, 128, 64), new THREE.MeshStandardMaterial({ map: moonTex, roughness: 1, metalness: 0 }));
moon.position.copy(MOONC); moon.scale.setScalar(12); S.scene.add(moon); S.MOONC = MOONC;
W.param('moonDrift', 0);
W.param('moonV', 1);
moon.material.transparent = true;
S.hooks.push((T, dt, P) => { moon.visible = P.moonV > .01; moon.material.opacity = P.moonV; moon.material.depthWrite = P.moonV > .99; moon.position.copy(MOONC).add(v3(P.moonDrift * 30, P.moonDrift * 6, 0)); moon.rotation.y = 2.4; });
S.anchor.moon = () => moon.position.clone().add(v3(0, -16, 0));

/* ================= Jupiter and the Galilean moons ================= */
const jupTex = new THREE.TextureLoader().load(TEX.jupiter); jupTex.colorSpace = THREE.SRGBColorSpace; jupTex.anisotropy = 8;
const JC = v3(5200, -300, -3800); S.JC = JC;
const jup = new THREE.Mesh(new THREE.SphereGeometry(1, 128, 64), new THREE.MeshStandardMaterial({ map: jupTex, roughness: .95, metalness: 0 }));
jup.scale.set(40, 37.4, 40); jup.position.copy(JC); S.scene.add(jup);
const galMats = [];
const GAL = [['Io', 1.769, 5.9, 1.0, [1.0, .9, .6]], ['Europa', 3.551, 9.4, .9, [.95, .92, .86]], ['Ganymede', 7.155, 15.0, 1.5, [.8, .76, .7]], ['Callisto', 16.69, 26.4, 1.4, [.55, .5, .46]]];
const moons = GAL.map(([n, per, a, r, c], i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 24), new THREE.ShaderMaterial({ uniforms: { uSun: { value: S.sun }, uC: { value: new THREE.Color(...c) }, uJ: { value: JC }, uJR: { value: 40 } },
  vertexShader: `varying vec3 vN, vW; void main(){ vN = normalize(mat3(modelMatrix) * normal); vW = (modelMatrix * vec4(position, 1.)).xyz; gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.); }`,
  fragmentShader: `uniform vec3 uSun, uC, uJ; uniform float uJR; varying vec3 vN, vW;
    void main(){ float l = max(dot(normalize(vN), uSun), 0.); vec3 rel = vW - uJ; float along = dot(rel, uSun); vec3 perp = rel - uSun * along;
      float sh = along < 0. ? smoothstep(uJR * .96, uJR * 1.04, length(perp)) : 1.;  // Jupiter's shadow cylinder
      gl_FragColor = vec4(uC * (l * 1.6 * sh + .012), 1.); }` }));
  m.scale.setScalar(r * 1.6); S.scene.add(m); return { m, per, a: a * 11.5, n }; });
W.param('jt', 0); // simulated hours
S.hooks.push((T, dt, P) => { jup.visible = P.moonV > .5; moons.forEach(o => o.m.visible = P.moonV > .5); });  // Act VI hides Moon, Jupiter and moons (moonV)
S.hooks.push((T, dt, P) => { moons.forEach((o, i) => { const th = (P.jt / 24) / o.per * Math.PI * 2 + i * 1.7 + 2.2; o.m.position.copy(JC).add(v3(Math.cos(th) * o.a, Math.sin(th) * o.a * .04, Math.sin(th) * o.a)); }); jup.rotation.y = T * .02; });
S.anchor.io = () => moons[0].m.position.clone().add(v3(0, 5, 0));
S.anchor.jupiter = () => JC.clone().add(v3(0, 46, 0));
S.galMoons = moons;
// Jupiter's shadow cone, drawn faintly so the eclipse reads
const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0, depthWrite: false });
W.param('o.jshadow', 0);

/* ================= GPS constellation: 32 satellites, 6 planes, 55° inclination, ~20,200 km up ================= */
const RG = (6371 + 20200) / 6371; S.RG = RG;
const satGeo = (() => { const parts = [new THREE.BoxGeometry(.035, .035, .05)]; const p1 = new THREE.BoxGeometry(.16, .002, .045); p1.translate(.1, 0, 0); const p2 = p1.clone(); p2.translate(-.2, 0, 0); parts.push(p1, p2);
  return THREE.BufferGeometryUtils.mergeGeometries(parts.map(g => g.toNonIndexed())); })();
const satMat = new THREE.MeshStandardMaterial({ color: 0xc9ccd2, metalness: .6, roughness: .35, emissive: new THREE.Color(.05, .05, .06), transparent: true, opacity: 0 });
const satGlowMat = new THREE.SpriteMaterial({ map: S.dotTex, color: new THREE.Color(3, 2.6, 2), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 });
const SATS = [];
const slots = [6, 5, 6, 5, 5, 5]; // 32 active satellites across planes A–F
slots.forEach((n, pl) => { const raan = pl * 60 * RAD;
  for (let i = 0; i < n; i++){ const ph = (i / n) * Math.PI * 2 + pl * .37; SATS.push({ raan, ph, inc: 55 * RAD, pl }); } });
const satGrp = new THREE.Group(); S.scene.add(satGrp);
SATS.forEach(s => { const m = new THREE.Mesh(satGeo, satMat); const g = new THREE.Sprite(satGlowMat); g.scale.set(.09, .09, 1); s.m = m; s.g = g; satGrp.add(m, g); });
const orbitLines = slots.map((n, pl) => { const pts = []; for (let i = 0; i <= 256; i++){ const a = i / 256 * Math.PI * 2; pts.push(orbPos(pl * 60 * RAD, 55 * RAD, a).toArray()); }
  const l = S.line(pts, { color: 0x9FB4CC, w: 1, add: true }); l.material.userData.k = .5; S.reg('orbits', l, [l.material]); S.scene.add(l); return l; });
function orbPos(raan, inc, u){ // circular orbit: argument of latitude u
  const x = Math.cos(u), y = Math.sin(u) * Math.cos(inc), z = Math.sin(u) * Math.sin(inc);
  // equatorial frame (x to RAAN 0) → world (equatorial plane is x–z, north +Y)
  const X = x * Math.cos(raan) - y * Math.sin(raan), Y = x * Math.sin(raan) + y * Math.cos(raan);
  return v3(Y * RG, z * RG, X * RG); }
S.orbPos = orbPos;
W.param('gpsT', 0); W.param('o.sats', 0); W.param('o.sat1', 0); W.param('o.pulses', 0);
const navstarOrbit = (() => { const pts = []; for (let i = 0; i <= 256; i++) pts.push(orbPos(20 * RAD, 63 * RAD, i / 256 * Math.PI * 2).toArray()); const l = S.line(pts, { color: GOLD, w: 1.4 }); S.reg('navOrbit', l, [l.material]); S.scene.add(l); return l; })();
const nav = { m: new THREE.Mesh(satGeo, satMat.clone()), g: new THREE.Sprite(satGlowMat.clone()) }; nav.g.scale.set(.12, .12, 1); S.scene.add(nav.m, nav.g); nav.m.material.opacity = 0;
// signal pulses: expanding light-spheres from each satellite (faint, slow)
const pulseMat = new THREE.ShaderMaterial({ uniforms: { uA: { value: 0 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  vertexShader: `varying vec3 vN, vV; void main(){ vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position, 1.); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
  fragmentShader: `uniform float uA; varying vec3 vN, vV; void main(){ float f = pow(1. - abs(dot(vN, vV)), 3.); gl_FragColor = vec4(vec3(.95, .78, .5) * f * uA, 1.); }` });
const pulseGeo = new THREE.SphereGeometry(1, 48, 24);
const pulses = SATS.map((s, i) => { const m = new THREE.Mesh(pulseGeo, pulseMat.clone()); m.userData.off = (i * .618) % 1; S.scene.add(m); m.visible = false; return m; });
S.SATS = SATS;
S.satPos = (s, t) => orbPos(s.raan, s.inc, s.ph + t * Math.PI * 2 / 12);   // t in hours: two orbits a day
S.hooks.push((T, dt, P) => {
  const a = P['o.sats'] || 0;
  satMat.opacity = a; satGlowMat.opacity = a * .9; satGrp.visible = a > .01;
  SATS.forEach((s, i) => { const p = S.satPos(s, P.gpsT); s.m.position.copy(p); s.g.position.copy(p); s.m.lookAt(0, 0, 0); s.cur = p; });
  const n1 = P['o.sat1'] || 0; const np = orbPos(20 * RAD, 63 * RAD, P.gpsT * Math.PI * 2 / 12 + 1.1); nav.m.position.copy(np); nav.g.position.copy(np); nav.m.lookAt(0, 0, 0);
  nav.m.material.opacity = n1; nav.g.material.opacity = n1; nav.m.visible = nav.g.visible = n1 > .01;
  const pa = P['o.pulses'] || 0;
  pulses.forEach((m, i) => { if (pa < .01 || i % 4){ m.visible = false; return; } const ph = ((T * .11 + m.userData.off) % 1); m.visible = true; m.position.copy(SATS[i].cur);   // 8 of 32, slow and faint
    m.scale.setScalar(.05 + ph * 1.9); m.material.uniforms.uA.value = pa * Math.sin(Math.PI * Math.min(1, ph * 1.4)) * (1 - ph) * .085; });
});
S.anchor.navstar = () => nav.m.position.clone().add(v3(0, .12, 0));
})();
