/**
 * A data holder for cycloid params.
 */

import { rotationDirection as RotationDirection } from "../types/rotationDirection";

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
  }: CycloidParamsArgs) {
    this.rodLengthScale = rodLengthScale;
    this.rotationDirection = rotationDirection;
    this.radius = radius;
    this.animationSpeedScale = animationSpeedScale;
    this.moveOutSideOfParent = moveOutSideOfParent;
    this.id = index;
    this.boundingCircleId = boundingCircleIndex;
    this.boundingColor = boundingColor;

    if (this.id === this.boundingCircleId) {
      throw Error(
        "Either a cycloid has itself as its bounding circle or there is another cycloid with the same id"
      );
    }
  }
}

//////////////////////////////// Management Zone //////////////////////////////////

class IdManager {
  private idCounter: number;

  incrementId = () => this.idCounter++;
  decrementId = () => this.idCounter--;

  getId = () => this.idCounter;

  constructor() {
    this.idCounter = 0;
  }
}

/**
 * A mediator & a factory
 *
 * Manages all cycloid params.
 *
 */
export class CycloidParamsManager {
  private cycloidParams: CycloidParams[] = [];

  private idManager: IdManager = new IdManager();

  addCycloid(props: Omit<CycloidParamsArgs, "id" | "boundingCircleId">) {
    const { generatedId, boundingCircleId } = this.generateId();
    this.idManager.incrementId();

    const newCycloidParams = new CycloidParams({
      ...props,
      id: generatedId,
      boundingCircleId,
    });

    this.cycloidParams.push(newCycloidParams);
  }
  generateId() {
    const generatedId = this.idManager.getId();
    const boundingCircleId = generatedId - 1;

    return { generatedId, boundingCircleId };
  }

  removeCycloid(cycloidParamId: number) {
    this.cycloidParams = this.cycloidParams.filter(
      ({ id }) => id !== cycloidParamId
    );

    this.idManager.decrementId();
  }

  getAllCycloidParams() {
    return this.cycloidParams;
  }

  setAllCycloidParams(cycloidParams: CycloidParams[]) {
    this.cycloidParams = cycloidParams;
  }

  loadCycloidParamsFromArgs(
    args: Omit<CycloidParamsArgs, "id" | "boundingCircleId">[]
  ) {
    args.forEach((a) => this.addCycloid(a));
  }
}
