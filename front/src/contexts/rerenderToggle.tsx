import { createContext } from "react";
import { RerenderReason } from "../types/contexts/rerenderReasons";

export type RerenderType = {
  toggle: boolean;
  reason: RerenderReason;
};

// A toggle to be used to clear the canvas.
export const RerenderToggle = createContext<
  (rerenderType: RerenderReason) => void
>(() => {});

// A listenable context for clearing the canvas.
export const Rerender = createContext<RerenderType>({
  toggle: false,
  reason: RerenderReason.appStart,
});
