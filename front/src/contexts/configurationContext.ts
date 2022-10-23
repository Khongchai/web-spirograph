import { createContext } from "react";
import CycloidControls from "../classes/domain/cycloidControls";

export const configurationContext = createContext<CycloidControls | null>(null);

export const setConfigurationContext = createContext<
  (config: CycloidControls | null) => void
>(() => {});
