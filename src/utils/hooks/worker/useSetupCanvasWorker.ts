import React, { useContext, useEffect } from "react";
import {
  OnMessageOperationPayload,
  WorkerOperation,
} from "../../../canvasWorker/models/onMessageInitialPayloads";
import CycloidControls from "../../../classes/CycloidControls";
import { CanvasWorker } from "../../../contexts/worker";
import { Vector2 } from "../../../types/vector2";

export default function useSetupCanvasWorker({
  drawCanvasRef,
  parentRef,
  traceCanvasRef,
  panRef,
  cycloidControlsRef,
  pointsToTraceRef,
}: {
  drawCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  traceCanvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  parentRef: React.MutableRefObject<HTMLElement | null>;
  pointsToTraceRef: React.MutableRefObject<Vector2[]>;
  panRef: React.MutableRefObject<Vector2 | null>;
  cycloidControlsRef: React.MutableRefObject<CycloidControls>;
}) {
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
          panRef,
          cycloidControlsRef,
          pointsToTraceRef,
        },
        workerOperations: WorkerOperation.SetupCanvas,
      } as OnMessageOperationPayload,
      [drawCanvas, traceCanvas]
    );
  }, []);
}
