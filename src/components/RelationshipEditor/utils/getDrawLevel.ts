import React from "react";
import CycloidControls from "../../../classes/CycloidControls";

export default function getDrawLevel(
  currentId: number,
  cycloidControls: React.MutableRefObject<CycloidControls>
) {
  const parentId =
    cycloidControls.current.getSingleCycloidParamFromId(
      currentId
    )!.boundingCircleId;

  const currentDrawLevel = getCurrentDrawLevel(parentId, cycloidControls, 1);

  return currentDrawLevel;
}

/**
 * To obtain the current level, we need to recursively go through each level of parent
 * until we reach the outerBoundingCircle -- boundingCircleIndex === -1;

 * Ex:
 * If the grandparent node is the bounding circle (-1),
 * the current level should be 2
 */
function getCurrentDrawLevel(
  parentId: number,
  cycloidControls: React.MutableRefObject<CycloidControls>,
  levelCounter: number
): number {
  if (levelCounter < 1) {
    throw new Error("levelCounter starts from 1");
  }

  if (parentId === -1) return levelCounter;

  let parentParams =
    cycloidControls.current.getSingleCycloidParamFromId(parentId);

  if (!parentParams) {
    throw new Error("Cannot find parent");
  }

  const grandParentIndex = parentParams!.boundingCircleId;

  if (parentId === grandParentIndex) {
    throw new Error("The parent of a cycloid can't be itself !");
  }

  return getCurrentDrawLevel(
    grandParentIndex,
    cycloidControls,
    levelCounter + 1
  );
}
