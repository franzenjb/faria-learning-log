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
    W, H = 480, 332
    left, right, top, bottom = 54, 456, 72, 258
    def X(h):
        return left + (h / 8) * (right - left)
    def Y(m):
        return bottom - (m / 80) * (bottom - top)
    parts = [
        T(24, 28, "Each hour adds 10 miles", 22),
        T(24, 48, "Same addition every step. The line is straight.", 14, MUTED),
        line(left, bottom, right, bottom, INK, 1.2),
        line(left, bottom, left, top, INK, 1.2),
        T(left - 8, bottom + 4, "0", 15, MUTED, "end"),
        T(left - 8, Y(40) + 5, "40", 15, MUTED, "end"),
        T(left - 8, Y(80) + 5, "80", 15, MUTED, "end"),
        T(left, bottom + 18, "0", 14, MUTED, "middle"),
        T(X(4), bottom + 18, "4 hours", 14, MUTED, "middle"),
        T(X(8), bottom + 18, "8", 14, MUTED, "middle"),
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
    parts.append(T(24, 318, "Hours across, miles up. This scale is miles, for this picture only.", 13, MUTED))
    desc = "Straight line from 0 hours and 0 miles through 10, 20, 30, 40, 50, 60, 70, and 80 miles. Each hour adds 10."
    return document(W, H, "Each hour adds 10 miles", desc, "\n".join(parts))

def quadratic():
    areas = [n * n for n in range(0, 9)]
    assert_series("square", areas, [0, 1, 4, 9, 16, 25, 36, 49, 64])
    added = [areas[i] - areas[i - 1] for i in range(2, 5)]
    assert_series("gnomon", added, [3, 5, 7])
    W, H = 480, 348
    parts = [
        T(24, 26, "The square grows by odd pieces", 22),
        T(24, 46, "Side times side. The lighter band is the new piece.", 14, MUTED),
    ]
    cell, gap = 11, 2
    fills = {0: ACCENT, 1: "#a67c52", 2: "#c4a484", 3: "#e4d5c4"}
    captions = ["1", "4, +3", "9, +5", "16, +7"]
    ox, base = 36, 118
    for n, cap in enumerate(captions, start=1):
        side = n * (cell + gap)
        for r in range(n):
            for c in range(n):
                k = max(c, r)
                x = ox + c * (cell + gap)
                y = base - side + r * (cell + gap)
                parts.append(
                    f'<rect x="{x}" y="{y}" width="{cell}" height="{cell}" fill="{fills[k]}" stroke="{ACCENT}" stroke-width="1"/>'
                )
        parts.append(T(ox + side / 2, base + 16, cap, 13, INK, "middle"))
        ox += side + 52
    left, right, top, bottom = 52, 456, 156, 292
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
    parts.append(T(24, bottom + 40, "Square feet, this picture only. The scale starts at 0.", 13, MUTED))
    desc = "A 4 by 4 square shows areas 1, then added 3, 5, and 7. The curve then marks areas 1, 4, 9, 16, 25, 36, 49, and 64."
    return document(W, H, "The square grows by odd pieces", desc, "\n".join(parts))

def cubic():
    vols = [n ** 3 for n in range(0, 9)]
    assert_series("cube", vols, [0, 1, 8, 27, 64, 125, 216, 343, 512])
    W, H = 480, 384
    parts = [
        T(24, 26, "A cube counts the side three times", 22),
        T(24, 46, "Each small square is one cubic foot in that layer.", 14, MUTED),
    ]
    # three countable stacks: 1; two layers of 4; three layers of 9
    stacks = [
        (1, 1, "1 × 1 × 1 = 1"),
        (2, 2, "2 × 2 × 2 = 8"),
        (3, 3, "3 × 3 × 3 = 27"),
    ]
    x0 = 28
    for side, layers, label in stacks:
        cell = 9
        block_w = side * (cell + 2)
        y = 58
        for layer in range(layers):
            for r in range(side):
                for c in range(side):
                    x = x0 + c * (cell + 2)
                    yy = y + r * (cell + 2)
                    parts.append(f'<rect x="{x}" y="{yy}" width="{cell}" height="{cell}" fill="{CREAM}" stroke="{ACCENT}" stroke-width="1.3"/>')
            y += side * (cell + 2) + 3
        parts.append(T(x0, y + 8, label, 14, INK))
        x0 += 155
    left, right, top, bottom = 58, 400, 214, 322
    def X(n):
        return left + (n / 8) * (right - left)
    def Y(v):
        return bottom - (v / 512) * (bottom - top)
    parts += [
        T(24, 206, "Volumes on a scale that reaches 512", 14, MUTED),
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
    parts.append(T(24, 370, "1, 8, and 27 sit low because 512 is the top. This scale is cubic feet.", 13, MUTED))
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
    W, H = 480, 368
    parts = [
        T(24, 24, "Each step multiplies by 2", 20),
        T(24, 42, "Hour 0 is 1. The table begins at hour 1, which is 2.", 13, MUTED),
    ]
    groups = [(0, 1), (1, 2), (2, 4), (3, 8), (4, 16)]
    y = 58
    for hour, count in groups:
        parts.append(T(12, y + 8, f"{hour}", 12, MUTED))
        for i in range(count):
            col = i % 8
            row = i // 8
            parts.append(dot(36 + col * 12, y + row * 13, 4))
        parts.append(T(148, y + (8 if count <= 8 else 16), str(count), 13, ACCENT))
        y += 18 if count <= 8 else 34
    parts.append(T(230, 70, "Then ×2", 13, MUTED))
    parts.append(T(230, 90, "32, 64", 15))
    parts.append(T(230, 110, "128, 256", 15))
    parts.append(T(24, y + 16, "Output numbers, one scale, 0 to 256. Not the same unit.", 13, MUTED))
    left, right, top, bottom = 54, 390, y + 36, y + 156
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
    parts.append(T(24, bottom + 22, "Step 3: 8 below 9. Step 4: both 16. Step 5: 32 above 25.", 13, MUTED))
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
    W, H = 480, 360
    parts = [
        T(24, 26, "One more person multiplies", 22),
        T(24, 46, "The sign ! names the count. It is not excitement.", 14, MUTED),
        T(24, 74, "1 person   A", 15),
        T(220, 74, "1 way", 15, ACCENT),
        T(24, 96, "2 people   AB   BA", 15),
        T(220, 96, "2 ways", 15, ACCENT),
        T(24, 118, "3 people", 15),
    ]
    perms = ["ABC", "ACB", "BAC", "BCA", "CAB", "CBA"]
    assert len(perms) == 6 and len(set(perms)) == 6
    for i, p in enumerate(perms):
        col, row = i % 3, i // 3
        parts.append(T(120 + col * 58, 118 + row * 18, p, 14, ACCENT))
    parts.append(T(300, 136, "6 ways", 15, ACCENT))
    parts.append(T(24, 168, "After three, each new person multiplies.", 14, MUTED))
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
    y = 190
    for n, mult, count in chain:
        people = "person" if n == 1 else "people"
        ways = "way" if count == 1 else "ways"
        parts.append(T(28, y, f"{n} {people}", 14))
        if mult:
            parts.append(T(150, y, f"× {mult}", 14, ACCENT))
        parts.append(T(230, y, f"{count} {ways}", 14))
        y += 18
    parts.append(T(24, 346, "Rows are equally spaced, not bars sized to the count.", 13, MUTED))
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
    W, H = 480, 340
    parts = [
        T(24, 26, "Times ten, add one step", 22),
        T(24, 46, "Each row is ten times the input above it.", 14, MUTED),
        T(24, 70, "Input", 13, MUTED),
        T(230, 70, "Steps", 13, MUTED),
        T(360, 70, "Digits", 13, MUTED),
    ]
    top = 92
    row_h = 26
    x0, x1 = 210, 330
    def X(step):
        return x0 + (step / 7) * (x1 - x0)
    centers = []
    for i, (lab, step, dig) in enumerate(zip(labels, steps, digits)):
        y = top + i * row_h
        centers.append((X(step), y - 6))
        parts.append(T(24, y, lab, 14))
        parts.append(dot(X(step), y - 4, 4))
        parts.append(T(X(step) + 10, y, str(step), 13, ACCENT))
        parts.append(T(400, y, str(dig), 14))
        if i:
            parts.append(T(155, y - row_h / 2 + 4, "×10", 11, ACCENT))
    parts.append(T(24, 312, "Equal gaps mean ×10, not a counting ruler.", 13, MUTED))
    parts.append(T(24, 330, "Digits are the steps plus one. They jump by whole numbers.", 13, MUTED))
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
