import { useRef, useState } from "react";
import { Vector2 } from "./classes/vector2";
import "./index.css";
import BackgroundParticles from "./pages/BackgroundParticles";
import Landing from "./pages/Landing";
import Main from "./pages/Main";
import { NaivgationStage } from "./types/Stage";
import useSetupInstantCycloidDrawer from "./utils/InstantCycloidDrawer/useSetupInstantCycloidDrawer";

/// Switch between main and landing with custom animation.
function App() {
  const [stage, setStage] = useState<NaivgationStage>("landing");

  /**
   * Points used for instant draw.
   */
  // const { pointsRef, worker: instantDrawerWorker } =
  //   useSetupInstantCycloidDrawer({
  //     dependencyList: [],
  //   });

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
          <Main />
        )}
      </section>
    </div>
  );
}

export default App;
