import { DrawerData } from "./instantDrawer.worker";

export interface InstantDrawerWorkerPayload {
  operation: InstantDrawerWorkerOperations;
  setParametersPayload?: SetParametersPayload;
  initializeDrawerPayload?: InitializeDrawerPayload;
  setCanvasSizePayload?: SetCanvasSizePayload;
}

export enum InstantDrawerWorkerOperations {
  setParameters,
  initializeDrawer,
  setCanvasSize,
}

export type SetParametersPayload = Partial<
  Omit<DrawerData, "ctx" | "canvasHeight" | "canvasWidth">
>;

export type SetCanvasSizePayload = Pick<
  DrawerData,
  "canvasHeight" | "canvasWidth"
>;

export type InitializeDrawerPayload = Omit<DrawerData, "theta" | "ctx"> & {
  initialTheta: number;
  canvas: OffscreenCanvas;
  canvasWidth: number;
  canvasHeight: number;
};
