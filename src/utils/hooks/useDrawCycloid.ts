import React, { MutableRefObject, useEffect } from "react";
import CycloidControls from "../../types/cycloidControls";
import { Vector2 } from "../../types/vector2";
import setCanvasSize from "../setCanvasSize";
import useGenerateCycloids from "./useGenerateCycloids";

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

  useEffect(() => {
    cycloids.forEach((cycloid, i) => {
      const {
        rodLengthScale,
        cycloidRadius,
        rotationDirection: cycloidDirection,
        animationSpeedScale: rodRotationRatio,
        moveOutSideOfParent,
      } = cycloidControls.current.cycloids[i];

      cycloid.rod.scaleLength(rodLengthScale);
      cycloid.setRadius(cycloidRadius);
      cycloid.setRotationDirection(cycloidDirection);
      cycloid.setRodRotationSpeedRatio(rodRotationRatio);
      cycloid.setIsOutsideOfParent(moveOutSideOfParent);

      pointsToTrace.current.push({
        x: 0,
        y: 0,
      });
    });

    outermostBoundingCircle.setCenterPoint({
      x: parent.current.clientWidth / 2,
      y: window.innerHeight / 2,
    });
    outermostBoundingCircle.setRadius(300);
  }, [clearCanvasToggle]);

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

        cycloids.forEach((cycloid, i) => {
          const drawCurrentCycloid =
            cycloidControls.current.showAllCycloids ||
            i == cycloidControls.current.currentCycloid;
          if (drawCurrentCycloid) {
            cycloid.setDx(dx);
            cycloid.move();

            //visual
            if (cycloidControls.current.scaffold === "Showing") {
              cycloid.showBounding(ctx);
              cycloid.showRod(ctx);
              cycloid.showPoint(ctx);

              outermostBoundingCircle.showBounding(ctx);
            }

            const pointPos = cycloid.getDrawPoint();
            pointsToTrace.current[i].x = pointPos.x;
            pointsToTrace.current[i].y = pointPos.y;
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
