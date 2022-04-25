import { MutableRefObject } from "react";
import CycloidControls from "../../classes/CycloidControls";
import colors from "../../constants/colors";
import { Vector2 } from "../../types/vector2";
import setCanvasSize from "./setCanvasSize";

interface args {
  canvasRef: MutableRefObject<HTMLCanvasElement>;
  drawContext: CanvasRenderingContext2D;
  width: number;
  height: number;
  cycloidControlsRef: MutableRefObject<CycloidControls>;
  panRef: MutableRefObject<Vector2>;
  pointsToTraceRef: MutableRefObject<Vector2[]>;
  lastPoints: Vector2[];
  notFirstTime: MutableRefObject<boolean[]>;
}

export default function traceCycloids({
  canvasRef,
  drawContext: ctx,
  width,
  height,
  cycloidControlsRef,
  panRef,
  pointsToTraceRef: currentPoints,
  lastPoints,
  notFirstTime,
}: args) {
  const canvas = canvasRef.current;

  setCanvasSize(canvas, width, height);

  const draw = () => {
    if (cycloidControlsRef.current.programOnly.tracePath) {
      ctx.save();
      ctx.translate(panRef.current.x, panRef.current.y);

      for (let i = 0; i < currentPoints.current.length; i++) {
        const { x: lx, y: ly } = lastPoints[i] || { x: 0, y: 0 };

        const { x: cx, y: cy } = currentPoints.current[i];

        if (notFirstTime.current[i]) {
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
          notFirstTime.current[i] = true;
        }

        lastPoints[i] = { x: cx, y: cy };
      }

      ctx.restore();
    }
    requestAnimationFrame(draw);
  };

  draw();
}
