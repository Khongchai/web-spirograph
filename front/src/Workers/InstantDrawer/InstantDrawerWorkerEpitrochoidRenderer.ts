import { Vector2 } from "../../classes/DTOInterfaces/vector2";
import colors from "../../constants/colors";
import { fractionalLcm } from "../../utils/math";
import init, {
  fractional_lcm,
} from "../../utils/PerformanceModules/wasm/calc_points/pkg/calc_points";
import InstantDrawCycloid from "./models/Cycloid";
import { DrawerData } from "./models/DrawerData";

interface Renderer {
  render(): void;
}

export class InstantDrawerEpitrochoidRenderer {
  private BASE_POINTS_FOR_A_CIRCLE = 60;
  private BASE_STEP = (Math.PI * 2) / this.BASE_POINTS_FOR_A_CIRCLE;
  private initDone = init();

  async render({
    //TODO For this class to be able to implement the Renderer interface,
    // these parameters should be passed through the constructor instead.
    cycloids,
    theta,
    timeStepScalar,
    ctx,
    canvas: { width: canvasWidth, height: canvasHeight },
    translation,
  }: DrawerData): Promise<void> {
    await this.initDone;

    let previousPoints: Vector2 | undefined;
    let currentPoint: Vector2 | undefined;
    const step = Math.max(timeStepScalar * this.BASE_STEP, 0.01);
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

    const circlePointsCompensated =
      this.BASE_POINTS_FOR_A_CIRCLE / timeStepScalar;
    const scalars = new Float64Array(cycloids.map((c) => c.thetaScale));
    const points = circlePointsCompensated * fractional_lcm(scalars) + 1;

    for (let _ = 0; _ < points; _++) {
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
