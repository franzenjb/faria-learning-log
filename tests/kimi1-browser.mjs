// Behavior and layout checks for /kimi1/ — the four-day Red Cross GIS course.
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
const goTitle = async title => {
  const n = await page.evaluate(t => [...document.querySelectorAll('.slide')].findIndex(s => s.dataset.title.replace(/&amp;/g, '&') === t), title);
  assert.ok(n >= 0, 'missing slide ' + title);
  await slide(n);
  return n;
};

await slide(0);
assert.match(await page.locator('.cover h1').innerText(), /Where Am I/);
assert.match(await page.locator('.vlink a').getAttribute('href'), /\/deck\/v2\//);

const titles = await page.evaluate(() => [...document.querySelectorAll('.slide')].map(s => s.dataset.title.replace(/&amp;/g, '&')));
assert.equal(titles[1], 'Course index');
const ten = ['Latitude = star height','Longitude has no landmarks','The Isles of Scilly','The Longitude Act','Longitude is time','Lunar distances','A clock in the sky','Hours are slices','A pendulum cannot go to sea',"Harrison's job"];
let at = 0;
for (const t of titles) if (t === ten[at]) at++;
assert.equal(at, ten.length, 'longitude story out of order');
assert.ok(titles.indexOf('Longitude bingo') > titles.indexOf('Hours are slices'));
assert.ok(titles.indexOf('Eratosthenes') < titles.indexOf('Maps must bend'));
assert.ok(titles.indexOf('Maps must bend') < titles.indexOf('Latitude = star height'));
assert.ok(titles.indexOf('Transit of Venus') < titles.indexOf('Vector or raster'));
assert.ok(titles.indexOf('Vector or raster') < titles.indexOf("Jupiter's moons"));

const panes = await page.evaluate(() => {
  const j = document.getElementById('jeff').getBoundingClientRect();
  const v = document.getElementById('visual').getBoundingClientRect();
  return {jw: j.width, vw: v.width, jl: j.left, vl: v.left};
});
assert.ok(panes.jw > 200 && panes.vw > 400, 'both panes visible');
assert.ok(panes.jl < panes.vl, 'Jeff stays on the left');

await page.click('#left-open');
await page.locator('#left-rail').waitFor({state: 'visible'});
await page.locator('#chapter-list button', {hasText: 'Longitude'}).click();
await page.locator('#jeff-title', {hasText: 'Latitude is the easy one'}).waitFor();
await page.locator('#slide-index button', {hasText: 'The Isles of Scilly'}).click();
await page.locator('#jeff-title', {hasText: 'Scilly'}).waitFor();
await page.click('#left-close');
await page.locator('#left-rail').waitFor({state: 'hidden'});

await goTitle('Eratosthenes');
await page.click('#right-open');
await page.locator('#right-rail').waitFor({state: 'visible'});
const topic = page.locator('#topic-list a.topic-link').first();
assert.match(await topic.getAttribute('href'), /topics\/18-eratosthenes/);
await topic.click();
await page.locator('#topic-view').waitFor({state: 'visible'});
const src = await page.locator('#topic-frame').getAttribute('src');
assert.match(src, /topics\/18-eratosthenes/);
assert.doesNotMatch(src, /\.pdf/i);
const ret = await page.locator('#topic-return').boundingBox();
const view = await page.locator('#topic-view').boundingBox();
assert.ok(ret && view);
assert.ok(ret.x + ret.width > view.x + view.width - 30, 'return button stays in the top-right corner');
assert.ok(ret.y < view.y + 24);
await page.click('#topic-return');
await page.locator('#topic-view').waitFor({state: 'hidden'});
assert.match(await page.locator('#jeff-title').innerText(), /well|Earth|Eratosthenes/i);

const pdfEmbeds = await page.evaluate(() => [...document.querySelectorAll('iframe,embed,object')].map(el => el.getAttribute('src') || el.getAttribute('data') || '').filter(s => /\.pdf($|\?)/i.test(s)));
assert.deepEqual(pdfEmbeds, []);

// Q4: Greenland vs Africa — voting, reveal, slide-down, wall-map split
await goTitle('Mental maps');
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
assert.match(await page.locator('#qz-merc').innerText(), /Back to the globe/);
await page.waitForTimeout(6800);
assert.match(await page.locator('#qz-merc').innerText(), /Compare the wall map/);
await page.click('#qz-merc');
await page.waitForTimeout(900);
assert.match(await page.locator('#qz-merc').innerText(), /Back to the globe/);
await page.click('#qz-merc');
await page.waitForTimeout(900);
assert.match(await page.locator('#qz-merc').innerText(), /Compare the wall map/);
await page.locator('#m1q button', {hasText: 'Havana'}).click();
await page.waitForTimeout(200);
assert.equal(await page.locator('#qz-merc').isHidden(), true);
await page.locator('#m1q button', {hasText: 'Greenland or Africa'}).click();
await page.click('#qz-reveal');
await page.waitForTimeout(300);
await page.click('#qz-reset');
assert.equal(await page.locator('#qz-merc').isHidden(), true);

await page.keyboard.press('o');
await page.locator('#deck-map').waitFor({state: 'visible'});
await page.keyboard.press('Escape');
await page.locator('#deck-map').waitFor({state: 'hidden'});

await page.emulateMedia({reducedMotion: 'reduce'});
await goTitle('Mental maps');
await page.locator('#m1q button', {hasText: 'Greenland or Africa'}).click();
await page.click('#qz-reveal');
await page.waitForTimeout(500);
assert.match(await page.locator('#qz-read').innerText(), /Fourteen/);

await page.emulateMedia({reducedMotion: 'no-preference'});
await page.setViewportSize({width: 390, height: 844});
await goTitle('Mental maps');
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
await page.locator('#m1q button', {hasText: 'Greenland or Africa'}).click();
await page.click('#qz-reveal');
await page.waitForTimeout(300);
await page.click('#qz-merc');
await page.waitForTimeout(900);
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true, 'no overflow with wall map open on phone');

assert.deepEqual(errors, []);
await browser.close();
console.log('kimi1 ok', titles.length, 'slides');
