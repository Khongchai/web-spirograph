import { CycloidAnimationWorkerData } from "./cycloidAnimationWorkerData";

//TODO there might be a way to do this wihtout the nullable types.
export type OnMessagePayload = {
  resetCanvas?: ResetCanvasArgs;
  setupCanvas?: SetupCanvasArgs;
  workerOperations: WorkerOperations;
};

/**
 * For switch-casing
 */
export enum WorkerOperations {
  ResetCanvas = 1 << 0,
  SetupCanvas = 1 << 1,
}

type SetupCanvasArgs = Omit<
  CycloidAnimationWorkerData,
  "drawContext" | "traceContext"
>;

type ResetCanvasArgs = Omit<
  CycloidAnimationWorkerData,
  "drawContext" | "traceContext"
>;
