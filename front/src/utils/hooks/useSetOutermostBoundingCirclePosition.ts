import { MutableRefObject, useEffect } from "react";
import BoundingCircle from "../../classes/domain/BoundingCircle";

export default function useSetOutermostBoundingCirclePosition(
  outermostBoundingCircle: BoundingCircle,
  parent: MutableRefObject<HTMLElement>,
  radius: number
) {
  useEffect(() => {
    outermostBoundingCircle.centerPoint = {
      x: parent.current.clientWidth / 2,
      y: window.innerHeight / 2,
    };
    outermostBoundingCircle.radius = radius;
  }, []);
}
