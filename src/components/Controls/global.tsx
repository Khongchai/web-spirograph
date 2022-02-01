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
}

const Global: React.FC<globalProps> = ({
  cycloidControls,
  tooltipText,
  clearCanvasToggle,
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
          registerChangeOnlyOnMouseUp={false}
        />
        <Content
          onDrag={(newValue: number) =>
            (cycloidControls.nestedLevel = newValue)
          }
          paramName={"Nested Level"}
          step={1}
          numberValue={cycloidControls.nestedLevel}
          registerChangeOnlyOnMouseUp={false}
        />
        <Content
          onClick={(newValue) =>
            (cycloidControls.clearTracedPathOnParamsChange = newValue)
          }
          paramName="Clear Traced Path on Params Change"
          booleanValue={cycloidControls.clearTracedPathOnParamsChange}
        />
        <Content
          onClick={(newValue) =>
            (cycloidControls.registerChangeOnlyOnMouseUp = newValue)
          }
          paramName="Register Change only on MouseUp"
          booleanValue={cycloidControls.registerChangeOnlyOnMouseUp}
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
            clearCanvasToggle();
          }}
        />
      </ContentContainer>
    </ControlSection>
  );
};

export default Global;
