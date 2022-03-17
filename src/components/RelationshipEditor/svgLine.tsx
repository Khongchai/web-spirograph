import { DrawNode } from "./types";
import scaleDrawRadius from "./utils/scaleDrawRadius";

/**
 * 1 is the child and 2 is the parent
 */
export default function SvgLineFromNodeToParent({ node }: { node: DrawNode }) {
  const { x: x1, y: y1 } = node.pos;
  const r1 = scaleDrawRadius(node.radius);

  const { x: x2, y: y2 } = node.parentDrawNode!.pos;
  const r2 = scaleDrawRadius(node.parentDrawNode!.radius);

  const xOffsetScale = 3.5;

  const xOffset = (x2 - x1) / xOffsetScale;

  const finalX = Math.min(Math.max(x2 - xOffset, x2 - r2), x2 + r2);
  // Just the circle equation, but solve for y

  const k = Math.max(
    0,
    Math.pow(r2, 2) - Math.pow(finalX, 2) + 2 * x2 * finalX - Math.pow(x2, 2)
  );

  const finalY = Math.sqrt(k) + y2;

  return (
    <path
      d={`M${x1} ${y1 - r1} L${finalX} ${finalY}`}
      stroke="rgba(191, 134, 252, 99)"
      strokeWidth={1}
    />
  );
}
