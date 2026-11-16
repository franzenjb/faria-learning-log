import fs from 'fs';
const { chromium } = await import(process.env.PW || 'playwright');
import { FACTS } from './facts.mjs';

const D = (process.argv[2] || 'narrator-out') + '/'; fs.mkdirSync(D, { recursive: true });
const b = await chromium.launch(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY, bypass: 'localhost,127.0.0.1' }, args: ['--ignore-certificate-errors'] } : {});
const p = await b.newPage({ viewport: { width: 1600, height: 1000 }, ignoreHTTPSErrors: true });
p.on('pageerror', e => console.log('ERR', e.message));
await p.goto('http://localhost:8791/claude1/v3/?talk=30'); await p.waitForTimeout(2000);
await p.evaluate(() => { try { localStorage.setItem('v3-keys-off', '1'); } catch (e) {} });
const live = await p.evaluate(() => COURSE_LIVE.map(c => ({ t: c.t, label: c.label, ch: c.ch, script: c.script })));
for (let i = 0; i < live.length; i++) {
  await p.evaluate(i => go(i), i); await p.waitForTimeout(i === 0 ? 1500 : 3500);
  await p.screenshot({ path: D + `s${String(i).padStart(2, '0')}.jpg`, type: 'jpeg', quality: 80 });
}
fs.writeFileSync(D + 'live.json', JSON.stringify(live));
const titleCase = t => String(t).replace(/(^|[\s:–—-])([a-z])/g, (m, a, b) => a + b.toUpperCase()).replace(/\b(A|An|And|At|But|By|For|In|Of|On|Or|The|To|Vs)\b/g, (w, x, o) => o === 0 ? w : w.toLowerCase());
const esc = s => String(s).replace(/&amp;/g, '&').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const MAIN = live.findIndex(c => c.t === 'Where am I, now') + 1;
const pages = live.map((c, i) => {
  let lines = [...c.script], min = '';
  const m = lines[0].match(/^⏱ ([\d.]+) min · /); if (m) { min = m[1]; lines[0] = lines[0].slice(m[0].length); }
  const img = fs.readFileSync(D + `s${String(i).padStart(2, '0')}.jpg`).toString('base64');
  const app = i >= MAIN;
  const say = lines.map(l => /^(→|Build it|One continuous camera)/.test(l) ? `<li class="dir">${esc(l)}</li>` : `<li>${esc(l)}</li>`).join('');
  const facts = (FACTS[c.t] || []).map(f => `<li>${esc(f)}</li>`).join('');
  return `<section class="pg"><div class="left"><header><span class="n">${app ? 'Appendix' : 'Slide ' + i} · ${i} / ${live.length - 1}</span><span class="min">${min ? min + ' min' : ''}</span></header>
  <img src="data:image/jpeg;base64,${img}"><h1>${esc(titleCase(c.label))}</h1></div>
  <div class="right"><h2>Say</h2><ol class="say">${say}</ol>
  ${facts ? `<h2>Details, Facts &amp; Stories</h2><ul class="facts">${facts}</ul>` : ''}</div></section>`;
}).join('');
const html = `<!doctype html><meta charset="utf-8"><title>Where Am I? Narrator's Deck</title><style>
@page{size:11in 8.5in;margin:0}
*{box-sizing:border-box}html,body{margin:0;background:#0b1020;color:#ece6da;font-family:Georgia,serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.pg{width:11in;height:8.5in;padding:.4in .45in;page-break-after:always;background:#0b1020;display:flex;gap:.35in;overflow:hidden}
.left{flex:0 0 5.3in;display:flex;flex-direction:column}
.right{flex:1;min-width:0;overflow:hidden}
header{display:flex;justify-content:space-between;font:12px/1 'Courier New',monospace;color:#9a9382;letter-spacing:.04em;margin-bottom:.12in}
header .min{color:#f0b35a}
.left img{width:5.3in;border-radius:8px;border:1px solid #2e3854}
.left h1{margin:.14in 0 0;font-weight:400;font-size:24px;line-height:1.25;color:#f0b35a}
h2{font:600 11px/1 Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#6fb3ff;margin:0 0 .08in;border-bottom:1px solid #2e3854;padding-bottom:5px}
.right h2+ol,.right h2+ul{margin-bottom:.18in}
.say{margin:0;padding-left:1.4em;font-size:14.5px;line-height:1.4}.say li{margin:0 0 .06in}.say li::marker{color:#f0b35a;font-family:Arial,sans-serif;font-size:12px}
.say li.dir{color:#9a9382;font-style:italic;font-size:12.5px}
.facts{margin:0;padding-left:1.1em;font-size:11px;line-height:1.36;color:#cfc8ba}.facts li{margin:0 0 .04in}.facts li::marker{color:#6fb3ff}
.cont{display:block}.cont h1{font-weight:400;font-size:22px;color:#f0b35a;margin:0 0 .16in}.cont .facts{columns:2;column-gap:.4in;font-size:12.5px;line-height:1.45}.cont .facts li{break-inside:avoid}
.cover{display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}
.cover h1{font-weight:400;font-size:52px;color:#f0b35a;margin:0 0 .2in}.cover p{color:#cfc8ba;font-size:17px;line-height:1.5;max-width:7in}
</style>
<section class="pg cover"><h1>Where Am I?</h1><p>Narrator’s Deck · 30-Minute Talk</p><p style="font-size:13px;color:#9a9382">Each page: the screen your audience sees on the left; on the right, the lines to say (one per → press or number key), then details, facts and stories for questions.<br>Slides 1–${MAIN - 1} are the talk. Everything after GPS is appendix, only if asked.</p></section>
${pages}`;
fs.writeFileSync(D + 'narrator.html', html);
const q = await b.newPage({ viewport: { width: 1056, height: 816 } }); await q.goto('file://' + fs.realpathSync(D) + '/' + 'narrator.html'); await q.waitForTimeout(500);
// notes too long for one page: move the facts onto a continuation page
await q.evaluate(() => { for (const g of [...document.querySelectorAll('.pg')]) { const r = g.querySelector('.right'); if (!r || r.scrollHeight <= r.clientHeight + 2) continue;
  const f = r.querySelector('.facts'), h = f && f.previousElementSibling; if (!f) continue;
  const c = document.createElement('section'); c.className = 'pg cont'; c.innerHTML = `<div class="contwrap"><header>${g.querySelector('header').innerHTML}</header><h1>${g.querySelector('h1').textContent} · Continued</h1></div>`;
  c.querySelector('.contwrap').append(h, f); g.after(c); } });
await q.pdf({ path: D + 'Where-Am-I-Narrators-Deck.pdf', width: '11in', height: '8.5in', printBackground: true, preferCSSPageSize: true });
await b.close(); console.log('pages', live.length, 'main', MAIN);
