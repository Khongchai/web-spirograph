import { MutableRefObject } from "react";
import { Vector2 } from "../types/vector2";

/*
    zooming and panning doesn't happen on everyframe, so putting it in a separate file makes sense
*/
let zoomLevel = 1;
let mouseDownCoord: Vector2 | null;
export default function handleZoomAndDrag(
  canvases: MutableRefObject<HTMLCanvasElement | null>[]
) {
  document.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const delta = Math.max(-1, Math.min(1, e.deltaY));
      if (delta === 1) {
        zoomLevel -= 0.001;
      } else if (delta === -1) {
        zoomLevel += 0.001;
      }

      for (let i = 0; i < canvases.length; i++) {
        if (canvases[i]?.current) {
          const canvas = canvases[i].current as HTMLCanvasElement;
          var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.scale(zoomLevel, zoomLevel);
        }
      }
    },

    { passive: false }
  );

  document.addEventListener(
    "mousedown",
    (e) => (mouseDownCoord = { x: e.clientX, y: e.clientY })
  );
  document.addEventListener("mouseup", () => (mouseDownCoord = null));
  document.addEventListener("mousemove", (e) => {
    if (mouseDownCoord) {
      const offset = {
        x: e.clientX - mouseDownCoord?.x,
        y: e.clientY - mouseDownCoord?.y,
      };
      //TODO, move logic
    }
  });
}
