import BoundingCircle from "./BoundingCircle";
import { BaseConfiguration } from "../DTOInterfaces/ConfigurationInterface";
import CycloidParams, { CycloidParamsManager } from "./CycloidParams";
import { CycloidParamsArgs } from "../DTOInterfaces/CycloidParamsInterface";

export type CycloidControlsInterface = Omit<
  BaseConfiguration,
  "cycloids" | "outermostBoundingCircle"
> & {
  cycloidManager: CycloidParamsManager;
  outermostBoundingCircle: BoundingCircle;
};

// CycloidControlsData but turned into a class
export default class CycloidControls implements CycloidControlsInterface {
  outermostBoundingCircle: BoundingCircle;
  cycloidManager: CycloidParamsManager;
  globalTimeStepScale: number;
  currentCycloidId: number;
  mode: "Animated" | "Instant" | "AnimatedInstant";
  scaffold: "Showing" | "Hidden";
  animationState: "Playing" | "Paused";
  clearTracedPathOnParamsChange: boolean;
  traceAllCycloids: boolean;
  showAllCycloids: boolean;
  programOnly: {
    tracePath: boolean;
  };
  cycloidsIdMap: any;
  constructor({
    globalTimeStepScale: globalTimeStep,
    animationState,
    clearTracedPathOnParamsChange,
    currentCycloidId,
    cycloids,
    mode,
    outermostBoundingCircle,
    scaffold,
    programOnly,
    showAllCycloids,
    traceAllCycloids,
  }: Omit<CycloidControlsInterface, "cycloidManager"> & {
    cycloids: Omit<CycloidParamsArgs, "id" | "boundingCircleId">[];
  }) {
    this.outermostBoundingCircle = outermostBoundingCircle;
    this.globalTimeStepScale = globalTimeStep;
    this.currentCycloidId = currentCycloidId;
    this.mode = mode;
    this.traceAllCycloids = traceAllCycloids;
    this.scaffold = scaffold;
    this.animationState = animationState;
    this.clearTracedPathOnParamsChange = clearTracedPathOnParamsChange;
    this.showAllCycloids = showAllCycloids;
    this.programOnly = programOnly;

    this.cycloidManager = new CycloidParamsManager();
    this.cycloidManager.loadCycloidParamsFromArgs(
      cycloids,
      -1,
      this.outermostBoundingCircle
    );
  }

  /**
   * @deprecated this is not needed anymore as we do not need to reference the parent draw node directly anymore.
   *
   * This is required every time the relationship is reassigned.
   *
   * We cannot just sort by the boundingCircleId as the the ids do not
   * refer to the position in the array.
   *
   * A naive sorting would be:
   * ```js
   *  this.cycloids.sort((a, b) => a.boundingCircleId - b.boundingCircleId);
   * ```
   * Which will not work when we have:
   *
   * ```js
   *  [{boundingCircleId: -1, id: 2}, {boundingCircleId: 0, id: 1}, {boundingCircleId: 2, id: 0}]
   * ```
   *
   * Algorithm runtime O(n + hlogh) where h is the height of the tree, or in this case, the number of DrawLevels.
   * - Find an object with the highest boundingCircleId.
   * - Trace back to the boundingCircle (-1), while storing everything along the path in an array.
   * - Sort the array by the boundingCircleId.
   * - Move the remaining objects, which can be in any order because all levels are guaranteed to have been created, to the sorted array.
   * - ???
   * - Profit.
   */
  // sortCycloidByBoundingPriority() {
  //   const cycloidWithHighestBoundingCircleId = this.cycloidManager
  //     .getAllCycloidParams()
  //     .reduce((before, after) => {
  //       return before.boundingCircleId > after.boundingCircleId
  //         ? before
  //         : after;
  //     }).id;
  //   const { objsAlongPath } = this.getTreeDistanceFromRoot(
  //     cycloidWithHighestBoundingCircleId
  //   );
  //   this.cycloidManager.setAllCycloidParams([
  //     ...objsAlongPath,
  //     ...this.cycloidManager
  //       .getAllCycloidParams()
  //       .filter((c) => !objsAlongPath.includes(c)),
  //   ]);
  // }
  // /**
  getTreeDistanceFromRoot(
    thisCycloidId: number | string,
    distanceAsLevel = 0,
    objsAlongPath: CycloidParams[] = []
  ): { distanceAsLevel: number; objsAlongPath: CycloidParams[] } {
    const cycloid = this.cycloidsIdMap[thisCycloidId] as
      | CycloidParams
      | undefined;

    if (!cycloid) {
      throw new Error("Cycloid not found");
    }

    const idIsRootId = thisCycloidId === -1;

    if (idIsRootId) {
      return {
        distanceAsLevel: 0,
        objsAlongPath: [],
      };
    }

    const { boundingCircleId } = cycloid;
    objsAlongPath.unshift(cycloid);

    const parentIsBoundingCircle = cycloid.boundingCircleId === -1;
    if (parentIsBoundingCircle)
      return {
        distanceAsLevel,
        objsAlongPath,
      };

    return this.getTreeDistanceFromRoot(
      boundingCircleId,
      distanceAsLevel + 1,
      objsAlongPath
    );
  }
}
