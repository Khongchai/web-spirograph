import React from "react";
import CycloidControls from "../../types/cycloidControls";
import useForceUpdate from "../../utils/hooks/useForceUpdate";
import ContentContainer from "./shared/ContentContainer";
import ControlSection from "./shared/ControlSection";
import Heading from "./shared/heading";
import SelectionButton from "./shared/SelectionButton";

interface miscProps {
  cycloidControls: CycloidControls;
}

/*
    Control non-cycloid related params like animated or not and show or not show the scaffold.
*/
const NonCycloidControls: React.FC<miscProps> = ({ cycloidControls }) => {
  const forceUpdate = useForceUpdate();
  return (
    <ControlSection>
      <ContentContainer>
        <Heading>Mode</Heading>
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
        <Heading>Show Scaffold</Heading>
        <SelectionButton
          blur={cycloidControls.scaffold !== "Show"}
          onClick={() => {
            cycloidControls.scaffold = "Show";
          }}
          innerHTML="Show"
        />
        <SelectionButton
          blur={cycloidControls.scaffold !== "Hide"}
          onClick={() => {
            cycloidControls.scaffold = "Hide";
            forceUpdate();
          }}
          innerHTML="Hide"
        />
      </ContentContainer>
    </ControlSection>
  );
};

export default NonCycloidControls;
