import { InstantDrawerWorkerMessageHandler } from "./InstantDrawerWorkerMessageHandler";

const handler = new InstantDrawerWorkerMessageHandler();
onmessage = ({ data }) =>
  handler.handleOnMessage({
    data,
  });
