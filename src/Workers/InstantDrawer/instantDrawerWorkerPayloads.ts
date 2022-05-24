import { DrawerArguments } from "./instantDrawer.worker";

export interface InstantDrawerWorkerPayload {
  operation: InstantDrawerWorkerOperations;
  setParametersPayload?: SetParametersPayload;
  initializeDrawerPayload?: InitializeDrawerPayload;
}

export enum InstantDrawerWorkerOperations {
  setParameters,
  initializeDrawer,
}

export type SetParametersPayload = Partial<DrawerArguments>;

export type InitializeDrawerPayload = Exclude<DrawerArguments, "theta"> & {
  initialTheta: number;
  canvas: OffscreenCanvas;
  canvasWidth: number;
  canvasHeight: number;
};
