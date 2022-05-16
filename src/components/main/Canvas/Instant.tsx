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

function epitrochoid1({
  r1,
  r2,
  alpha,
  beta,
  h,
  invertCosAndSin,
}: {
  r1: number;
  r2: number;
  alpha: number;
  beta: number;
  h: number;
  invertCosAndSin: boolean;
}) {
  const xTrig = (x: number) => (invertCosAndSin ? Math.sin(x) : Math.cos(x));
  const yTrig = (y: number) => (invertCosAndSin ? Math.sin(y) : Math.cos(y));
  const newPoint = {
    x: (r1 + r2) * xTrig(alpha) + h * xTrig(alpha + beta),
    y: (r1 + r2) * yTrig(alpha) + h * yTrig(alpha + beta),
  };

  return newPoint;
}
function epitrochoid2() {}
function epitrochoid3() {}

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
  useEffect(() => {
    let time = 0;
    let previousPoint: null | { x: number; y: number } = null;

    function draw() {
      //TODO remove this
      if (
        cycloidControls.current.cycloidManager.getAllCycloidParams().length > 2
      ) {
        throw new Error("Too many cycloids, we're testing only 2");
      }

      if (
        cycloidControls.current.cycloidManager.getAllCycloidParams().length > 5
      ) {
        throw new Error(
          "Instant draw supports only upto 5 nested cycloids for now"
        );
      }

      if (instantDrawCanvasRef.current) {
        const ctx = instantDrawCanvasRef.current.getContext("2d")!;
        ctx.strokeStyle = colors.purple.light;
        const { instantCycloidParamtersArray, instantGlobalParameters } =
          mapInstantDrawerProps(cycloidControls.current);
        const { outerBoundingCircleRadius, timeStep } = instantGlobalParameters;

        instantCycloidParamtersArray.forEach((cycloidParam) => {
          for (let i = 0; i < points; i++) {
            const alpha = (time += timeStep);
            const beta =
              ((alpha * cycloidParam.radius) / outerBoundingCircleRadius) *
              cycloidParam.speedScalar;

            const {
              moveOutsideOfParent,
              radius,
              rodLength,
              rotationDirection,
              speedScalar,
            } = cycloidParam;
            const { x, y } = epitrochoid1({
              alpha,
              beta,
              h: rodLength,
              invertCosAndSin: rotationDirection === "clockwise",
              r1: outerBoundingCircleRadius,
              r2: radius + radius * moveOutsideOfParent,
            });

            if (!previousPoint) {
              previousPoint = { x, y };
            } else {
              ctx.beginPath();
              ctx.arc(x, y, 10, 0, 2 * Math.PI);
              ctx.fill();
              // ctx.beginPath();
              // ctx.moveTo(previousPoint.x, previousPoint.y);
              // ctx.lineTo(x, y);
              // ctx.stroke();
              // previousPoint = { x, y };
            }
          }

          time = 0;
        });
      }
    }

    draw();
  }, []);

  /* TODO move this to worker thread later, just get it working first. */
  return (
    <canvas
      id="instant-draw-canvas"
      ref={instantDrawCanvasRef}
      className="absolute"
    ></canvas>
  );
}
