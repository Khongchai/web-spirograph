import { useCallback, useState } from "react";
import { User } from "./classes/domain/userData/User";
import {
  Rerender,
  RerenderToggle,
  RerenderType,
} from "./contexts/rerenderToggle";
import { setUserContext, userContext } from "./contexts/userContext";
import "./index.css";
import BackgroundParticles from "./pages/BackgroundParticles";
import Landing from "./pages/Landing";
import Main from "./pages/main";
import { RerenderReason } from "./types/contexts/rerenderReasons";
import { NaivgationStage } from "./types/Stage";

/// Switch between main and landing with custom animation.
function App() {
  const [stage, setStage] = useState<NaivgationStage>("landing");

  const [user, setUser] = useState<User | null>(null);
  const setCurrentUser = useCallback((user: User | null) => {
    setUser(user);
  }, []);

  const [rerender, setRerender] = useState<RerenderType>({
    reason: RerenderReason.appStart,
    toggle: false,
  });
  const handleClearCanvasToggle = useCallback((reason: RerenderReason) => {
    setRerender((state) => (state = { ...state, reason: reason }));
  }, []);

  function changeNavigationStage() {
    setStage((curStage) => {
      return curStage === "landing" ? "main" : "landing";
    });
  }

  return (
    <div className="w-full h-full overflow-x-hidden bg-purple-dark">
      <section className="absolute w-full h-full">
        <BackgroundParticles stage={stage} />
      </section>
      <section className="absolute w-full h-full">
        {stage === "landing" ? (
          <Landing onBeginClicked={changeNavigationStage} />
        ) : (
          //TODO => animation or something.
          <userContext.Provider value={user}>
            <setUserContext.Provider value={setCurrentUser}>
              <Rerender.Provider value={rerender}>
                <RerenderToggle.Provider value={handleClearCanvasToggle}>
                  <Main />
                </RerenderToggle.Provider>
              </Rerender.Provider>
            </setUserContext.Provider>
          </userContext.Provider>
        )}
      </section>
    </div>
  );
}

export default App;
