import { MutableRefObject, useEffect, useRef } from "react";
import CycloidControls from "../../classes/domain/cycloidControls";
import {
  InstantDrawerWorkerOperations,
  InstantDrawerWorkerPayload,
} from "../../Workers/InstantDrawer/instantDrawerWorkerPayloads";
import { InstantDrawCycloidMapper } from "../../Workers/InstantDrawer/mappers/InstantDrawerMapper";
import canvasTransformer from "../CanvasManagers/petite-transform";

export function useSetupInstantDrawerCanvas({
  instantDrawCanvasRef,
  parentRef,
  cycloidControlsRef,
  pointsAmount,
}: {
  instantDrawCanvasRef: MutableRefObject<HTMLCanvasElement | null>;
  parentRef: MutableRefObject<HTMLElement | null>;
  cycloidControlsRef: MutableRefObject<CycloidControls | null>;
  pointsAmount: number;
}) {
  const workerRef = useRef<Worker>();

  function getInstantDrawPayload(
    cycloidControls: CycloidControls,
    offscreenCanvas: OffscreenCanvas,
    pointsAmount: number,
    canvasHeight: number,
    canvasWidth: number
  ) {
    // Grab cycloids only up until the currently selected one
    // Make sure that the currently selected cycloid index is really its position in the array, not the id
    const { cycloidManager, currentCycloidId } = cycloidControls;
    const cycloidsToDraw = cycloidManager.getAllAncestors(currentCycloidId);

    const instantDrawCycloids =
      InstantDrawCycloidMapper.fromCycloidParams(cycloidsToDraw);

    const payload = {
      operation: InstantDrawerWorkerOperations.initializeDrawer,
      initializeDrawerPayload: {
        canvas: offscreenCanvas,
        canvasHeight,
        canvasWidth,
        cycloids: instantDrawCycloids,
        pointsAmount,
        initialTheta: 0,
        timeStepScalar: cycloidControls.globalTimeStepScale,
        initialTransform: canvasTransformer.getAbsoluteTransform(),
        devicePixelRatio,
      },
    } as InstantDrawerWorkerPayload;

    return payload;
  }

  useEffect(() => {
    if (!instantDrawCanvasRef.current || !parentRef.current) return;

    const worker = new Worker(
      new URL(
        "../../Workers/InstantDrawer/instantDrawer.worker",
        import.meta.url
      )
    );
    workerRef.current = worker;

    const offscreenCanvas =
      instantDrawCanvasRef.current.transferControlToOffscreen();

    const rect = parentRef.current.getBoundingClientRect();

    const payload = getInstantDrawPayload(
      cycloidControlsRef.current!,
      offscreenCanvas,
      pointsAmount,
      rect.height,
      rect.width
    );

    worker.postMessage(payload, [offscreenCanvas]);

    return () => worker.terminate();
  }, []);

  return workerRef;
}
