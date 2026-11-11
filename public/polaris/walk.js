import {geometry} from './model.js';
const $=id=>document.getElementById(id);
const gold='#edc17e',blue='#86c5ec',muted='#a7b4c5',ink='#eeeae0';
const num=n=>String(Math.round(n));
const text=(s,x,y,size=15,color=muted,anchor='start')=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" text-anchor="${anchor}" font-family="system-ui,sans-serif">${s}</text>`;
const line=(x,y,x2,y2,color=muted,w=2,extra='')=>`<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${w}" ${extra}/>`;
const circle=(x,y,r,color)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`;
function arc(x,y,r,start,end,sweep,color=gold,width=3){if(Math.abs(end-start)<1e-8)return '';return `<path d="M${x+r*Math.cos(start)} ${y+r*Math.sin(start)} A${r} ${r} 0 0 ${sweep} ${x+r*Math.cos(end)} ${y+r*Math.sin(end)}" fill="none" stroke="${color}" stroke-width="${width}"/>`;}
let playing=false,raf=null,last=0,walkLatitude=0;
function stop(){playing=false;last=0;cancelAnimationFrame(raf);$('play').textContent='Walk north ▶';$('play').setAttribute('aria-pressed','false');}
const lat=n=>Math.round(n)===0?'0°':`${num(n)}° N`;
// One scene: a large globe, plus a close-up inset of the observer with the horizon held level.
function layout(){const narrow=$('scene').clientWidth<640;return narrow?{W:820,H:1560,cx:350,cy:510,R:300,ix:30,iy:960,iw:760,k:1.9}:{W:1300,H:910,cx:330,cy:530,R:320,ix:840,iy:250,iw:440,k:1.25};}
function earth(m,details,L){const {cx,cy,R,k}=L,g=R/160,a=m.latitude*Math.PI/180,u=m.up,n=m.north,p={x:cx+R*u.x,y:cy+R*u.y},eye={x:p.x+36*g*u.x,y:p.y+36*g*u.y},T=(t,x,y,sz,c,an)=>text(t,x,y,sz*k,c,an);
let s=`<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#ocean)" stroke="#59758c" stroke-width="1.5"/>`;
s+=line(cx,cy-R-30,cx,cy+R+30,'#536b83',1.5,'stroke-dasharray="5 7"')+T('Axis',cx-10,cy+R+44,14,muted,'end');
s+=line(cx-R-18,cy,cx+R+18,cy,'#536b83',1.5)+T('Equator',cx-R-14,cy-12,16,ink,'start');
s+=line(cx,cy,p.x,p.y,gold,3)+arc(cx,cy,66*g,0,-a,0)+T(lat(m.latitude),cx+100*g*Math.cos(a/2),cy-100*g*Math.sin(a/2)+8,21,gold,'middle');
s+=circle(cx,cy,5,muted);
s+=line(eye.x-n.x*60*g,eye.y-n.y*60*g,eye.x+n.x*120*g,eye.y+n.y*120*g,blue,3)+T('Horizon',eye.x+n.x*128*g+n.x*12-u.x*22,eye.y+n.y*128*g+n.y*12-u.y*22+6,16,blue,n.x<-.5?'middle':'start');
s+=line(eye.x,eye.y,eye.x,52,gold,2,'stroke-dasharray="5 5" marker-end="url(#gold-arrow)"')+T('✦',eye.x,40,27,gold,'middle');
s+=arc(eye.x,eye.y,62,-Math.PI/2-a,-Math.PI/2,1,gold,3);if(m.latitude>=20)s+=T(`${num(m.altitude)}°`,eye.x+92*Math.cos(-Math.PI/2-a/2),eye.y+92*Math.sin(-Math.PI/2-a/2)+7,19,gold,'middle');
const f=g;s+=line(p.x+n.x*10*f,p.y+n.y*10*f,p.x+u.x*14*f,p.y+u.y*14*f,ink,3)+line(p.x-n.x*10*f,p.y-n.y*10*f,p.x+u.x*14*f,p.y+u.y*14*f,ink,3)+line(p.x+u.x*14*f,p.y+u.y*14*f,p.x+u.x*30*f,p.y+u.y*30*f,ink,3)+circle(eye.x,eye.y,8,ink);
if(details){s+=line(eye.x,eye.y,eye.x+u.x*76*g,eye.y+u.y*76*g,blue,1.5,'stroke-dasharray="4 5"')+T('Straight up',eye.x+u.x*83*g+7,eye.y+u.y*83*g,12,blue);const q=13*g;s+=`<path d="M${eye.x+n.x*q} ${eye.y+n.y*q} l${u.x*q} ${u.y*q} l${-n.x*q} ${-n.y*q}" fill="none" stroke="${blue}" stroke-width="1.5"/>`;}
$('earth-drawing').innerHTML=s;return eye;}
function sky(m,details,L,eye){const {ix,iy,iw,k}=L,h=iw*.62,gnd=iw*.14,ox=ix+iw*.82,oy=iy+h,r=iw*.56,a=m.altitude*Math.PI/180,sx=ox-r*Math.cos(a),sy=oy-r*Math.sin(a),T=(t,x,y,sz,c,an)=>text(t,x,y,sz*k,c,an),z=iw/580;
// Magnifier on the observer and callout lines to the close-up.
const mr=46*L.R/160*.6,corners=L.ix>L.cx?[[ix,iy],[ix,oy+gnd]]:[[ix,iy],[ix+iw,iy]];
let s=`<circle cx="${eye.x}" cy="${eye.y}" r="${mr}" fill="none" stroke="${ink}" stroke-width="1.5" opacity=".7"/>`;
for(const [x,y] of corners){const d=Math.hypot(x-eye.x,y-eye.y);s+=line(eye.x+(x-eye.x)/d*mr,eye.y+(y-eye.y)/d*mr,x,y,ink,1,'opacity=".35"');}
s+=T('Close-up · horizon held level',ix,iy-14,13,muted,'start');
s+=`<rect x="${ix}" y="${iy}" width="${iw}" height="${h}" fill="url(#sky-gradient)"/><rect x="${ix}" y="${oy}" width="${iw}" height="${gnd}" fill="#15232d"/><rect x="${ix}" y="${iy}" width="${iw}" height="${h+gnd}" fill="none" stroke="${ink}" stroke-opacity=".7" stroke-width="1.5"/>`;
s+=line(ix+10,oy,ix+iw-10,oy,blue,3)+T('Horizon',ix+16,oy+30*z*1.2,17,blue,'start');
s+=line(ox,oy,ox,iy+12,'#536b83',1.5,'stroke-dasharray="4 6"')+T('Overhead',ox-8,iy+28,14,muted,'end');
s+=line(ox,oy,sx,sy,gold,3)+text('✦',sx,sy+9,32*k,gold,'middle');
const lx=m.altitude<25?sx+8:sx-22,ly=m.altitude<25?sy-26:m.altitude>70?sy+30:sy+6;s+=T('Polaris',lx,ly,18,gold,m.altitude<25?'start':'end');
s+=arc(ox,oy,70*z,Math.PI,Math.PI+a,1)+T(`${num(m.altitude)}°`,ox-110*z*Math.cos(a/2),oy-110*z*Math.sin(a/2)-6,22,gold,'middle');
const b=z*1.1;s+=circle(ox,oy,7,ink)+line(ox,oy+10*b,ox,oy+44*b,ink,4)+line(ox,oy+44*b,ox-12*b,oy+64*b,ink,4)+line(ox,oy+44*b,ox+12*b,oy+64*b,ink,4)+line(ox-16*b,oy+24*b,ox+16*b,oy+24*b,ink,4);
if(details){s+=`<path d="M${ox-17} ${oy}v-17h17" fill="none" stroke="${blue}" stroke-width="1.5"/>`;s+=T(`${num(m.zenithDistance)}° from straight up`,ox-20,iy+70,15,blue,'end');}
$('sky-drawing').innerHTML=s;}
function scene(m,details){const L=layout(),svg=$('scene');svg.setAttribute('viewBox',`0 0 ${L.W} ${L.H}`);sky(m,details,L,earth(m,details,L));}
function turnProof(m){const turn=+$('reference-turn').value,t=turn*Math.PI/180,a=m.latitude*Math.PI/180,cx=325,cy=270,R=155;
const ray=(angle,label,color)=>{const x=cx+R*Math.cos(angle),y=cy-R*Math.sin(angle);return line(cx,cy,x,y,color,3)+text(label,x+(Math.cos(angle)<-.1?-12:12),y-12,15,color,Math.cos(angle)<-.1?'end':'start');};
const first=turn===0?'Equatorial direction':turn===90?'Polar direction':'Equatorial direction, turning';const second=turn===0?'Your straight up':turn===90?'Northern horizon':'Your straight up, turning';
$('turn-svg').innerHTML=ray(t,first,blue)+ray(t+a,second,gold)+arc(cx,cy,63,-t,-t-a,0,gold,3)+circle(cx,cy,4,ink)+text(`${num(m.latitude)}°`,cx+94*Math.cos(t+a/2),cy-94*Math.sin(t+a/2),23,gold,'middle')+text('Both rotate together. Neither changes its separation from the other.',325,440,13,muted,'middle');
$('turn-output').textContent=`${turn}°`;$('turn-description').textContent=`Both directions have turned ${turn}°. Their separation is still ${num(m.latitude)}°. ${turn===90?'The pair now represents the polar direction and your northern horizon.':turn===0?'The pair starts as the equatorial direction and your local straight up.':'Continue to 90° to reach the polar direction and your northern horizon.'}`;$('quarter-turn').textContent=turn===90?'Return to the starting directions':'Turn both by 90°';}
function render(){const m=geometry($('latitude').value);$('mobile-latitude').value=m.latitude;turnProof(m);const n=num(m.latitude);$('sync-label').textContent=`${lat(m.latitude)} = ${num(m.altitude)}° above the horizon`;$('earth-angle').textContent=lat(m.centralAngle);$('sky-angle').textContent=`${num(m.altitude)}°`;
$('mobile-latitude').setAttribute('aria-valuetext',`${n} degrees north; pole altitude ${num(m.altitude)} degrees`);$('latitude').setAttribute('aria-valuetext',`${n} degrees north; pole altitude ${num(m.altitude)} degrees`);document.querySelectorAll('[data-lat]').forEach(b=>b.setAttribute('aria-pressed',String(Math.abs(+b.dataset.lat-m.latitude)<.05)));scene(m,$('show-geometry').checked);window.latitudeWalkState=m;}
$('latitude').addEventListener('input',()=>{stop();render();});$('mobile-latitude').addEventListener('input',()=>{stop();$('latitude').value=$('mobile-latitude').value;render();});$('reference-turn').addEventListener('input',()=>turnProof(geometry($('latitude').value)));$('quarter-turn').addEventListener('click',()=>{$('reference-turn').value=+$('reference-turn').value===90?0:90;turnProof(geometry($('latitude').value));});$('show-geometry').addEventListener('change',render);document.querySelectorAll('[data-lat]').forEach(b=>b.addEventListener('click',()=>{stop();$('latitude').value=b.dataset.lat;render();}));
function tick(t){if(!playing)return;if(last)walkLatitude=Math.min(90,walkLatitude+(t-last)*.005);$('latitude').value=walkLatitude;last=t;render();if(+$('latitude').value>=90){stop();return;}raf=requestAnimationFrame(tick);}
$('play').addEventListener('click',()=>{if(playing){stop();return;}$('latitude').value=0;walkLatitude=0;playing=true;$('play').textContent='Pause walk ❚❚';$('play').setAttribute('aria-pressed','true');render();raf=requestAnimationFrame(tick);});addEventListener('resize',()=>render());document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});render();
