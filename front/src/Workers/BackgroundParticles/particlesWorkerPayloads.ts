import { Vector2 } from "../../classes/domain/vector2";

/**
 * This is like the data models in clean architecture.
 */

export default interface ParticlesWorkerPayload {
  initPayload?: InitPayload;
  resizePayload?: ResizePayload;
  setMousePosPayload?: SetMousePosPayload;
  spreadAndRotatePayload?: SpreadAndRotatePayload;
  operation: ParticlesWorkerOperation;
}

export enum ParticlesWorkerOperation {
  Init,
  Resize,
  SetMousePos,
  SpreadAndRotate,
  //TODO
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

export type SpreadAndRotatePayload = {
  //TODO we only need "spread"
  action: "shrink" | "spread";
  repellerSize: number;
  repellerWeight: number;
};
