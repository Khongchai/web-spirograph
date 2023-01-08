import React, { MutableRefObject, useContext, useEffect, useRef } from "react";
import CycloidControlsData from "../../../classes/domain/cycloidControls";
import { Vector2 } from "../../../classes/DTOInterfaces/vector2";
import { Rerender } from "../../../contexts/rerenderToggle";
import { CanvasSizeManagers } from "../../../utils/CanvasManagers/CanvasSizeManager";
import canvasTransformer from "../../../utils/CanvasManagers/petite-transform";
import useDrawCycloid from "../../../utils/hooks/useDrawCycloid";
import useTraceCycloidPath from "../../../utils/hooks/useTraceCycloidPath";

interface CanvasProps {
  cycloidControls: MutableRefObject<CycloidControlsData>;
  parent: MutableRefObject<HTMLElement | null>;
  parentWrapper: MutableRefObject<HTMLElement | null>;
}

const AnimatedCanvas: React.FC<CanvasProps> = ({
  cycloidControls,
  parent,
  parentWrapper,
}) => {
  useEffect(() => {
    return () => {
      CanvasSizeManagers.mainThread.clearAllListeners();
    };
  }, []);

  const rerender = useContext(Rerender);

  /*
    Cycloids are drawn on one canvas and their paths are traced on another.
  */
  const pointsToTrace = useRef<Vector2[]>([]);

  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  useDrawCycloid(
    drawCanvasRef,
    pointsToTrace,
    cycloidControls,
    parent as MutableRefObject<HTMLElement>,
  );

  const traceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  useTraceCycloidPath(traceCanvasRef, pointsToTrace, cycloidControls);

  _useHandleTransform([drawCanvasRef, traceCanvasRef], parentWrapper);

  useEffect(() => {
    if (cycloidControls.current.clearTracedPathOnParamsChange) {
      const drawRef = drawCanvasRef.current?.getContext("2d");
      const traceRef = traceCanvasRef.current?.getContext("2d");
      drawRef?.save();
      traceRef?.save();

      drawRef?.setTransform(1, 0, 0, 1, 0, 0);
      traceRef?.setTransform(1, 0, 0, 1, 0, 0);
      drawRef?.clearRect(
        0,
        0,
        parent.current!.clientWidth * devicePixelRatio,
        parent.current!.clientHeight * devicePixelRatio
      );
      traceRef?.clearRect(
        0,
        0,
        parent.current!.clientWidth * devicePixelRatio,
        parent.current!.clientHeight * devicePixelRatio
      );

      drawRef?.restore();
      traceRef?.restore();
    }
  }, [rerender]);

  return (
    <>
      <canvas
        id="animation-draw-canvas"
        ref={drawCanvasRef}
        className="absolute w-full h-full"
      ></canvas>
      <canvas
        id="animation-trace-canvas"
        ref={traceCanvasRef}
        className="absolute opacity-50 w-full h-full"
      ></canvas>
    </>
  );
};

export default AnimatedCanvas;

function _useHandleTransform(
  canvases: MutableRefObject<HTMLCanvasElement | null>[],
  // Parent wrapper is solely for listening to events in lieu of document.addEventListener
  parentWrapper: MutableRefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!parentWrapper?.current) {
      return;
    }

    canvasTransformer.updateOnTransform(canvases.map((c) => c.current?.getContext("2d")!));
  }, []);
}
