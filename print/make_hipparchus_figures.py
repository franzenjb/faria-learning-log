#!/usr/bin/env python3
"""Instructional diagrams for the Hipparchus lesson. Angles are drawn large on purpose."""
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public" / "img"
CREAM, INK, MUTED, ACCENT = "#fbf8f2", "#22201c", "#6b645a", "#7a4b1e"
FONT = "Georgia, 'Iowan Old Style', Palatino, 'Palatino Linotype', serif"

def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def doc(w, h, title, desc, body):
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-labelledby="t d">
<title id="t">{esc(title)}</title>
<desc id="d">{esc(desc)}</desc>
<rect width="{w}" height="{h}" fill="{CREAM}"/>
<style>text {{ font-family: {FONT}; fill: {INK}; }}</style>
{body}
</svg>
'''

def T(x, y, s, size=18, fill=INK, anchor="start"):
    return f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" text-anchor="{anchor}">{esc(s)}</text>'

def L(x1, y1, x2, y2, stroke=INK, w=1.6):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{stroke}" stroke-width="{w}" stroke-linecap="round"/>'

def C(x, y, r, fill=ACCENT):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}"/>'

def finger():
    body = "\n".join([
        T(24, 36, "The finger stays still", 28),
        T(24, 64, "Only the eye moved. The wall is far.", 16, MUTED),
        L(50, 110, 430, 110, "#e6dfd2", 8),
        T(240, 98, "Far wall", 16, MUTED, "middle"),
        C(140, 110, 6, ACCENT),
        C(340, 110, 6, INK),
        T(140, 148, "Right eye's mark", 14, ACCENT, "middle"),
        T(340, 148, "Left eye's mark", 14, INK, "middle"),
        C(240, 210, 11, ACCENT),
        T(258, 216, "Finger", 18),
        C(140, 330, 8, INK),
        C(340, 330, 8, INK),
        T(140, 360, "Left eye", 16, INK, "middle"),
        T(340, 360, "Right eye", 16, INK, "middle"),
        L(140, 322, 240, 220, INK, 1.5),
        L(240, 200, 340, 116, ACCENT, 1.6),
        L(340, 322, 240, 220, INK, 1.5),
        L(240, 200, 140, 116, ACCENT, 1.6),
        T(24, 400, "The gap between the eyes is the baseline.", 16, MUTED),
        T(24, 424, "It was measured on you, not on the wall.", 16, MUTED),
    ])
    desc = "Two eyes look past one finger at a far wall. The left eye lines the finger up with the right-hand mark. The right eye lines it up with the left-hand mark. The finger did not move."
    return doc(480, 450, "The finger stays still", desc, body)

def same_angle():
    body = "\n".join([
        T(24, 40, "Same look, four times as big", 28),
        T(24, 68, "Four times the width at four times the distance.", 16, MUTED),
        C(56, 210, 8, INK),
        T(56, 248, "Eye", 16, INK, "middle"),
        L(64, 210, 200, 170, ACCENT, 1.6),
        L(64, 210, 200, 250, ACCENT, 1.6),
        L(200, 170, 200, 250, ACCENT, 3),
        T(214, 216, "2 feet wide", 16),
        T(214, 238, "at 100 feet", 16, MUTED),
        L(64, 210, 430, 150, INK, 1.3),
        L(64, 210, 430, 270, INK, 1.3),
        L(430, 150, 430, 270, INK, 3),
        T(300, 120, "8 feet wide", 16),
        T(300, 142, "at 400 feet", 16, MUTED),
        T(24, 330, "One look cannot tell these apart.", 18),
        T(24, 358, "A photograph of the width has the same limit.", 16, MUTED),
        T(24, 390, "This is a teaching picture, not a measurement of the Moon.", 15, MUTED),
    ])
    desc = "An eye sees a sign 2 feet wide at 100 feet under the same angle as a sign 8 feet wide at 400 feet. One look, or one photograph of that angle, does not say which sign it is."
    return doc(480, 420, "Same look, four times as big", desc, body)

def steeple():
    body = "\n".join([
        T(24, 36, "Two directions, one baseline", 26),
        T(24, 62, "A made-up steeple. Not Hipparchus, and not the Moon.", 16, MUTED),
        L(70, 250, 250, 250, INK, 2),
        C(70, 250, 7, INK),
        C(250, 250, 7, INK),
        T(70, 278, "South", 16, INK, "middle"),
        T(250, 278, "North", 16, INK, "middle"),
        T(160, 298, "6 miles, measured", 16, ACCENT, "middle"),
        L(70, 250, 390, 110, "#e6dfd2", 1.4),
        L(250, 250, 390, 110, "#e6dfd2", 1.4),
        C(390, 110, 6, MUTED),
        T(360, 146, "Far hill", 16, MUTED),
        L(70, 250, 168, 120, ACCENT, 1.8),
        L(250, 250, 168, 120, ACCENT, 1.8),
        C(168, 120, 8, ACCENT),
        T(180, 112, "Steeple", 18, ACCENT),
        T(24, 350, "The hill does not shift: it is too far. The steeple does.", 16),
        T(24, 376, "The two rust lines differ by 1 degree at the steeple.", 16),
        T(24, 402, "Here that angle is drawn large so the crossing can be seen.", 15, MUTED),
        T(24, 428, "About 57 baselines fit into that distance.", 16),
        T(24, 452, "57 times 6 miles is 342 miles.", 16),
    ])
    desc = "South and North stand 6 measured miles apart. Each lines the steeple up against a distant hill. The hill's direction is shared. The steeple's direction is not. The two sightlines differ by 1 degree at the steeple, drawn large. The distance is about 57 times 6 miles, 342 miles."
    return doc(480, 490, "Two directions, one baseline", desc, body)

def eclipse():
    body = "\n".join([
        T(24, 36, "Two reports, not two photographs", 24),
        T(24, 62, "The Sun is the far wall. Angles are drawn large.", 16, MUTED),
        f'<path d="M40 260 Q160 180 300 230" fill="none" stroke="{INK}" stroke-width="2"/>',
        C(50, 252, 6, INK),
        C(218, 207, 6, ACCENT),
        T(24, 278, "Alexandria", 15),
        T(228, 232, "Hellespont", 15, ACCENT),
        C(250, 120, 10, ACCENT),
        T(266, 116, "Moon", 18, ACCENT),
        L(50, 246, 250, 130, INK, 1.5),
        L(218, 201, 250, 130, ACCENT, 1.5),
        L(40, 150, 450, 150, MUTED, 1.2),
        L(40, 168, 450, 160, MUTED, 1.2),
        T(330, 142, "Sun, very far", 16, MUTED),
        T(24, 310, "Total at the Hellespont.", 16),
        T(24, 334, "About four-fifths covered at Alexandria.", 16),
        T(24, 358, "The difference is a fifth of the Sun's width.", 16),
        T(24, 382, "That is a change of direction, not yet miles.", 16),
        T(24, 410, "The miles come from the size of the Earth.", 16, MUTED),
    ])
    desc = "Alexandria and the Hellespont on the Earth, the Moon between them and a very far Sun. Sightlines differ. The drawing exaggerates the angles. These are eclipse reports, not photographs of the stars taken at the same moment."
    return doc(480, 450, "Two reports, not two photographs", desc, body)

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    files = {
        "Hipparchus_Finger_Does_Not_Move_Faria_2026-11-08.svg": finger(),
        "Hipparchus_Same_Angle_Four_Times_Faria_2026-11-08.svg": same_angle(),
        "Hipparchus_Steeple_Baseline_Faria_2026-11-08.svg": steeple(),
        "Hipparchus_Eclipse_Reports_Not_Photographs_Faria_2026-11-08.svg": eclipse(),
    }
    for name, svg in files.items():
        (OUT / name).write_text(svg, encoding="utf-8")
        print(name)

if __name__ == "__main__":
    main()
