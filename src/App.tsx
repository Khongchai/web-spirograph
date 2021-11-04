import React from "react";
import Canvas from "./components/Canvas";
import Controls from "./components/Controls";
import "./index.css";

function App() {
  return (
    <div className="bg-purple-dark text-purple-light h-full w-full">
      <Canvas />
      <div>{/* <Controls /> */}</div>
    </div>
  );
}

export default App;
