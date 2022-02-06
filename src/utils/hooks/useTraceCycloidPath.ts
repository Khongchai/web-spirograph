import { useEffect, useRef } from "react";
import colors from "../../constants/colors";
import { Vector2 } from "../../types/vector2";
import setCanvasSize from "../setCanvasSize";

export default function useTraceCycloidPath(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  pointsToTrace: React.MutableRefObject<Vector2[]>,
  clearCanvasToggle: boolean,
  panRef: React.MutableRefObject<Vector2>
) {
  const currentPoints = pointsToTrace;
  const lastPoints: Vector2[] = [...pointsToTrace.current];
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

        for (let i = 0; i < currentPoints.current.length; i++) {
          const { x: lx, y: ly } = lastPoints[i] || { x: 0, y: 0 };

          const { x: cx, y: cy } = currentPoints.current[i];

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

          lastPoints[i] = { x: cx, y: cy };
        }

        ctx.restore();
        requestAnimationFrame(draw);
      };

      draw();
    }
  }, []);
}
