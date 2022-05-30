import CycloidControls from "../../../classes/cycloidControls";
import { RerenderReason } from "../../../contexts/rerenderToggle";
import InstantDrawCycloid from "../models/Cycloid";

/**
 * Responsible for making sure that the field transfer to the worker is really the changed field.
 *
 * This function accepts the current cycloid controls (presumable the newest one with the latest state change)
 * and the latest change reason. It then looks
 *
 * TODO map this and all actions that trigger rerender
 */
export function setParametersMapper(
  cycloidControls: CycloidControls,
  reason: RerenderReason
): InstantDrawCycloid[] {
  const _reason = reason;
  switch (_reason) {
    case "addOrRemoveCycloid":
      break;
    case "changedFocusedCycloid":
      break;
    case "moveOutsideOfParent":
      break;
    case "pan":
      break;
    case "radius":
      break;
    case "resize":
      break;
    case "rodLength":
      break;
    case "rotationDirection":
      break;
    case "speedScale":
      break;
    case "timeStep":
      break;
  }

  return [];
}
