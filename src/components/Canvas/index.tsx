import React, {
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Rerender, RerenderToggle } from "../../contexts/rerenderToggle";
import CycloidControlsData from "../../classes/CycloidControls";
import { Vector2 } from "../../types/vector2";
import useDrawCycloid from "../../utils/hooks/useDrawCycloid";
import useHandlePan from "../../utils/hooks/useHandlePan";
import useHandleZoom from "../../utils/hooks/useHandleZoom";
import useTraceCycloidPath from "../../utils/hooks/useTraceCycloidPath";
import { OnMessagePayload } from "../../canvasWorker/models/onMessagePayload";

interface CanvasProps {
  cycloidControls: MutableRefObject<CycloidControlsData>;
  parent: MutableRefObject<HTMLElement | null>;
  parentWrapper: MutableRefObject<HTMLElement | null>;
}

const Canvas: React.FC<CanvasProps> = ({
  cycloidControls,
  parent,
  parentWrapper,
}) => {
  // TODO
  const [mode, setMode] = useState<"animate" | "instant">("animate");
  const [animateMode, setAnimateMode] = useState<"auto" | "dragAndDrop">(
    "auto"
  );

  const rerender = useContext(Rerender);

  //TODO refactor this into a custom hook (useSetupWorkerCanvasConnection)
  useEffect(() => {
    const worker = new Worker("../../canvasWorker/cycloidAnimationWorker.ts");
    const drawCanvas = (
      drawCanvasRef.current as any
    ).transferControlToOffscreen();
    const traceCanvas = (
      traceCanvasRef.current as any
    ).transferControlToOffscreen();
    worker.postMessage(
      {
        setupCanvas: {
          drawCanvas,
          traceCanvas,
          parentHeight: parent.current!.clientHeight,
          parentWidth: parent.current!.clientWidth,
        },
      } as OnMessagePayload,
      [drawCanvas, traceCanvas]
    );
  }, []);

  //TODO refactor this into a custom hook (useClearTracePath).
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
        parent.current!.clientWidth,
        parent.current!.clientHeight
      );
      traceRef?.clearRect(
        0,
        0,
        parent.current!.clientWidth,
        parent.current!.clientHeight
      );
      drawRef?.restore();
      traceRef?.restore();
    }
  }, [rerender]);

  const panRef = useRef<Vector2>({ x: 0, y: 0 });

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
    panRef
  );

  const traceCanvasRef = useRef<HTMLCanvasElement | null>(null);
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
