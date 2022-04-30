import { useContext, useEffect, useRef } from "react";
import { OnMessageOperationPayload } from "../../canvasWorker/models/onMessageInitialPayloads";
import { Rerender } from "../../contexts/rerenderToggle";
import { CanvasWorker } from "../../contexts/worker";
import { Vector2 } from "../../types/vector2";

export default function useTraceCycloidPath(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  /*
    Points to be traced on the canvas.

    This hook is not aware of any cycloid bodies outside, only what it should be tracing.
  */
  pointsToTrace: React.MutableRefObject<Vector2[]>
) {
  const rerender = useContext(Rerender);
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

  const worker = useContext(CanvasWorker);

  useEffect(() => {
    if (!worker) return;
    if (canvasRef.current) {
      worker.postMessage({
        traceCycloid: {
          lastPoints,
          notFirstTime,
        },
      } as OnMessageOperationPayload);
    }
  }, [worker]);
}
