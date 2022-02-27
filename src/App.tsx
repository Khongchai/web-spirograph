import { useCallback, useRef, useState } from "react";
import BoundingCircle from "./classes/BoundingCircle";
import Canvas from "./components/Canvas";
import ControlsOrRelationshipEditor from "./components/ControlsOrRelationshipEditor";
import "./index.css";
import CycloidControlsData from "./types/cycloidControls";

function App() {
  const [clearCanvasToggle, setClearCanvasToggle] = useState(false);

  // Huge mistake to be separating bounding circle from everything else....may require a huge refactor later on.
  const cycloidControls = useRef<CycloidControlsData>({
    outerMostBoundingCircle: new BoundingCircle(
      {
        x: 0,
        y: 0,
      },
      300
    ),
    cycloids: [
      {
        rodLengthScale: 0.8,
        rotationDirection: "clockwise",
        radius: 100,
        animationSpeedScale: 0.5,
        moveOutSideOfParent: false,
        boundingCircleIndex: -1,
      },
      {
        rodLengthScale: 0.5,
        rotationDirection: "clockwise",
        radius: 150,
        animationSpeedScale: 0.7,
        moveOutSideOfParent: false,
        boundingCircleIndex: -1,
      },
      {
        rodLengthScale: 0.5,
        rotationDirection: "clockwise",
        radius: 10,
        animationSpeedScale: 0.3,
        moveOutSideOfParent: true,
        boundingCircleIndex: 1,
      },
      {
        rodLengthScale: 0.5,
        rotationDirection: "clockwise",
        radius: 10,
        animationSpeedScale: 0.3,
        moveOutSideOfParent: true,
        boundingCircleIndex: 2,
      },
    ],
    animationSpeed: 1,
    currentCycloid: 0,
    mode: "Animated",
    scaffold: "Showing",
    animationState: "Playing",
    clearTracedPathOnParamsChange: true,
    showAllCycloids: false,
  });

  const handleClearCanvasToggle = useCallback(() => {
    setClearCanvasToggle((toggle) => !toggle);
  }, []);

  const allCanvasContainer = useRef<null | HTMLElement>(null);
  const canvasContainerFlexWrapper = useRef<null | HTMLElement>(null);

  return (
    <div className="bg-purple-dark text-purple-light h-full w-full">
      <div className="w-full h-full relative flex md:flex-row sm:flex-col">
        <div
          style={{ flex: 0.6 }}
          className="relative canvas-container-flex-wrapper"
          ref={canvasContainerFlexWrapper as any}
        >
          <div
            ref={allCanvasContainer as any}
            className="w-full h-full absolute canvas-container"
          >
            <Canvas
              clearCanvasToggle={clearCanvasToggle}
              cycloidControls={cycloidControls}
              parent={allCanvasContainer}
              parentWrapper={canvasContainerFlexWrapper}
            />
          </div>
        </div>
        <div
          style={{
            padding: "75px 75px 20px 75px",
            overflow: "auto",
            flex: 0.4,
          }}
        >
          <ControlsOrRelationshipEditor
            clearCanvasToggle={handleClearCanvasToggle}
            cycloidControls={cycloidControls}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
