import { MutableRefObject, useEffect } from "react";
import { Vector2 } from "../../classes/DTOInterfaces/vector2";
import { CanvasPanManagers } from "../CanvasManagers/CanvasPanManagers";

// TODO bad name, this doesn't really say whether it's for the main thread or the worker thread.
export default function useHandlePan(
  parentWrapper: MutableRefObject<HTMLElement | null>,
  panRef: MutableRefObject<Vector2 | null>,
  canvases: MutableRefObject<HTMLCanvasElement | null>[]
) {
  useEffect(() => {
    // For the Draw Canvas
    if (parentWrapper.current) {
      CanvasPanManagers.mainThread.addOnEventCallback({
        call: "onEvent",
        elementToAttachEventListener: parentWrapper!.current,
        eventCallback(newCanvasPos) {
          panRef.current = newCanvasPos;

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
  }, []);
}
