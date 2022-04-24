import { createContext } from "react";

// A listenable context for clearing the canvas.
export const CanvasWorker = createContext(new Worker(""));
