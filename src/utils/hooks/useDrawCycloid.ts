import React, { MutableRefObject, useContext, useEffect, useRef } from "react";
import {
  OnMessageOperationPayload,
  WorkerOperation,
} from "../../canvasWorker/models/onMessageInitialPayloads";
import Cycloid from "../../classes/Cycloid";
import CycloidControls from "../../classes/CycloidControls";
import { CanvasWorker } from "../../contexts/worker";
import { Vector2 } from "../../types/vector2";
import useGenerateCycloids from "./useGenerateCycloids";
import useLoadCycloidParams from "./useLoadCycloidParams";
import useSetOutermostBoundingCirclePosition from "./useSetOutermostBoundingCirclePosition";

export default function useDrawCanvas(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  pointsToTrace: React.MutableRefObject<Vector2[]>,
  cycloidControls: React.MutableRefObject<CycloidControls>,
  parent: MutableRefObject<HTMLElement>,
  panRef: MutableRefObject<Vector2>
) {
  let { generatedCycloids: cycloids, outermostBoundingCircle } =
    useGenerateCycloids(cycloidControls);

  useLoadCycloidParams(cycloids, outermostBoundingCircle, cycloidControls);

  useSetOutermostBoundingCirclePosition(outermostBoundingCircle, parent, 300);

  const cycloidsRefForCanvas = useRef<Cycloid[] | null>();
  useEffect(() => {
    cycloidsRefForCanvas.current = cycloids;
  }, [cycloids]);

  const worker = useContext(CanvasWorker);

  useEffect(() => {
    if (canvasRef.current && parent.current) {
      worker.postMessage({
        workerOperations: WorkerOperation.DrawCycloids,
        drawCycloid: {
          cycloidsRefForCanvas,
          outermostBoundingCircle,
        },
      } as OnMessageOperationPayload);
    }
  }, []);
}
