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
   * The current cycloid that is being draw, or controlled.
   */
  currentCycloid: number;

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
    currentCycloid,
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
    currentCycloid: number;
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
    this.currentCycloid = currentCycloid;
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
   */
  sortCycloidByBoundingPriority() {
    this.cycloids.sort((a, b) => a.boundingCircleId - b.boundingCircleId);
  }

  getSingleCycloidParamFromId(id: string) {
    const cycloid = this.cycloidsIdMap[id] as CycloidParams | undefined;

    return cycloid;
  }
}
