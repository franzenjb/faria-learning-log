#!/usr/bin/env python3
"""Typeset a lesson markdown file into the shared Faria print style.

Cream page, serif type, rust headings. The running header carries
faria.jbf.com and the footer carries jbf@jbf.com. No green or teal headings.
"""
import html
import re
import sys
import pathlib
from weasyprint import HTML

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUTDIR = ROOT / "public" / "downloads"
CSS = """
@page {
  size: letter;
  margin: 0.62in 0.66in 0.58in 0.66in;
  background: #fbf8f2;
  @top-left {
    content: "Faria  ·  faria.jbf.com";
    font-family: "Liberation Serif", Georgia, serif;
    font-size: 9pt;
    color: #7a4b1e;
  }
  @top-right {
    content: "jbf@jbf.com";
    font-family: "Liberation Serif", Georgia, serif;
    font-size: 9pt;
    color: #7a4b1e;
  }
  @bottom-left {
    content: "A lesson from faria.jbf.com";
    font-family: "Liberation Serif", Georgia, serif;
    font-size: 8.5pt;
    color: #6b645a;
  }
  @bottom-right {
    content: counter(page) " / " counter(pages);
    font-family: "Liberation Serif", Georgia, serif;
    font-size: 8.5pt;
    color: #6b645a;
  }
}
html, body { background: #fbf8f2; }
body {
  font-family: "Liberation Serif", Georgia, serif;
  font-size: 11.5pt;
  line-height: 1.42;
  color: #22201c;
}
h1 {
  font-family: "Liberation Serif", Georgia, serif;
  font-weight: normal;
  font-size: 22pt;
  line-height: 1.15;
  color: #7a4b1e;
  margin: 0 0 0.12in;
}
h2 {
  font-family: "Liberation Serif", Georgia, serif;
  font-weight: normal;
  font-size: 15pt;
  line-height: 1.25;
  color: #7a4b1e;
  margin: 0.16in 0 0.05in;
  break-after: avoid;
}
h3 {
  font-family: "Liberation Serif", Georgia, serif;
  font-weight: normal;
  font-size: 13pt;
  color: #7a4b1e;
  margin: 0.12in 0 0.04in;
  break-after: avoid;
}
p { margin: 0 0 0.08in; }
ul, ol { margin: 0.04in 0 0.12in; padding-left: 0.22in; }
li { margin: 0.04in 0; }
a { color: #7a4b1e; text-decoration: none; }
.kicker {
  font-family: "Liberation Serif", Georgia, serif;
  font-size: 10pt;
  color: #6b645a;
  margin: 0 0 0.08in;
}
figure { margin: 0.06in 0 0.02in; break-inside: avoid; }
figure svg { width: 100%; height: auto; max-height: 4.15in; display: block; }
p.cap {
  font-family: "Liberation Serif", Georgia, serif;
  font-size: 9pt;
  line-height: 1.3;
  color: #6b645a;
  margin: 0 0 0.08in;
  break-before: avoid;
}
table { border-collapse: collapse; width: 100%; margin: 0.08in 0 0.14in; font-size: 10.5pt; break-inside: avoid; }
th, td { border-bottom: 0.4pt solid #e6dfd2; text-align: left; padding: 0.04in 0.06in; vertical-align: top; }
th { color: #7a4b1e; font-weight: normal; }
"""

def esc(s):
    return html.escape(s, quote=True)

def inline(s):
    s = esc(s)
    s = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<em>\1</em>", s)
    def link(m):
        label, href = m.group(1), m.group(2)
        if href.startswith("/"):
            href = "https://faria.jbf.com" + href
        elif href.startswith("../../"):
            href = "https://faria.jbf.com/" + href.split("../../", 1)[1]
        return f'<a href="{esc(href)}">{label}</a>'
    return re.sub(r"\[([^\]]+)\]\(([^)]+)\)", link, s)

def blocks_of(body):
    blocks, lines, i = [], body.split("\n"), 0
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue
        if line.startswith("### "):
            blocks.append(("h3", line[4:].strip())); i += 1; continue
        if line.startswith("## "):
            blocks.append(("h2", line[3:].strip())); i += 1; continue
        m = re.match(r"^!\[([^\]]*)\]\(([^)]+)\)\s*$", line)
        if m:
            blocks.append(("img", (m.group(1), m.group(2)))); i += 1; continue
        if line.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                rows.append(lines[i].strip()); i += 1
            blocks.append(("table", rows)); continue
        if re.match(r"^[-*] ", line):
            items = []
            while i < len(lines) and re.match(r"^[-*] ", lines[i]):
                items.append(lines[i][2:].strip()); i += 1
            blocks.append(("ul", items)); continue
        para, i = [line.strip()], i + 1
        while i < len(lines) and lines[i].strip() and not re.match(r"^(## |[-*] |\d+\. |!\[|\|)", lines[i]):
            para.append(lines[i].strip()); i += 1
        blocks.append(("p", " ".join(para)))
    return blocks

def render(md_name, pdf_name, topic_url):
    text = (ROOT / "content" / "topics" / md_name).read_text(encoding="utf-8")
    fm = re.match(r"^---\n(.*?)\n---\n", text, flags=re.S)
    title = "Faria"
    for line in fm.group(1).splitlines():
        if line.startswith("title:"):
            title = line.split(":", 1)[1].strip().strip('"')
    parts = []
    for kind, data in blocks_of(text[fm.end():]):
        if kind == "h2":
            parts.append(f"<h2>{inline(data)}</h2>")
        elif kind == "h3":
            parts.append(f"<h3>{inline(data)}</h3>")
        elif kind == "p":
            if data.startswith("*") and data.endswith("*") and data.count("*") == 2:
                parts.append(f'<p class="cap">{inline(data.strip("*"))}</p>')
            else:
                parts.append(f"<p>{inline(data)}</p>")
        elif kind == "ul":
            parts.append("<ul>" + "".join(f"<li>{inline(x)}</li>" for x in data) + "</ul>")
        elif kind == "img":
            alt, src = data
            name = src.split("/")[-1].split("?")[0]
            raw = (ROOT / "public" / "img" / name).read_bytes()
            try:
                svg = raw.decode("utf-8")
            except UnicodeDecodeError:
                svg = raw.decode("latin-1")
            svg = re.sub(r"<\?xml[^>]*>\s*", "", svg)
            parts.append(f"<figure>{svg}</figure>")
            if alt:
                parts.append(f'<p class="cap">{esc(alt)}</p>')
        elif kind == "table":
            rows = [r for r in data if not re.match(r"^\|?\s*:?-{2,}", r)]
            def cells(r):
                return [c.strip() for c in r.strip().strip("|").split("|")]
            head, *rest = rows
            thead = "".join(f"<th>{inline(c)}</th>" for c in cells(head))
            body = "".join("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in cells(r)) + "</tr>" for r in rest)
            parts.append(f"<table><thead><tr>{thead}</tr></thead><tbody>{body}</tbody></table>")
    doc = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{esc(title)}</title>
<style>{CSS}</style></head><body>
<p class="kicker">faria.jbf.com · jbf@jbf.com · <a href="{esc(topic_url)}">{esc(topic_url)}</a></p>
<h1>{esc(title)}</h1>
{''.join(parts)}
</body></html>"""
    dest = OUTDIR / pdf_name
    HTML(string=doc, base_url=str(ROOT)).write_pdf(str(dest))
    print(pdf_name, dest.stat().st_size)

JOBS = [
    ("75-six-ways-numbers-grow.md", "Growth_Rates_Compared.pdf",
     "https://faria.jbf.com/topics/75-six-ways-numbers-grow/"),
    ("63-hipparchus-lunar-parallax.md",
     "Hipparchus_Lunar_Parallax_Eclipse_Reports_and_Uncertainty_Faria_Lesson_2026-11-07.pdf",
     "https://faria.jbf.com/topics/63-hipparchus-lunar-parallax/"),
    ("77-ladder-sine-cosine-and-tangent.md",
     "Trigonometry_Sine_Cosine_Tangent_Ladder_and_Galileos_Moon_Faria_2026-11-08.pdf",
     "https://faria.jbf.com/topics/77-ladder-sine-cosine-and-tangent/"),
    ("78-mathematics-one-idea-at-a-time.md",
     "Master_Mathematics_Algebra_Geometry_Trigonometry_Calculus_Faria_2026-11-08.pdf",
     "https://faria.jbf.com/topics/78-mathematics-one-idea-at-a-time/"),
]

if __name__ == "__main__":
    for job in JOBS:
        render(*job)
