import { Vector2 } from "../../classes/DTOInterfaces/vector2";
import calcPointsInit, {
  fractional_lcm,
} from "../../utils/PerformanceModules/wasm/calc_points/pkg/calc_points";
import calcLinesInit, {
  calc_lines,
} from "../../utils/PerformanceModules/wasm/calc_lines/calc_lines/pkg/calc_lines";
import { DrawerData } from "./models/DrawerData";
import WebGLMultiLinesRenderer from "./WebGLRenderer";

// We don't care about the return value of the init methods.
const wasmModuleInit = Promise.all([calcPointsInit(), calcLinesInit()]);

export class InstantDrawerEpitrochoidRenderer extends WebGLMultiLinesRenderer {
  private readonly BASE_POINTS_FOR_A_CIRCLE = 550;
  private readonly BASE_STEP = (Math.PI * 2) / this.BASE_POINTS_FOR_A_CIRCLE;
  drawerData?: DrawerData;

  constructor(initialSize: Vector2, drawerData: DrawerData) {
    super({
      canvas: drawerData!.canvas,
      size: initialSize,
      devicePixelRatio: drawerData!.devicePixelRatio,
      // TODO @khongchai here.
      // initialTransformation
    });

    this.drawerData = drawerData;
  }

  override async render(): Promise<void> {
    const then = performance.now();

    // Wait until wasm modules are initialized (will be slow only the first load).
    await wasmModuleInit;
    if (!this.drawerData) {
      throw new Error(
        "drawerData should be assigned a value before calling this method."
      );
    }

    if (this.drawerData!.cycloids.length < 2) {
      throw new Error("Provide at least 2 cycloids.");
    }

    let { cycloids, theta, timeStepScalar, gl: _ } = this.drawerData;

    const step = Math.max(timeStepScalar * this.BASE_STEP, 0.01);

    const circlePointsCompensated =
      this.BASE_POINTS_FOR_A_CIRCLE / timeStepScalar;
    const scalars = new Float64Array(cycloids.map((c) => c.thetaScale));
    const pointsAmount = Math.floor(
      circlePointsCompensated * fractional_lcm(scalars) + 1
    );

    const dataForComputedEpitrochoid = [];
    for (let i = 1; i < cycloids.length; i++) {
      const parentCycloid = cycloids[i - 1];
      const thisCycloid = cycloids[i];
      dataForComputedEpitrochoid.push([
        parentCycloid.radius,
        thisCycloid.isOutsideOfParent
          ? thisCycloid.radius
          : -thisCycloid.radius,
        thisCycloid.isClockwise ? 1 : 0,
        thisCycloid.thetaScale,
      ]);
    }

    const points = calc_lines(
      pointsAmount,
      theta,
      step,
      dataForComputedEpitrochoid,
      this.drawerData!.cycloids[this.drawerData!.cycloids.length - 1].rodLength
    );

    super.setPoints(new Float64Array(points));
    super.render();

    const now = performance.now();
    console.log(
      "For " +
        pointsAmount +
        ", this operation took in seconds: " +
        (now - then) / 1000
    );
  }
}
