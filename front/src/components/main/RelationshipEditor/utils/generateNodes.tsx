import React, { useContext, useEffect, useState } from "react";
import BoundingCircle from "../../../../classes/domain/BoundingCircle";
import colors from "../../../../constants/colors";
import { Rerender } from "../../../../contexts/rerenderToggle";
import CycloidControlsData from "../../../../classes/domain/cycloidControls";
import DrawNodeLevel from "../classes/drawNodeLevel";
import DraggableSvgCircle from "../draggableSvgCircle";
import SvgLineFromNodeToParent from "../SvgLine";
import getDrawLevel from "./getDrawLevel";
import organizeNodesPositionOnLevel from "./getNodeXPos";
import scaleDrawRadius from "./scaleDrawRadius";
import { DrawNode } from "../types";

/**
 * For generating the tree graph for the relationship editor.
 *
 * # Positioning
 *
 * All nodes are iterated over once and stored in a Record inside the DrawNodeLevel instance as a property.
 *
 * The levels are a list of objects, where each object is a level.
 * Using a manager like levels, in which, the nodes are stored in maps.
 * is better in that all we can retrieve some information related to any node at almost O(1) time.
 *
 * For example, we can retrieve all the nodes at level 3 at O(1) time
 * to calculate the X position by checking if they have the same parents before we draw them.
 *
 * With breadth-first, all nodes in the previous levels will have to be traversed to find the nodes at the level we want.
 *
 * To use BFS, we'd also need to know a node's children, which is not possible with the current implementation.
 * The current implementation is modeled after the physical spirograph relationship,
 * where the child knows its parent, not vice versa. And this also helps with drawing, as we need to know
 * the parent's position to draw the child and whether we should offsetX when there are multiple nodes that
 * share the same parent.
 *
 * # Drawing
 *
 * For drawing, the current implementation is capable of drawing both depth-first and breadth-first.
 * We are doing BF.
 *
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

    const cycloidParams =
      cycloidControls.current.cycloidManager.allCycloidParams;

    // Push the bounding circle to the top most level
    levels.setNode({
      levelKey: "-1",
      level: 0,
      drawNode: {
        currentDrawLevel: 0,
        pos: initialNodePosition,
        radius: boundingCircle.radius,
        ids: {
          thisNodeId: -1,
          parentId: undefined,
        },
      },
    });

    for (let i = 0; i < cycloidParams.length; i++) {
      const thisCycloid = cycloidParams[i];
      const currentDrawLevel = getDrawLevel(thisCycloid.id, cycloidControls);

      const nodeRelativePos = {
        x: initialNodePosition.x,
        y:
          (initialNodePosition.y + childAndParentYGap) * (currentDrawLevel + 1),
      };

      levels.setNode({
        levelKey: thisCycloid.id.toString(),
        level: currentDrawLevel,
        drawNode: {
          currentDrawLevel,
          pos: nodeRelativePos,
          radius: thisCycloid.radius,
          ids: {
            thisNodeId: thisCycloid.id,
            parentId: cycloidParams[i].boundingCircleId,
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
  const boundingCircle = cycloidControls.current.outermostBoundingCircle;

  // Draw nodes by level (same as breadth-first).
  levels.getAllLevels().forEach((l, levelIndex) => {
    organizeNodesPositionOnLevel(levels, levelIndex);

    Object.values(l).forEach((node) => {
      const key = `${node.currentDrawLevel}-${node.ids.thisNodeId}`;

      // The index for accessing the cycloidParams object directly
      const cycloidId = node.ids.thisNodeId;
      const isBoundingCircle = cycloidId === -1;

      const thisCycloid =
        cycloidControls.current.cycloidManager.getSingleCycloidParamFromId(
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
              boundingCircle.boundingColor = enterColor;
            } else {
              thisCycloid!.boundingColor = enterColor;
            }
          }}
          onPointerOut={() => {
            const outColor = colors.purple.light;
            if (isBoundingCircle) {
              boundingCircle.boundingColor = outColor;
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
          onOverNeighborAndReleased={(neighbor) => {
            // We must traverse the tree from the this cycloid to the bounding circle
            // to see if they contain itself, if it does, do nothing.
            let parentId = neighbor?.ids.parentId;
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
              })?.ids.parentId;
            }
            if (!thisNodeIsAnAncestorOfNeighbor) {
              thisCycloid!.boundingCircleId = neighbor.ids.thisNodeId;
            }
          }}
          onOverNeighborAndHeld={(neighbor) => {
            const neighborCycloidParams =
              cycloidControls.current.cycloidManager.getSingleCycloidParamFromId(
                neighbor.ids.thisNodeId
              );

            neighborCycloidParams &&
              (neighborCycloidParams.boundingColor = colors.yellow);
          }}
          onOverNeighborAndCanceled={(neighbor) => {
            const neighborCycloidParams =
              cycloidControls.current.cycloidManager.getSingleCycloidParamFromId(
                neighbor.ids.thisNodeId
              );

            neighborCycloidParams &&
              (neighborCycloidParams.boundingColor = colors.purple.light);
          }}
          otherCirclesData={levels.getAllNodesExceptThis(node.ids.thisNodeId)}
          isMoveable={!isBoundingCircle}
        />
      );

      const parentNode = levels.retrieveSingleNode({
        key: node.ids.parentId ?? "",
      });
      if (parentNode) {
        svgLines.push(
          <SvgLineFromNodeToParent
            key={key}
            node={node}
            parentNode={parentNode}
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
