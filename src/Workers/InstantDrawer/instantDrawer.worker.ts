import CycloidControls from "../../classes/cycloidControls";
import InstantDrawerWorkerRequestPayload from "./requestPayload";

onmessage = ({ data }: { data: InstantDrawerWorkerRequestPayload }) => {
  console.log(data);
};
