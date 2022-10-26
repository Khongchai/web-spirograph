import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { UserAuthenticationRepository } from "./classes/data/repository/userAuthenticationRepository";
import BoundingCircle from "./classes/domain/BoundingCircle";
import CycloidControls from "./classes/domain/cycloidControls";
import { User } from "./classes/domain/userData/User";
import colors from "./constants/colors";
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
import useMeHooks from "./utils/hooks/useMeHooks";

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
          <userContext.Provider value={user}>
            <setUserContext.Provider value={setCurrentUser}>
              <Rerender.Provider value={rerender}>
                <RerenderToggle.Provider value={handleClearCanvasToggle}>
                  <Main cycloidControls={cycloidControls} />
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
