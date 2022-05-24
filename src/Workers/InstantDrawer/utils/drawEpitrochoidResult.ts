import { Vector2 } from "../../../classes/vector2";
import { DrawerData } from "../instantDrawer.worker";
import computedEpitrochoid from "./computeEpitrochoid";

let previousPoints: Vector2;
let currentPoint: Vector2;
const BASE_STEP = (Math.PI * 2) / 60;

export default function beginDrawingEpitrochoid({
  cycloids,
  pointsAmount,
  theta,
  timeStepScalar,
  ctx,
}: Omit<DrawerData, "canvasHeight" | "canvasWidth">) {
  const step = timeStepScalar * BASE_STEP;

  for (let _ = 0; _ < pointsAmount; _++) {
    const newPoint = computedEpitrochoid({
      cycloids,
      theta,
    });

    if (!previousPoints) {
      previousPoints = newPoint;
    } else {
      currentPoint = newPoint;
      ctx.beginPath();
      ctx.moveTo(previousPoints.x, previousPoints.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.strokeStyle = "pink";
      ctx.stroke();

      previousPoints = currentPoint;
    }

    theta += step;
  }
}
