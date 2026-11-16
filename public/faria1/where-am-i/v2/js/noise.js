/* noise.js — tileable 3D noise for volumetric clouds (R: Perlin–Worley, G: Worley detail) and a 2D ocean normal/foam map */
const Noise = (() => {
  function rng(seed){ let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function perlin3(N, P, R){ // periodic gradient noise sampled on an N^3 grid with period P cells
    const g = new Float32Array(P * P * P * 3);
    for (let i = 0; i < P * P * P; i++){ let x = R() * 2 - 1, y = R() * 2 - 1, z = R() * 2 - 1, l = Math.hypot(x, y, z) || 1; g[i*3] = x / l; g[i*3+1] = y / l; g[i*3+2] = z / l; }
    const out = new Float32Array(N * N * N), f = t => t * t * t * (t * (t * 6 - 15) + 10);
    const G = (i, j, k, x, y, z) => { const o = (((i % P) * P + (j % P)) * P + (k % P)) * 3; return g[o] * x + g[o+1] * y + g[o+2] * z; };
    for (let z = 0; z < N; z++) for (let y = 0; y < N; y++) for (let x = 0; x < N; x++){
      const px = x / N * P, py = y / N * P, pz = z / N * P, ix = px | 0, iy = py | 0, iz = pz | 0, fx = px - ix, fy = py - iy, fz = pz - iz;
      const u = f(fx), v = f(fy), w = f(fz);
      const a = G(ix, iy, iz, fx, fy, fz), b = G(ix+1, iy, iz, fx-1, fy, fz), c = G(ix, iy+1, iz, fx, fy-1, fz), d = G(ix+1, iy+1, iz, fx-1, fy-1, fz);
      const e = G(ix, iy, iz+1, fx, fy, fz-1), ff = G(ix+1, iy, iz+1, fx-1, fy, fz-1), gg = G(ix, iy+1, iz+1, fx, fy-1, fz-1), h = G(ix+1, iy+1, iz+1, fx-1, fy-1, fz-1);
      const x1 = a + (b - a) * u, x2 = c + (d - c) * u, x3 = e + (ff - e) * u, x4 = gg + (h - gg) * u, y1 = x1 + (x2 - x1) * v, y2 = x3 + (x4 - x3) * v;
      out[(z * N + y) * N + x] = y1 + (y2 - y1) * w; }
    return out;
  }
  function worley3(N, C, R){ // periodic cellular noise, C cells per side, returns 1 - normalised distance
    const pts = new Float32Array(C * C * C * 3); for (let i = 0; i < pts.length; i++) pts[i] = R();
    const out = new Float32Array(N * N * N), s = C / N;
    for (let z = 0; z < N; z++) for (let y = 0; y < N; y++) for (let x = 0; x < N; x++){
      const px = (x + .5) * s, py = (y + .5) * s, pz = (z + .5) * s, cx = px | 0, cy = py | 0, cz = pz | 0; let m = 9;
      for (let k = -1; k <= 1; k++) for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++){
        const X = cx + i, Y = cy + j, Z = cz + k, wx = (X + C) % C, wy = (Y + C) % C, wz = (Z + C) % C, o = ((wz * C + wy) * C + wx) * 3;
        const dx = X + pts[o] - px, dy = Y + pts[o+1] - py, dz = Z + pts[o+2] - pz, d = dx*dx + dy*dy + dz*dz; if (d < m) m = d; }
      out[(z * N + y) * N + x] = 1 - Math.min(1, Math.sqrt(m)); }
    return out;
  }
  function clouds3D(N = 64){
    const R = rng(1707);
    const p1 = perlin3(N, 4, R), p2 = perlin3(N, 8, R), p3 = perlin3(N, 16, R);
    const w1 = worley3(N, 4, R), w2 = worley3(N, 8, R), w3 = worley3(N, 16, R), w4 = worley3(N, 24, R);
    const data = new Uint8Array(N * N * N * 4);
    for (let i = 0; i < N * N * N; i++){
      let pf = (p1[i] * .62 + p2[i] * .26 + p3[i] * .12) * .9 + .5; // 0..1
      const wf = w1[i] * .62 + w2[i] * .26 + w3[i] * .12;
      let pw = Math.max(0, Math.min(1, (pf - (1 - wf)) / (1 - (1 - wf) + 1e-3) * .5 + pf * .5)); // Perlin–Worley blend
      const det = w2[i] * .5 + w3[i] * .3 + w4[i] * .2;
      data[i*4] = Math.max(0, Math.min(255, pw * 255)); data[i*4+1] = det * 255; data[i*4+2] = Math.max(0, Math.min(255, pf * 255)); data[i*4+3] = 255; }
    const t = new THREE.Data3DTexture(data, N, N, N); t.format = THREE.RGBAFormat; t.type = THREE.UnsignedByteType;
    t.minFilter = t.magFilter = THREE.LinearFilter; t.wrapS = t.wrapT = t.wrapR = THREE.RepeatWrapping; t.unpackAlignment = 1; t.needsUpdate = true;
    return t;
  }
  function ocean2D(N = 256){ // tileable height field of many short waves → normal (rg) + height (b)
    const R = rng(22), h = new Float32Array(N * N), waves = [];
    for (let i = 0; i < 90; i++){ const kx = Math.round((R() * 2 - 1) * (3 + i * .35)), ky = Math.round((R() * 2 - 1) * (3 + i * .35)); if (!kx && !ky) continue;
      waves.push([kx, ky, R() * 6.283, 1 / Math.pow(Math.hypot(kx, ky), 1.25)]); }
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++){ let s = 0; for (const [kx, ky, ph, a] of waves) s += a * Math.sin(6.2832 * (kx * x + ky * y) / N + ph); h[y * N + x] = s; }
    let mx = 0; for (const v of h) mx = Math.max(mx, Math.abs(v));
    const d = new Uint8Array(N * N * 4);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++){
      const H = (i, j) => h[((j + N) % N) * N + ((i + N) % N)] / mx;
      const dx = (H(x + 1, y) - H(x - 1, y)) * 4, dy = (H(x, y + 1) - H(x, y - 1)) * 4, l = Math.hypot(dx, dy, 1);
      const o = (y * N + x) * 4; d[o] = (-dx / l * .5 + .5) * 255; d[o+1] = (-dy / l * .5 + .5) * 255; d[o+2] = (H(x, y) * .5 + .5) * 255; d[o+3] = 255; }
    const t = new THREE.DataTexture(d, N, N, THREE.RGBAFormat); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.magFilter = THREE.LinearFilter;
    t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true; t.anisotropy = 8; t.needsUpdate = true; return t;
  }
  return { clouds3D, ocean2D, rng };
})();
