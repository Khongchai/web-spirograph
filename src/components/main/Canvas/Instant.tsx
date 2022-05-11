import { MutableRefObject, useRef } from "react";
import CycloidControls from "../../../classes/cycloidControls";

//TODO this will be moved to a worker thread later.

interface InstantCanvasProps {
  cycloidControls: MutableRefObject<CycloidControls>;
  points: number;
}

export default function InstantCanvas({
  cycloidControls,
  points,
}: InstantCanvasProps) {
  const instantDrawCanvasRef = useRef<HTMLCanvasElement>(null);

  /* TODO move this to worker thread later, just get it working first. */
  return (
    <canvas
      id="instant-draw-canvas"
      ref={instantDrawCanvasRef}
      className="absolute"
    ></canvas>
  );
}
