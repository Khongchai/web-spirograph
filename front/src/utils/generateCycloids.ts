import Cycloid from "../classes/domain/Cycloid";
import CycloidControls from "../classes/domain/cycloidControls";

export default function generateCycloids(cycloidControls: CycloidControls) {
  const cycloids: Cycloid[] = [];
  const outerMostBoundingCircle = cycloidControls.outermostBoundingCircle;

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
