/* act4.js — Act IV additions to the space environment: a bright star beside the Moon, and the lunar-distance arc. */
(function(){
const W = World, P = W.P, S = W.envs.space, v3 = S.v3;
const STAR_OFF = v3(-20, 30, 16);                      // a bright star ('Regulus') a few Moon-widths away, in the same far field
const starMat = new THREE.SpriteMaterial({ map: S.dotTex, color: new THREE.Color(2.4, 2.6, 3.4), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 });
const star = new THREE.Sprite(starMat); star.scale.set(4, 4, 1); star.position.copy(S.MOONC).add(STAR_OFF); S.scene.add(star); S.reg('lstar', star, [starMat]);
const arcL = S.line([[0, 0, 0], [0, 0, 0]], { color: 0xF2C27A, w: 1.6, depth: false, order: 9, dash: [3, 2.2] }); S.reg('larc', arcL, [arcL.material]); S.scene.add(arcL);
const moonPos = () => S.MOONC.clone().add(v3(P.moonDrift * 30, P.moonDrift * 6, 0));
S.hooks.push(() => { const m = moonPos(), s = star.position, d = s.clone().sub(m).normalize(); const a = m.clone().add(d.clone().multiplyScalar(13.5)), b = s.clone().sub(d.clone().multiplyScalar(3));
  const pts = []; for (let i = 0; i <= 24; i++){ const t = i / 24; const p = a.clone().lerp(b, t); p.add(v3(0, 0, 0)); pts.push(p.toArray()); } S.setLine(arcL, pts); });
S.anchor.lstar = () => star.position.clone();
S.anchor.larc = () => moonPos().lerp(star.position, .55).add(v3(4, 0, 0));
S.anchor.moonC = () => moonPos().add(v3(0, -15, 0));
})();
