// 3D globe for the Havana and Rome reveals.
// three.js is MIT, vendored at vendor/three.min.js (r160). No network at show time.
// Day, night, and relief maps are NASA public-domain Earth imagery
// (Blue Marble, city lights, topography normal), the set shipped with the three.js examples.
(function () {
  const D = Math.PI / 180;
  const RED = 0xb01f24;
  const G = {
    ok: false,
    drawing: false,
    block: false,
    hud: '',
    hudA: 0,
    fps: 0,
    yaw: 0,
    yawVel: 0,
    alt: 1,
    altTarget: 1
  };
  let renderer, scene, camera, earth, atmos, sunDir;
  let tube, tubeGlow, head, headGlow;
  let cities = [];
  let gulf, gulfSeeds, gulfCurve;
  let ready = false, failed = false;
  let frames = 0, fpsT = 0;
  const pointers = new Map();
  let pinchDist = 0;

  function surface(lat, lon, r) {
    const p = (90 - lat) * D;
    const t = (lon + 180) * D;
    return new THREE.Vector3(
      -r * Math.sin(p) * Math.cos(t),
      r * Math.cos(p),
      r * Math.sin(p) * Math.sin(t)
    );
  }
  function eastOf(lon, origin) {
    let d = lon - origin;
    while (d < 0) d += 360;
    while (d >= 360) d -= 360;
    return d / 360;
  }
  function yaw(v, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return new THREE.Vector3(c * v.x + s * v.z, v.y, -s * v.x + c * v.z);
  }

  function tubeAlong(points) {
    const curve = new THREE.CatmullRomCurve3(points);
    const geo = new THREE.TubeGeometry(curve, Math.max(24, points.length), 0.0024, 5, false);
    const mat = new THREE.MeshBasicMaterial({ color: RED });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    return { mesh, glow: null, count: geo.index.count };
  }

  function buildEarth() {
    const geo = new THREE.SphereGeometry(1, 96, 64);
    geo.computeTangents();
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        dayMap: { value: null },
        nightMap: { value: null },
        normalMap: { value: null },
        sunDir: { value: new THREE.Vector3(1, 0.15, 0.2).normalize() },
        hasTex: { value: 0 }
      },
      vertexShader: [
        'attribute vec4 tangent;',
        'varying vec2 vUv;',
        'varying vec3 vN;',
        'varying vec3 vT;',
        'varying vec3 vB;',
        'void main() {',
        '  vUv = uv;',
        '  vec3 n = normalize(mat3(modelMatrix) * normal);',
        '  vec3 t = normalize(mat3(modelMatrix) * tangent.xyz);',
        '  vN = n; vT = t; vB = normalize(cross(n, t) * tangent.w);',
        '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
        '}'
      ].join('\n'),
      fragmentShader: [
        'uniform sampler2D dayMap;',
        'uniform sampler2D nightMap;',
        'uniform sampler2D normalMap;',
        'uniform vec3 sunDir;',
        'uniform float hasTex;',
        'varying vec2 vUv;',
        'varying vec3 vN;',
        'varying vec3 vT;',
        'varying vec3 vB;',
        'void main() {',
        '  vec3 nTex = texture2D(normalMap, vUv).xyz * 2.0 - 1.0;',
        '  vec3 N = normalize(mix(vN, vT * nTex.x + vB * nTex.y + vN * nTex.z, hasTex));',
        '  float ndl = dot(N, normalize(sunDir));',
        '  float dayF = smoothstep(-0.12, 0.28, ndl);',
        '  vec3 day = texture2D(dayMap, vUv).rgb;',
        '  float luma = dot(day, vec3(0.30, 0.52, 0.18));',
        '  vec3 warm = mix(vec3(luma * 0.86, luma * 0.76, luma * 0.62), day, 0.42);',
        '  float ocean = smoothstep(0.0, 0.16, day.b - max(day.r, day.g));',
        '  warm = mix(warm, vec3(0.16, 0.22, 0.28), ocean * 0.78);',
        '  warm = mix(warm, vec3(0.40, 0.32, 0.24), (1.0 - ocean) * 0.22);',
        '  vec3 lights = texture2D(nightMap, vUv).rgb * vec3(1.05, 0.82, 0.55);',
        '  vec3 color = mix(lights * 1.15, warm * 1.25, dayF);',
        '  color *= mix(0.72, 1.0, smoothstep(-0.25, 0.45, ndl));',
        '  if (hasTex < 0.5) color = vec3(0.20, 0.26, 0.32);',
        '  gl_FragColor = vec4(color, 1.0);',
        '}'
      ].join('\n')
    });
    earth = new THREE.Mesh(geo, mat);
    scene.add(earth);
    sunDir = mat.uniforms.sunDir.value;

    const atmosMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
      vertexShader: 'varying vec3 vN; varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }',
      fragmentShader: 'varying vec3 vN; varying vec3 vW; void main(){ vec3 view = normalize(cameraPosition - vW); float f = pow(1.0 - clamp(dot(normalize(vN), view), 0.0, 1.0), 2.6); gl_FragColor = vec4(0.62, 0.66, 0.70, f * 0.72); }'
    });
    atmos = new THREE.Mesh(new THREE.SphereGeometry(1.018, 64, 48), atmosMat);
    scene.add(atmos);

    const load = (url, done) => {
      new THREE.TextureLoader().load(url, (tex) => { tex.anisotropy = 8; done(tex); });
    };
    let left = 3;
    const got = () => { if (--left === 0) earth.material.uniforms.hasTex.value = 1; };
    load('img/earth-day.jpg', (t) => { earth.material.uniforms.dayMap.value = t; got(); });
    load('img/earth-night.png', (t) => { earth.material.uniforms.nightMap.value = t; got(); });
    load('img/earth-normal.jpg', (t) => { earth.material.uniforms.normalMap.value = t; got(); });
  }

  function buildPaths() {
    const ring = [];
    for (let i = 0; i <= 180; i++) ring.push(surface(42, -71.06 + (i / 180) * 360, 1.012));
    const built = tubeAlong(ring);
    tube = built.mesh;
    tube.userData.count = built.count;
    scene.add(tube);

    const arc = [];
    for (let i = 0; i <= 96; i++) arc.push(surface(23.13 + (i / 96) * (-48 - 23.13), -82.38, 1.012));
    const drop = tubeAlong(arc);
    G.drop = drop.mesh;
    G.drop.userData.count = drop.count;
    scene.add(G.drop);

    head = new THREE.Mesh(new THREE.SphereGeometry(0.006, 12, 10), new THREE.MeshBasicMaterial({ color: 0xfff1ec }));
    headGlow = new THREE.Mesh(new THREE.SphereGeometry(0.011, 12, 10), new THREE.MeshBasicMaterial({
      color: RED, transparent: true, opacity: 0.55, depthWrite: false
    }));
    scene.add(headGlow);
    scene.add(head);

    const list = [
      { lat: 42.36, lon: -71.06 },
      { lat: 41.39, lon: 2.17 },
      { lat: 41.90, lon: 12.50 },
      { lat: 41.01, lon: 28.98 },
      { lat: 43.12, lon: 131.89 },
      { lat: 43.06, lon: 141.35 },
      { lat: 41.88, lon: -87.63 }
    ];
    list.forEach((c) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 10), new THREE.MeshBasicMaterial({ color: RED }));
      m.position.copy(surface(c.lat, c.lon, 1.016));
      m.userData.frac = eastOf(c.lon, -71.06);
      m.userData.rome = Math.abs(c.lon - 12.5) < 1;
      m.scale.setScalar(0.01);
      scene.add(m);
      cities.push(m);
    });

    const flowPts = [
      surface(24, -92, 1.02),
      surface(28, -82, 1.02),
      surface(34, -72, 1.02),
      surface(38, -58, 1.02),
      surface(42, -40, 1.02),
      surface(46, -22, 1.02),
      surface(48, -8, 1.02),
      surface(46, 4, 1.02)
    ];
    gulfCurve = new THREE.CatmullRomCurve3(flowPts);
    const N = 420;
    const pos = new Float32Array(N * 3);
    gulfSeeds = new Float32Array(N * 2);
    for (let i = 0; i < N; i++) {
      gulfSeeds[i * 2] = Math.random();
      gulfSeeds[i * 2 + 1] = (Math.random() - 0.5) * 0.012;
    }
    const ggeo = new THREE.BufferGeometry();
    ggeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const dot = document.createElement('canvas');
    dot.width = dot.height = 32;
    const dg = dot.getContext('2d');
    const rg = dg.createRadialGradient(16, 16, 0, 16, 16, 16);
    rg.addColorStop(0, 'rgba(255,196,120,1)');
    rg.addColorStop(0.45, 'rgba(210,120,48,0.75)');
    rg.addColorStop(1, 'rgba(210,120,48,0)');
    dg.fillStyle = rg;
    dg.fillRect(0, 0, 32, 32);
    gulf = new THREE.Points(ggeo, new THREE.PointsMaterial({
      map: new THREE.CanvasTexture(dot), color: 0xffc48a, size: 0.014, sizeAttenuation: true,
      transparent: true, opacity: 0.9, depthWrite: false
    }));
    scene.add(gulf);
  }

  function setDraw(mesh, p) {
    const n = mesh.userData.count || 0;
    mesh.geometry.setDrawRange(0, Math.max(0, Math.floor(n * Math.max(0, Math.min(1, p)))));
  }

  function aim(eye, look, up, yawA) {
    const e = yaw(eye, yawA || 0);
    const l = yaw(look, yawA || 0);
    const len = e.length();
    e.normalize().multiplyScalar(len * G.alt);
    camera.position.copy(e);
    camera.up.copy(up ? yaw(up, yawA || 0).normalize() : new THREE.Vector3(0, 1, 0));
    camera.lookAt(l);
    camera.updateProjectionMatrix();
  }

  function syncSize() {
    const flat = document.getElementById('c');
    const gl = renderer.domElement;
    const r = flat.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(Math.max(2, r.width), Math.max(2, r.height), false);
    gl.style.width = flat.style.width;
    gl.style.height = flat.style.height;
    camera.aspect = Math.max(0.2, r.width / Math.max(1, r.height));
    camera.updateProjectionMatrix();
  }

  const scratch = new THREE.Vector3();
  const sideV = new THREE.Vector3();
  const upV = new THREE.Vector3();
  const tanV = new THREE.Vector3();
  function flow(time) {
    const attr = gulf.geometry.attributes.position;
    const n = gulfSeeds.length / 2;
    for (let i = 0; i < n; i++) {
      const t = (gulfSeeds[i * 2] + time * 0.045) % 1;
      gulfCurve.getPoint(t, scratch);
      gulfCurve.getTangent(t, tanV);
      upV.copy(scratch).normalize();
      sideV.crossVectors(upV, tanV).normalize();
      scratch.addScaledVector(upV, 0.008);
      scratch.addScaledVector(sideV, gulfSeeds[i * 2 + 1]);
      attr.setXYZ(i, scratch.x, scratch.y, scratch.z);
    }
    attr.needsUpdate = true;
  }

  G.beginFrame = function () {
    G.drawing = false;
    G.hudA = 0;
    if (renderer) renderer.domElement.style.visibility = 'hidden';
  };

  G.resetMotion = function () {
    G.yaw = 0;
    G.yawVel = 0;
    G.alt = 1;
    G.altTarget = 1;
    G.block = false;
  };

  G.init = function () {
    if (ready || failed) return G.ok;
    try {
      const canvas = document.getElementById('gl');
      const test = document.createElement('canvas');
      if (!test.getContext('webgl') && !test.getContext('experimental-webgl')) throw new Error('no webgl');
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.01, 20);
      buildEarth();
      buildPaths();
      const flat = document.getElementById('c');
      const watch = (type) => flat.addEventListener(type, (e) => {
        if (!G.drawing) return;
        if (type === 'pointerdown') {
          pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
          if (pointers.size === 2) {
            const a = [...pointers.values()];
            pinchDist = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
          }
        } else if (type === 'pointermove') {
          if (!pointers.has(e.pointerId)) return;
          const prev = pointers.get(e.pointerId);
          const dx = e.clientX - prev.x, dy = e.clientY - prev.y;
          pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
          if (pointers.size >= 2 && pinchDist > 0) {
            const a = [...pointers.values()];
            const d = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
            G.altTarget = Math.max(0.82, Math.min(1.85, G.altTarget * (pinchDist / d)));
            pinchDist = d;
            G.block = true;
          } else if (Math.hypot(dx, dy) > 0) {
            G.yawVel += dx * 0.0009;
            G.block = true;
          }
        } else {
          pointers.delete(e.pointerId);
          if (pointers.size < 2) pinchDist = 0;
        }
      }, true);
      watch('pointerdown');
      watch('pointermove');
      watch('pointerup');
      watch('pointercancel');
      ready = true;
      G.ok = true;
    } catch (err) {
      failed = true;
      G.ok = false;
    }
    return G.ok;
  };

  G.render = function (mode, u) {
    if (!G.init()) return;
    G.drawing = true;
    renderer.domElement.style.visibility = 'visible';
    syncSize();
    G.yawVel *= 0.9;
    G.yaw += G.yawVel;
    G.alt += (G.altTarget - G.alt) * 0.15;
    const drift = Math.sin(performance.now() * 0.00012) * 0.03;
    const yawAll = G.yaw + drift;

    tube.visible = mode === 'rome';
    G.drop.visible = mode === 'havana';
    cities.forEach((m) => { m.visible = mode === 'rome'; });

    if (mode === 'rome') {
      const dive = ease(u, 0, 0.16);
      const chase = ease(u, 0.14, 0.52);
      const pull = ease(u, 0.5, 0.78);
      gulf.visible = chase > 0.04;
      const romeFrac = eastOf(12.5, -71.06);
      const leg = chase * romeFrac;
      const ring = leg + pull * (1 - romeFrac);
      setDraw(tube, ring);
      const headLon = -71.06 + ring * 360;
      head.position.copy(surface(42, headLon, 1.02));
      headGlow.position.copy(head.position);
      const rd = Math.max(0.004, camera.position.distanceTo(head.position) * 0.012);
      head.scale.setScalar(rd / 0.006);
      headGlow.scale.setScalar(rd / 0.011);
      cities.forEach((m) => {
        const on = ring > m.userData.frac + 0.004 ? 1 : 0;
        const pulse = m.userData.rome ? 1 + 0.45 * Math.sin(performance.now() * 0.008) : 1;
        const s = on ? (m.userData.rome ? 1.8 : 1.15) * pulse : 0.01;
        m.scale.setScalar(s);
      });
      let eye, look, up;
      if (pull > 0.02) {
        eye = surface(28, -32, 1.5 + pull * 2.5);
        look = new THREE.Vector3(0, 0.12, 0);
        up = new THREE.Vector3(0, 1, 0);
      } else if (chase > 0.08) {
        eye = surface(50, headLon - 16, 1.12);
        look = surface(42, headLon + 4, 1.004);
        up = surface(50, headLon - 16, 1);
      } else {
        eye = surface(32, -48, 2.85 - dive * 1.55);
        look = surface(42.3, -71, 1);
        up = new THREE.Vector3(0, 1, 0);
      }
      aim(eye, look, up, yawAll);
      flow(performance.now() / 1000);
      const showRead = chase > 0.05 && pull < 0.85;
      G.hud = '42° N  ·  ' + fmtLon(headLon);
      G.hudA = showRead ? 1 : 0;
    } else {
      gulf.visible = false;
      const dive = ease(u, 0.02, 0.24);
      const drop = ease(u, 0.2, 0.86);
      const tipLat = 23.13 + drop * (-46 - 23.13);
      setDraw(G.drop, drop);
      head.position.copy(surface(tipLat, -82.38, 1.02));
      headGlow.position.copy(head.position);
      const hd = Math.max(0.004, camera.position.distanceTo(head.position) * 0.012);
      head.scale.setScalar(hd / 0.006);
      headGlow.scale.setScalar(hd / 0.011);
      const low = dive > 0.72;
      const ending = drop > 0.84;
      const eye = ending
        ? surface(tipLat + 6, -98, 1.55)
        : low
          ? surface(tipLat + 10, -90, 1.2)
          : surface(16, -60, 2.7 - dive * 1.35);
      const look = surface(ending || low ? tipLat : 23.1, ending ? -86 : -82.38, ending || low ? 1.002 : 0.4);
      const up = (ending || low) ? surface(tipLat + 8, -94, 1) : new THREE.Vector3(0, 1, 0);
      aim(eye, look, up, yawAll);
      const showRead = drop > 0.02 && drop < 0.92;
      G.hud = fmtLat(tipLat) + '  ·  82.4° W';
      G.hudA = showRead ? 1 : 0;
    }

    const sun = surface(12, -50, 8);
    sunDir.copy(sun).normalize();
    renderer.render(scene, camera);
    frames++;
    const now = performance.now();
    if (now - fpsT > 500) {
      G.fps = frames * 1000 / (now - fpsT);
      frames = 0;
      fpsT = now;
    }
  };

  function ease(u, a, b) {
    const t = Math.max(0, Math.min(1, (u - a) / Math.max(0.001, b - a)));
    return t * t * (3 - 2 * t);
  }
  function fmtLon(lon) {
    let x = lon;
    while (x > 180) x -= 360;
    while (x < -180) x += 360;
    const hem = x < 0 ? 'W' : 'E';
    return Math.abs(Math.round(x)) + '° ' + hem;
  }
  function fmtLat(lat) {
    const a = Math.abs(lat);
    if (a < 0.4) return '0°';
    return Math.round(a) + '° ' + (lat >= 0 ? 'N' : 'S');
  }

  window.Globe3D = G;
})();
