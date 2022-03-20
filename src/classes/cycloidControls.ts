import BoundingCircle from "./BoundingCircle";
import CycloidParams from "./CycloidParams";

// CycloidControlsData but turned into a class
export default class CycloidControls {
  /*
   * Base parent of all cycloids.
   */
  outerMostBoundingCircle: BoundingCircle;
  /*
   * All drawable cycloids.
   */
  cycloids: CycloidParams[];
  /**
   * A map for the cycloids for O(1) retrieval.
   */
  private cycloidsIdMap: Record<string, BoundingCircle | CycloidParams> = {};

  /*
   * The global animation speed.
   */
  animationSpeed: number;

  /*
   * The id of the current cycloid that is being drawn.
   */
  currentCycloidId: number;

  /*
   * Animation mode. Instant draws the cycloid instantly, while Animated tries draws the cycloid at 60 fps.
   */
  mode: "Animated" | "Instant";

  /*
   *  Whether or not to show the bounding circles.
   */
  scaffold: "Showing" | "Hidden";

  /*
   * Pretty self-explanatory.
   */
  animationState: "Playing" | "Paused";

  /*
   * Whether or not to clear the traced path when a "local" parameter is changed.
   */
  clearTracedPathOnParamsChange: boolean;

  /*
   * Pretty self-explanatory.
   */
  showAllCycloids: boolean;

  /**
   * Not for users to use.
   */
  programOnly: {
    /*
     * Whether or not to show the traced path.
     */
    tracePath: boolean;
  };

  constructor({
    animationSpeed,
    animationState,
    clearTracedPathOnParamsChange,
    currentCycloidId,
    cycloids,
    mode,
    outerMostBoundingCircle,
    scaffold,
    programOnly,
    showAllCycloids,
  }: {
    outerMostBoundingCircle: BoundingCircle;
    cycloids: CycloidParams[];
    animationSpeed: number;
    currentCycloidId: number;
    mode: "Animated" | "Instant";
    scaffold: "Showing" | "Hidden";
    animationState: "Playing" | "Paused";
    clearTracedPathOnParamsChange: boolean;
    showAllCycloids: boolean;
    programOnly: {
      tracePath: boolean;
    };
  }) {
    this.outerMostBoundingCircle = outerMostBoundingCircle;
    this.cycloids = cycloids;
    this.animationSpeed = animationSpeed;
    this.currentCycloidId = currentCycloidId;
    this.mode = mode;
    this.scaffold = scaffold;
    this.animationState = animationState;
    this.clearTracedPathOnParamsChange = clearTracedPathOnParamsChange;
    this.showAllCycloids = showAllCycloids;
    this.programOnly = programOnly;

    this.cycloids.forEach((c) => {
      this.cycloidsIdMap[c.id] = c;
    });
    this.cycloidsIdMap["-1"] = this.outerMostBoundingCircle;
  }

  /**
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
  sortCycloidByBoundingPriority() {
    const cycloidWithHighestBoundingCircleId = this.cycloids.reduce(
      (before, after) => {
        return before.boundingCircleId > after.boundingCircleId
          ? before
          : after;
      }
    ).id;

    const { objsAlongPath } = this.getTreeDistanceFromRoot(
      cycloidWithHighestBoundingCircleId
    );

    this.cycloids = [
      ...objsAlongPath,
      ...this.cycloids.filter((c) => !objsAlongPath.includes(c)),
    ];
  }
  /**
   * Retrieve both the distance from the root and the objects that are in the path.
   */
  private getTreeDistanceFromRoot(
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

  getSingleCycloidParamFromId(id: number | string) {
    const cycloid = this.cycloidsIdMap[id] as CycloidParams | undefined;

    return cycloid;
  }
}
