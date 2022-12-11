import { Vector2 } from "../../classes/DTOInterfaces/vector2";
import init, {
  fractional_lcm,
} from "../../utils/PerformanceModules/wasm/calc_points/pkg/calc_points";
import InstantDrawCycloid from "./models/Cycloid";
import { DrawerData } from "./models/DrawerData";
import WebGLMultiLinesRenderer from "./WebGLRenderer";

export class InstantDrawerEpitrochoidRenderer extends WebGLMultiLinesRenderer {
  private readonly BASE_POINTS_FOR_A_CIRCLE = 550;
  private readonly BASE_STEP = (Math.PI * 2) / this.BASE_POINTS_FOR_A_CIRCLE;
  private readonly lcmModuleInitPromise = init();
  drawerData?: DrawerData;

  constructor(initialSize: Vector2, drawerData: DrawerData) {
    super({
      canvas: drawerData!.canvas,
      size: initialSize,
      devicePixelRatio: drawerData!.devicePixelRatio,
    });

    this.drawerData = drawerData;
  }

  override async render(): Promise<void> {
    const then = performance.now();

    await this.lcmModuleInitPromise;
    if (!this.drawerData) {
      throw new Error(
        "drawerData should be assigned a value before calling this method."
      );
    }

    let {
      cycloids,
      theta,
      timeStepScalar,
      gl: _,
      canvas: { width: canvasWidth, height: canvasHeight },
      translation,
    } = this.drawerData;

    let previousPoint: Vector2 | undefined;
    let currentPoint: Vector2 | undefined;
    const step = Math.max(timeStepScalar * this.BASE_STEP, 0.01);

    const circlePointsCompensated =
      this.BASE_POINTS_FOR_A_CIRCLE / timeStepScalar;
    const scalars = new Float64Array(cycloids.map((c) => c.thetaScale));
    const pointsAmount = Math.floor(
      circlePointsCompensated * fractional_lcm(scalars) + 1
    );
    const points: number[] = [];

    // TODO @khongchai change to rust function.
    for (let _ = 0; _ < pointsAmount; _++) {
      const newPoint = this._computeEpitrochoid({
        cycloids,
        theta,
      });

      if (!previousPoint) {
        previousPoint = newPoint;
      } else {
        currentPoint = newPoint;

        points.push(
          previousPoint.x,
          previousPoint.y,
          currentPoint.x,
          currentPoint.y
        );

        previousPoint = currentPoint;
      }

      theta += step;
    }
    super.setPoints(points);
    super.render();

    const now = performance.now();
    console.log(
      "For " +
        pointsAmount +
        ", this operation took in seconds: " +
        (now - then) / 1000
    );
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
