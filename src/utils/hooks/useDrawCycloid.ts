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
  parent: MutableRefObject<HTMLElement>
) {
  useEffect(() => {
    let outerMostBoundingCircle = new BoundingCircle(
      {
        x: parent.current.clientWidth / 2,
        y: window.innerHeight / 2,
      },
      300
    );

    let cycloid1 = new Cycloid(
      cycloidControls.current.cycloids[0].cycloidRadius,
      cycloidControls.current.cycloids[0].rotationDirection,
      outerMostBoundingCircle,
      false
    );

    const {
      rodLengthScale,
      cycloidRadius,
      rotationDirection: cycloidDirection,
      animationSpeedScale: rodRotationRatio,
    } = cycloidControls.current.cycloids[0];
    cycloid1.rod.scaleLength(rodLengthScale);
    cycloid1.setRadius(cycloidRadius);
    cycloid1.setRotationDirection(cycloidDirection);
    cycloid1.setRodRotationSpeedRatio(rodRotationRatio);

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
        ctx.lineWidth = 1;

        ctx.fillStyle = "rgba(43, 30, 57, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        dx += cycloidControls.current.animationSpeed;

        cycloid1.setDx(dx);
        cycloid1.move();

        //visual
        if (cycloidControls.current.scaffold === "Showing") {
          cycloid1.showBounding(ctx);
          cycloid1.showRod(ctx);
          cycloid1.showPoint(ctx);

          outerMostBoundingCircle.showBounding(ctx);
        }

        const pointPos = cycloid1.getDrawPoint();
        pointToTrace.current.x = pointPos.x;
        pointToTrace.current.y = pointPos.y;

        requestAnimationFrame(draw);
      };

      draw();
    }
  }, [clearCanvasToggle]);
}
