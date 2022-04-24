import { CycloidAnimationWorkerData } from "./models/cycloidAnimationWorkerData";
import { OnMessagePayload } from "./models/onMessagePayload";
import setupCanvases from "./operations/resetCanvas";

export {};

let workerData: CycloidAnimationWorkerData;

onmessage = (message: { data: OnMessagePayload }) => {
  workerData = {
    drawContext: message.data.drawCanvas.getContext("2d")!,
    traceContext: message.data.traceCanvas.getContext("2d")!,
    ...message.data,
  };

  setupCanvases(workerData);
};
