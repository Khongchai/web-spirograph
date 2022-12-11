import { useEffect, useState } from "react";
import ParticlesWorkerPayload, {
  ParticlesWorkerOperation,
} from "../../Workers/BackgroundParticles/particlesWorkerPayloads";

export default function useSetupParticlesWorker({
  canvasRef,
  dependencyList,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  dependencyList: any[];
}) {
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    const worker = new Worker(
      new URL(
        "../../Workers/BackgroundParticles/particles.worker",
        import.meta.url
      )
    );
    setWorker(worker);

    const canvas = canvasRef.current!;
    const offscreenCanvas = canvas.transferControlToOffscreen();
    const payload: ParticlesWorkerPayload = {
      operation: ParticlesWorkerOperation.Init,
      initPayload: {
        canvasHeight: window.innerHeight,
        canvasWidth: window.innerWidth,
        canvas: offscreenCanvas,
      },
    };

    worker.postMessage(payload, [offscreenCanvas]);
  }, dependencyList);

  return { worker };
}
