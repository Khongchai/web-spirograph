import React, { MutableRefObject, useEffect } from "react";
import CycloidControls from "../../types/cycloidControls";
import { Vector2 } from "../../types/vector2";
import setCanvasSize from "../setCanvasSize";
import useGenerateCycloids from "./useGenerateCycloids";
import useLoadCycloidParams from "./useLoadCycloidParams";
import useSetOutermostBoundingCirclePosition from "./useSetOutermostBoundingCirclePosition";

export default function useDrawCanvas(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  pointsToTrace: React.MutableRefObject<Vector2[]>,
  cycloidControls: MutableRefObject<CycloidControls>,
  clearCanvasToggle: boolean,
  parent: MutableRefObject<HTMLElement>,
  panRef: MutableRefObject<Vector2>
) {
  let { generatedCycloids: cycloids, outermostBoundingCircle } =
    useGenerateCycloids(cycloidControls);

  useLoadCycloidParams(
    cycloids,
    outermostBoundingCircle,
    cycloidControls.current.cycloids,
    clearCanvasToggle
  );

  useSetOutermostBoundingCirclePosition(outermostBoundingCircle, parent, 300);

  useEffect(() => {
    if (canvasRef.current && parent.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;

      let dx = 0;

      setCanvasSize(canvas);

      const draw = () => {
        ctx.save();

        ctx.translate(panRef.current.x, panRef.current.y);
        ctx.lineWidth = 1;

        dx += cycloidControls.current.animationSpeed;

        pointsToTrace.current = [];

        cycloids.forEach((cycloid, i) => {
          const drawCurrentCycloid =
            cycloidControls.current.showAllCycloids ||
            i == cycloidControls.current.currentCycloid;

          // Keep updating the position even if the cycloid is not being drawn
          // This allows the child cycloids to be drawn in the correct position
          cycloid.setDx(dx);
          cycloid.move();

          if (drawCurrentCycloid) {
            //visual
            if (cycloidControls.current.scaffold === "Showing") {
              cycloid.showBounding(ctx);
              cycloid.showRod(ctx);
              cycloid.showPoint(ctx);

              // This one gets set multiple time but it's ok.
              outermostBoundingCircle.showBounding(ctx);
            }

            const pointPos = cycloid.getDrawPoint();
            pointsToTrace.current.push({ x: pointPos.x, y: pointPos.y });
          }
        });

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = "rgba(43, 30, 57, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.restore();
        requestAnimationFrame(draw);
      };

      draw();
    }
  }, []);
}
