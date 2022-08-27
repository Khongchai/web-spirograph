import { Vector2 } from "../../../classes/DTOInterfaces/vector2";
import colors from "../../../constants/colors";
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
  translation,
}: DrawerData) {
  let previousPoints: Vector2 | undefined;
  let currentPoint: Vector2 | undefined;
  const BASE_STEP = (Math.PI * 2) / 60;
  const step = timeStepScalar * BASE_STEP;
  ctx.translate(0, 0);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx.save();

  ctx.translate(
    canvasWidth / 2 + translation.x,
    canvasHeight / 2 + translation.y
  );

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
      ctx.strokeStyle = colors.purple.vivid;
      ctx.stroke();

      previousPoints = currentPoint;
    }

    theta += step;
  }

  ctx.restore();
}
