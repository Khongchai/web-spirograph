import { MutableRefObject, useMemo } from "react";
import BoundingCircle from "../../classes/BoundingCircle";
import Cycloid from "../../classes/Cycloid";
import CycloidControls from "../../types/cycloidControls";
import CycloidParams from "../../types/cycloidParams";
import GeneratedCycloidData from "../../types/generatedCycloidData";

/*
    This hook encapsulate the generation of cycloids from information within the controls.

    Cycloids' parents are also determined here.
*/
export default function useGenerateCycloids(
  cycloidControls: MutableRefObject<CycloidControls>
): GeneratedCycloidData {
  let outerMostBoundingCircle = cycloidControls.current.outerMostBoundingCircle;

  let cycloids = useMemo(() => {
    const cycloids = [];
    const cycloidParentIndices: number[] = [];
    const cycloidLength = cycloidControls.current.cycloids.length;

    // Get parent cycloid based on the current cycloid's parent index.
    const getParent = (
      parentIndex: number,
      currentCycloidIndex: number,
      cycloids: Cycloid[]
    ) => {
      const parentIsOuterCircle = parentIndex === -1;
      const parentIsItself = parentIndex === currentCycloidIndex;
      const parentDoesNotExist = parentIndex >= cycloids.length;
      const useOuterAsParent =
        parentIsOuterCircle || parentIsItself || parentDoesNotExist;

      if (useOuterAsParent) {
        return outerMostBoundingCircle;
      } else {
        return cycloids[parentIndex];
      }
    };

    for (let i = 0; i < cycloidLength; i++) {
      const cycloidParams = cycloidControls.current.cycloids;
      const parentIndex = cycloidParams[i].boundingCircleIndex;

      cycloidParentIndices.push(parentIndex);

      let cycloid = new Cycloid(
        cycloidParams[i].cycloidRadius,
        cycloidParams[i].rotationDirection,
        //Use this for now, will reassign later
        outerMostBoundingCircle,
        false
      );
      cycloids.push(cycloid);
    }

    for (let i = 0; i < cycloidLength; i++) {
      const parent = getParent(cycloidParentIndices[i], i, cycloids);
      cycloids[i].setParent(parent);
    }

    return cycloids;
  }, []);

  return {
    generatedCycloids: cycloids,
    outermostBoundingCircle: outerMostBoundingCircle,
  };
}
