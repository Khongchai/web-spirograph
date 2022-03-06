import React, { useCallback, useRef, useState } from "react";
import BoundingCircle from "./classes/BoundingCircle";
import Canvas from "./components/Canvas";
import ControlsOrRelationshipEditor from "./components/ControlsOrRelationshipEditor";
import colors from "./constants/colors";
import "./index.css";
import CycloidControlsData from "./types/cycloidControls";

const defaultGlobalAnimationSpeed = 1;
function App() {
  const [clearCanvasToggle, setClearCanvasToggle] = useState(false);

  // Huge mistake to be separating bounding circle from everything else....may require a huge refactor later on.

  /**
   * To be referenced by anything that would like to read from or write to the draw data.
   */
  const cycloidControls = useRef<CycloidControlsData>({
    outerMostBoundingCircle: new BoundingCircle(
      {
        x: 0,
        y: 0,
      },
      300,
      colors.purple.light
    ),
    cycloids: [
      {
        rodLengthScale: 0.8,
        rotationDirection: "clockwise",
        radius: 100,
        animationSpeedScale: 0.5,
        moveOutSideOfParent: false,
        boundingCircleIndex: -1,
        boundingColor: colors.purple.light,
      },
      {
        rodLengthScale: 0.5,
        rotationDirection: "clockwise",
        radius: 150,
        animationSpeedScale: 0.7,
        moveOutSideOfParent: false,
        boundingCircleIndex: -1,
        boundingColor: colors.purple.light,
      },
      {
        rodLengthScale: 0.5,
        rotationDirection: "clockwise",
        radius: 10,
        animationSpeedScale: 0.3,
        moveOutSideOfParent: true,
        boundingCircleIndex: -1,
        boundingColor: colors.purple.light,
      },
      {
        rodLengthScale: 0.5,
        rotationDirection: "clockwise",
        radius: 10,
        animationSpeedScale: 0.3,
        moveOutSideOfParent: true,
        boundingCircleIndex: 2,
        boundingColor: colors.purple.light,
      },
    ],
    animationSpeed: defaultGlobalAnimationSpeed,
    currentCycloid: 0,
    mode: "Animated",
    scaffold: "Showing",
    animationState: "Playing",
    clearTracedPathOnParamsChange: true,
    showAllCycloids: false,
    programOnly: {
      tracePath: true,
    },
  });

  const handleClearCanvasToggle = useCallback(() => {
    setClearCanvasToggle((toggle) => !toggle);
  }, []);

  const allCanvasContainer = useRef<null | HTMLElement>(null);
  const canvasContainerFlexWrapper = useRef<null | HTMLElement>(null);

  const { handleOnControlsToggle, handleOnRelationshipEditorToggle } =
    useMenuToggle(cycloidControls, () => {
      handleClearCanvasToggle();
    });

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

function useMenuToggle(
  cycloidControls: React.MutableRefObject<CycloidControlsData>,
  rerender: () => void
) {
  const originalSpeedRef = useRef(cycloidControls.current.animationSpeed);

  const handleOnRelationshipEditorToggle = useCallback(() => {
    let animateSpeed = cycloidControls.current.animationSpeed;
    // Set the animation speed that we can later revert to.
    originalSpeedRef.current = animateSpeed;
    let change = animateSpeed * 0.05;

    cycloidControls.current.showAllCycloids = true;
    cycloidControls.current.programOnly.tracePath = false;

    rerender();

    function slowDown() {
      animateSpeed -= change;
      if (animateSpeed > 0) {
        cycloidControls.current.animationSpeed = animateSpeed;
        requestAnimationFrame(slowDown);
      } else {
        cycloidControls.current.animationSpeed = 0;
        rerender();
      }
    }

    slowDown();
  }, []);

  const handleOnControlsToggle = useCallback(() => {
    let animateSpeed = 0;
    let change = originalSpeedRef.current * 0.05;

    cycloidControls.current.showAllCycloids = false;
    cycloidControls.current.programOnly.tracePath = true;

    function speedUp() {
      animateSpeed += change;
      if (animateSpeed < originalSpeedRef.current) {
        cycloidControls.current.animationSpeed = parseFloat(
          animateSpeed.toFixed(1)
        );
        rerender();
        requestAnimationFrame(speedUp);
      } else {
        cycloidControls.current.animationSpeed = originalSpeedRef.current;
        rerender();
      }
    }

    speedUp();
  }, []);

  return {
    handleOnControlsToggle,
    handleOnRelationshipEditorToggle,
  };
}
