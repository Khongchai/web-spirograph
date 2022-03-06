import React, { createContext } from "react";

// A toggle to be used to clear the canvas.
export const RerenderToggle = createContext(() => {});

// A listenable context for clearing the canvas.
export const Rerender = createContext(false);
