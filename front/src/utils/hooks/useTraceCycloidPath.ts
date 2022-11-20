import { useContext, useEffect, useRef } from "react";
import colors from "../../constants/colors";
import { Rerender } from "../../contexts/rerenderToggle";
import CycloidControlsData from "../../classes/domain/cycloidControls";
import { Vector2 } from "../../classes/DTOInterfaces/vector2";
import { CanvasSizeManagers } from "../CanvasManagers/CanvasSizeManager";

export default function useTraceCycloidPath(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  /*
    Points to be traced on the canvas.

    This hook is not aware of any cycloid bodies outside, only what it should be tracing.
  */
  pointsToTrace: React.MutableRefObject<Vector2[]>,
  panRef: React.MutableRefObject<Vector2>,

  // Currently using this just for the trace bool.
  cycloidControls: React.MutableRefObject<CycloidControlsData>
) {
  const rerender = useContext(Rerender);
  const currentPoints = pointsToTrace;
  const lastPoints: Vector2[] = [...pointsToTrace.current];

  /*
    When is the first time, the path will not be traced on that frame. This prevents
    line jumps when there are huge gaps in the current initial value and the immediate subsequent value.
  */
  const notFirstTime = useRef<boolean[]>([]);

  useEffect(() => {
    notFirstTime.current = [];
  }, [rerender]);

  window.onresize = () => (notFirstTime.current = []);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;

      CanvasSizeManagers.mainThread.addOnEventCallback({
        call: "onceAndOnEvent",
        eventCallback: () => {
          const transform = ctx.getTransform();
          const parent = canvas.parentElement;
          const parentWidth = parent!.clientWidth;
          const parentHeight = parent!.clientHeight;
          canvas.width = parentWidth;
          canvas.height = parentHeight;
          ctx.setTransform(transform);
        },
      });

      const draw = () => {
        if (cycloidControls.current.programOnly.tracePath) {
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

          for (let i = 0; i < currentPoints.current.length; i++) {
            const { x: lx, y: ly } = lastPoints[i] || { x: 0, y: 0 };

            const { x: cx, y: cy } = currentPoints.current[i];

            if (notFirstTime.current[i]) {
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

              ctx.stroke();
            } else {
              notFirstTime.current[i] = true;
            }

            lastPoints[i] = { x: cx, y: cy };
          }

          ctx.restore();
        }
        requestAnimationFrame(draw);
      };

      draw();
    }
  }, []);
}
