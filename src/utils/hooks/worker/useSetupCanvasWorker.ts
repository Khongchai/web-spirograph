import { useContext, useEffect } from "react";
import {
  OnMessagePayload,
  WorkerOperation,
} from "../../../canvasWorker/models/onMessagePayloads";
import { CanvasWorker } from "../../../contexts/worker";

export default function useSetupCanvasWorker(
  drawCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  traceCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  parentRef: React.MutableRefObject<HTMLElement | null>
) {
  const worker = useContext(CanvasWorker);

  useEffect(() => {
    const drawCanvas = (
      drawCanvasRef.current as any
    ).transferControlToOffscreen();
    const traceCanvas = (
      traceCanvasRef.current as any
    ).transferControlToOffscreen();
    worker.postMessage(
      {
        setupCanvas: {
          drawCanvas,
          traceCanvas,
          parentHeight: parentRef.current!.clientWidth,
          parentWidth: parentRef.current!.clientHeight,
        },
        workerOperations: WorkerOperation.SetupCanvas,
      } as OnMessagePayload,
      [drawCanvas, traceCanvas]
    );
  }, []);
}
