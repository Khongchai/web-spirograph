import React, { useRef } from "react";
import { NaivgationStage } from "../types/Stage";
import useOnMouseMove from "../utils/BackgroundParticles/useOnMouseMove";
import useOnResize from "../utils/BackgroundParticles/useOnResize";
import useOnStageChanged from "../utils/BackgroundParticles/useOnStageChanged";
import useSetupParticlesWorker from "../utils/BackgroundParticles/useSetupParticlesWorker";

// Assume canvas is always the same size as the window.

//TODO refactor into separate hooks and cancel the eventlisteners.
export default function BackgroundParticles({
  stage,
}: {
  stage: NaivgationStage;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { worker } = useSetupParticlesWorker({ canvasRef, dependencyList: [] });

  useOnResize({
    worker,
    dependencyList: [worker],
  });

  useOnMouseMove({
    worker,
    dependencyList: [worker],
  });

  useOnStageChanged({ currentStage: stage, dependencyArray: [stage], worker });

  return <canvas className="w-full h-full relative" ref={canvasRef}></canvas>;
}
