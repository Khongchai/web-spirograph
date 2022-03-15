/**
 * A data holder for cycloid params.
 */

import { rotationDirection as RotationDirection } from "../types/rotationDirection";

export default class CycloidParams {
  /*
   * Rod length's scale. This allows the rod to be scaled out of physical possibility, zum Beispiel, out of the cycloid.
   */
  rodLengthScale: number;
  rotationDirection: RotationDirection;
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
   * The index of this element.
   */
  id: number;
  /*
   * The parent element that the cycloid will be rendered inside or outside of,
   * -1 will default to the outermost parent element.
   */
  boundingCircleId: number;

  boundingColor: string;

  constructor({
    rodLengthScale,
    rotationDirection,
    radius,
    animationSpeedScale,
    moveOutSideOfParent,
    boundingCircleId: boundingCircleIndex,
    boundingColor,
    /**
     * This is important, as it will be used to find this element even when the array is sorted.
     */
    id: index,
  }: {
    rodLengthScale: number;
    rotationDirection: RotationDirection;
    radius: number;
    animationSpeedScale: number;
    moveOutSideOfParent: boolean;
    boundingCircleId: number;
    boundingColor: string;
    id: number;
  }) {
    this.rodLengthScale = rodLengthScale;
    this.rotationDirection = rotationDirection;
    this.radius = radius;
    this.animationSpeedScale = animationSpeedScale;
    this.moveOutSideOfParent = moveOutSideOfParent;
    this.id = index;
    this.boundingCircleId = boundingCircleIndex;
    this.boundingColor = boundingColor;

    if (this.id === this.boundingCircleId) {
      throw Error("The bounding circle cannot be itself");
    }
  }
}
