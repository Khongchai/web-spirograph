import React, { useCallback, useRef, useState } from "react";
import BoundingCircle from "../classes/BoundingCircle";
import CycloidControls from "../classes/cycloidControls";
import Canvas from "../components/main/Canvas";
import ControlsOrRelationshipEditor from "../components/main/ControlsOrRelationshipEditor";
import colors from "../constants/colors";
import { Rerender, RerenderToggle } from "../contexts/rerenderToggle";
import "../index.css";

const defaultGlobalAnimationSpeed = 1;
function Main() {
  const [rerender, setRerender] = useState(false);

  // Huge mistake to be separating bounding circle from everything else....may require a huge refactor later on.

  /**
   * To be referenced by anything that would like to read from or write to the draw data.
   */
  const cycloidControls = useRef<CycloidControls>(
    new CycloidControls({
      outerMostBoundingCircle: new BoundingCircle(
        {
          x: 0,
          y: 0,
        },
        240,
        colors.purple.light
      ),
      cycloids: [
        {
          rodLengthScale: 0.5,
          rotationDirection: "clockwise",
          radius: 140,
          animationSpeedScale: 0.4,
          moveOutSideOfParent: false,
          boundingColor: colors.purple.light,
        },
        {
          rodLengthScale: 0.8,
          rotationDirection: "counterclockwise",
          radius: 50,
          animationSpeedScale: 0.5,
          moveOutSideOfParent: false,
          boundingColor: colors.purple.light,
        },
        {
          rodLengthScale: 1.2,
          rotationDirection: "clockwise",
          radius: 20,
          animationSpeedScale: 0.1,
          moveOutSideOfParent: false,
          boundingColor: colors.purple.light,
        },
        {
          rodLengthScale: 1.2,
          rotationDirection: "counterclockwise",
          radius: 60,
          animationSpeedScale: 0.3,
          moveOutSideOfParent: true,
          boundingColor: colors.purple.light,
        },
        {
          rodLengthScale: 2,
          rotationDirection: "clockwise",
          radius: 30,
          animationSpeedScale: 0.7,
          moveOutSideOfParent: true,
          boundingColor: colors.purple.light,
        },
      ],
      animationSpeed: defaultGlobalAnimationSpeed,
      currentCycloidId: 0,
      mode: "Animated",
      scaffold: "Showing",
      animationState: "Playing",
      clearTracedPathOnParamsChange: true,
      showAllCycloids: false,
      programOnly: {
        tracePath: true,
      },
    })
  );

  const handleClearCanvasToggle = useCallback(() => {
    setRerender((toggle) => !toggle);
  }, []);

  const allCanvasContainer = useRef<null | HTMLElement>(null);
  const canvasContainerFlexWrapper = useRef<null | HTMLElement>(null);

  const { handleOnControlsToggle, handleOnRelationshipEditorToggle } =
    useAnimateMenuToggling(cycloidControls, () => {
      handleClearCanvasToggle();
    });

  return (
    <Rerender.Provider value={rerender}>
      <RerenderToggle.Provider value={handleClearCanvasToggle}>
        <div className="text-purple-light h-full w-full">
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
                cycloidControls={cycloidControls}
              />
            </div>
          </div>
        </div>
      </RerenderToggle.Provider>
    </Rerender.Provider>
  );
}

export default Main;

function useAnimateMenuToggling(
  cycloidControls: React.MutableRefObject<CycloidControls>,
  rerender: () => void
) {
  const originalSpeedRef = useRef<number | undefined>(undefined);
  const originalShowCycloid = useRef<boolean | undefined>(undefined);

  const handleOnRelationshipEditorToggle = useCallback(() => {
    cycloidControls.current.scaffold = "Showing";

    let animateSpeed = cycloidControls.current.animationSpeed;
    let change = animateSpeed * 0.05;

    // Set the animation speed that we can later revert to.
    originalSpeedRef.current = animateSpeed;
    originalShowCycloid.current = cycloidControls.current.showAllCycloids;

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
    cycloidControls.current.scaffold = "Showing";

    /**
     * This toggle is guaranteed to be toggled after the other one.
     * So no worries about any of them being undefined.
     */

    let animateSpeed = 0;
    let change = originalSpeedRef.current! * 0.05;

    cycloidControls.current.showAllCycloids = originalShowCycloid.current!;
    cycloidControls.current.programOnly.tracePath = true;

    function speedUp() {
      animateSpeed += change;
      if (animateSpeed < originalSpeedRef.current!) {
        cycloidControls.current.animationSpeed = parseFloat(
          animateSpeed.toFixed(1)
        );
        rerender();
        requestAnimationFrame(speedUp);
      } else {
        cycloidControls.current.animationSpeed = originalSpeedRef.current!;
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
