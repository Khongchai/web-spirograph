import React, { MutableRefObject, useEffect } from "react";
import { Vector2 } from "../../types/vector2";

const mouseDownPos: Vector2 = { x: 0, y: 0 };
const canvasTranslatedPosition: Vector2 = { x: 0, y: 0 };
let mouseDown = false;

export default function useHandlePan(
  parentWrapper: MutableRefObject<HTMLElement | null>,
  panRef: MutableRefObject<Vector2 | null>,
  canvases: MutableRefObject<HTMLCanvasElement | null>[]
) {
  useEffect(() => {
    document.addEventListener(
      "mousemove",
      (e) => {
        if (!mouseDown) return;

        e.preventDefault();
        const newMousePos = getMousePositionMoved({ x: e.x, y: e.y });
        const newCanvasPos = getTranslatedCanvasPosition(newMousePos);
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
