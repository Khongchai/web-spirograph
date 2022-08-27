import { useRef, useState } from "react";
import BoundingCircle from "./classes/domain/BoundingCircle";
import CycloidControls from "./classes/domain/cycloidControls";
import colors from "./constants/colors";
import "./index.css";
import BackgroundParticles from "./pages/BackgroundParticles";
import Landing from "./pages/Landing";
import Main from "./pages/main";
import { NaivgationStage } from "./types/Stage";

/// Switch between main and landing with custom animation.
function App() {
  const [stage, setStage] = useState<NaivgationStage>("landing");

  // Huge mistake to be separating bounding circle from everything else....may require a huge refactor later on.

  /**
   * To be referenced by anything that would like to read from or write to the draw data.
   */
  const cycloidControls = useRef<CycloidControls>(
    new CycloidControls({
      outermostBoundingCircle: new BoundingCircle(
        {
          x: 0,
          y: 0,
        },
        400,
        colors.purple.light
      ),
      cycloids: [
        {
          rodLengthScale: 0.5,
          rotationDirection: "counterclockwise",
          radius: 120,
          animationSpeedScale: 0.69,
          moveOutSideOfParent: true,
          boundingColor: colors.purple.light,
        },
        {
          rodLengthScale: 0.8,
          rotationDirection: "counterclockwise",
          radius: 100,
          animationSpeedScale: 1,
          moveOutSideOfParent: true,
          boundingColor: colors.purple.light,
        },
        {
          rodLengthScale: 0.86,
          rotationDirection: "clockwise",
          radius: 123.51,
          animationSpeedScale: 1,
          moveOutSideOfParent: true,
          boundingColor: colors.purple.light,
        },
      ],
      globalTimeStepScale: 1,
      currentCycloidId: 2,
      mode: "Animated",
      scaffold: "Showing",
      animationState: "Playing",
      clearTracedPathOnParamsChange: true,
      traceAllCycloids: false,
      showAllCycloids: false,
      programOnly: {
        tracePath: true,
      },
    })
  );

  function changeNavigationStage() {
    setStage((curStage) => {
      return curStage === "landing" ? "main" : "landing";
    });
  }

  return (
    <div className="w-full h-full overflow-x-hidden">
      <section className="absolute w-full h-full">
        <BackgroundParticles stage={stage} />
      </section>
      <section className="absolute w-full h-full">
        {stage === "landing" ? (
          <Landing onBeginClicked={changeNavigationStage} />
        ) : (
          //TODO => animation or something.
          <Main cycloidControls={cycloidControls} />
        )}
      </section>
    </div>
  );
}

export default App;
