import { useEffect } from "react";
import { Vector2 } from "../../../types/vector2";
import { DrawNode } from "../types";

export default function useCheckCircleCircleCollision(
  circle1Position: Vector2,
  circle1Radius: number,
  otherCircleData: DrawNode[],
  onCollide: (otherCircle: DrawNode) => void
) {
  useEffect(() => {
    otherCircleData?.forEach((c) => {
      const neighbor = { radius: c.radius, x: c.pos.x, y: c.pos.y };
      if (
        circleCircleCollision(
          { ...circle1Position, radius: circle1Radius },
          neighbor
        )
      ) {
        onCollide?.(c);
      }
    });
  }, [circle1Position, circle1Radius]);
}

function circleCircleCollision(
  circle1: { x: number; y: number; radius: number },
  circle2: { x: number; y: number; radius: number }
) {
  const distance = Math.sqrt(
    Math.pow(circle1.x - circle2.x, 2) + Math.pow(circle1.y - circle2.y, 2)
  );
  return distance < circle1.radius + circle2.radius;
}
