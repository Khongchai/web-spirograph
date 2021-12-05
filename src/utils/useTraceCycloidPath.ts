import { useEffect, useRef, useState } from "react";
import colors from "../constants/colors";
import setCanvasSize from "./setCanvasSize";
import { Vector2 } from "../types/vector2";

export default function useTraceCycloidPath(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  pointToTrace: React.MutableRefObject<Vector2>,
  clearCanvasToggle: boolean,
  //TODO => temporary
  pointToTrace2: React.MutableRefObject<Vector2>
) {
  const lastPoint: Vector2 = { x: 0, y: 0 };
  const currentPoint = pointToTrace;
  const firstTimeRef = useRef(true);

  //TODO => temp
  const lastPoint2: Vector2 = { x: 0, y: 0 };
  const currentPoint2 = pointToTrace;
  const firstTimeRef2 = useRef(true);

  useEffect(() => {
    firstTimeRef.current = true;
  }, [clearCanvasToggle]);

  window.onresize = () => (firstTimeRef.current = true);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;

      setCanvasSize(canvas);

      const draw = () => {
        const { x: lx, y: ly } = lastPoint;
        const { x: cx, y: cy } = currentPoint.current;

        //TODO => temporary
        const { x: lx2, y: ly2 } = lastPoint2;
        const { x: cx2, y: cy2 } = pointToTrace2.current;

        if (!firstTimeRef.current) {
          ctx.strokeStyle = "#E2C6FF";
          ctx.shadowColor = colors.purple.vivid;
          ctx.shadowBlur = 10;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(cx, cy);
          ctx.stroke();
          ctx.closePath();

          ctx.beginPath();
          ctx.moveTo(lx2, ly2);
          ctx.lineTo(cx2, cy2);
          ctx.stroke();
        } else {
          firstTimeRef.current = false;
          firstTimeRef2.current = false;
        }

        lastPoint.x = cx;
        lastPoint.y = cy;
        lastPoint2.x = cx2;
        lastPoint2.y = cy2;

        requestAnimationFrame(draw);
      };

      draw();
    }
  }, []);
}

/*
  Random shit from GH copilot
*/
//A function that generates a spirograph path
//The path is generated by tracing a cycloid  (https://en.wikipedia.org/wiki/Cycloid)
//The cycloid is generated by the following formula:
//x(t) = a * cos(t) + b * cos(t/n)
//y(t) = a * sin(t) - b * sin(t/n)
//where a and b are the radius of the two circles, n is the ratio of the two circles, and t is the angle
//The function returns an array of points that represent the path
//The function takes in the following parameters:
//a: the radius of the outer circle
//b: the radius of the inner circle
//n: the ratio of the two circles
//t: the angle
//numPoints: the number of points to generate
//The function returns an array of points that represent the path
//The function takes in the following parameters:
//a: the radius of the outer circle
//b: the radius of the inner circle
//n: the ratio of the two circles
//t: the angle
//numPoints: the number of points to generate
export function traceCycloidPath(
  a: number,
  b: number,
  n: number,
  t: number,
  numPoints: number
): Vector2[] {
  const points: Vector2[] = [];

  for (let i = 0; i < numPoints; i++) {
    const x = a * Math.cos(t) + b * Math.cos(t / n);
    const y = a * Math.sin(t) - b * Math.sin(t / n);

    points.push({ x, y });

    t += 0.1;
  }

  return points;
}
