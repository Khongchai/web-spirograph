const radiusScale = 0.2;
const minRadius = 7;
const maxRadius = 100;
export default function scaleDrawRadius(radius: number) {
  return Math.min(maxRadius, Math.max(radius * radiusScale, minRadius));
}
