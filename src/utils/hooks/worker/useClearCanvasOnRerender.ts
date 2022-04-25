import { useContext, useEffect } from "react";
import {
  OnMessagePayload,
  WorkerOperation,
} from "../../../canvasWorker/models/onMessagePayloads";
import CycloidControls from "../../../classes/CycloidControls";
import { Rerender } from "../../../contexts/rerenderToggle";
import { CanvasWorker } from "../../../contexts/worker";

export default function useClearCanvasOnRerender(
  cycloidControls: React.MutableRefObject<CycloidControls>
) {
  const rerender = useContext(Rerender);
  const worker = useContext(CanvasWorker);

  useEffect(() => {
    //TODO test whether it will still work when we don't use current
    if (cycloidControls.current.clearTracedPathOnParamsChange) {
      worker.postMessage({
        workerOperations: WorkerOperation.ResetCanvas,
      } as OnMessagePayload);
    }
  }, [rerender]);
}
