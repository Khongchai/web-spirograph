import "./rotationDirection";
import { RotationDirection } from "./rotationDirection";

export interface CycloidParamsArgs {
  rodLengthScale: number;
  rotationDirection: RotationDirection;
  radius: number;
  animationSpeedScale: number;
  moveOutSideOfParent: boolean;
  boundingColor: string;
  id: number;
  boundingCircleId: number;
}
