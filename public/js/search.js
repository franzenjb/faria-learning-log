(async function(){const q=document.getElementById("q"),out=document.getElementById("results"),c=document.getElementById("count");
const idx=await (await fetch("../search-index.json")).json();
const e=s=>s.replace(/[&<>]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[m]));
const norm=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
idx.forEach(d=>{d.n=norm(d.t+" "+d.g.join(" ")+" "+d.s+" "+d.x)});
function run(){const words=norm(q.value).split(/\s+/).filter(Boolean);history.replaceState(null,"","?q="+encodeURIComponent(q.value));
if(!words.length){out.innerHTML="";c.textContent="";return}
const hits=idx.filter(d=>words.every(w=>d.n.includes(w))).map(d=>{const nt=norm(d.t);return[d,words.reduce((a,w)=>a+(nt.includes(w)?10:0)+(d.g.join(" ").includes(w)?5:0),0)]}).sort((a,b)=>b[1]-a[1]).map(x=>x[0]);
c.textContent=hits.length+" topic"+(hits.length==1?"":"s");
out.innerHTML=hits.map(d=>{const nx=norm(d.x),i=nx.indexOf(words[0]),st=Math.max(0,i-70);let snip=(st?"…":"")+d.x.slice(st,st+180)+"…";return`<li class="card"><a href="../${d.u}"><strong>${e(d.t)}</strong><span>${e(snip)}</span></a></li>`}).join("")}
q.addEventListener("input",run);const p=new URLSearchParams(location.search).get("q");if(p){q.value=p;run()}})();
