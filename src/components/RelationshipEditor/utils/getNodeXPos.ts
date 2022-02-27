import { Vector2 } from "../../../types/vector2";
import { DrawNode, DrawNodeLevel } from "../types";

// We snap the node to the grid based on the length of the member in each level.
export default function organizeNodesPositionOnLevel(
  levels: DrawNodeLevel,

  /**
   * The index of the level to be organized.
   */
  currentLevelIndex: number
): void {
  const currentLevel = levels[currentLevelIndex];
  const nodesOnLevel = Object.values(currentLevel);
  const currentLevelLength = nodesOnLevel.length;

  const gap = 100;

  for (let i = 0; i < currentLevelLength; i++) {
    const node = nodesOnLevel[i];
    if (!node.parentDrawNode) {
      break;
    }

    const parentXPosition = node.parentDrawNode!.pos.x;
    const parentXOffset = node.pos.x - parentXPosition;

    const xPos = node.pos.x + gap * i + parentXOffset;
    const xOffset = (gap / 2) * (currentLevelLength - 1);
    const finalX = xPos - xOffset;

    node.pos = {
      x: finalX,
      y: node.pos.y,
    };
  }
}
