/**
 * A data holder for cycloid params.
 */

import { RotationDirection } from "../DTOInterfaces/rotationDirection";
import { CycloidParamsArgs } from "../DTOInterfaces/CycloidParamsInterface";
import BoundingCircle from "./BoundingCircle";

export default class CycloidParams implements CycloidParamsArgs {
  /*
   * Rod length's scale. This allows the rod to be scaled out of physical possibility, zum Beispiel, out of the cycloid.
   */
  rodLengthScale: number;
  rotationDirection: RotationDirection;
  radius: number;
  /*
   *  Local animation speed scale. This affect only the current cycloid.
   *
   * A bit counter-intuitively, this parameter changes the speed not of its rotation,
   * but of its movement around its parent cycloid.
   *
   * Physically, a ratio of other than thetaOfParent * parentCycloidRadius / thisCycloidRadius
   * means the cycloid is sliding along the surface as the amount of surface rolled
   * is no longer proportional to that of its parent.
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

  /**
   * A map for the cycloids for O(1) retrieval.
   */
  private cycloidsIdMap: Record<string, BoundingCircle | CycloidParams | null> =
    {};

  addCycloid(
    props: Omit<CycloidParamsArgs, "id" | "boundingCircleId">,
    onCycloidAdded?: VoidFunction
  ) {
    const { generatedId, boundingCircleId } = this.generateId();
    this.idManager.incrementId();

    const newCycloidParams = new CycloidParams({
      ...props,
      id: generatedId,
      boundingCircleId,
    });

    this.cycloidParams.push(newCycloidParams);
    this.cycloidsIdMap[newCycloidParams.id] = newCycloidParams;

    onCycloidAdded?.();
  }
  generateId() {
    const generatedId = this.idManager.getId();
    const boundingCircleId = generatedId - 1;

    return { generatedId, boundingCircleId };
  }

  removeLastCycloid(
    onCycloidRemoved?: ({
      idOfRemovedCycloid,
      cycloidParamsAfterRemoval,
    }: {
      idOfRemovedCycloid: number;
      cycloidParamsAfterRemoval: CycloidParams[];
    }) => void
  ) {
    if (this.cycloidParams.length > 1) {
      const poppedCycloidId = this.cycloidParams.pop()?.id;

      if (!poppedCycloidId && poppedCycloidId != 0) {
        throw new Error("Popped cycloid doesn't have an id");
      }

      this.idManager.decrementId();
      this.cycloidsIdMap[poppedCycloidId!] = null;

      onCycloidRemoved?.({
        idOfRemovedCycloid: poppedCycloidId,
        cycloidParamsAfterRemoval: this.cycloidParams,
      });
    }
  }

  /**
   * Recursively get all the parents, and parents of parents, until we are at the bounding circle.
   */
  getAllAncestors(id: number | string): CycloidParams[] {
    const cycloid = this.cycloidsIdMap[id] as CycloidParams | undefined;

    if (!cycloid) {
      throw new Error("Cycloid not found");
    }

    const traceRoots = (
      currentCycloid: CycloidParams,
      currentCycloidDescendants: CycloidParams[]
    ): CycloidParams[] => {
      const boundingCircleId = currentCycloid.boundingCircleId;

      if (!boundingCircleId && boundingCircleId != 0) {
        throw new Error(
          `This cycloid of id ${currentCycloid.id} doesn't hav a parent for some reason`
        );
      }

      currentCycloidDescendants.push(currentCycloid);

      if (boundingCircleId === -1) {
        return [
          ...currentCycloidDescendants,
          this.getSingleCycloidParamFromId(boundingCircleId)!,
        ].reverse();
      }

      const parentCycloid = this.getSingleCycloidParamFromId(boundingCircleId)!;

      return traceRoots(parentCycloid, currentCycloidDescendants);
    };

    return traceRoots(cycloid, []);
  }

  get allCycloidParams() {
    return this.cycloidParams;
  }

  setAllCycloidParams(cycloidParams: CycloidParams[]) {
    this.cycloidParams = cycloidParams;
  }

  /**
   *  Load cycloid params with aut-generated ids
   */
  loadCycloidParamsFromArgs(
    args: Omit<CycloidParamsArgs, "id" | "boundingCircleId">[],
    boundingCircleId: number,
    boundingCircle: BoundingCircle
  ) {
    args.forEach((a) => this.addCycloid(a));
    this.cycloidParams.forEach((c) => {
      this.cycloidsIdMap[c.id] = c;
    });

    // Explicitly set bounding circle
    this.cycloidsIdMap[boundingCircleId] = boundingCircle;
  }

  getSingleCycloidParamFromId(id: number | string) {
    const cycloid = this.cycloidsIdMap[id] as CycloidParams | undefined;

    return cycloid;
  }
}
