import { MutableRefObject, useEffect, useRef, useState } from "react";
//@ts-ignore
import InstantDrawerWorker from "worker-loader?filename=instantdrawer!../../Workers/InstantDrawer/instantDrawer.worker";
import CycloidControls from "../../classes/cycloidControls";
import { Vector2 } from "../../classes/vector2";
import InstantDrawerWorkerRequestPayload, {
  InstantDrawerWorkerOperation,
  SetCycloidControlsPayload,
} from "../../Workers/InstantDrawer/models/requestPayload";
import InstantDrawerWorkerResponsePayload, {
  InstantDrawerWorkerResponseOperation,
} from "../../Workers/InstantDrawer/models/responsePayload";

/**
 * Instant drawing will be done in another thread due for loop's blocking nature.
 *
 * The user should still be able to interact with the settings UI while the instant drawer is calculating the points.
 */
export default function useSetupInstantCycloidDrawer({
  cycloidControls,
  dependencyList,
}: {
  cycloidControls: MutableRefObject<CycloidControls>;
  dependencyList: any[];
}) {
  const [worker, setWorker] = useState<Worker | null>(null);
  const pointsRef = useRef<Vector2[]>([]);

  useEffect(() => {
    setWorker(() => {
      const worker: Worker = new InstantDrawerWorker();

      const setupPayload: SetCycloidControlsPayload = {
        cycloidControls: cycloidControls.current,
      };
      worker.postMessage({
        setCycloidControlsPayload: setupPayload,
        operation: InstantDrawerWorkerOperation.setCycloidControls,
      } as InstantDrawerWorkerRequestPayload);

      worker.onmessage = ({
        data,
      }: {
        data: InstantDrawerWorkerResponsePayload;
      }) => {
        if (
          data.operation == InstantDrawerWorkerResponseOperation.generatePoints
        ) {
          pointsRef.current = data.generatePointsResponse!.points ?? [];
        }
      };

      return worker;
    });
  }, dependencyList);

  return {
    worker,
    pointsRef,
  };
}
