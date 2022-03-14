import BoundingCircle from "../classes/BoundingCircle";
import CycloidParams from "../classes/CycloidParams";

/**
 * Interface for all animation params
 */
export default interface CycloidControlsData {
  /*
   * Base parent of all cycloids.
   */
  outerMostBoundingCircle: BoundingCircle;
  /*
   * All drawable cycloids.
   */
  cycloids: CycloidParams[];

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
}
