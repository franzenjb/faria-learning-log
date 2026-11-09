// Spherical geometry in modern miles; NASA rounded mean lunar size.
export const R = 1080;
export const defaults = {position:-92.8,height:4,sun:0};
export function calculate({position,height,sun}) {
  const theta = position / R, elevation = sun * Math.PI / 180;
  const localSun = theta + elevation;
  const minimumHeight = localSun >= 0 ? 0 : R * (1 / Math.cos(localSun) - 1);
  const base = {x:R*Math.sin(theta),z:R*Math.cos(theta)-R};
  const peak = {x:(R+height)*Math.sin(theta),z:(R+height)*Math.cos(theta)-R};
  const edgePosition = -R*elevation;
  return {base,peak,minimumHeight,groundLit:localSun>=-1e-10,peakLit:height>=minimumHeight-1e-9,edgePosition,gap:edgePosition-position,elevation};
}
