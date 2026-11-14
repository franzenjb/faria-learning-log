// How Far Is It? Navigation matches the classroom decks: arrows, #12, notes on N.
const NS = "http://www.w3.org/2000/svg";
const slides = [...document.querySelectorAll(".slide")];
const fitEl = document.getElementById("fit");
const counter = document.getElementById("counter");
const notesEl = document.getElementById("notes");
const notesBody = document.getElementById("notes-body");
const notesMeta = document.getElementById("notes-meta");
const indexEl = document.getElementById("index");
const indexList = document.getElementById("index-list");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
let cur = 1;
let raf = 0;

function fit() {
  const s = Math.min(innerWidth / 1920, innerHeight / 1080);
  fitEl.style.transform = `translate(${(innerWidth - 1920 * s) / 2}px, ${(innerHeight - 1080 * s) / 2}px) scale(${s})`;
}
addEventListener("resize", fit);
fit();

function svgEl(name, attrs, parent) {
  const n = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs || {})) if (v != null) n.setAttribute(k, String(v));
  if (parent) parent.appendChild(n);
  return n;
}
function arm(root) {
  if (reduce) return;
  root.querySelectorAll("[data-draw]").forEach((el, i) => {
    let len = 0;
    try { len = el.getTotalLength(); } catch (e) { len = 0; }
    if (!len) return;
    el.style.strokeDasharray = String(len);
    el.style.strokeDashoffset = String(len);
    el.style.animation = "none";
    void el.getBoundingClientRect();
    const dur = el.dataset.dur || "1.2s";
    const delay = el.dataset.delay || (0.05 + i * 0.1) + "s";
    el.style.animation = `draw ${dur} ${delay} ease forwards`;
  });
}
function clearScene(svg) {
  if (!svg) return;
  svg._built = false;
  svg._orbitDrawn = false;
  svg._samples = null;
  svg._boat = null;
  svg._rig = null;
  svg.replaceChildren();
}

const INK = "#161514";
const RED = "#b01f24";
const HAIR = "#cdc8bc";
const MUTE = "#6b6763";

function hit(eye, thumb, wallX) {
  const t = (wallX - eye.x) / (thumb.x - eye.x);
  return { x: wallX, y: eye.y + t * (thumb.y - eye.y) };
}

function buildRig(svg) {
  const g = svgEl("g", {}, svg);
  svgEl("line", { "data-draw": "", x1: 1460, y1: 80, x2: 1460, y2: 640, stroke: INK, "stroke-width": 3, class: "wall" }, g);
  svgEl("text", { x: 1484, y: 110, "font-size": 30, fill: MUTE, class: "wall-label" }, g).textContent = "far wall";
  const base = svgEl("line", { "data-draw": "", x1: 180, y1: 250, x2: 180, y2: 530, stroke: INK, "stroke-width": 3, class: "base" }, g);
  svgEl("text", { x: 40, y: 400, "font-size": 30, class: "base-label" }, g).textContent = "baseline";
  const eyes = [0, 1].map((i) => {
    const eye = svgEl("g", { class: "eye" }, g);
    svgEl("circle", { cx: 250, cy: 250, r: 26, fill: "#fffdf6", stroke: INK, "stroke-width": 3 }, eye);
    svgEl("circle", { cx: 258, cy: 250, r: 8, fill: INK, class: "pupil" }, eye);
    return eye;
  });
  const thumb = svgEl("rect", { x: 800, y: 250, width: 46, height: 210, rx: 23, fill: "#fffdf6", stroke: INK, "stroke-width": 3 }, g);
  svgEl("text", { x: 823, y: 500, "text-anchor": "middle", "font-size": 30, fill: MUTE, class: "thumb-label" }, g).textContent = "thumb";
  const rays = [0, 1].map(() => svgEl("line", { x1: 0, y1: 0, x2: 0, y2: 0, stroke: HAIR, "stroke-width": 2, "stroke-dasharray": "8 8" }, g));
  const dots = [0, 1].map(() => svgEl("circle", { cx: 0, cy: 0, r: 7, fill: HAIR }, g));
  const bracket = svgEl("line", { x1: 1500, y1: 0, x2: 1500, y2: 0, stroke: RED, "stroke-width": 3, class: "bracket" }, g);
  const jump = svgEl("text", { x: 1520, y: 400, "font-size": 32, fill: RED, class: "jump-label" }, g);
  jump.textContent = "the jump";
  svg._rig = { g, base, eyes, thumb, rays, dots, bracket, jump };
  svg._built = true;
  requestAnimationFrame(() => arm(g));
}

function placeRig(svg, eyeA, eyeB, thumb, wallX, on) {
  const rig = svg._rig;
  const eyes = [eyeA, eyeB];
  rig.base.setAttribute("x1", eyeA.x - 70);
  rig.base.setAttribute("x2", eyeA.x - 70);
  rig.base.setAttribute("y1", eyeA.y);
  rig.base.setAttribute("y2", eyeB.y);
  const bl = svg.querySelector(".base-label");
  bl.setAttribute("text-anchor", "end");
  bl.setAttribute("x", eyeA.x - 86);
  bl.setAttribute("y", (eyeA.y + eyeB.y) / 2 + 8);
  eyes.forEach((e, i) => {
    const eye = rig.eyes[i];
    const c = eye.querySelector("circle");
    const p = eye.querySelector(".pupil");
    const active = on === i;
    c.setAttribute("cx", e.x); c.setAttribute("cy", e.y);
    c.setAttribute("fill", active ? INK : "#fffdf6");
    p.setAttribute("cx", e.x + 8); p.setAttribute("cy", e.y);
    p.setAttribute("fill", active ? "#fffdf6" : INK);
  });
  rig.thumb.setAttribute("x", thumb.x - 23);
  rig.thumb.setAttribute("y", thumb.y - 105);
  const tl = svg.querySelector(".thumb-label");
  tl.setAttribute("x", thumb.x);
  tl.setAttribute("y", thumb.y + 150);
  const hits = eyes.map((e) => hit(e, thumb, wallX));
  const wall = svg.querySelector(".wall");
  wall.setAttribute("x1", wallX); wall.setAttribute("x2", wallX);
  svg.querySelector(".wall-label").setAttribute("x", wallX + 24);
  hits.forEach((h, i) => {
    const active = on === i;
    const ray = rig.rays[i];
    ray.setAttribute("x1", eyes[i].x); ray.setAttribute("y1", eyes[i].y);
    ray.setAttribute("x2", h.x); ray.setAttribute("y2", h.y);
    ray.setAttribute("stroke", active ? RED : HAIR);
    ray.setAttribute("stroke-width", active ? 3.5 : 2);
    if (active) ray.removeAttribute("stroke-dasharray");
    else ray.setAttribute("stroke-dasharray", "8 8");
    const d = rig.dots[i];
    d.setAttribute("cx", h.x); d.setAttribute("cy", h.y);
    d.setAttribute("r", active ? 11 : 6);
    d.setAttribute("fill", active ? RED : HAIR);
  });
  const y1 = Math.min(hits[0].y, hits[1].y);
  const y2 = Math.max(hits[0].y, hits[1].y);
  rig.bracket.setAttribute("x1", wallX + 36);
  rig.bracket.setAttribute("x2", wallX + 36);
  rig.bracket.setAttribute("y1", y1);
  rig.bracket.setAttribute("y2", y2);
  rig.jump.setAttribute("text-anchor", "start");
  rig.jump.setAttribute("x", wallX + 48);
  rig.jump.setAttribute("y", (y1 + y2) / 2 + 8);
  return Math.abs(hits[0].y - hits[1].y);
}

const scenes = {
  blink(svg, t) {
    if (!svg._built) buildRig(svg);
    const on = Math.floor(t / 1.7) % 2;
    placeRig(svg, { x: 260, y: 270 }, { x: 260, y: 510 }, { x: 860, y: 390 }, 1320, on);
  },
  shrink(svg, t) {
    if (!svg._built) buildRig(svg);
    const u = reduce ? 1 : (0.5 - 0.5 * Math.cos(Math.min(t / 6, 1) * Math.PI));
    const thumbX = 560 + (1180 - 560) * u;
    const on = Math.floor(t / 1.4) % 2;
    const jump = placeRig(svg, { x: 260, y: 270 }, { x: 260, y: 510 }, { x: thumbX, y: 390 }, 1340, on);
    const label = svg.querySelector(".jump-label");
    label.textContent = u < 0.15 ? "a big jump" : u > 0.85 ? "a small jump" : "the jump";
    svg.querySelector(".thumb-label").textContent = u > 0.7 ? "farther" : "thumb";
    svg.dataset.jump = jump.toFixed(0);
  },
  boat(svg, t) {
    if (!svg._built) {
      const p0 = 80, p1 = 1500;
      const samples = [];
      for (let i = 0; i <= 40; i++) {
        const u = i / 40;
        samples.push([p0 + (p1 - p0) * u, 470 - Math.sin(u * Math.PI) * 90]);
      }
      const d = samples.map((q, i) => (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" ");
      svgEl("path", { d, fill: "none", stroke: RED, "stroke-width": 3, class: "track", "data-draw": "", "data-dur": "7s" }, svg);
      svgEl("circle", { cx: samples[7][0], cy: samples[7][1] + 36, r: 5, fill: INK }, svg);
      svgEl("text", { x: samples[7][0], y: samples[7][1] + 78, "text-anchor": "middle", "font-size": 30 }, svg).textContent = "Tofua · 2 May";
      const end = svgEl("text", { x: samples[40][0] - 10, y: samples[40][1] + 78, "text-anchor": "end", "font-size": 30, opacity: 0, class: "end-label" }, svg);
      end.textContent = "Coupang · 14 June";
      const boat = svgEl("g", { class: "boat" }, svg);
      svgEl("path", { d: "M-34 0 L34 0 L22 16 L-22 16 Z", fill: INK }, boat);
      svgEl("line", { x1: 0, y1: 0, x2: 0, y2: -36, stroke: INK, "stroke-width": 2.5 }, boat);
      svgEl("path", { d: "M2 -34 L24 -8 L2 -8 Z", fill: "#fffdf6", stroke: INK, "stroke-width": 1.6 }, boat);
      svg._samples = samples;
      svg._boat = boat;
      svg._built = true;
      requestAnimationFrame(() => arm(svg));
    }
    const u = reduce ? 1 : Math.max(0, Math.min(t / 7, 1));
    const s = svg._samples;
    if (!s || s.length < 2) return;
    const i = Math.min(s.length - 2, Math.max(0, Math.floor(u * (s.length - 1))));
    const f = u * (s.length - 1) - i;
    const x = s[i][0] + (s[i + 1][0] - s[i][0]) * f;
    const y = s[i][1] + (s[i + 1][1] - s[i][1]) * f;
    svg._boat.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    const end = svg.querySelector(".end-label");
    if (end) end.setAttribute("opacity", u > 0.92 ? "1" : "0");
  },
  loop(svg, t) {
    if (!svg._built) {
      buildRig(svg);
      const og = svgEl("g", { class: "orbit-scene", opacity: 0 }, svg);
      svgEl("line", { "data-draw": "", x1: 180, y1: 86, x2: 1420, y2: 86, stroke: HAIR, "stroke-width": 2 }, og);
      svgEl("text", { x: 800, y: 58, "text-anchor": "middle", "font-size": 30, fill: MUTE }, og).textContent = "distant stars";
      svgEl("ellipse", { "data-draw": "", cx: 800, cy: 520, rx: 360, ry: 74, fill: "none", stroke: INK, "stroke-width": 2.5 }, og);
      svgEl("circle", { cx: 800, cy: 520, r: 11, fill: INK }, og);
      svgEl("text", { x: 820, y: 526, "font-size": 30, fill: MUTE }, og).textContent = "Sun";
      svgEl("circle", { cx: 440, cy: 520, r: 16, fill: "#fffdf6", stroke: INK, "stroke-width": 3 }, og);
      svgEl("text", { x: 440, y: 660, "text-anchor": "middle", "font-size": 30 }, og).textContent = "January";
      svgEl("circle", { cx: 1160, cy: 520, r: 16, fill: INK }, og);
      svgEl("text", { x: 1160, y: 660, "text-anchor": "middle", "font-size": 30 }, og).textContent = "July";
      svgEl("line", { "data-draw": "", x1: 440, y1: 520, x2: 933, y2: 86, stroke: RED, "stroke-width": 2.5 }, og);
      svgEl("line", { "data-draw": "", x1: 1160, y1: 520, x2: 667, y2: 86, stroke: RED, "stroke-width": 2.5 }, og);
      svgEl("circle", { cx: 800, cy: 250, r: 8, fill: INK }, og);
      svgEl("text", { x: 780, y: 242, "text-anchor": "end", "font-size": 30 }, og).textContent = "a nearby star";
      svgEl("line", { "data-draw": "", x1: 667, y1: 118, x2: 933, y2: 118, stroke: RED, "stroke-width": 3 }, og);
      svgEl("text", { x: 952, y: 128, "font-size": 32, fill: RED }, og).textContent = "the parallax";
      svg._orbit = og;
    }
    const showOrbit = reduce || t >= 2.3;
    const on = Math.floor(t / 1.7) % 2;
    placeRig(svg, { x: 260, y: 270 }, { x: 260, y: 510 }, { x: 860, y: 390 }, 1320, on);
    svg._rig.g.setAttribute("opacity", showOrbit ? "0" : "1");
    svg._orbit.setAttribute("opacity", showOrbit ? "1" : "0");
    if (showOrbit && !svg._orbitDrawn) {
      svg._orbitDrawn = true;
      arm(svg._orbit);
    }
  }
};

function startScene(slide) {
  cancelAnimationFrame(raf);
  const name = slide.dataset.scene;
  const svg = slide.querySelector("svg");
  if (!name || !scenes[name] || !svg) return;
  clearScene(svg);
  const t0 = performance.now();
  const step = (now) => {
    if (!slide.classList.contains("active")) return;
    scenes[name](svg, reduce ? 30 : (now - t0) / 1000);
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
}

function minutesBefore(n) {
  let s = 0;
  for (let i = 0; i < n - 1; i++) s += Number(slides[i].dataset.min) || 0;
  return s;
}
function totalMinutes() {
  return slides.reduce((s, el) => s + (Number(el.dataset.min) || 0), 0);
}
document.documentElement.dataset.minutes = totalMinutes().toFixed(1);
document.documentElement.dataset.slides = String(slides.length);

function showNotes() {
  const slide = slides[cur - 1];
  const tpl = slide.querySelector("template");
  notesBody.innerHTML = tpl ? tpl.innerHTML : "";
  document.querySelector("#notes h2").textContent = slide.dataset.title;
  const mine = Number(slide.dataset.min) || 0;
  const soFar = minutesBefore(cur);
  const tot = totalMinutes();
  notesMeta.textContent = `Slide ${cur} of ${slides.length} · about ${mine} min · ${soFar.toFixed(0)} min in · ${tot.toFixed(0)} min talk`;
  notesEl.hidden = false;
}
function toggleNotes(force) {
  const open = force != null ? force : notesEl.hidden;
  if (open) showNotes(); else notesEl.hidden = true;
}
function toggleIndex(force) {
  const open = force != null ? force : indexEl.hidden;
  indexEl.hidden = !open;
  if (open) {
    indexList.innerHTML = slides.map((s, i) => {
      const title = s.dataset.title;
      return `<li><button type="button" data-go="${i + 1}" class="${i + 1 === cur ? "on" : ""}">${i + 1}. ${title}</button></li>`;
    }).join("");
  }
}

function go(n, fromHash) {
  n = Math.max(1, Math.min(slides.length, n | 0));
  cur = n;
  slides.forEach((s, i) => s.classList.toggle("active", i === n - 1));
  const title = slides[n - 1].dataset.title;
  counter.textContent = `${n} / ${slides.length} · ${title}`;
  document.title = `${title} · How Far Is It?`;
  if (!fromHash) {
    const next = "#" + n;
    if (location.hash !== next) history.replaceState(null, "", next);
  }
  startScene(slides[n - 1]);
  arm(slides[n - 1]);
  if (!notesEl.hidden) showNotes();
  indexList.querySelectorAll("button").forEach((b) => b.classList.toggle("on", Number(b.dataset.go) === n));
}

document.getElementById("next").addEventListener("click", () => go(cur + 1));
document.getElementById("prev").addEventListener("click", () => go(cur - 1));
document.getElementById("notes-close").addEventListener("click", () => toggleNotes(false));
document.getElementById("index-close").addEventListener("click", () => toggleIndex(false));
indexList.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  go(Number(b.dataset.go));
  toggleIndex(false);
});

addEventListener("keydown", (e) => {
  if (e.target.closest && e.target.closest("input, textarea")) return;
  const k = e.key;
  if (k === "Escape") {
    if (!indexEl.hidden) { toggleIndex(false); return; }
    if (!notesEl.hidden) { toggleNotes(false); return; }
    if (document.fullscreenElement) document.exitFullscreen();
    return;
  }
  if (k.toLowerCase() === "n") { e.preventDefault(); toggleNotes(); return; }
  if (k.toLowerCase() === "i" || k.toLowerCase() === "o") { e.preventDefault(); toggleIndex(); return; }
  if (k.toLowerCase() === "f") {
    e.preventDefault();
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.().catch(() => {});
    return;
  }
  if (indexEl.hidden === false && k !== "Home" && k !== "End") return;
  if (k === "ArrowRight" || k === "PageDown" || k === " ") { e.preventDefault(); go(cur + 1); }
  else if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); go(cur - 1); }
  else if (k === "Home") { e.preventDefault(); go(1); }
  else if (k === "End") { e.preventDefault(); go(slides.length); }
});
addEventListener("hashchange", () => {
  const n = parseInt(location.hash.slice(1), 10);
  if (n && n !== cur) go(n, true);
});

const start = parseInt(location.hash.slice(1), 10) || 1;
go(start);
