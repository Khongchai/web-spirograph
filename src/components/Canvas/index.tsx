import React, { MutableRefObject, useRef, useState } from "react";
import CycloidControlsData from "../../classes/CycloidControls";
import { Vector2 } from "../../types/vector2";
import useDrawCycloid from "../../utils/hooks/useDrawCycloid";
import useHandlePan from "../../utils/hooks/useHandlePan";
import useHandleZoom from "../../utils/hooks/useHandleZoom";
import useTraceCycloidPath from "../../utils/hooks/useTraceCycloidPath";
import useClearTracedCanvasOnRerender from "../../utils/hooks/worker/useClearTracedCanvasOnRerender";
import useSetupCanvasWorker from "../../utils/hooks/worker/useSetupCanvasWorker";

interface CanvasProps {
  cycloidControls: MutableRefObject<CycloidControlsData>;
  parent: MutableRefObject<HTMLElement | null>;
  parentWrapper: MutableRefObject<HTMLElement | null>;
}

const Canvas: React.FC<CanvasProps> = ({
  cycloidControls: cycloidControlsRef,
  parent: parentRef,
  parentWrapper: parentWrapperRef,
}) => {
  // TODO
  const [mode, setMode] = useState<"animate" | "instant">("animate");
  const [animateMode, setAnimateMode] = useState<"auto" | "dragAndDrop">(
    "auto"
  );

  /*
    Cycloids are drawn on one canvas and their paths are traced on another.
  */
  const pointsToTrace = useRef<Vector2[]>([]);
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const panRef = useRef<Vector2>({ x: 0, y: 0 });
  const traceCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useSetupCanvasWorker({
    drawCanvasRef,
    parentRef,
    traceCanvasRef,
    panRef,
    cycloidControlsRef,
    parentWrapperRef,
  });

  useClearTracedCanvasOnRerender(cycloidControlsRef);

  useDrawCycloid(
    drawCanvasRef,
    pointsToTrace,
    cycloidControlsRef,
    parentRef as MutableRefObject<HTMLElement>,
    panRef
  );

  useTraceCycloidPath(
    traceCanvasRef,
    pointsToTrace,
    panRef,
    cycloidControlsRef
  );

  useHandleZoom([drawCanvasRef, traceCanvasRef], parentWrapperRef);
  useHandlePan(parentWrapperRef, panRef, [drawCanvasRef, traceCanvasRef]);

  if (mode === "animate") {
    return (
      <>
        <canvas
          id="animation-draw-canvas"
          ref={drawCanvasRef}
          className="absolute"
        ></canvas>
        <canvas
          id="animation-trace-canvas"
          ref={traceCanvasRef}
          className="absolute opacity-50"
        ></canvas>
      </>
    );
  } else {
    return <div>Instant thing</div>;
  }
};

export default Canvas;
