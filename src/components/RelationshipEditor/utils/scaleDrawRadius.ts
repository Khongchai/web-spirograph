const radiusScale = 0.2;
const maxRadius = 7;
export default function scaleDrawRadius(radius: number) {
  return Math.max(radius * radiusScale, maxRadius);
}
