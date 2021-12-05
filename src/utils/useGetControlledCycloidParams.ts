import guify from "guify";
import { useEffect, useMemo, useRef } from "react";
import CycloidParams from "../types/cycloidParams";
import { CycloidPosition } from "../types/cycloidPosition";

import * as dat from "dat.gui";
import { CycloidDirection } from "../types/cycloidDirection";

const gui = new dat.GUI();

export default function useGetControlledCycloidParams(
  clearCanvasToggle: React.Dispatch<React.SetStateAction<boolean>>
) {
  const cycloidParams = useMemo(
    () =>
      ({
        animationSpeed: 0.7,
        rodLengthScale: 0.5,
        cycloidPosition: "inside",
        boundingCircleRadius: 300,
        cycloidDirection: "clockwise",
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
      .add(cycloidParams, "cycloidDirection", ["clockwise", "counterclockwise"])
      .onChange((newDirection: CycloidDirection) => {
        cycloidParams.cycloidDirection = newDirection;
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
