import { useState } from "react";
import Canvas from "./components/Canvas";
import "./index.css";
import useGetControlledCycloidParams from "./utils/useGetControlledCycloidParams";

function App() {
  const [clearCanvasToggle, setClearCanvasToggle] = useState(false);

  const cycloidParams = useGetControlledCycloidParams(setClearCanvasToggle);

  return (
    <div className="bg-purple-dark text-purple-light h-full w-full">
      <Canvas
        clearCanvasToggle={clearCanvasToggle}
        cycloidParams={cycloidParams}
      />
      <div>{/* <Controls /> */}</div>
    </div>
  );
}

export default App;
