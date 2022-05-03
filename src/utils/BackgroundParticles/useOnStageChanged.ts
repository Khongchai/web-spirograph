import { useEffect } from "react";
import { NaivgationStage } from "../../types/Stage";
import Particle from "../../Workers/BackgroundParticles/models/particle";
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
      spreadAndRotatePayload: currentStage === "landing" ? "shrink" : "spread",
    };
    worker.postMessage(payload);
  }, dependencyArray);
}
