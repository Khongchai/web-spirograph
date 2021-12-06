import { MutableRefObject } from "react";
import { Vector2 } from "../types/vector2";
import { remap } from "./remap";

/*
    zooming and panning doesn't happen on everyframe, so putting it in a separate file makes sense
*/
let zoomLevel = 1;
let mouseDownCoord: Vector2 | null;
const mousePos: Vector2 = { x: 0, y: 0 };
export default function handleZoomAndDrag(
  canvases: MutableRefObject<HTMLCanvasElement | null>[]
) {
  document.addEventListener(
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
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.scale(zoomLevel, zoomLevel);

          const translateOriginX = canvas.width;
          const translateOriginY = canvas.height;
          const compensateX = canvas.width * zoomLevel;
          const compensateY = canvas.height * zoomLevel;
          const translateX = translateOriginX - compensateX;
          const translateY = translateOriginY - compensateY;
          const cursorOffsetX = remap(mousePos.x, 0, canvas.width, -20, 20);
          const cursorOffsetY = remap(mousePos.y, 0, canvas.width, -20, 20);
          console.log(cursorOffsetX, cursorOffsetY);
          ctx.translate(
            translateX / 2 - cursorOffsetX,
            translateY / 2 - cursorOffsetY
          );
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
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
    if (mouseDownCoord) {
      const offset = {
        x: mousePos.x - mouseDownCoord?.x,
        y: mousePos.y - mouseDownCoord?.y,
      };
      //TODO, move logic
    }
  });
}
