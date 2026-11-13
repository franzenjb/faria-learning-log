"use strict";

const radians = Math.PI / 180;
const wrapLongitude = lon => ((lon + 540) % 360) - 180;
const coordinate = (value, positive, negative) =>
  value === 0 ? "0°" : `${Math.abs(value)}° ${value > 0 ? positive : negative}`;
const latitude = value => coordinate(value, "N", "S");
const longitude = value => coordinate(value, "E", "W");
const samples = (first, last, count, get) =>
  Array.from({length:count+1}, (_, i) => get(first + (last-first)*i/count));

function classroomGlobe(parent, {center = [-45,22], title, interactive = true} = {}) {
  const canvas = add(parent,"canvas",null,"classroom-globe");
  canvas.width = 1000;
  canvas.height = 760;
  canvas.setAttribute("role","img");
  canvas.setAttribute("aria-label",title);
  const ctx = canvas.getContext("2d");
  const radius = 339, x0 = 500, y0 = 380;
  let [lon0,lat0] = center;
  let scene = {};
  function project(lon, lat) {
    const dl = (lon-lon0)*radians, phi = lat*radians, tilt = lat0*radians;
    const c = Math.cos(phi), s = Math.sin(phi), x = c*Math.sin(dl);
    const y = Math.cos(tilt)*s-Math.sin(tilt)*c*Math.cos(dl);
    const z = Math.sin(tilt)*s+Math.cos(tilt)*c*Math.cos(dl);
    return [x0+radius*x,y0-radius*y,z];
  }
  function trace(points, color, width, dash = []) {
    ctx.beginPath();
    let previous = false;
    for (const [lon,lat] of points) {
      const [x,y,z] = project(lon,lat);
      if (z >= 0) {
        if (previous) ctx.lineTo(x,y); else ctx.moveTo(x,y);
      }
      previous = z >= 0;
    }
    ctx.setLineDash(dash); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke(); ctx.setLineDash([]);
  }
  const parallel = (lat, color, width, dash) => trace(samples(-180,180,180,lon=>[lon,lat]),color,width,dash);
  const meridian = (lon, color, width, dash) => trace(samples(-90,90,90,lat=>[lon,lat]),color,width,dash);
  function marker([lon,lat,label,color]) {
    const [x,y,z] = project(lon,lat);
    if (z < 0) return;
    ctx.beginPath(); ctx.arc(x,y,8,0,2*Math.PI); ctx.fillStyle=color; ctx.fill();
    ctx.font = "600 22px Inter, sans-serif";
    ctx.textAlign = x > x0+200 ? "right" : "left";
    const offset = ctx.textAlign === "right" ? -15 : 15;
    ctx.lineWidth = 6; ctx.strokeStyle="#080f1b"; ctx.strokeText(label,x+offset,y-13);
    ctx.fillText(label,x+offset,y-13);
  }
  const coast = worldCoast.map(segment=> {
    const points=[];
    for(let i=0;i<segment.length;i+=2) points.push([segment[i]/10,segment[i+1]/10]);
    return points;
  });
  function draw() {
    ctx.clearRect(0,0,1000,760);
    ctx.save();
    ctx.beginPath(); ctx.arc(x0,y0,radius,0,2*Math.PI);
    const sea = ctx.createRadialGradient(380,270,36,x0,y0,radius);
    sea.addColorStop(0,"#2c5369"); sea.addColorStop(1,"#0a192d");
    ctx.fillStyle=sea; ctx.shadowColor="#80b4d5"; ctx.shadowBlur=28; ctx.fill(); ctx.shadowBlur=0;
    ctx.strokeStyle="#81a8bd"; ctx.lineWidth=2; ctx.stroke();
    for (let i=-75;i<=75;i+=15) if(scene.latitudes) parallel(i,"#547a8a",i===0?2:1);
    for (let i=-180;i<180;i+=15) if(scene.longitudes) meridian(i,"#547a8a",i===0?2:1);
    for (const segment of coast) trace(segment,"#91b2b8",1.7);
    for (const [lat,color,width,dash] of scene.parallels || []) parallel(lat,color,width,dash);
    for (const [lon,color,width,dash] of scene.meridians || []) meridian(lon,color,width,dash);
    for (const [points,color,width,dash] of scene.routes || []) trace(points,color,width,dash);
    for (const point of scene.points || []) marker(point);
    ctx.restore();
  }
  if (interactive) {
    let drag;
    canvas.addEventListener("pointerdown",event=>{
      if (event.button !== 0) return;
      canvas.setPointerCapture(event.pointerId);
      drag=[event.clientX,event.clientY,lon0,lat0];
    });
    canvas.addEventListener("pointermove",event=>{
      if (!drag) return;
      const degrees=160/canvas.getBoundingClientRect().width;
      lon0=wrapLongitude(drag[2]-(event.clientX-drag[0])*degrees);
      lat0=Math.max(-85,Math.min(85,drag[3]+(event.clientY-drag[1])*degrees));
      draw();
    });
    const end = () => {drag=undefined;};
    canvas.addEventListener("lostpointercapture",end);
    canvas.addEventListener("pointercancel",end);
  }
  return {
    update(next) {scene=next;draw();},
    reset() {[lon0,lat0]=center;draw();}
  };
}

function action(parent, label, run, cls) {
  const button = add(parent,"button",label,cls);
  button.type="button";
  button.onclick=run;
  return button;
}

function selectValues(parent,label,values,format,selected,change) {
  const field=add(parent,"label",label);
  const select=add(field,"select");
  for(const value of values) {
    const option=add(select,"option",format(value));
    option.value=value;
  }
  select.value=selected;
  select.onchange=()=>change(Number(select.value));
  return select;
}

function mountBingo(parent) {
  const lab=add(parent,"div",null,"globe-lab");
  const globe=classroomGlobe(lab,{title:"Globe with selected latitude row and longitude column"});
  const status=add(lab,"p",null,"globe-status");
  status.setAttribute("aria-live","polite");
  const controls=add(lab,"div",null,"atlas-controls");
  const rows=[60,45,30,15,0,-15,-30], columns=[-90,-75,-60,-45,-30,-15,0];
  let lat=45,lon=-60,showLat=false,showLon=false;
  const row=selectValues(controls,"Latitude Row",rows,latitude,lat,value=>{lat=value;showLat=true;draw();});
  const column=selectValues(controls,"Longitude Column",columns,longitude,lon,value=>{lon=value;showLon=true;draw();});
  const latButton=action(controls,"Latitude Lines",()=>{showLat=!showLat;draw();});
  const lonButton=action(controls,"Longitude Lines",()=>{showLon=!showLon;draw();});
  const card=add(lab,"div",null,"bingo-overlay");
  card.hidden=true;
  const cardButton=action(controls,"Bingo Card",()=>{
    card.hidden=!card.hidden;
    cardButton.setAttribute("aria-expanded",String(!card.hidden));
    if (!card.hidden) {showLat=true;showLon=true;draw();}
  });
  cardButton.setAttribute("aria-expanded","false");
  action(controls,"Reset View",()=>globe.reset());
  const table=add(card,"table",null,"bingo-card");
  add(table,"caption","Pick a Row and a Column");
  const head=add(add(table,"thead"),"tr");
  add(head,"th","Lat / Lon");
  for(const value of columns) {
    const cell=add(head,"th");cell.scope="col";
    action(cell,longitude(value),()=>{lon=value;draw();});
  }
  const cells=[];
  const rowsBody=add(table,"tbody");
  for(const y of rows) {
    const tr=add(rowsBody,"tr");
    const label=add(tr,"th");label.scope="row";
    action(label,latitude(y),()=>{lat=y;draw();});
    for(const x of columns) cells.push([add(tr,"td"),y,x]);
  }
  function draw() {
    row.value=lat;column.value=lon;
    latButton.setAttribute("aria-pressed",String(showLat));
    lonButton.setAttribute("aria-pressed",String(showLon));
    const marked=showLat&&showLon;
    for(const [cell,y,x] of cells) {
      cell.classList.toggle("selected-row",y===lat);
      cell.classList.toggle("selected-column",x===lon);
      cell.textContent=y===lat&&x===lon?"×":"";
    }
    status.textContent=marked?`${latitude(lat)} · ${longitude(lon)}`:"Turn on both lines to find their intersection.";
    globe.update({latitudes:showLat,longitudes:showLon,parallels:showLat?[[lat,"#ffc477",3]]:[],
      meridians:showLon?[[lon,"#98d9f5",3]]:[],
      points:marked?[[lon,lat,"Intersection","#fff6e1"]]:[]});
  }
  draw();
}

function mountShips(parent) {
  const lab=add(parent,"div",null,"globe-lab");
  const globe=classroomGlobe(lab,{center:[-38,33],title:"North Atlantic globe showing ship predictions and revealed longitude"});
  const status=add(lab,"p",null,"globe-status");
  status.setAttribute("aria-live","polite");
  const controls=add(lab,"div",null,"atlas-controls");
  const clues=add(lab,"div",null,"ship-clues");
  const shipColors=["#ffc477","#98d9f5"], actual=[-30,-50], guess=[-15,-65];
  let phase=0;
  const ranges=["A","B"].map((name,i)=>{
    const label=add(clues,"label",`Ship ${name} · Greenwich ${i===0?"2:00 PM":"3:20 PM"}`);
    const input=add(label,"input");
    input.type="range";input.min=0;input.max=75;input.step=1;input.value=-guess[i];
    const read=add(label,"output");
    input.oninput=()=>{guess[i]=-Number(input.value);draw();};
    return {input,read};
  });
  const advance=action(controls,"Show the Clock Readings",()=>{
    phase=Math.min(2,phase+1);draw();
  },"primary");
  action(controls,"Reset Challenge",()=>{
    phase=0;guess.splice(0,2,-15,-65);
    ranges.forEach(({input},i)=>{input.value=-guess[i];});
    draw();
  });
  action(controls,"Reset View",()=>globe.reset());
  function draw() {
    clues.hidden=phase===0;
    advance.hidden=phase===2;
    advance.textContent=phase===0?"Show the Clock Readings":"Reveal the Ships";
    ranges.forEach(({input,read},i)=>{input.disabled=phase===2;read.textContent=longitude(guess[i]);});
    const reveal=phase===2;
    status.textContent=phase===0?"Both ships report local solar noon at 40° N. Where along the parallel could they be?"
      :reveal?`A · 2 h × 15° = 30° W. B · 3 h 20 m × 15° = 50° W. Your errors: ${Math.abs(guess[0]-actual[0])}° and ${Math.abs(guess[1]-actual[1])}°.`
      :"At each ship’s own solar noon, read its Greenwich clock. Place both ships, then reveal.";
    globe.update({parallels:[[40,"#a3bdcb",2]],meridians:phase?guess.map((lon,i)=>[lon,shipColors[i],2,[7,7]]):[],
      points:phase?guess.map((lon,i)=>[lon,40,`Your ${i===0?"A":"B"}`,shipColors[i]]).concat(reveal?
        actual.map((lon,i)=>[lon,40,`Ship ${i===0?"A":"B"}`,shipColors[i]]):[]):[],
      routes:reveal?actual.map((lon,i)=>[samples(guess[i],lon,30,x=>[x,40]),shipColors[i],6,[]]):[]});
  }
  draw();
}

function mountHavana(parent, complete) {
  const figure=add(parent,"figure",null,"quiz-map globe-reveal");
  const globe=classroomGlobe(figure,{center:[-79,4],title:"Havana’s southbound meridian passes west of mainland South America",interactive:false});
  add(add(figure,"figcaption"),"a","Natural Earth").href="https://www.naturalearthdata.com/";
  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const start=performance.now();
  function frame(now) {
    if(!figure.isConnected) return;
    const progress=reduced?1:Math.min(1,(now-start)/1500);
    globe.update({routes:[[samples(23.1,23.1-70*progress,50,y=>[-82.4,y]),"#ffc477",4,[]]],
      points:[[-82.4,23.1,"Havana · 82.4° W","#ffc477"],...(progress===1?[[-81.3,-4.7,"Punta Pariñas · 81.3° W","#98d9f5"]]:[])]});
    if(progress<1) requestAnimationFrame(frame); else complete();
  }
  requestAnimationFrame(frame);
  return figure;
}
