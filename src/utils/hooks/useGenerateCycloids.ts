import {
  MutableRefObject,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Cycloid from "../../classes/Cycloid";
import CycloidControlsData from "../../classes/CycloidControls";
import { Rerender } from "../../contexts/rerenderToggle";
import GeneratedCycloidData from "../../types/generatedCycloidData";

/*
    This hook encapsulate the generation of cycloids from information within the controls.
*/
export default function useGenerateCycloids(
  cycloidControls: MutableRefObject<CycloidControlsData>
): GeneratedCycloidData {
  const outerMostBoundingCircle =
    cycloidControls.current.outerMostBoundingCircle;

  const rerender = useContext(Rerender);

  const cycloids = useMemo(() => {
    const cycloids: Cycloid[] = [];

    cycloidControls.current.cycloidManager
      .getAllCycloidParams()
      .forEach((c) => {
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
  }, [rerender]);

  return {
    generatedCycloids: cycloids,
    outermostBoundingCircle: outerMostBoundingCircle,
  };
}
