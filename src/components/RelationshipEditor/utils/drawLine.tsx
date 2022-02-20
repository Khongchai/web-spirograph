import { Vector2 } from "../../../types/vector2";

export default function drawLine({
  startPoint,
  endPoint,
}: {
  startPoint: Vector2;
  endPoint: Vector2;
}) {
  return (
    <line
      x1={startPoint.x}
      y1={startPoint.y}
      x2={endPoint.x}
      y2={endPoint.y}
      strokeWidth={1}
      stroke={"rgba(231, 210, 253, 99)"}
    />
  );
}
