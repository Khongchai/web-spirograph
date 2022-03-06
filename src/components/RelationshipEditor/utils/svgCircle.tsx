import { useEffect, useState } from "react";
import { Vector2 } from "../../../types/vector2";
import "./cycloid-svg-node.css";

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
  const [isOverObject, setIsOverObject] = useState(false);

  const handlePointerMove = (e: PointerEvent) => {
    onPointerMove?.(e);
  };

  useEffect(() => {
    if (isOverObject) {
      onPointerEnter?.();
      document.addEventListener("pointermove", handlePointerMove);
    } else {
      onPointerOut?.();
      document.removeEventListener("pointermove", handlePointerMove);
    }
  }, [isOverObject]);

  return (
    <circle
      onPointerEnter={() => {
        setIsOverObject(true);
      }}
      onPointerOut={() => {
        setIsOverObject(false);
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
