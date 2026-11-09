import {R} from './model.js';
const $=id=>document.getElementById(id);
const number=(n,d=1)=>n.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
const text=(x,y,value,anchor='middle',cls='')=>`<text x="${x}" y="${y}" text-anchor="${anchor}" class="${cls}">${value}</text>`;
const line=(a,b,cls='geo-line')=>`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="${cls}"/>`;
export function drawGeometry(state,m){
 const moon=$('whole-moon'),tri=$('right-triangle'),w=moon.clientWidth,h=380;
 const showLines=$('show-lines').checked,showDistances=$('show-distances').checked,showAngle=$('show-angle').checked;
 const cx=w/2,cy=200,r=Math.min(125,(w-44)/2),scale=r/R;
 const point=(x,y)=>({x:cx+x*scale,y:cy-y*scale});
 const O=point(0,0),P=point(m.peak.x,m.peak.z+R);
 const normal={x:-Math.sin(m.elevation),y:Math.cos(m.elevation)};
 const T=point(R*normal.x,R*normal.y),Q=point(m.centerToRay*normal.x,m.centerToRay*normal.y);
 const B=point(m.base.x,m.base.z+R);
 const rayStart=point(-1600*Math.cos(m.elevation)+R*normal.x,-1600*Math.sin(m.elevation)+R*normal.y);
 const rayEnd=point(1600*Math.cos(m.elevation)+R*normal.x,1600*Math.sin(m.elevation)+R*normal.y);
 let diagram=`<title>The whole Moon: 2,160 miles across and about 6,786 miles around</title><circle class="moon-disk" cx="${cx}" cy="${cy}" r="${r}"/>
 <path class="moon-night" d="M${cx},${cy-r} A${r},${r} 0 0 0 ${cx},${cy+r} Z" transform="rotate(${-state.sun} ${cx} ${cy})"/>
 <circle class="circumference" cx="${cx}" cy="${cy}" r="${r}"/>
 ${line(rayStart,rayEnd,'sun-ray')}${text(w-12,24,'Sunlight ←','end')}`;
 if(showLines){
  diagram+=line({x:cx-r,y:cy},{x:cx+r,y:cy},'diameter')+line(O,P,'hypotenuse')+line(O,Q)+line(Q,P,'short-side');
  diagram+=line(B,P,'mountain-height');
  const t={x:Math.cos(m.elevation),y:-Math.sin(m.elevation)},n={x:normal.x,y:-normal.y};
  const size=9,sign=m.signedRayDistance<0?-1:1;
  const q1={x:Q.x+sign*t.x*size,y:Q.y+sign*t.y*size},q2={x:q1.x-n.x*size,y:q1.y-n.y*size},q3={x:Q.x-n.x*size,y:Q.y-n.y*size};
  diagram+=`<path d="M${q1.x},${q1.y} L${q2.x},${q2.y} L${q3.x},${q3.y}" class="right-angle"/>`;
 }
 if(showAngle){
  const theta=state.position/R, ar=r*.5, pts=[];
  for(let i=0;i<=24;i++){const a=-m.elevation+(theta+m.elevation)*i/24;pts.push(`${cx+ar*Math.sin(a)},${cy-ar*Math.cos(a)}`);}
  diagram+=`<path d="M${cx},${cy} L${pts.join(' L')} Z" class="angle-area"/>`;
  diagram+=text(cx,cy+57,`Calculated Angle ${number(m.angle)}°`);
 }
 diagram+=`<circle cx="${O.x}" cy="${O.y}" r="3" class="point"/><circle cx="${P.x}" cy="${P.y}" r="5" class="peak-point"/>`;
 diagram+=text(cx+10,cy-12,'O · Center','start');
 const leaderY=46;
 diagram+=`<path d="M${P.x},${P.y-7} L${P.x},${leaderY+5} L22,${leaderY+5}" class="leader"/>`+text(22,leaderY,'P · Mountain Peak','start');
 if(showDistances)diagram+=text(cx,cy+24,'Diameter · 2,160 mi')+text(cx,350,'Circumference · 6,786 mi Around');
 moon.setAttribute('viewBox',`0 0 ${w} ${h}`);moon.innerHTML=diagram;
 // A deliberately stretched triangle keeps all labels legible. Live numeric lengths
 // are always physical lengths; only the full circle shows the true center angle.
 const tw=tri.clientWidth,left=28,right=tw-100,top=98,bottom=275;
 const A={x:right,y:bottom},C={x:right,y:top},D={x:left,y:top};
 let triangle=`<title>Right triangle: horizontal gap ${number(m.rayDistance)} miles, center to ray ${number(m.centerToRay)} miles, center to peak ${number(R+state.height)} miles</title>`;
 if(showLines){triangle+=line(A,C)+line(C,D,'short-side')+line(D,A,'hypotenuse');triangle+=`<path class="right-angle" d="M${right-17},${top} v17 h17"/>`;}
 triangle+=`<circle cx="${D.x}" cy="${D.y}" r="5" class="peak-point"/><circle cx="${A.x}" cy="${A.y}" r="3" class="point"/>`;
 triangle+=text(left,top-18,'P · Peak','start')+text(right,bottom+24,'O · Center','end')+text(right,top-18,'Q · 90°','end');
 if(showDistances){triangle+=text((left+right)/2,35,`Gap · ${number(m.rayDistance)} mi`)+text(right+10,176,`${number(m.centerToRay)} mi`,'start')+text(right+10,196,'Center','start')+text(right+10,214,'To Ray','start')+text(left,234,`${number(R+state.height)} mi`,'start')+text(left,254,'Center To Peak','start');}
 triangle+=text(tw/2,335,Math.abs(m.centerToRay-R)<.01?'Q Is On The Moon’s Edge':m.centerToRay<R?'Q Is Inside The Moon':'Q Is Above The Moon’s Edge');
 tri.setAttribute('viewBox',`0 0 ${tw} ${h}`);tri.innerHTML=triangle;
 $('observed-gap').textContent=m.rayDistance<.05?'Gap: 0 miles at this setting.':`The straight-line gap is ${number(m.rayDistance)} miles — ${number(100*m.rayDistance/(2*R))}% of the Moon’s full width.`;
 const grazing=Math.abs(m.centerToRay-R)<.01&&!m.groundLit;
 $('geometry-heading').textContent=grazing?'The Peak Just Reaches The Skimming Sunbeam':m.groundLit?'Daylight Has Reached The Ground':m.peakLit?'The Peak Is Above The Skimming Sunbeam':'The Peak Is Below The Skimming Sunbeam';
 $('geometry-equation').textContent=`√(${number(m.centerToRay)}² + ${number(m.rayDistance)}²) − 1,080 = ${number(state.height)} miles high`;
 $('geometry-message').textContent=grazing?`1,080 miles from center to edge + ${number(state.height)} miles of mountain = ${number(R+state.height)} miles from center to peak. The square corner makes the calculation possible.`:`The triangle follows your peak. ${!m.peakLit?'The Moon blocks sunlight from reaching this peak. ':''}Use “Show The Four-Mile Example” to put Q on the edge, where the sunlight just skims the circle.`;
}
