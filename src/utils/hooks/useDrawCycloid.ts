import React, { MutableRefObject, useContext, useEffect } from "react";
import { Rerender } from "../../contexts/rerenderToggle";
import CycloidControlsData from "../../classes/CycloidControls";
import { Vector2 } from "../../types/vector2";
import setCanvasSize from "../setCanvasSize";
import useGenerateCycloids from "./useGenerateCycloids";
import useLoadCycloidParams from "./useLoadCycloidParams";
import useSetOutermostBoundingCirclePosition from "./useSetOutermostBoundingCirclePosition";

export default function useDrawCanvas(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  pointsToTrace: React.MutableRefObject<Vector2[]>,
  cycloidControls: MutableRefObject<CycloidControlsData>,
  parent: MutableRefObject<HTMLElement>,
  panRef: MutableRefObject<Vector2>
) {
  const rerender = useContext(Rerender);
  let { generatedCycloids: cycloids, outermostBoundingCircle } =
    useGenerateCycloids(cycloidControls);

  useLoadCycloidParams(
    cycloids,
    outermostBoundingCircle,
    cycloidControls,
    rerender
  );

  useSetOutermostBoundingCirclePosition(outermostBoundingCircle, parent, 300);

  useEffect(() => {
    if (canvasRef.current && parent.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;

      let dx = 0;

      setCanvasSize(canvas);

      const draw = () => {
        const curControls = cycloidControls.current;

        ctx.save();

        ctx.translate(panRef.current.x, panRef.current.y);
        ctx.lineWidth = 1.5;

        dx += curControls.animationSpeed;

        pointsToTrace.current = [];

        cycloids.forEach((cycloid) => {
          const drawCurrentCycloid =
            curControls.showAllCycloids ||
            cycloid.getId() == curControls.currentCycloidId;

          // Keep updating the position even if the cycloid is not being drawn
          // This allows the child cycloids to be drawn in the correct position
          cycloid.setDx(dx);
          cycloid.move();

          if (drawCurrentCycloid) {
            //visual
            if (cycloidControls.current.scaffold === "Showing") {
              cycloid.showBounding(
                ctx,
                curControls.cycloidManager.getSingleCycloidParamFromId(
                  cycloid.getId()
                )?.boundingColor
              );
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
