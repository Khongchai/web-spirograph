import { useEffect, useRef, useState } from "react";
import colors from "../../constants/colors";
import setCanvasSize from "../setCanvasSize";
import { Vector2 } from "../../types/vector2";

export default function useTraceCycloidPath(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  pointToTrace: React.MutableRefObject<Vector2>,
  clearCanvasToggle: boolean,
  panRef: React.MutableRefObject<Vector2>
) {
  const lastPoint: Vector2 = { x: 0, y: 0 };
  const currentPoint = pointToTrace;
  const firstTimeRef = useRef(true);

  useEffect(() => {
    firstTimeRef.current = true;
  }, [clearCanvasToggle]);

  window.onresize = () => (firstTimeRef.current = true);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;

      setCanvasSize(canvas);

      const draw = () => {
        ctx.save();
        ctx.translate(panRef.current.x, panRef.current.y);

        const { x: lx, y: ly } = lastPoint;
        const { x: cx, y: cy } = currentPoint.current;

        if (!firstTimeRef.current) {
          ctx.strokeStyle = "#E2C6FF";
          ctx.shadowColor = colors.purple.vivid;
          ctx.shadowBlur = 10;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(cx, cy);
          ctx.stroke();
          ctx.closePath();

          ctx.beginPath();

          ctx.stroke();
        } else {
          firstTimeRef.current = false;
        }

        lastPoint.x = cx;
        lastPoint.y = cy;

        ctx.restore();
        requestAnimationFrame(draw);
      };

      draw();
    }
  }, []);
}
