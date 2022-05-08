import { CycloidControlsProperties } from "../../classes/cycloidControls";

export default interface InstantDrawerWorkerRequestPayload {
  operation: InstantDrawerWorkerOperation;
  setParametersPayload?: GeneratePointsPayload;
  retrievePointsPayload?: RetrievePointsPayload;
}

export enum InstantDrawerWorkerOperation {
  generatePoints,
}

export type GeneratePointsPayload = {
  parameters: Partial<CycloidControlsProperties>;
};

export type RetrievePointsPayload = {
  /**
   * For loop's second argument
   */
  iterations: number;
  /**
   * The time step between each iteration.
   *
   * requestAnimationFrame targets 60fps, so the time step should be at least 16.67ms.
   */
  timeStep: number;
};
