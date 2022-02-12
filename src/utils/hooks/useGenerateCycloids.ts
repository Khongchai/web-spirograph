import { MutableRefObject, useMemo } from "react";
import BoundingCircle from "../../classes/BoundingCircle";
import Cycloid from "../../classes/Cycloid";
import CycloidControls from "../../types/cycloidControls";
import CycloidParams from "../../types/cycloidParams";
import GeneratedCycloidData from "../../types/generatedCycloidData";

/*
    This hook encapsulate the generation of cycloids from information within the controls.
*/
export default function useGenerateCycloids(
  cycloidControls: MutableRefObject<CycloidControls>
): GeneratedCycloidData {
  let outerMostBoundingCircle = cycloidControls.current.outerMostBoundingCircle;

  let cycloids = useMemo(() => {
    const cycloids = [];
    const cycloidLength = cycloidControls.current.cycloids.length;

    for (let i = 0; i < cycloidLength; i++) {
      const cycloidParams = cycloidControls.current.cycloids;

      let cycloid = new Cycloid(
        cycloidParams[i].radius,
        cycloidParams[i].rotationDirection,
        //Use this for now, will reassign later
        outerMostBoundingCircle,
        false
      );
      cycloids.push(cycloid);
    }

    return cycloids;
  }, []);

  return {
    generatedCycloids: cycloids,
    outermostBoundingCircle: outerMostBoundingCircle,
  };
}
