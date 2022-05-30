import { MutableRefObject, useEffect, useRef } from "react";
import CycloidControls from "../../classes/cycloidControls";
import {
  InstantDrawerWorkerOperations,
  InstantDrawerWorkerPayload,
} from "../../Workers/InstantDrawer/instantDrawerWorkerPayloads";
import InstantDrawCycloid from "../../Workers/InstantDrawer/models/Cycloid";

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

    const instantDrawCycloids = cycloidsToDraw.map((param) => {
      const {
        animationSpeedScale,
        moveOutSideOfParent,
        radius,
        rodLengthScale,
        rotationDirection,
      } = param;
      return {
        isClockwise: rotationDirection === "clockwise",
        isOutsideOfParent: moveOutSideOfParent,
        radius,
        rodLength: rodLengthScale * radius,
        thetaScale: animationSpeedScale,
      } as InstantDrawCycloid;
    });

    const payload = {
      operation: InstantDrawerWorkerOperations.initializeDrawer,
      initializeDrawerPayload: {
        canvas: offscreenCanvas,
        canvasHeight,
        canvasWidth,
        cycloids: instantDrawCycloids,
        pointsAmount,
        initialTheta: 0,
        timeStepScalar: cycloidControls.globalTimeStep,
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

    const payload = getInstantDrawPayload(
      cycloidControlsRef.current!,
      offscreenCanvas,
      pointsAmount,
      parentRef.current.clientHeight,
      parentRef.current.clientWidth
    );

    worker.postMessage(payload, [offscreenCanvas]);

    return () => worker.terminate();
  }, []);

  return workerRef;
}
