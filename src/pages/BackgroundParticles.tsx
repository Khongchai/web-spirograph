import React, { useEffect, useRef, useState } from "react";
import colors from "../constants/colors";
//@ts-ignore
import Worker from "worker-loader!../Workers/BackgroundParticles/particles.worker";
import ParticlesWorkerPayload, {
  ParticlesWorkerOperation,
} from "../Workers/BackgroundParticles/payloads";

export default function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const worker = new Worker();

    const canvas = canvasRef.current!;
    const offscreenCanvas = canvas.transferControlToOffscreen();
    const payload: ParticlesWorkerPayload = {
      operation: ParticlesWorkerOperation.Init,
      initPayload: {
        canvasHeight: canvas.height,
        canvasWidth: canvas.width,
        canvas: offscreenCanvas,
      },
    };
    worker.postMessage(payload, [offscreenCanvas]);
  }, []);

  return <canvas className="w-full h-full relative" ref={canvasRef}></canvas>;
}
