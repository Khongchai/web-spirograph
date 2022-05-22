import { MutableRefObject, useEffect, useRef } from "react";
import CycloidControls from "../../../classes/cycloidControls";
import {
  InstantDrawerWorkerOperations,
  InstantDrawerWorkerPayload,
} from "../../../Workers/InstantDrawer/instantDrawerWorkerPayloads";

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
    if (!instantDrawCanvasRef.current || !parent.current) return;

    const worker = new Worker(
      new URL(
        "../../../Workers/InstantDrawer/instantDrawer.worker",
        import.meta.url
      )
    );

    //refactor into a separate mapper
    const payload = {
      operation: InstantDrawerWorkerOperations.initializeDrawer,
      initializeDrawerPayload: {
        canvas: instantDrawCanvasRef.current,
        canvasHeight: parent.current!.clientHeight,
        canvasWidth: parent.current!.clientWidth,
        //TODO map this
        cycloids: [{}],
        pointsAmount,
        initialTheta: 0,
      },
    } as InstantDrawerWorkerPayload;
    worker.postMessage([instantDrawCanvasRef.current]);
  }, []);

  return (
    <canvas
      id="instant-draw-canvas"
      ref={instantDrawCanvasRef}
      className="absolute"
    ></canvas>
  );
}
