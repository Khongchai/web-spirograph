import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Vector2 } from "../../classes/vector2";
import Worker from "worker-loader!../../Workers/InstantDrawer/instantDrawer.worker";
import InstantDrawerWorkerResponsePayload, {
  InstantDrawerWorkerResponseOperation,
} from "../../Workers/InstantDrawer/responsePayload";

/**
 * Instant drawing will be done in another thread due for loop's blocking nature.
 *
 * The user should still be able to interact with the settings UI while the instant drawer is calculating the points.
 */
export default function useSetupInstantCycloidDrawer({
  dependencyList,
}: {
  dependencyList: any[];
}) {
  const [worker, setWorker] = useState<Worker | null>(null);
  const pointsRef = useRef<Vector2[]>([]);

  useEffect(() => {
    setWorker(() => {
      const worker = new Worker();

      worker.onmessage = ({
        data,
      }: {
        data: InstantDrawerWorkerResponsePayload;
      }) => {
        if (
          data.operation == InstantDrawerWorkerResponseOperation.retrievePoints
        ) {
          pointsRef.current = data.RetrievePointsResponse!.points ?? [];
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
