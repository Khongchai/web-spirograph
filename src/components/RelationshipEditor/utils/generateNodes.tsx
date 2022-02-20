import BoundingCircle from "../../../classes/BoundingCircle";
import CycloidParams from "../../../types/cycloidParams";
import { DrawNode } from "../types";
import drawCircle from "./drawCircle";
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
    // We start at 1 because the first level is the bounding circle
    // All children of bounding circle stays at level 0 + 1, and so on.

    const levelIndex = cycloidParams[i].boundingCircleIndex + 1;
    if (!levels[levelIndex]) {
      levels[levelIndex] = [];
    }

    const parentIndex = cycloidParams[i].boundingCircleIndex;
    const parentRadius = scaleDrawRadius(
      parentIndex == -1
        ? boundingCircle.getRadius()
        : cycloidParams[parentIndex].radius
    );
    const thisRadius = scaleDrawRadius(cycloidParams[i].radius);

    levels[levelIndex].push({
      parentIndex: levelIndex,
      //TODO calculate the new x later, for now just get y to work
      pos: {
        x: initialNodePosition.x,
        y:
          initialNodePosition.y +
          (i + 1) * childAndParentYGap +
          parentRadius +
          thisRadius,
      },
      radius: cycloidParams[i].radius,
    });
  }

  const svgElems: JSX.IntrinsicElements["circle"][] = [];
  levels.forEach((l, i) => {
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
