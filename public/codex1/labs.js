"use strict";

const ink = "#a3cbd3";
const gold = "#ffcf85";
const tau = 2 * Math.PI;
const text = (x, y, value, cls = "", anchor = "start") =>
  `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${value}</text>`;
const line = (x1, y1, x2, y2, cls = "line") =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/>`;
const dot = (x, y, r = 5, fill = gold) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
const poly = (points, fill, stroke = ink) =>
  `<polygon points="${points.map(point => point.join(",")).join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
const circle = (x, y, r, cls = "grid") => `<circle cx="${x}" cy="${y}" r="${r}" class="${cls}"/>`;
const steps = (count, draw) => Array.from({length: count}, (_, index) => draw(index)).join("");
const position = (x, y, radius, angle) => [x + radius * Math.sin(angle), y - radius * Math.cos(angle)];
const digits = new Intl.NumberFormat("en-US", {maximumFractionDigits: 1});
const num = value => digits.format(value);
const range = (id, label, min, max, step, value, unit) => ({id, label, min, max, step, value, unit});
const lab = (title, ranges, buttons, draw) => ({title, ranges, buttons, draw});

const coast = [[38,60],[225,60],[272,91],[253,139],[307,159],[278,199],[313,232],[269,267],[283,318],[38,318]];
function isLand(x, y) {
  let inside = false;
  for (let i = 0, j = coast.length - 1; i < coast.length; j = i++) {
    const [ax, ay] = coast[i], [bx, by] = coast[j];
    if ((ay > y) !== (by > y) && x < (bx - ax) * (y - ay) / (by - ay) + ax) inside = !inside;
  }
  return inside;
}

const homes = [[115,113],[172,220],[215,143],[274,228],[323,105],[356,256],[426,177],[488,224],[541,119],[567,277],[606,188]];
const labs = {
  thumb: lab("Parallax Bench", [range("distance","Thumb Distance",12,36,1,22,"in"), range("baseline","Eye Separation",1,4,.1,2.5,"in")],
    [["eye","Switch Eyes"],["reveal","Show Both Sightlines"]], s => {
      const both = !!s.reveal;
      const a = 2 * Math.atan(s.baseline / (2 * s.distance));
      const separation = s.baseline * (480 / s.distance - 1) / 12;
      const eyeGap = s.baseline * 19;
      const wallGap = separation * 24;
      const thumbY = 316 - 230 * eyeGap / (eyeGap + wallGap/2);
      let g = steps(19,i => line(62+i*32,56,62+i*32,328,"grid")) + steps(9,i => line(62,60+i*32,638,60+i*32,"grid"));
      g += line(62,86,638,86) + text(62,73,"REFERENCE WALL · 40 FT","small");
      g += line(350-eyeGap,316,350+eyeGap,316) + dot(350,316,3,ink);
      g += line(350-eyeGap,329,350-eyeGap,347,"grid") + line(350+eyeGap,329,350+eyeGap,347,"grid") +
        line(350-eyeGap,339,350+eyeGap,339) + text(350,366,`${num(s.baseline)} in between eyes`,"small","middle");
      g += line(205,thumbY,335,thumbY,"grid") + line(205,316,350-eyeGap-10,316,"grid") +
        line(205,thumbY,205,316) + line(199,thumbY,211,thumbY) + line(199,316,211,316) +
        text(194,(thumbY+316)/2-5,`${num(s.distance)} in`,"","end") +
        text(194,(thumbY+316)/2+14,"TO THUMB","small","end");
      g += dot(350,thumbY,14) + text(369,thumbY+5,"FIXED THUMB","gold");
      for (const side of [-1,1]) {
        const selected = (s.eye ? 1 : -1) === side;
        const x = 350+side*eyeGap;
        const mark = 350-side*wallGap/2;
        g += dot(x,316,8,selected ? gold : ink);
        if (both || selected) {
          const cls = selected ? "active" : "line";
          g += line(x,316,350,thumbY,cls) + line(350,thumbY,mark,86,cls) + dot(mark,86,6,selected ? gold : ink);
        }
      }
      return [g, both ? `${num(a*180/Math.PI)}° between sightlines · ${num(separation)} ft between wall marks` : `${s.eye ? "Right" : "Left"} eye open · ${s.distance} in to the thumb`,
        "Schematic top view, not to scale. Thumb distance starts at the midpoint between the eyes."];
    }),
  earth: lab("Measure The Earth", [range("angle","Shadow Angle",2,25,.1,7.2),range("distance","Arc Distance (Miles)",100,1000,10,500)], [], s => {
    const a = s.angle*tau/360, x=355, y=222, r=126;
    const [ax,ay] = position(x,y,r,a);
    const g = circle(x,y,r,"line")+line(x,y,x,y-r,"grid")+line(x,y,ax,ay,"active")+dot(x,y)+dot(ax,ay)+
      steps(6,i => line(215+i*52,34,215+i*52,84,"line"))+
      text(355,24,"NEARLY PARALLEL SUNLIGHT","small","middle")+text(390,145,`${num(s.angle)}° OF ARC`,"gold")+
      text(30,215,"A MEASURED ARC","small")+text(30,244,`${s.distance} MI`)+text(355,374,"360° ÷ SHADOW ANGLE × ARC DISTANCE","small","middle");
    return [g,`Estimated circumference · ${num(360/s.angle*s.distance)} mi`,"Spherical Earth and rounded teaching inputs. The original distance was expressed in stadia."];
  }),
  clock: lab("Earth As A Clock", [range("hours","Local Solar Time Minus Greenwich", -12,12,.25,-3)], [], s => {
    const lon=s.hours*15;
    const [x,y]=position(350,193,140,lon*tau/360);
    const g=circle(350,193,145,"line")+circle(350,193,96)+circle(350,193,47)+
      steps(24,i=>line(350,193,...position(350,193,145,i*tau/24),"grid"))+
      line(350,193,350,48)+line(350,193,x,y,"active")+dot(x,y,8)+dot(350,193,4,ink)+
      text(350,27,"GREENWICH · 0°","small","middle")+text(350,377,"NORTH POLAR VIEW · 24 SECTORS","small","middle");
    return [g,`${num(Math.abs(lon))}° ${lon<0?"west":lon>0?"east":"· Greenwich"} · 15° per hour`,"Positive local mean solar time difference puts you east. Civil time-zone offsets do not locate a meridian."];
  }),
  venus: lab("Two Observers, One Transit", [range("time","Transit Progress",0,100,1,42),range("offset","Apparent Track Separation",4,58,1,28)], [], s => {
    const g0 = dot(350,188,151,"#a35021")+dot(350,188,146,"#e39248")+circle(350,188,150,"active");
    let g=g0;
    for(const [i,y] of [115,115+s.offset].entries()){
      const dx=Math.sqrt(146**2-(y-188)**2);
      const x=350-dx+2*dx*s.time/100;
      g += line(350-dx,y,350+dx,y,i?"line":"active")+dot(x,y,10,"#10252c")+
        text(350+dx+14,y+5,i?"SITE B":"SITE A","small");
    }
    g += text(350,374,"TRACK SEPARATION EXAGGERATED","small","middle");
    return [g,`Track length ratio B : A · ${(Math.sqrt(146**2-(115+s.offset-188)**2)/Math.sqrt(146**2-(115-188)**2)).toFixed(3)}`,"A schematic at equal fractional progress in each track. Halley proposed comparing crossing durations from separated sites."];
  }),
  polaris: lab("Your Latitude In The Sky", [range("latitude","Northern Latitude",0,90,.5,43.5)], [], s => {
    const a = s.latitude*tau/360;
    const start = [188,298];
    const [x,y] = position(...start,235,Math.PI/2-a);
    const [ax,ay] = position(...start,84,Math.PI/2-a);
    const g=line(85,298,630,298)+line(...start,x,y,"active")+dot(x,y,9)+dot(...start,7,ink)+
      `<path d="M 272 298 A 84 84 0 0 0 ${ax} ${ay}" class="active"/>`+
      text(82,326,"LOCAL HORIZON","small")+text(x+15,y-9,"NORTH CELESTIAL POLE","small")+
      text(350,371,"LOOK DUE NORTH","small","middle");
    return [g,`${num(s.latitude)}° N · ${num(s.latitude)}° above your horizon`,"The diagram uses the exact north celestial pole. Polaris is close to it, with a small offset."];
  }),
  triangulate: lab("Measure The Unreachable", [range("base","Measured Baseline (Metres)",30,220,1,100),range("angle","Angle At Each End",15,75,1,45)], [], s => {
    const height=s.base/2*Math.tan(s.angle*tau/360);
    const x1=230,x2=470,y=310, y2=y-Math.min(251,height*1.8);
    const g=line(x1,y,x2,y,"active")+line(x1,y,350,y2)+line(x2,y,350,y2)+line(350,y,350,y2,"grid")+
      dot(x1,y,6)+dot(x2,y,6)+dot(350,y2,7,ink)+text(350,y2-18,"TARGET","small","middle")+
      text(350,345,`${s.base} M BASELINE`,"gold","middle")+
      text(207,289,`${s.angle}°`,"small","end")+text(492,289,`${s.angle}°`,"small")+
      text(364,(y+y2)/2,`${num(height)} M`,"small");
    return [g,`Perpendicular distance · ${num(height)} m`,"Symmetric example. The target is opposite the midpoint, so distance equals half the baseline times the tangent of the sight angle. Drawing is schematic."];
  }),
  moon: lab("A Peak Beyond The Terminator", [range("distance","Projected Distance From Terminator (km)",25,250,1,170)], [], s => {
    const radius=1737.4, height=Math.hypot(radius,s.distance)-radius;
    const x=352+s.distance*.65, y=82;
    const g=dot(350,212,129,"#18343e")+
      `<path d="M350 83 A129 129 0 0 0 350 341 Z" fill="#aac8c6"/>`+
      circle(350,212,129,"line")+line(350,63,350,343,"grid")+
      line(350,212,350,y)+line(350,212,x,y,"active")+line(350,y,x,y,"active")+dot(x,y,5)+
      text(365,142,"RADIUS","small")+text(350,373,"TANGENT GEOMETRY · DISTANCE EXAGGERATED","small","middle");
    return [g,`Estimated peak height · ${num(height)} km`,"Idealized tangent geometry using a 1,737.4 km lunar radius. The display exaggerates the distance beyond the terminator."];
  }),
  romer: lab("The Delayed Eclipse", [range("angle","Earth Orbital Position",0,180,1,85)], [], s => {
    const a=s.angle*tau/360;
    const ex=250+55*Math.cos(a), ey=194-55*Math.sin(a);
    const au=Math.sqrt(5.2**2+1-10.4*Math.cos(a));
    const delay=Math.round((au-4.2)*499.0);
    const g=circle(250,194,55,"line")+circle(250,194,280)+line(ex,ey,536,194,"active")+
      dot(250,194,20,"#e99e57")+dot(ex,ey,10,ink)+dot(536,194,34,"#bd926f")+
      text(ex,ey-21,"EARTH","small","middle")+text(250,239,"SUN","small","middle")+text(536,250,"JUPITER","small","middle")+
      text(420,137,`${au.toFixed(2)} AU`,"gold","middle")+text(350,365,"CIRCULAR ORBITS · PLANET SIZES EXAGGERATED","small","middle");
    return [g,`${Math.floor(delay/60)} min ${delay%60} s later than at closest approach`,"Modern light time of about 499 seconds per astronomical unit. Jupiter is held fixed for this teaching model."];
  }),
  projection: lab("The Projection Trade-Off", [range("latitude","Test Latitude",0,75,1,60)], [["equal","Switch Projection"]], s => {
    const a=s.latitude*tau/360;
    const sec=1/Math.cos(a);
    const y=s.equal ? 320-145*Math.sin(a) : 320-145*Math.log(Math.tan(Math.PI/4+a/2));
    const rx=16*sec;
    const ry=s.equal ? 16/sec : 16*sec;
    const projY = deg => s.equal ? 320-145*Math.sin(deg*tau/360) : 320-145*Math.log(Math.tan(Math.PI/4+deg*tau/720));
    const g=steps(11,i=>line(70+i*56,18,70+i*56,320,"grid"))+
      steps(6,i=>line(70,projY(i*15),630,projY(i*15),"grid"))+
      `<ellipse cx="350" cy="${y}" rx="${rx}" ry="${ry}" fill="#ffcf8540" stroke="${gold}" stroke-width="2"/>`+
      text(70,347,"EQUATOR","small")+text(630,31,s.equal?"CYLINDRICAL EQUAL-AREA":"MERCATOR","small","end");
    return [g,`${s.latitude}° N · local area scale ${(s.equal?1:sec**2).toFixed(2)}×`,"Indicatrix on a schematic graticule. Local scale relative to the equator. Equal-area changes shape while conserving area."];
  }),
  raster: lab("One Coast, Two Data Models", [range("cells","Raster Columns",6,34,1,13)], [["edge","Show Source Edge"]], s => {
    const size=280/s.cells;
    const rows=Math.ceil(258/size);
    const g=poly(coast,"#315756")+steps(s.cells*rows,i=>{
      const x=38+(i%s.cells)*size,y=60+Math.floor(i/s.cells)*size;
      return `<rect x="${x+322}" y="${y}" width="${size}" height="${Math.min(size,318-y)}" fill="${isLand(x+size/2,y+size/2)?"#315756":"#122d36"}" stroke="#54727b" stroke-width=".55"/>`;
    }) + (s.edge?`<g transform="translate(322)">(EDGE)</g>`.replace("(EDGE)",poly(coast,"none",gold)):"") +
    text(38,40,"VECTOR · STORED VERTICES","small")+text(360,40,"RASTER · CELL-CENTRE SAMPLING","small");
    return [g,`10 vertices · ${s.cells*rows} raster cells`,"Synthetic shoreline. The raster assigns each cell the class at its centre."];
  }),
  error: lab("An Error Becomes A Corridor", [range("distance","Travel Distance (Miles)",10,500,5,200),range("error","Heading Error (Degrees)",0,15,.5,3)], [], s => {
    const spread=s.distance*Math.sin(s.error*tau/360);
    const x=98+s.distance; const y=196; const h=spread*1.2;
    const g=steps(12,i=>line(60+i*52,52,60+i*52,330,"grid"))+
      steps(7,i=>line(60,52+i*44,636,52+i*44,"grid"))+
      poly([[98,y],[x,y-h],[x,y+h]],"#ffcf8530",gold)+line(98,y,x,y)+dot(98,y)+dot(x,y,7,ink)+
      text(98,360,"LAST FIX","small","middle")+text(x,360,"ESTIMATED POSITION","small","middle");
    return [g,`±${num(spread)} mi cross-track at the end of the leg`,"Straight, flat teaching model with a fixed heading bias and known distance. It does not model independent random errors."];
  }),
  overlay: lab("Shelter & Flood Overlay", [range("buffer","Shelter Radius (Miles)",.5,4,.1,2.2),range("flood","Flood Strip Half-Width (Miles)",.3,2.5,.1,.9)], [["show","Show Unbuffered Homes"]], s => {
    const cx=260,cy=187, r=s.buffer*58, river=453, f=s.flood*58;
    const inside=homes.filter(([x,y])=>Math.hypot(x-cx,y-cy)<=r);
    const overlap=inside.filter(([x])=>Math.abs(x-river)<=f);
    const g=steps(12,i=>line(64+i*52,50,64+i*52,337,"grid"))+
      steps(7,i=>line(64,52+i*45,636,52+i*45,"grid"))+
      `<rect x="${river-f}" y="54" width="${2*f}" height="280" fill="#7cafce45"/>`+line(river,54,river,334)+
      `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffcf8518" stroke="${gold}" stroke-width="2"/>`+
      homes.map(point=>{const [x,y]=point;return inside.includes(point)||s.show?dot(x,y,7,overlap.includes(point)?"#ff957c":inside.includes(point)?gold:"#82a9b3"):"";}).join("")+
      dot(cx,cy,10)+text(cx,cy-20,"SHELTER","small","middle")+text(river,31,"FLOOD STRIP","small","middle")+
      text(64,368,"FICTIONAL EXERCISE · STRAIGHT-LINE DISTANCE","small");
    return [g,`${inside.length} homes in range · ${overlap.length} also in the flood strip`,"Distances use a fictional local plane. This radius does not measure road access or determine shelter suitability."];
  }),
  wind: lab("Wind Speed & Force", [range("speed","Wind Speed (MPH)",0,180,1,100)], [], s => {
    const px=v=>85+v*2.98, py=v=>328-((v/100)**2)*81;
    const points=Array.from({length:181},(_,i)=>`${px(i)},${py(i)}`).join(" ");
    const g=steps(5,i=>line(85,328-i*66,622,328-i*66,"grid"))+
      line(85,328,635,328)+line(85,328,85,54)+
      `<polyline points="${points}" class="active"/>`+line(px(s.speed),328,px(s.speed),py(s.speed),"grid")+dot(px(s.speed),py(s.speed),8)+
      text(85,37,"FORCE RELATIVE TO 100 MPH","small")+text(635,363,"WIND SPEED · MPH","small","end")+
      text(px(100),355,"100","small","middle");
    return [g,`${s.speed} mph · ${((s.speed/100)**2).toFixed(2)}× baseline force`,"Drag force model with fixed air density, exposed area, and drag coefficient. This is not a damage forecast."];
  })
};

function mountLab(container, definition, state) {
  const picture = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  picture.setAttribute("viewBox", "0 0 700 390");
  picture.setAttribute("class", "diagram");
  picture.setAttribute("role", "img");
  const controls = document.createElement("div");
  controls.className = "controls";
  const readout = document.createElement("p");
  readout.className = "readout";
  readout.setAttribute("aria-live", "polite");
  const caption = document.createElement("p");
  caption.className = "caption";
  const buttons = [];
  function draw() {
    const [image, result, description] = definition.draw(state);
    picture.innerHTML = image;
    picture.setAttribute("aria-label", description);
    readout.textContent = result;
    caption.textContent = description;
    for (const [button, key] of buttons) button.setAttribute("aria-pressed", String(!!state[key]));
  }
  for (const item of definition.ranges) {
    state[item.id] ??= item.value;
    const label = document.createElement("label");
    const heading = document.createElement("span");
    heading.className = "range-heading";
    heading.textContent = item.label;
    label.append(heading);
    const input = document.createElement("input");
    input.type = "range";
    for (const key of ["min","max","step"]) input[key] = item[key];
    input.value = state[item.id];
    input.setAttribute("aria-label", item.label);
    const value = document.createElement("span");
    value.className = "range-value";
    value.setAttribute("aria-hidden", "true");
    if (item.unit) heading.append(value);
    function updateValue() {
      const label = item.unit ? `${num(Number(input.value))} ${item.unit}` : input.value;
      input.setAttribute("aria-valuetext", item.unit === "in" ? `${input.value} inches` : label);
      value.textContent = label;
    }
    updateValue();
    input.addEventListener("input", () => {
      state[item.id] = Number(input.value);
      updateValue();
      draw();
    });
    label.append(input);
    controls.append(label);
  }
  for (const [key, label] of definition.buttons) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", () => { state[key] = !state[key]; draw(); });
    buttons.push([button, key]);
    controls.append(button);
  }
  container.replaceChildren(picture, controls, readout, caption);
  draw();
}
