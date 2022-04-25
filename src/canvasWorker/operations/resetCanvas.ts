import { CycloidAnimationWorkerData } from "../models/cycloidAnimationWorkerData";

export default function resetCanvas({
  drawContext,
  parentHeight: height,
  parentWidth: width,
  traceContext,
}: Pick<
  CycloidAnimationWorkerData,
  "drawContext" | "traceContext" | "parentWidth" | "parentHeight"
>) {
  drawContext.save();
  traceContext.save();

  drawContext.setTransform(1, 0, 0, 1, 0, 0);
  traceContext.setTransform(1, 0, 0, 1, 0, 0);
  drawContext.clearRect(0, 0, width, height);
  traceContext.clearRect(0, 0, width, height);

  drawContext.restore();
  traceContext.restore();
}
