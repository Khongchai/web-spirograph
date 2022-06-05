import BoundingCircle from "./BoundingCircle";
import { CycloidParamsArgs } from "./CycloidParams";

export interface Configuration {
  outerMostBoundingCircle: BoundingCircle;
  cycloids: Omit<CycloidParamsArgs, "id" | "boundingCircleId">[];
  animationSpeed: number;
  currentCycloidId: number;
  mode: "Animated" | "Instant";
  scaffold: "Showing" | "Hidden";
  animationState: "Playing" | "Paused";
  clearTracedPathOnParamsChange: boolean;
  showAllCycloids: boolean;
  programOnly: {
    tracePath: boolean;
  };
  traceAllCycloids: boolean;
}
