import React, { MutableRefObject, useContext, useEffect, useRef } from "react";
import CycloidControlsData from "../../../classes/domain/cycloidControls";
import { Vector2 } from "../../../classes/DTOInterfaces/vector2";
import { Rerender } from "../../../contexts/rerenderToggle";
import { CanvasPanManagers } from "../../../utils/CanvasManagers/CanvasPanManagers";
import { CanvasSizeManagers } from "../../../utils/CanvasManagers/CanvasSizeManager";
import { CanvasZoomManagers } from "../../../utils/CanvasManagers/CanvasZoomManagers";
import { CanvasTransformUtils } from "../../../utils/CanvasTransformsUtils";
import useDrawCycloid from "../../../utils/hooks/useDrawCycloid";
import useTraceCycloidPath from "../../../utils/hooks/useTraceCycloidPath";

interface CanvasProps {
  cycloidControls: MutableRefObject<CycloidControlsData>;
  parent: MutableRefObject<HTMLElement | null>;
  parentWrapper: MutableRefObject<HTMLElement | null>;
}

const AnimatedCanvas: React.FC<CanvasProps> = ({
  cycloidControls,
  parent,
  parentWrapper,
}) => {
  useEffect(() => {
    return () => {
      CanvasSizeManagers.mainThread.clearListener();
    };
  }, []);

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

  _useHandleZoom([drawCanvasRef, traceCanvasRef], parentWrapper);
  _useHandlePan(parentWrapper, panRef, [drawCanvasRef, traceCanvasRef]);

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
};

export default AnimatedCanvas;

function _useHandlePan(
  parentWrapper: MutableRefObject<HTMLElement | null>,
  panRef: MutableRefObject<Vector2 | null>,
  canvases: MutableRefObject<HTMLCanvasElement | null>[]
) {
  useEffect(() => {
    if (parentWrapper.current) {
      CanvasPanManagers.mainThread.addOnEventCallback({
        call: "onEvent",
        elementToAttachEventListener: parentWrapper!.current,
        eventCallback(panState) {
          panRef.current = panState.newCanvasPos;

          for (let i = 0; i < canvases.length; i++) {
            if (canvases[i]?.current) {
              const canvas = canvases[i].current as HTMLCanvasElement;
              var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
              ctx.save();
              ctx.setTransform(1, 0, 0, 1, 0, 0);
              ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
              ctx.restore();
            }
          }
        },
      });
    }

    return () => CanvasPanManagers.mainThread.clearListener();
  }, []);
}

function _useHandleZoom(
  canvases: MutableRefObject<HTMLCanvasElement | null>[],
  // Parent wrapper is solely for listening to events in lieu of document.addEventListener
  parentWrapper: MutableRefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!parentWrapper?.current) {
      return;
    }

    CanvasZoomManagers.mainThread.addOnEventCallback({
      call: "onEvent",
      elementToAttachEventListener: parentWrapper.current,
      eventCallback: function (zoomData) {
        const { mouseCurrentPos, zoomLevel } = zoomData;
        for (let i = 0; i < canvases.length; i++) {
          if (canvases[i]?.current) {
            const canvas = canvases[i].current as HTMLCanvasElement;
            var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
            CanvasTransformUtils.clear(
              ctx,
              window.innerWidth,
              window.innerHeight
            );

            CanvasTransformUtils.zoom(ctx, mouseCurrentPos, zoomLevel);
          }
        }
      },
    });
  }, []);
}
