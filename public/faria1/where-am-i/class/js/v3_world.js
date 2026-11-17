/* v3_world.js — v3 additions to the space environment: the four 1883 railroad time-zone bands, idealised as 15° bands
   centred on 75°, 90°, 105° and 120° W (boundaries at 67.5 / 82.5 / 97.5 / 112.5 / 127.5° W), drawn across the lower 48. */
(function(){
const W = World, S = W.envs.space;
function band(key, lonA, lonB, rgb, k){
  const nx = 30, ny = 26, lat0 = 24.5, lat1 = 49.5, pos = [], idx = [];
  for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++){ const lat = lat0 + (lat1 - lat0) * j / ny, lon = lonA + (lonB - lonA) * i / nx; pos.push(...S.llObj(lat, lon, 1.004)); }
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++){ const a = j * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1; idx.push(a, b, c, b, d, c); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
  const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(...rgb), transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
  m.userData.k = k; const mesh = new THREE.Mesh(g, m); mesh.renderOrder = 4;
  /* thin boundary lines on both edges */
  const grp = new THREE.Group(); grp.add(mesh); const mats = [m];
  [lonA, lonB].forEach(lon => { const pts = []; for (let lat = lat0; lat <= lat1 + .01; lat += 1) pts.push([lon, lat]);
    const l = S.geoLine(pts, { color: 0xE8E4DC, w: 1, r: 1.0045 }); l.material.userData.k = .7; mats.push(l.material); grp.add(l); });
  S.reg(key, grp, mats); S.spinGrp.add(grp); }
band('tz1', -82.5, -67.5, [.02, .03, .05], .0);
band('tz2', -97.5, -82.5, [.02, .03, .05], .5);
band('tz3', -112.5, -97.5, [.02, .03, .05], .0);
band('tz4', -127.5, -112.5, [.02, .03, .05], .5);
/* the four zone meridians in gold (solid, the one accent) */
const grp = new THREE.Group(), mats = [];
[-75, -90, -105, -120].forEach(lon => { const pts = []; for (let lat = 24.5; lat <= 49.6; lat += 1) pts.push([lon, lat]);
  const l = S.geoLine(pts, { color: 0xF5D398, w: 1.6, r: 1.0055 }); l.material.userData.k = .9; mats.push(l.material); grp.add(l); });
S.reg('tzMer', grp, mats); S.spinGrp.add(grp);
})();
