import { Vector2 } from "../../classes/vector2";

export default interface InstantDrawerWorkerResponsePayload {
  operation: InstantDrawerWorkerResponseOperation;
  RetrievePointsResponse?: RetrievePointsResponse;
}

export enum InstantDrawerWorkerResponseOperation {
  retrievePoints,
}

export type RetrievePointsResponse = {
  /**
   * Null means not yet generated.
   */
  points?: Vector2[];
};
