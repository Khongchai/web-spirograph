import BoundingCircle from "../classes/BoundingCircle";
import { CycloidDirection } from "./cycloidDirection";

export default interface CycloidParams {
  /*
   * Rod length's scale. This allows the rod to be scaled out of physical possibility, zum Beispiel, out of the cycloid.
   */
  rodLengthScale: number;
  /*
   * TODO
   */
  rotationDirection: CycloidDirection;

  cycloidRadius: number;

  /*
   *  Local animation speed scale. This affect only the current cycloid.
   */
  animationSpeedScale: number;

  /*
   * Whether or not to move outside of the current bounding circle.
   */
  moveOutSideOfParent: boolean;

  /*
   * For referencing programmatically, not meant to be used by the user
   */
  boundingCircleRadius: number;

  /*
   * The parent element that the cycloid will be rendered inside or outside of,
   * Null will default to the outermost parent element.
   */
  boundingCircle: BoundingCircle | null;
}
