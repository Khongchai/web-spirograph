import React, { MutableRefObject } from "react";
import CycloidControlsData from "../../../classes/domain/cycloidControls";
import useForceUpdate from "../../../utils/hooks/useForceUpdate";
import { NetworkErrorBoundary } from "../Shared/NetworkErrorBoundary";
import Global from "./global";
import Local from "./local";
import NonCycloidControls from "./nonCycloidControls";
import "./style.css";
import { UserDataControl } from "./userDataControl";

interface ControlsProps {
  cycloidControls: MutableRefObject<CycloidControlsData>;
}

const Controls: React.FC<ControlsProps> = ({ cycloidControls }) => {
  const id = cycloidControls.current.currentCycloidId;
  const cycloid =
    cycloidControls.current.cycloidManager.getSingleCycloidParamFromId(
      id.toString()
    );
  if (!cycloid) throw new Error(`Cycloid of id ${id} not found`);

  /**
   * This clears only this settings component tree.
   */
  const forceUpdateSettingsUI = useForceUpdate();

  return (
    <div className="all-container pl-4">
      <Local
        cycloidControls={cycloidControls.current}
        tooltipText="This controls cycloid-specific settings."
      />
      <Global
        cycloidControls={cycloidControls.current}
        tooltipText="This controls the global values, and unlike the cycloid-specific controls, these do not change with each cycloid."
        forceUpdateSettingsUI={forceUpdateSettingsUI}
      />
      <NonCycloidControls
        modeTooltipText="Controls the animation mode of the cycloid. 
        Animated mode will simulate a spinning cycloid at 60fps while the 
        instant mode draws a cycloid based on the given parameters instantly."
        showScaffoldTooltipText="When off, only the traced path will be shown."
        cycloidControls={cycloidControls.current}
      />
      <NetworkErrorBoundary>
        <UserDataControl
          cycloidControls={cycloidControls}
          tooltipText="Save the current configuration. If not logged in, this will save locally."
        />
      </NetworkErrorBoundary>
    </div>
  );
};

export default Controls;
