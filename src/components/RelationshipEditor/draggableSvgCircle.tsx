import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Rerender, RerenderToggle } from "../../contexts/rerenderToggle";
import { Vector2 } from "../../types/vector2";
import "./cycloid-svg-node.css";
import { DrawNode } from "./types";
import useCheckCircleCircleCollision from "./utils/useCheckCircleCircleCollision";
import useGlobalPointerMove from "./utils/useGlobalPointerMove";

interface DraggableSvgCircleInterface {
  radius: number;
  centerPoint: Vector2;
  color?: string;
  thickness?: number;
  onPointerEnter?: VoidFunction;
  onPointerOut?: VoidFunction;
  onPointerDown?: VoidFunction;
  onOverNeighbor?: (neighbor: DrawNode) => void;
  otherCirclesData?: DrawNode[];
  isMoveable?: boolean;
}

/**
 * A moveable svg circle. Calls an onOverNeighbor callback when it is over another node
 *
 * It knows that it is over another node based on the provided DrawNode[] information
 */
export default function DraggableSvgCircle({
  radius,
  centerPoint,
  color,
  thickness,
  onPointerEnter,
  onPointerOut,
  onPointerDown,
  onOverNeighbor,
  otherCirclesData = [],
  isMoveable = true,
}: DraggableSvgCircleInterface) {
  const [isPointerDown, setIsPointerDown] = useState(false);

  const circlePosOnPointerDownRef = useRef<Vector2>(centerPoint);
  const pointerDownPosRef = useRef<Vector2>(centerPoint);
  const hoveredNeighborRef = useRef<DrawNode | null>(null);

  const rerenderToggle = useContext(RerenderToggle);

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
      hoveredNeighborRef.current = neighbor;
    },
    () => {
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
          onOverNeighbor?.(hoveredNeighborRef.current);
          rerenderToggle();
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
      onPointerEnter={onPointerEnter}
      onPointerOut={onPointerOut}
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
