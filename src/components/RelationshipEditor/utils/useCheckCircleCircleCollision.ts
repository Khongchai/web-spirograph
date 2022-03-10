import { useEffect } from "react";
import { Vector2 } from "../../../types/vector2";
import { DrawNode } from "../types";
import scaleDrawRadius from "./scaleDrawRadius";

export default function useCheckCircleCircleCollision(
  thisCirclePosition: Vector2,
  thisCircleRadius: number,
  otherCircleData: DrawNode[],
  onCollide: (otherCircle: DrawNode) => void
) {
  useEffect(() => {
    otherCircleData?.forEach((c) => {
      const neighbor = { radius: c.radius, x: c.pos.x, y: c.pos.y };
      if (
        circleCircleCollision(
          { ...thisCirclePosition, radius: thisCircleRadius },
          neighbor
        )
      ) {
        onCollide?.(c);
      }
    });
  }, [thisCirclePosition, thisCircleRadius]);
}

function circleCircleCollision(
  circle1: { x: number; y: number; radius: number },
  circle2: { x: number; y: number; radius: number }
) {
  const distance = Math.sqrt(
    Math.pow(circle1.x - circle2.x, 2) + Math.pow(circle1.y - circle2.y, 2)
  );
  return (
    distance < scaleDrawRadius(circle1.radius) + scaleDrawRadius(circle2.radius)
  );
}
