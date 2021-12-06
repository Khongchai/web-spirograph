import { useState, useRef } from "react";
import Canvas from "./components/Canvas";
import "./index.css";
import useGetControlledCycloidParams from "./utils/hooks/useGetControlledCycloidParams";

function App() {
  const [clearCanvasToggle, setClearCanvasToggle] = useState(false);

  const cycloidParams = useGetControlledCycloidParams(setClearCanvasToggle);

  const showStructure = useRef(true);

  return (
    <div className="bg-purple-dark text-purple-light h-full w-full">
      <div className="z-20 fixed top-4 left-4">
        <button
          className="bg-purple-vivid px-4 py-2 rounded-md hover:opacity-80  
                            focus:outline-none focus:ring focus:border-purple-vivid"
          onClick={(e: any) => {
            showStructure.current = !showStructure.current;
            e.target.innerHTML = showStructure.current
              ? "Hide Structure"
              : "Show Structure";
          }}
        >
          Hide Structure
        </button>
      </div>
      <Canvas
        clearCanvasToggle={clearCanvasToggle}
        cycloidParams={cycloidParams}
        showStructure={showStructure}
      />
    </div>
  );
}

export default App;
