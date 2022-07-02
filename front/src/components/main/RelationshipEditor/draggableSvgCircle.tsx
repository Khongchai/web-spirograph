import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Rerender, RerenderToggle } from "../../../contexts/rerenderToggle";
import { Vector2 } from "../../../classes/DTOInterfaces/vector2";
import useForceUpdate from "../../../utils/hooks/useForceUpdate";
import "./cycloid-svg-node.css";
import { DrawNode } from "./types";
import useCheckCircleCircleCollision from "./utils/useCheckCircleCircleCollision";
import useGlobalPointerMove from "./utils/useGlobalPointerMove";
import { RerenderReason } from "../../../types/contexts/rerenderReasons";

/**
 * TODO:
 *
 * Cases to test:
 *  - When the user drags the node, the node should move with the mouse.
 *  - When the user drags the node and then release, but the onOverNeighbor is not called, the node should return to its original position.
 *  - When the user drags the node and then release, onOverNeighbor is called, but that thing is the node's parent,the node should return to its original position.
 *    and no changes should be made.
 *  - When the user drags the node and then release, onOverNeighbor is called, but that thing is the node's child,the node should return to its original position.
 *    and no changes should be made.
 */

interface DraggableSvgCircleInterface {
  radius: number;
  centerPoint: Vector2;
  color?: string;
  thickness?: number;
  onPointerEnter?: (node?: DrawNode | null) => void;
  onPointerOut?: (node?: DrawNode | null) => void;
  onPointerDown?: (node?: DrawNode | null) => void;
  otherCirclesData?: DrawNode[];
  isMoveable?: boolean;

  /**
   * When released the mouse over a neighbor node.
   */
  onOverNeighborAndReleased?: (neighbor: DrawNode) => void;
  /**
   * When the mouse is over a neighbor node and the mouse is being held.
   */
  onOverNeighborAndHeld?: (neighbor: DrawNode) => void;
  /**
   * When the mouse is over a neighbor node and then move somewhere else.
   */
  onOverNeighborAndCanceled?: (neighbor: DrawNode) => void;
}

/**
 * A moveable svg circle. Calls an onOverNeighbor callback when it is over another node
 *
 * It knows that it is over another node based on the provided DrawNode[] information
 *
 * Using svg is a mistake....shoulda stuck with canvas :'(
 */
export default function DraggableSvgCircle({
  radius,
  centerPoint,
  color,
  thickness,
  onPointerEnter,
  onPointerOut,
  onPointerDown,
  otherCirclesData = [],
  isMoveable = true,
  onOverNeighborAndHeld,
  onOverNeighborAndReleased,
  onOverNeighborAndCanceled,
}: DraggableSvgCircleInterface) {
  const [isPointerDown, setIsPointerDown] = useState(false);

  const circlePosOnPointerDownRef = useRef<Vector2>(centerPoint);
  const pointerDownPosRef = useRef<Vector2>(centerPoint);
  const hoveredNeighborRef = useRef<DrawNode | null>(null);

  // Update global
  const rerenderToggle = useContext(RerenderToggle);
  // Update local
  const forceUpdate = useForceUpdate();

  /**
   * Using state for this because we need to rerender everytime the circle is moved
   */
  const [thisCirclePosition, setThisCirclePosition] =
    useState<Vector2>(centerPoint);
  useEffect(() => {
    setThisCirclePosition(centerPoint);
  }, [centerPoint]);

  const svgRef = useRef<SVGCircleElement>(null);

  useGlobalPointerMove(setIsPointerDown, isPointerDown, (e) => {
    const initialCirclePos = circlePosOnPointerDownRef.current;

    const currentPointerPos = { x: e.x, y: e.y };
    const pointerPosDiff = {
      x: currentPointerPos.x - pointerDownPosRef.current.x,
      y: currentPointerPos.y - pointerDownPosRef.current.y,
    };

    const newCirclePos = {
      x: initialCirclePos.x + pointerPosDiff.x,
      y: initialCirclePos.y + pointerPosDiff.y,
    };

    setThisCirclePosition(newCirclePos);
  });

  useCheckCircleCircleCollision(
    thisCirclePosition,
    radius,
    otherCirclesData,
    (neighbor) => {
      onOverNeighborAndHeld?.(neighbor);
      hoveredNeighborRef.current = neighbor;
      forceUpdate();
    },
    () => {
      hoveredNeighborRef.current &&
        onOverNeighborAndCanceled?.(hoveredNeighborRef.current!);
      hoveredNeighborRef.current = null;
    }
  );

  const handlePointerDownOrUp = useCallback(
    (e: React.PointerEvent<SVGCircleElement>, pointerDown: boolean) => {
      if (pointerDown) {
        onPointerDown?.();
      }
      // Call the onOverNeighbor callback if the circle is over another node
      else {
        if (hoveredNeighborRef.current) {
          onOverNeighborAndReleased?.(hoveredNeighborRef.current);
          onPointerOut?.(hoveredNeighborRef.current);
          rerenderToggle(RerenderReason.undefined);
        } else {
          setThisCirclePosition(centerPoint);
        }
      }

      if (isMoveable) {
        setIsPointerDown(pointerDown);
        pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
        circlePosOnPointerDownRef.current = thisCirclePosition;
      }
    },
    [thisCirclePosition]
  );

  return (
    <circle
      ref={svgRef}
      onPointerEnter={() => onPointerEnter?.(hoveredNeighborRef.current)}
      onPointerOut={() => onPointerOut?.(hoveredNeighborRef.current)}
      onPointerDown={(e) => {
        e.preventDefault();
        handlePointerDownOrUp(e, true);
      }}
      onPointerUp={(e) => handlePointerDownOrUp(e, false)}
      onPointerCancel={(e) => {
        handlePointerDownOrUp(e, false);
      }}
      className="cycloid-svg-node"
      r={radius}
      cx={thisCirclePosition.x}
      cy={thisCirclePosition.y}
      fill="transparent"
      strokeWidth={thickness ?? 1}
      stroke={color ?? "rgba(191, 134, 252, 99)"}
    />
  );
}
