import React, { useEffect, useMemo, useRef } from "react";
import Cycloid from "./classes/Cycloid";
import setCanvasSize from "./setCanvasSize";
import CycloidParams from "./types/cycloidParams";
import { Vector2 } from "./types/vector2";

export default function useDrawCanvas(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  pointToTrace: React.MutableRefObject<Vector2>,
  cycloidParams = {
    animationSpeed: 0.7,
    rodLengthScale: 1,
    cycloidPosition: "inside",
  } as CycloidParams,
  clearCanvasToggle: boolean
) {
  const cycloid = useMemo(() => {
    return new Cycloid(
      100,
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      cycloidParams.cycloidPosition
    );
  }, []);

  useEffect(() => {
    cycloid.rod.scaleLength(cycloidParams.rodLengthScale);
    cycloid.setCycloidPosition(cycloidParams.cycloidPosition);
  }, [clearCanvasToggle]);

  useEffect(() => {
    cycloid.setOuterCircleRadius(300);

    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;

      let dx = 0;

      setCanvasSize(canvas, () => {
        cycloid.setBoundary({
          x: canvas.clientWidth,
          y: canvas.clientHeight,
        });
      });

      const draw = () => {
        ctx.lineWidth = 1;
        // ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        ctx.fillStyle = "rgba(43, 30, 57, 0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        dx += cycloidParams.animationSpeed;

        cycloid.setDx(dx);
        cycloid.move();

        //visual
        cycloid.showTheCircumferencePlease(ctx);
        cycloid.showRodPlease(ctx);
        cycloid.showBoundingCirclePlease(ctx);
        cycloid.showPointPlease(ctx);

        const pointPos = cycloid.point;
        pointToTrace.current.x = pointPos.x;
        pointToTrace.current.y = pointPos.y;

        requestAnimationFrame(draw);
      };

      draw();
    }
  }, [canvasRef]);
}
