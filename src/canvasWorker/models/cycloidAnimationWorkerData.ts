import { MutableRefObject } from "react";
import CycloidControls from "../../classes/CycloidControls";
import { Vector2 } from "../../types/vector2";

/**
 * All canvases can be accepted as a direct pointer to the object, while some others are,
 * for now, accessed through the refs.
 */
export type CycloidAnimationWorkerData = {
  parentWidth: number;
  parentHeight: number;

  drawCanvas: HTMLCanvasElement;
  drawContext: CanvasRenderingContext2D;

  traceCanvas: HTMLCanvasElement;
  traceContext: CanvasRenderingContext2D;

  panRef: MutableRefObject<Vector2>;
  pointsToTraceRef: MutableRefObject<Vector2[]>;
  cycloidControlsRef: MutableRefObject<CycloidControls>;
};
