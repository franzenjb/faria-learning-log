#!/usr/bin/env python3
"""Build the Aristarchus, Hipparchus, and Romer inset figures from asserted geometry."""
import math
from pathlib import Path

OUT = Path("/workspace/public/img")

def fmt(n):
    return f"{n:.2f}"

# ---------------------------------------------------------------------------
# Aristarchus quarter-moon triangle. Uniform scale. No axis stretch.
# Earth (0,0), Moon (cos 87, sin 87), Sun (1/cos 87, 0).
# ---------------------------------------------------------------------------
c87 = math.cos(math.radians(87))
s87 = math.sin(math.radians(87))
sec87 = 1.0 / c87
E = (0.0, 0.0)
M = (c87, s87)
S = (sec87, 0.0)
v_me = (E[0] - M[0], E[1] - M[1])
v_ms = (S[0] - M[0], S[1] - M[1])
dot = v_me[0] * v_ms[0] + v_me[1] * v_ms[1]
assert abs(dot) < 1e-9, dot
ang_e = math.degrees(math.atan2(M[1] - E[1], M[0] - E[0]))
assert abs(ang_e - 87.0) < 1e-9, ang_e
ratio = math.hypot(S[0], S[1]) / math.hypot(M[0], M[1])
assert abs(ratio - sec87) < 1e-9
assert abs(ratio - 19.107) < 0.001, ratio

# Umbra: similar triangles. Sun larger, apex beyond Earth, cone narrows away from the Sun.
Rs, Re, D = 70.0, 22.0, 250.0
assert Rs > Re
apex_gap = Re * D / (Rs - Re)  # Earth center to apex
assert apex_gap > 0
# radius of umbra falls linearly from Re at Earth to 0 at the apex
def umbra_halfwidth(dist_from_earth_center_toward_apex):
    # dist 0 at earth center, apex_gap at apex
    return Re * (1.0 - dist_from_earth_center_toward_apex / apex_gap)

w_near = umbra_halfwidth(Re + 8)          # just outside Earth's limb
w_far = umbra_halfwidth(apex_gap * 0.72)  # farther from the Sun
assert w_far < w_near, (w_far, w_near)
moon_dist = apex_gap * 0.55               # between limb and apex
moon_w = umbra_halfwidth(moon_dist)
moon_r = moon_w * 0.55
assert moon_r < moon_w
assert Re < moon_dist < apex_gap

# Hipparchus stations on the circle. North up in math, SVG y flipped later.
R_e = 86.0
hell_lat, alex_lat = 41.0, 31.0

def on_circle(lat_deg):
    lat = math.radians(lat_deg)
    return (R_e * math.cos(lat), R_e * math.sin(lat))  # x toward Moon, y north

H = on_circle(hell_lat)
A = on_circle(alex_lat)
for p in (H, A):
    assert abs(math.hypot(*p) - R_e) < 1e-6
assert H[1] > A[1]  # Hellespont north of Alexandria

# ---------------------------------------------------------------------------
def svg_aristarchus():
    # Main triangle: Earth at (70, 168), +x right, +y up so SVG y = y0 - unit_y
    scale = 40.0  # px per Earth-Moon distance. Sun lands at 70+19.107*40 = 834
    ox, oy = 70.0, 188.0

    def P(pt):
        return (ox + pt[0] * scale, oy - pt[1] * scale)

    e, m, s = P(E), P(M), P(S)
    # right-angle tick at the Moon, in px, along the two edges
    def unit(vx, vy):
        L = math.hypot(vx, vy)
        return (vx / L, vy / L)
    u1 = unit(e[0] - m[0], e[1] - m[1])
    u2 = unit(s[0] - m[0], s[1] - m[1])
    tick = 11.0
    p1 = (m[0] + u1[0] * tick, m[1] + u1[1] * tick)
    p2 = (p1[0] + u2[0] * tick, p1[1] + u2[1] * tick)
    p3 = (m[0] + u2[0] * tick, m[1] + u2[1] * tick)

    # Zoom of the Earth-Moon end. Uniform extra scale, same orientation.
    # z is small enough that the Moon, and its label, stay inside the box.
    z = 4.2
    zx, zy = 560.0, 468.0  # where Earth sits in the inset

    def Z(pt):
        # pt in unit coords; Earth at origin
        return (zx + pt[0] * scale * z, zy - pt[1] * scale * z)

    ze, zm, zs_dir = Z(E), Z(M), None
    # Sun is far; draw the Sun-bound ray only across the inset
    # 87-degree arc in the inset
    arc_r = 36.0

    # Eclipse panel in pixel space. Sun center, Earth center on one horizontal.
    # es keeps the Sun disk below the caption at y=542.
    es = 1.12
    sun = (110.0, 652.0)
    earth = (sun[0] + D * es, sun[1])
    apex = (earth[0] + apex_gap * es, earth[1])
    # tangent points: cos psi = Re/a, psi from +x (toward apex)
    psi = math.acos(Re / apex_gap)
    def tpt(sign):
        # sign +1 is north (up, smaller svg y)
        return (
            earth[0] + (Re * es) * math.cos(psi),
            earth[1] - sign * (Re * es) * math.sin(psi),
        )
    t_n, t_s = tpt(1), tpt(-1)
    # Moon on the axis, inside the cone
    moon = (earth[0] + moon_dist * es, earth[1])
    moon_px_r = moon_r * es
    # umbra half-width in px at the moon
    moon_half_px = moon_w * es
    assert moon_px_r < moon_half_px - 0.5
    # confirm cone is narrower at the moon than at Earth's limb
    limb_x = earth[0] + Re * es
    assert moon[0] > limb_x + 8
    assert apex[0] > moon[0]
    # Sun disk must not cover the caption (baseline 542, 14px type).
    assert sun[1] - Rs * es > 556, sun[1] - Rs * es
    # Zoom Moon must sit inside the inset box, below its two caption lines.
    assert 228 + 52 < zm[1] < zy < 228 + 268

    parts = []
    parts.append(
        f'<line x1="{fmt(e[0])}" y1="{fmt(e[1])}" x2="{fmt(s[0])}" y2="{fmt(s[1])}" stroke="#c8c0b4" stroke-width="1"/>'
    )
    parts.append(
        f'<line x1="{fmt(e[0])}" y1="{fmt(e[1])}" x2="{fmt(m[0])}" y2="{fmt(m[1])}" stroke="#1c1915" stroke-width="1.4"/>'
    )
    parts.append(
        f'<line x1="{fmt(m[0])}" y1="{fmt(m[1])}" x2="{fmt(s[0])}" y2="{fmt(s[1])}" stroke="#1c1915" stroke-width="1.4"/>'
    )
    parts.append(f'<circle cx="{fmt(e[0])}" cy="{fmt(e[1])}" r="4.5" fill="#1c1915"/>')
    parts.append(f'<circle cx="{fmt(m[0])}" cy="{fmt(m[1])}" r="4" fill="#1c1915"/>')
    parts.append(f'<circle cx="{fmt(s[0])}" cy="{fmt(s[1])}" r="7" fill="#8c3f1e"/>')
    parts.append(f'<text x="{fmt(e[0]-8)}" y="{fmt(e[1]+22)}" font-size="15">Earth</text>')
    parts.append(f'<text x="{fmt(m[0]+8)}" y="{fmt(m[1]-8)}" font-size="15">Moon</text>')
    parts.append(f'<text x="{fmt(s[0]-10)}" y="{fmt(s[1]+24)}" class="a" font-size="15">Sun</text>')
    parts.append(
        f'<path d="M{fmt(p1[0])} {fmt(p1[1])} L{fmt(p2[0])} {fmt(p2[1])} L{fmt(p3[0])} {fmt(p3[1])}" fill="none" stroke="#8c3f1e" stroke-width="1.2"/>'
    )
    parts.append(f'<text x="{fmt(m[0]+16)}" y="{fmt(m[1]+18)}" class="a" font-size="13">90 deg</text>')
    # 87 degree arc at Earth
    ar = 32.0
    arc_end = (e[0] + ar * c87, e[1] - ar * s87)
    parts.append(
        f'<path d="M{fmt(e[0]+ar)} {fmt(e[1])} A{ar} {ar} 0 0 0 {fmt(arc_end[0])} {fmt(arc_end[1])}" fill="none" stroke="#8c3f1e" stroke-width="1.2"/>'
    )
    parts.append(f'<text x="{fmt(e[0]+36)}" y="{fmt(e[1]-8)}" class="a" font-size="13">87 deg</text>')
    parts.append(
        f'<text x="24" y="78" class="m" font-size="14">Same scale on both axes. Sun / Moon distance = {ratio:.3f}. A true half-moon is nearer 90 deg, and the ratio is about 400.</text>'
    )

    # Zoom box. Top sits below the main-triangle Sun. Moon stays under the two lines of type.
    parts.append('<rect x="470" y="228" width="460" height="268" fill="#fffdf8" stroke="#e4dccf"/>')
    parts.append('<text x="486" y="250" font-size="15">Earth and Moon, enlarged the same way</text>')
    parts.append('<text x="486" y="270" class="m" font-size="13">Still one scale. The 3 degrees short of a right angle is the whole method.</text>')
    parts.append(
        f'<line x1="{fmt(ze[0])}" y1="{fmt(ze[1])}" x2="{fmt(ze[0]+150)}" y2="{fmt(ze[1])}" stroke="#c8c0b4" stroke-width="1"/>'
    )
    parts.append(
        f'<line x1="{fmt(ze[0])}" y1="{fmt(ze[1])}" x2="{fmt(zm[0])}" y2="{fmt(zm[1])}" stroke="#1c1915" stroke-width="1.5"/>'
    )
    # ray from moon toward sun, clipped to the box
    direction = unit_toward(zm, (zx + sec87 * scale * z, zy))
    ray_end = (zm[0] + direction[0] * 160, zm[1] + direction[1] * 160)
    parts.append(
        f'<line x1="{fmt(zm[0])}" y1="{fmt(zm[1])}" x2="{fmt(ray_end[0])}" y2="{fmt(ray_end[1])}" stroke="#1c1915" stroke-width="1.5"/>'
    )
    parts.append(f'<circle cx="{fmt(ze[0])}" cy="{fmt(ze[1])}" r="5" fill="#1c1915"/>')
    parts.append(f'<circle cx="{fmt(zm[0])}" cy="{fmt(zm[1])}" r="5" fill="#1c1915"/>')
    parts.append(f'<text x="{fmt(ze[0]-18)}" y="{fmt(ze[1]+20)}" font-size="13">Earth</text>')
    parts.append(f'<text x="{fmt(zm[0]+8)}" y="{fmt(zm[1]-6)}" font-size="13">Moon</text>')
    zar = 48.0
    zend = (ze[0] + zar * c87, ze[1] - zar * s87)
    parts.append(
        f'<path d="M{fmt(ze[0]+zar)} {fmt(ze[1])} A{zar} {zar} 0 0 0 {fmt(zend[0])} {fmt(zend[1])}" fill="none" stroke="#8c3f1e" stroke-width="1.3"/>'
    )
    parts.append(f'<text x="{fmt(ze[0]+52)}" y="{fmt(ze[1]-14)}" class="a" font-size="13">87 deg, not 90</text>')
    # right angle in the zoom
    zu1 = unit(ze[0] - zm[0], ze[1] - zm[1])
    zu2 = unit(ray_end[0] - zm[0], ray_end[1] - zm[1])
    q = 16.0
    q1 = (zm[0] + zu1[0] * q, zm[1] + zu1[1] * q)
    q2 = (q1[0] + zu2[0] * q, q1[1] + zu2[1] * q)
    q3 = (zm[0] + zu2[0] * q, zm[1] + zu2[1] * q)
    parts.append(
        f'<path d="M{fmt(q1[0])} {fmt(q1[1])} L{fmt(q2[0])} {fmt(q2[1])} L{fmt(q3[0])} {fmt(q3[1])}" fill="none" stroke="#8c3f1e" stroke-width="1.3"/>'
    )
    parts.append(f'<text x="{fmt(zm[0]+22)}" y="{fmt(zm[1]+28)}" class="a" font-size="13">90 deg</text>')

    # Eclipse
    parts.append('<text x="24" y="520" font-size="18">Lunar eclipse: the shadow narrows away from the Sun</text>')
    parts.append('<text x="24" y="542" class="m" font-size="14">Teaching sizes, not the real Sun and Earth. The cone is the common tangent. It comes to a point beyond the Moon.</text>')
    parts.append(f'<circle cx="{fmt(sun[0])}" cy="{fmt(sun[1])}" r="{fmt(Rs*es)}" fill="#f4efe6" stroke="#8c3f1e" stroke-width="1.6"/>')
    parts.append(f'<text x="{fmt(sun[0]-16)}" y="{fmt(sun[1]+6)}" class="a" font-size="14">Sun</text>')
    # Umbra first, then the Earth disk, so the cone is seen only beyond the limb.
    parts.append(
        f'<polygon points="{fmt(t_n[0])},{fmt(t_n[1])} {fmt(apex[0])},{fmt(apex[1])} {fmt(t_s[0])},{fmt(t_s[1])}" fill="#e7e0d4" stroke="#6f675c" stroke-width="1.2"/>'
    )
    parts.append(f'<circle cx="{fmt(earth[0])}" cy="{fmt(earth[1])}" r="{fmt(Re*es)}" fill="#1c1915"/>')
    parts.append(f'<text x="{fmt(earth[0]-18)}" y="{fmt(earth[1]-Re*es-8)}" font-size="14">Earth</text>')
    # extend tangents back toward the Sun so the common-tangent relation is visible
    def extend_to_sun(tp):
        # line apex -> tangent point, continue to sun circle
        dx, dy = tp[0] - apex[0], tp[1] - apex[1]
        # parametric from apex: apex + t*(tp-apex), t>1 goes past tangent away from apex toward sun? 
        # apex is to the right, sun to the left, so t from 0 at apex to 1 at tangent, t>1 continues left? 
        # vector tp-apex points left-up or left-down (toward earth and sun). Yes t>1 goes toward the sun.
        # find t where distance to sun center = Rs*es
        # Solve |apex + t*d - sun|^2 = (Rs*es)^2
        return ray_circle(apex, (dx, dy), sun, Rs * es, want="farther")
    for tp in (t_n, t_s):
        hit = extend_to_sun(tp)
        parts.append(
            f'<line x1="{fmt(tp[0])}" y1="{fmt(tp[1])}" x2="{fmt(hit[0])}" y2="{fmt(hit[1])}" stroke="#6f675c" stroke-width="1"/>'
        )
    parts.append(f'<circle cx="{fmt(moon[0])}" cy="{fmt(moon[1])}" r="{fmt(moon_px_r)}" fill="#1c1915"/>')
    parts.append(f'<text x="{fmt(moon[0]-16)}" y="{fmt(moon[1]-moon_half_px-10)}" font-size="14">Moon</text>')
    parts.append(f'<text x="{fmt(apex[0]-8)}" y="{fmt(apex[1]-8)}" class="m" font-size="13">apex</text>')
    parts.append(f'<text x="{fmt((earth[0]+moon[0])/2-30)}" y="{fmt(earth[1]+Re*es+22)}" class="m" font-size="13">umbra narrows</text>')
    parts.append('<text x="24" y="760" class="m" font-size="14">The Moon is inside the cone. A wider penumbra is left off this drawing. Angles in the triangle above are the real 90 and 87, not labels on a loose sketch.</text>')
    return "\n".join(parts)

def unit_toward(a, b):
    dx, dy = b[0] - a[0], b[1] - a[1]
    L = math.hypot(dx, dy)
    return (dx / L, dy / L)

def ray_circle(origin, direction, center, radius, want="farther"):
    # smallest t>1 intersection of origin+t*direction with circle, else the far one
    dx, dy = direction
    fx, fy = origin[0] - center[0], origin[1] - center[1]
    a = dx * dx + dy * dy
    b = 2 * (fx * dx + fy * dy)
    c = fx * fx + fy * fy - radius * radius
    disc = b * b - 4 * a * c
    # A true tangent yields a discriminant of about zero. Float noise can go slightly negative.
    if disc < 0 and disc > -1e-6 * (b * b + 1.0):
        disc = 0.0
    assert disc >= 0, disc
    sd = math.sqrt(disc)
    ts = [(-b - sd) / (2 * a), (-b + sd) / (2 * a)]
    ts = [t for t in ts if t > 1.0]
    assert ts, ts
    t = max(ts) if want == "farther" else min(ts)
    return (origin[0] + t * dx, origin[1] + t * dy)

def svg_hipparchus():
    cx, cy = 230.0, 250.0
    R = R_e
    def station(lat):
        x = cx + R * math.cos(math.radians(lat))
        y = cy - R * math.sin(math.radians(lat))  # north up
        assert abs(math.hypot(x - cx, y - cy) - R) < 1e-6
        return (x, y)
    hell = station(41)
    alex = station(31)
    assert hell[1] < alex[1]
    moon = (620.0, 210.0)
    # parallel sun rays, to the right, one from each station
    ray = 210.0
    parts = []
    parts.append(f'<circle cx="{fmt(cx)}" cy="{fmt(cy)}" r="{fmt(R)}" fill="none" stroke="#1c1915" stroke-width="1.6"/>')
    parts.append(f'<text x="{fmt(cx-18)}" y="{fmt(cy+5)}" class="m" font-size="14">Earth</text>')
    for name, pt in (("Hellespont, about 41 N", hell), ("Alexandria, about 31 N", alex)):
        parts.append(f'<circle cx="{fmt(pt[0])}" cy="{fmt(pt[1])}" r="4.5" fill="#8c3f1e"/>')
        parts.append(
            f'<line x1="{fmt(pt[0])}" y1="{fmt(pt[1])}" x2="{fmt(pt[0]+ray)}" y2="{fmt(pt[1])}" stroke="#c8c0b4" stroke-width="1.2"/>'
        )
        parts.append(
            f'<line x1="{fmt(pt[0])}" y1="{fmt(pt[1])}" x2="{fmt(moon[0])}" y2="{fmt(moon[1])}" stroke="#8c3f1e" stroke-width="1.35"/>'
        )
    parts.append(f'<text x="{fmt(hell[0]-150)}" y="{fmt(hell[1]-8)}" font-size="14">Hellespont</text>')
    parts.append(f'<text x="{fmt(alex[0]-148)}" y="{fmt(alex[1]+18)}" font-size="14">Alexandria</text>')
    parts.append(f'<text x="{fmt(hell[0]+ray-150)}" y="{fmt(hell[1]-8)}" class="m" font-size="13">Sun, same direction</text>')
    parts.append(f'<text x="{fmt(alex[0]+ray-150)}" y="{fmt(alex[1]+16)}" class="m" font-size="13">Sun, same direction</text>')
    parts.append(f'<circle cx="{fmt(moon[0])}" cy="{fmt(moon[1])}" r="7" fill="#1c1915"/>')
    parts.append(f'<text x="{fmt(moon[0]-16)}" y="{fmt(moon[1]-14)}" font-size="15">Moon</text>')
    parts.append('<text x="24" y="400" class="m" font-size="14">Both dots are on the circle. Hellespont is north of Alexandria. The grey lines are parallel. The Moon is drawn much too close, so the angle is enlarged.</text>')
    parts.append('<text x="24" y="422" class="m" font-size="14">Total at the Hellespont. At Alexandria four-fifths of the diameter was covered, so about one-fifth stayed bright.</text>')
    return "\n".join(parts)

def svg_romer_inset():
    """Replace only the bad inset. The Earth-orbit panel is not touched.

    The box stays left of the 'farther' label (x=292, y=224). Sun is on the
    left and larger than Jupiter. The umbra is the common tangent and narrows
    to an apex beyond Io. Io's center is the intersection of that boundary
    with the orbit, off the limb, and the entry arc stays on the orbit.
    """
    Rs, Rj, D = 20.0, 7.0, 78.0
    assert Rs > 2.5 * Rj
    a = Rj * D / (Rs - Rj)
    sun = (50.0, 128.0)
    jup = (sun[0] + D, sun[1])
    apex = (jup[0] + a, jup[1])
    psi = math.acos(Rj / a)

    def tpt(sign):
        return (
            jup[0] + Rj * math.cos(psi),
            jup[1] - sign * Rj * math.sin(psi),
        )

    tn, ts = tpt(1), tpt(-1)

    def boundary_y(x, tp):
        t = (x - apex[0]) / (tp[0] - apex[0])
        return apex[1] + t * (tp[1] - apex[1])

    # Intersections of the upper tangent with the orbit. Keep the one
    # between the limb and the apex: on the circle and on the boundary.
    r_orb = 27.0
    assert r_orb > Rj + 14
    dx, dy = apex[0] - tn[0], apex[1] - tn[1]
    # |tn + t*(apex-tn) - jup|^2 = r_orb^2
    fx, fy = tn[0] - jup[0], tn[1] - jup[1]
    qa = dx * dx + dy * dy
    qb = 2 * (fx * dx + fy * dy)
    qc = fx * fx + fy * fy - r_orb * r_orb
    disc = qb * qb - 4 * qa * qc
    assert disc > 0
    sd = math.sqrt(disc)
    hits = []
    for t in ((-qb - sd) / (2 * qa), (-qb + sd) / (2 * qa)):
        px, py = tn[0] + t * dx, tn[1] + t * dy
        if px > jup[0] + Rj + 8:
            hits.append((px, py, t))
    assert hits, hits
    io_x, io_y, _io_t = min(hits, key=lambda h: h[0])
    assert abs(math.hypot(io_x - jup[0], io_y - jup[1]) - r_orb) < 1e-6
    assert abs(io_y - boundary_y(io_x, tn)) < 1e-6
    half = abs(jup[1] - io_y)
    half_limb = abs(jup[1] - boundary_y(jup[0] + Rj + 1.0, tn))
    assert half < half_limb * 0.8, (half, half_limb)
    assert apex[0] > io_x + 12
    assert io_x > jup[0] + Rj + 12
    # Entry arc on the orbit, outside the cone, clear of the disk.
    ang = math.atan2(-(io_y - jup[1]), io_x - jup[0])
    ang_from = ang + 0.72
    p_from = (
        jup[0] + r_orb * math.cos(ang_from),
        jup[1] - r_orb * math.sin(ang_from),
    )
    ang_mid = ang + 0.36
    p_mid = (
        jup[0] + r_orb * math.cos(ang_mid),
        jup[1] - r_orb * math.sin(ang_mid),
    )
    assert math.hypot(p_from[0] - jup[0], p_from[1] - jup[1]) > Rj + 12
    assert p_mid[1] < boundary_y(p_mid[0], tn) - 1.0  # above the upper edge
    # Ink stays inside a box that ends before the orbit-panel label.
    for x, y in (sun, jup, apex, (io_x, io_y), p_from, tn, ts):
        assert 30 < x < 268, (x, y)
        assert 96 < y < 176, (x, y)
    cap1 = "Narrows away from the Sun."
    cap2 = "Io meets the edge on its orbit."
    assert len(cap1) < 36 and len(cap2) < 36
    text = f'''  <rect x="24" y="68" width="256" height="146" fill="#fffdf8" stroke="#e4dccf"/>
  <text x="34" y="86" font-size="13">Io enters the shadow, not Jupiter's disk</text>
  <circle cx="{fmt(sun[0])}" cy="{fmt(sun[1])}" r="{fmt(Rs)}" fill="#f4efe6" stroke="#8c3f1e" stroke-width="1.3"/>
  <text x="{fmt(sun[0]-12)}" y="{fmt(sun[1]+4)}" class="a" font-size="11">Sun</text>
  <polygon points="{fmt(tn[0])},{fmt(tn[1])} {fmt(apex[0])},{fmt(apex[1])} {fmt(ts[0])},{fmt(ts[1])}" fill="#e7e0d4" stroke="#6f675c" stroke-width="1"/>
  <line x1="{fmt(sun[0]+Rs+3)}" y1="{fmt(sun[1]-14)}" x2="{fmt(jup[0]-r_orb+2)}" y2="{fmt(sun[1]-14)}" stroke="#8c3f1e" stroke-width="1"/>
  <polygon points="{fmt(jup[0]-r_orb+2)},{fmt(sun[1]-14)} {fmt(jup[0]-r_orb-4)},{fmt(sun[1]-17)} {fmt(jup[0]-r_orb-4)},{fmt(sun[1]-11)}" fill="#8c3f1e"/>
  <circle cx="{fmt(jup[0])}" cy="{fmt(jup[1])}" r="{fmt(Rj)}" fill="#6f675c"/>
  <text x="{fmt(jup[0]-22)}" y="{fmt(jup[1]+r_orb+14)}" font-size="12">Jupiter</text>
  <circle cx="{fmt(jup[0])}" cy="{fmt(jup[1])}" r="{fmt(r_orb)}" fill="none" stroke="#c8c0b4" stroke-width="1" stroke-dasharray="3 3"/>
  <path d="M{fmt(p_from[0])} {fmt(p_from[1])} A{fmt(r_orb)} {fmt(r_orb)} 0 0 1 {fmt(io_x)} {fmt(io_y)}" fill="none" stroke="#8c3f1e" stroke-width="1.4"/>
  <circle cx="{fmt(io_x)}" cy="{fmt(io_y)}" r="3.2" fill="#8c3f1e"/>
  <text x="{fmt(io_x+6)}" y="{fmt(io_y-8)}" class="a" font-size="12">Io</text>
  <text x="34" y="192" class="m" font-size="12">{cap1}</text>
  <text x="34" y="206" class="m" font-size="12">{cap2}</text>'''
    return text

def write_aristarchus(body):
    doc = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 780" role="img">
  <title>Aristarchus quarter-moon triangle and a narrowing lunar shadow</title>
  <desc>Top: Earth, Moon, and Sun at uniform scale. The angle at the Moon is 90 degrees. The angle at Earth is 87 degrees. The Sun is 19.107 times as far as the Moon. Bottom: a larger Sun, a smaller Earth, and an umbra that narrows to an apex beyond the Moon. The Moon sits inside the cone. Sizes in the eclipse are a teaching model, not the true Sun and Earth.</desc>
  <rect width="960" height="780" fill="#fbf8f2"/>
  <style>text{{font-family:"Palatino Linotype",Palatino,"Liberation Serif",Georgia,serif;fill:#1c1915}}.m{{fill:#5e584e}}.a{{fill:#8c3f1e}}</style>
  <text x="24" y="32" font-size="20">Quarter Moon: 90 degrees at the Moon, 87 at the Earth</text>
  <text x="24" y="54" class="m" font-size="14">One scale. The triangle is skinny because 87 is so close to 90. That closeness is why the method is fragile.</text>
  {body}
</svg>
'''
    (OUT / "Aristarchus_Quarter_Moon_and_Eclipse_Shadow_Tufte.svg").write_text(doc, encoding="utf-8")

def write_hipparchus(body):
    doc = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 920 440" role="img">
  <title>Hipparchus, two stations on the Earth and a shared solar direction</title>
  <desc>Hellespont and Alexandria lie on the Earth's circle, Hellespont north of Alexandria. From each station a line goes to the Moon, and a parallel line marks the Sun's direction. The Moon is much too close, so the angle is enlarged. Latitudes are only approximately 41 and 31 degrees.</desc>
  <rect width="920" height="440" fill="#fbf8f2"/>
  <style>text{{font-family:"Palatino Linotype",Palatino,"Liberation Serif",Georgia,serif;fill:#1c1915}}.m{{fill:#5e584e}}.a{{fill:#8c3f1e}}</style>
  <text x="24" y="32" font-size="20">Two places on the Earth, one Moon, parallel sunlight</text>
  <text x="24" y="54" class="m" font-size="14">Stations are on the circle. Grey lines are parallel. The Moon is drawn much too close.</text>
  {body}
</svg>
'''
    (OUT / "Hipparchus_Lunar_Parallax_Two_Stations_Tufte.svg").write_text(doc, encoding="utf-8")

def patch_romer(inset):
    text = (OUT / "Romer_Io_Light_Time_Schematic_Tufte.svg").read_text(encoding="utf-8")
    start = text.index('  <rect x="24" y="')
    end = text.index('  <circle cx="430" cy="230"')
    text = text[:start] + inset + "\n" + text[end:]
    text = text.replace('viewBox="0 0 920 420"', 'viewBox="0 0 920 440"')
    text = text.replace('<rect width="920" height="420"', '<rect width="920" height="440"')
    (OUT / "Romer_Io_Light_Time_Schematic_Tufte.svg").write_text(text, encoding="utf-8")

if __name__ == "__main__":
    write_aristarchus(svg_aristarchus())
    write_hipparchus(svg_hipparchus())
    patch_romer(svg_romer_inset())
    print("geometry svgs written")
    print("quarter ratio", round(ratio, 3), "dot", dot, "angle", ang_e)
