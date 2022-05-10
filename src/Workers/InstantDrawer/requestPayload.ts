import CycloidControls, {
  CycloidControlsProperties,
} from "../../classes/cycloidControls";

/**
 * # Defined Operations:
 *
 * - Set the cycloidControls.
 *     This should be called on load to set the initial values or whenever the value
 *     of the entire object should be set at once.
 * - Set each the cycloidcontrolsProperties separately.
 *     This is called when the user tweaked the settings.
 * - Generate points.
 *     This generates the points for the main thread to draw using the current
 *     cycloidControls settings.
 *
 * Both of the first two operations will simply set the cycloidControlsProperties
 * state. Points will be generated only when the generate points operation is called.
 *
 */
export default interface InstantDrawerWorkerRequestPayload {
  operation: InstantDrawerWorkerOperation;
  generatePointsPayload?: GeneratePointsPayload;
  setCycloidControlsPayload?: SetCycloidControlsPayload;
  SetCycloidControlsPropertiesPayload?: SetCycloidControlsPropertiesPayload;
}

export enum InstantDrawerWorkerOperation {
  generatePoints,
  // Set entire thing.
  setCycloidControls,
  // Set just some properties
  setCycloidControlsProperties,
}

export type GeneratePointsPayload = {
  /**
   * For loop's second argument
   */
  iterations: number;
  /**
   * The time step between each iteration.
   *
   * requestAnimationFrame targets 60fps, so the time step should be at least 16.67ms.
   *
   * TODO this might not be necessaary as we might be able to use some paramters from the cycloidControls
   */
  timeStep: number;
};

export type SetCycloidControlsPayload = {
  cycloidControls: CycloidControls;
};

export type SetCycloidControlsPropertiesPayload = {
  cycloidControlsProperties: Partial<CycloidControls>;
};
