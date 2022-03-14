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
  index: number;
  /*
   * The parent element that the cycloid will be rendered inside or outside of,
   * -1 will default to the outermost parent element.
   */
  boundingCircleIndex: number;

  boundingColor: string;

  constructor({
    rodLengthScale,
    rotationDirection,
    radius,
    animationSpeedScale,
    moveOutSideOfParent,
    boundingCircleIndex,
    boundingColor,
    /**
     * This is important, as it will be used to find this element even when the array is sorted.
     */
    index,
  }: {
    rodLengthScale: number;
    rotationDirection: RotationDirection;
    radius: number;
    animationSpeedScale: number;
    moveOutSideOfParent: boolean;
    boundingCircleIndex: number;
    boundingColor: string;
    index: number;
  }) {
    this.rodLengthScale = rodLengthScale;
    this.rotationDirection = rotationDirection;
    this.radius = radius;
    this.animationSpeedScale = animationSpeedScale;
    this.moveOutSideOfParent = moveOutSideOfParent;
    this.index = index;
    this.boundingCircleIndex = boundingCircleIndex;
    this.boundingColor = boundingColor;

    if (this.index === this.boundingCircleIndex) {
      throw Error("The bounding circle cannot be itself");
    }
  }
}
