import { CycloidAnimationWorkerData } from "./models/cycloidAnimationWorkerData";
import { OnMessagePayload, WorkerOperation } from "./models/onMessagePayloads";
import { drawCycloid } from "./operations/drawCycloid";
import resetCanvas from "./operations/resetCanvas";

export {};

/**
 * Global worker data that is needed by many operations that was obtained during setup.
 *
 * This includes all React's refs objects and some static values like width and height.
 */
let workerData: CycloidAnimationWorkerData;

/**
 *  Architecture: main thread canvas => onmessage => (maps payload args to operation args) =>  call operation on worker
 *
 *  onmessage accepts a payload of type OnMessagePayload, wherein
 *  contains nullable properties that will be read if the
 *  WorkerOperations enum is set to the corresponding value.
 *
 * This onmessage acts as a mapper for the argument models and the operations
 */
onmessage = (message: { data: OnMessagePayload }) => {
  switch (message.data.workerOperations) {
    //TODO make a mapper once everything works
    case WorkerOperation.SetupCanvas:
      const setupData = message.data.setupCanvas!;
      workerData = {
        drawContext: setupData.drawCanvas.getContext("2d")!,
        traceContext: setupData.traceCanvas.getContext("2d")!,
        ...setupData,
      };
    case WorkerOperation.ResetCanvas:
      resetCanvas(workerData);
    case WorkerOperation.DrawCycloids:
      const {
        drawCanvas: canvas,
        parentHeight: height,
        parentWidth: width,
      } = workerData;

      const { cycloidsRefForCanvas, outermostBoundingCircle } =
        message.data.drawCycloid!;

      const {
        cycloidControlsRef: cycloidControls,
        panRef,
        pointsToTraceRef: pointsToTrace,
      } = workerData;

      drawCycloid({
        canvas,
        height,
        width,
        cycloidControls,
        cycloidsRefForCanvas,
        outermostBoundingCircle,
        panRef,
        pointsToTrace,
      });
    default:
      break;
  }
};
