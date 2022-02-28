import BoundingCircle from "../../../classes/BoundingCircle";
import CycloidParams from "../../../types/cycloidParams";
import { DrawNodeLevel } from "../types";
import drawCircle from "./drawCircle";
import getDrawLevel from "./extractNodeData";
import organizeNodesPositionOnLevel from "./getNodeXPos";
import scaleDrawRadius from "./scaleDrawRadius";

/**
 *  For generating the tree graph for the relationship editor
 */
export default function generateNodes(
  boundingCircle: BoundingCircle,
  cycloidParams: CycloidParams[],
  containerSize: { width: number; height: number }
): {
  svgCircles: JSX.IntrinsicElements["circle"][];
  svgLines: JSX.IntrinsicElements["line"][];
} {
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
      indices: {
        index: i,
        parentIndex: cycloidParams[i].boundingCircleIndex,
      },
    };
  }

  const svgCircles: JSX.IntrinsicElements["circle"][] = [];
  const svgLines: JSX.IntrinsicElements["line"][] = [];

  levels.forEach((l, levelIndex) => {
    organizeNodesPositionOnLevel(levels, levelIndex);

    Object.values(l).forEach((node, nodeIndex) => {
      const key = `${node.currentDrawLevel}-${nodeIndex}`;

      svgCircles.push(
        drawCircle({
          centerPoint: node.pos,
          radius: scaleDrawRadius(node.radius),
          key: key,
        })
      );

      //TODO refactor to drawLine()
      if (node.parentDrawNode !== null) {
        const { x: x1, y: y1 } = node.pos;
        const r1 = scaleDrawRadius(node.radius);

        const { x: x2, y: y2 } = node.parentDrawNode.pos;
        const r2 = scaleDrawRadius(node.parentDrawNode.radius);

        const xOffsetScale = 3;
        const xOffset = (x2 - x1) / xOffsetScale;

        // TODO => maybe this is the solution https://www.youtube.com/watch?v=pvimAM_SLic&t=185s
        const yOffset = 0;

        svgLines.push(
          <path
            key={key}
            d={`M${x1} ${y1 - r1} L${x2 - xOffset} ${y2 + r2}`}
            stroke="rgba(191, 134, 252, 99)"
            strokeWidth={1}
          />
        );
      }
    });
  });

  return {
    svgCircles,
    svgLines,
  };
}
