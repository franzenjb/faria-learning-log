// Browser checks for /gisday/, the GIS Day 2026 presenter deck.
// node build.mjs, serve dist/, then:
//   node tests/gisday-browser.mjs [http://localhost:8791]
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const loaded = process.env.PLAYWRIGHT_MODULE
  ? await import(process.env.PLAYWRIGHT_MODULE)
  : require('playwright-core');
const { chromium } = loaded.chromium ? loaded : loaded.default;
import assert from 'node:assert/strict';
import fs from 'node:fs';

const base = (process.argv[2] || 'http://127.0.0.1:8791').replace(/\/$/, '');
const url = base + '/gisday/';
const outDir = process.env.SHOT_DIR || '/opt/cursor/artifacts/gisday';
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

await page.goto(url, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(500);
assert.deepEqual(errors, [], 'load: no console errors');

const meta = await page.evaluate(() => ({
  n: __deck.slides.length,
  titles: __deck.slides.map(s => s.title),
  ends: __deck.slides.map(s => s.endMin),
  caps: __deck.slides.map(s => s.caps),
  pauses: __deck.slides.map(s => s.pause || null)
}));
assert.equal(meta.n, 28, 'slide count');
const closeAt = meta.titles.lastIndexOf('Where Am I?');
assert.equal(meta.ends[closeAt], 28, 'close ends at 28:00, before Q&A');
for (let i = 1; i <= closeAt; i++) assert.ok(meta.ends[i] > meta.ends[i - 1], 'clock targets increase');
assert.equal(meta.titles.includes('A Thousand Paces'), false);
assert.ok(meta.titles.indexOf('One Degree More') > closeAt, 'star day is after the close');
assert.equal(meta.titles[closeAt + 1], 'Appendix');
assert.equal(meta.pauses.filter(Boolean).length, 6, 'six room pauses');
const joined = JSON.stringify(meta);
assert.equal(joined.includes('GIS Month'), false);
assert.equal(joined.toLowerCase().includes('six connected'), false);
assert.ok(meta.titles[0] === 'Where Am I?');
assert.equal(meta.titles[1], 'The Isles of Scilly');
assert.equal(meta.titles[3], "Rome's Parallel");
assert.equal(meta.titles[5], 'Call a Square');
assert.equal(meta.titles[6], 'The Mile');
assert.equal(meta.titles.indexOf('Was 1900 a Leap Year?'), meta.titles.indexOf('One Circle, One Day') + 1);
assert.ok(meta.titles.indexOf('The Prime Meridian') > meta.titles.indexOf('A Watch That Could Travel'));
assert.equal(meta.titles.indexOf('The Date Line'), meta.titles.indexOf('The Prime Meridian') + 1);
assert.equal(meta.titles.includes('Easier on Land'), false);
const stickI = meta.titles.indexOf('A Stick and a Shadow');
const wholeI = meta.titles.indexOf('The Whole Earth');
assert.equal(wholeI, stickI + 1);
assert.equal(meta.caps[stickI].length, 3);
assert.equal(meta.caps[wholeI].length, 4);

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

for (let i = 0; i < meta.n; i++) {
  const last = meta.caps[i].length - 1;
  await page.evaluate(({ i, last }) => __deck.go(i, last), { i, last });
  await page.waitForTimeout(800);
  const shot = `${outDir}/${String(i + 1).padStart(2, '0')}-${slug(meta.titles[i])}.png`;
  await page.screenshot({ path: shot });
  const painted = await page.evaluate(() => {
    const ctx = document.querySelector('canvas').getContext('2d');
    const { data } = ctx.getImageData(0, 0, 1920, 1080);
    let ink = 0;
    for (let p = 0; p < data.length; p += 16) {
      if (data[p] < 250 || data[p + 1] < 250 || data[p + 2] < 245) ink++;
    }
    const scroll = document.documentElement.scrollWidth - innerWidth;
    const counter = ctx.font;
    return { ink, scroll, w: document.querySelector('canvas').width, h: document.querySelector('canvas').height, font: counter };
  });
  assert.equal(painted.w, 1920, meta.titles[i]);
  assert.equal(painted.h, 1080, meta.titles[i]);
  assert.ok(painted.ink > 200, meta.titles[i] + ' draws');
  assert.ok(painted.scroll <= 0, meta.titles[i] + ' no sideways scroll');
  assert.deepEqual(errors, [], meta.titles[i] + ' no console errors');
}

// Eratosthenes: the shadow falls north of Alexandria, away from Syene.
const stick = meta.titles.indexOf('A Stick and a Shadow');
const whole = meta.titles.indexOf('The Whole Earth');
await page.evaluate(i => __deck.go(i, 1), stick);
await page.waitForTimeout(900);
const geom = await page.evaluate(() => __deck.slides.find(s => s.title === 'A Stick and a Shadow').geom);
assert.ok(geom.north, 'shadow is on the north side of the stick');
assert.ok(geom.shx < geom.ax - 20, 'shadow tip is north of the Alexandria base');
assert.ok(geom.sx > geom.ax + 200, 'Syene is south of Alexandria');
assert.ok(Math.abs(geom.angle - 7.2) < 0.15, 'the sun ray meets the stick at 7.2°');
assert.equal(geom.well, true, 'the Syene well is on the shadow step');
await page.screenshot({ path: `${outDir}/stick-shadow-well.png` });
await page.evaluate(i => __deck.go(i, 2), stick);
await page.waitForTimeout(900);
const wedge = await page.evaluate(() => __deck.slides.find(s => s.title === 'A Stick and a Shadow').geom);
assert.ok(wedge.far > 0.95, 'zoom-out reaches the center');
await page.screenshot({ path: `${outDir}/stick-wedge.png` });
await page.evaluate(i => __deck.go(i, 1), whole);
await page.waitForTimeout(900);
await page.screenshot({ path: `${outDir}/whole-earth-slices.png` });
await page.evaluate(i => __deck.go(i, 3), whole);
await page.waitForTimeout(900);
await page.screenshot({ path: `${outDir}/whole-earth-miles.png` });
await page.evaluate(i => __deck.go(i, 0), stick);
await page.waitForTimeout(800);
await page.screenshot({ path: `${outDir}/stick-well.png` });

// Animation: a new step changes pixels, then settles.
await page.evaluate(() => __deck.go(2, 0));
await page.waitForTimeout(800);
const before = await page.evaluate(() => document.querySelector('canvas').toDataURL());
await page.evaluate(() => __deck.go(2, 1));
await page.waitForTimeout(220);
const mid = await page.evaluate(() => document.querySelector('canvas').toDataURL());
await page.waitForTimeout(900);
const after = await page.evaluate(() => document.querySelector('canvas').toDataURL());
assert.notEqual(before, mid, 'step starts an animation');
assert.notEqual(mid, after, 'animation is still moving after the click');

// Keyboard from the first step through the last.
await page.evaluate(() => __deck.go(0, 0));
const totalSteps = meta.caps.reduce((n, c) => n + c.length, 0);
for (let k = 0; k < totalSteps + 2; k++) await page.keyboard.press('ArrowRight');
const end = await page.evaluate(() => ({ i: __deck.idx, s: __deck.step, n: __deck.slides.length, last: __deck.slides.at(-1).caps.length - 1 }));
assert.equal(end.i, end.n - 1, 'arrows reach the last slide');
assert.equal(end.s, end.last, 'arrows reach the last step');
await page.keyboard.press('ArrowLeft');
const back = await page.evaluate(() => ({ i: __deck.idx, s: __deck.step }));
assert.ok(back.i < end.i || back.s < end.s, 'arrow left goes back a step');
await page.keyboard.press('Home');
assert.equal(await page.evaluate(() => __deck.idx), 0, 'Home returns to the cover');

// Click leaves the one-step title card for the Havana question.
await page.mouse.click(960, 540);
await page.waitForTimeout(50);
assert.equal(await page.evaluate(() => __deck.idx), 1, 'click leaves the title card');
assert.equal(await page.evaluate(() => __deck.step), 0, 'Havana opens on the question');

// Notes open on the Havana vote, which is no longer the second slide.
const havana = meta.titles.indexOf('Where Am I?', 1);
await page.evaluate(i => __deck.go(i, 0), havana);
await page.keyboard.press('n');
await page.waitForTimeout(50);
const noteText = await page.locator('#notes').innerText();
assert.match(noteText, /By 3:00/);
assert.match(noteText, /30 seconds/);
await page.keyboard.press('n');
assert.equal(await page.locator('#notes').isHidden(), true, 'N hides notes');

// Drag the walker. Slide index: find Fists.
const fist = meta.titles.indexOf('Fists and the Pole Star');
await page.evaluate(i => __deck.go(i, 2), fist);
await page.waitForTimeout(800);
const beforeLat = await page.evaluate(() => __deck.slides.find(s => s.title.startsWith('Fists')).state.lat);
await page.mouse.move(880, 510);
await page.mouse.down();
await page.mouse.move(800, 420, { steps: 8 });
await page.mouse.up();
const afterLat = await page.evaluate(() => __deck.slides.find(s => s.title.startsWith('Fists')).state.lat);
assert.ok(afterLat > beforeLat + 5, 'dragging the figure north raises the latitude');

// One Circle tells 24 hours, then 15 degrees, then 30 degrees.
const circle = meta.titles.indexOf('One Circle, One Day');
assert.match(meta.caps[circle][0], /overhead/);
assert.ok(meta.caps[circle].some(c => c.includes('15')));
assert.ok(meta.caps[circle].some(c => c.includes('30')));
await page.evaluate(i => __deck.go(i, 5), circle);
await page.waitForTimeout(200);
assert.equal(await page.evaluate(() => __deck.step), 5);

// Call a Square toggles do not advance the slide.
const bingo = meta.titles.indexOf('Call a Square');
await page.evaluate(i => __deck.go(i, 0), bingo);
await page.waitForTimeout(200);
assert.equal(await page.locator('#layers').isHidden(), false, 'layer buttons show on Call a Square');
await page.click('#tog-lon');
const lonOnly = await page.evaluate(() => __deck.slides.find(s => s.title === 'Call a Square').state);
assert.equal(lonOnly.lon, true, 'Longitude toggles on');
assert.equal(lonOnly.lat, false, 'Latitude stays off');
assert.equal(lonOnly.bingo, false, 'Bingo stays off');
assert.equal(await page.evaluate(() => __deck.step), 0, 'a toggle does not advance');
await page.click('#tog-lat');
await page.click('#tog-bingo');
const allOn = await page.evaluate(() => __deck.slides.find(s => s.title === 'Call a Square').state);
assert.equal(allOn.lat && allOn.lon && allOn.bingo, true, 'all three layers can be on together');
await page.evaluate(i => __deck.go(i, 0), 0);
assert.equal(await page.locator('#layers').isHidden(), true, 'layer buttons hide off this slide');

// Full screen key must not throw.
await page.keyboard.press('f');
await page.waitForTimeout(100);
assert.deepEqual(errors, [], 'F key throws nothing');

// 720p projector: the canvas scales, the page does not scroll.
await page.setViewportSize({ width: 1280, height: 720 });
await page.waitForTimeout(200);
const fit = await page.evaluate(() => ({
  sx: document.documentElement.scrollWidth - innerWidth,
  sy: document.documentElement.scrollHeight - innerHeight,
  box: document.querySelector('canvas').getBoundingClientRect()
}));
assert.ok(fit.sx <= 1 && fit.sy <= 1, '720p does not scroll');
assert.ok(fit.box.width <= 1280 + 1 && fit.box.height <= 720 + 1, '720p canvas fits');
assert.ok(Math.abs(fit.box.width / fit.box.height - 16 / 9) < 0.02, 'canvas keeps 16:9');

await browser.close();
console.log(`gisday browser checks passed (${meta.n} slides)`);
console.log(meta.titles.map((t, i) => `${i + 1}. ${t}  by ${meta.ends[i]}`).join('\n'));
