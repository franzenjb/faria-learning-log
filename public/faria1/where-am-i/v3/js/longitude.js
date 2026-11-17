/* longitude.js — Act III additions to the space environment: two ships on one parallel, the hour clock. */
(function(){
const W = World, P = W.P, S = W.envs.space;
/* two ships on 51.5° N: London (0°) and about 1,300 miles west (30° W) */
const d2 = S.dots([[0, 51.5], [-30, 51.5]], { color: [3.4, 2.3, 1.1], size: 11 }); S.reg('ships2', d2, [d2.material]); S.spinGrp.add(d2);
/* parallel 51.5° drawn as a thin line (so it reads above clouds) */
const par = []; for (let lon = -180; lon <= 180; lon += 2) par.push([lon, 51.5]);
const pl = S.geoLine(par, { color: 0xE8E4DC, w: 1.2, dash: [.012, .01], r: 1.003 }); S.reg('par515', pl, [pl.material]); S.spinGrp.add(pl);
})();
/* gold hour-wedges (one slice = 15°, two slices = 30°), drawn on the surface north of the equator */
(function(){
const W = World, S = W.envs.space;
function wedge(key, lonA, lonB){
  const nx = 24, ny = 30, pos = [], idx = [];
  for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++){ const lat = j / ny * 89.5, lon = lonA + (lonB - lonA) * i / nx; pos.push(...S.llObj(lat, lon, 1.0035)); }
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++){ const a = j * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1; idx.push(a, b, c, b, d, c); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
  const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, .52, .14), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  m.userData.k = .17; const mesh = new THREE.Mesh(g, m); mesh.renderOrder = 4; S.reg(key, mesh, [m]); S.spinGrp.add(mesh); }
wedge('wedge15', -15, 0); wedge('wedge30', -30, 0);
})();
/* 2026-11-16 eureka sequence: noon walks west across the US (NY, Memphis, Denver, LA), then a lone ship in the Pacific */
(function(){
const W = World, S = W.envs.space;
const city = (key, lon, lat) => { const d = S.dots([[lon, lat]], { color: [3.6, 2.5, 1.25], size: 13, r: 1.012 }); S.reg(key, d, [d.material]); S.spinGrp.add(d); };
city('cNY', -74.01, 40.71); city('cMEM', -90.05, 35.15); city('cDEN', -104.99, 39.74); city('cLA', -118.24, 34.05); city('cPHL', -75.17, 39.95); city('cPIT', -80.0, 40.44); city('cBNA', -86.78, 36.16);
const grp = new THREE.Group(), mats = [];
[-75, -90, -105, -120].forEach(lon => { const pts = []; for (let lat = 8; lat <= 62; lat += 1) pts.push([lon, lat]);
  const l = S.geoLine(pts, { color: 0xE8E4DC, w: 1, dash: [.008, .008], r: 1.0125 }); l.material.userData.k = .5; mats.push(l.material); grp.add(l); });
S.reg('usMer', grp, mats); S.spinGrp.add(grp);
const ship = S.dots([[-149, 32]], { color: [3.6, 2.5, 1.25], size: 13, r: 1.012 }); S.reg('loneShip', ship, [ship.material]); S.spinGrp.add(ship);
})();
