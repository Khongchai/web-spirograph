import { Vector2 } from "../../classes/DTOInterfaces/vector2";
import calcPointsInit, {
  fractional_lcm,
} from "../../utils/PerformanceModules/wasm/calc_points/pkg/calc_points";
import calcLinesInit, {
  calc_lines,
} from "../../utils/PerformanceModules/wasm/calc_lines/calc_lines/pkg/calc_lines";
import { DrawerData } from "./models/DrawerData";
import WebGLMultiLinesRenderer from "./WebGLRenderer";
import { Debouncer } from "../../utils/Debouncer";
import { BASE_POINTS_FOR_A_CIRCLE, BASE_STEP } from "../../constants/cycloids";

// We don't care about the return value of the init methods.
const wasmModuleInit = Promise.all([calcPointsInit(), calcLinesInit()]);

export class InstantDrawerEpitrochoidRenderer extends WebGLMultiLinesRenderer {
  private cachedCanvas?: OffscreenCanvas;

  drawerData?: DrawerData;
  private debouncer = new Debouncer();

  constructor(initialSize: Vector2, drawerData: DrawerData) {
    super({
      canvas: drawerData!.canvas,
      size: initialSize,
      devicePixelRatio: drawerData!.devicePixelRatio,
      initialTransformation: drawerData.initialTransform,
    });

    this.drawerData = drawerData;
  }

  override async render(): Promise<OffscreenCanvas> {
    return new Promise((resolve, _) => {
      // Using deboucing to help discard some of the incoming render calls if they are coming too fast.
      this.debouncer.debounce(() => {
        requestAnimationFrame(async () => {
          resolve(await this._render());
        });
      }, 0);
    });
  }

  async _render(): Promise<OffscreenCanvas> {
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

    const step = Math.max(timeStepScalar * BASE_STEP, 0.01);

    if (timeStepScalar === Number.POSITIVE_INFINITY) {
      throw new Error("Division by zero will occur, timeStepScalar is zero");
    }
    const circlePointsCompensated = BASE_POINTS_FOR_A_CIRCLE / timeStepScalar;
    const scalars = new Float64Array(cycloids.map((c) => c.thetaScale));
    const pointsAmount = circlePointsCompensated * (fractional_lcm(scalars) + 1)

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

    this.cachedCanvas = this.drawerData.canvas;

    return this.cachedCanvas;
  }
}
