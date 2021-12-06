import guify from "guify";
import { useEffect, useMemo, useRef } from "react";
import CycloidParams from "../../types/cycloidParams";
import { CycloidPosition } from "../../types/cycloidPosition";

import * as dat from "dat.gui";
import { CycloidDirection } from "../../types/cycloidDirection";

const gui = new dat.GUI();

//TODO => remove
export default function useGetControlledCycloidParams(
  clearCanvasToggle: React.Dispatch<React.SetStateAction<boolean>>
) {
  const cycloidParams = useMemo(
    () =>
      ({
        rodLengthScale: 0.5,
        cycloidPosition: "inside",
        boundingCircleRadius: 300,
        rotationDirection: "clockwise",
        cycloidRadius: 100,
        animationSpeedScale: 0.5,
        moveOutSideOfParent: false,
      } as CycloidParams),
    []
  );

  useEffect(() => {
    gui
      .add(cycloidParams, "animationSpeed", 0, 3, 0.001)
      .onChange((newSpeed: number) => {
        cycloidParams.animationSpeedScale = newSpeed;
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
        cycloidParams.animationSpeedScale = ratio;
        clearCanvasToggle((toggle) => !toggle);
      });

    const cycloidFolder = gui.addFolder("Cycloid Properties");

    cycloidFolder
      .add(cycloidParams, "cycloidDirection", ["clockwise", "counterclockwise"])
      .onChange((newDirection: CycloidDirection) => {
        cycloidParams.rotationDirection = newDirection;
        clearCanvasToggle((toggle) => !toggle);
      });

    cycloidFolder
      .add(cycloidParams, "cycloidRadius", 0, 600, 0.5)
      .onChange((newRadius: number) => {
        cycloidParams.cycloidRadius = newRadius;

        clearCanvasToggle((toggle) => !toggle);
      });
  }, []);

  return cycloidParams;
}
