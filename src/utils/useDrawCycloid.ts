import React, { useEffect, useRef } from "react";
import Cycloid from "./classes/Cycloid";
import setCanvasSize from "./setCanvasSize";
import { Vector2 } from "./types/vector2";
export default function useDrawCanvas(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  pointToTrace: React.MutableRefObject<Vector2>
) {
  const cycloidRef = useRef(
    new Cycloid(100, { x: 0, y: 0 }, { x: 0, y: 0 }, "inside")
  );
  cycloidRef.current.setOuterCircleRadius(300);
  cycloidRef.current.scaleRodLength(1);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;

      let dx = 0;

      setCanvasSize(canvas, () => {
        cycloidRef.current.setBoundary({
          x: canvas.clientWidth,
          y: canvas.clientHeight,
        });
      });

      const draw = () => {
        ctx.lineWidth = 1;
        // ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        ctx.fillStyle = "rgba(43, 30, 57, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        dx = dx + 0.7;

        cycloidRef.current.setDx(dx);
        cycloidRef.current.move();

        //visual
        cycloidRef.current.showTheCircumferencePlease(ctx);
        cycloidRef.current.showRodPlease(ctx);
        // cycloidRef.current.showBoundingCircle(ctx);

        const point: Vector2 = { ...cycloidRef.current.getPoint() };
        pointToTrace.current.x = point.x;
        pointToTrace.current.y = point.y;

        ctx.fillStyle = "rgba(232,121,249,1)";
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fill();

        requestAnimationFrame(draw);
      };

      draw();
    }
  }, [canvasRef]);
}
