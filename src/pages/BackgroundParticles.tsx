import React, { useEffect, useRef, useState } from "react";
import colors from "../constants/colors";
//@ts-ignore
import Worker from "worker-loader!../Workers/BackgroundParticles/particles.worker";
import ParticlesWorkerPayload, {
  ParticlesWorkerOperation,
} from "../Workers/BackgroundParticles/payloads";

// Assume canvas is always the same size as the window.

export default function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const worker = new Worker();

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

    window.addEventListener("resize", () => {
      const resizePayload: ParticlesWorkerPayload = {
        operation: ParticlesWorkerOperation.Resize,
        resize: {
          newHeight: window.innerHeight,
          newWidth: window.innerWidth,
        },
      };
      worker.postMessage(resizePayload);
    });
  }, []);

  return <canvas className="w-full h-full relative" ref={canvasRef}></canvas>;
}
