import { CycloidRotationDirection } from "./cycloidPosition";

export default interface CycloidParams {
  animationSpeed: number;
  rodLengthScale: number;
  cycloidRotationDirection: CycloidRotationDirection;
  cycloidRadius: number;
  boundingCircleRadius: number;
  cycloidSpeedRatio: number;
}
