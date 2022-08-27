import { Vector2 } from "../../classes/DTOInterfaces/vector2";
import { CanvasPanState } from "../../utils/CanvasManagers/CanvasPanManagers";
import { DrawerData } from "./instantDrawer.worker";

export interface InstantDrawerWorkerPayload {
  operation: InstantDrawerWorkerOperations;
  setParametersPayload?: SetParametersPayload;
  initializeDrawerPayload?: InitializeDrawerPayload;
  setCanvasSizePayload?: SetCanvasSizePayload;
  panPayload?: PanPayload;
}

export type PanPayload = {
  panState: CanvasPanState;
};

export enum InstantDrawerWorkerOperations {
  setParameters,
  initializeDrawer,
  setCanvasSize,
  pan,
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
