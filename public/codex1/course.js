"use strict";

const byId = id => document.getElementById(id);
const sources = window.courseSources;
const days = ["Opening","Measure And Triangulate","Time And Precision","From Earth To Maps","Error And The Modern Toolkit"];
const handouts = {thumb:"Thumb To Venus",raster:"Vector And Raster",jupiter:"Jupiter’s Moons"};
const starters = [1,4,60,72,94];
const labPages = {
  4:"thumb",6:"thumb",11:"triangulate",17:"earth",18:"earth",19:"earth",20:"earth",
  21:"projection",23:"polaris",29:"polaris",33:"clock",36:"clock",42:"clock",43:"clock",55:"venus",56:"venus",
  59:"raster",65:"moon",68:"romer",73:"projection",75:"projection",84:"projection",85:"raster",
  86:"raster",95:"error",99:"overlay",100:"overlay",107:"wind",108:"wind",
  112:"overlay",113:"overlay",114:"overlay"
};
const writing = {
  4:["Switch Eyes. What Moves?","Hold up your thumb. Close one eye. Now switch eyes. What jumped against the wall?",
    "Give the room five seconds to try it. Ask what moved in the room, then switch eyes on the bench. Show both sightlines only after someone explains the jump. Bring the thumb closer and ask the room to predict the result."],
  6:["The Thumb Stays Put","Change your viewpoint and watch where the line of sight lands.",
    "The baseline is the distance between viewpoints. A known baseline plus angular measurements can constrain distance."],
  17:["A Shadow Measures Earth","Change the shadow angle. What happens to the estimated size of Earth?",
    "Start at 7.2° and 500 miles. Ask students to estimate the number of equal arcs in a whole turn before reading the result."],
  36:["Earth Is A 24-Hour Clock","Compare local solar time with Greenwich at the same instant.",
    "Start three hours behind Greenwich. Have someone predict the direction before you move the control to three hours ahead."],
  56:["Two Observers See Two Tracks","Move Venus across the Sun. Which observer sees the longer crossing?",
    "Ask what the pair of observers knows that a single observer does not. The track separation is exaggerated and the model compares track lengths, without trying to reproduce a specific expedition."],
  68:["Why Is Io Late?","Move Earth away from Jupiter. The eclipse is the same event, but the light has farther to go.",
    "Ask whether Io changed speed or the signal arrived late. Compare the near and far endpoints. The model uses modern light speed."],
  75:["What Should A Map Preserve?","Move north and switch projections. Watch a tiny equal ground area change on the map.",
    "Start at the equator. At 60° Mercator doubles linear scale and quadruples local area. An equal-area projection keeps local area constant but alters shape."],
  86:["One Coast, Two Records","Change the cell size. When does a feature disappear?",
    "Show the source edge, then lower the number of raster columns. Have students explain why the same vector and raster can disagree at a boundary."],
  95:["How Far Can A Small Error Travel?","Hold the heading error fixed and move farther from your last known position.",
    "This exercise uses a fixed angular bias. Other errors can be independent, correlated, systematic or random, so the way they combine depends on how they arose."],
  100:["Who Is In Range And In The Flood Zone?","Change the shelter radius and flood strip. Watch which homes meet both conditions.",
    "Ask for the two tests before changing either slider. Gold means in range. Coral means in range and also in the flood strip."],
  108:["20% Faster. How Much More Force?","Predict the change, then move the slider from 100 to 120 mph.",
    "Keep air density, area and drag coefficient fixed. Square 1.2 to get 1.44. Discuss why force and damage are different quantities."],
  113:["Would You Open This Shelter?","The shelter sits outside the modeled flood strip. How could access still fail?",
    "Ask what you would verify before deciding: routes, facility conditions, accessibility, current observations, and local authority. The model is fictional and only checks straight-line distance and a simplified flood strip."]
};

function slide(source, page) {
  const [heading, subtitle, ...notes] = sources[source].pages[page-1];
  const day = source === "master" ? (page < 3 ? 0 : page < 60 ? 1 : page < 72 ? 2 : page < 94 ? 3 : 4) : {thumb:1,raster:3,jupiter:2}[source];
  const native = source === "master" && writing[page];
  return {
    id: source === "master" ? `p${page}` : `${source}-${page}`,
    source, page, day, heading, subtitle, notes,
    title:native?.[0] || heading, prompt:native?.[1] || subtitle, presenter:native?.[2],
    lab:source === "master" ? labPages[page] : (
      source === "thumb" ? (page >= 13 && page <= 21 ? "venus" : page === 11 ? "thumb" : undefined) :
      source === "raster" ? "raster" : page === 4 ? "romer" : undefined)
  };
}

const main = sources.master.pages.map((_, i) => slide("master",i+1));
const extra = Object.keys(handouts).map(source => sources[source].pages.map((_, i) => slide(source,i+1)));
const all = new Map([...main,...extra.flat()].map(item=>[item.id,item]));
const featured = [4,11,17,23,36,56,65,68,75,86,95,100,108,113].map(p=>main[p-1]);
const states = new Map();
let item = main[0];
let returnId = null;

function add(parent, tag, label, cls) {
  const el = document.createElement(tag);
  if (label) el.textContent = label;
  if (cls) el.className = cls;
  parent.append(el);
  return el;
}

function navigate(id, {returnTo, focus = true} = {}) {
  const next = all.get(id);
  if (!next) return;
  returnId = returnTo ?? (next.source === "master" ? null : returnId);
  const hash = "#" + id + (returnId ? "?from="+returnId : "");
  if (location.hash !== hash) history.pushState(null,"",hash);
  render(next);
  if (focus) byId(next.id === "p1" ? "cover-title" : "title").focus({preventScroll:true});
  window.scrollTo({top:0});
}

function fromHash() {
  const [id,query] = location.hash.slice(1).split("?");
  const requested = new URLSearchParams(query).get("from");
  returnId = all.get(requested)?.source === "master" ? requested : null;
  render(all.get(id) || main[0]);
}

function row(parent, target, action) {
  const button = add(parent,"button",null,"list-row");
  add(button,"span",target.source === "master" ? String(target.page).padStart(3,"0") : String(target.page));
  add(button,"strong",target.title);
  if (target.id === item.id) button.setAttribute("aria-current","true");
  button.onclick = () => action(target);
  return button;
}

function renderMenu() {
  const list = byId("menu-list");
  const query = byId("search").value.trim().toLowerCase();
  list.replaceChildren();
  if (!query) {
    const jumps = add(list,"div",null,"menu-days");
    starters.slice(1).forEach((start, index) => {
      const button = add(jumps,"button",`Day ${index+1} · ${days[index+1]}`);
      button.onclick = () => {
        byId("menu").close();
        navigate("p"+start);
      };
    });
  }
  const groups = [
    ["Live Demonstrations",featured],
    ...days.map((title, day)=>[day ? `Day ${day} · ${title}` : title, main.filter(entry=>entry.day===day)]),
    ...extra.map(series=>[handouts[series[0].source],series])
  ];
  for (const [title, entries] of groups) {
    if (query && title === "Live Demonstrations") continue;
    const matches = entries.filter(entry=>[entry.title,entry.heading,entry.subtitle,title,entry.page].join(" ").toLowerCase().includes(query));
    if (!matches.length) continue;
    add(list,"h3",title);
    for (const entry of matches) row(list,entry,target=>{
      byId("menu").close();
      navigate(target.id,{returnTo:target.source === "master" ? null : item.source === "master" ? item.id : returnId});
    });
  }
  if (!list.childElementCount) add(list,"p","No slides match that search.");
}

function related(item) {
  if (item.source !== "master") return [];
  if (item.page <= 11 || (item.page >= 45 && item.page <= 58)) return [["Thumb To Venus · 22 Slides",item.page >= 54 ? "thumb-16" : "thumb-1"]];
  if (item.page === 59 || (item.page >= 85 && item.page <= 87)) return [["Vector And Raster · 6 Slides","raster-1"]];
  if (item.page >= 61 && item.page <= 68) return [["Jupiter’s Moons · 4 Slides","jupiter-1"]];
  if (item.page >= 95 && item.page <= 115) return [["Shelter And Flood Lab","p100"],["Wind Force Lab","p108"]].filter(([,id])=>id!==item.id);
  return [];
}

const plates = {
  61:["galileo.jpg","Historical artwork from the Galileo slide"],
  69:["picard-baseline.jpg","Historical survey artwork from the Picard baseline slide"],
  70:["picard-network.jpg","Historical survey artwork from the Picard network slide"]
};

const quiz = {
  77: ["Fly Due South From Havana", "Which mainland South American country do you cross first?",
    ["Colombia","Ecuador","Peru","None Of Them"], 3, "Havana is at 82.4° W. Even Punta Pariñas, at the western edge of mainland South America, is east of that meridian at about 81.3° W."],
  79: ["Which City Is Farther West?", "Picture the California coastline before choosing.",
    ["Los Angeles","Reno","Same Longitude","Depends On The Map"], 1, "Reno is at about 119.8° W. Los Angeles is at about 118.2° W. The coastline bends east as it heads south."],
  81: ["Which City Shares Rome’s Latitude?", "Rome is at 41.9° N. Which city is closest in latitude?",
    ["Atlanta","New York","Boston","Washington, D.C."], 2, "Boston is at about 42.4° N, roughly half a degree north of Rome. Similar latitude alone does not guarantee a similar climate."],
  83: ["How Many Greenlands Equal Africa?", "Estimate the ratio by actual land area.",
    ["About 1","About 3","About 7","About 14"], 3, "Africa is about 30.37 million km² and Greenland about 2.17 million km². Mercator exaggerates area at high latitudes."]
};
const quizMaps = {
  77:["havana","Havana’s 82.4° W meridian runs south, west of Punta Pariñas at 81.3° W."],
  79:["reno","Reno’s meridian is drawn to the left, or west, of the Los Angeles meridian."],
  81:["rome","Boston and Rome lie on nearly overlapping latitude lines across the Atlantic."],
  83:["area","Mercator inflates Greenland relative to Africa. On the equal-area map, Africa is about fourteen times larger."]
};

function addQuizMap(parent, page) {
  const [name, description] = quizMaps[page];
  const figure = add(parent,"figure",null,"quiz-map");
  const image = add(figure,"img");
  image.src = `artwork/quiz-${name}.svg`;
  image.alt = description;
  const credit = add(add(figure,"figcaption"),"a","Natural Earth");
  credit.href = "https://www.naturalearthdata.com/";
  credit.target = "_blank";
  credit.rel = "noopener";
}

const quizPages = Object.keys(quiz).map(Number);
const openingQuiz = () => returnId === "p1" && item.source === "master" && quizPages.includes(item.page);

function quizStep(delta) {
  const page = quizPages[quizPages.indexOf(item.page) + delta];
  navigate(page ? `p${page}` : delta > 0 ? "p4" : "p1", {returnTo:page ? "p1" : null});
}

function renderQuiz(visual, page) {
  const [, , options, answer, explanation] = quiz[page];
  byId("visual-label").textContent = `Map Quiz · Question ${quizPages.indexOf(page)+1} Of ${quizPages.length}`;
  const panel = add(visual,"div",null,"quiz-panel");
  const choices = add(panel,"div",null,"quiz-options");
  let selected = -1;
  const buttons = options.map((label,index) => {
    const button = add(choices,"button");
    add(button,"span",String.fromCharCode(65+index));
    add(button,"strong",label);
    button.setAttribute("aria-pressed","false");
    button.onclick = () => {
      selected = index;
      buttons.forEach((choice,i)=>choice.setAttribute("aria-pressed",String(i===selected)));
    };
    return button;
  });
  const reveal = add(panel,"button","Reveal Answer","primary");
  const result = add(panel,"div",null,"quiz-answer");
  result.setAttribute("aria-live","polite");
  result.tabIndex = -1;
  const onward = add(panel,"button",page === 83 ? "Start The Thumb Experiment" : "Next Question");
  onward.hidden = true;
  onward.onclick = () => quizStep(1);
  reveal.onclick = () => {
    panel.classList.add("is-revealed");
    choices.hidden = true;
    reveal.hidden = true;
    addQuizMap(panel,page);
    panel.insertBefore(panel.lastElementChild,result);
    add(result,"strong",options[answer]);
    add(result,"p",explanation);
    onward.hidden = !openingQuiz();
    (onward.hidden ? result : onward).focus({preventScroll:true});
  };
}

function render(next) {
  item = next;
  const cover = item.id === "p1";
  document.body.classList.toggle("on-cover",cover);
  document.body.classList.toggle("on-opening-quiz",openingQuiz());
  byId("cover").hidden = !cover;
  if (cover) {
    if (document.body.classList.contains("focus")) focusMode();
    rail("index",false);
    rail("topics",false);
  }
  const {source,page,day,title,prompt,subtitle,heading,notes,presenter,lab} = item;
  const series = source === "master" ? main : extra.find(list=>list[0].source===source);
  byId("chapter").textContent = source === "master" ? (day ? `Day ${day} · ${days[day]}` : "Course Opening") : handouts[source];
  const question = source === "master" && quiz[page];
  byId("title").textContent = question ? question[0] : title;
  byId("prompt").textContent = question ? question[1] : prompt;
  const speaker = byId("notes-text");
  speaker.replaceChildren();
  if (presenter) add(speaker,"p",presenter);
  add(speaker,"p", [heading,subtitle,...notes].join("\n"));
  byId("notes").hidden = true;
  byId("progress").textContent = `${String(page).padStart(2,"0")} / ${series.length}`;
  byId("source-label").textContent = source === "master" ? "November 11 Course Master" : handouts[source];
  byId("source-label").title = sources[source].file;
  byId("prev").disabled = page===1;
  byId("next").disabled = page===series.length;
  byId("return").hidden = !returnId || openingQuiz();
  const visual = byId("visual");
  visual.replaceChildren();
  if (question) {
    renderQuiz(visual,page);
  } else if (source === "master" && quizMaps[page-1]) {
    byId("visual-label").textContent = "Map Quiz · Explanation";
    addQuizMap(visual,page-1);
  } else if (lab) {
    byId("visual-label").textContent = labs[lab].title;
    if (!states.has(item.id)) states.set(item.id,{});
    mountLab(visual,labs[lab],states.get(item.id));
  } else {
    byId("visual-label").textContent = source === "master" ? "Course Slide" : "Handout Slide";
    const article = add(visual,"article",null,"source-slide");
    const plate = source === "master" && plates[page];
    if (plate) {
      const figure = add(article,"figure",null,"source-art");
      const image = add(figure,"img");
      image.src = "artwork/" + plate[0];
      image.alt = plate[1];
      add(figure,"figcaption",plate[1]);
    } else {
      add(article,"p",subtitle || heading);
    }
    const selected = notes.filter(line=>line.length>16 && line.length<145 && !/https?:|@/.test(line)).slice(0,4);
    if (selected.length && !plate) {
      const bullets = add(article,"ul");
      for (const line of selected) add(bullets,"li",line);
    }
    if (page === 2 && source === "master") {
      const list = add(article,"nav",null,"day-jump");
      starters.slice(1).forEach((start,i)=>row(list,main[start-1],entry=>navigate(entry.id)));
    }
  }
  const index = byId("index-list");
  index.replaceChildren();
  for (const entry of series.filter(entry=>source!=="master" || entry.day===day)) row(index,entry,target=>navigate(target.id));
  const topics = byId("topics-list");
  topics.replaceChildren();
  const links = related(item);
  if (source==="master" && page===65) {
    const image = add(topics,"a","Lunar Plate From The Course Master");
    image.href = "artwork/moon.jpg";
    image.target = "_blank";
    image.rel = "noopener";
  }
  for (const [label,id] of links) add(topics,"button",label).onclick = () => navigate(id,{returnTo:returnId || item.id});
  if (source==="jupiter" || (source==="master" && page>=66 && page<=68)) {
    const link = add(topics,"a","Jupiter’s Moons on Faria");
    link.href = "https://faria.jbf.com/topics/96-jupiters-moons-as-a-measuring-stick/";
    link.target = "_blank";
    link.rel = "noopener";
  }
  if (!topics.childElementCount) add(topics,"p","No related slide sequence for this page.");
  add(topics,"p",`Source page ${page}`);
  add(topics,"small",sources[source].file.replaceAll("_"," "));
}

function step(delta) {
  if (item.id === "p1" && delta > 0) return startQuiz();
  if (openingQuiz()) return quizStep(delta);
  const next = item.source === "master" ? `p${item.page+delta}` : `${item.source}-${item.page+delta}`;
  navigate(next,{returnTo:returnId});
}

function startQuiz() {
  navigate("p77",{returnTo:"p1"});
}
byId("begin-quiz").onclick = startQuiz;

function rail(id, state = byId(id).hidden) {
  byId(id).hidden = !state;
  byId(id+"-toggle").setAttribute("aria-expanded",String(state));
}
function focusMode() {
  const active = document.body.classList.toggle("focus");
  byId("focus-toggle").setAttribute("aria-pressed",String(active));
  if (active) {rail("index",false);rail("topics",false);}
}
function openMenu() {
  byId("search").value = "";
  renderMenu();
  byId("menu").showModal();
  byId("search").focus();
}
function showKeys() {byId("keys").showModal();}

const commands = [
  ["=",null,null,()=>{
    const notes = byId("notes");
    if (item.id !== "p1" && !document.body.classList.contains("focus")) notes.hidden = !notes.hidden;
  }],
  ["m","M","Open Course Menu",openMenu,"menu-open"],
  ["l","L","Toggle Slide Index",()=>rail("index"),"index-toggle"],
  ["r","R","Toggle Related Topics",()=>rail("topics"),"topics-toggle"],
  ["b","B","Toggle Both Rails",()=>{const open=byId("index").hidden||byId("topics").hidden;rail("index",open);rail("topics",open);}],
  ["f","F","Toggle Visual Focus",focusMode,"focus-toggle"],
  ["ArrowLeft","Left Arrow","Previous Slide",()=>step(-1),"prev"],
  ["ArrowRight","Right Arrow","Next Slide",()=>step(1),"next"],
  ["?","?","Open Keyboard Guide",showKeys,"keys-open"]
];
for (const [,label,description,action,id] of commands) {
  if (id) byId(id).onclick = action;
  if (!label) continue;
  const dt = add(byId("key-list"),"dt");
  add(dt,"kbd",label);
  add(byId("key-list"),"dd",description);
}
byId("return").onclick = () => navigate(returnId);
byId("search").oninput = renderMenu;
document.addEventListener("keydown", event=>{
  if (event.altKey || event.metaKey || event.ctrlKey || (event.shiftKey && event.key!=="?") ||
      event.target.closest("input,textarea,select,[contenteditable],dialog[open]")) return;
  const command = commands.find(([key])=>key===event.key);
  if (!command) return;
  event.preventDefault();
  command[3]();
});
window.addEventListener("hashchange",fromHash);
fromHash();
