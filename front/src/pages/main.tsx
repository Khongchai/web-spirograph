import React, { useCallback, useContext, useRef } from "react";
import CycloidControls from "../classes/domain/cycloidControls";
import AnimatedCanvas from "../components/main/Canvas/Animated";
import InstantCanvas from "../components/main/Canvas/Instant";
import ControlsOrRelationshipEditor from "../components/main/ControlsOrRelationshipEditor";
import { Rerender, RerenderToggle } from "../contexts/rerenderToggle";
import "../index.css";
import { RerenderReason } from "../types/contexts/rerenderReasons";
import useMeHooks from "../utils/hooks/useMeHooks";

function Main({
  cycloidControls,
}: {
  cycloidControls: React.MutableRefObject<CycloidControls>;
}) {
  const { done: _ } = useMeHooks();

  const rerender = useContext(RerenderToggle);

  const allCanvasContainer = useRef<null | HTMLElement>(null);
  const canvasContainerFlexWrapper = useRef<null | HTMLElement>(null);

  const { handleOnControlsToggle, handleOnRelationshipEditorToggle } =
    useAnimateMenuToggling(cycloidControls, () => {
      rerender(RerenderReason.switchMenu);
    });

  return (
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
                pointsAmount={6000}
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

    let animateSpeed = cycloidControls.current.globalTimeStepScale;
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
        cycloidControls.current.globalTimeStepScale = animateSpeed;
        requestAnimationFrame(slowDown);
      } else {
        cycloidControls.current.globalTimeStepScale = 0;
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
        cycloidControls.current.globalTimeStepScale = parseFloat(
          animateSpeed.toFixed(1)
        );
        rerender();
        requestAnimationFrame(speedUp);
      } else {
        cycloidControls.current.globalTimeStepScale = originalSpeedRef.current!;
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
