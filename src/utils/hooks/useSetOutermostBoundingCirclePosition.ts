import { MutableRefObject, useEffect } from "react";
import BoundingCircle from "../../classes/BoundingCircle";

export default function useSetOutermostBoundingCirclePosition(
  outermostBoundingCircle: BoundingCircle,
  parent: MutableRefObject<HTMLElement>,
  radius: number,
  clearCanvasToggle: boolean
) {
  useEffect(() => {
    outermostBoundingCircle.setCenterPoint({
      x: parent.current.clientWidth / 2,
      y: window.innerHeight / 2,
    });
    outermostBoundingCircle.setRadius(radius);
  }, [clearCanvasToggle]);
}
