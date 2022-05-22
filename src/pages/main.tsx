import React, { useCallback, useRef, useState } from "react";
import CycloidControls from "../classes/cycloidControls";
import AnimatedCanvas from "../components/main/Canvas/Animated";
import InstantCanvas from "../components/main/Canvas/Instant";
import ControlsOrRelationshipEditor from "../components/main/ControlsOrRelationshipEditor";
import { Rerender, RerenderToggle } from "../contexts/rerenderToggle";
import "../index.css";

function Main({
  cycloidControls,
}: {
  cycloidControls: React.MutableRefObject<CycloidControls>;
}) {
  const [rerender, setRerender] = useState(false);

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
                {cycloidControls.current.mode === "Instant" ||
                cycloidControls.current.mode === "AnimatedInstant" ? (
                  <InstantCanvas
                    parent={allCanvasContainer}
                    cycloidControls={cycloidControls}
                    pointsAmount={400}
                  />
                ) : (
                  <AnimatedCanvas
                    cycloidControls={cycloidControls}
                    parent={allCanvasContainer}
                    parentWrapper={canvasContainerFlexWrapper}
                  />
                )}
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

    let animateSpeed = cycloidControls.current.globalTimeStep;
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
        cycloidControls.current.globalTimeStep = animateSpeed;
        requestAnimationFrame(slowDown);
      } else {
        cycloidControls.current.globalTimeStep = 0;
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
        cycloidControls.current.globalTimeStep = parseFloat(
          animateSpeed.toFixed(1)
        );
        rerender();
        requestAnimationFrame(speedUp);
      } else {
        cycloidControls.current.globalTimeStep = originalSpeedRef.current!;
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
