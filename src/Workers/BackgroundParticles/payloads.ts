export default interface ParticlesWorkerPayload {
  initPayload?: InitPayload;
  operation: ParticlesWorkerOperation;
}

export enum ParticlesWorkerOperation {
  Init,
}

export type InitPayload = {
  canvas: OffscreenCanvas;
  canvasWidth: number;
  canvasHeight: number;
};
