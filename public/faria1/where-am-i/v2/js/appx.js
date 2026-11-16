/* appx.js — appendix additions to the space environment: failed geocodes piling up on Null Island; the date line (schematic). */
(function(){
const W = World, S = W.envs.space;
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const pile = []; for (let i = 0; i < 260; i++){ const r = Math.pow(rnd(), 3) * .35, a = rnd() * 6.283; pile.push([Math.cos(a) * r, Math.sin(a) * r]); }
const nd = S.dots(pile, { color: [3.2, 1.6, 1.1], size: 6 }); S.reg('nullDots', nd, [nd.material]); S.spinGrp.add(nd);
const IDL = [[180, 90], [180, 75], [191, 68], [191, 65.5], [189.5, 64], [180, 52], [172.5, 52], [172.5, 47], [180, 45], [180, 5], [210, 5], [210, -10], [187.5, -10], [187.5, -45], [180, -51], [180, -90]];
const idl = S.geoLine(IDL, { color: 0xF2C27A, w: 2.6, r: 1.003 }); S.reg('idl', idl, [idl.material]); S.spinGrp.add(idl);
const m180 = []; for (let lat = -88; lat <= 88; lat += 2) m180.push([180, lat]);
const l180 = S.geoLine(m180, { color: 0xE8E4DC, w: 1.2, dash: [.012, .01], r: 1.0025 }); S.reg('m180', l180, [l180.material]); S.spinGrp.add(l180);
})();
