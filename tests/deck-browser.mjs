// Headless smoke test for /deck/: every slide renders without errors and each model responds to its controls.
// Usage: node build.mjs && node tests/deck-browser.mjs [file:///path/to/dist/deck/index.html]
import {createRequire} from 'node:module';
const {chromium} = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
import assert from 'node:assert/strict';
import path from 'node:path';
const url = process.argv[2] || 'file://' + path.resolve('dist/deck/index.html');
const browser = await chromium.launch({headless: true});
const page = await browser.newPage({viewport: {width: 1400, height: 900}});
const errors = []; page.on('pageerror', e => errors.push(e.message));
const slide = async n => { await page.goto(url + '#' + n); await page.waitForTimeout(300); };
await slide(1);
await page.click('#m1 button[data-mode=lon]'); await page.click('#find-noon');
assert.match(await page.locator('#lon-read strong').innerText(), /Local noon/);
assert.match(await page.locator('#lon-read .big').innerText(), /70\.\d° W/);
await slide(2);
assert.match(await page.locator('#era-read .big').innerText(), /250,000 stadia/);
const c = await page.locator('#c2').boundingBox();
await page.mouse.move(c.x + c.width * .3, c.y + c.height * .25); await page.mouse.down();
await page.mouse.move(c.x + c.width * .15, c.y + c.height * .4, {steps: 6}); await page.mouse.up();
assert.notEqual(await page.locator('#era-ang-out').innerText(), '7.2°');
await slide(3);
await page.click('#jup-sketch'); await page.click('#jup-play'); await page.waitForTimeout(1500); await page.click('#jup-sketch');
assert.equal(await page.locator('#nb-rows .row').count(), 2);
await slide(4);
assert.match(await page.locator('#mtn-read .big').innerText(), /5\.0 miles/);
await page.click('#mtn-modern'); assert.match(await page.locator('#mtn-read .big').innerText(), /5\.4 miles/);
assert.deepEqual(errors, []);
await browser.close(); console.log('deck ok');
