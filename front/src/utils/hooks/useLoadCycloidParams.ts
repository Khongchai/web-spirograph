import React, { useCallback, useContext, useEffect } from "react";
import BoundingCircle from "../../classes/BoundingCircle";
import Cycloid from "../../classes/Cycloid";
import CycloidControls from "../../classes/cycloidControls";
import { Rerender } from "../../contexts/rerenderToggle";

/**
 * After the cycloids are generated, load the params from cycloidParams object for each cycloid.
 *
 * This hook is also responsible for updating the generated cycloids when the clearCanvasToggle context is triggered.
 */

export default function useLoadCycloidParams(
  generatedCycloids: Cycloid[],
  outermostBoundingCircle: BoundingCircle,
  cycloidControls: React.MutableRefObject<CycloidControls>
) {
  const rerender = useContext(Rerender);
  /**
   *  Find out which of the generated cycloid to attach the currentCycloid to.
   *
   * This is where we manage the parent-child relationship for each of the cycloid.
   */
  const getParentCycloid = useCallback(
    (parentId: number, currentCycloidId: number, cycloids: Cycloid[]) => {
      const parentIsOuterCircle = parentId === -1;
      const parentIsItself = parentId === currentCycloidId;
      const parentDoesNotExist = parentId >= cycloids.length;

      if (parentIsItself) {
        throw new Error("The parent cannot be itself");
      }

      if (parentDoesNotExist) {
        throw new Error("The parent does not exist");
      }

      if (parentIsOuterCircle) {
        return outermostBoundingCircle;
      }

      if (parentIsOuterCircle) {
        return outermostBoundingCircle;
      } else {
        return Cycloid.getCycloidFromId(parentId);
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
        animationSpeedScale: localAnimationSpeedScale,
        moveOutSideOfParent,
        id,
        boundingCircleId,
      } = cycloidControls.current.cycloidManager.getSingleCycloidParamFromId(
        cycloid.getId().toString()
      )!;

      cycloid.rod.scaleLength(rodLengthScale);
      cycloid.setRadius(cycloidRadius);
      cycloid.setRotationDirection(cycloidDirection);
      cycloid.setRodRotatationSpeedScale(localAnimationSpeedScale);
      cycloid.setIsOutsideOfParent(moveOutSideOfParent);
      cycloid.setParent(
        getParentCycloid(boundingCircleId, id, generatedCycloids)
      );
    });
  }, [rerender]);
}
