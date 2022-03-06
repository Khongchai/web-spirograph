import colors from "../constants/colors";
import { CycloidDirection } from "./cycloidDirection";

export default interface CycloidParams {
  /*
   * Rod length's scale. This allows the rod to be scaled out of physical possibility, zum Beispiel, out of the cycloid.
   */
  rodLengthScale: number;

  rotationDirection: CycloidDirection;

  radius: number;

  /*
   *  Local animation speed scale. This affect only the current cycloid.
   */
  animationSpeedScale: number;

  /*
   * Whether or not to move outside of the current bounding circle.
   */
  moveOutSideOfParent: boolean;

  /*
   * The parent element that the cycloid will be rendered inside or outside of,
   * -1 will default to the outermost parent element.
   */
  boundingCircleIndex: number;

  boundingColor: string;
}
