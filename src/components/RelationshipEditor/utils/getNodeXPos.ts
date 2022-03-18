import DrawNodeLevel from "../classes/drawNodeLevel";
import { DrawNode } from "../types";

/**
 * We snap the node to the grid based on the length of the member in each level.
 */
export default function organizeNodesPositionOnLevel(
  levels: DrawNodeLevel,

  /**
   * The index of the level to be organized.
   */
  currentLevelIndex: number
): void {
  const currentLevel = levels.getLevel(currentLevelIndex);
  const nodesOnLevel = Object.values(currentLevel);
  const currentLevelLength = nodesOnLevel.length;

  const gap = 100;

  const shouldOffsetX = determineShouldOffsetX(nodesOnLevel);
  nodesOnLevel.sort(
    (a, b) => (a.ids.parentIndex ?? -1) - (b.ids.parentIndex ?? -1)
  );

  for (let i = 0; i < currentLevelLength; i++) {
    const node = nodesOnLevel[i];
    if (!node.parentDrawNode) {
      break;
    }

    const parentXPosition = node.parentDrawNode!.pos.x;
    const parentXOffset = shouldOffsetX ? node.pos.x - parentXPosition : 0;

    const xPos = node.pos.x + gap * i - parentXOffset;
    const xOffset = (gap / 2) * (currentLevelLength - 1);
    const finalX = xPos - xOffset;

    node.pos = {
      x: finalX,
      y: node.pos.y,
    };
  }
}

/**
 * Determine if we should offset the X in order to center our nodes by checking if
 * everything in the level shares the same parent.
 * If not, we offset the X to center the nodes.
 * else, there's no need to center it as it's better visually to let the nodes flow naturally.
 *
 */
function determineShouldOffsetX(nodes: DrawNode[]): boolean {
  let firstNodeParent = nodes[0].parentDrawNode;
  for (let i = 1, length = nodes.length; i < length; i++) {
    const node = nodes[i];
    const hasSameParent = node.parentDrawNode === firstNodeParent;
    if (!hasSameParent) {
      return false;
    }
  }

  return true;
}
