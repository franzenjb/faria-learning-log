// Public build of the "Where Am I?" talk for https://longitude.jbf.com
// Runs in the separate Vercel project "longitude-talk" (Root Directory: longitude/).
// It copies ONLY the deck (public/claude1/v3) and the assets it needs into
// longitude/dist, puts the deck at "/", and scrubs every link or name that
// points back to the private site. The source files are never modified.
// Build fails (and the last good deploy stays live) if a private path leaks.
import fs from "node:fs"; import path from "node:path"; import { fileURLToPath } from "node:url";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const PUB = path.join(HERE, "..", "public"), C1 = path.join(PUB, "claude1"), V3 = path.join(C1, "v3");
const FILM = path.join(PUB, "faria1", "where-am-i", "v3");
const OUT = path.join(HERE, "dist");
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const skip = n => /(^|\/)README\.md$|\.DS_Store$/.test(n);
const cp = (src, dst, filter = () => true) => fs.cpSync(src, path.join(OUT, dst), { recursive: true, filter: s => !skip(s) && filter(s) });

// 1. the deck and the assets it loads (paths resolve against <base href="/">)
cp(V3, "v3", s => s !== path.join(V3, "index.html"));      // v3/*.js, course.css, img/, audio/
cp(path.join(C1, "img"), "img");                              // img/… used by older scenes and the gallery
// the Gaia sky map the older Gaia scene loads as img/… (on the private site it lives in /img/)
fs.copyFileSync(path.join(PUB, "img", "Gaia_EDR3_All_Sky_Colour_Map_ESA_Gaia_DPAC.jpg"), path.join(OUT, "img", "Gaia_EDR3_All_Sky_Colour_Map_ESA_Gaia_DPAC.jpg"));
// (img/ck-1.jpg, md-1.jpg, sw-1.jpg are optional photo probes: a 404 there is expected and harmless)
for (const f of ["coast.js", "coast2.js"]) cp(path.join(C1, f), f);
// the WebGL storm film used inside the cold open (slide 0), minus its preview video
cp(FILM, "film", s => !/\.mp4$/i.test(s) && !s.startsWith(path.join(FILM, "video")));
// the "France got smaller" plate
fs.mkdirSync(path.join(OUT, "assets"), { recursive: true });
fs.copyFileSync(path.join(PUB, "faria1", "where-am-i", "v2", "img", "carte2.jpg"), path.join(OUT, "assets", "carte2.jpg"));
fs.copyFileSync(path.join(V3, "index.html"), path.join(OUT, "index.html"));

// 2. targeted rewrites in the build copy only. Missing patterns only warn;
//    the leak scan below is what guarantees nothing private gets out.
const warn = []; const edit = (rel, pairs) => {
  const f = path.join(OUT, rel); let s = fs.readFileSync(f, "utf8");
  for (const [a, b] of pairs) { const hit = typeof a === "string" ? s.includes(a) : a.test(s); if (!hit) warn.push(`${rel}: pattern not found: ${a}`); s = typeof a === "string" ? s.split(a).join(b) : s.replace(a, b); }
  fs.writeFileSync(f, s);
};
edit("index.html", [
  ['<base href="/claude1/">', '<base href="/">'],
  [/<p class="vlink"><a href="v2\/">Version 2<\/a><\/p>/, ""],
  ["Faria · An interactive lecture", "An interactive lecture"],
  ['href="/polaris/"', 'href="#nolink"'],
  ["public/deck/img/", "img/"],
  [/the Faria lesson of/g, "the lesson of"],
  ["location.href=(op&&!op.closed)?'about:blank':'/deck/'", "location.href=(op&&!op.closed)?'about:blank':'/'"],
  ["location.href='/deck/#'+li.dataset.i", "location.href='#'+li.dataset.i"],
  ["'faria-presenter'", "'talk-presenter'"],
  ["</head>", "<style>/* public build: no private topic pages or lesson PDFs */#rside,#topicview,#more-btn,#more-panel{display:none!important}</style>\n</head>"],
]);
edit("v3/course.js", [
  [/const PDF_DIR = [^\n]*/, "const PDF_DIR = '';"],
  [/const PDFS = \{[\s\S]*?\n\};/, "const PDFS = {};"],
  [/const SLIDE_PDFS = \{[\s\S]*?\n\};/, "const SLIDE_PDFS = {};"],
  [/const TOPICS = \{[\s\S]*?\n\};/, "const TOPICS = {};"],
  ["`/topics/${slug}/`", "'about:blank'"],
  ["/claude1/v3/?talk=30", "/?talk=30"],
  [/lesson PDFs in \/downloads\//, "lesson PDFs"],
]);
edit("v3/course-slides-v3.js", [
  ['src="../../faria1/where-am-i/v3/"', 'src="film/"'],
  ["(/faria1/where-am-i/v3/)", "(film/)"],
  ['a[href="/polaris/"]', 'a[href="#nolink"]'],
]);
edit("v3/course-slides-v3-appx.js", [["'/faria1/where-am-i/v2/img/carte2.jpg'", "'assets/carte2.jpg'"]]);
edit("v3/course.css", [["for /claude1/.", "for the talk."]]);

// 3. leak scan: any remaining path into the private site fails the build
const TEXT = /\.(html|js|css|json|txt|md)$/i;
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = walk(OUT).filter(f => TEXT.test(f));
// film/data/*.js are base64 textures and map data: random letters can spell a name, so they get the path scan only
const BLOB = f => f.startsWith(path.join(OUT, "film", "data") + path.sep);
const PATHS = /(\.\.\/\.\.\/|\/(faria\d*|kimi\d*|claude\d*|deck|sessions|topics|downloads|polaris)\/|faria\.jbf\.com|kimi1\/|claude1\/|faria1\/)/i;
const leaks = [];
for (const f of files) {
  let s = fs.readFileSync(f, "utf8");
  s.split("\n").forEach((l, i) => { const m = l.match(PATHS); if (m) leaks.push(`${path.relative(OUT, f)}:${i + 1}: ${m[0]}`); });
  if (BLOB(f)) continue;
  // remaining bare names live only in code comments (draft provenance notes): neutralize them
  const t = s.replace(/\b(?:faria|kimi|claude)(?:\d+|\*)?(?:\/(?:kimi|claude|faria)\d*)?(?:'s)?/gi, "draft");
  if (t !== s) fs.writeFileSync(f, t);
}
for (const f of files.filter(f => !BLOB(f))) { const s = fs.readFileSync(f, "utf8"); s.split("\n").forEach((l, i) => { if (/faria|kimi|claude/i.test(l)) leaks.push(`${path.relative(OUT, f)}:${i + 1}: name`); }); }
if (warn.length) console.warn("longitude build warnings:\n  " + warn.join("\n  "));
if (leaks.length) { console.error("longitude build: private references left in output:\n  " + leaks.slice(0, 50).join("\n  ")); process.exit(1); }
const n = walk(OUT).length; console.log(`longitude build: ${n} files in ${path.relative(process.cwd(), OUT) || "dist"}, no private references`);
