import { Vector2 } from "../../../classes/interfaces/vector2";
import { DrawerData } from "../instantDrawer.worker";
import computedEpitrochoid from "./computeEpitrochoid";

export default function beginDrawingEpitrochoid({
  cycloids,
  pointsAmount,
  theta,
  timeStepScalar,
  ctx,
  canvasHeight,
  canvasWidth,
}: DrawerData) {
  let previousPoints: Vector2 | undefined;
  let currentPoint: Vector2 | undefined;
  const BASE_STEP = (Math.PI * 2) / 60;
  const step = timeStepScalar * BASE_STEP;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.save();

  ctx.translate(canvasWidth / 2, canvasHeight / 2);

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

  ctx.restore();
}
