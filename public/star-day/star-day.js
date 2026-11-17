/* Extra-turn (sidereal vs solar day) interactive for topic 116.
   Approach copied and adapted from the live Deck v2 animation
   "Star day vs Sun day" on the Kepler to Halley slide
   (https://faria.jbf.com/deck/v2/#10, button "Turn the Earth once").
   Restyled in the Faria Tufte palette. Works offline: no network. */
(() => {
  const root = document.getElementById("star-day");
  if (!root) return;

  const canvas = root.querySelector("canvas");
  const readout = root.querySelector(".sd-readout");
  const btnTurn = root.querySelector(".sd-turn");
  const btnPlay = root.querySelector(".sd-play");
  const btnReset = root.querySelector(".sd-reset");
  if (!canvas) return;

  const INK = "#26363b";
  const MUTED = "#637177";
  const FAINT = "#b8c0c0";
  const PAPER = "#fcfbf7";
  const RUST = "#a95039";
  const SUN = "#e6c46e";
  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;
  const EXAG = 20;
  const TURN_MS = 2400;
  const CSS_W = 960;
  const CSS_H = 520;
  const FONT = '"DejaVu Sans", "Liberation Sans", "Noto Sans", sans-serif';

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let turns = 0;
  let anim = null;
  let raf = 0;

  function ease(k) {
    return k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  }

  function currentTurns(now) {
    if (!anim) return turns;
    const k = Math.min(1, (now - anim.t0) / TURN_MS);
    const t = anim.from + ease(k);
    if (k >= 1) {
      turns = anim.from + 1;
      anim = null;
      syncButtons();
      say();
    }
    return t;
  }

  function say(t) {
    if (!readout) return;
    const n = t == null ? turns : t;
    const whole = Math.abs(n - Math.round(n)) < 0.02;
    const k = Math.round(n);
    if (k === 0 && whole) {
      readout.textContent = "Start. Noon faces the Sun and the distant star.";
    } else if (whole && k > 0) {
      readout.textContent = k + " full turn" + (k === 1 ? "" : "s") + ". The star is back overhead. The Sun is not yet.";
    } else {
      readout.textContent = "Turning… " + n.toFixed(2) + " sidereal days.";
    }
  }

  function syncButtons() {
    const busy = Boolean(anim);
    if (btnTurn) btnTurn.disabled = busy;
    if (btnPlay) {
      btnPlay.disabled = busy;
      btnPlay.textContent = busy ? "Playing" : "Play";
    }
  }

  function startTurn() {
    if (anim) return;
    if (reduced()) {
      turns += 1;
      draw();
      say();
      return;
    }
    anim = { t0: performance.now(), from: turns };
    syncButtons();
    loop();
  }

  function reset() {
    anim = null;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    turns = 0;
    syncButtons();
    draw();
    say();
  }

  function size() {
    const dpr = Math.min(2.5, window.devicePixelRatio || 1);
    const cssW = canvas.clientWidth || CSS_W;
    const cssH = Math.max(240, cssW * (CSS_H / CSS_W));
    canvas.style.height = cssH + "px";
    const bw = Math.round(cssW * dpr);
    const bh = Math.round(cssH * dpr);
    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
    }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w: cssW, h: cssH };
  }

  function arrow(ctx, x0, y0, x1, y1, color, width) {
    const ang = Math.atan2(y1 - y0, x1 - x0);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    const s = 7;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - Math.cos(ang - 0.4) * s, y1 - Math.sin(ang - 0.4) * s);
    ctx.lineTo(x1 - Math.cos(ang + 0.4) * s, y1 - Math.sin(ang + 0.4) * s);
    ctx.closePath();
    ctx.fill();
  }

  function label(ctx, text, x, y, color, size, align) {
    ctx.fillStyle = color;
    ctx.font = size + "px " + FONT;
    ctx.textAlign = align || "left";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
  }

  function draw(now) {
    const { ctx, w, h } = size();
    const t = currentTurns(now || performance.now());
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, w, h);

    const sx = w * 0.46;
    const sy = h * 0.50;
    const U = Math.min(w * 0.28, h * 0.32);

    label(ctx, "Why a solar day is four minutes longer than a star day", 24, 22, INK, 14, "left");
    label(ctx, "The orbital step is drawn large on purpose. In a real day it is only about 1°.", 24, 42, MUTED, 11, "left");

    ctx.strokeStyle = "rgba(99,113,119,0.28)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 6]);
    for (let x = w * 0.12; x < w * 0.80; x += w * 0.07) {
      ctx.beginPath();
      ctx.moveTo(x, 58);
      ctx.lineTo(x, 78);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    const starY = 64;
    const starX = w * 0.88;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(starX, starY - 7);
    ctx.lineTo(starX, starY + 7);
    ctx.moveTo(starX - 7, starY);
    ctx.lineTo(starX + 7, starY);
    ctx.moveTo(starX - 5, starY - 5);
    ctx.lineTo(starX + 5, starY + 5);
    ctx.moveTo(starX - 5, starY + 5);
    ctx.lineTo(starX + 5, starY - 5);
    ctx.stroke();
    label(ctx, "distant star  ·  same direction everywhere", starX - 14, starY + 18, MUTED, 11, "right");

    ctx.strokeStyle = FAINT;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(sx, sy, U, 0, TAU);
    ctx.stroke();

    const sunR = Math.max(10, U * 0.09);
    const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, sunR * 2.1);
    g.addColorStop(0, "#f7e7a8");
    g.addColorStop(0.55, SUN);
    g.addColorStop(1, "rgba(230,196,110,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(sx, sy, sunR * 2.1, 0, TAU);
    ctx.fill();
    ctx.fillStyle = SUN;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(sx, sy, sunR, 0, TAU);
    ctx.fill();
    ctx.stroke();
    label(ctx, "Sun", sx, sy + sunR + 14, INK, 11, "center");

    // Start at the bottom so noon, the Sun, and the star all point up.
    // Walk counterclockwise; one day is EXAG degrees of orbit, not 1°.
    const orbA = Math.PI / 2 + t * EXAG * DEG;
    const ex = sx + U * Math.cos(orbA);
    const ey = sy + U * Math.sin(orbA);
    const er = Math.max(12, U * 0.14);

    ctx.fillStyle = "#eef1f1";
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(ex, ey, er, 0, TAU);
    ctx.fill();
    ctx.stroke();
    label(ctx, "Earth", ex, ey + er + 13, INK, 11, "center");

    const mA = -Math.PI / 2 + t * TAU;
    const mx = ex + er * Math.cos(mA);
    const my = ey + er * Math.sin(mA);
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.arc(mx, my, 4, 0, TAU);
    ctx.fill();
    arrow(ctx, mx, my, mx + er * 1.35 * Math.cos(mA), my + er * 1.35 * Math.sin(mA), INK, 1.8);
    // Keep "noon" to the left of the upward mark so it does not sit on the rust arc.
    label(ctx, "noon", ex - er - 8, my, INK, 11, "right");

    const toSun = Math.atan2(sy - ey, sx - ex);
    ctx.setLineDash([4, 5]);
    ctx.strokeStyle = "rgba(169,80,57,0.7)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(ex + er * 2.35 * Math.cos(toSun), ey + er * 2.35 * Math.sin(toSun));
    ctx.stroke();
    ctx.setLineDash([]);

    const whole = Math.abs(t - Math.round(t)) < 0.02 && Math.round(t) > 0;
    if (whole) {
      let da = ((toSun - mA) % TAU + TAU) % TAU;
      if (da > Math.PI) da -= TAU;
      ctx.strokeStyle = RUST;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(ex, ey, er * 2.35, mA, mA + da, da < 0);
      ctx.stroke();
      const degHere = Math.round(Math.abs(da) / DEG);
      // Place the rust caption to the right of Earth, clear of the noon arrow.
      const tx = Math.min(w - 16, ex + er * 4.6);
      const ty = ey - er * 2.2;
      label(ctx, "extra turn to face the Sun", tx, ty - 8, RUST, 12, "left");
      label(ctx, degHere + "° here, 1° in reality  ≈  4 min", tx, ty + 8, RUST, 11, "left");
    }

    const rounded = Math.round(t);
    const foot1 = (rounded === 0 && Math.abs(t) < 0.02)
      ? "Start: noon points at the Sun and at the star."
      : (whole
        ? (rounded + " full turn" + (rounded === 1 ? "" : "s") + " of the Earth  ·  star back overhead  ·  Sun not yet")
        : "The noon mark is turning with the Earth.");
    label(ctx, foot1, w / 2, h - 36, INK, 12, "center");
    label(ctx, "Orbit exaggerated: one day moves Earth 20° here, 1° in reality  ·  sidereal day 23 h 56 m  ·  solar day 24 h", w / 2, h - 18, MUTED, 11, "center");

    if (anim) say(t);
  }

  function loop(now) {
    draw(now);
    if (anim) raf = requestAnimationFrame(loop);
    else raf = 0;
  }

  btnTurn && btnTurn.addEventListener("click", startTurn);
  btnPlay && btnPlay.addEventListener("click", startTurn);
  btnReset && btnReset.addEventListener("click", reset);
  window.addEventListener("resize", () => { draw(); });

  syncButtons();
  draw();
  say();
})();
