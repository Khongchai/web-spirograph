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
  pointToTrace2: React.MutableRefObject<Vector2>,
  cycloidParams: CycloidParams,
  clearCanvasToggle: boolean,
  showStructure: MutableRefObject<boolean>,
  /*
    How many nested cycloids to draw
  */
  nestedLevel = 1
) {
  const outerMostBoundingCircle = new BoundingCircle(
    window.innerWidth / 2,
    window.innerHeight / 2,
    300
  );

  const cycloid1 = useMemo(() => {
    return new Cycloid(
      cycloidParams.cycloidRadius,
      //beginning pos doesn't matter
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      cycloidParams.cycloidDirection,
      outerMostBoundingCircle.getRadius()
    );
  }, []);

  const cycloid2 = useMemo(() => {
    return new Cycloid(
      //temporary
      cycloidParams.cycloidRadius * 0.5,
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      cycloidParams.cycloidDirection,
      cycloid1.getRadius()
    );
  }, []);
  cycloid2.rod.scaleLength(2);

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

      setCanvasSize(canvas, () => {
        //Set center for the parent as well.
        cycloid1.setParentMiddle({
          x: outerMostBoundingCircle.getX(),
          y: outerMostBoundingCircle.getY(),
        });
        cycloid2.setParentMiddle({
          x: outerMostBoundingCircle.getX(),
          y: outerMostBoundingCircle.getY(),
        });
      });

      const draw = () => {
        ctx.lineWidth = 1;
        // ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        ctx.fillStyle = "rgba(43, 30, 57, 0.8)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        dx += cycloidParams.animationSpeed;

        cycloid1.setDx(dx);
        cycloid1.move();

        cycloid2.setDx(dx * 0.4);
        cycloid2.setParentMiddle(cycloid1.getCenter());
        cycloid2.move();

        //visual
        if (showStructure.current) {
          cycloid1.showTheCircumferencePlease(ctx);
          cycloid1.showRodPlease(ctx);
          cycloid1.showPointPlease(ctx);

          cycloid2.showTheCircumferencePlease(ctx);
          cycloid2.showRodPlease(ctx);
          cycloid2.showPointPlease(ctx);

          outerMostBoundingCircle.drawCircumference(ctx);
        }

        const pointPos = cycloid1.getDrawPoint();
        pointToTrace.current.x = pointPos.x;
        pointToTrace.current.y = pointPos.y;

        const pointPos2 = cycloid2.getDrawPoint();
        pointToTrace2.current.x = pointPos2.x;
        pointToTrace2.current.y = pointPos2.y;

        requestAnimationFrame(draw);
      };

      draw();
    }
  }, [canvasRef]);
}
