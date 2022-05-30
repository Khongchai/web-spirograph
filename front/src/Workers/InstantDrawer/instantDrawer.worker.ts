import computedEpitrochoid from "./utils/computeEpitrochoid";
import {
  InitializeDrawerPayload,
  InstantDrawerWorkerOperations,
  InstantDrawerWorkerPayload,
  SetParametersPayload,
} from "./instantDrawerWorkerPayloads";
import InstantDrawCycloid from "./models/Cycloid";
import beginDrawingEpitrochoid from "./utils/drawEpitrochoidResult";
import { createTextChangeRange } from "typescript";

export interface DrawerData {
  cycloids: InstantDrawCycloid[];
  theta: number;

  /**
   * Number of points to draw.
   *
   * More points = more processing time.
   */
  pointsAmount: number;

  ctx: OffscreenCanvasRenderingContext2D;

  canvasWidth: number;
  canvasHeight: number;

  timeStepScalar: number;
}

let drawerData: DrawerData;

onmessage = ({ data }: { data: InstantDrawerWorkerPayload }) => {
  switch (data.operation) {
    case InstantDrawerWorkerOperations.setParameters: {
      if (!drawerData) {
        throw new Error("Call initializeDrawer first");
      }

      const { cycloids, pointsAmount, theta } =
        data.setParametersPayload as SetParametersPayload;

      // Zero inclusive
      if (pointsAmount != null || pointsAmount != undefined) {
        drawerData.pointsAmount = pointsAmount;
      }

      // Zero inclusive
      if (theta != null || theta != undefined) {
        drawerData.theta = theta;
      }

      // TODO only assign some fields, man
      if (cycloids) {
        drawerData.cycloids = cycloids;
      }

      const { ctx, canvasHeight: h, canvasWidth: w } = drawerData;
      ctx.clearRect(w / 2, h / 2, w, h);
      beginDrawingEpitrochoid(drawerData);

      break;
    }

    // 1. assign values to params
    // 2. begin canvas
    case InstantDrawerWorkerOperations.initializeDrawer: {
      const params = data.initializeDrawerPayload as InitializeDrawerPayload;
      const {
        canvas,
        canvasHeight,
        canvasWidth,
        cycloids,
        initialTheta,
        pointsAmount,
        timeStepScalar,
      } = params;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.translate(canvas.width / 2, canvas.height / 2);

      drawerData = {
        ctx,
        cycloids: cycloids,
        pointsAmount: pointsAmount,
        theta: initialTheta,
        canvasHeight,
        canvasWidth,
        timeStepScalar,
      };

      // beginDrawingEpitrochoid(drawerData);

      break;
    }
  }
};
