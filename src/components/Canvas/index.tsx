import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import CycloidControls from "../../types/cycloidControls";
import CycloidParams from "../../types/cycloidParams";
import { Vector2 } from "../../types/vector2";
import useHandleZoom from "../../utils/hooks/useHandleZoom";
import useDrawCycloid from "../../utils/hooks/useDrawCycloid";
import useTraceCycloidPath from "../../utils/hooks/useTraceCycloidPath";

interface CanvasProps {
  cycloidControls: MutableRefObject<CycloidControls>;
  clearCanvasToggle: boolean;
  parent: MutableRefObject<HTMLElement | null>;
}

const Canvas: React.FC<CanvasProps> = ({
  cycloidControls,
  clearCanvasToggle,
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
    parent as MutableRefObject<HTMLElement>
  );

  const traceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  useTraceCycloidPath(traceCanvasRef, pointToTrace, clearCanvasToggle);

  useHandleZoom([drawCanvasRef, traceCanvasRef]);

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
  }, []);

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
