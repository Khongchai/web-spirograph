import { DrawerData } from "./models/DrawerData";

export interface InstantDrawerWorkerPayload {
  operation: InstantDrawerWorkerOperations;
  setParametersPayload?: SetParametersPayload;
  initializeDrawerPayload?: InitializeDrawerPayload;
  setCanvasSizePayload?: SetCanvasSizePayload;
  tranformPayload?: TransformPayload;
}

export enum InstantDrawerWorkerOperations {
  setParameters,
  initializeDrawer,
  setCanvasSize,
  transform,
}

export type SetParametersPayload = Partial<
  Omit<DrawerData, "ctx" | "canvasHeight" | "canvasWidth">
>;

export type SetCanvasSizePayload = {
  canvasWidth: number;
  canvasHeight: number;
};
export type InitializeDrawerPayload = Omit<DrawerData, "theta" | "gl"> & {
  initialTheta: number;
  canvas: OffscreenCanvas;
  canvasWidth: number;
  canvasHeight: number;
};

/**
 * TODO migrate pan payload to this as well.
 */
export type TransformPayload = {
  dx: number;
  dy: number;
  dz: number;
};
