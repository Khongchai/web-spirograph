import BoundingCircle from "../../../classes/BoundingCircle";
import CycloidParams from "../../../types/cycloidParams";
import { DrawNode } from "../types";
import drawCircle from "./drawCircle";
import extractNodeData from "./extractNodeData";
import organizeNodesPositionOnLevel from "./getNodeXPos";
import scaleDrawRadius from "./scaleDrawRadius";

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
  const levels: DrawNode[][] = [];

  // Push the bounding circle to the top most level
  levels[0] = [
    {
      parentIndex: 0,
      pos: initialNodePosition,
      radius: boundingCircle.getRadius(),
    },
  ];
  for (let i = 0; i < cycloidParams.length; i++) {
    const { currentDrawLevel } = extractNodeData(
      i,
      cycloidParams,
      boundingCircle
    );

    if (!levels[currentDrawLevel]) {
      levels[currentDrawLevel] = [];
    }

    levels[currentDrawLevel].push({
      parentIndex: currentDrawLevel,
      //TODO calculate the new x later, for now just get y to work
      pos: {
        x: initialNodePosition.x,
        y:
          (initialNodePosition.y + childAndParentYGap) * (currentDrawLevel + 1),
      },
      radius: cycloidParams[i].radius,
    });
  }

  const svgElems: JSX.IntrinsicElements["circle"][] = [];
  levels.forEach((l, i) => {
    organizeNodesPositionOnLevel(levels, i);
    l.forEach((node, j) => {
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
