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
}

const Global: React.FC<globalProps> = ({
  forceParentUpdate,
  cycloidControls,
}) => {
  return (
    <ControlSection>
      <Heading>Global</Heading>
      <ContentContainer>
        <Content
          paramName={"Animation Speed Scale"}
          numberValue={cycloidControls.animationSpeed}
          onDrag={(newValue: number) =>
            (cycloidControls.animationSpeed = newValue)
          }
        ></Content>
        <Content
          onDrag={(newValue: number) =>
            (cycloidControls.animationSpeed = newValue)
          }
          paramName={"Nested Level"}
          numberValue={cycloidControls.nestedLevel}
        ></Content>
        <ContentArray
          paramName={"Current Cycloid"}
          values={cycloidControls.cycloids.map((_, i) => i)}
          index={cycloidControls.currentCycloid}
          onClick={(newIndex: number) => {
            cycloidControls.currentCycloid = newIndex;
            forceParentUpdate();
          }}
        ></ContentArray>
      </ContentContainer>
    </ControlSection>
  );
};

export default Global;
