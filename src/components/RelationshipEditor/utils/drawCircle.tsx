import { Vector2 } from "../../../types/vector2";
import "./cycloid-svg-node.css";

export default function drawCircle({
  radius,
  centerPoint,
  color,
  thickness,
  key,
  onPointerEnter,
  onPointerOut,
}: {
  radius: number;
  centerPoint: Vector2;
  color?: string;
  thickness?: number;
  key: any;
  onPointerEnter?: VoidFunction;
  onPointerOut?: VoidFunction;
}): JSX.IntrinsicElements["circle"] {
  return (
    <circle
      onPointerEnter={onPointerEnter}
      onPointerOut={onPointerOut}
      className="cycloid-svg-node"
      key={key}
      r={radius}
      cx={centerPoint.x}
      cy={centerPoint.y}
      fill="transparent"
      strokeWidth={thickness ?? 1}
      stroke={color ?? "rgba(191, 134, 252, 99)"}
    />
  );
}
