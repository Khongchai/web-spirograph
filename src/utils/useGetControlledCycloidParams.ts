import guify from "guify";
import { useEffect, useMemo, useRef } from "react";
import CycloidParams from "./types/cycloidParams";
import { CycloidRotationDirection } from "./types/cycloidPosition";

import * as dat from "dat.gui";

const gui = new dat.GUI();

export default function useGetControlledCycloidParams(
  clearCanvasToggle: React.Dispatch<React.SetStateAction<boolean>>
) {
  const cycloidParams = useMemo(
    () =>
      ({
        animationSpeed: 0.7,
        rodLengthScale: 0.5,
        cycloidRotationDirection: "clockwise",
        boundingCircleRadius: 300,
        cycloidRadius: 200,
        cycloidSpeedRatio: 0.5,
      } as CycloidParams),
    []
  );

  useEffect(() => {
    gui
      .add(cycloidParams, "animationSpeed", 0, 3, 0.001)
      .onChange((newSpeed: number) => {
        cycloidParams.animationSpeed = newSpeed;
      });

    const rodFolder = gui.addFolder("Rod Properties");

    rodFolder
      .add(cycloidParams, "rodLengthScale", -10, 10, 0.1)
      .onChange((scalar: number) => {
        cycloidParams.rodLengthScale = scalar;
        clearCanvasToggle((toggle) => !toggle);
      });
    rodFolder
      .add(cycloidParams, "cycloidSpeedRatio", 0, 5, 0.1)
      .onChange((ratio: number) => {
        cycloidParams.cycloidSpeedRatio = ratio;
        clearCanvasToggle((toggle) => !toggle);
      });

    const cycloidFolder = gui.addFolder("Cycloid Properties");
    cycloidFolder
      .add(cycloidParams, "cycloidRotationDirection", [
        "clockwise (inside)",
        "counterClockwise (outside)",
      ])
      .onChange((newPos: CycloidRotationDirection) => {
        cycloidParams.cycloidRotationDirection = newPos.split(
          " "
        )[0] as CycloidRotationDirection;
        clearCanvasToggle((toggle) => !toggle);
      });

    cycloidFolder
      .add(cycloidParams, "cycloidRadius", 0, 1000, 0.5)
      .onChange((newRadius: number) => {
        cycloidParams.cycloidRadius = newRadius;
        clearCanvasToggle((toggle) => !toggle);
      });

    cycloidFolder
      .add(cycloidParams, "boundingCircleRadius", 0, 1000, 0.5)
      .onChange((newRadius: number) => {
        cycloidParams.boundingCircleRadius = newRadius;
        clearCanvasToggle((toggle) => !toggle);
      });
  }, []);

  return cycloidParams;
}
