// Pure helpers for the Three Ways To Say Where interactive. No DOM, no libraries.
export const US_FT = 1200 / 3937; // one US survey foot in meters

export function utmZone(lat, lon) {
  let lo = ((lon + 180) % 360 + 360) % 360 - 180;
  let z = Math.floor((lo + 180) / 6) + 1; if (z > 60) z = 60;
  if (lat >= 56 && lat < 64 && lo >= 3 && lo < 12) z = 32; // southwest Norway
  if (lat >= 72 && lat < 84) { // Svalbard
    if (lo >= 0 && lo < 9) z = 31; else if (lo >= 9 && lo < 21) z = 33;
    else if (lo >= 21 && lo < 33) z = 35; else if (lo >= 33 && lo < 42) z = 37;
  }
  return z;
}
export const utmCentralMeridian = z => -183 + 6 * z;
export function bandLetter(lat) {
  if (lat < -80 || lat > 84) return null;
  return "CDEFGHJKLMNPQRSTUVWX"[Math.min(19, Math.floor((lat + 80) / 8))];
}
// MGRS / USNG from UTM easting and northing. Digits are truncated, as the standard requires.
export function mgrs(zone, lat, E, N) {
  const band = bandLetter(lat); if (!band) return null;
  const set = ((zone - 1) % 6) + 1;
  const cols = ["ABCDEFGH", "JKLMNPQR", "STUVWXYZ"][(set - 1) % 3];
  const rows = "ABCDEFGHJKLMNPQRSTUV";
  const col = cols[Math.floor(E / 1e5) - 1];
  const row = rows[(Math.floor(N / 1e5) + (set % 2 === 0 ? 5 : 0)) % 20];
  const pad = v => String(Math.floor(v % 1e5)).padStart(5, "0");
  return `${zone}${band} ${col}${row} ${pad(E)} ${pad(N)}`;
}
export function dms(v, pos, neg) {
  const h = v < 0 ? neg : pos; let a = Math.abs(v);
  let d = Math.floor(a), m = Math.floor((a - d) * 60), s = ((a - d) * 60 - m) * 60;
  s = Math.round(s * 10) / 10; if (s >= 60) { s = 0; m++; } if (m >= 60) { m = 0; d++; }
  return `${d}° ${String(m).padStart(2, "0")}′ ${s.toFixed(1).padStart(4, "0")}″ ${h}`;
}
// Accepts "26.64, -81.8722", "26.64 N 81.8722 W", or "26°38′24″N 81°52′20″W".
export function parseLatLon(text) {
  const t = String(text).trim().toUpperCase().replace(/[°º′'″"]/g, " ").replace(/\s+/g, " ");
  let parts;
  const hemi = t.match(/^(.*?[NS])\s*,?\s*(.*?[EW])$/);
  if (hemi) parts = [hemi[1], hemi[2]];
  else if (t.includes(",")) parts = t.split(",");
  else { const n = t.split(" "); if (n.length !== 2) return null; parts = n; }
  if (parts.length !== 2) return null;
  const one = (p, posL, negL) => {
    p = p.trim(); let sign = 1;
    if (p.endsWith(negL)) { sign = -1; p = p.slice(0, -1); } else if (p.endsWith(posL)) p = p.slice(0, -1);
    const nums = p.trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if (!nums.length || nums.length > 3 || nums.some(n => !Number.isFinite(n))) return null;
    if (nums[0] < 0) { sign *= -1; nums[0] = -nums[0]; }
    return sign * (nums[0] + (nums[1] || 0) / 60 + (nums[2] || 0) / 3600);
  };
  const lat = one(parts[0], "N", "S"), lon = one(parts[1], "E", "W");
  if (lat === null || lon === null || Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  return { lat, lon };
}
