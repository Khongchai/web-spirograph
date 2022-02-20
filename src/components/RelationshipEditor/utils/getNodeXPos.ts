import { DrawNode } from "../types";

// We snap the node to the grid based on the length of the member in each level.
export default function organizeNodesPositionOnLevel(
  levels: DrawNode[][],
  currentLevelIndex: number
) {
  const currentLevel = levels[currentLevelIndex];
  const currentLevelLength = currentLevel.length;

  // If there is only one node in the level, we don't need to snap to the grid.
  if (currentLevelLength === 1) {
    return currentLevel[0].pos;
  }

  currentLevel.forEach((node, i) => {
    const newX = currentLevel[i].pos.x;
    node.pos = {
      x: newX,
      y: currentLevel[i].pos.y,
    };
  });
}
