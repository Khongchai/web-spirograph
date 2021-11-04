import React, { useEffect, useRef, useState } from "react";
import Cycloid from "../../utils/classes/Cycloid";
import CycloidParams from "../../utils/types/cycloidParams";
import { Vector2 } from "../../utils/types/vector2";
import useDrawCycloid from "../../utils/useDrawCycloid";
import useTraceCycloidPath from "../../utils/useTraceCycloidPath";

interface CanvasProps {
  cycloidParams: CycloidParams;
  clearCanvasToggle: boolean;
}

const Canvas: React.FC<CanvasProps> = ({
  cycloidParams,
  clearCanvasToggle,
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
  useDrawCycloid(drawCanvasRef, pointToTrace, cycloidParams, clearCanvasToggle);
  const traceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  useTraceCycloidPath(traceCanvasRef, pointToTrace, clearCanvasToggle);

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
