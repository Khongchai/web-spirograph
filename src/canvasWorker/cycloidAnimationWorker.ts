import { CycloidAnimationWorkerData } from "./models/cycloidAnimationWorkerData";
import { OnMessagePayload, WorkerOperations } from "./models/onMessagePayload";
import resetCanvas from "./operations/resetCanvas";

export {};

let workerData: CycloidAnimationWorkerData;

/**
 *  onmessage accepts a payload of type OnMessagePayload, wherein
 *  contains nullable properties that will be read if the
 *  WorkerOperations enum is set to the corresponding value.
 */
onmessage = (message: { data: OnMessagePayload }) => {
  switch (message.data.workerOperations) {
    // Allow fall-through
    case WorkerOperations.SetupCanvas:
      const setupData = message.data.setupCanvas!;
      workerData = {
        drawContext: setupData.drawCanvas.getContext("2d")!,
        traceContext: setupData.traceCanvas.getContext("2d")!,
        ...setupData,
      };
    case WorkerOperations.ResetCanvas:
      resetCanvas(workerData);

    default:
      break;
  }
};
