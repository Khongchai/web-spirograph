import React from "react";
import CycloidControls from "../../types/cycloidControls";
import useForceUpdate from "../../utils/hooks/useForceUpdate";
import ContentContainer from "./shared/ControlContainer";
import ControlSection from "./shared/ControlSection";
import Heading from "./shared/heading";
import SelectionButton from "./shared/SelectionButton";
import Control from "./shared/control";

interface miscProps {
  cycloidControls: CycloidControls;
  modeTooltipText: string;
  showScaffoldTooltipText: string;
  clearCanvasTooltipText: string;
  clearCanvasToggle: () => void;
}

/*
    Control non-cycloid related params like animated or not and show or not show the scaffold.
*/
const NonCycloidControls: React.FC<miscProps> = ({
  cycloidControls,
  modeTooltipText,
  showScaffoldTooltipText,
  clearCanvasTooltipText,
  clearCanvasToggle,
}) => {
  const forceUpdate = useForceUpdate();
  return (
    <ControlSection>
      <ContentContainer>
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
      </ContentContainer>
      <ContentContainer>
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
      </ContentContainer>
    </ControlSection>
  );
};

export default NonCycloidControls;
