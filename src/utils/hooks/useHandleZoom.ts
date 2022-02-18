import { log } from "console";
import { MutableRefObject, useEffect } from "react";
import { Vector2 } from "../../types/vector2";
/*
    zooming and panning doesn't happen on everyframe, so putting it in a separate file makes sense
*/
let zoomLevel = 1;
const mouseCurrentPos: Vector2 = { x: 0, y: 0 };
export default function useHandleZoom(
  canvases: MutableRefObject<HTMLCanvasElement | null>[],
  // Parent wrapper is solely for listening to events in lieu of document.addEventListener
  parentWrapper: MutableRefObject<HTMLElement | null>,
) {
  useEffect(() => {
    parentWrapper.current?.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const delta = Math.max(-1, Math.min(1, e.deltaY));
        if (delta === 1) {
          zoomLevel = Math.min(1.0, zoomLevel);
          zoomLevel -= 0.008;
        } else if (delta === -1) {
          zoomLevel = Math.max(1.0, zoomLevel);
          zoomLevel += 0.008;
        }

        for (let i = 0; i < canvases.length; i++) {
          if (canvases[i]?.current) {
            const canvas = canvases[i].current as HTMLCanvasElement;
            var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            ctx.restore();

            ctx.translate(mouseCurrentPos.x, mouseCurrentPos.y);
            ctx.scale(zoomLevel, zoomLevel);
            ctx.translate(-mouseCurrentPos.x, -mouseCurrentPos.y);
          }
        }
      },

      { passive: false }
    );
    parentWrapper.current?.addEventListener("mousemove", (e) => {
      mouseCurrentPos.x = e.clientX;
      mouseCurrentPos.y = e.clientY;
    });
  }, []);
}
