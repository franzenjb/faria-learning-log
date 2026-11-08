#!/usr/bin/env python3
"""Draw the six growth figures for the 8 November lesson.

Every plotted value is the lesson's own rule. The pictures do not share a
vertical scale, and the logarithm's even gaps are tenfold steps, not a ruler.
"""
import math
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public" / "img"
CREAM = "#fbf8f2"
INK = "#22201c"
MUTED = "#6b645a"
LINE = "#e6dfd2"
ACCENT = "#7a4b1e"
FONT = "Georgia, 'Iowan Old Style', Palatino, 'Palatino Linotype', serif"

def esc(s):
    return (str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))

def document(w, h, title, desc, body):
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-labelledby="t d">
<title id="t">{esc(title)}</title>
<desc id="d">{esc(desc)}</desc>
<rect width="{w}" height="{h}" fill="{CREAM}"/>
<style>text {{ font-family: {FONT}; fill: {INK}; }}</style>
{body}
</svg>
'''

def T(x, y, s, size=22, fill=INK, anchor="start"):
    return f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{fill}" text-anchor="{anchor}">{esc(s)}</text>'

def line(x1, y1, x2, y2, stroke=ACCENT, width=2.4):
    return f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{stroke}" stroke-width="{width}" stroke-linecap="round"/>'

def dot(x, y, r=5.2, fill=ACCENT):
    return f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="{fill}"/>'

def polyline(pts, stroke=ACCENT, width=2.4):
    d = " ".join(f"{x:.1f},{y:.1f}" for x, y in pts)
    return f'<polyline points="{d}" fill="none" stroke="{stroke}" stroke-width="{width}" stroke-linejoin="round" stroke-linecap="round"/>'

def assert_series(name, got, expect):
    if list(got) != list(expect):
        raise SystemExit(f"{name}: {list(got)} != {list(expect)}")

def linear():
    hours = list(range(0, 9))
    miles = [10 * h for h in hours]
    assert_series("linear", miles, [0, 10, 20, 30, 40, 50, 60, 70, 80])
    W, H = 480, 430
    left, right, top, bottom = 58, 448, 108, 360
    def X(h):
        return left + (h / 8) * (right - left)
    def Y(m):
        return bottom - (m / 80) * (bottom - top)
    parts = [
        T(24, 40, "Each hour adds 10 miles", 28),
        T(24, 68, "Same addition every step. The line is straight.", 16, MUTED),
        line(left, bottom, right, bottom, INK, 1.2),
        line(left, bottom, left, top, INK, 1.2),
        T(left - 8, bottom + 4, "0", 15, MUTED, "end"),
        T(left - 8, Y(40) + 5, "40", 15, MUTED, "end"),
        T(left - 8, Y(80) + 5, "80", 15, MUTED, "end"),
        T(left, bottom + 36, "0", 15, MUTED, "middle"),
        T(X(4), bottom + 36, "4 hours", 15, MUTED, "middle"),
        T(X(8), bottom + 36, "8", 15, MUTED, "middle"),
        T(18, (top + bottom) / 2, "miles", 15, MUTED, "middle"),
        polyline([(X(h), Y(m)) for h, m in zip(hours, miles)]),
    ]
    # rotate the y label by wrapping a group
    parts[-1]  # polyline already added
    # replace the sideways label with a group
    parts.pop()  # remove mistaken order; rebuild labels below
    parts = parts[:-1]
    parts.append(polyline([(X(h), Y(m)) for h, m in zip(hours, miles)]))
    for h, m in zip(hours, miles):
        parts.append(dot(X(h), Y(m)))
        if h == 0:
            parts.append(T(X(h) + 8, Y(m) - 8, "start", 14, MUTED))
        else:
            parts.append(T(X(h), Y(m) - 12, str(m), 16, INK, "middle"))
    # one marked step, from hour 3 to 4: both values differ by 10
    parts.append(line(X(3), Y(30) - 28, X(4), Y(40) - 28, ACCENT, 1.4))
    parts.append(T((X(3) + X(4)) / 2, Y(40) - 34, "+10", 16, ACCENT, "middle"))
    parts.append(T(24, 408, "Hours across, miles up. This scale belongs to this picture only.", 15, MUTED))
    desc = "Straight line from 0 hours and 0 miles through 10, 20, 30, 40, 50, 60, 70, and 80 miles. Each hour adds 10."
    return document(W, H, "Each hour adds 10 miles", desc, "\n".join(parts))

def quadratic():
    areas = [n * n for n in range(0, 9)]
    assert_series("square", areas, [0, 1, 4, 9, 16, 25, 36, 49, 64])
    added = [areas[i] - areas[i - 1] for i in range(2, 5)]
    assert_series("gnomon", added, [3, 5, 7])
    W, H = 480, 760
    parts = [
        T(24, 40, "The square grows by odd pieces", 26),
        T(24, 68, "Side times side. The added piece is the next odd number.", 16, MUTED),
    ]
    cell, gap = 16, 2
    fills = {0: ACCENT, 1: "#a67c52", 2: "#c4a484", 3: "#e4d5c4"}
    captions = ["1", "4, and the new piece is 3", "9, and the new piece is 5", "16, and the new piece is 7"]
    y0 = 96
    for n, cap in enumerate(captions, start=1):
        for r in range(n):
            for c in range(n):
                k = max(c, r)
                x = 28 + c * (cell + gap)
                y = y0 + r * (cell + gap)
                parts.append(
                    f'<rect x="{x}" y="{y}" width="{cell}" height="{cell}" fill="{fills[k]}" stroke="{ACCENT}" stroke-width="1"/>'
                )
        parts.append(T(120, y0 + n * (cell + gap) / 2 + 6, cap, 18, INK))
        y0 += n * (cell + gap) + 18
    parts.append(T(24, y0 + 16, "Then the areas through a side of 8 feet", 16, MUTED))
    left, right, top, bottom = 58, 448, y0 + 36, y0 + 250
    def X(n):
        return left + (n / 8) * (right - left)
    def Y(a):
        return bottom - (a / 64) * (bottom - top)
    parts += [
        line(left, bottom, right, bottom, INK, 1.2),
        line(left, bottom, left, top, INK, 1.2),
        T(left - 8, bottom + 4, "0", 14, MUTED, "end"),
        T(left - 8, Y(32) + 4, "32", 14, MUTED, "end"),
        T(left - 8, Y(64) + 4, "64", 14, MUTED, "end"),
        polyline([(X(n), Y(a)) for n, a in enumerate(areas)]),
    ]
    for n, a in enumerate(areas):
        parts.append(dot(X(n), Y(a), 4.6))
        if n:
            parts.append(T(X(n), Y(a) - 10, str(a), 14, INK, "middle"))
        parts.append(T(X(n), bottom + 22, str(n), 13, MUTED, "middle"))
    parts.append(T(24, bottom + 48, "Vertical scale: square feet, for this picture only. It starts at 0.", 15, MUTED))
    desc = "A 4 by 4 square shows areas 1, then added 3, 5, and 7. The curve then marks areas 1, 4, 9, 16, 25, 36, 49, and 64."
    return document(W, H, "The square grows by odd pieces", desc, "\n".join(parts))

def cubic():
    vols = [n ** 3 for n in range(0, 9)]
    assert_series("cube", vols, [0, 1, 8, 27, 64, 125, 216, 343, 512])
    W, H = 480, 700
    parts = [
        T(24, 40, "A cube counts side, three times", 26),
        T(24, 68, "Each small square is one cubic foot in that layer.", 16, MUTED),
    ]
    # three countable stacks: 1; two layers of 4; three layers of 9
    stacks = [
        (1, 1, "1 × 1 × 1 = 1"),
        (2, 2, "2 × 2 × 2 = 8"),
        (3, 3, "3 × 3 × 3 = 27"),
    ]
    x0 = 28
    for side, layers, label in stacks:
        cell = 16
        block_w = side * (cell + 2)
        y = 92
        for layer in range(layers):
            for r in range(side):
                for c in range(side):
                    x = x0 + c * (cell + 2)
                    yy = y + r * (cell + 2)
                    parts.append(f'<rect x="{x}" y="{yy}" width="{cell}" height="{cell}" fill="{CREAM}" stroke="{ACCENT}" stroke-width="1.3"/>')
            y += side * (cell + 2) + 8
        parts.append(T(x0, y + 8, label, 14, INK))
        x0 += 150
    left, right, top, bottom = 64, 360, 390, 630
    def X(n):
        return left + (n / 8) * (right - left)
    def Y(v):
        return bottom - (v / 512) * (bottom - top)
    parts += [
        T(24, 368, "The volumes, on a scale that reaches 512", 16, MUTED),
        line(left, bottom, right, bottom, INK, 1.2),
        line(left, bottom, left, top, INK, 1.2),
        T(left - 8, bottom + 4, "0", 14, MUTED, "end"),
        T(left - 8, Y(256) + 4, "256", 14, MUTED, "end"),
        T(left - 8, Y(512) + 4, "512", 14, MUTED, "end"),
        polyline([(X(n), Y(v)) for n, v in enumerate(vols)], ACCENT, 2.2),
    ]
    for n, v in enumerate(vols):
        parts.append(dot(X(n), Y(v), 4.4))
        parts.append(T(X(n), bottom + 22, str(n), 13, MUTED, "middle"))
    # labels that have room sit by the dot; the low cluster is written out
    for n, v in [(4, 64), (5, 125), (6, 216), (7, 343), (8, 512)]:
        parts.append(T(min(X(n) + 8, 400), Y(v) - 8, str(v), 14, INK))
    parts.append(T(24, 662, "1, 8, and 27 are marked. They sit low because this scale reaches 512.", 15, MUTED))
    parts.append(T(24, 684, "Cubic feet, this picture only. The drawing counts unit cubes.", 15, MUTED))
    desc = "Unit layers show 1, 8, and 27 cubic feet. The curve marks 1, 8, 27, 64, 125, 216, 343, and 512. The scale runs from 0 to 512."
    return document(W, H, "A cube counts side, three times", desc, "\n".join(parts))

def exponential():
    doubling = [2 ** n for n in range(0, 9)]
    square = [n * n for n in range(0, 9)]
    assert_series("double", doubling, [1, 2, 4, 8, 16, 32, 64, 128, 256])
    assert_series("square again", square, [0, 1, 4, 9, 16, 25, 36, 49, 64])
    assert doubling[3] < square[3]  # 8 < 9
    assert doubling[4] == square[4]  # 16
    assert doubling[5] > square[5]  # 32 > 25
    W, H = 480, 760
    parts = [
        T(24, 40, "Each step multiplies by 2", 28),
        T(24, 68, "Start with 1 at hour 0. The table begins at hour 1, which is 2.", 15, MUTED),
    ]
    # countable groups for 1, 2, 4, 8, 16
    groups = [(0, 1), (1, 2), (2, 4), (3, 8), (4, 16)]
    y = 96
    for hour, count in groups:
        parts.append(T(24, y + 12, f"{hour}", 16, MUTED))
        for i in range(count):
            col = i % 8
            row = i // 8
            parts.append(dot(70 + col * 16, y - 2 + row * 16, 5.5))
        parts.append(T(210, y + 12, str(count), 18, ACCENT))
        y += 36 if count <= 8 else 52
    parts.append(T(24, y + 10, "Then ×2 keeps going:  32,  64,  128,  256.", 18))
    # shared numeric comparison
    parts.append(T(24, y + 52, "The output numbers, on one scale from 0 to 256", 16, MUTED))
    parts.append(T(24, y + 74, "Square feet and a bacteria count are different things.", 15, MUTED))
    left, right, top, bottom = 58, 400, y + 96, y + 300
    def X(n):
        return left + (n / 8) * (right - left)
    def Y(v):
        return bottom - (v / 256) * (bottom - top)
    parts += [
        line(left, bottom, right, bottom, INK, 1.2),
        line(left, bottom, left, top, INK, 1.2),
        T(left - 6, bottom + 4, "0", 13, MUTED, "end"),
        T(left - 6, Y(128) + 4, "128", 13, MUTED, "end"),
        T(left - 6, Y(256) + 4, "256", 13, MUTED, "end"),
        polyline([(X(n), Y(v)) for n, v in enumerate(square)], INK, 1.8),
        polyline([(X(n), Y(v)) for n, v in enumerate(doubling)], ACCENT, 2.4),
    ]
    for n, v in enumerate(square):
        parts.append(f'<circle cx="{X(n):.1f}" cy="{Y(v):.1f}" r="4" fill="{CREAM}" stroke="{INK}" stroke-width="1.6"/>')
    for n, v in enumerate(doubling):
        parts.append(dot(X(n), Y(v), 4.2))
    parts.append(T(right + 8, Y(256) + 5, "256", 15, ACCENT))
    parts.append(T(right + 8, Y(64) + 5, "64", 15, INK))
    parts.append(T(X(5) - 8, Y(32) - 8, "32", 14, ACCENT, "end"))
    parts.append(T(X(5) - 8, Y(25) + 18, "25", 14, INK, "end"))
    parts.append(T(24, H - 18, "At step 3, 8 is below 9. At step 4 both are 16. At step 5, 32 is above 25.", 14, MUTED))
    desc = "Doubling from 1 gives 2, 4, 8, 16, 32, 64, 128, 256. On a shared scale of output numbers, the square is 1, 4, 9, 16, 25, 36, 49, 64. At step 3, 8 is below 9. At step 5, 32 is above 25."
    return document(W, H, "Each step multiplies by 2", desc, "\n".join(parts))

def factorial():
    def fact(n):
        f = 1
        for i in range(1, n + 1):
            f *= i
        return f
    values = [fact(n) for n in range(1, 9)]
    assert_series("factorial", values, [1, 2, 6, 24, 120, 720, 5040, 40320])
    W, H = 480, 720
    parts = [
        T(24, 40, "One more person multiplies", 28),
        T(24, 68, "The sign ! names the count. It is not excitement.", 16, MUTED),
        T(24, 110, "1 person", 16, MUTED),
        T(150, 110, "A", 22, ACCENT),
        T(300, 110, "1 way", 18),
        T(24, 150, "2 people", 16, MUTED),
        T(150, 150, "AB    BA", 22, ACCENT),
        T(300, 150, "2 ways", 18),
        T(24, 190, "3 people", 16, MUTED),
    ]
    perms = ["ABC", "ACB", "BAC", "BCA", "CAB", "CBA"]
    assert len(perms) == 6 and len(set(perms)) == 6
    for i, p in enumerate(perms):
        col, row = i % 3, i // 3
        parts.append(T(150 + col * 70, 190 + row * 26, p, 18, ACCENT))
    parts.append(T(360, 204, "6 ways", 18))
    parts.append(T(24, 270, "After three, the list is a multiplication.", 16, MUTED))
    chain = [
        (1, None, 1),
        (2, 2, 2),
        (3, 3, 6),
        (4, 4, 24),
        (5, 5, 120),
        (6, 6, 720),
        (7, 7, "5,040"),
        (8, 8, "40,320"),
    ]
    y = 310
    for n, mult, count in chain:
        people = "person" if n == 1 else "people"
        ways = "way" if count == 1 else "ways"
        parts.append(T(36, y, f"{n} {people}", 18))
        if mult:
            parts.append(T(180, y, f"× {mult}", 18, ACCENT))
        parts.append(T(280, y, f"{count} {ways}", 18))
        y += 36
    parts.append(T(24, H - 28, "These rows are equally spaced so the multiplier can be read.", 15, MUTED))
    parts.append(T(24, H - 8, "They are not bars sized to the count. 40,320 would hide the 6.", 15, MUTED))
    desc = "One person, 1 way. Two people, AB and BA. Three people, the six orders ABC, ACB, BAC, BCA, CAB, CBA. Then ×4 is 24, ×5 is 120, ×6 is 720, ×7 is 5,040, ×8 is 40,320. Rows are not drawn to the size of the count."
    return document(W, H, "One more person multiplies", desc, "\n".join(parts))

def logarithm():
    inputs = [10 ** k for k in range(8)]
    steps = [int(math.log10(v)) for v in inputs]
    digits = [len(str(v)) for v in inputs]
    assert_series("log10", steps, list(range(8)))
    assert_series("digits", digits, list(range(1, 9)))
    assert all(d == s + 1 for s, d in zip(steps, digits))
    labels = ["1", "10", "100", "1,000", "10,000", "100,000", "1,000,000", "10,000,000"]
    W, H = 480, 640
    parts = [
        T(24, 40, "Times ten, add one step", 28),
        T(24, 68, "Each row is ten times the input above it.", 16, MUTED),
        T(24, 100, "Input", 14, MUTED),
        T(230, 100, "Steps", 14, MUTED),
        T(360, 100, "Digits", 14, MUTED),
    ]
    top = 124
    row_h = 58
    x0, x1 = 210, 330
    def X(step):
        return x0 + (step / 7) * (x1 - x0)
    centers = []
    for i, (lab, step, dig) in enumerate(zip(labels, steps, digits)):
        y = top + i * row_h
        centers.append((X(step), y - 6))
        parts.append(T(24, y, lab, 18))
        parts.append(dot(X(step), y - 6, 5))
        parts.append(T(X(step), y - 16, str(step), 13, ACCENT, "middle"))
        parts.append(T(390, y, str(dig), 18))
        if i:
            parts.append(T(24, y - row_h / 2 + 4, "×10", 13, ACCENT))
    parts.append(T(24, H - 28, "Equal row gaps mean ×10, not ordinary counting gaps.", 15, MUTED))
    parts.append(T(24, H - 8, "Digits are the steps plus one, and they jump by whole numbers.", 15, MUTED))
    desc = "Inputs 1, 10, 100, 1,000, 10,000, 100,000, 1,000,000, and 10,000,000. Tenfold steps 0 through 7. Written digits 1 through 8. Equal row spacing means each input is ten times the one before."
    return document(W, H, "Times ten, add one step", desc, "\n".join(parts))

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    files = {
        "Growth_Linear_Ten_Miles_Faria_2026-11-08.svg": linear(),
        "Growth_Quadratic_Square_Area_Faria_2026-11-08.svg": quadratic(),
        "Growth_Cubic_Cube_Volume_Faria_2026-11-08.svg": cubic(),
        "Growth_Exponential_Doubling_Faria_2026-11-08.svg": exponential(),
        "Growth_Factorial_Arrangements_Faria_2026-11-08.svg": factorial(),
        "Growth_Logarithm_Tenfold_Steps_Faria_2026-11-08.svg": logarithm(),
    }
    for name, svg in files.items():
        (OUT / name).write_text(svg, encoding="utf-8")
        print(name, len(svg))

if __name__ == "__main__":
    main()
