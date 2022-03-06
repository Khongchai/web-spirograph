import BoundingCircle from "../../../classes/BoundingCircle";
import colors from "../../../constants/colors";
import CycloidControlsData from "../../../types/cycloidControls";
import CycloidParams from "../../../types/cycloidParams";
import { DrawNodeLevel } from "../types";
import drawNode from "./drawCircle";
import drawLineFromNodeToParent from "./drawLine";
import getDrawLevel from "./extractNodeData";
import organizeNodesPositionOnLevel from "./getNodeXPos";
import scaleDrawRadius from "./scaleDrawRadius";

/**
 *  For generating the tree graph for the relationship editor
 */
export default function generateNodes(
  boundingCircle: BoundingCircle,
  cycloidControls: React.MutableRefObject<CycloidControlsData>,
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

  const cycloidParams = cycloidControls.current.cycloids;

  // Push the bounding circle to the top most level
  levels[0] = {
    "-1": {
      currentDrawLevel: 0,
      pos: initialNodePosition,
      radius: boundingCircle.getRadius(),
      indices: {
        index: -1,
        parentIndex: undefined,
      },
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

      // The index for accessing the cycloidParams object directly
      const paramIndex = node.indices.index;
      const isBoundingCircle = paramIndex === -1;

      svgCircles.push(
        drawNode({
          centerPoint: node.pos,
          radius: scaleDrawRadius(node.radius),
          key: key,
          onPointerEnter: () => {
            if (isBoundingCircle) {
              cycloidControls.current.outerMostBoundingCircle.setBoundingColor(
                colors.purple.dull
              );
            } else {
              cycloidControls.current.cycloids[paramIndex].boundingColor =
                colors.purple.dull;
            }
          },
          onPointerOut: () => {
            if (isBoundingCircle) {
              cycloidControls.current.outerMostBoundingCircle.setBoundingColor(
                colors.purple.light
              );
            } else {
              cycloidControls.current.cycloids[paramIndex].boundingColor =
                colors.purple.light;
            }
          },
        })
      );

      if (node.parentDrawNode) {
        svgLines.push(
          drawLineFromNodeToParent({
            key: key,
            node,
          })
        );
      }
    });
  });

  return {
    svgCircles,
    svgLines,
  };
}
