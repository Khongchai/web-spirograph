import React, { useEffect, useRef, useState } from "react";
import { Vector2 } from "../../utils/types/vector2";
import useDrawCycloid from "../../utils/useDrawCycloid";
import useTraceCycloidPath from "../../utils/useTraceCycloidPath";

interface CanvasProps {}

const Canvas: React.FC<CanvasProps> = ({}) => {
  const [mode, setMode] = useState<"animate" | "instant">("animate");
  const [animateMode, setAnimateMode] = useState<"auto" | "dragAndDrop">(
    "auto"
  );

  /*
    Cycloids are drawn on one canvas and their paths are traced on another.
  */
  const pointToTrace = useRef<Vector2>({ x: 0, y: 0 });
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  useDrawCycloid(drawCanvasRef, pointToTrace);
  const traceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  useTraceCycloidPath(traceCanvasRef, pointToTrace);

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
