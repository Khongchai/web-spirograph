import React, { MutableRefObject, useEffect, useMemo, useRef } from "react";
import Cycloid from "./classes/Cycloid";
import setCanvasSize from "./setCanvasSize";
import CycloidParams from "../types/cycloidParams";
import { Vector2 } from "../types/vector2";

export default function useDrawCanvas(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  pointToTrace: React.MutableRefObject<Vector2>,
  cycloidParams: CycloidParams,
  clearCanvasToggle: boolean,
  showStructure: MutableRefObject<boolean>,
  /*
    How many nested cycloids to draw
  */
  nestedLeve = 1
) {
  const cycloid = useMemo(() => {
    return new Cycloid(
      cycloidParams.cycloidRadius,
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      cycloidParams.cycloidDirection,
      cycloidParams.boundingCircleRadius
    );
  }, []);

  useEffect(() => {
    const {
      rodLengthScale,
      boundingCircleRadius,
      cycloidRadius,
      cycloidDirection,
      cycloidSpeedRatio: rodRotationRatio,
    } = cycloidParams;
    cycloid.rod.scaleLength(rodLengthScale);
    cycloid.setRadius(cycloidRadius);
    cycloid.setRotationDirection(cycloidDirection);
    cycloid.setOuterCircleRadius(boundingCircleRadius);
    cycloid.setRodRotationSpeedRatio(rodRotationRatio);
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
        if (showStructure.current) {
          cycloid.showTheCircumferencePlease(ctx);
          cycloid.showRodPlease(ctx);
          cycloid.showBoundingCirclePlease(ctx);
          cycloid.showPointPlease(ctx);
        }

        const pointPos = cycloid.point;
        pointToTrace.current.x = pointPos.x;
        pointToTrace.current.y = pointPos.y;

        requestAnimationFrame(draw);
      };

      draw();
    }
  }, [canvasRef]);
}
