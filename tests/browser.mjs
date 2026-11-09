const {chromium} = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({viewport:{width:1280,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const base=process.argv[2]||'http://localhost:8768';
await page.goto(base+'/galileo/');await page.locator('#state').filter({hasText:'peak catches sunlight'}).waitFor();
async function slider(id,value){await page.locator('#'+id).fill(String(value));await page.locator('#'+id).dispatchEvent('input');}
await slider('height',2);assert.match(await page.locator('#state').innerText(),/too low/);
await slider('sun',6);assert.match(await page.locator('#state').innerText(),/ground and peak/);
await page.locator('#example').click();await slider('position',-120);assert.match(await page.locator('#state').innerText(),/too low/);
await page.locator('#example').click();await page.locator('.handle').scrollIntoViewIfNeeded();const handle=await page.locator('.handle').boundingBox();await page.mouse.move(handle.x+handle.width/2,handle.y+handle.height/2);await page.mouse.down();await page.mouse.move(handle.x+handle.width/2+45,handle.y+handle.height/2-15,{steps:5});await page.mouse.up();assert.notEqual(await page.locator('#position').inputValue(),'-92.8');assert.notEqual(await page.locator('#height').inputValue(),'4');
await page.locator('#example').click();await page.locator('#height').focus();await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('#height').inputValue(),'3.9');await page.locator('#example').click();
assert.match(await page.locator('#whole-moon').textContent(),/Diameter · 2,160 mi/);
assert.match(await page.locator('#whole-moon').textContent(),/Circumference · 6,786 mi Around/);
assert.match(await page.locator('#right-triangle').textContent(),/Q · 90°/);
assert.match(await page.locator('#geometry-equation').innerText(),/1,080.0².*93.0².*4.0 miles/);
await page.locator('#show-distances').uncheck();assert.equal(await page.locator('#whole-moon').getByText('Diameter · 2,160 mi',{exact:true}).count(),0);await page.locator('#show-distances').check();
await page.locator('#show-lines').uncheck();assert.equal(await page.locator('#right-triangle .right-angle').count(),0);await page.locator('#show-lines').check();
await page.locator('#show-angle').uncheck();assert.equal(await page.locator('#whole-moon .angle-area').count(),0);await page.locator('#show-angle').check();
await slider('height',2);assert.match(await page.locator('#geometry-equation').innerText(),/2.0 miles/);await page.locator('#example').click();
await page.locator('#moon-images').scrollIntoViewIfNeeded();
for (const img of await page.locator('#moon-images .moon-image-grid img').all()) {
  await img.evaluate(el => el.decode());
  assert.ok(await img.evaluate(el => el.naturalWidth >= 400));
}
assert.match(await page.locator('#moon-images').innerText(), /Astrobond/);
await page.locator('#moon-images details summary').click();
await page.locator('#moon-images details img').evaluate(el => el.decode());
await page.locator('#moon-images details summary').click();
await page.locator('#moon-images').screenshot({path:'/tmp/faria-gallery-desktop.png'});
await page.screenshot({path:'/tmp/faria-galileo-desktop.png',fullPage:true});
await page.locator('#theme-btn').click();await page.screenshot({path:'/tmp/faria-galileo-dark.png',fullPage:true});
await page.locator('#theme-btn').click();
for(const width of [390,320]){await page.setViewportSize({width,height:900});await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.locator('#moon-images').screenshot({path:`/tmp/faria-gallery-${width}.png`});await page.screenshot({path:`/tmp/faria-galileo-mobile-${width}.png`,fullPage:true});}
await page.locator('#reading-size').fill('150');await page.locator('#reading-size').dispatchEvent('input');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
await page.goto(base+'/topics/86-galileo-moon-mountains/');assert.equal(await page.locator('a[href="/galileo/"]').count(),1);
await page.goto(base+'/');assert.ok(await page.locator('a[href="./topics/86-galileo-moon-mountains/"]').count());
assert.deepEqual(errors,[]);console.log('PASS: sliders, threshold states, peak drag, keyboard, reset, themes, 320/390px layouts, enlarged text, lesson/home links, no JavaScript errors');await browser.close();
