import { MutableRefObject, useEffect } from "react";
import { Vector2 } from "../../types/vector2";

const mouseDownPos: Vector2 = { x: 0, y: 0 };
const canvasTranslatedPosition: Vector2 = { x: 0, y: 0 };
let mouseDown = false;

export default function useHandlePan(
  canvasParent: MutableRefObject<HTMLElement | null>,
  parentWrapper: MutableRefObject<HTMLElement | null>
) {
  useEffect(() => {
    document.addEventListener(
      "mousemove",
      (e) => {
        if (!mouseDown || !canvasParent) return;

        e.preventDefault();
        const canvas = canvasParent.current as HTMLCanvasElement;
        const newMousePos = getMousePositionMoved({ x: e.x, y: e.y });
        const newCanvasPos = getTranslatedCanvasPosition(newMousePos);
        canvas.style.transform = `translate(${newCanvasPos.x}px, ${newCanvasPos.y}px)`;
      },
      { passive: false }
    );
    parentWrapper.current?.addEventListener("mousedown", (e) => {
      mouseDownPos.x = e.clientX;
      mouseDownPos.y = e.clientY;
      mouseDown = true;
    });
    document.addEventListener("mouseup", (e) => {
      if (mouseDown) {
        const newMousePos = getMousePositionMoved({ x: e.x, y: e.y });
        const newCanvasPos = getTranslatedCanvasPosition(newMousePos);
        canvasTranslatedPosition.x = newCanvasPos.x;
        canvasTranslatedPosition.y = newCanvasPos.y;

        mouseDown = false;
      }
    });
  }, []);
}

function getMousePositionMoved(pos: Vector2): Vector2 {
  const mouseMovePos: Vector2 = {
    x: pos.x - mouseDownPos.x,
    y: pos.y - mouseDownPos.y,
  };
  const newPos: Vector2 = {
    x: mouseMovePos.x,
    y: mouseMovePos.y,
  };
  return newPos;
}

function getTranslatedCanvasPosition(pos: Vector2): Vector2 {
  const newPos: Vector2 = {
    x: canvasTranslatedPosition.x + pos.x,
    y: canvasTranslatedPosition.y + pos.y,
  };
  return newPos;
}
