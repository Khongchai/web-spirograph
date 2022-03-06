import { DrawNode } from "./types";
import scaleDrawRadius from "./utils/scaleDrawRadius";

/**
 * 1 is the child and 2 is the parent
 */
export default function SvgLineFromNodeToParent({
  node,
  key,
}: {
  key: any;
  node: DrawNode;
}) {
  const { x: x1, y: y1 } = node.pos;
  const r1 = scaleDrawRadius(node.radius);

  const { x: x2, y: y2 } = node.parentDrawNode!.pos;
  const r2 = scaleDrawRadius(node.parentDrawNode!.radius);

  const xOffsetScale = 3.5;
  const xOffset = (x2 - x1) / xOffsetScale;

  const finalX = x2 - xOffset;
  // Just the circle equation, but solve for y
  const finalY =
    Math.sqrt(
      Math.pow(r2, 2) - Math.pow(finalX, 2) + 2 * x2 * finalX - Math.pow(x2, 2)
    ) + y2;

  return (
    <path
      key={key}
      d={`M${x1} ${y1 - r1} L${finalX} ${finalY}`}
      stroke="rgba(191, 134, 252, 99)"
      strokeWidth={1}
    />
  );
}
