import React, { useContext, useEffect, useState } from "react";
import BoundingCircle from "../../../classes/BoundingCircle";
import colors from "../../../constants/colors";
import { Rerender } from "../../../contexts/rerenderToggle";
import CycloidControlsData from "../../../classes/cycloidControls";
import DrawNodeLevel from "../classes/drawNodeLevel";
import DraggableSvgCircle from "../draggableSvgCircle";
import SvgLineFromNodeToParent from "../svgLine";
import getDrawLevel from "./getDrawLevel";
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
        ids: {
          thisNodeId: -1,
          parentIndex: undefined,
        },
      },
    });

    for (let i = 0; i < cycloidParams.length; i++) {
      const thisCycloid = cycloidParams[i];
      const currentDrawLevel = getDrawLevel(thisCycloid.id, cycloidControls);

      // For offsetting the node to be below the parent node
      const previousLevel = currentDrawLevel - 1;
      const parentId = thisCycloid.boundingCircleId.toString();
      const nodeRelativePos = {
        x: initialNodePosition.x,
        y:
          (initialNodePosition.y + childAndParentYGap) * (currentDrawLevel + 1),
      };

      // console.log("drawLevel: " + currentDrawLevel +  ", " + "cycloid id: " +  thisCycloid.id);
      levels.setNode({
        levelKey: thisCycloid.id.toString(),
        level: currentDrawLevel,
        drawNode: {
          currentDrawLevel,
          parentDrawNode: levels.retrieveNodeFromLevel({
            key: parentId,
            level: previousLevel,
          }),
          pos: nodeRelativePos,
          radius: thisCycloid.radius,
          ids: {
            thisNodeId: thisCycloid.id,
            parentIndex: cycloidParams[i].boundingCircleId,
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
  const boundingCircle = cycloidControls.current.outerMostBoundingCircle;

  levels.getAllLevels().forEach((l, levelIndex) => {
    organizeNodesPositionOnLevel(levels, levelIndex);

    Object.values(l).forEach((node) => {
      const key = `${node.currentDrawLevel}-${node.ids.thisNodeId}`;

      // The index for accessing the cycloidParams object directly
      const cycloidId = node.ids.thisNodeId;
      const isBoundingCircle = cycloidId === -1;

      const thisCycloid = cycloidControls.current.getSingleCycloidParamFromId(
        cycloidId.toString()
      );

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
              thisCycloid!.boundingColor = enterColor;
            }
          }}
          onPointerOut={() => {
            const outColor = colors.purple.light;
            if (isBoundingCircle) {
              boundingCircle.setBoundingColor(outColor);
            } else {
              thisCycloid!.boundingColor = outColor;
            }
          }}
          onPointerDown={() => {
            if (isBoundingCircle) {
              alert("Moving the bounding circle is not allowed");
              return;
            }
          }}
          onOverNeighbor={(neighbor) => {
            // We must traverse the tree from the this cycloid to the bounding circle
            // to see if they contain itself, if it does, do nothing.
            let parentId = neighbor?.parentDrawNode?.ids.thisNodeId;
            let thisNodeIsAnAncestorOfNeighbor = false;

            while (true) {
              const parentIsBoundingCircle = parentId === -1;
              const hoveredNeighborIsBoundingCirlce = parentId == undefined;
              if (parentIsBoundingCircle || hoveredNeighborIsBoundingCirlce) {
                break;
              }

              if (parentId === thisCycloid!.id) {
                thisNodeIsAnAncestorOfNeighbor = true;
                break;
              }

              parentId = levels.retrieveSingleNode({
                key: parentId!.toString(),
              })?.ids.parentIndex;
            }
            if (!thisNodeIsAnAncestorOfNeighbor) {
              thisCycloid!.boundingCircleId = neighbor.ids.thisNodeId;
              cycloidControls.current.sortCycloidByBoundingPriority();
            }
          }}
          otherCirclesData={levels.getAllNodesExceptThis(node.ids.thisNodeId)}
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
