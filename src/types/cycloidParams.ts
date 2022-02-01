import BoundingCircle from "../classes/BoundingCircle";
import { CycloidDirection } from "./cycloidDirection";

export default interface CycloidParams {
  rodLengthScale: number;
  rotationDirection: CycloidDirection;
  cycloidRadius: number;
  animationSpeedScale: number;
  moveOutSideOfParent: boolean;

  //For referencing programmatically, not meant to be used by the user
  boundingCircleRadius: number;

  /*
   * The parent element that the cycloid will be rendered inside or outside of,
   * Null will default to the outermost parent element.
   */
  boundingCircle: BoundingCircle | null;
}
