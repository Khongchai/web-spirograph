import {
  InitializeDrawerPayload,
  InstantDrawerWorkerOperations,
  InstantDrawerWorkerPayload,
  SetParametersPayload,
} from "./instantDrawerWorkerPayloads";

export interface DrawerArguments {
  cycloids: {
    isOutsideOfParent: boolean;
    radius: number;
    /**
     * The arc direction around the parent cycloid
     */
    isClockwise: boolean;
    /**
     * The rotation ratio between this cycloid and its parent.
     *
     * To move without sliding, the ratio should be r1 * theta / r2
     */
    thetaScale: number;
  }[];
  theta: number;
  rodLength: number;

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

      break;
    }
  }
};
