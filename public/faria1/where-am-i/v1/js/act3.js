/* ACT 3 — LONGITUDE IS TIME */
const ACT3 = 'Longitude is time';
Deck.add({ id:'twoships', actName:ACT3, title:'Two ships. The same North Star.', min:1.5, steps:4,
 notes:{ script:`Two ships at the same latitude. One is at London, 51 and a half north. The other is about thirteen hundred miles to the west, still at 51 and a half north. Ask Polaris where they are, and it gives exactly the same answer. Latitude can't tell them apart. [click] But the Sun can. When the Sun is highest over London, it's local noon there. Out west, the Sun is still climbing. [click] Two hours later, it's noon at the western ship. [click] Same latitude, different local noon. Longitude isn't hidden in the stars' height. It is hidden in time.`, cues:['Two positions on 51.5° N: Polaris reads the same.','Sun highest at London: local noon; western ship is still in the morning.','Two hours later: local noon reaches the western ship.','Same latitude. Different local noon.'] },
 build(root){
  const svg=fullSvg(root); this.g=new Globe(svg,{cx:600,cy:700,r:1500,lon:-15,lat:44,grat:10,land:land50(),glow:false});
  const pg=defs(svg);const lg=s('linearGradient',{id:'tsfade',x1:0,x2:1,y1:0,y2:0},pg);s('stop',{offset:'0%','stop-color':'#060C17','stop-opacity':0},lg);s('stop',{offset:'35%','stop-color':'#060C17','stop-opacity':.88},lg);s('stop',{offset:'100%','stop-color':'#060C17','stop-opacity':.95},lg);
  this.mL=this.g.geo(meridianN(0),{stroke:C.gold2,'stroke-width':2,opacity:0,'stroke-dasharray':'6 6'},'over');this.mW=this.g.geo(meridianN(-30),{stroke:C.steel,'stroke-width':2,opacity:0,'stroke-dasharray':'6 6'},'over');
  this.g.geo(parallel(51.5),{stroke:C.gold,'stroke-width':3},'over');
  const marker=(ll,name,dx,dy)=>this.g.point(ll,e=>{s('circle',{r:5,fill:C.gold2},e);s('path',{d:SHIP,fill:'#E7ECF3',stroke:C.ink,'stroke-width':.4,transform:'translate(0,-6) scale(2.1)'},e);s('text',{x:dx,y:dy,class:'label','text-anchor':dx<0?'end':'start',style:'font-size:28px;font-weight:600'},e,name);});
  marker([0,51.5],'Ship at London',30,40);marker([-30,51.5],'Western ship',-30,40);
  const pol=(ll)=>this.g.point(ll,e=>{s('path',{d:starPath(10,4),fill:C.gold2,transform:'translate(0,-64)'},e);s('line',{x1:0,y1:-10,x2:0,y2:-50,stroke:'rgba(244,205,126,.6)','stroke-dasharray':'3 4'},e);s('text',{x:16,y:-58,class:'label num',fill:C.gold2,style:'font-size:24px'},e,'Polaris 51.5°');});pol([0,51.5]);pol([-30,51.5]);
  this.g.point([-15,51.5],e=>{s('text',{y:-18,'text-anchor':'middle',class:'label num',fill:C.gold2},e,'51.5° N');s('text',{y:44,'text-anchor':'middle',class:'label-dim'},e,'← about 1,300 miles →');});
  s('rect',{x:960,y:0,width:960,height:1080,fill:'url(#tsfade)'},svg);
  txt(root,1160,120,650,'kicker',ACT3);txt(root,1156,165,670,'h2','Two ships.<br>The same North Star.');
  txt(root,1160,370,630,'lede','About 1,300 miles apart, on the same parallel.<br><em>Polaris reads 51.5° for both.</em>',0,{out:1});
  const rows=[['London','12:00','10:00'],['Western ship','14:00','12:00']];
  this.clock=txt(root,1160,390,620,'',`<div style="display:flex;gap:65px"><div><div class="label-dim">London</div><div id="lc" class="num" style="font:600 74px/1.5 var(--serif);color:var(--gold-2)">12:00</div></div><div><div class="label-dim">Western ship</div><div id="wc" class="num" style="font:600 74px/1.5 var(--serif);color:#B2CBE2">10:00</div></div></div>`,1);
  txt(root,1160,590,610,'lede','The Sun is highest over London. Out west, it is still morning.',1,{out:2});
  txt(root,1160,590,610,'lede','Two hours later, the Sun is highest over the western ship.',2,{out:3});
  txt(root,1160,590,620,'h2','Same latitude.<br><em>Different local noon.</em>',3,{style:{fontSize:'52px'}});
  const sun=s('g',{},svg);this.sun=sun;s('circle',{r:28,fill:C.gold2},sun);for(let a=0;a<360;a+=45)s('line',{x1:40*Math.cos(a*RAD),y1:40*Math.sin(a*RAD),x2:54*Math.cos(a*RAD),y2:54*Math.sin(a*RAD),stroke:C.gold,'stroke-width':2},sun);
  this.sunSt={lon:0};this.placeSun=()=>{const p=this.g.proj([this.sunSt.lon,66]);sun.setAttribute('transform',`translate(${p[0]},${p[1]-40})`);};this.placeSun();
  txt(root,110,984,1500,'credit','Illustrative mean-solar-time model. Distance is along the 51.5° N parallel; local noon is not a time-zone clock reading.');
 },go(st,{instant}){const d=instant?0:2.4;gsap.to(this.sun,{opacity:st>=1?1:0,duration:.7*(instant?0:1)});gsap.to(this.sunSt,{lon:st>=2?-30:0,duration:d,ease:'power2.inOut',onUpdate:this.placeSun});gsap.to(this.mL,{opacity:st>=1?1:0,duration:.6});gsap.to(this.mW,{opacity:st>=2?1:0,duration:.6});this.clock.querySelector('#lc').textContent=st>=2?'14:00':'12:00';this.clock.querySelector('#wc').textContent=st>=2?'12:00':'10:00';}
});

Deck.add({id:'clockearth',actName:ACT3,title:'Earth is a clock',min:3.25,steps:8,
 notes:{script:`Let's look down on the North Pole. [click] The Earth makes one turn in a day: 360 degrees in 24 hours. [click] Divide that turn like a clock. Twenty-four slices, each one hour wide. [click] Each slice is fifteen degrees. [click] Here is Greenwich, London's home meridian, at zero. London sees noon first. [click] Two hours later, as Earth turns, the western ship sees noon. Two slices: thirty degrees. [click] Stand on that ship when your Sun is highest. Your local time is noon. If a clock from London says two in the afternoon, you are two hours — thirty degrees — west of home. [click] So the problem becomes beautifully simple: to know your longitude, you must carry home time. How do you do that on a ship that rolls, pitches, gets hot, gets cold, and spends months out of sight of land?`,cues:['Globe facing Europe.','Globe flips to a view from above the North Pole.','24 one-hour slices peel out.','One hour = 15°.','Greenwich zero and London’s noon.','Earth turns two hours: the western ship reaches noon.','On the ship: local noon, London clock 14:00 → 30° west.','Punchline: carry home time.']},
 build(root){
  const svg=fullSvg(root);this.svg=svg;this.g=new Globe(svg,{cx:660,cy:560,r:345,lon:-15,lat:35,grat:30});
  const g=this.g;this.ring=s('g',{opacity:0},svg);this.slices=[];
  const R=380,ro=430,cx=660,cy=560;
  for(let k=0;k<24;k++){
   const a0=(k*15-90)*RAD,a1=((k+1)*15-90)*RAD,am=(a0+a1)/2;
   const d=`M${R*Math.cos(a0)},${R*Math.sin(a0)}L${ro*Math.cos(a0)},${ro*Math.sin(a0)}`+arcPath(0,0,ro,a0,a1).replace('M','L')+`L${R*Math.cos(a1)},${R*Math.sin(a1)}`+arcPath(0,0,R,a1,a0).replace('M','L')+'Z';
   const e=s('g',{transform:`translate(${cx},${cy})`},this.ring);s('path',{d,fill:k%2?'rgba(232,176,75,.12)':'rgba(232,176,75,.28)',stroke:'rgba(232,176,75,.4)','stroke-width':1},e);
   
   this.slices.push({e,am});
  }
  this.mers=d3.range(-180,180,15).map(l=>g.geo(meridianN(l),{stroke:'rgba(232,176,75,.45)','stroke-width':1.3,opacity:0},'over'));
  [['noon',0],['6 p.m.',-90],['midnight',180],['6 a.m.',90]].forEach(([n,a])=>{const q=(a-90)*RAD;s('text',{x:cx+472*Math.cos(q),y:cy+472*Math.sin(q)+9,'text-anchor':a===-90?'end':a===90?'start':'middle',class:'label',fill:C.gold2,style:'font-weight:600'},this.ring,n);});
  {const q=(7.5-90)*RAD;this.one=s('g',{opacity:0},svg);s('line',{x1:660+432*Math.cos(q),y1:560+432*Math.sin(q),x2:880,y2:96,stroke:C.gold2,'stroke-width':1.5},this.one);s('text',{x:890,y:104,class:'label num',fill:C.gold2,style:'font-size:30px;font-weight:700'},this.one,'15° = 1 hour');}
  this.zero=g.geo(meridianN(0),{stroke:C.gold2,'stroke-width':3,opacity:0},'over');
  this.west=g.geo(meridianN(-30),{stroke:C.steel,'stroke-width':3,opacity:0},'over');
  this.pole=g.point([0,90],e=>{s('circle',{r:5,fill:C.text},e);s('text',{x:16,y:-14,class:'label-dim'},e,'North Pole');});this.pole.style.opacity=0;
  this.p0=g.point([0,51.5],e=>{s('circle',{r:9,fill:C.gold2},e);s('text',{x:-22,y:8,'text-anchor':'end',class:'label',fill:C.gold2,style:'font-weight:600'},e,'London');});this.p0.style.opacity=0;
  this.p1=g.point([-30,51.5],e=>{s('path',{d:SHIP,fill:C.steel,transform:'scale(1.2)'},e);s('text',{x:24,y:8,class:'label','text-anchor':'start',fill:C.steel,style:'font-weight:600'},e,'Western ship');});this.p1.style.opacity=0;
  this.sun=s('g',{opacity:0},svg);s('circle',{cx:660,cy:40,r:22,fill:C.gold2},this.sun);s('text',{x:694,y:48,class:'label-dim'},this.sun,'Sun');
  this.arc=s('path',{d:arcPath(cx,cy,310,-120*RAD,-90*RAD),fill:'none',stroke:C.gold2,'stroke-width':8,'stroke-linecap':'round',opacity:0},svg);
  this.al=s('text',{x:470,y:300,'text-anchor':'end',class:'label num',fill:C.gold2,style:'font-size:32px;font-weight:700',opacity:0},svg,'30°');
  txt(root,1240,120,610,'kicker',ACT3);txt(root,1236,165,640,'h2','Earth is a clock');
  const caps=[
   'The Sun gives each place its own noon.',
   'Look down on the North Pole. One day is one full turn.',
   'Divide the day into <em>24 one-hour slices</em>.',
   '360° ÷ 24 hours = <em>15° each hour</em>.',
   'Start at Greenwich, London’s home meridian: <em>0°</em>.',
   'Two hours of turning.<br>Two slices. <em>30°</em>.',
   'When it is noon here, London is already at 14:00.<br><em>We are 30° west.</em>',
   'To know your longitude,<br><em>carry home time.</em>'
  ];caps.forEach((v,k)=>txt(root,1240,330,600,k===7?'h2':'lede',v,k,{out:k+1,style:k===7?{fontSize:'58px'}:{}}));
  txt(root,1240,570,600,'',`<div class="num" style="font:600 76px/1.2 var(--serif)"><span class="gold">2 hours</span><br>=<br><span class="steel">30° west</span></div>`,6,{out:7});
  txt(root,1240,600,600,'lede','Not your local time.<br><em>Home’s time.</em>',7);
  txt(root,110,984,1500,'credit','Schematic mean-solar-time model (not civil time zones). The map rotates counterclockwise as seen from the North Pole; sunlight is fixed above.');
 },go(st,{instant}){
  const D=instant?0:1,show=(e,on,d=.8)=>gsap.to(e,{opacity:on?1:0,duration:d*D});
  show(this.ring,st>=2);this.slices.forEach(({e},k)=>gsap.to(e.firstChild,{attr:{fill:st===3&&k===0?'rgba(244,205,126,.85)':(k%2?'rgba(232,176,75,.12)':'rgba(232,176,75,.28)')},duration:.6*D}));show(this.one,st===3);this.mers.forEach((m,k)=>gsap.to(m,{opacity:st>=2?1:0,duration:.5*D,delay:st===2?k*.04*D:0}));show(this.pole,st>=1);show(this.zero,st>=4);show(this.p0,st>=4);show(this.west,st>=5);show(this.p1,st>=5);show(this.sun,st>=4);show(this.arc,st>=5);show(this.al,st>=5);
  if(st>=1)this.g.to({lat:90,roll:180,lon:st>=5?-30:0,r:345,cx:660,cy:560},st===1?2.7:st===5?3:1.5,'power2.inOut',instant);
  else this.g.to({lat:35,lon:-15,roll:0,r:345},1.8,'power2.inOut',instant);
  this.slices.forEach(({e,am},k)=>{const peel=st>=2?1:0;gsap.to(e,{attr:{transform:`translate(${660+18*Math.cos(am)*peel},${560+18*Math.sin(am)*peel})`},duration:1.5*D,delay:st===2?k*.045*D:0,ease:'back.out(1.15)'});});
 }
});
