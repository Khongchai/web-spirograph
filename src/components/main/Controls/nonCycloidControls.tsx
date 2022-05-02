import React from "react";
import CycloidControlsData from "../../../classes/cycloidControls";
import useForceUpdate from "../../../utils/hooks/useForceUpdate";
import SettingsContainer from "./shared/ControlContainer";
import ControlSection from "./shared/ControlSection";
import Heading from "./shared/heading";
import SelectionButton from "./shared/SelectionButton";
import Control from "./shared/control";

interface miscProps {
  cycloidControls: CycloidControlsData;
  modeTooltipText: string;
  showScaffoldTooltipText: string;
}

/*
    Control non-cycloid related params like animated or not and show or not show the scaffold.
*/
const NonCycloidControls: React.FC<miscProps> = ({
  cycloidControls,
  modeTooltipText,
  showScaffoldTooltipText,
}) => {
  const forceUpdate = useForceUpdate();
  return (
    <ControlSection>
      <SettingsContainer>
        <Heading tooltipText={modeTooltipText}>Mode</Heading>
        <SelectionButton
          blur={cycloidControls.mode !== "Animated"}
          text="Animated"
          onClick={() => {
            cycloidControls.mode = "Animated";
            forceUpdate();
          }}
        />
        <SelectionButton
          blur={cycloidControls.mode !== "Instant"}
          text="Instant"
          onClick={() => {
            cycloidControls.mode = "Instant";
            forceUpdate();
          }}
        />
      </SettingsContainer>
      <SettingsContainer>
        <Heading tooltipText={showScaffoldTooltipText}>Show Scaffold</Heading>
        <SelectionButton
          blur={cycloidControls.scaffold !== "Showing"}
          onClick={() => {
            cycloidControls.scaffold = "Showing";
            forceUpdate();
          }}
          text={"Showing"}
        />
        <SelectionButton
          blur={cycloidControls.scaffold !== "Hidden"}
          onClick={() => {
            cycloidControls.scaffold = "Hidden";
            forceUpdate();
          }}
          text={"Hidden"}
        />
      </SettingsContainer>
    </ControlSection>
  );
};

export default NonCycloidControls;
