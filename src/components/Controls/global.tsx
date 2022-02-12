import React from "react";
import CycloidControls from "../../types/cycloidControls";
import ContentArray from "./shared/contentArray";
import Content from "./shared/control";
import ContentContainer from "./shared/ControlContainer";
import ControlSection from "./shared/ControlSection";
import Heading from "./shared/heading";

interface globalProps {
  cycloidControls: CycloidControls;
  tooltipText: string;
  clearCanvasToggle: () => void;
  forceUpdateSettingsUI: () => void;
}

const Global: React.FC<globalProps> = ({
  cycloidControls,
  tooltipText,
  clearCanvasToggle,
  forceUpdateSettingsUI,
}) => {
  return (
    <ControlSection>
      <Heading tooltipText={tooltipText}>Global</Heading>
      <ContentContainer>
        <Content
          paramName={"Animation Speed Scale"}
          numberValue={cycloidControls.animationSpeed}
          onDrag={(newValue: number) =>
            (cycloidControls.animationSpeed = newValue)
          }
        />
        <Content
          onClick={(newValue) =>
            (cycloidControls.clearTracedPathOnParamsChange = newValue)
          }
          paramName="Clear Traced Path on Params Change"
          booleanValue={cycloidControls.clearTracedPathOnParamsChange}
        />
        <Content
          onDrag={(newValue: number) => {
            cycloidControls.outerMostBoundingCircle.setRadius(newValue);
            clearCanvasToggle();
          }}
          numberValue={cycloidControls.outerMostBoundingCircle.getRadius()}
          paramName="Outer Bounding Circle Radius"
        />
        <Content
          onClick={(newValue) => {
            cycloidControls.showAllCycloids = newValue;
            clearCanvasToggle();
          }}
          paramName="Show all cycloids"
          booleanValue={cycloidControls.showAllCycloids}
        />
        <ContentArray
          paramName={"Current Cycloid"}
          values={cycloidControls.cycloids.map((_, i) => i)}
          index={cycloidControls.currentCycloid}
          onClick={(newIndex: number) => {
            cycloidControls.currentCycloid = newIndex;
            //If all are shown, there's no need to clear the canvas to repaint another one
            //We'll just need to update the settings UI
            if (!cycloidControls.showAllCycloids) {
              clearCanvasToggle();
            } else {
              forceUpdateSettingsUI();
            }
          }}
        />
      </ContentContainer>
    </ControlSection>
  );
};

export default Global;
