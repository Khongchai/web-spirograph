import React, { useRef } from "react";
import useOnMouseMove from "../utils/BackgroundParticles/useOnMouseMove";
import useOnResize from "../utils/BackgroundParticles/useOnResize";
import useSetupWorker from "../utils/BackgroundParticles/useSetupWorker";

// Assume canvas is always the same size as the window.

//TODO refactor into separate hooks and cancel the eventlisteners.
export default function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { worker } = useSetupWorker({ canvasRef, dependencyList: [] });

  useOnResize({
    worker,
    dependencyList: [worker],
  });

  useOnMouseMove({
    worker,
    dependencyList: [worker],
  });

  return <canvas className="w-full h-full relative" ref={canvasRef}></canvas>;
}
