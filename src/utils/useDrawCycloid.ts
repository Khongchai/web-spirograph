import React, { MutableRefObject, useEffect, useMemo, useRef } from "react";
import Cycloid from "./classes/Cycloid";
import setCanvasSize from "./setCanvasSize";
import CycloidParams from "../types/cycloidParams";
import { Vector2 } from "../types/vector2";
import BoundingCircle from "./classes/OuterMostBoundingCircle";

export default function useDrawCanvas(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  /*
    TODO, refactor pointToTrace to a generator function that generates as many traces as needed
  */
  pointToTrace: React.MutableRefObject<Vector2>,
  cycloidParams: CycloidParams,
  clearCanvasToggle: boolean,
  showStructure: MutableRefObject<boolean>,
  /*
    How many nested cycloids to draw
  */
  nestedLevel = 1
) {
  const outerMostBoundingCircle = new BoundingCircle(
    { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    300
  );

  const cycloid1 = useMemo(() => {
    return new Cycloid(
      cycloidParams.cycloidRadius,
      cycloidParams.cycloidDirection,
      outerMostBoundingCircle,
      true
    );
  }, []);

  //TODO
  useEffect(() => {
    const {
      rodLengthScale,
      cycloidRadius,
      cycloidDirection,
      cycloidSpeedRatio: rodRotationRatio,
    } = cycloidParams;
    cycloid1.rod.scaleLength(rodLengthScale);
    cycloid1.setRadius(cycloidRadius);
    cycloid1.setRotationDirection(cycloidDirection);
    cycloid1.setRodRotationSpeedRatio(rodRotationRatio);
  }, [clearCanvasToggle]);

  useEffect(() => {
    if (canvasRef.current) {
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
        dx += cycloidParams.animationSpeed;

        cycloid1.setDx(dx);
        cycloid1.move();

        //visual
        if (showStructure.current) {
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
  }, [canvasRef]);
}
