/* Noon walks west: slider moves the solar-noon meridian across the US strip. */
(function () {
  const NYC = 74.01;
  const L0 = 124.8, L1 = 71.2, W = 960, ML = 48, MR = 28;
  const USABLE = W - ML - MR;
  const AXIS_TOP = 64, AXIS_BOT = 220;
  const MAX_MIN = 210; // a little past Fresno
  const CITIES = [
    { id: "nw-clock-fresno", west: 119.79, name: "Fresno" },
    { id: "nw-clock-los-angeles", west: 118.24, name: "Los Angeles" },
    { id: "nw-clock-denver", west: 104.99, name: "Denver" },
    { id: "nw-clock-memphis", west: 90.05, name: "Memphis" },
    { id: "nw-clock-nashville", west: 86.78, name: "Nashville" },
    { id: "nw-clock-pittsburgh", west: 79.99, name: "Pittsburgh" },
    { id: "nw-clock-philadelphia", west: 75.17, name: "Philadelphia" },
    { id: "nw-clock-new-york", west: 74.01, name: "New York" }
  ];

  function xOf(west) {
    return ML + (L0 - west) / (L0 - L1) * USABLE;
  }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function fmtClock(delayMin, afterNyc) {
    let minutes = 12 * 60 + afterNyc - delayMin;
    minutes = ((minutes % (24 * 60)) + (24 * 60)) % (24 * 60);
    let h = Math.floor(minutes / 60);
    let m = Math.round(minutes % 60);
    if (m === 60) { h = (h + 1) % 24; m = 0; }
    if (h === 12 && m === 0) return "12:00 noon";
    if (h === 0 && m === 0) return "12:00 midnight";
    const suffix = h < 12 ? "a.m." : "p.m.";
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    return h12 + ":" + String(m).padStart(2, "0") + " " + suffix;
  }
  function fmtLon(west) {
    if (Math.abs(west) < 0.05) return "0°";
    return (west >= 0 ? west.toFixed(1) + "° W" : Math.abs(west).toFixed(1) + "° E");
  }
  function nearestCity(west) {
    let best = null, bestD = 0.85;
    for (const c of CITIES) {
      const d = Math.abs(c.west - west);
      if (d < bestD) { bestD = d; best = c; }
    }
    return best;
  }

  function bind(root) {
    const line = root.querySelector("#nw-noon-line");
    const label = root.querySelector("#nw-noon-label");
    const slider = root.querySelector("input[type=range]");
    const readout = root.querySelector(".nw-readout");
    const play = root.querySelector(".nw-play");
    if (!line || !slider) return;

    const clocks = {};
    for (const c of CITIES) {
      const el = root.querySelector("#" + c.id);
      if (el) clocks[c.id] = el;
    }

    let playing = false;
    let raf = 0;
    let lastTs = 0;

    function setMinutes(t, fromPlay) {
      t = clamp(+t, 0, MAX_MIN);
      if (!fromPlay) slider.value = String(Math.round(t));
      const west = NYC + t / 4;
      const x = clamp(xOf(west), ML, W - MR);
      line.setAttribute("x1", x.toFixed(1));
      line.setAttribute("x2", x.toFixed(1));
      if (label) {
        const onLeft = x > 110;
        label.setAttribute("x", (onLeft ? x - 8 : x + 8).toFixed(1));
        label.setAttribute("text-anchor", onLeft ? "end" : "start");
      }
      for (const c of CITIES) {
        if (clocks[c.id]) clocks[c.id].textContent = fmtClock(c.west - NYC, t);
      }
      if (readout) {
        const near = nearestCity(west);
        readout.textContent = "Noon is at " + fmtLon(west) + (near ? " · " + near.name : "");
      }
    }

    function stop() {
      playing = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (play) play.textContent = "Play";
    }

    function tick(ts) {
      if (!playing) return;
      if (!lastTs) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;
      // Cross the strip in about 8 seconds.
      let t = +slider.value + dt * (MAX_MIN / 8);
      if (t >= MAX_MIN) { t = MAX_MIN; setMinutes(t, true); slider.value = String(MAX_MIN); stop(); return; }
      setMinutes(t, true);
      slider.value = String(t);
      raf = requestAnimationFrame(tick);
    }

    slider.addEventListener("input", () => { if (playing) stop(); setMinutes(slider.value); });
    if (play) {
      play.addEventListener("click", () => {
        if (playing) { stop(); return; }
        if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setMinutes(MAX_MIN);
          return;
        }
        if (+slider.value >= MAX_MIN - 0.5) setMinutes(0);
        playing = true;
        lastTs = 0;
        play.textContent = "Pause";
        raf = requestAnimationFrame(tick);
      });
    }
    setMinutes(slider.value || 0);
  }

  function init() {
    document.querySelectorAll(".nw").forEach(bind);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
