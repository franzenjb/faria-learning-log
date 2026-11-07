#!/usr/bin/env python3
"""Honest side-by-side Mars ellipse: real shape vs the exaggerated teaching sheet."""
from pathlib import Path

# Drawing: Mars semimajor axis = 150 px in BOTH panels.
A = 150.0

def panel(ox, title, e, earth_over_a, near_au, far_au, note):
    b = A * (1 - e * e) ** 0.5
    c = A * e
    # ellipse center
    cx, cy = ox + 210, 250
    # perihelion to the right; sun at focus, right of center by c
    sunx = cx + c
    earth_r = A * earth_over_a
    parts = []
    parts.append(f'<text x="{ox+16}" y="36" font-size="18">{title}</text>')
    parts.append(
        f'<ellipse cx="{cx:.1f}" cy="{cy}" rx="{A:.1f}" ry="{b:.1f}" '
        f'fill="none" stroke="#6f675c" stroke-width="1.6"/>'
    )
    # major axis
    parts.append(
        f'<line x1="{cx-A:.1f}" y1="{cy}" x2="{cx+A:.1f}" y2="{cy}" '
        f'stroke="#d9d0c2" stroke-width="1"/>'
    )
    # earth orbit around the sun
    parts.append(
        f'<circle cx="{sunx:.1f}" cy="{cy}" r="{earth_r:.1f}" '
        f'fill="none" stroke="#8c3f1e" stroke-width="1.8"/>'
    )
    parts.append(f'<circle cx="{sunx:.1f}" cy="{cy}" r="5" fill="#8c3f1e"/>')
    parts.append(f'<text x="{sunx+8:.1f}" y="{cy-8:.1f}" class="a" font-size="14">Sun</text>')
    # symbolic markers, same pixel size in both panels, NOT physical diameters
    parts.append(f'<circle cx="{sunx+earth_r:.1f}" cy="{cy}" r="6" fill="#8c3f1e"/>')
    parts.append(f'<text x="{sunx+earth_r+8:.1f}" y="{cy-10:.1f}" class="a" font-size="13">Earth</text>')
    parts.append(f'<circle cx="{cx+A:.1f}" cy="{cy}" r="5.5" fill="#1c1915"/>')
    parts.append(f'<text x="{cx+A-36:.1f}" y="{cy-b-8:.1f}" font-size="13">Mars</text>')
    parts.append(f'<text x="{ox+16}" y="78" class="m" font-size="14">e = {e:.3f}</text>')
    parts.append(
        f'<text x="{ox+16}" y="98" class="m" font-size="14">'
        f'Earth orbit / Mars a = {earth_over_a:.3f}</text>'
    )
    parts.append(
        f'<text x="{ox+16}" y="412" class="m" font-size="14">'
        f'near {near_au:.2f} AU, far {far_au:.2f} AU</text>'
    )
    parts.append(f'<text x="{ox+16}" y="432" class="m" font-size="14">{note}</text>')
    return "\n".join(parts)

svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 490" role="img">
  <title>Mars orbit, real shape beside the exaggerated teaching ellipse</title>
  <desc>Two panels share the same Mars semimajor axis. The left ellipse uses Mars's real eccentricity and a true Earth orbit. The right ellipse is the exaggerated early lesson, with the Sun still at the focus. Dots are labels, not the planets' physical sizes.</desc>
  <rect width="980" height="490" fill="#fbf8f2"/>
  <style>
    text {{ font-family: "Palatino Linotype", Palatino, "Liberation Serif", Georgia, serif; fill: #1c1915; }}
    .m {{ fill: #5e584e; }}
    .a {{ fill: #8c3f1e; }}
  </style>
  <text x="16" y="468" font-size="14" class="m">Both panels share one Mars semimajor axis. The dots are labels, not diameters.</text>
  {panel(0, "Real Mars", 0.093, 1/1.523679, 1.381, 1.666, "Sun offset about 0.14 AU")}
  <line x1="490" y1="50" x2="490" y2="470" stroke="#d9d0c2" stroke-width="1"/>
  {panel(490, "Exaggerated lesson", 0.592, 66/247, 1.53, 5.96, "Sun offset about 2.2 Earth-radii")}
</svg>
'''
out = Path("/workspace/public/img/Kepler_Mars_Real_vs_Exaggerated_Ellipse_Tufte.svg")
out.write_text(svg, encoding="utf-8")
print("wrote", out, "bytes", out.stat().st_size)
