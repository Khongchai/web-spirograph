import { useCallback, useRef, useState } from "react";
import BoundingCircle from "./classes/BoundingCircle";
import Canvas from "./components/Canvas";
import ControlsOrRelationshipEditor from "./components/ControlsOrRelationshipEditor";
import "./index.css";
import CycloidControlsData from "./types/cycloidControls";

const defaultGlobalAnimationSpeed = 1;
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
        boundingCircleIndex: -1,
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
    animationSpeed: defaultGlobalAnimationSpeed,
    currentCycloid: 0,
    mode: "Animated",
    scaffold: "Showing",
    animationState: "Playing",
    clearTracedPathOnParamsChange: true,
    showAllCycloids: false,
    tracePath: true,
  });

  const handleClearCanvasToggle = useCallback(() => {
    setClearCanvasToggle((toggle) => !toggle);
  }, []);

  // TODO refactor into a slowdown / speedup hook with the function being passed to the requestAnimationFrame saved in a ref
  // TODO so that we can cancelAnimationFrame with the correct callback.

  // TODO also needs to disable drawing
  const handleOnRelationshipEditorToggle = useCallback(() => {
    let animSpeed = cycloidControls.current.animationSpeed;
    let change = animSpeed * 0.05;

    cycloidControls.current.showAllCycloids = true;
    cycloidControls.current.tracePath = false;
    handleClearCanvasToggle();
    function slowDown() {
      animSpeed -= change;
      if (animSpeed > 0) {
        cycloidControls.current.animationSpeed = animSpeed;
        requestAnimationFrame(slowDown);
      } else {
        cycloidControls.current.animationSpeed = 0;
      }
    }
    slowDown();
  }, []);

  const handleOnControlsToggle = useCallback(() => {
    let animSpeed = defaultGlobalAnimationSpeed;
    let change = animSpeed * 0.05;

    cycloidControls.current.showAllCycloids = false;
    cycloidControls.current.tracePath = true;
    handleClearCanvasToggle();
    function speedUp() {
      animSpeed += change;
      if (animSpeed < 1) {
        cycloidControls.current.animationSpeed = animSpeed;
        requestAnimationFrame(speedUp);
      } else {
        //TODO needs to return to the original speed
        cycloidControls.current.animationSpeed = 1;
      }
    }
    speedUp();
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
            onRelationshipEditorToggle={handleOnRelationshipEditorToggle}
            onControlsToggle={handleOnControlsToggle}
            clearCanvasToggle={handleClearCanvasToggle}
            cycloidControls={cycloidControls}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
