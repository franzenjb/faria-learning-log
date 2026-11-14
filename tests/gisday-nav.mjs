// WebKit iPad checks for the on-screen Back / Next / Slides controls and the Havana vote.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const loaded = process.env.PLAYWRIGHT_MODULE
  ? await import(process.env.PLAYWRIGHT_MODULE)
  : require('playwright-core');
const pw = loaded.webkit ? loaded : loaded.default;
const { webkit, devices } = pw;
import assert from 'node:assert/strict';

const base = (process.argv[2] || 'http://127.0.0.1:8791').replace(/\/$/, '');
const iPad = devices['iPad (gen 7)'];
const browser = await webkit.launch();
const context = await browser.newContext({ ...iPad, hasTouch: true });
const page = await context.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
await page.goto(base + '/gisday/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(500);
assert.deepEqual(errors, [], 'no page errors');
assert.equal(await page.locator('#nav-prev').innerText(), '‹ Back');
assert.equal(await page.locator('#nav-next').innerText(), 'Next ›');
assert.equal(await page.locator('#nav-menu').innerText(), '≡ Slides');
const phase1 = await page.evaluate(() => {
  const ctx = document.querySelector('canvas').getContext('2d');
  const px = ctx.getImageData(1400, 560, 1, 1).data;
  return { step: __deck.step, r: px[0], g: px[1], b: px[2] };
});
assert.equal(phase1.step, 0, 'loads on the question');
assert.ok(phase1.r > 250 && phase1.g > 248 && phase1.b > 240, 'no globe on the first frame');

await page.evaluate(() => __deck.go(4, 0));
await page.locator('#nav-prev').tap();
assert.equal(await page.evaluate(() => __deck.idx), 3, 'Back from slide 5 reaches slide 4');
for (let n = 0; n < 30; n++) {
  const at = await page.evaluate(() => __deck.idx);
  if (at === 0) break;
  await page.locator('#nav-prev').tap();
}
assert.equal(await page.evaluate(() => __deck.idx), 0, 'Back reaches slide 1');

await page.locator('#nav-menu').tap();
assert.equal(await page.locator('#menu[hidden]').count(), 0, 'Slides opens');
assert.match(await page.locator('#menu .home').innerText(), /Slide 1/);
await page.locator('#menu-list button.item:not(.home)').nth(6).tap();
assert.equal(await page.evaluate(() => __deck.idx), 6, 'menu jump');
assert.equal(await page.locator('#menu').isHidden(), true, 'jump closes the menu');
await page.locator('#nav-menu').tap();
await page.locator('#menu-close').tap();
assert.equal(await page.locator('#menu').isHidden(), true, '× closes the menu');
assert.deepEqual(errors, [], 'still no page errors');
await browser.close();
console.log('webkit iPad nav checks passed');
