import { DependencyList, useEffect } from "react";
import ParticlesWorkerPayload, {
  ParticlesWorkerOperation,
} from "../../Workers/BackgroundParticles/particlesWorkerPayloads";

export default function useOnResize({
  worker,
  dependencyList,
}: {
  worker: Worker | null;
  dependencyList: any[];
}) {
  useEffect(() => {
    if (!worker) return;

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

    window.addEventListener("resize", onResize);
  }, dependencyList);
}
