import {geometry} from './model.js';
const $=id=>document.getElementById(id);
const gold='#edc17e',blue='#86c5ec',muted='#a7b4c5',ink='#eeeae0';
const num=n=>Math.abs(n-Math.round(n))<1e-8?String(Math.round(n)):n.toFixed(1);
const text=(s,x,y,size=15,color=muted,anchor='start')=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" text-anchor="${anchor}" font-family="system-ui,sans-serif">${s}</text>`;
const line=(x,y,x2,y2,color=muted,w=2,extra='')=>`<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${w}" ${extra}/>`;
const circle=(x,y,r,color)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
function arc(x,y,r,start,end,sweep,color=gold,width=3){if(Math.abs(end-start)<1e-8)return '';return `<path d="M${x+r*Math.cos(start)} ${y+r*Math.sin(start)} A${r} ${r} 0 0 ${sweep} ${x+r*Math.cos(end)} ${y+r*Math.sin(end)}" fill="none" stroke="${color}" stroke-width="${width}"/>`;}
let playing=false,raf=null,last=0,walkLatitude=0;
function stop(){playing=false;last=0;cancelAnimationFrame(raf);$('play').textContent='Walk north ▶';$('play').setAttribute('aria-pressed','false');}
function earth(m,details){const cx=245,cy=325,R=160,a=m.latitude*Math.PI/180,u=m.up,n=m.north,p={x:cx+R*u.x,y:cy+R*u.y},eye={x:p.x+36*u.x,y:p.y+36*u.y};
let s=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#ocean)" stroke="#59758c" stroke-width="1.5"/>`;
s+=line(cx,125,cx,500,'#536b83',1.5,'stroke-dasharray="5 7"')+text('North polar axis',cx-12,112,13,blue,'end');
s+=line(cx-R-18,cy,cx+R+35,cy,'#536b83',1.5)+text('Equator',cx+R+8,cy+27,14,ink);
s+=line(cx,cy,p.x,p.y,gold,2.5)+arc(cx,cy,66,0,-a,0)+text(`${num(m.centralAngle)}°`,cx+86*Math.cos(a/2),cy-86*Math.sin(a/2)-8,21,gold,'middle');
s+=circle(cx,cy,4,muted)+text('Center',cx-12,cy+25,12,muted,'end');
s+=line(eye.x-n.x*60,eye.y-n.y*60,eye.x+n.x*132,eye.y+n.y*132,blue,2.5)+text('Level horizon',eye.x+n.x*140+12,eye.y+n.y*140+6,13,blue);
s+=line(eye.x,eye.y,eye.x,45,gold,2,'stroke-dasharray="5 5" marker-end="url(#gold-arrow)"')+text('✦',eye.x,31,27,gold,'middle')+text('Toward the pole',eye.x+20,54,13,gold);
s+=arc(eye.x,eye.y,48,-Math.PI/2-a,-Math.PI/2,1,gold,3);
// Feet, body and head follow local up, not the page.
s+=line(p.x+n.x*10,p.y+n.y*10,p.x+u.x*14,p.y+u.y*14,ink,3)+line(p.x-n.x*10,p.y-n.y*10,p.x+u.x*14,p.y+u.y*14,ink,3)+line(p.x+u.x*14,p.y+u.y*14,p.x+u.x*28,p.y+u.y*28,ink,3)+circle(eye.x,eye.y,7,ink);
if(details){s+=line(eye.x,eye.y,eye.x+u.x*76,eye.y+u.y*76,blue,1.5,'stroke-dasharray="4 5"')+text('Straight up',eye.x+u.x*83+7,eye.y+u.y*83,12,blue);const q=13;s+=`<path d="M${eye.x+n.x*q} ${eye.y+n.y*q} l${u.x*q} ${u.y*q} l${-n.x*q} ${-n.y*q}" fill="none" stroke="${blue}" stroke-width="1.5"/>`;s+=text('Horizon ⟂ local up',55,515,13,blue)+text('Polar axis ⟂ equator',350,515,13,blue);}
$('earth-drawing').innerHTML=s;}
function sky(m,details){const ox=145,oy=365,r=275,a=m.altitude*Math.PI/180,sx=ox+r*Math.cos(a),sy=oy-r*Math.sin(a);let s=`<rect x="35" y="35" width="580" height="330" rx="10" fill="url(#sky-gradient)"/><path d="M35 365H615V440H35Z" fill="#15232d"/>`;
s+=line(55,oy,600,oy,blue,2.5)+text('Northern horizon · 0°',585,oy+29,14,blue,'end');
s+=line(ox,oy,ox,55,'#536b83',1.5,'stroke-dasharray="4 6"')+text('Straight up · 90°',ox,40,14,blue,'middle');
s+=line(ox,oy,sx,sy,gold,2.5)+text('✦',sx,sy+8,28,gold,'middle');
const labelX=m.altitude<25?sx-8:sx+18,labelY=m.altitude<25?sy-24:sy+6;s+=text('Pole / ideal Polaris',labelX,labelY,15,gold,m.altitude<25?'end':'start');
s+=arc(ox,oy,65,0,-a,0)+text(`${num(m.altitude)}°`,ox+95*Math.cos(a/2),oy-95*Math.sin(a/2)-9,24,gold,'middle');
s+=circle(ox,oy,6,ink)+line(ox,oy+9,ox,oy+43,ink,4)+line(ox,oy+43,ox-12,oy+62,ink,4)+line(ox,oy+43,ox+12,oy+62,ink,4)+line(ox-16,oy+24,ox+16,oy+24,ink,4);
if(details){s+=`<path d="M${ox+17} ${oy}v-17h-17" fill="none" stroke="${blue}" stroke-width="1.5"/>`;s+=text(`${num(m.zenithDistance)}° from straight up`,310,105,15,blue);}
s+=text('The pole appears higher because your horizon has turned.',325,498,13,muted,'middle');$('sky-drawing').innerHTML=s;}
function turnProof(m){const turn=+$('reference-turn').value,t=turn*Math.PI/180,a=m.latitude*Math.PI/180,cx=325,cy=270,R=155;
const ray=(angle,label,color)=>{const x=cx+R*Math.cos(angle),y=cy-R*Math.sin(angle);return line(cx,cy,x,y,color,3)+text(label,x+(Math.cos(angle)<-.1?-12:12),y-12,15,color,Math.cos(angle)<-.1?'end':'start');};
const first=turn===0?'Equatorial direction':turn===90?'Polar direction':'Equatorial direction, turning';const second=turn===0?'Your straight up':turn===90?'Northern horizon':'Your straight up, turning';
$('turn-svg').innerHTML=ray(t,first,blue)+ray(t+a,second,gold)+arc(cx,cy,63,-t,-t-a,0,gold,3)+circle(cx,cy,4,ink)+text(`${num(m.latitude)}°`,cx+94*Math.cos(t+a/2),cy-94*Math.sin(t+a/2),23,gold,'middle')+text('Both rotate together. Neither changes its separation from the other.',325,440,13,muted,'middle');
$('turn-output').textContent=`${turn}°`;$('turn-description').textContent=`Both directions have turned ${turn}°. Their separation is still ${num(m.latitude)}°. ${turn===90?'The pair now represents the polar direction and your northern horizon.':turn===0?'The pair starts as the equatorial direction and your local straight up.':'Continue to 90° to reach the polar direction and your northern horizon.'}`;$('quarter-turn').textContent=turn===90?'Return to the starting directions':'Turn both by 90°';}
function render(){const m=geometry($('latitude').value);$('mobile-latitude').value=m.latitude;turnProof(m);const n=num(m.latitude),atEquator=m.latitude===0,atPole=m.latitude===90;$('sync-label').textContent=`${n}° N = ${num(m.altitude)}° above the horizon`;$('position').textContent=atEquator?'0° · Equator':atPole?'90° N · North Pole':`${n}° N`;$('earth-angle').textContent=`${num(m.centralAngle)}°`;$('sky-angle').textContent=`${num(m.altitude)}°`;$('equal-earth').textContent=`${num(m.centralAngle)}°`;$('equal-sky').textContent=`${num(m.altitude)}°`;
$('thought-title').textContent=atEquator?'At the equator, the pole is on your horizon':atPole?'At the North Pole, the pole is directly overhead':`At ${n}° N, the pole stands ${n}° above your horizon`;
$('thought').textContent=atEquator?'Your latitude is zero. The pole’s height above your northern horizon is also zero. Straight up is still 90° above your horizon.':atPole?'Your latitude is 90°. The pole is 90° above the horizon, directly overhead. It is now in your straight-up direction.':`The center angle is ${n}°. The angle you measure from your northern horizon is also ${num(m.altitude)}°. The pole is ${num(m.zenithDistance)}° away from straight up, which remains 90° above the horizon.`;
$('mobile-latitude').setAttribute('aria-valuetext',`${n} degrees north; pole altitude ${num(m.altitude)} degrees`);$('latitude').setAttribute('aria-valuetext',`${n} degrees north; pole altitude ${num(m.altitude)} degrees`);document.querySelectorAll('[data-lat]').forEach(b=>b.setAttribute('aria-pressed',String(Math.abs(+b.dataset.lat-m.latitude)<.05)));earth(m,$('show-geometry').checked);sky(m,$('show-geometry').checked);window.latitudeWalkState=m;}
$('latitude').addEventListener('input',()=>{stop();render();});$('mobile-latitude').addEventListener('input',()=>{stop();$('latitude').value=$('mobile-latitude').value;render();});$('reference-turn').addEventListener('input',()=>turnProof(geometry($('latitude').value)));$('quarter-turn').addEventListener('click',()=>{$('reference-turn').value=+$('reference-turn').value===90?0:90;turnProof(geometry($('latitude').value));});$('show-geometry').addEventListener('change',render);document.querySelectorAll('[data-lat]').forEach(b=>b.addEventListener('click',()=>{stop();$('latitude').value=b.dataset.lat;render();}));
function tick(t){if(!playing)return;if(last)walkLatitude=Math.min(90,walkLatitude+(t-last)*.005);$('latitude').value=walkLatitude;last=t;render();if(+$('latitude').value>=90){stop();return;}raf=requestAnimationFrame(tick);}
$('play').addEventListener('click',()=>{if(playing){stop();return;}$('latitude').value=0;walkLatitude=0;playing=true;$('play').textContent='Pause walk ❚❚';$('play').setAttribute('aria-pressed','true');render();raf=requestAnimationFrame(tick);});document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});render();
