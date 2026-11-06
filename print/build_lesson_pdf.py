#!/usr/bin/env python3
"""Typeset topic 52 into a print HTML file. ASCII-only source; UTF-8 output."""
import html
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[1]
MD = ROOT / "content/topics/52-venus-transit-to-cepheid-distances.md"
OUT = ROOT / "print/venus-transit-cepheid-lesson.html"

text = MD.read_text(encoding="utf-8")
body = re.sub(r"^---\n.*?\n---\n", "", text, count=1, flags=re.S)

def esc(s):
    return html.escape(s, quote=True)

def inline(s):
    s = esc(s)
    s = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<em>\1</em>", s)
    def link(m):
        label, href = m.group(1), m.group(2)
        if href.startswith("/topics/"):
            href = "https://faria.jbf.com" + href
        elif href.startswith("/downloads/"):
            href = "https://faria.jbf.com" + href
        return f'<a href="{esc(href)}">{label}</a>'
    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", link, s)
    return s

blocks = []
lines = body.split("\n")
i = 0
while i < len(lines):
    line = lines[i]
    if not line.strip():
        i += 1
        continue
    if line.startswith("### "):
        blocks.append(("h3", line[4:].strip()))
        i += 1
        continue
    if line.startswith("## "):
        blocks.append(("h2", line[3:].strip()))
        i += 1
        continue
    if line.startswith("> "):
        q = []
        while i < len(lines) and lines[i].startswith("> "):
            q.append(lines[i][2:].strip())
            i += 1
        blocks.append(("quote", " ".join(q)))
        continue
    if line.startswith("|"):
        rows = []
        while i < len(lines) and lines[i].strip().startswith("|"):
            rows.append(lines[i].strip())
            i += 1
        blocks.append(("table", rows))
        continue
    m = re.match(r"^!\[([^\]]*)\]\(([^)]+)\)\s*$", line)
    if m:
        blocks.append(("img", (m.group(1), m.group(2))))
        i += 1
        continue
    if re.match(r"^[-*] ", line):
        items = []
        while i < len(lines) and re.match(r"^[-*] ", lines[i]):
            item = lines[i][2:].strip()
            i += 1
            while i < len(lines) and lines[i].startswith("  "):
                item += " " + lines[i].strip()
                i += 1
            items.append(item)
        blocks.append(("ul", items))
        continue
    if re.match(r"^\d+\. ", line):
        items = []
        while i < len(lines) and re.match(r"^\d+\. ", lines[i]):
            item = re.sub(r"^\d+\. ", "", lines[i]).strip()
            i += 1
            while i < len(lines) and lines[i].startswith("  "):
                item += " " + lines[i].strip()
                i += 1
            items.append(item)
        blocks.append(("ol", items))
        continue
    para = [line.strip()]
    i += 1
    while i < len(lines) and lines[i].strip() and not re.match(r"^(#{2,4} |> |\| |[-*] |\d+\. |!\[)", lines[i]):
        para.append(lines[i].strip())
        i += 1
    blocks.append(("p", " ".join(para)))

parts = []
for kind, data in blocks:
    if kind == "h2":
        parts.append(f"<h2>{inline(data)}</h2>")
    elif kind == "h3":
        parts.append(f"<h3>{inline(data)}</h3>")
    elif kind == "p":
        # a caption is a paragraph that is entirely italic
        if data.startswith("*") and data.endswith("*") and data.count("*") == 2:
            parts.append(f'<p class="cap">{inline(data.strip("*"))}</p>')
        else:
            parts.append(f"<p>{inline(data)}</p>")
    elif kind == "quote":
        parts.append(f"<blockquote><p>{inline(data)}</p></blockquote>")
    elif kind == "ul":
        parts.append("<ul>" + "".join(f"<li>{inline(x)}</li>" for x in data) + "</ul>")
    elif kind == "ol":
        parts.append("<ol>" + "".join(f"<li>{inline(x)}</li>" for x in data) + "</ol>")
    elif kind == "img":
        alt, src = data
        name = src.split("/")[-1].split("?")[0]
        svg = (ROOT / "public/img" / name).read_text(encoding="utf-8")
        svg = re.sub(r"<\?xml[^>]*>\s*", "", svg)
        parts.append(f'<figure>{svg}<figcaption class="sr">{esc(alt)}</figcaption></figure>')
    elif kind == "table":
        rows = [r for r in data if not re.match(r"^\|?\s*:?-{2,}", r)]
        def cells(r):
            return [c.strip() for c in r.strip().strip("|").split("|")]
        head, *rest = rows
        thead = "".join(f"<th>{inline(c)}</th>" for c in cells(head))
        body_rows = "".join(
            "<tr>" + "".join(f"<td>{inline(c)}</td>" for c in cells(r)) + "</tr>" for r in rest
        )
        parts.append(f"<table><thead><tr>{thead}</tr></thead><tbody>{body_rows}</tbody></table>")

html_doc = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>From a Venus transit to the Cepheids</title>
<style>
  @page {{
    size: letter;
    margin: 0.78in 0.72in 0.7in 0.72in;
    @top-left {{
      content: "Faria  ·  From a Venus transit to the Cepheids";
      font-family: "Liberation Sans", sans-serif;
      font-size: 8pt;
      color: #8c3f1e;
    }}
    @top-right {{
      content: counter(page);
      font-family: "Liberation Sans", sans-serif;
      font-size: 8pt;
      color: #5e584e;
    }}
  }}
  * {{ box-sizing: border-box; }}
  html, body {{ margin: 0; padding: 0; }}
  body {{
    font-family: "Liberation Serif", "Palatino Linotype", Palatino, Georgia, serif;
    font-size: 11pt;
    line-height: 1.45;
    color: #1c1915;
    background: white;
    hyphens: manual;
  }}
  .sheet {{ width: 100%; }}
  header.top h1 {{
    font-size: 22pt;
    line-height: 1.15;
    font-weight: normal;
    margin: 0 0 0.15in;
    letter-spacing: -0.01em;
  }}
  .kicker {{
    font-family: "Liberation Sans", sans-serif;
    font-size: 8.5pt;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #8c3f1e;
    margin: 0 0 0.12in;
  }}
  .deck {{
    font-size: 12pt;
    line-height: 1.4;
    color: #3a342c;
    margin: 0 0 0.2in;
  }}
  h2 {{
    font-size: 14.5pt;
    font-weight: normal;
    line-height: 1.25;
    margin: 0.28in 0 0.08in;
    page-break-after: avoid;
    break-after: avoid;
  }}
  h3 {{
    font-size: 12pt;
    font-weight: normal;
    margin: 0.18in 0 0.06in;
    page-break-after: avoid;
  }}
  p {{ margin: 0 0 0.09in; hyphens: auto; }}
  ul, ol {{ margin: 0.06in 0 0.12in; padding-left: 0.22in; }}
  li {{ margin: 0.03in 0; }}
  blockquote {{
    margin: 0.12in 0 0.12in 0;
    padding: 0.02in 0 0.02in 0.14in;
    border-left: 2px solid #8c3f1e;
    color: #1c1915;
    page-break-inside: avoid;
  }}
  blockquote p {{ margin: 0; }}
  a {{ color: #8c3f1e; text-decoration: none; }}
  table {{
    width: 100%;
    border-collapse: collapse;
    margin: 0.1in 0 0.14in;
    font-size: 9.5pt;
    line-height: 1.35;
    page-break-inside: avoid;
  }}
  th {{
    text-align: left;
    font-weight: normal;
    border-bottom: 1px solid #1c1915;
    padding: 0.04in 0.08in 0.04in 0;
    vertical-align: bottom;
  }}
  td {{
    border-bottom: 0.5px solid #d9d0c2;
    padding: 0.035in 0.08in 0.035in 0;
    vertical-align: top;
  }}
  figure {{
    margin: 0.12in 0 0.14in;
    page-break-inside: avoid;
    break-inside: avoid;
  }}
  figure svg {{ width: 100%; height: auto; display: block; }}
  .sr {{ position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }}
  p.cap {{
    font-family: "Liberation Sans", sans-serif;
    font-size: 8.5pt;
    line-height: 1.35;
    color: #5e584e;
    margin: -0.08in 0 0.14in;
  }}
  strong {{ font-weight: 600; }}
</style>
</head>
<body>
<main>
  <p class="kicker">Faria &nbsp;&middot;&nbsp; 6 November 2026 &nbsp;&middot;&nbsp; a lesson for Jeff Franzen</p>
  <header class="top">
    <h1>From a Venus transit to the Cepheids</h1>
    <p class="deck">How a clock in the planets, a clock on Earth, a baseline the size of our orbit, and a clock inside a star came to measure distance.</p>
  </header>
  {''.join(parts)}
  <p class="cap">Faria learning log, faria.jbf.com. Lesson dated 6 November 2026. Diagrams drawn for this lesson. The 23 arcseconds is the one-radius illustration, not a ceiling and not a 1769 measurement.</p>
</main>
</body>
</html>
"""
OUT.write_text(html_doc, encoding="utf-8")
print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")
