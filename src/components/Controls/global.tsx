import React from "react";
import CycloidControls from "../../types/cycloidControls";
import CycloidParams from "../../types/cycloidParams";
import useForceUpdate from "../../utils/hooks/useForceUpdate";
import Content from "./shared/control";
import ContentArray from "./shared/contentArray";
import ContentContainer from "./shared/ControlContainer";
import ControlSection from "./shared/ControlSection";
import Heading from "./shared/heading";

interface globalProps {
  cycloidControls: CycloidControls;
  forceParentUpdate: () => void;
  tooltipText: string;
  clearCanvasToggle: () => void;
}

const Global: React.FC<globalProps> = ({
  forceParentUpdate,
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
        <ContentArray
          paramName={"Current Cycloid"}
          values={cycloidControls.cycloids.map((_, i) => i)}
          index={cycloidControls.currentCycloid}
          onClick={(newIndex: number) => {
            cycloidControls.currentCycloid = newIndex;
            forceParentUpdate();
          }}
        />
      </ContentContainer>
    </ControlSection>
  );
};

export default Global;
