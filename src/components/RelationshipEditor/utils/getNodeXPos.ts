import { DrawNode } from "../types";

// We snap the node to the grid based on the length of the member in each level.
export default function organizeNodesPositionOnLevel(
  levels: DrawNode[][],

  /**
   * The index of the level to be organized.
   */
  currentLevelIndex: number
) {
  const currentLevel = levels[currentLevelIndex];
  const currentLevelLength = currentLevel.length;

  // If there is only one node in the level, we don't need to snap to the grid.
  if (currentLevelLength === 1) {
    return currentLevel[0].pos;
  }

  const gap = 100;
  currentLevel.forEach((node, i) => {
    const xPos = node.pos.x + gap * i;
    const xOffset = (gap / 2) * (currentLevelLength - 1);
    const finalX = xPos - xOffset;

    node.pos = {
      x: finalX,
      y: currentLevel[i].pos.y,
    };
  });
}
