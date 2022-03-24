import { MutableRefObject, useMemo } from "react";
import Cycloid from "../../classes/Cycloid";
import CycloidControlsData from "../../classes/CycloidControls";
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

    cycloidControls.current.cycloidManager
      .getAllCycloidParams()
      .forEach((c) => {
        let cycloid = new Cycloid(
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
  }, []);

  return {
    generatedCycloids: cycloids,
    outermostBoundingCircle: outerMostBoundingCircle,
  };
}
