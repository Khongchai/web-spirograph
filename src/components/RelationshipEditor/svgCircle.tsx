import { useCallback, useEffect, useState } from "react";
import { Vector2 } from "../../types/vector2";
import "./cycloid-svg-node.css";
import useGlobalPointerMove from "./utils/useGlobalPointerMove";

export default function SvgCircle({
  radius,
  centerPoint,
  color,
  thickness,
  key,
  onPointerEnter,
  onPointerOut,
  onPointerMove,
}: {
  radius: number;
  centerPoint: Vector2;
  color?: string;
  thickness?: number;
  key: any;
  onPointerEnter?: VoidFunction;
  onPointerOut?: VoidFunction;
  onPointerMove?: (event: PointerEvent) => void;
}): JSX.IntrinsicElements["circle"] {
  const [isPointerDown, setIsPointerDown] = useState(false);

  useGlobalPointerMove(setIsPointerDown, isPointerDown, onPointerMove);

  return (
    <circle
      onPointerEnter={onPointerEnter}
      onPointerOut={onPointerOut}
      onPointerDown={() => setIsPointerDown(true)}
      onPointerUp={() => setIsPointerDown(false)}
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
