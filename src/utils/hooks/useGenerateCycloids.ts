import { MutableRefObject, useMemo } from "react";
import Cycloid from "../../classes/Cycloid";
import CycloidControlsData from "../../types/cycloidControls";
import GeneratedCycloidData from "../../types/generatedCycloidData";

/*
    This hook encapsulate the generation of cycloids from information within the controls.
*/
export default function useGenerateCycloids(
  cycloidControls: MutableRefObject<CycloidControlsData>
): GeneratedCycloidData {
  let outerMostBoundingCircle = cycloidControls.current.outerMostBoundingCircle;

  let cycloids = useMemo(() => {
    const cycloids: Cycloid[] = [];

    cycloidControls.current.cycloids.forEach((c) => {
      let cycloid = new Cycloid(
        c.radius,
        c.rotationDirection,
        //Use this for now, will reassign later
        outerMostBoundingCircle,
        false,
        c.boundingColor
      );
      cycloids.push(cycloid);
    });

    return cycloids;
  }, []);

  return {
    generatedCycloids: cycloids,
    outermostBoundingCircle: outerMostBoundingCircle,
  };
}
