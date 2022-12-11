import {
  MutableRefObject,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Cycloid from "../../classes/domain/Cycloid";
import CycloidControls from "../../classes/domain/cycloidControls";
import { Rerender } from "../../contexts/rerenderToggle";
import GeneratedCycloidData from "../../types/generatedCycloidData";
import generateCycloids from "../generateCycloids";

/*
    This hook encapsulate the generation of cycloids from information within the controls.

    It simply wraps the generateCycloids function and calls it on every rerender.
*/
export default function useGenerateCycloids(
  cycloidControls: MutableRefObject<CycloidControls>
): GeneratedCycloidData {
  const outerMostBoundingCircle =
    cycloidControls.current.outermostBoundingCircle;

  const rerender = useContext(Rerender);

  const cycloids = useMemo(() => {
    return generateCycloids(cycloidControls.current);
  }, [rerender]);

  return {
    generatedCycloids: cycloids,
    outermostBoundingCircle: outerMostBoundingCircle,
  };
}
