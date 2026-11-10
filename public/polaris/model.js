// Ideal spherical Earth and a star at the north celestial pole.
// Latitude comes from position; sky altitude is calculated independently
// by projecting the fixed pole direction onto the observer's local vertical.
export function geometry(degrees) {
  const latitude = Math.max(0, Math.min(90, Number(degrees) || 0));
  const a = latitude * Math.PI / 180;
  const up = { x: Math.cos(a), y: -Math.sin(a) };
  const north = { x: -Math.sin(a), y: -Math.cos(a) };
  const pole = { x: 0, y: -1 };
  const altitude = Math.asin(Math.max(-1, Math.min(1, up.x * pole.x + up.y * pole.y))) * 180 / Math.PI;
  const centralAngle = Math.atan2(-up.y, up.x) * 180 / Math.PI;
  const zenithDistance = Math.acos(Math.max(-1, Math.min(1, up.x * pole.x + up.y * pole.y))) * 180 / Math.PI;
  return { latitude, centralAngle, altitude, zenithDistance, up, north, pole };
}
