import { DrawNode } from "../types";

export default function circleCircleCollision(
  circle1: { x: number; y: number; radius: number },
  circle2: { x: number; y: number; radius: number }
) {
  const distance = Math.sqrt(
    Math.pow(circle1.x - circle2.x, 2) + Math.pow(circle1.y - circle2.y, 2)
  );
  return distance < circle1.radius + circle2.radius;
}
