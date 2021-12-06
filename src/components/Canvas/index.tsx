import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import CycloidControls from "../../types/cycloidControls";
import CycloidParams from "../../types/cycloidParams";
import { Vector2 } from "../../types/vector2";
import handleZoomAndDrag from "../../utils/handleZoom";
import useDrawCycloid from "../../utils/hooks/useDrawCycloid";
import useTraceCycloidPath from "../../utils/hooks/useTraceCycloidPath";

interface CanvasProps {
  cycloidControls: CycloidControls;
  clearCanvasToggle: boolean;
  showStructure: MutableRefObject<boolean>;
  parent: MutableRefObject<HTMLElement | null>;
}

const Canvas: React.FC<CanvasProps> = ({
  cycloidControls,
  clearCanvasToggle,
  showStructure,
  parent,
}) => {
  const [mode, setMode] = useState<"animate" | "instant">("animate");
  const [animateMode, setAnimateMode] = useState<"auto" | "dragAndDrop">(
    "auto"
  );

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
    showStructure,
    parent as MutableRefObject<HTMLElement>
  );

  const traceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  useTraceCycloidPath(traceCanvasRef, pointToTrace, clearCanvasToggle);

  handleZoomAndDrag([drawCanvasRef, traceCanvasRef]);

  useEffect(() => {
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
