/* h4.js — a studio for John Harrison's H4 (1759): a silver pair-case watch about 13 cm across, white enamel dial,
   Roman hours, blued hands; behind the open case, a gilt movement with a turning gear train and a balance that beats
   five times a second. Procedural geometry and canvas textures; lit by a studio environment map. Units: 1 = 6.6 cm. */
(function(){
const W = World, P = W.P, RAD = Math.PI / 180;
const st = W.env('studio', { clear: 0x000000 });
const scene = st.scene = new THREE.Scene();
const cam = st.cam = new THREE.PerspectiveCamera(30, 16 / 9, .01, 200);
W.param('h4open', 0); W.param('h4spin', 0); W.param('h4bg', 1);
if (W.r){ const pm = new THREE.PMREMGenerator(W.r); scene.environment = pm.fromScene(new THREE.RoomEnvironment(), .03).texture; scene.environmentIntensity = .45; }

/* backdrop: a soft graded sphere, like a dark photo studio sweep */
const bg = new THREE.Mesh(new THREE.SphereGeometry(60, 48, 24), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, uniforms: { uA: { value: 1 } },
  vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
  fragmentShader: `varying vec3 vP; uniform float uA; void main(){ float g = smoothstep(-.6, .9, vP.y); vec3 c = mix(vec3(.004, .005, .007), vec3(.035, .042, .055), g);
    c += vec3(.06, .045, .03) * pow(max(0., dot(vP, normalize(vec3(.5, .3, .8)))), 6.) * .6; gl_FragColor = vec4(c * uA, 1.); }` }));
scene.add(bg);
const key = new THREE.DirectionalLight(0xfff1df, 1.3); key.position.set(3, 4, 5); scene.add(key);
const rim = new THREE.DirectionalLight(0xbfd4ff, .9); rim.position.set(-4, 2, -3); scene.add(rim);
scene.add(new THREE.AmbientLight(0x202530, .4));

const watch = new THREE.Group(); scene.add(watch);
const silver = new THREE.MeshPhysicalMaterial({ color: 0xe3e3e6, metalness: 1, roughness: .16, clearcoat: .4, clearcoatRoughness: .2 });
const gilt = new THREE.MeshStandardMaterial({ color: 0xd9ad5b, metalness: 1, roughness: .32 });
const giltDark = new THREE.MeshStandardMaterial({ color: 0xb48a3f, metalness: 1, roughness: .42 });
const steel = new THREE.MeshStandardMaterial({ color: 0xc8ccd2, metalness: 1, roughness: .22 });
const blued = new THREE.MeshPhysicalMaterial({ color: 0x0d1a3a, metalness: .9, roughness: .25, clearcoat: 1, clearcoatRoughness: .1 });
const ruby = new THREE.MeshPhysicalMaterial({ color: 0x9a0f22, metalness: 0, roughness: .05, clearcoat: 1, emissive: 0x2a0005 });

/* ---- case: a lathe profile (front bezel, bulging band, open back rim) ---- */
const prof = [[0.0, .30], [.90, .30], [.985, .27], [1.03, .2], [1.06, .08], [1.065, -.05], [1.05, -.17], [1.0, -.26], [.94, -.30], [.92, -.27], [.95, -.18], [.97, -.05], [.96, .12], [.93, .24], [.9, .26]].map(p => new THREE.Vector2(p[0], p[1]));
const caseG = new THREE.LatheGeometry(prof.slice(1), 160); caseG.rotateX(Math.PI / 2);   // axis → Z (dial faces +Z)
const caseM = new THREE.Mesh(caseG, silver); watch.add(caseM);
const bezel = new THREE.Mesh(new THREE.TorusGeometry(.93, .045, 24, 160), silver); bezel.position.z = .29; watch.add(bezel);
// pendant, crown and bow at 12 o'clock
const pend = new THREE.Mesh(new THREE.CylinderGeometry(.075, .095, .2, 32), silver); pend.position.set(0, 1.14, 0); watch.add(pend);
const crown = new THREE.Mesh(new THREE.CylinderGeometry(.11, .11, .09, 40), silver); crown.position.set(0, 1.27, 0); watch.add(crown);
const bow = new THREE.Mesh(new THREE.TorusGeometry(.32, .035, 20, 80, Math.PI * 1.25), silver); bow.rotation.z = -Math.PI * .125; bow.position.set(0, 1.27, 0); bow.rotation.y = Math.PI / 2; watch.add(bow);

/* ---- dial: white enamel, Roman hours, Arabic minutes, painted scrollwork ---- */
const dc = document.createElement('canvas'); dc.width = dc.height = 2048; const dTex = new THREE.CanvasTexture(dc); dTex.colorSpace = THREE.SRGBColorSpace; dTex.anisotropy = 8;
function drawDial(){
  const x = dc.getContext('2d'), C = 1024, R = 1000; x.clearRect(0, 0, 2048, 2048);
  const g = x.createRadialGradient(C - 200, C - 260, 100, C, C, R); g.addColorStop(0, '#fbf8f0'); g.addColorStop(1, '#ebe5d6'); x.fillStyle = g; x.beginPath(); x.arc(C, C, R, 0, 7); x.fill();
  x.strokeStyle = '#1b1712'; x.fillStyle = '#1b1712';
  x.lineWidth = 3; [880, 838, 650, 628].forEach(r => { x.beginPath(); x.arc(C, C, r, 0, 7); x.stroke(); });
  for (let i = 0; i < 60; i++){ const a = i / 60 * Math.PI * 2; x.lineWidth = i % 5 ? 3 : 7; const r0 = i % 5 ? 838 : 820;
    x.beginPath(); x.moveTo(C + Math.sin(a) * r0, C - Math.cos(a) * r0); x.lineTo(C + Math.sin(a) * 880, C - Math.cos(a) * 880); x.stroke(); }
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = '400 64px "Newsreader", Georgia, serif';
  for (let m = 5; m <= 60; m += 5){ const a = m / 60 * Math.PI * 2; x.save(); x.translate(C + Math.sin(a) * 935, C - Math.cos(a) * 935); x.rotate(a); x.fillText(String(m), 0, 0); x.restore(); }
  const RN = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
  x.font = '400 150px "Instrument Serif", "Newsreader", Georgia, serif';
  RN.forEach((n, i) => { const a = i / 12 * Math.PI * 2; x.save(); x.translate(C + Math.sin(a) * 740, C - Math.cos(a) * 740); x.rotate(a); x.fillText(n, 0, 6); x.restore(); });
  // painted scrollwork in the centre (H4's dial carries black floral ornament)
  x.lineWidth = 6; x.lineCap = 'round';
  for (let k = 0; k < 4; k++){ x.save(); x.translate(C, C); x.rotate(k * Math.PI / 2 + Math.PI / 4);
    for (let s = -1; s <= 1; s += 2){ x.save(); x.scale(s, 1); x.beginPath(); x.moveTo(0, -120); x.bezierCurveTo(90, -200, 220, -180, 250, -300); x.bezierCurveTo(270, -390, 180, -430, 140, -380); x.bezierCurveTo(110, -340, 150, -300, 185, -320); x.stroke();
      x.beginPath(); x.moveTo(60, -170); x.bezierCurveTo(40, -260, 70, -330, 30, -420); x.stroke();
      for (let l = 0; l < 3; l++){ x.beginPath(); x.ellipse(120 + l * 45, -230 - l * 40, 34, 13, -.7 - l * .3, 0, 7); x.fill(); } x.restore(); }
    x.restore(); }
  x.beginPath(); x.arc(C, C, 60, 0, 7); x.stroke();
  x.font = 'italic 400 58px "Newsreader", Georgia, serif'; x.fillText('John Harrison & Son', C, C + 470); x.font = '400 46px "Newsreader", Georgia, serif'; x.fillText('A.D. 1759', C, C + 540);
  dTex.needsUpdate = true; }
drawDial(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawDial);
const dial = new THREE.Mesh(new THREE.CircleGeometry(.9, 128), new THREE.MeshPhysicalMaterial({ map: dTex, roughness: .32, clearcoat: 1, clearcoatRoughness: .06 })); dial.position.z = .262; watch.add(dial);
const glass = new THREE.Mesh(new THREE.SphereGeometry(2.6, 96, 24, 0, Math.PI * 2, 0, Math.asin(.92 / 2.6)), new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: .02, transparent: true, opacity: .1, clearcoat: 1, depthWrite: false }));
glass.rotation.x = Math.PI / 2; glass.position.z = .29 - 2.6 * Math.cos(Math.asin(.92 / 2.6)) + .0; watch.add(glass);

/* ---- hands ---- */
function hand(len, w, tail, orn, mat, z){ const s = new THREE.Shape(); s.moveTo(-w * .5, -tail); s.lineTo(w * .5, -tail); s.lineTo(w * .35, len * .62);
  if (orn){ s.quadraticCurveTo(w * 2.2, len * .7, w * .2, len * .8); } s.lineTo(0, len); if (orn) s.lineTo(-w * .2, len * .8), s.quadraticCurveTo(-w * 2.2, len * .7, -w * .35, len * .62); else s.lineTo(-w * .35, len * .62); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: .008, bevelEnabled: false }); const m = new THREE.Mesh(g, mat); m.position.z = z; return m; }
const hH = hand(.48, .05, .08, true, blued, .275), hM = hand(.74, .032, .1, false, blued, .285), hS = hand(.8, .01, .18, false, blued, .295);
const hub = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .05, 24), blued); hub.rotation.x = Math.PI / 2; hub.position.z = .29;
watch.add(hH, hM, hS, hub);

/* ---- movement (seen through the open back) ---- */
const mv = new THREE.Group(); mv.position.z = -.12; watch.add(mv);
const engr = document.createElement('canvas'); engr.width = engr.height = 1024; { const x = engr.getContext('2d'); x.fillStyle = '#808080'; x.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 900; i++){ const a = Math.random() * 6.28, r = Math.random() * 500, cx = 512 + Math.cos(a) * r, cy = 512 + Math.sin(a) * r; x.strokeStyle = `rgba(${Math.random() < .5 ? 40 : 200},${Math.random() < .5 ? 40 : 200},${Math.random() < .5 ? 40 : 200},.25)`; x.beginPath(); x.arc(cx, cy, 6 + Math.random() * 22, a, a + 2.4); x.stroke(); } }
const eTex = new THREE.CanvasTexture(engr);
const plateM = new THREE.MeshStandardMaterial({ color: 0xcf9f4c, metalness: 1, roughness: .38, bumpMap: eTex, bumpScale: .6 });
const plate = new THREE.Mesh(new THREE.CylinderGeometry(.9, .9, .03, 128), plateM); plate.rotation.x = Math.PI / 2; mv.add(plate);
function gearGeo(r, teeth, th = .018, hole = .55, spokes = 5){ const s = new THREE.Shape(), tw = Math.PI * 2 / teeth, ro = r, ri = r * (1 - 2.4 / teeth);
  for (let i = 0; i < teeth; i++){ const a = i * tw; const p = [[ri, a], [ro, a + tw * .18], [ro, a + tw * .45], [ri, a + tw * .63]];
    p.forEach(([rr, aa], j) => { const X = Math.cos(aa) * rr, Y = Math.sin(aa) * rr; if (i === 0 && j === 0) s.moveTo(X, Y); else s.lineTo(X, Y); }); } s.closePath();
  if (spokes){ const rim = ri * .8, inner = r * .18; for (let k = 0; k < spokes; k++){ const a0 = k / spokes * Math.PI * 2 + .12, a1 = (k + 1) / spokes * Math.PI * 2 - .12; const h = new THREE.Path();
      h.absarc(0, 0, rim, a0, a1, false); h.absarc(0, 0, inner + .02, a1 - .05, a0 + .05, true); h.closePath(); s.holes.push(h); } }
  return new THREE.ExtrudeGeometry(s, { depth: th, bevelEnabled: true, bevelThickness: .003, bevelSize: .003, bevelSegments: 1, curveSegments: 6 }); }
const gears = [];
function addGear(r, teeth, x, y, z, rate, mat = gilt, spokes = 5){ const m = new THREE.Mesh(gearGeo(r, teeth, .016, .55, spokes), mat); m.position.set(x, y, z); m.rotation.y = Math.PI; mv.add(m);
  const arb = new THREE.Mesh(new THREE.CylinderGeometry(.018, .018, .09, 16), steel); arb.rotation.x = Math.PI / 2; arb.position.set(x, y, z - .02); mv.add(arb);
  const j = new THREE.Mesh(new THREE.SphereGeometry(.02, 16, 8), ruby); j.position.set(x, y, z - .07); j.scale.z = .4; mv.add(j);
  gears.push({ m, rate }); return m; }
addGear(.42, 80, -.18, -.28, -.06, .02); addGear(.26, 64, .3, .05, -.08, -.13); addGear(.2, 60, -.05, .3, -.1, .55); addGear(.15, 15, .42, .4, -.11, -2.2, steel, 0);
// balance wheel (steel rim, three spokes) under a pierced, engraved gilt cock with a diamond endstone
const bal = new THREE.Group(); bal.position.set(-.34, .34, -.16); mv.add(bal);
const balRim = new THREE.Mesh(new THREE.TorusGeometry(.27, .016, 12, 96), steel); bal.add(balRim);
for (let k = 0; k < 3; k++){ const sp = new THREE.Mesh(new THREE.BoxGeometry(.54, .014, .01), steel); sp.rotation.z = k * Math.PI / 3; bal.add(sp); }
const spring = (() => { const pts = []; for (let i = 0; i < 260; i++){ const a = i / 260 * Math.PI * 2 * 7, r = .03 + i / 260 * .13; pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, -.02)); }
  return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 400, .0025, 4), blued); })(); bal.add(spring);
const cockS = new THREE.Shape(); cockS.absarc(0, 0, .13, 0, Math.PI * 2, false);
for (let k = 0; k < 6; k++){ const a = k / 6 * Math.PI * 2, h = new THREE.Path(); h.absarc(Math.cos(a) * .085, Math.sin(a) * .085, .022, 0, Math.PI * 2, true); cockS.holes.push(h); }
const cock = new THREE.Mesh(new THREE.ExtrudeGeometry(cockS, { depth: .014, bevelEnabled: true, bevelThickness: .003, bevelSize: .004, bevelSegments: 2, curveSegments: 24 }), plateM); cock.position.set(-.34, .34, -.205); cock.rotation.y = Math.PI; mv.add(cock);
const arm = new THREE.Mesh(new THREE.BoxGeometry(.5, .07, .014), plateM); arm.position.set(-.34 - .3 * Math.cos(.785), .34 + .3 * Math.sin(.785), -.21); arm.rotation.z = -.785; mv.add(arm);
const diamond = new THREE.Mesh(new THREE.OctahedronGeometry(.035, 0), new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0, clearcoat: 1, emissive: 0x334455, emissiveIntensity: .6 })); diamond.position.set(-.34, .34, -.215); mv.add(diamond);
// screws and a few jewels
for (let k = 0; k < 10; k++){ const a = k / 10 * Math.PI * 2 + .2; const s = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, .02, 20), blued); s.rotation.x = Math.PI / 2; s.position.set(Math.cos(a) * .82, Math.sin(a) * .82, -.03); mv.add(s); }
const mvOpacity = [plateM, gilt, steel, ruby];

/* ---- per frame ---- */
st.update = (T, dt, P) => {
  bg.material.uniforms.uA.value = P.h4bg;
  watch.rotation.y = P.h4spin * RAD;
  const t = T; // the watch runs on real time; seconds hand steps five times a second (H4 beats at 5 per second)
  const sec = Math.floor(t * 5) / 5 + 25, min = 10 + sec / 60, hr = 10 + min / 60;
  hS.rotation.z = -sec / 60 * Math.PI * 2; hM.rotation.z = -min / 60 * Math.PI * 2; hH.rotation.z = -hr / 12 * Math.PI * 2;
  bal.rotation.z = Math.sin(t * Math.PI * 2 * 2.5) * 2.1;   // 2.5 Hz oscillation = 5 beats per second
  gears.forEach(g => { const step = g.rate < -1 ? Math.floor(t * 5) / 5 + Math.min(1, (t * 5 % 1) * 6) / 5 : t; g.m.rotation.z = step * g.rate; });
};
st.bloom = () => [.22, .35, .9];
st.grade = () => ({ expo: .8, sat: .96, con: 1.06 });
st.vig = () => .5;
st.aper = () => 0;
st.anchor = { dial: () => new THREE.Vector3(.0, .95, .3).applyMatrix4(watch.matrixWorld), balance: () => new THREE.Vector3(-.34, .34, -.3).applyMatrix4(watch.matrixWorld), bow: () => new THREE.Vector3(0, 1.45, 0).applyMatrix4(watch.matrixWorld) };
st.watch = watch;
})();
