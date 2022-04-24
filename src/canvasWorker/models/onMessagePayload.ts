import { CycloidAnimationWorkerData } from "./cycloidAnimationWorkerData";

export type OnMessagePayload = Omit<
  CycloidAnimationWorkerData,
  "drawContext" | "traceContext"
>;
