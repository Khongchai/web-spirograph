import { BoundingCircleInterface } from "./BoundingCircleInterface";
import { CycloidParamsArgs } from "./CycloidParamsInterface";

export class BaseConfiguration {
  /**
   * Database id, only for objects that are returned from the backend.
   */ 
  id?: string;

  /**
   * Base parent of all cycloids.
   */
  outermostBoundingCircle: BoundingCircleInterface;

  /**
   * All cycloids
   */
  cycloids: Omit<CycloidParamsArgs, "id" | "boundingCircleId">[];

  /**
   * The global animation speed.
   */
  globalTimeStepScale: number;

  /**
   * The id of the current cycloid that is being drawn.
   */
  currentCycloidId: number;

  /**
   * Animation mode. Instant draws the cycloid instantly, while Animated tries draws the cycloid at 60 fps.
   * The animated instant keeps the drawing but has a worker thread updates the stars position as the final, instant result.
   */
  mode: "Animated" | "Instant" | "AnimatedInstant";

  /**
   * Whether or not to show the bounding circles.
   */
  scaffold: "Showing" | "Hidden";

  /**
   * Pretty self-explanatory.
   */
  animationState: "Playing" | "Paused";

  /**
   * Whether or not to clear the traced path when a "local" parameter is changed.
   */
  clearTracedPathOnParamsChange: boolean;

  /**
   * If false, only the path of the selected cycloid will be traced.
   */
  showAllCycloids: boolean;

  /**
   * If false, only the selected cycloid will be shown.
   */
  traceAllCycloids: boolean;

  /**
   * Not for the user
   */
  programOnly: {
    tracePath: boolean;
  };

  constructor(config: BaseConfiguration) {
    Object.assign(this, config);
  }
}
