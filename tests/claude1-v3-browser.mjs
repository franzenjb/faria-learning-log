// Browser checks for /claude1/v3/, the storyline rebuild of the Claude course deck.
// Usage: node build.mjs, serve dist/, then
//   PLAYWRIGHT_MODULE=<path to playwright index.mjs> node tests/claude1-v3-browser.mjs [http://localhost:8791]
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const mod = process.env.PLAYWRIGHT_MODULE;
const {chromium} = mod ? await import(mod) : createRequire(import.meta.url)('playwright');
const base = (process.argv[2] || 'http://localhost:8791').replace(/\/$/, '');
const url = base + '/claude1/v3/';
const DAY1 = ['Scilly, 1707', 'Mental maps', 'Latitude &amp; Longitude', 'Walk north', 'Fist and knuckle', 'The pole star wanders', 'The quadrant', 'Power decides the measure', 'Eratosthenes', 'Hours are slices', 'Two ships, one latitude', 'The Longitude Act, 1714', 'Galileo\u2019s clock', 'Light needs time', 'The lunar distance', 'Pendulum at sea', 'A clock that could travel', 'Washington, 1884', 'The date line', 'Was 1900 a leap year?', 'Where am I, now'];
const NEW = [['Power decides the measure', ['#pm-rome', '#pm-eliz', '#pm-sea']], ['Fist and knuckle', ['#fk-tor', '#fk-go']], ['The pole star wanders', ['#ps-pyr', '#ps-vega']], ['Was 1900 a leap year?', ['#ly-no', '#ly-next', '#ly-next', '#ly-next', '#ly-next', '#ly-next', '#ly-next', '#ly-back']], ['Washington, 1884', ['#pm84-g', '#pm84-vote', '#pm84-fr']], ['The date line', ['#dl-2011', '#dl-kir', '#dl-now']], ['One degree more', ['#od-star', '#od-sun']], ['Where am I, now', ['#gps-ask']]];
const browser = await chromium.launch(process.env.CHROME_PATH ? {executablePath: process.env.CHROME_PATH} : {headless: true, channel: 'chrome'});

for (const [w, h] of [[1600, 900], [1280, 720]]) {
  const page = await browser.newPage({viewport: {width: w, height: h}});
  const errors = []; page.on('pageerror', e => errors.push(String(e)));
  await page.goto(url); await page.waitForTimeout(1200);
  const n = await page.evaluate(() => COURSE_LIVE.length);
  assert.equal(n, 35, 'course has 35 slides');
  if (w === 1600) assert.deepEqual(await page.evaluate(() => COURSE_LIVE.filter(c => c.day === 1).map(c => c.t)), DAY1, 'Day 1 follows the storyline');
  for (let i = 0; i < n; i++) {
    await page.evaluate(i => go(i), i); await page.waitForTimeout(450);
    const s = await page.evaluate(() => {
      const r = el => document.querySelector(el).getBoundingClientRect();
      return {title: document.querySelector('#jf-title').textContent, script: document.querySelectorAll('#jf-script p').length,
        shell: r('#shell').height, jeff: r('#jeff').bottom, visual: r('#visual').bottom, scrollX: document.documentElement.scrollWidth - innerWidth};
    });
    const label = `${w}px slide ${i} (${s.title})`;
    assert.equal(s.title, await page.evaluate(i => COURSE_LIVE[i].label, i), label + ': script pane follows the slide');
    assert.ok(s.script > 0, label + ': has a script');
    assert.ok(s.jeff <= h + 1 && s.visual <= h + 1 && s.shell <= h + 1, label + ': panes fit the window');
    assert.ok(s.scrollX <= 0, label + ': no sideways scroll');
  }
  assert.deepEqual(errors, [], `${w}px: no page errors`);
  await page.close();
}

// index, topic pane and the Return button
const page = await browser.newPage({viewport: {width: 1400, height: 860}});
await page.goto(url); await page.waitForTimeout(1200);
await page.evaluate(() => document.body.classList.add('v3-panel')); await page.click('#ls-tog'); assert.ok(await page.locator('#shell.ls-open').count(), 'index opens');
await page.click('#ls-list li.sl >> text=Eratosthenes'); await page.waitForTimeout(500);
assert.equal(await page.locator('#jf-title').innerText(), 'Eratosthenes');
if (!(await page.locator('#shell.rs-open').count())) await page.click('#rs-tog'); await page.waitForTimeout(300); await page.click('#rs-list button >> nth=0'); await page.waitForTimeout(300);
assert.equal(await page.locator('#topicview').isVisible(), true, 'topic page opens');
assert.match(await page.locator('#topicview iframe').getAttribute('src'), /^\/topics\/18-eratosthenes/);
await page.click('#tv-back'); assert.equal(await page.locator('#topicview').isVisible(), false, 'Return closes the topic page');
// Eratosthenes steps through eight screens on the arrow (six camera beats, guess, answer); seven presses stay on the slide
for (let i = 0; i < 7; i++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(150); }
assert.equal(await page.locator('#jf-title').innerText(), 'Eratosthenes', 'Eratosthenes steps stay on the slide');
await page.keyboard.press('ArrowRight'); await page.waitForTimeout(500);
assert.equal(await page.locator('#jf-title').innerText(), await page.evaluate(() => COURSE_LIVE[COURSE_LIVE.findIndex(c => c.t === 'Eratosthenes') + 1].label), 'arrow key advances');

// Scilly: four presses step through it, the fifth leaves it
await page.evaluate(() => go(COURSE_LIVE.findIndex(c => c.t === 'Scilly, 1707'))); await page.waitForTimeout(600);
for (let k = 0; k < 3; k++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(600); }
assert.equal(await page.evaluate(() => COURSE_LIVE[cur].t), 'Scilly, 1707', 'Scilly holds for three steps');
assert.match(await page.locator('.sc-card').innerText(), /longitude/i, 'the lesson is the last screen');
await page.keyboard.press('ArrowRight'); await page.waitForTimeout(500);
assert.equal(await page.evaluate(() => COURSE_LIVE[cur].t), 'Mental maps', 'fifth press moves on to the quiz');

// Harrison: one line per press, ending on the twist
await page.evaluate(() => go(COURSE_LIVE.findIndex(c => c.t === 'A clock that could travel'))); await page.waitForTimeout(600);
for (let k = 0; k < 8; k++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(150); }
assert.match(await page.locator('#hv').textContent(), /carpenter beat Newton/, 'Harrison lands on the twist');

// the controls list opens by itself on slides that have controls (Jeff kept losing them)
for (const [t, min] of [['Latitude &amp; Longitude', 4], ['Walk north', 5]]) {
  await page.evaluate(t => go(COURSE_LIVE.findIndex(c => c.t === t)), t); await page.waitForTimeout(500);
  assert.equal(await page.evaluate(() => document.body.classList.contains('v3-keys-on')), true, `controls open on ${t}`);
  assert.ok(await page.locator('#v3-keys span').count() >= min, `controls listed on ${t}`);
  assert.equal(await page.locator('#v3-keys').isVisible(), true, `controls visible on ${t}`);
}
// every new slide's buttons run without errors
const errs = []; page.on('pageerror', e => errs.push(String(e)));
for (const [t, ids] of NEW) { await page.evaluate(t => go(COURSE_LIVE.findIndex(c => c.t === t)), t); await page.waitForTimeout(500); for (const id of ids) { await page.evaluate(id => document.querySelector(id).click(), id); await page.waitForTimeout(250); } }
await page.waitForTimeout(2500);
assert.match(await page.locator('#gps-r').innerText(), /38\.9° N/, 'GPS finds you');
assert.deepEqual(errs, [], 'new slides: no page errors');

// the 30-minute talk
await page.goto(url + '?talk=30#0'); await page.waitForTimeout(1200);
assert.equal(await page.evaluate(() => COURSE_LIVE.length), 14, '30-minute talk has 14 slides');
assert.equal(await page.evaluate(() => COURSE_LIVE.at(-1).t), 'Where am I, now', '30-minute talk ends on GPS');

// phone: everything stacks, nothing scrolls sideways
await page.setViewportSize({width: 390, height: 844}); await page.waitForTimeout(400);
assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'phone: no sideways scroll');

await browser.close();
console.log('claude1 v3 browser checks passed');
