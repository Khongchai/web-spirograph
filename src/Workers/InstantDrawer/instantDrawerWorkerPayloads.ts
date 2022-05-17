export interface InstantDrawerWorkerPayload {
  operation: InstantDrawerWorkerOperations;
  setParametersPayload?: SetParametersPayload;
  tracePathPayload?: TracePathPayload;
}

enum InstantDrawerWorkerOperations {
  setParameters,
  tracePath,
}

interface SetParametersPayload {}

interface TracePathPayload {}
