export type CycloidAnimationWorkerData = {
  parentWidth: number;
  parentHeight: number;

  drawCanvas: HTMLCanvasElement;
  drawContext: CanvasRenderingContext2D;

  traceCanvas: HTMLCanvasElement;
  traceContext: CanvasRenderingContext2D;
};
