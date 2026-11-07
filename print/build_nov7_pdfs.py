#!/usr/bin/env python3
"""Typeset the 16 new 7 November lessons. Does not touch topic 52 or the thumb PDF."""
import html
import re
import pathlib
from weasyprint import HTML

ROOT = pathlib.Path("/workspace")
OUTDIR = ROOT / "public/downloads"
MAP = {
    "53-captain-james-cook.md": "Captain_James_Cook_Precision_Encounter_and_Empire_Faria_Lesson_2026-11-07.pdf",
    "54-joseph-banks-botanist.md": "Joseph_Banks_Botanist_Collections_and_Empire_Faria_Lesson_2026-11-07.pdf",
    "55-venus-transits-1761-1769.md": "Venus_Transits_1761_1769_Parallax_and_Expedition_Risks_Faria_Lesson_2026-11-07.pdf",
    "56-charles-mason.md": "Charles_Mason_Astronomer_Transit_Observer_and_Surveyor_Faria_Lesson_2026-11-07.pdf",
    "57-jeremiah-dixon.md": "Jeremiah_Dixon_Surveyor_Observer_and_Partner_Faria_Lesson_2026-11-07.pdf",
    "58-mason-dixon-survey.md": "Mason_Dixon_Survey_Geometry_Corrections_and_Indigenous_Limits_Faria_Lesson_2026-11-07.pdf",
    "59-ships-of-exploration.md": "Ships_of_Exploration_Endeavour_Bounty_Seahorse_and_Blighs_Launch_Faria_Lesson_2026-11-07.pdf",
    "60-bounty-mutiny-bligh-pitcairn.md": "Bounty_Mutiny_Bligh_Tofua_and_Pitcairns_Families_Faria_Lesson_2026-11-07.pdf",
    "61-breadfruit-and-empire.md": "Breadfruit_Botany_Transport_and_Caribbean_Plantation_Slavery_Faria_Lesson_2026-11-07.pdf",
    "62-aristarchus-of-samos.md": "Aristarchus_of_Samos_Heliocentrism_Lunar_Eclipses_and_Distance_Faria_Lesson_2026-11-07.pdf",
    "63-hipparchus-lunar-parallax.md": "Hipparchus_Lunar_Parallax_Eclipse_Reports_and_Uncertainty_Faria_Lesson_2026-11-07.pdf",
    "64-galileo-jupiters-moons.md": "Galileo_Jupiters_Moons_Medicean_Stars_Marius_and_Kepler_Faria_Lesson_2026-11-07.pdf",
    "65-romer-io-speed-of-light.md": "Romer_Io_Eclipses_Finite_Light_and_Huygens_Speed_Faria_Lesson_2026-11-07.pdf",
    "66-kepler-mars-triangulation-and-scale.md": "Kepler_Mars_Triangulation_True_Scale_and_Exaggeration_Faria_Lesson_2026-11-07.pdf",
    "67-jos-a-bank-american-clothier.md": "Jos_A_Bank_American_Clothier_Baltimore_and_Ownership_Faria_Lesson_2026-11-07.pdf",
    "68-hartz-versus-hart-schaffner-marx.md": "Hartz_Versus_Hart_Schaffner_Marx_Evidence_and_Family_Claims_Faria_Lesson_2026-11-07.pdf",
}

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
        return f'<a href="{esc(href)}">{label}</a>'
    return re.sub(r"\[([^\]]+)\]\(([^)]+)\)", link, s)

def blocks_of(body):
    blocks = []
    lines = body.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue
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
        if re.match(r"^\d+\. ", line):
            items = []
            while i < len(lines) and re.match(r"^\d+\. ", lines[i]):
                items.append(re.sub(r"^\d+\. ", "", lines[i]).strip()); i += 1
            blocks.append(("ol", items)); continue
        para = [line.strip()]; i += 1
        while i < len(lines) and lines[i].strip() and not re.match(r"^(## |[-*] |\d+\. |!\[|\|)", lines[i]):
            para.append(lines[i].strip()); i += 1
        blocks.append(("p", " ".join(para)))
    return blocks

def render(md_name, pdf_name):
    text = (ROOT / "content/topics" / md_name).read_text(encoding="utf-8")
    fm = re.match(r"^---\n(.*?)\n---\n", text, flags=re.S)
    title = "Faria"
    for line in fm.group(1).splitlines():
        if line.startswith("title:"):
            title = line.split(":", 1)[1].strip().strip('"')
    body = text[fm.end():]
    parts = []
    for kind, data in blocks_of(body):
        if kind == "h2":
            parts.append(f"<h2>{inline(data)}</h2>")
        elif kind == "p":
            if data.startswith("*") and data.endswith("*") and data.count("*") == 2:
                parts.append(f'<p class="cap">{inline(data.strip("*"))}</p>')
            else:
                parts.append(f"<p>{inline(data)}</p>")
        elif kind == "ul":
            parts.append("<ul>" + "".join(f"<li>{inline(x)}</li>" for x in data) + "</ul>")
        elif kind == "ol":
            parts.append("<ol>" + "".join(f"<li>{inline(x)}</li>" for x in data) + "</ol>")
        elif kind == "img":
            alt, src = data
            name = src.split("/")[-1].split("?")[0]
            svg = (ROOT / "public/img" / name).read_text(encoding="utf-8")
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
            body_rows = "".join("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in cells(r)) + "</tr>" for r in rest)
            parts.append(f"<table><thead><tr>{thead}</tr></thead><tbody>{body_rows}</tbody></table>")
    doc = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{esc(title)}</title>
<style>
@page {{
  size: letter;
  margin: 0.72in 0.68in 0.55in 0.68in;
  @top-left {{ content: "Faria  ·  7 November 2026"; font-family: "Liberation Sans", sans-serif; font-size: 8pt; color: #8c3f1e; }}
  @top-right {{ content: counter(page); font-family: "Liberation Sans", sans-serif; font-size: 8pt; color: #5e584e; }}
}}
body {{ font-family: "Liberation Serif", Georgia, serif; font-size: 12.5pt; line-height: 1.52; color: #1c1915; hyphens: manual; }}
h1 {{ font-size: 22pt; font-weight: normal; line-height: 1.15; margin: 0 0 0.16in; }}
h2 {{ font-size: 15.5pt; font-weight: normal; margin: 0.24in 0 0.1in; break-after: avoid; }}
p {{ margin: 0 0 0.12in; }}
ul, ol {{ margin: 0.04in 0 0.1in; padding-left: 0.22in; }}
li {{ margin: 0.06in 0; }}
a {{ color: #8c3f1e; text-decoration: none; }}
figure {{ margin: 0.08in 0 0.04in; break-inside: avoid; }}
figure svg {{ width: 100%; height: auto; max-height: 3.05in; display: block; }}
p.cap {{ font-family: "Liberation Sans", sans-serif; font-size: 8.5pt; line-height: 1.35; color: #5e584e; margin: 0 0 0.1in; }}
.kicker {{ font-family: "Liberation Sans", sans-serif; font-size: 8.5pt; letter-spacing: 0.12em; text-transform: uppercase; color: #8c3f1e; margin: 0 0 0.08in; }}
</style></head><body>
<p class="kicker">Faria · 7 November 2026 · a lesson for Jeff Franzen</p>
<h1>{esc(title)}</h1>
{''.join(parts)}
</body></html>"""
    dest = OUTDIR / pdf_name
    HTML(string=doc, base_url=str(ROOT)).write_pdf(str(dest))
    print(pdf_name, dest.stat().st_size)

def ensure_download_links():
    for md_name, pdf_name in MAP.items():
        path = ROOT / "content/topics" / md_name
        text = path.read_text(encoding="utf-8")
        if pdf_name in text:
            continue
        link = f"\nThe illustrated lesson is [download the PDF](/downloads/{pdf_name}).\n"
        if "\n## Sources\n" in text:
            text = text.replace("\n## Sources\n", link + "\n## Sources\n", 1)
        else:
            text = text.rstrip() + "\n" + link
        path.write_text(text, encoding="utf-8")
        print("linked", md_name)

if __name__ == "__main__":
    ensure_download_links()
    for md_name, pdf_name in MAP.items():
        render(md_name, pdf_name)
