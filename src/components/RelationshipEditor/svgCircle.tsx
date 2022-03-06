import { useContext, useRef, useState } from "react";
import { RerenderToggle } from "../../contexts/rerenderToggle";
import { Vector2 } from "../../types/vector2";
import DrawNodeLevel from "./classes/drawNodeLevel";
import "./cycloid-svg-node.css";
import useGlobalPointerMove from "./utils/useGlobalPointerMove";

/**
 * A moveable svg circle. Calls an onOverNeighbor callback when it is over another node
 *
 * It knows that it is over another node based on the provided DrawNode[] information
 */
export default function SvgCircle({
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
  otherCirclesData,
}: {
  radius: number;
  centerPoint: Vector2;
  color?: string;
  thickness?: number;
  key: any;
  onPointerEnter?: VoidFunction;
  onPointerOut?: VoidFunction;
  onPointerMove?: (event: PointerEvent) => void;
  onPointerDown?: VoidFunction;
  onOverNeighbor?: VoidFunction;
  otherCirclesData?: DrawNodeLevel;
}): JSX.IntrinsicElements["circle"] {
  const [isPointerDown, setIsPointerDown] = useState(false);

  const svgRef = useRef<SVGCircleElement>(null);

  useGlobalPointerMove(setIsPointerDown, isPointerDown, (e) => {
    onPointerMove?.(e);
  });

  const handlePointerDown = (pointerDown: boolean) => {
    setIsPointerDown(pointerDown);
  };

  return (
    <circle
      ref={svgRef}
      onPointerEnter={onPointerEnter}
      onPointerOut={onPointerOut}
      onPointerDown={(e) => {
        e.preventDefault();
        onPointerDown?.();
        handlePointerDown(true);
      }}
      onPointerUp={() => handlePointerDown(false)}
      onPointerCancel={() => {
        setIsPointerDown(false);
      }}
      className="cycloid-svg-node"
      key={key}
      r={radius}
      cx={centerPoint.x}
      cy={centerPoint.y}
      fill="transparent"
      strokeWidth={thickness ?? 1}
      stroke={color ?? "rgba(191, 134, 252, 99)"}
    />
  );
}
