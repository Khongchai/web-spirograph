import guify from "guify";
import { useEffect, useMemo, useRef } from "react";
import CycloidParams from "./types/cycloidParams";
import { CycloidPosition } from "./types/cycloidPosition";

import * as dat from "dat.gui";

const gui = new dat.GUI();

export default function useGetControlledCycloidParams(
  clearCanvasToggle: React.Dispatch<React.SetStateAction<boolean>>
) {
  const cycloidParams = useMemo(
    () =>
      ({
        animationSpeed: 0.7,
        rodLengthScale: 2,
        cycloidPosition: "inside",
      } as CycloidParams),
    []
  );

  useEffect(() => {
    gui
      .add(cycloidParams, "animationSpeed", 0, 3, 0.001)
      .onChange((newSpeed: number) => {
        cycloidParams.animationSpeed = newSpeed;
      });

    gui
      .add(cycloidParams, "rodLengthScale", -10, 10, 0.1)
      .onChange((scalar: number) => {
        cycloidParams.rodLengthScale = scalar;
        clearCanvasToggle((toggle) => !toggle);
      });

    const cycloidFolder = gui.addFolder("Cycloid Properties");
    cycloidFolder
      .add(cycloidParams, "cycloidPosition", ["inside", "outside"])
      .onChange((newPos: CycloidPosition) => {
        cycloidParams.cycloidPosition = newPos;
        clearCanvasToggle((toggle) => !toggle);
      });
  }, []);

  return cycloidParams;
}
