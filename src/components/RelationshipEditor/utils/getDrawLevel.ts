import CycloidParams from "../../../classes/CycloidParams";

export default function getDrawLevel(
  currentIndex: number,
  cycloidParams: CycloidParams[]
) {
  const parentIndex = cycloidParams[currentIndex].boundingCircleIndex;

  const cycloidParamsCopy = [...cycloidParams];
  const currentDrawLevel = _getCurrentDrawLevel(
    parentIndex,
    cycloidParamsCopy,
    1
  );

  return currentDrawLevel;
}

/**
 * To obtain the current level, we need to recursively go through each level of parent
 * until we reach the outerBoundingCircle -- boundingCircleIndex === -1;

 * Ex:
 * If the grandparent node is the bounding circle (-1),
 * the current level should be 1
 */
function _getCurrentDrawLevel(
  parentIndex: number,
  cycloidParams: CycloidParams[],
  levelCounter: number
): number {
  if (levelCounter < 1) {
    throw new Error("levelCounter starts from 1");
  }

  if (parentIndex === -1) return levelCounter;

  // const parentParams = cycloidParams[parentIndex];

  let parentParams: CycloidParams | undefined;
  for (let i = 0, length = cycloidParams.length; i < length; i++) {
    if (cycloidParams[i].index === parentIndex) {
      parentParams = cycloidParams.splice(i, 1)[0];
      break;
    }
  }

  if (!parentParams) {
    throw new Error("Cannot find parent");
  }

  const grandParentIndex = parentParams!.boundingCircleIndex;

  if (parentIndex === grandParentIndex) {
    throw new Error("The parent of a cycloid can't be itself !");
  }

  return _getCurrentDrawLevel(
    grandParentIndex,
    cycloidParams,
    levelCounter + 1
  );
}
