import { DrawerArguments } from "../../Workers/InstantDrawer/instantDrawer.worker";

export default function computedEpitrochoid({
  cycloids,
  theta,
}: DrawerArguments) {
  if (cycloids.length < 2) {
    throw new Error("Provide at least 2 cycloids");
  }

  const finalPoint = { x: 0, y: 0 };

  // Skip i = 0 because we don't need to iterate over the bounding circle
  for (let i = 1; i < cycloids.length; i++) {
    const parentCycloid = cycloids[i - 1];
    const thisCycloid = cycloids[i];
    const childCycloidRadius = thisCycloid.isOutsideOfParent
      ? thisCycloid.radius
      : -thisCycloid.radius;

    // We ask the child it needs the parent to scale its theta.
    finalPoint.x +=
      (parentCycloid.radius + childCycloidRadius) *
      Math.cos(
        theta * thisCycloid.thetaScale -
          Math.PI * 0.5 * Number(thisCycloid.isClockwise)
      );
    finalPoint.y +=
      (parentCycloid.radius + childCycloidRadius) *
      Math.sin(
        theta * thisCycloid.thetaScale +
          Math.PI * 0.5 * Number(thisCycloid.isClockwise)
      );
  }
  const rodLength = cycloids[cycloids.length - 1].rodLength;

  return {
    x: finalPoint.x + rodLength * Math.cos(theta),
    y: finalPoint.y + rodLength * Math.sin(theta),
  };
}
