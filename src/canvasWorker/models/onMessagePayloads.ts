import BoundingCircle from "../../classes/BoundingCircle";
import Cycloid from "../../classes/Cycloid";
import CycloidControls from "../../classes/CycloidControls";
import { Vector2 } from "../../types/vector2";
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
  cycloidControls: React.MutableRefObject<CycloidControls>;
  panRef: React.MutableRefObject<Vector2>;
  pointsToTrace: React.MutableRefObject<Vector2[]>;
  cycloidsRefForCanvas: React.MutableRefObject<Cycloid[]>;
  outermostBoundingCircle: BoundingCircle;
};

export type TraceCycloidPayload = {};
