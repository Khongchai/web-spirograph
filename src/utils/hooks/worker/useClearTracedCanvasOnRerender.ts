import { useContext, useEffect } from "react";
import {
  OnMessageOperationPayload,
  WorkerOperation,
} from "../../../canvasWorker/models/onMessageInitialPayloads";
import CycloidControls from "../../../classes/CycloidControls";
import { Rerender } from "../../../contexts/rerenderToggle";
import { CanvasWorker } from "../../../contexts/worker";

export default function useClearTracedCanvasOnRerender(
  cycloidControls: React.MutableRefObject<CycloidControls>
) {
  const rerender = useContext(Rerender);
  const worker = useContext(CanvasWorker);

  useEffect(() => {
    //TODO test whether it will still work when we don't use current
    if (cycloidControls.current.clearTracedPathOnParamsChange && worker) {
      worker.postMessage({
        workerOperations: WorkerOperation.ResetCanvas,
      } as OnMessageOperationPayload);
    }
  }, [rerender, worker]);
}
