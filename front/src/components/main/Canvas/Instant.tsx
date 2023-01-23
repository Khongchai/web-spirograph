import { MutableRefObject, useContext, useEffect, useRef } from "react";
import CycloidControls from "../../../classes/domain/cycloidControls";
import { Rerender } from "../../../contexts/rerenderToggle";
import { CHANGE_SETTINGS_REASON as CHANGE_SETTINGS_REASONS } from "../../../types/contexts/rerenderReasons";
import { CanvasSizeManagers } from "../../../utils/CanvasManagers/CanvasSizeManager";
import canvasTransformer from "../../../utils/CanvasManagers/petite-transform";
import { useDelayedCallback } from "../../../utils/InstantDrawer/useDelayedWorkerUpdate";
import { useSetupInstantDrawerCanvas } from "../../../utils/InstantDrawer/useSetupInstantDrawerCanvas";
import {
  InstantDrawerWorkerOperations,
  InstantDrawerWorkerPayload,
  TransformPayload,
} from "../../../Workers/InstantDrawer/instantDrawerWorkerPayloads";
import { InstantDrawCycloidMapper } from "../../../Workers/InstantDrawer/mappers/InstantDrawerMapper";

/**
 * The equation for each cycloid consists of mainly two parameters:
 * 1. Where its center is.
 * 2. Where the end of its rod its.
 *
 * To derive, find out first what its center is influenced by:
 *
 * In the case of the first cycloid, we know that its center is influenced by the rotation of its parent _alpha_, so:
 *
 * ```python
 * cycloidCenter = cos(alpha) * parentRadius + cycloidRadius # just swap cos for sin for y.
 * ```
 *
 * As for the rod, we know that it's influenced by the rotation of its parent's rotation and the cycloid's rotation _beta_, so:
 *
 * ```python
 * rodEnd = cycloidCenter + (rodLength * cos(scale * alpha + scale2 * beta)) # scale is the scale of the parent's rotation, scale2 is the scale of the cycloid's rotation.
 * ```
 *
 * Then we can begin drawing the rod's end.
 *
 * Side note:
 * beta is equals to alpha * parentRadius / cycloidRadius as we know that the area rolled by the parent is always proportional to the
 * area rolled by the cycloid.
 *
 * Deeper nested cycloids can be derived in a similar manner.
 *
 * Full equations for 5 nested level (just swap cos for sin for y):
 * level1:
 *
 * ```python
 *  cycloidCenter = cos(alpha) + (parentRadius + cycloid1Radius);
 *  rodEnd = cycloidCenter + rodlength * cos(alpha + beta))
 * ```
 *
 * level2:
 * ```python
 *  cycloidCenter = cos(alpha) + (parentRadius)
 * ```
 */
export default function InstantCanvas({
  cycloidControls,
  pointsAmount,
  parent,
}: {
  cycloidControls: MutableRefObject<CycloidControls>;
  parent: MutableRefObject<HTMLElement | null>;
  pointsAmount: number;
}) {
  const instantDrawCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    CanvasSizeManagers.instantDrawerWorkerThread.addOnEventCallback(
      {
        eventCallback: () => {
          if (!workerRef.current || !parent.current) return;

          workerRef.current!.postMessage({
            setCanvasSizePayload: {
              canvasHeight: parent.current!.clientHeight,
              canvasWidth: parent.current!.clientWidth,
              devicePixelRatio
            },
            operation: InstantDrawerWorkerOperations.setCanvasSize,
          } as InstantDrawerWorkerPayload);
        },
        call: "onceAndOnEvent",
      });

    return function () {
      CanvasSizeManagers.instantDrawerWorkerThread.clearAllListeners();
    };
  }, []);

  const workerRef = useSetupInstantDrawerCanvas({
    cycloidControlsRef: cycloidControls,
    instantDrawCanvasRef,
    parentRef: parent,
    pointsAmount,
  });

  const rerender = useContext(Rerender);
  useDelayedCallback(
    () => {
      if (rerender.reason & CHANGE_SETTINGS_REASONS)
        if (workerRef.current) {
          const {
            currentCycloidId,
            globalTimeStepScale: globalTimeStep,
            cycloidManager,
          } = cycloidControls.current;

          workerRef.current.postMessage({
            setParametersPayload: {
              pointsAmount,
              cycloids: InstantDrawCycloidMapper.fromCycloidParams(
                cycloidManager.getAllAncestors(currentCycloidId)
              ),
              timeStepScalar: globalTimeStep,
            },
            operation: InstantDrawerWorkerOperations.setParameters,
          } as InstantDrawerWorkerPayload);
        }
    },
    0,
    [rerender]
  );

  _useHandleTransform(parent, ({ absolute }) => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        transformPayload: absolute as TransformPayload,
        operation: InstantDrawerWorkerOperations.transform,
      } as InstantDrawerWorkerPayload);
    }
  });

  return (
    <canvas
      id="instant-draw-canvas"
      ref={instantDrawCanvasRef}
      className="absolute w-full h-full"
    ></canvas>
  );
}

function _useHandleTransform(
  parentWrapper: MutableRefObject<HTMLElement | null>,
  onTransformCallback: ({
    absolute,
    relative
  }: {
    absolute: {
      x: number, y: number, z: number
    },
    relative: {
      dx: number, dy: number, dz: number
    }
  }) => void
) {
  useEffect(() => {
    if (!parentWrapper?.current) {
      return;
    }

    canvasTransformer.onTransform(onTransformCallback);

    return () => canvasTransformer.disposeListener(onTransformCallback);
  }, []);
}
