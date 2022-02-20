import { Vector2 } from "../../../types/vector2";

export default function drawCircle({
  radius,
  centerPoint,
  color,
  thickness,
  key,
}: {
  radius: number;
  centerPoint: Vector2;
  color?: string;
  thickness?: number;
  key: any;
}): JSX.IntrinsicElements["circle"] {
  return (
    <circle
      key={key}
      r={scaleRadius(radius)}
      cx={centerPoint.x}
      cy={centerPoint.y}
      fill="transparent"
      strokeWidth={thickness ?? 1}
      stroke={color ?? "rgba(191, 134, 252, 99)"}
    />
  );
}

/*
    Scale radius with min of 20
*/
const radiusScale = 0.2;
const minRadius = 20;
function scaleRadius(radius: number) {
  return Math.min(radius * radiusScale, minRadius);
}
