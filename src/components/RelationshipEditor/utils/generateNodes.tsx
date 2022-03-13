import React, { useContext, useEffect, useState } from "react";
import BoundingCircle from "../../../classes/BoundingCircle";
import colors from "../../../constants/colors";
import { Rerender, RerenderToggle } from "../../../contexts/rerenderToggle";
import CycloidControlsData from "../../../types/cycloidControls";
import DrawNodeLevel from "../classes/drawNodeLevel";
import DraggableSvgCircle from "../draggableSvgCircle";
import SvgLineFromNodeToParent from "../svgLine";
import getDrawLevel from "./extractNodeData";
import organizeNodesPositionOnLevel from "./getNodeXPos";
import scaleDrawRadius from "./scaleDrawRadius";

/**
 *  For generating the tree graph for the relationship editor
 */
export default function useGenerateNodes(
  boundingCircle: BoundingCircle,
  cycloidControls: React.MutableRefObject<CycloidControlsData>,
  containerSize: { width: number; height: number },
  childAndParentYGap: number
): {
  svgCircles: JSX.IntrinsicElements["circle"][];
  svgLines: JSX.IntrinsicElements["line"][];
} {
  const [nodesAndLines, setNodesAndLines] = useState<{
    svgCircles: React.SVGProps<SVGCircleElement>[];
    svgLines: React.SVGProps<SVGLineElement>[];
  }>({ svgCircles: [], svgLines: [] });

  const rerender = useContext(Rerender);

  useEffect(() => {
    const initialNodePosition = {
      //Arbitrary numbers that looks good.
      x: containerSize.width / 2,
      y: containerSize.height * 0.1,
    };

    // Assign what to draw based on the level
    // 0 is the bounding circle's level
    const levels = new DrawNodeLevel();

    const cycloidParams = cycloidControls.current.cycloids;

    // Push the bounding circle to the top most level
    levels.setNode({
      levelKey: "-1",
      level: 0,
      drawNode: {
        currentDrawLevel: 0,
        pos: initialNodePosition,
        radius: boundingCircle.getRadius(),
        indices: {
          index: -1,
          parentIndex: undefined,
        },
      },
    });

    // cycloidParams.sort((a, b) => a.boundingCircleIndex - b.boundingCircleIndex);

    for (let i = 0; i < cycloidParams.length; i++) {
      const currentDrawLevel = getDrawLevel(i, cycloidParams);

      // For offsetting the node to be below the parent node
      const previousLevel = currentDrawLevel - 1;
      const parentKey = cycloidParams[i].boundingCircleIndex.toString();
      const nodeRelativePos = {
        x: initialNodePosition.x,
        y:
          (initialNodePosition.y + childAndParentYGap) * (currentDrawLevel + 1),
      };

      levels.setNode({
        levelKey: i.toString(),
        level: currentDrawLevel,
        drawNode: {
          currentDrawLevel,
          parentDrawNode: levels.retrieveNode({
            key: parentKey,
            level: previousLevel,
          }),
          pos: nodeRelativePos,
          radius: cycloidParams[i].radius,
          indices: {
            index: i,
            parentIndex: cycloidParams[i].boundingCircleIndex,
          },
        },
      });
    }

    setNodesAndLines(getPositionedNodesAndLines(levels, cycloidControls));
  }, [rerender]);

  return nodesAndLines;
}

function getPositionedNodesAndLines(
  levels: DrawNodeLevel,
  cycloidControls: React.MutableRefObject<CycloidControlsData>
): {
  svgCircles: JSX.IntrinsicElements["circle"][];
  svgLines: JSX.IntrinsicElements["line"][];
} {
  const svgCircles: JSX.IntrinsicElements["circle"][] = [];
  const svgLines: JSX.IntrinsicElements["line"][] = [];

  levels.getAllLevels().forEach((l, levelIndex) => {
    organizeNodesPositionOnLevel(levels, levelIndex);

    Object.values(l).forEach((node, nodeIndex) => {
      const key = `${node.currentDrawLevel}-${nodeIndex}`;

      // The index for accessing the cycloidParams object directly
      const paramIndex = node.indices.index;
      const isBoundingCircle = paramIndex === -1;
      const thisCycloid = cycloidControls.current.cycloids[paramIndex];
      const boundingCircle = cycloidControls.current.outerMostBoundingCircle;

      svgCircles.push(
        <DraggableSvgCircle
          centerPoint={node.pos}
          radius={scaleDrawRadius(node.radius)}
          key={key}
          onPointerEnter={() => {
            const enterColor = colors.yellow;
            if (isBoundingCircle) {
              boundingCircle.setBoundingColor(enterColor);
            } else {
              thisCycloid.boundingColor = enterColor;
            }
          }}
          onPointerOut={() => {
            const outColor = colors.purple.light;
            if (isBoundingCircle) {
              boundingCircle.setBoundingColor(outColor);
            } else {
              thisCycloid.boundingColor = outColor;
            }
          }}
          onPointerDown={() => {
            if (isBoundingCircle) {
              alert("Moving the bounding circle is not allowed");
              return;
            }
          }}
          onOverNeighbor={(neighbor) => {
            const isBoundingCircleIndex = neighbor.indices.index !== -1;
            if (isBoundingCircleIndex) {
              thisCycloid.boundingCircleIndex = neighbor.indices.index;
            }
          }}
          otherCirclesData={levels.getAllNodesExceptThis(node.indices.index)}
          isMoveable={!isBoundingCircle}
        />
      );

      if (node.parentDrawNode) {
        svgLines.push(<SvgLineFromNodeToParent key={key} node={node} />);
      }
    });
  });

  return {
    svgCircles,
    svgLines,
  };
}
