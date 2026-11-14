// Presenter shell for the GIS Day talk. The pictures live in slides.js.
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
const cover = document.getElementById('cover');
const qEl = document.getElementById('q');
const lineEl = document.getElementById('line');
const menu = document.getElementById('menu');
const notes = document.getElementById('notes');
const shade = document.getElementById('shade');
let idx = 0, step = 0, born = performance.now(), st = {}, votes = [];
let down = null, dragged = false, menuOpen = false, notesOn = false;

function fit() {
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  const w = Math.max(2, Math.round(innerWidth * dpr)), h = Math.max(2, Math.round(innerHeight * dpr));
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function go(i, s = 0) {
  idx = Math.max(0, Math.min(GIS.length - 1, i));
  step = s;
  born = performance.now();
  st = {};
  votes = [0, 0, 0, 0];
  const slide = GIS[idx];
  if (slide.enter) slide.enter(st);
  paintMenu();
  paintNotes();
}
function nextBeat() {
  const slide = GIS[idx];
  if (step < (slide.beats || 1) - 1) { step++; born = performance.now(); if (slide.enterStep) slide.enterStep(st, step); }
  else go(idx + 1, 0);
}
function prevBeat() {
  if (step > 0) { step--; born = performance.now(); }
  else go(idx - 1, 0);
}
function local(e) {
  const r = canvas.getBoundingClientRect();
  return { x: (e.clientX - r.left) * (innerWidth / r.width), y: (e.clientY - r.top) * (innerHeight / r.height) };
}
ENG.bindOrbit(canvas, () => (!st.lock && !(GIS[idx].quiz && step === 0) ? st : null));

canvas.addEventListener('pointerdown', e => {
  if (menuOpen) return;
  down = { x: e.clientX, y: e.clientY }; dragged = false;
  const p = local(e);
  const slide = GIS[idx];
  if (slide.pointer) slide.pointer(st, 'down', p.x, p.y);
});
canvas.addEventListener('pointermove', e => {
  if (!down) return;
  if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8) dragged = true;
  const p = local(e);
  const slide = GIS[idx];
  if (slide.pointer && dragged) slide.pointer(st, 'move', p.x, p.y);
});
canvas.addEventListener('pointerup', e => {
  const slide = GIS[idx];
  const p = local(e);
  const ate = slide.pointer && slide.pointer(st, 'up', p.x, p.y);
  if (down && !dragged && !menuOpen && !ate) nextBeat();
  down = null;
});
document.getElementById('next').onclick = e => { e.stopPropagation(); nextBeat(); };
document.getElementById('back').onclick = e => { e.stopPropagation(); prevBeat(); };
document.getElementById('slides').onclick = () => setMenu(true);
document.getElementById('menu-x').onclick = () => setMenu(false);
shade.onclick = () => setMenu(false);
function setMenu(on) { menuOpen = on; menu.hidden = !on; shade.hidden = !on; }
addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { nextBeat(); e.preventDefault(); }
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'Backspace') { prevBeat(); e.preventDefault(); }
  else if (e.key.toLowerCase() === 'n') { notesOn = !notesOn; notes.hidden = !notesOn; }
  else if (e.key.toLowerCase() === 'm') setMenu(!menuOpen);
  else if (e.key === 'Escape') setMenu(false);
  else if (e.key.toLowerCase() === 'f') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
});

const ACTS = [[0, 'Open'], [2, 'Act 1'], [7, 'Act 2'], [15, 'Act 3'], [25, 'Close'], [26, 'Appendix']];
function paintMenu() {
  const list = document.getElementById('menu-list');
  list.innerHTML = GIS.map((s, i) => {
    const act = ACTS.filter(a => a[0] === i)[0];
    return (act ? `<p class="act">${act[1]}</p>` : '') + `<button type="button" class="item${i === idx ? ' on' : ''}" data-i="${i}">${s.menu}</button>`;
  }).join('');
  list.querySelectorAll('button').forEach(b => b.onclick = () => { go(+b.dataset.i, 0); setMenu(false); });
}
function paintNotes() {
  const s = GIS[idx];
  notes.innerHTML = `<h2>${s.menu}</h2><p class="end">On the clock by ${s.end}</p>` + (s.notes || []).map(n => `<p>${n}</p>`).join('');
}

function frame(now) {
  requestAnimationFrame(frame);
  fit();
  const w = innerWidth, h = innerHeight;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#0a0e18'; ctx.fillRect(0, 0, w, h);
  const s = GIS[idx];
  const el = now - born;
  if (s.draw) s.draw(ctx, w, h, step, el, st, now);
  cover.hidden = !s.cover;
  const showQ = s.quiz && step === 0;
  qEl.hidden = !showQ;
  const qKey = showQ ? idx + ':' + votes.join(',') : '';
  if (qEl.dataset.key !== qKey) {
    qEl.dataset.key = qKey;
    if (showQ) {
      qEl.innerHTML = `<p>${s.quiz.q}</p><div class="opts">${s.quiz.opts.map((o, i) => `<button type="button" data-i="${i}" class="${votes[i] ? 'on' : ''}"><span class="L">${'ABCD'[i]}</span>${o}</button>`).join('')}</div>`;
      qEl.querySelectorAll('button').forEach(b => b.onclick = ev => { ev.stopPropagation(); votes[+b.dataset.i]++; });
    }
  }
  let line = '';
  if (typeof s.line === 'function') line = s.line(step, el, st) || '';
  else if (s.line) line = s.line;
  lineEl.hidden = !line || s.cover;
  lineEl.textContent = line;
}
paintMenu();
go(0, 0);
requestAnimationFrame(frame);
window.__deck = { go, slides: () => GIS.length };
