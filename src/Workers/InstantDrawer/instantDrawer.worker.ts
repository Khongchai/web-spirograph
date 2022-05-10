import CycloidControls from "../../classes/cycloidControls";
import InstantDrawerWorkerRequestPayload, {
  InstantDrawerWorkerOperation,
} from "./requestPayload";
import generatePoints from "./utils/generatePoints";

let cycloidControls: CycloidControls | undefined;

onmessage = ({ data }: { data: InstantDrawerWorkerRequestPayload }) => {
  switch (data.operation) {
    case InstantDrawerWorkerOperation.setCycloidControls: {
      const payload = data.setCycloidControlsPayload!;

      cycloidControls = payload.cycloidControls;

      break;
    }
    case InstantDrawerWorkerOperation.setCycloidControlsProperties: {
      const properties =
        data.SetCycloidControlsPropertiesPayload!.cycloidControlsProperties;

      // No need to set properties that are null.
      Object.keys(properties).forEach((key) => {
        const property = (properties as any)[key];
        if (property) {
          //@ts-ignore
          cycloidControls[key] = properties[key];
        }
      });

      break;
    }
    case InstantDrawerWorkerOperation.generatePoints: {
      const payload = data.generatePointsPayload!;

      if (!cycloidControls) {
        throw new Error(
          "cycloidControls is not set. Call setCycloidControls before calling generatePoints."
        );
      }

      const generatedPoints = generatePoints({
        ...payload,
        cycloidControlsProperties: cycloidControls!,
      });

      postMessage(generatedPoints);
      break;
    }
  }
};
