// Layout and chrome checks for /deck/v2/. The model behavior is the /deck/ suite pointed at this file.
// Usage: PLAYWRIGHT_MODULE=<path> node tests/deck-v2-browser.mjs [file:///path/to/deck/v2/index.html]
import {createRequire} from 'node:module';
const {chromium} = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
import assert from 'node:assert/strict';
import path from 'node:path';
const url = process.argv[2] || 'file://' + path.resolve('public/deck/v2/index.html');
const browser = await chromium.launch({headless: true});
const page = await browser.newPage({viewport: {width: 1280, height: 800}});
const errors = []; page.on('pageerror', e => errors.push(String(e)));
const slide = async n => { await page.goto(url + '#' + n); await page.locator('#counter').waitFor(); await page.waitForTimeout(700); };

await slide(0);
assert.match(await page.locator('.cover h1').innerText(), /Where Am I/);
assert.equal(await page.locator('.stories button').count(), 6);
assert.equal(await page.locator('.vlink a').getAttribute('href'), '../');
await page.keyboard.press('?');
assert.equal(await page.locator('#help').isVisible(), true);
await page.keyboard.press('Escape');
assert.equal(await page.locator('#help').isVisible(), false);

await page.locator('.stories button', {hasText: 'Triangles'}).click();
await page.waitForTimeout(600);
assert.match(await page.locator('#counter').innerText(), /5 \/ 17 · Eratosthenes/);
assert.match(await page.locator('#chapter-label').innerText(), /triangles/i);
const stage = await page.locator('.slide.active .stage canvas').boundingBox();
assert.ok(stage && stage.height > 240, 'stage should stay the hero at 1280×800, got ' + JSON.stringify(stage));
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);

await page.keyboard.press('o');
await page.locator('#overview').waitFor({state: 'visible'});
assert.equal(await page.locator('#ov-body .ov-grid button').count(), 18);
await page.keyboard.press('Escape');
assert.equal(await page.locator('#overview').isHidden(), true);

await page.keyboard.press('End');
await page.waitForTimeout(400);
assert.match(await page.locator('#counter').innerText(), /17 \/ 17 · The shelter decision/);
await page.keyboard.press('Home');
await page.waitForTimeout(300);
assert.match(await page.locator('.cover h1').innerText(), /Where Am I/);

await page.setViewportSize({width: 1920, height: 1080});
await slide(4);
assert.match(await page.locator('#hs-title').innerText(), /24-hour clock/);
await page.click('#hs-degree');
await page.waitForTimeout(200);
assert.ok(await page.locator('#hs-table tr.on').count() >= 1);
const wide = await page.locator('.slide.active .stage canvas').boundingBox();
assert.ok(wide && wide.width > 1400 && wide.height > 400, JSON.stringify(wide));
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);

await slide(16);
await page.click('#wd-200');
assert.match(await page.locator('#wd-read .big').innerText(), /force ×4\.00 · power ×8\.00/);
await page.click('#wd-curve');
await page.waitForTimeout(200);

await page.setViewportSize({width: 390, height: 844});
await slide(2);
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
const phone = await page.locator('.slide.active .stage canvas').boundingBox();
assert.ok(phone && phone.width > 300 && phone.height > 160, JSON.stringify(phone));
assert.equal(await page.locator('.slide.active').evaluate(el => getComputedStyle(el).display), 'grid');

await page.emulateMedia({reducedMotion: 'reduce'});
await page.setViewportSize({width: 1280, height: 800});
await slide(1);
const t0 = Date.now();
await page.keyboard.press('ArrowRight');
await page.locator('#counter', {hasText: 'Mental maps'}).waitFor();
assert.ok(Date.now() - t0 < 1200, 'reduced motion should not wait on a wipe');
assert.equal(await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches), true);

assert.deepEqual(errors, []);
await browser.close();
console.log('deck v2 ok');
