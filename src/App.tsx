import { useState } from "react";
import "./index.css";
import BackgroundParticles from "./pages/BackgroundParticles";
import Landing from "./pages/Landing";
import Main from "./pages/Main";
import { NaivgationStage } from "./types/Stage";

/// Switch between main and landing with custom animation.
function App() {
  const [stage, setStage] = useState<NaivgationStage>("landing");

  function changeNavigationStage() {
    setStage((curStage) => {
      return curStage === "landing" ? "main" : "landing";
    });
  }

  //TODO if stage = "main" then move to <Main />
  return (
    <div className="w-full h-full">
      <section className="absolute w-full h-full">
        <BackgroundParticles stage={stage} />
      </section>
      <section className="absolute w-full h-full">
        <Landing onBeginClicked={changeNavigationStage} />;{/* <Main /> */}
      </section>
    </div>
  );
}

export default App;
