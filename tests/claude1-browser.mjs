// Browser checks for /claude1/, the four-day GIS course deck.
// Usage: node build.mjs, serve dist/, then
//   PLAYWRIGHT_MODULE=<path to playwright index.mjs> node tests/claude1-browser.mjs [http://localhost:8791]
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const mod = process.env.PLAYWRIGHT_MODULE;
const {chromium} = mod ? await import(mod) : createRequire(import.meta.url)('playwright');
const base = (process.argv[2] || 'http://localhost:8791').replace(/\/$/, '');
const url = base + '/claude1/';
const browser = await chromium.launch({headless: true, channel: 'chrome'});

for (const [w, h] of [[1600, 900], [1280, 720]]) {
  const page = await browser.newPage({viewport: {width: w, height: h}});
  const errors = []; page.on('pageerror', e => errors.push(String(e)));
  await page.goto(url); await page.waitForTimeout(1200);
  const n = await page.evaluate(() => COURSE_LIVE.length);
  assert.equal(n, 42, 'course has 42 slides');
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
await page.click('#ls-tog'); assert.ok(await page.locator('#shell.ls-open').count(), 'index opens');
await page.click('#ls-list li.sl >> text=Eratosthenes'); await page.waitForTimeout(500);
assert.equal(await page.locator('#jf-title').innerText(), 'Eratosthenes');
await page.click('#rs-list button >> nth=0'); await page.waitForTimeout(300);
assert.equal(await page.locator('#topicview').isVisible(), true, 'topic page opens');
assert.match(await page.locator('#topicview iframe').getAttribute('src'), /^\/topics\/18-eratosthenes/);
await page.click('#tv-back'); assert.equal(await page.locator('#topicview').isVisible(), false, 'Return closes the topic page');
await page.keyboard.press('ArrowRight'); await page.waitForTimeout(500);
assert.equal(await page.locator('#jf-title').innerText(), 'A first look at projections', 'arrow key advances');

// phone: everything stacks, nothing scrolls sideways
await page.setViewportSize({width: 390, height: 844}); await page.waitForTimeout(400);
assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'phone: no sideways scroll');

await browser.close();
console.log('claude1 browser checks passed');
