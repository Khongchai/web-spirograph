import { MutableRefObject, useEffect, useRef } from "react";
import Cycloid from "../../../classes/Cycloid";
import CycloidControls from "../../../classes/cycloidControls";
import colors from "../../../constants/colors";

//TODO this will be moved to a worker thread later.

//TODO this is the model for the drawer in the worker thread.
interface InstantCycloidDrawerProps {
  instantCycloidParamtersArray: InstantCycloidParameters[];
  instantGlobalParameters: InstantBaseBoundingParameters;
}

interface InstantCycloidParameters {
  rodLength: number;
  speedScalar: number;
  /**
   * 1 true 0 false, for multiplication.
   */
  moveOutsideOfParent: 1 | 0;
  /**
   * counterclockwise will swap cos and sin for x and y
   */
  rotationDirection: "clockwise" | "counterclockwise";
  radius: number;
}

interface InstantBaseBoundingParameters {
  timeStep: number;
  outerBoundingCircleRadius: number;
}

interface InstantCanvasProps {
  cycloidControls: MutableRefObject<CycloidControls>;
  points: number;
}

function mapInstantDrawerProps(cycloidControls: CycloidControls) {
  return {
    instantCycloidParamtersArray: cycloidControls.cycloidManager
      .getAllCycloidParams()
      .map(
        (cycloid) =>
          ({
            moveOutsideOfParent: cycloid.moveOutSideOfParent ? 1 : 0,
            radius: cycloid.radius,
            rodLength: cycloid.rodLengthScale,
            rotationDirection: cycloid.rotationDirection,
            speedScalar: cycloid.animationSpeedScale,
          } as InstantCycloidParameters)
      ),
    instantGlobalParameters: {
      outerBoundingCircleRadius:
        cycloidControls.outerMostBoundingCircle.getRadius(),
      timeStep: cycloidControls.globalTimeStep,
    },
  } as InstantCycloidDrawerProps;
}

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
  points,
}: InstantCanvasProps) {
  const instantDrawCanvasRef = useRef<HTMLCanvasElement>(null);

  //TODO this is the code that's gonna be moved into the worker.
  useEffect(() => {}, []);

  /* TODO move this to worker thread later, just get it working first. */
  return (
    <canvas
      id="instant-draw-canvas"
      ref={instantDrawCanvasRef}
      className="absolute"
    ></canvas>
  );
}
