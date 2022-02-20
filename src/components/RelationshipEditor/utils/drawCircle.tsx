import { Vector2 } from "../../../types/vector2";
import scaleDrawRadius from "./scaleDrawRadius";

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
      r={scaleDrawRadius(radius)}
      cx={centerPoint.x}
      cy={centerPoint.y}
      fill="transparent"
      strokeWidth={thickness ?? 1}
      stroke={color ?? "rgba(191, 134, 252, 99)"}
    />
  );
}
