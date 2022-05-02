import "./index.css";
import BackgroundParticles from "./pages/BackgroundParticles";
import Landing from "./pages/Landing";
import Main from "./pages/Main";

/// Switch between main and landing with custom animation.
function App() {
  return (
    <div className="w-full h-full">
      <section className="absolute w-full h-full">
        <BackgroundParticles />
      </section>
      <section className="absolute w-full h-full">
        <Landing />;
      </section>
    </div>
  );
  return <Main />;
}

export default App;
