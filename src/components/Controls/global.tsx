import React from "react";
import CycloidControls from "../../types/cycloidControls";
import CycloidParams from "../../types/cycloidParams";
import useForceUpdate from "../../utils/hooks/useForceUpdate";
import Content from "./shared/content";
import ContentArray from "./shared/contentArray";
import ContentContainer from "./shared/ContentContainer";
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
          value={cycloidControls.animationSpeed}
        ></Content>
        <Content
          paramName={"Nested Level"}
          value={cycloidControls.nestedLevel}
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
