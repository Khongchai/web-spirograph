import { MutableRefObject, useMemo } from "react";
import BoundingCircle from "../../classes/BoundingCircle";
import Cycloid from "../../classes/Cycloid";
import CycloidControls from "../../types/cycloidControls";
import GeneratedCycloidData from "../../types/generatedCycloidData";

/*
    This hook encapsulate the generation of cycloids from information within the controls.

    Cycloids' parents are also determined here.
*/
export default function useGenerateCycloids(
  cycloidControls: MutableRefObject<CycloidControls>
): GeneratedCycloidData {
  let outerMostBoundingCircle = useMemo(
    () =>
      new BoundingCircle(
        {
          x: 0,
          y: 0,
        },
        300
      ),
    []
  );

  let cycloids = useMemo(() => {
    let cycloids = [];
    for (let i = 0; i < cycloidControls.current.cycloids.length; i++) {
      let cycloid = new Cycloid(
        cycloidControls.current.cycloids[i].cycloidRadius,
        cycloidControls.current.cycloids[i].rotationDirection,
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
