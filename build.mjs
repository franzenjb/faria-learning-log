// Zero-dependency static site builder for the Faria learning log.
// Topics: content/topics/*.md   Sessions: content/sessions/*.md   Output: dist/
import fs from "node:fs"; import path from "node:path";
const SRC = "content", OUT = "dist";
fs.rmSync(OUT, { recursive: true, force: true }); fs.cpSync("public", OUT, { recursive: true });

function front(txt) {
  const m = txt.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/); if (!m) return [{}, txt];
  const d = {};
  for (const line of m[1].split("\n")) {
    const k = line.match(/^(\w+):\s*(.*)$/); if (!k) continue;
    let v = k[2].trim();
    if (v.startsWith("[")) v = v.slice(1, -1).split(",").map(s => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    else v = v.replace(/^["']|["']$/g, "");
    d[k[1]] = v;
  }
  return [d, m[2]];
}
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function inline(s) {
  s = esc(s);
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<figure><img src="$2" alt="$1" loading="lazy"><figcaption>$1</figcaption></figure>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return s;
}
function md(src) {
  const out = []; let para = [], list = null, quote = [], table = [];
  const flush = () => {
    if (para.length) { const t = inline(para.join(" ")); out.push(t.startsWith("<figure>") ? t : `<p>${t}</p>`); para = []; }
    if (list) { out.push(`<${list.t}>${list.items.map(i => `<li>${inline(i)}</li>`).join("")}</${list.t}>`); list = null; }
    if (quote.length) { out.push(`<blockquote>${quote.map(l => l ? inline(l) : "").join("<br>").replace(/(<br>){2,}/g, "</p><p>")}</blockquote>`); quote = []; }
    if (table.length) { const cells = r => r.replace(/^\||\|$/g, "").split("|").map(c => c.trim()); const rows = table.filter(r => !/^\|?\s*:?-{2,}/.test(r)); const [h, ...b] = rows; out.push(`<div class="table-wrap"><table><thead><tr>${cells(h).map(c => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${b.map(r => `<tr>${cells(r).map(c => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`); table = []; }
  };
  for (const raw of src.split("\n")) {
    const l = raw.trimEnd(); let m;
    if (!l.trim()) { flush(); continue; }
    if ((m = l.match(/^(#{2,4})\s+(.*)/))) { flush(); const n = m[1].length; const id = m[2].toLowerCase().replace(/[^a-z0-9]+/g, "-"); out.push(`<h${n} id="${id}">${inline(m[2])}</h${n}>`); continue; }
    if (/^\|.*\|$/.test(l.trim())) { if (!table.length) flush(); table.push(l.trim()); continue; }
    if (table.length) flush();
    if ((m = l.match(/^>\s?(.*)/))) { if (para.length || list) { const q = quote; quote = []; flush(); quote = q; } quote.push(m[1]); continue; }
    if ((m = l.match(/^[-*]\s+(.*)/))) { if (para.length || quote.length) flush(); if (!list || list.t !== "ul") { flush(); list = { t: "ul", items: [] }; } list.items.push(m[1]); continue; }
    if ((m = l.match(/^\d+\.\s+(.*)/))) { if (para.length || quote.length) flush(); if (!list || list.t !== "ol") { flush(); list = { t: "ol", items: [] }; } list.items.push(m[1]); continue; }
    if (list) { list.items[list.items.length - 1] += " " + l.trim(); continue; }
    if (quote.length) flush();
    para.push(l.trim());
  }
  flush(); return out.join("\n");
}
const strip = h => h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const read = dir => fs.readdirSync(path.join(SRC, dir)).filter(f => f.endsWith(".md")).sort().map(f => {
  const [d, body] = front(fs.readFileSync(path.join(SRC, dir, f), "utf8"));
  return { ...d, slug: f.replace(/\.md$/, ""), body };
});
const topics = read("topics"), sessions = read("sessions");
topics.forEach(t => { t.tags = t.tags || []; t.facts = t.facts || []; t.html = md(t.body); });
// facts are lines in the body under "## Key facts"
topics.forEach(t => { const m = t.body.match(/## Key facts\n([\s\S]*?)(\n## |$)/); t.facts = m ? m[1].split("\n").filter(l => /^[-*] /.test(l)).map(l => l.replace(/^[-*]\s+/, "")) : []; });
const allTags = [...new Set(topics.flatMap(t => t.tags))].sort();
const bySlug = Object.fromEntries(topics.map(t => [t.slug, t]));
sessions.forEach(s => { s.revisits = s.revisits || []; });
for (const s of sessions) {
  const seen = new Set();
  for (const slug of s.revisits) {
    if (seen.has(slug)) throw new Error(`Session ${s.slug} lists ${slug} twice`);
    seen.add(slug);
    const t = bySlug[slug];
    if (!t) throw new Error(`Session ${s.slug} revisits missing topic ${slug}`);
    if (t.session === s.slug) throw new Error(`Session ${s.slug} revisits ${slug}, which already belongs to that day`);
  }
}
const freshOn = s => topics.filter(t => t.session === s.slug).sort((a, b) => (+a.order || 0) - (+b.order || 0));
const revisitedOn = s => s.revisits.map(slug => bySlug[slug]);
const bySession = s => [...freshOn(s), ...revisitedOn(s)];
const revisitDays = t => sessions.filter(s => s.revisits.includes(t.slug));
const fmtDate = s => new Date(s + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

const page = (title, main, depth = 0) => {
  const r = depth ? "../".repeat(depth) : "./";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} · Faria</title>
<!-- Continuity: https://handoff.jbf.com · source: franzenjb/faria-learning-log -->
<link rel="author" href="https://handoff.jbf.com/?repo=faria-learning-log"><meta name="description" content="Faria: a learning log of lessons, one topic at a time.">
<script>try{const n=Number(localStorage.getItem("faria-reading-scale"));if(n>=85&&n<=150){const s=Math.min(150,Math.max(85,Math.round(n/5)*5));document.documentElement.style.setProperty("--reading-scale",String(s/100))}}catch(e){}</script>
<link rel="stylesheet" href="${r}style.css"><link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>✦</text></svg>">
<script>try{const t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t}catch(e){}</script></head><body>
<header class="bar"><a class="brand" href="${r}">✦ Faria</a><nav><a href="${r}sessions/">Days</a><a href="${r}tags/">Tags</a><a href="${r}review/">Review</a><a href="${r}papers/">Papers</a><a href="${r}decks/">Decks</a><a href="${r}search/">Search</a><button type="button" id="help-btn" class="icon-btn" aria-label="Help">?</button><button type="button" id="theme-btn" class="icon-btn" aria-label="Switch light or dark">◐</button>
<span class="feedback-group" role="group" aria-label="Send feedback"><button type="button" class="feedback-btn feedback-up" data-feedback="up" title="I like it — send a compliment or idea" aria-label="Send positive feedback"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0"/><path d="M9 9.5h.01M15 9.5h.01"/></svg></button><button type="button" class="feedback-btn feedback-down" data-feedback="down" title="I like it, but… — send a gripe" aria-label="Send critical feedback"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8.5 15.5a4.5 4.5 0 0 1 7 0"/><path d="M9 9.5h.01M15 9.5h.01"/></svg></button></span></nav></header>
<div class="text-size-bar"><span class="ts-a ts-a-sm" aria-hidden="true">A</span><label for="reading-size">Text size</label><input id="reading-size" type="range" min="85" max="150" step="5" value="100" aria-valuemin="85" aria-valuemax="150" aria-valuenow="100" aria-valuetext="100 percent"><span class="ts-a ts-a-lg" aria-hidden="true">A</span><output id="reading-size-out" for="reading-size" aria-live="polite">100%</output><button type="button" id="reading-size-reset" aria-label="Reset text size">Reset</button></div>
<dialog id="help"><h2>How to use Faria</h2><p>Each lesson topic has its own page. <b>Days</b> lists each session. A lesson keeps the day it was first written. A later day can open it again, and the page says so. <b>Tags</b> groups topics by subject. <b>Review</b> lists every key fact as one line, good for a quick refresh. <b>Papers</b> lists the downloadable PDFs and plates. <b>Decks</b> opens the interactive presentations. <b>Search</b> looks through the full text of every page.</p><p>At the bottom of each topic you'll find related topics that share a tag.</p><h2>Who was the Abbé Faria?</h2><p>In Dumas's <i>The Count of Monte Cristo</i>, the Abbé Faria is the imprisoned priest who tunnels into Edmond Dantès's cell in the Château d'If and gives him a complete education. This log is named for him: the teacher in the next cell, with every lesson kept to study again.</p>
<form method="dialog"><button>Close</button></form></dialog>
<main>${main}</main><footer>Faria · a learning log</footer>
<script>document.getElementById("help-btn").onclick=()=>document.getElementById("help").showModal();document.getElementById("theme-btn").onclick=()=>{const d=document.documentElement,n=(d.dataset.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"))==="dark"?"light":"dark";d.dataset.theme=n;try{localStorage.setItem("theme",n)}catch(e){}}</script>
<script src="${r}js/text-size.js" defer></script><script src="${r}js/feedback.js" defer></script></body></html>`;
};
const write = (p, html) => { const f = path.join(OUT, p, "index.html"); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); };
const tagLinks = (tags, r) => `<ul class="tags">${tags.map(t => `<li><a href="${r}tags/${t}/">${t}</a></li>`).join("")}</ul>`;
const card = (t, r) => `<li class="card"><a href="${r}topics/${t.slug}/"><strong>${esc(t.title)}</strong><span>${esc(t.summary || "")}</span></a></li>`;

for (const t of topics) {
  const s = sessions.find(x => x.slug === t.session);
  const again = revisitDays(t);
  const related = topics.filter(o => o !== t).map(o => [o, o.tags.filter(x => t.tags.includes(x)).length]).filter(x => x[1]).sort((a, b) => b[1] - a[1]).slice(0, 6).map(x => x[0]);
  const list = s ? freshOn(s) : []; const i = list.indexOf(t);
  const nav = `<nav class="prevnext">${i > 0 ? `<a href="../${list[i - 1].slug}/">← ${esc(list[i - 1].title)}</a>` : "<span></span>"}${i < list.length - 1 ? `<a href="../${list[i + 1].slug}/">${esc(list[i + 1].title)} →</a>` : ""}</nav>`;
  const againHtml = again.length ? `<p class="kicker">Opened again: ${again.map(d => `<a href="../../sessions/${d.slug}/">${fmtDate(d.slug)}</a>`).join(", ")}</p>` : "";
  write(`topics/${t.slug}`, page(t.title, `<article><p class="kicker">${s ? `<a href="../../sessions/${s.slug}/">${fmtDate(s.slug)}</a>` : ""}</p>${againHtml}<h1>${esc(t.title)}</h1>${t.summary ? `<p class="lede">${esc(t.summary)}</p>` : ""}${tagLinks(t.tags, "../../")}${t.html}</article>
${related.length ? `<section class="related"><h2>Related topics</h2><ul class="cards">${related.map(o => card(o, "../../")).join("")}</ul></section>` : ""}${nav}`, 2));
}
// The interactive shares Faria's navigation, theme, text-size controls and feedback.
write("galileo", page("Galileo's Moon Mountains", fs.readFileSync("public/galileo/lesson.html", "utf8"), 1));
const dayLabel = s => {
  const fresh = freshOn(s), again = revisitedOn(s);
  return again.length ? `${fresh.length} new · ${again.length} revisited` : `${fresh.length} topics`;
};
const dayLists = (s, r) => {
  const fresh = freshOn(s), again = revisitedOn(s);
  const freshHtml = fresh.length ? `<h2>New this day</h2><ol class="cards">${fresh.map(t => card(t, r)).join("")}</ol>` : "";
  const againHtml = again.length ? `<h2>Opened again this day</h2><p>These lessons keep the day they were first written. This date records that they were opened again.</p><ol class="cards">${again.map(t => `<li class="card"><a href="${r}topics/${t.slug}/"><strong>${esc(t.title)}</strong><span>First written for ${esc(fmtDate(t.session))}. ${esc(t.summary || "")}</span></a></li>`).join("")}</ol>` : "";
  return freshHtml + againHtml;
};
for (const s of sessions) {
  write(`sessions/${s.slug}`, page(s.title, `<p class="kicker">${fmtDate(s.slug)}</p><h1>${esc(s.title)}</h1>${md(s.body)}${dayLists(s, "../../")}`, 2));
}
write("sessions", page("Days", `<h1>Days</h1><ul class="cards">${[...sessions].reverse().map(s => `<li class="card"><a href="${s.slug}/"><strong>${fmtDate(s.slug)}</strong><span>${esc(s.title)} · ${dayLabel(s)}</span></a></li>`).join("")}</ul>`, 1));
for (const tag of allTags) write(`tags/${tag}`, page(tag, `<p class="kicker">Tag</p><h1>${tag}</h1><ul class="cards">${topics.filter(t => t.tags.includes(tag)).map(t => card(t, "../../")).join("")}</ul>`, 2));
write("tags", page("Tags", `<h1>Tags</h1><ul class="tags big">${allTags.map(t => `<li><a href="${t}/">${t} <small>${topics.filter(x => x.tags.includes(t)).length}</small></a></li>`).join("")}</ul>`, 1));
write("review", page("Review", `<h1>Review</h1><p class="lede">Every key fact, one line each. Tap a topic to reread it.</p>${[...sessions].reverse().map(s => { const rows = freshOn(s).filter(t => t.facts.length); return rows.length ? `<h2>${fmtDate(s.slug)}</h2>${rows.map(t => `<h3><a href="../topics/${t.slug}/">${esc(t.title)}</a></h3><ul class="facts">${t.facts.map(f => `<li>${inline(f)}</li>`).join("")}</ul>`).join("")}` : ""; }).join("")}`, 1));
const papersRaw = fs.readFileSync(path.join(SRC, "papers.md"), "utf8");
const [papersFm, papersBody] = front(papersRaw);
const papersHtml = md(papersBody);
write("papers", page(papersFm.title || "Papers", `<h1>${esc(papersFm.title || "Papers")}</h1>${papersHtml}`, 1));
const searchIndex = topics.map(t => {
  const again = revisitDays(t).map(d => `Opened again on ${fmtDate(d.slug)}.`).join(" ");
  return { u: `topics/${t.slug}/`, t: t.title, s: t.summary || "", g: t.tags, d: t.session, x: strip(`${again} ${t.html}`) };
});
searchIndex.push({ u: "papers/", t: papersFm.title || "Papers", s: papersFm.summary || "", g: [], d: "", x: strip(papersHtml) });
const decksRaw = fs.readFileSync(path.join(SRC, "decks.md"), "utf8");
const [decksFm, decksBody] = front(decksRaw);
const decksHtml = md(decksBody);
write("decks", page(decksFm.title || "Decks", `<h1>${esc(decksFm.title || "Decks")}</h1>${decksHtml}`, 1));
searchIndex.push({ u: "decks/", t: decksFm.title || "Decks", s: decksFm.summary || "", g: [], d: "", x: strip(decksHtml) });
fs.writeFileSync(path.join(OUT, "search-index.json"), JSON.stringify(searchIndex));
write("search", page("Search", `<h1>Search</h1><input id="q" type="search" placeholder="Search every lesson…" autofocus aria-label="Search"><p id="count" class="muted"></p><ul id="results" class="cards"></ul><script src="../js/search.js"></script>`, 1));
const latest = sessions[sessions.length - 1];
write("", page("Home", `<h1 class="hero">Faria</h1><p class="lede">A learning log. Each lesson topic gets its own page, with key facts, pronunciations and drawings, so it can be studied again.</p>
<form class="homesearch" action="search/"><input name="q" type="search" placeholder="Search every lesson…" aria-label="Search"></form>
<p><a href="papers/">Papers</a> lists every downloadable lesson PDF, the supplementary map, and the Picard plate. <a href="decks/">Decks</a> opens the interactive presentations.</p>
${latest ? `<h2>Latest: <a href="sessions/${latest.slug}/">${fmtDate(latest.slug)}</a></h2>${dayLists(latest, "./")}` : ""}
<h2>Browse by tag</h2>${tagLinks(allTags, "./")}`, 0));
fs.writeFileSync(path.join(OUT, "404.html"), page("Not found", `<h1>Not found</h1><p><a href="/">Back home</a></p>`, 0).replace(/(href|src)="\.\//g, '$1="/'));
console.log(`Built ${topics.length} topics, ${sessions.length} sessions, ${allTags.length} tags.`);
