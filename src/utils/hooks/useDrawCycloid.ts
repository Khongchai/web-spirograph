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

  let cycloid = useMemo(() => {
    let currentCycloidIndex = cycloidControls.current.currentCycloid;
    let cycloid = new Cycloid(
      cycloidControls.current.cycloids[currentCycloidIndex].cycloidRadius,
      cycloidControls.current.cycloids[currentCycloidIndex].rotationDirection,
      outerMostBoundingCircle,
      false
    );

    return cycloid;
  }, []);

  useEffect(() => {
    const {
      rodLengthScale,
      cycloidRadius,
      rotationDirection: cycloidDirection,
      animationSpeedScale: rodRotationRatio,
      moveOutSideOfParent,
    } = cycloidControls.current.cycloids[
      cycloidControls.current.currentCycloid
    ];

    cycloid.rod.scaleLength(rodLengthScale);
    cycloid.setRadius(cycloidRadius);
    cycloid.setRotationDirection(cycloidDirection);
    cycloid.setRodRotationSpeedRatio(rodRotationRatio);
    cycloid.setIsOutsideOfParent(moveOutSideOfParent);

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

      //TODO do we do this?
      setCanvasSize(canvas, () => {
        // cycloid1.setCenterPoint({
        //   x: outerMostBoundingCircle.getX(),
        //   y: outerMostBoundingCircle.getY(),
        // });
      });

      const draw = () => {
        ctx.save();

        ctx.translate(panRef.current.x, panRef.current.y);
        ctx.lineWidth = 1;

        ctx.fillStyle = "rgba(43, 30, 57, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        dx += cycloidControls.current.animationSpeed;

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

        ctx.restore();
        requestAnimationFrame(draw);
      };

      draw();
    }
  }, []);
}
