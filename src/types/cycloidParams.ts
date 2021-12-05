import { CycloidDirection } from "./cycloidDirection";
import { CycloidPosition } from "./cycloidPosition";

export default interface CycloidParams {
  animationSpeed: number;
  rodLengthScale: number;
  cycloidDirection: CycloidDirection;
  cycloidRadius: number;
  boundingCircleRadius: number;
  cycloidSpeedRatio: number;
}
