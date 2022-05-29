import Cycloid from "../classes/Cycloid";
import CycloidControls from "../classes/cycloidControls";

export default function generateCycloids(cycloidControls: CycloidControls) {
  const cycloids: Cycloid[] = [];
  const outerMostBoundingCircle = cycloidControls.outerMostBoundingCircle;

  cycloidControls.cycloidManager.allCycloidParams.forEach((c) => {
    const cycloid = new Cycloid(
      c.radius,
      c.rotationDirection,
      //Use this for now, will refactor later.
      outerMostBoundingCircle,
      false,
      c.boundingColor,
      c.id
    );
    cycloids.push(cycloid);
  });

  return cycloids;
}
