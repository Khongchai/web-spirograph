import React from "react";
import CycloidControls from "../../../../classes/domain/cycloidControls";

export default function getDrawLevel(
  currentId: number,
  cycloidControls: React.MutableRefObject<CycloidControls>,
  idAndLevelCache: Record<number, number>
) {
  const parentId =
    cycloidControls.current.cycloidManager.getSingleCycloidParamFromId(
      currentId
    )!.boundingCircleId;

  const currentDrawLevel = getCurrentDrawLevel(parentId, cycloidControls, 1, currentId, idAndLevelCache);

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
  levelCounter: number,
  currentId: number,
  cache: Record<number, number>
): number {
  if (cache[parentId]) {
    return levelCounter + cache[parentId];
  }

  if (levelCounter < 1) {
    throw new Error("levelCounter starts from 1");
  }

  if (parentId === -1) {
    cache[currentId] = levelCounter;
    console.log(cache);
    return levelCounter;
  }

  let parentParams =
    cycloidControls.current.cycloidManager.getSingleCycloidParamFromId(
      parentId
    );

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
    levelCounter + 1,
    currentId,
    cache
  );
}
