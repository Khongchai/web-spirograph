import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import CycloidParams from "../../types/cycloidParams";
import { Vector2 } from "../../types/vector2";
import useDrawCycloid from "../../utils/useDrawCycloid";
import useTraceCycloidPath from "../../utils/useTraceCycloidPath";

interface CanvasProps {
  cycloidParams: CycloidParams;
  clearCanvasToggle: boolean;
  showStructure: MutableRefObject<boolean>;
}

const Canvas: React.FC<CanvasProps> = ({
  cycloidParams,
  clearCanvasToggle,
  showStructure,
}) => {
  const [mode, setMode] = useState<"animate" | "instant">("animate");
  const [animateMode, setAnimateMode] = useState<"auto" | "dragAndDrop">(
    "auto"
  );

  /*
    Cycloids are drawn on one canvas and their paths are traced on another.
  */
  const pointToTrace = useRef<Vector2>({ x: 0, y: 0 });
  //TODO temporary
  const pointToTrace2 = useRef<Vector2>({ x: 0, y: 0 });

  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  useDrawCycloid(
    drawCanvasRef,
    pointToTrace,
    pointToTrace2,
    cycloidParams,
    clearCanvasToggle,
    showStructure
  );
  const traceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  useTraceCycloidPath(
    traceCanvasRef,
    pointToTrace,
    clearCanvasToggle,
    pointToTrace2
  );

  useEffect(() => {
    drawCanvasRef.current
      ?.getContext("2d")
      ?.clearRect(0, 0, window.innerWidth, window.innerHeight);
    traceCanvasRef.current
      ?.getContext("2d")
      ?.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }, [clearCanvasToggle]);

  if (mode === "animate") {
    return (
      <div>
        <canvas
          id="animation-draw-canvas"
          ref={drawCanvasRef}
          className="w-full h-full fixed"
        ></canvas>
        <canvas
          id="animation-trace-canvas"
          ref={traceCanvasRef}
          className="w-full h-full fixed opacity-50"
        ></canvas>
      </div>
    );
  } else {
    return <div>Instant thing</div>;
  }
};

export default Canvas;
