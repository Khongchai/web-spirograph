import { useEffect, useRef, useState } from "react";
import BoundingCircle from "./classes/BoundingCircle";
import CycloidControls from "./classes/cycloidControls";
import colors from "./constants/colors";
import "./index.css";
import BackgroundParticles from "./pages/BackgroundParticles";
import Landing from "./pages/Landing";
import Main from "./pages/Main";
import { NaivgationStage } from "./types/Stage";
import useSetupInstantCycloidDrawer from "./utils/InstantCycloidDrawer/useSetupInstantCycloidDrawer";

/// Switch between main and landing with custom animation.
function App() {
  const [stage, setStage] = useState<NaivgationStage>("landing");

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
        // {
        //   rodLengthScale: 0.8,
        //   rotationDirection: "counterclockwise",
        //   radius: 50,
        //   animationSpeedScale: 0.5,
        //   moveOutSideOfParent: false,
        //   boundingColor: colors.purple.light,
        // },
      ],
      animationSpeed: 1,
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

  /**
   * Points used for instant draw.
   */
  const { pointsRef, worker: instantDrawerWorker } =
    useSetupInstantCycloidDrawer({
      cycloidControls: cycloidControls,
      dependencyList: [],
    });

  useEffect(() => {
    //TODO make this work.
    instantDrawerWorker?.postMessage("Hello world");
  }, [instantDrawerWorker]);

  function changeNavigationStage() {
    setStage((curStage) => {
      return curStage === "landing" ? "main" : "landing";
    });
  }

  return (
    <div className="w-full h-full">
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
