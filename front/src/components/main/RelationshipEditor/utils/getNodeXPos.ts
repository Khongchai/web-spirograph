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

  /**
   * This is to make sure that nodes that have the same parent stay on the same side.
   */
  nodesOnLevel.sort((a, b) => (a.ids.parentId ?? -1) - (b.ids.parentId ?? -1));

  for (let i = 0; i < currentLevelLength; i++) {
    const node = nodesOnLevel[i];
    if (node.ids.parentId == undefined) {
      continue;
    }

    const shouldOffsetX = determineShouldOffsetX(node, nodesOnLevel);

    const parentXPosition = levels.retrieveSingleNode({
      key: node.ids.parentId,
    }).pos.x;

    const xPos = node.pos.x + gap * i
    const xOffset = (gap / 2) * (currentLevelLength - 1);
    const finalX = xPos - xOffset;

    node.pos = {
      x: finalX,
      y: node.pos.y,
    };
  }
}

/**
 *
 * Right now, it's just a simple O(n) algo. We can optimize this later.
 *
 * Check if other nodes on this level have the same parent.
 */
function determineShouldOffsetX(
  nodeToCheck: DrawNode,
  allNodesOnTheSameLevel: DrawNode[]
): boolean {
  let amountOfNodesThatHaveTheSameParent = 0;

  const parentToCheck = nodeToCheck.ids.parentId;

  allNodesOnTheSameLevel.forEach((node) => {
    if (node.ids.parentId === parentToCheck) {
      amountOfNodesThatHaveTheSameParent++;
    }
  });

  return amountOfNodesThatHaveTheSameParent > 1;
}
