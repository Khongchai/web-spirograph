export default interface ParticlesWorkerPayload {
  initPayload?: InitPayload;
  resize?: ResizePayload;
  operation: ParticlesWorkerOperation;
}

export enum ParticlesWorkerOperation {
  Init,
  Resize,
}

export type InitPayload = {
  canvas: OffscreenCanvas;
  canvasWidth: number;
  canvasHeight: number;
};

export type ResizePayload = {
  newWidth: number;
  newHeight: number;
};
