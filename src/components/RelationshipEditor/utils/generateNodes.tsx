import BoundingCircle from "../../../classes/BoundingCircle";
import CycloidParams from "../../../types/cycloidParams";
import TooltipWrapper from "../../Shared/TooltipWrapper";
import { DrawNodeLevel } from "../types";
import drawCircle from "./drawCircle";
import getDrawLevel from "./extractNodeData";
import organizeNodesPositionOnLevel from "./getNodeXPos";

/**
 *  For generating the tree graph for the relationship editor
 */
export default function generateNodes(
  boundingCircle: BoundingCircle,
  cycloidParams: CycloidParams[],
  containerSize: { width: number; height: number }
): JSX.IntrinsicElements["circle"][] {
  const initialNodePosition = {
    //Arbitrary numbers that looks good.
    x: containerSize.width / 2,
    y: containerSize.height * 0.1,
  };

  const childAndParentYGap = 30;

  // Assign what to draw based on the level
  // 0 is the bounding circle's level
  const levels: DrawNodeLevel = [];

  // Push the bounding circle to the top most level
  levels[0] = {
    "-1": {
      currentDrawLevel: 0,
      pos: initialNodePosition,
      radius: boundingCircle.getRadius(),
      parentDrawNode: null,
    },
  };
  for (let i = 0; i < cycloidParams.length; i++) {
    const currentDrawLevel = getDrawLevel(i, cycloidParams);

    // First assignment for that level, if undefined
    if (levels[currentDrawLevel] === undefined) {
      levels[currentDrawLevel] = {};
    }

    // For offsetting the node to be below the parent node
    const previousLevel = currentDrawLevel - 1;
    const parentKey = cycloidParams[i].boundingCircleIndex.toString();
    const nodeRelativePos = {
      x: initialNodePosition.x,
      y: (initialNodePosition.y + childAndParentYGap) * (currentDrawLevel + 1),
    };

    levels[currentDrawLevel][i.toString()] = {
      currentDrawLevel,
      parentDrawNode: levels[previousLevel][parentKey],
      pos: nodeRelativePos,
      radius: cycloidParams[i].radius,
      meta: {
        index: i,
        parentIndex: cycloidParams[i].boundingCircleIndex,
      },
    };
  }

  const svgElems: JSX.IntrinsicElements["circle"][] = [];
  levels.forEach((l, i) => {
    organizeNodesPositionOnLevel(levels, i);
    Object.values(l).forEach((node, j) => {
      svgElems.push(
        drawCircle({
          centerPoint: node.pos,
          radius: node.radius,
          key: i + " " + j,
        })
      );
    });
  });

  return svgElems;
}
