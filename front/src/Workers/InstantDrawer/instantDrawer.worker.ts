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

      Object.assign(drawerData, data.setParametersPayload);

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

      drawerData = {
        ctx,
        cycloids: cycloids,
        pointsAmount: pointsAmount,
        theta: initialTheta,
        canvasHeight,
        canvasWidth,
        timeStepScalar,
      };

      beginDrawingEpitrochoid(drawerData);

      break;
    }
  }
};
