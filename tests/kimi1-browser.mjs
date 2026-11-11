// Behavior and layout checks for /kimi1/ — the Measuring the Sky / Where Am I? lecture.
// Usage: PLAYWRIGHT_MODULE=<path> node tests/kimi1-browser.mjs [file:///path/to/kimi1/index.html]
import {createRequire} from 'node:module';
const {chromium} = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
import assert from 'node:assert/strict';
import path from 'node:path';
const url = process.argv[2] || 'file://' + path.resolve('public/kimi1/index.html');
const browser = await chromium.launch({headless: true, channel: 'chrome'});
const page = await browser.newPage({viewport: {width: 1280, height: 800}});
const errors = []; page.on('pageerror', e => errors.push(String(e)));
const slide = async n => { await page.goto(url + '#' + n); await page.locator('#counter').waitFor({state: 'attached'}); await page.waitForTimeout(700); };

await slide(0);
assert.match(await page.locator('.cover h1').innerText(), /Where Am I/);
assert.match(await page.locator('.vlink a').getAttribute('href'), /\/deck\/v2\//);

// Q4: Greenland vs Africa — voting, reveal, slide-down, wall-map split
await slide(3);
assert.match(await page.locator('#qz-title').innerText(), /Havana/);
assert.equal(await page.locator('#qz-merc').isHidden(), true);
await page.locator('#m1q button', {hasText: 'Greenland or Africa'}).click();
await page.waitForTimeout(300);
assert.match(await page.locator('#qz-title').innerText(), /How many Greenlands/);
await page.locator('#qz-opts .opt').nth(1).click();
assert.equal(await page.locator('#qz-merc').isHidden(), true, 'wall map stays hidden until reveal');
await page.click('#qz-reveal');
await page.waitForTimeout(300);
assert.equal(await page.locator('#qz-merc').isHidden(), false);
assert.match(await page.locator('#qz-read').innerText(), /Fourteen. Africa covers/);
// auto choreography: reveal opens on the wall map, then wraps back to the globe by itself
assert.match(await page.locator('#qz-merc').innerText(), /Back to the globe/);
await page.waitForTimeout(6800); // flat hold (5.8 s) + morph back
assert.match(await page.locator('#qz-merc').innerText(), /Compare the wall map/);
await page.click('#qz-merc');
await page.waitForTimeout(900);
assert.match(await page.locator('#qz-merc').innerText(), /Back to the globe/);
await page.click('#qz-merc');
await page.waitForTimeout(900);
assert.match(await page.locator('#qz-merc').innerText(), /Compare the wall map/);
// switching questions hides the wall-map button
await page.locator('#m1q button', {hasText: 'Havana'}).click();
await page.waitForTimeout(200);
assert.equal(await page.locator('#qz-merc').isHidden(), true);
// clear votes also hides it
await page.locator('#m1q button', {hasText: 'Greenland or Africa'}).click();
await page.click('#qz-reveal');
await page.waitForTimeout(300);
await page.click('#qz-reset');
assert.equal(await page.locator('#qz-merc').isHidden(), true);

// navigator still intact
await page.keyboard.press('o');
await page.locator('#deck-map').waitFor({state: 'visible'});
await page.keyboard.press('Escape');
await page.locator('#deck-map').waitFor({state: 'hidden'});

// reduced motion: reveal works, no errors
await page.emulateMedia({reducedMotion: 'reduce'});
await slide(3);
await page.locator('#m1q button', {hasText: 'Greenland or Africa'}).click();
await page.click('#qz-reveal');
await page.waitForTimeout(500);
assert.match(await page.locator('#qz-read').innerText(), /Fourteen/);

// phone layout: no horizontal overflow
await page.emulateMedia({reducedMotion: 'no-preference'});
await page.setViewportSize({width: 390, height: 844});
await slide(3);
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
await page.locator('#m1q button', {hasText: 'Greenland or Africa'}).click();
await page.click('#qz-reveal');
await page.waitForTimeout(300);
await page.click('#qz-merc');
await page.waitForTimeout(900);
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, 'no overflow with wall map open on phone');

assert.deepEqual(errors, []);
await browser.close();
console.log('kimi1 ok');
