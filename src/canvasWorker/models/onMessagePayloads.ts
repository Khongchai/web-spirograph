import BoundingCircle from "../../classes/BoundingCircle";
import Cycloid from "../../classes/Cycloid";
import { CycloidAnimationWorkerData } from "./cycloidAnimationWorkerData";

/**
 * This file contains all argument models for the onmessage function (before being mapped).
 */

//TODO there might be a way to do this wihtout the nullable types.
export interface OnMessagePayload {
  resetCanvas?: ResetCanvasPayload;
  setupCanvas?: SetupCanvasPayload;
  drawCycloid?: DrawCycloidPayload;
  traceCycloid: TraceCycloidPayload;
  workerOperations: WorkerOperation;
}

/**
 * For switch-casing
 */
export enum WorkerOperation {
  ResetCanvas = 1 << 0,
  SetupCanvas = 1 << 1,
  DrawCycloids = 1 << 2,
  TraceCycloids = 1 << 3,
}

export type SetupCanvasPayload = Omit<
  CycloidAnimationWorkerData,
  "drawContext" | "traceContext"
>;

export type ResetCanvasPayload = undefined;

export type DrawCycloidPayload = {
  cycloidsRefForCanvas: React.MutableRefObject<Cycloid[]>;
  outermostBoundingCircle: BoundingCircle;
};

export type TraceCycloidPayload = {};
