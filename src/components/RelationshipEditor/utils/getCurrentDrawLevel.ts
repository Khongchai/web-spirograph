import CycloidParams from "../../../types/cycloidParams";

export default function getCurrentDrawLevel(
  currentCycloidIndex: number,
  cycloidParams: CycloidParams[],
  levelCounter: number
): number {
  if (levelCounter < 1) {
    throw new Error("levelCounter starts from 1");
  }

  const currentCycloid = cycloidParams[currentCycloidIndex];
  const parentIndex = currentCycloid.boundingCircleIndex;

  if (parentIndex === -1) return levelCounter;

  return getCurrentDrawLevel(parentIndex, cycloidParams, levelCounter + 1);
}
