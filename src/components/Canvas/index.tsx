import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import CycloidControls from "../../types/cycloidControls";
import { Vector2 } from "../../types/vector2";
import useDrawCycloid from "../../utils/hooks/useDrawCycloid";
import useHandlePan from "../../utils/hooks/useHandlePan";
import useHandleZoom from "../../utils/hooks/useHandleZoom";
import useTraceCycloidPath from "../../utils/hooks/useTraceCycloidPath";

interface CanvasProps {
  cycloidControls: MutableRefObject<CycloidControls>;
  clearCanvasToggle: boolean;
  parent: MutableRefObject<HTMLElement | null>;
  parentWrapper: MutableRefObject<HTMLElement | null>;
}

const Canvas: React.FC<CanvasProps> = ({
  cycloidControls,
  clearCanvasToggle,
  parent,
  parentWrapper,
}) => {
  const [mode, setMode] = useState<"animate" | "instant">("animate");
  const [animateMode, setAnimateMode] = useState<"auto" | "dragAndDrop">(
    "auto"
  );

  const panRef = useRef<Vector2>({ x: 0, y: 0 });

  /*
    Cycloids are drawn on one canvas and their paths are traced on another.
  */
  const pointToTrace = useRef<Vector2>({ x: 0, y: 0 });

  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  useDrawCycloid(
    drawCanvasRef,
    pointToTrace,
    cycloidControls,
    clearCanvasToggle,
    parent as MutableRefObject<HTMLElement>,
    panRef
  );

  const traceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  useTraceCycloidPath(traceCanvasRef, pointToTrace, clearCanvasToggle, panRef);

  useHandleZoom([drawCanvasRef, traceCanvasRef]);
  useHandlePan(parentWrapper, panRef, [drawCanvasRef, traceCanvasRef]);

  useEffect(() => {
    if (cycloidControls.current.clearTracedPathOnParamsChange) {
      drawCanvasRef.current
        ?.getContext("2d")
        ?.clearRect(
          0,
          0,
          parent.current!.clientWidth,
          parent.current!.clientHeight
        );
      traceCanvasRef.current
        ?.getContext("2d")
        ?.clearRect(
          0,
          0,
          parent.current!.clientWidth,
          parent.current!.clientHeight
        );
    }
  }, [clearCanvasToggle]);

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
