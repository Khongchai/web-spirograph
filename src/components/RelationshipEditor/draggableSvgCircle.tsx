import { useRef, useState } from "react";
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
  key: any;
  onPointerEnter?: VoidFunction;
  onPointerOut?: VoidFunction;
  onPointerMove?: (event: PointerEvent) => void;
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
  key,
  onPointerEnter,
  onPointerOut,
  onPointerMove,
  onPointerDown,
  onOverNeighbor,
  otherCirclesData = [],
  isMoveable = true,
}: DraggableSvgCircleInterface): JSX.IntrinsicElements["circle"] {
  const [isPointerDown, setIsPointerDown] = useState(false);

  const initialCirclePosRef = useRef<Vector2>(centerPoint);
  const pointerDownPosRef = useRef<Vector2>(centerPoint);

  /**
   * Using state for this because we need to rerender everytime the circle is moved
   */
  const [thisCirclePosition, setThisCirclePosition] =
    useState<Vector2>(centerPoint);

  const svgRef = useRef<SVGCircleElement>(null);

  useGlobalPointerMove(setIsPointerDown, isPointerDown, (e) => {
    onPointerMove?.(e);

    const initialCirclePos = initialCirclePosRef.current;

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
      onOverNeighbor?.(neighbor);
    }
  );

  const handlePointerDown = (
    e: React.PointerEvent<SVGCircleElement>,
    pointerDown: boolean
  ) => {
    onPointerDown?.();
    if (isMoveable) {
      setIsPointerDown(pointerDown);
      pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
      initialCirclePosRef.current = thisCirclePosition;
    }
  };

  return (
    <circle
      ref={svgRef}
      onPointerEnter={onPointerEnter}
      onPointerOut={onPointerOut}
      onPointerDown={(e) => {
        e.preventDefault();
        handlePointerDown(e, true);
      }}
      onPointerUp={(e) => handlePointerDown(e, false)}
      onPointerCancel={(e) => {
        handlePointerDown(e, false);
      }}
      className="cycloid-svg-node"
      key={key}
      r={radius}
      cx={thisCirclePosition.x}
      cy={thisCirclePosition.y}
      fill="transparent"
      strokeWidth={thickness ?? 1}
      stroke={color ?? "rgba(191, 134, 252, 99)"}
    />
  );
}
