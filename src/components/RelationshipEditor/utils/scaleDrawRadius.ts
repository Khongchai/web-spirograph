const radiusScale = 0.2;
const minRadius = 7;
const maxRadius = 100;
/**
 * This function must be called everytime something with a radius is drawn onto the screen.
 */
export default function scaleDrawRadius(radius: number) {
  return Math.min(maxRadius, Math.max(radius * radiusScale, minRadius));
}
