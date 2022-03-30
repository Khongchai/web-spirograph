import React from "react";
import CycloidControlsData from "../../classes/CycloidControls";
import useForceUpdate from "../../utils/hooks/useForceUpdate";
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
          innerHTML="Animated"
          onClick={() => {
            cycloidControls.mode = "Animated";
            forceUpdate();
          }}
        />
        <SelectionButton
          blur={cycloidControls.mode !== "Instant"}
          innerHTML="Instant"
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
          innerHTML={"Showing"}
        />
        <SelectionButton
          blur={cycloidControls.scaffold !== "Hidden"}
          onClick={() => {
            cycloidControls.scaffold = "Hidden";
            forceUpdate();
          }}
          innerHTML={"Hidden"}
        />
      </SettingsContainer>
    </ControlSection>
  );
};

export default NonCycloidControls;
