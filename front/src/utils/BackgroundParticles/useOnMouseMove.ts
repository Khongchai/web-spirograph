import { useEffect } from "react";
import ParticlesWorkerPayload, {
  ParticlesWorkerOperation,
} from "../../Workers/BackgroundParticles/particlesWorkerPayloads";

export default function useOnMouseMove({
  worker,
  dependencyList,
}: {
  worker: Worker | null;
  dependencyList: any[];
}) {
  useEffect(() => {
    if (!worker) return;

    function onMouseMove(e: MouseEvent) {
      const setMousePosPayload: ParticlesWorkerPayload = {
        operation: ParticlesWorkerOperation.SetMousePos,
        setMousePosPayload: {
          x: e.x,
          y: e.y,
        },
      };
      requestAnimationFrame(() => {
        worker!.postMessage(setMousePosPayload);
      });
    }

    window.addEventListener("mousemove", onMouseMove);
  }, dependencyList);
}
