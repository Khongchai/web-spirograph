import { Vector2 } from "../../classes/DTOInterfaces/vector2";
import colors from "../../constants/colors";
import InstantDrawCycloid from "./models/Cycloid";
import { DrawerData } from "./models/DrawerData";

export class InstantDrawerEpitrochoidRenderer {
  private BASE_STEP = (Math.PI * 2) / 60;

  render({
    cycloids,
    pointsAmount,
    theta,
    timeStepScalar,
    ctx,
    canvas: { width: canvasWidth, height: canvasHeight },
    translation,
  }: DrawerData) {
    let previousPoints: Vector2 | undefined;
    let currentPoint: Vector2 | undefined;
    const step = timeStepScalar * this.BASE_STEP;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(0, 0);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    ctx.save();

    const { a, b, c, d } = ctx.getTransform();
    ctx.setTransform(
      a,
      b,
      c,
      d,
      canvasWidth / 2 + translation.x,
      canvasHeight / 2 + translation.y
    );

    for (let _ = 0; _ < pointsAmount; _++) {
      const newPoint = this._computeEpitrochoid({
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
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.stroke();

        previousPoints = currentPoint;
      }

      theta += step;
    }

    ctx.restore();
  }

  private _computeEpitrochoid({
    cycloids,
    theta,
  }: {
    cycloids: InstantDrawCycloid[];
    theta: number;
  }) {
    if (cycloids.length < 2) {
      throw new Error("Provide at least 2 cycloids");
    }

    const finalPoint = { x: 0, y: 0 };

    // Skip i = 0 because we don't need to iterate over the bounding circle
    for (let i = 1; i < cycloids.length; i++) {
      const parentCycloid = cycloids[i - 1];
      const thisCycloid = cycloids[i];
      const childCycloidRadius = thisCycloid.isOutsideOfParent
        ? thisCycloid.radius
        : -thisCycloid.radius;

      // We ask the child it needs the parent to scale its theta.
      finalPoint.x +=
        (parentCycloid.radius + childCycloidRadius) *
        Math.cos(
          theta * thisCycloid.thetaScale -
            Math.PI * 0.5 * Number(thisCycloid.isClockwise)
        );
      finalPoint.y +=
        (parentCycloid.radius + childCycloidRadius) *
        Math.sin(
          theta * thisCycloid.thetaScale +
            Math.PI * 0.5 * Number(thisCycloid.isClockwise)
        );
    }
    const rodLength = cycloids[cycloids.length - 1].rodLength;

    return {
      x: finalPoint.x + rodLength * Math.cos(theta),
      y: finalPoint.y + rodLength * Math.sin(theta),
    };
  }
}