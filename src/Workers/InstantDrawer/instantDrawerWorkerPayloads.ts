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

//TODO add canvas to this
export type InitializeDrawerPayload = Exclude<DrawerArguments, "theta"> & {
  initialTheta: number;
  canvas: HTMLCanvasElement;
  canvasWidth: number;
  canvasHeight: number;
};
