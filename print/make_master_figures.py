#!/usr/bin/env python3
"""Vector figures for the master mathematics lesson, matching the original sheet."""
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public" / "img"
CREAM, INK, MUTED, ACCENT, LINE = "#fbf8f2", "#22201c", "#6b645a", "#7a4b1e", "#e6dfd2"
FONT = "Georgia, 'Iowan Old Style', Palatino, 'Palatino Linotype', serif"

def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;")

def doc(w, h, title, desc, body):
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-labelledby="t d">
<title id="t">{esc(title)}</title><desc id="d">{esc(desc)}</desc>
<rect width="{w}" height="{h}" fill="{CREAM}"/>
<style>text {{ font-family: {FONT}; fill: {INK}; }}</style>
{body}</svg>'''

def T(x, y, s, size=16, fill=INK, anchor="start"):
    return f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" text-anchor="{anchor}">{esc(s)}</text>'

def box(x, y, w, h, title, sub):
    return "\n".join([
        f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{CREAM}" stroke="{ACCENT}" stroke-width="1.6"/>',
        T(x + w / 2, y + 28, title, 16, ACCENT, "middle"),
        T(x + w / 2, y + 50, sub, 14, MUTED, "middle"),
    ])

def rooms():
    body = "\n".join([
        T(16, 28, "Three rooms, forty people each", 20),
        box(16, 48, 140, 78, "Room 1", "40 people"),
        box(170, 48, 140, 78, "Room 2", "40 people"),
        box(324, 48, 140, 78, "Room 3", "40 people"),
        T(16, 156, "3 × 40 = 120. A teaching count, not a fire rule.", 14, MUTED),
    ])
    return doc(480, 176, "Three rooms", "Three rooms, each marked 40 people. Three times 40 is 120.", body)

def pallets():
    parts = [T(16, 28, "Six pallets, 500 pounds each", 20)]
    for i in range(6):
        x = 16 + i * 76
        parts.append(f'<rect x="{x}" y="48" width="68" height="64" fill="{CREAM}" stroke="{ACCENT}" stroke-width="1.6"/>')
        parts.append(T(x + 34, 76, str(i + 1), 16, ACCENT, "middle"))
        parts.append(T(x + 34, 96, "500 lb", 12, MUTED, "middle"))
    parts.append(T(16, 140, "3,000 ÷ 500 = 6. Weight arithmetic, not a loading plan.", 14, MUTED))
    return doc(480, 160, "Six pallets", "Six boxes, each 500 pounds. 3,000 divided by 500 is 6.", "\n".join(parts))

def triangles():
    body = "\n".join([
        T(16, 28, "Two different triangles", 20),
        # right triangle
        '<path d="M40 150 L40 50 L150 150 Z" fill="none" stroke="#7a4b1e" stroke-width="2"/>',
        '<path d="M40 134 L56 134 L56 150" fill="none" stroke="#22201c" stroke-width="1.4"/>',
        T(70, 176, "Right triangle", 15, ACCENT, "middle"),
        T(70, 196, "one square corner", 13, MUTED, "middle"),
        # equilateral
        '<path d="M250 150 L310 46 L370 150 Z" fill="none" stroke="#7a4b1e" stroke-width="2"/>',
        T(310, 176, "Equilateral", 15, ACCENT, "middle"),
        T(310, 196, "three equal sides", 13, MUTED, "middle"),
    ])
    return doc(480, 214, "Right and equilateral", "A right triangle with one square corner, and an equilateral triangle with three equal sides.", body)

def pythagoras():
    # 3-4-5 squares. Scale 18 px per foot. Triangle with right angle at origin-ish.
    # Place squares outward.
    body = "\n".join([
        T(16, 26, "Squares on a 3-4-5 triangle", 20),
        # triangle: right angle at (150, 170), leg 3 up, leg 4 right, hyp to (222, 116) wait
        # leg a=3*22=66 up, leg b=4*22=88 right
        '<path d="M160 190 L160 124 L248 190 Z" fill="none" stroke="#22201c" stroke-width="1.8"/>',
        # square on vertical leg (3), to the left: width 66
        '<path d="M160 190 L160 124 L94 124 L94 190 Z" fill="#e4d5c4" stroke="#7a4b1e" stroke-width="1.4"/>',
        T(118, 162, "9", 16, ACCENT, "middle"),
        # square on horizontal leg (4), below: height 88
        '<path d="M160 190 L248 190 L248 278 L160 278 Z" fill="#c4a484" stroke="#7a4b1e" stroke-width="1.4"/>',
        T(204, 238, "16", 16, ACCENT, "middle"),
        # square on hypotenuse. Hyp from (160,124) to (248,190).
        # vector (88, 66). perpendicular (-66, 88) normalized * length 5*22=110
        # length of perp vector (-66,88) is 110. Exactly the hyp length. So square corners:
        # (160,124)+(-66,88)=(94,212) too messy overlapping.
        # Draw the hyp square to the upper right instead.
        # perp of (88,66) rotated out: (-66, 88) points down-left. Rotate the other way (66, -88).
        # length of (66,-88)=110. Unit * 110 = the vector itself.
        # P1 (160,124), P2 (248,190)
        # P3 = P2+(66,-88)=(314,102), P4=P1+(66,-88)=(226,36)
        '<path d="M160 124 L248 190 L314 102 L226 36 Z" fill="#f3e6d4" stroke="#7a4b1e" stroke-width="1.4"/>',
        T(236, 112, "25", 16, ACCENT, "middle"),
        T(16, 310, "9 + 16 = 25. The long side is 5.", 15, MUTED),
    ])
    return doc(480, 332, "Squares on 3-4-5", "Squares on the sides of a 3-4-5 right triangle, marked 9, 16, and 25 square feet.", body)

def equilateral():
    body = "\n".join([
        T(16, 26, "Split a 20-foot equilateral triangle", 20),
        '<path d="M80 200 L200 40 L320 200 Z" fill="none" stroke="#7a4b1e" stroke-width="2"/>',
        '<path d="M200 40 L200 200" fill="none" stroke="#22201c" stroke-width="1.4" stroke-dasharray="4 3"/>',
        '<path d="M200 184 L216 184 L216 200" fill="none" stroke="#22201c" stroke-width="1.3"/>',
        T(140, 224, "10 ft", 14, MUTED, "middle"),
        T(260, 224, "10 ft", 14, MUTED, "middle"),
        T(118, 120, "20 ft", 14, ACCENT),
        T(250, 90, "30°", 16),
        T(16, 258, "Opposite 30° is 10. The long side is 20. Half is 10/20.", 14, MUTED),
    ])
    return doc(480, 280, "Split equilateral triangle", "A 20-foot equilateral triangle split down the middle into two right triangles. Each base piece is 10 feet. A 30-degree angle is marked.", body)

def rates():
    def panel(x, title, sub):
        return "\n".join([
            f'<rect x="{x}" y="44" width="210" height="90" fill="{CREAM}" stroke="{ACCENT}" stroke-width="1.6"/>',
            T(x + 105, 82, title, 16, ACCENT, "middle"),
            T(x + 105, 106, sub, 13, MUTED, "middle"),
        ])
    body = "\n".join([
        T(16, 28, "Two questions", 20),
        panel(16, "How fast, right now?", "A rate of change"),
        panel(250, "How much altogether?", "Accumulation"),
    ])
    return doc(480, 160, "Rate and accumulation", "Two panels. How fast right now is a rate of change. How much altogether is accumulation.", body)

def bezier(p0, p1, p2, p3, t):
    u = 1 - t
    return (
        u**3 * p0[0] + 3 * u**2 * t * p1[0] + 3 * u * t**2 * p2[0] + t**3 * p3[0],
        u**3 * p0[1] + 3 * u**2 * t * p1[1] + 3 * u * t**2 * p2[1] + t**3 * p3[1],
    )

def bezier_d(p0, p1, p2, p3, t):
    u = 1 - t
    return (
        3 * u**2 * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * t**2 * (p3[0] - p2[0]),
        3 * u**2 * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * t**2 * (p3[1] - p2[1]),
    )

def secant():
    # One cubic. Markers are exact points on it. The solid line is the secant
    # through those two points. The dashed line is the tangent at the later point.
    p0, p1, p2, p3 = (50, 200), (120, 190), (150, 120), (250, 70)
    ta, tb = 0.28, 0.72
    a = bezier(p0, p1, p2, p3, ta)
    b = bezier(p0, p1, p2, p3, tb)
    d = bezier_d(p0, p1, p2, p3, tb)
    length = (d[0] ** 2 + d[1] ** 2) ** 0.5
    ux, uy = d[0] / length, d[1] / length
    span = 42
    t1 = (b[0] - span * ux, b[1] - span * uy)
    t2 = (b[0] + span * ux, b[1] + span * uy)
    # The secant is the segment that joins the two curve points. Its ends are those points.
    def off_line(px, py, x1, y1, x2, y2):
        return abs((px - x1) * (y2 - y1) - (py - y1) * (x2 - x1))
    secant_len = ((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2) ** 0.5
    if off_line(b[0], b[1], t1[0], t1[1], t2[0], t2[1]) > 1e-9:
        raise SystemExit("tangent missed the chosen point")
    if abs((t1[0] - b[0]) * d[1] - (t1[1] - b[1]) * d[0]) > 1e-6:
        raise SystemExit("tangent is not the cubic derivative")
    if abs(off_line(a[0], a[1], a[0], a[1], b[0], b[1])) > 1e-9:
        raise SystemExit("secant missed its first point")
    if secant_len < 40:
        raise SystemExit("secant collapsed")
    # Four-decimal SVG text must still be the cubic, and the printed secant must join those points.
    for t, pt in ((ta, a), (tb, b)):
        hit = bezier(p0, p1, p2, p3, t)
        if abs(round(pt[0], 4) - hit[0]) > 5e-5 or abs(round(pt[1], 4) - hit[1]) > 5e-5:
            raise SystemExit("rounded marker left the cubic")
    body = "\n".join([
        T(16, 26, "A straight line, then the curve's own direction", 18),
        f'<path d="M{p0[0]} {p0[1]} C{p1[0]} {p1[1]} {p2[0]} {p2[1]} {p3[0]} {p3[1]}" fill="none" stroke="#7a4b1e" stroke-width="2.2"/>',
        f'<line x1="{a[0]:.4f}" y1="{a[1]:.4f}" x2="{b[0]:.4f}" y2="{b[1]:.4f}" stroke="#22201c" stroke-width="1.4"/>',
        f'<line x1="{t1[0]:.4f}" y1="{t1[1]:.4f}" x2="{t2[0]:.4f}" y2="{t2[1]:.4f}" stroke="#6b645a" stroke-width="1.3" stroke-dasharray="5 3"/>',
        f'<circle cx="{a[0]:.4f}" cy="{a[1]:.4f}" r="4" fill="#22201c"/>',
        f'<circle cx="{b[0]:.4f}" cy="{b[1]:.4f}" r="4" fill="#7a4b1e"/>',
        T(40, 222, "Straight line: average over the interval", 13, INK),
        T(40, 242, "Dashed line: the direction right now", 13, MUTED),
        T(280, 48, "Distance", 13, MUTED),
        T(400, 210, "Time", 13, MUTED),
        '<line x1="50" y1="200" x2="50" y2="40" stroke="#22201c" stroke-width="1.2"/>',
        '<line x1="50" y1="200" x2="430" y2="200" stroke="#22201c" stroke-width="1.2"/>',
    ])
    return doc(480, 264, "Average line and tangent", "A rising cubic. The solid line joins two points that lie on the curve. The dashed line is the tangent at the later point, using the derivative there.", body)

def rectangles():
    body = "\n".join([
        T(16, 26, "Area under speed is distance", 20),
        '<line x1="40" y1="160" x2="440" y2="160" stroke="#22201c" stroke-width="1.3"/>',
        '<line x1="40" y1="160" x2="40" y2="30" stroke="#22201c" stroke-width="1.3"/>',
        '<rect x="80" y="100" width="140" height="60" fill="#e4d5c4" stroke="#7a4b1e" stroke-width="1.4"/>',
        '<rect x="220" y="50" width="140" height="110" fill="#c4a484" stroke="#7a4b1e" stroke-width="1.4"/>',
        T(150, 136, "20 miles", 14, ACCENT, "middle"),
        T(290, 110, "40 miles", 14, ACCENT, "middle"),
        T(150, 180, "First hour", 13, MUTED, "middle"),
        T(290, 180, "Second hour", 13, MUTED, "middle"),
        T(16, 214, "20 + 40 = 60 miles. The picture is the sum, not a formula.", 14, MUTED),
    ])
    return doc(480, 236, "Two speed rectangles", "Two rectangles under a speed axis. The first is 20 miles, the second is 40 miles. Together 60.", body)

def orbit():
    # Planet at the rightmost point. Tangent there is vertical.
    # Gravity points from the planet toward the Sun, which sits to its left.
    body = "\n".join([
        T(16, 26, "Forward, and inward", 20),
        '<ellipse cx="180" cy="140" rx="90" ry="58" fill="none" stroke="#7a4b1e" stroke-width="1.8"/>',
        '<circle cx="210" cy="140" r="8" fill="#7a4b1e"/>',
        T(222, 128, "Sun", 14, ACCENT),
        '<circle cx="270" cy="140" r="5" fill="#22201c"/>',
        # velocity: vertical, arrowhead up
        '<line x1="270" y1="140" x2="270" y2="78" stroke="#22201c" stroke-width="1.6"/>',
        '<polygon points="270,64 264,78 276,78" fill="#22201c"/>',
        T(278, 72, "Direction now", 13),
        # gravity: toward the Sun, arrowhead pointing left
        '<line x1="262" y1="140" x2="236" y2="140" stroke="#7a4b1e" stroke-width="1.6"/>',
        '<polygon points="224,140 236,134 236,146" fill="#7a4b1e"/>',
        T(16, 214, "Gravity inward, toward the Sun. Direction now is straight up.", 13, MUTED),
        T(16, 234, "Schematic ellipse. Sizes and distances are not to scale.", 14, MUTED),
    ])
    return doc(480, 252, "Orbit sketch", "An ellipse. At the rightmost point the direction of motion is straight up, tangent to the ellipse. A separate arrow points from the planet toward the Sun.", body)

def coffee():
    body = "\n".join([
        T(16, 26, "Two points, then one instant", 20),
        '<path d="M60 50 C90 60 110 90 150 130 C190 170 240 190 400 200" fill="none" stroke="#7a4b1e" stroke-width="2.2"/>',
        '<line x1="70" y1="210" x2="430" y2="210" stroke="#22201c" stroke-width="1.2"/>',
        '<line x1="70" y1="210" x2="70" y2="36" stroke="#22201c" stroke-width="1.2"/>',
        '<circle cx="120" cy="100" r="4.5" fill="#22201c"/>',
        '<circle cx="220" cy="175" r="4.5" fill="#7a4b1e"/>',
        '<line x1="120" y1="100" x2="220" y2="175" stroke="#22201c" stroke-width="1.3"/>',
        T(128, 92, "A, held fixed", 13),
        T(228, 170, "B, slide toward A", 13, ACCENT),
        T(360, 40, "Temperature", 13, MUTED),
        T(360, 228, "Time", 13, MUTED),
        T(16, 256, "Schematic curve, not a measured cup. The dark line joins A and B.", 13, MUTED),
    ])
    return doc(480, 276, "Coffee cooling curve", "A falling temperature curve. Point A is held. Point B is later and slides toward A. The straight line between them is the two-point estimate.", body)

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    files = {
        "Master_Three_Rooms_Faria_2026-11-08.svg": rooms(),
        "Master_Six_Pallets_Faria_2026-11-08.svg": pallets(),
        "Master_Two_Triangles_Faria_2026-11-08.svg": triangles(),
        "Master_Pythagorean_Squares_Faria_2026-11-08.svg": pythagoras(),
        "Master_Equilateral_Split_Faria_2026-11-08.svg": equilateral(),
        "Master_Rate_And_Accumulation_Faria_2026-11-08.svg": rates(),
        "Master_Secant_And_Tangent_Faria_2026-11-08.svg": secant(),
        "Master_Speed_Rectangles_Faria_2026-11-08.svg": rectangles(),
        "Master_Orbit_Sketch_Faria_2026-11-08.svg": orbit(),
        "Master_Coffee_Derivative_Faria_2026-11-08.svg": coffee(),
    }
    for name, svg in files.items():
        (OUT / name).write_text(svg, encoding="utf-8")
        print(name)

if __name__ == "__main__":
    main()
