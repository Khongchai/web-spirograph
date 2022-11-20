import React, { MutableRefObject, useEffect, useRef } from "react";
import CycloidControlsData from "../../classes/domain/cycloidControls";
import { Vector2 } from "../../classes/DTOInterfaces/vector2";
import { CanvasSizeManagers } from "../CanvasManagers/CanvasSizeManager";
import useGenerateCycloids from "./useGenerateCycloids";
import useLoadCycloidParams from "./useLoadCycloidParams";
import useSetOutermostBoundingCirclePosition from "./useSetOutermostBoundingCirclePosition";
import Cycloid from "../../classes/domain/Cycloid";

export default function useDrawCanvas(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  pointsToTrace: React.MutableRefObject<Vector2[]>,
  cycloidControls: MutableRefObject<CycloidControlsData>,
  parent: MutableRefObject<HTMLElement>,
  panRef: MutableRefObject<Vector2>
) {
  let { generatedCycloids: cycloids, outermostBoundingCircle } =
    useGenerateCycloids(cycloidControls);

  useLoadCycloidParams(cycloids, outermostBoundingCircle, cycloidControls);

  useSetOutermostBoundingCirclePosition(
    outermostBoundingCircle,
    parent,
    outermostBoundingCircle.radius
  );

  const cycloidsRefForCanvas = useRef<Cycloid[] | null>();
  useEffect(() => {
    cycloidsRefForCanvas.current = cycloids;
  }, [cycloids]);

  useEffect(() => {
    if (canvasRef.current && parent.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;

      let time = 0;

      CanvasSizeManagers.mainThread.addOnEventCallback({
        eventCallback: () => {
          const transform = ctx.getTransform();
          const parent = canvas.parentElement;
          const parentWidth = parent!.clientWidth;
          const parentHeight = parent!.clientHeight;
          canvas.width = parentWidth;
          canvas.height = parentHeight;
          ctx.setTransform(transform);
        },
        call: "onceAndOnEvent",
      });

      const draw = () => {
        const curControls = cycloidControls.current;

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        ctx.save();

        const previousTransform = ctx.getTransform();
        ctx.setTransform(
          previousTransform.a,
          0,
          0,
          previousTransform.d,
          panRef.current.x + previousTransform.e,
          panRef.current.y + previousTransform.f
        );

        ctx.lineWidth = 1.5;

        time += curControls.globalTimeStepScale;

        pointsToTrace.current = [];

        cycloidsRefForCanvas.current?.forEach((cycloid) => {
          const drawCurrentCycloid =
            curControls.showAllCycloids ||
            cycloid.getId() == curControls.currentCycloidId;

          // Keep updating the position even if the cycloid is not being drawn
          // This allows the child cycloids to be drawn in the correct position
          cycloid.setDx(time);
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

            if (
              curControls.traceAllCycloids ||
              cycloid.getId() == curControls.currentCycloidId
            ) {
              const pointPos = cycloid.getDrawPoint();
              pointsToTrace.current.push({ x: pointPos.x, y: pointPos.y });
            }
          }
        });

        ctx.restore();
        requestAnimationFrame(draw);
      };

      draw();
    }
  }, []);
}
