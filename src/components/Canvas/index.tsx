import React, {
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  OnMessagePayload,
  WorkerOperation,
} from "../../canvasWorker/models/onMessagePayloads";
import CycloidControlsData from "../../classes/CycloidControls";
import { Rerender } from "../../contexts/rerenderToggle";
import { CanvasWorker } from "../../contexts/worker";
import { Vector2 } from "../../types/vector2";
import useDrawCycloid from "../../utils/hooks/useDrawCycloid";
import useHandlePan from "../../utils/hooks/useHandlePan";
import useHandleZoom from "../../utils/hooks/useHandleZoom";
import useTraceCycloidPath from "../../utils/hooks/useTraceCycloidPath";
import useClearCanvasOnRerender from "../../utils/hooks/worker/useClearCanvasOnRerender";
import useSetupCanvasWorker from "../../utils/hooks/worker/useSetupCanvasWorker";

interface CanvasProps {
  cycloidControls: MutableRefObject<CycloidControlsData>;
  parent: MutableRefObject<HTMLElement | null>;
  parentWrapper: MutableRefObject<HTMLElement | null>;
}

const Canvas: React.FC<CanvasProps> = ({
  cycloidControls,
  parent: parentRef,
  parentWrapper,
}) => {
  // TODO
  const [mode, setMode] = useState<"animate" | "instant">("animate");
  const [animateMode, setAnimateMode] = useState<"auto" | "dragAndDrop">(
    "auto"
  );

  const rerender = useContext(Rerender);

  /*
    Cycloids are drawn on one canvas and their paths are traced on another.
  */
  const pointsToTrace = useRef<Vector2[]>([]);
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const panRef = useRef<Vector2>({ x: 0, y: 0 });
  const traceCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useSetupCanvasWorker(drawCanvasRef, traceCanvasRef, parentRef);

  //TODO refactor this into a custom hook (useClearTracedPath) + pass to Worker.
  useClearCanvasOnRerender(cycloidControls);

  useDrawCycloid(
    drawCanvasRef,
    pointsToTrace,
    cycloidControls,
    parentRef as MutableRefObject<HTMLElement>,
    panRef
  );

  useTraceCycloidPath(traceCanvasRef, pointsToTrace, panRef, cycloidControls);

  useHandleZoom([drawCanvasRef, traceCanvasRef], parentWrapper);
  useHandlePan(parentWrapper, panRef, [drawCanvasRef, traceCanvasRef]);

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
