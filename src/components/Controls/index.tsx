import React, { MutableRefObject } from "react";
import CycloidControls from "../../types/cycloidControls";
import useForceUpdate from "../../utils/hooks/useForceUpdate";
import Global from "./global";
import Local from "./local";
import NonCycloidControls from "./nonCycloidControls";
import "./style.css";

interface ControlsProps {
  cycloidControls: MutableRefObject<CycloidControls>;
}

const Controls: React.FC<ControlsProps> = ({ cycloidControls }) => {
  const i = cycloidControls.current.currentCycloid;
  const cycloid = cycloidControls.current.cycloids[i];

  const forceUpdate = useForceUpdate();

  return (
    <div
      className="all-container"
      style={{ paddingTop: "75px", paddingLeft: "75px" }}
    >
      <Local
        cycloid={cycloid}
        tooltipText="This controls cycloid-specific settings."
      />
      <Global
        forceParentUpdate={forceUpdate}
        cycloidControls={cycloidControls.current}
        tooltipText="This controls the global values, and unlike the cycloid-specific controls, these do not change with each cycloid."
      />
      <NonCycloidControls
        modeTooltipText="Controls the animation mode of the cycloid. 
        Animated mode will simulate a spinning cycloid at 60fps while the 
        instant mode draws a cycloid based on the given parameters instantly."
        showScaffoldTooltipText="When off, only the traced path will be shown."
        cycloidControls={cycloidControls.current}
      />
    </div>
  );
};

export default Controls;
