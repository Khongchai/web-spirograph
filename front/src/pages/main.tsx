import React, {
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { ConfigurationsRepository } from "../classes/data/repository/configurationsRepository";
import CycloidControls from "../classes/domain/cycloidControls";
import { Vector2 } from "../classes/DTOInterfaces/vector2";
import AnimatedCanvas from "../components/main/Canvas/Animated";
import InstantCanvas from "../components/main/Canvas/Instant";
import ControlsOrRelationshipEditor from "../components/main/ControlsOrRelationshipEditor";
import ResizeBar from "../components/main/ResizeBar";
import { RerenderToggle } from "../contexts/rerenderToggle";
import "../index.css";
import { RerenderReason } from "../types/contexts/rerenderReasons";
import useMeHooks from "../utils/hooks/useMeHooks";
import { Throttler } from "../utils/throttler";

function Main() {
  const { done: meHookDone } = useMeHooks();

  const rerender = useContext(RerenderToggle);

  const allCanvasContainer = useRef<null | HTMLElement>(null);
  const canvasContainerFlexWrapper = useRef<null | HTMLElement>(null);
  const controlFlexWrapper = useRef<null | HTMLElement>(null);

  // Huge mistake to be separating bounding circle from everything else....may require a huge refactor later on.
  /**
   * To be referenced by anything that would like to read from or write to the draw data.
   */
  const cycloidControls = useRef<CycloidControls>();
  useEffect(() => {
    if (meHookDone) {
      loadCycloidControls();
    }
  }, [meHookDone]);
  async function loadCycloidControls() {
    const savedValue = await ConfigurationsRepository.getSavedConfigurations();
    cycloidControls.current = savedValue.controls[0];
    rerender(RerenderReason.appStart);
  }

  const { handleOnControlsToggle, handleOnRelationshipEditorToggle } =
    useAnimateMenuToggling(cycloidControls, () => {
      rerender(RerenderReason.switchMenu);
    });

  if (!cycloidControls.current) {
    return (
      <>
        <div className="grid place-items-center text-white">
          <p>Please wait a moment, your data is loading.</p>
          <p>TODO: cycloid-like-spinner</p>
        </div>
      </>
    );
  }

  return (
    <div className="text-purple-light h-full w-full">
      <div className="w-full h-full relative flex md:flex-row sm:flex-col">
        <div
          style={{ flex: 0.7 }}
          className="relative canvas-container-flex-wrapper"
          ref={canvasContainerFlexWrapper as any}
        >
          <div
            ref={allCanvasContainer as any}
            className="w-full h-full absolute canvas-container"
          >
            {cycloidControls.current!.mode === "Instant" ||
            cycloidControls.current!.mode === "AnimatedInstant" ? (
              <InstantCanvas
                parent={allCanvasContainer}
                cycloidControls={
                  cycloidControls as MutableRefObject<CycloidControls>
                }
                pointsAmount={6000}
              />
            ) : (
              <AnimatedCanvas
                cycloidControls={
                  cycloidControls as MutableRefObject<CycloidControls>
                }
                parent={allCanvasContainer}
                parentWrapper={canvasContainerFlexWrapper}
              />
            )}
          </div>
        </div>
        <MainWindowResizeBar
          leftComponent={canvasContainerFlexWrapper}
          rightComponent={controlFlexWrapper}
        />
        <div
          className="control-flex-wrapper"
          style={{
            padding: "75px 0 20px 0",
            overflow: "auto",
            flex: 0.3,
          }}
          ref={controlFlexWrapper as any}
        >
          <ControlsOrRelationshipEditor
            onRelationshipEditorToggle={handleOnRelationshipEditorToggle}
            onControlsToggle={handleOnControlsToggle}
            cycloidControls={
              cycloidControls as MutableRefObject<CycloidControls>
            }
          />
        </div>
      </div>
    </div>
  );
}

function MainWindowResizeBar({
  leftComponent,
  rightComponent,
}: {
  leftComponent: MutableRefObject<HTMLElement | null>;
  rightComponent: MutableRefObject<HTMLElement | null>;
}) {
  useEffect(() => {
    const throttler = new Throttler();

    const obj = new ResizeObserver(() => {
      // Throttle to prevent flashing.
      throttler.throttle(() => {
        window.dispatchEvent(new Event("resize"));
      }, 100);
    });

    // Can observe either left or right component.
    obj.observe(leftComponent.current!);

    return () => obj.disconnect();
  }, []);

  const onResizeBarDragged = useCallback((e: Vector2) => {
    const left = e.x;
    const right = 1 - e.x;
    try {
      //@ts-ignore
      leftComponent.current?.attributeStyleMap.set("flex-grow", left);
      //@ts-ignore
      rightComponent.current?.attributeStyleMap.set("flex-grow", right);
    } catch (_) {}
  }, []);

  return <ResizeBar onResizeBarDragged={onResizeBarDragged} />;
}

export default Main;

function useAnimateMenuToggling(
  cycloidControls: React.MutableRefObject<CycloidControls | undefined>,
  rerender: () => void
): {
  handleOnControlsToggle: VoidFunction;
  handleOnRelationshipEditorToggle: VoidFunction;
} {
  const originalSpeedRef = useRef<number | undefined>(undefined);
  const originalShowCycloid = useRef<boolean | undefined>(undefined);

  const handleOnRelationshipEditorToggle = useCallback(() => {
    cycloidControls.current!.scaffold = "Showing";

    let animateSpeed = cycloidControls.current!.globalTimeStepScale;
    let change = animateSpeed * 0.05;

    // Set the animation speed that we can later revert to.
    originalSpeedRef.current = animateSpeed;
    originalShowCycloid.current = cycloidControls.current!.showAllCycloids;

    cycloidControls.current!.showAllCycloids = true;
    cycloidControls.current!.programOnly.tracePath = false;

    rerender();

    function slowDown() {
      animateSpeed -= change;
      if (animateSpeed > 0) {
        cycloidControls.current!.globalTimeStepScale = animateSpeed;
        requestAnimationFrame(slowDown);
      } else {
        cycloidControls.current!.globalTimeStepScale = 0;
        rerender();
      }
    }

    slowDown();
  }, []);

  const handleOnControlsToggle = useCallback(() => {
    cycloidControls.current!.scaffold = "Showing";

    /**
     * This toggle is guaranteed to be toggled after the other one.
     * So no worries about any of them being undefined.
     */

    let animateSpeed = 0;
    let change = originalSpeedRef.current! * 0.05;

    cycloidControls.current!.showAllCycloids = originalShowCycloid.current!;
    cycloidControls.current!.programOnly.tracePath = true;

    function speedUp() {
      animateSpeed += change;
      if (animateSpeed < originalSpeedRef.current!) {
        cycloidControls.current!.globalTimeStepScale = parseFloat(
          animateSpeed.toFixed(1)
        );
        rerender();
        requestAnimationFrame(speedUp);
      } else {
        cycloidControls.current!.globalTimeStepScale =
          originalSpeedRef.current!;
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
