import { createContext } from "react";

export type RerenderType = {
  toggle: boolean;
  reason: RerenderReason;
};

/**
 * For each rerender, the related field must be provided.
 */
export type RerenderReason =
  | "rodLength"
  | "speedScale"
  | "timeStep"
  | "moveOutsideOfParent"
  | "radius"
  | "rotationDirection"
  | "timeStep"
  | "radius"
  | "addOrRemoveCycloid"
  | "changedFocusedCycloid"
  | "resize"
  | "pan"
  | undefined;

// A toggle to be used to clear the canvas.
export const RerenderToggle = createContext(() => {});

// A listenable context for clearing the canvas.
export const Rerender = createContext<RerenderType>({
  toggle: false,
  reason: undefined,
});
