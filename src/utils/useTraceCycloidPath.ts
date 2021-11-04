import { useEffect, useRef } from "react";
import setCanvasSize from "./setCanvasSize";
import { Vector2 } from "./types/vector2";

export default function useTraceCycloidPath(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  pointToTrace: React.MutableRefObject<Vector2>
) {
  const lastPoint = useRef<Vector2>({ x: 0, y: 0 });
  const currentPoint = pointToTrace;
  const firstTime = useRef(true);
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;

      setCanvasSize(canvas);

      const draw = () => {
        const { x: lx, y: ly } = lastPoint.current;
        const { x: cx, y: cy } = currentPoint.current;

        /*
          If difference is more than half the canvas, something probably happened
          and the path tracing jumped, not checking this will result in a straight line
        */
        const jump =
          Math.max(lx, cx) - Math.min(lx, cx) > canvas.width * 0.5 ||
          Math.max(ly, cy) - Math.min(ly, cy) > canvas.height * 0.5;
        if (!firstTime.current && !jump) {
          ctx.strokeStyle = "rgba(232,121,249,1)";
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(cx, cy);
          ctx.stroke();
        } else {
          firstTime.current = false;
        }

        lastPoint.current.x = cx;
        lastPoint.current.y = cy;

        requestAnimationFrame(draw);
      };

      draw();
    }
  }, []);
}
