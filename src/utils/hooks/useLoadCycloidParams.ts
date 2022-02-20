import { useEffect } from "react";
import BoundingCircle from "../../classes/BoundingCircle";
import Cycloid from "../../classes/Cycloid";
import CycloidControlsData from "../../types/cycloidControls";
import CycloidParams from "../../types/cycloidParams";

/*
    After the cycloids are generated, load the params from cycloidParams object for each cycloid
*/
export default function useLoadCycloidParams(
  generatedCycloids: Cycloid[],
  outermostBoundingCircle: BoundingCircle,
  cycloidParams: CycloidParams[],
  clearCanvasToggle: boolean
) {
  useEffect(() => {
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
        return outermostBoundingCircle;
      } else {
        return cycloids[parentIndex];
      }
    };

    generatedCycloids.forEach((cycloid, i) => {
      const {
        rodLengthScale,
        radius: cycloidRadius,
        rotationDirection: cycloidDirection,
        animationSpeedScale: rodRotationRatio,
        moveOutSideOfParent,
      } = cycloidParams[i];

      cycloid.rod.scaleLength(rodLengthScale);
      cycloid.setRadius(cycloidRadius);
      cycloid.setRotationDirection(cycloidDirection);
      cycloid.setRodRotationSpeedRatio(rodRotationRatio);
      cycloid.setIsOutsideOfParent(moveOutSideOfParent);
      cycloid.setParent(
        getParent(cycloidParams[i].boundingCircleIndex, i, generatedCycloids)
      );
    });
  }, [clearCanvasToggle]);
}
