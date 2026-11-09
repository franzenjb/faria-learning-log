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
const slide = async n => { await page.goto(url + '#' + n); await page.waitForTimeout(1900); }; // let the entrance transition finish
await slide(0);
await page.click('.menu li[data-go="Eratosthenes"]'); await page.waitForTimeout(1600);
assert.match(await page.locator('#counter').innerText(), /Eratosthenes/);
await slide(1);
await page.click('#qz-opts .opt[data-k="2"]'); await page.click('#qz-opts .opt[data-k="2"]');
assert.equal(await page.locator('#qz-opts .opt[data-k="2"] .count').innerText(), '2');
await page.click('#qz-reveal'); await page.waitForTimeout(400);
assert.match(await page.locator('#qz-read strong').innerText(), /None/);
assert.equal(await page.locator('#qz-opts .opt.ok').count(), 1);
await page.click('#m1q button[data-q="1"]'); await page.click('#qz-reveal'); await page.waitForTimeout(300);
assert.match(await page.locator('#qz-read strong').innerText(), /Reno/);
await slide(2);
await page.click('#fly-nm'); await page.waitForTimeout(300);
assert.match(await page.locator('#g-card h3').innerText(), /nautical mile/);
await page.click('#g-card .x');
const g = await page.locator('#c1').boundingBox();
await page.mouse.click(g.x + g.width * .5, g.y + g.height * .45);
assert.match(await page.locator('#globe-read strong').innerText(), /You are at/);
await page.click('#fly-crux'); await page.waitForTimeout(200);
assert.match(await page.locator('#globe-read strong').innerText(), /Southern Cross/);
await page.click('#m1 button[data-mode=lon]'); await page.click('#find-noon');
assert.match(await page.locator('#lon-read strong').innerText(), /Local noon/);
assert.match(await page.locator('#lon-read .big').innerText(), /−70\.\d° · West/);
await slide(3);
assert.match(await page.locator('#era-read .big').innerText(), /250,000 stadia/);
const c = await page.locator('#c2').boundingBox();
await page.mouse.move(c.x + c.width * .5 - c.height * .098, c.y + c.height * .18); await page.mouse.down(); // Alexandria
await page.mouse.move(c.x + c.width * .5 - c.height * .3, c.y + c.height * .26, {steps: 6}); await page.mouse.up();
assert.notEqual(await page.locator('#era-ang-out').innerText(), '7.2°');
await slide(4);
await page.click('#jup-sketch'); await page.click('#jup-play'); await page.waitForTimeout(1500); await page.click('#jup-sketch');
assert.equal(await page.locator('#nb-rows .row').count(), 2);
await slide(5);
assert.match(await page.locator('#mtn-read .big').innerText(), /5\.0 miles/);
await page.click('#mtn-modern'); assert.match(await page.locator('#mtn-read .big').innerText(), /5\.4 miles/);
await page.click('#mtn-side'); await page.waitForTimeout(1300);
assert.equal(await page.locator('#moon-toggles button.on').count(), 4);
const m = await page.locator('#c4').boundingBox();
await page.mouse.click(m.x + m.width * .5, m.y + m.height * .52); // the centre lies on R, R+h and the diameter: a tap toggles the nearest one
assert.notEqual(await page.locator('#moon-toggles button.on').count(), 4);
await slide(6);
assert.match(await page.locator('#kp-title').innerText(), /scale bar/);
await page.click('#m7 button[data-mode=halley]'); await page.waitForTimeout(300);
assert.match(await page.locator('#kp-title').innerText(), /Halley/);
await slide(7);
assert.match(await page.locator('#tv-read .big').innerText(), /they differ by/);
assert.match(await page.locator('#tv-read').innerText(), /9\d million miles/);
await page.click('#tv-contact'); await page.click('#tv-play'); await page.waitForTimeout(800);
const tv = await page.locator('#c5').boundingBox();
await page.mouse.click(tv.x + tv.width * .26, tv.y + tv.height * .5); // post observer A on the globe
assert.match(await page.locator('#tv-pairs button.on').count().then(String), /0/);
await page.click('#m5 button[data-mode=rare]');
assert.match(await page.locator('#tv-rare-read .big').innerText(), /TRANSIT/); // 1769
await page.click('#tv-next'); await page.waitForTimeout(2100);
assert.match(await page.locator('#tv-year-out').innerText(), /^1874/);
await page.click('#tv-tilt'); assert.match(await page.locator('#tv-rare-read strong').innerText(), /no tilt/);
await slide(8);
assert.match(await page.locator('#md-title').innerText(), /Two men/);
const md = await page.locator('#c6').boundingBox();
for (let i = 0; i < 4; i++) { await page.click('#md-next'); await page.waitForTimeout(400); }
assert.match(await page.locator('#md-title').innerText(), /The line/);
await page.waitForTimeout(1600); // camera flight
await page.click('#md-next'); await page.waitForTimeout(2000);
assert.match(await page.locator('#md-title').innerText(), /stones/);
await page.click('#md-chapters button[data-ch="2"]'); await page.click('#md-transit'); await page.waitForTimeout(1600);
assert.match(await page.locator('#tv-read').innerText(), /Cape Town/);
assert.ok(typeof await page.evaluate(() => COAST.lines.length) === 'number');
assert.deepEqual(errors, []);
await browser.close(); console.log('deck ok');
