import { useState, useRef } from "react";
import Canvas from "./components/Canvas";
import Controls from "./components/Controls";
import "./index.css";
import CycloidControls from "./types/cycloidControls";
import CycloidsParams from "./types/cycloidControls";
import CycloidParams from "./types/cycloidParams";
import useGetControlledCycloidParams from "./utils/hooks/useGetControlledCycloidParams";

function App() {
  const [clearCanvasToggle, setClearCanvasToggle] = useState(false);

  const cycloidControls = useRef<CycloidControls>({
    cycloids: [
      //Mock data
      {
        rodLengthScale: 0.8,
        boundingCircleRadius: 300,
        rotationDirection: "clockwise",
        cycloidRadius: 100,
        animationSpeedScale: 0.5,
        moveOutSideOfParent: true,
      },
      {
        rodLengthScale: 0.5,
        boundingCircleRadius: 300,
        rotationDirection: "clockwise",
        cycloidRadius: 200,
        animationSpeedScale: 0.5,
        moveOutSideOfParent: true,
      },
    ],
    animationSpeed: 1,
    currentCycloid: 0,
    mode: "Animated",
    nestedLevel: 1,
    scaffold: "Show",
  });

  const allCanvasContainer = useRef<null | HTMLElement>(null);

  return (
    <div className="bg-purple-dark text-purple-light h-full w-full">
      <div className="w-full h-full relative flex">
        <div style={{ flex: 0.6 }} ref={allCanvasContainer as any}>
          <Canvas
            clearCanvasToggle={clearCanvasToggle}
            cycloidControls={cycloidControls}
            parent={allCanvasContainer}
          />
        </div>
        <div style={{ flex: 0.4 }}>
          <Controls cycloidControls={cycloidControls} />
        </div>
      </div>
    </div>
  );
}

export default App;
