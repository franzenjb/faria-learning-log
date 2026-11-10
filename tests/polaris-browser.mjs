import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const base=process.argv[2]||'http://127.0.0.1:8769';
const page=await browser.newPage({viewport:{width:1280,height:1000}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.goto(base+'/polaris/');await page.locator('#earth-angle').filter({hasText:'0°'}).waitFor();await page.screenshot({path:'/tmp/polaris-equator.png',fullPage:true});
for(const lat of [0,39,40.7,90]){await page.locator('#latitude').fill(String(lat));await page.locator('#latitude').dispatchEvent('input');const m=await page.evaluate(()=>window.latitudeWalkState);assert.ok(Math.abs(m.altitude-lat)<1e-8);assert.equal(await page.locator('#earth-angle').innerText(),await page.locator('#sky-angle').innerText());}
await page.screenshot({path:'/tmp/polaris-pole.png',fullPage:true});await page.getByRole('button',{name:'39° N',exact:true}).click();await page.locator('#show-geometry').check();assert.match(await page.locator('#sky-drawing').textContent(),/51° from straight up/);
await page.screenshot({path:'/tmp/polaris-desktop.png',fullPage:true});
await page.getByRole('button',{name:'Equator',exact:true}).click();await page.locator('#latitude').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#latitude').inputValue(),'0.1');
await page.locator('#play').click();await page.waitForTimeout(350);assert.ok(Number(await page.locator('#latitude').inputValue())>0);await page.locator('#play').click();const stopped=await page.locator('#latitude').inputValue();await page.waitForTimeout(150);assert.equal(await page.locator('#latitude').inputValue(),stopped);
for(const width of [320,390,768]){await page.setViewportSize({width,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'horizontal overflow at '+width);}
await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'39° N',exact:true}).click();await page.screenshot({path:'/tmp/polaris-mobile.png',fullPage:true});
for(const path of ['/deck/#3','/deck/v2/#3']){await page.goto(base+path);assert.equal(await page.getByRole('link',{name:/Walk north: why both angles match/}).getAttribute('href'),'/polaris/');}
assert.deepEqual(errors,[]);console.log('PASS: slider, presets, right-angle toggle, keyboard, animation/pause, 320/390/768px layouts, deck links and no browser errors.');await browser.close();
