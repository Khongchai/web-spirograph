import {
  InitializeDrawerPayload,
  InstantDrawerWorkerOperations,
  InstantDrawerWorkerPayload,
  SetParametersPayload,
} from "./instantDrawerWorkerPayloads";
import InstantDrawCycloid from "./models/Cycloid";

export interface DrawerArguments {
  cycloids: InstantDrawCycloid[];
  theta: number;

  /**
   * Number of points to draw.
   *
   * More points = more processing time.
   */
  pointsAmount: number;
}

let drawerArguments: DrawerArguments;

onmessage = ({ data }: { data: InstantDrawerWorkerPayload }) => {
  switch (data.operation) {
    case InstantDrawerWorkerOperations.setParameters: {
      if (!drawerArguments) {
        throw new Error("Call initializeDrawer first");
      }

      const params = data.setParametersPayload as SetParametersPayload;

      // computedEpitrochoid();
      break;
    }

    // 1. assign values to params
    // 2. begin canvas
    case InstantDrawerWorkerOperations.initializeDrawer: {
      const params = data.initializeDrawerPayload as InitializeDrawerPayload;
      console.log(params);

      break;
    }
  }
};
