import React, { MutableRefObject } from "react";
import CycloidControls from "../../types/cycloidControls";
import useForceUpdate from "../../utils/hooks/useForceUpdate";
import Global from "./global";
import Local from "./local";
import NonCycloidControls from "./nonCycloidControls";
import "./style.css";

interface ControlsProps {
  cycloidControls: MutableRefObject<CycloidControls>;
  clearCanvasToggle: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  cycloidControls,

  /**
   * Clear canvas toggle will clear everything, including this settings component
   */
  clearCanvasToggle,
}) => {
  const i = cycloidControls.current.currentCycloid;
  const cycloid = cycloidControls.current.cycloids[i];

  /**
   * This clears only this settings component tree.
   */
  const forceUpdateSettingsUI = useForceUpdate();

  return (
    <div className="all-container">
      <Local
        cycloid={cycloid}
        tooltipText="This controls cycloid-specific settings."
        clearCanvasToggle={clearCanvasToggle}
      />
      <Global
        cycloidControls={cycloidControls.current}
        tooltipText="This controls the global values, and unlike the cycloid-specific controls, these do not change with each cycloid."
        clearCanvasToggle={clearCanvasToggle}
        forceUpdateSettingsUI={forceUpdateSettingsUI}
      />
      <NonCycloidControls
        modeTooltipText="Controls the animation mode of the cycloid. 
        Animated mode will simulate a spinning cycloid at 60fps while the 
        instant mode draws a cycloid based on the given parameters instantly."
        showScaffoldTooltipText="When off, only the traced path will be shown."
        clearCanvasTooltipText="Whether or not to clear the canvas when some params change. Switch this to true might give some interesting effects."
        cycloidControls={cycloidControls.current}
        clearCanvasToggle={clearCanvasToggle}
      />
    </div>
  );
};

export default Controls;
