import React, { MutableRefObject, useEffect, useMemo, useRef } from "react";
import Cycloid from "../../classes/Cycloid";
import setCanvasSize from "../setCanvasSize";
import CycloidParams from "../../types/cycloidParams";
import { Vector2 } from "../../types/vector2";
import BoundingCircle from "../../classes/BoundingCircle";
import CycloidControls from "../../types/cycloidControls";

export default function useDrawCanvas(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  pointToTrace: React.MutableRefObject<Vector2>,
  cycloidControls: MutableRefObject<CycloidControls>,
  clearCanvasToggle: boolean,
  parent: MutableRefObject<HTMLElement>,
  panRef: MutableRefObject<Vector2>
) {
  let outerMostBoundingCircle = useMemo(
    () =>
      new BoundingCircle(
        {
          x: 0,
          y: 0,
        },
        300
      ),
    []
  );

  let cycloids = useMemo(() => {
    let cycloids = [];
    for (let i = 0; i < cycloidControls.current.cycloids.length; i++) {
      let cycloid = new Cycloid(
        cycloidControls.current.cycloids[i].cycloidRadius,
        cycloidControls.current.cycloids[i].rotationDirection,
        outerMostBoundingCircle,
        false
      );
      cycloids.push(cycloid);
    }
    return cycloids;
  }, []);

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
    });

    outerMostBoundingCircle.setCenterPoint({
      x: parent.current.clientWidth / 2,
      y: window.innerHeight / 2,
    });
    outerMostBoundingCircle.setRadius(300);
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

              outerMostBoundingCircle.showBounding(ctx);
            }

            const pointPos = cycloid.getDrawPoint();
            pointToTrace.current.x = pointPos.x;
            pointToTrace.current.y = pointPos.y;
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
