import CycloidControls from "../../classes/cycloidControls";
import { InstantDrawerWorkerPayload } from "./instantDrawerWorkerPayloads";

let cycloidControls: CycloidControls | undefined;

onmessage = ({ data }: { data: InstantDrawerWorkerPayload }) => {
  switch (data.operation) {
  }
};
