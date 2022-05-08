import React, {
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Rerender, RerenderToggle } from "../../../contexts/rerenderToggle";
import CycloidControlsData from "../../../classes/cycloidControls";
import { Vector2 } from "../../../classes/vector2";
import useDrawCycloid from "../../../utils/hooks/useDrawCycloid";
import useHandlePan from "../../../utils/hooks/useHandlePan";
import useHandleZoom from "../../../utils/hooks/useHandleZoom";
import useTraceCycloidPath from "../../../utils/hooks/useTraceCycloidPath";

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
  const [mode, setMode] = useState<"animate" | "instant">("animate");
  const [animateMode, setAnimateMode] = useState<"auto" | "dragAndDrop">(
    "auto"
  );

  const rerender = useContext(Rerender);

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

  return (
    <>
      {mode === "animate" ? (
        <canvas
          id="animation-draw-canvas"
          ref={drawCanvasRef}
          className="absolute"
        ></canvas>
      ) : null}
      <canvas
        id="animation-trace-canvas"
        ref={traceCanvasRef}
        className="absolute opacity-50"
      ></canvas>
    </>
  );
};

export default Canvas;
