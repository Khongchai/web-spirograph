import { useEffect, useRef } from "react";
import { NaivgationStage } from "../types/Stage";
import useOnMouseMove from "../utils/BackgroundParticles/useOnMouseMove";
import useOnStageChanged from "../utils/BackgroundParticles/useOnStageChanged";
import useSetupParticlesWorker from "../utils/BackgroundParticles/useSetupParticlesWorker";
import { CanvasSizeManagers } from "../utils/CanvasSizeManager";
import ParticlesWorkerPayload, {
  ParticlesWorkerOperation,
} from "../Workers/BackgroundParticles/particlesWorkerPayloads";

export default function BackgroundParticles({
  stage,
}: {
  stage: NaivgationStage;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function onResize() {
    const resizePayload: ParticlesWorkerPayload = {
      operation: ParticlesWorkerOperation.Resize,
      resizePayload: {
        newHeight: window.innerHeight,
        newWidth: window.innerWidth,
      },
    };
    worker!.postMessage(resizePayload);
  }

  const { worker } = useSetupParticlesWorker({ canvasRef, dependencyList: [] });

  useEffect(() => {
    if (canvasRef.current && worker) {
      CanvasSizeManagers.particlesWorkerCanvasSizeManager.setCanvasSize(
        canvasRef.current,
        onResize,
        true
      );
    }
  }, [worker]);

  useOnMouseMove({
    worker,
    dependencyList: [worker],
  });

  useOnStageChanged({ currentStage: stage, dependencyArray: [stage], worker });

  return <canvas className="w-full h-full relative" ref={canvasRef}></canvas>;
}
