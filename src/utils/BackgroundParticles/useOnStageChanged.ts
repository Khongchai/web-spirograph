import { useEffect } from "react";
import { NaivgationStage } from "../../types/Stage";
import ParticlesWorkerPayload, {
  ParticlesWorkerOperation,
} from "../../Workers/BackgroundParticles/payloads";

export default function useOnStageChanged({
  currentStage,
  worker,
  dependencyArray,
}: {
  currentStage: NaivgationStage;
  worker: Worker | null;
  dependencyArray: any[];
}) {
  useEffect(() => {
    if (!worker) return;

    const payload: ParticlesWorkerPayload = {
      operation: ParticlesWorkerOperation.SpreadAndRotate,
      spreadAndRotatePayload: {
        repellerWeight: 0.0009,
        action: currentStage === "landing" ? "shrink" : "spread",
        repellerSize: window.innerHeight * 0.9,
      },
    };
    worker.postMessage(payload);
  }, dependencyArray);
}
