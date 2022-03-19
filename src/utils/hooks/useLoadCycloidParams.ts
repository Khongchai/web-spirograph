import React, { useCallback, useEffect } from "react";
import BoundingCircle from "../../classes/BoundingCircle";
import Cycloid from "../../classes/Cycloid";
import CycloidControls from "../../classes/cycloidControls";
import CycloidParams from "../../classes/CycloidParams";

/*
    After the cycloids are generated, load the params from cycloidParams object for each cycloid
*/
export default function useLoadCycloidParams(
  generatedCycloids: Cycloid[],
  outermostBoundingCircle: BoundingCircle,
  cycloidControls: React.MutableRefObject<CycloidControls>,
  clearCanvasToggle: boolean
) {
  const getParent = useCallback(
    (parentId: number, currentCycloidId: number, cycloids: Cycloid[]) => {
      const parentIsOuterCircle = parentId === -1;
      const parentIsItself = parentId === currentCycloidId;
      const parentDoesNotExist = parentId >= cycloids.length;
      const useOuterAsParent =
        parentIsOuterCircle || parentIsItself || parentDoesNotExist;

      if (useOuterAsParent) {
        return outermostBoundingCircle;
      } else {
        return cycloids[parentId];
      }
    },
    []
  );

  useEffect(() => {
    generatedCycloids.forEach((cycloid) => {
      const {
        rodLengthScale,
        radius: cycloidRadius,
        rotationDirection: cycloidDirection,
        animationSpeedScale: rodRotationRatio,
        moveOutSideOfParent,
        id,
        boundingCircleId,
      } = cycloidControls.current.getSingleCycloidParamFromId(
        cycloid.getId().toString()
      )!;

      cycloid.rod.scaleLength(rodLengthScale);
      cycloid.setRadius(cycloidRadius);
      cycloid.setRotationDirection(cycloidDirection);
      cycloid.setRodRotationSpeedRatio(rodRotationRatio);
      cycloid.setIsOutsideOfParent(moveOutSideOfParent);
      cycloid.setParent(getParent(boundingCircleId, id, generatedCycloids));
    });
  }, [clearCanvasToggle]);
}
