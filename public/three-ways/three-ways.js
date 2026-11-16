// Three Ways To Say Where: one spot as latitude/longitude, UTM, and State Plane.
// Uses vendored d3, topojson-client and proj4 (loaded as classic scripts before this module).
import { utmZone, utmCentralMeridian, mgrs, dms, parseLatLon, US_FT } from "./model.js";
const $ = id => document.getElementById(id);
const fmt = (v, d = 0) => v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const state = { lat: 26.64, lon: -81.8722 };
let land = null, zones = null;

export function convert(lat, lon) {
  const z = utmZone(lat, lon), south = lat < 0;
  const inUtm = lat >= -80 && lat < 84;
  const out = { lat, lon, zone: z, south };
  if (inUtm) {
    const [E, N] = proj4("EPSG:4326", `+proj=utm +zone=${z}${south ? " +south" : ""} +datum=WGS84 +units=m +no_defs`, [lon, lat]);
    Object.assign(out, { E, N, mgrs: mgrs(z, lat, E, N) });
  }
  const f = zones && zones.features.find(f => d3.geoContains(f, [lon, lat]));
  if (f) {
    const [x, y] = proj4("EPSG:4326", f.properties.proj + " +no_defs", [lon, lat]);
    out.sp = { ...f.properties, x, y, xft: x / US_FT, yft: y / US_FT };
  }
  return out;
}
window.threeWaysConvert = convert; // for automated checks

function readout(o) {
  const ns = o.lat >= 0 ? "N" : "S", ew = o.lon >= 0 ? "E" : "W";
  $("o-dd").textContent = `${fmt(Math.abs(o.lat), 5)}° ${ns}, ${fmt(Math.abs(o.lon), 5)}° ${ew}`;
  $("o-dms").textContent = `${dms(o.lat, "N", "S")}, ${dms(o.lon, "E", "W")}`;
  $("o-signed").textContent = `${o.lat.toFixed(5)}, ${o.lon.toFixed(5)}`;
  if (o.E !== undefined) {
    const cm = utmCentralMeridian(o.zone), off = (o.E - 500000) / 1000;
    $("o-zone").innerHTML = `${o.zone}${o.south ? "S" : "N"} <small>${o.south ? "south" : "north"} of the equator</small>`;
    $("o-utm").innerHTML = `${fmt(o.E)} m E<br>${fmt(o.N)} m N`;
    $("o-cm").innerHTML = `${fmt(Math.abs(off), 1)} km ${off < 0 ? "west" : "east"} <small>of ${Math.abs(cm)}° ${cm < 0 ? "W" : "E"}</small>`;
    $("o-mgrs").textContent = o.mgrs;
  } else {
    for (const id of ["o-zone", "o-utm", "o-cm", "o-mgrs"]) $(id).innerHTML = "<small>Polar cap: UTM stops at 84° N and 80° S</small>";
  }
  if (o.sp) {
    const p = o.sp;
    $("o-spz").innerHTML = `${p.name} <small>FIPS ${p.fips} · ${p.method}</small>`;
    $("o-spm").innerHTML = `${fmt(p.x, 2)} m E<br>${fmt(p.y, 2)} m N`;
    $("o-spf").innerHTML = `${fmt(p.xft, 2)} ft E<br>${fmt(p.yft, 2)} ft N`;
    $("o-epsg").innerHTML = `EPSG:${p.epsg} <small>meters</small>${p.epsgFt ? ` · EPSG:${p.epsgFt} <small>US feet</small>` : ` <small>(no official US-feet code; feet converted)</small>`}`;
  } else {
    $("o-spz").innerHTML = "<small>Outside the United States State Plane zones</small>";
    for (const id of ["o-spm", "o-spf", "o-epsg"]) $(id).textContent = "—";
  }
}

const TOP = 18, LAT_N = 84, LAT_S = -80;
function drawWorld(o) {
  const svg = d3.select("#tw-world"), w = Math.max(300, svg.node().parentNode.clientWidth);
  const k = w / 360, h = TOP + (LAT_N - LAT_S) * k + 4;
  const X = lon => (lon + 180) * k, Y = lat => TOP + (LAT_N - lat) * k;
  const proj = d3.geoEquirectangular().scale(k * 180 / Math.PI).translate([w / 2, TOP + LAT_N * k]).clipExtent([[0, TOP], [w, h - 4]]);
  svg.attr("viewBox", `0 0 ${w} ${h}`).attr("height", h).selectAll("*").remove();
  svg.append("path").attr("class", "land").attr("d", d3.geoPath(proj)(land));
  const lines = d3.range(0, 61).map(i => -180 + 6 * i);
  svg.append("g").selectAll("line").data(lines).join("line").attr("class", "zline").attr("x1", X).attr("x2", X).attr("y1", Y(LAT_N)).attr("y2", Y(LAT_S));
  svg.append("line").attr("class", "equator").attr("x1", 0).attr("x2", w).attr("y1", Y(0)).attr("y2", Y(0));
  svg.append("text").attr("x", 3).attr("y", Y(0) - 4).attr("font-size", 11).text("Equator · N zones above, S below");
  const lit = o.E !== undefined ? o.zone : null;
  if (lit) {
    const west = -180 + 6 * (lit - 1);
    svg.append("rect").attr("class", "zone-lit").attr("x", X(west)).attr("width", 6 * k).attr("y", o.south ? Y(0) : Y(LAT_N)).attr("height", o.south ? (0 - LAT_S) * k : LAT_N * k);
  }
  const fs = w < 520 ? 10 : 11;
  const shown = [1, 10, 20, 30, 40, 50, 60].filter(n => !lit || Math.abs(n - lit) > (w < 520 ? 3 : 1));
  svg.append("g").selectAll("text").data(shown).join("text").attr("x", n => X(-177 + 6 * (n - 1))).attr("y", TOP - 5).attr("text-anchor", "middle").attr("font-size", fs).text(d => d);
  if (lit) svg.append("text").attr("class", "lab-lit").attr("x", X(-177 + 6 * (lit - 1))).attr("y", TOP - 5).attr("text-anchor", "middle").attr("font-size", fs + 1).text(`${lit}${o.south ? "S" : "N"}`);
  svg.append("circle").attr("class", "dot").attr("cx", X(o.lon)).attr("cy", Y(Math.max(LAT_S, Math.min(LAT_N, o.lat)))).attr("r", 4.5);
  svg.on("click", ev => { const [px, py] = d3.pointer(ev); const lon = px / k - 180, lat = LAT_N - (py - TOP) / k; if (lat <= 90 && lat >= -90) select(lat, Math.max(-180, Math.min(179.999, lon))); });
}
function drawUS(o) {
  const svg = d3.select("#tw-us"), w = Math.max(300, svg.node().parentNode.clientWidth), h = Math.round(w * 0.6);
  const proj = d3.geoAlbersUsa().fitExtent([[4, 4], [w - 4, h - 4]], zones), path = d3.geoPath(proj);
  svg.attr("viewBox", `0 0 ${w} ${h}`).attr("height", h).selectAll("*").remove();
  const litFips = o.sp ? o.sp.fips : null;
  svg.append("g").selectAll("path").data(zones.features).join("path").attr("class", d => "sp" + (d.properties.fips === litFips ? " lit" : "")).attr("d", path)
    .append("title").text(d => `${d.properties.name} · FIPS ${d.properties.fips} · ${d.properties.method}`);
  if (o.sp) {
    const f = zones.features.find(f => f.properties.fips === litFips); const p = proj([o.lon, o.lat]);
    if (p) {
      svg.append("circle").attr("class", "dot").attr("cx", p[0]).attr("cy", p[1]).attr("r", 4.5);
      const right = p[0] < w * 0.62;
      svg.append("text").attr("class", "lab-lit").attr("x", p[0] + (right ? 9 : -9)).attr("y", p[1] + 4).attr("text-anchor", right ? "start" : "end").attr("font-size", w < 520 ? 11 : 13).text(f.properties.name);
    }
  }
  svg.on("click", ev => { const ll = proj.invert(d3.pointer(ev)); if (ll) select(ll[1], ll[0]); });
}
function render() { const o = convert(state.lat, state.lon); readout(o); drawWorld(o); drawUS(o); }
function select(lat, lon, fromInput) {
  state.lat = lat; state.lon = lon; $("tw-err").hidden = true;
  if (!fromInput) $("tw-in").value = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
  render();
}
async function init() {
  const [topo, sp] = await Promise.all([fetch("/three-ways/data/land-110m.json").then(r => r.json()), fetch("/three-ways/data/spcs83-zones.json").then(r => r.json())]);
  land = topojson.feature(topo, topo.objects.land); zones = sp;
  $("tw-form").addEventListener("submit", e => { e.preventDefault(); const p = parseLatLon($("tw-in").value); if (!p) { $("tw-err").textContent = "Type a latitude and longitude, like 26.64, -81.8722 or 26°38′24″N 81°52′20″W."; $("tw-err").hidden = false; return; } select(p.lat, p.lon, true); });
  document.querySelectorAll("[data-ll]").forEach(a => a.addEventListener("click", e => { e.preventDefault(); const [la, lo] = a.dataset.ll.split(",").map(Number); select(la, lo); }));
  const q = new URLSearchParams(location.search).get("ll"); const p = q && parseLatLon(q); if (p) { state.lat = p.lat; state.lon = p.lon; $("tw-in").value = q; }
  render(); let t; addEventListener("resize", () => { clearTimeout(t); t = setTimeout(render, 150); });
  document.documentElement.dataset.twReady = "1";
}
init();
