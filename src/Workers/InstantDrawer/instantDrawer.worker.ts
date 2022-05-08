import CycloidControls from "../../classes/cycloidControls";
import InstantDrawerWorkerRequestPayload from "./requestPayload";

export {};

onmessage = ({ data }: { data: InstantDrawerWorkerRequestPayload }) => {
  console.log(data);
};
