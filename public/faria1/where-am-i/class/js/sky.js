/* sky.js — the real night sky, shared by every environment.
   Stars: Yale Bright Star Catalogue via d3-celestial (5,000 stars to magnitude 6.2), coloured by B–V.
   Background: NASA/Goddard SVS Deep Star Maps 2020 Milky Way (stars removed), celestial coordinates.
   Equatorial unit vectors use x → RA 0h, y → RA 6h, z → north celestial pole. */
const Sky = (() => {
  const RAD = Math.PI / 180;
  const eqVec = (ra, dec) => [Math.cos(dec * RAD) * Math.cos(ra * RAD), Math.cos(dec * RAD) * Math.sin(ra * RAD), Math.sin(dec * RAD)];
  /* eq → space-world: RA 0h → +Z, RA 6h → +X, pole → +Y */
  const SPACE = new THREE.Matrix3().set(0, 1, 0, 0, 0, 1, 1, 0, 0);
  /* eq → local horizon world (x east, y up, -z north) for latitude lat and local sidereal time lst (degrees) */
  function local(lat, lst){
    const f = lat * RAD, th = lst * RAD, c = Math.cos(th), s = Math.sin(th);
    // rotate about z by -lst (meridian → x), then project onto east/up/north
    const Rz = new THREE.Matrix3().set(c, s, 0, -s, c, 0, 0, 0, 1);
    const E = [0, 1, 0], U = [Math.cos(f), 0, Math.sin(f)], N = [-Math.sin(f), 0, Math.cos(f)];
    const B = new THREE.Matrix3().set(E[0], E[1], E[2], U[0], U[1], U[2], -N[0], -N[1], -N[2]);
    return B.multiply(Rz);
  }
  function bvColor(bv){ // approximate black-body tint from B–V
    const t = Math.max(-.4, Math.min(2, bv));
    let r, g, b;
    if (t < 0){ r = .72 + .28 * (t + .4) / .4; g = .82 + .14 * (t + .4) / .4; b = 1; }
    else if (t < .6){ r = 1; g = .96 - t * .12; b = 1 - t * .55; }
    else { r = 1; g = .89 - (t - .6) * .22; b = .67 - (t - .6) * .32; }
    return [r, g, Math.max(.3, b)];
  }
  let starGeo = null, mwTex = null;
  function geo(){
    if (starGeo) return starGeo;
    const S = window.STARS, n = S.length, pos = new Float32Array(n * 3), mag = new Float32Array(n), col = new Float32Array(n * 3), rnd = new Float32Array(n);
    S.forEach((s, i) => { const v = eqVec(s[0], s[1]); pos.set(v, i * 3); mag[i] = s[2]; col.set(bvColor(s[3]), i * 3); rnd[i] = Math.random(); });
    starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); starGeo.setAttribute('aMag', new THREE.BufferAttribute(mag, 1));
    starGeo.setAttribute('aCol', new THREE.BufferAttribute(col, 3)); starGeo.setAttribute('aRnd', new THREE.BufferAttribute(rnd, 1));
    starGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e9);
    return starGeo;
  }
  function tex(){
    if (mwTex) return mwTex;
    mwTex = new THREE.TextureLoader().load(TEX.milkyway); mwTex.colorSpace = THREE.SRGBColorSpace; mwTex.anisotropy = 4;
    mwTex.wrapS = THREE.RepeatWrapping; mwTex.minFilter = THREE.LinearMipmapLinearFilter; return mwTex;
  }
  const DIRV = `
    vec4 skyClip(vec3 d){ vec4 c = projectionMatrix * vec4(mat3(viewMatrix) * d, 0.); c.z = c.w * .99999; return c; }`;
  /* make a sky (stars + milky way) for one environment */
  function make(o = {}){
    const U = { uRot: { value: new THREE.Matrix3().copy(SPACE) }, uI: { value: 1 }, uMW: { value: .5 }, uTw: { value: o.twinkle || 0 }, uT: { value: 0 },
      uHorizon: { value: o.horizon ? 1 : 0 }, uPx: { value: 1 }, uSize: { value: 1 }, uHi: { value: new THREE.Vector4(0, 0, 1, 0) }, uExt: { value: 1 } };
    const stars = new THREE.Points(geo(), new THREE.ShaderMaterial({ uniforms: U, transparent: true, depthWrite: false, depthTest: true, blending: THREE.AdditiveBlending,
      vertexShader: `attribute float aMag, aRnd; attribute vec3 aCol; uniform mat3 uRot; uniform float uI, uTw, uT, uHorizon, uPx, uSize, uExt; uniform vec4 uHi;
        varying vec3 vC; varying float vA, vHi; ${DIRV}
        void main(){
          vec3 d = normalize(uRot * position);
          gl_Position = skyClip(d);
          float m = aMag;
          float b = pow(10., -.4 * (m - 1.)) ;           // relative flux
          float I = pow(b, .56) * uI;                       // perceptual compression
          float alt = d.y;
          float ext = uHorizon > .5 ? smoothstep(-.01, .22, alt) * mix(.55, 1., smoothstep(.0, .5, alt)) : 1.;
          float tw = 1. + uTw * (1. + 2. * (1. - smoothstep(.0, .7, alt)) * uHorizon) * (.5 * sin(uT * (7. + aRnd * 9.) + aRnd * 40.) + .3 * sin(uT * (13. + aRnd * 5.) + aRnd * 17.));
          float hi = 0.; if (uHi.w > 0.) hi = uHi.w * step(.99999, dot(normalize(position), normalize(uHi.xyz)));
          I *= ext * max(tw, .2) * uExt;
          float sz = (2.4 + max(0., 4.8 - m) * 1.5) * uSize;
          gl_PointSize = clamp(sz, 2., 14.) * uPx * (1. + hi * .6);
          vA = I * (1. + hi * 2.); vC = aCol; vHi = hi;
        }`,
      fragmentShader: `varying vec3 vC; varying float vA, vHi;
        void main(){ vec2 p = gl_PointCoord * 2. - 1.; float r2 = dot(p, p); if (r2 > 1.) discard;
          float e = 1. - r2; e = e * e * e;                       // fade to exactly zero at the sprite edge (gamma would otherwise show a disc)
          float core = exp(-r2 * 24.), halo = exp(-r2 * 8.) * .07;
          vec3 c = vC * vA * (core + halo) * e * 2.6;
          float m = max(c.r, max(c.g, c.b)); float cap = .5 + vHi * 1.6; c *= cap / max(cap, m);   // stay under the bloom threshold: single-pixel bloom shows as soft squares
          gl_FragColor = vec4(c, 1.); }` }));
    stars.frustumCulled = false; stars.renderOrder = -5;
    const mw = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 48), new THREE.ShaderMaterial({ uniforms: Object.assign({ tMW: { value: tex() } }, U),
      side: THREE.BackSide, depthWrite: false, depthTest: true, transparent: true, blending: THREE.AdditiveBlending,
      vertexShader: `uniform mat3 uRot; varying vec3 vE; varying float vAlt; ${DIRV}
        void main(){ vE = position; vec3 d = normalize(uRot * position); vAlt = d.y; gl_Position = skyClip(d); }`,
      fragmentShader: `uniform sampler2D tMW; uniform float uMW, uHorizon, uExt; varying vec3 vE; varying float vAlt;
        void main(){ vec3 e = normalize(vE); float ra = atan(e.y, e.x), dec = asin(clamp(e.z, -1., 1.));
          vec2 uv = vec2(fract(.5 - ra / 6.2831853), .5 + dec / 3.1415927);
          vec2 uv2 = vec2(fract(uv.x + .5), uv.y); vec2 dx = dFdx(uv), dy = dFdy(uv), dx2 = dFdx(uv2), dy2 = dFdy(uv2);
          if (abs(dx2.x) < abs(dx.x)) dx.x = dx2.x; if (abs(dy2.x) < abs(dy.x)) dy.x = dy2.x;
          vec3 c = textureGrad(tMW, uv, dx * 1.5, dy * 1.5).rgb;                 // slightly soft: a glow, not a noisy photo
          float ext = uHorizon > .5 ? smoothstep(.0, .35, vAlt) : 1.;
          vec3 g = pow(c, vec3(1.55)) * 1.15;                                     // keep the faint band, not just its brightest knots
          gl_FragColor = vec4(g * uMW * ext * uExt, 1.); }` }));
    mw.frustumCulled = false; mw.renderOrder = -6;
    const g = new THREE.Group(); g.add(mw); g.add(stars);
    // faint constellation figures (Ursa Major, Ursa Minor, Cassiopeia) for the Polaris beats
    const lp = []; ['UMa', 'UMi', 'Cas'].forEach(id => lines(id).forEach(seg => { for (let i = 0; i < seg.length - 1; i++) lp.push(...seg[i], ...seg[i + 1]); }));
    const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3));
    const LU = { uRot: U.uRot, uOp: { value: 0 } };
    const con = new THREE.LineSegments(lg, new THREE.ShaderMaterial({ uniforms: LU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `uniform mat3 uRot; ${DIRV} void main(){ gl_Position = skyClip(normalize(uRot * position)); }`,
      fragmentShader: `uniform float uOp; void main(){ gl_FragColor = vec4(vec3(.55, .62, .74) * uOp * .35, 1.); }` }));
    con.frustumCulled = false; con.renderOrder = -4; g.add(con);
    return { group: g, U, stars, mw, con, LU,
      set(rot){ U.uRot.value.copy(rot); },
      frame(T, H){ U.uT.value = T; U.uPx.value = H / 1080; } };
  }
  const named = n => { const s = window.STARNAMES[n]; return eqVec(s[0], s[1]); };
  /* constellation lines as eq vectors */
  const lines = id => (window.CONLINES[id] || []).map(seg => seg.map(p => eqVec(p[0], p[1])));
  return { make, eqVec, local, SPACE, named, lines, bvColor };
})();
