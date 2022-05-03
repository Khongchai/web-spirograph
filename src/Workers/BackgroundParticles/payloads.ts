import { Vector2 } from "../../classes/vector2";

export default interface ParticlesWorkerPayload {
  initPayload?: InitPayload;
  resizePayload?: ResizePayload;
  setMousePosPayload?: SetMousePosPayload;
  operation: ParticlesWorkerOperation;
}

export enum ParticlesWorkerOperation {
  Init,
  Resize,
  //TODO
  SetMousePos,
  SetRotationAngles,
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

export type SetMousePosPayload = Vector2;
