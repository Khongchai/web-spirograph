import React, { useState } from "react";
import "./index.css";
import Landing from "./pages/Landing";
import Main from "./pages/Main";

/// Switch between main and landing with custom animation.
function App() {
  return <Landing />;
  return <Main />;
}

export default App;
