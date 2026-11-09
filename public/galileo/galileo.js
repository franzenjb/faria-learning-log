import {R,defaults,calculate} from './model.js';
const $=id=>document.getElementById(id), scene=$('scene');
const controls=['position','height','sun'];
let state={...defaults}, geometry, drag=null;
const num=(n,d=1)=>n.toLocaleString('en-US',{maximumFractionDigits:d,minimumFractionDigits:d});
function render(){
  const m=calculate(state), w=scene.clientWidth, h=scene.clientHeight;
  const sx=(w-32)/340, sy=8, center=w/2, baseline=h*.48;
  const X=x=>center+x*sx,Y=z=>baseline-z*sy;
  geometry={sx,sy,center,baseline};
  scene.setAttribute('viewBox',`0 0 ${w} ${h}`);
  const tangent=x=>-Math.tan(m.elevation)*x+R/Math.cos(m.elevation)-R;
  let ground='';for(let i=0;i<=100;i++){const x=-170+i*3.4;ground+=`${i?'L':'M'}${X(x)},${Y(Math.sqrt(R*R-x*x)-R)} `;}
  const bx=X(m.base.x),by=Y(m.base.z),px=X(m.peak.x),py=Y(m.peak.z);
  const edgeX=X(-R*Math.sin(m.elevation)),edgeY=Y(R*Math.cos(m.elevation)-R);
  const mountainHalf=10;
  scene.innerHTML=`<title id="scene-title">${m.peakLit?'Sunlit':'Dark'} mountain peak, ${num(state.height)} miles high</title><desc id="scene-desc">Sunlight comes from the right. The curved surface below the light boundary is in darkness. Sliders move the mountain, adjust its height and change the Sun angle.</desc>
  <path class="shadow" d="M0,${Y(tangent(-center/sx))} L${edgeX},${edgeY} L${edgeX},${h} L0,${h} Z"/>
  <path class="ground" d="${ground} L${X(170)},${h} L${X(-170)},${h} Z"/>
  <path class="beam" d="M${X(-170)},${Y(tangent(-170))} L${X(170)},${Y(tangent(170))}"/>
  <text x="${w-16}" y="25" text-anchor="end">Sunlight From The Right</text>
  <path class="beam" d="M${w-24},40 h-62 m8,-4 l-8,4 l8,4"/>
  <path class="mountain" d="M${bx-mountainHalf},${by+2} L${px},${py} L${bx+mountainHalf},${by+2} Z"/>
  <line x1="${center}" y1="${baseline}" x2="${center}" y2="${baseline+18}" stroke="var(--muted)"/>
  <text x="${center}" y="${h-16}" text-anchor="middle">Center Marker · 0 Miles</text>
  <circle cx="${edgeX}" cy="${edgeY}" r="4" fill="var(--accent)"/>
  <line x1="${edgeX}" y1="${edgeY+6}" x2="${edgeX}" y2="${h-60}" stroke="var(--muted)" stroke-dasharray="3 3"/>
  <text x="${Math.min(w-80,Math.max(80,edgeX))}" y="${h-42}" text-anchor="middle">Daylight Edge</text>
  <g class="handle"><circle cx="${px}" cy="${py}" r="24" fill="transparent"/><circle class="peak ${m.peakLit?'lit':''}" cx="${px}" cy="${py}" r="7"/></g>
  <text x="${Math.max(58,Math.min(w-58,px))}" y="${Math.max(60,py-17)}" text-anchor="middle">${num(state.height)} mi Peak</text>`;
  controls.forEach(k=>$(k).value=state[k]);
  $('position-value').textContent=state.position===0?'At Center':`${num(Math.abs(state.position))} mi ${state.position<0?'Left':'Right'}`;
  $('height-value').textContent=`${num(state.height)} Miles`;
  $('feet-value').textContent=`${Math.round(state.height*5280).toLocaleString()} Feet Above The Ground`;
  $('sun-value').textContent=`${num(state.sun)}°${state.sun===0?' · At Horizon':''}`;
  $('state').textContent=m.groundLit?'The ground and peak are in daylight.':m.peakLit?'The peak catches sunlight. The ground is still dark.':'The mountain is too low to catch the Sun.';
  $('result').textContent=m.groundLit?'Move the mountain left or lower the Sun to put the ground back into darkness.':`The mountain is ${num(m.gap)} miles beyond the daylight edge. Here, a peak needs to be about ${num(m.minimumHeight)} miles high to reach sunlight.`;
  controls.forEach(k=>$(k).setAttribute('aria-valuetext',$(k+'-value').textContent));
}
controls.forEach(k=>$(k).addEventListener('input',e=>{state[k]=Number(e.target.value);render();}));
$('example').addEventListener('click',()=>{state={...defaults};render();});
scene.addEventListener('pointerdown',e=>{if(!e.target.closest('.handle'))return;drag=e.pointerId;scene.setPointerCapture(drag);e.preventDefault();});
scene.addEventListener('pointermove',e=>{if(drag!==e.pointerId)return;const rect=scene.getBoundingClientRect();const x=(e.clientX-rect.left-geometry.center)/geometry.sx,z=(geometry.baseline-(e.clientY-rect.top))/geometry.sy;state.position=Math.max(-120,Math.min(120,Math.atan2(x,z+R)*R));state.height=Math.max(0,Math.min(8,Math.hypot(x,z+R)-R));state.position=Math.round(state.position*10)/10;state.height=Math.round(state.height*10)/10;render();});
scene.addEventListener('pointerup',()=>{drag=null;});scene.addEventListener('pointercancel',()=>{drag=null;});
new ResizeObserver(render).observe(scene);render();
