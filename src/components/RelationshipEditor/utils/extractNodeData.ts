import BoundingCircle from "../../../classes/BoundingCircle";
import CycloidParams from "../../../types/cycloidParams";
import scaleDrawRadius from "./scaleDrawRadius";

export default function extractNodeData(
  currentIndex: number,
  cycloidParams: CycloidParams[],
  outermostBoundingCircle: BoundingCircle
) {
  const parentIndex = cycloidParams[currentIndex].boundingCircleIndex;
  const parentIsBounding = parentIndex === -1;

  const currentDrawLevel = getCurrentDrawLevel(parentIndex, cycloidParams, 1);

  const parentRadius = scaleDrawRadius(
    parentIsBounding
      ? outermostBoundingCircle.getRadius()
      : cycloidParams[parentIndex].radius
  );
  const thisRadius = scaleDrawRadius(cycloidParams[currentIndex].radius);

  return {
    currentDrawLevel,
    parentRadius,
    thisRadius,
  };
}

/**
 * To obtain the current level, we need to recursively go through each level of parent
 * until we reach the outerBoundingCircle -- boundingCircleIndex === -1;

 * If the grandparent node is the bounding circle (-1),
 * the current level should be 1
 */
function getCurrentDrawLevel(
  parentIndex: number,
  cycloidParams: CycloidParams[],
  levelCounter: number
): number {
  if (levelCounter < 1) {
    throw new Error("levelCounter starts from 1");
  }

  if (parentIndex === -1) return levelCounter;

  const parentParams = cycloidParams[parentIndex];
  const grandParentIndex = parentParams.boundingCircleIndex;

  return getCurrentDrawLevel(grandParentIndex, cycloidParams, levelCounter + 1);
}
