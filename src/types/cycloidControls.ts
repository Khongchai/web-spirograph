import CycloidParams from "./cycloidParams";

export default interface CycloidControls {
  cycloids: CycloidParams[];
  animationSpeed: number;
  nestedLevel: number;
  currentCycloid: number;
  mode: "Animated" | "Instant";
  scaffold: "Showing" | "Hidden";
  animationState: "Playing" | "Paused";
}
