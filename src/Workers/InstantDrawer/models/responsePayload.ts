import { Vector2 } from "../../../classes/vector2";

export default interface InstantDrawerWorkerResponsePayload {
  operation: InstantDrawerWorkerResponseOperation;
  generatePointsResponse?: RetrievePointsResponse;
}

export enum InstantDrawerWorkerResponseOperation {
  generatePoints,
}

export type RetrievePointsResponse = {
  /**
   * Null means not yet generated.
   */
  points?: Vector2[];
};
