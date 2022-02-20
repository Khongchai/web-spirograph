/*
    Scale radius with min of 20
*/
const radiusScale = 0.2;
const maxRadius = 40;
export default function scaleDrawRadius(radius: number) {
  return Math.min(radius * radiusScale, maxRadius);
}
